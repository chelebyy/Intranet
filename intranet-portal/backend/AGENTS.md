# AGENTS.md - Backend (.NET 9)

**Location**: `intranet-portal/backend/`  
**Architecture**: Layered (API → Application → Domain → Infrastructure)  
**Generated**: 2026-03-26

---

## OVERVIEW

.NET 9 Web API with Clean Architecture. Four distinct layers with strict separation of concerns. Domain layer contains ONLY entities.

---

## STRUCTURE

```
backend/
├── IntranetPortal.sln
├── IntranetPortal.API/              # Presentation Layer
│   ├── Controllers/                 # 12 API controllers
│   ├── Middleware/                  # IP whitelist, rate limiting
│   ├── Filters/                     # PermissionAuthorizationFilter
│   ├── Attributes/                  # [HasPermission]
│   ├── Extensions/                  # DI extensions
│   └── Program.cs                   # Entry point
├── IntranetPortal.Application/      # Business Logic Layer
│   ├── Services/                    # 14 service implementations
│   ├── Interfaces/                  # Service contracts
│   ├── DTOs/                        # Organized by feature
│   ├── Validators/                  # FluentValidation
│   └── Settings/                    # Config classes
├── IntranetPortal.Domain/           # Domain Layer (ENTITIES ONLY)
│   ├── Entities/                    # 14 domain entities
│   ├── Enums/                       # AuditAction, RoleType
│   └── Constants/                   # Permissions, SystemModules
└── IntranetPortal.Infrastructure/   # Data Access Layer
    ├── Data/                        # DbContext, seeding
    ├── Configurations/              # EF Fluent API configs
    ├── Migrations/                  # 8 EF migrations
    └── Repositories/                # Repository pattern
```

---

## WHERE TO LOOK

| Task | Location | Pattern |
|------|----------|---------|
| Add controller | `IntranetPortal.API/Controllers/` | Inherit `ControllerBase`, use `[Route]` |
| Add service | `IntranetPortal.Application/Services/` | Implement interface from `Interfaces/` |
| Add interface | `IntranetPortal.Application/Interfaces/` | `I[Name]Service` naming |
| Add entity | `IntranetPortal.Domain/Entities/` | **ONLY location for entities** |
| Add DTO | `IntranetPortal.Application/DTOs/[Feature]/` | Group by feature |
| Add EF config | `IntranetPortal.Infrastructure/Configurations/` | `IEntityTypeConfiguration<T>` |
| Add middleware | `IntranetPortal.API/Middleware/` | Add to `Program.cs` pipeline |
| Add permission check | Use `[HasPermission("action.resource")]` | On controller actions |

---

## CONVENTIONS

### Entity Pattern
```csharp
[Table("Kullanicilar")]
public class User
{
    [Key]
    public int UserID { get; set; }
    
    [Column("Sicil")]
    public string Sicil { get; set; }
    
    public bool IsActive { get; set; } = true;  // Soft delete
    
    [NotMapped]
    public string AdSoyad => $"{Ad} {Soyad}";  // Computed
}
```

### Service Pattern
```csharp
public interface IUserService { ... }

public class UserService : IUserService
{
    private readonly IIntranetDbContext _context;
    
    public UserService(IIntranetDbContext context)
    {
        _context = context;
    }
}
```

### Controller Pattern
```csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    
    [HttpPost]
    [HasPermission("user.create")]
    public async Task<ActionResult<ApiResponse<UserDto>>> Create(CreateUserDto dto)
    { ... }
}
```

### Multi-Unit Query Pattern
```csharp
// ALWAYS filter by BOTH UserID AND BirimID
var userRoles = await _context.UserBirimRoles
    .Where(ubr => ubr.UserID == userId && ubr.BirimID == birimId)
    .Include(ubr => ubr.Role)
    .ToListAsync();
```

---

## ANTI-PATTERNS (CRITICAL)

| Don't | Why | Do Instead |
|-------|-----|------------|
| `dotnet ef dbcontext scaffold` | Creates duplicate entities | Use `dotnet ef migrations add` |
| Entities outside `Domain/Entities/` | Architecture violation | Keep ALL entities in Domain layer |
| Hard delete users/records | Data loss | Use `IsActive = false` |
| Skip `birimId` in queries | Wrong permissions returned | Always include BOTH filters |
| Store secrets in `appsettings.json` | Security risk | Use `dotnet user-secrets` |
| Direct DbContext in controllers | Violates layered architecture | Use services |
| Docker non-standard ports | Uses 8080/8081 instead of 80/443 | Dev/testing only — document if prod uses different |

---

## KEY ENTITIES

| Entity | Purpose | Key Relationships |
|--------|---------|-------------------|
| `User` | System users | Has many `UserBirimRole` |
| `Birim` | Units/departments | Has many `UserBirimRole` |
| `Role` | RBAC roles | Has many `UserBirimRole`, `RolePermission` |
| `Permission` | Granular permissions | Linked via `RolePermission` |
| `UserBirimRole` | **CRITICAL** - User+Unit+Role junction | Composite key (UserID, BirimID, RoleID) |
| `AuditLog` | Action audit trail | UserID, BirimID, Action, Timestamp |
| `Announcement` | System announcements | Has targets |
| `IPRestriction` | IP whitelist/blacklist | Type, IPAddress, Description |

---

## COMMANDS

```powershell
# Restore & Build
dotnet restore
dotnet build

# Run with hot reload
dotnet watch --project IntranetPortal.API

# Database migrations
dotnet ef migrations add [MigrationName] --project IntranetPortal.Infrastructure --startup-project IntranetPortal.API
dotnet ef database update --project IntranetPortal.Infrastructure --startup-project IntranetPortal.API

# User secrets
dotnet user-secrets init --project IntranetPortal.API
dotnet user-secrets set "JwtSettings:SecretKey" "your-secret" --project IntranetPortal.API
```

---

## NOTES

### JWT Configuration
- **Storage**: HttpOnly cookie (`auth_token`)
- **Algorithm**: HMAC-SHA256
- **Expiry**: 8 hours (configurable)
- **Claims**: userId, sicil, ad, soyad, birimId, birimAdi, roleId, roleName

### Permission System
- **Format**: `"action.resource"` (e.g., `"user.create"`, `"auditlog.read"`)
- **Check**: Use `[HasPermission]` attribute on controllers
- **SuperAdmin**: RoleID = 1 bypasses all checks

### Middleware Pipeline Order (Program.cs)
```csharp
1. IPWhitelistMiddleware
2. RateLimitingMiddleware
3. CORS
4. Authentication
5. MaintenanceMiddleware
6. Authorization
7. Controllers
```

### Security Middleware
- **IPWhitelist**: CIDR ranges, exact IPs, localhost bypass
- **RateLimiting**: Per-IP throttling (5 login/min, 100 API/min)

### Audit Logging
All write operations logged to `AuditLog` with:
- UserID, BirimID (who and where)
- Action, Resource (what)
- IPAddress, Timestamp (when/where)

---

*See parent AGENTS.md for project-wide conventions.*
