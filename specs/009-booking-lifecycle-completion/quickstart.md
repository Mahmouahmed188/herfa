# Quickstart: Booking Lifecycle Completion

## Prerequisites

- Node.js 18+ installed
- `npm install` completed
- Backend API running at `http://localhost:3001/api/v1` (or configured `NEXT_PUBLIC_API_URL`)
- Provider Verification System (spec 008) completed as prerequisite

## Key Files

| Purpose | File Path |
|---------|-----------|
| Booking Types | `src/features/bookings/types/index.ts` |
| Booking Schemas | `src/features/bookings/schemas/validation.ts` |
| Booking API Service | `src/features/bookings/services/api.ts` |
| Customer Bookings Hook | `src/features/bookings/hooks/useCustomerBookings.ts` |
| Booking Detail Hook | `src/features/bookings/hooks/useBookingDetail.ts` |
| Active Bookings Hook | `src/features/bookings/hooks/useActiveBookings.ts` |
| Booking Card | `src/features/bookings/components/BookingCard.tsx` |
| Booking Timeline | `src/features/bookings/components/BookingTimeline.tsx` |
| Booking Filters | `src/features/bookings/components/BookingFilters.tsx` |
| Booking Pagination | `src/features/bookings/components/BookingPagination.tsx` |
| Active Booking List | `src/features/bookings/components/ActiveBookingList.tsx` |
| Active Booking Card | `src/features/bookings/components/ActiveBookingCard.tsx` |
| Dispute Panel | `src/features/bookings/components/DisputePanel.tsx` |
| Legacy API Service | `src/services/api.ts` |
| Notifications Feature | `src/features/notifications/` |
| Auth Store | `src/features/auth/stores/useAuthStore.ts` |
| Admin Booking Detail | `src/app/[locale]/(dashboard)/bookings/[id]/page.tsx` |
| Customer Jobs List | `src/app/[locale]/client/jobs/page.tsx` |
| Customer Dashboard | `src/app/[locale]/client/dashboard/page.tsx` |
| Booking Create (Legacy) | `src/app/[locale]/booking/[id]/page.tsx` |
| Create Job Form | `src/features/client/CreateJobForm.tsx` |
| Technician Jobs | `src/app/[locale]/technician/jobs/page.tsx` |

## Implementation Order

### Step 1: Align Booking Status Enum

Update `BookingStatus` type, `customerBookingSchema`, and `bookingApi.Booking` status to include `ASSIGNED` and `ON_THE_WAY`. Ensure all three definitions stay in sync.

**Files**: `src/features/bookings/types/index.ts`, `src/features/bookings/schemas/validation.ts`, `src/features/bookings/services/api.ts`

### Step 2: Consolidate Booking API Calls to Axios Service

Migrate all `fetchWithAuth` booking/job API calls from `src/services/api.ts` to `src/features/bookings/services/api.ts` using the axios client. Create missing endpoints: create booking, cancel booking, get jobs list, cancel job, provider operations.

**Files**: `src/features/bookings/services/api.ts`, `src/features/bookings/hooks/*.ts`

### Step 3: Create Customer Booking Detail Page

Create `src/app/[locale]/client/jobs/[id]/page.tsx` displaying:
- Booking information (identifiers, timestamps, status)
- Service information
- Provider information (when assigned)
- Payment information
- Booking timeline
- Cancel booking action (when eligible)

### Step 4: Enhance Booking Timeline Component

Extend `BookingTimeline` to use actual booking status transitions from the timeline API endpoint. Add provider assignment events, cancellation events, and completion events.

### Step 5: Add Booking Cancellation Flow

Create a cancellation dialog/flow in the booking detail page with reason selection, confirmation, backend error handling, and status refresh.

### Step 6: Create Active Booking Tracking Page

Create tracking page or section showing real-time booking progress, tracking events, tracking session status, provider location (when available), and ETA (when available). Integrate WebSocket tracking when the backend supports it.

### Step 7: Add Booking Notifications Integration

Add booking-specific notification types and hooks. Ensure all lifecycle events generate appropriate notifications. Link notification clicks to booking detail page.

### Step 8: Add Provider Booking Management

Enhance provider booking pages with accept/reject, status update, and complete booking functionality — all using the consolidated axios API service.

### Step 9: Remove Mock Booking Data

Remove any mock/fallback booking data from all pages. Ensure all booking data flows through real API calls.

### Step 10: Generate API Audit

Generate `docs/booking-lifecycle-audit.md` documenting endpoint coverage, mismatches, and missing integrations for Booking, Jobs, Tracking, Notifications, Reviews, and Payments APIs.

## Verification Commands

```bash
npm run lint        # Check for lint errors
npm run type-check  # Verify TypeScript types
npm test            # Run unit tests
```

## Key Architecture Decisions

1. **Consolidated API client**: All booking API calls in `src/features/bookings/services/api.ts` using axios — migrate away from `fetchWithAuth` in `src/services/api.ts`.
2. **Unified status enum**: Single `BookingStatus` type across types, schemas, and API service — `PENDING | ACCEPTED | ASSIGNED | IN_PROGRESS | ON_THE_WAY | COMPLETED | CANCELLED | DISPUTED`.
3. **TanStack Query**: All server data uses TanStack Query hooks with proper cache invalidation on mutations (booking creation, cancellation, status updates).
4. **Zod validation**: Client-side validation uses Zod schemas matching backend DTO definitions.
5. **Design preservation**: Use existing UI components and styling — no new design system elements.
6. **Real-time via WebSocket**: Implement WebSocket tracking when available, with graceful fallback to REST polling.
7. **No new feature directories**: Enhance existing `bookings` and `notifications` feature modules rather than creating new ones.
