import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";

const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE || "playwright-core",
);
const portal = new URL(process.env.TEST_PORTAL_ORIGIN);
const availability = "**/api/v1/public/availability";

test(
  "slow and failed availability settle without blocking public navigation",
  { timeout: 100_000 },
  async (t) => {
    assert(["127.0.0.1", "localhost", "[::1]"].includes(portal.hostname));
    const browser = await chromium.launch({
      executablePath: process.env.BROWSER_EXECUTABLE,
    });
    t.after(() => browser.close());
    const context = await browser.newContext({
      ignoreHTTPSErrors: portal.protocol === "https:",
      viewport: { width: 1440, height: 960 },
    });
    await context.addInitScript(() =>
      sessionStorage.setItem("beth-shalom-enquiry-shown", "1"),
    );
    await context.route("**/*", (route) =>
      new URL(route.request().url()).origin === portal.origin
        ? route.continue()
        : route.abort(),
    );
    const page = await context.newPage();
    const errors = [];
    const auth = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (new URL(request.url()).pathname.startsWith("/api/v1/auth/"))
        auth.push(request.url());
    });
    const open = (path) =>
      page.goto(new URL(path, portal).href, { waitUntil: "load" });
    const heading = page.getByRole("heading", {
      name: "Accommodation Availability",
      exact: true,
    });
    const publicCount = page
      .getByText("Completely vacant rooms", { exact: false })
      .first();
    let slow = 0;
    await page.route(availability, async (route) => {
      slow++;
      await delay(12_000);
      await route.continue().catch(() => {});
    });
    await open("/rooms");
    await heading.waitFor();
    await publicCount.waitFor();
    assert.equal(
      slow,
      1,
      "a refresh interval must not restart the pending load",
    );

    await page.unroute(availability);
    let failed = 0;
    let unblock;
    const held = new Promise((resolve) => {
      unblock = resolve;
    });
    t.after(unblock);
    await page.route(availability, async (route) => {
      failed++;
      await held;
      await route.continue().catch(() => {});
    });
    await open("/rooms");
    const error = page
      .getByRole("alert")
      .filter({
        hasText: "Accommodation availability is temporarily unavailable.",
      });
    await error.waitFor({ timeout: 20_000 });
    assert.equal(
      await page
        .getByText("Checking accommodation availability…", { exact: true })
        .count(),
      0,
    );
    await delay(10_500);
    assert.equal(
      failed,
      1,
      "a failed request waits for an explicit retry or return to the page",
    );
    unblock();
    await page.unroute(availability, undefined);
    await error.getByRole("button", { name: "Try again" }).click();
    await publicCount.waitFor();

    const document = await page.evaluate(() => performance.timeOrigin);
    const links = page.getByRole("navigation", { name: "Primary navigation" });
    await links.getByRole("link", { name: "Facilities", exact: true }).click();
    await page.waitForURL("**/facilities");
    assert.equal(await page.evaluate(() => performance.timeOrigin), document);
    await links.getByRole("link", { name: "Rooms", exact: true }).click();
    await page.waitForURL("**/rooms");
    await publicCount.waitFor();
    assert.deepEqual(auth, []);
    assert.deepEqual(errors, []);
  },
);
