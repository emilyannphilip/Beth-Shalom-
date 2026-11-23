import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { loadServerConfig } from "./config/server.config";
import { HealthController } from "./health/health.controller";

@Module({
  imports: [ConfigModule.forRoot({ load: [loadServerConfig] })],
  controllers: [HealthController],
})
export class AppModule {}
