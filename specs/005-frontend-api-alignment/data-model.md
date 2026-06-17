# Data Model: Frontend API Alignment & Backend Synchronization

## Entities

### EndpointRecord

Represents a single frontend API endpoint discovered during scanning.

| Field | Type | Description |
|---|---|---|
| id | String | Unique identifier (e.g., "core-001", "feature-analytics-002") |
| source | Enum: `core`, `feature` | Whether defined in `src/services/api.ts` or a feature module |
| sourceFile | String | File path relative to `src/` |
| functionName | String | Exported function name in the API service |
| method | Enum: `GET`, `POST`, `PATCH`, `PUT`, `DELETE` | HTTP method |
| path | String | API endpoint path (e.g., `/auth/login`) |
| pathParams | String[] | Dynamic path parameters (e.g., `["id"]` for `/jobs/:id`) |
| queryParams | String[] | Supported query parameters |
| requestPayload | Object | Type/interface name and shape of the request body |
| responseType | String | Expected response TypeScript type |
| authRequired | Boolean | Whether the endpoint requires authentication |
| authSource | Enum: `localStorage`, `zustand`, `none` | How auth tokens are injected |
| hasDedicatedHook | Boolean | Whether a React Query hook exists |
| hookFile | String | Path to the hook file if exists |
| usedInPages | String[] | Page routes that consume this endpoint |

### FeatureServiceEndpoint

Represents an endpoint defined in a feature module's API service.

| Field | Type | Description |
|---|---|---|
| featureModule | String | Feature module name (e.g., `bookings`, `analytics`) |
| serviceFile | String | File path relative to `src/features/[module]/` |
| method | Enum | HTTP method |
| path | String | API endpoint path |
| clientType | Enum: `axios` | HTTP client used (always Axios for feature services) |
| requestBodyType | String | Payload type/interface |
| responseType | String | Response type/interface |
| hasHook | Boolean | Whether a React Query hook exists |
| hookFunctionNames | String[] | Hook functions defined (e.g., `useBookingDetails`) |
| queryKeyPattern | String | TanStack Query key pattern |

### ReactQueryHook

Represents a single TanStack Query hook (useQuery or useMutation).

| Field | Type | Description |
|---|---|---|
| filePath | String | Path relative to `src/` |
| functionName | String | Hook function name |
| type | Enum: `query`, `mutation` | useQuery or useMutation |
| queryKey | String[] | Query key array |
| queryFn | String | Name of the API function called |
| targetEndpointPath | String | The endpoint path this hook calls |
| invalidationTargets | String[] | Query keys invalidated on success (mutations only) |

### Mismatch

Represents a detected discrepancy between frontend and planned backend contracts.

| Field | Type | Description |
|---|---|---|
| id | String | Unique identifier |
| endpointId | String | Reference to the EndpointRecord |
| type | Enum: `wrong_path`, `wrong_method`, `wrong_payload`, `wrong_response`, `missing_auth`, `dto_field_mismatch`, `mock_data`, `deprecated_api` | Category of mismatch |
| frontendValue | String | What the frontend currently has |
| expectedValue | String | What the backend expects |
| severity | Enum: `critical`, `high`, `medium`, `low` | Impact level |
| fixClassification | Enum: `safe`, `requires_manual_intervention` | Whether auto-fixable |
| fixDescription | String | Description of the corrective action |
| fixFile | String | Target file to modify |
| fixLine | Number | Approximate line number |
| requiresNewFeatureModule | Boolean | Whether a new feature module needs to be created |

### FixAction

Represents an automated fix to be applied.

| Field | Type | Description |
|---|---|---|
| mismatchId | String | Reference to the Mismatch |
| operation | Enum: `replace_path`, `replace_method`, `rename_field`, `update_auth_source`, `replace_client`, `wrap_response` | Type of fix |
| filePath | String | Target file |
| oldValue | String | Pattern to match |
| newValue | String | Replacement value |
| confidence | Enum: `high`, `medium`, `low` | Confidence the fix is correct |
| applied | Boolean | Whether the fix was applied |
| verified | Boolean | Whether the fix was verified post-application |

### AlignmentReport

The output document structure for `docs/frontend-api-alignment-report.md`.

| Field | Type | Description |
|---|---|---|
| generatedAt | DateTime | Report generation timestamp |
| totalEndpointsScanned | Number | Count of all endpoints audited |
| correctIntegrations | Mismatch[] | Endpoints with no issues |
| brokenIntegrations | Mismatch[] | Endpoints with detected issues |
| endpointMismatches | Mismatch[] | Path/method discrepancies |
| dtoMismatches | Mismatch[] | Payload/response shape discrepancies |
| missingApiIntegrations | Mismatch[] | Endpoints with no backend counterpart |
| mockImplementations | Mismatch[] | Mock data still in use |
| requiredFixes | FixAction[] | All fix actions (auto-applied + manual) |
| autoFixesApplied | Number | Count of automatically applied fixes |
| remainingManualFixes | Number | Count of fixes requiring manual intervention |

### AuthInconsistency

Represents a detected inconsistency in how authentication tokens are managed.

| Field | Type | Description |
|---|---|---|
| sourceA | String | First auth mechanism (e.g., `localStorage.getItem('token')`) |
| sourceB | String | Conflicting auth mechanism (e.g., `useAuthStore.getState().token`) |
| affectedEndpoints | EndpointRecord[] | Endpoints using sourceA |
| recommendation | String | Suggested remediation |

### DuplicateEndpoint

Represents two or more endpoints serving similar purposes.

| Field | Type | Description |
|---|---|---|
| paths | String[] | Endpoint paths that overlap |
| locations | String[] | Source files |
| functionalDifference | String | Explanation of why they differ (or if they are truly duplicates) |
| action | Enum: `keep_both`, `consolidate`, `flag` | Recommended action |

## State Transitions

```
Research → Scan Complete → Analysis Complete → Report Generated → Fixes Applied → Validation Complete
    |            |                |                    |                 |               |
    v            v                v                    v                 v               v
  Gather      All endpoints   Mismatches          Report written    Safe fixes      Verify fixes
  endpoints   catalogued      classified          to docs/          applied         didn't break UI
  + hooks     and verified                                              
```

## Relationships

```
EndpointRecord 1──* ReactQueryHook (one endpoint may have multiple hooks)
EndpointRecord 1──* Mismatch (one endpoint may have multiple issues)
Mismatch 1──1 FixAction (each mismatch has one fix action)
EndpointRecord *──1 AuthInconsistency (grouped by auth source)
DuplicateEndpoint *──2 EndpointRecord (compares two endpoints)
AlignmentReport 1──* Mismatch (report contains all mismatches)
AlignmentReport 1──* FixAction (report lists all fix actions)
```

## Validation Rules

- Every function in `src/services/api.ts` MUST have a corresponding EndpointRecord
- Every function in `src/features/*/services/api.ts` MUST have a corresponding FeatureServiceEndpoint
- Every React Query hook identified MUST be linked to its source API function
- A Mismatch with `fixClassification: safe` MUST have a complete FixAction with `oldValue` and `newValue`
- The AlignmentReport MUST contain exactly the sections defined in `contracts/report-schema.md`
