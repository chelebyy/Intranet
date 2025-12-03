# Modüler Yapı ve Yeni Birim Ekleme Planı

Bu doküman, **Kurumsal İntranet Web Portalı**'nın modüler yapısını, sisteme nasıl yeni birim ekleneceğini ve bu süreçte RBAC (Rol Bazlı Erişim Kontrolü) modelinin nasıl işletileceğini detaylandırır.

## 1. Modüler Yapı Felsefesi

Sistem, her birimin (Departman) kendi içinde izole edilmiş bir "Modül" gibi çalışmasına izin verecek şekilde tasarlanmıştır. Ancak tüm birimler ortak bir kullanıcı havuzunu ve yetki altyapısını kullanır.

### Temel Prensipler

* **Ortak Çekirdek (Core):** Kullanıcılar, Roller, Loglar ve Genel Ayarlar ortaktır.
* **Birim Verisi (Unit Data):** Her birimin kendine ait tabloları olabilir (Örn: `IK_Personel`, `IT_ArizaKayit`).
* **Dinamik Menü:** Kullanıcının giriş yaptığı birime göre sol menü dinamik olarak değişir.

## 2. Yeni Birim Ekleme Süreci (Adım Adım)

Yeni bir birim (Örneğin: "Satın Alma") sisteme eklenirken izlenecek adımlar şunlardır:

### Adım 1: Veritabanı Tanımları

1. **Birim Kaydı:** `Birim` tablosuna yeni kayıt eklenir.
    * `INSERT INTO Birim (BirimAdi, Aciklama) VALUES ('Satın Alma', 'Satın alma süreçleri');`
2. **Birim Tabloları:** Birimin ihtiyacı olan tablolar oluşturulur. Tablo isimlerinde birim öneki kullanılması önerilir.
    * Örnek: `SA_Talep`, `SA_Tedarikci`.

### Adım 2: Rol ve Yetki Tanımları (RBAC)

1. **Roller:** Birime özel roller tanımlanır (Eğer standart roller yetersizse).
    * Örnek: `Satın Alma Onaylayıcı`.
2. **Yetkiler (Permissions):** Yeni modül için yetkiler `Permission` tablosuna eklenir.
    * `sa.talep.create`, `sa.talep.approve`, `sa.report.view`.
3. **Rol-Yetki Eşleşmesi:** Oluşturulan yetkiler ilgili rollere atanır (`RolePermission` tablosu).

### Adım 3: Backend Geliştirmesi

1. **Controller:** `SatinAlmaController` oluşturulur.
2. **Service:** İş mantığı için `SatinAlmaService` yazılır.
3. **Authorization:** Endpoint'ler yeni yetkilerle korunur.
    * `[HasPermission("sa.talep.create")]`

### Adım 4: Frontend Geliştirmesi

1. **Sayfalar:** `pages/satin-alma/` altında gerekli sayfalar oluşturulur.
2. **Route Tanımı:** Yeni sayfalar Router'a eklenir.
3. **Menü Konfigürasyonu:** Birim ID'si ile eşleşen menü öğeleri konfigürasyon dosyasına eklenir.

## 3. Örnek Tablolar ve Şema

### Senaryo: "Satın Alma" Birimi Eklendiğinde

#### 3.1. Mevcut Tablolara Eklenen Kayıtlar

**Birim Tablosu:**

| BirimID | BirimAdi |
|---------|----------|
| 101 | Bilgi İşlem |
| 102 | İnsan Kaynakları |
| 103 | Satın Alma |
| **104** | **Genel Bütçe** |

**Permission Tablosu (Yeni Eklenenler):**

| PermissionID | Action | Resource |
|--------------|--------|----------|
| 501 | create | sa.talep |
| 502 | approve | sa.talep |

#### 3.2. Yeni Oluşturulan Birim Tabloları (Örnek)

**SA_Talep (Satın Alma Talepleri):**

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| TalepID | INT (PK) | Talep numarası |
| OlusturanUserID | INT (FK) | Talebi açan personel |
| UrunAdi | VARCHAR | İstenen ürün |
| Miktar | INT | Adet |
| Durum | ENUM | Bekliyor, Onaylandı, Red |
| Tarih | DATETIME | Talep tarihi |

**SA_Tedarikci (Tedarikçi Listesi):**

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| TedarikciID | INT (PK) | Tedarikçi ID |
| FirmaAdi | VARCHAR | Firma Adı |
| VergiNo | VARCHAR | Vergi Numarası |

## 4. İpucu ve Öneriler

* **Migration Kullanın:** Yeni birim tablolarını eklerken mutlaka Entity Framework Migration kullanın.
* **Lazy Loading:** Frontend tarafında yeni birim modüllerini "Lazy Load" ile yükleyin, böylece diğer birimlerdeki kullanıcılar gereksiz kod indirmez.
