const assert = require("node:assert/strict");
const { spawn, spawnSync } = require("node:child_process");
const { randomUUID } = require("node:crypto");
const { once } = require("node:events");
const { mkdtempSync, readFileSync, rmSync, rmdirSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join } = require("node:path");
const { setTimeout: delay } = require("node:timers/promises");
const { test } = require("node:test");
const { Pool } = require("pg");
const { SMTPServer } = require("smtp-server");
const { hashPassword } = require("../dist/auth/passwords");
const { hashToken } = require("../dist/auth/tokens");

test(
  "Phase 7 JWT, permission and email recovery integration",
  {
    skip:
      !process.env.DATABASE_URL && "Provide the isolated test database URL.",
  },
  async (t) => {
    const url = new URL(process.env.DATABASE_URL);
    assert.equal(url.pathname, "/beth_shalom_test");
    assert(["127.0.0.1", "localhost", "[::1]"].includes(url.hostname));
    const pool = new Pool({ connectionString: url.toString() });
    const fixtures = [];
    t.after(async () => {
      for (const id of fixtures) {
        await pool.query(
          "UPDATE users SET status='INACTIVE',deleted_at=now() WHERE id=$1",
          [id],
        );
        await pool.query(
          "UPDATE auth_sessions SET revoked_at=now() WHERE user_id=$1 AND revoked_at IS NULL",
          [id],
        );
      }
      await pool.end();
    });
    const suffix = randomUUID().slice(0, 8);
    const password = "Fictional-check-" + randomUUID();
    const stored = await hashPassword(password);
    async function user(role) {
      const username = "auth." + role.toLowerCase() + "." + suffix;
      const email = username + "@example.test";
      const row = (
        await pool.query(
          "INSERT INTO users(full_name,username,email,password_hash,role_id) " +
            "SELECT $1,$2,$3,$4,id FROM roles WHERE name=$5 RETURNING id",
          ["Test " + role, username, email, stored, role],
        )
      ).rows[0];
      assert(row, "Run the local role seed before integration tests.");
      fixtures.push(row.id);
      return { id: row.id, username, email };
    }
    const admin = await user("ADMIN");
    const staff = await user("STAFF");
    const temporary = mkdtempSync(join(tmpdir(), "beth-shalom-smtp-"));
    const privateKey = join(temporary, "key.pem"),
      certificate = join(temporary, "cert.pem");
    const certificateRun = spawnSync(
      process.env.TEST_OPENSSL || "openssl",
      [
        "req",
        "-x509",
        "-nodes",
        "-newkey",
        "rsa:2048",
        "-days",
        "1",
        "-subj",
        "/CN=localhost",
        "-addext",
        "subjectAltName=DNS:localhost,IP:127.0.0.1",
        "-keyout",
        privateKey,
        "-out",
        certificate,
      ],
      { stdio: "ignore", windowsHide: true },
    );
    assert.equal(
      certificateRun.status,
      0,
      "An OpenSSL executable is needed for the local SMTP TLS test.",
    );
    const emails = [];
    const smtp = new SMTPServer({
      secure: true,
      key: readFileSync(privateKey),
      cert: readFileSync(certificate),
      authOptional: true,
      disabledCommands: ["AUTH"],
      onData(stream, _session, done) {
        let content = "";
        stream.on("data", (chunk) => (content += String(chunk)));
        stream.once("end", () => {
          emails.push(content);
          done();
        });
      },
    });
    await new Promise((resolve, reject) => {
      smtp.once("error", reject);
      smtp.listen(0, "127.0.0.1", resolve);
    });
    t.after(async () => {
      await new Promise((resolve) => smtp.close(resolve));
      rmSync(privateKey);
      rmSync(certificate);
      rmdirSync(temporary);
    });
    const port = process.env.TEST_AUTH_API_PORT || "33071";
    const app = spawn(process.execPath, [join(__dirname, "../dist/main.js")], {
      env: {
        ...process.env,
        NODE_ENV: "test",
        HOST: "127.0.0.1",
        PORT: port,
        AUTH_ACCESS_SECRET: randomUUID() + randomUUID(),
        AUTH_REFRESH_SECRET: randomUUID() + randomUUID(),
        AUTH_ACCESS_SECONDS: "60",
        AUTH_REFRESH_SECONDS: "180",
        PORTAL_ORIGIN: "http://127.0.0.1:3000",
        SMTP_HOST: "127.0.0.1",
        SMTP_PORT: String(smtp.server.address().port),
        SMTP_SECURE: "true",
        SMTP_FROM: "recovery@example.test",
        SMTP_USER: "",
        SMTP_PASSWORD: "",
        NODE_EXTRA_CA_CERTS: certificate,
      },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
    let output = "";
    app.stdout.resume();
    app.stderr.on("data", (chunk) => (output += String(chunk)));
    t.after(async () => {
      if (app.exitCode === null && !app.signalCode) {
        const exited = once(app, "exit");
        app.kill();
        await exited;
      }
    });
    const endpoint = "http://127.0.0.1:" + port + "/api/v1";
    for (let pass = 0; pass < 240; pass++) {
      if (app.exitCode !== null) assert.fail(output);
      let res;
      try {
        res = await fetch(endpoint + "/health/database", {
          signal: AbortSignal.timeout(2000),
        });
      } catch {
        /* Wait for startup. */
      }
      if (res?.ok) break;
      if (pass === 239) assert.fail("Could not start test API. " + output);
      await delay(250);
    }
    async function call(path, { body, access, status = 200 } = {}) {
      const response = await fetch(endpoint + path, {
        method: body === undefined ? "GET" : "POST",
        headers: {
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
          ...(access ? { Authorization: "Bearer " + access } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      assert.equal(response.status, status, path);
      return response.json();
    }
    const login = (who, pass = password, status = 200) =>
      call("/auth/login", {
        body: { username: who.username, password: pass },
        status,
      });
    async function resetToken(email) {
      const count = emails.length;
      const result = await call("/auth/forgot-password", {
        body: { email },
        status: 202,
      });
      assert.match(result.message, /If the account is eligible/);
      for (let i = 0; i < 100 && emails.length === count; i++) await delay(100);
      const message = emails
        .at(-1)
        ?.replace(/=\r?\n/g, "")
        .replace(/=3D/g, "=");
      const token = message?.match(
        /\/portal\/reset-password#token=([A-Za-z0-9_-]{43})/,
      )?.[1];
      assert(
        token,
        "Recovery email was not delivered to the isolated TLS SMTP sink.",
      );
      return token;
    }
    await t.test(
      "login, JWT roles, revocation, refresh rotation and reuse",
      async () => {
        await login(staff, "incorrect", 401);
        await call("/auth/context", { status: 401 });
        const a = await login(admin),
          s = await login(staff);
        assert.equal(a.actor.role, "ADMIN");
        assert.equal(s.actor.role, "STAFF");
        await call("/staff", { access: a.accessToken });
        await call("/staff", { access: s.accessToken, status: 403 });
        await call("/rooms", { access: s.accessToken });
        await call("/auth/context", { access: s.refreshToken, status: 401 });
        const rotated = await call("/auth/refresh", {
          body: { refreshToken: s.refreshToken },
        });
        assert.notEqual(rotated.refreshToken, s.refreshToken);
        const digest = (
          await pool.query(
            "SELECT refresh_token_hash FROM auth_sessions WHERE user_id=$1 AND revoked_at IS NULL",
            [staff.id],
          )
        ).rows[0].refresh_token_hash;
        assert.equal(digest, hashToken(rotated.refreshToken));
        await call("/auth/refresh", {
          body: { refreshToken: s.refreshToken },
          status: 401,
        });
        await call("/auth/context", {
          access: rotated.accessToken,
          status: 401,
        });
        await call("/auth/logout", { body: { refreshToken: a.refreshToken } });
        await call("/auth/context", { access: a.accessToken, status: 401 });
        await call("/auth/refresh", {
          body: { refreshToken: a.refreshToken },
          status: 401,
        });
      },
    );
    await t.test(
      "email recovery, one-time reset, expiry and change-password",
      async () => {
        const old = await login(staff);
        const previous = await resetToken(staff.email);
        const token = await resetToken(staff.email);
        const newPassword = "New fictional " + randomUUID();
        await call("/auth/reset-password", {
          body: { token: previous, password: newPassword },
          status: 400,
        });
        await call("/auth/reset-password", {
          body: { token, password: newPassword },
        });
        await call("/auth/reset-password", {
          body: { token, password: newPassword },
          status: 400,
        });
        await call("/auth/context", { access: old.accessToken, status: 401 });
        await login(staff, password, 401);
        const fresh = await login(staff, newPassword);
        const nextPassword = "Another fictional " + randomUUID();
        await call("/auth/change-password", {
          access: fresh.accessToken,
          body: { currentPassword: password, password: nextPassword },
          status: 400,
        });
        await call("/auth/change-password", {
          access: fresh.accessToken,
          body: { currentPassword: newPassword, password: nextPassword },
        });
        await call("/auth/context", { access: fresh.accessToken, status: 401 });
        const active = await login(staff, nextPassword);
        const expiring = await resetToken(staff.email);
        await pool.query(
          "UPDATE password_reset_tokens SET created_at=now()-interval '2 hours',expires_at=now()-interval '1 hour' WHERE token_hash=$1",
          [hashToken(expiring)],
        );
        await call("/auth/reset-password", {
          body: { token: expiring, password: newPassword },
          status: 400,
        });
        await pool.query(
          "UPDATE auth_sessions SET created_at=now()-interval '2 hours',expires_at=now()-interval '1 hour' WHERE user_id=$1 AND revoked_at IS NULL",
          [staff.id],
        );
        await call("/auth/context", {
          access: active.accessToken,
          status: 401,
        });
        await call("/auth/refresh", {
          body: { refreshToken: active.refreshToken },
          status: 401,
        });
        const count = emails.length;
        const generic = await call("/auth/forgot-password", {
          body: { email: "unlisted." + suffix + "@example.test" },
          status: 202,
        });
        assert.match(generic.message, /If the account is eligible/);
        assert.equal(emails.length, count);
      },
    );
    await t.test(
      "login throttling and security audit records exclude secrets",
      async () => {
        const unknown = { username: "unknown." + suffix };
        for (let i = 0; i < 8; i++) await login(unknown, "invalid", 401);
        await login(unknown, "invalid", 429);
        const entries = (
          await pool.query(
            "SELECT new_values FROM audit_logs WHERE module_name='auth' AND user_id=ANY($1::uuid[])",
            [fixtures],
          )
        ).rows;
        const events = entries.map((item) => item.new_values.event);
        for (const name of [
          "LOGIN",
          "LOGIN_FAILED",
          "LOGOUT",
          "REFRESH",
          "REFRESH_REUSE",
          "RESET_REQUEST",
          "RESET_COMPLETE",
          "PASSWORD_CHANGE",
          "ACCESS_DENIED",
        ])
          assert(events.includes(name), name);
        assert(
          entries.every((item) =>
            Object.keys(item.new_values).every((key) =>
              ["event", "permission"].includes(key),
            ),
          ),
        );
      },
    );
  },
);
