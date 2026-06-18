<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the implementation plan
at specs/009-booking-lifecycle-completion/plan.md

Generated artifacts:
- [research.md](specs/009-booking-lifecycle-completion/research.md)
- [data-model.md](specs/009-booking-lifecycle-completion/data-model.md)
- [contracts/](specs/009-booking-lifecycle-completion/contracts/booking-api.md)
- [contracts/](specs/009-booking-lifecycle-completion/contracts/jobs-api.md)
- [contracts/](specs/009-booking-lifecycle-completion/contracts/tracking-api.md)
- [contracts/](specs/009-booking-lifecycle-completion/contracts/notifications-api.md)
- [quickstart.md](specs/009-booking-lifecycle-completion/quickstart.md)
- [spec.md](specs/009-booking-lifecycle-completion/spec.md)

## Booking Lifecycle Completion

Complete the entire Booking Lifecycle workflow and ensure all booking-related business processes are fully aligned with the backend implementation. Connect booking creation, details, timeline, cancellation, tracking, notifications, history, provider management, and API audit.

### Implementation Order

1. **Status Enum Alignment** — Add `ASSIGNED` and `ON_THE_WAY` to all three booking status definitions
2. **API Service Consolidation** — Migrate all booking/job API calls from `fetchWithAuth` to axios-based feature service; add missing endpoints
3. **Customer Booking Detail Page** — Create `/client/jobs/[id]/page.tsx` with booking info, provider info, payment info, timeline, cancel action
4. **Booking Timeline Enhancement** — Extend timeline to use backend data with status transitions, provider events, cancellation, completion
5. **Booking Cancellation Flow** — Add cancellation dialog with reason, confirmation, backend error handling, status refresh
6. **Active Booking Tracking** — Create tracking page with live progress, provider location, ETA, WebSocket integration
7. **Booking Notifications** — Add booking notification types and hooks, link clicks to booking details
8. **Provider Booking Management** — Add accept/reject, status update, complete booking for provider pages
9. **Mock Data Cleanup** — Remove mock/fallback booking data from all pages
10. **API Audit** — Generate docs/booking-lifecycle-audit.md

### Running Checks

```
npm run lint
npm run type-check
npm test
```

See full spec: [specs/009-booking-lifecycle-completion/spec.md](specs/009-booking-lifecycle-completion/spec.md)
<!-- SPECKIT END -->
