import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";

const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE || "playwright-core",
);
const portal = new URL(process.env.TEST_PORTAL_ORIGIN);
const api = new URL(process.env.TEST_BACKEND_ORIGIN);
const hosts = new Set(["127.0.0.1", "localhost", "[::1]"]);
const secure = portal.protocol === "https:";
const prefix = secure ? "__Host-" : "";
const access = prefix + "beth_access";
const refresh = prefix + "beth_refresh";
const csrf = { Origin: portal.origin, "X-Beth-Shalom-CSRF": "1" };

test(
  "portal session probing, JWT refresh and logout",
  { timeout: 240_000 },
  async (t) => {
    assert(
      hosts.has(portal.hostname) && hosts.has(api.hostname),
      "Use isolated loopback servers",
    );
    const browser = await chromium.launch({
      executablePath: process.env.BROWSER_EXECUTABLE,
    });
    t.after(() => browser.close());
    const context = await browser.newContext({
      ignoreHTTPSErrors: secure,
      viewport: { width: 1280, height: 900 },
    });
    const page = await context.newPage();
    page.setDefaultTimeout(55000);
    const authResponses = [];
    page.on("response", (response) => {
      const url = new URL(response.url());
      if (
        url.origin === portal.origin &&
        url.pathname.startsWith("/api/v1/auth/")
      )
        authResponses.push({ path: url.pathname, status: response.status() });
    });
    const open = (route) =>
      page.goto(new URL(route, portal).href, { waitUntil: "domcontentloaded" });
    const nextProbe = () =>
      page.waitForResponse(
        (response) =>
          new URL(response.url()).pathname === "/api/v1/auth/session",
      );
    const authCookie = async (name) =>
      (await context.cookies(portal.origin)).find(
        (cookie) => cookie.name === name,
      );

    async function login(role) {
      const probe = nextProbe();
      await open("/portal/login");
      await probe;
      await page
        .getByRole("textbox", { name: "Username / Staff ID" })
        .fill(process.env["DEV_" + role + "_USERNAME"]);
      await page
        .locator('input[autocomplete="current-password"]')
        .fill(process.env["TEST_" + role + "_PASSWORD"]);
      const response = page.waitForResponse(
        (reply) => new URL(reply.url()).pathname === "/api/v1/auth/login",
      );
      await page.getByRole("button", { name: "Sign In to Portal" }).click();
      const reply = await response;
      assert.equal(reply.status(), 200);
      const actor = await reply.json();
      assert.equal(actor.role, role.toLowerCase());
      assert(!("accessToken" in actor) && !("refreshToken" in actor));
      await page.waitForURL("**/portal/" + role.toLowerCase());
    }

    await t.test(
      "public pages and signed-out portal send no rejected session probes",
      async () => {
        const openPublic = await open("/rooms");
        assert.equal(openPublic.status(), 200);
        if (secure) {
          for (const path of [
            "/",
            "/about-us",
            "/admission-enquiry",
            "/contact",
            "/facilities",
            "/rooms/harmony",
            "/rooms/visualizer",
          ]) {
            const response = await context.request.get(
              new URL(path, portal).href,
            );
            assert.equal(response.status(), 200, path);
            await response.dispose();
          }
        }
        const availability = await context.request.get(
          new URL("/api/v1/public/availability", portal).href,
        );
        assert.equal(availability.status(), 200);
        assert.equal(authResponses.length, 0);
        const probe = nextProbe();
        await open("/portal/admin/rooms");
        await page.waitForURL("**/portal/login");
        const signedOut = await probe;
        assert.equal(signedOut.status(), 200);
        assert.equal(await signedOut.json(), null);
        const paths = authResponses.map(({ path }) => path);
        assert.deepEqual(paths, ["/api/v1/auth/session"]);
        assert(!(await authCookie(access)) && !(await authCookie(refresh)));
      },
    );

    await t.test("exact-origin CSRF rules and host-only cookies", async () => {
      const path = new URL("/api/v1/auth/session", portal).href;
      const alternate = new URL(portal);
      alternate.hostname =
        portal.hostname === "localhost" ? "127.0.0.1" : "localhost";
      assert.equal(
        (
          await context.request.post(path, {
            headers: { Origin: portal.origin },
          })
        ).status(),
        403,
      );
      assert.equal(
        (
          await context.request.post(path, {
            headers: { ...csrf, Origin: alternate.origin },
          })
        ).status(),
        403,
      );
      await login("ADMIN");
      for (const name of [access, refresh]) {
        const cookie = await authCookie(name);
        assert(cookie, name + " was set");
        assert(cookie.httpOnly);
        assert.equal(cookie.sameSite, "Strict");
        assert.equal(cookie.secure, secure);
        assert.equal(cookie.path, "/");
        assert.equal(cookie.domain, portal.hostname);
      }
      assert.equal(
        (await context.cookies(alternate.origin)).filter((cookie) =>
          [access, refresh].includes(cookie.name),
        ).length,
        0,
      );
      assert.equal(
        await page.evaluate(() => document.cookie.includes("beth_access")),
        false,
      );
      await open("/portal/admin/staff");
      await page
        .getByRole("heading", {
          name: "Staff Directory & RBAC Management",
          exact: true,
        })
        .waitFor();
    });

    await t.test(
      "expired access rotates once and restores the protected page",
      async () => {
        const oldRefresh = await authCookie(refresh);
        const oldAccess = await authCookie(access);
        assert(oldRefresh && oldAccess);
        const expiry = oldAccess.expires * 1000 - Date.now();
        assert(expiry < 45_000, "Set a short test access lifetime");
        await delay(Math.max(expiry + 450, 1));
        const seen = authResponses.length;
        const probe = nextProbe();
        await open("/portal/admin/rooms");
        const session = await probe;
        assert.equal(session.status(), 200);
        assert.equal((await session.json()).role, "admin");
        await page
          .getByRole("heading", { name: "Room Management", exact: true })
          .waitFor();
        assert.equal(
          authResponses
            .slice(seen)
            .filter(({ path }) => path === "/api/v1/auth/session").length,
          1,
        );
        assert(
          (await authCookie(refresh))?.value !== oldRefresh.value,
          "Refresh token rotated",
        );
        assert(
          (await authCookie(access))?.value !== oldAccess.value,
          "Access token changed",
        );
        await open("/portal/logout");
        await page.getByRole("button", { name: "Sign Out Now" }).click();
        await page.waitForURL("**/portal/login");
        assert(!(await authCookie(access)) && !(await authCookie(refresh)));
      },
    );

    await t.test(
      "Staff permissions and an unusable refresh return to login",
      async () => {
        await login("STAFF");
        await open("/portal/admin/staff");
        await page.waitForURL("**/portal/staff");
        await open("/portal/staff/rooms");
        await page
          .getByRole("heading", { name: "Room Management", exact: true })
          .waitFor();
        const denied = await context.request.get(
          new URL("/api/v1/staff", portal).href,
        );
        assert.equal(denied.status(), 403);

        const savedCookie = await authCookie(refresh);
        assert(savedCookie);
        const revoked = await context.request.post(
          new URL("/api/v1/auth/logout", api).href,
          {
            data: { refreshToken: savedCookie.value },
          },
        );
        assert.equal(revoked.status(), 200);
        // Leave the refresh cookie in the browser to exercise the terminal refresh failure.
        await context.clearCookies({ name: access });
        const alreadySeen = authResponses.length;
        const probe = nextProbe();
        await open("/portal/staff/rooms");
        const signedOut = await probe;
        assert.equal(signedOut.status(), 200);
        await page.waitForURL("**/portal/login?expired=1");
        assert(!(await authCookie(access)) && !(await authCookie(refresh)));
        assert.equal(
          authResponses
            .slice(alreadySeen)
            .filter(({ path }) => path === "/api/v1/auth/session").length,
          1,
        );
        await open("/");
        assert(
          !authResponses.some(
            ({ path, status }) =>
              status === 401 ||
              path === "/api/v1/auth/context" ||
              path === "/api/v1/auth/refresh",
          ),
        );
      },
    );
  },
);
