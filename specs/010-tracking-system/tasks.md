---

description: "Task list for Real-Time Tracking System implementation"
---

# Tasks: Real-Time Tracking System

**Input**: Design documents from `/specs/010-tracking-system/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Features**: `src/features/bookings/`, `src/features/notifications/`
  - `components/`, `hooks/`, `services/`, `types/`, `schemas/`
- **Routes**: `src/app/[locale]/`
- **Shared UI**: `src/components/map/`, `src/components/ui/`
- **State/Hooks**: `src/stores/`, `src/hooks/`
- **Lib/Utils**: `src/lib/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Feature initialization — install map dependencies, create new directories

- [ ] T001 Install leaflet and react-leaflet npm packages in package.json
- [ ] T002 [P] Create directory `src/components/map/` for shared map components
- [ ] T003 [P] Create directory `src/app/[locale]/client/tracking/history/` for tracking history page route

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic and API integration that MUST be complete before ANY UI work. These tasks enable all user stories.

- [ ] T004 Add `getTrackingSession` and `getTrackingEvents` API methods to `src/features/bookings/services/api.ts`
- [ ] T005 [P] Add Zod schema for tracking session validation in `src/features/bookings/schemas/validation.ts`
- [ ] T006 [P] Implement WebSocket `onmessage` handler in `src/features/bookings/hooks/useTracking.ts` to process `LOCATION_UPDATE`, `STATUS_CHANGE`, `ETA_UPDATE`, and `ERROR` messages
- [ ] T007 [P] Add `NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws` to `.env.local`

**Checkpoint**: Foundation ready — tracking API connected, WebSocket messages flowing. UI implementation can now begin in parallel.

---

## Phase 3: User Story 1 — Customer Views Live Provider Tracking (Priority: P1) 🎯 MVP

**Goal**: Customers can see provider location, destination, ETA, and tracking status on a live map.

**Independent Test**: Create a booking, start tracking session, and verify customer can see provider marker, destination marker, ETA, status badge, and last-updated timestamp on a real map without page refresh.

### Implementation for User Story 1

- [ ] T008 [P] [US1] Create `TrackingMapView` reusable map component at `src/components/map/TrackingMapView.tsx` with Leaflet/OpenStreetMap, dynamic SSR import, provider marker, destination marker, route polyline, status banner, ETA display, and last-updated timestamp
- [ ] T009 [P] [US1] Replace Google Maps deep-link placeholder in `src/features/bookings/components/TrackingMap.tsx` with real `TrackingMapView`, preserving existing prop interface
- [ ] T010 [US1] Update tracking page `src/app/[locale]/client/tracking/[id]/page.tsx` to render real Leaflet map via `TrackingMap` with booking coordinates as destination
- [ ] T011 [US1] Add provider offline/online state display to `src/features/bookings/components/BookingTracking.tsx` based on WebSocket connection status and lastUpdated recency

**Checkpoint**: At this point, User Story 1 should be fully functional — customer sees live tracking on a real map.

---

## Phase 4: User Story 2 — Provider Updates Location During Job (Priority: P1)

**Goal**: Provider location is transmitted in real-time; WebSocket reconnection works automatically.

**Independent Test**: Start tracking session as provider, simulate location updates, and verify coordinates are received and reflected on customer's map. Disconnect and verify automatic reconnection within 30 seconds.

### Implementation for User Story 2

- [ ] T012 [P] [US2] Add WebSocket connection status indicator (Live/Polling/Disconnected) to `src/features/bookings/components/BookingTracking.tsx` with visual states
- [ ] T013 [US2] Improve WebSocket reconnection resilience in `src/features/bookings/hooks/useTracking.ts` — add exponential backoff (5s → 10s → 20s, max 30s) and max retry limit
- [ ] T014 [US2] Display last known provider location in `src/features/bookings/components/TrackingMap.tsx` when provider is offline or connection is lost, per FR-012

**Checkpoint**: Provider location updates flow through WebSocket; reconnection is automatic; offline state shows last known location.

---

## Phase 5: User Story 3 — Customer and Provider Manage Tracking Session Lifecycle (Priority: P2)

**Goal**: Users see full session lifecycle — status, start/pause/resume/complete times, duration, and chronological timeline.

**Independent Test**: Observe a tracking session through lifecycle states (NOT_STARTED → ACTIVE → PAUSED → ACTIVE → COMPLETED) and verify UI reflects correct status, timestamps, and duration.

### Implementation for User Story 3

- [ ] T015 [P] [US3] Create `TrackingTimeline` component at `src/features/bookings/components/TrackingTimeline.tsx` displaying chronological tracking events (status changes, location updates, pause/resume, completion) with timestamps
- [ ] T016 [US3] Add session duration display to `src/features/bookings/components/BookingTracking.tsx` calculated from `startedAt` to current time (or `endedAt` if completed)
- [ ] T017 [US3] Add pause and resume event display in `BookingTracking.tsx` timeline section with visual indicators

**Checkpoint**: Users see complete session lifecycle with timeline, duration, and event history.

---

## Phase 6: User Story 5 — User Receives Real-Time Tracking Notifications (Priority: P2)

**Goal**: Notifications are triggered and displayed for tracking events (started route, paused, resumed, arrived).

**Independent Test**: Trigger each tracking event and verify the corresponding notification is delivered with correct content and navigates to the tracking page on click.

### Implementation for User Story 5

- [ ] T018 [P] [US5] Add tracking notification types (`TRACKING_STARTED`, `TRACKING_PAUSED`, `TRACKING_RESUMED`, `TRACKING_ARRIVED`) to `CustomerNotificationType` union in `src/features/notifications/types/index.ts`
- [ ] T019 [P] [US5] Update booking notification filter list in `src/features/notifications/hooks/useBookingNotifications.ts` to include tracking notification types
- [ ] T020 [US5] Add tracking notification navigation logic in `src/features/notifications/hooks/useBookingNotifications.ts` — tracking types link to `/client/tracking/:bookingId`, booking types link to `/client/jobs/:bookingId`
- [ ] T021 [US5] Add tracking notification icon/color mapping in notification components (map `TRACKING_STARTED`→ Navigation icon, `TRACKING_PAUSED` → PauseCircle, `TRACKING_RESUMED` → PlayCircle, `TRACKING_ARRIVED` → MapPin)

**Checkpoint**: Tracking notifications are delivered with correct content, icons, and navigation links.

---

## Phase 7: User Story 4 — Customer Reviews Past Tracking History (Priority: P3)

**Goal**: Customers can view paginated, filterable tracking history with session detail view.

**Independent Test**: Complete multiple tracking sessions, navigate to history page, verify paginated list with filters and session detail expandable view.

### Implementation for User Story 4

- [ ] T022 [P] [US4] Create tracking history page at `src/app/[locale]/client/tracking/history/page.tsx` with paginated list of past tracking sessions
- [ ] T023 [US4] Implement session detail expandable view showing status changes, duration, start/end times, and route summary if available
- [ ] T024 [US4] Add filtering (by date range, status) to the tracking history page, reusing `BookingFilters` patterns

**Checkpoint**: Tracking history page is fully functional with pagination, filtering, and session details.

---

## Phase 8: Integration & Cleanup (Cross-Cutting)

**Purpose**: Wire tracking into existing pages, update provider views, remove mock data.

- [ ] T025 [P] Update booking detail page `src/app/[locale]/client/jobs/[id]/page.tsx` to show tracking status badge and live map embed when status is `ON_THE_WAY` or `IN_PROGRESS`
- [ ] T026 [P] Update `ActiveBookingCard` in `src/features/bookings/components/ActiveBookingCard.tsx` to show live ETA and tracking availability using real backend data (remove mock `tracking` fallback)
- [ ] T027 Update provider job management page `src/app/[locale]/technician/jobs/page.tsx` to display tracking status badge for assigned jobs with active tracking sessions
- [ ] T028 Audit and remove all mock/fallback tracking data across `src/features/bookings/`, `src/app/[locale]/client/`, and `src/app/[locale]/technician/` — replace with conditional rendering for empty/loading states
- [ ] T029 [P] Add loading skeleton and error state with retry to `TrackingMapView` component at `src/components/map/TrackingMapView.tsx`
- [ ] T030 [P] Verify `npm run lint` and `npm run type-check` pass with all tracking changes

**Checkpoint**: All tracking features integrated across booking detail, dashboard, provider pages. No mock tracking data remains.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **US1 — Live Map (Phase 3)**: Depends on Phase 2 — must have WebSocket handling and API service
- **US2 — Location Updates (Phase 4)**: Depends on Phase 2 — relies on WebSocket onmessage from Phase 2
- **US3 — Session Lifecycle (Phase 5)**: Depends on Phase 2 — uses tracking session data
- **US5 — Notifications (Phase 6)**: Depends on Phase 2 — needs backend tracking events
- **US4 — History (Phase 7)**: Depends on Phase 2 — needs backend tracking history data
- **Integration (Phase 8)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational — no strict dependency on US1 but shares WebSocket connection
- **User Story 3 (P2)**: Can start after Foundational — timeline component is standalone
- **User Story 5 (P2)**: Can start after Foundational — notification types are independent
- **User Story 4 (P3)**: Can start after Foundational — history page is standalone

### Within Each User Story

- Phase 1 tasks first (Setup)
- Phase 2 tasks second (Foundational)
- Within each story: core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Phase 1 tasks marked [P] can run in parallel
- All Phase 2 tasks marked [P] can run in parallel
- All user story phases (3-7) can start in parallel after Phase 2 completes
- Within each user story, tasks marked [P] can run in parallel
- Different user stories in different phases can be worked on simultaneously

---

## Parallel Example: User Story 1

```bash
# Launch all US1 tasks together:
Task: "Create TrackingMapView component in src/components/map/TrackingMapView.tsx"
Task: "Update TrackingMap in src/features/bookings/components/TrackingMap.tsx"
Task: "Update tracking page in src/app/[locale]/client/tracking/[id]/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2 — both are P1)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (Live Map MVP)
4. Complete Phase 4: User Story 2 (Location Updates)
5. **STOP and VALIDATE**: Both P1 stories work — live tracking map updates in real-time
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 (Live Map) + US2 (Location Updates) → Test independently → Deploy/Demo (MVP!)
3. US3 (Session Lifecycle) → Test independently → Deploy
4. US5 (Notifications) → Test independently → Deploy
5. US4 (History) → Test independently → Deploy
6. Integration & Cleanup → Final polish

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 + US3 (live map + session — map + timeline)
   - Developer B: US2 + US4 (location + history — WebSocket + history page)
   - Developer C: US5 (notifications)
3. Developer A and B pair-merge on shared components (TrackingMap, BookingTracking)
4. All stories complete and integrate independently in Phase 8

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No tests requested in spec — test tasks not generated
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
