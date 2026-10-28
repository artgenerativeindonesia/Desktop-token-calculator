# Buku Daftar Isi Versi & Riwayat Perubahan (`CHANGELOG.md`)

Selamat datang di **Buku Catatan Versi (Changelog)** aplikasi **AI Video Budget Calculator**.
Buku ini berfungsi seperti "daftar isi perjalanan" aplikasi Anda. Setiap kali ada pembuatan aplikasi baru, penambahan fitur, atau perbaikan kecil, semuanya dicatat di sini beserta **Label Mesin Waktu (`vX.Y.Z`)** agar Anda bisa kembali ke versi mana pun kapan saja dengan mudah.

---

## Panduan Membaca Nomor Versi (`X.Y.Z`)
- **Angka Pertama (`1.0.0` $\rightarrow$ `2.0.0`)**: Berubah jika ada perombakan besar secara menyeluruh pada aplikasi.
- **Angka Tengah (`1.0.0` $\rightarrow$ `1.1.0`)**: Berubah setiap kali ada penambahan **fitur baru**.
- **Angka Ketiga (`1.0.0` $\rightarrow$ `1.0.1`)**: Berubah setiap kali ada **perbaikan kecil** atau perapian tampilan/teks.

---

## Versi [1.12.0] - Integrasi Katalog Resmi Suno AI Music Generator, Manajemen Paket Langganan & Pelacakan Kredit Musik Transparan (Tahap 4)
- **Tanggal Perubahan**: 29 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.12.0`

### Ditambahkan (Added)
1. **Integrasi Penuh Katalog Model Musik Resmi Suno AI (`sunoCatalog.ts`)**:
   - Memuat 5 model musik resmi Suno:
     - **Suno v4 (Flagship Next-Gen)**: Model generasi ke-4 tercanggih dengan aransemen sinematik megah, fidelitas audio studio 48kHz, vokal sangat jernih, dan struktur lagu dinamis hingga 4–8 menit (10 kredit/generate).
     - **Suno v3.5 (Workhorse Teruji)**: Model teruji paling stabil untuk pembuatan lagu komersial lengkap (verse, chorus, bridge, outro) hingga 4 menit per generate (10 kredit/generate).
     - **Suno v3 (Klasik / Legacy)**: Model generasi ke-3 untuk jingle pendek atau melodi dasar hingga 2 menit (10 kredit/generate).
     - **Suno v6 Mini (Fast & Agile)**: Model generasi baru berkecepatan tinggi, optimal untuk pembuatan ide lagu latar cepat dan jingle (10 kredit/generate).
     - **Suno v6 (Orchestral & Studio)**: Model dengan orkestrasi multi-layer dan separasi instrumen studio tingkat lanjut (10 kredit/generate).
   - Menetapkan aturan baku resmi Suno: 1 kali tombol generate membutuhkan tepat **10 kredit Suno** dan menghasilkan **2 variasi klip lagu** siap pilih.
2. **Manajemen Paket Langganan Suno AI di Langkah 6 (`DataSettingsView.tsx`)**:
   - Menghadirkan pemilihan 3 tier langganan resmi Suno:
     - **Free**: $0/bulan (50 kredit harian reset tiap hari, lisensi non-komersial).
     - **Pro**: $10/bulan (2.500 kredit/bulan, $0.0040/kredit atau ~Rp 65/kredit, lisensi komersial penuh untuk YouTube, iklan, dan streaming).
     - **Premier**: $30/bulan (10.000 kredit/bulan, $0.0030/kredit atau ~Rp 48.75/kredit, lisensi komersial penuh & antrean prioritas tinggi).
   - Menambahkan tombol *"Perbarui Katalog Suno"* dengan konektor real-time resmi dan fallback otomatis ke snapshot lokal terverifikasi.
3. **UI Modal Khusus Musik Sineas di Langkah 3 (`ProductionPlannerView.tsx`)**:
   - Input kuantitas *"Mau Buat Berapa Track / Lagu Jadi?"* yang langsung menghitung pengali cadangan Langkah 2: `track lagu × cadangan = total kali generate Suno (variasi lagu dihasilkan)`.
   - Pilihan format musik satu-klik: *Instrumental Saja (Tanpa Vokal)* vs *Lagu Lengkap dengan Vokal AI*.
   - Tombol preset cepat genre & nuansa mood: Sinematik Megah, Upbeat & Ceria, Santai Lo-Fi, Dramatis Emosional, Ambient Elektronik, dan Tradisional Etnik.
   - Area naskah prompt musik Suno AI untuk mengatur instrumen, tempo (bpm), dan mood.
   - Pengaturan target durasi musik (detik) dengan tombol pintar *"Samakan dgn Video (+8s buffer)"* untuk memberikan jeda fade-out musik yang mulus saat diedit di timeline video editor.
   - Kartu Live Kalkulasi Suno di dalam modal yang nilainya 100% konsisten dengan footer modal dan anggaran proyek.
4. **Kartu Ringkasan Resmi Suno AI di Langkah 4 & Dokumen Cetak PDF (`BudgetSummaryView.tsx` & `pdfReportBuilder.ts`)**:
   - Menghadirkan Kartu Ringkasan Musik Resmi Suno AI di Langkah 4 yang merangkum jumlah track lagu, variasi klip lagu dihasilkan, durasi musik, kredit Suno, dan subtotal biaya musik (USD & IDR).
   - Pelacakan kredit multi-platform yang transparan: kredit Higgsfield (video/gambar), ElevenLabs (suara), dan Suno (musik) ditampilkan secara terpisah dan jelas pada ringkasan biaya dan laporan cetak PDF.
5. **Rangkaian Unit Test Lengkap Suno AI (`tests/sunoCatalog.test.ts`)**:
   - 12 unit test otomatis baru menguji integritas katalog model, tier paket langganan, rumus desimal kredit & biaya, adaptasi tarif ke katalog gabungan, dan kalkulasi proyek multi-video.

### Diubah (Changed)
1. **Klasifikasi Peran Track Musik dalam Storyboard**:
   - Item musik secara otomatis diklasifikasikan sebagai Aset Pendukung (`is_primary_shot: false`) dengan label khusus `🎵 Track Musik` sehingga biayanya terhitung sebagai *production overhead* tanpa menambah jumlah shot utama storyboard video.
2. **Isolasi Durasi Bersih Video (`cleanDurationSec`)**:
   - Memastikan durasi bersih storyboard video hanya menghitung klip shot kamera visual dan tidak membengkak ganda oleh durasi musik latar.

### Diperbaiki (Fixed)
1. **Normalisasi Kategori Skema Zod (`projectSchema.ts`)**:
   - Memperbaiki `ProcessCategorySchema` agar mengenali alias `music`, `soundtrack`, `bgm`, dan `audio_bgm` secara backward-compatible.
2. **Ketahanan Alokasi Cadangan Terhadap Asumsi Parsial (`calculationEngine.ts`)**:
   - Menambahkan pengaman `Math.floor(assumptions.reserve_generations_override || 0)` untuk mencegah nilai `NaN` jika fungsi kalkulasi dipanggil dengan objek asumsi tanpa field cadangan eksplisit.

---

## Versi [1.11.2] - Audit Presisi Kalkulasi, Akuntansi Bottom-Up Rupiah & Sinkronisasi Penuh Tahap 1–3
- **Tanggal Perubahan**: 29 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.11.2`

### Ditambahkan (Added)
1. **Pengali Tempo Bicara (`speed_preset`) pada Estimasi Durasi Voice Over (`elevenlabsCatalog.ts`, `calculationEngine.ts`, `ProductionPlannerView.tsx`, `projectStore.ts`)**:
   - Menambahkan fungsi `getSpeedPresetMultiplier` (`normal` = 1.0x, `fast` = 1.15x, `slow` = 0.85x) yang secara otomatis menyesuaikan proyeksi jumlah karakter dan kebutuhan credit ElevenLabs ketika pengguna menggunakan mode input durasi bicara.
2. **Input Kuantitas File Audio & Rincian Pengali Cadangan di Modal Voice Over (`ProductionPlannerView.tsx`)**:
   - Menambahkan input *"Mau Buat Berapa File Audio?"* langsung di dalam modal pengaturan Voice Over beserta indikator transparan perkalian cadangan Langkah 2 (`file audio × cadangan = total kali buat`).
3. **Helper Sinkronisasi Tarif Paket ElevenLabs ke Katalog (`applyElevenLabsPlanRateToCatalog`)**:
   - Memastikan perubahan paket langganan ElevenLabs (Starter, Creator, Pro, Scale, Business) langsung memperbarui tarif referensi model-model ElevenLabs di katalog gabungan tanpa mengganggu model video/gambar Higgsfield.

### Diubah (Changed)
1. **Rumus "Rata-rata Biaya per 1 Shot Utama" (`DashboardView.tsx` & `BudgetSummaryView.tsx`)**:
   - Sesuai arahan produser/sineas, metrik rata-rata per shot kini membagi **Total Seluruh Anggaran** dengan **Total Shot Utama (`total_primary_shots`)** (termasuk porsi biaya aset pendukung seperti gambar konsep, upscale, dan voice over sebagai *production overhead* pendukung shot utama, dengan *fallback* otomatis ke total item jika proyek belum memiliki shot utama).
2. **Akuntansi Bottom-Up Presisi Penuh Tanpa Selisih Pembulatan Rp 1 (`calculationEngine.ts` & `elevenlabsCatalog.ts`)**:
   - Menghitung nilai Rupiah (IDR) pada setiap baris tahap langsung dari nilai `Decimal` berpresisi penuh (tanpa pemotongan 4 desimal USD di tengah jalan), lalu menjumlahkan subtotal 1 video, subtotal kategori, dan Grand Total secara *bottom-up* dari baris tabel sehingga penjumlahan manual kalkulator dijamin 100% cocok hingga satuan Rupiah terkecil.

### Diperbaiki (Fixed)
1. **Isolasi Tarif Paket Langganan Higgsfield vs ElevenLabs (`higgsfieldCatalog.ts` & `projectStore.ts`)**:
   - Memperbaiki fungsi `applyCreditPlanRateToCatalog` agar mengecualikan model `voice_over` (ElevenLabs) sehingga penggantian paket langganan Higgsfield tidak pernah menimpa harga per credit resmi ElevenLabs.
   - Memperbaiki `resetAllCatalogOverrides` agar mengembalikan `DEFAULT_COMBINED_CATALOG` (Higgsfield + ElevenLabs) secara utuh.
2. **Sinkronisasi Kartu Live Kalkulasi Voice Over dengan Footer Modal & PDF (`ProductionPlannerView.tsx`, `BudgetSummaryView.tsx`, `pdfReportBuilder.ts`)**:
   - Memperbaiki Kartu Ringkasan Live ElevenLabs di dalam modal agar ikut mengalikan jumlah file audio dan cadangan Langkah 2 sehingga nilainya 100% identik dengan *"Subtotal Tahap Ini"* di bagian bawah modal.
   - Memperbaiki pembagi multi-video pada kartu rata-rata di Langkah 1 dan Langkah 4, menambahkan kategori `voice_over` ke daftar distribusi Langkah 1, serta menampilkan tarif per 1 file audio secara presisi di laporan PDF.

---

## Versi [1.11.1] - Penyempurnaan Terminologi File Audio & Update Katalog Lengkap 11 Model Resmi ElevenLabs (Termasuk v4 & v4 Turbo)
- **Tanggal Perubahan**: 29 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.11.1`

### Ditambahkan (Added)
1. **Pembaruan Katalog Lengkap 11 Model AI Suara Resmi ElevenLabs (`elevenlabsCatalog.ts`)**:
   - Berdasarkan riset dokumentasi API resmi ElevenLabs, menambahkan seluruh varian model resmi terbaru:
     - **Eleven v4 (Flagship Next-Gen)**: Model generasi ke-4 tercanggih dengan kedalaman emosional manusiawi, kontrol intonasi teatrikal, dialog multi-karakter, dan dukungan 90+ bahasa (1.0 credit/karakter).
     - **Eleven v4 Turbo (Low Latency Flagship)**: Model generasi ke-4 real-time (~100ms) dengan diskon hemat 50% credit (0.5 credit/karakter) dalam 90+ bahasa.
     - **Eleven Flash v2**: Model latensi kilat (~75ms) untuk kebutuhan volume tinggi hemat biaya (0.5 credit/karakter).
     - **Eleven Turbo v2**: Model percakapan cepat generasi kedua yang teruji (0.5 credit/karakter).
     - **Eleven Multilingual STS v2 (Speech to Speech)**: Model pengubah karakter suara rekaman aktor (voice changer) dengan mempertahankan intonasi, artikulasi, dan nuansa emosional asli (1.0 credit/karakter).
     - **Eleven English STS v2 (Speech to Speech)**: Model Speech-to-Speech khusus performa bahasa Inggris (1.0 credit/karakter).
   - Menjadikan total 11 model AI suara resmi ElevenLabs tersedia lengkap dan siap dipilih langsung oleh sineas.

### Diubah (Changed)
1. **Refaktor Menyeluruh Terminologi Voice Over ("File Audio" Menggantikan "Shot")**:
   - Menghapus penggunaan istilah "Shot" untuk sulih suara/voice over dan menggantinya dengan istilah baku **"file audio"** (Bahasa Indonesia) atau **"audio file"** (Bahasa Inggris).
   - Penamaan otomatis item baru disesuaikan menjadi `File Audio 01 (Nama Model)` / `Audio File 01 (Model Name)`.
   - Pertanyaan kuantitas di modal dan tabel secara dinamis menampilkan *"Mau Buat Berapa File Audio?"* saat kategori `voice_over` dipilih.
   - Kolom satuan dan rincian kuantitas voice over menampilkan satuan `file audio`, bukan `shot`.
   - Tombol simpan di dalam modal bertuliskan *"Selesai & Simpan File Audio"*.
   - Badge peran di daftar item secara khusus menampilkan badge `🎙️ File Audio` (tidak lagi tertukar atau membingungkan dengan tombol `🎬 Shot Utama`).
   - Di dalam modal pengaturan, bagian peran digantikan dengan pesan informatif ramah pengguna bahwa file audio adalah track suara tersendiri dan tidak menambah hitungan shot kamera video.
   - Pada kartu ringkasan Langkah 4 (Budget Summary), metrik diperjelas menjadi *"Jumlah File Audio"*.
   - Pada dokumen cetak PDF resmi, baris voice over secara konsisten dilabeli `🎙️ File Audio` / `🎙️ Audio File` dengan satuan `file audio`.
2. **Penyempurnaan Tombol Navigasi Departemen**:
   - Memperbaiki tombol kembali pada Departemen Voice Over dan Musik dari *"Kembali ke Adegan Video"* menjadi *"Kembali ke Shot / Video"* agar konsisten dengan standarisasi istilah bebas "adegan".

### Diperbaiki (Fixed)
1. **Integritas Pengetikan & Pengujian**:
   - Memperbarui suite tes unit dan tes kriteria penerimaan hingga mencapai 88 pengujian otomatis yang semuanya lulus 100%.
   - Menjaga nol error TypeScript (`tsc --noEmit`) dan build produksi Vite yang mulus.

---

## Versi [1.11.0] - Tahap 3: Integrasi Kategori Resmi ElevenLabs Voice Over & Fitur Dwi-Input Naskah Sineas
- **Tanggal Perubahan**: 29 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.11.0`

### Ditambahkan (Added)
1. **Integrasi Data Katalog Resmi ElevenLabs Voice Over (`elevenlabsCatalog.ts`)**:
   - Menambahkan kategori proses baru `voice_over` yang terhubung langsung dengan sumber data resmi penyedia suara AI **ElevenLabs** (bukan Higgsfield).
   - Menghadirkan seluruh 5 model AI suara resmi ElevenLabs terupdate:
     - **Eleven Multilingual v2** (1.0 credit/karakter • 29+ bahasa dunia termasuk Bahasa Indonesia dengan ekspresi emosional tinggi).
     - **Eleven Flash v2.5** (0.5 credit/karakter • diskon hemat 50% credit, latensi super kilat ~75ms, mendukung 32 bahasa).
     - **Eleven Turbo v2.5** (0.5 credit/karakter • diskon hemat 50% credit untuk respon percakapan cepat).
     - **Eleven v3** (1.0 credit/karakter • model generasi ketiga paling alami).
     - **Eleven Monolingual v1** (1.0 credit/karakter • model standar bahasa Inggris).
   - Menghadirkan seluruh 6 tingkat paket langganan resmi ElevenLabs:
     - **Paket Free** ($0/bln • 10.000 credit)
     - **Paket Starter** ($6/bln • 30.000 credit • IVC 10 suara kloning • Lisensi Komersial)
     - **Paket Creator** ($22/bln • 121.000 credit • PVC 1 slot • 192kbps)
     - **Paket Pro** ($99/bln • 600.000 credit • 3 slot PVC • Master WAV 44.1kHz)
     - **Paket Scale** ($299/bln • 1.800.000 credit • 3 kursi tim)
     - **Paket Business** ($990/bln • 6.000.000 credit • 10 kursi tim)
   - Jalur pembaruan katalog offline-first yang aman dan gratis tanpa mewajibkan pengguna awam membeli atau memasukkan API key, plus dukungan opsional input `xi-api-key` bagi pengguna yang memiliki akun personal.

2. **Fitur Dwi-Input Sineas di Langkah 3 (Teks Naskah <-> Durasi Detik Bicara)**:
   - Sineas dapat menyusun narasi suara melalui dua cara yang saling sinkron otomatis:
     - **Cara 1 (Ketik/Tempel Teks Naskah)**: Pengguna mengetik atau menempel naskah dialog ke dalam kotak teks; sistem otomatis menghitung jumlah karakter, jumlah kata, dan memperkirakan durasi bicara secara langsung.
     - **Cara 2 (Input Durasi Detik)**: Pengguna yang belum memiliki naskah lengkap bisa memasukkan target durasi suara (lengkap dengan preset `5s`, `10s`, `15s`, `30s`, `60s`), lalu sistem otomatis menghitung estimasi batas karakter naskah yang ideal.
   - **Tombol Pintar Sinkronisasi Durasi Video ("🎯 Samakan dgn Video")**: Sineas dapat langsung menyamakan durasi voice over dengan target durasi video jadi dari Langkah 2 hanya dengan satu kali klik.
   - **Profil Kecepatan Bicara Bilingual**:
     - 🇮🇩 **Bahasa Indonesia**: ~14.5 karakter/detik (~870 karakter/menit, ~125 WPM).
     - 🇬🇧 **Bahasa Inggris**: ~16.5 karakter/detik (~990 karakter/menit, ~145 WPM).
   - Kotak ringkasan instan di dalam modal yang memperlihatkan model suara ElevenLabs, pengali credit (0.5x atau 1.0x), total karakter, total credit, dan estimasi biaya Rupiah & USD.

3. **Pemisahan Bersih Saldo Credit Higgsfield vs ElevenLabs di Langkah 4 & PDF**:
   - Memastikan credit ElevenLabs (berbasis karakter teks) dipisahkan secara tegas dan transparan dari credit Higgsfield (berbasis frame gambar/video).
   - Menampilkan kartu ringkasan khusus **"Ringkasan Voice Over Resmi ElevenLabs"** di Langkah 4 (Budget Summary) dengan rincian: jumlah baris narasi, total karakter naskah, total durasi bicara, kredit ElevenLabs, dan total biaya Rupiah/USD.
   - Memperbarui dokumen cetak PDF agar menampilkan baris Voice Over dengan jumlah karakter, durasi bicara, model ElevenLabs, dan kotak konsumsi credit terpisah untuk Higgsfield dan ElevenLabs.

4. **Pengaturan Paket Langganan & Konektor ElevenLabs di Langkah 6 (`DataSettingsView.tsx`)**:
   - Menyediakan kartu interaktif pilihan paket langganan ElevenLabs aktif (Free, Starter, Creator, Pro, Scale, Business) lengkap dengan informasi alokasi credit bulanan dan tarif per credit.
   - Menyediakan formulir opsional untuk mengecek kuota akun langsung menggunakan ElevenLabs API key.

### Diubah (Changed)
1. **Mesin Kalkulasi (`calculationEngine.ts`)**:
   - Memperbarui `calculateProjectBudget` untuk mengenali kategori `voice_over`, menghitung credit ElevenLabs, menerapkan tarif paket aktif ElevenLabs, dan mengalikan kebutuhan multi-video secara proporsional.
   - Mengintegrasikan kode peringatan `INCOMPLETE_VOICE_OVER` jika item voice over belum memiliki naskah atau durasi.

### Diperbaiki (Fixed)
1. **Ketahanan Anti-Black-Screen (AC-15 & AC-16)**:
   - Memastikan seluruh 6 tab aplikasi dapat merender proyek dengan baris voice over tanpa kendala layar hitam (black screen).

---

## Versi [1.10.1] - Input Target Durasi per Video di Langkah 2 dengan Preset Campuran Detik & Menit
- **Tanggal Perubahan**: 29 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.10.1`

### Diubah (Changed)
1. **Penggantian Kartu Statis Menjadi Kotak Input Interaktif Target Durasi di Langkah 2 (`ProjectSetupView.tsx`)**:
   - Mengganti kartu statis *"Alur Kerja Rapi & Tanpa Input Dobel"* menjadi kartu input interaktif **"Target Durasi Tiap (per) Video Jadi"**.
   - Input langsung dalam satuan detik dengan dukungan slider interaktif dan bebas ketik angka berapa pun.
   - Dilengkapi tombol pilihan cepat preset format campuran detik dan menit tanpa label sosmed:
     - `15s`
     - `30s`
     - `60s (1m)`
     - `90s (1.5m)`
     - `120s (2m)`
   - Menegaskan bahwa target durasi ini berlaku untuk **masing-masing (tiap) video**, bukan hanya 1 video dan bukan total seluruh video.
   - Jika target video lebih dari 1 (misal 5 video), sistem otomatis menghitung dan menampilkan total akumulasi durasi seluruh video (misal 5 video × 60s = 300 detik / 5m 00s).
   - Menyertakan catatan ramah sineas: durasi mentah shot AI di Langkah 3 boleh lebih panjang dari target ini karena akan dipotong (*trimming*) oleh video editor di post-produksi.

### Ditambahkan (Added)
1. **Aksi Penyimpan Durasi Detik di Store (`projectStore.ts`)**:
   - Menambahkan fungsi `setFinalDurationSeconds(seconds: number)` yang mengonversi detik ke menit desimal secara instan dan presisi.

---

## Versi [1.10.0] - Tahap 2: Kalkulator Durasi Bersih Video (Clean Duration) & Komparasi Buffer Editing Post-Produksi
- **Tanggal Perubahan**: 29 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.10.0`

### Ditambahkan (Added)
1. **Mesin Kalkulasi Durasi Bersih 1 Video Murni (`calculationEngine.ts`)**:
   - Menghitung akumulasi durasi detik murni video dari seluruh baris pekerjaan **Shot Utama** (`is_primary_shot: true` pada kategori video `text_to_video`, `image_to_video`, `video_to_video`).
   - **Pengecualian Mutlak (Strict Exclusion)**:
     - Mutlak **mengecualikan Upscale Video** dan Upscale Image agar tidak menduplikasi panjang durasi video asli.
     - Mutlak **mengecualikan jatah cadangan percobaan** (*attempts / reserve multiplier*). Durasi hanya menghitung kebutuhan dasar storyboard (`quantity × duration_seconds`).
2. **Format Durasi Sinematik Ganda (`formatDurationDual`)**:
   - Menyajikan format menit-detik beserta total detik dan timecode digital (contoh: `1 Menit 30 Detik (90s / 01:30)` atau `45 Detik (45s / 00:45)`).
   - Menghitung durasi proporsional multi-video (`total_duration_seconds` & `total_duration_formatted`) jika target video lebih dari 1 (misal 5 video × 90s = 7m 30s).
3. **Logika Perfilman: Komparasi Target Rencana vs Durasi Mentah Shot AI & Buffer Editing**:
   - Membandingkan **Target Rencana Video Jadi** (Langkah 2) dengan **Durasi Mentah Shot AI** (Langkah 3).
   - Menghitung **Buffer Editing Post-Produksi** (`editing_buffer_seconds`):
     - Durasi Shot AI wajar dan dianjurkan lebih panjang dari Target Rencana karena klip mentah AI disiapkan dengan *handles* (ruang potong awal/akhir) untuk dipotong, ditata ritmenya, dan disinkronkan dengan musik oleh video editor.
     - **Status Aman (Hijau Emerald)**: `✅ Aman (+Xs buffer editing untuk editor video)`.
     - **Status Kurang (Kuning Amber)**: `⚠️ Kurang (-Xs dari target rencana)` dengan notifikasi informatif `INSUFFICIENT_SHOT_DURATION` yang menyarankan penambahan shot.
4. **Kartu Komparasi Durasi & Visual Trimming Ratio di Langkah 4 (`BudgetSummaryView.tsx`)**:
   - Menampilkan kartu visual berdampingan antara target video jadi vs durasi mentah shot AI lengkap dengan visual progress gauge ratio.
   - Menyajikan akumulasi durasi seluruh proyek untuk multi-video.
5. **Badge Durasi & Navigasi Departemen Sineas di Langkah 3 (`ProductionPlannerView.tsx`)**:
   - Badge durasi bersih di Hero Header Langkah 3.
   - Bilah komparasi interaktif Target vs Footage AI beserta running total breakdown chip.
   - Navigasi departemen produksi (Video & Animasi, Gambar & Konsep, Voice Over, Musik Latar).
6. **Integrasi Transparan pada Lembar Cetak PDF (`pdfReportBuilder.ts`)**:
   - Tabel Asumsi memuat perbandingan Target Durasi Video Jadi vs Total Durasi Mentah Shot AI vs Total Durasi Seluruh Proyek.
   - Kotak catatan resmi menyertakan klausul durasi bersih dan penjelasan buffer editing bagi editor video.
   - Optimasi CSS cetak (`page-break-inside: avoid`, repeat header table).

### Diperbaiki (Fixed)
1. **Presisi Matematika Biaya per Menit Multi-Video (`calculationEngine.ts`)**:
   - Memperbaiki rumus biaya per menit agar tidak berlipat ganda pada multi-video:
     $$B_{\text{minute}} = \frac{B_{\text{one\_video}}}{M}$$
     sehingga biaya per menit tetap adil dan konsisten baik memproduksi 1 video maupun 10 video.
   - Menambahkan metrik presisi *Biaya per Menit Rekaman Mentah AI* (`cost_per_raw_minute_usd` & `cost_per_raw_minute_idr`) berbasis `Decimal.js`.

---

## Versi [1.9.0] - Pembaruan Terminologi Sineas AI ("Shot / Gambar") & Fitur Klasifikasi Shot Utama vs Aset Pendukung
- **Tanggal Perubahan**: 28 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.9.0`

### Ditambahkan (Added)
1. **Fitur Klasifikasi Peran Item: Shot Utama vs Aset Pendukung (`ProductionItem.is_primary_shot`)**:
   - **Otomatis Pintar**: Kategori pembuatan video (`Text-to-Video` dan `Image-to-Video`) secara cerdas langsung ditandai sebagai **"🎬 Shot Utama"** (potongan visual inti storyboard video).
   - Sedangkan proses perbesaran kualitas (`Upscale Image`, `Upscale Video`) dan pembuatan gambar konsep (`Text-to-Image`, `Image-to-Image`) ditandai sebagai **"🛠️ Aset Pendukung"** (tetap dihitung anggarannya, tetapi tidak menggelembungkan jumlah hitungan shot video).
   - **Tombol Cepat 1-Klik di Kartu Item**: Pengguna dapat langsung mengklik tombol lencana (`🎬 Shot Utama` / `🛠️ Aset Pendukung`) di setiap baris Langkah 3 untuk mengganti status seketika.
   - **Opsi Peran di Formulir Edit Modal**: Tersedia sakelar peran visual di dalam jendela pop-up pengaturan detail item.
2. **Rekapitulasi Terpisah di Seluruh Layar & PDF**:
   - Di Header Langkah 3, Langkah 4, dan Laporan PDF, kini disajikan angka terpisah yang transparan:
     misal: `[ 8 Shot / Gambar Utama ] + [ 4 Aset Pendukung ] = [ Total 12 Item AI ]`.
   - Menghitung total shot utama untuk proyek multi-video: `Shot Utama per Video × Target Video = Total Keseluruhan Shot`.

### Diubah (Changed)
1. **Pembaruan Terminologi Ramah Sineas AI**:
   - Menghapus kata *"adegan"* yang membingungkan dari seluruh penjuru aplikasi (Langkah 1 s/d 5, menu panduan, modal, tombol aksi) dan menggantikannya dengan istilah standar industri video AI yang lebih fleksibel: **"Shot / Gambar"**.
   - Penyelarasan teks tabel PDF, disclaimer box, dan ringkasan eksekutif agar selaras dengan bahasa para sineas dan kreator video AI.

---

## Versi [1.8.2] - Perbaikan Bug Layar Hitam (Black Screen) pada Langkah 3 & Pemasangan Sabuk Pengaman Layar
- **Tanggal Perubahan**: 28 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.8.2`

### Diperbaiki (Fixed)
1. **Perbaikan Akar Masalah Layar Hitam (Black Screen) saat Membuka Langkah 3 (`ProductionPlannerView.tsx`)**:
   - Menambahkan impor ikon `Sparkles` dari pustaka `lucide-react` pada `ProductionPlannerView.tsx`. Sebelumnya, ikon tersebut dipanggil pada kartu *Running Total* di baris 541 tanpa didaftarkan di bagian atas file, sehingga menekan tombol apa pun yang mengarah ke **Langkah 3** (seperti tombol *"03. Daftar Pekerjaan AI"*, *"Lanjut ke Langkah 3"*, *"Susun Daftar Adegan AI"*, atau *"Contoh Proyek Iklan Komersial"*) memicu `ReferenceError: Sparkles is not defined` dan membuat layar aplikasi berubah menjadi hitam.
2. **Pembaruan Otomatis File `Klik-Untuk-Testing-Tanpa-Install.bat`**:
   - Memperbarui skrip peluncur testing agar selalu menyusun ulang (`npm.cmd run build`) tampilan terbaru sebelum membuka jendela aplikasi, sehingga tidak pernah lagi membuka file tampilan lama yang tertinggal di folder `dist/`.

### Ditambahkan (Added)
1. **Sabuk Pengaman Anti-Black-Screen (`AppErrorBoundary` di `main.tsx`)**:
   - Memasang pelindung layar utama (*Error Boundary*) yang mencegah aplikasi mati menjadi layar hitam kosong jika terjadi kendala tampilan, serta menyediakan tombol pemulihan instan (*Muat Ulang Tampilan*).
2. **Pemeriksaan Ketat Sebelum Rilis (`package.json` & `acceptanceCriteria.test.ts`)**:
   - Mengintegrasikan pengecekan ketat `tsc --noEmit` ke dalam perintah `build:renderer` agar komputer otomatis menolak pembuatan paket aplikasi jika ada satu pun ikon atau komponen yang lupa didaftarkan.
   - Menambahkan pengujian otomatis **AC-15 (Anti-Black-Screen UI Render Check)** yang merender seluruh 6 layar utama aplikasi (baik mode 1 video, multi-video, maupun proyek kosong) untuk menjamin 0 error tampilan.

---

## Versi [1.8.1] - Hasil Audit Sinergi 6 Sub-Agent: Penguatan Skema Data, Hardening PDF, dan Kartu Running Total Langkah 3
- **Tanggal Perubahan**: 28 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.8.1`

### Ditambahkan (Added)
1. **Kartu Running Total & Rekapitulasi Berjalan di Bawah Tabel Langkah 3 (`ProductionPlannerView.tsx`)**:
   - Menambahkan kartu ringkasan interaktif tepat di bawah daftar pekerjaan sebelum tombol navigasi, sehingga pengguna tidak perlu menggulir ke atas untuk melihat total anggaran.
   - Menambahkan lencana eksplisit `per 1 video` pada subtotal setiap baris adegan jika target video lebih dari 1.
2. **Penyempurnaan Teks Badge Video Tunggal**:
   - Menampilkan `Proyeksi Video Tunggal (1 Video)` jika target video bernilai 1.

### Diperbaiki (Fixed)
1. **Penguatan Skema Data & Kompatibilitas Mundur (`projectSchema.ts`)**:
   - Menambahkan fallback default `.default(1)` pada validasi Zod `target_videos` agar file proyek warisan (lama) dapat dibuka tanpa kendala validasi.
2. **Hardening Template Laporan PDF (`pdfReportBuilder.ts`)**:
   - Menambahkan aturan `@media print { page-break-inside: avoid; }` agar kotak disclaimer resmi tidak terpotong di tengah halaman cetak.
   - Menambahkan pengaman nilai null/undefined pada pemetaan parameter model dan status verifikasi.
3. **Ekspansi Suite Pengujian Otomatis (`tests/`)**:
   - Menambah cakupan pengujian multi-video, edge-case proyek kosong, dan pembagian nol menjadi total 33 test case yang lolos 100%.

---

## Versi [1.8.0] - Tahap 1 Menuju v2.0.0: Alur Multi-Video Workflow & Transparansi Rumus Proyeksi PDF
- **Tanggal Perubahan**: 28 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.8.0`

### Ditambahkan (Added)
1. **Input Target Jumlah Video Jadi pada Langkah 2 (Project Setup)**:
   - Menambahkan kotak input numerik dan slider interaktif target jumlah video (`target_videos`) pada Langkah 2.
   - Dilengkapi tombol cepat pilihan umum (*quick presets*): **1 Video** (Single), **3 Video**, **5 Video**, dan **10 Video**.
   - Menyertakan kotak ringkasan interaktif yang menjelaskan bahwa biaya akan dikalikan sesuai target jumlah video yang diinput.
2. **Badge Penanda Proyeksi 1 Video Murni pada Langkah 3 (Production Planner)**:
   - Menambahkan lencana hijau terpadu di bagian atas perencana produksi yang menegaskan bahwa seluruh adegan/shot yang disusun di Langkah 3 diproyeksikan khusus untuk **1 video utuh**.
   - Menambahkan bilah informasi berjalan (*running total banner*) yang memperlihatkan: `Subtotal 1 Video × [N] Video = Total Anggaran Proyek`.
3. **Disclaimer Resmi & Transparansi Rumus Perkalian pada Ekspor Laporan PDF**:
   - Menambahkan kotak hijau *Catatan Penting & Rumus Proyeksi Multi-Video* tepat di bawah tabel adegan produksi pada dokumen PDF.
   - Menampilkan rumus transparan: `Biaya 1 Video (Rp X / $Y) × [N] Video = Total Anggaran Akhir (Rp X' / $Y')` agar siapapun yang membaca PDF memahami perhitungannya secara jernih tanpa ambigu.
   - Menambahkan metrik terpisah pada Kartu Eksekutif PDF untuk *Proyeksi 1 Video Jadi* dan *Target Jumlah Video*.

### Diubah (Changed)
1. **Mesin Kalkulasi Keuangan (`calculationEngine.ts`)**:
   - Mengisolasi perhitungan adegan produksi di Langkah 3 sebagai unit 1 video (`one_video_...`), lalu mengalikannya dengan `target_videos` secara aman dan presisi menggunakan `Decimal.js`.
   - Mengalikan total kali percobaan (*budgeted generations*) dan konsumsi credit sesuai jumlah video secara akurat.
   - Menangani pembagian angka nol (*zero divisor protection*) secara aman dengan menerbitkan peringatan informatif jika target video diatur ke 0.
2. **Penyelarasan Tampilan Ringkasan Anggaran (Langkah 4 & Header Aplikasi)**:
   - Memperbarui Kartu Anggaran Utama (*Hero Card*), panel samping (*sidebar*), dan tabel metrik unit untuk menampilkan komparasi cerdas antara biaya per 1 video jadi vs total biaya proyek multi-video.

---

## Versi [1.7.0] - Dukungan Installer 1-Klik untuk Mac (macOS) & Buku Panduan Lengkap (Windows + Mac)
- **Tanggal Perubahan**: 27 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.7.0`

### Ditambahkan (Added)
1. **Paket Installer & Peluncur 1-Klik untuk Pengguna Mac (`macOS`)**:
   - Menambahkan **`Install-Langsung-Ke-Mac.command`**: Tombol 1-klik di Finder Mac yang otomatis menyiapkan aplikasi, membungkus `AI Video Budget Calculator.app`, memasangnya langsung ke folder `/Applications` (Launchpad) di Mac, membuka izin keamanan Apple *Gatekeeper* (`xattr -cr`), dan langsung menjalankan aplikasi.
   - Menambahkan **`Buat-Publish-Installer-Mac.command`**: Tombol 1-klik di Finder Mac untuk menghasilkan paket installer **`.dmg`** dan **`.zip`** di dalam folder `release/` (mendukung Mac Apple Silicon M1/M2/M3/M4 `arm64` maupun Mac Intel `x64`).
   - Menambahkan **`Klik-Untuk-Testing-Tanpa-Install-Mac.command`** & **`Jalankan-Cek-Otomatis-Mac.command`**: Peluncur tanpa instalasi (*Zero-Install*) dan penguji otomatis khusus Mac.
   - Menambahkan `.gitattributes` (`*.command text eol=lf`) dan izin *executable* (`chmod +x`) di Git agar seluruh file `.command` langsung bisa diklik 2x di macOS tanpa kendala baris kode.
2. **Buku Panduan Instalasi (Windows & Mac) dan Cara Penggunaan Versi Terbaru**:
   - Menambahkan dokumen lengkap **`PANDUAN-INSTALASI-DAN-PENGGUNAAN.md`** serta memperbarui **`README.md`** dengan langkah demi langkah instalasi di Windows & Mac serta panduan pemakaian aplikasi sesuai model perhitungan terbaru (`v1.7.0`).

### Diubah (Changed)
1. **Penyempurnaan Konfigurasi `electron-builder.yml` & `package.json`**:
   - Mempertahankan 100% konfigurasi installer Windows (`portable.exe` & `nsis.exe`) serta seluruh file `.bat` yang sudah ada.
   - Menambahkan pengaturan `identity: null` dan `dmg.writeUpdateInfo: false` pada konfigurasi `mac` di `electron-builder.yml` agar pembuatan `.dmg` dan `.app` di komputer Mac berjalan mulus tanpa memerlukan sertifikat berbayar Apple Developer.

---

## Versi [1.6.2] - Audit Kode Menyeluruh & Perbaikan Bug Konsistensi Perhitungan serta Kontras Status
- **Tanggal Perubahan**: 27 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.6.2`

### Diperbaiki (Fixed)
1. **Sinkronisasi Perhitungan Contoh Proyek Komersial (Bug Rumus $25 \times 2 = 50$)**:
   - Memperbaiki ketidaksinkronan pada **Contoh Proyek Iklan Komersial** (`createSampleCommercialProject` & `recalculateProject`) di mana 3 tahapan akhir sebelumnya masih bernilai `1x` cadangan sehingga memunculkan tampilan membingungkan `25 adegan × 2 cadangan = 38 kali buat`.
   - Kini seluruh tahapan produksi tersinkronisasi penuh dengan faktor pengali cadangan di Langkah 2, sehingga menghasilkan perhitungan yang 100% akurat dan konsisten (`25 adegan × 2 cadangan = 50 kali buat`) sejak aplikasi pertama kali dibuka maupun saat tombol contoh proyek diklik.
2. **Perlindungan Data Simulasi Uji PRD Bab 8.10 saat Simpan & Ekspor PDF**:
   - Memperbaiki fungsi `recalculateProject` di `projectStore.ts` agar tidak menimpa persentase cadangan khusus (`20%`) ketika pengguna memuat **Contoh Simulasi Sederhana (PRD Bab 8.10)** lalu menyimpan file atau mencetak PDF.
3. **Penyelarasan Jendela Popup Ringkasan Cepat & Panduan Pengguna**:
   - Memperbarui jendela *Intip Ringkasan Cepat* (`isQuickBudgetModalOpen`) dan *Panduan Cepat* di bilah atas agar menampilkan rumus perkalian terbaru (`Kebutuhan × Cadangan = Total Kali Buat`) serta rata-rata biaya per video, menggantikan kotak lama yang menampilkan cadangan `Rp 0 (+0x)`.
4. **Penyempurnaan Kontras Warna Lencana Status & Peringatan di Mode Terang (*White Mode*)**:
   - Memperbaiki kontras teks pada komponen `StatusBadge` (*Manual*, *Kedaluwarsa*, *Tidak Tersedia*, *Tidak Valid*), lencana `PREMIUM`, `POPULER`, dan `UNLIMITED`, serta kotak peringatan di halaman **Cetak PDF**, **Beranda**, dan **Katalog & Kurs** agar terbaca tajam di atas latar putih maupun gelap.

---

## Versi [1.6.1] - Pemulihan Performa Cepat & Ringan (Pencabutan Animasi Glowing Line Sesuai Permintaan)
- **Tanggal Perubahan**: 26 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.6.1`

### Diubah (Changed)
1. **Pencabutan Seluruh Komponen & Script Animasi Glowing Line**:
   - Menghapus komponen `InteractiveGlowLine` dari bilah menu atas (*Top Header*) dan bibir kartu utama (*Hero Budget Card*).
   - Menghapus seluruh efek pendaran blur, titik intan kursor, dan script pemantau pergerakan mouse (*mouse listeners*) yang membebani kinerja grafis/prosesor komputer.
2. **Pemulihan Performa Ringan & Bebas Lemot (Kondisi Versi 1.5.2)**:
   - Kecepatan respons, kelancaran navigasi antarmuka, dan efisiensi memori aplikasi telah kembali 100% cepat, enteng, dan responsif persis seperti pada Versi 1.5.2.
   - Tetap mempertahankan seluruh penyempurnaan kontras warna hijau dan kenyamanan membaca pada Mode Terang (*White Mode*).

---

## Versi [1.6.0] - Eksperimen Animasi Glowing Line Interaktif (Diarsipkan)
- **Tanggal Perubahan**: 26 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.6.0`

### Ditambahkan (Added)
1. Eksperimen penambahan garis pendar interaktif (telah dicabut kembali pada Versi 1.6.1 karena menyebabkan performa berat/lemot pada komputer pengguna).

---

## Versi [1.5.2] - Peningkatan Kontras Warna Hijau & Lencana Status pada Mode Terang (White Mode Aesthetics)
- **Tanggal Perubahan**: 26 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.5.2`

### Diperbaiki (Fixed)
1. **Peningkatan Kontras Warna Hijau pada Mode Terang (*Light / White Mode*)**:
   - Memperbaiki lencana status, teks persentase diskon, dan indikator kesiapan yang sebelumnya tampak pudar/silau saat menggunakan tema putih (*white mode*).
   - Menerapkan sistem warna adaptif ganda (*Dynamic Color Token*):
     - **Mode Terang (*Light Mode*)**: Menggunakan hijau zamrud tua/pekat (*Emerald 700* `#047857` dan `#059669`) dengan rasio kontras 5.85:1 (melebihi standar WCAG AA), sehingga teks tajam, sangat mudah dibaca, dan tetap elegan di atas latar belakang putih bersih.
     - **Mode Gelap (*Dark Mode*)**: Mempertahankan warna hijau neon studio modern (*Emerald 400* `#34d399`) yang berpendar estetik di atas latar belakang gelap gulita.
2. **Peningkatan Kontras Lencana Peringatan (*Amber Warning Badges*)**:
   - Menyelaraskan teks dan garis tepi lencana peringatan (*warning badges*) agar menggunakan warna jingga kayu matang (*Amber 700* `#b45309`) pada mode terang dan kuning emas terang (*Amber 300* `#fcd34d`) pada mode gelap.
3. **Penyelarasan Komponen Visual Menyeluruh**:
   - Memperbarui seluruh komponen yang memiliki elemen hijau dan lencana status:
     - Lencana status header ("Tersimpan", "Estimasi Lengkap").
     - Lencana diskon paket langganan Higgsfield ("21% OFF", "BEST VALUE", dll.) di Pengaturan Data.
     - Lencana status verifikasi model AI ("NEW", "Aktif", dll.).
     - Lencana kesiapan ekspor dokumen PDF.
     - Ikon perisai keamanan dan centang kesehatan data.

---

## Versi [1.5.1] - Penyelarasan Tampilan Beranda Sesuai Model Perhitungan Terbaru (Perkalian Cadangan Langkah 2)
- **Tanggal Perubahan**: 26 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.5.1`

### Diubah (Changed)
1. **Penyelarasan Kartu Utama Total Anggaran di Beranda**:
   - Menghapus tampilan persentase cadangan usang (`Cadangan (0%): +$0`) pada kartu hero utama beranda.
   - Menggantinya dengan visualisasi rumus perhitungan terbaru yang transparan:
     `[Jumlah Adegan Pokok] adegan × [Cadangan] cadangan = [Total] kali buat`.
   - Menampilkan ringkasan poin Credit Higgsfield aktif beserta kurs konversi Rupiah di baris penutup kartu.
2. **Pembaruan Kartu Metrik Pendukung 1 (Rumus Kali Pembuatan AI)**:
   - Mengganti pemisahan lama (generasi pokok vs generasi cadangan) menjadi format dua pilar terstruktur:
     - Pilar Kiri: *Kebutuhan Adegan Pokok* (dihitung dari Langkah 3).
     - Pilar Kanan: *Cadangan Langkah 2* (faktor pengali jatah coba per adegan).
   - Menambahkan ringkasan hasil perkalian kali buat dan tautan langsung untuk mengubah cadangan di Langkah 2.
3. **Pembaruan Kartu Metrik Pendukung 2 (Rata-rata Biaya Produksi Nyata)**:
   - Menghapus pembagian biaya berbasis target video manual yang tidak lagi digunakan.
   - Menggantinya dengan dua indikator nyata yang sangat dibutuhkan produser/kreator video:
     - *Rata-rata per 1 Adegan Jadi* (sudah mencakup jatah cadangan percobaan).
     - *Rata-rata per 1x Klik Buat AI* (biaya rata-rata satu kali percobaan generate).
4. **Penyelarasan Kalimat Penjelas & Panduan Langkah Bawah**:
   - Memperbarui deskripsi proyek di pojok kiri atas beranda agar langsung menampilkan jumlah adegan pokok, pengali cadangan, dan total kali buat.
   - Memperbarui petunjuk bilah alur (*StepFlowBar*) di bagian bawah agar selaras menuju Langkah 2.

---

## Versi [1.5.0] - Fitur Sidebar Pinned Footer (Kiri Bawah Selalu Terlihat Tanpa Perlu Scroll)
- **Tanggal Perubahan**: 26 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.5.0`

### Ditambahkan (Added)
1. **Penguncian Permanen Kiri Bawah (*Pinned Footer Architecture*)**:
   - Bagian bawah sidebar (*Total Anggaran Estimasi* dan tombol *Simpan Proyek*) kini dipaku permanen di dasar layar (`lg:h-screen lg:max-h-screen`, `shrink-0 mt-auto`).
   - Bagian kiri bawah selalu terlihat 100% di semua ukuran layar monitor laptop tanpa pernah terdorong keluar layar atau membutuhkan scroll halaman.
2. **Kartu Anggaran Ramping Vertikal (*Slim & Compact Layout*)**:
   - Menata ulang kotak anggaran kiri bawah menjadi 35% lebih hemat ruang vertikal:
     - Baris atas: Label *"Total Anggaran"* dan tautan cepat *"Rincian"* dengan ikon mata.
     - Baris bawah: Nilai nominal Rupiah tebal berdampingan seimbang dengan angka USD dan frekuensi percobaan (`20x • $240.00`).
   - Tombol *Simpan Proyek* dibuat dengan tinggi presisi yang pas (`py-2`), menghemat ruang layar tanpa mengurangi kenyamanan klik.
3. **Menu Tengah Auto-Fit dengan Gulir Halus Mandiri (*Smooth Independent Scroll*)**:
   - Area daftar langkah (01 sampai 05) dan Data Referensi (06) kini memiliki ruang fleksibel mandiri (`flex-1 overflow-y-auto`).
   - Jarak padding antar menu otomatis disesuaikan agar pas dalam satu layar monitor standar. Jika monitor pengguna sangat pendek, hanya menu alur tengah yang dapat digulir dengan roda mouse tanpa memunculkan scrollbar tebal yang mengganggu pemandangan, sementara bagian atas dan bawah tetap diam terkunci.

---

## Versi [1.4.0] - Fitur Sidebar Menu Dapat Di-minimize (Buka/Tutup dengan Mode Ikon Elegan & Minimalis)
- **Tanggal Perubahan**: 26 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.4.0`

### Ditambahkan (Added)
1. **Fitur Buka-Tutup (Minimize/Expand) Sidebar Menu di Sisi Kiri**:
   - Pengguna kini dapat menutup (minimize) sidebar menu kapan saja untuk mendapatkan ruang kerja layar yang jauh lebih luas dan fokus.
   - Tombol toggle buka-tutup disediakan di pojok atas sidebar (`PanelLeftClose` / `PanelLeftOpen`), di bilah atas aplikasi (*Top Header Menu*), serta melalui tombol pintas keyboard praktis `Ctrl + B` (atau `Cmd + B` di Mac).
2. **Mode Hanya Ikon Minimalis & Mewah saat Posisi Minimize**:
   - Saat sidebar ditutup, lebarnya mengecil rapi menjadi bilah ikon 72px yang elegan.
   - Seluruh menu alur (Langkah 01 sampai 05) dan Data Referensi (06) bertransformasi menjadi tombol ikon tengah yang bersih (*size-11 touch targets*) dengan efek kaca buram (*glassmorphism*).
   - Ikon yang sedang aktif diberi lencana cahaya biru dan penanda garis tepi yang jelas.
   - Angka lencana (seperti jumlah adegan atau kali percobaan) tetap tampil elegan sebagai *floating badge* kecil di pojok kanan atas ikon.
   - Tombol *Intip Rincian Anggaran* dan *Simpan Proyek* di bagian bawah sidebar otomatis menyesuaikan menjadi tombol ikon ringkas dengan tooltip informasi lengkap saat kursor diarahkan ke tombol tersebut.
3. **Penyimpanan Status Pilihan Pengguna (Persistent State)**:
   - Status buka/tutup sidebar otomatis diingat di penyimpanan lokal (`localStorage`), sehingga posisi minimize tetap terjaga saat aplikasi dibuka kembali.
4. **Animasi Transisi Halus (Smooth Glass Rail Transition)**:
   - Perubahan ukuran sidebar berjalan mulus dengan animasi CSS `transition-all duration-300 ease-in-out` tanpa patah-patah.

---

## Versi [1.3.1] - Perapian Tata Letak Kartu Paket Higgsfield Lapis 2 (Bebas Tabrakan & Teks Terpotong)
- **Tanggal Perubahan**: 26 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.3.1`

### Diperbaiki (Fixed)
1. **Pelegaan Tata Letak Kartu Paket (Grid 3-4 Kolom)**:
   - Mengubah pembagian kartu dari yang sebelumnya 6 kolom sempit (`xl:grid-cols-6`) menjadi 3 hingga 4 kolom leluasa (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`). Setiap kartu kini memiliki ruang selebar minimal ~280px sehingga tidak lagi saling himpit atau bertumpukan.
2. **Penghapusan Pemotongan Teks Nama Paket (`truncate`)**:
   - Menghapus pembatasan teks (`truncate`) pada nama paket, sehingga nama panjang seperti *"Paket Pro 600 Tahunan"* dan *"Paket Max 1.800 Tahunan"* tampil utuh sempurna tanpa terpotong tanda titik-titik (`...`).
3. **Pemisahan Jelas Info Alokasi Credit vs Harga Paket**:
   - Menata ulang bagian bawah kartu menjadi 2 kolom informasi terstruktur (*Alokasi* di kiri dan *Harga Paket* di kanan) dengan label tersendiri.
   - Mengatasi kendala teks yang sebelumnya bertabrakan seperti `"600 cr$29/bln"` atau `"Pay-per-useAPI"`. Kini tampil rapi: Alokasi `600 Cr` dan Harga `$29 / bln`.
4. **Lencana Status Pilihan yang Mewah**:
   - Menambahkan ikon centang biru dan teks `"✓ Paket Aktif Digunakan"` pada kartu yang sedang dipilih, serta panduan lembut `"Klik untuk memilih paket ini"` pada kartu lainnya.
5. **Kategori Pembuka Lebih Nyaman (Default Individu Tahunan)**:
   - Tab filter paket kini secara default membuka kategori *"Individu Tahunan (Hemat s/d 30%)"* yang berisi 5 paket utama kreator, sehingga pengguna tidak langsung dihujani 17 kartu sekaligus. Tab lain tetap dapat diklik kapan saja dengan cepat.

---

## Versi [1.3.0] - Pembaruan Lengkap Katalog Paket Langganan Higgsfield 2026 (Riset Resmi Live Website)
- **Tanggal Perubahan**: 26 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.3.0`

### Ditambahkan (Added)
1. **Daftar Lengkap 17 Paket Langganan Resmi Higgsfield 2026**:
   - Berdasarkan riset live langsung ke situs resmi `higgsfield.ai/pricing` dan *Creator Hub*, katalog paket langganan diperbarui menyeluruh:
     - **Paket Basic**: $9/bln (120 credit/bln • $0.0750/cr) + 10 free gen Genjutsu Lite & Ads Studio.
     - **Paket Pro 600**: Bulanan $29/bln ($0.0483/cr) & Tahunan $23/bln ($0.0383/cr, diskon 21%).
     - **Paket Pro 900**: Bulanan $43/bln ($0.0478/cr) & Tahunan $34/bln ($0.0378/cr, diskon 21%).
     - **Paket Max 1.800**: Bulanan $79/bln ($0.0439/cr) & Tahunan $59/bln ($0.0328/cr, diskon 25%).
     - **Paket Max 3.600**: Bulanan $139/bln ($0.0386/cr) & Tahunan $115/bln ($0.0319/cr, diskon 27%).
     - **Paket Max 5.400**: Bulanan $199/bln ($0.0369/cr) & Tahunan $165/bln ($0.0306/cr, diskon 30%).
     - **Paket Team Studio**: Bulanan $69/seat/bln ($0.0690/cr) & Tahunan $65/seat/bln ($0.0650/cr, diskon 18%).
     - **Paket Scale Agency**: Bulanan $169/seat/bln ($0.0676/cr) & Tahunan $150/seat/bln ($0.0600/cr, diskon 30%).
     - **Paket Top-Up Credit Pack**: On-Demand pay-as-you-go seharga rata-rata $0.0500/cr (masa berlaku 90 hari).
     - **Standar API Resmi**: Patokan teknis resmi $0.0625/cr.
2. **Navigasi Tab Filter Kategori Paket**:
   - Menambahkan 5 tombol filter kategori di Lapis 2 agar pengguna mudah memilah paket:
     - *Semua Paket (17)*
     - *Individu Bulanan*
     - *Individu Tahunan (Hemat s/d 30%)*
     - *Tim & Bisnis (Pooled)*
     - *Top-Up & Standar API*
3. **Banner Penjelasan Paket Aktif**:
   - Di bawah kartu pilihan paket, otomatis tampil kotak keterangan interaktif yang menjelaskan kuota bulanan, diskon tahunan, serta konversi harga ke Rupiah secara transparan.

### Diubah (Changed)
1. **Pembersihan Paket Kadaluarsa**:
   - Menghapus "Paket Lite" ($10 • 250 cr) yang sudah tidak lagi dijual di sistem resmi Higgsfield.
2. **Tata Letak Kartu yang Mewah & Responsif**:
   - Mengganti baris tombol kaku 8 kolom menjadi kartu studio modern dengan lencana diskon (*21% OFF*, *25% OFF*, *30% OFF*, *BEST VALUE*).

---

## Versi [1.2.7] - Penyelarasan Langkah 4 (Ringkasan Biaya) Sesuai Model Perkalian Cadangan
- **Tanggal Perubahan**: 26 Oktober 2026
- **Label Mesin Waktu (Git Tag)**: `v1.2.7`

### Diubah (Changed)
1. **Penyelarasan Kartu Utama (Hero Card) Langkah 4**:
   - Menghapus kotak split lama *"Biaya Utama vs Biaya Cadangan (0% / Rp 0)"* yang membingungkan pengguna.
   - Menggantinya dengan 2 kotak ringkasan informatif:
     - **Kebutuhan Adegan Pokok**: Menampilkan total adegan/gambar yang disusun pada Langkah 3.
     - **Cadangan Langkah 2**: Menampilkan faktor pengali cadangan (misal `10x Cadangan`).
   - Kartu total anggaran kini menampilkan rumus perkalian langsung yang transparan:
     `X adegan × Y cadangan = Z kali buat`.
   - Mengganti diagram batang 100% vs 0% dengan kartu ringkasan **Total Konsumsi Credit Platform**.
2. **Pembaruan Metrik Biaya Rata-Rata Satuan**:
   - Menampilkan metrik yang jauh lebih relevan untuk kebutuhan pengguna:
     - **Rata-rata Biaya per 1 Adegan / Gambar**: Biaya total per adegan utuh (sudah termasuk jatah cadangan coba).
     - **Rata-rata Biaya per 1x Pembuatan AI**: Biaya riil setiap kali menekan tombol generate AI.
     - **Total Konsumsi Credit AI**: Total poin pemakaian platform Higgsfield.
3. **Format Tabel Rincian per Tahap (Tabel Ringkas & Jendela Pop-up Detail)**:
   - Menghapus tampilan lama `70x (70+0)` yang tampak seperti kendala teknis.
   - Menggantinya dengan tampilan manusiawi: `70x buat` dengan keterangan `7 item × 10 cadangan`.
   - Kolom tabel memperlihatkan pemakaian credit platform dan subtotal anggaran (Rupiah & USD) yang rapi.
4. **Penyelarasan Navigasi Bilah Samping (Sidebar)**:
   - Lencana penanda pada menu Langkah 02 kini menampilkan faktor pengali nyata (misal `10x`), bukan lagi persentase `0%`.

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
