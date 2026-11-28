"use client";

import { useState } from "react";
import { floorLabel } from "../accommodation/availability";
import {
  active,
  canAllocate,
  describeTarget,
  targetLabel,
  type AccommodationType,
  type Inventory,
  type Target,
} from "../accommodation/inventory";
import { fieldClass } from "./management-ui";

export function parseTarget(data: FormData): Target | undefined {
  const id = String(data.get("target") ?? "");
  return id
    ? {
        type:
          data.get("accommodation-type") === "Dormitory" ? "Dormitory" : "Room",
        id,
      }
    : undefined;
}

const unreadFloor = "unconfigured";
const floorKey = (floor: number | null | undefined) =>
  floor == null ? unreadFloor : String(floor);

export function TargetPicker({
  inventory,
  prior,
  residentId,
  required = true,
  reservedTarget,
}: {
  inventory: Inventory;
  prior?: Target;
  residentId: string;
  required?: boolean;
  reservedTarget?: Target;
}) {
  const previous = prior && describeTarget(inventory, prior);
  const [type, setType] = useState<AccommodationType>(prior?.type ?? "Room");
  const [category, setCategory] = useState(previous?.categoryId ?? "");
  const [floor, setFloor] = useState(prior ? floorKey(previous?.floor) : "");
  const [unit, setUnit] = useState(prior?.id ?? "");
  const choices = (
    type === "Room" ? active(inventory.rooms) : active(inventory.beds)
  )
    .map((row) => ({ type, id: row.id }))
    .filter(
      (target) =>
        target.id === prior?.id ||
        target.id === reservedTarget?.id ||
        canAllocate(inventory, target, residentId),
    )
    .map((target) => ({ target, details: describeTarget(inventory, target) }));
  const categoryChoices = choices.filter(
    ({ details }) => details.categoryId === category,
  );
  const floors = [
    ...new Set(categoryChoices.map(({ details }) => floorKey(details.floor))),
  ].sort((a, b) =>
    a === unreadFloor ? 1 : b === unreadFloor ? -1 : Number(a) - Number(b),
  );
  const eligible =
    category !== "" && floor !== ""
      ? categoryChoices.filter(
          ({ details }) => floorKey(details.floor) === floor,
        )
      : [];

  return (
    <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <legend className="font-semibold">Accommodation {required && "*"}</legend>
      <label>
        Accommodation type
        <select
          name="accommodation-type"
          className={fieldClass}
          value={type}
          onChange={(event) => {
            setType(
              event.currentTarget.value === "Dormitory" ? "Dormitory" : "Room",
            );
            setCategory("");
            setFloor("");
            setUnit("");
          }}
        >
          <option>Room</option>
          <option>Dormitory</option>
        </select>
      </label>
      <label>
        Accommodation category
        <select
          className={fieldClass}
          value={category}
          required={required}
          onChange={(event) => {
            setCategory(event.currentTarget.value);
            setFloor("");
            setUnit("");
          }}
        >
          <option value="">Select a category</option>
          {active(inventory.categories)
            .filter(
              (row) =>
                row.type === type &&
                (row.id === previous?.categoryId ||
                  choices.some(({ details }) => details.categoryId === row.id)),
            )
            .map((row) => (
              <option key={row.id} value={row.id}>
                {row.name}
              </option>
            ))}
        </select>
      </label>
      <label>
        Floor
        <select
          className={fieldClass}
          value={floor}
          required={required || Boolean(category)}
          disabled={!category}
          onChange={(event) => {
            setFloor(event.currentTarget.value);
            setUnit("");
          }}
        >
          <option value="">Select an available floor</option>
          {floors.map((item) => (
            <option key={item} value={item}>
              {floorLabel(item === unreadFloor ? null : Number(item))}
            </option>
          ))}
        </select>
      </label>
      <label>
        {type === "Room" ? "Room number" : "Bed number"}
        <select
          name="target"
          className={fieldClass}
          value={unit}
          required={required || Boolean(floor)}
          disabled={!floor}
          onChange={(event) => setUnit(event.currentTarget.value)}
        >
          <option value="">
            {required || floor
              ? "Select available accommodation"
              : "No allocation change"}
          </option>
          {eligible.map(({ target }) => (
            <option key={target.id} value={target.id}>
              {targetLabel(inventory, target)}
            </option>
          ))}
        </select>
      </label>
      {!choices.length && (
        <p className="sm:col-span-2 text-body-sm">
          No eligible {type === "Room" ? "rooms" : "beds"} have space for this
          selection.
        </p>
      )}
    </fieldset>
  );
}
