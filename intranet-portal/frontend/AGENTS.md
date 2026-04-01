# AGENTS.md - Frontend (React 18)

**Location**: `intranet-portal/frontend/`  
**Stack**: React 18 + TypeScript 5 + Vite 5 + Tailwind CSS  
**Generated**: 2026-03-26

---

## OVERVIEW

React 18 SPA with feature-based architecture. Uses Zustand for state management, React Router v7 for routing, and Axios for API communication.

---

## STRUCTURE

```
frontend/
├── src/
│   ├── features/              # Feature modules (co-located)
│   │   ├── auth/             # Login, BirimSelection
│   │   ├── admin/            # Admin panel (15+ pages)
│   │   ├── it/               # IT module (Bilgi İşlem)
│   │   ├── genelButce/       # General Budget module
│   │   └── test-unit/        # Test module
│   ├── shared/               # Cross-cutting components
│   │   ├── components/       # ProtectedRoute, Header, etc.
│   │   └── layouts/          # AdminLayout, AppSidebar
│   ├── api/                  # API clients (one per domain)
│   ├── store/                # Zustand stores
│   ├── hooks/                # Custom React hooks
│   ├── components/           # UI components (shadcn/ui)
│   │   ├── ui/              # 45+ shadcn components
│   │   ├── common/          # Shared components
│   │   └── dashboard/       # Dashboard widgets
│   ├── pages/                # Legacy pages (Dashboard, MaintenanceLock)
│   ├── types/                # TypeScript definitions
│   └── lib/                  # Utility functions
├── App.tsx                   # Route definitions (lazy loading)
├── main.tsx                  # Entry point
└── vite.config.ts            # Build config with @ alias
```

---

## WHERE TO LOOK

| Task | Location | Pattern |
|------|----------|---------|
| Add feature page | `src/features/[module]/pages/` | PascalCase + Page suffix |
| Add feature component | `src/features/[module]/components/` | Co-located with feature |
| Add shared component | `src/shared/components/` | Cross-cutting use |
| Add API client | `src/api/[domain]Api.ts` | One file per domain |
| Add custom hook | `src/hooks/use[Name].ts` | camelCase + use prefix |
| Add route | `src/App.tsx` | Lazy import + ProtectedRoute |
| Add Zustand store | `src/store/[name]Store.ts` | camelCase + Store suffix |
| Check permissions | `src/hooks/usePermission.ts` | `hasPermission(resource, action)` |
| Add UI component | `src/components/ui/` | shadcn/ui components |

---

## CONVENTIONS

### Feature Module Structure
```
features/admin/
├── components/          # Feature-specific components
│   └── Sidebar.tsx
└── pages/              # Page components
    ├── Dashboard.tsx
    ├── UserList.tsx
    └── UserCreate.tsx
```

### Page Component Pattern
```tsx
// Lazy loaded in App.tsx
const UserList = lazy(() => import('./features/admin/pages/UserList'));

// Page component
export default function UserList() {
  const { hasPermission } = usePermission();
  
  if (!hasPermission('user', 'read')) {
    return <Navigate to="/unauthorized" />;
  }
  
  return (...);
}
```

### API Client Pattern
```typescript
// src/api/usersApi.ts
import { apiClient } from './apiClient';

export const usersApi = {
  getAll: () => apiClient.get('/users'),
  getById: (id: number) => apiClient.get(`/users/${id}`),
  create: (data: CreateUserDto) => apiClient.post('/users', data),
  update: (id: number, data: UpdateUserDto) => apiClient.put(`/users/${id}`, data),
  delete: (id: number) => apiClient.delete(`/users/${id}`),
};
```

### Zustand Store Pattern
```typescript
// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      selectedBirim: null,
      isAuthenticated: false,
      
      login: async (credentials) => { ... },
      selectBirim: (birim) => set({ selectedBirim: birim }),
      logout: () => { ... },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        selectedBirim: state.selectedBirim 
      }),
    }
  )
);
```

### Permission Hook Usage
```typescript
import { usePermission, Permissions } from '@/hooks/usePermission';

function MyComponent() {
  const { hasPermission, hasAnyPermission } = usePermission();
  
  // Check single permission
  const canCreate = hasPermission('user', 'create');
  
  // Check multiple (OR)
  const canManage = hasAnyPermission([
    { resource: 'user', action: 'create' },
    { resource: 'user', action: 'update' },
  ]);
  
  // Use constants
  const canRead = hasPermission(Permissions.User.Read);
}
```

### Route Definition Pattern
```tsx
// App.tsx
<Route element={<ProtectedRoute />}>
  <Route element={<AdminLayout />}>
    <Route path="/users" element={<UserList />} />
    <Route path="/users/create" element={<UserCreate />} />
    <Route path="/users/:id/edit" element={<UserEdit />} />
  </Route>
</Route>
```

---

## ANTI-PATTERNS (CRITICAL)

| Don't | Why | Do Instead |
|-------|-----|------------|
| Store JWT in localStorage | XSS vulnerable | HttpOnly cookie (handled by apiClient) |
| Skip `X-Birim-Id` header | Wrong permissions/context | Interceptor adds automatically |
| Direct axios calls | No interceptors, no auth | Use `apiClient` from `api/apiClient.ts` |
| Mutate Zustand state directly | Unpredictable updates | Use store actions |
| Import from relative paths | Brittle | Use `@/` alias (e.g., `@/components/ui`) |
| Pages in `src/pages/` (new) | Deprecated location | Use `src/features/[module]/pages/` |
| shadcn/ui components location | shadcn/ui = `components/ui/` | shared = `shared/components/` — NOT duplicate |

---

## NAMING CONVENTIONS

| Type | Convention | Example |
|------|------------|---------|
| Pages | PascalCase + Page | `UserList.tsx`, `Dashboard.tsx` |
| Components | PascalCase | `Sidebar.tsx`, `DataTable.tsx` |
| Hooks | camelCase + use | `usePermission.ts`, `useMobile.tsx` |
| API files | camelCase + Api | `usersApi.ts`, `authApi.ts` |
| Stores | camelCase + Store | `authStore.ts` |
| Types | PascalCase | `UserDto`, `AuthState` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL` |

---

## COMMANDS

```powershell
# Install dependencies
npm install

# Development server
npm run dev          # http://localhost:5173

# Build
npm run build        # Output to dist/
npm run preview      # Preview production build

# Linting
npm run lint         # ESLint check
npm run type-check   # TypeScript check
```

---

## NOTES

### API Client Configuration
- **Base URL**: From `VITE_API_BASE_URL` env var
- **Credentials**: `withCredentials: true` (HttpOnly cookie)
- **Timeout**: 30 seconds
- **Headers**: Interceptor adds `X-Birim-Id` header automatically

### State Persistence
- Auth store uses Zustand `persist` middleware
- Stores: `token`, `selectedBirim`
- Does NOT store: `user` (refetched on load), `permissions` (refetched on load)

### Permission Constants
```typescript
export const Permissions = {
  User: { Read: 'user.read', Create: 'user.create', Update: 'user.update', Delete: 'user.delete' },
  Role: { Read: 'role.read', Create: 'role.create', Update: 'role.update', Delete: 'role.delete' },
  Birim: { Read: 'birim.read', Create: 'birim.create', Update: 'birim.update', Delete: 'birim.delete' },
  // ... see usePermission.ts for full list
} as const;
```

### Lazy Loading
All page components in `App.tsx` use `React.lazy()` for code splitting:
```tsx
const UserList = lazy(() => import('./features/admin/pages/UserList'));
```

### shadcn/ui Components
Located in `src/components/ui/` - 45+ pre-built components:
- Button, Card, Dialog, Form, Input, Select, Table, etc.
- All support dark mode via Tailwind CSS

### Feature Modules
| Module | Path | Purpose |
|--------|------|---------|
| auth | `features/auth/` | Login, Birim selection |
| admin | `features/admin/` | User/Role/Birim management |
| it | `features/it/` | IT-specific pages |
| genelButce | `features/genelButce/` | Budget module |
| test-unit | `features/test-unit/` | Test module |

---

## DEVIATIONS (Know These)

1. **Legacy `src/pages/`**: Contains `MaintenanceLockPage` and `HomeDashboard` — DO NOT add new pages here
2. **`components/ui/`**: shadcn/ui library components — NOT same as `shared/components/`
3. **Prefer**: Feature co-location over shared folders for new code

---

*See parent AGENTS.md for project-wide conventions.*
