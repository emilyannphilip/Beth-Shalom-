const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const { test } = require("node:test");
const { SessionTokens, hashToken, equalHash } = require("../dist/auth/tokens");

test("JWT verifies purpose and respects both token lifetimes", (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: 0 });
  const settings = {
    AUTH_ACCESS_SECRET: randomUUID() + randomUUID(),
    AUTH_REFRESH_SECRET: randomUUID() + randomUUID(),
    AUTH_ACCESS_SECONDS: "1",
    AUTH_REFRESH_SECONDS: "60",
  };
  const tokens = new SessionTokens({ get: (key) => settings[key] });
  const userId = randomUUID(),
    sessionId = randomUUID();
  const pair = tokens.issue(userId, sessionId, new Date(Date.now() + 60000));
  assert.deepEqual(tokens.read(pair.accessToken, "access"), {
    userId,
    sessionId,
  });
  assert.deepEqual(tokens.read(pair.refreshToken, "refresh"), {
    userId,
    sessionId,
  });
  assert.throws(() => tokens.read(pair.refreshToken, "access"));
  assert(equalHash(hashToken(pair.refreshToken), hashToken(pair.refreshToken)));
  assert(!equalHash(hashToken(pair.accessToken), hashToken(pair.refreshToken)));
  t.mock.timers.tick(1000);
  assert.throws(() => tokens.read(pair.accessToken, "access"));
  assert.equal(tokens.read(pair.refreshToken, "refresh").sessionId, sessionId);
  t.mock.timers.tick(59000);
  assert.throws(() => tokens.read(pair.refreshToken, "refresh"));
});
