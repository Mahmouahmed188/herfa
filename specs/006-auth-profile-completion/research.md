# Research: Authentication & User Profile Completion

## Background

The backend (`apps/api/src/`) has **no implementation** — all subdirectories (auth, bookings, common, database, gateways, models, notifications, storage) are empty placeholders. The "backend" exists only as:

1. Frontend API service calls in `src/services/api.ts` (defines expected endpoints)
2. Spec documents (`specs/001-herfa-platform/data-model.md`, etc.)
3. TypeScript type definitions in `src/types/api.d.ts`
4. The frontend-api-alignment report (`docs/frontend-api-alignment-report.md`)

This means all auth/profile work is **frontend-first**: define the correct contracts, wire the frontend to expected endpoints, and ensure the frontend is ready when the backend arrives.

---

## Research Decisions

### Decision 1: Token Storage Mechanism

**Decision**: Access tokens in memory (Zustand store, NOT persisted to localStorage). Refresh tokens in httpOnly cookie (set by backend).

**Rationale**:
- The existing `src/middleware.ts:29` comment states: *"In production, we would check for a secure HTTP-only cookie"*
- The constitution Principle IV requires secure token management
- The spec AUTH-10 requires access tokens "never exposed in URLs, logs, or any storage accessible to client-side scripts"
- httpOnly cookies are immune to XSS attacks, unlike localStorage
- Access tokens in memory-only is the most secure client-side practice

**Alternatives Considered**:
- **localStorage for both tokens**: Current approach. Vulnerable to XSS. Rejected.
- **SessionStorage**: Still accessible to JS, lost on tab close. Rejected.
- **Both in httpOnly cookies**: Backend sets both cookies; frontend can't read access token for Authorization header. Rejected (frontend needs the access token to set `Authorization: Bearer` headers).

**Current State Issues**:
- `src/features/auth/services/session.ts` stores token in BOTH localStorage AND a non-httpOnly cookie — must be migrated
- `src/features/auth/stores/useAuthStore.ts` uses zustand/persist which stores in localStorage — must be changed to memory-only for token
- Two parallel auth stores need consolidation

### Decision 2: Refresh Token Flow Architecture

**Decision**: Implement a frontend axios interceptor that:
1. On 401 response, calls `POST /auth/refresh` (which reads the httpOnly refresh cookie automatically)
2. On success, updates the in-memory access token and retries the original request
3. On failure (refresh also expired), logs the user out

**Rationale**:
- Standard pattern for token refresh with httpOnly refresh cookies
- The backend will set the refresh token as an httpOnly cookie during login
- The refresh endpoint reads the cookie and returns a new access token

**Alternatives Considered**:
- **Refresh token in response body**: Less secure. Rejected.
- **Client-side refresh token rotation**: Adds unnecessary complexity. Rejected.

### Decision 3: Role System Alignment

**Decision**: Standardize on backend-planned roles: `CUSTOMER`, `PROVIDER`, `ADMIN`, `SUPER_ADMIN`.

**Rationale**:
- The planned data model (`specs/001-herfa-platform/data-model.md:10`) defines: `role: Enum ['CUSTOMER', 'PROVIDER', 'ADMIN', 'SUPER_ADMIN']`
- The frontend currently has conflicting role types:
  - `src/types/api.d.ts`: `'SUPER_ADMIN' | 'ADMIN' | 'SUPPORT' | 'FINANCE' | 'CONTENT'`
  - `src/store/useAuthStore.ts`: `'client' | 'technician' | 'admin'`
  - `src/features/auth/LoginForm.tsx:44-49`: Placeholder mapping that always maps to `'ADMIN'`
- Navigation config uses `'client' | 'technician' | 'admin'` — needs migration

**Current Issues**:
- LoginForm.tsx role mapping is entirely placeholder (lines 44-49)
- Two conflicting UserRole type definitions
- Navigation filtering depends on role, but role values are inconsistent

### Decision 4: Profile Endpoints

**Decision**: Implement profile views using TanStack Query hooks that call:
- `GET /users/me` — fetch current user profile
- `PATCH /users/me` — update profile (needs to be added to `src/services/api.ts`)
- `POST /uploads` — avatar upload (already exists in core API)

**Rationale**:
- These endpoints are specified in the planned backend contract
- The alignment report identifies profile endpoints as missing (mm-disconnected-client-profile, mm-disconnected-technician-profile)
- No mock profile data should remain

### Decision 5: Auth Store Consolidation

**Decision**: Merge the two auth stores into a single source of truth:
- Keep `src/features/auth/stores/useAuthStore.ts` (it's in the correct feature directory)
- Remove `src/store/useAuthStore.ts` (duplicate, wrong role types)
- Remove zustand/persist from the auth store (token should not be persisted)
- Persist only a `refreshTokenExists` flag to detect sessions on reload

**Rationale**:
- Having two auth stores is a constitutional Principle II violation (duplication)
- The feature-modular store (`src/features/auth/stores/`) is in the correct location
- Token persistence is a security concern

---

## Unknowns Resolved

| Unknown | Resolution |
|---------|-----------|
| Token storage mechanism | Access token: in-memory only. Refresh token: httpOnly cookie (backend sets it). |
| Refresh token flow | Axios response interceptor with `POST /auth/refresh` and request queue. |
| Role standardization | `CUSTOMER` \| `PROVIDER` \| `ADMIN` \| `SUPER_ADMIN` per planned data model. |
| Profile endpoints | `GET /users/me`, `PATCH /users/me`, `POST /uploads` for avatar. |
| Auth store duplication | Merge into `src/features/auth/stores/useAuthStore.ts`, remove `src/store/useAuthStore.ts`. |
| Backend availability | Not yet implemented — frontend must define correct contracts and be ready. |

---

## Files Analyzed

| File | Status | Notes |
|------|--------|-------|
| `src/services/api.ts` | Auth endpoints exist (login, register, getCurrentUser) | Missing: refresh token, logout, profile update |
| `src/lib/axios.ts` | Axios client with 401 handling | Missing: refresh interceptor |
| `src/features/auth/LoginForm.tsx` | Login form exists | Role mapping is placeholder |
| `src/features/auth/RegisterForm.tsx` | Register form exists | Needs role alignment |
| `src/features/auth/services/session.ts` | Token storage | Needs migration from localStorage to memory |
| `src/features/auth/stores/useAuthStore.ts` | Auth store (admin) | Primary — keep and fix |
| `src/store/useAuthStore.ts` | Auth store (customer) | Duplicate — remove |
| `src/types/api.d.ts` | User/UserRole types | Role enum needs alignment with planned model |
| `src/middleware.ts` | Route protection | Only protects admin routes, needs role-aware expansion |
| `src/components/auth/ProtectedRoute.tsx` | Client-side guard | Needs role parameter support |
| `src/components/auth/PermissionGuard.tsx` | Role-based element guard | Works — role values need updating |
| `src/features/header/config/navigation.ts` | Role-based nav | Role values need migration |
| `apps/api/src/` | Empty | Backend not yet implemented |
| `docs/frontend-api-alignment-report.md` | Alignment report | Documents 84 endpoints, identifies gaps |
