# API Documentation Index

**Proje:** Kurumsal İntranet Web Portalı
**API Versiyon:** 1.0
**Base URL:** `http://localhost:5000/api` (Development) | `https://intranet.kurum.local/api` (Production)

---

## 📋 İçindekiler

- [Genel Bilgiler](#genel-bilgiler)
- [Authentication](#authentication)
- [Endpoint Kategorileri](#endpoint-kategorileri)

---

## 🌐 Genel Bilgiler

### API Mimarisi
- **Authentication:** JWT Bearer Token
- **Authorization:** `[HasPermission("action.resource")]`
- **Rate Limiting:** IP bazlı kısıtlama

---

## 📂 Endpoint Kategorileri

### 1. Authentication & Users
| Method | Endpoint | Permission | Açıklama |
|--------|----------|------------|----------|
| POST | `/api/auth/login` | - | Kullanıcı girişi |
| POST | `/api/auth/refresh-token` | Auth | Token yenileme |
| GET | `/api/users` | `user.read` | Kullanıcı listesi |
| POST | `/api/users` | `user.create` | Yeni kullanıcı |

### 2. Admin Tools (Yeni 🚀)
| Method | Endpoint | Permission | Açıklama |
|--------|----------|------------|----------|
| GET | `/api/maintenance/stats` | `admin.maintenance` | DB İstatistikleri |
| POST | `/api/maintenance/vacuum` | `admin.maintenance` | Vacuum işlemi |
| GET | `/api/backups` | `admin.backup` | Yedek listesi |
| POST | `/api/backups` | `admin.backup` | Yedek oluştur |
| GET | `/api/admin/ip-whitelist` | `admin.security` | IP Listesi |

### 3. Communication (Yeni 🚀)
| Method | Endpoint | Permission | Açıklama |
|--------|----------|------------|----------|
| GET | `/api/announcements` | Auth | Duyuruları listele |
| POST | `/api/announcements` | `announcement.create` | Duyuru oluştur |
| POST | `/api/announcements/{id}/read` | Auth | Okundu işaretle |

### 4. IT Module
| Method | Endpoint | Permission | Açıklama |
|--------|----------|------------|----------|
| GET | `/api/it/ariza` | `it.ariza.read` | Arıza kayıtları |
| POST | `/api/it/ariza` | `it.ariza.create` | Arıza bildir |

---

## 🔗 Detaylı Dokümantasyon
- [API_SPECIFICATION.md](API_SPECIFICATION.md) - Tüm endpoint'lerin request/response örnekleri.

---

**Son Güncelleme:** 17 Aralık 2025