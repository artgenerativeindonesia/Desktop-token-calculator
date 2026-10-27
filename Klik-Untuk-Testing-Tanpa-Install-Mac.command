#!/bin/bash
# ============================================================================
# AI Video Budget Calculator - Mode Testing Tanpa Instalasi di Mac (Zero-Install)
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
echo "  AI VIDEO BUDGET CALCULATOR"
echo "  Mode Testing Tanpa Instalasi untuk Pengguna Mac (Zero-Install)"
echo "============================================================================"
echo ""
echo "[INFO] Membuka jendela aplikasi desktop secara langsung tanpa instalasi..."
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
  echo "[INFO] Menyiapkan komponen aplikasi khusus untuk macOS (hanya pertama kali)..."
  npm install
fi

if [ ! -f "dist/index.html" ]; then
  echo "[INFO] Menyiapkan tampilan aplikasi..."
  npm run build
fi

npx electron .
