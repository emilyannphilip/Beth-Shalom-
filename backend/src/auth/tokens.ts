import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { sign, verify } from "jsonwebtoken";
import { isUUID } from "class-validator";

type Purpose = "access" | "refresh";
const issuer = "beth-shalom";
const audience = "beth-shalom-portal";

export const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export const equalHash = (a: string, b: string) =>
  /^[0-9a-f]{64}$/.test(a) &&
  /^[0-9a-f]{64}$/.test(b) &&
  timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));

function secret(config: ConfigService, name: string) {
  const value = config.get<string>(name);
  if (!value || value.length < 48)
    throw Error(
      name + " must contain at least 48 characters of random secret material.",
    );
  return value;
}
function seconds(
  config: ConfigService,
  name: string,
  fallback: number,
  max: number,
) {
  const value = Number(config.get<string>(name) ?? fallback);
  if (!Number.isSafeInteger(value) || value < 1 || value > max)
    throw Error(name + " is out of range.");
  return value;
}

@Injectable()
export class SessionTokens {
  private readonly keys: Record<Purpose, string>;
  readonly accessSeconds: number;
  readonly refreshSeconds: number;
  constructor(config: ConfigService) {
    this.keys = {
      access: secret(config, "AUTH_ACCESS_SECRET"),
      refresh: secret(config, "AUTH_REFRESH_SECRET"),
    };
    if (this.keys.access === this.keys.refresh)
      throw Error("Configure different access and refresh secrets.");
    this.accessSeconds = seconds(config, "AUTH_ACCESS_SECONDS", 600, 1800);
    this.refreshSeconds = seconds(
      config,
      "AUTH_REFRESH_SECONDS",
      604800,
      2592000,
    );
    if (this.accessSeconds >= this.refreshSeconds)
      throw Error("The refresh lifetime must exceed the access lifetime.");
  }
  issue(userId: string, sessionId: string, expiry: Date) {
    const now = Math.floor(Date.now() / 1000);
    const absolute = Math.floor(expiry.getTime() / 1000);
    const accessExpiry = Math.min(absolute, now + this.accessSeconds);
    if (absolute <= now)
      throw new UnauthorizedException("The session has expired.");
    const token = (purpose: Purpose, exp: number) =>
      sign({ sid: sessionId, purpose, exp }, this.keys[purpose], {
        algorithm: "HS256",
        issuer,
        audience,
        subject: userId,
        jwtid: randomUUID(),
      });
    return {
      accessToken: token("access", accessExpiry),
      refreshToken: token("refresh", absolute),
      accessExpiresIn: accessExpiry - now,
      refreshExpiresIn: absolute - now,
    };
  }
  read(token: string, purpose: Purpose) {
    try {
      const claim = verify(token, this.keys[purpose], {
        algorithms: ["HS256"],
        issuer,
        audience,
      });
      if (
        typeof claim === "string" ||
        claim.purpose !== purpose ||
        !isUUID(claim.sub) ||
        !isUUID(claim.sid) ||
        !isUUID(claim.jti) ||
        !Number.isSafeInteger(claim.exp)
      )
        throw Error("Invalid claims.");
      return { userId: claim.sub!, sessionId: claim.sid as string };
    } catch {
      throw new UnauthorizedException("Sign in to continue.");
    }
  }
}
