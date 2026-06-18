# Announcements API Contract

**Base URL**: `/api/v1/notifications`

**Authentication**: GET endpoints require JWT token. POST/PATCH/DELETE require `admin` or `super_admin` role.

---

## GET /notifications/announcements

List all announcements (paginated). Returns only active announcements for regular users; all announcements for admins.

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `number` | No | `1` | Page number |
| `limit` | `number` | No | `20` | Items per page |
| `status` | `'SENT' \| 'SCHEDULED' \| 'DRAFT'` | No | — | Filter by status |
| `isActive` | `boolean` | No | — | Filter active (current) announcements |

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "System Maintenance",
      "body": "The platform will be down for maintenance on Saturday.",
      "type": "PUSH",
      "target": "ALL",
      "status": "SENT",
      "sentCount": 1523,
      "scheduledAt": null,
      "createdAt": "2026-06-18T08:00:00Z",
      "updatedAt": "2026-06-18T08:00:00Z"
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

## POST /notifications/announcements

Create a new announcement. Requires `admin` or `super_admin` role.

### Request Body

```json
{
  "title": "System Maintenance",
  "message": "The platform will be down for maintenance on Saturday.",
  "target": "ALL",
  "type": "PUSH"
}
```

### Validation

| Field | Rules |
|-------|-------|
| `title` | Required, 1-255 characters |
| `message` | Required, 1-5000 characters |
| `target` | Required, enum: `ALL`, `CLIENTS`, `PROVIDERS` |
| `type` | Required, enum: `PUSH`, `SMS`, `EMAIL` |

### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "System Maintenance",
    "body": "The platform will be down for maintenance on Saturday.",
    "type": "PUSH",
    "target": "ALL",
    "status": "SENT",
    "sentCount": 0,
    "scheduledAt": null,
    "createdAt": "2026-06-18T08:00:00Z",
    "updatedAt": "2026-06-18T08:00:00Z"
  }
}
```

---

## PATCH /notifications/announcements/:id

Update an existing announcement. Requires `admin` or `super_admin` role.

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` (UUID) | Announcement ID |

### Request Body

```json
{
  "title": "Updated: System Maintenance",
  "message": "Updated maintenance message.",
  "target": "ALL",
  "type": "PUSH"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Updated: System Maintenance",
    "body": "Updated maintenance message.",
    "type": "PUSH",
    "target": "ALL",
    "status": "SENT",
    "sentCount": 1523,
    "scheduledAt": null,
    "createdAt": "2026-06-18T08:00:00Z",
    "updatedAt": "2026-06-18T08:10:00Z"
  }
}
```

---

## DELETE /notifications/announcements/:id

Delete an announcement. Requires `admin` or `super_admin` role.

### Response

```json
{
  "success": true
}
```

## Error Responses

### 403 Forbidden

```json
{
  "success": false,
  "error": "Insufficient permissions. Admin or Super Admin role required."
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Announcement not found"
}
```
