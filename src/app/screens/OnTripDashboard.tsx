import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Globe,
  MapPin,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";
import { StatusChip } from "../components/helloworld/StatusChip";
import type { OnTripTodayResponse, Trip } from "@/domain/types";
import { travelApi } from "@/lib/api/travelApi";
import { getTripAiSessionId, setTripAiSessionId } from "@/lib/aiSession";

interface OnTripDashboardProps {
  onNavigate: (page: string) => void;
  trip?: Trip;
  todayData?: OnTripTodayResponse;
  onCheckIn?: (activityId: string) => void;
  checkingIn?: boolean;
}

export function OnTripDashboard({
  onNavigate,
  trip,
  todayData,
  onCheckIn,
  checkingIn = false,
}: OnTripDashboardProps) {
  const [aiInput, setAiInput] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>(() => getTripAiSessionId(trip?.id));
  const [aiReply, setAiReply] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const todayActivities =
    todayData?.today?.activities.map((activity, index) => ({
      id: activity.id,
      time: activity.time,
      name: activity.name,
      location: activity.location || trip?.destination || "Trip destination",
      status:
        activity.status === "completed"
          ? ("completed" as const)
          : index === 0
            ? ("current" as const)
            : ("upcoming" as const),
      duration: activity.duration || "2h",
    })) || [];

  const tripProgress = {
    currentDay: todayData?.currentDay || 1,
    totalDays: trip?.itinerary.length || 1,
    completedActivities:
      trip?.itinerary.flatMap((day) => day.activities).filter((activity) => activity.status === "completed").length || 0,
    totalActivities: trip?.itinerary.flatMap((day) => day.activities).length || 0,
    budgetUsed: trip?.expenses.reduce((sum, expense) => sum + expense.amount, 0) || 0,
    totalBudget: trip?.preferences.budgetMax || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-neutral-900">{trip?.name || "On Trip"}</h1>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{todayData?.today?.dateLabel || trip?.startDate || "Today"}</span>
                  <span>·</span>
                  <StatusChip status="in_trip" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {(trip?.members || []).slice(0, 4).map((member) => (
                  <div key={member.id} className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success-500 rounded-full border-2 border-white" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-1">Day {tripProgress.currentDay} - On Trip</h2>
                  <p className="text-neutral-600">{trip?.destination || "Traveling"} · live operations view</p>
                </div>
              </div>
              <div className="px-5 py-2.5 bg-success-100 border border-success-300 rounded-lg">
                <span className="text-sm font-semibold text-success-700">In Progress</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-neutral-900">Today's Activities</h3>
              <div className="text-sm text-neutral-600">
                {todayActivities.filter((activity) => activity.status === "completed").length} of {todayActivities.length} completed
              </div>
            </div>

            <div className="space-y-4">
              {todayActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`bg-white rounded-xl p-6 border transition-all ${
                    activity.status === "current"
                      ? "border-primary-300 shadow-lg ring-2 ring-primary-100"
                      : activity.status === "completed"
                        ? "border-neutral-200 opacity-75"
                        : "border-neutral-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-neutral-400" />
                          <span className="text-sm font-medium text-neutral-600">{activity.time}</span>
                        </div>
                        {activity.status === "completed" && <CheckCircle className="w-5 h-5 text-success-600" />}
                        {activity.status === "current" && (
                          <div className="px-3 py-1 bg-primary-100 rounded-full">
                            <span className="text-xs font-semibold text-primary-700">Now</span>
                          </div>
                        )}
                      </div>
                      <h4 className="text-lg font-semibold text-neutral-900 mb-1">{activity.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span>{activity.location}</span>
                        </div>
                        <span>·</span>
                        <span>{activity.duration}</span>
                      </div>
                    </div>
                    {activity.status !== "completed" && (
                      <button
                        onClick={() => onCheckIn?.(activity.id)}
                        disabled={checkingIn}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                          activity.status === "current"
                            ? "bg-primary text-white hover:bg-primary-600"
                            : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                        } disabled:opacity-50`}
                      >
                        {activity.status === "current" ? "Check In" : "Mark Done"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <h4 className="font-semibold text-neutral-900 mb-4">Day Summary</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="text-2xl font-bold text-neutral-900 mb-1">{todayActivities.length}</div>
                  <div className="text-sm text-neutral-600">Activities</div>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="text-2xl font-bold text-neutral-900 mb-1">
                    ${trip?.expenses.reduce((sum, expense) => sum + expense.amount, 0) || 0}
                  </div>
                  <div className="text-sm text-neutral-600">Spent So Far</div>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="text-2xl font-bold text-neutral-900 mb-1">
                    {todayData?.routePlan?.recommended?.duration || "N/A"}
                  </div>
                  <div className="text-sm text-neutral-600">Recommended Transit</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-xl p-5 border border-purple-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-purple-900 mb-1">AI Daily Replan</h4>
                  <p className="text-xs text-purple-700">
                    {todayData?.weather
                      ? `${todayData.weather.city || trip?.destination}: ${todayData.weather.weather || "Unknown"} ${todayData.weather.temperature || ""}°C`
                      : "Live weather unavailable"}
                  </p>
                </div>
              </div>
              <p className="text-sm text-neutral-700 mb-4">
                {todayData?.replanSuggestion || "Ask AI to reshuffle today's plan if pace, queues, or weather changes."}
              </p>
              {todayData?.routePlan?.recommended && (
                <div className="mb-4 rounded-lg bg-white/70 border border-purple-200 p-3">
                  <div className="text-xs text-purple-700 mb-1">Recommended route</div>
                  <div className="text-sm font-medium text-neutral-800">
                    {todayData.routePlan.recommended.mode} · {todayData.routePlan.recommended.distance} · {todayData.routePlan.recommended.duration}
                  </div>
                </div>
              )}
              <div className="pt-3 border-t border-purple-200">
                <div className="relative">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask AI to adjust today's plan..."
                    className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-purple-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={async () => {
                      if (!aiInput.trim()) return;
                      setAiLoading(true);
                      try {
                        const response = await travelApi.chatWithAssistant({
                          message: aiInput,
                          sessionId: sessionId || getTripAiSessionId(trip?.id),
                          context: {
                            tripId: trip?.id,
                            tripName: trip?.name,
                            destination: trip?.destination,
                            startDate: trip?.startDate,
                            endDate: trip?.endDate,
                            preferences: trip?.preferences,
                            todayActivities: todayData?.today?.activities || [],
                          },
                        });
                        setSessionId(response.sessionId);
                        setTripAiSessionId(trip?.id, response.sessionId);
                        setAiReply(response.reply);
                        setAiInput("");
                      } finally {
                        setAiLoading(false);
                      }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-md transition-all disabled:opacity-50"
                    disabled={!aiInput.trim() || aiLoading}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                {aiReply && (
                  <div className="mt-3 rounded-lg bg-white/70 border border-purple-200 p-3">
                    <div className="text-xs font-semibold text-purple-700 mb-1">Latest AI response</div>
                    <div className="text-sm text-neutral-700 whitespace-pre-wrap">{aiReply}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-neutral-200">
              <h4 className="font-semibold text-neutral-900 mb-4">Trip Progress</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600">Days</span>
                    <span className="text-sm font-semibold text-neutral-900">
                      {tripProgress.currentDay} / {tripProgress.totalDays}
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-primary-400" style={{ width: `${(tripProgress.currentDay / Math.max(1, tripProgress.totalDays)) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600">Activities</span>
                    <span className="text-sm font-semibold text-neutral-900">
                      {tripProgress.completedActivities} / {tripProgress.totalActivities}
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-success-500 to-success-400" style={{ width: `${(tripProgress.completedActivities / Math.max(1, tripProgress.totalActivities)) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600">Budget</span>
                    <span className="text-sm font-semibold text-neutral-900">
                      ${tripProgress.budgetUsed} / ${tripProgress.totalBudget}
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-primary-400" style={{ width: `${(tripProgress.budgetUsed / Math.max(1, tripProgress.totalBudget || 1)) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-neutral-200">
              <h4 className="font-semibold text-neutral-900 mb-4">Team Activity</h4>
              <div className="space-y-3">
                {(trip?.activityFeed || []).slice(0, 4).map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white text-xs font-semibold">
                      {activity.user.charAt(0)}
                    </div>
                    <span className="text-neutral-700">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between">
          <button
            onClick={() => onNavigate("workspace")}
            className="px-6 py-3 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
          >
            View Full Plan
          </button>
          <button
            onClick={() => onNavigate("expense")}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-600 transition-colors shadow-sm flex items-center gap-2"
          >
            Track Expenses
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
