# Tailwind CSS v4 Migration Kararları

## Kullandığımız Yaklaşım

### 1. Vite Plugin → ✅ KULLANDIK

```typescript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**Neden?** PostCSS'ten daha hızlı. Vite kullandığımız için en optimal seçenek.

### 2. CSS-first Configuration → ❌ KULLANMADIK

```css
/* index.css */
@import "tailwindcss";
@config "../tailwind.config.js";  /* Backward compatibility */
```

`tailwind.config.js` dosyası hala aktif - shadcn/ui renkleri bu dosyada tanımlı.

---

## Karşılaştırma

| Yaklaşım | Avantajları | Dezavantajları |
|----------|-------------|----------------|
| **Mevcut** (`@config` ile JS) | Mevcut shadcn/ui çalışıyor, az değişiklik | İki config var |
| **Saf CSS-first** (`@theme`) | Tek dosya, modern | Büyük refactoring gerekli |

---

## Sonuç

**Mevcut yaklaşım (Vite plugin + `@config`) doğru seçim.** Tam CSS-first için shadcn/ui renklerini CSS'e taşımak gerek - şu an gereksiz risk.
