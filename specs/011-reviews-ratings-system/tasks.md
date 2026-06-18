# Tasks: Reviews & Ratings System

**Input**: Design documents from `/specs/011-reviews-ratings-system/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Features**: `src/features/reviews/` with `components/`, `hooks/`, `services/`, `types/`, `schemas/`
- **Routes**: `src/app/[locale]/`
- **Shared UI**: `src/components/ui/`
- **Messages**: `src/messages/`
- **Docs**: `docs/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the feature module directory structure and define data contracts

- [ ] T001 Create `src/features/reviews/` directory structure with subdirectories: `components/`, `hooks/`, `services/`, `schemas/`, `types/`
- [ ] T002 [P] Define TypeScript interfaces in `src/features/reviews/types/index.ts` — Review, ReviewCreateRequest, ReviewUpdateRequest, RatingStats, PaginatedResponse wrapper, and ModerationState enum
- [ ] T003 [P] Define Zod validation schemas in `src/features/reviews/schemas/validation.ts` — reviewCreateSchema (rating: 1-5 int, comment: optional string), reviewUpdateSchema matching backend DTO validation rules
- [ ] T004 [P] Add review-related i18n keys to `src/messages/en.json` and `src/messages/ar.json` for all review UI text (create, edit, history, ratings, moderation, empty states, errors)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: API service layer, TanStack Query hooks, and shared components that ALL user stories depend on

- [ ] T005 Implement review API service in `src/features/reviews/services/api.ts` using axios from `src/lib/axios.ts` — `POST /reviews`, `GET /reviews`, `GET /reviews/provider`, `GET /reviews/:id`, `PATCH /reviews/:id`, `DELETE /reviews/:id`, `POST /reviews/:id/flag` — each returning typed responses
- [ ] T006 [P] Implement provider review API in `src/features/reviews/services/api.ts` — `GET /providers/:providerId/reviews` for public/provider review list with pagination params
- [ ] T007 [P] Implement TanStack Query hooks in `src/features/reviews/hooks/useReviews.ts` — `useReviewList(params)`, `useProviderReviewList(providerId, params)`, `useReviewDetail(id)` with query key convention `['reviews', 'list', ...params]`, `['reviews', 'detail', id]`
- [ ] T008 [P] Implement TanStack Query mutation hooks in `src/features/reviews/hooks/useReviewMutations.ts` — `useCreateReview()`, `useUpdateReview()`, `useDeleteReview()`, `useFlagReview()` with proper cache invalidation on success
- [ ] T009 [P] Implement TanStack Query hooks in `src/features/reviews/hooks/useRatingStats.ts` — `useProviderRatingStats(providerId)` query
- [ ] T010 [P] Create reusable `StarRating` display component in `src/components/ui/star-rating.tsx` — read-only star display with half-star support, RTL-aware, keyboard accessible
- [ ] T011 [P] Create interactive `StarRating` input component in `src/features/reviews/components/StarRating.tsx` — click/hover star selection, keyboard navigation (arrow keys), form integration support

**Checkpoint**: Foundation ready — API services, hooks, and shared UI primitives available for all user stories

---

## Phase 3: User Story 1 — Customer Creates a Review (Priority: P1) 🎯 MVP

**Goal**: Customer can create a review for a completed booking with star rating and optional comment

**Independent Test**: Customer navigates to a completed booking, fills out review form (star rating + optional comment), submits, and receives success confirmation

- [ ] T012 [P] [US1] Build `ReviewForm` component in `src/features/reviews/components/ReviewForm.tsx` — integrates StarRating input, comment textarea, React Hook Form with Zod resolver, displays backend validation errors via `setError`
- [ ] T013 [US1] Create review creation page at `src/app/[locale]/(customer)/reviews/new/[bookingId]/page.tsx` — loads booking context, validates eligibility, renders ReviewForm, handles submission feedback via sonner toast
- [ ] T014 [US1] Add review creation link to completed booking details page — show "Write a Review" action on completed bookings in `src/features/bookings/components/` if review not already submitted
- [ ] T015 [US1] Add booking eligibility check — verify booking is completed and no review exists before showing create review page

**Checkpoint**: MVP complete — customers can successfully submit reviews for completed bookings

---

## Phase 4: User Story 5 — Provider Views Ratings and Reviews Received (Priority: P1)

**Goal**: Provider can view their rating summary (average, distribution, count) and browse all reviews from customers

**Independent Test**: Provider navigates to their reviews page, sees average rating, rating distribution, total count, and a paginated list of all customer reviews

- [ ] T016 [P] [US5] Build `RatingSummary` component in `src/features/reviews/components/RatingSummary.tsx` — displays average rating, total review count, and per-star distribution bar chart using existing Recharts components
- [ ] T017 [P] [US5] Build `ReviewCard` component in `src/features/reviews/components/ReviewCard.tsx` — displays rating, comment text, reviewer name, creation date, and moderation badge (if exposed)
- [ ] T018 [P] [US5] Build `ReviewList` component in `src/features/reviews/components/ReviewList.tsx` — paginated list using ReviewCard with sorting (date, rating) and empty state ("No reviews yet")
- [ ] T019 [US5] Create provider reviews page at `src/app/[locale]/(provider)/reviews/page.tsx` — renders RatingSummary + ReviewList with data from `useProviderReviewList()` and `useProviderRatingStats()`
- [ ] T020 [US5] Add provider reviews link to provider navigation sidebar

**Checkpoint**: Providers can see their full ratings and review data

---

## Phase 5: User Story 2 — Customer Edits Their Existing Review (Priority: P2)

**Goal**: Customer can edit their previously submitted review (rating and/or comment)

**Independent Test**: Customer navigates to an existing review, edits rating/comment in a pre-filled form, submits, and sees updated review data

- [ ] T021 [P] [US2] Add edit mode to `ReviewForm` component in `src/features/reviews/components/ReviewForm.tsx` — accept optional `initialData` prop for pre-filling rating and comment
- [ ] T022 [US2] Create review edit page at `src/app/[locale]/(customer)/reviews/[reviewId]/edit/page.tsx` — loads existing review data via `useReviewDetail()`, renders ReviewForm in edit mode, submits via `useUpdateReview()`, refreshes on success
- [ ] T023 [US2] Add "Edit Review" action link to review detail view for the review owner
- [ ] T024 [US2] Handle ownership validation — show error state if non-owner tries to access edit page (backend enforces, frontend shows 403 response)

**Checkpoint**: Customers can edit their reviews with pre-filled form and data refresh

---

## Phase 6: User Story 3 — View Review Details (Priority: P2)

**Goal**: Any user (customer/provider) can view full review details including metadata and moderation status

**Independent Test**: User navigates to a review detail page and sees rating, comment, timestamps, reviewer/provider info, and moderation status (if exposed)

- [ ] T025 [P] [US3] Create customer review detail page at `src/app/[locale]/(customer)/reviews/[reviewId]/page.tsx` — renders ReviewCard with full details, timestamps, provider info
- [ ] T026 [P] [US3] Create provider review detail page at `src/app/[locale]/(provider)/reviews/[reviewId]/page.tsx` — renders ReviewCard with full details, reviewer info, customer info
- [ ] T027 [US3] Build `ModerationBadge` component in `src/features/reviews/components/ModerationBadge.tsx` — displays moderation state (PENDING/APPROVED/FLAGGED/REJECTED) as colored badge, only shown when backend exposes it

**Checkpoint**: Review detail views work for both customers and providers

---

## Phase 7: User Story 4 — Customer Views Their Review History (Priority: P2)

**Goal**: Customer can see all their written reviews in a paginated, filterable, sortable list

**Independent Test**: Customer with multiple reviews navigates to history page, applies filters/sorting, navigates pages, clicks into a review detail

- [ ] T028 [P] [US4] Create customer review history page at `src/app/[locale]/(customer)/reviews/page.tsx` — renders ReviewList with `useReviewList()` hook, pagination controls, filter sidebar (by date range, rating, status), sort selector
- [ ] T029 [US4] Add review history link to customer navigation sidebar and customer dashboard

**Checkpoint**: Customers can browse, filter, and sort their full review history

---

## Phase 8: User Story 6 — Public User Views Provider Reviews (Priority: P2)

**Goal**: Unauthenticated users can see a provider's public reviews and rating summary on their public profile

**Independent Test**: Unauthenticated user visits a provider's public profile, sees rating summary and paginated reviews

- [ ] T030 [P] [US6] Add reviews section to public provider profile at `src/app/[locale]/technicians/[id]/page.tsx` — renders RatingSummary and ReviewList using public endpoint, handles authentication-gated data hiding
- [ ] T031 [US6] Ensure public reviews section gracefully handles unauthenticated state — show public data only, no auth prompts for review data that is publicly accessible

**Checkpoint**: Public provider profiles display reviews without requiring login

---

## Phase 9: User Story 7 — Provider Review Dashboard (Priority: P3)

**Goal**: Provider has a dashboard with aggregated metrics, recent reviews, and trends

**Independent Test**: Provider accesses review dashboard, sees aggregated metrics, recent reviews, and trend data (when available)

- [ ] T032 [P] [US7] Build `ReviewDashboard` component in `src/features/reviews/components/ReviewDashboard.tsx` — aggregates RatingSummary, recent reviews list (latest 5), and trend chart (when data available)
- [ ] T033 [US7] Enhance provider reviews page at `src/app/[locale]/(provider)/reviews/page.tsx` — add trend visualization section using Recharts when backend provides `/analytics/reviews` data, gracefully hide when unavailable
- [ ] T034 [US7] Add analytics integration — attempt to fetch trend data from `/analytics/reviews` endpoint, silently degrade if endpoint not available

**Checkpoint**: Provider review dashboard shows full analytics with graceful degradation

---

## Phase 10: User Story 8 — Moderation Awareness (Priority: P3)

**Goal**: Review display respects moderation states (hidden, flagged, removed, pending) according to backend rules

**Independent Test**: Reviews in various moderation states display appropriate indicators; restricted info never exposed

- [ ] T035 [P] [US8] Integrate `ModerationBadge` into `ReviewCard` — show moderation state indicator on review cards when backend exposes it
- [ ] T036 [P] [US8] Implement hidden/removed review handling — display placeholder text ("This review is not available") instead of content for moderated reviews, based on `isApproved` + `isFlagged` backend fields
- [ ] T037 [US8] Update admin review moderation — integrate existing `ReviewModerator` component from `src/features/support/` with new review module types, ensuring admin can approve/reject/flag reviews

**Checkpoint**: All moderation states handled correctly across review displays

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Booking integration, notification wiring, API audit, and cleanup

- [ ] T038 [P] Link completed bookings to review creation — update booking detail views in `src/features/bookings/` to show "Write a Review" button only when booking is completed and no review exists; show "View Review" if review already submitted
- [ ] T039 [P] Wire review notification events — listen for `review.created`, `review.updated`, `review.moderated` notification types from existing notification WebSocket; invalidate `['reviews', ...]` query cache on receive; display toast for new notifications
- [ ] T040 [P] Remove any mock review data from components — scan codebase for hardcoded review/rating data in landing page components (`TechniciansSection`, `TechnicianPreview`) and replace with real API calls where possible, or remove if no backend integration exists
- [ ] T041 Generate API audit document at `docs/reviews-ratings-audit.md` — document all 9 backend review endpoints with frontend coverage status, DTO mismatches, path mismatches, permission mappings, and required fixes
- [ ] T042 Final validation — run `npm run lint`, `npm run type-check`, `npm test` across all modified files; verify no TypeScript errors, no lint violations, and all existing tests pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Story 1 (Phase 3, P1)**: Depends on Foundational — MVP candidate, no other stories needed
- **User Story 5 (Phase 4, P1)**: Depends on Foundational — independent of US1
- **User Story 2 (Phase 5, P2)**: Depends on Foundational + US1 (editing requires creation infrastructure)
- **User Story 3 (Phase 6, P2)**: Depends on Foundational — independent of US1/US5
- **User Story 4 (Phase 7, P2)**: Depends on Foundational + US1 (history lists created reviews)
- **User Story 6 (Phase 8, P2)**: Depends on Foundational — independent of other stories
- **User Story 7 (Phase 9, P3)**: Depends on Foundational + US5 (dashboard extends provider ratings)
- **User Story 8 (Phase 10, P3)**: Depends on Foundational + all UI stories (moderation impacts all review displays)
- **Polish (Phase 11)**: Depends on all desired user stories

### User Story Dependencies

- **US1 (P1) MVP**: Can start after Foundational — independent
- **US5 (P1)**: Can start after Foundational — independent of US1
- **US2 (P2)**: Depends on US1 (shares ReviewForm component)
- **US3 (P2)**: Can start after Foundational — independent
- **US4 (P2)**: Depends on US1 (shows list of created reviews)
- **US6 (P2)**: Can start after Foundational — independent
- **US7 (P3)**: Depends on US5 (extends provider ratings page)
- **US8 (P3)**: Depends on all UI stories (moderation badge integrated into cards/lists)

### Parallel Opportunities

| Phase | Parallel Tasks |
|-------|---------------|
| Phase 1 | T002, T003, T004 (types, schemas, i18n) |
| Phase 2 | T006, T007, T008, T009, T010, T011 (API, hooks, UI primitives) |
| Phase 3 (US1) | T012 |
| Phase 4 (US5) | T016, T017, T018 (RatingSummary, ReviewCard, ReviewList) |
| Phase 5 (US2) | None sequential |
| Phase 6 (US3) | T025, T026 (customer + provider detail pages) |
| Phase 7 (US4) | T028 |
| Phase 8 (US6) | T030 |
| Phase 9 (US7) | T032 |
| Phase 10 (US8) | T035, T036 (badge + hidden handling) |
| Phase 11 | T038, T039, T040, T041 (polish, notifications, audit) |

---

## Parallel Example: Phase 2 — Foundational

```bash
# Launch all foundational tasks together:
Task: "Implement review API service in src/features/reviews/services/api.ts"
Task: "Implement provider review API in src/features/reviews/services/api.ts"
Task: "Implement TanStack Query hooks in src/features/reviews/hooks/useReviews.ts"
Task: "Implement TanStack Query mutation hooks in src/features/reviews/hooks/useReviewMutations.ts"
Task: "Implement TanStack Query hooks in src/features/reviews/hooks/useRatingStats.ts"
Task: "Create reusable StarRating display component in src/components/ui/star-rating.tsx"
Task: "Create interactive StarRating input component in src/features/reviews/components/StarRating.tsx"
```

## Parallel Example: Phase 4 — User Story 5 (P1)

```bash
# Launch all US5 components together:
Task: "Build RatingSummary component"
Task: "Build ReviewCard component"
Task: "Build ReviewList component"
```

## Parallel Example: Phase 6 — User Story 3 (P2)

```bash
# Launch customer + provider detail pages together:
Task: "Create customer review detail page"
Task: "Create provider review detail page"
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 (Customer Creates Review)
4. **STOP and VALIDATE**: Test US1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Create Review) + US5 (Provider Ratings) → Test independently → Deploy/Demo (MVP!)
3. Add US3 (Review Details) + US6 (Public Reviews) → Test independently → Deploy/Demo
4. Add US4 (History) + US2 (Edit Review) → Test independently → Deploy/Demo
5. Add US7 (Dashboard) + US8 (Moderation) → Test independently → Deploy/Demo
6. Add Polish (Notifications, Booking Integration, Audit) → Final

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (Create Review) + US2 (Edit Review)
   - Developer B: US5 (Provider Ratings) + US7 (Provider Dashboard)
   - Developer C: US3 (Review Details) + US6 (Public Reviews)
   - Developer D: US4 (Review History) + US8 (Moderation)
3. All stories integrate and merge independently
4. Polish phase done together

---

## Notes

- [P] tasks = different files, no dependencies — can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Verify each checkpoint before proceeding
- Commit after each task or logical group
- No backend modifications — all tasks are frontend only
- Backend DTOs and API paths from `contracts/` are source of truth
