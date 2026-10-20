@echo off
title AI Video Budget Calculator - Mode Testing Tanpa Instalasi (Zero-Install)
color 0B
cd /d "%~dp0"

echo ============================================================================
echo   AI VIDEO BUDGET CALCULATOR (PRD v1.0)
echo   Mode Testing Tanpa Instalasi (Zero-Install untuk No-Code Developer)
echo ============================================================================
echo.
echo [INFO] Membuka jendela aplikasi desktop secara langsung tanpa instalasi...
echo [INFO] Aplikasi TIDAK dipasang ke Windows / Control Panel Anda.
echo.

if not exist "dist\index.html" (
    echo [INFO] Menyiapkan tampilan aplikasi...
    call npm.cmd run build
)

call npx.cmd electron .
