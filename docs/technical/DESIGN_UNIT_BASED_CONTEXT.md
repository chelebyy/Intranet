# 🏗️ Teknik Dizayn: Birim Bazlı Dinamik Bağlam (Unit-Based Dynamic Context)

**Tarih:** 2 Aralık 2025  
**Durum:** Taslak (Draft)  
**İlgili Faz:** Faz 3 (Çoklu Birim & Rol Yönetimi)

## 1. Yönetici Özeti
Bu doküman, Kurumsal İntranet Portalı'nın "Birim Bazlı Yönetim" mimarisine geçişi için teknik tasarımı içerir. Amaç, bir kullanıcının farklı birimlerde farklı rollere (Örn: Bilgi İşlem -> Yönetici, Personel -> İzleyici) sahip olabilmesini ve sistemin bu "bağlam" (context) değişikliğini güvenli ve akıcı bir şekilde yönetmesini sağlamaktır.

## 2. Mimari Prensip: "Token as Context"
Sistemin karmaşıklığını yönetmek için **"Token as Context" (Bağlam Olarak Jeton)** prensibini benimsiyoruz.

*   **Eski Yaklaşım (Statik):** Kullanıcı giriş yapar, tek bir rolü vardır, her yere o rolle girer.
*   **Yeni Yaklaşım (Dinamik):** Kullanıcı giriş yapar, *hangi birimde işlem yapacağını seçer*. Sistem o birime özel bir kimlik (Token) verir.

### 2.1. Çalışma Mantığı
1.  **Login:** Kullanıcı `Sicil` + `Şifre` ile giriş yapar.
2.  **Seçim:** Eğer kullanıcının birden fazla birim yetkisi varsa, API "Lütfen Birim Seç" (200 OK, `RequiresBirimSelection: true`) döner.
3.  **Context Switch:** Kullanıcı birimi seçer (`/api/auth/select-birim`).
4.  **Token Generation:** API, seçilen birim ve o birimdeki role özel yeni bir **JWT Token** üretir. Bu token içinde `BirimID` ve `RoleID` gömülüdür.
5.  **İşlem:** Kullanıcı bu token ile işlem yaparken, Backend *ekstra bir kontrole ihtiyaç duymaz*. Çünkü token zaten "Ben Bilgi İşlem Yöneticisiyim" demektedir.

---

## 3. Backend Tasarımı

### 3.1. Veri Modeli (Mevcut & Yeterli)
`UserBirimRole` tablosu bu yapıyı %100 desteklemektedir. Herhangi bir şema değişikliğine gerek yoktur.

```csharp
// IntranetPortal.Domain.Entities.UserBirimRole
public class UserBirimRole {
    public int UserID { get; set; }
    public int BirimID { get; set; } // Hangi Birim?
    public int RoleID { get; set; }  // Hangi Rol?
}
```

### 3.2. API Katmanı
Mevcut `AuthController` ve `JwtTokenService` bu yapıyı destekleyecek şekilde kodlanmıştır. Ancak Controller'larda veri güvenliğini sağlamak için şu kural uygulanmalıdır:

**Kural:** Tüm "Listeleme/Ekleme/Silme" işlemleri, Token'daki `BirimID`'ye göre filtrelenmelidir.

```csharp
// ÖRNEK: Personel Listeleme (UsersController)
[HttpGet]
[HasPermission("view.users")]
public async Task<IActionResult> GetUsers()
{
    // 1. Aktif Birim ID'sini Token'dan al
    var activeBirimId = User.Claims.FirstOrDefault(c => c.Type == "birimId")?.Value;
    
    // 2. Sadece O BİRİMDEKİ personelleri getir (Global Admin değilse)
    var users = _userService.GetUsersByBirim(int.Parse(activeBirimId));
    
    return Ok(users);
}
```

### 3.3. Extension Method
Kod tekrarını önlemek için `ClaimsPrincipalExtensions.cs` güncellenecektir:

```csharp
public static class ClaimsPrincipalExtensions
{
    public static int? GetBirimId(this ClaimsPrincipal user) 
    {
        // ... implementation
    }
}
```

---

## 4. Frontend Tasarımı (React)

### 4.1. Context Switcher (Birim Değiştirici)
Kullanıcının bulunduğu birimi değiştirmesini sağlayan bileşen.

*   **Konum:** Sol Menü (Sidebar) üst kısmı veya Header.
*   **Görünüm:** Dropdown menü.
*   **Data:** Kullanıcının yetkili olduğu birimlerin listesi (`user.assignedUnits` gibi bir state'den gelecek).
*   **Aksiyon:** Seçim yapıldığında `/api/auth/select-birim` çağrılır, dönen yeni Token `authStore`'a kaydedilir ve sayfa yenilenir (`window.location.reload()` veya React Router navigate).

### 4.2. Modüler Sayfa Yapısı
Birimlerin sayfaları dinamik route yapısıyla yönetilecek.

*   **Route Pattern:** `/birim/:birimAdi/dashboard`
    *   Örn: `/birim/bilgi-islem/dashboard`
    *   Örn: `/birim/personel-burosu/dashboard`
*   **Guard:** Route değiştiğinde, URL'deki birim ile Token'daki birim uyuşuyor mu kontrolü yapılacak. Uyuşmuyorsa "Birim Değiştirilsin mi?" diyaloğu veya otomatik yönlendirme.

---

## 5. Admin Panel: Kullanıcı Yetkilendirme Arayüzü

Kullanıcıya birim ve rol atama işlemi için **"Matris Grid"** veya **"Master-Detail"** yapısı kullanılacaktır.

### 5.1. UI Taslağı (Kullanıcı Düzenleme Modal)

```text
-------------------------------------------------------
|  Kullanıcı: Ahmet Yılmaz (Sicil: 12345)             |
-------------------------------------------------------
|  [ + Yeni Birim Yetkisi Ekle ]                      |
|                                                     |
|  MEVCUT YETKİLER:                                   |
|  -------------------------------------------------  |
|  | Birim Adı       | Rolü           | İşlemler   |  |
|  |-----------------|----------------|------------|  |
|  | Bilgi İşlem     | Birim Yönetici | [Sil][Düz] |  |
|  | İhale Komisyonu | İzleyici       | [Sil][Düz] |  |
|  | Genel Bütçe     | Veri Giriş     | [Sil][Düz] |  |
|  -------------------------------------------------  |
-------------------------------------------------------
```

### 5.2. Ekleme Akışı
1.  **"+ Yeni Birim Yetkisi Ekle"** butonuna basılır.
2.  Bir satır açılır veya modal popup gelir.
3.  **Dropdown 1:** Birim Seç (Tüm aktif birimler).
4.  **Dropdown 2:** Rol Seç (Sistemdeki roller).
5.  **Kaydet:** API'ye `POST /api/users/{id}/roles` isteği atılır.

---

## 6. Güvenlik & Kısıtlamalar

1.  **Token İzolasyonu:** Bir birim için alınan token, başka bir birimin verisine erişemez (Backend'de `Where(x => x.BirimId == tokenBirimId)` filtresi zorunludur).
2.  **Global Admin İstisnası:** "Sistem Yöneticisi" (SuperAdmin) rolüne sahip kullanıcılar, birim bağımsız her veriye erişebilir. Bu kontrol `PermissionAuthorizationFilter` içinde zaten mevcuttur ("SuperAdmin bypass").

## 7. Sonuç
Bu tasarım, "Her Birim Kendi Başına Bir Modül" vizyonunu gerçekleştirmek için en uygun ve ölçeklenebilir yapıdır. Mevcut altyapı üzerine minimum değişiklikle (çoğunlukla Frontend ve Controller filtreleme mantığı) inşa edilebilir.
