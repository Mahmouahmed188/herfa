# Notifications API Contract (Booking-Related)

## Overview

Notification endpoints relevant to booking lifecycle events. Extends existing notifications feature.

## Endpoints

### `GET /notifications` — Get Customer Notifications

**Auth**: Bearer (Customer)
**Role**: Customer

**Query Parameters**:
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| page | number | No | Page number |
| limit | number | No | Items per page |
| type | string | No | Filter by notification type |
| unreadOnly | boolean | No | Only unread notifications |

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "id": "string (UUID)",
      "type": "BOOKING_CREATED | BOOKING_ACCEPTED | BOOKING_ASSIGNED | BOOKING_STARTED | BOOKING_COMPLETED | BOOKING_CANCELLED | BOOKING_UPDATE | ANNOUNCEMENT | PROMO | SYSTEM",
      "title": "string",
      "body": "string",
      "metadata": {
        "bookingId": "string (UUID) — optional"
      },
      "read": "boolean",
      "createdAt": "string (ISO 8601)"
    }
  ],
  "unreadCount": "number",
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### `PATCH /notifications/:id/read` — Mark Notification as Read

**Auth**: Bearer (Customer)

**Response** `200`:
```json
{
  "success": true
}
```

### `POST /notifications/read-all` — Mark All as Read

**Auth**: Bearer (Customer)

**Response** `200`:
```json
{
  "success": true
}
```

### `GET /notifications/unread-count` — Get Unread Count

**Auth**: Bearer (Customer)

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "count": "number"
  }
}
```

## Booking Notification Types

| Type | Trigger | Icon | Navigation |
|------|---------|------|------------|
| `BOOKING_CREATED` | Booking confirmed | CheckCircle | `/client/jobs/:bookingId` |
| `BOOKING_ACCEPTED` | Provider accepted | UserCheck | `/client/jobs/:bookingId` |
| `BOOKING_ASSIGNED` | Provider assigned | UserPlus | `/client/jobs/:bookingId` |
| `BOOKING_STARTED` | Work started | Play | `/client/jobs/:bookingId` |
| `BOOKING_COMPLETED` | Service delivered | CheckCircle | `/client/jobs/:bookingId` |
| `BOOKING_CANCELLED` | Booking cancelled | XCircle | `/client/jobs/:bookingId` |
