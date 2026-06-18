# Customer API Contracts

## Profile

### GET /users/me

**Auth**: Bearer token (required)

**Response**:
```json
{
  "id": "uuid",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "role": "CUSTOMER",
  "avatarUrl": "string|null",
  "status": "ACTIVE",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

### PATCH /users/me

**Auth**: Bearer token (required)

**Request**:
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phone": "string (optional)",
  "avatarUrl": "string (optional)"
}
```

**Response**: Updated user object

---

## Jobs (Customer)

### GET /jobs/my-jobs

**Auth**: Bearer token (required)

**Query Params**:
| Param | Type | Required | Description |
|---|---|---|---|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 20) |
| `status` | string | No | Filter by status |
| `sort` | string | No | Sort field (default: `-createdAt`) |

**Response**: Array of job objects or paginated response:

```json
[
  {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "status": "PENDING|ACCEPTED|IN_PROGRESS|COMPLETED|CANCELLED",
    "service": { "id": "uuid", "name": "string" },
    "provider": { "id": "uuid", "name": "string", "phone": "string", "avatarUrl": "string", "rating": 4.5 } | null,
    "address": "string",
    "scheduledAt": "ISO datetime",
    "amount": 0,
    "createdAt": "ISO datetime",
    "updatedAt": "ISO datetime"
  }
]
```

### GET /jobs/{id}

**Auth**: Bearer token (required)

**Response**: Single job object with full details (including provider, payment, timeline if available):

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "status": "string",
  "service": { "id": "uuid", "name": "string", "category": "string" },
  "provider": { "id": "uuid", "name": "string", "phone": "string", "avatarUrl": "string", "rating": 4.5 },
  "address": "string",
  "scheduledAt": "ISO datetime",
  "amount": 0,
  "payment": { "status": "PAID|UNPAID|REFUNDED", "method": "string", "paidAt": "ISO datetime" } | null,
  "tracking": { "available": false, "eta": "ISO datetime" } | null,
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

---

## Addresses

### GET /addresses

**Auth**: Bearer token (required)

**Response**: Array of address objects
```json
[
  {
    "id": "uuid",
    "label": "Home",
    "street": "string",
    "building": "string",
    "city": "string",
    "area": "string",
    "latitude": 24.7136,
    "longitude": 46.6753,
    "isDefault": true,
    "phone": "string",
    "additionalInstructions": "string",
    "createdAt": "ISO datetime",
    "updatedAt": "ISO datetime"
  }
]
```

### POST /addresses

**Auth**: Bearer token (required)

**Request**:
```json
{
  "label": "Home",
  "street": "Olaya Street",
  "building": "Building 42, Apt 3B",
  "city": "Riyadh",
  "area": "Al-Olaya",
  "latitude": 24.7136,
  "longitude": 46.6753,
  "isDefault": false,
  "phone": "0555123456",
  "additionalInstructions": "Ring bell twice"
}
```

**Response**: Created address object

### PATCH /addresses/{id}

**Auth**: Bearer token (required)

**Request**: Partial address object (all fields optional)

**Response**: Updated address object

### DELETE /addresses/{id}

**Auth**: Bearer token (required)

**Response**: `{ "message": "Address deleted" }`

### PATCH /addresses/{id}/default

**Auth**: Bearer token (required)

**Description**: Set this address as the default. The backend unsets other defaults.

**Response**: Updated address object with `isDefault: true`

---

## Notifications (Customer)

### GET /notifications

**Auth**: Bearer token (required)

**Query Params**: `page` (number), `limit` (number)

**Response**: Paginated array of notification objects
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "BOOKING_UPDATE|ANNOUNCEMENT|PROMO|SYSTEM",
      "title": "string",
      "body": "string",
      "isRead": false,
      "metadata": { "bookingId": "uuid" } | null,
      "createdAt": "ISO datetime"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20
}
```

### GET /notifications/unread-count

**Auth**: Bearer token (required)

**Response**:
```json
{
  "count": 5
}
```

### POST /notifications/mark-read

**Auth**: Bearer token (required)

**Request**:
```json
{
  "notificationIds": ["uuid1", "uuid2"]
}
```

**Response**: `{ "message": "Notifications marked as read" }`

---

## Tracking

### GET /jobs/{id}/tracking (Assumed)

**Auth**: Bearer token (required)

**Response**:
```json
{
  "available": true,
  "eta": "ISO datetime",
  "providerLatitude": 24.715,
  "providerLongitude": 46.678,
  "lastUpdated": "ISO datetime"
}
```

---

## Error Response Format

All endpoints return errors in this format:
```json
{
  "message": "Human-readable error description",
  "statusCode": 400,
  "error": "Bad Request"
}
```
