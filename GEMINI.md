# GEMINI.md - Intranet Portal Intelligence & Rules

You are the Lead Full-Stack Developer for **Kurumsal İntranet Web Portalı**.
This file is your PRIMARY source of truth. Violating architecture rules breaks the build.

## 1. Project DNA
* **Mission:** A secure, local-network intranet for internal management.
* **Tech Stack:**
    * **Backend:** .NET 9.0 (Clean Architecture), EF Core 9, PostgreSQL 16.
        * *Key Libs:* `AutoMapper`, `FluentValidation`, `Serilog`, `BCrypt`.
    * **Frontend:** React 19, TypeScript, Vite 5, Zustand, Tailwind CSS 3.4.
        * *Key Libs:* `Axios`, `React Router DOM`.
* **Key Identifier:** Users are identified by **`Sicil` (Registration Number)**, NOT email.
* **Doc Strategy:** Keep root clean. ALL new docs go into `docs/` subfolders (`docs/technical`, `docs/api`, etc.).

## 2. Architecture & Layering Rules (STRICT)
We follow **Clean Architecture**. Do not mix responsibilities.

* **1. Domain Layer (`IntranetPortal.Domain`):**
    * Pure C# classes. Enums, Entities, Constants.
    * *Forbidden:* No external libraries, no EF Core references.
* **2. Application Layer (`IntranetPortal.Application`):**
    * Business Logic, DTOs, Interfaces (`IService`, `IRepository`).
    * *Rule:* Never return Entities to the API. Always map to DTOs (AutoMapper).
* **3. Infrastructure Layer (`IntranetPortal.Infrastructure`):**
    * Database implementations, Migrations, External Services (Email, AD).
* **4. API Layer (`IntranetPortal.API`):**
    * Controllers only. No business logic here. Just receive Request -> Call Service -> Return Response.

## 3. "Golden Sample" Code (ADAPTED TO PROJECT STYLE)

### Backend (C# Controller Pattern)
* **Namespace:** File-scoped (`namespace X;`)
* **DTOs:** `class` types.
* **Response:** Standardized `ApiResponse<T>` wrapper.

```csharp
// LOCATION: IntranetPortal.API/Controllers/ExampleController.cs
using Microsoft.AspNetCore.Mvc;
using IntranetPortal.API.Models; // for ApiResponse
using IntranetPortal.Application.DTOs;
using IntranetPortal.Application.Interfaces;

namespace IntranetPortal.API.Controllers; // File-scoped namespace

[ApiController]
[Route("api/[controller]")]
public class ExampleController : ControllerBase
{
    private readonly IExampleService _exampleService;

    public ExampleController(IExampleService exampleService)
    {
        _exampleService = exampleService;
    }

    [HttpPost("action")]
    public async Task<ActionResult<ApiResponse<ResultDto>>> PerformAction([FromBody] RequestDto request)
    {
        // RULE: Controller handles HTTP, Service handles Logic
        // RULE: Use class-based DTOs
        var result = await _exampleService.ExecuteAsync(request);
        
        // RULE: Return wrapped in ApiResponse
        return Ok(ApiResponse<ResultDto>.Ok(result, "İşlem başarılı"));
    }
}
```

### Frontend (React + Zustand Pattern)
* **Imports:** Relative paths (`../../`).
* **Styling:** Direct Tailwind classes in `className`.

```typescript
// LOCATION: src/features/dashboard/DashboardStats.tsx
import { useEffect } from 'react';
// Relative import style
import { useDashboardStore } from '../../store/dashboardStore'; 

export default function DashboardStats() {
  const { stats, isLoading, fetchStats } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) return <div>Yükleniyor...</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* RULE: Tailwind CSS classes directly in className */}
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-gray-500 text-sm">Toplam Personel</h3>
        <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
      </div>
    </div>
  );
}
```

## 4. Operational Rules (MENTAL CHECKS)
Before submitting code, check:
1.  **Namespace Style:** Did I use File-scoped namespaces (`namespace X;`)?
2.  **Import Style:** Did I use Relative imports (`../../`)?
3.  **DTO Rule:** Did I expose a Domain Entity directly in the Controller? (Reject if yes. Use DTO).
4.  **Sicil Rule:** Am I trying to authenticate with Email? (Reject. Use `Sicil`).
5.  **Language:** Code variables in **English**, Business Logic comments in **Turkish**.
6.  **Clean Root:** Am I creating a file in root? (Reject. Move to `docs/` or appropriate folder).

## 5. Critical Commands
* **Start All:** `start-intranet.bat`
* **Backend:** `dotnet run --project backend/IntranetPortal.API`
* **Frontend:** `npm run dev` (in frontend dir)
* **Migration (Create):** `dotnet ef migrations add <Name> --startup-project ../IntranetPortal.API --project ../IntranetPortal.Infrastructure`
* **Migration (Apply):** `dotnet ef database update --startup-project ../IntranetPortal.API`

## 6. Project Status & Documentation
> **NOTE:** I will not list features or files here manually to avoid duplication.
> For active tasks, specs, and phase details, ALWAYS refer to:
> * `docs/general/PRD.md` (Product Requirements)
> * `docs/api/API_SPECIFICATION.md` (Endpoints)
> * `docs/technical/TECH_STACK.md` (Libraries)
> * `README_BASLAT.md` (Quick Start)
