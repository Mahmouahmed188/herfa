# Feature Specification: Real-Time Tracking System

**Feature Branch**: `010-tracking-system`

**Created**: 2026-06-18

**Status**: Draft

**Input**: User description: "Complete the Real-Time Tracking System and fully integrate all tracking-related business functionality with the backend Tracking Module."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Customer Views Live Provider Tracking (Priority: P1)

A customer who has an active booking wants to see the service provider's real-time location on a map, along with their own destination, estimated arrival time, and current tracking status.

**Why this priority**: This is the core value of the tracking feature — customers need visibility into when their provider will arrive. Without this, the feature has no customer-facing value.

**Independent Test**: Can be fully tested by creating a booking, starting a tracking session, and verifying the customer can see the provider's live position, destination marker, ETA, and status on a map without refreshing the page.

**Acceptance Scenarios**:

1. **Given** a customer has an active booking with tracking enabled, **When** they navigate to the tracking view, **Then** they see the provider's current location displayed as a marker on the map
2. **Given** a customer is viewing the tracking map, **When** the provider moves, **Then** the provider marker updates position in real-time without page refresh
3. **Given** a customer has an active tracking session, **When** they view the tracking page, **Then** they see the customer destination marked on the map
4. **Given** a tracking session is active, **When** the customer views the tracking details, **Then** they see the estimated arrival time and last updated timestamp
5. **Given** a tracking session changes status, **When** the customer is viewing tracking, **Then** the displayed status updates to reflect the change

---

### User Story 2 - Provider Updates Location During Job (Priority: P1)

A service provider who has accepted a job needs their location to be transmitted in real-time so the customer can track their progress.

**Why this priority**: Real-time location updates are the foundation of the tracking system. Without provider location data, no tracking map or ETA can function.

**Independent Test**: Can be fully tested by starting a tracking session as a provider, moving the provider's simulated location, and verifying the updated coordinates are received by the backend and reflected on the customer's map.

**Acceptance Scenarios**:

1. **Given** a provider has an active job with tracking, **When** the provider's location is updated, **Then** the new coordinates are transmitted in real-time to the backend
2. **Given** a provider is sending location updates, **When** the WebSocket connection is interrupted, **Then** the system automatically reconnects and resumes sending updates
3. **Given** a provider's connection drops, **When** they come back online, **Then** their current location is immediately transmitted
4. **Given** a provider is on a job, **When** they go offline, **Then** the customer sees the provider as offline with the last known location

---

### User Story 3 - Customer and Provider Manage Tracking Session Lifecycle (Priority: P2)

Users need to see the full lifecycle of a tracking session — when it starts, if it pauses, when it resumes, and when it completes — along with a chronological timeline of events.

**Why this priority**: Session lifecycle visibility builds trust and transparency. Users need to know not just where the provider is, but what happened during the trip.

**Independent Test**: Can be fully tested by observing a tracking session through its lifecycle states (pending, active, paused, completed, cancelled) and verifying each state transition is reflected in the UI with correct timestamps.

**Acceptance Scenarios**:

1. **Given** a tracking session exists, **When** a user views the session details, **Then** they see the current session status
2. **Given** a tracking session is active, **When** the provider pauses tracking, **Then** the session status changes to paused and the pause time is recorded
3. **Given** a paused tracking session, **When** the provider resumes, **Then** the status changes back to active and the resume time is recorded
4. **Given** a tracking session completes, **When** the user views the session, **Then** they see the completion time and total session duration
5. **Given** a tracking session, **When** the user views the timeline, **Then** they see a chronological list of all status changes, location events, and provider actions with timestamps

---

### User Story 4 - Customer Reviews Past Tracking History (Priority: P3)

A customer wants to review past tracking sessions, including routes taken, duration, and status history for completed jobs.

**Why this priority**: Tracking history provides value for record-keeping and accountability, but is less critical than live tracking and session management.

**Independent Test**: Can be fully tested by completing multiple tracking sessions, then navigating to the tracking history page and verifying past sessions are listed with correct details, pagination, and filtering.

**Acceptance Scenarios**:

1. **Given** a customer has past tracking sessions, **When** they navigate to tracking history, **Then** they see a paginated list of past sessions
2. **Given** the tracking history list, **When** the user applies filters, **Then** the list updates to show only matching sessions
3. **Given** a past tracking session, **When** the user selects it, **Then** they see session details including status changes, duration, start/end times, and route summary if available

---

### User Story 5 - User Receives Real-Time Tracking Notifications (Priority: P2)

Users (both customer and provider) receive notifications triggered by tracking events such as provider started route, provider arrived, tracking paused, tracking resumed, and job completed.

**Why this priority**: Notifications keep users informed without requiring them to actively monitor the tracking page. They connect the tracking system to the broader notification ecosystem.

**Independent Test**: Can be fully tested by triggering each tracking event and verifying the corresponding notification is delivered to the intended user with correct content and a link to the relevant tracking page.

**Acceptance Scenarios**:

1. **Given** a provider starts a route, **When** the tracking session begins, **Then** the customer receives a "provider started route" notification
2. **Given** a provider is en route, **When** the provider pauses tracking, **Then** the customer receives a "tracking paused" notification
3. **Given** a tracking session is paused, **When** the provider resumes, **Then** the customer receives a "tracking resumed" notification
4. **Given** a provider arrives at the destination, **When** tracking completes, **Then** the customer receives a "provider arrived" notification
5. **Given** a job is completed, **When** the tracking session ends, **Then** the relevant user receives a "job completed" notification
6. **Given** a user receives a tracking notification, **When** they click on it, **Then** they are directed to the relevant tracking or booking page

---

### Edge Cases

- What happens when the provider's internet connection drops during a live tracking session — does the customer see stale data or an offline indicator?
- How does the system handle tracking sessions for bookings that are cancelled mid-route?
- What happens when two tracking sessions are active simultaneously for the same provider?
- How does the map behave when GPS coordinates are temporarily inaccurate or unavailable?
- What happens when a user tries to view tracking history with no past sessions?
- How does the system handle concurrent WebSocket subscriptions from multiple devices for the same user?
- What happens when the ETA cannot be calculated due to missing route data?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display the provider's current location on a map as a visual marker that updates in real-time.
- **FR-002**: The system MUST display the customer's destination location on the map.
- **FR-003**: The system MUST display the current tracking session status (pending, active, paused, completed, cancelled).
- **FR-004**: The system MUST display the estimated arrival time and update it as the provider moves.
- **FR-005**: The system MUST display a "last updated" timestamp for the provider location.
- **FR-006**: The system MUST display provider online/offline state during live tracking.
- **FR-007**: The system MUST support visualizing a route between provider and customer locations on the map when route data is available.
- **FR-008**: The system MUST display full tracking session information including start time, pause time, resume time, completion time, and total duration.
- **FR-009**: The system MUST display a chronological tracking timeline showing status changes, provider movement events, pause/resume events, and completion events with timestamps.
- **FR-010**: The system MUST update the UI in real-time (without page refresh) when new location data arrives via WebSocket.
- **FR-011**: The system MUST handle WebSocket disconnections gracefully and automatically attempt reconnection.
- **FR-012**: The system MUST display the last known provider location when the provider is offline or connection is lost.
- **FR-013**: The system MUST provide a tracking history page listing past tracking sessions with pagination support.
- **FR-014**: The system MUST support filtering past tracking sessions by date range, status, or other available criteria.
- **FR-015**: The system MUST allow users to view detailed information for any past tracking session, including route summary if available.
- **FR-016**: Active bookings MUST display the current tracking status where applicable.
- **FR-017**: The system MUST automatically launch tracking when a provider starts a route for an active booking.
- **FR-018**: Booking status updates MUST reflect tracking events (e.g., booking status changes when provider starts route, arrives, completes job).
- **FR-019**: The system MUST trigger notifications for tracking events: provider started route, provider arrived, tracking paused, tracking resumed, and job completed.
- **FR-020**: Tracking notifications MUST include links that navigate the user to the relevant tracking or booking page.
- **FR-021**: The system MUST verify WebSocket event subscriptions include proper authentication and authorization.
- **FR-022**: The system MUST NOT use mock or fallback tracking data — all tracking data must come from the backend.

### Key Entities *(include if feature involves data)*

- **Tracking Session**: Represents a single tracking instance linked to a booking/job. Contains status (pending, active, paused, completed, cancelled), start time, pause time, resume time, completion time, and duration.
- **Location Update**: A record of the provider's geographic coordinates (latitude, longitude) at a specific timestamp during a tracking session.
- **Tracking Event**: A chronological entry in the tracking timeline representing status changes, location updates, or provider actions during a session.
- **Tracking History**: A collection of completed tracking sessions accessible with pagination and filtering for review.
- **Notification (Tracking)**: A notification triggered by a tracking lifecycle event, containing event type, relevant session reference, and navigation link.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Customers can see the provider's live location update on the map within 5 seconds of the provider's actual movement.
- **SC-002**: WebSocket reconnection occurs automatically within 30 seconds of a disconnection without user intervention.
- **SC-003**: Users can view complete session details (status, timestamps, duration) for any active or past tracking session.
- **SC-004**: All five tracking notification types (started route, arrived, paused, resumed, completed) are delivered to the correct user when the corresponding tracking event occurs.
- **SC-005**: Clicking a tracking notification navigates the user to the correct tracking or booking detail page.
- **SC-006**: Tracking history pages load and display past sessions within 3 seconds for up to 100 completed sessions.
- **SC-007**: No mock or fallback tracking data is displayed anywhere in the application — all tracking data originates from the backend.

## Assumptions

- The backend Tracking Module already provides all necessary APIs, WebSocket events, and data models for tracking functionality.
- The existing map rendering library used by the project supports real-time marker updates and will be reused.
- Providers have GPS-capable devices and grant location permissions.
- Users have stable internet connectivity for real-time updates; offline scenarios are handled by showing the last known state.
- The existing authentication and notification systems will be reused without modification.
- The backend WebSocket Gateway handles authentication, authorization, and connection management; the frontend only needs to subscribe to the correct events.
- Tracking data retention follows the backend's existing policies — no additional data retention requirements are introduced.
- Mobile/responsive layout is already supported by the existing design system; no new mobile-specific requirements are introduced.
- The existing booking and job management pages already exist and only need tracking integration.
