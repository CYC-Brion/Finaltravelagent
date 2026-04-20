import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { AiService } from "./ai.service";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("chat")
  chat(
    @Body()
    body: {
      message: string;
      sessionId?: string;
      context?: Record<string, unknown>;
    },
  ) {
    return this.aiService.chat(body.message, body.sessionId, body.context || {});
  }

  @Get("sessions/:sessionId/history")
  getHistory(@Param("sessionId") sessionId: string) {
    return this.aiService.getHistory(sessionId);
  }

  @Delete("sessions/:sessionId")
  clearSession(@Param("sessionId") sessionId: string) {
    return this.aiService.clearSession(sessionId);
  }
}
