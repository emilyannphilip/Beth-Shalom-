import type { AvailabilityCounts, FloorAvailability } from "./availability";

export type AccommodationType = "Room" | "Dormitory";
export type UnitStatus =
  | "Available"
  | "Reserved"
  | "Partially Occupied"
  | "Occupied"
  | "Under Maintenance"
  | "Inactive";
type RecordBase = { id: string; archived?: boolean };

export type Category = RecordBase & {
  name: string;
  code: string;
  type: AccommodationType;
  description: string;
  imageUrl?: string;
  publicFeatures?: string;
  floors?: FloorAvailability[];
  availability?: AvailabilityCounts;
  capacity: number;
  maintenance: boolean;
};
export type Room = RecordBase & {
  operationalStatus?: string;
  liveStatus?: UnitStatus;
  occupied?: number;
  freeSpaces?: number;
  createdAt?: string;
  updatedAt?: string;
  number: string;
  categoryId: string;
  building: string;
  floor: number;
  capacity: number;
  maintenance: boolean;
  remarks: string;
};
export type Dormitory = RecordBase & {
  operationalStatus?: string;
  remarks?: string;
  name: string;
  number: string;
  categoryId: string;
  building: string;
  floor: number | null;
  capacity: number;
  bedLimit?: number | null;
  availability?: AvailabilityCounts;
  description?: string;
  imageUrl?: string;
};
export type Bed = RecordBase & {
  operationalStatus?: string;
  liveStatus?: UnitStatus;
  number: string;
  dormitoryId: string;
  maintenance: boolean;
  remarks: string;
};
export type Target =
  { type: "Room"; id: string } | { type: "Dormitory"; id: string };
export type Allocation = {
  id: string;
  residentId: string;
  target: Target;
  date: string;
  remarks: string;
  endedAt?: string;
};
export type Reservation = {
  id: string;
  residentId: string;
  target: Target;
  date: string;
  remarks: string;
  status: "Reserved" | "Cancelled" | "Fulfilled" | "Pending" | "Expired";
  start?: string;
  end?: string;
  capacity?: number;
};
export type HistoryEvent = {
  id: string;
  action: string;
  date: string;
  residentId: string;
  target: string;
  remarks: string;
};

export const inventoryKinds = [
  "categories",
  "rooms",
  "dormitories",
  "beds",
] as const;
export type InventoryKind = (typeof inventoryKinds)[number];
export interface Inventory {
  categories: Category[];
  rooms: Room[];
  dormitories: Dormitory[];
  beds: Bed[];
  allocations: Allocation[];
  reservations: Reservation[];
  history: HistoryEvent[];
}
type SaveCommand = {
  [K in InventoryKind]: {
    action: "save";
    kind: K;
    record: Inventory[K][number];
  };
}[InventoryKind];
export type InventoryCommand =
  | SaveCommand
  | { action: "archive"; kind: InventoryKind; id: string }
  | {
      action: "allocate";
      residentId: string;
      target: Target;
      date: string;
      remarks: string;
    }
  | { action: "edit-allocation"; id: string; date: string; remarks: string }
  | {
      action: "release";
      residentId: string;
      reason: "Released" | "Discharged" | "Archived";
    }
  | { action: "reserve"; record: Omit<Reservation, "status"> }
  | { action: "cancel"; id: string };

export type ApiInventoryCommand =
  | InventoryCommand
  | { action: "deactivate-category"; id: string }
  | {
      action: "operational-status";
      kind: Exclude<InventoryKind, "categories">;
      id: string;
      status: string;
    }
  | {
      action: "reassign-category";
      id: string;
      destinationId: string;
      inventoryIds: string[];
    }
  | {
      action:
        "confirm-reservation" | "expire-reservation" | "convert-reservation";
      id: string;
    };

export const active = <T extends RecordBase>(rows: T[]) =>
  rows.filter((row) => !row.archived);
const same = (a: Target, b: Target) => a.id === b.id && a.type === b.type;
export function describeTarget(state: Inventory, target: Target) {
  if (target.type === "Room") {
    const room = state.rooms.find((item) => item.id === target.id);
    return {
      type: target.type,
      room: room?.number ?? "",
      dormitory: "",
      bed: "",
      categoryId: room?.categoryId ?? "",
      floor: room?.floor ?? null,
    };
  }
  const bed = state.beds.find((item) => item.id === target.id);
  const dorm = state.dormitories.find((item) => item.id === bed?.dormitoryId);
  return {
    type: target.type,
    room: "",
    dormitory: dorm?.name ?? "",
    bed: bed?.number ?? "",
    categoryId: dorm?.categoryId ?? "",
    floor: dorm?.floor ?? null,
  };
}

export function targetLabel(state: Inventory, target: Target) {
  const item = describeTarget(state, target);
  return item.type === "Room"
    ? item.room
    : [item.dormitory, item.bed].filter(Boolean).join(" / ");
}

export function currentAllocation(state: Inventory, residentId: string) {
  return state.allocations.find(
    (row) => row.residentId === residentId && !row.endedAt,
  );
}

export function occupancy(state: Inventory, target: Target) {
  return state.allocations.filter(
    (row) => !row.endedAt && same(row.target, target),
  ).length;
}

function hold(state: Inventory, target: Target, except?: string) {
  return state.reservations.find(
    (row) =>
      row.status === "Reserved" &&
      row.id !== except &&
      same(row.target, target),
  );
}

export function unitState(
  state: Inventory,
  target: Target,
): { status: UnitStatus; occupancy: number; capacity: number } {
  const room =
    target.type === "Room"
      ? state.rooms.find((row) => row.id === target.id)
      : null;
  const bed =
    target.type === "Dormitory"
      ? state.beds.find((row) => row.id === target.id)
      : null;
  const dorm = bed
    ? state.dormitories.find((row) => row.id === bed.dormitoryId)
    : null;
  const category = state.categories.find(
    (row) => row.id === (room?.categoryId ?? dorm?.categoryId),
  );
  const count = room?.occupied ?? occupancy(state, target);
  const capacity = room?.capacity ?? 1;
  const unavailable =
    (!room && (!bed || !dorm)) ||
    room?.archived ||
    bed?.archived ||
    dorm?.archived ||
    !category ||
    category.archived ||
    room?.maintenance ||
    bed?.maintenance ||
    category.maintenance;
  const status = unavailable
    ? "Under Maintenance"
    : count >= capacity
      ? "Occupied"
      : hold(state, target)
        ? "Reserved"
        : count
          ? "Partially Occupied"
          : "Available";
  return {
    status: room?.liveStatus ?? bed?.liveStatus ?? status,
    occupancy: count,
    capacity,
  };
}

export function canAllocate(
  state: Inventory,
  target: Target,
  residentId: string,
) {
  const unit = unitState(state, target);
  const reservation = hold(state, target);
  const room =
    target.type === "Room"
      ? state.rooms.find((row) => row.id === target.id)
      : undefined;
  if (room?.freeSpaces !== undefined) return room.freeSpaces > 0;
  const bed =
    target.type === "Dormitory"
      ? state.beds.find((row) => row.id === target.id)
      : undefined;
  if (bed?.liveStatus) return bed.liveStatus === "Available";
  return (
    unit.status !== "Under Maintenance" &&
    unit.status !== "Inactive" &&
    unit.occupancy < unit.capacity &&
    (!reservation || reservation.residentId === residentId)
  );
}

export function available(status: UnitStatus) {
  return status === "Available" || status === "Partially Occupied";
}
