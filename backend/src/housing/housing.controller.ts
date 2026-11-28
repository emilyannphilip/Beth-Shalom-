import {
  Body,
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
import {
  Id,
  AllocationData,
  AdjustAvailability,
  AccommodationTarget,
  BedData,
  BedPatch,
  BuildingData,
  BuildingPatch,
  CategoryData,
  CategoryPatch,
  CategoryReassign,
  DormitoryData,
  DormitoryPatch,
  Remarks,
  ReservationData,
  ReservationPatch,
  RoomData,
  RoomPatch,
} from "../common/dtos";
import { ListQuery, audit, list, update } from "../common/api";
import { HousingService } from "./housing.service";

@ApiTags("AccommodationCategories")
@ApiBearerAuth()
@Require("housing.manage")
@Controller("accommodation-categories")
export class AccommodationCategoriesController {
  constructor(private readonly housing: HousingService) {}
  @Get() list(@Query() query: ListQuery) {
    return this.housing.inventory("accommodation_categories", query);
  }
  @Get(":id") detail(@Param("id", ParseUUIDPipe) id: string) {
    return this.housing.item("accommodation_categories", id);
  }
  @Get(":id/availability")
  availability(@Param("id", ParseUUIDPipe) id: string) {
    return this.housing.availability("category", id);
  }
  @Patch(":id/availability")
  adjustAvailability(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: AdjustAvailability,
  ) {
    return this.housing.adjustAvailability(
      actor.id,
      "category",
      id,
      body.changes,
    );
  }
  @Get(":id/dependencies")
  dependencies(@Param("id", ParseUUIDPipe) id: string) {
    return this.housing.categoryDependencies(id);
  }
  @Post(":id/reassign")
  reassign(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: CategoryReassign,
  ) {
    return this.housing.reassignCategory(actor.id, id, body);
  }
  @Post() create(@CurrentActor() actor: Actor, @Body() body: CategoryData) {
    return this.housing.writeInventory(
      "accommodation_categories",
      actor.id,
      body,
    );
  }
  @Patch(":id") patch(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: CategoryPatch,
  ) {
    return this.housing.writeInventory(
      "accommodation_categories",
      actor.id,
      body,
      id,
    );
  }
  @Delete(":id") archive(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.housing.writeInventory(
      "accommodation_categories",
      actor.id,
      {},
      id,
      true,
    );
  }
}

@ApiTags("Buildings")
@ApiBearerAuth()
@Require("housing.manage")
@Controller("buildings")
export class BuildingsController {
  constructor(private readonly housing: HousingService) {}
  @Get() list(@Query() query: ListQuery) {
    return this.housing.inventory("buildings", query);
  }
  @Get(":id") detail(@Param("id", ParseUUIDPipe) id: string) {
    return this.housing.item("buildings", id);
  }
  @Post() create(@CurrentActor() actor: Actor, @Body() body: BuildingData) {
    return this.housing.writeInventory("buildings", actor.id, body);
  }
  @Patch(":id") patch(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: BuildingPatch,
  ) {
    return this.housing.writeInventory("buildings", actor.id, body, id);
  }
  @Delete(":id") archive(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.housing.writeInventory("buildings", actor.id, {}, id, true);
  }
}

@ApiTags("Rooms")
@ApiBearerAuth()
@Require("housing.manage")
@Controller("rooms")
export class RoomsController {
  constructor(private readonly housing: HousingService) {}
  @Get() list(@Query() query: ListQuery) {
    return this.housing.inventory("rooms", query);
  }
  @Get(":id") detail(@Param("id", ParseUUIDPipe) id: string) {
    return this.housing.item("rooms", id);
  }
  @Post() create(@CurrentActor() actor: Actor, @Body() body: RoomData) {
    return this.housing.writeInventory("rooms", actor.id, body);
  }
  @Patch(":id") patch(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: RoomPatch,
  ) {
    return this.housing.writeInventory("rooms", actor.id, body, id);
  }
  @Delete(":id") archive(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.housing.writeInventory("rooms", actor.id, {}, id, true);
  }
}

@ApiTags("Dormitories")
@ApiBearerAuth()
@Require("housing.manage")
@Controller("dormitories")
export class DormitoriesController {
  constructor(private readonly housing: HousingService) {}
  @Get() list(@Query() query: ListQuery) {
    return this.housing.inventory("dormitories", query);
  }
  @Get(":id") detail(@Param("id", ParseUUIDPipe) id: string) {
    return this.housing.item("dormitories", id);
  }
  @Get(":id/availability")
  availability(@Param("id", ParseUUIDPipe) id: string) {
    return this.housing.availability("dormitory", id);
  }
  @Patch(":id/availability")
  adjustAvailability(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: AdjustAvailability,
  ) {
    return this.housing.adjustAvailability(
      actor.id,
      "dormitory",
      id,
      body.changes,
    );
  }
  @Post() create(@CurrentActor() actor: Actor, @Body() body: DormitoryData) {
    return this.housing.writeInventory("dormitories", actor.id, body);
  }
  @Patch(":id") patch(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: DormitoryPatch,
  ) {
    return this.housing.writeInventory("dormitories", actor.id, body, id);
  }
  @Delete(":id") archive(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.housing.writeInventory("dormitories", actor.id, {}, id, true);
  }
}

@ApiTags("Beds")
@ApiBearerAuth()
@Require("housing.manage")
@Controller("beds")
export class BedsController {
  constructor(private readonly housing: HousingService) {}
  @Get() list(@Query() query: ListQuery) {
    return this.housing.inventory("dormitory_beds", query);
  }
  @Get(":id") detail(@Param("id", ParseUUIDPipe) id: string) {
    return this.housing.item("dormitory_beds", id);
  }
  @Post() create(@CurrentActor() actor: Actor, @Body() body: BedData) {
    return this.housing.writeInventory("dormitory_beds", actor.id, body);
  }
  @Patch(":id") patch(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: BedPatch,
  ) {
    return this.housing.writeInventory("dormitory_beds", actor.id, body, id);
  }
  @Delete(":id") archive(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.housing.writeInventory(
      "dormitory_beds",
      actor.id,
      {},
      id,
      true,
    );
  }
}

@ApiTags("Allocations")
@ApiBearerAuth()
@Require("housing.manage")
@Controller("allocations")
export class AllocationsController {
  constructor(private readonly housing: HousingService) {}
  @Get() list(@Query() query: ListQuery) {
    return this.housing.allocations(query);
  }
  @Get("residents") residents(@Query() query: ListQuery) {
    return list(
      this.housing.db,
      {
        from: "residents t",
        select: "t.id,t.resident_number,t.full_name,t.admission_status",
        where: "t.deleted_at IS NULL AND t.admission_status<>'DISCHARGED'",
        search: ["t.resident_number", "t.full_name"],
        sorts: ["full_name", "resident_number"],
      },
      query,
    );
  }
  @Get("history")
  @Require("allocations.history")
  history(@Query() query: ListQuery) {
    return this.housing.history(query);
  }
  @Get(":id") details(@Param("id", ParseUUIDPipe) id: string) {
    return this.housing.details("accommodation_allocations", id);
  }
  @Post() allocate(@CurrentActor() actor: Actor, @Body() body: AllocationData) {
    return this.housing.transaction((sql) =>
      this.housing.allocate(sql, actor.id, body.resident_id, body),
    );
  }
  @Patch(":id") edit(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: Remarks,
  ) {
    return this.housing.transaction(async (sql) => {
      const before = await this.housing.activeBooking(sql, id);
      const after = await update(sql, "accommodation_allocations", id, body);
      await audit(sql, actor.id, "allocations", id, "UPDATE", before, after);
      await this.housing.log(
        sql,
        actor.id,
        before.resident_id,
        "UPDATE",
        before,
        before,
        body.remarks,
      );
      return after;
    });
  }
  @Post(":id/transfer") transfer(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: AccommodationTarget,
  ) {
    return this.housing.transfer(actor.id, id, body);
  }
  @Post(":id/release") release(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: Remarks,
  ) {
    return this.housing.transaction(async (sql) =>
      this.housing.release(
        sql,
        actor.id,
        await this.housing.activeBooking(sql, id),
        body.remarks,
      ),
    );
  }
}

class ConvertReservation {
  @Id() resident_id?: string;
}

@ApiTags("Reservations")
@ApiBearerAuth()
@Require("housing.manage")
@Controller("reservations")
export class ReservationsController {
  constructor(private readonly housing: HousingService) {}
  @Get() list(@Query() query: ListQuery) {
    return this.housing.reservations(query);
  }
  @Get(":id") details(@Param("id", ParseUUIDPipe) id: string) {
    return this.housing.details("reservations", id);
  }
  @Post() reserve(@CurrentActor() actor: Actor, @Body() body: ReservationData) {
    return this.housing.writeReservation(actor.id, body);
  }
  @Patch(":id") edit(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: ReservationPatch,
  ) {
    return this.housing.writeReservation(actor.id, body, id);
  }
  @Post(":id/confirm") confirm(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.housing.transition(actor.id, id, "confirm");
  }
  @Post(":id/cancel") cancel(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.housing.transition(actor.id, id, "cancel");
  }
  @Post(":id/expire") expire(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.housing.transition(actor.id, id, "expire");
  }
  @Delete(":id") archive(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.housing.transition(actor.id, id, "cancel");
  }
  @Post(":id/convert") convert(
    @CurrentActor() actor: Actor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: ConvertReservation,
  ) {
    return this.housing.transition(actor.id, id, "convert", body.resident_id);
  }
}

@Module({
  controllers: [
    AccommodationCategoriesController,
    BuildingsController,
    RoomsController,
    DormitoriesController,
    BedsController,
  ],
})
export class InventoryModule {}
@Module({ controllers: [AllocationsController, ReservationsController] })
export class BookingsModule {}
