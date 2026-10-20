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
  verified: { id: 'Terverifikasi', en: 'Verified' },
  manual: { id: 'Manual', en: 'Manual' },
  stale: { id: 'Usang (Cache)', en: 'Stale (Cache)' },
  unavailable: { id: 'Belum Tersedia', en: 'Unavailable' },
  invalid: { id: 'Tidak Valid', en: 'Invalid' },
};

export const PRICING_UNIT_LABELS: Record<PricingUnit, { id: string; en: string }> = {
  per_generation: { id: 'per generasi', en: 'per generation' },
  per_second: { id: 'per detik video', en: 'per video second' },
  per_asset: { id: 'per aset', en: 'per asset' },
  per_pack: { id: 'per paket', en: 'per pack' },
};

export const QUANTITY_TYPE_LABELS: Record<QuantityType, { id: string; en: string }> = {
  shot: { id: 'Jumlah Shot Video', en: 'Video Shots' },
  asset: { id: 'Jumlah Aset Media', en: 'Media Assets' },
  output: { id: 'Jumlah Gambar Output', en: 'Output Images' },
};

export const UI_TEXT = {
  id: {
    appTitle: 'AI Video Budget Calculator',
    appSubtitle: 'Perencana Anggaran Produksi Video AI • Katalog Higgsfield',
    navDashboard: 'Beranda Proyek',
    navSetup: 'Pengaturan & Cadangan',
    navPlanner: 'Perencana Produksi',
    navSummary: 'Ringkasan Anggaran',
    navDataSettings: 'Kurs & Katalog Harga',
    navExportPdf: 'Laporan PDF',
    btnNewProject: 'Proyek Baru',
    btnOpenProject: 'Buka File (.aivbudget)',
    btnSaveProject: 'Simpan Proyek',
    btnSaveAs: 'Simpan Sebagai...',
    btnExportPdf: 'Ekspor Laporan PDF',
    btnLoadPrdTest: 'Muat Contoh Uji PRD (Bab 8.10)',
    btnLoadCommercialDemo: 'Muat Proyek Contoh Komersial (5 Kategori)',
    savedBadge: 'Tersimpan',
    unsavedBadge: 'Belum Disimpan',
    completeEstimate: 'Estimasi Lengkap',
    incompleteEstimate: 'Estimasi Parsial / Belum Lengkap',
    baseCost: 'Biaya Dasar',
    reserveCost: 'Biaya Cadangan Regenerasi',
    totalBudget: 'Total Anggaran Akhir',
    totalCredit: 'Total Konsumsi Credit',
    costPerVideo: 'Biaya per Video Final',
    costPerMinute: 'Biaya per Menit Final',
    plannedGenerations: 'Generasi Dasar (Gplanned)',
    reserveGenerations: 'Generasi Cadangan (Greserve)',
    budgetedGenerations: 'Total Generasi Dianggarkan (Gbudget)',
    exchangeRateLabel: 'Kurs USD/IDR',
    refreshRateBtn: 'Perbarui Kurs Otomatis',
    addStageBtn: 'Tambah Baris Pekerjaan AI',
    duplicateBtn: 'Duplikat',
    deleteBtn: 'Hapus',
    unavailableLabel: 'Belum Tersedia',
  },
  en: {
    appTitle: 'AI Video Budget Calculator',
    appSubtitle: 'AI Video Production Budget Planner • Higgsfield Catalog',
    navDashboard: 'Dashboard & Projects',
    navSetup: 'Project Setup & Reserve',
    navPlanner: 'Production Planner',
    navSummary: 'Budget Summary',
    navDataSettings: 'FX Rate & Catalog',
    navExportPdf: 'Export PDF Report',
    btnNewProject: 'New Project',
    btnOpenProject: 'Open File (.aivbudget)',
    btnSaveProject: 'Save Project',
    btnSaveAs: 'Save As...',
    btnExportPdf: 'Export PDF Report',
    btnLoadPrdTest: 'Load PRD Synthetic Test (Sec 8.10)',
    btnLoadCommercialDemo: 'Load Commercial Sample (5 Categories)',
    savedBadge: 'Saved',
    unsavedBadge: 'Unsaved Changes',
    completeEstimate: 'Complete Estimate',
    incompleteEstimate: 'Partial / Incomplete Estimate',
    baseCost: 'Base Cost',
    reserveCost: 'Regeneration Reserve Cost',
    totalBudget: 'Grand Total Budget',
    totalCredit: 'Total Credit Consumption',
    costPerVideo: 'Cost per Final Video',
    costPerMinute: 'Cost per Final Minute',
    plannedGenerations: 'Planned Generations (Gplanned)',
    reserveGenerations: 'Reserve Generations (Greserve)',
    budgetedGenerations: 'Budgeted Generations (Gbudget)',
    exchangeRateLabel: 'USD/IDR Rate',
    refreshRateBtn: 'Refresh Rate Automatically',
    addStageBtn: 'Add AI Production Stage',
    duplicateBtn: 'Duplicate',
    deleteBtn: 'Delete',
    unavailableLabel: 'Unavailable',
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
