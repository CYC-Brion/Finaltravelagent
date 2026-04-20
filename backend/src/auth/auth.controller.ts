import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() body: { email: string; name?: string }) {
    return this.authService.login(body);
  }

  @Post("register")
  register(@Body() body: { email: string; name?: string }) {
    return this.authService.register(body);
  }

  @Post("invitations/accept")
  acceptInvitation(@Body() body: { token: string }) {
    return this.authService.acceptInvitation(body.token);
  }
}
