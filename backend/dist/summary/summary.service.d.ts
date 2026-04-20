export declare class SummaryService {
    getSummary(tripId: string): any;
    addDiaryEntry(tripId: string, body: Record<string, unknown>): {
        id: string;
    } | null;
}
