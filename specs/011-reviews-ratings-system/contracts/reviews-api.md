# Reviews API Contract

Base path: `/api/v1/reviews`

Authentication: JWT Bearer token via `Authorization: Bearer <token>` header.

---

## POST `/reviews` — Create Review

**Auth**: JWT (customer role)

**Request**:
```json
{
  "bookingId": "550e8400-e29b-41d4-a716-446655440000",
  "providerId": "550e8400-e29b-41d4-a716-446655440001",
  "rating": 5,
  "comment": "Excellent service! Very professional."
}
```

**Validation**:
- `rating`: number, 1-5 (integer), required
- `comment`: string, optional
- `bookingId`: UUID, must be a completed booking by this customer
- `providerId`: UUID, must be the provider for that booking
- One review per booking (duplicate prevention enforced by backend)

**Success Response (201)**:
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "bookingId": "550e8400-e29b-41d4-a716-446655440000",
    "customerId": "550e8400-e29b-41d4-a716-446655440003",
    "providerId": "550e8400-e29b-41d4-a716-446655440001",
    "rating": 5,
    "comment": "Excellent service! Very professional.",
    "isApproved": false,
    "isFlagged": false,
    "createdAt": "2026-06-18T10:00:00.000Z",
    "updatedAt": "2026-06-18T10:00:00.000Z"
  },
  "timestamp": "2026-06-18T10:00:00.000Z"
}
```

**Error Responses**:
- `400`: Validation error (invalid rating, duplicate review, booking not completed)
- `401`: Unauthenticated
- `403`: Not a customer

---

## GET `/reviews` — List Own Reviews (Customer)

**Auth**: JWT (customer role)

**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `sortBy` (string, options: `createdAt`, `rating`)
- `sortOrder` (string, options: `ASC`, `DESC`, default: `DESC`)

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
      "comment": "Excellent service!",
      "isApproved": true,
      "isFlagged": false,
      "createdAt": "2026-06-18T10:00:00.000Z",
      "updatedAt": "2026-06-18T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "timestamp": "2026-06-18T10:00:00.000Z"
}
```

---

## GET `/reviews/provider` — List Reviews About Me (Provider)

**Auth**: JWT (provider role)

**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `sortBy` (string, options: `createdAt`, `rating`)
- `sortOrder` (string, options: `ASC`, `DESC`, default: `DESC`)

**Success Response (200)**: Same shape as customer list, but filtered by `providerId` matching authenticated provider.

---

## GET `/reviews/:id` — Get Review by ID

**Auth**: JWT (all roles)

**Path Parameters**:
- `id`: Review UUID

**Success Response (200)**: Single review object (same shape as array item above).

**Error Responses**:
- `404`: Review not found

---

## PATCH `/reviews/:id` — Update Own Review

**Auth**: JWT (owner — original reviewer)

**Path Parameters**:
- `id`: Review UUID

**Request**:
```json
{
  "rating": 4,
  "comment": "Updated feedback after follow-up service."
}
```

**Validation**:
- Only `rating` and `comment` can be updated
- Rating must be 1-5
- Ownership verified by backend

**Success Response (200)**: Updated review object.

**Error Responses**:
- `400`: Validation error
- `403`: Not the owner
- `404`: Review not found

---

## DELETE `/reviews/:id` — Delete Own Review

**Auth**: JWT (owner — original reviewer)

**Path Parameters**:
- `id`: Review UUID

**Success Response (200)**:
```json
{
  "data": { "message": "Review deleted successfully" },
  "timestamp": "..."
}
```

---

## POST `/reviews/:id/flag` — Flag Review as Inappropriate

**Auth**: JWT (all roles)

**Path Parameters**:
- `id`: Review UUID

**Success Response (200)**:
```json
{
  "data": { "message": "Review flagged for moderation" },
  "timestamp": "..."
}
```
