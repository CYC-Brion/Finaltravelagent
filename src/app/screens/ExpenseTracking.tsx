import { Globe, DollarSign, Plus, Receipt, Users, ArrowRight, ArrowLeft, TrendingUp, Utensils, Home, MapPin, ShoppingBag, Plane } from "lucide-react";
import { useState } from "react";
import { BudgetProgress } from "../components/helloworld/BudgetProgress";

interface ExpenseTrackingProps {
  onBack: () => void;
  onContinue?: () => void;
}

export function ExpenseTracking({ onBack, onContinue }: ExpenseTrackingProps) {
  const [view, setView] = useState<"expenses" | "settlement">("expenses");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const expenses = [
    { id: 1, date: "Apr 15", category: "Food", description: "Lunch at Asakusa", amount: 85, paidBy: "Alice", splitWith: ["Alice", "Bob", "Carol", "David"] },
    { id: 2, date: "Apr 15", category: "Activity", description: "Tokyo Skytree tickets", amount: 140, paidBy: "Bob", splitWith: ["Alice", "Bob", "Carol", "David"] },
    { id: 3, date: "Apr 16", category: "Food", description: "Tsukiji Market breakfast", amount: 65, paidBy: "Carol", splitWith: ["Alice", "Bob", "Carol"] },
    { id: 4, date: "Apr 16", category: "Transport", description: "JR Pass", amount: 280, paidBy: "Alice", splitWith: ["Alice", "Bob", "Carol", "David"] },
    { id: 5, date: "Apr 16", category: "Shopping", description: "Ginza purchases", amount: 320, paidBy: "David", splitWith: ["David"] },
    { id: 6, date: "Apr 17", category: "Food", description: "Harajuku crepes", amount: 45, paidBy: "Bob", splitWith: ["Bob", "Carol", "David"] },
  ];

  const categories = [
    { id: "food", name: "Food", icon: Utensils, color: "primary", total: 195 },
    { id: "activity", name: "Activities", icon: MapPin, color: "success", total: 140 },
    { id: "transport", name: "Transport", icon: Plane, color: "info", total: 280 },
    { id: "shopping", name: "Shopping", icon: ShoppingBag, color: "warning", total: 320 },
    { id: "accommodation", name: "Lodging", icon: Home, color: "neutral", total: 0 },
  ];

  const settlements = [
    { from: "Bob", to: "Alice", amount: 105 },
    { from: "Carol", to: "Alice", amount: 48 },
    { from: "David", to: "Bob", amount: 15 },
  ];

  const members = [
    { name: "Alice", paid: 365, owes: 0, balance: 152 },
    { name: "Bob", paid: 185, owes: 105, balance: -55 },
    { name: "Carol", paid: 65, owes: 48, balance: -180 },
    { name: "David", paid: 320, owes: 0, balance: 83 },
  ];

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const budget = 2000 * 4;

  const filteredExpenses = selectedCategory
    ? expenses.filter(e => e.category.toLowerCase() === selectedCategory)
    : expenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-sm font-semibold text-neutral-900">Tokyo Adventure</span>
                <p className="text-xs text-neutral-500">Expense Tracking</p>
              </div>
            </div>
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center gap-2 text-sm shadow-sm">
              <Plus className="w-4 h-4" />
              Add Expense
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* View Toggle */}
        <div className="mb-8 bg-white rounded-xl p-2 border border-neutral-200 inline-flex">
          <button
            onClick={() => setView("expenses")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              view === "expenses"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              <span>Expenses</span>
            </div>
          </button>
          <button
            onClick={() => setView("settlement")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              view === "settlement"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Settlement</span>
            </div>
          </button>
        </div>

        {view === "expenses" ? (
          <div className="grid grid-cols-3 gap-8">
            {/* Left: Budget & Categories */}
            <div className="space-y-6">
              {/* Budget */}
              <div className="bg-white rounded-xl p-6 border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">Total Budget</h3>
                <BudgetProgress current={totalSpent} budget={budget} />
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl p-6 border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full p-3 rounded-lg border transition-all text-left ${
                      !selectedCategory
                        ? "border-primary-300 bg-primary-50"
                        : "border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-neutral-900">All expenses</span>
                      <span className="text-sm font-semibold text-neutral-700">${totalSpent}</span>
                    </div>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full p-3 rounded-lg border transition-all text-left ${
                        selectedCategory === cat.id
                          ? "border-primary-300 bg-primary-50"
                          : "border-neutral-200 hover:bg-neutral-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <cat.icon className="w-5 h-5 text-neutral-600" />
                        <div className="flex-1">
                          <div className="font-medium text-neutral-900">{cat.name}</div>
                          <div className="text-xs text-neutral-500">${cat.total}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-white rounded-xl p-6 border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">Breakdown</h3>
                <div className="space-y-3">
                  {categories.filter(c => c.total > 0).map((cat) => (
                    <div key={cat.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-neutral-600">{cat.name}</span>
                        <span className="text-sm font-semibold text-neutral-900">
                          {Math.round((cat.total / totalSpent) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-400"
                          style={{ width: `${(cat.total / totalSpent) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Expense List */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-900">
                  {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : "All Expenses"}
                </h2>
                <span className="text-sm text-neutral-500">{filteredExpenses.length} transactions</span>
              </div>

              <div className="space-y-3">
                {filteredExpenses.map((expense) => (
                  <div key={expense.id} className="bg-white rounded-xl p-5 border border-neutral-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-medium text-neutral-500">{expense.date}</span>
                          <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-md text-xs font-medium">
                            {expense.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">{expense.description}</h3>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white text-xs font-semibold">
                            {expense.paidBy.charAt(0)}
                          </div>
                          <span className="text-sm text-neutral-600">Paid by <span className="font-medium">{expense.paidBy}</span></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-neutral-900">${expense.amount}</div>
                        <div className="text-xs text-neutral-500">
                          ${(expense.amount / expense.splitWith.length).toFixed(2)}/person
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-200">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500">Split with:</span>
                        <div className="flex -space-x-1.5">
                          {expense.splitWith.map((person, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                              title={person}
                            >
                              {person.charAt(0)}
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-neutral-500">({expense.splitWith.length})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {/* Left: Member Balances */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-neutral-900">Member Balances</h2>
              {members.map((member) => (
                <div key={member.name} className="bg-white rounded-xl p-5 border border-neutral-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white text-sm font-semibold">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-neutral-900">{member.name}</div>
                      <div className="text-xs text-neutral-500">
                        {member.balance > 0 ? "Gets back" : member.balance < 0 ? "Owes" : "Settled"}
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${
                      member.balance > 0
                        ? "text-success-600"
                        : member.balance < 0
                        ? "text-danger-600"
                        : "text-neutral-400"
                    }`}>
                      ${Math.abs(member.balance)}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Paid</span>
                      <span className="font-semibold text-neutral-900">${member.paid}</span>
                    </div>
                    {member.owes > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Owes</span>
                        <span className="font-semibold text-danger-600">${member.owes}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Settlement Plan */}
            <div className="col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Settlement Plan</h2>
                <p className="text-neutral-600">Minimize transactions with optimal split calculation</p>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-6 border border-neutral-200">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                    <span className="text-sm text-neutral-600">Total Spent</span>
                  </div>
                  <div className="text-3xl font-bold text-neutral-900">${totalSpent}</div>
                  <div className="text-xs text-neutral-500 mt-1">${(totalSpent / 4).toFixed(2)} per person</div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-neutral-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-success-600" />
                    <span className="text-sm text-neutral-600">Settled</span>
                  </div>
                  <div className="text-3xl font-bold text-success-600">1</div>
                  <div className="text-xs text-neutral-500 mt-1">out of 4 members</div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-neutral-200">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-5 h-5 text-warning-600" />
                    <span className="text-sm text-neutral-600">Transactions</span>
                  </div>
                  <div className="text-3xl font-bold text-neutral-900">{settlements.length}</div>
                  <div className="text-xs text-neutral-500 mt-1">to settle everything</div>
                </div>
              </div>

              {/* Settlement Instructions */}
              <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-200">
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">How to settle</h3>
                  <p className="text-sm text-neutral-600">Complete these {settlements.length} transactions to balance all expenses</p>
                </div>

                {settlements.map((settlement, i) => (
                  <div key={i} className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-danger-400 to-danger-500 flex items-center justify-center text-white font-semibold">
                          {settlement.from.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900">{settlement.from}</div>
                          <div className="text-xs text-neutral-500">Sender</div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <ArrowRight className="w-6 h-6 text-neutral-400" />
                        <div className="px-4 py-2 bg-primary-50 rounded-lg">
                          <div className="text-lg font-bold text-primary-700">${settlement.amount}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-success-400 to-success-500 flex items-center justify-center text-white font-semibold">
                          {settlement.to.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900">{settlement.to}</div>
                          <div className="text-xs text-neutral-500">Receiver</div>
                        </div>
                      </div>

                      <button className="px-4 py-2 bg-success-500 text-white rounded-lg font-medium hover:bg-success-600 transition-colors text-sm">
                        Mark Paid
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Export */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors text-sm">
                    Export CSV
                  </button>
                  <button className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors text-sm">
                    Share Settlement
                  </button>
                </div>
                {onContinue && (
                  <button
                    onClick={onContinue}
                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-600 transition-colors shadow-sm flex items-center gap-2"
                  >
                    Complete Trip
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
