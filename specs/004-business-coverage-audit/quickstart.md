# Quickstart: Frontend Business Coverage Audit

## Purpose

Generate a gap analysis document that maps every frontend feature to its
corresponding backend capability, identifies missing implementations, and
produces a prioritized roadmap.

## Prerequisites

- Node.js 18+ (for running any auxiliary scripts if desired)
- Access to the full `src/` directory tree
- No external dependencies required

## Running the Audit

### Option 1: Manual Inspection (Recommended)

Use the structured findings in `research.md` and the entity definitions in
`data-model.md` as guides. Follow the report schema in `contracts/report-schema.md`
to populate `docs/frontend-business-gap-analysis.md`.

Key commands for data gathering:

```powershell
# List all page files
Get-ChildItem -Path "src/app/[locale]" -Recurse -Filter "page.tsx"

# List all API service files
Get-ChildItem -Path "src" -Recurse -Filter "services/api.ts"

# List all TanStack Query hooks
Select-String -Path "src/**/hooks/*.ts" -Pattern "useQuery|useMutation"

# List all Zod schemas
Get-ChildItem -Path "src" -Recurse -Filter "schemas/*.ts"

# Count feature modules
Get-ChildItem -Path "src/features" -Directory
```

### Option 2: Script-Assisted (for re-runs)

Write findings into the template at `docs/frontend-business-gap-analysis.md`.

## Audit Coverage Checklist

- [ ] All 43 page.tsx files cataloged
- [ ] All 15 feature modules assessed
- [ ] All 75+ service functions mapped
- [ ] All 12 TanStack Query hook files reviewed
- [ ] All 7 forms analyzed
- [ ] All 4 Zod schema files reviewed
- [ ] API coverage matrix built
- [ ] Priority roadmap generated
- [ ] Missing screens identified
- [ ] Missing components listed
- [ ] Missing business flows documented

## Re-running After Changes

1. Re-scan `src/app/[locale]/` for new/modified page files
2. Re-scan `src/features/` for new/modified service/hook files
3. Update the API matrix with any new endpoints
4. Promote previously "missing" items to "covered" as features are implemented
5. Regenerate the roadmap with updated priorities
