# Proje Güncelleme ve Kurulum Rehberi

Bu dosya, projeyi GitHub'dan çektikten (`git pull`) sonra çalışır hale getirmek için gereken standart komutları içerir.

> **Son Güncelleme (Phase 4 - Duyuru Sistemi):**
> Bu güncelleme yeni veritabanı tabloları (Announcements) içerir. 
> Backend kısmında `dotnet ef database update` komutunu çalıştırmayı UNUTMAYIN.

## 1. Kodları Güncelleme

Öncelikle projenin en güncel halini GitHub'dan çekin:

```bash
git pull origin main
```

## 2. Backend (Sunucu) Kurulumu

Backend klasörüne gidin ve bağımlılıkları yükleyin:

```bash
cd backend/IntranetPortal.API
dotnet restore
```

Eğer veritabanında değişiklikler yapıldıysa (yeni tablolar vb.), veritabanını güncelleyin:

```bash
dotnet ef database update
```

Backend'i başlatın:

```bash
dotnet run
```

## 3. Frontend (Arayüz) Kurulumu

Frontend klasörüne gidin ve paketleri yükleyin:

```bash
cd ../../frontend
npm install
```

Frontend'i başlatın:

```bash
npm run dev
```

## Gerekli Durumlarda (Hata Alırsanız)

Eğer "Build failed" veya garip hatalar alırsanız, projeyi temizleyip tekrar derlemek için şu komutları kullanabilirsiniz:

**Backend için:**

```bash
dotnet clean
dotnet build
```

**Frontend için:**
`node_modules` klasörünü silip tekrar `npm install` yapabilirsiniz.
