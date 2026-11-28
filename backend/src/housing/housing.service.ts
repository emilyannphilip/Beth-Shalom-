import {
  BadRequestException,
  ConflictException,
  Global,
  Injectable,
  Module,
} from "@nestjs/common";
import type { PoolClient } from "pg";
import { Database, type Sql } from "../database/database.module";
import {
  audit,
  found,
  insert,
  list,
  update,
  type ListQuery,
} from "../common/api";
import {
  inventoryStates,
  reservationStates,
  type AccommodationTarget,
  type CategoryReassign,
  type ReservationData,
  type ReservationPatch,
} from "../common/dtos";

import {
  readInventoryAvailability,
  type AvailabilityScope,
  type AvailabilityChange,
} from "./availability";

export type InventoryTable =
  | "accommodation_categories"
  | "buildings"
  | "rooms"
  | "dormitories"
  | "dormitory_beds";
type Target = { room_id?: string | null; bed_id?: string | null };
type Booking = Target & { id: string; resident_id: string };
type Reservation = Target & {
  id: string;
  record_status?: string;
  status: string;
  enquiry_id?: string | null;
  resident_id?: string | null;
  reservation_start: string | Date;
  reservation_end: string | Date;
  reserved_capacity: number;
  remarks?: string;
};
type CategoryUnit = {
  id: string;
  kind: "ROOM" | "DORMITORY";
  number: string;
  name: string | null;
  building: string;
  operational_status: string;
  active_allocations: number;
  active_reservations: number;
};
const categoryArchiveConflict =
  "Unable to delete this accommodation category because active rooms or dormitories are associated with it. Please reassign or safely archive the associated inventory before deleting this category.";
const hasBookings = (unit: CategoryUnit) =>
  unit.active_allocations > 0 || unit.active_reservations > 0;
const live = "t.deleted_at IS NULL";
const statusLabel = (state: string, occupied: string) =>
  "CASE " +
  state +
  " WHEN 'OCCUPIED' THEN " +
  occupied +
  " WHEN 'RESERVED' THEN 'Reserved' WHEN 'MAINTENANCE' THEN 'Under Maintenance' WHEN 'INACTIVE' THEN 'Inactive' ELSE 'Available' END";
const roomStatus = statusLabel(
  "housing_availability_state(v.operational_status,v.occupied>0,v.reserved>0)",
  "(CASE WHEN v.free_spaces>0 THEN 'Partially Occupied' ELSE 'Occupied' END)",
);
const bedStatus = statusLabel(
  "housing_availability_state(v.operational_status,v.occupied,v.reserved)",
  "'Occupied'",
);
const byStatus = {
  status: "t.operational_status",
  categoryId: "t.category_id",
  buildingId: "t.building_id",
  floor: "t.floor_number",
};
export const inventoryCollections = {
  accommodation_categories: {
    from: "accommodation_categories t JOIN vw_category_availability v ON v.category_id=t.id",
    select: "t.*, to_jsonb(v) AS availability",
    where: live,
    search: ["t.category_name", "t.category_code"],
    sorts: ["created_at", "category_name", "category_code"],
    filters: {
      accommodationType: "t.accommodation_type",
      availabilityStatus:
        "(CASE WHEN t.is_active THEN 'Active' ELSE 'Inactive' END)",
    },
  },
  buildings: {
    from: "buildings t",
    where: live,
    search: ["t.building_name", "t.building_code"],
    sorts: ["created_at", "building_name", "building_code"],
  },
  rooms: {
    from: "rooms t JOIN vw_room_availability v ON v.room_id=t.id",
    select:
      "t.*, to_jsonb(v) AS availability," +
      roomStatus +
      " AS availability_status",
    where: live,
    search: ["t.room_number"],
    sorts: ["created_at", "room_number", "capacity"],
    filters: { ...byStatus, availabilityStatus: roomStatus },
    statusValues: inventoryStates,
  },
  dormitories: {
    from: "dormitories t JOIN vw_dormitory_availability v ON v.dormitory_id=t.id",
    select: "t.*, to_jsonb(v) AS availability",
    where: live,
    search: ["t.dormitory_number", "t.dormitory_name"],
    sorts: ["created_at", "dormitory_number", "dormitory_name"],
    filters: {
      ...byStatus,
      availabilityStatus:
        "(CASE t.operational_status WHEN 'ACTIVE' THEN 'Active' WHEN 'INACTIVE' THEN 'Inactive' ELSE 'Under Maintenance' END)",
    },
    statusValues: inventoryStates,
  },
  dormitory_beds: {
    from: "dormitory_beds t JOIN vw_bed_availability v ON v.bed_id=t.id",
    select: "t.*," + bedStatus + " AS availability_status",
    where: live,
    search: ["t.bed_number"],
    sorts: ["created_at", "bed_number"],
    filters: {
      status: "t.operational_status",
      dormitoryId: "t.dormitory_id",
      categoryId: "v.category_id",
      floor: "v.floor_number",
      availabilityStatus: bedStatus,
    },
    statusValues: inventoryStates,
  },
};
const allocationCollection = {
  from: "accommodation_allocations t JOIN residents p ON p.id=t.resident_id LEFT JOIN rooms r ON r.id=t.room_id LEFT JOIN dormitory_beds b ON b.id=t.bed_id",
  select:
    "t.*, p.resident_number, p.full_name AS resident_name, r.room_number, b.bed_number",
  search: ["p.resident_number", "p.full_name", "r.room_number", "b.bed_number"],
  sorts: ["created_at", "start_at", "resident_number"],
  filters: {
    status: "t.status",
    roomId: "t.room_id",
    bedId: "t.bed_id",
    dormitoryId: "b.dormitory_id",
    accommodationType: "t.allocation_type",
  },
  statusValues: ["ACTIVE", "RELEASED", "TRANSFERRED", "CANCELLED"],
  date: "t.start_at",
};
const reservationCollection = {
  from: "reservations t LEFT JOIN residents p ON p.id=t.resident_id LEFT JOIN rooms r ON r.id=t.room_id LEFT JOIN dormitory_beds b ON b.id=t.bed_id",
  select:
    "t.*, p.resident_number, p.full_name AS resident_name, r.room_number, b.bed_number",
  search: [
    "t.reservation_number",
    "p.resident_number",
    "p.full_name",
    "r.room_number",
    "b.bed_number",
  ],
  sorts: [
    "created_at",
    "reservation_start",
    "reservation_end",
    "reservation_number",
  ],
  filters: {
    status: "t.status",
    roomId: "t.room_id",
    bedId: "t.bed_id",
    dormitoryId: "b.dormitory_id",
    accommodationType:
      "(CASE WHEN t.room_id IS NOT NULL THEN 'ROOM' ELSE 'DORMITORY' END)",
  },
  statusValues: reservationStates,
  date: "t.reservation_start",
};

export function targetOf(input: Target) {
  if (Boolean(input.room_id) === Boolean(input.bed_id))
    throw new BadRequestException("Select exactly one room or bed.");
  return {
    table: input.room_id ? "rooms" : "dormitory_beds",
    field: input.room_id ? "room_id" : "bed_id",
    id: (input.room_id ?? input.bed_id)!,
    room_id: input.room_id ?? null,
    bed_id: input.bed_id ?? null,
  };
}

@Injectable()
export class HousingService {
  constructor(readonly db: Database) {}

  // All housing mutations take this lock first; the affected inventory and
  // resident rows are locked inside the transaction before validation.
  transaction<T>(work: (sql: PoolClient) => Promise<T>) {
    return this.db.transaction(async (sql) => {
      await sql.query("SELECT pg_advisory_xact_lock(727091, 5)");
      return work(sql);
    });
  }

  inventory(table: InventoryTable, query: ListQuery) {
    return list(this.db, inventoryCollections[table], query);
  }

  async item(table: InventoryTable, id: string) {
    const collection = inventoryCollections[table];
    const result = await this.db.query(
      "SELECT " +
        ("select" in collection ? collection.select : "t.*") +
        " FROM " +
        collection.from +
        " WHERE t.id=$1 AND " +
        live,
      [id],
    );
    return found(result.rows[0]);
  }

  private async categoryUnits(sql: Sql, id: string) {
    const result = await sql.query<CategoryUnit>(
      `WITH units AS (
         SELECT id, 'ROOM' AS kind, room_number AS number, NULL::text AS name,
           building_id, operational_status
         FROM rooms WHERE category_id=$1 AND deleted_at IS NULL
         UNION ALL
         SELECT id, 'DORMITORY', dormitory_number, dormitory_name,
           building_id, operational_status
         FROM dormitories WHERE category_id=$1 AND deleted_at IS NULL
       )
       SELECT u.id,u.kind,u.number,u.name,u.operational_status,b.building_name AS building,
         (SELECT count(*)::int FROM accommodation_allocations a
          WHERE a.status='ACTIVE' AND (
            (u.kind='ROOM' AND a.room_id=u.id) OR a.bed_id IN (
              SELECT id FROM dormitory_beds WHERE u.kind='DORMITORY' AND dormitory_id=u.id
            )
          )) AS active_allocations,
         (SELECT count(*)::int FROM reservations h
          WHERE h.status IN ('PENDING','CONFIRMED') AND h.reservation_end>now() AND (
            (u.kind='ROOM' AND h.room_id=u.id) OR h.bed_id IN (
              SELECT id FROM dormitory_beds WHERE u.kind='DORMITORY' AND dormitory_id=u.id
            )
          )) AS active_reservations
       FROM units u JOIN buildings b ON b.id=u.building_id ORDER BY u.kind,u.number`,
      [id],
    );
    return result.rows;
  }

  async categoryDependencies(id: string) {
    const category = await this.item("accommodation_categories", id);
    const [inventory, compatible] = await Promise.all([
      this.categoryUnits(this.db, id),
      this.db.query<{ id: string; category_name: string }>(
        "SELECT id,category_name FROM accommodation_categories WHERE id<>$1 AND accommodation_type=$2 AND is_active AND deleted_at IS NULL ORDER BY category_name,id",
        [id, category.accommodation_type],
      ),
    ]);
    return {
      is_active: category.is_active as boolean,
      inventory,
      room_count: inventory.filter((unit) => unit.kind === "ROOM").length,
      dormitory_count: inventory.filter((unit) => unit.kind === "DORMITORY")
        .length,
      compatible_categories: compatible.rows,
    };
  }

  reassignCategory(user: string, categoryId: string, change: CategoryReassign) {
    const id = categoryId.toLowerCase();
    return this.transaction(async (sql) => {
      const destinationId = change.destination_category_id.toLowerCase();
      if (id === destinationId)
        throw new ConflictException(
          "Choose a different accommodation category.",
        );
      const categories = await sql.query<{
        id: string;
        accommodation_type: string;
        is_active: boolean;
      }>(
        "SELECT id,accommodation_type,is_active FROM accommodation_categories WHERE id=ANY($1::uuid[]) AND deleted_at IS NULL ORDER BY id FOR UPDATE",
        [[id, destinationId]],
      );
      const source = found(categories.rows.find((row) => row.id === id));
      const destination = categories.rows.find(
        (row) => row.id === destinationId,
      );
      if (
        !destination?.is_active ||
        source.accommodation_type !== destination.accommodation_type
      )
        throw new ConflictException(
          "Choose an active destination of the same accommodation type.",
        );
      const ids = new Set(
        change.inventory_ids.map((unitId) => unitId.toLowerCase()),
      );
      const selected = (await this.categoryUnits(sql, id)).filter((unit) =>
        ids.has(unit.id),
      );
      if (selected.length !== change.inventory_ids.length)
        throw new ConflictException(
          "The selected inventory has changed. Review the category and try again.",
        );
      if (selected.some(hasBookings))
        throw new ConflictException(
          "Resolve active allocations and reservations before reassigning the selected inventory.",
        );
      for (const unit of selected) {
        const table = unit.kind === "ROOM" ? "rooms" : "dormitories";
        const before = found(
          (
            await sql.query(
              "SELECT * FROM " + table + " WHERE id=$1 FOR UPDATE",
              [unit.id],
            )
          ).rows[0],
        );
        const after = await update(sql, table, unit.id, {
          category_id: destination.id,
        });
        await audit(sql, user, table, unit.id, "UPDATE", before, after);
      }
      return { reassigned: selected.length };
    });
  }

  availability(scope: AvailabilityScope, id: string) {
    return readInventoryAvailability(this.db, scope, id);
  }

  adjustAvailability(
    user: string,
    scope: AvailabilityScope,
    id: string,
    changes: AvailabilityChange[],
  ) {
    return this.transaction(async (sql) => {
      const snapshot = await readInventoryAvailability(sql, scope, id);
      const units = new Map(snapshot.units.map((unit) => [unit.id, unit]));
      const table = snapshot.kind === "ROOM" ? "rooms" : "dormitory_beds";
      for (const change of changes) {
        const unit = units.get(change.id.toLowerCase());
        if (!unit)
          throw new ConflictException(
            "Select units that still belong to this accommodation.",
          );
        if (unit.operational_status !== change.expected_status)
          throw new ConflictException(
            "A selected unit has changed. Review the updated availability before saving.",
          );
        if (unit.occupied || unit.open_reservation)
          throw new ConflictException(
            unit.number +
              " has an active allocation or open reservation. Manage that booking before changing availability.",
          );
        if (change.status === unit.operational_status)
          throw new BadRequestException(
            "Choose a different status for " + unit.number + ".",
          );
        if (
          (change.status === "ACTIVE" || change.status === "MAINTENANCE") &&
          !unit.parent_open
        )
          throw new ConflictException(
            unit.number +
              " belongs to inactive accommodation. Activate the parent first.",
          );
      }
      for (const change of changes) {
        const archive = change.status === "ARCHIVE";
        await this.changeInventory(
          sql,
          table,
          user,
          archive ? {} : { operational_status: change.status },
          change.id.toLowerCase(),
          archive,
        );
      }
      return readInventoryAvailability(sql, scope, id);
    });
  }

  async writeInventory(
    table: InventoryTable,
    user: string,
    input: object,
    id?: string,
    archive = false,
  ) {
    return this.transaction((sql) =>
      this.changeInventory(sql, table, user, input, id, archive),
    );
  }

  private async changeInventory(
    sql: Sql,
    table: InventoryTable,
    user: string,
    input: object,
    id?: string,
    archive = false,
  ) {
    const before = id
      ? found(
          (
            await sql.query(
              "SELECT * FROM " +
                table +
                " WHERE id=$1 AND deleted_at IS NULL FOR UPDATE",
              [id],
            )
          ).rows[0],
        )
      : undefined;
    if (
      table === "rooms" &&
      "floor_number" in input &&
      input.floor_number === null
    )
      throw new BadRequestException("A room floor is required.");
    const next = {
      ...before,
      ...Object.fromEntries(
        Object.entries(input).filter(([, value]) => value !== undefined),
      ),
    };
    if (table === "rooms" || table === "dormitories") {
      const parents = await sql.query(
        "SELECT c.accommodation_type, c.is_active AND b.is_active AS active " +
          "FROM accommodation_categories c CROSS JOIN buildings b WHERE c.id=$1 AND b.id=$2 AND c.deleted_at IS NULL AND b.deleted_at IS NULL",
        [next.category_id, next.building_id],
      );
      const parent = found(parents.rows[0]);
      if (
        parent.accommodation_type !== (table === "rooms" ? "ROOM" : "DORMITORY")
      ) {
        throw new ConflictException(
          "The category has a different accommodation type.",
        );
      }
      if (
        !archive &&
        next.operational_status !== "INACTIVE" &&
        !parent.active
      ) {
        throw new ConflictException("Choose an active category and building.");
      }
    }
    if (table === "dormitory_beds" && !archive) {
      const parent = found(
        (
          await sql.query(
            "SELECT * FROM dormitories WHERE id=$1 AND deleted_at IS NULL FOR UPDATE",
            [next.dormitory_id],
          )
        ).rows[0],
      );
      if (
        parent.operational_status !== "ACTIVE" &&
        next.operational_status !== "INACTIVE"
      )
        throw new ConflictException("Choose an active dormitory.");
      if (parent.bed_capacity) {
        const count = await sql.query<{ count: number }>(
          "SELECT count(*)::int FROM dormitory_beds WHERE dormitory_id=$1 AND deleted_at IS NULL AND id IS DISTINCT FROM $2",
          [next.dormitory_id, id ?? null],
        );
        if (count.rows[0].count >= parent.bed_capacity)
          throw new ConflictException(
            "The dormitory bed limit has been reached.",
          );
      }
      if (before && before.dormitory_id !== next.dormitory_id)
        await this.empty(sql, { bed_id: id });
    }
    if (
      id &&
      (table === "rooms" || table === "dormitory_beds") &&
      (archive ||
        (table === "rooms" && next.category_id !== before?.category_id) ||
        (next.operational_status !== "ACTIVE" &&
          next.operational_status !== before?.operational_status))
    ) {
      await this.empty(
        sql,
        table === "rooms" ? { room_id: id } : { bed_id: id },
      );
    }
    if (id && table === "rooms" && next.capacity < before?.capacity) {
      await this.assertSpace(
        sql,
        { room_id: id },
        new Date(),
        null,
        0,
        undefined,
        next.capacity,
      );
    }
    if (id && table === "dormitories") {
      const beds = (
        await sql.query<{ id: string }>(
          "SELECT id FROM dormitory_beds WHERE dormitory_id=$1 AND deleted_at IS NULL",
          [id],
        )
      ).rows;
      if (archive && beds.length)
        throw new ConflictException(
          "Move or safely archive this dormitory’s beds before archiving it.",
        );
      if (next.bed_capacity && beds.length > next.bed_capacity)
        throw new ConflictException(
          "Bed capacity cannot be lower than the number of unarchived beds.",
        );
      if (
        next.category_id !== before?.category_id ||
        (next.operational_status !== "ACTIVE" &&
          next.operational_status !== before?.operational_status)
      ) {
        for (const bed of beds) await this.empty(sql, { bed_id: bed.id });
      }
    }
    if (id && (table === "accommodation_categories" || table === "buildings")) {
      const key = table === "buildings" ? "building_id" : "category_id";
      const units = await sql.query<{ id: string; kind: string }>(
        "SELECT id, 'room' AS kind FROM rooms WHERE " +
          key +
          "=$1 AND deleted_at IS NULL UNION ALL SELECT id, 'dorm' FROM dormitories WHERE " +
          key +
          "=$1 AND deleted_at IS NULL",
        [id],
      );
      if (
        units.rows.length &&
        (archive || next.accommodation_type !== before?.accommodation_type)
      ) {
        throw new ConflictException(
          table === "accommodation_categories" && archive
            ? categoryArchiveConflict
            : "Reassign or archive the associated inventory before changing this record.",
        );
      }
      if (next.is_active === false && before?.is_active) {
        for (const unit of units.rows) {
          if (unit.kind === "room") await this.empty(sql, { room_id: unit.id });
          else {
            const beds = await sql.query<{ id: string }>(
              "SELECT id FROM dormitory_beds WHERE dormitory_id=$1 AND deleted_at IS NULL",
              [unit.id],
            );
            for (const bed of beds.rows)
              await this.empty(sql, { bed_id: bed.id });
          }
        }
      }
    }
    const data = archive ? { deleted_at: new Date() } : input;
    const result = id
      ? await update(sql, table, id, data)
      : await insert(
          sql,
          table,
          table === "rooms" ? { ...data, created_by: user } : data,
        );
    await audit(
      sql,
      user,
      table,
      result.id,
      archive ? "ARCHIVE" : id ? "UPDATE" : "CREATE",
      before,
      result,
    );
    return result;
  }

  private async empty(sql: Sql, input: Target) {
    const target = targetOf(input);
    const result = await sql.query<{ in_use: boolean }>(
      "SELECT EXISTS(SELECT 1 FROM accommodation_allocations WHERE " +
        target.field +
        "=$1 AND status='ACTIVE') OR " +
        "EXISTS(SELECT 1 FROM reservations WHERE " +
        target.field +
        "=$1 AND status IN ('PENDING','CONFIRMED') AND reservation_end>now()) AS in_use",
      [target.id],
    );
    if (result.rows[0].in_use)
      throw new ConflictException(
        "Release active allocations and cancel reservations before changing this inventory.",
      );
  }

  async assertSpace(
    sql: Sql,
    input: Target,
    start: Date,
    end: Date | null,
    count: number,
    exclude?: string,
    capacityOverride?: number,
  ) {
    const target = targetOf(input);
    const statement = target.room_id
      ? "SELECT r.capacity, (r.operational_status='ACTIVE' AND c.is_active AND b.is_active AND c.deleted_at IS NULL AND b.deleted_at IS NULL) AS active " +
        "FROM rooms r JOIN accommodation_categories c ON c.id=r.category_id JOIN buildings b ON b.id=r.building_id WHERE r.id=$1 AND r.deleted_at IS NULL FOR UPDATE OF r"
      : "SELECT 1 AS capacity, (b.operational_status='ACTIVE' AND d.operational_status='ACTIVE' AND c.is_active AND g.is_active " +
        "AND d.deleted_at IS NULL AND c.deleted_at IS NULL AND g.deleted_at IS NULL) AS active FROM dormitory_beds b JOIN dormitories d ON d.id=b.dormitory_id " +
        "JOIN accommodation_categories c ON c.id=d.category_id JOIN buildings g ON g.id=d.building_id WHERE b.id=$1 AND b.deleted_at IS NULL FOR UPDATE OF b";
    const resource = found(
      (
        await sql.query<{ capacity: number; active: boolean }>(statement, [
          target.id,
        ])
      ).rows[0],
    );
    if (!resource.active)
      throw new ConflictException(
        "This accommodation is inactive or under maintenance.",
      );
    const result = await sql.query<{ max_reserved: number; occupied: number }>(
      "WITH overlapping AS (SELECT reservation_start, reservation_end,reserved_capacity FROM reservations WHERE " +
        target.field +
        "=$1 AND status='CONFIRMED' AND id IS DISTINCT FROM $4::uuid AND reservation_end>$2 AND reservation_start<$3), " +
        "points AS (SELECT $2::timestamptz AS instant UNION SELECT reservation_start FROM overlapping WHERE reservation_start>$2) " +
        "SELECT coalesce((SELECT max((SELECT coalesce(sum(reserved_capacity),0) FROM overlapping WHERE reservation_start<=instant AND reservation_end>instant)) FROM points),0)::int AS max_reserved," +
        "(SELECT count(*)::int FROM accommodation_allocations WHERE " +
        target.field +
        "=$1 AND status='ACTIVE') AS occupied",
      [target.id, start, end ?? "infinity", exclude ?? null],
    );
    const { max_reserved, occupied } = result.rows[0];
    if (
      max_reserved + occupied + count >
      (capacityOverride ?? resource.capacity)
    ) {
      throw new ConflictException(
        "The accommodation does not have enough free capacity for this period.",
      );
    }
    return target;
  }

  allocations(query: ListQuery) {
    return list(this.db, allocationCollection, query);
  }
  reservations(query: ListQuery) {
    return list(
      this.db,
      {
        ...reservationCollection,
        select:
          reservationCollection.select +
          ", CASE WHEN t.status IN ('PENDING','CONFIRMED') AND t.reservation_end<=now() THEN 'EXPIRED' ELSE t.status END AS effective_status",
        filters: {
          ...reservationCollection.filters,
          status:
            "(CASE WHEN t.status IN ('PENDING','CONFIRMED') AND t.reservation_end<=now() THEN 'EXPIRED' ELSE t.status END)",
        },
      },
      query,
    );
  }

  async details(
    table: "reservations" | "accommodation_allocations",
    id: string,
  ) {
    return found(
      (await this.db.query("SELECT * FROM " + table + " WHERE id=$1", [id]))
        .rows[0],
    );
  }

  history(query: ListQuery, resident?: string) {
    const { roomId, bedId, ...pagination } = query;
    const values: string[] = [];
    const conditions: string[] = [];
    if (resident) conditions.push("t.resident_id=$" + values.push(resident));
    if (roomId)
      conditions.push(
        "$" + values.push(roomId) + " IN (t.previous_room_id,t.new_room_id)",
      );
    if (bedId)
      conditions.push(
        "$" + values.push(bedId) + " IN (t.previous_bed_id,t.new_bed_id)",
      );
    return list(
      this.db,
      {
        from:
          "allocation_history t JOIN residents p ON p.id=t.resident_id" +
          " LEFT JOIN rooms pr ON pr.id=t.previous_room_id LEFT JOIN rooms nr ON nr.id=t.new_room_id" +
          " LEFT JOIN dormitory_beds pb ON pb.id=t.previous_bed_id LEFT JOIN dormitory_beds nb ON nb.id=t.new_bed_id",
        select:
          "t.*,p.resident_number,pr.room_number AS previous_room_number,nr.room_number AS new_room_number," +
          "pb.bed_number AS previous_bed_number,nb.bed_number AS new_bed_number",
        search: [
          "t.action",
          "p.resident_number",
          "pr.room_number",
          "nr.room_number",
          "pb.bed_number",
          "nb.bed_number",
        ],
        sorts: ["created_at", "action"],
        filters: { status: "t.action" },
        date: "t.created_at",
      },
      pagination,
      conditions,
      values,
    );
  }

  async log(
    sql: Sql,
    user: string,
    resident: string,
    action: string,
    old?: Booking,
    next?: Booking,
    remarks?: string,
  ) {
    await insert(sql, "allocation_history", {
      allocation_id: next?.id ?? old?.id,
      resident_id: resident,
      previous_room_id: old?.room_id,
      previous_bed_id: old?.bed_id,
      new_room_id: next?.room_id,
      new_bed_id: next?.bed_id,
      action,
      performed_by: user,
      remarks,
    });
  }

  async allocate(
    sql: PoolClient,
    user: string,
    resident: string,
    input: AccommodationTarget,
    previous?: Booking,
    reservation?: string,
  ) {
    const record = found(
      (
        await sql.query(
          "SELECT admission_status FROM residents WHERE id=$1 AND deleted_at IS NULL FOR UPDATE",
          [resident],
        )
      ).rows[0],
    );
    if (record.admission_status === "DISCHARGED")
      throw new ConflictException("The resident has been discharged.");
    const duplicate = (
      await sql.query<Booking>(
        "SELECT * FROM accommodation_allocations WHERE resident_id=$1 AND status='ACTIVE' FOR UPDATE",
        [resident],
      )
    ).rows[0];
    if (duplicate && duplicate.id !== previous?.id)
      throw new ConflictException(
        "The resident already has an active allocation.",
      );
    const now = new Date();
    const target = await this.assertSpace(
      sql,
      input,
      now,
      null,
      1,
      reservation,
    );
    if (previous)
      await update(sql, "accommodation_allocations", previous.id, {
        status: "TRANSFERRED",
        end_at: now,
        released_by: user,
      });
    const row = await insert(sql, "accommodation_allocations", {
      resident_id: resident,
      room_id: target.room_id,
      bed_id: target.bed_id,
      allocation_type: target.room_id ? "ROOM" : "DORMITORY",
      start_at: now,
      allocated_by: user,
      remarks: input.remarks,
    });
    const action = previous ? "TRANSFER" : "ALLOCATE";
    await this.log(
      sql,
      user,
      resident,
      action,
      previous,
      row as Booking,
      input.remarks,
    );
    await audit(sql, user, "allocations", row.id, action, previous, row);
    return row;
  }

  async transfer(user: string, id: string, input: AccommodationTarget) {
    return this.transaction(async (sql) => {
      const row = await this.activeBooking(sql, id);
      if (
        (row.room_id && row.room_id === input.room_id) ||
        (row.bed_id && row.bed_id === input.bed_id)
      ) {
        throw new ConflictException(
          "The resident is already assigned to this accommodation.",
        );
      }
      return this.allocate(sql, user, row.resident_id, input, row);
    });
  }

  async activeBooking(sql: Sql, id: string) {
    return found(
      (
        await sql.query<Booking>(
          "SELECT * FROM accommodation_allocations WHERE id=$1 AND status='ACTIVE' FOR UPDATE",
          [id],
        )
      ).rows[0],
    );
  }

  async release(sql: Sql, user: string, row: Booking, remarks?: string) {
    const next = await update(sql, "accommodation_allocations", row.id, {
      status: "RELEASED",
      end_at: new Date(),
      released_by: user,
    });
    await this.log(
      sql,
      user,
      row.resident_id,
      "RELEASE",
      row,
      undefined,
      remarks,
    );
    await audit(sql, user, "allocations", row.id, "RELEASE", row, next);
    return next;
  }

  async releaseResident(sql: Sql, user: string, id: string) {
    const row = (
      await sql.query<Booking>(
        "SELECT * FROM accommodation_allocations WHERE resident_id=$1 AND status='ACTIVE' FOR UPDATE",
        [id],
      )
    ).rows[0];
    if (row) await this.release(sql, user, row);
    const holds = await sql.query(
      "UPDATE reservations SET status='CANCELLED' WHERE resident_id=$1 AND status IN ('PENDING','CONFIRMED') RETURNING *",
      [id],
    );
    for (const hold of holds.rows)
      await audit(
        sql,
        user,
        "reservations",
        hold.id,
        "CANCEL",
        undefined,
        hold,
      );
  }

  async writeReservation(
    user: string,
    input: ReservationData | ReservationPatch,
    id?: string,
  ) {
    return this.transaction(async (sql) => {
      const before = id ? await this.reservationForUpdate(sql, id) : undefined;
      if (before && !["PENDING", "CONFIRMED"].includes(before.status))
        throw new ConflictException("Only active reservations can be edited.");
      const next = {
        ...before,
        ...Object.fromEntries(
          Object.entries(input).filter(([, value]) => value !== undefined),
        ),
      } as Reservation;
      const target = targetOf(next);
      const start = new Date(next.reservation_start),
        end = new Date(next.reservation_end);
      const count = next.reserved_capacity ?? 1;
      if (end <= start || end <= new Date())
        throw new BadRequestException(
          "Reservation end must follow its start and be in the future.",
        );
      if (!next.resident_id && !next.enquiry_id)
        throw new BadRequestException("Specify a resident or enquiry.");
      if (next.resident_id) {
        const resident = found(
          (
            await sql.query(
              "SELECT admission_status FROM residents WHERE id=$1 AND deleted_at IS NULL FOR UPDATE",
              [next.resident_id],
            )
          ).rows[0],
        );
        if (resident.admission_status === "DISCHARGED")
          throw new ConflictException("The resident has been discharged.");
      }
      if (next.enquiry_id)
        found(
          (
            await sql.query(
              "SELECT id FROM enquiries WHERE id=$1 AND deleted_at IS NULL",
              [next.enquiry_id],
            )
          ).rows[0],
        );
      if (before?.status === "CONFIRMED")
        await this.assertSpace(sql, target, start, end, count, id);
      else await this.assertSpace(sql, target, start, end, 0, id);
      const data = { ...input, room_id: target.room_id, bed_id: target.bed_id };
      const row = id
        ? await update(sql, "reservations", id, data)
        : await insert(sql, "reservations", { ...data, reserved_by: user });
      await audit(
        sql,
        user,
        "reservations",
        row.id,
        id ? "UPDATE" : "RESERVE",
        before,
        row,
      );
      return row;
    });
  }

  async reservationForUpdate(sql: Sql, id: string) {
    return found(
      (
        await sql.query<Reservation>(
          "SELECT * FROM reservations WHERE id=$1 FOR UPDATE",
          [id],
        )
      ).rows[0],
    );
  }

  async transition(
    user: string,
    id: string,
    action: "confirm" | "cancel" | "expire" | "convert",
    resident?: string,
  ) {
    return this.transaction(async (sql) => {
      const row = await this.reservationForUpdate(sql, id);
      if (!["PENDING", "CONFIRMED"].includes(row.status))
        throw new ConflictException("This reservation is already final.");
      const start = new Date(row.reservation_start),
        end = new Date(row.reservation_end),
        now = new Date();
      if (action === "expire" ? end > now : action !== "cancel" && end <= now)
        throw new ConflictException(
          "Reservation dates do not allow this action.",
        );
      let allocationId: string | undefined;
      if (action === "confirm") {
        if (row.status !== "PENDING")
          throw new ConflictException("The reservation is already confirmed.");
        await this.assertSpace(sql, row, start, end, row.reserved_capacity, id);
      }
      if (action === "convert") {
        if (row.status !== "CONFIRMED" || start > now)
          throw new ConflictException(
            "Only a current confirmed reservation can be converted.",
          );
        if (row.resident_id && resident && row.resident_id !== resident)
          throw new ConflictException(
            "The reservation belongs to another resident.",
          );
        const person = row.resident_id ?? resident;
        if (!person)
          throw new BadRequestException(
            "A resident is required for conversion.",
          );
        const allocation = await this.allocate(
          sql,
          user,
          person,
          {
            room_id: row.room_id ?? undefined,
            bed_id: row.bed_id ?? undefined,
            remarks: row.remarks,
          },
          undefined,
          id,
        );
        allocationId = allocation.id;
      }
      const status = {
        confirm: "CONFIRMED",
        cancel: "CANCELLED",
        expire: "EXPIRED",
        convert: "CONVERTED",
      }[action];
      const next = await update(sql, "reservations", id, {
        status,
        converted_allocation_id: allocationId,
      });
      await audit(
        sql,
        user,
        "reservations",
        id,
        action.toUpperCase(),
        row,
        next,
      );
      return next;
    });
  }
}

@Global()
@Module({ providers: [HousingService], exports: [HousingService] })
export class HousingDomainModule {}
