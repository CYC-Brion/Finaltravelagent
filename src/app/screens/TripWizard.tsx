import { useState } from "react";
import { ArrowRight, ArrowLeft, Globe, MapPin, Calendar, DollarSign, Users, Mail, Plus, X, Zap, Coffee, Camera, Mountain, Utensils, Sparkles, Check } from "lucide-react";
import { DatePickerInput } from "../components/helloworld/DatePickerInput";
import { ShareOptionsPanel } from "../components/helloworld/ShareOptionsPanel";
import { BudgetRangeInput } from "../components/helloworld/BudgetRangeInput";
import type { CreateTripInput } from "@/domain/types";

interface TripWizardProps {
  onComplete?: () => void;
  onSubmit?: (data: CreateTripInput) => void | Promise<void>;
  onBack: () => void;
  submitting?: boolean;
}

export function TripWizard({ onComplete, onSubmit, onBack, submitting = false }: TripWizardProps) {
  const [step, setStep] = useState(1);
  const [tripData, setTripData] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    members: [] as string[],
    budgetMin: "",
    budgetMax: "",
    pace: "moderate" as "relaxed" | "moderate" | "active",
    interests: [] as string[],
  });

  const [memberEmail, setMemberEmail] = useState("");

  const addMember = () => {
    if (memberEmail && !tripData.members.includes(memberEmail)) {
      setTripData({ ...tripData, members: [...tripData.members, memberEmail] });
      setMemberEmail("");
    }
  };

  const removeMember = (email: string) => {
    setTripData({ ...tripData, members: tripData.members.filter(m => m !== email) });
  };

  const toggleInterest = (interest: string) => {
    if (tripData.interests.includes(interest)) {
      setTripData({ ...tripData, interests: tripData.interests.filter(i => i !== interest) });
    } else {
      setTripData({ ...tripData, interests: [...tripData.interests, interest] });
    }
  };

  const interests = [
    { id: "culture", label: "Culture & Museums", icon: Camera },
    { id: "food", label: "Food & Dining", icon: Utensils },
    { id: "nature", label: "Nature & Hiking", icon: Mountain },
    { id: "relaxation", label: "Relaxation", icon: Coffee },
  ];

  const canProceed = () => {
    if (step === 1) return tripData.name && tripData.destination && tripData.startDate && tripData.endDate;
    if (step === 2) return tripData.members.length > 0;
    if (step === 3) {
      const minBudget = parseFloat(tripData.budgetMin) || 0;
      const maxBudget = parseFloat(tripData.budgetMax) || 0;
      return tripData.budgetMin && tripData.budgetMax && minBudget <= maxBudget && tripData.pace && tripData.interests.length > 0;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-neutral-900">HelloWorld</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-12">
          {[
            { num: 1, label: "Trip Basics", active: step === 1, complete: step > 1 },
            { num: 2, label: "Add Members", active: step === 2, complete: step > 2 },
            { num: 3, label: "Preferences", active: step === 3, complete: step > 3 },
          ].map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  s.complete
                    ? "bg-primary-600 text-white"
                    : s.active
                    ? "bg-primary-100 text-primary-700 ring-4 ring-primary-100"
                    : "bg-neutral-100 text-neutral-400"
                }`}>
                  {s.complete ? <Check className="w-5 h-5" /> : s.num}
                </div>
                <div>
                  <div className={`text-sm font-semibold ${s.active ? "text-neutral-900" : "text-neutral-500"}`}>
                    Step {s.num}
                  </div>
                  <div className={`text-xs ${s.active ? "text-neutral-600" : "text-neutral-400"}`}>
                    {s.label}
                  </div>
                </div>
              </div>
              {i < 2 && (
                <div className="flex-1 h-1 mx-6 bg-neutral-200 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${s.complete ? "w-full bg-primary-600" : "w-0"}`} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Trip Basics */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-neutral-900 mb-3">Let's start your trip</h1>
              <p className="text-lg text-neutral-600">Tell us the basics about your adventure</p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-lg space-y-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Trip name</label>
                <input
                  type="text"
                  placeholder="e.g., Tokyo Adventure 2026"
                  value={tripData.name}
                  onChange={(e) => setTripData({ ...tripData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 bg-input-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    value={tripData.destination}
                    onChange={(e) => setTripData({ ...tripData, destination: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-neutral-200 bg-input-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DatePickerInput
                  label="Start date"
                  value={tripData.startDate}
                  onChange={(value) => setTripData({ ...tripData, startDate: value })}
                  placeholder="Select start date"
                />
                <DatePickerInput
                  label="End date"
                  value={tripData.endDate}
                  onChange={(value) => setTripData({ ...tripData, endDate: value })}
                  placeholder="Select end date"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Add Members */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-neutral-900 mb-3">Who's coming along?</h1>
              <p className="text-lg text-neutral-600">Invite your travel companions to collaborate</p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-lg space-y-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Invite by email</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="email"
                      placeholder="friend@example.com"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addMember()}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-neutral-200 bg-input-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    onClick={addMember}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add
                  </button>
                </div>
              </div>

              {tripData.members.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">
                    Team members ({tripData.members.length})
                  </label>
                  <div className="space-y-2">
                    {tripData.members.map((email, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white font-semibold">
                            {email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-neutral-900">{email}</div>
                            <div className="text-xs text-neutral-500">Invitation pending</div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeMember(email)}
                          className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 text-neutral-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-200">
                <div className="flex items-start gap-3 p-4 bg-primary-50 rounded-lg border border-primary-200 mb-6">
                  <Users className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-primary-900 mb-1">Collaboration starts now</div>
                    <div className="text-sm text-primary-700">
                      Everyone you invite will be able to vote, propose activities, and help plan the trip together.
                    </div>
                  </div>
                </div>

                <ShareOptionsPanel />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-neutral-900 mb-3">Set your preferences</h1>
              <p className="text-lg text-neutral-600">Help AI understand what your group wants</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-lg space-y-6">
                <BudgetRangeInput
                  minValue={tripData.budgetMin}
                  maxValue={tripData.budgetMax}
                  onMinChange={(value) => setTripData({ ...tripData, budgetMin: value })}
                  onMaxChange={(value) => setTripData({ ...tripData, budgetMax: value })}
                />

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">Travel pace</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "relaxed", label: "Relaxed", desc: "2-3 activities/day", icon: Coffee },
                      { id: "moderate", label: "Moderate", desc: "4-5 activities/day", icon: Zap },
                      { id: "active", label: "Active", desc: "6+ activities/day", icon: Mountain },
                    ].map((pace) => (
                      <button
                        key={pace.id}
                        onClick={() => setTripData({ ...tripData, pace: pace.id as any })}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          tripData.pace === pace.id
                            ? "border-primary-500 bg-primary-50"
                            : "border-neutral-200 bg-white hover:border-primary-200"
                        }`}
                      >
                        <pace.icon className={`w-6 h-6 mb-2 ${tripData.pace === pace.id ? "text-primary-600" : "text-neutral-400"}`} />
                        <div className="font-semibold text-neutral-900 mb-1">{pace.label}</div>
                        <div className="text-xs text-neutral-500">{pace.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">Interests</label>
                  <div className="grid grid-cols-2 gap-3">
                    {interests.map((interest) => (
                      <button
                        key={interest.id}
                        onClick={() => toggleInterest(interest.id)}
                        className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                          tripData.interests.includes(interest.id)
                            ? "border-primary-500 bg-primary-50"
                            : "border-neutral-200 bg-white hover:border-primary-200"
                        }`}
                      >
                        <interest.icon className={`w-5 h-5 ${tripData.interests.includes(interest.id) ? "text-primary-600" : "text-neutral-400"}`} />
                        <span className="font-medium text-neutral-900">{interest.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Summary Preview */}
              {tripData.budgetMin && tripData.budgetMax && tripData.pace && tripData.interests.length > 0 && (
                <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-2xl p-8 border border-purple-200">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-purple-900 mb-2">AI is ready to help</h3>
                      <p className="text-sm text-purple-700">
                        Based on your preferences, AI will generate personalized suggestions when you start planning.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-white/50 rounded-lg">
                      <div className="text-xs text-purple-600 mb-1">Budget Range</div>
                      <div className="font-semibold text-purple-900 text-sm">
                        ${tripData.budgetMin}-${tripData.budgetMax}
                      </div>
                    </div>
                    <div className="p-3 bg-white/50 rounded-lg">
                      <div className="text-xs text-purple-600 mb-1">Pace</div>
                      <div className="font-semibold text-purple-900 capitalize">{tripData.pace}</div>
                    </div>
                    <div className="p-3 bg-white/50 rounded-lg">
                      <div className="text-xs text-purple-600 mb-1">Interests</div>
                      <div className="font-semibold text-purple-900">{tripData.interests.length} selected</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="max-w-2xl mx-auto mt-8 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={async () => {
                const payload: CreateTripInput = {
                  name: tripData.name,
                  destination: tripData.destination,
                  startDate: tripData.startDate,
                  endDate: tripData.endDate,
                  members: tripData.members,
                  budgetMin: Number(tripData.budgetMin),
                  budgetMax: Number(tripData.budgetMax),
                  pace: tripData.pace,
                  interests: tripData.interests,
                };

                if (onSubmit) {
                  await onSubmit(payload);
                  return;
                }

                onComplete?.();
              }}
              disabled={!canProceed() || submitting}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {submitting ? "Creating Trip..." : "Generate AI Draft"}
              <Sparkles className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
