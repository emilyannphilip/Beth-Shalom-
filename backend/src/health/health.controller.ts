import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Database } from "../database/database.module";
import { Public } from "../auth/access";

@ApiTags("Health")
@Public()
@Controller("health")
export class HealthController {
  constructor(private readonly db: Database) {}

  @Get()
  getHealth() {
    return { status: "ok" };
  }

  @Get("database")
  async getDatabaseHealth() {
    try {
      await this.db.query("SELECT 1");
      return { status: "ok", database: "reachable" };
    } catch {
      throw new ServiceUnavailableException("Database unavailable.");
    }
  }
}
