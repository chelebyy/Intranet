# AGENTS.md - Kurumsal İntranet Web Portalı

**Project**: Secure, multi-unit corporate intranet portal with RBAC  
**Stack**: .NET 9 + React 18 + PostgreSQL 16  
**Generated**: 2026-04-01

---

## OVERVIEW

Multi-unit corporate intranet portal for local network deployment. Supports role-based access control (RBAC) with users having different permissions per organizational unit (birim).

**Key Characteristics:**
- Turkish UI, English code/comments
- Layered backend architecture (API → Application → Domain → Infrastructure)
- Feature-based frontend modules
- Multi-tenant via birim (unit) context

---

## STRUCTURE

```
.
├── intranet-portal/
│   ├── backend/              # .NET 9 Web API
│   │   ├── IntranetPortal.API/           # Controllers, middleware
│   │   ├── IntranetPortal.Application/   # Services, DTOs
│   │   ├── IntranetPortal.Domain/        # Entities ONLY
│   │   └── IntranetPortal.Infrastructure/# DbContext, migrations
│   └── frontend/             # React 18 + Vite + TypeScript
│       ├── src/features/     # Feature modules (auth, admin, it, etc.)
│       ├── src/shared/       # Components, layouts
│       ├── src/api/          # API clients
│       └── src/store/        # Zustand stores
├── docs/                     # Technical documentation
├── CLAUDE.md                 # Project guide (read first!)
└── README.md                 # Quick start
```

---

## COMMANDS

### Backend (.NET 9)

```powershell
cd intranet-portal/backend

# Build & Run
dotnet restore                          # Restore packages
dotnet build                            # Build solution
dotnet watch --project IntranetPortal.API   # Run with hot reload

# Database (EF Core)
dotnet ef migrations add [Name] --project IntranetPortal.Infrastructure --startup-project IntranetPortal.API
dotnet ef database update --project IntranetPortal.Infrastructure --startup-project IntranetPortal.API
dotnet ef migrations remove --project IntranetPortal.Infrastructure --startup-project IntranetPortal.API

# Secrets (DO NOT commit these!)
dotnet user-secrets init --project IntranetPortal.API
dotnet user-secrets set "JwtSettings:SecretKey" "your-secret" --project IntranetPortal.API
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=..." --project IntranetPortal.API

# Testing (planned)
dotnet test                             # Run all tests (when implemented)
dotnet test --filter "FullyQualifiedName~UserServiceTests"  # Run single test class
dotnet test --filter "DisplayName~CreateUser_ReturnsSuccess"  # Run single test
```

### Frontend (React 18 + Vite)

```powershell
cd intranet-portal/frontend

# Dependencies & Dev
npm install                             # Install dependencies
npm run dev                             # Start dev server (http://localhost:5173)
npm run build                           # Production build
npm run preview                         # Preview production build

# Linting & Type Check
npm run lint                            # ESLint check
npx tsc --noEmit                        # TypeScript type check only

# Testing (planned - will use Vitest)
# npm run test                          # Run all tests
# npm run test -- UserList.test.tsx     # Run single test file
# npm run test -- --testNamePattern="renders user list"  # Run single test
```

---

## CODE STYLE GUIDELINES

### Backend (.NET 9)

**Imports & Namespaces:**
```csharp
// System first, then third-party, then project
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using IntranetPortal.Domain.Entities;
using IntranetPortal.Application.Interfaces;

namespace IntranetPortal.API.Controllers  // Match folder structure
{
    // ...
}
```

**Naming Conventions:**
- Entities: `PascalCase`, Turkish column names (`Sicil`, `BirimAdi`)
- Services: `I[Name]Service` interface + `[Name]Service` implementation
- Controllers: `[Name]Controller` with `[Route("api/[controller]")]`
- DTOs: `[Action][Entity]Dto` (e.g., `CreateUserDto`, `UpdateUserDto`)
- Private fields: `_camelCase`
- Constants: `PascalCase`
- Enums: `PascalCase`, members `PascalCase`

**Entity Pattern:**
```csharp
[Table("User")]
public class User
{
    [Key]
    [Column("UserID")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int UserID { get; set; }
    
    [Required]
    [MaxLength(50)]
    [Column("Ad")]
    public string Ad { get; set; } = string.Empty;  // Non-nullable default
    
    [Column("IsActive")]
    public bool IsActive { get; set; } = true;      // Soft delete flag
    
    [Column("CreatedAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
```

**Controller Pattern:**
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    
    public UsersController(IUserService userService)
    {
        _userService = userService;
    }
    
    [HttpGet]
    [HasPermission(Permissions.ReadUser)]
    public async Task<ActionResult<ApiResponse<IEnumerable<UserDto>>>> GetAllUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(ApiResponse<IEnumerable<UserDto>>.Ok(users));
    }
}
```

**Multi-Unit Query Pattern (CRITICAL):**
```csharp
// ALWAYS check BOTH UserID AND BirimID
var roles = await _context.UserBirimRoles
    .Where(ubr => ubr.UserID == userId && ubr.BirimID == birimId)
    .ToListAsync();
```

**Error Handling:**
```csharp
try
{
    var result = await _service.DoSomethingAsync();
    return Ok(ApiResponse<T>.Ok(result));
}
catch (InvalidOperationException ex)
{
    return BadRequest(ApiResponse<T>.Fail(ex.Message, "VALIDATION_ERROR"));
}
catch (Exception ex)
{
    _logger.LogError(ex, "Unexpected error");
    return StatusCode(500, ApiResponse<T>.Fail("Internal server error", "INTERNAL_ERROR"));
}
```

### Frontend (React 18 + TypeScript)

**Imports Order:**
```typescript
// 1. React
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Third-party
import { useQuery } from '@tanstack/react-query';

// 3. Absolute aliases (@/*)
import { apiClient } from '@/api/apiClient';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

// 4. Relative imports (within same feature)
import { UserCard } from './components/UserCard';
```

**Naming Conventions:**
- Pages: `PascalCase` + `Page` suffix (`UserList.tsx`, `Dashboard.tsx`)
- Components: `PascalCase` (`Sidebar.tsx`, `DataTable.tsx`)
- Hooks: `camelCase` + `use` prefix (`usePermission.ts`, `useAuth.ts`)
- API files: `camelCase` + `Api` suffix (`usersApi.ts`, `authApi.ts`)
- Stores: `camelCase` + `Store` suffix (`authStore.ts`)
- Types: `PascalCase` (`UserDto`, `ApiResponse<T>`)
- Constants: `UPPER_SNAKE_CASE`
- Boolean props: Use `is`, `has`, `should` prefix (`isLoading`, `hasError`)

**TypeScript Patterns:**
```typescript
// Explicit return types for exported functions
export interface UserDto {
  userId: number;
  ad: string;
  soyad: string;
  isActive: boolean;
}

// Use type over interface for unions
type Status = 'idle' | 'loading' | 'success' | 'error';

// Generic API response
type ApiResponse<T> = {
  data: T;
  success: boolean;
  message: string;
};

// React.FC is NOT used (implicit children)
export function UserCard({ user }: { user: UserDto }) {
  return <div>{user.ad}</div>;
}
```

**API Client Pattern:**
```typescript
// src/api/usersApi.ts
import { apiClient } from './apiClient';
import type { UserDto, CreateUserDto } from '@/types/api/users';

export const usersApi = {
  getAll: () => apiClient.get<UserDto[]>('/users'),
  getById: (id: number) => apiClient.get<UserDto>(`/users/${id}`),
  create: (data: CreateUserDto) => apiClient.post<UserDto>('/users', data),
  update: (id: number, data: Partial<CreateUserDto>) => 
    apiClient.put<UserDto>(`/users/${id}`, data),
  delete: (id: number) => apiClient.delete(`/users/${id}`),
};
```

**Zustand Store Pattern:**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: UserDto | null;
  isAuthenticated: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (credentials) => { /* ... */ },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
```

**Error Handling:**
```typescript
try {
  const response = await usersApi.create(userData);
  toast.success('User created successfully');
} catch (error) {
  if (error.response?.status === 400) {
    toast.error(error.response.data.message || 'Validation error');
  } else if (error.response?.status === 403) {
    toast.error('Insufficient permissions');
  } else {
    toast.error('An unexpected error occurred');
    console.error('API Error:', error);
  }
}
```

---

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add API endpoint | `backend/IntranetPortal.API/Controllers/` | Use `[HasPermission]` attribute |
| Add entity | `backend/IntranetPortal.Domain/Entities/` | ONLY place for entities |
| Add service | `backend/IntranetPortal.Application/Services/` | Implement interface, use DI |
| Add DTO | `backend/IntranetPortal.Application/DTOs/` | Organize by feature folder |
| Add EF config | `backend/IntranetPortal.Infrastructure/Configurations/` | Fluent API per entity |
| Add frontend page | `frontend/src/features/[module]/pages/` | Use lazy loading |
| Add API client | `frontend/src/api/` | One file per domain |
| Add shared component | `frontend/src/shared/components/` | Cross-cutting UI |
| Add route | `frontend/src/App.tsx` | Wrap with `ProtectedRoute` |
| Check permissions | `frontend/src/hooks/usePermission.ts` | `hasPermission(resource, action)` |

---

## ANTI-PATTERNS (CRITICAL)

| Don't | Why | Do Instead |
|-------|-----|------------|
| `dotnet ef dbcontext scaffold` | Creates duplicate entities | Code-first migrations only |
| Hard delete users | Data integrity | Set `IsActive = false` |
| Store JWT in localStorage | XSS vulnerable | HttpOnly cookie (`auth_token`) |
| Entities outside Domain layer | Architecture violation | Keep ALL entities in `Domain/Entities/` |
| Skip `birimId` in permission checks | Security hole | Always check BOTH `userId` AND `birimId` |
| Hardcode secrets in appsettings.json | Security risk | Use `dotnet user-secrets` or env vars |
| Trust `X-Forwarded-For` directly | IP spoofing | Validate against whitelist |
| Use `any` type in TypeScript | Loses type safety | Define proper interfaces |
| Import from relative paths | Brittle | Use `@/` alias |
| Mutate Zustand state directly | Unpredictable updates | Use store actions |

---

## LAYER ARCHITECTURE

**Backend Flow:**
```
Controller → Service → (Domain) → DbContext
     ↑           ↑                    ↑
   HTTP       Business            PostgreSQL
```

**Permission Format:**
```csharp
"action.resource"  // e.g., "user.create", "role.read", "birim.delete"
```

---

## NOTES

### Critical Implementation Details

1. **Soft Delete**: All critical entities use `IsActive` flag. Never hard delete.
2. **Multi-Unit Context**: Users can belong to multiple birims with different roles. `X-Birim-Id` header carries current context.
3. **JWT Claims**: `userId`, `sicil`, `ad`, `soyad`, `birimId`, `birimAdi`, `roleId`, `roleName`
4. **SuperAdmin Bypass**: Role ID 1 bypasses all permission checks.
5. **Audit Logging**: All write operations logged to `AuditLog` with `UserID`, `BirimID`, `Action`, `IPAddress`.

### Security Requirements

- IP Whitelist enforced on all endpoints (CIDR support)
- Rate limiting: 5 login/min, 100 API req/min
- BCrypt password hashing (work factor 12)
- AES-256 encryption for sensitive data at rest
- Input validation via FluentValidation
- CSP headers enabled

### Documentation (Progressive Disclosure)

| Document | Purpose |
|----------|---------|
| `CLAUDE.md` | Project conventions & quick reference |
| `docs/general/PRD.md` | Product requirements |
| `docs/technical/ERD.md` | Database schema |
| `docs/api/API_SPECIFICATION.md` | API endpoints |
| `docs/technical/TECHNICAL_DESIGN.md` | Architecture details |
| `docs/reports/SECURITY_ANALYSIS_REPORT.md` | Security requirements |

### Deviation Notes

1. **Docker non-standard ports**: Backend Dockerfile exposes 8080/8081 (not 80/443) — Dev/testing only
2. **Security disabled for testing**: IP whitelist and rate limiting DISABLED in appsettings.json — Enable before prod
3. **No CI/CD pipeline yet**: Project uses manual builds — Add when testing stabilizes
4. **No unit tests yet**: testsprite_tests/ contains custom Python E2E scripts — Standard unit tests (Jest/xUnit) planned

---

*This AGENTS.md is hierarchical. See subdirectory AGENTS.md files for deeper context.*
