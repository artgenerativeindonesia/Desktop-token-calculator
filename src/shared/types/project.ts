/**
 * AI Video Budget Calculator — Shared Data Types (PRD v1.0 Bab 6, 8, 9, 10, 12)
 */

export const CURRENT_SCHEMA_VERSION = '1.0.0';
export const APP_VERSION = '1.6.0';

export type AppLanguage = 'id' | 'en';
export type GlassTheme = 'dark' | 'light';

/** Label penanda status model seperti pada antarmuka asli Higgsfield */
export type ModelTierBadge = 'NEW' | 'PREMIUM' | 'POPULER' | 'STANDARD';

/** Preset Paket Langganan Credit Higgsfield untuk konversi Credit <-> USD otomatis */
export interface HiggsfieldSubscriptionPlan {
  plan_id: string;
  name_id: string;
  name_en: string;
  monthly_price_usd: number;
  monthly_credits: number;
  usd_per_credit: number;
  description_id: string;
  description_en: string;
  plan_category?: 'individual' | 'business' | 'api' | 'topup';
  billing_cycle?: 'monthly' | 'annual' | 'on_demand';
  discount_badge?: string;
}

/** PRD Bab 9.4: Status verifikasi data */
export type VerificationStatus =
  | 'verified'
  | 'manual'
  | 'stale'
  | 'unavailable'
  | 'invalid';

/** 7 Kategori Proses AI (termasuk Image to Image, Upscale Image, & Upscale Video) */
export type ProcessCategory =
  | 'text_to_image'
  | 'image_to_image'
  | 'image_to_video'
  | 'video_to_video'
  | 'text_to_video'
  | 'upscale_image'
  | 'upscale_video';

export const ALL_PROCESS_CATEGORIES: ProcessCategory[] = [
  'text_to_image',
  'image_to_image',
  'image_to_video',
  'video_to_video',
  'text_to_video',
  'upscale_image',
  'upscale_video',
];

/** PRD Bab 1.1 & 8.8: Dua mode estimasi */
export type EstimationMode = 'target_final' | 'per_shot';

/** PRD Bab 8.2: Penjelasan eksplisit jenis kuantitas */
export type QuantityType = 'shot' | 'asset' | 'output';

/** PRD Bab 8.4 & 9.1: Satuan harga model */
export type PricingUnit =
  | 'per_generation'
  | 'per_second'
  | 'per_asset'
  | 'per_pack';

/** Mode input cadangan regenerasi 2 arah (Persentase R <-> Jumlah Generasi Cadangan Greserve) */
export type ReserveInputMode = 'percent' | 'count';

/** Definisi opsi parameter dinamis pada katalog model (PRD Bab 6.1) */
export interface ModelParameterDefinition {
  key: string;
  label_id: string;
  label_en: string;
  type: 'select' | 'number' | 'boolean';
  options?: Array<{ value: string | number; label: string }>;
  defaultValue: string | number | boolean;
  unit?: string;
  affectsPricing: boolean;
}

/** Varian harga berdasarkan kombinasi parameter (mis. 720p vs 1080p vs 4K) */
export interface CatalogPricingVariant {
  matchParameters?: Record<string, string | number | boolean>;
  pricing_unit: PricingUnit;
  price_value: number | null;
  currency: 'USD';
  credit_cost: number | null;
  credit_unit?: 'per_generation' | 'per_second' | 'per_clip';
  status: VerificationStatus;
}

/** Entri katalog model Higgsfield (PRD Bab 6.1 & 9.1) */
export interface CatalogModelEntry {
  provider: string;
  model_id: string;
  model_name: string;
  family: string;
  tier_badge?: ModelTierBadge;
  unlimited_eligible?: boolean;
  is_custom_model?: boolean;
  supported_categories: ProcessCategory[];
  description_id: string;
  description_en: string;
  default_quantity_type: QuantityType;
  supports_duration: boolean;
  default_duration_seconds: number;
  parameters: ModelParameterDefinition[];
  pricing_variants: CatalogPricingVariant[];
  source_name: string;
  source_url: string;
  retrieved_at: string;
}

/** PRD Bab 9.1 & 10.2: Objek Pricing pada setiap item produksi */
export interface Pricing {
  pricing_unit: PricingUnit;
  price_value: number | null; // null jika Unavailable (PRD FR-09: jangan dianggap 0)
  currency: 'USD';
  credit_cost: number | null; // null jika tidak tersedia
  credit_unit?: 'per_generation' | 'per_second' | 'per_clip';
  source_name: string;
  source_url: string;
  retrieved_at: string;
  status: VerificationStatus;
}

/** PRD Bab 10.2: Objek ModelSelection */
export interface ModelSelection {
  provider: string;
  model_id: string;
  model_name: string;
  category: ProcessCategory;
  parameter_values: Record<string, string | number | boolean>;
}

/** PRD Bab 10.2: Objek ProductionItem (Baris pekerjaan produksi) */
export interface ProductionItem {
  item_id: string;
  category: ProcessCategory;
  label: string; // Nama shot / tahap / aset
  quantity: number; // S_i (jumlah shot/aset/output, atau jumlah shot per video pada mode target_final)
  quantity_type: QuantityType;
  duration_seconds: number; // Durasi per shot/klip jika relevan
  attempts_per_item: number; // A_i (jumlah percobaan yang direncanakan per shot/aset)
  use_project_target_multiplier?: boolean; // Pada mode target_final, kalikan dengan target_videos (V)
  is_unlimited?: boolean; // True jika menggunakan kuota Paket Unlimited Higgsfield (Rp 0 / 0 Credit tambahan)
  model_selection: ModelSelection;
  pricing: Pricing;
  notes?: string;
}

/** PRD Bab 8.1, 8.3, 8.8, 10.2: Objek BudgetAssumptions */
export interface BudgetAssumptions {
  estimation_mode: EstimationMode;
  target_videos: number; // V: Jumlah video final
  final_duration_minutes: number; // M: Total durasi video final dalam menit
  default_shots_per_video: number;
  default_attempts_per_shot: number;
  reserve_input_mode: ReserveInputMode; // 'percent' atau 'count' (sinkronisasi 2 arah)
  reserve_percent: number; // R dalam persen, mis. 20 untuk 20%
  reserve_generations_override: number; // Greserve jika diinput langsung oleh user
}

/** PRD Bab 9.3 & 10.2: Objek ExchangeRate */
export interface ExchangeRate {
  base_currency: 'USD';
  quote_currency: 'IDR';
  rate: number | null; // X: Nilai IDR per 1 USD
  rate_type: string; // mis. 'ECB Reference Rate', 'Market Mid-Rate', 'Manual Input'
  source_name: string;
  source_url: string;
  retrieved_at: string;
  status: VerificationStatus;
}

/** Hasil perhitungan per baris pekerjaan */
export interface ItemCalculationResult {
  item_id: string;
  label: string;
  category: ProcessCategory;
  model_name: string;
  effective_quantity: number; // S_i efektif
  attempts_per_item: number; // A_i
  planned_generations: number; // Gplanned,i = S_i * A_i
  reserve_generations: number; // Greserve,i
  budgeted_generations: number; // Gbudget,i = Gplanned,i + Greserve,i
  unit_multiplier: number; // 1 untuk per_generation/per_asset, duration_seconds untuk per_second
  pricing_unit: PricingUnit;
  unit_price_usd: number | null;
  base_cost_usd: number | null; // B_i
  reserve_cost_usd: number | null; // Breserve,i
  total_cost_usd: number | null; // B_i + Breserve,i
  base_cost_idr: number | null;
  reserve_cost_idr: number | null;
  total_cost_idr: number | null;
  unit_credit: number | null;
  total_credit: number | null;
  pricing_status: VerificationStatus;
  is_item_complete: boolean;
  warnings: string[];
}

/** Ringkasan per kategori proses AI (PRD Bab 11.2) */
export interface CategorySummary {
  category: ProcessCategory;
  item_count: number;
  planned_generations: number;
  reserve_generations: number;
  budgeted_generations: number;
  base_cost_usd: number;
  reserve_cost_usd: number;
  total_cost_usd: number;
  total_cost_idr: number | null;
  total_credit: number;
  has_incomplete_items: boolean;
}

/** Peringatan & status audit proyek (PRD Bab 11.2 & 12.2) */
export interface CalculationWarning {
  code:
    | 'UNAVAILABLE_PRICE'
    | 'MANUAL_PRICE'
    | 'STALE_PRICE'
    | 'UNAVAILABLE_FX'
    | 'MANUAL_FX'
    | 'STALE_FX'
    | 'MISSING_TARGET_ASSUMPTIONS'
    | 'ZERO_DIVISOR_VIDEO'
    | 'ZERO_DIVISOR_MINUTE';
  severity: 'error' | 'warning' | 'info';
  message_id: string;
  message_en: string;
  item_id?: string;
}

/** PRD Bab 8 & 10.2: Objek Calculation (Hasil terstruktur dari Calculation Engine) */
export interface CalculationResult {
  planned_generations: number; // Gplanned total
  reserve_generations: number; // Greserve total
  budgeted_generations: number; // Gbudget total
  effective_reserve_percent: number; // R efektif (%)
  base_cost_usd: number; // Σ B_i
  reserve_cost_usd: number; // Σ Breserve,i
  total_cost_usd: number; // Btotal (USD)
  base_cost_idr: number | null;
  reserve_cost_idr: number | null;
  total_cost_idr: number | null; // BIDR = BUSD * X
  total_credit: number | null; // Ctotal
  has_credit_items: boolean;
  cost_per_video_usd: number | null; // Bvideo (USD)
  cost_per_video_idr: number | null; // Bvideo (IDR)
  cost_per_minute_usd: number | null; // Bminute (USD)
  cost_per_minute_idr: number | null; // Bminute (IDR)
  is_complete: boolean; // False jika ada item yang wajib dihitung tetapi tarif/kurs Unavailable
  incomplete_item_count: number;
  item_results: ItemCalculationResult[];
  category_summaries: Record<ProcessCategory, CategorySummary>;
  warnings: CalculationWarning[];
  calculated_at: string;
}

/** PRD Bab 10.2 & 12.2: Pengaturan ekspor PDF */
export interface ExportSettings {
  report_title: string;
  export_date: string;
  export_language: AppLanguage;
  prepared_by?: string;
  client_or_team_name?: string;
  included_sections: {
    executive_summary: boolean;
    production_assumptions: boolean;
    stage_breakdown: boolean;
    credit_breakdown: boolean;
    exchange_rate_info: boolean;
    warnings_and_audit: boolean;
    unit_cost_metrics: boolean;
  };
}

/** PRD Bab 10.1 & 10.2: Struktur File Proyek Mandiri (.aivbudget) */
export interface ProjectFile {
  schema_version: string;
  project_id: string;
  project_name: string;
  created_at: string;
  updated_at: string;
  currency: 'USD';
  language: AppLanguage;
  assumptions: BudgetAssumptions;
  items: ProductionItem[];
  exchange_rate: ExchangeRate;
  calculation: CalculationResult;
  export_settings: ExportSettings;
}

/** Entri daftar proyek yang baru dibuka (Recent Projects di Dashboard) */
export interface RecentProjectEntry {
  project_id: string;
  project_name: string;
  file_path: string;
  updated_at: string;
  total_cost_usd: number;
  total_cost_idr: number | null;
  is_complete: boolean;
}
