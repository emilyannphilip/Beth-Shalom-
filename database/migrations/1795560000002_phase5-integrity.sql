-- Up Migration
CREATE FUNCTION enforce_allocation_capacity() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE limit_count integer;
DECLARE occupied integer;
BEGIN
  IF NEW.status <> 'ACTIVE' THEN RETURN NEW; END IF;
  PERFORM pg_advisory_xact_lock(727091, 5);
  PERFORM FROM residents WHERE id=NEW.resident_id AND deleted_at IS NULL AND admission_status<>'DISCHARGED' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION USING ERRCODE='23514', MESSAGE='Allocation requires an admitted resident'; END IF;

  IF NEW.room_id IS NOT NULL THEN
    SELECT r.capacity INTO limit_count FROM rooms r
      JOIN accommodation_categories c ON c.id=r.category_id JOIN buildings b ON b.id=r.building_id
      WHERE r.id=NEW.room_id AND r.deleted_at IS NULL AND r.operational_status='ACTIVE'
        AND c.deleted_at IS NULL AND c.is_active AND c.accommodation_type='ROOM' AND b.deleted_at IS NULL AND b.is_active
      FOR UPDATE OF r;
    SELECT count(*) INTO occupied FROM accommodation_allocations
      WHERE room_id=NEW.room_id AND status='ACTIVE' AND id<>NEW.id;
    IF limit_count IS NULL OR occupied>=limit_count THEN
      RAISE EXCEPTION USING ERRCODE='23514', MESSAGE='Room is unavailable or full';
    END IF;
  ELSE
    PERFORM FROM dormitory_beds bed JOIN dormitories d ON d.id=bed.dormitory_id
      JOIN accommodation_categories c ON c.id=d.category_id JOIN buildings b ON b.id=d.building_id
      WHERE bed.id=NEW.bed_id AND bed.deleted_at IS NULL AND bed.operational_status='ACTIVE'
        AND d.deleted_at IS NULL AND d.operational_status='ACTIVE'
        AND c.deleted_at IS NULL AND c.is_active AND c.accommodation_type='DORMITORY'
        AND b.deleted_at IS NULL AND b.is_active FOR UPDATE OF bed;
    IF NOT FOUND THEN RAISE EXCEPTION USING ERRCODE='23514', MESSAGE='The bed is unavailable'; END IF;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER allocation_capacity BEFORE INSERT OR UPDATE OF resident_id,room_id,bed_id,status ON accommodation_allocations
  FOR EACH ROW EXECUTE FUNCTION enforce_allocation_capacity();

CREATE FUNCTION enforce_inventory_category() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  PERFORM FROM accommodation_categories WHERE id=NEW.category_id AND accommodation_type=TG_ARGV[0];
  IF NOT FOUND THEN RAISE EXCEPTION USING ERRCODE='23514', MESSAGE='The accommodation category must match the inventory type'; END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER room_category_type BEFORE INSERT OR UPDATE OF category_id ON rooms
  FOR EACH ROW EXECUTE FUNCTION enforce_inventory_category('ROOM');
CREATE TRIGGER dormitory_category_type BEFORE INSERT OR UPDATE OF category_id ON dormitories
  FOR EACH ROW EXECUTE FUNCTION enforce_inventory_category('DORMITORY');

-- Down Migration
DROP TRIGGER room_category_type ON rooms;
DROP TRIGGER dormitory_category_type ON dormitories;
DROP TRIGGER allocation_capacity ON accommodation_allocations;
DROP FUNCTION enforce_inventory_category(), enforce_allocation_capacity();
