const assert = require("node:assert/strict");
const { test } = require("node:test");
const { calendarDate } = require("../dist/common/api");
const { targetOf } = require("../dist/housing/housing.service");
const { hashPassword, verifyPassword } = require("../dist/auth/passwords");

test("calendar dates and target selection reject invalid inputs", () => {
  assert.equal(calendarDate("2024-02-29"), "2024-02-29");
  assert.throws(() => calendarDate("2025-02-29"));
  assert.equal(targetOf({ bed_id: "local-test-bed" }).field, "bed_id");
  assert.throws(() => targetOf({ bed_id: "two", room_id: "targets" }));
  assert.throws(() => targetOf({}));
});

test("salted password hashes verify without storing plaintext", async () => {
  const password = "synthetic test only";
  const first = await hashPassword(password);
  assert.match(first, /^scrypt-v2:[0-9a-f]{32}:[0-9a-f]{128}$/);
  assert.notEqual(first, await hashPassword(password));
  assert(await verifyPassword(password,first));
  assert.equal(await verifyPassword("wrong password",first),false);
});
