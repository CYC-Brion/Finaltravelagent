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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const amap_service_1 = require("./amap.service");
const llm_service_1 = require("./llm.service");
let AiService = class AiService {
    constructor(amapService, llmService) {
        this.amapService = amapService;
        this.llmService = llmService;
        this.sessions = new Map();
    }
    async chat(message, sessionId, context = {}) {
        const activeSessionId = sessionId || `session_${Date.now()}`;
        const history = this.sessions.get(activeSessionId) || [];
        const destination = this.resolveDestination(message, context);
        const [weather, attractions, restaurants, routeComparison] = await Promise.all([
            destination ? this.amapService.getWeather(destination) : Promise.resolve(null),
            destination
                ? this.amapService.searchPlaces(destination, `${destination} attractions`)
                : Promise.resolve([]),
            destination
                ? this.amapService.searchPlaces(destination, `${destination} restaurants`)
                : Promise.resolve([]),
            context.origin && context.destinationAddress
                ? this.amapService.compareRoutes(String(context.origin), String(context.destinationAddress), destination)
                : Promise.resolve(null),
        ]);
        const toolResults = {
            amapConfigured: this.amapService.isConfigured(),
            llmConfigured: this.llmService.isConfigured(),
            destination,
            weather,
            attractions,
            restaurants,
            routeComparison,
        };
        const systemPrompt = [
            "You are TravelPal's collaborative AI travel agent.",
            "Answer in concise, practical English unless the user writes mostly Chinese, then answer in Chinese.",
            "Use the provided live map and weather data when available.",
            "Prefer actionable planning advice over generic inspiration.",
        ].join(" ");
        const userPrompt = [
            `User request: ${message}`,
            `Trip context: ${JSON.stringify(context)}`,
            `Tool results: ${JSON.stringify(toolResults)}`,
            "Give a practical response with short sections when useful. Mention when data is inferred or unavailable.",
        ].join("\n\n");
        const llmMessages = [
            { role: "system", content: systemPrompt },
            ...history.slice(-6).map((item) => ({
                role: item.role === "assistant" ? "assistant" : "user",
                content: item.content,
            })),
            { role: "user", content: userPrompt },
        ];
        let reply = (await this.llmService.chat(llmMessages)) || "";
        if (!reply) {
            reply = this.buildFallbackReply(message, toolResults, context);
        }
        const nextHistory = [
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
    getHistory(sessionId) {
        return {
            sessionId,
            history: this.sessions.get(sessionId) || [],
        };
    }
    clearSession(sessionId) {
        this.sessions.delete(sessionId);
        return {
            success: true,
            sessionId,
        };
    }
    async generateTripDraft(trip) {
        const days = this.getTripDayCount(trip.startDate, trip.endDate);
        const attractions = await this.amapService.searchPlaces(trip.destination, `${trip.destination} ${trip.preferences?.interests?.join(" ") || "attractions"}`);
        const restaurants = await this.amapService.searchPlaces(trip.destination, `${trip.destination} restaurants`);
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
            const raw = await this.llmService.chat([
                {
                    role: "system",
                    content: "You are a travel planning agent. Return valid JSON only, no markdown fences.",
                },
                { role: "user", content: prompt },
            ]);
            if (!raw) {
                return fallbackDraft;
            }
            const parsed = this.extractJson(raw);
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
                aiSuggestions: parsed.aiSuggestions?.map((suggestion, index) => ({
                    id: `ai_${Date.now()}_${index}`,
                    title: suggestion.title,
                    description: suggestion.description,
                    status: "pending",
                })) || fallbackDraft.aiSuggestions,
                insights: parsed.insights || fallbackDraft.insights,
                weather,
                attractions,
            };
        }
        catch {
            return fallbackDraft;
        }
    }
    async buildOnTripSnapshot(trip) {
        const currentDayNumber = trip.itinerary.findIndex((day) => day.activities.some((activity) => activity.status !== "completed")) + 1 || 1;
        const today = trip.itinerary[currentDayNumber - 1] || trip.itinerary[0] || null;
        const weather = trip?.destination
            ? await this.amapService.getWeather(trip.destination)
            : null;
        let routePlan = null;
        if (today?.activities?.length >= 2) {
            const firstPending = today.activities.find((activity) => activity.status !== "completed");
            const nextPending = today.activities.find((activity) => activity.id !== firstPending?.id && activity.status !== "completed");
            if (firstPending && nextPending) {
                routePlan = await this.amapService.compareRoutes(`${trip.destination} ${firstPending.location || firstPending.name}`, `${trip.destination} ${nextPending.location || nextPending.name}`, trip.destination);
            }
        }
        const replanPrompt = [
            `Trip destination: ${trip.destination}`,
            `Today activities: ${JSON.stringify(today?.activities || [])}`,
            `Weather: ${JSON.stringify(weather)}`,
            "Give one concise daily replan suggestion in plain text.",
        ].join("\n\n");
        const aiSuggestion = (await this.llmService.chat([
            {
                role: "system",
                content: "You are a travel operations assistant. Be concise and practical.",
            },
            { role: "user", content: replanPrompt },
        ])) ||
            this.buildFallbackOnTripSuggestion(weather);
        return {
            currentDay: currentDayNumber,
            today,
            weather,
            routePlan,
            replanSuggestion: aiSuggestion,
        };
    }
    resolveDestination(message, context) {
        if (context.destination) {
            return String(context.destination);
        }
        const tripDestination = typeof context.trip === "object" && context.trip && "destination" in context.trip
            ? context.trip.destination
            : undefined;
        if (tripDestination) {
            return tripDestination;
        }
        const directMatch = message.match(/\bto\s+([A-Z][a-zA-Z\s]+)\b/);
        if (directMatch?.[1]) {
            return directMatch[1].trim();
        }
        const chineseCityMatch = message.match(/(北京|上海|广州|深圳|杭州|成都|重庆|西安|南京|苏州|青岛|三亚|香港|澳门)/);
        return chineseCityMatch?.[1];
    }
    buildFallbackReply(message, toolResults, context) {
        const lines = [
            `I can help with ${context.tripName || toolResults.destination || "your trip"}.`,
        ];
        if (toolResults.weather && typeof toolResults.weather === "object") {
            const weather = toolResults.weather;
            lines.push(`Current weather for ${weather.city || toolResults.destination}: ${weather.weather || "unknown"}, ${weather.temperature || "N/A"}°C.`);
        }
        if (toolResults.attractions.length) {
            lines.push(`Top attraction ideas: ${toolResults.attractions
                .slice(0, 3)
                .map((item) => item.name)
                .filter(Boolean)
                .join(", ")}.`);
        }
        if (toolResults.restaurants.length) {
            lines.push(`Food options to explore: ${toolResults.restaurants
                .slice(0, 3)
                .map((item) => item.name)
                .filter(Boolean)
                .join(", ")}.`);
        }
        if (toolResults.routeComparison?.recommended) {
            lines.push(`Fastest route looks like ${toolResults.routeComparison.recommended.mode} at about ${toolResults.routeComparison.recommended.duration}.`);
        }
        lines.push(`Original request: ${message}`);
        lines.push("Live LLM output is unavailable, so this is a data-assisted fallback summary.");
        return lines.join("\n");
    }
    buildFallbackDraft(trip, days, attractions, restaurants, weather) {
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
        const weatherText = weather && typeof weather === "object"
            ? `${weather.weather || "Unknown"} ${weather.temperature || ""}`.trim()
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
    buildFallbackOnTripSuggestion(weather) {
        if (weather?.weather && `${weather.weather}`.includes("雨")) {
            return "Rain is expected. Move indoor activities earlier and keep a flexible buffer before evening travel.";
        }
        if (weather?.weather && `${weather.weather}`.toLowerCase().includes("rain")) {
            return "Rain is expected. Shift indoor stops earlier and leave extra transit buffer this afternoon.";
        }
        return "The day looks manageable. Keep one flexible slot open so the group can adjust based on pace and queue times.";
    }
    getTripDayCount(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diff = Math.max(0, end.getTime() - start.getTime());
        return Math.max(1, Math.round(diff / 86400000) + 1);
    }
    extractJson(content) {
        const trimmed = content.trim();
        if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
            return JSON.parse(trimmed);
        }
        const match = trimmed.match(/\{[\s\S]*\}/);
        return match ? JSON.parse(match[0]) : null;
    }
    normalizeActivityStatus(status) {
        if (status === "accepted" || status === "completed" || status === "in_discussion") {
            return status;
        }
        return "proposed";
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [amap_service_1.AmapService,
        llm_service_1.LlmService])
], AiService);
//# sourceMappingURL=ai.service.js.map