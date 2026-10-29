# AI Video Budget Calculator (`v2.1.3`) — Studio Edition (Windows & macOS)

Aplikasi desktop profesional untuk perencanaan dan perhitungan anggaran produksi video AI studio terpadu: **Higgsfield (Video & Gambar)**, **ElevenLabs (Voice Over & Pengisi Suara)**, dan **Suno AI (Musik, Soundtrack & Pemisahan Stems)**. Dilengkapi antarmuka **Studio Glassmorphism UI** (Mode Gelap & Terang) serta dukungan dwi-bahasa (**Bahasa Indonesia & English**).

> **Buku Panduan Lengkap**: Untuk penjelasan langkah demi langkah yang ramah pemula, silakan buka **[PANDUAN-INSTALASI-DAN-PENGGUNAAN.md](PANDUAN-INSTALASI-DAN-PENGGUNAAN.md)**.
> **Buku Catatan Perubahan**: Untuk riwayat versi dan titik mesin waktu, buka **[CHANGELOG.md](CHANGELOG.md)**.

---

## 4 Pilar Utama Versi 2.1.3 (Studio Edition)

1. **Alur Produksi Multi-Video (Tahap 1)**:
   - Tentukan target jumlah video jadi di Langkah 2 (misal: 5 video).
   - Langkah 3 memproyeksikan kebutuhan untuk *1 video utuh*. Total anggaran akhir otomatis dikalikan jumlah video secara transparan, lengkap dengan penjabaran matematika dan kotak *disclaimer* resmi di UI serta di dokumen cetak PDF.
2. **Kalkulator Durasi Bersih Video (Tahap 2)**:
   - Menghitung panjang durasi video pokok secara murni tanpa menggelembungkan waktu upscale dan tanpa cadangan coba-coba.
   - Menyajikan perbandingan antara Target Durasi Bersih Post-Produksi dan Durasi Mentah Shot AI beserta *safety buffer* ruang potong editor video.
3. **Kategori Voice Over Resmi ElevenLabs (Tahap 3)**:
   - Terhubung dengan katalog model resmi ElevenLabs (*Multilingual v2*, *Flash v2.5*, *Turbo v2.5*, kuota karakter/kredit) dan paket langganan resmi (*Free*, *Starter*, *Creator*, *Pro*, *Scale*, *Business*).
   - Input numerik karakter audio yang presisi tanpa mewajibkan naskah teks.
4. **Kategori Musik & Soundtrack Resmi Suno AI (Tahap 4)**:
   - Terhubung langsung dengan katalog resmi Suno AI (*v6 Flagship Studio*, *v6-wild*, *v6-mini*, *v4*, *v3.5*, *v3*) dengan konsumsi resmi 10 kredit per kali pembuatan (menghasilkan 2 variasi klip lagu siap pakai).
   - Pengaturan pemisahan track audio (**Stems Separation**): *2-Stems Split* (+20 Cr) dan *Full Studio Stems* (+50 Cr) serta sinkronisasi durasi musik dengan timeline storyboard video.

---

## 1. Cara Menjalankan di Windows (Zero-Install & Installer)

1. **Langsung Buka Tanpa Instalasi (*Zero-Install* — Paling Cepat):**
   - Cukup **Klik 2x (Double Click)** file **`Klik-Untuk-Testing-Tanpa-Install.bat`**.
   - Jendela aplikasi desktop akan langsung terbuka tanpa menginstal program ke Control Panel Windows.
2. **Membuat File Installer Windows (`.exe` Setup & Portable):**
   - Klik 2x file **`Buat-Publish-Installer.bat`**.
   - Buka folder **`release/`** untuk mendapatkan file:
     - **`AI Video Budget Calculator-2.1.3-portable.exe`** (Klik 2x langsung jalan dari mana saja / flashdisk).
     - **`AI Video Budget Calculator-2.1.3-nsis.exe`** (Installer resmi yang memasang ikon ke Desktop & Start Menu Windows).
3. **Pemeriksaan Rumus Otomatis (Anti-Bug Guarantee):**
   - Klik 2x file **`Jalankan-Cek-Otomatis.bat`** untuk menjalankan seluruh uji otomatis Vitest (116 tes lulus 100%).

---

## 2. Cara Menjalankan di Mac / macOS (Apple Silicon M1/M2/M3/M4 & Intel)

Salin folder proyek ini ke komputer Mac Anda (pastikan **Node.js LTS** dari [nodejs.org](https://nodejs.org) sudah terpasang di Mac), lalu gunakan salah satu tombol perintah 1-Klik (`.command`) berikut:

1. **Pilihan Tercepat — Pasang Langsung ke Folder `/Applications` Mac (1-Klik):**
   - **Klik 2x** file **`Install-Langsung-Ke-Mac.command`** (atau Klik Kanan $\rightarrow$ Open saat pertama kali).
   - Script otomatis membungkus aplikasi menjadi `AI Video Budget Calculator.app`, memasangnya ke folder **`/Applications`** (Launchpad), membuka izin *Gatekeeper* Apple (`xattr -cr`), dan menyalakan aplikasinya.
2. **Membuat File Installer `.DMG` & `.ZIP` untuk Mac:**
   - **Klik 2x** file **`Buat-Publish-Installer-Mac.command`**.
   - Folder **`release/`** akan otomatis terbuka berisi file **`.dmg`** dan **`.zip`** siap dibagikan ke Mac lain.
3. **Langsung Buka Tanpa Instalasi di Mac (*Zero-Install*):**
   - **Klik 2x** file **`Klik-Untuk-Testing-Tanpa-Install-Mac.command`**.
4. **Pemeriksaan Rumus Otomatis di Mac:**
   - **Klik 2x** file **`Jalankan-Cek-Otomatis-Mac.command`**.

*(Tips: Jika file `.command` terkunci setelah disalin dari flashdisk, buka Terminal di folder proyek lalu jalankan `chmod +x *.command`).*

---

## 3. Alur Kerja 6 Langkah Aplikasi

1. **Langkah 01 (Beranda / Dashboard)**: Intip ringkasan biaya proyek, formula multi-video, dan kredit multi-provider (Higgsfield, ElevenLabs, Suno).
2. **Langkah 02 (Pengaturan & Cadangan Proyek)**: Atur nama proyek, target jumlah video jadi, durasi target video, dan pengali cadangan coba-coba (*re-roll*).
3. **Langkah 03 (Daftar Pekerjaan AI / Production Planner)**: Susun shot video pokok (proyeksi 1 video), aset gambar, voice over ElevenLabs, dan musik Suno AI beserta pemisahan stems.
4. **Langkah 04 (Ringkasan Biaya / Budget Summary)**: Analisis perbandingan biaya 1 video vs total seluruh video, unit economics, dan kartu ringkasan provider khusus.
5. **Langkah 05 (Cetak Laporan PDF / Export PDF)**: Pratinjau dokumen ukuran A4 siap cetak dengan kotak *disclaimer* resmi multi-video dan simpan sebagai file PDF berkualitas tinggi.
6. **Langkah 06 (Kurs Rupiah & Daftar Harga / Data Settings)**: Sinkronisasi kurs USD-IDR otomatis atau manual, kelola paket langganan Higgsfield, ElevenLabs, dan Suno AI, serta perbarui katalog model.
