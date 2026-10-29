#!/bin/bash
# ============================================================================
# AI Video Budget Calculator - Pemeriksaan Otomatis Rumus dan Fitur di Mac
# ============================================================================

export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
if [ -d "$HOME/.nvm/versions/node" ]; then
  LATEST_NODE=$(ls "$HOME/.nvm/versions/node" 2>/dev/null | tail -n 1)
  if [ -n "$LATEST_NODE" ]; then
    export PATH="$HOME/.nvm/versions/node/$LATEST_NODE/bin:$PATH"
  fi
fi

cd "$(dirname "$0")"

echo "============================================================================"
echo "  AI VIDEO BUDGET CALCULATOR - VERSI APLIKASI: v2.1.4 (STUDIO EDITION)"
echo "  PEMERIKSAAN OTOMATIS 3-LAPIS (AUTOMATED QA TEST SUITE)"
echo "============================================================================"
echo ""

echo "[1/3] Memeriksa Ketepatan Tipe Data dan Nama Variabel (Typecheck)..."
npm run typecheck || { echo "[ERROR] Ditemukan kesalahan tipe data atau kode!"; exit 1; }

echo ""
echo "[2/3] Menguji 116 Skenario Logika Matematika, Audio, dan Anti-Layar-Hitam..."
echo "[INFO] Catatan: Tulisan 'RUN v2.1.9' di bawah adalah versi mesin penguji Vitest,"
echo "       bukan versi aplikasi Anda (Versi Aplikasi Anda adalah v2.1.4)."
npm test || { echo "[ERROR] Ditemukan kegagalan pada pengujian logika!"; exit 1; }

echo ""
echo "[3/3] Menguji Kompilasi Paket Aplikasi (Build Renderer dan Electron)..."
npm run build || { echo "[ERROR] Gagal mengemas build aplikasi!"; exit 1; }

echo ""
echo "============================================================================"
echo "  SEMUA PENGUJIAN LULUS 100%! (Versi Aplikasi: v2.1.4)"
echo "  Aplikasi dalam kondisi prima, bebas error, dan siap digunakan."
echo "============================================================================"
read -p "Tekan Enter untuk menutup jendela ini..."
