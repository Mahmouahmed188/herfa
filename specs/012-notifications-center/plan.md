# Implementation Plan: Notifications Center

**Branch**: `012-notifications-center` | **Date**: 2026-06-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/012-notifications-center/spec.md`

## Summary

Complete the Notifications Center by integrating all notification-related business functionality with the backend Notifications Module. Implement notification list (paginated, filterable), read/unread management (single + bulk), notification details with deep-link navigation, announcements system (page + global banner), real-time updates (WebSocket with polling fallback), provider notification page, and dashboard integrations. Remove all mock data, align frontend API calls with backend specification, and generate an API audit report.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 14+ (App Router)

**Primary Dependencies**: TanStack Query (server state), Zustand (UI state), next-intl (i18n), Zod (validation), Radix UI (accessible primitives), Tailwind CSS (styling), Socket.io-client (real-time notifications)

**Storage**: Notifications and announcements data served by backend API (Prisma/PostgreSQL). No local persistence.

**Testing**: Vitest + React Testing Library for unit/integration tests. Playwright for E2E critical paths.

**Target Platform**: Web — desktop (>1024px), tablet (640-1024px), mobile (<640px). Responsive design using existing breakpoints.

**Project Type**: Web application (Next.js frontend with separate backend API)

**Performance Goals**: Notifications page loads within 2 seconds. Unread counter updates within 1 second after mark-read action. Notification list pagination responds within 1 second per page.

**Constraints**: No backend code modifications. Must use existing design system (colors, typography, spacing, components). Must preserve existing page layouts and visual identity. Must use backend as single source of truth for all data.

**Scale/Scope**: All registered users (customers, providers, admins). Estimated 10,000+ active users with up to 100 notifications per user.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. API-First Architecture**: Every frontend notification action maps to a documented backend endpoint. Service layer types and Zod schemas exist and must be aligned with backend API spec. No mock data is present.
- [x] **II. Feature-Based Modularity**: Notification code lives in `src/features/notifications/`. Announcements are handled within this module. Cross-feature imports (e.g., from reviews, bookings) are through shared types only.
- [ ] **III. Three-Pillar UX**: Customer notification page exists at `/client/notifications`. Admin notification center exists at `/admin/notifications`. **Provider notification page is missing** — must be created under `(provider)` route group.
- [x] **IV. Role-Based Access & Security**: All notification endpoints require JWT auth. Admin announcement endpoints require `admin`/`super_admin` role. Route guards must be confirmed for provider notification page.
- [ ] **V. Server-State Dominance**: TanStack Query is used for all notification API calls. However, some inline hooks in `HeaderActions.tsx` duplicate logic from `useCustomerNotifications.ts` — should be consolidated.
- [x] **VI. Error & Loading State Discipline**: Notification components handle loading (spinner/skeleton), empty state (bell icon with message), and error states. Must verify all new components follow same pattern.
- [x] **VII. AI Feature Integrity**: Not applicable — Notifications Center does not involve AI features.
- [x] **VIII. Universal Accessibility & Responsive Design**: Existing notification components use i18n keys and support RTL. New components must follow same patterns. Responsive breakpoints must be maintained.

## Project Structure

### Documentation (this feature)

```text
specs/012-notifications-center/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 research findings
├── data-model.md        # Phase 1 data model
├── quickstart.md        # Phase 1 quickstart guide
├── contracts/           # API contracts
│   ├── notifications-api.md
│   ├── announcements-api.md
│   └── websocket-events.md
├── checklists/
│   └── requirements.md  # Quality checklist
└── tasks.md             # Phase 2 task breakdown
```

### Source Code (repository root)

```text
src/
├── app/[locale]/
│   ├── (customer)/
│   │   ├── dashboard/       # Already has notification widget
│   │   └── notifications/   # Existing page — enhance
│   ├── (provider)/
│   │   └── notifications/   # NEW — create provider notifications page
│   ├── (admin)/
│   │   └── notifications/   # Existing page — enhance
│   └── announcements/       # NEW — public announcements page
├── features/
│   └── notifications/       # Enhancement target
│       ├── types/
│       ├── schemas/
│       ├── services/
│       ├── hooks/
│       └── components/
│           ├── NotificationCard.tsx
│           ├── CustomerNotificationList.tsx
│           ├── BroadcastNotificationManager.tsx
│           ├── TemplateEditor.tsx
│           ├── AnnouncementBanner.tsx     # NEW
│           ├── AnnouncementCard.tsx       # NEW
│           └── NotificationDetail.tsx     # NEW
└── components/
    └── layout/
        ├── HeaderActions.tsx   # Already has bell + dropdown
        └── AppSidebar.tsx      # Already has badge — enhance for provider
```

**Structure Decision**: Single Next.js frontend project. Feature modules under `src/features/`. Pages under locale-specific route groups matching user role.

## Complexity Tracking

No Constitution violations requiring justification.
