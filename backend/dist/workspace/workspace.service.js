"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceService = void 0;
const common_1 = require("@nestjs/common");
const mock_store_1 = require("../common/mock-store");
let WorkspaceService = class WorkspaceService {
    getItinerary(tripId) {
        const trip = mock_store_1.mockStore.trips.find((item) => item.id === tripId);
        return trip?.itinerary || [];
    }
    createActivity(tripId, body) {
        const trip = mock_store_1.mockStore.trips.find((item) => item.id === tripId);
        if (!trip)
            return null;
        const newActivity = {
            id: `activity_${Date.now()}`,
            dayNumber: Number(body.dayNumber || 1),
            time: String(body.time || "9:00 AM"),
            name: String(body.name || "New activity"),
            location: String(body.location || ""),
            duration: String(body.duration || "1h"),
            cost: Number(body.cost || 0),
            status: "proposed",
            votes: { for: 0, against: 0, userVote: 0 },
            comments: [],
        };
        const day = trip.itinerary.find((item) => item.day === newActivity.dayNumber);
        if (day) {
            day.activities.push(newActivity);
        }
        else {
            trip.itinerary.push({
                day: newActivity.dayNumber,
                dateLabel: `Day ${newActivity.dayNumber}`,
                activities: [newActivity],
            });
        }
        return newActivity;
    }
    updateActivity(activityId, body) {
        const activity = this.findActivity(activityId);
        if (!activity)
            return null;
        Object.assign(activity, body);
        return activity;
    }
    vote(activityId, direction) {
        const result = this.findActivity(activityId);
        if (!result)
            return null;
        if (direction === 1)
            result.activity.votes.for += 1;
        if (direction === -1)
            result.activity.votes.against += 1;
        result.activity.votes.userVote = direction;
        result.trip.activityFeed.unshift({
            id: `feed_${Date.now()}`,
            user: "Demo Traveler",
            action: `voted on ${result.activity.name}`,
            time: "just now",
        });
        return { ...result.activity, event: "vote.created" };
    }
    addComment(activityId, body) {
        const result = this.findActivity(activityId);
        if (!result)
            return null;
        const comment = {
            id: `comment_${Date.now()}`,
            activityId,
            authorName: "Demo Traveler",
            body,
            createdAt: new Date().toISOString(),
        };
        result.activity.comments.unshift(comment);
        result.trip.activityFeed.unshift({
            id: `feed_${Date.now()}`,
            user: "Demo Traveler",
            action: `commented on ${result.activity.name}`,
            time: "just now",
        });
        return { ...comment, event: "comment.created" };
    }
    getActivityFeed(tripId) {
        const trip = mock_store_1.mockStore.trips.find((item) => item.id === tripId);
        return trip?.activityFeed || [];
    }
    checkIn(activityId) {
        const result = this.findActivity(activityId);
        if (!result)
            return null;
        result.activity.status = "completed";
        result.trip.activityFeed.unshift({
            id: `feed_${Date.now()}`,
            user: "Demo Traveler",
            action: `checked in at ${result.activity.name}`,
            time: "just now",
        });
        return result.activity;
    }
    findActivity(activityId) {
        for (const trip of mock_store_1.mockStore.trips) {
            for (const day of trip.itinerary) {
                const activity = day.activities.find((item) => item.id === activityId);
                if (activity) {
                    return { trip, day, activity };
                }
            }
        }
        return null;
    }
};
exports.WorkspaceService = WorkspaceService;
exports.WorkspaceService = WorkspaceService = __decorate([
    (0, common_1.Injectable)()
], WorkspaceService);
//# sourceMappingURL=workspace.service.js.map