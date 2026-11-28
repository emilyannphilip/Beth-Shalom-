import {
  Body,
  Controller,
  Global,
  HttpCode,
  Module,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiProperty, ApiTags } from "@nestjs/swagger";
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import {
  AccessGuard,
  bearer,
  CurrentActor,
  Public,
  Require,
  type Actor,
  type AuthRequest,
} from "./access";
import { Authentication } from "./auth.service";
import { RecoveryMail } from "./recovery-mail";
import { AuthLimit } from "./security";
import { SessionTokens } from "./tokens";

class Credentials {
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(100) username!: string;
  @ApiProperty({ writeOnly: true })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password!: string;
}
class Refresh {
  @ApiProperty({ writeOnly: true })
  @IsString()
  @MinLength(1)
  @MaxLength(2048)
  refreshToken!: string;
}
class Logout {
  @ApiProperty({ writeOnly: true, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  refreshToken?: string;
}
class Forgot {
  @ApiProperty() @IsEmail() @MaxLength(255) email!: string;
}
class NewPassword {
  @ApiProperty({ writeOnly: true, minLength: 12 })
  @IsString()
  @MinLength(12)
  @MaxLength(128)
  password!: string;
}
class Reset extends NewPassword {
  @ApiProperty({ writeOnly: true })
  @Matches(/^[A-Za-z0-9_-]{43}$/)
  token!: string;
}
class Change extends NewPassword {
  @ApiProperty({ writeOnly: true })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  currentPassword!: string;
}
const network = (req: AuthRequest) => req.socket.remoteAddress ?? "unknown";

@ApiTags("Authentication")
@Controller("auth")
class AuthController {
  constructor(private readonly auth: Authentication) {}
  @Post("login")
  @Public()
  @HttpCode(200)
  login(@Body() input: Credentials, @Req() req: AuthRequest) {
    return this.auth.login(input.username, input.password, network(req));
  }
  @Post("refresh")
  @Public()
  @HttpCode(200)
  refresh(@Body() input: Refresh) {
    return this.auth.refresh(input.refreshToken);
  }
  @Post("logout")
  @Public()
  @HttpCode(200)
  async logout(@Body() input: Logout, @Req() req: AuthRequest) {
    await this.auth.logout(
      input?.refreshToken,
      bearer(req.headers.authorization),
    );
    return { ok: true };
  }
  @Post("forgot-password")
  @Public()
  @HttpCode(202)
  async forgot(@Body() input: Forgot, @Req() req: AuthRequest) {
    await this.auth.forgot(input.email, network(req));
    return {
      message:
        "If the account is eligible, a password reset link will be sent.",
    };
  }
  @Post("reset-password")
  @Public()
  @HttpCode(200)
  async reset(@Body() input: Reset, @Req() req: AuthRequest) {
    await this.auth.reset(input.token, input.password, network(req));
    return { ok: true };
  }
  @Post("change-password")
  @Require("signed-in")
  @ApiBearerAuth()
  @HttpCode(200)
  async change(
    @Body() input: Change,
    @CurrentActor() actor: Actor,
    @Req() req: AuthRequest,
  ) {
    await this.auth.change(
      actor.id,
      input.currentPassword,
      input.password,
      network(req),
    );
    return { ok: true };
  }
}

@ApiTags("Staff")
@ApiBearerAuth()
@Require("staff.manage")
@Controller("staff")
class StaffRecoveryController {
  constructor(private readonly auth: Authentication) {}
  @Post(":id/password-reset")
  @HttpCode(202)
  async reset(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentActor() actor: Actor,
    @Req() req: AuthRequest,
  ) {
    await this.auth.adminRecovery(id, actor.id, network(req));
    return { message: "A reset link was requested for the account." };
  }
}

@Global()
@Module({
  controllers: [AuthController, StaffRecoveryController],
  providers: [
    AccessGuard,
    Authentication,
    SessionTokens,
    AuthLimit,
    RecoveryMail,
  ],
  exports: [AccessGuard],
})
export class AuthModule {}
