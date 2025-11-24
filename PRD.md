# Kurumsal İntranet Web Portalı PRD – Final Versiyon

**Proje Adı:** Kurumsal İntranet Web Portalı  
**Versiyon:** 1.0  
**Tarih:** 2025  
**Hazırlayan:** (Product Manager)

---

## 1. Amaç (Purpose)

Bu proje, kurum içi iletişim, bilgi akışı ve birimler arası koordinasyonu kolaylaştırmak amacıyla geliştirilmiş **çok birimli, güvenli ve role dayalı yetkilendirme (RBAC)** yapısına sahip bir **Kurumsal İntranet Web Portalı** çözümüdür.  
Sistem yalnızca **lokal ağda** çalışacak, internet bağlantısı gerektirmeyecektir. Güvenlik, performans ve modülerlik önceliklidir.

---

## 2. Kapsam (Scope)

### ✔ Sistem Özellikleri

- Çok birimli yapı (Multi-Birim)  
- Kullanıcı ve rol yönetimi  
- Birim bazlı sayfalar ve içerik modülleri  
- Admin paneli (kullanıcı, rol, birim yönetimi)  
- RBAC ile rol bazlı erişim  
- IP/IP bloğu bazlı erişim kısıtlama  
- PostgreSQL üzerinde veri şifreleme  
- Windows ve Linux sunucularda çalışabilirlik  
- 100–200 eşzamanlı kullanıcıyı destekleyen performans  
- Audit loglama  
- Modüler yapı ve yeni birim ekleme desteği  
- Docker ile çalıştırılabilirlik opsiyonel  

### ❌ Kapsam Dışı

- İnternet erişimi
- Mobil uygulama
- Dış sistem entegrasyonu
- Cloud ortamı
- Çoklu dil desteği (şimdilik)
- **E-posta bildirimleri** (SMTP entegrasyonu yok)
- **Onay workflow'ları** (approval mekanizması yok - tüm işlemler direkt gerçekleşir)  

---

## 3. Kullanıcı Tipleri (User Types)

| Rol | Açıklama | Yetkiler |
|-----|----------|----------|
| Sistem Admin | Tüm sistemin en üst yöneticisi | Kullanıcı, rol, birim yönetimi; IP kısıtlama; audit log, şifreleme yönetimi |
| Birim Admin | Birim özel yöneticisi | Birim kullanıcı yönetimi, içerik yönetimi |
| Birim Editörü | İçerik üreten kullanıcı | Birim içerik ekleme/güncelleme |
| Birim Görüntüleyici | Standart kullanıcı | Kendi biriminin içeriklerini görüntüleme |
| Super Admin (Opsiyonel) | Teknik ekip | Sistem bakımı, yapılandırma |

**Not:** Ünvan sadece kullanıcı profili alanıdır; yetkiler rol bazlıdır. Kullanıcı birden fazla birime atanabilir, her birimde farklı rolü olabilir.

---

## 4. Sistem Genel Akışı

1. Kullanıcı login ekranına gelir.  
2. IP adresi whitelist kontrolü yapılır. Erişim reddedilir veya devam edilir.  
3. Kullanıcı adı/parola ile kimlik doğrulaması yapılır.  
4. Kullanıcının ilişkili birimleri çekilir.  
5. **Birim seçim paneli**: Kullanıcı hangi birimde işlem yapacaksa seçer; seçilen birimdeki rol aktif olur.  
6. Kullanıcı seçilen birimin ana sayfasına yönlendirilir.  
7. Menü ve içerik erişimi aktif rol bazında yüklenir.  
8. Tüm işlemler audit log’a yazılır.

---

## 5. Kullanıcı Hikayeleri (User Stories)

### Sistem Admin

- Kullanıcı oluşturma, birim atama, rol atama  
- IP/IP blok kısıtlama  
- Audit log görüntüleme  

### Birim Admin

- Kendi birimi kullanıcı ve içerik yönetimi  
- Rol atama, modül ekleme  

### Birim Editörü

- İçerik ekleme ve güncelleme  

### Birim Görüntüleyici

- Kendi birim içeriklerini görüntüleme  
- Çok birimli kullanıcılar için birim seçim paneli  

### Sistem Geneli

- Performans ve güvenlik gereksinimleri  

---

## 6. Fonksiyonel Gereksinimler (Functional Requirements)

### 6.1 Kullanıcı Yönetimi

- FR-1: Sistem Admin, yeni kullanıcı oluşturabilmelidir.  
- FR-2: Kullanıcı oluşturulurken ünvan, birim ve rol atanabilmelidir.  
- FR-3: Kullanıcı birden fazla birime atanabilir.  
- FR-4: Kullanıcı bilgileri güncellenebilir ve soft delete yapılabilir.  
- FR-5: Kullanıcı login olmalıdır.  
- FR-6: Çok birimli kullanıcı girişinde birim seçim paneli açılmalıdır.

### 6.2 Rol ve Yetki Yönetimi (RBAC)

- FR-7: Sistem/Birim Admin roller oluşturabilir, güncelleyebilir, silebilir.  
- FR-8: Roller bir veya daha fazla permission ile ilişkili olmalıdır.  
- FR-9: Kullanıcı her birimde farklı role sahip olabilir.  
- FR-10: Tüm erişim kontrolleri role bazlı olmalıdır.  
- FR-11: Menü ve içerik erişimi role göre dinamik yüklenmelidir.

### 6.3 Birim Yönetimi

- FR-12: Sistem Admin yeni birim oluşturabilir, güncelleyebilir, silebilir.  
- FR-13: Birim oluştururken varsayılan rol ve izin seti atanabilir.  
- FR-14: Kullanıcılar birime atanabilir veya çıkarılabilir.  
- FR-15: Birim Admin sadece kendi birimini yönetebilir.

### 6.4 Portal ve İçerik Yönetimi

- FR-16: Her birimin kendi sayfası ve içerik modülleri olmalıdır.  
- FR-17: Birim Editörü içerik ekleyip güncelleyebilir.  
- FR-18: Birim Görüntüleyici yalnızca içerikleri okuyabilir.  
- FR-19: Menü rol bazlı dinamik olarak yüklenmelidir.  
- FR-20: Birimler arası içerik geçişi yetkili kullanıcı ile sınırlıdır.

### 6.5 Güvenlik ve Erişim

- FR-21: Giriş yalnızca tanımlı IP/IP blokları ile yapılabilir.  
- FR-22: Şifreler ve hassas veriler AES-256 ile şifrelenmelidir.  
- FR-23: Tüm kritik işlemler audit log’lara yazılmalıdır.  
- FR-24: Token tabanlı session yönetimi sağlanmalıdır.  
- FR-25: Brute-force koruması olmalıdır.

### 6.6 Performans ve Kullanılabilirlik

- FR-26: Sistem 100–200 eşzamanlı kullanıcıyı desteklemelidir.  
- FR-27: Portal açılış süresi ≤ 2 saniye olmalıdır.  
- FR-28: Birim geçişleri ≤ 1 saniye olmalıdır.

### 6.7 Admin Paneli

- FR-29: Kullanıcı, birim ve rol yönetimi yapılabilmelidir.
- FR-30: Audit log görüntülenebilmelidir.
- FR-31: Sistem ayarları admin panelinden değiştirilebilmelidir.
- FR-32: Admin paneli yalnızca yetkili erişime açık olmalıdır.

### 6.8 Dosya Yönetimi

- FR-33: Kullanıcılar dosya yükleyebilmelidir (eklenti, belge, fotoğraf).
- FR-34: Maksimum dosya boyutu 10MB olmalıdır.
- FR-35: İzin verilen dosya formatları: PDF, PNG, JPG, JPEG, DOCX olmalıdır.
- FR-36: Yüklenen dosyalar şifreli dosya sisteminde saklanmalıdır (AES-256).
- FR-37: Veritabanında sadece dosya metadata'sı (path, size, hash, upload date) tutulmalıdır.
- FR-38: Yetkisiz kullanıcılar başkasının dosyalarına erişememelidir.

### 6.9 Veri Export (Dışa Aktarma)

- FR-39: Admin'ler kullanıcı listesini Excel formatında export edebilmelidir.
- FR-40: Admin'ler audit log kayıtlarını Excel formatında export edebilmelidir.
- FR-41: Birim Admin'ler kendi birimlerindeki verileri export edebilmelidir.
- FR-42: Export işlemleri audit log'a yazılmalıdır.
- FR-43: Excel export boyutu maksimum 10,000 satır ile sınırlı olmalıdır.

### 6.10 Sistem Bakım Modu

- FR-44: Sistem Admin, bakım modu açıp kapatabilmelidir.
- FR-45: Bakım modunda sadece Super Admin ve Sistem Admin erişebilmelidir.
- FR-46: Bakım modunda normal kullanıcılara "Sistem bakımda" mesajı gösterilmelidir.
- FR-47: Bakım modu açma/kapama işlemleri audit log'a yazılmalıdır.

---

## 7. Non-Functional Requirements (NFR)

### Performans

- NFR-1: 100–200 eşzamanlı kullanıcı desteği  
- NFR-2: Portal açılışı ≤ 2 saniye  
- NFR-3: Birim geçişleri ≤ 1 saniye  
- NFR-4: Veritabanı sorguları optimize edilmeli  
- NFR-5: Audit log performansı etkilememeli  

### Güvenlik

- NFR-6: Şifreler AES-256 ile şifrelenmeli  
- NFR-7: IP/IP blok bazlı giriş  
- NFR-8: Brute-force koruması  
- NFR-9: Token tabanlı güvenli session  
- NFR-10: Audit log tüm kritik işlemleri içermeli  
- NFR-11: TLS/SSL ile veri in-transit şifreleme  
- NFR-12: Admin paneli yetkili erişime açık olmalı

### Yedekleme

- NFR-13: Günlük veritabanı yedekleme  
- NFR-14: Yedekler lokal ve tercihen harici depoda  
- NFR-15: Geri dönüş süresi ≤ 2 saat  

### Uyumluluk

- NFR-16: Windows 11 ve Linux uyumlu  
- NFR-17: Modern tarayıcı uyumluluğu (Chrome, Edge, Firefox)  
- NFR-18: Backend .NET Core / .NET 9 uyumlu  
- NFR-19: Docker opsiyonel destek

### Kullanılabilirlik

- NFR-20: Basit, anlaşılır ve hızlı arayüz  
- NFR-21: Çok birimli kullanıcılar için kolay birim seçim paneli  
- NFR-22: Menü ve modüller rol bazlı yüklenmeli  
- NFR-23: Minimum %99 uptime  
- NFR-24: Anlaşılır hata mesajları

### Logging

- NFR-25: Tüm kullanıcı işlemleri detaylı loglanmalı  
- NFR-26: Loglar filtrelenebilir ve sorgulanabilir olmalı  
- NFR-27: Kritik loglar admin panelinden görüntülenebilir  

---

## 8. ERD ve RBAC Modeli

### Tablolar

| Tablo | Önemli Alanlar |
|-------|----------------|
| User | UserID (PK), AdSoyad, Email, ŞifreHash, Ünvan, SonGiriş |
| Birim | BirimID (PK), BirimAdı, Açıklama |
| Role | RoleID (PK), RoleAdı, Açıklama |
| Permission | PermissionID (PK), Action, Resource |
| UserBirimRole | ID (PK), UserID (FK), BirimID (FK), RoleID (FK) |
| RolePermission | ID (PK), RoleID (FK), PermissionID (FK) |
| AuditLog | LogID (PK), UserID (FK), Action, Resource, BirimID (FK), TarihSaat |

### Kullanıcı-Birim-Rol İlişkisi
