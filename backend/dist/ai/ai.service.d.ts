import { AmapService } from "./amap.service";
import { LlmService } from "./llm.service";
type SessionMessage = {
    role: "user" | "assistant";
    content: string;
    timestamp: string;
};
type AgentContext = Record<string, unknown> & {
    destination?: string;
    tripName?: string;
    startDate?: string;
    endDate?: string;
    origin?: string;
    destinationAddress?: string;
};
export declare class AiService {
    private readonly amapService;
    private readonly llmService;
    private readonly sessions;
    constructor(amapService: AmapService, llmService: LlmService);
    chat(message: string, sessionId?: string, context?: AgentContext): Promise<{
        sessionId: string;
        reply: string;
        toolResults: Record<string, unknown>;
        history: SessionMessage[];
        timestamp: string;
    }>;
    private executeToolCall;
    getHistory(sessionId: string): {
        sessionId: string;
        history: SessionMessage[];
    };
    clearSession(sessionId: string): {
        success: boolean;
        sessionId: string;
    };
    generateTripDraft(trip: {
        id: string;
        name: string;
        destination: string;
        startDate: string;
        endDate: string;
        preferences?: {
            pace?: string;
            interests?: string[];
            budgetMin?: number;
            budgetMax?: number;
        };
    }): Promise<{
        itinerary: {
            day: number;
            dateLabel: string;
            activities: {
                id: string;
                dayNumber: number;
                time: string;
                name: string;
                location: string;
                duration: string;
                cost: number;
                status: string;
                votes: {
                    for: number;
                    against: number;
                    userVote: number;
                };
                comments: never[];
            }[];
        }[];
        aiSuggestions: {
            id: string;
            title: string;
            description: string;
            status: string;
        }[];
        insights: string[];
        weather: unknown;
        attractions: {
            name?: string;
            address?: string;
        }[];
    }>;
    buildOnTripSnapshot(trip: any): Promise<{
        currentDay: any;
        today: any;
        weather: {
            city: string;
            weather: string | undefined;
            temperature: string | undefined;
            humidity: string | undefined;
            reportTime: string | undefined;
        } | null;
        routePlan: {
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
        replanSuggestion: string;
    }>;
    private resolveDestination;
    private buildFallbackReply;
    private buildFallbackDraft;
    private buildFallbackOnTripSuggestion;
    private getTripDayCount;
    private extractJson;
    private normalizeActivityStatus;
}
export {};
