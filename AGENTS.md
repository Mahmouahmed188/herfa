<!-- SPECKIT START -->
---

**Current feature**: [Reviews & Ratings System](specs/011-reviews-ratings-system/plan.md)

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the implementation plan
at specs/011-reviews-ratings-system/plan.md

Generated artifacts:
- [research.md](specs/011-reviews-ratings-system/research.md)
- [data-model.md](specs/011-reviews-ratings-system/data-model.md)
- [contracts/](specs/011-reviews-ratings-system/contracts/reviews-api.md)
- [contracts/](specs/011-reviews-ratings-system/contracts/admin-reviews-api.md)
- [contracts/](specs/011-reviews-ratings-system/contracts/provider-ratings-api.md)
- [contracts/](specs/011-reviews-ratings-system/contracts/websocket-events.md)
- [quickstart.md](specs/011-reviews-ratings-system/quickstart.md)
- [spec.md](specs/011-reviews-ratings-system/spec.md)

## Reviews & Ratings System

Complete the Reviews & Ratings System and fully integrate all review-related business functionality with the backend Reviews Module. Implement review creation/editing, customer/provider review history, provider ratings display, public provider reviews, provider review dashboard, moderation awareness, booking integration, and review notifications.

### Implementation Order

1. **Foundation** — Create `src/features/reviews/` module with types, schemas, service layer, and TanStack Query hooks
2. **Review Creation & Editing** — Build ReviewForm, StarRating, create review page, edit review flow with backend API integration
3. **Review Details & History** — Build ReviewCard, ReviewList, customer review history page with pagination/filtering/sorting
4. **Provider Ratings & Dashboard** — Build RatingSummary, ReviewDashboard, provider review list with aggregated metrics
5. **Public Reviews & Moderation** — Add public reviews section to provider profile, ModerationBadge, admin review integration
6. **Booking Integration & Notifications** — Link completed bookings to review creation, wire review notification events, remove mock data
7. **API Audit** — Generate docs/reviews-ratings-audit.md documenting endpoint coverage and mismatches

### Running Checks

```
npm run lint
npm run type-check
npm test
```

See full spec: [specs/011-reviews-ratings-system/spec.md](specs/011-reviews-ratings-system/spec.md)

---

**Previous feature**: [Real-Time Tracking System](specs/010-tracking-system/plan.md)

Also referenced: specs/009-booking-lifecycle-completion/plan.md
<!-- SPECKIT END -->
