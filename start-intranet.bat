@echo off
REM ============================================
REM Kurumsal Intranet Portal Başlatma Script'i
REM ============================================
REM Bu script frontend ve backend servislerini başlatır
REM
REM Gereksinimler:
REM - .NET 9 SDK
REM - Node.js 20+
REM - PostgreSQL 16 (çalışır durumda)
REM ============================================

echo.
echo ========================================
echo   Kurumsal Intranet Portal Baslatici
echo ========================================
echo.

REM Mevcut dizini kaydet
set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%intranet-portal\backend\IntranetPortal.API"
set "FRONTEND_DIR=%ROOT_DIR%intranet-portal\frontend"

REM Renk kodları (Windows 10+)
echo [92mKontroller yapiliyor...[0m
echo.

REM .NET kontrolü
echo [93m[1/4] .NET SDK kontrol ediliyor...[0m
dotnet --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [91m[HATA] .NET SDK bulunamadi![0m
    echo [91mLutfen .NET 9 SDK yukleyin: https://dotnet.microsoft.com/download[0m
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('dotnet --version') do set DOTNET_VERSION=%%i
echo [92m   .NET SDK %DOTNET_VERSION% bulundu[0m
echo.

REM Node.js kontrolü
echo [93m[2/4] Node.js kontrol ediliyor...[0m
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [91m[HATA] Node.js bulunamadi![0m
    echo [91mLutfen Node.js yukleyin: https://nodejs.org/[0m
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [92m   Node.js %NODE_VERSION% bulundu[0m
echo.

REM PostgreSQL kontrolü
echo [93m[3/4] PostgreSQL kontrol ediliyor...[0m
netstat -ano | findstr ":5432" >nul 2>&1
if %errorlevel% neq 0 (
    echo [91m[UYARI] PostgreSQL 5432 portunda calisiyor gibi gorunmuyor![0m
    echo [93m   Devam etmek ister misiniz? (E/H)[0m
    set /p CONTINUE=
    if /i not "%CONTINUE%"=="E" (
        echo [91mIslem iptal edildi.[0m
        pause
        exit /b 1
    )
) else (
    echo [92m   PostgreSQL 5432 portunda calisyor[0m
)
echo.

REM Dizin kontrolü
echo [93m[4/4] Proje dizinleri kontrol ediliyor...[0m
if not exist "%BACKEND_DIR%" (
    echo [91m[HATA] Backend dizini bulunamadi:[0m
    echo [91m   %BACKEND_DIR%[0m
    pause
    exit /b 1
)
if not exist "%FRONTEND_DIR%" (
    echo [91m[HATA] Frontend dizini bulunamadi:[0m
    echo [91m   %FRONTEND_DIR%[0m
    pause
    exit /b 1
)
echo [92m   Backend dizini: OK[0m
echo [92m   Frontend dizini: OK[0m
echo.

echo ========================================
echo   Tum kontroller basarili!
echo ========================================
echo.
echo [96mServisleri baslatiyorum...[0m
echo.

REM Backend başlatma (yeni pencerede)
echo [93m[Backend] ASP.NET Core API baslatiliyor...[0m
start "Intranet Backend API" cmd /k "cd /d "%BACKEND_DIR%" && echo [92m=== Intranet Backend API ===[0m && echo [92mPort: 5197[0m && echo [92mURL: http://localhost:5197/api[0m && echo. && dotnet run"

REM Backend'in başlaması için bekle (3 saniye)
timeout /t 3 /nobreak >nul

REM Frontend başlatma (yeni pencerede)
echo [93m[Frontend] React + Vite baslatiliyor...[0m
start "Intranet Frontend" cmd /k "cd /d "%FRONTEND_DIR%" && echo [92m=== Intranet Frontend ===[0m && echo [92mVite Dev Server baslatiliyor...[0m && echo. && npm run dev"

echo.
echo ========================================
echo   Servisler baslatildi!
echo ========================================
echo.
echo [96mServis Bilgileri:[0m
echo.
echo [92m Backend API:[0m
echo    URL: http://localhost:5197/api
echo    Swagger: http://localhost:5197/swagger (eger etkinse)
echo    Health: http://localhost:5197/api/health
echo.
echo [92m Frontend:[0m
echo    URL: http://localhost:5173 (veya 5174, 5175)
echo    Not: Vite otomatik olarak port secer
echo.
echo [93mIPUCU:[0m
echo - Backend ve Frontend yeni pencerede acildi
echo - Frontend tamamen yuklendikten sonra tarayicida acilacak
echo - Servisleri durdurmak icin her pencerede Ctrl+C basin
echo.
echo [96mLogin Bilgileri:[0m
echo    Email: admin@intranet.local
echo    Sifre: Admin123!
echo.
pause
