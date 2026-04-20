import { ArrowRight, Globe, MapPin, Clock, DollarSign, Users, Sparkles, RefreshCw, Download, Check, TrendingDown } from "lucide-react";
import { useState } from "react";

interface AIDraftProps {
  onContinue: () => void;
}

export function AIDraft({ onContinue }: AIDraftProps) {
  const [selectedDay, setSelectedDay] = useState(1);

  const days = [
    {
      day: 1,
      date: "Apr 15",
      activities: [
        { time: "8:30 AM", name: "Senso-ji Temple", duration: "2h", cost: 0, votes: { for: 4, against: 0 } },
        { time: "11:00 AM", name: "Tokyo Skytree", duration: "2.5h", cost: 35, votes: { for: 3, against: 1 } },
        { time: "2:00 PM", name: "Lunch at Asakusa", duration: "1h", cost: 25, votes: { for: 4, against: 0 } },
        { time: "4:00 PM", name: "Ueno Park", duration: "2h", cost: 0, votes: { for: 4, against: 0 } },
      ],
    },
    {
      day: 2,
      date: "Apr 16",
      activities: [
        { time: "9:00 AM", name: "Tsukiji Market Tour", duration: "2h", cost: 45, votes: { for: 3, against: 1 } },
        { time: "12:00 PM", name: "Imperial Palace", duration: "2h", cost: 0, votes: { for: 4, against: 0 } },
        { time: "3:00 PM", name: "Ginza Shopping", duration: "3h", cost: 100, votes: { for: 2, against: 2 } },
      ],
    },
    {
      day: 3,
      date: "Apr 17",
      activities: [
        { time: "10:00 AM", name: "Meiji Shrine", duration: "1.5h", cost: 0, votes: { for: 4, against: 0 } },
        { time: "1:00 PM", name: "Harajuku & Takeshita Street", duration: "2h", cost: 30, votes: { for: 3, against: 1 } },
        { time: "4:00 PM", name: "Shibuya Crossing", duration: "1h", cost: 0, votes: { for: 4, against: 0 } },
      ],
    },
    {
      day: 4,
      date: "Apr 18",
      activities: [
        { time: "10:00 AM", name: "Yoyogi Park", duration: "2h", cost: 0, votes: { for: 4, against: 0 } },
        { time: "1:00 PM", name: "Omotesando Shopping", duration: "2.5h", cost: 80, votes: { for: 3, against: 1 } },
        { time: "4:00 PM", name: "Nezu Museum", duration: "1.5h", cost: 15, votes: { for: 3, against: 1 } },
      ],
    },
    {
      day: 5,
      date: "Apr 19",
      activities: [
        { time: "6:00 AM", name: "Mount Fuji Day Trip", duration: "8h", cost: 120, votes: { for: 4, against: 0 } },
        { time: "3:00 PM", name: "Lake Kawaguchi", duration: "2h", cost: 0, votes: { for: 4, against: 0 } },
      ],
    },
    {
      day: 6,
      date: "Apr 20",
      activities: [
        { time: "9:00 AM", name: "Shinjuku Gyoen Garden", duration: "2h", cost: 5, votes: { for: 3, against: 1 } },
        { time: "12:00 PM", name: "Kabukicho District", duration: "1.5h", cost: 0, votes: { for: 3, against: 1 } },
        { time: "3:00 PM", name: "Tokyo Metropolitan Building", duration: "2h", cost: 0, votes: { for: 4, against: 0 } },
      ],
    },
    {
      day: 7,
      date: "Apr 21",
      activities: [
        { time: "8:00 AM", name: "Odaiba Seaside Park", duration: "2h", cost: 0, votes: { for: 4, against: 0 } },
        { time: "11:00 AM", name: "DiverCity Tokyo Plaza", duration: "2h", cost: 50, votes: { for: 3, against: 1 } },
        { time: "2:00 PM", name: "Final Lunch at Toyosu", duration: "1.5h", cost: 40, votes: { for: 4, against: 0 } },
      ],
    },
  ];

  const currentDay = days[selectedDay - 1] || days[0];
  const totalBudget = 2000;
  const estimatedCost = days.reduce((sum, day) =>
    sum + day.activities.reduce((daySum, act) => daySum + act.cost, 0), 0
  );
  const budgetPercent = (estimatedCost / totalBudget) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-neutral-900">Tokyo Adventure</h1>
                  <p className="text-xs text-neutral-500">April 15-22, 2026</p>
                </div>
              </div>
              <div className="ml-4 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-full flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-xs font-semibold text-purple-900">AI Draft</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors flex items-center gap-2 text-sm">
                <RefreshCw className="w-4 h-4" />
                Regenerate
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
        {/* AI Generation Notice */}
        <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-xl border border-purple-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Your itinerary is ready!</h3>
              <p className="text-sm text-purple-700 mb-4">
                AI generated this 7-day plan based on your group's preferences: moderate pace, $2,000/person budget, and interests in culture & food. Now your team can vote, discuss, and refine together.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">4 members ready</span>
                </div>
                <div className="w-px h-4 bg-purple-300" />
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">18 activities proposed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Left: Day Tabs & Itinerary */}
          <div className="col-span-2 space-y-6">
            {/* Day Tabs */}
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

            {/* Activities List */}
            <div className="space-y-4">
              {currentDay.activities.map((activity, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-600">{activity.time}</span>
                        <span className="text-sm text-neutral-400">•</span>
                        <span className="text-sm text-neutral-500">{activity.duration}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{activity.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded-md text-xs font-medium">
                          ${activity.cost}
                        </span>
                        {activity.votes.for + activity.votes.against > 0 && (
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                            activity.votes.for > activity.votes.against
                              ? "bg-success-50 text-success-700"
                              : "bg-warning-50 text-warning-700"
                          }`}>
                            {Math.round((activity.votes.for / (activity.votes.for + activity.votes.against)) * 100)}% consensus
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className={`px-4 py-2 rounded-lg border font-medium text-sm transition-all ${
                        activity.votes.for > 0
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-white border-neutral-200 text-neutral-700 hover:border-primary-300 hover:bg-primary-50"
                      }`}>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          <span>{activity.votes.for}</span>
                        </div>
                      </button>
                      <button className={`px-4 py-2 rounded-lg border font-medium text-sm transition-all ${
                        activity.votes.against > 0
                          ? "bg-neutral-700 border-neutral-700 text-white"
                          : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50"
                      }`}>
                        {activity.votes.against}
                      </button>
                    </div>
                  </div>

                  {/* Consensus bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-300"
                        style={{ width: `${(activity.votes.for / (activity.votes.for + activity.votes.against)) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-neutral-600 min-w-[3rem] text-right">
                      {Math.round((activity.votes.for / (activity.votes.for + activity.votes.against)) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Map & Stats */}
          <div className="space-y-6">
            {/* Map */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="p-4 border-b border-neutral-200">
                <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  Day {selectedDay} Route
                </h3>
              </div>
              <div className="aspect-square bg-gradient-to-br from-primary-50 to-primary-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-primary-400 mx-auto mb-2" />
                    <p className="text-sm text-primary-600 font-medium">Interactive map</p>
                    <p className="text-xs text-primary-500">{currentDay.activities.length} locations</p>
                  </div>
                </div>
                {/* Simulated markers */}
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary-600 rounded-full border-2 border-white shadow-lg" />
                <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-primary-600 rounded-full border-2 border-white shadow-lg" />
                <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-primary-600 rounded-full border-2 border-white shadow-lg" />
              </div>
            </div>

            {/* Budget Progress */}
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
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                    style={{ width: `${budgetPercent}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingDown className="w-4 h-4 text-success-500" />
                  <span className="font-medium text-success-600">${totalBudget - estimatedCost} remaining</span>
                </div>
                <div className="pt-3 border-t border-neutral-200 text-xs text-neutral-500">
                  Per person estimate: ${Math.round(estimatedCost / 4)}
                </div>
              </div>
            </div>

            {/* Team Status */}
            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-600" />
                Team Members
              </h3>
              <div className="space-y-3">
                {["Alice Chen", "Bob Smith", "Carol Lee", "David Park"].map((name, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white text-xs font-semibold">
                      {name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-neutral-900">{name}</div>
                      <div className="text-xs text-neutral-500">Ready to vote</div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-success-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h3 className="font-semibold text-purple-900">AI Insights</h3>
              </div>
              <ul className="space-y-2 text-sm text-purple-700">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Route optimized to minimize travel time</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Morning activities at popular sites to avoid crowds</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Balanced mix of culture and relaxation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
