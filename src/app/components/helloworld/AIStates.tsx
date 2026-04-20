import { Sparkles, CheckCircle, XCircle, Lightbulb, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface AISuggestionAcceptedProps {
  suggestion: string;
  impact: string;
  onUndo?: () => void;
}

export function AISuggestionAccepted({ suggestion, impact, onUndo }: AISuggestionAcceptedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-success-50 to-primary-50 border border-success-300 rounded-xl p-5"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success-500 to-primary-500 flex items-center justify-center shrink-0">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-success-600" />
            <span className="text-xs font-semibold text-success-700 uppercase tracking-wide">
              Suggestion Applied
            </span>
          </div>
          <h4 className="font-semibold text-neutral-900 mb-1">{suggestion}</h4>
          <p className="text-sm text-success-700 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            {impact}
          </p>
          {onUndo && (
            <button
              onClick={onUndo}
              className="text-sm font-medium text-neutral-700 hover:text-neutral-900 underline underline-offset-2"
            >
              Undo change
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface AISuggestionRejectedProps {
  suggestion: string;
  reason?: string;
}

export function AISuggestionRejected({ suggestion, reason }: AISuggestionRejectedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 0.6, x: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-neutral-50 border border-neutral-200 rounded-xl p-4"
    >
      <div className="flex items-start gap-3">
        <XCircle className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-neutral-600 text-sm mb-1 line-through">{suggestion}</h4>
          <p className="text-xs text-neutral-500">
            {reason || "Suggestion dismissed"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

interface AIAlternativeOptionsProps {
  originalOption: string;
  alternatives: Array<{
    name: string;
    reason: string;
    savings?: string;
    rating?: number;
  }>;
  onSelect: (index: number) => void;
}

export function AIAlternativeOptions({ originalOption, alternatives, onSelect }: AIAlternativeOptionsProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-xl border border-purple-200 overflow-hidden">
      <div className="p-5 border-b border-purple-200 bg-white/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-purple-900">AI found alternatives</h3>
        </div>
        <p className="text-sm text-purple-700">
          Instead of "{originalOption}", consider these options:
        </p>
      </div>

      <div className="p-5 space-y-3">
        {alternatives.map((alt, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className="w-full p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-neutral-900">{alt.name}</h4>
              {alt.rating && (
                <div className="flex items-center gap-1">
                  {[...Array(alt.rating)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-warning-400 rounded-sm" />
                  ))}
                </div>
              )}
            </div>
            <p className="text-sm text-neutral-700 mb-2">{alt.reason}</p>
            {alt.savings && (
              <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-success-100 rounded-md">
                <TrendingUp className="w-3.5 h-3.5 text-success-700" />
                <span className="text-xs font-semibold text-success-700">{alt.savings}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

interface AIThinkingProps {
  context: string;
}

export function AIThinking({ context }: AIThinkingProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="absolute inset-0 rounded-lg bg-white/30 animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <motion.div
                className="w-2 h-2 bg-purple-600 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-2 h-2 bg-purple-600 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 bg-purple-600 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </div>
            <span className="text-sm font-medium text-purple-900">{context}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AIInsightBadgeProps {
  insight: "optimized" | "balanced" | "saved" | "improved";
  value?: string;
}

export function AIInsightBadge({ insight, value }: AIInsightBadgeProps) {
  const configs = {
    optimized: {
      label: "AI Optimized",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    balanced: {
      label: "Balanced by AI",
      icon: CheckCircle,
      color: "from-primary-500 to-primary-400",
      bg: "bg-primary-50",
      text: "text-primary-700",
      border: "border-primary-200",
    },
    saved: {
      label: value || "Saved",
      icon: TrendingUp,
      color: "from-success-500 to-success-400",
      bg: "bg-success-50",
      text: "text-success-700",
      border: "border-success-200",
    },
    improved: {
      label: "AI Improved",
      icon: Sparkles,
      color: "from-info-500 to-info-400",
      bg: "bg-info-50",
      text: "text-info-700",
      border: "border-info-200",
    },
  };

  const config = configs[insight];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${config.bg} border ${config.border} rounded-lg`}>
      <div className={`w-4 h-4 rounded bg-gradient-to-br ${config.color} flex items-center justify-center`}>
        <Icon className="w-2.5 h-2.5 text-white" />
      </div>
      <span className={`text-xs font-semibold ${config.text}`}>{config.label}</span>
    </div>
  );
}

interface AIConfidenceProps {
  confidence: number; // 0-100
  reason: string;
}

export function AIConfidence({ confidence, reason }: AIConfidenceProps) {
  const getColor = () => {
    if (confidence >= 80) return { bar: "bg-success-500", text: "text-success-700" };
    if (confidence >= 60) return { bar: "bg-primary-500", text: "text-primary-700" };
    return { bar: "bg-warning-500", text: "text-warning-700" };
  };

  const colors = getColor();

  return (
    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-purple-700">AI Confidence</span>
        <span className={`text-sm font-bold ${colors.text}`}>{confidence}%</span>
      </div>
      <div className="h-2 bg-purple-200 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full ${colors.bar} transition-all duration-500`}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <p className="text-xs text-purple-600">{reason}</p>
    </div>
  );
}
