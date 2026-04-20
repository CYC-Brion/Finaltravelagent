import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Filter,
  Globe,
  History,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { VoteControl } from "../components/helloworld/VoteControl";
import { StatusChip } from "../components/helloworld/StatusChip";
import type { Trip } from "@/domain/types";

interface CoCreateWorkspaceProps {
  onNavigate: (page: string) => void;
  trip?: Trip;
  onVote?: (activityId: string, direction: 1 | -1) => void;
  onComment?: (activityId: string, body: string) => void;
  onCreateActivity?: (input: {
    dayNumber: number;
    time: string;
    name: string;
    location?: string;
    duration?: string;
    cost?: number;
  }) => void;
  voting?: boolean;
  commenting?: boolean;
  creatingActivity?: boolean;
}

export function CoCreateWorkspace({
  onNavigate,
  trip,
  onVote,
  onComment,
  onCreateActivity,
  voting = false,
  commenting = false,
  creatingActivity = false,
}: CoCreateWorkspaceProps) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [aiMessage, setAiMessage] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activityDraft, setActivityDraft] = useState({
    time: "10:00 AM",
    name: "",
    location: "",
    duration: "1.5h",
    cost: "0",
  });

  const days = useMemo(() => {
    return (
      trip?.itinerary.map((day) => ({
        day: day.day,
        dateLabel: day.dateLabel,
        activities: day.activities,
      })) || []
    );
  }, [trip]);

  const currentDay = days.find((day) => day.day === selectedDay) || days[0];
  const unresolvedItems =
    trip?.itinerary
      .flatMap((day) => day.activities)
      .filter(
        (activity) =>
          activity.status === "proposed" ||
          activity.status === "in_discussion" ||
          activity.votes.for === activity.votes.against,
      ) || [];

  const budgetPercent = trip?.preferences?.budgetMax
    ? Math.min(
        100,
        Math.round(
          ((trip.expenses.reduce((sum, expense) => sum + expense.amount, 0) || 0) /
            trip.preferences.budgetMax) *
            100,
        ),
      )
    : 0;

  const consensusPercent = currentDay?.activities.length
    ? Math.round(
        (currentDay.activities.reduce((sum, activity) => {
          const total = activity.votes.for + activity.votes.against;
          return sum + (total ? activity.votes.for / total : 0.5);
        }, 0) /
          currentDay.activities.length) *
          100,
      )
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      <header className="border-b border-neutral-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-neutral-900">{trip?.name || "Trip Workspace"}</h1>
                  <p className="text-xs text-neutral-500">
                    {trip ? `${trip.startDate} to ${trip.endDate}` : "Collaborative itinerary planning"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pl-6 border-l border-neutral-200">
                <div className="flex -space-x-2">
                  {(trip?.members || []).slice(0, 4).map((member) => (
                    <div key={member.id} className="relative">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                          member.isOnline ? "bg-success-500" : "bg-neutral-300"
                        }`}
                      />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-neutral-600">
                  {trip?.members.filter((member) => member.isOnline).length || 0} online
                </span>
              </div>

              <div className="flex items-center gap-3 pl-6 border-l border-neutral-200">
                <DollarSign className="w-4 h-4 text-neutral-400" />
                <div className="w-32">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-neutral-500">Budget</span>
                    <span className="text-xs font-semibold text-primary-600">{budgetPercent}%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-primary-400" style={{ width: `${budgetPercent}%` }} />
                  </div>
                </div>
              </div>

              <button className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors">
                <History className="w-4 h-4 text-neutral-600" />
                <span className="text-sm font-medium text-neutral-700">v12</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-warning-50 border border-warning-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-warning-600" />
                <span className="text-sm font-medium text-warning-700">{unresolvedItems.length} unresolved</span>
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

      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-neutral-900">Decision Queue</h2>
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Filter className="w-4 h-4 text-neutral-600" />
              </button>
            </div>

            <div className="space-y-3">
              {unresolvedItems.slice(0, 5).map((item) => {
                const total = item.votes.for + item.votes.against || 1;
                return (
                  <div key={item.id} className="bg-white rounded-xl p-4 border border-warning-300 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 text-sm mb-1">{item.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <MessageSquare className="w-3 h-3" />
                          <span>{item.comments.length} comments</span>
                        </div>
                      </div>
                      <AlertCircle className="w-4 h-4 text-warning-600 shrink-0" />
                    </div>
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-warning-400" style={{ width: `${(item.votes.for / total) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-neutral-700 mb-3">AI Suggestions</h3>
              <div className="space-y-3">
                {(trip?.aiSuggestions || []).slice(0, 2).map((suggestion) => (
                  <div key={suggestion.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-purple-900 font-medium mb-1">{suggestion.title}</p>
                        <p className="text-xs text-purple-700">{suggestion.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full mt-4 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Propose Activity
            </button>
          </div>

          <div className="col-span-6 space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-2 flex gap-2 overflow-x-auto">
              {days.map((day) => (
                <button
                  key={day.day}
                  onClick={() => setSelectedDay(day.day)}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                    selectedDay === day.day ? "bg-primary text-primary-foreground shadow-sm" : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  Day {day.day}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Day {currentDay?.day || 1}</h2>
                  <p className="text-sm text-neutral-500">{currentDay?.dateLabel || "Plan details"}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-neutral-500">Consensus</div>
                    <div className="text-lg font-bold text-primary-600">{consensusPercent}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-neutral-500">Activities</div>
                    <div className="text-lg font-bold text-neutral-900">{currentDay?.activities.length || 0}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {(currentDay?.activities || []).map((activity, index, all) => (
                  <div key={activity.id} className="relative">
                    {index < all.length - 1 && <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-neutral-200" />}
                    <div className="bg-neutral-50 rounded-xl p-5 hover:shadow-md transition-shadow border border-neutral-200">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0">
                          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center border-4 border-white shadow-sm">
                            <Clock className="w-5 h-5 text-primary-600" />
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-semibold text-neutral-700">{activity.time}</span>
                                <StatusChip status={activity.status} />
                              </div>
                              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{activity.name}</h3>
                            </div>
                          </div>

                          <VoteControl
                            voteFor={activity.votes.for}
                            voteAgainst={activity.votes.against}
                            userVote={activity.votes.userVote}
                            onVote={(direction) => onVote?.(activity.id, direction)}
                            disabled={voting}
                          />

                          <div className="mt-4 space-y-3">
                            <div className="flex items-center gap-2 text-sm text-neutral-600">
                              <MessageSquare className="w-4 h-4" />
                              <span>{activity.comments.length} comments</span>
                            </div>

                            {activity.comments.slice(0, 2).map((comment) => (
                              <div key={comment.id} className="rounded-lg bg-white p-3 border border-neutral-200">
                                <div className="text-xs font-semibold text-neutral-700 mb-1">{comment.authorName}</div>
                                <div className="text-sm text-neutral-600">{comment.body}</div>
                              </div>
                            ))}

                            <div className="flex gap-2">
                              <input
                                value={commentDrafts[activity.id] || ""}
                                onChange={(e) =>
                                  setCommentDrafts((current) => ({ ...current, [activity.id]: e.target.value }))
                                }
                                placeholder="Add a quick comment..."
                                className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                              <button
                                disabled={!commentDrafts[activity.id]?.trim() || commenting}
                                onClick={() => {
                                  const body = commentDrafts[activity.id]?.trim();
                                  if (!body) return;
                                  onComment?.(activity.id, body);
                                  setCommentDrafts((current) => ({ ...current, [activity.id]: "" }));
                                }}
                                className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-50"
                              >
                                Send
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setShowCreateForm((current) => !current)}
                  className="w-full p-5 border-2 border-dashed border-neutral-300 rounded-xl hover:border-primary-300 hover:bg-primary-50/50 transition-all flex items-center justify-center gap-2 text-neutral-600 hover:text-primary-600"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Add activity to this day</span>
                </button>
                {showCreateForm && (
                  <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        value={activityDraft.time}
                        onChange={(e) => setActivityDraft((current) => ({ ...current, time: e.target.value }))}
                        className="px-3 py-2 rounded-lg border border-neutral-200 text-sm"
                        placeholder="Time"
                      />
                      <input
                        value={activityDraft.duration}
                        onChange={(e) => setActivityDraft((current) => ({ ...current, duration: e.target.value }))}
                        className="px-3 py-2 rounded-lg border border-neutral-200 text-sm"
                        placeholder="Duration"
                      />
                    </div>
                    <input
                      value={activityDraft.name}
                      onChange={(e) => setActivityDraft((current) => ({ ...current, name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm"
                      placeholder="Activity name"
                    />
                    <input
                      value={activityDraft.location}
                      onChange={(e) => setActivityDraft((current) => ({ ...current, location: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm"
                      placeholder="Location"
                    />
                    <input
                      value={activityDraft.cost}
                      onChange={(e) => setActivityDraft((current) => ({ ...current, cost: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm"
                      placeholder="Estimated cost"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowCreateForm(false)}
                        className="px-3 py-2 rounded-lg bg-neutral-100 text-neutral-700 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={!activityDraft.name.trim() || creatingActivity}
                        onClick={() => {
                          onCreateActivity?.({
                            dayNumber: currentDay?.day || selectedDay,
                            time: activityDraft.time,
                            name: activityDraft.name.trim(),
                            location: activityDraft.location.trim(),
                            duration: activityDraft.duration.trim(),
                            cost: Number(activityDraft.cost || 0),
                          });
                          setActivityDraft({
                            time: "10:00 AM",
                            name: "",
                            location: "",
                            duration: "1.5h",
                            cost: "0",
                          });
                          setShowCreateForm(false);
                        }}
                        className="px-3 py-2 rounded-lg bg-primary text-white text-sm disabled:opacity-50"
                      >
                        Add Activity
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-3 space-y-6">
            <div className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 rounded-xl border border-purple-200 overflow-hidden">
              <div className="p-4 bg-white/80 border-b border-purple-200/50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-purple-900">AI Assistant</h3>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className="text-sm text-purple-900">
                    I noticed {unresolvedItems.length} items still need alignment. I can help you turn them into a more balanced plan.
                  </p>
                </div>
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

              <div className="p-4 border-t border-purple-200/50">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask AI..."
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-purple-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => onNavigate("ai")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-600" />
                Team Activity
              </h3>
              <div className="space-y-3">
                {(trip?.activityFeed || []).slice(0, 6).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
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

            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <h3 className="font-semibold text-neutral-900 mb-4">Trip Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Total activities</span>
                  <span className="text-sm font-semibold text-neutral-900">
                    {trip?.itinerary.flatMap((day) => day.activities).length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Consensus reached</span>
                  <span className="text-sm font-semibold text-success-600">
                    {trip?.itinerary
                      .flatMap((day) => day.activities)
                      .filter((activity) => activity.votes.for > activity.votes.against).length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Needs voting</span>
                  <span className="text-sm font-semibold text-warning-600">{unresolvedItems.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Comments</span>
                  <span className="text-sm font-semibold text-neutral-900">
                    {trip?.itinerary.flatMap((day) => day.activities).reduce((sum, activity) => sum + activity.comments.length, 0) || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
