# Kurumsal İntranet Web Portalı - Frontend

React + TypeScript + Vite tabanlı modern frontend uygulaması.

## 📦 Entegre Edilen Tasarımlar

Bu proje, daha önce hazırlanmış **Login** ve **Admin Dashboard** tasarımlarının entegrasyonu ile oluşturulmuştur:

### ✅ Login Tasarımı (Login-matrix)
- **Matrix Background Effect**: Fareyi takip eden interaktif animasyon
- **Glassmorphism Design**: Modern cam efekti ile şeffaf form
- **Gradient Butonlar**: Hover efektleri ile görsel zenginlik
- **Show/Hide Password**: Şifre görünürlük kontrolü
- **Remember Me**: Beni hatırla özelliği

### ✅ Admin Dashboard Tasarımı
- **Sidebar Navigation**: Sol menü ile sayfa geçişleri
- **Dark Mode Support**: Açık/koyu tema desteği
- **Recharts Integration**: Veri görselleştirme grafikleri
- **Material Symbols Icons**: Modern ikon seti
- **Responsive Design**: Mobil uyumlu arayüz

## 🏗️ Proje Yapısı

```
frontend/
├── src/
│   ├── features/              # Feature-based modül yapısı
│   │   ├── auth/              # Kimlik doğrulama
│   │   │   ├── LoginPage.tsx          # Matrix background login
│   │   │   └── BirimSelection.tsx     # Çoklu birim seçimi
│   │   └── admin/             # Admin panel
│   │       ├── components/
│   │       │   └── Sidebar.tsx        # Sol navigasyon menüsü
│   │       └── pages/
│   │           ├── Dashboard.tsx      # Ana dashboard
│   │           ├── UserList.tsx       # Kullanıcı listesi
│   │           ├── DepartmentList.tsx # Birim listesi
│   │           ├── RolePermissions.tsx # Rol ve izinler
│   │           └── Reports.tsx        # Raporlar
│   ├── shared/                # Paylaşılan bileşenler
│   │   ├── components/
│   │   │   ├── MatrixBackground.tsx   # Matrix animasyon
│   │   │   └── ProtectedRoute.tsx     # Route koruma
│   │   └── layouts/
│   │       └── AdminLayout.tsx        # Admin layout wrapper
│   ├── api/                   # API istemci katmanı
│   │   ├── apiClient.ts               # Axios yapılandırması
│   │   └── authApi.ts                 # Auth API servisi
│   ├── store/                 # Global state yönetimi
│   │   └── authStore.ts               # Zustand auth store
│   ├── types/                 # TypeScript tip tanımları
│   │   └── index.ts                   # Tüm tipler
│   ├── App.tsx                # Ana uygulama + Routing
│   └── index.css              # Global stiller (Tailwind)
├── .env                       # Environment variables
├── tailwind.config.js         # Tailwind CSS yapılandırması
├── postcss.config.js          # PostCSS yapılandırması
├── vite.config.ts             # Vite yapılandırması
└── package.json               # Bağımlılıklar
```

## 🚀 Teknoloji Yığını

### Core
- **React 19.2.0** - UI framework
- **TypeScript 5.8.2** - Tip güvenliği
- **Vite 6.2.0** - Build tool (hızlı dev server)

### State Management & Routing
- **Zustand** - Hafif ve performanslı state yönetimi
- **React Router DOM** - Client-side routing

### API & Data
- **Axios** - HTTP istemcisi (HttpOnly cookie desteği)
- **Recharts 3.5.0** - Veri görselleştirme

### Styling
- **TailwindCSS 3.4.17** - Utility-first CSS framework
- **Material Symbols** - Google icon seti
- **Dark Mode** - Class-based dark mode desteği

## ⚙️ Kurulum ve Çalıştırma

### 1. Bağımlılıkları Yükle
```bash
cd frontend
npm install
```

### 2. Environment Variables
`.env` dosyasını düzenleyin:
```env
VITE_API_BASE_URL=https://localhost:5001/api
VITE_ENV=development
```

### 3. Development Server Başlat
```bash
npm run dev
```
Uygulama http://localhost:5173 adresinde çalışacak.

### 4. Production Build
```bash
npm run build
npm run preview
```

## 🔐 Güvenlik Özellikleri

### HttpOnly Cookie JWT
- Token'lar localStorage'da DEĞİL, HttpOnly cookie'de saklanır
- XSS saldırılarına karşı korumalı
- `withCredentials: true` ile cookie gönderimi

### Birim Bazlı Erişim Kontrolü
- `X-Birim-Id` header'ı ile backend'e gönderilir
- Her istek kullanıcının aktif birimine göre yetkilendirilir

### Protected Routes
- `ProtectedRoute` bileşeni ile korumalı sayfalar
- Kimlik doğrulaması olmadan erişim engellenir
- Çoklu birim kullanıcıları için birim seçim zorunluluğu

## 🎨 Tasarım Sistemi

### Renk Paleti (Tailwind Config)

**Light Mode:**
- `background`: #F8FAFC
- `card`: #FFFFFF
- `sidebar`: #FFFFFF
- `primary`: #3B82F6
- `text-primary`: #1E293B
- `text-secondary`: #64748B

**Dark Mode:**
- `dark-background`: #0F172A
- `dark-card`: #1E293B
- `dark-sidebar`: #1E293B
- `dark-text-primary`: #F8FAFC
- `dark-text-secondary`: #94A3B8

### Dark Mode Kullanımı
```tsx
// Tailwind dark: prefix ile
<div className="bg-white dark:bg-dark-card">...</div>

// Programatik olarak
document.documentElement.classList.add('dark');
```

## 📡 API Entegrasyonu

### Axios Interceptor
```typescript
// Request: Birim ID ekleme
config.headers['X-Birim-Id'] = selectedBirim.birimId;

// Response: Hata yönetimi
- 401: Login sayfasına yönlendirme
- 403: Yetkisiz erişim uyarısı
- 429: Rate limit aşımı
```

### API Kullanımı
```typescript
import { authApi } from '@/api/authApi';

// Login
await authApi.login({ sicil: '12345', password: 'xxx' });

// Logout
await authApi.logout();
```

## 🗺️ Routing Yapısı

```typescript
/login                  → LoginPage (Public)
/select-birim           → BirimSelection (Auth Required)
/dashboard              → Dashboard (Protected)
/users                  → UserList (Protected)
/departments            → DepartmentList (Protected)
/roles                  → RolePermissions (Protected)
/reports                → Reports (Protected)
```

## 🧩 Önemli Bileşenler

### MatrixBackground
Fareyi takip eden interaktif Matrix animasyonu:
```tsx
import MatrixBackground from '@/shared/components/MatrixBackground';

<MatrixBackground />
```

### ProtectedRoute
Korumalı route wrapper:
```tsx
<ProtectedRoute requireBirimSelection>
  <AdminLayout />
</ProtectedRoute>
```

### useAuthStore (Zustand)
```typescript
const { user, login, logout, selectBirim } = useAuthStore();

// Login
await login({ sicil, password });

// Birim seç
selectBirim(selectedBirim);

// Logout
logout();
```

## 📋 Yapılacaklar (Sonraki Aşamalar)

- [ ] Backend API bağlantısı (şu an mock data)
- [ ] CRUD işlemleri (User, Department, Role)
- [ ] Form validation (FluentValidation benzeri)
- [ ] Loading states ve skeletons
- [ ] Error boundaries
- [ ] Toast notifications
- [ ] File upload UI
- [ ] Excel export UI
- [ ] Pagination components
- [ ] Search ve filtering
- [ ] Multi-language support (i18n)
- [ ] Unit tests (Vitest + React Testing Library)

## 🐛 Bilinen Sorunlar

1. **Build Warning**: Chunk size > 500KB
   - **Neden**: Recharts kütüphanesi büyük
   - **Çözüm**: Dynamic import ile code splitting yapılabilir

2. **PostCSS Warning**: @import sırası
   - **Durum**: Uyarı, çalışmayı etkilemiyor
   - **Düzeltme**: index.css'de @import'u en üste taşı

## 📚 Referanslar

- **Tasarım Kaynakları**:
  - Login Template: `intranet-portal/frontend/Login-matrix/`
  - Admin Dashboard: `intranet-portal/frontend/admin-dashboard/`

- **Dokümantasyon**:
  - PRD.md - Product requirements
  - TECHNICAL_DESIGN.md - Teknik mimari
  - API_SPECIFICATION.md - API endpoints
  - SECURITY_ANALYSIS_REPORT.md - Güvenlik analizi

## 👨‍💻 Geliştirici Notları

- Tüm API çağrılarında `withCredentials: true` kullanılmalı (HttpOnly cookie)
- Dark mode için `dark:` prefix kullan
- Type safety için `types/index.ts` dosyasını güncelle
- Yeni sayfalar `features/` altına modül bazlı ekle
- Shared components için `shared/components/` kullan

---

**Son Güncelleme:** 2025-11-25
**Versiyon:** 1.0
**Durum:** ✅ Entegrasyon Tamamlandı
