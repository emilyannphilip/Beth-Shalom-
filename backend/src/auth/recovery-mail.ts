import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport, type Transporter } from "nodemailer";

@Injectable()
export class RecoveryMail {
  private readonly transport?: Transporter;
  private readonly origin?: string;
  private readonly sender?: string;
  private readonly logger = new Logger(RecoveryMail.name);

  constructor(config: ConfigService) {
    const host = config.get<string>("SMTP_HOST");
    if (!host) return;
    const from = config.get<string>("SMTP_FROM");
    const url = config.get<string>("PORTAL_ORIGIN");
    if (!from || !url)
      throw Error(
        "SMTP_FROM and PORTAL_ORIGIN are required when enabling recovery email.",
      );
    const origin = new URL(url);
    const loopback = ["127.0.0.1", "localhost", "[::1]"].includes(
      origin.hostname,
    );
    if (
      origin.href !== origin.origin + "/" ||
      !(
        origin.protocol === "https:" ||
        (process.env.NODE_ENV !== "production" &&
          loopback &&
          origin.protocol === "http:")
      )
    )
      throw Error(
        "PORTAL_ORIGIN must be an HTTPS origin, or an HTTP loopback origin in development.",
      );
    const port = Number(config.get<string>("SMTP_PORT") ?? 587);
    if (!Number.isSafeInteger(port) || port < 1 || port > 65535)
      throw Error("SMTP_PORT is invalid.");
    const user = config.get<string>("SMTP_USER"),
      pass = config.get<string>("SMTP_PASSWORD");
    if (Boolean(user) !== Boolean(pass))
      throw Error(
        "Configure both SMTP_USER and SMTP_PASSWORD when SMTP authentication is used.",
      );
    const secure = port === 465 || config.get("SMTP_SECURE") === "true";
    this.transport = createTransport({
      host,
      port,
      secure,
      requireTLS: !secure,
      auth: user && pass ? { user, pass } : undefined,
      connectionTimeout: 5000,
      greetingTimeout: 6000,
      socketTimeout: 12000,
    });
    this.origin = origin.origin;
    this.sender = from;
  }

  get enabled() {
    return Boolean(this.transport);
  }
  async send(email: string, token: string) {
    if (!this.transport) return;
    const link =
      this.origin + "/portal/reset-password#token=" + encodeURIComponent(token);
    try {
      await this.transport.sendMail({
        from: this.sender,
        to: email,
        subject: "Reset your Beth Shalom portal password",
        text:
          "Use this link to choose a new password. It expires in 30 minutes and can be used once.\n\n" +
          link +
          "\n\nIf you did not request this change, you can ignore this email.",
      });
    } catch {
      this.logger.warn("A password recovery email could not be delivered.");
    }
  }
}
