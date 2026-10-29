#!/bin/bash
# ============================================================================
# AI Video Budget Calculator - Pemeriksaan Otomatis Rumus & Fitur di Mac
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
echo "  PEMERIKSAAN OTOMATIS (AUTOMATED QA TEST SUITE - VERSI 2.1.0)"
echo "============================================================================"
echo ""

echo "[1/3] Memeriksa Ketepatan Tipe Data & Nama Variabel (Typecheck)..."
npm run typecheck || { echo "[ERROR] Ditemukan kesalahan tipe data/kode!"; exit 1; }

echo ""
echo "[2/3] Menguji 116 Skenario Logika Matematika, Audio & Anti-Layar-Hitam (Vitest)..."
npm test || { echo "[ERROR] Ditemukan kegagalan pada pengujian logika!"; exit 1; }

echo ""
echo "[3/3] Menguji Kompilasi Paket Aplikasi (Build Renderer & Electron)..."
npm run build || { echo "[ERROR] Gagal mengemas build aplikasi!"; exit 1; }

echo ""
echo "============================================================================"
echo "  SEMUA PENGUJIAN LULUS 100%! Aplikasi dalam kondisi prima dan siap pakai."
echo "============================================================================"
read -p "Tekan Enter untuk menutup jendela ini..."
