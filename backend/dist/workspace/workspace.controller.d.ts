import { WorkspaceService } from "./workspace.service";
export declare class WorkspaceController {
    private readonly workspaceService;
    constructor(workspaceService: WorkspaceService);
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
    moveActivity(activityId: string, body: {
        targetDayNumber: number;
        targetIndex?: number;
    }): any;
    swapActivities(activityId: string, body: {
        targetActivityId: string;
    }): {
        sourceActivity: any;
        targetActivity: any;
    } | null;
    voteOnActivity(activityId: string, body: {
        direction: 1 | -1;
    }): any;
    addComment(activityId: string, body: {
        body: string;
    }): {
        event: string;
        id: string;
        activityId: string;
        authorName: string;
        body: string;
        createdAt: string;
    } | null;
    getActivityFeed(tripId: string): any;
    checkIn(activityId: string): any;
}
