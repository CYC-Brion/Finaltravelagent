import { AmapService } from "./amap.service";
import { LlmService } from "./llm.service";
import { SerpapiHotelsService } from "./serpapi-hotels.service";
import { MemoryService } from "./memory.service";
type SessionMessage = {
    role: "user" | "assistant";
    content: string;
    timestamp: string;
};
type AgentContext = Record<string, unknown> & {
    tripId?: string;
    destination?: string;
    tripName?: string;
    startDate?: string;
    endDate?: string;
    origin?: string;
    destinationAddress?: string;
};
export type StreamCallbacks = {
    onToolCall?: (toolName: string, args: Record<string, unknown>) => void;
    onToolResult?: (toolName: string, result: unknown) => void;
    onChunk?: (content: string) => void;
    onDone?: (reply: string, toolResults: Record<string, unknown>, history: SessionMessage[]) => void;
    onError?: (error: string) => void;
};
export declare class AiService {
    private readonly amapService;
    private readonly llmService;
    private readonly serpapiHotelsService;
    private readonly memoryService;
    private readonly sessions;
    private readonly shortTermMemory;
    constructor(amapService: AmapService, llmService: LlmService, serpapiHotelsService: SerpapiHotelsService, memoryService: MemoryService);
    chat(message: string, sessionId?: string, context?: AgentContext): Promise<{
        sessionId: string;
        reply: string;
        toolResults: Record<string, unknown>;
        history: SessionMessage[];
        timestamp: string;
    }>;
    chatStream(message: string, sessionId: string | undefined, context?: AgentContext, callbacks?: StreamCallbacks): Promise<void>;
    private executeToolCall;
    searchHotels(input: {
        destination: string;
        checkInDate?: string;
        checkOutDate?: string;
        adults?: number;
        minRating?: number;
        minPrice?: number;
        maxPrice?: number;
        maxResults?: number;
    }): Promise<{
        configured: boolean;
        reason: string;
        hotels: {
            id: string;
            name: string;
            address?: string;
            district?: string;
            latitude?: number;
            longitude?: number;
            rating?: number;
            reviews?: number;
            nightlyPrice?: number;
            totalPrice?: number;
            currency: string;
            source?: string;
            sourceUrl?: string;
            transportMinutes?: number;
            rankScore: number;
            rankReason: string;
        }[];
        destination?: undefined;
        checkInDate?: undefined;
        checkOutDate?: undefined;
        currency?: undefined;
        strategy?: undefined;
    } | {
        configured: boolean;
        destination: string;
        checkInDate: string;
        checkOutDate: string;
        currency: string;
        strategy: string;
        hotels: {
            rankReason: string;
            rankScore: number;
            id: string;
            name: string;
            address?: string;
            district?: string;
            latitude?: number;
            longitude?: number;
            rating?: number;
            reviews?: number;
            nightlyPrice?: number;
            totalPrice?: number;
            currency: string;
            source?: string;
            sourceUrl?: string;
            transportMinutes?: number;
        }[];
        reason?: undefined;
    }>;
    getHistory(sessionId: string): {
        sessionId: string;
        history: SessionMessage[];
    };
    clearSession(sessionId: string): {
        success: boolean;
        sessionId: string;
    };
    recordPreference(tripId: string, key: string, value: unknown, sessionId?: string): Promise<void>;
    recordDecision(tripId: string, decision: string, details: unknown, sessionId?: string): Promise<void>;
    getShortTermMemory(sessionId: string): {
        tripContext: Record<string, unknown>;
        preferences: Array<{
            key: string;
            value: unknown;
            timestamp: string;
        }>;
        recentDecisions: Array<{
            decision: string;
            details: unknown;
            timestamp: string;
        }>;
    } | undefined;
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
        members?: unknown[];
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
        hotels: Record<string, any>[];
    } | {
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
        hotels: {
            id: string;
            name: string;
            address?: string;
            district?: string;
            latitude?: number;
            longitude?: number;
            rating?: number;
            reviews?: number;
            nightlyPrice?: number;
            totalPrice?: number;
            currency: string;
            source?: string;
            sourceUrl?: string;
            transportMinutes?: number;
            rankScore: number;
            rankReason: string;
        }[] | {
            rankReason: string;
            rankScore: number;
            id: string;
            name: string;
            address?: string;
            district?: string;
            latitude?: number;
            longitude?: number;
            rating?: number;
            reviews?: number;
            nightlyPrice?: number;
            totalPrice?: number;
            currency: string;
            source?: string;
            sourceUrl?: string;
            transportMinutes?: number;
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
