# HelloWorld - Screen Index

## Production Screens (Presentation Ready)

### 1. Landing Page
**File**: `src/app/screens/Landing.tsx`
- Marketing hero section
- Product value proposition
- Feature showcase with live preview
- Primary CTA: "Get started"

### 2. Trip Creation Wizard
**File**: `src/app/screens/TripWizard.tsx`
- **Step 1**: Trip basics (name, destination, dates)
- **Step 2**: Add team members via email
- **Step 3**: Set preferences (budget, pace, interests)
- AI generation prompt at end of Step 3

### 3. AI Draft Itinerary
**File**: `src/app/screens/AIDraft.tsx`
- **Day tabs**: 1-7 (all functional with content)
- AI-generated 7-day itinerary
- Initial voting interface
- Budget overview
- Primary CTA: "Start Collaborating"

### 4. Co-Create Workspace
**File**: `src/app/screens/CoCreateWorkspace.tsx`
- **Day tabs**: 1-7 (all functional with content)
- **3-column layout**:
  - Left: Decision Queue + AI Suggestions
  - Center: Day-by-day itinerary with voting
  - Right: AI Assistant + Team Activity Feed
- Real-time collaboration indicators
- Budget and consensus tracking
- Primary CTA: "Finalize Plan"

### 5. AI Assistant
**File**: `src/app/screens/AIAssistant.tsx`
- Dedicated AI interaction panel
- Before/after diff views
- Alternative suggestions
- Contextual chat interface

### 6. On-Trip Dashboard
**File**: `src/app/screens/OnTripDashboard.tsx`
- Current day overview (Day 3)
- Today's activities (completed/current/upcoming)
- AI daily replan suggestions (weather-based)
- Trip progress tracking
- Team activity feed
- Primary CTA: "Track Expenses"

### 7. Live Expense Tracking
**File**: `src/app/screens/ExpenseTracking.tsx`
- **Two views**: Expenses ⟷ Settlement
- Real-time expense logging
- Per-person split calculations
- Balance and settlement plan
- Category breakdown
- Primary CTA: "Complete Trip"

### 8. After-Trip Summary
**File**: `src/app/screens/TripSummary.tsx`
- **Day tabs**: 1-7 (all functional with content)
- Trip statistics and highlights
- Route replay with interactive map
- Collaborative trip diary
- Team reflections
- Export and share options
- Primary CTA: "Plan Another Trip"

---

## Component Library

### Core Components
- `src/app/components/helloworld/VoteControl.tsx` - Voting interface
- `src/app/components/helloworld/StatusChip.tsx` - Trip/activity status indicators
- `src/app/components/helloworld/BudgetProgress.tsx` - Budget visualization
- `src/app/components/helloworld/AIActionPanel.tsx` - AI prompt interface
- `src/app/components/helloworld/DiffCard.tsx` - Before/after comparisons

### State Components
- `src/app/components/helloworld/EmptyStates.tsx` - Empty state variations
- `src/app/components/helloworld/LoadingStates.tsx` - Loading animations
- `src/app/components/helloworld/ErrorStates.tsx` - Error handling
- `src/app/components/helloworld/CollaborationStates.tsx` - Team collaboration states
- `src/app/components/helloworld/AIStates.tsx` - AI interaction states

---

## Design System

### Theme
**File**: `src/styles/theme.css`
- Color tokens (ocean blue primary, neutral grays)
- Typography scale
- Spacing and radius tokens
- Shadow and gradient definitions

### Utilities
**File**: `src/lib/utils.ts`
- className merging utility

---

## Navigation Flow

```
App.tsx (Router)
    ├─ Landing
    ├─ TripWizard
    ├─ AIDraft
    ├─ CoCreateWorkspace
    │   └─ AIAssistant
    ├─ OnTripDashboard
    ├─ ExpenseTracking
    └─ TripSummary
```

---

## Key Features by Screen

### Pre-Trip Planning
1. **Landing** - Value proposition
2. **Wizard** - Team onboarding
3. **AI Draft** - AI generation
4. **Co-Create** - Collaborative refinement

### During Trip
5. **On-Trip Dashboard** - Daily tracking
6. **Expense Tracking** - Real-time splits

### Post-Trip
7. **Trip Summary** - Reflection and sharing

---

## Screen Specifications

- **Design Width**: 1440px
- **Typography**: Default system fonts with custom scale
- **Color System**: Ocean blue (#0A7EA4) primary
- **Layout**: Card-based with rounded corners
- **Interactions**: Smooth transitions, no flashy effects
- **Accessibility**: Semantic HTML, ARIA labels

---

**Product**: HelloWorld AI Travel Planning  
**Total Screens**: 8 production screens  
**Status**: Complete and presentation-ready
