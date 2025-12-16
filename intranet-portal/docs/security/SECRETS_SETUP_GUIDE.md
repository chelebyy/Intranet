# 🔐 Kurumsal Intranet - Güvenlik ve Şifre Kurulum Rehberi

> **Oluşturulma Tarihi:** 17 Aralık 2024
> **Durum:** Kritik Güvenlik Prosedürü

Bu rehber, projenin veritabanı şifreleri ve güvenlik anahtarlarının (Secrets) nasıl yönetileceğini anlatır. Güvenlik gereği bu şifreler **kodun içinde (appsettings.json) saklanmaz**.

## 1. Geliştirme Ortamı (Development) - Localhost

Evinizdeki veya iş yerinizdeki bilgisayarda projeyi çalıştırmak için aşağıdaki adımları **bir kere** uygulamanız gerekir. Bu şifreler bilgisayarınızın güvenli "User Secrets" alanında saklanır.

### 📌 Kurulum Komutları

Aşağıdaki komutları `backend/IntranetPortal.API` klasörü içinde terminalden çalıştırın:

```powershell
# 1. Veritabanı Bağlantısı (Şifreyi buraya tanımlıyoruz)
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=IntranetDB;Username=intranet_user;Password=SecurePassword123!"

# 2. JWT Güvenlik Anahtarı (Token üretimi için gerekli)
dotnet user-secrets set "JwtSettings:SecretKey" "IntranetPortalSecureKey2024!@#$%"

# 3. Kontrol Et (Doğru eklenmiş mi?)
dotnet user-secrets list
```

### ❓ Neden Bunu Yapıyoruz?
*   Şifreler GitHub'a gitmez.
*   Bilgisayarınızdaki diğer projeler bu şifreleri göremez.
*   GitHub private (özel) olsa bile güvenlik standardı budur.

---

## 2. Üretim Ortamı (Production) - Gerçek Sunucu

Projeyi canlı sunucuya (IIS, Docker, Linux Service vb.) kurarken **kod değişikliği yapmanıza gerek yoktur**. .NET, sunucudaki "Environment Variables" (Ortam Değişkenleri) değerlerini otomatik okur.

### 🚀 Sunucuda Yapılması Gereken Ayarlar

Sunucunuzun "Environment Variables" kısmına aşağıdaki anahtar-değer çiftlerini eklemelisiniz.

| Ortam Değişkeni Adı (Key) | Değer (Value) Örneği | Açıklama |
| :--- | :--- | :--- |
| `ConnectionStrings__DefaultConnection` | `Host=192.168.1.50;Database=ProdDB...` | Canlı veritabanı adresi ve şifresi |
| `JwtSettings__SecretKey` | `(ÇokUzunVeKarmaşıkRastgeleBirŞifre)` | Buraya min 32 karakterlik zor bir şifre girin |

> **Not:** Linux/Docker ortamlarında ayraç olarak `__` (çift alt çizgi) kullanılır. Windows IIS'te `:` kullanılabilir ama `__` her yerde çalışır.

### 🛡️ Önemli Güvenlik Notu
Production ortamında **ASLA** `SecurePassword123!` gibi basit şifreler kullanmayın. Mutlaka güçlü ve benzersiz şifreler üretin.
