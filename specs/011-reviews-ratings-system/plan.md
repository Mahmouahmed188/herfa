# Implementation Plan: Reviews & Ratings System

**Branch**: `011-reviews-ratings-system` | **Date**: 2026-06-18 | **Spec**: [specs/011-reviews-ratings-system/spec.md](./spec.md)

**Input**: Feature specification from `/specs/011-reviews-ratings-system/spec.md`

## Summary

Complete the frontend Reviews & Ratings System by creating a dedicated `src/features/reviews/` module, implementing customer-facing review creation/editing flows, provider rating displays and management dashboard, public review sections, admin moderation integration, booking integration, and notification wiring — all backed by the existing backend Reviews module APIs.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 14.2.15, React 18.3.1

**Primary Dependencies**: TanStack Query 5, Zod 3.23, react-hook-form 7.53, axios 1.7, next-intl 4.7, zustand 5, sonner (toast), lucide-react (icons), date-fns 4, tailwind-merge, class-variance-authority

**Storage**: N/A (frontend only; all data served by backend APIs)

**Testing**: Vitest (unit + component tests as per constitution)

**Target Platform**: Web — Next.js App Router with i18n (`src/app/[locale]/`)

**Project Type**: Web application frontend

**Performance Goals**: Standard web app expectations — review form submission under 2s, list pagination under 1s

**Constraints**: No backend modifications allowed; use backend DTOs as single source of truth; preserve existing design system (colors, theme, branding); no mock data

**Scale/Scope**: ~12 new components, ~8 new pages across customer/provider/admin portals, ~6 API service functions, ~4 TanStack Query hooks, ~6 Zod schemas

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. API-First Architecture**: Every review action maps to an existing backend endpoint. Full API contract discovered in research (9 endpoints: create, list, detail, update, delete, flag, moderate, admin list, analytics). Types and Zod schemas defined in `types/` and `schemas/` before UI. Backend DTOs (request/response shapes) documented in `contracts/`.
- [x] **II. Feature-Based Modularity**: New `src/features/reviews/` module created with `services/`, `hooks/`, `components/`, `schemas/`, `types/` subdirectories. No cross-feature imports from internal review implementation. Review types exported from feature module, consumed by pages.
- [x] **III. Three-Pillar UX**: Customer portal: review creation, edit, history, detail views. Provider portal: rating dashboard, review list, analytics. Admin portal: review moderation (extending existing `ReviewModerator`). Pages placed in correct route groups: `(customer)/reviews/`, `(provider)/reviews/`, `admin/reviews/`.
- [x] **IV. Role-Based Access & Security**: Review creation/editing guarded for customer role only. Provider dashboard guarded for technician role. Admin moderation guarded for admin/super_admin. Public reviews accessible without authentication. `PermissionGuard` wraps action triggers. Moderation actions auditable.
- [x] **V. Server-State Dominance**: TanStack Query used for all review API calls. Query key convention: `['reviews', 'list', ...params]`, `['reviews', 'detail', id]`, `['reviews', 'statistics', providerId]`. Zustand limited to UI-only state (filter selections, pagination). Mutations invalidate relevant query caches on success.
- [x] **VI. Error & Loading State Discipline**: Every review API-consuming component handles loading (skeleton), empty (zero-state message), error (retry action), and success states. Form submission errors mapped to fields via react-hook-form `setError`. Backend validation messages displayed on relevant fields. Sonner toast for success/error feedback.
- [x] **VII. AI Feature Integrity**: N/A — no AI features in reviews.
- [x] **VIII. Universal Accessibility & Responsive Design**: All review pages support RTL/Arabic parity via `next-intl`. Star rating component keyboard-navigable (arrow keys, enter). Data tables use existing `DataTable` component with responsive breakpoints. Forms have associated labels. Review cards accessible.

## Project Structure

### Documentation (this feature)

```text
specs/011-reviews-ratings-system/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output — backend API discovery
├── data-model.md        # Phase 1 output — review entity definitions
├── quickstart.md        # Phase 1 output — developer setup guide
├── contracts/           # Phase 1 output — API contracts
│   ├── reviews-api.md
│   ├── provider-ratings-api.md
│   ├── public-reviews-api.md
│   └── admin-reviews-api.md
├── checklists/
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/[locale]/
│   ├── (customer)/reviews/          # Customer review pages
│   │   ├── page.tsx                  # My reviews (history)
│   │   ├── new/[bookingId]/page.tsx   # Create review
│   │   └── [reviewId]/page.tsx       # Review detail
│   ├── (customer)/technicians/[id]/  # Public provider profile (add reviews section)
│   └── (provider)/reviews/           # Provider review pages
│       ├── page.tsx                   # Reviews dashboard
│       └── [reviewId]/page.tsx        # Review detail (provider view)
├── features/
│   └── reviews/                      # NEW: Reviews feature module
│       ├── services/
│       │   └── api.ts                # Review API calls (axios-based)
│       ├── hooks/
│       │   ├── useReviews.ts         # useQuery hooks for reviews
│       │   ├── useReviewMutations.ts # useMutation hooks for CRUD
│       │   └── useRatingStats.ts     # useQuery for provider rating stats
│       ├── components/
│       │   ├── ReviewForm.tsx         # Create/edit review form
│       │   ├── StarRating.tsx         # Star rating input component
│       │   ├── ReviewCard.tsx         # Single review display card
│       │   ├── ReviewList.tsx         # Paginated review list
│       │   ├── RatingSummary.tsx      # Average + distribution display
│       │   ├── ModerationBadge.tsx    # Moderation state indicator
│       │   └── ReviewDashboard.tsx    # Provider review dashboard
│       ├── schemas/
│       │   └── validation.ts         # Zod schemas for review forms
│       └── types/
│           └── index.ts              # Review-related TypeScript interfaces
├── components/
│   └── ui/
│       └── star-rating.tsx            # Reusable star rating display
└── messages/                         # Add review-related i18n keys
    ├── ar.json
    └── en.json
```

**Structure Decision**: Single-project web application (Next.js). New `src/features/reviews/` module following existing feature module patterns (bookings, support, providers). Pages in respective portal route groups. UI primitives (`star-rating`) in `src/components/ui/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations anticipated — design follows existing patterns.

## Phase 0: Outline & Research

### Research Tasks

Based on the spec and technical context, the following backend API details must be discovered:

| # | Unknown | Feature Context | Research Approach |
|---|---------|-----------------|-------------------|
| 1 | Review creation endpoint | FR-001: Customers create reviews | Discover `POST /reviews` or `POST /bookings/{id}/review` endpoint, request DTO, validation rules |
| 2 | Review update endpoint | FR-005: Customers edit reviews | Discover `PUT /reviews/{id}` or `PATCH /reviews/{id}` endpoint, ownership validation |
| 3 | Review detail endpoint | FR-009: Review details view | Discover `GET /reviews/{id}` response DTO, moderation status exposure |
| 4 | Customer review history endpoint | FR-010: Customer review history | Discover `GET /reviews?customer={id}` or `GET /customers/{id}/reviews` with pagination/filtering |
| 5 | Provider review list endpoint | FR-015: Provider views received reviews | Discover `GET /providers/{id}/reviews` existing endpoint, verify filtering/sorting support |
| 6 | Provider rating statistics endpoint | FR-014: Rating summary | Discover `GET /providers/{id}/ratings` or `GET /providers/{id}/stats` response shape |
| 7 | Public reviews endpoint | FR-017: Public reviews | Verify `GET /providers/{id}/reviews` public accessibility rules |
| 8 | Review submission eligibility endpoint | FR-024: Only eligible bookings | Discover `GET /bookings/{id}/review-eligibility` or similar |
| 9 | Review notification events | FR-028: Notification integration | Discover WebSocket events with `review.*` pattern, notification types |
| 10 | Admin review moderation endpoints | Existing `GET /admin/reviews`, `DELETE /admin/reviews/{id}` | Verify full moderation workflow (approve, reject, flag) |
| 11 | Review DTO structures | All review features | Map all request/response DTOs: ReviewRequest, ReviewResponse, RatingStats, PaginatedReviewList |
| 12 | Backend validation rules | FR-003, FR-007 | Discover min/max comment length, rating range, duplicate prevention, booking status eligibility |

### Execution

Research will be conducted by:
1. Analyzing the backend codebase (controllers, DTOs, entities) for the Reviews module
2. Examining existing frontend API calls to understand patterns
3. Consolidating findings in `research.md`

## Phase 1: Design & Contracts

**Prerequisites**: `research.md` complete

1. **Data Model**: Extract entities from spec + backend DTOs → `data-model.md`:
   - Review (full DTO shape)
   - RatingStatistics (aggregated provider stats)
   - ModerationState enum
   - ReviewEvent (notification types)
   - State transitions: DRAFT → SUBMITTED → MODERATED

2. **Interface Contracts**: Document all API contracts in `contracts/`:
   - `reviews-api.md` — CRUD endpoints for customer reviews
   - `provider-ratings-api.md` — Provider rating statistics
   - `public-reviews-api.md` — Public review display
   - `admin-reviews-api.md` — Admin moderation endpoints
   - `websocket-events.md` — Review notification events (if applicable)

3. **Quickstart**: Developer setup guide in `quickstart.md`

4. **Agent Context Update**: Update `AGENTS.md` to reference this plan file

## Phase 2: Task Generation

*Not performed by this command. Run `/speckit.tasks` after Phase 1 artifacts are complete.*
