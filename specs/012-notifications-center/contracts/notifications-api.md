# Notifications API Contract

**Base URL**: `/api/v1/notifications`

**Authentication**: All endpoints require JWT token in `Authorization: Bearer <token>` header.

**Roles**: All authenticated users (customers, providers, admins) can access notification endpoints.

---

## GET /notifications

List all notifications for the authenticated user (paginated).

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `number` | No | `1` | Page number (1-indexed) |
| `limit` | `number` | No | `20` | Items per page (max 100) |
| `isRead` | `boolean` | No | — | Filter by read status |
| `type` | `string` | No | — | Filter by notification type |
| `search` | `string` | No | — | Search in title and body |
| `sortBy` | `string` | No | `createdAt` | Sort field |
| `sortOrder` | `'asc' \| 'desc'` | No | `desc` | Sort direction |

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "type": "BOOKING_CREATED",
      "title": "New Booking Request",
      "body": "A new booking has been created.",
      "isRead": false,
      "channel": "in_app",
      "data": { "bookingId": "uuid" },
      "createdAt": "2026-06-18T10:00:00Z",
      "updatedAt": "2026-06-18T10:00:00Z"
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

## GET /notifications/unread-count

Get the count of unread notifications for the authenticated user.

### Response

```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

---

## PATCH /notifications/:id/read

Mark a single notification as read.

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` (UUID) | Notification ID |

### Response

```json
{
  "success": true
}
```

---

## PATCH /notifications/read-all

Mark all notifications as read for the authenticated user.

### Response

```json
{
  "success": true
}
```

---

## DELETE /notifications/:id

Delete a single notification.

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` (UUID) | Notification ID |

### Response

```json
{
  "success": true
}
```

## Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Notification not found"
}
```

### 400 Bad Request

```json
{
  "success": false,
  "error": "Invalid notification ID format"
}
```
