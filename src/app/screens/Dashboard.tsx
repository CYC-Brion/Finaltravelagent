import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  Clock,
  MessageSquare,
  ChevronRight,
  Globe,
  TrendingUp,
  CheckCircle,
  Bell,
  Sparkles,
} from "lucide-react";
import { StatusChip } from "../components/helloworld";
import type { Trip, TripStatus } from "@/domain/types";

interface DashboardProps {
  trips: Trip[];
  onCreateTrip: () => void;
  onViewTrip: (tripId: string, status: TripStatus) => void;
  onViewNotifications: () => void;
}

type FilterStatus = "all" | TripStatus;

const STATUS_LABELS: Record<TripStatus, string> = {
  draft: "Draft",
  planning: "Planning",
  finalized: "Finalized",
  in_trip: "In Trip",
  completed: "Completed",
};

const STATUS_COLORS: Record<TripStatus, string> = {
  draft: "bg-neutral-100 text-neutral-700",
  planning: "bg-amber-100 text-amber-700",
  finalized: "bg-blue-100 text-blue-700",
  in_trip: "bg-green-100 text-green-700",
  completed: "bg-purple-100 text-purple-700",
};

export function Dashboard({ trips, onCreateTrip, onViewTrip, onViewNotifications }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");

  // Mock user stats
  const userStats = {
    tripsPlanned: trips.length,
    countriesVisited: new Set(trips.map((t) => t.destination).filter(Boolean)).size || 8,
    activeCollaborations: trips.filter((t) => ["planning", "finalized"].includes(t.status)).length,
    pendingVotes: trips.reduce(
      (acc, trip) =>
        acc +
        trip.itinerary.reduce(
          (dayAcc, day) =>
            dayAcc +
            day.activities.filter((a) => a.status === "in_discussion" && a.votes.userVote === undefined)
              .length,
          0
        ),
      0
    ),
  };

  // Filter and sort trips
  const filteredTrips = useMemo(() => {
    let result = [...trips];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.destination.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      result = result.filter((t) => t.status === filterStatus);
    }

    // Sort
    if (sortBy === "date") {
      result.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [trips, searchQuery, filterStatus, sortBy]);

  // Group trips by status for sections
  const groupedTrips = useMemo(() => {
    const groups: Record<string, Trip[]> = {
      active: [],
      upcoming: [],
      past: [],
    };

    const now = new Date();

    filteredTrips.forEach((trip) => {
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);

      if (trip.status === "completed") {
        groups.past.push(trip);
      } else if (trip.status === "in_trip" || startDate <= now) {
        groups.active.push(trip);
      } else {
        groups.upcoming.push(trip);
      }
    });

    return groups;
  }, [filteredTrips]);

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

    if (startDate.getMonth() === endDate.getMonth()) {
      return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.getDate()}, ${endDate.getFullYear()}`;
    }
    return `${startDate.toLocaleDateString("en-US", options)} - ${endDate.toLocaleDateString("en-US", options)}, ${endDate.getFullYear()}`;
  };

  const getDaysUntilTrip = (startDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const diff = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return "Trip in progress";
    if (diff === 0) return "Today!";
    if (diff === 1) return "Tomorrow";
    return `${diff} days away`;
  };

  const renderTripCard = (trip: Trip) => {
    const pendingItems = trip.itinerary.reduce(
      (acc, day) =>
        acc +
        day.activities.filter((a) => a.status === "in_discussion" && a.votes.userVote === undefined)
          .length,
      0
    );
    const totalComments = trip.itinerary.reduce(
      (acc, day) => acc + day.activities.reduce((aAcc, a) => aAcc + a.comments.length, 0),
      0
    );

    return (
      <div
        key={trip.id}
        onClick={() => onViewTrip(trip.id, trip.status)}
        className="bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors">
              {trip.name}
            </h3>
            <div className="flex items-center gap-3 text-sm text-neutral-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {trip.destination}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDateRange(trip.startDate, trip.endDate)}
              </span>
            </div>
          </div>
          <StatusChip status={trip.status} label={STATUS_LABELS[trip.status]} />
        </div>

        {/* Members */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex -space-x-2">
            {trip.members.slice(0, 4).map((member, i) => (
              <div
                key={member.id}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                title={member.name}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {trip.members.length > 4 && (
              <div className="w-8 h-8 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-neutral-600 text-xs font-medium">
                +{trip.members.length - 4}
              </div>
            )}
          </div>
          <span className="text-sm text-neutral-500 flex items-center gap-1">
            <Users className="w-4 h-4" />
            {trip.members.length}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            {trip.status === "in_trip" && (
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <Clock className="w-4 h-4" />
                {getDaysUntilTrip(trip.startDate)}
              </span>
            )}
            {trip.status !== "completed" && trip.status !== "in_trip" && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {getDaysUntilTrip(trip.startDate)}
              </span>
            )}
            {pendingItems > 0 && (
              <span className="flex items-center gap-1 text-amber-600">
                <Bell className="w-4 h-4" />
                {pendingItems} pending
              </span>
            )}
            {totalComments > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {totalComments}
              </span>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-500 transition-colors" />
        </div>

        {/* Budget progress if available */}
        {trip.preferences && (
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-500">Budget</span>
              <span className="text-sm font-medium text-primary-600">
                ${trip.preferences.budgetMin} - ${trip.preferences.budgetMax}
              </span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
                style={{ width: "45%" }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSection = (title: string, trips: Trip[], icon: React.ReactNode) => {
    if (trips.length === 0) return null;
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          <span className="text-sm text-neutral-500">({trips.length})</span>
        </div>
        <div className="grid grid-cols-2 gap-4">{trips.map(renderTripCard)}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-900">HelloWorld</span>
          </div>
          <nav className="flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-primary-600">Dashboard</a>
            <a href="#" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">Community</a>
            <button className="text-sm font-medium text-neutral-600 hover:text-neutral-900">Sign in</button>
            <button
              onClick={onCreateTrip}
              className="px-5 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-600 transition-colors text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Trip
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Welcome & Stats */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Welcome back!</h1>
          <p className="text-neutral-600">Manage your trips and collaborate with your travel companions.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-sm text-neutral-500">Trips Planned</span>
            </div>
            <div className="text-3xl font-bold text-neutral-900">{userStats.tripsPlanned}</div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-neutral-500">Countries</span>
            </div>
            <div className="text-3xl font-bold text-neutral-900">{userStats.countriesVisited}</div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm text-neutral-500">Active Collabs</span>
            </div>
            <div className="text-3xl font-bold text-neutral-900">{userStats.activeCollaborations}</div>
          </div>

          <div
            className={`rounded-xl border p-5 ${userStats.pendingVotes > 0 ? "bg-amber-50 border-amber-200 cursor-pointer hover:bg-amber-100" : "bg-neutral-50 border-neutral-200"}`}
            onClick={userStats.pendingVotes > 0 ? onViewNotifications : undefined}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${userStats.pendingVotes > 0 ? "bg-amber-200" : "bg-neutral-200"}`}>
                <Bell className={`w-5 h-5 ${userStats.pendingVotes > 0 ? "text-amber-600" : "text-neutral-500"}`} />
              </div>
              <span className="text-sm text-neutral-500">Pending Votes</span>
            </div>
            <div className="text-3xl font-bold text-neutral-900">{userStats.pendingVotes}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-1">Ready for your next adventure?</h3>
              <p className="text-primary-100">Start planning a new trip or continue collaborating on existing ones.</p>
            </div>
            <button
              onClick={onCreateTrip}
              className="px-6 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Trip
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search trips by name or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-neutral-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="px-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="planning">Planning</option>
              <option value="finalized">Finalized</option>
              <option value="in_trip">In Trip</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "name")}
            className="px-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {(["all", "planning", "finalized", "in_trip", "completed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterStatus === status
                  ? "bg-primary-600 text-white"
                  : "bg-white border border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-600"
              }`}
            >
              {status === "all" ? "All Trips" : STATUS_LABELS[status]}
              {status !== "all" && (
                <span className="ml-2 opacity-60">
                  ({trips.filter((t) => t.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Trip Sections */}
        {filteredTrips.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No trips found</h3>
            <p className="text-neutral-600 mb-6">
              {searchQuery || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "Start planning your first adventure!"}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <button
                onClick={onCreateTrip}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary-600 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Your First Trip
              </button>
            )}
          </div>
        ) : (
          <>
            {groupedTrips.active.length > 0 &&
              renderSection(
                "Active Trips",
                groupedTrips.active,
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              )}
            {groupedTrips.upcoming.length > 0 &&
              renderSection(
                "Upcoming Trips",
                groupedTrips.upcoming,
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
              )}
            {groupedTrips.past.length > 0 &&
              renderSection(
                "Past Trips",
                groupedTrips.past,
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                </div>
              )}
          </>
        )}

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100">
            {trips.slice(0, 5).map((trip) =>
              trip.activityFeed.slice(0, 2).map((activity) => (
                <div key={activity.id} className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white text-sm font-semibold">
                    {activity.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-900">
                      <span className="font-medium">{activity.user}</span> {activity.action} on{" "}
                      <span className="font-medium">{trip.name}</span>
                    </p>
                    <p className="text-xs text-neutral-500">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
            {trips.every((t) => t.activityFeed.length === 0) && (
              <div className="p-8 text-center text-neutral-500">
                No recent activity. Start collaborating on your trips!
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
