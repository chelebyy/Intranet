# Kurumsal İntranet Web Portalı

Secure, multi-unit corporate intranet portal with RBAC for local network deployment.

## Tech Stack

- **Backend**: .NET 9 (ASP.NET Core), Entity Framework Core 9, PostgreSQL 15/16
- **Frontend**: React 18, TypeScript 5, Vite 5, Zustand, TanStack Query, Tailwind CSS
- **Auth**: JWT (HMAC-SHA256), BCrypt password hashing
- **Architecture**: Layered (API → Application → Domain → Infrastructure)

## Project Structure

```
intranet-portal/
├── backend/
│   ├── IntranetPortal.API/           # Controllers, middleware
│   ├── IntranetPortal.Application/   # Services, DTOs, validators
│   ├── IntranetPortal.Domain/        # Entities (ONLY place for entities!)
│   └── IntranetPortal.Infrastructure/# DbContext, repositories, migrations
└── frontend/
    └── src/
        ├── features/                  # Unit modules (auth, admin, hr, it)
        ├── shared/                    # Components, hooks, utils
        ├── api/                       # API client
        └── store/                     # Zustand stores
```

## Development Commands

```powershell
# Backend
dotnet restore
dotnet watch --project IntranetPortal.API
dotnet ef migrations add MigrationName --project IntranetPortal.Infrastructure
dotnet ef database update --project IntranetPortal.Infrastructure

# Frontend
npm install && npm run dev
npm run build
```

## Key Patterns

- **Multi-unit users**: Always check BOTH `userId` AND `birimId` in UserBirimRole queries
- **RBAC**: Permissions use `action.resource` format (e.g., "user.create")
- **Entities**: ONLY exist in `IntranetPortal.Domain/Entities/` - never duplicate in Infrastructure
- **Soft delete**: Use `IsActive=false`, never hard delete users

## Critical Rules

1. **Never run `dotnet ef dbcontext scaffold`** - causes duplicate entity errors
2. **All sensitive data encrypted** with PostgreSQL pgcrypto (AES-256)
3. **IP whitelist enforced** on all endpoints
4. **Turkish UI**, English code/comments

## Documentation (Progressive Disclosure)

Read these only when relevant to your task:

### 🔴 Critical (Always Follow)
| Document | Purpose |
|----------|---------|
| `active_task.md` | Current task tracking, phase status, checkpoints |
| `docs/general/PRD.md` | Product requirements, user stories, scope |
| `docs/technical/ERD.md` | Database schema, entity relations, RBAC model |
| `docs/api/API_SPECIFICATION.md` | Complete API endpoint definitions |
| `docs/technical/TECHNICAL_DESIGN.md` | Architecture, layer structure, security |
| `docs/reports/SECURITY_ANALYSIS_REPORT.md` | OWASP compliance, security requirements |

### 🟡 Development (Phase-Based)
| Document | Purpose |
|----------|---------|
| `docs/technical/IMPLEMENTATION_ROADMAP.md` | 6-phase roadmap with code examples |
| `docs/api/API_INDEX.md` | API summary, permission list |
| `docs/technical/MODULAR_STRUCTURE.md` | Module architecture, adding new units |
| `docs/technical/FILE_MANAGEMENT.md` | File upload/download specs |
| `docs/technical/TECH_STACK.md` | Technology stack with versions |

### 🟢 Operational (As Needed)
| Document | Purpose |
|----------|---------|
| `QUICK_START.md` | Quick setup guide for new developers |
| `docs/deployment/DEPLOYMENT_GUIDE.md` | Windows/Linux/Docker deployment |
| `docs/reports/ERRORS.md` | Known errors and solutions |
| `docs/general/PROJECT_INDEX.md` | Central documentation hub |
