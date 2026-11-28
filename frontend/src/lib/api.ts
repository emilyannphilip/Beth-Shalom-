import { apiPrefix, type ApiPath } from "./api-path";
import type { PortalSession } from "@/features/portal/models";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message?: string,
  ) {
    super(
      message ||
        (status >= 500
          ? "The service is unavailable. Please try again."
          : "The request was not accepted."),
    );
    this.name = "ApiError";
  }
}

export const sessionExpiredEvent = "beth-shalom-session-expired";
const unprotected = new Set([
  "/auth/login",
  "/auth/session",
  "/auth/refresh",
  "/auth/logout",
  "/auth/forgot-password",
  "/auth/reset-password",
]);
const sessionWrites = new Set([
  "/auth/login",
  "/auth/logout",
  "/auth/refresh",
  "/auth/reset-password",
  "/auth/change-password",
]);
let sessionOperation = Promise.resolve();
let sessionInFlight: Promise<PortalSession | null> | undefined;
let signedOutUntil = 0;
let sessionGeneration = 0;

function browserRequest(path: ApiPath, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  if (init?.method && init.method !== "GET")
    headers.set("X-Beth-Shalom-CSRF", "1");
  return fetch(apiPrefix + path, { cache: "no-store", ...init, headers });
}

function serializeSessionOperation<T>(operation: () => Promise<T>): Promise<T> {
  // Cookie writes must finish before a different sign-in or refresh can start.
  const result = sessionOperation.then(() =>
    Promise.resolve(
      navigator.locks
        ? navigator.locks.request("beth-shalom-session", operation)
        : operation(),
    ),
  );
  sessionOperation = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

export function readPortalSession(): Promise<PortalSession | null> {
  if (sessionInFlight) return sessionInFlight;
  if (Date.now() < signedOutUntil) return Promise.resolve(null);
  const generation = sessionGeneration;
  sessionInFlight = serializeSessionOperation(() =>
    fetchApiJson<PortalSession | null>("/auth/session", { method: "POST" }),
  )
    .then((session) => {
      if (!session && generation === sessionGeneration)
        signedOutUntil = Date.now() + 2_000;
      return session;
    })
    .finally(() => {
      sessionInFlight = undefined;
    });
  return sessionInFlight;
}

export async function fetchApiJson<T>(
  path: ApiPath,
  init?: RequestInit,
): Promise<T> {
  let response: Response;
  const endpoint = path.split("?")[0];
  const browser = typeof window !== "undefined";
  const timeout = AbortSignal.timeout(15_000);
  const signal = init?.signal
    ? AbortSignal.any([init.signal, timeout])
    : timeout;
  const options = { ...init, signal };
  const writesSession = browser && sessionWrites.has(endpoint);
  if (writesSession) {
    sessionGeneration++;
    signedOutUntil = 0;
  }
  const request = () =>
    writesSession
      ? serializeSessionOperation(() => browserRequest(path, options))
      : browserRequest(path, options);
  try {
    response = await request();
    if (
      response.status === 401 &&
      browser &&
      !signal.aborted &&
      !endpoint.startsWith("/public/") &&
      !unprotected.has(endpoint)
    ) {
      const session = await readPortalSession();
      if (session && !signal.aborted) response = await request();
      if (response.status === 401 && !signal.aborted)
        window.dispatchEvent(new Event(sessionExpiredEvent));
    }
  } catch (error) {
    if (timeout.aborted && !init?.signal?.aborted)
      throw new ApiError(504, "The request timed out. Please try again.");
    if (
      error instanceof ApiError ||
      (error instanceof Error && error.name === "AbortError")
    )
      throw error;
    throw new ApiError(
      503,
      "The service could not be reached. Please try again.",
    );
  }
  const data = await response.json().catch(() => null);
  if (timeout.aborted && !init?.signal?.aborted)
    throw new ApiError(504, "The request timed out. Please try again.");
  if (!response.ok) {
    const message: unknown = data?.message;
    throw new ApiError(
      response.status,
      Array.isArray(message)
        ? message.join(" ")
        : typeof message === "string"
          ? message
          : undefined,
    );
  }
  return data as T;
}

export interface ApiPage<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function apiPath(
  path: ApiPath,
  params: Record<string, string | number | undefined> = {},
): ApiPath {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params))
    if (value !== undefined && value !== "") query.set(key, String(value));
  return query.size ? `${path}?${query}` : path;
}

export async function allRecords<T>(
  path: ApiPath,
  query: Record<string, string | number | undefined> = {},
  signal?: AbortSignal,
) {
  const rows: T[] = [];
  for (let page = 1; ; page++) {
    const result = await fetchApiJson<ApiPage<T>>(
      apiPath(path, { ...query, page, limit: 100 }),
      { signal },
    );
    rows.push(...result.data);
    if (page >= result.totalPages) return rows;
  }
}

export const jsonRequest = (method: string, body?: unknown): RequestInit => ({
  method,
  ...(body === undefined
    ? {}
    : {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
});

export const errorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "The request could not be completed.";
