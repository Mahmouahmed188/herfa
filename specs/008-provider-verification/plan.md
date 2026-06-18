# Implementation Plan: Provider Verification System

**Branch**: `008-provider-verification` | **Date**: 2026-06-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/008-provider-verification/spec.md`

## Summary

Complete the Provider Verification System by auditing existing verification code, connecting provider-facing verification to real backend API calls, adding document management with validation, implementing verification status display (Pending, Under Review, Approved, Rejected, Suspended), adding verification history/timeline, and integrating verification notifications. No backend code modifications — all work is frontend integration against existing API contracts.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 14 (App Router)

**Primary Dependencies**: React 18, TanStack Query (React Query) 5.x, Zustand, Zod, next-intl, Axios, React Hook Form

**Storage**: N/A — all data served by backend APIs. No local persistence beyond Zustand auth store.

**Testing**: Vitest + React Testing Library (unit/integration), Playwright (E2E). Verification schemas have existing unit tests in `tests/unit/schemas.test.ts`.

**Target Platform**: Web — Next.js 14 App Router with RTL support. Provider portal under `src/app/[locale]/(provider)/`, admin verification under `src/app/[locale]/(dashboard)/providers/`.

**Project Type**: Web application (Next.js frontend with REST API backend)

**Performance Goals**: Verification dashboard loads in under 2 seconds. Document uploads show progress within 500ms. Verification history pages paginate in under 1 second per page.

**Constraints**: Existing design system must be preserved (colors, theme, branding, components). No backend code modifications allowed. Must support all verification states from backend DTOs.

**Scale/Scope**: Single feature module for provider verification. Impacts ~5 pages, ~10 components, ~3 API endpoints.

## Constitution Check

*GATE RE-EVALUATION AFTER PHASE 1 DESIGN*

- [x] **I. API-First Architecture**: Does every feature map to an existing backend endpoint? Are service layer types and Zod schemas defined before UI? → **PASS** — 9 API endpoints identified and documented in contracts. Existing Zod schemas defined in `verification.ts`. Design consolidates two API patterns into one feature module.
- [x] **II. Feature-Based Modularity**: Does the design place code in `src/features/[domain]/`? Are cross-feature imports avoided? → **PASS** — All verification logic in `src/features/providers/`. Technician verification will be migrated from `src/services/api.ts` to the feature module. Notification hooks will be added to `src/features/notifications/`.
- [x] **III. Three-Pillar UX**: Is the UX tailored to the target user (Customer, Provider, or Admin)? Is the portal route group correct? → **PASS** — Provider verification pages under `(provider)/verification/`, admin verification under `(dashboard)/providers/verification/`.
- [x] **IV. Role-Based Access & Security**: Are route, component, and action-level permission guards defined? Are sensitive actions auditable? → **PASS** — Existing RBAC middleware guards admin routes. Provider-facing verification uses existing auth guards. Admin approve/reject mutations are inherently audit-trailed via the status change history.
- [x] **V. Server-State Dominance**: Is TanStack Query used for server data? Is Zustand limited to transient UI state? → **PASS** — Design specifies TanStack Query hooks for all verification endpoints. Technician verification migration will convert `fetchWithAuth` calls to TanStack Query hooks.
- [x] **VI. Error & Loading State Discipline**: Are loading, empty, error, and success states defined for every API-consuming component? → **PASS** — All verification components will implement the four-state pattern (loading skeleton, empty state, error with retry, success display).
- [x] **VII. AI Feature Integrity**: If AI features are involved, are they wired to the backend AI Gateway (not mocked)? → **N/A** — No AI features in verification scope.
- [x] **VIII. Universal Accessibility & Responsive Design**: Is WCAG 2.2 AA met? Is RTL/Arabic parity handled? Are breakpoints covered? → **PASS** — Reuses existing design system which already handles RTL, responsive breakpoints, and accessibility.

## Project Structure

### Documentation (this feature)

```text
specs/008-provider-verification/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── checklists/
    └── requirements.md  # Quality checklist
```

### Source Code (repository root)

```text
src/features/providers/
├── schemas/
│   └── verification.ts         # Zod schemas: verification status, documents, provider verification, approve/reject inputs
├── services/
│   └── api.ts                  # API service: get queue, get details, approve, reject, list, update status
├── hooks/
│   └── useVerification.ts      # TanStack Query hooks: queue, details, approve, reject, list, update status
├── components/
│   ├── VerificationQueue.tsx    # Admin verification queue table
│   ├── ProviderList.tsx         # Admin provider list with status badges
│   ├── VerificationStatusBadge.tsx     # NEW: status badge component
│   ├── VerificationHistory.tsx        # NEW: timeline/event history
│   ├── VerificationDocuments.tsx      # NEW: document upload & management
│   ├── VerificationDashboard.tsx      # NEW: provider dashboard widget
│   └── VerificationNotifications.tsx  # NEW: notification integration
└── pages/ (under app router)
    └── ...

src/app/[locale]/(provider)/
├── verification/
│   ├── page.tsx                # Provider verification status dashboard
│   ├── submit/
│   │   └── page.tsx            # Submit verification application
│   └── history/
│       └── page.tsx            # Verification history timeline

src/app/[locale]/(dashboard)/providers/
├── verification/
│   ├── page.tsx                # Admin verification queue (index)
│   └── [id]/
│       └── page.tsx            # Admin verification detail (existing)

src/features/notifications/
├── hooks/
│   └── useVerificationNotifications.ts  # NEW: verification notification hooks

docs/
└── provider-verification-audit.md      # NEW: API audit report
```

**Structure Decision**: All verification business logic stays in `src/features/providers/` with additional pages under the provider and admin route groups. Notification integration adds verification-specific hooks to `src/features/notifications/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No unjustified violations. Identified gaps will be addressed during implementation.
