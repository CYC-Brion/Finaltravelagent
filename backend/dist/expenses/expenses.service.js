"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const mock_store_1 = require("../common/mock-store");
let ExpensesService = class ExpensesService {
    getExpenses(tripId) {
        const trip = mock_store_1.mockStore.trips.find((item) => item.id === tripId);
        return trip?.expenses || [];
    }
    addExpense(tripId, body) {
        const trip = mock_store_1.mockStore.trips.find((item) => item.id === tripId);
        if (!trip)
            return null;
        const expense = { id: `expense_${Date.now()}`, ...body };
        trip.expenses.unshift(expense);
        trip.activityFeed.unshift({
            id: `feed_${Date.now()}`,
            user: String(body.paidBy || "Traveler"),
            action: `logged expense: ${String(body.description || "new expense")}`,
            time: "just now",
        });
        return expense;
    }
    getSettlement(tripId) {
        const trip = mock_store_1.mockStore.trips.find((item) => item.id === tripId);
        return trip?.settlements || [];
    }
    markSettlementPaid(tripId, settlementId) {
        const trip = mock_store_1.mockStore.trips.find((item) => item.id === tripId);
        const settlement = trip?.settlements.find((item) => item.id === settlementId);
        if (!settlement)
            return null;
        settlement.paid = true;
        trip.activityFeed.unshift({
            id: `feed_${Date.now()}`,
            user: settlement.from,
            action: `settled payment to ${settlement.to}`,
            time: "just now",
        });
        return settlement;
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)()
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map