# Research: Global Persistent Header

## R1: Existing Navbar Audit

**Decision**: Refactor existing `Navbar` into a feature-sliced header with config-driven navigation.

**Rationale**: The current `Navbar` at `src/components/layout/Navbar.tsx` covers most requirements (sticky, auth-aware, mobile menu, notifications, language switcher) but has three gaps:
1. Navigation items are hardcoded in the component — violates SC-007 (must be config-driven).
2. Theme toggle is missing — `next-themes` is installed but not exposed in the header.
3. Route exclusion (`ConditionalLayout`) hides the header on `/login`, `/register`, `/client`, `/technician`, `/admin` — contradicts FR-001 (header on all pages unless explicitly full-screen).

**Alternatives considered**: Rewrite from scratch. Rejected because the existing Navbar handles auth, i18n, and responsive patterns correctly; only structural changes are needed.

---

## R2: ConditionalLayout Route Exclusion Analysis

**Decision**: Replace prefix-based exclusion with an explicit `fullScreenPages` metadata set.

**Rationale**: Current logic hides the header on any route starting with `/login`, `/register`, `/client`, `/technician`, `/admin`, `/support`. This is too aggressive — the spec says header should appear on auth pages and dashboard pages unless they are explicitly full-screen. A page-level metadata approach (e.g., a constant set of route patterns that opt out) gives granular control.

**Implementation**: Keep `ConditionalLayout` as the orchestration layer but invert the logic — show header by default, hide only when the current route matches an explicit full-screen set.

---

## R3: Navigation Configuration Format

**Decision**: TypeScript module with Zod schema for runtime validation.

**Rationale**: Matches constitution principle III (type-safe enterprise excellence). A TypeScript config file is compile-time checked and IDE-friendly. Zod schema validates dynamic/API-sourced nav items when FR-009 extensibility is exercised later.

**Format**:
```typescript
const navConfig = {
  items: [
    { id: 'dashboard', labelKey: 'Navbar.dashboard', href: '/admin/dashboard', roles: ['admin'], icon: 'LayoutDashboard' },
    { id: 'bookings', labelKey: 'Navbar.bookings', href: '/admin/bookings', roles: ['admin', 'technician'], icon: 'Calendar' },
    // ...
  ]
}
```

---

## R4: i18n and Theme Integration Points

**Decision**: Reuse existing infrastructure for both.

**Rationale**:
- **i18n**: `next-intl` with `useTranslations` is already wired throughout the app including the Navbar. Header labels use the same i18n keys. The existing `LanguageSwitcher` component is reused.
- **Theme**: `next-themes` with `useTheme` hook is installed as a dependency. Theme toggle in the header uses the `setTheme` / `theme` values from the hook. `next-themes` handles persistence and flash prevention via its `ThemeProvider`.

**Alternatives considered**: Building a custom theme context. Rejected because `next-themes` is already a dependency and works correctly with Next.js SSR.

---

## Additional Findings

- **Auth integration**: `useAuthStore` (Zustand, persisted) provides `user`, `isAuthenticated`, and `logout`. The header reads these directly. User profile data (name, avatar) is available from the store and can be supplemented via TanStack Query for server-authoritative data.
- **Notification polling**: Existing `refetchInterval: 30000` on the unread count query is a reasonable default. The notification dropdown UI pattern in the current Navbar can be preserved as-is.
- **Framer Motion patterns**: `layoutId="activeNav"` for active link animation and `AnimatePresence` for mobile menu transitions are established patterns to retain.
- **Breakpoints**: Tailwind's `md` (768px) is the current desktop/mobile toggle point. The spec adds `sm` (640px, mobile), `md` (768px, tablet), `lg` (1024px, laptop), `xl` (1280px, desktop) — but the current `md` breakpoint works for the tablet/laptop crossover. No change needed unless specific viewport behaviors differ per spec SC-006 validation.
