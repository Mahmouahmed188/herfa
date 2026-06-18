<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the implementation plan
at specs/008-provider-verification/plan.md

Generated artifacts:
- [research.md](specs/008-provider-verification/research.md)
- [data-model.md](specs/008-provider-verification/data-model.md)
- [contracts/](specs/008-provider-verification/contracts/provider-verification-api.md)
- [contracts/](specs/008-provider-verification/contracts/admin-verification-api.md)
- [quickstart.md](specs/008-provider-verification/quickstart.md)
- [spec.md](specs/008-provider-verification/spec.md)

## Provider Verification System

Complete the entire Provider Verification System and ensure it is fully integrated with the backend verification business workflow. Connect provider-facing verification to real backend API calls, add document management with validation, implement verification status display (Pending, Under Review, Approved, Rejected, Suspended), add verification history/timeline, and integrate verification notifications.

### Implementation Order

1. **Status Schema** — Extend `verificationStatusSchema` to include `UNDER_REVIEW` and `SUSPENDED` states
2. **API Service** — Add verification history endpoint + migrate technician verification to axios-based service
3. **Document Upload** — Add format/size validation, progress indicator, document types enum, replacement support
4. **Verification Dashboard** — Status badge, progress, pending requirements, rejection details, approval info
5. **Verification Submission** — Complete form with backend validation errors, success states
6. **Verification History** — Timeline component with status transitions, document records, timestamps
7. **Notifications** — Add verification notification types and hooks, link to verification pages
8. **Mock Data Cleanup** — Remove mock verification data from technicians pages
9. **API Audit** — Generate docs/provider-verification-audit.md

### Running Checks

```
npm run lint
npm run type-check
npm test
```

See full spec: [specs/008-provider-verification/spec.md](specs/008-provider-verification/spec.md)

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
