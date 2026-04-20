import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  login(body: { email: string; name?: string }) {
    return {
      accessToken: "dev-access-token",
      refreshToken: "dev-refresh-token",
      user: {
        id: "user_1",
        email: body.email,
        name: body.name || body.email.split("@")[0],
      },
    };
  }

  register(body: { email: string; name?: string }) {
    return this.login(body);
  }

  acceptInvitation(token: string) {
    return { success: true, token };
  }
}
