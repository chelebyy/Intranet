# Teknik Tasarım Dokümanı - Kurumsal İntranet Web Portalı

Bu doküman, **Kurumsal İntranet Web Portalı** projesinin teknik mimarisini, güvenlik önlemlerini, kurulum adımlarını ve performans hedeflerini detaylandırır.

---

## 1. Sistem Mimarisi (System Architecture)

### 1.1. Backend Mimarisi

**Teknoloji:** ASP.NET Core Web API (.NET 9)
**Mimari Deseni:** Layered Architecture (Katmanlı Mimari)

#### Katman Yapısı

IntranetPortal.sln
│
├── IntranetPortal.API              # Presentation Layer
│   ├── Controllers/                # API Endpoints
│   │   ├── AuthController.cs
│   │   ├── UsersController.cs
│   │   ├── RolesController.cs
│   │   ├── BirimlerController.cs
│   │   ├── MaintenanceController.cs
│   │   ├── BackupController.cs
│   │   └── IPRestrictionsController.cs
│   ├── Middleware/                 # Custom Middleware
│   │   ├── IPWhitelistMiddleware.cs
│   │   ├── RateLimitingMiddleware.cs
│   │   └── ExceptionHandlingMiddleware.cs
│   ├── Filters/                    # Authorization Attributes
│   └── Program.cs                  # App Configuration
│
├── IntranetPortal.Application      # Business Logic Layer
│   ├── Services/                   # Business Services
│   │   ├── MaintenanceService.cs
│   │   ├── BackupService.cs
│   │   └── ...
│   ├── DTOs/                       # Data Transfer Objects
│   ├── Interfaces/                 # Service Contracts
│   └── Validators/                 # FluentValidation Rules
│
├── IntranetPortal.Domain           # Domain Layer
│   ├── Entities/                   # Database Models
│   ├── Enums/                      # Enumeration Types
│   └── Constants/                  # System Constants
│
└── IntranetPortal.Infrastructure   # Data Access Layer
    ├── Data/                       # DbContext
    ├── Repositories/               # Repository Pattern
    ├── Migrations/                 # EF Core Migrations
    └── Configurations/             # Entity Configurations
```

#### Temel Bileşenler

| Bileşen | Sorumluluk |
|---------|-----------|
| **Controllers** | HTTP isteklerini karşılama, routing |
| **Services** | İş mantığı ve validasyon |
| **Repositories** | Veritabanı CRUD işlemleri |
| **Middleware** | IP kontrolü, exception handling, logging |
| **JWT Authentication** | Token üretimi ve doğrulama |

### 1.2. Frontend Mimarisi

**Framework:** React 19 + TypeScript
**Build Tool:** Vite
**Mimari Deseni:** Feature-Based Structure

#### Dizin Yapısı

```
intranet-frontend/
│
├── src/
│   ├── features/                   # Birim modülleri
│   │   ├── auth/                   # Login, Logout
│   │   ├── admin/                  # Admin Dashboard
│   │   │   ├── maintenance/        # Bakım & Yedekleme
│   │   │   ├── logs/               # Audit Logs
│   │   │   └── roles/              # Rol Yönetimi
│   │   ├── hr/                     # İnsan Kaynakları (Personel)
│   │   ├── it/                     # Bilgi İşlem (Envanter)
│   │   ├── genelButce/             # Genel Bütçe
│   │   └── test-unit/              # Test Birimi
│   │
│   ├── shared/                     # Ortak bileşenler
│   │   ├── components/             # UI Components
│   │   ├── layouts/                # Layout Components
│   │   ├── hooks/                  # Custom Hooks
│   │   └── utils/                  # Helper Functions
│   │
│   ├── api/                        # API Client (Axios)
│   ├── store/                      # State Management (Zustand)
│   ├── types/                      # TypeScript Types
│   └── App.tsx                     # Root Component
│
└── public/                         # Static Assets
```

#### Önemli Kütüphaneler

- **React Router:** Dinamik sayfa yönlendirmesi
- **Zustand:** Global state (auth, selected birim)
- **React Query:** Server state yönetimi ve caching
- **Axios:** HTTP client
- **Zod + React Hook Form:** Form validasyonu

### 1.3. Veritabanı Mimarisi

**DBMS:** PostgreSQL 16
**ORM:** Entity Framework Core 9.x
**Migration Stratejisi:** Code-First

#### Performans Optimizasyonları

- **Indexing:** Primary keys, foreign keys ve sık sorgulanan alanlarda
- **Partitioning:** `AuditLog` tablosu aylık partition (Opsiyonel)
- **Connection Pooling:** pgBouncer veya Npgsql built-in pooling

### 1.4. İletişim Protokolü

**Backend ↔ Frontend:**
- **Protokol:** HTTPS (TLS 1.2+)
- **Veri Formatı:** JSON
- **Authentication:** JWT Bearer Token
- **Header Örneği:**
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
  ```

---

## 2. Güvenlik Önlemleri (Security)

### 2.1. Kimlik Doğrulama (Authentication)

#### JWT Token Yapısı

**Access Token:**
- **Algoritma:** HMAC-SHA256
- **Payload İçeriği:**
  ```json
  {
    "userId": 123,
    "sicil": "12345",
    "roleId": 2,
    "roleName": "BirimAdmin",
    "birimId": 101,
    "exp": 1735689600
  }
  ```
- **Süre:** 8 saat (configurable)

**Refresh Token (Opsiyonel):**
- Veritabanında saklanır
- 30 gün geçerli
- Token yenileme endpoint'i: `POST /api/auth/refresh`

#### Login Akışı

```
1. Kullanıcı → POST /api/auth/login {sicil, password}
2. Backend → IP Kontrolü (Middleware)
3. Backend → Şifre doğrulama (BCrypt)
4. Backend → JWT Token üretimi
5. Backend → Token'ı HttpOnly Cookie ile gönder + Response {user, birimleri}
6. Frontend → Cookie otomatik saklanır (HttpOnly, Secure, SameSite=Strict)
7. Frontend → Birim seçim ekranını göster
```

**⚠️ Güvenlik Notu:** JWT token'ı localStorage'a kaydetmek XSS saldırılarına karşı savunmasızdır. HttpOnly Cookie kullanımı zorunludur (SECURITY_ANALYSIS_REPORT.md Bulgu #2).

### 2.2. Yetkilendirme (Authorization) - RBAC

#### Permission Kontrolü

**Custom Attribute Örneği:**
```csharp
[HasPermission("user.create")]
public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
{
    // Implementation
}
```

**Permission Service (Cached):**
1. `[HasPermission]` attribute isteği durdurur.
2. `PermissionAuthorizationFilter` devreye girer.
3. `IPermissionService`, kullanıcının rolü için izinleri kontrol eder.
4. İzinler `IMemoryCache` üzerinde (varsayılan 1 saat) saklanır.
5. Veritabanı sorgusu: `SELECT Permission FROM RolePermission WHERE RoleId = X`

**Middleware İşleyişi:**
1. Token'dan `userId` ve `birimId` çekilir
2. `UserBirimRole` tablosundan kullanıcının rolü bulunur
3. `RolePermission` tablosundan rol yetkileri çekilir
4. İstenen yetki listede varsa erişim verilir, yoksa `403 Forbidden`

### 2.3. Veri Güvenliği

#### Şifre Hashing

**Algoritma:** BCrypt (Work Factor: 12)
```csharp
var hashedPassword = BCrypt.Net.BCrypt.HashPassword(plainPassword, 12);
var isValid = BCrypt.Net.BCrypt.Verify(plainPassword, hashedPassword);
```

#### Hassas Veri Şifreleme (AES-256)

**PostgreSQL pgcrypto Extension:**
```sql
-- Şifreleme
INSERT INTO User (TCKimlikNo_Encrypted)
VALUES (pgp_sym_encrypt('12345678901', 'encryption_key'));

-- Şifre çözme
SELECT pgp_sym_decrypt(TCKimlikNo_Encrypted, 'encryption_key')
FROM User WHERE UserID = 1;
```

**C# AES Şifreleme (Alternatif):**
```csharp
using System.Security.Cryptography;

public string Encrypt(string plainText, byte[] key, byte[] iv)
{
    using (Aes aes = Aes.Create())
    {
        aes.Key = key;
        aes.IV = iv;
        // Şifreleme logic
    }
}
```

#### HTTPS/TLS Yapılandırması

- **Geliştirme:** Self-signed sertifika (dotnet dev-certs https)
- **Üretim:** Kurumsal CA sertifikası veya Let's Encrypt (lokal ağda gerekli değil ama önerilir)
- **IIS Binding:** Port 443, TLS 1.2 minimum

### 2.4. Ağ Güvenliği

#### IP Whitelist Middleware

**appsettings.json:**
```json
{
  "SecuritySettings": {
    "AllowedIPRanges": [
      "192.168.1.0/24",
      "10.0.0.0/16",
      "172.16.0.100"
    ]
  }
}
```

**Middleware Implementasyonu:**
```csharp
public class IPWhitelistMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IAuditLogService _auditLogService;
    private readonly IConfiguration _configuration;

    public IPWhitelistMiddleware(RequestDelegate next, IAuditLogService auditLogService, IConfiguration configuration)
    {
        _next = next;
        _auditLogService = auditLogService;
        _configuration = configuration;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var clientIP = GetClientIP(context);

        if (!IsIPAllowed(clientIP))
        {
            // Audit log kaydet
            await _auditLogService.LogAsync(new AuditLog
            {
                Action = "IP_BLOCKED",
                IPAddress = clientIP.ToString(),
                Details = new { RequestPath = context.Request.Path }
            });

            context.Response.StatusCode = 403;
            await context.Response.WriteAsJsonAsync(new
            {
                success = false,
                code = "IP_BLOCKED",
                message = "Bu IP adresinden erişim izni yok"
            });
            return;
        }

        await _next(context);
    }

    private IPAddress GetClientIP(HttpContext context)
    {
        // Reverse proxy arkasında gerçek IP'yi al (X-Real-IP header)
        if (context.Request.Headers.ContainsKey("X-Real-IP"))
        {
            var realIP = context.Request.Headers["X-Real-IP"].ToString();

            // Sadece güvenilir proxy'den gelen X-Real-IP'yi kabul et
            if (IsTrustedProxy(context.Connection.RemoteIpAddress) &&
                IPAddress.TryParse(realIP, out var parsedIP))
            {
                return parsedIP;
            }
        }

        // Fallback: Doğrudan bağlantı IP'si
        return context.Connection.RemoteIpAddress;
    }

    private bool IsTrustedProxy(IPAddress address)
    {
        // Güvenilir proxy IP'leri (nginx, IIS ARR)
        var trustedProxies = _configuration.GetSection("SecuritySettings:TrustedProxies")
            .Get<string[]>() ?? Array.Empty<string>();

        foreach (var proxy in trustedProxies)
        {
            if (IPAddress.TryParse(proxy, out var trustedIP) && address.Equals(trustedIP))
                return true;
        }

        return false;
    }

    private bool IsIPAllowed(IPAddress address)
    {
        // CIDR notation ile IP range kontrolü (IPNetwork2 kütüphanesi kullanılabilir)
        // Örnek implementasyon için SECURITY_ANALYSIS_REPORT.md Bulgu #3'e bakın
        return true; // TODO: Implement
    }
}
```

**⚠️ Güvenlik Notu:** X-Forwarded-For header spoofing'e açıktır. Sadece güvenilir proxy'lerden gelen X-Real-IP header'ı kullanın (SECURITY_ANALYSIS_REPORT.md Bulgu #3).

#### CORS Politikası

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("IntranetPolicy", policy =>
    {
        policy.WithOrigins("https://intranet.kurum.local")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
```

### 2.5. Güvenlik Önlemleri

#### Rate Limiting (Brute-Force Koruması)

#### Rate Limiting Implementation

Projede **Custom Rate Limiting Middleware** kullanılmaktadır (`RateLimitingMiddleware.cs`).

**Konfigürasyon (`appsettings.json`):**
```json
"SecuritySettings": {
  "RateLimiting": {
    "Enabled": true,
    "MaxRequests": 100,
    "WindowSeconds": 60,
    "LoginMaxRequests": 5,
    "LoginWindowSeconds": 60
  }
}
```

**Özellikler:**
*   Genel istek sınırlaması (Varsayılan: 60 saniyede 100 istek)
*   Login endpoint'i için özel sınırlama (Varsayılan: 60 saniyede 5 deneme)
*   IP bazlı takip (In-Memory Dictionary)
*   Limit aşımında `429 Too Many Requests` yanıtı döner.

#### Input Validation

- **FluentValidation:** Tüm DTO'lar için validasyon kuralları
- **SQL Injection Koruması:** Parameterized queries (EF Core otomatik sağlar)
- **XSS Koruması:** Frontend'de sanitization (DOMPurify)

### 2.6. Bakım Modu (Maintenance Mode)

### 2.6. Bakım Modu (Maintenance Mode)

Bakım modu, veritabanı bakımı veya sistem güncellemeleri sırasında sistemi kısıtlamak için kullanılır.

**Mevcut Durum:**
*   `MaintenanceController` üzerinden bakım modu açılıp kapatılabilir (`/api/admin/maintenance/mode`).
*   Bakım işlemleri (Vacuum, Backup, Reindex) `MaintenanceService` tarafından yönetilir.
*   Frontend, bakım modu durumuna göre kullanıcıyı bilgilendirebilir veya işlemleri kısıtlayabilir.
*   *Not: Global bir MaintenanceModeMiddleware şu an aktif değildir, bakım modu uygulama seviyesinde yönetilmektedir.*

---

## 3. Windows Kurulum ve Deployment

### 3.1. Geliştirme Ortamı Kurulumu

#### Gerekli Yazılımlar

1. **.NET 9 SDK:** [Download](https://dotnet.microsoft.com/download/dotnet/9.0)
2. **PostgreSQL 16:** [Download](https://www.postgresql.org/download/windows/)
3. **Node.js 20 LTS:** [Download](https://nodejs.org/)
4. **Git:** [Download](https://git-scm.com/download/win)
5. **Visual Studio 2022** veya **VS Code**

#### Adım Adım Kurulum

```powershell
# 1. PostgreSQL Kurulumu
# - Installer'ı çalıştır
# - Port: 5432 (default)
# - Superuser password belirle

# 2. Veritabanı Oluşturma
psql -U postgres
CREATE DATABASE IntranetDB;
CREATE USER intranet_user WITH ENCRYPTED PASSWORD 'SecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE IntranetDB TO intranet_user;
\q

# 3. Backend Projesi Klonlama ve Başlatma
git clone <repo-url> IntranetPortal
cd IntranetPortal
dotnet restore
dotnet ef database update  # Migration uygulama
dotnet run --project IntranetPortal.API

# 4. Frontend Projesi Başlatma
cd intranet-frontend
npm install
npm run dev
```

### 3.2. Üretim Ortamı Kurulumu (IIS)

#### IIS Etkinleştirme (Windows Server 2022)

```powershell
# PowerShell (Admin)
Install-WindowsFeature -Name Web-Server -IncludeManagementTools
Install-WindowsFeature -Name Web-Asp-Net45
```

#### .NET 9 Hosting Bundle Kurulumu

1. [ASP.NET Core Runtime & Hosting Bundle](https://dotnet.microsoft.com/download/dotnet/9.0) indir
2. Installer'ı çalıştır
3. IIS'i yeniden başlat: `iisreset`

#### Backend Deployment

```powershell
# 1. Projeyi publish et
cd IntranetPortal
dotnet publish -c Release -o C:\inetpub\IntranetAPI

# 2. IIS'te yeni site oluştur
# - IIS Manager'ı aç
# - Sites → Add Website
#   - Site name: IntranetAPI
#   - Physical path: C:\inetpub\IntranetAPI
#   - Binding: https, port 443, hostname: api.intranet.local
#   - SSL Certificate: Seç veya oluştur

# 3. Application Pool ayarları
# - .NET CLR Version: No Managed Code
# - Identity: ApplicationPoolIdentity
```

#### Frontend Deployment

```powershell
# 1. Frontend build
cd intranet-frontend
npm run build  # Çıktı: dist/

# 2. IIS'te yeni site oluştur
# - Physical path: C:\inetpub\IntranetFrontend
# - dist/ klasörünü buraya kopyala
# - Binding: https, port 443, hostname: intranet.kurum.local

# 3. web.config ekle (React Router için)
```

**web.config (Frontend için SPA Routing):**
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

#### PostgreSQL Windows Service

```powershell
# PostgreSQL servisinin otomatik başlaması
sc config postgresql-x64-16 start= auto
```

### 3.3. appsettings.json Konfigürasyonu

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=IntranetDB;Username=intranet_user;Password=SecurePassword123!"
  },
  "JwtSettings": {
    "SecretKey": "Your-256-Bit-Secret-Key-Here-Min-32-Chars!",
    "Issuer": "IntranetPortal",
    "Audience": "IntranetUsers",
    "ExpiryMinutes": 480
  },
  "SecuritySettings": {
    "AllowedIPRanges": ["192.168.1.0/24"],
    "EnableIPWhitelist": true,
    "EncryptionKey": "AES-256-Key-32-Bytes-Here!"
  },
  "Serilog": {
    "MinimumLevel": "Information",
    "WriteTo": [
      { "Name": "Console" },
      {
        "Name": "PostgreSQL",
        "Args": {
          "connectionString": "...",
          "tableName": "AuditLog"
        }
      }
    ]
  }
}
```

---

## 4. Performans ve Ölçeklenebilirlik

### 4.1. Performans Hedefleri

| Metrik | Hedef |
|--------|-------|
| Portal açılış süresi | ≤ 2 saniye |
| API yanıt süresi (ortalama) | ≤ 200ms |
| Eşzamanlı kullanıcı | 100-200 |
| Veritabanı sorgu süresi | ≤ 100ms |

### 4.2. Optimizasyon Teknikleri

#### Backend

- **Asenkron Programlama:** Tüm I/O işlemlerinde `async/await`
- **Response Caching:**
  ```csharp
  [ResponseCache(Duration = 300)] // 5 dakika
  public IActionResult GetBirimler()
  ```
- **Memory Cache:**
  ```csharp
  _memoryCache.GetOrCreate("roles", entry =>
  {
      entry.SlidingExpiration = TimeSpan.FromHours(1);
      return _context.Roles.ToList();
  });
  ```
- **Database Indexing:**
  ```sql
  CREATE INDEX idx_user_email ON "User"("Email");
  CREATE INDEX idx_ubr_user_birim ON "UserBirimRole"("UserID", "BirimID");
  ```

#### Frontend

- **Code Splitting:**
  ```tsx
  const HRModule = lazy(() => import('./features/hr/HRModule'));
  const ITModule = lazy(() => import('./features/it/ITModule'));
  ```
- **Image Optimization:** WebP formatı, lazy loading
- **Memoization:**
  ```tsx
  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
  ```

### 4.3. Monitoring ve Logging

#### Serilog Yapılandırması

```csharp
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.PostgreSQL(connectionString, "AuditLog")
    .CreateLogger();
```

#### Audit Log Yapısı

Tüm önemli işlemler loglanır:
- Kullanıcı giriş/çıkış
- Veri ekleme/güncelleme/silme
- Rol ve yetki değişiklikleri
- Başarısız login denemeleri

---

## 5. Docker Kullanımı (Opsiyonel)

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: IntranetDB
      POSTGRES_USER: intranet_user
      POSTGRES_PASSWORD: SecurePassword123!
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./IntranetPortal
    ports:
      - "5000:8080"
    environment:
      ConnectionStrings__DefaultConnection: "Host=postgres;Port=5432;Database=IntranetDB;Username=intranet_user;Password=SecurePassword123!"
    depends_on:
      - postgres

  frontend:
    build: ./intranet-frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

**Kullanım:**
```powershell
docker-compose up -d
```

---

## 6. Sistem Akış Diyagramları

### 6.1. Login ve Birim Seçim Akışı

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant M as IP Middleware
    participant A as Auth Service
    participant DB as Database

    U->>F: Sicil + Parola gir
    F->>M: POST /api/auth/login
    M->>M: IP Kontrolü
    alt IP İzinsiz
        M-->>F: 403 Forbidden
    else IP İzinli
        M->>A: Kimlik doğrulama
        A->>DB: Kullanıcı sorgula
        DB-->>A: User + Birimler
        A->>A: Şifre doğrula (BCrypt)
        alt Şifre Yanlış
            A-->>F: 401 Unauthorized
        else Şifre Doğru
            A->>A: JWT Token üret
            A-->>F: {token, user, birimleri}
            F->>F: Token kaydet
            F->>U: Birim seçim ekranı göster
        end
    end
```

### 6.2. RBAC Yetki Kontrolü

```mermaid
flowchart TD
    A[API İsteği Gelir] --> B{Token Var mı?}
    B -->|Hayır| C[401 Unauthorized]
    B -->|Evet| D[Token Doğrula]
    D --> E{Token Geçerli mi?}
    E -->|Hayır| C
    E -->|Evet| F[UserID + BirimID Çek]
    F --> G[UserBirimRole'den Role Bul]
    G --> H[RolePermission'dan Yetkileri Çek]
    H --> I{Gerekli Yetki Var mı?}
    I -->|Hayır| J[403 Forbidden]
    I -->|Evet| K[İşlemi Gerçekleştir]
    K --> L[AuditLog Kaydet]
    L --> M[200 OK Response]
```

---

Bu doküman, sistemin güvenli, performanslı ve Windows ortamında sorunsuz çalışacak şekilde tasarlanmasını sağlar.