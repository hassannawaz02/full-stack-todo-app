# Tasks: Frontend UI, UX & Access Control

**Input**: Design documents from `/specs/001-frontend-ui-ux/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are NOT included in this task list as they were not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a web application with frontend in `frontent/` directory (note: typo in directory name but keeping for consistency).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [x] T001 Install required npm dependencies: react-hook-form, zod, @hookform/resolvers, @tanstack/react-query, next-themes, axios
- [x] T002 [P] Initialize shadcn/ui with `npx shadcn@latest init` in frontent/ directory
- [x] T003 [P] Configure Tailwind CSS 4 for dark mode in frontent/tailwind.config.js with darkMode: 'class'
- [x] T004 [P] Configure TypeScript paths in frontent/tsconfig.json for @/ alias to src/
- [x] T005 [P] Create environment variables template in frontent/.env.local with NEXT_PUBLIC_API_URL and NEXT_PUBLIC_APP_URL

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 [P] Create TypeScript types file in frontent/src/types/index.ts with User, Task, AuthState, AuthResponse, SignupData, SigninData, TaskFormData interfaces
- [x] T007 [P] Create Zod validation schemas in frontent/src/lib/validation.ts for signupSchema, signinSchema, taskSchema
- [x] T008 [P] Create storage utilities in frontent/src/lib/storage.ts for localStorage/sessionStorage with STORAGE_KEYS constants
- [x] T009 Create Axios API client in frontent/src/lib/api.ts with base URL, timeout, request interceptor for JWT token, response interceptor for 401 handling
- [x] T010 Create Better Auth client configuration in frontent/src/lib/auth.ts with backend API URL
- [x] T011 Create AuthContext in frontent/src/context/AuthContext.tsx with AuthState, login, signup, logout, refreshSession methods
- [x] T012 Create useAuth custom hook in frontent/src/hooks/useAuth.ts that wraps AuthContext
- [x] T013 [P] Create TanStack Query client configuration in frontent/src/lib/queryClient.ts with cache settings and retry logic
- [x] T014 [P] Wrap root layout with ThemeProvider from next-themes in frontent/src/app/layout.tsx
- [x] T015 [P] Wrap root layout with AuthContext provider in frontent/src/app/layout.tsx
- [x] T016 [P] Wrap root layout with QueryClientProvider in frontent/src/app/layout.tsx
- [x] T017 [P] Add shadcn/ui button component with `npx shadcn@latest add button`
- [x] T018 [P] Add shadcn/ui input component with `npx shadcn@latest add input`
- [x] T019 [P] Add shadcn/ui card component with `npx shadcn@latest add card`
- [x] T020 [P] Add shadcn/ui label component with `npx shadcn@latest add label`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Authentication and Access Control (Priority: P1) 🎯 MVP

**Goal**: Enable users to sign up, sign in, and access protected dashboard with proper authentication gating

**Independent Test**: Create new account, sign out, sign back in, verify unauthenticated users cannot access dashboard URL directly

### Implementation for User Story 1

- [x] T021 [P] [US1] Create ProtectedRoute component in frontent/src/components/auth/ProtectedRoute.tsx that checks authentication and redirects to signin
- [x] T022 [P] [US1] Create SignupForm component in frontent/src/components/auth/SignupForm.tsx with React Hook Form, Zod validation, firstName, lastName, email, password, confirmPassword fields
- [x] T023 [P] [US1] Create SigninForm component in frontent/src/components/auth/SigninForm.tsx with React Hook Form, Zod validation, email, password fields
- [x] T024 [US1] Create signup page in frontent/src/app/signup/page.tsx that renders SignupForm and redirects authenticated users to dashboard
- [x] T025 [US1] Create signin page in frontent/src/app/signin/page.tsx that renders SigninForm and redirects authenticated users to dashboard
- [x] T026 [US1] Create landing page in frontent/src/app/page.tsx with prominent "Sign Up" button and responsive layout
- [x] T027 [US1] Create dashboard page in frontent/src/app/dashboard/page.tsx wrapped with ProtectedRoute component showing empty state initially
- [x] T028 [US1] Implement signup API integration in AuthContext login method calling POST /api/auth/signup
- [x] T029 [US1] Implement signin API integration in AuthContext signup method calling POST /api/auth/signin
- [x] T030 [US1] Implement logout functionality in AuthContext logout method calling POST /api/auth/signout and clearing local storage
- [x] T031 [US1] Add loading states to SignupForm during API calls with disabled submit button
- [x] T032 [US1] Add loading states to SigninForm during API calls with disabled submit button
- [x] T033 [US1] Add error handling to SignupForm displaying validation errors and API errors
- [x] T034 [US1] Add error handling to SigninForm displaying validation errors and API errors
- [x] T035 [US1] Implement redirect logic in signup page to dashboard after successful registration
- [x] T036 [US1] Implement redirect logic in signin page to dashboard after successful authentication
- [x] T037 [US1] Add password match validation in SignupForm using Zod refine method
- [x] T038 [US1] Persist authentication state to localStorage in AuthContext after successful login/signup
- [x] T039 [US1] Restore authentication state from localStorage on app initialization in AuthContext
- [x] T040 [US1] Implement session refresh on app mount in AuthContext calling GET /api/auth/session

**Checkpoint**: At this point, User Story 1 should be fully functional - users can sign up, sign in, and access protected dashboard

---

## Phase 4: User Story 2 - Todo Dashboard and Task Management (Priority: P2)

**Goal**: Enable authenticated users to create, view, update, delete, and toggle tasks with proper loading and error states

**Independent Test**: Sign in and perform all CRUD operations on tasks, verify empty state, loading states, and error handling

### Implementation for User Story 2

- [x] T041 [P] [US2] Create useTasks custom hook in frontent/src/hooks/useTasks.ts using TanStack Query for fetching tasks with useQuery
- [x] T042 [P] [US2] Create TaskList component in frontent/src/components/tasks/TaskList.tsx displaying array of tasks with filter support
- [x] T043 [P] [US2] Create TaskItem component in frontent/src/components/tasks/TaskItem.tsx with toggle, edit, delete buttons and completed/pending visual distinction
- [x] T044 [P] [US2] Create TaskForm component in frontent/src/components/tasks/TaskForm.tsx with React Hook Form, Zod validation, title and description fields
- [x] T045 [P] [US2] Create EmptyState component in frontent/src/components/tasks/EmptyState.tsx with friendly message encouraging first task creation
- [x] T046 [P] [US2] Create LoadingState component in frontent/src/components/tasks/LoadingState.tsx with skeleton loaders for task list
- [x] T047 [US2] Add fetchTasks API function in frontent/src/lib/api.ts calling GET /api/tasks
- [x] T048 [US2] Add createTask API function in frontent/src/lib/api.ts calling POST /api/tasks
- [x] T049 [US2] Add updateTask API function in frontent/src/lib/api.ts calling PUT /api/tasks/:id
- [x] T050 [US2] Add deleteTask API function in frontent/src/lib/api.ts calling DELETE /api/tasks/:id
- [x] T051 [US2] Add toggleTask API function in frontent/src/lib/api.ts calling PATCH /api/tasks/:id/toggle
- [x] T052 [US2] Implement createTask mutation in useTasks hook using useMutation with query invalidation
- [x] T053 [US2] Implement updateTask mutation in useTasks hook using useMutation with query invalidation
- [x] T054 [US2] Implement deleteTask mutation in useTasks hook using useMutation with optimistic update
- [x] T055 [US2] Implement toggleTask mutation in useTasks hook using useMutation with optimistic update
- [x] T056 [US2] Update dashboard page in frontent/src/app/dashboard/page.tsx to render TaskList, TaskForm, and handle empty state
- [x] T057 [US2] Add task creation UI to dashboard with TaskForm component and submit handler
- [x] T058 [US2] Add task update modal/inline editing in TaskItem component with TaskForm
- [x] T059 [US2] Add task deletion confirmation in TaskItem component before calling delete mutation
- [x] T060 [US2] Add task completion toggle in TaskItem component calling toggle mutation on click
- [x] T061 [US2] Display loading state in TaskList when fetching tasks using LoadingState component
- [x] T062 [US2] Display empty state in TaskList when no tasks exist using EmptyState component
- [x] T063 [US2] Display error messages in TaskList when API calls fail
- [x] T064 [US2] Add loading indicators to TaskForm submit button during API calls
- [x] T065 [US2] Disable task action buttons in TaskItem during mutation operations
- [x] T066 [US2] Add success feedback for task operations using toast notifications or inline messages
- [x] T067 [US2] Implement visual distinction between completed and pending tasks in TaskItem with strikethrough or opacity

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - full authentication and task management functional

---

## Phase 5: User Story 3 - Enhanced UI/UX Features (Priority: P3)

**Goal**: Provide polished, responsive UI with dark/light theme toggle and scroll-to-top button across all devices

**Independent Test**: Access application on different devices, toggle theme, scroll to verify scroll-to-top button, confirm theme persists across navigation

### Implementation for User Story 3

- [x] T068 [P] [US3] Create theme toggle component in frontent/src/components/ui/theme-toggle.tsx using useTheme hook from next-themes
- [x] T069 [P] [US3] Create Header component in frontent/src/components/layout/Header.tsx with app title, theme toggle, and logout button
- [x] T070 [P] [US3] Create ScrollToTop component in frontent/src/components/layout/ScrollToTop.tsx with scroll detection and smooth scroll behavior
- [x] T071 [P] [US3] Create useScrollToTop custom hook in frontent/src/hooks/useScrollToTop.ts tracking scroll position and visibility state
- [x] T072 [US3] Add Header component to root layout in frontent/src/app/layout.tsx visible across all pages
- [x] T073 [US3] Add ScrollToTop component to root layout in frontent/src/app/layout.tsx
- [x] T074 [US3] Implement responsive layout for landing page in frontent/src/app/page.tsx with mobile (320px+), tablet (768px+), desktop (1024px+) breakpoints
- [x] T075 [US3] Implement responsive layout for signup page in frontent/src/app/signup/page.tsx with mobile, tablet, desktop breakpoints
- [x] T076 [US3] Implement responsive layout for signin page in frontent/src/app/signin/page.tsx with mobile, tablet, desktop breakpoints
- [x] T077 [US3] Implement responsive layout for dashboard page in frontent/src/app/dashboard/page.tsx with mobile, tablet, desktop breakpoints
- [x] T078 [US3] Ensure all shadcn/ui components support dark mode in frontent/src/components/ui/
- [x] T079 [US3] Add dark mode styles to TaskList component in frontent/src/components/tasks/TaskList.tsx
- [x] T080 [US3] Add dark mode styles to TaskItem component in frontent/src/components/tasks/TaskItem.tsx
- [x] T081 [US3] Add dark mode styles to TaskForm component in frontent/src/components/tasks/TaskForm.tsx
- [x] T082 [US3] Add dark mode styles to SignupForm component in frontent/src/components/auth/SignupForm.tsx
- [x] T083 [US3] Add dark mode styles to SigninForm component in frontent/src/components/auth/SigninForm.tsx
- [x] T084 [US3] Configure theme persistence in next-themes ThemeProvider with localStorage
- [x] T085 [US3] Test theme toggle switches between light and dark modes instantly (under 300ms)
- [x] T086 [US3] Test theme preference persists across page navigation
- [x] T087 [US3] Test theme preference persists across browser sessions
- [x] T088 [US3] Implement scroll-to-top button visibility logic showing after scrolling past 300px threshold
- [x] T089 [US3] Implement smooth scroll behavior in ScrollToTop component with scroll-behavior: smooth
- [x] T090 [US3] Test scroll-to-top button appears within 300ms of scrolling past threshold
- [x] T091 [US3] Ensure touch targets are at least 44x44px on mobile for all buttons and inputs
- [x] T092 [US3] Test responsive layout on mobile devices (375px iPhone width)
- [x] T093 [US3] Test responsive layout on tablet devices (768px iPad width)
- [x] T094 [US3] Test responsive layout on desktop devices (1440px width)

**Checkpoint**: All user stories should now be independently functional with polished, responsive UI and theme support

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final production readiness

- [x] T095 [P] Add global error boundary in frontent/src/app/error.tsx for graceful error handling
- [x] T096 [P] Add loading.tsx files for route-level loading states in frontent/src/app/
- [x] T097 [P] Optimize images using Next.js Image component in all pages
- [x] T098 [P] Implement lazy loading for TaskForm component using dynamic imports
- [x] T099 [P] Add React.memo to TaskItem component for performance optimization
- [x] T100 [P] Add useCallback to event handlers in TaskList component
- [x] T101 [P] Configure next/font for font optimization in frontent/src/app/layout.tsx
- [x] T102 Remove unused components and imports across all files
- [x] T103 Clean up console.log statements and debug code
- [x] T104 Verify all file paths follow project structure from plan.md
- [x] T105 Ensure consistent spacing and typography across all components
- [x] T106 Add proper TypeScript types to all components removing any types
- [x] T107 Test full user flow: Landing → Signup → Signin → Dashboard → Tasks
- [x] T108 Verify authentication gating prevents unauthenticated access to dashboard
- [x] T109 Verify UI behavior on page refresh maintains authentication state
- [x] T110 Verify no unauthorized UI access possible through direct URL navigation
- [x] T111 Test form validation displays errors within 500ms of user input
- [x] T112 Test loading states visible for operations taking longer than 500ms
- [x] T113 Test error messages displayed for failed operations within 2 seconds
- [x] T114 Verify signup process completes in under 90 seconds with valid information
- [x] T115 Verify signin and dashboard access completes in under 10 seconds
- [x] T116 Verify task creation appears in list within 2 seconds
- [x] T117 Verify task toggle completion has immediate visual feedback (under 500ms)
- [ ] T118 Run production build with `npm run build` and verify no errors
- [ ] T119 Test production build with `npm run start` and verify all features work
- [x] T120 Run linter with `npm run lint` and fix all issues

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Requires US1 authentication to be functional for protected dashboard access
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Enhances US1 and US2 but doesn't block them

### Within Each User Story

- Components can be built in parallel when they don't depend on each other
- API functions can be built in parallel
- Mutations depend on API functions being complete
- UI integration depends on components and mutations being complete
- Testing and validation happens after implementation

### Parallel Opportunities

- **Phase 1**: T002, T003, T004, T005 can run in parallel
- **Phase 2**: T006, T007, T008, T013, T014, T015, T016, T017, T018, T019, T020 can run in parallel
- **User Story 1**: T021, T022, T023 can run in parallel (different components)
- **User Story 2**: T041, T042, T043, T044, T045, T046 can run in parallel (different components)
- **User Story 3**: T068, T069, T070, T071 can run in parallel (different components)
- **Polish**: T095, T096, T097, T098, T099, T100, T101 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all independent components for User Story 1 together:
Task: "Create ProtectedRoute component in frontent/src/components/auth/ProtectedRoute.tsx"
Task: "Create SignupForm component in frontent/src/components/auth/SignupForm.tsx"
Task: "Create SigninForm component in frontent/src/components/auth/SigninForm.tsx"
```

---

## Parallel Example: User Story 2

```bash
# Launch all independent components for User Story 2 together:
Task: "Create useTasks custom hook in frontent/src/hooks/useTasks.ts"
Task: "Create TaskList component in frontent/src/components/tasks/TaskList.tsx"
Task: "Create TaskItem component in frontent/src/components/tasks/TaskItem.tsx"
Task: "Create TaskForm component in frontent/src/components/tasks/TaskForm.tsx"
Task: "Create EmptyState component in frontent/src/components/tasks/EmptyState.tsx"
Task: "Create LoadingState component in frontent/src/components/tasks/LoadingState.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T020) - CRITICAL
3. Complete Phase 3: User Story 1 (T021-T040)
4. **STOP and VALIDATE**: Test authentication flow independently
5. Deploy/demo if ready - users can sign up, sign in, access protected dashboard

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - Authentication working!)
3. Add User Story 2 → Test independently → Deploy/Demo (Full task management!)
4. Add User Story 3 → Test independently → Deploy/Demo (Polished UI with themes!)
5. Add Polish → Final production-ready release
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T020)
2. Once Foundational is done:
   - Developer A: User Story 1 (T021-T040) - Authentication
   - Developer B: User Story 2 (T041-T067) - Task Management (can start in parallel but needs US1 auth)
   - Developer C: User Story 3 (T068-T094) - UI/UX Polish (can start in parallel)
3. Stories complete and integrate independently
4. Team completes Polish together (T095-T120)

---

## Task Summary

**Total Tasks**: 120
- **Phase 1 (Setup)**: 5 tasks
- **Phase 2 (Foundational)**: 15 tasks
- **Phase 3 (User Story 1 - P1)**: 20 tasks
- **Phase 4 (User Story 2 - P2)**: 27 tasks
- **Phase 5 (User Story 3 - P3)**: 27 tasks
- **Phase 6 (Polish)**: 26 tasks

**Parallel Opportunities**: 35 tasks marked with [P] can run in parallel within their phase

**MVP Scope** (Recommended first delivery):
- Phase 1: Setup (5 tasks)
- Phase 2: Foundational (15 tasks)
- Phase 3: User Story 1 (20 tasks)
- **Total MVP**: 40 tasks

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All file paths use `frontent/` directory (note: typo in directory name but keeping for consistency)
- Tests are NOT included as they were not explicitly requested in the specification
- Focus on delivering working features incrementally: MVP (US1) → US2 → US3 → Polish
