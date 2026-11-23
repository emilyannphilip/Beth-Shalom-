import { apiPrefix, type ApiPath } from "./api-path";

export class ApiError extends Error {
  constructor(readonly status: number) {
    super(`API request failed with status ${status}.`);
    this.name = "ApiError";
  }
}

/** Fetch JSON through the same-origin API proxy from browser code. */
export async function fetchApiJson(path: ApiPath, init?: RequestInit): Promise<unknown> {
  const response = await fetch(`${apiPrefix}${path}`, init);

  if (!response.ok) {
    throw new ApiError(response.status);
  }

  return (await response.json()) as unknown;
}
