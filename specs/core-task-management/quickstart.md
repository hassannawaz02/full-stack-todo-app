# Quickstart Guide: Core Task Management API

## Prerequisites

- Python 3.11+
- PostgreSQL-compatible database (Neon Serverless PostgreSQL recommended)
- pip package manager
- virtual environment tool (venv, conda, etc.)

## Local Development Setup

### 1. Clone and Navigate
```bash
# Clone the repository (if applicable)
git clone <repository-url>
cd <project-directory>
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
pip install -r requirements-dev.txt  # For development and testing
```

### 4. Environment Configuration
Create a `.env` file with the following variables:
```env
DATABASE_URL=postgresql+psycopg2://username:password@localhost:5432/dbname
NEON_PROJECT_ID=your_neon_project_id
NEON_API_KEY=your_neon_api_key
SECRET_KEY=your_secret_key_for_jwt
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 5. Database Setup
```bash
# Run database migrations
alembic upgrade head

# Or initialize the database manually if migrations aren't set up yet
python -c "from backend.src.core.database import engine; from backend.src.models import User, Todo; User.metadata.create_all(engine); Todo.metadata.create_all(engine)"
```

## Running the Application

### Development
```bash
# Run with auto-reload for development
uvicorn backend.src.main:app --reload --host 0.0.0.0 --port 8000
```

### Production
```bash
# Run with gunicorn for production
gunicorn backend.src.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## API Usage

### Base URL
```
http://localhost:8000/api
```

### Available Endpoints

#### Task Management
- `GET /api/{user_id}/tasks` - Get all tasks for a user
- `POST /api/{user_id}/tasks` - Create a new task for a user
- `GET /api/{user_id}/tasks/{id}` - Get a specific task
- `PUT /api/{user_id}/tasks/{id}` - Update a specific task
- `DELETE /api/{user_id}/tasks/{id}` - Delete a specific task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle task completion

### Example Requests

#### Create a Task
```bash
curl -X POST "http://localhost:8000/api/user-uuid-here/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish implementing the task management API",
    "due_date": "2023-12-31T23:59:59"
  }'
```

#### Get User's Tasks
```bash
curl -X GET "http://localhost:8000/api/user-uuid-here/tasks"
```

#### Update a Task
```bash
curl -X PUT "http://localhost:8000/api/user-uuid-here/tasks/task-uuid-here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated task title",
    "is_completed": true
  }'
```

## Testing

### Run Unit Tests
```bash
pytest tests/unit/
```

### Run Integration Tests
```bash
pytest tests/integration/
```

### Run All Tests
```bash
pytest tests/
```

### Coverage Report
```bash
pytest --cov=backend tests/ --cov-report=html
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Troubleshooting

### Common Issues

#### Database Connection
- Verify DATABASE_URL is correct
- Check that PostgreSQL server is running
- Ensure credentials are valid

#### User Isolation
- Ensure user_id is passed correctly in endpoints
- Verify that users can only access their own tasks
- Check that proper error responses are returned for unauthorized access

#### Performance
- Monitor response times for the <500ms requirement
- Check for proper database indexing
- Verify async operations are used appropriately