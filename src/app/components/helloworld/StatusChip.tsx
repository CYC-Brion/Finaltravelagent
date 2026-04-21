import { cn } from "../../../lib/utils";

type TripState = "draft" | "in_discussion" | "finalized" | "in_trip" | "completed";

interface StatusChipProps {
  status: TripState;
  className?: string;
}

const statusConfig: Record<
  TripState,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-neutral-100 text-neutral-700 border-neutral-200",
  },
  in_discussion: {
    label: "In Discussion",
    className: "bg-primary-50 text-primary-700 border-primary-200",
  },
  finalized: {
    label: "Finalized",
    className: "bg-success-50 text-success-700 border-success-200",
  },
  in_trip: {
    label: "In Trip",
    className: "bg-info-50 text-info-700 border-info-200",
  },
  completed: {
    label: "Completed",
    className: "bg-neutral-100 text-neutral-600 border-neutral-200",
  },
};

export function StatusChip({ status, className }: StatusChipProps) {
  const config = statusConfig[status] || {
    label: status || "Unknown",
    className: "bg-neutral-100 text-neutral-700 border-neutral-200"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

interface ActivityStatusChipProps {
  status: "proposed" | "accepted" | "rejected" | "completed";
  className?: string;
}

const activityStatusConfig: Record<
  "proposed" | "accepted" | "rejected" | "completed",
  { label: string; className: string }
> = {
  proposed: {
    label: "Proposed",
    className: "bg-warning-50 text-warning-700 border-warning-200",
  },
  accepted: {
    label: "Accepted",
    className: "bg-success-50 text-success-700 border-success-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-danger-50 text-danger-700 border-danger-200",
  },
  completed: {
    label: "Completed",
    className: "bg-primary-50 text-primary-700 border-primary-200",
  },
};

export function ActivityStatusChip({ status, className }: ActivityStatusChipProps) {
  const config = activityStatusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
