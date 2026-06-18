# Tracking API Contract

## Overview

Real-time tracking endpoints for active bookings. Extends the contract defined in `specs/009-booking-lifecycle-completion/contracts/tracking-api.md`. All endpoints and events are sourced from the backend Tracking Module.

## REST Endpoints (Frontend-Facing)

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

**Error** `404`: `{ "success": false, "error": "No tracking session found for this booking" }`

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

## Service Layer Methods (Frontend)

Add to `src/features/bookings/services/api.ts`:

```typescript
export const getTrackingSession = (bookingId: string): Promise<ApiResponse<TrackingSession>> =>
  api.get(`/tracking/${bookingId}`);

export const getTrackingEvents = (bookingId: string, since?: string): Promise<ApiResponse<TrackingEvent[]>> =>
  api.get(`/tracking/${bookingId}/events`, { params: { since } });
```
