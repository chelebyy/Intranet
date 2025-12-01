# 📋 Active Task List - Kurumsal İntranet Web Portalı

**Proje:** Kurumsal İntranet Web Portalı
**Versiyon:** 1.5
**Başlangıç:** 2025-11-25
**Son Güncelleme:** 2025-12-01
**Mevcut Faz:** Faz 3 - Multi-Unit Support (Başlıyor)

---

## 🎯 Geliştirme Metodolojisi

Bu proje **Task-Driven Development (TDD)** yaklaşımıyla geliştirilmektedir:

1. ✅ **Her görev tamamlandığında `[x]` işaretlenir**
2. ✅ **Her kod parçası referans dökümanlarla uyumlu olmalıdır.**
3. ✅ **Her aşama tamamlandığında bu dosya güncellenir.**

---

## 📚 Proje Döküman Referansları

### 🔴 KRİTİK DÖKÜMANLAR (Her Zaman Takip Edilmeli)

| Döküman | Amaç | Ne Zaman Kullanılır |
|---------|------|---------------------|
| **PRD.md** | Ürün gereksinimleri, kullanıcı hikayeleri, kapsam | Yeni özellik eklerken, scope kontrolü |
| **ERD.md** | Veritabanı şeması, entity ilişkileri, RBAC modeli | Entity/migration oluştururken |
| **API_SPECIFICATION.md** | Detaylı API endpoint tanımları | Controller/endpoint yazarken |
| **TECHNICAL_DESIGN.md** | Mimari, katman yapısı, güvenlik | Yeni servis/component eklerken |
| **SECURITY_ANALYSIS_REPORT.md** | OWASP uyumluluk, güvenlik gereksinimleri | Auth/güvenlik kodu yazarken |

### 🟡 GELİŞTİRME DÖKÜMANLAR (Faz Bazlı Takip)

| Döküman | Amaç | Ne Zaman Kullanılır |
|---------|------|---------------------|
| **IMPLEMENTATION_ROADMAP.md** | 6 fazlık yol haritası, task detayları | Faz planlaması, task önceliklendirme |
| **API_INDEX.md** | API endpoint özeti, permission listesi | Hızlı API referansı |
| **MODULAR_STRUCTURE.md** | Modül mimarisi, birim ekleme | Yeni birim modülü eklerken |
| **FILE_MANAGEMENT.md** | Dosya yükleme/indirme spesifikasyonu | Dosya işlemleri yazarken |

### 🟢 OPERASYONEL DÖKÜMANLAR (Gerektiğinde)

| Döküman | Amaç | Ne Zaman Kullanılır |
|---------|------|---------------------|
| **QUICK_START.md** | Hızlı kurulum rehberi | Yeni geliştirici onboarding |
| **DEPLOYMENT_GUIDE.md** | Production deployment | Deploy öncesi |
| **WINDOWS_SERVER_DEPLOYMENT.md** | Windows Server kurulum | Windows deploy |
| **ERRORS.md** | Bilinen hatalar ve çözümleri | Build/runtime hata alınca |
| **TECH_STACK.md** | Teknoloji stack detayları | Paket/versiyon kontrolü |

### 🔵 OTURUM/CHECKPOINT DÖKÜMANLAR (Arşiv)

| Döküman Tipi | Amaç |
|--------------|------|
| **SESSION_SUMMARY_*.md** | Oturum özeti, yapılan işler |
| **SESSION_CHECKPOINT_*.md** | Checkpoint kayıtları |
| **FAZ*_TAMAMLANDI.md** | Faz tamamlanma raporları |

### 📖 Döküman Kullanım Kuralları

1. **Yeni Endpoint Yazarken:**
   - `API_SPECIFICATION.md` → Endpoint detayları
   - `ERD.md` → Entity ilişkileri
   - `SECURITY_ANALYSIS_REPORT.md` → Permission gereksinimleri

2. **Yeni Entity/Migration Oluştururken:**
   - `ERD.md` → Tablo yapısı ve ilişkiler
   - `TECHNICAL_DESIGN.md` → Naming convention

3. **Frontend Component Yazarken:**
   - `PRD.md` → Kullanıcı hikayeleri
   - `API_INDEX.md` → API endpoint listesi

4. **Hata Alındığında:**
   - `ERRORS.md` → Bilinen hatalar ve çözümler
   - İlgili `SESSION_SUMMARY_*.md` → Geçmiş çözümler

---

## 📊 Faz Durumu

| Faz | Durum | Tamamlanma | Süre Tahmini |
|-----|-------|------------|--------------|
| Faz 0: Proje Kurulumu | ✅ TAMAMLANDI | 100% | 1-2 hafta |
| Faz 1: Authentication & Core | ✅ TAMAMLANDI | 100% | 1-2 hafta |
| Faz 2: RBAC & Admin Panel | ✅ TAMAMLANDI | 100% | 2-3 hafta |
| Faz 3: Multi-Unit Support | 🔄 BAŞLIYOR | 0% | 1-2 hafta |
| Faz 4: First Unit Module (HR) | ⚪ BEKLİYOR | 0% | 2-3 hafta |
| Faz 5: Second Unit Module (IT) | ⚪ BEKLİYOR | 0% | 2-3 hafta |
| Faz 6: Testing & Optimization | ⚪ BEKLİYOR | 0% | 2-3 hafta |

---

# FAZ 2: RBAC & ADMIN PANEL (Hafta 3-4)

## 🎯 Hedef
Rol tabanlı erişim kontrolü ve yönetim paneli API'lerinin geliştirilmesi.

## 📄 İlgili Dökümanlar
- **API_SPECIFICATION.md** - User, Role, Birim endpoint tanımları
- **ERD.md** - Role, Permission, UserBirimRole ilişkileri
- **SECURITY_ANALYSIS_REPORT.md** - RBAC güvenlik gereksinimleri

---

## 1. Yetkilendirme Altyapısı (Authorization)
- [x] `[HasPermission]` attribute oluşturma (Custom Authorization Attribute) - ✅ TAMAMLANDI
  - `HasPermissionAttribute.cs` oluşturuldu
  - `PermissionAuthorizationFilter.cs` oluşturuldu
  - `IPermissionService` ve `PermissionService` (Cache destekli) implement edildi
  - `Program.cs` servis kayıtları yapıldı (MemoryCache dahil)
- [x] Permission Caching optimizasyonu (Zaten PermissionService içinde var, test edilmeli)
- [x] ClaimsPrincipal extension methods (User.GetId(), User.GetRole() vb.) - ✅ TAMAMLANDI

## 2. User Management API
- [x] **GET /api/users** - List users (pagination, search, filter)
- [x] **GET /api/users/{id}** - Get user details
- [x] **POST /api/users** - Create new user
- [x] **PUT /api/users/{id}** - Update user details
- [x] **DELETE /api/users/{id}** - Soft delete user
- [x] **POST /api/users/{id}/reset-password** - Reset user password

## 3. Role & Birim Management API
- [x] **GET /api/roles** - List all roles
- [x] **POST /api/roles** - Create new role
- [x] **PUT /api/roles/{id}** - Update role
- [x] **DELETE /api/roles/{id}** - Delete role
- [x] **GET /api/birimler** - List all units
- [x] **POST /api/birimler** - Create new unit
- [x] **PUT /api/birimler/{id}** - Update unit

## 4. Permission Management
- [x] **GET /api/permissions** - List system permissions
- [x] **POST /api/roles/{id}/permissions** - Assign permissions to role
- [x] **GET /api/roles/{id}/permissions** - Get role permissions
- [x] **Frontend Integration** - Role Permissions page implemented

## 5. Frontend: Admin Panel Sayfaları
- [x] **UserList.tsx** - Backend API entegrasyonu ✅ TAMAMLANDI
- [x] **DepartmentList.tsx** - Birim CRUD UI ✅ TAMAMLANDI
- [ ] **AuditLogs.tsx** - Audit log görüntüleme sayfası (opsiyonel - Faz 6'ya ertelenebilir)

---

## 🚨 Faz 2 Notları
- User creation sırasında şifre karmaşıklığı kontrol edilmeli (PasswordService hazır).
- Soft delete mantığı tüm silme işlemlerinde uygulanmalı (IsActive = false).
- Admin endpoint'leri mutlaka `[HasPermission(Permissions.User.Manage)]` gibi attribute'larla korunmalı.
- Permission constant'ları `Permissions.cs` içinde güncellendi ve endpoint'lere uygulandı.
- Frontend `react-hot-toast` eklendi.
- Frontend performans optimizasyonu (Code Splitting) yapıldı.
- Backend Dependency Injection (RolesController) düzeltildi.
