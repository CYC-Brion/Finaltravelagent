import { Plane, Users, Receipt, MapPin, Calendar, Plus, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  variant: "trips" | "collaborators" | "expenses" | "activities" | "comments";
  onAction?: () => void;
  actionLabel?: string;
}

export function EmptyState({ variant, onAction, actionLabel }: EmptyStateProps) {
  const configs = {
    trips: {
      icon: Plane,
      title: "No trips yet",
      description: "Start planning your first collaborative adventure",
      suggestion: "Create your first trip and invite friends to plan together",
      actionLabel: actionLabel || "Create Trip",
    },
    collaborators: {
      icon: Users,
      title: "No collaborators",
      description: "Invite friends to plan this trip together",
      suggestion: "Add team members to vote on activities and share expenses",
      actionLabel: actionLabel || "Invite Members",
    },
    expenses: {
      icon: Receipt,
      title: "No expenses yet",
      description: "Start tracking your trip spending",
      suggestion: "Log expenses as you go to keep everyone on the same page",
      actionLabel: actionLabel || "Add Expense",
    },
    activities: {
      icon: MapPin,
      title: "No activities for this day",
      description: "Add your first activity or let AI suggest some",
      suggestion: "Propose activities for your group to vote on",
      actionLabel: actionLabel || "Add Activity",
    },
    comments: {
      icon: MapPin,
      title: "No comments yet",
      description: "Start the discussion about this activity",
      suggestion: "Share your thoughts or ask questions",
      actionLabel: actionLabel || "Add Comment",
    },
  };

  const config = configs[variant];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-neutral-400" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-900 mb-2">{config.title}</h3>
      <p className="text-neutral-600 mb-1 max-w-md">{config.description}</p>
      <p className="text-sm text-neutral-500 mb-6 max-w-md">{config.suggestion}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {config.actionLabel}
        </button>
      )}
    </div>
  );
}

interface EmptyDashboardProps {
  onCreateTrip: () => void;
}

export function EmptyDashboard({ onCreateTrip }: EmptyDashboardProps) {
  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="text-center max-w-2xl px-6">
        <div className="relative inline-block mb-8">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
            <Plane className="w-16 h-16 text-primary-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Plus className="w-6 h-6 text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-neutral-900 mb-4">
          Ready to plan your first trip?
        </h2>
        <p className="text-lg text-neutral-600 mb-8">
          Create a trip, invite your travel companions, and let AI help you build the perfect itinerary together
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={onCreateTrip}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary-600 transition-all shadow-ocean hover:shadow-lg flex items-center gap-2"
          >
            Create Your First Trip
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="px-8 py-4 bg-white border border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-colors">
            Watch Demo
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: Users, label: "Invite team", desc: "Collaborate with friends" },
            { icon: MapPin, label: "Vote together", desc: "Democratic decisions" },
            { icon: Calendar, label: "AI assists", desc: "Smart suggestions" },
          ].map((feature, i) => (
            <div key={i} className="p-4 bg-neutral-50 rounded-xl">
              <feature.icon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
              <div className="text-sm font-semibold text-neutral-900 mb-1">{feature.label}</div>
              <div className="text-xs text-neutral-600">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
