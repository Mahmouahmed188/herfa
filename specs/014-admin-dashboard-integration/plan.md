# Implementation Plan: Admin Dashboard Integration

**Branch**: `014-admin-dashboard-integration` | **Date**: 2026-06-19 | **Spec**: [link](./spec.md)

**Input**: Feature specification from `/specs/014-admin-dashboard-integration/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Complete the Admin Dashboard and fully integrate it with all available backend Admin, Analytics, User Management, Provider Management, Payment, Support, Review, and Verification APIs. The Admin Dashboard must become the central operational panel for managing the entire Herfa platform, providing comprehensive management capabilities across all platform domains with real-time data integration and proper role-based access control.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 14

**Primary Dependencies**: React, TanStack Query, Zod, Radix UI, Tailwind CSS, next-intl, Recharts

**Storage**: Backend APIs (PostgreSQL), Client-side caching (TanStack Query)

**Testing**: Vitest, React Testing Library, Playwright E2E

**Target Platform**: Web application (Admin portal)

**Project Type**: Web application with API integration

**Performance Goals**: Dashboard loads within 3 seconds, API operations complete within 2-5 seconds, 99.9% uptime during peak hours

**Constraints**: <200ms API response time, <10MB memory usage, WCAG 2.2 AA accessibility, full RTL/Arabic support

**Scale/Scope**: 10+ admin modules, 15+ API integrations, 50+ admin pages, comprehensive analytics dashboards

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. API-First Architecture**: Every feature maps to existing backend endpoints. Service layer types and Zod schemas defined before UI.
- [x] **II. Feature-Based Modularity**: Code will be placed in `src/features/[domain]/` with cross-feature imports minimized.
- [x] **III. Three-Pillar UX**: UX is tailored for Administrators with proper portal route group `(admin)/`.
- [x] **IV. Role-Based Access & Security**: Route, component, and action-level permission guards implemented. Sensitive actions auditable.
- [x] **V. Server-State Dominance**: TanStack Query used for server data. Zustand limited to transient UI state.
- [x] **VI. Error & Loading State Discipline**: Loading, empty, error, and success states defined for every API-consuming component.
- [ ] **VII. AI Feature Integrity**: Not applicable for this admin dashboard feature.
- [x] **VIII. Universal Accessibility & Responsive Design**: WCAG 2.2 AA met. RTL/Arabic parity handled. Responsive breakpoints covered.

## Project Structure

### Documentation (this feature)

```text
specs/014-admin-dashboard-integration/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/
src/
├── app/
│   └── [locale]/
│       └── (admin)/                   # Admin portal
│           ├── dashboard/             # Dashboard overview and KPIs
│           ├── users/                 # User management
│           │   ├── list/
│           │   ├── [id]/
│           │   └── actions/
│           ├── providers/             # Provider management
│           │   ├── list/
│           │   ├── [id]/
│           │   └── verification/
│           ├── analytics/             # Analytics and reporting
│           │   ├── overview/
│           │   ├── revenue/
│           │   ├── users/
│           │   ├── providers/
│           │   ├── bookings/
│           │   └── reviews/
│           ├── support/               # Support and dispute management
│           │   ├── tickets/
│           │   ├── disputes/
│           │   └── conversations/
│           ├── finance/               # Payment and refund management
│           │   ├── payments/
│           │   ├── refunds/
│           │   └── reports/
│           ├── verification/          # Provider verification queue
│           │   ├── pending/
│           │   ├── [id]/
│           │   └── history/
│           ├── reviews/               # Review moderation
│           │   ├── list/
│           │   ├── [id]/
│           │   └── moderation/
│           ├── audit/                 # Activity logs
│           │   ├── admin/
│           │   ├── user/
│           │   └── provider/
│           ├── notifications/         # Admin notifications center
│           │   ├── alerts/
│           │   ├── announcements/
│           │   └── templates/
│           └── settings/              # Admin settings and configuration
├── components/
│   ├── auth/                          # ProtectedRoute, PermissionGuard
│   ├── common/                        # Loading, ErrorBoundary, LanguageSwitcher
│   ├── layout/                        # Header, Footer, Sidebar, ConditionalLayout
│   └── ui/                            # Primitives (button, card, input, data-table)
├── features/                          # Business domain modules
│   ├── analytics/                     # Analytics services and hooks
│   ├── audit/                         # Activity logging services
│   ├── dashboard/                     # Dashboard widgets and KPI components
│   ├── finance/                       # Payment and refund services
│   ├── notifications/                 # Notification center services
│   ├── providers/                     # Provider management services
│   ├── reviews/                       # Review moderation services
│   ├── support/                       # Support and dispute services
│   ├── users/                         # User management services
│   └── verification/                  # Verification workflow services
├── i18n/                              # next-intl config + locale files
├── lib/                               # Shared utilities (axios, navigation, query)
├── messages/                          # ar.json, en.json
├── store/                             # Zustand: useAuthStore, useUIStore
├── types/                             # Global types (api.d.ts)
└── middleware.ts                      # Route protection + i18n redirect
```

**Structure Decision**: Single frontend project with feature-based modularity. All admin functionality will be organized under `src/app/[locale]/(admin)/` route group with corresponding feature modules in `src/features/`. Each domain (users, providers, analytics, etc.) will have its own service layer, hooks, and components.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [No violations - all constitution principles are satisfied] | [N/A] | [N/A] |