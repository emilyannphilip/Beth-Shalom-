import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE || "playwright-core",
);
const origin = new URL(process.env.TEST_PORTAL_ORIGIN).origin;
const routes = [
  "/",
  "/about-us",
  "/rooms",
  "/rooms/harmony",
  "/rooms/visualizer",
  "/facilities",
  "/admission-enquiry",
  "/contact",
];

test(
  "public top content and section links clear the sticky header",
  { timeout: 150000 },
  async (t) => {
    assert(
      ["localhost", "127.0.0.1", "[::1]"].includes(new URL(origin).hostname),
    );
    const browser = await chromium.launch({
      executablePath: process.env.BROWSER_EXECUTABLE,
    });
    t.after(() => browser.close());
    const context = await browser.newContext({ reducedMotion: "reduce" });
    await context.addInitScript(() =>
      sessionStorage.setItem("beth-shalom-enquiry-shown", "1"),
    );
    await context.route("**/*", (route) =>
      new URL(route.request().url()).origin === origin ? route.continue() : route.abort(),
    );
    const page = await context.newPage();
    const header = page.locator("[data-page] > header");
    const breadcrumb = page.getByRole("navigation", {
      name: "Breadcrumb",
      exact: true,
    });
    const about = page.getByRole("heading", { name: /A Sanctuary Born/ });
    const sectionId = "mission-pillars";

    async function visit(path) {
      const response = await page.goto(origin + path, { waitUntil: "load" });
      assert.equal(response.status(), 200, path);
    }

    async function topClear() {
      const [top, main] = await Promise.all([
        header.boundingBox(),
        page.locator("main").boundingBox(),
      ]);
      assert(top && main);
      assert(Math.abs(top.y) <= 1);
      assert(
        Math.abs(main.y - top.y - top.height) <= 1,
        "Header and main should meet",
      );
    }

    async function anchorClear(id) {
      await page.waitForFunction((targetId) => {
        const target = document.getElementById(targetId);
        const header = document.querySelector("[data-page] > header");
        return (
          header &&
          target &&
          target.getBoundingClientRect().top >=
            header.getBoundingClientRect().bottom &&
          target.getBoundingClientRect().top < innerHeight / 2
        );
      }, id);
    }

    for (const width of [1440, 820, 390, 320]) {
      await page.setViewportSize({ width, height: 940 });
      for (const route of routes) {
        await visit(route);
        await topClear();
      }
      await visit("/about-us");
      await breadcrumb.getByText("About Us", { exact: true }).waitFor();
      assert.equal(
        await breadcrumb.locator('[aria-current="page"]').count(),
        1,
      );
      const intro = page.getByText(
        "Beth Shalom (GMI) Retirement Home is more than a residence",
        { exact: false },
      );
      const [top, title, copy] = await Promise.all([
        header.boundingBox(),
        about.boundingBox(),
        intro.boundingBox(),
      ]);
      assert(top && title && copy);
      assert(title.y >= top.y + top.height && copy.y >= title.y + title.height);

      await breadcrumb.getByRole("link", { name: "Home", exact: true }).click();
      await page.waitForURL(origin + "/");
      if (width < 1280) {
        await page
          .getByRole("button", { name: "Open navigation menu" })
          .click();
        await page
          .getByRole("navigation", { name: "Mobile primary navigation" })
          .getByRole("link", { name: "About Us", exact: true })
          .click();
      } else {
        await page
          .getByRole("navigation", { name: "Primary navigation", exact: true })
          .getByRole("link", { name: "About Us", exact: true })
          .click();
      }

      await page.waitForURL(origin + "/about-us");
      await topClear();
      await page.reload({ waitUntil: "load" });
      await topClear();
      await page
        .getByRole("link", { name: "Four Pillars", exact: true })
        .click();
      await page.waitForURL("**/about-us#" + sectionId);
      await anchorClear(sectionId);
      await page.goto("about:blank");
      await visit("/about-us#" + sectionId);
      await anchorClear(sectionId);
      await page.reload({ waitUntil: "load" });
      await anchorClear(sectionId);
    }

    await visit("/about-us");
    await header
      .locator(":scope > div")
      .first()
      .evaluate((utility) => {
        utility.style.paddingBlock = "1.5rem";
      });
    await page.waitForFunction(() => {
      const header = document.querySelector("[data-page] > header");
      const offset = parseFloat(
        getComputedStyle(document.documentElement).scrollPaddingTop,
      );
      return offset >= header.getBoundingClientRect().height && offset > 120;
    });
    await topClear();
    await page.getByRole("link", { name: "Four Pillars", exact: true }).click();
    await anchorClear(sectionId);
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    assert(
      Math.abs((await header.boundingBox()).y) <= 1,
      "Header stays sticky through the footer",
    );
  },
);
