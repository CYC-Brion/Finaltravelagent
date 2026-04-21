import { Injectable } from "@nestjs/common";
import { AmapService } from "./amap.service";
import { LlmService, ToolDefinition, ToolCall, ToolCallResult } from "./llm.service";
import { amapTools } from "./amap.service";

type LlmMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type SessionMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

type AgentContext = Record<string, unknown> & {
  destination?: string;
  tripName?: string;
  startDate?: string;
  endDate?: string;
  origin?: string;
  destinationAddress?: string;
};

@Injectable()
export class AiService {
  private readonly sessions = new Map<string, SessionMessage[]>();

  constructor(
    private readonly amapService: AmapService,
    private readonly llmService: LlmService,
  ) {}

  async chat(message: string, sessionId?: string, context: AgentContext = {}) {
    const activeSessionId = sessionId || `session_${Date.now()}`;
    const history = this.sessions.get(activeSessionId) || [];

    const systemPrompt = [
      "You are TravelPal's collaborative AI travel agent.",
      "",
      "Answer in concise, practical English unless the user writes mostly Chinese, then answer in Chinese.",
      "",
      "When giving location suggestions:",
      "- Include specific name, address, and why it's recommended",
      "- Mention actual transportation with estimated time (e.g. '10 min walk or 2 subway stops')",
      "- Include approximate cost (e.g. '¥50 per person average')",
      "- Consider weather in recommendations ('due to rain forecast, indoor venues are better')",
      "",
      "When comparing options:",
      "- Provide pros/cons with specific details",
      "- Use real data from the provided tool results",
      "- Never give generic advice without specific context",
      "",
      "If tool data is unavailable, say so explicitly and give best-effort suggestions.",
    ].join("\n");

    const llmMessages: Parameters<LlmService["chat"]>[0] = [
      { role: "system", content: systemPrompt },
      ...history.slice(-6).map(
        (item): { role: "user" | "assistant"; content: string; name?: string } => ({
          role: item.role === "assistant" ? "assistant" : "user",
          content: item.content,
        }),
      ),
      { role: "user", content: message },
    ];

    let toolResults: Record<string, unknown> = {};
    const maxToolCalls = 5;
    let toolCallCount = 0;

    while (toolCallCount < maxToolCalls) {
      const { content, toolCalls } = await this.llmService.chat(
        llmMessages,
        amapTools,
        "auto",
      );

      if (content) {
        const reply = content;

        const nextHistory: SessionMessage[] = [
          ...history,
          { role: "user", content: message, timestamp: new Date().toISOString() },
          { role: "assistant", content: reply, timestamp: new Date().toISOString() },
        ];
        this.sessions.set(activeSessionId, nextHistory);

        return {
          sessionId: activeSessionId,
          reply,
          toolResults,
          history: nextHistory,
          timestamp: new Date().toISOString(),
        };
      }

      if (!toolCalls || toolCalls.length === 0) {
        const reply = this.buildFallbackReply(message, toolResults, context);
        const nextHistory: SessionMessage[] = [
          ...history,
          { role: "user", content: message, timestamp: new Date().toISOString() },
          { role: "assistant", content: reply, timestamp: new Date().toISOString() },
        ];
        this.sessions.set(activeSessionId, nextHistory);

        return {
          sessionId: activeSessionId,
          reply,
          toolResults,
          history: nextHistory,
          timestamp: new Date().toISOString(),
        };
      }

      const toolCallsWithResults: Array<{ toolCall: ToolCall; result: unknown }> = [];

      for (const toolCall of toolCalls) {
        const result = await this.executeToolCall(toolCall, context);
        toolResults[toolCall.name] = result;
        toolCallsWithResults.push({ toolCall, result });
      }

      llmMessages.push({
        role: "assistant",
        content: null,
        tool_calls: toolCalls.map((tc) => ({
          id: tc.id,
          type: "function" as const,
          function: { name: tc.name, arguments: tc.arguments },
        })),
      } as Parameters<LlmService["chat"]>[0][number]);

      for (const { toolCall, result } of toolCallsWithResults) {
        llmMessages.push({
          role: "tool",
          content: JSON.stringify(result),
          name: toolCall.name,
          tool_call_id: toolCall.id,
        } as Parameters<LlmService["chat"]>[0][number]);
      }

      toolCallCount++;
    }

    const reply = "抱歉，我需要更多时间处理您的请求，请稍后再试。";
    const nextHistory: SessionMessage[] = [
      ...history,
      { role: "user", content: message, timestamp: new Date().toISOString() },
      { role: "assistant", content: reply, timestamp: new Date().toISOString() },
    ];
    this.sessions.set(activeSessionId, nextHistory);

    return {
      sessionId: activeSessionId,
      reply,
      toolResults,
      history: nextHistory,
      timestamp: new Date().toISOString(),
    };
  }

  private async executeToolCall(toolCall: ToolCall, context: AgentContext): Promise<unknown> {
    const destination =
      context.destination ||
      (typeof context.trip === "object" && context.trip && "destination" in context.trip
        ? (context.trip as { destination?: string }).destination
        : undefined);

    switch (toolCall.name) {
      case "get_weather": {
        const args = JSON.parse(toolCall.arguments);
        return await this.amapService.getWeather(args.city || destination || "");
      }
      case "search_attractions": {
        const args = JSON.parse(toolCall.arguments);
        return await this.amapService.searchPlaces(
          args.destination || destination || "",
          `${args.destination || destination} attractions`,
        );
      }
      case "search_restaurants": {
        const args = JSON.parse(toolCall.arguments);
        return await this.amapService.searchPlaces(
          args.destination || destination || "",
          `${args.destination || destination} restaurants`,
        );
      }
      case "compare_routes": {
        const args = JSON.parse(toolCall.arguments);
        return await this.amapService.compareRoutes(
          args.origin,
          args.destination,
          args.city || destination,
        );
      }
      default:
        return { error: `Unknown tool: ${toolCall.name}` };
    }
  }

  getHistory(sessionId: string) {
    return {
      sessionId,
      history: this.sessions.get(sessionId) || [],
    };
  }

  clearSession(sessionId: string) {
    this.sessions.delete(sessionId);
    return {
      success: true,
      sessionId,
    };
  }

  async generateTripDraft(trip: {
    id: string;
    name: string;
    destination: string;
    startDate: string;
    endDate: string;
    preferences?: {
      pace?: string;
      interests?: string[];
      budgetMin?: number;
      budgetMax?: number;
    };
  }) {
    const days = this.getTripDayCount(trip.startDate, trip.endDate);
    const attractions = await this.amapService.searchPlaces(
      trip.destination,
      `${trip.destination} ${trip.preferences?.interests?.join(" ") || "attractions"}`,
    );
    const restaurants = await this.amapService.searchPlaces(
      trip.destination,
      `${trip.destination} restaurants`,
    );
    const weather = await this.amapService.getWeather(trip.destination);
    const fallbackDraft = this.buildFallbackDraft(trip, days, attractions, restaurants, weather);

    if (!this.llmService.isConfigured()) {
      return fallbackDraft;
    }

    try {
      const prompt = [
        "Create a trip itinerary JSON response only.",
        `Trip: ${trip.name}`,
        `Destination: ${trip.destination}`,
        `Dates: ${trip.startDate} to ${trip.endDate}`,
        `Days: ${days}`,
        `Preferences: ${JSON.stringify(trip.preferences || {})}`,
        `Known attractions: ${JSON.stringify(attractions.slice(0, 8))}`,
        `Known restaurants: ${JSON.stringify(restaurants.slice(0, 6))}`,
        `Weather: ${JSON.stringify(weather)}`,
        'Return JSON with shape {"itinerary":[{"day":1,"dateLabel":"Day 1","activities":[{"time":"09:00 AM","name":"...","location":"...","duration":"2h","cost":0,"status":"proposed"}]}],"aiSuggestions":[{"title":"...","description":"...","status":"pending"}],"insights":["..."]}',
      ].join("\n\n");

      const rawResult = await this.llmService.chat([
        {
          role: "system",
          content:
            "You are a travel planning agent. Return valid JSON only, no markdown fences.",
        },
        { role: "user", content: prompt },
      ]);

      const raw = rawResult.content;

      if (!raw) {
        return fallbackDraft;
      }

      const parsed = this.extractJson(raw) as
        | {
            itinerary?: Array<{
              day: number;
              dateLabel: string;
              activities: Array<{
                time: string;
                name: string;
                location?: string;
                duration?: string;
                cost?: number;
                status?: string;
              }>;
            }>;
            aiSuggestions?: Array<{ title: string; description: string; status?: string }>;
            insights?: string[];
          }
        | null;

      if (!parsed?.itinerary?.length) {
        return fallbackDraft;
      }

      return {
        itinerary: parsed.itinerary.map((day, dayIndex) => ({
          day: day.day || dayIndex + 1,
          dateLabel: day.dateLabel || `Day ${dayIndex + 1}`,
          activities: (day.activities || []).map((activity, activityIndex) => ({
            id: `activity_${Date.now()}_${dayIndex}_${activityIndex}`,
            dayNumber: day.day || dayIndex + 1,
            time: activity.time || "9:00 AM",
            name: activity.name || `Activity ${activityIndex + 1}`,
            location: activity.location || trip.destination,
            duration: activity.duration || "2h",
            cost: Number(activity.cost || 0),
            status: this.normalizeActivityStatus(activity.status),
            votes: { for: 0, against: 0, userVote: 0 },
            comments: [],
          })),
        })),
        aiSuggestions:
          parsed.aiSuggestions?.map((suggestion, index) => ({
            id: `ai_${Date.now()}_${index}`,
            title: suggestion.title,
            description: suggestion.description,
            status: "pending",
          })) || fallbackDraft.aiSuggestions,
        insights: parsed.insights || fallbackDraft.insights,
        weather,
        attractions,
      };
    } catch {
      return fallbackDraft;
    }
  }

  async buildOnTripSnapshot(trip: any) {
    const currentDayNumber =
      trip.itinerary.findIndex((day: any) =>
        day.activities.some((activity: any) => activity.status !== "completed"),
      ) + 1 || 1;
    const today = trip.itinerary[currentDayNumber - 1] || trip.itinerary[0] || null;
    const weather = trip?.destination
      ? await this.amapService.getWeather(trip.destination)
      : null;

    let routePlan = null;
    if (today?.activities?.length >= 2) {
      const firstPending = today.activities.find((activity: any) => activity.status !== "completed");
      const nextPending = today.activities.find(
        (activity: any) => activity.id !== firstPending?.id && activity.status !== "completed",
      );
      if (firstPending && nextPending) {
        routePlan = await this.amapService.compareRoutes(
          `${trip.destination} ${firstPending.location || firstPending.name}`,
          `${trip.destination} ${nextPending.location || nextPending.name}`,
          trip.destination,
        );
      }
    }

    const replanPrompt = [
      `Trip destination: ${trip.destination}`,
      `Today activities: ${JSON.stringify(today?.activities || [])}`,
      `Weather: ${JSON.stringify(weather)}`,
      "Give one concise daily replan suggestion in plain text.",
    ].join("\n\n");

    const aiSuggestion =
      ((await this.llmService.chat([
        {
          role: "system",
          content: "You are a travel operations assistant. Be concise and practical.",
        },
        { role: "user", content: replanPrompt },
      ])).content) ||
      this.buildFallbackOnTripSuggestion(weather);

    return {
      currentDay: currentDayNumber,
      today,
      weather,
      routePlan,
      replanSuggestion: aiSuggestion,
    };
  }

  private resolveDestination(message: string, context: AgentContext) {
    if (context.destination) {
      return String(context.destination);
    }

    const tripDestination =
      typeof context.trip === "object" && context.trip && "destination" in context.trip
        ? (context.trip as { destination?: string }).destination
        : undefined;
    if (tripDestination) {
      return tripDestination;
    }

    const directMatch = message.match(/\bto\s+([A-Z][a-zA-Z\s]+)\b/);
    if (directMatch?.[1]) {
      return directMatch[1].trim();
    }

    const chineseCityMatch = message.match(
      /(北京|上海|广州|深圳|杭州|成都|重庆|西安|南京|苏州|青岛|三亚|香港|澳门)/,
    );
    return chineseCityMatch?.[1];
  }

  private buildFallbackReply(
    message: string,
    toolResults: any,
    context: AgentContext,
  ) {
    const lines = [
      `I can help with ${context.tripName || toolResults.destination || "your trip"}.`,
    ];

    if (toolResults.weather && typeof toolResults.weather === "object") {
      const weather = toolResults.weather as {
        city?: string;
        weather?: string;
        temperature?: string;
      };
      lines.push(
        `Current weather for ${weather.city || toolResults.destination}: ${weather.weather || "unknown"}, ${weather.temperature || "N/A"}°C.`,
      );
    }

    if (toolResults.attractions.length) {
      lines.push(
        `Top attraction ideas: ${toolResults.attractions
          .slice(0, 3)
          .map((item: any) => item.name)
          .filter(Boolean)
          .join(", ")}.`,
      );
    }

    if (toolResults.restaurants.length) {
      lines.push(
        `Food options to explore: ${toolResults.restaurants
          .slice(0, 3)
          .map((item: any) => item.name)
          .filter(Boolean)
          .join(", ")}.`,
      );
    }

    if (toolResults.routeComparison?.recommended) {
      lines.push(
        `Fastest route looks like ${toolResults.routeComparison.recommended.mode} at about ${toolResults.routeComparison.recommended.duration}.`,
      );
    }

    lines.push(`Original request: ${message}`);
    lines.push("Live LLM output is unavailable, so this is a data-assisted fallback summary.");

    return lines.join("\n");
  }

  private buildFallbackDraft(
    trip: {
      destination: string;
      preferences?: { interests?: string[]; pace?: string };
    },
    days: number,
    attractions: Array<{ name?: string; address?: string }>,
    restaurants: Array<{ name?: string; address?: string }>,
    weather: unknown,
  ) {
    const pool = attractions.length
      ? attractions
      : [{ name: `${trip.destination} city walk`, address: trip.destination }];
    const itinerary = Array.from({ length: days }, (_, dayIndex) => {
      const primary = pool[dayIndex % pool.length];
      const lunch = restaurants[dayIndex % Math.max(restaurants.length, 1)];
      return {
        day: dayIndex + 1,
        dateLabel: `Day ${dayIndex + 1}`,
        activities: [
          {
            id: `activity_${Date.now()}_${dayIndex}_0`,
            dayNumber: dayIndex + 1,
            time: "9:00 AM",
            name: primary?.name || `${trip.destination} highlight`,
            location: primary?.address || trip.destination,
            duration: trip.preferences?.pace === "active" ? "3h" : "2h",
            cost: 0,
            status: "proposed",
            votes: { for: 0, against: 0, userVote: 0 },
            comments: [],
          },
          {
            id: `activity_${Date.now()}_${dayIndex}_1`,
            dayNumber: dayIndex + 1,
            time: "1:00 PM",
            name: lunch?.name || `${trip.destination} local lunch`,
            location: lunch?.address || trip.destination,
            duration: "1.5h",
            cost: 25,
            status: "proposed",
            votes: { for: 0, against: 0, userVote: 0 },
            comments: [],
          },
        ],
      };
    });

    const weatherText =
      weather && typeof weather === "object"
        ? `${(weather as any).weather || "Unknown"} ${(weather as any).temperature || ""}`.trim()
        : "Weather unavailable";

    return {
      itinerary,
      aiSuggestions: [
        {
          id: `ai_${Date.now()}_0`,
          title: "Keep the first day flexible",
          description: "Use a lighter opening schedule so the group can adapt after arrival.",
          status: "pending",
        },
        {
          id: `ai_${Date.now()}_1`,
          title: "Balance sightseeing with food stops",
          description: "I added a meal anchor each day to keep coordination easier for the group.",
          status: "pending",
        },
      ],
      insights: [
        `Weather context: ${weatherText}`,
        `Interests considered: ${(trip.preferences?.interests || []).join(", ") || "general travel"}`,
      ],
      weather,
      attractions,
    };
  }

  private buildFallbackOnTripSuggestion(weather: any) {
    if (weather?.weather && `${weather.weather}`.includes("雨")) {
      return "Rain is expected. Move indoor activities earlier and keep a flexible buffer before evening travel.";
    }
    if (weather?.weather && `${weather.weather}`.toLowerCase().includes("rain")) {
      return "Rain is expected. Shift indoor stops earlier and leave extra transit buffer this afternoon.";
    }
    return "The day looks manageable. Keep one flexible slot open so the group can adjust based on pace and queue times.";
  }

  private getTripDayCount(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.max(0, end.getTime() - start.getTime());
    return Math.max(1, Math.round(diff / 86400000) + 1);
  }

  private extractJson(content: string) {
    const trimmed = content.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      return JSON.parse(trimmed);
    }

    const match = trimmed.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  }

  private normalizeActivityStatus(status?: string) {
    if (status === "accepted" || status === "completed" || status === "in_discussion") {
      return status;
    }
    return "proposed";
  }
}
