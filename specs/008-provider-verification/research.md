# Research: Provider Verification System

## Consolidated Findings

### 1. Backend Verification API Surface

**Decision**: Use existing API contracts as defined by frontend service definitions. No backend code exists in `apps/api/` — the entire verification API surface is currently defined only in frontend service files.

**Rationale**: The feature specification explicitly states "Do not modify backend code." The frontend must work against the API contracts as defined, regardless of backend implementation status.

**Alternatives considered**: N/A — backend modification is out of scope.

**Endpoints discovered (9 total)**:

| # | Method | Path | Auth | Source |
|---|--------|------|------|--------|
| 1 | POST | `/verification/submit` | Bearer | `src/services/api.ts:358` |
| 2 | GET | `/verification/status` | Bearer | `src/services/api.ts:365` |
| 3 | POST | `/uploads` | Bearer | `src/services/api.ts:369` |
| 4 | GET | `/admin/provider-verifications` | Bearer | `src/features/providers/services/api.ts:19` |
| 5 | GET | `/admin/provider-verifications/:id` | Bearer | `src/features/providers/services/api.ts:27` |
| 6 | PATCH | `/admin/provider-verifications/:providerId/approve` | Bearer | `src/features/providers/services/api.ts:34` |
| 7 | PATCH | `/admin/provider-verifications/:providerId/reject` | Bearer | `src/features/providers/services/api.ts:42` |
| 8 | GET | `/providers` | Bearer | `src/features/providers/services/api.ts:55` |
| 9 | POST | `/providers/:id/status` | Bearer | `src/features/providers/services/api.ts:62` |

### 2. Two Separate Verification Systems Exist

**Decision**: Consolidate into a single verification module under `src/features/providers/`. Migrate technician verification logic from `src/services/api.ts` to the provider feature module.

**Rationale**: Both technician (provider) verification and admin provider verification serve the same business domain. Having two separate API patterns (`fetchWithAuth` in core api.ts vs axios-based in feature module) is inconsistent with the Architecture principle.

**Alternatives considered**: Leave both as-is — rejected because it violates the API-First Architecture and Feature-Based Modularity principles.

**Current split**:
- **Provider/Admin verification**: `src/features/providers/` — full CRUD with Zod schemas, axios API service, TanStack Query hooks, admin queue/detail pages
- **Technician verification**: `src/services/api.ts` + `technician/onboarding-home/page.tsx` — simpler submit/status flow uses direct `fetchWithAuth` calls without TanStack Query

### 3. Verification Status Gap

**Decision**: Extend `verificationStatusSchema` from `['PENDING', 'APPROVED', 'REJECTED']` to include `'UNDER_REVIEW'` and `'SUSPENDED'` states, matching the feature specification.

**Rationale**: The spec requires five states (Pending, Under Review, Approved, Rejected, Suspended) but the current schema only defines three. The `SUSPENDED` state is already used in the admin `ProviderList` component's Badge logic.

**Alternatives considered**:
- A: Extend enum to 5 states — chosen (best alignment with spec and existing usage)
- B: Keep 3 states and map UI display — rejected (would lose data fidelity)
- C: Use string union instead of enum — rejected (Zod enum provides better validation)

**Current schema**: `z.enum(['PENDING', 'APPROVED', 'REJECTED'])`
**Target schema**: `z.enum(['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED'])`

### 4. Document Upload Gaps

**Decision**: Add client-side validation for file format and size, and implement document replacement support.

**Rationale**: The spec requires format validation (FR-006), size validation (FR-007), upload progress (FR-008), and document replacement (FR-010). Current implementation has none of these — it only uses HTML `accept="image/*"` attribute.

**Alternatives considered**: Rely solely on backend validation — rejected because user experience requires immediate frontend feedback.

**Current gaps**:
- No file format validation (only HTML-level `accept="image/*"`)
- No file size validation
- No upload progress indicator (only spinner after upload starts)
- No document replacement logic
- No document type enum (uses free-form `z.string()`)

**Target validation rules** (from backend DTO expectations):
- Supported formats: JPEG, PNG, PDF
- Max file size: 5MB per document (standard for identity documents)
- Document types: `NATIONAL_ID`, `PASSPORT`, `DRIVER_LICENSE`, `PROFESSIONAL_CERTIFICATE`, `TRADE_LICENSE`, `BUSINESS_REGISTRATION`

### 5. No Verification History Endpoint

**Decision**: Create a verification history contract expecting a timeline endpoint. Note that this endpoint may not exist in the backend yet.

**Rationale**: The spec requires verification history (FR-016, FR-017) but no such endpoint exists in any service definition. The frontend should define the contract and handle gracefully when the endpoint is unavailable.

**Alternatives considered**:
- A: Define contract for `GET /verification/history` — chosen (consistent with existing patterns)
- B: Infer history from status check responses — rejected (status endpoint doesn't return timeline data)
- C: Skip history feature — rejected (spec requires it)

### 6. No Notification-Verification Integration

**Decision**: Add verification notification types and hooks to `src/features/notifications/`. Verification events should trigger notifications that link to verification pages.

**Rationale**: The spec requires verification notifications (FR-019 to FR-021) but the notifications module has no awareness of verification events. Current notification types are `BOOKING_UPDATE`, `ANNOUNCEMENT`, `PROMO`, `SYSTEM`.

**Alternatives considered**: Add verification hooks to provider module instead of notifications module — rejected because the notifications module owns all notification logic per Feature-Based Modularity.

### 7. Mock Data in Pages

**Decision**: Remove all mock verification data from `technicians/page.tsx` and `technicians/[id]/page.tsx`.

**Rationale**: The spec requires "No mock verification data remains" (FR-023). Both pages currently contain hardcoded mock data that appears when backend APIs are unavailable.

**Alternatives considered**: Keep mock data as fallback — rejected because it violates the API-First Architecture principle.

**Affected files**:
- `src/app/[locale]/technicians/page.tsx` — `MOCK_TECHNICIANS` array with `verified: true/false`
- `src/app/[locale]/technicians/[id]/page.tsx` — entire hardcoded technician profile with verification status objects
