import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ExpensesService } from "./expenses.service";

@Controller()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get("trips/:tripId/expenses")
  getExpenses(@Param("tripId") tripId: string) {
    return this.expensesService.getExpenses(tripId);
  }

  @Post("trips/:tripId/expenses")
  addExpense(@Param("tripId") tripId: string, @Body() body: Record<string, unknown>) {
    return this.expensesService.addExpense(tripId, body);
  }

  @Get("trips/:tripId/settlement")
  getSettlement(@Param("tripId") tripId: string) {
    return this.expensesService.getSettlement(tripId);
  }

  @Post("trips/:tripId/settlement/:settlementId/mark-paid")
  markSettlementPaid(@Param("tripId") tripId: string, @Param("settlementId") settlementId: string) {
    return this.expensesService.markSettlementPaid(tripId, settlementId);
  }
}
