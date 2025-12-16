# Proje Yapısı ve Organizasyon

## 📁 Dizin Yapısı

```
C:\Users\IT\Desktop\Bilişim Sistemi\
│
├── intranet-portal/                    # 🎯 ANA PROJE KLASÖRÜ
│   │
│   ├── backend/                        # .NET 9 Backend
│   │   ├── IntranetPortal.sln         # Solution file
│   │   ├── README.md                   # Backend dokümantasyonu
│   │   │
│   │   ├── IntranetPortal.API/        # 🌐 Presentation Layer
│   │   │   ├── Controllers/           # API endpoints
│   │   │   │   ├── AnnouncementsController.cs # 📢 Announcement API
│   │   │   │   └── ...
│   │   │   ├── Middleware/            # Custom middleware
│   │   │   ├── Filters/               # Authorization attributes
│   │   │   ├── Program.cs             # App entry point
│   │   │   └── appsettings.json       # Configuration
│   │   │
│   │   ├── IntranetPortal.Application/ # 💼 Business Logic Layer
│   │   │   ├── Services/              # Business services
│   │   │   │   ├── AnnouncementService.cs # 📢 Announcement Logic
│   │   │   │   └── ...
│   │   │   ├── DTOs/                  # Data transfer objects
│   │   │   ├── Interfaces/            # Service contracts
│   │   │   └── Validators/            # FluentValidation rules
│   │   │
│   │   ├── IntranetPortal.Domain/     # 📦 Domain Layer
│   │   │   ├── Entities/              # Database models
│   │   │   │   ├── Announcement.cs    # 📢 Announcement Entity
│   │   │   │   └── ...
│   │   │   ├── Enums/                 # Enumeration types
│   │   │   └── Constants/             # System constants
│   │   │
│   │   └── IntranetPortal.Infrastructure/ # 🗄️ Data Access Layer
│   │       ├── Data/                  # DbContext
│   │       ├── Repositories/          # Repository pattern
│   │       ├── Migrations/            # EF Core migrations
│   │       └── Configurations/        # Entity configurations
│   │
│   ├── frontend/                       # React + TypeScript Frontend
│   │   ├── README.md                   # Frontend dokümantasyonu
│   │   ├── package.json                # Dependencies
│   │   ├── vite.config.ts              # Vite configuration
│   │   ├── tailwind.config.js          # Tailwind configuration
│   │   ├── .env                        # Environment variables
│   │   ├── .env.example                # Environment template
│   │   │
│   │   ├── src/
│   │   │   ├── features/              # 🎯 Feature-based modules
│   │   │   │   ├── auth/              # Authentication
│   │   │   │   │   ├── LoginPage.tsx          # Matrix login
│   │   │   │   │   └── BirimSelection.tsx     # Unit selection
│   │   │   │   └── admin/             # Admin panel
│   │   │   │       ├── components/
│   │   │   │       │   └── Sidebar.tsx        # Navigation
│   │   │   │       └── pages/
│   │   │   │           ├── Dashboard.tsx      # Main dashboard
│   │   │   │           ├── UserList.tsx       # User management
│   │   │   │           ├── DepartmentList.tsx # Department mgmt
│   │   │   │           ├── RolePermissions.tsx # Roles & perms
│   │   │   │           ├── Reports.tsx        # Reports
│   │   │   │           ├── AnnouncementList.tsx   # 📢 Announcement Mgmt
│   │   │   │           └── AnnouncementEditor.tsx # 📢 Create/Edit Announcement
│   │   │   │
│   │   │   ├── shared/                # 🔄 Shared components
│   │   │   │   ├── components/
│   │   │   │   │   ├── MatrixBackground.tsx   # Matrix animation
│   │   │   │   │   └── ProtectedRoute.tsx     # Route guard
│   │   │   │   └── layouts/
│   │   │   │       └── AdminLayout.tsx        # Admin layout
│   │   │   │
│   │   │   ├── api/                   # 🌐 API client layer
│   │   │   │   ├── apiClient.ts               # Axios config
│   │   │   │   └── authApi.ts                 # Auth services
│   │   │   │
│   │   │   ├── store/                 # 💾 State management
│   │   │   │   └── authStore.ts               # Zustand auth store
│   │   │   │
│   │   │   ├── types/                 # 📝 TypeScript types
│   │   │   │   └── index.ts                   # All type definitions
│   │   │   │
│   │   │   ├── App.tsx                # Root component + Routing
│   │   │   └── index.css              # Global styles (Tailwind)
│   │   │
│   │   ├── public/                     # Static assets
│   │   └── dist/                       # Build output (gitignored)
│   │
│   ├── README.md                       # 📖 Main project README
│   └── .gitignore                      # Git ignore rules
│
├── 📚 TECHNICAL DOCUMENTATION (Kök Dizinde)
│   ├── PRD.md                          # Product Requirements Document
│   ├── CLAUDE.md                       # Project guide for Claude Code
│   ├── PROJECT_INDEX.md                # Documentation index
│   │
│   ├── TECHNICAL_DESIGN.md             # Architecture & design
│   ├── ERD.md                          # Database schema + SQL
│   ├── API_SPECIFICATION.md            # API documentation
│   ├── API_INDEX.md                    # API quick reference
│   │
│   ├── SECURITY_ANALYSIS_REPORT.md     # OWASP security analysis
│   ├── IMPLEMENTATION_ROADMAP.md       # 6-phase implementation plan
│   │
│   ├── FILE_MANAGEMENT.md              # File upload system
│   ├── MODULAR_STRUCTURE.md            # Modular architecture
│   │
│   ├── DEPLOYMENT_GUIDE.md             # Deployment instructions
│   ├── WINDOWS_SERVER_DEPLOYMENT.md    # Windows Server deployment
│   ├── DEVELOPMENT_STEPS.md            # Development phases
│   ├── QUICK_START.md                  # Quick start guide
│   ├── TECH_STACK.md                   # Technology stack
│   │
│   ├── DOCUMENTATION_UPDATE_SUMMARY.md # Documentation changelog
│   ├── active_task.md                  # Current tasks
│   └── GEMINI.md                       # (Empty placeholder)
│
└── docs/                               # Additional documentation (if any)
```

## 🗂️ Dosya Kategorileri

### ✅ Oluşturulan ve Hazır Dosyalar

**Backend:**
- ✅ `backend/IntranetPortal.sln` - Solution file (4 proje ile)
- ✅ `backend/IntranetPortal.API/` - API projesi oluşturuldu
- ✅ `backend/IntranetPortal.Application/` - Business logic projesi
- ✅ `backend/IntranetPortal.Domain/` - Domain projesi
- ✅ `backend/IntranetPortal.Infrastructure/` - Data access projesi
- ✅ `backend/README.md` - Backend dokümantasyonu

**Frontend:**
- ✅ `frontend/src/` - Tüm kaynak kodlar
- ✅ `frontend/src/features/auth/LoginPage.tsx` - Matrix login (entegre)
- ✅ `frontend/src/features/auth/BirimSelection.tsx` - Birim seçimi
- ✅ `frontend/src/features/admin/` - Admin dashboard (entegre)
- ✅ `frontend/src/shared/components/MatrixBackground.tsx` - Matrix animasyon
- ✅ `frontend/src/api/` - API client (Axios + HttpOnly cookie)
- ✅ `frontend/src/store/authStore.ts` - Zustand state management
- ✅ `frontend/src/App.tsx` - React Router yapılandırması
- ✅ `frontend/tailwind.config.js` - Tailwind yapılandırması
- ✅ `frontend/.env` - Environment variables
- ✅ `frontend/README.md` - Frontend dokümantasyonu

**Root:**
- ✅ `intranet-portal/README.md` - Ana proje README
- ✅ `intranet-portal/.gitignore` - Git ignore kuralları

**Documentation (Kök Dizin):**
- ✅ Tüm teknik dokümanlar (14 .md dosyası)

### 🚧 İçi Boş Klasörler (İleride Doldurulacak)

**Backend:**
- 🚧 `backend/IntranetPortal.API/Controllers/` - API controllers
- 🚧 `backend/IntranetPortal.API/Middleware/` - Custom middleware
- 🚧 `backend/IntranetPortal.Application/Services/` - Business services
- 🚧 `backend/IntranetPortal.Domain/Entities/` - Domain entities
- 🚧 `backend/IntranetPortal.Infrastructure/Data/` - DbContext
- 🚧 `backend/IntranetPortal.Infrastructure/Migrations/` - EF migrations

**Frontend:**
- Tüm klasörler dolu ve çalışır durumda ✅

## 📋 Dosya İlişkileri

### Backend Dependencies
```
IntranetPortal.API
  ↓ depends on
IntranetPortal.Application
  ↓ depends on
IntranetPortal.Domain
  ↑ used by
IntranetPortal.Infrastructure
```

### Frontend Module Dependencies
```
App.tsx
  ├── LoginPage (public)
  ├── BirimSelection (auth required)
  └── AdminLayout (protected)
        ├── Dashboard
        ├── UserList
        ├── DepartmentList
        ├── RolePermissions
        └── Reports
```

### Documentation Cross-References
```
CLAUDE.md (Main Guide)
  ├── → PRD.md (Requirements)
  ├── → TECHNICAL_DESIGN.md (Architecture)
  ├── → ERD.md (Database)
  ├── → API_SPECIFICATION.md (API)
  ├── → SECURITY_ANALYSIS_REPORT.md (Security)
  ├── → IMPLEMENTATION_ROADMAP.md (Implementation)
  └── → DEPLOYMENT_GUIDE.md (Deployment)
```

## 🎯 Navigasyon Kılavuzu

### Yeni Bir Özellik Geliştirirken

1. **Requirement Check**: `PRD.md` → Özellik gereksinimlerini oku
2. **Architecture**: `TECHNICAL_DESIGN.md` → Mimari tasarımı incele
3. **Database**: `ERD.md` → Gerekli tabloları kontrol et
4. **API Design**: `API_SPECIFICATION.md` → Endpoint tasarımını gör
5. **Security**: `SECURITY_ANALYSIS_REPORT.md` → Güvenlik kontrollerini uygula
6. **Implementation**: `IMPLEMENTATION_ROADMAP.md` → Kod örneklerini kullan

### Backend Geliştirme Başlarken

1. `backend/README.md` → Setup talimatları
2. `TECHNICAL_DESIGN.md` → Layer sorumlulukları
3. `ERD.md` → Entity tanımları
4. `IMPLEMENTATION_ROADMAP.md` → Kod örnekleri

### Frontend Geliştirme Başlarken

1. `frontend/README.md` → Setup talimatları
2. `TECHNICAL_DESIGN.md` → Frontend mimari
3. `API_SPECIFICATION.md` → API endpoint'leri
4. Mevcut components'ı inceleyerek devam et

### Deployment Yaparken

1. `DEPLOYMENT_GUIDE.md` → Genel deployment kılavuzu
2. `WINDOWS_SERVER_DEPLOYMENT.md` → Windows Server özel
3. `backend/README.md` → Backend setup
4. `frontend/README.md` → Frontend build

## 🔍 Dosya Arama İpuçları

### Backend Kodunda
```bash
# Entity bul
find backend -name "*Entities*" -type d

# DbContext bul
find backend -name "*DbContext.cs"

# Controller bul
find backend -name "*Controller.cs"
```

### Frontend Kodunda
```bash
# Component bul
find frontend/src -name "*.tsx" | grep -i "component"

# Page bul
find frontend/src/features -name "*.tsx" | grep -i "page"

# Store bul
find frontend/src/store -name "*.ts"
```

### Dokümantasyon
```bash
# Güvenlik dokumanları
ls -la | grep -i "security"

# API dokumanları
ls -la | grep -i "api"

# Deployment dokumanları
ls -la | grep -i "deployment"
```

## 📊 Proje İstatistikleri

### Dosya Sayıları (Mevcut Durum)

| Kategori | Miktar | Durum |
|----------|--------|-------|
| **Documentation** | 14 dosya | ✅ Tamamlandı |
| **Backend Projects** | 4 proje | ✅ Oluşturuldu (İçi boş) |
| **Frontend Components** | 15+ dosya | ✅ Entegre edildi |
| **Configuration Files** | 8 dosya | ✅ Yapılandırıldı |

### Toplam Satır Sayısı (Tahmini)

| Katman | Satır Sayısı |
|--------|--------------|
| Documentation | ~8,000 satır |
| Frontend Code | ~2,500 satır |
| Backend Structure | ~500 satır (boş projeler) |
| Configuration | ~300 satır |
| **TOPLAM** | **~11,300 satır** |

## 🎯 Sonraki Adımlar

### Öncelik 1: Backend Implementation
1. `backend/IntranetPortal.Domain/Entities/` → Entity sınıfları
2. `backend/IntranetPortal.Infrastructure/Data/` → DbContext
3. `backend/IntranetPortal.Infrastructure/Migrations/` → Initial migration
4. `backend/IntranetPortal.Application/Services/` → Business services
5. `backend/IntranetPortal.API/Controllers/` → API endpoints

### Öncelik 2: Frontend-Backend Integration
1. Backend API'leri tamamla
2. Frontend API client'ı test et
3. Mock data'yı gerçek API ile değiştir
4. Authentication flow'u test et

### Öncelik 3: Testing & Deployment
1. Unit testler yaz
2. Integration testler yaz
3. Docker containerization
4. CI/CD pipeline kur

---

**Not:** Bu dosya proje yapısının bir snapshot'udur. Proje geliştikçe güncellenmeli.

**Son Güncelleme:** 2025-11-25
**Durum:** ✅ Proje Yapısı Organize Edildi
