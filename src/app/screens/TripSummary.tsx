import { Globe, MapPin, Calendar, Users, Camera, Heart, MessageSquare, DollarSign, Download, Share2, Star, CheckCircle, TrendingUp, Clock } from "lucide-react";
import { useState } from "react";
import { StatusChip } from "../components/helloworld/StatusChip";

interface TripSummaryProps {
  onBack: () => void;
  onRestart?: () => void;
  onPublishToCommunity?: () => void;
}

export function TripSummary({ onBack, onRestart, onPublishToCommunity }: TripSummaryProps) {
  const [selectedDay, setSelectedDay] = useState(1);

  const tripStats = {
    duration: 7,
    activities: 24,
    totalSpent: 935,
    photosUploaded: 156,
    consensus: 92,
  };

  const highlights = [
    { day: 1, activity: "Senso-ji Temple at sunrise", rating: 5, photo: true, image: "https://images.unsplash.com/photo-1763124478840-d389da62e167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTZW5zby1qaSUyMFRlbXBsZSUyMFRva3lvJTIwc3VucmlzZXxlbnwxfHx8fDE3NzYxNDg1MTF8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { day: 2, activity: "Tsukiji Market food tour", rating: 5, photo: true, image: "https://images.unsplash.com/photo-1490974764272-9f2b89eb0a6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUc3VraWppJTIwZmlzaCUyMG1hcmtldCUyMFRva3lvJTIwc3VzaGl8ZW58MXx8fHwxNzc2MTQ4NTExfDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { day: 3, activity: "Meiji Shrine visit", rating: 4, photo: true, image: "https://images.unsplash.com/photo-1686933021179-f376a84dfc66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNZWlqaSUyMFNocmluZSUyMFRva3lvJTIwdG9yaWklMjBnYXRlfGVufDF8fHx8MTc3NjE0ODUxMnww&ixlib=rb-4.1.0&q=80&w=1080" },
    { day: 5, activity: "Mount Fuji day trip", rating: 5, photo: true, image: "https://images.unsplash.com/photo-1657794419149-005cb23d2777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3VudCUyMEZ1amklMjBKYXBhbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NzYxNDg1MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  ];

  const diaryEntries = [
    { day: 1, author: "Alice", content: "Amazing start to our trip! The Senso-ji Temple was breathtaking at sunrise. So glad we followed AI's suggestion to go early.", photos: 12 },
    { day: 1, author: "Bob", content: "Tokyo Skytree had incredible views. Worth every penny!", photos: 8 },
    { day: 2, author: "Carol", content: "The sushi at Tsukiji was the best I've ever had. This is exactly why we voted for the early morning tour!", photos: 15 },
    { day: 3, author: "David", content: "Harajuku street fashion was wild! Great people watching.", photos: 20 },
  ];

  const dayActivities: Record<number, Array<{ time: string; name: string; status: "completed" }>> = {
    1: [
      { time: "8:30 AM", name: "Senso-ji Temple", status: "completed" },
      { time: "11:00 AM", name: "Tokyo Skytree", status: "completed" },
      { time: "2:00 PM", name: "Lunch at Asakusa", status: "completed" },
      { time: "4:00 PM", name: "Ueno Park", status: "completed" },
    ],
    2: [
      { time: "6:00 AM", name: "Tsukiji Fish Market", status: "completed" },
      { time: "9:30 AM", name: "Ginza Shopping District", status: "completed" },
      { time: "1:00 PM", name: "Imperial Palace Gardens", status: "completed" },
      { time: "4:30 PM", name: "Akihabara Electronics", status: "completed" },
    ],
    3: [
      { time: "9:00 AM", name: "Meiji Shrine", status: "completed" },
      { time: "12:30 PM", name: "Lunch at Harajuku", status: "completed" },
      { time: "3:00 PM", name: "teamLab Borderless", status: "completed" },
      { time: "7:00 PM", name: "Dinner at Shibuya", status: "completed" },
    ],
    4: [
      { time: "10:00 AM", name: "Yoyogi Park", status: "completed" },
      { time: "1:00 PM", name: "Omotesando Shopping", status: "completed" },
      { time: "3:30 PM", name: "Nezu Museum", status: "completed" },
      { time: "6:00 PM", name: "Roppongi Hills", status: "completed" },
    ],
    5: [
      { time: "6:00 AM", name: "Depart for Mount Fuji", status: "completed" },
      { time: "9:00 AM", name: "Lake Kawaguchi", status: "completed" },
      { time: "12:00 PM", name: "Mountain Lunch", status: "completed" },
      { time: "4:00 PM", name: "Return to Tokyo", status: "completed" },
    ],
    6: [
      { time: "9:00 AM", name: "Shinjuku Gyoen Garden", status: "completed" },
      { time: "12:00 PM", name: "Kabukicho District", status: "completed" },
      { time: "3:00 PM", name: "Tokyo Metropolitan Building", status: "completed" },
      { time: "6:30 PM", name: "Golden Gai Evening", status: "completed" },
    ],
    7: [
      { time: "8:00 AM", name: "Odaiba Seaside Park", status: "completed" },
      { time: "11:00 AM", name: "DiverCity Tokyo Plaza", status: "completed" },
      { time: "2:00 PM", name: "Final Lunch at Toyosu", status: "completed" },
      { time: "5:00 PM", name: "Airport Departure", status: "completed" },
    ],
  };

  const currentDayActivities = dayActivities[selectedDay] || dayActivities[1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Tokyo Adventure</h1>
                <div className="flex items-center gap-3 text-sm text-neutral-600 mt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>April 15-22, 2026</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>4 travelers</span>
                  </div>
                  <span>•</span>
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
                  className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2 shadow-sm"
                >
                  Plan Another Trip
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Trip Stats */}
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
            <div className="text-sm text-neutral-600">Per person</div>
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

        {/* Trip Highlights */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Trip Highlights</h2>
          <div className="grid grid-cols-2 gap-6">
            {highlights.map((highlight, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-neutral-200 hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={highlight.image}
                    alt={highlight.activity}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-semibold text-neutral-900">
                    Day {highlight.day}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-neutral-900">{highlight.activity}</h3>
                    <div className="flex gap-0.5">
                      {[...Array(highlight.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-warning-500 text-warning-500" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>24 reactions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>8 comments</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Route Replay */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Route Replay</h2>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                    selectedDay === day
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="grid grid-cols-2">
              {/* Map */}
              <div className="aspect-square bg-gradient-to-br from-primary-50 to-primary-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-primary-400 mx-auto mb-3" />
                    <p className="text-sm text-primary-600 font-medium">Day {selectedDay} Route</p>
                    <p className="text-xs text-primary-500">Interactive map replay</p>
                  </div>
                </div>
                {/* Simulated route */}
                <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
                  <path
                    d="M 80,120 Q 200,80 320,140 T 400,300"
                    stroke="#0A7EA4"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="5,5"
                    opacity="0.5"
                  />
                </svg>
                {/* Markers */}
                <div className="absolute top-1/4 left-1/5 w-4 h-4 bg-primary-600 rounded-full border-2 border-white shadow-lg" />
                <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-primary-600 rounded-full border-2 border-white shadow-lg" />
                <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-primary-600 rounded-full border-2 border-white shadow-lg" />
              </div>

              {/* Timeline */}
              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Day {selectedDay}</h3>
                  <p className="text-sm text-neutral-600">April {14 + selectedDay}, 2026</p>
                </div>

                <div className="space-y-4">
                  {currentDayActivities.map((activity, i) => (
                    <div key={i} className="flex items-start gap-4">
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

                <div className="pt-4 border-t border-neutral-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Day completed</span>
                    <span className="font-semibold text-success-600">100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Collaborative Diary */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Trip Diary</h2>
          <div className="grid grid-cols-2 gap-6">
            {diaryEntries.map((entry, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-neutral-200">
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
                  <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                    <Heart className="w-4 h-4" />
                    <span>12 likes</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                    <MessageSquare className="w-4 h-4" />
                    <span>5 replies</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Reflections */}
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Team Reflections</h2>
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-8 border border-primary-200">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-4">What worked great</h3>
                <ul className="space-y-3">
                  {[
                    "Early morning temple visits avoided crowds",
                    "AI route optimization saved tons of walking time",
                    "Group voting kept everyone happy",
                    "Budget tracking prevented overspending",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-4">Lessons learned</h3>
                <ul className="space-y-3">
                  {[
                    "Book popular restaurants 2+ days ahead",
                    "Keep some days flexible for spontaneity",
                    "Weather backup plans are essential",
                    "Rest days matter more than we thought",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-warning-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-primary-200 text-center">
              <p className="text-lg font-semibold text-primary-900 mb-2">
                "Best planned trip we've ever had! The collaborative approach made everyone feel included."
              </p>
              <p className="text-sm text-primary-700">— Team consensus</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
