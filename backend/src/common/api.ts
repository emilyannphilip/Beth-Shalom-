import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  HttpStatus,
  type ExceptionFilter,
  NotFoundException,
} from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from "class-validator";
import type { Sql } from "../database/database.module";

export class ListQuery {
  @ApiProperty({ required: false, default: 1, minimum: 1, maximum: 100000 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100000)
  @IsOptional()
  page = 1;

  @ApiProperty({ required: false, default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit = 20;

  @ApiProperty({ required: false })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @Length(1, 150)
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false })
  @IsString()
  @Length(1, 50)
  @IsOptional()
  sortBy?: string;

  @ApiProperty({ required: false, enum: ["asc", "desc"] })
  @IsIn(["asc", "desc"])
  @IsOptional()
  sortOrder?: "asc" | "desc";

  @ApiProperty({ required: false })
  @IsString()
  @Length(1, 40)
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsString()
  @Length(1, 100)
  @IsOptional()
  designation?: string;
  @ApiProperty({ required: false })
  @IsString()
  @Length(1, 100)
  @IsOptional()
  admissionCategory?: string;
  @ApiProperty({ required: false, format: "uuid" })
  @IsUUID()
  @IsOptional()
  bedId?: string;
  @ApiProperty({ required: false })
  @IsString()
  @Length(1, 40)
  @IsOptional()
  availabilityStatus?: string;

  @ApiProperty({ required: false, enum: ["ROOM", "DORMITORY"] })
  @IsIn(["ROOM", "DORMITORY"])
  @IsOptional()
  accommodationType?: string;

  @ApiProperty({ required: false, format: "uuid" })
  @IsUUID()
  @IsOptional()
  categoryId?: string;
  @ApiProperty({ required: false, format: "uuid" })
  @IsUUID()
  @IsOptional()
  buildingId?: string;
  @ApiProperty({ required: false, format: "uuid" })
  @IsUUID()
  @IsOptional()
  roomId?: string;
  @ApiProperty({ required: false, minimum: -20, maximum: 300 })
  @Type(() => Number)
  @IsInt()
  @Min(-20)
  @Max(300)
  @IsOptional()
  floor?: number;
  @ApiProperty({ required: false, format: "uuid" })
  @IsUUID()
  @IsOptional()
  dormitoryId?: string;
  @ApiProperty({ required: false, format: "date" })
  @IsString()
  @IsOptional()
  dateFrom?: string;
  @ApiProperty({ required: false, format: "date" })
  @IsString()
  @IsOptional()
  dateTo?: string;
}

export function calendarDate(value: string) {
  const date = new Date(value);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new BadRequestException(
      "Expected a valid date in YYYY-MM-DD format.",
    );
  }
  return value;
}

type Filter =
  | "status"
  | "categoryId"
  | "accommodationType"
  | "buildingId"
  | "roomId"
  | "dormitoryId"
  | "designation"
  | "admissionCategory"
  | "bedId"
  | "availabilityStatus"
  | "floor";
export interface Collection {
  // SQL fragments in collection definitions are internal constants.
  from: string;
  select?: string;
  where?: string;
  search?: string[];
  sorts: string[];
  filters?: Partial<Record<Filter, string>>;
  statusValues?: readonly string[];
  date?: string;
}

export async function list(
  sql: Sql,
  collection: Collection,
  query: ListQuery,
  conditions?: string[],
  initial: unknown[] = [],
) {
  const args = [...initial];
  const where = [...(conditions ?? [])];
  const param = (value: unknown) => "$" + args.push(value);
  if (collection.where) where.push(collection.where);
  if (query.search) {
    if (!collection.search?.length)
      throw new BadRequestException(
        "Search is not supported for this resource.",
      );
    const search = param(query.search.toLowerCase());
    where.push(
      "(" +
        collection.search
          .map(
            (field) =>
              "strpos(lower(coalesce(" +
              field +
              "::text,'')), " +
              search +
              ") > 0",
          )
          .join(" OR ") +
        ")",
    );
  }
  for (const key of [
    "status",
    "categoryId",
    "accommodationType",
    "buildingId",
    "roomId",
    "dormitoryId",
    "designation",
    "admissionCategory",
    "bedId",
    "availabilityStatus",
    "floor",
  ] as const) {
    const value = query[key];
    if (value === undefined) continue;
    const filter = collection.filters?.[key];
    if (
      !filter ||
      (key === "status" &&
        collection.statusValues &&
        !collection.statusValues.includes(String(value)))
    ) {
      throw new BadRequestException("Unsupported " + key + " filter.");
    }
    where.push(filter + " = " + param(value));
  }
  if (query.dateFrom || query.dateTo) {
    if (!collection.date)
      throw new BadRequestException(
        "Date filters are not supported for this resource.",
      );
    if (query.dateFrom)
      where.push(
        collection.date +
          " >= " +
          param(calendarDate(query.dateFrom)) +
          "::date",
      );
    if (query.dateTo)
      where.push(
        collection.date +
          " < (" +
          param(calendarDate(query.dateTo)) +
          "::date + 1)",
      );
    if (query.dateFrom && query.dateTo && query.dateFrom > query.dateTo)
      throw new BadRequestException("dateFrom must be on or before dateTo.");
  }
  const sort = query.sortBy ?? collection.sorts[0];
  if (!collection.sorts.includes(sort))
    throw new BadRequestException("Unsupported sort field.");
  const searchWhere = where.length ? " WHERE " + where.join(" AND ") : "";
  const limit = param(query.limit),
    offset = param((query.page - 1) * query.limit);
  const result = await sql.query<{
    data: Record<string, unknown>[];
    total: number;
  }>(
    "WITH matches AS (SELECT " +
      (collection.select ?? "t.*") +
      " FROM " +
      collection.from +
      searchWhere +
      "), page AS (SELECT * FROM matches ORDER BY " +
      sort +
      (query.sortOrder === "asc" ? " ASC" : " DESC") +
      ", id LIMIT " +
      limit +
      " OFFSET " +
      offset +
      ") " +
      "SELECT coalesce((SELECT json_agg(page) FROM page),'[]') AS data, (SELECT count(*)::int FROM matches) AS total",
    args,
  );
  const { data, total } = result.rows[0];
  const totalPages = Math.ceil(total / query.limit);
  return {
    data,
    page: query.page,
    limit: query.limit,
    total,
    totalPages,
    hasNext: query.page < totalPages,
    hasPrevious: query.page > 1,
  };
}

export function found<T>(row: T | undefined): T {
  if (!row) throw new NotFoundException("Record not found.");
  return row;
}

export function identifier(input: string) {
  if (!/^[a-z][a-z0-9_]*$/.test(input))
    throw new Error("Invalid internal SQL identifier.");
  return input;
}

export async function insert(sql: Sql, table: string, values: object) {
  const entries = Object.entries(values).filter(
    ([, value]) => value !== undefined,
  );
  const fields = entries.map(([key]) => identifier(key));
  const params = entries.map(([, value]) => value);
  const result = await sql.query(
    "INSERT INTO " +
      identifier(table) +
      " (" +
      fields.join(",") +
      ") VALUES (" +
      fields.map((_, i) => "$" + (i + 1)).join(",") +
      ") RETURNING *",
    params,
  );
  return result.rows[0];
}

export async function update(
  sql: Sql,
  table: string,
  id: string,
  values: object,
  key = "id",
) {
  const entries = Object.entries(values).filter(
    ([, value]) => value !== undefined,
  );
  if (!entries.length)
    throw new BadRequestException("Provide at least one field to update.");
  const fields = entries.map(
    ([name], i) => identifier(name) + " = $" + (i + 2),
  );
  const result = await sql.query(
    "UPDATE " +
      identifier(table) +
      " SET " +
      fields.join(",") +
      " WHERE " +
      identifier(key) +
      " = $1 RETURNING *",
    [id, ...entries.map(([, value]) => value)],
  );
  return found(result.rows[0]);
}

const auditFields = new Set([
  "status",
  "admission_status",
  "operational_status",
  "is_active",
  "staff_visible",
  "role_id",
  "assigned_user_id",
  "category_id",
  "building_id",
  "room_id",
  "bed_id",
  "dormitory_id",
  "resident_id",
  "capacity",
  "bed_capacity",
  "reserved_capacity",
  "reservation_start",
  "reservation_end",
  "converted_allocation_id",
  "version",
  "deleted_at",
]);
function auditValues(record?: Record<string, unknown>) {
  return record
    ? JSON.stringify(
        Object.fromEntries(
          Object.entries(record).filter(([key]) => auditFields.has(key)),
        ),
      )
    : null;
}
export async function audit(
  sql: Sql,
  user: string | null,
  module: string,
  id: string,
  action: string,
  before?: Record<string, unknown>,
  after?: Record<string, unknown>,
) {
  await sql.query(
    "INSERT INTO audit_logs(user_id,module_name,record_id,action,old_values,new_values) VALUES($1,$2,$3,$4,$5,$6)",
    [user, module, id, action, auditValues(before), auditValues(after)],
  );
}

const databaseErrors: Record<string, [number, string]> = {
  "23505": [409, "A record with the same unique value already exists."],
  "23503": [422, "A referenced record is missing or is still in use."],
  "23514": [409, "The change conflicts with a data constraint."],
  "23502": [400, "A required field is missing."],
  "22001": [400, "A field exceeds its maximum length."],
  "22007": [400, "Invalid date or time."],
  "22008": [400, "Invalid date or time."],
  "22P02": [400, "Invalid field value."],
  "40001": [409, "The data changed during this operation. Retry the request."],
  "40P01": [409, "The data changed during this operation. Retry the request."],
  ECONNREFUSED: [503, "Database unavailable."],
  ETIMEDOUT: [503, "Database unavailable."],
};

@Catch()
export class ApiErrors implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = "An unexpected error occurred.";
    if (error instanceof HttpException) {
      status = error.getStatus();
      const response = error.getResponse();
      message =
        typeof response === "string"
          ? response
          : ((response as { message?: string | string[] }).message ?? message);
    } else if (
      typeof error === "object" &&
      error &&
      "code" in error &&
      typeof error.code === "string"
    ) {
      const detail = databaseErrors[error.code];
      if (detail) [status, message] = detail;
    }
    host
      .switchToHttp()
      .getResponse<{
        status: (status: number) => { json: (body: object) => void };
      }>()
      .status(status)
      .json({ statusCode: status, message });
  }
}
