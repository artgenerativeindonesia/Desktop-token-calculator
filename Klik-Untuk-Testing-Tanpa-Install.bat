@echo off
title AI Video Budget Calculator - Mode Testing Tanpa Instalasi (v2.1.6)
color 0B
cd /d "%~dp0"

echo ============================================================================
echo   AI VIDEO BUDGET CALCULATOR - VERSI APLIKASI: v2.1.6 (STUDIO EDITION)
echo   Mode Testing Tanpa Instalasi (Zero-Install untuk No-Code Developer)
echo ============================================================================
echo.
echo [INFO] Membuka jendela aplikasi desktop secara langsung tanpa instalasi...
echo [INFO] Aplikasi TIDAK dipasang ke Windows / Control Panel Anda.
echo.

echo [INFO] Memastikan tampilan aplikasi versi terbaru (v2.1.6) siap dijalankan...
call npm.cmd run build
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] Gagal menyiapkan tampilan aplikasi. Silakan periksa pesan di atas.
    echo Tekan tombol apa saja untuk keluar.
    pause >nul
    exit /b %errorlevel%
)

call npx.cmd electron .
