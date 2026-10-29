@echo off
title AI Video Budget Calculator - Pemeriksaan Otomatis Rumus dan Fitur (v2.1.6)
color 0A
cd /d "%~dp0"

echo ============================================================================
echo   AI VIDEO BUDGET CALCULATOR - VERSI APLIKASI: v2.1.6 (STUDIO EDITION)
echo   PEMERIKSAAN OTOMATIS 3-LAPIS (AUTOMATED QA TEST SUITE)
echo ============================================================================
echo.
echo [1/3] Memeriksa Ketepatan Tipe Data dan Nama Variabel (Typecheck)...
call npm.cmd run typecheck
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] Ditemukan kesalahan tipe data atau kode! Proses dihentikan.
    echo Tekan tombol apa saja untuk keluar.
    pause >nul
    exit /b %errorlevel%
)

echo.
echo [2/3] Menguji 116 Skenario Logika Matematika, Audio, dan Anti-Layar-Hitam...
echo [INFO] Catatan: Tulisan "RUN v2.1.9" di bawah adalah versi mesin penguji Vitest,
echo        bukan versi aplikasi Anda (Versi Aplikasi Anda adalah v2.1.6).
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
echo [3/3] Menguji Kompilasi Paket Aplikasi (Build Renderer dan Electron)...
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
echo   SEMUA PENGUJIAN LULUS 100%%! (Versi Aplikasi: v2.1.4)
echo   Aplikasi dalam kondisi prima, bebas error, dan siap digunakan.
echo   Tekan tombol apa saja untuk menutup jendela ini.
echo ============================================================================
pause >nul
