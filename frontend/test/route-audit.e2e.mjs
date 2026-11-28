import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";

const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE || "playwright-core",
);
const portal = new URL(process.env.TEST_PORTAL_ORIGIN);
const database = new URL(process.env.DATABASE_URL);
const apiBase = portal.origin + "/api/v1";
const publicRoutes = [
  "/",
  "/about-us",
  "/rooms",
  "/rooms/harmony",
  "/rooms/visualizer",
  "/facilities",
  "/admission-enquiry",
  "/contact",
];
const portalRoutes = {
  ADMIN: [
    "/portal/admin",
    "/portal/admin#enquiries-section",
    "/portal/admin/staff",
    "/portal/admin/residents",
    "/portal/admin/rooms",
  ],
  STAFF: [
    "/portal/staff",
    "/portal/staff#staff-enquiries-section",
    "/portal/staff/residents",
    "/portal/staff/rooms",
  ],
};

test(
  "public pages, portal modules, and API proxy serve their registered resources",
  { timeout: 180000 },
  async (t) => {
    assert.equal(database.pathname, "/beth_shalom_test");
    const loopback = ["127.0.0.1", "localhost", "[::1]"];
    assert(
      loopback.includes(portal.hostname) &&
        loopback.includes(database.hostname),
    );
    const browser = await chromium.launch({
      executablePath: process.env.BROWSER_EXECUTABLE,
    });
    t.after(() => browser.close());
    const missing = [];
    const browserErrors = [];
    const publicAuth = [];
    async function session() {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 960 },
        ignoreHTTPSErrors: portal.protocol === "https:",
      });
      await context.addInitScript(() =>
        sessionStorage.setItem("beth-shalom-enquiry-shown", "1"),
      );
      await context.route("**/*", (route) => {
        const url = new URL(route.request().url());
        return url.origin === portal.origin ? route.continue() : route.abort();
      });
      const page = await context.newPage();
      page.setDefaultTimeout(30000);
      page.on("response", (response) => {
        if (response.status() === 404)
          missing.push(response.request().method() + " " + response.url());
      });
      page.on("pageerror", (error) => browserErrors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") browserErrors.push(message.text());
      });
      return { page, context };
    }
    async function visit(page, route) {
      const response = await page.goto(portal.origin + route, {
        waitUntil: "load",
      });
      if (response) assert.equal(response.status(), 200, route);
      assert.equal(new URL(page.url()).pathname, route.split("#")[0]);
    }
    async function fetchJson(context, route, expected = 200) {
      const response = await context.request.get(apiBase + route);
      assert.equal(response.status(), expected, route);
      return response.json();
    }
    async function signIn({ page }, role) {
      await visit(page, "/portal/login");
      await page
        .getByRole("textbox", { name: "Username / Staff ID" })
        .fill(process.env["DEV_" + role + "_USERNAME"]);
      await page
        .locator('input[autocomplete="current-password"]')
        .fill(process.env["TEST_" + role + "_PASSWORD"]);
      await page
        .getByRole("button", { name: "Sign In to Portal", exact: true })
        .click();
      await page.waitForURL("**/portal/" + role.toLowerCase());
    }

    const visitor = await session();
    visitor.page.on("request", (request) => {
      if (new URL(request.url()).pathname.startsWith("/api/v1/auth/"))
        publicAuth.push(request.url());
    });
    const icon = await visitor.context.request.get(
      portal.origin + "/favicon.ico",
    );
    assert.equal(icon.status(), 200);
    assert.match(icon.headers()["content-type"], /^image\//);
    for (const path of publicRoutes) {
      await visit(visitor.page, path);
      await visitor.page.evaluate(async () => {
        await document.fonts.ready;
        // Trigger the existing lazy resources without changing server-rendered attributes.
        for (const image of document.images) image.scrollIntoView();
        window.scrollTo(0, 0);
      });
    }
    await visit(visitor.page, "/rooms");
    await visitor.page.getByRole("region", { name: "Dormitories" }).waitFor();
    const catalogue = await fetchJson(visitor.context, "/public/availability");
    const nest = catalogue.find((row) => row.category_code === "NEST");
    assert(nest.total_rooms > 0);
    assert(
      catalogue.some((row) =>
        row.dormitories.some((dorm) => dorm.total_beds > 0),
      ),
    );
    assert.deepEqual(publicAuth, []);

    for (const role of ["ADMIN", "STAFF"]) {
      const actor = await session();
      await signIn(actor, role);
      for (const route of [...portalRoutes[role], "/portal/change-password"]) {
        await visit(actor.page, route);
        const fragment = new URL(actor.page.url()).hash.slice(1);
        if (fragment)
          await actor.page
            .locator("#" + fragment)
            .waitFor({ state: "attached" });
      }
      const resources = [
        "/accommodation-categories",
        "/buildings",
        "/rooms",
        "/dormitories",
        "/beds",
        "/allocations",
        "/allocations/residents",
        "/allocations/history",
        "/reservations",
        "/dashboard/summary",
        "/enquiries",
        "/residents",
      ];
      await Promise.all(
        resources.map((path) => fetchJson(actor.context, path)),
      );
      await fetchJson(actor.context, "/staff", role === "ADMIN" ? 200 : 403);
      const category = await fetchJson(
        actor.context,
        "/accommodation-categories/" + nest.category_id + "/availability",
      );
      await fetchJson(
        actor.context,
        "/accommodation-categories/" + nest.category_id + "/dependencies",
      );
      assert.equal(category.counts.available, nest.available_rooms);
      const dormitories = await fetchJson(
        actor.context,
        "/dormitories?search=DORM-01",
      );
      const dorm = dormitories.data.find(
        (row) => row.dormitory_number === "DORM-01",
      );
      const snapshot = await fetchJson(
        actor.context,
        "/dormitories/" + dorm.id + "/availability",
      );
      assert.equal(snapshot.counts.total, dorm.availability.total_beds);
      const roomId = category.units[0].id;
      await fetchJson(actor.context, "/rooms/" + roomId);
      const missingRoute = await fetchJson(
        actor.context,
        "/rooms/" + roomId + "/unregistered?probe=1",
        404,
      );
      assert.match(
        missingRoute.message,
        /does not expose GET \/api\/v1\/rooms\//,
      );
      const missingRecord = await fetchJson(
        actor.context,
        "/rooms/00000000-0000-4000-8000-000000000000",
        404,
      );
      assert.match(missingRecord.message, /record not found/i);
      await visit(actor.page, "/portal/logout");
      await actor.context.close();
    }
    const account = await session();
    await visit(account.page, "/portal/reset-password");
    await account.page.goto(portal.origin + "/portal", { waitUntil: "load" });
    await account.page.waitForURL("**/portal/login");
    await fetchJson(account.context, "/rooms", 401);
    await account.context.close();
    assert.deepEqual(missing, []);
    assert.deepEqual(browserErrors, []);

    let requests = 0;
    let backendReady = false;
    await visitor.page.route("**/api/v1/public/availability", (route) => {
      requests++;
      return backendReady
        ? route.fallback()
        : route.fulfill({
            status: 404,
            json: {
              statusCode: 404,
              message: "Availability API route not found.",
            },
          });
    });
    await visit(visitor.page, "/rooms");
    const retry = visitor.page
      .getByRole("alert")
      .getByRole("button", { name: "Try again", exact: true });
    await retry.waitFor();
    await delay(2300);
    await visitor.page.evaluate(() => {
      window.dispatchEvent(new Event("focus"));
      const changes = new BroadcastChannel("beth-shalom-availability");
      changes.postMessage("availability-changed");
      changes.close();
    });
    await delay(750);
    assert.equal(requests, 1, "A missing resource waits for an explicit retry");
    backendReady = true;
    await retry.click();
    await visitor.page.getByRole("region", { name: "Dormitories" }).waitFor();
    assert.equal(requests, 2);
  },
);
