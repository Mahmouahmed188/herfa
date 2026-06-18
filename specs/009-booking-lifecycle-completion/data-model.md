# Data Model: Booking Lifecycle Completion

## Entity Overview

The booking lifecycle manages the complete journey of a service booking from creation through completion, including provider assignment, tracking, cancellation, notifications, and payment finalization.

---

## Entity: `Booking`

The primary booking record created by a customer for a service.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Yes | Unique booking identifier |
| userId | string (UUID) | Yes | Customer who created the booking |
| userName | string | Yes | Customer display name |
| providerId | string (UUID) | No | Assigned provider (null until assigned) |
| providerName | string | No | Provider display name |
| serviceId | string (UUID) | Yes | Selected service listing |
| serviceName | string | Yes | Service name |
| categoryId | string (UUID) | No | Service category |
| status | BookingStatus (enum) | Yes | Current booking state |
| address | string | No | Service address |
| latitude | number | No | Address latitude |
| longitude | number | No | Address longitude |
| description | string | No | Issue or service description |
| notes | string | No | Additional customer notes |
| amount | number | No | Agreed/estimated price |
| scheduledAt | string (ISO 8601) | No | Scheduled service date/time |
| createdAt | string (ISO 8601) | Yes | When booking was created |
| updatedAt | string (ISO 8601) | Yes | When booking last changed |

### Status Enum: `BookingStatus`

| Value | Display Label | Description |
|-------|---------------|-------------|
| `PENDING` | Pending | Created, awaiting provider assignment or acceptance |
| `ACCEPTED` | Accepted | Provider has accepted the booking |
| `ASSIGNED` | Assigned | Provider assigned (auto or manual) |
| `IN_PROGRESS` | In Progress | Work has started |
| `ON_THE_WAY` | On The Way | Provider en route to location |
| `COMPLETED` | Completed | Service delivered |
| `CANCELLED` | Cancelled | Booking cancelled (customer or system) |
| `DISPUTED` | Disputed | Payment/service dispute opened |

### Status Transitions

```
PENDING → ACCEPTED → ASSIGNED → ON_THE_WAY → IN_PROGRESS → COMPLETED
PENDING → CANCELLED
ACCEPTED → CANCELLED
ASSIGNED → CANCELLED
COMPLETED → DISPUTED
```

### Validation Rules
- Customer can cancel only if status is PENDING, ACCEPTED, or ASSIGNED
- Provider can update status only on bookings assigned to them
- Provider cannot update status backward (e.g., IN_PROGRESS → ASSIGNED)
- Provider can complete only when status is IN_PROGRESS
- Booking cannot be modified after COMPLETED or CANCELLED

---

## Entity: `BookingTimelineEvent`

An individual event in the booking's status history.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Yes | Unique event identifier |
| bookingId | string (UUID) | Yes | Parent booking |
| type | TimelineEventType (enum) | Yes | Type of event |
| status | BookingStatus | No | New status (for STATUS_CHANGE events) |
| title | string | Yes | Human-readable event title |
| description | string | Yes | Event description |
| actor | string | No | Who performed the action (customer name, provider name, "system") |
| timestamp | string (ISO 8601) | Yes | When the event occurred |
| metadata | Record<string, any> | No | Additional event-specific data (cancellation reason, dispute details, etc.) |

### Event Types Enum

| Value | Description |
|-------|-------------|
| `STATUS_CHANGE` | Booking status transitioned |
| `PROVIDER_ASSIGNED` | Provider assigned to booking |
| `PROVIDER_ACCEPTED` | Provider accepted the booking |
| `PROVIDER_REJECTED` | Provider rejected the booking |
| `TRACKING_STARTED` | Tracking session initiated |
| `LOCATION_UPDATED` | Provider location updated |
| `CANCELLED` | Booking cancelled (with reason) |
| `COMPLETED` | Booking marked complete |
| `PAYMENT` | Payment-related event |
| `DISPUTE` | Dispute opened or resolved |
| `MESSAGE` | Customer or provider message |

---

## Entity: `TrackingSession`

A real-time tracking session associated with an active booking.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Yes | Unique session identifier |
| bookingId | string (UUID) | Yes | Associated booking |
| status | TrackingStatus (enum) | Yes | Current session state |
| providerLatitude | number | No | Provider's current latitude |
| providerLongitude | number | No | Provider's current longitude |
| eta | string (ISO 8601) | No | Estimated arrival time |
| lastUpdated | string (ISO 8601) | No | When location was last updated |
| startedAt | string (ISO 8601) | No | When tracking started |
| endedAt | string (ISO 8601) | No | When tracking ended |

### Tracking Status Enum

| Value | Description |
|-------|-------------|
| `ACTIVE` | Tracking session is live |
| `PAUSED` | Tracking temporarily paused |
| `COMPLETED` | Tracking session ended |
| `NOT_STARTED` | Not yet initialized |

---

## Entity: `BookingNotification`

A notification generated in response to a booking lifecycle event.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Yes | Unique notification identifier |
| userId | string (UUID) | Yes | Recipient user ID |
| type | NotificationType (enum) | Yes | Notification category |
| title | string | Yes | Notification title |
| body | string | Yes | Notification body text |
| bookingId | string (UUID) | No | Related booking (for navigation) |
| read | boolean | Yes | Whether notification has been read |
| createdAt | string (ISO 8601) | Yes | When notification was created |

### Booking Notification Types

| Type | Trigger Event | Audience |
|------|---------------|----------|
| `BOOKING_CREATED` | Booking confirmed | Customer |
| `BOOKING_ACCEPTED` | Provider accepts | Customer |
| `BOOKING_ASSIGNED` | Provider assigned | Customer |
| `BOOKING_STARTED` | Provider starts work | Customer |
| `BOOKING_COMPLETED` | Service delivered | Customer |
| `BOOKING_CANCELLED` | Booking cancelled | Customer, Provider |
| `BOOKING_UPDATE` | General update | Customer |

---

## Entity: `ProviderAssignment`

The record of a provider being assigned to a booking.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Yes | Unique assignment identifier |
| bookingId | string (UUID) | Yes | Associated booking |
| providerId | string (UUID) | Yes | Assigned provider |
| status | AssignmentStatus (enum) | Yes | Current assignment state |
| quotedPrice | number | No | Provider's quoted price |
| assignedAt | string (ISO 8601) | Yes | When assigned |
| acceptedAt | string (ISO 8601) | No | When provider accepted |
| rejectedAt | string (ISO 8601) | No | When provider rejected |

### Assignment Status Enum

| Value | Description |
|-------|-------------|
| `PENDING` | Awaiting provider response |
| `ACCEPTED` | Provider accepted |
| `REJECTED` | Provider declined |

---

## Relationships

```
Booking (1) ──── (N) BookingTimelineEvent
Booking (1) ──── (1) TrackingSession
Booking (1) ──── (N) BookingNotification
Booking (1) ──── (N) ProviderAssignment
```

## State Machine Diagram

```text
                    ┌──────────┐
                    │ PENDING  │
                    └────┬─────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
        ┌──────────┐ ┌──────────┐  CANCELLED
        │ ACCEPTED │ │ASSIGNED  │
        └────┬─────┘ └────┬─────┘
             │            │
             └─────┬──────┘
                   ▼
            ┌────────────┐
            │ ON_THE_WAY │
            └──────┬─────┘
                   ▼
            ┌────────────┐
            │IN_PROGRESS │
            └──────┬─────┘
                   ▼
            ┌────────────┐     ┌──────────┐
            │ COMPLETED  │────▶│ DISPUTED │
            └────────────┘     └──────────┘
```
