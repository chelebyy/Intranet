# Güvenlik ve TODO Raporu

Bu rapor, kod tabanında yapılan otomatik ve manuel taramalar sonucunda tespit edilen potansiyel güvenlik risklerini (unutulmuş şifreler) ve TODO yorumlarını içermektedir.

## 🛡️ Potansiyel Güvenlik Riskleri

Aşağıdaki dosyalarda hardcoded şifreler veya hassas bilgiler tespit edilmiştir. Bunların çoğu geliştirme ortamı için olsa da, prodüksiyon ortamına taşınmaması kritiktir.

### 1. Docker Compose Konfigürasyonu
*   **Dosya:** `intranet-portal/docker-compose.yml`
*   **Bulgu:** PostgreSQL veritabanı için şifre açık metin olarak tanımlanmış.
*   **Detay:**
    ```yaml
    POSTGRES_PASSWORD: "CHANGE_ME_IN_PROD_123"
    ConnectionStrings__DefaultConnection=...Password=CHANGE_ME_IN_PROD_123;
    ```
*   **Öneri:** Bu şifrenin prodüksiyon ortamında kesinlikle değiştirilmesi ve çevre değişkenleri (environment variables) veya secret management kullanılması gerekmektedir.

### 2. Dokümantasyon Örnekleri
Aşağıdaki dosyalarda örnek amaçlı şifreler bulunmaktadır. Bu bir güvenlik açığı olmasa da, kopyala-yapıştır hatalarını önlemek için farkında olunmalıdır.
*   **`intranet-portal/frontend/README.md`**: `password: 'xxx'`
*   **`intranet-portal/backend/README.md`**: `Password=SecurePassword123!` ve `Password=xxx`

## 📝 TODO ve Kod Notları

Kod içinde `TODO`, `FIXME` etiketleri taranmış, ayrıca "Note" içeren yorumlar incelenmiştir.

### 1. Backend Kod İçi Notlar
*   **Dosya:** `intranet-portal/backend/IntranetPortal.API/Controllers/UsersController.cs`
*   **Satır:** ~35
*   **Bulgu:** SuperAdmin ve birim kontrolü ile ilgili bir geliştirici notu/endişesi.
    ```csharp
    // Note: If !activeBirimId.HasValue and NOT SuperAdmin, they probably shouldn't see anything or
    // access this endpoint if HasPermission works correctly (it checks role permissions).
    ```
*   **Analiz:** `HasPermission` attribute'unun bu durumu doğru yönettiğinden emin olunmalı. Eğer yetkilendirme sadece role bakıyorsa ve birim kontrolü yapmıyorsa, birim seçmemiş bir kullanıcı tüm kullanıcıları listeleyebilir mi sorusu incelenmeli.

### 2. Dokümantasyondaki Yapılacaklar Listeleri
Kod içinde unutulmuş aktif `TODO` yorumu bulunmamıştır. Ancak proje dokümanlarında kapsamlı yapılacaklar listeleri mevcuttur:

*   **`intranet-portal/frontend/README.md`**: "Yapılacaklar (Sonraki Aşamalar)" başlığı altında frontend eksikleri (CRUD, Validasyon vb.) listelenmiştir.
*   **`intranet-portal/backend/README.md`**: "Yapılacaklar" başlığı altında fazlar (Phase 1-5) listelenmiştir. Bazı maddeler tamamlanmış görünse de listede işaretsiz durmaktadır.
*   **`TODO_BIRIM_REFACTOR.md`**: Tamamlanmış bir refaktör çalışmasının kontrol listesidir (Birim -> Modül dönüşümü).

## 🔍 Tarama Detayları
*   **Taranan Dizinler:** `intranet-portal/backend`, `intranet-portal/frontend`
*   **Aranan Anahtar Kelimeler:** `TODO`, `FIXME`, `HACK`, `password`, `secret`, `apikey`, `key`, `token`, `CHANGE_ME`.
*   **Tarih:** 2025-12-03
