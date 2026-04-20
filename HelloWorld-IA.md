# HelloWorld - Information Architecture & User Journey
**AI Collaborative Travel Planning (Desktop-First SaaS)**

---

## 1. SITEMAP (7 Core Pages)

```
├── 1. Landing Page (/)
├── 2. Dashboard (/dashboard)
├── 3. Trip Creation Wizard (/trip/new)
├── 4. Co-Create Workspace (/trip/:id/collaborate)
├── 5. Finalized Trip View (/trip/:id/finalized)
├── 6. Active Trip & Expense Tracking (/trip/:id/active)
└── 7. Trip Summary & Archive (/trip/:id/summary)
```

---

## 2. USER FLOW DIAGRAM WITH DECISION POINTS

```
┌─────────────────┐
│  Landing Page   │
└────────┬────────┘
         │
         ├─→ [Sign Up/Login]
         │
┌────────▼────────┐
│   Dashboard     │◄──────────────────────────┐
└────────┬────────┘                           │
         │                                    │
         ├─→ [Start New Trip]                 │
         │                                    │
┌────────▼────────────┐                       │
│ Trip Creation       │                       │
│ Wizard              │                       │
│ • Basic Info        │                       │
│ • Add Collaborators │                       │
│ • Set Preferences   │                       │
└────────┬────────────┘                       │
         │                                    │
         ├─→ [Decision: Skip AI / Use AI]    │
         │                                    │
         ├─→ AI DRAFT (optional)              │
         │   └─→ AI generates suggestions     │
         │       based on group prefs         │
         │                                    │
┌────────▼─────────────────┐                  │
│ Co-Create Workspace      │                  │
│ (STATE: Draft/Discussion)│                  │
│ • Propose activities     │                  │
│ • Vote on options        │                  │
│ • Discuss in comments    │                  │
│ • Version control        │                  │
└────────┬─────────────────┘                  │
         │                                    │
         ├─→ [Decision: Keep iterating        │
         │   or Finalize?]                    │
         │                                    │
         │   └─→ Loop back to Co-Create       │
         │                                    │
┌────────▼─────────────────┐                  │
│ Finalized Trip View      │                  │
│ (STATE: Finalized)       │                  │
│ • Lock itinerary         │                  │
│ • Export/Share           │                  │
│ • Pre-trip checklist     │                  │
└────────┬─────────────────┘                  │
         │                                    │
         ├─→ [Trip starts]                    │
         │                                    │
┌────────▼─────────────────┐                  │
│ Active Trip &            │                  │
│ Expense Tracking         │                  │
│ (STATE: In Trip)         │                  │
│ • Real-time updates      │                  │
│ • Log expenses           │                  │
│ • Adjust on-the-fly      │                  │
└────────┬─────────────────┘                  │
         │                                    │
         ├─→ [Trip ends]                      │
         │                                    │
┌────────▼─────────────────┐                  │
│ Trip Summary & Archive   │                  │
│ (STATE: Completed)       │                  │
│ • Expense settlement     │                  │
│ • Photo gallery          │                  │
│ • Export memories        │                  │
└────────┬─────────────────┘                  │
         │                                    │
         └────────────────────────────────────┘
         [Return to Dashboard]
```

---

## 3. STATE PROGRESSION MODEL

```
Draft → In Discussion → Finalized → In Trip → Completed
  ↓          ↓             ↓          ↓          ↓
Initial    Active       Locked     Active     Archived
Setup      Collab       Plan       Travel     Historical
```

### State Definitions & Permissions

| State | Description | Allowed Actions | Who Can Edit |
|-------|-------------|-----------------|--------------|
| **Draft** | Trip created, preferences being gathered | Add members, set dates, configure AI | Creator only |
| **In Discussion** | Collaborative planning active | Propose activities, vote, comment, version | All members |
| **Finalized** | Itinerary locked, ready for travel | View, export, minor edits (with approval) | Admin/Creator |
| **In Trip** | Trip is happening now | Log expenses, check-in activities, real-time updates | All members |
| **Completed** | Trip ended, archival mode | View summary, settle expenses, export data | All members (read-only) |

### State Transitions

- **Draft → In Discussion**: Creator invites first collaborator OR submits preferences for AI draft
- **In Discussion → Finalized**: Group consensus reached (configurable: unanimous, majority, admin approval)
- **Finalized → In Trip**: Trip start date reached OR manually activated
- **In Trip → Completed**: Trip end date reached OR manually marked complete
- **Any State → In Discussion**: "Reopen for editing" (requires admin approval)

---

## 4. KEY ACTIONS PER PAGE

### Page 1: Landing Page
**Purpose**: Communicate value proposition, differentiate from instant-itinerary apps

| Action Type | Action | Triggers |
|-------------|--------|----------|
| **Primary CTA** | Start Planning Together | → Sign up flow → Dashboard |
| **Secondary CTA** | See How It Works | → Demo video/tour modal |
| Tertiary | Sign In | → Authentication → Dashboard |

**Key Messaging**:
- "Plan trips together, not alone"
- "Collaboration BEFORE automation"
- "Everyone has a say, AI does the heavy lifting"

---

### Page 2: Dashboard
**Purpose**: Trip overview hub, starting point for all actions

| Action Type | Action | Triggers |
|-------------|--------|----------|
| **Primary CTA** | Create New Trip | → Trip Creation Wizard |
| **Secondary CTA** | View Trip [per card] | → Navigate to appropriate state view |
| Filter/Sort | Filter by state/date | → Re-render trip list |
| Notification | Pending votes/comments | → Jump to Co-Create Workspace |

**Data Displayed**:
- Active trips (In Discussion, Finalized, In Trip)
- Upcoming trips
- Past trips (Completed)
- Pending invitations
- User stats (trips planned, countries visited)

---

### Page 3: Trip Creation Wizard
**Purpose**: Gather foundational info before collaboration begins

**Step 1: Basic Info**
| Action Type | Action | Triggers |
|-------------|--------|----------|
| **Primary CTA** | Next | → Step 2 |
| Input | Trip name, dates, destination(s) | → Save to `trip` object |

**Step 2: Add Collaborators**
| Action Type | Action | Triggers |
|-------------|--------|----------|
| **Primary CTA** | Next | → Step 3 |
| **Secondary CTA** | Skip (solo trip) | → Step 3 |
| Input | Email invites | → Create `member` objects with pending status |

**Step 3: Set Group Preferences**
| Action Type | Action | Triggers |
|-------------|--------|----------|
| **Primary CTA** | Generate AI Draft | → AI Draft generation → Co-Create Workspace |
| **Secondary CTA** | Skip AI, Start Blank | → Co-Create Workspace (empty state) |
| Input | Budget, pace, interests, dietary needs | → Save to `preference` objects |

---

### Page 4: Co-Create Workspace
**Purpose**: Core collaboration environment (STATE: In Discussion)

| Action Type | Action | Triggers |
|-------------|--------|----------|
| **Primary CTA** | Finalize Itinerary | → Confirmation modal → Finalized Trip View |
| **Secondary CTA** | Propose Activity | → Activity proposal form → Create `activity` (pending vote) |
| Vote | Upvote/Downvote activity | → Update `vote` object → Recalculate consensus |
| Comment | Add discussion thread | → Create comment → Notify members |
| Edit | Modify activity details | → Create new `version` → Track change history |
| AI Assist | "AI, suggest alternatives" | → AI analyzes preferences → Propose new `activity` options |
| Version Control | View/Restore previous version | → Load historical `version` snapshot |

**Layout Zones**:
- **Left Panel**: Day-by-day itinerary builder
- **Center Panel**: Map view with proposed activities
- **Right Panel**: Activity details, voting, comments
- **Top Bar**: Members online, consensus meter, AI suggestions badge

**Data Objects Used**:
- `trip` (metadata, state, dates)
- `member` (permissions, online status)
- `activity` (proposals, location, time, cost)
- `vote` (member_id, activity_id, vote_value)
- `version` (timestamp, author, changes)
- `preference` (filters, constraints)

---

### Page 5: Finalized Trip View
**Purpose**: Locked itinerary, pre-trip preparation (STATE: Finalized)

| Action Type | Action | Triggers |
|-------------|--------|----------|
| **Primary CTA** | Start Trip | → Transition to Active Trip state |
| **Secondary CTA** | Export Itinerary | → Generate PDF/iCal |
| View | Day-by-day schedule | → Read-only view of locked plan |
| Checklist | Pre-trip tasks | → Mark items complete (shared checklist) |
| Emergency Edit | Request reopening | → Notify admin → (if approved) return to Co-Create |

**Read-Only Data**:
- Final itinerary with confirmed `activity` list
- Estimated budget breakdown
- Shared documents (confirmations, reservations)

---

### Page 6: Active Trip & Expense Tracking
**Purpose**: Real-time trip companion (STATE: In Trip)

| Action Type | Action | Triggers |
|-------------|--------|----------|
| **Primary CTA** | Log Expense | → Expense entry form → Create `expense` object |
| **Secondary CTA** | Check-In Activity | → Mark activity complete → Update trip progress |
| Add Expense | Receipt photo, amount, category, split | → Create `expense` → Auto-calculate splits |
| Adjust Plan | "This is closed, find alternative" | → AI suggests backup → Update itinerary |
| Real-Time Update | Location sharing (opt-in) | → Update member location on map |

**Data Objects Used**:
- `expense` (amount, payer, category, split_method, receipt_url)
- `activity` (status: pending/in-progress/completed)
- `member` (location, check-in status)

---

### Page 7: Trip Summary & Archive
**Purpose**: Post-trip closure and memory preservation (STATE: Completed)

| Action Type | Action | Triggers |
|-------------|--------|----------|
| **Primary CTA** | Settle Expenses | → Expense settlement calculator → Generate who-owes-who |
| **Secondary CTA** | Export Memories | → Download photo gallery, itinerary, expenses |
| View | Expense breakdown | → Visual charts, per-person totals |
| Gallery | Upload photos | → Shared trip photo album |
| Feedback | "How was the trip?" | → Rating/review for AI learning |

**Data Objects Used**:
- `expense` (final settlements)
- `activity` (completed activities with ratings)
- `trip` (summary stats: total cost, days, activities)

---

## 5. DATA OBJECTS ACROSS PAGES

### Core Schema

```typescript
// TRIP
{
  id: string
  name: string
  destination: string[]
  start_date: Date
  end_date: Date
  state: 'draft' | 'in_discussion' | 'finalized' | 'in_trip' | 'completed'
  created_by: member_id
  created_at: Date
  consensus_threshold: number // e.g., 0.75 for 75% approval
}

// MEMBER
{
  id: string
  trip_id: string
  user_id: string
  role: 'creator' | 'admin' | 'collaborator'
  status: 'pending' | 'active'
  joined_at: Date
  online_status: boolean
}

// PREFERENCE
{
  id: string
  trip_id: string
  member_id: string // null = group preference
  category: 'budget' | 'pace' | 'interest' | 'dietary' | 'accessibility'
  value: string | number
  priority: 'must_have' | 'nice_to_have' | 'avoid'
}

// ACTIVITY
{
  id: string
  trip_id: string
  proposed_by: member_id
  name: string
  description: string
  location: {lat: number, lng: number, address: string}
  date: Date
  time_start: Time
  time_end: Time
  estimated_cost: number
  status: 'proposed' | 'accepted' | 'rejected' | 'completed'
  votes_for: number
  votes_against: number
}

// VOTE
{
  id: string
  activity_id: string
  member_id: string
  value: 1 | -1 | 0 // upvote, downvote, abstain
  voted_at: Date
}

// EXPENSE
{
  id: string
  trip_id: string
  paid_by: member_id
  amount: number
  currency: string
  category: 'food' | 'transport' | 'accommodation' | 'activity' | 'other'
  description: string
  receipt_url: string
  split_method: 'equal' | 'custom'
  split_details: {member_id: string, amount: number}[]
  created_at: Date
}

// VERSION
{
  id: string
  trip_id: string
  snapshot_data: JSON // full state at this point
  changed_by: member_id
  change_summary: string
  created_at: Date
}
```

### Cross-Page Data Flow

```
Trip Creation Wizard
  ↓ creates
  [trip, member[], preference[]]
  ↓ passes to
Co-Create Workspace
  ↓ creates/modifies
  [activity[], vote[], version[]]
  ↓ locks into
Finalized Trip View
  ↓ reads
  [activity[] (status: accepted)]
  ↓ transitions to
Active Trip
  ↓ creates
  [expense[], activity status updates]
  ↓ archives in
Trip Summary
  ↓ reads
  [All objects in read-only mode]
```

---

## 6. KEY PRODUCT LOGIC

### Collaboration-First Principles

1. **AI is a Participant, Not a Dictator**
   - AI suggestions are treated as proposals (same as human)
   - All AI activities require group voting
   - AI learns from group preferences, not vice versa

2. **Consensus Mechanisms**
   - Configurable thresholds (unanimous, majority, weighted by trip role)
   - "Veto" flag for must-have/deal-breaker preferences
   - Auto-acceptance after X days if quorum not reached

3. **Version Control**
   - Every significant change creates a `version` snapshot
   - Members can propose "forks" and merge back
   - Diff view shows what changed between versions

4. **State Transition Guards**
   - Draft → Discussion: Requires ≥1 collaborator OR AI draft
   - Discussion → Finalized: Requires consensus threshold met
   - Cannot skip states (no Draft → Finalized direct)

---

## 7. CRITICAL DECISION POINTS

### Decision Point 1: Use AI Draft or Start Blank?
**Location**: Trip Creation Wizard (Step 3)
**Impact**: 
- AI Draft → Pre-populated activities to vote on (faster start)
- Start Blank → Empty canvas (more creative control)

### Decision Point 2: Finalize Now or Keep Iterating?
**Location**: Co-Create Workspace
**Criteria**:
- All must-have activities accepted?
- Consensus threshold reached?
- Budget constraints met?
- Date conflicts resolved?

### Decision Point 3: Reopen Finalized Plan?
**Location**: Finalized Trip View
**Guards**:
- Requires admin approval
- Notifies all members
- Creates audit log entry
- Returns to In Discussion state

---

## 8. PAGE TRANSITION MATRIX

| From → To | Trigger | Data Carried |
|-----------|---------|--------------|
| Landing → Dashboard | Login/Signup | User session |
| Dashboard → Trip Wizard | "Create New Trip" | User preferences (if saved) |
| Trip Wizard → Co-Create | Wizard completion | `trip`, `member[]`, `preference[]` |
| Co-Create → Finalized | "Finalize" + consensus | Locked `activity[]` |
| Finalized → Active Trip | Start date OR manual | Full trip data |
| Active Trip → Summary | End date OR manual | `expense[]`, activity completions |
| Summary → Dashboard | "Back to trips" | None |
| Dashboard → Any trip page | Click trip card | Trip ID → load appropriate state view |

---

## NEXT STEPS (Implementation Phases)

**Phase 1**: Landing + Dashboard + Trip Wizard (authentication, basic CRUD)
**Phase 2**: Co-Create Workspace (real-time collaboration, voting)
**Phase 3**: AI Integration (preference analysis, activity suggestions)
**Phase 4**: Finalized + Active Trip (state transitions, expense tracking)
**Phase 5**: Trip Summary (settlements, export, archival)

---

**Last Updated**: 2026-04-12
**Document Version**: 1.0
**Status**: Ready for UI wireframing
