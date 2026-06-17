# Frontend API Alignment Report

**Generated**: 2026-06-17T21:54:52.309Z
**Total Endpoints Scanned**: 84
**Auto-Fixes Applied**: 0
**Remaining Manual Fixes**: 0

---

## Correct Integrations

| # | Source | Method | Path | Auth | File |
|---|---|---|---|---|---|
| 1 | core | POST | /auth/register | No | src/services/api.ts |
| 2 | core | POST | /auth/login | No | src/services/api.ts |
| 3 | core | GET | /users/me | No | src/services/api.ts |
| 4 | core | GET | /services/categories | No | src/services/api.ts |
| 5 | core | GET | /services/${id} | No | src/services/api.ts |
| 6 | core | GET | /providers/search${query} | No | src/services/api.ts |
| 7 | core | GET | /providers/${id} | No | src/services/api.ts |
| 8 | core | GET | /providers/search | No | src/services/api.ts |
| 9 | core | GET | /providers/${providerId}/reviews?page=${page}&limit=${limit} | No | src/services/api.ts |
| 10 | core | GET | /jobs/my-jobs${query} | No | src/services/api.ts |
| 11 | core | POST | /jobs | No | src/services/api.ts |
| 12 | core | GET | /jobs/${id} | No | src/services/api.ts |
| 13 | core | POST | /jobs/${id}/cancel | No | src/services/api.ts |
| 14 | core | POST | /bookings | No | src/services/api.ts |
| 15 | core | GET | /jobs/assigned${query} | No | src/services/api.ts |
| 16 | core | POST | /jobs/assignments/accept | No | src/services/api.ts |
| 17 | core | POST | /jobs/assignments/${assignmentId}/reject | No | src/services/api.ts |
| 18 | core | POST | /jobs/${id}/status | No | src/services/api.ts |
| 19 | core | POST | /tenders | No | src/services/api.ts |
| 20 | core | GET | /tenders | No | src/services/api.ts |
| 21 | core | GET | /tenders/open | No | src/services/api.ts |
| 22 | core | GET | /tenders/${id} | No | src/services/api.ts |
| 23 | core | PATCH | /tenders/${id} | No | src/services/api.ts |
| 24 | core | POST | /tenders/${id}/cancel | No | src/services/api.ts |
| 25 | core | POST | /tenders/${tenderId}/offers | No | src/services/api.ts |
| 26 | core | GET | /tenders/${tenderId}/offers | No | src/services/api.ts |
| 27 | core | PATCH | /tenders/offers/${offerId}/accept | No | src/services/api.ts |
| 28 | core | PATCH | /tenders/offers/${offerId}/reject | No | src/services/api.ts |
| 29 | core | GET | /tenders/technician/my-offers | No | src/services/api.ts |
| 30 | core | GET | /messages | No | src/services/api.ts |
| 31 | core | GET | /messages/${otherUserId} | No | src/services/api.ts |
| 32 | core | POST | /messages | No | src/services/api.ts |
| 33 | core | PATCH | /messages/${messageId}/read | No | src/services/api.ts |
| 34 | core | POST | /verification/submit | No | src/services/api.ts |
| 35 | core | GET | /verification/status | No | src/services/api.ts |
| 36 | core | POST | ${API_URL}/uploads | Yes | src/services/api.ts |
| 37 | core | GET | /users | No | src/services/api.ts |
| 38 | core | GET | /admin/dashboard | No | src/services/api.ts |
| 39 | core | GET | /notifications?page=${page}&limit=${limit} | No | src/services/api.ts |
| 40 | core | GET | /notifications/unread-count | No | src/services/api.ts |
| 41 | core | POST | /notifications/mark-read | No | src/services/api.ts |
| 42 | feature | GET | /users | Yes | src/features/users/services/api.ts |
| 43 | feature | GET | /users/${id} | Yes | src/features/users/services/api.ts |


---

## Broken Integrations

| # | Type | Frontend | Expected | Severity | Fix |
|---|---|---|---|---|---|
| 1 | wrong_path | GET /analytics/conversion-funnel | GET /admin/analytics/conversion-funnel (if admin-only endpoint) | medium | safe |
| 2 | wrong_method | api.delete() with request body | POST /admin/reviews/:id/moderate (standard pattern) | low | safe |


---

## Endpoint Mismatches

| # | Type | Frontend | Expected | Severity | Fix |
|---|---|---|---|---|---|
| 1 | wrong_path | GET /analytics/conversion-funnel | GET /admin/analytics/conversion-funnel (if admin-only endpoint) | medium | safe |
| 2 | wrong_method | api.delete() with request body | POST /admin/reviews/:id/moderate (standard pattern) | low | safe |


---

## DTO Mismatches

No mismatches in this category.


---

## Missing API Integrations

- **mm-1**: Frontend endpoint GET ?categoryId=${categoryId} in src/services/api.ts has no matching backend contract.
  - File: `src/services/api.ts` (line 85)
  - Frontend: `GET ?categoryId=${categoryId}` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-2**: Frontend endpoint GET ?latitude=${lat}&longitude=${lng}${radius ?  in src/services/api.ts has no matching backend contract.
  - File: `src/services/api.ts` (line 197)
  - Frontend: `GET ?latitude=${lat}&longitude=${lng}${radius ? ` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-3**: Frontend endpoint GET /admin/jobs${query} in src/services/api.ts has no matching backend contract.
  - File: `src/services/api.ts` (line 379)
  - Frontend: `GET /admin/jobs${query}` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-4**: Frontend endpoint GET /admin/dashboard/overview in src/features/analytics/services/api.ts has no matching backend contract.
  - File: `src/features/analytics/services/api.ts` (line 30)
  - Frontend: `GET /admin/dashboard/overview` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-5**: Frontend endpoint GET /admin/dashboard/revenue in src/features/analytics/services/api.ts has no matching backend contract.
  - File: `src/features/analytics/services/api.ts` (line 35)
  - Frontend: `GET /admin/dashboard/revenue` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-6**: Frontend endpoint GET /admin/dashboard/bookings in src/features/analytics/services/api.ts has no matching backend contract.
  - File: `src/features/analytics/services/api.ts` (line 40)
  - Frontend: `GET /admin/dashboard/bookings` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-7**: Frontend endpoint GET /analytics/conversion-funnel in src/features/analytics/services/api.ts has no matching backend contract.
  - File: `src/features/analytics/services/api.ts` (line 45)
  - Frontend: `GET /analytics/conversion-funnel` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-8**: Frontend endpoint GET /analytics/retention in src/features/analytics/services/api.ts has no matching backend contract.
  - File: `src/features/analytics/services/api.ts` (line 50)
  - Frontend: `GET /analytics/retention` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-9**: Frontend endpoint GET /admin/activity-logs in src/features/audit/services/api.ts has no matching backend contract.
  - File: `src/features/audit/services/api.ts` (line 21)
  - Frontend: `GET /admin/activity-logs` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-10**: Frontend endpoint GET /bookings/${id} in src/features/bookings/services/api.ts has no matching backend contract.
  - File: `src/features/bookings/services/api.ts` (line 24)
  - Frontend: `GET /bookings/${id}` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-11**: Frontend endpoint POST /bookings/${id}/resolve-dispute in src/features/bookings/services/api.ts has no matching backend contract.
  - File: `src/features/bookings/services/api.ts` (line 29)
  - Frontend: `POST /bookings/${id}/resolve-dispute` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-12**: Frontend endpoint GET /bookings/${id}/timeline in src/features/bookings/services/api.ts has no matching backend contract.
  - File: `src/features/bookings/services/api.ts` (line 37)
  - Frontend: `GET /bookings/${id}/timeline` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-13**: Frontend endpoint GET /admin/categories in src/features/cms/services/api.ts has no matching backend contract.
  - File: `src/features/cms/services/api.ts` (line 24)
  - Frontend: `GET /admin/categories` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-14**: Frontend endpoint PATCH /admin/categories/${id} in src/features/cms/services/api.ts has no matching backend contract.
  - File: `src/features/cms/services/api.ts` (line 29)
  - Frontend: `PATCH /admin/categories/${id}` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-15**: Frontend endpoint POST /admin/categories in src/features/cms/services/api.ts has no matching backend contract.
  - File: `src/features/cms/services/api.ts` (line 34)
  - Frontend: `POST /admin/categories` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-16**: Frontend endpoint GET /cms/banners in src/features/cms/services/api.ts has no matching backend contract.
  - File: `src/features/cms/services/api.ts` (line 39)
  - Frontend: `GET /cms/banners` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-17**: Frontend endpoint POST /cms/banners in src/features/cms/services/api.ts has no matching backend contract.
  - File: `src/features/cms/services/api.ts` (line 44)
  - Frontend: `POST /cms/banners` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-18**: Frontend endpoint PATCH /cms/banners/${id} in src/features/cms/services/api.ts has no matching backend contract.
  - File: `src/features/cms/services/api.ts` (line 49)
  - Frontend: `PATCH /cms/banners/${id}` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-19**: Frontend endpoint GET /notifications/announcements in src/features/notifications/services/api.ts has no matching backend contract.
  - File: `src/features/notifications/services/api.ts` (line 23)
  - Frontend: `GET /notifications/announcements` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-20**: Frontend endpoint POST /notifications/announcements in src/features/notifications/services/api.ts has no matching backend contract.
  - File: `src/features/notifications/services/api.ts` (line 28)
  - Frontend: `POST /notifications/announcements` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-21**: Frontend endpoint GET /notifications/templates in src/features/notifications/services/api.ts has no matching backend contract.
  - File: `src/features/notifications/services/api.ts` (line 33)
  - Frontend: `GET /notifications/templates` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-22**: Frontend endpoint POST /notifications/templates in src/features/notifications/services/api.ts has no matching backend contract.
  - File: `src/features/notifications/services/api.ts` (line 38)
  - Frontend: `POST /notifications/templates` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-23**: Frontend endpoint PATCH /notifications/templates/${id} in src/features/notifications/services/api.ts has no matching backend contract.
  - File: `src/features/notifications/services/api.ts` (line 43)
  - Frontend: `PATCH /notifications/templates/${id}` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-24**: Frontend endpoint POST /providers/${id}/status in src/features/providers/services/api.ts has no matching backend contract.
  - File: `src/features/providers/services/api.ts` (line 63)
  - Frontend: `POST /providers/${id}/status` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-25**: Frontend endpoint GET /settings in src/features/settings/services/api.ts has no matching backend contract.
  - File: `src/features/settings/services/api.ts` (line 39)
  - Frontend: `GET /settings` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-26**: Frontend endpoint PUT /settings/commission in src/features/settings/services/api.ts has no matching backend contract.
  - File: `src/features/settings/services/api.ts` (line 44)
  - Frontend: `PUT /settings/commission` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-27**: Frontend endpoint PUT /settings/localization in src/features/settings/services/api.ts has no matching backend contract.
  - File: `src/features/settings/services/api.ts` (line 49)
  - Frontend: `PUT /settings/localization` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-28**: Frontend endpoint PUT /settings/security in src/features/settings/services/api.ts has no matching backend contract.
  - File: `src/features/settings/services/api.ts` (line 54)
  - Frontend: `PUT /settings/security` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-29**: Frontend endpoint GET /settings/feature-flags in src/features/settings/services/api.ts has no matching backend contract.
  - File: `src/features/settings/services/api.ts` (line 59)
  - Frontend: `GET /settings/feature-flags` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-30**: Frontend endpoint PATCH /settings/feature-flags/${id} in src/features/settings/services/api.ts has no matching backend contract.
  - File: `src/features/settings/services/api.ts` (line 64)
  - Frontend: `PATCH /settings/feature-flags/${id}` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-31**: Frontend endpoint GET /support/tickets in src/features/support/services/api.ts has no matching backend contract.
  - File: `src/features/support/services/api.ts` (line 46)
  - Frontend: `GET /support/tickets` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-32**: Frontend endpoint GET /support/tickets/${id} in src/features/support/services/api.ts has no matching backend contract.
  - File: `src/features/support/services/api.ts` (line 51)
  - Frontend: `GET /support/tickets/${id}` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-33**: Frontend endpoint PATCH /support/tickets/${id}/status in src/features/support/services/api.ts has no matching backend contract.
  - File: `src/features/support/services/api.ts` (line 56)
  - Frontend: `PATCH /support/tickets/${id}/status` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-34**: Frontend endpoint POST /support/tickets/${id}/assign in src/features/support/services/api.ts has no matching backend contract.
  - File: `src/features/support/services/api.ts` (line 61)
  - Frontend: `POST /support/tickets/${id}/assign` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-35**: Frontend endpoint POST /support/tickets/${id}/escalate in src/features/support/services/api.ts has no matching backend contract.
  - File: `src/features/support/services/api.ts` (line 66)
  - Frontend: `POST /support/tickets/${id}/escalate` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-36**: Frontend endpoint GET /admin/reviews in src/features/support/services/api.ts has no matching backend contract.
  - File: `src/features/support/services/api.ts` (line 71)
  - Frontend: `GET /admin/reviews` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-37**: Frontend endpoint DELETE /admin/reviews/${id} in src/features/support/services/api.ts has no matching backend contract.
  - File: `src/features/support/services/api.ts` (line 76)
  - Frontend: `DELETE /admin/reviews/${id}` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-38**: Frontend endpoint GET /support/content-reports in src/features/support/services/api.ts has no matching backend contract.
  - File: `src/features/support/services/api.ts` (line 81)
  - Frontend: `GET /support/content-reports` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-39**: Frontend endpoint POST /support/content-reports/${id}/resolve in src/features/support/services/api.ts has no matching backend contract.
  - File: `src/features/support/services/api.ts` (line 86)
  - Frontend: `POST /support/content-reports/${id}/resolve` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-40**: Frontend endpoint PATCH /admin/users/${id}/status in src/features/users/services/api.ts has no matching backend contract.
  - File: `src/features/users/services/api.ts` (line 22)
  - Frontend: `PATCH /admin/users/${id}/status` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-41**: Frontend endpoint GET /users/${id}/activity in src/features/users/services/api.ts has no matching backend contract.
  - File: `src/features/users/services/api.ts` (line 30)
  - Frontend: `GET /users/${id}/activity` → Expected: `No matching backend contract found`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-feature-jobs**: Jobs has no feature module — 9 core API functions (getMyJobs, createJob, getJobById, cancelJob, getAssignedJobs, getAvailableJobs, acceptJob, rejectJob, updateJobStatus) used directly. Create src/features/jobs/ with services/, hooks/, components/, schemas/, types/ subdirectories. Pages affected: /client/jobs, /technician/jobs, /admin/jobs.
  - File: `src/features/jobs/`
  - Frontend: `9 core API functions without dedicated feature module` → Expected: `Dedicated feature module under src/features/jobs/`
  - Severity: high | Fix: requires_manual_intervention
- **mm-feature-tenders**: Tenders has no feature module — 6 core API functions (createTender, getMyTenders, getOpenTenders, getTenderById, updateTender, cancelTender) used directly. Create src/features/tenders/ with services/, hooks/, components/, schemas/, types/ subdirectories. Pages affected: /tenders/create, /tenders/[id].
  - File: `src/features/tenders/`
  - Frontend: `6 core API functions without dedicated feature module` → Expected: `Dedicated feature module under src/features/tenders/`
  - Severity: high | Fix: requires_manual_intervention
- **mm-feature-messages**: Messages has no feature module — 4 core API functions (getMyMessages, getConversation, sendMessage, markMessageRead) used directly. Create src/features/messages/ with services/, hooks/, components/, schemas/, types/ subdirectories. Pages affected: /technician/messages.
  - File: `src/features/messages/`
  - Frontend: `4 core API functions without dedicated feature module` → Expected: `Dedicated feature module under src/features/messages/`
  - Severity: high | Fix: requires_manual_intervention
- **mm-feature-offers**: Offers has no feature module — 5 core API functions (submitOffer, getTenderOffers, acceptOffer, rejectOffer, getMyOffersTechnician) used directly. Create src/features/offers/ with services/, hooks/, components/, schemas/, types/ subdirectories. Pages affected: /technician/offers.
  - File: `src/features/offers/`
  - Frontend: `5 core API functions without dedicated feature module` → Expected: `Dedicated feature module under src/features/offers/`
  - Severity: high | Fix: requires_manual_intervention
- **mm-disconnected-client-profile**: Profile page exists but no API integration for user profile updates. Required endpoint: PATCH /users/me or dedicated profile endpoint. Priority: P2.
  - File: `src/app/[locale]/client/profile/`
  - Frontend: `/client/profile — page exists but is disconnected` → Expected: `PATCH /users/me or dedicated profile endpoint`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-disconnected-technician-profile**: Technician profile page exists but no API integration for updating profile/skills. Required endpoint: PATCH /providers/:id or dedicated profile endpoint. Priority: P2.
  - File: `src/app/[locale]/technician/profile/`
  - Frontend: `/technician/profile — page exists but is disconnected` → Expected: `PATCH /providers/:id or dedicated profile endpoint`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-disconnected-technician-earnings**: Earnings page exists but not connected to finance/payouts API. Required endpoint: GET /finance/payouts or /admin/dashboard/revenue. Priority: P2.
  - File: `src/app/[locale]/technician/earnings/`
  - Frontend: `/technician/earnings — page exists but is disconnected` → Expected: `GET /finance/payouts or /admin/dashboard/revenue`
  - Severity: medium | Fix: requires_manual_intervention
- **mm-disconnected-client-wallet**: Wallet page exists but no backend integration for balance/payment history. Required endpoint: GET /finance/wallet or dedicated wallet endpoint. Priority: P2.
  - File: `src/app/[locale]/client/wallet/`
  - Frontend: `/client/wallet — page exists but is disconnected` → Expected: `GET /finance/wallet or dedicated wallet endpoint`
  - Severity: medium | Fix: requires_manual_intervention

---

## Mock Implementations

- **mm-mock-001**: /ai-diagnosis page uses mock data instead of real AI Gateway API. Needs integration with AI Gateway endpoint when available.
  - File: `src/app/[locale]/ai-diagnosis/`
  - Frontend: `Mock AI diagnosis data` → Expected: `Real AI Gateway endpoint`
  - Severity: high | Fix: requires_manual_intervention
- **mm-mock-002**: /client/saved uses localStorage instead of backend API for favorites. Needs backend favorites endpoint and integration.
  - File: `src/app/[locale]/client/saved/`
  - Frontend: `localStorage-based favorites` → Expected: `Backend favorites/provider bookmarking API`
  - Severity: medium | Fix: requires_manual_intervention

---

## Required Fixes


