import { cn } from "../../../lib/utils";
import { LucideIcon } from "lucide-react";

interface TimelineItemProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  time: string;
  author?: {
    name: string;
    avatar?: string;
  };
  isLast?: boolean;
  variant?: "default" | "ai" | "success" | "warning";
  className?: string;
}

const variantConfig = {
  default: {
    iconBg: "bg-primary-100",
    iconColor: "text-primary-600",
    line: "bg-neutral-200",
  },
  ai: {
    iconBg: "bg-gradient-to-br from-purple-100 to-pink-100",
    iconColor: "text-purple-600",
    line: "bg-neutral-200",
  },
  success: {
    iconBg: "bg-success-100",
    iconColor: "text-success-600",
    line: "bg-neutral-200",
  },
  warning: {
    iconBg: "bg-warning-100",
    iconColor: "text-warning-600",
    line: "bg-neutral-200",
  },
};

export function TimelineItem({
  icon: Icon,
  title,
  description,
  time,
  author,
  isLast = false,
  variant = "default",
  className,
}: TimelineItemProps) {
  const config = variantConfig[variant];

  return (
    <div className={cn("flex gap-4 pb-8 relative", className)}>
      {/* Icon with connecting line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            config.iconBg
          )}
        >
          {Icon && <Icon className={cn("w-5 h-5", config.iconColor)} />}
        </div>
        {!isLast && (
          <div className={cn("w-0.5 flex-1 mt-2", config.line)} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <div className="flex items-start justify-between gap-4 mb-1">
          <h4 className="font-semibold text-sm text-neutral-900">{title}</h4>
          <span className="text-xs text-neutral-500 whitespace-nowrap">{time}</span>
        </div>

        {description && (
          <p className="text-sm text-neutral-600 mb-2">{description}</p>
        )}

        {author && (
          <div className="flex items-center gap-2 mt-2">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="w-5 h-5 rounded-full"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-primary-200 flex items-center justify-center">
                <span className="text-xs font-medium text-primary-700">
                  {author.name.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-xs text-neutral-500">{author.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
