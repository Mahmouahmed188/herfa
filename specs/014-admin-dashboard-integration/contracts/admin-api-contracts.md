# Admin Dashboard API Contracts

**Date**: 2026-06-19  
**Feature**: Admin Dashboard Integration  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the API contracts for the Admin Dashboard integration. All endpoints follow RESTful conventions and use JSON for request/response bodies. Authentication is handled via JWT Bearer tokens in the Authorization header.

## Base URL

```
https://api.herfa.com/v1
```

## Authentication

All admin endpoints require:
- **Authorization**: `Bearer <jwt_token>`
- **Content-Type**: `application/json`

## Common Response Format

### Success Response
```typescript
{
  "success": true,
  "data": T,
  "message": "Operation completed successfully"
}
```

### Error Response
```typescript
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details (optional)"
  }
}
```

## Admin APIs

### Authentication & Authorization

#### POST /auth/admin/login
**Description**: Admin login endpoint  
**Request**:
```typescript
{
  "email": string,
  "password": string
}
```
**Response**:
```typescript
{
  "success": true,
  "data": {
    "token": string,
    "admin": {
      "id": string,
      "email": string,
      "name": string,
      "role": "super_admin" | "admin" | "support_admin",
      "permissions": string[]
    }
  }
}
```

### Dashboard Overview

#### GET /admin/dashboard/overview
**Description**: Get dashboard overview with KPIs  
**Response**:
```typescript
{
  "success": true,
  "data": {
    "totalUsers": number,
    "totalCustomers": number,
    "totalProviders": number,
    "activeProviders": number,
    "pendingVerifications": number,
    "totalBookings": number,
    "activeBookings": number,
    "totalRevenue": number,
    "openTickets": number,
    "openDisputes": number,
    "pendingRefunds": number,
    "systemHealth": {
      "status": "healthy" | "warning" | "critical",
      "checks": Array<{
        "name": string,
        "status": "pass" | "fail",
        "message": string
      }>
    },
    "recentActivity": Array<{
      "id": string,
      "action": string,
      "actor": string,
      "target": string,
      "timestamp": string
    }>
  }
}
```

### User Management

#### GET /admin/users
**Description**: Get paginated list of users  
**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `search`: string (optional)
- `role`: "client" | "technician" | "admin" (optional)
- `status`: "active" | "suspended" | "pending" | "banned" (optional)

**Response**:
```typescript
{
  "success": true,
  "data": {
    "users": Array<{
      "id": string,
      "email": string,
      "name": string,
      "phone": string,
      "role": "client" | "technician" | "admin",
      "status": "active" | "suspended" | "pending" | "banned",
      "registrationDate": string,
      "lastLogin": string | null
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

#### GET /admin/users/{id}
**Description**: Get detailed user information  
**Response**:
```typescript
{
  "success": true,
  "data": {
    "id": string,
    "email": string,
    "name": string,
    "phone": string,
    "role": "client" | "technician" | "admin",
    "status": "active" | "suspended" | "pending" | "banned",
    "registrationDate": string,
    "lastLogin": string | null,
    "profile": {
      "avatar": string | null,
      "bio": string | null,
      "address": {
        "street": string,
        "city": string,
        "state": string,
        "zipCode": string,
        "country": string
      } | null,
      "preferences": {
        "language": "en" | "ar",
        "notifications": boolean,
        "theme": "light" | "dark"
      }
    },
    "bookingHistory": Array<{
      "id": string,
      "service": string,
      "provider": string,
      "status": "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "disputed",
      "scheduledDate": string,
      "totalAmount": number
    }>,
    "activitySummary": {
      "totalBookings": number,
      "totalSpent": number,
      "lastActivity": string
    }
  }
}
```

#### POST /admin/users/{id}/suspend
**Description**: Suspend a user account  
**Response**:
```typescript
{
  "success": true,
  "data": {
    "userId": string,
    "status": "suspended",
    "suspendedBy": string,
    "suspendedAt": string,
    "reason": string
  }
}
```

#### POST /admin/users/{id}/reactivate
**Description**: Reactivate a suspended user account  
**Response**:
```typescript
{
  "success": true,
  "data": {
    "userId": string,
    "status": "active",
    "reactivatedBy": string,
    "reactivatedAt": string
  }
}
```

### Provider Management

#### GET /admin/providers
**Description**: Get paginated list of providers  
**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `search`: string (optional)
- `status`: "pending" | "approved" | "suspended" | "rejected" (optional)
- "category": string (optional)

**Response**:
```typescript
{
  "success": true,
  "data": {
    "providers": Array<{
      "id": string,
      "userId": string,
      "name": string,
      "email": string,
      "phone": string,
      "categories": Array<{
        "id": string,
        "name": string
      }>,
      "ratings": {
        "averageRating": number,
        "totalReviews": number,
        "ratingDistribution": {
          "5": number,
          "4": number,
          "3": number,
          "2": number,
          "1": number
        }
      },
      "verification": {
        "status": "pending" | "approved" | "suspended" | "rejected",
        "submittedAt": string | null
      },
      "isActive": boolean,
      "registrationDate": string
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

#### GET /admin/providers/{id}
**Description**: Get detailed provider information  
**Response**:
```typescript
{
  "success": true,
      "data": {
    "id": string,
    "userId": string,
    "name": string,
    "email": string,
    "phone": string,
    "categories": Array<{
      "id": string,
      "name": string,
      "description": string
    }>,
    "ratings": {
      "averageRating": number,
      "totalReviews": number,
      "ratingDistribution": {
        "5": number,
        "4": number,
        "3": number,
        "2": number,
        "1": number
      }
    },
    "verification": {
      "status": "pending" | "approved" | "suspended" | "rejected",
      "documents": Array<{
        "id": string,
        "type": "id" | "license" | "certificate" | "insurance" | "other",
        "url": string,
        "filename": string,
        "uploadedAt": string,
        "status": "pending" | "approved" | "rejected"
      }>,
      "history": Array<{
        "id": string,
        "action": "submitted" | "reviewed" | "approved" | "rejected" | "suspended",
        "adminId": string | null,
        "notes": string | null,
        "timestamp": string
      }>,
      "submittedAt": string | null,
      "reviewedAt": string | null,
      "reviewedBy": string | null
    },
    "services": Array<{
      "id": string,
      "name": string,
      "description": string,
      "price": number,
      "duration": number
    }>,
    "reviews": Array<{
      "id": string,
      "userId": string,
      "rating": number,
      "comment": string | null,
      "createdAt": string
    }>,
    "statistics": {
      "totalBookings": number,
      "completedBookings": number,
      "cancelledBookings": number,
      "totalEarnings": number,
      "averageResponseTime": number
    },
    "isActive": boolean,
    "registrationDate": string,
    "lastActivity": string | null
  }
}
```

#### POST /admin/providers/{id}/approve
**Description**: Approve a provider application  
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
    "providerId": string,
    "status": "approved",
    "approvedBy": string,
    "approvedAt": string,
    "notes": string
  }
}
```

#### POST /admin/providers/{id}/suspend
**Description**: Suspend a provider account  
**Request**:
```typescript
{
  "reason": string
}
```
**Response**:
```typescript
{
  "success": true,
  "data": {
    "providerId": string,
    "status": "suspended",
    "suspendedBy": string,
    "suspendedAt": string,
    "reason": string
  }
}
```

#### POST /admin/providers/{id}/reactivate
**Description**: Reactivate a suspended provider account  
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
    "providerId": string,
    "status": "approved",
    "reactivatedBy": string,
    "reactivatedAt": string,
    "notes": string
  }
}
```

### Verification Management

#### GET /admin/verification/pending
**Description**: Get pending verification requests  
**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)

**Response**:
```typescript
{
  "success": true,
  "data": {
    "verifications": Array<{
      "id": string,
      "providerId": string,
      "providerName": string,
      "providerEmail": string,
      "status": "pending",
      "submittedAt": string,
      "documents": Array<{
        "id": string,
        "type": "id" | "license" | "certificate" | "insurance" | "other",
        "filename": string,
        "uploadedAt": string
      }>
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

#### GET /admin/verification/{id}
**Description**: Get detailed verification information  
**Response**:
```typescript
{
  "success": true,
  "data": {
    "id": string,
    "providerId": string,
    "providerName": string,
    "providerEmail": string,
    "status": "pending" | "approved" | "rejected" | "suspended",
    "documents": Array<{
      "id": string,
      "type": "id" | "license" | "certificate" | "insurance" | "other",
      "url": string,
      "filename": string,
      "uploadedAt": string,
      "status": "pending" | "approved" | "rejected"
    }>,
    "history": Array<{
      "id": string,
      "action": "submitted" | "reviewed" | "approved" | "rejected" | "suspended",
      "adminId": string | null,
      "notes": string | null,
      "timestamp": string
    }>,
    "submittedAt": string | null,
    "reviewedAt": string | null,
    "reviewedBy": string | null
  }
}
```

#### POST /admin/verification/{id}/approve
**Description**: Approve a verification request  
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
    "verificationId": string,
    "status": "approved",
    "approvedBy": string,
    "approvedAt": string,
    "notes": string
  }
}
```

#### POST /admin/verification/{id}/reject
**Description**: Reject a verification request  
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
    "verificationId": string,
    "status": "rejected",
    "rejectedBy": string,
    "rejectedAt": string,
    "reason": string,
    "notes": string
  }
}
```