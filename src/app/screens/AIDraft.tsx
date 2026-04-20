import {
  ArrowRight,
  Check,
  Clock,
  DollarSign,
  Download,
  Globe,
  MapPin,
  RefreshCw,
  Sparkles,
  TrendingDown,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { AiDraftData, Trip } from "@/domain/types";

interface AIDraftProps {
  onContinue: () => void;
  onRegenerate?: () => void;
  onSuggestionResponse?: (suggestionId: string, response: "accepted" | "dismissed") => void;
  trip?: Trip;
  draftData?: AiDraftData;
  generating?: boolean;
}

export function AIDraft({
  onContinue,
  onRegenerate,
  onSuggestionResponse,
  trip,
  draftData,
  generating = false,
}: AIDraftProps) {
  const [selectedDay, setSelectedDay] = useState(1);

  const days = useMemo(() => {
    const itinerary = draftData?.itinerary || trip?.itinerary || [];
    return itinerary.map((day) => ({
      day: day.day,
      date: day.dateLabel,
      activities: day.activities.map((activity) => ({
        id: activity.id,
        time: activity.time,
        name: activity.name,
        duration: activity.duration || "1h",
        location: activity.location || trip?.destination || "Trip destination",
        cost: activity.cost || 0,
        votes: activity.votes,
      })),
    }));
  }, [draftData, trip]);

  const currentDay = days.find((day) => day.day === selectedDay) || days[0];
  const totalBudget = trip?.preferences.budgetMax || 2000;
  const estimatedCost = days.reduce(
    (sum, day) => sum + day.activities.reduce((daySum, act) => daySum + act.cost, 0),
    0,
  );
  const budgetPercent = totalBudget ? (estimatedCost / totalBudget) * 100 : 0;
  const weather = draftData?.aiDraftMeta.weather;
  const attractions = draftData?.aiDraftMeta.attractions || [];
  const insights = draftData?.aiDraftMeta.insights || [];
  const suggestions = draftData?.aiSuggestions || trip?.aiSuggestions || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-neutral-900">{trip?.name || "AI Draft"}</h1>
                  <p className="text-xs text-neutral-500">
                    {trip ? `${trip.startDate} - ${trip.endDate}` : "Trip itinerary"}
                  </p>
                </div>
              </div>
              <div className="ml-4 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-full flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-xs font-semibold text-purple-900">AI Draft</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onRegenerate}
                disabled={generating}
                className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" />
                {generating ? "Generating..." : "Regenerate"}
              </button>
              <button className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors flex items-center gap-2 text-sm">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={onContinue}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2 text-sm shadow-sm"
              >
                Start Collaborating
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-xl border border-purple-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Your itinerary is ready</h3>
              <p className="text-sm text-purple-700 mb-4">
                This draft is generated from your group preferences, destination data, and live context where available.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">{trip?.members.length || 0} members</span>
                </div>
                <div className="w-px h-4 bg-purple-300" />
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">
                    {days.flatMap((day) => day.activities).length} activities proposed
                  </span>
                </div>
                {weather && (
                  <>
                    <div className="w-px h-4 bg-purple-300" />
                    <span className="text-sm font-medium text-purple-900">
                      {weather.city || trip?.destination}: {weather.weather || "Unknown"} {weather.temperature || ""}°C
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-2 flex gap-2 overflow-x-auto">
              {days.map((day) => (
                <button
                  key={day.day}
                  onClick={() => setSelectedDay(day.day)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                    selectedDay === day.day
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  <div className="text-xs mb-0.5">{day.date}</div>
                  <div className="text-sm">Day {day.day}</div>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {(currentDay?.activities || []).map((activity) => {
                const totalVotes = activity.votes.for + activity.votes.against;
                const consensus = totalVotes ? Math.round((activity.votes.for / totalVotes) * 100) : 0;
                return (
                  <div key={activity.id} className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Clock className="w-4 h-4 text-neutral-400" />
                          <span className="text-sm font-medium text-neutral-600">{activity.time}</span>
                          <span className="text-sm text-neutral-400">·</span>
                          <span className="text-sm text-neutral-500">{activity.duration}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">{activity.name}</h3>
                        <div className="text-sm text-neutral-500 mb-3">{activity.location}</div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded-md text-xs font-medium">
                            ${activity.cost}
                          </span>
                          {totalVotes > 0 && (
                            <span className="px-2 py-1 rounded-md text-xs font-medium bg-success-50 text-success-700">
                              {consensus}% consensus
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-500 to-primary-400" style={{ width: `${consensus}%` }} />
                      </div>
                      <span className="text-xs font-medium text-neutral-600 min-w-[3rem] text-right">{consensus}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="p-4 border-b border-neutral-200">
                <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  Top Nearby Places
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {attractions.slice(0, 5).map((place, index) => (
                  <div key={`${place.name || "place"}_${index}`} className="rounded-lg border border-neutral-200 p-3">
                    <div className="font-medium text-sm text-neutral-900">{place.name || "Suggested place"}</div>
                    <div className="text-xs text-neutral-500 mt-1">{place.address || trip?.destination}</div>
                    {place.type && <div className="text-xs text-primary-600 mt-2">{place.type}</div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary-600" />
                Budget Overview
              </h3>
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-neutral-900">${estimatedCost}</span>
                  <span className="text-sm text-neutral-500">of ${totalBudget}</span>
                </div>
                <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-primary-400" style={{ width: `${Math.min(100, budgetPercent)}%` }} />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingDown className="w-4 h-4 text-success-500" />
                  <span className="font-medium text-success-600">${Math.max(0, totalBudget - estimatedCost)} remaining</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-600" />
                Team Members
              </h3>
              <div className="space-y-3">
                {(trip?.members || []).map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white text-xs font-semibold">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-neutral-900">{member.name}</div>
                      <div className="text-xs text-neutral-500">{member.invitationStatus}</div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${member.isOnline ? "bg-success-500" : "bg-neutral-300"}`} />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h3 className="font-semibold text-purple-900">AI Insights</h3>
              </div>
              <ul className="space-y-2 text-sm text-purple-700">
                {insights.map((insight, index) => (
                  <li key={`${insight}_${index}`} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <h3 className="font-semibold text-neutral-900 mb-4">AI Suggestions</h3>
              <div className="space-y-3">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="rounded-xl border border-neutral-200 p-4">
                    <div className="font-medium text-neutral-900 mb-1">{suggestion.title}</div>
                    <div className="text-sm text-neutral-600 mb-3">{suggestion.description}</div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-neutral-500 uppercase">{suggestion.status}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onSuggestionResponse?.(suggestion.id, "accepted")}
                          className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => onSuggestionResponse?.(suggestion.id, "dismissed")}
                          className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-medium"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
