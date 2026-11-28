import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { type ConfigType } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { loadServerConfig } from "./config/server.config";
import { ApiErrors } from "./common/api";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  const { host, port } = app.get<ConfigType<typeof loadServerConfig>>(
    loadServerConfig.KEY,
  );
  app.setGlobalPrefix("api/v1");
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false, value: false },
    }),
  );
  app.useGlobalFilters(new ApiErrors());
  app.enableShutdownHooks();

  if (["127.0.0.1", "::1"].includes(host) && process.env.NODE_ENV !== "production") {
    const options = new DocumentBuilder()
      .setTitle("Beth Shalom API")
      .setVersion("1")
      .setDescription("Sign in with /auth/login and use the JWT access token for protected API endpoints. Browser tokens are kept in HttpOnly cookies by Next.js.")
      .addBearerAuth()
      .addGlobalResponse(
        { status: 400, description: "Validation failed" },
        { status: 403, description: "Missing permission" },
        { status: 404, description: "Record not found" },
        { status: 409, description: "Duplicate or conflicting state" },
      )
      .build();
    const document = SwaggerModule.createDocument(app, options);
    const errorBody = {
      "application/json": {
        schema: {
          type: "object",
          required: ["statusCode", "message"],
          properties: {
            statusCode: { type: "integer" },
            message: {
              oneOf: [
                { type: "string" },
                { type: "array", items: { type: "string" } },
              ],
            },
          },
        },
      },
    };
    const pageBody = {
      "application/json": {
        schema: {
          type: "object",
          required: [
            "data",
            "page",
            "limit",
            "total",
            "totalPages",
            "hasNext",
            "hasPrevious",
          ],
          properties: {
            data: { type: "array", items: { type: "object" } },
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 20 },
            total: { type: "integer", example: 0 },
            totalPages: { type: "integer", example: 0 },
            hasNext: { type: "boolean" },
            hasPrevious: { type: "boolean" },
          },
        },
        example: {
          data: [],
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
        },
      },
    };
    for (const path of Object.values(document.paths)) {
      for (const method of ["get", "post", "patch", "put", "delete"] as const) {
        const operation = path?.[method];
        if (!operation) continue;
        for (const [status, response] of Object.entries(operation.responses)) {
          if (response && !("$ref" in response) && Number(status) >= 400)
            response.content ??= errorBody;
        }
        if (
          operation.parameters?.some(
            (parameter) =>
              "name" in parameter &&
              parameter.in === "query" &&
              parameter.name === "limit",
          )
        ) {
          operation.responses["200"] = {
            description: "Paginated records",
            content: pageBody,
          };
        }
      }
    }
    SwaggerModule.setup("api/docs", app, document);
  }
  await app.listen(port, host);
}

void bootstrap();
