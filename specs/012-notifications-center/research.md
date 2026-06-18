# Research: Notifications Center

## Overview

Research findings for the Notifications Center feature based on analysis of the backend API specification (`PROJECT_API_DOCUMENTATION.md`) and existing frontend implementation.

## Key Discoveries

### Backend State

- No actual NestJS source code exists under `apps/api/src/notifications/` — only empty directories.
- The backend API is fully documented in `PROJECT_API_DOCUMENTATION.md` as the source of truth.
- 9 notification endpoints exist: 5 for user notifications + 4 for announcements.
- 6 event types trigger notification creation via `@nestjs/event-emitter`.
- WebSocket via Socket.io namespace `/notifications` with `notification` event.

### Frontend State

- Fully functional notification system with 11 feature files under `src/features/notifications/`.
- TanStack Query hooks for: list (paginated), unread count (30s polling), mark-read (single + bulk).
- Customer notification page at `/client/notifications`.
- Admin notification center at `/admin/notifications` (tabs: broadcasts, templates, history).
- No mock notification data — all data comes from backend APIs.
- **Provider/technician notification page is missing** — no notification route under `(provider)`.

### API Alignment Issues

| Issue | Frontend | Backend Spec | Impact |
|-------|----------|-------------|--------|
| Mark-read endpoint | `POST /notifications/mark-read` with `{ notificationIds }` | `PATCH /notifications/:id/read` (single) + `PATCH /notifications/read-all` (bulk) | Requires alignment |
| Notification type values | 14 types (`BOOKING_CREATED`, etc.) + 5 verification types | Uses kebab-case event names (`booking.created`, `booking.accepted`, etc.) | Type mismatch |
| Zod schema vs TS types | Zod enum has only 4 values | TS type has 14+ values | Schema too restrictive |
| Template endpoints | Frontend calls `/notifications/templates` | Not documented in backend API spec | May be undocumented but functional |

### Missing Components

| Component | Status | Action |
|-----------|--------|--------|
| Provider notifications page | Missing | Needs creation under `(provider)` route group |
| WebSocket client integration | Missing | Backend supports Socket.io; frontend relies on 30s polling |
| Announcements page for users | Missing | Only admin broadcast manager exists |
| Global announcement banner | Missing | No component for active announcement display |
| Notification detail view | Missing | No dedicated detail page for notifications |
| Notification preferences page | Conditional | Depends on backend support |

### WebSocket Events (from backend spec)

- Namespace: `/notifications` (Socket.io)
- Auth: JWT via `auth.token` on connection
- Server → Client: `notification` event with `{ id, type, title, body, data, createdAt }`
- No frontend Socket.io client code exists currently.

### Notification Types (from backend event system)

Backend event → notification type mapping:
- `booking.created` → `BOOKING_CREATED` / notification for providers
- `booking.accepted` → `BOOKING_ACCEPTED` / notification for customers
- `job.assigned` → `BOOKING_ASSIGNED` / notification for providers
- `payment.received` → payment notification for providers
- `review.created` → `REVIEW_CREATED` / notification for providers
- `review.updated` → `REVIEW_UPDATED` / notification for providers
- `review.moderated` → `REVIEW_MODERATED` / notification for review owner
- `message.sent` → message notification

### Decisions

- **Notification type enum**: Use the frontend `CustomerNotificationType` union as the single source of truth for frontend types, with alignment to backend event naming where possible.
- **Mark-read strategy**: Support both single (`PATCH /notifications/:id/read`) and bulk (`PATCH /notifications/read-all`) as documented in backend spec.
- **WebSocket integration**: Add Socket.io client to optionally connect to `/notifications` namespace for real-time updates, falling back to 30s polling.
- **Provider notifications**: Create new page under `(provider)/notifications` route.
- **Announcements for regular users**: Create an announcements page under `/announcements` accessible to all roles.
- **Announcement banner**: Create a global banner component that fetches and displays active announcements.
- **No notification preferences**: Backend spec does not document any notification preference endpoints. Document limitation.

### Alternatives Considered

| Choice | Alternatives | Rationale |
|--------|-------------|-----------|
| Polling fallback | WebSocket-only | Polling ensures reliability when WebSocket disconnects |
| Separate provider notification page | Single shared page | Different UX needs for provider vs customer notifications |
| Frontend notification type union | Mirror backend event names exactly | Frontend types are already established; alignment done in service layer |
