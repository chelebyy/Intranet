# Hızlı Başlangıç Rehberi (Quick Start Guide)

**Kurumsal İntranet Web Portalı**
**Versiyon:** 1.0
**Hedef Kitle:** Yeni geliştiriciler, DevOps ekibi

---

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Ön Gereksinimler](#ön-gereksinimler)
- [Hızlı Kurulum (5 Dakika)](#hızlı-kurulum-5-dakika)
- [Detaylı Kurulum](#detaylı-kurulum)
- [İlk Login ve Test](#ilk-login-ve-test)
- [Geliştirme Ortamı](#geliştirme-ortamı)
- [Yaygın Sorunlar](#yaygın-sorunlar)
- [Sonraki Adımlar](#sonraki-adımlar)

---

## 🎯 Genel Bakış

Bu rehber, projeyi yerel geliştirme ortamında **sıfırdan çalışır hale getirmenizi** sağlar.

**Bu rehber sonunda:**
- ✅ PostgreSQL veritabanı kurulu ve yapılandırılmış olacak
- ✅ Backend API çalışır durumda olacak
- ✅ Frontend development server çalışacak
- ✅ İlk admin kullanıcısı ile login yapabileceksiniz

**Tahmini Süre:** 15-30 dakika

---

## 📦 Ön Gereksinimler

### Yazılım Gereksinimleri

| Yazılım | Minimum Versiyon | Download |
|---------|------------------|----------|
| **.NET SDK** | 9.0 | [Download](https://dotnet.microsoft.com/download/dotnet/9.0) |
| **Node.js** | 20.x LTS | [Download](https://nodejs.org/) |
| **PostgreSQL** | 16.x | [Download](https://www.postgresql.org/download/) |
| **Git** | 2.40+ | [Download](https://git-scm.com/) |
| **VS Code** (önerilen) | Latest | [Download](https://code.visualstudio.com/) |

### Donanım Gereksinimleri

- **RAM:** Minimum 8GB (16GB önerilir)
- **Disk:** 5GB boş alan
- **İşlemci:** 4 core (8 thread önerilir)

### Versiyonları Kontrol Etme

```bash
# .NET SDK
dotnet --version
# Beklenen: 9.0.x

# Node.js
node --version
# Beklenen: v20.x.x

# npm
npm --version
# Beklenen: 10.x.x

# PostgreSQL
psql --version
# Beklenen: psql (PostgreSQL) 16.x

# Git
git --version
# Beklenen: git version 2.40+
```

---

## ⚡ Hızlı Kurulum (5 Dakika)

**Docker kullanarak en hızlı kurulum:**

### 1. Docker Kurulumu

```bash
# Docker Desktop kurulu olmalı
docker --version
docker-compose --version
```

### 2. Projeyi Klonlayın

```bash
git clone https://github.com/kurum/intranet-portal.git
cd intranet-portal
```

### 3. Environment Değişkenlerini Ayarlayın

```bash
# .env dosyası oluştur
cp .env.example .env

# .env dosyasını düzenle
# POSTGRES_PASSWORD, JWT_SECRET_KEY gibi değerleri ayarla
```

### 4. Docker Compose ile Başlat

```bash
docker-compose up -d
```

### 5. Veritabanı Migrations

```bash
# Backend container'a bağlan
docker exec -it intranet-backend bash

# Migrations çalıştır
dotnet ef database update

# Container'dan çık
exit
```

### 6. Erişim

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **PostgreSQL:** localhost:5432

**İlk Login:**
- Email: `admin@kurum.local`
- Password: `Admin123!`

---

## 🔧 Detaylı Kurulum

### Adım 1: PostgreSQL Kurulumu ve Yapılandırması

#### Windows 11

```powershell
# PostgreSQL 16 installer'ı çalıştır
# Kurulum sırasında:
# - Password: postgres123 (ya da kendi şifreniz)
# - Port: 5432
# - Locale: Turkish_Turkey.1254 (opsiyonel)

# Kurulum sonrası psql'i test et
psql -U postgres
```

#### Linux (Ubuntu/Debian)

```bash
# PostgreSQL 16 repository ekle
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Kurulum
sudo apt update
sudo apt install postgresql-16 postgresql-contrib-16

# Başlat
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Test
sudo -u postgres psql
```

#### Veritabanı Oluşturma

```sql
-- psql'e bağlandıktan sonra:

-- Kullanıcı oluştur
CREATE USER intranet_user WITH PASSWORD 'IntranetPass123!';

-- Veritabanı oluştur
CREATE DATABASE "IntranetDB" OWNER intranet_user;

-- pgcrypto extension'ı etkinleştir (AES-256 şifreleme için)
\c IntranetDB
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Yetkileri ver
GRANT ALL PRIVILEGES ON DATABASE "IntranetDB" TO intranet_user;

-- Çıkış
\q
```

---

### Adım 2: Backend Kurulumu (.NET 9)

#### Proje Klonlama

```bash
# Proje klasörüne git
cd /path/to/your/projects

# Repo'yu klonla (henüz oluşturulmadıysa, manuel oluşturulacak)
# git clone https://github.com/kurum/intranet-portal.git
# cd intranet-portal

# Şimdilik manuel oluştur
mkdir IntranetPortal
cd IntranetPortal
```

#### Solution ve Proje Oluşturma

```bash
# Solution oluştur
dotnet new sln -n IntranetPortal

# Web API projesi
dotnet new webapi -n IntranetPortal.API -f net9.0

# Class Library'ler (Katmanlı Mimari)
dotnet new classlib -n IntranetPortal.Domain -f net9.0
dotnet new classlib -n IntranetPortal.Application -f net9.0
dotnet new classlib -n IntranetPortal.Infrastructure -f net9.0

# Solution'a ekle
dotnet sln add IntranetPortal.API/IntranetPortal.API.csproj
dotnet sln add IntranetPortal.Domain/IntranetPortal.Domain.csproj
dotnet sln add IntranetPortal.Application/IntranetPortal.Application.csproj
dotnet sln add IntranetPortal.Infrastructure/IntranetPortal.Infrastructure.csproj

# Proje referansları
cd IntranetPortal.API
dotnet add reference ../IntranetPortal.Application/IntranetPortal.Application.csproj
dotnet add reference ../IntranetPortal.Infrastructure/IntranetPortal.Infrastructure.csproj

cd ../IntranetPortal.Application
dotnet add reference ../IntranetPortal.Domain/IntranetPortal.Domain.csproj

cd ../IntranetPortal.Infrastructure
dotnet add reference ../IntranetPortal.Domain/IntranetPortal.Domain.csproj
dotnet add reference ../IntranetPortal.Application/IntranetPortal.Application.csproj

cd ..
```

#### NuGet Paketlerini Yükleme

```bash
# Infrastructure katmanı (PostgreSQL + EF Core)
cd IntranetPortal.Infrastructure
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 9.0.1
dotnet add package Microsoft.EntityFrameworkCore.Design --version 9.0.0
dotnet add package Microsoft.EntityFrameworkCore.Tools --version 9.0.0
dotnet add package BCrypt.Net-Next --version 4.0.3

# API katmanı (JWT + Swagger)
cd ../IntranetPortal.API
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 9.0.0
dotnet add package Swashbuckle.AspNetCore --version 6.9.0
dotnet add package Microsoft.AspNetCore.RateLimiting --version 9.0.0

# Application katmanı
cd ../IntranetPortal.Application
dotnet add package FluentValidation --version 11.11.0
dotnet add package AutoMapper --version 13.0.1

cd ..
```

#### appsettings.json Yapılandırması

`IntranetPortal.API/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=IntranetDB;Username=intranet_user;Password=IntranetPass123!"
  },
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKeyMinimum32CharactersLong123456!",
    "Issuer": "IntranetPortal",
    "Audience": "IntranetPortalUsers",
    "ExpiryHours": 8
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "AllowedHosts": "*"
}
```

#### Entity Framework Migrations

```bash
# Infrastructure katmanında DbContext oluşturulduktan sonra:
cd IntranetPortal.Infrastructure

# İlk migration
dotnet ef migrations add InitialCreate --startup-project ../IntranetPortal.API

# Veritabanına uygula
dotnet ef database update --startup-project ../IntranetPortal.API
```

#### Backend'i Çalıştırma

```bash
cd IntranetPortal.API
dotnet run

# Çıktı:
# info: Microsoft.Hosting.Lifetime[14]
#       Now listening on: http://localhost:5000
```

**Test:**
```bash
curl http://localhost:5000/api/health
# Beklenen: {"status": "healthy"}
```

---

### Adım 3: Frontend Kurulumu (React + Vite)

#### Proje Oluşturma

```bash
# Ana proje klasöründe
cd /path/to/IntranetPortal

# Vite ile React TypeScript projesi
npm create vite@latest intranet-frontend -- --template react-ts

cd intranet-frontend
```

#### Dependencies Kurulumu

```bash
# Temel bağımlılıklar
npm install

# UI Framework (Tailwind CSS)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Routing
npm install react-router-dom

# State Management & API
npm install @tanstack/react-query axios

# UI Components (shadcn/ui dependencies)
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu

# Form Handling
npm install react-hook-form @hookform/resolvers zod

# Date Handling
npm install date-fns
```

#### Tailwind CSS Konfigürasyonu

`tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

`src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Environment Variables

`.env.development`:

```bash
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Kurumsal İntranet Portalı
```

#### Frontend'i Çalıştırma

```bash
npm run dev

# Çıktı:
# VITE v5.x.x  ready in xxx ms
# ➜  Local:   http://localhost:3000/
```

---

### Adım 4: Seed Data (İlk Veriler)

Backend'de seed data oluşturmak için:

`IntranetPortal.Infrastructure/Data/SeedData.cs`:

```csharp
public static class SeedData
{
    public static async Task Initialize(AppDbContext context)
    {
        // Zaten veri varsa çık
        if (context.Users.Any()) return;

        // Birimler
        var birimler = new List<Birim>
        {
            new() { BirimAdi = "Bilgi İşlem", Aciklama = "IT departmanı" },
            new() { BirimAdi = "İnsan Kaynakları", Aciklama = "İK departmanı" },
            new() { BirimAdi = "İdari İşler", Aciklama = "İdari işlemler" }
        };
        context.Birimler.AddRange(birimler);
        await context.SaveChangesAsync();

        // Roller
        var roles = new List<Role>
        {
            new() { RoleAdi = "SistemAdmin", Aciklama = "Sistem yöneticisi" },
            new() { RoleAdi = "BirimAdmin", Aciklama = "Birim yöneticisi" },
            new() { RoleAdi = "Editör", Aciklama = "İçerik editörü" },
            new() { RoleAdi = "Görüntüleyici", Aciklama = "Standart kullanıcı" }
        };
        context.Roles.AddRange(roles);
        await context.SaveChangesAsync();

        // Permissions
        var permissions = new List<Permission>
        {
            new() { Action = "create", Resource = "user" },
            new() { Action = "read", Resource = "user" },
            new() { Action = "update", Resource = "user" },
            new() { Action = "delete", Resource = "user" },
            new() { Action = "admin", Resource = "birim" }
        };
        context.Permissions.AddRange(permissions);
        await context.SaveChangesAsync();

        // Admin kullanıcı
        var adminUser = new User
        {
            AdSoyad = "Sistem Admin",
            Email = "admin@kurum.local",
            SifreHash = BCrypt.Net.BCrypt.HashPassword("Admin123!", 12),
            Unvan = "Sistem Yöneticisi",
            IsActive = true
        };
        context.Users.Add(adminUser);
        await context.SaveChangesAsync();

        // Admin'i Bilgi İşlem birimine SistemAdmin rolü ile ata
        context.UserBirimRoles.Add(new UserBirimRole
        {
            UserID = adminUser.UserID,
            BirimID = birimler[0].BirimID,
            RoleID = roles[0].RoleID
        });
        await context.SaveChangesAsync();
    }
}
```

`Program.cs`'de seed data'yı çağırma:

```csharp
// Program.cs içinde, app.Run() öncesi:

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await SeedData.Initialize(context);
}

app.Run();
```

---

## 🧪 İlk Login ve Test

### 1. Backend'in Çalıştığını Doğrulayın

```bash
# Health check
curl http://localhost:5000/api/health

# Swagger UI (eğer etkinse)
# Tarayıcıda: http://localhost:5000/swagger
```

### 2. Login Testi (API)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kurum.local",
    "password": "Admin123!"
  }'
```

**Beklenen Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "user": {
      "userId": 1,
      "adSoyad": "Sistem Admin",
      "email": "admin@kurum.local"
    },
    "birimleri": [
      {
        "birimId": 1,
        "birimAdi": "Bilgi İşlem",
        "roleAdi": "SistemAdmin"
      }
    ]
  }
}
```

### 3. Frontend'de Login

1. Tarayıcıda http://localhost:3000 açın
2. Login sayfası görünmeli
3. Giriş yapın:
   - Email: `admin@kurum.local`
   - Password: `Admin123!`
4. Başarılı girişten sonra dashboard'a yönlendirilmeli

### 4. Test Kullanıcıları Oluşturma

Admin dashboard üzerinden yeni kullanıcılar ekleyin:

- **Birim Admin:** `birim.admin@kurum.local` / `Birim123!`
- **Editör:** `editor@kurum.local` / `Editor123!`
- **Görüntüleyici:** `viewer@kurum.local` / `Viewer123!`

---

## 💻 Geliştirme Ortamı

### VS Code Extensions (Önerilen)

#### Backend (.NET)
- **C# Dev Kit** (Microsoft)
- **C#** (Microsoft)
- **.NET Install Tool** (Microsoft)
- **NuGet Gallery** (pcislo)

#### Frontend (React)
- **ES7+ React/Redux/React-Native snippets** (dsznajder)
- **Tailwind CSS IntelliSense** (Tailwind Labs)
- **ESLint** (Microsoft)
- **Prettier** (Prettier)
- **Auto Rename Tag** (Jun Han)

#### Database
- **PostgreSQL** (Chris Kolkman)
- **SQL Formatter** (adpyke)

#### Genel
- **GitLens** (GitKraken)
- **Todo Tree** (Gruntfuggly)
- **Path Intellisense** (Christian Kohler)

### VS Code Workspace Settings

`.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[csharp]": {
    "editor.defaultFormatter": "ms-dotnettools.csharp"
  },
  "omnisharp.enableRoslynAnalyzers": true,
  "omnisharp.enableEditorConfigSupport": true,
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### Git Workflow

#### Branch Stratejisi

```bash
# Main branches
main          # Production-ready code
develop       # Development branch

# Feature branches
feature/user-management
feature/ik-module
feature/it-module

# Bugfix branches
bugfix/login-error
bugfix/permission-check
```

#### Commit Message Konvansiyonu

```bash
# Format:
<type>(<scope>): <subject>

# Types:
feat:     # Yeni özellik
fix:      # Bug fix
docs:     # Dokümantasyon
refactor: # Kod refactoring
test:     # Test ekleme/düzenleme
chore:    # Build, dependency güncellemeleri

# Örnekler:
git commit -m "feat(auth): add JWT token refresh endpoint"
git commit -m "fix(user): resolve duplicate email validation"
git commit -m "docs(api): update endpoint documentation"
```

### Debug Konfigürasyonu

`.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": ".NET Core Launch (Backend)",
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
    },
    {
      "name": "Chrome (Frontend)",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/intranet-frontend/src"
    }
  ]
}
```

---

## ⚠️ Yaygın Sorunlar

### Problem 1: PostgreSQL Bağlantı Hatası

**Hata:**
```
Npgsql.NpgsqlException: Connection refused
```

**Çözüm:**
```bash
# PostgreSQL'in çalıştığını kontrol et
sudo systemctl status postgresql  # Linux
# veya Windows Services'de "PostgreSQL" servisini kontrol et

# pg_hba.conf'u kontrol et (Windows: C:\Program Files\PostgreSQL\16\data\pg_hba.conf)
# Aşağıdaki satırın olduğundan emin ol:
# host    all             all             127.0.0.1/32            md5
```

### Problem 2: Migration Hatası

**Hata:**
```
Unable to create an object of type 'AppDbContext'
```

**Çözüm:**
```bash
# Design-time DbContext factory ekle
# IntranetPortal.Infrastructure/Data/AppDbContextFactory.cs

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseNpgsql("Host=localhost;Database=IntranetDB;Username=intranet_user;Password=IntranetPass123!");

        return new AppDbContext(optionsBuilder.Options);
    }
}
```

### Problem 3: CORS Hatası (Frontend → Backend)

**Hata:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Çözüm:**
```csharp
// Program.cs'de CORS ekle

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Middleware
app.UseCors("AllowFrontend");
```

### Problem 4: Port Already in Use

**Hata:**
```
Failed to bind to address http://127.0.0.1:5000: address already in use
```

**Çözüm:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Alternatif: Port değiştir
# launchSettings.json'da applicationUrl'yi değiştir
```

### Problem 5: JWT Token Geçersiz

**Hata:**
```
401 Unauthorized - Token validation failed
```

**Çözüm:**
```csharp
// appsettings.json'daki SecretKey'in en az 32 karakter olduğundan emin ol
// Issuer ve Audience'ın doğru ayarlandığını kontrol et

// Program.cs'de JWT ayarlarını doğrula:
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]!)
            )
        };
    });
```

---

## 🚀 Sonraki Adımlar

### 1. Dokümantasyonu İnceleyin

- ✅ [docs/technical/IMPLEMENTATION_ROADMAP.md](docs/technical/IMPLEMENTATION_ROADMAP.md) - 6 fazlı geliştirme planı
- ✅ [docs/api/API_SPECIFICATION.md](docs/api/API_SPECIFICATION.md) - Tüm API endpoint'leri
- ✅ [docs/technical/TECHNICAL_DESIGN.md](docs/technical/TECHNICAL_DESIGN.md) - Mimari detayları
- ✅ [docs/technical/ERD.md](docs/technical/ERD.md) - Veritabanı şeması

### 2. İlk Geliştirme Görevleri

**Faz 0 - Proje Kurulumu** (Bu rehberde tamamladınız ✅)

**Faz 1 - Authentication & Core** (Başlayın):
1. JWT Service implementasyonu
2. AuthController (Login, Logout)
3. IP Whitelist Middleware
4. Audit Logging Middleware
5. Rate Limiting konfigürasyonu

**Detaylar:** [docs/technical/IMPLEMENTATION_ROADMAP.md - Faz 1](docs/technical/IMPLEMENTATION_ROADMAP.md#faz-1-authentication--core-hafta-2-3)

### 3. Test Yazma

```bash
# Backend Unit Test projesi
dotnet new xunit -n IntranetPortal.Tests
dotnet sln add IntranetPortal.Tests/IntranetPortal.Tests.csproj

# Frontend Test setup
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### 4. CI/CD Pipeline Kurulumu

GitHub Actions örneği:

`.github/workflows/ci.yml`:

```yaml
name: CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: 9.0.x
      - name: Restore dependencies
        run: dotnet restore
      - name: Build
        run: dotnet build --no-restore
      - name: Test
        run: dotnet test --no-build --verbosity normal

  frontend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20
      - name: Install dependencies
        run: cd intranet-frontend && npm ci
      - name: Run tests
        run: cd intranet-frontend && npm test
      - name: Build
        run: cd intranet-frontend && npm run build
```

### 5. Code Quality Tools

```bash
# Backend - Code Analysis
dotnet add package StyleCop.Analyzers
dotnet add package SonarAnalyzer.CSharp

# Frontend - ESLint + Prettier
npm install -D eslint prettier eslint-config-prettier
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

---

## 📞 Yardım ve Destek

### Dokümantasyon

- **Proje İndeksi:** [docs/general/PROJECT_INDEX.md](docs/general/PROJECT_INDEX.md)
- **API Rehberi:** [docs/api/API_INDEX.md](docs/api/API_INDEX.md)
- **Teknik Dokümanlar:** `/docs` klasöründe tüm dokümanlar

### Sorun Giderme

1. **GitHub Issues** - Proje repository'sindeki Issues bölümü
2. **Team Chat** - Slack/Teams kanalı (kuruma özel)
3. **Tech Lead** - Doğrudan iletişim

### Faydalı Linkler

- [.NET 9 Documentation](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-9)
- [React Documentation](https://react.dev/)
- [PostgreSQL 16 Docs](https://www.postgresql.org/docs/16/)
- [Vite Documentation](https://vitejs.dev/)

---

## ✅ Kurulum Kontrol Listesi

Geliştirme ortamınızı kontrol etmek için:

- [ ] .NET 9 SDK kurulu ve çalışıyor (`dotnet --version`)
- [ ] Node.js 20+ kurulu ve çalışıyor (`node --version`)
- [ ] PostgreSQL 16 kurulu ve çalışıyor (`psql --version`)
- [ ] Git kurulu (`git --version`)
- [ ] VS Code + extensions kurulu
- [ ] Backend projesi oluşturuldu
- [ ] Frontend projesi oluşturuldu
- [ ] PostgreSQL veritabanı oluşturuldu (`IntranetDB`)
- [ ] Veritabanı kullanıcısı oluşturuldu (`intranet_user`)
- [ ] Connection string doğru yapılandırıldı
- [ ] EF Core migrations çalıştırıldı
- [ ] Seed data oluşturuldu
- [ ] Backend başarıyla çalışıyor (http://localhost:5000)
- [ ] Frontend başarıyla çalışıyor (http://localhost:3000)
- [ ] Admin kullanıcısı ile login yapılabildi
- [ ] API test edildi (Postman/curl)

**Tüm maddeler tamamlandıysa, geliştirmeye başlamaya hazırsınız! 🎉**

---

**Son Güncelleme:** 2025-11-23
**Versiyon:** 1.0
