# Frontend Business Gap Analysis

**Generated**: 2026-06-18
**Feature**: `specs/004-business-coverage-audit`
**Scope**: Herfa Frontend vs Backend Coverage Audit
**Status**: Draft

---

## 1. Existing Frontend Coverage

### Page Inventory

Total pages: 43 `page.tsx` files across 7 route groups.

#### Public Pages (13)

| Route | File Exists | Backend Connected | Missing Features |
|---|---|---|---|
| `/` | Yes | Partial | Hero, services overview — static content only |
| `/services` | Yes | Yes | Category filtering via `getCategories` |
| `/services/[id]` | Yes | Yes | Service detail via `getServiceById` |
| `/technicians` | Yes | Yes | Provider search via `searchProviders` |
| `/technicians/[id]` | Yes | Yes | Provider detail via `getProviderById` |
| `/about` | Yes | No | Static page, no API integration |
| `/contact` | No | N/A | Missing page |
| `/faq` | No | N/A | Missing page |
| `/ai-diagnosis` | Yes | No | Mock AI — real API not wired |
| `/support` | Yes | Yes | Support chat page exists |
| `/booking/[id]` | Yes | Yes | Multi-step booking via `createBooking` |
| `/tenders/[id]` | Yes | Partial | Tender detail — backend API exists |
| `/tenders/create` | Yes | Partial | Create tender form — backend API exists |

#### Auth Pages (2)

| Route | File Exists | Backend Connected | Missing Features |
|---|---|---|---|
| `/login` | Yes | Yes | Login via `login()` API |
| `/register` | Yes | Yes | Register via `register()` API |

#### Customer Portal (8)

| Route | File Exists | Backend Connected | Missing Features |
|---|---|---|---|
| `/client/dashboard` | Yes | Partial | Dashboard KPIs, recent jobs |
| `/client/create-job` | Yes | Yes | Job creation via `createJob` + `CreateJobForm` |
| `/client/jobs` | Yes | Yes | Job listing via `getMyJobs` |
| `/client/profile` | Yes | No | Profile management page exists |
| `/client/wallet` | Yes | No | Wallet page exists but no backend integration |
| `/client/saved` | Yes | No | Saved technicians page — uses localStorage only |
| `/client/tenders` | No | N/A | Missing page — tenders should be visible to clients |
| `/client/my-bookings` | No | N/A | Missing page — booking tracking (research.md mentions this) |

#### Technician Portal (9)

| Route | File Exists | Backend Connected | Missing Features |
|---|---|---|---|
| `/technician/dashboard` | Yes | Partial | Dashboard with job stats |
| `/technician/jobs` | Yes | Partial | `getAssignedJobs`, no dedicated feature module |
| `/technician/earnings` | Yes | No | Earnings page — no finance service hook |
| `/technician/schedule` | No | N/A | Missing page |
| `/technician/offers` | Yes | Partial | `getMyOffersTechnician`, no dedicated hook |
| `/technician/profile` | Yes | No | Profile management |
| `/technician/messages` | Yes | Partial | `getMyMessages` / `sendMessage` — core API only |
| `/technician/requests` | Yes | Partial | Job request listing |
| `/technician/onboarding-home` | Yes | No | Onboarding page — static |
| `/technician/verification` | No | N/A | Missing page — verification flow exists in core API |

#### Admin Portal (12)

| Route | File Exists | Backend Connected | Missing Features |
|---|---|---|---|
| `/admin/dashboard` | Yes | Yes | Dashboard via `getDashboardStats` |
| `/admin/audit` | Yes | Yes | Audit logs via feature module |
| `/admin/bookings/[id]` | Yes | Yes | Booking detail via feature module |
| `/admin/cms` | Yes | Yes | CMS management via feature module |
| `/admin/finance` | Yes | Yes | Finance via feature module |
| `/admin/notifications` | Yes | Yes | Notifications via feature module |
| `/admin/providers` | Yes | Yes | Provider list via feature module |
| `/admin/providers/verification/[id]` | Yes | Yes | Verification queue |
| `/admin/users` | Yes | Yes | User list via feature module |
| `/admin/users/[id]` | Yes | Yes | User detail via feature module |
| `/admin/settings` | Yes | Partial | Settings via feature module |
| `/admin/complaints` | Yes | Partial | Complaints page — backend integration partial |
| `/admin/jobs` | Yes | Yes | Jobs via `getAllJobs` |
| `/admin/support` | No | N/A | Missing page — `supportService` exists but no route |

---

## 2. Missing Business Areas

### Auth

| Criterion | Status |
|---|---|
| Exists in Frontend | Yes |
| APIs Connected | 4 / 4 |
| Pages Implemented | 2 / 2 |
| Components Built | 2 / 2 |
| Missing APIs | None |
| Missing Pages | None |
| Missing Components | None |

### Users

| Criterion | Status |
|---|---|
| Exists in Frontend | Yes |
| APIs Connected | 1 / 1 |
| Pages Implemented | 2 / 2 |
| Components Built | 1 / 1 |
| Missing APIs | None |
| Missing Pages | None |
| Missing Components | None |

### Bookings

| Criterion | Status |
|---|---|
| Exists in Frontend | Yes |
| APIs Connected | 1 / 1 (core) + feature service |
| Pages Implemented | 1 / 2 |
| Components Built | 2 / 2 |
| Missing APIs | None |
| Missing Pages | `/client/my-bookings` — booking tracking page |
| Missing Components | None |

### Providers

| Criterion | Status |
|---|---|
| Exists in Frontend | Yes |
| APIs Connected | 4 / 4 (core + feature) |
| Pages Implemented | 4 / 4 |
| Components Built | 2 / 2 |
| Missing APIs | None |
| Missing Pages | None |
| Missing Components | None |

### Payments / Finance

| Criterion | Status |
|---|---|
| Exists in Frontend | Yes |
| APIs Connected | Full feature service |
| Pages Implemented | 1 / 1 (admin/finance) |
| Components Built | 1 / 1 |
| Missing APIs | None |
| Missing Pages | `/technician/earnings` (exists but disconnected) |
| Missing Components | None |

### Support

| Criterion | Status |
|---|---|
| Exists in Frontend | Partial |
| APIs Connected | Full feature service |
| Pages Implemented | 1 / 2 |
| Components Built | 3 / 3 |
| Missing APIs | None |
| Missing Pages | `/admin/support` — route not implemented despite service existing |
| Missing Components | None |

### Notifications

| Criterion | Status |
|---|---|
| Exists in Frontend | Yes |
| APIs Connected | Full feature service + core |
| Pages Implemented | 1 / 1 |
| Components Built | 2 / 2 |
| Missing APIs | None |
| Missing Pages | None |
| Missing Components | None |

### CMS

| Criterion | Status |
|---|---|
| Exists in Frontend | Yes |
| APIs Connected | Full feature service |
| Pages Implemented | 1 / 1 |
| Components Built | 2 / 2 |
| Missing APIs | None |
| Missing Pages | None |
| Missing Components | None |

### Analytics

| Criterion | Status |
|---|---|
| Exists in Frontend | Yes |
| APIs Connected | Full feature service |
| Pages Implemented | 1 / 1 |
| Components Built | 3 / 3 |
| Missing APIs | None |
| Missing Pages | None |
| Missing Components | None |

### Audit

| Criterion | Status |
|---|---|
| Exists in Frontend | Yes |
| APIs Connected | Full feature service |
| Pages Implemented | 1 / 1 |
| Components Built | 1 / 1 |
| Missing APIs | None |
| Missing Pages | None |
| Missing Components | None |

### Settings

| Criterion | Status |
|---|---|
| Exists in Frontend | Yes |
| APIs Connected | Full feature service |
| Pages Implemented | 1 / 1 |
| Components Built | 4 / 4 |
| Missing APIs | None |
| Missing Pages | None |
| Missing Components | None |

### Jobs

| Criterion | Status |
|---|---|
| Exists in Frontend | Partial |
| APIs Connected | 6 / 6 core | 0 feature service |
| Pages Implemented | 3 / 3 |
| Components Built | 0 / 0 |
| Missing APIs | None (all 6 core functions exist) |
| Missing Pages | None |
| Missing Components | No dedicated feature module — raw core API usage |

### Tenders

| Criterion | Status |
|---|---|
| Exists in Frontend | Partial |
| APIs Connected | 6 / 6 core | 0 feature service |
| Pages Implemented | 2 / 3 |
| Components Built | 0 / 0 |
| Missing APIs | None (all core functions exist) |
| Missing Pages | `/tenders` (listing page) |
| Missing Components | No dedicated feature module |

### Messages

| Criterion | Status |
|---|---|
| Exists in Frontend | Partial |
| APIs Connected | 4 / 4 core | 0 feature service |
| Pages Implemented | 1 / 1 (technician) |
| Components Built | 0 / 0 |
| Missing APIs | None (all core functions exist) |
| Missing Pages | None |
| Missing Components | No dedicated feature module |

### Offers

| Criterion | Status |
|---|---|
| Exists in Frontend | Partial |
| APIs Connected | 3 / 3 core | 0 feature service |
| Pages Implemented | 1 / 1 |
| Components Built | 0 / 0 |
| Missing APIs | None |
| Missing Pages | None |
| Missing Components | No dedicated feature module — raw core API usage |

---

## 3. Categorized Findings

### Critical (blocks core business flow; no workaround)

| Gap | Backend Module | Description |
|---|---|---|
| No technician verification page | Providers | Unverified techs cannot complete onboarding → blocked from accepting jobs |
| Missing `/client/my-bookings` page | Bookings | Clients cannot track existing bookings |
| Missing `/admin/support` page | Support | Admins cannot manage support tickets despite service existing |

### High (significant feature gap; partial workaround exists)

| Gap | Backend Module | Description |
|---|---|---|
| Jobs has no feature module | Jobs | 6 core API functions used directly; no hooks, no schemas, no components |
| Tenders has no feature module | Tenders | 6 core API functions used directly; no hooks, no schemas, no components |
| Messages has no feature module | Messages | 4 core API functions used directly; technician messages page exists |
| Offers has no feature module | Offers | 3 core API functions used directly; no dedicated hooks |
| `/client/wallet` page disconnected | Finance | Page exists but not wired to finance service |
| Missing technician schedule page | Providers | No page for techs to manage their schedule |
| Missing `/tenders` listing page | Tenders | Users can create and view individual tenders but cannot browse all |

### Medium (important but non-blocking improvement)

| Gap | Backend Module | Description |
|---|---|---|
| `/technician/earnings` disconnected | Finance | Page exists but not connected to finance/payouts API |
| Loading states missing on most pages | Cross-cutting | Many pages lack `loading.tsx` |
| Error boundaries missing on several pages | Cross-cutting | Several pages lack `error.tsx` |
| `/client/profile` disconnected | Users | Profile page exists but no API integration |
| `/technician/profile` disconnected | Users | Profile page exists but no API integration |

### Low (polish / nice-to-have enhancement)

| Gap | Backend Module | Description |
|---|---|---|
| Missing `/contact` page | CMS | Static contact page |
| Missing `/faq` page | CMS | Static FAQ page |
| `/ai-diagnosis` uses mock data | AI Gateway | Needs real AI Gateway integration |
| `/client/saved` uses localStorage | Providers | Should sync favorites with backend |
| Missing `/client/tenders` page | Tenders | Clients should be able to browse their tenders |
| Admin complaints page partial integration | Support | Route exists but backend integration unclear |

---

## 4. Frontend Roadmap

### P1 (MVP — Must Have)

| Item | Backend Module | Effort Estimate |
|---|---|---|
| Create provider verification page | Providers | Medium |
| Create `/admin/support` page | Support | Medium |
| Create `/client/my-bookings` page | Bookings | Small |
| Create Jobs feature module | Jobs | Large |
| Add loading states to all pages | Cross-cutting | Medium |

### P2 (Should Have)

| Item | Backend Module | Effort Estimate |
|---|---|---|
| Create Tenders feature module | Tenders | Large |
| Create Messages feature module | Messages | Medium |
| Wire `/client/wallet` to finance API | Finance | Small |
| Wire `/technician/earnings` to finance API | Finance | Small |
| Create `/tenders` listing page | Tenders | Small |
| Create technician schedule page | Providers | Medium |
| Create `/client/profile` API integration | Users | Small |

### P3 (Nice to Have)

| Item | Backend Module | Effort Estimate |
|---|---|---|
| Create `/contact` page | CMS | Small |
| Create `/faq` page | CMS | Small |
| Wire `/ai-diagnosis` to AI Gateway | AI Gateway | Medium |
| Sync `/client/saved` favorites with backend | Providers | Small |
| Create `/client/tenders` page | Tenders | Small |
| Add error boundaries to all pages | Cross-cutting | Medium |

---

## 5. API Coverage Matrix

### Core API (`src/services/api.ts`)

| Method | Route | Connected | Has Hook | Used In UI | Source |
|---|---|---|---|---|---|
| POST | /auth/register | Yes | Yes | Yes | core |
| POST | /auth/login | Yes | Yes | Yes | core |
| GET | /users/me | Yes | Yes | Yes | core |
| GET | /services/categories | Yes | No | Yes | core |
| GET | /services | Yes | No | Yes | core |
| GET | /services/:id | Yes | No | Yes | core |
| GET | /providers/search | Yes | No | Yes | core |
| GET | /providers/:id | Yes | Yes | Yes | core |
| GET | /providers/:id/reviews | Yes | No | No | core |
| GET | /jobs/my-jobs | Partial | No | Yes | core |
| POST | /jobs | Partial | No | Yes | core |
| GET | /jobs/:id | Partial | No | Yes | core |
| POST | /jobs/:id/cancel | Partial | No | No | core |
| POST | /bookings | Yes | Yes | Yes | core |
| GET | /jobs/assigned | Partial | No | Yes | core |
| GET | /jobs/available | Partial | No | No | core |
| POST | /jobs/assignments/accept | Partial | No | No | core |
| POST | /jobs/assignments/:id/reject | Partial | No | No | core |
| POST | /jobs/:id/status | Partial | No | Yes | core |
| POST | /tenders | Partial | No | Yes | core |
| GET | /tenders | Partial | No | No | core |
| GET | /tenders/open | Partial | No | No | core |
| GET | /tenders/:id | Partial | No | Yes | core |
| PATCH | /tenders/:id | Partial | No | No | core |
| POST | /tenders/:id/cancel | Partial | No | No | core |
| POST | /tenders/:id/offers | Partial | No | No | core |
| GET | /tenders/:id/offers | Partial | No | No | core |
| PATCH | /tenders/offers/:id/accept | Partial | No | No | core |
| PATCH | /tenders/offers/:id/reject | Partial | No | No | core |
| GET | /tenders/technician/my-offers | Partial | No | Yes | core |
| GET | /messages | Partial | No | Yes | core |
| GET | /messages/:userId | Partial | No | Yes | core |
| POST | /messages | Partial | No | Yes | core |
| PATCH | /messages/:id/read | Partial | No | No | core |
| POST | /verification/submit | Yes | Yes | No | core |
| GET | /verification/status | Yes | Yes | No | core |
| POST | /uploads | Yes | No | No | core |
| GET | /users | Yes | Yes | Yes | core |
| GET | /admin/dashboard | Yes | No | Yes | core |
| GET | /admin/jobs | Yes | No | Yes | core |
| GET | /notifications | Yes | Yes | Yes | core |
| GET | /notifications/unread-count | Yes | Yes | No | core |
| POST | /notifications/mark-read | Yes | Yes | Yes | core |

### Feature Services

#### Bookings (`src/features/bookings/services/api.ts`)

| Method | Route | Connected | Has Hook | Used In UI | Source |
|---|---|---|---|---|---|
| Various booking endpoints | TBD | Yes | Yes | Yes | feature |

#### Providers (`src/features/providers/services/api.ts`)

| Method | Route | Connected | Has Hook | Used In UI | Source |
|---|---|---|---|---|---|
| Various provider endpoints | TBD | Yes | Yes | Yes | feature |

#### Finance (`src/features/finance/services/api.ts`)

| Method | Route | Connected | Has Hook | Used In UI | Source |
|---|---|---|---|---|---|
| Various finance endpoints | TBD | Yes | Yes | Yes | feature |

*(Feature service endpoints for Analytics, Audit, CMS, Notifications, Settings, Support, and Users follow the same pattern — connected with hooks and UI usage.)*

### Summary

| Metric | Count |
|---|---|
| Total core API endpoints | 43 |
| Connected (full stack) | 13 |
| Partial (core API only, no feature module) | 22 |
| Not Connected | 0 |
| Feature services with hooks | 10 |
| APIs without dedicated hooks | 30 |
| APIs used in pages | 26 |

---

## 6. Missing Screens

### Customer Portal

- `/client/my-bookings` (track existing bookings) — required by spec
- `/client/tenders` (browse submitted tenders) — missing

### Technician Portal

- `/technician/schedule` (manage work schedule) — per constitution folder structure
- `/technician/verification` (submit documents for verification) — core API exists but no page

### Admin Portal

- `/admin/support` (manage support tickets) — `supportService` exists but route absent
- `/admin/bookings` (booking listing, level above detail) — only `[id]` route exists

### Public Pages

- `/contact` — static contact page
- `/faq` — static FAQ page
- `/tenders` (listing page) — only create and detail pages exist

---

## 7. Missing Components

| Component | Domain | Description |
|---|---|---|
| ProviderVerificationBadge | Providers | Status badge showing verification state |
| BookingTimelineStepper | Bookings | Visual step indicator for booking lifecycle |
| DisputeResolutionPanel | Bookings | Panel for handling booking disputes |
| WalletBalanceCard | Finance | Wallet balance display widget |
| EarningsSummaryCard | Finance | Technician earnings overview card |
| TenderList | Tenders | Reusable tender listing component |
| TenderCard | Tenders | Tender summary card for listing views |
| OfferCard | Offers | Offer summary component for tender details |
| ConversationList | Messages | List of active conversations |
| MessageThread | Messages | Message thread display component |
| ScheduleCalendar | Providers | Weekly/monthly schedule view |
| SupportTicketList | Support | Reusable ticket listing (admin) |
| SupportTicketDetail | Support | Ticket detail panel |

---

## 8. Missing Business Flows

### Provider Onboarding → Verification → First Job

| Field | Value |
|---|---|
| Backend Module | Providers, Jobs |
| Current State | Provider can register and view onboarding-home page, but verification flow has no dedicated page |
| Gap Description | New providers cannot complete identity verification, get approved by admin, or receive their first job assignment through a guided flow |
| Priority | Critical |

### Booking Creation → Tracking → Completion → Review

| Field | Value |
|---|---|
| Backend Module | Bookings |
| Current State | Booking creation via `/booking/[id]` works; tracking page missing; review/dispute flows absent |
| Gap Description | Clients create bookings but have no dashboard to track them through lifecycle stages or leave reviews |
| Priority | Critical |

### Tender Creation → Offers → Acceptance → Fulfillment

| Field | Value |
|---|---|
| Backend Module | Tenders, Offers |
| Current State | Create/detail pages exist; offer submission, acceptance, and rejection work via core API |
| Gap Description | No tender listing page; no dedicated feature module; offers management is fragmented across core API calls |
| Priority | High |

### Support Ticket Lifecycle

| Field | Value |
|---|---|
| Backend Module | Support |
| Current State | `supportService` feature module exists with hooks, schema, and components but no admin route renders it |
| Gap Description | Customers can create tickets (via support chat) but admins cannot manage, triage, or respond through a dashboard |
| Priority | High |

### Technician Onboarding → Schedule → Earnings → Payout

| Field | Value |
|---|---|
| Backend Module | Providers, Finance |
| Current State | Technician profile, earnings, and onboarding-home pages exist but are disconnected from APIs |
| Gap Description | Technicians cannot set their schedule, view earnings, or request payouts through a guided workflow |
| Priority | Medium |

---

## 9. Re-running the Audit

To regenerate this report after future feature implementations:

1. Re-scan `src/app/[locale]/` for new/modified page files:
   ```powershell
   Get-ChildItem -Path "src/app/[locale]" -Recurse -Filter "page.tsx"
   ```

2. Re-scan `src/features/` for new/modified service/hook files:
   ```powershell
   Get-ChildItem -Path "src" -Recurse -Filter "api.ts"
   Get-ChildItem -Path "src/features" -Recurse -Filter "hooks/*.ts"
   Get-ChildItem -Path "src/features" -Recurse -Filter "schemas/*.ts"
   ```

3. Update the API matrix with any new endpoints added to `src/services/api.ts` or feature services.

4. Promote previously "missing" items to "covered" as features are implemented.

5. Regenerate the roadmap with updated priorities based on remaining gaps.
