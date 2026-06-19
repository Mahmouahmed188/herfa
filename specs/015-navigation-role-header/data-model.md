# Data Model: Navigation & Role-Based Header Completion

## Entity: User

Represents an authenticated platform user. Determines which navigation items are visible.

| Field | Type | Description | Values |
|-------|------|-------------|--------|
| `id` | string | Unique identifier | UUID |
| `email` | string | User email address | Valid email |
| `firstName` | string | User first name | Free text |
| `lastName` | string | User last name | Free text |
| `phone` | string (optional) | User phone number | E.164 format |
| `role` | UserRole | User's platform role | `'CUSTOMER'`, `'PROVIDER'`, `'ADMIN'`, `'SUPER_ADMIN'` |
| `avatarUrl` | string (optional) | Profile image URL | URL string |
| `status` | UserStatus | Account status | `'ACTIVE'`, `'SUSPENDED'`, `'PENDING'` |

**Relationships**:
- A User has one role that maps to a navigation item group
- A User's role determines their portal route group: `(customer)/`, `(provider)/`, `(admin)/`

**State Transitions**:
- Not Authenticated → Authenticated: `login()` sets user + isAuthenticated
- Authenticated → Not Authenticated: `logout()` clears all state
- Initializing → Ready: `useInitializeAuth` resolves, `isInitializing` becomes `false`

## Entity: NavigationItem

A single menu entry in the header navigation.

| Field | Type | Description | Values |
|-------|------|-------------|--------|
| `id` | string | Unique item identifier | e.g., `'services'`, `'dashboard'`, `'users'` |
| `labelKey` | string | Translation message key | e.g., `'Navbar.services'`, `'Header.nav.dashboard'` |
| `href` | string | Route path | e.g., `'/services'`, `'/client/dashboard'`, `'/admin/users'` |
| `roles` | UserRole[] (optional) | Allowed user roles | If absent/empty, item is public |
| `icon` | string (optional) | Icon component name | For admin items with icons |
| `order` | number | Display sort order | Lower values appear first |
| `children` | NavigationItem[] (optional) | Nested sub-items | For hierarchical menus |
| `dividerBefore` | boolean (optional) | Visual separator | For grouped items |

**Relationships**:
- A NavigationItem may have zero or more `roles` that gate visibility
- A NavigationItem with no `roles` is visible to all users (public)
- A NavigationItem's `href` matches a route in `src/app/[locale]/`

**State Transitions**:
- Filtered based on `user.role`: item is visible iff `item.roles` is empty or `item.roles.includes(user.role)`
- Sorted by `order` field ascending

## Entity: Route

A URL path associated with a navigation item. Used for active-state highlighting and page rendering.

| Field | Type | Description | Values |
|-------|------|-------------|--------|
| `path` | string | Route path | e.g., `'/client/dashboard'` |
| `roleGroup` | string | Portal route group | `'customer'`, `'provider'`, `'admin'`, `'public'` |
| `pageExists` | boolean | Whether a page component exists | `true` or `false` |

**Relationships**:
- One-to-one with NavigationItem by `href` field
- Routes are grouped by role prefix: `/client/*` → customer, `/technician/*` → provider, `/admin/*` → admin

**Active Detection**:
- A route is active if `pathname.startsWith(navigationItem.href)`
- For root path `/`, exact match required

## Entity: TranslationKey

A locale-specific string identifier for each navigation label.

| Field | Type | Description | Values |
|-------|------|-------------|--------|
| `key` | string | Translation message key | e.g., `'Header.nav.dashboard'` |
| `locale` | string | Language code | `'en'`, `'ar'` |
| `value` | string | Translated text | Localized string |

**Relationships**:
- Each NavigationItem has one labelKey that maps to a TranslationKey
- Each key must exist in all supported locales
- Missing keys fall back to English value or key name

## Navigation Item Groups

### Guest (Public)
| ID | Label Key | Route | Order |
|----|-----------|-------|-------|
| services | `Navbar.services` | `/services` | 10 |
| aiDiagnosis | `Navbar.aiDiagnosis` | `/ai-diagnosis` | 20 |
| technicians | `Navbar.technicians` | `/technicians` | 30 |
| about | `Navbar.about` | `/about` | 40 |

### Customer (CUSTOMER)
| ID | Label Key | Route | Order |
|----|-----------|-------|-------|
| myBookings | `Header.nav.myBookings` | `/client/my-bookings` | 10 |
| dashboard | `Header.nav.dashboard` | `/client/dashboard` | 20 |
| profile | `Header.nav.profile` | `/client/profile` | 30 |

### Provider (PROVIDER)
| ID | Label Key | Route | Order |
|----|-----------|-------|-------|
| myJobs | `Header.nav.myJobs` | `/technician/my-jobs` | 10 |
| earnings | `Header.nav.earnings` | `/technician/earnings` | 20 |
| schedule | `Header.nav.schedule` | `/technician/schedule` | 30 |
| dashboard | `Header.nav.dashboard` | `/technician/dashboard` | 40 |

### Admin (ADMIN)
| ID | Label Key | Route | Order |
|----|-----------|-------|-------|
| adminDashboard | `Header.nav.adminDashboard` | `/admin/dashboard` | 10 |
| users | `Header.nav.users` | `/admin/users` | 20 |
| providers | `Header.nav.providers` | `/admin/providers` | 30 |
| bookings | `Header.nav.bookings` | `/admin/bookings` | 40 |
| finance | `Header.nav.finance` | `/admin/finance` | 50 |
| analytics | `Header.nav.analytics` | `/admin/analytics` | 60 |
| cms | `Header.nav.cms` | `/admin/cms` | 70 |
| notifications | `Header.nav.notifications` | `/admin/notifications` | 80 |
| audit | `Header.nav.audit` | `/admin/audit` | 90 |
| settings | `Header.nav.settings` | `/admin/settings` | 100 |
