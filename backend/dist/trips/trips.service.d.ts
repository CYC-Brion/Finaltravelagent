import { AiService } from "../ai/ai.service";
export declare class TripsService {
    private readonly aiService;
    constructor(aiService: AiService);
    listTrips(): any;
    createTrip(body: Record<string, unknown>): {
        id: string;
        name: {};
        destination: {};
        startDate: {};
        endDate: {};
        status: string;
        preferences: {
            budgetMin: number;
            budgetMax: number;
            pace: {};
            interests: any[];
        };
        members: ({
            id: string;
            email: any;
            name: string;
            role: string;
            invitationStatus: string;
            isOnline: boolean;
        } | {
            id: string;
            userId: string;
            email: string;
            name: string;
            role: string;
            invitationStatus: string;
            isOnline: boolean;
        })[];
        itinerary: never[];
        aiDraftMeta: null;
        aiSuggestions: never[];
        activityFeed: never[];
        expenses: never[];
        settlements: never[];
        summary: {
            stats: {
                duration: number;
                activities: number;
                totalSpent: number;
                photosUploaded: number;
                consensus: number;
            };
            diaryEntries: never[];
            reflections: {
                wins: never[];
                lessons: never[];
                quote: string;
            };
        };
    };
    getTrip(tripId: string): any;
    updateTrip(tripId: string, body: Record<string, unknown>): any;
    generateDraft(tripId: string): Promise<any>;
    publishTrip(tripId: string): {
        id: string;
        tripId: string;
        title: string;
        location: any;
        authorName: string;
        tags: any;
        likes: number;
        comments: number;
        saves: number;
        image: string;
    } | null;
    getOnTripToday(tripId: string): Promise<{
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
    } | null>;
    getAiDraft(tripId: string): {
        tripId: string;
        itinerary: any;
        aiSuggestions: any;
        aiDraftMeta: any;
    } | null;
    respondToSuggestion(tripId: string, suggestionId: string, response: "accepted" | "dismissed"): any;
}
