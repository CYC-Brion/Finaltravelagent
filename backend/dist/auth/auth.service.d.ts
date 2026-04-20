export declare class AuthService {
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
    acceptInvitation(token: string): {
        success: boolean;
        token: string;
    };
}
