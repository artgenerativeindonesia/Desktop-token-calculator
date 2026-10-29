@echo off
title AI Video Budget Calculator - Pemeriksaan Otomatis Rumus & Fitur PRD (v2.1.0)
color 0A
cd /d "%~dp0"

echo ============================================================================
echo   PEMERIKSAAN OTOMATIS (AUTOMATED QA TEST SUITE - VERSI 2.1.0)
echo ============================================================================
echo.
echo [1/3] Memeriksa Ketepatan Tipe Data & Nama Variabel (Typecheck)...
call npm.cmd run typecheck
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] Ditemukan kesalahan tipe data/kode! Proses dihentikan.
    echo Tekan tombol apa saja untuk keluar.
    pause >nul
    exit /b %errorlevel%
)

echo.
echo [2/3] Menguji 116 Skenario Logika Matematika, Audio & Anti-Layar-Hitam (Vitest)...
call npm.cmd test
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] Ditemukan kegagalan pada pengujian logika matematika!
    echo Tekan tombol apa saja untuk keluar.
    pause >nul
    exit /b %errorlevel%
)

echo.
echo [3/3] Menguji Kompilasi Paket Aplikasi (Build Renderer & Electron)...
call npm.cmd run build
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] Gagal mengemas build aplikasi!
    echo Tekan tombol apa saja untuk keluar.
    pause >nul
    exit /b %errorlevel%
)

echo.
echo ============================================================================
echo   SEMUA PENGUJIAN LULUS 100%! Aplikasi dalam kondisi prima dan siap pakai.
echo   Tekan tombol apa saja untuk menutup jendela ini.
echo ============================================================================
pause >nul

