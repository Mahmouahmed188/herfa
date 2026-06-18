# Implementation Plan: Booking Lifecycle Completion

**Branch**: `009-booking-lifecycle-completion` | **Date**: 2026-06-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/009-booking-lifecycle-completion/spec.md`

## Summary

Complete the Booking Lifecycle workflow by consolidating booking API calls into the axios-based feature service, aligning booking status enums across all definitions, creating the missing customer booking detail page, enhancing the timeline with backend data, adding cancellation flow, implementing active tracking with WebSocket support, integrating booking notifications, adding provider booking management, removing mock booking data, and generating a comprehensive API audit document. No backend code modifications — all work is frontend integration against existing API contracts.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 14 (App Router)

**Primary Dependencies**: React 18, TanStack Query (React Query) 5.x, Zustand, Zod, next-intl, Axios, React Hook Form, date-fns, sonner, lucide-react

**Storage**: N/A — all data served by backend APIs. No local persistence beyond Zustand auth store.

**Testing**: Vitest + React Testing Library (unit/integration), Playwright (E2E).

**Target Platform**: Web — Next.js 14 App Router with RTL/Arabic support. Customer booking under `src/app/[locale]/client/`, provider booking under `src/app/[locale]/technician/`, admin booking under `src/app/[locale]/(dashboard)/`.

**Project Type**: Web application (Next.js frontend with REST API backend, WebSocket for real-time tracking)

**Performance Goals**: Booking detail page loads in under 2 seconds. Booking list paginates in under 1 second. Tracking updates via WebSocket within 500ms. Cancellation confirms within 3 seconds.

**Constraints**: Existing design system must be preserved (colors, theme, branding, components). No backend code modifications allowed. Must use backend API contracts as single source of truth.

**Scale/Scope**: Completes booking lifecycle. Impacts ~8 pages, ~15 components, ~10 API endpoints (some already exist).

**NEEDS CLARIFICATION**:
- WebSocket endpoint URL and authentication method — assumed to be `wss://api.example.com/ws/tracking/:bookingId` with token query param, matching common patterns
- Backend tracking session endpoint path — assumed `GET /tracking/:bookingId` based on existing conventions
- Whether `ASSIGNED` status exists in backend (between PENDING and ACCEPTED) — assumed yes per spec

## Constitution Check

*GATE RE-EVALUATION AFTER PHASE 1 DESIGN*

- [x] **I. API-First Architecture**: Does every feature map to an existing backend endpoint? Are service layer types and Zod schemas defined before UI? → **PASS** — 4 API contracts documented (booking, jobs, tracking, notifications). Existing Zod schemas need extension for new statuses. Design consolidates dual API clients into one feature module.
- [x] **II. Feature-Based Modularity**: Does the design place code in `src/features/[domain]/`? Are cross-feature imports avoided? → **PASS** — All booking logic stays in `src/features/bookings/`. Notification integration adds booking types to `src/features/notifications/`. No new feature directories created.
- [x] **III. Three-Pillar UX**: Is the UX tailored to the target user (Customer, Provider, or Admin)? Is the portal route group correct? → **PASS** — Customer booking pages under `(client)/`, provider booking under `technician/`, admin booking under `(dashboard)/`.
- [x] **IV. Role-Based Access & Security**: Are route, component, and action-level permission guards defined? Are sensitive actions auditable? → **PASS** — Existing RBAC middleware guards admin routes. Booking ownership checks in detail page. Cancellation is inherently audit-trailed via status change history. Provider actions require valid assignment.
- [x] **V. Server-State Dominance**: Is TanStack Query used for server data? Is Zustand limited to transient UI state? → **PASS** — Design specifies TanStack Query hooks for all booking endpoints with proper cache invalidation on mutations.
- [x] **VI. Error & Loading State Discipline**: Are loading, empty, error, and success states defined for every API-consuming component? → **PASS** — All booking components implement the four-state pattern (loading skeleton, empty state, error with retry, success display).
- [x] **VII. AI Feature Integrity**: If AI features are involved, are they wired to the backend AI Gateway (not mocked)? → **N/A** — No AI features in booking scope.
- [x] **VIII. Universal Accessibility & Responsive Design**: Is WCAG 2.2 AA met? Is RTL/Arabic parity handled? Are breakpoints covered? → **PASS** — Reuses existing design system which already handles RTL, responsive breakpoints, and accessibility.

## Project Structure

### Documentation (this feature)

```text
specs/009-booking-lifecycle-completion/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── booking-api.md
│   ├── jobs-api.md
│   ├── tracking-api.md
│   └── notifications-api.md
└── checklists/
    └── requirements.md  # Quality checklist
```

### Source Code (repository root)

```text
src/features/bookings/
├── types/
│   └── index.ts                        # EXTEND: add ASSIGNED, ON_THE_WAY to BookingStatus
├── schemas/
│   └── validation.ts                   # EXTEND: update status enum in customerBookingSchema
├── services/
│   └── api.ts                          # CONSOLIDATE: add createBooking, cancelBooking, getMyJobs, getJobById,
│                                       #   cancelJob, getAssignedJobs, getAvailableJobs, acceptJob,
│                                       #   rejectJob, updateJobStatus; align Booking.status enum
├── hooks/
│   ├── useCustomerBookings.ts          # UPDATE: use axios booking API instead of fetchWithAuth
│   ├── useBookingDetail.ts             # UPDATE: use axios booking API instead of fetchWithAuth
│   ├── useActiveBookings.ts            # UPDATE: use axios booking API instead of fetchWithAuth
│   ├── useBookingTimeline.ts           # NEW: fetch booking timeline from API
│   ├── useCancelBooking.ts             # NEW: mutation hook for cancellation
│   └── useTracking.ts                  # NEW: tracking session hook with WebSocket support
├── components/
│   ├── BookingTimeline.tsx             # ENHANCE: extend event types to cover all lifecycle events
│   ├── CancelBookingDialog.tsx         # NEW: cancellation reason + confirmation dialog
│   ├── BookingTracking.tsx             # NEW: tracking display component (status, events, ETA, location)
│   ├── TrackingMap.tsx                 # NEW: provider location display
│   └── BookingNotifications.tsx        # NEW: booking notification hooks and types
└── pages/ (under app router)
    └── ...

src/app/[locale]/client/jobs/
├── page.tsx                            # EXISTS: customer jobs list (unchanged)
└── [id]/
    └── page.tsx                        # NEW: customer booking detail page

src/app/[locale]/client/
├── dashboard/page.tsx                  # EXISTS: customer dashboard (may need minor updates)
└── tracking/[id]/page.tsx              # NEW: active booking tracking page (optional standalone page)

src/app/[locale]/technician/jobs/
├── page.tsx                            # ENHANCE: add accept/reject and status update functionality

src/features/notifications/
├── types/
│   └── index.ts                        # EXTEND: add booking-specific notification types (BOOKING_CREATED,
│                                       #   BOOKING_ACCEPTED, BOOKING_ASSIGNED, BOOKING_STARTED,
│                                       #   BOOKING_COMPLETED, BOOKING_CANCELLED)
├── hooks/
│   └── useBookingNotifications.ts      # NEW: booking notification hooks with bookingId link

src/app/[locale]/(dashboard)/bookings/
└── [id]/page.tsx                       # EXISTS: admin booking detail (may need status enum update)

docs/
└── booking-lifecycle-audit.md          # NEW: API audit report
```

**Structure Decision**: All booking business logic stays in `src/features/bookings/`. Notification integration adds booking-specific types and hooks to `src/features/notifications/`. No new feature directories are created — the booking feature already exists and is extended.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No unjustified violations. Identified gaps will be addressed during implementation.
