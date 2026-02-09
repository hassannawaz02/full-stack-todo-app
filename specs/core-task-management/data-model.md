# Data Model: Core Task Management API

## Entity Relationship Diagram

```
User --------< Todo
  |             |
  | 1         * |
  +-------------+
```

## User Model

### Fields
- `id`: UUID | Primary Key
  - Auto-generated UUID for unique identification
  - Used as foreign key in Todo model

- `email`: String(255) | Unique | Required
  - Validated email format
  - Unique constraint to prevent duplicates

- `username`: String(100) | Unique | Required
  - Unique identifier for the user
  - Used for display purposes

- `created_at`: DateTime | Required
  - Timestamp of user creation
  - Automatically set on creation

- `updated_at`: DateTime | Required
  - Timestamp of last update
  - Automatically updated on changes

### SQLModel Definition
```python
class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(sa_column=Column(String, unique=True, index=True))
    username: str = Field(sa_column=Column(String, unique=True, index=True))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

## Todo Model

### Fields
- `id`: UUID | Primary Key
  - Auto-generated UUID for unique identification

- `title`: String(255) | Required
  - Task title with character limit
  - Required field with validation

- `description`: Text | Optional
  - Detailed task description
  - Nullable field for flexibility

- `is_completed`: Boolean | Default: False
  - Task completion status
  - Default to False for new tasks

- `user_id`: UUID | Foreign Key | Required
  - Links to the User who owns this task
  - Enables user isolation for tasks

- `created_at`: DateTime | Required
  - Timestamp of task creation
  - Automatically set on creation

- `updated_at`: DateTime | Required
  - Timestamp of last update
  - Automatically updated on changes

- `due_date`: DateTime | Optional
  - Optional deadline for the task
  - Nullable field for flexibility

### SQLModel Definition
```python
class Todo(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(sa_column=Column(String, nullable=False))
    description: Optional[str] = Field(default=None)
    is_completed: bool = Field(default=False)
    user_id: uuid.UUID = Field(foreign_key="user.id", ondelete="CASCADE")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    due_date: Optional[datetime] = Field(default=None)
```

## Indexes

### User Table
- Primary Key: `id`
- Unique Index: `email`
- Unique Index: `username`
- Regular Index: `created_at`

### Todo Table
- Primary Key: `id`
- Foreign Key Index: `user_id` (enables efficient user filtering)
- Regular Index: `created_at`
- Regular Index: `is_completed` (for filtering completed tasks)
- Regular Index: `due_date` (for date-based queries)

## Relationships

### User to Todos (One-to-Many)
- A User can have multiple Todos
- Todos are accessed via back-reference in User model
- Cascade deletion configured: deleting a User deletes all their Todos

### Todo to User (Many-to-One)
- Each Todo belongs to exactly one User
- User identity is validated on Todo creation
- Foreign key constraint ensures referential integrity

## Validation Rules

### User Creation
- Email must be in valid format
- Username must be unique
- Both email and username are required

### Todo Creation
- Title is required and must be non-empty
- Title must be less than 256 characters
- User must exist before creating a Todo for them
- Due date cannot be in the past (optional rule)

### Todo Updates
- Only the owning user can update their todos
- Validation applies to updated fields
- Completion status can be toggled independently