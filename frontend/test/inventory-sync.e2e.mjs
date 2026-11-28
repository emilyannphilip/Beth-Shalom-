import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE || "playwright-core",
);
const portal = new URL(process.env.TEST_PORTAL_ORIGIN);
const database = new URL(process.env.DATABASE_URL);
const origin = portal.origin;
const versioned = origin + "/api/v1";
const csrf = { Origin: origin, "X-Beth-Shalom-CSRF": "1" };

test(
  "inventory stays synchronized across Admin, Staff and the public catalogue",
  { timeout: 240000 },
  async (t) => {
    assert(["localhost", "127.0.0.1", "[::1]"].includes(portal.hostname));
    assert(["localhost", "127.0.0.1", "[::1]"].includes(database.hostname));
    assert.equal(database.pathname, "/beth_shalom_test");
    const browser = await chromium.launch({
      executablePath: process.env.BROWSER_EXECUTABLE,
    });
    t.after(async () => browser.close());
    const errors = [];
    const clients = {};
    for (const key of ["visitor", "admin", "staff"]) {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 960 },
        ignoreHTTPSErrors: portal.protocol === "https:",
      });
      await context.route("**/*", (route) =>
        new URL(route.request().url()).origin === origin
          ? route.continue()
          : route.abort(),
      );
      await context.addInitScript(() =>
        sessionStorage.setItem("beth-shalom-enquiry-shown", "1"),
      );
      const page = await context.newPage();
      page.setDefaultTimeout(45000);
      page.on("pageerror", (error) => errors.push(error.message));
      clients[key] = { context, page };
    }
    const button = (scope, name) =>
      scope.getByRole("button", { name, exact: true });
    const open = (page, path) =>
      page.goto(origin + path, { waitUntil: "domcontentloaded" });
    async function api(context, method, path, data, expected = 200) {
      const response = await context.request.fetch(versioned + path, {
        method,
        data,
        headers: csrf,
      });
      assert.equal(response.status(), expected, method + " " + path);
      return response.json();
    }
    async function signIn(key) {
      const { page } = clients[key];
      const role = key.toUpperCase();
      const ready = page.waitForResponse(
        (response) => response.url() === versioned + "/auth/session",
      );
      await open(page, "/portal/login");
      await ready;
      await page
        .getByRole("textbox", { name: "Username / Staff ID" })
        .fill(process.env["DEV_" + role + "_USERNAME"]);
      await page
        .locator('input[autocomplete="current-password"]')
        .fill(process.env["TEST_" + role + "_PASSWORD"]);
      const sent = page.waitForResponse(
        (response) => response.url() === versioned + "/auth/login",
      );
      await button(page, "Sign In to Portal").click();
      assert.equal((await sent).status(), 200);
      await page.waitForURL("**/portal/" + key);
    }
    const { visitor, staff, admin } = clients;
    const available = () => api(visitor.context, "GET", "/public/availability");
    const card = (name) =>
      visitor.page.getByRole("article").filter({
        has: visitor.page.getByRole("heading", { name, exact: true }),
      });
    const count = (name, label, number) =>
      card(name)
        .getByText(new RegExp(label + "\\s+" + number + "\\b"))
        .first()
        .waitFor();
    const publicBefore = await available();
    const nest = publicBefore.find((row) => row.category_code === "NEST");
    const dorm = publicBefore.find((row) => row.category_code === "DORM");
    assert.equal(nest.total_rooms, 16);
    assert.equal(
      dorm.dormitories.find((row) => row.name === "Dormitory").total_beds,
      16,
    );
    assert.equal(nest.floors[0].floor_number, 3);
    for (const key of ["HEAVEN", "AURA", "VISTA", "HARMONY", "GRANDE"])
      assert(publicBefore.some((row) => row.category_code === key));

    await open(visitor.page, "/rooms");
    await count("Nest", "Completely vacant rooms", nest.available_rooms);
    for (const width of [390, 820, 1440]) {
      await visitor.page.setViewportSize({ width, height: 960 });
      const box = await card("Nest").boundingBox();
      assert(box && box.width > 0 && box.x + box.width <= width + 1);
    }
    const roomCards = visitor.page.locator("#spaces-grid").getByRole("article");
    const roomCategories = publicBefore.filter(
      (row) => row.accommodation_type === "ROOM",
    );
    assert.equal(await roomCards.count(), roomCategories.length);
    assert.equal(await button(roomCards, "Apply").count(), 0);
    assert.equal(
      await button(roomCards, "View Details").count(),
      roomCategories.length,
    );
    await button(card("Nest"), "View Details").click();
    const preview = visitor.page.getByRole("dialog", {
      name: "Nest",
      exact: true,
    });
    await preview
      .getByText(nest.available_rooms + " of " + nest.total_rooms + " rooms vacant", {
        exact: false,
      })
      .waitFor();
    await button(preview, "Apply for This Room Category").click();
    const application = visitor.page.getByRole("dialog", {
      name: "Apply for This Room Category",
    });
    assert.equal(
      await application.getByLabel("Room Category").inputValue(),
      "Nest",
    );
    await button(application, "Cancel").click();
    await application.waitFor({ state: "hidden" });
    await button(preview, "Close Preview").click();
    await preview.waitFor({ state: "hidden" });
    await button(card("Dormitory"), "Enquire").click();
    const form = visitor.page.getByRole("dialog", {
      name: "Enquire About Dormitory Accommodation",
    });
    const key = randomUUID().slice(0, 8);
    await form.getByLabel("Full Name").fill("Fictional applicant " + key);
    await form
      .getByLabel("Email Address")
      .fill("fixture-" + key + "@example.test");
    await form.getByLabel("Phone Number").fill("+919876543210");
    await form
      .getByLabel("Enquiry details")
      .fill("Synthetic dormitory enquiry.");
    const sent = visitor.page.waitForResponse(
      (res) =>
        res.url() === versioned + "/public/enquiries" &&
        res.request().method() === "POST",
    );
    await button(form, "Submit Enquiry").click();
    const response = await sent;
    assert.equal(response.status(), 201);
    const enquiry = await response.json();
    await form.getByText("Reference " + enquiry.enquiry_number + ".").waitFor();
    await button(form, "Done").click();

    await signIn("admin");
    await signIn("staff");
    for (const role of [admin, staff]) {
      const saved = await api(role.context, "GET", "/enquiries/" + enquiry.id);
      assert.equal(saved.details.accommodation_category_id, dorm.category_id);
      assert.equal(saved.source_form, "DORMITORY_ENQUIRY");
    }

    await open(admin.page, "/portal/admin/residents");
    await button(admin.page, "+ Add Resident").click();
    const admission = admin.page.getByRole("dialog", {
      name: "New Resident Admission",
    });
    const name = "Fictional Admission " + key;
    await admission.getByLabel("Resident name").fill(name);
    await admission.getByLabel("Gender").fill("Female");
    await admission.getByLabel("Contact number").fill("+919876543210");
    await admission.getByLabel("Date of birth").fill("1950-01-01");
    await admission.getByLabel("Admission date").fill("2025-01-01");
    await admission
      .getByLabel("Accommodation category")
      .selectOption({ label: "Nest" });
    await admission
      .getByRole("combobox", { name: /^Floor\b/ })
      .selectOption("3");
    await admission.getByLabel("Room number").selectOption({ label: "N-301" });
    await button(admission, "Review admission").click();
    await admission
      .getByRole("region", { name: "Admission review" })
      .getByText(name)
      .waitFor();
    const admissionSaved = admin.page.waitForResponse(
      (res) =>
        res.url() === versioned + "/residents" &&
        res.request().method() === "POST",
    );
    await button(admission, "Confirm admission and allocation").click();
    const admissionResponse = await admissionSaved;
    assert.equal(admissionResponse.status(), 201);
    const resident = await admissionResponse.json();
    const room = (
      await api(staff.context, "GET", "/rooms?search=N-301&floor=3")
    ).data[0];
    const nextRoom = (
      await api(staff.context, "GET", "/rooms?search=N-302&floor=3")
    ).data[0];
    const bed = (
      await api(staff.context, "GET", "/beds?search=D-01")
    ).data.find((row) => row.bed_number === "D-01");
    assert.equal(resident.allocation.room_id, room.id);
    await visitor.page.bringToFront();
    await count("Nest", "Completely vacant rooms", nest.available_rooms - 1);
    const rejected = "Fixture Overbook " + key;
    await api(
      admin.context,
      "POST",
      "/residents",
      {
        full_name: rejected,
        date_of_birth: "1950-01-01",
        admission_date: "2025-01-01",
        accommodation: { room_id: room.id },
      },
      409,
    );
    assert.equal(
      (
        await api(
          admin.context,
          "GET",
          "/residents?search=" + encodeURIComponent(rejected),
        )
      ).total,
      0,
    );
    assert(!JSON.stringify(await available()).includes(name));

    const staffRoom = await api(
      staff.context,
      "POST",
      "/allocations/" + resident.allocation.id + "/transfer",
      { room_id: nextRoom.id },
      201,
    );
    const staffBed = await api(
      staff.context,
      "POST",
      "/allocations/" + staffRoom.id + "/transfer",
      { bed_id: bed.id },
      201,
    );
    assert.equal(staffBed.bed_id, bed.id);
    await count("Nest", "Completely vacant rooms", nest.available_rooms);
    await count("Dormitory", "Available beds", 15);
    await api(
      staff.context,
      "PATCH",
      "/beds/" + bed.id,
      { operational_status: "MAINTENANCE" },
      409,
    );
    await api(
      admin.context,
      "POST",
      "/residents/" + resident.id + "/discharge",
      {},
      201,
    );
    await count("Dormitory", "Available beds", 16);
    assert(
      (
        await api(staff.context, "GET", "/allocations/history?bedId=" + bed.id)
      ).data.some((row) => row.action === "TRANSFER"),
    );

    const binding = {
      enquiry_id: enquiry.id,
      bed_id: bed.id,
      reservation_start: new Date(Date.now() + 3600000).toISOString(),
      reservation_end: new Date(Date.now() + 7200000).toISOString(),
    };
    const reservation = await api(
      staff.context,
      "POST",
      "/reservations",
      binding,
      201,
    );
    assert.equal(
      (await available())
        .find((row) => row.category_code === "DORM")
        .dormitories.find((row) => row.name === "Dormitory").available_beds,
      16,
    );
    await api(
      staff.context,
      "POST",
      "/reservations/" + reservation.id + "/confirm",
      {},
      201,
    );
    await count("Dormitory", "Available beds", 15);
    await api(
      staff.context,
      "POST",
      "/reservations/" + reservation.id + "/cancel",
      {},
      201,
    );
    await count("Dormitory", "Available beds", 16);

    const expiring = await api(
      staff.context,
      "POST",
      "/reservations",
      {
        enquiry_id: enquiry.id,
        bed_id: bed.id,
        reservation_start: new Date(Date.now() + 1000).toISOString(),
        reservation_end: new Date(Date.now() + 22000).toISOString(),
      },
      201,
    );
    await api(
      staff.context,
      "POST",
      "/reservations/" + expiring.id + "/confirm",
      {},
      201,
    );
    await count("Dormitory", "Available beds", 15);
    await count("Dormitory", "Available beds", 16);

    const category = await api(
      staff.context,
      "POST",
      "/accommodation-categories",
      {
        category_name: "Fictional catalogue " + key,
        category_code: "CAT-" + key,
        accommodation_type: "ROOM",
        default_capacity: 1,
      },
      201,
    );
    const newRoom = await api(
      staff.context,
      "POST",
      "/rooms",
      {
        room_number: "CAT-" + key,
        category_id: category.id,
        building_id: room.building_id,
        capacity: 1,
        floor_number: 3,
        operational_status: "INACTIVE",
      },
      201,
    );
    const changedName = "Edited catalogue " + key;
    await api(
      staff.context,
      "PATCH",
      "/accommodation-categories/" + category.id,
      {
        category_name: changedName,
        description: "Synthetic catalogue entry for the browser suite.",
      },
    );
    await card(changedName)
      .getByText("Currently Unavailable", { exact: true })
      .waitFor();
    await count(changedName, "Completely vacant rooms", 0);
    await api(staff.context, "PATCH", "/rooms/" + newRoom.id, {
      operational_status: "ACTIVE",
    });
    await count(changedName, "Completely vacant rooms", 1);

    await open(staff.page, "/portal/staff/rooms");
    await button(staff.page, "Rooms").click();
    await staff.page.getByLabel("Filter by floor").selectOption("3");
    await staff.page
      .getByRole("searchbox", { name: "Search records" })
      .fill("N-301");
    await button(staff.page, "Grid view").click();
    const tile = staff.page.getByRole("article").filter({ hasText: "N-301" });
    for (const width of [390, 820, 1440]) {
      await staff.page.setViewportSize({ width, height: 960 });
      const box = await tile.boundingBox();
      assert(box && box.width > 0 && box.x + box.width <= width + 1);
    }
    await button(tile, "Change status for N-301").click();
    const maintenance = staff.page.getByRole("dialog", {
      name: "Change status for N-301",
    });
    await maintenance
      .getByLabel("Operational status")
      .selectOption("MAINTENANCE");
    const update = staff.page.waitForResponse(
      (res) =>
        res.url() === versioned + "/rooms/" + room.id &&
        res.request().method() === "PATCH",
    );
    await button(maintenance, "Update").click();
    assert.equal((await update).status(), 200);
    await maintenance.waitFor({ state: "hidden" });
    await visitor.page.bringToFront();
    await count("Nest", "Completely vacant rooms", nest.available_rooms - 1);
    await api(staff.context, "PATCH", "/rooms/" + room.id, {
      operational_status: "ACTIVE",
    });
    await count("Nest", "Completely vacant rooms", nest.available_rooms);
    assert.deepEqual(errors, []);
  },
);
