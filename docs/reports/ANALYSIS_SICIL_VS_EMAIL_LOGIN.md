# Analiz Raporu: Sicil vs Email Login Kullanımı

**Tarih**: 2025-11-27
**Konu**: Sistem neden email ile giriş kullanıyor, sicil nerede?
**Durum**: ⚠️ TASARIM-KOD UYUŞMAZLIĞI TESPİT EDİLDİ

---

## 🔍 Bulgular Özeti

### 1. ✅ PRD Gereksinimi: SİCİL YOK - EMAIL VAR
**Kaynak**: PRD.md (Line 62-63)

```markdown
## 4. Sistem Genel Akışı

1. Kullanıcı login ekranına gelir.
2. IP adresi whitelist kontrolü yapılır. Erişim reddedilir veya devam edilir.
3. Kullanıcı adı/parola ile kimlik doğrulaması yapılır.
```

**Açıklama**:
- PRD'de "kullanıcı adı/parola" ifadesi kullanılmış
- Sicil numarası ile giriş **PRD'de açıkça belirtilmemiş**
- PRD'de email field zorunlu ve unique olarak tanımlanmış

---

### 2. ✅ ERD Şeması: EMAIL UNIQUE, SİCİL YOK
**Kaynak**: ERD.md - Section 5.1 (User Tablosu)

```sql
CREATE TABLE "User" (
    "UserID" SERIAL PRIMARY KEY,
    "AdSoyad" VARCHAR(100) NOT NULL,
    "Email" VARCHAR(150) UNIQUE NOT NULL,  -- ← UNIQUE constraint var
    "SifreHash" VARCHAR(255) NOT NULL,
    "Unvan" VARCHAR(100),
    -- Sicil field'ı yok!
    ...
);
```

**ERD Diagram (Line 55-63)**:
```mermaid
User {
    int UserID PK
    string AdSoyad
    string Email        -- ← Unique ve Required
    string SifreHash
    string Unvan
    datetime SonGiris
    boolean IsActive
}
```

**Sonuç**:
- ERD şemasında **Sicil field'ı tanımlı değil**
- Email UNIQUE constraint ile tanımlanmış (login için uygun)

---

### 3. ✅ Implementation: EMAIL İLE LOGIN YAPILDI (PRD/ERD UYUMLU)
**Kaynak**:
- `backend/IntranetPortal.Domain/Entities/User.cs` (Lines 33-37)
- `backend/IntranetPortal.Application/Services/AuthenticationService.cs`

**Entity Definition**:
```csharp
/// <summary>
/// Email address (unique, used for login)
/// </summary>
[Required]
[MaxLength(150)]
[Column("Email")]
public string Email { get; set; } = string.Empty;

// ❌ Sicil field'ı YOK!
```

**Authentication Service Logic**:
```csharp
// Email ile kullanıcı aranıyor
var user = await _context.Users
    .Include(u => u.UserBirimRoles)
        .ThenInclude(ubr => ubr.Birim)
    .Include(u => u.UserBirimRoles)
        .ThenInclude(ubr => ubr.Role)
    .FirstOrDefaultAsync(u => u.Email == email);  // ← Email kullanılıyor
```

**Sonuç**:
- Backend implementasyonu **ERD ve PRD ile uyumlu**
- Email ile kimlik doğrulama yapılıyor
- Sicil field'ı User entity'sinde yok

---

### 4. ⚠️ IMPLEMENTATION_ROADMAP: SİCİL KULLANIMI VAR (TUTARSIZLIK!)
**Kaynak**: IMPLEMENTATION_ROADMAP.md - Faz 4: HR Module Example (Line 1528, 1586, 1602, 1742, 1762)

**Personel Tablosu Örneği (HR Modülü - Line 1528)**:
```sql
CREATE TABLE "HR_Personel" (
    "PersonelID" SERIAL PRIMARY KEY,
    "UserID" INT REFERENCES "User"("UserID"),  -- İlişkili kullanıcı
    "SicilNo" VARCHAR(20) UNIQUE NOT NULL,      -- ← Sicil burada!
    "DogumTarihi" DATE,
    ...
);
```

**Context**:
- Bu örnek **HR (İnsan Kaynakları) modülü** için özel bir tablo
- Sicil, **User değil HR_Personel** tablosunda tanımlı
- User tablosu ile foreign key ilişkisi var
- **Login için değil, personel kayıtları için kullanılıyor**

---

## 📊 Analiz: Sicil Nerede Kullanılmalı?

### Seçenek 1: Sicil ile Login (Kullanıcı İsteği)
**Gereklilik**: User tablosuna Sicil field'ı eklenmeli

**Avantajlar**:
- Daha kolay hatırlanır (örn: 12345)
- Email adresi olmayan personel için uygun
- Kurumsal sistemlerde yaygın kullanım

**Değişiklik Gereksinimleri**:
1. **User Entity'sine Sicil ekle**:
   ```csharp
   [MaxLength(20)]
   [Column("Sicil")]
   public string? Sicil { get; set; }

   // Index for unique constraint
   ```

2. **Database Migration**:
   ```sql
   ALTER TABLE "User" ADD COLUMN "Sicil" VARCHAR(20) UNIQUE;
   CREATE UNIQUE INDEX idx_user_sicil ON "User"("Sicil") WHERE "Sicil" IS NOT NULL;
   ```

3. **AuthenticationService Güncelle**:
   ```csharp
   // Email VEYA Sicil ile giriş
   var user = await _context.Users
       .Where(u => u.Email == identifier || u.Sicil == identifier)
       .FirstOrDefaultAsync();
   ```

4. **Frontend Login Form**:
   - Email/Sicil input field (tek input, her ikisini de kabul eder)
   - Veya toggle button (Email ↔ Sicil)

---

### Seçenek 2: HR Modülünde Sicil Kullanımı (Mevcut Tasarım)
**Gereklilik**: User tablosu değişmez, HR_Personel tablosunda sicil

**Avantajlar**:
- PRD ve ERD ile uyumlu
- Email unique constraint korunur
- HR modülüne özgü veri (organizasyon bağımsız)

**Dezavantajlar**:
- Login için email zorunlu
- Sicil sadece HR kayıtlarında görünür

**Kullanım**:
```sql
-- User: Login için
Email: "ahmet@intranet.local"
Password: "***"

-- HR_Personel: Personel kayıtları için
SicilNo: "12345"
UserID: 1  -- ahmet@intranet.local ile ilişkili
```

---

## 🎯 Öneri: Hybrid Çözüm

### User Tablosuna Opsiyonel Sicil Ekle

**Neden?**
1. ✅ Kurumsal sistemlerde sicil yaygın kullanım
2. ✅ Email olmayan personel için alternatif
3. ✅ Geriye uyumluluk (nullable field)
4. ✅ Email ile uyumluluk (her ikisi de unique)

**Implementasyon Planı**:

#### 1. User Entity Güncelle
```csharp
/// <summary>
/// Personnel number (optional, unique if provided)
/// </summary>
[MaxLength(20)]
[Column("Sicil")]
public string? Sicil { get; set; }
```

#### 2. Migration Oluştur
```bash
dotnet ef migrations add AddSicilToUser --startup-project ../IntranetPortal.API
```

```sql
-- Migration içeriği:
ALTER TABLE "User" ADD COLUMN "Sicil" VARCHAR(20);
CREATE UNIQUE INDEX idx_user_sicil ON "User"("Sicil") WHERE "Sicil" IS NOT NULL;
```

#### 3. AuthenticationService Güncelle
```csharp
public async Task<LoginResponseDto> LoginAsync(string identifier, string password, string ipAddress)
{
    // identifier = email VEYA sicil
    var user = await _context.Users
        .Include(u => u.UserBirimRoles)
            .ThenInclude(ubr => ubr.Birim)
        .Include(u => u.UserBirimRoles)
            .ThenInclude(ubr => ubr.Role)
        .FirstOrDefaultAsync(u => u.Email == identifier || u.Sicil == identifier);

    if (user == null)
        throw new UnauthorizedAccessException("Invalid credentials");

    // Rest of authentication logic...
}
```

#### 4. Frontend Login Form Güncelle
```typescript
interface LoginCredentials {
  identifier: string;  // email VEYA sicil
  password: string;
  rememberMe?: boolean;
}
```

```tsx
<input
  type="text"
  name="identifier"
  placeholder="E-posta veya Sicil Numarası"
  value={formData.identifier}
  onChange={handleChange}
  required
/>
```

#### 5. Seed Data Güncelle
```csharp
// DatabaseSeeder.cs
var adminUser = new User
{
    AdSoyad = "Super Admin",
    Email = "admin@intranet.local",
    Sicil = "00001",  // ← Sicil eklendi
    SifreHash = BCrypt.Net.BCrypt.HashPassword("Admin123!", 12),
    Unvan = "Sistem Yöneticisi",
    IsActive = true,
    CreatedAt = DateTime.UtcNow,
    UpdatedAt = DateTime.UtcNow
};
```

---

## 📋 İlgili Dosyalar

### Değiştirilecek Dosyalar:
1. ✅ `backend/IntranetPortal.Domain/Entities/User.cs` (Line 37 sonrası)
2. ✅ `backend/IntranetPortal.Infrastructure/Configurations/UserConfiguration.cs` (Index ekle)
3. ✅ `backend/IntranetPortal.Application/Services/AuthenticationService.cs` (LoginAsync method)
4. ✅ `backend/IntranetPortal.Infrastructure/Data/Seeding/DatabaseSeeder.cs` (Admin user seed)
5. ✅ `frontend/src/types/index.ts` (LoginCredentials interface)
6. ✅ `frontend/src/features/auth/LoginPage.tsx` (Form field)

### Yeni Migration:
1. ✅ `backend/IntranetPortal.Infrastructure/Migrations/XXXXXX_AddSicilToUser.cs`

---

## 🚨 Kritik Notlar

### 1. Geriye Uyumluluk
- Sicil field'ı **nullable** olmalı (mevcut kullanıcılara sicil atanmamış)
- Email hala **required** ve **unique**
- Eski kullanıcılar email ile giriş yapmaya devam edebilir

### 2. Unique Constraint
- Email: UNIQUE NOT NULL (zorunlu)
- Sicil: UNIQUE NULL (opsiyonel, verilmişse unique)
- PostgreSQL partial index: `WHERE "Sicil" IS NOT NULL`

### 3. Login Identifier Detection
Backend otomatik tespit edebilir:
```csharp
// Email format check (@ içeriyorsa email)
bool isEmail = identifier.Contains("@");

var user = await _context.Users
    .Where(u => isEmail
        ? u.Email == identifier
        : u.Sicil == identifier)
    .FirstOrDefaultAsync();
```

Veya her ikisini de kontrol et:
```csharp
var user = await _context.Users
    .FirstOrDefaultAsync(u => u.Email == identifier || u.Sicil == identifier);
```

### 4. Validation
FluentValidation ile:
```csharp
public class LoginRequestValidator : AbstractValidator<LoginRequestDto>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Identifier)
            .NotEmpty().WithMessage("Email veya Sicil gereklidir")
            .MaximumLength(150).WithMessage("Identifier çok uzun");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Şifre gereklidir")
            .MinimumLength(8).WithMessage("Şifre en az 8 karakter olmalıdır");
    }
}
```

---

## 🎯 Sonuç ve Öneri

### Mevcut Durum:
- ✅ **PRD ve ERD şemasına göre EMAIL ile login doğru**
- ✅ **Kod PRD/ERD ile uyumlu** (email kullanılıyor)
- ⚠️ **IMPLEMENTATION_ROADMAP'te sicil var ama HR modülü için** (User tablosunda değil)

### Kullanıcı Beklentisi:
- ❓ Sicil ile login yapılabilmeli
- ❓ Email kullanımı isteğe bağlı olabilir

### Öneri:
**User tablosuna OPSIYONEL Sicil field'ı ekleyin:**
1. Geriye uyumlu (nullable)
2. Email login devam eder
3. Sicil login alternatif olarak sunulur
4. Frontend tek input ile hem email hem sicil kabul eder
5. 2-3 saatlik implementasyon süresi

### Sorular:
1. **Sicil login isteniyor mu?** (Evet/Hayır)
2. **Email zorunlu kalacak mı?** (Önerilen: Evet, sicil opsiyonel)
3. **Mevcut admin@intranet.local kullanıcısına sicil atansın mı?** (Örn: "00001")

---

## 🔄 Implement Etmek İçin:

Eğer Sicil login istiyorsanız:

```bash
# Migration oluştur
cd backend/IntranetPortal.Infrastructure
dotnet ef migrations add AddSicilToUser --startup-project ../IntranetPortal.API

# Database güncelle
dotnet ef database update --startup-project ../IntranetPortal.API
```

Ardından:
1. AuthenticationService güncelle (identifier = email VEYA sicil)
2. Frontend login form güncelle (placeholder: "E-posta veya Sicil")
3. Seed data güncelle (admin kullanıcıya sicil ata)
4. Test et

---

**Tahmin Edilen Süre**: 2-3 saat
**Risk Seviyesi**: Düşük (geriye uyumlu değişiklik)
**Test Gereksinimi**: Login endpoint testi (email + sicil ile)

---

**Karar Verilmesi Gereken**:
✅ Sicil login eklensin mi?
✅ Sadece sicil mi yoksa email ve sicil birlikte mi kullanılabilsin?
✅ Mevcut kullanıcılara sicil atama yapılacak mı?
