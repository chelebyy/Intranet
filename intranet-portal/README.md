# Kurumsal İntranet Web Portalı

Güvenli, rol tabanlı erişim kontrollü kurumsal intranet web portalı.

## 📁 Proje Yapısı

```
intranet-portal/
├── backend/                          # .NET 9 Backend API
│   ├── IntranetPortal.API/          # ASP.NET Core Web API
│   ├── IntranetPortal.Application/  # Business Logic Layer
│   ├── IntranetPortal.Domain/       # Domain Entities
│   └── IntranetPortal.Infrastructure/ # Data Access Layer
└── frontend/                         # React + TypeScript Frontend
    ├── src/
    │   ├── features/                # Feature modules
    │   ├── shared/                  # Shared components
    │   ├── api/                     # API client
    │   ├── store/                   # State management
    │   └── types/                   # TypeScript types
    ├── public/                      # Static assets
    └── dist/                        # Build output
```

## 🚀 Hızlı Başlangıç

### Gereksinimler

- **.NET 9 SDK** - Backend için
- **Node.js 22+** - Frontend için
- **PostgreSQL 16** - Veritabanı

### Backend Kurulum

```bash
cd backend
dotnet restore
dotnet build
dotnet run --project IntranetPortal.API
```

Backend varsayılan olarak `https://localhost:5001` adresinde çalışır.

### Frontend Kurulum

```bash
cd frontend
npm install
npm run dev
```

Frontend varsayılan olarak `http://localhost:5173` adresinde çalışır.

## 🏠 Yeni Ortam Kurulumu (Ev/İş Bilgisayarı)

Bu projeyi farklı bilgisayarlarda (ev/iş) kullanmak için:

### 1. Repository'yi Klonlayın

```bash
cd "c:\Users\IT\Desktop\Bilişim Sistemi"
git clone https://github.com/chelebyy/Intranet.git intranet-portal
cd intranet-portal
```

### 2. Backend Konfigürasyonu

**`appsettings.Development.json` dosyası oluşturun:**

```bash
cd backend/IntranetPortal.API
```

`appsettings.Development.json` adında yeni bir dosya oluşturup aşağıdaki içeriği ekleyin:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Information",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=IntranetDB;Username=YOUR_DB_USER;Password=YOUR_DB_PASSWORD"
  },
  "JwtSettings": {
    "SecretKey": "YOUR_STRONG_SECRET_KEY_MIN_32_CHARS",
    "Issuer": "IntranetPortal",
    "Audience": "IntranetUsers",
    "ExpiryMinutes": 480
  }
}
```

> ⚠️ **ÖNEMLİ:** Bu dosya `.gitignore` tarafından hariç tutulmuştur. Her bilgisayarda ayrı ayrı oluşturmanız gerekir.

**Bağımlılıkları yükleyin ve veritabanını oluşturun:**

```bash
dotnet restore
dotnet ef database update --startup-project ../IntranetPortal.API
```

### 3. Frontend Konfigürasyonu

```bash
cd ../../frontend
```

**`.env` dosyası oluşturun:**

`.env.example` dosyasını kopyalayarak `.env` oluşturun:

```bash
copy .env.example .env
```

Veya manuel olarak `.env` dosyası oluşturup şu içeriği ekleyin:

```env
# Backend API Base URL
VITE_API_BASE_URL=https://localhost:5001/api

# Environment (development, production)
VITE_ENV=development
```

**Bağımlılıkları yükleyin:**

```bash
npm install
```

### 4. İlk Çalıştırma

**Backend:**
```bash
cd backend
dotnet run --project IntranetPortal.API
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Günlük Git İş Akışı

**Çalışmaya başlamadan önce:**
```bash
git pull origin main
```

**Gün sonunda (değişiklikleri paylaş):**
```bash
git add .
git commit -m "Açıklayıcı commit mesajı"
git push origin main
```

> 💡 **İpucu:** Detaylı git iş akışı için [GITHUB_WORKFLOW.md](docs/GITHUB_WORKFLOW.md) dosyasına bakın.

## 📚 Dokümantasyon

Tüm teknik dokümantasyon kök dizinde bulunmaktadır:

### Temel Dokümantasyon
- **[PRD.md](../PRD.md)** - Ürün gereksinimleri
- **[CLAUDE.md](../CLAUDE.md)** - Proje kılavuzu
- **[PROJECT_INDEX.md](../PROJECT_INDEX.md)** - Dokümantasyon indeksi

### Teknik Tasarım
- **[TECHNICAL_DESIGN.md](../TECHNICAL_DESIGN.md)** - Mimari tasarım
- **[ERD.md](../ERD.md)** - Veritabanı şeması
- **[API_SPECIFICATION.md](../API_SPECIFICATION.md)** - API dokümantasyonu

### Güvenlik & Deployment
- **[SECURITY_ANALYSIS_REPORT.md](../SECURITY_ANALYSIS_REPORT.md)** - OWASP güvenlik analizi
- **[DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)** - Deployment kılavuzu
- **[IMPLEMENTATION_ROADMAP.md](../IMPLEMENTATION_ROADMAP.md)** - 6 fazlı implementasyon planı

### Özel Modül Dokümantasyonu
- **[FILE_MANAGEMENT.md](../FILE_MANAGEMENT.md)** - Dosya yönetimi
- **[MODULAR_STRUCTURE.md](../MODULAR_STRUCTURE.md)** - Modüler yapı

## 🔐 Güvenlik Özellikleri

- **JWT Authentication** - HttpOnly Cookie ile güvenli token yönetimi
- **RBAC** - Rol tabanlı erişim kontrolü
- **IP Whitelist** - IP bazlı erişim kısıtlaması
- **AES-256 Encryption** - Hassas veri şifreleme
- **OWASP Top 10** - Güvenlik standartlarına uyumluluk
- **Rate Limiting** - API istek sınırlama
- **Audit Logging** - Kapsamlı denetim kayıtları

## 🛠️ Teknoloji Yığını

### Backend
- .NET 9 (ASP.NET Core Web API)
- Entity Framework Core 9
- PostgreSQL 16
- BCrypt (password hashing)
- JWT Bearer Authentication

### Frontend
- React 19.2.0
- TypeScript 5.8.2
- Vite 6.2.0
- React Router DOM
- Zustand (state management)
- Axios (HTTP client)
- TailwindCSS 3.4.17
- Recharts 3.5.0

## 📋 Özellikler

### Core Features
- ✅ Multi-unit (çoklu birim) kullanıcı desteği
- ✅ Rol bazlı yetkilendirme (RBAC)
- ✅ IP whitelist güvenliği
- ✅ Dark mode desteği
- ✅ Responsive tasarım
- ✅ Real-time dashboard
- ✅ Kullanıcı ve birim yönetimi
- ✅ Rol ve izin yönetimi
- ✅ Audit log ve raporlama

- ✅ Duyuru ve Uyarı Sistemi (Anlık, Modal, Banner) 📢
- ✅ **Veritabanı Bakım Merkezi** (Vacuum, Analyze, Reindex) 🔧
- ✅ **Yedekleme Yönetimi** (Manuel Tetikleme, İndirme) 💾
- ✅ **Gelişmiş IP Kısıtlama Yönetimi** 🛡️

### Planned Features
- [ ] Dosya yükleme ve yönetimi
- [ ] Excel export/import
- [ ] Gelişmiş filtreleme

- [ ] Multi-language (i18n)
- [ ] Unit & Integration testler

## 🔧 Geliştirme

### Backend Development

```bash
cd backend

# Watch mode (auto-reload)
dotnet watch --project IntranetPortal.API

# Migration oluştur
dotnet ef migrations add MigrationName

# Database güncelle
dotnet ef database update

# Build
dotnet build

# Test
dotnet test
```

### Frontend Development

```bash
cd frontend

# Dev server
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check
```

## 🌐 Environment Variables

### Backend (.NET User Secrets)

```bash
cd backend/IntranetPortal.API
dotnet user-secrets init
dotnet user-secrets set "JwtSettings:SecretKey" "your-secret-key"
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "your-connection-string"
```

### Frontend (.env)

```env
VITE_API_BASE_URL=https://localhost:5001/api
VITE_ENV=development
```

## 📊 Proje Durumu

### Tamamlanan
- ✅ Tüm teknik dokümantasyon (14 dosya)
- ✅ Backend proje yapısı (.NET 9 solution)
- ✅ Frontend entegrasyonu (Login + Admin Dashboard)
- ✅ Güvenlik analizi (OWASP Top 10)
- ✅ API tasarımı
- ✅ Veritabanı şeması

### Devam Eden
- 🔄 Backend API implementasyonu
- 🔄 Database migrations
- 🔄 Authentication & Authorization
- 🔄 Frontend-Backend entegrasyonu

### Planlanan
- 📋 Unit testler
- 📋 Integration testler
- 📋 E2E testler (Playwright)
- 📋 Docker deployment
- 📋 CI/CD pipeline

## 🤝 Katkıda Bulunma

1. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
2. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
3. Branch'i push edin (`git push origin feature/AmazingFeature`)
4. Pull Request açın

## 📝 Lisans

Bu proje kapalı kaynak bir kurumsal projedir.

## 📞 İletişim

Sorularınız için:
- Dokümantasyon: Kök dizindeki `.md` dosyaları
- Güvenlik: `SECURITY_ANALYSIS_REPORT.md`
- Implementation: `IMPLEMENTATION_ROADMAP.md`

---

**Son Güncelleme:** 2025-11-25
**Versiyon:** 1.0
**Durum:** 🚧 Geliştirme Aşamasında
