# Tasks: Herfa Platform Implementation

**Input**: Design documents from `specs/001-herfa-platform/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included as per technical standards and enterprise requirements.

**Organization**: Tasks are grouped by setup, foundation, and user stories to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Monorepo initialization and basic structure

- [ ] T001 Initialize Turborepo monorepo structure in root
- [ ] T002 Setup `apps/api` (NestJS), `apps/web` (Next.js), `apps/mobile` (React Native), `apps/admin` (Next.js)
- [ ] T003 Setup `packages/common` for shared Zod schemas and TypeScript types
- [ ] T004 Setup `packages/ui` for shared Tailwind + Shadcn/UI components
- [ ] T005 [P] Configure root ESLint, Prettier, and TypeScript base configs in `packages/config`
- [ ] T006 Configure `next-intl` for Arabic (RTL) and English (LTR) in `apps/web` and `apps/admin`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and base models

- [ ] T007 Setup MongoDB connection and Mongoose configuration in `apps/api`
- [ ] T008 [P] Implement User, Profile, and ProviderDetail models in `apps/api/src/models`
- [ ] T009 [P] Implement JWT Auth with Refresh Token rotation in `apps/api/src/auth`
- [ ] T010 [P] Implement RBAC guards (Customer, Provider, Admin) in `apps/api/src/common/guards`
- [ ] T011 [P] Configure Cloudinary client for file uploads in `apps/api/src/storage`
- [ ] T012 Configure Socket.IO gateway for real-time features in `apps/api/src/gateways`
- [ ] T013 Setup Firebase Admin SDK for FCM notifications in `apps/api/src/notifications`
- [ ] T013.1 [P] Integrate Twilio for SMS fallback notifications in `apps/api/src/notifications/sms`
- [ ] T013.2 [P] Integrate SendGrid for Email fallback notifications in `apps/api/src/notifications/email`

---

## Phase 3: User Story 1 - Customer Books a Service (Priority: P1) 🎯 MVP

**Goal**: Allow customers to find and book service providers.

**Independent Test**: Create a booking via Web/Mobile and verify it appears in the API and Provider feed.

### Implementation for User Story 1

- [ ] T014 [P] [US1] Create Booking model and schema in `packages/common/schemas/booking.ts`
- [ ] T015 [US1] Implement Booking Controller and Service in `apps/api/src/bookings`
- [ ] T016 [P] [US1] Create Service Search and Booking Form components in `packages/ui/components/booking`
- [ ] T017 [US1] Implement Booking creation flow in `apps/web/src/app/[locale]/booking`
- [ ] T018 [US1] Integrate Socket.IO for real-time booking status updates in `apps/web`
- [ ] T019 [US1] Add Zod validation to Booking form and API endpoint

**Checkpoint**: User Story 1 (Booking) is functional and testable independently.

---

## Phase 4: User Story 2 - Provider Completes a Job (Priority: P1)

**Goal**: Enable providers to accept, track, and complete jobs for payment.

**Independent Test**: Transition a booking to "Completed" and verify wallet update.

### Implementation for User Story 2

- [ ] T020 [P] [US2] Implement Provider Dashboard UI in `apps/mobile/src/screens/dashboard`
- [ ] T021 [US2] Implement "Accept/Reject" booking logic in `apps/api/src/bookings`
- [ ] T022 [US2] Implement real-time location tracking (GeoJSON) updates in `apps/mobile`
- [ ] T023 [US2] Implement Wallet and Transaction models in `apps/api/src/models/wallet.ts`
- [ ] T024 [US2] Implement Stripe integration for provider payouts in `apps/api/src/payments`
- [ ] T025 [US2] Implement "Complete Job" workflow with automated commission calculation

**Checkpoint**: User Story 2 (Provider Lifecycle) is functional and integrates with US1.

---

## Phase 5: User Story 3 - Admin Resolves a Dispute (Priority: P2)

**Goal**: Provide tools for admins to moderate disputes and manage users.

**Independent Test**: Flag a booking as "Disputed" and resolve it via Admin Dashboard.

### Implementation for User Story 3

- [ ] T026 [P] [US3] Implement Admin Dashboard layout and User management in `apps/admin`
- [ ] T027 [US3] Implement Dispute model and status transitions in `apps/api/src/models/dispute.ts`
- [ ] T028 Create Dispute Moderation UI in `apps/admin/src/app/[locale]/disputes`
- [ ] T028.1 [US3] Implement Provider Document Approval/Rejection workflow in `apps/admin`
- [ ] T029 [US3] Implement Chat log viewer for disputed bookings in `apps/admin`
- [ ] T030 [US3] Implement refund logic via Stripe in `apps/api/src/payments/refund`

**Checkpoint**: User Story 3 (Admin/Dispute) is functional across the platform.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements and global standards

- [ ] T031 [P] [I18N] Implement full RTL/LTR parity for all screens in `apps/web` and `apps/mobile`
- [ ] T032 [P] [OBS] Add structured logging (Pino) and Sentry error tracking to all apps
- [ ] T033 [P] Add SEO metadata and OpenGraph tags to `apps/web`
- [ ] T034 [P] Implement Skeleton loaders and optimistic UI updates for Chat and Booking
- [ ] T035 [P] Conduct security audit: JWT rotation, RBAC check, and Zod sanitization
- [ ] T035.1 [P] Conduct Socket Load Test (10k concurrent) using Artillery in `tests/load`
- [ ] T036 Run Playwright and Detox E2E tests for the "Happy Path" booking flow

---

## Dependencies & Execution Order

1. **Setup (Phase 1)** -> **Foundational (Phase 2)**: Mandatory sequence for project backbone.
2. **Phase 2** -> **User Story 1 (US1)**: API and Auth must exist before booking.
3. **US1** -> **User Story 2 (US2)**: Bookings must be creatable before they can be accepted.
4. **US1/US2** -> **User Story 3 (US3)**: Disputes require existing bookings and chat history.
5. **Phase N** can run in parallel with US3 or as a final hardening phase.

---

## Implementation Strategy

### MVP First
1. Complete Phase 1 & 2 (Foundational Infrastructure).
2. Complete Phase 3 (User Story 1 - Customer Booking).
3. Validate US1 with manual API tests.

### Incremental Delivery
1. Add Phase 4 (Provider Workflow) -> Platform is now a marketplace.
2. Add Phase 5 (Admin/Dispute) -> Platform is now production-ready.
3. Apply Phase N (Polish/i18n) -> Platform is ready for the Arabic market.
