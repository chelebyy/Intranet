# Test Data Policy

**Document**: TEST_DATA_POLICY.md  
**Date**: 2026-04-03  
**Version**: 1.0  

---

## Test Veri Yönetimi

### Seeded Test Users

Test ortamında kullanılacak sabit kullanıcılar:

```json
{
  "users": [
    {
      "sicil": "TEST001",
      "password": "Test@123!",
      "ad": "Test",
      "soyad": "Admin",
      "role": "SuperAdmin",
      "birimler": [1, 2]
    },
    {
      "sicil": "TEST002", 
      "password": "Test@123!",
      "ad": "Test",
      "soyad": "Editor",
      "role": "BirimEditor",
      "birimler": [1]
    }
  ]
}
```

### Environment-Safe Credentials

- Test şifreleri sadece test ortamında geçerli
- Production veritabanında TEST* sicilleri yok
- Şifreler: `Test@123!` pattern'ı kullan

### Test Fixtures Konumları

```
backend/
└── tests/
    └── IntranetPortal.IntegrationTests/
        └── Fixtures/
            └── TestData.cs

frontend/
└── tests/
    ├── mocks/
    │   └── fixtures/
    │       └── auth.ts
    └── e2e/
        └── cypress/
            └── fixtures/
                └── users.json
```

---

## Test Data Lifecycle

1. **Setup**: Her test öncesi veri temizle
2. **Seed**: Gerekli test verilerini yükle
3. **Execute**: Testi çalıştır
4. **Teardown**: Test verilerini temizle

---

*Document version 1.0 - Test Data Policy*
