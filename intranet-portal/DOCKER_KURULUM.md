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

- **Frontend**: <http://localhost:5173>
- **Backend API**: <http://localhost:5179/swagger>
- **Veritabanı**: Arka planda çalışıyor (Port 5432)

### 🔄 Ne Zaman `--build` Kullanmalıyım?

Sadece şu iki durumda bu komutu kullanın:

1. Projeye **yeni bir kütüphane** eklendiğinde (npm install veya nuget paketi).
2. **Dockerfile** ayarları değiştirildiğinde.

```powershell
docker-compose up --build
```

*(Bu komut değişiklikleri algılayıp sistemi yeniden kuracağı için biraz uzun sürebilir.)*

### Durdurmak İçin

Terminalde `CTRL + C` tuşuna basın veya yeni bir terminalde:

```powershell
docker-compose down
```

## 🛠️ 3. Geliştirme (Kodlama) Nasıl Yapılır?

Dosyalarınız (Backend ve Frontend klasörleri) bilgisayarınızdan Docker'ın içine "yansıtılmıştır" (Volume).

1. **VS Code** ile `intranet-portal` klasörünü açın.
2. Kodunuzu değiştirin ve kaydedin.
3. **Frontend**: Tarayıcıda anında değişir (Hot Reload).
4. **Backend**: `dotnet watch` sayesinde değişikliği algılar ve sunucuyu otomatik yeniden başlatır.

**Not:** Yeni bir kütüphane eklerseniz (npm install veya dotnet add package), konteynerleri durdurup `docker-compose up --build` yapmanız gerekir.

## ⚠️ 4. Önemli Notlar

- **Veritabanı Verileri**: `postgres_data` adında bir hacimde (volume) saklanır. Konteyneri silerseniz bile verileriniz kaybolmaz.
- **Şifreler**: `.env.docker` dosyasında saklanır. Bu dosya `.gitignore`'da olduğu için Git'e yüklenmez.
- **Port Çakışması**: Eğer bilgisayarınızda zaten çalışan bir PostgreSQL veya IIS varsa portlar çakışabilir. Önce onları kapatın.
- **Healthcheck**: Veritabanı tam hazır olmadan backend başlamaz (depends_on + healthcheck).

## 🧹 5. Bakım ve Temizlik

### Disk Kullanımını Kontrol Et

Docker'ın ne kadar disk alanı kullandığını görmek için:

```powershell
docker system df
```

**Çıktı Örneği:**

| Tür | Boyut | Geri Kazanılabilir |
|-----|-------|---------------------|
| Images | 16 GB | 13 GB (80%) |
| Containers | 337 MB | 1.2 MB |
| Volumes | 1.6 GB | 500 MB |

### Kullanılmayan Image'ları Temizle

Birçok kez `--build` yaptıysanız eski image'lar birikir. Temizlemek için:

```powershell
docker image prune -a
```

> ⚠️ **Güvenli:** Bu komut sadece **hiçbir konteyner tarafından kullanılmayan** image'ları siler. Aktif projeleriniz etkilenmez.

### Tüm Kullanılmayanları Temizle

Image, cache ve network dahil tüm kullanılmayanları silmek için:

```powershell
docker system prune -a
```

> ⚠️ **DİKKAT:** `--volumes` eklemeyin, aksi halde veritabanı verileri de silinir!

---
**Son Güncelleme:** 2025-12-18

## 🆙 6. Database Sürüm Yükseltme (Örn: PG 16 -> 18)

PostgreSQL major sürüm değişikliklerinde (16'dan 18'e geçiş gibi), Docker volume'larındaki veri formatı uyumsuz olabilir. Bu durumda şu adımları izleyin:

1. **Yeni Kodu Çekin:** `git pull` ile en güncel `docker-compose.yml` dosyasını alın.
2. **Eski Sistemi ve Verileri Silin:**

   ```powershell
   docker-compose down -v
   ```

   > ⚠️ **UYARI:** `-v` parametresi veritabanındaki tüm verileri (tabloları) kalıcı olarak siler ve yeni sürüme uygun temiz bir alan açar.
3. **Yeni Sürümü Başlatın:**

   ```powershell
   docker-compose up -d
   ```

   *Not: Backend otomatik olarak tabloları (migration) yeniden oluşturacaktır.*
