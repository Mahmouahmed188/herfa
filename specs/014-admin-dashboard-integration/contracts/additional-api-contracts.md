# Additional API Contracts

**Date**: 2026-06-19  
**Feature**: Admin Dashboard Integration  
**Phase**: 1 - Design & Contracts

## Overview

This document defines additional API contracts for payments, refunds, support, reviews, and other admin functionality.

## Base URL

```
https://api.herfa.com/v1
```

## Payment APIs

### Payments Dashboard

#### GET /admin/payments/overview
**Description**: Get payments dashboard overview  
**Response**:
```typescript
{
  "success": true,
  "data": {
    "totalPayments": number,
    "pendingPayments": number,
    "completedPayments": number,
    "failedPayments": number,
    "totalAmount": number,
    "pendingAmount": number,
    "todayPayments": number,
    "todayAmount": number,
    "paymentMethods": Array<{
      "method": "credit_card" | "bank_transfer" | "wallet" | "other",
      "count": number,
      "percentage": number
    }>,
    "paymentTrend": Array<{
      "date": string,
      "count": number,
      "amount": number
    }>
  }
}
```

#### GET /admin/payments
**Description**: Get paginated list of payments  
**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `status`: "pending" | "completed" | "failed" | "refunded" (optional)
- `method`: "credit_card" | "bank_transfer" | "wallet" | "other" (optional)
- `startDate`: string (ISO 8601, optional)
- `endDate`: string (ISO 8601, optional)

**Response**:
```typescript
{
  "success": true,
  "data": {
    "payments": Array<{
      "id": string,
      "bookingId": string,
      "userId": string,
      "providerId": string,
      "amount": number,
      "currency": string,
      "status": "pending" | "completed" | "failed" | "refunded",
      "method": "credit_card" | "bank_transfer" | "wallet" | "other",
      "transactionId": string | null,
      "createdAt": string,
      "completedAt": string | null
    }>,
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "pages": number
    }
  }
}
```

#### GET /admin/payments/{id}
**Description**: Get detailed payment information  
**Response**:
```typescript
{
  "success": true,
  "data": {
    "id": string,
    "bookingId": string,
    "userId": string,
    "providerId": string,
    "amount": number,
    "currency": string,
    "status": "pending" | "completed" | "failed" | "refunded",
    "method": "credit_card" | "bank_transfer" | "wallet" | "other",
    "transactionId": string | null,
    "createdAt": string,
    "completedAt": string | null,
    "refundedAt": string | null,
    "paymentTimeline": Array<{
      "event": string,
      "timestamp": string,
      "details": string
    }>,
    "user": {
      "id": string,
      "name": string,
      "email": string
    },
    "provider": {
      "id": string,
      "name": string,
      "email": string
    },
    "booking": {
      "id": string,
      "service": string,
      "scheduledDate": string,
      "scheduledTime": string
    }
  }
}
```

### Refund Management

#### GET /admin/refunds
**Description**: Get paginated list of refund requests  
**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `status`: "pending" | "approved" | "rejected" | "processed" (optional)
- `startDate": string (ISO 8601, optional)
- `endDate": string (ISO 8601, optional)

**Response**:
```typescript
{
  "success": true,
  "data": {
    "refunds": Array<{
      "id": string,
      "paymentId": string,
      "bookingId": string,
      "userId": string,
      "providerId": string,
      "amount": number,
      "currency": string,
      "status": "pending" | "approved" | "rejected" | "processed",
      "reason": string,
      "requestedBy": string,
      "approvedBy": string | null,
      "processedAt": string | null,
      "createdAt": string,
      "updatedAt": string
    }>,
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "pages": number
    }
  }
}
```

#### GET /admin/refunds/{id}
**Description**: Get detailed refund information  
**Response**:
```typescript
{
  "success": true,
  "data": {
    "id": string,
    "paymentId": string,
    "bookingId": string,
    "userId": string,
    "providerId": string,
    "amount": number,
    "currency": string,
    "status": "pending" | "approved" | "rejected" | "processed",
    "reason": string,
    "requestedBy": string,
    "approvedBy": string | null,
    "processedAt": string | null,
    "createdAt": string,
    "updatedAt": string,
    "relatedPayment": {
      "id": string,
      "amount": number,
      "status": string,
      "createdAt": string
    },
    "statusHistory": Array<{
      "status": string,
      "changedBy": string | null,
      "changedAt": string,
      "notes": string | null
    }>
  }
}
```

#### POST /admin/refunds/{id}/approve
**Description**: Approve a refund request  
**Request**:
```typescript
{
  "notes": string (optional)
}
```
**Response**:
```typescript
{
  "success": true,
  "data": {
    "refundId": string,
    "status": "approved",
    "approvedBy": string,
    "approvedAt": string,
    "notes": string
  }
}
```

#### POST /admin/refunds/{id}/reject
**Description**: Reject a refund request  
**Request**:
```typescript
{
  "reason": string,
  "notes": string (optional)
}
```
**Response**:
```typescript
{
  "success": true,
  "data": {
    "refundId": string,
    "status": "rejected",
    "rejectedBy": string,
    "rejectedAt": string,
    "reason": string,
    "notes": string
  }
}
```

## Support APIs

### Support Tickets

#### GET /admin/support/tickets
**Description**: Get paginated list of support tickets  
**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `status`: "open" | "in_progress" | "resolved" | "closed" (optional)
- `priority`: "low" | "medium" | "high" | "urgent" (optional)
- `category": "technical" | "billing" | "booking" | "account" | "other" (optional)
- `assignee`: string (optional)

**Response**:
```typescript
{
  "success": true,
  "data": {
    "tickets": Array<{
      "id": string,
      "userId": string,
      "providerId": string | null,
      "bookingId": string | null,
      "subject": string,
      "category": "technical" | "billing" | "booking" | "account" | "other",
      "priority": "low" | "medium" | "high" | "urgent",
      "status": "open" | "in_progress" | "resolved" | "closed",
      "assigneeId": string | null,
      "createdAt": string,
      "updatedAt": string,
      "resolvedAt": string | null
    }>,
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "pages": number
    }
  }
}
```

#### GET /admin/support/tickets/{id}
**Description**: Get detailed ticket information with conversation  
**Response**:
```typescript
{
  "success": true,
  "data": {
    "id": string,
    "userId": string,
    "providerId": string | null,
    "bookingId": string | null,
    "subject": string,
    "category": "technical" | "billing" | "booking" | "account" | "other",
    "priority": "low" | "medium" | "high" | "urgent",
    "status": "open" | "in_progress" | "resolved" | "closed",
    "assigneeId": string | null,
    "createdAt": string,
    "updatedAt": string,
    "resolvedAt": string | null,
    "conversation": Array<{
      "id": string,
      "userId": string | null,
      "adminId": string | null,
      "content": string,
      "type": "user" | "admin" | "system",
      "attachments": Array<{
        "id": string,
        "filename": string,
        "url": string,
        "size": number,
        "mimeType": string,
        "uploadedAt": string
      }>,
      "createdAt": string
    }>,
    "user": {
      "id": string,
      "name": string,
      "email": string
    },
    "provider": {
      "id": string,
      "name": string,
      "email": string
    } | null,
    "booking": {
      "id": string,
      "service": string,
      "scheduledDate": string,
      "scheduledTime": string
    } | null
  }
}
```

#### POST /admin/support/tickets/{id}/assign
**Description**: Assign a ticket to an admin  
**Request**:
```typescript
{
  "assigneeId": string
}
```
**Response**:
```typescript
{
  "success": true,
  "data": {
    "ticketId": string,
    "assigneeId": string,
    "assignedAt": string
  }
}
```

#### POST /admin/support/tickets/{id}/reply
**Description**: Reply to a support ticket  
**Request**:
```typescript
{
  "content": string,
  "attachments": Array<{
    "filename": string,
    "url": string,
    "size": number,
    "mimeType": string
  }> (optional)
}
```
**Response**:
```typescript
{
  "success": true,
  "data": {
    "messageId": string,
    "ticketId": string,
    "content": string,
    "createdAt": string
  }
}
```

#### POST /admin/support/tickets/{id}/update-status
**Description**: Update ticket status  
**Request**:
```typescript
{
  "status": "open" | "in_progress" | "resolved" | "closed",
  "notes": string (optional)
}
```
**Response**:
```typescript
{
  "success": true,
  "data": {
    "ticketId": string,
    "status": string,
    "updatedBy": string,
    "updatedAt": string,
    "notes": string | null
  }
}
```

### Disputes Management

#### GET /admin/support/disputes
**Description**: Get paginated list of disputes  
**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `status`: "open" | "in_progress" | "resolved" | "closed" (optional)
- `reason`: "service_quality" | "payment_issue" | "no_show" | "other" (optional)

**Response**:
```typescript
{
  "success": true,
  "data": {
    "disputes": Array<{
      "id": string,
      "bookingId": string,
      "userId": string,
      "providerId": string,
      "reason": "service_quality" | "payment_issue" | "no_show" | "other",
      "status": "open" | "in_progress" | "resolved" | "closed",
      "createdAt": string,
      "updatedAt": string,
      "resolvedAt": string | null
    }>,
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "pages": number
    }
  }
}
```

#### GET /admin/support/disputes/{id}
**Description**: Get detailed dispute information  
**Response**:
```typescript
{
  "success": true,
  "data": {
    "id": string,
    "bookingId": string,
    "userId": string,
    "providerId": string,
    "reason": "service_quality" | "payment_issue" | "no_show" | "other",
    "status": "open" | "in_progress" | "resolved" | "closed",
    "createdAt": string,
    "updatedAt": string,
    "resolvedAt": string | null,
    "participants": {
      "user": {
        "id": string,
        "name": string,
        "email": string
      },
      "provider": {
        "id": string,
        "name": string,
        "email": string
      }
    },
    "evidence": Array<{
      "id": string,
      "type": "photo" | "document" | "message" | "other",
      "url": string,
      "description": string,
      "uploadedAt": string
    }>,
    "history": Array<{
      "id": string,
      "action": "filed" | "reviewed" | "resolved" | "closed",
      "adminId": string | null,
      "notes": string | null,
      "timestamp": string
    }>
  }
}
```

#### POST /admin/support/disputes/{id}/resolve
**Description**: Resolve a dispute  
**Request**:
```typescript
{
  "resolution": string,
  "notes": string (optional)
}
```
**Response**:
```typescript
{
  "success": true,
  "data": {
    "disputeId": string,
    "status": "resolved",
    "resolvedBy": string,
    "resolvedAt": string,
    "resolution": string,
    "notes": string | null
  }
}
```

## Review APIs

### Reviews Management

#### GET /admin/reviews
**Description**: Get paginated list of reviews  
**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `status`: "visible" | "hidden" | "pending" (optional)
- `rating": 1 | 2 | 3 | 4 | 5 (optional)
- `providerId": string (optional)

**Response**:
```typescript
{
  "success": true,
  "data": {
    "reviews": Array<{
      "id": string,
      "bookingId": string,
      "userId": string,
      "providerId": string,
      "rating": number,
      "comment": string | null,
      "status": "visible" | "hidden" | "pending",
      "createdAt": string,
      "updatedAt": string
    }>,
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "pages": number
    }
  }
}
```

#### GET /admin/reviews/{id}
**Description**: Get detailed review information  
**Response**:
```typescript
{
  "success": true,
  "data": {
    "id": string,
    "bookingId": string,
    "userId": string,
    "providerId": string,
    "rating": number,
    "comment": string | null,
    "status": "visible" | "hidden" | "pending",
    "createdAt": string,
    "updatedAt": string,
    "customer": {
      "id": string,
      "name": string,
      "email": string
    },
    "provider": {
      "id": string,
      "name": string,
      "email": string
    },
    "booking": {
      "id": string,
      "service": string,
      "scheduledDate": string,
      "scheduledTime": string
    }
  }
}
```

#### POST /admin/reviews/{id}/hide
**Description**: Hide a review  
**Request**:
```typescript
{
  "reason": string,
  "notes": string (optional)
}
```
**Response**:
```typescript
{
  "success": true,
  "data": {
    "reviewId": string,
    "status": "hidden",
    "hiddenBy": string,
    "hiddenAt": string,
    "reason": string,
    "notes": string | null
  }
}
```

#### POST /admin/reviews/{id}/restore
**Description**: Restore a hidden review  
**Request**:
```typescript
{
  "notes": string (optional)
}
```
**Response**:
```typescript
{
  "success": true,
  "data": {
    "reviewId": string,
    "status": "visible",
    "restoredBy": string,
    "restoredAt": string,
    "notes": string | null
  }
}
```

## Activity Logs

### Activity Logs

#### GET /admin/audit/logs
**Description**: Get paginated list of activity logs  
**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `actorType`: "user" | "provider" | "admin" | "system" (optional)
- `action": string (optional)
- `startDate": string (ISO 8601, optional)
- `endDate": string (ISO 8601, optional)

**Response**:
```typescript
{
  "success": true,
  "data": {
    "logs": Array<{
      "id": string,
      "action": string,
      "actorType": "user" | "provider" | "admin" | "system",
      "actorId": string | null,
      "targetType": string | null,
      "targetId": string | null,
      "details": Record<string, any> | null,
      "timestamp": string,
      "ipAddress": string | null,
      "userAgent": string | null
    }>,
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "pages": number
    }
  }
}
```

#### GET /admin/audit/logs/{id}
**Description**: Get detailed activity log entry  
**Response**:
```typescript
{
  "success": true,
  "data": {
    "id": string,
    "action": string,
    "actorType": "user" | "provider" | "admin" | "system",
    "actorId": string | null,
    "targetType": string | null,
    "targetId": string | null,
    "details": Record<string, any> | null,
    "timestamp": string,
    "ipAddress": string | null,
    "userAgent": string | null,
    "actor": {
      "id": string,
      "name": string,
      "email": string
    } | null
  }
}
```

## Notifications

### Admin Notifications

#### GET /admin/notifications
**Description**: Get admin notifications  
**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `type`: "alert" | "announcement" | "system" | "operational" (optional)
- `read": boolean (optional)

**Response**:
```typescript
{
  "success": true,
  "data": {
    "notifications": Array<{
      "id": string,
      "type": "alert" | "announcement" | "system" | "operational",
      "title": string,
      "message": string,
      "priority": "low" | "medium" | "high",
      "targetAudience": "all" | "admins" | "users" | "providers",
      "isActive": boolean,
      "createdAt": string,
      "expiresAt": string | null,
      "isRead": boolean
    }>,
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "pages": number
    }
  }
}
```

#### POST /admin/notifications/{id}/mark-read
**Description**: Mark notification as read  
**Response**:
```typescript
{
  "success": true,
  "data": {
    "notificationId": string,
    "markedAsRead": true,
    "readAt": string
  }
}
```

### Announcements

#### POST /admin/announcements
**Description**: Create a new announcement  
**Request**:
```typescript
{
  "title": string,
  "message": string,
  "priority": "low" | "medium" | "high",
  "targetAudience": "all" | "admins" | "users" | "providers",
  "expiresAt": string | null (ISO 8601)
}
```
**Response**:
```typescript
{
  "success": true,
  "data": {
    "id": string,
    "title": string,
    "message": string,
    "priority": string,
    "targetAudience": string,
    "isActive": boolean,
    "createdAt": string,
    "expiresAt": string | null
  }
}
```

#### GET /admin/announcements
**Description**: Get list of announcements  
**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)

**Response**:
```typescript
{
  "success": true,
  "data": {
    "announcements": Array<{
      "id": string,
      "title": string,
      "message": string,
      "priority": "low" | "medium" | "high",
      "targetAudience": "all" | "admins" | "users" | "providers",
      "isActive": boolean,
      "createdAt": string,
      "expiresAt": string | null,
      "publishedBy": string
    }>,
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "pages": number
    }
  }
}
```

## Reports

### Export Reports

#### GET /admin/reports/export
**Description**: Export various reports  
**Query Parameters**:
- `type`: "revenue" | "users" | "providers" | "bookings" | "support" (required)
- `format": "csv" | "pdf" | "excel" (default: "csv")
- `period`: "7d" | "30d" | "90d" | "1y" | "custom" (default: "30d")
- `startDate": string (ISO 8601, required if period is "custom")
- `endDate": string (ISO 8601, required if period is "custom")

**Response**:
```typescript
{
  "success": true,
  "data": {
    "downloadUrl": string,
    "filename": string,
    "format": string,
    "type": string,
    "period": string,
    "generatedAt": string,
    "recordCount": number
  }
}
```

#### GET /admin/reports/revenue
**Description**: Generate revenue report  
**Query Parameters**:
- `period`: "7d" | "30d" | "90d" | "1y" | "custom" (default: "30d")
- `startDate": string (ISO 8601, required if period is "custom")
- `endDate": string (ISO 8601, required if period is "custom")

**Response**:
```typescript
{
  "success": true,
  "data": {
    "period": "30d",
    "totalRevenue": number,
    "averageDailyRevenue": number,
    "revenueByService": Array<{
      "service": string,
      "revenue": number,
      "percentage": number
    }>,
    "revenueByProvider": Array<{
      "provider": string,
      "revenue": number,
      "percentage": number
    }>,
    "revenueTrend": Array<{
      "date": string,
      "revenue": number
    }>,
    "generatedAt": string
  }
}
```