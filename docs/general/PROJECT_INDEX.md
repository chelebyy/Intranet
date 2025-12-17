# Kurumsal İntranet Web Portalı - Proje İndeksi

**Proje Adı:** Kurumsal İntranet Web Portalı
**Versiyon:** 1.4
**Tarih:** 17 Aralık 2025
**Durum:** Faz 4 (Duyuru & Uyarı Sistemi) Tamamlandı - Faz 5 (Doküman Yönetimi) Başlıyor

---

## 📋 İçindekiler (Table of Contents)

- [Proje Özeti ve Son Durum](#proje-özeti-ve-son-durum)
- [Hızlı Başlangıç](#hızlı-başlangıç)
- [Dokümantasyon Haritası](#dokümantasyon-haritası)
- [Mimari Genel Bakış](#mimari-genel-bakış)
- [Geliştirme Yol Haritası](#geliştirme-yol-haritası)
- [Teknik Detaylar](#teknik-detaylar)

---

## 🎯 Proje Özeti ve Son Durum

**Kurumsal İntranet Web Portalı**, kurum içi iletişim, bilgi akışı ve birimler arası koordinasyonu kolaylaştırmak için geliştirilmiş **çok birimli, güvenli ve role dayalı yetkilendirme (RBAC)** yapısına sahip bir web portalıdır.

### 📊 Son Durum (17 Aralık 2025)
- ✅ **Faz 1-3 Tamamlandı:** Auth, RBAC, Multi-Unit, Admin Dashboard.
- ✅ **Faz 3.5 Tamamlandı:** Bakım (Maintenance), Yedekleme (Backup) ve IP Kısıtlama modülleri.
- ✅ **Faz 4 Tamamlandı:** Duyuru ve Uyarı Sistemi (Banner, Modal, Widget).
- 🔄 **Aktif:** **Faz 5 - Doküman Yönetimi** (Dosya yükleme, kategorizasyon, yetkilendirme).

### Temel Özellikler

- ✅ **Çok Birimli Yapı**: Kullanıcılar birden fazla departmana farklı rollerle atanabilir.
- ✅ **RBAC Sistemi**: Rol bazlı erişim kontrolü ile granüler yetkilendirme.
- ✅ **Duyuru Sistemi**: Hedef kitleli (Birim/Rol bazlı) duyuru ve uyarılar.
- ✅ **Sistem Bakımı**: DB Vacuum/Analyze ve Yedekleme yönetimi.
- ✅ **Güvenlik**: IP Whitelist, AES-256 PII şifreleme, Audit Logging.

---

## 🚀 Hızlı Başlangıç

### Geliştirici Kurulumu

1. **Backend:**
   ```bash
   cd intranet-portal/backend
   dotnet run --project IntranetPortal.API
   ```

2. **Frontend:**
   ```bash
   cd intranet-portal/frontend
   npm run dev
   ```

### Dokümantasyon Erişimi
- **Ana Kılavuz:** [CLAUDE.md](../../CLAUDE.md)
- **Roadmap:** [IMPLEMENTATION_ROADMAP.md](../technical/IMPLEMENTATION_ROADMAP.md)

---

## 📚 Dokümantasyon Haritası

### 🔹 Genel & Planlama
| Doküman | Açıklama |
|---------|----------|
| [PRD.md](PRD.md) | Ürün Gereksinim Dokümanı |
| [PROJE_ORGANIZASYON_OZETI.md](PROJE_ORGANIZASYON_OZETI.md) | Organizasyon ve roller |
| [active_task.md](../../active_task.md) | **Güncel Görev Durumu** |

### 🔹 Teknik & Mimari
| Doküman | Açıklama |
|---------|----------|
| [PROJECT_STRUCTURE.md](../technical/PROJECT_STRUCTURE.md) | Proje dosya yapısı ve modüller |
| [TECHNICAL_DESIGN.md](../technical/TECHNICAL_DESIGN.md) | Sistem mimarisi ve tasarım |
| [ERD.md](../technical/ERD.md) | Veritabanı şeması |
| [TECH_STACK.md](../technical/TECH_STACK.md) | Teknoloji yığını |

### 🔹 API & Entegrasyon
| Doküman | Açıklama |
|---------|----------|
| [API_SPECIFICATION.md](../api/API_SPECIFICATION.md) | Detaylı API uç noktaları |
| [API_INDEX.md](../api/API_INDEX.md) | API Hızlı Referansı |

### 🔹 Güvenlik & Raporlar
| Doküman | Açıklama |
|---------|----------|
| [SECURITY_ANALYSIS_REPORT.md](../reports/SECURITY_ANALYSIS_REPORT.md) | Güvenlik analizi |
| [ERRORS.md](../reports/ERRORS.md) | Hata çözümleri ve troubleshooting |

---

## 🏗️ Mimari Genel Bakış

Proje **Clean Architecture** prensiplerine uygun olarak Backend (.NET) ve **Feature-Based** mimariye uygun Frontend (React) yapısındadır.

### Modüller
- **Core:** Auth, Users, Roles, AuditLogs
- **Admin:** System Settings, Maintenance, Backup, IP Whitelist
- **Communication:** Announcements (Duyurular)
- **Business:** IT (Arıza/Envanter), Genel Bütçe (Planlanan)
- **Docs:** Document Management (Faz 5)

---

## 🛤️ Geliştirme Yol Haritası Durumu

| Faz | Durum | Açıklama |
|-----|-------|----------|
| **Faz 1-3** | ✅ Tamamlandı | Temel Altyapı (Auth, RBAC, Unit) |
| **Faz 3.5** | ✅ Tamamlandı | Admin Tools (Maintenance, Backup) |
| **Faz 4** | ✅ Tamamlandı | Duyuru & Uyarı Sistemi |
| **Faz 5** | 🔄 **Aktif** | Doküman Yönetimi |
| **Faz 6** | ⏳ Beklemede | Birim Modülleri (IT, İK, vb.) |

---

**Son Güncelleme:** 17 Aralık 2025