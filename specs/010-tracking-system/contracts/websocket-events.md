# WebSocket Events Contract

## Overview

WebSocket event contracts for the Tracking Gateway. The frontend uses the native browser `WebSocket` API (not Socket.IO) to connect to the backend gateway.

## Connection

**Endpoint**: `{NEXT_PUBLIC_WS_URL}/tracking/:bookingId?token={jwt}`
**Protocol**: Native WebSocket (no sub-protocol)
**Auth**: JWT token passed as query parameter

## Connection Lifecycle

```
Client                          Server
  │                               │
  │── open WebSocket ────────────→│
  │                               │── authenticate via ?token=
  │←──── connection established ──│
  │                               │
  │── {"type":"SUBSCRIBE",        │
  │    "bookingId":"..."} ────────→│
  │                               │── subscribe to booking channel
  │←─── LOCATION_UPDATE ──────────│
  │←─── STATUS_CHANGE ────────────│
  │←─── ETA_UPDATE ───────────────│
  │                               │
  │── close (client or network) ─→│
  │                               │── cleanup subscription
```

## Client → Server Messages

### Subscribe

```json
{
  "type": "SUBSCRIBE",
  "bookingId": "string (UUID)"
}
```

Sent immediately after WebSocket `onopen`. Subscribes to all tracking events for the given booking.

## Server → Client Messages

### Location Update

```json
{
  "type": "LOCATION_UPDATE",
  "bookingId": "string (UUID)",
  "latitude": "number",
  "longitude": "number",
  "timestamp": "string (ISO 8601)"
}
```

**Frontend action**: Update `session.providerLatitude`, `session.providerLongitude`, `session.lastUpdated`. Invalidate tracking query cache.

### Status Change

```json
{
  "type": "STATUS_CHANGE",
  "bookingId": "string (UUID)",
  "status": "ON_THE_WAY | IN_PROGRESS | COMPLETED",
  "timestamp": "string (ISO 8601)"
}
```

**Frontend action**: Update `session.status`. If `COMPLETED`, stop WebSocket polling. If relevant, trigger booking status reflection.

### ETA Update

```json
{
  "type": "ETA_UPDATE",
  "bookingId": "string (UUID)",
  "eta": "string (ISO 8601)",
  "timestamp": "string (ISO 8601)"
}
```

**Frontend action**: Update `session.eta`.

### Error

```json
{
  "type": "ERROR",
  "code": "AUTH_FAILED | INVALID_BOOKING",
  "message": "string"
}
```

**Frontend action**: Display error toast. Close WebSocket connection if `AUTH_FAILED`.

## Frontend Implementation (useTracking.ts `onmessage`)

```typescript
ws.onmessage = (event: MessageEvent) => {
  try {
    const message = JSON.parse(event.data);
    switch (message.type) {
      case 'LOCATION_UPDATE':
        setSession(prev => prev ? {
          ...prev,
          providerLatitude: message.latitude,
          providerLongitude: message.longitude,
          lastUpdated: message.timestamp,
        } : prev);
        break;
      case 'STATUS_CHANGE':
        setSession(prev => prev ? {
          ...prev,
          status: message.status === 'ON_THE_WAY' ? 'ACTIVE' 
                : message.status === 'COMPLETED' ? 'COMPLETED'
                : prev.status,
        } : prev);
        break;
      case 'ETA_UPDATE':
        setSession(prev => prev ? {
          ...prev,
          eta: message.eta,
        } : prev);
        break;
      case 'ERROR':
        toast.error(message.message);
        break;
    }
  } catch {
    // Ignore malformed messages
  }
};
```

## Reconnection Strategy

**Already implemented** in `useTracking.ts`:
- On `onclose`: schedule reconnect in 5 seconds
- On reconnect: re-establish WebSocket, re-send `SUBSCRIBE`
- REST polling (15s session, 10s events) serves as fallback when WebSocket is disconnected
