import { allRecords, fetchApiJson } from "@/lib/api";
import { writeApi } from "@/lib/api-hooks";
import type { ApiPath } from "@/lib/api-path";
import type {
  ApiInventoryCommand,
  Inventory,
  InventoryKind,
  Target,
  UnitStatus,
} from "../accommodation/inventory";
import { currentAllocation } from "../accommodation/inventory";
import {
  accommodationImage,
  availabilityCountKeys,
  type AvailabilityChange,
  type AvailabilityCounts,
  type AvailabilityScope,
  type AvailabilitySnapshot,
  type FloorAvailability,
} from "../accommodation/availability";
import { categoryLabel, childrenSupportSource } from "../public/enquiry-api";
import {
  contactFields,
  enquiryCategories,
  medicalFields,
  enquiryStatuses,
  residentCategories,
  residentStatuses,
  staffDesignations,
  type Enquiry,
  type EnquiryStatus,
  type Resident,
  type StaffAccount,
} from "./models";

export type Row = Record<string, unknown>;
export type CategoryOption = { id: string; name: string };
export type EnquiryCategoryRecord = CategoryOption & { description: string | null; is_active: boolean };
export type Summary = Record<string, number>;
export const s = (row: Row, key: string) =>
  typeof row[key] === "string" ? (row[key] as string) : "";
const n = (row: Row, key: string) =>
  typeof row[key] === "number" ? (row[key] as number) : 0;
const object = (row: Row, key: string) =>
  (row[key] && typeof row[key] === "object" ? row[key] : {}) as Row;
const array = (row: Row, key: string) =>
  (Array.isArray(row[key]) ? row[key] : []) as Row[];
const day = (row: Row, key: string) => s(row, key).slice(0, 10);
const badge =
  "inline-flex items-center gap-1.5 rounded-full bg-primary-container px-2 py-0.5 text-primary";
const avatar =
  "w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-label-sm shrink-0";
export const enquiryState = (value: string) =>
  value.toUpperCase().replaceAll(" ", "_");
export const residentState = (value: string) =>
  value === residentStatuses[1]
    ? "HOSPITALIZED"
    : value === residentStatuses[2]
      ? "DISCHARGED"
      : "ADMITTED";
const enquiryStatus = (value: string): EnquiryStatus =>
  enquiryStatuses.find((status) => enquiryState(status) === value) ?? "New";

export function staffRecord(row: Row): StaffAccount {
  return {
    id: s(row, "id"),
    number: s(row, "staff_number"),
    roleId: s(row, "role_id"),
    name: s(row, "full_name"),
    username: s(row, "username"),
    email: s(row, "email"),
    phone: s(row, "phone"),
    designation: (s(row, "designation") ||
      staffDesignations[0]) as StaffAccount["designation"],
    status: s(row, "status") === "ACTIVE" ? "Active" : "Inactive",
    avatarClass: avatar,
  };
}

export function enquiryRecord(row: Row, categories: CategoryOption[]): Enquiry {
  const which = s(row, "category_id"),
    notes = s(row, "message");
  const followups = array(row, "followups");
  const date =
    s(row, "preferred_date") ||
    s(array(row, "visits")[0] ?? {}, "preferred_date");
  const latest = followups[0] ?? {};
  const audit = followups
    .slice()
    .reverse()
    .map((item) => ({
      role:
        s(item, "actor_role") === "ADMIN"
          ? ("admin" as const)
          : ("staff" as const),
      time: s(item, "created_at"),
      status: enquiryStatus(s(item, "new_status")),
      remarks: s(item, "remarks"),
    }));
  const remarks = s(latest, "remarks");
  const source = s(row, "source_form");
  const details = object(row, "details");
  return {
    id: s(row, "id"),
    number: s(row, "enquiry_number"),
    categoryId: which,
    version: n(row, "version"),
    source,
    childAge:
      source === childrenSupportSource && typeof details.age === "number"
        ? details.age
        : undefined,
    supportRequirements:
      source === childrenSupportSource
        ? s(details, "care_requirement")
        : undefined,
    originalTopic: s(row, "original_topic"),
    assignedId: s(row, "assigned_user_id"),
    visitId: s(array(row, "visits")[0] ?? {}, "id"),
    name: s(row, "applicant_name"),
    relationship:
      s(row, "applicant_relationship") || s(details, "applicant_relationship"),
    phone: s(row, "phone"),
    email: s(row, "email"),
    category: (categoryLabel(
      s(row, "category_name") ||
        categories.find((item) => item.id === which)?.name ||
        "",
    ) || enquiryCategories[0]) as Enquiry["category"],
    date: day(row, "created_at"),
    visit: date.slice(0, 10),
    status: enquiryStatus(s(row, "status")),
    notes,
    remarks,
    badgeClass: badge,
    badgeDot: "w-1.5 h-1.5 rounded-full bg-secondary",
    categoryClass: badge,
    staff: {
      notes,
      remarks,
      badgeClass: badge,
      badgeDot: "w-1.5 h-1.5 rounded-full bg-secondary",
    },
    audit,
  };
}

export function residentRecord(row: Row): Resident {
  const unit = object(row, "accommodation");
  const contact =
    array(row, "contacts").find(
      (item) => s(item, "contact_type") === "EMERGENCY",
    ) ?? object(row, "emergency_contact_summary");
  const guardian =
    array(row, "contacts").find(
      (item) => s(item, "contact_type") === "GUARDIAN",
    ) ?? {};
  const accommodation: Resident["accommodation"] = s(unit, "allocation_id")
    ? {
        type: s(unit, "allocation_type") === "ROOM" ? "Room" : "Dormitory",
        category: s(unit, "category_name"),
        categoryId: s(unit, "category_id"),
        room: s(unit, "room_number"),
        dormitory: s(unit, "dormitory_name"),
        bed: s(unit, "bed_number"),
        floor: typeof unit.floor_number === "number" ? unit.floor_number : null,
      }
    : undefined;
  const careDetails = object(row, "care");
  const care = s(careDetails, "care_requirements") || s(row, "care_preview");
  const raw = s(row, "admission_status");
  const status =
    raw === "DISCHARGED"
      ? residentStatuses[2]
      : ["HOSPITALIZED", "TEMPORARY_LEAVE"].includes(raw)
        ? residentStatuses[1]
        : residentStatuses[0];
  return {
    id: s(row, "id"),
    number: s(row, "resident_number"),
    name: s(row, "full_name"),
    dob: day(row, "date_of_birth"),
    admitted: day(row, "admission_date"),
    phone: s(row, "phone"),
    email: s(row, "email"),
    medical: Object.fromEntries(Object.keys(medicalFields).map((key) => [key, s(careDetails, key)])),
    emergencyDetails: Object.fromEntries(Object.keys(contactFields).map((key) => [key, s(contact, key)])),
    guardianDetails: Object.fromEntries([...Object.keys(contactFields), "phone"].map((key) => [key, s(guardian, key)])),
    expectedDischarge: day(row, "expected_discharge_date"),
    discharged: day(row, "discharge_date"),
    gender: s(row, "gender"),
    ageLabel: typeof row.age === "number" ? row.age + " yrs" : "",
    room: accommodation?.bed || accommodation?.room || "",
    roomClass: "font-code font-semibold text-primary",
    accommodation,
    category: (s(row, "admission_category") ||
      residentCategories[0]) as Resident["category"],
    categoryDetail: "",
    address: s(row, "address"),
    contactName: s(contact, "contact_name"),
    contactPhone: s(contact, "phone"),
    contactLabel: s(contact, "contact_name"),
    guardian: s(guardian, "contact_name"),
    care,
    remarks: s(row, "remarks"),
    status,
    badgeClass: badge,
    badgeDot: "w-1.5 h-1.5 rounded-full bg-secondary",
  };
}

const target = (row: Row): Target =>
  s(row, "room_id")
    ? { type: "Room", id: s(row, "room_id") }
    : { type: "Dormitory", id: s(row, "bed_id") };
export const targetBody = (to: Target) =>
  to.type === "Room"
    ? { room_id: to.id, bed_id: null }
    : { room_id: null, bed_id: to.id };
export const inventoryRoutes: Record<InventoryKind, ApiPath> = {
  categories: "/accommodation-categories",
  rooms: "/rooms",
  dormitories: "/dormitories",
  beds: "/beds",
};
export const emptyInventory: Inventory = {
  categories: [],
  rooms: [],
  dormitories: [],
  beds: [],
  allocations: [],
  reservations: [],
  history: [],
};

function inventoryCounts(
  row: Row,
  units: "rooms" | "beds",
): AvailabilityCounts {
  const availability = object(row, "availability");
  return Object.fromEntries(
    availabilityCountKeys.map((key) => [
      key,
      n(availability, key + "_" + units),
    ]),
  ) as AvailabilityCounts;
}

function availabilityPath(scope: AvailabilityScope): ApiPath {
  const resource =
    scope.scope === "category" ? "accommodation-categories" : "dormitories";
  return `/${resource}/${scope.id}/availability`;
}
export function loadInventoryAvailability(
  scope: AvailabilityScope,
  signal: AbortSignal,
) {
  return fetchApiJson<AvailabilitySnapshot>(availabilityPath(scope), {
    signal,
  });
}
export function saveInventoryAvailability(
  scope: AvailabilityScope,
  changes: AvailabilityChange[],
) {
  return writeApi<AvailabilitySnapshot>(availabilityPath(scope), "PATCH", {
    changes,
  });
}

export function historyRecord(row: Row, inventory: Inventory) {
  const unit = (room: string, bed: string) =>
    inventory.rooms.find((item) => item.id === room)?.number ||
    inventory.beds.find((item) => item.id === bed)?.number ||
    "";
  const previous =
    s(row, "previous_room_number") ||
    s(row, "previous_bed_number") ||
    unit(s(row, "previous_room_id"), s(row, "previous_bed_id"));
  const next =
    s(row, "new_room_number") ||
    s(row, "new_bed_number") ||
    unit(s(row, "new_room_id"), s(row, "new_bed_id"));
  return {
    id: s(row, "id"),
    action: s(row, "action"),
    residentId: s(row, "resident_id"),
    date: s(row, "created_at"),
    target: [previous, next]
      .filter(Boolean)
      .join(previous && next ? " → " : ""),
    remarks: s(row, "remarks"),
  };
}

export async function inventoryRecords(signal: AbortSignal) {
  const [
    categoryRows,
    roomRows,
    dormRows,
    bedRows,
    allocations,
    reservations,
    buildings,
    housingResidents,
  ] = await Promise.all([
    allRecords<Row>("/accommodation-categories", {}, signal),
    allRecords<Row>("/rooms", {}, signal),
    allRecords<Row>("/dormitories", {}, signal),
    allRecords<Row>("/beds", {}, signal),
    allRecords<Row>("/allocations", { status: "ACTIVE" }, signal),
    allRecords<Row>("/reservations", {}, signal),
    allRecords<Row>("/buildings", {}, signal),
    allRecords<Row>("/allocations/residents", {}, signal),
  ]);
  const building = (row: Row) =>
    s(
      buildings.find((item) => s(item, "id") === s(row, "building_id")) ?? {},
      "building_name",
    );
  const inventory: Inventory = {
    categories: categoryRows.map((row) => ({
      id: s(row, "id"),
      name: s(row, "category_name"),
      code: s(row, "category_code"),
      type: s(row, "accommodation_type") === "ROOM" ? "Room" : "Dormitory",
      description: s(row, "description"),
      imageUrl: s(row, "image_url"),
      publicFeatures: Array.isArray(row.public_features)
        ? row.public_features.join("\n")
        : "",
      floors:
        (object(row, "availability").floors as
          FloorAvailability[] | undefined) ?? [],
      availability: inventoryCounts(
        row,
        row.accommodation_type === "ROOM" ? "rooms" : "beds",
      ),
      capacity: n(row, "default_capacity"),
      maintenance: row.is_active === false,
    })),
    rooms: roomRows.map((row) => {
      const metrics = object(row, "availability"),
        liveStatus = (s(row, "availability_status") || undefined) as
          UnitStatus | undefined;
      return {
        id: s(row, "id"),
        number: s(row, "room_number"),
        categoryId: s(row, "category_id"),
        building: building(row),
        floor: n(row, "floor_number"),
        capacity: n(row, "capacity"),
        maintenance: liveStatus === "Under Maintenance",
        operationalStatus: s(row, "operational_status"),
        remarks: s(row, "remarks"),
        liveStatus,
        occupied: n(metrics, "occupied"),
        freeSpaces: n(metrics, "free_spaces"),
        createdAt: s(row, "created_at"),
        updatedAt: s(row, "updated_at"),
      };
    }),
    dormitories: dormRows.map((row) => ({
      id: s(row, "id"),
      number: s(row, "dormitory_number"),
      name: s(row, "dormitory_name"),
      categoryId: s(row, "category_id"),
      building: building(row),
      floor: typeof row.floor_number === "number" ? row.floor_number : null,
      capacity: n(object(row, "availability"), "total_beds"),
      availability: inventoryCounts(row, "beds"),
      bedLimit: typeof row.bed_capacity === "number" ? row.bed_capacity : null,
      imageUrl: s(row, "image_url"),
      description: s(row, "description"),
      operationalStatus: s(row, "operational_status"),
      remarks: s(row, "remarks"),
    })),
    beds: bedRows.map((row) => ({
      id: s(row, "id"),
      number: s(row, "bed_number"),
      dormitoryId: s(row, "dormitory_id"),
      maintenance: s(row, "operational_status") === "MAINTENANCE",
      operationalStatus: s(row, "operational_status"),
      remarks: s(row, "remarks"),
      liveStatus: (s(row, "availability_status") || undefined) as
        UnitStatus | undefined,
    })),
    allocations: allocations.map((row) => ({
      id: s(row, "id"),
      residentId: s(row, "resident_id"),
      target: target(row),
      date: day(row, "start_at"),
      remarks: s(row, "remarks"),
    })),
    reservations: reservations.map((row) => ({
      id: s(row, "id"),
      residentId: s(row, "resident_id"),
      target: target(row),
      date: day(row, "reservation_start"),
      remarks: s(row, "remarks"),
      start: s(row, "reservation_start"),
      end: s(row, "reservation_end"),
      capacity: n(row, "reserved_capacity"),
      status:
        (
          {
            PENDING: "Pending",
            CONFIRMED: "Reserved",
            EXPIRED: "Expired",
            CANCELLED: "Cancelled",
            CONVERTED: "Fulfilled",
          } as const
        )[(s(row, "effective_status") || s(row, "status")) as "PENDING"] ??
        "Pending",
    })),
    history: [],
  };
  return { inventory, buildings, housingResidents };
}

export type CategoryDependencies = {
  is_active: boolean;
  room_count: number;
  dormitory_count: number;
  compatible_categories: { id: string; category_name: string }[];
  inventory: {
    id: string;
    kind: "ROOM" | "DORMITORY";
    number: string;
    name: string | null;
    building: string;
    operational_status: "ACTIVE" | "MAINTENANCE" | "INACTIVE";
    active_allocations: number;
    active_reservations: number;
  }[];
};

export function categoryDependencies(id: string, signal: AbortSignal) {
  return fetchApiJson<CategoryDependencies>(
    `/accommodation-categories/${id}/dependencies`,
    { signal },
  );
}

export async function inventoryWrite(
  command: ApiInventoryCommand,
  inventory: Inventory,
  buildings: Row[],
) {
  switch (command.action) {
    case "operational-status":
      return writeApi(
        `${inventoryRoutes[command.kind]}/${command.id}`,
        "PATCH",
        { operational_status: command.status },
      );
    case "deactivate-category":
      return writeApi(`/accommodation-categories/${command.id}`, "PATCH", {
        is_active: false,
      });
    case "reassign-category":
      return writeApi(
        `/accommodation-categories/${command.id}/reassign`,
        "POST",
        {
          destination_category_id: command.destinationId,
          inventory_ids: command.inventoryIds,
        },
      );
    case "archive":
      return writeApi(
        (inventoryRoutes[command.kind] + "/" + command.id) as ApiPath,
        "DELETE",
      );
    case "save": {
      let data: Row;
      if (command.kind === "categories") {
        const row = command.record;
        data = {
          category_name: row.name,
          category_code: row.code,
          accommodation_type: row.type.toUpperCase(),
          default_capacity: row.capacity,
          description: row.description,
          image_url: row.imageUrl || null,
          public_features:
            row.publicFeatures
              ?.split("\n")
              .map((feature) => feature.trim())
              .filter(Boolean) ?? null,
          is_active: !row.maintenance,
        };
      } else if (command.kind === "beds") {
        const row = command.record;
        data = {
          bed_number: row.number,
          dormitory_id: row.dormitoryId,
          operational_status: row.maintenance
            ? "MAINTENANCE"
            : row.liveStatus === "Inactive"
              ? "INACTIVE"
              : "ACTIVE",
          remarks: row.remarks,
        };
      } else {
        const row = command.record;
        const building = buildings.find(
          (item) =>
            s(item, "id") === row.building ||
            s(item, "building_name") === row.building,
        );
        if (!building) throw Error("Choose a building.");
        data = {
          category_id: row.categoryId,
          building_id: s(building, "id"),
          floor_number: row.floor,
        };
        if (command.kind === "rooms") {
          const room = command.record;
          Object.assign(data, {
            room_number: room.number,
            capacity: room.capacity,
            operational_status: room.maintenance
              ? "MAINTENANCE"
              : room.liveStatus === "Inactive"
                ? "INACTIVE"
                : "ACTIVE",
            remarks: room.remarks,
          });
        } else {
          const dorm = command.record;
          Object.assign(data, {
            dormitory_name: dorm.name,
            dormitory_number: dorm.number,
            bed_capacity: dorm.bedLimit ?? null,
            image_url: dorm.imageUrl || null,
            description: dorm.description || null,
            operational_status: dorm.operationalStatus || "ACTIVE",
            remarks: dorm.remarks,
          });
        }
      }
      if (
        typeof data.image_url === "string" &&
        !accommodationImage(data.image_url)
      )
        throw Error("Enter an HTTPS image URL or a Beth Shalom asset path.");
      const existing = inventory[command.kind].some(
        (item) => item.id === command.record.id,
      );
      return writeApi(
        (inventoryRoutes[command.kind] +
          (existing ? "/" + command.record.id : "")) as ApiPath,
        existing ? "PATCH" : "POST",
        data,
      );
    }
    case "allocate": {
      const previous = currentAllocation(inventory, command.residentId);
      return writeApi(
        previous ? `/allocations/${previous.id}/transfer` : "/allocations",
        "POST",
        {
          ...targetBody(command.target),
          remarks: command.remarks,
          ...(!previous ? { resident_id: command.residentId } : {}),
        },
      );
    }
    case "edit-allocation":
      return writeApi(`/allocations/${command.id}`, "PATCH", {
        remarks: command.remarks,
      });
    case "release": {
      const previous = currentAllocation(inventory, command.residentId);
      if (!previous) throw Error("This allocation has already ended.");
      return writeApi(`/allocations/${previous.id}/release`, "POST", {});
    }
    case "reserve": {
      const row = command.record,
        existing = inventory.reservations.some((item) => item.id === row.id);
      return writeApi(
        existing ? `/reservations/${row.id}` : "/reservations",
        existing ? "PATCH" : "POST",
        {
          ...targetBody(row.target),
          resident_id: row.residentId,
          reservation_start: row.start,
          reservation_end: row.end,
          reserved_capacity: row.capacity,
          remarks: row.remarks,
        },
      );
    }
    case "cancel":
      return writeApi(`/reservations/${command.id}/cancel`, "POST");
    case "confirm-reservation":
      return writeApi(`/reservations/${command.id}/confirm`, "POST");
    case "expire-reservation":
      return writeApi(`/reservations/${command.id}/expire`, "POST");
    case "convert-reservation":
      return writeApi(`/reservations/${command.id}/convert`, "POST", {});
  }
}

export function reservationTimeFields(existing?: {
  start?: string;
  end?: string;
}) {
  const now = Date.now();
  const istTime = (value: Date | string) =>
    new Date(new Date(value).getTime() + 330 * 60_000)
      .toISOString()
      .slice(0, 16);
  return {
    start: istTime(existing?.start ?? new Date(now)),
    end: istTime(existing?.end ?? new Date(now + 86400000)),
  };
}

export async function residentDetails(
  id: string,
  inventory: Inventory,
) {
  const detail = await fetchApiJson<Row>(`/residents/${id}`);
  const record = residentRecord(detail);
  const events = await allRecords<Row>(`/residents/${id}/history`);
  return {
    ...record,
    history: events.map((row) => historyRecord(row, inventory)),
  };
}
