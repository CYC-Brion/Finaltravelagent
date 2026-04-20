import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        name?: string;
    }): {
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    };
    register(body: {
        email: string;
        name?: string;
    }): {
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    };
    acceptInvitation(body: {
        token: string;
    }): {
        success: boolean;
        token: string;
    };
}
