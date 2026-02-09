# Spec 2 – Authentication & Security

## Overview
This specification defines the authentication and authorization system for the Todo Full-Stack Web Application. It establishes user authentication flows, JWT-based authorization, backend route protection, and user-specific task ownership enforcement.

## Focus Areas
- User authentication
- JWT-based authorization
- Securing backend API routes
- Enforcing task ownership per user

## Functional Requirements

### User Authentication
1. **Signup and Signin**
   - Users must be able to sign up through the frontend
   - Users must be able to sign in through the frontend
   - Frontend must use Better Auth for authentication flows

2. **JWT Token Integration**
   - Better Auth must be configured to issue JWT tokens
   - JWT tokens must be issued upon successful authentication
   - Frontend must attach JWT token to all API requests

3. **Backend Verification**
   - FastAPI backend must implement JWT verification
   - All backend API endpoints must be protected
   - Backend must extract authenticated user identity from JWT
   - Requests without valid JWT must return 401

4. **Task Ownership Enforcement**
   - Each user can access only their own tasks
   - Users cannot access or modify other users' tasks
   - Task operations must be scoped to authenticated user

## Technical Requirements

### Authentication Framework
- Authentication must use Better Auth and JWT
- Frontend must be a Next.js application with Better Auth integration
- Frontend and backend must share the same JWT secret
- Backend must be stateless and rely only on JWT for authentication

### Token Management
- JWT tokens must carry user identity information
- Token expiration must be enforced
- Tokens must be securely transmitted with API requests
- Proper token storage on the frontend

### API Protection
- All protected routes must return 401 if token is missing or invalid
- Backend must validate JWT signature using shared secret
- Authentication checks must occur before processing requests
- Consistent error responses for authentication failures

## Architecture

### Components
1. **Frontend Authentication Layer**
   - Next.js application with Better Auth integration
   - Signup and signin UI components
   - JWT token storage and management
   - Automatic attachment of JWT to API requests

2. **Token Generation System**
   - Better Auth configured with JWT plugin
   - JWT token creation upon successful authentication
   - Token signing with shared secret
   - Token expiration handling

3. **Backend Verification Layer**
   - FastAPI middleware for JWT verification
   - User identity extraction from JWT claims
   - Request context decoration with user identity
   - 401 response for invalid/missing tokens

4. **Authorization Layer**
   - Task ownership validation
   - User-scoped data access
   - Cross-user access prevention
   - Permission enforcement for operations

### Data Flow
1. User initiates signup/signin on frontend via Better Auth
2. Better Auth creates JWT token with user identity
3. Frontend stores JWT token securely
4. Frontend attaches JWT to all API requests
5. Backend receives request and validates JWT signature
6. Backend extracts user identity from JWT claims
7. Backend verifies user permissions for requested operation
8. Backend processes request if user is authorized
9. Backend returns 401 if authentication fails

## Security Rules

### Authentication Security
- Passwords must be securely handled by Better Auth
- JWT tokens must be signed with shared secret
- Tokens must be transmitted over secure channels
- Token storage must be secure on frontend

### Authorization Security
- User identity derived only from verified JWT
- Task ownership validated on every operation
- No access to other users' data allowed
- Consistent authorization checks across all endpoints

### Error Handling
- Invalid JWT tokens result in 401 responses
- Missing tokens result in 401 responses
- Expired tokens result in 401 responses
- Clear error messages for debugging without exposing security details

## Constraints

### Technical Constraints
- Authentication must use Better Auth and JWT
- Frontend and backend must share the same JWT secret
- Backend must be stateless and rely only on JWT
- Implementation must follow agentic workflow: no manual coding
- All protected routes must return 401 if token is missing or invalid

### Integration Constraints
- Must integrate seamlessly with Spec 1 APIs
- No breaking changes to existing API contracts
- Maintain backward compatibility where possible
- Consistent authentication patterns across all endpoints

## Acceptance Criteria

### User Authentication
- [ ] Users can successfully sign up through frontend
- [ ] Users can successfully sign in through frontend
- [ ] Better Auth is properly integrated with Next.js frontend
- [ ] Authentication flows work as expected

### JWT Functionality
- [ ] JWT tokens are issued correctly upon authentication
- [ ] JWT tokens are verified correctly on backend
- [ ] Frontend properly attaches JWT to API requests
- [ ] Token expiration is enforced appropriately

### API Protection
- [ ] All backend API endpoints are protected
- [ ] Unauthorized requests receive 401 responses
- [ ] Valid JWT tokens grant access to protected resources
- [ ] Invalid/missing tokens result in 401 responses

### Task Ownership
- [ ] Users can access only their own tasks
- [ ] Users cannot access or modify other users' tasks
- [ ] Task operations are properly scoped to authenticated user
- [ ] Cross-user access is prevented effectively

### Integration
- [ ] Authentication integrates seamlessly with Spec 1 APIs
- [ ] No breaking changes to existing functionality
- [ ] Consistent behavior across all endpoints
- [ ] Error handling follows established patterns

## Dependencies

### Required Libraries
- Better Auth for frontend authentication
- JWT libraries for token handling
- Next.js for frontend application
- FastAPI for backend framework
- Python-JOSE for JWT verification on backend

### Configuration
- Shared JWT secret between frontend and backend
- Environment variables for JWT configuration
- Better Auth configuration settings
- FastAPI middleware setup