# Windows Deployment Rehberi - Kurumsal İntranet Web Portalı

Bu doküman, **Kurumsal İntranet Web Portalı**'nın Windows Server ortamında production deployment işlemlerini adım adım açıklar.

---

## 1. Sistem Gereksinimleri

### 1.1. Donanım Gereksinimleri (Minimum)

| Bileşen | Geliştirme Ortamı | Production Sunucu |
|---------|-------------------|-------------------|
| İşlemci | 4 Core | 8 Core (16 Core önerilir) |
| RAM | 8 GB | 16 GB (32 GB önerilir) |
| Disk | 50 GB SSD | 500 GB SSD |
| Ağ | 1 Gbps | 1 Gbps (10 Gbps önerilir) |

### 1.2. Yazılım Gereksinimleri

**Geliştirme:**
- Windows 10 (21H2 veya üzeri) / Windows 11
- .NET 9 SDK
- PostgreSQL 15/16
- Node.js 20 LTS
- Git for Windows
- Visual Studio 2022 / VS Code

**Production:**
- Windows Server 2019 / 2022
- .NET 9 Runtime + Hosting Bundle
- PostgreSQL 15/16
- IIS 10.0+
- SSL Sertifikası (Self-signed veya CA signed)

---

## 2. Adım 1: Windows Server Hazırlığı

### 2.1. IIS Kurulumu

**PowerShell (Administrator olarak çalıştırın):**

```powershell
# IIS ana bileşenleri
Install-WindowsFeature -Name Web-Server -IncludeManagementTools

# ASP.NET desteği
Install-WindowsFeature -Name Web-Asp-Net45

# URL Rewrite modülü (React Router için gerekli)
# Manuelde indirilmeli: https://www.iis.net/downloads/microsoft/url-rewrite

# IIS servisini başlat
Start-Service W3SVC
Set-Service W3SVC -StartupType Automatic
```

**Kontrol:**
```powershell
Get-Service W3SVC  # Running olmalı
```

### 2.2. .NET 9 Hosting Bundle Kurulumu

1. **İndirme:**
   - [https://dotnet.microsoft.com/download/dotnet/9.0](https://dotnet.microsoft.com/download/dotnet/9.0)
   - `dotnet-hosting-9.0.x-win.exe` dosyasını indirin

2. **Kurulum:**
   ```powershell
   # Installer'ı çalıştır
   .\dotnet-hosting-9.0.x-win.exe /quiet /norestart

   # IIS'i yeniden başlat
   net stop was /y
   net start w3svc
   ```

3. **Doğrulama:**
   ```powershell
   dotnet --list-runtimes
   # Microsoft.AspNetCore.App 9.0.x olmalı
   ```

### 2.3. PostgreSQL Kurulumu

1. **İndirme:**
   - [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
   - PostgreSQL 16.x Windows installer

2. **Kurulum Adımları:**
   - Port: `5432` (default)
   - Locale: `Turkish, Turkey` (opsiyonel)
   - Superuser password: Güçlü bir parola belirleyin
   - Stack Builder: pgAdmin 4 seçin

3. **Windows Service Yapılandırması:**
   ```powershell
   # PostgreSQL servisini otomatik başlat
   sc config postgresql-x64-16 start= auto
   sc query postgresql-x64-16  # Running olmalı
   ```

4. **Firewall Kuralı (Sadece lokal ağ için):**
   ```powershell
   New-NetFirewallRule -DisplayName "PostgreSQL" `
       -Direction Inbound `
       -Protocol TCP `
       -LocalPort 5432 `
       -Action Allow `
       -Profile Domain,Private
   ```

---

## 3. Adım 2: Veritabanı Hazırlığı

### 3.1. Veritabanı ve Kullanıcı Oluşturma

**pgAdmin veya psql ile:**

```sql
-- PostgreSQL super user olarak bağlan
-- psql -U postgres

-- Veritabanı oluştur
CREATE DATABASE "IntranetDB"
    WITH ENCODING 'UTF8'
    LC_COLLATE = 'Turkish_Turkey.1254'
    LC_CTYPE = 'Turkish_Turkey.1254';

-- Uygulama kullanıcısı oluştur
CREATE USER intranet_user WITH ENCRYPTED PASSWORD 'SecureP@ssw0rd!2025';

-- Yetkileri ver
GRANT ALL PRIVILEGES ON DATABASE "IntranetDB" TO intranet_user;

-- Kullanıcıya schema yetkileri ver
\c IntranetDB
GRANT ALL ON SCHEMA public TO intranet_user;
```

### 3.2. pgcrypto Extension (Şifreleme için)

```sql
-- IntranetDB veritabanına bağlı olarak
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Doğrulama
SELECT * FROM pg_extension;
```

### 3.3. PostgreSQL Yapılandırması (postgresql.conf)

**Dosya konumu:** `C:\Program Files\PostgreSQL\16\data\postgresql.conf`

```ini
# Bağlantı ayarları
listen_addresses = 'localhost'  # Sadece lokal bağlantı
port = 5432
max_connections = 200

# Bellek ayarları (16 GB RAM için)
shared_buffers = 4GB
effective_cache_size = 12GB
maintenance_work_mem = 1GB
work_mem = 50MB

# Log ayarları
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_statement = 'mod'  # DDL ve DML logları
log_min_duration_statement = 1000  # 1 saniyeden uzun sorgular
```

**Servisi yeniden başlat:**
```powershell
Restart-Service postgresql-x64-16
```

---

## 4. Adım 3: Backend Deployment

### 4.1. Projeyi Publish Etme

**Geliştirme makinesinde:**

```powershell
cd C:\Projects\IntranetPortal

# Release modda publish et
dotnet publish src/IntranetPortal.API/IntranetPortal.API.csproj `
    -c Release `
    -o C:\Publish\IntranetAPI `
    --self-contained false `
    -r win-x64

# Dosyaları zip'le (sunucuya taşımak için)
Compress-Archive -Path C:\Publish\IntranetAPI\* `
    -DestinationPath C:\Publish\IntranetAPI.zip
```

### 4.2. Sunucuya Aktarma ve Kurulum

**Production sunucusunda:**

```powershell
# Publish klasörünü oluştur
New-Item -ItemType Directory -Path C:\inetpub\IntranetAPI

# Zip'i kopyala ve aç (RDP, USB veya ağ paylaşımı ile)
Expand-Archive -Path \\Dev-PC\Share\IntranetAPI.zip `
    -DestinationPath C:\inetpub\IntranetAPI

# IIS uygulama havuzu oluştur
Import-Module WebAdministration
New-WebAppPool -Name "IntranetAPIPool"

# App Pool ayarları
Set-ItemProperty IIS:\AppPools\IntranetAPIPool `
    -Name managedRuntimeVersion -Value ''  # No Managed Code
Set-ItemProperty IIS:\AppPools\IntranetAPIPool `
    -Name enable32BitAppOnWin64 -Value $false
Set-ItemProperty IIS:\AppPools\IntranetAPIPool `
    -Name processModel.idleTimeout -Value '00:00:00'  # Idle timeout yok
Set-ItemProperty IIS:\AppPools\IntranetAPIPool `
    -Name startMode -Value 'AlwaysRunning'
```

### 4.3. IIS Site Oluşturma

```powershell
# HTTPS Binding için self-signed sertifika oluştur (test için)
New-SelfSignedCertificate -DnsName "api.intranet.local" `
    -CertStoreLocation "cert:\LocalMachine\My" `
    -FriendlyName "Intranet API Certificate" `
    -NotAfter (Get-Date).AddYears(5)

# Sertifikayı değişkene al
$cert = Get-ChildItem -Path Cert:\LocalMachine\My |
    Where-Object {$_.Subject -match "api.intranet.local"}

# IIS sitesi oluştur
New-Website -Name "IntranetAPI" `
    -PhysicalPath "C:\inetpub\IntranetAPI" `
    -ApplicationPool "IntranetAPIPool" `
    -Port 443 `
    -HostHeader "api.intranet.local" `
    -Ssl `
    -SslFlags 0

# HTTPS binding'e sertifika ata
$binding = Get-WebBinding -Name "IntranetAPI" -Protocol "https"
$binding.AddSslCertificate($cert.GetCertHashString(), "my")

# HTTP'den HTTPS'e yönlendirme (opsiyonel)
New-WebBinding -Name "IntranetAPI" -Protocol http -Port 80 `
    -HostHeader "api.intranet.local"
```

### 4.4. appsettings.json Güncelleme

**Dosya:** `C:\inetpub\IntranetAPI\appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=IntranetDB;Username=intranet_user;Password=SecureP@ssw0rd!2025"
  },
  "JwtSettings": {
    "SecretKey": "Kurumsal-Intranet-2025-Secret-Key-Min-32-Characters!",
    "Issuer": "IntranetPortal",
    "Audience": "IntranetUsers",
    "ExpiryMinutes": 480
  },
  "SecuritySettings": {
    "AllowedIPRanges": [
      "192.168.1.0/24",
      "10.0.0.0/16"
    ],
    "EnableIPWhitelist": true,
    "EncryptionKey": "AES-256-Encryption-Key-32-Bytes!"
  },
  "Serilog": {
    "MinimumLevel": "Warning",
    "WriteTo": [
      {
        "Name": "File",
        "Args": {
          "path": "C:\\Logs\\IntranetAPI\\log-.txt",
          "rollingInterval": "Day",
          "retainedFileCountLimit": 30
        }
      }
    ]
  }
}
```

### 4.5. Database Migration Uygulama

```powershell
cd C:\inetpub\IntranetAPI

# EF Core CLI aracını kur (eğer yoksa)
dotnet tool install --global dotnet-ef

# Migration uygula
dotnet ef database update --project IntranetPortal.API.dll

# Alternatif: SQL script oluştur ve manuel çalıştır
dotnet ef migrations script -o migration.sql
# migration.sql'i pgAdmin ile çalıştır
```

### 4.6. IIS'i Başlat ve Test Et

```powershell
# App Pool'u başlat
Start-WebAppPool -Name "IntranetAPIPool"

# Site'ı başlat
Start-Website -Name "IntranetAPI"

# Test
Invoke-WebRequest -Uri https://api.intranet.local/api/health -SkipCertificateCheck
# 200 OK dönmeli
```

---

## 5. Adım 4: Frontend Deployment

### 5.1. Frontend Build

**Geliştirme makinesinde:**

```powershell
cd C:\Projects\intranet-frontend

# Üretim için build
npm run build
# Çıktı: dist/ klasörü

# API URL'sini güncelle (.env.production)
# VITE_API_URL=https://api.intranet.local

# Dosyaları zip'le
Compress-Archive -Path dist\* -DestinationPath ..\IntranetFrontend.zip
```

### 5.2. Sunucuya Deployment

**Production sunucusunda:**

```powershell
# Klasör oluştur
New-Item -ItemType Directory -Path C:\inetpub\IntranetFrontend

# Zip'i aç
Expand-Archive -Path \\Dev-PC\Share\IntranetFrontend.zip `
    -DestinationPath C:\inetpub\IntranetFrontend

# web.config oluştur (React Router için)
@"
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <mimeMap fileExtension=".json" mimeType="application/json" />
      <mimeMap fileExtension=".woff" mimeType="application/font-woff" />
      <mimeMap fileExtension=".woff2" mimeType="application/font-woff2" />
    </staticContent>
  </system.webServer>
</configuration>
"@ | Out-File -FilePath C:\inetpub\IntranetFrontend\web.config -Encoding utf8
```

### 5.3. IIS Site Oluşturma

```powershell
# App Pool oluştur
New-WebAppPool -Name "IntranetFrontendPool"
Set-ItemProperty IIS:\AppPools\IntranetFrontendPool `
    -Name managedRuntimeVersion -Value ''

# Sertifika oluştur
New-SelfSignedCertificate -DnsName "intranet.kurum.local" `
    -CertStoreLocation "cert:\LocalMachine\My" `
    -NotAfter (Get-Date).AddYears(5)

$cert = Get-ChildItem -Path Cert:\LocalMachine\My |
    Where-Object {$_.Subject -match "intranet.kurum.local"}

# Site oluştur
New-Website -Name "IntranetFrontend" `
    -PhysicalPath "C:\inetpub\IntranetFrontend" `
    -ApplicationPool "IntranetFrontendPool" `
    -Port 443 `
    -HostHeader "intranet.kurum.local" `
    -Ssl

# Sertifika binding
$binding = Get-WebBinding -Name "IntranetFrontend" -Protocol "https"
$binding.AddSslCertificate($cert.GetCertHashString(), "my")

# HTTP binding
New-WebBinding -Name "IntranetFrontend" -Protocol http -Port 80 `
    -HostHeader "intranet.kurum.local"
```

---

## 6. Adım 5: DNS ve Hosts Yapılandırması

### 6.1. Lokal DNS (Windows Server DNS rolü varsa)

```powershell
# DNS A kaydı ekle
Add-DnsServerResourceRecordA -Name "intranet" `
    -ZoneName "kurum.local" `
    -IPv4Address "192.168.1.100"

Add-DnsServerResourceRecordA -Name "api.intranet" `
    -ZoneName "kurum.local" `
    -IPv4Address "192.168.1.100"
```

### 6.2. hosts Dosyası (DNS yoksa)

**Her istemci bilgisayarda:**

Dosya: `C:\Windows\System32\drivers\etc\hosts`

```
192.168.1.100    intranet.kurum.local
192.168.1.100    api.intranet.local
```

---

## 7. Adım 6: Güvenlik Yapılandırması

### 7.1. Windows Firewall

```powershell
# HTTPS trafiğine izin ver (443)
New-NetFirewallRule -DisplayName "Intranet HTTPS" `
    -Direction Inbound `
    -Protocol TCP `
    -LocalPort 443 `
    -Action Allow `
    -Profile Domain,Private

# PostgreSQL port (sadece lokal)
New-NetFirewallRule -DisplayName "PostgreSQL Local" `
    -Direction Inbound `
    -Protocol TCP `
    -LocalPort 5432 `
    -RemoteAddress LocalSubnet `
    -Action Allow
```

### 7.2. IIS SSL Ayarları

```powershell
# TLS 1.0 ve 1.1'i devre dışı bırak (Güvenlik için)
New-Item 'HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.0\Server' -Force
New-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.0\Server' -Name 'Enabled' -Value 0 -PropertyType 'DWord'

New-Item 'HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.1\Server' -Force
New-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.1\Server' -Name 'Enabled' -Value 0 -PropertyType 'DWord'

# Sunucuyu yeniden başlat
Restart-Computer -Force
```

---

## 8. Adım 7: Yedekleme ve Monitoring

### 8.1. PostgreSQL Otomatik Yedekleme

**Script:** `C:\Scripts\PostgreSQLBackup.ps1`

```powershell
$date = Get-Date -Format "yyyy-MM-dd_HHmm"
$backupDir = "C:\Backups\IntranetDB"
$backupFile = "$backupDir\IntranetDB_$date.backup"
$logFile = "$backupDir\backup.log"

# Klasör oluştur
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir
}

# Yedekleme
$env:PGPASSWORD = "SecureP@ssw0rd!2025"
& "C:\Program Files\PostgreSQL\16\bin\pg_dump.exe" `
    -U intranet_user `
    -h localhost `
    -F c `
    -b -v `
    -f $backupFile `
    IntranetDB `
    2>&1 | Out-File -Append $logFile

# Eski yedekleri temizle (30 günden eski)
Get-ChildItem $backupDir -Filter "*.backup" |
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } |
    Remove-Item -Force

# Log
"Backup completed: $backupFile" | Out-File -Append $logFile
```

**Task Scheduler ile otomatik çalıştırma:**

```powershell
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" `
    -Argument "-ExecutionPolicy Bypass -File C:\Scripts\PostgreSQLBackup.ps1"

$trigger = New-ScheduledTaskTrigger -Daily -At 2:00AM

$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" `
    -LogonType ServiceAccount -RunLevel Highest

Register-ScheduledTask -TaskName "PostgreSQL Backup" `
    -Action $action `
    -Trigger $trigger `
    -Principal $principal
```

### 8.2. IIS Log Monitoring

**Event Viewer:**
- `Applications and Services Logs → Microsoft → Windows → IIS-Configuration`
- `Windows Logs → Application` (ASP.NET Core logları)

**PowerShell ile log kontrolü:**

```powershell
# Son 24 saatte IIS hataları
Get-EventLog -LogName Application -After (Get-Date).AddHours(-24) |
    Where-Object {$_.Source -like "*IIS*" -and $_.EntryType -eq "Error"}
```

---

## 9. Adım 8: İlk Çalıştırma ve Test

### 9.1. Seed Data Oluşturma

**Backend'de ilk admin kullanıcısını oluştur:**

```sql
-- pgAdmin ile IntranetDB'ye bağlan

-- İlk sistem admin kullanıcısı
INSERT INTO "User" ("AdSoyad", "Email", "SifreHash", "Unvan", "IsActive")
VALUES ('Sistem Yöneticisi', 'admin@kurum.local',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5QLjsNdJvYlMq',  -- Şifre: Admin123!
    'IT Müdürü', TRUE);

-- Sistem admin rolü ile ilişkilendir (BirimID = 1, RoleID = 1 varsayarak)
INSERT INTO "UserBirimRole" ("UserID", "BirimID", "RoleID")
SELECT
    (SELECT "UserID" FROM "User" WHERE "Email" = 'admin@kurum.local'),
    1,  -- İlk birim
    (SELECT "RoleID" FROM "Role" WHERE "RoleAdi" = 'SistemAdmin');
```

### 9.2. Frontend Test

1. **Tarayıcıda:** `https://intranet.kurum.local`
2. **Login:** `admin@kurum.local` / `Admin123!`
3. **Kontrol:** Dashboard yükleniyor mu?

### 9.3. API Test

```powershell
# Health check
Invoke-RestMethod -Uri https://api.intranet.local/api/health `
    -SkipCertificateCheck

# Login test
$body = @{
    email = "admin@kurum.local"
    password = "Admin123!"
} | ConvertTo-Json

Invoke-RestMethod -Uri https://api.intranet.local/api/auth/login `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -SkipCertificateCheck
```

---

## 10. Troubleshooting

### 10.1. Backend Başlamıyor

```powershell
# Event Viewer kontrol
Get-EventLog -LogName Application -Newest 20 |
    Where-Object {$_.Source -like "*ASP.NET*"}

# IIS log kontrol
Get-Content "C:\inetpub\logs\LogFiles\W3SVC1\*.log" -Tail 50
```

### 10.2. Database Bağlantı Hatası

```powershell
# PostgreSQL servis kontrolü
Get-Service postgresql-x64-16

# Connection string test (psql ile)
psql -U intranet_user -h localhost -d IntranetDB
```

### 10.3. Frontend 404 Hataları

- `web.config` dosyasının varlığını kontrol edin
- IIS URL Rewrite modülünün kurulu olduğunu doğrulayın

---

## 11. Bakım ve Güncellemeler

### 11.1. Backend Güncellemesi

```powershell
# Yeni versiyon publish et
dotnet publish -c Release -o C:\Publish\IntranetAPI_New

# App Pool'u durdur
Stop-WebAppPool -Name "IntranetAPIPool"

# Eski dosyaları yedekle
Copy-Item C:\inetpub\IntranetAPI C:\Backups\IntranetAPI_Backup -Recurse

# Yeni dosyaları kopyala
Copy-Item C:\Publish\IntranetAPI_New\* C:\inetpub\IntranetAPI -Force -Recurse

# App Pool'u başlat
Start-WebAppPool -Name "IntranetAPIPool"
```

### 11.2. Database Migration

```powershell
cd C:\inetpub\IntranetAPI
dotnet ef database update
```

---

Bu deployment rehberi, Windows Server ortamında tam fonksiyonel bir intranet portalı kurulumunu sağlar.
