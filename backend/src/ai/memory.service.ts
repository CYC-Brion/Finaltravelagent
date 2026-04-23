import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

type MemoryType = "preference" | "itinerary_change" | "constraint";
type MemorySource = "ai_suggestion" | "user_feedback" | "vote_result";

type MemoryContent = {
  key: string;
  value: unknown;
};

@Injectable()
export class MemoryService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async addMemory(
    tripId: string,
    memoryType: MemoryType,
    content: MemoryContent,
    source: MemorySource,
    userId?: string,
  ): Promise<void> {
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
      where: { tripId },
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
}
