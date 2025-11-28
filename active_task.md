# 📋 Active Task List - Kurumsal İntranet Web Portalı

**Proje:** Kurumsal İntranet Web Portalı
**Versiyon:** 1.2
**Başlangıç:** 2025-11-25
**Mevcut Faz:** Faz 2 - RBAC & Admin Panel (Devam Ediyor)

---

## 🎯 Geliştirme Metodolojisi

Bu proje **Task-Driven Development (TDD)** yaklaşımıyla geliştirilmektedir:

1. ✅ **Her görev tamamlandığında `[x]` işaretlenir**
2. ✅ **Her kod parçası referans dökümanlarla uyumlu olmalıdır.**
3. ✅ **Her aşama tamamlandığında bu dosya güncellenir.**

---

## 📊 Faz Durumu

| Faz | Durum | Tamamlanma | Süre Tahmini |
|-----|-------|------------|--------------|
| Faz 0: Proje Kurulumu | ✅ TAMAMLANDI | 100% | 1-2 hafta |
| Faz 1: Authentication & Core | ✅ TAMAMLANDI | 100% | 1-2 hafta |
| Faz 2 | RBAC & Admin Panel | 🔄 DEVAM EDİYOR | 70% | 2-3 hafta |
| Faz 3: Multi-Unit Support | ⚪ BEKLİYOR | 0% | 1-2 hafta |
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
- [ ] Permission Caching optimizasyonu (Zaten PermissionService içinde var, test edilmeli)
- [ ] ClaimsPrincipal extension methods (User.GetId(), User.GetRole() vb.)

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
- [ ] **GET /api/permissions** - List system permissions
- [ ] **POST /api/roles/{id}/permissions** - Assign permissions to role
- [ ] **GET /api/roles/{id}/permissions** - Get role permissions

---

## 🚨 Faz 2 Notları
- User creation sırasında şifre karmaşıklığı kontrol edilmeli (PasswordService hazır).
- Soft delete mantığı tüm silme işlemlerinde uygulanmalı (IsActive = false).
- Admin endpoint'leri mutlaka `[HasPermission(Permissions.User.Manage)]` gibi attribute'larla korunmalı.
- Permission constant'ları `Permissions.cs` içinde güncellendi ve endpoint'lere uygulandı.
