import { AlertCircle, XCircle, AlertTriangle, RefreshCw, X } from "lucide-react";

interface ErrorBannerProps {
  variant: "invite-failed" | "budget-exceeded" | "schedule-conflict" | "generic";
  message?: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export function ErrorBanner({ variant, message, onDismiss, onRetry }: ErrorBannerProps) {
  const configs = {
    "invite-failed": {
      icon: XCircle,
      title: "Invitation failed to send",
      defaultMessage: "Could not send invitation to this email address",
      action: "Try again",
      color: "danger",
    },
    "budget-exceeded": {
      icon: AlertCircle,
      title: "Budget exceeded",
      defaultMessage: "This activity puts you $250 over your planned budget",
      action: "Review budget",
      color: "danger",
    },
    "schedule-conflict": {
      icon: AlertTriangle,
      title: "Schedule conflict detected",
      defaultMessage: "This activity overlaps with another scheduled event",
      action: "Resolve conflict",
      color: "warning",
    },
    generic: {
      icon: AlertCircle,
      title: "Something went wrong",
      defaultMessage: "An unexpected error occurred",
      action: "Retry",
      color: "danger",
    },
  };

  const config = configs[variant];
  const Icon = config.icon;

  const colorClasses = {
    danger: {
      bg: "bg-danger-50",
      border: "border-danger-200",
      icon: "text-danger-600",
      title: "text-danger-900",
      text: "text-danger-700",
      button: "bg-danger-600 hover:bg-danger-700 text-white",
    },
    warning: {
      bg: "bg-warning-50",
      border: "border-warning-200",
      icon: "text-warning-600",
      title: "text-warning-900",
      text: "text-warning-700",
      button: "bg-warning-600 hover:bg-warning-700 text-white",
    },
  };

  const colors = colorClasses[config.color as keyof typeof colorClasses];

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-xl p-4`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 ${colors.icon} shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm mb-1 ${colors.title}`}>{config.title}</h4>
          <p className={`text-sm ${colors.text}`}>{message || config.defaultMessage}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className={`mt-3 px-4 py-2 ${colors.button} rounded-lg text-sm font-medium transition-colors flex items-center gap-2`}
            >
              <RefreshCw className="w-4 h-4" />
              {config.action}
            </button>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors ${colors.icon}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

interface ErrorModalProps {
  variant: "invite-failed" | "budget-exceeded" | "schedule-conflict";
  onClose: () => void;
  onAction?: () => void;
  details?: string;
}

export function ErrorModal({ variant, onClose, onAction, details }: ErrorModalProps) {
  const configs = {
    "invite-failed": {
      icon: XCircle,
      title: "Failed to send invitation",
      description: "The email invitation could not be delivered. Please check the email address and try again.",
      actionLabel: "Try Again",
      color: "danger",
    },
    "budget-exceeded": {
      icon: AlertCircle,
      title: "This exceeds your budget",
      description: "Adding this activity would put you $250 over your planned budget. Consider removing other activities or increasing your budget.",
      actionLabel: "Review Budget",
      color: "danger",
    },
    "schedule-conflict": {
      icon: AlertTriangle,
      title: "Schedule conflict",
      description: "This activity overlaps with 'Tokyo Tower Visit' from 2:00 PM - 4:30 PM. You'll need to adjust the timing or remove one activity.",
      actionLabel: "Resolve Conflict",
      color: "warning",
    },
  };

  const config = configs[variant];
  const Icon = config.icon;

  const colorClasses = {
    danger: {
      iconBg: "from-danger-500 to-danger-600",
      border: "border-danger-200",
      button: "bg-danger-600 hover:bg-danger-700",
    },
    warning: {
      iconBg: "from-warning-500 to-warning-600",
      border: "border-warning-200",
      button: "bg-warning-600 hover:bg-warning-700",
    },
  };

  const colors = colorClasses[config.color as keyof typeof colorClasses];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.iconBg} flex items-center justify-center mb-4`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">{config.title}</h3>
          <p className="text-neutral-700 mb-4">{details || config.description}</p>
        </div>
        <div className="flex gap-3 p-6 border-t border-neutral-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          {onAction && (
            <button
              onClick={onAction}
              className={`flex-1 px-4 py-2.5 ${colors.button} text-white rounded-lg font-medium transition-colors`}
            >
              {config.actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface InlineErrorProps {
  field: "email" | "date" | "budget" | "generic";
  message?: string;
}

export function InlineError({ field, message }: InlineErrorProps) {
  const messages = {
    email: message || "Please enter a valid email address",
    date: message || "End date must be after start date",
    budget: message || "Budget must be greater than 0",
    generic: message || "This field is required",
  };

  return (
    <div className="flex items-start gap-2 mt-2">
      <AlertCircle className="w-4 h-4 text-danger-600 shrink-0 mt-0.5" />
      <p className="text-sm text-danger-600">{messages[field]}</p>
    </div>
  );
}
