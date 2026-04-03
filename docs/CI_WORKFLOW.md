# CI/CD Test Workflow

**Document**: CI_WORKFLOW.md  
**Date**: 2026-04-03  
**Version**: 1.0  

---

## Test Execution Pipeline

Test'lerin çalışma sırası ve koşulları:

```
┌─────────────────────────────────────────────────────────────┐
│  Phase 1: Unit Tests (Hızlı)                               │
│  ├── Backend: dotnet test (xUnit)                          │
│  └── Frontend: npm run test:unit (Vitest)                  │
├─────────────────────────────────────────────────────────────┤
│  Phase 2: Integration Tests                                │
│  └── Backend: dotnet test (Testcontainers)                 │
├─────────────────────────────────────────────────────────────┤
│  Phase 3: Component Tests                                  │
│  └── Frontend: npm run test:cypress:component              │
├─────────────────────────────────────────────────────────────┤
│  Phase 4: E2E Tests (Yavaş)                                │
│  ├── Cypress: npm run test:cypress                       │
│  └── Playwright: npm run test:playwright                   │
└─────────────────────────────────────────────────────────────┘
```

---

## PR Validation Workflow

```yaml
# .github/workflows/pr-validation.yml (Example)
name: PR Validation

on:
  pull_request:
    branches: [ main, develop ]

jobs:
  backend-unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup .NET 10
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '10.0.x'
      - run: dotnet test tests/IntranetPortal.UnitTests

  backend-integration:
    runs-on: ubuntu-latest
    needs: backend-unit
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
    steps:
      - uses: actions/checkout@v4
      - name: Setup .NET 10
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '10.0.x'
      - run: dotnet test tests/IntranetPortal.IntegrationTests

  frontend-unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run test:unit

  frontend-e2e:
    runs-on: ubuntu-latest
    needs: [frontend-unit, backend-integration]
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:playwright
```

---

## Coverage Hedefleri

| Katman | Hedef | Minimum |
|--------|-------|---------|
| Backend Business Logic | %70 | %60 |
| Frontend Auth/Shared | %60 | %50 |
| E2E Critical Flows | %100 | %100 |

---

## Test Data Policy

Test verileri için fixtures kullanımı:

```typescript
// tests/fixtures/auth.ts
export const testUsers = {
  admin: {
    sicil: '00001',
    password: 'TestPassword123!',
    role: 'SuperAdmin'
  },
  standard: {
    sicil: '00002', 
    password: 'TestPassword123!',
    role: 'BirimEditor'
  }
};
```

---

## Flaky Test Yönetimi

### Timeout Politikası

| Test Tipi | Timeout | Retry |
|-----------|---------|-------|
| Unit | 5s | 0 |
| Integration | 30s | 1 |
| E2E | 60s | 2 |

### Debug Prosedürü

1. Test fail olduğunda trace kaydet
2. Screenshot/video ekle
3. Logları kontrol et
4. Tekrar çalıştır (retry)

---

*Document version 1.0 - CI/CD Test Workflow*
