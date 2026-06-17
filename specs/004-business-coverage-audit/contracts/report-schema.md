# Report Schema: Frontend Business Gap Analysis

This document defines the required structure and content rules for the
`docs/frontend-business-gap-analysis.md` output file.

## Required Sections

### 1. Existing Frontend Coverage

For every frontend page, list:

```markdown
- [Page Name] (`[route]`)
  - Exists: Yes / No
  - Backend Connected: Yes / Partial / No
  - Missing Features:
    - [item]
```

### 2. Missing Business Areas

For every backend module, assess:

```markdown
### [Module Name]

| Criterion | Status |
|---|---|
| Exists in Frontend | Yes / Partial / No |
| APIs Connected | count / total |
| Pages Implemented | count / total |
| Components Built | count / total |
| Missing APIs | [list] |
| Missing Pages | [list] |
| Missing Components | [list] |
```

### 3. Categorized Findings

Classify every gap into:

| Priority | Criteria |
|---|---|
| Critical | Blocks core business flow; no workaround |
| High | Significant feature gap; partial workaround exists |
| Medium | Important but non-blocking improvement |
| Low | Polish / nice-to-have enhancement |

### 4. Frontend Roadmap

| Priority | Item | Backend Module | Effort Estimate |
|---|---|---|---|
| P1 | [feature] | [module] | [small/medium/large] |

### 5. API Coverage Matrix

For every backend endpoint:

```markdown
| Method | Route | Connected | Has Hook | Used In UI | Source |
|---|---|---|---|---|---|
| GET | /api/v1/... | Yes/No/Partial | Yes/No | Yes/No | core/feature |
```

### 6. Missing Screens

List every screen that the backend supports but the frontend does not implement.
Group by portal (Customer / Provider / Admin).

### 7. Missing Components

List reusable components that need to be built, organized by domain.

### 8. Missing Business Flows

Describe end-to-end workflows that are incomplete or absent, with:

- Flow name
- Backend module
- Current state
- Gap description
- Priority

## Validation Rules

- Every backend module discovered in `src/features/*/services/api.ts` and
  `src/services/api.ts` MUST appear in section 2
- Every frontend page in `src/app/[locale]/` MUST appear in section 1
- The API matrix MUST include method and full route path for every entry
- Priority categorization MUST include rationale for Critical and High items
