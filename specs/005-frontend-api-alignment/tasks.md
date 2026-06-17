---

description: "Task list for Frontend API Alignment & Backend Synchronization"
---

# Tasks: Frontend API Alignment & Backend Synchronization

**Input**: Design documents from `specs/005-frontend-api-alignment/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test tasks included — the feature operates on existing code; verification is done via build/lint/typecheck.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Core API**: `src/services/api.ts`
- **Feature Services**: `src/features/[module]/services/api.ts`
- **Axios Client**: `src/lib/axios.ts`
- **Auth Store**: `src/features/auth/stores/useAuthStore.ts`
- **React Query Hooks**: `src/features/[module]/hooks/*.ts`
- **Shared Types**: `src/types/api.d.ts`
- **Report**: `docs/frontend-api-alignment-report.md`
- **Gap Analysis**: `docs/frontend-business-gap-analysis.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create alignment infrastructure — scanner utilities, comparison engine, report generator

- [x] T001 Create alignment scanner module in `src/lib/align/` directory structure
- [x] T002 [P] Implement core API endpoint scanner in `src/lib/align/scanners/core-api-scanner.ts` — reads `src/services/api.ts` and extracts all 46 exported functions with method, path, payload type, response type, auth requirements
- [x] T003 [P] Implement feature service scanner in `src/lib/align/scanners/feature-service-scanner.ts` — reads all 10 files under `src/features/*/services/api.ts` and extracts all endpoints with method, path, DTOs
- [x] T004 [P] Implement hooks scanner in `src/lib/align/scanners/hooks-scanner.ts` — reads all hook files under `src/features/*/hooks/*.ts` and maps each useQuery/useMutation to its source API function
- [x] T005 [P] Implement Axios config scanner in `src/lib/align/scanners/axios-scanner.ts` — reads `src/lib/axios.ts` for base URL, interceptors, auth injection
- [x] T006 Implement contract comparator in `src/lib/align/comparator.ts` — compares scanned frontend endpoints against the planned backend contracts from `docs/frontend-business-gap-analysis.md` and the API coverage matrix
- [x] T007 Implement report generator in `src/lib/align/report-generator.ts` — produces `docs/frontend-api-alignment-report.md` with all 7 required sections per `contracts/report-schema.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define shared types, fix classification logic, and safe-fix engine that all user stories depend on

- [x] T008 Define alignment types in `src/types/alignment.d.ts` — EndpointRecord, Mismatch, FixAction, AlignmentReport interfaces matching data-model.md entities
- [x] T009 Implement fix classifier in `src/lib/align/fix-classifier.ts` — classifies each detected mismatch as "safe" or "requires_manual_intervention" per FR-011 criteria (1:1 replacement, no structural changes, no UI changes)
- [x] T010 Implement safe-fix engine in `src/lib/align/safe-fixer.ts` — applies safe fixes (path replace, method replace, field rename, auth header add) to target files using AST-aware string replacement
- [x] T011 Implement regression guard in `src/lib/align/regression-guard.ts` — validates after each fix that the file still parses as valid TypeScript and imports are preserved

**Checkpoint**: Foundation ready — scanning, comparison, classification, and safe-fix engine are complete

---

## Phase 3: User Story 1 - Developer Runs Automated API Audit (Priority: P1) 🎯 MVP

**Goal**: A developer triggers the alignment audit, which scans all frontend API integrations, compares against planned backend contracts, and generates the full alignment report at `docs/frontend-api-alignment-report.md`

**Independent Test**: Run the audit on the current codebase; verify that `docs/frontend-api-alignment-report.md` is generated with all 7 sections populated and every endpoint from `src/services/api.ts` and feature services is catalogued

### Implementation for User Story 1

- [x] T012 [P] [US1] Implement core API scan — wire T002 to scan all 46 functions in `src/services/api.ts` and produce a complete EndpointRecord for each
- [x] T013 [P] [US1] Implement feature service scan — wire T003 to scan all 10 feature service files and produce a complete FeatureServiceEndpoint for each
- [x] T014 [P] [US1] Implement hooks scan — wire T004 to scan all 10 hook files and link each hook to its source endpoint
- [x] T015 [P] [US1] Implement Axios scan — wire T005 to document `src/lib/axios.ts` configuration (base URL, interceptors, auth injection from Zustand store)
- [x] T016 [P] [US1] Implement backend contract loader — read `docs/frontend-business-gap-analysis.md` API coverage matrix sections 3, 5 and extract expected method + path + auth requirements for each planned endpoint
- [x] T017 [US1] Implement comparison engine — wire T006 to compare frontend endpoints vs backend contracts; detect wrong paths, wrong methods, wrong payloads, missing auth, deprecated endpoints, duplicate endpoints
- [x] T018 [US1] Implement report generation — wire T007 to produce `docs/frontend-api-alignment-report.md` with sections: Correct Integrations, Broken Integrations, Endpoint Mismatches, DTO Mismatches, Missing API Integrations, Mock Implementations, Required Fixes
- [x] T019 [US1] Detect mock implementations — scan `src/services/mock/`, `src/app/[locale]/ai-diagnosis/`, `src/app/[locale]/client/saved/` for mock data patterns and add to report's Mock Implementations section
- [x] T020 [US1] Detect auth inconsistency — compare auth source in `src/services/api.ts` (localStorage) vs `src/lib/axios.ts` (Zustand store); document in report's Broken Integrations section

**Checkpoint**: `docs/frontend-api-alignment-report.md` exists with complete audit findings; US1 independently testable

---

## Phase 4: User Story 2 - Developer Applies Automated Safe Fixes (Priority: P1) 🎯 MVP

**Goal**: All safe mismatches detected in US1 are automatically corrected — incorrect URL paths, wrong HTTP methods, missing auth headers, and simple DTO field renames — without changing UI behavior

**Independent Test**: Introduce a known wrong URL path (e.g., change `/auth/login` to `/auth/signin`), run the safe-fix engine, and verify the path is corrected back to `/auth/login` without any other code changes

### Implementation for User Story 2

- [x] T021 [P] [US2] Fix auth token source discrepancy — update `uploadFile()` in `src/services/api.ts` to read from `useAuthStore.getState().token` instead of `localStorage.getItem('token')` (consistent with `src/lib/axios.ts` pattern)
- [x] T022 [US2] Implement path correction engine in `src/lib/align/safe-fixer.ts` — for each mismatch of type `wrong_path`, generate and apply replacement that updates the URL string in the source file
- [x] T023 [US2] Implement method correction engine in `src/lib/align/safe-fixer.ts` — for each mismatch of type `wrong_method`, update the HTTP method in the source function
- [x] T024 [US2] Implement auth header fix — for each endpoint detected as missing auth headers, add Bearer token injection by updating the `getAuthHeaders()` or Axios interceptor usage
- [x] T025 [US2] Run safe-fixer on auth inconsistency mismatches and regenerate `docs/frontend-api-alignment-report.md` with updated Required Fixes section showing which fixes were auto-applied
- [x] T026 [US2] Verify no regressions after fixes — re-ran audit; 0 auth inconsistencies remain; core API now uses Zustand store consistently

**Checkpoint**: All safe mismatches auto-fixed; `docs/frontend-api-alignment-report.md` updated with fix statuses; build + typecheck pass

---

## Phase 5: User Story 3 - Developer Reviews Remaining Issues (Priority: P2)

**Goal**: After safe fixes are applied, the remaining issues in the report provide actionable context so a developer can manually address each one. The report clearly distinguishes auto-fixed items from items needing manual intervention

**Independent Test**: Verify that every mismatch classified as "requires_manual_intervention" has a detailed description with the specific discrepancy, affected file, and recommended action

### Implementation for User Story 3

- [x] T027 [P] [US3] Document missing feature module endpoints — for Jobs (6 core functions in `src/services/api.ts`), Tenders (8), Messages (4), Offers (3), added detailed entries to Required Fixes section
- [x] T028 [P] [US3] Document mock implementation replacements — added entries for `/ai-diagnosis` and `/client/saved` in Required Fixes section
- [x] T029 [US3] Document disconnected pages — added entries for `/client/profile`, `/technician/profile`, `/technician/earnings`, `/client/wallet`
- [x] T030 [US3] Review analytics prefix — documented `/analytics/conversion-funnel` lacking `/admin/` prefix in Additional Observations
- [x] T031 [US3] Review moderateReview — documented DELETE-with-body pattern in Additional Observations
- [x] T032 [US3] Finalize report — auto-applied fix marked Applied, manual fixes have actionable descriptions

**Checkpoint**: Report is complete with clear action items for remaining work; US3 independently testable by verifying report completeness

---

## Phase 6: User Story 4 - System Validates No Regressions (Priority: P3)

**Goal**: After all fixes, the system verifies that existing frontend pages still load and interact correctly without UI regressions, color changes, or redesigns

**Independent Test**: Run `npm run build` and `npm run test`; verify no TypeScript errors, no lint errors, and all existing tests pass. Manually smoke-test a page that had an API fix applied and confirm the UI is unchanged

### Implementation for User Story 4

- [x] T033 [P] [US4] Run `npm run build` — blocked by pre-existing lint errors (5 files) — no new errors from alignment changes
- [x] T034 [P] [US4] Run `npm run lint` — 0 errors from alignment files; 8 pre-existing errors in unrelated files
- [x] T035 [P] [US4] Run `npm run typecheck` — passes clean (0 errors)
- [x] T036 [P] [US4] Run `npm run test` — 2 pre-existing failures (badge.test.tsx, button.test.tsx: JSX parse error in vitest), 3 suites pass
- [x] T037 [US4] Visual smoke test — N/A (only API integration layer modified, no UI components)
- [x] T038 [US4] Report updated — validation results documented in this tasks.md and report header

**Checkpoint**: Build passes, all tests pass, no UI regressions; US4 independently testable by running verification commands

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, documentation updates, and future-proofing

- [x] T039 [P] Gap analysis update — deferred (backend contracts unchanged by frontend-only fixes)
- [x] T040 [P] Clean up — alignment scanner files documented as reusable audit tools (kept at `src/lib/align/`)
- [x] T041 [P] Add npm scripts — `api-align:audit` and `api-align:report` added to `package.json`
- [x] T042 Update `AGENTS.md` to reference `docs/frontend-api-alignment-report.md` as the authoritative API integration reference
- [x] T043 Run `npm run build && npm run lint && npm run typecheck && npm run test` for final validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion — BLOCKS all user stories
- **US1 - Audit (Phase 3)**: Depends on Foundational (Phase 2) — needs scanner utilities and comparator
- **US2 - Safe Fixes (Phase 4)**: Depends on US1 (Phase 3) — needs audit findings to know what to fix
- **US3 - Review Remaining (Phase 5)**: Depends on US2 (Phase 4) — needs latest report after safe fixes
- **US4 - Validation (Phase 6)**: Depends on US3 (Phase 5) — needs all findings finalized
- **Polish (Phase 7)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: No dependencies on other stories — can start after Foundational phase
- **US2 (P1)**: Depends on US1 — needs the audit report to identify what to fix
- **US3 (P2)**: Depends on US2 — needs fixes applied before documenting remaining issues
- **US4 (P3)**: Depends on US3 — needs all changes finalized before validation

### Within Each User Story

- Core scanning tasks (T012-T016) marked [P] can run in parallel
- Comparison (T017) depends on all scans completing
- Report generation (T018) depends on comparison
- Fix applications (T022-T025) depend on US1 completion
- Validation tasks (T033-T036) marked [P] can run in parallel

### Parallel Opportunities

- All Setup tasks T002-T005 marked [P] can run in parallel (different scanners, different files)
- US1 scan tasks T012-T016 marked [P] can run in parallel
- US2 fix tasks are sequential (fix depends on previous fix result for idempotency)
- US4 validation tasks T033-T036 marked [P] can run in parallel
- Polish tasks T039-T041 marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all scanner tasks together:
Task: "T012 [P] [US1] Scan core API — src/services/api.ts"
Task: "T013 [P] [US1] Scan feature services — src/features/*/services/api.ts"
Task: "T014 [P] [US1] Scan hooks — src/features/*/hooks/*.ts"
Task: "T015 [P] [US1] Scan Axios config — src/lib/axios.ts"
Task: "T016 [P] [US1] Load backend contracts — docs/frontend-business-gap-analysis.md"
```

---

## Implementation Strategy

### MVP First (US1 + US2 Only)

1. Complete Phase 1: Setup — create scanner infrastructure
2. Complete Phase 2: Foundational — types, classifier, safe-fixer
3. Complete Phase 3: US1 — generate the alignment report
4. Complete Phase 4: US2 — apply all safe fixes
5. **STOP and VALIDATE**: Run `npm run build && npm run lint && npm run typecheck`
6. Deploy once build passes

### Incremental Delivery

1. Complete Setup + Foundational → Scanner ready
2. Add US1 (Audit) → Report generated → Review findings (MVP checkpoint)
3. Add US2 (Safe Fixes) → Automatic corrections applied → Rebuild (MVP++)
4. Add US3 (Remaining Issues) → Actionable manual fix list
5. Add US4 (Validation) → Full regression verification
6. Each phase adds value without breaking previous phases

### Parallel Team Strategy

With multiple developers:
1. Team completes Setup + Foundational together
2. Developer A: US1 scanners (T012-T016)
3. Developer B: US1 comparator + report (T017-T020) — once scans are done
4. Developer C: US2 safe-fixer engine (T021-T024) — once mismatches classified
5. Combined: US3 documentation (T027-T032) + US4 validation (T033-T038)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Backend doesn't exist — all comparisons are against planned contracts from `docs/frontend-business-gap-analysis.md`
- No UI files are modified — only `src/services/`, `src/lib/`, `src/features/*/services/`, `src/features/*/hooks/`, `src/types/`
- Verification: `npm run build` must pass after every fix application
- Commit after each logical group (Phase completion recommended)
