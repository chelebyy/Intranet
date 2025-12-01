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

> ⚠️ **ÖNEMLİ:** Bir faz "TAMAMLANDI" olarak işaretlenmeden önce, `docs/technical/IMPLEMENTATION_ROADMAP.md` dosyasındaki ilgili fazın **tüm tamamlanma kriterleri** kontrol edilmeli ve doğrulanmalıdır. Eksik kriter varsa faz tamamlanmış sayılmaz!

---

## 📚 Proje Döküman Referansları

### 🔴 KRİTİK DÖKÜMANLAR (Her Zaman Takip Edilmeli)

| Döküman | Amaç | Ne Zaman Kullanılır |
|---------|------|---------------------|
| **docs/general/PRD.md** | Ürün gereksinimleri, kullanıcı hikayeleri, kapsam | Yeni özellik eklerken, scope kontrolü |
| **docs/technical/ERD.md** | Veritabanı şeması, entity ilişkileri, RBAC modeli | Entity/migration oluştururken |
| **docs/api/API_SPECIFICATION.md** | Detaylı API endpoint tanımları | Controller/endpoint yazarken |
| **docs/technical/TECHNICAL_DESIGN.md** | Mimari, katman yapısı, güvenlik | Yeni servis/component eklerken |
| **docs/reports/SECURITY_ANALYSIS_REPORT.md** | OWASP uyumluluk, güvenlik gereksinimleri | Auth/güvenlik kodu yazarken |

### 🟡 GELİŞTİRME DÖKÜMANLAR (Faz Bazlı Takip)

| Döküman | Amaç | Ne Zaman Kullanılır |
|---------|------|---------------------|
| **docs/technical/IMPLEMENTATION_ROADMAP.md** | 6 fazlık yol haritası, task detayları | Faz planlaması, task önceliklendirme |
| **docs/api/API_INDEX.md** | API endpoint özeti, permission listesi | Hızlı API referansı |
| **docs/technical/MODULAR_STRUCTURE.md** | Modül mimarisi, birim ekleme | Yeni birim modülü eklerken |
| **docs/technical/FILE_MANAGEMENT.md** | Dosya yükleme/indirme spesifikasyonu | Dosya işlemleri yazarken |

### 🟢 OPERASYONEL DÖKÜMANLAR (Gerektiğinde)

| Döküman | Amaç | Ne Zaman Kullanılır |
|---------|------|---------------------|
| **QUICK_START.md** | Hızlı kurulum rehberi | Yeni geliştirici onboarding |
| **docs/deployment/DEPLOYMENT_GUIDE.md** | Production deployment | Deploy öncesi |
| **docs/deployment/WINDOWS_SERVER_DEPLOYMENT.md** | Windows Server kurulum | Windows deploy |
| **docs/reports/ERRORS.md** | Bilinen hatalar ve çözümleri | Build/runtime hata alınca |
| **docs/technical/TECH_STACK.md** | Teknoloji stack detayları | Paket/versiyon kontrolü |

### 🔵 OTURUM/CHECKPOINT DÖKÜMANLAR (Arşiv)

| Döküman Tipi | Amaç |
|--------------|------|
| **SESSION_SUMMARY_*.md** | Oturum özeti, yapılan işler |
| **SESSION_CHECKPOINT_*.md** | Checkpoint kayıtları |
| **FAZ*_TAMAMLANDI.md** | Faz tamamlanma raporları |

### 📖 Döküman Kullanım Kuralları

1. **Yeni Endpoint Yazarken:**
   - `docs/api/API_SPECIFICATION.md` → Endpoint detayları
   - `docs/technical/ERD.md` → Entity ilişkileri
   - `docs/reports/SECURITY_ANALYSIS_REPORT.md` → Permission gereksinimleri

2. **Yeni Entity/Migration Oluştururken:**
   - `docs/technical/ERD.md` → Tablo yapısı ve ilişkiler
   - `docs/technical/TECHNICAL_DESIGN.md` → Naming convention

3. **Frontend Component Yazarken:**
   - `docs/general/PRD.md` → Kullanıcı hikayeleri
   - `docs/api/API_INDEX.md` → API endpoint listesi

4. **Hata Alındığında:**
   - `docs/reports/ERRORS.md` → Bilinen hatalar ve çözümler
   - İlgili `SESSION_SUMMARY_*.md` → Geçmiş çözümler

---

## 📊 Faz Durumu

| Faz | Durum | Tamamlanma | Süre Tahmini |
|-----|-------|------------|--------------|
| Faz 0: Proje Kurulumu | ✅ TAMAMLANDI | 100% |
| Faz 1: Authentication & Core | ✅ TAMAMLANDI | 100% |
| Faz 2: RBAC & Admin Panel | ✅ TAMAMLANDI | 100% |
| Faz 3: Multi-Unit Support | 🔄 DEVAM EDİYOR | 70% | 
| Faz 4: First Unit Module (HR) | ⚪ BEKLİYOR | 0% 
| Faz 5: Second Unit Module (IT) | ⚪ BEKLİYOR | 0% 
| Faz 6: Testing & Optimization | ⚪ BEKLİYOR | 0% | 

---

# FAZ 1: AUTHENTICATION & CORE (Hafta 1-2)

## 🎯 Hedef
Temel kimlik doğrulama sistemi ve güvenlik altyapısının kurulması.

## 📄 İlgili Dökümanlar
- **docs/technical/IMPLEMENTATION_ROADMAP.md** - Faz 1 detayları (satır 894-904)
- **docs/reports/SECURITY_ANALYSIS_REPORT.md** - Güvenlik gereksinimleri
- **docs/technical/TECHNICAL_DESIGN.md** - JWT ve güvenlik mimarisi

---

## 1. Database & Seeding
- [x] PostgreSQL'de tüm temel tablolar oluşturuldu
- [x] İlk admin kullanıcı seed edildi (Sicil: 00001 / Şifre: Admin123!)
- [x] Roller ve Permission'lar seed edildi

## 2. Authentication API
- [x] **POST /api/auth/login** - Login endpoint çalışıyor
- [x] JWT token dönüyor (HttpOnly cookie)
- [x] **POST /api/auth/logout** - Logout endpoint
- [x] **POST /api/auth/select-birim** - Birim seçimi

## 3. Frontend Login
- [x] Login sayfası backend ile entegre
- [x] Birim seçim sayfası çalışıyor
- [x] JWT token yönetimi (cookie-based)

## 4. Security Middleware
- [x] **IP Whitelist Middleware** - ✅ TAMAMLANDI
  - `IPWhitelistMiddleware.cs` oluşturuldu
  - CIDR notation desteği (192.168.0.0/16 vb.)
  - Konfigürasyon: `appsettings.json` → `SecuritySettings:IPWhitelist`
- [x] **Rate Limiting Middleware** - ✅ TAMAMLANDI
  - `RateLimitingMiddleware.cs` oluşturuldu
  - Login endpoint için özel limit (5 deneme/dakika)
  - Genel limit: 100 istek/dakika
  - Konfigürasyon: `appsettings.json` → `SecuritySettings:RateLimiting`

---

## ✅ Faz 1 Tamamlanma Kriterleri (docs/technical/IMPLEMENTATION_ROADMAP.md)
- [x] PostgreSQL'de tüm temel tablolar oluşturuldu
- [x] İlk admin kullanıcı seed edildi
- [x] Login endpoint çalışıyor ve JWT token dönüyor
- [x] Frontend login sayfası backend ile entegre
- [x] IP whitelist middleware aktif
- [x] Rate limiting (5 deneme/dakika) çalışıyor

---

# FAZ 2: RBAC & ADMIN PANEL (Hafta 3-4)

## 🎯 Hedef
Rol tabanlı erişim kontrolü ve yönetim paneli API'lerinin geliştirilmesi.

## 📄 İlgili Dökümanlar
- **docs/api/API_SPECIFICATION.md** - User, Role, Birim endpoint tanımları
- **docs/technical/ERD.md** - Role, Permission, UserBirimRole ilişkileri
- **docs/reports/SECURITY_ANALYSIS_REPORT.md** - RBAC güvenlik gereksinimleri

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

---

# FAZ 3: MULTI-UNIT SUPPORT (Hafta 5-6)

## 🎯 Hedef
Çok birimli kullanıcı desteğini tamamlamak ve birim seçim/değiştirme özelliğini eklemek.

## 📄 İlgili Dökümanlar
- **docs/technical/IMPLEMENTATION_ROADMAP.md** - Faz 3 detayları (satır 1299-1509)
- **docs/technical/TECHNICAL_DESIGN.md** - Multi-Unit mimarisi
- **docs/api/API_SPECIFICATION.md** - Auth endpoint'leri

---

## 1. Backend: Birim Değiştirme API
- [x] **POST /api/auth/select-birim** - Birim değiştirme endpoint'i ✅ ZATEN MEVCUT
  - Kullanıcının birimde yetkisi kontrol ediliyor
  - Yeni JWT token üretiliyor (birim bilgisi ile)
  - HttpOnly cookie güncelleniyor

## 2. Frontend: Birim Seçim Entegrasyonu
- [x] **authApi.ts** - `selectBirim` endpoint'i eklendi ✅ TAMAMLANDI
- [x] **BirimSelection.tsx** - Backend API ile entegre edildi ✅ TAMAMLANDI
  - Loading state eklendi
  - Toast bildirim eklendi
  - Hata yönetimi eklendi

## 3. Frontend: Auth Store Güncellemeleri
- [x] **authStore.ts** - `setSelectedBirimRole` fonksiyonu eklendi ✅ TAMAMLANDI
- [x] **types/index.ts** - `SelectedBirimInfo`, `SelectedRoleInfo` tipleri eklendi ✅ TAMAMLANDI
- [x] **currentBirimInfo** ve **currentRoleInfo** state'leri eklendi

## 4. Frontend: usePermission Hook
- [x] **hooks/usePermission.ts** - Permission kontrol hook'u oluşturuldu ✅ TAMAMLANDI
  - `hasPermission(resource, action)` fonksiyonu
  - `hasAnyPermission(checks)` fonksiyonu
  - SuperAdmin kontrolü
  - Permission constants

## 5. Frontend: Header & Birim Switcher
- [x] **Header.tsx** - Birim değiştirme dropdown'u eklendi ✅ TAMAMLANDI
  - Çok birimli kullanıcılar için dropdown
  - Tek birimli kullanıcılar için statik gösterim
  - Kullanıcı bilgisi ve çıkış butonu
- [x] **AdminLayout.tsx** - Header entegre edildi ✅ TAMAMLANDI
- [x] **lucide-react** paketi eklendi

---

## ✅ Faz 3 Tamamlanma Kriterleri (docs/technical/IMPLEMENTATION_ROADMAP.md)
- [x] Birim değiştirme endpoint'i çalışıyor
- [x] Çok birimli kullanıcı login sonrası birim seçim ekranını görüyor
- [x] Seçilen birime göre yeni token alınıyor
- [ ] Protected route component çalışıyor (kısmen - temel yapı mevcut)
- [ ] Birim değişimi ≤ 1 saniye sürüyor (test edilmeli)
- [ ] Her birimde farklı menü yapısı gösteriliyor (hazırlık - sonraki iterasyon)

---

## 🚨 Faz 3 Notları
- Birim değiştirme sonrası sayfa yenileniyor (window.location.reload) - optimal değil ama işlevsel
- usePermission hook oluşturuldu ancak henüz Protected Route'a tam entegre edilmedi
- Her birimde farklı menü gösterimi Faz 4-5'te tamamlanacak (modül bazlı)
