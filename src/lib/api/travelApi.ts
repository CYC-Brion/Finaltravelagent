import { env } from "@/config/env";
import type { AgentChatResponse, AiDraftData, CreateTripInput, Expense, HotelSearchResponse, LoginInput, OnTripTodayResponse } from "@/domain/types";
import { apiRequest } from "./client";
import { mockService } from "./mockService";

export type StreamEvent = {
  event: "tool_call" | "tool_result" | "chunk" | "done" | "error";
  data: unknown;
};

export type StreamCallbacks = {
  onToolCall?: (tool: string, args: Record<string, unknown>) => void;
  onToolResult?: (tool: string, result: unknown) => void;
  onChunk?: (content: string) => void;
  onDone?: () => void;
  onError?: (error: string) => void;
};

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
  searchHotels: (input: {
    destination: string;
    checkInDate?: string;
    checkOutDate?: string;
    adults?: number;
    minRating?: number;
    minPrice?: number;
    maxPrice?: number;
    maxResults?: number;
  }) => apiRequest<HotelSearchResponse>("/ai/hotels/search", { method: "POST", body: JSON.stringify(input) }),
  chatWithAssistant: (input: {
    message: string;
    sessionId?: string;
    context?: Record<string, unknown>;
  }) => apiRequest<AgentChatResponse>("/ai/chat", { method: "POST", body: JSON.stringify(input) }),
  chatWithAssistantStream: async ({
    input,
    callbacks,
  }: {
    input: {
      message: string;
      sessionId?: string;
      context?: Record<string, unknown>;
    };
    callbacks: StreamCallbacks;
  }) => {
    const baseUrl = env.apiBaseUrl || "http://localhost:4000";
    const response = await fetch(`${baseUrl}/ai/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      callbacks.onError?.(`Request failed: ${response.status}`);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      callbacks.onError?.("No response body");
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let eventType = "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            eventType = line.slice(7).trim();
            continue;
          }
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            if (eventType === "tool_call") {
              callbacks.onToolCall?.(data.tool, data.args);
            } else if (eventType === "tool_result") {
              callbacks.onToolResult?.(data.tool, data.result);
            } else if (eventType === "chunk") {
              callbacks.onChunk?.(data.content);
            } else if (eventType === "done") {
              callbacks.onDone?.();
            } else if (eventType === "error") {
              callbacks.onError?.(data.error);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
};

export const travelApi = env.useMockApi ? mockService : realService;
