import { cn } from "../../../lib/utils";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface BudgetProgressProps {
  current: number;
  budget: number;
  currency?: string;
  showDetails?: boolean;
  className?: string;
}

export function BudgetProgress({
  current,
  budget,
  currency = "USD",
  showDetails = true,
  className,
}: BudgetProgressProps) {
  const percentage = (current / budget) * 100;
  const remaining = budget - current;
  const isOverBudget = percentage > 100;
  const isNearLimit = percentage > 85 && percentage <= 100;

  const getProgressColor = () => {
    if (isOverBudget) return "bg-danger-500";
    if (isNearLimit) return "bg-warning-500";
    return "bg-gradient-to-r from-primary-500 to-primary-400";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {showDetails && (
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-neutral-900">
                {formatCurrency(current)}
              </span>
              <span className="text-sm text-neutral-500">
                of {formatCurrency(budget)}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {isOverBudget ? (
                <>
                  <TrendingUp className="w-4 h-4 text-danger-500" />
                  <span className="text-sm font-medium text-danger-600">
                    {formatCurrency(Math.abs(remaining))} over budget
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-success-500" />
                  <span className="text-sm font-medium text-success-600">
                    {formatCurrency(remaining)} remaining
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="text-right">
            <div
              className={cn(
                "text-2xl font-bold",
                isOverBudget
                  ? "text-danger-600"
                  : isNearLimit
                  ? "text-warning-600"
                  : "text-primary-600"
              )}
            >
              {Math.round(percentage)}%
            </div>
            <div className="text-xs text-neutral-500">used</div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500 relative",
              getProgressColor()
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>

        {isNearLimit && !isOverBudget && (
          <div className="flex items-center gap-2 px-3 py-2 bg-warning-50 border border-warning-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-warning-600 shrink-0" />
            <span className="text-xs text-warning-700">
              Approaching budget limit
            </span>
          </div>
        )}

        {isOverBudget && (
          <div className="flex items-center gap-2 px-3 py-2 bg-danger-50 border border-danger-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-danger-600 shrink-0" />
            <span className="text-xs text-danger-700 font-medium">
              Budget exceeded by {formatCurrency(Math.abs(remaining))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
