# Research: Booking Lifecycle Completion

## Consolidated Findings

### 1. Two Concurrent Booking API Systems Exist

**Decision**: Consolidate all booking API calls into the axios-based feature module (`src/features/bookings/services/api.ts`). Migrate all `fetchWithAuth` calls from `src/services/api.ts` to the feature module's axios client.

**Rationale**: The existing booking feature module (`src/features/bookings/`) already uses the axios client from `@/lib/axios`, but hooks in `useCustomerBookings.ts`, `useBookingDetail.ts`, and `useActiveBookings.ts` still import from `@/services/api` (legacy fetch client). This split violates the API-First Architecture principle.

**Alternatives considered**: 
- A: Keep dual clients — rejected (inconsistent, harder to maintain)
- B: Add booking endpoints to raw fetch client — rejected (perpetuates legacy pattern)
- C: Consolidate into axios feature module — chosen (consistent with Provider Verification migration pattern)

**Current split**:
| Client | File | Endpoints |
|--------|------|-----------|
| Axios (bookings feature) | `src/features/bookings/services/api.ts` | `GET /bookings/:id`, `POST /bookings/:id/resolve-dispute`, `GET /bookings/:id/timeline` |
| fetchWithAuth (core) | `src/services/api.ts` | `POST /bookings`, `GET /jobs/my-jobs`, `POST /jobs`, `GET /jobs/:id`, `POST /jobs/:id/cancel`, `GET /jobs/assigned`, `GET /jobs/available`, `POST /jobs/assignments/accept`, `POST /jobs/assignments/:id/reject`, `POST /jobs/:id/status` |

---

### 2. Booking Status Enum Inconsistencies

**Decision**: Unify all booking status enums to include `ON_THE_WAY` and align with backend definitions. The `Booking` interface in the admin API service is missing `IN_PROGRESS`.

**Rationale**: Three different status definitions exist across the codebase:
- `CustomerBooking.status` in types: `PENDING | ACCEPTED | IN_PROGRESS | COMPLETED | CANCELLED | DISPUTED` (6 values)
- `Booking.status` in admin API service: `PENDING | ACCEPTED | COMPLETED | CANCELLED | DISPUTED` (5 values, missing `IN_PROGRESS`)
- Existing Timeline component references: uses event types (`STATUS_CHANGE`, `PAYMENT`, `DISPUTE`, `MESSAGE`) not booking statuses

The spec requires: `PENDING | ACCEPTED | ASSIGNED | IN_PROGRESS | ON_THE_WAY | COMPLETED | CANCELLED` plus any backend-defined statuses.

**Alternatives considered**:
- A: Extend to 7 values including `ASSIGNED` and `ON_THE_WAY` — chosen (aligns with spec)
- B: Keep current 6 values — rejected (missing `ON_THE_WAY` required by spec)
- C: Use backend DTO as single source and infer all values — not possible without modifying backend

**Target status enum**: `PENDING | ACCEPTED | ASSIGNED | IN_PROGRESS | ON_THE_WAY | COMPLETED | CANCELLED | DISPUTED`

---

### 3. Missing Customer Booking Detail Page

**Decision**: Create `src/app/[locale]/client/jobs/[id]/page.tsx` — the directory exists but contains no page file. `BookingCard` already links to this route.

**Rationale**: The `BookingCard` component (`src/features/bookings/components/BookingCard.tsx:46`) links to `/client/jobs/${booking.id}` but the route has no page file — clicking the link produces a 404.

**Alternatives considered**:
- A: Change all links to existing admin booking detail route — rejected (wrong permissions, wrong design)
- B: Create customer booking detail page — chosen (fills existing gap)

**Required sections per spec**: Booking Information, Service Information, Customer Information, Provider Information, Payment Information, Timeline Information, Status display, Provider assignment, Booking notes.

---

### 4. Tracking Feature Is Embedded, Not Standalone

**Decision**: Enhance the existing tracking data within bookings rather than creating a standalone tracking feature directory. Add dedicated tracking hooks and API service calls.

**Rationale**: `TrackingInfo` already exists in booking types (`src/features/bookings/types/index.ts:25-31`) and `ActiveBookingCard` already displays tracking info. No `src/features/tracking/` directory exists. Creating a new feature directory would be inconsistent with the existing approach.

**Alternatives considered**:
- A: Create `src/features/tracking/` — rejected (inconsistent with existing embedding)
- B: Enhance tracking within booking feature — chosen (matches existing architecture)

**Existing tracking data model**:
- `TrackingInfo`: `{ available, eta?, providerLatitude?, providerLongitude?, lastUpdated? }`
- `ActiveBookingCard`: Displays ETA and "Live" indicator
- No dedicated tracking endpoints, hooks, or WebSocket integration

---

### 5. Notification-Booking Linkage Partially Exists

**Decision**: Extend existing notification types and hooks to support all booking lifecycle events. The `BOOKING_UPDATE` type and `metadata.bookingId` field already exist.

**Rationale**: The notifications feature already has:
- `CustomerNotificationType` includes `BOOKING_UPDATE` type
- `CustomerNotification.metadata.bookingId` field for linking to bookings
- `useCustomerNotifications` hook for fetching notifications
- `useMarkAsRead` mutation

**Required lifecycle events**: Booking Created, Accepted, Assigned, Started, Completed, Cancelled. Some of these may need new notification type values or subtypes.

---

### 6. Reviews Feature Is in Support Module, Not Standalone

**Decision**: Reviews after booking completion are handled via existing support feature (`src/features/support/`). No new reviews feature directory needed.

**Rationale**: The support feature already handles:
- `ReviewItem` type with review data
- `getReviews()` API call
- `moderateReview()` for admin moderation
- `ReviewModerator` component
- `useReviews()` and `useModerateReview()` hooks

The post-completion review flow for customers may need a new customer-facing review submission component.

---

### 7. Payments Feature Distributed Across Modules

**Decision**: Payment information within bookings stays in the booking feature. The finance feature handles payout-related concerns.

**Rationale**: Payment status (`PAID | UNPAID | REFUNDED`) is part of `PaymentInfo` in booking types. The finance feature (`src/features/finance/`) handles admin payout operations. No payment processing API is exposed to the frontend beyond status tracking.

**No new payment feature needed** for the booking lifecycle completion — payments are displayed and tracked within bookings.

---

### 8. Provider Booking Management Uses Dual API Patterns

**Decision**: Migrate provider booking operations (accept, reject, update status, get assigned jobs) from `fetchWithAuth` to the bookings feature's axios service.

**Rationale**: Provider booking operations (`getAssignedJobs`, `acceptJob`, `rejectJob`, `updateJobStatus`) are defined in `src/services/api.ts` using the legacy fetch client. They should be moved to `src/features/bookings/services/api.ts` for consistency.

**Existing provider endpoints**:
- `GET /jobs/assigned` — get assigned jobs
- `GET /jobs/available?latitude=&longitude=` — get available jobs near location
- `POST /jobs/assignments/accept` — accept job assignment
- `POST /jobs/assignments/:id/reject` — reject job assignment
- `POST /jobs/:id/status` — update job status (ACCEPTED → IN_PROGRESS → COMPLETED)
