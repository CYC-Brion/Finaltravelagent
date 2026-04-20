export declare class ExpensesService {
    getExpenses(tripId: string): any;
    addExpense(tripId: string, body: Record<string, unknown>): {
        id: string;
    } | null;
    getSettlement(tripId: string): any;
    markSettlementPaid(tripId: string, settlementId: string): any;
}
