<!-- SPECKIT START -->
---

**Current feature**: [Real-Time Tracking System](specs/010-tracking-system/plan.md)

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the implementation plan
at specs/010-tracking-system/plan.md

Generated artifacts:
- [research.md](specs/010-tracking-system/research.md)
- [data-model.md](specs/010-tracking-system/data-model.md)
- [contracts/](specs/010-tracking-system/contracts/tracking-api.md)
- [contracts/](specs/010-tracking-system/contracts/websocket-events.md)
- [contracts/](specs/010-tracking-system/contracts/notifications-api.md)
- [quickstart.md](specs/010-tracking-system/quickstart.md)
- [spec.md](specs/010-tracking-system/spec.md)

## Real-Time Tracking System

Complete the Real-Time Tracking System and fully integrate all tracking-related business functionality with the backend Tracking Module. Connect live tracking map, tracking session lifecycle, provider location updates, tracking timeline, tracking history, booking-tracking integration, and tracking notifications.

### Implementation Order

1. **Foundation** — Install map deps (leaflet, react-leaflet), add tracking endpoints to booking service, implement WebSocket onmessage handler, add tracking notification types
2. **Live Tracking Map** — Create reusable TrackingMapView component with provider marker, customer destination, route polyline, ETA, status banner
3. **Tracking Timeline & Session** — Create tracking timeline component, enhance session display with duration and online/offline state
4. **Tracking History** — Create tracking history page with pagination, filtering, session detail view
5. **Integration & Cleanup** — Update booking detail, dashboard, provider pages; remove mock tracking data
6. **Environment Config** — Configure NEXT_PUBLIC_WS_URL

### Running Checks

```
npm run lint
npm run type-check
npm test
```

See full spec: [specs/010-tracking-system/spec.md](specs/010-tracking-system/spec.md)

---

**Previous feature**: [Booking Lifecycle Completion](specs/009-booking-lifecycle-completion/plan.md)

Also referenced: specs/009-booking-lifecycle-completion/plan.md
<!-- SPECKIT END -->
