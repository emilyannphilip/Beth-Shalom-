"use client";

import { useCallback, useRef, useState, type FormEvent } from "react";
import { ApiError, errorMessage } from "@/lib/api";
import { useApiResource } from "@/lib/api-hooks";
import {
  availabilityCountKeys,
  type AvailabilityChange,
  type AvailabilityEdit,
  type AvailabilityScope,
  type AvailabilityUnit,
} from "../accommodation/availability";
import type { Dormitory, Target } from "../accommodation/inventory";
import {
  dialogClass,
  fieldClass,
  managementButton,
  primaryButton,
} from "./management-ui";
import {
  loadInventoryAvailability,
  saveInventoryAvailability,
} from "./portal-api";
import { PortalDialog } from "./portal-dialog";
import { PortalDataStatus } from "./portal-session";

const labels = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  RESERVED: "Reserved",
  MAINTENANCE: "Under maintenance",
  INACTIVE: "Inactive",
  ACTIVE: "Available",
  ARCHIVE: "Archive",
} as const;
const edits: AvailabilityEdit[] = [
  "ACTIVE",
  "MAINTENANCE",
  "INACTIVE",
  "ARCHIVE",
];
const batchLimit = 100;
export type BookingAction =
  "Allocate" | "Reserve" | "Manage allocations" | "Manage reservations";

function mayChange(unit: AvailabilityUnit, status: AvailabilityEdit) {
  return (
    !unit.occupied &&
    !unit.open_reservation &&
    unit.operational_status !== status &&
    (unit.parent_open || status === "INACTIVE" || status === "ARCHIVE")
  );
}

export function AvailabilityDialog({
  scope,
  dormitories,
  close,
  onSaved,
  onAdd,
  onBooking,
}: {
  scope: AvailabilityScope;
  dormitories: Dormitory[];
  close: () => void;
  onSaved: () => void;
  onAdd: (kind: "rooms" | "beds", parentId: string) => void;
  onBooking: (action: BookingAction, target: Target, label: string) => void;
}) {
  const load = useCallback(
    (signal: AbortSignal) => loadInventoryAvailability(scope, signal),
    [scope],
  );
  const { data, loading, error, retry } = useApiResource(scope.id, load);
  const [draft, setDraft] = useState<Record<string, AvailabilityChange>>({});
  const [reviewing, setReviewing] = useState(false);
  const [pending, setPending] = useState(false);
  const [issue, setIssue] = useState("");
  const busy = useRef(false);

  const units = data?.units ?? [];
  const changes = Object.values(draft);
  const invalid = changes.some((change) => {
    const unit = units.find(({ id }) => id === change.id);
    return (
      !unit ||
      unit.operational_status !== change.expected_status ||
      !mayChange(unit, change.status)
    );
  });
  const projected =
    data &&
    units.reduce(
      (counts, unit) => {
        const change = invalid ? undefined : draft[unit.id];
        if (change?.status === "ARCHIVE") return counts;
        const state =
          change?.status === "ACTIVE"
            ? "available"
            : change?.status === "MAINTENANCE" ||
                (change && unit.parent_maintenance)
              ? "maintenance"
              : change?.status === "INACTIVE"
                ? "inactive"
                : (unit.state.toLowerCase() as Lowercase<
                    AvailabilityUnit["state"]
                  >);
        return {
          ...counts,
          total: counts.total + 1,
          [state]: counts[state] + 1,
        };
      },
      {
        total: 0,
        available: 0,
        occupied: 0,
        reserved: 0,
        maintenance: 0,
        inactive: 0,
      },
    );

  const staged = changes.length > 0;
  const editable = !!data && !error && !loading && !pending;
  const title = "Edit availability for " + scope.label;
  const room = data?.kind === "ROOM";
  const unitName = room ? "room" : "bed";

  function changeUnit(unit: AvailabilityUnit, value: string) {
    setIssue("");
    setDraft((previous) => {
      const next = { ...previous };
      if (value === "") delete next[unit.id];
      else
        next[unit.id] = {
          id: unit.id,
          expected_status: unit.operational_status,
          status: value as AvailabilityEdit,
        };
      return next;
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !editable ||
      invalid ||
      !staged ||
      changes.length > batchLimit ||
      busy.current
    )
      return;
    if (!reviewing) {
      setReviewing(true);
      return;
    }
    busy.current = true;
    setPending(true);
    setIssue("");
    try {
      await saveInventoryAvailability(scope, changes);
      onSaved();
    } catch (failure) {
      setIssue(errorMessage(failure));
      setReviewing(false);
      if (failure instanceof ApiError && failure.status === 409) retry();
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return (
    <PortalDialog
      open
      aria-label={title}
      className={dialogClass + " max-h-[85vh] overflow-y-auto"}
      dismiss={() => {
        if (!busy.current) close();
      }}
    >
      <h2 className="font-headline text-headline-md mb-3">{title}</h2>
      <PortalDataStatus loading={loading} error={error} retry={retry} />
      {issue && (
        <p className="text-error mb-3" role="alert">
          {issue}
        </p>
      )}
      {data && projected && (
        <form onSubmit={submit} className="space-y-4" aria-busy={pending}>
          <p>
            Totals come from individual {unitName} records. Occupied and
            reserved units change through the booking actions below. Archiving
            keeps the unit record and its history.
          </p>
          <table className="w-full text-body-sm border-collapse">
            <thead>
              <tr className="border-b border-outline-variant">
                <th scope="col" className="p-2 text-left">
                  Availability
                </th>
                <th scope="col" className="p-2 text-right">
                  Current
                </th>
                <th scope="col" className="p-2 text-right">
                  After changes
                </th>
              </tr>
            </thead>
            <tbody>
              {availabilityCountKeys.map((key) => (
                <tr key={key} className="border-b border-outline-variant">
                  <th
                    scope="row"
                    className="p-2 text-left capitalize font-medium"
                  >
                    {key === "total"
                      ? room
                        ? "Total rooms"
                        : "Total beds"
                      : key}
                  </th>
                  <td className="p-2 text-right">{data.counts[key]}</td>
                  <td className="p-2 text-right">
                    {invalid ? "—" : projected[key]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {invalid && (
            <p role="alert" className="text-error">
              A selected unit has changed. Clear its selection and review the
              current availability.
            </p>
          )}
          {changes.length > batchLimit && (
            <p role="alert" className="text-error">
              Select up to {batchLimit} units per update.
            </p>
          )}
          {!reviewing && (
            <div className="flex flex-wrap gap-2">
              {room ? (
                <button
                  type="button"
                  disabled={staged || !editable}
                  className={managementButton}
                  onClick={() => onAdd("rooms", scope.id)}
                >
                  Add room
                </button>
              ) : (
                dormitories.map((dormitory) => (
                  <button
                    key={dormitory.id}
                    type="button"
                    disabled={staged || !editable}
                    className={managementButton}
                    onClick={() => onAdd("beds", dormitory.id)}
                  >
                    {scope.scope === "dormitory"
                      ? "Add bed"
                      : "Add bed to " + dormitory.name}
                  </button>
                ))
              )}
              {staged && (
                <button
                  type="button"
                  className={managementButton}
                  disabled={pending}
                  onClick={() => {
                    setDraft({});
                    setIssue("");
                  }}
                >
                  Clear selections
                </button>
              )}
            </div>
          )}

          <fieldset disabled={!editable} className="space-y-2">
            <legend className="font-semibold">
              {reviewing ? "Confirm selected changes" : "Individual units"}
            </legend>
            {!units.length && <p>No units are configured.</p>}
            <ul className="max-h-64 overflow-y-auto divide-y divide-outline-variant">
              {units
                .filter((unit) => !reviewing || draft[unit.id])
                .map((unit) => {
                  const name = unit.dormitory_name
                    ? unit.dormitory_name + " / " + unit.number
                    : unit.number;
                  const target: Target = {
                    type: room ? "Room" : "Dormitory",
                    id: unit.id,
                  };
                  return (
                    <li
                      key={unit.id}
                      className="py-2 flex flex-wrap items-end justify-between gap-2"
                    >
                      <div>
                        <p className="font-semibold">{name}</p>
                        <p className="text-body-sm">
                          {labels[unit.state]}
                          {reviewing &&
                            draft[unit.id] &&
                            " → " + labels[draft[unit.id].status]}
                        </p>
                        {!reviewing && unit.open_reservation && (
                          <p className="text-body-sm">Open reservation</p>
                        )}
                        {!reviewing && !unit.parent_open && (
                          <p className="text-body-sm">
                            Parent accommodation is unavailable
                          </p>
                        )}
                      </div>
                      {!reviewing && (
                        <div className="flex flex-wrap items-end gap-2">
                          <label className="text-label-md">
                            Status for {name}
                            <select
                              aria-label={"Status for " + name}
                              value={draft[unit.id]?.status ?? ""}
                              className={fieldClass}
                              disabled={
                                !draft[unit.id] &&
                                (unit.occupied || unit.open_reservation)
                              }
                              onChange={(event) =>
                                changeUnit(unit, event.currentTarget.value)
                              }
                            >
                              <option value="">Keep current status</option>
                              {edits.map((edit) => (
                                <option
                                  key={edit}
                                  value={edit}
                                  disabled={!mayChange(unit, edit)}
                                >
                                  {labels[edit]}
                                </option>
                              ))}
                            </select>
                          </label>
                          {(
                            [
                              [unit.free_spaces > 0, "Allocate"],
                              [unit.free_spaces > 0, "Reserve"],
                              [unit.occupied, "Manage allocations"],
                              [unit.open_reservation, "Manage reservations"],
                            ] as const
                          ).map(
                            ([visible, action]) =>
                              visible && (
                                <button
                                  key={action}
                                  type="button"
                                  className={managementButton}
                                  aria-label={action + " for " + name}
                                  disabled={staged}
                                  onClick={() =>
                                    onBooking(action, target, name)
                                  }
                                >
                                  {action}
                                </button>
                              ),
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
            </ul>
          </fieldset>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className={primaryButton}
              disabled={
                !editable || !staged || invalid || changes.length > batchLimit
              }
            >
              {pending ? "Saving…" : reviewing ? "Save" : "Review changes"}
            </button>
            {reviewing && (
              <button
                type="button"
                className={managementButton}
                disabled={pending}
                onClick={() => setReviewing(false)}
              >
                Back
              </button>
            )}
            <button
              type="button"
              className={managementButton}
              disabled={pending}
              onClick={close}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {!data && (
        <button type="button" className={managementButton} onClick={close}>
          Cancel
        </button>
      )}
    </PortalDialog>
  );
}
