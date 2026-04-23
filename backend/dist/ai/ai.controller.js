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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
const rxjs_1 = require("rxjs");
let AiController = class AiController {
    constructor(aiService) {
        this.aiService = aiService;
    }
    async searchHotels(body) {
        return await this.aiService.searchHotels(body);
    }
    streamChat(body, res) {
        const { message, sessionId, context } = body;
        return new rxjs_1.Observable((observer) => {
            const sendEvent = (event, data) => {
                res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
            };
            const sendChunk = (content) => {
                res.write(`event: chunk\ndata: ${JSON.stringify({ content })}\n\n`);
            };
            const sendDone = () => {
                res.write(`event: done\ndata: ${JSON.stringify({})}\n\n`);
                res.end();
                observer.complete();
            };
            const sendError = (error) => {
                res.write(`event: error\ndata: ${JSON.stringify({ error })}\n\n`);
                res.end();
                observer.error(new Error(error));
            };
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
    async chat(body) {
        return await this.aiService.chat(body.message, body.sessionId, body.context || {});
    }
    getHistory(sessionId) {
        return this.aiService.getHistory(sessionId);
    }
    clearSession(sessionId) {
        return this.aiService.clearSession(sessionId);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)("hotels/search"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "searchHotels", null);
__decorate([
    (0, common_1.Post)("chat/stream"),
    (0, common_1.Header)("Content-Type", "text/event-stream"),
    (0, common_1.Header)("Cache-Control", "no-cache"),
    (0, common_1.Header)("Connection", "keep-alive"),
    (0, common_1.Header)("Access-Control-Allow-Origin", "*"),
    (0, common_1.Header)("X-Accel-Buffering", "no"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], AiController.prototype, "streamChat", null);
__decorate([
    (0, common_1.Post)("chat"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "chat", null);
__decorate([
    (0, common_1.Get)("sessions/:sessionId/history"),
    __param(0, (0, common_1.Param)("sessionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Delete)("sessions/:sessionId"),
    __param(0, (0, common_1.Param)("sessionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "clearSession", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)("ai"),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map