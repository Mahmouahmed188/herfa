# Reviews & Ratings — Frontend API Audit

## Backend Endpoints Coverage

| # | Method | Path | Auth | Roles | Frontend Coverage | Status |
|---|--------|------|------|-------|-------------------|--------|
| 1 | POST | `/reviews` | JWT | customer | `reviewApi.createReview()` | ✅ Covered |
| 2 | GET | `/reviews` | JWT | customer | `reviewApi.getCustomerReviews()` | ✅ Covered |
| 3 | GET | `/reviews/provider` | JWT | provider | `reviewApi.getProviderReviews()` | ✅ Covered |
| 4 | GET | `/reviews/:id` | JWT | all | `reviewApi.getReviewDetail()` | ✅ Covered |
| 5 | PATCH | `/reviews/:id` | JWT | owner | `reviewApi.updateReview()` | ✅ Covered |
| 6 | DELETE | `/reviews/:id` | JWT | owner | `reviewApi.deleteReview()` | ✅ Covered |
| 7 | POST | `/reviews/:id/flag` | JWT | all | `reviewApi.flagReview()` | ✅ Covered |
| 8 | PATCH | `/reviews/:id/moderate` | JWT | admin, super_admin | `reviewApi.moderateReview()` | ✅ Covered |
| 9 | GET | `/reviews/admin` | JWT | admin, super_admin | `reviewApi.getAdminReviews()` | ✅ Covered |
| 10 | GET | `/providers/:providerId/reviews` | Optional JWT | any | `reviewApi.getProviderPublicReviews()` | ✅ Covered |
| 11 | GET | `/analytics/reviews` | JWT | admin, super_admin | `reviewApi.getAnalytics()` | ✅ Covered |

## DTO Alignment

| Backend Field | Frontend Type | Match |
|---------------|---------------|-------|
| `id` (UUID) | `string` | ✅ |
| `bookingId` (UUID) | `string` | ✅ |
| `customerId` (UUID) | `string` | ✅ |
| `providerId` (UUID) | `string` | ✅ |
| `rating` (integer 1-5) | `number` | ✅ |
| `comment` (text, optional) | `string \| undefined` | ✅ |
| `isApproved` (boolean) | `boolean` | ✅ |
| `isFlagged` (boolean) | `boolean` | ✅ |
| `createdAt` (ISO 8601) | `string` | ✅ |
| `updatedAt` (ISO 8601) | `string` | ✅ |

## Moderation State Mapping

| Backend State | Frontend Display | Mapping |
|---------------|-----------------|---------|
| `isApproved: true, isFlagged: false` | `APPROVED` | `deriveModerationState()` |
| `isApproved: false, isFlagged: false` | `PENDING` | `deriveModerationState()` |
| `isFlagged: true` | `FLAGGED` | `deriveModerationState()` |
| `isApproved: false` (admin rejection) | `REJECTED` | `deriveModerationState()` |

## Known Mismatches (from research.md)

| Issue | Frontend (old) | Backend (correct) | Status |
|-------|---------------|-------------------|--------|
| Moderate HTTP method | `api.delete()` | `PATCH` | ✅ Fixed in `reviewApi.moderateReview()` |
| Admin reviews path | `/admin/reviews` | `/reviews/admin` | ✅ Fixed in `reviewApi.getAdminReviews()` |
| Modern `ReviewItem.status` enum | `PENDING/APPROVED/REJECTED/FLAGGED` | `isApproved` + `isFlagged` booleans | ✅ Fixed — new `Review` type uses booleans |

## Permission Mapping

| Endpoint | Required Role | Frontend Guard |
|----------|--------------|----------------|
| `POST /reviews` | customer | `ProtectedRoute` with `allowedRoles={['CUSTOMER']}` |
| `GET /reviews` | customer | Implicit via customer route group |
| `GET /reviews/provider` | provider | `ProtectedRoute` with `allowedRoles={['PROVIDER']}` |
| `GET /reviews/:id` | all | Middleware handles auth; component checks ownership |
| `PATCH /reviews/:id` | owner | Component-level ownership check |
| `DELETE /reviews/:id` | owner | Backend enforces |
| `POST /reviews/:id/flag` | all | Backend enforces |
| `PATCH /reviews/:id/moderate` | admin, super_admin | `ProtectedRoute` |
| `GET /reviews/admin` | admin, super_admin | `ProtectedRoute` |
| `GET /providers/:id/reviews` | none (public) | No guard |
| `GET /analytics/reviews` | admin, super_admin | Backend enforces |

## Required Fixes

1. **Admin moderation path**: Existing `supportApi.moderateReview()` uses `DELETE /admin/reviews/:id` with body. New `reviewApi.moderateReview()` uses correct `PATCH /reviews/:id/moderate`. Legacy code in `src/features/support/` should be deprecated.
2. **Admin reviews path**: Existing `supportApi.getReviews()` calls `GET /admin/reviews`. New `reviewApi.getAdminReviews()` calls `GET /reviews/admin`. Legacy code should be deprecated.
3. **Rating stats endpoint**: The provider rating statistics API endpoint (`GET /providers/:id/ratings`) was assumed based on research. If this endpoint does not exist, stats can be computed from `GET /providers/:id/reviews` response pagination meta.

## WebSocket Events

| Event | Frontend Handling | Status |
|-------|------------------|--------|
| `review.created` | `handleReviewNotification()` invalidates review caches | ⚠️ Wired (requires WebSocket connection) |
| `review.updated` | `handleReviewNotification()` invalidates review caches | ⚠️ Wired (requires WebSocket connection) |
| `review.moderated` | `handleReviewNotification()` invalidates review caches | ⚠️ Wired (requires WebSocket connection) |
