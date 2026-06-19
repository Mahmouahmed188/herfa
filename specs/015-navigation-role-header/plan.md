# Implementation Plan: Navigation & Role-Based Header Completion

**Branch**: `015-navigation-role-header` | **Date**: 2026-06-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/015-navigation-role-header/spec.md`

## Summary

Complete the Header Navigation system to display role-appropriate navigation items for Guest, Customer (CUSTOMER), Provider (PROVIDER), and Admin (ADMIN) users. Fix navigation filtering logic, add missing pages, verify role mapping, synchronize mobile/desktop navigation, and ensure active route detection works correctly.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 14 (App Router)

**Primary Dependencies**: Zustand (auth store), next-intl (i18n), TanStack Query (server state), Tailwind CSS (styling), Radix UI (primitives), framer-motion (animations)

**Storage**: Zustand store (in-memory, no persist for auth), JWT token in cookie (`herfa_token`)

**Testing**: Vitest (unit + integration), React Testing Library (component), Playwright (E2E)

**Target Platform**: Web — Next.js frontend app

**Project Type**: Web application (frontend)

**Performance Goals**: Navigation renders within 100ms of page load; no layout shift on navigation mount

**Constraints**: All navigation items must use `next-intl` translation keys; RTL support required

**Scale/Scope**: 4 user types (Guest, Customer, Provider, Admin); 16 navigation items across all roles

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. API-First Architecture**: Navigation filtering relies on auth store state (client-side), not API. No new API endpoints needed. The auth store hydrates from backend token validation during `useInitializeAuth`.
- [x] **II. Feature-Based Modularity**: Navigation config lives in `src/features/header/config/navigation.ts`; header components in `src/components/layout/`; role types in `src/types/api.d.ts`. No cross-feature violations.
- [x] **III. Three-Pillar UX**: Navigation items are grouped by pillar (Customer/Client, Provider/Technician, Admin). Route groups match portal structure: `(customer)/`, `(provider)/`, `(admin)/`.
- [x] **IV. Role-Based Access & Security**: Navigation items are already role-filtered via `useNavigation` hook. Missing pages need route creation + `ProtectedRoute` guards. Sensitive admin routes must remain guarded.
- [x] **V. Server-State Dominance**: Navigation config is static client data (not server state). No new server queries needed. Auth state is in Zustand store.
- [x] **VI. Error & Loading State Discipline**: Navigation components must handle `isInitializing` state from auth store — show skeleton or hide auth items until hydration completes.
- [x] **VII. AI Feature Integrity**: Not applicable — no AI features involved in this task.
- [x] **VIII. Universal Accessibility & Responsive Design**: Mobile and desktop navigation must render identical items. Translation keys must exist for all items. RTL support via next-intl is already configured.

## Project Structure

### Documentation (this feature)

```text
specs/015-navigation-role-header/
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
│   ├── (admin)/admin/
│   │   ├── bookings/          # CREATE — admin bookings page
│   │   └── cms/               # CREATE — admin CMS page
│   ├── (provider)/
│   │   └── schedule/          # CREATE — provider schedule page
│   ├── client/
│   │   └── my-bookings/       # CREATE — customer my-bookings page (or alias to /client/jobs)
│   └── technician/
│       └── schedule/          # CREATE — technician schedule page (or alias to /technician/schedule)
├── features/
│   └── header/
│       ├── config/
│       │   └── navigation.ts  # VERIFY — role values match UserRole enum
│       └── hooks/
│           └── useNavigation.ts # VERIFY — role filtering logic
├── store/
│   └── useAuthStore.ts        # AUDIT — role hydration
├── components/
│   └── layout/
│       ├── Header.tsx          # AUDIT — uses useNavigation
│       ├── HeaderNav.tsx       # AUDIT — desktop rendering
│       └── HeaderMobileNav.tsx # AUDIT — mobile rendering
├── types/
│   └── api.d.ts               # UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN' | 'SUPER_ADMIN'
└── messages/
    ├── en.json                # VERIFY — all Header.nav.* keys exist
    └── ar.json                # VERIFY — all Header.nav.* keys exist
```

**Structure Decision**: Single Next.js frontend project with feature-based modularity. All navigation logic stays within `src/features/header/`; page components go in `src/app/[locale]/` route groups.

## Complexity Tracking

> No Constitution violations — no complexity justification needed.
