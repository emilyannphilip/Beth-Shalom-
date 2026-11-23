"use client";

import { useState, type ComponentProps, type ReactNode } from "react";

export function useGrid<T>(
  items: T[],
  {
    pageSize,
    searchValue,
    categoryValue,
    statusValue,
    compare,
  }: {
    pageSize: number;
    searchValue: (row: T) => string;
    categoryValue: (row: T) => string;
    statusValue: (row: T) => string;
    compare?: (first: T, second: T, sort: string) => number;
  },
) {
  const [search, changeSearch] = useState("");
  const [category, changeCategory] = useState("ALL");
  const [status, changeStatus] = useState("ALL");
  const [sort, changeSort] = useState("newest");
  const [page, setPage] = useState(1);

  const query = search.trim().toLowerCase();
  const matched = items.filter(
    (row) =>
      (!query || searchValue(row).toLowerCase().includes(query)) &&
      (category === "ALL" || categoryValue(row) === category) &&
      (status === "ALL" || statusValue(row) === status),
  );
  if (compare) matched.sort((first, second) => compare(first, second, sort));

  const pages = Math.max(1, Math.ceil(matched.length / pageSize));
  const current = Math.min(page, pages);
  const offset = (current - 1) * pageSize;
  const visible = matched.slice(offset, offset + pageSize);

  return {
    matched,
    visible,
    pages,
    current,
    setPage,
    range: matched.length ? `${offset + 1}–${offset + visible.length}` : "0",
    search,
    category,
    status,
    sort,
    setSearch(value: string) {
      changeSearch(value);
      setPage(1);
    },
    setCategory(value: string) {
      changeCategory(value);
      setPage(1);
    },
    setStatus(value: string) {
      changeStatus(value);
      setPage(1);
    },
    setSort(value: string) {
      changeSort(value);
      setPage(1);
    },
  };
}

export function PortalTable(props: ComponentProps<"table">) {
  return <table {...props} />;
}

export function TableRows<T extends { id: string }>({
  rows,
  columns,
  render,
  ...props
}: ComponentProps<"tbody"> & {
  rows: T[];
  columns: number;
  render: (row: T) => ReactNode;
}) {
  return (
    <tbody {...props}>
      {rows.length === 0 ? (
        <tr>
          <td colSpan={columns} className="px-4 py-5 text-on-surface-variant">
            No matching sample records.
          </td>
        </tr>
      ) : (
        rows.map(render)
      )}
    </tbody>
  );
}

export interface PageControls {
  current: number;
  pages: number;
  setPage: (value: number) => void;
}

type ButtonStyle = { label: string; className: string };
type PaginationStyle = {
  className: string;
  previous: ButtonStyle;
  next: ButtonStyle;
  active: string;
  ordinary: string;
  slots: Array<number | "ellipsis">;
};
export function Pagination({
  grid,
  design,
}: {
  grid: PageControls;
  design: PaginationStyle;
}) {
  const { current, pages, setPage } = grid;
  const values =
    pages <= 3
      ? design.slots
      : Array.from({ length: pages }, (_, index) => index + 1).filter(
          (value) =>
            value === 1 || value === pages || Math.abs(value - current) <= 1,
        );
  return (
    <nav className={design.className} aria-label="Table pagination">
      <button
        type="button"
        className={design.previous.className}
        disabled={current === 1}
        onClick={() => setPage(current - 1)}
      >
        {design.previous.label}
      </button>
      {values.map((value, index) =>
        value === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-2 py-1 text-outline">
            …
          </span>
        ) : (
          <button
            key={value}
            type="button"
            aria-current={value === current ? "page" : undefined}
            className={
              value === current
                ? design.active
                : `${design.ordinary}${value > pages ? " opacity-50" : ""}`
            }
            disabled={value > pages}
            onClick={() => setPage(value)}
          >
            {value}
          </button>
        ),
      )}
      <button
        type="button"
        className={
          design.next.className + (current === pages ? " opacity-50" : "")
        }
        disabled={current === pages}
        onClick={() => setPage(current + 1)}
      >
        {design.next.label}
      </button>
    </nav>
  );
}

export function GridSearch({
  onValueChange,
  ...props
}: Omit<ComponentProps<"input">, "onChange"> & {
  onValueChange: (value: string) => void;
}) {
  return (
    <input
      {...props}
      type="search"
      onChange={(event) => onValueChange(event.currentTarget.value)}
    />
  );
}

export function GridSelect({
  onValueChange,
  ...props
}: Omit<ComponentProps<"select">, "onChange"> & {
  onValueChange: (value: string) => void;
}) {
  return (
    <select
      {...props}
      onChange={(event) => onValueChange(event.currentTarget.value)}
    />
  );
}
