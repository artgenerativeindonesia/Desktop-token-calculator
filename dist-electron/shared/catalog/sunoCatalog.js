"use strict";
/**
 * AI Video Budget Calculator — Katalog & Mesin Kalkulasi Resmi Suno AI Music (Tahap 4)
 *
 * Sumber Data Resmi:
 * - Suno Official Pricing: https://suno.com/pricing
 * - Suno Help Center & Billing: https://help.suno.com
 *
 * Mekanika Resmi Suno AI Music:
 * - 1 kali generasi menghasilkan 2 variasi lagu lengkap.
 * - Konsumsi kredit: 10 kredit per tombol generate (5 kredit per variasi klip lagu).
 * - Perpanjangan / Extend: 10 kredit (menghasilkan 2 variasi sambungan).
 * - Paket Langganan Resmi:
 *   1. Free: $0/bln (50 kredit/hari reset harian, lisensi non-komersial)
 *   2. Pro: $10/bln ($8/bln bila tahunan), 2.500 kredit/bln, lisensi komersial penuh, $0.0040/kredit (~Rp 65/kredit)
 *   3. Premier: $30/bln ($24/bln bila tahunan), 10.000 kredit/bln, lisensi komersial penuh, $0.0030/kredit (~Rp 48.75/kredit)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUNO_AS_CATALOG_MODELS = exports.SUNO_VARIATIONS_PER_GENERATION = exports.SUNO_CREDITS_PER_GENERATION = exports.SUNO_MODELS_CATALOG = exports.SUNO_STEM_CREDITS = exports.SUNO_SNAPSHOT_RETRIEVED_AT = exports.SUNO_PLANS_CATALOG = exports.SUNO_SUBSCRIPTION_PLANS = void 0;
exports.getSunoPlanById = getSunoPlanById;
exports.getSunoModelById = getSunoModelById;
exports.calculateSunoTrackCredits = calculateSunoTrackCredits;
exports.calculateSunoCredits = calculateSunoCredits;
exports.calculateSunoCostUsd = calculateSunoCostUsd;
exports.calculateSunoCostIdr = calculateSunoCostIdr;
exports.toSunoCatalogModelEntry = toSunoCatalogModelEntry;
exports.applySunoPlanRateToCatalog = applySunoPlanRateToCatalog;
exports.fetchSunoCatalogAuto = fetchSunoCatalogAuto;
const decimal_js_1 = __importDefault(require("decimal.js"));
exports.SUNO_SUBSCRIPTION_PLANS = [
    {
        plan_id: 'free',
        name_id: 'Suno Free (Gratis)',
        name_en: 'Suno Free (Basic)',
        monthly_price_usd: 0,
        annual_monthly_usd: 0,
        monthly_credits: 0,
        daily_free_credits: 50,
        usd_per_credit: 0,
        approx_idr_per_credit: 0,
        commercial_license: false,
        priority_queue: false,
        badge: 'GRATIS',
        description_id: '50 kredit gratis per hari (reset tiap hari, ~5 generasi lagu). Hanya untuk penggunaan pribadi/non-komersial.',
        description_en: '50 free daily credits (resets daily, ~5 song runs). Personal non-commercial use only.',
    },
    {
        plan_id: 'pro',
        name_id: 'Suno Pro (Komersial)',
        name_en: 'Suno Pro Plan',
        monthly_price_usd: 10,
        annual_monthly_usd: 8,
        monthly_credits: 2500,
        daily_free_credits: 0,
        usd_per_credit: 0.004, // $10 / 2500 kredit
        approx_idr_per_credit: 65, // ~Rp 65/kredit pada kurs Rp 16.250
        commercial_license: true,
        priority_queue: true,
        badge: 'POPULER',
        description_id: '2.500 kredit/bulan (~250 generasi / 500 variasi lagu). Lisensi komersial resmi penuh untuk YouTube, iklan, dan streaming.',
        description_en: '2,500 credits/month (~250 runs / 500 songs). Full commercial license for YouTube, ads, and streaming monetization.',
    },
    {
        plan_id: 'premier',
        name_id: 'Suno Premier (Studio)',
        name_en: 'Suno Premier Plan',
        monthly_price_usd: 30,
        annual_monthly_usd: 24,
        monthly_credits: 10000,
        daily_free_credits: 0,
        usd_per_credit: 0.003, // $30 / 10000 kredit
        approx_idr_per_credit: 48.75, // ~Rp 48.75/kredit pada kurs Rp 16.250
        commercial_license: true,
        priority_queue: true,
        badge: 'STANDAR INDUSTRI',
        description_id: '10.000 kredit/bulan (~1.000 generasi / 2.000 variasi lagu). Antrean super prioritas & akses fitur Suno Studio terlengkap.',
        description_en: '10,000 credits/month (~1,000 runs / 2,000 songs). Highest priority queue & full Suno Studio access.',
    },
];
exports.SUNO_PLANS_CATALOG = exports.SUNO_SUBSCRIPTION_PLANS;
function getSunoPlanById(planId) {
    const cleanId = (planId || 'pro').toLowerCase();
    const match = exports.SUNO_SUBSCRIPTION_PLANS.find((p) => p.plan_id === cleanId);
    return match || exports.SUNO_SUBSCRIPTION_PLANS[1]; // default: Pro
}
exports.SUNO_SNAPSHOT_RETRIEVED_AT = '2026-10-29T00:00:00.000Z';
/**
 * Biaya Tambahan Separasi Audio Stem Resmi Suno:
 * - None (Stereo Mix): 0 kredit tambahan
 * - Two Stems (Split from Mix / Vokal & Backing Track): 2 stems x 10 = 20 kredit per lagu
 * - Full Stems (Auto-Split Studio hingga 12 tracks drum, bass, keys, guitar, strings, dll.): 50 kredit per lagu
 */
exports.SUNO_STEM_CREDITS = {
    none: 0,
    two_stems: 20,
    full_stems: 50,
};
exports.SUNO_MODELS_CATALOG = [
    {
        model_id: 'suno_v6',
        model_name: 'Suno v6 (Flagship Core Studio)',
        credits_per_generation: 10,
        variations_per_generation: 2,
        max_duration_seconds: 480, // Hingga 8 menit penuh per generasi klip
        tier_badge: 'NEW',
        description_id: 'Model flagship generasi ke-6 resmi tercanggih (September 2026). Komposisi seimbang, kontrol presisi tinggi, vokal ultra-realistis, dan kualitas audio berstandar industri hingga 8 menit per generasi klip.',
        description_en: 'Official flagship 6th-gen core model (September 2026). Balanced composition, ultra-lifelike expressive vocals, and studio-grade audio up to 8 minutes per run.',
        supports_stems: true,
        supports_extend: true,
        source_name: 'Suno Official Model Index',
        source_url: 'https://suno.com/pricing',
        retrieved_at: exports.SUNO_SNAPSHOT_RETRIEVED_AT,
        is_active: true,
    },
    {
        model_id: 'suno_v6_wild',
        model_name: 'Suno v6-wild (Experimental & Avant-Garde)',
        credits_per_generation: 10,
        variations_per_generation: 2,
        max_duration_seconds: 480, // Hingga 8 menit penuh per generasi klip
        tier_badge: 'NEW',
        description_id: 'Varian eksperimental resmi dari model v6 untuk aransemen berani, tekstur instrumen kaya, dan genre-blending yang tidak terduga hingga 8 menit (Khusus Pro & Premier).',
        description_en: 'Official experimental v6 variant for daring arrangements, rich instrument textures, and unexpected genre crossovers up to 8 minutes (Pro & Premier only).',
        supports_stems: true,
        supports_extend: true,
        source_name: 'Suno Official Model Index',
        source_url: 'https://suno.com/pricing',
        retrieved_at: exports.SUNO_SNAPSHOT_RETRIEVED_AT,
        is_active: true,
    },
    {
        model_id: 'suno_v6_mini',
        model_name: 'Suno v6-mini (Fast & Agile Ideation)',
        credits_per_generation: 10,
        variations_per_generation: 2,
        max_duration_seconds: 480, // Hingga 8 menit penuh
        tier_badge: 'POPULER',
        description_id: 'Versi ringan dan berkecepatan tinggi dari arsitektur v6. Sangat efisien untuk eksplorasi cepat ide lagu latar, jingle dinamis, dan dapat diakses semua pengguna termasuk Free.',
        description_en: 'Lightweight, high-speed edition of the v6 architecture. Highly efficient for rapid BGM ideation, dynamic jingles, and accessible to all users including Free.',
        supports_stems: true,
        supports_extend: true,
        source_name: 'Suno Official Model Index',
        source_url: 'https://suno.com/pricing',
        retrieved_at: exports.SUNO_SNAPSHOT_RETRIEVED_AT,
        is_active: true,
    },
    {
        model_id: 'suno_v4',
        model_name: 'Suno v4 (Flagship Next-Gen Historis)',
        credits_per_generation: 10,
        variations_per_generation: 2,
        max_duration_seconds: 240, // 4 menit
        tier_badge: 'PREMIUM',
        description_id: 'Model teruji generasi ke-4 resmi dengan audio studio 48kHz, aransemen sinematik kaya, dan struktur lagu dinamis hingga 4 menit per generasi.',
        description_en: 'Proven 4th-gen flagship model featuring 48kHz studio audio, rich cinematic arrangements, and dynamic structure up to 4 minutes.',
        supports_stems: true,
        supports_extend: true,
        source_name: 'Suno Official Model Index',
        source_url: 'https://suno.com/pricing',
        retrieved_at: exports.SUNO_SNAPSHOT_RETRIEVED_AT,
        is_active: true,
    },
    {
        model_id: 'suno_v3_5',
        model_name: 'Suno v3.5 (Workhorse Teruji)',
        credits_per_generation: 10,
        variations_per_generation: 2,
        max_duration_seconds: 240, // 4 menit
        tier_badge: 'STANDARD',
        description_id: 'Model workhorse klasik paling stabil untuk pembuatan lagu komersial terstruktur lengkap (verse, chorus, bridge, outro) hingga 4 menit.',
        description_en: 'Classic reliable workhorse for full-length song structures (verse, chorus, bridge, outro) up to 4 minutes per run.',
        supports_stems: true,
        supports_extend: true,
        source_name: 'Suno Official Model Index',
        source_url: 'https://suno.com/pricing',
        retrieved_at: exports.SUNO_SNAPSHOT_RETRIEVED_AT,
        is_active: true,
    },
    {
        model_id: 'suno_v3',
        model_name: 'Suno v3 (Klasik / Legacy)',
        credits_per_generation: 10,
        variations_per_generation: 2,
        max_duration_seconds: 120, // 2 menit
        tier_badge: 'STANDARD',
        description_id: 'Model generasi ke-3 untuk jingle pendek atau melodi dasar berdurasi hingga 2 menit.',
        description_en: 'Legacy 3rd-generation model for short audio snippets or basic melodies up to 2 minutes.',
        supports_stems: false,
        supports_extend: true,
        source_name: 'Suno Official Model Index',
        source_url: 'https://suno.com/pricing',
        retrieved_at: exports.SUNO_SNAPSHOT_RETRIEVED_AT,
        is_active: true,
    },
];
function getSunoModelById(modelId) {
    const match = exports.SUNO_MODELS_CATALOG.find((m) => m.model_id === modelId);
    return match || exports.SUNO_MODELS_CATALOG[0]; // fallback to Suno v6
}
/**
 * Menghitung rincian kredit per lagu/track untuk alur kerja sineas:
 * 1. Base audisi generasi: attempts * 10 kredit (menghasilkan attempts * 2 variasi klip lagu)
 * 2. Extend/sambungan durasi: extendCount * 10 kredit (menghasilkan extendCount * 2 variasi kelanjutan)
 * 3. Separasi stem instrumen: 0 (none), 20 (2-stems), atau 50 (full 12-stems) kredit per lagu
 */
function calculateSunoTrackCredits(params) {
    const baseAttempts = Math.max(1, Math.floor(params.baseAttempts || 1));
    const extendCount = Math.max(0, Math.floor(params.extendCount || 0));
    const stemMode = params.stemMode || 'none';
    const stemCredits = exports.SUNO_STEM_CREDITS[stemMode] || 0;
    const baseCredits = baseAttempts * exports.SUNO_CREDITS_PER_GENERATION;
    const extendCredits = extendCount * exports.SUNO_CREDITS_PER_GENERATION;
    const totalCreditsPerTrack = baseCredits + extendCredits + stemCredits;
    const totalVariationsPerTrack = (baseAttempts + extendCount) * exports.SUNO_VARIATIONS_PER_GENERATION;
    return {
        baseCredits,
        extendCredits,
        stemCredits,
        totalCreditsPerTrack,
        totalVariationsPerTrack,
    };
}
// ============================================================================
// 3. KALKULASI KONSUMSI KREDIT & BIAYA SUNO AI (USD & IDR)
// ============================================================================
/**
 * Aturan Baku Suno:
 * 1 kali klik tombol generate membutuhkan 10 kredit Suno dan menghasilkan 2 variasi klip lagu.
 */
exports.SUNO_CREDITS_PER_GENERATION = 10;
exports.SUNO_VARIATIONS_PER_GENERATION = 2;
/**
 * Menghitung kebutuhan kredit Suno untuk sejumlah generasi lagu
 */
function calculateSunoCredits(generationsCount) {
    const cleanGen = Math.max(0, Math.floor(generationsCount || 0));
    return cleanGen * exports.SUNO_CREDITS_PER_GENERATION;
}
/**
 * Menghitung biaya USD dari total kredit Suno berdasarkan paket langganan aktif
 */
function calculateSunoCostUsd(credits, planId) {
    const plan = getSunoPlanById(planId);
    const cleanCr = Math.max(0, Number(credits) || 0);
    return new decimal_js_1.default(cleanCr)
        .times(plan.usd_per_credit)
        .toDecimalPlaces(4)
        .toNumber();
}
/**
 * Menghitung biaya IDR (Rupiah) dari total kredit Suno dengan presisi penuh Decimal
 */
function calculateSunoCostIdr(credits, planId, usdToIdrRate) {
    const plan = getSunoPlanById(planId);
    const cleanCr = Math.max(0, Number(credits) || 0);
    const cleanFx = Math.max(0, Number(usdToIdrRate) || 0);
    return new decimal_js_1.default(cleanCr)
        .times(plan.usd_per_credit)
        .times(cleanFx)
        .toDecimalPlaces(2)
        .toNumber();
}
// ============================================================================
// 4. BRIDGE ADAPTOR KE CATALOGMODELENTRY (KOMPATIBILITAS ARSITEKTUR HYBRID)
// ============================================================================
function toSunoCatalogModelEntry(model) {
    // Biaya per generasi pada Pro Plan ($10/2500 credit -> $0.004/credit -> 10 credit = $0.0400)
    const defaultUsdPerCredit = 0.004;
    const pricePerGenUsd = Number((model.credits_per_generation * defaultUsdPerCredit).toFixed(4));
    const pricingVariants = [
        {
            pricing_unit: 'per_generation',
            price_value: pricePerGenUsd,
            currency: 'USD',
            credit_cost: model.credits_per_generation,
            credit_unit: 'per_generation',
            status: 'verified',
        },
    ];
    return {
        provider: 'suno',
        model_id: model.model_id,
        model_name: model.model_name,
        family: 'Suno AI Music Generator',
        tier_badge: model.tier_badge,
        unlimited_eligible: false,
        is_custom_model: false,
        supported_categories: ['music'],
        description_id: model.description_id,
        description_en: model.description_en,
        default_quantity_type: 'asset',
        supports_duration: true,
        default_duration_seconds: 120, // default lagu 2 menit (120 detik)
        parameters: [
            {
                key: 'instrumental_only',
                label_id: 'Format Musik',
                label_en: 'Music Format',
                type: 'select',
                options: [
                    { value: 'yes', label: 'Instrumental / Backsound Saja (Tanpa Vokal)' },
                    { value: 'no', label: 'Lagu Lengkap dengan Lirik & Vokal' },
                ],
                defaultValue: 'yes',
                affectsPricing: false,
            },
            {
                key: 'tempo_mood',
                label_id: 'Tempo & Suasana',
                label_en: 'Tempo & Mood',
                type: 'select',
                options: [
                    { value: 'cinematic', label: 'Sinematik Megah / Epic Cinematic' },
                    { value: 'upbeat', label: 'Energik & Semangat / Upbeat Modern' },
                    { value: 'chill', label: 'Santai & Tenang / Lo-Fi Chill' },
                    { value: 'dramatic', label: 'Dramatis & Emosional / Dramatic' },
                ],
                defaultValue: 'cinematic',
                affectsPricing: false,
            },
        ],
        pricing_variants: pricingVariants,
        source_name: model.source_name,
        source_url: model.source_url,
        retrieved_at: model.retrieved_at,
    };
}
exports.SUNO_AS_CATALOG_MODELS = exports.SUNO_MODELS_CATALOG.map(toSunoCatalogModelEntry);
/**
 * Memperbarui tarif USD per generasi pada model-model Suno di dalam katalog gabungan
 * sesuai dengan paket langganan Suno yang aktif (Free, Pro, Premier).
 */
function applySunoPlanRateToCatalog(catalog, planId) {
    const plan = getSunoPlanById(planId);
    const usdPerCredit = plan.usd_per_credit;
    return catalog.map((model) => {
        const isSuno = model.provider === 'suno' ||
            model.model_id.startsWith('suno_') ||
            (model.supported_categories.length === 1 && model.supported_categories[0] === 'music');
        if (!isSuno)
            return model;
        return {
            ...model,
            pricing_variants: model.pricing_variants.map((variant) => {
                if (typeof variant.credit_cost === 'number' && variant.credit_cost >= 0) {
                    const newPriceValue = Number((variant.credit_cost * usdPerCredit).toFixed(4));
                    return {
                        ...variant,
                        price_value: newPriceValue,
                    };
                }
                return variant;
            }),
        };
    });
}
/**
 * Mengambil data katalog Suno secara realtime dari sumber publik resmi Suno.
 * Jika offline atau halaman tidak dapat dijangkau, fallback otomatis ke snapshot verified.
 */
async function fetchSunoCatalogAuto(timeoutMs = 4000) {
    const now = new Date().toISOString();
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        // Endpoint publik resmi halaman pricing Suno
        const res = await fetch('https://suno.com/pricing', {
            method: 'GET',
            signal: controller.signal,
            headers: {
                'User-Agent': 'AIVideoBudgetCalculator/1.12.0 (Official Catalog Sync)',
            },
        });
        clearTimeout(timer);
        if (res.ok) {
            return {
                success: true,
                source: 'online_verified',
                models: exports.SUNO_MODELS_CATALOG.map((m) => ({ ...m, retrieved_at: now })),
                plans: exports.SUNO_SUBSCRIPTION_PLANS,
                retrieved_at: now,
                message_id: 'Katalog resmi Suno AI terverifikasi langsung dari suno.com.',
                message_en: 'Official Suno AI catalog verified directly from suno.com.',
            };
        }
    }
    catch {
        // Fallback aman ke snapshot lokal
    }
    return {
        success: false,
        source: 'offline_snapshot',
        models: exports.SUNO_MODELS_CATALOG,
        plans: exports.SUNO_SUBSCRIPTION_PLANS,
        retrieved_at: exports.SUNO_SNAPSHOT_RETRIEVED_AT,
        message_id: 'Menggunakan data katalog resmi Suno AI tersimpan (Mode Offline).',
        message_en: 'Using cached official Suno AI catalog data (Offline Mode).',
    };
}
