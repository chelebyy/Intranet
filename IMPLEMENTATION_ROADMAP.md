# Kurumsal İntranet Web Portalı - İmplementasyon Yol Haritası

**Versiyon:** 1.0
**Tarih:** 2025
**Proje Tipi:** Kurumsal İntranet Portalı (Multi-Unit RBAC)

---

## Genel Bakış

Bu yol haritası, **Kurumsal İntranet Web Portalı** projesinin sıfırdan tam fonksiyonel production ortamına kadar tüm geliştirme aşamalarını kapsar. Proje 6 ana faz ve yaklaşık 12-16 haftalık geliştirme sürecinden oluşmaktadır.

### Kritik Başarı Faktörleri
- ✅ **Güvenlik Önceliği**: IP whitelist, JWT, BCrypt, AES-256 şifreleme ilk günden uygulanmalı
- ✅ **RBAC Temel**: Rol bazlı yetkilendirme tüm sistemin omurgasıdır
- ✅ **Multi-Unit Mimari**: Kullanıcılar birden fazla birime farklı rollerle atanabilir
- ✅ **Performans**: 100-200 eşzamanlı kullanıcı, ≤2sn portal açılışı
- ✅ **Modülerlik**: Yeni birim ekleme süreci basit ve tekrarlanabilir olmalı

---

## Faz 0: Proje Kurulumu ve Altyapı (Hafta 1-2)

### 🎯 Hedef
Geliştirme ortamını hazırlamak ve proje iskeletini oluşturmak.

### Backend Kurulumu

#### 0.1. Geliştirme Ortamı Hazırlığı
- [ ] **.NET 9 SDK** kurulumu
- [ ] **PostgreSQL 16** kurulumu ve yapılandırması
- [ ] **Visual Studio 2022** veya **JetBrains Rider** kurulumu
- [ ] **Git** kurulumu ve repository oluşturma
- [ ] **Postman** veya **Insomnia** API test aracı

#### 0.2. Backend Proje Yapısı
```bash
# Solution oluşturma
dotnet new sln -n IntranetPortal

# Katmanlı mimari projeleri
dotnet new webapi -n IntranetPortal.API -f net9.0
dotnet new classlib -n IntranetPortal.Domain -f net9.0
dotnet new classlib -n IntranetPortal.Application -f net9.0
dotnet new classlib -n IntranetPortal.Infrastructure -f net9.0

# Solution'a ekleme
dotnet sln add IntranetPortal.API/IntranetPortal.API.csproj
dotnet sln add IntranetPortal.Domain/IntranetPortal.Domain.csproj
dotnet sln add IntranetPortal.Application/IntranetPortal.Application.csproj
dotnet sln add IntranetPortal.Infrastructure/IntranetPortal.Infrastructure.csproj

# Proje referansları
cd IntranetPortal.API
dotnet add reference ../IntranetPortal.Application/IntranetPortal.Application.csproj

cd ../IntranetPortal.Application
dotnet add reference ../IntranetPortal.Domain/IntranetPortal.Domain.csproj

cd ../IntranetPortal.Infrastructure
dotnet add reference ../IntranetPortal.Domain/IntranetPortal.Domain.csproj
dotnet add reference ../IntranetPortal.Application/IntranetPortal.Application.csproj
```

#### 0.3. NuGet Paketleri
```bash
# Infrastructure katmanı
cd IntranetPortal.Infrastructure
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.Design

# API katmanı
cd ../IntranetPortal.API
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.PostgreSQL
dotnet add package BCrypt.Net-Next
dotnet add package Swashbuckle.AspNetCore
dotnet add package Microsoft.AspNetCore.RateLimiting

# Application katmanı
cd ../IntranetPortal.Application
dotnet add package FluentValidation.AspNetCore
dotnet add package AutoMapper
```

#### 0.4. PostgreSQL Database Oluşturma
```sql
-- psql -U postgres ile bağlan

CREATE DATABASE "IntranetDB"
    ENCODING 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C';

CREATE USER intranet_user WITH ENCRYPTED PASSWORD 'SecureP@ssw0rd!2025';
GRANT ALL PRIVILEGES ON DATABASE "IntranetDB" TO intranet_user;

\c IntranetDB
GRANT ALL ON SCHEMA public TO intranet_user;

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Frontend Kurulumu

#### 0.5. React + TypeScript + Vite Projesi
```bash
# Proje oluşturma
npm create vite@latest intranet-frontend -- --template react-ts

cd intranet-frontend
npm install

# Temel kütüphaneler
npm install react-router-dom
npm install @tanstack/react-query
npm install axios
npm install zustand
npm install react-hook-form
npm install zod

# UI Framework
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# UI Components (shadcn/ui)
npx shadcn-ui@latest init

# Icons
npm install lucide-react

# Dev dependencies
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D prettier eslint-config-prettier
```

#### 0.6. Dizin Yapısı
```
intranet-frontend/
├── src/
│   ├── features/
│   │   └── auth/          # Login, logout (FAZ 1'de)
│   ├── shared/
│   │   ├── components/    # Ortak UI bileşenleri
│   │   ├── layouts/       # Layout components
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Helper functions
│   ├── api/               # Axios client
│   ├── store/             # Zustand stores
│   ├── types/             # TypeScript types
│   ├── App.tsx
│   └── main.tsx
└── public/
```

### ✅ Tamamlanma Kriterleri (Faz 0)
- [ ] Backend solution derleniyor (`dotnet build`)
- [ ] PostgreSQL bağlantısı test edildi
- [ ] Frontend projeisi çalışıyor (`npm run dev`)
- [ ] Git repository oluşturuldu ve ilk commit yapıldı
- [ ] Dokümantasyon (ERD.md, TECH_STACK.md) okundu

**Tahmini Süre:** 3-5 gün

---

## Faz 1: Authentication & Core Infrastructure (Hafta 2-3)

### 🎯 Hedef
Kullanıcı kimlik doğrulama, JWT token sistemi ve RBAC altyapısını kurmak.

### Backend Geliştirme

#### 1.1. Domain Entities (Domain Katmanı)

**Dosya:** `IntranetPortal.Domain/Entities/User.cs`
```csharp
public class User
{
    public int UserID { get; set; }
    public string AdSoyad { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SifreHash { get; set; } = string.Empty;
    public string? Unvan { get; set; }
    public DateTime? SonGiris { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<UserBirimRole> UserBirimRoles { get; set; } = new List<UserBirimRole>();
    public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
}
```

**Benzer şekilde oluşturulacak entity'ler:**
- `Birim.cs`
- `Role.cs`
- `Permission.cs`
- `UserBirimRole.cs`
- `RolePermission.cs`
- `AuditLog.cs`

#### 1.2. DbContext (Infrastructure Katmanı)

**Dosya:** `IntranetPortal.Infrastructure/Data/ApplicationDbContext.cs`
```csharp
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Birim> Birimler { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Permission> Permissions { get; set; }
    public DbSet<UserBirimRole> UserBirimRoles { get; set; }
    public DbSet<RolePermission> RolePermissions { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Entity configurations
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
```

#### 1.3. Entity Configurations

**Dosya:** `IntranetPortal.Infrastructure/Configurations/UserConfiguration.cs`
```csharp
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("User");
        builder.HasKey(u => u.UserID);

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(150);

        builder.HasIndex(u => u.Email).IsUnique();
        builder.HasIndex(u => u.IsActive);
    }
}
```

**Benzer configuration'lar diğer entity'ler için de oluşturulacak.**

#### 1.4. Migration Oluşturma ve Uygulama
```bash
cd IntranetPortal.Infrastructure
dotnet ef migrations add InitialCreate --startup-project ../IntranetPortal.API
dotnet ef database update --startup-project ../IntranetPortal.API
```

#### 1.5. Seed Data (İlk Veriler)

**Dosya:** `IntranetPortal.Infrastructure/Data/DbInitializer.cs`
```csharp
public static class DbInitializer
{
    public static void Initialize(ApplicationDbContext context)
    {
        // Rolleri oluştur
        if (!context.Roles.Any())
        {
            var roles = new[]
            {
                new Role { RoleAdi = "SistemAdmin", Aciklama = "Tüm sistem yöneticisi" },
                new Role { RoleAdi = "BirimAdmin", Aciklama = "Birim yöneticisi" },
                new Role { RoleAdi = "BirimEditor", Aciklama = "İçerik ekleyen/güncelleyen" },
                new Role { RoleAdi = "BirimGoruntuleyen", Aciklama = "Sadece görüntüleme" }
            };
            context.Roles.AddRange(roles);
            context.SaveChanges();
        }

        // Permissions oluştur
        if (!context.Permissions.Any())
        {
            var permissions = new[]
            {
                new Permission { Action = "create", Resource = "user", Description = "Kullanıcı oluşturma" },
                new Permission { Action = "read", Resource = "user", Description = "Kullanıcı görüntüleme" },
                new Permission { Action = "update", Resource = "user", Description = "Kullanıcı güncelleme" },
                new Permission { Action = "delete", Resource = "user", Description = "Kullanıcı silme" },
                // ... diğer permissions
            };
            context.Permissions.AddRange(permissions);
            context.SaveChanges();
        }

        // İlk birim
        if (!context.Birimler.Any())
        {
            context.Birimler.Add(new Birim
            {
                BirimAdi = "Sistem Yönetimi",
                Aciklama = "Teknik yönetim birimi"
            });
            context.SaveChanges();
        }

        // İlk admin kullanıcı
        if (!context.Users.Any())
        {
            var adminUser = new User
            {
                AdSoyad = "Sistem Yöneticisi",
                Email = "admin@kurum.local",
                SifreHash = BCrypt.Net.BCrypt.HashPassword("Admin123!", 12),
                Unvan = "IT Müdürü",
                IsActive = true
            };
            context.Users.Add(adminUser);
            context.SaveChanges();

            // Admin'i Sistem Yönetimi birimine SistemAdmin rolü ile ata
            var sistemBirim = context.Birimler.First();
            var sistemAdminRole = context.Roles.First(r => r.RoleAdi == "SistemAdmin");

            context.UserBirimRoles.Add(new UserBirimRole
            {
                UserID = adminUser.UserID,
                BirimID = sistemBirim.BirimID,
                RoleID = sistemAdminRole.RoleID
            });
            context.SaveChanges();
        }
    }
}
```

#### 1.6. JWT Service (Application Katmanı)

**Dosya:** `IntranetPortal.Application/Services/JwtService.cs`
```csharp
public interface IJwtService
{
    string GenerateToken(User user, int birimId, string roleName);
    ClaimsPrincipal? ValidateToken(string token);
}

public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;

    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(User user, int birimId, string roleName)
    {
        var claims = new[]
        {
            new Claim("userId", user.UserID.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("birimId", birimId.ToString()),
            new Claim(ClaimTypes.Role, roleName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]!)
        );
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["JwtSettings:Issuer"],
            audience: _configuration["JwtSettings:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                int.Parse(_configuration["JwtSettings:ExpiryMinutes"]!)
            ),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public ClaimsPrincipal? ValidateToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]!);

        try
        {
            var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _configuration["JwtSettings:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["JwtSettings:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out _);

            return principal;
        }
        catch
        {
            return null;
        }
    }
}
```

#### 1.7. Authentication Service

**Dosya:** `IntranetPortal.Application/Services/AuthService.cs`
```csharp
public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task<bool> LogoutAsync(int userId);
}

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IJwtService _jwtService;
    private readonly IAuditLogService _auditLogService;

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        // 1. Kullanıcıyı bul
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);

        if (user == null)
            throw new UnauthorizedException("Geçersiz email veya şifre");

        // 2. Şifre kontrolü
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.SifreHash))
            throw new UnauthorizedException("Geçersiz email veya şifre");

        // 3. Kullanıcının birimlerini çek
        var userBirimRoles = await _context.UserBirimRoles
            .Include(ubr => ubr.Birim)
            .Include(ubr => ubr.Role)
            .Where(ubr => ubr.UserID == user.UserID)
            .ToListAsync();

        if (!userBirimRoles.Any())
            throw new UnauthorizedException("Kullanıcıya atanmış birim bulunamadı");

        // 4. Token oluştur (ilk birim için)
        var firstBirim = userBirimRoles.First();
        var token = _jwtService.GenerateToken(
            user,
            firstBirim.BirimID,
            firstBirim.Role.RoleAdi
        );

        // 5. Son giriş zamanını güncelle
        user.SonGiris = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // 6. Audit log
        await _auditLogService.LogAsync(
            user.UserID,
            firstBirim.BirimID,
            "Login",
            "Auth",
            request.IpAddress
        );

        return new LoginResponse
        {
            AccessToken = token,
            ExpiresIn = 28800, // 8 saat
            User = new UserDto
            {
                UserID = user.UserID,
                AdSoyad = user.AdSoyad,
                Email = user.Email,
                Unvan = user.Unvan
            },
            Birimleri = userBirimRoles.Select(ubr => new BirimRoleDto
            {
                BirimID = ubr.BirimID,
                BirimAdi = ubr.Birim.BirimAdi,
                RoleID = ubr.RoleID,
                RoleAdi = ubr.Role.RoleAdi
            }).ToList()
        };
    }
}
```

#### 1.8. IP Whitelist Middleware

**Dosya:** `IntranetPortal.API/Middleware/IPWhitelistMiddleware.cs`
```csharp
public class IPWhitelistMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<IPWhitelistMiddleware> _logger;
    private readonly string[] _allowedIPs;

    public IPWhitelistMiddleware(
        RequestDelegate next,
        ILogger<IPWhitelistMiddleware> logger,
        IConfiguration configuration)
    {
        _next = next;
        _logger = logger;
        _allowedIPs = configuration
            .GetSection("SecuritySettings:AllowedIPRanges")
            .Get<string[]>() ?? Array.Empty<string>();
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var remoteIP = context.Connection.RemoteIpAddress?.ToString();

        if (string.IsNullOrEmpty(remoteIP) || !IsIPAllowed(remoteIP))
        {
            _logger.LogWarning("IP engellendi: {IP}", remoteIP);
            context.Response.StatusCode = 403;
            await context.Response.WriteAsJsonAsync(new
            {
                success = false,
                error = new { code = "IP_BLOCKED", message = "Bu IP adresinden erişim izni yok" }
            });
            return;
        }

        await _next(context);
    }

    private bool IsIPAllowed(string ip)
    {
        // Geliştirme ortamı için localhost bypass
        if (ip == "::1" || ip == "127.0.0.1")
            return true;

        // CIDR kontrolü yapılacak (NetTopologySuite kullanılabilir)
        // Şimdilik basit string comparison
        return _allowedIPs.Any(allowedIP =>
            allowedIP == ip || ip.StartsWith(allowedIP.Split('/')[0])
        );
    }
}
```

#### 1.9. Auth Controller

**Dosya:** `IntranetPortal.API/Controllers/AuthController.cs`
```csharp
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    [HttpPost("login")]
    [EnableRateLimiting("login")] // Rate limiting
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        request.IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var response = await _authService.LoginAsync(request);

        return Ok(new
        {
            success = true,
            data = response
        });
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        var userId = int.Parse(User.FindFirst("userId")!.Value);
        await _authService.LogoutAsync(userId);

        return Ok(new
        {
            success = true,
            message = "Çıkış başarılı"
        });
    }
}
```

#### 1.10. Program.cs Yapılandırması

**Dosya:** `IntranetPortal.API/Program.cs`
```csharp
var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]!)
            ),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("login", opt =>
    {
        opt.Window = TimeSpan.FromMinutes(1);
        opt.PermitLimit = 5;
        opt.QueueLimit = 0;
    });
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("IntranetPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Services
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAuditLogService, AuditLogService>();

// Serilog
builder.Host.UseSerilog((context, config) =>
{
    config.ReadFrom.Configuration(context.Configuration);
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Seed data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    DbInitializer.Initialize(context);
}

// Middleware pipeline
app.UseMiddleware<IPWhitelistMiddleware>();
app.UseCors("IntranetPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();
app.MapControllers();

app.Run();
```

### Frontend Geliştirme

#### 1.11. API Client (Axios)

**Dosya:** `src/api/axiosClient.ts`
```typescript
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Token ekleme
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Hata yakalama
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
```

#### 1.12. Auth Store (Zustand)

**Dosya:** `src/store/authStore.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  userId: number;
  adSoyad: string;
  email: string;
  unvan?: string;
}

interface BirimRole {
  birimId: number;
  birimAdi: string;
  roleId: number;
  roleAdi: string;
}

interface AuthState {
  user: User | null;
  birimleri: BirimRole[];
  selectedBirim: BirimRole | null;
  accessToken: string | null;

  setAuth: (user: User, birimleri: BirimRole[], token: string) => void;
  selectBirim: (birim: BirimRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      birimleri: [],
      selectedBirim: null,
      accessToken: null,

      setAuth: (user, birimleri, token) => {
        localStorage.setItem('accessToken', token);
        set({ user, birimleri, accessToken: token });
      },

      selectBirim: (birim) => set({ selectedBirim: birim }),

      logout: () => {
        localStorage.removeItem('accessToken');
        set({ user: null, birimleri: [], selectedBirim: null, accessToken: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

#### 1.13. Login Page

**Dosya:** `src/features/auth/LoginPage.tsx`
```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '@/api/axiosClient';
import { useAuthStore } from '@/store/authStore';

const loginSchema = z.object({
  email: z.string().email('Geçerli bir email giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');

    try {
      const response = await axiosClient.post('/auth/login', data);
      const { accessToken, user, birimleri } = response.data.data;

      setAuth(user, birimleri, accessToken);

      // Çok birimli kullanıcı ise seçim ekranına yönlendir
      if (birimleri.length > 1) {
        navigate('/select-unit');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Kurumsal İntranet Girişi
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Şifre
            </label>
            <input
              type="password"
              {...register('password')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
};
```

### ✅ Tamamlanma Kriterleri (Faz 1)
- [ ] PostgreSQL'de tüm temel tablolar oluşturuldu
- [ ] İlk admin kullanıcı seed edildi (admin@kurum.local / Admin123!)
- [ ] Login endpoint çalışıyor ve JWT token dönüyor
- [ ] Frontend login sayfası backend ile entegre
- [ ] IP whitelist middleware aktif
- [ ] Rate limiting (5 deneme/dakika) çalışıyor
- [ ] Postman ile API testleri başarılı

**Tahmini Süre:** 7-10 gün

---

## Faz 2: RBAC Implementation & Admin Panel (Hafta 4-6)

### 🎯 Hedef
Rol bazlı yetkilendirme sistemini tamamlamak ve admin dashboard'u oluşturmak.

### Backend Geliştirme

#### 2.1. Custom Authorization Attribute

**Dosya:** `IntranetPortal.API/Filters/HasPermissionAttribute.cs`
```csharp
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
public class HasPermissionAttribute : Attribute, IAsyncAuthorizationFilter
{
    private readonly string _permission;

    public HasPermissionAttribute(string permission)
    {
        _permission = permission;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;

        if (!user.Identity?.IsAuthenticated ?? true)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        var userId = int.Parse(user.FindFirst("userId")!.Value);
        var birimId = int.Parse(user.FindFirst("birimId")!.Value);

        var dbContext = context.HttpContext.RequestServices
            .GetRequiredService<ApplicationDbContext>();

        // Kullanıcının bu birimdeki rolünü bul
        var userRole = await dbContext.UserBirimRoles
            .Include(ubr => ubr.Role)
                .ThenInclude(r => r.RolePermissions)
                    .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(ubr =>
                ubr.UserID == userId && ubr.BirimID == birimId);

        if (userRole == null)
        {
            context.Result = new ForbidResult();
            return;
        }

        // Yetkiyi kontrol et
        var hasPermission = userRole.Role.RolePermissions
            .Any(rp => $"{rp.Permission.Action}.{rp.Permission.Resource}" == _permission);

        if (!hasPermission)
        {
            context.Result = new ForbidResult();
            return;
        }
    }
}
```

#### 2.2. User Management Service

**Dosya:** `IntranetPortal.Application/Services/UserService.cs`
```csharp
public interface IUserService
{
    Task<PaginatedResult<UserDto>> GetUsersAsync(UserFilterDto filter);
    Task<UserDetailDto> GetUserByIdAsync(int userId);
    Task<UserDto> CreateUserAsync(CreateUserDto dto);
    Task UpdateUserAsync(int userId, UpdateUserDto dto);
    Task DeleteUserAsync(int userId);
    Task AssignUserToBirimAsync(int userId, AssignBirimDto dto);
}

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;
    private readonly IAuditLogService _auditLogService;

    public async Task<UserDto> CreateUserAsync(CreateUserDto dto)
    {
        // Email unique kontrolü
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            throw new BadRequestException("Bu email adresi zaten kullanılıyor");

        var user = new User
        {
            AdSoyad = dto.AdSoyad,
            Email = dto.Email,
            SifreHash = BCrypt.Net.BCrypt.HashPassword(dto.Password, 12),
            Unvan = dto.Unvan,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Birim ve rol atamalarını yap
        foreach (var birimRole in dto.BirimRolleri)
        {
            _context.UserBirimRoles.Add(new UserBirimRole
            {
                UserID = user.UserID,
                BirimID = birimRole.BirimId,
                RoleID = birimRole.RoleId
            });
        }
        await _context.SaveChangesAsync();

        // Audit log
        await _auditLogService.LogAsync(
            GetCurrentUserId(),
            GetCurrentBirimId(),
            "CreateUser",
            "User",
            details: new { targetUserId = user.UserID, email = user.Email }
        );

        return MapToDto(user);
    }
}
```

#### 2.3. Admin Controllers

**User Controller:**
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    [HttpGet]
    [HasPermission("read.user")]
    public async Task<IActionResult> GetUsers([FromQuery] UserFilterDto filter)
    {
        var result = await _userService.GetUsersAsync(filter);
        return Ok(new { success = true, data = result });
    }

    [HttpGet("{id}")]
    [HasPermission("read.user")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        return Ok(new { success = true, data = user });
    }

    [HttpPost]
    [HasPermission("create.user")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
    {
        var user = await _userService.CreateUserAsync(dto);
        return CreatedAtAction(nameof(GetUser), new { id = user.UserID },
            new { success = true, data = user });
    }

    [HttpPut("{id}")]
    [HasPermission("update.user")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
    {
        await _userService.UpdateUserAsync(id, dto);
        return Ok(new { success = true, message = "Kullanıcı güncellendi" });
    }

    [HttpDelete("{id}")]
    [HasPermission("delete.user")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        await _userService.DeleteUserAsync(id);
        return Ok(new { success = true, message = "Kullanıcı pasife alındı" });
    }
}
```

**Benzer şekilde:**
- `BirimlerController` (Birim CRUD)
- `RolesController` (Rol ve permission CRUD)
- `AuditLogsController` (Log görüntüleme)

### Frontend Geliştirme

#### 2.4. Admin Layout

**Dosya:** `src/shared/layouts/AdminLayout.tsx`
```typescript
import { Outlet, NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Users, Building2, Shield, FileText, LogOut } from 'lucide-react';

export const AdminLayout = () => {
  const { user, selectedBirim, logout } = useAuthStore();

  const menuItems = [
    { to: '/admin/users', icon: Users, label: 'Kullanıcılar', permission: 'read.user' },
    { to: '/admin/birimler', icon: Building2, label: 'Birimler', permission: 'read.birim' },
    { to: '/admin/roles', icon: Shield, label: 'Roller', permission: 'read.role' },
    { to: '/admin/logs', icon: FileText, label: 'Audit Logları', permission: 'read.auditlog' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold">İntranet Admin</h1>
          <p className="text-sm text-gray-600">{selectedBirim?.birimAdi}</p>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};
```

#### 2.5. User Management Page

**Dosya:** `src/features/admin/users/UsersPage.tsx`
```typescript
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/api/axiosClient';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, searchTerm],
    queryFn: async () => {
      const response = await axiosClient.get('/users', {
        params: { page, pageSize: 20, search: searchTerm }
      });
      return response.data.data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kullanıcı Yönetimi</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Yeni Kullanıcı
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Kullanıcı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-96"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ad Soyad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ünvan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Durum
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.items.map((user: any) => (
                <tr key={user.userId}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.adSoyad}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.unvan}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="w-4 h-4 inline" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Toplam {data?.totalCount} kullanıcı
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Önceki
            </button>
            <button
              disabled={page >= (data?.totalPages || 1)}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Sonraki
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### ✅ Tamamlanma Kriterleri (Faz 2)
- [ ] `[HasPermission]` attribute çalışıyor
- [ ] Kullanıcı CRUD işlemleri tamamlandı (API + UI)
- [ ] Birim CRUD işlemleri tamamlandı
- [ ] Rol yönetimi çalışıyor
- [ ] Admin dashboard layout oluşturuldu
- [ ] Kullanıcı listesi, arama ve pagination çalışıyor
- [ ] Audit log yazılıyor ve görüntülenebiliyor

**Tahmini Süre:** 12-15 gün

---

## Faz 3: Multi-Unit Support & Unit Selection (Hafta 7-8)

### 🎯 Hedef
Çok birimli kullanıcı desteğini tamamlamak ve birim seçim ekranını oluşturmak.

### Backend Geliştirme

#### 3.1. Unit Switch Endpoint

**Dosya:** `IntranetPortal.API/Controllers/AuthController.cs`
```csharp
[HttpPost("switch-unit")]
[Authorize]
public async Task<IActionResult> SwitchUnit([FromBody] SwitchUnitRequest request)
{
    var userId = int.Parse(User.FindFirst("userId")!.Value);

    // Kullanıcının bu birimde yetkisi var mı kontrol et
    var userBirimRole = await _context.UserBirimRoles
        .Include(ubr => ubr.Birim)
        .Include(ubr => ubr.Role)
        .FirstOrDefaultAsync(ubr =>
            ubr.UserID == userId && ubr.BirimID == request.BirimId);

    if (userBirimRole == null)
        return Forbid();

    // Yeni token oluştur
    var user = await _context.Users.FindAsync(userId);
    var newToken = _jwtService.GenerateToken(
        user!,
        userBirimRole.BirimID,
        userBirimRole.Role.RoleAdi
    );

    return Ok(new
    {
        success = true,
        data = new
        {
            accessToken = newToken,
            selectedBirim = new
            {
                birimId = userBirimRole.BirimID,
                birimAdi = userBirimRole.Birim.BirimAdi,
                roleAdi = userBirimRole.Role.RoleAdi
            }
        }
    });
}
```

### Frontend Geliştirme

#### 3.2. Unit Selection Page

**Dosya:** `src/features/auth/SelectUnitPage.tsx`
```typescript
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Building2, ArrowRight } from 'lucide-react';
import axiosClient from '@/api/axiosClient';

export const SelectUnitPage = () => {
  const navigate = useNavigate();
  const { birimleri, selectBirim, setAuth, user } = useAuthStore();

  const handleSelectUnit = async (birim: any) => {
    try {
      // Backend'den yeni token al
      const response = await axiosClient.post('/auth/switch-unit', {
        birimId: birim.birimId
      });

      const { accessToken, selectedBirim } = response.data.data;

      // Token'ı güncelle
      localStorage.setItem('accessToken', accessToken);
      setAuth(user!, birimleri, accessToken);
      selectBirim(birim);

      navigate('/dashboard');
    } catch (error) {
      console.error('Birim seçimi başarısız:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-2">
          Birim Seçimi
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Lütfen giriş yapmak istediğiniz birimi seçiniz
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {birimleri.map((birim) => (
            <button
              key={birim.birimId}
              onClick={() => handleSelectUnit(birim)}
              className="p-6 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{birim.birimAdi}</h3>
                    <p className="text-sm text-gray-600">{birim.roleAdi}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
```

#### 3.3. Protected Route Component

**Dosya:** `src/components/ProtectedRoute.tsx`
```typescript
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export const ProtectedRoute = ({ children, requiredPermission }: ProtectedRouteProps) => {
  const { user, selectedBirim } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!selectedBirim) {
    return <Navigate to="/select-unit" replace />;
  }

  // TODO: Permission check (backend'den permission listesi çekilmeli)
  // if (requiredPermission && !hasPermission(requiredPermission)) {
  //   return <Navigate to="/forbidden" replace />;
  // }

  return <>{children}</>;
};
```

#### 3.4. Router Configuration

**Dosya:** `src/App.tsx`
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from '@/features/auth/LoginPage';
import { SelectUnitPage } from '@/features/auth/SelectUnitPage';
import { AdminLayout } from '@/shared/layouts/AdminLayout';
import { UsersPage } from '@/features/admin/users/UsersPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/select-unit" element={<SelectUnitPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="users" element={<UsersPage />} />
            <Route path="birimler" element={<div>Birimler</div>} />
            <Route path="roles" element={<div>Roller</div>} />
            <Route path="logs" element={<div>Audit Logları</div>} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
```

### ✅ Tamamlanma Kriterleri (Faz 3)
- [ ] Birim değiştirme endpoint'i çalışıyor
- [ ] Çok birimli kullanıcı login sonrası birim seçim ekranını görüyor
- [ ] Seçilen birime göre yeni token alınıyor
- [ ] Protected route component çalışıyor
- [ ] Birim değişimi ≤ 1 saniye sürüyor
- [ ] Her birimde farklı menü yapısı gösteriliyor (hazırlık)

**Tahmini Süre:** 5-7 gün

---

## Faz 4: İlk Birim Modülü - İnsan Kaynakları (Hafta 9-10)

### 🎯 Hedef
İlk fonksiyonel birim modülünü (İK) oluşturmak ve modüler yapıyı kanıtlamak.

### Backend Geliştirme

#### 4.1. İK Specific Tables Migration

```sql
-- İK_Personel tablosu
CREATE TABLE "IK_Personel" (
    "PersonelID" SERIAL PRIMARY KEY,
    "UserID" INTEGER REFERENCES "User"("UserID"),
    "SicilNo" VARCHAR(20) UNIQUE NOT NULL,
    "Departman" VARCHAR(100),
    "IseGirisTarihi" DATE,
    "Maas" DECIMAL(10,2),
    "TelefonNo" VARCHAR(20),
    "Adres" TEXT,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İK_IzinTalep tablosu
CREATE TABLE "IK_IzinTalep" (
    "TalepID" SERIAL PRIMARY KEY,
    "PersonelID" INTEGER REFERENCES "IK_Personel"("PersonelID"),
    "IzinTipi" VARCHAR(50), -- Yıllık, Mazeret, Rapor
    "BaslangicTarihi" DATE NOT NULL,
    "BitisTarihi" DATE NOT NULL,
    "Aciklama" TEXT,
    "Durum" VARCHAR(20) DEFAULT 'Bekliyor', -- Bekliyor, Onaylandi, Reddedildi
    "OnaylayanUserID" INTEGER REFERENCES "User"("UserID"),
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İK_Duyuru tablosu
CREATE TABLE "IK_Duyuru" (
    "DuyuruID" SERIAL PRIMARY KEY,
    "Baslik" VARCHAR(200) NOT NULL,
    "Icerik" TEXT NOT NULL,
    "OlusturanUserID" INTEGER REFERENCES "User"("UserID"),
    "IsPinned" BOOLEAN DEFAULT FALSE,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.2. İK Service

**Dosya:** `IntranetPortal.Application/Services/IKService.cs`
```csharp
public interface IIKService
{
    Task<List<PersonelDto>> GetPersonelListAsync();
    Task<PersonelDetailDto> GetPersonelByIdAsync(int personelId);
    Task<PersonelDto> CreatePersonelAsync(CreatePersonelDto dto);
    Task<List<IzinTalepDto>> GetIzinTalepleriAsync(IzinFilterDto filter);
    Task<IzinTalepDto> CreateIzinTalepAsync(CreateIzinTalepDto dto);
    Task ApproveIzinTalepAsync(int talepId, int onaylayanUserId);
}

public class IKService : IIKService
{
    private readonly ApplicationDbContext _context;
    private readonly IAuditLogService _auditLogService;

    public async Task<PersonelDto> CreatePersonelAsync(CreatePersonelDto dto)
    {
        var personel = new IK_Personel
        {
            UserID = dto.UserID,
            SicilNo = dto.SicilNo,
            Departman = dto.Departman,
            IseGirisTarihi = dto.IseGirisTarihi,
            Maas = dto.Maas,
            TelefonNo = dto.TelefonNo,
            Adres = dto.Adres
        };

        _context.IK_Personel.Add(personel);
        await _context.SaveChangesAsync();

        await _auditLogService.LogAsync(
            GetCurrentUserId(),
            GetCurrentBirimId(), // İK BirimID
            "CreatePersonel",
            "IK_Personel",
            details: new { personelId = personel.PersonelID, sicilNo = personel.SicilNo }
        );

        return MapToDto(personel);
    }

    public async Task<IzinTalepDto> CreateIzinTalepAsync(CreateIzinTalepDto dto)
    {
        var talep = new IK_IzinTalep
        {
            PersonelID = dto.PersonelID,
            IzinTipi = dto.IzinTipi,
            BaslangicTarihi = dto.BaslangicTarihi,
            BitisTarihi = dto.BitisTarihi,
            Aciklama = dto.Aciklama,
            Durum = "Bekliyor"
        };

        _context.IK_IzinTalep.Add(talep);
        await _context.SaveChangesAsync();

        return MapToDto(talep);
    }
}
```

#### 4.3. İK Controller

**Dosya:** `IntranetPortal.API/Controllers/IKController.cs`
```csharp
[ApiController]
[Route("api/ik")]
[Authorize]
public class IKController : ControllerBase
{
    private readonly IIKService _ikService;

    [HttpGet("personel")]
    [HasPermission("read.ik.personel")]
    public async Task<IActionResult> GetPersonelList()
    {
        var personeller = await _ikService.GetPersonelListAsync();
        return Ok(new { success = true, data = personeller });
    }

    [HttpPost("personel")]
    [HasPermission("create.ik.personel")]
    public async Task<IActionResult> CreatePersonel([FromBody] CreatePersonelDto dto)
    {
        var personel = await _ikService.CreatePersonelAsync(dto);
        return CreatedAtAction(nameof(GetPersonelList),
            new { success = true, data = personel });
    }

    [HttpGet("izin-talepleri")]
    [HasPermission("read.ik.izin")]
    public async Task<IActionResult> GetIzinTalepleri([FromQuery] IzinFilterDto filter)
    {
        var talepler = await _ikService.GetIzinTalepleriAsync(filter);
        return Ok(new { success = true, data = talepler });
    }

    [HttpPost("izin-talepleri")]
    [HasPermission("create.ik.izin")]
    public async Task<IActionResult> CreateIzinTalep([FromBody] CreateIzinTalepDto dto)
    {
        var talep = await _ikService.CreateIzinTalepAsync(dto);
        return CreatedAtAction(nameof(GetIzinTalepleri),
            new { success = true, data = talep });
    }

    [HttpPost("izin-talepleri/{id}/approve")]
    [HasPermission("approve.ik.izin")]
    public async Task<IActionResult> ApproveIzinTalep(int id)
    {
        var userId = int.Parse(User.FindFirst("userId")!.Value);
        await _ikService.ApproveIzinTalepAsync(id, userId);
        return Ok(new { success = true, message = "İzin talebi onaylandı" });
    }
}
```

### Frontend Geliştirme

#### 4.4. İK Module Structure

```
src/features/hr/
├── components/
│   ├── PersonelCard.tsx
│   ├── IzinTalepForm.tsx
│   └── IzinTalepList.tsx
├── pages/
│   ├── PersonelListPage.tsx
│   ├── IzinTalepleriPage.tsx
│   └── DuyurularPage.tsx
├── hooks/
│   ├── usePersonel.ts
│   └── useIzinTalepleri.ts
└── types/
    └── hr.types.ts
```

#### 4.5. Personel List Page

**Dosya:** `src/features/hr/pages/PersonelListPage.tsx`
```typescript
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/api/axiosClient';
import { Users, UserPlus, Search } from 'lucide-react';

export const PersonelListPage = () => {
  const { data: personeller, isLoading } = useQuery({
    queryKey: ['personel'],
    queryFn: async () => {
      const response = await axiosClient.get('/ik/personel');
      return response.data.data;
    },
  });

  if (isLoading) return <div>Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Personel Listesi</h2>
          <p className="text-gray-600">Tüm personel kayıtları</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Yeni Personel
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Sicil No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ad Soyad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Departman
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                İşe Giriş
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Telefon
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {personeller?.map((personel: any) => (
              <tr key={personel.personelId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {personel.sicilNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {personel.user?.adSoyad}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {personel.departman}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {new Date(personel.iseGirisTarihi).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {personel.telefonNo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

### ✅ Tamamlanma Kriterleri (Faz 4)
- [ ] İK birim tabloları oluşturuldu
- [ ] İK permissions ve roller tanımlandı
- [ ] Personel listesi API ve UI çalışıyor
- [ ] İzin talep oluşturma çalışıyor
- [ ] İzin talep onaylama çalışıyor
- [ ] İK modülü lazy loading ile yükleniyor
- [ ] Modüler yapı doğrulandı

**Tahmini Süre:** 8-10 gün

---

## Faz 5: İkinci Birim Modülü & Deployment (Hafta 11-13)

### 🎯 Hedef
İkinci birim modülünü (Bilgi İşlem) eklemek ve deployment hazırlığı yapmak.

### 5.1. Bilgi İşlem Modülü

**IT Specific Tables:**
```sql
-- IT_ArizaKayit
CREATE TABLE "IT_ArizaKayit" (
    "ArizaID" SERIAL PRIMARY KEY,
    "OlusturanUserID" INTEGER REFERENCES "User"("UserID"),
    "Konu" VARCHAR(200) NOT NULL,
    "Aciklama" TEXT NOT NULL,
    "Oncelik" VARCHAR(20) DEFAULT 'Normal', -- Düşük, Normal, Yüksek, Acil
    "Durum" VARCHAR(20) DEFAULT 'Açık', -- Açık, Devam Ediyor, Çözüldü, Kapatıldı
    "AtananUserID" INTEGER REFERENCES "User"("UserID"),
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- IT_Envanter
CREATE TABLE "IT_Envanter" (
    "EnvanterID" SERIAL PRIMARY KEY,
    "CihazTipi" VARCHAR(50), -- Bilgisayar, Yazıcı, Switch, vb.
    "Marka" VARCHAR(100),
    "Model" VARCHAR(100),
    "SeriNo" VARCHAR(100) UNIQUE,
    "AtananUserID" INTEGER REFERENCES "User"("UserID"),
    "SatinAlmaTarihi" DATE,
    "Durum" VARCHAR(20) DEFAULT 'Aktif', -- Aktif, Arızalı, Atıl
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Backend Implementation:**
- ITService
- ITController (`/api/it/*` endpoints)
- Arıza kaydı oluşturma, atama, güncelleme
- Envanter listesi ve yönetimi

**Frontend Implementation:**
- `src/features/it/` modülü
- Arıza takip sayfası
- Envanter yönetimi sayfası

### 5.2. Docker Deployment Hazırlığı

#### Backend Dockerfile

**Dosya:** `IntranetPortal/Dockerfile`
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["IntranetPortal.API/IntranetPortal.API.csproj", "IntranetPortal.API/"]
COPY ["IntranetPortal.Application/IntranetPortal.Application.csproj", "IntranetPortal.Application/"]
COPY ["IntranetPortal.Domain/IntranetPortal.Domain.csproj", "IntranetPortal.Domain/"]
COPY ["IntranetPortal.Infrastructure/IntranetPortal.Infrastructure.csproj", "IntranetPortal.Infrastructure/"]

RUN dotnet restore "IntranetPortal.API/IntranetPortal.API.csproj"
COPY . .
WORKDIR "/src/IntranetPortal.API"
RUN dotnet build "IntranetPortal.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "IntranetPortal.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

RUN useradd -m appuser && chown -R appuser /app
USER appuser

ENTRYPOINT ["dotnet", "IntranetPortal.API.dll"]
```

#### Frontend Dockerfile

**Dosya:** `intranet-frontend/Dockerfile`
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chown -R nginx:nginx /usr/share/nginx/html
USER nginx

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose.yml

**Dosya:** `docker-compose.yml`
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: intranet-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: IntranetDB
      POSTGRES_USER: intranet_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - intranet-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U intranet_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./IntranetPortal
      dockerfile: Dockerfile
    container_name: intranet-api
    restart: unless-stopped
    environment:
      ASPNETCORE_ENVIRONMENT: Production
      ASPNETCORE_URLS: http://+:80
      ConnectionStrings__DefaultConnection: "Host=postgres;Port=5432;Database=IntranetDB;Username=intranet_user;Password=${DB_PASSWORD}"
      JwtSettings__SecretKey: ${JWT_SECRET}
      JwtSettings__ExpiryMinutes: 480
      SecuritySettings__EnableIPWhitelist: "false"
    ports:
      - "5000:80"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - intranet-network

  frontend:
    build:
      context: ./intranet-frontend
      dockerfile: Dockerfile
    container_name: intranet-frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - intranet-network

volumes:
  postgres_data:

networks:
  intranet-network:
    driver: bridge
```

**.env file:**
```env
DB_PASSWORD=SecureP@ssw0rd!2025
JWT_SECRET=Kurumsal-Intranet-2025-Secret-Key-Min-32-Characters-Long!
```

### 5.3. Production appsettings

**Dosya:** `IntranetPortal.API/appsettings.Production.json`
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=postgres;Port=5432;Database=IntranetDB;Username=intranet_user;Password=SecureP@ssw0rd!2025"
  },
  "JwtSettings": {
    "SecretKey": "Production-Secret-Key-Min-32-Chars!",
    "Issuer": "IntranetPortal",
    "Audience": "IntranetUsers",
    "ExpiryMinutes": 480
  },
  "SecuritySettings": {
    "AllowedIPRanges": [
      "192.168.1.0/24",
      "10.0.0.0/16"
    ],
    "EnableIPWhitelist": true
  },
  "Serilog": {
    "MinimumLevel": {
      "Default": "Warning",
      "Override": {
        "Microsoft": "Warning",
        "System": "Warning"
      }
    },
    "WriteTo": [
      {
        "Name": "PostgreSQL",
        "Args": {
          "connectionString": "Host=postgres;Port=5432;Database=IntranetDB;Username=intranet_user;Password=SecureP@ssw0rd!2025",
          "tableName": "AuditLog",
          "needAutoCreateTable": true
        }
      }
    ]
  }
}
```

### ✅ Tamamlanma Kriterleri (Faz 5)
- [ ] IT modülü tamamlandı (arıza kayıt + envanter)
- [ ] Docker Compose ile sistem çalışıyor
- [ ] Production environment variables yapılandırıldı
- [ ] Database migration production'da uygulanabiliyor
- [ ] Frontend production build çalışıyor
- [ ] SSL sertifikası yapılandırıldı (self-signed)

**Tahmini Süre:** 10-12 gün

---

## Faz 6: Testing, Optimization & Documentation (Hafta 14-16)

### 🎯 Hedef
Sistem testlerini tamamlamak, performans optimizasyonu yapmak ve dokümantasyonu güncellemek.

### 6.1. Backend Testing

#### Unit Tests (xUnit)

**Dosya:** `IntranetPortal.Tests/Services/AuthServiceTests.cs`
```csharp
public class AuthServiceTests
{
    private readonly Mock<ApplicationDbContext> _mockContext;
    private readonly Mock<IJwtService> _mockJwtService;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _mockContext = new Mock<ApplicationDbContext>();
        _mockJwtService = new Mock<IJwtService>();
        _authService = new AuthService(_mockContext.Object, _mockJwtService.Object);
    }

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsToken()
    {
        // Arrange
        var user = new User
        {
            UserID = 1,
            Email = "test@kurum.local",
            SifreHash = BCrypt.Net.BCrypt.HashPassword("password", 12),
            IsActive = true
        };

        _mockContext.Setup(x => x.Users.FirstOrDefaultAsync(It.IsAny<Expression<Func<User, bool>>>()))
            .ReturnsAsync(user);

        var request = new LoginRequest
        {
            Email = "test@kurum.local",
            Password = "password"
        };

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.NotEmpty(result.AccessToken);
        Assert.Equal(user.Email, result.User.Email);
    }

    [Fact]
    public async Task LoginAsync_InvalidPassword_ThrowsException()
    {
        // Arrange & Act & Assert
        // ...
    }
}
```

### 6.2. Performance Testing

#### Load Testing (JMeter veya k6)

**test-plan.jmx öğeleri:**
- Login endpoint: 200 concurrent users
- User list endpoint: 100 concurrent users
- Personel list endpoint: 50 concurrent users

**Beklenen sonuçlar:**
- Login: < 500ms (95th percentile)
- User list: < 200ms (95th percentile)
- Portal load: < 2 seconds

### 6.3. Database Optimization

```sql
-- Critical indexes
CREATE INDEX CONCURRENTLY idx_user_email ON "User"("Email");
CREATE INDEX CONCURRENTLY idx_user_active ON "User"("IsActive");
CREATE INDEX CONCURRENTLY idx_ubr_user_birim ON "UserBirimRole"("UserID", "BirimID");
CREATE INDEX CONCURRENTLY idx_rp_role ON "RolePermission"("RoleID");
CREATE INDEX CONCURRENTLY idx_auditlog_user ON "AuditLog"("UserID");
CREATE INDEX CONCURRENTLY idx_auditlog_date ON "AuditLog"("TarihSaat" DESC);

-- Analyze tables
ANALYZE "User";
ANALYZE "UserBirimRole";
ANALYZE "RolePermission";
ANALYZE "AuditLog";
```

### 6.4. Frontend Optimization

**Vite Build Optimization:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', '@radix-ui/react-dialog'],
          'query-vendor': ['@tanstack/react-query', 'axios', 'zustand'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

**Lazy Loading Components:**
```typescript
const UsersPage = lazy(() => import('@/features/admin/users/UsersPage'));
const PersonelPage = lazy(() => import('@/features/hr/pages/PersonelListPage'));
const ITPage = lazy(() => import('@/features/it/pages/ArizaListPage'));
```

### 6.5. Security Audit

**Kontrol Listesi:**
- [ ] SQL Injection koruması (parametreli sorgular)
- [ ] XSS koruması (input sanitization)
- [ ] CSRF koruması (SameSite cookies)
- [ ] Rate limiting çalışıyor
- [ ] JWT token güvenli (secret key 256-bit)
- [ ] BCrypt work factor ≥ 12
- [ ] HTTPS zorunlu
- [ ] IP whitelist aktif
- [ ] Sensitive data şifrelenmiş (AES-256)
- [ ] Audit log tam ve doğru

### 6.6. Documentation Updates

**Güncellenecek dokümanlar:**
- README.md (kurulum talimatları)
- API_SPECIFICATION.md (tüm endpoint'ler)
- DEPLOYMENT_GUIDE.md (production deployment)
- User manual (Türkçe kullanıcı kılavuzu)

### ✅ Tamamlanma Kriterleri (Faz 6)
- [ ] Unit test coverage ≥ 70%
- [ ] Load test başarılı (200 concurrent users)
- [ ] Performance targets karşılandı
- [ ] Security audit tamamlandı
- [ ] Database optimized
- [ ] Frontend bundle size < 500KB (gzipped)
- [ ] Tüm dokümantasyon güncellendi
- [ ] Production deployment başarılı

**Tahmini Süre:** 10-15 gün

---

## Genel Timeline ve Milestone'lar

### Timeline Özeti

| Faz | İçerik | Süre | Kümülatif |
|-----|--------|------|-----------|
| Faz 0 | Proje Kurulumu | 3-5 gün | 5 gün |
| Faz 1 | Auth & Core Infrastructure | 7-10 gün | 15 gün |
| Faz 2 | RBAC & Admin Panel | 12-15 gün | 30 gün |
| Faz 3 | Multi-Unit Support | 5-7 gün | 37 gün |
| Faz 4 | İK Modülü | 8-10 gün | 47 gün |
| Faz 5 | IT Modülü & Deployment | 10-12 gün | 59 gün |
| Faz 6 | Testing & Optimization | 10-15 gün | 74 gün |

**Toplam Tahmini Süre:** 12-16 hafta (3-4 ay)

### Major Milestones

**M1 - Faz 1 Tamamlandı (Hafta 3)**
- ✅ Kullanıcı girişi çalışıyor
- ✅ JWT authentication aktif
- ✅ Database schema oluşturuldu

**M2 - Faz 2 Tamamlandı (Hafta 6)**
- ✅ RBAC sistemi çalışıyor
- ✅ Admin dashboard fonksiyonel
- ✅ Kullanıcı yönetimi tamamlandı

**M3 - Faz 3 Tamamlandı (Hafta 8)**
- ✅ Multi-unit support çalışıyor
- ✅ Birim seçim ekranı aktif

**M4 - Faz 4 Tamamlandı (Hafta 10)**
- ✅ İlk birim modülü (İK) tamamlandı
- ✅ Modüler yapı doğrulandı

**M5 - Faz 5 Tamamlandı (Hafta 13)**
- ✅ İkinci birim modülü (IT) tamamlandı
- ✅ Docker deployment hazır
- ✅ Production environment kuruldu

**M6 - PRODUCTION READY (Hafta 16)**
- ✅ Tüm testler başarılı
- ✅ Performance targets karşılandı
- ✅ Security audit tamamlandı
- ✅ Dokümantasyon tamamlandı

---

## Risk Yönetimi

### Yüksek Riskler

| Risk | Etki | Olasılık | Azaltma Stratejisi |
|------|------|----------|---------------------|
| RBAC karmaşıklığı | Yüksek | Orta | Erken fazlarda test, detaylı dokümantasyon |
| Performance hedefleri | Yüksek | Orta | Her fazda load testing, optimizasyon |
| Multi-unit bugs | Orta | Yüksek | Kapsamlı test senaryoları, edge case testleri |
| Deployment sorunları | Orta | Orta | Docker kullanımı, staging ortamı |

### Teknik Borç Önleme

- Her faz sonunda code review
- Düzenli refactoring
- Test coverage takibi
- Dokümantasyon güncel tutulması

---

## Başarı Kriterleri

### Fonksiyonel Gereksinimler
- ✅ Tüm PRD'deki fonksiyonel gereksinimler karşılandı
- ✅ En az 2 birim modülü çalışır durumda
- ✅ Admin paneli tam fonksiyonel
- ✅ RBAC sistemi çalışıyor ve test edildi

### Non-Functional Gereksinimler
- ✅ 100-200 eşzamanlı kullanıcı desteği
- ✅ Portal açılış ≤ 2 saniye
- ✅ API yanıt süresi ≤ 200ms
- ✅ Birim geçişi ≤ 1 saniye
- ✅ %99 uptime

### Güvenlik
- ✅ Tüm güvenlik kontrolleri aktif
- ✅ Penetration test başarılı
- ✅ Audit log çalışıyor

### Deployment
- ✅ Docker ile tek komut deployment
- ✅ Windows ve Linux uyumlu
- ✅ Production ortamı stabil

---

## Sonraki Adımlar (Post-Launch)

### Faz 7+: Ek Birim Modülleri
- İdari İşler Modülü
- Satın Alma Modülü
- Muhasebe Modülü

### Faz 8: Gelişmiş Özellikler
- Bildirim sistemi (real-time)
- Dosya yönetimi
- Raporlama dashboard'u
- Mobile responsive optimizasyonu

### Faz 9: Entegrasyonlar
- Active Directory entegrasyonu
- Email servisi entegrasyonu
- Dış sistem API'leri

---

**Doküman Sonu**

Bu yol haritası, projenin başından sonuna kadar tüm geliştirme sürecini kapsar. Her faz bağımsız olarak tamamlanabilir ve test edilebilir şekilde tasarlanmıştır.
