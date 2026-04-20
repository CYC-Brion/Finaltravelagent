import { Heart, MessageSquare, Bookmark, MapPin, Globe, TrendingUp, ArrowRight, Users, Star, Award } from "lucide-react";
import { useState } from "react";

interface CommunityPageProps {
  onBack: () => void;
  onStartPlanning: () => void;
}

export function CommunityPage({ onBack, onStartPlanning }: CommunityPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const topDestinations = [
    { rank: 1, location: "Tokyo, Japan", trips: 248, rating: 4.9 },
    { rank: 2, location: "Paris, France", trips: 215, rating: 4.8 },
    { rank: 3, location: "Barcelona, Spain", trips: 192, rating: 4.9 },
  ];

  const categories = [
    "All",
    "Food",
    "Cultural",
    "Photography",
    "Off-the-beaten-path",
    "Family-friendly",
    "Adventure",
    "Relaxation",
  ];

  const sharedTrips = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1685053361005-17fee61b704e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb2t5byUyMHN0cmVldCUyMG1vZGVybiUyMHRyYWRpdGlvbmFsJTIwc2t5bGluZXxlbnwxfHx8fDE3NzYxNDg1MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "7 Days in Tokyo: A Perfect Balance of Traditional & Modern",
      author: { name: "Sarah Chen", avatar: "S" },
      location: "Tokyo, Japan",
      tags: ["Cultural", "Food", "Photography"],
      likes: 342,
      comments: 28,
      saves: 156,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1714113310804-9078aa966335?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQYXJpcyUyMEVpZmZlbCUyMFRvd2VyJTIwRXVyb3BlJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3NjE0ODUxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "European Grand Tour: 15 Cities in 30 Days",
      author: { name: "Marco Rossi", avatar: "M" },
      location: "Europe",
      tags: ["Cultural", "Adventure"],
      likes: 289,
      comments: 42,
      saves: 203,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1729606558813-1bda04fbb55c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCYWxpJTIwYmVhY2glMjB0ZW1wbGUlMjB3ZWxsbmVzcyUyMHJlc29ydHxlbnwxfHx8fDE3NzYxNDg1MTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Bali Retreat: Wellness & Beach Paradise",
      author: { name: "Emma Wilson", avatar: "E" },
      location: "Bali, Indonesia",
      tags: ["Relaxation", "Off-the-beaten-path"],
      likes: 418,
      comments: 35,
      saves: 271,
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1668735431773-7cd27fddbd17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JvY2NvJTIwTWFycmFrZWNoJTIwU2FoYXJhJTIwZGVzZXJ0JTIwY2FtZWx8ZW58MXx8fHwxNzc2MTQ4NTEzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Morocco Adventure: From Marrakech to Sahara",
      author: { name: "Ahmed Hassan", avatar: "A" },
      location: "Morocco",
      tags: ["Adventure", "Cultural", "Photography"],
      likes: 256,
      comments: 31,
      saves: 189,
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1693819395207-29d79f86b1da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOZXclMjBaZWFsYW5kJTIwTWlsZm9yZCUyMFNvdW5kJTIwbW91bnRhaW4lMjBsYWtlfGVufDF8fHx8MTc3NjE0ODUxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "New Zealand Road Trip: South Island Wonders",
      author: { name: "Jack Thompson", avatar: "J" },
      location: "New Zealand",
      tags: ["Adventure", "Photography"],
      likes: 391,
      comments: 47,
      saves: 298,
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1597466599360-3b9775841aec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxPcmxhbmRvJTIwRGlzbmV5JTIwdGhlbWUlMjBwYXJrJTIwZmFtaWx5fGVufDF8fHx8MTc3NjE0ODUxNHww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Family Fun in Orlando: Theme Parks & More",
      author: { name: "Lisa Park", avatar: "L" },
      location: "Orlando, USA",
      tags: ["Family-friendly"],
      likes: 174,
      comments: 22,
      saves: 134,
    },
  ];

  const popularTags = ["#Solo Travel", "#Budget Friendly", "#Luxury", "#Road Trip", "#City Break", "#Nature", "#Beach", "#Mountains"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900">
                <Globe className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-neutral-900">Travel Community & Inspiration</h1>
                <p className="text-xs text-neutral-500">Explore real itineraries from travelers worldwide</p>
              </div>
            </div>
            <button
              onClick={onStartPlanning}
              className="px-5 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-600 transition-colors text-sm"
            >
              Start Your Trip
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Top Destinations This Week */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-neutral-900">Top Destinations This Week</h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {topDestinations.map((dest) => (
              <div
                key={dest.rank}
                className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-lg transition-shadow relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">#{dest.rank}</span>
                </div>
                <div className="mb-4">
                  <MapPin className="w-8 h-8 text-primary-600 mb-3" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{dest.location}</h3>
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <span>{dest.trips} trips</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                      <span>{dest.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category Filters */}
        <div className="mb-8 flex items-center gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat.toLowerCase())}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap ${
                selectedCategory === cat.toLowerCase()
                  ? "bg-primary text-white"
                  : "bg-white border border-neutral-200 text-neutral-700 hover:border-primary-300 hover:bg-primary-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content: Shared Trips Grid */}
          <div className="col-span-2 space-y-6">
            {sharedTrips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-xl overflow-hidden border border-neutral-200 hover:shadow-xl transition-all">
                {/* Image */}
                <div className="aspect-video relative">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-white" />
                      <span className="text-sm font-medium text-white">{trip.location}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">{trip.title}</h3>

                  {/* Author */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white font-semibold">
                      {trip.author.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900">{trip.author.name}</div>
                      <div className="text-xs text-neutral-500">Shared 2 days ago</div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 mb-4">
                    {trip.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Engagement */}
                  <div className="flex items-center gap-6 pt-4 border-t border-neutral-200">
                    <button className="flex items-center gap-2 text-neutral-600 hover:text-danger-600 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-medium">{trip.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors">
                      <MessageSquare className="w-5 h-5" />
                      <span className="text-sm font-medium">{trip.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-neutral-600 hover:text-warning-600 transition-colors">
                      <Bookmark className="w-5 h-5" />
                      <span className="text-sm font-medium">{trip.saves}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Share Your Journey */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
              <Award className="w-10 h-10 text-primary-600 mb-4" />
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Share Your Journey</h3>
              <p className="text-sm text-neutral-700 mb-4">
                Inspire others by publishing your trip itinerary and experiences to the community.
              </p>
              <button
                onClick={onStartPlanning}
                className="w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
              >
                Start Planning
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Become a Local Guide */}
            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <Users className="w-10 h-10 text-primary-600 mb-4" />
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Become a Local Guide</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Share your local expertise and help travelers discover hidden gems in your city.
              </p>
              <button className="w-full px-4 py-2.5 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors">
                Learn More
              </button>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <h3 className="font-semibold text-neutral-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1.5 bg-neutral-50 hover:bg-primary-50 border border-neutral-200 hover:border-primary-300 text-neutral-700 hover:text-primary-700 rounded-lg text-sm transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
