import "reflect-metadata";
import { type ConfigType } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { loadServerConfig } from "./config/server.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { host, port } = app.get<ConfigType<typeof loadServerConfig>>(loadServerConfig.KEY);

  app.setGlobalPrefix("api/v1");
  await app.listen(port, host);
}

void bootstrap();
