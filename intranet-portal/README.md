# Kurumsal İntranet Web Portalı

Güvenli, rol tabanlı erişim kontrollü ve modüler kurumsal intranet web portalı.

**Durum:** Faz 4 (Duyuru Sistemi) Tamamlandı | **Versiyon:** 1.4

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
    │   ├── features/                # Feature modules (IT, Admin, Auth, etc.)
    │   ├── shared/                  # Shared components
    │   ├── api/                     # API client
    │   ├── store/                   # State management
    │   └── types/                   # TypeScript types
```

## 🚀 Hızlı Başlangıç

### Gereksinimler
- **.NET 9 SDK**
- **Node.js 22+**
- **PostgreSQL 16**

### Backend Başlatma
```bash
cd backend
dotnet restore
dotnet run --project IntranetPortal.API
```
> Varsayılan: `https://localhost:5001`

### Frontend Başlatma
```bash
cd frontend
npm install
npm run dev
```
> Varsayılan: `http://localhost:5173`

## 📚 Dokümantasyon

Tüm proje dokümantasyonu `docs/` klasöründe organize edilmiştir.

### 📌 Ana İndeksler
- **[PROJECT_INDEX.md](../docs/general/PROJECT_INDEX.md)** - **Ana Başlangıç Noktası**
- **[PROJECT_STRUCTURE.md](../docs/technical/PROJECT_STRUCTURE.md)** - Dosya ve Modül Yapısı
- **[API_INDEX.md](../docs/api/API_INDEX.md)** - API Referansı

### 🛠️ Teknik Rehberler
- **[IMPLEMENTATION_ROADMAP.md](../docs/technical/IMPLEMENTATION_ROADMAP.md)** - Geliştirme Yol Haritası
- **[API_SPECIFICATION.md](../docs/api/API_SPECIFICATION.md)** - Detaylı API Spesifikasyonu
- **[ERD.md](../docs/technical/ERD.md)** - Veritabanı Şeması

## 🔐 Güvenlik Özellikleri
- **JWT Authentication** (HttpOnly Cookie)
- **RBAC** (Rol Bazlı Erişim Kontrolü)
- **IP Whitelist** (Erişim Kısıtlama)
- **AES-256 Encryption** (Hassas Veriler)
- **Audit Logging** (Detaylı Loglama)

## 📋 Özellikler

### Tamamlanan Modüller (v1.4)
- ✅ **Core:** Auth, Users, Roles, Permissions, Units
- ✅ **Admin:** Dashboard, System Settings, Audit Logs
- ✅ **Tools:** Database Maintenance, Backup Manager, IP Whitelist
- ✅ **Communication:** Announcement System (Duyuru & Uyarılar)
- ✅ **Business:** IT Module (Arıza & Envanter), General Budget Module

### Devam Eden (Faz 5)
- 🔄 **Document Management:** Dosya yükleme, versiyonlama ve yetkilendirme.

---

**Son Güncelleme:** 17 Aralık 2025
