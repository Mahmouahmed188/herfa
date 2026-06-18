# Feature Specification: Reviews & Ratings System

**Feature Branch**: `011-reviews-ratings-system`

**Created**: 2026-06-18

**Status**: Draft

**Input**: User description: "Complete the Reviews & Ratings System and fully integrate all review-related business functionality with the backend Reviews Module."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Customer Creates a Review for a Completed Booking (Priority: P1)

A customer who has completed a booking wants to leave a rating and written review for the service provider, providing feedback on their experience.

**Why this priority**: Review creation is the entry point for the entire reviews system — without submitted reviews, no ratings data, history, or analytics can function.

**Independent Test**: Can be fully tested by a customer navigating to a completed booking, filling out the review form (star rating + optional comment), submitting, and receiving a success confirmation. Delivers core review creation value.

**Acceptance Scenarios**:

1. **Given** a customer has a completed booking eligible for review, **When** they navigate to the review creation page, **Then** they see a review form with star rating selection and a comment field
2. **Given** a customer selects a star rating and enters a comment, **When** they submit the review, **Then** the system validates the input and confirms successful submission
3. **Given** a customer submits a review without meeting the minimum rating selection, **When** validation runs, **Then** an appropriate error message is displayed
4. **Given** a customer submits an invalid review (e.g., duplicate, booking not eligible), **When** the backend rejects it, **Then** the backend validation error message is displayed
5. **Given** a customer has already submitted a review for a booking, **When** they attempt to submit another, **Then** the system prevents duplicate submission according to backend rules
6. **Given** a review is created successfully, **When** the submission completes, **Then** a success confirmation is shown with the review details

---

### User Story 2 — Customer Edits Their Existing Review (Priority: P2)

A customer wants to update or modify a review they previously submitted, correcting their rating or updating their comment.

**Why this priority**: Review editing empowers customers to refine their feedback and ensures accuracy of the reviews system.

**Independent Test**: Can be fully tested by a customer navigating to an existing review, editing the rating and/or comment, submitting, and seeing the updated review with refreshed data. Delivers review editing value independently.

**Acceptance Scenarios**:

1. **Given** a customer has an existing review, **When** they navigate to the edit review page, **Then** the form is pre-filled with the existing rating and comment data
2. **Given** a customer modifies their rating and/or comment, **When** they submit the edit, **Then** the system validates the updated content and confirms the update
3. **Given** a customer submits an invalid edit, **When** the backend rejects the update, **Then** the error message is displayed
4. **Given** a review is updated successfully, **When** the update completes, **Then** the displayed review data refreshes to reflect the changes
5. **Given** a customer is not the owner of the review, **When** they attempt to edit, **Then** the system prevents the action based on backend ownership validation

---

### User Story 3 — Customer and Provider View Review Details (Priority: P2)

Any user with access to a review wants to see its full details including rating, comment, timestamps, reviewer and provider information, and moderation status when exposed.

**Why this priority**: Review details provide transparency and context — users need to see full review information to make informed decisions about providers.

**Independent Test**: Can be fully tested by navigating to a review detail view and verifying all metadata (rating, comment, reviewer, provider, dates, moderation status) is displayed correctly. Delivers review visibility value independently.

**Acceptance Scenarios**:

1. **Given** a review exists, **When** a user views the review details, **Then** they see the rating score, comment text, creation date, and last update date
2. **Given** a review has reviewer information available, **When** the details load, **Then** the reviewer's name or identifier is displayed
3. **Given** a review has provider information, **When** the details load, **Then** the provider's name or identifier is displayed
4. **Given** the review has a moderation status that is publicly exposed, **When** the details load, **Then** the moderation status is displayed
5. **Given** a review's moderation status is not publicly exposed, **When** the details load, **Then** the moderation status is hidden

---

### User Story 4 — Customer Views Their Review History (Priority: P2)

A customer wants to see a history of all reviews they have written, with the ability to search, filter, and sort through them.

**Why this priority**: Review history gives customers a complete view of their feedback activity and enables them to manage their reviews effectively.

**Independent Test**: Can be fully tested by a customer with multiple reviews viewing the history page, applying filters, sorting, navigating pages, and clicking into individual reviews. Delivers history value independently.

**Acceptance Scenarios**:

1. **Given** a customer has written multiple reviews, **When** they navigate to their review history, **Then** they see a paginated list of their reviews
2. **Given** a customer wants to filter their review history, **When** they apply filters (by provider, date range, rating, status), **Then** only matching reviews are displayed
3. **Given** a customer wants to sort reviews, **When** they select a sort option (by date, rating), **Then** reviews are displayed in the selected order
4. **Given** a customer wants to see full details of a review, **When** they click on a review in the list, **Then** they are navigated to the review detail view

---

### User Story 5 — Provider Views Ratings and Reviews They Have Received (Priority: P1)

A provider wants to see a summary of their ratings (average, breakdown, total count) and browse all reviews customers have left for them.

**Why this priority**: Provider ratings are the core business value of the reviews system — they enable providers to understand their service quality and customers to make informed choices.

**Independent Test**: Can be fully tested by a provider viewing their rating summary (average, distribution, count) and browsing paginated reviews from customers. Delivers ratings value independently.

**Acceptance Scenarios**:

1. **Given** a provider has received reviews, **When** they view their ratings dashboard, **Then** they see the average rating, total review count, and rating distribution (count per star level)
2. **Given** a provider wants to see individual reviews, **When** they browse their reviews, **Then** they see a paginated list of all reviews received
3. **Given** a provider wants to filter received reviews, **When** they apply filters, **Then** only matching reviews are displayed
4. **Given** a provider wants to sort received reviews, **When** they select a sort option, **Then** reviews are displayed in the selected order

---

### User Story 6 — Public User Views Provider Reviews Without Authentication (Priority: P2)

A potential customer browsing the platform wants to see a provider's public reviews and ratings to decide whether to book their services, without needing to log in.

**Why this priority**: Public reviews drive customer trust and purchasing decisions — making them accessible without authentication maximizes their impact.

**Independent Test**: Can be fully tested by an unauthenticated user visiting a provider's public profile page and viewing the provider's reviews with pagination and sorting. Delivers public review value independently.

**Acceptance Scenarios**:

1. **Given** a provider has published reviews, **When** an unauthenticated user visits the provider's public profile, **Then** they see the provider's rating summary and public reviews
2. **Given** a public user wants to browse more reviews, **When** they paginate through the reviews list, **Then** additional reviews load correctly
3. **Given** a public user wants to sort reviews, **When** they select a sort option, **Then** reviews are sorted accordingly
4. **Given** authentication is required by the backend for certain review data, **When** an unauthenticated user views the page, **Then** only publicly accessible review data is shown

---

### User Story 7 — Provider Manages Reviews Through a Dashboard (Priority: P3)

A provider wants a dedicated dashboard to view all reviews received, aggregated rating metrics, and review trends over time.

**Why this priority**: A review management dashboard gives providers actionable insights into their service quality and customer satisfaction trends.

**Independent Test**: Can be fully tested by a provider accessing their review dashboard, viewing aggregated metrics (average, distribution), recent reviews, and trends if provided by backend APIs. Delivers management value independently.

**Acceptance Scenarios**:

1. **Given** a provider accesses their review dashboard, **When** the dashboard loads, **Then** aggregated rating metrics (average, count, distribution) are displayed
2. **Given** a provider is on the review dashboard, **When** recent reviews are available, **Then** they see the most recent reviews
3. **Given** the backend provides review trend data, **When** the dashboard loads, **Then** review trends are displayed
4. **Given** the backend does not provide trend data, **When** the dashboard loads, **Then** the trends section is gracefully hidden

---

### User Story 8 — Users See Review Moderation States (Priority: P3)

Users see appropriate indicators when a review is in a moderated state (hidden, flagged, removed, pending moderation), respecting backend rules for information exposure.

**Why this priority**: Moderation awareness ensures the reviews system maintains quality and trust while properly handling problematic content.

**Independent Test**: Can be fully tested by viewing reviews in various moderation states and verifying the appropriate UI indicators are shown or hidden according to backend rules. Delivers moderation awareness independently.

**Acceptance Scenarios**:

1. **Given** a review is hidden by moderation, **When** displayed, **Then** an appropriate hidden state indicator is shown (if exposed)
2. **Given** a review is flagged, **When** displayed, **Then** a flagged state indicator is shown (if exposed)
3. **Given** a review is removed by moderation, **When** displayed, **Then** a removed state indicator is shown (if exposed)
4. **Given** a review is pending moderation, **When** displayed, **Then** a pending state indicator is shown (if exposed)
5. **Given** the backend does not expose certain moderation details publicly, **When** displayed, **Then** restricted information is hidden

---

### Edge Cases

- What happens when a customer tries to review a booking that is not yet completed?
- How does the system handle a customer attempting to submit a duplicate review for the same booking?
- What happens when a provider has no reviews yet (zero state)?
- How does the UI handle a very large number of reviews in the history list?
- What happens when authentication expires during review submission?
- How does the system display reviews when the backend returns empty review history?
- What happens when a review is moderated (hidden/removed) while a user is viewing it?
- How does pagination behave when the total number of reviews changes between pages?
- What happens when a provider is deleted or deactivated but has existing reviews?
- How does the system handle concurrent edit attempts on the same review?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-SEC**: Access MUST be guarded by role-based access control (RBAC) at route and component levels — customers can write/edit their own reviews, providers can view received reviews, admins can moderate.
- **FR-I18N**: UI MUST support full RTL/Arabic parity using `next-intl` or `i18next`.
- **FR-VAL**: All form inputs and API responses MUST be validated via Zod schemas matching backend DTOs.
- **FR-DATA**: Server state MUST be managed via TanStack Query with appropriate cache invalidation after review create/update operations.
- **FR-001**: Customers MUST be able to create a review for a completed booking by selecting a star rating (1-5) and optionally providing a comment — connected to backend review creation APIs.
- **FR-002**: The review creation form MUST validate that a rating is selected before submission, preventing incomplete submissions.
- **FR-003**: Backend validation errors from review creation APIs MUST be displayed to the user, including duplicate submission prevention and booking eligibility errors.
- **FR-004**: A success confirmation MUST be displayed after a review is successfully created, showing the submitted review details.
- **FR-005**: Customers MUST be able to edit their existing reviews via an edit form pre-filled with the current rating and comment — connected to backend review update APIs.
- **FR-006**: Review editing MUST respect backend ownership validation — only the original reviewer can edit a review.
- **FR-007**: Updated review content MUST pass backend validation, with error messages displayed on failure.
- **FR-008**: Review data MUST refresh after a successful update to reflect the modified content.
- **FR-009**: Review details view MUST display: review ID, reviewer name/info, provider name/info, rating score, comment text, creation date, last update date, and moderation status (when publicly exposed by the backend).
- **FR-010**: Customers MUST be able to view their complete review history in a paginated list — connected to backend review history APIs.
- **FR-011**: Customer review history MUST support filtering by provider, date range, rating, and moderation status (as supported by the backend).
- **FR-012**: Customer review history MUST support sorting by date and rating.
- **FR-013**: Customer review history items MUST link to the full review detail view.
- **FR-014**: Providers MUST be able to view their rating summary including average rating, total review count, and rating distribution (count per star level) — sourced from backend provider rating statistics endpoints.
- **FR-015**: Providers MUST be able to view all reviews they have received in a paginated list — connected to backend provider review APIs.
- **FR-016**: Provider review list MUST support filtering and sorting as supported by the backend.
- **FR-017**: Public (unauthenticated) users MUST be able to view provider reviews when the backend allows public access — connected to public review APIs.
- **FR-018**: Public provider reviews MUST support pagination and sorting.
- **FR-019**: Only publicly accessible data MUST be shown to unauthenticated users — authentication-gated data must be hidden.
- **FR-020**: Providers MUST have a review management dashboard displaying aggregated rating metrics, recent reviews, and review trends (when provided by the backend).
- **FR-021**: The review management dashboard MUST show average rating, total review count, and rating distribution.
- **FR-022**: Moderation state indicators MUST be displayed for reviews based on backend moderation rules: hidden, flagged, removed, and pending moderation states.
- **FR-023**: Restricted moderation information MUST NOT be exposed beyond what the backend publicly provides.
- **FR-024**: The review creation action MUST only appear on completed bookings that are eligible for review according to backend rules.
- **FR-025**: Completed bookings MUST link directly to the review creation flow.
- **FR-026**: Existing reviews on bookings MUST display correctly in booking detail views.
- **FR-027**: Review status MUST be synchronized with the backend — no stale or cached review state when data changes.
- **FR-028**: Review-related notifications MUST be integrated for events: Review Created, Review Updated, and Review Moderated (as supported by the backend).
- **FR-029**: Review notifications MUST be displayed within the existing notifications system.
- **FR-030**: The UI MUST update automatically when review-related notification events are received (when real-time updates are available).
- **FR-031**: No mock review data MUST remain — all review and rating data must come from real backend APIs.
- **FR-032**: An API audit document MUST be generated at `docs/reviews-ratings-audit.md` documenting endpoint coverage, mismatches, DTO mismatches, validation issues, permission issues, and missing integrations for Reviews, Provider Reviews, Public Reviews, Admin Reviews, and Provider Rating Statistics APIs.

### Key Entities *(include if feature involves data)*

- **Review**: A customer's rating and feedback for a service provider after a completed booking. Contains rating score (1-5), comment text, creation/update timestamps, moderation status, and associations to the reviewer (customer) and provider.
- **Rating Statistics**: Aggregated provider rating data including average rating, total review count, and rating distribution (number of reviews per star level). Computed from individual reviews.
- **Moderation State**: The current moderation status of a review (e.g., pending, approved, hidden, flagged, removed). Drives UI display of review visibility and state indicators.
- **Review Event**: A lifecycle event associated with a review (created, updated, moderated). Triggers notifications and can drive real-time UI updates when the notification system supports it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Customers can complete the review creation flow (navigate from completed booking, select rating, optionally enter comment, submit) in under 2 minutes.
- **SC-002**: Review edits reflect the updated rating and comment immediately after successful submission — no stale data persists longer than the next page load.
- **SC-003**: Review details accurately display all available review data (rating, comment, reviewer, provider, timestamps, moderation status when exposed) for 100% of reviews.
- **SC-004**: Customer review history displays all written reviews with pagination, filtering, and sorting — all sourced from backend APIs.
- **SC-005**: Provider rating summary (average, total count, distribution) matches the backend-provided statistics for 100% of queries.
- **SC-006**: Public provider reviews display correctly for unauthenticated users, showing only publicly accessible data, with pagination and sorting.
- **SC-007**: Provider review dashboard displays aggregated metrics and recent reviews — review trends are shown when backend provides them, hidden otherwise.
- **SC-008**: Reviews in moderated states (hidden, flagged, removed, pending) display appropriate indicators according to backend rules — restricted information is never exposed.
- **SC-009**: Review creation action appears only on eligible completed bookings — duplicate submissions are prevented with appropriate error messages.
- **SC-010**: Review-related notifications (created, updated, moderated) are delivered through the existing notifications system.
- **SC-011**: The reviews and ratings audit document covers all Reviews, Provider Reviews, Public Reviews, Admin Reviews, and Provider Rating Statistics API endpoints with detailed coverage analysis and required fix documentation.

## Assumptions

- The backend Reviews module (controllers, DTOs, entities, services) already exists and is functional — no backend modifications are required.
- The backend DTOs define the exact set of fields, validation rules, request/response payloads, and permissions — the frontend uses these as the single source of truth.
- The existing design system (colors, theme, branding, components) is preserved — only review and rating business functionality is being completed.
- Authentication and role-based access control are already handled by the existing auth system — review pages require appropriate authenticated sessions except for public review views.
- The existing notifications system is already in place — review notifications integrate with it.
- The backend defines which booking statuses are eligible for review creation, whether duplicate reviews are prevented, and which moderation states are exposed publicly — the frontend respects these backend rules.
- The backend provider rating statistics endpoints provide the data necessary for rating summary, distribution, and trends.
- Public review APIs exist on the backend and handle authentication-gated vs. public data filtering on the server side.
- WebSocket or real-time notification support for review events is a backend capability — the frontend implements real-time updates when available, with graceful fallback.
