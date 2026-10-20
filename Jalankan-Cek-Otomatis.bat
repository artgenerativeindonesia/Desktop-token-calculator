@echo off
title AI Video Budget Calculator - Pemeriksaan Otomatis Rumus & Fitur PRD
color 0A
cd /d "%~dp0"

echo ============================================================================
echo   PEMERIKSAAN OTOMATIS (AUTOMATED QA TEST SUITE - PRD BAB 8, 10, 12, 15)
echo ============================================================================
echo.
call npm.cmd test
echo.
echo ============================================================================
echo   Pengujian selesai. Tekan tombol apa saja untuk menutup jendela ini.
echo ============================================================================
pause >nul
