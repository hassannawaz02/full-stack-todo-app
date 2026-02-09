# API Contracts: Core Task Management API

## Overview
This document defines the API contracts for the Core Task Management API, including request/response schemas, error handling, and data validation rules.

## Authentication
All endpoints currently accept a user_id in the path. In future implementations, authentication will be handled via JWT tokens in the Authorization header.

## Request/Response Formats
- Content-Type: application/json
- Accept: application/json
- All datetime fields use ISO 8601 format (YYYY-MM-DDTHH:MM:SS)

## API Endpoints

### GET /api/{user_id}/tasks
Retrieve all tasks for a specific user.

#### Parameters
- `user_id` (path): UUID of the user (required)
- `limit` (query): Number of tasks to return (optional, default: 20, max: 100)
- `offset` (query): Number of tasks to skip (optional, default: 0)
- `sort_by` (query): Field to sort by (optional, default: created_at, values: created_at, updated_at, title)
- `order` (query): Sort order (optional, default: desc, values: asc, desc)
- `completed` (query): Filter by completion status (optional, values: true, false, all)

#### Response 200 (application/json)
```json
{
  "tasks": [
    {
      "id": "task-uuid-string",
      "title": "Task title",
      "description": "Task description or null",
      "is_completed": false,
      "user_id": "user-uuid-string",
      "created_at": "2023-10-27T10:00:00",
      "updated_at": "2023-10-27T10:00:00",
      "due_date": "2023-10-30T10:00:00" or null
    }
  ],
  "total_count": 1,
  "limit": 20,
  "offset": 0
}
```

#### Error Responses
- 404: User not found
- 422: Invalid parameters
- 500: Internal server error

---

### POST /api/{user_id}/tasks
Create a new task for a specific user.

#### Parameters
- `user_id` (path): UUID of the user (required)

#### Request Body
```json
{
  "title": "Task title (required, max 255 chars)",
  "description": "Task description (optional)",
  "due_date": "2023-10-30T10:00:00" or null (optional, ISO 8601 format)
}
```

#### Response 201 (application/json)
```json
{
  "id": "new-task-uuid-string",
  "title": "Task title",
  "description": "Task description or null",
  "is_completed": false,
  "user_id": "user-uuid-string",
  "created_at": "2023-10-27T10:00:00",
  "updated_at": "2023-10-27T10:00:00",
  "due_date": "2023-10-30T10:00:00" or null
}
```

#### Error Responses
- 400: Invalid request body
- 404: User not found
- 422: Validation error (e.g., title too long)
- 500: Internal server error

---

### GET /api/{user_id}/tasks/{id}
Retrieve a specific task for a user.

#### Parameters
- `user_id` (path): UUID of the user (required)
- `id` (path): UUID of the task (required)

#### Response 200 (application/json)
```json
{
  "id": "task-uuid-string",
  "title": "Task title",
  "description": "Task description or null",
  "is_completed": false,
  "user_id": "user-uuid-string",
  "created_at": "2023-10-27T10:00:00",
  "updated_at": "2023-10-27T10:00:00",
  "due_date": "2023-10-30T10:00:00" or null
}
```

#### Error Responses
- 404: Task not found or user not found
- 422: Invalid task ID format
- 500: Internal server error

---

### PUT /api/{user_id}/tasks/{id}
Update an existing task for a user.

#### Parameters
- `user_id` (path): UUID of the user (required)
- `id` (path): UUID of the task (required)

#### Request Body
```json
{
  "title": "Task title (optional)",
  "description": "Task description (optional)",
  "is_completed": false (optional),
  "due_date": "2023-10-30T10:00:00" or null (optional)
}
```

#### Response 200 (application/json)
```json
{
  "id": "task-uuid-string",
  "title": "Updated task title",
  "description": "Updated task description or null",
  "is_completed": true,
  "user_id": "user-uuid-string",
  "created_at": "2023-10-27T10:00:00",
  "updated_at": "2023-10-27T11:00:00",
  "due_date": "2023-10-30T10:00:00" or null
}
```

#### Error Responses
- 400: Invalid request body
- 404: Task not found or user not found
- 422: Validation error
- 500: Internal server error

---

### DELETE /api/{user_id}/tasks/{id}
Delete a specific task for a user.

#### Parameters
- `user_id` (path): UUID of the user (required)
- `id` (path): UUID of the task (required)

#### Response 204 (No Content)

#### Error Responses
- 404: Task not found or user not found
- 422: Invalid task ID format
- 500: Internal server error

---

### PATCH /api/{user_id}/tasks/{id}/complete
Toggle the completion status of a task for a user.

#### Parameters
- `user_id` (path): UUID of the user (required)
- `id` (path): UUID of the task (required)

#### Request Body
```json
{
  "is_completed": true (optional, if omitted, toggle current status)
}
```

#### Response 200 (application/json)
```json
{
  "id": "task-uuid-string",
  "title": "Task title",
  "description": "Task description or null",
  "is_completed": true,
  "user_id": "user-uuid-string",
  "created_at": "2023-10-27T10:00:00",
  "updated_at": "2023-10-27T12:00:00",
  "due_date": "2023-10-30T10:00:00" or null
}
```

#### Error Responses
- 400: Invalid request body
- 404: Task not found or user not found
- 422: Invalid task ID format
- 500: Internal server error

## Common Error Response Format
```json
{
  "detail": "Error message explaining what went wrong"
}
```

## Validation Rules
- Title: Required, maximum 255 characters
- Description: Optional, maximum 1000 characters
- User ID: Must be a valid UUID and correspond to an existing user
- Task ID: Must be a valid UUID and correspond to an existing task belonging to the specified user
- Due Date: Must be in ISO 8601 format if provided
- Date fields: Will be automatically converted to UTC