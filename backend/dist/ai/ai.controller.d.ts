import { AiService } from "./ai.service";
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    chat(body: {
        message: string;
        sessionId?: string;
        context?: Record<string, unknown>;
    }): Promise<{
        sessionId: string;
        reply: string;
        toolResults: {
            amapConfigured: boolean;
            llmConfigured: boolean;
            destination: string | undefined;
            weather: {
                city: string;
                weather: string | undefined;
                temperature: string | undefined;
                humidity: string | undefined;
                reportTime: string | undefined;
            } | null;
            attractions: {
                name: string | undefined;
                type: string | undefined;
                address: string | undefined;
                location: string | undefined;
                tel: string | undefined;
            }[];
            restaurants: {
                name: string | undefined;
                type: string | undefined;
                address: string | undefined;
                location: string | undefined;
                tel: string | undefined;
            }[];
            routeComparison: {
                origin: string;
                destination: string;
                routes: ({
                    mode: "transit";
                    distance: string;
                    duration: string;
                    durationMinutes: number;
                    cost: number;
                } | {
                    mode: "driving" | "walking";
                    distance: string;
                    duration: string;
                    durationMinutes: number;
                    cost: number;
                } | null)[];
                recommended: {
                    mode: "transit";
                    distance: string;
                    duration: string;
                    durationMinutes: number;
                    cost: number;
                } | {
                    mode: "driving" | "walking";
                    distance: string;
                    duration: string;
                    durationMinutes: number;
                    cost: number;
                } | null;
            } | null;
        };
        history: {
            role: "user" | "assistant";
            content: string;
            timestamp: string;
        }[];
        timestamp: string;
    }>;
    getHistory(sessionId: string): {
        sessionId: string;
        history: {
            role: "user" | "assistant";
            content: string;
            timestamp: string;
        }[];
    };
    clearSession(sessionId: string): {
        success: boolean;
        sessionId: string;
    };
}
