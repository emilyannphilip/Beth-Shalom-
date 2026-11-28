import { approvedImages } from "./approved-images";

export const availabilityCountKeys = [
  "total",
  "available",
  "occupied",
  "reserved",
  "maintenance",
  "inactive",
] as const;

export type AvailabilityCounts = Record<
  (typeof availabilityCountKeys)[number],
  number
>;
export type AccommodationOperationalStatus =
  "ACTIVE" | "MAINTENANCE" | "INACTIVE";
export type AvailabilityEdit = AccommodationOperationalStatus | "ARCHIVE";
export type AvailabilityChange = {
  id: string;
  expected_status: AccommodationOperationalStatus;
  status: AvailabilityEdit;
};
export type AvailabilityScope = {
  scope: "category" | "dormitory";
  id: string;
  label: string;
};
export type AvailabilityUnit = {
  id: string;
  number: string;
  dormitory_name: string | null;
  operational_status: AccommodationOperationalStatus;
  state: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE" | "INACTIVE";
  parent_open: boolean;
  parent_maintenance: boolean;
  occupied: boolean;
  open_reservation: boolean;
  free_spaces: number;
};
export type AvailabilitySnapshot = {
  kind: "ROOM" | "BED";
  units: AvailabilityUnit[];
  counts: AvailabilityCounts;
};

export type FloorAvailability = {
  floor_number: number | null;
  total_units: number;
  available_units: number;
  occupied_units: number;
  reserved_units: number;
  maintenance_units: number;
  inactive_units: number;
  remaining_spaces: number;
};

export type PublicDormitory = {
  name: string;
  floor_number: number | null;
  description: string | null;
  image_url: string | null;
  total_beds: number;
  available_beds: number;
};

export type AvailabilityRow = {
  category_id: string;
  category_name: string;
  category_code: string;
  accommodation_type: "ROOM" | "DORMITORY";
  description: string | null;
  image_url: string | null;
  public_features: string[] | null;
  floors: FloorAvailability[];
  dormitories: PublicDormitory[];
  total_rooms: number;
  available_rooms: number;
  occupied_rooms: number;
  reserved_rooms: number;
  maintenance_rooms: number;
  inactive_rooms: number;
  free_room_spaces: number;
  total_dormitories: number;
  total_beds: number;
  available_beds: number;
  occupied_beds: number;
  reserved_beds: number;
  maintenance_beds: number;
  inactive_beds: number;
};

export function floorLabel(floor: number | null | undefined) {
  if (floor === null || floor === undefined) return "Floor to be configured";
  if (floor === 0) return "Ground Floor";
  if (floor < 0) return "Basement " + -floor;
  const last = floor % 100;
  const suffix =
    last >= 11 && last <= 13
      ? "th"
      : (({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[
          floor % 10
        ] ?? "th");
  return floor + suffix + " Floor";
}

export const floorList = (floors: FloorAvailability[]) =>
  floors.map((item) => floorLabel(item.floor_number)).join(" · ") ||
  floorLabel(undefined);

export function accommodationImage(source?: string | null) {
  return source &&
    ((/^\/beth-shalom\/assets\/[\w./-]+$/.test(source) &&
      !source.includes("..")) ||
      /^https:\/\/[^\s]+$/.test(source))
    ? (approvedImages[source] ?? source)
    : null;
}
