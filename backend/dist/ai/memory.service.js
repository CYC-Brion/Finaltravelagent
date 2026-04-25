"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let MemoryService = class MemoryService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async shouldSkipDuplicate(tripId, memoryType, content) {
        const existing = await this.prisma.tripMemory.findMany({
            where: { tripId, memoryType },
            orderBy: { createdAt: "desc" },
            take: 50,
        });
        return existing.some((item) => {
            try {
                const parsed = JSON.parse(item.content);
                return parsed.key === content.key && JSON.stringify(parsed.value) === JSON.stringify(content.value);
            }
            catch {
                return false;
            }
        });
    }
    async addMemory(tripId, memoryType, content, source, userId) {
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
    async getMemories(tripId) {
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
            content: JSON.parse(m.content),
            source: m.source,
            createdAt: m.createdAt,
        }));
    }
    async getMemoryContext(tripId) {
        const memories = await this.getMemories(tripId);
        if (memories.length === 0) {
            return "";
        }
        const lines = ["## Previous Context from this Trip:"];
        for (const memory of memories) {
            if (memory.memoryType === "preference") {
                lines.push(`- User preference: ${memory.content.key} = ${JSON.stringify(memory.content.value)}`);
            }
            else if (memory.memoryType === "itinerary_change") {
                lines.push(`- Itinerary change: ${memory.content.key} = ${JSON.stringify(memory.content.value)}`);
            }
            else if (memory.memoryType === "constraint") {
                lines.push(`- Constraint: ${memory.content.key} = ${JSON.stringify(memory.content.value)}`);
            }
        }
        return lines.join("\n");
    }
    async recordPreference(tripId, key, value, source, userId) {
        await this.addMemory(tripId, "preference", { key, value }, source, userId);
    }
    async recordItineraryChange(tripId, change, details, source, userId) {
        await this.addMemory(tripId, "itinerary_change", { key: change, value: details }, source, userId);
    }
    async recordConstraint(tripId, constraint, value, source, userId) {
        await this.addMemory(tripId, "constraint", { key: constraint, value }, source, userId);
    }
    async clearMemories(tripId) {
        await this.prisma.tripMemory.deleteMany({
            where: { tripId },
        });
    }
    async appendSessionMessages(tripId, messages) {
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
                }),
            })),
        });
    }
    async loadSessionMessages(tripId, sessionId, limit = 40) {
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
                return JSON.parse(row.content);
            }
            catch {
                return null;
            }
        })
            .filter((item) => Boolean(item))
            .map((item) => ({ role: item.role, content: item.content, timestamp: item.timestamp }));
        return parsed;
    }
    async clearSessionMessages(tripId, sessionId) {
        await this.prisma.tripMemory.deleteMany({
            where: {
                tripId,
                memoryType: "session_message",
                content: { contains: `\"sessionId\":\"${sessionId}\"` },
            },
        });
    }
    async addQualityLog(tripId, log) {
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
    async getQualitySummary(tripId, limit = 200) {
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
                return JSON.parse(row.content);
            }
            catch {
                return null;
            }
        })
            .filter((item) => Boolean(item));
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
};
exports.MemoryService = MemoryService;
exports.MemoryService = MemoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MemoryService);
//# sourceMappingURL=memory.service.js.map