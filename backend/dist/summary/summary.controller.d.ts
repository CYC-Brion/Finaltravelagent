import { SummaryService } from "./summary.service";
export declare class SummaryController {
    private readonly summaryService;
    constructor(summaryService: SummaryService);
    getSummary(tripId: string): any;
    addDiaryEntry(tripId: string, body: Record<string, unknown>): {
        id: string;
    } | null;
}
