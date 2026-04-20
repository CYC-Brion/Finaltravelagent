import type { CommunityPost, Trip, User } from "@/domain/types";

export const defaultUser: User = {
  id: "user_1",
  email: "demo@helloworld.app",
  name: "Demo Traveler",
};

export const seedTrips: Trip[] = [
  {
    id: "trip_tokyo_1",
    name: "Tokyo Adventure",
    destination: "Tokyo, Japan",
    startDate: "2026-04-15",
    endDate: "2026-04-22",
    status: "planning",
    preferences: {
      budgetMin: 1500,
      budgetMax: 2000,
      pace: "moderate",
      interests: ["culture", "food"],
    },
    members: [
      { id: "member_1", userId: "user_1", email: "demo@helloworld.app", name: "Demo Traveler", role: "owner", invitationStatus: "accepted", isOnline: true },
      { id: "member_2", email: "alice@example.com", name: "Alice Chen", role: "member", invitationStatus: "accepted", isOnline: true },
      { id: "member_3", email: "bob@example.com", name: "Bob Smith", role: "member", invitationStatus: "pending", isOnline: false },
      { id: "member_4", email: "carol@example.com", name: "Carol Lee", role: "member", invitationStatus: "accepted", isOnline: true }
    ],
    itinerary: [
      {
        day: 1,
        dateLabel: "Apr 15",
        activities: [
          { id: "act_1", dayNumber: 1, time: "8:30 AM", name: "Senso-ji Temple", location: "Asakusa", duration: "2h", cost: 0, status: "accepted", votes: { for: 4, against: 0, userVote: 1 }, comments: [] },
          { id: "act_2", dayNumber: 1, time: "11:00 AM", name: "Tokyo Skytree", location: "Sumida", duration: "2.5h", cost: 35, status: "in_discussion", votes: { for: 3, against: 1, userVote: 1 }, comments: [] }
        ]
      },
      {
        day: 2,
        dateLabel: "Apr 16",
        activities: [
          { id: "act_3", dayNumber: 2, time: "9:00 AM", name: "Tsukiji Market Tour", location: "Chuo", duration: "2h", cost: 45, status: "accepted", votes: { for: 3, against: 1, userVote: 0 }, comments: [] },
          { id: "act_4", dayNumber: 2, time: "1:00 PM", name: "Ginza Shopping", location: "Ginza", duration: "3h", cost: 100, status: "proposed", votes: { for: 2, against: 2, userVote: 0 }, comments: [] }
        ]
      },
      {
        day: 3,
        dateLabel: "Apr 17",
        activities: [
          { id: "act_5", dayNumber: 3, time: "9:00 AM", name: "Meiji Shrine", location: "Shibuya", duration: "2h", cost: 0, status: "completed", votes: { for: 4, against: 0, userVote: 1 }, comments: [] },
          { id: "act_6", dayNumber: 3, time: "3:00 PM", name: "teamLab Borderless", location: "Odaiba", duration: "3h", cost: 55, status: "accepted", votes: { for: 3, against: 0, userVote: 1 }, comments: [] }
        ]
      }
    ],
    aiSuggestions: [
      { id: "ai_1", title: "Add buffer time", description: "Insert 30-minute breaks between morning activities.", status: "pending" },
      { id: "ai_2", title: "Alternative route", description: "Visit Meiji Shrine before Harajuku to save time.", status: "pending" }
    ],
    activityFeed: [
      { id: "feed_1", user: "Alice", action: "voted on Tokyo Tower", time: "2m ago" },
      { id: "feed_2", user: "Bob", action: "commented on Ginza", time: "5m ago" }
    ],
    expenses: [
      { id: "expense_1", date: "Apr 15", category: "food", description: "Lunch at Asakusa", amount: 85, paidBy: "Alice", splitWith: ["Alice", "Bob", "Carol", "David"] },
      { id: "expense_2", date: "Apr 15", category: "activity", description: "Tokyo Skytree tickets", amount: 140, paidBy: "Bob", splitWith: ["Alice", "Bob", "Carol", "David"] }
    ],
    settlements: [
      { id: "settle_1", from: "Bob", to: "Alice", amount: 105, paid: false },
      { id: "settle_2", from: "Carol", to: "Alice", amount: 48, paid: false }
    ],
    summary: {
      stats: {
        duration: 7,
        activities: 24,
        totalSpent: 935,
        photosUploaded: 156,
        consensus: 92
      },
      diaryEntries: [
        { day: 1, author: "Alice", content: "Amazing start to our trip.", photos: 12 },
        { day: 2, author: "Bob", content: "Tsukiji was worth the early wake-up.", photos: 8 }
      ],
      reflections: {
        wins: [
          "Early morning temple visits avoided crowds",
          "Group voting kept everyone happy"
        ],
        lessons: [
          "Book popular restaurants ahead",
          "Keep a weather backup plan"
        ],
        quote: "Best planned trip we have ever had!"
      }
    }
  }
];

export const seedCommunityPosts: CommunityPost[] = [
  {
    id: "community_1",
    tripId: "trip_tokyo_1",
    title: "7 Days in Tokyo: A Perfect Balance of Traditional & Modern",
    location: "Tokyo, Japan",
    authorName: "Sarah Chen",
    tags: ["Cultural", "Food", "Photography"],
    likes: 342,
    comments: 28,
    saves: 156,
    image: "https://images.unsplash.com/photo-1685053361005-17fee61b704e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
  }
];
