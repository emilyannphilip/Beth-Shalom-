import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Module,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentActor, Require, type Actor } from "../auth/access";
import { hashPassword } from "../auth/passwords";
import { Database } from "../database/database.module";
import { audit, found, insert, list, ListQuery, update } from "../common/api";
import { StaffData, StaffPatch } from "../common/dtos";

const designation =
  "(CASE t.designation WHEN 'ADMIN' THEN 'Executive Admin Director (Admin)' WHEN 'STAFF' THEN 'Care Coordinator (Staff)' ELSE t.designation END)";
const columns =
  "t.id,t.staff_number,t.full_name,t.username,t.email,t.phone," +
  designation +
  " AS designation,t.role_id,t.status,t.last_login_at,t.created_at,t.updated_at,t.deleted_at";
@ApiTags("Staff")
@ApiBearerAuth()
@Require("staff.manage")
@Controller("staff")
export class UsersController {
  constructor(private readonly db: Database) {}
  @Get() list(@Query() query: ListQuery) {
    return list(
      this.db,
      {
        from: "users t",
        select: columns,
        where: "t.deleted_at IS NULL",
        search: ["t.staff_number", "t.full_name", "t.username", "t.email"],
        sorts: ["created_at", "full_name", "username", "staff_number"],
        filters: { status: "t.status", designation },
        statusValues: ["ACTIVE", "INACTIVE"],
        date: "t.created_at",
      },
      query,
    );
  }
  @Get(":id") async get(@Param("id", ParseUUIDPipe) id: string) {
    return found(
      (
        await this.db.query(
          "SELECT " +
            columns +
            " FROM users t WHERE id=$1 AND deleted_at IS NULL",
          [id],
        )
      ).rows[0],
    );
  }
  @Post() create(@CurrentActor() actor: Actor, @Body() input: StaffData) {
    return this.write(actor, input);
  }
  @Patch(":id") edit(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() input: StaffPatch,
  ) {
    return this.write(actor, input, id);
  }
  @Post(":id/activate") activate(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.write(actor, { status: "ACTIVE" }, id);
  }
  @Post(":id/deactivate") deactivate(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.write(actor, { status: "INACTIVE" }, id);
  }
  @Delete(":id") archive(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.write(actor, {}, id, true);
  }
  private async write(
    actor: Actor,
    input: StaffPatch,
    id?: string,
    archive = false,
  ) {
    const { password, ...data } = input;
    if (password === null)
      throw new BadRequestException("A password cannot be cleared.");
    const password_hash = password ? await hashPassword(password) : undefined;
    return this.db.transaction(async (sql) => {
      await sql.query("SELECT pg_advisory_xact_lock(727091, 6)");
      const role = found(
        (
          await sql.query<{ id: string }>(
            "SELECT id FROM roles WHERE name='ADMIN'",
          )
        ).rows[0],
      );
      const before = id
        ? found(
            (
              await sql.query(
                "SELECT " +
                  columns +
                  " FROM users t WHERE id=$1 AND deleted_at IS NULL FOR UPDATE",
                [id],
              )
            ).rows[0],
          )
        : undefined;
      if (
        before?.role_id === role.id &&
        before.status === "ACTIVE" &&
        (archive ||
          data.status === "INACTIVE" ||
          (data.role_id && data.role_id !== role.id))
      ) {
        const remaining = (
          await sql.query(
            "SELECT id FROM users WHERE role_id=$1 AND status='ACTIVE' AND deleted_at IS NULL AND id<>$2 LIMIT 1",
            [role.id, id],
          )
        ).rows[0];
        if (!remaining)
          throw new ConflictException(
            "The last active Admin account cannot be archived, deactivated, or assigned another role.",
          );
      }
      const value = archive
        ? { status: "INACTIVE", deleted_at: new Date() }
        : { ...data, password_hash };
      const row = id
        ? await update(sql, "users", id, value)
        : await insert(sql, "users", value);
      if (
        archive ||
        data.status === "INACTIVE" ||
        password ||
        (before && data.role_id && data.role_id !== before.role_id)
      )
        await sql.query(
          "UPDATE auth_sessions SET revoked_at=now() WHERE user_id=$1 AND revoked_at IS NULL",
          [row.id],
        );
      if (password || archive || data.status === "INACTIVE") {
        await sql.query(
          "UPDATE password_reset_tokens SET used_at=now() WHERE user_id=$1 AND used_at IS NULL",
          [row.id],
        );
      }
      await audit(
        sql,
        actor.id,
        "staff",
        row.id,
        archive ? "ARCHIVE" : id ? "UPDATE" : "CREATE",
        before,
        row,
      );
      const { password_hash: storedHash, ...response } = row;
      void storedHash;
      return response;
    });
  }
}

@ApiTags("Roles and permissions")
@ApiBearerAuth()
@Require("staff.manage")
@Controller()
export class RolesController {
  constructor(private readonly db: Database) {}
  @Get("roles") async roles() {
    return (await this.db.query("SELECT * FROM roles ORDER BY name")).rows;
  }
  @Get("roles/:id/permissions") async mappings(
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    found(
      (await this.db.query("SELECT id FROM roles WHERE id=$1", [id])).rows[0],
    );
    return (
      await this.db.query(
        "SELECT p.* FROM permissions p JOIN role_permissions rp ON rp.permission_id=p.id WHERE rp.role_id=$1 ORDER BY p.code",
        [id],
      )
    ).rows;
  }
  @Get("permissions") async permissions() {
    return (
      await this.db.query("SELECT * FROM permissions ORDER BY module,code")
    ).rows;
  }
  @Get("auth/context") @Require("signed-in") context(
    @CurrentActor() actor: Actor,
  ) {
    return actor;
  }
}

@ApiTags("Dashboard", "Audit")
@ApiBearerAuth()
@Controller()
export class ReportingController {
  constructor(private readonly db: Database) {}
  @Get("dashboard/summary")
  @Require("dashboard.read")
  async dashboard(@CurrentActor() actor: Actor) {
    const admin = actor.role === "ADMIN";
    const { total_staff, active_staff, ...summary } =
      found(
        (
          await this.db.query(
            `WITH accommodation AS (
          SELECT coalesce(sum(total_rooms),0)::int AS total_rooms,
            coalesce(sum(available_rooms),0)::int AS available_rooms,
            coalesce(sum(occupied_rooms),0)::int AS occupied_rooms,
            coalesce(sum(free_room_spaces),0)::int AS free_room_spaces,
            coalesce(sum(total_dormitories),0)::int AS total_dormitories,
            coalesce(sum(total_beds),0)::int AS total_beds,
            coalesce(sum(available_beds),0)::int AS available_beds,
            coalesce(sum(occupied_beds),0)::int AS occupied_beds,
            coalesce(sum(reserved_rooms),0)::int AS reserved_rooms,
            coalesce(sum(reserved_beds),0)::int AS reserved_beds,
            coalesce(sum(maintenance_rooms),0)::int AS maintenance_rooms,
            coalesce(sum(maintenance_beds),0)::int AS maintenance_beds,
            coalesce(sum(inactive_rooms),0)::int AS inactive_rooms
          FROM vw_category_availability
        ), enquiry_counts AS (
          SELECT count(*)::int AS total_enquiries,
            count(*) FILTER (WHERE status='NEW')::int AS new_enquiries,
            count(*) FILTER (WHERE status='PENDING')::int AS pending_enquiries,
            count(*) FILTER (WHERE status IN ('SUBMITTED','CLOSED'))::int AS completed_enquiries
          FROM enquiries WHERE deleted_at IS NULL
        ), resident_counts AS (
          SELECT count(*) FILTER (WHERE admission_status<>'DISCHARGED')::int AS admitted_residents,
            count(*) FILTER (WHERE admission_status='DISCHARGED')::int AS discharged_residents
          FROM residents WHERE deleted_at IS NULL
        ), staff AS (
          SELECT count(*)::int AS total_staff,
            count(*) FILTER (WHERE status='ACTIVE')::int AS active_staff
          FROM users WHERE $1 AND deleted_at IS NULL
        )
        SELECT accommodation.*, enquiry_counts.*, resident_counts.*, staff.*,
          reserved_rooms+reserved_beds AS reserved_accommodation,
          maintenance_rooms+maintenance_beds AS accommodation_under_maintenance,
          (
            SELECT count(*)::int FROM residents p JOIN resident_care_details c ON c.resident_id=p.id
            WHERE p.deleted_at IS NULL AND p.admission_status<>'DISCHARGED'
              AND nullif(btrim(c.care_requirements),'') IS NOT NULL
          ) AS residents_with_care
        FROM accommodation CROSS JOIN enquiry_counts CROSS JOIN resident_counts CROSS JOIN staff`,
            [admin],
          )
        ).rows[0],
      );
    return admin
      ? { ...summary, total_staff, active_staff }
      : summary;
  }
  @Get("audit-logs")
  @Require("audit.read")
  logs(@Query() query: ListQuery) {
    return list(
      this.db,
      {
        from: "audit_logs t",
        search: ["t.module_name", "t.action", "t.record_id"],
        sorts: ["created_at", "module_name", "action"],
        date: "t.created_at",
        filters: { status: "t.action" },
      },
      query,
    );
  }
}

@Module({
  controllers: [UsersController, RolesController, ReportingController],
})
export class AdministrationModule {}
