# Data Model: Frontend Business Coverage Audit

## Entities

### FrontendPage

Represents a single page in the frontend application.

| Field | Type | Description |
|---|---|---|
| route | String | URL path (e.g., `/client/dashboard`) |
| routeGroup | Enum: `public`, `auth`, `customer`, `provider`, `admin` | Portal group |
| pageFile | String | File path relative to `src/app/[locale]/` |
| exists | Boolean | Whether the file exists |
| hasLoadingState | Boolean | Has `loading.tsx` |
| hasErrorBoundary | Boolean | Has `error.tsx` or uses ErrorBoundary |
| backendConnected | Enum: `yes`, `partial`, `no` | Whether API data is wired |
| backendModule | String | Associated backend module name |

### FrontendComponent

Represents a reusable UI component.

| Field | Type | Description |
|---|---|---|
| name | String | Component name |
| filePath | String | File path relative to `src/` |
| category | Enum: `primitive`, `feature`, `layout`, `form`, `auth` | Type of component |
| usedByPages | String[] | Pages that import this component |

### ApiService

Represents a frontend API integration.

| Field | Type | Description |
|---|---|---|
| method | Enum: `GET`, `POST`, `PATCH`, `PUT`, `DELETE` | HTTP method |
| route | String | API endpoint path |
| source | Enum: `core`, `feature` | Whether in core `services/api.ts` or feature module |
| connected | Boolean | Has frontend service function |
| hasHook | Boolean | Has TanStack Query hook |
| usedInUi | Boolean | Actually called from a component/page |

### BackendModule

Represents a backend business domain.

| Field | Type | Description |
|---|---|---|
| name | String | Module name (e.g., `Bookings`, `Providers`) |
| frontendStatus | Enum: `full`, `partial`, `missing` | Implementation completeness |
| missingApis | BackendEndpoint[] | Endpoints not connected |
| missingPages | String[] | Pages not implemented |
| missingComponents | String[] | Components not built |
| missingFlows | String[] | Business flows not implemented |

### CoverageGap

Represents a specific discrepancy between frontend and backend.

| Field | Type | Description |
|---|---|---|
| type | Enum: `missing_page`, `missing_api`, `missing_component`, `missing_flow`, `partial_implementation` | Gap category |
| backendModule | String | Related backend module |
| description | String | What is missing |
| priority | Enum: `critical`, `high`, `medium`, `low` | Business priority |
| dependsOn | CoverageGap[] | Gaps that block this one |

## State Transitions

The gap analysis is a static document. "Transitions" represent the lifecycle of
the analysis itself:

```
Draft → Reviewed → Published (docs/frontend-business-gap-analysis.md)
               ↘ Updated (re-run after feature implementation)
```

## Relationships

```
BackendModule 1──* BackendEndpoint
BackendModule 1──* CoverageGap
CoverageGap *──1 Priority
FrontendPage *──1 BackendModule (mapped by business domain)
FrontendComponent *──* FrontendPage (many-to-many via imports)
ApiService 1──* FrontendPage (each endpoint used in one or more pages)
```
