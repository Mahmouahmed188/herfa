# Quickstart: Auth & Profile Completion

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
npm run dev
```

The application starts at `http://localhost:3000`.

## Testing Auth Flow

### Registration

1. Navigate to `/register`
2. Fill in: first name, last name, email, phone, password, role (Customer/Provider)
3. Submit — on success, redirected to role-appropriate dashboard

### Login

1. Navigate to `/login`
2. Enter email and password
3. Submit — on success, redirected to dashboard matching user role

### Session Persistence

1. Log in
2. Close and reopen browser tab
3. Should be restored to the appropriate dashboard without re-login

### Token Refresh

1. Log in and wait 15-30 minutes (or modify token expiry in backend)
2. Application should silently refresh the access token
3. No user-visible disruption

### Profile View & Edit

1. Log in and navigate to `/profile`
2. Profile data loads from the backend
3. Edit any field and save
4. Changes persist and display immediately

### Logout

1. Logged-in user clicks "Logout"
2. Session invalidated on backend
3. User redirected to `/login`
4. Authenticated pages no longer accessible

## Key Files

| Purpose | File |
|---------|------|
| API service layer | `src/services/api.ts` |
| Axios client + interceptors | `src/lib/axios.ts` |
| Auth store (Zustand) | `src/features/auth/stores/useAuthStore.ts` |
| Auth session service | `src/features/auth/services/session.ts` |
| Login form | `src/features/auth/LoginForm.tsx` |
| Register form | `src/features/auth/RegisterForm.tsx` |
| Route guard (middleware) | `src/middleware.ts` |
| Client-side route guard | `src/components/auth/ProtectedRoute.tsx` |
| Permission guard | `src/components/auth/PermissionGuard.tsx` |
| Role-based navigation | `src/features/header/hooks/useNavigation.ts` |
| Navigation config | `src/features/header/config/navigation.ts` |

## Validation

Run linting and type checking:

```bash
npm run lint
npm run type-check
npm test
```

## Audit

Generate the frontend-backend alignment audit report:

```bash
npm run api-align:audit
```
