---

description: "Task list for Authentication & User Profile completion"
---

# Tasks: Authentication & User Profile Completion

**Input**: Design documents from `specs/006-auth-profile-completion/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested in feature specification — test tasks are excluded.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Features**: `src/features/[feature-name]/`
  - `components/`, `hooks/`, `services/`, `types/`, `schemas/`
- **Routes**: `src/app/[locale]/`
- **Shared UI**: `src/components/ui/`
- **State/Hooks**: `src/stores/`, `src/hooks/`
- **Lib/Utils**: `src/lib/`, `src/utils/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Feature initialization and type/schema alignment

- [ ] T001 [P] Update TypeScript role types in `src/types/api.d.ts` — standardize on `'CUSTOMER' | 'PROVIDER' | 'ADMIN' | 'SUPER_ADMIN'`, remove unused `'SUPPORT' | 'FINANCE' | 'CONTENT'`
- [ ] T002 [P] Define Zod validation schemas for auth/profile DTOs in `src/features/auth/schemas/validation.ts` — loginSchema, registerSchema, updateProfileSchema matching data-model.md
- [ ] T003 [P] Add i18n message keys for auth and profile flows in `src/messages/ar.json` and `src/messages/en.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core auth infrastructure that MUST be complete before any user story UI work

- [ ] T004 Consolidate auth stores — remove `src/store/useAuthStore.ts` (duplicate), keep and fix `src/features/auth/stores/useAuthStore.ts`:
      - Remove zustand/persist (token should not survive page reload)
      - Store only: `user`, `isAuthenticated`, `token` (in-memory), `refreshTokenExists` (flag for session detection)
      - Use role type `'CUSTOMER' | 'PROVIDER' | 'ADMIN' | 'SUPER_ADMIN'`
      - Update all imports across the codebase to use the single store
- [ ] T005 [P] Fix session service in `src/features/auth/services/session.ts` — remove localStorage storage, remove non-httpOnly cookie, keep only methods that prepare headers
- [ ] T006 [P] Add missing auth API endpoints in `src/services/api.ts`:
      - `refreshToken()` — `POST /auth/refresh`
      - `logout()` — `POST /auth/logout`
      - `updateProfile()` — `PATCH /users/me`
- [ ] T007 [P] Implement axios response interceptor for token refresh in `src/lib/axios.ts`:
      - On 401, call `POST /auth/refresh` (refresh token sent via httpOnly cookie)
      - On success, update in-memory token and retry original request with queue
      - On failure, clear auth store and redirect to `/login`
      - Handle concurrent 401s by queuing requests during a single refresh call

**Checkpoint**: Foundation ready — auth store consolidated, endpoints added, refresh interceptor ready

---

## Phase 3: User Story 1 — Authentication Flow (Priority: P1) 🎯 MVP

**Goal**: Guest users can register and login; authenticated users can logout. Credentials are sent to the correct backend endpoints. After successful auth, users are redirected to their role-appropriate dashboard.

**Independent Test**: Guest navigates to `/login`, enters valid credentials, is redirected to role-specific dashboard. Guest navigates to `/register`, submits valid data, account is created, session is established. Logout clears session and redirects to `/login`.

### Implementation for User Story 1

- [ ] T008 [P] [US1] Fix role mapping in `src/features/auth/LoginForm.tsx` — remove placeholder mapping, use actual role value from API response
- [ ] T009 [P] [US1] Fix DTO alignment in `src/features/auth/RegisterForm.tsx`:
      - Update registerSchema to use `'CUSTOMER' | 'PROVIDER'` (not `'customer' | 'provider'`)
      - Add `firstName`/`lastName` fields matching backend contract
      - Validate phone format to min 10 digits
- [ ] T010 [P] [US1] Implement logout with backend invalidation — wire `POST /auth/logout` call in `src/services/api.ts` logout function, call from `src/features/auth/stores/useAuthStore.ts` logout action
- [ ] T011 [US1] Implement role-based dashboard redirect after login/register — create a utility in `src/features/auth/services/redirect.ts` that maps `'CUSTOMER'` → customer dashboard, `'PROVIDER'` → provider dashboard, `'ADMIN'|'SUPER_ADMIN'` → admin dashboard

**Checkpoint**: Login, Register, and Logout are fully functional with correct backend endpoints and role-based redirects

---

## Phase 4: User Story 2 — Session Management (Priority: P2)

**Goal**: User sessions persist across browser reloads. Expired access tokens are automatically refreshed without user disruption.

**Independent Test**: Log in, close tab, reopen to same app — session is restored (redirected to dashboard). Wait for token expiry or simulate 401 — next API call succeeds without user seeing a login prompt.

### Implementation for User Session

- [ ] T012 [P] [US2] Implement auto-login on app reload in `src/features/auth/services/session.ts` — on init, check for refresh token existence via cookie presence, call refresh endpoint to restore session
- [ ] T013 [P] [US2] Create `useInitializeAuth` hook in `src/features/auth/hooks/useInitializeAuth.ts` — called once on app mount, attempts token refresh, restores user from `GET /users/me` if refresh succeeds
- [ ] T014 [US2] Implement token expiry UI handling — add `useEffect` in root layout that checks token expiry periodically, triggers silent refresh before expiry

**Checkpoint**: Session persistence and automatic token refresh work without user intervention

---

## Phase 5: User Story 3 — User Profile (Priority: P2)

**Goal**: Authenticated users can view and edit their profile. Profile data is fetched from the backend and persisted through API calls.

**Independent Test**: Log in, navigate to profile page — personal data loads. Edit name/phone/avatar, save — changes persist and display immediately.

### Implementation for User Profile

- [ ] T015 [P] [US3] Create TanStack Query hooks for profile in `src/features/auth/hooks/useProfile.ts`:
      - `useProfile()` — `useQuery` with `GET /users/me`
      - `useUpdateProfile()` — `useMutation` with `PATCH /users/me`
      - `useUploadAvatar()` — `useMutation` with `POST /uploads`
- [ ] T016 [P] [US3] Build profile view component in `src/features/auth/components/ProfileView.tsx` — displays firstName, lastName, email, phone, role, avatar, status
- [ ] T017 [P] [US3] Build profile edit form in `src/features/auth/components/ProfileForm.tsx` — React Hook Form + Zod, fields: firstName, lastName, phone, avatar upload
- [ ] T018 [US3] Integrate profile components into profile page at `src/app/[locale]/(customer)/profile/page.tsx` and `src/app/[locale]/(provider)/profile/page.tsx`

**Checkpoint**: Profile read/update is fully functional through backend API

---

## Phase 6: User Story 4 — Role-Based Access Control (Priority: P2)

**Goal**: Users can only access routes and navigation items appropriate to their role. Route guards, navigation filtering, and component-level permission checks enforce role boundaries.

**Independent Test**: Admin logs in — sees admin nav items, accesses admin dashboard. Customer logs in — no admin nav items, direct URL access to admin route redirects to customer dashboard.

### Implementation for Role-Based Access Control

- [ ] T019 [P] [US4] Update `src/middleware.ts` to guard all role-specific routes (not just admin) — check token cookie, verify role from decoded JWT, redirect unauthenticated users to `/login` and role-mismatch users to their dashboard
- [ ] T020 [P] [US4] Update `src/components/auth/ProtectedRoute.tsx` — add `allowedRoles` prop that checks against current user role and redirects to appropriate dashboard on mismatch
- [ ] T021 [P] [US4] Migrate navigation role values in `src/features/header/config/navigation.ts` — replace `'client'` → `'CUSTOMER'`, `'technician'` → `'PROVIDER'`, `'admin'` → `['ADMIN', 'SUPER_ADMIN']`
- [ ] T022 [P] [US4] Update PermissionGuard in `src/components/auth/PermissionGuard.tsx` — replace hardcoded role checks with the unified `'CUSTOMER' | 'PROVIDER' | 'ADMIN' | 'SUPER_ADMIN'` type

**Checkpoint**: Role-based routing and navigation are enforced at all levels

---

## Phase 7: User Story 5 — API Audit (Priority: P3)

**Goal**: Generate a structured audit report comparing frontend API integrations against backend contracts for auth, users, and profiles.

**Independent Test**: Run the audit script — `docs/auth-profile-audit.md` is generated with all required sections.

### Implementation for API Audit

- [ ] T023 [US5] Scan all frontend API calls in `src/services/api.ts`, `src/features/auth/services/`, and `src/features/users/services/api.ts` — enumerate every endpoint, method, request DTO, and response DTO
- [ ] T024 [US5] Compare frontend endpoints against planned backend contracts from `specs/006-auth-profile-completion/contracts/auth-api.md` — document mismatches, missing integrations, and DTO differences
- [ ] T025 [US5] Generate audit report at `docs/auth-profile-audit.md` with sections: Existing Coverage, Profile Coverage, Role Coverage, API Mismatches, DTO Mismatches, Missing Integrations, Security Issues, Required Fixes

**Checkpoint**: Audit report generated with comprehensive analysis

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup, validation, and security hardening

- [ ] T026 [P] Remove all remaining mock auth/profile data — search for `mock`, `fake`, `hardcoded`, `localStorage` in auth and profile files, replace with real API calls
- [ ] T027 [P] Remove duplicate `src/store/useAuthStore.ts` — verify no remaining imports reference it
- [ ] T028 Run linter — `npm run lint` — fix any lint errors introduced
- [ ] T029 Run type checker — `npm run type-check` — fix any type errors
- [ ] T030 Run tests — `npm test` — ensure existing tests still pass
- [ ] T031 Verify quickstart scenario from `specs/006-auth-profile-completion/quickstart.md` — manual check of auth flow, profile CRUD, session persistence, and RBAC

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 (Authentication) must be complete before US2 (Session Management)
  - US2 depends on US1 (session management needs auth working)
  - US3 (Profile) depends on US1 (needs authenticated user)
  - US3 can start alongside US2 (different concerns)
  - US4 (RBAC) depends on US1 (needs role from auth)
  - US4 can start alongside US2 and US3
  - US5 (Audit) depends on all other phases
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational)  ← blocks everything
    ↓
┌──────────────────────────────────────────────┐
│                                              │
Phase 3: US1 (Authentication) — P1             │
    │                                          │
    ├──→ Phase 4: US2 (Session Mgmt) — P2      │ (depends on US1)
    │                                            │
    ├──→ Phase 5: US3 (Profile) — P2            │ (depends on US1)
    │                                            │
    └──→ Phase 6: US4 (RBAC) — P2               │ (depends on US1)
                                                  │
                    ↓                              │
        Phase 7: US5 (API Audit) — P3             │
                    ↓                              │
        Phase 8: Polish                           │
└──────────────────────────────────────────────┘
```

### Within Each User Story

- Models/Types before services
- Services before components
- Core implementation before integration
- Story complete and independently testable before moving to next

### Parallel Opportunities

- All Phase 1 tasks (T001-T003) can run in parallel
- Phase 2 tasks T005-T007 can run in parallel (T004 is sequential — removes the duplicate store first)
- US3 tasks T015-T017 can run in parallel
- US4 tasks T019-T022 can run in parallel
- Phase 8 tasks T026-T027 can run in parallel
- Once Phase 2 is done: US3 (Profile), US4 (RBAC) can start alongside US1

---

## Parallel Example: Phase 2 Foundational

```bash
# These can launch together:
Task: "T005 Fix session service in src/features/auth/services/session.ts"
Task: "T006 Add missing API endpoints in src/services/api.ts"
Task: "T007 Implement axios refresh interceptor in src/lib/axios.ts"
```

## Parallel Example: User Story 3 (Profile)

```bash
# These can launch together:
Task: "T015 Create TanStack Query hooks in src/features/auth/hooks/useProfile.ts"
Task: "T016 Build profile view in src/features/auth/components/ProfileView.tsx"
Task: "T017 Build profile edit form in src/features/auth/components/ProfileForm.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Authentication)
4. **STOP and VALIDATE**: Test login/register/logout independently
5. Deploy/demo if ready — users can authenticate

### Incremental Delivery

1. **Setup + Foundational** → Auth infrastructure ready
2. **+ US1 (Auth)** → Users can login/register/logout with role redirects (MVP!)
3. **+ US2 (Session)** → Users stay logged in across reloads
4. **+ US3 (Profile)** → Users can view/edit profile
5. **+ US4 (RBAC)** → Role enforcement complete
6. **+ US5 (Audit)** → Full audit documentation
7. **+ Polish** → Cleanup, lint, type-check, tests pass

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (Auth) + US2 (Session Management)
   - Developer B: US3 (Profile) + US4 (RBAC) — these can start alongside US1
3. US5 (Audit) and Polish are quick final phases

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Backend is not yet implemented — frontend contracts defined in `contracts/auth-api.md` are the authoritative target
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
