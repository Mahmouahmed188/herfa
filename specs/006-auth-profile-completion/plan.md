# Implementation Plan: Authentication & User Profile Completion

**Branch**: `005-frontend-api-alignment` | **Date**: 2026-06-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/006-auth-profile-completion/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Align all frontend authentication, user profile, and role-based access control integrations with existing backend APIs. The backend is the single source of truth — every auth endpoint, user endpoint, role guard, and DTO must be audited and correctly wired on the frontend. Removes all mock data, implements secure token handling with refresh flow, enforces role-based routing, and generates a structured audit report.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 18+

**Primary Dependencies**: Next.js 14.2.15 (App Router), TanStack Query v5, Zustand v5, react-hook-form + Zod, next-intl, axios, Tailwind CSS 3.4, Radix UI

**Storage**: Zustand persist (localStorage) currently — NEEDS CLARIFICATION: Whether backend supports httpOnly cookies for refresh tokens or whether the current localStorage approach should be migrated to a more secure client-side storage mechanism

**Testing**: Vitest + @testing-library/react

**Target Platform**: Web (Next.js SSR/CSR), bilingual (Arabic RTL + English LTR)

**Project Type**: Multi-portal web application (Customer, Provider, Admin portals)

**Performance Goals**: Login/registration responses within 3 seconds; token refresh completes in under 1 second; profile data loads within 2 seconds

**Constraints**: UI must remain unchanged (no color/theme/branding changes); all auth/profile logic must use real backend endpoints; must support three distinct user roles with isolated portals

**Scale/Scope**: 15+ feature domains, 3 user portals, i18n bilingual support, Next.js App Router with route groups

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design (Phase 0)

- [x] **I. API-First Architecture**: The feature objective is explicitly to align frontend with existing backend APIs. Spec states "backend must be treated as the authoritative source." All endpoints (auth, users, profile) already exist in `src/services/api.ts`. Audit phase will verify every endpoint is correctly mapped.
- [x] **II. Feature-Based Modularity**: Auth lives in `src/features/auth/` (stores, services, components). Profile integration will follow same pattern. No cross-feature imports anticipated.
- [x] **III. Three-Pillar UX**: Spec addresses Customer, Provider, and Admin role-based routing and navigation. Route groups `(auth)/`, `(customer)/`, `(provider)/`, `(admin)/` already exist.
- [x] **IV. Role-Based Access & Security**: RBAC is a core requirement — route guards (middleware.ts + client-side), navigation filtering, PermissionGuard, and token management are all in scope.
- [x] **V. Server-State Dominance**: Profile data will use TanStack Query hooks. Auth token in Zustand is acceptable per constitutional exception (transient session state).
- [x] **VI. Error & Loading State Discipline**: Spec requires loading/empty/error/success states for every API-consuming component. Backend validation errors must map to form fields.
- [ ] **VII. AI Feature Integrity**: N/A — no AI features in scope.
- [x] **VIII. Universal Accessibility & Responsive Design**: UI changes are prohibited per spec ("DO NOT change colors/theme/branding/visual identity"). Existing i18n and RTL support must be maintained.

### Post-Design (Phase 1)

- [x] **I. API-First Architecture**: ✅ Research confirms all endpoints map to `src/services/api.ts`. Contracts/ define exact request/response shapes with TypeScript types. Zod schemas exist for login/register. Backend not yet implemented but frontend contracts are defined and ready.
- [x] **II. Feature-Based Modularity**: ✅ Auth module properly isolated in `src/features/auth/`. Research identified duplicate `src/store/useAuthStore.ts` for consolidation. Navigation role values will be migrated to target role format.
- [x] **III. Three-Pillar UX**: ✅ Three portal roles confirmed in data model. Navigation config supports role filtering. All route groups exist.
- [x] **IV. Role-Based Access & Security**: ✅ Token storage migration to memory-only designed. Refresh token flow via axios interceptor designed. Role migration from `'client'|'technician'|'admin'` to `'CUSTOMER'|'PROVIDER'|'ADMIN'|'SUPER_ADMIN'` planned. Auth store consolidation planned.
- [x] **V. Server-State Dominance**: ✅ Profile data to use TanStack Query hooks (defined in data-model). Auth token in Zustand is acceptable per constitution exception V.
- [x] **VI. Error & Loading State Discipline**: ✅ Contracts define all error response formats. LoginForm/RegisterForm already show inline errors. Profile forms will follow same pattern.
- [ ] **VII. AI Feature Integrity**: N/A — no AI features in scope.
- [x] **VIII. Universal Accessibility & Responsive Design**: ✅ UI unchanged. I18n maintained. No violations.

**Gate Result**: PASS (pre-design) → PASS (post-design) — all applicable principles satisfied both before and after design. No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/006-auth-profile-completion/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/[locale]/
│   ├── (auth)/              # Login, Register pages
│   ├── (customer)/profile/  # Customer profile pages
│   ├── (provider)/profile/  # Provider profile pages
│   └── (admin)/             # Admin dashboard
├── components/
│   └── auth/                # ProtectedRoute, PermissionGuard
├── features/
│   └── auth/                # Auth feature module
│       ├── services/        # API calls (login, register, refresh, logout)
│       ├── stores/          # useAuthStore (token + user session)
│       ├── hooks/           # TanStack Query hooks for profile
│       ├── components/      # LoginForm, RegisterForm, ProfileForm
│       └── schemas/         # Zod validation schemas
├── services/
│   └── api.ts               # Centralized API client
├── store/
│   └── useAuthStore.ts      # SECOND auth store — needs consolidation
└── middleware.ts             # Route protection + i18n
```

**Structure Decision**: This feature operates within the existing project structure (Next.js App Router route groups, feature-based auth module, centralized API client). No new directories required. Key concern: there are TWO auth stores (`src/store/useAuthStore.ts` and `src/features/auth/stores/useAuthStore.ts`) that must be consolidated.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. Complexity tracking not required.
