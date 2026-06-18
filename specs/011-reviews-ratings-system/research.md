# Research: Reviews & Ratings System

## API Discovery Findings

Source: `PROJECT_API_DOCUMENTATION.md` (backend API specification)

### 4.10 Reviews & Ratings API — Base `/api/v1/reviews`

| Method | Endpoint | Auth | Roles | Purpose |
|--------|----------|------|-------|---------|
| POST | `/reviews` | JWT | customer | Create review |
| GET | `/reviews` | JWT | customer | List own reviews (paginated) |
| GET | `/reviews/provider` | JWT | provider | List reviews about me |
| GET | `/reviews/:id` | JWT | All | Get review by ID |
| PATCH | `/reviews/:id` | JWT | owner | Update own review |
| DELETE | `/reviews/:id` | JWT | owner | Delete own review |
| POST | `/reviews/:id/flag` | JWT | All | Flag review as inappropriate |
| PATCH | `/reviews/:id/moderate` | JWT | admin, super_admin | Moderate review (approve/reject) |
| GET | `/reviews/admin` | JWT | admin, super_admin | List all reviews for moderation |

### 4.16 Admin Dashboard — Alternate Admin Review Paths

| Method | Endpoint | Auth | Roles | Purpose |
|--------|----------|------|-------|---------|
| GET | `/admin/reviews` | JWT | admin, super_admin | List all reviews |
| PATCH | `/admin/reviews/:id/moderate` | JWT | admin, super_admin | Moderate review |

### 4.17 Analytics

| Method | Endpoint | Auth | Roles | Purpose |
|--------|----------|------|-------|---------|
| GET | `/analytics/reviews` | JWT | admin, super_admin | Review analytics (averages, trends) |

### Review DTO — Create Review (POST `/reviews`)

**Request:**
```json
{
  "bookingId": "uuid",
  "providerId": "uuid",
  "rating": 5,
  "comment": "Excellent service! Very professional."
}
```

**Validation Rules:**
- `rating`: 1-5 (integer)
- `bookingId`: Must be a completed booking by this customer
- `providerId`: Must be the provider for that booking
- One review per booking (duplicate prevention)

**Business Rules:**
- On creation, recalculates ProviderRatingStats
- Reviews can be flagged for moderation
- Admin can approve or reject flagged reviews
- Only visible if `isApproved = true`

### Database Entities

**Review** (`reviews`):
- `id` (UUID PK)
- `bookingId` (FK → bookings)
- `customerId` (FK → users)
- `providerId` (FK → users)
- `rating` (integer, 1-5)
- `comment` (text)
- `isApproved` (boolean)
- `isFlagged` (boolean)
- `createdAt`, `updatedAt` (timestamps)

**ProviderRatingStats** (`provider_rating_stats`):
- `id` (UUID PK)
- `providerId` (FK → users)
- `averageRating` (decimal)
- `totalReviews` (integer)
- `totalBookings` (integer)

**ModerationLog** (`moderation_logs`):
- `id` (UUID PK)
- `action` (string)
- `entityType` (string)
- `entityId` (UUID)
- `moderatorId` (FK → users)
- `reason` (text)
- `notes` (text)

### Notification Events (Section 4.11)

Review-related event via `@nestjs/event-emitter`:
- `review.created` → notification to provider

### Existing Frontend Review Integration

| File | Endpoint | Notes |
|------|----------|-------|
| `src/services/api.ts` | `GET /providers/{providerId}/reviews` | Public provider reviews, used in search results |
| `src/features/support/services/api.ts` | `GET /admin/reviews` | Admin review list (misaligned: docs say `/reviews/admin`) |
| `src/features/support/services/api.ts` | `DELETE /admin/reviews/:id` | Moderate review (misaligned: docs say `PATCH /admin/reviews/:id/moderate`) |
| `src/features/support/hooks/useSupport.ts` | `useReviews()`, `useModerateReview()` | TanStack Query hooks under `'support'` key |

### Alignment Issues (from `docs/frontend-api-alignment-report.md`)

| Issue | Frontend | Backend (per docs) | Severity |
|-------|----------|--------------------|----------|
| Wrong HTTP method for moderate | `api.delete()` with body | `PATCH /admin/reviews/:id/moderate` | Low |
| Wrong path for admin reviews | `GET /admin/reviews` | `GET /reviews/admin` | Medium |
| DTO field mismatch | `ReviewItem.status` enum | `isApproved` + `isFlagged` booleans | Medium |

## Decisions

| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
| Use backend docs as source of truth for endpoint paths/methods | User explicitly states "Do not modify backend code" | Use existing frontend patterns (would perpetuate mismatches) |
| Create `src/features/reviews/` module | Follows constitution Principle II (Feature-Based Modularity) | Add to existing `src/features/support/` (would violate modularity) |
| Use axios-based client for new review APIs | Existing feature modules use axios; consistent with src/lib/axios.ts | Use legacy fetch-based api.ts (inconsistent with feature module pattern) |
| Normalize moderation state to match backend booleans | Backend uses `isApproved` + `isFlagged`; must map to UI display states | Keep frontend `status` enum (would perpetuate DTO mismatch) |
| Provider rating stats from review creation recalculation | No dedicated rating stats endpoint documented; data available via review list aggregation | Assume a dedicated stats endpoint exists (not documented) |
| Review notification via existing notifications WebSocket | `review.created` event documented; existing `/notifications` Socket.io namespace | Create separate WebSocket channel (unnecessary) |
