# Teknoloji Geçiş ve Test Altyapı Planı

**Proje**: Kurumsal İntranet Portalı  
**Tarih**: 2026-04-03  
**Versiyon**: 1.0  
**Durum**: 🟡 Planlama

---

## 📋 Özet

Bu plan, kurumsal intranet portalı için:
1. **.NET 9 → .NET 10 LTS** geçişi
2. **Tam test altyapısı** kurulumu (xUnit + Vitest + Cypress + Playwright)
3. **Tailwind 4 component disiplini** (renkler korunarak)

işlemlerini içerir.

---

## 🎯 Kapsam

| # | Bileşen | Başlangıç | Hedef |
|---|---------|-----------|-------|
| 1 | Backend Framework | .NET 9.0 | .NET 10.0 LTS |
| 2 | Backend Tests | Yok | xUnit (Unit + Integration) |
| 3 | Frontend Unit Tests | Yok | Vitest + React Testing Library |
| 4 | Frontend E2E Tests | Yok | Cypress + Playwright |
| 5 | UI Disiplini | Dağınık | CVA + Token Standardı |

---

## 📂 Hedef Folder Yapısı

```
intranet-portal/
├── backend/
│   ├── tests/
│   │   ├── IntranetPortal.UnitTests/
│   │   └── IntranetPortal.IntegrationTests/
│   └── IntranetPortal.sln
│
└── frontend/
    ├── tests/
    │   ├── setup.ts
    │   ├── component/
    │   └── e2e/
    │       ├── cypress/
    │       └── playwright/
    ├── cypress.config.ts
    ├── playwright.config.ts
    └── vitest.config.ts
```

---

## 📅 Fazlar ve Task'lar

### 🔵 FAZ 1: Test Altyapısı Kurulumu (xUnit + Vitest)
**Hedef**: Backend ve frontend için temel test altyapısını kur  
**Süre**: 1-2 gün

- [ ] **Task 1.1**: Auth flow'ları audit et  
  → Login, cookie, X-Birim-Id, protected-route davranışlarını belgele  
  → Verify: `docs/auth-test-contracts.md` oluşturuldu

- [ ] **Task 1.2**: Backend Unit Test projesi oluştur  
  → `dotnet new xunit -o tests/IntranetPortal.UnitTests`  
  → xUnit, FluentAssertions, Moq, coverlet.collector ekle  
  → Verify: `dotnet test` çalışır (0 test pass)

- [ ] **Task 1.3**: Backend Integration Test projesi oluştur  
  → `dotnet new xunit -o tests/IntranetPortal.IntegrationTests`  
  → Microsoft.AspNetCore.Mvc.Testing, Testcontainers.PostgreSql ekle  
  → Verify: Testcontainers PostgreSQL container başlatılır

- [ ] **Task 1.4**: Frontend Vitest kurulumu  
  → `npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event msw`  
  → `vitest.config.ts` oluştur (jsdom, alias, coverage)  
  → Verify: `npm run test:unit` çalışır

- [ ] **Task 1.5**: Test utilities ve setup oluştur  
  → `tests/setup.ts`, `tests/render.tsx`, `tests/mocks/handlers.ts`  
  → Auth store reset ve mock server utilities  
  → Verify: Tüm util'ler import edilebilir

- [ ] **Task 1.6**: İlk smoke test'leri yaz  
  → Backend: Health endpoint testi  
  → Frontend: LoginPage render testi  
  → Verify: En az 1 test her katmanda pass

---

### 🟢 FAZ 2: .NET 10 LTS Geçişi
**Hedef**: Backend'i .NET 10'a yükselt  
**Süre**: 1-2 gün

- [ ] **Task 2.1**: Mevcut durumu freeze et  
  → `dotnet list package` output'ını kaydet  
  → Git tag oluştur: `git tag pre-net10-migration`  
  → Verify: Tüm package versiyonları belgelendi

- [ ] **Task 2.2**: TargetFramework'ü güncelle  
  → Tüm .csproj dosyalarında `net9.0` → `net10.0`  
  → Test projeleri de dahil  
  → Verify: `dotnet --version` 10.x gösterir

- [ ] **Task 2.3**: NuGet paketlerini güncelle  
  → EF Core 10.x, Npgsql 10.x, JWT Bearer 10.x  
  → `dotnet restore` ve `dotnet build`  
  → Verify: Build başarılı, 0 warning

- [ ] **Task 2.4**: Npgsql timestamp behavior'ı düzelt  
  → `Program.cs`'te `EnableLegacyTimestampBehavior` kontrolü  
  → UTC normalizasyonu implemente et  
  → Verify: Timestamp test'leri pass

- [ ] **Task 2.5**: EF Core migration doğrulama  
  → `dotnet ef migrations add Net10Verification`  
  → Schema diff'i kontrol et (no-op olmalı)  
  → Verify: Migration boş veya beklenen değişiklikler

- [ ] **Task 2.6**: Regression test'leri çalıştır  
  → `dotnet test` (tüm backend test'leri)  
  → Auth, user, role, permission flow'ları  
  → Verify: Tüm test'ler pass

- [ ] **Task 2.7**: Rollback planını belgele  
  → `docs/NET10_ROLLBACK.md` oluştur  
  → Eski versiyonlara dönüş adımları  
  → Verify: Belge tam ve anlaşılır

---

### 🟣 FAZ 3: Tailwind 4 Component Disiplini
**Hedef**: UI standartlarını iyileştir (renkler korunarak)  
**Süre**: 1-2 gün

- [ ] **Task 3.1**: Mevcut durum audit'i  
  → Hardcoded renkleri bul: `grep -r "purple-500\|cyan-500\|gray-100" src`  
  → Token duplication'ları belirle  
  → Verify: Audit raporu oluşturuldu

- [ ] **Task 3.2**: Design token'ları birleştir  
  → `index.css`'te @theme inline kullan  
  → `tailwind.config.js`'i sadeleştir veya kaldır  
  → Purple/cyan renklerini token olarak tanımla (değiştirme!)  
  → Verify: Build başarılı, renkler aynı

- [ ] **Task 3.3**: Spacing scale tanımla  
  → Controls: `h-9`, Card: `p-6`, Stacks: `gap-4`  
  → Dokümantasyon: `docs/TAILWIND_STANDARDS.md`  
  → Verify: Tutarlı spacing kullanımı

- [ ] **Task 3.4**: CVA pattern'ini standartlaştır  
  → `button.tsx`'i referans al  
  → `card.tsx`, `input.tsx`, `checkbox.tsx` CVA'ya geçir  
  → Verify: Tüm primitives variant sistemi kullanıyor

- [ ] **Task 3.5**: Test selector'ları ekle  
  → `data-testid` veya `data-cy` attribute'ları  
  → Login form ve kritik component'lerde  
  → Verify: Selector'ler stabil ve unique

- [ ] **Task 3.6**: UI regression test'leri ekle  
  → Login UI state'leri test et  
  → Dark/light mode toggle testi  
  → Verify: Tailwind değişiklikleri test'leri kırmıyor

---

### 🟠 FAZ 4: E2E Test Altyapısı (Cypress + Playwright)
**Hedef**: Cross-browser E2E test coverage'ı kur  
**Süre**: 2-3 gün

#### Cypress Kurulumu (Local Dev + Component)

- [ ] **Task 4.1**: Cypress kurulumu  
  → `npm install -D cypress`  
  → `cypress.config.ts` oluştur (Vite integration)  
  → Folder: `tests/e2e/cypress/`  
  → Verify: `npx cypress open` çalışır

- [ ] **Task 4.2**: Cypress component testing  
  → `tests/component/` folder'ı  
  → İlk component test: Button veya Card  
  → Verify: Component test runner çalışır

- [ ] **Task 4.3**: Cypress E2E login test'i  
  → `tests/e2e/cypress/e2e/login.cy.ts`  
  → Valid login, invalid login, session check  
  → Verify: Test pass, video kaydı oluşur

#### Playwright Kurulumu (CI/CD + Cross-Browser)

- [ ] **Task 4.4**: Playwright kurulumu  
  → `npm init playwright@latest`  
  → `playwright.config.ts` (Chromium, Firefox, WebKit)  
  → Folder: `tests/e2e/playwright/`  
  → Verify: `npx playwright install` tamamlandı

- [ ] **Task 4.5**: Playwright auth setup'ı  
  → Global setup: Login ve state storage  
  → `auth.json` veya benzeri  
  → Verify: Authenticated state reusable

- [ ] **Task 4.6**: Playwright login test'i  
  → `tests/e2e/playwright/login.spec.ts`  
  → Aynı senaryo: valid/invalid login  
  → Verify: Tüm 3 browser'da (Chromium, Firefox, WebKit) pass

- [ ] **Task 4.7**: Playwright critical flows  
  → Protected navigation test'i  
  → Dashboard load test'i  
  → Unauthorized redirect test'i  
  → Role/birim-sensitive path test'i  
  → Verify: 4 critical flow test'i pass

- [ ] **Task 4.8**: Package scripts ekle  
  → `test:unit`, `test:integration`, `test:cypress`, `test:cypress:component`, `test:playwright`  
  → Combined: `test:all`  
  → Verify: Tüm script'ler çalışır

---

### 🔴 FAZ 5: Test Coverage ve Validasyon
**Hedef**: Test stack'i kalite kapısına dönüştür  
**Süre**: 1 gün

- [ ] **Task 5.1**: Coverage hedefleri tanımla  
  → Backend: %70 business logic  
  → Frontend: %60 auth/shared flows  
  → E2E: Tüm critical flows  
  → Verify: Hedefler belgelendi

- [ ] **Task 5.2**: Coverage reporting kurulumu  
  → Backend: coverlet + report generator  
  → Frontend: Vitest coverage + Istanbul  
  → Verify: Coverage raporları oluşturuluyor

- [ ] **Task 5.3**: Test data policy'si  
  → Seeded users, roles, birimler  
  → Environment-safe credentials  
  → `tests/fixtures/` veya `tests/data/`  
  → Verify: Test data dokümante edildi

- [ ] **Task 5.4**: PR validation workflow'u  
  → Sıra: Unit → Integration → Cypress Component → Playwright E2E  
  → `docs/CI_WORKFLOW.md`  
  → Verify: Workflow belgelendi

- [ ] **Task 5.5**: Flaky test triage kuralları  
  → Timeout politikası  
  → Retry mekanizması  
  → Debug prosedürü  
  → Verify: Triage dokümantasyonu tamam

---

## 📊 İlerleme Takibi

| Faz | Task | Açıklama | Durum | Başlangıç | Bitiş | Notlar |
|-----|------|----------|-------|-----------|-------|--------|
| 1 | 1.1 | Auth flow audit | ⬜ | - | - | |
| 1 | 1.2 | Backend Unit Test projesi | ⬜ | - | - | |
| 1 | 1.3 | Backend Integration Test projesi | ⬜ | - | - | |
| 1 | 1.4 | Frontend Vitest kurulumu | ⬜ | - | - | |
| 1 | 1.5 | Test utilities oluştur | ⬜ | - | - | |
| 1 | 1.6 | Smoke test'leri | ⬜ | - | - | |
| 2 | 2.1 | Durum freeze | ⬜ | - | - | |
| 2 | 2.2 | TargetFramework güncelle | ⬜ | - | - | |
| 2 | 2.3 | NuGet paketleri | ⬜ | - | - | |
| 2 | 2.4 | Npgsql timestamp | ⬜ | - | - | |
| 2 | 2.5 | EF migration doğrulama | ⬜ | - | - | |
| 2 | 2.6 | Regression test'leri | ⬜ | - | - | |
| 2 | 2.7 | Rollback planı | ⬜ | - | - | |
| 3 | 3.1 | Tailwind audit | ⬜ | - | - | |
| 3 | 3.2 | Token birleştirme | ⬜ | - | - | |
| 3 | 3.3 | Spacing scale | ⬜ | - | - | |
| 3 | 3.4 | CVA standart | ⬜ | - | - | |
| 3 | 3.5 | Test selector'leri | ⬜ | - | - | |
| 3 | 3.6 | UI regression test'leri | ⬜ | - | - | |
| 4 | 4.1 | Cypress kurulumu | ⬜ | - | - | |
| 4 | 4.2 | Cypress component | ⬜ | - | - | |
| 4 | 4.3 | Cypress E2E login | ⬜ | - | - | |
| 4 | 4.4 | Playwright kurulumu | ⬜ | - | - | |
| 4 | 4.5 | Playwright auth setup | ⬜ | - | - | |
| 4 | 4.6 | Playwright login | ⬜ | - | - | |
| 4 | 4.7 | Playwright critical flows | ⬜ | - | - | |
| 4 | 4.8 | Package scripts | ⬜ | - | - | |
| 5 | 5.1 | Coverage hedefleri | ⬜ | - | - | |
| 5 | 5.2 | Coverage reporting | ⬜ | - | - | |
| 5 | 5.3 | Test data policy | ⬜ | - | - | |
| 5 | 5.4 | PR validation workflow | ⬜ | - | - | |
| 5 | 5.5 | Flaky test triage | ⬜ | - | - | |

**Durum Açıklamaları:**
- ⬜ Henüz başlanmadı
- 🟡 Devam ediyor
- 🟢 Tamamlandı
- 🔴 Blokeli

---

## ⚠️ Riskler ve Önlemler

| Risk | Olasılık | Etki | Önlem |
|------|----------|------|-------|
| **Npgsql timestamp davranış değişimi** | Orta | Yüksek | Task 2.4'te explicit UTC normalizasyonu |
| **.NET 10 package uyumsuzluğu** | Düşük | Yüksek | Task 2.3'te restore/build validation |
| **Cypress/Playwright config çatışması** | Düşük | Orta | Farklı folder'lar ve port'lar |
| **Test data senkronizasyonu** | Orta | Orta | Task 5.3'te fixtures standardizasyonu |
| **Flaky E2E test'leri** | Yüksek | Orta | Task 5.5'te triage kuralları |

---

## 🔧 Test Araçları Görev Dağılımı

| Araç | Görev | Ne Zaman Çalışır |
|------|-------|------------------|
| **xUnit** | Backend unit + integration | Her build, CI |
| **Vitest** | Frontend unit + integration | Her build, CI |
| **Cypress** | Component testing + Local E2E | Local dev, PR |
| **Playwright** | Cross-browser E2E | CI/CD, Pre-merge |

**Neden İkisi de?**
- **Cypress**: Developer-friendly, time-travel debugging, hızlı local iterasyon
- **Playwright**: CI/CD-friendly, parallel execution, cross-browser (Chromium, Firefox, WebKit)

---

## 📝 Commit Stratejisi

Her task tamamlandığında atomic commit:

```bash
# Örnek commit mesajları
test(backend): add xunit unit and integration test projects
test(frontend): add vitest and react testing library setup
build(dotnet): migrate backend to net10
fix(dotnet): resolve npgsql timestamp behavior for net10
style(frontend): enforce tailwind discipline with cva
test(cypress): add cypress config and login e2e
test(playwright): scaffold playwright with cross-browser config
test(playwright): add critical flows e2e coverage
ci(test): wire package scripts and validation workflow
```

---

## 📚 Dokümantasyon Kontrol Listesi

- [ ] `docs/auth-test-contracts.md` - Auth flow test senaryoları
- [ ] `docs/NET10_ROLLBACK.md` - .NET 10 rollback planı
- [ ] `docs/TAILWIND_STANDARDS.md` - Tailwind kullanım standartları
- [ ] `docs/CI_WORKFLOW.md` - CI/CD test workflow'u
- [ ] `docs/TEST_DATA_POLICY.md` - Test data yönetimi

---

## 🚀 Başlangıç Adımları

1. **Bu planı kaydet** → `TEKNOLOJI_GECIS_PLANI.md`
2. **Git branch oluştur** → `git checkout -b feature/test-infrastructure`
3. **Faz 1'e başla** → Task 1.1 (Auth flow audit)
4. **Her task sonrası** → Checkbox'ı işaretle ve commit yap

---

## 📞 Notlar

- **.NET 10 Release Date**: Kasım 2025 (LTS)
- **PostgreSQL**: 16.x kalıyor (değişmiyor)
- **Tailwind Renkler**: Purple/Cyan branding korunuyor (sadece token'lanıyor)
- **Testcontainers**: Integration test'lerde PostgreSQL container kullanılacak

---

*Son Güncelleme: 2026-04-03*  
*Plan Versiyon: 1.0*
