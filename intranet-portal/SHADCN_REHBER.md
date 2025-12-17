# shadcn/ui Bileşen Yönetimi

## Nedir?

shadcn/ui, bileşenleri npm paketi olarak değil doğrudan projeye kopyalayan bir UI kütüphanesidir.

Bileşen konumu: `frontend/src/components/ui/`

---

## Güncelleme Kontrolü

### Tüm Bileşenler

```bash
cd frontend
npx shadcn@latest diff
```

### Belirli Bileşen

```bash
npx shadcn@latest diff button
```

---

## Bileşen Güncelleme/Ekleme

### Yeni Bileşen Ekle

```bash
npx shadcn@latest add [bileşen-adı]
```

### Mevcut Bileşeni Güncelle

```bash
npx shadcn@latest add [bileşen-adı] --overwrite
```

---

## Kaynaklar

- **Docs:** <https://ui.shadcn.com/docs>
- **Changelog:** <https://ui.shadcn.com/docs/changelog>
- **GitHub:** <https://github.com/shadcn-ui/ui>

---

**Son Kontrol:** 2025-12-17 → ✅ Tüm bileşenler güncel
