# 🚀 Kurumsal İntranet Portal - Başlatma Kılavuzu

## Hızlı Başlatma

### 1. Tüm Servisleri Başlat
Ana dizinde bulunan batch dosyasını çift tıklayın:
```
start-intranet.bat
```

Bu script:
- ✅ .NET SDK kontrol eder
- ✅ Node.js kontrol eder
- ✅ PostgreSQL kontrol eder
- ✅ Backend'i başlatır (Port 5197)
- ✅ Frontend'i başlatır (Port 5173-5175)
- ✅ Her ikisi de yeni pencerede açılır

### 2. Servisleri Durdur
Servisleri durdurmak için:
```
stop-intranet.bat
```

Bu script:
- ✅ Backend API process'lerini durdurur (Port 5197)
- ✅ Frontend dev server'ı durdurur (Port 5173-5175)
- ✅ İlgili tüm process'leri temizler

---

## Manuel Başlatma

Eğer servisleri manuel olarak başlatmak isterseniz:

### Backend (ASP.NET Core API)
```powershell
cd "C:\Users\IT\Desktop\Bilişim Sistemi\intranet-portal\backend\IntranetPortal.API"
dotnet run
```
- URL: http://localhost:5197/api
- Health Check: http://localhost:5197/api/health

### Frontend (React + Vite)
```powershell
cd "C:\Users\IT\Desktop\Bilişim Sistemi\intranet-portal\frontend"
npm run dev
```
- URL: http://localhost:5173 (veya 5174, 5175)
- Vite otomatik olarak boş port seçer

---

## Giriş Bilgileri

Portal açıldıktan sonra şu bilgilerle giriş yapabilirsiniz:

- **Email**: `admin@intranet.local`
- **Şifre**: `Admin123!`

---

## Gereksinimler

Script çalışması için gerekli olan yazılımlar:

1. ✅ **.NET 9 SDK** (Kurulu: v9.0.307)
2. ✅ **Node.js 20+** (Kurulu: v22.21.0)
3. ✅ **PostgreSQL 16** (Kurulu: v16.11)
   - Database: IntranetDB
   - User: intranet_user
   - Port: 5432

---

## Port Bilgileri

| Servis | Port | URL |
|--------|------|-----|
| Backend API | 5197 | http://localhost:5197/api |
| Frontend | 5173-5175 | http://localhost:5173 |
| PostgreSQL | 5432 | localhost:5432 |

---

## Sorun Giderme

### Backend Başlamıyor
1. PostgreSQL çalışıyor mu kontrol edin:
   ```powershell
   netstat -ano | findstr ":5432"
   ```
2. Database bağlantı bilgileri doğru mu?
   - `appsettings.Development.json` kontrol edin

### Frontend Başlamıyor
1. node_modules yüklendi mi?
   ```powershell
   cd frontend
   npm install
   ```
2. .env dosyası var mı ve doğru mu?
   - VITE_API_BASE_URL=http://localhost:5197/api

### Port Zaten Kullanımda
1. Mevcut servisleri durdurun:
   ```powershell
   stop-intranet.bat
   ```
2. Veya process'i manuel öldürün:
   ```powershell
   # Backend için (Port 5197)
   netstat -ano | findstr ":5197"
   taskkill /PID <PID_NUMARASI> /F

   # Frontend için (Port 5173)
   netstat -ano | findstr ":5173"
   taskkill /PID <PID_NUMARASI> /F
   ```

### Login Yapamıyorum
1. Backend çalışıyor mu?
   - http://localhost:5197/api/health adresine gidin
2. CORS hatası var mı?
   - Browser console (F12) kontrol edin
3. Credentials doğru mu?
   - Email: admin@intranet.local
   - Şifre: Admin123!

---

## Dokümantasyon

Daha fazla bilgi için:
- **Login Sistemi**: `LOGIN_TEST_RESULTS.md`
- **Proje Yapısı**: `intranet-portal/PROJECT_STRUCTURE.md`
- **Backend Kılavuzu**: `intranet-portal/backend/README.md`
- **Frontend Kılavuzu**: `intranet-portal/frontend/README.md`
- **API Dokümantasyonu**: `API_SPECIFICATION.md`

---

## Geliştirme Notları

### Hot Reload Aktif
- Backend: Dosya değişikliklerinde otomatik yeniden derlenir
- Frontend: Vite HMR ile anında güncellenir

### Debug Modu
Backend debug için Visual Studio Code kullanın:
1. VS Code'da proje klasörünü açın
2. F5'e basın
3. "IntranetPortal.API" debug config seçin

### Database Migration
Yeni migration eklemek için:
```powershell
cd backend/IntranetPortal.Infrastructure
dotnet ef migrations add MigrationName --startup-project ../IntranetPortal.API
dotnet ef database update --startup-project ../IntranetPortal.API
```

---

**Son Güncelleme**: 2025-11-27
**Versiyon**: 1.0
**Durum**: ✅ Login Sistemi Çalışıyor
