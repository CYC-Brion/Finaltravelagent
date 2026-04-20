import { Globe, Users, DollarSign, Clock, MapPin, MessageSquare, ThumbsUp, ThumbsDown, Sparkles, Plus, AlertCircle, CheckCircle, Send, History, Filter } from "lucide-react";
import { useState } from "react";
import { VoteControl } from "../components/helloworld/VoteControl";
import { StatusChip } from "../components/helloworld/StatusChip";

interface CoCreateWorkspaceProps {
  onNavigate: (page: string) => void;
}

export function CoCreateWorkspace({ onNavigate }: CoCreateWorkspaceProps) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [aiMessage, setAiMessage] = useState("");

  const unresolvedItems = [
    { id: 1, name: "Ginza Shopping", votes: { for: 2, against: 2 }, comments: 3 },
    { id: 2, name: "Robot Restaurant", votes: { for: 1, against: 3 }, comments: 5 },
    { id: 3, name: "Mount Fuji Day Trip", votes: { for: 3, against: 1 }, comments: 7 },
  ];

  const days = [
    { day: 1, activities: [
      { id: 1, time: "8:30 AM", name: "Senso-ji Temple", status: "accepted" as const, votes: { for: 4, against: 0 } },
      { id: 2, time: "11:00 AM", name: "Tokyo Skytree", status: "accepted" as const, votes: { for: 4, against: 0 } },
    ]},
    { day: 2, activities: [
      { id: 3, time: "9:00 AM", name: "Tsukiji Fish Market", status: "accepted" as const, votes: { for: 4, against: 0 } },
      { id: 4, time: "1:00 PM", name: "Imperial Palace Gardens", status: "accepted" as const, votes: { for: 3, against: 1 } },
    ]},
    { day: 3, activities: [
      { id: 5, time: "9:00 AM", name: "Meiji Shrine", status: "accepted" as const, votes: { for: 4, against: 0 } },
      { id: 6, time: "3:00 PM", name: "teamLab Borderless", status: "proposed" as const, votes: { for: 3, against: 0 } },
    ]},
    { day: 4, activities: [
      { id: 7, time: "10:00 AM", name: "Yoyogi Park", status: "accepted" as const, votes: { for: 4, against: 0 } },
      { id: 8, time: "1:00 PM", name: "Omotesando Shopping", status: "accepted" as const, votes: { for: 3, against: 1 } },
    ]},
    { day: 5, activities: [
      { id: 9, time: "6:00 AM", name: "Mount Fuji Day Trip", status: "accepted" as const, votes: { for: 4, against: 0 } },
      { id: 10, time: "4:00 PM", name: "Return to Tokyo", status: "accepted" as const, votes: { for: 4, against: 0 } },
    ]},
    { day: 6, activities: [
      { id: 11, time: "9:00 AM", name: "Shinjuku Gyoen Garden", status: "accepted" as const, votes: { for: 3, against: 1 } },
      { id: 12, time: "3:00 PM", name: "Tokyo Metropolitan Building", status: "accepted" as const, votes: { for: 4, against: 0 } },
    ]},
    { day: 7, activities: [
      { id: 13, time: "8:00 AM", name: "Odaiba Seaside Park", status: "accepted" as const, votes: { for: 4, against: 0 } },
      { id: 14, time: "2:00 PM", name: "Final Lunch at Toyosu", status: "accepted" as const, votes: { for: 3, against: 1 } },
    ]},
  ];

  const currentDay = days[selectedDay - 1] || days[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      {/* Top Sticky Bar */}
      <header className="border-b border-neutral-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-neutral-900">Tokyo Adventure</h1>
                  <p className="text-xs text-neutral-500">7 days • April 15-22, 2026</p>
                </div>
              </div>

              {/* Team Avatars */}
              <div className="flex items-center gap-3 pl-6 border-l border-neutral-200">
                <div className="flex -space-x-2">
                  {["A", "B", "C", "D"].map((letter, i) => (
                    <div key={i} className="relative">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
                        {letter}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success-500 rounded-full border-2 border-white" />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-neutral-600">4 online</span>
              </div>

              {/* Budget Progress */}
              <div className="flex items-center gap-3 pl-6 border-l border-neutral-200">
                <DollarSign className="w-4 h-4 text-neutral-400" />
                <div className="w-32">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-neutral-500">Budget</span>
                    <span className="text-xs font-semibold text-primary-600">48%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full w-[48%] bg-gradient-to-r from-primary-500 to-primary-400" />
                  </div>
                </div>
              </div>

              {/* Version */}
              <button className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors">
                <History className="w-4 h-4 text-neutral-600" />
                <span className="text-sm font-medium text-neutral-700">v12</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-warning-50 border border-warning-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-warning-600" />
                <span className="text-sm font-medium text-warning-700">3 unresolved</span>
              </div>
              <button
                onClick={() => onNavigate("ontrip")}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-600 transition-colors shadow-sm flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Finalize Plan
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3-Column Layout */}
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Decision Queue (3 cols) */}
          <div className="col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-neutral-900">Decision Queue</h2>
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Filter className="w-4 h-4 text-neutral-600" />
              </button>
            </div>

            {/* Unresolved Items */}
            <div className="space-y-3">
              {unresolvedItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-4 border border-warning-300 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900 text-sm mb-1">{item.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <MessageSquare className="w-3 h-3" />
                        <span>{item.comments} comments</span>
                      </div>
                    </div>
                    <AlertCircle className="w-4 h-4 text-warning-600 shrink-0" />
                  </div>

                  <div className="flex gap-2 mb-3">
                    <button className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {item.votes.for}
                    </button>
                    <button className="flex-1 px-3 py-2 bg-neutral-200 text-neutral-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                      <ThumbsDown className="w-3 h-3" />
                      {item.votes.against}
                    </button>
                  </div>

                  <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-warning-400"
                      style={{ width: `${(item.votes.for / (item.votes.for + item.votes.against)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Suggestions */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-neutral-700 mb-3">AI Suggestions</h3>
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-purple-900 font-medium mb-1">Add buffer time</p>
                      <p className="text-xs text-purple-700">Consider 30min breaks between morning activities</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-1.5 bg-white border border-purple-300 rounded-lg text-xs font-medium text-purple-700 hover:bg-purple-50">
                      Accept
                    </button>
                    <button className="flex-1 px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-50">
                      Dismiss
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-purple-900 font-medium mb-1">Alternative route</p>
                      <p className="text-xs text-purple-700">Visit Meiji Shrine before Harajuku to save time</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <button className="w-full mt-4 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Propose Activity
            </button>
          </div>

          {/* Center: Itinerary Board (6 cols) */}
          <div className="col-span-6 space-y-6">
            {/* Day Tabs */}
            <div className="bg-white rounded-xl border border-neutral-200 p-2 flex gap-2 overflow-x-auto">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                    selectedDay === day
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  Day {day}
                </button>
              ))}
            </div>

            {/* Day Overview */}
            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Day {selectedDay}</h2>
                  <p className="text-sm text-neutral-500">April {14 + selectedDay}, 2026</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-neutral-500">Consensus</div>
                    <div className="text-lg font-bold text-primary-600">85%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-neutral-500">Activities</div>
                    <div className="text-lg font-bold text-neutral-900">{currentDay.activities.length}</div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                {currentDay.activities.map((activity, i) => (
                  <div key={activity.id} className="relative">
                    {/* Timeline line */}
                    {i < currentDay.activities.length - 1 && (
                      <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-neutral-200" />
                    )}

                    <div className="bg-neutral-50 rounded-xl p-5 hover:shadow-md transition-shadow border border-neutral-200">
                      <div className="flex items-start gap-4">
                        {/* Time marker */}
                        <div className="shrink-0">
                          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center border-4 border-white shadow-sm">
                            <Clock className="w-5 h-5 text-primary-600" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-semibold text-neutral-700">{activity.time}</span>
                                <StatusChip status="in_discussion" />
                              </div>
                              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{activity.name}</h3>
                            </div>
                          </div>

                          {/* Vote controls */}
                          <div className="mt-4">
                            <VoteControl
                              voteFor={activity.votes.for}
                              voteAgainst={activity.votes.against}
                              userVote={activity.votes.for > 0 ? 1 : 0}
                              onVote={() => {}}
                            />
                          </div>

                          {/* Comments preview */}
                          <button className="mt-4 flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900">
                            <MessageSquare className="w-4 h-4" />
                            <span>5 comments</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add activity */}
                <button className="w-full p-5 border-2 border-dashed border-neutral-300 rounded-xl hover:border-primary-300 hover:bg-primary-50/50 transition-all flex items-center justify-center gap-2 text-neutral-600 hover:text-primary-600">
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Add activity to this day</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: AI + Team Panel (3 cols) */}
          <div className="col-span-3 space-y-6">
            {/* AI Assistant */}
            <div className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 rounded-xl border border-purple-200 overflow-hidden">
              <div className="p-4 bg-white/80 border-b border-purple-200/50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-purple-900">AI Assistant</h3>
                </div>
              </div>

              <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
                {/* AI Message */}
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className="text-sm text-purple-900">
                    I noticed 3 activities need consensus. Would you like me to suggest compromises?
                  </p>
                </div>

                {/* Quick actions */}
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs font-medium text-purple-700 hover:bg-purple-50">
                    Optimize route
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs font-medium text-purple-700 hover:bg-purple-50">
                    Find alternatives
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs font-medium text-purple-700 hover:bg-purple-50">
                    Balance budget
                  </button>
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-purple-200/50">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask AI..."
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-purple-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Team Activity */}
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-600" />
                Team Activity
              </h3>
              <div className="space-y-3">
                {[
                  { user: "Alice", action: "voted on Tokyo Tower", time: "2m ago" },
                  { user: "Bob", action: "commented on Ginza", time: "5m ago" },
                  { user: "Carol", action: "proposed Mount Fuji trip", time: "12m ago" },
                  { user: "David", action: "joined the trip", time: "1h ago" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                      {activity.user.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-900">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-neutral-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trip Stats */}
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <h3 className="font-semibold text-neutral-900 mb-4">Trip Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Total activities</span>
                  <span className="text-sm font-semibold text-neutral-900">18</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Consensus reached</span>
                  <span className="text-sm font-semibold text-success-600">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Needs voting</span>
                  <span className="text-sm font-semibold text-warning-600">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Comments</span>
                  <span className="text-sm font-semibold text-neutral-900">42</span>
                </div>
                <div className="pt-3 border-t border-neutral-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-900">Overall progress</span>
                    <span className="text-sm font-semibold text-primary-600">67%</span>
                  </div>
                  <div className="mt-2 h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full w-[67%] bg-gradient-to-r from-primary-500 to-primary-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
