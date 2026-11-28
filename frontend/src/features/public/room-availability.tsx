"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { fetchApiJson } from "@/lib/api";
import { availabilityRefreshMs, useApiResource } from "@/lib/api-hooks";
import { floorList, type AvailabilityRow } from "../accommodation/availability";

const load = (signal: AbortSignal) =>
  fetchApiJson<AvailabilityRow[]>("/public/availability", { signal });
const Availability = createContext<
  ReturnType<typeof useApiResource<AvailabilityRow[]>>
>({
  data: undefined,
  error: undefined,
  loading: true,
  retry: () => {},
});
export const useAvailability = () => useContext(Availability);

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const needsInventory =
    pathname === "/" || pathname === "/rooms" || pathname.startsWith("/rooms/");
  const availability = useApiResource(
    needsInventory ? "public-availability" : null,
    load,
    availabilityRefreshMs,
  );
  return (
    <Availability.Provider value={availability}>
      {children}
    </Availability.Provider>
  );
}

export function PublicRoomAvailability({
  category,
  field = "availability",
}: {
  category: string;
  field?: "availability" | "floor" | "total";
}) {
  const { data, loading, error } = useAvailability();
  const row = data?.find(
    (item) => item.category_code.toUpperCase() === category.toUpperCase(),
  );
  const text = error
    ? "Availability temporarily unavailable"
    : row
      ? field === "floor"
        ? floorList(row.floors)
        : field === "total"
          ? row.total_rooms + " room units"
          : row.accommodation_type === "DORMITORY"
            ? `${row.available_beds} of ${row.total_beds} beds available`
            : `${row.available_rooms} of ${row.total_rooms} rooms vacant · ${row.free_room_spaces} spaces remaining`
      : loading
        ? "Checking availability…"
        : "Currently Unavailable";
  return (
    <span data-accommodation-availability={category} aria-live="polite">
      {text}
    </span>
  );
}
