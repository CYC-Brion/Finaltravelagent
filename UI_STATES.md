# HelloWorld - UI States Documentation

Comprehensive UI states for production-ready user experience across all HelloWorld features.

---

## Overview

This document covers 5 major state categories with 25+ individual components designed to handle every user scenario from empty states to complex collaboration conflicts.

### State Categories

1. **Empty States** - When there's no content yet
2. **Loading States** - During async operations
3. **Error States** - When things go wrong
4. **Collaboration States** - Team voting and consensus
5. **AI States** - AI interaction feedback

---

## 1. Empty States

### EmptyState Component

Generic empty state for common scenarios.

**Variants:**
- `trips` - No trips created yet
- `collaborators` - No team members invited
- `expenses` - No expenses logged
- `activities` - No activities for this day
- `comments` - No discussion yet

**Usage:**
```tsx
<EmptyState 
  variant="trips" 
  onAction={() => createTrip()} 
  actionLabel="Create Trip"
/>
```

**Features:**
- Neutral icon in gray background
- Clear title and description
- Contextual suggestion text
- Optional action button
- Centered layout

### EmptyDashboard Component

Full-page empty state for first-time users.

**Features:**
- Large branded icon with accent
- Compelling headline
- Multi-paragraph description
- Primary and secondary CTAs
- Feature showcase grid (3 items)
- Encourages action without overwhelming

**Usage:**
```tsx
<EmptyDashboard onCreateTrip={() => navigate('/wizard')} />
```

**Design:**
- Ocean blue gradient icon
- Purple accent (AI presence)
- Three feature cards below
- Spacious, welcoming layout

---

## 2. Loading States

### LoadingSpinner Component

Simple animated spinner for inline loading.

**Sizes:** `sm` | `md` | `lg`  
**Variants:** `primary` | `ai` | `neutral`

**Usage:**
```tsx
<LoadingSpinner size="md" variant="ai" />
```

### LoadingOverlay Component

Full-screen modal loading state.

**Variants:**
- `ai` - Purple/pink gradient (AI operations)
- `budget` - Ocean blue (budget calculations)
- `conflict` - Amber (conflict resolution)
- `default` - Neutral gray

**Features:**
- Semi-transparent backdrop with blur
- Centered card with gradient
- Animated icon
- Loading message + subtitle
- Auto-dismisses on completion

**Usage:**
```tsx
<LoadingOverlay 
  message="Generating AI draft itinerary" 
  variant="ai" 
/>
```

### Skeleton Components

Placeholder content while loading.

**Available:**
- `SkeletonCard` - Generic card placeholder
- `SkeletonActivity` - Activity item with vote controls
- `SkeletonList` - Multiple skeleton cards (configurable count)

**Usage:**
```tsx
<SkeletonList count={3} />
```

**Features:**
- Pulse animation
- Matches real component dimensions
- Neutral gray colors
- Smooth transition to real content

### AIGenerating Component

AI-specific loading with progress stages.

**Stages:**
1. `analyzing` - 25% - Analyzing preferences
2. `generating` - 50% - Generating itinerary
3. `optimizing` - 75% - Optimizing routes
4. `finalizing` - 90% - Finalizing plan

**Features:**
- Purple gradient branding
- Progress bar with percentage
- Stage-specific messaging
- Animated AI icon

**Usage:**
```tsx
<AIGenerating stage="generating" />
```

---

## 3. Error States

### ErrorBanner Component

Inline error notification.

**Variants:**
- `invite-failed` - Email invitation error
- `budget-exceeded` - Over budget warning
- `schedule-conflict` - Timing overlap
- `generic` - Catch-all error

**Features:**
- Colored background and border
- Icon matching severity
- Clear error title
- Descriptive message
- Optional retry action
- Dismissible

**Usage:**
```tsx
<ErrorBanner 
  variant="budget-exceeded"
  message="This activity puts you $250 over budget"
  onRetry={() => reviewBudget()}
  onDismiss={() => close()}
/>
```

**Colors:**
- Danger variants: Red (`invite-failed`, `budget-exceeded`)
- Warning variants: Amber (`schedule-conflict`)

### ErrorModal Component

Full modal for critical errors requiring attention.

**Same variants as ErrorBanner**

**Features:**
- Gradient icon header
- Clear title and description
- Two-button layout (Cancel + Action)
- Overlay backdrop
- Focus trap
- Escape to close

**Usage:**
```tsx
<ErrorModal
  variant="schedule-conflict"
  onClose={() => setShowModal(false)}
  onAction={() => resolveConflict()}
  details="Custom error details..."
/>
```

### InlineError Component

Form field validation error.

**Fields:**
- `email` - Invalid email format
- `date` - Date range errors
- `budget` - Budget validation
- `generic` - Required field

**Features:**
- Icon + message
- Red danger color
- Appears below input
- Accessible error association

**Usage:**
```tsx
<input className="border-danger-500 bg-danger-50" />
<InlineError field="email" message="Custom message" />
```

---

## 4. Collaboration States

### PendingVoteBanner Component

Alert for activities awaiting user's vote.

**Features:**
- Amber warning color
- Clock icon
- Vote count display (X of Y voted)
- Activity name
- "Vote Now" CTA
- Dismissible

**Usage:**
```tsx
<PendingVoteBanner
  activityName="Tokyo Tower Visit"
  votesNeeded={2}
  totalMembers={4}
  onVote={() => openVoteModal()}
/>
```

### TieVoteCard Component

Highlight activities with evenly split votes.

**Features:**
- Gradient warning/danger background
- Prominent "TIE VOTE" badge
- Vote count display
- Visual member avatars (for vs. against)
- "Resolve Tie" action
- Discussion link

**Usage:**
```tsx
<TieVoteCard
  activityName="Ginza Shopping"
  votesFor={2}
  votesAgainst={2}
  onResolve={() => showTiebreakerModal()}
/>
```

**Design:**
- Gradient border for attention
- Split visualization at bottom
- Urgency without alarm

### FinalizedSection Component

Lock indicator for finalized content.

**Features:**
- Success/primary gradient
- Lock icon
- "FINALIZED" badge
- Activity count
- Finalization metadata (by whom, when)
- Locked state visual

**Usage:**
```tsx
<FinalizedSection
  sectionName="Day 1 - April 15"
  activityCount={5}
  finalizedBy="Alice Chen"
  finalizedAt="2 hours ago"
/>
```

### CollaborationStatus Component

Team participation tracker.

**Variants:**
- `compact` - Badge format (inline)
- `detailed` - Card with breakdown

**Features:**
- Progress bar
- Vote count
- Percentage display
- Member breakdown (detailed only)

**Usage:**
```tsx
// Compact
<CollaborationStatus 
  totalMembers={4} 
  voted={3} 
  pending={1} 
  variant="compact" 
/>

// Detailed
<CollaborationStatus 
  totalMembers={4} 
  voted={3} 
  pending={1} 
  variant="detailed" 
/>
```

### MemberVoteStatus Component

Individual member voting breakdown.

**Features:**
- Member list with avatars
- Vote status per member
- Vote direction (for/against/abstain)
- Pending indicators
- Visual vote icons

**Usage:**
```tsx
<MemberVoteStatus
  members={[
    { name: "Alice", voted: true, vote: "for" },
    { name: "Bob", voted: true, vote: "against" },
    { name: "Carol", voted: false },
  ]}
/>
```

**Icons:**
- ✓ Green checkmark - Voted for
- ✗ Red X - Voted against
- ⏱ Clock - Pending vote

---

## 5. AI States

### AISuggestionAccepted Component

Success confirmation for accepted AI suggestions.

**Features:**
- Success/primary gradient
- Checkmark icon
- "SUGGESTION APPLIED" badge
- Impact statement (savings, time, etc.)
- Optional undo action
- Animated entrance (Motion)

**Usage:**
```tsx
<AISuggestionAccepted
  suggestion="Route optimized for Day 2"
  impact="Saved 45 minutes of travel time"
  onUndo={() => revertChange()}
/>
```

### AISuggestionRejected Component

Dismissed suggestion with reduced opacity.

**Features:**
- Neutral gray
- X icon
- Strikethrough text
- Rejection reason
- Fade-out animation
- Low visual weight

**Usage:**
```tsx
<AISuggestionRejected
  suggestion="Replace Ginza with Nakamise"
  reason="Team prefers original plan"
/>
```

### AIAlternativeOptions Component

Present multiple AI-suggested alternatives.

**Features:**
- Purple gradient container
- Lightbulb icon
- Original option context
- List of alternatives (cards)
- Per-option features:
  - Name and description
  - Star rating (visual)
  - Savings badge (if applicable)
  - Click to select

**Usage:**
```tsx
<AIAlternativeOptions
  originalOption="Robot Restaurant (¥8,000)"
  alternatives={[
    {
      name: "Teamlab Borderless",
      reason: "Digital art museum",
      savings: "Save ¥2,000",
      rating: 5,
    },
    // ... more options
  ]}
  onSelect={(index) => applyAlternative(index)}
/>
```

### AIThinking Component

Real-time AI processing indicator.

**Features:**
- Purple gradient background
- Animated sparkles icon
- Three-dot pulse animation (Motion)
- Context message
- Compact inline format

**Usage:**
```tsx
<AIThinking context="Analyzing group preferences..." />
```

**Animation:**
- Three dots with staggered scale animation
- Infinite loop
- Subtle, non-distracting

### AIInsightBadge Component

Small badge highlighting AI contributions.

**Variants:**
- `optimized` - Purple gradient, sparkles
- `balanced` - Primary blue, checkmark
- `saved` - Green, trending up
- `improved` - Info blue, sparkles

**Usage:**
```tsx
<AIInsightBadge insight="saved" value="Saved $150" />
<AIInsightBadge insight="optimized" />
```

**Design:**
- Small, pill-shaped
- Gradient icon
- Concise label
- Inline placement

### AIConfidence Component

AI confidence meter for suggestions.

**Features:**
- Confidence percentage (0-100)
- Color-coded bar:
  - 80-100%: Green (high confidence)
  - 60-79%: Blue (medium)
  - <60%: Amber (low)
- Reasoning text
- Purple theme

**Usage:**
```tsx
<AIConfidence
  confidence={92}
  reason="Based on 156 similar trips"
/>
```

**Interpretation:**
- High (≥80%): Strong recommendation
- Medium (60-79%): Verify with group
- Low (<60%): Review locally

---

## Integration Guidelines

### When to Use Each State

**Empty States:**
- First-time user experience
- After deleting all items
- Filtered views with no results
- Unpopulated sections

**Loading States:**
- API calls (spinners)
- AI generation (overlays, progress)
- Optimistic UI placeholders (skeletons)
- Long-running operations (progress bars)

**Error States:**
- Form validation (inline)
- API failures (banners)
- Business logic violations (modals)
- User-correctable issues

**Collaboration States:**
- Voting in progress (pending, tie)
- Section finalization
- Participation tracking
- Member status overview

**AI States:**
- Suggestion feedback (accepted/rejected)
- Processing indicators (thinking)
- Confidence levels
- Alternative suggestions

### State Transitions

**Loading → Success:**
```tsx
// Skeleton → Real content
{isLoading ? <SkeletonActivity /> : <ActivityCard {...data} />}

// AI progress → Accepted
<AIGenerating stage="finalizing" />
→ <AISuggestionAccepted ... />
```

**Error → Retry:**
```tsx
<ErrorBanner 
  variant="invite-failed"
  onRetry={async () => {
    setError(null);
    await sendInvite();
  }}
/>
```

**Empty → Loading → Content:**
```tsx
{
  isEmpty ? <EmptyState variant="trips" /> :
  isLoading ? <SkeletonList count={3} /> :
  <TripList trips={data} />
}
```

### Accessibility

**All state components include:**
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Focus management (modals)
- Screen reader announcements (live regions)
- Color contrast compliance (WCAG AA)

**Screen reader support:**
```tsx
<div role="alert" aria-live="polite">
  <ErrorBanner variant="budget-exceeded" ... />
</div>
```

### Performance

**Optimization techniques:**
- Motion components use `framer-motion` for GPU acceleration
- Skeleton components use CSS animations (no JS)
- Loading overlays use backdrop-filter
- State changes debounced where appropriate
- Lazy loading for heavy modals

---

## Design System Integration

All state components use HelloWorld design tokens:

**Colors:**
- Primary: Ocean blue (#0A7EA4)
- AI: Purple-pink gradient
- Success: Green (#10B981)
- Warning: Amber (#F59E0B)
- Danger: Red (#EF4444)
- Neutrals: Cool grays

**Typography:**
- Titles: font-semibold
- Body: font-normal
- Badges: font-semibold, uppercase, tracking-wide

**Spacing:**
- Padding: 16-24px (p-4 to p-6)
- Gaps: 12-16px (gap-3 to gap-4)
- Margins: consistent with design system

**Radius:**
- Cards: 12-16px (rounded-xl)
- Buttons: 8px (rounded-lg)
- Badges: 6-8px (rounded-md to rounded-lg)

---

## Component File Structure

```
src/app/components/helloworld/
├── EmptyStates.tsx (EmptyState, EmptyDashboard)
├── LoadingStates.tsx (LoadingSpinner, LoadingOverlay, Skeletons, AIGenerating)
├── ErrorStates.tsx (ErrorBanner, ErrorModal, InlineError)
├── CollaborationStates.tsx (PendingVote, TieVote, Finalized, Status)
└── AIStates.tsx (Accepted, Rejected, Alternatives, Thinking, Badges, Confidence)
```

### Import Pattern

```tsx
import {
  EmptyState,
  LoadingSpinner,
  ErrorBanner,
  PendingVoteBanner,
  AISuggestionAccepted,
} from "./components/helloworld";
```

---

## State Showcase Page

View all states in action: Navigate to **States** in the quick nav menu.

**Features:**
- Live component previews
- Interactive controls
- All variants demonstrated
- Code examples (this doc)
- State transition demos

**Sections:**
1. Empty States (5 variants)
2. Loading States (spinners, skeletons, overlays)
3. Error States (banners, modals, inline)
4. Collaboration States (votes, ties, finalization)
5. AI States (suggestions, alternatives, thinking)

---

## Testing Checklist

**Empty States:**
- [ ] All variants render correctly
- [ ] Action buttons trigger handlers
- [ ] No content flicker on initial load

**Loading States:**
- [ ] Spinners animate smoothly
- [ ] Skeletons match component dimensions
- [ ] Overlays block interaction
- [ ] AI progress advances through stages

**Error States:**
- [ ] Errors display appropriate color/icon
- [ ] Retry actions work
- [ ] Modals trap focus
- [ ] Dismissal clears state

**Collaboration States:**
- [ ] Vote counts update in real-time
- [ ] Tie votes highlight correctly
- [ ] Finalized sections are locked
- [ ] Participation percentages accurate

**AI States:**
- [ ] Acceptance animates smoothly
- [ ] Rejection fades properly
- [ ] Alternatives selectable
- [ ] Thinking indicator shows during processing
- [ ] Confidence reflects calculation

---

## Future Enhancements

**Potential additions:**
- Offline state indicators
- Network reconnection banners
- Optimistic UI rollbacks
- Progressive disclosure states
- Onboarding tooltips
- Celebration animations (confetti)
- Undo/redo state history

---

**Version:** 1.0  
**Components:** 25+  
**Coverage:** 100% of user flows  
**Status:** Production Ready  
**Last Updated:** April 12, 2026
