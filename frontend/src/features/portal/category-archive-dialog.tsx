"use client";

import { useCallback, useRef, useState, type FormEvent } from "react";
import { ApiError, errorMessage } from "@/lib/api";
import { useApiResource } from "@/lib/api-hooks";
import type { ApiInventoryCommand } from "../accommodation/inventory";
import { categoryDependencies } from "./portal-api";
import { PortalDataStatus } from "./portal-session";
import { PortalDialog } from "./portal-dialog";
import {
  dialogClass,
  fieldClass,
  managementButton,
  primaryButton,
} from "./management-ui";

const conflictMessage =
  "Unable to delete this accommodation category because active rooms or dormitories are associated with it. Please reassign or safely archive the associated inventory before deleting this category.";

export function CategoryArchiveDialog({
  category,
  close,
  execute,
}: {
  category: { id: string; name: string } | null;
  close: () => void;
  execute: (command: ApiInventoryCommand, message: string) => Promise<void>;
}) {
  const id = category?.id ?? "";
  const load = useCallback(
    (signal: AbortSignal) => categoryDependencies(id, signal),
    [id],
  );
  const { data, loading, error, retry } = useApiResource(id || null, load);
  const [destination, setDestination] = useState("");
  const [selection, setSelection] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [issue, setIssue] = useState("");
  const [notice, setNotice] = useState("");
  const busy = useRef(false);
  const units = data?.inventory ?? [];
  const hasBookings = units.some(
    (unit) => unit.active_allocations || unit.active_reservations,
  );
  const eligible = units.filter(
    (unit) => !unit.active_allocations && !unit.active_reservations,
  );
  const inventoryIds = eligible
    .filter((unit) => selection.includes(unit.id))
    .map((unit) => unit.id);
  const canReassign =
    !!data?.compatible_categories.length && eligible.length > 0;
  const disabled = loading || pending;

  function clearSelection() {
    setSelection([]);
    setDestination("");
  }
  function finish() {
    clearSelection();
    setIssue("");
    setNotice("");
    close();
  }
  async function run(command: ApiInventoryCommand, message: string) {
    if (busy.current || loading) return;
    busy.current = true;
    setPending(true);
    setIssue("");
    setNotice("");
    try {
      await execute(command, message);
      if (command.action === "archive") finish();
      else {
        if (command.action === "reassign-category") clearSelection();
        setNotice(message);
      }
    } catch (failure) {
      setIssue(errorMessage(failure));
      if (failure instanceof ApiError && failure.status === 409) retry();
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  function reassign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !inventoryIds.length ||
      !data?.compatible_categories.some((option) => option.id === destination)
    )
      return;
    return run(
      {
        action: "reassign-category",
        id,
        destinationId: destination,
        inventoryIds,
      },
      "Selected inventory reassigned.",
    );
  }

  const title = category ? "Archive " + category.name : undefined;
  return (
    <PortalDialog
      className={dialogClass + " max-h-[85vh] overflow-y-auto"}
      open={!!category}
      dismiss={() => {
        if (!busy.current) finish();
      }}
      aria-label={title}
    >
      <h2 className="font-headline text-headline-md mb-4">{title}</h2>
      <PortalDataStatus loading={loading} error={error} retry={retry} />
      {issue && (
        <p className="text-error mb-3" role="alert">
          {issue}
        </p>
      )}
      {notice && (
        <p className="text-success mb-3" role="status">
          {notice}
        </p>
      )}
      {data && (
        <div className="space-y-4" aria-busy={disabled}>
          <p>
            {data.room_count} {data.room_count === 1 ? "room" : "rooms"} ·{" "}
            {data.dormitory_count}{" "}
            {data.dormitory_count === 1 ? "dormitory" : "dormitories"}
          </p>
          {units.length ? (
            <>
              {!issue && <p>{conflictMessage}</p>}
              <form onSubmit={reassign} className="space-y-3">
                <fieldset disabled={disabled} className="space-y-3">
                  <legend className="font-semibold">
                    Associated inventory
                  </legend>
                  <ul className="divide-y divide-outline-variant">
                    {units.map((unit) => {
                      const booked = Boolean(
                        unit.active_allocations || unit.active_reservations,
                      );
                      return (
                        <li key={unit.id} className="py-2">
                          <label className="flex items-start gap-2">
                            {canReassign && (
                              <input
                                type="checkbox"
                                className="mt-1"
                                disabled={booked}
                                checked={inventoryIds.includes(unit.id)}
                                onChange={({ currentTarget }) => {
                                  const checked = currentTarget.checked;
                                  setSelection((prior) =>
                                    checked
                                      ? [...prior, unit.id]
                                      : prior.filter(
                                          (item) => item !== unit.id,
                                        ),
                                  );
                                }}
                              />
                            )}
                            <span>
                              <span className="font-semibold">
                                {unit.number}
                              </span>
                              {unit.name ? " · " + unit.name : ""}
                              {" · " + unit.building}
                              <span className="block text-body-sm">
                                {unit.operational_status.toLowerCase()} ·{" "}
                                {unit.active_allocations} active allocations ·{" "}
                                {unit.active_reservations} open reservations
                              </span>
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                  {canReassign && (
                    <label className="block">
                      Destination category
                      <select
                        className={fieldClass}
                        required
                        value={destination}
                        onChange={(event) =>
                          setDestination(event.currentTarget.value)
                        }
                      >
                        <option value="">Select a destination</option>
                        {data.compatible_categories.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.category_name}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  {canReassign && (
                    <button
                      className={managementButton}
                      disabled={!inventoryIds.length || !destination}
                      type="submit"
                    >
                      Reassign selected
                    </button>
                  )}
                </fieldset>
              </form>
              {hasBookings && (
                <p>
                  Resolve active allocations and open reservations before moving
                  booked inventory or deactivating its category.
                </p>
              )}
              {!data.compatible_categories.length && (
                <p>
                  Create or activate a category of the same type to reassign
                  inventory.
                </p>
              )}
            </>
          ) : (
            <p>Archive this category? Historical references will be kept.</p>
          )}
          {data.is_active && !hasBookings && (
            <p>
              Deactivating the category hides it from public availability while
              keeping the category and its inventory in the portal.
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            {!units.length && (
              <button
                type="button"
                className={primaryButton}
                disabled={disabled}
                onClick={() =>
                  run(
                    { action: "archive", kind: "categories", id },
                    "Accommodation category archived.",
                  )
                }
              >
                Archive category
              </button>
            )}
            {data.is_active && !hasBookings && (
              <button
                type="button"
                className={managementButton}
                disabled={disabled}
                onClick={() =>
                  run(
                    { action: "deactivate-category", id },
                    "Accommodation category deactivated.",
                  )
                }
              >
                Deactivate category
              </button>
            )}
            <button
              type="button"
              className={managementButton}
              disabled={pending}
              onClick={finish}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {!data && (
        <button type="button" className={managementButton} onClick={finish}>
          Close
        </button>
      )}
    </PortalDialog>
  );
}
