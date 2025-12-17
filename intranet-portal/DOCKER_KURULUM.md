# 🐳 Docker Kurulum ve Çalıştırma Rehberi

Artık projemiz Docker destekli! Evde veya işte, tek bir komutla tüm sistemi (Veritabanı + Backend + Frontend) ayağa kaldırabilirsiniz.

## 🏁 1. İlk Kurulum

Sadece **Docker Desktop** uygulamasını kurmanız yeterlidir. .NET, Node.js veya PostgreSQL yüklemenize GEREK YOKTUR.

## 🚀 2. Projeyi Çalıştırma

Terminali açın ve `intranet-portal` klasörüne (docker-compose.yml dosyasının olduğu yere) gidin.

### ✅ Standart Başlatma (Her Sabah Bunu Kullanın)
```powershell
docker-compose up
```
*(Proje hemen açılır. Kod değişiklikleriniz anında yansır.)*

Komutu çalıştırdıktan sonra:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/swagger
- **Veritabanı**: Arka planda çalışıyor (Port 5432)

### 🔄 Ne Zaman `--build` Kullanmalıyım?
Sadece şu iki durumda bu komutu kullanın:
1.  Projeye **yeni bir kütüphane** eklendiğinde (npm install veya nuget paketi).
2.  **Dockerfile** ayarları değiştirildiğinde.

```powershell
docker-compose up --build
```
*(Bu komut değişiklikleri algılayıp sistemi yeniden kuracağı için biraz uzun sürebilir.)*

### Durdurmak İçin:
Terminalde `CTRL + C` tuşuna basın veya yeni bir terminalde:
```powershell
docker-compose down
```

## 🛠️ 3. Geliştirme (Kodlama) Nasıl Yapılır?

Dosyalarınız (Backend ve Frontend klasörleri) bilgisayarınızdan Docker'ın içine "yansıtılmıştır" (Volume).

1.  **VS Code** ile `intranet-portal` klasörünü açın.
2.  Kodunuzu değiştirin ve kaydedin.
3.  **Frontend**: Tarayıcıda anında değişir (Hot Reload).
4.  **Backend**: `dotnet watch` sayesinde değişikliği algılar ve sunucuyu otomatik yeniden başlatır.

**Not:** Yeni bir kütüphane eklerseniz (npm install veya dotnet add package), konteynerleri durdurup `docker-compose up --build` yapmanız gerekir.

## ⚠️ 4. Önemli Notlar

- **Veritabanı Verileri**: `postgres_data` adında bir hacimde (volume) saklanır. Konteyneri silerseniz bile verileriniz kaybolmaz.
- **Şifreler**: `docker-compose.yml` içinde geliştirme ortamı şifresi `CHANGE_ME_IN_PROD_123` olarak ayarlandı.
- **Port Çakışması**: Eğer bilgisayarınızda zaten çalışan bir PostgreSQL veya IIS varsa portlar çakışabilir. Önce onları kapatın.
