# Tasks: Admin Dashboard Integration

**Input**: Design documents from `/specs/014-admin-dashboard-integration/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test tasks included - tests were not explicitly requested in the feature specification

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

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

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Feature initialization and basic structure

- [ ] T001 Create admin portal directory structure in `src/app/[locale]/(admin)/`
- [ ] T002 Create feature modules directory structure in `src/features/`
- [ ] T003 [P] Define Zod validation schemas in `src/features/[domain]/schemas/`
- [ ] T004 [P] Define TypeScript types in `src/features/[domain]/types/`
- [ ] T005 Configure admin-specific environment variables in `.env.local`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic and API integration that MUST be complete before ANY UI work

- [ ] T006 [P] Implement admin API service calls in `src/features/[domain]/services/api.ts`
- [ ] T007 [P] Implement TanStack Query hooks in `src/features/[domain]/hooks/`
- [ ] T008 [P] Implement permission guards and RBAC checks in `src/components/auth/PermissionGuard.tsx`
- [ ] T009 Configure admin-specific localized messages in `src/messages/` (ar.json, en.json)
- [ ] T010 Implement admin authentication middleware in `src/middleware.ts`

**Checkpoint**: Foundation ready - UI implementation can now begin in parallel

---

## Phase 3: User Story 1 - Admin Dashboard Overview Access (Priority: P1) 🎯 MVP

**Goal**: Provide administrators with dashboard access to view key platform metrics and system health at a glance

**Independent Test**: Verify that admin users can access the dashboard, see all required KPI cards display real data from backend APIs, and system health indicators show accurate status

### Implementation for User Story 1

- [ ] T011 [P] [US1] Create dashboard KPI components in `src/features/dashboard/components/`
- [ ] T012 [P] [US1] Create system health monitoring component in `src/features/dashboard/components/SystemHealth.tsx`
- [ ] T013 [P] [US1] Create recent activity feed component in `src/features/dashboard/components/RecentActivity.tsx`
- [ ] T014 [P] [US1] Create main dashboard page layout in `src/app/[locale]/(admin)/dashboard/page.tsx`
- [ ] T015 [US1] Implement dashboard analytics API hooks in `src/features/dashboard/hooks/useDashboardAnalytics.ts`
- [ ] T016 [US1] Add localized text and RTL layout verification for dashboard components
- [ ] T017 [US1] Add action logging for dashboard view activities in audit logs

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - User Management Operations (Priority: P1)

**Goal**: Provide administrators with comprehensive user management capabilities including viewing details, checking activity, and performing suspension/reactivation actions

**Independent Test**: Verify that admin users can search and view user details, see their booking history and activity summary, and perform suspend/reactivate actions that update the backend system

### Implementation for User Story 2

- [ ] T018 [P] [US2] Create user list components in `src/features/users/components/UserList.tsx` and `src/features/users/components/UserTable.tsx`
- [ ] T019 [P] [US2] Create user detail components in `src/features/users/components/UserDetail.tsx`
- [ ] T020 [P] [US2] Create user management action components in `src/features/users/components/UserActions.tsx`
- [ ] T021 [P] [US2] Create user pages in `src/app/[locale]/(admin)/users/` directory
- [ ] T022 [US2] implement user management API hooks in `src/features/users/hooks/useUsers.ts`
- [ ] T023 [US2] implement user detail API hooks in `src/features/users/hooks/useUserDetail.ts`
- [ ] T024 [US2] Add localized text and RTL layout verification for user components
- [ ] T025 [US2] Add action logging for user management operations in audit logs

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Provider Verification Workflow (Priority: P1)

**Goal**: Provide administrators with provider verification management capabilities including reviewing applications, viewing documents, and performing approval/rejection actions

**Independent Test**: Verify that administrators can access the verification queue, review submitted documents, and perform approval/rejection actions that update provider status

### Implementation for User Story 3

- [ ] T026 [P] [US3] Create verification queue components in `src/features/verification/components/VerificationQueue.tsx`
- [ ] T027 [P] [US3] Create verification detail components in `src/features/verification/components/VerificationDetail.tsx`
- [ ] T028 [P] [US3] Create document review components in `src/features/verification/components/DocumentReview.tsx`
- [ ] T029 [P] [US3] Create verification action components in `src/features/verification/components/VerificationActions.tsx`
- [ ] T030 [P] [US3] Create verification pages in `src/app/[locale]/(admin)/verification/` directory
- [ ] T031 [US3] implement verification API hooks in `src/features/verification/hooks/useVerification.ts`
- [ ] T032 [US3] implement verification detail API hooks in `src/features/verification/hooks/useVerificationDetail.ts`
- [ ] T033 [US3] Add localized text and RTL layout verification for verification components
- [ ] T034 [US3] Add action logging for verification operations in audit logs

**Checkpoint**: All P1 user stories should now be independently functional

---

## Phase 6: User Story 4 - Analytics and Reporting (Priority: P2)

**Goal**: Provide administrators with comprehensive analytics and reporting capabilities covering revenue, users, providers, bookings, and reviews

**Independent Test**: Verify that all analytics sections display real data from backend APIs, charts render correctly, and reports can be exported in various formats

### Implementation for User Story 4

- [ ] T035 [P] [US4] Create analytics overview components in `src/features/analytics/components/AnalyticsOverview.tsx`
- [ ] T036 [P] [US4] Create revenue analytics components in `src/features/analytics/components/RevenueAnalytics.tsx`
- [ ] T037 [P] [US4] Create user analytics components in `src/features/analytics/components/UserAnalytics.tsx`
- [ ] T038 [P] [US4] Create provider analytics components in `src/features/analytics/components/ProviderAnalytics.tsx`
- [ ] T039 [P] [US4] Create booking analytics components in `src/features/analytics/components/BookingAnalytics.tsx`
- [ ] T040 [P] [US4] Create review analytics components in `src/features/analytics/components/ReviewAnalytics.tsx`
- [ ] T041 [US4] Create analytics pages in `src/app/[locale]/(admin)/analytics/` directory
- [ ] T042 [US4] implement analytics API hooks in `src/features/analytics/hooks/useAnalytics.ts`
- [ ] T043 [US4] implement revenue analytics API hooks in `src/features/analytics/hooks/useRevenueAnalytics.ts`
- [ ] T044 [US4] implement report export functionality in `src/features/analytics/services/reportService.ts`
- [ ] T045 [US4] Add localized text and RTL layout verification for analytics components
- [ ] T046 [US4] Add action logging for analytics operations in audit logs

**Checkpoint**: At this point, User Stories 1, 2, 3, and 4 should all work independently

---

## Phase 7: User Story 5 - Support and Dispute Management (Priority: P2)

**Goal**: Provide administrators with support ticket and dispute management capabilities including viewing conversations, updating statuses, and resolving issues

**Independent Test**: Verify that administrators can view ticket details, see conversation histories, update ticket statuses, and perform resolution actions

### Implementation for User Story 5

- [ ] T047 [P] [US5] Create support ticket list components in `src/features/support/components/TicketList.tsx`
- [ ] T048 [P] [US5] Create ticket detail components in `src/features/support/components/TicketDetail.tsx`
- [ ] T049 [P] [US5] Create conversation components in `src/features/support/components/Conversation.tsx`
- [ ] T050 [P] [US5] Create dispute list components in `src/features/support/components/DisputeList.tsx`
- [ ] T051 [P] [US5] Create dispute detail components in `src/features/support/components/DisputeDetail.tsx`
- [ ] T052 [P] [US5] Create support pages in `src/app/[locale]/(admin)/support/` directory
- [ ] T053 [US5] implement support API hooks in `src/features/support/hooks/useSupport.ts`
- [ ] T054 [US5] implement dispute API hooks in `src/features/support/hooks/useDisputes.ts`
- [ ] T055 [US5] Add localized text and RTL layout verification for support components
- [ ] T056 [US5] Add action logging for support operations in audit logs

**Checkpoint**: At this point, User Stories 1, 2, 3, 4, and 5 should all work independently

---

## Phase 8: User Story 6 - Financial Operations Management (Priority: P3)

**Goal**: Provide administrators with payment and refund management capabilities including viewing transaction details, processing refunds, and monitoring financial health

**Independent Test**: Verify that administrators can view payment details, process refunds, and see comprehensive financial dashboards with real transaction data

### Implementation for User Story 6

- [ ] T057 [P] [US6] Create payments dashboard components in `src/features/finance/components/PaymentsDashboard.tsx`
- [ ] T058 [P] [US6] Create payment list components in `src/features/finance/components/PaymentList.tsx`
- [ ] T059 [P] [US6] Create payment detail components in `src/features/finance/components/PaymentDetail.tsx`
- [ ] T060 [P] [US6] Create refund list components in `src/features/finance/components/RefundList.tsx`
- [ ] T061 [P] [US6] Create refund detail components in `src/features/finance/components/RefundDetail.tsx`
- [ ] T062 [P] [US6] Create financial report components in `src/features/finance/components/FinancialReports.tsx`
- [ ] T063 [P] [US6] Create finance pages in `src/app/[locale]/(admin)/finance/` directory
- [ ] T064 [US6] implement payment API hooks in `src/features/finance/hooks/usePayments.ts`
- [ ] T065 [US6] implement refund API hooks in `src/features/finance/hooks/useRefunds.ts`
- [ ] T066 [US6] implement financial analytics API hooks in `src/features/finance/hooks/useFinancialAnalytics.ts`
- [ ] T067 [US6] Add localized text and RTL layout verification for finance components
- [ ] T068 [US6] Add action logging for financial operations in audit logs

**Checkpoint**: All user stories should now be independently functional

---

## Phase 9: Additional Admin Modules

**Purpose**: Complete remaining admin functionality for full platform management

- [ ] T069 [P] Create review management components in `src/features/reviews/components/ReviewManagement.tsx`
- [ ] T070 [P] Create review moderation components in `src/features/reviews/components/ReviewModeration.tsx`
- [ ] T071 [P] Create audit log components in `src/features/audit/components/AuditLogs.tsx`
- [ ] T072 [P] Create notification center components in `src/features/notifications/components/NotificationCenter.tsx`
- [ ] T073 [P] Create announcement management components in `src/features/notifications/components/Announcements.tsx`
- [ ] T074 [P] Create admin settings components in `src/app/[locale]/(admin)/settings/page.tsx`
- [ ] T075 [P] Create provider management components in `src/features/providers/components/ProviderManagement.tsx`
- [ ] T076 [P] Create provider verification components in `src/features/providers/components/ProviderVerification.tsx`

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T077 [P] [I18N] Implement Arabic (RTL) and English translations for all admin components
- [ ] T078 [P] [OBS] Add structured logging and error tracking context for all admin operations
- [ ] T079 [P] Documentation updates in admin documentation
- [ ] T080 Code cleanup and refactoring across all modules
- [ ] T081 Performance optimization across all admin components
- [ ] T082 [P] Additional unit tests for critical admin functionality in tests/unit/
- [ ] T083 Security hardening for admin operations
- [ ] T084 Run quickstart.md validation
- [ ] T085 Test complete admin dashboard integration and end-to-end workflows

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Additional Modules (Phase 9)**: Can start after Foundational phase, depends on related user stories
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 6 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Core implementation before integration
- Story complete before moving to next priority
- Each story should be independently testable

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members
- Components within a user story marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: "Create dashboard KPI components in src/features/dashboard/components/"
Task: "Create system health monitoring component in src/features/dashboard/components/SystemHealth.tsx"
Task: "Create recent activity feed component in src/features/dashboard/components/RecentActivity.tsx"
Task: "Create main dashboard page layout in src/app/[locale]/(admin)/dashboard/page.tsx"
```

---

## Parallel Example: User Story 2

```bash
# Launch all components for User Story 2 together:
Task: "Create user list components in src/features/users/components/UserList.tsx"
Task: "Create user detail components in src/features/users/components/UserDetail.tsx"
Task: "Create user management action components in src/features/users/components/UserActions.tsx"
Task: "Create user pages in src/app/[locale]/(admin)/users/ directory"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Add User Story 6 → Test independently → Deploy/Demo
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Dashboard Overview)
   - Developer B: User Story 2 (User Management)
   - Developer C: User Story 3 (Provider Verification)
3. Stories complete and integrate independently
4. Add remaining stories as needed

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify no test failures after implementation
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Total task count: 85 tasks across all phases