# Dokumentasi Verifikasi Integrasi: Higgsfield & Kurs USD/IDR (PRD Bab 9, 16, 17)

Dokumen ini mencatat hasil verifikasi teknis terhadap sumber data eksternal sesuai persyaratan **PRD AI Video Budget Calculator v1.0 (Bab 9.2, 9.3, 16, dan 17.1)**.

---

## 1. Hasil Verifikasi Katalog & Harga Higgsfield (PRD Bab 9.2)

### A. Sumber Resmi yang Diverifikasi
- **Portal Dokumentasi Resmi:** `https://docs.higgsfield.ai` (`https://docs.higgsfield.ai/docs/llms.txt` & `https://docs.higgsfield.ai/docs/models.md`)
- **Spesifikasi OpenAPI Resmi:** `https://docs.higgsfield.ai/docs/openapi.json`
- **Dokumentasi Billing & Estimasi:** `https://docs.higgsfield.ai/docs/concepts/billing-and-retention.md`
- **Halaman Harga Publik:** `https://higgsfield.ai/pricing`

### B. Temuan Teknis
1. **Katalog Model & Skema Parameter (Terverifikasi Publik):**
   - Dokumentasi resmi Higgsfield menyediakan katalog terstruktur untuk **84 workflow** (17 Image dan 67 Video), mencakup keluarga model:
     - **Video:** Kling 3.0 (Standard, Pro, 4K, Turbo, Motion Control), Kling 2.6, Kling O3, Kling Omni, Seedance 2.5, Seedance 2.0, Wan 3.0, Wan 3.0 Prime, Wan 2.7, Wan 2.6, Genjutsu, Cinema Studio 4.0, HappyHorse 1.1, LTX-2.5, MiniMax H3, Hailuo 2.3, PixVerse V6, Grok Imagine Video 1.5.
     - **Image & Enhancement:** SOUL V2, SOUL Standard, SOUL Cinema, Marketing Studio Image, Ads Studio, Grok Image 2.0, Recraft V4.1 / V4.1 Pro / Utility, Qwen Image 3, Ideogram 4.0, Z-Image Turbo, Speak 2.0 Lip-Sync.
   - Setiap model memiliki parameter resmi yang terdefinisi jelas (mis. `duration`, `resolution`, `aspect_ratio`, `sound`, `mode`).
2. **Endpoint Estimasi Harga & Credit (`POST https://api.higgsfield.ai/estimate/{endpoint_id}`):**
   - Endpoint resmi ini mengembalikan `{"credits": "...", "usd": "..."}` tetapi **wajib menggunakan header autentikasi API Key berbayar** (`Authorization: Key ${HF_API_KEY_ID}:${HF_API_KEY_SECRET}`).
   - Sesuai prinsip produk & keputusan pengguna (*ramah pengguna non-teknis tanpa meminta API Key teknis dan tanpa API berbayar*):
     - Aplikasi membundel katalog model dan parameter resmi yang telah diverifikasi dari `docs.higgsfield.ai` beserta tarif/credit referensi publik yang terdokumentasi.
     - Untuk model/kombinasi parameter yang memiliki referensi tarif publik resmi, status ditampilkan sebagai **`Verified`** lengkap dengan URL sumber dan timestamp verifikasi.
     - Untuk kombinasi model/parameter yang tarif publiknya belum diterbitkan tanpa akun, status ditampilkan secara jujur sebagai **`Unavailable` (Belum Tersedia)** dan pengguna dapat mengisi tarif/credit langsung di tabel (otomatis diberi label **`Manual`**). Aplikasi **tidak pernah mengarang tarif atau menganggap item tanpa tarif sebagai gratis (\$0)**.

---

## 2. Hasil Verifikasi Sumber Kurs USD/IDR Gratis (PRD Bab 9.3)

| Urutan | Nama Sumber | Endpoint Publik (Tanpa API Key) | Jenis Kurs | Status Verifikasi |
| :--- | :--- | :--- | :--- | :--- |
| **Utama (Primary)** | **Frankfurter API (European Central Bank)** | `https://api.frankfurter.dev/latest?from=USD&to=IDR` | Kurs Referensi Bank Sentral (ECB Reference Rate) | **Terverifikasi & Aktif** (JSON publik, gratis, tanpa batas API key) |
| **Cadangan (Secondary)** | **Open ExchangeRate API** | `https://open.er-api.com/v6/latest/USD` | Kurs Pasar Tengah (Market Mid-Rate) | **Terverifikasi & Aktif** (JSON publik, gratis, atribut sumber jelas) |
| **Fallback Lokal 1** | **Cache Lokal Terakhir** | Penyimpanan lokal aplikasi | Sesuai kurs terakhir yang berhasil diambil | Otomatis diberi status **`Stale` (Usang)** saat offline |
| **Fallback Lokal 2** | **Input Manual Pengguna** | Input UI (`Data Settings`) | Kurs Manual Pengguna (`Manual Input`) | Otomatis diberi status **`Manual`** di UI dan laporan PDF |
