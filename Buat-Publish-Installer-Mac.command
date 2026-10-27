#!/bin/bash
# ============================================================================
# AI Video Budget Calculator - Buat Paket Publish Installer Mac (.DMG & .ZIP)
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
echo "  PEMBUATAN PAKET INSTALLER MAC (.DMG & .ZIP)"
echo "  (Menghasilkan file installer siap pakai di dalam folder release/)"
echo "============================================================================"
echo ""

if ! command -v npm >/dev/null 2>&1; then
  echo "[PERHATIAN] Node.js belum terpasang di Mac Anda."
  echo "Silakan unduh dan pasang Node.js versi LTS terlebih dahulu dari:"
  echo "https://nodejs.org"
  echo ""
  read -p "Tekan Enter untuk menutup jendela ini..."
  exit 1
fi

if [ ! -d "node_modules" ] || [ ! -d "node_modules/electron/dist/Electron.app" ]; then
  echo "[INFO] Menyiapkan komponen aplikasi khusus untuk macOS..."
  npm install
fi

echo ""
echo "[INFO] Sedang membuat file Installer Mac (.dmg & .zip)..."
npm run dist:mac

# Bersihkan atribut karantina pada hasil build
xattr -cr release/*.dmg release/*.zip 2>/dev/null || true

echo ""
echo "============================================================================"
echo "  Selesai! File Installer Mac (.dmg & .zip) tersedia di folder 'release/'."
echo "============================================================================"
open "release" 2>/dev/null || true
read -p "Tekan Enter untuk menutup jendela ini..."
