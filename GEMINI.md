# Kurumsal İntranet Web Portalı Context

## Project Overview
**Name:** Kurumsal İntranet Web Portalı
**Type:** Full-Stack Web Application (Internal Enterprise Portal)
**Primary Path:** `C:\Users\IT\Desktop\Bilişim Sistemi\intranet-portal`
**Description:** A secure, multi-unit corporate intranet portal featuring Role-Based Access Control (RBAC), JWT authentication, and module-based architecture (IT, HR, etc.).

## Technology Stack
- **Backend:** .NET 9 (ASP.NET Core Web API)
- **Database:** PostgreSQL 16 (Entity Framework Core 9)
- **Frontend:** React 19.2.0, TypeScript 5.8, Vite 6.2
- **State Management:** Zustand
- **Styling:** TailwindCSS 3.4
- **Security:** JWT (HMAC-SHA256), BCrypt, AES-256 (PII), IP Whitelisting

## Development Workflow

### Backend (`/backend`)
*   **Run:** `dotnet run --project IntranetPortal.API`
*   **Watch:** `dotnet watch --project IntranetPortal.API`
*   **Migrations (Add):** `dotnet ef migrations add <Name> --project IntranetPortal.Infrastructure --startup-project IntranetPortal.API`
*   **Migrations (Update):** `dotnet ef database update --project IntranetPortal.Infrastructure --startup-project IntranetPortal.API`
*   **Tests:** `dotnet test`

### Frontend (`/frontend`)
*   **Install:** `npm install`
*   **Run Dev:** `npm run dev`
*   **Build:** `npm run build`
*   **Type Check:** `npm run type-check`

## Critical Rules & Conventions
1.  **No Scaffolding:** NEVER run `dotnet ef dbcontext scaffold`. Use Code-First migrations only.
2.  **Entity Location:** Entities must ONLY exist in `IntranetPortal.Domain/Entities/`.
3.  **Language:** User Interface (UI) must be in **Turkish**. Code, comments, and commit messages must be in **English**.
4.  **Security:** 
    *   All PII (Personally Identifiable Information) must be encrypted using `pgcrypto` (AES-256).
    *   Endpoints must be secured with `[HasPermission("action.resource")]`.
5.  **Data Access:** Use `IsActive=false` for soft deletes; never hard delete users.

## Project Structure
```
intranet-portal/
├── backend/
│   ├── IntranetPortal.API/           # Controllers, Middleware, Entry Point
│   ├── IntranetPortal.Application/   # Services, DTOs, Business Logic
│   ├── IntranetPortal.Domain/        # Entities, Enums, Constants
│   └── IntranetPortal.Infrastructure/# DbContext, Repositories, Migrations
└── frontend/
    └── src/
        ├── features/                 # Modular features (auth, admin, it, genelButce)
        ├── shared/                   # Reusable components & hooks
        ├── api/                      # API client configuration
        └── store/                    # Global state (Zustand)
```

## Current Status (as of Dec 2025)
- **Completed:** Phase 3.5 (Dashboard & Unit UI), Phase 1-3 (Auth, RBAC, Multi-Unit).
- **Active:** Phase 4 (IT Module - Bilişim Sistemleri).
- **Pending:** Integration Testing, Deployment optimizations.

## Documentation Index
- **AI Guide:** `CLAUDE.md` (Root)
- **Roadmap:** `docs/technical/IMPLEMENTATION_ROADMAP.md`
- **API Specs:** `docs/api/API_SPECIFICATION.md`
- **Database:** `docs/technical/ERD.md`
- **Security:** `docs/reports/SECURITY_ANALYSIS_REPORT.md`
