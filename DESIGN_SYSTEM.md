# HelloWorld Design System

**Fresh, airy, premium travel platform with ocean-inspired calm and collaborative energy**

---

## Overview

The HelloWorld design system provides a comprehensive set of design tokens and reusable components for building a modern AI-powered collaborative travel planning SaaS platform.

### Visual Principles

- **Ocean Blue Primary**: Calming ocean-inspired blue (#0A7EA4) as the primary accent
- **Cool Gray Neutrals**: Clean, professional gray scale with subtle cool undertones
- **Card-Based Layout**: Elevated containers with strong hierarchy
- **Subtle Gradients**: Soft gradient accents for premium feel
- **Rounded Corners**: Consistent border radius (8px-24px range)
- **Generous Spacing**: Airy layouts with clear breathing room

---

## Color System

### Primary (Ocean Blue)
The primary color evokes calm ocean waters and trust.

```css
--primary-50: #EBF8FC    /* Lightest - backgrounds */
--primary-100: #D4F1F8   /* Light - subtle accents */
--primary-200: #A9E3F1   /* Medium light */
--primary-300: #7DD5EA   /* Medium */
--primary-400: #52C7E3   /* Medium dark */
--primary-500: #0A7EA4   /* Base - primary actions */
--primary-600: #086B8C   /* Dark - hover states */
--primary-700: #065974   /* Darker */
--primary-800: #04465C   /* Very dark */
--primary-900: #023344   /* Darkest */
```

**Usage:**
- Primary buttons, links, and CTAs
- Active states and selections
- Brand elements
- Focus rings and highlights

### Neutrals (Cool Gray)
Professional gray scale with subtle cool undertones.

```css
--neutral-50: #F8F9FB    /* Backgrounds */
--neutral-100: #F1F3F6   /* Subtle backgrounds */
--neutral-200: #E4E7ED   /* Borders */
--neutral-300: #D1D6DD   /* Dividers */
--neutral-400: #9BA3B0   /* Placeholder text */
--neutral-500: #6B7280   /* Secondary text */
--neutral-600: #4B5563   /* Body text */
--neutral-700: #374151   /* Headings */
--neutral-800: #1F2937   /* Strong emphasis */
--neutral-900: #1A1F2E   /* Primary text */
```

**Usage:**
- Text hierarchy
- Borders and dividers
- Backgrounds and surfaces
- Disabled states

### Semantic Colors

**Success (Fresh Green)**
```css
--success-50: #ECFDF5
--success-100: #D1FAE5
--success-500: #10B981   /* Base */
```
Use for: Confirmations, completed states, positive feedback

**Warning (Amber)**
```css
--warning-50: #FFFBEB
--warning-100: #FEF3C7
--warning-500: #F59E0B   /* Base */
```
Use for: Cautions, approaching limits, important notices

**Danger (Vibrant Red)**
```css
--danger-50: #FEF2F2
--danger-100: #FEE2E2
--danger-500: #EF4444    /* Base */
```
Use for: Errors, destructive actions, critical alerts

**Info (Sky Blue)**
```css
--info-50: #EFF6FF
--info-100: #DBEAFE
--info-500: #3B82F6     /* Base */
```
Use for: Informational messages, tips, neutral notifications

### AI Accent (Purple to Pink Gradient)
Special gradient reserved for AI-powered features.

```css
--ai-primary: #8B5CF6
--ai-secondary: #EC4899
--ai-gradient: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)
```

**Usage:**
- AI suggestion chips
- AI action panels
- AI-generated content indicators
- Machine learning features

---

## Typography

### Scale

```css
Display: text-5xl (48px) / font-bold
H1:      text-2xl (24px) / font-medium
H2:      text-xl (20px) / font-medium
H3:      text-lg (18px) / font-medium
H4:      text-base (16px) / font-medium
Body:    text-base (16px) / font-normal
Caption: text-sm (14px) / font-normal
```

### Font Weights

```css
--font-weight-bold: 700      /* Display headings only */
--font-weight-semibold: 600  /* Reserved for special emphasis */
--font-weight-medium: 500    /* Headings, labels, buttons */
--font-weight-normal: 400    /* Body text, inputs */
```

### Usage Guidelines

- **Display**: Hero sections, page titles (text-5xl, font-bold)
- **H1**: Major section headers (text-2xl, font-medium)
- **H2**: Sub-sections (text-xl, font-medium)
- **H3**: Card titles, panel headers (text-lg, font-medium)
- **H4**: Small headers (text-base, font-medium)
- **Body**: Paragraphs, descriptions (text-base, font-normal)
- **Caption**: Helper text, metadata (text-sm, font-normal)

---

## Spacing

Consistent spacing scale based on 4px increments:

```css
--space-1:  0.25rem   /* 4px */
--space-2:  0.5rem    /* 8px */
--space-3:  0.75rem   /* 12px */
--space-4:  1rem      /* 16px - base unit */
--space-5:  1.25rem   /* 20px */
--space-6:  1.5rem    /* 24px */
--space-8:  2rem      /* 32px */
--space-10: 2.5rem    /* 40px */
--space-12: 3rem      /* 48px */
--space-16: 4rem      /* 64px */
--space-20: 5rem      /* 80px */
```

**Common Patterns:**
- Component padding: `space-4` to `space-6`
- Section gaps: `space-8` to `space-12`
- Page margins: `space-12` to `space-20`
- Icon-text gap: `space-2` to `space-3`

---

## Border Radius

Consistent rounded corners throughout:

```css
--radius-sm:   0.5rem   /* 8px - small elements */
--radius-md:   0.75rem  /* 12px - default */
--radius-lg:   1rem     /* 16px - cards */
--radius-xl:   1.5rem   /* 24px - large surfaces */
--radius-full: 9999px   /* Fully rounded (pills, avatars) */
```

**Usage:**
- Buttons, chips: `radius-md` to `radius-lg`
- Cards, panels: `radius-lg` to `radius-xl`
- Inputs: `radius-md`
- Avatars, badges: `radius-full`

---

## Shadows

Layered depth system for elevation:

```css
--shadow-sm:    0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md:    0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg:    0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl:    0 20px 25px -5px rgba(0, 0, 0, 0.1)
--shadow-card:  0 1px 3px 0 rgba(0, 0, 0, 0.06)
--shadow-ocean: 0 8px 16px -4px rgba(10, 126, 164, 0.15)
```

**Usage:**
- Default cards: `shadow-card`
- Hover states: `shadow-md`
- Modals, drawers: `shadow-lg`
- Featured cards: `shadow-ocean` (ocean blue tint)

---

## Components

### Buttons

**Variants:**
- **Primary**: Ocean blue, high emphasis actions
- **Secondary**: Light gray, medium emphasis actions  
- **Ghost**: Transparent, low emphasis actions
- **Destructive**: Red, dangerous/delete actions

**States:**
- Default
- Hover (darker shade)
- Active (pressed)
- Disabled (50% opacity)
- Focus (ring)

**Example:**
```tsx
<button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-sm">
  Create Trip
</button>
```

### Input Fields

**States:**
- Default (neutral border, light background)
- Focus (primary ring, transparent background)
- Error (danger border, danger background)
- Filled (white background)
- Disabled (muted, not editable)

**Example:**
```tsx
<input
  type="text"
  placeholder="Enter trip name..."
  className="w-full px-4 py-3 rounded-lg border border-neutral-200 bg-input-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
/>
```

### Cards

Standard elevated container with hover effects.

**Example:**
```tsx
<div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-card hover:shadow-md transition-shadow">
  {/* Card content */}
</div>
```

**Variants:**
- Standard white card
- Gradient accent card (primary-50 to primary-100)
- Dashed border (create new state)

### Status Chips

**Trip States:**
- Draft (gray)
- In Discussion (ocean blue)
- Finalized (green)
- In Trip (sky blue)
- Completed (gray)

**Activity States:**
- Proposed (amber)
- Accepted (green)
- Rejected (red)
- Completed (ocean blue)

**Example:**
```tsx
import { StatusChip } from "./components/helloworld/StatusChip";

<StatusChip status="in_discussion" />
```

### Vote Controls

Interactive voting interface with consensus visualization.

**Features:**
- Thumbs up/down buttons
- Vote counts
- Consensus percentage bar
- User vote highlighting

**Example:**
```tsx
import { VoteControl } from "./components/helloworld/VoteControl";

<VoteControl
  voteFor={12}
  voteAgainst={3}
  userVote={1}
  onVote={(value) => handleVote(value)}
/>
```

### Timeline Items

Vertical timeline for activity history and version control.

**Variants:**
- default (ocean blue)
- ai (purple gradient)
- success (green)
- warning (amber)

**Example:**
```tsx
import { TimelineItem } from "./components/helloworld/TimelineItem";

<TimelineItem
  icon={Sparkles}
  title="AI suggested 5 new activities"
  description="Based on your group preferences"
  time="2 minutes ago"
  variant="ai"
/>
```

### Budget Progress

Visual budget tracker with threshold alerts.

**Features:**
- Current vs. budget comparison
- Percentage bar with gradient
- Remaining/over budget indicator
- Automatic warnings (85%+)
- Error state (100%+)

**Example:**
```tsx
import { BudgetProgress } from "./components/helloworld/BudgetProgress";

<BudgetProgress 
  current={2400} 
  budget={5000} 
  currency="USD" 
/>
```

### Alert Banners

Contextual notifications and conflict indicators.

**Variants:**
- info (sky blue)
- success (green)
- warning (amber)
- danger (red)
- conflict (gradient amber to red)

**Example:**
```tsx
import { AlertBanner } from "./components/helloworld/AlertBanner";

<AlertBanner
  variant="warning"
  title="Approaching budget limit"
  description="You've used 87% of your budget"
  action={{ label: "Review budget", onClick: () => {} }}
  onDismiss={() => {}}
/>
```

### AI Suggestion Chip

AI-generated suggestion indicator with accept/reject actions.

**Variants:**
- compact (small badge)
- default (full card with actions)

**Example:**
```tsx
import { AISuggestionChip } from "./components/helloworld/AISuggestionChip";

<AISuggestionChip
  title="Add rest time between activities"
  description="Consider adding 30-minute breaks"
  onAccept={() => {}}
  onReject={() => {}}
/>
```

### AI Action Panel

Interactive AI prompt interface.

**Features:**
- Text input area
- Quick suggestion buttons
- Loading state
- Send action

**Example:**
```tsx
import { AIActionPanel } from "./components/helloworld/AIActionPanel";

<AIActionPanel
  onSubmit={(prompt) => handleAI(prompt)}
  suggestions={[
    "Find vegetarian restaurants",
    "Suggest rainy day activities"
  ]}
/>
```

### Diff Card

Before/after comparison for proposed changes.

**Features:**
- Side-by-side comparison
- Visual distinction (before: gray, after: ocean blue)
- Accept/reject actions
- Arrow indicator

**Example:**
```tsx
import { DiffCard } from "./components/helloworld/DiffCard";

<DiffCard
  before={{
    title: "Original Schedule",
    content: "..."
  }}
  after={{
    title: "AI Optimized Route",
    content: "..."
  }}
  onAccept={() => {}}
  onReject={() => {}}
/>
```

---

## Usage

### Installation

All components are located in `/src/app/components/helloworld/`:

```tsx
// Import individual components
import { VoteControl } from "./components/helloworld/VoteControl";
import { StatusChip } from "./components/helloworld/StatusChip";
import { BudgetProgress } from "./components/helloworld/BudgetProgress";

// Or import from index
import { 
  VoteControl, 
  StatusChip, 
  BudgetProgress 
} from "./components/helloworld";
```

### Design Tokens

All design tokens are defined in `/src/styles/theme.css` and available as CSS variables:

```css
/* Colors */
background-color: var(--primary-500);
color: var(--neutral-900);

/* Spacing */
padding: var(--space-4);
gap: var(--space-6);

/* Radius */
border-radius: var(--radius-lg);

/* Shadows */
box-shadow: var(--shadow-card);
```

### Tailwind Integration

Tokens are mapped to Tailwind classes via `@theme inline` in theme.css:

```tsx
// Use Tailwind classes directly
<div className="bg-primary text-primary-foreground rounded-lg p-6">
  ...
</div>
```

---

## Accessibility

### Color Contrast

All color combinations meet WCAG AA standards:
- Primary-500 on white: 4.5:1+
- Neutral-900 on white: 16:1+
- Semantic colors meet minimum contrast requirements

### Focus States

All interactive elements include visible focus rings:
```css
focus:outline-none focus:ring-2 focus:ring-primary
```

### Semantic HTML

- Use proper heading hierarchy (h1 → h2 → h3)
- Include ARIA labels where needed
- Ensure keyboard navigation support

---

## Best Practices

### Card Usage

- Use cards for grouping related content
- Maintain consistent padding (p-6 to p-8)
- Add hover states for interactive cards
- Use subtle shadows, not thick borders

### Typography

- Maintain clear hierarchy (one h1 per page)
- Use font-medium for headings, font-normal for body
- Keep line length readable (max-w-2xl for prose)
- Use text-neutral-600 for secondary text

### Spacing

- Use consistent spacing scale
- Prefer gap utilities over margin for flex/grid
- Add generous whitespace around sections (space-12+)
- Maintain rhythm with consistent spacing

### AI Features

- Always use purple-pink gradient for AI indicators
- Include Sparkles icon for AI-generated content
- Provide clear accept/reject actions for suggestions
- Show loading states during AI processing

---

## Examples

### Trip Card
```tsx
<div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-card hover:shadow-md transition-shadow">
  <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
    <MapPin className="w-6 h-6 text-primary-600" />
  </div>
  <h3 className="font-semibold text-neutral-900 mb-2">Tokyo, Japan</h3>
  <p className="text-sm text-neutral-600">7 days • 4 travelers</p>
  <div className="mt-4 pt-4 border-t border-neutral-200">
    <StatusChip status="in_discussion" />
  </div>
</div>
```

### Activity Proposal
```tsx
<div className="bg-white rounded-xl p-6 border border-neutral-200">
  <h3 className="font-semibold text-neutral-900 mb-4">Tokyo Tower Visit</h3>
  <p className="text-sm text-neutral-600 mb-4">
    Panoramic views of Tokyo from 150m observation deck
  </p>
  
  <VoteControl
    voteFor={8}
    voteAgainst={2}
    userVote={1}
    onVote={handleVote}
  />
  
  <div className="mt-4 pt-4 border-t border-neutral-200">
    <ActivityStatusChip status="proposed" />
  </div>
</div>
```

---

## Version

**Design System Version:** 1.0  
**Last Updated:** April 12, 2026  
**Status:** Production Ready

---

## Support

For questions or contributions, refer to the component source files in `/src/app/components/helloworld/`.
