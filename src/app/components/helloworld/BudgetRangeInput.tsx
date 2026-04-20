import { useState, useEffect } from "react";
import { DollarSign, AlertCircle } from "lucide-react";

interface BudgetRangeInputProps {
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}

export function BudgetRangeInput({ minValue, maxValue, onMinChange, onMaxChange }: BudgetRangeInputProps) {
  const [error, setError] = useState("");

  useEffect(() => {
    const min = parseFloat(minValue) || 0;
    const max = parseFloat(maxValue) || 0;

    if (minValue && maxValue && min > max) {
      setError("Minimum budget cannot exceed maximum");
    } else {
      setError("");
    }
  }, [minValue, maxValue]);

  const isValid = !error && minValue && maxValue;

  return (
    <div>
      <label className="block text-sm font-semibold text-neutral-700 mb-2">
        Budget range per person (USD)
      </label>

      <div className="space-y-3">
        {/* Range Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
            <input
              type="number"
              placeholder="Min (e.g., 1500)"
              value={minValue}
              onChange={(e) => onMinChange(e.target.value)}
              min="0"
              step="100"
              className={`w-full pl-12 pr-4 py-3 rounded-lg border bg-input-background focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                error && minValue && maxValue
                  ? "border-danger-300 focus:ring-danger-200"
                  : "border-neutral-200 focus:ring-primary"
              }`}
            />
            <div className="absolute left-12 bottom-1 text-xs text-neutral-500">Minimum</div>
          </div>

          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
            <input
              type="number"
              placeholder="Max (e.g., 2500)"
              value={maxValue}
              onChange={(e) => onMaxChange(e.target.value)}
              min="0"
              step="100"
              className={`w-full pl-12 pr-4 py-3 rounded-lg border bg-input-background focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                error && minValue && maxValue
                  ? "border-danger-300 focus:ring-danger-200"
                  : "border-neutral-200 focus:ring-primary"
              }`}
            />
            <div className="absolute left-12 bottom-1 text-xs text-neutral-500">Maximum</div>
          </div>
        </div>

        {/* Visual Range Indicator */}
        {isValid && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary-900">Budget flexibility</span>
              <span className="text-sm font-semibold text-primary-700">
                ${minValue} - ${maxValue}
              </span>
            </div>
            <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-primary-400 to-primary-600" />
            </div>
            <p className="text-xs text-primary-700 mt-2">
              AI will optimize activities within this range
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-danger-50 border border-danger-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-danger-600 flex-shrink-0" />
            <span className="text-sm text-danger-700">{error}</span>
          </div>
        )}

        {/* Helper Text */}
        {!error && (!minValue || !maxValue) && (
          <div className="flex items-start gap-2 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-neutral-600">
              Set a budget range to give AI flexibility while staying within your limits
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
