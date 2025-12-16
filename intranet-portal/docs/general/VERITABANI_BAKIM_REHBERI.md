# Veritabanı Bakım İşlemleri Rehberi

Bu rehber, **Veritabanı Bakım** modülündeki işlemlerin ne işe yaradığını ve ne zaman kullanılmaları gerektiğini açıklar. Bu işlemler sisteminizin sağlığı ve performansı için kritiktir.

## 1. VACUUM (Temizlik)

**Ne İşe Yarar?**
Veritabanında bir kayıt sildiğinizde veya güncellediğinizde, eski veri hemen diskten silinmez. "Ölü" (dead tuple) olarak işaretlenir. `VACUUM` işlemi bu ölü satırları temizler ve tekrar kullanılabilir hale getirir.

**Ne Zaman Kullanılmalı?**

- **Sıklık:** Otomatik olarak (AutoVacuum) çalışır ama manuel olarak haftada bir veya çok yoğun veri silme/güncelleme işleminden sonra çalıştırılabilir.
- **Etkisi:** Disk boyutunu küçültmez (işletim sistemine yer iade etmez), sadece veritabanı dosyasının içindeki boşlukları tekrar kullanılabilir yapar. Sistemi kilitlemez.

## 2. VACUUM FULL (Derin Temizlik)

**Ne İşe Yarar?**
Tabloyu tamamen yeniden yazar. Ölü alanları temizler ve diskteki dosya boyutunu küçültür (işletim sistemine yer iade eder).

**Ne Zaman Kullanılmalı?**

- **Sıklık:** Çok nadiren. Sadece bir tablonun boyutu aşırı şiştiyse ve `VACUUM` işe yaramıyorsa.
- **DİKKAT:** Bu işlem **sistemi kilitler** (Lock). İşlem bitene kadar o tablo üzerinde hiçbir işlem yapılamaz. Mesai saatleri dışında yapılmalıdır.

## 3. ANALYZE (İstatistik Güncelleme)

**Ne İşe Yarar?**
Veritabanı, sorguları (Query) en hızlı nasıl çalıştıracağını belirlemek için tablolar hakkında istatistik tutar (örn: "Kullanıcılar tablosunda 1000 satır var, en çok 'Adana' ili geçiyor"). `ANALYZE` bu istatistikleri günceller.

**Ne Zaman Kullanılmalı?**

- **Sıklık:** Büyük veri girişlerinden (Import) sonra veya sorguların yavaşladığını hissettiğinizde.
- **Etkisi:** Sorgu performansını doğrudan artırır. Çok hızlıdır ve sistemi kilitlemez.

## 4. REINDEX (İndeks Onarma)

**Ne İşe Yarar?**
Tablolardaki indeksleri (arama dizinlerini) silip baştan oluşturur. İndeksler zamanla parçalanabilir (fragmentation) ve verimsizleşebilir.

**Ne Zaman Kullanılmalı?**

- **Sıklık:** Ayda bir veya belirli bir tablodaki sorgular indeks olmasına rağmen yavaş çalışıyorsa.
- **Etkisi:** İndeks boyutunu küçültür ve performansı artırır. İşlem sırasında ilgili tablo kilitlenebilir (PostgreSQL sürümüne göre değişir).

## Önerilen Bakım Sırası

Eğer tam bir bakım yapacaksanız şu sırayı izlemeniz önerilir:

1. **VACUUM** (Ölü satırları temizle)
2. **ANALYZE** (İstatistikleri güncelle - VACUUM sonrası yapmak en iyisidir)
3. **REINDEX** (Gerekirse indeksleri onar)

*Not: Sistem bu işlemleri "Arka Planda" yapar, ancak büyük tablolarda işlem süresi uzayabilir.*
