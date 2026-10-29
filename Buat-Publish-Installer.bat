@echo off
title AI Video Budget Calculator - Buat Paket Publish Installer (v2.1.3)
color 0E
cd /d "%~dp0"

echo ============================================================================
echo   AI VIDEO BUDGET CALCULATOR - VERSI APLIKASI: v2.1.3 (STUDIO EDITION)
echo   PEMBUATAN PAKET PUBLISH / INSTALLER (.EXE PORTABLE DAN SETUP)
echo ============================================================================
echo.
call npm.cmd run dist:win
echo.
echo ============================================================================
echo   Selesai! File aplikasi siap pakai tersedia di dalam folder "release\".
echo ============================================================================
pause
