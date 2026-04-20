import { Clock, Users, Lock, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface PendingVoteBannerProps {
  activityName: string;
  votesNeeded: number;
  totalMembers: number;
  onVote: () => void;
}

export function PendingVoteBanner({ activityName, votesNeeded, totalMembers, onVote }: PendingVoteBannerProps) {
  return (
    <div className="bg-warning-50 border border-warning-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <Clock className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-warning-900 mb-1">Your vote needed</h4>
          <p className="text-sm text-warning-700 mb-3">
            "{activityName}" needs {votesNeeded} more {votesNeeded === 1 ? "vote" : "votes"} to reach consensus ({totalMembers - votesNeeded}/{totalMembers} voted)
          </p>
          <button
            onClick={onVote}
            className="px-4 py-2 bg-warning-600 text-white rounded-lg text-sm font-medium hover:bg-warning-700 transition-colors"
          >
            Vote Now
          </button>
        </div>
      </div>
    </div>
  );
}

interface TieVoteCardProps {
  activityName: string;
  votesFor: number;
  votesAgainst: number;
  onResolve: () => void;
}

export function TieVoteCard({ activityName, votesFor, votesAgainst, onResolve }: TieVoteCardProps) {
  return (
    <div className="bg-gradient-to-br from-warning-50 to-danger-50 border-2 border-warning-400 rounded-xl p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning-500 to-danger-500 flex items-center justify-center shrink-0">
          <AlertCircle className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-warning-600 text-white rounded-md text-xs font-semibold uppercase tracking-wide">
              Tie Vote
            </span>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">{activityName}</h3>
          <p className="text-sm text-neutral-700 mb-4">
            The group is evenly split on this activity ({votesFor} for, {votesAgainst} against). A tiebreaker is needed to move forward.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onResolve}
              className="px-4 py-2 bg-warning-600 text-white rounded-lg font-medium hover:bg-warning-700 transition-colors text-sm"
            >
              Resolve Tie
            </button>
            <button className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors text-sm">
              Discuss
            </button>
          </div>
        </div>
      </div>
      <div className="pt-4 border-t border-warning-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[...Array(votesFor)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-success-400 to-success-500 border-2 border-white"
                />
              ))}
            </div>
            <span className="text-xs text-neutral-600">Voted for</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-600">Voted against</span>
            <div className="flex -space-x-2">
              {[...Array(votesAgainst)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-danger-400 to-danger-500 border-2 border-white"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FinalizedSectionProps {
  sectionName: string;
  activityCount: number;
  finalizedBy: string;
  finalizedAt: string;
}

export function FinalizedSection({ sectionName, activityCount, finalizedBy, finalizedAt }: FinalizedSectionProps) {
  return (
    <div className="bg-gradient-to-br from-success-50 to-primary-50 border border-success-300 rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success-500 to-primary-500 flex items-center justify-center shrink-0">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-success-600 text-white rounded-md text-xs font-semibold uppercase tracking-wide">
              Finalized
            </span>
            <span className="text-xs text-neutral-500">{activityCount} activities locked</span>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">{sectionName}</h3>
          <p className="text-sm text-neutral-700 mb-3">
            This section has been finalized and can no longer be edited. All group members agreed on these activities.
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-success-200">
            <div className="flex items-center gap-2 text-xs text-neutral-600">
              <Users className="w-3.5 h-3.5" />
              <span>Finalized by {finalizedBy}</span>
            </div>
            <span className="text-xs text-neutral-500">{finalizedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CollaborationStatusProps {
  totalMembers: number;
  voted: number;
  pending: number;
  variant?: "compact" | "detailed";
}

export function CollaborationStatus({ totalMembers, voted, pending, variant = "compact" }: CollaborationStatusProps) {
  const percentage = (voted / totalMembers) * 100;

  if (variant === "compact") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 border border-primary-200 rounded-lg">
        <Users className="w-4 h-4 text-primary-600" />
        <span className="text-sm font-medium text-primary-700">
          {voted}/{totalMembers} voted
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 border border-neutral-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-neutral-900">Team Participation</h4>
        <span className="text-sm font-semibold text-primary-600">{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-success-600" />
          <span className="text-neutral-700">{voted} voted</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-warning-600" />
          <span className="text-neutral-700">{pending} pending</span>
        </div>
      </div>
    </div>
  );
}

interface MemberVoteStatusProps {
  members: Array<{
    name: string;
    avatar?: string;
    voted: boolean;
    vote?: "for" | "against" | "abstain";
  }>;
}

export function MemberVoteStatus({ members }: MemberVoteStatusProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-neutral-200">
      <h4 className="font-semibold text-neutral-900 mb-4">Vote Status</h4>
      <div className="space-y-3">
        {members.map((member, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white text-xs font-semibold">
                  {member.name.charAt(0)}
                </div>
              )}
              <span className="text-sm font-medium text-neutral-900">{member.name}</span>
            </div>
            {member.voted ? (
              <div className="flex items-center gap-2">
                {member.vote === "for" && (
                  <>
                    <CheckCircle className="w-4 h-4 text-success-600" />
                    <span className="text-xs font-medium text-success-700">Voted for</span>
                  </>
                )}
                {member.vote === "against" && (
                  <>
                    <XCircle className="w-4 h-4 text-danger-600" />
                    <span className="text-xs font-medium text-danger-700">Voted against</span>
                  </>
                )}
                {member.vote === "abstain" && (
                  <span className="text-xs font-medium text-neutral-500">Abstained</span>
                )}
              </div>
            ) : (
              <span className="text-xs text-neutral-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Pending
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
