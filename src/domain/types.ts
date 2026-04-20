export type MemberRole = "owner" | "member";
export type TripStatus = "draft" | "planning" | "finalized" | "in_trip" | "completed";
export type ActivityStatus = "proposed" | "accepted" | "in_discussion" | "completed";
export type InvitationStatus = "pending" | "accepted" | "expired";
export type ExpenseCategory = "food" | "activity" | "transport" | "shopping" | "accommodation";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface TripMember {
  id: string;
  userId?: string;
  email: string;
  name: string;
  role: MemberRole;
  invitationStatus: InvitationStatus;
  isOnline: boolean;
}

export interface TripPreference {
  budgetMin: number;
  budgetMax: number;
  pace: "relaxed" | "moderate" | "active";
  interests: string[];
}

export interface VoteSummary {
  for: number;
  against: number;
  userVote?: 1 | -1 | 0;
}

export interface ActivityComment {
  id: string;
  activityId: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  dayNumber: number;
  time: string;
  name: string;
  location?: string;
  duration?: string;
  cost?: number;
  status: ActivityStatus;
  votes: VoteSummary;
  comments: ActivityComment[];
}

export interface ItineraryDay {
  day: number;
  dateLabel: string;
  activities: Activity[];
}

export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  status: "pending" | "accepted" | "dismissed";
}

export interface ActivityFeedItem {
  id: string;
  user: string;
  action: string;
  time: string;
}

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paidBy: string;
  splitWith: string[];
}

export interface Settlement {
  id: string;
  from: string;
  to: string;
  amount: number;
  paid: boolean;
}

export interface MemberBalance {
  name: string;
  paid: number;
  owes: number;
  balance: number;
}

export interface TripSummaryStats {
  duration: number;
  activities: number;
  totalSpent: number;
  photosUploaded: number;
  consensus: number;
}

export interface TripSummaryData {
  stats: TripSummaryStats;
  diaryEntries: Array<{ day: number; author: string; content: string; photos: number }>;
  reflections: {
    wins: string[];
    lessons: string[];
    quote: string;
  };
}

export interface CommunityPost {
  id: string;
  tripId: string;
  title: string;
  location: string;
  authorName: string;
  tags: string[];
  likes: number;
  comments: number;
  saves: number;
  image: string;
  excerpt?: string;
  featuredActivities?: string[];
  totalSpent?: number;
  duration?: number;
}

export interface AgentChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AgentChatResponse {
  sessionId: string;
  reply: string;
  history: AgentChatMessage[];
  timestamp: string;
  toolResults: {
    amapConfigured: boolean;
    llmConfigured: boolean;
    destination?: string;
    weather?: {
      city?: string;
      weather?: string;
      temperature?: string;
      humidity?: string;
      reportTime?: string;
    } | null;
    attractions?: Array<{ name?: string; address?: string; type?: string }>;
    restaurants?: Array<{ name?: string; address?: string; type?: string }>;
    routeComparison?: {
      recommended?: {
        mode?: string;
        distance?: string;
        duration?: string;
      } | null;
    } | null;
  };
}

export interface OnTripTodayResponse {
  currentDay: number;
  today: ItineraryDay | null;
  weather?: {
    city?: string;
    weather?: string;
    temperature?: string;
    humidity?: string;
    reportTime?: string;
  } | null;
  routePlan?: {
    recommended?: {
      mode?: string;
      distance?: string;
      duration?: string;
    } | null;
  } | null;
  replanSuggestion?: string;
}

export interface AiDraftData {
  tripId: string;
  itinerary: ItineraryDay[];
  aiSuggestions: AISuggestion[];
  aiDraftMeta: {
    insights: string[];
    weather?: {
      city?: string;
      weather?: string;
      temperature?: string;
      humidity?: string;
      reportTime?: string;
    } | null;
    attractions: Array<{
      name?: string;
      address?: string;
      type?: string;
      location?: string;
    }>;
  };
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  preferences: TripPreference;
  members: TripMember[];
  itinerary: ItineraryDay[];
  aiSuggestions: AISuggestion[];
  activityFeed: ActivityFeedItem[];
  expenses: Expense[];
  settlements: Settlement[];
  summary: TripSummaryData;
  publishedCommunityPostId?: string;
}

export interface CreateTripInput {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  members: string[];
  budgetMin: number;
  budgetMax: number;
  pace: "relaxed" | "moderate" | "active";
  interests: string[];
}

export interface LoginInput {
  email: string;
  name?: string;
}
