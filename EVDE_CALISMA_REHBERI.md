# 🏠 Evde Çalışma ve Kurulum Rehberi

Bu rehber, **Kurumsal İntranet Web Portalı** projesini evdeki bilgisayarınızda sıfırdan kurup çalıştırmanız için hazırlanmıştır.

## 📋 1. Ön Hazırlıklar (Gereksinimler)
Bilgisayarınızda şunların kurulu olduğundan emin olun:
1.  **Git**: [İndir](https://git-scm.com/downloads)
2.  **.NET 9.0 SDK**: [İndir](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)
3.  **Node.js (LTS sürümü)**: [İndir](https://nodejs.org/)
4.  **PostgreSQL 16**: [İndir](https://www.postgresql.org/download/) (Yüklerken şifrenizi unutmayın, genelde `12345` veya `admin` yapılır.)
5.  **VS Code** veya **Visual Studio 2022**: Kod editörü olarak.

---

## 🚀 2. Projeyi İndirme (Clone)
Masaüstünde veya istediğiniz bir klasörde terminali açın ve şu komutu çalıştırın:

```powershell
git clone https://github.com/chelebyy/Intranet.git
cd Intranet
```

---

## 🗄️ 3. Veritabanı Kurulumu (SQL ile)
Proje ayarlarındaki (`intranet_user`) kullanıcısını evdeki veritabanımıza eklememiz gerekiyor. Böylece kodda değişiklik yapmadan çalışabilirsiniz.

1.  **pgAdmin** veya **SQL Shell (psql)** uygulamasını açın. (Postgres kurulurken belirlediğiniz şifre ile giriş yapın).
2.  Şu SQL komutlarını sırasıyla çalıştırın:

```sql
-- 1. Kullanıcıyı oluştur (Projedeki şifre ile aynı)
CREATE USER intranet_user WITH PASSWORD 'CHANGE_ME_USE_USER_SECRETS' SUPERUSER;

-- 2. Veritabanını oluştur
CREATE DATABASE "IntranetDB";

-- 3. Yetkileri ver
GRANT ALL PRIVILEGES ON DATABASE "IntranetDB" TO intranet_user;
```

3.  **Tabloları Oluştur (Migration):**
    Terminalde (backend klasöründe) şu komutu çalıştırın:
    ```powershell
    dotnet ef database update --project ../IntranetPortal.Infrastructure --startup-project ../IntranetPortal.API
    ```

---

## ▶️ 4. Projeyi Çalıştırma

### Backend'i Başlatma
Hala `backend` klasöründeyseniz (veya tekrar girin):
```powershell
dotnet run --project IntranetPortal.API
```
*Backend `https://localhost:7157` (veya benzeri) adresinde çalışmaya başlayacaktır.*

### Frontend'i Başlatma
Yeni bir terminal penceresi açın:
1.  Frontend klasörüne gidin:
    ```powershell
    cd intranet-portal/frontend
    ```
2.  Paketleri yükleyin (Sadece ilk sefer için):
    ```powershell
    npm install
    ```
3.  Uygulamayı başlatın:
    ```powershell
    npm run dev
    ```

---

## ✅ Kontrol Listesi
- [ ] Backend çalışıyor mu? (Swagger açılıyor mu?)
- [ ] Frontend çalışıyor mu? (Tarayıcıda sayfa geldi mi?)
- [ ] Giriş yapabiliyor musunuz? (Veritabanı boş olduğu için veritabanına manuel bir kullanıcı eklemeniz veya `seed` verisi kullanmanız gerekebilir.)
