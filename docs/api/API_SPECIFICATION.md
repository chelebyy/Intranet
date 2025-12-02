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

### 1.3. Standart Response Formatı

**Başarılı:**
```json
{
  "success": true,
  "data": { ... },
  "message": "İşlem başarılı"
}
```

**Hata:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Sicil formatı geçersiz",
    "details": ["Sicil alanı zorunludur"]
  }
}
```

### 1.4. HTTP Status Kodları

| Kod | Anlam |
|-----|-------|
| 200 | İşlem başarılı |
| 201 | Kayıt oluşturuldu |
| 400 | Geçersiz istek (validation error) |
| 401 | Unauthorized (token yok veya geçersiz) |
| 403 | Forbidden (yetki yok) |
| 404 | Kayıt bulunamadı |
| 500 | Sunucu hatası |

---

## 2. Authentication Endpoints

### 2.1. Login

**Endpoint:** `POST /api/auth/login`

**Açıklama:** Kullanıcı girişi yapar ve JWT token döner.

**Request Body:**
```json
{
  "sicil": "12345",
  "password": "Sifre123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 28800,
    "user": {
      "userId": 1,
      "adSoyad": "Ahmet Yılmaz",
      "sicil": "12345",
      "unvan": "Kıdemli IT Uzmanı"
    },
    "birimleri": [
      {
        "birimId": 101,
        "birimAdi": "Bilgi İşlem",
        "roleId": 2,
        "roleAdi": "BirimAdmin"
      },
      {
        "birimId": 102,
        "birimAdi": "İnsan Kaynakları",
        "roleId": 4,
        "roleAdi": "BirimGoruntuleyen"
      }
    ]
  }
}
```

**Response (401):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Sicil veya şifre hatalı"
  }
}
```

**IP Engelleme (403):**
```json
{
  "success": false,
  "error": {
    "code": "IP_BLOCKED",
    "message": "Bu IP adresinden erişim izni yok"
  }
}
```

### 2.2. Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Çıkış başarılı"
}
```

### 2.3. Refresh Token (Opsiyonel)

**Endpoint:** `POST /api/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "refresh_token_value"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
}
```

### 2.4. Şifre Değiştirme

**Endpoint:** `POST /api/auth/change-password`

**Request Body:**
```json
{
  "currentPassword": "EskiSifre123!",
  "newPassword": "YeniSifre456!",
  "confirmPassword": "YeniSifre456!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Şifre başarıyla değiştirildi"
}
```

---

## 3. Dashboard Endpoints

### 3.1. Dashboard İstatistikleri

**Endpoint:** `GET /api/dashboard/stats`

**Yetki:** `view.dashboard` (SuperAdmin otomatik bypass)

**Açıklama:** Sistem genelindeki istatistikleri ve son aktiviteleri döner.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "activeUsers": 142,
    "totalBirimler": 12,
    "activeBirimler": 10,
    "totalRoles": 5,
    "usersByBirim": [
      { "birimId": 1, "birimAdi": "Bilgi İşlem", "userCount": 25 },
      { "birimId": 2, "birimAdi": "İnsan Kaynakları", "userCount": 18 }
    ],
    "recentActivities": [
      {
        "id": 1,
        "action": "Kullanıcı oluşturuldu",
        "userFullName": "Ahmet Yılmaz",
        "timeAgo": "5 dakika önce",
        "iconName": "person_add"
      }
    ]
  }
}
```

### 3.2. Son Aktiviteler

**Endpoint:** `GET /api/dashboard/activities`

**Yetki:** `view.dashboard`

**Query Parameters:**
- `count` (int, default: 10) - Döndürülecek aktivite sayısı

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "action": "Kullanıcı oluşturuldu",
      "userFullName": "Ahmet Yılmaz",
      "timeAgo": "5 dakika önce",
      "iconName": "person_add"
    },
    {
      "id": 2,
      "action": "Rol güncellendi",
      "userFullName": "Sistem",
      "timeAgo": "1 saat önce",
      "iconName": "shield"
    }
  ]
}
```

---

## 4. User Management Endpoints

### 4.1. Tüm Kullanıcıları Listele

**Endpoint:** `GET /api/users`

**Yetki:** `user.read`

**Query Parameters:**
- `page` (int, default: 1)
- `pageSize` (int, default: 20)
- `search` (string, optional) - AdSoyad veya Sicil'de arama
- `isActive` (bool, optional) - Aktif/pasif filtresi

**Example:** `GET /api/users?page=1&pageSize=10&search=ahmet&isActive=true`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "userId": 1,
        "adSoyad": "Ahmet Yılmaz",
        "sicil": "12345",
        "unvan": "Kıdemli IT Uzmanı",
        "isActive": true,
        "sonGiris": "2025-01-15T14:30:00Z",
        "birimleri": [
          {
            "birimId": 101,
            "birimAdi": "Bilgi İşlem",
            "roleAdi": "BirimAdmin"
          }
        ]
      }
    ],
    "totalCount": 45,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5
  }
}
```

### 3.2. Kullanıcı Detayı

**Endpoint:** `GET /api/users/{id}`

**Yetki:** `user.read`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "adSoyad": "Ahmet Yılmaz",
    "sicil": "12345",
    "unvan": "Kıdemli IT Uzmanı",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00Z",
    "sonGiris": "2025-01-15T14:30:00Z",
    "birimleri": [
      {
        "birimId": 101,
        "birimAdi": "Bilgi İşlem",
        "roleId": 2,
        "roleAdi": "BirimAdmin",
        "assignedAt": "2024-01-01T10:00:00Z"
      }
    ]
  }
}
```

### 3.3. Yeni Kullanıcı Oluştur

**Endpoint:** `POST /api/users`

**Yetki:** `user.create`

**Request Body:**
```json
{
  "adSoyad": "Mehmet Kaya",
  "sicil": "67890",
  "password": "TempPass123!",
  "unvan": "IT Uzmanı",
  "birimRolleri": [
    {
      "birimId": 101,
      "roleId": 3
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "userId": 15,
    "adSoyad": "Mehmet Kaya",
    "sicil": "67890"
  },
  "message": "Kullanıcı başarıyla oluşturuldu"
}
```

### 3.4. Kullanıcı Güncelle

**Endpoint:** `PUT /api/users/{id}`

**Yetki:** `user.update`

**Request Body:**
```json
{
  "adSoyad": "Mehmet Kaya (Güncel)",
  "unvan": "Kıdemli IT Uzmanı",
  "isActive": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Kullanıcı güncellendi"
}
```

### 3.5. Kullanıcı Sil (Soft Delete)

**Endpoint:** `DELETE /api/users/{id}`

**Yetki:** `user.delete`

**Response (200):**
```json
{
  "success": true,
  "message": "Kullanıcı pasife alındı"
}
```

### 3.6. Kullanıcıya Birim ve Rol Ata

**Endpoint:** `POST /api/users/{id}/birim-role`

**Yetki:** `user.update`

**Request Body:**
```json
{
  "birimId": 102,
  "roleId": 4
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Kullanıcıya birim ve rol atandı"
}
```

---

## 4. Birim Management Endpoints

### 4.1. Tüm Birimleri Listele

**Endpoint:** `GET /api/birimler`

**Yetki:** Tüm kullanıcılar

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "birimId": 101,
      "birimAdi": "Bilgi İşlem",
      "aciklama": "IT departmanı",
      "isActive": true,
      "kullaniciSayisi": 12
    },
    {
      "birimId": 102,
      "birimAdi": "İnsan Kaynakları",
      "aciklama": "İK departmanı",
      "isActive": true,
      "kullaniciSayisi": 8
    }
  ]
}
```

### 4.2. Yeni Birim Oluştur

**Endpoint:** `POST /api/birimler`

**Yetki:** `birim.manage`

**Request Body:**
```json
{
  "birimAdi": "Satın Alma",
  "aciklama": "Satın alma ve tedarik departmanı"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "birimId": 103,
    "birimAdi": "Satın Alma"
  }
}
```

### 4.3. Birim Güncelle

**Endpoint:** `PUT /api/birimler/{id}`

**Yetki:** `birim.manage`

**Request Body:**
```json
{
  "birimAdi": "Satın Alma ve Tedarik",
  "aciklama": "Güncellenmiş açıklama",
  "isActive": true
}
```

### 4.4. Birim Sil

**Endpoint:** `DELETE /api/birimler/{id}`

**Yetki:** `birim.manage`

**Response (200):**
```json
{
  "success": true,
  "message": "Birim silindi"
}
```

**Not:** Birimde kullanıcı varsa silme işlemi engellenir (400 Bad Request).

---

## 5. Role & Permission Endpoints

### 5.1. Tüm Rolleri Listele

**Endpoint:** `GET /api/roles`

**Yetki:** `user.read`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "roleId": 1,
      "roleAdi": "SistemAdmin",
      "aciklama": "Tüm sistem yöneticisi",
      "permissionCount": 25
    },
    {
      "roleId": 2,
      "roleAdi": "BirimAdmin",
      "aciklama": "Birim yöneticisi",
      "permissionCount": 12
    }
  ]
}
```

### 5.2. Rol Detayı (Yetkiler Dahil)

**Endpoint:** `GET /api/roles/{id}`

**Yetki:** `user.read`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "roleId": 2,
    "roleAdi": "BirimAdmin",
    "aciklama": "Birim yöneticisi",
    "permissions": [
      {
        "permissionId": 5,
        "action": "create",
        "resource": "announcement",
        "description": "Duyuru oluşturma"
      },
      {
        "permissionId": 6,
        "action": "update",
        "resource": "announcement",
        "description": "Duyuru güncelleme"
      }
    ]
  }
}
```

### 5.3. Yeni Rol Oluştur

**Endpoint:** `POST /api/roles`

**Yetki:** `role.manage` (Sadece Sistem Admin)

**Request Body:**
```json
{
  "roleAdi": "SatinAlmaOnaylayici",
  "aciklama": "Satın alma taleplerini onaylayan rol",
  "permissionIds": [15, 16, 17]
}
```

### 5.4. Tüm Yetkileri Listele

**Endpoint:** `GET /api/permissions`

**Yetki:** `user.read`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "permissionId": 1,
      "action": "create",
      "resource": "user",
      "description": "Kullanıcı oluşturma yetkisi"
    },
    {
      "permissionId": 2,
      "action": "read",
      "resource": "user",
      "description": "Kullanıcı görüntüleme yetkisi"
    }
  ]
}
```

---

## 6. Audit Log Endpoints

### 6.1. Audit Logları Listele

**Endpoint:** `GET /api/auditlogs`

**Yetki:** `auditlog.read`

**Query Parameters:**
- `page` (int)
- `pageSize` (int)
- `userId` (int, optional)
- `birimId` (int, optional)
- `action` (string, optional)
- `startDate` (datetime, optional)
- `endDate` (datetime, optional)

**Example:** `GET /api/auditlogs?userId=1&startDate=2025-01-01&endDate=2025-01-31`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "logId": 12345,
        "userId": 1,
        "userName": "Ahmet Yılmaz",
        "birimId": 101,
        "birimAdi": "Bilgi İşlem",
        "action": "CreateUser",
        "resource": "User",
        "details": {
          "targetUserId": 15,
          "targetSicil": "67890"
        },
        "ipAddress": "192.168.1.50",
        "tarihSaat": "2025-01-15T10:30:00Z"
      }
    ],
    "totalCount": 1523,
    "page": 1,
    "pageSize": 20
  }
}
```

### 6.2. Kullanıcı Bazlı Log Özeti

**Endpoint:** `GET /api/auditlogs/summary/{userId}`

**Yetki:** `auditlog.read`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "totalActions": 245,
    "lastLoginDate": "2025-01-15T14:30:00Z",
    "actionBreakdown": [
      { "action": "Login", "count": 89 },
      { "action": "CreateUser", "count": 12 },
      { "action": "UpdateContent", "count": 144 }
    ]
  }
}
```

---

## 7. Birim İçerik Modülleri (Örnek: Duyurular)

### 7.1. Duyuruları Listele

**Endpoint:** `GET /api/birimler/{birimId}/duyurular`

**Yetki:** `announcement.read` (seçilen birimde)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "duyuruId": 1,
      "baslik": "Sistem Bakımı Duyurusu",
      "icerik": "15 Ocak tarihinde sistem bakımı yapılacaktır.",
      "olusturanUserId": 1,
      "olusturanAd": "Ahmet Yılmaz",
      "olusturmaTarihi": "2025-01-10T09:00:00Z",
      "isPinned": true
    }
  ]
}
```

### 7.2. Yeni Duyuru Oluştur

**Endpoint:** `POST /api/birimler/{birimId}/duyurular`

**Yetki:** `announcement.create`

**Request Body:**
```json
{
  "baslik": "Yeni Duyuru",
  "icerik": "Duyuru içeriği buraya gelecek",
  "isPinned": false
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "duyuruId": 25,
    "baslik": "Yeni Duyuru"
  }
}
```

### 7.3. Duyuru Güncelle

**Endpoint:** `PUT /api/birimler/{birimId}/duyurular/{id}`

**Yetki:** `announcement.update`

### 7.4. Duyuru Sil

**Endpoint:** `DELETE /api/birimler/{birimId}/duyurular/{id}`

**Yetki:** `announcement.delete`

---

## 8. Health Check & System Endpoints

### 8.1. Health Check

**Endpoint:** `GET /api/health`

**Yetki:** Public (kimlik doğrulama gerekmez)

**Response (200):**
```json
{
  "status": "Healthy",
  "checks": {
    "database": "Healthy",
    "memoryUsage": "512 MB / 16 GB",
    "uptime": "5 days 3 hours"
  }
}
```

### 8.2. Sistem Bilgileri

**Endpoint:** `GET /api/system/info`

**Yetki:** `system.read` (Sadece Sistem Admin)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "environment": "Production",
    "dotnetVersion": "9.0.1",
    "databaseVersion": "PostgreSQL 16.1",
    "totalUsers": 125,
    "totalBirimler": 8,
    "lastBackupDate": "2025-01-15T02:00:00Z"
  }
}
```

---

## 9. Error Codes Reference

| Code | Açıklama |
|------|----------|
| `VALIDATION_ERROR` | Giriş validasyon hatası |
| `INVALID_CREDENTIALS` | Geçersiz sicil/şifre |
| `IP_BLOCKED` | IP adresi whitelist'te yok |
| `TOKEN_EXPIRED` | JWT token süresi dolmuş |
| `UNAUTHORIZED` | Token yok veya geçersiz |
| `FORBIDDEN` | Yetki yetersiz |
| `NOT_FOUND` | Kayıt bulunamadı |
| `DUPLICATE_SICIL` | Sicil zaten kullanılıyor |
| `WEAK_PASSWORD` | Şifre güvenlik kurallarına uymuyor |
| `BIRIM_HAS_USERS` | Birimde kullanıcı var, silinemez |
| `SERVER_ERROR` | Sunucu hatası |

---

## 9. Dosya Yönetimi Endpoints

### 9.1. Dosya Yükleme

**Endpoint:** `POST /api/files/upload`

**Açıklama:** Dosya yükleme (izin belgesi, arıza fotoğrafı, vb.)

**Request:** `multipart/form-data`

**Form Fields:**
- `file`: Dosya (max 10MB)
- `entityType`: İlişkili varlık türü (örn: "IzinTalep", "ArizaKayit")
- `entityId`: İlişkili varlık ID'si
- `description`: Dosya açıklaması (opsiyonel)

**cURL Örneği:**
```bash
curl -X POST https://api.intranet.local/api/files/upload \
  -H "Authorization: Bearer {token}" \
  -F "file=@/path/to/document.pdf" \
  -F "entityType=IzinTalep" \
  -F "entityId=123" \
  -F "description=Yıllık izin belgesi"
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "fileId": "f4a7b2c1-8d9e-4f3a-b5c6-1d2e3f4a5b6c",
    "fileName": "document.pdf",
    "fileSize": 2457600,
    "mimeType": "application/pdf",
    "uploadedAt": "2025-01-15T10:30:00Z",
    "downloadUrl": "/api/files/f4a7b2c1-8d9e-4f3a-b5c6-1d2e3f4a5b6c"
  },
  "message": "Dosya başarıyla yüklendi"
}
```

**Validation Rules:**
- Max dosya boyutu: 10MB
- İzin verilen formatlar: PDF, PNG, JPG, JPEG, DOCX
- Dosya adı: Türkçe karakter ve özel karakterler temizlenir

**Hata Kodları:**
- `FILE_TOO_LARGE`: Dosya 10MB'dan büyük
- `INVALID_FILE_TYPE`: Dosya formatı izin verilmeyen türde
- `UPLOAD_FAILED`: Dosya yükleme hatası

---

### 9.2. Dosya İndirme

**Endpoint:** `GET /api/files/{fileId}`

**Açıklama:** Yüklenen dosyayı indirir.

**Authorization:** Sadece dosyayı yükleyen veya yetkili kullanıcılar indirebilir.

**Response:**
- Content-Type: dosyanın MIME type'ına göre (application/pdf, image/png, vb.)
- Content-Disposition: `attachment; filename="document.pdf"`

**cURL Örneği:**
```bash
curl -X GET https://api.intranet.local/api/files/f4a7b2c1-8d9e-4f3a-b5c6-1d2e3f4a5b6c \
  -H "Authorization: Bearer {token}" \
  -O
```

---

### 9.3. Dosya Silme

**Endpoint:** `DELETE /api/files/{fileId}`

**Açıklama:** Dosyayı siler (sadece yükleyen veya admin).

**Response (200):**
```json
{
  "success": true,
  "message": "Dosya başarıyla silindi"
}
```

---

### 9.4. Varlığa Ait Dosyaları Listeleme

**Endpoint:** `GET /api/files?entityType={type}&entityId={id}`

**Açıklama:** Belirli bir varlığa (izin talebi, arıza kaydı) ait tüm dosyaları listeler.

**Query Parameters:**
- `entityType`: Varlık türü (IzinTalep, ArizaKayit, vb.)
- `entityId`: Varlık ID'si

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "fileId": "f4a7b2c1...",
      "fileName": "document.pdf",
      "fileSize": 2457600,
      "uploadedBy": "Ahmet Yılmaz",
      "uploadedAt": "2025-01-15T10:30:00Z",
      "downloadUrl": "/api/files/f4a7b2c1..."
    }
  ]
}
```

---

## 10. Veri Export (Dışa Aktarma) Endpoints

### 10.1. Kullanıcı Listesi Export

**Endpoint:** `GET /api/users/export?format=xlsx`

**Açıklama:** Kullanıcı listesini Excel formatında export eder.

**Permission:** `user.export`

**Query Parameters:**
- `format`: Export formatı (xlsx, csv)
- `birimId`: Belirli birim filtresi (opsiyonel)
- `isActive`: Aktif/Pasif filtresi (opsiyonel)

**Response:**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="kullanicilar-2025-01-15.xlsx"`

**Excel Kolonları:**
- Ad Soyad
- Sicil
- Ünvan
- Birimler
- Roller
- Son Giriş
- Durum (Aktif/Pasif)

**cURL Örneği:**
```bash
curl -X GET "https://api.intranet.local/api/users/export?format=xlsx" \
  -H "Authorization: Bearer {token}" \
  -O -J
```

---

### 10.2. Audit Log Export

**Endpoint:** `GET /api/audit-logs/export?format=xlsx`

**Açıklama:** Audit log kayıtlarını Excel formatında export eder.

**Permission:** `auditlog.export`

**Query Parameters:**
- `format`: Export formatı (xlsx, csv)
- `startDate`: Başlangıç tarihi (YYYY-MM-DD)
- `endDate`: Bitiş tarihi (YYYY-MM-DD)
- `action`: İşlem türü filtresi (opsiyonel)
- `userId`: Kullanıcı filtresi (opsiyonel)

**Response:**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="audit-log-2025-01-15.xlsx"`

**Excel Kolonları:**
- Tarih
- Kullanıcı
- İşlem (Action)
- Kaynak (Resource)
- Birim
- IP Adresi
- Detaylar

**Limit:** Maksimum 10,000 satır export edilir. Daha fazla veri için tarih aralığı daraltılmalıdır.

---

### 10.3. Birim Verileri Export

**Endpoint:** `GET /api/birimler/{birimId}/export?format=xlsx`

**Açıklama:** Birime ait verileri export eder (personel, izinler, arızalar, vb.)

**Permission:** `birim.export` (Birim Admin veya Sistem Admin)

**Query Parameters:**
- `format`: Export formatı (xlsx, csv)
- `dataType`: Export edilecek veri türü (users, izinler, arizalar, all)

**Response:**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="bilgi-islem-veriler-2025-01-15.xlsx"`

**Excel Format:**
- Eğer `dataType=all` ise, her veri türü için ayrı sheet oluşturulur
- Sheet 1: Kullanıcılar
- Sheet 2: İzin Talepleri (İK için)
- Sheet 3: Arıza Kayıtları (IT için)

---

## 11. Bakım Modu Endpoints

### 11.1. Bakım Modu Durumunu Görüntüleme

**Endpoint:** `GET /api/admin/maintenance-mode`

**Açıklama:** Mevcut bakım modu durumunu döner.

**Permission:** `admin.maintenance`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "isEnabled": false,
    "message": "Sistem normal çalışıyor",
    "lastChangedBy": "admin@kurum.local",
    "lastChangedAt": "2025-01-10T14:30:00Z"
  }
}
```

---

### 11.2. Bakım Modunu Açma/Kapama

**Endpoint:** `PUT /api/admin/maintenance-mode`

**Açıklama:** Bakım modunu açar veya kapatır.

**Permission:** `admin.maintenance` (Sadece Sistem Admin ve Super Admin)

**Request Body:**
```json
{
  "isEnabled": true,
  "message": "Sistem bakımda. Tahmini süre: 30 dakika."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Bakım modu başarıyla güncellendi"
}
```

**Not:** Bakım modu aktif olduğunda sadece Sistem Admin ve Super Admin erişebilir. Diğer kullanıcılar 503 Service Unavailable hatası alır.

---

## 12. Rate Limiting

**Login Endpoint:**
- 5 deneme / dakika / IP adresi

**Diğer Endpoint'ler:**
- 100 istek / dakika / kullanıcı

**Response (429 - Too Many Requests):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Çok fazla istek gönderildi. 1 dakika bekleyin.",
    "retryAfter": 60
  }
}
```

---

## 11. Swagger UI

Tüm API endpoint'leri Swagger arayüzünden test edilebilir:

**URL:** `https://api.intranet.local/swagger`

---

Bu API spesifikasyonu, frontend geliştiricilerin ve entegrasyon ekiplerinin backend ile iletişim kurması için gerekli tüm bilgileri içerir.
