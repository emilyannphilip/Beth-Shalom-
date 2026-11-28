import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { loadServerConfig } from "./config/server.config";
import { HealthController } from "./health/health.controller";
import { DatabaseModule } from "./database/database.module";
import { AccessGuard } from "./auth/access";
import { AuthModule } from "./auth/auth.module";
import { AdministrationModule } from "./administration/administration.module";
import { EnquiriesModule } from "./enquiries/enquiries.module";
import { InventoryModule, BookingsModule } from "./housing/housing.controller";
import { HousingDomainModule } from "./housing/housing.service";
import { ResidentsModule } from "./residents/residents.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [loadServerConfig] }),
    DatabaseModule,
    AuthModule,
    AdministrationModule,
    EnquiriesModule,
    HousingDomainModule,
    InventoryModule,
    BookingsModule,
    ResidentsModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useExisting: AccessGuard }],
})
export class AppModule {}
