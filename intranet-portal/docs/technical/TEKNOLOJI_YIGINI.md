# Proje Teknoloji Yığını (Tech Stack)

**Proje:** Kurumsal İntranet Web Portalı  
**Analiz Tarihi:** 17.12.2025

Aşağıda projenin güncel teknoloji analizi ve kullanılan araçların detaylı listesi bulunmaktadır.

## 1. Backend Teknolojileri

| Kategori | Teknoloji / Araç | Sürüm | Kullanım Amacı ve Detaylar |
| :--- | :--- | :--- | :--- |
| **Dil** | **C#** | 12.0+ | Modern backend geliştirme dili. |
| **Framework** | **ASP.NET Core Web API** | **.NET 9.0** | Yüksek performanslı web API çatısı. |
| **Mimari** | **Clean Architecture** | - | Katmanlı yapı: `Domain`, `Application`, `Infrastructure`, `API`. |
| **Veritabanı** | **PostgreSQL** | 16+ | Ana veri depolama sistemi. |
| **ORM** | **Entity Framework Core** | **9.0.0** | Veritabanı erişimi (Code-First yaklaşımı). |
| **DB Provider** | Npgsql.EntityFrameworkCore | 9.0.2 | PostgreSQL için EF Core sağlayıcısı. |
| **Authentication** | JWT (JSON Web Token) | 9.0.0 | Güvenli kimlik doğrulama (`HttpOnly Cookie` ile). |
| **Şifreleme** | BCrypt.Net-Next | 4.0.3 | Kullanıcı parolalarının güvenli hashlenmesi. |
| **Loglama** | Serilog.AspNetCore | 10.0.0 | Yapılandırılmış (structured) loglama altyapısı. |
| **Dokümantasyon**| Microsoft.AspNetCore.OpenApi | 9.0.11 | API uç noktalarının otomatik dokümantasyonu. |
| **Cache** | IMemoryCache | - | Sunucu içi önbellekleme (In-Memory Caching). |

## 2. Frontend Teknolojileri

| Kategori | Teknoloji / Araç | Sürüm | Kullanım Amacı ve Detaylar |
| :--- | :--- | :--- | :--- |
| **Dil** | **TypeScript** | 5.9.3 | Tip güvenli JavaScript geliştirmesi. |
| **Kütüphane** | **React** | **19.2.1** | Kullanıcı arayüzü oluşturma (Son sürüm). |
| **Build Tool** | **Vite** | **7.2.4** | Hızlı geliştirme sunucusu ve build aracı. |
| **State Mgmt** | **Zustand** | 5.0.8 | Hafif ve modern global durum yönetimi. |
| **Routing** | **React Router DOM** | **7.9.6** | Sayfa yönlendirme ve navigasyon (v7). |
| **CSS Framework**| **Tailwind CSS** | 4.1 | Utility-first CSS framework (v4 + Vite Plugin). |
| **UI Bileşenleri**| **Radix UI** | - | Erişilebilir, stilsiz (headless) temel bileşenler. |
| **Animasyon** | tailwindcss-animate | 1.0.7 | Tailwind için animasyon eklentileri. |
| **İkon Seti** | Lucide React | 0.555.0 | Modern ve hafif SVG ikon kütüphanesi. |
| **Form** | React Hook Form | 7.67 | Performanslı form validasyonu ve yönetimi. |
| **Validasyon** | Zod | 4.1.13 | TypeScript uyumlu şema doğrulama. |
| **HTTP Client** | Axios | 1.13.2 | Backend API ile iletişim. |
| **Tarih İşlemleri**| date-fns | 4.1.0 | Hafif tarih ve saat manipülasyonu. |

## 3. Güvenlik ve Altyapı

| Özellik | Araç / Yöntem | Açıklama |
| :--- | :--- | :--- |
| **API Güvenliği** | Rate Limiting | Saniyedeki istek sayısını sınırlama (`app.UseRateLimiting`). |
| **Erişim Kontrolü**| IP Whitelist | Belirli IP'lere erişim izni veren özel middleware. |
| **Token Güvenliği** | HttpOnly Cookie | XSS saldırılarına karşı token'ın cookie'de saklanması. |
| **Audit** | Audit Log Service | Kullanıcı işlemlerinin detaylı kayıt altına alınması. |

## 4. Özel Notlar

* **CI/CD:** Projede henüz otomatik bir CI/CD pipeline (GitHub Actions vb.) kurulu değildir.Deployment manuel veya scriptler aracılığıyla yapılmaktadır.
* **Docker:** Proje kök dizininde Docker yapılandırma dosyası bulunmamaktadır.
