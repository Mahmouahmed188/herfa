# Contracts: Global Persistent Header

This directory defines contract interfaces for the Global Persistent Header feature.

## Contracts

### 1. Navigation Config Schema

**File**: `src/features/header/config/navigation.schema.ts` (to be created in implementation)

**Purpose**: Zod schema for validating navigation configuration at runtime.

```typescript
import { z } from 'zod';

const UserRoleSchema = z.enum(['client', 'technician', 'admin']);

const NavigationItemSchema = z.object({
  id: z.string().min(1),
  labelKey: z.string().min(1),
  href: z.string().min(1),
  roles: z.array(UserRoleSchema).optional(),
  icon: z.string().optional(),
  order: z.number().int().nonnegative(),
  children: z.array(z.lazy(() => NavigationItemSchema)).optional(),
  dividerBefore: z.boolean().optional(),
});

const NavigationConfigSchema = z.object({
  items: z.array(NavigationItemSchema),
});
```

**Contract**: Any navigation configuration consumed by the header MUST conform to `NavigationConfigSchema`. If the config fails validation, the header MUST fall back to a hardcoded default set of public navigation items and log a warning.

---

### 2. useNavigation Hook

**File**: `src/features/header/hooks/useNavigation.ts` (to be created in implementation)

**Purpose**: Given a user role and current pathname, return the filtered, ordered navigation items with active state.

**Input**:
- `role: UserRole | null` — current user's role (null for guests)
- `pathname: string` — current route path

**Output**:
```typescript
interface UseNavigationReturn {
  items: NavigationItem[];       // Filtered and sorted nav items
  isActive: (href: string) => boolean;  // Active link check
  isAuthenticated: boolean;       // Whether user is logged in
}
```

**Contract**: The hook MUST filter items where `roles` is undefined (public) or includes the user's role. Items MUST be sorted by `order`. The `isActive` function MUST match by checking if `pathname` starts with or equals `href`.

---

### 3. Header Component Props

**File**: `src/components/layout/Header.tsx` (to be created in implementation)

```typescript
interface HeaderProps {
  // No required props — header reads auth state from store and nav config from module.
}
```

**Contract**: The Header component MUST be self-contained — it reads auth from `useAuthStore`, nav config from `src/features/header/config/navigation.ts`, and does not require props from parent layouts. This ensures FR-002 consistency across all pages.

---

### 4. ConditionalLayout Integration

**File**: `src/components/layout/ConditionalLayout.tsx` (to be modified)

```typescript
// The layout MUST render the Header unless the current route matches a full-screen page set.
// Full-screen routes are defined as a constant: const FULL_SCREEN_ROUTES = Set<string>
```

**Contract**: The `ConditionalLayout` MUST include the Header on every page by default. Header is hidden ONLY when the current pathname (stripped of locale prefix) matches an entry in the full-screen pages set.
