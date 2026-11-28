import { found } from "../common/api";
import type {
  InventoryAvailabilityChange,
  inventoryStates,
} from "../common/dtos";
import type { Sql } from "../database/database.module";

export type AvailabilityScope = "category" | "dormitory";
type OperationalStatus = (typeof inventoryStates)[number];
type AvailabilityState =
  "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE" | "INACTIVE";

type AvailabilityUnit = {
  id: string;
  number: string;
  dormitory_name: string | null;
  operational_status: OperationalStatus;
  state: AvailabilityState;
  parent_open: boolean;
  parent_maintenance: boolean;
  occupied: boolean;
  open_reservation: boolean;
  free_spaces: number;
};

type AvailabilitySnapshot = {
  kind: "ROOM" | "BED";
  units: AvailabilityUnit[];
  counts: Record<
    | "total"
    | "available"
    | "occupied"
    | "reserved"
    | "maintenance"
    | "inactive",
    number
  >;
};

export type AvailabilityChange = InventoryAvailabilityChange;

export async function readInventoryAvailability(
  sql: Sql,
  scope: AvailabilityScope,
  id: string,
) {
  const category = scope === "category";
  const result = await sql.query<AvailabilitySnapshot>(
    `WITH scope AS (
       ${
         category
           ? "SELECT id, CASE accommodation_type WHEN 'ROOM' THEN 'ROOM' ELSE 'BED' END AS kind FROM accommodation_categories WHERE id=$1 AND deleted_at IS NULL"
           : "SELECT id, 'BED' AS kind FROM dormitories WHERE id=$1 AND deleted_at IS NULL"
       }
     ), units AS (
       SELECT r.id,r.room_number AS number,NULL::text AS dormitory_name,r.operational_status,
         housing_availability_state(v.operational_status,v.occupied>0,v.reserved>0) AS state,
         c.is_active AND b.is_active AS parent_open,false AS parent_maintenance,
         v.occupied>0 AS occupied,v.free_spaces,
         EXISTS(SELECT 1 FROM reservations h WHERE h.room_id=r.id
           AND h.status IN ('PENDING','CONFIRMED') AND h.reservation_end>now()) AS open_reservation
       FROM rooms r JOIN vw_room_availability v ON v.room_id=r.id
       JOIN accommodation_categories c ON c.id=r.category_id JOIN buildings b ON b.id=r.building_id
       JOIN scope s ON s.kind='ROOM' AND s.id=r.category_id
       UNION ALL
       SELECT bed.id,bed.bed_number,d.dormitory_name,bed.operational_status,
         housing_availability_state(v.operational_status,v.occupied,v.reserved),
         c.is_active AND g.is_active AND d.operational_status='ACTIVE',
         d.operational_status='MAINTENANCE',v.occupied,
         (v.operational_status='ACTIVE' AND NOT v.occupied AND NOT v.reserved)::int,
         EXISTS(SELECT 1 FROM reservations h WHERE h.bed_id=bed.id
           AND h.status IN ('PENDING','CONFIRMED') AND h.reservation_end>now())
       FROM dormitory_beds bed JOIN vw_bed_availability v ON v.bed_id=bed.id
       JOIN dormitories d ON d.id=bed.dormitory_id
       JOIN accommodation_categories c ON c.id=d.category_id JOIN buildings g ON g.id=d.building_id
       JOIN scope s ON s.kind='BED' AND s.id=${category ? "d.category_id" : "d.id"}
     )
     SELECT s.kind,
       coalesce(jsonb_agg(to_jsonb(u) ORDER BY u.dormitory_name,u.number,u.id)
         FILTER (WHERE u.id IS NOT NULL),'[]'::jsonb) AS units,
       jsonb_build_object('total',count(u.id)::int,
         'available',count(*) FILTER (WHERE u.state='AVAILABLE')::int,
         'occupied',count(*) FILTER (WHERE u.state='OCCUPIED')::int,
         'reserved',count(*) FILTER (WHERE u.state='RESERVED')::int,
         'maintenance',count(*) FILTER (WHERE u.state='MAINTENANCE')::int,
         'inactive',count(*) FILTER (WHERE u.state='INACTIVE')::int) AS counts
     FROM scope s LEFT JOIN units u ON true GROUP BY s.kind`,
    [id],
  );
  return found(result.rows[0]);
}
