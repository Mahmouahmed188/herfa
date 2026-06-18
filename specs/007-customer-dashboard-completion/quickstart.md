# Quickstart: Customer Dashboard Completion

## Prerequisites

- Node.js 18+ and npm installed
- Backend API running at `http://localhost:3001/api/v1` (or `NEXT_PUBLIC_API_URL`)
- Git branch: `007-customer-dashboard-completion`

## Implementation Order

### Step 1: Address Module (Foundation)

New feature module — no dependencies on other changes.

**Files to create**:
- `src/features/addresses/types/index.ts` — Address interface
- `src/features/addresses/schemas/validation.ts` — Zod schemas for address form
- `src/features/addresses/services/api.ts` — Axios-based CRUD API service
- `src/features/addresses/hooks/useAddresses.ts` — TanStack Query hooks
- `src/features/addresses/components/AddressForm.tsx` — Add/edit address form
- `src/features/addresses/components/AddressCard.tsx` — Single address display
- `src/features/addresses/components/AddressList.tsx` — List with CRUD actions

**Files to update**:
- `src/types/api.d.ts` — Add Address to global types (optional, keep in feature)

**Page to create**:
- `src/app/[locale]/client/addresses/page.tsx` — Address management page

### Step 2: Notification Module (Customer)

Expand existing admin-only notifications module for customer use.

**Files to update**:
- `src/features/notifications/types/index.ts` — Create with CustomerNotification type
- `src/features/notifications/schemas/validation.ts` — Create with notification schemas
- `src/features/notifications/services/api.ts` — Add customer notification endpoints (use existing core API or axios)
- `src/features/notifications/hooks/useNotifications.ts` — Add `useCustomerNotifications`, `useUnreadCount`, `useMarkAsRead`
- `src/features/notifications/components/CustomerNotificationList.tsx` — Create customer notification UI

**Pages to create**:
- `src/app/[locale]/client/notifications/page.tsx` — Notifications center page

**Files to update** (dashboard):
- `src/app/[locale]/client/dashboard/page.tsx` — Replace hardcoded notifications with API data

### Step 3: Dashboard Real Data Connection

**Files to update**:
- `src/app/[locale]/client/dashboard/page.tsx`:
  - Remove `savedTechnicians` hardcoded array (replace with `useQuery` for favorites or remove section)
  - Remove `notifications` hardcoded array (use `getUnreadNotificationsCount`)
  - Replace `$0.00` balance (use real wallet API if available, or hide)
  - Add pending count to stats cards (use same `getMyJobs` response)

### Step 4: Booking History Enhancement

**Files to create**:
- `src/app/[locale]/client/jobs/[id]/page.tsx` — Booking detail page (provider info, payment, timeline)

**Files to update**:
- `src/app/[locale]/client/jobs/page.tsx`:
  - Add pagination controls
  - Add status filter dropdown/tabs
  - Add sort by date toggle
  - Link to detail page

### Step 5: Active Bookings Section

**Files to update**:
- `src/app/[locale]/client/dashboard/page.tsx` — Enhance active orders section with:
  - Provider assignment display
  - Tracking availability indicator
  - Estimated arrival time when available
  - Group by status (ongoing, upcoming, pending)

### Step 6: API Audit Report

**File to create**:
- `docs/customer-dashboard-audit.md` — Comprehensive audit comparing frontend vs backend

## Running Checks

```bash
npm run lint        # Next.js lint
npm run type-check  # TypeScript compilation check
npm test            # Unit tests
```

## Key Patterns

- All new API calls go in `src/features/[domain]/services/api.ts` using the axios client from `@/lib/axios`
- All new data fetching uses TanStack Query hooks in `src/features/[domain]/hooks/`
- All forms use React Hook Form with Zod resolvers
- All API responses validated with Zod schemas
- Every API-consuming component handles: loading, empty, error, success states
- UI text uses `next-intl` message keys (add to `src/messages/ar.json` and `en.json`)
- No mock data — all data comes from backend APIs

## Checklist

- [ ] Address CRUD complete
- [ ] Address form validation working
- [ ] Addresses available in booking flow
- [ ] Notifications center displays real data
- [ ] Unread count displayed and accurate
- [ ] Dashboard uses real data (no mocks)
- [ ] Booking history has pagination
- [ ] Booking history has status filter
- [ ] Booking detail page exists and shows provider/payment info
- [ ] Active bookings show provider and tracking
- [ ] API audit report generated
- [ ] All lint/type-check/tests pass
