import { ExpensesService } from "./expenses.service";
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    getExpenses(tripId: string): any;
    addExpense(tripId: string, body: Record<string, unknown>): {
        id: string;
    } | null;
    getSettlement(tripId: string): any;
    markSettlementPaid(tripId: string, settlementId: string): any;
}
