# Implementation Plan: Real-Time Tracking System

**Branch**: `010-tracking-system` | **Date**: 2026-06-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/010-tracking-system/spec.md`

## Summary

Complete the Real-Time Tracking System by integrating the frontend tracking UI with the backend Tracking Module. This includes: live tracking map with provider/customer locations, tracking session lifecycle management (pending/active/paused/completed/cancelled), real-time provider location updates via WebSocket, tracking timeline and history pages, booking-tracking integration, and tracking-triggered notifications. The backend already exposes REST endpoints (`GET /tracking/:bookingId`, `GET /tracking/:bookingId/events`) and WebSocket events (`LOCATION_UPDATE`, `STATUS_CHANGE`, `ETA_UPDATE`) — the frontend must connect to these, implement message handling, add a real map library, and wire tracking events into the notification system.

## Technical Context

**Language/Version**: TypeScript ~5.5, Next.js 14.2.15, React 18.3

**Primary Dependencies**: `@tanstack/react-query` ^5.59 (server state), `axios` ^1.7.7 (HTTP), `zustand` ^5.0 (client state), `zod` ^3.23 (validation), native browser `WebSocket` API (no socket.io), plus a map library to be selected (currently none — `TrackingMap` is a Google Maps deep-link placeholder)

**Storage**: Backend-managed (external API at `http://localhost:3001/api/v1`); no local persistence

**Testing**: `vitest` (unit/integration), `npm run test`, `npm run lint`, `npm run type-check`

**Target Platform**: Web (Next.js 14 App Router — `src/app/[locale]/`)

**Project Type**: Web application — frontend only (backend is external)

**Performance Goals**: Live provider location updates reflected on map within 5 seconds; WebSocket reconnection within 30 seconds of disconnection; tracking history pages load within 3 seconds for up to 100 sessions

**Constraints**: No backend code may be modified; no changes to colors, theme, branding, or visual identity; existing pages must not be redesigned; no mock or fallback tracking data may remain; all tracking data must originate from the backend

**Scale/Scope**: Three portals (Customer, Provider, Admin); tracking affects Customer booking detail page, Customer dashboard active bookings, Customer tracking page, Provider job management, and notifications

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design — PASSED.*

- [x] **I. API-First Architecture**: Each tracking feature maps to existing backend endpoints (`GET /tracking/:bookingId`, `GET /tracking/:bookingId/events`, WebSocket events). Service layer methods (`getTrackingSession`, `getTrackingEvents`) defined in data-model.md. Zod schema for tracking session defined.
- [x] **II. Feature-Based Modularity**: Tracking code remains in `src/features/bookings/` (existing pattern). Shared map component in `src/components/map/TrackingMapView.tsx`. No cross-feature imports.
- [x] **III. Three-Pillar UX**: Customer → tracking map/session/history pages. Provider → status transitions (implicit tracking). Admin → existing booking pages. Each portal route group is correct.
- [x] **IV. Role-Based Access & Security**: All tracking endpoints require Bearer auth with role filter (booking owner or assigned provider). WebSocket auth via JWT token query param.
- [x] **V. Server-State Dominance**: TanStack Query used for REST tracking data. Zustand not involved. Query keys follow `['bookings', 'tracking', bookingId]` pattern.
- [x] **VI. Error & Loading State Discipline**: All tracking components define loading (skeleton), empty (no tracking data), error (retry action), and success states.
- [x] **VII. AI Feature Integrity**: N/A — no AI features are part of this feature.
- [x] **VIII. Universal Accessibility & Responsive Design**: Existing design system preserved. No colors/theme changes. Leaflet maps are RTL-compatible (direction-agnostic tile rendering). All text uses existing i18n patterns.

## Project Structure

### Documentation (this feature)

```text
specs/010-tracking-system/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── tracking-api.md
│   ├── booking-api.md
│   ├── jobs-api.md
│   └── notifications-api.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/[locale]/
│   ├── (customer)/
│   │   ├── jobs/[id]/           # Booking detail + tracking embed (exists)
│   │   ├── tracking/[id]/       # Full tracking page (exists, needs WebSocket fix)
│   │   └── tracking/history/    # NEW: Tracking history page
│   └── (provider)/
│       └── jobs/                 # Provider job management (exists, needs tracking status)
├── features/
│   ├── bookings/                 # Booking + tracking feature module
│   │   ├── types/                # Types (exists, needs tracking type updates)
│   │   ├── schemas/              # Zod schemas (exists)
│   │   ├── services/api.ts       # API service (exists, needs tracking endpoints)
│   │   ├── hooks/
│   │   │   ├── useTracking.ts    # Tracking hook (exists, needs WebSocket onmessage)
│   │   │   └── ... (existing hooks)
│   │   └── components/
│   │       ├── BookingTracking.tsx   # Tracking card (exists)
│   │       ├── TrackingMap.tsx       # Map component (placeholder — needs real map)
│   │       ├── TrackingTimeline.tsx  # NEW: Tracking-specific timeline component
│   │       └── ... (existing components)
│   ├── tracking/                 # NEW: Shared tracking domain
│   │   ├── types/
│   │   ├── hooks/
│   │   └── components/
│   └── notifications/            # Existing notifications feature
│       ├── types/                # Needs tracking notification types added
│       └── hooks/                # Needs tracking notification hooks
├── components/
│   └── map/                      # NEW: Reusable map component
└── lib/
    ├── axios.ts                  # Axios instance (exists)
    └── websocket.ts              # NEW: WebSocket utility
```

**Structure Decision**: Tracking functionality remains primarily in `src/features/bookings/` to match existing architecture, with shared map components in `src/components/map/` and a new `src/features/tracking/` domain for shared tracking logic. Tracking history gets a dedicated page under the customer portal.

## Complexity Tracking

> *No Constitution violations anticipated at this stage — the design follows existing patterns (TanStack Query, axios service layer, feature-based modules, role-aware portals). Complexity tracking will be filled if violations are identified during design.*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
