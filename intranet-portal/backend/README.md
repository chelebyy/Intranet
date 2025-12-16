# Kurumsal İntranet Web Portalı - Backend

.NET 9 ASP.NET Core Web API backend uygulaması.

## 🏗️ Mimari

**Layered Architecture** (Katmanlı Mimari):

```
IntranetPortal.API/              # Presentation Layer
├── Controllers/                 # API endpoints
├── Middleware/                  # Custom middleware (IP filter, exception handler)
├── Filters/                     # Authorization attributes
└── Program.cs                   # App configuration

IntranetPortal.Application/      # Business Logic Layer
├── Services/                    # Business services
├── DTOs/                        # Data transfer objects
├── Interfaces/                  # Service contracts
└── Validators/                  # FluentValidation rules

IntranetPortal.Domain/           # Domain Layer
├── Entities/                    # Database models
├── Enums/                       # Enumeration types
└── Constants/                   # System constants

IntranetPortal.Infrastructure/   # Data Access Layer
├── Data/                        # DbContext
├── Repositories/                # Repository pattern
├── Migrations/                  # EF Core migrations
└── Configurations/              # Entity configurations
```

## 🚀 Kurulum

### Gereksinimler

- **.NET 9 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/9.0)
- **PostgreSQL 16** - [Download](https://www.postgresql.org/download/)
- **IDE**: Visual Studio 2022, Rider, veya VS Code

### 1. Bağımlılıkları Yükle

```bash
cd backend
dotnet restore
```

### 2. Database Oluştur

```sql
-- PostgreSQL'e bağlan
psql -U postgres

-- Database oluştur
CREATE DATABASE "IntranetDB" ENCODING 'UTF8';

-- User oluştur
CREATE USER intranet_user WITH ENCRYPTED PASSWORD 'SecurePassword123!';

-- Yetkileri ver
GRANT ALL PRIVILEGES ON DATABASE "IntranetDB" TO intranet_user;

-- Extension'ları aktive et
\c IntranetDB
CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- AES-256 encryption
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 3. User Secrets Yapılandır

```bash
cd IntranetPortal.API

# User secrets'ı başlat
dotnet user-secrets init

# Connection string ekle
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Database=IntranetDB;Username=intranet_user;Password=SecurePassword123!"

# JWT Secret key ekle (güçlü key oluştur)
dotnet user-secrets set "JwtSettings:SecretKey" "$(openssl rand -base64 32)"

# Encryption key ekle (AES-256 için)
dotnet user-secrets set "SecuritySettings:EncryptionKey" "$(openssl rand -base64 32)"
```

### 4. Migration Çalıştır

```bash
# Migration oluştur (henüz yoksa)
dotnet ef migrations add InitialCreate --project IntranetPortal.Infrastructure --startup-project IntranetPortal.API

# Database'i güncelle
dotnet ef database update --project IntranetPortal.API
```

### 5. Uygulamayı Çalıştır

```bash
# Development mode
dotnet run --project IntranetPortal.API

# Watch mode (auto-reload)
dotnet watch --project IntranetPortal.API
```

API varsayılan olarak **https://localhost:5001** adresinde çalışır.

Swagger UI: **https://localhost:5001/swagger**

## 🔧 Geliştirme

### Solution Yapısı

```bash
# Solution'ı aç
dotnet sln IntranetPortal.sln

# Projeleri listele
dotnet sln list

# Build
dotnet build

# Test (henüz test yok)
dotnet test

# Clean
dotnet clean
```

### Entity Framework Komutları

```bash
# Yeni migration oluştur
dotnet ef migrations add MigrationName --project IntranetPortal.Infrastructure --startup-project IntranetPortal.API

# Migration'ı geri al
dotnet ef migrations remove --project IntranetPortal.Infrastructure --startup-project IntranetPortal.API

# Database'i güncelle
dotnet ef database update --project IntranetPortal.API

# Migration SQL script'i oluştur
dotnet ef migrations script -o migration.sql --project IntranetPortal.Infrastructure --startup-project IntranetPortal.API

# Database'i drop et
dotnet ef database drop --project IntranetPortal.API
```

### Code Generation (Scaffold)

```bash
# Controller scaffold (örnek)
dotnet aspnet-codegenerator controller -name UsersController -async -api -m User -dc ApplicationDbContext -outDir Controllers

# DbContext scaffold (database-first için)
dotnet ef dbcontext scaffold "Host=localhost;Database=IntranetDB;Username=intranet_user;Password=xxx" Npgsql.EntityFrameworkCore.PostgreSQL -o Models
```

## 📦 NuGet Paketleri

### Core
- `Microsoft.AspNetCore.App` - ASP.NET Core framework
- `Microsoft.EntityFrameworkCore` - ORM
- `Npgsql.EntityFrameworkCore.PostgreSQL` - PostgreSQL provider

### Authentication & Security
- `Microsoft.AspNetCore.Authentication.JwtBearer` - JWT authentication
- `BCrypt.Net-Next` - Password hashing
- `System.IdentityModel.Tokens.Jwt` - JWT token generation

### Validation & Mapping
- `FluentValidation.AspNetCore` - Input validation
- `AutoMapper.Extensions.Microsoft.DependencyInjection` - DTO mapping

### Logging
- `Serilog.AspNetCore` - Structured logging
- `Serilog.Sinks.Console` - Console output
- `Serilog.Sinks.File` - File logging

## 🔐 Güvenlik Özellikleri

### 1. IP Whitelist Middleware
```csharp
// Startup'ta yapılandırma
app.UseMiddleware<IpWhitelistMiddleware>();

// appsettings.json
{
  "IpWhitelist": {
    "AllowedIPs": ["192.168.1.0/24", "10.0.0.1"]
  }
}
```

### 2. JWT Authentication
```csharp
// Token oluşturma
var token = _jwtService.GenerateToken(user.Id, user.Email, user.RoleId, user.BirimId);

// HttpOnly cookie ile gönderme
Response.Cookies.Append("AuthToken", token, new CookieOptions {
    HttpOnly = true,
    Secure = true,
    SameSite = SameSiteMode.Strict,
    Expires = DateTimeOffset.UtcNow.AddHours(8)
});
```

### 3. RBAC (Role-Based Access Control)
```csharp
// Custom attribute
[HasPermission("user.create")]
public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto) { ... }

// Middleware'de kontrol
var hasPermission = await _permissionService.UserHasPermission(userId, birimId, "user.create");
```

### 4. Rate Limiting
```csharp
// Program.cs
builder.Services.AddRateLimiter(options => {
    options.AddFixedWindowLimiter("api", opt => {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
    });
});
```

### 5. Audit Logging
```csharp
// Otomatik audit log
await _auditService.LogAsync(new AuditLog {
    UserId = currentUser.Id,
    BirimId = currentUser.BirimId,
    Action = "user.create",
    Resource = "User",
    Details = JsonSerializer.Serialize(newUser),
    IPAddress = HttpContext.Connection.RemoteIpAddress.ToString(),
    Timestamp = DateTime.UtcNow
});
```

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/login       # Kullanıcı girişi
POST   /api/auth/logout      # Çıkış
POST   /api/auth/refresh     # Token yenileme
GET    /api/auth/verify      # Token doğrulama
```

### Users
```
GET    /api/users            # Kullanıcı listesi
GET    /api/users/{id}       # Kullanıcı detayı
POST   /api/users            # Yeni kullanıcı
PUT    /api/users/{id}       # Kullanıcı güncelle
DELETE /api/users/{id}       # Kullanıcı sil
```

### Birimler (Units)
```
GET    /api/birimler         # Birim listesi
GET    /api/birimler/{id}    # Birim detayı
POST   /api/birimler         # Yeni birim
PUT    /api/birimler/{id}    # Birim güncelle
DELETE /api/birimler/{id}    # Birim sil
```

### Roles & Permissions
```
GET    /api/roles            # Rol listesi
GET    /api/roles/{id}       # Rol detayı
POST   /api/roles            # Yeni rol
PUT    /api/roles/{id}       # Rol güncelle
DELETE /api/roles/{id}       # Rol sil

GET    /api/permissions      # İzin listesi
POST   /api/roles/{id}/permissions  # Role izin ekle
DELETE /api/roles/{id}/permissions/{permId}  # Rolden izin çıkar
```

### Audit Logs
```
GET    /api/auditlogs        # Audit log listesi
GET    /api/auditlogs/{id}   # Audit log detayı
GET    /api/auditlogs/user/{userId}  # Kullanıcıya ait loglar
```

Detaylı API dokümantasyonu için: **[API_SPECIFICATION.md](../../API_SPECIFICATION.md)**

## 🧪 Testing (Planlanan)

```bash
# Unit testler
dotnet test --filter "Category=Unit"

# Integration testler
dotnet test --filter "Category=Integration"

# Coverage raporu
dotnet test /p:CollectCoverage=true /p:CoverageReportFormat=html
```

## 📊 Performans

### Hedefler
- API response time: ≤ 200ms (ortalama)
- Database query time: ≤ 100ms
- Concurrent users: 100-200
- Throughput: 1000 req/sec

### Optimizasyon
- **Response caching**: Memory cache for roles/permissions
- **Database indexing**: User(Email), UserBirimRole(UserID, BirimID)
- **Async/await**: Tüm I/O işlemlerinde
- **Connection pooling**: EF Core connection pool

## 🔍 Debugging

### Logging Levels
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  }
}
```

### VS Code Launch Configuration
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": ".NET Core Launch (web)",
      "type": "coreclr",
      "request": "launch",
      "preLaunchTask": "build",
      "program": "${workspaceFolder}/IntranetPortal.API/bin/Debug/net9.0/IntranetPortal.API.dll",
      "args": [],
      "cwd": "${workspaceFolder}/IntranetPortal.API",
      "stopAtEntry": false,
      "serverReadyAction": {
        "action": "openExternally",
        "pattern": "\\bNow listening on:\\s+(https?://\\S+)"
      },
      "env": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  ]
}
```

## 📋 Yapılacaklar

### Faz 1 (Temel Yapı)
- [ ] DbContext ve Entity yapılandırmaları
- [ ] Repository pattern implementasyonu
- [ ] Authentication service (JWT + BCrypt)
- [ ] IP Whitelist middleware
- [ ] Audit logging service

### Faz 2 (RBAC)
- [ ] HasPermission attribute
- [ ] Permission middleware
- [ ] Role ve Permission CRUD
- [ ] UserBirimRole yönetimi

### Faz 3 (Core APIs)
- [ ] User CRUD endpoints
- [ ] Birim CRUD endpoints
- [ ] Role CRUD endpoints
- [ ] Audit log endpoints

### Faz 4 (Duyuru & Uyarı Sistemi)
- [x] Announcement Entities (Duyuru, Hedef, Okundu Bilgisi)
- [x] Announcement Service & Controller
- [x] Target Audience Logic (Birim, Rol, Kullanıcı)
- [x] Frontend Yönetim Paneli

### Faz 5 (Deployment)
- [ ] Unit tests
- [ ] Integration tests
- [ ] Docker deployment
- [ ] CI/CD pipeline

## 📚 Referanslar

- **[TECHNICAL_DESIGN.md](../../TECHNICAL_DESIGN.md)** - Mimari tasarım detayları
- **[ERD.md](../../ERD.md)** - Database schema ve SQL scriptleri
- **[SECURITY_ANALYSIS_REPORT.md](../../SECURITY_ANALYSIS_REPORT.md)** - OWASP güvenlik analizi
- **[IMPLEMENTATION_ROADMAP.md](../../IMPLEMENTATION_ROADMAP.md)** - Kod örnekleri ile implementasyon planı

---

**Son Güncelleme:** 2025-11-25
**Durum:** 🚧 Geliştirme Aşamasında (Proje yapısı oluşturuldu)
