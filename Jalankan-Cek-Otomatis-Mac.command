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
echo "  PEMERIKSAAN OTOMATIS (AUTOMATED QA TEST SUITE)"
echo "============================================================================"
echo ""

npm test

echo ""
echo "============================================================================"
echo "  Pengujian selesai."
echo "============================================================================"
read -p "Tekan Enter untuk menutup jendela ini..."
