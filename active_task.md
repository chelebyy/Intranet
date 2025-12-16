# Aktif Görev: Faz 5 - Doküman Yönetimi Modülü

## Durum
**Faz 4 (Duyuru & Uyarı Sistemi) Tamamlandı.** 
Sistem artık yönetilebilir duyurular, anlık uyarılar ve okundu bilgisi takibi (Banner, Modal, Widget) yeteneklerine sahip.
**Faz 5 (Doküman Yönetimi) Başlıyor.**

## Tamamlananlar (Faz 4 - Duyuru Sistemi)
*   [x] Veritabanı tasamı (Announcements, Targets, Acknowledgments)
*   [x] Backend API (Controller, Service, Permissions)
*   [x] Frontend Yönetim Paneli (Liste, Ekle/Düzenle, Hedef Seçimi)
*   [x] Kullanıcı Arayüzü (Global Banner, Modal Popup, Dashboard Widget)
*   [x] Hedef Kitle Mantığı (Birim, Rol ve Kullanıcı bazlı yayınlama)
*   [x] Arama Özelliği (Searchable Select / Combobox)

## Sıradaki Adımlar (Faz 5)
1.  **Tasarım & Planlama:**
    *   [ ] Doküman varlıklarını (Entity) tasarlama (Dosya, Kategori, Versiyon).
    *   [ ] Yetkilendirme matrisini belirleme (Hangi klasörü kim görür?).
2.  **Backend:**
    *   [ ] `DocumentService` ve `DocumentController` implementasyonu.
    *   [ ] Dosya yükleme (Upload) ve güvenli indirme (Download) altyapısı.
3.  **Frontend:**
    *   [ ] Doküman Kütüphanesi UI (Klasör yapısı görünümü).
    *   [ ] Yükleme (Upload) arayüzü (Drag & drop).

## İlgili Dokümanlar
*   `docs/technical/FILE_MANAGEMENT.md`
*   `docs/technical/IMPLEMENTATION_ROADMAP.md` (Faz 5 Bölümü)