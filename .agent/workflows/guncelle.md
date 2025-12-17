---
description: Projedeki (Backend & Frontend) tüm paketlerin güncelliğini kontrol et ve güncelle
---

# 📦 Proje Bağımlılıklarını Güncelleme Sihirbazı

Bu akış, hem .NET (Backend) hem de React (Frontend) projenizdeki kütüphaneleri tarar ve güncellemenize yardımcı olur.

## 1. Backend (.NET) Paketlerini Kontrol Et

Önce Backend tarafındaki Nuget paketlerini kontrol ediyoruz.

```bash
cd backend
dotnet list package --outdated
```

Eğer güncellenecek paket varsa, aşağıdaki komutu kullanarak spesifik paketleri güncelleyebilirsiniz (Örn: `dotnet add package [PaketAdı]`) veya proje dosyasından versiyonu yükseltebilirsiniz.

// turbo
## 2. Frontend (NPM) Paketlerini Kontrol Et

Şimdi Frontend tarafına geçelim ve güncellemeleri kontrol edelim.

```bash
cd frontend
npm outdated
```

## 3. Frontend Paketlerini Otomatik Güncelle (Opsiyonel)

Eğer Frontend paketlerinin HEPSİNİ son sürüme çekmek isterseniz, `npm-check-updates` aracı harikadır.

> **Dikkat:** Bu işlem `package.json` dosyasındaki versiyonları en son sürüme çeker. Bazı paketlerde uyumsuzluk (Breaking Change) olabilir.

Otomatik güncelleme yapmak istiyor musunuz?

```bash
cd frontend
npx npm-check-updates -u
npm install
```

## 4. Son Kontroller

Güncellemeler bittikten sonra projeyi test etmeyi unutmayın!

1.  Backend'i derle: `dotnet build ../backend/IntranetPortal.API/IntranetPortal.API.csproj`
2.  Frontend'i derle: `cd ../frontend && npm run build`
