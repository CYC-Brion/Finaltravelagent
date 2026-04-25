import { Response } from "express";
import { AiService } from "./ai.service";
import { Observable } from "rxjs";
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    searchHotels(body: {
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
        destination: string;
        checkInDate: string;
        checkOutDate: string;
        currency: string;
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
        strategy?: undefined;
    } | {
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
        reason?: undefined;
    }>;
    streamChat(body: {
        message: string;
        sessionId?: string;
        context?: Record<string, unknown>;
    }, res: Response): Observable<void>;
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
    getHistory(sessionId: string): Promise<{
        sessionId: string;
        history: {
            role: "user" | "assistant";
            content: string;
            timestamp: string;
        }[];
    }>;
    getMetrics(tripId: string): Promise<{
        total: number;
        fallbackCount: number;
        fallbackRate: number;
        avgToolCalls: number;
        avgLatencyMs: number;
        latest: {
            sessionId: string;
            messageLength: number;
            responseLength: number;
            toolCallCount: number;
            toolNames: string[];
            toolDurationsMs: number[];
            totalLatencyMs: number;
            llmCalls: number;
            fallbackTriggered: boolean;
            error?: string;
            createdAt: string;
        }[];
    }>;
    clearSession(sessionId: string): Promise<{
        success: boolean;
        sessionId: string;
    }>;
}
