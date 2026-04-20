import { Loader2, Sparkles, DollarSign, AlertTriangle } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "ai" | "neutral";
}

export function LoadingSpinner({ size = "md", variant = "primary" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const colorClasses = {
    primary: "text-primary-600",
    ai: "text-purple-600",
    neutral: "text-neutral-600",
  };

  return (
    <Loader2 className={`${sizeClasses[size]} ${colorClasses[variant]} animate-spin`} />
  );
}

interface LoadingOverlayProps {
  message: string;
  variant?: "ai" | "budget" | "conflict" | "default";
}

export function LoadingOverlay({ message, variant = "default" }: LoadingOverlayProps) {
  const configs = {
    ai: {
      icon: Sparkles,
      gradient: "from-purple-500 to-pink-500",
      bg: "from-purple-50 to-pink-50",
      border: "border-purple-200",
      text: "text-purple-700",
    },
    budget: {
      icon: DollarSign,
      gradient: "from-primary-500 to-primary-400",
      bg: "from-primary-50 to-primary-100",
      border: "border-primary-200",
      text: "text-primary-700",
    },
    conflict: {
      icon: AlertTriangle,
      gradient: "from-warning-500 to-warning-400",
      bg: "from-warning-50 to-warning-100",
      border: "border-warning-200",
      text: "text-warning-700",
    },
    default: {
      icon: Loader2,
      gradient: "from-primary-500 to-primary-400",
      bg: "from-neutral-50 to-neutral-100",
      border: "border-neutral-200",
      text: "text-neutral-700",
    },
  };

  const config = configs[variant];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`bg-gradient-to-br ${config.bg} rounded-2xl p-8 border ${config.border} shadow-xl max-w-md`}>
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mx-auto mb-6`}>
          <Icon className="w-8 h-8 text-white animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 text-center mb-2">{message}</h3>
        <p className={`text-sm ${config.text} text-center`}>This will only take a moment...</p>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl p-6 border border-neutral-200 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-neutral-200 rounded-lg" />
        <div className="flex-1">
          <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-neutral-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-neutral-200 rounded w-full" />
        <div className="h-3 bg-neutral-200 rounded w-5/6" />
      </div>
    </div>
  );
}

export function SkeletonActivity() {
  return (
    <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-200 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-neutral-200 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-3 bg-neutral-200 rounded w-16" />
            <div className="h-5 bg-neutral-200 rounded w-20" />
          </div>
          <div className="h-5 bg-neutral-200 rounded w-2/3 mb-4" />
          <div className="flex gap-2 mb-4">
            <div className="h-9 bg-neutral-200 rounded-lg w-24" />
            <div className="h-9 bg-neutral-200 rounded-lg w-24" />
          </div>
          <div className="h-2 bg-neutral-200 rounded-full w-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

interface AIGeneratingProps {
  stage: "analyzing" | "generating" | "optimizing" | "finalizing";
}

export function AIGenerating({ stage }: AIGeneratingProps) {
  const stages = {
    analyzing: { label: "Analyzing preferences", progress: 25 },
    generating: { label: "Generating itinerary", progress: 50 },
    optimizing: { label: "Optimizing routes", progress: 75 },
    finalizing: { label: "Finalizing plan", progress: 90 },
  };

  const current = stages[stage];

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-2xl p-8 border border-purple-200">
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 relative">
          <Sparkles className="w-8 h-8 text-white" />
          <div className="absolute inset-0 rounded-2xl bg-white/30 animate-pulse" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">AI is working...</h3>
          <p className="text-sm text-purple-700 mb-4">{current.label}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-purple-600">
              <span>{current.label}</span>
              <span>{current.progress}%</span>
            </div>
            <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${current.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
