# Technology Stack: Kurumsal İntranet Web Portalı

## 1. Backend
- **Framework:** .NET 9 (ASP.NET Core Web API)
- **Object-Relational Mapper (ORM):** Entity Framework Core 9
- **Authentication:** JWT Bearer (HMAC-SHA256)
- **Security:**
  - Password Hashing: BCrypt
  - Data Encryption: AES-256 (PII)
  - OWASP Top 10 Compliant
- **API Documentation:** Swagger/OpenAPI

## 2. Frontend
- **Framework:** React 19.2.0
- **Language:** TypeScript 5.8
- **Build Tool:** Vite 6.2.0
- **State Management:** Zustand
- **Styling:** TailwindCSS 3.4.17
- **UI Components:** Shadcn/UI
- **Data Fetching:** Axios, TanStack Query

## 3. Database
- **Engine:** PostgreSQL 16
- **Migrations:** Code-First Migrations (EF Core)
- **Security:** `pgcrypto` for PII encryption at rest

## 4. Infrastructure & DevOps
- **Containerization:** Docker (planned)
- **Version Control:** Git
- **Static Analysis:** SonarQube
