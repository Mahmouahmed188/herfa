# Research: Frontend API Alignment & Backend Synchronization

## Methodology

Audited all frontend API integration points across:
- Core API service (`src/services/api.ts`) — 43 endpoints via native fetch
- Feature service files (10 files) — via Axios client
- React Query hooks (10 hook files)
- Axios client configuration (`src/lib/axios.ts`)
- Auth token management (`src/features/auth/stores/useAuthStore.ts`)

Comparison source: planned backend contracts documented in `docs/frontend-business-gap-analysis.md` and monorepo specification (`specs/001-herfa-platform/spec.md`).

## Decision 1: Frontend Endpoint Catalog

### Core API (`src/services/api.ts`)

| # | Function | Method | Path | Used In | Auth |
|---|---|---|---|---|---|
| 1 | register | POST | /auth/register | Auth pages | No |
| 2 | login | POST | /auth/login | Auth pages | No |
| 3 | getCurrentUser | GET | /users/me | Auth/App | Bearer token |
| 4 | getCategories | GET | /services/categories | Public pages | No |
| 5 | getServices | GET | /services | Public pages | No |
| 6 | getServiceById | GET | /services/:id | Public pages | No |
| 7 | searchProviders | GET | /providers/search | Public pages | Bearer token |
| 8 | getProviderById | GET | /providers/:id | Public pages | Bearer token |
| 9 | getProviders | GET | /providers/search | Public pages | Bearer token |
| 10 | getProviderReviews | GET | /providers/:id/reviews | Public pages | Bearer token |
| 11 | getMyJobs | GET | /jobs/my-jobs | Customer pages | Bearer token |
| 12 | createJob | POST | /jobs | Customer pages | Bearer token |
| 13 | getJobById | GET | /jobs/:id | Shared | Bearer token |
| 14 | cancelJob | POST | /jobs/:id/cancel | Customer pages | Bearer token |
| 15 | createBooking | POST | /bookings | Customer pages | Bearer token |
| 16 | getAssignedJobs | GET | /jobs/assigned | Technician pages | Bearer token |
| 17 | getAvailableJobs | GET | /jobs/available | Technician pages | Bearer token |
| 18 | acceptJob | POST | /jobs/assignments/accept | Technician pages | Bearer token |
| 19 | rejectJob | POST | /jobs/assignments/:id/reject | Technician pages | Bearer token |
| 20 | updateJobStatus | POST | /jobs/:id/status | Shared | Bearer token |
| 21 | getFavoriteIds | - | localStorage only | Client saved | None |
| 22 | toggleFavoriteLocal | - | localStorage only | Client saved | None |
| 23 | createTender | POST | /tenders | Customer pages | Bearer token |
| 24 | getMyTenders | GET | /tenders | Customer pages | Bearer token |
| 25 | getOpenTenders | GET | /tenders/open | Public pages | Bearer token |
| 26 | getTenderById | GET | /tenders/:id | Shared | Bearer token |
| 27 | updateTender | PATCH | /tenders/:id | Customer pages | Bearer token |
| 28 | cancelTender | POST | /tenders/:id/cancel | Customer pages | Bearer token |
| 29 | submitOffer | POST | /tenders/:id/offers | Technician pages | Bearer token |
| 30 | getTenderOffers | GET | /tenders/:id/offers | Technician pages | Bearer token |
| 31 | acceptOffer | PATCH | /tenders/offers/:id/accept | Technician pages | Bearer token |
| 32 | rejectOffer | PATCH | /tenders/offers/:id/reject | Technician pages | Bearer token |
| 33 | getMyOffersTechnician | GET | /tenders/technician/my-offers | Technician pages | Bearer token |
| 34 | getMyMessages | GET | /messages | Technician pages | Bearer token |
| 35 | getConversation | GET | /messages/:userId | Technician pages | Bearer token |
| 36 | sendMessage | POST | /messages | Technician pages | Bearer token |
| 37 | markMessageRead | PATCH | /messages/:id/read | Technician pages | Bearer token |
| 38 | submitVerification | POST | /verification/submit | Technician | Bearer token |
| 39 | getVerificationStatus | GET | /verification/status | Technician | Bearer token |
| 40 | uploadFile | POST | /uploads | Shared | Bearer token |
| 41 | getUsers | GET | /users | Admin | Bearer token |
| 42 | getDashboardStats | GET | /admin/dashboard | Admin | Bearer token |
| 43 | getAllJobs | GET | /admin/jobs | Admin | Bearer token |
| 44 | getNotifications | GET | /notifications | Shared | Bearer token |
| 45 | getUnreadNotificationsCount | GET | /notifications/unread-count | Shared | Bearer token |
| 46 | markNotificationsAsRead | POST | /notifications/mark-read | Shared | Bearer token |

### Feature Services (10 files, Axios-based)

#### analytics (`src/features/analytics/services/api.ts`)

| Method | Path | Hook | Used In UI |
|---|---|---|---|
| GET | /admin/dashboard/overview | useAnalyticsOverview | Admin dashboard |
| GET | /admin/dashboard/revenue | useRevenueChart | Admin dashboard |
| GET | /admin/dashboard/bookings | useBookingChart | Admin dashboard |
| GET | /analytics/conversion-funnel | useConversionFunnel | Admin analytics |
| GET | /analytics/retention | useRetentionReport | Admin analytics |

#### audit (`src/features/audit/services/api.ts`)

| Method | Path | Hook | Used In UI |
|---|---|---|---|
| GET | /admin/activity-logs | useAuditLogs | Admin audit |

#### bookings (`src/features/bookings/services/api.ts`)

| Method | Path | Hook | Used In UI |
|---|---|---|---|
| GET | /bookings/:id | useBookingDetails | Admin booking detail |
| POST | /bookings/:id/resolve-dispute | - | Admin bookings |
| GET | /bookings/:id/timeline | - | Admin bookings |

#### cms (`src/features/cms/services/api.ts`)

| Method | Path | Hook | Used In UI |
|---|---|---|---|
| GET | /admin/categories | useCategories | Admin CMS |
| PATCH | /admin/categories/:id | useUpdateCategory | Admin CMS |
| POST | /admin/categories | useCreateCategory | Admin CMS |
| GET | /cms/banners | useBanners | Admin CMS |
| POST | /cms/banners | useCreateBanner | Admin CMS |
| PATCH | /cms/banners/:id | useUpdateBanner | Admin CMS |

#### finance (`src/features/finance/services/api.ts`)

| Method | Path | Hook | Used In UI |
|---|---|---|---|
| GET | /finance/payouts | usePayoutRequests | Admin finance |
| POST | /finance/payouts/process | useProcessPayouts | Admin finance |
| GET | /admin/dashboard/revenue | useRevenueStats | Admin finance |

#### notifications (`src/features/notifications/services/api.ts`)

| Method | Path | Hook | Used In UI |
|---|---|---|---|
| GET | /notifications/announcements | useBroadcasts | Admin notifications |
| POST | /notifications/announcements | useSendBroadcast | Admin notifications |
| GET | /notifications/templates | useTemplates | Admin notifications |
| POST | /notifications/templates | useCreateTemplate | Admin notifications |
| PATCH | /notifications/templates/:id | useUpdateTemplate | Admin notifications |

#### providers (`src/features/providers/services/api.ts`)

| Method | Path | Hook | Used In UI |
|---|---|---|---|
| GET | /admin/provider-verifications | useVerificationQueue | Admin providers |
| GET | /admin/provider-verifications/:id | useVerificationDetails | Admin providers |
| PATCH | /admin/provider-verifications/:id/approve | useApproveProvider | Admin providers |
| PATCH | /admin/provider-verifications/:id/reject | useRejectProvider | Admin providers |
| GET | /providers | useProviders | Admin providers |
| POST | /providers/:id/status | useUpdateProviderStatus | Admin providers |

#### settings (`src/features/settings/services/api.ts`)

| Method | Path | Hook | Used In UI |
|---|---|---|---|
| GET | /settings | useSettings | Admin settings |
| PUT | /settings/commission | useUpdateCommission | Admin settings |
| PUT | /settings/localization | useUpdateLocalization | Admin settings |
| PUT | /settings/security | useUpdateSecurity | Admin settings |
| GET | /settings/feature-flags | useFeatureFlags | Admin settings |
| PATCH | /settings/feature-flags/:id | useToggleFeatureFlag | Admin settings |

#### support (`src/features/support/services/api.ts`)

| Method | Path | Hook | Used In UI |
|---|---|---|---|
| GET | /support/tickets | useTickets | Admin support |
| GET | /support/tickets/:id | useTicketDetails | Admin support |
| PATCH | /support/tickets/:id/status | useUpdateTicketStatus | Admin support |
| POST | /support/tickets/:id/assign | useAssignTicket | Admin support |
| POST | /support/tickets/:id/escalate | useEscalateTicket | Admin support |
| GET | /admin/reviews | useReviews | Admin support |
| DELETE | /admin/reviews/:id | useModerateReview | Admin support |
| GET | /support/content-reports | useContentReports | Admin support |
| POST | /support/content-reports/:id/resolve | useResolveReport | Admin support |

#### users (`src/features/users/services/api.ts`)

| Method | Path | Hook | Used In UI |
|---|---|---|---|
| GET | /users | useUsers | Admin users |
| GET | /users/:id | useUserDetails | Admin users |
| PATCH | /admin/users/:id/status | useUpdateUserStatus | Admin users |
| GET | /users/:id/activity | useUserActivity | Admin users |

## Decision 2: Auth Token Inconsistency

**Finding**: Two different auth token sources exist:
1. `src/services/api.ts` — uses `localStorage.getItem('token')` directly
2. `src/lib/axios.ts` — uses `useAuthStore.getState().token` (Zustand store)

This means if `login()` stores the token in localStorage but the Zustand store (useAuthStore) is not updated, the Axios-based feature services will send requests without auth headers.

**Recommendation**: Standardize to use the Zustand store (`useAuthStore.getState().token`) as the single source of truth. The core API's `getAuthHeaders()` should read from the store, not localStorage directly. This is a safe fix if the store and localStorage are kept in sync by `useAuthStore`.

## Decision 3: Endpoint Duplication

| Issue | File | Details |
|---|---|---|
| Duplicate providers endpoint | `src/services/api.ts` | `searchProviders()` and `getProviders()` both call `/providers/search` with `GET` |
| Duplicate revenue endpoint | analytics + finance services | Both call `/admin/dashboard/revenue` via `getRevenueChart()` and `getRevenueStats()` |
| Booking in core + feature | Both layers | `createBooking()` in core + booking feature service for detail/dispute/timeline |

**Recommendation**: These are not bugs — they serve different contexts. But document them in the alignment report.

## Decision 4: Path/Method Issues

| Issue | Location | Problem | Severity |
|---|---|---|---|
| DELETE with body | `supportApi.moderateReview()` | Uses `api.delete()` with `{ data: ... }` — unusual pattern | Low |
| Duplicate category endpoint | `cmsApi.getCategories()` → `/admin/categories` vs core `getCategories()` → `/services/categories` | Different URLs serving different purposes — not a bug | None |
| `/analytics/` without `/admin/` prefix | analytics feature | `conversion-funnel` and `retention` paths lack `/admin/` prefix unlike all other admin endpoints | Medium — may need prefix if backend requires admin auth |

## Decision 5: Mock Implementations

| Location | Type | Description |
|---|---|---|
| `/ai-diagnosis` page | Component-level mock | AI Diagnosis uses mock data, not real API calls |
| `/client/saved` page | localStorage-based mock | Favorites only persisted client-side |
| `src/services/mock/` | Empty | Mock directory exists but has no files |

**No other mock implementations detected.** The mock directory is empty.

## Decision 6: Missing Feature Modules (from gap analysis)

The following API domains use raw core API functions without dedicated feature modules:
- **Jobs** — 6 core API functions used directly
- **Tenders** — 8 core API functions used directly
- **Messages** — 4 core API functions used directly
- **Offers** — 3 core API functions used directly

These are flagged as "requires manual intervention" since creating feature modules involves structural changes.

## Decision 7: Deprecated API Usage

No deprecated API usage detected — the backend does not yet exist, so no deprecation scheme is in place.

## Summary of Findings

| Category | Count | Details |
|---|---|---|
| Core API endpoints | 46 | 43 unique endpoints in `src/services/api.ts` |
| Feature service endpoints | 36 | Across 10 feature service files |
| React Query hooks | 26 | `useQuery` + `useMutation` in 10 hook files |
| Auth inconsistency | 1 | Core API uses localStorage, Axios uses Zustand store |
| Safe fix candidates | 3 | Auth standardization, analytics prefix check, moderateReview method |
| Manual intervention needed | 4 | Jobs/Tenders/Messages/Offers feature modules |
| Mock implementations | 2 | ai-diagnosis (mock) + client/saved (localStorage) |
| Endpoint duplication | 3 | providers/search, admin/dashboard/revenue, bookings |
