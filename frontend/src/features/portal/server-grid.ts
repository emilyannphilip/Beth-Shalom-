"use client";

import { useCallback, useEffect, useState } from "react";
import { apiPath, fetchApiJson, type ApiPage } from "@/lib/api";
import { availabilityRefreshMs, useApiResource } from "@/lib/api-hooks";
import type { ApiPath } from "@/lib/api-path";
import type { Row } from "./portal-api";

export type Filters = {
  search: string;
  category: string;
  floor: string;
  status: string;
  sort: string;
};
export type Query = Record<string, string | number | undefined>;

export function useServerGrid<T>(
  path: ApiPath,
  pageSize: number,
  map: (row: Row) => T,
  query: (filters: Filters) => Query,
) {
  const [search, changeSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedSearch(search.trim().slice(0, 150)),
      250,
    );
    return () => window.clearTimeout(timer);
  }, [search]);
  const [category, changeCategory] = useState("ALL");
  const [status, changeStatus] = useState("ALL");
  const [floor, changeFloor] = useState("ALL");
  const [sort, changeSort] = useState("newest");
  const [page, setPage] = useState(1);
  const params = query({
    search: debouncedSearch,
    category,
    floor,
    status,
    sort,
  });
  const url = apiPath(path, { ...params, page, limit: pageSize });
  const load = useCallback(
    (signal: AbortSignal) => fetchApiJson<ApiPage<Row>>(url, { signal }),
    [url],
  );
  const liveInventory = [
    "/accommodation-categories",
    "/rooms",
    "/dormitories",
    "/beds",
    "/residents",
  ].includes(path);
  const resource = useApiResource(
    url,
    load,
    liveInventory ? availabilityRefreshMs : 0,
  );
  const pages = Math.max(1, resource.data?.totalPages ?? 1);
  const current = resource.data?.page ?? page;
  const visible = (resource.data?.data ?? []).map(map);
  const total = resource.data?.total ?? 0;
  useEffect(() => {
    if (resource.data && page > pages) {
      const frame = requestAnimationFrame(() => setPage(pages));
      return () => cancelAnimationFrame(frame);
    }
  }, [resource.data, page, pages]);
  function setter(change: (value: string) => void) {
    return (value: string) => {
      change(value);
      setPage(1);
    };
  }
  const offset = (current - 1) * pageSize;
  return {
    visible,
    total,
    pages,
    current,
    setPage,
    search,
    category,
    floor,
    status,
    sort,
    params,
    range: visible.length ? `${offset + 1}–${offset + visible.length}` : "0",
    setSearch: setter(changeSearch),
    setCategory: setter(changeCategory),
    setFloor: setter(changeFloor),
    setStatus: setter(changeStatus),
    setSort: setter(changeSort),
    loading: resource.loading,
    error: resource.error,
    retry: resource.retry,
  };
}
