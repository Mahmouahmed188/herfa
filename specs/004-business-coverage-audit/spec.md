# Feature Specification: Frontend Business Coverage Audit

**Feature Branch**: `004-business-coverage-audit`

**Created**: 2026-06-18

**Status**: Draft

**Input**: User description: "Create a Frontend Business Coverage Audit feature for the Herfa frontend project..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate Gap Analysis Report (Priority: P1)

As a project manager or tech lead, I want a complete gap analysis comparing the
current frontend implementation against all backend business capabilities, so that
I can prioritize the next development sprint with accurate data.

**Why this priority**: Without this audit, development decisions are based on
incomplete information, leading to missed requirements and rework.

**Independent Test**: The generated `docs/frontend-business-gap-analysis.md` can be
reviewed independently. Every backend endpoint/entity should be findable in either
the "Covered" or "Missing" section of the report.

**Acceptance Scenarios**:

1. **Given** the Herfa frontend codebase and backend API contracts,
   **When** the audit scan runs,
   **Then** it produces a markdown document covering all pages, routes, components,
   API integrations, React Query hooks, forms, dashboards, and role-based screens.

2. **Given** the generated audit report,
   **When** a developer reviews any backend module section,
   **Then** it clearly states whether the module is fully, partially, or not
   implemented in the frontend, with specific missing items listed.

---

### User Story 2 - API Coverage Matrix (Priority: P2)

As a developer, I want a frontend API coverage matrix that maps every backend
endpoint to its frontend integration status, so that I know exactly which API
calls are already connected and which still need implementation.

**Why this priority**: The API matrix is the most actionable deliverable for
frontend developers planning their next tasks.

**Independent Test**: Every endpoint from the backend API contracts is listed in
the matrix with a status of `Connected`, `Partial`, or `Not Connected`. A developer
can cross-check any endpoint against the actual frontend code.

**Acceptance Scenarios**:

1. **Given** the list of all backend endpoints,
   **When** the matrix is generated,
   **Then** each endpoint appears with its method, route, and connection status.
2. **Given** an endpoint marked `Not Connected`,
   **When** referenced in the report,
   **Then** the report includes the specific missing service/hook/page details.

---

### User Story 3 - Prioritized Frontend Roadmap (Priority: P3)

As a product owner, I want the gap analysis to produce a categorized, prioritized
feature roadmap, so that I can align the team on what to build next.

**Why this priority**: The roadmap translates raw gap data into an actionable plan
with Critical, High, Medium, and Low priority buckets.

**Independent Test**: The roadmap section lists items in priority order with clear
rationale for each priority assignment.

**Acceptance Scenarios**:

1. **Given** all identified gaps,
   **When** the roadmap is generated,
   **Then** items are grouped into Priority 1, 2, and 3 tiers.
2. **Given** the roadmap,
   **When** reviewed,
   **Then** each item references the specific backend module and frontend gap it
   addresses.

---

### User Story 4 - Missing Screens, Components, and Flows (Priority: P3)

As a frontend developer, I want the audit to identify specific missing screens,
components, and business flows, so that I can create accurate task estimates.

**Why this priority**: Detailed implementation gaps help avoid overlooked work
during sprint planning.

**Independent Test**: Each missing screen/component/flow is listed with its
associated backend module. A developer can verify against the backend contracts.

**Acceptance Scenarios**:

1. **Given** the audit is complete,
   **When** I read the Missing Screens section,
   **Then** it lists every screen that the backend supports but the frontend
   does not yet have.
2. **Given** the Missing Components section,
   **When** I read it,
   **Then** it lists every reusable component that needs to be built.
3. **Given** the Missing Business Flows section,
   **When** I read it,
   **Then** it describes end-to-end flows that are incomplete or absent.

### Edge Cases

- What happens when a frontend page partially implements a backend module
  (e.g., lists bookings but cannot create them)? The audit should flag it as
  `Partial` with specific missing sub-features.
- How does the audit handle backend endpoints that exist but have no frontend
  service layer at all? They must appear as `Not Connected` in the API matrix.
- How does the report handle deprecated backend endpoints? They should be noted
  but excluded from the priority roadmap.
- What if the same frontend component serves multiple backend workflows? The
  audit should list all mappings.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-REPORT**: The system MUST generate a single markdown file at
  `docs/frontend-business-gap-analysis.md` containing all audit results.
- **FR-SCAN**: The audit MUST scan all frontend pages, routes, components,
  API integrations, TanStack Query hooks/services, forms, dashboards, and
  role-based screens in the `src/` directory.
- **FR-COMPARE**: The audit MUST compare frontend findings against all backend
  entities, modules, controllers, DTOs, endpoints, and business workflows
  defined in the frontend API service contracts.
- **FR-COVERAGE**: The report MUST include an "Existing Frontend Coverage"
  section listing every implemented page with its backend integration status
  (Connected / Partial / Not Connected).
- **FR-MISSING-MODULES**: The report MUST include a "Missing Business Areas"
  section listing every backend module with its frontend implementation status
  and specific gaps.
- **FR-PRIORITIES**: The report MUST categorize all gaps into:
  Critical, High, Medium, and Low priority.
- **FR-ROADMAP**: The report MUST produce a "Frontend Roadmap" section with
  three priority tiers (P1, P2, P3).
- **FR-API-MATRIX**: The report MUST include an "API Coverage Matrix" listing
  every backend endpoint with method, route, and frontend connection status.
- **FR-MISSING-SCREENS**: The report MUST include a "Missing Screens" section
  listing screens the backend supports but the frontend does not have.
- **FR-MISSING-COMPONENTS**: The report MUST include a "Missing Components"
  section listing reusable components that need to be built.
- **FR-MISSING-FLOWS**: The report MUST include a "Missing Business Flows"
  section describing incomplete or absent end-to-end workflows.
- **FR-NO-BACKEND-MODS**: The audit MUST NOT modify any backend files,
  regardless of findings.
- **FR-NO-DESIGN-CHANGES**: The audit MUST NOT change the existing frontend
  theme, branding, colors, or UI design.
- **FR-REUSABLE**: The audit SHOULD be designed so it can be re-run after
  future feature implementations to track progress.

### Key Entities

- **Frontend Feature**: A page, route, component, API service, hook, form,
  dashboard, or role-gated screen found in `src/`.
- **Backend Module**: A business domain module (Auth, Bookings, Providers,
  Payments, Support, Notifications, CMS, Analytics, Audit, Settings, etc.)
  with its associated entities, endpoints, DTOs, and workflows.
- **Coverage Gap**: A discrepancy where a backend capability has no frontend
  implementation, partial implementation, or misaligned implementation.
- **Priority Bucket**: A categorization (Critical / High / Medium / Low) based
  on business impact and dependency chain.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The report covers 100% of backend modules found in the frontend
  API service contracts. Every backend endpoint appears in the API Coverage Matrix.
- **SC-002**: Every frontend page and route in `src/app/[locale]/` is listed in
  the Existing Frontend Coverage section with an accurate backend integration status.
- **SC-003**: Missing screens, components, and business flows are identified with
  enough specificity that a developer can create implementation tasks without
  additional discovery.
- **SC-004**: The roadmap section contains no items that are already fully
  implemented (no false positives for gaps).
- **SC-005**: The report is readable by both technical (developers) and
  non-technical (product managers) stakeholders.

## Assumptions

- The backend API contracts are defined by the frontend service layer files in
  `src/features/*/services/api.ts` and `src/services/api.ts`, as the NestJS
  backend implementation is still scaffold-only.
- The frontend's existing theme, colors, branding, and design language are
  correct and should not be changed by this audit.
- The audit will be run as a one-time analysis to establish a baseline, with
  the document serving as a living reference updated as features are implemented.
- All existing frontend routes, components, and services in `src/` are
  discoverable by file system scanning and code analysis.
