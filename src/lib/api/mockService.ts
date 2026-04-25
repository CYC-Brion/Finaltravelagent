import type {
  AgentChatResponse,
  AiDraftData,
  AuthSession,
  CommunityPost,
  CreateTripInput,
  Expense,
  HotelSearchResponse,
  LoginInput,
  OnTripTodayResponse,
  Trip,
} from "@/domain/types";

type StreamCallbacks = {
  onToolCall?: (tool: string, args: Record<string, unknown>) => void;
  onToolResult?: (tool: string, result: unknown) => void;
  onChunk?: (content: string) => void;
  onDone?: () => void;
  onError?: (error: string) => void;
};
import { defaultUser, seedCommunityPosts, seedTrips } from "./mockData";

const DB_KEY = "helloworld.mock.db";

interface MockDb {
  trips: Trip[];
  communityPosts: CommunityPost[];
}

const wait = async (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));
const createId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const mockHotels = [
  {
    id: "hotel_mock_1",
    name: "The Peninsula Beijing",
    address: "8 Jinyu Hutong, Wangfujing, Beijing",
    district: "Dongcheng",
    rating: 4.8,
    reviews: 2360,
    nightlyPrice: 1880,
    totalPrice: 3760,
    currency: "CNY",
    source: "MockHotels",
    transportMinutes: 18,
    rankScore: 91,
    rankReason: "High rating, central location, good value for premium segment",
  },
  {
    id: "hotel_mock_2",
    name: "Novotel Peace Beijing",
    address: "3 Jinyu Hutong, Wangfujing, Beijing",
    district: "Dongcheng",
    rating: 4.4,
    reviews: 1488,
    nightlyPrice: 760,
    totalPrice: 1520,
    currency: "CNY",
    source: "MockHotels",
    transportMinutes: 14,
    rankScore: 88,
    rankReason: "Balanced price and location near transport",
  },
  {
    id: "hotel_mock_3",
    name: "Pudong Shangri-La Shanghai",
    address: "33 Fu Cheng Road, Pudong, Shanghai",
    district: "Pudong",
    rating: 4.7,
    reviews: 3010,
    nightlyPrice: 1320,
    totalPrice: 2640,
    currency: "CNY",
    source: "MockHotels",
    transportMinutes: 22,
    rankScore: 86,
    rankReason: "Strong rating with reliable transit access",
  },
];

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
        hotels: mockHotels,
      },
    };
    return payload;
  },
  async searchHotels(input: {
    destination: string;
    checkInDate?: string;
    checkOutDate?: string;
    adults?: number;
    minRating?: number;
    minPrice?: number;
    maxPrice?: number;
    maxResults?: number;
  }) {
    await wait(280);
    let rows = [...mockHotels];
    if (input.minRating) {
      rows = rows.filter((hotel) => (hotel.rating || 0) >= input.minRating!);
    }
    if (input.minPrice) {
      rows = rows.filter((hotel) => (hotel.nightlyPrice || 0) >= input.minPrice!);
    }
    if (input.maxPrice) {
      rows = rows.filter((hotel) => (hotel.nightlyPrice || Number.MAX_SAFE_INTEGER) <= input.maxPrice!);
    }
    rows = rows.slice(0, Math.max(1, Math.min(10, input.maxResults || 6)));

    const payload: HotelSearchResponse = {
      configured: true,
      destination: input.destination,
      checkInDate: input.checkInDate,
      checkOutDate: input.checkOutDate,
      currency: "CNY",
      strategy: "mock-value-first",
      hotels: rows,
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
  async updateActivity(activityId: string, input: {
    time?: string;
    name?: string;
    location?: string;
    duration?: string;
    cost?: number;
  }) {
    await wait();
    const db = getDb();
    for (const trip of db.trips) {
      for (const day of trip.itinerary) {
        const activity = day.activities.find((item) => item.id === activityId);
        if (activity) {
          Object.assign(activity, input);
          trip.activityFeed.unshift({
            id: createId("feed"),
            user: defaultUser.name,
            action: `updated ${activity.name}`,
            time: "just now",
          });
          setDb(db);
          return activity;
        }
      }
    }
    throw new Error("Activity not found");
  },
  async moveActivity(activityId: string, input: { targetDayNumber: number; targetIndex?: number }) {
    await wait();
    const db = getDb();
    for (const trip of db.trips) {
      for (const day of trip.itinerary) {
        const sourceIndex = day.activities.findIndex((item) => item.id === activityId);
        if (sourceIndex !== -1) {
          const [activity] = day.activities.splice(sourceIndex, 1);

          let targetDay = trip.itinerary.find((item) => item.day === input.targetDayNumber);
          if (!targetDay) {
            targetDay = {
              day: input.targetDayNumber,
              dateLabel: `Day ${input.targetDayNumber}`,
              activities: [],
            };
            trip.itinerary.push(targetDay);
            trip.itinerary.sort((a, b) => a.day - b.day);
          }

          const nextIndex =
            typeof input.targetIndex === "number"
              ? Math.max(0, Math.min(input.targetIndex, targetDay.activities.length))
              : targetDay.activities.length;

          activity.dayNumber = input.targetDayNumber;
          targetDay.activities.splice(nextIndex, 0, activity);

          trip.activityFeed.unshift({
            id: createId("feed"),
            user: defaultUser.name,
            action: `moved ${activity.name} to Day ${input.targetDayNumber}`,
            time: "just now",
          });
          setDb(db);
          return activity;
        }
      }
    }
    throw new Error("Activity not found");
  },
  async swapActivities(activityId: string, targetActivityId: string) {
    await wait();
    const db = getDb();
    for (const trip of db.trips) {
      let sourceDay: Trip["itinerary"][number] | null = null;
      let targetDay: Trip["itinerary"][number] | null = null;
      let sourceIndex = -1;
      let targetIndex = -1;

      for (const day of trip.itinerary) {
        const sIndex = day.activities.findIndex((item) => item.id === activityId);
        if (sIndex !== -1) {
          sourceDay = day;
          sourceIndex = sIndex;
        }

        const tIndex = day.activities.findIndex((item) => item.id === targetActivityId);
        if (tIndex !== -1) {
          targetDay = day;
          targetIndex = tIndex;
        }
      }

      if (!sourceDay || !targetDay || sourceIndex === -1 || targetIndex === -1) {
        continue;
      }

      const sourceActivity = sourceDay.activities[sourceIndex];
      const targetActivity = targetDay.activities[targetIndex];

      sourceDay.activities[sourceIndex] = targetActivity;
      targetDay.activities[targetIndex] = sourceActivity;
      sourceDay.activities[sourceIndex].dayNumber = sourceDay.day;
      targetDay.activities[targetIndex].dayNumber = targetDay.day;

      trip.activityFeed.unshift({
        id: createId("feed"),
        user: defaultUser.name,
        action: `swapped ${sourceActivity.name} with ${targetActivity.name}`,
        time: "just now",
      });

      setDb(db);
      return { sourceActivity: sourceDay.activities[sourceIndex], targetActivity: targetDay.activities[targetIndex] };
    }

    throw new Error("Activities not found");
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
  },
  async chatWithAssistantStream({
    input,
    callbacks,
  }: {
    input: {
      message: string;
      sessionId?: string;
      context?: Record<string, unknown>;
    };
    callbacks: StreamCallbacks;
  }) {
    await wait(200);
    const response = await this.chatWithAssistant({
      message: input.message,
      sessionId: input.sessionId,
    });
    callbacks.onChunk?.(response.reply);
    callbacks.onDone?.();
  }
};
