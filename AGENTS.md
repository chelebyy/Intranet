# AI Agent Guide for Intranet Portal

This document provides context, rules, and instructions for AI agents (like Google Jules) working on this repository.

## 🏗️ Project Overview
**Name:** Kurumsal İntranet Web Portalı
**Description:** A secure, multi-unit corporate intranet portal featuring Role-Based Access Control (RBAC), JWT authentication, and module-based architecture.

## 🛠️ Technology Stack
- **Backend:** .NET 9 (ASP.NET Core Web API)
- **Database:** PostgreSQL 16 (Entity Framework Core 9)
- **Frontend:** React 19.2.0, TypeScript 5.8, Vite 6.2
- **State Management:** Zustand
- **Styling:** TailwindCSS 3.4, ShadcnUI (installed in `frontend/src/components/ui`)
- **Infrastructure:** Docker, Docker Compose

## 📂 Key Directories
- `backend/`: ASP.NET Core API source code
  - `IntranetPortal.API/`: Entry point, controllers
  - `IntranetPortal.Domain/`: Entities, Core Logic
- `frontend/`: React Vite application
  - `src/features/`: Modular business logic (Auth, IT, HR)
  - `src/components/ui/`: ShadcnUI components
- `docs/`: Project documentation
- `.agent/workflows/`: Automation scripts

## 🚀 Development Commands (Docker)
The preferred way to run the project is via Docker Compose:
- **Start All:** `docker-compose up`
- **Rebuild:** `docker-compose up --build`
- **Stop:** `docker-compose down`

## 📜 Coding Conventions & Rules
1.  **Language:** UI must be **Turkish**. Code comments and commits in **English**.
2.  **Frontend Imports:** Use `@/` alias for `src/` (e.g., `@/components/ui/button`).
3.  **Backend Pattern:** Clean Architecture (API -> Application -> Infrastructure -> Domain).
4.  **Database:** NEVER use `Scaffold`. Use Code-First Migrations (`dotnet ef migrations add`).
5.  **Icons:** Use `lucide-react`.

## 🔒 Security Context
- **Generic Password (Dev):** `CHANGE_ME_IN_PROD_123`
- **Auth:** JWT /w HttpOnly Cookie.

## 🤖 Workflows
- Check for updates: run `/guncelle` or look at `.agent/workflows/guncelle.md`
