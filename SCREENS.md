# HelloWorld - High-Fidelity Desktop Screens

Complete set of production-ready desktop screens (1440px width) for HelloWorld, the AI-powered collaborative travel planning platform.

---

## Screen Overview

1. **Landing** - Marketing page with collaborative CTA
2. **Trip Creation Wizard** - 3-step onboarding (Basics, Members, Preferences)
3. **AI Draft Itinerary** - Day tabs, map, budget overview
4. **Co-Create Workspace** - 3-column collaboration interface (core page)
5. **AI Assistant** - Focused AI interaction view
6. **Expense Tracking** - Split settlement and category views
7. **Trip Summary** - Post-trip archive with diary and highlights

---

## 1. Landing Page

**Purpose**: Communicate collaborative-first value proposition and drive sign-ups

### Key Features
- Hero section emphasizing "Plan trips together, not alone"
- Live collaborative trip card preview with voting
- Feature cards: Democratic decisions, AI as participant, Real-time collaboration
- How it works: 4-step process
- Stats: 10K+ trips, 45K+ decisions, 98% satisfaction

### CTAs
- **Primary**: "Start Collaborative Planning" → Trip Wizard
- **Secondary**: "See demo"
- **Header**: "Get started" → Trip Wizard

### Visual Elements
- Team avatars showing collaborative nature
- AI suggestion chip in hero
- Budget progress indicator
- Voting controls showcase
- Team member status

---

## 2. Trip Creation Wizard

**Purpose**: Onboard users and gather group preferences before AI generation

### Step 1: Trip Basics
**Fields:**
- Trip name (text input)
- Destination (location search)
- Start date (date picker)
- End date (date picker)

**CTA**: Continue → Step 2

### Step 2: Add Members
**Features:**
- Email invitation input
- Member list with avatars
- Remove member functionality
- Collaboration explainer (everyone can vote/propose)

**CTA**: Continue → Step 3

### Step 3: Preferences
**Fields:**
- Budget per person (USD)
- Travel pace (relaxed/moderate/active cards)
- Interests (multi-select: culture, food, nature, relaxation)

**Features:**
- AI summary preview panel showing collected preferences
- Stats display (budget, pace, interests count)
- Purple gradient AI branding

**CTA**: "Generate AI Draft" → AI Draft page

### UX Notes
- Progress indicator with 3 steps
- Back navigation on each step
- Form validation before proceeding
- Visual feedback for completed steps

---

## 3. AI Draft Itinerary

**Purpose**: Present AI-generated initial plan for group review

### Layout
**Left (66%)**: Day tabs + Activities list
**Right (33%)**: Map + Budget + Team + AI Insights

### Key Features

**Day Tabs**
- Horizontal scrollable tabs (Day 1-7)
- Active state highlighting
- Date labels

**Activity Cards**
- Time, duration, cost
- Consensus percentage badge
- Vote buttons (thumbs up/down)
- Consensus bar visualization
- Color coding by status

**Map View**
- Day-specific route visualization
- Location markers
- Activity count

**Budget Progress**
- Total spent vs. budget
- Percentage used
- Per-person breakdown
- Remaining amount with trend

**Team Status**
- 4 members with avatars
- Online status indicators
- "Ready to vote" labels

**AI Insights Panel**
- Purple gradient branding
- Benefits list:
  - Route optimized
  - Morning timing
  - Balanced mix

### Actions
- **Primary**: "Start Collaborating" → Co-Create Workspace
- **Secondary**: Regenerate, Export
- **Per Activity**: Vote (up/down)

### UX Notes
- All activities pre-voted by AI simulation
- Consensus meters encourage participation
- Budget tracking visible upfront
- AI branding distinguishes this from manual creation

---

## 4. Co-Create Workspace (CORE PAGE)

**Purpose**: Primary collaboration interface for group decision-making

### 3-Column Layout (1440px)

**Top Sticky Bar:**
- Trip name + dates
- Team avatars (4 online)
- Budget progress (48%)
- Version indicator (v12)
- Unresolved count (3)
- **Primary CTA**: "Finalize Plan"

### Left Column (25%): Decision Queue
**Features:**
- Unresolved items list (warning borders)
- Vote counts per item
- Comment counts
- Quick vote buttons
- Consensus bars
- AI suggestions (purple cards)
  - Accept/Dismiss actions
  - Sparkles branding
- "Propose Activity" button

**Content:**
- Ginza Shopping (2 for, 2 against, 3 comments)
- Robot Restaurant (1 for, 3 against, 5 comments)
- Mount Fuji Day Trip (3 for, 1 against, 7 comments)

### Center Column (50%): Itinerary Board
**Features:**
- Day tabs (1-7)
- Day overview header
  - Consensus percentage
  - Activity count
- Timeline view with cards
  - Time markers
  - Status chips
  - Activity names
  - Vote controls with consensus bars
  - Comment previews
  - Connecting lines
- "Add activity to this day" button

**UX:**
- Visual timeline with circular time markers
- Status-based color coding
- Hover states on activity cards
- Expandable comment sections

### Right Column (25%): AI + Team Panel
**AI Assistant Section:**
- Purple gradient border
- Message: "I noticed 3 activities need consensus..."
- Quick action chips:
  - Optimize route
  - Find alternatives
  - Balance budget
- Text input with send button
- Sparkles icon branding

**Team Activity Feed:**
- Recent actions with timestamps
- Member avatars
- Action types: voted, commented, proposed, joined
- Relative time (2m, 5m, 1h ago)

**Trip Stats:**
- Total activities: 18
- Consensus reached: 12 (green)
- Needs voting: 3 (amber)
- Comments: 42
- Overall progress: 67% bar

### State Management
- Real-time collaboration simulation
- Vote state changes
- Comment counts
- Team activity stream
- Budget updates

### Navigation Points
- Can navigate to AI Assistant (full screen)
- Can navigate to Expense Tracking
- Can navigate to Trip Summary (after finalization)

---

## 5. AI Assistant

**Purpose**: Focused AI interaction for optimization and problem-solving

### Layout
- Back button → Workspace
- Trip header (name, dates)
- Centered content (max-width: 5xl)

### Sections

**Hero**
- Large gradient icon (purple to pink)
- Title: "AI Assistant"
- Subtitle explaining capabilities

**Quick Actions (3×2 grid)**
- Optimize route
- Balance budget
- Add buffer time
- Find alternatives
- Handle conflicts
- Split by interest

Each card:
- Icon (primary color)
- Bold label
- Description text
- Hover state

**Active Suggestions**
- Full AI suggestion cards
- Title + detailed description
- Accept/Reject buttons
- Examples:
  - Optimize Day 2 route
  - Add rest periods
  - Budget optimization

**Proposed Changes (Diff Card)**
- Before/After comparison
- Two-column layout
- Timeline visualizations
- Savings highlighted
- Accept/Reject actions
- Example: Route optimization saving 45 minutes

**Ask AI Panel**
- Large text input
- Quick suggestion chips
- Send button
- Loading state

**Recent AI Activity**
- List of past AI actions
- Result summaries
- Accepted/Dismissed status
- Timestamps
- Success indicators

### UX Notes
- Purple gradient consistent AI branding
- Clear before/after comparisons
- Quantified benefits (time saved, cost reduced)
- Non-blocking suggestions (user maintains control)

---

## 6. Expense Tracking

**Purpose**: Real-time expense logging and settlement calculation

### View Toggle
- Expenses view (default)
- Settlement view

### Expenses View

**Left Column (33%)**
**Budget Overview:**
- Total budget progress bar
- Current vs. budget
- Percentage used
- Remaining amount

**Category Filter:**
- All expenses (selected state)
- Food (Utensils icon)
- Activities (MapPin icon)
- Transport (Plane icon)
- Shopping (ShoppingBag icon)
- Lodging (Home icon)

**Category Breakdown:**
- Percentage bars
- Amount per category

**Right Column (66%)**
**Expense List:**
- Date + category badge
- Description
- Payer avatar + name
- Amount (large, bold)
- Per-person split
- Split-with avatars
- Hover effects

**Sample Expenses:**
- Lunch at Asakusa: $85 (4-way split)
- Tokyo Skytree: $140 (4-way split)
- Tsukiji breakfast: $65 (3-way split)
- JR Pass: $280 (4-way split)
- Ginza shopping: $320 (personal)

### Settlement View

**Left Column (33%)**
**Member Balances:**
- Avatar + name
- Gets back / Owes / Settled status
- Amount (green=credit, red=debit)
- Paid total
- Owes amount

**Members:**
- Alice: +$152 (paid $365)
- Bob: -$55 (paid $185, owes $105)
- Carol: -$180 (paid $65, owes $48)
- David: +$83 (paid $320)

**Right Column (66%)**
**Summary Cards:**
- Total spent: $935
- Settled: 1/4 members
- Transactions: 3 to settle

**Settlement Instructions:**
- Visual flow (sender → amount → receiver)
- Colored avatars (red=sender, green=receiver)
- "Mark Paid" buttons
- Optimized for minimum transactions

**Settlements:**
- Bob → Alice: $105
- Carol → Alice: $48
- David → Bob: $15

**Actions:**
- Export CSV
- Share Settlement

### UX Notes
- Real-time balance calculations
- Optimal split algorithm (minimize transactions)
- Visual debt flow
- Clear action items
- Per-person transparency

---

## 7. Trip Summary

**Purpose**: Post-trip archive, memories, and learnings

### Header
- Trip name + metadata
- Dates, travelers count
- "Completed" status chip
- **Actions**: Export, Share Trip

### Trip Stats (5 cards)
- 7 Days
- 24 Activities
- $935 Per person
- 156 Photos
- 92% Consensus

### Trip Highlights
- 2×2 grid of top moments
- Photo placeholders
- Day labels
- Activity names
- 5-star ratings
- Reactions + comments count

**Examples:**
- Day 1: Senso-ji Temple (5 stars)
- Day 2: Tsukiji Market (5 stars)
- Day 3: Meiji Shrine (4 stars)
- Day 5: Mount Fuji (5 stars)

### Route Replay
**Map Section:**
- Interactive day selector (1-7 buttons)
- Gradient map visualization
- Route overlay (dashed line)
- Location markers

**Timeline Section:**
- Day number + date
- Completed activities list
- Time markers
- Checkmarks (all completed)
- 100% completion badge

### Collaborative Diary
- 2×2 grid of entries
- Member avatars
- Day labels
- Personal reflections
- Photo counts
- Likes + comments

**Sample Entries:**
- Alice: "Amazing start! AI's early suggestion was perfect"
- Bob: "Tokyo Skytree views worth every penny"
- Carol: "Best sushi at Tsukiji early morning tour"
- David: "Harajuku street fashion was wild"

### Team Reflections
**What Worked Great:**
- Early morning temple visits
- AI route optimization
- Group voting
- Budget tracking

**Lessons Learned:**
- Book restaurants ahead
- Keep flexible days
- Weather backups
- Rest days important

**Team Quote:**
"Best planned trip we've ever had! The collaborative approach made everyone feel included."

### UX Notes
- Celebration of completed journey
- Data-driven insights
- Social proof of collaboration
- Exportable memories
- Learnings for future trips

---

## Design System Continuity

### Colors
- Primary: Ocean blue (#0A7EA4)
- AI: Purple-pink gradient
- Success: Green
- Warning: Amber
- Danger: Red
- Neutrals: Cool grays

### Components Used
- VoteControl (workspace, draft)
- StatusChip (all pages)
- BudgetProgress (draft, expense)
- AlertBanner (workspace)
- AISuggestionChip (workspace, ai)
- AIActionPanel (ai)
- DiffCard (ai)
- TimelineItem (summary)

### Typography
- Display: 48-60px bold
- H1: 24px medium
- H2: 20px medium
- H3: 18px medium
- Body: 16px normal
- Caption: 14px normal

### Spacing
- Section gaps: 48-64px
- Card padding: 24-32px
- Component gaps: 16-24px
- Tight spacing: 8-12px

### Radius
- Cards: 12-16px
- Buttons: 8-12px
- Chips: 6-8px or full (pills)
- Avatars: Full circle

---

## Navigation Flow

```
Landing
  ↓ "Start Planning"
Trip Wizard (3 steps)
  ↓ "Generate AI Draft"
AI Draft Itinerary
  ↓ "Start Collaborating"
Co-Create Workspace ←→ AI Assistant
  ↓                  ←→ Expense Tracking
  ↓ "Finalize Plan"
(Trip happens)
  ↓
Trip Summary
```

### Quick Nav Menu
- Fixed bottom-right panel (dev tool)
- Jump to any screen instantly
- Shows current screen
- Useful for testing/demos

---

## Screen-Specific Features

### Collaboration Visibility
**Every major page shows:**
- Team member avatars
- AI presence (purple branding)
- Real-time activity indicators
- Group decision mechanics

### AI Integration
**AI appears on:**
1. Landing (preview card)
2. Wizard Step 3 (summary panel)
3. AI Draft (insights panel)
4. Workspace (right panel + suggestions)
5. AI Assistant (entire page)
6. Summary (AI attribution in reflections)

### Decision Mechanics
**Voting shown on:**
- Landing (preview)
- AI Draft (per activity)
- Co-Create Workspace (detailed controls)

**Consensus indicators:**
- Percentage badges
- Progress bars
- Color coding (green > amber > red)

### Product Continuity
- Ocean blue primary throughout
- Consistent card-based layout
- Avatar system (gradient circles)
- Status chips
- Budget tracking across journey
- AI purple gradient reserved exclusively

---

## Technical Notes

### Component Structure
```
src/app/
├── App.tsx (navigation controller)
├── screens/
│   ├── Landing.tsx
│   ├── TripWizard.tsx
│   ├── AIDraft.tsx
│   ├── CoCreateWorkspace.tsx
│   ├── AIAssistant.tsx
│   ├── ExpenseTracking.tsx
│   └── TripSummary.tsx
└── components/
    └── helloworld/
        ├── VoteControl.tsx
        ├── StatusChip.tsx
        ├── TimelineItem.tsx
        ├── BudgetProgress.tsx
        ├── AlertBanner.tsx
        ├── AISuggestionChip.tsx
        ├── AIActionPanel.tsx
        └── DiffCard.tsx
```

### State Management
- Simple useState for screen navigation
- Props-based data flow
- Mock data for all screens
- Simulated user interactions

### Responsive Notes
- Designed for 1440px desktop
- Fixed widths for complex layouts
- Grid-based responsive sections where appropriate
- Mobile not prioritized (desktop-first SaaS)

---

## Usage

Navigate between screens using:
1. Natural flow (CTAs on each page)
2. Quick Nav menu (bottom-right, always visible)

All screens are fully interactive with:
- Clickable buttons
- Hover states
- Form inputs
- Tab switching
- Modal triggers (simulated)

---

**Design System Version:** 1.0  
**Screens Completed:** 7/7  
**Status:** Production Ready  
**Last Updated:** April 12, 2026
