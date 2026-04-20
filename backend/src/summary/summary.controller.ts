import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { SummaryService } from "./summary.service";

@Controller()
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get("trips/:tripId/summary")
  getSummary(@Param("tripId") tripId: string) {
    return this.summaryService.getSummary(tripId);
  }

  @Post("trips/:tripId/summary/diary")
  addDiaryEntry(@Param("tripId") tripId: string, @Body() body: Record<string, unknown>) {
    return this.summaryService.addDiaryEntry(tripId, body);
  }
}
