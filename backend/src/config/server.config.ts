import { registerAs } from "@nestjs/config";

export const loadServerConfig = registerAs("server", () => {
  const rawPort = process.env.PORT ?? "3001";
  const port = Number(rawPort);

  if (!/^\d+$/.test(rawPort) || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  return {
    host: process.env.HOST ?? "127.0.0.1",
    port,
  };
});
