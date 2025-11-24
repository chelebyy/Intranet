# Teknoloji Yığını (Tech Stack) - Kurumsal İntranet Web Portalı

Bu doküman, **Kurumsal İntranet Web Portalı** projesinde kullanılacak teknolojileri, framework'leri, kütüphaneleri ve araçları detaylandırır.

---

## 1. Backend (Sunucu Tarafı)

**Framework:** ASP.NET Core Web API
**Dil:** C# 12
**Runtime:** .NET 9
**Veritabanı ORM:** Entity Framework Core 9.x

### Temel Kütüphaneler (NuGet Packages)

| Paket | Amaç | Versiyon (Önerilen) |
|-------|------|---------------------|
| `Microsoft.EntityFrameworkCore` | ORM Core | 9.0.x |
| `Microsoft.EntityFrameworkCore.Tools` | Migration Araçları | 9.0.x |
| `Npgsql.EntityFrameworkCore.PostgreSQL` | PostgreSQL Provider | 9.0.x |
| `Microsoft.AspNetCore.Authentication.JwtBearer` | JWT Kimlik Doğrulama | 9.0.x |
| `Serilog.AspNetCore` | Yapılandırılmış Loglama | 9.0.x |
| `Serilog.Sinks.PostgreSQL` | PostgreSQL Log Sink | 2.3.x |
| `BCrypt.Net-Next` | Şifre Hashing | 4.0.x |
| `FluentValidation.AspNetCore` | Model Doğrulama | 11.x |
| `AutoMapper` | Nesne Eşleme (DTO <-> Entity) | 13.x |
| `Swashbuckle.AspNetCore` | Swagger/OpenAPI Dokümantasyon | 6.6.x |
| `NetTopologySuite` | IP Range/CIDR İşlemleri (Opsiyonel) | 2.5.x |
| `Microsoft.AspNetCore.RateLimiting` | Rate Limiting (Brute-force koruması) | 9.0.x |
| `System.Security.Cryptography` | AES-256 Şifreleme (Built-in .NET) | - |
| `EPPlus` veya `ClosedXML` | Excel Export (XLSX) | 7.x / 0.102.x |
| `CsvHelper` | CSV Export | 30.x |

---

## 2. Frontend (İstemci Tarafı)

**Framework:** React 18
**Dil:** TypeScript 5.x
**Build Tool:** Vite 5.x
**Paket Yöneticisi:** npm veya pnpm

### Kütüphaneler (npm Packages)

| Paket | Amaç | Versiyon (Önerilen) |
|-------|------|---------------------|
| `react`, `react-dom` | UI Kütüphanesi | 18.3.x |
| `typescript` | Tip Güvenliği | 5.4.x |
| `react-router-dom` | Sayfa Yönlendirme (Routing) | 6.22.x |
| `@tanstack/react-query` | API İstekleri ve Cache Yönetimi | 5.x |
| `axios` | HTTP İstemcisi | 1.6.x |
| `zustand` | Hafif State Yönetimi | 4.5.x |
| `tailwindcss` | Utility-First CSS Framework | 3.4.x |
| `shadcn/ui` veya `radix-ui` | Headless UI Bileşenleri | Güncel |
| `lucide-react` | İkon Seti | Güncel |
| `react-hook-form` | Form Yönetimi | 7.51.x |
| `zod` | Şema Doğrulama (TypeScript) | 3.23.x |
| `date-fns` | Tarih İşlemleri | 3.6.x |
| `recharts` veya `chart.js` | Grafik ve Raporlama (Opsiyonel) | Güncel |

### Geliştirme Araçları

| Araç | Amaç |
|------|------|
| `eslint` | Kod Kalite Kontrolü |
| `prettier` | Kod Formatlama |
| `vite-tsconfig-paths` | TypeScript Path Mapping |

---

## 3. Veritabanı ve Depolama

**Veritabanı:** PostgreSQL 15.x veya 16.x
**Yönetim Aracı:** pgAdmin 4 veya DBeaver Community

### PostgreSQL Özellikler

- **Şifreleme Desteği:** pgcrypto extension (AES-256)
- **JSON Desteği:** JSONB alanları ile esnek veri saklama
- **Full-Text Search:** Türkçe arama için unaccent extension
- **Partitioning:** AuditLog tablosu için zaman bazlı bölümleme (Opsiyonel)

### Yedekleme Stratejisi

- **Araç:** pg_dump ve pg_restore
- **Sıklık:** Günlük otomatik yedekleme (Windows Task Scheduler ile)
- **Saklama:** Lokal disk + harici depolama (NAS/USB)

### Dosya Depolama

- **Dosya Sistemi:** Encrypted file system (AES-256)
- **Yol:** `C:\IntranetFiles\` (Windows) veya `/var/intranet/files/` (Linux)
- **Metadata Tablosu:** PostgreSQL'de `UploadedFile` tablosu
- **Max Dosya Boyutu:** 10MB
- **İzin Verilen Formatlar:** PDF, PNG, JPG, JPEG, DOCX

---

## 4. Güvenlik Araçları

| Teknoloji | Amaç |
|-----------|------|
| **TLS/SSL Sertifikası** | HTTPS iletişim şifrelemesi (Self-signed veya kurumsal CA) |
| **JWT (JSON Web Token)** | Stateless kimlik doğrulama |
| **BCrypt** | Şifre hashing (Rainbow table koruması) |
| **AES-256** | Hassas veri şifreleme |
| **IP Whitelist Middleware** | Ağ erişim kısıtlaması |
| **Rate Limiting** | Brute-force ve DDoS koruması |
| **CORS Policy** | Cross-Origin güvenlik |

---

## 5. Geliştirme ve DevOps Araçları

### IDE ve Editörler

| Araç | Kullanım Alanı |
|------|----------------|
| **Visual Studio 2022** | Backend geliştirme (C#, .NET 9) |
| **JetBrains Rider** | Alternatif IDE (Cross-platform) |
| **VS Code** | Frontend geliştirme (React, TypeScript) |

### Versiyon Kontrol

- **Git** (2.x) - Kod versiyon kontrolü
- **GitHub/GitLab/Bitbucket** - Uzak repository (Opsiyonel, lokal Git de yeterli)

### API Test ve Dokümantasyon

- **Postman** veya **Insomnia** - API endpoint testleri
- **Swagger UI** - Otomatik API dokümantasyonu (Backend'de built-in)

### Konteynerizasyon (Opsiyonel)

- **Docker Desktop** - Windows ortamında konteyner desteği
- **Docker Compose** - Multi-container orkestrasyon

---

## 6. Windows Uyumluluğu ve Kurulum Gereksinimleri

### Geliştirme Ortamı

- **İşletim Sistemi:** Windows 10 (21H2+) veya Windows 11
- **.NET SDK:** .NET 9 SDK (dotnet-sdk-9.0.x)
- **Node.js:** 20.x LTS veya 22.x
- **PostgreSQL:** 15.x veya 16.x (Windows installer)

### Üretim Sunucusu

- **İşletim Sistemi:** Windows Server 2019 veya 2022
- **Web Sunucusu:** IIS 10.0+ (ASP.NET Core Hosting Bundle ile)
- **Veritabanı:** PostgreSQL Windows Service
- **SSL:** IIS SSL Binding ile HTTPS

### Kurulum Bileşenleri

| Bileşen | Kaynak |
|---------|--------|
| **.NET 9 Runtime + Hosting Bundle** | [microsoft.com/dotnet](https://dotnet.microsoft.com/download/dotnet/9.0) |
| **PostgreSQL Windows Installer** | [postgresql.org/download/windows](https://www.postgresql.org/download/windows/) |
| **Node.js Windows Installer** | [nodejs.org](https://nodejs.org/) |
| **Git for Windows** | [git-scm.com](https://git-scm.com/download/win) |

---

## 7. Performans Optimizasyonu Araçları

| Teknoloji | Kullanım Alanı |
|-----------|----------------|
| **Response Caching** | API yanıt önbellekleme |
| **Memory Cache** | In-memory veri saklama (IMemoryCache) |
| **Redis** (Opsiyonel) | Dağıtık cache (Çoklu sunucu senaryolarında) |
| **Database Indexing** | Sorgu performans optimizasyonu |
| **Lazy Loading (EF Core)** | İlişkisel veri yüklemede gecikme |
| **Code Splitting (Vite)** | Frontend bundle boyutu azaltma |

---

## 8. Logging ve İzleme

| Teknoloji | Amaç |
|-----------|------|
| **Serilog** | Yapılandırılmış loglama (JSON format) |
| **Serilog.Sinks.PostgreSQL** | Logları veritabanına yazma |
| **Serilog.Sinks.File** | Dosya bazlı loglama (Yedek) |
| **Application Insights** (Opsiyonel) | Microsoft Azure izleme (Cloud için) |
| **Windows Event Log** | Kritik sistem olayları için |

---

## 9. Test Araçları (Opsiyonel - Önerilen)

| Teknoloji | Kullanım Alanı |
|-----------|----------------|
| **xUnit** | Backend unit testleri |
| **Moq** | Mock obje oluşturma |
| **Vitest** | Frontend unit/integration testleri |
| **Playwright** | End-to-end (E2E) testleri |

---

## 10. Önerilen Mimari

```
┌─────────────────────────────────────────┐
│         Windows Server 2022             │
├─────────────────────────────────────────┤
│  IIS 10.0 (Port 443 - HTTPS)            │
│  ├─ ASP.NET Core Backend (.NET 9)       │
│  └─ React Frontend (Static Files)       │
├─────────────────────────────────────────┤
│  PostgreSQL 16 (Port 5432)              │
│  ├─ Encrypted Data (pgcrypto)           │
│  └─ Daily Backups (pg_dump)             │
├─────────────────────────────────────────┤
│  Windows Firewall                       │
│  └─ IP Whitelist (Lokal Ağ)             │
└─────────────────────────────────────────┘
```

---

## 11. Versiyon Matrisi (Özet)

| Kategori | Teknoloji | Versiyon |
|----------|-----------|----------|
| Backend Runtime | .NET | 9.0 |
| Backend Framework | ASP.NET Core | 9.0 |
| ORM | Entity Framework Core | 9.0 |
| Frontend Framework | React | 18.3 |
| Dil | TypeScript | 5.4 |
| Build Tool | Vite | 5.x |
| Veritabanı | PostgreSQL | 15/16 |
| Authentication | JWT | - |
| Şifre Hashing | BCrypt | 4.0 |
| Logging | Serilog | 9.0 |
| UI Framework | Tailwind CSS | 3.4 |
| State Management | Zustand | 4.5 |

---

Bu teknoloji yığını, **Windows tabanlı lokal ağ ortamlarında** güvenli, ölçeklenebilir ve performanslı bir kurumsal intranet çözümü sunmak için optimize edilmiştir.
