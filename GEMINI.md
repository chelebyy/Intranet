# Gemini Context: Kurumsal İntranet Web Portalı

This file provides essential context for the Gemini AI agent working on the "Kurumsal İntranet Web Portalı" project.

## Project Overview

*   **Name:** Kurumsal İntranet Web Portalı (Enterprise Intranet Web Portal)
*   **Description:** A secure, local-network intranet solution featuring multi-department support, Role-Based Access Control (RBAC), and content management.
*   **Status:** Phase 1 Completed (Login System active).
*   **Key Documentation:**
    *   `PRD.md`: Product Requirements Document (Master reference).
    *   `TECH_STACK.md`: Detailed technology stack.
    *   `API_SPECIFICATION.md`: Backend API definitions.
    *   `README_BASLAT.md`: Quick start guide.

## Architecture & Tech Stack

The project follows a modern full-stack architecture:

### Backend (.NET 9.0)
*   **Location:** `intranet-portal/backend/`
*   **Framework:** ASP.NET Core Web API
*   **Architecture:** Clean Architecture (Layers: `API`, `Application`, `Domain`, `Infrastructure`)
*   **Database:** PostgreSQL 16 (using Entity Framework Core 9.0)
*   **Authentication:** JWT (JSON Web Tokens) + BCrypt hashing
*   **Logging:** Serilog (Sinks to PostgreSQL)
*   **Key Libraries:** `Microsoft.EntityFrameworkCore`, `AutoMapper`, `FluentValidation`

### Frontend (React 19)
*   **Location:** `intranet-portal/frontend/`
*   **Framework:** React 19 + TypeScript + Vite 7
*   **Styling:** Tailwind CSS 3.4
*   **State Management:** Zustand
*   **Routing:** React Router DOM 7
*   **HTTP Client:** Axios

## Development Environment

### Prerequisites
*   **OS:** Windows (Primary), Linux (Supported)
*   **Runtime:** .NET 9 SDK, Node.js 20+, PostgreSQL 16

### Key Commands

**Global Controls:**
*   Start All: `start-intranet.bat` (Root directory)
*   Stop All: `stop-intranet.bat` (Root directory)

**Backend (`intranet-portal/backend/IntranetPortal.API`):**
*   Run: `dotnet run`
*   Build: `dotnet build`
*   Migrations (create): `dotnet ef migrations add <Name> --startup-project ../IntranetPortal.API --project ../IntranetPortal.Infrastructure`
*   Migrations (apply): `dotnet ef database update --startup-project ../IntranetPortal.API`

**Frontend (`intranet-portal/frontend`):**
*   Install Deps: `npm install`
*   Dev Server: `npm run dev`
*   Build: `npm run build`
*   Lint: `npm run lint`

## Project Structure

```text
C:\Users\IT\Desktop\Bilişim Sistemi\
├── intranet-portal\
│   ├── backend\
│   │   ├── IntranetPortal.API\           # Entry point, Controllers
│   │   ├── IntranetPortal.Application\   # Business logic, DTOs, Interfaces
│   │   ├── IntranetPortal.Domain\        # Entities, Enums, Constants
│   │   └── IntranetPortal.Infrastructure\# EF Core, Data Access, Migrations
│   └── frontend\
│       ├── src\
│       │   ├── api\        # API integration
│       │   ├── features\   # Feature-based modules
│       │   ├── shared\     # Shared components/hooks
│       │   └── store\      # Zustand stores
└── [Documentation Files]   # PRD.md, TECH_STACK.md, etc.
```

## Conventions & Guidelines

*   **Language:** Source code in English. Documentation mixed (Turkish/English), predominantly Turkish for business logic descriptions.
*   **Database:**
    *   Use `IntranetDbContext` for data access.
    *   Apply migrations for any schema change.
    *   `sicil` (Registration Number) is the unique identifier for users, not email.
*   **Security:**
    *   Never commit secrets (check `appsettings.json` and `.env`).
    *   Passwords must be hashed (BCrypt).
    *   Role checks are mandatory for protected endpoints.
*   **API:**
    *   Follow RESTful conventions.
    *   Use DTOs for all data transfer (never expose Entities directly).

## Current Status (as of 2025-11-27)
*   **Login System:** Fully functional with JWT and RBAC.
*   **Migration:** Transitioned from Email-based login to Sicil-based login.
*   **Next Steps:** Implementing Dashboard and Department modules.
