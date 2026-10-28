import { z } from 'zod';
import { CURRENT_SCHEMA_VERSION, ProjectFile } from '../types/project';

export const VerificationStatusSchema = z.enum([
  'verified',
  'manual',
  'stale',
  'unavailable',
  'invalid',
]);

export const ProcessCategorySchema = z.preprocess(
  (val) => {
    if (val === 'upscaling') return 'upscale_video';
    if (val === 'voiceover' || val === 'voice' || val === 'tts') return 'voice_over';
    return val;
  },
  z.enum([
    'text_to_image',
    'image_to_image',
    'image_to_video',
    'video_to_video',
    'text_to_video',
    'upscale_image',
    'upscale_video',
    'voice_over',
  ])
);

export const EstimationModeSchema = z.enum(['target_final', 'per_shot']);

export const QuantityTypeSchema = z.enum(['shot', 'asset', 'output']);

export const PricingUnitSchema = z.enum([
  'per_generation',
  'per_second',
  'per_asset',
  'per_pack',
]);

export const ReserveInputModeSchema = z.enum(['percent', 'count']);

export const PricingSchema = z.object({
  pricing_unit: PricingUnitSchema,
  price_value: z.number().positive().nullable(),
  currency: z.literal('USD'),
  credit_cost: z.number().nonnegative().nullable(),
  credit_unit: z.enum(['per_generation', 'per_second', 'per_clip']).optional(),
  source_name: z.string(),
  source_url: z.string(),
  retrieved_at: z.string(),
  status: VerificationStatusSchema,
});

export const ModelSelectionSchema = z.object({
  provider: z.string().min(1),
  model_id: z.string().min(1),
  model_name: z.string().min(1),
  category: ProcessCategorySchema,
  parameter_values: z.record(z.union([z.string(), z.number(), z.boolean()])),
});

export const ProductionItemSchema = z.object({
  item_id: z.string().min(1),
  category: ProcessCategorySchema,
  label: z.string().min(1),
  quantity: z.number().int().nonnegative(),
  quantity_type: QuantityTypeSchema,
  duration_seconds: z.number().nonnegative(),
  attempts_per_item: z.number().int().nonnegative(),
  use_project_target_multiplier: z.boolean().optional(),
  is_primary_shot: z.boolean().optional(),
  is_unlimited: z.boolean().optional(),
  model_selection: ModelSelectionSchema,
  pricing: PricingSchema,
  notes: z.string().optional(),
  script_text: z.string().optional(),
  script_language: z.enum(['id', 'en']).optional(),
  character_count: z.number().int().nonnegative().optional(),
});

export const ElevenLabsSubscriptionPlanSchema = z.object({
  plan_id: z.string().min(1),
  name_id: z.string().min(1),
  name_en: z.string().min(1),
  monthly_price_usd: z.number().nonnegative(),
  monthly_credits: z.number().nonnegative(),
  usd_per_credit: z.number().nonnegative(),
  description_id: z.string(),
  description_en: z.string(),
  plan_category: z
    .enum(['free', 'starter', 'creator', 'pro', 'scale', 'business'])
    .optional(),
  billing_cycle: z.enum(['monthly', 'annual']).optional(),
  discount_badge: z.string().optional(),
});

export const BudgetAssumptionsSchema = z.object({
  estimation_mode: EstimationModeSchema,
  target_videos: z.number().int().nonnegative().default(1),
  final_duration_minutes: z.number().nonnegative(),
  default_shots_per_video: z.number().int().nonnegative(),
  default_attempts_per_shot: z.number().int().nonnegative(),
  reserve_input_mode: ReserveInputModeSchema,
  reserve_percent: z.number().nonnegative(),
  reserve_generations_override: z.number().int().nonnegative(),
  elevenlabs_plan_id: z.string().optional(),
});

export const ExchangeRateSchema = z.object({
  base_currency: z.literal('USD'),
  quote_currency: z.literal('IDR'),
  rate: z.number().positive().nullable(),
  rate_type: z.string(),
  source_name: z.string(),
  source_url: z.string(),
  retrieved_at: z.string(),
  status: VerificationStatusSchema,
});

export const ExportSettingsSchema = z.object({
  report_title: z.string().min(1),
  export_date: z.string(),
  export_language: z.enum(['id', 'en']),
  prepared_by: z.string().optional(),
  client_or_team_name: z.string().optional(),
  included_sections: z.object({
    executive_summary: z.boolean(),
    production_assumptions: z.boolean(),
    stage_breakdown: z.boolean(),
    credit_breakdown: z.boolean(),
    exchange_rate_info: z.boolean(),
    warnings_and_audit: z.boolean(),
    unit_cost_metrics: z.boolean(),
  }),
});

export const ProjectFileSchema = z.object({
  schema_version: z.string().min(1),
  project_id: z.string().min(1),
  project_name: z.string().trim().min(1, {
    message: 'Nama proyek tidak boleh kosong (FR-01).',
  }),
  created_at: z.string(),
  updated_at: z.string(),
  currency: z.literal('USD'),
  language: z.enum(['id', 'en']),
  assumptions: BudgetAssumptionsSchema,
  items: z.array(ProductionItemSchema),
  exchange_rate: ExchangeRateSchema,
  calculation: z.any(), // Akan selalu dihitung ulang secara deterministik oleh CalculationEngine saat dibuka
  export_settings: ExportSettingsSchema,
});

export interface ProjectValidationResult {
  valid: boolean;
  data?: ProjectFile;
  errorCode?:
    | 'INVALID_JSON'
    | 'NEWER_SCHEMA_VERSION'
    | 'UNSUPPORTED_SCHEMA_VERSION'
    | 'VALIDATION_FAILED';
  errorMessage_id?: string;
  errorMessage_en?: string;
  issues?: string[];
}

/**
 * Membandingkan versi semver sederhana (mis. "2.0.0" > "1.0.0")
 */
export function compareSchemaVersion(versionA: string, versionB: string): number {
  const partsA = versionA.split('.').map((n) => parseInt(n, 10) || 0);
  const partsB = versionB.split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i++) {
    const a = partsA[i] ?? 0;
    const b = partsB[i] ?? 0;
    if (a > b) return 1;
    if (a < b) return -1;
  }
  return 0;
}

/**
 * Validasi konten file proyek (.aivbudget) sesuai PRD Bab 10.3 & FR-01, FR-12, FR-13
 */
export function validateProjectFileJson(rawJson: string): ProjectValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return {
      valid: false,
      errorCode: 'INVALID_JSON',
      errorMessage_id:
        'File proyek rusak atau bukan format JSON .aivbudget yang valid. File asli tidak diubah.',
      errorMessage_en:
        'Project file is corrupted or not a valid .aivbudget JSON file. Original file was not modified.',
    };
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return {
      valid: false,
      errorCode: 'VALIDATION_FAILED',
      errorMessage_id: 'Struktur data proyek tidak dikenali.',
      errorMessage_en: 'Unrecognized project data structure.',
    };
  }

  const rawSchemaVersion = (parsed as Record<string, unknown>).schema_version;
  if (typeof rawSchemaVersion !== 'string' || !rawSchemaVersion.trim()) {
    return {
      valid: false,
      errorCode: 'UNSUPPORTED_SCHEMA_VERSION',
      errorMessage_id: 'File proyek tidak memiliki atribut schema_version yang valid.',
      errorMessage_en: 'Project file is missing a valid schema_version attribute.',
    };
  }

  // PRD Bab 10.3: Jika versi skema lebih baru dari aplikasi, tampilkan pesan kompatibilitas
  if (compareSchemaVersion(rawSchemaVersion, CURRENT_SCHEMA_VERSION) > 0) {
    return {
      valid: false,
      errorCode: 'NEWER_SCHEMA_VERSION',
      errorMessage_id: `File proyek dibuat dengan versi skema yang lebih baru (v${rawSchemaVersion}) daripada versi aplikasi ini (v${CURRENT_SCHEMA_VERSION}). Silakan perbarui aplikasi untuk membuka file ini tanpa merusak data.`,
      errorMessage_en: `Project file was created with a newer schema version (v${rawSchemaVersion}) than this app supports (v${CURRENT_SCHEMA_VERSION}). Please update the application to open this file safely.`,
    };
  }

  const result = ProjectFileSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`
    );
    return {
      valid: false,
      errorCode: 'VALIDATION_FAILED',
      errorMessage_id: `Validasi file proyek gagal: ${issues[0] || 'Field wajib tidak sesuai.'}`,
      errorMessage_en: `Project file validation failed: ${issues[0] || 'Required fields are invalid.'}`,
      issues,
    };
  }

  return {
    valid: true,
    data: result.data as ProjectFile,
  };
}
