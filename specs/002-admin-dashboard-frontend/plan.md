# Implementation Plan: Herfa Admin Dashboard

**Branch**: `002-admin-dashboard-frontend` | **Date**: 2026-05-30 | **Spec**: [specs/002-admin-dashboard-frontend/spec.md](spec.md)

**Input**: Feature specification for the Herfa Admin Dashboard frontend.

## Summary
The Herfa Admin Dashboard is an enterprise-grade control center for managing a service marketplace. This plan outlines the frontend architecture using Next.js 14+ (App Router), TypeScript, and a feature-based structure to ensure scalability and maintainability.

## Technical Context

**Language/Version**: TypeScript 5.0+

**Primary Dependencies**: Next.js 14+, React 18, Tailwind CSS, TanStack Query, Zustand, Axios, React Hook Form, Zod, next-intl.

**Storage**: LocalStorage (for theme/auth tokens), React Query Cache (server state), Zustand (client state).

**Testing**: Vitest, React Testing Library, Playwright.

**Target Platform**: Web (Desktop, Tablet, Mobile Admin Access).

**Project Type**: Enterprise Admin Dashboard.

**Performance Goals**: <800ms table rendering, <200ms locale switching, optimized code splitting.

**Constraints**: WCAG 2.2 AA compliance, Full Arabic (RTL) / English (LTR) parity.

**Scale/Scope**: 12+ major modules, 50+ screens, complex RBAC and permission systems.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Feature-Based Architecture**: Does the design follow strict modularity in `src/features/`?
- [x] **II. Zero-Trust & Permission-Based UI**: Are route and component-level permission guards defined?
- [x] **III. Type-Safe Enterprise Excellence**: Are all data structures typed? Is Zod used for validation?
- [x] **IV. Server-State Dominance**: Is TanStack Query used for server data? Is Zustand limited to UI state?
- [x] **V. Consistent Design Language**: Does the UI use Radix/Tailwind and match the dashboard theme?
- [x] **VI. Observable Admin Operations**: Are critical actions logged? Is error tracking (Sentry) integrated?
- [x] **VII. Universal Accessibility & I18n**: Is WCAG 2.2 AA met? Is RTL/Arabic parity handled?

## Project Structure

### Documentation (this feature)

```text
specs/002-admin-dashboard-frontend/
├── plan.md              # This file
├── spec.md              # Feature specification
├── checklists/
│   └── requirements.md  # Quality checklist
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── app/                 # Next.js App Router (Locale-aware)
├── features/            # Feature-based modules (Auth, Users, Bookings, etc.)
│   ├── [feature]/
│   │   ├── components/  # Feature-specific components
│   │   ├── hooks/       # Feature-specific hooks (Queries/Mutations)
│   │   ├── services/    # Feature-specific API clients
│   │   ├── stores/      # Feature-specific Zustand stores
│   │   ├── types/       # Feature-specific TS types
│   │   └── schemas/     # Zod validation schemas
├── components/          # Shared components
│   ├── ui/              # Radix/Tailwind primitives
│   ├── layout/          # Dashboard layouts
│   └── common/          # Shared business components
├── hooks/               # Shared hooks
├── lib/                 # Shared libraries (Axios, QueryClient)
├── stores/              # Shared global stores
├── types/               # Shared global types
└── utils/               # Shared utilities
```

**Structure Decision**: Option 1 (Single project) optimized with Feature-Based Architecture.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
