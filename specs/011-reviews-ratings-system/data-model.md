# Data Model: Reviews & Ratings System

## Review

Represents a customer's rating and feedback for a service provider after a completed booking.

| Field | Type | Required | Validation | Source |
|-------|------|----------|------------|--------|
| `id` | `string` (UUID) | Yes | Auto-generated | Backend |
| `bookingId` | `string` (UUID) | Yes | Must reference completed booking | Request |
| `customerId` | `string` (UUID) | Yes | From auth token | Backend |
| `providerId` | `string` (UUID) | Yes | Must be provider for booking | Request |
| `rating` | `number` (1-5) | Yes | Integer 1-5 | Request |
| `comment` | `string` | No | Text, validated by backend | Request |
| `isApproved` | `boolean` | Yes | Default: false | Backend |
| `isFlagged` | `boolean` | Yes | Default: false | Backend |
| `createdAt` | `string` (ISO 8601) | Yes | Auto-generated | Backend |
| `updatedAt` | `string` (ISO 8601) | Yes | Auto-generated | Backend |

**Relationships:**
- Belongs to a Booking (bookingId)
- Belongs to a Customer (customerId)
- Belongs to a Provider (providerId)

**Business Rules:**
- One review per booking (duplicate prevention)
- Only visible if `isApproved === true`
- Can be flagged by any authenticated user
- Can be moderated (approved/rejected) by admin

## ProviderRatingStats

Aggregated rating statistics for a provider, recalculated on review creation.

| Field | Type | Required | Source |
|-------|------|----------|--------|
| `id` | `string` (UUID) | Yes | Backend |
| `providerId` | `string` (UUID) | Yes | Backend |
| `averageRating` | `number` (decimal) | Yes | Calculated from reviews |
| `totalReviews` | `number` (integer) | Yes | Count of approved reviews |
| `totalBookings` | `number` (integer) | Yes | Count of completed bookings |

**Relationships:**
- Belongs to a Provider (providerId)

## ModerationState (Frontend Display Enum)

Derived from backend `isApproved` and `isFlagged` boolean fields for UI display.

| State | Backend Condition | UI Display |
|-------|-------------------|------------|
| `APPROVED` | `isApproved === true && isFlagged === false` | Normal display |
| `PENDING` | `isApproved === false && isFlagged === false` | "Pending moderation" badge |
| `FLAGGED` | `isFlagged === true` | "Flagged" badge |
| `REJECTED` | `isApproved === false && isFlagged === false` (admin rejection) | "Removed" badge (back-end determined) |

## ReviewEvent (Notification Integration)

Events fired by backend `@nestjs/event-emitter` relevant to reviews:

| Event | Trigger | Notification Receivers |
|-------|---------|----------------------|
| `review.created` | Customer creates a review | Provider |
| `review.updated` | Customer edits review | Provider |
| `review.moderated` | Admin moderates review | Review owner (customer) |

## State Transitions

```
Created (isApproved: false, isFlagged: false)
  ├── Admin Approves → isApproved: true (visible)
  ├── Admin Rejects → isApproved: false, userFlagged (hidden)
  ├── User Flags → isFlagged: true
  │     └── Admin Reviews Flag
  │           ├── Approve → isFlagged: false, isApproved: true
  │           └── Reject → isFlagged: true, isApproved: false
  └── Owner Edits → updatedAt refreshes, stays in current state
```
