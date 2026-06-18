# Booking API Contract

## Overview

All booking-related API endpoints for customer and provider workflows. Base path: `/api/v1`

## Endpoints

### `POST /bookings` — Create Booking

**Auth**: Bearer (Customer)
**Role**: Customer

**Request Body**:
```json
{
  "serviceListingId": "string (UUID)",
  "providerId": "string (UUID) — optional, null for auto-assignment",
  "scheduledDate": "string (ISO 8601)",
  "description": "string (optional)",
  "location": {
    "address": "string",
    "latitude": "number",
    "longitude": "number"
  }
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

**Validation Errors** `400`:
```json
{
  "success": false,
  "errors": {
    "serviceListingId": "Service listing is required",
    "scheduledDate": "Scheduled date must be in the future",
    "location.address": "Address is required"
  }
}
```

---

### `GET /bookings/:id` — Get Booking Details

**Auth**: Bearer (Customer, Provider, Admin)
**Role**: Booking owner, assigned provider, or admin

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "id": "string (UUID)",
    "userId": "string (UUID)",
    "userName": "string",
    "providerId": "string (UUID) — nullable",
    "providerName": "string — nullable",
    "serviceId": "string (UUID)",
    "serviceName": "string",
    "categoryId": "string (UUID) — optional",
    "status": "PENDING | ACCEPTED | ASSIGNED | IN_PROGRESS | ON_THE_WAY | COMPLETED | CANCELLED | DISPUTED",
    "address": "string — optional",
    "latitude": "number — optional",
    "longitude": "number — optional",
    "description": "string — optional",
    "notes": "string — optional",
    "amount": "number — optional",
    "scheduledAt": "string (ISO 8601) — optional",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

---

### `GET /bookings/:id/timeline` — Get Booking Timeline

**Auth**: Bearer (Customer, Provider, Admin)
**Role**: Booking owner, assigned provider, or admin

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "id": "string (UUID)",
      "type": "STATUS_CHANGE | PROVIDER_ASSIGNED | PROVIDER_ACCEPTED | PROVIDER_REJECTED | TRACKING_STARTED | LOCATION_UPDATED | CANCELLED | COMPLETED | PAYMENT | DISPUTE | MESSAGE",
      "status": "BookingStatus — optional",
      "title": "string",
      "description": "string",
      "actor": "string — optional",
      "timestamp": "string (ISO 8601)",
      "metadata": {}
    }
  ]
}
```

---

### `POST /bookings/:id/cancel` — Cancel Booking

**Auth**: Bearer (Customer)
**Role**: Booking owner

**Request Body**:
```json
{
  "reason": "string (optional)"
}
```

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "id": "string (UUID)",
    "status": "CANCELLED",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Error** `400` (invalid cancellation):
```json
{
  "success": false,
  "error": "Cannot cancel a booking in COMPLETED status"
}
```

---

### `POST /bookings/:id/resolve-dispute` — Resolve Dispute

**Auth**: Bearer (Admin)
**Role**: Admin

**Request Body**:
```json
{
  "action": "REFUND | RELEASE",
  "notes": "string"
}
```

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "id": "string (UUID)",
    "status": "COMPLETED | CANCELLED",
    "updatedAt": "string (ISO 8601)"
  }
}
```
