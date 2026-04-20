import { Module } from "@nestjs/common";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { TripsController } from "./trips/trips.controller";
import { TripsService } from "./trips/trips.service";
import { WorkspaceController } from "./workspace/workspace.controller";
import { WorkspaceService } from "./workspace/workspace.service";
import { ExpensesController } from "./expenses/expenses.controller";
import { ExpensesService } from "./expenses/expenses.service";
import { SummaryController } from "./summary/summary.controller";
import { SummaryService } from "./summary/summary.service";
import { CommunityController } from "./community/community.controller";
import { CommunityService } from "./community/community.service";
import { AiController } from "./ai/ai.controller";
import { AiService } from "./ai/ai.service";
import { AmapService } from "./ai/amap.service";
import { LlmService } from "./ai/llm.service";

@Module({
  controllers: [
    AuthController,
    TripsController,
    WorkspaceController,
    ExpensesController,
    SummaryController,
    CommunityController,
    AiController,
  ],
  providers: [
    AuthService,
    TripsService,
    WorkspaceService,
    ExpensesService,
    SummaryService,
    CommunityService,
    AiService,
    AmapService,
    LlmService,
  ],
})
export class AppModule {}
