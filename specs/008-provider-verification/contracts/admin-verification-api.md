# Admin Verification API Contract

**Base URL**: `/api/v1` | **Auth**: Bearer token (JWT, admin role required)

---

## List Verification Queue

Returns a paginated list of verification applications for admin review.

```
GET /admin/provider-verifications
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| query | string | No | Search by provider name |
| status | string | No | Filter by status |

### Response `200`

```typescript
{
  success: true;
  data: Array<{
    id: string;
    providerName: string;
    status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
    submittedAt: string;
    documents: Array<{
      id: string;
      type: string;
      url: string;
      status: 'PENDING' | 'APPROVED' | 'REJECTED';
      rejectionReason?: string;
    }>;
  }>;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

---

## Get Verification Details

Returns full verification details for a single application.

```
GET /admin/provider-verifications/:id
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Verification application ID |

### Response `200`

```typescript
{
  success: true;
  data: {
    id: string;
    providerName: string;
    providerId: string;
    status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
    submittedAt: string;
    approvedAt?: string;
    reviewedBy?: string;
    adminNote?: string;
    documents: Array<{
      id: string;
      type: string;
      url: string;
      filename: string;
      status: 'PENDING' | 'APPROVED' | 'REJECTED';
      rejectionReason?: string;
      uploadedAt: string;
    }>;
  };
}
```

---

## Approve Verification

Approves a provider's verification application.

```
PATCH /admin/provider-verifications/:providerId/approve
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| providerId | string | Provider ID to approve |

### Request Body

```typescript
{
  providerId: string;
  notes?: string;  // Optional approval notes
}
```

### Response `200`

```typescript
{
  success: true;
  data: {
    id: string;
    status: 'APPROVED';
    approvedAt: string;
  };
}
```

---

## Reject Verification

Rejects a provider's verification application with a reason.

```
PATCH /admin/provider-verifications/:providerId/reject
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| providerId | string | Provider ID to reject |

### Request Body

```typescript
{
  providerId: string;
  reason: string;            // Required, min 5 characters
  documentIds?: string[];    // Specific documents to reject
}
```

### Response `200`

```typescript
{
  success: true;
  data: {
    id: string;
    status: 'REJECTED';
  };
}
```

---

## List Providers

Returns a paginated list of all providers.

```
GET /providers
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number |
| limit | number | No | Items per page |
| query | string | No | Search query |
| status | string | No | Filter by status |

---

## Update Provider Status

Updates a provider's account status (suspend/reactivate).

```
POST /providers/:id/status
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Provider ID |

### Request Body

```typescript
{
  status: 'ACTIVE' | 'SUSPENDED';
  reason: string;  // Required reason for status change
}
```

### Response `200`

```typescript
{
  success: true;
  data: {
    id: string;
    status: 'ACTIVE' | 'SUSPENDED';
  };
}
```
