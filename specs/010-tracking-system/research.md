# Research: Real-Time Tracking System

## Overview

Research findings consolidating codebase analysis, architectural decisions, and technology choices for the Real-Time Tracking System feature (Feature 7).

---

## Decision 1: Map Library

**Decision**: Use `leaflet` + `react-leaflet` with OpenStreetMap tiles

**Rationale**:
- Free and open-source (no API key required for basic usage), matching the project's current zero-cost dependency profile
- `react-leaflet` provides declarative React components that integrate cleanly with Next.js
- Lightweight (~40KB gzipped) — the project currently has no map dependency, so Leaflet adds minimal bloat
- Works offline-capable with cached tiles
- RTL/Arabic support through Leaflet's built-in coordinate system (maps are inherently direction-agnostic)

**Alternatives Considered**:
- **Google Maps API**: Requires API key, paid beyond $200/month free tier, heavier bundle, problematic with SSR
- **Mapbox GL JS**: Excellent rendering but requires API token, heavier licensing overhead for commercial use
- **Azure Maps / Here Maps**: Overkill for a provider-location-pin use case

**Next.js SSR Handling**: Leaflet requires `window` object. Must use dynamic import with `ssr: false`:
```ts
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false })
```

---

## Decision 2: WebSocket Message Handling

**Decision**: Implement typed message parsing in `useTracking.ts` `onmessage` handler to process `LOCATION_UPDATE`, `STATUS_CHANGE`, and `ETA_UPDATE` events from the backend WebSocket gateway

**Rationale**:
- The WebSocket infrastructure already exists (connection, auth, reconnect) but `onmessage` is an empty arrow function
- Backend sends structured JSON messages per the tracking API contract
- Messages must update local state (coordinates, ETA, status) which TanStack Query cache invalidation will then propagate to subscribed components

**Message Processing Design**:
```
onmessage → JSON.parse → discriminant on `type` field:
  - LOCATION_UPDATE → update session.providerLatitude/Longitude + lastUpdated
  - STATUS_CHANGE → update session.status + booking status reflection
  - ETA_UPDATE → update session.eta
  - ERROR → surface error to user via toast
```

**Reconnection**: Already implemented (5-second retry). No changes needed.

---

## Decision 3: Notification Type Extension

**Decision**: Add tracking-specific notification types to the existing `CustomerNotificationType` union

**Rationale**:
- Feature spec requires notifications for: provider started route, provider arrived, tracking paused, tracking resumed, job completed
- The existing notification system has booking-centric types but no tracking-specific ones
- Types must be added in both `src/features/notifications/types/index.ts` and the notification-card icon/color mapping

**New Types**:
```ts
'TRACKING_STARTED' | 'TRACKING_PAUSED' | 'TRACKING_RESUMED' | 'TRACKING_ARRIVED'
```

**Navigation**: All tracking notifications link to `/client/tracking/[bookingId]` instead of `/client/jobs/[bookingId]`

---

## Decision 4: Tracking Endpoints in Service Layer

**Decision**: Add `getTrackingSession(id)` and `getTrackingEvents(id, since?)` methods to `bookingApi` in `src/features/bookings/services/api.ts`

**Rationale**:
- Currently, tracking API calls use direct `api.get()` in `useTracking.ts`, violating the API-First principle (Principle I)
- Moving to the service layer ensures typed request/response via Zod schemas
- Consistent with existing pattern (`getBookingTimeline`, `getJobById`, etc.)

---

## Decision 5: Environment Configuration

**Decision**: Add `NEXT_PUBLIC_WS_URL` to `.env.local` with a sensible default

**Rationale**:
- Currently defaults to `wss://api.example.com/ws` (placeholder)
- Must be configured to the actual backend WebSocket URL
- The `.env.local` already has `NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1` — WebSocket URL follows the same host pattern: `ws://localhost:3001/ws`

---

## Decision 6: Provider-Side Tracking UI

**Decision**: No dedicated provider tracking page; providers interact with tracking implicitly through the status update flow (StatusUpdateSelect → backend creates/updates tracking session)

**Rationale**:
- Provider location updates are handled client-side via browser Geolocation API or mobile app integration (backend concern)
- The frontend tracking hook is customer-facing (read-only consumer of tracking data)
- Provider action components already handle status transitions (ACCEPTED → ON_THE_WAY → IN_PROGRESS → COMPLETED)

---

## Decision 7: Tracking History Page Structure

**Decision**: Add a new tracking history page at `src/app/[locale]/client/tracking/history/page.tsx` that reuses the existing pagination and filter patterns from the customer jobs list

**Rationale**:
- Feature spec requires a historical view of past tracking sessions
- Backend provides paginated tracking history via existing job list endpoints (tracking data embedded in completed bookings)
- Reuses `BookingCard` and `BookingPagination` patterns

---

## Decision 8: WebSocket Gateway Integration

**Decision**: Use native browser `WebSocket` API (no socket.io, no reconnecting-websocket library)

**Rationale**:
- The existing `useTracking.ts` already uses native WebSocket with manual reconnect logic
- Backend tracking gateway uses raw WebSocket (not Socket.IO) per the tracking API contract
- Adding a library wrapper provides no benefit over the current 50-line implementation
- Reconnection logic (5s timeout) is already implemented and functional

---

## Decision 9: Tracking Feature Module

**Decision**: Keep tracking code primarily under `src/features/bookings/` but extract shared map component to `src/components/map/TrackingMapView.tsx`

**Rationale**:
- Tracking is conceptually a sub-domain of the booking lifecycle
- Moving everything to `src/features/tracking/` would require restructuring 6+ existing files that reference tracking
- The map component is the only truly reusable piece (could be used on dashboard, booking detail, tracking page)
- A lightweight `src/features/tracking/` module can house shared tracking types and utilities

---

## Decision 10: Backend Status Enum Alignment

**Decision**: The frontend `TrackingSession.status` enum currently has `ACTIVE | PAUSED | COMPLETED | NOT_STARTED`. The feature spec mentions `Pending, Active, Paused, Completed, Cancelled`. Keep the existing 4-value enum.

**Rationale**:
- The backend tracking API contract (from 009 contracts) specifies `ACTIVE | PAUSED | COMPLETED | NOT_STARTED`
- The backend is the single source of truth per Principle I
- The spec's mention of "Pending" and "Cancelled" refers to booking-level statuses, not tracking session statuses
- `NOT_STARTED` serves the same role as "Pending" for tracking sessions
- A cancelled booking simply has no active tracking session (or it gets auto-completed)

---

## Dependency Impact Summary

| Dependency | Currently Used? | Change |
|------------|----------------|--------|
| `leaflet` | No | **ADD** — for map rendering |
| `react-leaflet` | No | **ADD** — React bindings for Leaflet |
| `@types/leaflet` | No | **ADD** — TypeScript types |
| Native `WebSocket` | Yes (in useTracking.ts) | **UPDATE** — implement onmessage handler |
| `@tanstack/react-query` | Yes | **UPDATE** — add tracking query keys |
| `zustand` | Yes | No change |
| `socket.io-client` | No | Not needed (native WebSocket sufficient) |
| `reconnecting-websocket` | No | Not needed (manual reconnect works) |

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Leaflet SSR incompatibility with Next.js | High | Low | Use `dynamic(() => import(...), { ssr: false })` |
| Backend tracking API not deployed | Medium | High | Feature can be tested against stub/mock backend during development |
| WebSocket host differs from API host | Medium | Medium | Make WS URL configurable via `NEXT_PUBLIC_WS_URL` |
| RTL map label rendering | Low | Low | Leaflet renders tiles from OpenStreetMap which are direction-agnostic |
