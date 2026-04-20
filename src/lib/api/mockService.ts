import type {
  AgentChatResponse,
  AiDraftData,
  AuthSession,
  CommunityPost,
  CreateTripInput,
  Expense,
  LoginInput,
  OnTripTodayResponse,
  Trip,
} from "@/domain/types";
import { defaultUser, seedCommunityPosts, seedTrips } from "./mockData";

const DB_KEY = "helloworld.mock.db";

interface MockDb {
  trips: Trip[];
  communityPosts: CommunityPost[];
}

const wait = async (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));
const createId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

function getDb(): MockDb {
  const raw = window.localStorage.getItem(DB_KEY);
  if (raw) {
    return JSON.parse(raw) as MockDb;
  }
  const initial: MockDb = { trips: seedTrips, communityPosts: seedCommunityPosts };
  window.localStorage.setItem(DB_KEY, JSON.stringify(initial));
  return initial;
}

function setDb(nextDb: MockDb) {
  window.localStorage.setItem(DB_KEY, JSON.stringify(nextDb));
}

function toSession(input: LoginInput): AuthSession {
  return {
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    user: {
      ...defaultUser,
      email: input.email,
      name: input.name || input.email.split("@")[0]
    }
  };
}

export const mockService = {
  async login(input: LoginInput) {
    await wait();
    return toSession(input);
  },
  async register(input: LoginInput) {
    await wait();
    return toSession(input);
  },
  async acceptInvitation() {
    await wait();
    return { success: true };
  },
  async listTrips() {
    await wait();
    return getDb().trips;
  },
  async getTrip(tripId: string) {
    await wait();
    return getDb().trips.find((trip) => trip.id === tripId) || null;
  },
  async createTrip(input: CreateTripInput) {
    await wait();
    const db = getDb();
    const trip: Trip = {
      id: createId("trip"),
      name: input.name,
      destination: input.destination,
      startDate: input.startDate,
      endDate: input.endDate,
      status: "draft",
      preferences: {
        budgetMin: input.budgetMin,
        budgetMax: input.budgetMax,
        pace: input.pace,
        interests: input.interests
      },
      members: [
        { id: createId("member"), userId: defaultUser.id, email: defaultUser.email, name: defaultUser.name, role: "owner", invitationStatus: "accepted", isOnline: true },
        ...input.members.map((email) => ({
          id: createId("member"),
          email,
          name: email.split("@")[0],
          role: "member" as const,
          invitationStatus: "pending" as const,
          isOnline: false
        }))
      ],
      itinerary: seedTrips[0].itinerary,
      aiSuggestions: seedTrips[0].aiSuggestions,
      activityFeed: [],
      expenses: [],
      settlements: [],
      summary: seedTrips[0].summary
    };
    db.trips = [trip, ...db.trips];
    setDb(db);
    return trip;
  },
  async generateDraft(tripId: string) {
    await wait(350);
    const db = getDb();
    const trip = db.trips.find((item) => item.id === tripId);
    if (!trip) throw new Error("Trip not found");
    trip.status = "planning";
    setDb(db);
    return trip.itinerary;
  },
  async getAiDraft(tripId: string) {
    await wait();
    const trip = getDb().trips.find((item) => item.id === tripId);
    if (!trip) throw new Error("Trip not found");
    const payload: AiDraftData = {
      tripId,
      itinerary: trip.itinerary,
      aiSuggestions: trip.aiSuggestions,
      aiDraftMeta: {
        insights: [
          "Draft arranged around your top interests and current budget range.",
          "Morning slots prioritize high-demand sights for better queue times.",
        ],
        weather: {
          city: trip.destination,
          weather: "Cloudy",
          temperature: "22",
        },
        attractions: trip.itinerary.flatMap((day) =>
          day.activities.map((activity) => ({
            name: activity.name,
            address: activity.location,
            type: "attraction",
          })),
        ),
      },
    };
    return payload;
  },
  async respondToSuggestion(tripId: string, suggestionId: string, response: "accepted" | "dismissed") {
    await wait();
    const db = getDb();
    const trip = db.trips.find((item) => item.id === tripId);
    if (!trip) throw new Error("Trip not found");
    const suggestion = trip.aiSuggestions.find((item) => item.id === suggestionId);
    if (!suggestion) throw new Error("Suggestion not found");
    suggestion.status = response;
    trip.activityFeed.unshift({
      id: createId("feed"),
      user: defaultUser.name,
      action: `${response === "accepted" ? "accepted" : "dismissed"} AI suggestion: ${suggestion.title}`,
      time: "just now",
    });
    setDb(db);
    return suggestion;
  },
  async createActivity(tripId: string, input: {
    dayNumber: number;
    time: string;
    name: string;
    location?: string;
    duration?: string;
    cost?: number;
  }) {
    await wait();
    const db = getDb();
    const trip = db.trips.find((item) => item.id === tripId);
    if (!trip) throw new Error("Trip not found");
    const activity = {
      id: createId("activity"),
      dayNumber: input.dayNumber,
      time: input.time,
      name: input.name,
      location: input.location || trip.destination,
      duration: input.duration || "1h",
      cost: Number(input.cost || 0),
      status: "proposed" as const,
      votes: { for: 0, against: 0, userVote: 0 as const },
      comments: [],
    };
    const day = trip.itinerary.find((item) => item.day === input.dayNumber);
    if (day) {
      day.activities.push(activity);
    } else {
      trip.itinerary.push({
        day: input.dayNumber,
        dateLabel: `Day ${input.dayNumber}`,
        activities: [activity],
      });
    }
    trip.activityFeed.unshift({
      id: createId("feed"),
      user: defaultUser.name,
      action: `proposed ${activity.name}`,
      time: "just now",
    });
    setDb(db);
    return activity;
  },
  async vote(activityId: string, direction: 1 | -1) {
    await wait();
    const db = getDb();
    for (const trip of db.trips) {
      for (const day of trip.itinerary) {
        const activity = day.activities.find((item) => item.id === activityId);
        if (activity) {
          if (direction === 1) activity.votes.for += 1;
          if (direction === -1) activity.votes.against += 1;
          activity.votes.userVote = direction;
          trip.activityFeed.unshift({
            id: createId("feed"),
            user: defaultUser.name,
            action: `voted on ${activity.name}`,
            time: "just now"
          });
          setDb(db);
          return activity;
        }
      }
    }
    throw new Error("Activity not found");
  },
  async addComment(activityId: string, body: string) {
    await wait();
    const db = getDb();
    for (const trip of db.trips) {
      for (const day of trip.itinerary) {
        const activity = day.activities.find((item) => item.id === activityId);
        if (activity) {
          const comment = {
            id: createId("comment"),
            activityId,
            authorName: defaultUser.name,
            body,
            createdAt: new Date().toISOString(),
          };
          activity.comments.unshift(comment);
          trip.activityFeed.unshift({
            id: createId("feed"),
            user: defaultUser.name,
            action: `commented on ${activity.name}`,
            time: "just now"
          });
          setDb(db);
          return comment;
        }
      }
    }
    throw new Error("Activity not found");
  },
  async addExpense(tripId: string, expense: Omit<Expense, "id">) {
    await wait();
    const db = getDb();
    const trip = db.trips.find((item) => item.id === tripId);
    if (!trip) throw new Error("Trip not found");
    const nextExpense: Expense = { ...expense, id: createId("expense") };
    trip.expenses.unshift(nextExpense);
    setDb(db);
    return nextExpense;
  },
  async markSettlementPaid(tripId: string, settlementId: string) {
    await wait();
    const db = getDb();
    const trip = db.trips.find((item) => item.id === tripId);
    if (!trip) throw new Error("Trip not found");
    const settlement = trip.settlements.find((item) => item.id === settlementId);
    if (!settlement) throw new Error("Settlement not found");
    settlement.paid = true;
    setDb(db);
    return settlement;
  },
  async publishTrip(tripId: string) {
    await wait();
    const db = getDb();
    const trip = db.trips.find((item) => item.id === tripId);
    if (!trip) throw new Error("Trip not found");
    const post: CommunityPost = {
      id: createId("community"),
      tripId,
      title: `${trip.name}: shared by ${defaultUser.name}`,
      location: trip.destination,
      authorName: defaultUser.name,
      tags: trip.preferences.interests,
      likes: 0,
      comments: 0,
      saves: 0,
      image: seedCommunityPosts[0].image
    };
    trip.publishedCommunityPostId = post.id;
    db.communityPosts = [post, ...db.communityPosts];
    setDb(db);
    return post;
  },
  async listCommunityPosts() {
    await wait();
    return getDb().communityPosts;
  },
  async getOnTripToday(tripId: string) {
    await wait();
    const trip = getDb().trips.find((item) => item.id === tripId);
    if (!trip) throw new Error("Trip not found");
    const currentDay =
      trip.itinerary.find((day) => day.activities.some((activity) => activity.status !== "completed"))?.day || 1;
    const response: OnTripTodayResponse = {
      currentDay,
      today: trip.itinerary.find((day) => day.day === currentDay) || null,
      weather: {
        city: trip.destination,
        weather: "Cloudy",
        temperature: "22",
      },
      routePlan: {
        recommended: {
          mode: "walking",
          distance: "1.8 km",
          duration: "24 min",
        },
      },
      replanSuggestion: "Keep one indoor backup stop this afternoon in case the weather changes.",
    };
    return response;
  },
  async checkInActivity(activityId: string) {
    await wait();
    const db = getDb();
    for (const trip of db.trips) {
      for (const day of trip.itinerary) {
        const activity = day.activities.find((item) => item.id === activityId);
        if (activity) {
          activity.status = "completed";
          trip.activityFeed.unshift({
            id: createId("feed"),
            user: defaultUser.name,
            action: `checked in at ${activity.name}`,
            time: "just now"
          });
          setDb(db);
          return activity;
        }
      }
    }
    throw new Error("Activity not found");
  },
  async addDiaryEntry(tripId: string, input: { day: number; author: string; content: string; photos: number }) {
    await wait();
    const db = getDb();
    const trip = db.trips.find((item) => item.id === tripId);
    if (!trip) throw new Error("Trip not found");
    const entry = { ...input, id: createId("diary") };
    trip.summary.diaryEntries.unshift(entry);
    setDb(db);
    return entry;
  },
  async chatWithAssistant(input: { message: string; sessionId?: string }) {
    await wait(500);
    const response: AgentChatResponse = {
      sessionId: input.sessionId || createId("session"),
      reply: `Mock AI response: I can help you refine this trip. You asked: "${input.message}". Switch \`VITE_USE_MOCK_API\` to false to use the backend agent.`,
      history: [
        {
          role: "user",
          content: input.message,
          timestamp: new Date().toISOString(),
        },
        {
          role: "assistant",
          content: `Mock AI response: I can help you refine this trip. You asked: "${input.message}". Switch \`VITE_USE_MOCK_API\` to false to use the backend agent.`,
          timestamp: new Date().toISOString(),
        },
      ],
      timestamp: new Date().toISOString(),
      toolResults: {
        amapConfigured: false,
        llmConfigured: false,
      },
    };
    return response;
  }
};
