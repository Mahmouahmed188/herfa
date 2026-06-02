# Data Model: Global Persistent Header

## Entities

### User (existing — `src/store/useAuthStore.ts`)

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique user identifier |
| `name` | `string` | User display name |
| `email` | `string` | User email address |
| `role` | `'client' \| 'technician' \| 'admin'` | User role for permission-based navigation |
| `avatar?` | `string` | Avatar image URL |
| `status?` | `string` | Account status |

**Source**: Zustand persisted store (`herfa-auth-storage`). Drives header auth awareness (FR-003).

---

### NavigationItem

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier for the nav item |
| `labelKey` | `string` | i18n key for the display label (e.g., `Navbar.dashboard`) |
| `href` | `string` | Route path relative to locale prefix |
| `roles?` | `UserRole[]` | Roles that can see this item. Absent = public. |
| `icon?` | `string` | Icon name from lucide-react |
| `order` | `number` | Display order (lower = first) |
| `children?` | `NavigationItem[]` | Nested sub-items (for dropdown menus) |
| `dividerBefore?` | `boolean` | Render a visual divider before this item |

**Validation**: Zod schema at `src/features/header/config/navigation.schema.ts`.

---

### NavigationConfig

| Field | Type | Description |
|-------|------|-------------|
| `items` | `NavigationItem[]` | Ordered list of all navigation items across all roles |

**Behavior**: Filtered by the `useNavigation` hook based on the current user's role. A flat structure with optional `children` for hierarchical menus.

---

### HeaderState (UI-only, Zustand)

| Field | Type | Description |
|-------|------|-------------|
| `mobileMenuOpen` | `boolean` | Whether the mobile navigation drawer is open |
| `notificationsOpen` | `boolean` | Whether the notification panel is visible |

**Source**: Local React state (useState) in Header component. Not persisted — resets on page navigation.

---

## Relationships

```
NavigationConfig (1) ──has many──> NavigationItem (many)
                                       │
                                       └──optional children──> NavigationItem (sub-items)

User (1) ──has role──> UserRole (1)
                            │
                            └──determines──> NavigationItem filtering
```

## State Transitions

| Trigger | From | To | Effect on Header |
|---------|------|-----|------------------|
| User logs in | Guest | Authenticated | Header switches from public nav to role-based nav |
| User logs out | Authenticated | Guest | Header reverts to public nav, clears user-specific UI |
| Session expires | Authenticated | Guest | Header gracefully reverts (no error state) |
| Language switch | Current lang | New lang | All header labels update immediately, layout flips if RTL/LTR |
| Theme toggle | Light | Dark | Header and all elements switch theme (delegated to next-themes) |
| Viewport crosses `md` breakpoint | Desktop | Mobile | Navigation collapses from inline to hamburger menu |
| Page marked full-screen | Header visible | Header hidden | Header removed from DOM, no layout shift |
