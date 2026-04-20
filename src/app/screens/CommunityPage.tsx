import {
  ArrowRight,
  Award,
  Bookmark,
  Globe,
  Heart,
  MapPin,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { CommunityPost } from "@/domain/types";

interface CommunityPageProps {
  onBack: () => void;
  onStartPlanning: () => void;
  posts?: CommunityPost[];
}

export function CommunityPage({ onBack, onStartPlanning, posts }: CommunityPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["All", "Food", "Cultural", "Photography", "Adventure", "Relaxation"];

  const topDestinations = useMemo(() => {
    const grouped = new Map<string, { trips: number; rating: number }>();
    for (const post of posts || []) {
      const current = grouped.get(post.location) || { trips: 0, rating: 4.8 };
      grouped.set(post.location, { trips: current.trips + 1, rating: current.rating });
    }
    return Array.from(grouped.entries())
      .map(([location, data], index) => ({
        rank: index + 1,
        location,
        trips: data.trips,
        rating: data.rating,
      }))
      .slice(0, 3);
  }, [posts]);

  const visiblePosts = useMemo(() => {
    if (!posts?.length) return [];
    if (selectedCategory === "all") return posts;
    return posts.filter((post) =>
      post.tags.some((tag) => tag.toLowerCase().includes(selectedCategory.toLowerCase())),
    );
  }, [posts, selectedCategory]);

  const popularTags = useMemo(() => {
    const tags = new Map<string, number>();
    for (const post of posts || []) {
      for (const tag of post.tags) {
        tags.set(tag, (tags.get(tag) || 0) + 1);
      }
    }
    return Array.from(tags.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => `#${tag}`);
  }, [posts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900">
                <Globe className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-neutral-900">Travel Community & Inspiration</h1>
                <p className="text-xs text-neutral-500">Explore published collaborative itineraries</p>
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
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-neutral-900">Top Destinations This Week</h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {(topDestinations.length ? topDestinations : [
              { rank: 1, location: "Tokyo, Japan", trips: 1, rating: 4.9 },
            ]).map((dest) => (
              <div key={dest.rank} className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-lg transition-shadow relative overflow-hidden">
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">#{dest.rank}</span>
                </div>
                <div className="mb-4">
                  <MapPin className="w-8 h-8 text-primary-600 mb-3" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{dest.location}</h3>
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
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
          <div className="col-span-2 space-y-6">
            {visiblePosts.map((trip) => (
              <div key={trip.id} className="bg-white rounded-xl overflow-hidden border border-neutral-200 hover:shadow-xl transition-all">
                <div className="aspect-video relative">
                  <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-white" />
                      <span className="text-sm font-medium text-white">{trip.location}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">{trip.title}</h3>
                  {trip.excerpt && <p className="text-sm text-neutral-600 mb-4">{trip.excerpt}</p>}

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white font-semibold">
                      {trip.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900">{trip.authorName}</div>
                      <div className="text-xs text-neutral-500">
                        {trip.duration ? `${trip.duration} days` : "Shared trip"} {trip.totalSpent ? `· $${trip.totalSpent} total` : ""}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap mb-4">
                    {trip.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {trip.featuredActivities?.length ? (
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-neutral-500 uppercase mb-2">Featured Stops</div>
                      <div className="flex flex-wrap gap-2">
                        {trip.featuredActivities.map((activity) => (
                          <span key={activity} className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

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

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
              <Award className="w-10 h-10 text-primary-600 mb-4" />
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Share Your Journey</h3>
              <p className="text-sm text-neutral-700 mb-4">
                Publish your collaborative trip summary and help other travelers plan with more confidence.
              </p>
              <button
                onClick={onStartPlanning}
                className="w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
              >
                Start Planning
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <Users className="w-10 h-10 text-primary-600 mb-4" />
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Community Snapshot</h3>
              <p className="text-sm text-neutral-600 mb-4">
                {posts?.length || 0} published itineraries are currently available in this workspace.
              </p>
              <button className="w-full px-4 py-2.5 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors">
                Explore More
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <h3 className="font-semibold text-neutral-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {(popularTags.length ? popularTags : ["#Culture", "#Food"]).map((tag) => (
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
