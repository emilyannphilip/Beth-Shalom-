import { randomUUID } from "node:crypto";
import { HttpException, Injectable } from "@nestjs/common";
import type { Sql } from "../database/database.module";
import { hashToken } from "./tokens";

type SecurityEvent =
  | "LOGIN"
  | "LOGIN_FAILED"
  | "LOGOUT"
  | "REFRESH"
  | "REFRESH_REUSE"
  | "RESET_REQUEST"
  | "RESET_COMPLETE"
  | "PASSWORD_CHANGE"
  | "ACCESS_DENIED";
const actions: Record<SecurityEvent, string> = {
  LOGIN: "CREATE",
  LOGIN_FAILED: "CREATE",
  LOGOUT: "UPDATE",
  REFRESH: "UPDATE",
  REFRESH_REUSE: "UPDATE",
  RESET_REQUEST: "CREATE",
  RESET_COMPLETE: "UPDATE",
  PASSWORD_CHANGE: "UPDATE",
  ACCESS_DENIED: "CREATE",
};

export async function authAudit(
  sql: Sql,
  event: SecurityEvent,
  userId?: string | null,
  sessionId?: string,
  permission?: string,
) {
  await sql.query(
    "INSERT INTO audit_logs(user_id,module_name,record_id,action,new_values) VALUES($1,'auth',$2,$3,$4)",
    [
      userId ?? null,
      sessionId ?? userId ?? randomUUID(),
      actions[event],
      JSON.stringify({ event, ...(permission ? { permission } : {}) }),
    ],
  );
}

@Injectable()
export class AuthLimit {
  private readonly windows = new Map<
    string,
    { count: number; until: number }
  >();
  consume(
    action: string,
    network: string,
    identity: string,
    accountLimit: number,
  ) {
    this.consumeNetwork(action, network);
    this.consumeAccount(action, identity, accountLimit);
  }
  consumeNetwork(action: string, network: string) {
    this.consumeWindow(action + ":network:" + hashToken(network), 100);
  }
  consumeAccount(action: string, identity: string, limit: number) {
    this.consumeWindow(action + ":account:" + hashToken(identity), limit);
  }
  private consumeWindow(key: string, limit: number) {
    const now = Date.now();
    if (this.windows.size >= 10000) {
      for (const [entry, window] of this.windows)
        if (window.until <= now) this.windows.delete(entry);
    }
    const current = this.windows.get(key);
    const window =
      current && current.until > now
        ? current
        : { count: 0, until: now + 60_000 };
    if (window.count >= limit || (!current && this.windows.size >= 10000))
      throw new HttpException(
        "Too many attempts. Please try again in a minute.",
        429,
      );
    window.count++;
    this.windows.set(key, window);
  }
  clearAccount(action: string, identity: string) {
    this.windows.delete(action + ":account:" + hashToken(identity));
  }
}
