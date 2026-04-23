"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsService = void 0;
const common_1 = require("@nestjs/common");
const mock_store_1 = require("../common/mock-store");
const ai_service_1 = require("../ai/ai.service");
let TripsService = class TripsService {
    constructor(aiService) {
        this.aiService = aiService;
    }
    listTrips() {
        return mock_store_1.mockStore.trips;
    }
    createTrip(body) {
        const members = Array.isArray(body.members) ? body.members : [];
        const trip = {
            id: `trip_${Date.now()}`,
            name: body.name || "New Trip",
            destination: body.destination || "Unknown destination",
            startDate: body.startDate || new Date().toISOString().slice(0, 10),
            endDate: body.endDate || new Date().toISOString().slice(0, 10),
            status: "draft",
            preferences: {
                budgetMin: Number(body.budgetMin || 0),
                budgetMax: Number(body.budgetMax || 0),
                pace: body.pace || "moderate",
                interests: Array.isArray(body.interests) ? body.interests : [],
            },
            members: [
                {
                    id: `member_${Date.now()}`,
                    userId: "user_1",
                    email: "demo@helloworld.app",
                    name: "Demo Traveler",
                    role: "owner",
                    invitationStatus: "accepted",
                    isOnline: true,
                },
                ...members.map((email, index) => ({
                    id: `member_invited_${index}_${Date.now()}`,
                    email,
                    name: typeof email === "string" ? email.split("@")[0] : `Guest ${index + 1}`,
                    role: "member",
                    invitationStatus: "pending",
                    isOnline: false,
                })),
            ],
            itinerary: [],
            aiDraftMeta: null,
            aiSuggestions: [],
            activityFeed: [],
            expenses: [],
            settlements: [],
            summary: {
                stats: {
                    duration: 0,
                    activities: 0,
                    totalSpent: 0,
                    photosUploaded: 0,
                    consensus: 0,
                },
                diaryEntries: [],
                reflections: {
                    wins: [],
                    lessons: [],
                    quote: "",
                },
            },
        };
        mock_store_1.mockStore.trips.unshift(trip);
        return trip;
    }
    getTrip(tripId) {
        return mock_store_1.mockStore.trips.find((trip) => trip.id === tripId) || null;
    }
    updateTrip(tripId, body) {
        const trip = this.getTrip(tripId);
        if (!trip)
            return null;
        Object.assign(trip, body);
        return trip;
    }
    async generateDraft(tripId) {
        const trip = this.getTrip(tripId);
        if (!trip)
            return null;
        trip.status = "planning";
        const generated = await this.aiService.generateTripDraft(trip);
        trip.itinerary = generated.itinerary;
        trip.aiSuggestions = generated.aiSuggestions;
        trip.aiDraftMeta = {
            insights: generated.insights || [],
            weather: generated.weather || null,
            attractions: generated.attractions || [],
            hotels: generated.hotels || [],
        };
        trip.activityFeed.unshift({
            id: `feed_${Date.now()}`,
            user: "AI Assistant",
            action: "generated a fresh itinerary draft",
            time: "just now",
        });
        return trip;
    }
    publishTrip(tripId) {
        const trip = this.getTrip(tripId);
        if (!trip)
            return null;
        const allActivities = trip.itinerary.flatMap((day) => day.activities);
        const featuredActivities = allActivities.slice(0, 3).map((activity) => activity.name);
        const totalSpent = trip.expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
        const excerpt = trip.summary?.diaryEntries?.[0]?.content ||
            `A ${trip.itinerary.length}-day collaborative trip through ${trip.destination} with highlights like ${featuredActivities.join(", ")}.`;
        const post = {
            id: `community_${Date.now()}`,
            tripId,
            title: `${trip.name}: shared by Demo Traveler`,
            location: trip.destination,
            authorName: "Demo Traveler",
            tags: trip.preferences?.interests || [],
            likes: 0,
            comments: 0,
            saves: 0,
            image: "https://images.unsplash.com/photo-1685053361005-17fee61b704e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
            excerpt,
            featuredActivities,
            totalSpent,
            duration: trip.itinerary.length,
        };
        trip.publishedCommunityPostId = post.id;
        mock_store_1.mockStore.communityPosts.unshift(post);
        return post;
    }
    async getOnTripToday(tripId) {
        const trip = this.getTrip(tripId);
        if (!trip)
            return null;
        return this.aiService.buildOnTripSnapshot(trip);
    }
    getAiDraft(tripId) {
        const trip = this.getTrip(tripId);
        if (!trip)
            return null;
        return {
            tripId,
            itinerary: trip.itinerary,
            aiSuggestions: trip.aiSuggestions,
            aiDraftMeta: trip.aiDraftMeta || {
                insights: [],
                weather: null,
                attractions: [],
                hotels: [],
            },
        };
    }
    respondToSuggestion(tripId, suggestionId, response) {
        const trip = this.getTrip(tripId);
        if (!trip)
            return null;
        const suggestion = trip.aiSuggestions.find((item) => item.id === suggestionId);
        if (!suggestion)
            return null;
        suggestion.status = response;
        trip.activityFeed.unshift({
            id: `feed_${Date.now()}`,
            user: "Demo Traveler",
            action: `${response === "accepted" ? "accepted" : "dismissed"} AI suggestion: ${suggestion.title}`,
            time: "just now",
        });
        return suggestion;
    }
};
exports.TripsService = TripsService;
exports.TripsService = TripsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], TripsService);
//# sourceMappingURL=trips.service.js.map