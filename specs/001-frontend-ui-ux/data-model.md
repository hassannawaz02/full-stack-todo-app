# Data Model: Frontend UI, UX & Access Control

**Feature**: 001-frontend-ui-ux
**Date**: 2026-02-08
**Status**: Complete

This document defines all TypeScript interfaces and types used in the frontend application. These models mirror the backend entities and provide type safety throughout the application.

---

## Core Entities

### User

Represents an authenticated user in the system.

```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string; // ISO 8601 date string
  updatedAt?: string; // ISO 8601 date string
}
```

**Fields**:
- `id`: Unique identifier for the user (UUID from backend)
- `email`: User's email address (used for authentication)
- `firstName`: User's first name
- `lastName`: User's last name
- `createdAt`: Timestamp when user account was created
- `updatedAt`: Timestamp when user account was last updated (optional)

**Usage**: Stored in AuthContext, displayed in header/profile areas

---

### Task

Represents a todo item owned by a user.

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}
```

**Fields**:
- `id`: Unique identifier for the task (UUID from backend)
- `title`: Task title/description (required)
- `description`: Optional detailed description
- `completed`: Boolean flag indicating completion status
- `userId`: ID of the user who owns this task
- `createdAt`: Timestamp when task was created
- `updatedAt`: Timestamp when task was last modified

**Usage**: Displayed in task list, managed through CRUD operations

---

## State Management Types

### Authentication State

Manages global authentication state throughout the application.

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}
```

**Fields**:
- `user`: Current authenticated user or null if not authenticated
- `token`: JWT token for API authentication or null
- `isAuthenticated`: Computed boolean (true if user and token exist)
- `isLoading`: Boolean indicating if auth operation is in progress

**Methods**:
- `login`: Authenticate user with email and password
- `signup`: Register new user account
- `logout`: Clear authentication state and redirect to signin
- `refreshSession`: Refresh user session from backend

**Usage**: Provided by AuthContext, consumed via useAuth hook

---

### Theme State

Manages dark/light theme preference.

```typescript
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark'; // Actual theme after resolving 'system'
}
```

**Fields**:
- `theme`: User's theme preference (light, dark, or system)
- `setTheme`: Function to update theme preference
- `resolvedTheme`: Actual theme being displayed (system resolves to light or dark)

**Usage**: Provided by next-themes ThemeProvider, consumed via useTheme hook

---

## Form Data Types

### Signup Form Data

```typescript
interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Zod schema for validation
const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
```

**Validation Rules**:
- `firstName`: Required, max 50 characters
- `lastName`: Required, max 50 characters
- `email`: Required, valid email format
- `password`: Required, minimum 8 characters
- `confirmPassword`: Must match password

---

### Signin Form Data

```typescript
interface SigninData {
  email: string;
  password: string;
}

// Zod schema for validation
const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
```

**Validation Rules**:
- `email`: Required, valid email format
- `password`: Required (no minimum length on signin)

---

### Task Form Data

```typescript
interface TaskFormData {
  title: string;
  description?: string;
}

// Zod schema for validation
const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200),
  description: z.string().max(1000).optional(),
});
```

**Validation Rules**:
- `title`: Required, max 200 characters
- `description`: Optional, max 1000 characters

---

## API Response Types

### Authentication Response

```typescript
interface AuthResponse {
  user: User;
  token: string;
  expiresAt?: string; // ISO 8601 date string
}
```

**Usage**: Response from POST /api/auth/signup and POST /api/auth/signin

---

### Task List Response

```typescript
interface TaskListResponse {
  tasks: Task[];
  total: number;
}
```

**Usage**: Response from GET /api/tasks

---

### Error Response

```typescript
interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  details?: Record<string, string[]>; // Field-specific validation errors
}
```

**Usage**: Standard error response format from backend

---

## UI State Types

### Loading State

```typescript
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface AsyncState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}
```

**Usage**: Track async operation states (API calls, form submissions)

---

### Task Filter

```typescript
type TaskFilter = 'all' | 'active' | 'completed';

interface TaskFilterState {
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
}
```

**Usage**: Filter tasks in task list view

---

## Utility Types

### API Client Types

```typescript
interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

interface ApiError extends Error {
  statusCode: number;
  response?: ErrorResponse;
}
```

---

### Storage Keys

```typescript
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
} as const;

type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
```

**Usage**: Consistent keys for localStorage/sessionStorage

---

## Type Guards

```typescript
function isUser(obj: any): obj is User {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.firstName === 'string' &&
    typeof obj.lastName === 'string'
  );
}

function isTask(obj: any): obj is Task {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.completed === 'boolean' &&
    typeof obj.userId === 'string'
  );
}

function isAuthResponse(obj: any): obj is AuthResponse {
  return (
    typeof obj === 'object' &&
    isUser(obj.user) &&
    typeof obj.token === 'string'
  );
}
```

**Usage**: Runtime type checking for API responses

---

## Component Props Types

### Common Props

```typescript
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

interface ButtonProps extends BaseComponentProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}
```

---

### Task Component Props

```typescript
interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

interface TaskListProps {
  tasks: Task[];
  filter: TaskFilter;
  isLoading: boolean;
  error: string | null;
}

interface TaskFormProps {
  initialData?: TaskFormData;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}
```

---

### Auth Component Props

```typescript
interface SignupFormProps {
  onSuccess: () => void;
}

interface SigninFormProps {
  onSuccess: () => void;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}
```

---

## Summary

This data model provides:
- **Type Safety**: All data structures are strongly typed
- **Validation**: Zod schemas for runtime validation
- **Consistency**: Mirrors backend data models
- **Reusability**: Common types and interfaces for components
- **Error Handling**: Structured error types

All types are exported from `src/types/index.ts` for easy importing throughout the application.
