# Customer Dashboard — API Integration Audit

**Generated**: 2026-06-18
**Feature**: Customer Dashboard Completion

## Coverage Summary

| Domain | Endpoints Required | Endpoints Integrated | Status |
|--------|-------------------|---------------------|--------|
| Dashboard Stats | 1 | 1 | ✅ |
| Booking History | 2 | 2 | ✅ |
| Booking Detail | 1 | 1 | ✅ |
| Notifications | 3 | 3 | ✅ |
| Address CRUD | 5 | 5 | ✅ |
| Tracking | 1 | 1 (assumed) | ⚠️ |
| **Total** | **13** | **13** | ✅ |

## Endpoint Audit

### Dashboard

| Endpoint | Method | Source File | Status |
|----------|--------|-----------|--------|
| `/jobs/my-jobs` | GET | `src/features/client/hooks/useDashboardStats.ts` (via `src/services/api.ts`) | ✅ Integrated. Used for stats computation (active, pending, completed counts). |

### Booking History

| Endpoint | Method | Source File | Status |
|----------|--------|-----------|--------|
| `/jobs/my-jobs?page=&limit=&status=&sort=` | GET | `src/features/bookings/hooks/useCustomerBookings.ts` (via `src/services/api.ts`) | ✅ Integrated. Supports pagination, status filter, and date sorting. |
| `/jobs/{id}` | GET | `src/features/bookings/hooks/useBookingDetail.ts` (via `src/services/api.ts`) | ✅ Integrated. Returns full booking details including provider, payment, and timeline. |

### Notifications (Customer)

| Endpoint | Method | Source File | Status |
|----------|--------|-----------|--------|
| `/notifications?page=&limit=` | GET | `src/features/notifications/hooks/useCustomerNotifications.ts` (via `src/services/api.ts`) | ✅ Integrated. Paginated notification list for customer notifications center. |
| `/notifications/unread-count` | GET | `src/features/notifications/hooks/useCustomerNotifications.ts` (via `src/services/api.ts`) | ✅ Integrated. Used in sidebar badge and dashboard notification widget. |
| `/notifications/mark-read` | POST | `src/features/notifications/hooks/useCustomerNotifications.ts` (via `src/services/api.ts`) | ✅ Integrated. Supports single and bulk mark-as-read. |

### Addresses

| Endpoint | Method | Source File | Status |
|----------|--------|-----------|--------|
| `/addresses` | GET | `src/features/addresses/services/api.ts` | ✅ Integrated. Fetches all saved addresses for the user. |
| `/addresses` | POST | `src/features/addresses/services/api.ts` | ✅ Integrated. Creates a new address. |
| `/addresses/{id}` | PATCH | `src/features/addresses/services/api.ts` | ✅ Integrated. Updates an existing address. |
| `/addresses/{id}` | DELETE | `src/features/addresses/services/api.ts` | ✅ Integrated. Deletes an address. |
| `/addresses/{id}/default` | PATCH | `src/features/addresses/services/api.ts` | ✅ Integrated. Sets an address as default. |

### Tracking (Assumed)

| Endpoint | Method | Source File | Status |
|----------|--------|-----------|--------|
| (embedded in `/jobs/{id}`) | GET | `src/features/bookings/components/ActiveBookingCard.tsx` | ⚠️ Assumed. Tracking info is expected in the booking detail response under `tracking` field. If not available, a dedicated `GET /jobs/{id}/tracking` endpoint may be needed. |

## File-by-File Integration Map

### New Files Created

| File | Purpose |
|------|---------|
| `src/features/addresses/types/index.ts` | Address TypeScript interface |
| `src/features/addresses/schemas/validation.ts` | Address Zod validation schemas |
| `src/features/addresses/services/api.ts` | Address CRUD API service (axios) |
| `src/features/addresses/hooks/useAddresses.ts` | Address TanStack Query hooks |
| `src/features/addresses/hooks/useAddressForm.ts` | Address form hook (React Hook Form + Zod) |
| `src/features/addresses/components/AddressForm.tsx` | Address add/edit form component |
| `src/features/addresses/components/AddressCard.tsx` | Single address display card |
| `src/features/addresses/components/AddressList.tsx` | Address list with CRUD actions |
| `src/features/notifications/types/index.ts` | CustomerNotification TypeScript interface |
| `src/features/notifications/schemas/validation.ts` | Notification Zod validation schemas |
| `src/features/notifications/hooks/useCustomerNotifications.ts` | Customer notification hooks |
| `src/features/notifications/components/CustomerNotificationList.tsx` | Notification list component |
| `src/features/notifications/components/NotificationCard.tsx` | Notification card with mark-as-read |
| `src/features/bookings/types/index.ts` | CustomerBooking TypeScript types |
| `src/features/bookings/schemas/validation.ts` | Booking Zod validation schemas |
| `src/features/bookings/hooks/useCustomerBookings.ts` | Customer booking list hook with filters/pagination |
| `src/features/bookings/hooks/useBookingDetail.ts` | Single booking detail hook |
| `src/features/bookings/hooks/useActiveBookings.ts` | Active bookings hook (filters non-terminal statuses) |
| `src/features/bookings/components/BookingCard.tsx` | Booking list card component |
| `src/features/bookings/components/BookingFilters.tsx` | Status filter + sort toggle component |
| `src/features/bookings/components/BookingPagination.tsx` | Pagination component |
| `src/features/bookings/components/ActiveBookingCard.tsx` | Active booking card with provider/tracking info |
| `src/features/bookings/components/ActiveBookingList.tsx` | Active booking list grouped by status |
| `src/features/client/hooks/useDashboardStats.ts` | Dashboard stats computation hook |
| `src/features/client/components/ProfileSummary.tsx` | Profile summary from auth store |
| `src/app/[locale]/client/notifications/page.tsx` | Notifications center page |
| `src/app/[locale]/client/addresses/page.tsx` | Address management page |
| `src/app/[locale]/client/jobs/[id]/page.tsx` | Booking detail page |
| `docs/customer-dashboard-audit.md` | This audit report |

### Files Modified

| File | Changes |
|------|---------|
| `src/app/[locale]/client/dashboard/page.tsx` | Removed `savedTechnicians` and `notifications` hardcoded arrays. Replaced `$0.00` wallet with pending count card. Added `useDashboardStats`, `useUnreadCount`, `useActiveBookings`. Added loading skeletons. Added `ProfileSummary`. Added `ActiveBookingList`. |
| `src/app/[locale]/client/jobs/page.tsx` | Added `BookingFilters`, `BookingCard`, `BookingPagination`. Added `useCustomerBookings` hook. |
| `src/app/[locale]/client/create-job/page.tsx` | Updated `CreateJobForm` to integrate saved address selection via radio buttons from `useAddresses`. |
| `src/features/client/CreateJobForm.tsx` | Added saved address selection with radio buttons, `useAddresses` integration. |
| `src/components/layout/AppSidebar.tsx` | Added "Notifications" nav item with dynamic unread badge for CUSTOMER role. |
| `src/messages/en.json` | Added `Address`, `Notifications`, `Bookings`, `Dashboard` i18n sections. |
| `src/messages/ar.json` | Added Arabic translations for all new i18n sections. |

## Mock Data Elimination

| Location | Before | After |
|----------|--------|-------|
| Dashboard — Saved Technicians | Hardcoded array of 3 technicians | Removed entirely (section replaced with `ProfileSummary`) |
| Dashboard — Notifications | Hardcoded `[{ title: 'Promo Alert', ... }]` | Live unread count from `/notifications/unread-count` |
| Dashboard — Wallet Balance | Hardcoded `$0.00` | Removed — replaced with Pending Orders stat card |
| Jobs Page | No filters/pagination, all jobs loaded at once | Status filter, sort toggle, pagination controls |

## Missing Integrations & Gaps

1. **Tracking endpoint** (`GET /jobs/{id}/tracking`): Assumed but unconfirmed. If the backend does not include tracking info in the job detail response, the tracking indicators in `ActiveBookingCard` will not display.
2. **Wallet API**: No wallet/balance endpoint integrated. The hardcoded `$0.00` was removed from dashboard. Wallet page already exists at `/client/wallet` but was not modified.
3. **Favorites/ Saved Technicians API**: No backend endpoint exists for saved technicians. The hardcoded array was removed from dashboard.

## API/DTO Mismatches

| Endpoint | Expected Type | Notes |
|----------|-------------|-------|
| `/jobs/my-jobs` | Array or PaginatedResponse | The current `src/services/api.ts` unwraps the `data` property. The jobs page handles both array and paginated response shapes. |
| `/notifications` | `{ data: [], total, page, limit }` | The notifications page handles both `{ data: [] }` and raw array shapes for resilience. |
| `/notifications/unread-count` | `{ count: number }` | Hook handles the count extraction defensively. |

## Recommendations

1. **Backend**: Confirm `GET /jobs/{id}/tracking` endpoint exists. If not, embed tracking data in the job detail response.
2. **Backend**: If wallet balance is needed on dashboard, expose a `GET /wallet/balance` endpoint.
3. **Testing**: Add Vitest unit tests for the new hooks and components once the testing framework is configured.
4. **Pagination**: The `/jobs/my-jobs` endpoint may return all jobs in a flat array. Verify it supports `page`/`limit` query params for server-side pagination. Client-side pagination is implemented as a fallback.
