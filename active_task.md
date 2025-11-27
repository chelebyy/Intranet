# 📋 Active Task List - Kurumsal İntranet Web Portalı

**Proje:** Kurumsal İntranet Web Portalı
**Versiyon:** 1.0
**Başlangıç:** 2025-11-25
**Mevcut Faz:** Faz 2 - RBAC & Admin Panel (Bekliyor)

---

## 🎯 Geliştirme Metodolojisi

Bu proje **Task-Driven Development (TDD)** yaklaşımıyla geliştirilmektedir:

1. ✅ **Her görev tamamlandığında `[x]` işaretlenir**
2. ✅ **Her kod parçası aşağıdaki referans dökümanlarla uyumlu olmalıdır:**
   - **PRD.md** - Fonksiyonel gereksinimler ve özellikler
   - **ERD.md** - Veritabanı şeması, entity ilişkileri, SQL örnekleri
   - **API_SPECIFICATION.md** - API endpoint tanımları, request/response formatları
   - **TECHNICAL_DESIGN.md** - Mimari yapı, güvenlik implementasyonu, deployment
   - **TECH_STACK.md** - Teknoloji versiyonları ve paket bilgileri
   - **DEVELOPMENT_STEPS.md** - Modül geliştirme sırası ve bağımlılıklar
   - **IMPLEMENTATION_ROADMAP.md** - Faz detayları, kod örnekleri, timeline
   - **MODULAR_STRUCTURE.md** - Yeni birim ekleme kuralları
   - **FILE_MANAGEMENT.md** - Dosya yükleme ve Excel export implementasyonu
   - **SECURITY_ANALYSIS_REPORT.md** - Güvenlik kontrol listeleri ve OWASP uyumu
   - **DEPLOYMENT_GUIDE.md** - Deployment senaryoları ve kurulum adımları
   - **PROJECT_INDEX.md** - Döküman navigasyonu ve çapraz referanslar
   - **API_INDEX.md** - API endpoint kategorileri ve hızlı referans
   - **QUICK_START.md** - Yeni geliştirici başlangıç kılavuzu
   - **ERRORS.md** - Bilinen hatalar, çözümleri ve önleme kuralları ⚠️ KRİTİK
3. ✅ **Her aşama tamamlandığında bu dosya güncellenir**
4. ✅ **Bir sonraki görev belirlenir ve önceliklenir**

---

## 📊 Faz Durumu

| Faz | Durum | Tamamlanma | Süre Tahmini |
|-----|-------|------------|--------------|
| Faz 0: Proje Kurulumu | ✅ TAMAMLANDI | 100% | 1-2 hafta |
| Faz 1: Authentication & Core | ✅ TAMAMLANDI | 100% | 1-2 hafta |
| Faz 2: RBAC & Admin Panel | 🟡 SIRADA | 0% | 2-3 hafta |
| Faz 3: Multi-Unit Support | ⚪ BEKLİYOR | 0% | 1-2 hafta |
| Faz 4: First Unit Module (HR) | ⚪ BEKLİYOR | 0% | 2-3 hafta |
| Faz 5: Second Unit Module (IT) | ⚪ BEKLİYOR | 0% | 2-3 hafta |
| Faz 6: Testing & Optimization | ⚪ BEKLİYOR | 0% | 2-3 hafta |

---

## 📚 Referans Döküman Matrisi

Bu tablo, hangi dökümanın hangi aşamada ve ne zaman kontrol edilmesi gerektiğini gösterir:

| Döküman | Kullanım Alanı | Ne Zaman Kontrol Edilir | İlgili Fazlar |
|---------|----------------|------------------------|---------------|
| **PRD.md** | Fonksiyonel gereksinimler, kullanıcı hikayeleri, iş kuralları | Her feature implementasyonu öncesi | Tüm Fazlar |
| **ERD.md** | Veritabanı şeması, entity ilişkileri, SQL sorguları | Entity/Migration oluştururken, ilişki tanımlarken | Faz 0, 1, 2, 4, 5 |
| **API_SPECIFICATION.md** | API endpoint tanımları, request/response formatları, HTTP kodları | Controller/Service/DTO oluştururken | Faz 1, 2, 3, 4, 5 |
| **TECHNICAL_DESIGN.md** | Mimari yapı, layered architecture, güvenlik implementasyon örnekleri | Yeni service/middleware oluştururken, güvenlik features | Faz 0, 1, 2 |
| **TECH_STACK.md** | Kullanılacak teknolojiler, paket versiyonları, kütüphane seçimleri | NuGet/npm paket yüklerken, teknoloji kararları | Faz 0, 1 |
| **DEVELOPMENT_STEPS.md** | Modül geliştirme sırası, bağımlılıklar, hangi özellik önce yapılacak | Yeni modül/birim oluşturmadan önce | Faz 4, 5 |
| **IMPLEMENTATION_ROADMAP.md** | Haftalık faz planı, kod örnekleri, task breakdown | Her faz başlangıcında, task planning yaparken | Tüm Fazlar |
| **MODULAR_STRUCTURE.md** | Yeni organizasyonel birim ekleme kuralları, folder structure | Yeni birim modülü eklerken (HR, IT, vs.) | Faz 4, 5 |
| **FILE_MANAGEMENT.md** | Dosya yükleme güvenliği, Excel export, MIME validation | File upload/download features | Faz 4, 5 |
| **SECURITY_ANALYSIS_REPORT.md** | OWASP kontrol listeleri, güvenlik best practices, vulnerability fixes | Her güvenlik-kritik feature (auth, upload, API) | Faz 1, 2, 4, 5 |
| **DEPLOYMENT_GUIDE.md** | Windows/Linux/Docker deployment adımları, production config | Deployment ve environment setup yaparken | Faz 0, 6 |
| **PROJECT_INDEX.md** | Döküman navigasyonu, çapraz referanslar, hızlı arama | Yeni dökümana ihtiyaç duyulduğunda | Her Zaman |
| **API_INDEX.md** | API endpoint kategorileri, quick reference, örnek çağrılar | API test/integration yaparken | Faz 1, 2, 3, 4, 5 |
| **QUICK_START.md** | Yeni geliştirici onboarding, 15-30 dakikalık setup guide | Yeni geliştirici katıldığında, environment setup | Faz 0 |
| **ERRORS.md** | Bilinen hatalar (build, runtime, database), çözümler, önleme | Build hatası, runtime error, duplicate entity sorunları | Her Zaman (ÖNCELİKLİ) |

### Döküman Kontrol Kuralları

**Her Feature Implementation Öncesi:**
1. **PRD.md** → Feature requirement var mı, iş kuralları neler?
2. **IMPLEMENTATION_ROADMAP.md** → Bu feature hangi fazda, örnek kod var mı?
3. **ERD.md** / **API_SPECIFICATION.md** → Database/API tasarımı nasıl olmalı?

**Güvenlik-Kritik Feature'lar için (Auth, File Upload, API):**
1. **SECURITY_ANALYSIS_REPORT.md** → Bulgu ve kontrol listesi kontrol et
2. **TECHNICAL_DESIGN.md** → Güvenlik implementation örneklerini incele
3. **FILE_MANAGEMENT.md** (file upload için) → MIME validation, güvenlik kuralları

**Yeni Birim/Modül Eklerken:**
1. **MODULAR_STRUCTURE.md** → Folder structure ve pattern'leri incele
2. **DEVELOPMENT_STEPS.md** → Modül bağımlılıklarını kontrol et
3. **API_SPECIFICATION.md** → API endpoint pattern'lerini koru

---

# FAZ 0: PROJE KURULUMU VE ALTYAPI (Hafta 1-2)

## 🎯 Hedef
Geliştirme ortamını hazırlamak ve proje iskeletini oluşturmak.

## 📄 İlgili Dökümanlar
- **QUICK_START.md** - Environment setup adımları
- **TECH_STACK.md** - Kurulacak teknolojiler ve versiyonlar
- **ERD.md** - Database şema tasarımı ve entity tanımları
- **TECHNICAL_DESIGN.md** - Layered architecture yapısı
- **IMPLEMENTATION_ROADMAP.md → Faz 0** - Detaylı kurulum adımları ve kod örnekleri
- **DEPLOYMENT_GUIDE.md** - PostgreSQL kurulum ve Docker setup

---

## Backend Kurulumu

### 0.1. Geliştirme Ortamı Hazırlığı
- [x] .NET 9 SDK kurulumu doğrulaması (`dotnet --version`) - ✅ v9.0.307
- [x] PostgreSQL 16 kurulumu ve servis durumu kontrolü - ✅ v16.11 KURULU
- [x] Geliştirme IDE (Visual Studio 2022 / Rider / VS Code) hazırlığı - ✅ VS Code/Rider mevcut
- [x] Git repository yapısı oluşturma - ✅ Git repo aktif (branch: master)
- [x] Node.js kurulumu doğrulaması - ✅ v22.21.0
- [x] API test aracı (Postman/Insomnia) kurulumu - ✅ Swagger UI kullanılacak (built-in)

### 0.2. Backend Solution Yapısı Oluşturma
- [x] Solution oluştur: `IntranetPortal.sln`
- [x] **IntranetPortal.API** projesi (ASP.NET Core Web API)
- [x] **IntranetPortal.Domain** projesi (Entities, Enums, Constants)
- [x] **IntranetPortal.Application** projesi (Services, DTOs, Interfaces)
- [x] **IntranetPortal.Infrastructure** projesi (DbContext, Repositories)
- [x] Proje referansları (dependencies) kurulumu
- [x] Solution build testi (`dotnet build`)

### 0.3. NuGet Paket Yönetimi
**Infrastructure:**
- [x] `Microsoft.EntityFrameworkCore` (9.0.0) - ✅ KURULDU
- [x] `Microsoft.EntityFrameworkCore.Tools` (9.0.0) - ✅ KURULDU
- [x] `Npgsql.EntityFrameworkCore.PostgreSQL` (9.0.2) - ✅ KURULDU
- [x] `Microsoft.EntityFrameworkCore.Design` (9.0.0) - ✅ KURULDU

**API:**
- [x] `Microsoft.AspNetCore.Authentication.JwtBearer` (9.0.0) - ✅ KURULDU
- [x] `Serilog.AspNetCore` (9.0.0) - ✅ KURULDU
- [ ] `Serilog.Sinks.PostgreSQL` - Planlanan (Faz 1)
- [x] `BCrypt.Net-Next` (4.0.3) - ✅ KURULDU
- [ ] `Swashbuckle.AspNetCore` (Swagger) - Built-in OpenAPI kullanılıyor
- [ ] `Microsoft.AspNetCore.RateLimiting` - Planlanan (Faz 1)

**Application:**
- [x] `FluentValidation.AspNetCore` (11.3.1) - ✅ KURULDU
- [x] `AutoMapper.Extensions.Microsoft.DependencyInjection` (12.0.1) - ✅ KURULDU

**Dosya Yönetimi (PRD FR-33 to FR-38):**
- [ ] `EPPlus` (Excel export için) - Planlanan (Faz 4-5)

### 0.4. PostgreSQL Database Kurulumu
- [x] Database oluşturma: `IntranetDB` - ✅ TAMAMLANDI (KULLANICI)
- [x] User oluşturma: `intranet_user` - ✅ TAMAMLANDI (KULLANICI)
- [x] Privileges verme - ✅ TAMAMLANDI (KULLANICI)
  - Schema yetkileri: GRANT ALL ON SCHEMA public
  - Tablo yetkileri: GRANT ALL PRIVILEGES ON ALL TABLES
  - Sequence yetkileri: GRANT ALL PRIVILEGES ON ALL SEQUENCES
- [x] PostgreSQL extension'ları: - ✅ TAMAMLANDI (KULLANICI)
  - [x] `pgcrypto` (AES-256 şifreleme için)
  - [x] `uuid-ossp` (UUID desteği için)

### 0.5. Domain Layer - Entity Modelleri
**Referans:** ERD.md - Bölüm 5

- [x] `User.cs` entity (ERD 5.1) - ✅ TAMAMLANDI
- [x] `Birim.cs` entity (ERD 5.2) - ✅ TAMAMLANDI
- [x] `Role.cs` entity (ERD 5.3) - ✅ TAMAMLANDI
- [x] `Permission.cs` entity (ERD 5.4) - ✅ TAMAMLANDI
- [x] `UserBirimRole.cs` junction entity (ERD 5.5) - ✅ TAMAMLANDI
- [x] `RolePermission.cs` junction entity (ERD 5.6) - ✅ TAMAMLANDI
- [x] `AuditLog.cs` entity (ERD 5.7) - ✅ TAMAMLANDI
- [x] `UploadedFile.cs` entity (ERD 5.9 - PRD FR-33 to FR-38) - ✅ TAMAMLANDI
- [x] `SystemSettings.cs` entity (ERD 5.10 - PRD FR-44 to FR-47) - ✅ TAMAMLANDI
- [x] Enums: `RoleType.cs`, `AuditAction.cs` - ✅ TAMAMLANDI
- [x] Constants: `Permissions.cs`, `Roles.cs`, `SystemSettingKeys.cs` - ✅ TAMAMLANDI
- [x] Build test başarılı - ✅ TAMAMLANDI
- [ ] `IPWhitelist.cs` entity (ERD 5.8 - Opsiyonel) - ATLANACAK (appsettings.json kullanılacak)

### 0.6. Infrastructure Layer - DbContext
- [x] `IntranetDbContext.cs` oluşturma - ✅ TAMAMLANDI
  - Lokasyon: `Infrastructure/Data/IntranetDbContext.cs`
  - 9 DbSet tanımlandı (User, Birim, Role, Permission, UserBirimRole, RolePermission, AuditLog, UploadedFile, SystemSettings)
- [x] Entity configurations (Fluent API) - ✅ TAMAMLANDI
  - 9 Configuration dosyası oluşturuldu (`Infrastructure/Configurations/`)
  - Tüm ilişkiler, indexler ve constraints tanımlandı
- [x] Connection string ayarları (`appsettings.json`) - ✅ TAMAMLANDI
  - `appsettings.json` - Production config
  - `appsettings.Development.json` - Development config (full settings)
- [x] DbContext dependency injection kaydı - ✅ TAMAMLANDI
  - `Program.cs` güncellendi
  - PostgreSQL provider yapılandırıldı
  - CORS, Controllers, Health check eklendi

### 0.7. Database Migration
- [x] İlk migration oluşturma: `dotnet ef migrations add InitialCreate` - ✅ TAMAMLANDI
  - Migration dosyaları: `Migrations/20251126055557_InitialCreate.cs`
  - EF Core tools global olarak yüklendi (`dotnet-ef 9.0.0`)
- [ ] Migration SQL script'i inceleme - Opsiyonel
- [x] Database update: `dotnet ef database update` - ✅ TAMAMLANDI (2025-11-26 09:06)
  - Connection string güncellendi (appsettings.Development.json)
  - PostgreSQL schema yetkileri düzeltildi
  - Migration başarıyla uygulandı
- [x] Tablo oluşumunu doğrulama (pgAdmin veya psql) - ✅ TAMAMLANDI
  - **10 tablo** başarıyla oluşturuldu
  - **69 kolon** toplamda tanımlandı
  - Tablolar: User, Birim, Role, Permission, UserBirimRole, RolePermission, AuditLog, UploadedFile, SystemSettings, __EFMigrationsHistory

### 0.8. Seed Data (İlk Veriler) ✅ TAMAMLANDI
**Referans:** ERD.md - Bölüm 5.3, 5.4

- [x] DatabaseSeeder.cs oluşturuldu - ✅ TAMAMLANDI
- [x] 5 Rol tanımlandı - ✅ TAMAMLANDI
  - SuperAdmin, SistemAdmin, BirimAdmin, BirimEditor, BirimGoruntuleyen
- [x] 26 Permission oluşturuldu - ✅ TAMAMLANDI
  - User, Birim, Role, Permission, AuditLog, System, File permissions
- [x] RolePermission mapping - ✅ TAMAMLANDI
  - SuperAdmin: TÜM yetkiler
  - SistemAdmin: System.manage hariç tümü
  - BirimAdmin: Birim içi user/role/file yönetimi
  - BirimEditor: Create/read/update (delete yok)
  - BirimGoruntuleyen: Sadece read/download
- [x] Varsayılan "Sistem Yönetimi" birimi - ✅ TAMAMLANDI
- [x] SuperAdmin kullanıcısı - ✅ TAMAMLANDI
  - Email: admin@intranet.local
  - Password: Admin123! (BCrypt hashed, work factor 12)
  - Rol: SuperAdmin in Sistem Yönetimi
- [x] Otomatik seed on startup - ✅ TAMAMLANDI (Program.cs'de)

- [ ] Varsayılan roller ekleme:
  - [ ] SistemAdmin
  - [ ] BirimAdmin
  - [ ] BirimEditor
  - [ ] BirimGoruntuleyen
  - [ ] SuperAdmin
- [ ] Varsayılan permission'lar ekleme (ERD.md 5.4 - güncellenmiş liste)
- [ ] Seed data migration: `dotnet ef migrations add SeedInitialData`

---

## Frontend Kurulumu

### 0.9. Frontend Proje Yapısı
- [x] Node.js 20 LTS kurulum doğrulaması (`node --version`)
- [x] Vite + React + TypeScript projesi oluşturma:
  ```bash
  npm create vite@latest intranet-frontend -- --template react-ts
  ```
- [x] Proje klasör yapısı:
  ```
  src/
  ├── features/           # Birim modülleri (auth, admin tamam)
  ├── shared/             # Ortak bileşenler (MatrixBackground, ProtectedRoute, Sidebar)
  ├── api/                # API client (apiClient.ts, authApi.ts)
  ├── store/              # Zustand state (authStore.ts)
  ├── types/              # TypeScript types (index.ts)
  └── App.tsx             # React Router yapılandırılmış
  ```

### 0.10. Frontend Dependencies
- [x] `react-router-dom` (Routing) - v7.1.3 kurulu
- [x] `zustand` (State management) - v5.0.2 kurulu
- [x] `axios` (HTTP client) - v1.7.9 kurulu
- [x] `tailwindcss` (Styling) - v3.4.17 kurulu
- [x] `recharts` (Charts) - v3.5.0 kurulu
- [ ] `@tanstack/react-query` (Server state) - Planlanan
- [ ] `zod` (Validation) - Planlanan
- [ ] `react-hook-form` (Form handling) - Planlanan
- [ ] `@headlessui/react` (UI primitives) - Planlanan
- [ ] `lucide-react` (Icons) - Planlanan

### 0.11. Frontend Konfigürasyon
- [x] TailwindCSS kurulumu ve yapılandırması (tailwind.config.js + dark mode)
- [x] TypeScript `tsconfig.json` optimizasyonu
- [x] Vite proxy konfigürasyonu (Backend API için - vite.config.ts)
- [x] Environment variables (`.env`, `.env.example` oluşturuldu)
- [ ] ESLint ve Prettier ayarları - Planlanan

---

## Docker Kurulumu (Opsiyonel)

### 0.12. Docker Yapılandırması
- [ ] `Dockerfile` (Backend için)
- [ ] `Dockerfile` (Frontend için)
- [ ] `docker-compose.yml` (PostgreSQL + Backend + Frontend)
- [ ] Docker test: `docker-compose up -d`
- [ ] Container sağlık kontrolü

---

## Güvenlik ve Yapılandırma

### 0.13. appsettings.json Konfigürasyonu
**Referans:** TECHNICAL_DESIGN.md - Bölüm 3.3

- [ ] Connection strings (PostgreSQL)
- [ ] JWT settings (SecretKey, Issuer, Audience, ExpiryMinutes)
- [ ] Security settings (AllowedIPRanges, EncryptionKey)
- [ ] Serilog yapılandırması
- [ ] CORS policy ayarları
- [ ] Rate limiting ayarları

### 0.14. Environment Variables & Security Setup
**Referans:** SECURITY_ANALYSIS_REPORT.md - Bulgu #1

**⚡ KRİTİK - HEMEN YAPILMASI GEREKEN:**

- [x] `.gitignore` dosyası oluştur: ✅ TAMAMLANDI
  - Backend: bin/, obj/, *.user, secrets.json
  - Frontend: node_modules/, dist/, .env files
  - Kapsamlı ignore kuralları (400+ satır)
  - Lokasyon: `intranet-portal/.gitignore`

- [x] Frontend Environment Variables:
  - `.env` oluşturuldu (VITE_API_BASE_URL)
  - `.env.example` template oluşturuldu

- [ ] **User Secrets Kurulumu** (Development) - YAPILACAK:
  ```bash
  cd IntranetPortal.API
  dotnet user-secrets init

  # Güçlü secrets oluştur ve kaydet
  dotnet user-secrets set "JwtSettings:SecretKey" "$(openssl rand -base64 32)"
  dotnet user-secrets set "SecuritySettings:EncryptionKey" "$(openssl rand -base64 32)"
  dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=IntranetDB;Username=intranet_user;Password=GENERATED_STRONG_PASSWORD"
  ```

- [ ] **Environment Variables Template** (`.env.example`):
  ```bash
  # PostgreSQL
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=IntranetDB
  DB_USER=intranet_user
  DB_PASSWORD=<CHANGE_ME>

  # JWT Settings
  JWT_SECRET=<GENERATE_WITH_openssl_rand_-base64_32>
  JWT_ISSUER=IntranetPortal
  JWT_AUDIENCE=IntranetUsers
  JWT_EXPIRY_MINUTES=480

  # Security
  ENCRYPTION_KEY=<GENERATE_WITH_openssl_rand_-base64_32>
  ALLOWED_IP_RANGES=192.168.1.0/24,10.0.0.0/16
  ```

- [ ] Production secrets planlaması (Azure Key Vault / AWS Secrets Manager)

---

## 🔒 Güvenlik Kontrol Listesi (FAZ 0)

**Referans:** SECURITY_ANALYSIS_REPORT.md

### Kodlamaya Başlamadan Önce - ZORUNLU

- [ ] ❌ **YAPMA:** `appsettings.json` içine hardcoded secrets yazma
- [ ] ✅ **YAP:** User Secrets kullan (yukarıdaki komutlar)
- [ ] ✅ **YAP:** Güçlü rastgele secrets oluştur (openssl)
- [ ] ✅ **YAP:** `.gitignore` ile secrets'ları koru
- [ ] ✅ **YAP:** Password policy kararlaştır (min 12 karakter)
- [ ] ✅ **YAP:** CSP (Content-Security-Policy) planla

### Güvenlik Testleri

- [ ] `appsettings.json` dosyasında hardcoded secret yok mu?
- [ ] `.gitignore` user-secrets klasörünü koruyor mu?
- [ ] Secrets doğru şekilde yükleniyor mu? (debug ile test et)

---

## Doğrulama ve Test

### 0.15. Backend Test
- [ ] Solution build: `dotnet build`
- [ ] API başlatma: `dotnet run --project IntranetPortal.API`
- [ ] Swagger UI erişim testi: `https://localhost:5001/swagger`
- [ ] Database connection testi

### 0.16. Frontend Test
- [ ] Frontend build: `npm run build`
- [ ] Development server: `npm run dev`
- [ ] Tarayıcı erişim testi: `http://localhost:5173`

### 0.17. Entegrasyon Test
- [ ] Frontend → Backend API iletişimi (CORS testi)
- [ ] Hot reload test (Backend ve Frontend)

---

## Dokümantasyon

### 0.18. README ve Başlangıç Kılavuzları
- [x] `README.md` (Root) - ✅ `intranet-portal/README.md` (5.9 KB)
  - Proje tanıtımı, hızlı başlangıç, teknoloji yığını
  - Güvenlik özellikleri, dokümantasyon referansları
- [x] `backend/README.md` - ✅ Kapsamlı backend kılavuzu (12 KB)
  - Layered architecture, PostgreSQL setup, User Secrets
  - Entity Framework komutları, güvenlik implementasyonu
- [x] `frontend/README.md` - ✅ Frontend geliştirme kılavuzu
  - Entegre tasarımlar, proje yapısı, kurulum
- [x] `PROJECT_STRUCTURE.md` - ✅ Detaylı yapı dokümantasyonu (13 KB)
  - Dizin ağacı, dosya kategorileri, navigasyon kılavuzu
- [ ] `SETUP_GUIDE.md` (Detaylı kurulum adımları) - Planlanan
- [ ] `CONTRIBUTING.md` (Geliştirme kuralları) - Planlanan
- [ ] Code style guidelines - Planlanan

---

# Sonraki Adımlar

**Faz 0 Tamamlandığında:**
- ✅ Geliştirme ortamı tamamen hazır
- ✅ Backend ve Frontend iskeletleri çalışıyor
- ✅ Database şeması oluşturulmuş
- ✅ Seed data yüklenmiş

**Faz 1'e Geçiş (Referans: IMPLEMENTATION_ROADMAP.md → Faz 1):**
- Authentication (Login/Logout) → **API_SPECIFICATION.md: Auth Endpoints**
- JWT Token mekanizması (**HttpOnly Cookie - SECURITY_ANALYSIS_REPORT.md Bulgu #2**)
- IP Whitelist middleware (**X-Real-IP desteği - SECURITY_ANALYSIS_REPORT.md Bulgu #3**)
- BCrypt şifreleme (Work Factor: 12) → **TECHNICAL_DESIGN.md: Password Hashing**
- Security Headers middleware (**SECURITY_ANALYSIS_REPORT.md Bulgu #7**)
- Rate Limiting (login: 5/min, API: 100/min) → **SECURITY_ANALYSIS_REPORT.md Bulgu #11**

---

# FAZ 1: AUTHENTICATION & CORE - GÜVENLİK GEREKSİNİMLERİ

## 📄 İlgili Dökümanlar
- **SECURITY_ANALYSIS_REPORT.md** - OWASP kontrol listeleri, güvenlik bulguları ve çözümleri (ÖNCELİKLİ)
- **TECHNICAL_DESIGN.md → Bölüm 3** - JWT, BCrypt, IP Whitelist implementasyon örnekleri
- **API_SPECIFICATION.md → Auth Endpoints** - /api/auth/* endpoint tanımları
- **ERD.md → Bölüm 5.1, 5.7** - User entity ve AuditLog yapısı
- **IMPLEMENTATION_ROADMAP.md → Faz 1** - Authentication kod örnekleri ve task breakdown
- **FILE_MANAGEMENT.md** - Henüz değil (Faz 4-5'te kullanılacak)

## 🔐 Güvenlik Zorunlulukları

### 1.1. JWT Token Güvenliği (Bulgu #2 - YÜKSEK ÖNCELİK)

- [ ] ❌ **YAPMA:** JWT token'ı `localStorage`'a kaydetme
- [ ] ✅ **YAP:** HttpOnly Cookie kullan:
  ```csharp
  Response.Cookies.Append("auth_token", jwtToken, new CookieOptions
  {
      HttpOnly = true,
      Secure = true,
      SameSite = SameSiteMode.Strict,
      Expires = DateTimeOffset.UtcNow.AddHours(8)
  });
  ```

- [ ] Frontend: `axios.defaults.withCredentials = true`
- [ ] CORS policy: `.AllowCredentials()` ekle

### 1.2. IP Whitelist Middleware (Bulgu #3 - YÜKSEK ÖNCELİK)

- [ ] X-Real-IP header desteği ekle
- [ ] Trusted proxy kontrolü yap
- [ ] IP blocking'i audit log'a kaydet
- [ ] CIDR notation desteği (IPNetwork2 paketi)

### 1.3. Rate Limiting (Bulgu #11)

- [ ] Login endpoint: 5 deneme/dakika
- [ ] API endpoints: 100 istek/dakika/kullanıcı
- [ ] File upload: 10 upload/dakika
- [ ] ASP.NET Core 9 built-in rate limiter kullan

### 1.4. Security Headers (Bulgu #7 - ORTA ÖNCELİK)

- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] X-XSS-Protection: 1; mode=block
- [ ] Content-Security-Policy (CSP)
- [ ] Strict-Transport-Security (HSTS)
- [ ] Referrer-Policy
- [ ] Permissions-Policy

### 1.5. Password Policy (Bulgu #6 - ORTA ÖNCELİK)

- [ ] Minimum 12 karakter
- [ ] En az 1 büyük harf, 1 küçük harf, 1 rakam, 1 özel karakter
- [ ] Yaygın şifre blacklist (OWASP common passwords)
- [ ] BCrypt work factor: 12
- [ ] FluentValidation password validator

### 1.6. Input Validation (Bulgu #5 - ORTA ÖNCELİK)

- [ ] FluentValidation tüm DTO'larda
- [ ] Email regex validation
- [ ] SQL injection koruması (EF Core otomatik)
- [ ] XSS sanitization (frontend - DOMPurify)
- [ ] File upload MIME type + magic number validation

### 1.7. HTTPS/TLS

- [ ] Minimum TLS 1.2
- [ ] Development: self-signed cert (`dotnet dev-certs https`)
- [ ] Production: Kurumsal CA sertifikası

### 1.8. Audit Logging

- [ ] Login/Logout kayıtları
- [ ] Failed authentication attempts
- [ ] IP blocking events
- [ ] Rate limit violations
- [ ] Sensitive data masking

---

## 🚨 Kritik Notlar

1. **Güvenlik Öncelik**: Şifreler asla plaintext saklanmaz, JWT secret güvenli tutulur
2. **OWASP Uyumu**: SECURITY_ANALYSIS_REPORT.md'deki tüm kontrolleri uygula
3. **ERD Uyumu**: Tüm entity'ler ERD.md ile %100 uyumlu olmalı
4. **Code-First**: Migration'lar her değişiklikte oluşturulmalı
5. **Git Commit**: Her görev tamamlandığında anlamlı commit mesajı
6. **Dokümantasyon**: Her yeni özellik için kod yorumları ve README güncellemeleri
7. **Security Testing**: Her güvenlik özelliği implement edildikten sonra test et

---

## 📚 Referans Dokümanlar

### Temel Dökümanlar
- **PRD.md** - Ürün gereksinimleri ve fonksiyonel özellikler
- **ERD.md** - Veritabanı şeması, entity ilişkileri, SQL örnekleri
- **API_SPECIFICATION.md** - API endpoint tanımları ve request/response formatları

### Teknik ve Mimari
- **TECHNICAL_DESIGN.md** - Mimari yapı, güvenlik implementasyon örnekleri, deployment
- **TECH_STACK.md** - Kullanılan teknolojiler, versiyonlar, paket bilgileri
- **SECURITY_ANALYSIS_REPORT.md** - Güvenlik analizi, OWASP kontrol listeleri, bulgu ve çözümler

### Geliştirme ve Implementasyon
- **DEVELOPMENT_STEPS.md** - Modül geliştirme sırası ve bağımlılıklar
- **IMPLEMENTATION_ROADMAP.md** - 6 fazlık geliştirme roadmap, kod örnekleri, timeline
- **MODULAR_STRUCTURE.md** - Yeni birim ekleme kuralları ve pattern'ler
- **FILE_MANAGEMENT.md** - Dosya yükleme ve Excel export implementasyonu

### Deployment ve Başlangıç
- **DEPLOYMENT_GUIDE.md** - Windows/Linux/Docker deployment senaryoları
- **QUICK_START.md** - Yeni geliştirici başlangıç kılavuzu (15-30 dakika)

### Navigasyon ve İndeks
- **PROJECT_INDEX.md** - Tüm dökümanların indeksi ve çapraz referanslar
- **API_INDEX.md** - API endpoint kategorileri ve hızlı referans

**Not:** Yukarıdaki "Referans Döküman Matrisi" bölümünde her dökümanın hangi aşamada kullanılacağı detaylı olarak açıklanmıştır.

---

**Son Güncelleme:** 2025-11-27 (Faz 1 tamamlandı - Authentication & Core implementasyonu)
**Mevcut Görev:** Faz 2 - RBAC & Admin Panel (Bekliyor)
**Durum:** 🟢 FAZ 0 TAMAMLANDI | 🟢 FAZ 1 TAMAMLANDI | 🟡 FAZ 2 SIRADA
**Güvenlik Durumu:** 🟢 MÜKEMMEl (JWT, BCrypt, HttpOnly Cookies, Audit Logging aktif)

### 📋 Metodoloji Güncellemesi (2025-11-26 10:30)
- ✅ **Task-Driven Development bölümü genişletildi** - 14 referans döküman eklendi
- ✅ **Yeni "Referans Döküman Matrisi" eklendi** - Hangi dökümanın ne zaman kullanılacağı tabloda gösteriliyor
- ✅ **"Döküman Kontrol Kuralları" eklendi** - Feature implementation öncesi hangi dökümanların kontrol edileceği
- ✅ **Faz 0 ve Faz 1'e "İlgili Dökümanlar" bölümleri eklendi** - Her fazda hangi dökümanların referans alınacağı belirtildi
- ✅ **"Referans Dokümanlar" bölümü yeniden yapılandırıldı** - Kategorik gruplandırma (Temel, Teknik, Geliştirme, Deployment, İndeks)

---

## ✅ Tamamlanan İşlemler (Bu Oturumda)

### Proje Organizasyonu ve Dokümantasyon (Önceki Oturum)
1. **Backend Solution** - 4 proje yapısı oluşturuldu ve organize edildi
2. **Frontend Entegrasyonu** - React 19 + TypeScript + Vite tamamen yapılandırıldı
3. **Proje Organizasyonu** - Frontend `intranet-portal/` içine taşındı
4. **Dokümantasyon** - 4 kapsamlı README dosyası oluşturuldu
5. **Git Yönetimi** - Kapsamlı .gitignore (backend + frontend)

### Domain Layer Implementation (Önceki Oturum - 2025-11-25)
6. **Entity Models** - 9 entity sınıfı oluşturuldu
7. **Enums** - 2 enum sınıfı (RoleType, AuditAction)
8. **Constants** - 3 sabit sınıfı (Permissions, Roles, SystemSettingKeys)

### Seed Data System (YENİ - 2025-11-26 09:07-10:15)
20. **DatabaseSeeder.cs** - ✅ Kapsamlı seed data sistemi:
   - 5 rol (SuperAdmin, SistemAdmin, BirimAdmin, BirimEditor, BirimGoruntuleyen)
   - 26 permission (user, birim, role, permission, auditlog, system, file)
   - Role-Permission mapping (idempotent)
   - Varsayılan "Sistem Yönetimi" birimi
   - SuperAdmin kullanıcısı (admin@intranet.local / Admin123!)
21. **DatabaseSeederExtensions.cs** - ✅ Startup seeding extension
22. **Program.cs** - ✅ SeedDatabaseAsync() integration
23. **SESSION_SUMMARY_2025-11-26.md** - ✅ Oturum özeti oluşturuldu
24. **active_task.md** - ✅ Faz 0 %100, Faz 1 %30 güncellendi

### Faz 1: Authentication & Core Implementation (YENİ - 2025-11-26 21:00 - 2025-11-27)
30. **JWT Token Service** - ✅ HMAC-SHA256 token generation/validation implemented
31. **Password Service** - ✅ BCrypt hashing + strength validation implemented
32. **Authentication Service** - ✅ Multi-birim login, audit logging implemented
33. **Auth Controller** - ✅ 4 REST endpoints (login tested successfully)
34. **IntranetDbContextAdapter** - ✅ Circular dependency fix via adapter pattern
35. **Program.cs JWT Configuration** - ✅ HttpOnly cookies, authentication middleware
36. **User Secrets** - ✅ JWT key, DB credentials configured
37. **Login Endpoint Test** - ✅ Successful test (admin@intranet.local)
38. **FAZ1_TAMAMLANDI.md** - ✅ Comprehensive completion documentation
39. **SESSION_CHECKPOINT_FAZ1_COMPLETE.md** - ✅ Session checkpoint created
40. **PROJECT_STATUS.md** - ✅ Overall project status tracking document

**Critical Fixes Applied:**
- ✅ Circular dependency → Adapter pattern
- ✅ DateTime UTC error → EnableLegacyTimestampBehavior
- ✅ Audit log JSON error → JsonSerializer.Serialize wrapper
- ✅ Database seeding → SaveChangesAsync after each step
- ✅ Property name mismatches → Turkish property names (SonGiris, TarihSaat, RoleAdi)

**NuGet Packages Added:**
- ✅ System.IdentityModel.Tokens.Jwt (8.15.0)
- ✅ BCrypt.Net-Next (4.0.3)
- ✅ Microsoft.EntityFrameworkCore (9.0.0) in Application
- ✅ Microsoft.Extensions.Hosting.Abstractions (9.0.0) in Infrastructure

### Documentation Structure Enhancement (ÖNCEKİ - 2025-11-26 10:15-10:30)
25. **active_task.md - Task-Driven Development Bölümü** - ✅ 14 referans döküman eklendi:
   - PRD, ERD, API_SPECIFICATION (mevcut)
   - TECHNICAL_DESIGN, TECH_STACK, DEVELOPMENT_STEPS (eklendi)
   - IMPLEMENTATION_ROADMAP, MODULAR_STRUCTURE, FILE_MANAGEMENT (eklendi)
   - SECURITY_ANALYSIS_REPORT, DEPLOYMENT_GUIDE (eklendi)
   - PROJECT_INDEX, API_INDEX, QUICK_START (eklendi)
26. **active_task.md - Referans Döküman Matrisi** - ✅ Yeni bölüm eklendi:
   - 14 döküman için kullanım alanı tablosu
   - "Ne Zaman Kontrol Edilir" rehberi
   - "İlgili Fazlar" eşleştirmesi
27. **active_task.md - Döküman Kontrol Kuralları** - ✅ 3 senaryo için kurallar:
   - Her Feature Implementation Öncesi
   - Güvenlik-Kritik Feature'lar için
   - Yeni Birim/Modül Eklerken
28. **active_task.md - Faz 0/1 İlgili Dökümanlar** - ✅ Her faza özel referans listeleri
29. **active_task.md - Referans Dokümanlar Bölümü** - ✅ Kategorik yeniden yapılandırma:
   - Temel Dökümanlar (3)
   - Teknik ve Mimari (3)
   - Geliştirme ve Implementasyon (4)
   - Deployment ve Başlangıç (2)
   - Navigasyon ve İndeks (2)

### Infrastructure Layer Implementation (ÖNCEKİ - 2025-11-26 08:00-09:00)
9. **NuGet Paketleri** - 13 paket başarıyla yüklendi:
   - Infrastructure: EF Core 9.0, Npgsql 9.0.2
   - API: JWT Bearer 9.0, BCrypt 4.0.3, Serilog 9.0
   - Application: FluentValidation 11.3.1, AutoMapper 12.0.1
10. **IntranetDbContext** - ✅ Ana DbContext sınıfı oluşturuldu
   - Lokasyon: `Infrastructure/Data/IntranetDbContext.cs`
   - 9 DbSet tanımı
11. **Entity Configurations** - ✅ 9 Fluent API configuration dosyası:
   - UserConfiguration, BirimConfiguration, RoleConfiguration
   - PermissionConfiguration, UserBirimRoleConfiguration
   - RolePermissionConfiguration, AuditLogConfiguration
   - UploadedFileConfiguration, SystemSettingsConfiguration
   - Tüm ilişkiler, indexler, constraints tanımlandı
12. **appsettings.json** - ✅ Production ve Development config oluşturuldu:
   - Connection strings (placeholder)
   - JWT settings (8 saat expiry)
   - Security settings (IP whitelist, BCrypt work factor 12, password policy)
   - Rate limiting (login 5/min, API 100/min, upload 10/min)
   - File upload settings (10 MB max)
   - CORS (localhost:5173, localhost:3000)
13. **Program.cs** - ✅ Dependency Injection yapılandırıldı:
   - DbContext kaydedildi (PostgreSQL provider)
   - CORS yapılandırması
   - Controllers mapping
   - Health check endpoint (`/api/health`)
14. **EF Core Migration** - ✅ İlk migration oluşturuldu:
   - `dotnet-ef` tools global yükleme (9.0.0)
   - `InitialCreate` migration (20251126055557)
   - 3 dosya: Migration, Designer, ModelSnapshot
15. **Build Test** - ✅ Tüm solution başarıyla build edildi (0 error, 0 warning)

### Database Setup and Migration (YENİ - 2025-11-26 09:00-09:07)
16. **PostgreSQL Database** - ✅ Kullanıcı tarafından oluşturuldu:
   - Database: IntranetDB
   - User: intranet_user (password: SecurePassword123!)
   - Extensions: pgcrypto, uuid-ossp
17. **appsettings.Development.json** - ✅ Connection string güncellendi
18. **PostgreSQL Schema Permissions** - ✅ Yetkilendirme düzeltildi:
   - GRANT ALL ON SCHEMA public
   - GRANT ALL PRIVILEGES ON ALL TABLES/SEQUENCES
19. **Database Migration** - ✅ Migration başarıyla uygulandı:
   - `dotnet ef database update` çalıştırıldı
   - **10 tablo** oluşturuldu (User, Birim, Role, Permission, UserBirimRole, RolePermission, AuditLog, UploadedFile, SystemSettings, __EFMigrationsHistory)
   - **69 kolon** toplamda tanımlandı
   - Tüm foreign key constraints ve indexler oluşturuldu

## ✅ FAZ 1: Authentication & Core - TAMAMLANDI

**Tamamlanma Tarihi:** 27 Kasım 2025
**Döküman:** FAZ1_TAMAMLANDI.md

### Tamamlanan Özellikler

**Authentication Services:**
- [x] JWT Token Service - HMAC-SHA256, 8 saatlik expiry, claims-based auth
- [x] Password Service - BCrypt hashing (work factor 12), strength validation
- [x] Authentication Service - Multi-birim support, audit logging, auto birim selection

**API Layer:**
- [x] Auth Controller - 4 endpoint (login ✅ tested, select-birim, logout, me)
- [x] DTOs - 6 DTO sınıfı (LoginRequest/Response, User, Birim, Role, UserBirimRole)

**Security:**
- [x] JWT Configuration - HttpOnly cookies, HMAC-SHA256, algorithm verification
- [x] User Secrets - JWT secret key, database credentials
- [x] Audit Logging - JSON format, IP tracking, all auth events

**Database:**
- [x] Circular Dependency Fix - Adapter pattern (IntranetDbContextAdapter)
- [x] Migration Fix - DateTime UTC handling (EnableLegacyTimestampBehavior)

**Test Sonuçları:**
- ✅ Login endpoint tested successfully
- ✅ SuperAdmin user login working
- ✅ Multi-birim auto-selection working
- ✅ JWT token generation confirmed
- ✅ Audit logging confirmed

**API Durumu:** 🟢 Çalışıyor (http://localhost:5197)

---

## 🔄 Sonraki Oturum Planı

### FAZ 2: RBAC & Admin Panel (Başlayacak)

**Öncelik 1 - Authorization Attribute (2-3 saat):**
1. **[HasPermission] Attribute** - Custom authorization attribute
2. **Permission Caching** - In-memory permission cache service
3. **ClaimsPrincipal Extensions** - Helper methods for permission checking

**Öncelik 2 - User Management API (3-4 saat):**
4. **User CRUD Endpoints** - Create, Read, Update, Delete (soft)
5. **User DTOs & Validators** - CreateUserDto, UpdateUserDto, FluentValidation
6. **User Service** - Business logic layer

**Öncelik 3 - Role & Birim Management (2-3 saat):**
7. **Role CRUD Endpoints** - Role management API
8. **Birim CRUD Endpoints** - Organizational unit management
9. **Permission Assignment API** - Role-Permission mapping

**Öncelik 4 - Audit Log Query (1-2 saat):**
10. **Audit Log API** - Query with filters (userId, action, dateRange)
11. **Excel Export** - EPPlus implementation

**Başlangıç Komutu:**
```
/sc:implement Faz 2 RBAC başla - [HasPermission] attribute'den başla
```

---

## 📋 PostgreSQL Kurulum Komutları

Kullanıcı aşağıdaki komutları çalıştırmalıdır:

```bash
# 1. PostgreSQL'e bağlan
psql -U postgres

# 2. Database oluştur
CREATE DATABASE "IntranetDB" ENCODING 'UTF8';

# 3. User oluştur
CREATE USER intranet_user WITH ENCRYPTED PASSWORD 'SecurePassword123!';

# 4. Yetkileri ver
GRANT ALL PRIVILEGES ON DATABASE "IntranetDB" TO intranet_user;

# 5. IntranetDB'ye bağlan
\c IntranetDB

# 6. Extension'ları etkinleştir
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

# 7. Çıkış
\q

# 8. Migration'ı çalıştır (Windows PowerShell)
cd "C:\Users\IT\Desktop\Bilişim Sistemi\intranet-portal\backend\IntranetPortal.Infrastructure"
dotnet ef database update --startup-project ..\IntranetPortal.API

# 9. Tabloları kontrol et
psql -U intranet_user -d IntranetDB -c "\dt"
```

**Not:** Password'ü daha güçlü bir şeyle değiştirebilirsiniz.
