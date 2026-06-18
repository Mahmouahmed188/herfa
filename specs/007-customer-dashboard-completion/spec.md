# Feature Specification: Customer Dashboard Completion

**Feature Branch**: `007-customer-dashboard-completion`

**Created**: 2026-06-18

**Status**: Draft

**Input**: User description: "Complete the Customer Dashboard experience and ensure it fully represents the backend business capabilities related to customers."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Customer Dashboard with Real Data (Priority: P1)

A logged-in customer lands on their dashboard and sees their real profile information, live booking statistics (active, completed, pending counts), recent activity, and quick action links. No placeholder or mock data is shown.

**Why this priority**: The dashboard is the first page customers see after login. Without real data it provides no value and erodes trust.

**Independent Test**: Can be fully tested by logging in as a customer with known bookings and verifying the dashboard displays matching counts and profile info.

**Acceptance Scenarios**:

1. **Given** a logged-in customer with existing bookings, **When** they navigate to the dashboard, **Then** active, completed, and pending booking counts match the actual backend data.
2. **Given** a logged-in customer, **When** the dashboard loads, **Then** the profile summary displays the customer's real name, email, and phone from the backend.
3. **Given** a logged-in customer with recent booking activity, **When** the dashboard loads, **Then** the recent activity section shows actual booking events in chronological order.

---

### User Story 2 - Browse and Filter Booking History (Priority: P1)

A customer opens their booking history page and sees all their past and current bookings. They can paginate through results, filter by booking status, and sort by date. Each booking shows provider details and payment info when available.

**Why this priority**: Booking history is a core customer need for tracking service usage, invoices, and provider interactions.

**Independent Test**: Can be fully tested by a customer with multiple bookings across different statuses verifying filters produce correct subsets.

**Acceptance Scenarios**:

1. **Given** a customer with 20+ bookings, **When** they open the booking history page, **Then** results are paginated and they can navigate between pages.
2. **Given** a customer with bookings in various statuses, **When** they select a status filter, **Then** only bookings matching that status are displayed.
3. **Given** a customer viewing booking history, **When** they change the sort order, **Then** bookings reorder by date accordingly.

---

### User Story 3 - Manage Notifications (Priority: P2)

A customer views their notifications center and sees unread and read notifications fetched from the backend. They can mark individual notifications as read. The unread count is accurate. Announcements are displayed as a distinct notification type.

**Why this priority**: Notifications keep customers informed about booking status changes, which is essential for a good service experience.

**Independent Test**: Can be fully tested by triggering a booking status change and verifying the corresponding notification appears in the center.

**Acceptance Scenarios**:

1. **Given** a customer with unread notifications, **When** they open the notifications center, **Then** unread notifications are visually distinct from read ones and the count is displayed.
2. **Given** a customer viewing a notification, **When** they mark it as read, **Then** the unread count decreases by one and the notification moves to the read section.
3. **Given** an announcement exists, **When** the customer views the notifications center, **Then** it appears as an announcement-type notification.

---

### User Story 4 - Manage Saved Addresses (Priority: P2)

A customer manages their saved addresses. They can add a new address, edit an existing one, delete one, and set a default. Address forms validate required fields. Saved addresses are available for selection during booking creation.

**Why this priority**: Addresses are required for creating bookings and well-managed addresses streamline the booking flow.

**Independent Test**: Can be fully tested by adding, editing, deleting addresses and verifying the booking flow loads saved addresses.

**Acceptance Scenarios**:

1. **Given** a customer on the address management page, **When** they add a new address with valid fields, **Then** it appears in their saved addresses list.
2. **Given** a customer with multiple addresses, **When** they mark one as default, **Then** that address is pre-selected in the booking form.
3. **Given** a customer with a saved address, **When** they delete it, **Then** it is removed from the list and no longer appears in booking address selection.

---

### User Story 5 - View Active Bookings with Tracking (Priority: P3)

A customer views their active bookings section showing ongoing, upcoming, and pending jobs. Each booking displays the current provider, latest activity, tracking availability, and estimated arrival time when applicable.

**Why this priority**: Active bookings with tracking provide real-time visibility into service delivery, reducing customer anxiety and support calls.

**Independent Test**: Can be fully tested by creating a booking assigned to a provider and verifying the active bookings section displays the correct provider and status.

**Acceptance Scenarios**:

1. **Given** a customer with an ongoing booking assigned to a provider, **When** they view active bookings, **Then** the provider's name and contact info are displayed.
2. **Given** a customer with a trackable active booking, **When** they view active bookings, **Then** a tracking indicator is shown along with estimated arrival time.
3. **Given** a customer with pending requests, **When** they view active bookings, **Then** these requests are listed with their current status.

---

### Edge Cases

- What happens when the backend is unreachable or returns errors for any dashboard API call?
- How does the dashboard behave when a customer has zero bookings (empty state)?
- How does the system handle a customer with an extremely long address list (50+ addresses)?
- What happens when a customer tries to mark a notification as read that was already deleted on the backend?
- How does pagination behave when the total number of bookings changes between page loads (e.g., new booking created)?
- What happens when authentication tokens expire while viewing the dashboard or booking history?
- How does the system handle concurrent updates to the same booking from multiple sessions?
- How does the address form handle RTL/Arabic text input validation?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-SEC**: Access to all customer dashboard pages MUST be guarded by role-based access control — only authenticated customers with the customer role can access these pages.
- **FR-I18N**: All new UI elements MUST support full RTL/Arabic parity consistent with the existing i18n approach.
- **FR-VAL**: All form inputs (address forms) and API responses MUST be validated with proper schemas.
- **FR-DATA**: Server state for all dashboard data (bookings, notifications, addresses, profile) MUST be managed with proper caching and invalidation strategies to ensure data freshness without excessive network requests.
- **FR-001**: System MUST fetch real dashboard statistics (active, completed, pending booking counts) from backend APIs and display them without any hardcoded or mock values.
- **FR-002**: System MUST display the customer's real profile information (name, email, phone, avatar) fetched from the backend on the dashboard.
- **FR-003**: System MUST display all customer bookings with pagination (configurable page size), filtering by status, and sorting by date.
- **FR-004**: System MUST display provider information (name, contact) for each booking that has a provider assigned.
- **FR-005**: System MUST display payment information (amount, status, method) for each booking where payment data is available.
- **FR-006**: System MUST fetch and display real notifications from the backend, distinguishing between unread and read states.
- **FR-007**: Customers MUST be able to mark individual notifications as read, with the unread count updating immediately.
- **FR-008**: System MUST display announcements as a distinct notification type.
- **FR-009**: System MUST support full CRUD operations on customer addresses (create, read, update, delete).
- **FR-010**: Address forms MUST validate required fields (street, city, area/region, building/apartment, label) before submission.
- **FR-011**: Customers MUST be able to select and save a default address, which is pre-selected during booking creation.
- **FR-012**: Saved addresses MUST be available for selection inside the booking creation flow.
- **FR-013**: Active bookings section MUST display ongoing jobs, upcoming jobs, and pending requests in clearly separated groups.
- **FR-014**: Each active booking MUST display the current provider assignment when one exists.
- **FR-015**: System MUST show a tracking indicator and estimated arrival time for bookings where the backend provides tracking data.
- **FR-016**: System MUST generate a comprehensive API audit report (docs/customer-dashboard-audit.md) covering all customer-facing endpoints, their alignment status, DTO mismatches, and missing integrations.

### Key Entities *(include if feature involves data)*

- **Customer**: A registered user with the customer role. Has profile info (name, email, phone, avatar) and can create/manage bookings.
- **Booking**: A service request created by a customer. Has status (pending, active, completed, cancelled, etc.), provider assignment, payment info, dates, and tracking data.
- **Notification**: A system-generated message to a customer about booking updates, announcements, or other events. Has read/unread state, type, and content.
- **Address**: A saved location associated with a customer. Has street, city, area, building details, a label (home/work/other), and a default flag.
- **Provider**: A technician/service provider assigned to a booking. Has name, contact info, and rating.
- **Tracking**: Real-time or near-real-time location/status data for an active booking, including estimated arrival time.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Customers see their real booking statistics (active, completed, pending) within 2 seconds of dashboard page load.
- **SC-002**: Booking history pagination loads each page in under 2 seconds for customers with up to 100 bookings.
- **SC-003**: Customers can complete the booking creation flow (including address selection) in under 3 minutes.
- **SC-004**: Notification mark-as-read updates the unread count within 1 second of user action.
- **SC-005**: Address CRUD operations complete successfully with clear success/error feedback in under 2 seconds.
- **SC-006**: No hardcoded or mock customer data appears on any customer-facing page after implementation.
- **SC-007**: The generated API audit report documents all customer-facing endpoints with alignment status, allowing developers to identify and prioritize integration work.

## Assumptions

- Existing backend APIs for customers, bookings, notifications, addresses, and tracking are available and stable.
- Authentication and session management are already implemented and will be reused.
- The existing layout, sidebar, header, and navigation structure remain unchanged — only content sections are modified.
- Real-time updates for active bookings use polling at reasonable intervals rather than WebSocket connections.
- The tracking system, when available, provides estimated arrival time and a trackable status flag via the booking or a dedicated tracking API.
- Announcements are a subset of notifications with a specific announcement type/category.
- The booking creation flow already exists; this feature adds address selection from saved addresses but does not rebuild the creation flow entirely.
- Page layout, colors, theme, branding, and design language must remain unchanged per the UI rules.
