---
id: "001"
title: "Todo App Constitution"
stage: "constitution"
date_iso: "2026-02-04"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "master"
user: "User"
command: "/sp.constitution"
labels: ["constitution", "setup", "todo-app"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - ".specify/memory/constitution.md"
tests_yaml: []
---

# Prompt

```
/sp.constitution

Project: Todo Full-Stack Web Application (divided into 3 specs)

Core principles:
- Spec-driven development: all implementation must strictly follow approved specs
- Agentic workflow compliance: spec → plan → tasks → implementation (no manual coding)
- Security-first design: authentication, authorization, and user isolation enforced by default
- Deterministic behavior: APIs and UI must behave consistently across users and sessions
- Full-stack coherence: frontend, backend, and database must integrate seamlessly without mismatches
- Scalability and reliability: system must support multiple concurrent users with zero data loss
- User-centric interface: frontend must be responsive, intuitive, and accessible

Global standards:
- Tech stack: Next.js 16+ (App Router), FastAPI, SQLModel ORM, Neon Serverless PostgreSQL, Better Auth
- RESTful API conventions: standard HTTP methods, status codes, and JSON responses
- JWT-based authentication enforced globally for protected routes
- Data validation, logging, and error handling required across all specs
- Unit and integration testing required for backend and auth flows
- Code must be modular, maintainable, and fully documented
- Frontend must properly integrate with backend APIs across all specs

Constraints:
- Frontend and backend are separate services communicating via REST
- JWT Authorization header mandatory for all protected API calls
- Each user can only access and modify their own tasks
- No manual coding; all implementation must follow the agentic workflow
- API response time <500ms under normal load
- Deployment must be possible with zero manual intervention

Success criteria:
- All specs implemented according to approved global principles
- No unauthorized access or data leaks
- APIs and frontend behave consistently and correctly
- Application is fully deployable and maintainable
- Codebase is clean, modular, and documented
```

# Response

Created the project constitution file at `.specify/memory/constitution.md` with the following content:

## Core Principles
1. Spec-Driven Development: All implementation must follow approved specs
2. Agentic Workflow Compliance: Strict sequence spec → plan → tasks → implementation
3. Security-First Design: Authentication, authorization, and user isolation by default
4. Deterministic Behavior: Consistent API and UI behavior across users and sessions
5. Full-Stack Coherence: Seamless integration between frontend, backend, and database
6. Scalability and Reliability: Support for multiple concurrent users with zero data loss
7. User-Centric Interface: Responsive, intuitive, and accessible frontend

## Global Standards
- Tech stack: Next.js 16+, FastAPI, SQLModel ORM, Neon Serverless PostgreSQL, Better Auth
- RESTful API conventions with standard HTTP methods and JSON responses
- JWT-based authentication for all protected routes
- Required data validation, logging, and error handling
- Unit and integration testing for backend and auth flows
- Modular, maintainable, and documented code

## Constraints
- Separate frontend/backend services communicating via REST
- JWT Authorization header for protected API calls
- User data isolation - each user accesses only their own tasks
- No manual coding outside agentic workflow
- <500ms API response time under normal load
- Zero manual intervention for deployment

## Success Criteria
- All specs implemented per global principles
- No unauthorized access or data leaks
- Consistent API and frontend behavior
- Deployable and maintainable application
- Clean, modular, documented codebase