import { cn } from "../../../lib/utils";
import { ArrowRight, Check, X } from "lucide-react";

interface DiffCardProps {
  before: {
    title: string;
    content: string | React.ReactNode;
  };
  after: {
    title: string;
    content: string | React.ReactNode;
  };
  onAccept?: () => void;
  onReject?: () => void;
  className?: string;
}

export function DiffCard({
  before,
  after,
  onAccept,
  onReject,
  className,
}: DiffCardProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Comparison panels */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Before */}
        <div className="relative rounded-lg border border-neutral-200 overflow-hidden">
          <div className="px-4 py-2 bg-neutral-50 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neutral-400" />
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                Before
              </span>
            </div>
            <h4 className="text-sm font-medium text-neutral-900 mt-1">
              {before.title}
            </h4>
          </div>
          <div className="p-4 bg-white">
            {typeof before.content === "string" ? (
              <p className="text-sm text-neutral-700">{before.content}</p>
            ) : (
              before.content
            )}
          </div>
        </div>

        {/* After */}
        <div className="relative rounded-lg border-2 border-primary-300 overflow-hidden">
          <div className="px-4 py-2 bg-primary-50 border-b border-primary-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-xs font-semibold text-primary-700 uppercase tracking-wide">
                After
              </span>
            </div>
            <h4 className="text-sm font-medium text-primary-900 mt-1">
              {after.title}
            </h4>
          </div>
          <div className="p-4 bg-white">
            {typeof after.content === "string" ? (
              <p className="text-sm text-neutral-900">{after.content}</p>
            ) : (
              after.content
            )}
          </div>
        </div>
      </div>

      {/* Arrow indicator (desktop only) */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="p-2 rounded-full bg-white border-2 border-primary-400 shadow-lg">
          <ArrowRight className="w-5 h-5 text-primary-600" />
        </div>
      </div>

      {/* Actions */}
      {(onAccept || onReject) && (
        <div className="flex items-center justify-end gap-3 pt-2">
          {onReject && (
            <button
              onClick={onReject}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-medium text-sm transition-colors"
            >
              <X className="w-4 h-4" />
              Reject
            </button>
          )}
          {onAccept && (
            <button
              onClick={onAccept}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary-600 font-medium text-sm transition-colors shadow-sm"
            >
              <Check className="w-4 h-4" />
              Accept Change
            </button>
          )}
        </div>
      )}
    </div>
  );
}
