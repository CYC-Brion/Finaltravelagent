import { Globe, Sparkles, ArrowLeft, Clock, MapPin, DollarSign, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { AIActionPanel } from "../components/helloworld/AIActionPanel";
import { AISuggestionChip } from "../components/helloworld/AISuggestionChip";
import { DiffCard } from "../components/helloworld/DiffCard";
import type { Trip } from "@/domain/types";
import { travelApi } from "@/lib/api/travelApi";
import { useRespondToSuggestion } from "../hooks/useTrips";

interface AIAssistantProps {
  onBack: () => void;
  trip?: Trip;
}

type ToolCallStatus = {
  tool: string;
  status: "calling" | "done";
  result?: unknown;
};

const TOOL_LABELS: Record<string, string> = {
  get_weather: "查询天气",
  search_attractions: "搜索景点",
  search_restaurants: "搜索餐厅",
  search_hotels: "搜索酒店",
  compare_routes: "比较路线",
};

export function AIAssistant({ onBack, trip }: AIAssistantProps) {
  const [showDiff, setShowDiff] = useState(true);
  const [sessionId, setSessionId] = useState<string>();
  const [assistantReply, setAssistantReply] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [toolCalls, setToolCalls] = useState<ToolCallStatus[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [agentMeta, setAgentMeta] = useState<{
    weather?: string;
    recommendedRoute?: string;
  }>({});
  const abortControllerRef = useRef<AbortController | null>(null);
  const respondToSuggestion = useRespondToSuggestion(trip?.id || "");

  const handleAskAi = async (prompt: string) => {
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setAssistantReply("");
    setToolCalls([]);
    setCurrentStatus("正在思考...");
    setAgentMeta({});

    try {
      const newSessionId = sessionId || `session_${Date.now()}`;

      await travelApi.chatWithAssistantStream({
        input: {
          message: prompt,
          sessionId: newSessionId,
          context: trip
            ? {
                tripId: trip.id,
                tripName: trip.name,
                destination: trip.destination,
                startDate: trip.startDate,
                endDate: trip.endDate,
              }
            : undefined,
        },
        callbacks: {
          onToolCall: (tool, args) => {
            setToolCalls((prev) => [...prev, { tool, status: "calling" }]);
            setCurrentStatus(`正在${TOOL_LABELS[tool] || tool}...`);
          },
          onToolResult: (tool, result) => {
            setToolCalls((prev) =>
              prev.map((tc) =>
                tc.tool === tool && tc.status === "calling"
                  ? { ...tc, status: "done", result }
                  : tc
              )
            );

            // Update agentMeta with tool results
            if (tool === "get_weather" && result && typeof result === "object") {
              const weather = result as { city?: string; weather?: string; temperature?: string };
              setAgentMeta((prev) => ({
                ...prev,
                weather: `${weather.city || trip?.destination}: ${weather.weather || "Unknown"}, ${weather.temperature || "N/A"}°C`,
              }));
            }
            if (tool === "compare_routes" && result && typeof result === "object") {
              const routes = result as { recommended?: { mode?: string; duration?: string } };
              if (routes.recommended) {
                setAgentMeta((prev) => ({
                  ...prev,
                  recommendedRoute: `${routes.recommended.mode || "route"} · ${routes.recommended.duration || "N/A"}`,
                }));
              }
            }
          },
          onChunk: (content) => {
            setAssistantReply(content);
            setCurrentStatus("AI思考中...");
          },
          onDone: () => {
            setSessionId(newSessionId);
            setCurrentStatus("");
          },
          onError: (error) => {
            console.error("Stream error:", error);
            setCurrentStatus(`错误: ${error}`);
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-purple-50/30">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to workspace</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-sm font-semibold text-neutral-900">{trip?.name || "Tokyo Adventure"}</span>
                <p className="text-xs text-neutral-500">{trip ? `${trip.startDate} - ${trip.endDate}` : "April 15-22, 2026"}</p>
              </div>
            </div>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">AI Assistant</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Let AI help optimize your itinerary, find alternatives, and solve planning challenges
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: MapPin, label: "Optimize route", desc: "Minimize travel time between activities" },
              { icon: DollarSign, label: "Balance budget", desc: "Find cost-effective alternatives" },
              { icon: Clock, label: "Add buffer time", desc: "Insert rest periods automatically" },
              { icon: Sparkles, label: "Find alternatives", desc: "Suggest similar activities" },
              { icon: MapPin, label: "Handle conflicts", desc: "Resolve scheduling issues" },
              { icon: DollarSign, label: "Split by interest", desc: "Create parallel tracks" },
            ].map((action, i) => (
              <button
                key={i}
                className="p-5 bg-white rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all text-left"
              >
                <action.icon className="w-6 h-6 text-primary-600 mb-3" />
                <h3 className="font-semibold text-neutral-900 mb-1">{action.label}</h3>
                <p className="text-xs text-neutral-600">{action.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Active Suggestions */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Active Suggestions</h2>
          <div className="space-y-4">
            {(trip?.aiSuggestions.length
              ? trip.aiSuggestions
              : [
                  {
                    id: "fallback-1",
                    title: "Optimize Day 2 route",
                    description: "Reorder activities to save 45 minutes of travel time and visit Tsukiji Market first when it's most active",
                  },
                  {
                    id: "fallback-2",
                    title: "Add rest periods",
                    description: "Your team prefers moderate pace. Consider adding 30-minute breaks between morning activities on Days 1, 3, and 5",
                  },
                  {
                    id: "fallback-3",
                    title: "Budget optimization",
                    description: "Replace 'Ginza Shopping' with 'Nakamise Shopping Street' to save $70/person while maintaining cultural experience",
                  },
                ]).map((suggestion) => (
              <AISuggestionChip
                key={suggestion.id}
                title={suggestion.title}
                description={suggestion.description}
                onAccept={() => {
                  setShowDiff(true);
                  if (trip?.id) {
                    respondToSuggestion.mutate({ suggestionId: suggestion.id, response: "accepted" });
                  }
                }}
                onReject={() => {
                  if (trip?.id) {
                    respondToSuggestion.mutate({ suggestionId: suggestion.id, response: "dismissed" });
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Itinerary Change Preview */}
        {showDiff && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Proposed Changes</h2>
            <DiffCard
              before={{
                title: "Current Day 2 Schedule",
                content: (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-neutral-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-neutral-900">9:00 AM - Imperial Palace</div>
                        <div className="text-xs text-neutral-500">2h visit • Free</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-neutral-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-neutral-900">12:00 PM - Tsukiji Market</div>
                        <div className="text-xs text-neutral-500">2h tour • $45/person</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-neutral-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-neutral-900">3:00 PM - Ginza Shopping</div>
                        <div className="text-xs text-neutral-500">3h • $100/person</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-neutral-200">
                      <div className="text-xs text-neutral-500">
                        Total travel time: <span className="font-semibold text-neutral-700">1h 15min</span>
                      </div>
                    </div>
                  </div>
                ),
              }}
              after={{
                title: "AI Optimized Schedule",
                content: (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-primary-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-primary-900">8:00 AM - Tsukiji Market</div>
                        <div className="text-xs text-primary-600">2h tour • $45/person</div>
                        <div className="text-xs text-success-700 mt-1">✓ Catch morning fish auction</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-primary-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-primary-900">10:30 AM - Imperial Palace</div>
                        <div className="text-xs text-primary-600">2h visit • Free</div>
                        <div className="text-xs text-success-700 mt-1">✓ Only 15min from Tsukiji</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-primary-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-primary-900">1:30 PM - Ginza Shopping</div>
                        <div className="text-xs text-primary-600">3h • $100/person</div>
                        <div className="text-xs text-success-700 mt-1">✓ Walking distance</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-primary-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-xs text-primary-700">
                          Total travel time: <span className="font-semibold">30min</span>
                        </div>
                        <div className="text-xs text-success-700">
                          ✓ Saves <span className="font-semibold">45 minutes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              }}
              onAccept={() => {
                setShowDiff(false);
                alert("Change accepted! Applied to Day 2.");
              }}
              onReject={() => setShowDiff(false)}
            />
          </div>
        )}

        {/* AI Chat Interface */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Ask AI</h2>
          <AIActionPanel
            onSubmit={handleAskAi}
            isLoading={isLoading}
            placeholder="Ask AI anything about your trip..."
            suggestions={[
              "Find vegetarian restaurants near Shibuya",
              "Suggest rainy day activities",
              "What's the best time to visit Tokyo Tower?",
              "Add a day trip to Hakone",
            ]}
          />

          {/* Streaming Status */}
          {(isLoading || currentStatus) && (
            <div className="mt-4 rounded-xl border border-primary-200 bg-primary-50/50 p-4">
              <div className="flex items-center gap-3 mb-3">
                <Loader2 className="w-4 h-4 text-primary-600 animate-spin" />
                <span className="text-sm font-medium text-primary-700">{currentStatus || "AI思考中..."}</span>
              </div>

              {/* Tool Calls Progress */}
              {toolCalls.length > 0 && (
                <div className="space-y-2">
                  {toolCalls.map((tc, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      {tc.status === "calling" ? (
                        <>
                          <Loader2 className="w-3 h-3 text-primary-500 animate-spin" />
                          <span className="text-neutral-600">正在{TOOL_LABELS[tc.tool] || tc.tool}...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-success-600">✓</span>
                          <span className="text-success-700">{TOOL_LABELS[tc.tool] || tc.tool}完成</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {(assistantReply || agentMeta.weather || agentMeta.recommendedRoute) && !isLoading && (
            <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-5 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-semibold text-neutral-900">Latest AI Response</h3>
                {sessionId && <span className="text-xs text-neutral-400">Session {sessionId}</span>}
              </div>
              {agentMeta.weather && (
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded text-xs text-blue-700">
                  <span>🌤️</span> <span>{agentMeta.weather}</span>
                </div>
              )}
              {agentMeta.recommendedRoute && (
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded text-xs text-green-700">
                  <span>🗺️</span> <span>{agentMeta.recommendedRoute}</span>
                </div>
              )}
              <div className="text-sm leading-6 text-neutral-700 whitespace-pre-wrap">{assistantReply}</div>
            </div>
          )}
        </div>

        {/* Recent AI Activity */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent AI Activity</h2>
          <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-200">
            {[
              { action: "Optimized route for Day 3", result: "Saved 30 minutes", time: "5 min ago", accepted: true },
              { action: "Suggested alternative to Robot Restaurant", result: "Found 3 options", time: "1 hour ago", accepted: false },
              { action: "Added buffer time to Day 1", result: "3 breaks inserted", time: "2 hours ago", accepted: true },
              { action: "Generated budget breakdown", result: "Per-person analysis", time: "3 hours ago", accepted: true },
            ].map((activity, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activity.accepted ? "bg-success-100" : "bg-neutral-100"
                }`}>
                  <Sparkles className={`w-5 h-5 ${activity.accepted ? "text-success-600" : "text-neutral-400"}`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-neutral-900 text-sm">{activity.action}</div>
                  <div className="text-xs text-neutral-500">{activity.result}</div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-medium mb-1 ${
                    activity.accepted ? "text-success-600" : "text-neutral-500"
                  }`}>
                    {activity.accepted ? "Accepted" : "Dismissed"}
                  </div>
                  <div className="text-xs text-neutral-400">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
