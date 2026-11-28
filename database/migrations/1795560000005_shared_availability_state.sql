-- Up Migration
CREATE FUNCTION housing_availability_state(operational text, occupied boolean, reserved boolean)
RETURNS text LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
  SELECT CASE WHEN occupied THEN 'OCCUPIED'
              WHEN reserved THEN 'RESERVED'
              WHEN operational = 'MAINTENANCE' THEN 'MAINTENANCE'
              WHEN operational = 'INACTIVE' THEN 'INACTIVE'
              WHEN operational = 'ACTIVE' THEN 'AVAILABLE'
         END;
$$;

-- Count each unit once. A booking takes precedence if legacy inventory has conflicting flags.
CREATE OR REPLACE VIEW vw_dormitory_availability AS
SELECT d.id AS dormitory_id,d.category_id,d.building_id,d.dormitory_number,d.dormitory_name,
  count(b.bed_id)::int AS total_beds,
  count(*) FILTER (WHERE housing_availability_state(b.operational_status,b.occupied,b.reserved)='AVAILABLE')::int AS available_beds,
  count(*) FILTER (WHERE housing_availability_state(b.operational_status,b.occupied,b.reserved)='OCCUPIED')::int AS occupied_beds,
  count(*) FILTER (WHERE housing_availability_state(b.operational_status,b.occupied,b.reserved)='RESERVED')::int AS reserved_beds,
  count(*) FILTER (WHERE housing_availability_state(b.operational_status,b.occupied,b.reserved)='MAINTENANCE')::int AS maintenance_beds,
  d.floor_number,
  count(*) FILTER (WHERE housing_availability_state(b.operational_status,b.occupied,b.reserved)='INACTIVE')::int AS inactive_beds
FROM dormitories d JOIN accommodation_categories c ON c.id=d.category_id JOIN buildings g ON g.id=d.building_id
LEFT JOIN vw_bed_availability b ON b.dormitory_id=d.id
WHERE d.deleted_at IS NULL AND c.deleted_at IS NULL AND g.deleted_at IS NULL
GROUP BY d.id;

CREATE OR REPLACE VIEW vw_accommodation_floor_availability AS
SELECT category_id,floor_number,count(*)::int AS total_units,
  count(*) FILTER (WHERE housing_availability_state(operational_status,occupied>0,reserved>0)='AVAILABLE')::int AS available_units,
  count(*) FILTER (WHERE housing_availability_state(operational_status,occupied>0,reserved>0)='OCCUPIED')::int AS occupied_units,
  count(*) FILTER (WHERE housing_availability_state(operational_status,occupied>0,reserved>0)='RESERVED')::int AS reserved_units,
  count(*) FILTER (WHERE housing_availability_state(operational_status,occupied>0,reserved>0)='MAINTENANCE')::int AS maintenance_units,
  count(*) FILTER (WHERE housing_availability_state(operational_status,occupied>0,reserved>0)='INACTIVE')::int AS inactive_units,
  coalesce(sum(free_spaces),0)::int AS remaining_spaces
FROM vw_room_availability GROUP BY category_id,floor_number
UNION ALL
SELECT category_id,floor_number,sum(total_beds)::int,sum(available_beds)::int,
  sum(occupied_beds)::int,sum(reserved_beds)::int,sum(maintenance_beds)::int,
  sum(inactive_beds)::int,sum(available_beds)::int
FROM vw_dormitory_availability GROUP BY category_id,floor_number;

CREATE OR REPLACE VIEW vw_category_availability AS
WITH floor_inventory AS (
  SELECT category_id, floor_number, 'ROOM' AS kind,
         count(*)::int AS total_units,
         count(*) FILTER (WHERE housing_availability_state(operational_status,occupied>0,reserved>0)='AVAILABLE')::int AS available_units,
         count(*) FILTER (WHERE housing_availability_state(operational_status,occupied>0,reserved>0)='OCCUPIED')::int AS occupied_units,
         count(*) FILTER (WHERE housing_availability_state(operational_status,occupied>0,reserved>0)='RESERVED')::int AS reserved_units,
         count(*) FILTER (WHERE housing_availability_state(operational_status,occupied>0,reserved>0)='MAINTENANCE')::int AS maintenance_units,
         count(*) FILTER (WHERE housing_availability_state(operational_status,occupied>0,reserved>0)='INACTIVE')::int AS inactive_units,
         coalesce(sum(free_spaces),0)::int AS remaining_spaces,
         count(*) FILTER (WHERE occupied>0 AND free_spaces > 0)::int AS partially_occupied,
         0 AS dormitory_count
  FROM vw_room_availability GROUP BY category_id, floor_number
  UNION ALL
  SELECT category_id, floor_number, 'DORMITORY',
         sum(total_beds)::int, sum(available_beds)::int, sum(occupied_beds)::int,
         sum(reserved_beds)::int, sum(maintenance_beds)::int, sum(inactive_beds)::int,
         sum(available_beds)::int, 0, count(*)::int
  FROM vw_dormitory_availability GROUP BY category_id, floor_number
), totals AS (
  SELECT category_id,
    sum(total_units) FILTER (WHERE kind = 'ROOM')::int AS total_rooms,
    sum(available_units) FILTER (WHERE kind = 'ROOM')::int AS available_rooms,
    sum(occupied_units) FILTER (WHERE kind = 'ROOM')::int AS occupied_rooms,
    sum(reserved_units) FILTER (WHERE kind = 'ROOM')::int AS reserved_rooms,
    sum(maintenance_units) FILTER (WHERE kind = 'ROOM')::int AS maintenance_rooms,
    sum(remaining_spaces) FILTER (WHERE kind = 'ROOM')::int AS free_room_spaces,
    sum(partially_occupied)::int AS partially_occupied_rooms,
    sum(dormitory_count)::int AS total_dormitories,
    sum(total_units) FILTER (WHERE kind = 'DORMITORY')::int AS total_beds,
    sum(available_units) FILTER (WHERE kind = 'DORMITORY')::int AS available_beds,
    sum(occupied_units) FILTER (WHERE kind = 'DORMITORY')::int AS occupied_beds,
    sum(reserved_units) FILTER (WHERE kind = 'DORMITORY')::int AS reserved_beds,
    sum(maintenance_units) FILTER (WHERE kind = 'DORMITORY')::int AS maintenance_beds,
    sum(inactive_units) FILTER (WHERE kind = 'ROOM')::int AS inactive_rooms,
    sum(inactive_units) FILTER (WHERE kind = 'DORMITORY')::int AS inactive_beds,
    jsonb_agg(to_jsonb(f) - ARRAY['category_id','kind','partially_occupied','dormitory_count']
              ORDER BY floor_number NULLS LAST) AS floors
  FROM floor_inventory f GROUP BY category_id
)
SELECT c.id AS category_id, c.category_name, c.category_code, c.accommodation_type,
       coalesce(t.total_rooms,0) AS total_rooms,
       coalesce(t.available_rooms,0) AS available_rooms,
       coalesce(t.occupied_rooms,0) AS occupied_rooms,
       coalesce(t.reserved_rooms,0) AS reserved_rooms,
       coalesce(t.maintenance_rooms,0) AS maintenance_rooms,
       coalesce(t.free_room_spaces,0) AS free_room_spaces,
       coalesce(t.partially_occupied_rooms,0) AS partially_occupied_rooms,
       coalesce(t.total_dormitories,0) AS total_dormitories,
       coalesce(t.total_beds,0) AS total_beds,
       coalesce(t.available_beds,0) AS available_beds,
       coalesce(t.occupied_beds,0) AS occupied_beds,
       coalesce(t.reserved_beds,0) AS reserved_beds,
       coalesce(t.maintenance_beds,0) AS maintenance_beds,
       coalesce(t.inactive_rooms,0) AS inactive_rooms,
       coalesce(t.inactive_beds,0) AS inactive_beds,
       coalesce(t.floors,'[]'::jsonb) AS floors
FROM accommodation_categories c LEFT JOIN totals t ON t.category_id = c.id
WHERE c.deleted_at IS NULL;

-- Down Migration
CREATE OR REPLACE VIEW vw_dormitory_availability AS
SELECT d.id AS dormitory_id,d.category_id,d.building_id,d.dormitory_number,d.dormitory_name,
  count(b.bed_id)::int AS total_beds,
  count(*) FILTER (WHERE b.operational_status='ACTIVE' AND NOT b.occupied AND NOT b.reserved)::int AS available_beds,
  count(*) FILTER (WHERE b.occupied)::int AS occupied_beds,
  count(*) FILTER (WHERE b.reserved AND NOT b.occupied)::int AS reserved_beds,
  count(*) FILTER (WHERE b.operational_status='MAINTENANCE')::int AS maintenance_beds,
  d.floor_number,
  count(*) FILTER (WHERE b.operational_status='INACTIVE')::int AS inactive_beds
FROM dormitories d JOIN accommodation_categories c ON c.id=d.category_id JOIN buildings g ON g.id=d.building_id
LEFT JOIN vw_bed_availability b ON b.dormitory_id=d.id
WHERE d.deleted_at IS NULL AND c.deleted_at IS NULL AND g.deleted_at IS NULL
GROUP BY d.id;

CREATE OR REPLACE VIEW vw_accommodation_floor_availability AS
SELECT category_id,floor_number,count(*)::int AS total_units,
  count(*) FILTER (WHERE completely_available)::int AS available_units,
  count(*) FILTER (WHERE occupied>0)::int AS occupied_units,
  count(*) FILTER (WHERE reserved>0 AND occupied=0)::int AS reserved_units,
  count(*) FILTER (WHERE operational_status='MAINTENANCE')::int AS maintenance_units,
  count(*) FILTER (WHERE operational_status='INACTIVE')::int AS inactive_units,
  coalesce(sum(free_spaces),0)::int AS remaining_spaces
FROM vw_room_availability GROUP BY category_id,floor_number
UNION ALL
SELECT category_id,floor_number,sum(total_beds)::int,sum(available_beds)::int,
  sum(occupied_beds)::int,sum(reserved_beds)::int,sum(maintenance_beds)::int,
  sum(inactive_beds)::int,sum(available_beds)::int
FROM vw_dormitory_availability GROUP BY category_id,floor_number;

CREATE OR REPLACE VIEW vw_category_availability AS
WITH floor_inventory AS (
  SELECT category_id, floor_number, 'ROOM' AS kind,
         count(*)::int AS total_units,
         count(*) FILTER (WHERE completely_available)::int AS available_units,
         count(*) FILTER (WHERE occupied > 0)::int AS occupied_units,
         count(*) FILTER (WHERE reserved > 0 AND occupied = 0)::int AS reserved_units,
         count(*) FILTER (WHERE operational_status = 'MAINTENANCE')::int AS maintenance_units,
         count(*) FILTER (WHERE operational_status = 'INACTIVE')::int AS inactive_units,
         coalesce(sum(free_spaces),0)::int AS remaining_spaces,
         count(*) FILTER (WHERE occupied > 0 AND free_spaces > 0)::int AS partially_occupied,
         0 AS dormitory_count
  FROM vw_room_availability GROUP BY category_id, floor_number
  UNION ALL
  SELECT category_id, floor_number, 'DORMITORY',
         sum(total_beds)::int, sum(available_beds)::int, sum(occupied_beds)::int,
         sum(reserved_beds)::int, sum(maintenance_beds)::int, sum(inactive_beds)::int,
         sum(available_beds)::int, 0, count(*)::int
  FROM vw_dormitory_availability GROUP BY category_id, floor_number
), totals AS (
  SELECT category_id,
    sum(total_units) FILTER (WHERE kind = 'ROOM')::int AS total_rooms,
    sum(available_units) FILTER (WHERE kind = 'ROOM')::int AS available_rooms,
    sum(occupied_units) FILTER (WHERE kind = 'ROOM')::int AS occupied_rooms,
    sum(reserved_units) FILTER (WHERE kind = 'ROOM')::int AS reserved_rooms,
    sum(maintenance_units) FILTER (WHERE kind = 'ROOM')::int AS maintenance_rooms,
    sum(remaining_spaces) FILTER (WHERE kind = 'ROOM')::int AS free_room_spaces,
    sum(partially_occupied)::int AS partially_occupied_rooms,
    sum(dormitory_count)::int AS total_dormitories,
    sum(total_units) FILTER (WHERE kind = 'DORMITORY')::int AS total_beds,
    sum(available_units) FILTER (WHERE kind = 'DORMITORY')::int AS available_beds,
    sum(occupied_units) FILTER (WHERE kind = 'DORMITORY')::int AS occupied_beds,
    sum(reserved_units) FILTER (WHERE kind = 'DORMITORY')::int AS reserved_beds,
    sum(maintenance_units) FILTER (WHERE kind = 'DORMITORY')::int AS maintenance_beds,
    sum(inactive_units) FILTER (WHERE kind = 'ROOM')::int AS inactive_rooms,
    sum(inactive_units) FILTER (WHERE kind = 'DORMITORY')::int AS inactive_beds,
    jsonb_agg(to_jsonb(f) - ARRAY['category_id','kind','partially_occupied','dormitory_count']
              ORDER BY floor_number NULLS LAST) AS floors
  FROM floor_inventory f GROUP BY category_id
)
SELECT c.id AS category_id, c.category_name, c.category_code, c.accommodation_type,
       coalesce(t.total_rooms,0) AS total_rooms,
       coalesce(t.available_rooms,0) AS available_rooms,
       coalesce(t.occupied_rooms,0) AS occupied_rooms,
       coalesce(t.reserved_rooms,0) AS reserved_rooms,
       coalesce(t.maintenance_rooms,0) AS maintenance_rooms,
       coalesce(t.free_room_spaces,0) AS free_room_spaces,
       coalesce(t.partially_occupied_rooms,0) AS partially_occupied_rooms,
       coalesce(t.total_dormitories,0) AS total_dormitories,
       coalesce(t.total_beds,0) AS total_beds,
       coalesce(t.available_beds,0) AS available_beds,
       coalesce(t.occupied_beds,0) AS occupied_beds,
       coalesce(t.reserved_beds,0) AS reserved_beds,
       coalesce(t.maintenance_beds,0) AS maintenance_beds,
       coalesce(t.inactive_rooms,0) AS inactive_rooms,
       coalesce(t.inactive_beds,0) AS inactive_beds,
       coalesce(t.floors,'[]'::jsonb) AS floors
FROM accommodation_categories c LEFT JOIN totals t ON t.category_id = c.id
WHERE c.deleted_at IS NULL;

DROP FUNCTION housing_availability_state(text, boolean, boolean);
