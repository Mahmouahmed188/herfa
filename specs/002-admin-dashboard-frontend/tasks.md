# Tasks: Herfa Admin Dashboard Frontend

**Input**: Design documents from `specs/002-admin-dashboard-frontend/`

**Prerequisites**: plan.md (required), spec.md (required)

**Organization**: Tasks are grouped by phase, covering foundation, core modules, shared systems, and cross-cutting concerns (Security, Performance, Testing).

## Phase 1: Setup (Frontend Foundation)
**Purpose**: Initialize the project structure and shared infrastructure for the Admin Dashboard.

- [x] T001 Create feature directory structure in `src/features/` (auth, dashboard, users, providers, bookings, finance, support, notifications, cms, analytics, audit, settings)
- [x] T002 Configure route groups for localized app structure in `src/app/[locale]/(auth)` and `src/app/[locale]/(dashboard)`
- [x] T003 [P] Initialize Axios client with interceptors for token handling and error normalization in `src/lib/axios.ts`
- [x] T004 [P] Setup TanStack Query provider and default options in `src/lib/react-query.ts`
- [x] T005 [P] Setup Zustand global UI store for sidebar and theme state in `src/stores/useUIStore.ts`
- [x] T006 [P] Configure `next-intl` and `i18next` for RTL/LTR support in `src/i18n/`
- [x] T007 [P] Configure `next-themes` for Dark/Light mode support in `src/components/providers.tsx`
- [x] T008 [P] Setup `sonner` toast notifications provider in `src/components/providers.tsx`
- [x] T009 Define global TypeScript interfaces for API responses and error states in `src/types/api.d.ts`
- [x] T010 Implement Error Boundaries and generic Loading/Suspense components in `src/components/common/`

---

## Phase 2: Foundational (Shared Components & Security)
**Purpose**: Build the reusable UI system and core security architecture.

- [x] T011 [P] Implement Data Table system with server-side pagination/sorting in `src/components/ui/data-table.tsx`
- [x] T012 [P] Implement advanced filter and search components in `src/components/ui/filters/`
- [x] T013 [P] Create reusable Form components (Input, Select, Checkbox) with `react-hook-form` integration in `src/components/ui/forms/`
- [x] T014 [P] Implement `PermissionGuard` component for action-level RBAC in `src/components/auth/PermissionGuard.tsx`
- [x] T015 [P] Setup Next.js Middleware for route protection and locale redirection in `src/middleware.ts`
- [x] T016 [P] Implement Secure Token Handling (Cookies vs LocalStorage) and Session Expiration logic in `src/features/auth/services/session.ts`
- [x] T017 [P] Create reusable Modal and Drawer components with accessibility support in `src/components/ui/feedback/`
- [ ] T018 [P] Setup Charting infrastructure using a charting library compatible with Next.js in `src/components/ui/charts/`

---

## Phase 3: User Story 1 — Provider Verification (Priority: P1)
**Goal**: Enable Admins to review and verify service provider documents.
**Independent Test**: Navigate to `/providers/verification`, approve a provider, and verify their status updates.

- [x] T019 [P] [US1] Define Provider verification Zod schemas in `src/features/providers/schemas/verification.ts`
- [x] T020 [P] [US1] Implement Provider API service for verification in `src/features/providers/services/api.ts`
- [x] T021 [P] [US1] Create TanStack Query hooks for verification queue in `src/features/providers/hooks/useVerification.ts`
- [x] T022 [US1] Implement Verification Queue table in `src/features/providers/components/VerificationQueue.tsx`
- [x] T023 [US1] Build side-by-side Document Viewer component in `src/features/providers/components/DocumentViewer.tsx`
- [x] T024 [US1] Implement Approval/Rejection workflow with feedback forms in `src/features/providers/components/VerificationActions.tsx`
- [x] T025 [US1] Create Verification details page in `src/app/[locale]/(dashboard)/providers/verification/[id]/page.tsx`

---

## Phase 4: Module — Authentication
**Purpose**: Implement the full authentication suite and role-aware navigation.

- [x] T026 [P] Implement Login Page with MFA support in `src/app/[locale]/(auth)/login/page.tsx`
- [x] T027 [P] Build Forgot/Reset Password flows in `src/app/[locale]/(auth)/password/`
- [x] T028 [P] Implement Auth Zustand store for user session and roles in `src/features/auth/stores/useAuthStore.ts`
- [x] T029 Implement Sidebar navigation with role-based visibility in `src/components/layout/Sidebar.tsx`
- [x] T030 Build "Access Denied" and "Unauthorized" fallback screens in `src/components/common/error-pages/`

---

## Phase 5: User Story 2 — Payout Processing (Priority: P2)
**Goal**: Enable Finance Managers to process pending payout requests.
**Independent Test**: Filter for pending payouts, click process, and verify status change to "Processing".

- [x] T031 [P] [US2] Define Payout Zod schemas in `src/features/finance/schemas/payouts.ts`
- [x] T032 [P] [US2] Implement Finance API service for payouts in `src/features/finance/services/api.ts`
- [x] T033 [P] [US2] Create TanStack Query hooks for payout requests in `src/features/finance/hooks/usePayouts.ts`
- [x] T034 [US2] Implement Payout Requests table with status filters in `src/features/finance/components/PayoutTable.tsx`
- [x] T035 [US2] Build Bulk Payout action component in `src/features/finance/components/BulkPayoutActions.tsx`
- [x] T036 [US2] Create Finance Dashboard overview with revenue charts in `src/app/[locale]/(dashboard)/finance/page.tsx`

---

## Phase 6: User Story 3 — Dispute Resolution (Priority: P1)
**Goal**: Enable Support Agents to resolve booking disputes.
**Independent Test**: Open a disputed booking, view timeline, and select a resolution (Refund/Release).

- [x] T037 [P] [US3] Implement Booking service for disputes in `src/features/bookings/services/api.ts`
- [x] T038 [P] [US3] Create Booking Timeline component in `src/features/bookings/components/BookingTimeline.tsx`
- [x] T039 [US3] Implement Dispute Resolution panel with Refund/Release actions in `src/features/bookings/components/DisputePanel.tsx`
- [x] T040 [US3] Create Booking Details page with full history in `src/app/[locale]/(dashboard)/bookings/[id]/page.tsx`

---

## Phase 7: Module — Dashboard Overview
**Purpose**: Executive dashboard with real-time KPIs and system health.

- [ ] T041 [P] Build KPI Cards component with trend indicators in `src/features/dashboard/components/KPICards.tsx`
- [ ] T042 [P] Implement Revenue and Booking overview charts in `src/features/dashboard/components/DashboardCharts.tsx`
- [ ] T043 [P] Build Recent Activity widget in `src/features/dashboard/components/RecentActivity.tsx`
- [x] T044 Create main Executive Dashboard layout in `src/app/[locale]/(dashboard)/page.tsx`

---

## Phase 8: Module — User & Provider Management
**Purpose**: Lifecycle management for customers and service providers.

- [ ] T045 [P] Implement User/Provider list tables with advanced search/filters in `src/features/users/components/` and `src/features/providers/components/`
- [ ] T046 [P] Build Profile Detail views with activity history timelines
- [ ] T047 [P] Implement Suspension/Activation workflows with reason field audit
- [ ] T048 Implement Bulk User/Provider actions (Export, Status Change)

---

## Phase 9: Module — Support & Moderation
**Purpose**: Ticket management and content moderation.

- [ ] T049 [P] Build Support Ticket list with assignment and escalation flows in `src/features/support/components/`
- [ ] T050 [P] Implement Review Moderation interface in `src/features/support/components/ReviewModerator.tsx`
- [ ] T051 [P] Build Content Moderation tools for platform-wide monitoring

---

## Phase 10: Module — CMS & Notifications
**Purpose**: Platform content management and broadcasting.

- [ ] T052 [P] Implement CRUD interfaces for Categories and Services in `src/features/cms/components/`
- [ ] T053 [P] Build Banner Management with scheduling and priority in `src/features/cms/components/BannerManager.tsx`
- [ ] T054 [P] Implement Notification Broadcast interface for Push, SMS, and Email in `src/features/notifications/components/`
- [ ] T055 Build Notification Template editor with placeholder support in `src/features/notifications/components/TemplateEditor.tsx`

---

## Phase 11: Module — Audit, Analytics & Settings
**Purpose**: Compliance, advanced reporting, and system configuration.

- [ ] T056 [P] Implement Audit Log timeline with search and filtering in `src/features/audit/components/AuditLog.tsx`
- [ ] T057 [P] Build Advanced Analytics dashboard with conversion and retention reports in `src/features/analytics/`
- [ ] T058 [P] Implement Platform Settings forms (Commission, Localizations, Security) in `src/features/settings/`
- [ ] T059 [P] Build Feature Flags management interface in `src/features/settings/components/FeatureFlags.tsx`

---

## Phase 12: Polish & Optimization
**Purpose**: Performance tuning, bundle optimization, and final refinements.

- [ ] T060 [P] Implement dynamic imports and route-based code splitting for heavy modules
- [ ] T061 [P] Optimize TanStack Query cache strategy and prefetching for dashboards
- [ ] T062 [P] Implement virtualization for large data tables using `tanstack-virtual`
- [ ] T063 [P] Verify WCAG 2.2 AA accessibility compliance across all core screens

---

## Phase 13: Testing
**Purpose**: Ensure production readiness and behavioral correctness.

- [ ] T064 [P] Implement unit tests for Zod schemas and utility functions in `tests/unit/`
- [ ] T065 [P] Implement component tests for shared UI primitives in `tests/components/`
- [ ] T066 [P] Implement integration tests for Auth and Payout flows in `tests/integration/`
- [ ] T067 Build E2E tests for critical user journeys (Verification, Dispute, Auth) in `tests/e2e/`

---

## Dependencies & Execution Order

1. **Setup (Phase 1)** MUST be completed first to provide the architecture.
2. **Foundational (Phase 2)** MUST be completed next to provide the UI system and security.
3. **User Stories (Phases 3, 5, 6)** can proceed in parallel once the foundation is ready.
4. **Modules (Phases 4, 7-11)** can be worked on concurrently by different feature teams.
5. **Polish & Testing** are cross-cutting and should be finalized after feature completion.

## Parallel Opportunities
- All tasks marked **[P]** within a phase can be executed in parallel if no file conflicts exist.
- Phase 3, 4, 5, and 6 are largely independent and can be staffed by separate developers.
- Shared components (Phase 2) and Security (Phase 2) can be split.

## Implementation Strategy
- **MVP**: Focus on Phase 1, 2, 4 (Auth), and Phase 3 (Provider Verification) to establish the core operational loop.
- **Incremental**: Deliver the Financial module (Phase 5) and Support (Phase 6) as the second wave of value.
- **Enterprise**: Finalize Analytics, Audit, and Advanced Settings in the final stages.
