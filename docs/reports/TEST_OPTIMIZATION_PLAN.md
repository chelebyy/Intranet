# ✅ Faz 2: Test ve Optimizasyon Planı

Bu döküman, **Kurumsal İntranet Web Portalı** projesinin Faz 2 (RBAC & Admin Panel) aşamasının doğrulanması ve iyileştirilmesi için gereken adımları içerir.

## 1. Manuel API Testleri (Swagger/Postman)

### 🛡️ Role Management (Rol Yönetimi)
- [ ] **GET /api/roles:** Tüm roller listeleniyor mu?
- [ ] **POST /api/roles:** Yeni rol oluşturulabiliyor mu? (Benzersiz isim kontrolü çalışıyor mu?)
- [ ] **PUT /api/roles/{id}:** Rol adı ve açıklaması güncellenebiliyor mu?
- [ ] **DELETE /api/roles/{id}:** 
  - [ ] Kullanıcısı olmayan boş bir rol silinebiliyor mu?
  - [ ] **Kritik:** Kullanıcı atanmış bir rol silinmeye çalışıldığında `400 Bad Request` hatası dönüyor mu?

### 🏢 Birim Management (Birim Yönetimi)
- [ ] **GET /api/birimler:** Tüm birimler listeleniyor mu?
- [ ] **POST /api/birimler:** Yeni birim oluşturulabiliyor mu?
- [ ] **DELETE /api/birimler/{id}:** Silme işlemi sonrası veritabanında satır duruyor ama `IsActive` false oluyor mu? (Soft Delete)

### 🔑 Permission Management (Yetki Yönetimi)
- [ ] **GET /api/permissions:** Sistemdeki tüm permission listesi geliyor mu?
- [ ] **GET /api/roles/{id}/permissions:** Bir rolün mevcut yetkileri doğru geliyor mu?
- [ ] **POST /api/roles/{id}/permissions:**
  - [ ] Yeni yetki seti atandığında veritabanı güncelleniyor mu?
  - [ ] Eskiden olan ama yeni sette olmayan yetkiler siliniyor mu?

## 2. Güvenlik Testleri (Security)

### 🚫 Yetkisiz Erişim (RBAC Kontrolü)
*Senaryo: SistemAdmin yetkisi OLMAYAN bir kullanıcı (Token) ile test edin.*
- [ ] `/api/roles` endpoint'ine istek atıldığında `403 Forbidden` dönüyor mu?
- [ ] `/api/users` endpoint'ine istek atıldığında `403 Forbidden` dönüyor mu?
- [ ] Token süresi dolmuşsa veya token yoksa `401 Unauthorized` dönüyor mu?

### 💾 Cache Invalidasyonu
- [ ] Bir role yeni bir yetki atayın.
- [ ] Sunucuyu **kapatıp açmadan**, o role sahip bir kullanıcı ile yeni yetki gerektiren bir işlem yapın.
- [ ] Sistemin değişikliği hemen algılayıp işleme izin verip vermediğini kontrol edin.

## 3. Frontend UI/UX Testleri

### 👤 Rol ve İzin Sayfası (`/roles`)
- [ ] Sol menüden rol seçildiğinde sağ tarafta checkbox'lar güncelleniyor mu?
- [ ] "Tümünü Seç" kutucuğu o gruptaki tüm izinleri seçip bırakıyor mu?
- [ ] "Kaydet" butonuna basıldığında:
  - [ ] Buton "Kaydediliyor..." durumuna geçiyor mu?
  - [ ] Başarılı işlem sonrası yeşil bir bildirim (Toast) çıkıyor mu?
  - [ ] Hata durumunda kırmızı bir bildirim çıkıyor mu?

### 🖥️ Genel Arayüz
- [ ] Menüde "Admin Paneli" linki sadece yetkili kullanıcılara mı görünüyor? (Sidebar kontrolü)
- [ ] Mobil görünümde (tarayıcıyı daraltınca) tablolar ve formlar düzgün görünüyor mu?

## 4. Teknik Optimizasyon (Code Quality)

### ⚡ Frontend Performance (Code Splitting)
- [ ] `npm run build` çıktısındaki "Large Chunk" uyarısını gidermek için `React.lazy` implementasyonu yapılması.
  - *Hedef:* Sayfaların (Dashboard, Users, Roles) sadece ihtiyaç duyulduğunda yüklenmesi.

### 🛠️ Backend Refactoring
- [ ] `PermissionsController` içinde hard-coded servis kullanımı (`HttpContext.RequestServices`) varsa Constructor Injection'a çevrilmesi.
- [ ] Controller'larda `try-catch` bloklarının middleware seviyesinde (Global Exception Handler) yönetilmesi (Opsiyonel - Faz 6'ya bırakılabilir).

---

## 📝 Test Notları
*Buraya test sırasında karşılaştığınız hataları not edebilirsiniz.*

1. 
2. 
3. 
