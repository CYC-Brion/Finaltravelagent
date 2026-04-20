import {
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Globe,
  Heart,
  MapPin,
  MessageSquare,
  Share2,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { StatusChip } from "../components/helloworld/StatusChip";
import type { Trip } from "@/domain/types";

interface TripSummaryProps {
  onBack: () => void;
  onRestart?: () => void;
  onPublishToCommunity?: () => void;
  onAddDiaryEntry?: (input: { day: number; author: string; content: string; photos: number }) => void;
  addingDiaryEntry?: boolean;
  trip?: Trip;
}

export function TripSummary({
  onBack,
  onRestart,
  onPublishToCommunity,
  onAddDiaryEntry,
  addingDiaryEntry = false,
  trip,
}: TripSummaryProps) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [draftEntry, setDraftEntry] = useState({
    author: trip?.members?.[0]?.name || "Demo Traveler",
    content: "",
    photos: "0",
  });

  const tripStats = trip?.summary.stats || {
    duration: 0,
    activities: 0,
    totalSpent: 0,
    photosUploaded: 0,
    consensus: 0,
  };

  const highlights = useMemo(() => {
    return (
      trip?.itinerary
        .flatMap((day) =>
          day.activities.map((activity) => ({
            day: day.day,
            activity: activity.name,
            location: activity.location || trip.destination,
            rating:
              activity.votes.for + activity.votes.against > 0
                ? Math.max(3, Math.min(5, Math.round((activity.votes.for / (activity.votes.for + activity.votes.against)) * 5)))
                : 4,
          })),
        )
        .slice(0, 4) || []
    );
  }, [trip]);

  const diaryEntries = trip?.summary.diaryEntries || [];

  const currentDayActivities =
    trip?.itinerary.find((day) => day.day === selectedDay)?.activities.map((activity) => ({
      time: activity.time,
      name: activity.name,
      status: activity.status === "completed" ? ("completed" as const) : ("completed" as const),
    })) || [];

  const wins =
    trip?.summary.reflections.wins.length
      ? trip.summary.reflections.wins
      : [
          "Collaborative planning helped the group align faster.",
          "The itinerary balanced pace and variety well.",
        ];

  const lessons =
    trip?.summary.reflections.lessons.length
      ? trip.summary.reflections.lessons
      : [
          "Keep some flexibility for changing energy levels.",
          "Add buffer time around high-demand attractions.",
        ];

  const quote =
    trip?.summary.reflections.quote ||
    "The collaborative approach made the whole trip feel more intentional and shared.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">{trip?.name || "Trip Summary"}</h1>
                <div className="flex items-center gap-3 text-sm text-neutral-600 mt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{trip ? `${trip.startDate} - ${trip.endDate}` : "Trip dates"}</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{trip?.members.length || 0} travelers</span>
                  </div>
                  <span>·</span>
                  <StatusChip status="completed" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-5 py-2.5 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
              {onPublishToCommunity && (
                <button
                  onClick={onPublishToCommunity}
                  className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Publish to Community
                </button>
              )}
              {onRestart && (
                <button
                  onClick={onRestart}
                  className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-600 transition-colors shadow-sm"
                >
                  Plan Another Trip
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-5 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 border border-neutral-200 text-center">
            <Calendar className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-neutral-900 mb-1">{tripStats.duration}</div>
            <div className="text-sm text-neutral-600">Days</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-neutral-200 text-center">
            <MapPin className="w-8 h-8 text-success-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-neutral-900 mb-1">{tripStats.activities}</div>
            <div className="text-sm text-neutral-600">Activities</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-neutral-200 text-center">
            <DollarSign className="w-8 h-8 text-warning-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-neutral-900 mb-1">${tripStats.totalSpent}</div>
            <div className="text-sm text-neutral-600">Total spent</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-neutral-200 text-center">
            <Camera className="w-8 h-8 text-info-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-neutral-900 mb-1">{tripStats.photosUploaded}</div>
            <div className="text-sm text-neutral-600">Photos</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-neutral-200 text-center">
            <TrendingUp className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-neutral-900 mb-1">{tripStats.consensus}%</div>
            <div className="text-sm text-neutral-600">Consensus</div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Trip Highlights</h2>
          <div className="grid grid-cols-2 gap-6">
            {highlights.map((highlight, i) => (
              <div key={`${highlight.activity}_${i}`} className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xs font-medium text-primary-600 mb-2">Day {highlight.day}</div>
                    <h3 className="font-semibold text-neutral-900">{highlight.activity}</h3>
                    <div className="text-sm text-neutral-500 mt-2">{highlight.location}</div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(highlight.rating)].map((_, index) => (
                      <Star key={index} className="w-4 h-4 fill-warning-500 text-warning-500" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-600">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{12 + i * 4} reactions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{4 + i} comments</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Route Replay</h2>
            <div className="flex items-center gap-2">
              {(trip?.itinerary || []).map((day) => (
                <button
                  key={day.day}
                  onClick={() => setSelectedDay(day.day)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                    selectedDay === day.day
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {day.day}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="aspect-square bg-gradient-to-br from-primary-50 to-primary-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-primary-400 mx-auto mb-3" />
                    <p className="text-sm text-primary-600 font-medium">Day {selectedDay} Route</p>
                    <p className="text-xs text-primary-500">{currentDayActivities.length} stops completed</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Day {selectedDay}</h3>
                  <p className="text-sm text-neutral-600">Activity timeline</p>
                </div>

                <div className="space-y-4">
                  {currentDayActivities.map((activity, i) => (
                    <div key={`${activity.name}_${i}`} className="flex items-start gap-4">
                      <div className="shrink-0">
                        <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-success-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          <span className="text-sm font-medium text-neutral-600">{activity.time}</span>
                        </div>
                        <h4 className="font-semibold text-neutral-900">{activity.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Trip Diary</h2>
          <div className="bg-white rounded-xl p-6 border border-neutral-200 mb-6 space-y-3">
            <h3 className="font-semibold text-neutral-900">Add Diary Entry</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                value={draftEntry.author}
                onChange={(e) => setDraftEntry((current) => ({ ...current, author: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-neutral-200 text-sm"
                placeholder="Author"
              />
              <input
                value={draftEntry.photos}
                onChange={(e) => setDraftEntry((current) => ({ ...current, photos: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-neutral-200 text-sm"
                placeholder="Photo count"
              />
            </div>
            <textarea
              value={draftEntry.content}
              onChange={(e) => setDraftEntry((current) => ({ ...current, content: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm min-h-28"
              placeholder={`Write something memorable about Day ${selectedDay}...`}
            />
            <div className="flex justify-end">
              <button
                disabled={!draftEntry.content.trim() || addingDiaryEntry}
                onClick={() => {
                  onAddDiaryEntry?.({
                    day: selectedDay,
                    author: draftEntry.author.trim() || "Traveler",
                    content: draftEntry.content.trim(),
                    photos: Number(draftEntry.photos || 0),
                  });
                  setDraftEntry((current) => ({ ...current, content: "", photos: "0" }));
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold disabled:opacity-50"
              >
                Add Entry
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {diaryEntries.map((entry, i) => (
              <div key={`${entry.author}_${entry.day}_${i}`} className="bg-white rounded-xl p-6 border border-neutral-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white font-semibold shrink-0">
                    {entry.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-neutral-900">{entry.author}</span>
                      <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md">Day {entry.day}</span>
                    </div>
                    <p className="text-sm text-neutral-700 leading-relaxed">{entry.content}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-neutral-200">
                  <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                    <Camera className="w-4 h-4" />
                    <span>{entry.photos} photos</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Team Reflections</h2>
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-8 border border-primary-200">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-4">What worked great</h3>
                <ul className="space-y-3">
                  {wins.map((item, i) => (
                    <li key={`${item}_${i}`} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-4">Lessons learned</h3>
                <ul className="space-y-3">
                  {lessons.map((item, i) => (
                    <li key={`${item}_${i}`} className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-warning-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-primary-200 text-center">
              <p className="text-lg font-semibold text-primary-900 mb-2">"{quote}"</p>
              <p className="text-sm text-primary-700">Team consensus</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
