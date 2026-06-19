# Research: Navigation & Role-Based Header Completion

## Tech Stack Confirmation

| Dimension | Decision | Rationale | Alternatives Considered |
|-----------|----------|-----------|------------------------|
| Auth State | Zustand (useAuthStore) | Already in use; stores `user`, `token`, `isAuthenticated`, `isInitializing` | Redux (overkill), Context (performance concerns) |
| Navigation Config | Static TypeScript config | Items are role-constant, no backend dependency | Dynamic from API (over-engineered for static nav) |
| Role Filtering | `useNavigation` hook | Already implemented; filters by `item.roles.includes(user.role)` for auth, shows public items for guests | Server-side filtering (adds unnecessary complexity) |
| Internationalization | next-intl with `Header.nav.*` keys | Already configured; all 16 keys exist in both en.json and ar.json | Hardcoded strings (violates constitution principle VIII) |
| Route Structure | Next.js App Router route groups | Already structured as `(customer)/`, `(provider)/`, `(admin)/` | Flat routes (would break existing patterns) |
| Active Route Detection | `usePathname()` + `pathname.startsWith(item.href)` | Already implemented in Header.tsx | next/navigation useSelectedLayoutSegment (more complex) |

## Auth Store Analysis

**File**: `src/features/auth/stores/useAuthStore.ts`

### Current Behavior

- State: `user: User | null`, `isAuthenticated: boolean`, `token: string | null`, `isInitializing: boolean`
- `login(user, token)`: Sets user + token, sets `isAuthenticated = true`
- `logout()`: Clears everything
- `updateUser(partial)`: Merges partial user data
- `setInitializing(true)` on mount; `useInitializeAuth` sets it to `false` after hydration

### User Object

```typescript
interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;  // 'CUSTOMER' | 'PROVIDER' | 'ADMIN' | 'SUPER_ADMIN'
  avatarUrl?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
}
```

### Role Values

The `UserRole` type is defined as `'CUSTOMER' | 'PROVIDER' | 'ADMIN' | 'SUPER_ADMIN'` in `src/types/api.d.ts`.

**No role mapping needed** — backend returns uppercase role values that match the frontend enum exactly.

### Hydration Flow

`useInitializeAuth` (in `src/features/auth/hooks/useInitializeAuth.ts`) checks for a token on page load, validates it, and populates the user from the stored session or the backend `/auth/me` endpoint. During initialization, `isInitializing = true`, which means navigation should show a loading state rather than defaulting to guest items.

## Navigation Config Analysis

**File**: `src/features/header/config/navigation.ts`

### Item Groups

| Group | Roles | Items |
|-------|-------|-------|
| Guest (public) | none (no roles array) | Services, AI Diagnosis, Technicians, About |
| Customer | `['CUSTOMER']` | Dashboard, My Bookings, Profile |
| Provider | `['PROVIDER']` | My Jobs, Earnings, Schedule, Dashboard |
| Admin | `['ADMIN']` | Dashboard, Users, Providers, Bookings, Finance, Analytics, CMS, Notifications, Audit, Settings |

### Role Filtering Logic (useNavigation hook)

```typescript
const filteredItems = useMemo(() => {
  return items.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true; // public items
    if (!isAuthenticated || !role) return false; // guest, hide auth items
    return item.roles.includes(role as UserRole); // auth, check role
  }).sort((a, b) => a.order - b.order);
}, [items, isAuthenticated, role]);
```

This logic is correct. No fix needed.

## Page Existence Audit

| Route | Role | Exists? | Notes |
|-------|------|---------|-------|
| `/client/dashboard` | Customer | ✅ | `src/app/[locale]/client/dashboard/page.tsx` |
| `/client/my-bookings` | Customer | ❌ | Nav points here; only `client/jobs/` exists — needs page creation or route alias |
| `/client/profile` | Customer | ✅ | `src/app/[locale]/client/profile/page.tsx` |
| `/technician/dashboard` | Provider | ✅ | `src/app/[locale]/technician/dashboard/page.tsx` |
| `/technician/my-jobs` | Provider | ❌ | Nav points here; only `technician/jobs/` exists — mismatch |
| `/technician/earnings` | Provider | ✅ | `src/app/[locale]/technician/earnings/page.tsx` |
| `/technician/schedule` | Provider | ❌ | Does not exist — needs page creation |
| `/admin/dashboard` | Admin | ✅ | `src/app/[locale]/(admin)/admin/dashboard/page.tsx` |
| `/admin/users` | Admin | ✅ | `src/app/[locale]/(admin)/admin/users/page.tsx` |
| `/admin/providers` | Admin | ✅ | `src/app/[locale]/(admin)/admin/providers/page.tsx` |
| `/admin/bookings` | Admin | ❌ | Does not exist — needs page creation |
| `/admin/finance` | Admin | ✅ | `src/app/[locale]/(admin)/admin/finance/page.tsx` |
| `/admin/analytics` | Admin | ✅ | `src/app/[locale]/(admin)/admin/analytics/page.tsx` |
| `/admin/cms` | Admin | ❌ | Does not exist — needs page creation |
| `/admin/notifications` | Admin | ✅ | `src/app/[locale]/(admin)/admin/notifications/page.tsx` |
| `/admin/audit` | Admin | ✅ | `src/app/[locale]/(admin)/admin/audit/page.tsx` |
| `/admin/settings` | Admin | ✅ | `src/app/[locale]/(admin)/admin/settings/page.tsx` |

### Missing Pages (need creation)

1. `/client/my-bookings` — OR fix nav route to `/client/jobs`
2. `/technician/my-jobs` — OR fix nav route to `/technician/jobs`
3. `/technician/schedule` — must create
4. `/admin/bookings` — must create
5. `/admin/cms` — must create

## Translation Keys Audit

All required `Header.nav.*` keys exist in `src/messages/en.json`:

| Key | English Value | Exists? |
|-----|---------------|---------|
| `Header.nav.dashboard` | Dashboard | ✅ |
| `Header.nav.profile` | Profile | ✅ |
| `Header.nav.myBookings` | My Bookings | ✅ |
| `Header.nav.myJobs` | My Jobs | ✅ |
| `Header.nav.earnings` | Earnings | ✅ |
| `Header.nav.schedule` | Schedule | ✅ |
| `Header.nav.adminDashboard` | Dashboard | ✅ |
| `Header.nav.users` | Users | ✅ |
| `Header.nav.providers` | Providers | ✅ |
| `Header.nav.bookings` | Bookings | ✅ |
| `Header.nav.finance` | Finance | ✅ |
| `Header.nav.analytics` | Analytics | ✅ |
| `Header.nav.cms` | CMS | ✅ |
| `Header.nav.notifications` | Notifications | ✅ |
| `Header.nav.audit` | Audit Logs | ✅ |
| `Header.nav.settings` | Settings | ✅ |

**No missing translation keys** — all 16 are present in en.json. Arabic (ar.json) should also be verified.

## Mobile vs Desktop Synchronization

Both `HeaderNav.tsx` (desktop) and `HeaderMobileNav.tsx` (mobile) consume filtered items from the same `useNavigation(pathname)` hook. The `Header.tsx` component calls the hook once and passes `items` and `isActive` to both child components.

**No synchronization issue** — they share the same data source. Mobile visibility is handled by CSS (`hidden md:flex` on desktop nav, `md:hidden` on mobile nav container).

## Active Route Detection

Current implementation in `Header.tsx`:

```typescript
const isActive = (href: string) => {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
};
```

This works for role-prefixed routes (`/client/*`, `/technician/*`, `/admin/*`) because each nav item's `href` matches the URL prefix of its pages. The `isActive` function is passed down to both `HeaderNav` and `HeaderMobileNav`.

**No fix needed** — logic is correct for all role-specific routes.

## Middleware Routing

File: `src/middleware.ts`

Currently has an **emergency bypass** that passes all routes through without authentication checks. The `PROTECTED_PREFIXES` (`/admin`, `/client`, `/technician`) are defined but not enforced. This bypass should be reviewed but is out of scope for this navigation feature.

## Key Decisions

1. **No role mapping needed** — backend returns `CUSTOMER`, `PROVIDER`, `ADMIN` which matches `UserRole` type.
2. **Navigation filtering logic is correct** — `useNavigation` hook properly filters by `isAuthenticated`, `role`, and `item.roles`.
3. **Missing pages must be created**: `/client/my-bookings`, `/technician/my-jobs`, `/technician/schedule`, `/admin/bookings`, `/admin/cms`.
4. **All translation keys exist** — no keys need to be added.
5. **Mobile/desktop share same filtered items** — no sync issue.
6. **Active route detection works** — `isActive()` using `pathname.startsWith(href)` is correct.
