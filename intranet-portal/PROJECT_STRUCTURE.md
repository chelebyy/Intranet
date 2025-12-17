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
│   │   │   ├── Controllers/           # API endpoints (Active)
│   │   │   │   ├── AnnouncementsController.cs # 📢 Announcement API
│   │   │   │   ├── MaintenanceController.cs   # 🔧 DB Maintenance
│   │   │   │   ├── BackupController.cs        # 💾 Backup Mgmt
│   │   │   │   ├── UsersController.cs         # 👥 User Mgmt
│   │   │   │   ├── IPRestrictionsController.cs# 🛡️ IP Whitelist
│   │   │   │   └── ... (Other Controllers)
│   │   │   ├── Middleware/            # Custom middleware
│   │   │   ├── Filters/               # Authorization attributes
│   │   │   ├── Program.cs             # App entry point
│   │   │   └── appsettings.json       # Configuration
│   │   │
│   │   ├── IntranetPortal.Application/ # 💼 Business Logic Layer
│   │   │   ├── Services/              # Business services
│   │   │   │   ├── MaintenanceService.cs  # 🔧 Maintenance Logic
│   │   │   │   ├── BackupService.cs       # 💾 Backup Logic
│   │   │   │   ├── AnnouncementService.cs # 📢 Announcement Logic
│   │   │   │   └── ...
│   │   │   ├── DTOs/                  # Data transfer objects
│   │   │   │   ├── Maintenance/       # Maintenance DTOs
│   │   │   │   ├── Backup/            # Backup DTOs
│   │   │   │   └── ...
│   │   │   ├── Interfaces/            # Service contracts
│   │   │   └── Validators/            # FluentValidation rules
│   │   │
│   │   ├── IntranetPortal.Domain/     # 📦 Domain Layer
│   │   │   ├── Entities/              # Database models
│   │   │   │   ├── Announcement.cs    # 📢 Announcement Entity
│   │   │   │   ├── AnnouncementTarget.cs # Target Audience
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
│   │   │
│   │   ├── src/
│   │   │   ├── features/              # 🎯 Feature-based modules
│   │   │   │   ├── auth/              # Authentication
│   │   │   │   ├── admin/             # Admin panel
│   │   │   │   ├── it/                # 💻 IT Module (New)
│   │   │   │   ├── genelButce/        # 💰 General Budget (New)
│   │   │   │   └── test-unit/         # 🧪 Unit Testing Module
│   │   │   │
│   │   │   ├── shared/                # 🔄 Shared components
│   │   │   │   ├── components/
│   │   │   │   ├── layouts/
│   │   │   │   └── hooks/
│   │   │   │
│   │   │   ├── api/                   # 🌐 API client layer
│   │   │   ├── store/                 # 💾 State management
│   │   │   ├── types/                 # 📝 TypeScript types
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
│   ├── CLAUDE.md                       # Project guide for AI Assistants
│   ├── PROJECT_INDEX.md                # Documentation index
│   │
│   ├── TECHNICAL_DESIGN.md             # Architecture & design
│   ├── ERD.md                          # Database schema + SQL
│   ├── API_SPECIFICATION.md            # API documentation
│   ├── API_INDEX.md                    # API quick reference
│   │
│   ├── SECURITY_ANALYSIS_REPORT.md     # OWASP security analysis
│   ├── IMPLEMENTATION_ROADMAP.md       # Implementation phases
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
│   └── GEMINI.md                       # AI Rules
│
└── docs/                               # Additional documentation
```

## 🗂️ Dosya Kategorileri (Güncel Durum)

### ✅ Tamamlanan Modüller

**Backend:**
- ✅ `backend/IntranetPortal.API/Controllers/` - **12 Active Controllers**
    - `MaintenanceController`, `BackupController`, `IPRestrictionsController`, `AnnouncementsController`...
- ✅ `backend/IntranetPortal.Application/Services/` - **14 Business Services**
    - Corresponds 1:1 with controllers.
- ✅ `backend/IntranetPortal.Domain/Entities/` - **14 Entities**
    - Core logic and DB models implemented.
- ✅ `backend/IntranetPortal.Infrastructure/Migrations/` - **Active Migrations**
    - Database is fully up to date with latest features.

**Frontend:**
- ✅ `frontend/src/features/it/` - IT Module implemented
- ✅ `frontend/src/features/genelButce/` - Budgeting module implemented
- ✅ `frontend/src/features/test-unit/` - Testing module implemented
- ✅ `auth` & `admin` modules fully active.

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
        ├── RolePermissions
        ├── MaintenancePage (NEW)
        ├── BackupPage (NEW)
        ├── IT Module Routes
        └── Genel Butce Routes
```

## 🎯 Sonraki Adımlar
1. **Frontend-Backend Integration Test:** Verify new Maintenance/Backup endpoints from UI.
2. **Unit Testing:** Write comprehensive tests for the new `MaintenanceService` and `BackupService`.

---

**Son Güncelleme:** 2025-12-17
**Durum:** ✅ GÜNCEL (Full Implementation Reflected)
