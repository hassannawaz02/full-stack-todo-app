# Research & Technical Decisions: Frontend UI, UX & Access Control

**Feature**: 001-frontend-ui-ux
**Date**: 2026-02-08
**Status**: Complete

This document contains all technical research and decisions made during Phase 0 of the planning process. Each decision includes rationale, alternatives considered, and implementation notes.

---

## 1. Frontend Testing Strategy

**Decision**: Vitest + React Testing Library for unit/integration tests, with Playwright for E2E testing

**Rationale**:
- Vitest is faster than Jest and has better ESM support, which aligns with Next.js 15 and modern tooling
- React Testing Library is the industry standard for testing React components with focus on user behavior
- Playwright provides robust E2E testing with better performance than Cypress for Next.js applications
- This combination provides comprehensive coverage: unit tests (components), integration tests (flows), and E2E tests (full user journeys)

**Alternatives Considered**:
- **Jest + React Testing Library**: More established but slower, and requires additional configuration for ESM modules in Next.js 15
- **Cypress for E2E**: Good tool but Playwright has better performance, built-in test parallelization, and better TypeScript support

**Implementation Notes**:
- Install: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@playwright/test`
- Configure Vitest in `vitest.config.ts` with React and Next.js support
- Create test utilities for common patterns (render with providers, mock auth state)
- Set up Playwright config for different browsers and viewports
- Aim for >80% code coverage on critical paths (auth, task operations)

**References**:
- Vitest: https://vitest.dev/
- React Testing Library: https://testing-library.com/react
- Playwright: https://playwright.dev/

---

## 2. Error Logging and Monitoring

**Decision**: Console logging for development + Error boundaries with user-friendly messages for production (no external service initially)

**Rationale**:
- For MVP/initial release, console logging is sufficient for development debugging
- React Error Boundaries provide graceful error handling and prevent full app crashes
- User-friendly error messages improve UX without exposing technical details
- External services (Sentry, LogRocket) can be added later if needed, but add complexity and cost
- This approach keeps the frontend lightweight and focused on core functionality

**Alternatives Considered**:
- **Sentry integration**: Excellent for production monitoring but adds dependency, cost, and setup complexity for initial release
- **Custom backend logging**: Requires backend API changes which are out of scope for this spec

**Implementation Notes**:
- Create global Error Boundary component wrapping the app
- Implement error boundaries for critical sections (auth forms, task operations)
- Log errors to console in development mode
- Display user-friendly error messages in production (e.g., "Something went wrong. Please try again.")
- Include error recovery actions (retry button, return to dashboard)
- Consider adding Sentry in future iteration if error tracking becomes critical

**References**:
- React Error Boundaries: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary

---

## 3. State Management Approach

**Decision**: React Context for authentication state + TanStack Query (React Query) for server state (tasks)

**Rationale**:
- React Context is perfect for global authentication state (user, token, isAuthenticated) - simple and built-in
- TanStack Query excels at server state management with built-in caching, refetching, optimistic updates, and loading states
- This combination avoids over-engineering while providing powerful features for task operations
- TanStack Query automatically handles loading/error states, reducing boilerplate
- Optimistic updates for task operations improve perceived performance

**Alternatives Considered**:
- **React Context only**: Would require manual implementation of caching, loading states, and optimistic updates
- **Zustand**: Good for client state but doesn't provide server state features like TanStack Query
- **Redux Toolkit**: Over-engineered for this use case; adds significant complexity and boilerplate

**Implementation Notes**:
- Create `AuthContext` for authentication state (user, token, login, logout, isLoading)
- Use TanStack Query for all task-related API calls (useQuery for fetching, useMutation for CRUD)
- Configure query client with appropriate cache times and retry logic
- Implement optimistic updates for task toggle and delete operations
- Use query invalidation to refetch tasks after mutations

**References**:
- TanStack Query: https://tanstack.com/query/latest
- React Context: https://react.dev/reference/react/useContext

---

## 4. Form Validation Library

**Decision**: React Hook Form + Zod for type-safe form validation

**Rationale**:
- React Hook Form provides excellent performance with minimal re-renders
- Zod offers type-safe schema validation that integrates seamlessly with TypeScript
- The combination is lightweight, modern, and widely adopted in the Next.js ecosystem
- Built-in error handling and validation messages
- Easy integration with Better Auth and custom validation rules

**Alternatives Considered**:
- **Formik + Yup**: More established but heavier and causes more re-renders than React Hook Form
- **Custom validation**: Would require significant boilerplate and manual error handling

**Implementation Notes**:
- Install: `react-hook-form`, `zod`, `@hookform/resolvers`
- Create Zod schemas for signup form (firstName, lastName, email, password, confirmPassword)
- Create Zod schema for signin form (email, password)
- Create Zod schema for task form (title, description)
- Use `zodResolver` to integrate Zod with React Hook Form
- Display validation errors inline with form fields
- Validate on blur and on submit

**References**:
- React Hook Form: https://react-hook-form.com/
- Zod: https://zod.dev/

---

## 5. shadcn/ui Integration

**Decision**: Install shadcn/ui CLI and add components as needed, with custom Tailwind CSS 4 theme configuration

**Rationale**:
- shadcn/ui provides high-quality, accessible components that can be customized
- Components are copied into the project (not a dependency), giving full control
- Excellent dark/light mode support out of the box
- Works well with Tailwind CSS 4 and Next.js 15
- Theme toggle component is specifically required by the spec

**Alternatives Considered**:
- **Custom components**: Would require significant time to build accessible, polished components
- **Other UI libraries (MUI, Chakra)**: More opinionated and harder to customize; larger bundle sizes

**Implementation Notes**:
- Run: `npx shadcn@latest init` to set up shadcn/ui
- Add required components: `npx shadcn@latest add button input card label`
- Add theme toggle component (custom or from shadcn examples)
- Configure Tailwind CSS 4 with custom color palette for dark/light modes
- Use CSS variables for theme colors to enable smooth transitions
- Ensure all components support both themes

**References**:
- shadcn/ui: https://ui.shadcn.com/
- Tailwind CSS 4: https://tailwindcss.com/

---

## 6. Better Auth Client Integration

**Decision**: Use Better Auth client with React hooks for session management, with middleware for protected routes

**Rationale**:
- Better Auth is already used in the backend (Spec 1 & 2), ensuring consistency
- Provides React hooks for easy session management
- Supports JWT tokens which align with backend implementation
- Works well with Next.js App Router (both server and client components)

**Alternatives Considered**:
- **NextAuth.js**: Different from backend auth system, would create inconsistency
- **Custom auth implementation**: Would duplicate work already done in Better Auth

**Implementation Notes**:
- Configure Better Auth client in `lib/auth.ts` with backend API URL
- Use `useSession()` hook from Better Auth for accessing current user
- Create custom `useAuth()` hook wrapping Better Auth for additional functionality
- Implement middleware or route guards for protected pages
- Store JWT token in httpOnly cookie (if supported) or localStorage as fallback
- Handle token refresh if backend supports it
- Redirect logic: unauthenticated → signin, authenticated on auth pages → dashboard

**References**:
- Better Auth: https://www.better-auth.com/
- Better Auth Client: https://www.better-auth.com/docs/client

---

## 7. API Client Configuration

**Decision**: Axios instance with interceptors for JWT token attachment and global error handling

**Rationale**:
- Axios is already installed and provides powerful interceptor functionality
- Request interceptor can automatically attach JWT token to all authenticated requests
- Response interceptor can handle global errors (401 → logout, network errors → user message)
- Centralized configuration ensures consistency across all API calls

**Alternatives Considered**:
- **Fetch API**: Native but lacks interceptor functionality, would require manual token attachment everywhere
- **TanStack Query's fetch wrapper**: Good but less flexible for custom error handling

**Implementation Notes**:
- Create Axios instance in `lib/api.ts` with base URL from environment variable
- Request interceptor: Attach `Authorization: Bearer ${token}` header to all requests
- Response interceptor: Handle 401 (clear auth state, redirect to signin), 500 (show error message)
- Set timeout to 10 seconds to prevent hanging requests
- Configure retry logic for network errors (max 3 retries with exponential backoff)
- Export typed API methods for auth and tasks

**References**:
- Axios: https://axios-http.com/
- Axios Interceptors: https://axios-http.com/docs/interceptors

---

## 8. Responsive Design Breakpoints

**Decision**: Use Tailwind CSS default breakpoints with mobile-first approach

**Breakpoints**:
- **Mobile**: 0px - 639px (default, no prefix)
- **Tablet**: 640px - 1023px (`sm:` and `md:` prefixes)
- **Desktop**: 1024px+ (`lg:` and `xl:` prefixes)

**Rationale**:
- Tailwind CSS default breakpoints are well-tested and widely used
- Mobile-first approach ensures optimal performance on smaller devices
- Covers the spec requirements (320px+ mobile, 768px+ tablet, 1024px+ desktop)
- Provides additional breakpoints (sm: 640px, xl: 1280px, 2xl: 1536px) for fine-tuning

**Alternatives Considered**:
- **Custom breakpoints**: Unnecessary complexity; defaults work well for most use cases
- **Desktop-first approach**: Less optimal for mobile performance

**Implementation Notes**:
- Design all components mobile-first (base styles for mobile, then add `sm:`, `md:`, `lg:` for larger screens)
- Test on actual devices or browser dev tools at: 375px (iPhone), 768px (iPad), 1440px (desktop)
- Use responsive utilities for layout (flex, grid), spacing, typography, and visibility
- Ensure touch targets are at least 44x44px on mobile
- Use responsive images with Next.js Image component

**References**:
- Tailwind Breakpoints: https://tailwindcss.com/docs/responsive-design

---

## 9. Theme Persistence Strategy

**Decision**: localStorage with next-themes library for SSR-safe theme management

**Rationale**:
- next-themes is specifically designed for Next.js and handles SSR/SSG correctly
- Prevents flash of unstyled content (FOUC) on page load
- Automatically syncs with system theme preference
- Stores preference in localStorage for persistence across sessions
- Works seamlessly with Tailwind CSS dark mode

**Alternatives Considered**:
- **Manual localStorage**: Would require custom SSR handling and FOUC prevention
- **Cookies**: More complex, requires server-side handling, unnecessary for client-only preference
- **sessionStorage**: Doesn't persist across browser sessions

**Implementation Notes**:
- Install: `next-themes`
- Wrap app with `ThemeProvider` in root layout
- Configure Tailwind CSS for dark mode: `darkMode: 'class'`
- Use `useTheme()` hook from next-themes in theme toggle component
- Theme toggle should show current theme and allow switching between light/dark
- Consider adding system theme option (auto-detect from OS)

**References**:
- next-themes: https://github.com/pacocoursey/next-themes

---

## 10. Performance Optimization

**Decision**: Implement Next.js built-in optimizations + lazy loading for non-critical components

**Optimizations to implement**:
1. **Next.js Image component** for all images (automatic optimization, lazy loading, responsive)
2. **Dynamic imports** for heavy components (task form, modals)
3. **Code splitting** by route (automatic with App Router)
4. **Font optimization** with next/font
5. **Memoization** for expensive computations (React.memo, useMemo, useCallback)

**Rationale**:
- Next.js provides excellent built-in optimizations that require minimal configuration
- Lazy loading reduces initial bundle size and improves Time to Interactive
- These optimizations are low-effort, high-impact improvements
- Aligns with performance goals (<3s page load, <300ms theme toggle, <500ms validation)

**Alternatives Considered**:
- **Manual optimization**: More work, less reliable than Next.js built-ins
- **No optimization**: Would likely fail performance success criteria

**Implementation Notes**:
- Use `next/image` for all images with appropriate sizes and priority flags
- Lazy load task form: `const TaskForm = dynamic(() => import('./TaskForm'))`
- Use `next/font` for Google Fonts or local fonts
- Memoize task list rendering with React.memo
- Use useCallback for event handlers passed to child components
- Monitor bundle size with Next.js built-in analyzer
- Test performance with Lighthouse and Web Vitals

**References**:
- Next.js Image: https://nextjs.org/docs/app/api-reference/components/image
- Next.js Dynamic Imports: https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading

---

## Summary of Decisions

| Area | Decision | Key Benefit |
|------|----------|-------------|
| Testing | Vitest + React Testing Library + Playwright | Fast, modern, comprehensive coverage |
| Error Logging | Error Boundaries + Console logging | Simple, user-friendly, no external deps |
| State Management | React Context + TanStack Query | Right tool for each job, minimal complexity |
| Form Validation | React Hook Form + Zod | Type-safe, performant, minimal re-renders |
| UI Components | shadcn/ui + Tailwind CSS 4 | Customizable, accessible, modern |
| Auth Client | Better Auth client | Consistent with backend, built-in hooks |
| API Client | Axios with interceptors | Automatic token handling, global errors |
| Breakpoints | Tailwind defaults (mobile-first) | Well-tested, covers all requirements |
| Theme Persistence | next-themes + localStorage | SSR-safe, no FOUC, system theme support |
| Performance | Next.js built-ins + lazy loading | Low-effort, high-impact optimizations |

---

## Next Steps

With all research decisions complete, proceed to Phase 1:
1. Create `data-model.md` with detailed TypeScript interfaces
2. Create `contracts/` directory with API contract documentation
3. Create `quickstart.md` with development setup instructions
4. Update agent context with new technology decisions
