# Tasks: Navigation & Role-Based Header Completion

**Input**: Design documents from `/specs/015-navigation-role-header/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No test tasks requested — verification tasks included instead.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Include exact file paths in descriptions

## Path Conventions

- **Features**: `src/features/[feature-name]/`
  - `components/`, `hooks/`, `services/`, `types/`, `schemas/`
- **Routes**: `src/app/[locale]/`
- **Shared UI**: `src/components/ui/`
- **State/Hooks**: `src/stores/`, `src/hooks/`
- **Lib/Utils**: `src/lib/`, `src/utils/`

---

## Phase 1: Setup (Audit Infrastructure)

**Purpose**: Verify that the authentication store, navigation configuration, and role types are correctly set up before making changes.

- [X] T001 Read and document the auth store structure in `src/features/auth/stores/useAuthStore.ts` — verify `isAuthenticated` becomes `true` after login, `user` object exists, `user.role` is populated with expected `UserRole` values
- [X] T002 [P] Read and document the navigation config in `src/features/header/config/navigation.ts` — verify `roles` arrays use correct `UserRole` enum values (`CUSTOMER`, `PROVIDER`, `ADMIN`)
- [X] T003 [P] Read and document the `useNavigation` hook in `src/features/header/hooks/useNavigation.ts` — verify filtering logic: public items (no roles) always shown, authenticated items filtered by `item.roles.includes(user.role)`, items sorted by `order`
- [X] T004 [P] Read and document the `UserRole` type in `src/types/api.d.ts` — verify it defines `'CUSTOMER' | 'PROVIDER' | 'ADMIN' | 'SUPER_ADMIN'` and matches navigation config values

**Checkpoint**: Auth store, navigation config, and role types audited — no role mapping needed, filtering logic is correct.

---

## Phase 2: Foundational (Auth Hydration Fix)

**Purpose**: Ensure auth hydration state is handled correctly so navigation doesn't flash guest items before auth resolves.

- [X] T005 Audit `src/features/auth/stores/useAuthStore.ts` — verify `isInitializing` is set to `true` on mount and transitions to `false` after hydration completes in `useInitializeAuth`
- [X] T006 Audit `src/components/layout/Header.tsx` — verify `isInitializing` is used to prevent rendering authenticated-specific content until hydration completes; add guard if missing

**Checkpoint**: Auth hydration state correctly prevents transient guest item flash.

---

## Phase 3: User Story 1 — Guest Sees Public Navigation (Priority: P1) 🎯 MVP

**Goal**: Unauthenticated visitors see only Services, AI Diagnosis, Technicians, About. No authenticated items visible.

**Independent Test**: Load the homepage while logged out — confirm only the four public menu items appear in both desktop and mobile views.

### Implementation for User Story 1

- [X] T007 [P] [US1] Verify guest navigation items in `src/features/header/config/navigation.ts` — confirm `services`, `aiDiagnosis`, `technicians`, `about` items have no `roles` field (public by default)
- [X] T008 [P] [US1] Verify `Header.tsx` in `src/components/layout/Header.tsx` uses `useNavigation(pathname)` and passes filtered `items` to both `HeaderNav` and `HeaderMobileNav`
- [X] T009 [P] [US1] Verify `HeaderNav.tsx` in `src/components/layout/HeaderNav.tsx` renders guest items with correct translations and links
- [X] T010 [P] [US1] Verify `HeaderMobileNav.tsx` in `src/components/layout/HeaderMobileNav.tsx` renders same guest items as desktop

**Checkpoint**: Guest navigation works identically on desktop and mobile — MVP ready.

---

## Phase 4: User Story 2 — Customer Sees Customer Navigation After Login (Priority: P1)

**Goal**: A user with role CUSTOMER sees Dashboard, My Bookings, and Profile in the header navigation.

**Independent Test**: Login as a customer user — confirm Dashboard, My Bookings, and Profile links appear; provider/admin items are absent; mobile shows same items.

### Implementation for User Story 2

- [X] T011 [P] [US2] Verify customer navigation items in `src/features/header/config/navigation.ts` — confirm `dashboard`, `myBookings`, `profile` have `roles: ['CUSTOMER']`
- [X] T012 [P] [US2] Create customer My Bookings placeholder page at `src/app/[locale]/client/my-bookings/page.tsx` — export default component with page title and metadata
- [X] T013 [US2] Verify `/client/my-bookings` route renders without 404 and the navigation highlights the "My Bookings" item as active

**Checkpoint**: Customer navigation works on desktop and mobile — all three customer routes resolve.

---

## Phase 5: User Story 3 — Provider Sees Provider Navigation After Login (Priority: P1)

**Goal**: A user with role PROVIDER sees Dashboard, My Jobs, Earnings, and Schedule in the header navigation.

**Independent Test**: Login as a provider user — confirm Dashboard, My Jobs, Earnings, and Schedule links appear; customer/admin items are absent; mobile shows same items.

### Implementation for User Story 3

- [X] T014 [P] [US3] Verify provider navigation items in `src/features/header/config/navigation.ts` — confirm `myJobs`, `earnings`, `schedule`, `dashboard` have `roles: ['PROVIDER']`
- [X] T015 [P] [US3] Create provider My Jobs placeholder page at `src/app/[locale]/technician/my-jobs/page.tsx` — export default component with page title and metadata (or fix nav route to `/technician/jobs` if preferred)
- [X] T016 [P] [US3] Create provider Schedule placeholder page at `src/app/[locale]/technician/schedule/page.tsx` — export default component with page title and metadata
- [X] T017 [US3] Verify `/technician/my-jobs` and `/technician/schedule` routes render without 404; navigation highlights correct items as active

**Checkpoint**: Provider navigation works on desktop and mobile — all four provider routes resolve.

---

## Phase 6: User Story 4 — Admin Sees Admin Navigation After Login (Priority: P1)

**Goal**: A user with role ADMIN sees Dashboard, Users, Providers, Bookings, Finance, Analytics, CMS, Notifications, Audit, and Settings in the header navigation.

**Independent Test**: Login as an admin user — confirm all ten admin links appear; customer/provider items are absent; mobile shows same items.

### Implementation for User Story 4

- [X] T018 [P] [US4] Verify admin navigation items in `src/features/header/config/navigation.ts` — confirm all ten admin items have `roles: ['ADMIN']`
- [X] T019 [P] [US4] Create admin Bookings placeholder page at `src/app/[locale]/(admin)/admin/bookings/page.tsx` — export default component with page title and metadata
- [X] T020 [P] [US4] Create admin CMS placeholder page at `src/app/[locale]/(admin)/admin/cms/page.tsx` — export default component with page title and metadata
- [X] T021 [US4] Verify `/admin/bookings` and `/admin/cms` routes render without 404; navigation highlights correct items as active

**Checkpoint**: Admin navigation works on desktop and mobile — all ten admin routes resolve.

---

## Phase 7: User Story 5 — Active Route Highlighting (Priority: P2)

**Goal**: The currently active route is visually highlighted in the navigation menu.

**Independent Test**: Navigate to each role-specific route — confirm the corresponding menu item receives an active state; unmatched routes show no highlight.

### Implementation for User Story 5

- [X] T022 [P] [US5] Verify active route detection in `src/components/layout/Header.tsx` — confirm `isActive(href)` uses `pathname.startsWith(href)` for all role-prefixed routes (`/client/*`, `/technician/*`, `/admin/*`)
- [X] T023 [P] [US5] Verify active state rendering in `HeaderNav.tsx` at `src/components/layout/HeaderNav.tsx` — confirm highlighted item uses primary color and animated background
- [X] T024 [P] [US5] Verify active state rendering in `HeaderMobileNav.tsx` at `src/components/layout/HeaderMobileNav.tsx` — confirm same highlighting logic as desktop

**Checkpoint**: Active route highlighting works for all roles on desktop and mobile.

---

## Phase 8: User Story 6 — Navigation Translations Display Correctly (Priority: P3)

**Goal**: All navigation items display translated text based on the selected language.

**Independent Test**: Switch language between English and Arabic — confirm all menu items display correct translations.

### Implementation for User Story 6

- [X] T025 [P] [US6] Verify all `Header.nav.*` translation keys exist in `src/messages/en.json` — confirm keys: `dashboard`, `profile`, `myBookings`, `myJobs`, `earnings`, `schedule`, `adminDashboard`, `users`, `providers`, `bookings`, `finance`, `analytics`, `cms`, `notifications`, `audit`, `settings`
- [X] T026 [P] [US6] Verify all `Header.nav.*` translation keys exist in `src/messages/ar.json` — confirm same 16 keys with Arabic translations
- [X] T027 [P] [US6] Verify all `Navbar.*` translation keys exist in both locale files — confirm `services`, `aiDiagnosis`, `technicians`, `about` keys
- [X] T028 [US6] Verify navigation components use `t(item.labelKey)` from `next-intl` for translated labels in `HeaderNav.tsx` and `HeaderMobileNav.tsx`

**Checkpoint**: All navigation items render with correct translations in both English and Arabic.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Role switching validation, final verification, and edge case handling.

- [X] T029 [P] Perform role switching validation — login as CUSTOMER (verify 3 items), PROVIDER (verify 4 items), ADMIN (verify 10 items), logout (verify 4 guest items)
- [X] T030 [P] Verify mobile responsiveness — resize browser to <768px and confirm same navigation items appear with correct active states
- [X] T031 [P] Verify edge case: role is `null` or `undefined` — confirm navigation falls back to guest items
- [X] T032 [P] Verify edge case: role is `SUPER_ADMIN` — confirm admin navigation items are visible (SUPER_ADMIN has admin permissions)
- [X] T033 Run lint and type-check: `npm run lint` and `npm run type-check`
- [X] T034 Run validation per quickstart.md in `specs/015-navigation-role-header/quickstart.md`

**Checkpoint**: All roles verified; edge cases handled; lint/type checks pass.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS only if auth hydration fix needed
- **User Stories (Phases 3-8)**: All can proceed in parallel once Setup is complete
  - US1 (Phase 3) is MVP — guest navigation should already work
  - US2-4 (Phases 4-6) are independent — each role's pages can be created separately
  - US5 (Phase 7) can run in parallel with all role stories
  - US6 (Phase 8) can run in parallel with all role stories
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies — guest navigation is the baseline
- **User Story 2 (P1)**: No dependencies — customer routes are independent
- **User Story 3 (P1)**: No dependencies — provider routes are independent
- **User Story 4 (P1)**: No dependencies — admin routes are independent
- **User Story 5 (P2)**: No dependencies — active route detection works with existing routes
- **User Story 6 (P3)**: No dependencies — translations are independent of which items are shown

### Parallel Opportunities

- All Setup tasks (T001-T004) marked [P] can run in parallel
- All user story implementation tasks marked [P] can run in parallel across stories
- Page creation tasks (T012, T015, T016, T019, T020) can all run in parallel
- Translation verification tasks (T025-T027) can run in parallel
- Polish phase tasks (T029-T032) can all run in parallel

---

## Parallel Example: Phase 4 (Customer)

```bash
# Create customer My Bookings page and verify nav config in parallel:
Task: "Verify customer navigation config in src/features/header/config/navigation.ts"
Task: "Create customer My Bookings page at src/app/[locale]/client/my-bookings/page.tsx"
```

## Parallel Example: All Missing Pages

```bash
# Create all missing pages in parallel (no shared dependencies):
Task: "Create /client/my-bookings page"
Task: "Create /technician/my-jobs page"
Task: "Create /technician/schedule page"
Task: "Create /admin/bookings page"
Task: "Create /admin/cms page"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (audit)
2. Complete Phase 3: User Story 1 (guest navigation)
3. **STOP and VALIDATE**: Guest navigation works on desktop and mobile
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup → Foundation audited
2. Add US1 (Guest) → Verify guest nav → Deploy/Demo (MVP!)
3. Add US2 (Customer) → Verify customer nav → Deploy/Demo
4. Add US3 (Provider) → Verify provider nav → Deploy/Demo
5. Add US4 (Admin) → Verify admin nav → Deploy/Demo
6. Add US5 (Active Route) → Verify highlighting → Deploy/Demo
7. Add US6 (Translations) → Verify translations → Deploy/Demo
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup together
2. Once Setup is done, split by role:
   - Developer A: US2 (Customer pages)
   - Developer B: US3 (Provider pages)
   - Developer C: US4 (Admin pages)
   - Developer D: US5 + US6 (Active route + translations)
3. Polish phase: All come together for role switching validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Most stories have zero dependencies — can be implemented in any order
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No hardcoded role assumptions — all role values come from `UserRole` enum in `src/types/api.d.ts`
