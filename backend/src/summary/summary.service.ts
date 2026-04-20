import { Injectable } from "@nestjs/common";
import { mockStore } from "../common/mock-store";

@Injectable()
export class SummaryService {
  getSummary(tripId: string) {
    const trip = mockStore.trips.find((item: any) => item.id === tripId);
    if (!trip) return null;

    const allActivities = trip.itinerary.flatMap((day: any) => day.activities);
    const totalSpent = trip.expenses.reduce((sum: number, expense: any) => sum + Number(expense.amount || 0), 0);
    const completedActivities = allActivities.filter((activity: any) => activity.status === "completed").length;
    const consensusScore =
      allActivities.length > 0
        ? Math.round(
            (allActivities.reduce((sum: number, activity: any) => {
              const totalVotes = Number(activity.votes?.for || 0) + Number(activity.votes?.against || 0);
              return sum + (totalVotes ? Number(activity.votes?.for || 0) / totalVotes : 0.5);
            }, 0) /
              allActivities.length) *
              100,
          )
        : 0;

    return {
      ...trip.summary,
      stats: {
        ...trip.summary.stats,
        duration: trip.itinerary.length,
        activities: completedActivities || allActivities.length,
        totalSpent,
        consensus: consensusScore,
      },
    };
  }

  addDiaryEntry(tripId: string, body: Record<string, unknown>) {
    const trip = mockStore.trips.find((item: any) => item.id === tripId);
    if (!trip) return null;
    const entry = { id: `diary_${Date.now()}`, ...body };
    trip.summary.diaryEntries.unshift(entry as never);
    trip.activityFeed.unshift({
      id: `feed_${Date.now()}`,
      user: String(body.author || "Traveler"),
      action: `added a trip diary entry for day ${String(body.day || "")}`.trim(),
      time: "just now",
    });
    return entry;
  }
}
