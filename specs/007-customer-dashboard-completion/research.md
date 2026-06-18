# Research: Customer Dashboard Completion

## Backend API Landscape Analysis

### Core API Endpoints Already Integrated

The `src/services/api.ts` file configures 41 endpoints, of which the following are relevant to this feature:

| Category | Endpoint | Method | Status |
|---|---|---|---|
| **Auth/Profile** | `/users/me` | GET | Working — fetches current user |
| **Auth/Profile** | `/users/me` | PATCH | Working — updates profile |
| **Jobs (Customer)** | `/jobs/my-jobs` | GET | Working — fetches all customer jobs |
| **Jobs (Customer)** | `/jobs/{id}` | GET | Working — fetches single job |
| **Jobs (Customer)** | `/jobs` | POST | Working — creates job |
| **Jobs (Customer)** | `/jobs/{id}/cancel` | POST | Working — cancels job |
| **Bookings** | `/bookings` | POST | Working — creates booking |
| **Notifications** | `/notifications?page=&limit=` | GET | Working — paginated notifications |
| **Notifications** | `/notifications/unread-count` | GET | Working — unread count |
| **Notifications** | `/notifications/mark-read` | POST | Working — mark as read |

### Feature Module API Endpoints

**Bookings feature** (`src/features/bookings/services/api.ts`):
- `GET /bookings/{id}` — admin booking detail
- `POST /bookings/{id}/resolve-dispute` — admin dispute resolution
- `GET /bookings/{id}/timeline` — booking timeline events

**Notifications feature** (`src/features/notifications/services/api.ts`):
- `GET /notifications/announcements` — broadcast list (admin)
- `POST /notifications/announcements` — send broadcast (admin)
- `GET /notifications/templates` — template list (admin)
- `POST /notifications/templates` — create template (admin)
- `PATCH /notifications/templates/{id}` — update template (admin)

### Missing API Endpoints (Needed for This Feature)

| Required Capability | Expected Endpoint | Notes |
|---|---|---|
| **Dashboard stats** | `GET /jobs/my-jobs?status=...` or `GET /customer/dashboard` | Existing `/jobs/my-jobs` can be used with client-side filtering; consider a dedicated dashboard stats endpoint for performance |
| **Booking history with pagination** | `GET /jobs/my-jobs?page=N&limit=N&status=X&sort=date` | Existing endpoint supports query params; need to verify pagination support |
| **Booking detail with provider info** | `GET /jobs/{id}` (already exists) | Need to expand response to include provider details |
| **Address CRUD** | `GET /addresses`, `POST /addresses`, `PATCH /addresses/{id}`, `DELETE /addresses/{id}` | Entirely new — no address endpoints exist in frontend |
| **Default address** | `PATCH /addresses/{id}/default` | Dedicated endpoint or use a `isDefault` field |
| **Customer notifications** | `GET /notifications?page=&limit=` (exists, unused) | Endpoint exists but no customer UI consumes it |
| **Tracking/ETA** | `GET /jobs/{id}/tracking` | Assumed backend endpoint; may not exist |
| **Active bookings status** | `GET /jobs/my-jobs?status=active,accepted` | Client-side filtering from existing endpoint |

### Key Findings

1. **No dedicated address feature** — The frontend has no address module, types, schemas, or API calls. Addresses are plain text fields in job/booking forms.
2. **Customer notification UI missing** — Core API endpoints exist (`getNotifications`, `getUnreadNotificationsCount`, `markNotificationsAsRead`) but are not used by any customer-facing component.
3. **Dashboard uses 3 mock data sources**: saved technicians (hardcoded array), notifications (hardcoded array), wallet balance (hardcoded `$0.00`).
4. **Booking history has no client-side pagination** — All jobs are fetched at once with no page/limit params. No status filter UI.
5. **No booking detail page exists** — The jobs list links to `/client/jobs/[id]` but this route doesn't exist.
6. **Dual HTTP client pattern**: `src/services/api.ts` uses native `fetch`, feature modules use axios. The feature module pattern (axios-based) should be used for new address API services.
7. **Alignment report** confirms 43 correct integrations, 2 broken (minor), 41 missing. This feature addresses several of the missing ones.

### Decision Record

| Decision | Rationale | Alternatives Considered |
|---|---|---|
| Use existing `/jobs/my-jobs` for dashboard stats | Already working, avoids new backend dependency | Dedicated dashboard stats endpoint — rejected to minimize backend changes |
| New `src/features/addresses/` module | Clean feature-based structure per constitution | Adding to existing feature — rejected as addresses are cross-cutting |
| Paginate on client side initially | Backend pagination support unverified | Server-side pagination — preferred but depends on backend readiness |
| Reuse existing notification API endpoints | Already correct per alignment report | Creating new notification endpoints — unnecessary |
| Use axios for new address API | Consistent with other feature modules | Using fetch from core service — axios pattern is established in feature modules |

### Technical Dependencies

- Backend must support query params on `/jobs/my-jobs` (page, limit, status)
- Address CRUD endpoints must exist in backend (if not, need backend work)
- Tracking endpoints assumed but unconfirmed
