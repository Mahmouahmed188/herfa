# Quickstart: Notifications Center

## Prerequisites

- Node.js 18+
- npm
- Backend API running at the configured `NEXT_PUBLIC_API_URL`
- JWT authentication token (login required)

## Existing Infrastructure

The Notifications Center builds on existing code:

- **Feature module**: `src/features/notifications/` (types, schemas, services, hooks, components)
- **Customer page**: `/client/notifications` — lists notifications with pagination
- **Admin page**: `/admin/notifications` — broadcast management, templates, history
- **Dashboard widgets**: Client dashboard shows notification count and recent notifications
- **Header dropdown**: Bell icon with notification list and "Mark all as read"
- **Sidebar badge**: Unread count badge on customer sidebar

## Implementation Order

1. **API Alignment** — Align frontend API calls with backend spec (mark-read endpoint, notification types)
2. **Notification Detail View** — Create detail page for individual notifications
3. **Provider Notifications** — Create `/provider/notifications` page with role-specific UI
4. **Announcements Page** — Create public `/announcements` list and detail pages
5. **Announcement Banner** — Create global `AnnouncementBanner` component for active announcements
6. **WebSocket Integration** — Add Socket.io client for real-time notification updates
7. **Dashboard Enhancement** — Add notification widgets to provider dashboard
8. **API Audit** — Generate `docs/notifications-center-audit.md` documenting endpoint coverage

## Key Files

| File | Purpose |
|------|---------|
| `src/features/notifications/types/index.ts` | Notification type definitions |
| `src/features/notifications/schemas/validation.ts` | Zod validation schemas |
| `src/features/notifications/services/api.ts` | Broadcast & template API calls |
| `src/services/api.ts` | Core notification API calls |
| `src/features/notifications/hooks/useCustomerNotifications.ts` | Customer TanStack Query hooks |
| `src/features/notifications/hooks/useNotifications.ts` | Admin broadcast/template hooks |
| `src/features/notifications/components/NotificationCard.tsx` | Single notification card |
| `src/features/notifications/components/CustomerNotificationList.tsx` | Notification list component |
| `src/features/notifications/components/BroadcastNotificationManager.tsx` | Admin broadcast manager |

## API Endpoints

### User Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/notifications` | List notifications (paginated, filterable) |
| `GET` | `/api/v1/notifications/unread-count` | Get unread count |
| `PATCH` | `/api/v1/notifications/:id/read` | Mark single as read |
| `PATCH` | `/api/v1/notifications/read-all` | Mark all as read |
| `DELETE` | `/api/v1/notifications/:id` | Delete notification |

### Announcements

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/notifications/announcements` | JWT | List announcements |
| `POST` | `/api/v1/notifications/announcements` | Admin | Create announcement |
| `PATCH` | `/api/v1/notifications/announcements/:id` | Admin | Update announcement |
| `DELETE` | `/api/v1/notifications/announcements/:id` | Admin | Delete announcement |

## WebSocket

- **Namespace**: `/notifications`
- **Events**: `notification` (incoming), `unread-count` (incoming)
- **Fallback**: 30-second polling via `refetchInterval`

## Testing

```bash
npm run lint
npm run typecheck
npm test
```
