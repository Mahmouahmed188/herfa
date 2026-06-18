# Provider Verification API Contract

**Base URL**: `/api/v1` | **Auth**: Bearer token (JWT)

---

## Submit Verification

Submits a new verification application for the authenticated provider.

```
POST /verification/submit
```

### Request Body

```typescript
{
  frontIdImage: string;    // URL of uploaded front ID image
  backIdImage: string;     // URL of uploaded back ID image
  personalPhoto: string;   // URL of uploaded personal photo
  documents: string[];     // URLs of uploaded professional documents
  portfolio: string[];     // URLs of uploaded portfolio images
}
```

### Response `200`

```typescript
{
  success: true;
  data: {
    id: string;
    status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
    submittedAt: string;  // ISO 8601
  };
}
```

### Response `400` — Validation Error

```typescript
{
  success: false;
  error: {
    code: 'VALIDATION_ERROR';
    message: string;
    fields?: Record<string, string[]>;
  };
}
```

### Response `409` — Already Submitted

```typescript
{
  success: false;
  error: {
    code: 'ALREADY_SUBMITTED';
    message: 'A verification application already exists for this provider';
  };
}
```

---

## Get Verification Status

Returns the current verification status and details for the authenticated provider.

```
GET /verification/status
```

### Response `200`

```typescript
{
  success: true;
  data: {
    id: string;
    status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
    adminNote?: string;
    frontIdImage?: string;
    backIdImage?: string;
    personalPhoto?: string;
    documents: Array<{
      id: string;
      type: string;
      url: string;
      status: 'PENDING' | 'APPROVED' | 'REJECTED';
      rejectionReason?: string;
      uploadedAt: string;
    }>;
    portfolio: string[];
    submittedAt: string;
    approvedAt?: string;
    reviewedBy?: string;
  };
}
```

### Response `404` — No Verification

```typescript
{
  success: false;
  error: {
    code: 'NOT_FOUND';
    message: 'No verification application found';
  };
}
```

---

## Upload Document

Uploads a file and returns its URL for use in verification submission.

```
POST /uploads
```

### Request

`multipart/form-data` with:
- `file`: The file to upload (JPEG, PNG, or PDF)

### Response `200`

```typescript
{
  url: string;  // The accessible URL of the uploaded file
}
```

### Response `400`

```typescript
{
  success: false;
  error: {
    code: 'INVALID_FILE';
    message: string;  // e.g., "File too large (max 5MB)", "Unsupported file format"
  };
}
```

---

## Get Verification History

Returns the timeline of events for the authenticated provider's verification.

```
GET /verification/history
```

### Response `200`

```typescript
{
  success: true;
  data: Array<{
    id: string;
    eventType: 'SUBMITTED' | 'STATUS_CHANGE' | 'DOCUMENT_UPLOADED' | 'DOCUMENT_REPLACED' | 'DOCUMENT_REJECTED' | 'REVIEWER_ASSIGNED' | 'NOTE_ADDED' | 'RESUBMITTED';
    fromStatus?: string;
    toStatus?: string;
    actor?: string;
    description: string;
    timestamp: string;  // ISO 8601
    metadata?: Record<string, any>;
  }>;
}
```
