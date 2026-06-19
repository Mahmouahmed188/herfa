# Quickstart: Navigation & Role-Based Header Completion

## Prerequisites

- Node.js 18+ installed
- `npm install` completed
- Backend API running (or auth mock available)

## Implementation Order

### 1. Audit Auth State

**Files to inspect**:
- `src/features/auth/stores/useAuthStore.ts` — verify `isAuthenticated`, `user`, `user.role`
- `src/features/auth/hooks/useInitializeAuth.ts` — verify hydration flow
- `src/types/api.d.ts` — verify `UserRole` type

**Verify**:
- `isAuthenticated` becomes `true` after login
- `user.role` is `'CUSTOMER'`, `'PROVIDER'`, or `'ADMIN'`
- No role mapping needed — backend returns uppercase values matching the enum

### 2. Verify Navigation Config

**File**: `src/features/header/config/navigation.ts`

**Check**:
- Guest items have no `roles` field
- Customer items have `roles: ['CUSTOMER']`
- Provider items have `roles: ['PROVIDER']`
- Admin items have `roles: ['ADMIN']`
- Item `order` values are sequential within each group

### 3. Verify Navigation Filtering

**File**: `src/features/header/hooks/useNavigation.ts`

**Logic to verify**:
```
if (no roles array or empty) → show to everyone (public)
if (roles present AND not authenticated) → hide
if (roles present AND authenticated) → show only if role matches
All items sorted by `order` (ascending)
```

### 4. Create Missing Pages

Create placeholder pages at:

| Route | Location | Notes |
|-------|----------|-------|
| `/client/my-bookings` | `src/app/[locale]/client/my-bookings/page.tsx` | Customer bookings list |
| `/technician/my-jobs` | `src/app/[locale]/technician/my-jobs/page.tsx` | Provider jobs list (or fix nav to `/technician/jobs`) |
| `/technician/schedule` | `src/app/[locale]/technician/schedule/page.tsx` | Provider schedule |
| `/admin/bookings` | `src/app/[locale]/(admin)/admin/bookings/page.tsx` | Admin bookings management |
| `/admin/cms` | `src/app/[locale]/(admin)/admin/cms/page.tsx` | Admin content management |

Each page should:
- Export a default component with a `<PageHeading>` title
- Export metadata via `generateMetadata` or `metadata` object
- Use the appropriate layout for its portal
- Show meaningful placeholder content

### 5. Verify Translation Keys

**Files**: `src/messages/en.json`, `src/messages/ar.json`

Ensure all keys under `Header.nav.*` exist (listed in research.md). All 16 keys already exist in English — verify Arabic translations exist.

### 6. Verify Mobile Sync

**Files**: `src/components/layout/Header.tsx`, `HeaderNav.tsx`, `HeaderMobileNav.tsx`

**Check**:
- `Header.tsx` calls `useNavigation(pathname)` once
- Both `HeaderNav` and `HeaderMobileNav` receive the same `items` and `isActive` props
- Mobile items render with correct translations and active states

### 7. Test Active Route Highlighting

Scenarios:
- `/client/dashboard` highlights "Dashboard" in customer nav
- `/technician/earnings` highlights "Earnings" in provider nav
- `/admin/users` highlights "Users" in admin nav
- Unknown route highlights nothing

### 8. Running Checks

```bash
npm run lint
npm run type-check
npm test
```

## Quick Verification

After implementation, test each role:

1. **Guest**: Open app logged out → see Services, AI Diagnosis, Technicians, About
2. **Customer**: Login as CUSTOMER → see Dashboard, My Bookings, Profile
3. **Provider**: Login as PROVIDER → see Dashboard, My Jobs, Earnings, Schedule
4. **Admin**: Login as ADMIN → see Dashboard, Users, Providers, Bookings, Finance, Analytics, CMS, Notifications, Audit, Settings

Each menu should work identically on mobile (responsive < 768px) and desktop.
