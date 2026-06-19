# Feature Specification: Navigation & Role-Based Header Completion

**Feature Branch**: `015-navigation-role-header`

**Created**: 2026-06-19

**Status**: Draft

**Input**: User description: "Navigation & Role-Based Header Completion"

## User Scenarios & Testing

### User Story 1 — Guest Sees Public Navigation (Priority: P1)

An unauthenticated visitor accesses the platform and sees only the public navigation items: Services, AI Diagnosis, Technicians, About. No role-specific or authenticated navigation items are visible.

**Why this priority**: The public navigation is the base experience for all first-time visitors and is the simplest scenario to verify.

**Independent Test**: Can be fully tested by loading the homepage while logged out and confirming only the four public menu items appear.

**Acceptance Scenarios**:

1. **Given** a user is not authenticated, **When** they load any page, **Then** only Services, AI Diagnosis, Technicians, and About links appear in the header.
2. **Given** a guest user, **When** they open the mobile menu, **Then** only the same four public items are displayed.

---

### User Story 2 — Customer Sees Customer Navigation After Login (Priority: P1)

A user with role CUSTOMER logs in and sees Dashboard, My Bookings, and Profile in the header navigation. No provider or admin items are visible.

**Why this priority**: This is the primary authenticated user type and covers the most common login path.

**Independent Test**: Can be fully tested by logging in as a customer user and confirming the three customer menu items appear while provider/admin items are absent.

**Acceptance Scenarios**:

1. **Given** a user with role CUSTOMER is authenticated, **When** they load any page, **Then** Dashboard, My Bookings, and Profile links appear.
2. **Given** a customer user, **When** they navigate to `/client/dashboard`, **Then** the Dashboard menu item is highlighted as active.
3. **Given** a customer user, **When** they open the mobile menu, **Then** the same three customer items are displayed.

---

### User Story 3 — Provider Sees Provider Navigation After Login (Priority: P1)

A user with role PROVIDER logs in and sees Dashboard, My Jobs, Earnings, and Schedule in the header navigation. No customer or admin items are visible.

**Why this priority**: Provider-specific functionality is core to the platform's business model.

**Independent Test**: Can be fully tested by logging in as a provider user and confirming the four provider menu items appear while customer/admin items are absent.

**Acceptance Scenarios**:

1. **Given** a user with role PROVIDER is authenticated, **When** they load any page, **Then** Dashboard, My Jobs, Earnings, and Schedule links appear.
2. **Given** a provider user, **When** they navigate to `/technician/dashboard`, **Then** the Dashboard menu item is highlighted as active.
3. **Given** a provider user, **When** they open the mobile menu, **Then** the same four provider items are displayed.

---

### User Story 4 — Admin Sees Admin Navigation After Login (Priority: P1)

A user with role ADMIN logs in and sees all admin navigation items: Dashboard, Users, Providers, Bookings, Finance, Analytics, CMS, Notifications, Audit, and Settings. No customer or provider items are visible.

**Why this priority**: Admins manage the entire platform and need access to all administrative sections.

**Independent Test**: Can be fully tested by logging in as an admin user and confirming the ten admin menu items appear while customer/provider items are absent.

**Acceptance Scenarios**:

1. **Given** a user with role ADMIN is authenticated, **When** they load any page, **Then** all admin navigation links (Dashboard, Users, Providers, Bookings, Finance, Analytics, CMS, Notifications, Audit, Settings) appear.
2. **Given** an admin user, **When** they navigate to `/admin/dashboard`, **Then** the Dashboard menu item is highlighted as active.
3. **Given** an admin user, **When** they open the mobile menu, **Then** the same ten admin items are displayed.

---

### User Story 5 — Active Route Is Highlighted (Priority: P2)

When a user navigates to a role-specific page, the corresponding navigation item is visually indicated as active.

**Why this priority**: This improves usability by helping users understand where they are in the application.

**Independent Test**: Can be fully tested by navigating to each route and confirming the appropriate menu item receives an active state.

**Acceptance Scenarios**:

1. **Given** a customer on `/client/my-bookings`, **When** the page loads, **Then** the My Bookings menu item is highlighted.
2. **Given** an admin on `/admin/users`, **When** the page loads, **Then** the Users menu item is highlighted.
3. **Given** a provider on `/technician/earnings`, **When** the page loads, **Then** the Earnings menu item is highlighted.
4. **Given** any authenticated user on a non-matching route, **When** the page loads, **Then** no menu item is highlighted.

---

### User Story 6 — Navigation Translations Display Correctly (Priority: P3)

All navigation items display translated text based on the user's selected language. Translation keys exist for every navigation item in all supported locales.

**Why this priority**: Internationalization is essential for Arabic-speaking users and platform accessibility.

**Independent Test**: Can be fully tested by switching the application language and confirming all menu items display the correct translated text.

**Acceptance Scenarios**:

1. **Given** a user has selected Arabic as their language, **When** they view the navigation menu, **Then** all menu items display Arabic translations.
2. **Given** a user has selected English as their language, **When** they view the navigation menu, **Then** all menu items display English translations.
3. **Given** a new navigation item is added, **When** the page loads, **Then** a translation key exists and a fallback (key name or English text) is displayed if the translation is missing.

---

### Edge Cases

- What happens when a user's role is null, undefined, or an unexpected value?
- What happens when authentication state changes mid-session (token expiry, forced logout)?
- How does the system handle a deleted or deactivated user who is still logged in?
- How does mobile navigation behave when the screen is resized from desktop to mobile width?
- What happens when a user with a valid session tries to access a route they do not have permission for?
- How does the system handle browser back/forward navigation with active route highlighting?
- What happens when the backend returns a role value that does not match any expected role string?

## Requirements

### Functional Requirements

- **FR-001**: System MUST display correct navigation items based on the authenticated user's role (CUSTOMER, PROVIDER, ADMIN, or guest).
- **FR-002**: Guest users MUST see only the public navigation items: Services, AI Diagnosis, Technicians, About.
- **FR-003**: Customer users MUST see: Dashboard, My Bookings, Profile.
- **FR-004**: Provider users MUST see: Dashboard, My Jobs, Earnings, Schedule.
- **FR-005**: Admin users MUST see: Dashboard, Users, Providers, Bookings, Finance, Analytics, CMS, Notifications, Audit, Settings.
- **FR-006**: Navigation items MUST be identical between desktop and mobile views for the same user role.
- **FR-007**: The currently active route MUST be visually highlighted in the navigation menu.
- **FR-008**: Active route highlighting MUST match URL prefixes: `/client/*` for customer items, `/technician/*` for provider items, `/admin/*` for admin items.
- **FR-009**: System MUST map backend role values to the expected frontend role enum values (CUSTOMER, PROVIDER, ADMIN) via a role mapping layer.
- **FR-010**: System MUST correctly read `isAuthenticated` and `user.role` from the authentication state to determine navigation.
- **FR-011**: All navigation items MUST have corresponding translation keys in all supported locales.
- **FR-012**: Navigation MUST still render correctly (with fallback text) if a translation key is missing.
- **FR-013**: Each role-specific route MUST resolve to a page (or placeholder) without returning a 404 error.
- **FR-014**: Navigation MUST update immediately when the user's authentication state or role changes.
- **FR-015**: System MUST NOT make hardcoded assumptions about role strings — role mapping must be configurable.

### Key Entities

- **User**: Platform user with an assigned role (CUSTOMER, PROVIDER, ADMIN). Determines which navigation items are visible.
- **Navigation Item**: A menu entry with a label, route path, icon, and role visibility rules. Organized by role groups (guest, customer, provider, admin).
- **Route**: A URL path associated with a navigation item. Used for active-state detection and page rendering.
- **Translation Key**: A locale-specific string identifier for each navigation label (e.g., `Header.nav.dashboard`).

## Success Criteria

### Measurable Outcomes

- **SC-001**: Guest users see exactly 4 public navigation items and no authenticated items.
- **SC-002**: Customer users see exactly 3 customer navigation items after login.
- **SC-003**: Provider users see exactly 4 provider navigation items after login.
- **SC-004**: Admin users see exactly 10 admin navigation items after login.
- **SC-005**: All role-specific routes (`/client/*`, `/technician/*`, `/admin/*`) load without error.
- **SC-006**: Mobile navigation displays the same items as desktop navigation for every role.
- **SC-007**: Active route highlighting works for all navigation items with no false positives.
- **SC-008**: Translation keys exist for all 16 navigation items across all supported locales.
- **SC-009**: Role mapping correctly normalizes backend role strings (case-insensitive) to frontend enum values.

## Assumptions

- The existing authentication store (`useAuthStore`) and login flow are functional and provide `isAuthenticated` and `user.role`.
- Backend role values may differ in case from frontend expected values; a mapping layer will normalize them.
- Role-specific pages that do not yet exist will be created as placeholder screens with a basic layout and will be connected to backend APIs in a future iteration.
- Desktop and mobile navigation components share the same data source for navigation items.
- The application supports Arabic and English locales (RTL and LTR).
- Only three authenticated roles exist: CUSTOMER, PROVIDER, ADMIN.
- Navigation items are defined in a single source of truth (not duplicated across components).
