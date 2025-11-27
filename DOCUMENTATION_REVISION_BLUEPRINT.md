# 📋 Documentation Revision Blueprint
**Email → Sicil Migration**
**Date**: 2025-11-27
**Status**: Master Change Document

---

## 🎯 Change Summary

### Critical Changes
1. ❌ **REMOVE**: Email field from entire system
2. ✅ **ADD**: Sicil (sicil_no) field as primary identifier
3. 🔐 **CHANGE**: Login mechanism from `email+password` to `sicil_no+password`
4. 👤 **UPDATE**: Default admin user to use sicil "00001"

---

## 📊 Impact Analysis

### Affected Components
| Component | Change Type | Priority |
|-----------|-------------|----------|
| **PRD.md** | Content Update | HIGH |
| **ERD.md** | Schema Change | CRITICAL |
| **API_SPECIFICATION.md** | Endpoint Update | HIGH |
| **User Entity** | Field Replacement | CRITICAL |
| **AuthenticationService** | Logic Change | CRITICAL |
| **Frontend Login** | UI/Logic Change | HIGH |
| **Database Migration** | Schema Migration | CRITICAL |
| **Seed Data** | Data Update | MEDIUM |

---

## 🔧 Technical Specifications

### 1. Sicil Field Definition

**Database Column**:
```sql
"Sicil" VARCHAR(20) UNIQUE NOT NULL
```

**Entity Property** (C#):
```csharp
[Required]
[MaxLength(20)]
[Column("Sicil")]
public string Sicil { get; set; } = string.Empty;
```

**TypeScript Interface**:
```typescript
sicil: string;  // Required, unique identifier
```

**Constraints**:
- Type: VARCHAR(20) / string
- Unique: YES (duplicate sicil numbers not allowed)
- Not Null: YES (required field)
- Format: Alphanumeric, typically "00001", "00002", etc.
- Index: UNIQUE INDEX on Sicil for fast lookup

---

### 2. Email Field Removal

**Remove From**:
- ❌ User table/entity (database schema)
- ❌ All API request/response DTOs
- ❌ Login forms (frontend)
- ❌ User creation/update forms
- ❌ PRD functional requirements mentioning email
- ❌ ERD diagrams and SQL scripts
- ❌ API specifications showing email fields
- ❌ Seed data scripts

**Keep In Mind**:
- No email-based password reset (out of scope anyway)
- No email notifications (already out of scope per PRD line 41)
- No email validation logic needed

---

### 3. Login Mechanism Update

**Before (Email-based)**:
```json
POST /api/auth/login
{
  "email": "admin@intranet.local",
  "password": "Admin123!",
  "rememberMe": false
}
```

**After (Sicil-based)**:
```json
POST /api/auth/login
{
  "sicil": "00001",
  "password": "Admin123!",
  "rememberMe": false
}
```

**Authentication Query**:
```csharp
// Before:
var user = await _context.Users
    .FirstOrDefaultAsync(u => u.Email == email);

// After:
var user = await _context.Users
    .FirstOrDefaultAsync(u => u.Sicil == sicil);
```

---

## 📄 PRD.md Revisions

### Section 4: Sistem Genel Akışı (Line 60-69)

**Before (Line 64)**:
```markdown
3. Kullanıcı adı/parola ile kimlik doğrulaması yapılır.
```

**After**:
```markdown
3. Sicil numarası ve parola ile kimlik doğrulaması yapılır.
```

### Section 6.1: Kullanıcı Yönetimi (Line 103-111)

**Update FR-5**:
```markdown
- FR-5: Kullanıcı sicil numarası ve şifre ile login olmalıdır.
```

### Section 8: ERD ve RBAC Modeli (Line 237)

**Before**:
```markdown
| User | UserID (PK), AdSoyad, Email, ŞifreHash, Ünvan, SonGiriş |
```

**After**:
```markdown
| User | UserID (PK), AdSoyad, Sicil (UNIQUE, NOT NULL), ŞifreHash, Ünvan, SonGiriş |
```

### Section 9.1: Örnek Senaryo (If exists)

**Update any references**:
- Change: "ahmet@intranet.local" → "12345" (sicil)
- Change: "Email: ..." → "Sicil: ..."

---

## 📄 ERD.md Revisions

### Section 2.1: Temel Tablolar - User Description

**Update**:
```markdown
| **User** | Sisteme giriş yapan kullanıcıların temel bilgilerini tutar. Sicil numarası ile kimlik doğrulaması yapılır. |
```

### Section 3: ER Diagram (Mermaid)

**Before**:
```mermaid
User {
    int UserID PK
    string AdSoyad
    string Email            -- ❌ REMOVE THIS
    string SifreHash
    string Unvan
    datetime SonGiris
    boolean IsActive
}
```

**After**:
```mermaid
User {
    int UserID PK
    string AdSoyad
    string Sicil "UNIQUE, NOT NULL"  -- ✅ ADD THIS
    string SifreHash
    string Unvan
    datetime SonGiris
    boolean IsActive
}
```

### Section 5.1: User Tablosu SQL

**Before**:
```sql
CREATE TABLE "User" (
    "UserID" SERIAL PRIMARY KEY,
    "AdSoyad" VARCHAR(100) NOT NULL,
    "Email" VARCHAR(150) UNIQUE NOT NULL,  -- ❌ REMOVE
    "SifreHash" VARCHAR(255) NOT NULL,
    ...
);

CREATE INDEX idx_user_email ON "User"("Email");  -- ❌ REMOVE
```

**After**:
```sql
CREATE TABLE "User" (
    "UserID" SERIAL PRIMARY KEY,
    "AdSoyad" VARCHAR(100) NOT NULL,
    "Sicil" VARCHAR(20) UNIQUE NOT NULL,  -- ✅ ADD
    "SifreHash" VARCHAR(255) NOT NULL,
    ...
);

-- Indexes
CREATE UNIQUE INDEX idx_user_sicil ON "User"("Sicil");  -- ✅ ADD
CREATE INDEX idx_user_active ON "User"("IsActive");
```

### Section 6: Example Queries

**Update all queries**:
```sql
-- Before:
SELECT * FROM "User" WHERE "Email" = 'admin@intranet.local';

-- After:
SELECT * FROM "User" WHERE "Sicil" = '00001';
```

### Section 7: Seed Data Example

**Before**:
```sql
INSERT INTO "User" ("AdSoyad", "Email", "SifreHash", ...)
VALUES ('Admin User', 'admin@intranet.local', '$2a$12...', ...);
```

**After**:
```sql
INSERT INTO "User" ("AdSoyad", "Sicil", "SifreHash", ...)
VALUES ('Admin User', '00001', '$2a$12...', ...);
```

---

## 📄 API_SPECIFICATION.md Revisions

### Section 2.1: POST /api/auth/login

**Before - Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)",
  "rememberMe": "boolean (optional, default: false)"
}
```

**After - Request Body**:
```json
{
  "sicil": "string (required, unique personnel number)",
  "password": "string (required, min 8 characters)",
  "rememberMe": "boolean (optional, default: false)"
}
```

**Before - Example Request**:
```json
{
  "email": "admin@intranet.local",
  "password": "Admin123!",
  "rememberMe": false
}
```

**After - Example Request**:
```json
{
  "sicil": "00001",
  "password": "Admin123!",
  "rememberMe": false
}
```

**Update Response - UserDto**:
```json
{
  "userId": 1,
  "adSoyad": "Admin User",
  "sicil": "00001",          // ✅ ADD (was email)
  "unvan": "Sistem Yöneticisi",
  "isActive": true
}
```

### Section 3.1: POST /api/users (Create User)

**Before - Request Body**:
```json
{
  "adSoyad": "string (required)",
  "email": "string (required, unique)",  // ❌ REMOVE
  "password": "string (required)",
  ...
}
```

**After - Request Body**:
```json
{
  "adSoyad": "string (required)",
  "sicil": "string (required, unique, max 20 chars)",  // ✅ ADD
  "password": "string (required, min 8 characters)",
  ...
}
```

### Section 3.2: GET /api/users (List Users)

**Update Response Array**:
```json
[
  {
    "userId": 1,
    "adSoyad": "Admin User",
    "sicil": "00001",        // ✅ CHANGED from email
    "unvan": "Sistem Yöneticisi",
    "isActive": true,
    "sonGiris": "2025-11-27T10:00:00Z"
  }
]
```

### Section 3.3: GET /api/users/{id}

**Update Response**:
```json
{
  "userId": 1,
  "adSoyad": "Admin User",
  "sicil": "00001",          // ✅ CHANGED from email
  "unvan": "Sistem Yöneticisi",
  "birimler": [...],
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00Z",
  "sonGiris": "2025-11-27T10:00:00Z"
}
```

### Section 3.4: PUT /api/users/{id} (Update User)

**Update Request Body**:
```json
{
  "adSoyad": "string (optional)",
  "sicil": "string (optional, unique)",  // ✅ CHANGED from email
  "unvan": "string (optional)",
  ...
}
```

**Validation Rules**:
```markdown
- sicil: 1-20 characters, alphanumeric, unique
- adSoyad: 1-100 characters
- password: min 8 characters (if provided)
```

### Section 4: Error Responses

**Update error messages**:

**Before**:
```json
{
  "code": "DUPLICATE_EMAIL",
  "message": "Email already exists"
}
```

**After**:
```json
{
  "code": "DUPLICATE_SICIL",
  "message": "Sicil numarası zaten kullanımda"
}
```

**Before**:
```json
{
  "code": "INVALID_EMAIL",
  "message": "Invalid email format"
}
```

**After**:
```json
{
  "code": "INVALID_SICIL",
  "message": "Geçersiz sicil formatı (maksimum 20 karakter)"
}
```

---

## 🗄️ Database Migration

### Migration Name
```
AddSicilRemoveEmailFromUser
```

### Up Migration (SQL)
```sql
-- Step 1: Add Sicil column (nullable first)
ALTER TABLE "User" ADD COLUMN "Sicil" VARCHAR(20);

-- Step 2: Populate sicil for existing users (if any)
-- Example: Generate sequential sicil numbers
UPDATE "User" SET "Sicil" = LPAD("UserID"::text, 5, '0');

-- Step 3: Make Sicil NOT NULL
ALTER TABLE "User" ALTER COLUMN "Sicil" SET NOT NULL;

-- Step 4: Add unique constraint
ALTER TABLE "User" ADD CONSTRAINT uq_user_sicil UNIQUE ("Sicil");

-- Step 5: Create index
CREATE UNIQUE INDEX idx_user_sicil ON "User"("Sicil");

-- Step 6: Drop Email column and its index
DROP INDEX IF EXISTS idx_user_email;
ALTER TABLE "User" DROP COLUMN "Email";
```

### Down Migration (SQL)
```sql
-- Step 1: Add Email column back
ALTER TABLE "User" ADD COLUMN "Email" VARCHAR(150);

-- Step 2: Restore email constraint
ALTER TABLE "User" ADD CONSTRAINT uq_user_email UNIQUE ("Email");
CREATE INDEX idx_user_email ON "User"("Email");

-- Step 3: Drop Sicil
DROP INDEX IF EXISTS idx_user_sicil;
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS uq_user_sicil;
ALTER TABLE "User" DROP COLUMN "Sicil";
```

---

## 🌱 Seed Data Update

### DatabaseSeeder.cs

**Before**:
```csharp
var adminUser = new User
{
    AdSoyad = "Super Admin",
    Email = "admin@intranet.local",  // ❌ REMOVE
    SifreHash = BCrypt.Net.BCrypt.HashPassword("Admin123!", 12),
    Unvan = "Sistem Yöneticisi",
    IsActive = true,
};
```

**After**:
```csharp
var adminUser = new User
{
    AdSoyad = "Super Admin",
    Sicil = "00001",  // ✅ ADD
    SifreHash = BCrypt.Net.BCrypt.HashPassword("Admin123!", 12),
    Unvan = "Sistem Yöneticisi",
    IsActive = true,
};
```

---

## 🎨 Frontend Changes

### LoginPage.tsx

**Before**:
```tsx
<input
  type="email"
  name="email"
  placeholder="E-posta Adresi"
  value={formData.email}
/>
```

**After**:
```tsx
<input
  type="text"
  name="sicil"
  placeholder="Sicil Numarası"
  value={formData.sicil}
  maxLength={20}
/>
```

### types/index.ts

**Before**:
```typescript
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}
```

**After**:
```typescript
export interface LoginCredentials {
  sicil: string;
  password: string;
  rememberMe?: boolean;
}
```

### authApi.ts

**Before**:
```typescript
interface LoginResponse {
  user: {
    userId: number;
    adSoyad: string;
    email: string;  // ❌ REMOVE
    // ...
  };
  // ...
}
```

**After**:
```typescript
interface LoginResponse {
  user: {
    userId: number;
    adSoyad: string;
    sicil: string;  // ✅ ADD
    // ...
  };
  // ...
}
```

---

## ✅ Validation Rules

### Sicil Validation

**Backend (FluentValidation)**:
```csharp
RuleFor(x => x.Sicil)
    .NotEmpty().WithMessage("Sicil numarası gereklidir")
    .MaximumLength(20).WithMessage("Sicil numarası maksimum 20 karakter olabilir")
    .Matches("^[a-zA-Z0-9]+$").WithMessage("Sicil numarası sadece harf ve rakam içerebilir");
```

**Frontend**:
```typescript
// Required field
if (!sicil || sicil.trim() === '') {
  return 'Sicil numarası gereklidir';
}

// Max length
if (sicil.length > 20) {
  return 'Sicil numarası maksimum 20 karakter olabilir';
}

// Alphanumeric
if (!/^[a-zA-Z0-9]+$/.test(sicil)) {
  return 'Sicil numarası sadece harf ve rakam içerebilir';
}
```

---

## 📝 Documentation String Updates

### Replace Everywhere

| Old Text | New Text |
|----------|----------|
| "Email address" | "Sicil numarası (personnel number)" |
| "email (unique)" | "sicil (unique, required)" |
| "Email: admin@intranet.local" | "Sicil: 00001" |
| "kullanıcı adı/parola" | "sicil numarası/parola" |
| "email ile giriş" | "sicil ile giriş" |
| "DUPLICATE_EMAIL" | "DUPLICATE_SICIL" |
| "INVALID_EMAIL" | "INVALID_SICIL" |

---

## 🧪 Test Cases Update

### Login Tests

**Before**:
```csharp
[Fact]
public async Task Login_WithValidEmail_ShouldSucceed()
{
    var request = new LoginRequestDto
    {
        Email = "admin@intranet.local",
        Password = "Admin123!"
    };
    // ...
}
```

**After**:
```csharp
[Fact]
public async Task Login_WithValidSicil_ShouldSucceed()
{
    var request = new LoginRequestDto
    {
        Sicil = "00001",
        Password = "Admin123!"
    };
    // ...
}
```

### User Creation Tests

**Update all test data**:
```csharp
// Before:
Email = "test@intranet.local"

// After:
Sicil = "99999"
```

---

## ⚠️ Breaking Changes

### API Contract Breaking Changes
1. ✅ `/api/auth/login` request body changed
2. ✅ `/api/users` request/response body changed
3. ✅ All UserDto responses changed

### Database Breaking Changes
1. ✅ User table schema changed (Email removed, Sicil added)
2. ✅ Unique constraints changed
3. ✅ Indexes changed

### Frontend Breaking Changes
1. ✅ Login form changed
2. ✅ User management forms changed
3. ✅ All API calls updated

---

## 🔄 Migration Checklist

- [ ] 1. Update PRD.md (all email references → sicil)
- [ ] 2. Update ERD.md (User table definition, SQL scripts)
- [ ] 3. Update API_SPECIFICATION.md (all endpoints with User data)
- [ ] 4. Create database migration (AddSicilRemoveEmail)
- [ ] 5. Update User.cs entity (remove Email, add Sicil)
- [ ] 6. Update UserConfiguration.cs (Fluent API)
- [ ] 7. Update AuthenticationService.cs (login logic)
- [ ] 8. Update all DTOs (LoginRequestDto, UserDto, CreateUserDto, UpdateUserDto)
- [ ] 9. Update DatabaseSeeder.cs (admin user sicil)
- [ ] 10. Update Frontend types (LoginCredentials, User interface)
- [ ] 11. Update LoginPage.tsx (form field)
- [ ] 12. Update all API calls in frontend
- [ ] 13. Run migration: `dotnet ef database update`
- [ ] 14. Test login with sicil "00001"
- [ ] 15. Update all unit/integration tests

---

## 📊 Estimated Effort

| Task | Time Estimate |
|------|---------------|
| Documentation Updates (PRD, ERD, API_SPEC) | 30 minutes |
| Backend Entity & Migration | 20 minutes |
| Backend Service Logic | 15 minutes |
| Frontend Updates | 20 minutes |
| Testing & Verification | 15 minutes |
| **Total** | **~2 hours** |

---

## 🎯 Success Criteria

1. ✅ All documentation (PRD, ERD, API_SPEC) updated with sicil references
2. ✅ Email field completely removed from all documentation
3. ✅ Database migration runs successfully
4. ✅ Admin user can login with sicil "00001"
5. ✅ User creation requires sicil (not email)
6. ✅ All API endpoints work with sicil-based payloads
7. ✅ Frontend login form accepts sicil
8. ✅ No email validation logic remains in codebase

---

**Status**: Blueprint Complete
**Next Step**: Apply changes to each document systematically
**Review Required**: Yes (before implementation)
