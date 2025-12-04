# Yeni Ortam Kurulum Kılavuzu

Bu kılavuz, projeyi yeni bir bilgisayara (ev veya işyeri) kurmak için gerekli tüm adımları içerir.

## 📋 Gereksinimler

Kuruluma başlamadan önce şunların yüklü olduğundan emin olun:

### Gerekli Yazılımlar

1. **Git**
   - İndirin: https://git-scm.com/download/win
   - Versiyon kontrolü: `git --version`

2. **.NET 9 SDK**
   - İndirin: https://dotnet.microsoft.com/download/dotnet/9.0
   - Versiyon kontrolü: `dotnet --version`

3. **Node.js 22+**
   - İndirin: https://nodejs.org/
   - Versiyon kontrolü: `node --version` ve `npm --version`

4. **PostgreSQL 16**
   - İndirin: https://www.postgresql.org/download/windows/
   - Kurulum sırasında:
     - PostgreSQL port: `5432`
     - Superuser şifresi: **Unutmayın!**
     - Locale: `Turkish, Turkey`

5. **Visual Studio Code** (Önerilir)
   - İndirin: https://code.visualstudio.com/

---

## 🚀 Kurulum Adımları

### 1. Repository'yi Klonlayın

```powershell
# Proje klasörüne git
cd "c:\Users\IT\Desktop\Bilişim Sistemi"

# Repository'yi klonla
git clone https://github.com/chelebyy/Intranet.git intranet-portal

# Proje dizinine gir
cd intranet-portal
```

---

### 2. Veritabanı Kurulumu

#### PostgreSQL Konfigürasyonu

1. **pgAdmin 4** veya `psql` ile bağlanın

2. **Kullanıcı oluşturun:**

```sql
-- PostgreSQL kullanıcısı oluştur
CREATE USER intranet_user WITH PASSWORD 'GüçlüŞifre123!';

-- Veritabanı oluştur
CREATE DATABASE "IntranetDB" 
    WITH OWNER = intranet_user
    ENCODING = 'UTF8'
    LC_COLLATE = 'Turkish_Turkey.1254'
    LC_CTYPE = 'Turkish_Turkey.1254';

-- Yetkileri ver
GRANT ALL PRIVILEGES ON DATABASE "IntranetDB" TO intranet_user;
```

---

### 3. Backend Konfigürasyonu

#### appsettings.Development.json Oluşturma

```powershell
cd backend\IntranetPortal.API
```

**Yeni bir dosya oluşturun:** `appsettings.Development.json`

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Information",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=IntranetDB;Username=intranet_user;Password=GüçlüŞifre123!"
  },
  "JwtSettings": {
    "SecretKey": "Bu-Çok-Gizli-ve-Güvenli-Bir-Secret-Key-Minimum-32-Karakter-Olmalı",
    "Issuer": "IntranetPortal",
    "Audience": "IntranetUsers",
    "ExpiryMinutes": 480
  },
  "SecuritySettings": {
    "IPWhitelist": {
      "Enabled": false,
      "AllowedRanges": [
        "192.168.0.0/16"
      ]
    },
    "RateLimiting": {
      "Enabled": true,
      "MaxRequests": 100,
      "WindowSeconds": 60,
      "LoginMaxRequests": 5,
      "LoginWindowSeconds": 60
    }
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    "AllowAnyOriginInDevelopment": true
  }
}
```

> ⚠️ **ÖNEMLİ:**
> - `Password` alanını kendi PostgreSQL şifrenizle değiştirin
> - `SecretKey` alanını rastgele, güçlü bir anahtar ile değiştirin (min 32 karakter)

#### Backend Bağımlılıklarını Yükleyin

```powershell
# NuGet paketlerini geri yükle
dotnet restore

# Veritabanı migration'larını uygula
dotnet ef database update --startup-project ../IntranetPortal.API --project ../IntranetPortal.Infrastructure

# Projeyi derle
dotnet build
```

---

### 4. Frontend Konfigürasyonu

```powershell
cd ..\..\frontend
```

#### .env Dosyası Oluşturma

`.env.example` dosyasını `.env` olarak kopyalayın:

```powershell
copy .env.example .env
```

**Veya manuel olarak `.env` dosyası oluşturun:**

```env
# Backend API Base URL
VITE_API_BASE_URL=https://localhost:5001/api

# Environment (development, production)
VITE_ENV=development
```

#### Frontend Bağımlılıklarını Yükleyin

```powershell
# npm paketlerini yükle (bu işlem birkaç dakika sürebilir)
npm install
```

---

### 5. İlk Çalıştırma ve Test

#### Backend'i Başlatın

```powershell
cd ..\backend
dotnet run --project IntranetPortal.API
```

**Beklenen Çıktı:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:5001
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
```

Backend çalışıyor! **Bu terminal penceresini açık bırakın.**

#### Frontend'i Başlatın (Yeni Terminal)

**Yeni bir PowerShell penceresi açın:**

```powershell
cd "c:\Users\IT\Desktop\Bilişim Sistemi\intranet-portal\frontend"
npm run dev
```

**Beklenen Çıktı:**
```
  VITE v6.2.0  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### Tarayıcıda Test Edin

1. Tarayıcınızda `http://localhost:5173` adresine gidin
2. Login sayfası açılmalı
3. Test için varsayılan kullanıcı (eğer seed data varsa):
   - **Sicil:** `99999`
   - **Şifre:** `Admin123!`

---

## ✅ Kurulum Doğrulama

### Backend Health Check

```powershell
# API çalışıyor mu?
curl https://localhost:5001/api/health
```

### Frontend Build Test

```powershell
cd frontend
npm run build
```

Hata olmadan tamamlanmalı.

---

## 🔧 Sorun Giderme

### Veritabanı Bağlantı Hatası

**Hata:** `Npgsql.NpgsqlException: password authentication failed`

**Çözüm:**
1. `appsettings.Development.json` içindeki şifrenizi kontrol edin
2. PostgreSQL'de `intranet_user` kullanıcısının oluşturulduğundan emin olun
3. PostgreSQL servisinin çalıştığını kontrol edin (`services.msc`)

### Port Kullanımda Hatası

**Hata:** `Address already in use`

**Çözüm:**
```powershell
# Port 5001'i kullanan uygulamayı bul
netstat -ano | findstr :5001

# Process ID'yi öğrenip sonlandır
taskkill /PID <PID> /F
```

### npm install Hatası

**Hata:** `ENOENT: no such file or directory`

**Çözüm:**
1. Node.js'in güncel olduğundan emin olun
2. npm önbelleğini temizleyin:
```powershell
npm cache clean --force
npm install
```

### Migration Hatası

**Hata:** `The Entity Framework tools version... is older than that of the runtime...`

**Çözüm:**
```powershell
dotnet tool update --global dotnet-ef
```

---

## 📁 Kurulum Sonrası Klasör Yapısı

```
c:\Users\IT\Desktop\Bilişim Sistemi\intranet-portal\
├── backend/
│   ├── IntranetPortal.API/
│   │   ├── appsettings.json              # ✅ Git'te (şablonlar)
│   │   └── appsettings.Development.json  # ❌ Git'te değil (manuel oluşturuldu)
│   ├── IntranetPortal.Application/
│   ├── IntranetPortal.Domain/
│   └── IntranetPortal.Infrastructure/
└── frontend/
    ├── .env                              # ❌ Git'te değil (manuel oluşturuldu)
    ├── .env.example                      # ✅ Git'te (şablon)
    └── src/
```

---

## 🔄 Günlük Kullanım

Kurulum tamamlandıktan sonra, projeyi günlük kullanmak için:

**Sabah (çalışmaya başlarken):**
```powershell
cd "c:\Users\IT\Desktop\Bilişim Sistemi\intranet-portal"
git pull origin main
```

**Gün Sonu (değişiklikleri paylaş):**
```powershell
git add .
git commit -m "Bugünkü değişiklikler"
git push origin main
```

Detaylı Git iş akışı için: [GITHUB_WORKFLOW.md](GITHUB_WORKFLOW.md)

---

## 📞 Yardım

- **Git İş Akışı:** [GITHUB_WORKFLOW.md](GITHUB_WORKFLOW.md)
- **API Dokümantasyonu:** `docs/api/API_SPECIFICATION.md`
- **Teknik Tasarım:** `docs/technical/TECHNICAL_DESIGN.md`

---

**Kurulum tamamlandı! 🎉** Artık hem evde hem işte aynı proje üzerinde çalışabilirsiniz.
