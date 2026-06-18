# Implementation Plan: Customer Dashboard Completion

**Branch**: `007-customer-dashboard-completion` | **Date**: 2026-06-18 | **Spec**: [spec.md](specs/007-customer-dashboard-completion/spec.md)

**Input**: Feature specification from `specs/007-customer-dashboard-completion/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

Complete the Customer Dashboard experience by connecting all customer-facing pages to real backend APIs. Replace mock data patterns in the dashboard (saved technicians, notifications, wallet balance), booking history, and notifications center with live API data. Implement full address management (CRUD) for customer addresses. Generate a comprehensive API audit report documenting all customer-facing endpoint alignment. The feature spans 5 domains: dashboard, bookings, notifications, addresses, and tracking — each requiring new or updated feature modules under `src/features/`.

## Technical Context

**Language/Version**: TypeScript 5.x with strict mode

**Primary Dependencies**: Next.js 14 (App Router), TanStack React Query 5, Zustand 5, Zod, Axios, React Hook Form, next-intl, Tailwind CSS, Radix UI, date-fns, lucide-react, sonner (toast), class-variance-authority

**Storage**: Backend REST API (`/api/v1/`); no direct frontend storage beyond Zustand for auth/UI state and TanStack Query cache for server data

**Testing**: Vitest + @testing-library/react for unit/component tests; Playwright for E2E (recommended)

**Target Platform**: Web browser — responsive across mobile (<640px), tablet (640-1024px), desktop (>1024px)

**Project Type**: Web application — Next.js 14 frontend with backend REST API

**Performance Goals**: Dashboard loads under 2s; paginated lists navigate under 1s; notification mark-read updates under 1s

**Constraints**: MUST NOT change colors, theme, branding, design language, or existing layouts. All styles must use existing Tailwind design tokens. Must provide loading, empty, error, and success states for every API-consuming component.

**Scale/Scope**: Customer portal with 5+ pages; supports thousands of customers with up to 100+ bookings per customer

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. API-First Architecture**: Feature maps to existing backend endpoints (customers, bookings, notifications, addresses, tracking). New service types and Zod schemas MUST be defined before UI.
- [x] **II. Feature-Based Modularity**: New/updated code will live in `src/features/bookings/`, `src/features/notifications/`, `src/features/addresses/`, `src/features/client/`. No cross-feature imports of internal implementation.
- [x] **III. Three-Pillar UX**: Target user is Customer. Routes under `src/app/[locale]/client/`. Navigation is role-filtered by the existing customer layout.
- [x] **IV. Role-Based Access & Security**: Customer layout already uses `ProtectedRoute` with `CUSTOMER` role. New pages MUST inherit this guard. No sensitive actions require audit logging in this feature.
- [x] **V. Server-State Dominance**: All server data MUST use TanStack Query hooks. Zustand reserved for auth/UI state only (existing pattern).
- [x] **VI. Error & Loading State Discipline**: Every API-consuming component MUST handle loading, empty, error, and success states. Existing skeleton/error patterns must be used.
- [ ] **VII. AI Feature Integrity**: N/A — no AI features involved.
- [x] **VIII. Universal Accessibility & Responsive Design**: New components MUST use existing design tokens, logical CSS for RTL, i18n message keys, responsive breakpoints. Consistent with constitution Section VIII.

**Gate Status (Post-Design Re-evaluation)**: PASS — all applicable principles satisfied. VII marked N/A. No constitution violations found. Complexity is consistent with existing project architecture (single Next.js frontend, feature-based modules).

## Project Structure

### Documentation (this feature)

```text
specs/007-customer-dashboard-completion/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output — backend API analysis
├── data-model.md        # Phase 1 output — entity/field/relationship definitions
├── quickstart.md        # Phase 1 output — implementation quick start guide
├── contracts/           # Phase 1 output — API contracts (request/response DTOs)
│   └── customer-api.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── app/[locale]/
│   └── client/                      # Customer portal
│       ├── dashboard/page.tsx       # UPDATE — remove mocks, connect APIs
│       ├── jobs/page.tsx            # UPDATE — connect booking history API, add filters/pagination
│       ├── jobs/[id]/page.tsx       # CREATE — booking detail page
│       ├── notifications/           # CREATE — notifications center
│       │   └── page.tsx
│       ├── addresses/               # CREATE — address management
│       │   └── page.tsx
│       ├── profile/page.tsx         # UPDATE — connect real profile API
│       └── create-job/page.tsx      # UPDATE — integrate saved addresses in booking flow
├── features/
│   ├── bookings/                    # EXPAND — add hooks, types, customer components
│   │   ├── services/api.ts          # EXPAND — add customer booking endpoints
│   │   ├── hooks/                   # CREATE — useCustomerBookings, useBookingDetail
│   │   ├── components/              # EXPAND — add customer booking components
│   │   ├── schemas/                 # CREATE — booking Zod schemas
│   │   └── types/                   # CREATE — booking TypeScript types
│   ├── notifications/               # EXPAND — add customer notification hooks
│   │   ├── services/api.ts          # EXPAND — add customer notification endpoints
│   │   ├── hooks/                   # EXPAND — add useCustomerNotifications
│   │   ├── components/              # EXPAND — add customer notification UI
│   │   ├── schemas/                 # CREATE — notification Zod schemas
│   │   └── types/                   # CREATE — notification TypeScript types
│   ├── addresses/                   # CREATE — new feature module
│   │   ├── services/api.ts          # CREATE — address CRUD API
│   │   ├── hooks/                   # CREATE — useAddresses, useCreateAddress, etc.
│   │   ├── components/              # CREATE — AddressForm, AddressCard, AddressList
│   │   ├── schemas/                 # CREATE — address Zod schemas
│   │   └── types/                   # CREATE — address TypeScript types
│   └── client/                      # EXPAND — dashboard components
│       ├── components/              # UPDATE — connect real data
│       └── hooks/                   # CREATE — useDashboardStats
├── lib/
│   └── align/                       # API alignment scanner (existing)
├── services/api.ts                  # UPDATE — add address, customer profile endpoints
└── types/api.d.ts                   # UPDATE — add Address, CustomerProfile types

docs/
└── customer-dashboard-audit.md      # CREATE — comprehensive API audit report
```

**Structure Decision**: Single frontend project (Next.js) following feature-based modularity. New features go in `src/features/addresses/` and existing features (`bookings`, `notifications`, `client`) are expanded. Pages in `src/app/[locale]/client/` remain thin, importing from feature modules.

## Complexity Tracking

> No constitution violations requiring justification. Complexity is consistent with existing project architecture.
