import { applyDecorators } from "@nestjs/common";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";

export const enquiryStates = [
  "NEW",
  "PENDING",
  "IN_PROGRESS",
  "SUBMITTED",
  "CLOSED",
] as const;
export const visitStates = [
  "REQUESTED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
] as const;
export const residentStates = [
  "ADMITTED",
  "HOSPITALIZED",
  "TEMPORARY_LEAVE",
  "DISCHARGED",
] as const;
export const inventoryStates = ["ACTIVE", "MAINTENANCE", "INACTIVE"] as const;
export const reservationStates = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "EXPIRED",
  "CONVERTED",
] as const;

const trim = Transform(({ value }) =>
  typeof value === "string" ? value.trim() : value,
);
const optional = (required: boolean) => (required ? [] : [IsOptional()]);
export const Text = (maxLength: number, required = false) =>
  applyDecorators(
    ApiProperty({ type: String, maxLength, required }),
    trim,
    IsString(),
    MaxLength(maxLength),
    ...(required ? [IsNotEmpty()] : [IsOptional()]),
  );
export const Id = (required = false) =>
  applyDecorators(
    ApiProperty({ type: String, format: "uuid", required }),
    IsUUID(),
    ...optional(required),
  );
export const Num = (minimum: number, maximum: number, required = false) =>
  applyDecorators(
    ApiProperty({ type: Number, minimum, maximum, required }),
    IsInt(),
    Min(minimum),
    Max(maximum),
    ...optional(required),
  );
export const Bool = () =>
  applyDecorators(
    ApiProperty({ type: Boolean, required: false }),
    IsBoolean(),
    IsOptional(),
  );
export const Choice = (values: readonly string[], required = false) =>
  applyDecorators(
    ApiProperty({ enum: [...values], required }),
    IsIn([...values]),
    ...optional(required),
  );
export const DateField = (required = false) =>
  applyDecorators(
    ApiProperty({ type: String, format: "date", required }),
    Matches(/^\d{4}-\d{2}-\d{2}$/),
    IsDateString({ strict: true }),
    ...optional(required),
  );
const Timestamp = (required = false) =>
  applyDecorators(
    ApiProperty({ type: String, format: "date-time", required }),
    IsDateString({ strict: true, strictSeparator: true }),
    Matches(/T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/),
    ...optional(required),
  );
const Email = (required = false) =>
  applyDecorators(
    ApiProperty({ type: String, format: "email", required }),
    trim,
    IsEmail(),
    MaxLength(255),
    ...optional(required),
  );
const Phone = (required = false) =>
  applyDecorators(
    ApiProperty({ type: String, required, example: "+91 98765 43210" }),
    trim,
    Matches(/^\+?(?=(?:\D*\d){7,15}\D*$)[0-9(). -]{7,20}$/),
    MaxLength(20),
    ...optional(required),
  );

export class StaffData {
  @Text(150, true) full_name!: string;
  @Text(100, true) username!: string;
  @Email(true) email!: string;
  @Phone() phone?: string;
  @Text(100) designation?: string;
  @Id(true) role_id!: string;
  @Choice(["ACTIVE", "INACTIVE"]) status?: string;
  @ApiProperty({ type: String, minLength: 12, maxLength: 128, writeOnly: true })
  @IsString()
  @MinLength(12)
  @MaxLength(128)
  password!: string;
}
export class StaffPatch extends PartialType(StaffData) {}

export class CategoryData {
  @Text(150, true) category_name!: string;
  @Text(30, true) category_code!: string;
  @Choice(["ROOM", "DORMITORY"], true) accommodation_type!: string;
  @Num(1, 10000, true) default_capacity!: number;
  @Text(6000) description?: string;
  @Text(2048) image_url?: string;
  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(24)
  @IsString({ each: true })
  @MaxLength(300, { each: true })
  public_features?: string[];
  @Bool() is_active?: boolean;
}
export class CategoryPatch extends PartialType(CategoryData) {}

export class CategoryReassign {
  @Id(true) destination_category_id!: string;
  @ApiProperty({ type: [String], minItems: 1, uniqueItems: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  inventory_ids!: string[];
}
export class InventoryAvailabilityChange {
  @Id(true) id!: string;
  @Choice(inventoryStates, true)
  expected_status!: (typeof inventoryStates)[number];
  @Choice([...inventoryStates, "ARCHIVE"], true) status!:
    (typeof inventoryStates)[number] | "ARCHIVE";
}

export class AdjustAvailability {
  @ApiProperty({ type: () => [InventoryAvailabilityChange] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @ArrayUnique((unit: InventoryAvailabilityChange | null) =>
    typeof unit?.id === "string" ? unit.id.toLowerCase() : undefined,
  )
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => InventoryAvailabilityChange)
  changes!: InventoryAvailabilityChange[];
}

export class BuildingData {
  @Text(150, true) building_name!: string;
  @Text(30, true) building_code!: string;
  @Text(6000) description?: string;
  @Bool() is_active?: boolean;
}
export class BuildingPatch extends PartialType(BuildingData) {}
class InventoryData {
  @Choice(inventoryStates) operational_status?: string;
  @Text(3000) remarks?: string;
}
class LocatedInventoryData extends InventoryData {
  @Id(true) category_id!: string;
  @Id(true) building_id!: string;
  @Num(-20, 300) floor_number?: number | null;
}
export class RoomData extends LocatedInventoryData {
  @Text(30, true) room_number!: string;
  @Num(1, 10000, true) capacity!: number;
}
export class RoomPatch extends PartialType(RoomData) {}
export class DormitoryData extends LocatedInventoryData {
  @Text(30, true) dormitory_number!: string;
  @Text(150, true) dormitory_name!: string;
  @Num(1, 10000) bed_capacity?: number | null;
  @Text(6000) description?: string;
  @Text(2048) image_url?: string;
}
export class DormitoryPatch extends PartialType(DormitoryData) {}
export class BedData extends InventoryData {
  @Id(true) dormitory_id!: string;
  @Text(30, true) bed_number!: string;
}
export class BedPatch extends PartialType(BedData) {}

export class AccommodationTarget {
  @Id() room_id?: string;
  @Id() bed_id?: string;
  @Text(3000) remarks?: string;
}
export class AllocationData extends AccommodationTarget {
  @Id(true) resident_id!: string;
}
export class ReservationData extends AccommodationTarget {
  @Id() enquiry_id?: string;
  @Id() resident_id?: string;
  @Num(1, 10000) reserved_capacity?: number;
  @Timestamp(true) reservation_start!: string;
  @Timestamp(true) reservation_end!: string;
}
export class ReservationPatch extends PartialType(ReservationData) {}
export class Remarks {
  @Text(3000) remarks?: string;
}

export class EnquiryCategoryData {
  @Text(150, true) name!: string;
  @Text(3000) description?: string;
  @Bool() is_active?: boolean;
}
export class EnquiryCategoryPatch extends PartialType(EnquiryCategoryData) {}
class EnquiryDetails {
  @Text(100) applicant_relationship?: string;
  @Num(0, 130) age?: number;
  @Text(30) gender?: string;
  @Text(3000) address?: string;
  @Id() accommodation_category_id?: string;
  @Text(3000) care_requirement?: string;
  @Text(30) residence_type?: string;
  @Text(100) expected_move_in?: string;
  @Text(3000) medical_notes?: string;
  @Text(3000) dietary_notes?: string;
  @Bool() contact_consent?: boolean;
}
export class VisitData {
  @DateField() preferred_date?: string;
  @ApiProperty({ type: String, required: false, example: "14:30" })
  @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/)
  @IsOptional()
  preferred_time?: string;
  @Text(50) preferred_time_slot?: string;
  @Num(1, 500) visitor_count?: number;
  @Text(150) purpose?: string;
  @Text(3000) remarks?: string;
}
export class VisitCreate extends VisitData {
  @Id(true) enquiry_id!: string;
}
export class VisitPatch extends VisitData {
  @Choice(visitStates) status?: string;
}
export const childrenSupportSource = "HOME_CHILDREN_SUPPORT";
export const childrenSupportCategory = "Differently-Abled Support Living";

export const publicSources = [
  "WELCOME_ENQUIRY",
  "ROOM_APPLICATION",
  "DORMITORY_ENQUIRY",
  "HARMONY_SUITE_APPLICATION",
  "FACILITIES_ENQUIRY",
  "ADMISSION_ENQUIRY",
  "CAMPUS_WALKTHROUGH",
  "CONTACT_ENQUIRY",
  childrenSupportSource,
] as const;
export class EnquiryData {
  @Id(true) category_id!: string;
  @Text(150, true) applicant_name!: string;
  @Phone(true) phone!: string;
  @Email() email?: string;
  @Text(150) original_topic?: string;
  @Bool() whatsapp_available?: boolean;
  @Text(6000) message?: string;
  @ApiProperty({ type: EnquiryDetails, required: false })
  @ValidateNested()
  @Type(() => EnquiryDetails)
  @IsOptional()
  details?: EnquiryDetails;
  @ApiProperty({ type: VisitData, required: false })
  @ValidateNested()
  @Type(() => VisitData)
  @IsOptional()
  visit?: VisitData;
}
class ChildrenSupportEnquiry {
  @Text(150) child_name?: string;
  @Num(0, 130) child_age?: number;
  @Text(1500, true) accommodation_requirements!: string;
  @Text(1500) care_requirements?: string;
}

export class PublicEnquiry extends EnquiryData {
  @Choice(publicSources, true) source_form!: string;
  @Text(150, true) declare original_topic: string;
  @ApiProperty({ type: ChildrenSupportEnquiry, required: false })
  @ValidateNested()
  @Type(() => ChildrenSupportEnquiry)
  @IsOptional()
  child_support?: ChildrenSupportEnquiry;
}
export class PortalEnquiry extends EnquiryData {
  @Choice(enquiryStates) status?: string;
  @Id() assigned_user_id?: string | null;
  @Text(3000) followup_remarks?: string;
}
export class EnquiryPatch extends PartialType(PortalEnquiry) {
  @Id() visit_id?: string;
  @Num(1, 2147483647) version?: number;
}
export class Followup extends Remarks {
  @Choice(enquiryStates) status?: string;
  @Timestamp() followup_date?: string;
}
export class ResidentData {
  @Text(150, true) full_name!: string;
  @Id() enquiry_id?: string;
  @DateField(true) date_of_birth!: string;
  @DateField(true) admission_date!: string;
  @DateField() expected_discharge_date?: string | null;
  @Text(100) admission_category?: string;
  @Text(30) gender?: string;
  @Phone() phone?: string;
  @Email() email?: string;
  @Text(3000) address?: string;
  @Text(3000) remarks?: string;
  @Bool() staff_visible?: boolean;
}
export class ResidentCreate extends ResidentData {
  @ApiProperty({ type: () => ContactData, required: false, nullable: true })
  @ValidateNested()
  @Type(() => ContactData)
  @IsOptional()
  emergency_contact?: ContactData | null;
  @ApiProperty({ type: () => ContactData, required: false, nullable: true })
  @ValidateNested()
  @Type(() => ContactData)
  @IsOptional()
  guardian_contact?: ContactData | null;
  @ApiProperty({ type: () => CareData, required: false, nullable: true })
  @ValidateNested()
  @Type(() => CareData)
  @IsOptional()
  care?: CareData | null;
  @ApiProperty({ type: AccommodationTarget, required: false })
  @ValidateNested()
  @Type(() => AccommodationTarget)
  @IsOptional()
  accommodation?: AccommodationTarget;
}
export class ResidentPatch extends PartialType(ResidentCreate) {
  @Choice(["ADMITTED", "HOSPITALIZED", "TEMPORARY_LEAVE"])
  admission_status?: string;
}
export class Discharge extends Remarks {
  @DateField() discharge_date?: string;
}
export class ContactData {
  @Text(150, true) contact_name!: string;
  @Choice(["GUARDIAN", "EMERGENCY", "OTHER"], true) contact_type!: string;
  @Text(50) relationship?: string;
  @Text(3000) address?: string;
  @Phone() phone?: string;
  @Email() email?: string;
  @Bool() is_primary?: boolean;
}
export class ContactPatch extends PartialType(ContactData) {}
export class CareData {
  @Text(3000) medical_conditions?: string;
  @Text(3000) allergies?: string;
  @Text(3000) dietary_requirements?: string;
  @Text(3000) mobility_requirements?: string;
  @Text(3000) care_requirements?: string;
  @Text(3000) special_instructions?: string;
}
