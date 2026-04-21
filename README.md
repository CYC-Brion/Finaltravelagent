# HelloWorld - AI-Powered Collaborative Travel Planning Platform

A modern, full-stack web application for group travel planning that combines AI assistance with collaborative decision-making. Plan trips together, not alone.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg)
![Vite](https://img.shields.io/badge/Vite-6.0-646c4a.svg)

---

## Overview

HelloWorld is a collaborative travel planning platform where groups can:
- **Create trips** with customizable preferences (budget, pace, interests)
- **AI generates** initial itineraries based on group preferences
- **Collaborate in real-time** with voting, comments, and proposals
- **Track expenses** with automatic split calculations
- **Share experiences** through the community feed

---

## Features

### Core Pages

| Page | Description |
|------|-------------|
| **Landing** | Marketing page with collaborative trip preview and feature highlights |
| **Dashboard** | Trip management with search, filtering, and activity feed |
| **Trip Wizard** | 3-step onboarding: Basics → Members → Preferences |
| **AI Draft** | AI-generated itinerary with day tabs, budget overview, and team status |
| **Co-Create Workspace** | 3-column collaboration interface with decision queue, itinerary board, and AI panel |
| **AI Assistant** | Focused AI interaction for optimization and suggestions |
| **Expense Tracking** | Split settlement with category views and optimized transactions |
| **Trip Summary** | Post-trip archive with diary, highlights, and reflections |
| **Community** | Browse and share trip experiences |

### Key Capabilities

- **Democratic Decisions**: Vote on every activity, set consensus rules
- **AI as Participant**: AI suggests activities that require group approval
- **Real-time Collaboration**: See updates instantly as your team makes decisions
- **Smart Expense Splitting**: Minimum transaction algorithm for settlement
- **Route Optimization**: AI-powered itinerary optimization

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3 | UI framework |
| TypeScript | 5.0 | Type safety |
| Vite | 6.0 | Build tool |
| Tailwind CSS | 4.1 | Styling |
| TanStack Query | 5.x | Server state |
| React Router | 7.x | Routing |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| NestJS | 11.x | API framework |
| Prisma | 6.x | ORM |
| TypeScript | 5.0 | Type safety |

### External Services

| Service | Purpose |
|---------|---------|
| Azure OpenAI | AI chat and itinerary generation (gpt-5.4) |
| Amap (高德地图) | Weather, POI search, route planning |

---

## Project Structure

```
Finaltravelagent/
├── src/
│   ├── app/
│   │   ├── components/       # React components
│   │   │   ├── helloworld/  # Custom components
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── providers/      # Context providers
│   │   ├── routes/          # React Router routes
│   │   ├── screens/        # Page components
│   │   └── guards/         # Route guards
│   ├── config/             # Environment configuration
│   ├── domain/             # TypeScript types
│   ├── lib/                # Utilities and API client
│   └── styles/             # Global styles
├── backend/
│   └── src/
│       ├── ai/             # AI service (LLM, Amap integration)
│       ├── auth/           # Authentication
│       ├── trips/          # Trip CRUD
│       ├── workspace/      # Collaboration features
│       ├── expenses/      # Expense tracking
│       ├── summary/        # Trip summary
│       └── community/      # Community features
└── dist/                   # Production build
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Azure OpenAI API credentials (optional, for real AI)
- Amap API key (optional, for real map/weather)

### Installation

```bash
# Clone the repository
cd Finaltravelagent

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Running the Application

**Development Mode (Frontend only with mock data):**
```bash
npm run dev
```

**Full Stack (Frontend + Backend):**
```bash
# Terminal 1 - Start backend
cd backend
npm run start:dev

# Terminal 2 - Start frontend
npm run dev
```

**Build for Production:**
```bash
npm run build
```

### Access Points

| Service | URL |
|---------|-----|
| Frontend (Dev) | http://localhost:5173 |
| Backend API | http://localhost:4000 |
| Backend Docs | http://localhost:4000/api |

---

## Environment Configuration

Create a `.env` file in the project root:

```env
# ===================
# Frontend
# ===================
VITE_API_BASE_URL=http://localhost:4000
VITE_USE_MOCK_API=false

# ===================
# Azure OpenAI
# ===================
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT=gpt-5.4
AZURE_OPENAI_API_VERSION=2024-12-01-preview

# ===================
# Amap (高德地图)
# ===================
AMAP_API_KEY=your-amap-key
AMAP_WEATHER_URL=https://restapi.amap.com/v3/weather/weatherInfo
```

### Configuration Details

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_USE_MOCK_API` | No | `true` | Set to `false` to use real backend |
| `VITE_API_BASE_URL` | No | `http://localhost:4000` | Backend API URL |
| `AZURE_OPENAI_*` | No | - | Azure OpenAI credentials for real AI |
| `AMAP_API_KEY` | No | - | Amap credentials for real map/weather |

When API keys are not configured, the application uses fallback/mock data.

---

## API Reference

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/trips` | List all trips |
| `POST` | `/trips` | Create a new trip |
| `GET` | `/trips/:id` | Get trip details |
| `POST` | `/trips/:id/ai-draft/generate` | Generate AI itinerary |
| `POST` | `/ai/chat` | Chat with AI assistant |

### Authentication

Uses simple token-based auth with `Authorization: Bearer <token>` header.

---

## Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#0A7EA4` | Ocean blue - primary actions |
| Success | `#22c55e` | Success states |
| Warning | `#f59e0b` | Warning states |
| Danger | `#ef4444` | Error states |

### Typography

- Display: 48-60px bold
- H1: 24px medium
- H2: 20px medium
- Body: 16px normal
- Caption: 14px normal

### Spacing

- Section gaps: 48-64px
- Card padding: 24-32px
- Component gaps: 16-24px

### Border Radius

- Cards: 12-16px
- Buttons: 8-12px
- Chips: 6-8px or full (pills)

---

## Development

### Adding New Components

```bash
# Use shadcn/ui components
npx shadcn@latest add button

# Or add to helloworld folder manually
touch src/app/components/helloworld/MyComponent.tsx
```

### Type Definitions

All type definitions are in `src/domain/types.ts`. Update this file when modifying data structures.

### API Integration

1. Add API method to `src/lib/api/travelApi.ts`
2. Add React Query hook in `src/app/hooks/useTrips.ts`
3. Use the hook in your component

---

## Deployment

### Frontend (Vercel, Netlify, etc.)

```bash
npm run build
# Upload dist/ folder to hosting
```

Environment variables prefixed with `VITE_` must be set in the hosting platform.

### Backend (Railway, Render, etc.)

```bash
cd backend
npm run build
npm run start
```

---

## License

This project is licensed under the MIT License.

---

## Credits

- **Design**: [Figma Design File](https://www.figma.com/design/2VPFYD84I8TaKm8vHOX3Aa/final-travel-agent)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
