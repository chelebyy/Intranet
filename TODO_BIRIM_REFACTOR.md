# TODO: Birim/Modül Refaktör Çalışması (Revize Edilmiş Plan)

## Özet
Birimler = Modüller. Hedef: Manuel birim yönetimini kaldırıp, statik "Sistem Modülleri" yapısına geçmek.
**Kritik Karar:** Birim isimleri Türkçe ve sabit olacak: **"Bilgi İşlem"** ve **"Test Birimi"**.

---

## 1. Backend: İsimlendirme ve Veri Yapısı (ÖNCELİKLİ)

### A. Sabitleri Düzelt (`SystemModules.cs`)
Mevcut kodda "IT" ve "Test-Unit" kullanıldı. Bunlar arayüzle uyuşması için Türkçe olmalı.

- [x] **Domain/Constants/SystemModules.cs** dosyasını güncelle:
  ```csharp
  public const string IT = "Bilgi İşlem"; // "IT" yerine
  public const string TestUnit = "Test Birimi"; // "Test-Unit" yerine
  ```

### B. Seeder Güncellemesi (`DatabaseSeeder.cs`)
- [x] **SeedSystemModulesAsync** metodunu güncelle:
  - Eski isimli birimler (`IT`, `Test-Unit`) varsa veritabanından sil veya ismini güncelle.
  - Yeni isimlerin (`Bilgi İşlem`, `Test Birimi`) eklendiğinden emin ol.

### C. Controller Kısıtlaması (Tamamlandı)
- [x] `BirimlerController.Create` metodu devre dışı bırakıldı.

---

## 2. Frontend: Birim Yönetimi (`DepartmentList.tsx`) temizliği

Manuel yönetim tamamen kaldırılıyor. Sadece listeleme ve açıklama düzenleme kalacak.

- [x] **"Yeni Birim" butonu kaldırıldı.**
- [x] **"Pasife Al" butonu kaldırıldı.** (Sistem modülleri pasife alınamaz)
- [x] **Kod Temizliği:**
  - `handleDeactivate` fonksiyonu silindi.
  - `openCreateModal` fonksiyonu silindi.
  - `handleSubmit` içindeki *create* mantığı silindi (sadece *update* kaldı).
  - Modal başlığı "Birim Düzenle" olarak sabitlendi.
  - Kullanılmayan importlar (`Plus`, `Ban`, `Checkbox` vb.) temizlendi.

---

## 3. Frontend: Sandbox Temizliği (`/test`)

Geliştirme aşamasında kullanılan test sayfası kaldırılacak.

- [x] **App.tsx**
  - `/test` route tanımı kaldırıldı.
  - `TestPage` lazy import'u kaldırıldı.

- [x] **AppSidebar.tsx** & **Sidebar.tsx**
  - "Test Sayfası" menü linkleri kaldırıldı.

- [x] **Dosya Temizliği**
  - `src/features/test/` klasörü silindi.

---

## 4. Entegrasyon Kontrolü (`AppSidebar.tsx`)

Frontend'in modülleri tanıması için isim eşleşmesi şart.

- [x] **Sidebar Mantığı Doğrulandı:**
  ```typescript
  // Backend'den gelen 'birimAdi' ile tam eşleşmeli
  const isITUnit = selectedBirim?.birimAdi === 'Bilgi İşlem';
  const isTestUnit = selectedBirim?.birimAdi === 'Test Birimi';
  ```

---

## Veritabanı Manuel Müdahale (Gerekirse)
Eğer Seeder eski kayıtları düzeltemezse SQL ile düzeltme:

```sql
UPDATE "Birimler" SET "BirimAdi" = 'Bilgi İşlem' WHERE "BirimAdi" = 'IT';
UPDATE "Birimler" SET "BirimAdi" = 'Test Birimi' WHERE "BirimAdi" = 'Test-Unit';
-- Veya temiz kurulum:
-- DELETE FROM "Birimler" WHERE "BirimAdi" NOT IN ('Sistem Yönetimi', 'Bilgi İşlem', 'Test Birimi');
```

---

## ✅ TAMAMLANDI (4 Aralık 2024)
Tüm ana maddeler implementasyonu tamamlandı. Sadece `src/features/test/` klasörü opsiyonel olarak silinebilir.