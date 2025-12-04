# 🛡️ Yedekleme Sistemi ve Admin Paneli Entegrasyonu - Yapılacaklar Listesi

Bu doküman, `BACKUP_SYSTEM_REPORT.md` raporuna istinaden, sistemde eksik olan yedekleme altyapısının kurulması ve Admin Paneli üzerinden yönetilebilir hale getirilmesi için gerekli adımları içerir.

## 1. Sistem Altyapısı (Backend & OS)

### 1.1. PowerShell Yedekleme Scripti
- [ ] **Script Oluşturma:** `C:\Scripts\PostgreSQLBackup.ps1` dosyasını oluştur.
    - [ ] PostgreSQL `pg_dump` komutunu yapılandır.
    - [ ] Dosya isimlendirmesi: `IntranetDB_YYYY-MM-DD_HHmm.backup`.
    - [ ] Loglama: İşlem sonuçlarını `backup.log` dosyasına yaz.
    - [ ] Temizlik: 30 günden eski yedekleri otomatik sil.
    - [ ] **Güvenlik:** Yedek dosyasını şifrele (Opsiyonel ama önerilen: 7-Zip AES-256).

### 1.2. Windows Görev Zamanlayıcı (Task Scheduler)
- [ ] **Görev Tanımlama:** Windows Task Scheduler'da yeni görev oluştur.
    - [ ] Tetikleyici: Her gece 02:00.
    - [ ] Aksiyon: PowerShell scriptini çalıştır.
    - [ ] Yetki: `SYSTEM` veya yetkili servis hesabı ile çalıştır.

### 1.3. Backend API Geliştirmesi (.NET)
Admin panelinin yedekleri görebilmesi ve yönetebilmesi için yeni endpoint'ler gereklidir.

- [ ] **Controller:** `BackupController` oluştur.
- [ ] **Endpoint: Listeleme (`GET /api/admin/backups`)**
    - [ ] `C:\Backups` klasöründeki dosyaları listele.
    - [ ] Dosya adı, boyutu, oluşturulma tarihi bilgilerini dön.
- [ ] **Endpoint: Manuel Tetikleme (`POST /api/admin/backups/trigger`)**
    - [ ] PowerShell scriptini asenkron olarak çalıştır.
    - [ ] İşlem sonucunu dön.
- [ ] **Endpoint: İndirme (`GET /api/admin/backups/{filename}`)**
    - [ ] Seçilen yedek dosyasını indir (Admin yetkisi zorunlu).
- [ ] **Endpoint: Log Görüntüleme (`GET /api/admin/backups/logs`)**
    - [ ] `backup.log` içeriğini son satırlardan başlayarak oku.

---

## 2. Frontend Geliştirmesi (React Admin Panel)

### 2.1. Yeni Sayfa: Yedekleme Merkezi
- [ ] **Sayfa Oluşturma:** `src/features/admin/pages/BackupManagement.tsx`.
- [ ] **Route Ekleme:** Admin layout içine `/admin/backups` rotasını ekle.
- [ ] **Menü:** Sidebar'a "Yedekleme & Güvenlik" başlığı altına link ekle.

### 2.2. UI Bileşenleri
- [ ] **İstatistik Kartları:**
    - [ ] Son Yedekleme Zamanı.
    - [ ] Toplam Yedek Boyutu.
    - [ ] Disk Doluluk Durumu (Opsiyonel).
- [ ] **Yedek Listesi Tablosu:**
    - [ ] Kolonlar: Dosya Adı, Tarih, Boyut, İşlemler.
    - [ ] İşlemler: İndir, Sil (Opsiyonel).
- [ ] **Manuel Yedekleme Butonu:**
    - [ ] "Şimdi Yedekle" butonu.
    - [ ] Loading durumu (Yedekleme sürerken buton pasif olsun).
    - [ ] Başarılı/Hata bildirimleri (Toast notification).
- [ ] **Log Görüntüleyici:**
    - [ ] Basit bir terminal benzeri görünümde son logları göster.

---

## 3. Güvenlik ve Yetkilendirme

- [ ] **RBAC Kontrolü:** Bu sayfaya ve API'lere sadece `SuperAdmin` rolünün erişebildiğinden emin ol.
- [ ] **Dosya Erişim Güvenliği:** API'nin sadece `C:\Backups` klasörüne erişebildiğini doğrula (Path Traversal koruması).

## 4. Test Planı

- [ ] Scripti manuel çalıştırıp yedeğin oluştuğunu doğrula.
- [ ] Task Scheduler'ın zamanında çalıştığını gözlemle.
- [ ] Admin panelinden "Şimdi Yedekle" butonunun çalıştığını test et.
- [ ] Oluşturulan yedeğin `pg_restore` ile geri dönülebildiğini test et (Restore testi).
