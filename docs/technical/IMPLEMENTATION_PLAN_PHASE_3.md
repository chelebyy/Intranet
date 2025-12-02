# 📋 Uygulama Planı: Birim Bazlı Dinamik Bağlam (Faz 3)

**Tarih:** 2 Aralık 2025
**İlgili Tasarım:** [DESIGN_UNIT_BASED_CONTEXT.md](./DESIGN_UNIT_BASED_CONTEXT.md)
**Hedef:** Faz 3 - Çoklu Birim ve Rol Yönetimi'nin teknik tasarımını hayata geçirmek.

Bu plan, sistemin "Global Rol" yapısından "Birim Bazlı Rol" yapısına geçişini ve her birimin izole bir modül gibi çalışmasını sağlamayı hedefler.

## 1. Backend Geliştirmeleri (API & Core)

Veri güvenliği ve bağlam yönetimi için temel altyapı.

- [x] **Helper Method Geliştirmesi:**
    - [x] `IntranetPortal.API/Extensions/ClaimsPrincipalExtensions.cs` dosyasını güncelle.
    - [x] `GetBirimId()` metodunu ekle (Token'dan `birimId` claim'ini integer olarak dönecek).
    - [x] `GetRoleName()` ve `GetSicil()` metodlarını ekle (Loglama ve kontrol kolaylığı için).

- [x] **Controller Refactoring (Veri İzolasyonu):**
    - [x] `UsersController.cs` -> `GetUsers` metodunu güncelle:
        - [x] Aktif `BirimID`'yi al.
        - [x] Eğer kullanıcı `SuperAdmin` değilse, veritabanı sorgusuna `.Where(u => u.UserBirimRoles.Any(ubr => ubr.BirimID == activeBirimId))` filtresini ekle.
    - [ ] (Opsiyonel) Diğer ana modüller (`BirimlerController` vb.) için de benzer filtreleme kontrollerini yap.

- [x] **Kullanıcı Yetki Yönetimi API'leri (Admin Panel İçin):**
    - [x] `UsersController.cs` içine yeni endpoint'ler ekle:
        - [x] `GET /api/users/{id}/assignments`: `GetUserById` zaten bu veriyi (`BirimRoles`) döndüğü için ayrı endpoint yerine mevcut yapı kullanıldı.
        - [x] `POST /api/users/{id}/birim-role`: Mevcut `AddBirimRoleAssignment` kullanıldı.
        - [x] `DELETE /api/users/{id}/birim-role/{birimId}`: Mevcut `RemoveBirimRoleAssignment` kullanıldı.

## 2. Frontend Geliştirmeleri (React UI)

Kullanıcı deneyimi ve bağlam yönetimi arayüzleri.

- [x] **State Management (Store):**
    - [x] `store/authStore.ts` güncelle:
        - [x] Login response içindeki `birimler` listesini store'a kaydet.
        - [x] `selectedBirim` ve `currentBirimInfo` state'lerini ekle.

- [x] **Context Switcher (Birim Değiştirici Bileşeni):**
    - [x] `features/auth/BirimSelection.tsx` sayfasını oluştur (İlk giriş için).
    - [x] `components/layout/Header.tsx` içine dropdown ekle (Panel içi geçiş için).
    - [x] Seçim yapıldığında `/api/auth/select-birim` servisini çağır ve sayfayı yenile (veya navigate).

- [x] **Admin Panel - Kullanıcı Yönetimi:**
    - [x] `features/admin/pages/UserEdit.tsx` sayfasını güncelle.
    - [x] "Birim & Rol Atamaları" tabı ekle.
    - [x] Mevcut yetkileri listeleme ve silme özelliği ekle.
    - [x] Yeni birim/rol atama modalı ekle.

- [x] **Routing (Yönlendirme):**
    - [x] `App.tsx` güncellemesi.
    - [x] State-based Context yönetimi tercih edildi (URL kirliliğini önlemek için). Token değiştiğinde tüm uygulama o birim bağlamında çalışıyor.

## 3. Test ve Doğrulama (QA)

Yapılan değişikliklerin güvenliğini doğrulama.

- [ ] **Senaryo 1: Login & Context Switch**
    - [ ] Birden fazla birimde yetkili kullanıcı ile giriş yap.
    - [ ] "Birim Seç" ekranının geldiğini veya varsayılan birimin açıldığını doğrula.
    - [ ] Birim değiştirince menülerin ve verilerin değiştiğini teyit et.

- [ ] **Senaryo 2: Veri İzolasyonu**
    - [ ] "Bilgi İşlem" birimindeyken oluşturulan bir verinin (örn. Duyuru veya Personel kaydı), "Personel Bürosu" birimine geçince **görünmediğini** doğrula.

- [ ] **Senaryo 3: Yetki Atama**
    - [ ] Admin ile bir kullanıcıya yeni bir birim yetkisi ver.
    - [ ] O kullanıcı ile giriş yapıp yeni birimi görüp göremediğini kontrol et.
