# Provider Ratings API Contract

Base path: `/api/v1`

Authentication: JWT Bearer token for authenticated requests; public access allowed for read-only review display.

---

## GET `/providers/{providerId}/reviews` — Public Provider Reviews

**Auth**: Optional (JWT). Unauthenticated users can access; authenticated users see reviewer details.

**Path Parameters**:
- `providerId`: Provider UUID

**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `sortBy` (string, options: `createdAt`, `rating`, default: `createdAt`)
- `sortOrder` (string, options: `ASC`, `DESC`, default: `DESC`)

**Business Rules**:
- Only returns approved reviews (`isApproved === true`)
- Unauthenticated requests: reviewer name shown, email/phone hidden
- Authenticated requests: full reviewer info shown

**Success Response (200)**:
```json
{
  "data": [
    {
      "id": "uuid",
      "bookingId": "uuid",
      "customerId": "uuid",
      "providerId": "uuid",
      "rating": 5,
      "comment": "Excellent work!",
      "isApproved": true,
      "isFlagged": false,
      "customer": { "id": "uuid", "name": "Ahmed" },
      "createdAt": "2026-06-18T10:00:00.000Z",
      "updatedAt": "2026-06-18T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  },
  "timestamp": "..."
}
```

## Provider Rating Statistics

Rating statistics are derived from `ProviderRatingStats` database entity. They can be:
1. Included in the provider profile/listing response (recommended integration point)
2. Computed client-side from `GET /providers/{id}/reviews` paginated data
3. Retrieved via a dedicated endpoint (not currently documented — verify with backend team)

**Derived Shape — Rating Summary**:
```json
{
  "providerId": "uuid",
  "averageRating": 4.2,
  "totalReviews": 42,
  "totalBookings": 85,
  "ratingDistribution": {
    "1": 2,
    "2": 3,
    "3": 8,
    "4": 15,
    "5": 14
  }
}
```
