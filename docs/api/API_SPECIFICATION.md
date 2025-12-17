# API Spesifikasyonu - Kurumsal İntranet Web Portalı

Bu doküman, **Kurumsal İntranet Web Portalı** backend API'sinin tüm endpoint'lerini, request/response formatlarını ve kullanım örneklerini içerir.

---

## 1. Genel Bilgiler

### 1.1. Base URL
- **Geliştirme:** `https://localhost:5001/api`
- **Production:** `https://api.intranet.local/api`

### 1.2. Authentication
Tüm endpoint'ler (login hariç) JWT Bearer token ile korunmaktadır.

**Header:**
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## 2. Authentication Endpoints
*(Not: Bu bölüm mevcut dokümanda zaten var, değişiklik yok)*

---

## 3. Maintenance Endpoints (Veritabanı Bakımı)

### 3.1. Bakım İstatistikleri
**Endpoint:** `GET /api/admin/maintenance/stats`
**Yetki:** `maintenance.manage` (SuperAdmin)
**Response (200):**
```json
{
  "success": true,
  "data": {
    "databaseSize": "1.2 GB",
    "totalTables": 45,
    "activeConnections": 12,
    "lastVacuum": "2025-01-15T03:00:00Z"
  }
}
```

### 3.2. Tablo İstatistikleri
**Endpoint:** `GET /api/admin/maintenance/tables`
**Response:** Tüm tabloların boyut, satır sayısı ve dead tuple oranlarını döner.

### 3.3. Bakım İşlemleri (Vacuum/Analyze/Reindex)
**Endpoint:** `POST /api/admin/maintenance/vacuum`
**Endpoint:** `POST /api/admin/maintenance/vacuum-full`
**Endpoint:** `POST /api/admin/maintenance/analyze`
**Endpoint:** `POST /api/admin/maintenance/reindex`

**Request Body:**
```json
{
  "tableName": "Users" // Opsiyonel, boş ise tüm DB
}
```

### 3.4. Bakım Modu Yönetimi
**Endpoint:** `POST /api/admin/maintenance/mode`
**Request Body:**
```json
{
  "enabled": true,
  "message": "Sistem bakımı nedeniyle 1 saat kapalıyız."
}
```

---

## 4. Backup Endpoints (Yedekleme)

### 4.1. Yedekleri Listele
**Endpoint:** `GET /api/admin/backups`
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "fileName": "backup_20250115_120000.sql.gz",
      "size": "45 MB",
      "createdAt": "2025-01-15T12:00:00Z"
    }
  ]
}
```

### 4.2. Manuel Yedekleme Başlat
**Endpoint:** `POST /api/admin/backups/trigger`
**Response:** Yedekleme işlemini asenkron başlatır veya sonucu döner.

### 4.3. Yedek İndir
**Endpoint:** `GET /api/admin/backups/{fileName}`
**Response:** Dosya stream (application/octet-stream).

---

## 5. IP Restrictions Endpoints (Güvenlik)

### 5.1. Kuralları Listele
**Endpoint:** `GET /api/IPRestrictions`
**Yetki:** `system.read`

### 5.2. Yeni Kural Ekle
**Endpoint:** `POST /api/IPRestrictions`
**Yetki:** `maintenance.manage`
**Request Body:**
```json
{
  "ipAddress": "192.168.1.100",
  "isAllowed": true,
  "description": "IT Ofis PC"
}
```

---

*(Diğer mevcut endpointler User, Role, Birim, AuditLog vb. korundu)*
