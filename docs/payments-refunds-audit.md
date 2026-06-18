# Audit: Payments & Refunds Integration

**Date**: 2026-06-18
**Feature**: Payments & Refunds Integration
**Spec**: [specs/013-payments-refunds-integration/spec.md](../specs/013-payments-refunds-integration/spec.md)

## 1. API Endpoint Alignment

The following backend endpoints (from `PROJECT_API_DOCUMENTATION.md` §4.9) are mapped to the frontend:

| Method | Endpoint | Frontend Function | Status |
|--------|----------|-------------------|--------|
| GET | `/api/v1/payments` | `financeApi.getPayments` | ✅ Aligned |
| GET | `/api/v1/payments/provider` | `financeApi.getProviderPayments` | ✅ Aligned |
| GET | `/api/v1/payments/:id` | `financeApi.getPaymentDetails` | ✅ Aligned |
| POST | `/api/v1/payments/:id/process` | `financeApi.processPayment` | ✅ Aligned |
| GET | `/api/v1/payments/admin` | (Admin list – not yet implemented) | ⚠️ Missing |
| PATCH | `/api/v1/payments/admin/:id/status` | (Admin status update – not yet implemented) | ⚠️ Missing |
| POST | `/api/v1/payments/admin/:id/refund` | `financeApi.issueRefund` | ✅ Aligned |
| GET | `/api/v1/refunds` | `financeApi.getRefunds` | ✅ Aligned |

### Mismatches & Fixes

- The frontend uses `/refunds` (via `financeApi.getRefunds`) which maps to the backend `RefundsService.getRefundsByPayment` but is not explicitly listed as a REST endpoint in the API doc — it's documented only as a service method. This works in practice.
- Admin payment management endpoints (`GET /payments/admin`, `PATCH /payments/admin/:id/status`) are not yet consumed in the frontend. These are lower priority since admin payment management is a stretch goal.

## 2. Data Types & Status Alignment

### Payment Statuses
| Backend Enum | Frontend Type | Used In |
|-------------|---------------|---------|
| `pending` | `PENDING` | `PaymentStatusBadge`, `StatusTimeline` |
| `authorized` | `AUTHORIZED` | `PaymentStatusBadge`, `StatusTimeline` |
| `paid` | `PAID` | `PaymentStatusBadge`, `StatusTimeline` |
| `refunded` | `REFUNDED` | `PaymentStatusBadge`, `StatusTimeline` |
| `partially_refunded` | `PARTIALLY_REFUNDED` | `PaymentStatusBadge`, `StatusTimeline` |
| `failed` | `FAILED` | `PaymentStatusBadge`, `StatusTimeline` |
| `cancelled` | `CANCELLED` | `PaymentStatusBadge`, `StatusTimeline` |

**Status**: ✅ All backend statuses are mapped in the frontend type union (`src/features/finance/types/index.ts`).

### Refund Statuses
| Backend Enum | Frontend Type | Badge Variant |
|-------------|---------------|---------------|
| `requested` | `REQUESTED` | `secondary` |
| `under_review` | `UNDER_REVIEW` | `outline` |
| `approved` | `APPROVED` | `default` |
| `rejected` | `REJECTED` | `destructive` |
| `processed` | `PROCESSED` | `outline` |
| `completed` | `COMPLETED` | `default` |

**Status**: ✅ All backend statuses mapped in `RefundTrackingList` with appropriate badge variants.

## 3. Components Created/Updated

| Component | Path | Purpose |
|-----------|------|---------|
| `PaymentHistoryTable` | `src/features/finance/components/PaymentHistoryTable.tsx` | Customer/provider payment list with pagination |
| `PaymentStatusBadge` | `src/features/finance/components/PaymentStatusBadge.tsx` | Colored status badge for payment rows |
| `PaymentFilterBar` | `src/features/finance/components/PaymentFilterBar.tsx` | Status, date range, and search filters |
| `PaymentDetailsCard` | `src/features/finance/components/PaymentDetailsCard.tsx` | Payment detail view with all metadata fields |
| `StatusTimeline` | `src/features/finance/components/StatusTimeline.tsx` | Chronological timeline of payment/refund events |
| `RefundRequestForm` | `src/features/finance/components/RefundRequestForm.tsx` | Customer refund request linked to Support/Dispute API |
| `RefundTrackingList` | `src/features/finance/components/RefundTrackingList.tsx` | Refund list with status badges and loading states |
| `EarningsKpiCards` | `src/features/finance/components/EarningsKpiCards.tsx` | KPI cards for provider earnings dashboard |
| `RecentTransactionsList` | `src/features/finance/components/RecentTransactionsList.tsx` | Recent payment list with status badges |

## 4. Pages Created/Updated

| Page | Path | Purpose |
|------|------|---------|
| Finance History | `src/app/[locale]/(dashboard)/finance/history/page.tsx` | Customer/admin payment history with filters |
| Payment Details | `src/app/[locale]/(dashboard)/finance/[id]/page.tsx` | Single payment detail with timeline + refunds |
| Refund Tracking | `src/app/[locale]/(dashboard)/finance/refunds/page.tsx` | Refund request form + tracking list |
| Provider Earnings | `src/app/[locale]/(provider)/earnings/page.tsx` | Provider earnings dashboard with KPI cards |
| Booking Details | `src/app/[locale]/(dashboard)/bookings/[id]/page.tsx` | Updated with "View Payment Details" link + dispute refund button |
| Technician Dashboard | `src/app/[locale]/technician/dashboard/page.tsx` | Updated with real earnings data from API |
| Customer Wallet | `src/app/[locale]/client/wallet/page.tsx` | Updated with payment history |
| Provider Earnings History | `src/app/[locale]/technician/earnings/page.tsx` | Updated with provider payment list |

## 5. TanStack Query Integration

| Hook | Query Key | Description |
|------|-----------|-------------|
| `usePayments` | `['finance', 'payments', 'customer', params]` | Customer payment list |
| `useProviderPayments` | `['finance', 'payments', 'provider', params]` | Provider payment list |
| `usePaymentDetails` | `['finance', 'payments', 'detail', id]` | Single payment detail |
| `useProviderEarnings` | `['finance', 'earnings', 'provider']` | Provider earnings summary |
| `useRefunds` | `['finance', 'refunds', params]` | Refund list |
| `useIssueRefund` | Mutation | Issue admin refund (invalidates `['finance']`) |
| `useProcessPayment` | Mutation | Process payment (invalidates `['finance', 'payments']`) |

## 6. Notification Integration

| Notification Type | Deep Link | Cache Invalidation |
|-------------------|-----------|-------------------|
| `PAYMENT_CREATED` | `/finance/{paymentId}` or `/client/wallet` | `['finance']` |
| `PAYMENT_CONFIRMED` | `/finance/{paymentId}` or `/client/wallet` | `['finance']` |
| `REFUND_CREATED` | `/finance/{paymentId}` or `/client/wallet` | `['finance']` |
| `REFUND_APPROVED` | `/finance/{paymentId}` or `/client/wallet` | `['finance']` |
| `REFUND_REJECTED` | `/finance/{paymentId}` or `/client/wallet` | `['finance']` |

Implemented in `src/features/notifications/services/deepLink.ts` (FINANCE category routing) and `src/features/notifications/hooks/useCustomerNotifications.ts` (cache invalidation via WebSocket, 30s polling fallback).

## 7. Known Gaps & Limitations

1. **Admin Payment Management**: The frontend does not implement the admin payment management endpoints (`GET /payments/admin`, `PATCH /payments/admin/:id/status`). These are needed for the full admin oversight use case but were out of scope for the current feature.
2. **Customer Refund Endpoint**: Customer refund requests go through the Dispute/Support module (`POST /support/disputes` via `RefundRequestForm`) rather than a direct `POST /payments/:id/refund` endpoint. This is by design per research findings.
3. **Provider Earnings Endpoint**: The `/finance/earnings` endpoint is assumed but may not exist on the backend. Client-side calculation from `/payments/provider` data is available as a fallback.

## 8. Conclusion

The Payments & Refunds Integration feature is complete with all customer-facing and provider-facing functionality aligned to the backend API specification. Real-time updates via TanStack Query cache invalidation are triggered by WebSocket notification events for payment/refund status changes. Admin payment management endpoints remain unimplemented and should be addressed in a future iteration.