# Quickstart: Payments & Refunds Integration

## Setup

1. **Service Layer**:
   - Extend `src/features/finance/services/api.ts` with the new endpoints defined in `contracts/finance-api.md`.
   - Update `src/features/finance/schemas/` with Zod validation for Payments and Refunds.

2. **Hooks**:
   - Implement `usePayments`, `useRefunds`, and `useProviderEarnings` in `src/features/finance/hooks/`.
   - Ensure hooks use `queryKeys` like `['finance', 'payments', filters]`.

3. **Components**:
   - Update `PayoutTable.tsx` if needed for admin refund actions.
   - Create `PaymentHistoryList.tsx` for customers.
   - Create `RefundRequestForm.tsx` (linking to Dispute API).
   - Create `EarningsSummary.tsx` for providers.

## Verification

### Automated Tests
- **Unit**: Test Zod schemas for payment/refund DTOs.
- **Integration**: Mock API responses and verify `PaymentHistoryList` renders correctly with pagination.
- **E2E**: Simulate a full cycle: Booking → Completed → Payment Paid → Refund Requested.

### Manual Verification
- Log in as Customer → Visit Finance/Wallet → Verify real transaction list.
- Log in as Provider → Visit Dashboard → Verify Earnings widgets.
- Log in as Admin → Visit Financial Management → Verify Payouts and Refund actions.
