# Jobs API Contract

## Overview

Job-related endpoints for customer and provider workflows. Jobs serve as the execution layer for bookings.

## Endpoints

### `GET /jobs/my-jobs` — Get Customer Jobs

**Auth**: Bearer (Customer)
**Role**: Customer

**Query Parameters**:
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| sort | string | No | Sort order (`-createdAt`, `createdAt`) |
| status | string | No | Filter by status |

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "id": "string (UUID)",
      "title": "string — optional",
      "description": "string — optional",
      "status": "PENDING | ACCEPTED | ASSIGNED | IN_PROGRESS | ON_THE_WAY | COMPLETED | CANCELLED | DISPUTED",
      "service": {
        "id": "string",
        "name": "string",
        "category": "string — optional"
      },
      "provider": {
        "id": "string",
        "name": "string",
        "phone": "string — optional",
        "avatarUrl": "string — optional",
        "rating": "number — optional"
      },
      "address": "string — optional",
      "scheduledAt": "string (ISO 8601) — optional",
      "amount": "number — optional",
      "payment": {
        "status": "PAID | UNPAID | REFUNDED",
        "method": "string — optional",
        "paidAt": "string (ISO 8601) — optional"
      },
      "tracking": {
        "available": "boolean",
        "eta": "string (ISO 8601) — optional",
        "providerLatitude": "number — optional",
        "providerLongitude": "number — optional",
        "lastUpdated": "string (ISO 8601) — optional"
      },
      "timeline": [
        {
          "status": "string",
          "timestamp": "string (ISO 8601)",
          "note": "string — optional"
        }
      ],
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

---

### `POST /jobs` — Create Job

**Auth**: Bearer (Customer)
**Role**: Customer

**Request Body**:
```json
{
  "title": "string",
  "description": "string",
  "categoryId": "string (UUID)",
  "latitude": "number",
  "longitude": "number",
  "address": "string — optional",
  "budget": "number — optional",
  "scheduledDate": "string (ISO 8601) — optional"
}
```

**Response** `201`:
```json
{
  "success": true,
  "data": {
    "id": "string (UUID)",
    "status": "PENDING",
    "createdAt": "string (ISO 8601)"
  }
}
```

---

### `GET /jobs/:id` — Get Job By ID

**Auth**: Bearer (Customer, Provider, Admin)
**Role**: Job owner, assigned provider, or admin

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "id": "string (UUID)",
    "title": "string — optional",
    "description": "string — optional",
    "status": "BookingStatus",
    "categoryId": "string (UUID) — optional",
    "latitude": "number — optional",
    "longitude": "number — optional",
    "address": "string — optional",
    "budget": "number — optional",
    "scheduledDate": "string (ISO 8601) — optional",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

---

### `POST /jobs/:id/cancel` — Cancel Job

**Auth**: Bearer (Customer)
**Role**: Job owner

**Request Body**:
```json
{
  "reason": "string — optional"
}
```

---

### `GET /jobs/assigned` — Get Provider's Assigned Jobs

**Auth**: Bearer (Provider)
**Role**: Provider

**Response** `200`: Array of job objects with provider assignment info.

---

### `GET /jobs/available` — Get Available Jobs Near Location

**Auth**: Bearer (Provider)
**Role**: Provider

**Query Parameters**:
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| latitude | number | Yes | Provider's latitude |
| longitude | number | Yes | Provider's longitude |
| radiusKm | number | No | Search radius in km |

---

### `POST /jobs/assignments/accept` — Accept Job Assignment

**Auth**: Bearer (Provider)
**Role**: Provider

**Request Body**:
```json
{
  "assignmentId": "string (UUID)",
  "quotedPrice": "number — optional"
}
```

---

### `POST /jobs/assignments/:id/reject` — Reject Job Assignment

**Auth**: Bearer (Provider)
**Role**: Provider

**Request Body**:
```json
{
  "rejectionReason": "string — optional"
}
```

---

### `POST /jobs/:id/status` — Update Job Status

**Auth**: Bearer (Provider)
**Role**: Provider (assigned)

**Request Body**:
```json
{
  "status": "ACCEPTED | ON_THE_WAY | IN_PROGRESS | COMPLETED"
}
```

**Validation**: Provider cannot skip statuses (e.g., must be ACCEPTED before ON_THE_WAY, must be ON_THE_WAY before IN_PROGRESS).

---

### `GET /admin/jobs` — Get All Jobs (Admin)

**Auth**: Bearer (Admin)
**Role**: Admin

**Response** `200`: Array of all jobs with user and provider info.
