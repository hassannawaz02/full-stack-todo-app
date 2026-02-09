# Plan 2 – Authentication & Security

## Technical Context

### Current State
- Need to implement authentication for the Todo Full-Stack Web Application
- Spec 1 APIs exist and need to be protected with authentication
- Need to integrate Better Auth with Next.js frontend
- Need to implement JWT-based authentication with FastAPI backend
- User data isolation required for task operations

### Architecture
- Frontend: Next.js application with Better Auth integration
- Backend: FastAPI application with JWT middleware
- Authentication: Better Auth for signup/signin flows
- Authorization: JWT-based access control with user identity verification
- Security: Token-based authentication with shared secret

### Known Unknowns (NEEDS CLARIFICATION)
- Current database schema for users and tasks
- Specific endpoints from Spec 1 that need protection
- User identity storage format in JWT claims
- Error handling strategy for authentication failures

### Dependencies
- Better Auth library installation
- JWT libraries for both frontend and backend
- Database schema updates for user accounts
- Environment configuration for JWT secrets
- FastAPI middleware for JWT validation

## Constitution Check

Based on `.specify/memory/constitution.md`, this plan adheres to:
- Security-first design principles
- Proper error handling and validation
- Minimal viable implementation approach
- Clear separation of concerns between components
- Testable and modular design patterns

## Gates
- [ ] Security requirements fully satisfied (authentication/authorization)
- [ ] All dependencies properly resolved before implementation
- [ ] Database schema compatible with user management
- [ ] Environment configuration secure for production
- [ ] API compatibility maintained with existing features

## Phase 0: Outline & Research

### Research Tasks
1. **Better Auth Integration**: Research Better Auth setup with Next.js and JWT configuration options
2. **JWT Best Practices**: Investigate best practices for JWT token handling in full-stack applications
3. **FastAPI Authentication Middleware**: Study FastAPI middleware patterns for JWT validation
4. **Database Schema Design**: Determine optimal schema for storing user data with task relationships
5. **Token Security Patterns**: Research secure token storage and transmission practices

### Findings Summary (`research.md`)

#### Decision: Authentication Library Choice
- **Rationale**: Better Auth chosen for its Next.js compatibility and built-in JWT support
- **Alternatives considered**: NextAuth.js, Auth0, Clerk, custom solution
- **Chosen approach**: Better Auth with JWT plugin for seamless frontend/backend integration

#### Decision: JWT Configuration
- **Rationale**: JWT tokens with appropriate expiration times provide stateless authentication
- **Alternatives considered**: Session-based authentication, OAuth providers
- **Chosen approach**: Access tokens with 15-minute expiry, refresh tokens with 7-day expiry

#### Decision: Database Schema Extension
- **Rationale**: Extend existing schema to include user ownership of tasks
- **Alternatives considered**: Separate authentication service, external identity provider
- **Chosen approach**: Local user management with foreign key relationships to tasks

#### Decision: Security Practices
- **Rationale**: Following industry best practices for token security
- **Alternatives considered**: Various security implementations
- **Chosen approach**: HttpOnly cookies for token storage where possible, HTTPS enforcement, proper CORS settings

## Phase 1: Design & Contracts

### Data Model (`data-model.md`)

#### User Entity
- id: UUID (primary key)
- email: String (unique, indexed)
- password_hash: String (bcrypt encrypted)
- created_at: DateTime (timestamp)
- updated_at: DateTime (timestamp)
- is_verified: Boolean (email verification status)

#### Task Entity (Updated with user ownership)
- id: UUID (primary key)
- title: String (task title)
- description: Text (optional task description)
- user_id: UUID (foreign key to users table, required)
- created_at: DateTime (timestamp)
- updated_at: DateTime (timestamp)
- status: String (pending, in-progress, completed)

### API Contracts (`contracts/auth-api.yaml`)

#### Authentication Endpoints
```
POST /api/auth/signup
- Request: {email: string, password: string}
- Response: {user: User, access_token: string, refresh_token: string}
- Status: 201 Created on success, 400 Bad Request on validation error, 409 Conflict if email exists

POST /api/auth/signin
- Request: {email: string, password: string}
- Response: {user: User, access_token: string, refresh_token: string}
- Status: 200 OK on success, 401 Unauthorized on invalid credentials

POST /api/auth/signout
- Request: {refresh_token: string}
- Response: {success: boolean}
- Status: 200 OK

GET /api/auth/me
- Headers: Authorization: Bearer {access_token}
- Response: {user: User}
- Status: 200 OK on success, 401 Unauthorized if token invalid
```

#### Protected Task Endpoints (Updated from Spec 1)
```
GET /api/tasks
- Headers: Authorization: Bearer {access_token}
- Response: [{Task}]
- Status: 200 OK on success, 401 Unauthorized if not authenticated
- Behavior: Returns only tasks belonging to authenticated user

POST /api/tasks
- Headers: Authorization: Bearer {access_token}
- Request: {title: string, description: string}
- Response: {Task}
- Status: 201 Created on success, 401 Unauthorized if not authenticated
- Behavior: Creates task for authenticated user

GET /api/tasks/{task_id}
- Headers: Authorization: Bearer {access_token}
- Response: {Task}
- Status: 200 OK on success, 401 Unauthorized if not authenticated, 404 Not Found if task doesn't exist or belongs to different user
- Behavior: Returns task only if it belongs to authenticated user

PUT /api/tasks/{task_id}
- Headers: Authorization: Bearer {access_token}
- Request: {title?: string, description?: string, status?: string}
- Response: {Task}
- Status: 200 OK on success, 401 Unauthorized if not authenticated, 404 Not Found if task doesn't exist or belongs to different user
- Behavior: Updates task only if it belongs to authenticated user

DELETE /api/tasks/{task_id}
- Headers: Authorization: Bearer {access_token}
- Response: {success: boolean}
- Status: 200 OK on success, 401 Unauthorized if not authenticated, 404 Not Found if task doesn't exist or belongs to different user
- Behavior: Deletes task only if it belongs to authenticated user
```

### Quickstart Guide (`quickstart.md`)

#### Setting Up Authentication

1. Install dependencies:
```bash
npm install better-auth @better-auth/jwt-plugin
pip install python-jose[cryptography] passlib[bcrypt] fastapi
```

2. Configure Better Auth in Next.js:
```javascript
// lib/auth.js
import { betterAuth } from "better-auth";
import { jwtPlugin } from "@better-auth/jwt-plugin";

export const auth = betterAuth({
  secret: process.env.AUTH_SECRET,
  database: {
    // Database configuration
  },
  plugins: [
    jwtPlugin({
      secret: process.env.AUTH_JWT_SECRET,
      expiresIn: "15m",
    }),
  ],
});
```

3. Set up FastAPI JWT middleware:
```python
# middleware/auth_middleware.py
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from typing import Dict
import os

security = HTTPBearer()
SECRET_KEY = os.getenv("AUTH_JWT_SECRET")
ALGORITHM = "HS256"

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Could not validate credentials")
        return {"user_id": user_id}
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
```

4. Apply middleware to protected routes:
```python
# routers/tasks.py
from fastapi import APIRouter, Depends
from .middleware.auth_middleware import get_current_user

router = APIRouter()

@router.get("/tasks")
async def get_tasks(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    # Query tasks for this specific user_id only
    pass

@router.post("/tasks")
async def create_task(task_data: TaskCreate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    # Create task with this user_id
    pass
```

## Phase 2: Implementation Strategy

### Component Breakdown
1. **Frontend Authentication Layer**
   - Better Auth client initialization
   - Sign up/sign in UI components
   - Session management hooks
   - JWT token storage and transmission

2. **Backend Authentication Service**
   - JWT token generation and validation
   - User registration/login endpoints
   - Password hashing and verification
   - Token expiration handling

3. **Authorization Middleware**
   - FastAPI middleware for token validation
   - User context extraction from tokens
   - Permission checking for operations
   - Error handling for authentication failures

4. **Data Access Control**
   - Task ownership verification
   - Database query modifications to enforce user isolation
   - Cross-user access prevention

### Integration Points
- Frontend authentication flows connect to backend services
- JWT tokens passed from frontend to backend for verification
- Database queries filtered by user ID for proper isolation
- Error responses consistent across frontend and backend

## Re-evaluated Gates
- [x] Security requirements met - JWT with proper validation and expiration
- [x] Dependencies identified and documented
- [x] Database schema designed to support user management
- [x] Environment configuration addressed for secret management
- [x] API compatibility maintained with existing features through middleware approach

## Risk Analysis
- **High Risk**: Token security - Mitigation: HttpOnly cookies where possible, HTTPS enforcement, proper token validation
- **Medium Risk**: Database migration - Mitigation: Backup and rollback procedures, proper migration scripts
- **Medium Risk**: Integration with existing Spec 1 APIs - Mitigation: Backwards-compatible middleware approach
- **Low Risk**: Frontend integration - Mitigation: Progressive rollout with proper error handling