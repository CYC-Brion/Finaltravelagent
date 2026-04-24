import { Injectable } from "@nestjs/common";
import { mockStore } from "../common/mock-store";

@Injectable()
export class WorkspaceService {
  getItinerary(tripId: string) {
    const trip = mockStore.trips.find((item: any) => item.id === tripId);
    return trip?.itinerary || [];
  }

  createActivity(tripId: string, body: Record<string, unknown>) {
    const trip = mockStore.trips.find((item: any) => item.id === tripId);
    if (!trip) return null;

    const newActivity = {
      id: `activity_${Date.now()}`,
      dayNumber: Number(body.dayNumber || 1),
      time: String(body.time || "9:00 AM"),
      name: String(body.name || "New activity"),
      location: String(body.location || ""),
      duration: String(body.duration || "1h"),
      cost: Number(body.cost || 0),
      status: "proposed",
      votes: { for: 0, against: 0, userVote: 0 },
      comments: [],
    };

    const day = trip.itinerary.find((item: any) => item.day === newActivity.dayNumber);
    if (day) {
      day.activities.push(newActivity);
    } else {
      trip.itinerary.push({
        day: newActivity.dayNumber,
        dateLabel: `Day ${newActivity.dayNumber}`,
        activities: [newActivity],
      });
    }

    return newActivity;
  }

  updateActivity(activityId: string, body: Record<string, unknown>) {
    const result = this.findActivity(activityId);
    if (!result) return null;
    Object.assign(result.activity, body);
    return result.activity;
  }

  moveActivity(activityId: string, targetDayNumber: number, targetIndex?: number) {
    const result = this.findActivity(activityId);
    if (!result) return null;

    const sourceDay = result.day;
    const sourceIndex = sourceDay.activities.findIndex((item: any) => item.id === activityId);
    if (sourceIndex === -1) return null;

    const [activity] = sourceDay.activities.splice(sourceIndex, 1);

    let targetDay = result.trip.itinerary.find((item: any) => item.day === Number(targetDayNumber));
    if (!targetDay) {
      targetDay = {
        day: Number(targetDayNumber),
        dateLabel: `Day ${Number(targetDayNumber)}`,
        activities: [],
      };
      result.trip.itinerary.push(targetDay);
      result.trip.itinerary.sort((a: any, b: any) => a.day - b.day);
    }

    const normalizedIndex =
      typeof targetIndex === "number"
        ? Math.max(0, Math.min(targetIndex, targetDay.activities.length))
        : targetDay.activities.length;

    activity.dayNumber = Number(targetDayNumber);
    targetDay.activities.splice(normalizedIndex, 0, activity);

    result.trip.activityFeed.unshift({
      id: `feed_${Date.now()}`,
      user: "Demo Traveler",
      action: `moved ${activity.name} to Day ${Number(targetDayNumber)}`,
      time: "just now",
    });

    return activity;
  }

  vote(activityId: string, direction: 1 | -1) {
    const result = this.findActivity(activityId);
    if (!result) return null;

    if (direction === 1) result.activity.votes.for += 1;
    if (direction === -1) result.activity.votes.against += 1;
    result.activity.votes.userVote = direction;
    result.trip.activityFeed.unshift({
      id: `feed_${Date.now()}`,
      user: "Demo Traveler",
      action: `voted on ${result.activity.name}`,
      time: "just now",
    });

    return { ...result.activity, event: "vote.created" };
  }

  addComment(activityId: string, body: string) {
    const result = this.findActivity(activityId);
    if (!result) return null;

    const comment = {
      id: `comment_${Date.now()}`,
      activityId,
      authorName: "Demo Traveler",
      body,
      createdAt: new Date().toISOString(),
    };

    result.activity.comments.unshift(comment);
    result.trip.activityFeed.unshift({
      id: `feed_${Date.now()}`,
      user: "Demo Traveler",
      action: `commented on ${result.activity.name}`,
      time: "just now",
    });

    return { ...comment, event: "comment.created" };
  }

  getActivityFeed(tripId: string) {
    const trip = mockStore.trips.find((item: any) => item.id === tripId);
    return trip?.activityFeed || [];
  }

  checkIn(activityId: string) {
    const result = this.findActivity(activityId);
    if (!result) return null;
    result.activity.status = "completed";
    result.trip.activityFeed.unshift({
      id: `feed_${Date.now()}`,
      user: "Demo Traveler",
      action: `checked in at ${result.activity.name}`,
      time: "just now",
    });
    return result.activity;
  }

  private findActivity(activityId: string) {
    for (const trip of mockStore.trips) {
      for (const day of trip.itinerary) {
        const activity = day.activities.find((item: any) => item.id === activityId);
        if (activity) {
          return { trip, day, activity };
        }
      }
    }

    return null;
  }
}
