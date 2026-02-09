# Authentication API Contract

**Feature**: 001-frontend-ui-ux
**Date**: 2026-02-08
**Backend Spec**: Spec 1 & 2 (Authentication & Authorization)

This document defines the authentication API endpoints that the frontend will consume from the backend.

---

## Base Configuration

**Base URL**: `http://localhost:8000` (development) or environment variable `NEXT_PUBLIC_API_URL`
**Content-Type**: `application/json`
**Authentication**: JWT token in `Authorization: Bearer {token}` header (for protected endpoints)

---

## Endpoints

### 1. User Signup

**Endpoint**: `POST /api/auth/signup`
**Authentication**: None (public)
**Description**: Register a new user account

#### Request Body

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string"
}
```

**Field Constraints**:
- `firstName`: Required, 1-50 characters
- `lastName`: Required, 1-50 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 8 characters

#### Success Response (201 Created)

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2026-02-08T12:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2026-02-09T12:00:00Z"
}
```

#### Error Responses

**400 Bad Request** - Validation error
```json
{
  "error": "ValidationError",
  "message": "Invalid input data",
  "statusCode": 400,
  "details": {
    "email": ["Email already exists"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

**500 Internal Server Error** - Server error
```json
{
  "error": "InternalServerError",
  "message": "An unexpected error occurred",
  "statusCode": 500
}
```

---

### 2. User Signin

**Endpoint**: `POST /api/auth/signin`
**Authentication**: None (public)
**Description**: Authenticate user and receive JWT token

#### Request Body

```json
{
  "email": "string",
  "password": "string"
}
```

**Field Constraints**:
- `email`: Required, valid email format
- `password`: Required

#### Success Response (200 OK)

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2026-02-08T12:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2026-02-09T12:00:00Z"
}
```

#### Error Responses

**401 Unauthorized** - Invalid credentials
```json
{
  "error": "Unauthorized",
  "message": "Invalid email or password",
  "statusCode": 401
}
```

**400 Bad Request** - Validation error
```json
{
  "error": "ValidationError",
  "message": "Invalid input data",
  "statusCode": 400,
  "details": {
    "email": ["Invalid email format"]
  }
}
```

---

### 3. User Signout

**Endpoint**: `POST /api/auth/signout`
**Authentication**: Required (JWT token)
**Description**: Invalidate current session and logout user

#### Request Headers

```
Authorization: Bearer {token}
```

#### Request Body

None (empty body)

#### Success Response (200 OK)

```json
{
  "message": "Successfully signed out"
}
```

#### Error Responses

**401 Unauthorized** - Invalid or expired token
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "statusCode": 401
}
```

---

### 4. Get Current Session

**Endpoint**: `GET /api/auth/session`
**Authentication**: Required (JWT token)
**Description**: Retrieve current authenticated user information

#### Request Headers

```
Authorization: Bearer {token}
```

#### Success Response (200 OK)

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2026-02-08T12:00:00Z"
  },
  "expiresAt": "2026-02-09T12:00:00Z"
}
```

#### Error Responses

**401 Unauthorized** - Invalid or expired token
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "statusCode": 401
}
```

---

## Frontend Integration Notes

### Token Management

1. **Storage**: Store JWT token in localStorage or httpOnly cookie
2. **Attachment**: Attach token to all authenticated requests via Axios interceptor
3. **Expiration**: Check token expiration before requests, refresh if needed
4. **Logout**: Clear token from storage on signout or 401 response

### Error Handling

1. **401 Unauthorized**: Clear auth state, redirect to signin page
2. **400 Bad Request**: Display field-specific validation errors
3. **500 Server Error**: Display generic error message, log to console

### State Management

1. **AuthContext**: Store user and token in React Context
2. **Persistence**: Persist auth state to localStorage for page refreshes
3. **Hydration**: Restore auth state on app initialization

### Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Token Exposure**: Never log tokens or expose in URLs
3. **XSS Protection**: Sanitize user inputs to prevent XSS attacks
4. **CSRF**: Backend should implement CSRF protection for state-changing operations

---

## Example Usage

### Signup Flow

```typescript
import { apiClient } from '@/lib/api';
import { SignupData, AuthResponse } from '@/types';

async function signup(data: SignupData): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/api/auth/signup', {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
  });

  return response.data;
}
```

### Signin Flow

```typescript
async function signin(email: string, password: string): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/api/auth/signin', {
    email,
    password,
  });

  return response.data;
}
```

### Protected Request

```typescript
// Token automatically attached by Axios interceptor
async function getCurrentSession(): Promise<User> {
  const response = await apiClient.get<{ user: User }>('/api/auth/session');
  return response.data.user;
}
```

---

## Testing Checklist

- [ ] Signup with valid data returns 201 and auth response
- [ ] Signup with duplicate email returns 400 error
- [ ] Signup with invalid email format returns 400 error
- [ ] Signup with short password returns 400 error
- [ ] Signin with valid credentials returns 200 and auth response
- [ ] Signin with invalid credentials returns 401 error
- [ ] Signout with valid token returns 200
- [ ] Signout with invalid token returns 401
- [ ] Get session with valid token returns user data
- [ ] Get session with expired token returns 401
- [ ] All protected endpoints reject requests without token
