# Quickstart: Provider Verification System

## Prerequisites

- Node.js 18+ installed
- `npm install` completed
- Backend API running at `http://localhost:3001/api/v1` (or configured `NEXT_PUBLIC_API_URL`)

## Key Files

| Purpose | File Path |
|---------|-----------|
| Status Schema | `src/features/providers/schemas/verification.ts` |
| Provider API Service | `src/features/providers/services/api.ts` |
| Core API Service | `src/services/api.ts` (technician endpoints) |
| TanStack Query Hooks | `src/features/providers/hooks/useVerification.ts` |
| Admin Verification Queue | `src/features/providers/components/VerificationQueue.tsx` |
| Admin Verification Detail | `src/app/[locale]/(dashboard)/providers/verification/[id]/page.tsx` |
| Technician Onboarding | `src/app/[locale]/technician/onboarding-home/page.tsx` |

## Implementation Order

### Step 1: Extend Status Schema (`src/features/providers/schemas/verification.ts`)

Add `UNDER_REVIEW` and `SUSPENDED` to the verification status enum. Add `DocumentType` enum with standardized document types.

### Step 2: Migrate Technician API to Feature Module

Move `submitVerification()`, `getVerificationStatus()`, and `uploadFile()` from `src/services/api.ts` to `src/features/providers/services/api.ts` using the axios client. Create TanStack Query hooks for these endpoints.

### Step 3: Add Verification History Endpoint

Add `getVerificationHistory()` to the provider API service. Create a `useVerificationHistory()` TanStack Query hook.

### Step 4: Enhance Document Upload

Add client-side validation (format: JPEG/PNG/PDF, size: max 5MB), upload progress indicator, document type selection with the standardized `DocumentType` enum, and replacement support for existing documents.

### Step 5: Create Provider Verification Pages

Create pages under `src/app/[locale]/(provider)/verification/`:
- `page.tsx` — Status dashboard with badge, progress, requirements
- `submit/page.tsx` — Complete submission form with validation
- `history/page.tsx` — Timeline component

### Step 6: Add Verification Notifications

Add `VERIFICATION_SUBMITTED`, `VERIFICATION_APPROVED`, `VERIFICATION_REJECTED`, `VERIFICATION_SUSPENDED`, `DOCUMENTS_REQUESTED` notification types. Create notification hooks that link to verification pages.

### Step 7: Remove Mock Data

Remove `MOCK_TECHNICIANS` from `technicians/page.tsx` and hardcoded verification data from `technicians/[id]/page.tsx`.

### Step 8: Generate API Audit

Generate `docs/provider-verification-audit.md` documenting all verification endpoints, their alignment status, and remaining gaps.

## Verification Commands

```bash
npm run lint        # Check for lint errors
npm run type-check  # Verify TypeScript types
npm test            # Run unit tests
```

## Key Architecture Decisions

1. **Single verification module**: All verification logic lives in `src/features/providers/` — no split between technician and admin verification.
2. **Axios-based API**: Use the configured axios instance from `@/lib/axios` for all verification API calls (replace `fetchWithAuth` usage).
3. **TanStack Query**: All server data uses TanStack Query hooks with proper cache invalidation on mutations.
4. **Zod validation**: Client-side validation uses Zod schemas matching backend DTO definitions.
5. **Design preservation**: Use existing UI components and styling — no new design system elements.
