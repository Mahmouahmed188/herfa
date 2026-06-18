# Data Model: Notifications Center

## Entities

### UserNotification

Represents a single notification directed at a specific user.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` (UUID) | Yes | Primary key |
| `userId` | `string` (UUID) | Yes | Recipient user (FK → users) |
| `type` | `NotificationType` | Yes | Notification type (see enum below) |
| `title` | `string` | Yes | Notification title |
| `body` | `string` | Yes | Notification message body |
| `isRead` | `boolean` | Yes | Read status |
| `channel` | `string` | Yes | Delivery channel: `in_app` or `push` |
| `data` | `Record<string, any>` | No | Metadata payload (deep link context) |
| `createdAt` | `string` (ISO 8601) | Yes | Creation timestamp |
| `updatedAt` | `string` (ISO 8601) | Yes | Last update timestamp |

### NotificationType

Union of all supported notification categories:

```typescript
type CustomerNotificationType =
  | 'BOOKING_CREATED'
  | 'BOOKING_ACCEPTED'
  | 'BOOKING_ASSIGNED'
  | 'BOOKING_STARTED'
  | 'BOOKING_COMPLETED'
  | 'BOOKING_CANCELLED'
  | 'BOOKING_UPDATE'
  | 'TRACKING_STARTED'
  | 'TRACKING_PAUSED'
  | 'TRACKING_RESUMED'
  | 'TRACKING_ARRIVED'
  | 'ANNOUNCEMENT'
  | 'PROMO'
  | 'SYSTEM';

type VerificationNotificationType =
  | 'VERIFICATION_SUBMITTED'
  | 'VERIFICATION_APPROVED'
  | 'VERIFICATION_REJECTED'
  | 'VERIFICATION_SUSPENDED'
  | 'DOCUMENTS_REQUESTED';

type PaymentNotificationType =
  | 'PAYMENT_CREATED'
  | 'PAYMENT_CONFIRMED'
  | 'REFUND_CREATED'
  | 'REFUND_APPROVED'
  | 'REFUND_REJECTED';

type ReviewNotificationType =
  | 'REVIEW_CREATED'
  | 'REVIEW_UPDATED'
  | 'REVIEW_MODERATED';

type SupportNotificationType =
  | 'TICKET_CREATED'
  | 'TICKET_UPDATED'
  | 'NEW_REPLY'
  | 'TICKET_RESOLVED'
  | 'DISPUTE_UPDATED'
  | 'DISPUTE_RESOLVED';

type NotificationType =
  | CustomerNotificationType
  | VerificationNotificationType
  | PaymentNotificationType
  | ReviewNotificationType
  | SupportNotificationType;
```

### NotificationPayload

Data payload carried inside a notification for deep link navigation.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bookingId` | `string` | No | Links to booking details page |
| `paymentId` | `string` | No | Links to payment details page |
| `reviewId` | `string` | No | Links to review details page |
| `trackingId` | `string` | No | Links to tracking page |
| `verificationId` | `string` | No | Links to verification status page |
| `ticketId` | `string` | No | Links to support ticket |
| `disputeId` | `string` | No | Links to dispute details |
| `announcementId` | `string` | No | Links to announcement details |
| `url` | `string` | No | Direct URL for custom navigation |

### Announcement

Represents a platform-wide broadcast message.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` (UUID) | Yes | Primary key |
| `title` | `string` | Yes | Announcement title |
| `body` | `string` | Yes | Announcement content |
| `type` | `'PUSH' \| 'SMS' \| 'EMAIL'` | Yes | Delivery channel |
| `target` | `'ALL' \| 'CLIENTS' \| 'PROVIDERS'` | Yes | Target audience |
| `status` | `'SENT' \| 'SCHEDULED' \| 'DRAFT'` | Yes | Publication status |
| `sentCount` | `number` | No | Number of recipients |
| `scheduledAt` | `string` (ISO 8601) | No | Scheduled send time |
| `createdAt` | `string` (ISO 8601) | Yes | Creation timestamp |
| `updatedAt` | `string` (ISO 8601) | Yes | Last update timestamp |

### NotificationTemplate

Reusable template for admin-created notifications.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` (UUID) | Yes | Primary key |
| `name` | `string` | Yes | Template name |
| `subject` | `string` | Yes | Notification subject line |
| `body` | `string` | Yes | Notification body with placeholders |
| `channel` | `'PUSH' \| 'SMS' \| 'EMAIL'` | Yes | Delivery channel |
| `placeholders` | `string` | No | Comma-separated placeholder names |
| `createdAt` | `string` (ISO 8601) | Yes | Creation timestamp |
| `updatedAt` | `string` (ISO 8601) | Yes | Last update timestamp |

## State Transitions

### Notification Read Status

```
Unread → Read  (via mark-single or mark-all action)
```

- Unread → Read: User clicks notification, clicks "Mark read" button, or uses "Mark all as read"
- Read: Terminal state (no transition back to unread from backend)

### Announcement Status

```
Draft → Scheduled → Sent
Draft → Sent (immediate send)
```

- Draft: Created but not yet published
- Scheduled: Queued for future publication
- Sent: Published to target audience (terminal state)

## Validation Rules

- `title`: 1-255 characters, required
- `body`: 1-5000 characters, required
- `type`: Must be a valid `NotificationType` value
- `isRead`: Boolean, defaults to `false`
- Pagination: Must support `page` and `limit` parameters
- Mark-read: Bulk operation accepts array of notification IDs (max 100 per request)

## Deep Link Routing Map

| Notification Type | Deep Link Pattern | Target Page |
|-------------------|-------------------|-------------|
| BOOKING_CREATED, BOOKING_ACCEPTED, BOOKING_ASSIGNED, BOOKING_STARTED, BOOKING_COMPLETED, BOOKING_CANCELLED, BOOKING_UPDATE | `/client/jobs/[bookingId]` or `/technician/jobs/[bookingId]` | Booking details |
| TRACKING_STARTED, TRACKING_PAUSED, TRACKING_RESUMED, TRACKING_ARRIVED | `/client/tracking/[trackingId]` | Tracking page |
| PAYMENT_CREATED, PAYMENT_CONFIRMED, REFUND_CREATED, REFUND_APPROVED, REFUND_REJECTED | `/client/wallet` or `/admin/finance` | Payment details |
| REVIEW_CREATED, REVIEW_UPDATED, REVIEW_MODERATED | `/client/jobs/[bookingId]#review` | Review section |
| VERIFICATION_SUBMITTED, VERIFICATION_APPROVED, VERIFICATION_REJECTED, VERIFICATION_SUSPENDED | `/provider/verification` | Verification status |
| TICKET_CREATED, TICKET_UPDATED, NEW_REPLY, TICKET_RESOLVED | `/support/[ticketId]` | Support ticket |
| DISPUTE_UPDATED, DISPUTE_RESOLVED | `/client/jobs/[bookingId]#dispute` | Dispute details |
| ANNOUNCEMENT | `/announcements/[announcementId]` | Announcement detail |
