-- Up Migration
ALTER TABLE dormitories ALTER COLUMN floor_number DROP NOT NULL, ALTER COLUMN floor_number DROP DEFAULT,
  ADD COLUMN description text, ADD COLUMN image_url text;
ALTER TABLE residents ADD COLUMN expected_discharge_date date,
  ADD CONSTRAINT residents_expected_discharge_check CHECK (expected_discharge_date >= admission_date);
ALTER TABLE accommodation_categories ADD COLUMN public_features text[], ADD COLUMN inventory_key text UNIQUE;
ALTER TABLE rooms ADD COLUMN inventory_key text UNIQUE;
ALTER TABLE dormitories ADD COLUMN inventory_key text UNIQUE;
ALTER TABLE dormitory_beds ADD COLUMN inventory_key text UNIQUE;

-- Open-ended placement leaves room for the peak of outstanding confirmed holds.
CREATE OR REPLACE VIEW vw_room_availability AS
WITH inventory AS (
  SELECT r.id AS room_id, r.category_id, r.building_id, r.room_number, r.capacity,
    CASE WHEN r.operational_status = 'MAINTENANCE' THEN 'MAINTENANCE'
         WHEN NOT c.is_active OR NOT b.is_active OR r.operational_status = 'INACTIVE'
           THEN 'INACTIVE' ELSE 'ACTIVE' END AS operational_status,
    a.occupied, h.reserved, r.floor_number
  FROM rooms r
  JOIN accommodation_categories c ON c.id = r.category_id
  JOIN buildings b ON b.id = r.building_id
  CROSS JOIN LATERAL (
    SELECT count(*)::int AS occupied FROM accommodation_allocations a
    WHERE a.room_id = r.id AND a.status = 'ACTIVE'
  ) a
  CROSS JOIN LATERAL (
    WITH holds AS (
      SELECT reservation_start,reservation_end,reserved_capacity FROM reservations
      WHERE room_id=r.id AND status='CONFIRMED' AND reservation_end>now()
    ), events AS (
      SELECT greatest(reservation_start,now()) AS instant,reserved_capacity AS delta FROM holds
      UNION ALL SELECT reservation_end,-reserved_capacity FROM holds
    ), totals AS (
      SELECT sum(sum(delta)) OVER (ORDER BY instant) AS places FROM events GROUP BY instant
    )
    SELECT coalesce(max(places),0)::int AS reserved FROM totals
  ) h
  WHERE r.deleted_at IS NULL AND c.deleted_at IS NULL AND b.deleted_at IS NULL
)
SELECT room_id,category_id,building_id,room_number,capacity,operational_status,occupied,reserved, CASE WHEN operational_status = 'ACTIVE' THEN greatest(0,capacity-occupied-reserved) ELSE 0 END AS free_spaces,
  operational_status = 'ACTIVE' AND occupied = 0 AND reserved = 0 AS completely_available, floor_number
FROM inventory;

CREATE VIEW vw_bed_availability AS
SELECT bed.id AS bed_id,d.id AS dormitory_id,d.category_id,d.floor_number,
  CASE WHEN d.operational_status='MAINTENANCE' OR bed.operational_status='MAINTENANCE' THEN 'MAINTENANCE'
       WHEN NOT c.is_active OR NOT g.is_active OR d.operational_status='INACTIVE'
         OR bed.operational_status='INACTIVE' THEN 'INACTIVE' ELSE 'ACTIVE' END AS operational_status,
  EXISTS(SELECT 1 FROM accommodation_allocations a WHERE a.bed_id=bed.id AND a.status='ACTIVE') AS occupied,
  EXISTS(SELECT 1 FROM reservations h WHERE h.bed_id=bed.id AND h.status='CONFIRMED' AND h.reservation_end>now()) AS reserved
FROM dormitory_beds bed JOIN dormitories d ON d.id=bed.dormitory_id
JOIN accommodation_categories c ON c.id=d.category_id JOIN buildings g ON g.id=d.building_id
WHERE bed.deleted_at IS NULL AND d.deleted_at IS NULL AND c.deleted_at IS NULL AND g.deleted_at IS NULL;

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

CREATE VIEW vw_accommodation_floor_availability AS
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
SELECT c.id AS category_id, c.category_name, c.category_code, c.accommodation_type,
  r.total_rooms, r.available_rooms, r.occupied_rooms, r.reserved_rooms, r.maintenance_rooms,
  r.free_room_spaces, r.partially_occupied_rooms,
  d.total_dormitories, d.total_beds, d.available_beds, d.occupied_beds, d.reserved_beds, d.maintenance_beds, r.inactive_rooms, d.inactive_beds,
  coalesce((SELECT jsonb_agg(to_jsonb(f)-'category_id' ORDER BY f.floor_number NULLS LAST)
            FROM vw_accommodation_floor_availability f WHERE f.category_id=c.id),'[]'::jsonb) AS floors
FROM accommodation_categories c
CROSS JOIN LATERAL (
  SELECT count(*)::int AS total_rooms,
    count(*) FILTER (WHERE completely_available)::int AS available_rooms,
    count(*) FILTER (WHERE occupied > 0)::int AS occupied_rooms,
    count(*) FILTER (WHERE reserved > 0 AND occupied = 0)::int AS reserved_rooms,
    count(*) FILTER (WHERE operational_status = 'MAINTENANCE')::int AS maintenance_rooms,
    coalesce(sum(free_spaces),0)::int AS free_room_spaces,
    count(*) FILTER (WHERE occupied > 0 AND free_spaces > 0)::int AS partially_occupied_rooms,
    count(*) FILTER (WHERE operational_status='INACTIVE')::int AS inactive_rooms
  FROM vw_room_availability r WHERE r.category_id = c.id
) r
CROSS JOIN LATERAL (
  SELECT count(*)::int AS total_dormitories,
    coalesce(sum(total_beds),0)::int AS total_beds, coalesce(sum(available_beds),0)::int AS available_beds,
    coalesce(sum(occupied_beds),0)::int AS occupied_beds, coalesce(sum(reserved_beds),0)::int AS reserved_beds,
    coalesce(sum(maintenance_beds),0)::int AS maintenance_beds,
    coalesce(sum(inactive_beds),0)::int AS inactive_beds
  FROM vw_dormitory_availability d WHERE d.category_id = c.id
) d
WHERE c.deleted_at IS NULL;

CREATE OR REPLACE VIEW vw_resident_accommodation AS
SELECT p.id AS resident_id, a.id AS allocation_id, a.allocation_type, a.start_at,
  r.id AS room_id, r.room_number, d.id AS dormitory_id, d.dormitory_name, d.dormitory_number,
  b.id AS bed_id, b.bed_number, c.id AS category_id, c.category_name, coalesce(r.floor_number,d.floor_number) AS floor_number
FROM residents p
LEFT JOIN accommodation_allocations a ON a.resident_id = p.id AND a.status = 'ACTIVE'
LEFT JOIN rooms r ON r.id = a.room_id
LEFT JOIN dormitory_beds b ON b.id = a.bed_id
LEFT JOIN dormitories d ON d.id = b.dormitory_id
LEFT JOIN accommodation_categories c ON c.id = coalesce(r.category_id,d.category_id)
WHERE p.deleted_at IS NULL;

-- Down Migration
DROP VIEW vw_dashboard_summary, vw_resident_accommodation, vw_category_availability,
  vw_accommodation_floor_availability, vw_dormitory_availability, vw_bed_availability, vw_room_availability;
ALTER TABLE residents DROP COLUMN expected_discharge_date;
ALTER TABLE accommodation_categories DROP COLUMN public_features, DROP COLUMN inventory_key;
ALTER TABLE rooms DROP COLUMN inventory_key;
ALTER TABLE dormitories DROP COLUMN inventory_key;
ALTER TABLE dormitory_beds DROP COLUMN inventory_key;
ALTER TABLE dormitories ALTER COLUMN floor_number SET NOT NULL, ALTER COLUMN floor_number SET DEFAULT 0,
  DROP COLUMN description, DROP COLUMN image_url;

CREATE VIEW vw_room_availability AS
WITH inventory AS (
  SELECT r.id AS room_id, r.category_id, r.building_id, r.room_number, r.capacity,
    CASE WHEN r.operational_status = 'MAINTENANCE' THEN 'MAINTENANCE'
         WHEN NOT c.is_active OR NOT b.is_active OR r.operational_status = 'INACTIVE'
           THEN 'INACTIVE' ELSE 'ACTIVE' END AS operational_status,
    a.occupied, h.reserved
  FROM rooms r
  JOIN accommodation_categories c ON c.id = r.category_id
  JOIN buildings b ON b.id = r.building_id
  CROSS JOIN LATERAL (
    SELECT count(*)::int AS occupied FROM accommodation_allocations a
    WHERE a.room_id = r.id AND a.status = 'ACTIVE'
  ) a
  CROSS JOIN LATERAL (
    SELECT coalesce(sum(reserved_capacity),0)::int AS reserved FROM reservations h
    WHERE h.room_id = r.id AND h.status = 'CONFIRMED'
      AND h.reservation_start <= now() AND h.reservation_end > now()
  ) h
  WHERE r.deleted_at IS NULL AND c.deleted_at IS NULL AND b.deleted_at IS NULL
)
SELECT *, CASE WHEN operational_status = 'ACTIVE' THEN greatest(0,capacity-occupied-reserved) ELSE 0 END AS free_spaces,
  operational_status = 'ACTIVE' AND occupied = 0 AND reserved = 0 AS completely_available
FROM inventory;

CREATE VIEW vw_dormitory_availability AS
WITH inventory AS (
  SELECT d.id AS dormitory_id, d.category_id, d.building_id, d.dormitory_number, d.dormitory_name, bed.id AS bed_id,
    CASE WHEN d.operational_status = 'MAINTENANCE' OR bed.operational_status = 'MAINTENANCE' THEN 'MAINTENANCE'
         WHEN NOT c.is_active OR NOT b.is_active OR d.operational_status = 'INACTIVE' OR bed.operational_status = 'INACTIVE'
           THEN 'INACTIVE' ELSE 'ACTIVE' END AS operational_status,
    EXISTS (SELECT 1 FROM accommodation_allocations a WHERE a.bed_id = bed.id AND a.status = 'ACTIVE') AS occupied,
    EXISTS (SELECT 1 FROM reservations h WHERE h.bed_id = bed.id AND h.status = 'CONFIRMED'
      AND h.reservation_start <= now() AND h.reservation_end > now()) AS reserved
  FROM dormitories d
  JOIN accommodation_categories c ON c.id = d.category_id
  JOIN buildings b ON b.id = d.building_id
  LEFT JOIN dormitory_beds bed ON bed.dormitory_id = d.id AND bed.deleted_at IS NULL
  WHERE d.deleted_at IS NULL AND c.deleted_at IS NULL AND b.deleted_at IS NULL
)
SELECT dormitory_id, category_id, building_id, dormitory_number, dormitory_name,
  count(bed_id)::int AS total_beds,
  count(bed_id) FILTER (WHERE operational_status = 'ACTIVE' AND NOT occupied AND NOT reserved)::int AS available_beds,
  count(bed_id) FILTER (WHERE occupied)::int AS occupied_beds,
  count(bed_id) FILTER (WHERE reserved AND NOT occupied)::int AS reserved_beds,
  count(bed_id) FILTER (WHERE operational_status = 'MAINTENANCE')::int AS maintenance_beds
FROM inventory GROUP BY dormitory_id, category_id, building_id, dormitory_number, dormitory_name;

CREATE VIEW vw_category_availability AS
SELECT c.id AS category_id, c.category_name, c.category_code, c.accommodation_type,
  r.total_rooms, r.available_rooms, r.occupied_rooms, r.reserved_rooms, r.maintenance_rooms,
  r.free_room_spaces, r.partially_occupied_rooms,
  d.total_dormitories, d.total_beds, d.available_beds, d.occupied_beds, d.reserved_beds, d.maintenance_beds
FROM accommodation_categories c
CROSS JOIN LATERAL (
  SELECT count(*)::int AS total_rooms,
    count(*) FILTER (WHERE completely_available)::int AS available_rooms,
    count(*) FILTER (WHERE occupied > 0)::int AS occupied_rooms,
    count(*) FILTER (WHERE reserved > 0)::int AS reserved_rooms,
    count(*) FILTER (WHERE operational_status = 'MAINTENANCE')::int AS maintenance_rooms,
    coalesce(sum(free_spaces),0)::int AS free_room_spaces,
    count(*) FILTER (WHERE occupied > 0 AND free_spaces > 0)::int AS partially_occupied_rooms
  FROM vw_room_availability r WHERE r.category_id = c.id
) r
CROSS JOIN LATERAL (
  SELECT count(*)::int AS total_dormitories,
    coalesce(sum(total_beds),0)::int AS total_beds, coalesce(sum(available_beds),0)::int AS available_beds,
    coalesce(sum(occupied_beds),0)::int AS occupied_beds, coalesce(sum(reserved_beds),0)::int AS reserved_beds,
    coalesce(sum(maintenance_beds),0)::int AS maintenance_beds
  FROM vw_dormitory_availability d WHERE d.category_id = c.id
) d
WHERE c.deleted_at IS NULL;

CREATE VIEW vw_resident_accommodation AS
SELECT p.id AS resident_id, a.id AS allocation_id, a.allocation_type, a.start_at,
  r.id AS room_id, r.room_number, d.id AS dormitory_id, d.dormitory_name, d.dormitory_number,
  b.id AS bed_id, b.bed_number, c.id AS category_id, c.category_name
FROM residents p
LEFT JOIN accommodation_allocations a ON a.resident_id = p.id AND a.status = 'ACTIVE'
LEFT JOIN rooms r ON r.id = a.room_id
LEFT JOIN dormitory_beds b ON b.id = a.bed_id
LEFT JOIN dormitories d ON d.id = b.dormitory_id
LEFT JOIN accommodation_categories c ON c.id = coalesce(r.category_id,d.category_id)
WHERE p.deleted_at IS NULL;

CREATE VIEW vw_dashboard_summary AS
SELECT
  (SELECT count(*)::int FROM users WHERE deleted_at IS NULL) AS total_staff,
  (SELECT count(*)::int FROM users WHERE deleted_at IS NULL AND status = 'ACTIVE') AS active_staff,
  (SELECT count(*)::int FROM enquiries WHERE deleted_at IS NULL) AS total_enquiries,
  (SELECT count(*)::int FROM enquiries WHERE deleted_at IS NULL AND status = 'NEW') AS new_enquiries,
  (SELECT count(*)::int FROM enquiries WHERE deleted_at IS NULL AND status = 'PENDING') AS pending_enquiries,
  (SELECT count(*)::int FROM enquiries WHERE deleted_at IS NULL AND status IN ('SUBMITTED','CLOSED')) AS completed_enquiries,
  (SELECT count(*)::int FROM residents WHERE deleted_at IS NULL AND admission_status <> 'DISCHARGED') AS admitted_residents,
  (SELECT count(*)::int FROM residents WHERE deleted_at IS NULL AND admission_status = 'DISCHARGED') AS discharged_residents,
  coalesce(sum(total_rooms),0)::int AS total_rooms,
  coalesce(sum(available_rooms),0)::int AS available_rooms,
  coalesce(sum(occupied_rooms),0)::int AS occupied_rooms,
  coalesce(sum(free_room_spaces),0)::int AS free_room_spaces,
  coalesce(sum(total_dormitories),0)::int AS total_dormitories,
  coalesce(sum(total_beds),0)::int AS total_beds,
  coalesce(sum(available_beds),0)::int AS available_beds,
  coalesce(sum(occupied_beds),0)::int AS occupied_beds,
  coalesce(sum(reserved_rooms + reserved_beds),0)::int AS reserved_accommodation,
  coalesce(sum(maintenance_rooms + maintenance_beds),0)::int AS accommodation_under_maintenance
FROM vw_category_availability;
