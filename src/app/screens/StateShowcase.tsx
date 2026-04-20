import { useState } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { EmptyState, EmptyDashboard } from "../components/helloworld/EmptyStates";
import { LoadingSpinner, LoadingOverlay, SkeletonCard, SkeletonActivity, SkeletonList, AIGenerating } from "../components/helloworld/LoadingStates";
import { ErrorBanner, ErrorModal, InlineError } from "../components/helloworld/ErrorStates";
import { PendingVoteBanner, TieVoteCard, FinalizedSection, CollaborationStatus, MemberVoteStatus } from "../components/helloworld/CollaborationStates";
import { AISuggestionAccepted, AISuggestionRejected, AIAlternativeOptions, AIThinking, AIInsightBadge, AIConfidence } from "../components/helloworld/AIStates";

interface StateShowcaseProps {
  onBack: () => void;
}

export function StateShowcase({ onBack }: StateShowcaseProps) {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [aiStage, setAiStage] = useState<"analyzing" | "generating" | "optimizing" | "finalizing">("analyzing");

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-lg font-bold text-neutral-900">UI States Showcase</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Section: Empty States */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">Empty States</h2>
            <p className="text-neutral-600">When there's no content to display</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">No Trips</h3>
              <EmptyState variant="trips" onAction={() => {}} />
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">No Collaborators</h3>
              <EmptyState variant="collaborators" onAction={() => {}} />
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">No Expenses</h3>
              <EmptyState variant="expenses" onAction={() => {}} />
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">No Activities</h3>
              <EmptyState variant="activities" onAction={() => {}} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Empty Dashboard</h3>
            <EmptyDashboard onCreateTrip={() => {}} />
          </div>
        </section>

        {/* Section: Loading States */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">Loading States</h2>
            <p className="text-neutral-600">During async operations</p>
          </div>

          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Spinners</h3>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <LoadingSpinner size="sm" variant="primary" />
                  <p className="text-xs text-neutral-500 mt-2">Small</p>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="md" variant="ai" />
                  <p className="text-xs text-neutral-500 mt-2">Medium</p>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="lg" variant="neutral" />
                  <p className="text-xs text-neutral-500 mt-2">Large</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Skeleton Card</h3>
              <SkeletonCard />
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Skeleton Activity</h3>
              <SkeletonActivity />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">AI Generating</h3>
              <div className="space-y-4">
                <AIGenerating stage={aiStage} />
                <div className="flex gap-2">
                  {(["analyzing", "generating", "optimizing", "finalizing"] as const).map((stage) => (
                    <button
                      key={stage}
                      onClick={() => setAiStage(stage)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        aiStage === stage
                          ? "bg-purple-600 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Skeleton List</h3>
              <SkeletonList count={3} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-900">Loading Overlays</h3>
              <button
                onClick={() => setShowLoadingOverlay(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-600 transition-colors text-sm"
              >
                Show Overlay
              </button>
            </div>
            <p className="text-sm text-neutral-600">Click to see modal loading states</p>
          </div>

          {showLoadingOverlay && (
            <LoadingOverlay
              message="Generating AI draft itinerary"
              variant="ai"
            />
          )}
        </section>

        {/* Section: Error States */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">Error States</h2>
            <p className="text-neutral-600">When things go wrong</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Error Banners</h3>
              <div className="space-y-4">
                <ErrorBanner variant="invite-failed" onRetry={() => {}} onDismiss={() => {}} />
                <ErrorBanner variant="budget-exceeded" onRetry={() => {}} />
                <ErrorBanner variant="schedule-conflict" onRetry={() => {}} />
                <ErrorBanner variant="generic" message="Network connection lost" onRetry={() => {}} />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-900">Error Modals</h3>
                <button
                  onClick={() => setShowErrorModal(true)}
                  className="px-4 py-2 bg-danger text-white rounded-lg font-medium hover:bg-danger-600 transition-colors text-sm"
                >
                  Show Modal
                </button>
              </div>
              <p className="text-sm text-neutral-600">Click to see modal error states</p>
            </div>

            {showErrorModal && (
              <ErrorModal
                variant="schedule-conflict"
                onClose={() => setShowErrorModal(false)}
                onAction={() => setShowErrorModal(false)}
              />
            )}

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Inline Errors</h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 rounded-lg border-2 border-danger-500 bg-danger-50"
                  />
                  <InlineError field="email" />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Budget"
                    className="w-full px-4 py-3 rounded-lg border-2 border-danger-500 bg-danger-50"
                  />
                  <InlineError field="budget" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Collaboration States */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">Collaboration States</h2>
            <p className="text-neutral-600">Team voting and consensus mechanics</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Pending Vote Banner</h3>
              <PendingVoteBanner
                activityName="Tokyo Tower Visit"
                votesNeeded={2}
                totalMembers={4}
                onVote={() => {}}
              />
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Tie Vote</h3>
              <TieVoteCard
                activityName="Ginza Shopping District"
                votesFor={2}
                votesAgainst={2}
                onResolve={() => {}}
              />
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Finalized Section</h3>
              <FinalizedSection
                sectionName="Day 1 - April 15"
                activityCount={5}
                finalizedBy="Alice Chen"
                finalizedAt="2 hours ago"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h3 className="font-semibold text-neutral-900 mb-4">Collaboration Status (Compact)</h3>
                <CollaborationStatus totalMembers={4} voted={3} pending={1} variant="compact" />
              </div>

              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h3 className="font-semibold text-neutral-900 mb-4">Collaboration Status (Detailed)</h3>
                <CollaborationStatus totalMembers={4} voted={3} pending={1} variant="detailed" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Member Vote Status</h3>
              <MemberVoteStatus
                members={[
                  { name: "Alice Chen", voted: true, vote: "for" },
                  { name: "Bob Smith", voted: true, vote: "for" },
                  { name: "Carol Lee", voted: true, vote: "against" },
                  { name: "David Park", voted: false },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Section: AI States */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">AI States</h2>
            <p className="text-neutral-600">AI interaction feedback</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">AI Suggestion Accepted</h3>
              <AISuggestionAccepted
                suggestion="Route optimized for Day 2"
                impact="Saved 45 minutes of travel time"
                onUndo={() => {}}
              />
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">AI Suggestion Rejected</h3>
              <AISuggestionRejected
                suggestion="Replace Ginza with Nakamise Street"
                reason="Team prefers original plan"
              />
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">AI Alternative Options</h3>
              <AIAlternativeOptions
                originalOption="Robot Restaurant (¥8,000)"
                alternatives={[
                  {
                    name: "Teamlab Borderless",
                    reason: "Digital art museum with interactive exhibits",
                    savings: "Save ¥2,000",
                    rating: 5,
                  },
                  {
                    name: "Kabuki Theater",
                    reason: "Traditional Japanese performing arts",
                    savings: "Save ¥3,000",
                    rating: 4,
                  },
                  {
                    name: "Sumo Tournament",
                    reason: "Authentic cultural experience",
                    savings: "Save ¥1,000",
                    rating: 5,
                  },
                ]}
                onSelect={() => {}}
              />
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">AI Thinking</h3>
              <AIThinking context="Analyzing group preferences..." />
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">AI Insight Badges</h3>
              <div className="flex flex-wrap gap-3">
                <AIInsightBadge insight="optimized" />
                <AIInsightBadge insight="balanced" />
                <AIInsightBadge insight="saved" value="Saved $150" />
                <AIInsightBadge insight="improved" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">AI Confidence</h3>
              <div className="grid grid-cols-3 gap-4">
                <AIConfidence
                  confidence={92}
                  reason="Based on 156 similar trips"
                />
                <AIConfidence
                  confidence={75}
                  reason="Limited data for this season"
                />
                <AIConfidence
                  confidence={58}
                  reason="New destination, verify locally"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-lg font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Reset All States
          </button>
        </div>
      </div>
    </div>
  );
}
