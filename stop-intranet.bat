@echo off
REM ============================================
REM Kurumsal Intranet Portal Durdurma Script'i
REM ============================================
REM Bu script frontend ve backend servislerini durdurur
REM ============================================

echo.
echo ========================================
echo   Kurumsal Intranet Portal Durdurma
echo ========================================
echo.

echo [93mCalisir durumdaki intranet servisleri aranyor...[0m
echo.

REM Backend process'lerini bul ve durdur
echo [93m[1/2] Backend API servisleri durduruluyor...[0m
set BACKEND_KILLED=0

for /f "tokens=2" %%a in ('netstat -ano ^| findstr ":5197" ^| findstr "LISTENING"') do (
    set PID=%%a
    taskkill /PID %%a /F >nul 2>&1
    if %errorlevel% equ 0 (
        echo [92m   Backend process (PID: %%a) durduruldu[0m
        set BACKEND_KILLED=1
    )
)

if %BACKEND_KILLED% equ 0 (
    echo [93m   Backend servisi bulunamadi veya zaten durmus[0m
)
echo.

REM Frontend process'lerini bul ve durdur
echo [93m[2/2] Frontend servisleri durduruluyor...[0m
set FRONTEND_KILLED=0

REM Vite genellikle 5173-5175 arası portları kullanır
for %%p in (5173 5174 5175) do (
    for /f "tokens=2" %%a in ('netstat -ano ^| findstr ":%%p" ^| findstr "LISTENING"') do (
        taskkill /PID %%a /F >nul 2>&1
        if %errorlevel% equ 0 (
            echo [92m   Frontend process - Port %%p (PID: %%a) durduruldu[0m
            set FRONTEND_KILLED=1
        )
    )
)

if %FRONTEND_KILLED% equ 0 (
    echo [93m   Frontend servisi bulunamadi veya zaten durmus[0m
)
echo.

REM Node.js ve dotnet process'lerini temizle (opsiyonel)
echo [93mEk temizlik yapiliyor...[0m
taskkill /F /IM "node.exe" /FI "WINDOWTITLE eq Intranet*" >nul 2>&1
taskkill /F /IM "dotnet.exe" /FI "WINDOWTITLE eq Intranet*" >nul 2>&1
echo [92m   Temizlik tamamlandi[0m
echo.

echo ========================================
echo   Tum servisler durduruldu!
echo ========================================
echo.
echo [96mServisler yeniden baslatmak icin:[0m
echo    start-intranet.bat
echo.
pause
