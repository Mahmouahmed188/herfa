<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the implementation plan
at specs/006-auth-profile-completion/plan.md

Generated artifacts:
- [research.md](specs/006-auth-profile-completion/research.md)
- [data-model.md](specs/006-auth-profile-completion/data-model.md)
- [contracts/](specs/006-auth-profile-completion/contracts/auth-api.md)
- [quickstart.md](specs/006-auth-profile-completion/quickstart.md)

## Auth & Profile Implementation

Run linting and type checking:
```
npm run lint
npm run type-check
npm test
```

See full spec: [specs/006-auth-profile-completion/spec.md](specs/006-auth-profile-completion/spec.md)

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
