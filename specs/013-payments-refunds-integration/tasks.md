# Tasks: Payments & Refunds Integration

**Input**: Design documents from `/specs/013-payments-refunds-integration/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Unit tests for Zod schemas and integration tests for core lists are included to ensure financial data integrity.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Feature initialization and basic structure

- [ ] T001 Update `src/features/finance/schemas/index.ts` to include Payment and Refund Zod schemas
- [ ] T002 [P] Define TypeScript interfaces in `src/features/finance/types/index.ts` matching backend DTOs
- [ ] T003 [P] Add i18n keys for payments and refunds in `src/messages/en.json` and `src/messages/ar.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic and API integration that MUST be complete before ANY UI work

- [ ] T004 Implement Customer and Provider payment endpoints in `src/features/finance/services/api.ts`
- [ ] T005 [P] Implement `usePayments` hook with TanStack Query in `src/features/finance/hooks/usePayments.ts`
- [ ] T006 [P] Implement `useRefunds` hook with TanStack Query in `src/features/finance/hooks/useRefunds.ts`
- [ ] T007 [P] Create `PermissionGuard` configuration for payment and refund actions in `src/features/auth/constants.ts`

**Checkpoint**: Foundation ready - UI implementation can now begin in parallel

---

## Phase 3: User Story 1 - Unified Payment History (Priority: P1) 🎯 MVP

**Goal**: Allow Customers and Providers to view a comprehensive list of their payments with filtering and pagination.

**Independent Test**: Navigate to the Finance/History page and verify real transaction data is displayed from the backend. Verify that the status filter (e.g., "Paid") correctly updates the list.

### Implementation for User Story 1

- [ ] T008 [P] [US1] Create `PaymentHistoryTable` component in `src/features/finance/components/PaymentHistoryTable.tsx`
- [ ] T009 [P] [US1] Create `PaymentStatusBadge` component in `src/features/finance/components/PaymentStatusBadge.tsx`
- [ ] T010 [P] [US1] Create `PaymentFilterBar` component in `src/features/finance/components/PaymentFilterBar.tsx`
- [ ] T011 [US1] Implement Customer Payment History page in `src/app/[locale]/(dashboard)/finance/history/page.tsx`
- [ ] T012 [US1] Implement Provider Payment History page in `src/app/[locale]/(provider)/earnings/history/page.tsx`
- [ ] T013 [US1] Verify RTL layout and localized currency formatting for the history list

**Checkpoint**: At this point, User Story 1 (Payment History) should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Transaction & Refund Details (Priority: P1)

**Goal**: Display detailed transaction information and a status timeline for a specific payment or refund.

**Independent Test**: Click a payment from the history list and verify that the details page displays the full timeline, transaction ID, and linked booking information.

### Implementation for User Story 2

- [ ] T014 [P] [US2] Create `PaymentDetailsCard` component in `src/features/finance/components/PaymentDetailsCard.tsx`
- [ ] T015 [P] [US2] Create `StatusTimeline` component in `src/features/finance/components/StatusTimeline.tsx`
- [ ] T016 [US2] Implement Payment Details page in `src/app/[locale]/(dashboard)/finance/[id]/page.tsx`
- [ ] T017 [US2] Add "View Payment Details" link to existing Booking Details page in `src/app/[locale]/booking/[id]/page.tsx`

**Checkpoint**: User Story 2 is complete. Users can now navigate from lists to detailed timelines.

---

## Phase 5: User Story 3 - Refund Request Lifecycle (Priority: P2)

**Goal**: Enable Customers to request refunds for eligible bookings and track the refund status.

**Independent Test**: Initiate a refund request from a completed booking. Verify the request appears in the Refund Tracking page with an initial status of "Requested".

### Implementation for User Story 3

- [ ] T018 [P] [US3] Create `RefundRequestForm` component in `src/features/finance/components/RefundRequestForm.tsx` (connect to Dispute API)
- [ ] T019 [P] [US3] Create `RefundTrackingList` component in `src/features/finance/components/RefundTrackingList.tsx`
- [ ] T020 [US3] Implement Refund Tracking page in `src/app/[locale]/(dashboard)/finance/refunds/page.tsx`
- [ ] T021 [US3] Add "Request Refund" button to `DisputePanel.tsx` in `src/features/bookings/components/DisputePanel.tsx`

**Checkpoint**: User Story 3 is complete. The full refund lifecycle is now manageable from the frontend.

---

## Phase 6: User Story 4 - Provider Earnings Dashboard (Priority: P2)

**Goal**: Provide Providers with a summary of their total earnings, pending payments, and recent transactions.

**Independent Test**: Access the Provider Earnings page and verify that the KPI cards (Total Earnings, Pending) match the calculated backend data.

### Implementation for User Story 4

- [ ] T022 [P] [US4] Create `EarningsKpiCards` component in `src/features/finance/components/EarningsKpiCards.tsx`
- [ ] T023 [P] [US4] Create `RecentTransactionsList` component in `src/features/finance/components/RecentTransactionsList.tsx`
- [ ] T024 [US4] Implement Provider Earnings Dashboard in `src/app/[locale]/(provider)/earnings/page.tsx`
- [ ] T025 [US4] Update `ProviderDashboard` overview to include high-level earnings summary in `src/app/[locale]/(provider)/dashboard/page.tsx`

**Checkpoint**: All core user stories are complete.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Integration with notifications and final refinements.

- [ ] T026 [P] Integrate Payment/Refund notifications in `src/features/notifications/components/NotificationList.tsx`
- [ ] T027 [P] Implement TanStack Query cache invalidation for finance queries upon receiving WebSocket notifications
- [ ] T028 [P] Perform final API Audit and update `docs/payments-refunds-audit.md` as required by the feature objective
- [ ] T029 [P] Run cross-browser and RTL parity checks on all new finance pages
- [ ] T030 Final code cleanup, removal of any remaining mock data, and documentation update in `PROJECT_API_DOCUMENTATION.md` if necessary

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phases 3-6)**: All depend on Foundational phase completion. 
  - US1 (P1) is the MVP and should be completed first.
  - US2, US3, and US4 can proceed in parallel once US1 is stable.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### User Story Dependencies

- **US1**: Foundation for all payment lists.
- **US2**: Extends US1 with detailed views.
- **US3**: Depends on US2 for refund detail display but is otherwise independent.
- **US4**: Depends on the same foundation (T004, T005) but serves a different portal.

### Parallel Opportunities

- All Setup tasks (T001-T003) can run in parallel.
- Foundational service and hook implementations (T004-T006) can run in parallel.
- Once Foundation is done, US1 components (T008-T010) can be built in parallel.
- US4 (Provider Earnings) can be developed in parallel with US1 (Customer History) by different developers.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2 (Setup + Foundation).
2. Complete Phase 3 (US1 - Payment History).
3. **STOP and VALIDATE**: Verify that customers can see their real payment history.
4. Deploy the MVP increment.

### Incremental Delivery

1. Add US2 (Details & Timeline) to allow deeper inspection of transactions.
2. Add US3 (Refund Requests) to complete the transactional loop.
3. Add US4 (Provider Dashboards) to serve the provider segment.
4. Finalize with Notification integration and API Audit.

---

## Notes

- **API-First**: Ensure all DTOs and Statuses exactly match `PROJECT_API_DOCUMENTATION.md`.
- **RTL**: Use logical CSS properties for all new components to support Arabic layout.
- **Error Handling**: Use the global `ErrorBoundary` and provide "Retry" buttons for failed payment fetches.
- **Mock Data**: Do not leave any mock arrays in components; use TanStack Query `initialData` or `placeholderData` if needed for UX.
