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
exports.WorkspaceController = void 0;
const common_1 = require("@nestjs/common");
const workspace_service_1 = require("./workspace.service");
let WorkspaceController = class WorkspaceController {
    constructor(workspaceService) {
        this.workspaceService = workspaceService;
    }
    getItinerary(tripId) {
        return this.workspaceService.getItinerary(tripId);
    }
    createActivity(tripId, body) {
        return this.workspaceService.createActivity(tripId, body);
    }
    updateActivity(activityId, body) {
        return this.workspaceService.updateActivity(activityId, body);
    }
    voteOnActivity(activityId, body) {
        return this.workspaceService.vote(activityId, body.direction);
    }
    addComment(activityId, body) {
        return this.workspaceService.addComment(activityId, body.body);
    }
    getActivityFeed(tripId) {
        return this.workspaceService.getActivityFeed(tripId);
    }
    checkIn(activityId) {
        return this.workspaceService.checkIn(activityId);
    }
};
exports.WorkspaceController = WorkspaceController;
__decorate([
    (0, common_1.Get)("trips/:tripId/itinerary"),
    __param(0, (0, common_1.Param)("tripId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "getItinerary", null);
__decorate([
    (0, common_1.Post)("trips/:tripId/activities"),
    __param(0, (0, common_1.Param)("tripId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "createActivity", null);
__decorate([
    (0, common_1.Patch)("activities/:activityId"),
    __param(0, (0, common_1.Param)("activityId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "updateActivity", null);
__decorate([
    (0, common_1.Post)("activities/:activityId/votes"),
    __param(0, (0, common_1.Param)("activityId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "voteOnActivity", null);
__decorate([
    (0, common_1.Post)("activities/:activityId/comments"),
    __param(0, (0, common_1.Param)("activityId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "addComment", null);
__decorate([
    (0, common_1.Get)("trips/:tripId/activity-feed"),
    __param(0, (0, common_1.Param)("tripId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "getActivityFeed", null);
__decorate([
    (0, common_1.Post)("activities/:activityId/check-in"),
    __param(0, (0, common_1.Param)("activityId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "checkIn", null);
exports.WorkspaceController = WorkspaceController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [workspace_service_1.WorkspaceService])
], WorkspaceController);
//# sourceMappingURL=workspace.controller.js.map