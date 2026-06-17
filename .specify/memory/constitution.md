<!--
Sync Impact Report
Version change: 2.0.0 → 3.0.0
List of modified principles:
  - I. Feature-Based Architecture → I. API-First Architecture
  - II. Zero-Trust & Permission-Based UI → II. Feature-Based Modularity
  - III. Type-Safe Enterprise Excellence → III. Three-Pillar UX
  - IV. Server-State Dominance (TanStack Query) → IV. Role-Based Access & Security
  - V. Consistent Design Language → V. Server-State Dominance
  - VI. Observable Admin Operations → VI. Error & Loading State Discipline
  - VII. Universal Accessibility & I18n → VII. AI Feature Integrity
  - (new) → VIII. Universal Accessibility & Responsive Design (merged from VII)
Added sections:
  - Three-Pillar UX (Customer / Provider / Admin)
  - Error & Loading State Discipline
  - AI Feature Integrity
  - Frontend Folder Structure Guidelines
  - Page Creation Guidelines
  - Component Design Guidelines
Removed sections:
  - Admin Dashboard Architecture (scope expanded to full platform)
  - Data Tables & Search Standards (folded into Component Design Guidelines)
Templates requiring updates:
  - .specify/templates/plan-template.md (⚠ pending - Constitution Check needs update)
  - .specify/templates/spec-template.md (✅ no changes needed)
  - .specify/templates/tasks-template.md (✅ no changes needed)
Follow-up TODOs: None
-->
# Herfa Frontend Constitution

This constitution defines the foundational engineering standards and architectural
principles for the Herfa Frontend platform. It is the supreme authority for all
frontend engineering decisions. Every feature, component, and page must comply with
these principles.

## Core Principles

### I. API-First Architecture

The backend API is the single source of truth. Every frontend feature MUST be mapped
to an existing backend endpoint. No fake data, no placeholder business logic, and no
frontend-only business rules are permitted. A feature's API contract (method, route,
request shape, response shape) MUST be defined in a typed service layer before any UI
is built.

- All API calls MUST go through `src/features/[domain]/services/api.ts` or
  `src/services/api.ts` using the fetch-based or axios-based client.
- Response types MUST be defined as TypeScript interfaces, and Zod schemas MUST
  validate all runtime data received from the API.
- API errors MUST be surfaced consistently through the application's error-handling
  layer (see Principle VI).
- Endpoints are versioned under `/api/v1/`; the frontend MUST respect that prefix.
- Every mutation MUST invalidate the relevant TanStack Query cache on success.

Rationale: Prevents drift between backend capability and frontend behavior. Ensures
the frontend never invents workflows the backend cannot support.

### II. Feature-Based Modularity

The frontend MUST follow strict feature-based organization. Every business domain
(Bookings, Providers, Payments, Support, etc.) MUST live in its own directory under
`src/features/`. Cross-feature dependencies MUST be minimized. Truly shared logic
belongs in `src/lib/` or `src/components/ui/`.

- Each feature module MAY contain: `services/`, `hooks/`, `components/`, `schemas/`,
  `types/`, and `stores/` subdirectories.
- Pages are NOT created inside feature modules; they live in `src/app/[locale]/` and
  import from feature modules.
- A feature MUST NOT import from another feature's internal implementation; shared
  contracts MUST be extracted to `packages/common/` or `src/lib/`.
- Removing a feature directory MUST NOT break unrelated features.

Rationale: Keeps the codebase navigable as the platform scales to 15+ domains. Enables
parallel development across teams responsible for different domains.

### III. Three-Pillar UX

The platform serves three distinct user types: Customers, Providers, and Administrators.
Each MUST have a UX paradigm tailored to their workflows as derived from the backend
business logic.

- **Customer Experience**: Service discovery, booking creation via multi-step form, job
  tracking with status timeline, saved technicians, wallet/balance, profile management.
  Minimal cognitive load, guided flows, transparent status communication.
- **Provider Experience**: Job requests and assignments, offer submission on tenders,
  earnings tracking with payout history, verification onboarding, schedule management,
  customer messaging. Empowers the provider to run their business efficiently.
- **Admin Experience**: Oversight dashboards with KPIs, user/provider management with
  data tables, verification queue with approve/reject workflow, finance/payouts
  processing, support ticket management, CMS, notifications broadcast, platform
  settings, audit logs, analytics with charts.
- Each portal MUST be a clearly separated route group under `src/app/[locale]/`
  (e.g., `(customer)/`, `(provider)/`, `(admin)/`).
- Navigation MUST be role-aware and filter sidebar/header items by the current user's
  role.

Rationale: Each user has fundamentally different goals. A single UI pattern cannot
serve all three without compromising the experience for at least one group.

### IV. Role-Based Access & Security

Every route, navigation item, component, and action MUST be guarded by a role or
permission check. Unauthorized UI elements MUST be hidden, not just disabled. The
frontend enforces Zero-Trust principles at the UI layer.

- **Route protection**: Next.js Middleware (`src/middleware.ts`) MUST guard admin and
  authenticated-only routes. Unauthenticated users are redirected to `/login`.
- **Component protection**: `PermissionGuard`
  (`src/components/auth/PermissionGuard.tsx`) MUST wrap action triggers (buttons,
  links, form submissions).
- **Navigation filtering**: Sidebar and header navigation MUST filter items by the
  current user's role (`client`, `technician`, `admin`).
- **Audit trail**: All destructive or sensitive actions (status changes, payouts,
  moderation, user suspension) MUST be audited via the audit log endpoint.
- **Token management**: The JWT token stored in `useAuthStore` MUST be attached to
  every authenticated request. On 401 responses, clear the token and redirect to login.
- **Verification gates**: Unverified technicians MUST be redirected to the onboarding
  flow and blocked from accepting jobs or submitting offers.
- **Session timeout**: Inactive sessions MUST be detected client-side and the user
  SHOULD be logged out after the configured `sessionTimeout`.

Rationale: Security is not just an API concern. Hiding unauthorized actions improves
usability and reduces the attack surface.

### V. Server-State Dominance

Server state MUST be managed exclusively via TanStack Query (React Query). Global
client state (Zustand) is reserved strictly for transient UI concerns (sidebar toggle,
theme preference, language selection).

- Every GET endpoint MUST have a corresponding TanStack Query hook in
  `src/features/[domain]/hooks/`.
- Mutations MUST use `useMutation` with optimistic updates where appropriate and
  proper cache invalidation on success.
- Query keys MUST follow a consistent naming convention:
  `['domain', 'entity', ...params]` (e.g., `['bookings', 'list', filters]`).
- Zustand stores MUST be persisted only when necessary (auth token, theme). Most UI
  state SHOULD be ephemeral.
- Prefetching SHOULD be used for anticipated navigations (e.g., hover on a booking row
  prefetches booking details).

Rationale: Separating server and client state eliminates a major class of bugs.
TanStack Query provides caching, refetching, and background sync out of the box.

### VI. Error & Loading State Discipline

Every API-consuming component MUST handle four states: loading, empty, error, and
success. No screen may be left in an indeterminate state.

- **Loading state**: Skeleton components (`<Skeleton />`) or spinner indicators MUST
  appear immediately when a query starts (check `isLoading` from TanStack Query).
- **Empty state**: When data returns empty, a meaningful empty-state message with an
  action CTA MUST be shown (e.g., "No bookings yet. Create your first booking.").
- **Error state**: On query/mutation failure, a user-friendly error message MUST be
  displayed with a retry action. Technical details MAY be logged to console/Sentry
  but MUST NOT be shown to end users.
- **Form submission errors**: Server-side validation errors MUST be mapped back to
  individual form fields via React Hook Form `setError`. Non-field errors MUST appear
  as a toast or banner.
- **Global error boundary**: `ErrorBoundary`
  (`src/components/common/ErrorBoundary.tsx`) MUST wrap the application root and
  each portal root.
- **Offline detection**: The UI SHOULD detect network loss and display a banner
  indicating offline mode.

Rationale: Professional applications never show blank screens or raw error dumps.
Every state is designed, not an afterthought.

### VII. AI Feature Integrity

AI features (AI Chat Assistant, AI Image Analysis) MUST be backed by the backend
AI Gateway module. The frontend's role is to provide the interface for input capture,
result display, and fallback handling.

- **No fake AI**: The current mock implementation in `/ai-diagnosis` MUST be replaced
  with real API calls to the AI Gateway once available.
- **Streaming support**: Chat interactions SHOULD use streaming (Server-Sent Events
  or WebSocket) to provide a responsive real-time experience.
- **Loading state**: AI analysis MUST show a progress indicator or skeleton during
  processing. Users MUST NOT be left wondering if the system is working.
- **Error fallback**: If the AI Gateway is unavailable, display a graceful error with
  a "Try again" button and a fallback CTA (e.g., "Browse technicians manually").
- **Image upload**: Image analysis MUST support preview, validation (size, type), and
  secure upload via the `/api/v1/uploads` endpoint.
- **Result display**: AI diagnosis results (issue detection, severity, cost estimate,
  recommended expert type) MUST be displayed in a clear, scannable card layout.

Rationale: AI is a core differentiator for Herfa. The frontend must present it
reliably and transparently, never misleading the user with fake processing.

### VIII. Universal Accessibility & Responsive Design

The platform MUST be accessible (WCAG 2.2 AA) and fully responsive across devices.
Full parity between Arabic (RTL) and English (LTR) is mandatory.

- **I18n**: All user-facing text MUST use `next-intl` message keys. Hardcoded strings
  are forbidden outside of i18n configuration files.
- **RTL**: Layouts MUST use logical CSS properties (`inset-inline-start`,
  `margin-inline-end`) where possible. Mirrored layouts MUST be tested at the
  component level for every new or modified component.
- **Responsive breakpoints**: Support mobile (<640px), tablet (640-1024px), and
  desktop (>1024px) viewports. Admin portal MAY be desktop-first with responsive
  concessions for key workflows.
- **Accessibility**: Forms MUST have associated labels, images MUST have alt text,
  interactive elements MUST be keyboard-navigable, and color contrast MUST meet
  WCAG 2.2 AA standards.
- **Herfa brand preservation**: Colors, typography (Manrope), border radius, and the
  overall visual identity MUST remain unchanged. UX improvements MUST NOT alter the
  established design language.
- **Dark mode**: The `class`-based dark mode strategy MUST be maintained. All
  components MUST render correctly in both themes.

Rationale: Herfa serves a bilingual Saudi market. Both accessibility and responsive
design are non-negotiable business requirements.

## Technical Standards

### Frontend Folder Structure Guidelines

```
src/
├── app/
│   └── [locale]/
│       ├── (auth)/                    # Login, Register (guest layout)
│       ├── (customer)/                # Customer portal
│       │   ├── dashboard/
│       │   ├── create-job/
│       │   ├── jobs/
│       │   ├── saved/
│       │   ├── wallet/
│       │   └── profile/
│       ├── (provider)/                # Provider portal
│       │   ├── dashboard/
│       │   ├── onboarding-home/
│       │   ├── requests/
│       │   ├── jobs/
│       │   ├── offers/
│       │   ├── messages/
│       │   ├── earnings/
│       │   └── profile/
│       ├── (admin)/                   # Admin portal
│       │   ├── dashboard/
│       │   ├── users/
│       │   ├── providers/
│       │   ├── bookings/
│       │   ├── jobs/
│       │   ├── finance/
│       │   ├── support/
│       │   ├── cms/
│       │   ├── notifications/
│       │   ├── analytics/
│       │   ├── audit/
│       │   ├── settings/
│       │   └── complaints/
│       ├── services/                  # Public service listing
│       ├── technicians/               # Public technician search
│       ├── ai-diagnosis/              # AI diagnosis tool
│       ├── about/                     # About page
│       ├── booking/[id]/              # Multi-step booking
│       ├── tenders/                   # Tender create + detail
│       └── support/                   # Support chat
├── components/
│   ├── auth/                          # ProtectedRoute, PermissionGuard
│   ├── common/                        # Loading, ErrorBoundary, LanguageSwitcher
│   ├── layout/                        # Header, Footer, Sidebar, ConditionalLayout
│   ├── landing/                       # Homepage sections
│   ├── ui/                            # Primitives (button, card, input, data-table)
│   │   ├── charts/                    # Recharts wrappers
│   │   ├── feedback/                  # Dialog, toast, skeleton
│   │   ├── filters/                   # SearchFilter, FilterSidebar
│   │   └── forms/                     # FormField
│   └── providers.tsx                  # Root providers
├── features/                          # Business domain modules
│   ├── analytics/                     # Overview, revenue chart, booking chart,
│   │   ├── services/                  #   conversion funnel, retention report
│   │   ├── hooks/
│   │   ├── components/
│   │   ├── schemas/
│   │   └── types/
│   ├── audit/                         # Activity logs
│   ├── auth/                          # Login, register, token refresh, profile
│   ├── bookings/                      # Create, track, timeline, dispute
│   ├── client/                        # Client dashboard components
│   ├── cms/                           # Categories, banners
│   ├── dashboard/                     # Shared dashboard widgets
│   ├── finance/                       # Payouts, revenue stats
│   ├── header/                        # Navigation config
│   ├── landing/                       # Landing page sections
│   ├── notifications/                 # Broadcasts, templates, user notifications
│   ├── providers/                     # Verification, provider management
│   ├── settings/                      # Commission, localization, security, flags
│   ├── support/                       # Tickets, reviews moderation, reports
│   └── users/                         # User management, RBAC
├── i18n/                              # next-intl config + locale files
├── lib/                               # Shared utilities (axios, navigation, query)
├── messages/                          # ar.json, en.json
├── store/                             # Zustand: useAuthStore, useUIStore
├── types/                             # Global types (api.d.ts)
└── middleware.ts                      # Route protection + i18n redirect
```

### Page Creation Guidelines

- Each page MUST be placed within the appropriate route group under
  `src/app/[locale]/` matching the user's role:
  `(auth)`, `(customer)`, `(provider)`, or `(admin)`.
- Page components MUST be thin: they compose feature components, orchestrate data,
  and set page metadata. Business logic MUST NOT live in page files.
- Server Components (Next.js App Router default) SHOULD be used for data fetching
  whenever possible. Client Components MUST be isolated to interactive leaf nodes.
- Every page MUST export metadata (`generateMetadata` or `metadata` object) with a
  localized title. Breadcrumb navigation SHOULD be provided where context helps.
- Page layout MUST be consistent within its portal:
  - Customer: centered single-column with sidebar.
  - Provider: dashboard layout with sidebar.
  - Admin: full-width layout with collapsible sidebar and top header.
- Loading states for page-level data MUST use `loading.tsx` (Next.js App Router)
  with a skeleton matching the page layout.

### Component Design Guidelines

- **UI primitives** (`src/components/ui/`) MUST be presentation-only, stateless, and
  use `class-variance-authority` (CVA) for variant management. They MUST NOT import
  from feature modules or access stores directly.
- **Feature components** (`src/features/[domain]/components/`) contain domain-specific
  UI logic. They MAY use TanStack Query hooks, Zod validation, and store selectors.
- **Composition over configuration**: Prefer slot/children patterns over monolithic
  props-based configuration.
- **Radix UI primitives**: MUST use Radix UI for complex interactive patterns (tabs,
  dialog, dropdown, select) to inherit accessible behavior out of the box.
- **Data tables**: All large data sets MUST use the shared `DataTable` component
  (`src/components/ui/data-table.tsx`) with server-side pagination, sorting, and
  filtering. Tables MUST support column visibility, bulk actions, and search synced
  with URL state for deep-linking.
- **Tailwind CSS**: All styling MUST use Tailwind utility classes. Custom CSS in
  `globals.css` is permitted only for base resets, keyframes, and CSS variables.

## Development Workflow

### Git & Commit Conventions
- **Branch naming**: `<ticket-id>-<kebab-case-description>` (e.g., `142-booking-form`).
- **Commits**: Conventional Commits specification (`feat:`, `fix:`, `docs:`,
  `refactor:`, `test:`, `chore:`).
- **PRs**: MUST pass `npm run lint`, `npm run typecheck`, and `npm run test` before
  merging.

### Testing Strategy
- **Unit tests** (Vitest): Mandatory for business logic, utility functions, and Zod
  schema validation. Located in `tests/unit/`.
- **Integration tests** (Vitest + RTL): Mandatory for complex feature flows and
  multi-step forms. Located in `tests/integration/`.
- **Component tests**: Interactive components MUST have tests covering user
  interactions. Located in `tests/components/`.
- **E2E tests** (Playwright recommended): Critical paths (Auth flow, Booking creation,
  Payout processing) SHOULD be covered.

### Code Review Checklist
Every PR MUST be reviewed against this Constitution. The reviewer MUST verify:
- **I (API-First)**: API calls use real endpoints; no fake data or placeholder logic.
- **II (Modularity)**: Code placed in the correct feature directory; no cross-feature
  imports of internal implementation.
- **III (Three-Pillar UX)**: Page is in the correct portal route group; navigation
  is role-filtered.
- **IV (RBAC)**: Permission guards present on restricted routes, components, and
  actions; audit logging enabled for sensitive operations.
- **V (Server-State)**: TanStack Query used (not raw fetch/axios in components);
  Zustand scoped to UI-only state.
- **VI (States)**: Loading skeleton, empty state, and error boundary defined for each
  data-driven component.
- **VII (AI)**: AI features wired to backend gateway (not mocked); streaming, loading,
  and fallback states implemented.
- **VIII (A11y & I18n)**: All text uses i18n keys; RTL layout tested; keyboard
  navigation verified; responsive breakpoints covered.

## Governance

This Constitution is the supreme authority for all frontend engineering decisions in
the Herfa project. Amendments require a formal proposal with rationale, a documented
impact analysis, and explicit approval. Compliance is verified during code reviews and
sprint retrospectives.

**Amendment procedure**:
1. Propose the amendment in writing, describing the principle change and its impact.
2. Document the version bump reason (MAJOR for breaking changes, MINOR for additions,
   PATCH for clarifications).
3. Update this document and propagate changes to dependent templates.
4. Obtain team consensus.

**Versioning**: MAJOR.MINOR.PATCH following semantic versioning applied to governance:
- MAJOR: Backward incompatible principle removals or redefinitions.
- MINOR: New principle or materially expanded guidance.
- PATCH: Clarifications, typo fixes, non-semantic refinements.

**Version**: 3.0.0 | **Ratified**: 2026-05-30 | **Last Amended**: 2026-06-18
