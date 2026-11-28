"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { ApiError, errorMessage, fetchApiJson, jsonRequest } from "./api";
import type { ApiPath } from "./api-path";

let revision = 0;
const listeners = new Set<() => void>();
let availabilityEvents: BroadcastChannel | undefined;
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  if (!availabilityEvents && typeof BroadcastChannel !== "undefined") {
    availabilityEvents = new BroadcastChannel("beth-shalom-availability");
    availabilityEvents.onmessage = ({ data }) => {
      if (data === "availability-changed") invalidateApi();
    };
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      availabilityEvents?.close();
      availabilityEvents = undefined;
    }
  };
};
const version = () => revision;

export function invalidateApi() {
  revision++;
  for (const listener of listeners) listener();
}

export async function writeApi<T>(
  path: ApiPath,
  method: string,
  data?: unknown,
) {
  const result = await fetchApiJson<T>(path, jsonRequest(method, data));
  invalidateApi();
  if (
    /^\/(accommodation-categories|buildings|rooms|dormitories|beds|allocations|reservations|residents)(\/|$)/.test(
      path,
    )
  )
    availabilityEvents?.postMessage("availability-changed");
  return result;
}

export const availabilityRefreshMs = 10_000;

export function useApiResource<T>(
  key: string | null,
  load: (signal: AbortSignal) => Promise<T>,
  refreshMs = 0,
) {
  const current = useSyncExternalStore(subscribe, version, () => 0);
  const [retryCount, setRetryCount] = useState(0);
  const missing = useRef<{ key: string; retryCount: number } | null>(null);
  const retry = useCallback(() => setRetryCount((count) => count + 1), []);
  const [previousKey, setPreviousKey] = useState(key);
  const [settled, setSettled] = useState<{
    key: string;
    retryCount: number;
    data?: T;
    error?: string;
  }>();
  if (key !== previousKey) {
    setPreviousKey(key);
    setSettled(undefined);
  }
  useEffect(() => {
    if (!key) {
      missing.current = null;
      return;
    }
    if (
      missing.current?.key === key &&
      missing.current.retryCount === retryCount
    )
      return;
    missing.current = null;
    const controller = new AbortController();
    let running = false;
    let lastRefresh = 0;
    let timer: number | undefined;

    function schedule() {
      if (!refreshMs || controller.signal.aborted) return;
      timer = window.setTimeout(() => {
        if (document.visibilityState === "visible") void refresh();
      }, refreshMs);
    }

    async function refresh() {
      if (running || controller.signal.aborted || !key || missing.current)
        return;
      running = true;
      window.clearTimeout(timer);
      try {
        const data = await load(controller.signal);
        if (!controller.signal.aborted) setSettled({ key, retryCount, data });
        schedule();
      } catch (error) {
        if (!controller.signal.aborted) {
          if (error instanceof ApiError && error.status === 404)
            missing.current = { key, retryCount };
          setSettled({ key, retryCount, error: errorMessage(error) });
        }
      } finally {
        lastRefresh = Date.now();
        running = false;
      }
    }

    function refreshWhenVisible() {
      if (
        document.visibilityState === "visible" &&
        Date.now() - lastRefresh >= Math.min(refreshMs, 2_000)
      )
        void refresh();
    }

    void refresh();
    if (refreshMs) {
      window.addEventListener("focus", refreshWhenVisible);
      document.addEventListener("visibilitychange", refreshWhenVisible);
    }
    return () => {
      controller.abort();
      window.clearTimeout(timer);
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [key, load, current, refreshMs, retryCount]);

  const visible =
    key && settled?.key === key && settled.retryCount === retryCount
      ? settled
      : undefined;
  return {
    data: visible?.data,
    error: visible?.error,
    loading: Boolean(key) && !visible,
    retry,
  };
}
