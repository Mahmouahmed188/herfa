<!-- SPECKIT START -->
---

**Current feature**: [Notifications Center](specs/012-notifications-center/plan.md)

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the implementation plan
at specs/012-notifications-center/plan.md

Generated artifacts:
- [research.md](specs/012-notifications-center/research.md)
- [data-model.md](specs/012-notifications-center/data-model.md)
- [contracts/](specs/012-notifications-center/contracts/notifications-api.md)
- [contracts/](specs/012-notifications-center/contracts/announcements-api.md)
- [contracts/](specs/012-notifications-center/contracts/websocket-events.md)
- [quickstart.md](specs/012-notifications-center/quickstart.md)
- [spec.md](specs/012-notifications-center/spec.md)

## Notifications Center

Complete the Notifications Center and fully integrate all notification-related business functionality with the backend Notifications Module. Implement notification list (paginated, filterable), read/unread management, notification detail view with deep-link navigation, announcements system, global announcement banner, real-time updates (WebSocket with polling fallback), provider notification page, and dashboard integrations.

### Implementation Order

1. **Foundation** — Align frontend API layer with backend spec (mark-read endpoint, notification types), extend Zod schemas, update TanStack Query hooks
2. **Notification Details & Provider Page** — Build NotificationDetail component, create `/provider/notifications` page, add deep-link navigation for all notification types
3. **Announcements Page & Banner** — Build AnnouncementCard, AnnouncementBanner components, create `/announcements` list and detail pages
4. **WebSocket Integration** — Add Socket.io client to `/notifications` namespace, wire real-time events to TanStack Query cache invalidation
5. **Dashboard Enhancement** — Add notification widget to provider dashboard, enhance admin notification center template/history tabs
6. **API Audit** — Generate docs/notifications-center-audit.md documenting endpoint coverage and mismatches

### Running Checks

```
npm run lint
npm run type-check
npm test
```

See full spec: [specs/012-notifications-center/spec.md](specs/012-notifications-center/spec.md)

---

**Previous feature**: [Reviews & Ratings System](specs/011-reviews-ratings-system/plan.md)

Also referenced: specs/009-booking-lifecycle-completion/plan.md
<!-- SPECKIT END -->
