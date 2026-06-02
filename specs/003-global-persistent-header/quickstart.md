# Quickstart: Global Persistent Header

## Overview

Replace the existing `Navbar` with a config-driven `Header` that appears on all pages (unless explicitly full-screen), adapts to user role/authentication state, supports all languages, and provides a theme toggle.

## Implementation Steps

### Step 1: Create Navigation Config

Create `src/features/header/config/navigation.ts` with typed navigation items organized by role. Each item has an `id`, `labelKey` (i18n), `href`, `roles` (visibility), `icon`, and `order`.

### Step 2: Create Navigation Schema

Create `src/features/header/config/navigation.schema.ts` — Zod schema that validates the navigation config structure. Used for runtime safety when nav items are fetched from an API.

### Step 3: Create useNavigation Hook

Create `src/features/header/hooks/useNavigation.ts` — filters nav items by user role, returns sorted items with an `isActive` helper. Handles guest (null role) by showing only public items (no `roles` field).

### Step 4: Build Header Components

- `Header.tsx` — Main wrapper (sticky, backdrop, contains all sub-components)
- `HeaderNav.tsx` — Desktop navigation bar with active link animation (framer-motion `layoutId`)
- `HeaderMobileNav.tsx` — Mobile hamburger menu with slide-in animation
- `HeaderActions.tsx` — Auth-aware action area: guest shows login button, authenticated shows profile icon + sign out
- `HeaderThemeToggle.tsx` — Light/dark toggle using `next-themes`
- `HeaderLanguageSwitcher.tsx` — Wraps existing `LanguageSwitcher` component

### Step 5: Update ConditionalLayout

Modify `src/components/layout/ConditionalLayout.tsx`:
- Replace prefix-based route exclusion with a metadata-driven full-screen page set
- Show header on ALL pages by default
- Hide header only for routes in the full-screen set

### Step 6: Update Root Layout

Ensure `ConditionalLayout` wraps all pages via the root layout.

### Step 7: Wire Theme Toggle

Add `next-themes` `ThemeProvider` in the root layout (if not already present). Wire `HeaderThemeToggle` to `useTheme`.

### Step 8: Add Tests

- Unit tests for `useNavigation` hook (filtering logic per role)
- Schema validation tests for navigation config
- Component tests for header rendering in guest/authenticated/admin states
- Integration test for auth state transitions in header

## Key Files

```
New files to create:
  src/features/header/config/navigation.ts
  src/features/header/config/navigation.schema.ts
  src/features/header/hooks/useNavigation.ts
  src/features/header/types/index.ts
  src/components/layout/Header.tsx
  src/components/layout/HeaderNav.tsx
  src/components/layout/HeaderMobileNav.tsx
  src/components/layout/HeaderActions.tsx
  src/components/layout/HeaderThemeToggle.tsx
  src/components/layout/HeaderLanguageSwitcher.tsx
  tests/components/header.test.tsx
  tests/features/header/navigation-config.test.ts
  tests/features/header/useNavigation.test.ts
  tests/integration/header-auth-flow.test.tsx

Files to modify:
  src/components/layout/ConditionalLayout.tsx
  src/app/[locale]/layout.tsx (if ThemeProvider missing)
  src/components/layout/Navbar.tsx (remove/replace with Header)
  AGENTS.md (update plan reference)

Files to delete:
  src/components/layout/Navbar.tsx (after Header replaces it)
```

## Verification

- [ ] Header renders on landing, auth, dashboard, and all management pages
- [ ] Header hides only on explicitly configured full-screen pages
- [ ] Guest users see public nav; authenticated users see role-based nav
- [ ] Language switch updates header text and flips layout direction
- [ ] Theme toggle switches between light and dark modes
- [ ] Responsive: nav collapses to hamburger on mobile, all items accessible
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader announces nav items correctly
- [ ] Active link is visually highlighted with animation
- [ ] All tests pass (`vitest run`)
- [ ] Lint passes (`eslint src/`)
