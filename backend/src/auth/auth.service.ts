import { randomBytes, randomUUID } from "node:crypto";
import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { Database, type Sql } from "../database/database.module";
import { hashPassword, verifyPassword } from "./passwords";
import { SessionTokens, hashToken, equalHash } from "./tokens";
import { AuthLimit, authAudit } from "./security";
import { RecoveryMail } from "./recovery-mail";

type User = {
  id: string;
  name: string;
  role: "ADMIN" | "STAFF";
  password_hash: string;
  email: string;
};
const users =
  "SELECT u.id,u.full_name AS name,r.name AS role,u.password_hash,u.email FROM users u JOIN roles r ON r.id=u.role_id WHERE u.status='ACTIVE' AND u.deleted_at IS NULL AND r.name IN ('ADMIN','STAFF')";
const identity = (user: User) => ({
  id: user.id,
  name: user.name,
  role: user.role,
});
const credentialError = () =>
  new UnauthorizedException("The username or password is incorrect.");
const resetError = () =>
  new BadRequestException("The reset link is invalid or has expired.");

@Injectable()
export class Authentication {
  constructor(
    private readonly db: Database,
    private readonly tokens: SessionTokens,
    private readonly limits: AuthLimit,
    private readonly mail: RecoveryMail,
  ) {}

  async login(username: string, password: string, network: string) {
    const handle = username.trim().toLowerCase();
    this.limits.consumeNetwork("login", network);
    const user = (
      await this.db.query<User>(
        users +
          " AND (lower(u.username)=$1 OR lower(u.staff_number)=$1) ORDER BY (lower(u.username)=$1) DESC LIMIT 1",
        [handle],
      )
    ).rows[0];
    const account = user?.id ?? "unknown:" + handle;
    this.limits.consumeAccount("login", account, 8);
    if (!(await verifyPassword(password, user?.password_hash)) || !user) {
      await authAudit(this.db, "LOGIN_FAILED", user?.id);
      throw credentialError();
    }
    const upgraded = user.password_hash.startsWith("scrypt:")
      ? await hashPassword(password)
      : null;
    const result = await this.db.transaction(async (sql) => {
      const current = (
        await sql.query<User>(users + " AND u.id=$1 FOR UPDATE OF u", [user.id])
      ).rows[0];
      if (!current || current.password_hash !== user.password_hash)
        throw credentialError();
      const sid = randomUUID(),
        deadline = new Date(Date.now() + this.tokens.refreshSeconds * 1000);
      const pair = this.tokens.issue(user.id, sid, deadline);
      await sql.query(
        "INSERT INTO auth_sessions(id,user_id,refresh_token_hash,expires_at) VALUES($1,$2,$3,$4)",
        [sid, user.id, hashToken(pair.refreshToken), deadline],
      );
      await sql.query(
        "UPDATE users SET last_login_at=now(),password_hash=coalesce($2,password_hash) WHERE id=$1",
        [user.id, upgraded],
      );
      await authAudit(sql, "LOGIN", user.id, sid);
      return { ...pair, actor: identity(current) };
    });
    this.limits.clearAccount("login", account);
    return result;
  }

  async refresh(token: string) {
    const { userId, sessionId } = this.tokens.read(token, "refresh");
    const result = await this.db.transaction(async (sql) => {
      const user = (
        await sql.query<User>(users + " AND u.id=$1 FOR UPDATE OF u", [userId])
      ).rows[0];
      if (!user) return null;
      const session = (
        await sql.query<{ refresh_token_hash: string; expires_at: Date }>(
          "SELECT refresh_token_hash,expires_at FROM auth_sessions WHERE id=$1 AND user_id=$2 AND revoked_at IS NULL AND expires_at>now() FOR UPDATE",
          [sessionId, userId],
        )
      ).rows[0];
      if (!session) return null;
      if (!equalHash(hashToken(token), session.refresh_token_hash)) {
        await sql.query(
          "UPDATE auth_sessions SET revoked_at=now() WHERE id=$1",
          [sessionId],
        );
        await authAudit(sql, "REFRESH_REUSE", userId, sessionId);
        return null;
      }
      const pair = this.tokens.issue(userId, sessionId, session.expires_at);
      await sql.query(
        "UPDATE auth_sessions SET refresh_token_hash=$2 WHERE id=$1",
        [sessionId, hashToken(pair.refreshToken)],
      );
      await authAudit(sql, "REFRESH", userId, sessionId);
      return { ...pair, actor: identity(user) };
    });
    if (!result)
      throw new UnauthorizedException(
        "The session has expired. Sign in again.",
      );
    return result;
  }

  async logout(refresh?: string, access?: string) {
    let claim: ReturnType<SessionTokens["read"]> | undefined;
    if (refresh)
      try {
        claim = this.tokens.read(refresh, "refresh");
      } catch {
        /* Fall back to access. */
      }
    if (!claim && access)
      try {
        claim = this.tokens.read(access, "access");
      } catch {
        /* Already expired. */
      }
    if (!claim) return;
    const { userId, sessionId } = claim;
    await this.db.transaction(async (sql) => {
      const change = await sql.query(
        "UPDATE auth_sessions SET revoked_at=now() WHERE id=$1 AND user_id=$2 AND revoked_at IS NULL",
        [sessionId, userId],
      );
      if (change.rowCount) await authAudit(sql, "LOGOUT", userId, sessionId);
    });
  }

  async forgot(email: string, network: string) {
    const address = email.trim().toLowerCase();
    this.limits.consume("forgot", network, address, 4);
    const user = (
      await this.db.query<User>(users + " AND lower(u.email)=$1", [address])
    ).rows[0];
    if (user && this.mail.enabled) await this.requestRecovery(user.id);
    else await authAudit(this.db, "RESET_REQUEST", user?.id);
  }

  async adminRecovery(userId: string, actorId: string, network: string) {
    this.limits.consume("admin-recovery", network, actorId, 8);
    if (!this.mail.enabled)
      throw new ServiceUnavailableException(
        "Password recovery email has not been configured.",
      );
    await this.requestRecovery(userId, actorId);
  }

  private async requestRecovery(userId: string, requestedBy?: string) {
    const token = randomBytes(32).toString("base64url");
    const result = await this.db.transaction(async (sql) => {
      const user = (
        await sql.query<User>(users + " AND u.id=$1 FOR UPDATE OF u", [userId])
      ).rows[0];
      if (!user) return;
      await sql.query(
        "UPDATE password_reset_tokens SET used_at=now() WHERE user_id=$1 AND used_at IS NULL",
        [userId],
      );
      const row = (
        await sql.query<{ id: string }>(
          "INSERT INTO password_reset_tokens(user_id,token_hash,expires_at) VALUES($1,$2,now()+interval '30 minutes') RETURNING id",
          [userId, hashToken(token)],
        )
      ).rows[0];
      await authAudit(sql, "RESET_REQUEST", requestedBy ?? userId, row.id);
      return user.email;
    });
    if (result) void this.mail.send(result, token);
  }

  async reset(token: string, password: string, network: string) {
    const digest = hashToken(token);
    this.limits.consume("reset", network, digest, 6);
    const candidate = (
      await this.db.query<{ id: string; user_id: string }>(
        "SELECT id,user_id FROM password_reset_tokens WHERE token_hash=$1 AND used_at IS NULL AND expires_at>now()",
        [digest],
      )
    ).rows[0];
    if (!candidate) throw resetError();
    const passwordHash = await hashPassword(password);
    await this.db.transaction(async (sql) => {
      const user = (
        await sql.query<User>(users + " AND u.id=$1 FOR UPDATE OF u", [
          candidate.user_id,
        ])
      ).rows[0];
      if (!user) throw resetError();
      const used = await sql.query(
        "UPDATE password_reset_tokens SET used_at=now() WHERE id=$1 AND user_id=$2 AND used_at IS NULL AND expires_at>now()",
        [candidate.id, user.id],
      );
      if (!used.rowCount) throw resetError();
      await this.replacePassword(sql, user.id, passwordHash);
      await authAudit(sql, "RESET_COMPLETE", user.id, candidate.id);
    });
  }

  async change(
    userId: string,
    currentPassword: string,
    password: string,
    network: string,
  ) {
    this.limits.consume("change", network, userId, 8);
    if (currentPassword === password)
      throw new BadRequestException("Choose a different password.");
    const user = (await this.db.query<User>(users + " AND u.id=$1", [userId]))
      .rows[0];
    if (!user || !(await verifyPassword(currentPassword, user.password_hash)))
      throw new BadRequestException("The current password is incorrect.");
    const passwordHash = await hashPassword(password);
    await this.db.transaction(async (sql) => {
      const current = (
        await sql.query<User>(users + " AND u.id=$1 FOR UPDATE OF u", [userId])
      ).rows[0];
      if (!current || current.password_hash !== user.password_hash)
        throw new UnauthorizedException("Sign in again.");
      await this.replacePassword(sql, userId, passwordHash);
      await authAudit(sql, "PASSWORD_CHANGE", userId);
    });
  }

  private async replacePassword(sql: Sql, id: string, passwordHash: string) {
    await sql.query("UPDATE users SET password_hash=$2 WHERE id=$1", [
      id,
      passwordHash,
    ]);
    await sql.query(
      "UPDATE auth_sessions SET revoked_at=now() WHERE user_id=$1 AND revoked_at IS NULL",
      [id],
    );
    await sql.query(
      "UPDATE password_reset_tokens SET used_at=now() WHERE user_id=$1 AND used_at IS NULL",
      [id],
    );
  }
}
