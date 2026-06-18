<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the implementation plan
at specs/007-customer-dashboard-completion/plan.md

Generated artifacts:
- [research.md](specs/007-customer-dashboard-completion/research.md)
- [data-model.md](specs/007-customer-dashboard-completion/data-model.md)
- [contracts/](specs/007-customer-dashboard-completion/contracts/customer-api.md)
- [quickstart.md](specs/007-customer-dashboard-completion/quickstart.md)

## Customer Dashboard Completion

Connect all customer-facing pages to real backend APIs. Replace mocks, implement address management, notifications center, booking history with filters/pagination, and dashboard with live stats.

### Implementation Order

1. **Address Module** — Create `src/features/addresses/` with CRUD APIs, hooks, components
2. **Notifications Module** — Add customer notification hooks + UI to existing `src/features/notifications/`
3. **Dashboard** — Replace mock data (saved techs, notifications, balance) with real API calls
4. **Booking History** — Add pagination, status filters, sort, detail page
5. **Active Bookings** — Enhance dashboard section with provider, tracking, ETA
6. **API Audit** — Generate `docs/customer-dashboard-audit.md`

### Running Checks

```
npm run lint
npm run type-check
npm test
```

See full spec: [specs/007-customer-dashboard-completion/spec.md](specs/007-customer-dashboard-completion/spec.md)

## API Alignment Tooling

Run the full audit (scan + compare + classify + fix + report):
```
npm run api-align:audit
```

Apply only safe fixes:
```
npm run api-align:fix-safe
```

Regenerate report only (no scanning):
```
npm run api-align:report
```

Output: `docs/frontend-api-alignment-report.md`

The alignment report (`docs/frontend-api-alignment-report.md`) is the authoritative API integration reference — it documents all 84 frontend API endpoints, their alignment status against planned backend contracts, and required fixes.

> **Note:** Build (`npm run build`) is blocked by pre-existing lint errors in page and component files across the application (see `docs/frontend-api-alignment-report.md` for details). The alignment scanner files in `src/lib/align/` compile without errors.
<!-- SPECKIT END -->
