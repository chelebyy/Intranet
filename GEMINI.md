# ⚡ MORPHLLM & PROJECT OPTIMIZATIONS

═══════════════════════════════════════════════════════
FAST APPLY - PRIMARY FILE EDIT TOOL - USE THIS FOR EDITS
═══════════════════════════════════════════════════════
IMPORTANT: Use `edit_file` over `str_replace` or full file writes.
• Handles automatic indentation & fuzzy matching for .NET/React code.
• Works with partial code snippets—no need for full file content.
→ Prefer this over manual file editing tools.

═══════════════════════════════════════════════════════
FAST CONTEXT - PRIMARY CODE SEARCH TOOL - USE THIS FIRST
═══════════════════════════════════════════════════════
IMPORTANT: For codebase exploration, use `warpgrep_codebase_search` FIRST.
• Runs parallel search to locate relevant business logic.
• Examples: "Find RBAC permission logic", "Locate Document upload API".
→ Always start your search here.

═══════════════════════════════════════════════════════

# 🏗️ SYSTEM & FRAMEWORK IMPORTS
@import "FLAGS.md"
@import "RULES.md"
@import "PRINCIPLES.md"
@import "BUSINESS_SYMBOLS.md"

# 🏢 PROJECT CONTEXT: KURUMSAL İNTRANET WEB PORTALI

## Project Overview
**Description:** Secure, multi-unit intranet with RBAC, JWT, and module-based architecture (.NET 9 & React 19).

## 🛠️ Technology Stack
- **Backend:** .NET 9 (ASP.NET Core API), EF Core 9, PostgreSQL 16.
- **Frontend:** React 19.2.0, TypeScript 5.8, Vite 6.2, TailwindCSS 3.4.
- **State:** Zustand, TanStack Query.
- **Security:** JWT (HMAC-SHA256), BCrypt, AES-256 (PII).

## 📜 Critical Rules & Conventions
1. **Language:** UI MUST be in **Turkish**. Code/Comments/Commits MUST be in **English**.
2. **Architecture:** Backend follows **Clean Architecture** (API -> Application -> Domain -> Infrastructure).
3. **No Scaffolding:** NEVER run `scaffold`. Use Code-First migrations only.
4. **Entity Location:** Entities must ONLY exist in `IntranetPortal.Domain/Entities/`.
5. **Security:** Use `[HasPermission("action.resource")]` for all endpoints. PII must be encrypted via `pgcrypto`.
6. **Data Access:** Soft delete only (`IsActive=false`). No hard deletes for users.
7. **Frontend Structure:** Feature-based organization (`src/features/`).

## 📂 Project Structure
- `backend/IntranetPortal.API/`: Entry Point & Controllers.
- `backend/IntranetPortal.Application/`: Services, DTOs, Logic.
- `backend/IntranetPortal.Domain/`: Entities, Enums, Constants.
- `backend/IntranetPortal.Infrastructure/`: DbContext, Repos, Migrations.
- `frontend/src/features/`: Modular frontend features.

## 📍 Current Status
- **Active:** Phase 5 (Document Management / Doküman Yönetimi).
- **Goal:** Implement secure upload, categorization, and RBAC-based download.

═══════════════════════════════════════════════════════
CANNOT BE CALLED IN PARALLEL - one invocation at a time.