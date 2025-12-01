# İlk Geliştirme Adımları (First Development Steps)

Bu doküman, **Kurumsal İntranet Web Portalı** projesinin geliştirme sürecindeki ilk adımları, Admin Dashboard kurulumunu ve birim modüllerinin eklenme sırasını içerir.

## 1. Faz 0: Temel Altyapı ve Admin Dashboard Kurulumu

Geliştirmeye başlamadan önce temel altyapının ve merkezi yönetim panelinin (Admin Dashboard) hazır olması gerekmektedir.

### 1.1. Backend Kurulumu (.NET 9)

1. **Proje Oluşturma:** `dotnet new webapi -n IntranetPortal.API -f net9.0` ile boş bir proje oluşturun.
2. **Katmanlı Mimari Kurulumu:** Domain, Application, Infrastructure katmanlarını oluşturun.
3. **Veritabanı Bağlantısı:** PostgreSQL bağlantısını kurun ve Entity Framework Core 9.x'i yapılandırın.
4. **Identity & Auth:** JWT tabanlı kimlik doğrulama altyapısını kurun.
5. **Temel Tablolar:** `User`, `Role`, `Birim`, `Permission` tablolarını oluşturun (Migration).
6. **Seed Data:** İlk "Sistem Admin" kullanıcısını ve temel rolleri veritabanına ekleyin.
7. **IP Whitelist Middleware:** IP kısıtlama middleware'ini implemente edin.

### 1.2. Frontend Kurulumu (React + Vite)

1. **Proje Oluşturma:** `npm create vite@latest` ile React-TypeScript projesi oluşturun.
2. **UI Framework:** Tailwind CSS ve gerekli UI bileşenlerini (shadcn/ui veya benzeri) kurun.
3. **Routing:** React Router ile temel sayfa yapısını (`/login`, `/admin`, `/dashboard`) kurun.
4. **Auth Context:** Login/Logout işlemleri ve token yönetimi için Context yapısını kurun.

### 1.3. Admin Dashboard Özellikleri

İlk etapta Admin panelinde şu özellikler çalışır durumda olmalıdır:

* **Kullanıcı Yönetimi:** Yeni kullanıcı ekleme, düzenleme, pasife alma.
* **Birim Yönetimi:** Yeni birim tanımlama.
* **Rol Yönetimi:** Rolleri ve yetkileri tanımlama.
* **Kullanıcı Atama:** Kullanıcıları birimlere ve rollere atama ekranı.

## 2. Faz 1: Birim Modüllerinin Eklenme Sırası

Admin paneli hazır olduktan sonra, birimler sırasıyla sisteme eklenecektir. Bu sıralama, bağımlılıklar ve kullanım yoğunluğu göz önüne alınarak belirlenmiştir.

### 2.1. İnsan Kaynakları (İK) Modülü

* **Neden İlk?** Tüm personelin listesi ve organizasyon şeması burada tutulacağı için diğer birimler bu veriye ihtiyaç duyabilir.
* **Özellikler:** Personel listesi, izin takibi, duyurular.

### 2.2. Bilgi İşlem (IT) Modülü

* **Neden İkinci?** Teknik destek talepleri ve envanter yönetimi, sistemin kullanımı sırasında oluşacak ilk ihtiyaçlardır.
* **Özellikler:** Arıza kaydı oluşturma, envanter listesi.

### 2.3. İdari İşler Modülü

* **Özellikler:** Araç talep, oda rezervasyon, yemekhane menüsü.

### 2.4. Diğer Birimler

* Kurumun ihtiyacına göre diğer birimler (Muhasebe, Satın Alma vb.) bu aşamadan sonra eklenebilir.

## 3. Geliştirme Kontrol Listesi

* [ ] Backend projesi oluşturuldu ve GitHub'a atıldı.
* [ ] Veritabanı şeması (ERD) uygulandı.
* [ ] Login endpoint'i ve JWT üretimi çalışıyor.
* [ ] Frontend projesi oluşturuldu ve Login sayfası tasarlandı.
* [ ] Admin paneli "Kullanıcı Ekleme" ekranı çalışıyor.
* [ ] İK modülü için ilk sayfa (Personel Listesi) oluşturuldu.
