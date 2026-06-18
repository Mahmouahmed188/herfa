# Quickstart: Reviews & Ratings System

## Prerequisites

- Node.js 20+
- Running backend API at `http://localhost:3001/api/v1`
- Existing frontend setup (`npm install` completed)

## Development Setup

### 1. Verify Backend API is Running

```bash
curl http://localhost:3001/api/v1/reviews
# Expected: 401 (unauthorized) — confirms endpoint exists
```

### 2. Environment Variables

Ensure `.env.local` includes:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

### 3. Code Structure

The reviews feature module is at `src/features/reviews/`:

```
src/features/reviews/
├── services/
│   └── api.ts              # Axios-based API client
├── hooks/
│   ├── useReviews.ts        # TanStack Query hooks for review CRUD
│   ├── useReviewMutations.ts # Mutations for create/update/delete/flag
│   └── useRatingStats.ts    # Provider rating statistics hooks
├── components/
│   ├── ReviewForm.tsx        # Create/edit review form
│   ├── StarRating.tsx        # Interactive star rating input
│   ├── ReviewCard.tsx        # Single review display
│   ├── ReviewList.tsx        # Paginated review list with filters
│   ├── RatingSummary.tsx     # Average + distribution display
│   ├── ModerationBadge.tsx   # Moderation state badge
│   └── ReviewDashboard.tsx   # Provider review dashboard
├── schemas/
│   └── validation.ts        # Zod schemas
└── types/
    └── index.ts             # TypeScript interfaces
```

### 4. Pages

| Route | Portal | Purpose |
|-------|--------|---------|
| `/reviews` | Customer | My reviews history |
| `/reviews/new/[bookingId]` | Customer | Create review for booking |
| `/reviews/[reviewId]` | Customer | Review detail |
| `/reviews` | Provider | Review dashboard |
| `/reviews/[reviewId]` | Provider | Review detail (provider view) |
| `/admin/reviews` | Admin | Review moderation |

### 5. Running Checks

```bash
npm run lint          # Check code quality
npm run type-check    # Verify TypeScript
npm run test          # Run unit/component tests
```

## Key Design Decisions

1. **Backend API as source of truth**: All review endpoints, DTOs, and validation rules follow `PROJECT_API_DOCUMENTATION.md` and backend controller contracts.

2. **Feature-based module**: `src/features/reviews/` follows the same structure as `bookings/`, `providers/`, `support/`.

3. **TanStack Query**: All review server state managed via React Query with proper cache keys and invalidation.

4. **Zod validation**: All form inputs validated client-side before submission, matching backend DTO validation rules.

5. **Moderation state mapping**: Backend uses `isApproved` + `isFlagged` booleans; frontend maps to display states (PENDING, APPROVED, FLAGGED, REJECTED).

6. **Existing patterns**: Uses the same axios client (`src/lib/axios.ts`), notification system, and design components as other feature modules.
