import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { TripsService } from "./trips.service";

@Controller("trips")
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  listTrips() {
    return this.tripsService.listTrips();
  }

  @Post()
  createTrip(@Body() body: Record<string, unknown>) {
    return this.tripsService.createTrip(body);
  }

  @Get(":tripId")
  getTrip(@Param("tripId") tripId: string) {
    return this.tripsService.getTrip(tripId);
  }

  @Patch(":tripId")
  updateTrip(@Param("tripId") tripId: string, @Body() body: Record<string, unknown>) {
    return this.tripsService.updateTrip(tripId, body);
  }

  @Post(":tripId/ai-draft/generate")
  generateDraft(@Param("tripId") tripId: string) {
    return this.tripsService.generateDraft(tripId);
  }

  @Get(":tripId/ai-draft")
  getAiDraft(@Param("tripId") tripId: string) {
    return this.tripsService.getAiDraft(tripId);
  }

  @Post(":tripId/ai-suggestions/:suggestionId/respond")
  respondToSuggestion(
    @Param("tripId") tripId: string,
    @Param("suggestionId") suggestionId: string,
    @Body() body: { response: "accepted" | "dismissed" },
  ) {
    return this.tripsService.respondToSuggestion(tripId, suggestionId, body.response);
  }

  @Post(":tripId/community-publish")
  publishTrip(@Param("tripId") tripId: string) {
    return this.tripsService.publishTrip(tripId);
  }

  @Get(":tripId/on-trip/today")
  getOnTripToday(@Param("tripId") tripId: string) {
    return this.tripsService.getOnTripToday(tripId);
  }
}
