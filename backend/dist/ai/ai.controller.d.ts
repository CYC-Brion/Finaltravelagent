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
        toolResults: Record<string, unknown>;
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
