import { type NextRequest, NextResponse } from "next/server";
import { apiPrefix } from "./api-path";

export function apiOrigin() {
  const origin = new URL(process.env.API_ORIGIN ?? "http://127.0.0.1:3001");
  if (
    !["http:", "https:"].includes(origin.protocol) ||
    origin.href !== origin.origin + "/"
  )
    throw Error("API_ORIGIN must be an HTTP(S) origin.");
  return origin;
}

function portalOrigin() {
  const configured = process.env.PORTAL_ORIGIN;
  if (!configured && process.env.NODE_ENV === "production")
    throw Error("PORTAL_ORIGIN is required.");
  const origin = new URL(configured ?? "http://127.0.0.1:3000");
  const loopback = ["127.0.0.1", "localhost", "[::1]"].includes(
    origin.hostname,
  );
  if (
    origin.href !== origin.origin + "/" ||
    !(
      origin.protocol === "https:" ||
      (process.env.NODE_ENV !== "production" &&
        loopback &&
        origin.protocol === "http:")
    )
  )
    throw Error("PORTAL_ORIGIN must be HTTPS except for loopback development.");
  return origin;
}

export function cookieSettings() {
  const secure = portalOrigin().protocol === "https:";
  const prefix = secure ? "__Host-" : "";
  return {
    access: prefix + "beth_access",
    refresh: prefix + "beth_refresh",
    options: { httpOnly: true, secure, sameSite: "strict" as const, path: "/" },
  };
}

export function validMutation(request: NextRequest) {
  const site = request.headers.get("sec-fetch-site");
  return (
    request.headers.get("origin") === portalOrigin().origin &&
    request.headers.get("x-beth-shalom-csrf") === "1" &&
    (!site || site === "same-origin" || site === "none")
  );
}

export function jsonError(status: number, message: string) {
  return NextResponse.json(
    { statusCode: status, message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
export async function forward(path: string, options: RequestInit = {}) {
  const url = new URL(apiPrefix + path, apiOrigin());
  return fetch(url, {
    ...options,
    cache: "no-store",
    redirect: "error",
    signal: options.signal
      ? AbortSignal.any([options.signal, AbortSignal.timeout(12_000)])
      : AbortSignal.timeout(12_000),
  });
}

export function clearSession(response: NextResponse) {
  const { access, refresh, options } = cookieSettings();
  response.cookies.set(access, "", { ...options, maxAge: 0 });
  response.cookies.set(refresh, "", { ...options, maxAge: 0 });
}
