"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth/auth.controller");
const auth_service_1 = require("./auth/auth.service");
const trips_controller_1 = require("./trips/trips.controller");
const trips_service_1 = require("./trips/trips.service");
const workspace_controller_1 = require("./workspace/workspace.controller");
const workspace_service_1 = require("./workspace/workspace.service");
const expenses_controller_1 = require("./expenses/expenses.controller");
const expenses_service_1 = require("./expenses/expenses.service");
const summary_controller_1 = require("./summary/summary.controller");
const summary_service_1 = require("./summary/summary.service");
const community_controller_1 = require("./community/community.controller");
const community_service_1 = require("./community/community.service");
const ai_controller_1 = require("./ai/ai.controller");
const ai_service_1 = require("./ai/ai.service");
const amap_service_1 = require("./ai/amap.service");
const llm_service_1 = require("./ai/llm.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            auth_controller_1.AuthController,
            trips_controller_1.TripsController,
            workspace_controller_1.WorkspaceController,
            expenses_controller_1.ExpensesController,
            summary_controller_1.SummaryController,
            community_controller_1.CommunityController,
            ai_controller_1.AiController,
        ],
        providers: [
            auth_service_1.AuthService,
            trips_service_1.TripsService,
            workspace_service_1.WorkspaceService,
            expenses_service_1.ExpensesService,
            summary_service_1.SummaryService,
            community_service_1.CommunityService,
            ai_service_1.AiService,
            amap_service_1.AmapService,
            llm_service_1.LlmService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map