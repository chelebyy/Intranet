# Dosya Yönetimi ve Export Sistemi

**Proje:** Kurumsal İntranet Web Portalı
**Versiyon:** 1.0
**Tarih:** 2025-11-24

---

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Dosya Yükleme Sistemi](#dosya-yükleme-sistemi)
- [Excel Export Sistemi](#excel-export-sistemi)
- [Veritabanı Şeması](#veritabanı-şeması)
- [Implementation Örnekleri](#implementation-örnekleri)

---

## 🎯 Genel Bakış

Sistem, kullanıcıların dosya yüklemesi ve admin'lerin veri export etmesi için iki temel özellik sunar:

1. **Dosya Yükleme:** PDF, PNG, JPG, DOCX formatlarında belgeler (max 10MB)
2. **Excel Export:** Kullanıcı listesi, audit log ve birim verileri export

### Kapsam

**Dosya Yükleme İçin:**
- ✅ İzin belgesi (İK modülü için)
- ✅ Arıza fotoğrafı (IT modülü için)
- ✅ Genel dokümanlar (her birim için)

**Export İçin:**
- ✅ Kullanıcı listesi (Excel/CSV)
- ✅ Audit log kayıtları (Excel/CSV)
- ✅ Birim özel verileri (Multi-sheet Excel)

### Kapsam Dışı

- ❌ Video/Audio dosyaları
- ❌ Virüs taraması (opsiyonel, ClamAV entegrasyonu eklenebilir)
- ❌ Dosya sürüm kontrolü (version control)
- ❌ Online dosya düzenleme (Google Docs tarzı)

---

## 📤 Dosya Yükleme Sistemi

### Teknik Gereksinimler

| Özellik | Değer |
|---------|-------|
| Max Dosya Boyutu | 10 MB |
| İzin Verilen Formatlar | PDF, PNG, JPG, JPEG, DOCX |
| Depolama | Encrypted file system (AES-256) |
| Metadata | PostgreSQL (UploadedFile tablosu) |
| Encoding | UTF-8 (Türkçe karakter desteği) |

### Dosya Adlandırma Stratejisi

Yüklenen dosyalar güvenli bir şekilde yeniden adlandırılır:

**Format:** `{Guid}_{Timestamp}_{SafeFileName}.{Extension}`

**Örnek:**
```
Original: "Yıllık İzin Belgesi (2025).pdf"
Stored:   "a7f3d2e1-4b5c-6d7e-8f9a-0b1c2d3e4f5a_20250115103045_yillik-izin-belgesi-2025.pdf"
```

### Güvenlik Önlemleri

1. **MIME Type Validation:**
   ```csharp
   var allowedMimeTypes = new[]
   {
       "application/pdf",
       "image/png",
       "image/jpeg",
       "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
   };
   ```

2. **Extension Whitelist:**
   ```csharp
   var allowedExtensions = new[] { ".pdf", ".png", ".jpg", ".jpeg", ".docx" };
   ```

3. **File Size Check:**
   ```csharp
   if (file.Length > 10 * 1024 * 1024) // 10MB
   {
       throw new ValidationException("Dosya boyutu 10MB'dan büyük olamaz");
   }
   ```

4. **Sanitization:**
   - Türkçe karakterleri normalize et (`ı→i`, `ş→s`, `ö→o`, vb.)
   - Özel karakterleri kaldır veya tire ile değiştir
   - Boşlukları tire ile değiştir

5. **Authorization:**
   - Sadece yetkilendirilmiş kullanıcılar dosya yükleyebilir
   - Dosya indirme: Sadece yükleyen veya birim admin'i

### Encryption (AES-256)

Dosyalar disk üzerinde şifreli saklanır:

```csharp
public async Task<string> SaveEncryptedFileAsync(Stream fileStream, string fileName)
{
    using var aes = Aes.Create();
    aes.Key = Convert.FromBase64String(_configuration["FileEncryption:Key"]);
    aes.GenerateIV();

    var encryptedPath = Path.Combine(_fileStoragePath, $"{Guid.NewGuid()}_{fileName}.enc");

    using var fileStreamOut = File.Create(encryptedPath);
    await fileStreamOut.WriteAsync(aes.IV); // IV'yi dosyanın başına yaz

    using var cryptoStream = new CryptoStream(fileStreamOut, aes.CreateEncryptor(), CryptoStreamMode.Write);
    await fileStream.CopyToAsync(cryptoStream);

    return encryptedPath;
}
```

---

## 📊 Excel Export Sistemi

### Kullanılan Kütüphane

**EPPlus** (önerilen) veya **ClosedXML**

**EPPlus NuGet Package:**
```bash
dotnet add package EPPlus --version 7.0.0
```

**License:** EPPlus 5.0+ ticari kullanım için lisans gerektirir (PolyCL 1.0.0). Alternatif olarak ClosedXML (MIT License) kullanılabilir.

### Export Limitleri

| Veri Türü | Max Satır | Format |
|-----------|-----------|--------|
| Kullanıcı Listesi | Sınırsız | XLSX, CSV |
| Audit Log | 10,000 satır | XLSX, CSV |
| Birim Verileri | Sınırsız | XLSX (multi-sheet) |

**Not:** Audit log için 10,000 satır limiti performans nedeniyle uygulanır. Daha fazla veri için tarih aralığı daraltılmalıdır.

### Excel Format Standardı

**Header Style:**
- Bold font
- Gray background (#DDDDDD)
- Border (all sides)

**Data Style:**
- Regular font
- White background
- Border (all sides)
- Tarih formatı: `DD.MM.YYYY HH:mm`

**Column Auto-Fit:**
- Tüm kolonlar içeriğe göre otomatik genişletilir

### Örnek: Kullanıcı Listesi Export

```csharp
public async Task<byte[]> ExportUsersToExcelAsync(int? birimId = null)
{
    var users = await _context.Users
        .Include(u => u.UserBirimRoles)
        .ThenInclude(ubr => ubr.Birim)
        .Where(u => !birimId.HasValue || u.UserBirimRoles.Any(ubr => ubr.BirimID == birimId))
        .ToListAsync();

    using var package = new ExcelPackage();
    var worksheet = package.Workbook.Worksheets.Add("Kullanıcılar");

    // Header
    worksheet.Cells[1, 1].Value = "Ad Soyad";
    worksheet.Cells[1, 2].Value = "Email";
    worksheet.Cells[1, 3].Value = "Ünvan";
    worksheet.Cells[1, 4].Value = "Birimler";
    worksheet.Cells[1, 5].Value = "Roller";
    worksheet.Cells[1, 6].Value = "Son Giriş";
    worksheet.Cells[1, 7].Value = "Durum";

    // Header style
    using (var range = worksheet.Cells[1, 1, 1, 7])
    {
        range.Style.Font.Bold = true;
        range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
        range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(221, 221, 221));
        range.Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
    }

    // Data
    int row = 2;
    foreach (var user in users)
    {
        worksheet.Cells[row, 1].Value = user.AdSoyad;
        worksheet.Cells[row, 2].Value = user.Email;
        worksheet.Cells[row, 3].Value = user.Unvan;
        worksheet.Cells[row, 4].Value = string.Join(", ", user.UserBirimRoles.Select(ubr => ubr.Birim.BirimAdi));
        worksheet.Cells[row, 5].Value = string.Join(", ", user.UserBirimRoles.Select(ubr => ubr.Role.RoleAdi));
        worksheet.Cells[row, 6].Value = user.SonGiris?.ToString("dd.MM.yyyy HH:mm") ?? "Hiç giriş yapmadı";
        worksheet.Cells[row, 7].Value = user.IsActive ? "Aktif" : "Pasif";
        row++;
    }

    // Auto-fit columns
    worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

    return package.GetAsByteArray();
}
```

### Multi-Sheet Excel (Birim Verileri)

```csharp
public async Task<byte[]> ExportBirimDataAsync(int birimId)
{
    using var package = new ExcelPackage();

    // Sheet 1: Kullanıcılar
    var userSheet = package.Workbook.Worksheets.Add("Kullanıcılar");
    // ... kullanıcı verileri ...

    // Sheet 2: İzin Talepleri (İK için)
    if (birimId == 102) // İK BirimID
    {
        var izinSheet = package.Workbook.Worksheets.Add("İzin Talepleri");
        // ... izin verileri ...
    }

    // Sheet 3: Arıza Kayıtları (IT için)
    if (birimId == 101) // IT BirimID
    {
        var arizaSheet = package.Workbook.Worksheets.Add("Arıza Kayıtları");
        // ... arıza verileri ...
    }

    return package.GetAsByteArray();
}
```

---

## 💾 Veritabanı Şeması

### UploadedFile Tablosu

```sql
CREATE TABLE "UploadedFile" (
    "FileID" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "FileName" VARCHAR(255) NOT NULL,
    "OriginalFileName" VARCHAR(255) NOT NULL,
    "FilePath" VARCHAR(500) NOT NULL,
    "FileSize" BIGINT NOT NULL,
    "MimeType" VARCHAR(100) NOT NULL,
    "FileExtension" VARCHAR(10) NOT NULL,
    "FileHash" VARCHAR(64) NOT NULL, -- SHA-256 hash

    -- İlişkili varlık (polymorphic)
    "EntityType" VARCHAR(50) NOT NULL, -- "IzinTalep", "ArizaKayit", vb.
    "EntityID" INTEGER NOT NULL,

    -- Kullanıcı bilgileri
    "UploadedByUserID" INTEGER NOT NULL REFERENCES "User"("UserID"),
    "BirimID" INTEGER NOT NULL REFERENCES "Birim"("BirimID"),

    -- Timestamps
    "UploadedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "IsDeleted" BOOLEAN DEFAULT FALSE,
    "DeletedAt" TIMESTAMP NULL,

    -- İsteğe bağlı
    "Description" TEXT NULL
);

-- Indexler
CREATE INDEX idx_uploadedfile_entity ON "UploadedFile"("EntityType", "EntityID");
CREATE INDEX idx_uploadedfile_user ON "UploadedFile"("UploadedByUserID");
CREATE INDEX idx_uploadedfile_birim ON "UploadedFile"("BirimID");
CREATE INDEX idx_uploadedfile_hash ON "UploadedFile"("FileHash"); -- Duplicate check
```

### ExportLog Tablosu (Opsiyonel)

Export işlemlerini takip etmek için:

```sql
CREATE TABLE "ExportLog" (
    "ExportID" SERIAL PRIMARY KEY,
    "ExportType" VARCHAR(50) NOT NULL, -- "Users", "AuditLog", "BirimData"
    "ExportFormat" VARCHAR(10) NOT NULL, -- "xlsx", "csv"
    "RowCount" INTEGER NOT NULL,
    "FileSizeBytes" BIGINT NOT NULL,
    "FilterParameters" JSONB NULL,

    "ExportedByUserID" INTEGER NOT NULL REFERENCES "User"("UserID"),
    "BirimID" INTEGER REFERENCES "Birim"("BirimID"),

    "ExportedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exportlog_type ON "ExportLog"("ExportType");
CREATE INDEX idx_exportlog_user ON "ExportLog"("ExportedByUserID");
```

---

## 🛠️ Implementation Örnekleri

### Backend: FileController

```csharp
[Route("api/files")]
[ApiController]
public class FileController : ControllerBase
{
    private readonly IFileService _fileService;

    [HttpPost("upload")]
    [HasPermission("file.upload")]
    [RequestSizeLimit(10 * 1024 * 1024)] // 10MB
    public async Task<IActionResult> UploadFile(
        [FromForm] IFormFile file,
        [FromForm] string entityType,
        [FromForm] int entityId,
        [FromForm] string? description)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { success = false, message = "Dosya seçilmedi" });

        var uploadedFile = await _fileService.UploadFileAsync(file, entityType, entityId, description);

        return Created($"/api/files/{uploadedFile.FileID}", new
        {
            success = true,
            data = uploadedFile,
            message = "Dosya başarıyla yüklendi"
        });
    }

    [HttpGet("{fileId}")]
    [HasPermission("file.read")]
    public async Task<IActionResult> DownloadFile(Guid fileId)
    {
        var file = await _fileService.GetFileAsync(fileId);

        if (file == null)
            return NotFound(new { success = false, message = "Dosya bulunamadı" });

        // Authorization check
        if (!await _fileService.CanUserAccessFileAsync(fileId, User.GetUserId()))
            return Forbid();

        var decryptedStream = await _fileService.GetDecryptedFileStreamAsync(file.FilePath);

        return File(decryptedStream, file.MimeType, file.OriginalFileName);
    }
}
```

### Backend: ExportController

```csharp
[Route("api/users")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IExportService _exportService;

    [HttpGet("export")]
    [HasPermission("user.export")]
    public async Task<IActionResult> ExportUsers(
        [FromQuery] string format = "xlsx",
        [FromQuery] int? birimId = null,
        [FromQuery] bool? isActive = null)
    {
        byte[] fileBytes;
        string contentType;
        string fileName;

        if (format.ToLower() == "xlsx")
        {
            fileBytes = await _exportService.ExportUsersToExcelAsync(birimId, isActive);
            contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            fileName = $"kullanicilar-{DateTime.Now:yyyyMMdd}.xlsx";
        }
        else // CSV
        {
            fileBytes = await _exportService.ExportUsersToCsvAsync(birimId, isActive);
            contentType = "text/csv";
            fileName = $"kullanicilar-{DateTime.Now:yyyyMMdd}.csv";
        }

        // Log export operation
        await _auditLogService.LogAsync(new AuditLog
        {
            Action = "Export",
            Resource = "Users",
            Details = new { Format = format, BirimId = birimId, RowCount = fileBytes.Length }
        });

        return File(fileBytes, contentType, fileName);
    }
}
```

### Frontend: Dosya Yükleme Component (React)

```tsx
import { useState } from 'react';
import axios from 'axios';

interface FileUploadProps {
  entityType: string;
  entityId: number;
  onUploadSuccess?: (file: UploadedFile) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  entityType,
  entityId,
  onUploadSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    // Validation
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('Sadece PDF, PNG, JPG ve DOCX dosyaları yüklenebilir');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('Dosya boyutu 10MB\'dan küçük olmalıdır');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', entityType);
    formData.append('entityId', entityId.toString());

    try {
      const response = await axios.post('/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        alert('Dosya başarıyla yüklendi');
        onUploadSuccess?.(response.data.data);
        setFile(null);
      }
    } catch (error) {
      alert('Dosya yükleme hatası');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.docx"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {file && (
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Yükleniyor...' : 'Yükle'}
        </button>
      )}
    </div>
  );
};
```

### Frontend: Excel Export Button

```tsx
import axios from 'axios';

export const ExportButton: React.FC<{ endpoint: string; filename: string }> = ({ endpoint, filename }) => {
  const handleExport = async () => {
    try {
      const response = await axios.get(endpoint, {
        responseType: 'blob'
      });

      // Download file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Export işlemi başarısız oldu');
    }
  };

  return (
    <button onClick={handleExport} className="export-button">
      Excel'e Aktar
    </button>
  );
};

// Kullanım:
<ExportButton
  endpoint="/api/users/export?format=xlsx"
  filename="kullanicilar.xlsx"
/>
```

---

## 📝 Configuration

### appsettings.json

```json
{
  "FileStorage": {
    "BasePath": "C:\\IntranetFiles",
    "MaxFileSizeBytes": 10485760,
    "AllowedExtensions": [".pdf", ".png", ".jpg", ".jpeg", ".docx"],
    "EncryptionKey": "Your-32-Byte-Base64-Encryption-Key-Here=="
  },
  "Export": {
    "MaxRowsAuditLog": 10000,
    "TempPath": "C:\\Temp\\Exports"
  }
}
```

### Linux için:

```json
{
  "FileStorage": {
    "BasePath": "/var/intranet/files",
    ...
  }
}
```

---

## 🔒 Güvenlik Kontrol Listesi

- [ ] MIME type validation aktif
- [ ] File extension whitelist uygulanıyor
- [ ] Max file size (10MB) kontrolü yapılıyor
- [ ] Dosya adları sanitize ediliyor
- [ ] Dosyalar AES-256 ile şifreleniyor
- [ ] Authorization kontrolleri yapılıyor (upload/download)
- [ ] SHA-256 hash duplicate check için kullanılıyor
- [ ] Export işlemleri audit log'a yazılıyor
- [ ] Rate limiting uygulanıyor (örn: 10 upload/dakika)
- [ ] Dosya indirme direct link değil, API üzerinden

---

## 📈 Performans İpuçları

1. **Async I/O:** Tüm dosya işlemlerinde async/await kullan
2. **Streaming:** Büyük dosyaları memory'e almadan stream et
3. **CDN (Opsiyonel):** Production'da nginx static file serving kullanılabilir
4. **Cleanup Job:** Soft delete edilmiş dosyaları periyodik temizle (30 gün sonra)
5. **Export Cache:** Aynı parametrelerle yapılan export'ları 5 dakika cache'le

---

**Son Güncelleme:** 2025-11-24
**Versiyon:** 1.0
