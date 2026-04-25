import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { WorkspaceService } from "./workspace.service";

@Controller()
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get("trips/:tripId/itinerary")
  getItinerary(@Param("tripId") tripId: string) {
    return this.workspaceService.getItinerary(tripId);
  }

  @Post("trips/:tripId/activities")
  createActivity(@Param("tripId") tripId: string, @Body() body: Record<string, unknown>) {
    return this.workspaceService.createActivity(tripId, body);
  }

  @Patch("activities/:activityId")
  updateActivity(@Param("activityId") activityId: string, @Body() body: Record<string, unknown>) {
    return this.workspaceService.updateActivity(activityId, body);
  }

  @Post("activities/:activityId/move")
  moveActivity(
    @Param("activityId") activityId: string,
    @Body() body: { targetDayNumber: number; targetIndex?: number },
  ) {
    return this.workspaceService.moveActivity(activityId, body.targetDayNumber, body.targetIndex);
  }

  @Post("activities/:activityId/swap")
  swapActivities(
    @Param("activityId") activityId: string,
    @Body() body: { targetActivityId: string },
  ) {
    return this.workspaceService.swapActivities(activityId, body.targetActivityId);
  }

  @Post("activities/:activityId/votes")
  voteOnActivity(@Param("activityId") activityId: string, @Body() body: { direction: 1 | -1 }) {
    return this.workspaceService.vote(activityId, body.direction);
  }

  @Post("activities/:activityId/comments")
  addComment(@Param("activityId") activityId: string, @Body() body: { body: string }) {
    return this.workspaceService.addComment(activityId, body.body);
  }

  @Get("trips/:tripId/activity-feed")
  getActivityFeed(@Param("tripId") tripId: string) {
    return this.workspaceService.getActivityFeed(tripId);
  }

  @Post("activities/:activityId/check-in")
  checkIn(@Param("activityId") activityId: string) {
    return this.workspaceService.checkIn(activityId);
  }
}
