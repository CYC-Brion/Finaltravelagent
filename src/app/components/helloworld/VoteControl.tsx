import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "../../../lib/utils";

interface VoteControlProps {
  voteFor: number;
  voteAgainst: number;
  userVote?: 1 | -1 | 0;
  onVote: (value: 1 | -1) => void;
  disabled?: boolean;
  className?: string;
}

export function VoteControl({
  voteFor,
  voteAgainst,
  userVote,
  onVote,
  disabled = false,
  className,
}: VoteControlProps) {
  const total = voteFor + voteAgainst;
  const percentage = total > 0 ? (voteFor / total) * 100 : 50;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onVote(1)}
          disabled={disabled}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
            "border font-medium text-sm",
            userVote === 1
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-white border-neutral-200 text-neutral-700 hover:border-primary-300 hover:bg-primary-50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{voteFor}</span>
        </button>

        <button
          onClick={() => onVote(-1)}
          disabled={disabled}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
            "border font-medium text-sm",
            userVote === -1
              ? "bg-neutral-700 text-white border-neutral-700 shadow-sm"
              : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <ThumbsDown className="w-4 h-4" />
          <span>{voteAgainst}</span>
        </button>
      </div>

      {/* Consensus bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs font-medium text-neutral-600 min-w-[3rem] text-right">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}
