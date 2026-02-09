# Quickstart Guide: Frontend UI, UX & Access Control

**Feature**: 001-frontend-ui-ux
**Date**: 2026-02-08
**Status**: Complete

This guide provides step-by-step instructions for setting up, running, and developing the frontend application.

---

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended with TypeScript and ESLint extensions

---

## Initial Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Navigate to Frontend Directory

```bash
cd frontent  # Note: Directory name has typo but keeping for consistency
```

### 3. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 15.5.12
- React 19.1.0
- Better Auth
- Tailwind CSS 4
- Axios
- And all other dependencies from package.json

### 4. Configure Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Environment Variables**:
- `NEXT_PUBLIC_API_URL`: Backend API base URL (default: http://localhost:8000)
- `NEXT_PUBLIC_APP_URL`: Frontend application URL (default: http://localhost:3000)

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

---

## Development

### Start Development Server

```bash
npm run dev
```

This starts the Next.js development server with:
- Hot module replacement (HMR)
- Fast refresh for instant updates
- Turbopack for faster builds
- Available at: http://localhost:3000

### Development Workflow

1. **Make changes** to files in `src/` directory
2. **Save files** - changes appear instantly in browser
3. **Check console** for TypeScript errors and warnings
4. **Test manually** in browser at http://localhost:3000

### Project Structure

```
frontent/src/
├── app/              # Next.js App Router pages
│   ├── page.tsx              # Landing page (/)
│   ├── signup/page.tsx       # Signup page (/signup)
│   ├── signin/page.tsx       # Signin page (/signin)
│   ├── dashboard/page.tsx    # Dashboard (/dashboard)
│   └── layout.tsx            # Root layout
│
├── components/       # React components
│   ├── ui/                   # shadcn/ui components
│   ├── auth/                 # Auth components
│   ├── layout/               # Layout components
│   └── tasks/                # Task components
│
├── context/          # React Context providers
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
│
├── hooks/            # Custom React hooks
│   ├── useAuth.ts
│   ├── useTheme.ts
│   └── useTasks.ts
│
└── lib/              # Utilities and configurations
    ├── api.ts                # Axios client
    ├── auth.ts               # Better Auth setup
    └── utils.ts              # Helper functions
```

---

## Building for Production

### Create Production Build

```bash
npm run build
```

This creates an optimized production build:
- Minified JavaScript and CSS
- Optimized images
- Static page generation where possible
- Output in `.next/` directory

### Start Production Server

```bash
npm run start
```

Serves the production build at http://localhost:3000

### Build Verification

Before deploying, verify the build:

```bash
# 1. Create build
npm run build

# 2. Start production server
npm run start

# 3. Test in browser
# Visit http://localhost:3000 and test all features
```

---

## Testing

### Run Unit Tests

```bash
npm run test
```

Runs Vitest tests for components and utilities.

### Run Tests in Watch Mode

```bash
npm run test:watch
```

Automatically re-runs tests when files change.

### Run E2E Tests

```bash
npm run test:e2e
```

Runs Playwright end-to-end tests.

### Test Coverage

```bash
npm run test:coverage
```

Generates code coverage report.

---

## Code Quality

### Run Linter

```bash
npm run lint
```

Checks code for style and quality issues using ESLint.

### Fix Linting Issues

```bash
npm run lint:fix
```

Automatically fixes fixable linting issues.

### Type Checking

```bash
npx tsc --noEmit
```

Checks TypeScript types without emitting files.

---

## Common Development Tasks

### Add New Page

1. Create new directory in `src/app/`
2. Add `page.tsx` file
3. Export default React component
4. Page is automatically routed by Next.js

Example:
```typescript
// src/app/about/page.tsx
export default function AboutPage() {
  return <div>About Page</div>;
}
// Available at: /about
```

### Add New Component

1. Create file in appropriate `src/components/` subdirectory
2. Export component
3. Import and use in pages or other components

Example:
```typescript
// src/components/tasks/TaskCard.tsx
export function TaskCard({ task }) {
  return <div>{task.title}</div>;
}
```

### Add shadcn/ui Component

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
```

Components are added to `src/components/ui/`

### Add Custom Hook

1. Create file in `src/hooks/`
2. Export hook function
3. Import and use in components

Example:
```typescript
// src/hooks/useLocalStorage.ts
export function useLocalStorage(key: string) {
  // Hook implementation
}
```

### Add API Endpoint Integration

1. Add function to `src/lib/api.ts`
2. Use TanStack Query for data fetching
3. Handle loading and error states

Example:
```typescript
// src/lib/api.ts
export async function fetchTasks() {
  const response = await apiClient.get('/api/tasks');
  return response.data;
}

// In component
const { data, isLoading, error } = useQuery({
  queryKey: ['tasks'],
  queryFn: fetchTasks,
});
```

---

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Kill process on port 3000 (Windows)
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Restart TypeScript server in VS Code
# Command Palette (Ctrl+Shift+P) > "TypeScript: Restart TS Server"

# Or check types manually
npx tsc --noEmit
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### API Connection Issues

1. Verify backend is running at `http://localhost:8000`
2. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
3. Check browser console for CORS errors
4. Verify backend CORS configuration allows frontend origin

---

## Environment-Specific Configuration

### Development

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Production

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.production.com
NEXT_PUBLIC_APP_URL=https://app.production.com
NODE_ENV=production
```

---

## Useful Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npx shadcn@latest add <component>` | Add shadcn/ui component |

---

## Next Steps

After setup is complete:

1. **Start backend server** (see backend README)
2. **Start frontend dev server** (`npm run dev`)
3. **Open browser** to http://localhost:3000
4. **Test signup flow** - create new account
5. **Test signin flow** - login with created account
6. **Test dashboard** - create, update, delete tasks
7. **Test theme toggle** - switch between dark/light modes
8. **Test responsive design** - resize browser or use device emulator

---

## Additional Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **React Documentation**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com/
- **TanStack Query**: https://tanstack.com/query/latest
- **Better Auth**: https://www.better-auth.com/

---

## Getting Help

If you encounter issues:

1. Check this quickstart guide
2. Review error messages in console
3. Check browser developer tools (Network tab for API issues)
4. Review relevant documentation links above
5. Check project README.md for additional information

---

**Last Updated**: 2026-02-08
