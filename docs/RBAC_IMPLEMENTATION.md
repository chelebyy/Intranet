# RBAC Implementasyon Detayları

## 1. Genel Bakış

Role-Based Access Control (RBAC) sistemi, kullanıcıların sistem kaynaklarına erişimini roller ve izinler üzerinden yönetir. Bu projede RBAC, Attribute-based Authorization (`[HasPermission]`) ve dinamik permission kontrolü ile uygulanmıştır.

## 2. Veritabanı Şeması

### Entities
- **User:** Sistem kullanıcısı.
- **Role:** Kullanıcı rolleri (SistemAdmin, BirimAdmin, vb.).
- **Permission:** Sistemdeki atomik yetkiler (create.user, read.announcement, vb.).
- **RolePermission:** Rol ve İzin arasındaki çoka-çok ilişki.
- **UserBirimRole:** Kullanıcının hangi birimde hangi role sahip olduğu.

### İlişki Diyagramı
```
User 1 -- * UserBirimRole * -- 1 Role 1 -- * RolePermission * -- 1 Permission
```

## 3. İzin Listesi (Permissions)

| Resource | Action | Permission Key | Açıklama |
|----------|--------|----------------|----------|
| User | Create | `create.user` | Yeni kullanıcı oluşturma |
| User | Read | `read.user` | Kullanıcıları listeleme ve görüntüleme |
| User | Update | `update.user` | Kullanıcı bilgilerini güncelleme |
| User | Delete | `delete.user` | Kullanıcıyı pasife alma (soft delete) |
| User | Export | `export.user` | Kullanıcı listesini Excel'e aktarma |
| Announcement | Create | `create.announcement` | Duyuru oluşturma |
| Announcement | Read | `read.announcement` | Duyuruları görüntüleme |
| Announcement | Update | `update.announcement` | Duyuru güncelleme |
| Announcement | Delete | `delete.announcement` | Duyuru silme |
| AuditLog | Read | `read.auditlog` | Logları görüntüleme |
| AuditLog | Export | `export.auditlog` | Logları dışa aktarma |
| Birim | Manage | `manage.birim` | Birim oluşturma/düzenleme/silme |
| File | Upload | `upload.file` | Dosya yükleme |
| File | Read | `read.file` | Dosya indirme/görüntüleme |
| File | Delete | `delete.file` | Dosya silme |
| System | Manage | `manage.system` | Sistem ayarları ve bakım modu |
| Role | Manage | `manage.roles` | Rol ve yetki yönetimi |

## 4. Kod Yapısı

### 4.1. HasPermissionAttribute
Endpoint'leri korumak için kullanılır.

```csharp
[HttpGet]
[HasPermission(Permissions.ReadUser)]
public IActionResult GetUsers() { ... }
```

### 4.2. PermissionAuthorizationFilter
Her istekte çalışır:
1. Kullanıcı authenticated mi?
2. Token'daki `roleId` claim'i okunur.
3. `PermissionService` üzerinden rolün yetkisi var mı kontrol edilir.

### 4.3. PermissionService (Caching)
Performans için yetkiler önbelleğe alınır (MemoryCache).
- **Cache Key:** `permissions_role_{roleId}`
- **Süre:** 1 saat (Sliding: 20 dk)

## 5. Güvenlik Notları
- İzin kontrolleri sunucu tarafında yapılır.
- Token manipülasyonuna karşı JWT imzası (HMAC-SHA256) kullanılır.
- Rol yetkileri değiştiğinde Cache invalidation yapılmalıdır (henüz implement edilmedi - TODO).
