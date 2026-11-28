import {
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
  Put,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentActor, Require, type Actor } from "../auth/access";
import { audit, found, insert, list, ListQuery, update } from "../common/api";
import {
  CareData,
  ContactData,
  ContactPatch,
  Discharge,
  ResidentCreate,
  ResidentPatch,
  residentStates,
} from "../common/dtos";
import type { Sql } from "../database/database.module";
import { HousingService } from "../housing/housing.service";

const projection =
  "extract(year from age(t.date_of_birth))::integer AS age,to_jsonb(a) AS accommodation";
@ApiTags("Residents")
@ApiBearerAuth()
@Require("residents.read")
@Controller("residents")
class ResidentsController {
  constructor(private readonly housing: HousingService) {}
  @Get() list(@Query() query: ListQuery) {
    return list(
      this.housing.db,
      {
        from:
          "residents t JOIN vw_resident_accommodation a ON a.resident_id=t.id " +
          "LEFT JOIN resident_care_details care ON care.resident_id=t.id " +
          "LEFT JOIN LATERAL (SELECT contact_name,phone FROM resident_contacts WHERE resident_id=t.id AND contact_type='EMERGENCY' ORDER BY is_primary DESC,created_at LIMIT 1) emergency ON true",
        select:
          "t.*," + projection +
          ",to_jsonb(emergency) AS emergency_contact_summary,care.care_requirements AS care_preview",
        where: "t.deleted_at IS NULL",
        search: [
          "t.resident_number",
          "t.full_name",
          "a.room_number",
          "a.bed_number",
          "a.dormitory_name",
          "a.category_name",
          "emergency.contact_name",
        ],
        sorts: [
          "admission_date",
          "full_name",
          "resident_number",
          "admission_status",
        ],
        filters: {
          status: "t.admission_status",
          roomId: "a.room_id",
          bedId: "a.bed_id",
          admissionCategory: "t.admission_category",
          dormitoryId: "a.dormitory_id",
          categoryId: "a.category_id",
          accommodationType: "a.allocation_type",
        },
        statusValues: residentStates,
        date: "t.admission_date",
      },
      query,
    );
  }
  @Get(":id") async detail(@Param("id", ParseUUIDPipe) id: string) {
    const db = this.housing.db;
    const row = found(
      (
        await db.query(
          "SELECT t.*," + projection +
            " FROM residents t JOIN vw_resident_accommodation a ON a.resident_id=t.id WHERE t.id=$1 AND t.deleted_at IS NULL",
          [id],
        )
      ).rows[0],
    );
    const [contacts, care] = await Promise.all([
      db.query(
        "SELECT * FROM resident_contacts WHERE resident_id=$1 ORDER BY is_primary DESC,created_at",
        [id],
      ),
      db.query("SELECT * FROM resident_care_details WHERE resident_id=$1", [id]),
    ]);
    return { ...row, contacts: contacts.rows, care: care.rows[0] ?? null };
  }
  @Get(":id/history")
  @Require("residents.manage")
  async history(
    @Param("id", ParseUUIDPipe) id: string,
    @Query() query: ListQuery,
  ) {
    await this.lock(this.housing.db, id, false);
    return this.housing.history(query, id);
  }
  @Post()
  @Require("residents.manage")
  create(@Body() body: ResidentCreate, @CurrentActor() actor: Actor) {
    return this.housing.transaction(async (sql) => {
      const {
        accommodation,
        emergency_contact,
        guardian_contact,
        care,
        ...input
      } = body;
      const row = await insert(sql, "residents", {
        ...input,
        created_by: actor.id,
      });
      await this.housing.log(sql, actor.id, row.id, "ADMIT");
      await this.profileAttachments(
        sql,
        actor.id,
        row.id,
        emergency_contact,
        guardian_contact,
        care,
      );
      const allocation = accommodation
        ? await this.housing.allocate(sql, actor.id, row.id, accommodation)
        : null;
      await audit(sql, actor.id, "residents", row.id, "CREATE", undefined, row);
      return { ...row, allocation };
    });
  }
  @Patch(":id")
  @Require("residents.manage")
  edit(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: ResidentPatch,
    @CurrentActor() actor: Actor,
  ) {
    return this.housing.transaction(async (sql) => {
      const current = await this.lock(sql, id);
      if (current.admission_status === "DISCHARGED" && body.admission_status)
        throw new ConflictException("This resident is already discharged.");
      const {
        accommodation,
        emergency_contact,
        guardian_contact,
        care,
        ...input
      } = body;
      const row = Object.keys(input).length
        ? await update(sql, "residents", id, input)
        : current;
      await this.profileAttachments(
        sql,
        actor.id,
        id,
        emergency_contact,
        guardian_contact,
        care,
      );
      if (accommodation) {
        const assigned = (
          await sql.query<{
            id: string;
            room_id: string | null;
            bed_id: string | null;
            resident_id: string;
          }>(
            "SELECT id,room_id,bed_id,resident_id FROM accommodation_allocations WHERE resident_id=$1 AND status='ACTIVE' FOR UPDATE",
            [id],
          )
        ).rows[0];
        if (
          !assigned ||
          assigned.room_id !== (accommodation.room_id ?? null) ||
          assigned.bed_id !== (accommodation.bed_id ?? null)
        ) {
          await this.housing.allocate(
            sql,
            actor.id,
            id,
            accommodation,
            assigned,
          );
        }
      }
      if (
        body.admission_status &&
        body.admission_status !== current.admission_status
      )
        await this.housing.log(sql, actor.id, id, "UPDATE");
      await audit(sql, actor.id, "residents", id, "UPDATE", current, row);
      return row;
    });
  }
  @Post(":id/discharge")
  @Require("residents.manage")
  discharge(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: Discharge,
    @CurrentActor() actor: Actor,
  ) {
    return this.finish(actor, id, body);
  }
  @Delete(":id")
  @Require("residents.manage")
  archive(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentActor() actor: Actor,
  ) {
    return this.finish(actor, id, {}, true);
  }
  @Post(":id/contacts")
  @Require("residents.manage")
  addContact(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: ContactData,
    @CurrentActor() actor: Actor,
  ) {
    return this.contact(actor, id, body);
  }
  @Patch(":id/contacts/:contactId")
  @Require("residents.manage")
  editContact(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("contactId", ParseUUIDPipe) contactId: string,
    @Body() body: ContactPatch,
    @CurrentActor() actor: Actor,
  ) {
    return this.contact(actor, id, body, contactId);
  }
  @Delete(":id/contacts/:contactId")
  @Require("residents.manage")
  removeContact(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("contactId", ParseUUIDPipe) contactId: string,
    @CurrentActor() actor: Actor,
  ) {
    return this.housing.db.transaction(async (sql) => {
      await this.lock(sql, id);
      found(
        (
          await sql.query(
            "DELETE FROM resident_contacts WHERE id=$1 AND resident_id=$2 RETURNING id",
            [contactId, id],
          )
        ).rows[0],
      );
      await audit(sql, actor.id, "resident_contacts", contactId, "DELETE");
      return { id: contactId };
    });
  }
  @Put(":id/care")
  @Require("residents.manage")
  care(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: CareData,
    @CurrentActor() actor: Actor,
  ) {
    return this.housing.db.transaction(async (sql) => {
      await this.lock(sql, id);
      const old = (
        await sql.query(
          "SELECT id FROM resident_care_details WHERE resident_id=$1",
          [id],
        )
      ).rows[0];
      const data = { ...body, resident_id: id, updated_by: actor.id };
      const row = old
        ? await update(sql, "resident_care_details", old.id, data)
        : await insert(sql, "resident_care_details", data);
      await audit(
        sql,
        actor.id,
        "resident_care_details",
        row.id,
        old ? "UPDATE" : "CREATE",
      );
      return row;
    });
  }
  private async profileAttachments(
    sql: Sql,
    user: string,
    id: string,
    emergency?: ContactData | null,
    guardian?: ContactData | null,
    care?: CareData | null,
  ) {
    for (const [type, details] of [
      ["EMERGENCY", emergency],
      ["GUARDIAN", guardian],
    ] as const) {
      if (details === undefined) continue;
      const previous = (
        await sql.query<{ id: string }>(
          "SELECT id FROM resident_contacts WHERE resident_id=$1 AND contact_type=$2 ORDER BY is_primary DESC,created_at LIMIT 1",
          [id, type],
        )
      ).rows[0];
      if (!details) {
        if (previous) {
          await sql.query("DELETE FROM resident_contacts WHERE id=$1", [
            previous.id,
          ]);
          await audit(sql, user, "resident_contacts", previous.id, "DELETE");
        }
      } else {
        const data = { ...details, contact_type: type, is_primary: true };
        const row = previous
          ? await update(sql, "resident_contacts", previous.id, data)
          : await insert(sql, "resident_contacts", {
              ...data,
              resident_id: id,
            });
        await audit(
          sql,
          user,
          "resident_contacts",
          row.id,
          previous ? "UPDATE" : "CREATE",
        );
      }
    }
    if (care) {
      const previous = (
        await sql.query<{ id: string }>(
          "SELECT id FROM resident_care_details WHERE resident_id=$1",
          [id],
        )
      ).rows[0];
      const data = { ...care, updated_by: user };
      const row = previous
        ? await update(sql, "resident_care_details", previous.id, data)
        : await insert(sql, "resident_care_details", {
            ...data,
            resident_id: id,
          });
      await audit(
        sql,
        user,
        "resident_care_details",
        row.id,
        previous ? "UPDATE" : "CREATE",
      );
    }
  }

  private async lock(sql: Sql, id: string, lock = true) {
    return found(
      (
        await sql.query(
          "SELECT * FROM residents WHERE id=$1 AND deleted_at IS NULL" +
            (lock ? " FOR UPDATE" : ""),
          [id],
        )
      ).rows[0],
    );
  }
  private finish(actor: Actor, id: string, body: Discharge, archive = false) {
    return this.housing.transaction(async (sql) => {
      const current = await this.lock(sql, id);
      if (!archive && current.admission_status === "DISCHARGED")
        throw new ConflictException("The resident is already discharged.");
      await this.housing.releaseResident(sql, actor.id, id);
      const row = await update(
        sql,
        "residents",
        id,
        archive
          ? { deleted_at: new Date() }
          : {
              admission_status: "DISCHARGED",
              discharge_date:
                body.discharge_date ?? new Date().toISOString().slice(0, 10),
            },
      );
      await this.housing.log(
        sql,
        actor.id,
        id,
        archive ? "ARCHIVE" : "DISCHARGE",
        undefined,
        undefined,
        body.remarks,
      );
      await audit(
        sql,
        actor.id,
        "residents",
        id,
        archive ? "ARCHIVE" : "DISCHARGE",
        current,
        row,
      );
      return row;
    });
  }
  private contact(
    actor: Actor,
    id: string,
    body: ContactPatch,
    contactId?: string,
  ) {
    return this.housing.db.transaction(async (sql) => {
      await this.lock(sql, id);
      if (contactId)
        found(
          (
            await sql.query(
              "SELECT id FROM resident_contacts WHERE id=$1 AND resident_id=$2 FOR UPDATE",
              [contactId, id],
            )
          ).rows[0],
        );
      const row = contactId
        ? await update(sql, "resident_contacts", contactId, body)
        : await insert(sql, "resident_contacts", { ...body, resident_id: id });
      await audit(
        sql,
        actor.id,
        "resident_contacts",
        row.id,
        contactId ? "UPDATE" : "CREATE",
      );
      return row;
    });
  }
}
@Module({ controllers: [ResidentsController] })
export class ResidentsModule {}
