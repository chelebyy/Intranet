# API Documentation Index

**Proje:** Kurumsal İntranet Web Portalı
**API Versiyon:** 1.0
**Base URL:** `http://localhost:5000/api` (Development) | `https://intranet.kurum.local/api` (Production)

---

## 📋 İçindekiler

- [Genel Bilgiler](#genel-bilgiler)
- [Authentication](#authentication)
- [Authorization](#authorization)
- [Endpoint Kategorileri](#endpoint-kategorileri)
- [Hata Yönetimi](#hata-yönetimi)
- [Rate Limiting](#rate-limiting)
- [Versiyonlama](#versiyonlama)

---

## 🌐 Genel Bilgiler

### API Mimarisi

- **Stil:** RESTful API
- **Format:** JSON
- **Authentication:** JWT Bearer Token
- **Encoding:** UTF-8
- **CORS:** Disabled (local network only)

### Request Headers

```http
Content-Type: application/json
Authorization: Bearer {jwt_token}
Accept: application/json
```

### Response Format

**Başarılı Yanıt:**
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "İşlem başarılı"
}
```

**Hata Yanıtı:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email alanı geçersiz",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

---

## 🔐 Authentication

### JWT Token Yapısı

**Token Claims:**
```json
{
  "userId": "1",
  "email": "ahmet@kurum.local",
  "birimId": "101",
  "role": "BirimAdmin",
  "iat": 1700000000,
  "exp": 1700028800
}
```

**Token Expiry:** 8 saat

### Authentication Flow

```
1. POST /api/auth/login → JWT token alır
2. Token'ı her request'te Authorization header'a ekler
3. Birden fazla birim varsa → GET /api/auth/my-birimler
4. Birim seçimi yapar → POST /api/auth/switch-birim
5. Yeni token alır (yeni birimId ile)
6. İlgili birim endpoint'lerine erişir
```

---

## 🛡️ Authorization

### Permission-Based Access Control

**Permission Format:** `{resource}.{action}`

**Örnekler:**
- `user.create` - Kullanıcı oluşturma
- `user.read` - Kullanıcı okuma
- `user.update` - Kullanıcı güncelleme
- `user.delete` - Kullanıcı silme
- `birim.admin` - Birim yönetimi
- `ik.personel.create` - Personel ekleme
- `ik.izin.approve` - İzin onaylama

### Backend Attribute Kullanımı

```csharp
[HasPermission("user.create")]
public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
{
    // Sadece user.create yetkisi olan kullanıcılar erişebilir
}
```

### Frontend Permission Check

```typescript
import { usePermission } from '@/hooks/usePermission';

function UserCreateButton() {
  const { hasPermission } = usePermission();

  if (!hasPermission('user.create')) {
    return null; // Button gösterilmez
  }

  return <button>Kullanıcı Ekle</button>;
}
```

---

## 📂 Endpoint Kategorileri

### 1. Authentication & Authorization

| Endpoint | Method | Permission | Açıklama |
|----------|--------|------------|----------|
| `/api/auth/login` | POST | - | Kullanıcı girişi |
| `/api/auth/logout` | POST | Authenticated | Kullanıcı çıkışı |
| `/api/auth/my-birimler` | GET | Authenticated | Kullanıcının birimlerini listele |
| `/api/auth/switch-birim` | POST | Authenticated | Aktif birimi değiştir |
| `/api/auth/refresh-token` | POST | Authenticated | Token yenile |

**Detaylar:** [API_SPECIFICATION.md - Auth Endpoints](API_SPECIFICATION.md#1-authentication-endpoints)

---

### 2. User Management

| Endpoint | Method | Permission | Açıklama |
|----------|--------|------------|----------|
| `/api/users` | GET | `user.read` | Tüm kullanıcıları listele |
| `/api/users/{id}` | GET | `user.read` | Kullanıcı detayı |
| `/api/users` | POST | `user.create` | Yeni kullanıcı oluştur |
| `/api/users/{id}` | PUT | `user.update` | Kullanıcı güncelle |
| `/api/users/{id}` | DELETE | `user.delete` | Kullanıcı sil (soft delete) |
| `/api/users/{id}/assign-birim` | POST | `user.update` | Kullanıcıya birim ata |
| `/api/users/{id}/assign-role` | POST | `user.update` | Kullanıcıya rol ata |

**Örnek Request:**
```json
POST /api/users
{
  "adSoyad": "Mehmet Demir",
  "email": "mehmet@kurum.local",
  "password": "Sifre123!",
  "unvan": "Yazılım Geliştirici",
  "birimId": 101,
  "roleId": 3
}
```

**Detaylar:** [API_SPECIFICATION.md - User Endpoints](API_SPECIFICATION.md#2-user-management-endpoints)

---

### 3. Birim (Unit) Management

| Endpoint | Method | Permission | Açıklama |
|----------|--------|------------|----------|
| `/api/birimler` | GET | Authenticated | Tüm birimleri listele |
| `/api/birimler/{id}` | GET | Authenticated | Birim detayı |
| `/api/birimler` | POST | `birim.create` | Yeni birim oluştur |
| `/api/birimler/{id}` | PUT | `birim.update` | Birim güncelle |
| `/api/birimler/{id}` | DELETE | `birim.delete` | Birim sil |
| `/api/birimler/{id}/users` | GET | `birim.read` | Birime ait kullanıcılar |
| `/api/birimler/{id}/roles` | GET | `birim.read` | Birime ait roller |

**Örnek Request:**
```json
POST /api/birimler
{
  "birimAdi": "Satın Alma",
  "aciklama": "Satın alma süreçlerini yönetir",
  "varsayilanRoleId": 4
}
```

**Detaylar:** [API_SPECIFICATION.md - Birim Endpoints](API_SPECIFICATION.md#3-birim-unit-management-endpoints)

---

### 4. Role & Permission Management

| Endpoint | Method | Permission | Açıklama |
|----------|--------|------------|----------|
| `/api/roles` | GET | `role.read` | Tüm rolleri listele |
| `/api/roles/{id}` | GET | `role.read` | Rol detayı |
| `/api/roles` | POST | `role.create` | Yeni rol oluştur |
| `/api/roles/{id}` | PUT | `role.update` | Rol güncelle |
| `/api/roles/{id}` | DELETE | `role.delete` | Rol sil |
| `/api/roles/{id}/permissions` | GET | `role.read` | Role ait yetkiler |
| `/api/roles/{id}/assign-permission` | POST | `role.update` | Role yetki ata |
| `/api/permissions` | GET | `permission.read` | Tüm yetkileri listele |

**Örnek Request:**
```json
POST /api/roles
{
  "roleAdi": "İK Onaylayıcı",
  "aciklama": "İnsan Kaynakları izin onaylayıcı rolü",
  "permissionIds": [101, 102, 103]
}
```

**Detaylar:** [API_SPECIFICATION.md - Role Endpoints](API_SPECIFICATION.md#4-role--permission-management-endpoints)

---

### 5. Audit Logs

| Endpoint | Method | Permission | Açıklama |
|----------|--------|------------|----------|
| `/api/audit-logs` | GET | `auditlog.read` | Tüm logları listele |
| `/api/audit-logs/{id}` | GET | `auditlog.read` | Log detayı |
| `/api/audit-logs/user/{userId}` | GET | `auditlog.read` | Kullanıcıya ait loglar |
| `/api/audit-logs/birim/{birimId}` | GET | `auditlog.read` | Birime ait loglar |
| `/api/audit-logs/search` | POST | `auditlog.read` | Filtrelenmiş log arama |

**Örnek Query Parameters:**
```
GET /api/audit-logs?startDate=2025-01-01&endDate=2025-01-31&action=create&resource=user&page=1&pageSize=50
```

**Detaylar:** [API_SPECIFICATION.md - Audit Log Endpoints](API_SPECIFICATION.md#5-audit-log-endpoints)

---

### 6. İK (Human Resources) Module

| Endpoint | Method | Permission | Açıklama |
|----------|--------|------------|----------|
| `/api/ik/personel` | GET | `ik.personel.read` | Personel listesi |
| `/api/ik/personel/{id}` | GET | `ik.personel.read` | Personel detayı |
| `/api/ik/personel` | POST | `ik.personel.create` | Yeni personel ekle |
| `/api/ik/personel/{id}` | PUT | `ik.personel.update` | Personel güncelle |
| `/api/ik/izin-talep` | GET | `ik.izin.read` | İzin talepleri listesi |
| `/api/ik/izin-talep` | POST | `ik.izin.create` | Yeni izin talebi |
| `/api/ik/izin-talep/{id}/approve` | POST | `ik.izin.approve` | İzin talebini onayla |
| `/api/ik/izin-talep/{id}/reject` | POST | `ik.izin.approve` | İzin talebini reddet |

**Örnek Request:**
```json
POST /api/ik/izin-talep
{
  "personelId": 15,
  "izinTipi": "Yıllık İzin",
  "baslangicTarihi": "2025-06-01",
  "bitisTarihi": "2025-06-10",
  "aciklama": "Yaz tatili"
}
```

**Detaylar:** [API_SPECIFICATION.md - İK Module](API_SPECIFICATION.md#6-ik-human-resources-module-endpoints)

---

### 7. IT (Bilgi İşlem) Module

| Endpoint | Method | Permission | Açıklama |
|----------|--------|------------|----------|
| `/api/it/ariza` | GET | `it.ariza.read` | Arıza kayıtları listesi |
| `/api/it/ariza` | POST | `it.ariza.create` | Yeni arıza kaydı |
| `/api/it/ariza/{id}` | GET | `it.ariza.read` | Arıza detayı |
| `/api/it/ariza/{id}` | PUT | `it.ariza.update` | Arıza güncelle |
| `/api/it/ariza/{id}/close` | POST | `it.ariza.update` | Arızayı kapat |
| `/api/it/envanter` | GET | `it.envanter.read` | Envanter listesi |
| `/api/it/envanter` | POST | `it.envanter.create` | Yeni envanter ekle |
| `/api/it/envanter/{id}` | PUT | `it.envanter.update` | Envanter güncelle |

**Örnek Request:**
```json
POST /api/it/ariza
{
  "baslik": "Bilgisayar açılmıyor",
  "aciklama": "Masaüstü bilgisayar sabahtan beri hiç açılmıyor",
  "oncelik": "Yüksek",
  "birimId": 102,
  "olusturanUserId": 25
}
```

**Detaylar:** [API_SPECIFICATION.md - IT Module](API_SPECIFICATION.md#7-it-bilgi-işlem-module-endpoints)

---

### 8. Admin Dashboard

| Endpoint | Method | Permission | Açıklama |
|----------|--------|------------|----------|
| `/api/admin/dashboard/stats` | GET | `admin.dashboard` | Dashboard istatistikleri |
| `/api/admin/ip-whitelist` | GET | `admin.security` | IP whitelist listesi |
| `/api/admin/ip-whitelist` | POST | `admin.security` | Yeni IP ekle |
| `/api/admin/ip-whitelist/{id}` | DELETE | `admin.security` | IP sil |
| `/api/admin/system-settings` | GET | `admin.settings` | Sistem ayarları |
| `/api/admin/system-settings` | PUT | `admin.settings` | Ayarları güncelle |

**Dashboard Stats Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 145,
    "activeUsers": 132,
    "totalBirimler": 8,
    "totalRoles": 12,
    "recentLogins": 23,
    "failedLoginAttempts": 2,
    "avgResponseTime": "180ms",
    "systemUptime": "99.8%"
  }
}
```

**Detaylar:** [API_SPECIFICATION.md - Admin Endpoints](API_SPECIFICATION.md#8-admin-dashboard-endpoints)

---

## ⚠️ Hata Yönetimi

### HTTP Status Codes

| Code | Durum | Açıklama |
|------|-------|----------|
| 200 | OK | Başarılı istek |
| 201 | Created | Kaynak başarıyla oluşturuldu |
| 204 | No Content | Başarılı işlem, dönüş verisi yok |
| 400 | Bad Request | Geçersiz request format/validasyon hatası |
| 401 | Unauthorized | Authentication başarısız/token geçersiz |
| 403 | Forbidden | Yetki yok (Permission eksik) |
| 404 | Not Found | Kaynak bulunamadı |
| 409 | Conflict | Veri çakışması (örn: email zaten var) |
| 429 | Too Many Requests | Rate limit aşıldı |
| 500 | Internal Server Error | Sunucu hatası |

### Hata Kodları

| Kod | Açıklama |
|-----|----------|
| `VALIDATION_ERROR` | Validasyon hatası |
| `UNAUTHORIZED` | Giriş gerekli |
| `FORBIDDEN` | Yetki yok |
| `NOT_FOUND` | Kaynak bulunamadı |
| `DUPLICATE_ENTRY` | Veri tekrarı |
| `INVALID_CREDENTIALS` | Kullanıcı adı/şifre hatalı |
| `TOKEN_EXPIRED` | Token süresi dolmuş |
| `IP_NOT_WHITELISTED` | IP izin listesinde değil |
| `RATE_LIMIT_EXCEEDED` | İstek limiti aşıldı |

### Hata Response Örneği

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email alanı geçersiz",
    "details": {
      "field": "email",
      "value": "invalid-email",
      "constraint": "Valid email format required"
    },
    "timestamp": "2025-01-15T10:30:00Z",
    "path": "/api/users"
  }
}
```

---

## 🚦 Rate Limiting

### Limitler

| Endpoint Category | Limit | Window |
|-------------------|-------|--------|
| `/api/auth/login` | 5 requests | 1 minute |
| `/api/auth/*` (other) | 20 requests | 1 minute |
| `/api/*` (general) | 100 requests | 1 minute |
| `/api/admin/*` | 50 requests | 1 minute |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1700000000
```

### Rate Limit Aşıldığında

**Response (429 Too Many Requests):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 60
  }
}
```

---

## 📌 Versiyonlama

### Mevcut Versiyon

**v1.0** - İlk production release

### Versiyon Stratejisi

API versiyonları URL path'inde tutulacaktır:

```
/api/v1/users
/api/v2/users (gelecek)
```

**Not:** Şu an sadece v1 kullanılıyor. Path'te versiyon belirtilmediğinde otomatik olarak v1 varsayılır.

### Breaking Changes

Breaking change yapılacak durumlarda:
1. Yeni versiyon (v2) oluşturulur
2. Eski versiyon (v1) minimum 6 ay desteklenir
3. Deprecated endpoint'ler response header'da bildirilir

```http
X-API-Deprecated: true
X-API-Deprecation-Date: 2025-12-31
X-API-Sunset-Date: 2026-06-30
```

---

## 🔗 İlgili Kaynaklar

### Dokümantasyon

- **Tam API Spesifikasyonu:** [API_SPECIFICATION.md](API_SPECIFICATION.md)
- **Veritabanı Şeması:** [ERD.md](ERD.md)
- **Teknik Tasarım:** [TECHNICAL_DESIGN.md](TECHNICAL_DESIGN.md)
- **Proje İndeksi:** [PROJECT_INDEX.md](PROJECT_INDEX.md)

### Test Ortamları

- **Development:** `http://localhost:5000/api`
- **Staging:** `http://192.168.1.50:5000/api`
- **Production:** `https://intranet.kurum.local/api`

### API Test Tools

Önerilen araçlar:
- **Postman** - API testing ve collection management
- **Swagger/OpenAPI** - API documentation ve interactive testing (planned)
- **cURL** - Command-line testing

### Örnek Postman Collection

```json
{
  "info": {
    "name": "Kurumsal İntranet API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"admin@kurum.local\",\"password\":\"Admin123!\"}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    }
  ]
}
```

---

## 📊 API Metrikleri

### Performans Hedefleri

| Metrik | Hedef | Ölçüm |
|--------|-------|-------|
| Ortalama Response Time | ≤200ms | p50 |
| 95th Percentile | ≤500ms | p95 |
| 99th Percentile | ≤1000ms | p99 |
| Throughput | ≥500 req/sec | Concurrent |
| Error Rate | ≤0.1% | 4xx+5xx errors |

### Monitoring

Önerilen metriklerin izlenmesi:
- Request count (per endpoint)
- Response time distribution
- Error rate (4xx, 5xx)
- Authentication failures
- Rate limit hits
- Database query performance

---

## 🛠️ Development Guide

### Local API Testing

```bash
# Backend'i başlat
cd IntranetPortal.API
dotnet run

# API erişilebilir: http://localhost:5000

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kurum.local","password":"Admin123!"}'

# Token ile istek
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer {token}"
```

### Frontend API Integration

```typescript
// api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Token ekleme
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Hata yönetimi
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

**Son Güncelleme:** 2025-11-23
**API Versiyon:** 1.0
**Doküman Versiyon:** 1.0
