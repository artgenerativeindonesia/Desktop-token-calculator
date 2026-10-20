@echo off
title AI Video Budget Calculator - Buat Paket Publish Installer (Setelah Disetujui)
color 0E
cd /d "%~dp0"

echo ============================================================================
echo   PEMBUATAN PAKET PUBLISH / INSTALLER (.EXE PORTABLE & SETUP)
echo   (Jalankan hanya setelah versi aplikasi disetujui untuk dipublikasikan)
echo ============================================================================
echo.
call npm.cmd run dist:win
echo.
echo ============================================================================
echo   Selesai! File aplikasi siap pakai tersedia di dalam folder "release\".
echo ============================================================================
pause
