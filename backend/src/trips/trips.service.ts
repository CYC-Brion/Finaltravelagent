import { Injectable } from "@nestjs/common";
import { mockStore } from "../common/mock-store";
import { AiService } from "../ai/ai.service";

@Injectable()
export class TripsService {
  constructor(private readonly aiService: AiService) {}

  listTrips() {
    return mockStore.trips;
  }

  createTrip(body: Record<string, unknown>) {
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
    mockStore.trips.unshift(trip as never);
    return trip;
  }

  getTrip(tripId: string) {
    return mockStore.trips.find((trip: any) => trip.id === tripId) || null;
  }

  updateTrip(tripId: string, body: Record<string, unknown>) {
    const trip = this.getTrip(tripId);
    if (!trip) return null;
    Object.assign(trip, body);
    return trip;
  }

  async generateDraft(tripId: string) {
    const trip = this.getTrip(tripId);
    if (!trip) return null;
    trip.status = "planning";
    const generated = await this.aiService.generateTripDraft(trip);
    trip.itinerary = generated.itinerary;
    trip.aiSuggestions = generated.aiSuggestions;
    trip.aiDraftMeta = {
      insights: generated.insights || [],
      weather: generated.weather || null,
      attractions: generated.attractions || [],
    };
    trip.activityFeed.unshift({
      id: `feed_${Date.now()}`,
      user: "AI Assistant",
      action: "generated a fresh itinerary draft",
      time: "just now",
    });
    return trip;
  }

  publishTrip(tripId: string) {
    const trip = this.getTrip(tripId);
    if (!trip) return null;
    const allActivities = trip.itinerary.flatMap((day: any) => day.activities);
    const featuredActivities = allActivities.slice(0, 3).map((activity: any) => activity.name);
    const totalSpent = trip.expenses.reduce((sum: number, expense: any) => sum + Number(expense.amount || 0), 0);
    const excerpt =
      trip.summary?.diaryEntries?.[0]?.content ||
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
      image:
        "https://images.unsplash.com/photo-1685053361005-17fee61b704e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      excerpt,
      featuredActivities,
      totalSpent,
      duration: trip.itinerary.length,
    };
    trip.publishedCommunityPostId = post.id;
    mockStore.communityPosts.unshift(post as never);
    return post;
  }

  async getOnTripToday(tripId: string) {
    const trip = this.getTrip(tripId);
    if (!trip) return null;
    return this.aiService.buildOnTripSnapshot(trip);
  }

  getAiDraft(tripId: string) {
    const trip = this.getTrip(tripId);
    if (!trip) return null;
    return {
      tripId,
      itinerary: trip.itinerary,
      aiSuggestions: trip.aiSuggestions,
      aiDraftMeta: trip.aiDraftMeta || {
        insights: [],
        weather: null,
        attractions: [],
      },
    };
  }

  respondToSuggestion(tripId: string, suggestionId: string, response: "accepted" | "dismissed") {
    const trip = this.getTrip(tripId);
    if (!trip) return null;
    const suggestion = trip.aiSuggestions.find((item: any) => item.id === suggestionId);
    if (!suggestion) return null;
    suggestion.status = response;
    trip.activityFeed.unshift({
      id: `feed_${Date.now()}`,
      user: "Demo Traveler",
      action: `${response === "accepted" ? "accepted" : "dismissed"} AI suggestion: ${suggestion.title}`,
      time: "just now",
    });
    return suggestion;
  }
}
