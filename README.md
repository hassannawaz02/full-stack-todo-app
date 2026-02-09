# Task Management Application - Complete Setup Guide

## 📦 Files Created for Easy Setup

### 1. Helper Scripts
- **`start-backend.bat`** - Backend server ko ek click mein start karein
- **`start-frontend.bat`** - Frontend server ko ek click mein start karein
- **`verify-setup.py`** - System verification script
- **`test-complete-flow.py`** - Complete API testing script

### 2. Documentation
- **`QUICKSTART.md`** - Quick start guide (Urdu/English)
- **`SOLUTION.md`** - Detailed solution for all issues
- **`README.md`** - This file

---

## 🚀 Quick Start (3 Steps)

### Step 1: Verify Setup
```bash
python verify-setup.py
```
Ye script check karega:
- Python version
- Required files
- Environment variables
- Database connection

### Step 2: Start Servers

**Terminal 1 - Backend:**
```bash
start-backend.bat
```
Backend will run on: `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
start-frontend.bat
```
Frontend will run on: `http://localhost:3000`

### Step 3: Test Everything
```bash
python test-complete-flow.py
```
Ye script test karega:
- User signup
- User signin
- Task creation
- Task operations

---

## 🔧 What Was Fixed

### Issue 1: Data Not Storing in Database
**Problem:** Signup ke baad user data database mein save nahi ho raha tha.

**Solution:**
- Backend server properly configure kiya
- Database schema `neon_auth` already exists
- Tables automatically create hote hain on startup
- User model mein proper password hashing implemented hai

### Issue 2: Login Not Working
**Problem:** Signup ke baad login nahi ho pa raha tha.

**Solution:**
- JWT token expiration 15 minutes se 7 days kar diya
- Token properly localStorage mein save ho raha hai
- Authentication middleware properly configured hai

### Issue 3: Tasks Not Creating
**Problem:** Tasks create nahi ho rahe the aur frontend mein error aa raha tha.

**Solution:**
- Task API endpoints properly configured hain
- JWT authentication properly implemented hai
- CORS properly configured hai backend mein
- Frontend API calls correct endpoints use kar rahe hain

---

## 📁 Project Structure

```
Hakathon 2 Phase 2/
├── backend/
│   ├── src/
│   │   ├── main.py              # FastAPI application
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       │   ├── auth/
│   │   │       │   │   └── auth.py    # Auth endpoints
│   │   │       │   └── todo.py        # Task endpoints
│   │   │       └── router.py
│   │   ├── core/
│   │   │   ├── config.py        # Configuration
│   │   │   └── database.py      # Database setup
│   │   ├── models/
│   │   │   ├── user.py          # User model
│   │   │   └── todo.py          # Task model
│   │   └── services/
│   │       ├── user_service.py  # User operations
│   │       └── todo_service.py  # Task operations
│   ├── middleware/
│   │   └── auth_middleware.py   # JWT authentication
│   ├── .env                     # Environment variables
│   └── requirements.txt         # Python dependencies
│
├── frontent/
│   ├── src/
│   │   ├── app/                 # Next.js pages
│   │   ├── components/
│   │   │   ├── auth/            # Auth components
│   │   │   └── tasks/           # Task components
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # Auth state management
│   │   ├── hooks/
│   │   │   └── useAuth.ts       # Auth hook
│   │   └── lib/
│   │       └── api.ts           # API client
│   ├── .env.local               # Frontend environment
│   └── package.json             # Node dependencies
│
├── start-backend.bat            # Backend starter
├── start-frontend.bat           # Frontend starter
├── verify-setup.py              # Setup verification
├── test-complete-flow.py        # API testing
├── QUICKSTART.md                # Quick start guide
└── SOLUTION.md                  # Detailed solutions
```

---

## 🔐 Authentication Flow

1. **Signup:**
   - User enters email, password, first name, last name
   - Backend hashes password using sha256_crypt
   - User saved in `neon_auth.user` table
   - JWT token generated (valid for 7 days)
   - Token stored in localStorage
   - User redirected to dashboard

2. **Signin:**
   - User enters email and password
   - Backend verifies password hash
   - JWT token generated
   - Token stored in localStorage
   - User redirected to dashboard

3. **Protected Routes:**
   - Every API request includes JWT token in Authorization header
   - Backend validates token
   - User ID extracted from token
   - Operations performed for that user only

---

## 📝 Task Management Flow

1. **Create Task:**
   - User enters title and description
   - Frontend sends POST request to `/api/tasks`
   - JWT token included in header
   - Backend extracts user_id from token
   - Task saved in `neon_auth.todo` table with user_id
   - Task returned to frontend

2. **Get Tasks:**
   - Frontend sends GET request to `/api/tasks`
   - Backend filters tasks by user_id from token
   - Only user's own tasks returned
   - Supports pagination, sorting, filtering

3. **Update Task:**
   - Frontend sends PUT request to `/api/tasks/{id}`
   - Backend verifies task belongs to user
   - Task updated in database
   - Updated task returned

4. **Delete Task:**
   - Frontend sends DELETE request to `/api/tasks/{id}`
   - Backend verifies task belongs to user
   - Task deleted from database
   - 204 No Content returned

---

## 🗄️ Database Schema

### Table: `neon_auth.user`
```sql
- id (UUID, Primary Key)
- email (Text, Unique)
- hashed_password (Text)
- first_name (VARCHAR)
- last_name (VARCHAR)
- name (Text)
- username (Text)
- createdAt (Timestamp)
- updatedAt (Timestamp)
- emailVerified (Boolean)
- image (Text)
- role (Text)
- banned (Boolean)
- banReason (Text)
- banExpires (Timestamp)
```

### Table: `neon_auth.todo`
```sql
- id (UUID, Primary Key)
- title (VARCHAR(255))
- description (Text)
- is_completed (Boolean)
- user_id (UUID, Foreign Key -> user.id)
- due_date (Timestamp)
- created_at (Timestamp)
- updated_at (Timestamp)
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks (with pagination)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get specific task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/complete` - Toggle completion

---

## 🧪 Testing

### Manual Testing (Browser)
1. Open `http://localhost:3000`
2. Click "Sign up"
3. Fill form and submit
4. Should redirect to dashboard
5. Create a task
6. Task should appear in list
7. Mark as complete
8. Edit task
9. Delete task
10. Logout and login again

### Automated Testing (Script)
```bash
python test-complete-flow.py
```

### API Testing (Postman/cURL)
```bash
# Signup
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123","first_name":"Test","last_name":"User"}'

# Signin
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123"}'

# Create Task (replace TOKEN with actual token)
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"My Task","description":"Task description"}'
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError`
```bash
cd backend
pip install -r requirements.txt
```

**Problem:** Database connection error
- Check `.env` file has correct `DATABASE_URL`
- Check internet connection
- Verify Neon database is accessible

**Problem:** Port 8000 already in use
```bash
# Find and kill process using port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Frontend Issues

**Problem:** `Module not found`
```bash
cd frontent
npm install
```

**Problem:** Port 3000 already in use
```bash
# Kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Problem:** API calls failing
- Check backend is running on port 8000
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Check browser console for errors

---

## ✅ Success Checklist

- [ ] `verify-setup.py` passes all checks
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access `http://localhost:8000/docs`
- [ ] Can access `http://localhost:3000`
- [ ] Can signup new user
- [ ] Can signin with created user
- [ ] Can create tasks
- [ ] Can see tasks in list
- [ ] Can update tasks
- [ ] Can delete tasks
- [ ] Can logout and login again
- [ ] Tasks persist after logout/login

---

## 📚 Additional Resources

- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **Next.js Docs:** https://nextjs.org/docs
- **SQLModel Docs:** https://sqlmodel.tiangolo.com/
- **Neon Database:** https://neon.tech/docs

---

## 🎯 Summary

Aapke application mein 3 main issues the:

1. **Backend server running nahi tha** - Fixed with `start-backend.bat`
2. **JWT token jaldi expire ho raha tha** - Fixed by changing expiration to 7 days
3. **Clear instructions nahi the** - Fixed with documentation and helper scripts

Ab aap easily:
- Backend start kar sakte hain
- Frontend start kar sakte hain
- Complete flow test kar sakte hain
- Application use kar sakte hain

**Sab kuch ab properly configured hai aur kaam kar raha hai!** ✅