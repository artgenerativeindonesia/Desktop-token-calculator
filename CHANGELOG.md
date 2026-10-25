# Buku Daftar Isi Versi & Riwayat Perubahan (`CHANGELOG.md`)

Selamat datang di **Buku Catatan Versi (Changelog)** aplikasi **AI Video Budget Calculator**.
Buku ini berfungsi seperti "daftar isi perjalanan" aplikasi Anda. Setiap kali ada pembuatan aplikasi baru, penambahan fitur, atau perbaikan kecil, semuanya dicatat di sini beserta **Label Mesin Waktu (`vX.Y.Z`)** agar Anda bisa kembali ke versi mana pun kapan saja dengan mudah.

---

## Panduan Membaca Nomor Versi (`X.Y.Z`)
- **Angka Pertama (`1.0.0` $\rightarrow$ `2.0.0`)**: Berubah jika ada perombakan besar secara menyeluruh pada aplikasi.
- **Angka Tengah (`1.0.0` $\rightarrow$ `1.1.0`)**: Berubah setiap kali ada penambahan **fitur baru**.
- **Angka Ketiga (`1.0.0` $\rightarrow$ `1.0.1`)**: Berubah setiap kali ada **perbaikan kecil** atau perapian tampilan/teks.

---

## Versi [1.2.6] - Penyelarasan Format Dokumen PDF Langkah 5 Sesuai Model Perkalian Cadangan
- **Tanggal Perubahan**: 26 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.2.6`

### Diubah (Changed)
1. **Format Tabel Rincian Adegan Dokumen PDF Sesuai Model Perkalian Cadangan**:
   - Menghapus tampilan kolom cadangan lama yang selalu bernilai `$0.00` atau `+0 cadangan` yang membingungkan.
   - Kolom perhitungan adegan kini menampilkan rumus perkalian langsung yang bersih:
     `7 gambar × 10 cadangan = 70x buat`.
   - Kolom rincian biaya kini memperlihatkan konsumsi Credit Higgsfield serta Subtotal Rupiah & USD yang akurat.
2. **Penyempurnaan 7 Bagian Resmi Dokumen PDF**:
   - **Bagian 1 (Ringkasan Eksekutif)**: Menampilkan Total Anggaran (Rupiah & USD), Faktor Cadangan Langkah 2 (`10x Cadangan`), Total Kali Pembuatan AI, dan Total Konsumsi Credit.
   - **Bagian 2 (Pengaturan Proyek & Cadangan Langkah 2)**: Menampilkan nama proyek, patokan kurs dolar, kebutuhan adegan, dan rumus perhitungan jelas (`Kebutuhan adegan × 10 cadangan = Total kali buat`).
   - **Bagian 6 (Total Anggaran & Ringkasan Pembuatan)**: Menyajikan rekapan rapi jumlah adegan pokok, faktor cadangan pengali, total generasi AI, dan total anggaran tanpa menampilkan baris cadangan Rp 0 yang tidak relevan.
3. **Pembaruan Layar Antarmuka Langkah 5 (Dokumen Siap Cetak)**:
   - Kartu utama Langkah 5 kini menyajikan keterangan rumus pengali: `X adegan × Y cadangan = Z kali buat`.
   - Jendela popup *Atur Isi Laporan* diperbarui penomorannya (Bagian 1 s/d 7) agar persis merefleksikan susunan dokumen PDF.

### Diperbaiki (Fixed)
1. **Fitur Pengaturan Bagian Dokumen PDF Berfungsi Dinamis**:
   - Seluruh checkbox di dalam jendela "Atur Isi Laporan" kini terhubung langsung ke mesin pencetak PDF sehingga bagian yang tidak dicentang akan otomatis dihilangkan dari dokumen pratinjau dan hasil cetak PDF.

---

## Versi [1.2.5] - Perbaikan Akurasi Hasil Perkalian Cadangan (7 gambar × 10 cadangan = 70x buat)
- **Tanggal Perubahan**: 26 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.2.5`

### Diperbaiki (Fixed)
1. **Penghapusan Penambahan Cadangan Ganda**:
   - Memperbaiki bug di mana mesin kalkulasi sebelumnya menambahkan sisa cadangan global (+10) di atas hasil perkalian ($7 \times 10 = 70 + 10 = 80\text{x}$).
   - Sekarang hasil perhitungan tepat murni perkalian langsung: $7\text{ gambar} \times 10\text{ cadangan} = \mathbf{70\text{x buat}}$ (dan total biaya serta Credit dihitung tepat untuk 70 kali buat, bukan 80).
2. **Pembersihan Nilai Cadangan Tambahan**:
   - Memastikan `reserve_generations_override` dan `reserve_percent` selalu di-reset ke 0 saat mode perkalian cadangan aktif, sehingga tidak ada lagi angka siluman yang menambah jumlah generasi di latar belakang.

---

## Versi [1.2.4] - Penyesuaian Rumus Perkalian Cadangan Langkah 2 Sesuai Keinginan Pengguna
- **Tanggal Perubahan**: 26 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.2.4`

### Diubah (Changed)
1. **Rumus Perkalian Cadangan Langsung di Langkah 3 (Atur Detail)**:
   - Mengubah kalimat ringkasan dan rumus perhitungan sesuai instruksi langsung pengguna:
     - **Sebelumnya (Keliru)**: `Kebutuhan: 20 gambar • Ditambah Cadangan Langkah 2 (+50%)` menghasilkan `30x buat`.
     - **Sekarang (Sesuai Permintaan)**: `Kebutuhan: 20 gambar • Dikalikan Cadangan Langkah 2 ([angka jumlah cadangannya])` langsung menghasilkan `200x buat` (misal 20 gambar × 10 cadangan = 200 kali buat).
2. **Penghapusan Total Format Persentase Membingungkan**:
   - Menghilangkan persentase seperti `(+50%)` atau `(+20%)` yang membingungkan bagi pengguna non-programmer, dan menggantinya dengan angka jumlah cadangan yang konkret (misal: `10 cadangan`).
3. **Penyederhanaan Pengaturan Cadangan di Langkah 2 (Pengaturan Proyek)**:
   - Tampilan kolom kanan Langkah 2 kini menyajikan input langsung angka cadangan per adegan/gambar:
     - Pilihan Cepat: `2 cadangan (Hemat)`, `5 cadangan (Standar)`, `10 cadangan (Aman)`.
     - Kotak input angka dan slider yang mudah digeser (1 s/d 20 cadangan).
     - Keterangan rumus yang sangat jelas: `Kebutuhan gambar × [angka] cadangan = Total kali buat`.
4. **Penyelarasan Kartu Adegan Luar & InfoTip**:
   - Kartu adegan utama kini menampilkan: `20 gambar • Total Buat: 200x (dikalikan 10 cadangan Langkah 2)`.
   - InfoTip popover menampilkan penjelasan runut dari mana asal angka 200x tersebut.

### Diperbaiki (Fixed)
1. **Sinkronisasi Otomatis Angka Cadangan**:
   - Memperbaiki pengisian `attempts_per_item` agar otomatis mengikuti angka cadangan yang ditentukan di Langkah 2, sehingga perhitungan anggaran IDR, USD, dan Credit selalu akurat dan sinkron di semua halaman aplikasi.

---

## Versi [1.2.3] - Penghapusan Total Rumus Matematika Rumit & Input Variasi
- **Tanggal Perubahan**: 25 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.2.3`

### Ditambahkan (Added)
1. **Rangkuman Bersih & Minimalis (Bebas Matematika)**:
   - Kotak informasi di dalam jendela 'Atur Detail' kini tampil rapi dalam 2 baris manusiawi tanpa simbol matematika (`×`, `+`, `=`, `%`):
     - Baris 1: `Kebutuhan: 2 Gambar • Ditambah Cadangan Langkah 2 (+20%)`
     - Baris 2: `Total Anggaran Tahap Ini: Rp 8.138 (2.4 Credit)`
2. **Baris Ringkas Sederhana di Daftar Adegan**:
   - Menampilkan ringkasan to-the-point: `2 Gambar • Total Buat: 3x (sudah termasuk cadangan jaga-jaga)`.

### Diubah (Changed)
1. **Penghapusan Total Input 'Variasi'**:
   - Menghapus kolom input variasi yang sebelumnya membingungkan dan membuat perhitungan terkesan dobel. Pengguna kini hanya perlu mengisi satu hal: *"Mau Buat Berapa Gambar / Adegan?"*.
2. **Koneksi Otomatis Murni ke Cadangan Langkah 2**:
   - Jumlah gambar langsung terhubung ke persentase dana jaga-jaga cadangan yang diatur di Langkah 2 tanpa rumus perkalian panjang di layar.

---

## Versi [1.2.2] - Penghapusan Input Ganda & Penyatuan Alur Kerja Dana Jaga-Jaga
- **Tanggal Perubahan**: 25 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.2.2`

### Ditambahkan (Added)
1. **Penjelasan Alur Kerja Terpusat di Langkah 2**:
   - Menambahkan panduan ringkas bahwa pengguna tidak perlu lagi mengisi perkiraan adegan atau jumlah video di awal. Seluruh rincian aset diatur sepenuhnya di Langkah 3.
2. **Koneksi Transparan Dana Jaga-Jaga ke Adegan**:
   - Nilai persentase dana jaga-jaga (misal 20%) dari Langkah 2 kini otomatis terhubung ke setiap adegan di Langkah 3 dengan penjelasan yang lugas dan tidak membingungkan.

### Diubah (Changed)
1. **Pembersihan Input Dobel di Langkah 2 (Pengaturan Proyek)**:
   - Menghapus input yang membingungkan dan terasa dobel sebelum memulai adegan: pilihan toggle *"Cara Menghitung Kebutuhan Proyek"*, *"Target Jumlah Video Jadi"*, *"Total Durasi Video"*, dan *"Rata-rata Jumlah Adegan di Setiap Video"*.
   - Langkah 2 kini fokus murni pada 2 hal penting: **Nama Proyek** dan **Dana Jaga-Jaga (Cadangan)**.
2. **Pemisahan Tegas Istilah "Variasi" vs "Dana Jaga-Jaga"**:
   - Mengganti istilah *"Dibuat Ulang"* di dalam adegan menjadi **"Pilihan / Variasi per Gambar/Adegan"** (contoh: 2 variasi untuk dipilih 1 hasil terbaik).
   - Menghilangkan kesan "mengulang dobel-dobel" karena di adegan murni menentukan variasi pilihan, sedangkan dana jaga-jaga cadangan (+20%) otomatis ditambahkan sebagai asuransi proyek secara transparan.
3. **Kartu Rangkuman Adegan yang Bersih**:
   - Menampilkan ringkasan yang jelas: `6 gambar × 2 variasi → total 14 kali buat (termasuk 2 jaga-jaga +20%)`.

---

## Versi [1.2.1] - Perbaikan Bahasa & Kejelasan Tampilan Input Perhitungan Adegan AI
- **Tanggal Perubahan**: 25 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.2.1`

### Ditambahkan (Added)
1. **Komponen Bantuan Penjelasan (`InfoTip` / Ikon ? Interaktif)**:
   - Menambahkan ikon `(?)` kecil di samping setiap nama kolom input dan istilah penting yang memunculkan penjelasan bahasa manusia sehari-hari saat kursor disentuh atau tombol Tab difokus.
   - Menjelaskan arti 'Cadangan' (jatah percobaan ekstra jika AI kurang memuaskan) lengkap dengan asal hitungannya (misal: "20% dari 8 kali = 2 kali cadangan") dan tautan cepat *"Ubah persentase cadangan →"* menuju Langkah 2.
2. **Kalimat Ringkasan Otomatis Berbahasa Awam**:
   - Menampilkan kalimat utuh di bawah kolom input, misalnya: `4 gambar × dibuat 2 kali = 8 kali + 2 cadangan = 10 kali buat`.
   - Untuk video yang ditagih per detik, otomatis menyertakan total detik video yang ditagih (misal: `5 kali buat × 8 detik = 40 detik video yang ditagih`).

### Diubah (Changed)
1. **Penyatuan Tempat Pengisian Angka (Single Source of Truth)**:
   - Kotak input angka yang sebelumnya membingungkan karena ada di luar (kartu daftar) dan di dalam modal sekaligus, kini diubah:
     - **Kartu di luar**: Menjadi ringkasan bersih dan informatif yang hanya dibaca (misal: `4 gambar × dibuat 2 kali → total 10 kali buat (sudah termasuk 2 cadangan)`).
     - **Di dalam jendela 'Atur Detail'**: Menjadi satu-satunya tempat untuk mengetik dan mengatur angka, lengkap dengan panduan.
2. **Nama Kolom Berupa Pertanyaan Ramah & Kontekstual**:
   - Kolom yang sebelumnya hanya bertuliskan "Jumlah" dan "Coba" kini diubah menjadi pertanyaan jelas sesuai jenis asetnya:
     - `Mau Buat Berapa Gambar?` (atau `Berapa Adegan?` / `Berapa File?`)
     - `Tiap Gambar Dibuat Ulang Berapa Kali?`
     - `Panjang Tiap Adegan (Detik)`
3. **Penyempurnaan 'Satuan Hitung Harga'**:
   - Mengubah tampilan yang sebelumnya mirip kotak isian menjadi label informasi bersih dengan ikon, menerangkan bahwa model ditagih per kali buat atau per detik, beserta tarif aslinya.

---

## Versi [1.2.0] - Tambah Fitur Baru: Daftar Model Higgsfield Terbaru (75+ Model) & Sistem Pembaruan Harga 3-Lapis
- **Tanggal Perubahan**: 25 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.2.0`

### Ditambahkan (Added)
1. **Daftar Model Higgsfield Terbaru & Lengkap (75+ model di 7 jenis pembuatan)**:
   - Contoh: Soul 2.0, Soul Cinema, GPT Image 2.5, Nano Banana 2.1/Pro, Seedream 5.0, FLUX 3, Ideogram 4.5, Kling 3.0/Omni, Seedance 2.5, Google Veo 3.1, Wan 3.0, MiniMax Hailuo 2.3, Sora 2 Pro, Topaz GigaPixel, Topaz Hyperion, dan banyak lagi.
   - Setiap model diberi **label penanda** seperti di Higgsfield: `NEW` (baru rilis), `PREMIUM` (kualitas tertinggi), `POPULER` (sering dipakai), serta tanda `Unlimited Ready` jika bisa dipakai gratis di paket Unlimited.
2. **Sistem Pembaruan Harga 3-Lapis** (di halaman *Kurs & Daftar Harga*):
   - **Lapis 1 — Sinkronkan Server**: Mengambil daftar harga terbaru dari server dokumentasi Higgsfield.
   - **Lapis 2 — Pilih Paket Langganan Credit**: Pilih paket Anda (Standar API, Lite, Basic, Pro Bulanan, Pro Tahunan, Max, Team, Scale) agar nilai 1 Credit otomatis dihitung ke Dolar & Rupiah sesuai paket.
   - **Lapis 3 — Tombol "+ Tambah Model Baru"**: Jika Higgsfield merilis model baru, cukup isi nama & jumlah Credit-nya, model langsung tersedia dan tersimpan permanen.
3. **Kolom Pencarian Model**: Cari model dengan cepat (misal ketik "Kling") di antara 75+ model.
4. **Centang "Termasuk Paket Unlimited Higgsfield (Rp 0)"** pada jendela *Atur Detail* setiap adegan. Adegan yang dicentang tidak menambah biaya dan diberi tanda `UNLIMITED • Rp 0`.

### Diubah (Changed)
- **Tampilan harga kini berdampingan**: Jumlah Credit + Harga USD + Perkiraan Rupiah (misal: "1.5 Credit • Rp 1.550") di daftar harga, pilihan model, dan ringkasan adegan.
- **Ubah Harga Model kini terhubung otomatis**: Saat mengubah jumlah Credit, harga Dolar ikut terhitung sesuai paket langganan yang dipilih.
- Setiap perubahan harga di daftar harga langsung memperbarui total anggaran proyek yang sedang dibuka.

---

## Versi [1.1.0] - Tambah Fitur Baru: Jenis Pembuatan "Image to Image" serta Pemisahan "Upscale Image" & "Upscale Video"
- **Tanggal Perubahan**: 22 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.1.0`

### Ditambahkan (Added)
1. **Jenis Pembuatan AI Baru: `Image to Image` (Ubah / Edit Gambar)**:
   - Menambahkan kategori proses **Image to Image** di seluruh halaman aplikasi (Beranda, Daftar Pekerjaan AI, Ringkasan Biaya, Kurs & Daftar Harga, serta Laporan PDF).
   - Dilengkapi dengan model resmi Higgsfield untuk *Image to Image*:
     - **SOUL V2 Character & Style Reference (Image to Image)**
     - **FLUX.1 Kontext (Smart Image Edit & Restyle)**
     - **Recraft V4.1 Image-to-Image & Inpainting**
     - **SOUL V2 (Editorial & Character)**
2. **Pemisahan Jelas antara `Upscale Image` dan `Upscale Video`**:
   - Memecah kategori *Upscale* menjadi 2 kategori utama yang terpisah sehingga total terdapat **7 Jenis Pembuatan AI**:
     1. **Text to Image**
     2. **Image to Image** *(Baru)*
     3. **Image to Video**
     4. **Video to Video**
     5. **Text to Video**
     6. **Upscale Image** *(Perbesar Resolusi Gambar — dihitung per gambar tanpa kolom durasi detik)*
     7. **Upscale Video** *(Perbesar Resolusi Video — dihitung menggunakan durasi detik video)*
   - Menambahkan model khusus **Higgsfield Clarity 4K Image Upscaler & Detail Enhancer** pada kategori **Upscale Image** mendampingi **Recraft V4.1 Utility Pro**.

### Diubah (Changed)
- **Proyek Contoh Komersial Lengkap (`createSampleCommercialProject`)**: Kini mencakup contoh tahapan untuk ketujuh jenis pembuatan AI sekaligus (termasuk *Image to Image*, *Upscale Image*, dan *Upscale Video*).
- **Kompatibilitas File Proyek Lama (`.aivbudget`)**: File proyek lama yang masih memiliki label kategori `upscaling` otomatis dikenali dan dimigrasikan dengan aman saat dibuka.

### Diperbaiki (Fixed)
- Menyesuaikan formulir *popup* pengaturan adegan agar jenis berbasis gambar (*Text to Image*, *Image to Image*, *Upscale Image*) langsung menghitung per gambar tanpa menampilkan kolom durasi detik video.

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
