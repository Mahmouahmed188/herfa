# Implementation Plan: Global Persistent Header

**Branch**: `003-global-persistent-header` | **Date**: 2026-05-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-global-persistent-header/spec.md`

## Summary

Create a consistent, globally available Header component visible across all platform pages unless explicitly marked as full-screen. The Header adapts to authentication state (guest, authenticated, admin), supports all languages (LTR/RTL) via existing `next-intl` i18n, respects light/dark themes via `next-themes`, and is responsive across desktop/laptop/tablet/mobile viewports. Navigation items are driven by a type-safe configuration registry for extensibility.

## Technical Context

**Language/Version**: TypeScript 5+, React 18.3, Next.js 14.2 (App Router)

**Primary Dependencies**: next-intl 4.7 (i18n), zustand 5 (auth state), @tanstack/react-query 5 (server data), framer-motion 11 (animations), lucide-react (icons), next-themes 0.3 (theme), Radix UI primitives + Tailwind CSS 3 + CVA (styling)

**Storage**: N/A — header is a UI component; auth state via Zustand (persisted), user profile via TanStack Query

**Testing**: Vitest 4 + @testing-library/react 16 (unit/integration), existing patterns in `tests/`

**Target Platform**: Web — Next.js 14 App Router with `next-intl` locale routing (`/[locale]/...`)

**Project Type**: Web application (admin dashboard + client marketplace)

**Performance Goals**: Header interactions <100ms, initial render <500ms on broadband, zero cumulative layout shift (CLS) during page transitions

**Constraints**: WCAG 2.2 AA compliance, RTL/Arabic full parity, sticky position with backdrop blur, no layout shifts on render, configuration-driven navigation items

**Scale/Scope**: 3 user roles (client, technician, admin), 2+ languages (English + Arabic initially), 4 viewport breakpoints (375px/768px/1366px/1920px), ~15 navigation items across all roles

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Feature-Based Architecture**: Does the design follow strict modularity in `src/features/`? — Header is a cross-cutting layout component; lives in `src/components/layout/` as an exception (shared UI, not a domain feature). Navigation config registry belongs in `src/features/header/` to keep domain logic separated from the component.
- [x] **II. Zero-Trust & Permission-Based UI**: Are route and component-level permission guards defined? — Navigation items are filtered by user role/permissions via configuration. Header hides/shows items based on auth state and role.
- [x] **III. Type-Safe Enterprise Excellence**: Are all data structures typed? Is Zod used for validation? — Navigation config schema will use Zod for runtime validation. All component props strictly typed with TypeScript. CVA for variant management.
- [x] **IV. Server-State Dominance**: Is TanStack Query used for server data? Is Zustand limited to UI state? — Auth state (user, token, isAuthenticated) in Zustand (persisted). User profile and notifications via TanStack Query. Theme and sidebar state in Zustand.
- [x] **V. Consistent Design Language**: Does the UI use Radix/Tailwind and match the dashboard theme? — Header reuses existing Radix + Tailwind patterns from current Navbar. Follows the established design system.
- [x] **VI. Observable Admin Operations**: Are critical actions logged? Is error tracking (Sentry) integrated? — Auth state transitions (login/logout/session-expiry) and navigation to admin routes will be observable. Integrates with existing Sentry setup.
- [x] **VII. Universal Accessibility & I18n**: Is WCAG 2.2 AA met? Is RTL/Arabic parity handled? — Header must pass WCAG 2.2 AA audit (keyboard nav, screen reader, focus states). Full RTL/LTR parity via `next-intl` direction handling. Existing i18n infrastructure reused.

All gates pass. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/003-global-persistent-header/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── layout/
│       ├── Header.tsx                  # New global header replacing Navbar
│       ├── HeaderNav.tsx               # Desktop navigation bar
│       ├── HeaderMobileNav.tsx         # Mobile slide-in navigation
│       ├── HeaderActions.tsx           # Auth-aware action buttons (login/dashboard/signout)
│       ├── HeaderThemeToggle.tsx       # Light/dark theme switch
│       └── HeaderLanguageSwitcher.tsx  # Language selector wrapper (wraps existing LanguageSwitcher)
│
├── features/
│   └── header/
│       ├── config/
│       │   ├── navigation.ts           # Navigation item definitions per role
│       │   └── navigation.schema.ts    # Zod schema for navigation config
│       ├── hooks/
│       │   └── useNavigation.ts        # Hook: filters nav items by user role/permissions
│       └── types/
│           └── index.ts                # NavigationItem, HeaderConfig types
│
├── store/
│   └── useAuthStore.ts                 # Existing — provides auth state for header
│
└── app/
    └── [locale]/
        └── layout.tsx                  # Root layout — conditionally renders Header via ConditionalLayout

tests/
├── components/
│   └── header.test.tsx                 # Header component tests
├── features/
│   └── header/
│       ├── navigation-config.test.ts   # Navigation config schema validation tests
│       └── useNavigation.test.ts       # Nav filtering hooks tests
└── integration/
    └── header-auth-flow.test.tsx       # Auth state transition integration tests
```

**Structure Decision**: Header is a shared layout component in `src/components/layout/` (following existing pattern for `Navbar`, `Footer`, `AppSidebar`). Navigation configuration logic lives in a dedicated `src/features/header/` feature module to keep the config registry independent from presentation — satisfying SC-007 (adding nav items requires config changes only).

## Complexity Tracking

No Constitution violations. Complexity tracking not needed.

## Phase 0: Research

### Research Tasks

**Task R1**: Audit existing Navbar component behavior across all routes.
- What works: sticky positioning, auth-aware rendering, mobile menu, notification bell, language switcher.
- What needs change: nav items are hardcoded (not config-driven), theme toggle missing, hides on NO_CHROME routes which contradicts spec FR-001.
- Outcome: Use existing Navbar as foundation; refactor to extract nav config, add missing features.

**Task R2**: Analyze current ConditionalLayout route exclusion patterns.
- Current behavior: Hides header on `/login`, `/register`, `/client`, `/technician`, `/admin`, `/support` prefixes.
- Target behavior (FR-001): Show header on ALL pages unless explicitly marked full-screen via page-level metadata.
- Outcome: Replace route-based exclusion with a metadata-driven approach. Add a `fullScreenPages` configuration to list routes that should hide the header.

**Task R3**: Determine navigation configuration format.
- Options: JSON file, TypeScript config, CMS-driven, API-driven.
- Decision: TypeScript config file with Zod schema for type safety — matches constitution principle III. Start with static config; API-driven can be layered on via FR-009 extensibility.
- Outcome: `src/features/header/config/navigation.ts` with typed navigation items and role-based access rules.

**Task R4**: Confirm i18n and theme integration points.
- i18n: `next-intl` `useTranslations` for nav labels, existing `LanguageSwitcher` component reused.
- Theme: `next-themes` `useTheme` hook for toggle, persist preference in localStorage.
- Outcome: Integration points confirmed — no new infrastructure needed.

## Phase 1: Design & Contracts

### Data Model

See [data-model.md](./data-model.md) for full entity definitions.

### Contracts

See [contracts/](./contracts/) for:
- `HeaderNavigationConfig` — Zod schema for navigation item structure and validation
- `useNavigation` hook contract — input (user role, pathname), output (filtered nav items, active state)

### Agent Context

Updated `AGENTS.md` to reference this plan file for future `/speckit.tasks` and `/speckit.implement` commands.
