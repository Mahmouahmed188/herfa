# Feature: Authentication & User Profile Completion

## Overview

Complete and validate the entire Authentication and User Profile business flow by aligning all frontend integrations with existing backend APIs. The backend serves as the single source of truth — all auth endpoints, user endpoints, role logic, JWT flows, and profile DTOs must be audited and correctly wired on the frontend.

## Background & Motivation

The application currently has partial frontend implementations for authentication, user profile, and role-based access. However, many pages rely on mock data, incorrect endpoints, or incomplete flows. This creates security gaps (e.g., unprotected routes, improper token handling), poor user experience (e.g., session loss on reload, stale profile data), and blocks delivery of downstream features that depend on knowing the authenticated user's identity and role.

Completing this feature ensures that:

- Users can reliably log in, register, and maintain sessions.
- Profile data is always fetched from and persisted to the backend.
- Role-based routing and navigation are enforced at all levels.
- The codebase has no remaining mock auth or profile data.

## Actors

| Actor     | Description                                                                 |
|-----------|-----------------------------------------------------------------------------|
| Guest     | Unauthenticated user who can access public pages (login, register).         |
| Customer  | Authenticated user with access to customer-facing features and dashboards.  |
| Provider  | Authenticated service provider with access to provider-specific features.   |
| Admin     | Authenticated administrator with access to admin dashboard and management.  |

## User Scenarios

### Scenario 1: Guest registers a new account

1. Guest navigates to the Register page.
2. Guest fills in required fields (name, email, phone, password, role selection).
3. Guest submits the registration form.
4. System validates the input and sends a registration request to the backend.
5. On success, the system creates the account, establishes a session, and redirects the user to their role-appropriate dashboard.
6. On failure, the system displays inline validation errors.

### Scenario 2: Registered user logs in

1. User navigates to the Login page.
2. User enters email and password.
3. System authenticates against the backend.
4. On success, access and refresh tokens are stored securely.
5. User is redirected to their role-specific dashboard (Customer / Provider / Admin).
6. On failure, user sees a meaningful error message (e.g., invalid credentials, account locked).

### Scenario 3: User session persists on reload

1. User logs in successfully.
2. User closes the tab or navigates away.
3. User returns to the application.
4. System detects the existing refresh token.
5. System silently refreshes the access token.
6. User is restored to their previous session without re-entering credentials.
7. User is redirected to their appropriate dashboard.

### Scenario 4: Expired access token is automatically refreshed

1. User is actively using the application.
2. The access token expires.
3. The next API call returns a 401 Unauthorized response.
4. The system intercepts the 401, uses the refresh token to obtain a new access token.
5. The original API call is retried with the new token.
6. The user experiences no disruption.

### Scenario 5: User views and edits their profile

1. Authenticated user navigates to the Profile page.
2. System fetches the user's profile data from the backend.
3. User sees their account information (name, email, phone, avatar, role).
4. User edits one or more fields.
5. User submits the changes.
6. System validates the input and sends an update request to the backend.
7. On success, the profile updates are reflected immediately.
8. On validation failure, inline errors are displayed.

### Scenario 6: User logs out

1. Authenticated user clicks Logout.
2. System sends a logout request to the backend (invalidates refresh token).
3. System clears all stored tokens and session data locally.
4. User is redirected to the Login page.

### Scenario 7: Role-based access enforcement

1. Admin logs in and accesses the Admin Dashboard — allowed.
2. Customer attempts to navigate to an Admin page URL — blocked and redirected to their dashboard.
3. Provider attempts to navigate to an Admin page URL — blocked and redirected to their dashboard.
4. Navigation menus only display links appropriate to the user's role.

### Scenario 8: API audit identifies mismatches

1. All frontend API calls related to auth, users, and profiles are enumerated.
2. Each call is compared against the backend controller endpoints and DTOs.
3. Mismatches, missing integrations, mock data, and security gaps are documented.
4. A structured report is generated for the development team.

## Functional Requirements

### Authentication

| ID     | Requirement                                                               |
|--------|---------------------------------------------------------------------------|
| AUTH-1 | The Login page must submit credentials to the correct backend login endpoint and handle success/failure responses. |
| AUTH-2 | The Register page must submit registration data to the correct backend register endpoint and handle success/failure responses. |
| AUTH-3 | The system must support three user roles during registration: Customer, Provider, and Admin. |
| AUTH-4 | Upon successful login or registration, the system must redirect the user to their role-appropriate dashboard. |
| AUTH-5 | The Logout action must invalidate the session on the backend and clear all local session data. |
| AUTH-6 | After logout, the user must be redirected to the Login page and cannot access authenticated pages. |
| AUTH-7 | The refresh token flow must automatically obtain a new access token when the current one expires, without user intervention. |
| AUTH-8 | If the refresh token is also expired or invalid, the user must be logged out and redirected to the Login page. |
| AUTH-9 | On application reload, the system must detect any existing refresh token and restore the user session (auto-login). |
| AUTH-10 | The access token must be stored so that it is never exposed in URLs, logs, or any storage accessible to client-side scripts. |
| AUTH-11 | The refresh token must be stored using a secure mechanism that prevents client-side access. |
| AUTH-12 | All communications with the backend must prove the user's identity using the access token in a secure manner. |

### User Profile

| ID     | Requirement                                                               |
|--------|---------------------------------------------------------------------------|
| PROF-1 | The Profile page must fetch the current user's data from the correct backend profile endpoint. |
| PROF-2 | The Profile page must display all user fields returned by the backend (name, email, phone, avatar, role, and any additional fields). |
| PROF-3 | The Edit Profile form must submit updates to the correct backend profile update endpoint. |
| PROF-4 | Profile updates must be validated on the client side for required fields and format (email format, phone format). |
| PROF-5 | Backend validation errors must be displayed as inline field-level error messages. |
| PROF-6 | The avatar field must support viewing the current avatar and uploading a new one via the backend. |
| PROF-7 | After a successful profile update, the displayed profile data must reflect the changes immediately. |
| PROF-8 | No mock, hardcoded, or localStorage-based profile data may remain in the frontend codebase. |

### Role-Based Access Control

| ID     | Requirement                                                               |
|--------|---------------------------------------------------------------------------|
| RBAC-1 | Route guards must prevent users from accessing pages that do not match their assigned role. |
| RBAC-2 | Navigation menus and links must only display items appropriate to the user's role. |
| RBAC-3 | Customer users cannot access Provider or Admin routes.                    |
| RBAC-4 | Provider users cannot access Customer or Admin routes.                   |
| RBAC-5 | Admin users can access all routes including the Admin Dashboard.          |
| RBAC-6 | Guest users (unauthenticated) can only access public pages (Login, Register). |
| RBAC-7 | Attempting to access a forbidden route must redirect the user to their appropriate dashboard (or Login for guests). |

### API Audit

| ID     | Requirement                                                               |
|--------|---------------------------------------------------------------------------|
| AUDIT-1 | Every frontend API call related to auth, users, and profiles must be enumerated and compared against the backend controllers and DTOs. |
| AUDIT-2 | All mismatches between frontend calls and backend endpoints must be documented. |
| AUDIT-3 | All mismatches between frontend DTOs and backend DTOs must be documented. |
| AUDIT-4 | All missing integrations (frontend not calling a backend endpoint that should be used) must be documented. |
| AUDIT-5 | All remaining mock data in auth, user, and profile areas must be identified and documented for removal. |
| AUDIT-6 | A structured audit report must be generated at `docs/auth-profile-audit.md`. |

## Success Criteria

| Criterion | Measure                                                                 |
|-----------|-------------------------------------------------------------------------|
| Login flow | 100% of login attempts with valid credentials result in successful authentication and role-based redirect within 3 seconds. |
| Registration flow | 100% of registration submissions with valid data result in account creation and session establishment. |
| Token refresh | 100% of expired access tokens are silently refreshed without user-visible disruption. |
| Session persistence | 100% of active sessions are restored on application reload without requiring re-login. |
| Profile data accuracy | 100% of profile data displayed on the frontend matches the backend source of truth. |
| Profile updates | 100% of profile update submissions with valid data are persisted and reflected immediately. |
| Role enforcement | 0% of unauthorized route access attempts succeed (all are blocked and redirected). |
| Mock data removal | 0 remaining instances of mock authentication or profile data in the frontend codebase. |
| Audit report | A complete audit report is generated covering all required sections (existing coverage, mismatches, missing integrations, security issues, required fixes). |
| Error handling | 100% of backend error responses are displayed as user-friendly messages on the frontend. |

## Key Entities

| Entity          | Description                                                              |
|-----------------|--------------------------------------------------------------------------|
| User            | A registered user account with name, email, phone, password, avatar, and role. |
| Session         | A user's authenticated state, represented by an access token and a refresh token. |
| Access Token    | Short-lived token used to authorize API requests.                        |
| Refresh Token   | Long-lived token used to obtain new access tokens without re-authentication. |
| User Role       | The user's assigned role (Customer, Provider, Admin) governing access permissions. |
| Profile         | The user's editable account information returned and accepted by the backend. |

## Assumptions

- Backend APIs for all auth and profile operations are already implemented and stable.
- The backend enforces role-based authorization and returns appropriate HTTP status codes for unauthorized access.
- The backend returns all required user fields in a consistent DTO structure across endpoints.
- Access tokens are short-lived (e.g., 15–30 minutes) and refresh tokens are long-lived (e.g., 7–30 days).
- The project uses JWT-based authentication with access and refresh token pairs.
- The frontend has existing routing infrastructure that can be extended with role-based guards.
- No new backend development is required — this feature is purely a frontend alignment effort.

## Dependencies

- Existing backend auth controllers and endpoints must be operational.
- Existing backend user/profile controllers and endpoints must be operational.
- Existing frontend routing framework must support lazy-loaded guards or middleware.

## Out of Scope

- Backend modifications or new backend endpoint creation.
- UI redesign, theme changes, color changes, or branding changes.
- Password reset / forgot password flow (to be handled separately).
- Email verification or phone verification flows.
- OAuth2 / social login integration.
- Multi-factor authentication.
- User listing or user management (admin user management is a separate feature).
