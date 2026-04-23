type MemoryType = "preference" | "itinerary_change" | "constraint";
type MemorySource = "ai_suggestion" | "user_feedback" | "vote_result";
type MemoryContent = {
    key: string;
    value: unknown;
};
export declare class MemoryService {
    private prisma;
    constructor();
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
}
export {};
