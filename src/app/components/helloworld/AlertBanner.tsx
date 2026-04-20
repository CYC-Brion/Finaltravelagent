import { cn } from "../../../lib/utils";
import { X, AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react";

interface AlertBannerProps {
  variant?: "info" | "success" | "warning" | "danger" | "conflict";
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  className?: string;
}

const variantConfig = {
  info: {
    container: "bg-info-50 border-info-200",
    icon: Info,
    iconColor: "text-info-600",
    titleColor: "text-info-900",
    descColor: "text-info-700",
    actionColor: "text-info-700 hover:text-info-900",
  },
  success: {
    container: "bg-success-50 border-success-200",
    icon: CheckCircle,
    iconColor: "text-success-600",
    titleColor: "text-success-900",
    descColor: "text-success-700",
    actionColor: "text-success-700 hover:text-success-900",
  },
  warning: {
    container: "bg-warning-50 border-warning-200",
    icon: AlertTriangle,
    iconColor: "text-warning-600",
    titleColor: "text-warning-900",
    descColor: "text-warning-700",
    actionColor: "text-warning-700 hover:text-warning-900",
  },
  danger: {
    container: "bg-danger-50 border-danger-200",
    icon: AlertCircle,
    iconColor: "text-danger-600",
    titleColor: "text-danger-900",
    descColor: "text-danger-700",
    actionColor: "text-danger-700 hover:text-danger-900",
  },
  conflict: {
    container: "bg-gradient-to-r from-warning-50 to-danger-50 border-warning-300",
    icon: AlertTriangle,
    iconColor: "text-danger-600",
    titleColor: "text-neutral-900",
    descColor: "text-neutral-700",
    actionColor: "text-danger-700 hover:text-danger-900",
  },
};

export function AlertBanner({
  variant = "info",
  title,
  description,
  action,
  onDismiss,
  className,
}: AlertBannerProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative p-4 rounded-lg border",
        config.container,
        className
      )}
    >
      <div className="flex gap-3">
        <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", config.iconColor)} />

        <div className="flex-1 min-w-0">
          <h4 className={cn("font-semibold text-sm mb-1", config.titleColor)}>
            {title}
          </h4>
          {description && (
            <p className={cn("text-sm", config.descColor)}>{description}</p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                "mt-3 text-sm font-medium underline underline-offset-2",
                config.actionColor
              )}
            >
              {action.label}
            </button>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className={cn(
              "shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors",
              config.iconColor
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
