import { type NextRequest, NextResponse } from "next/server";
import { apiPrefix } from "@/lib/api-path";
import {
  clearSession,
  cookieSettings,
  forward,
  jsonError,
  validMutation,
} from "@/lib/api-server";

const resources = new Set([
  "staff",
  "roles",
  "permissions",
  "enquiries",
  "enquiry-categories",
  "visit-requests",
  "residents",
  "accommodation-categories",
  "buildings",
  "rooms",
  "dormitories",
  "beds",
  "allocations",
  "reservations",
  "dashboard",
  "audit-logs",
]);
const publicRoutes = new Set([
  "GET public/enquiry-categories",
  "GET public/availability",
  "POST public/enquiries",
  "GET health",
  "GET health/database",
]);
const authRoutes = new Set([
  "GET auth/context",
  "POST auth/session",
  "POST auth/login",
  "POST auth/refresh",
  "POST auth/logout",
  "POST auth/forgot-password",
  "POST auth/reset-password",
  "POST auth/change-password",
]);
const cookieActions = new Set(["auth/refresh", "auth/logout"]);
const unauthenticated = new Set([
  "auth/login",
  "auth/refresh",
  "auth/logout",
  "auth/forgot-password",
  "auth/reset-password",
]);
type Context = { params: Promise<{ path: string[] }> };
type Actor = { id: string; name: string; role: "ADMIN" | "STAFF" };
type TokenPair = {
  accessToken: string;
  refreshToken: string;
  accessExpiresIn: number;
  refreshExpiresIn: number;
  actor: Actor;
};
const noCache = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json",
};

function browserActor(actor: Actor) {
  return { id: actor.id, name: actor.name, role: actor.role.toLowerCase() };
}

function setSessionCookies(response: NextResponse, pair: TokenPair) {
  const { access, refresh, options } = cookieSettings();
  response.cookies.set(access, pair.accessToken, {
    ...options,
    maxAge: pair.accessExpiresIn,
  });
  response.cookies.set(refresh, pair.refreshToken, {
    ...options,
    maxAge: pair.refreshExpiresIn,
  });
}

async function browserSession(request: NextRequest, signal: AbortSignal) {
  const names = cookieSettings();
  const access = request.cookies.get(names.access)?.value;
  const refresh = request.cookies.get(names.refresh)?.value;

  if (access) {
    const current = await forward("/auth/context", {
      headers: { Authorization: "Bearer " + access },
      signal,
    });
    if (current.ok) {
      const actor = (await current.json()) as Actor;
      return NextResponse.json(browserActor(actor), { headers: noCache });
    }
    if (current.status !== 401)
      return jsonError(503, "The portal could not verify your session.");
  }

  if (refresh) {
    try {
      const renewed = await forward("/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
        signal,
      });
      if (renewed.ok) {
        const pair = (await renewed.json()) as TokenPair;
        const reply = NextResponse.json(browserActor(pair.actor), {
          headers: noCache,
        });
        setSessionCookies(reply, pair);
        return reply;
      }
      if (renewed.status !== 401)
        return jsonError(
          503,
          "The portal could not renew your session. Try again.",
        );
    } catch {
      return jsonError(
        503,
        "The portal could not renew your session. Try again.",
      );
    }
  }

  const reply = NextResponse.json(null, { headers: noCache });
  if (access || refresh) clearSession(reply);
  return reply;
}

async function route(request: NextRequest, context: Context) {
  const timeout = AbortSignal.timeout(12_000);
  const signal = AbortSignal.any([request.signal, timeout]);
  try {
    const { path } = await context.params;
    if (path.some((segment) => !/^[-\da-z]+$/i.test(segment)))
      return jsonError(404, "API route not found.");
    const joined = path.join("/");
    const signature = request.method + " " + joined;
    const publicRoute = publicRoutes.has(signature);
    const authRoute = authRoutes.has(signature);
    if (!publicRoute && !authRoute && !resources.has(path[0]))
      return jsonError(404, "API route not found.");

    const headers = new Headers();
    const isWrite = request.method !== "GET";
    if (!publicRoute && isWrite && !validMutation(request))
      return jsonError(
        403,
        "This request must come from the Beth Shalom portal.",
      );
    if (joined === "auth/session") return await browserSession(request, signal);
    let body = isWrite ? await request.text() : undefined;
    if (body && body.length > 100000)
      return jsonError(413, "The request is too large.");
    if (
      body &&
      !request.headers.get("content-type")?.startsWith("application/json")
    )
      return jsonError(415, "Expected a JSON request.");
    if (!publicRoute) {
      const cookies = cookieSettings();
      const access = request.cookies.get(cookies.access)?.value;
      const refresh = request.cookies.get(cookies.refresh)?.value;
      if (!unauthenticated.has(joined) && !access)
        return jsonError(401, "Sign in to continue.");
      if (access) headers.set("Authorization", "Bearer " + access);
      if (cookieActions.has(joined)) {
        if (joined === "auth/refresh" && !refresh)
          return jsonError(401, "The session has expired. Sign in again.");
        body = JSON.stringify({ refreshToken: refresh });
      }
    }
    if (body) headers.set("Content-Type", "application/json");
    const response = await forward("/" + joined + request.nextUrl.search, {
      method: request.method,
      headers,
      body,
      signal,
    });
    if (response.ok && (joined === "auth/login" || joined === "auth/refresh")) {
      const pair = (await response.json()) as TokenPair;
      const reply = NextResponse.json(browserActor(pair.actor), {
        headers: noCache,
      });
      setSessionCookies(reply, pair);
      return reply;
    }
    const payload = await response.text();
    if (response.status === 404) {
      const endpoint = request.method + " " + apiPrefix + "/" + joined;
      let message: unknown;
      try {
        message = JSON.parse(payload)?.message;
      } catch {
        // Keep the original response when the upstream did not send a NestJS error.
      }
      if (
        message === "Cannot " + endpoint ||
        message === "Cannot " + endpoint + request.nextUrl.search
      )
        return jsonError(
          404,
          "The configured Beth Shalom backend does not expose " +
            endpoint +
            ". Use the matching backend build, then try again.",
        );
    }
    const reply = new NextResponse(payload, {
      status: response.status,
      headers: noCache,
    });
    if (
      (response.ok &&
        (joined === "auth/logout" ||
          joined === "auth/change-password" ||
          joined === "auth/reset-password")) ||
      (response.status === 401 && joined === "auth/refresh")
    )
      clearSession(reply);
    return reply;
  } catch {
    if (timeout.aborted)
      return jsonError(504, "The Beth Shalom API timed out. Please try again.");
    return jsonError(
      503,
      "The Beth Shalom API is unavailable. Please try again.",
    );
  }
}
export {
  route as GET,
  route as POST,
  route as PATCH,
  route as PUT,
  route as DELETE,
};
