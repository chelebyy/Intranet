# Kurumsal İntranet Web Portalı - Proje İndeksi

**Proje Adı:** Kurumsal İntranet Web Portalı
**Versiyon:** 1.2
**Tarih:** 27 Kasım 2025
**Durum:** Faz 1 Tamamlandı - Profil Sayfası Eklendi - RBAC Geliştirme Başlangıcı

---

## 📋 İçindekiler (Table of Contents)

- [Proje Özeti ve Son Durum](#proje-özeti-ve-son-durum)
- [Hızlı Başlangıç](#hızlı-başlangıç)
- [Dokümantasyon Haritası](#dokümantasyon-haritası)
- [Mimari Genel Bakış](#mimari-genel-bakış)
- [Geliştirme Yol Haritası](#geliştirme-yol-haritası)
- [Teknik Detaylar](#teknik-detaylar)
- [Güvenlik ve Yetkilendirme](#güvenlik-ve-yetkilendirme)
- [Deployment Seçenekleri](#deployment-seçenekleri)
- [API Referansı](#api-referansı)
- [Veritabanı Şeması](#veritabanı-şeması)
- [Modüler Yapı](#modüler-yapı)

---

## 🎯 Proje Özeti ve Son Durum

**Kurumsal İntranet Web Portalı**, kurum içi iletişim, bilgi akışı ve birimler arası koordinasyonu kolaylaştırmak için geliştirilmiş **çok birimli, güvenli ve role dayalı yetkilendirme (RBAC)** yapısına sahip bir web portalıdır.

### 📊 Son Durum (27 Kasım 2025)
- ✅ **Faz 1 Tamamlandı:** Login sistemi, JWT altyapısı ve veritabanı bağlantıları hazır.
- ✅ **Profil Sayfası Eklendi:** Admin Dashboard'da "Profil" sayfası ve navigasyonu tamamlandı.
- ✅ **Sicil Bazlı Login:** Email yerine Sicil Numarası ile giriş yapısı entegre edildi.
- ✅ **IP Kontrolü:** Güvenlik katmanı aktif.
- 🔄 **Sırada:** Backend RBAC (`[HasPermission]`) altyapısının geliştirilmesi (Faz 2).

### Temel Özellikler

- ✅ **Çok Birimli Yapı**: Kullanıcılar birden fazla departmana farklı rollerle atanabilir
- ✅ **RBAC Sistemi**: Rol bazlı erişim kontrolü ile granüler yetkilendirme
- ✅ **IP Whitelist**: CIDR notasyonu destekli IP/IP bloğu bazlı erişim kısıtlama
- ✅ **Güçlü Güvenlik**: AES-256 şifreleme, BCrypt password hashing, JWT authentication
- ✅ **Audit Logging**: Tüm kritik işlemlerin detaylı kaydı
- ✅ **Lokal Ağ**: İnternet bağlantısı gerektirmez, sadece local network üzerinde çalışır

---

## 🚀 Hızlı Başlangıç

### Operasyonel Komutlar
Projenin ana dizininde bulunan scriptler ile tüm sistemi yönetebilirsiniz:

- **`start-intranet.bat`**: Tüm sistemi (Backend + Frontend + DB Kontrolü) başlatır.
- **`stop-intranet.bat`**: Tüm servisleri güvenli bir şekilde durdurur.

### Yeni Geliştiriciler İçin

1. **İlk Okuma Sırası:**
   - [README_BASLAT.md](README_BASLAT.md) - **En güncel** başlatma ve operasyon kılavuzu.
   - [PRD.md](PRD.md) - Proje gereksinimleri.
   - [TECH_STACK.md](TECH_STACK.md) - Teknoloji yığını.

2. **Login Sistemi Detayları:**
   - [LOGIN_READY_STATUS.md](LOGIN_READY_STATUS.md) - Login sisteminin teknik detayları.
   - [MIGRATION_EMAIL_TO_SICIL.md](MIGRATION_EMAIL_TO_SICIL.md) - Sicil numarasına geçiş rehberi.

---

## 📚 Dokümantasyon Haritası

### Kategori 1: Faz 1 Tamamlanan İşler (Login & Core)

| Doküman | Açıklama | Durum |
|---------|----------|-------|
| [FAZ1_TAMAMLANDI.md](FAZ1_TAMAMLANDI.md) | Faz 1 Kapanış Raporu - Tamamlanan tüm özellikler | ✅ Bitti |
| [LOGIN_READY_STATUS.md](LOGIN_READY_STATUS.md) | Login sistemi teknik durum raporu | ✅ Bitti |
| [MIGRATION_EMAIL_TO_SICIL.md](MIGRATION_EMAIL_TO_SICIL.md) | Email -> Sicil No geçiş dokümanı | ✅ Bitti |
| [LOGIN_TEST_RESULTS.md](LOGIN_TEST_RESULTS.md) | Login test senaryoları ve sonuçları | ✅ Bitti |
| [SESSION_CHECKPOINT_2025-11-27_PROFILE_FIX.md](SESSION_CHECKPOINT_2025-11-27_PROFILE_FIX.md) | Profil sayfası implementasyon detayları | ✅ Bitti |

### Kategori 2: Operasyon ve Kurulum

| Doküman | Açıklama | Hedef Kitle |
|---------|----------|-------------|
| [README_BASLAT.md](README_BASLAT.md) | **Ana Başlatma Rehberi** - Script kullanımı | Tüm Ekip |
| [QUICK_START.md](QUICK_START.md) | Hızlı kurulum adımları | DevOps/Dev |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Multi-platform deployment | DevOps |

### Kategori 3: Teknik Mimari ve Tasarım

| Doküman | Açıklama | Hedef Kitle |
|---------|----------|-------------|
| [TECH_STACK.md](TECH_STACK.md) | Teknoloji yığını | Backend/Frontend Dev |
| [TECHNICAL_DESIGN.md](TECHNICAL_DESIGN.md) | Mimari tasarım ve kod örnekleri | Backend Developers |
| [ERD.md](ERD.md) | Entity Relationship Diagram | Database/Backend Dev |
| [MODULAR_STRUCTURE.md](MODULAR_STRUCTURE.md) | Modüler yapı rehberi | Full Stack Dev |

### Kategori 4: Proje Gereksinimleri

| Doküman | Açıklama | Hedef Kitle |
|---------|----------|-------------|
| [PRD.md](PRD.md) | Product Requirements Document | Tüm Ekip |
| [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) | 6 fazlı geliştirme yol haritası | PM / Lead Dev |
| [DEVELOPMENT_STEPS.md](DEVELOPMENT_STEPS.md) | Geliştirme adımları | Dev Team |

### Kategori 5: API ve Entegrasyon

| Doküman | Açıklama | Hedef Kitle |
|---------|----------|-------------|
| [API_SPECIFICATION.md](API_SPECIFICATION.md) | REST API Endpoint detayları | Frontend/Backend Dev |
| [API_INDEX.md](API_INDEX.md) | API Hızlı Referans | Frontend Dev |

### Kategori 6: Troubleshooting ve Hatalar ⚠️

| Doküman | Açıklama | Öncelik |
|---------|----------|---------|
| [ERRORS.md](ERRORS.md) | **Build ve Runtime hatası çözümleri** | 🔴 KRİTİK |

**🚨 Önemli:** Build hatası aldığınızda **ÖNCE** `ERRORS.md` dosyasını kontrol edin!

---

## 🏗️ Mimari Genel Bakış

### Backend Mimarisi (.NET 9)

```
┌─────────────────────────────────────────────────┐
│           ASP.NET Core Web API (.NET 9)         │
├─────────────────────────────────────────────────┤
│  API Layer (Controllers)                        │
│  ├─ AuthController (Login, Refresh)             │
│  └─ [Module Controllers]                        │
├─────────────────────────────────────────────────┤
│  Application Layer (Services)                   │
│  ├─ AuthService (Sicil & Password Logic)        │
│  └─ [Business Services]                         │
├─────────────────────────────────────────────────┤
│  Infrastructure Layer (EF Core)                 │
│  ├─ PostgreSQL 16                               │
│  └─ Migrations                                  │
└─────────────────────────────────────────────────┘
```

### Frontend Mimarisi (React + Vite)

```
┌─────────────────────────────────────────────────┐
│           React 19 + TypeScript + Vite          │
├─────────────────────────────────────────────────┤
│  Features                                       │
│  ├─ auth (Login Screen, Sicil Input)            │
│  └─ dashboard (Admin, User Views)               │
├─────────────────────────────────────────────────┤
│  Shared                                         │
│  ├─ api (Axios + Interceptors)                  │
│  └─ components (Tailwind UI)                    │
└─────────────────────────────────────────────────┘
```

---

## 🛤️ Geliştirme Yol Haritası Durumu

| Faz | Durum | Açıklama |
|-----|-------|----------|
| **Faz 1** | ✅ Tamamlandı | Authentication, Core, Sicil Login |
| **Faz 2** | 🔄 Devam Ediyor | RBAC, Admin Panel, Dashboard |
| **Faz 3** | ⏳ Beklemede | Multi-Unit Support |
| **Faz 4** | ⏳ Beklemede | HR Modülü |
| **Faz 5** | ⏳ Beklemede | IT Modülü + Docker |
| **Faz 6** | ⏳ Beklemede | Test & Optimizasyon |

---

## 📝 Kod Standartları ve Notlar

### Güvenlik
- **Sicil No:** Kullanıcı adı yerine Sicil No kullanılmaktadır (Benzersiz, değişmez).
- **Şifreleme:** BCrypt work factor 12.
- **Token:** JWT (8 saat ömürlü).

### Geliştirme
- **Branching:** `feature/faz2-dashboard` gibi feature branch'ler kullanın.
- **Commit:** Conventional Commits (feat: dashboard layout ekle).

---

**Son Güncelleme:** 27 Kasım 2025
**Versiyon:** 1.2
