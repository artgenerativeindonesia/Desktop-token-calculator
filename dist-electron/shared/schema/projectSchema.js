"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectFileSchema = exports.ExportSettingsSchema = exports.ExchangeRateSchema = exports.BudgetAssumptionsSchema = exports.ProductionItemSchema = exports.ModelSelectionSchema = exports.PricingSchema = exports.ReserveInputModeSchema = exports.PricingUnitSchema = exports.QuantityTypeSchema = exports.EstimationModeSchema = exports.ProcessCategorySchema = exports.VerificationStatusSchema = void 0;
exports.compareSchemaVersion = compareSchemaVersion;
exports.validateProjectFileJson = validateProjectFileJson;
const zod_1 = require("zod");
const project_1 = require("../types/project");
exports.VerificationStatusSchema = zod_1.z.enum([
    'verified',
    'manual',
    'stale',
    'unavailable',
    'invalid',
]);
exports.ProcessCategorySchema = zod_1.z.preprocess((val) => (val === 'upscaling' ? 'upscale_video' : val), zod_1.z.enum([
    'text_to_image',
    'image_to_image',
    'image_to_video',
    'video_to_video',
    'text_to_video',
    'upscale_image',
    'upscale_video',
]));
exports.EstimationModeSchema = zod_1.z.enum(['target_final', 'per_shot']);
exports.QuantityTypeSchema = zod_1.z.enum(['shot', 'asset', 'output']);
exports.PricingUnitSchema = zod_1.z.enum([
    'per_generation',
    'per_second',
    'per_asset',
    'per_pack',
]);
exports.ReserveInputModeSchema = zod_1.z.enum(['percent', 'count']);
exports.PricingSchema = zod_1.z.object({
    pricing_unit: exports.PricingUnitSchema,
    price_value: zod_1.z.number().positive().nullable(),
    currency: zod_1.z.literal('USD'),
    credit_cost: zod_1.z.number().nonnegative().nullable(),
    credit_unit: zod_1.z.enum(['per_generation', 'per_second', 'per_clip']).optional(),
    source_name: zod_1.z.string(),
    source_url: zod_1.z.string(),
    retrieved_at: zod_1.z.string(),
    status: exports.VerificationStatusSchema,
});
exports.ModelSelectionSchema = zod_1.z.object({
    provider: zod_1.z.string().min(1),
    model_id: zod_1.z.string().min(1),
    model_name: zod_1.z.string().min(1),
    category: exports.ProcessCategorySchema,
    parameter_values: zod_1.z.record(zod_1.z.union([zod_1.z.string(), zod_1.z.number(), zod_1.z.boolean()])),
});
exports.ProductionItemSchema = zod_1.z.object({
    item_id: zod_1.z.string().min(1),
    category: exports.ProcessCategorySchema,
    label: zod_1.z.string().min(1),
    quantity: zod_1.z.number().int().nonnegative(),
    quantity_type: exports.QuantityTypeSchema,
    duration_seconds: zod_1.z.number().nonnegative(),
    attempts_per_item: zod_1.z.number().int().nonnegative(),
    use_project_target_multiplier: zod_1.z.boolean().optional(),
    model_selection: exports.ModelSelectionSchema,
    pricing: exports.PricingSchema,
    notes: zod_1.z.string().optional(),
});
exports.BudgetAssumptionsSchema = zod_1.z.object({
    estimation_mode: exports.EstimationModeSchema,
    target_videos: zod_1.z.number().int().nonnegative(),
    final_duration_minutes: zod_1.z.number().nonnegative(),
    default_shots_per_video: zod_1.z.number().int().nonnegative(),
    default_attempts_per_shot: zod_1.z.number().int().nonnegative(),
    reserve_input_mode: exports.ReserveInputModeSchema,
    reserve_percent: zod_1.z.number().nonnegative(),
    reserve_generations_override: zod_1.z.number().int().nonnegative(),
});
exports.ExchangeRateSchema = zod_1.z.object({
    base_currency: zod_1.z.literal('USD'),
    quote_currency: zod_1.z.literal('IDR'),
    rate: zod_1.z.number().positive().nullable(),
    rate_type: zod_1.z.string(),
    source_name: zod_1.z.string(),
    source_url: zod_1.z.string(),
    retrieved_at: zod_1.z.string(),
    status: exports.VerificationStatusSchema,
});
exports.ExportSettingsSchema = zod_1.z.object({
    report_title: zod_1.z.string().min(1),
    export_date: zod_1.z.string(),
    export_language: zod_1.z.enum(['id', 'en']),
    prepared_by: zod_1.z.string().optional(),
    client_or_team_name: zod_1.z.string().optional(),
    included_sections: zod_1.z.object({
        executive_summary: zod_1.z.boolean(),
        production_assumptions: zod_1.z.boolean(),
        stage_breakdown: zod_1.z.boolean(),
        credit_breakdown: zod_1.z.boolean(),
        exchange_rate_info: zod_1.z.boolean(),
        warnings_and_audit: zod_1.z.boolean(),
        unit_cost_metrics: zod_1.z.boolean(),
    }),
});
exports.ProjectFileSchema = zod_1.z.object({
    schema_version: zod_1.z.string().min(1),
    project_id: zod_1.z.string().min(1),
    project_name: zod_1.z.string().trim().min(1, {
        message: 'Nama proyek tidak boleh kosong (FR-01).',
    }),
    created_at: zod_1.z.string(),
    updated_at: zod_1.z.string(),
    currency: zod_1.z.literal('USD'),
    language: zod_1.z.enum(['id', 'en']),
    assumptions: exports.BudgetAssumptionsSchema,
    items: zod_1.z.array(exports.ProductionItemSchema),
    exchange_rate: exports.ExchangeRateSchema,
    calculation: zod_1.z.any(), // Akan selalu dihitung ulang secara deterministik oleh CalculationEngine saat dibuka
    export_settings: exports.ExportSettingsSchema,
});
/**
 * Membandingkan versi semver sederhana (mis. "2.0.0" > "1.0.0")
 */
function compareSchemaVersion(versionA, versionB) {
    const partsA = versionA.split('.').map((n) => parseInt(n, 10) || 0);
    const partsB = versionB.split('.').map((n) => parseInt(n, 10) || 0);
    for (let i = 0; i < 3; i++) {
        const a = partsA[i] ?? 0;
        const b = partsB[i] ?? 0;
        if (a > b)
            return 1;
        if (a < b)
            return -1;
    }
    return 0;
}
/**
 * Validasi konten file proyek (.aivbudget) sesuai PRD Bab 10.3 & FR-01, FR-12, FR-13
 */
function validateProjectFileJson(rawJson) {
    let parsed;
    try {
        parsed = JSON.parse(rawJson);
    }
    catch {
        return {
            valid: false,
            errorCode: 'INVALID_JSON',
            errorMessage_id: 'File proyek rusak atau bukan format JSON .aivbudget yang valid. File asli tidak diubah.',
            errorMessage_en: 'Project file is corrupted or not a valid .aivbudget JSON file. Original file was not modified.',
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
    const rawSchemaVersion = parsed.schema_version;
    if (typeof rawSchemaVersion !== 'string' || !rawSchemaVersion.trim()) {
        return {
            valid: false,
            errorCode: 'UNSUPPORTED_SCHEMA_VERSION',
            errorMessage_id: 'File proyek tidak memiliki atribut schema_version yang valid.',
            errorMessage_en: 'Project file is missing a valid schema_version attribute.',
        };
    }
    // PRD Bab 10.3: Jika versi skema lebih baru dari aplikasi, tampilkan pesan kompatibilitas
    if (compareSchemaVersion(rawSchemaVersion, project_1.CURRENT_SCHEMA_VERSION) > 0) {
        return {
            valid: false,
            errorCode: 'NEWER_SCHEMA_VERSION',
            errorMessage_id: `File proyek dibuat dengan versi skema yang lebih baru (v${rawSchemaVersion}) daripada versi aplikasi ini (v${project_1.CURRENT_SCHEMA_VERSION}). Silakan perbarui aplikasi untuk membuka file ini tanpa merusak data.`,
            errorMessage_en: `Project file was created with a newer schema version (v${rawSchemaVersion}) than this app supports (v${project_1.CURRENT_SCHEMA_VERSION}). Please update the application to open this file safely.`,
        };
    }
    const result = exports.ProjectFileSchema.safeParse(parsed);
    if (!result.success) {
        const issues = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
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
        data: result.data,
    };
}
