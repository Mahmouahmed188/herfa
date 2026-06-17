# Data Model: Authentication & User Profile

## Entity: User

Represents a registered user account in the Herfa platform.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | UUID | Yes | Primary identifier |
| `firstName` | string | Yes | 2-50 characters |
| `lastName` | string | Yes | 2-50 characters |
| `email` | string | Yes | Valid email format, unique |
| `phone` | string | Yes | Valid phone format (10+ digits) |
| `password` | string | Yes | Min 6 characters (write-only, never returned) |
| `role` | enum | Yes | One of: `CUSTOMER`, `PROVIDER`, `ADMIN`, `SUPER_ADMIN` |
| `avatarUrl` | string? | No | URL to uploaded avatar image |
| `status` | enum | Yes | One of: `ACTIVE`, `SUSPENDED`, `PENDING_VERIFICATION` |
| `createdAt` | datetime | Yes | Auto-generated on creation |
| `updatedAt` | datetime | Yes | Auto-updated on modification |

### Validation Rules

| Field | Rule |
|-------|------|
| `firstName` | Min 2 chars, max 50 chars, letters and spaces only |
| `lastName` | Min 2 chars, max 50 chars, letters and spaces only |
| `email` | Valid email format per RFC 5322 |
| `phone` | Min 10 digits, numbers and `+` prefix only |
| `password` | Min 6 chars, at least 1 letter and 1 number |
| `role` | Must be one of: `CUSTOMER`, `PROVIDER`, `ADMIN`, `SUPER_ADMIN` |

### State Transitions

```
REGISTRATION → status: PENDING_VERIFICATION (providers) or ACTIVE (customers)
VERIFICATION → PENDING_VERIFICATION → ACTIVE (providers)
ADMIN_ACTION  → ACTIVE ↔ SUSPENDED
```

## Entity: Session

Represents an authenticated user session.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `userId` | UUID | Yes | References User.id |
| `accessToken` | JWT string | Yes | Short-lived (15-30 min), in-memory on client |
| `refreshToken` | opaque string | Yes | Long-lived (7-30 days), httpOnly cookie |
| `expiresAt` | datetime | Yes | Access token expiry |
| `refreshExpiresAt` | datetime | Yes | Refresh token expiry |

### Token Payload (Access Token)

| Claim | Value |
|-------|-------|
| `sub` | User ID |
| `role` | User role (`CUSTOMER`, `PROVIDER`, `ADMIN`, `SUPER_ADMIN`) |
| `iat` | Issued at timestamp |
| `exp` | Expiration timestamp |

## API Contracts

### Request DTOs

#### RegisterRequest
```typescript
{
  firstName: string;     // 2-50 chars
  lastName: string;      // 2-50 chars
  email: string;         // valid email
  phone: string;         // 10+ digits
  password: string;      // 6+ chars
  role: 'CUSTOMER' | 'PROVIDER';  // ADMIN/SUPER_ADMIN not self-registerable
}
```

#### LoginRequest
```typescript
{
  email: string;     // valid email
  password: string;  // 6+ chars
}
```

#### UpdateProfileRequest
```typescript
{
  firstName?: string;   // 2-50 chars
  lastName?: string;    // 2-50 chars
  phone?: string;       // 10+ digits
  avatarUrl?: string;   // URL from upload
}
```

#### RefreshTokenRequest
```typescript
// Empty body — refresh token is sent via httpOnly cookie
{}
```

### Response DTOs

#### AuthResponse
```typescript
{
  accessToken: string;           // JWT, 15-30 min expiry
  refreshToken?: string;         // Only if backend returns in body (prefer httpOnly cookie)
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN' | 'SUPER_ADMIN';
    avatarUrl?: string;
    status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  }
}
```

#### UserProfileResponse
```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN' | 'SUPER_ADMIN';
  avatarUrl?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  createdAt: string;   // ISO 8601
  updatedAt: string;   // ISO 8601
}
```

#### RefreshTokenResponse
```typescript
{
  accessToken: string;   // New JWT access token
  expiresIn: number;     // Seconds until expiry
}
```

### Endpoint Contracts

| Method | Path | Auth | Request | Response | Status |
|--------|------|------|---------|----------|--------|
| POST | `/api/v1/auth/register` | No | RegisterRequest | AuthResponse | Expected |
| POST | `/api/v1/auth/login` | No | LoginRequest | AuthResponse | Expected |
| POST | `/api/v1/auth/refresh` | Cookie | Empty | RefreshTokenResponse | Expected |
| POST | `/api/v1/auth/logout` | Bearer | Empty | 204 No Content | Expected |
| GET | `/api/v1/users/me` | Bearer | — | UserProfileResponse | Implemented (frontend) |
| PATCH | `/api/v1/users/me` | Bearer | UpdateProfileRequest | UserProfileResponse | Expected |
| POST | `/api/v1/uploads` | Bearer | FormData (file) | `{ url: string }` | Implemented (frontend) |

## Frontend Type Mappings

### Current → Target Role Mapping

| Current Value (Frontend) | Target Value (Backend) | Used In |
|--------------------------|------------------------|---------|
| `'client'` | `'CUSTOMER'` | `src/store/useAuthStore.ts`, navigation config |
| `'technician'` | `'PROVIDER'` | `src/store/useAuthStore.ts`, navigation config |
| `'admin'` | `'ADMIN'` | `src/store/useAuthStore.ts`, navigation config |
| `'SUPER_ADMIN'` | `'SUPER_ADMIN'` | `src/types/api.d.ts` |
| `'SUPPORT'` | map to `'ADMIN'` | `src/types/api.d.ts` (remove) |
| `'FINANCE'` | map to `'ADMIN'` | `src/types/api.d.ts` (remove) |
| `'CONTENT'` | map to `'ADMIN'` | `src/types/api.d.ts` (remove) |

### Navigation Role Updates

The navigation config (`src/features/header/config/navigation.ts`) must be updated:

| Nav Item | Current Roles | Target Roles |
|----------|---------------|--------------|
| Dashboard (client) | `['client']` | `['CUSTOMER']` |
| Bookings (client) | `['client']` | `['CUSTOMER']` |
| Dashboard (technician) | `['technician']` | `['PROVIDER']` |
| Jobs (technician) | `['technician']` | `['PROVIDER']` |
| Earnings (technician) | `['technician']` | `['PROVIDER']` |
| Dashboard (admin) | `['admin']` | `['ADMIN', 'SUPER_ADMIN']` |
| Users (admin) | `['admin']` | `['ADMIN', 'SUPER_ADMIN']` |
| Providers (admin) | `['admin']` | `['ADMIN', 'SUPER_ADMIN']` |
| Finance (admin) | `['admin']` | `['ADMIN', 'SUPER_ADMIN']` |
| Settings (admin) | `['admin']` | `['ADMIN', 'SUPER_ADMIN']` |
