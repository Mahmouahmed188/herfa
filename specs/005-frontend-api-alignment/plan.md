# Implementation Plan: Frontend API Alignment & Backend Synchronization

**Branch**: `005-frontend-api-alignment` | **Date**: 2026-06-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/005-frontend-api-alignment/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Audit all 43+ frontend API endpoints across `src/services/api.ts` (native fetch) and 10 feature service files (Axios) against the planned backend contracts documented in `docs/frontend-business-gap-analysis.md`. Detect URL path mismatches, HTTP method errors, DTO/payload discrepancies, missing auth headers, and mock data still in use. Automatically apply safe 1:1 fixes (path corrections, method changes, field renames, auth header additions). Generate `docs/frontend-api-alignment-report.md` documenting all findings, fixes, and remaining issues.

**Critical context**: The backend (`apps/api/`) has not been implemented — only empty directory placeholders exist. The audit compares frontend endpoints against the planned API contracts from the gap analysis document and the monorepo specification rather than a live backend codebase. All "fixes" focus on frontend-internal consistency and correctness relative to the documented API design.

## Technical Context

- **Language/Version**: TypeScript 5.x (frontend), planned NestJS 10 (backend not yet implemented)
- **Primary Dependencies**: Next.js 14, React 18, TanStack React Query 5, Axios 1.7, Zustand 5, react-hook-form 7, Zod 3.23, next-intl 4
- **Storage**: MongoDB / Mongoose (planned backend — not yet implemented)
- **Testing**: Vitest + Testing Library + jsdom (existing test infrastructure)
- **Target Platform**: Web (Next.js App Router with SSR/SSG)
- **Project Type**: Monorepo — frontend web app (active) + backend API (planned, not yet built) + mobile app (planned)
- **Performance Goals**: All API calls should complete within standard HTTP timeout bounds; no performance regression from fixes
- **Constraints**: Do NOT modify backend code (no backend code exists anyway). Do NOT change UI design, colors, layout, or component structure. Only modify API integration layer files.
- **Scale/Scope**: 43 core API endpoints in `src/services/api.ts`, 10 feature service files, 15 feature modules, ~43 frontend pages across 7 route groups

### Unknowns (to be resolved in Phase 0 research)

1. NEEDS CLARIFICATION: Which frontend endpoints path prefix is correct? `src/services/api.ts` uses `/api/v1` base (from env var `NEXT_PUBLIC_API_URL`), but feature services using Axios use the same base URL. Are there any endpoints with hardcoded paths that bypass the prefix?
2. NEEDS CLARIFICATION: What is the actual vs planned controller route structure for Jobs, Tenders, Messages, and Offers — these use core API functions directly without feature modules, and the gap analysis marks them as "Partial / No dedicated feature module"?
3. NEEDS CLARIFICATION: Which endpoints currently use mock data that should be replaced? The gap analysis identifies `/ai-diagnosis` as using mock AI, `/client/saved` as using localStorage, and `/technician/earnings` as disconnected — are there other implicit mocks?

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. API-First Architecture**: The feature audits that every frontend API call maps to a real backend endpoint and uses correct contracts. This directly enforces API-First compliance.
- [x] **II. Feature-Based Modularity**: The audit scans all feature service files and respects their boundaries. Fixes target the correct feature module files.
- [x] **III. Three-Pillar UX**: Fixes are UI-preserving — they do not alter UX paradigms for Customer, Provider, or Admin portals.
- [x] **IV. Role-Based Access & Security**: The audit verifies that auth headers and role restrictions are correctly applied to every endpoint.
- [x] **V. Server-State Dominance**: The audit scans React Query hooks and ensures they reference the corrected endpoints. No client state changes are made.
- [x] **VI. Error & Loading State Discipline**: Fixes do not modify error/loading/empty state handling — only the API integration layer.
- [x] **VII. AI Feature Integrity**: The audit will detect the `/ai-diagnosis` mock implementation and flag it for replacement with real AI Gateway integration.
- [x] **VIII. Universal Accessibility & Responsive Design**: Fixes do not touch any UI component, layout, or styling — only API service files.

**Gate status**: PASS — no violations. The feature is constitution-compliant by design (it only modifies the integration layer).

## Project Structure

### Documentation (this feature)

```text
specs/005-frontend-api-alignment/
├── plan.md               # This file (/speckit.plan command output)
├── research.md           # Phase 0 output (/speckit.plan command)
├── data-model.md         # Phase 1 output (/speckit.plan command)
├── quickstart.md         # Phase 1 output (/speckit.plan command)
├── contracts/            # Phase 1 output (/speckit.plan command)
│   └── report-schema.md  # Alignment report structure contract
└── tasks.md              # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Frontend web application (monorepo root)
src/
├── services/
│   ├── api.ts                        # Core API service (43 endpoints, native fetch)
│   └── mock/                         # Mock implementations to audit
├── features/                         # 15 feature modules with API services
│   ├── analytics/services/api.ts
│   ├── audit/services/api.ts
│   ├── auth/stores/useAuthStore.ts   # Zustand auth store (token management)
│   ├── bookings/services/api.ts      # Axios-based feature service
│   ├── cms/services/api.ts
│   ├── finance/services/api.ts
│   ├── notifications/services/api.ts
│   ├── providers/services/api.ts
│   ├── settings/services/api.ts
│   ├── support/services/api.ts
│   └── users/services/api.ts
├── lib/
│   └── axios.ts                      # Axios client config (base URL + interceptors)
├── app/[locale]/                     # 43 pages across 7 route groups
└── types/
    └── api.d.ts                      # Shared API response types

# Backend (planned — not yet implemented)
apps/api/
└── src/                              # Empty placeholder directories only
```

**Structure Decision**: Single frontend project (monorepo root) with feature-based modularity. Backend does not yet exist — this plan operates against the documented planned API contracts.

## Complexity Tracking

No violations — Constitution Check passes without issues.

## Phases

### Phase 0: Outline & Research

**Research tasks**:

1. Scan `src/services/api.ts` — catalogue all 43 endpoints with method, path, payload, response type
2. Scan all 10 feature service files — catalogue all endpoints and their DTOs
3. Scan `src/lib/axios.ts` — document base URL, interceptors, auth injection
4. Scan all React Query hooks in `src/features/*/hooks/` — map hook → endpoint relationships
5. Compare against planned backend contracts from `docs/frontend-business-gap-analysis.md`
6. Identify mock implementations in `src/services/mock/` and component-level mocks
7. Identify deprecated or inconsistent endpoints
8. Classify each mismatch as "safe fix" or "requires manual intervention"

**Output**: `research.md` with complete findings

### Phase 1: Design & Contracts

1. Define `data-model.md` — entities for the alignment process (EndpointRecord, Mismatch, FixAction, AlignmentReport)
2. Define `contracts/report-schema.md` — structure contract for `docs/frontend-api-alignment-report.md`
3. Generate `quickstart.md` — runbook for executing the alignment
4. Update AGENTS.md with plan reference

### Phase 2: Tasks (separate command)

Generate `tasks.md` for implementation via `/speckit.tasks`
