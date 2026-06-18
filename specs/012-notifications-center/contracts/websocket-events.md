# WebSocket Events Contract

**Namespace**: `/notifications` (Socket.io)

**Authentication**: JWT token passed as `auth.token` on connection. Token should include `Bearer` prefix.

**Transport**: WebSocket with long-polling fallback.

---

## Connection

```javascript
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_WS_URL + '/notifications', {
  auth: { token: 'Bearer <jwt_token>' },
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 10000,
});
```

---

## Server → Client Events

### notification

Emitted when a new notification is created for the connected user.

**Payload**:

```json
{
  "id": "uuid",
  "type": "BOOKING_CREATED",
  "title": "New Booking Request",
  "body": "A new booking has been created by Ahmed.",
  "data": {
    "bookingId": "uuid"
  },
  "createdAt": "2026-06-18T10:00:00Z"
}
```

**Client handling**:

```javascript
socket.on('notification', (payload) => {
  // Invalidate notification queries to refetch list
  queryClient.invalidateQueries({ queryKey: ['notifications'] });
  queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
});
```

### unread-count

Emitted when the user's unread count changes.

**Payload**:

```json
{
  "count": 7
}
```

**Client handling**:

```javascript
socket.on('unread-count', (payload) => {
  queryClient.setQueryData(['notifications', 'unread-count'], { count: payload.count });
});
```

---

## Client → Server Events

### mark-read

Notify the server that a notification was read via another client (cross-device sync).

**Payload**:

```json
{
  "notificationId": "uuid"
}
```

---

## Error Handling

### connection_error

```javascript
socket.on('connect_error', (error) => {
  console.error('WebSocket connection failed:', error.message);
  // Fall back to polling — the TanStack Query refetchInterval will handle this
});
```

### disconnect

```javascript
socket.on('disconnect', (reason) => {
  if (reason === 'io server disconnect') {
    // Reconnect manually if needed
    socket.connect();
  }
});
```

## Reconnection Strategy

| Setting | Value | Description |
|---------|-------|-------------|
| `reconnection` | `true` | Enable auto-reconnect |
| `reconnectionAttempts` | `10` | Max reconnection attempts |
| `reconnectionDelay` | `1000ms` | Initial delay |
| `reconnectionDelayMax` | `10000ms` | Maximum delay (exponential backoff) |

## Fallback Strategy

If WebSocket connection fails or is unavailable:
- Continue using existing 30-second polling via TanStack Query `refetchInterval`.
- The `useUnreadCount()` hook already implements `refetchInterval: 30000`.
- Attempt WebSocket reconnection silently with exponential backoff.
- Do not show connection errors to the user — degrade gracefully.
