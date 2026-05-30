<!--
Version change: 1.0.0 -> 2.0.0
List of modified principles:
  - I. Scalability & Clean Architecture -> I. Feature-Based Architecture
  - II. Security-First & Zero Trust -> II. Zero-Trust & Permission-Based UI
  - III. Mobile-First & Cross-Platform Parity -> III. Type-Safe Enterprise Excellence
  - IV. Multilingual & Internationalization -> IV. Server-State Dominance (TanStack Query)
  - V. Type-Safe Development & Validation -> V. Consistent Design Language
  - VI. Observability & Monitoring -> VI. Observable Admin Operations
  - VII. SOLID Principles Enforcement -> VII. Universal Accessibility & I18n
Added sections:
  - Admin Dashboard Architecture Standards
  - Data Tables & Search Standards
  - Security & RBAC Architecture
Removed sections:
  - Mobile-First specifics (scope narrowed to Admin Dashboard)
  - Backend implementation details (moved out of scope)
Templates requiring updates:
  - .specify/templates/plan-template.md (✅ updated)
  - .specify/templates/spec-template.md (✅ updated)
  - .specify/templates/tasks-template.md (✅ updated)
Follow-up TODOs: None
-->
# Herfa Admin Dashboard Constitution

This constitution defines the foundational engineering standards and architectural principles for the Herfa Admin Dashboard. It is the supreme authority for all frontend engineering decisions within this project.

## Core Principles

### I. Feature-Based Architecture
We enforce a strict feature-based modularity. Every domain (Users, Providers, Bookings, etc.) MUST live within its own directory in `src/features/`. Cross-feature dependencies MUST be minimized; shared logic belongs in `src/lib/` or `src/components/ui/`. This ensures the system remains maintainable as the enterprise dashboard scales.

### II. Zero-Trust & Permission-Based UI
Security is integrated into the UI. We follow Zero-Trust principles: every route, component, and action MUST be guarded by a permission check. The UI MUST reflect the user's role and permissions dynamically, ensuring that unauthorized actions are not only blocked at the API level but also hidden from the user interface.

### III. Type-Safe Enterprise Excellence
Strict TypeScript (v5+) is non-negotiable. `any` is strictly forbidden. We leverage Zod for runtime validation of all external data (API responses, form inputs). Component APIs MUST be documented through explicit prop types using `class-variance-authority` (CVA) for complex UI states.

### IV. Server-State Dominance (TanStack Query)
Server state MUST be managed exclusively via TanStack Query. Global client state (Zustand) is reserved for transient UI state (e.g., sidebar toggles, theme preferences). We prioritize optimistic updates and robust cache management to ensure the dashboard feels instantaneous and reliable.

### V. Consistent Design Language
The dashboard MUST adhere to the Herfa Design System. We use Radix UI primitives with Tailwind CSS for styling. Layouts MUST be consistent across all modules, utilizing shared components for tables, forms, and charts. Design consistency is a first-class citizen to reduce cognitive load for administrators.

### VI. Observable Admin Operations
Every administrative action MUST be traceable. We implement frontend logging for critical events and integrate with Sentry for error monitoring. Performance tracking (Core Web Vitals) for heavy data tables and charts is mandatory to ensure the dashboard remains responsive under heavy load.

### VII. Universal Accessibility & I18n
The dashboard MUST be accessible to all users, adhering to WCAG 2.2 AA standards. Full parity between Arabic (RTL) and English (LTR) is mandatory. Layouts MUST be fluid to handle varying text lengths, and RTL support MUST be tested at the component level using `next-intl` and `i18next`.

## Technical Standards

### Admin Dashboard Architecture
- **Framework**: Next.js 14+ (App Router).
- **Styling**: Tailwind CSS + CVA + tailwind-merge.
- **State**: TanStack Query (Server), Zustand (Client).
- **Forms**: React Hook Form + Zod.

### Data Tables & Search Standards
- **Implementation**: All large data sets MUST use server-side pagination, sorting, and filtering.
- **Features**: Tables MUST support column visibility, bulk actions, and CSV/Excel export.
- **UX**: Search and filters MUST be synced with the URL state to allow deep-linking.

### Security & RBAC Architecture
- **Auth**: Next.js Middleware for route protection.
- **Permissions**: `PermissionGuard` components for fine-grained action control.
- **Audit**: Track and log all "destructive" or "sensitive" admin actions on the frontend before dispatching.

## Development Workflow

### Git & Commit Conventions
- **Workflow**: Feature branches named `###-description`.
- **Commits**: Conventional Commits standard.
- **PRs**: MUST pass linting, type-checking, and build tests.

### Testing Strategy
- **Unit**: Mandatory for business logic, utils, and shared UI components.
- **Integration**: Mandatory for complex feature flows and form submissions.
- **E2E**: Critical paths (Auth, Financials, User Management) covered by Playwright/Cypress.

## Governance
This Constitution is the supreme authority for engineering decisions. Amendments require a formal proposal and version bump. Compliance is verified during code reviews.

**Version**: 2.0.0 | **Ratified**: 2026-05-30 | **Last Amended**: 2026-05-30
