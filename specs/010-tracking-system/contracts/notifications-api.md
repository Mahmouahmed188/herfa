# Notifications API Contract (Tracking)

## Overview

Tracking notification types extending the existing booking notification system defined in `specs/009-booking-lifecycle-completion/contracts/notifications-api.md`.

## New Notification Types

| Type | Trigger Event | Audience | Icon | Navigation |
|------|---------------|----------|------|------------|
| `TRACKING_STARTED` | Provider starts route | Customer | Navigation | `/client/tracking/:bookingId` |
| `TRACKING_PAUSED` | Provider pauses tracking | Customer | PauseCircle | `/client/tracking/:bookingId` |
| `TRACKING_RESUMED` | Provider resumes tracking | Customer | PlayCircle | `/client/tracking/:bookingId` |
| `TRACKING_ARRIVED` | Provider arrives at location | Customer | MapPin | `/client/tracking/:bookingId` |

## Frontend Endpoints (Reuse Existing)

| Endpoint | Method | Service | Purpose |
|----------|--------|---------|---------|
| `/notifications` | GET | `src/services/api.ts` | Get user notifications (includes tracking types) |
| `/notifications/:id/read` | PATCH | `src/services/api.ts` | Mark notification as read |
| `/notifications/read-all` | POST | `src/services/api.ts` | Mark all as read |
| `/notifications/unread-count` | GET | `src/services/api.ts` | Get unread count |

## Frontend Type Updates

### Notification Type Union (Updated)

In `src/features/notifications/types/index.ts`:

```typescript
export type CustomerNotificationType = 
  | 'BOOKING_UPDATE' | 'BOOKING_CREATED' | 'BOOKING_ACCEPTED' 
  | 'BOOKING_ASSIGNED' | 'BOOKING_STARTED' | 'BOOKING_COMPLETED' 
  | 'BOOKING_CANCELLED' 
  | 'TRACKING_STARTED' | 'TRACKING_PAUSED' | 'TRACKING_RESUMED' | 'TRACKING_ARRIVED'
  | 'ANNOUNCEMENT' | 'PROMO' | 'SYSTEM';
```

### Notification Filtering Update

In `src/features/notifications/hooks/useBookingNotifications.ts`:

```typescript
const BOOKING_NOTIFICATION_TYPES = [
  'BOOKING_CREATED', 'BOOKING_ACCEPTED', 'BOOKING_ASSIGNED',
  'BOOKING_STARTED', 'BOOKING_COMPLETED', 'BOOKING_CANCELLED', 'BOOKING_UPDATE',
  'TRACKING_STARTED', 'TRACKING_PAUSED', 'TRACKING_RESUMED', 'TRACKING_ARRIVED',
];
```

### Navigation Update

- Tracking notifications navigate to `/client/tracking/:bookingId` instead of `/client/jobs/:bookingId`
- The `useBookingNotifications` hook should differentiate based on notification type
