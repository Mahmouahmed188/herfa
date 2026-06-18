# Quickstart: Real-Time Tracking System

## Prerequisites

- Backend API running at `http://localhost:3001/api/v1` (set in `.env.local`)
- Backend WebSocket gateway at the configured `NEXT_PUBLIC_WS_URL`
- Node modules installed (`npm install`)

## Implementation Order

### Phase 1: Foundation

1. **Install map dependencies**
   ```bash
   npm install leaflet react-leaflet
   npm install -D @types/leaflet
   ```

2. **Add tracking endpoint methods to booking API service**
   - File: `src/features/bookings/services/api.ts`
   - Add `getTrackingSession(bookingId)` and `getTrackingEvents(bookingId, since?)`
   - Add Zod schema for tracking session validation

3. **Implement WebSocket message handler**
   - File: `src/features/bookings/hooks/useTracking.ts`
   - Fill the empty `ws.onmessage` handler with typed message parsing
   - Handle: `LOCATION_UPDATE`, `STATUS_CHANGE`, `ETA_UPDATE`, `ERROR`

4. **Add tracking notification types**
   - File: `src/features/notifications/types/index.ts`
   - Add: `TRACKING_STARTED`, `TRACKING_PAUSED`, `TRACKING_RESUMED`, `TRACKING_ARRIVED`
   - File: `src/features/notifications/hooks/useBookingNotifications.ts`
   - Update filter list and navigation logic

### Phase 2: Live Tracking Map

5. **Create reusable map component**
   - File: `src/components/map/TrackingMapView.tsx`
   - Dynamic import with `ssr: false`
   - Provider marker, customer destination marker, route polyline (when available)
   - Status banner, ETA display, last updated timestamp
   - Loading state (skeleton), empty state (no coordinates), error state

6. **Update TrackingMap component**
   - File: `src/features/bookings/components/TrackingMap.tsx`
   - Replace Google Maps deep-link with the new `TrackingMapView`
   - Preserve existing prop interface

### Phase 3: Tracking Timeline & Session

7. **Create tracking timeline component**
   - File: `src/features/bookings/components/TrackingTimeline.tsx`
   - Reuses patterns from `BookingTimeline`
   - Shows tracking events (status changes, location updates, pause/resume, completion)
   - Chronological order with timestamps

8. **Enhance BookingTracking component**
   - File: `src/features/bookings/components/BookingTracking.tsx`
   - Add session duration display (calculated from startedAt/endedAt)
   - Add pause/resume indicators in timeline
   - Ensure online/offline provider state display

### Phase 4: Tracking History

9. **Create tracking history page**
   - File: `src/app/[locale]/client/tracking/history/page.tsx`
   - Paginated list of past tracking sessions
   - Filters (date range, status)
   - Session detail expandable view
   - Reuses `BookingCard`, `BookingPagination`, `BookingFilters` patterns

### Phase 5: Integration & Cleanup

10. **Update booking detail page tracking embed**
    - File: `src/app/[locale]/client/jobs/[id]/page.tsx`
    - Wire tracking events into booking status display
    - Add tracking status badge to active booking sections

11. **Update customer dashboard**
    - Ensure `ActiveBookingCard` shows live tracking status when applicable
    - File: `src/features/bookings/components/ActiveBookingCard.tsx`

12. **Update provider job management**
    - File: `src/app/[locale]/technician/jobs/page.tsx`
    - Show tracking status for assigned jobs with active tracking
    - Add tracking status badge

13. **Remove mock tracking data**
    - Audit all pages and components for mock/fallback tracking data
    - Replace with real API calls or conditional rendering

### Phase 6: Environment Config

14. **Configure WebSocket URL**
    - Add `NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws` to `.env.local`

## Verification

```bash
npm run lint        # Check code quality
npm run type-check  # Verify TypeScript types
npm run test        # Run unit/integration tests
```

## Key Files Reference

| File | Action |
|------|--------|
| `src/features/bookings/services/api.ts` | Add tracking endpoint methods |
| `src/features/bookings/hooks/useTracking.ts` | Implement WebSocket onmessage |
| `src/features/bookings/components/BookingTracking.tsx` | Enhance with session duration & online state |
| `src/features/bookings/components/TrackingMap.tsx` | Replace with real Leaflet map |
| `src/features/bookings/components/TrackingTimeline.tsx` | NEW: Tracking timeline component |
| `src/components/map/TrackingMapView.tsx` | NEW: Reusable Leaflet map component |
| `src/features/notifications/types/index.ts` | Add tracking notification types |
| `src/features/notifications/hooks/useBookingNotifications.ts` | Add tracking notification handling |
| `src/app/[locale]/client/tracking/history/page.tsx` | NEW: Tracking history page |
| `.env.local` | Add `NEXT_PUBLIC_WS_URL` |

## Resources

- [Feature Specification](spec.md)
- [Data Model](data-model.md)
- [Tracking API Contract](contracts/tracking-api.md)
- [WebSocket Events Contract](contracts/websocket-events.md)
- [Notifications Contract](contracts/notifications-api.md)
- [Research Report](research.md)
