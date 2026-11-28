import {
  applyDecorators,
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiExtension } from "@nestjs/swagger";
import { Reflector } from "@nestjs/core";
import { Database } from "../database/database.module";
import { SessionTokens } from "./tokens";
import { authAudit } from "./security";

export type Actor = {
  id: string;
  name: string;
  role: "ADMIN" | "STAFF";
  permissions: string[];
};
export type AuthRequest = {
  socket: { remoteAddress?: string };
  headers: Record<string, string | string[] | undefined>;
  actor?: Actor;
};
export const Require = (permission: string) =>
  applyDecorators(
    SetMetadata("access", permission),
    ApiExtension("x-required-permission", permission),
  );
export const Public = () => Require("public");
export const CurrentActor = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    context.switchToHttp().getRequest<AuthRequest>().actor,
);
export const bearer = (value: string | string[] | undefined) =>
  typeof value === "string"
    ? /^Bearer ([A-Za-z0-9_.-]{1,2048})$/i.exec(value)?.[1]
    : undefined;

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly db: Database,
    private readonly tokens: SessionTokens,
  ) {}
  async canActivate(context: ExecutionContext) {
    const permission = this.reflector.getAllAndOverride<string>("access", [
      context.getHandler(),
      context.getClass(),
    ]);
    if (permission === "public") return true;
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const token = bearer(request.headers.authorization);
    if (!token) throw new UnauthorizedException("Sign in to continue.");
    const { sessionId, userId } = this.tokens.read(token, "access");
    const result = await this.db.query<Actor>(
      "SELECT u.id,u.full_name AS name,r.name AS role,coalesce(array_agg(p.code) FILTER (WHERE p.code IS NOT NULL),'{}') AS permissions " +
        "FROM auth_sessions s JOIN users u ON u.id=s.user_id JOIN roles r ON r.id=u.role_id " +
        "LEFT JOIN role_permissions rp ON rp.role_id=r.id LEFT JOIN permissions p ON p.id=rp.permission_id " +
        "WHERE s.id=$1 AND s.user_id=$2 AND s.revoked_at IS NULL AND s.expires_at>now() AND u.status='ACTIVE' AND u.deleted_at IS NULL " +
        "AND r.name IN ('ADMIN','STAFF') GROUP BY u.id,r.name",
      [sessionId, userId],
    );
    const actor = result.rows[0];
    if (!actor)
      throw new UnauthorizedException(
        "The session has expired. Sign in again.",
      );
    if (
      !permission ||
      (permission !== "signed-in" && !actor.permissions.includes(permission))
    ) {
      await authAudit(this.db, "ACCESS_DENIED", userId, sessionId, permission);
      throw new ForbiddenException(
        "You do not have permission for this operation.",
      );
    }
    request.actor = actor;
    return true;
  }
}
