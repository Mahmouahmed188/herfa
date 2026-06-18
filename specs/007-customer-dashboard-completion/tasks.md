---

description: "Task list for Customer Dashboard Completion feature"
---

# Tasks: Customer Dashboard Completion

**Input**: Design documents from `specs/007-customer-dashboard-completion/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test tasks are included (tests were not requested in the feature specification).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Features**: `src/features/[feature-name]/`
  - `components/`, `hooks/`, `services/`, `types/`, `schemas/`
- **Routes**: `src/app/[locale]/`
- **Shared UI**: `src/components/ui/`
- **State/Hooks**: `src/stores/`, `src/hooks/`
- **Lib/Utils**: `src/lib/`, `src/utils/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Feature initialization and basic structure for the addresses module

- [X] T001 Create feature directory structure at `src/features/addresses/` with components/, hooks/, services/, types/, schemas/ subdirectories
- [X] T002 [P] Define Address Zod validation schemas in `src/features/addresses/schemas/validation.ts`
- [X] T003 [P] Define TypeScript Address type in `src/features/addresses/types/index.ts`
- [X] T004 [P] Add CustomerNotification type in `src/features/notifications/types/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic and API integration that MUST be complete before ANY UI work

- [X] T005 Implement Address CRUD API service at `src/features/addresses/services/api.ts` (GET /addresses, POST /addresses, PATCH /addresses/{id}, DELETE /addresses/{id}, PATCH /addresses/{id}/default)
- [X] T006 [P] Implement address TanStack Query hooks at `src/features/addresses/hooks/useAddresses.ts` (useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress, useSetDefaultAddress)
- [X] T007 [P] Implement customer notification TanStack Query hooks at `src/features/notifications/hooks/useCustomerNotifications.ts` (useCustomerNotifications, useUnreadCount, useMarkAsRead)
- [X] T008 [P] Add i18n message keys for addresses, notifications, and booking sections in `src/messages/en.json` and `src/messages/ar.json`

**Checkpoint**: Foundation ready — UI implementation can now begin in parallel

---

## Phase 3: User Story 1 — View Customer Dashboard with Real Data (Priority: P1) 🎯 MVP

**Goal**: Replace all mock/hardcoded data on the customer dashboard with live backend API responses. Remove saved technicians, hardcoded notifications, and hardcoded wallet balance. Display real booking stats.

**Independent Test**: Log in as a customer with known bookings; verify the dashboard shows matching active/pending/completed counts and real profile name, and that no placeholder mock data appears.

### Implementation for User Story 1

- [X] T009 [P] [US1] Create `useDashboardStats` hook in `src/features/client/hooks/useDashboardStats.ts` that fetches `/jobs/my-jobs` and computes active/pending/completed counts
- [X] T010 [P] [US1] Create `ProfileSummary` component in `src/features/client/components/ProfileSummary.tsx` to display user name, email, avatar from `useAuthStore`
- [X] T011 [US1] Update `src/app/[locale]/client/dashboard/page.tsx`:
  - Remove `savedTechnicians` hardcoded array and replace with API-driven data or remove the section
  - Remove `notifications` hardcoded array and replace with live unread count from notification API
  - Replace `$0.00` hardcoded balance with real data (or remove the card if wallet API unavailable)
  - Add pending count card alongside active/completed
  - Use `useDashboardStats` hook for all stats
- [X] T012 [US1] Add loading skeleton and empty state for all dashboard data-driven sections

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Dashboard shows only real data.

---

## Phase 4: User Story 2 — Browse and Filter Booking History (Priority: P1)

**Goal**: Enhance the jobs page with pagination controls, status filter, date sorting, and a detail page showing provider + payment info.

**Independent Test**: A customer with 20+ bookings across different statuses can paginate, filter by status, sort by date, and click into a booking to see provider and payment details.

### Implementation for User Story 2

- [X] T013 [P] [US2] Create booking TypeScript types in `src/features/bookings/types/index.ts` (CustomerBooking with provider, payment, tracking fields)
- [X] T014 [P] [US2] Create booking Zod schemas in `src/features/bookings/schemas/validation.ts`
- [X] T015 [P] [US2] Create `useCustomerBookings` hook in `src/features/bookings/hooks/useCustomerBookings.ts` with pagination, status filter, and sort support
- [X] T016 [P] [US2] Create `BookingCard` component in `src/features/bookings/components/BookingCard.tsx`
- [X] T017 [P] [US2] Create `BookingFilters` component in `src/features/bookings/components/BookingFilters.tsx` (status dropdown, sort toggle, page size selector)
- [X] T018 [P] [US2] Create `BookingPagination` component in `src/features/bookings/components/BookingPagination.tsx`
- [X] T019 [US2] Update `src/app/[locale]/client/jobs/page.tsx` to use `useCustomerBookings`, `BookingFilters`, `BookingPagination`, and `BookingCard`
- [X] T020 [US2] Create booking detail page at `src/app/[locale]/client/jobs/[id]/page.tsx` showing provider info, payment data, and timeline
- [X] T021 [US2] Create `useBookingDetail` hook in `src/features/bookings/hooks/useBookingDetail.ts` that fetches `/jobs/{id}` with the full response

**Checkpoint**: At this point, User Story 2 should work independently. Customers can browse, filter, sort, and view details.

---

## Phase 5: User Story 3 — Manage Notifications (Priority: P2)

**Goal**: Create a notifications center page where customers see real notifications from the backend, mark them as read, and see an unread count. Remove the hardcoded notification from the dashboard.

**Independent Test**: Trigger a booking status change (backend); verify the notification appears in the center with unread styling, mark it as read, and confirm the count updates.

### Implementation for User Story 3

- [X] T022 [P] [US3] Create customer notification types and schemas in `src/features/notifications/types/index.ts` and `src/features/notifications/schemas/validation.ts`
- [X] T023 [P] [US3] Create `CustomerNotificationList` component in `src/features/notifications/components/CustomerNotificationList.tsx`
- [X] T024 [P] [US3] Create `NotificationCard` component in `src/features/notifications/components/NotificationCard.tsx` with mark-as-read button and visual distinction for unread
- [X] T025 [US3] Create notifications center page at `src/app/[locale]/client/notifications/page.tsx` using `useCustomerNotifications` and the notification components
- [X] T026 [US3] Add notification badge/unread count indicator in the customer header or sidebar (from `getUnreadNotificationsCount` API)

**Checkpoint**: At this point, User Story 3 should work independently. Customer can view, read, and manage notifications.

---

## Phase 6: User Story 4 — Manage Saved Addresses (Priority: P2)

**Goal**: Create a full address management module with CRUD operations, form validation, default address selection, and integration into the booking creation flow.

**Independent Test**: Add a new address, verify it appears in the list, edit it, set it as default, then verify it's pre-selected in the create-job form.

### Implementation for User Story 4

- [X] T027 [P] [US4] Create `AddressForm` component in `src/features/addresses/components/AddressForm.tsx` using React Hook Form + Zod resolver, with fields: label, street, building, city, area, isDefault, phone, additionalInstructions
- [X] T028 [P] [US4] Create `AddressCard` component in `src/features/addresses/components/AddressCard.tsx` with edit/delete/set-default actions
- [X] T029 [P] [US4] Create `AddressList` component in `src/features/addresses/components/AddressList.tsx` that renders `AddressCard` items and handles empty state
- [X] T030 [US4] Create address management page at `src/app/[locale]/client/addresses/page.tsx` with the address list and add/edit dialogs
- [X] T031 [US4] Create `useAddressForm` hook in `src/features/addresses/hooks/useAddressForm.ts` using React Hook Form + `zodResolver`
- [X] T032 [US4] Update `src/app/[locale]/client/create-job/page.tsx` to integrate saved address selection (dropdown/radio list from `useAddresses`) instead of a plain text address field

**Checkpoint**: At this point, User Story 4 should work independently. Address full CRUD and integration into booking flow.

---

## Phase 7: User Story 5 — View Active Bookings with Tracking (Priority: P3)

**Goal**: Enhance the dashboard's active orders section to show provider assignment, latest activity, tracking availability, and estimated arrival time.

**Independent Test**: Create a booking assigned to a provider; verify the dashboard active orders section shows the provider name, status, and tracking indicator.

### Implementation for User Story 5

- [X] T033 [P] [US5] Create `ActiveBookingCard` component in `src/features/bookings/components/ActiveBookingCard.tsx` showing provider info, status badge, tracking indicator, and ETA
- [X] T034 [P] [US5] Create `ActiveBookingList` component in `src/features/bookings/components/ActiveBookingList.tsx` that groups by ongoing/upcoming/pending
- [X] T035 [US5] Create `useActiveBookings` hook in `src/features/bookings/hooks/useActiveBookings.ts` that fetches `/jobs/my-jobs` and filters for active statuses
- [X] T036 [US5] Update the active orders section in `src/app/[locale]/client/dashboard/page.tsx` to use `ActiveBookingList` and `ActiveBookingCard` instead of the inline map
- [X] T037 [US5] Add tracking indicator UI (icon + ETA text) to active bookings that have tracking available

**Checkpoint**: User Story 5 functional. Active orders show provider, tracking, and grouped statuses.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Audit, cleanup, and final validation across all stories

- [X] T038 [P] Generate comprehensive API audit report at `docs/customer-dashboard-audit.md` documenting coverage for dashboard, bookings, notifications, addresses, missing integrations, and API/DTO mismatches
- [X] T039 [P] Run `npm run lint` and fix all linting errors in modified files
- [X] T040 [P] Run `npm run type-check` and fix all TypeScript errors
- [X] T041 Verify zero hardcoded/mock customer data remains across all customer-facing pages (`/client/*`)
- [X] T042 Run `npm test` and ensure all tests pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phases 3-7)**: All depend on Foundational phase completion
  - US1 (Phase 3) and US2 (Phase 4) can proceed in parallel (P1 priority)
  - US3 (Phase 5) and US4 (Phase 6) can proceed in parallel (P2 priority)
  - US5 (Phase 7) should be done after US1 as it reworks the same dashboard page
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories — independent
- **User Story 2 (P1)**: No dependencies on other stories — independent
- **User Story 3 (P2)**: No dependencies on other stories — independent
- **User Story 4 (P2)**: No dependencies on other stories — independent
- **User Story 5 (P3)**: Modifies dashboard (US1 output) — should follow US1

### Within Each User Story

- Types before schemas before services before hooks before components
- API service before hooks before UI
- Each story should be independently testable after completion

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- US1 and US2 can run in parallel (different files, P1 priority)
- US3 and US4 can run in parallel (different files, P2 priority)
- Within each story, [P] tasks can run in parallel

---

## Parallel Example: User Story 1

```bash
Task: "Create useDashboardStats hook in src/features/client/hooks/useDashboardStats.ts"
Task: "Create ProfileSummary component in src/features/client/components/ProfileSummary.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "Create booking types in src/features/bookings/types/index.ts"
Task: "Create useCustomerBookings hook in src/features/bookings/hooks/useCustomerBookings.ts"
Task: "Create BookingFilters component in src/features/bookings/components/BookingFilters.tsx"
```

## Parallel Example: User Story 4

```bash
Task: "Create AddressForm component in src/features/addresses/components/AddressForm.tsx"
Task: "Create useAddressForm hook in src/features/addresses/hooks/useAddressForm.ts"
Task: "Create AddressCard component in src/features/addresses/components/AddressCard.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Dashboard)
4. Complete Phase 4: User Story 2 (Booking History)
5. **STOP and VALIDATE**: Both P1 stories independently testable
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Address API + Notification hooks ready
2. Add US1 (Dashboard) → Test independently → Deploy (MVP!)
3. Add US2 (Booking History) → Test independently → Deploy
4. Add US3 (Notifications) → Test independently → Deploy
5. Add US4 (Addresses) → Test independently → Deploy
6. Add US5 (Active Bookings) → Test independently → Deploy
7. Generate audit report → Polish

### Parallel Team Strategy

With multiple developers:
1. Team completes Setup + Foundational together
2. Developer A: US1 (Dashboard)
3. Developer B: US2 (Booking History)
4. Developer C: US3 (Notifications) + US4 (Addresses)
5. Developer D: US5 (Active Bookings)
6. Stories integrate independently — dashboard page changes (US1, US5) need coordination on the same file

---

## Summary

| Category | Count |
|---|---|
| **Total Tasks** | 42 |
| **Phase 1 (Setup)** | 4 |
| **Phase 2 (Foundational)** | 4 |
| **Phase 3 (US1 — Dashboard)** | 4 |
| **Phase 4 (US2 — Booking History)** | 9 |
| **Phase 5 (US3 — Notifications)** | 5 |
| **Phase 6 (US4 — Addresses)** | 6 |
| **Phase 7 (US5 — Active Bookings)** | 5 |
| **Phase 8 (Polish)** | 5 |
| **Parallelizable** | 24 tasks marked [P] |
| **Independent Stories** | US1, US2, US3, US4 (all independent); US5 depends on US1 |
| **Suggested MVP** | US1 + US2 (both P1) |

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
