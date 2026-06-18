# WebSocket Events — Reviews

## Notifications Namespace (`/notifications`)

Connection: Socket.io client connecting to `/notifications` namespace with JWT in `auth.token`.

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `notification` | `{ id, type, title, body, data, createdAt }` | New review-related notification |

### Review Notification Types

Backend fires `@nestjs/event-emitter` events that flow through the notification system:

| Event | `type` in Payload | `title` Example | `body` Example | Receiver |
|-------|-------------------|-----------------|----------------|----------|
| `review.created` | `review_created` | "New Review" | "Ahmed left a 5-star review" | Provider |
| `review.updated` | `review_updated` | "Review Updated" | "Ahmed updated their review" | Provider |
| `review.moderated` | `review_moderated` | "Review Moderated" | "Your review has been approved" | Customer |

### Frontend Integration

```typescript
// In the existing notification hook, review types are handled:
const notificationTypes = ['review_created', 'review_updated', 'review_moderated'];

// On receiving a review notification:
// 1. Show toast/notification in the UI
// 2. Invalidate relevant review query caches
// 3. Redirect on click to the relevant review or booking page
```

### Query Cache Invalidation on Notification

When a review notification is received via WebSocket, invalidate:
- `['reviews', 'list', ...]` — review lists
- `['reviews', 'detail', reviewId]` — review detail if applicable
- `['reviews', 'statistics', providerId]` — provider rating stats
