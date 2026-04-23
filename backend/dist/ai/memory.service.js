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
    async addMemory(tripId, memoryType, content, source, userId) {
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
            where: { tripId },
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
};
exports.MemoryService = MemoryService;
exports.MemoryService = MemoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MemoryService);
//# sourceMappingURL=memory.service.js.map