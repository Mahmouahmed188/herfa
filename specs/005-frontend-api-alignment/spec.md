# Feature Specification: Frontend API Alignment & Backend Synchronization

**Feature Branch**: `005-frontend-api-alignment`

**Created**: 2026-06-18

**Status**: Draft

**Input**: User description: "Create Feature 2: Frontend API Alignment & Backend Synchronization. Objective: Using the generated frontend-business-gap-analysis.md document and the backend source code as the source of truth, audit and fix all frontend API integrations."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Runs Automated API Audit (Priority: P1)

A developer triggers an automated audit that scans all frontend API integrations and compares them against backend controllers. The system produces a comprehensive report documenting every mismatch, broken integration, and required fix.

**Why this priority**: Without an audit, there is no baseline understanding of what is broken. This is the discovery phase that enables all subsequent fixes.

**Independent Test**: Can be fully tested by running the audit process on a branch with known mismatches and verifying the report identifies each one correctly.

**Acceptance Scenarios**:

1. **Given** the frontend codebase with API service files, React Query hooks, and Axios clients, **When** the developer runs the audit, **Then** every frontend API call is catalogued with its URL path, HTTP method, request payload, and response mapping.
2. **Given** backend controller source files, **When** the audit runs, **Then** every backend endpoint is catalogued with its path, method, expected inputs, and outputs.
3. **Given** both frontend and backend catalogues, **When** the comparison completes, **Then** a report is generated with sections for correct integrations, broken integrations, endpoint mismatches, DTO mismatches, missing integrations, mock implementations, and required fixes.
4. **Given** an integration that is correct in every respect, **When** the audit runs, **Then** it appears in the "Correct Integrations" section of the report.

---

### User Story 2 - Developer Applies Automated Safe Fixes (Priority: P1)

Based on the audit findings, the system automatically applies all fixes that are classified as safe — where the correct mapping is unambiguous and no structural changes are needed. The developer can then verify that affected pages function correctly.

**Why this priority**: Automated fixes reduce manual effort and eliminate human error for straightforward mismatches, delivering immediate value.

**Independent Test**: Can be tested by introducing a known wrong URL path, running the fix process, and verifying the path is corrected without breaking the page.

**Acceptance Scenarios**:

1. **Given** a frontend API call with an incorrect URL path but correct parameters and expected response, **When** safe fixes are applied, **Then** the URL path is updated to match the backend controller without changing any other code.
2. **Given** a frontend API call using the wrong HTTP method (e.g., GET instead of POST), **When** safe fixes are applied, **Then** the method is corrected.
3. **Given** a frontend API call with a DTO field name that differs from the backend schema, **When** the difference is a simple rename, **Then** the field name is updated to match the backend.
4. **Given** a frontend page that previously worked with a mocked or incorrect endpoint, **When** safe fixes are applied, **Then** the page continues to function using the corrected backend connection, and no UI changes occur.

---

### User Story 3 - Developer Reviews Remaining Issues (Priority: P2)

After safe fixes are applied, the developer reviews the remaining issues in the report that could not be automatically resolved. Each issue includes enough context to manually implement the fix.

**Why this priority**: Not all mismatches can be safely automated. Clear documentation of remaining issues ensures nothing is forgotten and reduces debugging time.

**Independent Test**: Can be tested by verifying the report contains actionable descriptions for every issue that was not automatically fixable.

**Acceptance Scenarios**:

1. **Given** a mismatch that requires structural changes (e.g., the frontend sends data the backend doesn't expect), **When** the report is generated, **Then** the issue is listed in "Required Fixes" with the specific discrepancy described.
2. **Given** a mock implementation that has no corresponding backend endpoint, **When** the report is generated, **Then** it is listed in "Mock Implementations" with details about what the mock returns and what the real endpoint should provide.

---

### User Story 4 - System Validates No Regressions (Priority: P3)

After all fixes are applied, the system verifies that existing frontend pages still load and interact correctly without UI regressions, color changes, or redesigns.

**Why this priority**: Regressions erode user trust and increase support burden. Automated checks ensure the scope of changes is limited to the integration layer.

**Independent Test**: Can be tested by running existing frontend tests or manual smoke tests on pages that had API fixes applied, confirming they behave identically apart from connecting to the correct backend.

**Acceptance Scenarios**:

1. **Given** a page that had one or more API integration fixes applied, **When** the page is loaded, **Then** it displays the same UI as before the fixes.
2. **Given** a corrected API call, **When** the data flows from backend to frontend, **Then** the response is correctly mapped to the existing UI components.

### Edge Cases

- What happens when a frontend API endpoint has no corresponding backend controller at all?
- What happens when the same frontend DTO is used by multiple endpoints with different backend schemas?
- What happens when the backend returns a 401/403 for an endpoint that previously had no authentication?
- How does the system handle endpoints that return different response shapes based on user role?
- What happens when a frontend page depends entirely on a mock implementation with no real backend counterpart?
- How are deprecated API endpoints (still present but marked for removal) handled?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST scan all frontend API service files and extract every endpoint call with its URL, HTTP method, request payload structure, and response mapping.
- **FR-002**: System MUST scan all React Query hooks and identify usages of useQuery, useMutation, and related calls including their endpoint references.
- **FR-003**: System MUST scan all Axios client instances and log every interceptor, base URL configuration, and request/response transformation.
- **FR-004**: System MUST scan all native fetch() calls and catalog their endpoint URLs and configurations.
- **FR-005**: System MUST parse backend controller source files and extract every route path, HTTP method annotation, request DTO, response DTO, authentication requirement, and role restriction.
- **FR-006**: System MUST compare each frontend endpoint against the corresponding backend controller and detect: wrong URL paths, wrong HTTP methods, wrong payloads, and wrong response mappings.
- **FR-007**: System MUST detect any remaining mock data or mock API handlers in the frontend codebase.
- **FR-008**: System MUST detect any frontend API calls that reference deprecated backend endpoints.
- **FR-009**: System MUST generate a structured report at `docs/frontend-api-alignment-report.md` with all findings organized into sections: Correct Integrations, Broken Integrations, Endpoint Mismatches, DTO Mismatches, Missing API Integrations, Mock Implementations, Required Fixes.
- **FR-010**: System MUST automatically apply safe fixes where the mapping from wrong to correct is unambiguous — specifically: incorrect URL paths, incorrect HTTP methods, missing auth headers, and simple DTO field renames.
- **FR-011**: System MUST classify an automatic fix as "safe" only when: (a) the correction is a direct 1:1 replacement, (b) no structural changes to components are required, and (c) no UI behavior or appearance is altered.
- **FR-012**: System MUST NOT modify any backend source code.
- **FR-013**: System MUST NOT change frontend UI design, colors, layout, or component structure — only the API integration layer.
- **FR-014**: System MUST preserve all existing frontend functionality after fixes are applied.

### Key Entities *(include if feature involves data)*

- **Frontend API Integration**: A record of one frontend-to-backend call containing: source file location, URL path, HTTP method, request DTO structure, response DTO structure, auth requirements, and role requirements. Mapped to source lines (service, query hook, mutation, Axios call, or fetch call).
- **Backend Controller Endpoint**: A record of one backend route containing: controller file location, route path, HTTP method, request DTO structure, response DTO structure, auth requirement, and role requirement. Mapped to source lines.
- **Alignment Report**: The structured output document at `docs/frontend-api-alignment-report.md` containing the full comparison results, categorized findings, and actionable fix descriptions.
- **Fix Classification**: Each detected mismatch is classified as either "safe" (can be auto-fixed) or "requires manual intervention" based on predefined criteria.
- **Integration Gap**: A frontend call that has no corresponding backend endpoint, or a backend endpoint that has no corresponding frontend consumer.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After the audit, every frontend API endpoint is documented alongside its matching backend endpoint, with 100% coverage of all API service files, React Query hooks, Axios clients, and fetch calls.
- **SC-002**: All safe mismatches are automatically fixed without any manual intervention, and every fixed integration continues to serve its page correctly.
- **SC-003**: The alignment report is generated with all seven required sections populated, with zero empty or "N/A" sections.
- **SC-004**: No frontend UI, colors, layout, or component structure changes occur as a result of the fixes — only API integration layer code is modified.
- **SC-005**: The number of broken frontend-backend integrations after the fix cycle is zero, with all remaining issues documented in the "Required Fixes" section.
- **SC-006**: Existing frontend functionality is fully preserved — all pages that worked before the alignment still work, and no new errors are introduced.

## Assumptions

- The frontend project uses React Query (TanStack Query) for server state management and Axios as the primary HTTP client.
- The backend source code uses a standard controller/route annotation structure (e.g., decorators, attributes, or similar) that can be parsed to extract endpoints, methods, DTOs, and auth requirements.
- The `frontend-business-gap-analysis.md` document already exists and provides a preliminary analysis that the audit can use as a reference.
- Backend source code is accessible within the same repository or a referenced path.
- "Safe" fixes are those with a direct 1:1 mapping from incorrect to correct — URL path changes, HTTP method changes, simple DTO field renames, and missing auth headers — that do not require structural component changes.
- Missing API integrations (frontend calls with no backend counterpart) and fully mock-dependent pages are flagged and documented but not automatically resolved, since backend code cannot be modified.
- Mock implementations that have an existing backend counterpart are replaced with real calls where safe to do so; otherwise they are flagged.
- The alignment process does not introduce new functionality — it only corrects existing integrations.
- All existing automated tests should pass after fixes are applied.
