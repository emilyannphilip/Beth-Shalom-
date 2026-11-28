import {
  Global,
  Injectable,
  Logger,
  Module,
  OnModuleDestroy,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool, type PoolClient, type QueryResultRow } from "pg";

export interface Sql {
  query<Row extends QueryResultRow = QueryResultRow>(
    statement: string,
    values?: unknown[],
  ): Promise<import("pg").QueryResult<Row>>;
}

@Injectable()
export class Database implements OnModuleDestroy {
  private readonly pool: Pool | undefined;

  constructor(config: ConfigService) {
    const connectionString = config.get<string>("DATABASE_URL");
    if (!connectionString) return;
    this.pool = new Pool({
      connectionString,
      max: 10,
      connectionTimeoutMillis: 3000,
      statement_timeout: 8000,
      idleTimeoutMillis: 30000,
    });
    this.pool.on("error", () =>
      new Logger(Database.name).warn("An idle PostgreSQL connection failed."),
    );
  }

  query<Row extends QueryResultRow = QueryResultRow>(
    statement: string,
    values?: unknown[],
  ) {
    return this.connection().query<Row>(statement, values);
  }

  async transaction<T>(work: (client: PoolClient) => Promise<T>) {
    const client = await this.connection().connect();
    let discard = false;
    try {
      await client.query("BEGIN");
      const result = await work(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      try {
        await client.query("ROLLBACK");
      } catch {
        discard = true;
      }
      throw error;
    } finally {
      client.release(discard);
    }
  }

  async onModuleDestroy() {
    await this.pool?.end();
  }

  private connection() {
    if (!this.pool) throw new Error("DATABASE_URL is missing");
    return this.pool;
  }
}

@Global()
@Module({ providers: [Database], exports: [Database] })
export class DatabaseModule {}
