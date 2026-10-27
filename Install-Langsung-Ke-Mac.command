#!/bin/bash
# ============================================================================
# AI Video Budget Calculator - Instalasi 1-Klik Langsung ke Mac (/Applications)
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
echo "  INSTALASI OTOMATIS AI VIDEO BUDGET CALCULATOR KE MAC (APPLICATIONS)"
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

# Pastikan paket pendukung sudah siap untuk sistem operasi Mac
if [ ! -d "node_modules" ] || [ ! -d "node_modules/electron/dist/Electron.app" ]; then
  echo "[1/3] Menyiapkan komponen aplikasi khusus untuk macOS..."
  npm install
fi

echo ""
echo "[2/3] Membungkus aplikasi AI Video Budget Calculator.app untuk Mac Anda..."
npm run dist:mac:dir

APP_SOURCE=""
if [ -d "release/mac-arm64/AI Video Budget Calculator.app" ]; then
  APP_SOURCE="release/mac-arm64/AI Video Budget Calculator.app"
elif [ -d "release/mac/AI Video Budget Calculator.app" ]; then
  APP_SOURCE="release/mac/AI Video Budget Calculator.app"
fi

if [ -z "$APP_SOURCE" ]; then
  echo ""
  echo "[GAGAL] Aplikasi belum berhasil dibungkus. Silakan periksa pesan di atas."
  read -p "Tekan Enter untuk menutup jendela ini..."
  exit 1
fi

echo ""
echo "[3/3] Memasang aplikasi ke folder /Applications di Mac Anda..."
rm -rf "/Applications/AI Video Budget Calculator.app"
cp -R "$APP_SOURCE" "/Applications/AI Video Budget Calculator.app"

# Hapus karantina keamanan Gatekeeper agar aplikasi langsung bisa dibuka tanpa blokir
xattr -cr "/Applications/AI Video Budget Calculator.app" 2>/dev/null || true

echo ""
echo "============================================================================"
echo "  BERHASIL! AI Video Budget Calculator kini sudah terpasang di Mac Anda."
echo "  Anda bisa membukanya kapan saja dari Launchpad atau folder Applications."
echo "============================================================================"
echo ""
echo "[INFO] Membuka aplikasi sekarang..."
open -a "/Applications/AI Video Budget Calculator.app"
read -p "Tekan Enter untuk menutup jendela ini..."
