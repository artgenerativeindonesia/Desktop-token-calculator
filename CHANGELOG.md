# Buku Daftar Isi Versi & Riwayat Perubahan (`CHANGELOG.md`)

Selamat datang di **Buku Catatan Versi (Changelog)** aplikasi **AI Video Budget Calculator**.
Buku ini berfungsi seperti "daftar isi perjalanan" aplikasi Anda. Setiap kali ada pembuatan aplikasi baru, penambahan fitur, atau perbaikan kecil, semuanya dicatat di sini beserta **Label Mesin Waktu (`vX.Y.Z`)** agar Anda bisa kembali ke versi mana pun kapan saja dengan mudah.

---

## Panduan Membaca Nomor Versi (`X.Y.Z`)
- **Angka Pertama (`1.0.0` $\rightarrow$ `2.0.0`)**: Berubah jika ada perombakan besar secara menyeluruh pada aplikasi.
- **Angka Tengah (`1.0.0` $\rightarrow$ `1.1.0`)**: Berubah setiap kali ada penambahan **fitur baru**.
- **Angka Ketiga (`1.0.0` $\rightarrow$ `1.0.1`)**: Berubah setiap kali ada **perbaikan kecil** atau perapian tampilan/teks.

---

## Versi [1.0.3] - Tata Letak Berbasis Hierarki Visual, Titik Fokus (Emphasis), Kenyamanan UX, & Jendela Popup Kaca Buram (Frosted Glass)
- **Tanggal Perubahan**: 22 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.0.3`

### Ditambahkan (Added)
1. **Sistem Jendela *Popup Kaca Buram* Mewah (`FrostedModal.tsx`)**:
   - Menambahkan komponen jendela *popup* bergaya kaca buram (*frosted glass*) berlapis dengan efek blur halus (`backdrop-filter: blur(32px)`), kilau tepi kaca (*specular rim*), dan tombol tutup cepat (`Esc`).
   - Memindahkan rincian tabel panjang, panduan cara kerja, manajemen file proyek, kustomisasi bagian PDF, serta formulir pengeditan adegan lengkap ke dalam jendela *popup* yang rapi agar layar utama selalu lega dan nyaman dipandang.
2. **Penunjuk Alur Langkah demi Langkah (`StepFlowBar.tsx`)**:
   - Menambahkan bilah penunjuk langkah di bagian bawah setiap halaman (*"Tahap 1 dari 5"*, *"Tahap 2 dari 5"*, dst.) lengkap dengan tombol kembali dan tombol lanjut yang jelas agar pengguna selalu tahu langkah apa yang harus dilakukan berikutnya.
3. **3 Tingkatan Hierarki Visual Kartu (*3-Tier Visual Hierarchy*)**:
   - **Tingkat 1 — Titik Fokus Utama (`.vv-card-hero-*`)**: Hanya 1 per layar dengan pendar cahaya biru studio dan ukuran huruf paling menonjol untuk angka **Total Seluruh Anggaran**.
   - **Tingkat 2 — Area Kerja Pendukung (`.glass-card-*`)**: Kartu kerja bersih untuk pengaturan dan daftar ringkasan utama.
   - **Tingkat 3 — Informasi Pelengkap Tenang (`.vv-card-quiet`)**: Kotak informasi lembut untuk rincian tambahan agar tidak berebut perhatian mata pengguna.

### Diubah (Changed)
1. **Perapian Tata Letak (*Layout*) di Seluruh 6 Halaman**:
   - **Beranda Proyek (`DashboardView`)**: Mengubah tata letak menjadi fokus ganda (Identitas Proyek di kiri & Total Anggaran Utama di kanan) dilengkapi 3 kartu pendukung yang seimbang, sementara menu buka proyek contoh dan tabel rincian kategori dipindahkan ke jendela *popup frosted glass*.
   - **Pengaturan & Cadangan (`ProjectSetupView`)**: Menambahkan tombol pilihan cepat cadangan (`10% Hemat`, `20% Standar`, `35% Aman`) dan memindahkan teks penjelasan panjang ke dalam *popup* **"Penjelasan Cara Hitung & Cadangan"**.
   - **Daftar Pekerjaan AI (`ProductionPlannerView`)**: Mengubah tampilan daftar adegan yang tadinya sangat padat (11 kolom input per baris) menjadi baris kartu ringkas yang mudah dipindai mata, sementara pengaturan lengkap adegan dibuka melalui *popup frosted glass* **"Atur Detail Adegan"**.
   - **Ringkasan Biaya (`BudgetSummaryView`)**: Menampilkan grafik batang proporsi biaya per jenis AI dan tabel ringkas 5 kolom di layar utama, serta memindahkan tabel audit 10 kolom ke dalam *popup frosted glass*.
   - **Kurs & Daftar Harga (`DataSettingsView`)**: Menyatukan kartu kurs otomatis dan manual ke dalam 1 tampilan utama yang bersih dengan *popup* khusus untuk pengisian kurs manual dan pengubahan harga acuan model AI.
   - **Cetak Laporan PDF (`ExportPdfView`)**: Merapikan tinggi pratinjau kertas A4 agar proporsional di layar laptop serta menambahkan *popup* **"Atur Isi Laporan"** dan **"Perbesar Pratinjau"**.

### Diperbaiki (Fixed)
- Mengatasi masalah kepadatan informasi (*cognitive overload*) pada layar *Production Planner*, *Dashboard*, dan *Budget Summary* tanpa mengurangi kelengkapan informasi sedikit pun.

---

## Versi [1.0.2] - Pembaruan Tampilan Visual Bergaya Visuvate Studio (Awwwards)
- **Tanggal Perubahan**: 22 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.0.2`

### Ditambahkan (Added)
1. **Sistem Desain Visual *Visuvate Studio* (`awwwards.com/sites/visuvate-studio`)**:
   - **Aksen Tipografi Serif Miring Editorial (`.vv-accent`)**: Menggabungkan huruf modern yang tegas dengan kata aksen *serif miring* khas Visuvate Studio pada judul halaman utama.
   - **Penomoran Urutan Studio (`01` s/d `06`)**: Menambahkan nomor urut rapi (`01`, `02`, `03`...) pada menu samping (*sidebar*), kartu ringkasan *bento*, dan baris pekerjaan, lengkap dengan titik indikator menyala biru elektrik (`#0099FF`).
   - **Latar Belakang *Architectural Ribs* & Sakelar Tema Khas Visuvate**: Menambahkan garis-garis vertikal tipis berjarak rapi di latar belakang serta tombol sakelar geser (*pill switch*) untuk berpindah antara **Mode Gelap Hitam Pekat (`#000000` & `#141414`)** dan **Mode Terang Abu-abu Arsitektural (`#F6F6F6` & `#FFFFFF`)**.

### Diubah (Changed)
- **Gaya Tombol & Kartu *Bento* (`vv-btn-primary`, `vv-btn-accent`, `vv-badge-pill`)**: Mengubah tombol utama menjadi kapsul kontras tinggi (putih bersih dengan teks hitam pekat saat mode gelap, dan hitam pekat dengan teks putih saat mode terang) serta mempertegas garis tepi tipis (*hairline border*) pada seluruh kartu dan tabel.

### Diperbaiki (Fixed)
- Menjaga kontras warna teks dan kolom input agar tetap tajam dan mudah dibaca baik pada mode gelap maupun mode terang.

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
