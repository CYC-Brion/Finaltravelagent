import { cn } from "../../../lib/utils";
import { Sparkles, ThumbsUp, ThumbsDown, X } from "lucide-react";

interface AISuggestionChipProps {
  title: string;
  description?: string;
  onAccept?: () => void;
  onReject?: () => void;
  onDismiss?: () => void;
  variant?: "default" | "compact";
  className?: string;
}

export function AISuggestionChip({
  title,
  description,
  onAccept,
  onReject,
  onDismiss,
  variant = "default",
  className,
}: AISuggestionChipProps) {
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
          "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200",
          className
        )}
      >
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Sparkles className="w-2.5 h-2.5 text-white" />
        </div>
        <span className="text-xs font-medium text-purple-900">{title}</span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-1 p-0.5 rounded-full hover:bg-purple-100 transition-colors"
          >
            <X className="w-3 h-3 text-purple-600" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative p-4 rounded-xl border border-purple-200 overflow-hidden",
        "bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50",
        className
      )}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex items-start gap-3">
        {/* AI Icon */}
        <div className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
          <Sparkles className="w-4 h-4 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-sm text-purple-900">{title}</h4>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="shrink-0 p-1 rounded-md hover:bg-purple-100 transition-colors"
              >
                <X className="w-4 h-4 text-purple-600" />
              </button>
            )}
          </div>

          {description && (
            <p className="text-sm text-purple-700 mb-3">{description}</p>
          )}

          {/* Actions */}
          {(onAccept || onReject) && (
            <div className="flex items-center gap-2">
              {onAccept && (
                <button
                  onClick={onAccept}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-purple-200 hover:border-purple-300 hover:bg-purple-50 text-purple-900 text-sm font-medium transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Accept
                </button>
              )}
              {onReject && (
                <button
                  onClick={onReject}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-sm font-medium transition-colors"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
