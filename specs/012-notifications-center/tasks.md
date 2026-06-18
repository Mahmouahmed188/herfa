---

description: "Task list for Notifications Center feature implementation"

---

# Tasks: Notifications Center

**Input**: Design documents from `specs/012-notifications-center/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in spec — omit test tasks unless needed for verification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Features**: `src/features/notifications/`
  - `components/`, `hooks/`, `services/`, `types/`, `schemas/`
- **Routes**: `src/app/[locale]/`
- **Shared UI**: `src/components/ui/`
- **Shared API**: `src/services/api.ts`
- **Layout**: `src/components/layout/`
- **Messages**: `src/messages/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Feature initialization and basic structure

- [X] T001 Create provider notifications page directory at `src/app/[locale]/(provider)/notifications/`
- [X] T002 [P] Extend `notificationTypeSchema` in `src/features/notifications/schemas/validation.ts` to include all notification types (booking, tracking, payment, review, verification, support)
- [X] T003 [P] Add `PaymentNotificationType`, `ReviewNotificationType`, `SupportNotificationType` unions to `src/features/notifications/types/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic and API integration that MUST be complete before ANY UI work

- [X] T004 Align mark-read API calls in `src/services/api.ts`: change `POST /notifications/mark-read` to `PATCH /notifications/:id/read` (single) and `PATCH /notifications/read-all` (bulk) per backend spec
- [X] T005 [P] Add `markNotificationAsRead(id)` function to `src/services/api.ts` for single notification read
- [X] T006 [P] Add `markAllNotificationsAsRead()` function to `src/services/api.ts` for bulk read-all
- [X] T007 [P] Update `useMarkAsRead()` mutation hook in `src/features/notifications/hooks/useCustomerNotifications.ts` to use new single + bulk endpoints and properly invalidate `['notifications']` and `['notifications', 'unread-count']` caches
- [X] T008 Consolidate duplicate notification hooks from `src/components/layout/HeaderActions.tsx` into `src/features/notifications/hooks/useCustomerNotifications.ts` and import shared hooks
- [X] T009 Configure localized notification messages in `src/messages/ar.json` and `src/messages/en.json` for all notification-related UI text

**Checkpoint**: Foundation ready — UI implementation can now begin in parallel

---

## Phase 3: User Story 1 — View and Manage Personal Notifications (Priority: P1) 🎯 MVP

**Goal**: Users can view their chronological notification list with pagination, see read/unread status, filter by status.

**Independent Test**: Verify a logged-in user can open the notification center, see notifications in reverse chronological order, paginate through them, and filter by read/unread status.

### Implementation for User Story 1

- [X] T010 [P] [US1] Enhance `NotificationCard` in `src/features/notifications/components/NotificationCard.tsx` to handle deep link routing for all notification types from data-model.md routing map
- [X] T011 [US1] Add page-based pagination controls to `CustomerNotificationList` in `src/features/notifications/components/CustomerNotificationList.tsx` with Previous/Next buttons and page indicator
- [X] T012 [P] [US1] Add filter dropdown (All / Read / Unread) to customer notifications page at `src/app/[locale]/client/notifications/page.tsx`
- [X] T013 [US1] Wire filter state and pagination to `useCustomerNotifications(page, limit, filters)` query hook in `src/features/notifications/hooks/useCustomerNotifications.ts`
- [X] T014 [US1] Add empty state ("No notifications" with bell icon) and error state (retry button) to `CustomerNotificationList`
- [X] T015 [US1] Create provider notifications page at `src/app/[locale]/(provider)/notifications/page.tsx` reusing `CustomerNotificationList` with provider-appropriate header and navigation

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 — Bulk Read Management and Unread Counter (Priority: P1)

**Goal**: Users can mark all notifications as read, see live unread counter in sidebar and header badges.

**Independent Test**: Verify unread badge shows correct count, clicking "Mark All as Read" resets counter to zero, and marking a single notification decreases the count by one.

### Implementation for User Story 2

- [X] T016 [P] [US2] Add "Mark All as Read" button to customer notifications page at `src/app/[locale]/client/notifications/page.tsx` wired to `useMarkAllAsRead()` 
- [X] T017 [P] [US2] Add "Mark All as Read" button to provider notifications page at `src/app/[locale]/(provider)/notifications/page.tsx` using shared mutation hook
- [X] T018 [US2] Add unread count badge to provider sidebar in `src/components/layout/AppSidebar.tsx` using `useUnreadCount()` hook
- [X] T019 [US2] Ensure automatic unread counter refresh after mark-read mutations by adding `refetchInterval: 30000` to `useUnreadCount()` and invalidating on mutation success

**Checkpoint**: User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 — Browse and Acknowledge Announcements (Priority: P2)

**Goal**: Users can view platform announcements, see active banners, and browse archived announcements.

**Independent Test**: Verify an announcement appears on the announcements page with correct title/content/date, and an active important announcement shows as a global banner.

### Implementation for User Story 3

- [X] T020 [P] [US3] Create `AnnouncementCard` component in `src/features/notifications/components/AnnouncementCard.tsx` displaying title, body, publication date, and status badge
- [X] T021 [P] [US3] Create `AnnouncementBanner` component in `src/features/notifications/components/AnnouncementBanner.tsx` fetching active announcements and showing a dismissible banner for important ones
- [X] T022 [P] [US3] Create announcements list page at `src/app/[locale]/announcements/page.tsx` with active/archived filter and paginated list of `AnnouncementCard` components
- [X] T023 [P] [US3] Create announcement detail page at `src/app/[locale]/announcements/[id]/page.tsx` showing full announcement content
- [X] T024 [US3] Add `AnnouncementBanner` to root layout via `ConditionalLayout.tsx` to display globally
- [X] T025 [US3] Implement announcement dismissal (store dismissed IDs in localStorage) in `AnnouncementBanner` at `src/features/notifications/components/AnnouncementBanner.tsx`
- [X] T026 [US3] Add active/archived filter to announcements page data fetching at `src/app/[locale]/announcements/page.tsx` (status filter integrated directly)

**Checkpoint**: User Stories 1–3 should all work independently

---

## Phase 6: User Story 4 — Navigate to Related Content via Notification Deep Links (Priority: P2)

**Goal**: Users clicking any notification navigate to the correct destination page based on backend payload.

**Independent Test**: Verify each notification type navigates to its corresponding page (e.g., booking notification → booking details, payment notification → payment details).

### Implementation for User Story 4

- [X] T027 [US4] Create `NotificationDetail` component in `src/features/notifications/components/NotificationDetail.tsx` displaying full notification content with action buttons (mark read, navigate)
- [X] T028 [US4] Build deep link routing service in `src/features/notifications/services/deepLink.ts` mapping notification type + payload data to route paths per data-model.md routing table
- [X] T029 [US4] Implement deep link navigation for booking notification types in `src/features/notifications/components/NotificationCard.tsx` using the new deep link service
- [X] T030 [P] [US4] Implement deep link navigation for payment notification types in `src/features/notifications/components/NotificationCard.tsx`
- [X] T031 [P] [US4] Implement deep link navigation for review notification types in `src/features/notifications/components/NotificationCard.tsx`
- [X] T032 [P] [US4] Implement deep link navigation for verification notification types in `src/features/notifications/components/NotificationCard.tsx`
- [X] T033 [P] [US4] Implement deep link navigation for support/dispute notification types in `src/features/notifications/components/NotificationCard.tsx`
- [X] T034 [US4] Create notification detail page at `src/app/[locale]/notifications/[id]/page.tsx` as fallback when no deep link payload exists, using `NotificationDetail` component

**Checkpoint**: User Stories 1–4 should all work independently

---

## Phase 7: User Story 5 — View Notifications on Dashboard (Priority: P3)

**Goal**: Customers and providers see recent notifications and unread count on their respective dashboards.

**Independent Test**: Verify the dashboard shows recent notifications and correct unread count, and "View All" navigates to the full notifications page.

### Implementation for User Story 5

- [X] T035 [US5] Add notification widget to provider dashboard at `src/app/[locale]/(provider)/dashboard/page.tsx` showing recent notifications list and unread count badge with "View all" link
- [X] T036 [US5] Enhance existing customer dashboard notification card at `src/app/[locale]/(customer)/dashboard/page.tsx` — ensure it uses shared `useUnreadCount()` hook and shows last 3 notifications

**Checkpoint**: User Stories 1–5 should all work independently

---

## Phase 8: User Story 6 — Receive Real-Time Notification Updates (Priority: P3)

**Goal**: Users receive new notifications in real-time via WebSocket, with polling fallback.

**Independent Test**: Verify a new notification created server-side appears in the user's notification list automatically within the polling interval or via WebSocket.

### Implementation for User Story 6

- [X] T037 [US6] Install and configure Socket.io client (`socket.io-client`) in the project at `package.json`
- [X] T038 [P] [US6] Create Socket.io service in `src/features/notifications/services/socket.ts` connecting to `/notifications` namespace with JWT auth and configured reconnection strategy
- [X] T039 [US6] Wire `notification` WebSocket event to TanStack Query cache invalidation: invalidate `['notifications']` and `['notifications', 'unread-count']` on new notification in `src/features/notifications/hooks/useCustomerNotifications.ts`
- [X] T040 [US6] Wire `unread-count` WebSocket event to optimistic cache update in `useUnreadCount()` hook — set query data directly instead of refetching
- [X] T041 [US6] Implement reconnection strategy (exponential backoff, max 10 attempts) and graceful fallback to 30s polling on connection failure in socket service

**Checkpoint**: All user stories should now be independently functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T042 Generate `docs/notifications-center-audit.md` documenting endpoint coverage, API mismatches, DTO mismatches, event mismatches, missing components, and required fixes
- [X] T043 Run `npm run lint` and `npm run type-check` — fix all issues across notification-related files
- [X] T044 Verify all notification types from data-model.md are handled in `NotificationCard` icon/color mapping at `src/features/notifications/components/NotificationCard.tsx`
- [X] T045 Run quickstart.md validation — verify all acceptance criteria from spec.md are met

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational — No dependencies on other stories
- **User Story 2 (Phase 4)**: Depends on Foundational — depends on US1 for page context
- **User Story 3 (Phase 5)**: Depends on Foundational — independent of US1/US2
- **User Story 4 (Phase 6)**: Depends on Foundational and US1 (NotificationCard enhancement)
- **User Story 5 (Phase 7)**: Depends on Foundational, US1, and US2 (notification list + unread count)
- **User Story 6 (Phase 8)**: Depends on Foundational — somewhat independent but enhances all stories
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational — Uses US1 pages
- **User Story 3 (P2)**: Independent — can start after Foundational, parallel with US1/US2
- **User Story 4 (P2)**: Depends on US1 (NotificationCard enhancement)
- **User Story 5 (P3)**: Depends on US1 and US2 (uses notification list and unread count)
- **User Story 6 (P3)**: Can start after Foundational — independent socket service

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- US1, US3, and US6 can start in parallel after Foundational completes
- US2 can start after US1 pages exist
- US4 can start after US1 NotificationCard is ready
- US5 depends on US1 and US2 completion

---

## Parallel Example: User Story 1

```bash
# Launch all US1 components together:
Task: "Enhance NotificationCard in src/features/notifications/components/NotificationCard.tsx"
Task: "Add pagination to CustomerNotificationList in src/features/notifications/components/CustomerNotificationList.tsx"
Task: "Add filter dropdown to notifications page at src/app/[locale]/client/notifications/page.tsx"

# After components settled, wire them together:
Task: "Wire filter state and pagination to useCustomerNotifications hook"
Task: "Add empty/error states to CustomerNotificationList"
Task: "Create provider notifications page"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (notification list) → Test independently → **Deploy/Demo (MVP)**
3. Add User Story 2 (read management) → Test independently → Deploy
4. Add User Story 3 (announcements) → Test independently → Deploy
5. Add User Story 4 (deep links) → Test independently → Deploy
6. Add User Story 5 (dashboards) → Test independently → Deploy
7. Add User Story 6 (real-time) → Test independently → Deploy
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (notification list) + US2 (read management)
   - Developer B: US3 (announcements) + US4 (deep links)
   - Developer C: US6 (real-time) — then US5 (dashboards)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
