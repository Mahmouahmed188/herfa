---

description: "Task list for Frontend Business Coverage Audit"

---

# Tasks: Frontend Business Coverage Audit

**Input**: Design documents from `specs/004-business-coverage-audit/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test tasks requested — spec defines independent verification criteria per user story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Report output**: `docs/frontend-business-gap-analysis.md`
- **Feature artifacts**: `specs/004-business-coverage-audit/`
- **Frontend source**: `src/` (audit target, not modified)
- **Research references**: `specs/004-business-coverage-audit/research.md`
- **Data model**: `specs/004-business-coverage-audit/data-model.md`
- **Report schema**: `specs/004-business-coverage-audit/contracts/report-schema.md`

---

## Phase 1: Setup

**Purpose**: Create the output directory and initialize the report document shell.

- [ ] T001 [P] Create `docs/` directory at project root if not present
- [ ] T002 Create the report shell at `docs/frontend-business-gap-analysis.md` with
      title, metadata, and all section headings from the report schema defined in
      `specs/004-business-coverage-audit/contracts/report-schema.md`

**Checkpoint**: Report document skeleton exists with empty section headings.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Audit the full codebase inventory from `research.md` to establish the
baseline data that powers every report section.

- [ ] T003 [P] Catalog all 43 frontend page files from `src/app/[locale]/` in a
      structured list with route group (public/auth/customer/provider/admin),
      route path, and page purpose per `specs/004-business-coverage-audit/research.md`
- [ ] T004 [P] Catalog all 15 feature modules from `src/features/` with their
      services, hooks, schemas, and components per research.md
- [ ] T005 [P] Catalog all 75+ API service functions from `src/services/api.ts`
      and `src/features/*/services/api.ts` with HTTP method, route, and source
      (core/feature) per research.md
- [ ] T006 [P] Catalog all 12 TanStack Query hook files from `src/features/*/hooks/`
      with their query keys and associated service functions per research.md
- [ ] T007 [P] Catalog all 7 forms (react-hook-form) and 4 Zod schema files from
      `src/features/*/schemas/` per research.md
- [ ] T008 Consolidate all catalogs into a cross-reference mapping that links
      every frontend artifact to its backend module per the CoverageGap entity
      in `specs/004-business-coverage-audit/data-model.md`

**Checkpoint**: Complete frontend inventory ready for gap analysis. Every page,
component, service, hook, form, and schema is mapped to a backend module.

---

## Phase 3: User Story 1 - Generate Gap Analysis Report (Priority: P1) 🎯 MVP

**Goal**: Produce the complete gap analysis report covering all pages, components,
API integrations, hooks, forms, dashboards, and role-based screens with their
backend integration status.

**Independent Test**: Every backend module in the API contracts appears in either
the "Existing Frontend Coverage" or "Missing Business Areas" section of the report.

### Implementation for User Story 1

- [ ] T009 [P] [US1] Write the "Existing Frontend Coverage" section in
      `docs/frontend-business-gap-analysis.md` listing every page with:
      Exists status, Backend Connected status (Yes/Partial/No), and specific
      missing features per `contracts/report-schema.md`
- [ ] T010 [P] [US1] Write the "Missing Business Areas" section in
      `docs/frontend-business-gap-analysis.md` covering every backend module
      (Auth, Bookings, Providers, Payments, Support, Notifications, CMS,
      Analytics, Audit, Settings, Jobs, Tenders, Messages) with frontend
      implementation status per `contracts/report-schema.md`
- [ ] T011 [P] [US1] Audit form coverage — for each of the 7 forms in
      `src/features/*/`, verify they have Zod validation (react-hook-form + zod)
      and document gaps in `docs/frontend-business-gap-analysis.md#existing-frontend-coverage`
- [ ] T012 [P] [US1] Audit dashboard coverage — for each portal dashboard
      (`/client/dashboard`, `/technician/dashboard`, `/admin/dashboard`),
      document what KPIs and widgets are rendered vs what the backend supports
      in `docs/frontend-business-gap-analysis.md#existing-frontend-coverage`
- [ ] T013 [P] [US1] Audit role-based screen coverage — verify each portal
      (customer, provider, admin) has the pages defined in the constitution's
      folder structure guidelines and document gaps in the report
- [ ] T014 [P] [US1] Audit loading state and error boundary coverage — scan
      all page files in `src/app/[locale]/` for `loading.tsx` and `error.tsx`;
      document gaps in the report
- [ ] T015 [US1] Consolidate all US1 findings into the report and apply the
      BackendModule-to-CoverageGap relationship defined in
      `specs/004-business-coverage-audit/data-model.md`

**Checkpoint**: At this point, User Story 1 should be fully functional. The report
contains complete Existing Frontend Coverage and Missing Business Areas sections
with accurate backend integration status for every module.

---

## Phase 4: User Story 2 - API Coverage Matrix (Priority: P2)

**Goal**: Produce the API Coverage Matrix mapping every backend endpoint to its
frontend connection status.

**Independent Test**: Every endpoint from the API service contracts appears in the
matrix with Connected/Partial/Not Connected status. A developer can cross-check any
endpoint against the codebase.

### Implementation for User Story 2

- [ ] T016 [P] [US2] Write the "API Coverage Matrix" section in
      `docs/frontend-business-gap-analysis.md` with method, route, connected
      status, has-hook status, used-in-UI status, and source (core/feature)
      for every backend endpoint per `contracts/report-schema.md`
- [ ] T017 [P] [US2] Map core API endpoints (from `src/services/api.ts`) to the
      matrix — mark each as Connected or Not Connected based on hook/service
      coverage per research.md findings
- [ ] T018 [P] [US2] Map feature service endpoints (from `src/features/*/services/api.ts`)
      to the matrix — mark each as Connected, Partial, or Not Connected per
      research.md findings
- [ ] T019 [P] [US2] Cross-reference matrix entries with TanStack Query hooks
      (`useQuery`/`useMutation` in `src/features/*/hooks/`) — mark hasHook
      Yes/No per research.md findings
- [ ] T020 [P] [US2] Cross-reference matrix entries with actual page usage —
      grep for each service function call in `src/app/[locale]/` page files and
      mark usedInUI Yes/Partial/No
- [ ] T021 [US2] Add a summary row to the matrix showing total endpoints,
      connected count, partial count, not-connected count, and overall
      coverage percentage

**Checkpoint**: At this point, User Stories 1 AND 2 should both be verifiable.
The API Coverage Matrix gives developers a precise list of what endpoints need
frontend work.

---

## Phase 5: User Story 3 - Prioritized Frontend Roadmap (Priority: P3)

**Goal**: Translate gap data into a categorized, prioritized feature roadmap.

**Independent Test**: The roadmap lists items in priority order. Each item
references the specific backend module and frontend gap it addresses.

### Implementation for User Story 3

- [ ] T022 [P] [US3] Identify Critical priority gaps — features or endpoints that
      block a core business flow with no workaround (e.g., missing provider
      verification screen blocks provider onboarding) and document in
      `docs/frontend-business-gap-analysis.md#categorized-findings`
- [ ] T023 [P] [US3] Identify High priority gaps — significant feature gaps with
      partial workarounds (e.g., missing admin support page despite having
      supportService) and document in the report
- [ ] T024 [P] [US3] Identify Medium priority gaps — important but non-blocking
      improvements (e.g., missing loading states on pages) and document in
      the report
- [ ] T025 [P] [US3] Identify Low priority gaps — polish items and nice-to-have
      enhancements (e.g., missing `/client/wallet` page) and document in the
      report
- [ ] T026 [US3] Write the "Frontend Roadmap" section in
      `docs/frontend-business-gap-analysis.md` with three priority tiers (P1, P2, P3),
      each referencing the backend module and effort estimate (small/medium/large)

**Checkpoint**: All three user stories now verifiable. The roadmap is actionable
for sprint planning.

---

## Phase 6: User Story 4 - Missing Screens, Components, and Flows (Priority: P3)

**Goal**: Identify specific missing screens, reusable components, and end-to-end
business flows.

**Independent Test**: Each missing screen/component/flow is listed with its
associated backend module. A developer can verify against the backend contracts.

### Implementation for User Story 4

- [ ] T027 [P] [US4] Write the "Missing Screens" section in
      `docs/frontend-business-gap-analysis.md` — list every screen the backend
      supports but the frontend does not have, grouped by portal
      (Customer: wallet, saved technicians; Provider: (none); Admin: support
      management, tender oversight)
- [ ] T028 [P] [US4] Write the "Missing Components" section in
      `docs/frontend-business-gap-analysis.md` — list reusable components that
      need to be built (e.g., provider verification status badge, booking
      timeline stepper, dispute resolution panel) with their target domain
- [ ] T029 [P] [US4] Audit missing tenders module frontend — document that
      tenders have no dedicated feature module (only core API functions exist)
      and list the required service/hook/component scaffolding in the report
- [ ] T030 [P] [US4] Audit missing jobs module frontend — document that jobs
      have only core API functions (no feature service) and list required
      scaffolding
- [ ] T031 [P] [US4] Audit missing messages module frontend — document that
      messages have only core API functions (no feature service) and list
      required scaffolding
- [ ] T032 [P] [US4] Audit missing tender listing page — document that only
      `/tenders/create` and `/tenders/[id]` exist; no `/tenders` (list) page
- [ ] T033 [P] [US4] Audit missing admin support page — document that
      `supportService` exists but no `/admin/support` route renders it
- [ ] T034 [US4] Write the "Missing Business Flows" section in
      `docs/frontend-business-gap-analysis.md` — describe end-to-end flows that
      are absent or incomplete (Provider onboarding → verification → first job;
      Booking creation → tracking → completion → review; Tender creation →
      offers → acceptance → fulfillment) with priority per flow

**Checkpoint**: All four user stories are complete. The report covers every
section defined in the report schema.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final review, cross-referencing, and validation of the complete report.

- [ ] T035 [P] Cross-reference the report against all backend API service
      contracts — verify no endpoint is missing from the API Coverage Matrix.
      Add any overlooked endpoints.
- [ ] T036 [P] Cross-reference the report against all frontend pages in
      `src/app/[locale]/` — verify every page appears in "Existing Frontend
      Coverage". Add any overlooked pages.
- [ ] T037 [P] Verify all priority assignments — check that no Critical item
      has a workaround, no High item is actually Critical, and the P1/P2/P3
      roadmap tiers are consistent with the priority categorization.
- [ ] T038 [P] Add a "Re-running the Audit" section to the report documenting
      the process from `specs/004-business-coverage-audit/quickstart.md` so the
      document can be updated after future feature implementations.
- [ ] T039 Final read-through of `docs/frontend-business-gap-analysis.md` —
      fix typos, broken links, inconsistent terminology, and ensure SC-005
      (readable by both technical and non-technical stakeholders).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (P1), US2 (P2), US3 (P3), US4 (P3) can proceed in parallel
  - US3 and US4 depend on US1 findings (gap data feeds categorization and roadmap)

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — no dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational — no dependencies on other stories
- **User Story 3 (P3)**: Depends on US1 completion — needs gap data to prioritize
- **User Story 4 (P3)**: Depends on US1 completion — needs gap data to list missing items

### Within Each User Story

- Section templates written before detailed findings
- Findings collected before consolidation
- Story complete before moving to next

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- US1 tasks T009-T014 are all [P] and can run in parallel
- US2 tasks T016-T020 are all [P] and can run in parallel
- US3 tasks T022-T025 are all [P] and can run in parallel
- US4 tasks T027-T033 are all [P] and can run in parallel
- Polish tasks T035-T038 are all [P] and can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all section findings in parallel:
Task: T009 "Existing Frontend Coverage"
Task: T010 "Missing Business Areas"
Task: T011 "Form coverage"
Task: T012 "Dashboard coverage"
Task: T013 "Role-based screen coverage"
Task: T014 "Loading/error state coverage"

# Then consolidate:
Task: T015 "Consolidate US1 findings"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Verify every backend module has coverage status
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Verify → Deploy (MVP — gap analysis exists)
3. Add User Story 2 → Verify → API matrix available
4. Add User Story 3 → Verify → Roadmap available
5. Add User Story 4 → Verify → Full details available

### Parallel Team Strategy

With multiple contributors:

1. Team completes Setup + Foundational together
2. Once Foundational is done, parallel work:
   - Contributor A: User Story 1 (Core report)
   - Contributor B: User Story 2 (API matrix)
3. After US1 complete:
   - Contributor A: User Story 3 (Roadmap)
   - Contributor B: User Story 4 (Missing items)

---

## Notes

- [P] tasks = different sections of the same document, no file conflicts
- [Story] label maps task to specific user story for traceability
- Each user story produces a self-contained section of the final document
- No source code is modified — all changes are to `docs/frontend-business-gap-analysis.md`
- The report is a living document meant to be updated as features are implemented
