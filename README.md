# AI Video Budget Calculator (PRD v1.0)

Aplikasi desktop perencanaan anggaran produksi video AI berbasis katalog model **Higgsfield** dengan desain **Apple-Inspired Glassmorphism UI** dan dukungan dwi-bahasa (**Bahasa Indonesia & English**).

---

## 1. Cara Testing Tanpa Instalasi (Untuk No-Code Developer)

Selama tahap pengujian dan review, Anda **tidak perlu menginstal apa pun** ke komputer:

1. **Langsung Buka Aplikasi (Zero-Install):**
   - Cukup **Klik 2x (Double Click)** file **`Klik-Untuk-Testing-Tanpa-Install.bat`**.
   - Jendela aplikasi desktop akan langsung terbuka di layar Anda tanpa menginstal program ke Windows / Control Panel.
2. **Mencoba Skenario Uji PRD Bab 8.10 dengan 1 Klik:**
   - Di halaman **Beranda Proyek (Dashboard)**, klik tombol hijau **"Muat Contoh Uji PRD (Bab 8.10)"**.
   - Aplikasi otomatis mengisi:
     - Generasi Dasar ($G_{\text{planned}}$) = `10`
     - Cadangan Regenerasi ($R$) = `20%` $\rightarrow$ Generasi Cadangan ($G_{\text{reserve}}$) = `2`
     - Total Generasi Dianggarkan ($G_{\text{budget}}$) = `12`
     - Tarif Uji = `USD 2` per generasi $\rightarrow$ Biaya Dasar = **`$20.00`**, Biaya Cadangan = **`$4.00`**, Total = **`$24.00`**.
3. **Mencoba Sinkronisasi 2 Arah Cadangan Regenerasi:**
   - Buka menu **Pengaturan & Cadangan**.
   - Ubah angka **Persentase Cadangan (%)**, maka kotak **Jumlah Generasi Cadangan** akan berubah otomatis.
   - Sebaliknya, ketik langsung angka di kotak **Jumlah Generasi Cadangan**, maka angka **Persentase (%)** akan menyesuaikan secara otomatis.
4. **Cek Otomatis Seluruh Rumus Matematika:**
   - Klik 2x file **`Jalankan-Cek-Otomatis.bat`** untuk melihat laporan pengujian otomatis (`PASS`) terhadap seluruh kriteria PRD.

---

## 2. Cara Membuat Versi Publish & Instalasi untuk Orang Awam (Setelah Disetujui)

Apabila versi aplikasi sudah Anda coba dan **disetujui (Approved untuk Publish)**:
1. Klik 2x file **`Buat-Publish-Installer.bat`** (atau beri tahu AI Agent untuk membuatkan versi publish).
2. Di dalam folder `release/` akan tersedia:
   - **`AI Video Budget Calculator-1.0.0-portable.exe` (Tanpa Instalasi):** Cukup bagikan 1 file ini ke pengguna awam; klik 2x langsung jalan.
   - **`AI Video Budget Calculator-1.0.0-nsis.exe` (Installer Standar):** Klik 2x untuk memasang aplikasi ke Desktop & Start Menu Windows.
   - **Untuk macOS:** Jalankan `npm run dist:mac` pada perangkat Mac untuk menghasilkan file `.dmg`.
