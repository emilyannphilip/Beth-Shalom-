import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE || "playwright-core",
);
const origin = new URL(process.env.TEST_PORTAL_ORIGIN);
const database = new URL(process.env.DATABASE_URL);

test(
  "Staff and Admin share enquiry and resident workflows",
  { timeout: 150000 },
  async (t) => {
    assert.equal(database.pathname, "/beth_shalom_test");
    for (const url of [origin, database])
      assert(["localhost", "127.0.0.1", "[::1]"].includes(url.hostname));
    const browser = await chromium.launch({
      executablePath: process.env.BROWSER_EXECUTABLE,
    });
    t.after(() => browser.close());
    const button = (scope, name) =>
      scope.getByRole("button", { name, exact: true });
    const dialog = (page, name) =>
      page.getByRole("dialog", { name, exact: true });
    const go = (page, path) =>
      page.goto(origin.origin + path, { waitUntil: "domcontentloaded" });
    async function signIn(role, width) {
      const context = await browser.newContext({
        ignoreHTTPSErrors: origin.protocol === "https:",
        viewport: { width, height: 950 },
      });
      const page = await context.newPage();
      page.setDefaultTimeout(25000);
      await go(page, "/portal/login");
      await page
        .locator('input[name="username"]')
        .fill(process.env["DEV_" + role + "_USERNAME"]);
      await page
        .locator('input[name="password"]')
        .fill(process.env["TEST_" + role + "_PASSWORD"]);
      await button(page, "Sign In to Portal").click();
      await page.waitForURL("**/portal/" + role.toLowerCase(), {
        waitUntil: "domcontentloaded",
      });
      return { page, context };
    }
    async function get(actor, path, status = 200) {
      const response = await actor.context.request.get(
        origin.origin + "/api/v1" + path,
      );
      assert.equal(response.status(), status, path);
      return response.json();
    }

    const staff = await signIn("STAFF", 820);
    const admin = await signIn("ADMIN", 1440);
    await get(staff, "/staff", 403);
    await get(staff, "/audit-logs", 403);
    await get(staff, "/roles", 403);
    await go(staff.page, "/portal/admin/staff");
    await staff.page.waitForURL("**/portal/staff");
    assert.equal(
      await staff.page
        .getByRole("link", { name: "Staff Management", exact: true })
        .count(),
      0,
    );

    const suffix = randomUUID().slice(0, 8);
    const category = "Browser enquiry category " + suffix;
    const applicant = "Browser applicant " + suffix;
    const resident = "Browser resident " + suffix;
    const assignees = await get(staff, "/enquiries/assignees");
    const adminActor = await get(admin, "/auth/context");
    assert(assignees.some((entry) => entry.id === adminActor.id));

    await button(staff.page, "Manage enquiry categories").click();
    const categories = dialog(staff.page, "Enquiry categories");
    await button(categories, "Add enquiry category").click();
    const categoryEditor = dialog(staff.page, "Add enquiry category");
    await categoryEditor.getByLabel("Category name").fill(category);
    await button(categoryEditor, "Save").click();
    await categories.getByText(category, { exact: true }).waitFor();
    await button(categories, "Close").click();

    await button(staff.page, "+ Add").click();
    const enquiry = dialog(staff.page, "Add enquiry");
    await enquiry.getByLabel("Applicant name").fill(applicant);
    await enquiry.getByLabel("Telephone").fill("5551234567");
    await enquiry
      .getByLabel("Enquiry category")
      .selectOption({ label: category });
    await enquiry.getByLabel("Assign to staff").selectOption(adminActor.id);
    await enquiry
      .getByLabel("Internal remarks")
      .fill("Staff added this fixture");
    await button(enquiry, "Save").click();
    await enquiry.waitFor({ state: "hidden" });

    await admin.page
      .getByRole("searchbox", { name: "Search enquiries" })
      .fill(applicant);
    const row = admin.page.getByRole("row").filter({ hasText: applicant });
    await button(row, "View").click();
    const inspected = dialog(admin.page, applicant);
    await inspected
      .getByText("Staff added this fixture", { exact: false })
      .first()
      .waitFor();
    await inspected.getByLabel("Update enquiry status").selectOption("Pending");
    await button(inspected, "Save & Finalize Status").click();
    await inspected.waitFor({ state: "hidden" });
    const saved = (
      await get(staff, "/enquiries?search=" + encodeURIComponent(applicant))
    ).data[0];
    assert.equal(saved.assigned_user_id, adminActor.id);
    assert.equal(saved.status, "PENDING");

    await go(staff.page, "/portal/staff/residents");
    await button(staff.page, "+ Add Resident").click();
    const editor = dialog(staff.page, "New Resident Admission");
    await editor.locator('input[name="name"]').fill(resident);
    await editor.getByLabel("Gender").fill("Female");
    await editor.getByLabel("Date of birth").fill("1950-01-01");
    await editor.getByLabel("Admission date").fill("2025-01-01");
    await editor.getByLabel("Medical conditions").fill("Fictional condition");
    await editor
      .getByLabel("Legal guardian / proxy")
      .fill("Fictional guardian");
    await editor
      .getByLabel("Emergency contact name")
      .fill("Fictional emergency contact");
    await editor
      .getByLabel("Accommodation category")
      .selectOption({ label: "Nest" });
    await editor
      .getByRole("combobox", { name: "Floor", exact: true })
      .selectOption("3");
    const room = editor.getByRole("combobox", { name: "Room number" });
    await room.locator("option").nth(1).waitFor({ state: "attached" });
    await room.selectOption({ index: 1 });
    await button(editor, "Review admission").click();
    await button(editor, "Confirm admission and allocation").click();
    await editor.waitFor({ state: "hidden" });

    const record = (
      await get(admin, "/residents?search=" + encodeURIComponent(resident))
    ).data[0];
    const detail = await get(admin, "/residents/" + record.id);
    assert.equal(detail.care.medical_conditions, "Fictional condition");
    assert.equal(detail.contacts.length, 2);
    assert(detail.accommodation.room_id);
    await go(admin.page, "/portal/admin/residents");
    await admin.page
      .getByRole("searchbox", { name: "Search residents" })
      .fill(resident);
    const residentRow = admin.page
      .getByRole("row")
      .filter({ hasText: resident });
    await button(residentRow, "Discharge").click();
    const confirmation = dialog(admin.page, "Discharge resident");
    await button(confirmation, "Discharge").click();
    await confirmation.waitFor({ state: "hidden" });
    const released = await get(staff, "/residents/" + record.id);
    assert.equal(released.admission_status, "DISCHARGED");
    assert.equal(released.accommodation.room_id, null);
    await button(residentRow, "Archive resident").click();
    const archive = dialog(admin.page, "Archive resident");
    await button(archive, "Archive").click();
    await archive.waitFor({ state: "hidden" });
    await get(staff, "/residents/" + record.id, 404);

    await go(staff.page, "/portal/staff");
    await staff.page
      .getByRole("searchbox", { name: "Search enquiries" })
      .fill(applicant);
    await button(
      staff.page.getByRole("row").filter({ hasText: applicant }),
      "Archive enquiry",
    ).click();
    const archiveEnquiry = dialog(staff.page, "Archive enquiry");
    await button(archiveEnquiry, "Archive").click();
    await archiveEnquiry.waitFor({ state: "hidden" });
    await get(admin, "/enquiries/" + saved.id, 404);

    await button(staff.page, "Manage enquiry categories").click();
    await button(categories, "Archive " + category).click();
    const archiveCategory = dialog(staff.page, "Archive enquiry category");
    await button(archiveCategory, "Archive").click();
    await archiveCategory.waitFor({ state: "hidden" });
    const activeCategories = await get(admin, "/public/enquiry-categories");
    assert(!activeCategories.some((entry) => entry.name === category));
  },
);
