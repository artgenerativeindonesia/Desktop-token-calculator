import {
  AppLanguage,
  PricingUnit,
  ProcessCategory,
  QuantityType,
  VerificationStatus,
} from '../../shared/types/project';

export const CATEGORY_LABELS: Record<ProcessCategory, { id: string; en: string }> = {
  text_to_image: {
    id: 'Text to Image (Gambar dari Teks)',
    en: 'Text to Image',
  },
  image_to_video: {
    id: 'Image to Video (Animasi Gambar)',
    en: 'Image to Video',
  },
  video_to_video: {
    id: 'Video to Video (Transformasi Video)',
    en: 'Video to Video',
  },
  text_to_video: {
    id: 'Text to Video (Video dari Teks)',
    en: 'Text to Video',
  },
  upscaling: {
    id: 'Upscaling / Enhancement (Peningkatan Kualitas)',
    en: 'Upscaling / Enhancement',
  },
};

export const SHORT_CATEGORY_LABELS: Record<ProcessCategory, { id: string; en: string }> = {
  text_to_image: { id: 'Text to Image', en: 'Text to Image' },
  image_to_video: { id: 'Image to Video', en: 'Image to Video' },
  video_to_video: { id: 'Video to Video', en: 'Video to Video' },
  text_to_video: { id: 'Text to Video', en: 'Text to Video' },
  upscaling: { id: 'Upscaling / Enhance', en: 'Upscaling / Enhance' },
};

export const STATUS_LABELS: Record<VerificationStatus, { id: string; en: string }> = {
  verified: { id: 'Resmi & Terverifikasi', en: 'Verified' },
  manual: { id: 'Diisi Sendiri (Manual)', en: 'Manual Input' },
  stale: { id: 'Data Tersimpan (Offline)', en: 'Saved Data (Offline)' },
  unavailable: { id: 'Belum Diisi', en: 'Not Set Yet' },
  invalid: { id: 'Perlu Dicek', en: 'Needs Check' },
};

export const PRICING_UNIT_LABELS: Record<PricingUnit, { id: string; en: string }> = {
  per_generation: { id: 'per kali buat', en: 'per generation' },
  per_second: { id: 'per detik video', en: 'per video second' },
  per_asset: { id: 'per gambar/aset', en: 'per asset' },
  per_pack: { id: 'per paket', en: 'per pack' },
};

export const QUANTITY_TYPE_LABELS: Record<QuantityType, { id: string; en: string }> = {
  shot: { id: 'Jumlah Adegan (Shot)', en: 'Number of Scenes (Shots)' },
  asset: { id: 'Jumlah File / Aset', en: 'Number of Assets' },
  output: { id: 'Jumlah Gambar', en: 'Number of Images' },
};

export const UI_TEXT = {
  id: {
    appTitle: 'Kalkulator Anggaran Video AI',
    appSubtitle: 'Perencana Biaya Produksi Video & Gambar AI • Higgsfield',
    navDashboard: 'Beranda Proyek',
    navSetup: 'Pengaturan & Cadangan',
    navPlanner: 'Daftar Pekerjaan AI',
    navSummary: 'Ringkasan Biaya',
    navDataSettings: 'Kurs Rupiah & Daftar Harga',
    navExportPdf: 'Cetak Laporan PDF',
    btnNewProject: 'Buat Proyek Baru',
    btnOpenProject: 'Buka Proyek Tersimpan',
    btnSaveProject: 'Simpan Proyek',
    btnSaveAs: 'Simpan ke File Baru...',
    btnExportPdf: 'Simpan Laporan PDF',
    btnLoadPrdTest: 'Coba Contoh Simulasi Sederhana',
    btnLoadCommercialDemo: 'Coba Contoh Proyek Iklan Lengkap',
    savedBadge: 'Sudah Tersimpan',
    unsavedBadge: 'Ada Perubahan Belum Disimpan',
    completeEstimate: 'Hitungan Lengkap',
    incompleteEstimate: 'Ada Data Belum Diisi',
    baseCost: 'Biaya Utama (Awal)',
    reserveCost: 'Biaya Cadangan (Buat Ulang)',
    totalBudget: 'Total Seluruh Anggaran',
    totalCredit: 'Total Pemakaian Credit',
    costPerVideo: 'Rata-rata Biaya per Video Jadi',
    costPerMinute: 'Rata-rata Biaya per Menit Video',
    plannedGenerations: 'Rencana Buat Awal',
    reserveGenerations: 'Cadangan Buat Ulang',
    budgetedGenerations: 'Total Kali Pembuatan AI',
    exchangeRateLabel: 'Kurs Dolar ke Rupiah',
    refreshRateBtn: 'Perbarui Kurs dari Internet',
    addStageBtn: 'Tambah Tahap Pembuatan Baru',
    duplicateBtn: 'Salin Baris',
    deleteBtn: 'Hapus',
    unavailableLabel: 'Belum Diisi',
  },
  en: {
    appTitle: 'AI Video Budget Calculator',
    appSubtitle: 'AI Video & Image Production Cost Planner • Higgsfield',
    navDashboard: 'Project Home',
    navSetup: 'Project & Reserve Setup',
    navPlanner: 'AI Production List',
    navSummary: 'Cost Summary',
    navDataSettings: 'Exchange Rate & Price List',
    navExportPdf: 'Save PDF Report',
    btnNewProject: 'New Project',
    btnOpenProject: 'Open Saved Project',
    btnSaveProject: 'Save Project',
    btnSaveAs: 'Save As New File...',
    btnExportPdf: 'Save PDF Report',
    btnLoadPrdTest: 'Try Simple Simulation Sample',
    btnLoadCommercialDemo: 'Try Full Commercial Sample',
    savedBadge: 'Saved',
    unsavedBadge: 'Unsaved Changes',
    completeEstimate: 'Complete Estimate',
    incompleteEstimate: 'Some Data Missing',
    baseCost: 'Initial Base Cost',
    reserveCost: 'Redo Reserve Cost',
    totalBudget: 'Total Overall Budget',
    totalCredit: 'Total Credit Usage',
    costPerVideo: 'Average Cost per Final Video',
    costPerMinute: 'Average Cost per Video Minute',
    plannedGenerations: 'Initial Planned Tries',
    reserveGenerations: 'Extra Reserve Tries',
    budgetedGenerations: 'Total AI Generations',
    exchangeRateLabel: 'USD to IDR Rate',
    refreshRateBtn: 'Update Rate from Internet',
    addStageBtn: 'Add New Production Stage',
    duplicateBtn: 'Duplicate',
    deleteBtn: 'Delete',
    unavailableLabel: 'Not Set Yet',
  },
};

export function formatCurrencyUsd(
  val: number | null,
  lang: AppLanguage = 'id'
): string {
  if (val === null || !Number.isFinite(val)) {
    return UI_TEXT[lang].unavailableLabel;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(val);
}

export function formatCurrencyIdr(
  val: number | null,
  lang: AppLanguage = 'id'
): string {
  if (val === null || !Number.isFinite(val)) {
    return UI_TEXT[lang].unavailableLabel;
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
}
