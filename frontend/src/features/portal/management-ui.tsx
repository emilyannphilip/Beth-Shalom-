"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { useServerGrid, type Filters, type Query } from "./server-grid";
import { PortalDataStatus } from "./portal-session";
import type { ApiPath } from "@/lib/api-path";
import { errorMessage } from "@/lib/api";
import { floorLabel } from "../accommodation/availability";
import { s as fieldText, type Row } from "./portal-api";
import { PortalDialog } from "./portal-dialog";
import { GridSearch, GridSelect, Pagination } from "./grid";

export const managementButton =
  "px-3 py-2 rounded-lg border border-outline-variant text-primary bg-white text-label-md font-semibold";
export const primaryButton =
  "px-4 py-2 rounded-lg bg-primary text-on-primary text-label-md font-semibold";
export const fieldClass =
  "w-full min-w-0 rounded-md border border-outline-variant bg-white px-3 py-2 text-body-sm";
export const dialogClass =
  "w-full max-w-2xl rounded-2xl border border-outline-variant bg-white p-6 shadow-xl";

export type FieldSpec = {
  name: string;
  label: string;
  type?:
    | "number"
    | "date"
    | "email"
    | "tel"
    | "textarea"
    | "checkbox"
    | "datetime-local";
  required?: boolean;
  options?: { value: string; label: string }[];
  min?: number;
  readOnly?: boolean;
};
export type FormValues = Record<string, string | number | boolean | undefined>;

export function FormFields({
  fields,
  values = {},
}: {
  fields: FieldSpec[];
  values?: FormValues;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {fields.map(({ name, label, type, required, options, min, readOnly }) => (
        <label key={name} className="block min-w-0 text-label-md">
          {label}
          {required && " *"}
          {options ? (
            <select
              className={fieldClass}
              name={name}
              required={required}
              defaultValue={String(values[name] ?? "")}
            >
              <option value="">Select {label.toLowerCase()}</option>
              {options.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          ) : type === "textarea" ? (
            <textarea
              className={fieldClass}
              name={name}
              required={required}
              defaultValue={String(values[name] ?? "")}
            />
          ) : type === "checkbox" ? (
            <input
              className="ml-2"
              name={name}
              type="checkbox"
              defaultChecked={Boolean(values[name])}
            />
          ) : (
            <input
              className={fieldClass}
              name={name}
              required={required}
              min={min}
              readOnly={readOnly}
              type={type ?? "text"}
              defaultValue={String(values[name] ?? "")}
            />
          )}
        </label>
      ))}
    </div>
  );
}

export const formText = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();
export const optionsOf = (values: readonly string[]) =>
  values.map((value) => ({ value, label: value }));

export function ManagementForm({
  title,
  save,
  children,
  close,
  updating = false,
}: {
  title: string | null;
  save: (data: FormData) => void | Promise<void>;
  children: ReactNode;
  close: () => void;
  updating?: boolean;
}) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  function dismiss() {
    if (busy.current) return;
    setError("");
    close();
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError("");
    try {
      await save(new FormData(event.currentTarget));
      close();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return (
    <PortalDialog
      className={dialogClass}
      open={title !== null}
      dismiss={dismiss}
      aria-label={title ?? undefined}
    >
      <h2 className="font-headline text-headline-md mb-4">{title}</h2>
      {title && (
        <form method="dialog" onSubmit={submit} className="space-y-4">
          {children}
          {error && (
            <p role="alert" className="text-error">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <button className={primaryButton} type="submit" disabled={pending}>
              {pending ? "Saving…" : updating ? "Update" : "Save"}
            </button>
            <button
              className={managementButton}
              type="button"
              onClick={dismiss}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </PortalDialog>
  );
}

export function RecordDetails({
  title,
  entries,
  close,
}: {
  title: string | null;
  entries: [string, ReactNode][];
  close: () => void;
}) {
  return (
    <PortalDialog
      className={dialogClass}
      open={title !== null}
      dismiss={close}
      aria-label={title ?? undefined}
    >
      <h2 className="font-headline text-headline-md mb-4">{title}</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {entries.map(([label, value]) => (
          <div className="min-w-0 break-words" key={label}>
            <dt className="font-semibold">{label}</dt>
            <dd>{value || "—"}</dd>
          </div>
        ))}
      </dl>
      <button
        type="button"
        className={managementButton + " mt-4"}
        onClick={close}
      >
        Close
      </button>
    </PortalDialog>
  );
}

export function RecordAction({
  action,
  label,
  onClick,
}: {
  action: "visibility" | "edit" | "delete";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="p-1.5 rounded hover:bg-surface-variant text-primary"
      title={label}
      aria-label={label}
      onClick={onClick}
    >
      <span
        aria-hidden="true"
        className="material-symbols-outlined text-[18px]"
      >
        {action}
      </span>
    </button>
  );
}

export function ConfirmAction({
  title,
  action,
  close,
  message = "Confirm this change.",
}: {
  title: string | null;
  action: () => void | Promise<void>;
  message?: string;
  close: () => void;
}) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  function dismiss() {
    if (busy.current) return;
    setError("");
    close();
  }
  return (
    <PortalDialog
      className={dialogClass}
      open={title !== null}
      dismiss={dismiss}
      aria-label={title ?? undefined}
    >
      <h2 className="font-headline text-headline-md mb-4">{title}</h2>
      <p>{message}</p>
      {error && (
        <p role="alert" className="text-error">
          {error}
        </p>
      )}
      <div className="flex gap-3 mt-4">
        <button
          type="button"
          className={managementButton}
          disabled={pending}
          onClick={dismiss}
        >
          Cancel
        </button>
        <button
          type="button"
          className={primaryButton}
          disabled={pending}
          onClick={async () => {
            if (busy.current) return;
            busy.current = true;
            setPending(true);
            setError("");
            try {
              await action();
              close();
            } catch (failure) {
              setError(errorMessage(failure));
            } finally {
              busy.current = false;
              setPending(false);
            }
          }}
        >
          {pending
            ? "Saving…"
            : title === "Cancel reservation"
              ? title
              : (title?.split(" ")[0] ?? "Confirm")}
        </button>
      </div>
    </PortalDialog>
  );
}

const inventoryStatusClasses: Record<string, string> = {
  Available: "bg-green-100 text-green-800",
  Occupied: "bg-red-100 text-red-800",
  "Partially Occupied": "bg-red-100 text-red-800",
  Reserved: "bg-blue-100 text-blue-800",
  "Under Maintenance": "bg-orange-100 text-orange-900",
  Inactive: "bg-gray-100 text-gray-800",
};
function InventoryStatus({ status }: { status: string }) {
  return (
    <span
      className={
        "inline-flex rounded-full px-2 py-0.5 " +
        (inventoryStatusClasses[status] ?? "bg-primary-container text-primary")
      }
    >
      {status}
    </span>
  );
}

export type ManagementRow = {
  id: string;
  cells: string[];
  status: string;
  group?: string;
  floor?: number | null;
  actions?: ReactNode;
};
export function ManagementTable({
  title,
  columns,
  rows,
  add,
  endpoint,
  query,
  allowTileView = false,
  mapRow,
  statusOptions,
}: {
  endpoint: ApiPath;
  allowTileView?: boolean;
  query: (filter: Filters) => Query;
  title: string;
  columns: string[];
  rows: ManagementRow[];
  mapRow?: (row: Row) => ManagementRow;
  statusOptions?: string[];
  add?: () => void;
}) {
  const [tileView, setTileView] = useState(false);
  const index = new Map(rows.map((row) => [row.id, row]));
  const grid = useServerGrid(
    endpoint,
    8,
    (row) => (mapRow ? mapRow(row) : index.get(fieldText(row, "id"))),
    query,
  );
  const visible = grid.visible.filter((row): row is ManagementRow =>
    Boolean(row),
  );
  const groups = [
    ...new Set(
      rows.map((row) => row.group).filter((value): value is string => !!value),
    ),
  ];
  const statuses = statusOptions ?? [
    ...new Set(rows.map((row) => row.status).filter(Boolean)),
  ];
  const actions = rows.some((row) => row.actions !== undefined) || !!add;
  const floors = [
    ...new Set(
      rows.flatMap((row) => (typeof row.floor === "number" ? [row.floor] : [])),
    ),
  ].sort((a, b) => a - b);
  return (
    <section className="bg-white rounded-xl border border-outline-variant overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <h2 className="font-headline text-headline-sm">{title}</h2>
        {allowTileView && (
          <div className="flex gap-2" aria-label="Inventory view">
            <button
              type="button"
              className={managementButton}
              aria-pressed={!tileView}
              onClick={() => setTileView(false)}
            >
              Table view
            </button>
            <button
              type="button"
              className={managementButton}
              aria-pressed={tileView}
              onClick={() => setTileView(true)}
            >
              Grid view
            </button>
          </div>
        )}
        {add && (
          <button type="button" className={primaryButton} onClick={add}>
            + Add
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 px-4 pb-4">
        <GridSearch
          className={fieldClass}
          aria-label="Search records"
          placeholder="Search records"
          value={grid.search}
          onValueChange={grid.setSearch}
        />
        {groups.length > 0 && (
          <GridSelect
            className={fieldClass}
            aria-label="Filter by category"
            value={grid.category}
            onValueChange={grid.setCategory}
          >
            <option value="ALL">All categories</option>
            {groups.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </GridSelect>
        )}
        {!!floors.length && (
          <GridSelect
            className={fieldClass}
            aria-label="Filter by floor"
            value={grid.floor}
            onValueChange={grid.setFloor}
          >
            <option value="ALL">All floors</option>
            {floors.map((floor) => (
              <option key={floor} value={floor}>
                {floorLabel(floor)}
              </option>
            ))}
          </GridSelect>
        )}
        {statuses.length > 0 && (
          <GridSelect
            className={fieldClass}
            aria-label="Filter by status"
            value={grid.status}
            onValueChange={grid.setStatus}
          >
            <option value="ALL">All statuses</option>
            {statuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </GridSelect>
        )}
        <GridSelect
          className={fieldClass}
          aria-label="Sort records"
          value={grid.sort}
          onValueChange={grid.setSort}
        >
          <option value="newest">Default order</option>
          <option value="asc">First column A–Z</option>
          <option value="desc">First column Z–A</option>
        </GridSelect>
      </div>
      <PortalDataStatus
        loading={grid.loading}
        error={grid.error}
        retry={grid.retry}
      />
      {tileView ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 p-4"
          aria-label={title + " grid"}
        >
          {visible.map((row) => (
            <article
              key={row.id}
              className="p-4 rounded-xl border border-outline-variant"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{row.cells[0]}</h3>
                <InventoryStatus status={row.status} />
              </div>
              <dl className="grid grid-cols-2 gap-2 mt-3 text-body-sm">
                {row.cells.slice(1).map(
                  (cell, i) =>
                    cell &&
                    columns[i + 1] !== "Status" && (
                      <div key={columns[i + 1]}>
                        <dt className="text-on-surface-variant">
                          {columns[i + 1]}
                        </dt>
                        <dd>{cell}</dd>
                      </div>
                    ),
                )}
              </dl>
              <div className="mt-3 flex flex-wrap gap-2">{row.actions}</div>
            </article>
          ))}
          {!visible.length && <p>No matching records.</p>}
        </div>
      ) : (
        <div
          className="overflow-x-auto"
          tabIndex={0}
          aria-label={title + " table"}
          role="region"
        >
          <table className="w-full text-left text-body-sm">
            <thead className="bg-surface-container">
              <tr>
                {columns.map((column) => (
                  <th
                    scope="col"
                    key={column}
                    className="px-4 py-3 whitespace-nowrap"
                  >
                    {column}
                  </th>
                ))}
                {actions && (
                  <th scope="col" className="px-4 py-3">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {visible.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + Number(actions)}
                    className="p-4"
                  >
                    No matching records.
                  </td>
                </tr>
              ) : (
                visible.map((row) => (
                  <tr key={row.id}>
                    {row.cells.map((cell, index) => (
                      <td className="px-4 py-3" key={index}>
                        {columns[index] === "Status" ? (
                          <InventoryStatus status={cell} />
                        ) : (
                          cell || "—"
                        )}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-4 py-3 whitespace-nowrap">
                        {row.actions}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p>
          Showing {grid.range} of {grid.total}
        </p>
        <Pagination
          grid={grid}
          design={{
            className: "flex gap-2",
            previous: { label: "Previous", className: managementButton },
            next: { label: "Next", className: managementButton },
            active: primaryButton,
            ordinary: managementButton,
            slots: Array.from({ length: grid.pages }, (_, index) => index + 1),
          }}
        />
      </div>
    </section>
  );
}
