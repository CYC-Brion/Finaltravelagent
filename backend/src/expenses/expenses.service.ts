import { Injectable } from "@nestjs/common";
import { mockStore } from "../common/mock-store";

@Injectable()
export class ExpensesService {
  getExpenses(tripId: string) {
    const trip = mockStore.trips.find((item: any) => item.id === tripId);
    return trip?.expenses || [];
  }

  addExpense(tripId: string, body: Record<string, unknown>) {
    const trip = mockStore.trips.find((item: any) => item.id === tripId);
    if (!trip) return null;

    const expense = { id: `expense_${Date.now()}`, ...body };
    trip.expenses.unshift(expense as never);
    trip.activityFeed.unshift({
      id: `feed_${Date.now()}`,
      user: String(body.paidBy || "Traveler"),
      action: `logged expense: ${String(body.description || "new expense")}`,
      time: "just now",
    });
    return expense;
  }

  getSettlement(tripId: string) {
    const trip = mockStore.trips.find((item: any) => item.id === tripId);
    return trip?.settlements || [];
  }

  markSettlementPaid(tripId: string, settlementId: string) {
    const trip = mockStore.trips.find((item: any) => item.id === tripId);
    const settlement = trip?.settlements.find((item: any) => item.id === settlementId);
    if (!settlement) return null;
    settlement.paid = true;
    trip.activityFeed.unshift({
      id: `feed_${Date.now()}`,
      user: settlement.from,
      action: `settled payment to ${settlement.to}`,
      time: "just now",
    });
    return settlement;
  }
}
