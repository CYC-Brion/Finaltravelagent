import { Globe, MapPin, Calendar, Users, Sparkles, CheckCircle, Clock, ArrowRight, TrendingUp, DollarSign, AlertCircle, Send } from "lucide-react";
import { useState } from "react";
import { StatusChip } from "../components/helloworld/StatusChip";

interface OnTripDashboardProps {
  onNavigate: (page: string) => void;
}

export function OnTripDashboard({ onNavigate }: OnTripDashboardProps) {
  const [showReplanSuggestion, setShowReplanSuggestion] = useState(true);
  const [aiInput, setAiInput] = useState("");

  const todayActivities = [
    { id: 1, time: "9:00 AM", name: "Meiji Shrine", location: "Shibuya", status: "completed" as const, duration: "2h" },
    { id: 2, time: "12:30 PM", name: "Lunch at Harajuku", location: "Harajuku", status: "current" as const, duration: "1.5h" },
    { id: 3, time: "3:00 PM", name: "teamLab Borderless", location: "Odaiba", status: "upcoming" as const, duration: "3h" },
    { id: 4, time: "7:00 PM", name: "Dinner at Shibuya", location: "Shibuya", status: "upcoming" as const, duration: "2h" },
  ];

  const tripProgress = {
    currentDay: 3,
    totalDays: 7,
    completedActivities: 5,
    totalActivities: 18,
    budgetUsed: 670,
    totalBudget: 2000,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-neutral-900">Tokyo Adventure</h1>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>April 17, 2026</span>
                  <span>•</span>
                  <StatusChip status="in_trip" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["A", "B", "C", "D"].map((letter, i) => (
                  <div key={i} className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
                      {letter}
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
        {/* Day Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-1">Day 3 - On Trip</h2>
                  <p className="text-neutral-600">April 17, 2026 • Tokyo, Japan</p>
                </div>
              </div>
              <div className="px-5 py-2.5 bg-success-100 border border-success-300 rounded-lg">
                <span className="text-sm font-semibold text-success-700">On Schedule</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main: Today's Activities */}
          <div className="col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-neutral-900">Today's Activities</h3>
              <div className="text-sm text-neutral-600">
                {todayActivities.filter(a => a.status === "completed").length} of {todayActivities.length} completed
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
                        {activity.status === "completed" && (
                          <CheckCircle className="w-5 h-5 text-success-600" />
                        )}
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
                        <span>•</span>
                        <span>{activity.duration}</span>
                      </div>
                    </div>
                    {activity.status === "upcoming" && (
                      <button className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium text-sm transition-colors">
                        Details
                      </button>
                    )}
                    {activity.status === "current" && (
                      <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary-600 transition-colors">
                        Check In
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Day Summary */}
            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <h4 className="font-semibold text-neutral-900 mb-4">Day Summary</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="text-2xl font-bold text-neutral-900 mb-1">4</div>
                  <div className="text-sm text-neutral-600">Activities</div>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="text-2xl font-bold text-neutral-900 mb-1">$280</div>
                  <div className="text-sm text-neutral-600">Budget Today</div>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="text-2xl font-bold text-neutral-900 mb-1">8h</div>
                  <div className="text-sm text-neutral-600">Total Time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Daily Replan */}
            {showReplanSuggestion && (
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-xl p-5 border border-purple-200">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-purple-900 mb-1">AI Daily Replan</h4>
                    <p className="text-xs text-purple-700">Weather update detected</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-700 mb-4">
                  Rain expected at 4 PM. Suggest moving indoor activities earlier to avoid delays.
                </p>
                <div className="flex gap-2 mb-4">
                  <button className="flex-1 px-3 py-2 bg-white border border-purple-200 rounded-lg text-sm font-medium text-purple-700 hover:bg-purple-50 transition-colors">
                    View Changes
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all">
                    Accept
                  </button>
                </div>

                {/* Quick Action Chips */}
                <div className="flex gap-2 mb-3">
                  {["Slow pace", "Add food stop", "Reduce budget"].map((chip) => (
                    <button
                      key={chip}
                      className="px-3 py-1.5 bg-white border border-purple-200 rounded-full text-xs font-medium text-purple-700 hover:bg-purple-50 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="pt-3 border-t border-purple-200">
                  <div className="relative">
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="Ask AI to adjust today's plan..."
                      className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-purple-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent text-sm transition-all placeholder:text-purple-400"
                    />
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!aiInput.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Trip Progress */}
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
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400"
                      style={{ width: `${(tripProgress.currentDay / tripProgress.totalDays) * 100}%` }}
                    />
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
                    <div
                      className="h-full bg-gradient-to-r from-success-500 to-success-400"
                      style={{ width: `${(tripProgress.completedActivities / tripProgress.totalActivities) * 100}%` }}
                    />
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
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400"
                      style={{ width: `${(tripProgress.budgetUsed / tripProgress.totalBudget) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-5 border border-neutral-200">
              <h4 className="font-semibold text-neutral-900 mb-4">Quick Stats</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Team Active</span>
                  <span className="font-semibold text-primary-600">4/4</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Photos Today</span>
                  <span className="font-semibold text-neutral-900">23</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Expenses Logged</span>
                  <span className="font-semibold text-neutral-900">4</span>
                </div>
              </div>
            </div>

            {/* Team Activity */}
            <div className="bg-white rounded-xl p-5 border border-neutral-200">
              <h4 className="font-semibold text-neutral-900 mb-4">Team Activity</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white text-xs font-semibold">
                    A
                  </div>
                  <span className="text-neutral-700">Alice checked in at Meiji Shrine</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white text-xs font-semibold">
                    B
                  </div>
                  <span className="text-neutral-700">Bob added 8 photos</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white text-xs font-semibold">
                    C
                  </div>
                  <span className="text-neutral-700">Carol logged lunch expense</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
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
