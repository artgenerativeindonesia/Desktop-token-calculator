# Buku Daftar Isi Versi & Riwayat Perubahan (`CHANGELOG.md`)

Selamat datang di **Buku Catatan Versi (Changelog)** aplikasi **AI Video Budget Calculator**.
Buku ini berfungsi seperti "daftar isi perjalanan" aplikasi Anda. Setiap kali ada pembuatan aplikasi baru, penambahan fitur, atau perbaikan kecil, semuanya dicatat di sini beserta **Label Mesin Waktu (`vX.Y.Z`)** agar Anda bisa kembali ke versi mana pun kapan saja dengan mudah.

---

## Panduan Membaca Nomor Versi (`X.Y.Z`)
- **Angka Pertama (`1.0.0` $\rightarrow$ `2.0.0`)**: Berubah jika ada perombakan besar secara menyeluruh pada aplikasi.
- **Angka Tengah (`1.0.0` $\rightarrow$ `1.1.0`)**: Berubah setiap kali ada penambahan **fitur baru**.
- **Angka Ketiga (`1.0.0` $\rightarrow$ `1.0.1`)**: Berubah setiap kali ada **perbaikan kecil** atau perapian tampilan/teks.

---

## Versi [1.0.1] - Perbaikan Teks & Bahasa Tampilan Agar Lebih Ramah Awam
- **Tanggal Perubahan**: 22 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.0.1`

### Ditambahkan (Added)
- Penjelasan singkat yang lebih mudah dipahami pada bagian cadangan buat ulang (*redo reserve*) dan keterangan poin *Credit* AI.

### Diubah (Changed)
1. **Menghapus Simbol & Persamaan Matematika pada Tampilan (UI & Laporan PDF)**:
   - Seluruh simbol variabel rumus seperti `Gplanned`, `Greserve`, `Gbudget`, `Bbase`, `Breserve`, `Btotal`, `Btotal / V`, `Btotal / M`, `Ctotal`, `(V)`, `(M)`, `(R)`, `(X)`, `(Si)`, `(Ai)`, dan istilah `ceil` dihapus dari layar aplikasi dan diganti dengan kalimat sehari-hari (contoh: *"Rencana Buat Awal"*, *"Cadangan Buat Ulang"*, *"Total Kali Pembuatan AI"*, *"Target Video Jadi"*, *"Rata-rata Biaya per Video Jadi"*).
2. **Menyederhanakan Istilah Teknis & Kode Dokumen**:
   - Menghapus kode teknis dokumen seperti `PRD Bab 8.10`, `FR-01`, `FR-02`, `US-03`, `US-04`, `NFR-02`, `Decimal.js`, dan `Fallback Offline` dari judul serta label tombol agar tampilan terasa bersih, hangat, dan ramah bagi pengguna awam.
   - Mengganti istilah kaku pada tombol dan lencana status (misalnya *"Usang (Cache)"* menjadi *"Data Tersimpan (Offline)"*, *"Generasi Dasar (Gplanned)"* menjadi *"Rencana Buat Awal"*, dan *"Percobaan / Shot (Ai)"* menjadi *"Berapa Kali Coba / Adegan"*).

### Diperbaiki (Fixed)
- Memperbaiki teks peringatan dan pesan notifikasi agar menggunakan bahasa sehari-hari yang jelas tanpa simbol rumus.

---

## Versi [1.0.0] - Rilis Perdana Aplikasi Dasar (MVP PRD v1.0)
- **Tanggal Perubahan**: 20 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.0.0`

### Ditambahkan (Added)
1. **Tampilan Elegan Bergaya Kaca Apple (*Apple Glassmorphism UI*)**:
   - Halaman aplikasi dengan efek kaca buram (*frosted glass*) yang elegan dan nyaman di mata.
   - Pilihan tema **Kaca Gelap (*Dark Glass*)** dan **Kaca Terang (*Light Glass*)**.
   - Pilihan **2 Bahasa Instan (Bahasa Indonesia & Bahasa Inggris)** baik untuk layar aplikasi maupun dokumen laporan PDF.
2. **6 Halaman Utama Sesuai Dokumen PRD v1.0**:
   - **Beranda Proyek (*Dashboard*)**: Tempat membuat proyek baru, membuka file proyek lama, melihat ringkasan cepat, serta tombol 1-klik **"Muat Contoh Uji PRD (Bab 8.10)"** dan **"Muat Proyek Contoh Komersial"**.
   - **Pengaturan & Cadangan (*Project Setup*)**: Mengatur nama proyek, memilih mode perhitungan (**Mode Detail Per-Shot** atau **Mode Target Video Final**), serta mengatur cadangan regenerasi.
   - **Perencana Produksi (*Production Planner*)**: Tabel interaktif untuk menyusun baris pekerjaan AI dari **5 Kategori Proses** (*Text to Image, Image to Video, Video to Video, Text to Video, Upscaling/Enhancement*).
   - **Ringkasan Anggaran (*Budget Summary*)**: Tabel perhitungan rapi dengan angka uang rata kanan (Biaya Dasar, Biaya Cadangan, Total Akhir dalam USD & Rupiah, Total Credit, Biaya per Video Final, dan Biaya per Menit Final).
   - **Kurs & Katalog Harga (*Data Settings*)**: Panel untuk memperbarui kurs USD ke Rupiah secara otomatis dari sumber resmi gratis (*Frankfurter ECB* & *Open ExchangeRate*) atau memasukkan angka kurs manual saat tanpa internet.
   - **Laporan PDF (*Export PDF*)**: Layar pratinjau langsung (*live preview*) dokumen laporan lengkap 9 bagian yang siap disimpan menjadi file PDF.
3. **Mesin Hitung Pintar & Sinkronisasi Cadangan 2 Arah**:
   - Jika Anda mengetik angka **Persentase Cadangan (`%`)**, kotak **Jumlah Generasi Cadangan** akan terhitung otomatis (dibulatkan ke atas).
   - Sebaliknya, jika Anda mengetik langsung **Jumlah Generasi Cadangan**, kotak **Persentase (`%`)** akan menyesuaikan secara otomatis.
   - Perlindungan anti-salah-hitung: model yang belum memiliki harga tidak pernah dianggap gratis (`$0`), melainkan diberi tanda peringatan yang jujur.
4. **Penyimpanan File Proyek Mandiri (`.aivbudget`) dengan Pengaman Anti-Rusak**:
   - Proyek disimpan ke dalam 1 file `.aivbudget` yang mudah dikirim ke rekan tim tanpa perlu akun cloud.
   - Menggunakan sistem *Atomic Save* (menyimpan ke file bayangan sementara terlebih dahulu sebelum menggantikan file asli agar data tidak pernah rusak jika listrik mati atau penyimpanan penuh).
5. **Pintasan Klik-Ganda Tanpa Instalasi (*Zero-Install Testing*)**:
   - File `Klik-Untuk-Testing-Tanpa-Install.bat` untuk langsung membuka aplikasi hanya dengan klik 2x tanpa menginstal apa pun ke komputer.
   - File `Jalankan-Cek-Otomatis.bat` untuk menjalankan 25 pemeriksaan otomatis terhadap seluruh rumus matematika PRD.
   - File `Buat-Publish-Installer.bat` untuk membuat file installer `.exe` bagi orang awam setelah versi aplikasi disetujui.

### Diubah (Changed)
- Belum ada (ini adalah rilis perdana versi `1.0.0`).

### Diperbaiki (Fixed)
- Belum ada (seluruh 25 pengujian otomatis lulus 100% pada rilis perdana).
