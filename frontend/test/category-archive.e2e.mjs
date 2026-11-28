import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE || "playwright-core",
);
const site = new URL(process.env.TEST_PORTAL_ORIGIN);

test(
  "Staff and Admin can resolve category dependency conflicts in the portal",
  { timeout: 220000 },
  async (t) => {
    assert(
      ["127.0.0.1", "localhost", "[::1]"].includes(site.hostname),
      "Use isolated loopback services",
    );
    const browser = await chromium.launch({
      executablePath: process.env.BROWSER_EXECUTABLE,
    });
    t.after(() => browser.close());
    const context = await browser.newContext({
      ignoreHTTPSErrors: site.protocol === "https:",
      viewport: { width: 1200, height: 900 },
    });
    const page = await context.newPage();
    page.setDefaultTimeout(50000);
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    const root = "/api/v1";
    const categoryPath = "/accommodation-categories";
    const open = (route) =>
      page.goto(new URL(route, site).href, {
        waitUntil: "domcontentloaded",
        timeout: 90_000,
      });
    const dialog = (name) => page.getByRole("dialog", { name, exact: true });
    const button = (scope, name) =>
      scope.getByRole("button", { name, exact: true });
    const row = (label) => page.getByRole("row").filter({ hasText: label });
    const search = (label) =>
      page.getByRole("searchbox", { name: "Search records" }).fill(label);
    const key = randomUUID().slice(0, 8);
    const sourceName = "Archive source " + key;
    const targetName = "Archive target " + key;
    const roomNumber = "E2E-" + key;

    async function api(method, route, data, expected = 200) {
      const response = await context.request.fetch(
        new URL(root + route, site).href,
        {
          method,
          data,
          headers: { Origin: site.origin, "X-Beth-Shalom-CSRF": "1" },
        },
      );
      assert.equal(response.status(), expected, method + " " + route);
      return response.json();
    }
    async function login(role) {
      await open("/portal/login");
      await page
        .getByRole("textbox", { name: "Username / Staff ID" })
        .fill(process.env["DEV_" + role + "_USERNAME"]);
      await page
        .locator('input[autocomplete="current-password"]')
        .fill(process.env["TEST_" + role + "_PASSWORD"]);
      await button(page, "Sign In to Portal").click();
      await page.waitForURL("**/portal/" + role.toLowerCase());
      await open("/portal/" + role.toLowerCase() + "/rooms");
      await page
        .getByRole("heading", { name: "Room Management", exact: true })
        .waitFor();
    }
    function createCategory(name, code) {
      return api(
        "POST",
        categoryPath,
        {
          category_name: name,
          category_code: code + key,
          accommodation_type: "ROOM",
          default_capacity: 2,
        },
        201,
      );
    }
    async function reviewCategory(name) {
      await search(name);
      await button(row(name), "Archive " + name).click();
      return dialog("Archive " + name);
    }

    await login("STAFF");
    const source = await createCategory(sourceName, "SRC-");
    const target = await createCategory(targetName, "DST-");
    const building = await api(
      "POST",
      "/buildings",
      {
        building_name: "Synthetic conflict building " + key,
        building_code: "E2E-" + key,
      },
      201,
    );
    await open("/portal/staff/rooms");
    const sourceDialog = await reviewCategory(sourceName);
    await sourceDialog.getByText("0 rooms · 0 dormitories").waitFor();

    // Another request adds inventory after the portal loaded its confirmation.
    const room = await api(
      "POST",
      "/rooms",
      {
        room_number: roomNumber,
        capacity: 2,
        category_id: source.id,
        building_id: building.id,
      },
      201,
    );
    const conflict = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname ===
          root + categoryPath + "/" + source.id &&
        response.request().method() === "DELETE",
    );
    await button(sourceDialog, "Archive category").click();
    assert.equal((await conflict).status(), 409);
    await sourceDialog
      .getByRole("alert")
      .filter({
        hasText:
          "Unable to delete this accommodation category because active rooms or dormitories are associated with it.",
      })
      .waitFor();
    await sourceDialog.getByText("1 room · 0 dormitories").waitFor();
    assert.equal(
      await page
        .getByText("Accommodation category archived.", { exact: true })
        .count(),
      0,
    );
    await sourceDialog
      .getByRole("checkbox", { name: new RegExp(roomNumber) })
      .check();
    await sourceDialog
      .getByLabel("Destination category")
      .selectOption({ label: targetName });
    await button(sourceDialog, "Reassign selected").click();
    await sourceDialog.getByText("Selected inventory reassigned.").waitFor();
    await sourceDialog.getByText("0 rooms · 0 dormitories").waitFor();
    await button(sourceDialog, "Archive category").click();
    await sourceDialog.waitFor({ state: "hidden" });
    await page
      .getByText("Accommodation category archived.", { exact: true })
      .waitFor();
    await row(sourceName).waitFor({ state: "hidden" });
    const available = await api("GET", "/public/availability");
    assert(!available.some((entry) => entry.category_id === source.id));
    assert.equal(
      available.find((entry) => entry.category_id === target.id)
        .available_rooms,
      1,
    );

    await open("/portal/logout");
    await button(page, "Sign Out Now").click();
    await page.waitForURL("**/portal/login");
    await login("ADMIN");
    const targetDialog = await reviewCategory(targetName);
    await targetDialog.getByText("1 room · 0 dormitories").waitFor();
    await button(targetDialog, "Deactivate category").click();
    await targetDialog
      .getByText("Accommodation category deactivated.")
      .waitFor();
    await button(targetDialog, "Close").click();
    await row(targetName).getByText("Inactive", { exact: true }).waitFor();
    assert(
      !(await api("GET", "/public/availability")).some(
        (entry) => entry.category_id === target.id,
      ),
    );

    await button(page, "Rooms").click();
    await search(roomNumber);
    await button(row(roomNumber), "Archive " + roomNumber).click();
    const roomDialog = dialog("Archive " + roomNumber);
    await button(roomDialog, "Archive").click();
    await roomDialog.waitFor({ state: "hidden" });
    await row(roomNumber).waitFor({ state: "hidden" });
    await button(page, "Room Categories").click();
    const finalDialog = await reviewCategory(targetName);
    await button(finalDialog, "Archive category").click();
    await finalDialog.waitFor({ state: "hidden" });
    await row(targetName).waitFor({ state: "hidden" });
    await api("GET", "/rooms/" + room.id, undefined, 404);
    assert.deepEqual(pageErrors, []);
  },
);
