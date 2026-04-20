"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryService = void 0;
const common_1 = require("@nestjs/common");
const mock_store_1 = require("../common/mock-store");
let SummaryService = class SummaryService {
    getSummary(tripId) {
        const trip = mock_store_1.mockStore.trips.find((item) => item.id === tripId);
        if (!trip)
            return null;
        const allActivities = trip.itinerary.flatMap((day) => day.activities);
        const totalSpent = trip.expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
        const completedActivities = allActivities.filter((activity) => activity.status === "completed").length;
        const consensusScore = allActivities.length > 0
            ? Math.round((allActivities.reduce((sum, activity) => {
                const totalVotes = Number(activity.votes?.for || 0) + Number(activity.votes?.against || 0);
                return sum + (totalVotes ? Number(activity.votes?.for || 0) / totalVotes : 0.5);
            }, 0) /
                allActivities.length) *
                100)
            : 0;
        return {
            ...trip.summary,
            stats: {
                ...trip.summary.stats,
                duration: trip.itinerary.length,
                activities: completedActivities || allActivities.length,
                totalSpent,
                consensus: consensusScore,
            },
        };
    }
    addDiaryEntry(tripId, body) {
        const trip = mock_store_1.mockStore.trips.find((item) => item.id === tripId);
        if (!trip)
            return null;
        const entry = { id: `diary_${Date.now()}`, ...body };
        trip.summary.diaryEntries.unshift(entry);
        trip.activityFeed.unshift({
            id: `feed_${Date.now()}`,
            user: String(body.author || "Traveler"),
            action: `added a trip diary entry for day ${String(body.day || "")}`.trim(),
            time: "just now",
        });
        return entry;
    }
};
exports.SummaryService = SummaryService;
exports.SummaryService = SummaryService = __decorate([
    (0, common_1.Injectable)()
], SummaryService);
//# sourceMappingURL=summary.service.js.map