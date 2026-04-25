export declare class WorkspaceService {
    getItinerary(tripId: string): any;
    createActivity(tripId: string, body: Record<string, unknown>): {
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
    } | null;
    updateActivity(activityId: string, body: Record<string, unknown>): any;
    swapActivities(sourceActivityId: string, targetActivityId: string): {
        sourceActivity: any;
        targetActivity: any;
    } | null;
    moveActivity(activityId: string, targetDayNumber: number, targetIndex?: number): any;
    vote(activityId: string, direction: 1 | -1): any;
    addComment(activityId: string, body: string): {
        event: string;
        id: string;
        activityId: string;
        authorName: string;
        body: string;
        createdAt: string;
    } | null;
    getActivityFeed(tripId: string): any;
    checkIn(activityId: string): any;
    private findActivity;
}
