# Admin Reviews API Contract

Base path: `/api/v1/reviews` and `/api/v1/admin/reviews`

Authentication: JWT Bearer token with `admin` or `super_admin` role.

---

## GET `/reviews/admin` — List All Reviews for Moderation

**Auth**: JWT (admin, super_admin)

**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `status` (string, options: `all`, `pending`, `flagged`, default: `pending`)
- `sortBy` (string, default: `createdAt`)
- `sortOrder` (string, default: `DESC`)

**Success Response (200)**:
```json
{
  "data": [
    {
      "id": "uuid",
      "bookingId": "uuid",
      "customerId": "uuid",
      "providerId": "uuid",
      "rating": 3,
      "comment": "Average service.",
      "isApproved": false,
      "isFlagged": true,
      "customer": { "id": "uuid", "name": "Ahmed" },
      "provider": { "id": "uuid", "name": "Mohammed" },
      "createdAt": "2026-06-18T10:00:00.000Z",
      "updatedAt": "2026-06-18T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  },
  "timestamp": "2026-06-18T10:00:00.000Z"
}
```

---

## PATCH `/reviews/:id/moderate` — Moderate Review

Also available as: `PATCH /admin/reviews/:id/moderate`

**Auth**: JWT (admin, super_admin)

**Path Parameters**:
- `id`: Review UUID

**Request**:
```json
{
  "action": "APPROVED",
  "reason": "Review meets content guidelines"
}
```

**Validation**:
- `action`: enum, required — `APPROVED` or `REJECTED`
- `reason`: string, optional

**Success Response (200)**: Updated review object with new moderation state.

**Error Responses**:
- `400`: Invalid action
- `403`: Not authorized (requires admin/super_admin)
- `404`: Review not found

---

## GET `/analytics/reviews` — Review Analytics

**Auth**: JWT (admin, super_admin)

**Query Parameters**:
- `startDate` (ISO date, optional)
- `endDate` (ISO date, optional)

**Success Response (200)**:
```json
{
  "data": {
    "averageRating": 4.2,
    "totalReviews": 150,
    "ratingDistribution": { "1": 5, "2": 8, "3": 22, "4": 45, "5": 70 },
    "trendData": [
      { "date": "2026-06-01", "count": 12, "average": 4.1 },
      { "date": "2026-06-02", "count": 8, "average": 4.3 }
    ]
  },
  "timestamp": "..."
}
```
