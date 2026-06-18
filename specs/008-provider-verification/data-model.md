# Data Model: Provider Verification System

## Entity Overview

The verification system manages the process of verifying service providers (technicians) on the Herfa platform. It tracks verification applications, uploaded documents, status transitions, and history events.

---

## Entity: `VerificationApplication`

Represents a provider's request to become verified on the platform.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Yes | Unique identifier |
| providerId | string (UUID) | Yes | The provider submitting verification |
| providerName | string | Yes | Provider's display name |
| status | VerificationStatus (enum) | Yes | Current verification state |
| adminNote | string | No | Note from admin reviewer (rejection reason or approval note) |
| submittedAt | string (ISO 8601) | Yes | When verification was submitted |
| updatedAt | string (ISO 8601) | Yes | When status last changed |
| approvedAt | string (ISO 8601) | No | When verification was approved |
| reviewedBy | string | No | Admin who reviewed the application |

### Status Transitions

```
PENDING → UNDER_REVIEW → APPROVED
PENDING → UNDER_REVIEW → REJECTED → PENDING (resubmit)
APPROVED → SUSPENDED
SUSPENDED → APPROVED (reactivate)
```

### Validation Rules
- A provider can only have one active verification application
- Resubmission is only allowed after rejection
- Suspended providers must be reactivated by an admin

---

## Entity: `VerificationDocument`

A file uploaded as part of a verification application.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Yes | Unique identifier |
| verificationId | string (UUID) | Yes | Parent verification application |
| type | DocumentType (enum) | Yes | Category of document |
| url | string (URL) | Yes | Uploaded file URL |
| filename | string | Yes | Original filename |
| status | DocumentStatus (enum) | Yes | Individual document review status |
| rejectionReason | string | No | Why this specific document was rejected |
| uploadedAt | string (ISO 8601) | Yes | When document was uploaded |

### Document Types Enum

| Value | Label | Description |
|-------|-------|-------------|
| `NATIONAL_ID` | National ID | Government-issued identity card |
| `PASSPORT` | Passport | Valid passport photo page |
| `DRIVER_LICENSE` | Driver License | Valid driver's license |
| `PROFESSIONAL_CERTIFICATE` | Professional Certificate | Trade or professional certification |
| `TRADE_LICENSE` | Trade License | Business/trade operating license |
| `BUSINESS_REGISTRATION` | Business Registration | Company registration documents |

### Document Status Enum

| Value | Label | Description |
|-------|-------|-------------|
| `PENDING` | Pending | Awaiting review |
| `APPROVED` | Approved | Document accepted |
| `REJECTED` | Rejected | Document rejected — provider must resubmit |

### Validation Rules
- Max file size: 5MB per document
- Supported formats: JPEG, PNG, PDF
- Each document type can have at most one active upload (replacement replaces existing)
- Document-level rejection provides a per-document reason

---

## Enum: `VerificationStatus`

| Value | Display Label | Description |
|-------|---------------|-------------|
| `PENDING` | Pending | Submitted, not yet reviewed |
| `UNDER_REVIEW` | Under Review | Being reviewed by an admin |
| `APPROVED` | Approved | Verification accepted |
| `REJECTED` | Rejected | Verification denied with reason |
| `SUSPENDED` | Suspended | Previously approved, now suspended by admin |

---

## Enum: `DocumentType`

| Value | Display Label |
|-------|---------------|
| `NATIONAL_ID` | National ID |
| `PASSPORT` | Passport |
| `DRIVER_LICENSE` | Driver License |
| `PROFESSIONAL_CERTIFICATE` | Professional Certificate |
| `TRADE_LICENSE` | Trade License |
| `BUSINESS_REGISTRATION` | Business Registration Documents |

---

## Entity: `VerificationHistoryEvent`

An individual event in the verification timeline.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Yes | Unique identifier |
| verificationId | string (UUID) | Yes | Parent verification application |
| eventType | EventType (enum) | Yes | Type of event |
| fromStatus | VerificationStatus | No | Previous status (for transitions) |
| toStatus | VerificationStatus | No | New status (for transitions) |
| actor | string | No | Who performed the action (admin name or "system") |
| description | string | Yes | Human-readable event description |
| timestamp | string (ISO 8601) | Yes | When the event occurred |
| metadata | Record<string, any> | No | Additional event-specific data |

### Event Types Enum

| Value | Description |
|-------|-------------|
| `SUBMITTED` | Provider submitted verification |
| `STATUS_CHANGE` | Verification status changed |
| `DOCUMENT_UPLOADED` | New document uploaded |
| `DOCUMENT_REPLACED` | Existing document replaced |
| `DOCUMENT_REJECTED` | Specific document rejected |
| `REVIEWER_ASSIGNED` | Admin assigned to review |
| `NOTE_ADDED` | Admin added a note |
| `RESUBMITTED` | Provider resubmitted after rejection |

---

## Relationships

```
VerificationApplication (1) ──── (N) VerificationDocument
VerificationApplication (1) ──── (N) VerificationHistoryEvent
```

---

## State Machine Diagram

```text
                    ┌──────────────────────────────────┐
                    │                                  │
                    ▼                                  │
              ┌──────────┐     ┌──────────────┐     ┌──────────┐
              │ PENDING  │────▶│ UNDER_REVIEW │────▶│ APPROVED │
              └──────────┘     └──────────────┘     └──────────┘
                    ▲                                    │
                    │                                    │
                    │                              ┌──────────┐
                    │                              │SUSPENDED │
                    │                              └──────────┘
                    │                                    │
                    └────────────────────────────────────┘
                             (resubmit after reject)
```
