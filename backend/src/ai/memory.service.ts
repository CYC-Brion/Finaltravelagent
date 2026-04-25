import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

type MemoryType = "preference" | "itinerary_change" | "constraint";
type MemorySource = "ai_suggestion" | "user_feedback" | "vote_result";

type MemoryContent = {
  key: string;
  value: unknown;
};

type SessionMessageContent = {
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

type QualityLogContent = {
  sessionId: string;
  messageLength: number;
  responseLength: number;
  toolCallCount: number;
  toolNames: string[];
  toolDurationsMs: number[];
  totalLatencyMs: number;
  llmCalls: number;
  fallbackTriggered: boolean;
  error?: string;
  createdAt: string;
};

@Injectable()
export class MemoryService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private async shouldSkipDuplicate(
    tripId: string,
    memoryType: MemoryType,
    content: MemoryContent,
  ): Promise<boolean> {
    const existing = await this.prisma.tripMemory.findMany({
      where: { tripId, memoryType },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return existing.some((item) => {
      try {
        const parsed = JSON.parse(item.content) as MemoryContent;
        return parsed.key === content.key && JSON.stringify(parsed.value) === JSON.stringify(content.value);
      } catch {
        return false;
      }
    });
  }

  async addMemory(
    tripId: string,
    memoryType: MemoryType,
    content: MemoryContent,
    source: MemorySource,
    userId?: string,
  ): Promise<void> {
    const skip = await this.shouldSkipDuplicate(tripId, memoryType, content);
    if (skip) {
      return;
    }

    await this.prisma.tripMemory.create({
      data: {
        tripId,
        userId,
        memoryType,
        content: JSON.stringify(content),
        source,
      },
    });
  }

  async getMemories(tripId: string): Promise<Array<{
    memoryType: string;
    content: MemoryContent;
    source: string;
    createdAt: Date;
  }>> {
    const memories = await this.prisma.tripMemory.findMany({
      where: {
        tripId,
        memoryType: {
          in: ["preference", "itinerary_change", "constraint"],
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return memories.map((m) => ({
      memoryType: m.memoryType,
      content: JSON.parse(m.content) as MemoryContent,
      source: m.source,
      createdAt: m.createdAt,
    }));
  }

  async getMemoryContext(tripId: string): Promise<string> {
    const memories = await this.getMemories(tripId);

    if (memories.length === 0) {
      return "";
    }

    const lines: string[] = ["## Previous Context from this Trip:"];

    for (const memory of memories) {
      if (memory.memoryType === "preference") {
        lines.push(`- User preference: ${memory.content.key} = ${JSON.stringify(memory.content.value)}`);
      } else if (memory.memoryType === "itinerary_change") {
        lines.push(`- Itinerary change: ${memory.content.key} = ${JSON.stringify(memory.content.value)}`);
      } else if (memory.memoryType === "constraint") {
        lines.push(`- Constraint: ${memory.content.key} = ${JSON.stringify(memory.content.value)}`);
      }
    }

    return lines.join("\n");
  }

  async recordPreference(tripId: string, key: string, value: unknown, source: MemorySource, userId?: string): Promise<void> {
    await this.addMemory(tripId, "preference", { key, value }, source, userId);
  }

  async recordItineraryChange(tripId: string, change: string, details: unknown, source: MemorySource, userId?: string): Promise<void> {
    await this.addMemory(tripId, "itinerary_change", { key: change, value: details }, source, userId);
  }

  async recordConstraint(tripId: string, constraint: string, value: unknown, source: MemorySource, userId?: string): Promise<void> {
    await this.addMemory(tripId, "constraint", { key: constraint, value }, source, userId);
  }

  async clearMemories(tripId: string): Promise<void> {
    await this.prisma.tripMemory.deleteMany({
      where: { tripId },
    });
  }

  async appendSessionMessages(
    tripId: string,
    messages: Array<{ sessionId: string; role: "user" | "assistant"; content: string; timestamp: string }>,
  ): Promise<void> {
    if (!tripId || messages.length === 0) {
      return;
    }

    await this.prisma.tripMemory.createMany({
      data: messages.map((item) => ({
        tripId,
        userId: null,
        memoryType: "session_message",
        source: "user_feedback",
        content: JSON.stringify({
          sessionId: item.sessionId,
          role: item.role,
          content: item.content,
          timestamp: item.timestamp,
        } satisfies SessionMessageContent),
      })),
    });
  }

  async loadSessionMessages(
    tripId: string,
    sessionId: string,
    limit = 40,
  ): Promise<Array<{ role: "user" | "assistant"; content: string; timestamp: string }>> {
    const rows = await this.prisma.tripMemory.findMany({
      where: {
        tripId,
        memoryType: "session_message",
        content: { contains: `\"sessionId\":\"${sessionId}\"` },
      },
      orderBy: { createdAt: "asc" },
      take: Math.max(1, limit),
    });

    const parsed = rows
      .map((row) => {
        try {
          return JSON.parse(row.content) as SessionMessageContent;
        } catch {
          return null;
        }
      })
      .filter((item): item is SessionMessageContent => Boolean(item))
      .map((item) => ({ role: item.role, content: item.content, timestamp: item.timestamp }));

    return parsed;
  }

  async clearSessionMessages(tripId: string, sessionId: string): Promise<void> {
    await this.prisma.tripMemory.deleteMany({
      where: {
        tripId,
        memoryType: "session_message",
        content: { contains: `\"sessionId\":\"${sessionId}\"` },
      },
    });
  }

  async addQualityLog(tripId: string, log: QualityLogContent): Promise<void> {
    await this.prisma.tripMemory.create({
      data: {
        tripId,
        userId: null,
        memoryType: "quality_log",
        source: "ai_suggestion",
        content: JSON.stringify(log),
      },
    });
  }

  async getQualitySummary(tripId: string, limit = 200) {
    const rows = await this.prisma.tripMemory.findMany({
      where: {
        tripId,
        memoryType: "quality_log",
      },
      orderBy: { createdAt: "desc" },
      take: Math.max(1, limit),
    });

    const logs = rows
      .map((row) => {
        try {
          return JSON.parse(row.content) as QualityLogContent;
        } catch {
          return null;
        }
      })
      .filter((item): item is QualityLogContent => Boolean(item));

    const total = logs.length;
    const fallbackCount = logs.filter((item) => item.fallbackTriggered).length;
    const avgToolCalls = total > 0 ? logs.reduce((sum, item) => sum + item.toolCallCount, 0) / total : 0;
    const avgLatencyMs = total > 0 ? logs.reduce((sum, item) => sum + item.totalLatencyMs, 0) / total : 0;

    return {
      total,
      fallbackCount,
      fallbackRate: total > 0 ? Number((fallbackCount / total).toFixed(3)) : 0,
      avgToolCalls: Number(avgToolCalls.toFixed(2)),
      avgLatencyMs: Number(avgLatencyMs.toFixed(2)),
      latest: logs.slice(0, 20),
    };
  }
}
