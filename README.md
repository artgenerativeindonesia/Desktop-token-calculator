# AI Video Budget Calculator (`v1.7.0`) — Windows & macOS

Aplikasi desktop perencanaan anggaran produksi video AI berbasis katalog model **Higgsfield** dengan desain **Studio Glassmorphism UI** (Mode Gelap & Mode Terang) serta dukungan dwi-bahasa (**Bahasa Indonesia & English**).

> **Buku Panduan Lengkap**: Untuk penjelasan yang sangat rinci dari awal sampai akhir, silakan buka file **[PANDUAN-INSTALASI-DAN-PENGGUNAAN.md](PANDUAN-INSTALASI-DAN-PENGGUNAAN.md)**.

---

## 1. Cara Instalasi & Menjalankan di Windows (Tetap Seperti Semula)

1. **Langsung Buka Tanpa Instalasi (*Zero-Install*):**
   - Cukup **Klik 2x (Double Click)** file **`Klik-Untuk-Testing-Tanpa-Install.bat`**.
   - Jendela aplikasi akan langsung terbuka tanpa menginstal program ke Windows / Control Panel.
2. **Membuat File Installer Windows (`.exe` Setup & Portable):**
   - Klik 2x file **`Buat-Publish-Installer.bat`**.
   - Buka folder **`release/`** untuk mendapatkan:
     - **`AI Video Budget Calculator-1.7.0-portable.exe`** (Klik 2x langsung jalan tanpa instalasi).
     - **`AI Video Budget Calculator-1.7.0-nsis.exe`** (Installer standar yang memasang ikon ke Desktop & Start Menu Windows).
3. **Pemeriksaan Rumus Otomatis:**
   - Klik 2x file **`Jalankan-Cek-Otomatis.bat`** untuk menjalankan 25 pengujian otomatis.

---

## 2. Cara Instalasi & Menjalankan di Mac / macOS (Apple Silicon M1/M2/M3/M4 & Intel)

Salin folder proyek ini ke komputer Mac Anda (pastikan **Node.js LTS** dari [nodejs.org](https://nodejs.org) sudah terpasang di Mac), lalu pilih salah satu dari **3 tombol khusus Mac (`.command`)** berikut:

1. **Pilihan Tercepat — Pasang Langsung ke Folder `/Applications` Mac (1-Klik):**
   - **Klik 2x** file **`Install-Langsung-Ke-Mac.command`** (atau **Klik Kanan $\rightarrow$ Open** saat pertama kali).
   - Script ini otomatis membungkus aplikasi menjadi `AI Video Budget Calculator.app`, memasangnya langsung ke folder **`/Applications`** (Launchpad) di Mac Anda, membuka kunci izin *Gatekeeper* Apple (`xattr -cr`), dan langsung menyalakan aplikasinya!
2. **Membuat File Installer `.DMG` & `.ZIP` untuk Mac:**
   - **Klik 2x** file **`Buat-Publish-Installer-Mac.command`**.
   - Setelah selesai, folder **`release/`** akan otomatis terbuka berisi file **`.dmg`** dan **`.zip`** siap pakai untuk dibagikan ke komputer Mac mana saja.
3. **Langsung Buka Tanpa Instalasi di Mac (*Zero-Install*):**
   - **Klik 2x** file **`Klik-Untuk-Testing-Tanpa-Install-Mac.command`** untuk langsung menjalankan aplikasi tanpa menginstalnya ke folder Applications.
4. **Pemeriksaan Rumus Otomatis di Mac:**
   - **Klik 2x** file **`Jalankan-Cek-Otomatis-Mac.command`**.

*(Tips: Jika file `.command` tidak bisa diklik 2x setelah disalin dari flashdisk, buka Terminal di folder proyek lalu jalankan `chmod +x *.command` satu kali saja).*

---

## 3. Ringkasan Cara Penggunaan Aplikasi Versi Terbaru (`v1.7.0`)

1. **Beranda (*Dashboard*)**:
   - Lihat **Estimasi Total Anggaran** (Rupiah, USD, & Credits), rumus **`Total Kebutuhan × Cadangan = Total Kali Buat`**, serta rata-rata biaya per 1 video jadi dan per 1 menit durasi.
   - Klik **"Muat Contoh Proyek Iklan"** untuk mencoba simulasi lengkap 7 tahapan produksi.
2. **Langkah 1–2 (Pengaturan Proyek & Cadangan)**:
   - Isi **Nama Proyek**, **Jumlah Video Jadi**, dan **Total Durasi (Menit)**.
   - Pilih **Berapa Kali Cadangan per Adegan** (`1x`, `2x`, `3x`, `5x`, atau ketik sendiri). Angka cadangan ini otomatis mengalikan seluruh tahapan adegan Anda (`Total = Kebutuhan × Cadangan`).
3. **Langkah 3 (Rencana Adegan)**:
   - Pilih **Paket Langganan Higgsfield** (*Basic, Pro, Ultimate, Creator, atau Eceran*) di bagian atas.
   - Klik **"Tambah Tahapan"** atau **"Atur Adegan"** untuk memilih model AI di jendela *popup*, mengisi jumlah adegan, durasi detik, atau mencentang fitur **Unlimited (Rp 0)**.
4. **Langkah 4 (Ringkasan Biaya)**:
   - Periksa total anggaran keseluruhan, rincian **`Kebutuhan × Cadangan = Total Kali Buat`**, biaya rata-rata per video & per menit, serta tabel rincian per tahapan.
5. **Katalog & Kurs**:
   - Perbarui kurs Dolar ke Rupiah secara otomatis dari internet atau masukkan kurs tetap secara manual, serta kelola daftar model AI.
6. **Langkah 5 (Cetak PDF)**:
   - Lengkapi identitas laporan, lihat pratinjau kertas ukuran A4 di sebelah kanan, lalu klik **"Simpan sebagai PDF"**.
