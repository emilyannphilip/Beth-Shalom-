import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Injectable,
  Module,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  HttpException,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiCreatedResponse } from "@nestjs/swagger";
import { CurrentActor, Public, Require, type Actor } from "../auth/access";
import { Database, type Sql } from "../database/database.module";
import { HousingService } from "../housing/housing.service";
import { audit, found, insert, list, ListQuery, update } from "../common/api";
import {
  EnquiryCategoryData,
  EnquiryCategoryPatch,
  EnquiryData,
  EnquiryPatch,
  Followup,
  PortalEnquiry,
  PublicEnquiry,
  VisitCreate,
  VisitData,
  VisitPatch,
  enquiryStates,
  visitStates,
  childrenSupportCategory,
  childrenSupportSource,
} from "../common/dtos";

@Injectable()
class EnquiriesService {
  constructor(readonly db: Database) {}
  async category(sql: Sql, id: string) {
    return found(
      (
        await sql.query(
          "SELECT public_topic FROM enquiry_categories WHERE id=$1 AND is_active FOR SHARE",
          [id],
        )
      ).rows[0],
    );
  }
  async active(sql: Sql, id: string, lock = false) {
    return found(
      (
        await sql.query(
          "SELECT * FROM enquiries WHERE id=$1 AND deleted_at IS NULL" +
            (lock ? " FOR UPDATE" : ""),
          [id],
        )
      ).rows[0],
    );
  }
  async create(
    input: EnquiryData,
    source: string,
    portal?: { actor: Actor; status?: string; assignedUserId?: string | null; remarks?: string },
  ) {
    const user = portal?.actor.id ?? null;
    return this.db.transaction(async (sql) => {
      const { details, visit, ...data } = input;
      const category = await this.category(sql, data.category_id);
      if (
        source === childrenSupportSource &&
        category.public_topic !== childrenSupportCategory
      )
        throw new BadRequestException(
          "Choose the Differently-Abled Support Living enquiry category.",
        );
      if (portal?.assignedUserId) await this.checkAssignee(sql, portal.assignedUserId);
      const row = await insert(sql, "enquiries", {
        ...data,
        assigned_user_id: portal?.assignedUserId,
        source_form: source,
        created_by: user,
      });
      if (details?.accommodation_category_id) {
        const accommodation = await sql.query(
          "SELECT id FROM accommodation_categories WHERE id=$1 AND is_active AND deleted_at IS NULL FOR SHARE",
          [details.accommodation_category_id],
        );
        if (!accommodation.rowCount)
          throw new BadRequestException(
            "The selected accommodation category is no longer available for enquiries.",
          );
      }
      if (details) await this.details(sql, row.id, details);
      if (visit) await this.visit(sql, row.id, visit, user);
      await audit(sql, user, "enquiries", row.id, "CREATE", undefined, row);
      if (portal && (portal.status || portal.remarks)) {
        await this.followup(sql, portal.actor, row, {
          status: portal.status,
          remarks: portal.remarks,
        });
        return this.active(sql, row.id);
      }
      return row;
    });
  }
  assignees() {
    return this.db.query(
      "SELECT u.id,u.full_name AS name FROM users u JOIN roles r ON r.id=u.role_id " +
        "WHERE r.name IN ('ADMIN','STAFF') AND u.status='ACTIVE' AND u.deleted_at IS NULL ORDER BY u.full_name,u.id",
    );
  }
  async checkAssignee(sql: Sql, id: string) {
    found(
      (
        await sql.query(
          "SELECT u.id FROM users u JOIN roles r ON r.id=u.role_id " +
            "WHERE u.id=$1 AND r.name IN ('ADMIN','STAFF') AND u.status='ACTIVE' AND u.deleted_at IS NULL FOR SHARE OF u",
          [id],
        )
      ).rows[0],
    );
  }
  async details(
    sql: Sql,
    id: string,
    data: NonNullable<EnquiryData["details"]>,
  ) {
    const values = {
      ...data,
      consent_at:
        data.contact_consent === true
          ? new Date()
          : data.contact_consent === false
            ? null
            : undefined,
    };
    const exists = (
      await sql.query(
        "SELECT enquiry_id FROM enquiry_details WHERE enquiry_id=$1",
        [id],
      )
    ).rows[0];
    if (exists && Object.values(values).some((value) => value !== undefined))
      await update(sql, "enquiry_details", id, values, "enquiry_id");
    if (!exists)
      await insert(sql, "enquiry_details", { ...values, enquiry_id: id });
  }
  async visit(sql: Sql, id: string, data: VisitData, user: string | null) {
    const row = await insert(sql, "visit_requests", {
      ...data,
      enquiry_id: id,
    });
    await audit(sql, user, "visit_requests", row.id, "CREATE", undefined, row);
    return row;
  }
  async followup(
    sql: Sql,
    actor: Actor,
    row: Record<string, unknown>,
    data: Followup,
  ) {
    if (!data.status && !data.remarks?.trim())
      throw new BadRequestException("Provide a status or follow-up remarks.");
    if (data.status && data.status !== row.status)
      await update(sql, "enquiries", String(row.id), {
        status: data.status,
        version: Number(row.version) + 1,
      });
    const entry = await insert(sql, "enquiry_followups", {
      enquiry_id: row.id,
      user_id: actor.id,
      previous_status: row.status,
      new_status: data.status ?? row.status,
      remarks: data.remarks,
      followup_date: data.followup_date,
    });
    await audit(sql, actor.id, "enquiries", String(row.id), "UPDATE", row, {
      status: data.status ?? row.status,
    });
    return entry;
  }
}

@ApiTags("Public")
@Public()
@Controller("public")
class PublicController {
  private readonly rate = new Map<string, { until: number; count: number }>();
  constructor(private readonly enquiries: EnquiriesService) {}
  @Get("enquiry-categories") async categories() {
    return (
      await this.enquiries.db.query(
        "SELECT id,name,public_topic FROM enquiry_categories WHERE is_active ORDER BY name",
      )
    ).rows;
  }
  @Get("availability") async availability() {
    return (
      await this.enquiries.db.query(
        `WITH dormitory_cards AS (
           SELECT d.category_id, jsonb_agg(jsonb_build_object(
             'name',d.dormitory_name,'floor_number',d.floor_number,
             'image_url',coalesce(d.image_url,c.image_url),'description',coalesce(d.description,c.description),
             'total_beds',beds.total_beds,'available_beds',beds.available_beds
           ) ORDER BY d.dormitory_name,d.id) AS entries
           FROM dormitories d
           JOIN accommodation_categories c ON c.id=d.category_id
           JOIN vw_dormitory_availability beds ON beds.dormitory_id=d.id
           WHERE c.is_active GROUP BY d.category_id
         )
         SELECT v.*, c.description, c.image_url, c.public_features,
           coalesce(d.entries,'[]'::jsonb) AS dormitories
         FROM vw_category_availability v JOIN accommodation_categories c ON c.id=v.category_id
         LEFT JOIN dormitory_cards d ON d.category_id=c.id
         WHERE c.is_active ORDER BY v.category_name`,
      )
    ).rows;
  }
  @Post("enquiries")
  @ApiCreatedResponse({
    schema: {
      example: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        enquiry_number: "ENQ-123",
        status: "NEW",
      },
    },
  })
  async submit(
    @Body() input: PublicEnquiry,
    @Req() req: { socket: { remoteAddress?: string } },
  ) {
    const now = Date.now();
    for (const [ip, window] of this.rate)
      if (window.until <= now) this.rate.delete(ip);
    const ip = req.socket.remoteAddress ?? "unknown";
    const bucket = this.rate.get(ip) ?? { until: now + 60_000, count: 0 };
    if (bucket.count >= 10 || (!this.rate.has(ip) && this.rate.size >= 10000))
      throw new HttpException("Please try again later.", 429);
    bucket.count++;
    this.rate.set(ip, bucket);
    const { source_form, child_support, ...data } = input;
    if (!data.original_topic?.trim())
      throw new BadRequestException("Provide the original enquiry topic.");
    if (
      ["ADMISSION_ENQUIRY", "CONTACT_ENQUIRY", childrenSupportSource].includes(
        source_form,
      ) &&
      data.details?.contact_consent !== true
    ) {
      throw new BadRequestException(
        "Contact consent is required for this form.",
      );
    }
    if (
      ["CAMPUS_WALKTHROUGH", "CONTACT_ENQUIRY"].includes(source_form) &&
      !data.visit?.preferred_date
    ) {
      throw new BadRequestException("Provide a preferred visit date.");
    }
    if (source_form === childrenSupportSource) {
      if (
        !child_support?.accommodation_requirements ||
        !data.email ||
        !data.message
      )
        throw new BadRequestException(
          "Provide an email address, accommodation requirements, and a message.",
        );
      data.message = [
        child_support.child_name
          ? "Child’s name: " + child_support.child_name
          : undefined,
        "Accommodation requirements: " +
          child_support.accommodation_requirements,
        "Additional message: " + data.message,
      ]
        .filter(Boolean)
        .join("\n");
      data.details = {
        age: child_support.child_age,
        care_requirement: child_support.care_requirements,
        contact_consent: true,
      };
      data.visit = undefined;
    } else if (child_support) {
      throw new BadRequestException(
        "Child support details belong to the Home page support enquiry.",
      );
    }
    const saved = await this.enquiries.create(data, source_form);
    return {
      id: saved.id,
      enquiry_number: saved.enquiry_number,
      status: saved.status,
    };
  }
}

@ApiTags("Enquiries")
@ApiBearerAuth()
@Require("enquiries.read")
@Controller("enquiries")
class EnquiriesController {
  constructor(
    private readonly enquiries: EnquiriesService,
    private readonly housing: HousingService,
  ) {}
  @Get() list(@Query() query: ListQuery) {
    return list(
      this.enquiries.db,
      {
        from: "enquiries t JOIN enquiry_categories c ON c.id=t.category_id LEFT JOIN enquiry_details d ON d.enquiry_id=t.id LEFT JOIN LATERAL (SELECT preferred_date FROM visit_requests WHERE enquiry_id=t.id ORDER BY created_at DESC LIMIT 1) v ON true",
        select:
          "t.*,c.name AS category_name,d.applicant_relationship,v.preferred_date",
        where: "t.deleted_at IS NULL",
        search: [
          "t.enquiry_number",
          "t.applicant_name",
          "t.phone",
          "t.email",
          "t.original_topic",
          "d.applicant_relationship",
        ],
        sorts: [
          "created_at",
          "applicant_name",
          "status",
          "enquiry_number",
          "preferred_date",
        ],
        filters: { status: "t.status", categoryId: "t.category_id" },
        statusValues: enquiryStates,
        date: "t.created_at",
      },
      query,
    );
  }
  @Get("assignees")
  @Require("enquiries.manage")
  async assignees() {
    return (await this.enquiries.assignees()).rows;
  }
  @Get(":id") async detail(@Param("id", ParseUUIDPipe) id: string) {
    const row = await this.enquiries.active(this.enquiries.db, id);
    const [details, followups, visits] = await Promise.all([
      this.enquiries.db.query(
        "SELECT * FROM enquiry_details WHERE enquiry_id=$1",
        [id],
      ),
      this.enquiries.db.query(
        "SELECT f.*,r.name AS actor_role FROM enquiry_followups f JOIN users u ON u.id=f.user_id JOIN roles r ON r.id=u.role_id WHERE f.enquiry_id=$1 ORDER BY f.created_at DESC",
        [id],
      ),
      this.enquiries.db.query(
        "SELECT * FROM visit_requests WHERE enquiry_id=$1 ORDER BY created_at DESC",
        [id],
      ),
    ]);
    return {
      ...row,
      details: details.rows[0] ?? null,
      followups: followups.rows,
      visits: visits.rows,
    };
  }
  @Post()
  @Require("enquiries.manage")
  create(@Body() body: PortalEnquiry, @CurrentActor() actor: Actor) {
    const { status, assigned_user_id, followup_remarks, ...input } = body;
    return this.enquiries.create(input, "PORTAL", {
      actor, status, assignedUserId: assigned_user_id, remarks: followup_remarks,
    });
  }
  @Post(":id/followups")
  @Require("enquiries.followup")
  followup(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: Followup,
    @CurrentActor() actor: Actor,
  ) {
    return this.enquiries.db.transaction(async (sql) =>
      this.enquiries.followup(
        sql,
        actor,
        await this.enquiries.active(sql, id, true),
        body,
      ),
    );
  }
  @Patch(":id")
  @Require("enquiries.followup")
  edit(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: EnquiryPatch,
    @CurrentActor() actor: Actor,
  ) {
    return this.enquiries.db.transaction(async (sql) => {
      const before = await this.enquiries.active(sql, id, true);
      const { details, visit, visit_id, version, followup_remarks, status, ...data } =
        body;
      if (version !== undefined && version !== before.version)
        throw new ConflictException(
          "The enquiry has changed. Reload it and retry.",
        );
      if (
        !actor.permissions.includes("enquiries.manage") &&
        (details || visit || visit_id || Object.keys(data).length > 0)
      )
        throw new ForbiddenException();
      if (data.category_id)
        await this.enquiries.category(sql, data.category_id);
      if (data.assigned_user_id)
        await this.enquiries.checkAssignee(sql, data.assigned_user_id);
      if (details) await this.enquiries.details(sql, id, details);
      if (visit_id) {
        if (!visit) throw new BadRequestException("Provide visit changes.");
        const priorVisit = found(
          (await sql.query("SELECT * FROM visit_requests WHERE id=$1 AND enquiry_id=$2 FOR UPDATE", [visit_id, id])).rows[0],
        );
        const revised = await update(sql, "visit_requests", visit_id, visit);
        await audit(sql, actor.id, "visit_requests", visit_id, "UPDATE", priorVisit, revised);
      } else if (visit) {
        await this.enquiries.visit(sql, id, visit, actor.id);
      }
      if (status || followup_remarks)
        await this.enquiries.followup(sql, actor, before, {
          status,
          remarks: followup_remarks,
        });
      if (
        !details &&
        !visit &&
        !status &&
        !followup_remarks &&
        !Object.keys(data).length
      )
        throw new BadRequestException("Provide at least one change.");
      const row = await update(sql, "enquiries", id, {
        ...data,
        status,
        version: Number(before.version) + 1,
      });
      await audit(sql, actor.id, "enquiries", id, "UPDATE", before, row);
      return row;
    });
  }
  @Delete(":id")
  @Require("enquiries.manage")
  archive(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentActor() actor: Actor,
  ) {
    return this.housing.transaction(async (sql) => {
      const before = await this.enquiries.active(sql, id, true);
      const uses = (
        await sql.query(
          "SELECT id FROM reservations WHERE enquiry_id=$1 AND status IN ('PENDING','CONFIRMED') AND reservation_end>now() LIMIT 1",
          [id],
        )
      ).rows[0];
      if (uses)
        throw new ConflictException("Cancel the active reservation first.");
      const row = await update(sql, "enquiries", id, {
        deleted_at: new Date(),
        version: before.version + 1,
      });
      await audit(sql, actor.id, "enquiries", id, "ARCHIVE", before, row);
      return row;
    });
  }
}

@ApiTags("Enquiry categories")
@ApiBearerAuth()
@Require("enquiries.read")
@Controller("enquiry-categories")
class EnquiryCategoriesController {
  constructor(private readonly db: Database) {}
  @Get() entries(@Query() query: ListQuery) {
    return list(
      this.db,
      {
        from: "enquiry_categories t",
        search: ["t.name"],
        sorts: ["created_at", "name"],
      },
      query,
    );
  }
  @Get(":id") async detail(@Param("id", ParseUUIDPipe) id: string) {
    return found(
      (
        await this.db.query("SELECT * FROM enquiry_categories WHERE id=$1", [
          id,
        ])
      ).rows[0],
    );
  }
  @Post()
  @Require("enquiries.manage")
  create(@Body() body: EnquiryCategoryData, @CurrentActor() actor: Actor) {
    return this.write(actor, body);
  }
  @Patch(":id")
  @Require("enquiries.manage")
  edit(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: EnquiryCategoryPatch,
    @CurrentActor() actor: Actor,
  ) {
    return this.write(actor, body, id);
  }
  @Delete(":id")
  @Require("enquiries.manage")
  archive(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentActor() actor: Actor,
  ) {
    return this.write(actor, { is_active: false }, id);
  }
  private write(actor: Actor, data: EnquiryCategoryPatch, id?: string) {
    return this.db.transaction(async (sql) => {
      const before = id
        ? found(
            (
              await sql.query(
                "SELECT * FROM enquiry_categories WHERE id=$1 FOR UPDATE",
                [id],
              )
            ).rows[0],
          )
        : undefined;
      const row = id
        ? await update(sql, "enquiry_categories", id, data)
        : await insert(sql, "enquiry_categories", data);
      await audit(
        sql,
        actor.id,
        "enquiry_categories",
        row.id,
        id ? (data.is_active === false ? "ARCHIVE" : "UPDATE") : "CREATE",
        before,
        row,
      );
      return row;
    });
  }
}

@ApiTags("Visit requests")
@ApiBearerAuth()
@Require("enquiries.manage")
@Controller("visit-requests")
class VisitsController {
  constructor(private readonly enquiries: EnquiriesService) {}
  @Get() entries(@Query() query: ListQuery) {
    return list(
      this.enquiries.db,
      {
        from: "visit_requests t JOIN enquiries e ON e.id=t.enquiry_id",
        select: "t.*,e.enquiry_number",
        where: "e.deleted_at IS NULL",
        search: ["t.purpose", "e.enquiry_number"],
        sorts: ["created_at", "preferred_date"],
        filters: { status: "t.status" },
        statusValues: visitStates,
        date: "t.preferred_date",
      },
      query,
    );
  }
  @Get(":id") async detail(@Param("id", ParseUUIDPipe) id: string) {
    return found(
      (
        await this.enquiries.db.query(
          "SELECT v.* FROM visit_requests v JOIN enquiries e ON e.id=v.enquiry_id WHERE v.id=$1 AND e.deleted_at IS NULL",
          [id],
        )
      ).rows[0],
    );
  }
  @Post() create(@Body() body: VisitCreate, @CurrentActor() actor: Actor) {
    const { enquiry_id, ...data } = body;
    return this.enquiries.db.transaction(async (sql) => {
      await this.enquiries.active(sql, enquiry_id, true);
      return this.enquiries.visit(sql, enquiry_id, data, actor.id);
    });
  }
  @Patch(":id") edit(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: VisitPatch,
    @CurrentActor() actor: Actor,
  ) {
    return this.write(id, body, actor);
  }
  @Delete(":id") cancel(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentActor() actor: Actor,
  ) {
    return this.write(id, { status: "CANCELLED" }, actor);
  }
  private write(id: string, body: VisitPatch, actor: Actor) {
    return this.enquiries.db.transaction(async (sql) => {
      const before = found(
        (
          await sql.query(
            "SELECT v.* FROM visit_requests v JOIN enquiries e ON e.id=v.enquiry_id WHERE v.id=$1 AND e.deleted_at IS NULL FOR UPDATE OF v",
            [id],
          )
        ).rows[0],
      );
      const allowed: Record<string, string[]> = {
        REQUESTED: ["CONFIRMED", "CANCELLED"],
        CONFIRMED: ["COMPLETED", "CANCELLED"],
      };
      if (
        body.status &&
        body.status !== before.status &&
        !allowed[before.status]?.includes(body.status)
      )
        throw new ConflictException("Invalid visit status transition.");
      const row = await update(sql, "visit_requests", id, {
        ...body,
        confirmed_at: body.status === "CONFIRMED" ? new Date() : undefined,
        confirmed_by: body.status === "CONFIRMED" ? actor.id : undefined,
      });
      await audit(
        sql,
        actor.id,
        "visit_requests",
        id,
        body.status === "CANCELLED" ? "CANCEL" : "UPDATE",
        before,
        row,
      );
      return row;
    });
  }
}

@Module({
  controllers: [
    PublicController,
    EnquiriesController,
    EnquiryCategoriesController,
    VisitsController,
  ],
  providers: [EnquiriesService],
})
export class EnquiriesModule {}
