# Tasks API Contract

**Feature**: 001-frontend-ui-ux
**Date**: 2026-02-08
**Backend Spec**: Spec 1 & 2 (Task Management)

This document defines the task management API endpoints that the frontend will consume from the backend.

---

## Base Configuration

**Base URL**: `http://localhost:8000` (development) or environment variable `NEXT_PUBLIC_API_URL`
**Content-Type**: `application/json`
**Authentication**: JWT token in `Authorization: Bearer {token}` header (all endpoints require authentication)

---

## Endpoints

### 1. List All Tasks

**Endpoint**: `GET /api/tasks`
**Authentication**: Required (JWT token)
**Description**: Retrieve all tasks for the authenticated user

#### Request Headers

```
Authorization: Bearer {token}
```

#### Query Parameters (Optional)

```
?filter=all|active|completed  # Filter tasks by completion status
?sort=createdAt|updatedAt     # Sort field
?order=asc|desc               # Sort order
```

#### Success Response (200 OK)

```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Complete project documentation",
      "description": "Write comprehensive docs for the new feature",
      "completed": false,
      "userId": "uuid",
      "createdAt": "2026-02-08T12:00:00Z",
      "updatedAt": "2026-02-08T12:00:00Z"
    },
    {
      "id": "uuid",
      "title": "Review pull requests",
      "description": null,
      "completed": true,
      "userId": "uuid",
      "createdAt": "2026-02-07T10:00:00Z",
      "updatedAt": "2026-02-08T09:00:00Z"
    }
  ],
  "total": 2
}
```

#### Error Responses

**401 Unauthorized** - Invalid or missing token
```json
{
  "error": "Unauthorized",
  "message": "Authentication required",
  "statusCode": 401
}
```

---

### 2. Create Task

**Endpoint**: `POST /api/tasks`
**Authentication**: Required (JWT token)
**Description**: Create a new task for the authenticated user

#### Request Headers

```
Authorization: Bearer {token}
```

#### Request Body

```json
{
  "title": "string",
  "description": "string (optional)"
}
```

**Field Constraints**:
- `title`: Required, 1-200 characters
- `description`: Optional, max 1000 characters

#### Success Response (201 Created)

```json
{
  "id": "uuid",
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for the new feature",
  "completed": false,
  "userId": "uuid",
  "createdAt": "2026-02-08T12:00:00Z",
  "updatedAt": "2026-02-08T12:00:00Z"
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
    "title": ["Title is required"],
    "description": ["Description exceeds maximum length"]
  }
}
```

**401 Unauthorized** - Invalid or missing token
```json
{
  "error": "Unauthorized",
  "message": "Authentication required",
  "statusCode": 401
}
```

---

### 3. Get Single Task

**Endpoint**: `GET /api/tasks/:id`
**Authentication**: Required (JWT token)
**Description**: Retrieve a specific task by ID (must belong to authenticated user)

#### Request Headers

```
Authorization: Bearer {token}
```

#### URL Parameters

- `id`: Task UUID

#### Success Response (200 OK)

```json
{
  "id": "uuid",
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for the new feature",
  "completed": false,
  "userId": "uuid",
  "createdAt": "2026-02-08T12:00:00Z",
  "updatedAt": "2026-02-08T12:00:00Z"
}
```

#### Error Responses

**404 Not Found** - Task not found or doesn't belong to user
```json
{
  "error": "NotFound",
  "message": "Task not found",
  "statusCode": 404
}
```

**401 Unauthorized** - Invalid or missing token
```json
{
  "error": "Unauthorized",
  "message": "Authentication required",
  "statusCode": 401
}
```

---

### 4. Update Task

**Endpoint**: `PUT /api/tasks/:id`
**Authentication**: Required (JWT token)
**Description**: Update an existing task (must belong to authenticated user)

#### Request Headers

```
Authorization: Bearer {token}
```

#### URL Parameters

- `id`: Task UUID

#### Request Body

```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "completed": "boolean (optional)"
}
```

**Field Constraints**:
- `title`: Optional, 1-200 characters if provided
- `description`: Optional, max 1000 characters if provided
- `completed`: Optional, boolean

**Note**: At least one field must be provided

#### Success Response (200 OK)

```json
{
  "id": "uuid",
  "title": "Updated task title",
  "description": "Updated description",
  "completed": false,
  "userId": "uuid",
  "createdAt": "2026-02-08T12:00:00Z",
  "updatedAt": "2026-02-08T13:00:00Z"
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
    "title": ["Title cannot be empty"]
  }
}
```

**404 Not Found** - Task not found or doesn't belong to user
```json
{
  "error": "NotFound",
  "message": "Task not found",
  "statusCode": 404
}
```

**401 Unauthorized** - Invalid or missing token
```json
{
  "error": "Unauthorized",
  "message": "Authentication required",
  "statusCode": 401
}
```

---

### 5. Delete Task

**Endpoint**: `DELETE /api/tasks/:id`
**Authentication**: Required (JWT token)
**Description**: Delete a task (must belong to authenticated user)

#### Request Headers

```
Authorization: Bearer {token}
```

#### URL Parameters

- `id`: Task UUID

#### Success Response (200 OK)

```json
{
  "message": "Task deleted successfully",
  "id": "uuid"
}
```

#### Error Responses

**404 Not Found** - Task not found or doesn't belong to user
```json
{
  "error": "NotFound",
  "message": "Task not found",
  "statusCode": 404
}
```

**401 Unauthorized** - Invalid or missing token
```json
{
  "error": "Unauthorized",
  "message": "Authentication required",
  "statusCode": 401
}
```

---

### 6. Toggle Task Completion

**Endpoint**: `PATCH /api/tasks/:id/toggle`
**Authentication**: Required (JWT token)
**Description**: Toggle the completion status of a task (must belong to authenticated user)

#### Request Headers

```
Authorization: Bearer {token}
```

#### URL Parameters

- `id`: Task UUID

#### Request Body

None (empty body)

#### Success Response (200 OK)

```json
{
  "id": "uuid",
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for the new feature",
  "completed": true,
  "userId": "uuid",
  "createdAt": "2026-02-08T12:00:00Z",
  "updatedAt": "2026-02-08T14:00:00Z"
}
```

#### Error Responses

**404 Not Found** - Task not found or doesn't belong to user
```json
{
  "error": "NotFound",
  "message": "Task not found",
  "statusCode": 404
}
```

**401 Unauthorized** - Invalid or missing token
```json
{
  "error": "Unauthorized",
  "message": "Authentication required",
  "statusCode": 401
}
```

---

## Frontend Integration Notes

### TanStack Query Integration

Use TanStack Query for efficient server state management:

```typescript
// Query for fetching tasks
const tasksQuery = useQuery({
  queryKey: ['tasks'],
  queryFn: fetchTasks,
});

// Mutation for creating task
const createTaskMutation = useMutation({
  mutationFn: createTask,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  },
});

// Mutation for toggling task with optimistic update
const toggleTaskMutation = useMutation({
  mutationFn: toggleTask,
  onMutate: async (taskId) => {
    await queryClient.cancelQueries({ queryKey: ['tasks'] });
    const previousTasks = queryClient.getQueryData(['tasks']);

    queryClient.setQueryData(['tasks'], (old) => ({
      ...old,
      tasks: old.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));

    return { previousTasks };
  },
  onError: (err, taskId, context) => {
    queryClient.setQueryData(['tasks'], context.previousTasks);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  },
});
```

### Error Handling

1. **401 Unauthorized**: Clear auth state, redirect to signin
2. **404 Not Found**: Show "Task not found" message, refresh task list
3. **400 Bad Request**: Display field-specific validation errors
4. **Network Errors**: Show retry button, maintain optimistic updates

### Optimistic Updates

Implement optimistic updates for:
- **Toggle completion**: Immediately update UI, rollback on error
- **Delete task**: Remove from UI immediately, rollback on error
- **Create task**: Add to UI with temporary ID, replace on success

### Caching Strategy

- **Cache time**: 5 minutes for task list
- **Stale time**: 1 minute (refetch if data is older than 1 minute)
- **Refetch on**: Window focus, network reconnect
- **Invalidate on**: Create, update, delete, toggle operations

---

## Example Usage

### Fetch All Tasks

```typescript
import { apiClient } from '@/lib/api';
import { Task } from '@/types';

async function fetchTasks(): Promise<Task[]> {
  const response = await apiClient.get<{ tasks: Task[] }>('/api/tasks');
  return response.data.tasks;
}
```

### Create Task

```typescript
async function createTask(data: TaskFormData): Promise<Task> {
  const response = await apiClient.post<Task>('/api/tasks', data);
  return response.data;
}
```

### Update Task

```typescript
async function updateTask(id: string, data: Partial<TaskFormData>): Promise<Task> {
  const response = await apiClient.put<Task>(`/api/tasks/${id}`, data);
  return response.data;
}
```

### Delete Task

```typescript
async function deleteTask(id: string): Promise<void> {
  await apiClient.delete(`/api/tasks/${id}`);
}
```

### Toggle Task Completion

```typescript
async function toggleTask(id: string): Promise<Task> {
  const response = await apiClient.patch<Task>(`/api/tasks/${id}/toggle`);
  return response.data;
}
```

---

## Testing Checklist

- [ ] List tasks returns all user's tasks
- [ ] List tasks with filter returns filtered results
- [ ] Create task with valid data returns 201 and task object
- [ ] Create task with empty title returns 400 error
- [ ] Create task with long description returns 400 error
- [ ] Get task by ID returns task if owned by user
- [ ] Get task by ID returns 404 if not owned by user
- [ ] Update task with valid data returns updated task
- [ ] Update task with invalid data returns 400 error
- [ ] Delete task removes task and returns success
- [ ] Delete non-existent task returns 404
- [ ] Toggle task changes completion status
- [ ] All endpoints require authentication
- [ ] All endpoints enforce user isolation (can't access other users' tasks)
