# Data Model: Customer Dashboard Completion

## Entities

### Address

Represents a saved physical location associated with a customer.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string (UUID) | Yes | Primary key |
| `userId` | string (UUID) | Yes | Owner of the address |
| `label` | string | Yes | User-facing name: "Home", "Work", "Other" |
| `street` | string | Yes | Street name and number |
| `building` | string | No | Building/apartment number |
| `city` | string | Yes | City name |
| `area` | string | Yes | District/neighborhood |
| `latitude` | number | No | For map display |
| `longitude` | number | No | For map display |
| `isDefault` | boolean | Yes | Only one address can be default per user |
| `phone` | string | No | Contact phone for this address |
| `additionalInstructions` | string | No | Delivery/service notes |
| `createdAt` | string (ISO) | Yes | From BaseEntity |
| `updatedAt` | string (ISO) | Yes | From BaseEntity |

**Validation Rules**:
- `label`: max 50 chars, one of "Home", "Work", "Other" or custom
- `street`: required, max 200 chars
- `city`: required, max 100 chars
- `area`: required, max 100 chars
- `isDefault`: boolean, only one address can be true per user
- `phone`: optional, must be valid Saudi phone number (05xxxxxxxx) if provided

**Relationships**:
- Belongs to User (userId)
- Referenced by Job (location.address)
- Referenced by Booking (location)

---

### CustomerNotification

A notification delivered to a specific customer.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string (UUID) | Yes | Primary key |
| `userId` | string (UUID) | Yes | Recipient |
| `type` | enum | Yes | `BOOKING_UPDATE` | `ANNOUNCEMENT` | `PROMO` | `SYSTEM` |
| `title` | string | Yes | Short headline |
| `body` | string | Yes | Full message content |
| `isRead` | boolean | Yes | Read status |
| `metadata` | object | No | Optional payload (e.g., `{ bookingId: "..." }`) |
| `createdAt` | string (ISO) | Yes | When the notification was sent |

**Relationships**:
- Belongs to User (userId)
- Optional reference to Booking (via metadata.bookingId)

---

### CustomerBooking (extends Booking/Job)

A customer's job/booking for dashboard and history display.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string (UUID) | Yes | Primary key |
| `service` | object | Yes | `{ id, name, category }` |
| `provider` | object | No | `{ id, name, phone, avatarUrl, rating }` — assigned technician |
| `status` | enum | Yes | `PENDING` | `ACCEPTED` | `IN_PROGRESS` | `COMPLETED` | `CANCELLED` | `DISPUTED` |
| `scheduledAt` | string (ISO) | No | Scheduled date/time |
| `address` | string | No | Service address |
| `description` | string | No | Job description |
| `amount` | number | No | Price/cost |
| `payment` | object | No | `{ status, method, paidAt }` — payment details |
| `tracking` | object | No | `{ available: boolean, eta: string, providerLocation: object }` |
| `timeline` | array | No | Array of timeline events |
| `createdAt` | string (ISO) | Yes | From BaseEntity |
| `updatedAt` | string (ISO) | Yes | From BaseEntity |

**Status Transitions**:
```
PENDING → ACCEPTED → IN_PROGRESS → COMPLETED
PENDING → CANCELLED
IN_PROGRESS → DISPUTED → (RESOLVED)
```

---

### DashboardStats

Aggregated customer statistics for the dashboard.

| Field | Type | Notes |
|---|---|---|
| `activeOrders` | number | Jobs with status !== COMPLETED and !== CANCELLED |
| `completedCount` | number | Jobs with status === COMPLETED |
| `pendingCount` | number | Jobs with status === PENDING |
| `totalOrders` | number | All jobs count |

**Note**: Computed client-side from `/jobs/my-jobs` response unless a dedicated dashboard stats endpoint exists.

---

### TrackingInfo

Real-time tracking data for an active booking.

| Field | Type | Notes |
|---|---|---|
| `available` | boolean | Whether tracking data is available |
| `eta` | string (ISO) | Estimated arrival time |
| `providerLatitude` | number | Provider's current location |
| `providerLongitude` | number | Provider's current location |
| `lastUpdated` | string (ISO) | When tracking was last refreshed |

---

## State Machines

### Booking Status Lifecycle

```
                  ┌─────────┐
                  │ PENDING │
                  └────┬────┘
                       │
              ┌────────┴────────┐
              │                 │
         ┌────▼────┐     ┌─────┴──────┐
         │ ACCEPTED │     │ CANCELLED  │
         └────┬────┘     └────────────┘
              │
         ┌────▼──────┐
         │ IN_PROGRESS│
         └────┬───────┘
              │
        ┌─────┴─────────┐
        │               │
   ┌────▼────┐    ┌─────▼─────┐
   │COMPLETED│    │ DISPUTED  │
   └─────────┘    └─────┬─────┘
                        │
                   ┌────▼────┐
                   │RESOLVED │
                   └─────────┘
```

### Notification Read State

```
UNREAD ──[mark as read]──→ READ
```
