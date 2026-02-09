# Plan 3 – Frontend & UX

## Technical Context

### Current State
- Need to implement a Next.js 16+ frontend application with App Router
- Backend API exists from Specs 1 and 2 with JWT authentication
- Need to create responsive UI for task management
- Authentication system already implemented in Spec 2
- Must integrate with existing backend services

### Architecture
- Frontend: Next.js 16+ with App Router
- State Management: React Context or SWR/React Query for data fetching
- Styling: Tailwind CSS or similar for responsive design
- Authentication: Integration with existing JWT-based auth system
- API Layer: Interceptors to handle JWT tokens and errors

### Known Unknowns (NEEDS CLARIFICATION)
- Exact backend API endpoints and response formats
- Specific design system or style guide to follow
- Environment variable requirements for API integration
- Specific responsive breakpoints needed
- State management library choice (SWR vs React Query vs Context)

### Dependencies
- Next.js 16+ installation and configuration
- Tailwind CSS or other styling solution
- Authentication integration library
- HTTP client (Axios/fetch) with interceptors
- UI component libraries if needed
- Environment configuration for API endpoints

## Constitution Check

Based on `.specify/memory/constitution.md`, this plan adheres to:
- Responsive and accessible design principles
- Proper error handling and validation
- Minimal viable implementation approach
- Clear separation of concerns between components
- Testable and modular design patterns

## Gates
- [ ] Responsive UI works across mobile, tablet, and desktop
- [ ] Authentication integration with existing backend
- [ ] API calls properly attach JWT tokens
- [ ] Error states handled gracefully
- [ ] Loading states provide good user experience
- [ ] All UI components follow accessibility guidelines

## Phase 0: Outline & Research

### Research Tasks
1. **Next.js 16+ App Router**: Research best practices for App Router implementation
2. **Authentication Integration**: Study how to integrate with existing JWT-based system
3. **API Client Implementation**: Investigate best practices for authenticated API clients
4. **Responsive Design Patterns**: Research mobile-first responsive design patterns
5. **State Management Solutions**: Compare SWR, React Query, and Context for data fetching

### Findings Summary (`research.md`)

#### Decision: Next.js App Router Implementation
- **Rationale**: App Router provides better performance and developer experience
- **Alternatives considered**: Pages Router, traditional SPA
- **Chosen approach**: Leverage App Router with server components where beneficial, client components for interactivity

#### Decision: API Client Strategy
- **Rationale**: Need centralized API handling with JWT token management
- **Alternatives considered**: Direct fetch calls, multiple HTTP clients
- **Chosen approach**: Single API client with request/response interceptors for auth

#### Decision: State Management
- **Rationale**: Need efficient data fetching and caching for task management
- **Alternatives considered**: React Context, Zustand, Redux
- **Chosen approach**: SWR for server state with React Context for auth state

#### Decision: Styling Approach
- **Rationale**: Need consistent, maintainable, and responsive styling
- **Alternatives considered**: CSS Modules, Styled Components, vanilla CSS
- **Chosen approach**: Tailwind CSS for rapid development and responsive design

## Phase 1: Design & Contracts

### Data Model (`data-model.md`)

#### Frontend State Models
- AuthState: { user: User | null, token: string | null, isLoading: boolean, error: string | null }
- TaskState: { tasks: Task[], isLoading: boolean, error: string | null, selectedTask: Task | null }

### API Contracts (`contracts/frontend-api.yaml`)

#### Authentication Endpoints Integration
```
POST /api/auth/signup
- Request: {email: string, password: string, firstName?: string, lastName?: string}
- Response: {access_token: string, user: User}
- Headers: {Authorization: "Bearer {token}"} on success
- Error: {detail: string}

POST /api/auth/signin
- Request: {email: string, password: string}
- Response: {access_token: string, user: User}
- Headers: {Authorization: "Bearer {token}"} on success
- Error: {detail: string}

GET /api/auth/me
- Headers: {Authorization: "Bearer {access_token}"}
- Response: {user: User}
- Error: 401 Unauthorized
```

#### Task Management Endpoints Integration
```
GET /api/tasks
- Headers: {Authorization: "Bearer {access_token}"}
- Response: {tasks: [Task], total_count: number, limit: number, offset: number}
- Error: 401 Unauthorized

POST /api/tasks
- Headers: {Authorization: "Bearer {access_token}"}
- Request: {title: string, description: string}
- Response: {task: Task}
- Error: 401 Unauthorized

GET /api/tasks/{id}
- Headers: {Authorization: "Bearer {access_token}"}
- Response: {task: Task}
- Error: 401 Unauthorized, 404 Not Found

PUT /api/tasks/{id}
- Headers: {Authorization: "Bearer {access_token}"}
- Request: {title?: string, description?: string, is_completed?: boolean}
- Response: {task: Task}
- Error: 401 Unauthorized, 404 Not Found

DELETE /api/tasks/{id}
- Headers: {Authorization: "Bearer {access_token}"}
- Response: {}
- Error: 401 Unauthorized, 404 Not Found

PATCH /api/tasks/{id}/complete
- Headers: {Authorization: "Bearer {access_token}"}
- Request: {is_completed: boolean}
- Response: {task: Task}
- Error: 401 Unauthorized, 404 Not Found
```

### Quickstart Guide (`quickstart.md`)

#### Setting Up the Frontend

1. Initialize Next.js project:
```bash
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/ *"
cd frontend
```

2. Install additional dependencies:
```bash
npm install axios swr react-icons
npm install -D prettier prettier-plugin-tailwindcss
```

3. Create environment variables:
```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-here
```

4. Set up authentication context:
```javascript
// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Implementation details...
```

5. Configure API client with JWT:
```javascript
// src/lib/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add JWT interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
```

## Phase 2: Implementation Strategy

### Component Breakdown
1. **Authentication Components**
   - Sign up form with validation
   - Sign in form with validation
   - Protected route wrapper
   - Auth context provider

2. **Task Management Components**
   - Task list with filtering and sorting
   - Task creation form
   - Task editing functionality
   - Task completion toggle
   - Task deletion with confirmation

3. **API Integration Layer**
   - HTTP client with JWT token attachment
   - Request/response interceptors
   - Error handling utilities
   - Data fetching hooks

4. **Layout and Navigation**
   - Responsive navigation header
   - Mobile menu toggle
   - Main layout component
   - Footer component

### Integration Points
- Authentication state drives UI visibility
- API client centralizes all HTTP calls
- SWR manages server state for tasks
- React Context manages authentication state
- Tailwind CSS ensures responsive design

## Re-evaluated Gates
- [x] Responsive UI works across mobile, tablet, and desktop - Tailwind CSS ensures responsiveness
- [x] Authentication integration with existing backend - JWT token handling via interceptors
- [x] API calls properly attach JWT tokens - Centralized API client with interceptors
- [x] Error states handled gracefully - Error boundaries and proper error handling
- [x] Loading states provide good user experience - SWR provides built-in loading states
- [x] All UI components follow accessibility guidelines - Standard Next.js/accessibility patterns

## Risk Analysis
- **High Risk**: Authentication state synchronization - Mitigation: Proper context management with persistence
- **Medium Risk**: Performance with large task lists - Mitigation: Pagination and virtualization if needed
- **Medium Risk**: Mobile responsiveness - Mitigation: Mobile-first Tailwind approach with testing
- **Low Risk**: Third-party library integration - Mitigation: Popular, well-maintained libraries