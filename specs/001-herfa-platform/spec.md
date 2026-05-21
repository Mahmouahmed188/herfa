# Feature Specification: Herfa Platform

**Feature Branch**: `001-herfa-platform`

**Created**: 2026-05-21

**Status**: Draft

**Input**: User description: "Complete product specification for Herfa service marketplace platform connecting customers with service providers."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Customer Books a Service (Priority: P1)

**Description**: As a customer, I want to find a verified plumber and book a service for my home so that I can fix a leak quickly.

**Why this priority**: Core value proposition for customers.

**Independent Test**: Can be tested by creating a booking request and verifying it appears in the provider's feed.

**Acceptance Scenarios**:
1. **Given** a logged-in customer, **When** they select "Plumbing" and provide details, **Then** a booking request is created.
2. **Given** a created booking, **When** a provider accepts it, **Then** the customer receives a real-time notification.

---

### User Story 2 - Provider Completes a Job (Priority: P1)

**Description**: As a service provider, I want to accept a booking and mark it as completed so that I can receive payment in my wallet.

**Why this priority**: Core value proposition for providers.

**Independent Test**: Can be tested by transitioning a booking through its lifecycle states.

**Acceptance Scenarios**:
1. **Given** an assigned booking, **When** the provider starts the job, **Then** the status updates to "In Progress".
2. **Given** an "In Progress" job, **When** the provider marks it "Completed", **Then** a payment transaction is initiated.

---

### User Story 3 - Admin Resolves a Dispute (Priority: P2)

**Description**: As an admin, I want to review a disputed booking and decide on a refund so that both parties are treated fairly.

**Why this priority**: Essential for platform trust and safety.

**Independent Test**: Can be tested by creating a dispute and verifying admin intervention options.

**Acceptance Scenarios**:
1. **Given** a disputed booking, **When** the admin reviews the chat logs, **Then** they can issue a partial or full refund.

### Edge Cases
- **EC-01**: How does the layout handle RTL (Arabic) text expansion/contraction in long service descriptions?
- **EC-02**: What happens when authentication tokens expire during a multi-step booking flow?
- **EC-03**: How does the system handle concurrent updates to the same booking (e.g., two providers accepting at once)?
- **EC-04**: What happens when a user switches language mid-session while in a live chat?
- **EC-05**: How does the system handle network disconnection during real-time tracking?

## Requirements *(mandatory)*

### Functional Requirements

#### Authentication & Authorization
- **FR-AUTH-01**: System MUST support registration and login via Phone/OTP, Email/Password, and Social Login (Google/Apple).
- **FR-AUTH-02**: System MUST implement JWT-based authentication with Refresh Token rotation.
- **FR-AUTH-03**: System MUST enforce Role-Based Access Control (RBAC) for Customers, Providers, and Admins.

#### User Profiles
- **FR-PROF-01**: Providers MUST upload verification documents (ID, Licenses) for Admin approval.
- **FR-PROF-02**: Providers MUST be able to set their availability schedule and service categories.
- **FR-PROF-03**: Customers MUST be able to manage their addresses and payment methods.

#### Booking & Tracking
- **FR-BOOK-01**: System MUST support a full booking lifecycle: Draft -> Pending -> Assigned -> In Progress -> Completed -> Cancelled.
- **FR-BOOK-02**: System MUST provide real-time location tracking of the provider once the booking is "In Progress".
- **FR-BOOK-03**: System MUST support booking rescheduling and cancellation with defined penalty rules.

#### Payments & Wallet
- **FR-PAY-01**: System MUST integrate with Stripe and local payment gateways for secure transactions.
- **FR-PAY-02**: System MUST maintain an in-app wallet for providers to track earnings and request payouts.
- **FR-PAY-03**: System MUST handle automated commission calculation and platform fees.

#### Real-time Communication
- **FR-CHAT-01**: System MUST support real-time messaging between Customer and Provider using Socket.IO.
- **FR-CHAT-02**: Chat MUST support media attachments (images/videos) stored on Cloudinary.

#### Notifications
- **FR-NOT-01**: System MUST send push notifications via Firebase Cloud Messaging (FCM) for all state changes.
- **FR-NOT-02**: System MUST support fallback notifications via Email and SMS.

#### Admin Dashboard
- **FR-ADM-01**: Admins MUST have a comprehensive dashboard for user moderation, financial reporting, and system analytics.

### Non-Functional Requirements
- **NFR-SCAL**: System MUST be architected to support millions of concurrent users (Horizontal scaling).
- **NFR-PERF**: API p95 response time MUST be under 200ms for core booking operations.
- **NFR-I18N**: UI MUST support full parity for Arabic (RTL) and English (LTR).
- **NFR-SEC**: All PII data MUST be encrypted at rest and in transit.

### Key Entities *(include if feature involves data)*
- **User**: Base entity for authentication.
- **Customer/Provider**: Profile extensions for specific roles.
- **Booking**: Central entity managing the service transaction.
- **Transaction**: Records all wallet and payment movements.
- **Message**: Real-time communication record.
- **Review**: Customer feedback for providers.

## Success Criteria *(mandatory)*

### Measurable Outcomes
- **SC-001**: Users can complete a booking request in under 60 seconds.
- **SC-002**: 99.9% of real-time notifications are delivered within 2 seconds of the event.
- **SC-003**: System handles 10,000 concurrent socket connections without degradation.
- **SC-004**: Zero unauthorized access incidents recorded in the first 6 months of operation.

## Assumptions
- **ASSUM-01**: Customers and Providers have access to a stable internet connection for real-time features.
- **ASSUM-02**: Stripe and Cloudinary services are available in the target regions.
- **ASSUM-03**: Users will grant necessary permissions for GPS tracking and push notifications.
