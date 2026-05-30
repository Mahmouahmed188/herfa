# Tasks: Global Persistent Header

**Input**: Design documents from `/specs/003-global-persistent-header/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below DO NOT include test tasks unless explicitly requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Features**: `src/features/header/`
  - `config/`, `hooks/`, `types/`
- **Layout Components**: `src/components/layout/`
- **State/Hooks**: `src/store/`
- **Tests**: `tests/`
- **i18n**: `src/messages/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Feature initialization and basic structure

- [ ] T001 Create feature directory structure in `src/features/header/config/`, `src/features/header/hooks/`, `src/features/header/types/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic and navigation infrastructure that MUST be complete before ANY header UI work

- [ ] T002 [P] Define TypeScript types in `src/features/header/types/index.ts` — `NavigationItem`, `NavigationConfig`, `UseNavigationReturn`, `HeaderFullScreenConfig`
- [ ] T003 [P] Define Zod validation schema in `src/features/header/config/navigation.schema.ts` — `NavigationItemSchema`, `NavigationConfigSchema`, `UserRoleSchema`
- [ ] T004 Create navigation configuration in `src/features/header/config/navigation.ts` — typed nav items organized by role (guest/public, client, technician, admin) with i18n label keys, href, order, and icon
- [ ] T005 Implement `useNavigation` hook in `src/features/header/hooks/useNavigation.ts` — filters nav items by user role, returns sorted items with `isActive` helper. Guest (null role) sees only public items (no `roles` field). Respects technician hide rules.

**Checkpoint**: Foundation ready — navigation config and filtering logic are independently testable without UI

---

## Phase 3: User Story 1 — Guest User Sees Public Navigation (Priority: P1) 🎯 MVP

**Goal**: A visitor who has not logged in sees a simplified header with public-facing navigation items (home, about, sign in, sign up). Header is sticky, responsive, and consistent across all public pages.

**Independent Test**: Load any public page in an incognito browser and confirm the header displays public navigation links with correct language and theme. Resize from desktop to mobile — nav collapses to hamburger menu with all items accessible.

### Implementation for User Story 1

- [ ] T006 [P] [US1] Create `HeaderThemeToggle` component in `src/components/layout/HeaderThemeToggle.tsx` using `next-themes` `useTheme` hook with sun/moon icons from lucide-react
- [ ] T007 [P] [US1] Create `HeaderLanguageSwitcher` component in `src/components/layout/HeaderLanguageSwitcher.tsx` wrapping existing `LanguageSwitcher` from `src/components/common/LanguageSwitcher`
- [ ] T008 [P] [US1] Create `HeaderNav` component in `src/components/layout/HeaderNav.tsx` — desktop navigation bar rendering filtered nav items with active link animation (framer-motion `layoutId="activeNav"`)
- [ ] T009 [P] [US1] Create `HeaderMobileNav` component in `src/components/layout/HeaderMobileNav.tsx` — mobile hamburger menu with `AnimatePresence` slide-in, renders filtered nav items
- [ ] T010 [P] [US1] Create `HeaderActions` component in `src/components/layout/HeaderActions.tsx` — auth-aware action area: guest view shows login button (`Link` to `/login`), mobile view includes language switcher
- [ ] T011 [US1] Create `Header` component in `src/components/layout/Header.tsx` — sticky top wrapper with backdrop blur, composes `HeaderNav`, `HeaderMobileNav`, `HeaderActions`, `HeaderLanguageSwitcher`, `HeaderThemeToggle`. Reads `isAuthenticated` from `useAuthStore` to control guest/authenticated rendering.
- [ ] T012 [US1] Update `ConditionalLayout` in `src/components/layout/ConditionalLayout.tsx` — replace prefix-based route exclusion (NO_CHROME_ROUTES/AUTH_ROUTES) with metadata-driven `FULL_SCREEN_ROUTES` set. Show `Header` on ALL pages by default. Hide only for routes in the full-screen set.
- [ ] T013 [US1] Add full-screen route configuration in `src/components/layout/ConditionalLayout.tsx` — define `FULL_SCREEN_ROUTES` constant with paths that should hide the header (e.g., immersive flows, video calls)
- [ ] T014 [US1] Ensure `ConditionalLayout` is wired in the root layout `src/app/[locale]/layout.tsx` to wrap all pages
- [ ] T015 [US1] Add responsive behavior — `HeaderNav` hidden below `md` breakpoint, `HeaderMobileNav` visible only on mobile. Verify across 375px/768px/1366px/1920px viewports.

**Checkpoint**: Guest users see the header on all pages with public nav, theme toggle, language switcher, and responsive mobile menu. Old Navbar still exists for authenticated routes.

---

## Phase 4: User Story 2 — Authenticated User Accesses Authorized Navigation (Priority: P1)

**Goal**: A logged-in user with standard permissions sees a header with navigation items relevant to their role. Header immediately reflects authenticated state on login and gracefully handles session expiry.

**Independent Test**: Log in as a standard authenticated user (client role) and confirm the header shows authorized navigation items (e.g., profile, bookings, settings) and hides sign in/sign up links. Log out — header reverts to guest state.

### Implementation for User Story 2

- [ ] T016 [US2] Update `HeaderActions` in `src/components/layout/HeaderActions.tsx` — when `isAuthenticated`, show user profile icon with dropdown (dashboard link, sign out button) instead of login button. Read user role from `useAuthStore` for dashboard path routing (`getDashboardPath()` logic ported from existing Navbar).
- [ ] T017 [US2] Add auth-aware client role nav items to `src/features/header/config/navigation.ts` — items for `client` role (e.g., bookings, profile, settings)
- [ ] T018 [US2] Add auth-aware technician role nav items to `src/features/header/config/navigation.ts` — items for `technician` role (e.g., my jobs, earnings, schedule)
- [ ] T019 [US2] Update `useNavigation` hook in `src/features/header/hooks/useNavigation.ts` — when `isAuthenticated` is false (session expired or logged out), reset items to public-only view. Handle loading state (null user while session restores).
- [ ] T020 [US2] Add session expiry handling — ensure `Header` listens to `useAuthStore` state changes and re-renders nav items when `isAuthenticated` transitions from true to false
- [ ] T021 [US2] Integrate notification bell in `HeaderActions` — preserve existing notification polling (`refetchInterval: 30000`) and dropdown UI from current Navbar for authenticated users only

**Checkpoint**: Authenticated users see role-specific nav items. Login/logout transitions are smooth. Session expiry gracefully reverts to guest view.

---

## Phase 5: User Story 3 — Admin User Accesses Dashboard Navigation (Priority: P2)

**Goal**: An admin user sees additional dashboard and management navigation items in the header beyond standard user items.

**Independent Test**: Log in as an admin user and confirm the header includes admin-specific navigation items (e.g., dashboard, user management, analytics) while maintaining identical header structure to standard user views.

### Implementation for User Story 3

- [ ] T022 [US3] Add admin role nav items to `src/features/header/config/navigation.ts` — items for `admin` role (e.g., dashboard, users, providers, bookings, finance, analytics, CMS, settings, audit)
- [ ] T023 [US3] Update `useNavigation` hook in `src/features/header/hooks/useNavigation.ts` — ensure admin items are appended to standard user items (admin sees both admin-specific AND standard authenticated items)
- [ ] T024 [US3] Add permission guard integration — ensure nav items with `roles: ['admin']` are never visible to non-admin roles (client, technician, guest)
- [ ] T025 [US3] Update `HeaderActions` in `src/components/layout/HeaderActions.tsx` — admin user dashboard link points to `/admin/dashboard`

**Checkpoint**: Admin users see full navigation with management items. Non-admin roles never see admin items. Header structure remains identical across roles.

---

## Phase 6: User Story 4 — User Switches Language Mid-Session (Priority: P2)

**Goal**: A user changes the platform language from the header. All header text immediately updates to the selected language. Header layout correctly handles RTL/LTR direction.

**Independent Test**: Switch language to Arabic and confirm header text renders in Arabic with RTL layout. Switch back to English — header reverts to LTR layout.

### Implementation for User Story 4

- [ ] T026 [US4] Wire `HeaderLanguageSwitcher` to update all header nav labels via `next-intl` `useTranslations` — ensure navigation `labelKey` values resolve to correct translation in both ar.json and en.json
- [ ] T027 [US4] Add i18n keys for all navigation items in `src/messages/ar.json` and `src/messages/en.json` — create keys under `Header.nav.{id}` for each nav item label
- [ ] T028 [US4] Verify RTL layout — ensure `Header`, `HeaderNav`, `HeaderMobileNav` and sub-components render correctly when `dir="rtl"` is applied. Check alignment of nav items, logo position, action buttons, and mobile menu direction.
- [ ] T029 [US4] Test RTL text expansion — verify header containers accommodate 25-30% text length increase in Arabic without breaking layout (labels truncate with ellipsis or wrap gracefully)

**Checkpoint**: Language switcher updates all header text immediately. RTL layout renders correctly with proper alignment.

---

## Phase 7: User Story 5 — User Toggles Theme via Header (Priority: P3)

**Goal**: A user toggles between light and dark modes using a theme switch in the header. The header and page theme update consistently without page reload.

**Independent Test**: Toggle theme switch — entire page (header + content) switches between light and dark modes. Navigate to another page — theme preference persists.

### Implementation for User Story 5

- [ ] T030 [US5] Ensure `next-themes` `ThemeProvider` is configured in `src/app/[locale]/layout.tsx` with `attribute="class"` and `defaultTheme="dark"` for Tailwind dark mode class strategy
- [ ] T031 [US5] Wire `HeaderThemeToggle` in `src/components/layout/HeaderThemeToggle.tsx` — use `useTheme` hook `theme` and `setTheme` for toggle. Use lucide-react `Sun`/`Moon` icons. Smooth icon transition.
- [ ] T032 [US5] Verify theme persistence — confirm theme preference is stored by `next-themes` and restored on page reload and cross-page navigation

**Checkpoint**: Theme toggle switches between light and dark modes. Preference persists across sessions.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup, accessibility, and improvements that affect multiple user stories

- [ ] T033 Remove old `Navbar` component at `src/components/layout/Navbar.tsx` — after verifying all functionality is covered by new `Header` components
- [ ] T034 [P] [A11Y] Add semantic HTML structure — ensure `Header` uses `<header>` landmark, `HeaderNav` uses `<nav>` with `aria-label`, mobile menu uses `aria-expanded` and `aria-controls`
- [ ] T035 [P] [A11Y] Add keyboard navigation — ensure all nav items, theme toggle, language switcher, and mobile menu are focusable via Tab. Mobile menu closes on Escape. Dropdown (notifications) closes on Escape.
- [ ] T036 [P] [A11Y] Add visible focus states — ensure `:focus-visible` outlines are applied to all interactive elements in the header with sufficient contrast against both light and dark themes
- [ ] T037 [P] [A11Y] Add screen reader support — ensure nav items have accessible labels, mobile menu button has `aria-label`, theme toggle announces current state, language switcher announces selected language
- [ ] T038 [P] [PERF] Verify zero layout shift — ensure `Header` has a fixed height placeholder during hydration to prevent CLS. Use `min-h-[80px]` (matching current Navbar height) or a CSS `height` property.
- [ ] T039 [P] [PERF] Verify interaction performance — ensure all header interactions (nav click, theme toggle, language switch, mobile menu open/close) respond within 100ms. Profile with React DevTools.
- [ ] T040 [P] [OBS] Add error tracking context — ensure the header catches rendering errors gracefully (error boundary) and logs to existing Sentry integration
- [ ] T041 [P] [OBS] Log auth state transitions — log login/logout/session-expiry events in the header context for audit trail
- [ ] T042 [P] Add WCAG 2.2 AA compliance check — run automated accessibility audit (axe-core or similar) against all header states (guest, authenticated, admin) and fix any critical/serious violations
- [ ] T043 [P] Verify quickstart.md validation checklist — run through all verification items listed in `specs/003-global-persistent-header/quickstart.md`
- [ ] T044 [P] Run `vitest run` — ensure all existing tests pass after header refactoring
- [ ] T045 [P] Run `eslint src/` — ensure linting passes with no new warnings or errors
- [ ] T046 [P] Run `npm run typecheck` or `tsc --noEmit` — ensure TypeScript compilation has no errors

**Checkpoint**: Old Navbar fully replaced. Accessibility compliance verified. No regressions in tests, linting, or type checking.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — can start immediately
- **Phase 2 (Foundational)**: Depends on Setup completion — BLOCKS all user stories
- **Phase 3 (US1)**: Depends on Foundational completion — MVP
- **Phase 4 (US2)**: Depends on Foundational completion. Can be worked in parallel with US1 (separate files: HeaderActions vs Header/HeaderNav). US2 uses the `useNavigation` hook from Phase 2 and adds auth-aware items to the config — the hook already handles filtering, so US2 only adds config entries and the auth-aware action UI.
- **Phase 5 (US3)**: Depends on Foundational + US2 completion (extends auth-aware pattern)
- **Phase 6 (US4)**: Depends on Foundational completion. Can be worked in parallel with US1 (separate files: HeaderLanguageSwitcher already created in US1, this phase wires i18n keys and RTL testing).
- **Phase 7 (US5)**: Depends on Foundational completion. Can be worked in parallel with US1 (HeaderThemeToggle already created in US1, this phase wires ThemeProvider and confirms behavior).
- **Phase 8 (Polish)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — No dependencies on other stories
- **US2 (P1)**: Can start after Phase 2 — Uses Phase 2 `useNavigation` hook; adds nav config entries and HeaderActions auth UI
- **US3 (P2)**: Depends on US2 (adds admin role alongside authenticated pattern)
- **US4 (P2)**: Can start after Phase 2 — Wires i18n keys, no dependency on auth stories
- **US5 (P3)**: Can start after Phase 2 — Wires ThemeProvider, no dependency on other stories

### Within Each User Story

- Types before schemas
- Schemas before config
- Config before hooks
- Hooks before UI components
- UI components before integration
- Story complete before moving to next priority

### Parallel Opportunities

- T002, T003 in Phase 2 can run in parallel (different files)
- T006-T010 in US1 can run in parallel (all Header sub-components)
- US1 + US2 can proceed in parallel after Phase 2 (separate concerns: public header rendering vs auth-aware actions)
- US4 + US5 can proceed in parallel with US1 (i18n/theme are independent additions)
- T034-T042 in Polish phase can run in parallel (accessibility, performance, observability)

---

## Parallel Example: User Story 1

```bash
# Launch all Header sub-components in parallel:
Task: "Create HeaderThemeToggle in src/components/layout/HeaderThemeToggle.tsx"
Task: "Create HeaderLanguageSwitcher in src/components/layout/HeaderLanguageSwitcher.tsx"
Task: "Create HeaderNav in src/components/layout/HeaderNav.tsx"
Task: "Create HeaderMobileNav in src/components/layout/HeaderMobileNav.tsx"
Task: "Create HeaderActions in src/components/layout/HeaderActions.tsx"

# After sub-components complete:
Task: "Create Header in src/components/layout/Header.tsx"
Task: "Update ConditionalLayout in src/components/layout/ConditionalLayout.tsx"
```

---

## Implementation Strategy

### MVP First (Phases 1-3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (guest header with public nav, theme toggle, language switcher, responsive mobile menu)
4. **STOP and VALIDATE**: Load any public page — header renders with public nav, theme toggle works, language switcher works, mobile menu works
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (Phase 1+2)
2. Add US1 (guest header) → Test independently → Deploy/Demo (MVP!)
3. Add US2 (auth-aware nav) → Test independently → Deploy/Demo
4. Add US3 (admin nav) → Test independently → Deploy/Demo
5. Add US4 (language switch) → Test independently → Deploy/Demo
6. Add US5 (theme toggle) → Test independently → Deploy/Demo
7. Add Polish → Final validation

### Parallel Team Strategy

With multiple developers:

1. Team completes Phase 1 + Phase 2 together
2. Once Phase 2 is done:
   - Developer A: US1 (Header components, ConditionalLayout)
   - Developer B: US2 (auth-aware nav config + HeaderActions)
   - Developer C: US4 + US5 (i18n keys, RTL, ThemeProvider)
3. Developer A then assists with US3 (admin nav) and Polish phase
4. All stories integrate independently without conflicts

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- The existing `Navbar` (`src/components/layout/Navbar.tsx`) must remain functional until `Header` fully replaces it (remove only in Phase 8)
