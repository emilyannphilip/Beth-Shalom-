import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE || "playwright-core",
);
const portal = new URL(process.env.TEST_PORTAL_ORIGIN);
const database = new URL(process.env.DATABASE_URL);
const versioned = portal.origin + "/api/v1";
const csrf = { Origin: portal.origin, "X-Beth-Shalom-CSRF": "1" };

test(
  "Admin and Staff edit named units and synchronize public availability",
  { timeout: 180000 },
  async (t) => {
    const loopback = ["127.0.0.1", "localhost", "[::1]"];
    assert(
      loopback.includes(portal.hostname) &&
        loopback.includes(database.hostname),
    );
    assert.equal(database.pathname, "/beth_shalom_test");
    const browser = await chromium.launch({
      executablePath: process.env.BROWSER_EXECUTABLE,
    });
    t.after(() => browser.close());
    const pageErrors = [];
    async function client() {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 960 },
        ignoreHTTPSErrors: portal.protocol === "https:",
      });
      await context.route("**/*", (route) =>
        new URL(route.request().url()).origin === portal.origin
          ? route.continue()
          : route.abort(),
      );
      await context.addInitScript(() =>
        sessionStorage.setItem("beth-shalom-enquiry-shown", "1"),
      );
      const page = await context.newPage();
      page.setDefaultTimeout(35000);
      page.on("pageerror", (error) => pageErrors.push(error.message));
      return { context, page };
    }
    const [admin, staff, visitor] = await Promise.all([
      client(),
      client(),
      client(),
    ]);
    const open = (page, pathname) =>
      page.goto(portal.origin + pathname, { waitUntil: "domcontentloaded" });
    const button = (scope, name) =>
      scope.getByRole("button", { name, exact: true });
    async function api(context, path, method = "GET", data) {
      const res = await context.request.fetch(versioned + path, {
        method,
        data,
        headers: csrf,
      });
      assert.equal(res.status(), 200, method + " " + path);
      return res.json();
    }
    async function signIn(page, role) {
      await open(page, "/portal/login");
      await page
        .getByRole("textbox", { name: "Username / Staff ID" })
        .fill(process.env["DEV_" + role + "_USERNAME"]);
      await page
        .locator('input[autocomplete="current-password"]')
        .fill(process.env["TEST_" + role + "_PASSWORD"]);
      await button(page, "Sign In to Portal").click();
      await page.waitForURL("**/portal/" + role.toLowerCase());
    }
    await signIn(admin.page, "ADMIN");
    await signIn(staff.page, "STAFF");
    const publicData = () => api(visitor.context, "/public/availability");
    const initial = await publicData();
    const nest = initial.find((row) => row.category_code === "NEST");
    const dorm = (
      await api(staff.context, "/dormitories?search=DORM-01")
    ).data.find((row) => row.dormitory_number === "DORM-01");
    const publicDorm = initial
      .find((row) => row.category_code === "DORM")
      .dormitories.find((row) => row.name === dorm.dormitory_name);
    const categoryPath =
      "/accommodation-categories/" + nest.category_id + "/availability";
    const dormPath = "/dormitories/" + dorm.id + "/availability";
    const room = (await api(admin.context, categoryPath)).units.find(
      (unit) => unit.number === "N-301",
    );
    const bed = (await api(staff.context, dormPath)).units.find(
      (unit) => unit.number === "D-01",
    );
    assert.equal(room.state, "AVAILABLE");
    assert.equal(bed.state, "AVAILABLE");

    async function edit(page, name) {
      await button(page, "Edit availability for " + name).click();
      const dialog = page.getByRole("dialog", {
        name: "Edit availability for " + name,
        exact: true,
      });
      await dialog
        .getByRole("columnheader", { name: "After changes", exact: true })
        .waitFor();
      return dialog;
    }
    async function apply(page, dialog, path, label, nextState) {
      await dialog
        .getByRole("combobox", { name: "Status for " + label, exact: true })
        .selectOption(nextState);
      await button(dialog, "Review changes").click();
      const saved = page.waitForResponse(
        (res) =>
          res.url() === versioned + path && res.request().method() === "PATCH",
      );
      await button(dialog, "Save").click();
      assert.equal((await saved).status(), 200);
      await dialog.waitFor({ state: "hidden" });
      await page
        .getByText("Accommodation availability updated.", { exact: true })
        .waitFor();
    }
    async function restore(context, path, unit, status) {
      const current = (await api(context, path)).units.find(
        (entry) => entry.id === unit.id,
      );
      if (current?.operational_status === status)
        await api(context, path, "PATCH", {
          changes: [{ id: unit.id, expected_status: status, status: "ACTIVE" }],
        });
    }

    try {
      await open(visitor.page, "/");
      const home = visitor.page.getByRole("region", {
        name: "Thoughtfully Planned Living Spaces",
      });
      const nestHome = home.getByRole("article").filter({
        has: visitor.page.getByRole("heading", {
          name: nest.category_name,
          exact: true,
        }),
      });
      await nestHome
        .getByText(
          nest.available_rooms + "/" + nest.total_rooms + " rooms vacant",
          { exact: false },
        )
        .waitFor();
      await open(admin.page, "/portal/admin/rooms");
      await admin.page
        .getByRole("searchbox", { name: "Search records" })
        .fill(nest.category_name);
      const category = await edit(admin.page, nest.category_name);
      await category
        .getByRole("row")
        .filter({
          has: admin.page.getByRole("rowheader", {
            name: /^available$/i,
            exact: true,
          }),
        })
        .getByRole("cell", { name: String(nest.available_rooms), exact: true })
        .first()
        .waitFor();

      await apply(
        admin.page,
        category,
        categoryPath,
        room.number,
        "MAINTENANCE",
      );
      await visitor.page.bringToFront();
      await nestHome
        .getByText(
          nest.available_rooms - 1 + "/" + nest.total_rooms + " rooms vacant",
          { exact: false },
        )
        .waitFor();

      await open(staff.page, "/portal/staff/rooms");
      await button(staff.page, "Dormitories").click();
    await staff.page.getByRole("searchbox", { name: "Search records" }).fill(dorm.dormitory_number);
      const dormEditor = await edit(staff.page, dorm.dormitory_name);
      await staff.page.setViewportSize({ width: 390, height: 850 });
      const box = await dormEditor.boundingBox();
      assert(box && box.x >= 0 && box.x + box.width <= 391);
      await apply(
        staff.page,
        dormEditor,
        dormPath,
        dorm.dormitory_name + " / " + bed.number,
        "INACTIVE",
      );

      await open(visitor.page, "/rooms");
      const catalogueCard = (name) =>
        visitor.page.getByRole("article").filter({
          has: visitor.page.getByRole("heading", { name, exact: true }),
        });
      await catalogueCard(nest.category_name)
        .getByText("Completely vacant rooms " + (nest.available_rooms - 1), {
          exact: false,
        })
        .first()
        .waitFor();
      await catalogueCard(publicDorm.name)
        .getByText("Available beds " + (publicDorm.available_beds - 1), {
          exact: false,
        })
        .first()
        .waitFor();
      const staffView = await api(staff.context, categoryPath);
      assert.equal(staffView.counts.available, nest.available_rooms - 1);
      assert(
        staffView.units.some(
          (unit) => unit.id === room.id && unit.state === "MAINTENANCE",
        ),
      );
      assert.equal(
        (await api(admin.context, dormPath)).counts.available,
        publicDorm.available_beds - 1,
      );
      assert.deepEqual(pageErrors, []);
    } finally {
      await restore(admin.context, categoryPath, room, "MAINTENANCE");
      await restore(staff.context, dormPath, bed, "INACTIVE");
    }
  },
);
