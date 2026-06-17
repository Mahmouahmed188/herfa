# Report Schema: Frontend API Alignment Report

This document defines the required structure and content rules for the
`docs/frontend-api-alignment-report.md` output file.

## Required Sections

### 1. Correct Integrations

Endpoints that match the planned backend contracts exactly (method, path, payload, response, auth).

```markdown
### [Endpoint Name]

| Field | Value |
|---|---|
| Source | core / feature |
| File | path relative to `src/` |
| Method | HTTP method |
| Path | API path |
| Auth | Yes / No |
| Hook | Function name / None |
```

### 2. Broken Integrations

Endpoints with one or more detected issues. Each entry lists the specific issues.

```markdown
### [Endpoint Name]

- **Issue**: [description]
- **Source**: [file path]
- **Severity**: critical / high / medium / low
- **Fix Classification**: safe / requires_manual_intervention
```

### 3. Endpoint Mismatches

Discrepancies in URL path or HTTP method between frontend and backend contracts.

```markdown
| Frontend Path | Frontend Method | Expected Path | Expected Method | Source File | Severity |
|---|---|---|---|---|---|
| /path | GET | /expected-path | POST | src/... | medium |
```

### 4. DTO Mismatches

Discrepancies in request payload or response structure.

```markdown
| Endpoint | Field | Frontend Type | Expected Type | Source File | Severity |
|---|---|---|---|---|---|
| /path | fieldName | string | number | src/... | high |
```

### 5. Missing API Integrations

Frontend pages or features that use mock data or localStorage instead of real API calls.

```markdown
| Page / Feature | Current Implementation | Required Endpoint | Priority |
|---|---|---|---|
| /page | Mock / localStorage | /api/v1/... | P1 |
```

### 6. Mock Implementations

All detected mock data implementations, including component-level mocks.

```markdown
| Location | Type | Description | Has Real Backend? |
|---|---|---|---|
| src/... | mock / localStorage | What it replaces | Yes / No / Planned |
```

### 7. Required Fixes

All corrective actions, grouped by auto-applied vs manual.

```markdown
### Auto-Applied Fixes

| # | Endpoint | Fix | File | Status |
|---|---|---|---|---|
| 1 | /path | Changed method GET → POST | src/... | Applied / Pending / Skipped |

### Manual Fixes Required

| # | Endpoint | Issue | Recommended Action | Effort |
|---|---|---|---|---|
| 1 | /path | Payload mismatch | Update DTO fields to match backend | Small |
```

## Validation Rules

- Every endpoint from `src/services/api.ts` MUST appear in exactly one section (Correct or Broken)
- Every endpoint from `src/features/*/services/api.ts` MUST appear in exactly one section (Correct or Broken)
- Every detected mock MUST be listed in section 6
- Every detected issue MUST have a corresponding entry in section 7 (Required Fixes)
- Section 7 MUST distinguish between auto-applied and manual fixes
- Each auto-applied fix MUST include its current status (Applied / Pending / Skipped)
