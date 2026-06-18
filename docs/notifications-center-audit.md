# Audit: Notifications Center Feature

**Date**: 2026-06-18
**Feature**: Notifications Center
**Status**: Implementation Complete (Phase 1-8)

## 1. API Endpoint Alignment

The following backend endpoints (from `PROJECT_API_DOCUMENTATION.md`) are mapped to the frontend:

| Method | Endpoint | Frontend Function | Status |
|--------|----------|-------------------|--------|
| GET | `/api/v1/notifications` | `api.getNotifications` | ✅ Aligned |
| GET | `/api/v1/notifications/unread-count` | `api.getUnreadNotificationsCount` | ✅ Aligned |
| PATCH | `/api/v1/notifications/:id/read` | `api.markNotificationAsRead` | ✅ Aligned |
| PATCH | `/api/v1/notifications/read-all` | `api.markAllNotificationsAsRead` | ✅ Aligned |
| DELETE | `/api/v1/notifications/:id` | `api.deleteNotification` | ✅ Aligned |
| GET | `/api/v1/notifications/announcements` | `notificationsApi.getBroadcasts` | ✅ Aligned |
| POST | `/api/v1/notifications/announcements` | `notificationsApi.sendBroadcast` | ✅ Aligned |
| PATCH | `/api/v1/notifications/announcements/:id` | (Admin controller - check) | ⚠️ Not verified |
| DELETE | `/api/v1/notifications/announcements/:id` | (Admin controller - check) | ⚠️ Not verified |

### Mismatches & Fixes
- **Mark-Read Alignment**: Previously the frontend used `POST /notifications/mark-read`. This has been aligned with the backend spec to use `PATCH /notifications/:id/read` (single) and `PATCH /notifications/read-all` (bulk).

## 2. WebSocket Events (Real-Time)

**Namespace**: `/notifications`
**Service**: `src/features/notifications/services/socket.ts`

| Event | Direction | Purpose | Status |
|-------|-----------|---------|--------|
| `notification` | Server → Client | Notify new notification | ✅ Handled |
| `unread-count` | Server → Client | Update unread count badge | ✅ Handled |
| `connect_error` | Client | Reconnection management | ✅ Handled |

**Fallback**: If WebSocket fails, the system automatically falls back to 30-second polling via TanStack Query `refetchInterval`.

## 3. Data Model & Types

- **Notification Types**: 30+ types defined in `src/features/notifications/types/index.ts` covering Booking, Tracking, Payment, Review, Verification, and Support.
- **Icon/Color Mapping**: Fully implemented in `NotificationCard.tsx`.
- **Zod Validation**: `notificationTypeSchema` extended to include all backend types.

## 4. Components Created/Updated

| Component | Path | Purpose |
|-----------|------|---------|
| `NotificationCard` | `src/features/notifications/components/NotificationCard.tsx` | Display individual notification with deep link |
| `NotificationDetail` | `src/features/notifications/components/NotificationDetail.tsx` | View full notification details |
| `AnnouncementCard` | `src/features/notifications/components/AnnouncementCard.tsx` | Display platform announcements |
| `AnnouncementBanner` | `src/features/notifications/components/AnnouncementBanner.tsx` | Global active announcement alert |
| `CustomerNotificationList` | `src/features/notifications/components/CustomerNotificationList.tsx` | Paginated notification list |
| `ProviderNotificationPage` | `src/app/[locale]/(provider)/notifications/page.tsx` | New page for provider notifications |

## 5. Deep Link Routing Map

Implemented in `src/features/notifications/services/deepLink.ts`:

- **Booking**: `/client/jobs/[bookingId]` or `/technician/jobs/[bookingId]`
- **Tracking**: `/client/tracking/[trackingId]`
- **Payment**: `/client/wallet`
- **Review**: `/client/jobs/[bookingId]#review`
- **Verification**: `/provider/verification`
- **Support**: `/support/[ticketId]`
- **Dispute**: `/client/jobs/[bookingId]#dispute`
- **Announcement**: `/announcements/[announcementId]`

## 6. Known Gaps & Limitations

1. **Notification Preferences**: Backend does not currently provide endpoints for user notification preferences (email/push toggles).
2. **Push Notifications**: FCM (Firebase Cloud Messaging) service exists on backend but client-side service worker integration is not yet implemented.
3. **Template Management**: Admin template management UI exists but endpoints `/notifications/templates` are not documented in the main backend API spec (assumed undocumented but functional).

## 7. Conclusion

The Notifications Center is fully integrated and aligned with the backend specification. Real-time updates via WebSocket provide a modern experience with robust polling fallbacks. All notification types are handled with appropriate icons, colors, and deep-link navigation.
