# Tasks: Provider Verification System

**Input**: Design documents from `/specs/008-provider-verification/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Features**: `src/features/providers/`
  - `components/`, `hooks/`, `services/`, `types/`, `schemas/`
- **Routes**: `src/app/[locale]/`
- **Shared UI**: `src/components/ui/`
- **State/Hooks**: `src/stores/`, `src/hooks/`
- **Lib/Utils**: `src/lib/`, `src/utils/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Feature initialization and basic structure for provider verification

- [X] T001 Create verification pages directory structure under `src/app/[locale]/(provider)/verification/` with subdirectories for `submit/` and `history/`, each containing a placeholder `page.tsx`
- [X] T002 [P] Add i18n message keys for verification in `src/messages/en.json` and `src/messages/ar.json` covering all status labels (Pending, Under Review, Approved, Rejected, Suspended), document types (National ID, Passport, Driver License, Professional Certificate, Trade License, Business Registration), and UI text (submit, upload, history, reject reason, approval info)
- [X] T003 [P] Add verification route paths to `src/i18n/routing.ts` for `/provider/verification`, `/provider/verification/submit`, `/provider/verification/history`

**Checkpoint**: Basic directory structure, i18n messages, and routes ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core schemas, API integration, and data layer that MUST be complete before ANY UI work

- [X] T004 Extend `verificationStatusSchema` in `src/features/providers/schemas/verification.ts` to include `UNDER_REVIEW` and `SUSPENDED` states (change from 3 to 5 values), and update all dependent types
- [X] T005 [P] Add `DocumentType` enum schema to `src/features/providers/schemas/verification.ts` with values: `NATIONAL_ID`, `PASSPORT`, `DRIVER_LICENSE`, `PROFESSIONAL_CERTIFICATE`, `TRADE_LICENSE`, `BUSINESS_REGISTRATION`
- [X] T006 [P] Migrate `submitVerification()` and `getVerificationStatus()` from `src/services/api.ts` to `src/features/providers/services/api.ts` using the axios client from `@/lib/axios`
- [X] T007 [P] Migrate `uploadFile()` from `src/services/api.ts` to `src/features/providers/services/api.ts` using the axios client
- [X] T008 [P] Create TanStack Query hooks for migrated technician endpoints in `src/features/providers/hooks/useVerification.ts`: `useSubmitVerification()`, `useVerificationStatus()`, `useUploadFile()`
- [X] T009 [P] Add `getVerificationHistory()` to `src/features/providers/services/api.ts` calling `GET /verification/history` with axios
- [X] T010 [P] Add `useVerificationHistory()` TanStack Query hook in `src/features/providers/hooks/useVerification.ts`

**Checkpoint**: Foundation ready — all schemas, API services, and hooks exist. UI implementation can now begin in parallel for US1 and US2.

---

## Phase 3: User Story 1 - Provider Submits Verification Application (Priority: P1) 🎯 MVP

**Goal**: A service provider can navigate to the verification page, fill out the application form, submit it, and receive confirmation with backend validation error support.

**Independent Test**: Navigate to `/provider/verification/submit` as a logged-in provider, fill in all required fields, submit, and see success confirmation. Verify incomplete submissions show validation errors.

### Implementation for User Story 1

- [X] T011 [P] [US1] Create `VerificationSubmissionForm` component in `src/features/providers/components/VerificationSubmissionForm.tsx` with all required fields (frontIdImage, backIdImage, personalPhoto, documents, portfolio), client-side Zod validation, and React Hook Form integration
- [X] T012 [P] [US1] Create verification submission page at `src/app/[locale]/(provider)/verification/submit/page.tsx` that renders `VerificationSubmissionForm`, fetches existing verification status, and displays appropriate CTAs based on current state
- [X] T013 [US1] Integrate `useSubmitVerification()` mutation in the submission form with proper loading states, success toast, and cache invalidation of `['verificationStatus']` and `['providers', 'verification']` query keys
- [X] T014 [US1] Implement backend validation error display: map server-side field errors to individual form fields via React Hook Form `setError`, show non-field errors as toast banner
- [X] T015 [US1] Update `src/app/[locale]/technician/onboarding-home/page.tsx` to redirect or link to the new unified verification pages under `(provider)/verification/`

**Checkpoint**: At this point, User Story 1 should be fully functional — providers can submit a verification application and see validation errors.

---

## Phase 4: User Story 2 - Provider Uploads Verification Documents (Priority: P1)

**Goal**: A service provider can upload identity and professional documents with format/size validation, progress indication, document type selection, and replacement support.

**Independent Test**: Navigate to verification documents section, upload a JPEG under 5MB, see progress bar, confirm the document appears in the uploaded list. Upload a different file for the same type and confirm it replaces the existing one. Try uploading an invalid format and see validation error.

### Implementation for User Story 2

- [X] T016 [P] [US2] Create `VerificationDocuments` component in `src/features/providers/components/VerificationDocuments.tsx` with document type selection using the `DocumentType` enum, drag-and-drop or file picker, and display of previously uploaded documents with type labels
- [X] T017 [US2] Implement client-side file validation: accept only JPEG, PNG, PDF formats; enforce 5MB max file size; show clear error messages for invalid files before upload begins
- [X] T018 [US2] Implement upload progress indicator using XMLHttpRequest or axios `onUploadProgress` callback in `src/features/providers/services/api.ts` upload method, showing a progress bar per document during upload
- [X] T019 [US2] Implement document replacement logic: when uploading a file for a document type that already has an uploaded file, show confirmation dialog then replace the existing URL with the new one
- [X] T020 [US2] Integrate `VerificationDocuments` into the verification submission flow — documents are uploaded and managed before form submission

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently — providers can upload documents with validation and submit with document management.

---

## Phase 5: User Story 3 - Provider Views Verification Status and History (Priority: P2)

**Goal**: A service provider can view their current verification status with appropriate badge, progress, rejection details, approval info, and a complete timeline of events.

**Independent Test**: Navigate to `/provider/verification` as a provider with a submitted verification. See status badge matching the backend state (Pending/Under Review/Approved/Rejected/Suspended). Navigate to `/provider/verification/history` and see timeline of events.

### Implementation for User Story 3

- [X] T021 [P] [US3] Create `VerificationStatusBadge` component in `src/features/providers/components/VerificationStatusBadge.tsx` that renders a color-coded badge for each of the 5 statuses (Pending=amber, Under Review=blue, Approved=green, Rejected=red, Suspended=gray) with localized labels
- [X] T022 [P] [US3] Create `VerificationDashboard` component in `src/features/providers/components/VerificationDashboard.tsx` showing current status badge, verification progress indicator, pending requirements list, rejection reasons (if rejected), approval info and timestamps (if approved), suspension details (if suspended)
- [X] T023 [US3] Create verification status dashboard page at `src/app/[locale]/(provider)/verification/page.tsx` that renders `VerificationDashboard` with loading skeleton, empty state (no verification yet), error state with retry, and success states for each status
- [X] T024 [P] [US3] Create `VerificationHistory` component in `src/features/providers/components/VerificationHistory.tsx` displaying a vertical timeline of all history events (status transitions, document uploads, reviewer actions) with icons, descriptions, and timestamps
- [X] T025 [US3] Create verification history page at `src/app/[locale]/(provider)/verification/history/page.tsx` that renders `VerificationHistory` with loading skeleton, empty state, error state, and graceful handling when the history endpoint is unavailable

**Checkpoint**: All three stories work independently — providers can submit, see status, view history, and upload documents.

---

## Phase 6: User Story 4 - Provider Receives Verification Notifications (Priority: P3)

**Goal**: A service provider receives notifications for verification events (submitted, approved, rejected, suspended, documents requested) that link to the verification pages.

**Independent Test**: Trigger a verification status change (e.g., approve via admin), then check that the provider receives a corresponding notification that links to `/provider/verification` or `/provider/verification/history`.

### Implementation for User Story 4

- [X] T026 [P] [US4] Add verification notification types to `src/features/notifications/types/index.ts`: `VERIFICATION_SUBMITTED`, `VERIFICATION_APPROVED`, `VERIFICATION_REJECTED`, `VERIFICATION_SUSPENDED`, `DOCUMENTS_REQUESTED`
- [X] T027 [P] [US4] Create `useVerificationNotifications` hook in `src/features/notifications/hooks/useVerificationNotifications.ts` that filters notification types for verification events and provides direct links to verification pages
- [X] T028 [US4] Create `VerificationNotifications` component in `src/features/providers/components/VerificationNotifications.tsx` that renders verification-specific notifications with contextual icons and "View Details" links to `/provider/verification` or `/provider/verification/history`
- [X] T029 [US4] Integrate verification notifications into the existing notification system — verification notifications appear in the general notifications list with correct routing

**Checkpoint**: All four user stories complete. Notifications link verification events to the correct pages.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Mock data cleanup, audit, and validation

- [X] T030 [P] Remove `MOCK_TECHNICIANS` array and all mock verification data fallbacks from `src/app/[locale]/technicians/page.tsx` — replace with real API data or proper empty/loading states
- [X] T031 [P] Remove hardcoded verification status objects from `src/app/[locale]/technicians/[id]/page.tsx` — replace with real data from the providers API or proper empty/loading/error states
- [X] T032 Generate `docs/provider-verification-audit.md` documenting all verification endpoints (9 total), their coverage status, DTO alignment, status schema coverage, history coverage, upload coverage, missing integrations, and required fixes per the spec requirements
- [X] T033 Run `npm run lint` and fix any lint errors in the new and modified files
- [X] T034 Run `npm run type-check` and fix any TypeScript errors in the new and modified files
- [X] T035 Run `npm test` to ensure existing verification schema tests in `tests/unit/schemas.test.ts` still pass with the extended status enum

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2)
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) — can run in parallel with US1
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) — best after US1 for real data
- **User Story 4 (Phase 6)**: Depends on Foundational (Phase 2) — can run after US1 for status references
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational — Independent of US1 (different files, different concerns)
- **User Story 3 (P2)**: Can start after Foundational — Works best after US1 for real verification data
- **User Story 4 (P3)**: Can start after Foundational — Benefits from US1 status changes and US3 history pages

### Within Each User Story

- Core implementation before integration
- Components before pages
- Story complete before moving to next priority

### Parallel Opportunities

- T002 and T003 (Setup) can run in parallel
- T005, T006, T007, T008, T009, T010 (Foundational) can run in parallel
- US1 (Phase 3) and US2 (Phase 4) can run in parallel by different developers
- Within US3: T021, T022, T024 can run in parallel
- Within US6: T030, T031 can run in parallel

---

## Parallel Example: User Story 1 + User Story 2

```bash
# US1 and US2 can run in parallel:

# Developer A: US1 Tasks
Task: T011 Create VerificationSubmissionForm component
Task: T012 Create submission page
Task: T013 Integrate submit mutation
Task: T014 Implement validation error display

# Developer B: US2 Tasks (can start same time as US1)
Task: T016 Create VerificationDocuments component
Task: T017 Implement file validation
Task: T018 Implement upload progress
Task: T019 Implement document replacement
Task: T020 Integrate into submission flow
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (submit verification)
4. Complete Phase 4: User Story 2 (document upload)
5. **STOP and VALIDATE**: Test US1 and US2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 (submit) + US2 (upload) → Test independently → Deploy/Demo (MVP!)
3. Add US3 (status + history) → Test independently → Deploy/Demo
4. Add US4 (notifications) → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (submit verification) + US3 (status & history)
   - Developer B: US2 (document upload) + US4 (notifications)
3. Stories complete and integrate independently
4. Developer C (if available): Polish (mock cleanup, audit, validation)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- The `technician/onboarding-home/page.tsx` references must be updated to use the new unified API after migration (T015)
