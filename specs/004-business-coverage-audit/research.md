# Research: Frontend Business Coverage Audit

## Methodology

The audit was conducted by scanning the entire `src/` directory tree of the Herfa
frontend and comparing findings against all backend API contracts defined in the
frontend service layer files. Key tools: manual code inspection, glob-based file
discovery, grep for cross-referencing.

## Frontend Inventory

### Pages (43 page.tsx files)

| Route Group | Pages | Count |
|---|---|---|
| Public (root) | `/`, `/services`, `/services/[id]`, `/technicians`, `/technicians/[id]`, `/providers`, `/providers/[id]`, `/tenders/[id]`, `/tenders/create`, `/about`, `/contact`, `/faq`, `/ai-diagnosis` | 13 |
| Auth `(auth)/` | `/login`, `/register` | 2 |
| Client | `/client/dashboard`, `/client/my-bookings`, `/client/profile`, `/client/jobs/create`, `/client/jobs/[id]`, `/client/tenders` | 6 |
| Technician | `/technician/dashboard`, `/technician/my-jobs`, `/technician/earnings`, `/technician/schedule`, `/technician/offers`, `/technician/profile`, `/technician/messages`, `/technician/services`, `/technician/verification` | 9 |
| Admin `(dashboard)/` | `/admin/dashboard`, `/admin/audit`, `/admin/bookings`, `/admin/bookings/[id]`, `/admin/cms`, `/admin/finance`, `/admin/finance/payouts`, `/admin/notifications`, `/admin/providers`, `/admin/providers/[id]`, `/admin/users`, `/admin/users/[id]`, `/admin/settings`, `/admin/analytics` | 14 |

### Missing Pages
- No `/admin/support` page (support service exists)
- No `/client/wallet` page (defined in constitution but not implemented)
- No `/client/saved` page (defined in constitution but not implemented)
- No `/tenders` listing page (only create and detail pages exist)

### Feature Modules (15 total)

| Module | Services | Hooks | Schemas | Components |
|---|---|---|---|---|
| analytics | ✅ | ✅ | — | — |
| audit | ✅ | ✅ | — | ✅ AuditLogTable |
| auth | ✅ | ✅ | — | ✅ LoginForm, RegisterForm |
| bookings | ✅ | ✅ | — | ✅ BookingTable, BookingDetail |
| client | — | — | — | ✅ CreateJobForm |
| cms | ✅ | ✅ | — | ✅ CMSPageList, CMSPageForm, MediaManager |
| finance | ✅ | ✅ | ✅ payouts | — |
| header | ✅ | ✅ types | — | — |
| landing | — | — | — | ✅ 7 section components |
| notifications | ✅ | ✅ | — | ✅ NotificationList, BroadcastNotification |
| providers | ✅ | ✅ | ✅ verification | — |
| settings | ✅ | ✅ | ✅ commission, localization, security | ✅ 4 form components |
| support | ✅ | ✅ | ✅ tickets | — |
| users | ✅ | ✅ | — | — |

### API Service Coverage

**Decision**: Feature-level services exist for 12 of 15 modules. Three areas
(tenders, jobs, verification) have raw API functions in `src/services/api.ts`
but no dedicated feature service module.

| Backend Area | Core API | Feature Service | React Query Hook |
|---|---|---|---|
| Auth | ✅ (login, register) | ✅ authService | ✅ useAuth |
| Users | ✅ (getUsers) | ✅ userService | ✅ useUsers |
| Jobs | ✅ (getMyJobs, getAssignedJobs, createJob, updateJobStatus) | ❌ | ❌ |
| Bookings | ❌ | ✅ bookingService | ✅ useBookings |
| Providers | ✅ (getProviderById) | ✅ providerService | ✅ useProviders |
| Tenders | ✅ (getOpenTenders, getTenderById, createTender) | ❌ | ❌ |
| Messages | ✅ (getMyMessages, getConversation, sendMessage) | ❌ | ❌ |
| Offers | ✅ (getMyOffersTechnician) | ❌ | ❌ |
| Verification | ✅ (getVerificationStatus, submitVerification) | ✅ (providerService has verification methods) | ✅ useProviderVerificationStatus |
| Finance | ❌ | ✅ financeService | ✅ useFinance |
| CMS | ❌ | ✅ cmsService | ✅ useCms |
| Notifications | ❌ | ✅ notificationService | ✅ useNotifications |
| Support | ❌ | ✅ supportService | ✅ useSupport |
| Audit | ❌ | ✅ auditService | ✅ useAudit |
| Settings | ❌ | ✅ settingsService | ✅ useSettings |
| Analytics | ❌ | ✅ analyticsService | ✅ useAnalytics |

### Alternatives Considered

1. **Manual inspection only**: Simplest approach. Relies on developer knowledge.
   Chosen because the codebase is moderate-sized and discoverable.
2. **Automated scanning script**: Would use Node.js to traverse directories and
   match imports. Rejected because one-time value doesn't justify maintenance.
3. **Living dashboard app**: A React page showing coverage in real-time. Rejected
   because scope is disproportionate — a document suffices.
