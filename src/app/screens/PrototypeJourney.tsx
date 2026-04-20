import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, Sparkles, Users, ThumbsUp, MessageSquare, ArrowRight } from "lucide-react";

type Step = "landing" | "wizard-1" | "wizard-2" | "wizard-3" | "ai-draft" | "collaborate" | "finalize" | "expense" | "summary";

interface PrototypeJourneyProps {
  onExit: () => void;
}

export function PrototypeJourney({ onExit }: PrototypeJourneyProps) {
  const [currentStep, setCurrentStep] = useState<Step>("landing");
  const [journeyState, setJourneyState] = useState({
    tripName: "",
    members: 0,
    votedActivities: new Set<number>(),
    aiSuggestionAccepted: false,
    commentsAdded: 0,
    finalized: false,
    expensesLogged: 0,
  });

  const steps: Step[] = ["landing", "wizard-1", "wizard-2", "wizard-3", "ai-draft", "collaborate", "finalize", "expense", "summary"];
  const currentIndex = steps.indexOf(currentStep);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  const goNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleVote = (activityId: number) => {
    setJourneyState(prev => ({
      ...prev,
      votedActivities: new Set([...prev.votedActivities, activityId]),
    }));
  };

  const handleAIAccept = () => {
    setJourneyState(prev => ({ ...prev, aiSuggestionAccepted: true }));
    setTimeout(() => {
      setJourneyState(prev => ({ ...prev, aiSuggestionAccepted: false }));
    }, 3000);
  };

  const handleFinalize = () => {
    setJourneyState(prev => ({ ...prev, finalized: true }));
    setTimeout(() => goNext(), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200">
        <div className="h-1 bg-neutral-100">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-neutral-900">HelloWorld Prototype</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-neutral-600">
              Step {currentIndex + 1} of {steps.length}
            </span>
            <button
              onClick={onExit}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              Exit Prototype
            </button>
          </div>
        </div>
      </div>

      <div className="pt-16">
        <AnimatePresence mode="wait">
          {/* Landing */}
          {currentStep === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto px-8 py-24"
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 mb-6">
                  <Sparkles className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium text-primary-700">AI-powered collaborative planning</span>
                </div>
                <h1 className="text-6xl font-bold text-neutral-900 mb-4">
                  Plan trips <span className="text-primary-600">together</span>, not alone
                </h1>
                <p className="text-xl text-neutral-600 mb-8">
                  Collaboration starts before itinerary generation
                </p>
                <button
                  onClick={goNext}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary-600 transition-all shadow-ocean hover:shadow-lg flex items-center gap-2 mx-auto text-lg"
                >
                  Start Collaborative Planning
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-xl max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">Tokyo Adventure</h3>
                    <p className="text-sm text-neutral-500">Preview</p>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 border-2 border-white" />
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-primary-50 rounded-lg border border-primary-200 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-900">AI suggests</span>
                  </div>
                  <p className="text-sm text-neutral-700">Visit Senso-ji Temple early morning</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
                    <ThumbsUp className="w-4 h-4 inline mr-1" /> 12
                  </button>
                  <button className="flex-1 px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg text-sm font-medium">
                    3
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Wizard Step 1 */}
          {currentStep === "wizard-1" && (
            <motion.div
              key="wizard-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto px-8 py-12"
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-neutral-900 mb-3">Let's start your trip</h1>
                <p className="text-lg text-neutral-600">Tell us the basics</p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-lg space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Trip name</label>
                  <input
                    type="text"
                    value={journeyState.tripName}
                    onChange={(e) => setJourneyState(prev => ({ ...prev, tripName: e.target.value }))}
                    placeholder="e.g., Tokyo Adventure 2026"
                    className="w-full px-4 py-3 rounded-lg border border-neutral-200 bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Start date</label>
                    <input type="date" value="2026-04-15" readOnly className="w-full px-4 py-3 rounded-lg border border-neutral-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">End date</label>
                    <input type="date" value="2026-04-22" readOnly className="w-full px-4 py-3 rounded-lg border border-neutral-200" />
                  </div>
                </div>
                <button
                  onClick={goNext}
                  disabled={!journeyState.tripName}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* Wizard Step 2 */}
          {currentStep === "wizard-2" && (
            <motion.div
              key="wizard-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto px-8 py-12"
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-neutral-900 mb-3">Who's coming along?</h1>
                <p className="text-lg text-neutral-600">Invite your travel companions</p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-lg space-y-6">
                <div className="space-y-3">
                  {["alice@example.com", "bob@example.com", "carol@example.com"].map((email, i) => (
                    <motion.div
                      key={email}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white font-semibold">
                        {email.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-neutral-900">{email}</div>
                        <div className="text-xs text-neutral-500">Invitation pending</div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-success-600" />
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4 border-t border-neutral-200">
                  <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg border border-primary-200">
                    <Users className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium text-primary-900">
                      3 members invited • Collaboration starts now
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setJourneyState(prev => ({ ...prev, members: 3 }));
                    goNext();
                  }}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-600 transition-colors"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* Wizard Step 3 */}
          {currentStep === "wizard-3" && (
            <motion.div
              key="wizard-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto px-8 py-12"
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-neutral-900 mb-3">Set preferences</h1>
                <p className="text-lg text-neutral-600">Help AI understand your group</p>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-lg space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-3">Budget per person</label>
                    <input type="number" value="2000" readOnly className="w-full px-4 py-3 rounded-lg border border-neutral-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-3">Travel pace</label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Relaxed", "Moderate", "Active"].map((pace) => (
                        <button
                          key={pace}
                          className={`p-4 rounded-lg border-2 ${pace === "Moderate" ? "border-primary-500 bg-primary-50" : "border-neutral-200"}`}
                        >
                          <div className="font-semibold text-neutral-900">{pace}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-2xl p-8 border border-purple-200"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-purple-900 mb-2">AI is ready to help</h3>
                      <p className="text-sm text-purple-700">Ready to generate personalized itinerary</p>
                    </div>
                  </div>
                  <button
                    onClick={goNext}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Generate AI Draft
                    <Sparkles className="w-5 h-5" />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* AI Draft */}
          {currentStep === "ai-draft" && (
            <motion.div
              key="ai-draft"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto px-8 py-12"
            >
              <div className="mb-8">
                <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-xl p-6 border border-purple-200 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-purple-900 mb-1">Your itinerary is ready!</h3>
                      <p className="text-sm text-purple-700">18 activities across 7 days • Ready for team review</p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Day 1 - April 15</h2>
                <div className="space-y-4">
                  {[
                    { id: 1, time: "8:30 AM", name: "Senso-ji Temple", votes: { for: 4, against: 0 } },
                    { id: 2, time: "11:00 AM", name: "Tokyo Skytree", votes: { for: 3, against: 1 } },
                  ].map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl p-6 border border-neutral-200"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-medium text-neutral-600 mb-2">{activity.time}</div>
                          <h3 className="text-lg font-semibold text-neutral-900">{activity.name}</h3>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVote(activity.id)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                              journeyState.votedActivities.has(activity.id)
                                ? "bg-primary text-white"
                                : "border border-neutral-200 hover:border-primary-300"
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4 inline mr-1" />
                            {activity.votes.for + (journeyState.votedActivities.has(activity.id) ? 1 : 0)}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 text-center"
                >
                  <button
                    onClick={goNext}
                    className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary-600 transition-all shadow-sm inline-flex items-center gap-2"
                  >
                    Start Collaborating
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Collaborate */}
          {currentStep === "collaborate" && (
            <motion.div
              key="collaborate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto px-8 py-12"
            >
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                  <h2 className="text-2xl font-bold text-neutral-900">Co-Create Workspace</h2>

                  {!journeyState.aiSuggestionAccepted && (
                    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-xl p-5 border border-purple-200">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-purple-900 mb-1">AI suggests</h4>
                          <p className="text-sm text-purple-700">Optimize Day 2 route to save 45 minutes</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleAIAccept}
                          className="px-4 py-2 bg-white border border-purple-200 rounded-lg text-sm font-medium text-purple-700 hover:bg-purple-50"
                        >
                          Accept
                        </button>
                        <button className="px-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}

                  {journeyState.aiSuggestionAccepted && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-success-50 to-primary-50 border border-success-300 rounded-xl p-5"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-success-600" />
                        <div>
                          <h4 className="font-semibold text-neutral-900">AI suggestion applied!</h4>
                          <p className="text-sm text-success-700">Route optimized • Saved 45 minutes</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="bg-white rounded-xl p-6 border border-neutral-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-neutral-900">Activity: Tokyo Tower</h3>
                      <button
                        onClick={() => setJourneyState(prev => ({ ...prev, commentsAdded: prev.commentsAdded + 1 }))}
                        className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {journeyState.commentsAdded} comments
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
                        <ThumbsUp className="w-4 h-4 inline mr-1" /> 4
                      </button>
                      <button className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium">0</button>
                    </div>
                  </div>

                  <button
                    onClick={goNext}
                    className="w-full px-6 py-3 bg-success-600 text-white rounded-lg font-semibold hover:bg-success-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Finalize Plan
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-5 border border-neutral-200">
                    <h4 className="font-semibold text-neutral-900 mb-3">Team Activity</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-neutral-700">
                        <div className="w-6 h-6 rounded-full bg-primary-500" />
                        Alice voted
                      </div>
                      <div className="flex items-center gap-2 text-neutral-700">
                        <div className="w-6 h-6 rounded-full bg-primary-500" />
                        Bob commented
                      </div>
                      {journeyState.commentsAdded > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 text-success-700 font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          You added a comment
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Finalize */}
          {currentStep === "finalize" && (
            <motion.div
              key="finalize"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto px-8 py-24"
            >
              <div className="bg-white rounded-2xl p-12 border border-neutral-200 shadow-xl text-center">
                {!journeyState.finalized ? (
                  <>
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-success-100 to-primary-100 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-success-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-neutral-900 mb-4">Ready to finalize?</h2>
                    <p className="text-lg text-neutral-600 mb-8">
                      All activities have reached consensus. Your trip plan is ready to lock in!
                    </p>
                    <div className="space-y-3 mb-8 text-left max-w-md mx-auto">
                      {["18 activities confirmed", "All team members voted", "Budget: $2,400/person ($600 under)"].map((item) => (
                        <div key={item} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-success-600" />
                          <span className="text-neutral-700">{item}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleFinalize}
                      className="px-8 py-4 bg-success-600 text-white rounded-xl font-semibold hover:bg-success-700 transition-all shadow-lg"
                    >
                      Finalize Trip Plan
                    </button>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-success-500 to-primary-500 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-neutral-900 mb-4">Trip Finalized!</h2>
                    <p className="text-lg text-success-700">Moving to expense tracking...</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Expense */}
          {currentStep === "expense" && (
            <motion.div
              key="expense"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto px-8 py-12"
            >
              <h2 className="text-3xl font-bold text-neutral-900 mb-8">Track Expenses</h2>

              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-4">
                  {[
                    { name: "Lunch at Asakusa", amount: 85, split: 4 },
                    { name: "Tokyo Skytree tickets", amount: 140, split: 4 },
                    { name: "JR Pass", amount: 280, split: 4 },
                  ].map((expense, i) => (
                    <motion.div
                      key={expense.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-xl p-5 border border-neutral-200"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-neutral-900 mb-1">{expense.name}</h4>
                          <p className="text-sm text-neutral-500">${(expense.amount / expense.split).toFixed(2)}/person</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-neutral-900">${expense.amount}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-white rounded-xl p-6 border border-neutral-200">
                  <h4 className="font-semibold text-neutral-900 mb-4">Total Spent</h4>
                  <div className="text-3xl font-bold text-neutral-900 mb-2">$505</div>
                  <p className="text-sm text-neutral-600 mb-4">$126.25 per person</p>
                  <div className="h-2 bg-neutral-100 rounded-full">
                    <div className="h-full w-[25%] bg-gradient-to-r from-primary-500 to-primary-400 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={goNext}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary-600 transition-all inline-flex items-center gap-2"
                >
                  View Trip Summary
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Summary */}
          {currentStep === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-6xl mx-auto px-8 py-12"
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-24 h-24 rounded-3xl bg-gradient-to-br from-success-500 to-primary-500 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>
                <h1 className="text-4xl font-bold text-neutral-900 mb-4">Trip Complete!</h1>
                <p className="text-xl text-neutral-600">
                  {journeyState.tripName || "Tokyo Adventure"} • April 15-22, 2026
                </p>
              </div>

              <div className="grid grid-cols-5 gap-4 mb-12">
                {[
                  { label: "Days", value: "7" },
                  { label: "Activities", value: "18" },
                  { label: "Budget Used", value: "$935" },
                  { label: "Team Consensus", value: "92%" },
                  { label: "AI Savings", value: "$215" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="bg-white rounded-xl p-6 border border-neutral-200 text-center"
                  >
                    <div className="text-3xl font-bold text-neutral-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-neutral-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 border border-primary-200 text-center"
              >
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                  "Best planned trip we've ever had!"
                </h3>
                <p className="text-neutral-700 mb-6">
                  Collaboration before automation made everyone feel included. AI saved us hours of planning.
                </p>
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={onExit}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-600 transition-colors"
                  >
                    Exit Prototype
                  </button>
                  <button
                    onClick={() => {
                      setCurrentStep("landing");
                      setJourneyState({
                        tripName: "",
                        members: 0,
                        votedActivities: new Set(),
                        aiSuggestionAccepted: false,
                        commentsAdded: 0,
                        finalized: false,
                        expensesLogged: 0,
                      });
                    }}
                    className="px-6 py-3 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
                  >
                    Restart Journey
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
