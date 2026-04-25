type MemoryType = "preference" | "itinerary_change" | "constraint";
type MemorySource = "ai_suggestion" | "user_feedback" | "vote_result";
type MemoryContent = {
    key: string;
    value: unknown;
};
type QualityLogContent = {
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
};
export declare class MemoryService {
    private prisma;
    constructor();
    private shouldSkipDuplicate;
    addMemory(tripId: string, memoryType: MemoryType, content: MemoryContent, source: MemorySource, userId?: string): Promise<void>;
    getMemories(tripId: string): Promise<Array<{
        memoryType: string;
        content: MemoryContent;
        source: string;
        createdAt: Date;
    }>>;
    getMemoryContext(tripId: string): Promise<string>;
    recordPreference(tripId: string, key: string, value: unknown, source: MemorySource, userId?: string): Promise<void>;
    recordItineraryChange(tripId: string, change: string, details: unknown, source: MemorySource, userId?: string): Promise<void>;
    recordConstraint(tripId: string, constraint: string, value: unknown, source: MemorySource, userId?: string): Promise<void>;
    clearMemories(tripId: string): Promise<void>;
    appendSessionMessages(tripId: string, messages: Array<{
        sessionId: string;
        role: "user" | "assistant";
        content: string;
        timestamp: string;
    }>): Promise<void>;
    loadSessionMessages(tripId: string, sessionId: string, limit?: number): Promise<Array<{
        role: "user" | "assistant";
        content: string;
        timestamp: string;
    }>>;
    clearSessionMessages(tripId: string, sessionId: string): Promise<void>;
    addQualityLog(tripId: string, log: QualityLogContent): Promise<void>;
    getQualitySummary(tripId: string, limit?: number): Promise<{
        total: number;
        fallbackCount: number;
        fallbackRate: number;
        avgToolCalls: number;
        avgLatencyMs: number;
        latest: QualityLogContent[];
    }>;
}
export {};
