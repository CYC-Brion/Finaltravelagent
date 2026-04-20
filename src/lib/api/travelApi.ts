import { env } from "@/config/env";
import type { AgentChatResponse, AiDraftData, CreateTripInput, Expense, LoginInput, OnTripTodayResponse } from "@/domain/types";
import { apiRequest } from "./client";
import { mockService } from "./mockService";

const realService = {
  login: (input: LoginInput) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(input) }),
  register: (input: LoginInput) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify(input) }),
  acceptInvitation: (token: string) =>
    apiRequest("/auth/invitations/accept", { method: "POST", body: JSON.stringify({ token }) }),
  listTrips: () => apiRequest("/trips"),
  getTrip: (tripId: string) => apiRequest(`/trips/${tripId}`),
  createTrip: (input: CreateTripInput) => apiRequest("/trips", { method: "POST", body: JSON.stringify(input) }),
  generateDraft: (tripId: string) => apiRequest(`/trips/${tripId}/ai-draft/generate`, { method: "POST" }),
  getAiDraft: (tripId: string) => apiRequest<AiDraftData>(`/trips/${tripId}/ai-draft`),
  respondToSuggestion: (tripId: string, suggestionId: string, response: "accepted" | "dismissed") =>
    apiRequest(`/trips/${tripId}/ai-suggestions/${suggestionId}/respond`, { method: "POST", body: JSON.stringify({ response }) }),
  createActivity: (tripId: string, input: {
    dayNumber: number;
    time: string;
    name: string;
    location?: string;
    duration?: string;
    cost?: number;
  }) => apiRequest(`/trips/${tripId}/activities`, { method: "POST", body: JSON.stringify(input) }),
  vote: (activityId: string, direction: 1 | -1) =>
    apiRequest(`/activities/${activityId}/votes`, { method: "POST", body: JSON.stringify({ direction }) }),
  addComment: (activityId: string, body: string) =>
    apiRequest(`/activities/${activityId}/comments`, { method: "POST", body: JSON.stringify({ body }) }),
  addExpense: (tripId: string, expense: Omit<Expense, "id">) =>
    apiRequest(`/trips/${tripId}/expenses`, { method: "POST", body: JSON.stringify(expense) }),
  markSettlementPaid: (tripId: string, settlementId: string) =>
    apiRequest(`/trips/${tripId}/settlement/${settlementId}/mark-paid`, { method: "POST" }),
  publishTrip: (tripId: string) =>
    apiRequest(`/trips/${tripId}/community-publish`, { method: "POST" }),
  listCommunityPosts: () => apiRequest("/community/posts"),
  getOnTripToday: (tripId: string) => apiRequest<OnTripTodayResponse>(`/trips/${tripId}/on-trip/today`),
  checkInActivity: (activityId: string) =>
    apiRequest(`/activities/${activityId}/check-in`, { method: "POST" }),
  addDiaryEntry: (tripId: string, input: { day: number; author: string; content: string; photos: number }) =>
    apiRequest(`/trips/${tripId}/summary/diary`, { method: "POST", body: JSON.stringify(input) }),
  chatWithAssistant: (input: {
    message: string;
    sessionId?: string;
    context?: Record<string, unknown>;
  }) => apiRequest<AgentChatResponse>("/ai/chat", { method: "POST", body: JSON.stringify(input) })
};

export const travelApi = env.useMockApi ? mockService : realService;
