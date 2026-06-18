# Tasks: Booking Lifecycle Completion

**Feature**: `009-booking-lifecycle-completion` | **Date**: 2026-06-18 | **Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Dependency Graph

```
Phase 2 (Foundational) ─────────────────────────────────────────────────────────┐
  ├── T001: Status enum alignment                                                │
  └── T002–T005: API service consolidation                                       │
                                                                                 │
Phase 3 (US1 - Create Booking) ───── depends on: Phase 2       ◄───────────────┤
  └── T006–T009: Create booking flow via consolidated API                        │
                                                                                 │
Phase 4 (US2 - Booking Details & Timeline) ───── depends on: Phase 2            │
  └── T010–T018: Detail page + timeline components                            ◄─┤
                                                                                 │
Phase 5 (US3 - Cancel Booking) ───── depends on: Phase 4 (detail page)          │
  └── T019–T022: Cancel dialog + hook                                         ◄─┤
                                                                                 │
Phase 6 (US7 - Provider Management) ───── depends on: Phase 2                   │
  └── T023–T028: Provider accept/reject/status/complete                       ◄─┤
                                                                                 │
Phase 7 (US4 - Active Tracking) ───── depends on: Phase 4 (detail page)         │
  └── T029–T034: Tracking components + WebSocket                              ◄─┤
                                                                                 │
Phase 8 (US5 - Booking Notifications) ───── depends on: Phase 4 (bookingId)     │
  └── T035–T038: Notification types + hooks                                   ◄─┤
                                                                                 │
Phase 9 (US6 - Booking History) ───── depends on: Phase 2                       │
  └── T039–T040: History page enhancements                                    ◄─┤
                                                                                 │
Phase 10 (Cross-Cutting) ───── depends on: All phases                           │
  ├── T041–T042: Mock data cleanup                                            ◄─┤
  └── T043: API audit report                                                     │
```

---

## Phase 1: Setup

- [ ] T001 Create feature branch `009-booking-lifecycle-completion` from main

---

## Phase 2: Foundational (Blocking Prerequisites)

### Goal
Align booking status enums across all definitions and consolidate booking/job API calls into the axios-based feature service. These tasks block all user stories.

### Tasks

- [X] T002 [P] Extend `BookingStatus` type in `src/features/bookings/types/index.ts` to include `ASSIGNED` and `ON_THE_WAY` (final: `PENDING | ACCEPTED | ASSIGNED | IN_PROGRESS | ON_THE_WAY | COMPLETED | CANCELLED | DISPUTED`)
- [X] T003 [P] Update `customerBookingSchema` status enum in `src/features/bookings/schemas/validation.ts` to include `ASSIGNED` and `ON_THE_WAY`
- [X] T004 [P] Update `Booking` interface status enum in `src/features/bookings/services/api.ts` to include `ASSIGNED`, `IN_PROGRESS`, and `ON_THE_WAY`
- [X] T005 [P] Add missing booking/job API functions to `src/features/bookings/services/api.ts`: `createBooking`, `cancelBooking`, `getMyJobs`, `getJobById`, `getAssignedJobs`, `getAvailableJobs`, `acceptJob`, `rejectJob`, `updateJobStatus` — all using axios client; add Zod validation schemas for request/response where missing

---

## Phase 3: User Story 1 (P1) — Customer Creates a Booking

### Story Goal
A customer creates a new service booking by selecting a service, choosing a provider, specifying an address, and confirming booking details — all connected to the consolidated backend API.

### Independent Test
A customer navigates the booking flow at `/booking/[id]` or `/client/create-job`, fills out the form, selects a service and provider, reviews summary, and receives a booking confirmation.

### Tasks

- [X] T006 [US1] Update `src/app/[locale]/booking/[id]/page.tsx` to use the consolidated `bookingApi.createBooking` from `src/features/bookings/services/api.ts` instead of `api.createBooking` from `src/services/api.ts`
- [X] T007 [US1] Add Zod validation to the booking creation form in `src/app/[locale]/booking/[id]/page.tsx` matching backend DTO fields (date, time, address, description, notes)
- [X] T008 [P] [US1] Update `src/features/client/CreateJobForm.tsx` to use consolidated `bookingApi.createJob` from `src/features/bookings/services/api.ts` instead of `api.createJob`
- [X] T009 [US1] Create `useCreateBooking` mutation hook that invalidates `['bookings', 'customer']` query cache on success

---

## Phase 4: User Story 2 (P1) — Customer Views Booking Details and Timeline

### Story Goal
A customer views the details of an existing booking, including service information, provider assignment, payment details, and the complete status history timeline.

### Independent Test
A customer with an existing booking navigates to `/client/jobs/[id]`, sees booking info, provider info, payment info, and a timeline with all status transitions.

### Tasks

- [X] T010 [US2] Create `src/app/[locale]/client/jobs/[id]/page.tsx` as a customer booking detail page with:
  - Booking information section (id, status badge, timestamps, notes)
  - Service information section (name, category)
  - Provider information section (name, contact, avatar — when assigned)
  - Payment information section (status, method, paid date)
  - Timeline section using the enhanced `BookingTimeline` component
  - Cancel action button (links to US3 cancel flow)
  - Loading skeleton state, error state with retry, empty data state
- [X] T011 [US2] Update `useBookingDetail` hook in `src/features/bookings/hooks/useBookingDetail.ts` to use consolidated `bookingApi.getJobById` from `src/features/bookings/services/api.ts` instead of `api.getJobById` from `src/services/api.ts`
- [X] T012 [P] [US2] Create `useBookingTimeline` hook in `src/features/bookings/hooks/useBookingTimeline.ts` using `bookingApi.getBookingTimeline` with TanStack Query
- [X] T013 [US2] Extend `BookingTimeline` component in `src/features/bookings/components/BookingTimeline.tsx` event types to include: `PROVIDER_ASSIGNED`, `PROVIDER_ACCEPTED`, `PROVIDER_REJECTED`, `CANCELLED`, `COMPLETED`, `TRACKING_STARTED`
- [X] T014 [P] [US2] Add timeline icons and colors for new event types in `BookingTimeline.tsx` (e.g., provider events in blue, cancellation in red, completion in green)
- [X] T015 [US2] Integrate `useBookingTimeline` hook into the booking detail page, passing events to the `BookingTimeline` component
- [X] T016 [P] [US2] Ensure `BookingCard` in `src/features/bookings/components/BookingCard.tsx` links to `/client/jobs/${booking.id}` (verify link exists)
- [X] T017 [US2] Update `src/app/[locale]/(dashboard)/bookings/[id]/page.tsx` admin booking detail page to use the updated `Booking` status enum with `ASSIGNED` and `ON_THE_WAY`
- [X] T018 [US2] Load and pass `bookingApi.getBookingDetails` data as timeline source in admin booking detail page (currently uses inline mock data)

---

## Phase 5: User Story 3 (P1) — Customer Cancels a Booking

### Story Goal
A customer cancels an existing booking before it is completed, providing a cancellation reason, with confirmation and error handling.

### Independent Test
A customer on the booking detail page clicks cancel, selects a reason, confirms, and sees the booking status update to cancelled.

### Tasks

- [X] T019 [US3] Create `useCancelBooking` mutation hook in `src/features/bookings/hooks/useCancelBooking.ts` using `bookingApi.cancelBooking` with TanStack Query mutation, invalidating `['bookings', 'detail', id]` and `['bookings', 'customer']` query caches on success
- [X] T020 [P] [US3] Create `CancelBookingDialog` component in `src/features/bookings/components/CancelBookingDialog.tsx` with:
  - Reason selection (predefined options + custom input)
  - Confirmation step with cancel/submit buttons
  - Loading state during submission
  - Error display for backend validation failures
  - Success state with status refresh
- [X] T021 [US3] Integrate `CancelBookingDialog` into the booking detail page (`/client/jobs/[id]/page.tsx`), showing the cancel button only when booking status allows cancellation (PENDING, ACCEPTED, ASSIGNED)
- [X] T022 [US3] Handle backend cancellation errors in the dialog: display error message, prevent dialog close on failure, allow retry

---

## Phase 6: User Story 7 (P1) — Provider Manages Assigned Bookings

### Story Goal
A provider views their assigned bookings, accepts/rejects new bookings, updates status during service, and marks bookings as complete.

### Independent Test
A provider accesses their jobs page, sees assigned bookings, accepts a new one, updates status through the lifecycle, and completes it.

### Tasks

- [X] T023 [P] [US7] Add provider API functions to `src/features/bookings/services/api.ts`: `getAssignedJobs`, `getAvailableJobs`, `acceptJob`, `rejectJob`, `updateJobStatus`
- [X] T024 [P] [US7] Create `useAssignedJobs` hook in `src/features/bookings/hooks/useAssignedJobs.ts` using consolidated `bookingApi.getAssignedJobs` with TanStack Query
- [X] T025 [US7] Create `useAcceptJob`, `useRejectJob`, `useUpdateJobStatus` mutation hooks in `src/features/bookings/hooks/useProviderJobActions.ts` with query cache invalidation
- [X] T026 [P] [US7] Create provider job action components in `src/features/bookings/components/`: `AcceptJobButton`, `RejectJobButton`, `StatusUpdateSelect`, `CompleteJobButton`
- [X] T027 [US7] Enhance `src/app/[locale]/technician/jobs/page.tsx` to show assigned bookings list with accept/reject buttons for new assignments and status update controls for active bookings
- [X] T028 [US7] Display backend validation error messages on provider action failures (e.g., attempting to complete a booking not in IN_PROGRESS state)

---

## Phase 7: User Story 4 (P2) — Customer Tracks Active Booking

### Story Goal
A customer tracks an active booking in real-time with provider location, ETA, and live progress updates via WebSocket.

### Independent Test
A customer with an active booking navigates to the tracking view, sees current status, tracking events, provider location (when available), and ETA (when available).

### Tasks

- [X] T029 [P] [US4] Create `useTracking` hook in `src/features/bookings/hooks/useTracking.ts` that:
  - Fetches tracking session via REST (`GET /tracking/:bookingId`)
  - Returns current status, provider location, ETA
  - Supports WebSocket connection for live updates with fallback to polling
  - Handles WebSocket disconnect gracefully
- [X] T030 [P] [US4] Create `BookingTracking` component in `src/features/bookings/components/BookingTracking.tsx` displaying:
  - Current booking status with progress indicator
  - Latest tracking event
  - Tracking session status badge
  - Loading, error, and no-tracking states
- [X] T031 [P] [US4] Create `TrackingMap` component in `src/features/bookings/components/TrackingMap.tsx` displaying provider location (latitude/longitude) with a map or coordinates display
- [X] T032 [US4] Create `src/app/[locale]/client/tracking/[id]/page.tsx` standalone tracking page integrating `BookingTracking` and `TrackingMap` components
- [X] T033 [US4] Add tracking section to the booking detail page (`/client/jobs/[id]/page.tsx`) when booking status is ON_THE_WAY or IN_PROGRESS, showing live tracking data
- [X] T034 [US4] Add "Track Booking" button/link on `ActiveBookingCard` in `src/features/bookings/components/ActiveBookingCard.tsx` for active bookings

---

## Phase 8: User Story 5 (P2) — Customer Receives Booking Notifications

### Story Goal
A customer receives notifications for all booking lifecycle events and can navigate to booking details from notifications.

### Independent Test
Triggering booking lifecycle events generates notifications with correct types; clicking a notification redirects to the booking detail page.

### Tasks

- [X] T035 [P] [US5] Add booking-specific notification types to `src/features/notifications/types/index.ts`: `BOOKING_CREATED`, `BOOKING_ACCEPTED`, `BOOKING_ASSIGNED`, `BOOKING_STARTED`, `BOOKING_COMPLETED`, `BOOKING_CANCELLED`
- [X] T036 [P] [US5] Create `useBookingNotifications` hook in `src/features/notifications/hooks/useBookingNotifications.ts` that filters notifications by booking-related types and provides `getBookingLink(notification)` returning `/client/jobs/:bookingId`
- [X] T037 [US5] Update `NotificationCard` component in `src/features/notifications/components/NotificationCard.tsx` with icons and colors for each booking notification type (created=blue, accepted=green, assigned=purple, started=orange, completed=teal, cancelled=red)
- [X] T038 [US5] Ensure clicking a booking notification card redirects to `/client/jobs/:bookingId` using the `metadata.bookingId` field

---

## Phase 9: User Story 6 (P2) — Customer Views Booking History

### Story Goal
A customer views their complete booking history with pagination, filtering, and sorting.

### Independent Test
A customer navigates to `/client/jobs`, applies filters, changes sort, and navigates pages to see their booking history.

### Tasks

- [ ] T039 [US6] Update `useCustomerBookings` hook in `src/features/bookings/hooks/useCustomerBookings.ts` to use consolidated `bookingApi.getMyJobs` from `src/features/bookings/services/api.ts` instead of `api.getMyJobs` from `src/services/api.ts`
- [ ] T040 [P] [US6] Add pagination total count and proper page calculation to `useCustomerBookings` based on API response (currently uses `jobs.length` as total which is inaccurate)

---

## Phase 10: Cross-Cutting (Mock Data Cleanup & API Audit)

### Goal
Remove all mock/fallback booking data and generate the comprehensive API audit report.

### Tasks

- [X] T041 Remove mock/fallback booking data from `src/app/[locale]/booking/[id]/page.tsx` (fallback booking reference ID generation `'HERFA-' + Date.now()...` on line 118)
- [X] T042 Remove any other mock booking data fallbacks across booking pages, ensuring all booking data flows through real API calls (check `ActiveBookingCard`, dashboard pages, technician pages)
- [X] T043 Generate `docs/booking-lifecycle-audit.md` documenting all Booking, Jobs, Tracking, Notifications, Reviews, and Payments API endpoints with:
  - Coverage status for each endpoint
  - API mismatch analysis (status enums, DTO fields, request/response payloads)
  - Missing integrations
  - Required fixes summary
  - Authentication requirements and role restrictions for each endpoint

---

## Parallel Execution Examples

| Tasks | Description | Files |
|-------|-------------|-------|
| T002, T003, T004, T005 | Foundational — all files independent | `types/index.ts`, `schemas/validation.ts`, `services/api.ts` (3x) |
| T007, T008 | US1 — form updates, no dependency | `booking/[id]/page.tsx`, `CreateJobForm.tsx` |
| T012, T014, T016 | US2 — timeline hook, icons, card link | `useBookingTimeline.ts`, `BookingTimeline.tsx`, `BookingCard.tsx` |
| T020, T023, T024, T029, T030, T031, T035, T036, T040 | US3/4/5/6/7 — parallel new component/hook creation | Various `components/` and `hooks/` |

## Implementation Strategy

**MVP scope**: Phase 2 (Foundational) + Phase 4 (US2: Booking Details & Timeline). This delivers the most critical missing piece — the booking detail page — enabling all downstream features (cancellation, tracking, provider management).

**Incremental delivery**: Each phase is independently testable. Phases can be delivered in the specified order, with P1 stories (US1, US2, US3, US7) delivered before P2 stories (US4, US5, US6). The API audit (T043) should be done last as a comprehensive review.

**Verification**: After all tasks in a phase complete, run:
```bash
npm run lint     # Check for lint errors
npm run type-check  # Verify TypeScript types
```

## Summary

| Metric | Value |
|--------|-------|
| **Total tasks** | 43 |
| **Phase 1: Setup** | 1 task |
| **Phase 2: Foundational** | 4 tasks (all parallel) |
| **Phase 3: US1 (P1)** | 4 tasks |
| **Phase 4: US2 (P1)** | 9 tasks |
| **Phase 5: US3 (P1)** | 4 tasks |
| **Phase 6: US7 (P1)** | 6 tasks |
| **Phase 7: US4 (P2)** | 6 tasks |
| **Phase 8: US5 (P2)** | 4 tasks |
| **Phase 9: US6 (P2)** | 2 tasks |
| **Phase 10: Cross-Cutting** | 3 tasks |
| **Parallel opportunities** | 10 task groups |
| **Independent test criteria** | One per user story phase |
