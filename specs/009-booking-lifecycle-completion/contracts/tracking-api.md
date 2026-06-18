# Tracking API Contract

## Overview

Real-time tracking endpoints for active bookings. Supports both REST polling and WebSocket for live updates.

## REST Endpoints

### `GET /tracking/:bookingId` — Get Tracking Session

**Auth**: Bearer (Customer, Provider)
**Role**: Booking owner or assigned provider

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "id": "string (UUID)",
    "bookingId": "string (UUID)",
    "status": "ACTIVE | PAUSED | COMPLETED | NOT_STARTED",
    "providerLatitude": "number — nullable",
    "providerLongitude": "number — nullable",
    "eta": "string (ISO 8601) — nullable",
    "lastUpdated": "string (ISO 8601) — nullable",
    "startedAt": "string (ISO 8601) — nullable",
    "endedAt": "string (ISO 8601) — nullable"
  }
}
```

**Response** `404`:
```json
{
  "success": false,
  "error": "No tracking session found for this booking"
}
```

---

### `GET /tracking/:bookingId/events` — Get Tracking Events

**Auth**: Bearer (Customer, Provider)
**Role**: Booking owner or assigned provider

**Query Parameters**:
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| since | string (ISO 8601) | No | Only return events after this timestamp |

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "id": "string (UUID)",
      "type": "STATUS_CHANGE | LOCATION_UPDATE | MILESTONE | ETA_UPDATE",
      "title": "string",
      "description": "string",
      "timestamp": "string (ISO 8601)",
      "metadata": {
        "latitude": "number — optional",
        "longitude": "number — optional",
        "eta": "string (ISO 8601) — optional"
      }
    }
  ]
}
```

---

## WebSocket Contract

**Endpoint**: `wss://api.example.com/ws/tracking/:bookingId`

**Auth**: Token query parameter (`?token=jwt_token_here`)

### Client → Server Messages

```json
{
  "type": "SUBSCRIBE",
  "bookingId": "string (UUID)"
}
```

### Server → Client Messages

**Location Update**:
```json
{
  "type": "LOCATION_UPDATE",
  "bookingId": "string (UUID)",
  "latitude": "number",
  "longitude": "number",
  "timestamp": "string (ISO 8601)"
}
```

**Status Change**:
```json
{
  "type": "STATUS_CHANGE",
  "bookingId": "string (UUID)",
  "status": "ON_THE_WAY | IN_PROGRESS | COMPLETED",
  "timestamp": "string (ISO 8601)"
}
```

**ETA Update**:
```json
{
  "type": "ETA_UPDATE",
  "bookingId": "string (UUID)",
  "eta": "string (ISO 8601)",
  "timestamp": "string (ISO 8601)"
}
```

**Error**:
```json
{
  "type": "ERROR",
  "code": "AUTH_FAILED | INVALID_BOOKING",
  "message": "string"
}
```
