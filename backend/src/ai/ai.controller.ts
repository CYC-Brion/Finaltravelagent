import { Controller, Post, Body, Param, Delete, Get, Res, Header } from "@nestjs/common";
import { Response } from "express";
import { AiService } from "./ai.service";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("hotels/search")
  async searchHotels(
    @Body()
    body: {
      destination: string;
      checkInDate?: string;
      checkOutDate?: string;
      adults?: number;
      minRating?: number;
      minPrice?: number;
      maxPrice?: number;
      maxResults?: number;
    },
  ) {
    return await this.aiService.searchHotels(body);
  }

  @Post("chat/stream")
  @Header("Content-Type", "text/event-stream")
  @Header("Cache-Control", "no-cache")
  @Header("Connection", "keep-alive")
  @Header("Access-Control-Allow-Origin", "*")
  @Header("X-Accel-Buffering", "no")
  streamChat(
    @Body()
    body: {
      message: string;
      sessionId?: string;
      context?: Record<string, unknown>;
    },
    @Res() res: Response,
  ): Observable<void> {
    const { message, sessionId, context } = body;

    return new Observable<void>((observer) => {
      const sendEvent = (event: string, data: unknown) => {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
      };

      const sendChunk = (content: string) => {
        res.write(`event: chunk\ndata: ${JSON.stringify({ content })}\n\n`);
      };

      const sendDone = () => {
        res.write(`event: done\ndata: ${JSON.stringify({})}\n\n`);
        res.end();
        observer.complete();
      };

      const sendError = (error: string) => {
        res.write(`event: error\ndata: ${JSON.stringify({ error })}\n\n`);
        res.end();
        observer.error(new Error(error));
      };

      // Start streaming response
      this.aiService.chatStream(message, sessionId, context || {}, {
        onToolCall: (toolName, args) => {
          sendEvent("tool_call", { tool: toolName, args });
        },
        onToolResult: (toolName, result) => {
          sendEvent("tool_result", { tool: toolName, result });
        },
        onChunk: (content) => {
          sendChunk(content);
        },
        onDone: (finalReply, toolResults, history) => {
          sendDone();
        },
        onError: (error) => {
          sendError(error);
        },
      });
    });
  }

  @Post("chat")
  async chat(
    @Body()
    body: {
      message: string;
      sessionId?: string;
      context?: Record<string, unknown>;
    },
  ) {
    return await this.aiService.chat(body.message, body.sessionId, body.context || {});
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
