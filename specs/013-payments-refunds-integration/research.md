# Research: Payments & Refunds Integration

## Decision Log

### Decision: API Service Expansion
- **Action**: Expand `src/features/finance/services/api.ts` to include Customer and Provider specific endpoints.
- **Rationale**: Current `financeApi` only serves Admin/Payouts. To meet "API-First" principles, we must map Customer Payment History and Provider Earnings to their respective backend endpoints.
- **Endpoints Mapped**:
  - `getPayments`: `GET /api/v1/payments` (Customer)
  - `getProviderPayments`: `GET /api/v1/payments/provider` (Provider)
  - `getPaymentDetails`: `GET /api/v1/payments/:id`
  - `getRefunds`: `GET /api/v1/refunds` (Verify endpoint)
  - `createRefund`: `POST /api/v1/payments/admin/:id/refund` (Verify if exposed for customers or only admin)

### Decision: Status Enum Alignment
- **Action**: Use backend defined `Payment Status` and `Refund Status` enums.
- **Rationale**: Backend is the source of truth. Frontend must not define its own status logic.
- **Statuses**:
  - Payment: `pending`, `authorized`, `paid`, `refunded`, `partially_refunded`, `failed`, `cancelled`.
  - Refund: (To be verified from backend entity/DTO).

### Decision: Dashboard Widget Data Source
- **Action**: Use `Analytics` and `Finance` modules for dashboard widgets.
- **Rationale**: `RevenueStats` and `ProviderRatingStats` provide the necessary summary data for dashboards.

## Research Findings

### Unknown 1: Customer Refund Request Endpoint
- **Task**: Determine how customers request refunds. Is it a direct endpoint or via a dispute/support ticket?
- **Finding**: Refund requests are primarily initiated via the Support/Dispute module (`POST /api/v1/support/disputes`) or directly by Admin via `POST /api/v1/payments/admin/:id/refund`.
- **Decision**: Implementation will link the "Request Refund" button to the Dispute creation flow, while the Admin dashboard will use the direct refund endpoint.

### Unknown 2: Provider Earnings Summary
- **Task**: Find the exact endpoint for "Total Earnings", "Pending Earnings", "Completed Transactions" for providers.
- **Finding**: Providers can access their payments via `GET /api/v1/payments/provider`. Earnings summaries can be derived from these records or retrieved via `GET /api/v1/providers/profile` which includes `ProviderRatingStats`.
- **Decision**: Extend `financeApi` to fetch provider payments and calculate summaries client-side if a dedicated "earnings" endpoint is missing, or use `RevenueStats` if applicable for providers.

### Unknown 3: Notification Events for Payments
- **Task**: List WebSocket events for payment status updates.
- **Finding**: `payment.received`, `payment.created`, `payment.failed`, `refund.created`, `refund.approved`, `refund.rejected`.
- **Decision**: TanStack Query cache invalidation will be triggered by these events to ensure real-time UI updates.

## UI Audit: Mock Data Locations

- **Payment History**: `src/app/[locale]/(dashboard)/finance/page.tsx` - Admin view (mostly mocked KPIs).
- **Customer Wallet**: (To be created or updated if exists) - Needs integration with `GET /api/v1/payments`.
- **Provider Dashboard**: `src/app/[locale]/(provider)/dashboard/page.tsx` - Earnings widgets are currently placeholders.
- **Booking Details**: `src/app/[locale]/booking/[id]/page.tsx` - Payment status is hardcoded in some cases.

## Next Steps
- Verify exact Refund DTOs and Statuses.
- Confirm Customer refund request workflow (Support vs Direct).
- Map "Earnings" data for Provider portal.
