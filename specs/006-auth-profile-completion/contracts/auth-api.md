# Auth & Profile API Contracts

## Overview

This document defines the interface contracts between the Herfa frontend and the planned backend APIs for authentication, user management, and user profile operations. These contracts serve as the authoritative reference for frontend implementation and backend development.

## Base URL

All endpoints are prefixed with: `/api/v1`

## Authentication

### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
  "firstName": "Ahmed",
  "lastName": "Al-Saud",
  "email": "ahmed@example.com",
  "phone": "+966501234567",
  "password": "securePass123",
  "role": "CUSTOMER"
}
```

**Success Response (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "a1b2c3d4-...",
    "firstName": "Ahmed",
    "lastName": "Al-Saud",
    "email": "ahmed@example.com",
    "phone": "+966501234567",
    "role": "CUSTOMER",
    "avatarUrl": null,
    "status": "ACTIVE"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": "Email already in use",
      "password": "Password must be at least 6 characters"
    }
  }
}
```

### POST /auth/login

Authenticate an existing user.

**Request Body:**
```json
{
  "email": "ahmed@example.com",
  "password": "securePass123"
}
```

**Success Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "a1b2c3d4-...",
    "firstName": "Ahmed",
    "lastName": "Al-Saud",
    "email": "ahmed@example.com",
    "phone": "+966501234567",
    "role": "CUSTOMER",
    "avatarUrl": null,
    "status": "ACTIVE"
  }
}
```

*Refresh token is set as an httpOnly cookie (`herfa_refresh_token`) by the server.*

**Error Response (401):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

**Error Response (423):**
```json
{
  "success": false,
  "error": {
    "code": "ACCOUNT_SUSPENDED",
    "message": "Account has been suspended. Contact support."
  }
}
```

### POST /auth/refresh

Obtain a new access token using the refresh token cookie.

**Request:** Empty body. Refresh token is sent automatically via the `herfa_refresh_token` httpOnly cookie.

**Success Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 1800
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": {
    "code": "REFRESH_TOKEN_EXPIRED",
    "message": "Session expired. Please log in again."
  }
}
```

### POST /auth/logout

Invalidate the current session and refresh token.

**Request:** Empty body.

**Headers:** `Authorization: Bearer <accessToken>`

**Success Response (204):** No content.

## User Profile

### GET /users/me

Retrieve the authenticated user's profile.

**Headers:** `Authorization: Bearer <accessToken>`

**Success Response (200):**
```json
{
  "id": "a1b2c3d4-...",
  "firstName": "Ahmed",
  "lastName": "Al-Saud",
  "email": "ahmed@example.com",
  "phone": "+966501234567",
  "role": "CUSTOMER",
  "avatarUrl": "https://cdn.herfa.com/uploads/avatars/a1b2c3d4.jpg",
  "status": "ACTIVE",
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-06-18T08:00:00Z"
}
```

### PATCH /users/me

Update the authenticated user's profile. Only provided fields are updated.

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "firstName": "Ahmed Updated",
  "phone": "+966509876543"
}
```

**Success Response (200):**
```json
{
  "id": "a1b2c3d4-...",
  "firstName": "Ahmed Updated",
  "lastName": "Al-Saud",
  "email": "ahmed@example.com",
  "phone": "+966509876543",
  "role": "CUSTOMER",
  "avatarUrl": "https://cdn.herfa.com/uploads/avatars/a1b2c3d4.jpg",
  "status": "ACTIVE",
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-06-18T08:05:00Z"
}
```

## Upload

### POST /uploads

Upload a file (e.g., avatar image). Returns the public URL.

**Headers:** `Authorization: Bearer <accessToken>`

**Request:** `multipart/form-data` with field `file`

**Success Response (200):**
```json
{
  "url": "https://cdn.herfa.com/uploads/avatars/a1b2c3d4.jpg"
}
```

## Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}  // Optional field-level validation errors
  }
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created (registration) |
| 204 | No content (logout) |
| 400 | Validation error |
| 401 | Unauthenticated (invalid/missing/expired token) |
| 403 | Forbidden (insufficient role) |
| 404 | Not found |
| 423 | Account suspended/locked |
| 429 | Rate limited |
| 500 | Internal server error |
