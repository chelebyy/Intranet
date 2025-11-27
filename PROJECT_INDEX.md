# Kurumsal İntranet Web Portalı - Proje İndeksi

**Proje Adı:** Kurumsal İntranet Web Portalı
**Versiyon:** 1.0
**Tarih:** 2025
**Durum:** Dokümantasyon Tamamlandı - Geliştirme Başlamadı

---

## 📋 İçindekiler (Table of Contents)

- [Proje Özeti](#proje-özeti)
- [Hızlı Başlangıç](#hızlı-başlangıç)
- [Dokümantasyon Haritası](#dokümantasyon-haritası)
- [Mimari Genel Bakış](#mimari-genel-bakış)
- [Geliştirme Yol Haritası](#geliştirme-yol-haritası)
- [Teknik Detaylar](#teknik-detaylar)
- [Güvenlik ve Yetkilendirme](#güvenlik-ve-yetkilendirme)
- [Deployment Seçenekleri](#deployment-seçenekleri)
- [API Referansı](#api-referansı)
- [Veritabanı Şeması](#veritabanı-şeması)
- [Modüler Yapı](#modüler-yapı)
- [İlgili Kişiler ve Kaynaklar](#ilgili-kişiler-ve-kaynaklar)

---

## 🎯 Proje Özeti

**Kurumsal İntranet Web Portalı**, kurum içi iletişim, bilgi akışı ve birimler arası koordinasyonu kolaylaştırmak için geliştirilmiş **çok birimli, güvenli ve role dayalı yetkilendirme (RBAC)** yapısına sahip bir web portalıdır.

### Temel Özellikler

- ✅ **Çok Birimli Yapı**: Kullanıcılar birden fazla departmana farklı rollerle atanabilir
- ✅ **RBAC Sistemi**: Rol bazlı erişim kontrolü ile granüler yetkilendirme
- ✅ **IP Whitelist**: CIDR notasyonu destekli IP/IP bloğu bazlı erişim kısıtlama
- ✅ **Güçlü Güvenlik**: AES-256 şifreleme, BCrypt password hashing, JWT authentication
- ✅ **Audit Logging**: Tüm kritik işlemlerin detaylı kaydı
- ✅ **Modüler Mimari**: Yeni birim/departman eklemeye uygun esnek yapı
- ✅ **Lokal Ağ**: İnternet bağlantısı gerektirmez, sadece local network üzerinde çalışır
- ✅ **Multi-Platform**: Windows 11, Linux Server ve Docker desteği

### Hedef Kullanıcılar

- **Sistem Admin**: Tüm sistemin yönetimi (100-200 kullanıcı)
- **Birim Admin**: Departman seviyesinde yönetim
- **Birim Editörü**: İçerik ekleme ve düzenleme
- **Birim Görüntüleyici**: Standart kullanıcı

### Performans Hedefleri

- 100-200 eşzamanlı kullanıcı
- ≤2 saniye portal yükleme süresi
- ≤1 saniye birim geçiş süresi
- ≤200ms API yanıt süresi

---

## 🚀 Hızlı Başlangıç

### Yeni Geliştiriciler İçin

1. **İlk Okuma Sırası:**
   - [PRD.md](PRD.md) - Proje gereksinimlerini ve kapsamını anlamak için
   - [TECH_STACK.md](TECH_STACK.md) - Kullanılan teknolojileri öğrenmek için
   - [TECHNICAL_DESIGN.md](TECHNICAL_DESIGN.md) - Mimari ve tasarım prensiplerini anlamak için

2. **Veritabanı Şemasını İnceleyin:**
   - [ERD.md](ERD.md) - Tüm tablolar, ilişkiler, SQL şemaları ve örnek sorgular

3. **Geliştirme Başlamadan Önce:**
   - [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) - 6 fazlı geliştirme planını inceleyin
   - [DEVELOPMENT_STEPS.md](DEVELOPMENT_STEPS.md) - İlk kurulum adımlarını takip edin

4. **API ile Çalışacaksanız:**
   - [API_SPECIFICATION.md](API_SPECIFICATION.md) - Tüm endpoint'ler ve request/response formatları

5. **Deployment İçin:**
   - [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Windows 11, Linux veya Docker deployment

### Proje Yöneticileri İçin

1. [PRD.md](PRD.md) - Fonksiyonel ve non-fonksiyonel gereksinimler
2. [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) - 12-16 haftalık geliştirme planı
3. [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Production deployment seçenekleri

### DevOps/Sistem Yöneticileri İçin

1. [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Deployment konfigürasyonları
2. [WINDOWS_SERVER_DEPLOYMENT.md](WINDOWS_SERVER_DEPLOYMENT.md) - Windows Server detaylı rehber (opsiyonel)
3. [TECH_STACK.md](TECH_STACK.md) - Altyapı gereksinimleri

---

## 📚 Dokümantasyon Haritası

### Kategori 1: Proje Tanımı ve Gereksinimler

| Doküman | Açıklama | Hedef Kitle | Boyut |
|---------|----------|-------------|-------|
| [PRD.md](PRD.md) | Product Requirements Document - Tüm fonksiyonel/non-fonksiyonel gereksinimler | Tüm Ekip | ~7.8 KB |
| [CLAUDE.md](CLAUDE.md) | Claude Code için geliştirici rehberi | AI Assistants | ~15.5 KB |

### Kategori 2: Teknik Mimari ve Tasarım

| Doküman | Açıklama | Hedef Kitle | Boyut |
|---------|----------|-------------|-------|
| [TECH_STACK.md](TECH_STACK.md) | Teknoloji yığını - Tüm paketler, versiyonlar ve araçlar | Backend/Frontend Dev | ~8.6 KB |
| [TECHNICAL_DESIGN.md](TECHNICAL_DESIGN.md) | Katmanlı mimari, güvenlik tasarımı, kod örnekleri | Backend Developers | ~16.8 KB |
| [ERD.md](ERD.md) | Entity Relationship Diagram - SQL şemaları, indexler, örnek sorgular | Database/Backend Dev | ~14.6 KB |
| [MODULAR_STRUCTURE.md](MODULAR_STRUCTURE.md) | Modüler yapı felsefesi ve yeni birim ekleme rehberi | Full Stack Dev | ~3.8 KB |

### Kategori 3: Geliştirme ve İmplementasyon

| Doküman | Açıklama | Hedef Kitle | Boyut |
|---------|----------|-------------|-------|
| [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) | 6 fazlı geliştirme yol haritası (12-16 hafta) - Production-ready kod örnekleri | Full Stack Dev | ~71.6 KB |
| [DEVELOPMENT_STEPS.md](DEVELOPMENT_STEPS.md) | İlk adımlar - Backend/Frontend kurulumu, Admin Dashboard | Full Stack Dev | ~3.3 KB |
| [API_SPECIFICATION.md](API_SPECIFICATION.md) | REST API dokümantasyonu - Tüm endpoint'ler, request/response formatları | Frontend/Backend Dev | ~17 KB |
| [FILE_MANAGEMENT.md](FILE_MANAGEMENT.md) | Dosya yükleme ve Excel export sistemi - Kod örnekleri ve DB şeması | Backend Dev | ~16 KB |

### Kategori 4: Deployment ve Operasyon

| Doküman | Açıklama | Hedef Kitle | Boyut |
|---------|----------|-------------|-------|
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Multi-platform deployment - Windows 11, Linux, Docker | DevOps/SysAdmin | ~22.6 KB |
| [WINDOWS_SERVER_DEPLOYMENT.md](WINDOWS_SERVER_DEPLOYMENT.md) | Windows Server 2019/2022 detaylı deployment rehberi (opsiyonel) | Windows SysAdmin | ~17.9 KB |

### Kategori 5: Proje Yönetimi

| Doküman | Açıklama | Hedef Kitle | Boyut |
|---------|----------|-------------|-------|
| [PROJECT_INDEX.md](PROJECT_INDEX.md) | Bu doküman - Tüm dokümantasyonun merkezi indeksi | Tüm Ekip | ~Current |

### Kategori 6: Troubleshooting ve Error Resolution ⚠️

| Doküman | Açıklama | Hedef Kitle | Öncelik |
|---------|----------|-------------|---------|
| [ERRORS.md](ERRORS.md) | **Build hatası çözümleri, duplicate entity fix, EF Core scaffold prevention** | Full Stack Dev, DevOps | 🔴 KRİTİK |

**🚨 Önemli:** Build hatası aldığınızda **ÖNCE** `ERRORS.md` dosyasını kontrol edin!

---

## 🏗️ Mimari Genel Bakış

### Backend Mimarisi (.NET 9)

```
┌─────────────────────────────────────────────────┐
│           ASP.NET Core Web API (.NET 9)         │
├─────────────────────────────────────────────────┤
│  Presentation Layer (API Controllers)           │
│  ├─ AuthController                              │
│  ├─ UserController                              │
│  ├─ BirimController                             │
│  └─ [Birim-Specific Controllers]                │
├─────────────────────────────────────────────────┤
│  Application Layer (Services, DTOs)             │
│  ├─ AuthService (JWT, Login)                    │
│  ├─ UserService (CRUD, Role Assignment)         │
│  ├─ BirimService (Multi-unit Management)        │
│  └─ [Business Logic Services]                   │
├─────────────────────────────────────────────────┤
│  Domain Layer (Entities, Interfaces)            │
│  ├─ User, Birim, Role, Permission               │
│  ├─ UserBirimRole (Many-to-Many)                │
│  └─ AuditLog                                    │
├─────────────────────────────────────────────────┤
│  Infrastructure Layer (EF Core, PostgreSQL)     │
│  ├─ AppDbContext                                │
│  ├─ Migrations                                  │
│  └─ Repository Pattern                          │
├─────────────────────────────────────────────────┤
│  Middleware & Security                          │
│  ├─ IPWhitelistMiddleware (CIDR support)        │
│  ├─ JwtAuthenticationMiddleware                 │
│  ├─ RateLimitingMiddleware                      │
│  └─ AuditLoggingMiddleware                      │
└─────────────────────────────────────────────────┘
```

**Detaylar:** [TECHNICAL_DESIGN.md - Backend Mimarisi](TECHNICAL_DESIGN.md#2-backend-mimarisi)

### Frontend Mimarisi (React + Vite)

```
┌─────────────────────────────────────────────────┐
│           React 18 + TypeScript + Vite          │
├─────────────────────────────────────────────────┤
│  Pages (Route-based)                            │
│  ├─ /login - Login sayfası                      │
│  ├─ /birim-select - Birim seçim paneli          │
│  ├─ /admin/* - Admin dashboard                  │
│  └─ /[birimSlug]/* - Birim özel sayfalar        │
├─────────────────────────────────────────────────┤
│  Features (Birim-based modules)                 │
│  ├─ features/auth (Login, BirimSelect)          │
│  ├─ features/admin (User, Role, Birim CRUD)     │
│  ├─ features/ik (Personel, Izin)                │
│  └─ features/bilgi-islem (Arıza, Envanter)      │
├─────────────────────────────────────────────────┤
│  Shared Components & Utilities                  │
│  ├─ components/ui (Tailwind + shadcn/ui)        │
│  ├─ context/AuthContext (JWT, User state)       │
│  ├─ hooks/usePermission (RBAC check)            │
│  └─ services/api (Axios interceptors)           │
└─────────────────────────────────────────────────┘
```

**Detaylar:** [TECHNICAL_DESIGN.md - Frontend Mimarisi](TECHNICAL_DESIGN.md#3-frontend-mimarisi)

### Veritabanı Mimarisi (PostgreSQL 16)

**8 Core Tabloları:**

- `User` - Kullanıcı bilgileri (BCrypt hash)
- `Birim` - Departman/Birim tanımları
- `Role` - Roller (Sistem Admin, Birim Admin, Editör, Görüntüleyici)
- `Permission` - Granüler yetkiler (create, read, update, delete, approve)
- `UserBirimRole` - Many-to-Many ilişki tablosu (User ↔ Birim ↔ Role)
- `RolePermission` - Role ↔ Permission eşleştirme
- `AuditLog` - Tüm kritik işlemlerin kayıtları
- `IPWhitelist` - İzin verilen IP/IP blokları (CIDR)

**Ek Birim Tabloları (Örnekler):**
- `IK_Personel`, `IK_IzinTalep` (İnsan Kaynakları)
- `IT_ArizaKayit`, `IT_Envanter` (Bilgi İşlem)

**Detaylar:** [ERD.md](ERD.md)

---

## 🛤️ Geliştirme Yol Haritası

Proje **6 faz** ve **12-16 hafta** süreyle tamamlanacak şekilde planlanmıştır.

### Faz Özeti

| Faz | Süre | Açıklama | Deliverables |
|-----|------|----------|--------------|
| **Faz 0** | Hafta 1-2 | Proje kurulumu | .NET 9 solution, PostgreSQL, React/Vite scaffold |
| **Faz 1** | Hafta 2-3 | Authentication & Core | JWT, Login, IP Whitelist, Database migrations |
| **Faz 2** | Hafta 4-6 | RBAC & Admin Panel | `[HasPermission]` attribute, User/Role/Birim CRUD |
| **Faz 3** | Hafta 7-8 | Multi-Unit Support | Birim selection screen, unit switching |
| **Faz 4** | Hafta 9-10 | First Module (HR) | Personel management, leave requests |
| **Faz 5** | Hafta 11-13 | Second Module (IT) + Docker | Ticket system, inventory, Dockerfile |
| **Faz 6** | Hafta 14-16 | Testing & Optimization | Unit tests, load tests, security audit |

**Detaylı Plan:** [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)

### Geliştirme Sırası (Development Order)

1. **Admin Dashboard** önce tamamlanmalı (User, Role, Birim CRUD)
2. **İK Modülü** ilk birim modülü olarak geliştirilmeli (tüm personel verisi burada)
3. **IT Modülü** ikinci olarak geliştirilmeli (teknik destek talepleri)
4. **Diğer Birimler** ihtiyaca göre eklenir

**Detaylar:** [DEVELOPMENT_STEPS.md](DEVELOPMENT_STEPS.md)

---

## 🔧 Teknik Detaylar

### Teknoloji Yığını (Tech Stack)

#### Backend
- **Framework:** ASP.NET Core Web API
- **Language:** C# 12
- **Runtime:** .NET 9
- **Database ORM:** Entity Framework Core 9.x
- **Database:** PostgreSQL 16

#### Frontend
- **Framework:** React 18
- **Language:** TypeScript 5.x
- **Build Tool:** Vite 5.x
- **UI Framework:** Tailwind CSS 3.x + shadcn/ui
- **State Management:** Context API + React Query

#### Güvenlik
- **Authentication:** JWT (HMAC-SHA256)
- **Password Hashing:** BCrypt.Net-Next (work factor 12)
- **Data Encryption:** AES-256 (PostgreSQL pgcrypto)
- **IP Filtering:** CIDR notation support

**Tüm Paketler ve Versiyonlar:** [TECH_STACK.md](TECH_STACK.md)

### Kod Örnekleri

**JWT Token Generation:**
```csharp
public class JwtService : IJwtService
{
    public string GenerateToken(User user, int birimId, string roleName)
    {
        var claims = new[]
        {
            new Claim("userId", user.UserID.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("birimId", birimId.ToString()),
            new Claim(ClaimTypes.Role, roleName)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]!)
        );
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["JwtSettings:Issuer"],
            audience: _configuration["JwtSettings:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

**IP Whitelist Middleware:**
```csharp
public class IPWhitelistMiddleware
{
    private readonly RequestDelegate _next;

    public async Task InvokeAsync(HttpContext context)
    {
        var remoteIP = context.Connection.RemoteIpAddress;

        if (!IsIPAllowed(remoteIP))
        {
            context.Response.StatusCode = 403;
            await context.Response.WriteAsync("Forbidden: IP not whitelisted");
            return;
        }

        await _next(context);
    }

    private bool IsIPAllowed(IPAddress ipAddress)
    {
        // CIDR notation check implementation
        // See TECHNICAL_DESIGN.md for full code
    }
}
```

**Permission-based Authorization:**
```csharp
[HasPermission("user.create")]
public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
{
    // Implementation
}
```

**Daha Fazla Örnek:** [IMPLEMENTATION_ROADMAP.md - Kod Örnekleri](IMPLEMENTATION_ROADMAP.md)

---

## 🔐 Güvenlik ve Yetkilendirme

### RBAC (Role-Based Access Control) Modeli

**4 Temel Rol:**
1. **Sistem Admin** - Tüm sistem yönetimi
2. **Birim Admin** - Departman seviyesi yönetim
3. **Birim Editörü** - İçerik ekleme/düzenleme
4. **Birim Görüntüleyici** - Sadece okuma

**Permission Yapısı:**
```
{resource}.{action}

Örnekler:
- user.create
- user.read
- user.update
- user.delete
- birim.admin
- ik.personel.approve
```

**Multi-Unit Assignment:**
- Kullanıcı birden fazla birime atanabilir
- Her birimde farklı rol olabilir
- Login sonrası birim seçim ekranı gösterilir

**Detaylar:** [PRD.md - RBAC Modeli](PRD.md#8-erd-ve-rbac-modeli)

### Güvenlik Katmanları

1. **Network Layer:**
   - IP Whitelist (CIDR notation) with X-Real-IP support
   - Local network only (no internet)
   - Trusted proxy validation

2. **Application Layer:**
   - JWT authentication with **HttpOnly Cookie** (XSS protection)
   - Rate limiting (5 login attempts/min, 100 requests/min)
   - Brute-force protection
   - Security Headers (CSP, HSTS, X-Frame-Options)
   - CSRF protection

3. **Data Layer:**
   - BCrypt password hashing (work factor 12)
   - AES-256 encryption for sensitive data
   - Prepared statements (SQL injection prevention)
   - Input validation (FluentValidation)

4. **Audit & Monitoring:**
   - Comprehensive audit logging (JSONB format)
   - User action tracking
   - Failed login attempts logging
   - IP blocking events
   - Sensitive data masking

### 📋 Güvenlik Dokümanları

| Doküman | Açıklama | Hedef Kitle |
|---------|----------|-------------|
| **[SECURITY_ANALYSIS_REPORT.md](SECURITY_ANALYSIS_REPORT.md)** | **OWASP Top 10 güvenlik analizi ve implementasyon kontrol listesi** | **Tüm Geliştiriciler** |
| [TECHNICAL_DESIGN.md - Bölüm 2](TECHNICAL_DESIGN.md#2-güvenlik-önlemleri-security) | Güvenlik implementasyon detayları ve kod örnekleri | Backend Developers |
| [ERD.md - Bölüm 5.4](ERD.md#54-permission-tablosu) | Permission tanımları ve RBAC şeması | Backend/Database |

**⚠️ ÖNEMLİ:** Kodlamaya başlamadan önce **SECURITY_ANALYSIS_REPORT.md** dosyasını mutlaka okuyun. Raporda 3 yüksek öncelikli güvenlik bulgusu ve implementasyon kontrol listeleri bulunmaktadır.

**Detaylar:** [TECHNICAL_DESIGN.md - Güvenlik](TECHNICAL_DESIGN.md#4-güvenlik-ve-veri-koruma)

---

## 🚢 Deployment Seçenekleri

### Seçenek 1: Windows 11 + IIS

**Gereksinimler:**
- Windows 11 Pro/Enterprise
- IIS 10
- .NET 9 Runtime
- PostgreSQL 16

**Adımlar:**
1. IIS kurulumu ve yapılandırması
2. .NET 9 Runtime kurulumu
3. PostgreSQL kurulumu ve veritabanı oluşturma
4. Backend publish ve IIS deployment
5. Frontend build ve static hosting

**Detaylar:** [DEPLOYMENT_GUIDE.md - Windows 11](DEPLOYMENT_GUIDE.md#seçenek-1-windows-11--iis)

### Seçenek 2: Linux Server + Nginx

**Gereksinimler:**
- Ubuntu 22.04 LTS / Debian 12
- Nginx
- .NET 9 Runtime
- PostgreSQL 16

**Adımlar:**
1. Server hazırlığı ve paket kurulumları
2. PostgreSQL kurulumu ve konfigürasyonu
3. .NET 9 Runtime kurulumu
4. Backend deployment (systemd service)
5. Frontend deployment (Nginx static hosting)

**Detaylar:** [DEPLOYMENT_GUIDE.md - Linux](DEPLOYMENT_GUIDE.md#seçenek-2-linux-server--nginx)

### Seçenek 3: Docker Compose (Önerilen)

**Gereksinimler:**
- Docker Engine 24+
- Docker Compose v2

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: IntranetDB
      POSTGRES_USER: intranet_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - intranet_network

  backend:
    build:
      context: ./IntranetPortal
      dockerfile: Dockerfile
    ports:
      - "5000:80"
    environment:
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=IntranetDB;Username=intranet_user;Password=${POSTGRES_PASSWORD}
    depends_on:
      - postgres
    networks:
      - intranet_network

  frontend:
    build:
      context: ./intranet-frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    networks:
      - intranet_network

volumes:
  postgres_data:

networks:
  intranet_network:
    driver: bridge
```

**Deployment:**
```bash
docker-compose up -d
```

**Detaylar:** [DEPLOYMENT_GUIDE.md - Docker](DEPLOYMENT_GUIDE.md#seçenek-3-docker-compose-önerilen)

---

## 📡 API Referansı

### Authentication Endpoints

#### POST /api/auth/login
Kullanıcı girişi ve JWT token üretimi.

**Request:**
```json
{
  "email": "ahmet@kurum.local",
  "password": "Sifre123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": 1,
      "adSoyad": "Ahmet Yılmaz",
      "email": "ahmet@kurum.local",
      "unvan": "Yazılım Geliştirici"
    },
    "birimleri": [
      {
        "birimId": 101,
        "birimAdi": "Bilgi İşlem",
        "roleAdi": "BirimAdmin"
      },
      {
        "birimId": 102,
        "birimAdi": "İnsan Kaynakları",
        "roleAdi": "Görüntüleyici"
      }
    ]
  }
}
```

### User Management Endpoints

#### GET /api/users
Tüm kullanıcıları listele (Sistem Admin only)

#### POST /api/users
Yeni kullanıcı oluştur

#### PUT /api/users/{id}
Kullanıcı bilgilerini güncelle

#### DELETE /api/users/{id}
Kullanıcıyı pasife al (soft delete)

### Birim Endpoints

#### GET /api/birimler
Tüm birimleri listele

#### POST /api/birimler
Yeni birim oluştur

#### GET /api/birimler/{id}/users
Birime ait kullanıcıları listele

**Tüm Endpoint'ler:** [API_SPECIFICATION.md](API_SPECIFICATION.md)

---

## 💾 Veritabanı Şeması

### Core Tablolar

#### User Tablosu
```sql
CREATE TABLE "User" (
    "UserID" SERIAL PRIMARY KEY,
    "AdSoyad" VARCHAR(100) NOT NULL,
    "Email" VARCHAR(150) UNIQUE NOT NULL,
    "SifreHash" VARCHAR(255) NOT NULL,
    "Unvan" VARCHAR(100),
    "SonGiris" TIMESTAMP,
    "IsActive" BOOLEAN DEFAULT TRUE,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_email ON "User"("Email");
CREATE INDEX idx_user_active ON "User"("IsActive");
```

#### UserBirimRole Tablosu (Many-to-Many)
```sql
CREATE TABLE "UserBirimRole" (
    "ID" SERIAL PRIMARY KEY,
    "UserID" INTEGER NOT NULL REFERENCES "User"("UserID") ON DELETE CASCADE,
    "BirimID" INTEGER NOT NULL REFERENCES "Birim"("BirimID") ON DELETE CASCADE,
    "RoleID" INTEGER NOT NULL REFERENCES "Role"("RoleID") ON DELETE RESTRICT,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("UserID", "BirimID")
);

CREATE INDEX idx_userbr_user ON "UserBirimRole"("UserID");
CREATE INDEX idx_userbr_birim ON "UserBirimRole"("BirimID");
```

#### AuditLog Tablosu
```sql
CREATE TABLE "AuditLog" (
    "LogID" SERIAL PRIMARY KEY,
    "UserID" INTEGER REFERENCES "User"("UserID"),
    "Action" VARCHAR(100) NOT NULL,
    "Resource" VARCHAR(100) NOT NULL,
    "BirimID" INTEGER REFERENCES "Birim"("BirimID"),
    "Details" JSONB,
    "IPAddress" VARCHAR(45),
    "TarihSaat" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auditlog_user ON "AuditLog"("UserID");
CREATE INDEX idx_auditlog_birim ON "AuditLog"("BirimID");
CREATE INDEX idx_auditlog_action ON "AuditLog"("Action");
CREATE INDEX idx_auditlog_tarih ON "AuditLog"("TarihSaat");
```

**Tüm Şemalar ve Örnek Sorgular:** [ERD.md](ERD.md)

---

## 🧩 Modüler Yapı

### Modülerlik Prensibi

Sistem, her departmanın kendi "modülü" gibi çalışmasına izin verir ancak **ortak kullanıcı havuzu** ve **yetki altyapısı** kullanır.

**Temel Prensipler:**
- ✅ **Ortak Çekirdek (Core):** User, Role, Birim, AuditLog tabloları ortaktır
- ✅ **Birim Verisi (Unit Data):** Her birimin kendi tabloları olabilir (`IK_Personel`, `IT_ArizaKayit`)
- ✅ **Dinamik Menü:** Kullanıcının seçtiği birime göre menü değişir
- ✅ **Lazy Loading:** Frontend'de birim modülleri lazy load ile yüklenir

### Yeni Birim Ekleme Süreci

**Adım 1: Veritabanı**
```sql
-- Birim kaydı oluştur
INSERT INTO "Birim" ("BirimAdi", "Aciklama")
VALUES ('Satın Alma', 'Satın alma süreçleri');

-- Birim tabloları oluştur
CREATE TABLE "SA_Talep" (
    "TalepID" SERIAL PRIMARY KEY,
    "OlusturanUserID" INTEGER REFERENCES "User"("UserID"),
    "UrunAdi" VARCHAR(255),
    "Miktar" INTEGER,
    "Durum" VARCHAR(50),
    "Tarih" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Adım 2: RBAC**
```sql
-- Yeni yetkiler ekle
INSERT INTO "Permission" ("Action", "Resource") VALUES
('create', 'sa.talep'),
('approve', 'sa.talep'),
('view', 'sa.report');

-- Roller ile eşleştir
INSERT INTO "RolePermission" ("RoleID", "PermissionID") VALUES
(2, 501), -- Birim Admin -> sa.talep.create
(2, 502); -- Birim Admin -> sa.talep.approve
```

**Adım 3: Backend**
```csharp
// Controller oluştur
[Route("api/satin-alma")]
[ApiController]
public class SatinAlmaController : ControllerBase
{
    [HttpPost("talepler")]
    [HasPermission("sa.talep.create")]
    public async Task<IActionResult> CreateTalep([FromBody] TalepDto dto)
    {
        // Implementation
    }
}
```

**Adım 4: Frontend**
```typescript
// Route ekle
{
  path: '/satin-alma',
  lazy: () => import('./features/satin-alma/SatinAlmaLayout'),
  children: [
    { path: 'talepler', component: TaleplerPage }
  ]
}
```

**Detaylı Rehber:** [MODULAR_STRUCTURE.md](MODULAR_STRUCTURE.md)

---

## 👥 İlgili Kişiler ve Kaynaklar

### Proje Rolleri

| Rol | Sorumluluk |
|-----|------------|
| Product Manager | Gereksinimlerin tanımlanması ve önceliklendirme |
| Backend Developer | .NET 9 API geliştirme, veritabanı tasarımı |
| Frontend Developer | React UI geliştirme, state management |
| DevOps Engineer | Deployment, monitoring, backup stratejisi |
| QA Engineer | Test planları, güvenlik testleri |

### Harici Bağımlılıklar

- PostgreSQL 16 database server
- .NET 9 Runtime (server)
- Modern web browser (client)
- Local network infrastructure

### Referans Dokümantasyon

- [ASP.NET Core Documentation](https://learn.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/16/)
- [JWT.io](https://jwt.io/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📊 Proje Metrikleri

### Dokümantasyon İstatistikleri

- **Toplam Doküman:** 11 markdown dosyası
- **Toplam Boyut:** ~195 KB
- **En Büyük Doküman:** IMPLEMENTATION_ROADMAP.md (~71.6 KB)
- **Kod Örnekleri:** 50+ production-ready snippet
- **SQL Şemaları:** 8 core table + birim-specific tables
- **API Endpoint'ler:** 25+ REST endpoint

### Geliştirme Tahmini

- **Tahmini Süre:** 12-16 hafta
- **Toplam Faz:** 6
- **Backend Tasks:** ~40
- **Frontend Tasks:** ~35
- **DevOps Tasks:** ~10

---

## 📝 Notlar ve Öneriler

### Geliştirme Başlamadan Önce

1. ✅ Tüm dokümantasyonu okuyun
2. ✅ Geliştirme ortamını hazırlayın (.NET 9, Node.js, PostgreSQL)
3. ✅ Git repository oluşturun
4. ✅ Development, Staging ve Production ortamlarını planlayın
5. ✅ Backup stratejisi belirleyin

### Kod Standartları

- **Backend:** C# Naming Conventions, Clean Architecture
- **Frontend:** ESLint + Prettier, Airbnb Style Guide
- **Database:** Snake_case table names, PascalCase column names
- **Git:** Conventional Commits (feat, fix, docs, refactor)

### Güvenlik Kontrol Listesi

- [ ] IP Whitelist aktif
- [ ] BCrypt password hashing (work factor ≥12)
- [ ] JWT token expiry ≤8 hours
- [ ] Rate limiting configured
- [ ] Audit logging enabled
- [ ] HTTPS/TLS enabled (production)
- [ ] Database encryption enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (Content Security Policy)

---

## 🔗 Hızlı Linkler

### Proje Tanımı
- [PRD - Product Requirements](PRD.md)
- [Teknik Tasarım](TECHNICAL_DESIGN.md)
- [Teknoloji Yığını](TECH_STACK.md)

### Geliştirme
- [Geliştirme Yol Haritası](IMPLEMENTATION_ROADMAP.md)
- [İlk Adımlar](DEVELOPMENT_STEPS.md)
- [API Spesifikasyonu](API_SPECIFICATION.md)
- [Veritabanı Şeması](ERD.md)

### Deployment
- [Deployment Rehberi](DEPLOYMENT_GUIDE.md)
- [Windows Server Deployment](WINDOWS_SERVER_DEPLOYMENT.md)

### Diğer
- [Modüler Yapı](MODULAR_STRUCTURE.md)
- [Claude Code Rehberi](CLAUDE.md)

---

**Son Güncelleme:** 2025-11-23
**Versiyon:** 1.0
**Durum:** Documentation Complete - Development Ready
