# Navigation API Contracts

## Auth Store Contract (`useAuthStore`)

Provides authentication state consumed by navigation filtering.

```typescript
interface AuthState {
  user: User | null;              // User object with role field
  isAuthenticated: boolean;        // True when user is logged in
  token: string | null;            // JWT token
  isInitializing: boolean;         // True during auth hydration
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;  // 'CUSTOMER' | 'PROVIDER' | 'ADMIN' | 'SUPER_ADMIN'
  avatarUrl?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
}
```

**Consumed by**: `useNavigation` hook, `HeaderActions`, `AppSidebar`

---

## Navigation Config Contract (`navigationConfig`)

The single source of truth for all navigation items.

```typescript
interface NavigationItem {
  id: string;
  labelKey: string;           // next-intl message key
  href: string;               // Route path
  roles?: UserRole[];        // Empty/absent = public; present = role-gated
  icon?: string;               // Icon name (admin items only)
  order: number;               // Sort order (ascending)
  children?: NavigationItem[];
  dividerBefore?: boolean;
}

interface NavigationConfig {
  items: NavigationItem[];
}
```

**Consumed by**: `useNavigation` hook

---

## useNavigation Hook Contract

The primary interface for consuming filtered navigation items.

```typescript
interface UseNavigationResult {
  items: NavigationItem[];       // Filtered + sorted items for current user
  isActive: (href: string) => boolean;  // Route matching function
}

function useNavigation(currentPathname: string): UseNavigationResult;
```

**Filtering rules**:
- Items with no `roles` or empty `roles` → visible to everyone (public)
- Items with `roles` and user is authenticated → visible if `item.roles.includes(user.role)`
- Items with `roles` and user is NOT authenticated → hidden
- Items are sorted by `order` (ascending)

**Active route detection**:
- `isActive(href)` returns `true` if `currentPathname.startsWith(href)`
- For root `/`, requires exact match

**Consumed by**: `Header.tsx`, `HeaderNav.tsx`, `HeaderMobileNav.tsx`

---

## Header Component Contracts

### HeaderProps
```typescript
interface HeaderProps {
  // No external props — reads auth state and navigation internally
}
```

### HeaderNavProps (Desktop)
```typescript
interface HeaderNavProps {
  items: NavigationItem[];
  isActive: (href: string) => boolean;
}
```

### HeaderMobileNavProps
```typescript
interface HeaderMobileNavProps {
  items: NavigationItem[];
  isActive: (href: string) => boolean;
}
```

### HeaderActionsProps
```typescript
interface HeaderActionsProps {
  // No external props — reads auth state and navigation internally
}
```

---

## Translation Key Contract

All navigation labels use `next-intl` message keys under two namespaces:

**Guest (public) items**: `Navbar.*`
```typescript
'Navbar.services'       // "Services"
'Navbar.aiDiagnosis'    // "AI Diagnosis"
'Navbar.technicians'    // "Technicians"
'Navbar.about'          // "About"
```

**Authenticated items**: `Header.nav.*`
```typescript
'Header.nav.dashboard'       // "Dashboard" (customer/provider)
'Header.nav.myBookings'      // "My Bookings"
'Header.nav.profile'         // "Profile" (customer)
'Header.nav.myJobs'          // "My Jobs"
'Header.nav.earnings'        // "Earnings"
'Header.nav.schedule'        // "Schedule"
'Header.nav.adminDashboard'  // "Dashboard" (admin)
'Header.nav.users'           // "Users"
'Header.nav.providers'       // "Providers"
'Header.nav.bookings'        // "Bookings"
'Header.nav.finance'         // "Finance"
'Header.nav.analytics'       // "Analytics"
'Header.nav.cms'             // "CMS"
'Header.nav.notifications'   // "Notifications"
'Header.nav.audit'           // "Audit Logs"
'Header.nav.settings'        // "Settings"
```

Each key must exist in `en.json` and `ar.json`.

---

## Middleware Route Protection Contract

```typescript
const PUBLIC_ROUTES = [
  '/login', '/register', '/about', '/technicians',
  '/ai-diagnosis', '/services', '/support'
];

const PROTECTED_PREFIXES = ['/admin', '/client', '/technician'];
```

- Routes matching `PUBLIC_ROUTES` are accessible to all users
- Routes starting with `PROTECTED_PREFIXES` require authentication
- Unauthenticated access to protected routes redirects to `/login`
- Unauthorized role access to protected routes shows 403 or redirects to user's dashboard
