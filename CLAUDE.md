# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Kurumsal İntranet Web Portalı** - A secure, multi-unit corporate intranet portal with role-based access control (RBAC), designed for local network deployment (no internet connectivity required).

**Current Phase:** Documentation Complete - Implementation Not Started
- All technical documentation has been completed (14 markdown files)
- No code exists yet - this repository contains planning and architecture documents only
- Ready to begin **Faz 0** (Project Setup) from `IMPLEMENTATION_ROADMAP.md`

### Core Requirements
- Multi-unit (department) architecture where users can belong to multiple units with different roles
- RBAC system with granular permissions
- IP/IP block-based access restrictions
- Support for 100-200 concurrent users
- Local network only (Windows 11, Linux Server, or Docker deployment)
- PostgreSQL with AES-256 encryption for sensitive data
- Comprehensive audit logging

---

## Technology Stack

### Backend
- **.NET 9** (ASP.NET Core Web API)
- **Entity Framework Core 9.x** (Code-First, PostgreSQL provider)
- **PostgreSQL 15/16** (with pgcrypto extension)
- **Architecture**: Layered (API → Application → Domain → Infrastructure)

### Frontend
- **React 18** with **TypeScript 5.x**
- **Vite 5.x** (build tool)
- **Zustand** (state management)
- **TanStack Query** (server state)
- **React Router** (routing)
- **Tailwind CSS** (styling)

### Key Libraries
- **BCrypt.Net-Next**: Password hashing
- **JWT Bearer**: Authentication
- **Serilog**: Structured logging
- **FluentValidation**: Input validation
- **AutoMapper**: DTO mapping

---

## Project Structure

### Backend (Planned)
```
IntranetPortal.sln
├── IntranetPortal.API/              # Presentation Layer
│   ├── Controllers/                 # API endpoints
│   ├── Middleware/                  # IP filter, exception handler
│   ├── Filters/                     # Authorization attributes
│   └── Program.cs                   # App configuration
├── IntranetPortal.Application/      # Business Logic
│   ├── Services/                    # Business services
│   ├── DTOs/                        # Data transfer objects
│   ├── Interfaces/                  # Service contracts
│   └── Validators/                  # FluentValidation rules
├── IntranetPortal.Domain/           # Domain Layer
│   ├── Entities/                    # Database models
│   ├── Enums/                       # Enumeration types
│   └── Constants/                   # System constants
└── IntranetPortal.Infrastructure/   # Data Access
    ├── Data/                        # DbContext
    ├── Repositories/                # Repository pattern
    ├── Migrations/                  # EF Core migrations
    └── Configurations/              # Entity configurations
```

### Frontend (Planned)
```
intranet-frontend/
├── src/
│   ├── features/                    # Birim (unit) modules
│   │   ├── auth/                    # Login, logout
│   │   ├── admin/                   # Admin dashboard
│   │   ├── hr/                      # HR module (example)
│   │   └── it/                      # IT module (example)
│   ├── shared/
│   │   ├── components/              # Reusable UI components
│   │   ├── layouts/                 # Layout components
│   │   ├── hooks/                   # Custom React hooks
│   │   └── utils/                   # Helper functions
│   ├── api/                         # Axios API client
│   ├── store/                       # Zustand stores
│   ├── types/                       # TypeScript type definitions
│   └── App.tsx                      # Root component
└── public/                          # Static assets
```

---

## Database Schema (Core Tables)

### Key Entity Relationships
- **User**: System users with credentials
- **Birim**: Organizational units/departments
- **Role**: Permission groups (SistemAdmin, BirimAdmin, BirimEditor, BirimGoruntuleyen)
- **Permission**: Atomic permissions (action.resource format, e.g., "user.create")
- **UserBirimRole**: Junction table linking users to units with specific roles (CRITICAL for multi-unit support)
- **RolePermission**: Junction table linking roles to permissions
- **AuditLog**: All critical operations logging

### Important SQL Files
- `ERD.md`: Complete database schema with SQL CREATE statements, indexes, and example queries
- All tables use PostgreSQL with quote-delimited names (e.g., "User", "BirimID")

---

## Core System Flows

### Authentication Flow
1. User requests login → IP whitelist check (middleware)
2. Credentials validated → BCrypt password verification
3. JWT token generated (HMAC-SHA256, 8-hour expiry)
4. User's associated units (Birimler) retrieved
5. If multi-unit user → display unit selection panel
6. User selects unit → role for that unit becomes active
7. Frontend stores token in localStorage
8. All subsequent requests include `Authorization: Bearer <token>` header

### Authorization (RBAC) Flow
1. API request arrives with JWT token
2. Extract `userId` and `birimId` from token
3. Query `UserBirimRole` to get user's role in that unit
4. Query `RolePermission` to get permissions for that role
5. Check if requested permission exists in user's permission set
6. Grant (200) or deny (403) access
7. Log operation to `AuditLog`

### Multi-Unit User Experience
- Users can be assigned to multiple units (departments)
- Each unit assignment includes a specific role
- After login, multi-unit users see a unit selection screen
- Selected unit determines active permissions via RBAC
- Unit switching requires re-selection (≤ 1 second requirement)

---

## Development Commands

### Backend (When Project Created)
```powershell
# Restore dependencies
dotnet restore

# Run database migrations
dotnet ef database update

# Run in development mode
dotnet run --project IntranetPortal.API

# Watch mode (auto-reload)
dotnet watch --project IntranetPortal.API

# Build for production
dotnet publish -c Release -o ./publish

# Create new migration
dotnet ef migrations add MigrationName

# Generate SQL script from migrations
dotnet ef migrations script -o migration.sql
```

### Frontend (When Project Created)
```bash
# Install dependencies
npm install

# Run development server (Vite)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run type check
npm run type-check
```

### Database Setup
```sql
-- Create database and user (PostgreSQL)
CREATE DATABASE "IntranetDB" ENCODING 'UTF8';
CREATE USER intranet_user WITH ENCRYPTED PASSWORD 'SecurePassword';
GRANT ALL PRIVILEGES ON DATABASE "IntranetDB" TO intranet_user;

-- Enable required extensions
\c IntranetDB
CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- For AES-256 encryption
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Docker Deployment (Recommended)
```bash
# Start all services (PostgreSQL + Backend + Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose build && docker-compose up -d

# Access backend container for migrations
docker exec -it intranet-api bash
dotnet ef database update
```

---

## Security Implementation Requirements

### IP Whitelist Middleware
- Implement custom middleware to check incoming IP against `AllowedIPRanges` in appsettings.json
- Support CIDR notation (e.g., "192.168.1.0/24")
- Return 403 Forbidden for unauthorized IPs
- Log all IP-based rejections to AuditLog

### Password Security
- Use **BCrypt** with work factor 12
- Never store plaintext passwords
- Enforce strong password policy (configurable)

### Sensitive Data Encryption
- Use PostgreSQL's `pgcrypto` extension for AES-256 encryption
- Encrypt: TC Kimlik No, phone numbers, other PII
- Store encryption key in appsettings.json (environment variable in production)

### JWT Configuration
- Algorithm: HMAC-SHA256
- Payload: userId, email, role, birimId, exp
- Default expiry: 8 hours (configurable)
- Optional: Implement refresh token mechanism

### Rate Limiting
- Login endpoint: 5 attempts per minute per IP
- Other endpoints: 100 requests per minute per user
- Use ASP.NET Core 9's built-in rate limiting

---

## API Structure (RESTful)

### Base URL
- Development: `https://localhost:5001/api`
- Production: `https://api.intranet.local/api`

### Standard Response Format
```json
{
  "success": true/false,
  "data": { ... },
  "message": "Optional message",
  "error": {  // Only if success=false
    "code": "ERROR_CODE",
    "message": "User-friendly message",
    "details": ["validation errors"]
  }
}
```

### Key Endpoint Groups
- `/api/auth/*` - Authentication (login, logout, refresh)
- `/api/users/*` - User management (CRUD)
- `/api/birimler/*` - Unit management
- `/api/roles/*` - Role management
- `/api/permissions/*` - Permission management
- `/api/auditlogs/*` - Audit log queries
- `/api/birimler/{birimId}/*` - Unit-specific content modules

See `API_SPECIFICATION.md` for complete endpoint documentation.

---

## Performance Requirements

| Metric | Target |
|--------|--------|
| Portal load time | ≤ 2 seconds |
| API response time (avg) | ≤ 200ms |
| Unit switching | ≤ 1 second |
| Database query time | ≤ 100ms |
| Concurrent users | 100-200 |

### Optimization Strategies
- **Backend**: async/await for all I/O, response caching, memory cache for roles/permissions, database indexing
- **Frontend**: Code splitting (lazy load unit modules), React.memo, useMemo, image optimization
- **Database**: Indexes on User(Email), UserBirimRole(UserID, BirimID), RolePermission(RoleID)

---

## Adding New Units (Birim) - Modular Architecture

The system is designed to easily add new organizational units. Follow this pattern:

1. **Database**: Add record to `Birim` table
2. **Database**: Create unit-specific tables (e.g., `HR_Employee`, `IT_Ticket`) with unit prefix
3. **Permissions**: Define new permissions for the unit (e.g., `hr.employee.create`)
4. **Roles**: Assign permissions to roles via `RolePermission`
5. **Backend**: Create controller (e.g., `HRController`) with `[HasPermission]` attributes
6. **Frontend**: Create feature module under `src/features/{unit-name}/`
7. **Frontend**: Add route to router with permission checks
8. **Frontend**: Add menu items (dynamically loaded based on user's role)

See `MODULAR_STRUCTURE.md` for detailed examples.

---

## Critical Implementation Notes

### Multi-Unit User Handling
- **Always** check both `userId` AND `birimId` when querying `UserBirimRole`
- Unit selection must update global state (Zustand store) and be included in all API requests
- Menu items must be filtered by active unit and role permissions
- Audit logs must record which unit the action was performed in

### RBAC Implementation
- Permissions follow `action.resource` format (e.g., "create.user", "read.announcement")
- Create custom `[HasPermission("permission.name")]` attribute for controllers
- Frontend must also check permissions to hide/show UI elements (but backend is authoritative)
- Cache role permissions in memory to avoid repeated DB queries

### Audit Logging
- Log all: login/logout, CRUD operations, role changes, permission changes, failed auth attempts
- Include: userId, birimId, action, resource, IPAddress, timestamp
- Store details as JSONB for flexible querying
- Consider partitioning `AuditLog` by month for large datasets

### Soft Delete Pattern
- Users should be deactivated (IsActive=false), not deleted
- Preserve referential integrity for audit logs
- Implement `IsActive` filtering in all queries

---

## Deployment Options

The system supports three deployment scenarios:

1. **Windows 11 + IIS**: See `DEPLOYMENT_GUIDE.md` → Section 2
2. **Linux Server + Nginx**: See `DEPLOYMENT_GUIDE.md` → Section 3
3. **Docker (Recommended)**: See `DEPLOYMENT_GUIDE.md` → Section 4
   - Single command deployment: `docker-compose up -d`
   - Platform-independent
   - Includes PostgreSQL, backend, frontend, and Nginx

For legacy Windows Server 2019/2022 deployments, see `WINDOWS_SERVER_DEPLOYMENT.md`.

---

## Documentation Files

### Core Documentation
- **PRD.md**: Product requirements and functional specifications
- **TECH_STACK.md**: Complete technology stack with versions
- **TECHNICAL_DESIGN.md**: Architecture, security implementation, deployment
- **ERD.md**: Database schema with SQL scripts and example queries
- **MODULAR_STRUCTURE.md**: How to add new organizational units

### Implementation & Development
- **DEVELOPMENT_STEPS.md**: Initial development phases and module order
- **IMPLEMENTATION_ROADMAP.md**: Complete 6-phase development roadmap with code examples (12-16 weeks)
- **API_SPECIFICATION.md**: All API endpoints with request/response examples
- **FILE_MANAGEMENT.md**: File upload system and Excel export implementation guide

### Deployment Guides
- **DEPLOYMENT_GUIDE.md**: Windows 11, Linux, and Docker deployment instructions
- **WINDOWS_SERVER_DEPLOYMENT.md**: Windows Server 2019/2022 özel deployment rehberi (opsiyonel)

### Quick Reference & Index
- **PROJECT_INDEX.md**: Comprehensive project documentation index with cross-references and navigation
- **API_INDEX.md**: API documentation index with endpoint categories, examples, and quick reference
- **QUICK_START.md**: Quick start guide for new developers (15-30 minute setup guide)

### Troubleshooting & Error Resolution
- **ERRORS.md**: Known errors, solutions, and preventive measures (BUILD ERRORS, DATABASE ERRORS, RUNTIME ERRORS)

---

## Important Constraints

- **No internet connectivity**: All resources must be local or pre-downloaded
- **Local network only**: IP whitelist enforcement is mandatory
- **Turkish language**: UI and messages in Turkish, but code/comments in English
- **Browser support**: Chrome, Edge, Firefox (modern versions)
- **Uptime requirement**: Minimum 99% availability
- **Data retention**: Audit logs must be queryable and filterable
- **No email system**: SMTP integration is explicitly out of scope
- **No approval workflows**: All operations are direct (no manager approval, no email notifications)

---

## Development Roadmap

The project follows a **6-phase implementation plan** (12-16 weeks total):

1. **Faz 0 (Week 1-2)**: Project setup - .NET 9 solution, PostgreSQL, React/Vite scaffolding
2. **Faz 1 (Week 2-3)**: Authentication & Core - JWT, login, IP whitelist, database schema
3. **Faz 2 (Week 4-6)**: RBAC & Admin Panel - `[HasPermission]` attribute, user/role/birim CRUD
4. **Faz 3 (Week 7-8)**: Multi-Unit Support - unit selection screen, unit switching
5. **Faz 4 (Week 9-10)**: First Unit Module (HR) - personel management, leave requests
6. **Faz 5 (Week 11-13)**: Second Unit Module (IT) + Deployment - ticket system, Docker
7. **Faz 6 (Week 14-16)**: Testing & Optimization - unit tests, load tests, security audit

See `IMPLEMENTATION_ROADMAP.md` for detailed step-by-step implementation guide with complete code examples.

---

## When Implementing Code

### Getting Started (First-Time Setup)
Since no code exists yet, start here:
1. Review `QUICK_START.md` for complete environment setup (PostgreSQL, .NET 9, Node.js)
2. Follow `IMPLEMENTATION_ROADMAP.md` → **Faz 0** to create the initial project structure
3. Use the exact commands in Faz 0 to scaffold .NET solution and React project

### Implementation Principles
1. **Follow the roadmap phases**: Use `IMPLEMENTATION_ROADMAP.md` as your primary guide for implementation order
2. **Start with backend layer structure**: Domain entities → Infrastructure (DbContext, repositories) → Application (services, DTOs) → API (controllers)
3. **Database first**: Create migrations and seed data before business logic
4. **Security cannot be skipped**: IP whitelist, JWT, BCrypt, permissions must be implemented from the start (Faz 1)
5. **Always validate**: Use FluentValidation for all DTOs
6. **Always log**: Critical operations must write to AuditLog
7. **Test with multi-unit users**: The most complex scenario is a user with multiple units and different roles in each
8. **Frontend must be responsive**: Use Tailwind for consistent styling across screen sizes
9. **Reference roadmap code examples**: Each phase in `IMPLEMENTATION_ROADMAP.md` includes production-ready code snippets

### Navigation for Development Tasks
- **Need API details?** → `API_SPECIFICATION.md` or `API_INDEX.md`
- **Need database schema?** → `ERD.md` (full SQL scripts included)
- **Adding a new unit/module?** → `MODULAR_STRUCTURE.md`
- **Deployment questions?** → `DEPLOYMENT_GUIDE.md`
- **Build errors?** → `ERRORS.md` (troubleshooting guide)
- **Lost?** → `PROJECT_INDEX.md` (central documentation hub)

---

## ⚠️ CRITICAL: Entity File Management

### Entity Location Rules (MUST FOLLOW)

**✅ CORRECT - Entities belong ONLY in Domain layer:**
```
IntranetPortal.Domain/
└── Entities/
    ├── User.cs
    ├── Role.cs
    ├── Permission.cs
    ├── Birim.cs
    ├── RolePermission.cs
    ├── UserBirimRole.cs
    ├── AuditLog.cs
    ├── UploadedFile.cs
    └── SystemSettings.cs
```

**❌ WRONG - NEVER create entity files in Infrastructure:**
```
IntranetPortal.Infrastructure/
├── User.cs              ❌ DELETE IMMEDIATELY
├── Role.cs              ❌ DELETE IMMEDIATELY
├── IntranetDbContext.cs ❌ DELETE (use Data/ApplicationDbContext.cs)
└── ...                  ❌ Any entity files here are WRONG
```

### EF Core Command Safety

**❌ NEVER RUN THIS COMMAND:**
```bash
# This generates duplicate entities in Infrastructure!
dotnet ef dbcontext scaffold "connection-string" Npgsql.EntityFrameworkCore.PostgreSQL
```

**✅ ONLY USE Code-First Migrations:**
```bash
# Always use migrations from Domain entities
dotnet ef migrations add MigrationName --project IntranetPortal.Infrastructure
dotnet ef database update --project IntranetPortal.Infrastructure
```

### Build Error Prevention

Before every `dotnet build`, verify:
```bash
# Check for duplicate entities (should return ONLY Domain/Entities/)
find . -name "User.cs" -o -name "Role.cs"

# Expected output:
# ./IntranetPortal.Domain/Entities/User.cs
# ./IntranetPortal.Domain/Entities/Role.cs

# If you see files in Infrastructure/ → DELETE them immediately!
```

**Why This Matters:**
- Duplicate entities cause **CS1061 compilation errors** (74+ errors)
- Infrastructure should ONLY reference Domain entities, not duplicate them
- See `ERRORS.md` for full troubleshooting guide

---
