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
exports.SummaryController = void 0;
const common_1 = require("@nestjs/common");
const summary_service_1 = require("./summary.service");
let SummaryController = class SummaryController {
    constructor(summaryService) {
        this.summaryService = summaryService;
    }
    getSummary(tripId) {
        return this.summaryService.getSummary(tripId);
    }
    addDiaryEntry(tripId, body) {
        return this.summaryService.addDiaryEntry(tripId, body);
    }
};
exports.SummaryController = SummaryController;
__decorate([
    (0, common_1.Get)("trips/:tripId/summary"),
    __param(0, (0, common_1.Param)("tripId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SummaryController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Post)("trips/:tripId/summary/diary"),
    __param(0, (0, common_1.Param)("tripId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SummaryController.prototype, "addDiaryEntry", null);
exports.SummaryController = SummaryController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [summary_service_1.SummaryService])
], SummaryController);
//# sourceMappingURL=summary.controller.js.map