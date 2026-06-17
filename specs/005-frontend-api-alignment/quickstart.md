# Quickstart: Frontend API Alignment & Backend Synchronization

This document describes how to execute the API alignment process for the Herfa frontend.

## Prerequisites

- Node.js 18+ and npm installed
- Git repository with `005-frontend-api-alignment` branch checked out
- Backend not required — the alignment operates against planned API contracts

## Files to Scan

| Location | What to Scan |
|---|---|
| `src/services/api.ts` | All 43+ exported functions |
| `src/lib/axios.ts` | Axios client configuration |
| `src/features/*/services/api.ts` | All 10 feature service files |
| `src/features/*/hooks/` | All React Query hooks |
| `src/app/[locale]/**/page.tsx` | Pages consuming API endpoints |
| `docs/frontend-business-gap-analysis.md` | Gap analysis reference |

## Steps

### Step 1: Generate the Alignment Report

Run the alignment audit to produce `docs/frontend-api-alignment-report.md`:

```powershell
# Run the alignment audit script (to be created in tasks)
npm run align:audit
```

This will:
1. Scan all API service files and hooks
2. Compare against planned backend contracts
3. Generate the full alignment report

### Step 2: Review Findings

Open `docs/frontend-api-alignment-report.md` and review:

- **Correct Integrations** — no action needed
- **Broken Integrations** — review each issue
- **Endpoint Mismatches** — check path/method discrepancies
- **DTO Mismatches** — check payload/response shape differences
- **Missing API Integrations** — endpoints that use mocks or localStorage
- **Mock Implementations** — all detected mock data
- **Required Fixes** — auto-applied and manual fixes

### Step 3: Apply Safe Fixes

Apply all automatically fixable mismatches:

```powershell
npm run align:fix-safe
```

The fix script will:
- Update incorrect URL paths
- Correct HTTP methods
- Rename mismatched DTO fields (simple 1:1 renames)
- Standardize auth token sources where safe

### Step 4: Verify No Regressions

After applying fixes, verify that all existing functionality is preserved:

```powershell
npm run build
npm run lint
npm run typecheck
npm run test
```

Check that:
- Pages still render correctly
- No UI changes occurred
- API calls use correct paths and methods

### Step 5: Document Remaining Issues

For any issues classified as "requires manual intervention", create follow-up tickets or tasks.

## Key Reference Files

| File | Purpose |
|---|---|
| `specs/005-frontend-api-alignment/spec.md` | Feature specification |
| `specs/005-frontend-api-alignment/plan.md` | Implementation plan |
| `specs/005-frontend-api-alignment/research.md` | Phase 0 research findings |
| `specs/005-frontend-api-alignment/data-model.md` | Data model for the alignment process |
| `specs/005-frontend-api-alignment/contracts/report-schema.md` | Report structure contract |
| `docs/frontend-business-gap-analysis.md` | Gap analysis reference |
| `docs/frontend-api-alignment-report.md` | Generated alignment report |

## Rollback

If a fix causes issues, revert individual file changes from git:

```powershell
git checkout -- src/services/api.ts
git checkout -- src/features/*/services/api.ts
```
