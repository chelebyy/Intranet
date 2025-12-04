# GitHub İş Akışı Kılavuzu

Bu kılavuz, projeyi hem evde hem işyerinde çalışırken GitHub üzerinden senkronize etmek için gerekli adımları açıklar.

## 🔄 Günlük İş Akışı

### Sabah / Çalışmaya Başlarken

```bash
# Proje dizinine git
cd "c:\Users\IT\Desktop\Bilişim Sistemi\intranet-portal"

# En son değişiklikleri al
git pull origin main
```

**Önemli:** Her zaman çalışmaya başlamadan önce `git pull` yapın!

### Gün Sonunda / Değişiklikleri Paylaşma

```bash
# Değişiklikleri kontrol et
git status

# Tüm değişiklikleri stage'e al
git add .

# Commit mesajı ile kaydet
git commit -m "Açıklayıcı commit mesajı"

# GitHub'a gönder
git push origin main
```

## 📝 İyi Commit Mesajları Yazma

**✅ İyi Örnekler:**
```bash
git commit -m "Admin paneline kullanıcı silme özelliği eklendi"
git commit -m "Login sayfası responsive tasarım düzeltmesi"
git commit -m "Veritabanı migration: BirimUser tablosu eklendi"
git commit -m "Bug fix: Null reference hatası düzeltildi"
```

**❌ Kötü Örnekler:**
```bash
git commit -m "güncelleme"
git commit -m "fix"
git commit -m "asdf"
```

## 🆘 Sık Karşılaşılan Durumlar

### Senaryo 1: Değişiklik Çakışması (Conflict)

Hem evde hem işte aynı dosyayı değiştirdiyseniz:

```bash
git pull origin main
# CONFLICT: Merge conflict in file.cs hatası alırsınız
```

**Çözüm:**
1. Çakışan dosyayı editörde açın
2. `<<<<<<`, `======`, `>>>>>>` işaretlerini bulun
3. Hangi değişikliği tutacağınıza karar verin
4. İşaretleri silin ve dosyayı kaydedin
5. Devam edin:

```bash
git add .
git commit -m "Conflict çözüldü"
git push origin main
```

### Senaryo 2: Yanlışlıkla Commit Yaptım

**Son commit'i geri al (değişiklikler kalsın):**
```bash
git reset --soft HEAD~1
```

**Son commit'i tamamen sil:**
```bash
git reset --hard HEAD~1
```

> ⚠️ **UYARI:** `--hard` kullanımı değişiklikleri kalıcı olarak siler!

### Senaryo 3: Push Etmeden Önce Fikir Değiştirdim

```bash
# Stage'den geri al (değişiklikler kalsın)
git reset HEAD <dosya_adı>

# Veya tüm staging'i geri al
git reset HEAD .
```

### Senaryo 4: Dosya Silmek İstiyorum

```bash
# Dosyayı sil ve git'e bildir
git rm backend/IntranetPortal.API/OldFile.cs
git commit -m "Kullanılmayan OldFile.cs silindi"
git push
```

### Senaryo 5: Değişiklikleri Geçici Saklamak

İş yarım kalmışsa ve commit etmek istemiyorsanız:

```bash
# Değişiklikleri sakla
git stash

# Başka işler yap (pull, branch değiştir vs.)

# Saklanan değişiklikleri geri getir
git stash pop
```

## 🌿 Branch Kullanımı (İsteğe Bağlı)

Büyük özellikler için branch kullanabilirsiniz:

```bash
# Yeni branch oluştur
git checkout -b feature/yeni-ozellik

# Değişiklik yap, commit et
git add .
git commit -m "Yeni özellik eklendi"

# Branch'i GitHub'a gönder
git push origin feature/yeni-ozellik

# Ana branch'e geri dön
git checkout main

# Branch'i birleştir
git merge feature/yeni-ozellik
git push origin main
```

## 📊 Faydalı Komutlar

### Değişiklikleri Görüntüleme

```bash
# Henüz commit edilmemiş değişiklikleri göster
git diff

# Commit geçmişini göster
git log --oneline -10

# Belirli bir dosyanın geçmişini göster
git log --follow -- backend/IntranetPortal.API/Program.cs
```

### Durum Kontrolü

```bash
# Mevcut durum
git status

# Remote repository bilgisi
git remote -v

# Branch'leri listele
git branch -a
```

### Geri Alma İşlemleri

```bash
# Belirli bir dosyayı son commit'teki haline getir
git checkout HEAD -- <dosya_adı>

# Tüm değişiklikleri geri al (tehlikeli!)
git reset --hard HEAD
```

## 🔐 Güvenlik İpuçları

1. **Hassas Bilgiler:** Asla şifre, token, veya API key'leri commit etmeyin
2. **`.gitignore` Kontrolü:** Sensitive dosyalar `.gitignore`'da olmalı
3. **Force Push Yasak:** Özellikle paylaşılan branch'lerde `git push -f` kullanmayın

## 📞 Yardım

Takıldığınızda:

```bash
# Git yardım
git help <komut>
git help commit

# Durum kontrolü
git status

# Geçmişe bak
git log
```

## 🎯 En İyi Pratikler

1. ✅ **Sık commit yapın** - Küçük, anlamlı commit'ler
2. ✅ **Her zaman pull ile başlayın** - Çakışmaları önleyin
3. ✅ **Açıklayıcı mesajlar** - Ne yaptığınızı yazın
4. ✅ **Test edin** - Push etmeden önce kodu test edin
5. ✅ **Gün sonu push** - Bilgisayar değiştirmeden önce push edin

---

**Hatırlatma:** Bu iş akışı `main` branch üzerinde çalışmak için tasarlanmıştır. Takım çalışması için branch stratejisi farklı olabilir.
