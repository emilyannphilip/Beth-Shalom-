import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { join } from "node:path";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";

const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE || "playwright-core",
);
const { Pool } = require("pg");
const portal = new URL(process.env.TEST_PORTAL_ORIGIN);
const database = new URL(process.env.DATABASE_URL);
const loopback = ["127.0.0.1", "localhost", "[::1]"];
const topic = "Care & Support for Differently-Abled Children";
const categoryName = "Differently-Abled Support Living";

test(
  "the Home support enquiry is responsive and reaches both portals",
  { timeout: 180000 },
  async (t) => {
    assert(
      loopback.includes(portal.hostname) &&
        loopback.includes(database.hostname),
    );
    assert.equal(database.pathname, "/beth_shalom_test");
    const browser = await chromium.launch({
      executablePath: process.env.BROWSER_EXECUTABLE,
    });
    t.after(() => browser.close());
    const context = await browser.newContext({
      ignoreHTTPSErrors: portal.protocol === "https:",
      viewport: { width: 1440, height: 960 },
    });
    // Keep loopback checks independent of external images and font servers.
    await context.route("https://**/*", (route) =>
      new URL(route.request().url()).origin === portal.origin
        ? route.continue()
        : route.abort(),
    );
    const page = await context.newPage();
    page.setDefaultTimeout(40000);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const open = (path) =>
      page.goto(new URL(path, portal).href, { waitUntil: "domcontentloaded" });
    const api = (path) => new URL("/api/v1" + path, portal).href;
    const button = (scope, name) =>
      scope.getByRole("button", { name, exact: true });
    const suffix = randomUUID().slice(0, 8);
    const guardian = "Fictional Guardian " + suffix;
    const child = "Fictional Child " + suffix;
    const accommodation = "A dormitory option for our family.";
    const support = "A consistent daily routine would help.";
    const followUp = "Synthetic consultation follow-up " + suffix;

    assert.equal((await open("/")).status(), 200);
    const welcome = page
      .locator("dialog")
      .filter({ has: page.locator("#enquiry-welcome-modal") });
    const welcomeClose = page.locator("#enquiry-close");
    await welcomeClose.waitFor({ timeout: 15000 }).catch(async (error) => {
      const state = await page.evaluate(() => ({
        ready: document.readyState,
        welcomeShown: sessionStorage.getItem("beth-shalom-enquiry-shown"),
        openDialogs: document.querySelectorAll("dialog[open]").length,
      }));
      throw Error(
        error.message +
          " Browser state " +
          JSON.stringify({ ...state, pageErrors: errors }),
      );
    });
    await welcomeClose.click();
    await welcome.waitFor({ state: "hidden" });
    assert.equal(
      await page
        .getByRole("link", { name: "Explore Living Spaces" })
        .getAttribute("href"),
      "/rooms",
    );
    assert.equal(
      await page
        .getByRole("link", { name: "Take a Virtual Tour" })
        .getAttribute("href"),
      "#home-virtual-tour",
    );
    const section = page.getByRole("region", { name: topic });
    const heading = section.getByRole("heading", { name: topic, exact: true });
    const photo = section.getByRole("img");
    const cta = button(section, "Enquire Now");
    assert.equal(
      await section.evaluate((element) => element.nextElementSibling?.id),
      "home-living-spaces",
    );
    await page
      .getByRole("heading", { name: "Thoughtfully Planned Living Spaces" })
      .waitFor();
    for (const width of [1440, 820, 390]) {
      await page.setViewportSize({ width, height: 960 });
      await photo.scrollIntoViewIfNeeded();
      const renderedWidth = await photo.evaluate(async (element) => {
        await element.decode();
        return element.naturalWidth;
      });
      assert(renderedWidth >= 320);
      const imageBox = await photo.boundingBox();
      const headingBox = await heading.boundingBox();
      assert(imageBox && headingBox);
      assert(imageBox.x >= 0 && imageBox.x + imageBox.width <= width + 1);
      assert(
        width >= 1024 ? imageBox.x < headingBox.x : imageBox.y > headingBox.y,
      );
      if (process.env.TEST_SCREENSHOT_DIR)
        await section.screenshot({
          path: join(
            process.env.TEST_SCREENSHOT_DIR,
            "support-" + width + ".png",
          ),
        });
    }

    const categories = await (
      await context.request.get(api("/public/enquiry-categories"))
    ).json();
    const category = categories.find((row) => row.name === categoryName);
    assert(category);
    const body = {
      source_form: "HOME_CHILDREN_SUPPORT",
      category_id: category.id,
      original_topic: topic,
      applicant_name: guardian,
      phone: "+919876543210",
      email: "synthetic-" + suffix + "@example.test",
      message: "Please contact us to arrange a consultation.",
      child_support: { accommodation_requirements: accommodation },
      details: { contact_consent: true },
    };
    const invalid = (data) =>
      context.request.post(api("/public/enquiries"), { data });
    assert.equal(
      (
        await invalid({ ...body, details: { contact_consent: false } })
      ).status(),
      400,
    );
    assert.equal(
      (
        await invalid({
          ...body,
          category_id: categories.find((row) => row.id !== category.id).id,
        })
      ).status(),
      400,
    );
    assert.equal(
      (
        await invalid({
          ...body,
          child_support: { accommodation_requirements: "   " },
        })
      ).status(),
      400,
    );

    const dialog = page.getByRole("dialog", {
      name: "Enquire About Care & Support",
    });
    await cta.click();
    await dialog.getByLabel("Parent / Guardian Name").waitFor();
    assert(
      await dialog
        .getByLabel("Parent / Guardian Name")
        .evaluate((field) => document.activeElement === field),
    );
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    assert(await cta.evaluate((element) => document.activeElement === element));
    await cta.click();
    await dialog.getByLabel("Parent / Guardian Name").fill(guardian);
    await dialog.getByLabel(/Child.s Name/).fill(child);
    await dialog.getByLabel(/Child.s Age/).fill("8");
    await dialog.getByLabel("Contact Number").fill(body.phone);
    await dialog.getByLabel("Email Address").fill(body.email);
    await dialog.getByLabel("Accommodation Requirements").fill(accommodation);
    await dialog.getByLabel(/Care and Support Requirements/).fill(support);
    await dialog.getByLabel("Additional Message").fill(body.message);
    const submit = button(dialog, "Submit Enquiry");
    let submitted = 0;
    page.on("request", (request) => {
      if (
        request.url() === api("/public/enquiries") &&
        request.method() === "POST"
      )
        submitted++;
    });
    await submit.click();
    assert(
      await dialog
        .getByRole("checkbox")
        .evaluate((checkbox) => checkbox.validity.valueMissing),
    );
    assert.equal(submitted, 0);
    await dialog.getByRole("checkbox").check();

    const unavailable = async (route) => {
      await delay(600);
      await route.fulfill({
        status: 503,
        json: { message: "The enquiry service is temporarily unavailable." },
      });
    };
    await page.route(api("/public/enquiries"), unavailable);
    await submit.click();
    await dialog
      .getByRole("status")
      .getByText("Sending your request…")
      .waitFor();
    await dialog
      .getByRole("alert")
      .getByText("The enquiry service is temporarily unavailable.")
      .waitFor();
    assert(await submit.isEnabled());
    await page.unroute(api("/public/enquiries"), unavailable);

    const posting = page.waitForResponse(
      (response) =>
        response.url() === api("/public/enquiries") &&
        response.request().method() === "POST",
    );
    await submit.click();
    const response = await posting;
    assert.equal(response.status(), 201);
    const receipt = await response.json();
    await dialog.getByRole("heading", { name: "Enquiry received" }).waitFor();
    await dialog
      .getByText("Reference " + receipt.enquiry_number + ".")
      .waitFor();
    await button(dialog, "Done").click();
    await dialog.waitFor({ state: "hidden" });

    const pool = new Pool({ connectionString: database.href });
    t.after(() => pool.end());
    const result = await pool.query(
      "SELECT e.source_form,e.original_topic,c.name,e.message,d.age,d.care_requirement,d.contact_consent,d.consent_at,d.medical_notes FROM enquiries e JOIN enquiry_categories c ON c.id=e.category_id JOIN enquiry_details d ON d.enquiry_id=e.id WHERE e.id=$1",
      [receipt.id],
    );
    const stored = result.rows[0];
    assert.equal(stored.source_form, "HOME_CHILDREN_SUPPORT");
    assert.equal(stored.original_topic, topic);
    assert.equal(stored.name, categoryName);
    assert.equal(stored.age, 8);
    assert.equal(stored.care_requirement, support);
    assert.equal(stored.contact_consent, true);
    assert(stored.consent_at);
    assert.equal(stored.medical_notes, null);
    for (const entry of [child, accommodation, body.message])
      assert(stored.message.includes(entry));

    await page.setViewportSize({ width: 1440, height: 960 });
    async function viewInPortal(role) {
      const ready = page.waitForResponse((reply) => reply.url() === api("/auth/session"));
      await open("/portal/login");
      assert.equal((await ready).status(), 200);
      await page
        .getByRole("textbox", { name: "Username / Staff ID" })
        .fill(process.env["DEV_" + role + "_USERNAME"]);
      await page
        .locator('input[autocomplete="current-password"]')
        .fill(process.env["TEST_" + role + "_PASSWORD"]);
      const login = page.waitForResponse((reply) => reply.url() === api("/auth/login"));
      await button(page, "Sign In to Portal").click();
      const signedIn = await login;
      assert.equal(signedIn.status(), 200);
      assert.equal((await signedIn.json()).role, role.toLowerCase());
      await page.waitForURL("**/portal/" + role.toLowerCase());
      await page
        .getByRole("searchbox", { name: "Search enquiries" })
        .fill(receipt.enquiry_number);
      const row = page
        .getByRole("row")
        .filter({ hasText: receipt.enquiry_number });
      await row.getByText(guardian).waitFor();
      await button(row, "View").click();
      const enquiry = page.getByRole("dialog", { name: guardian });
      for (const value of [
        child,
        accommodation,
        body.message,
        support,
        "Source Home page · " + topic,
      ])
        await enquiry.getByText(value, { exact: false }).first().waitFor();
      return enquiry;
    }
    const staff = await viewInPortal("STAFF");
    await staff
      .getByLabel("Update enquiry status")
      .selectOption({ label: "Pending" });
    await staff.getByLabel("Follow-up remarks").fill(followUp);
    await button(staff, "Save & Finalize Status").click();
    await staff.waitFor({ state: "hidden" });
    await open("/portal/logout");
    await button(page, "Sign Out Now").click();
    await page.waitForURL("**/portal/login");
    const admin = await viewInPortal("ADMIN");
    await admin.getByText(followUp, { exact: false }).waitFor();
    assert.deepEqual(errors, []);
  },
);
