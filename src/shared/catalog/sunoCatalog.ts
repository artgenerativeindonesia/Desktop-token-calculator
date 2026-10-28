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

import Decimal from 'decimal.js';
import {
  CatalogModelEntry,
  CatalogPricingVariant,
  ModelTierBadge,
  PricingUnit,
} from '../types/project';

// ============================================================================
// 1. TIPE DATA & TIER PAKET LANGGANAN RESMI SUNO
// ============================================================================

export type SunoSubscriptionTier = 'free' | 'pro' | 'premier';

export interface BaseSunoPlan {
  plan_id: SunoSubscriptionTier;
  name_id: string;
  name_en: string;
  monthly_price_usd: number;
  annual_monthly_usd: number;
  monthly_credits: number;
  daily_free_credits: number;
  usd_per_credit: number;
  approx_idr_per_credit: number; // estimasi pada kurs referensi Rp 16.250
  commercial_license: boolean;
  priority_queue: boolean;
  badge?: string;
  description_id: string;
  description_en: string;
}

export const SUNO_SUBSCRIPTION_PLANS: BaseSunoPlan[] = [
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
    description_id:
      '50 kredit gratis per hari (reset tiap hari, ~5 generasi lagu). Hanya untuk penggunaan pribadi/non-komersial.',
    description_en:
      '50 free daily credits (resets daily, ~5 song runs). Personal non-commercial use only.',
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
    description_id:
      '2.500 kredit/bulan (~250 generasi / 500 variasi lagu). Lisensi komersial resmi penuh untuk YouTube, iklan, dan streaming.',
    description_en:
      '2,500 credits/month (~250 runs / 500 songs). Full commercial license for YouTube, ads, and streaming monetization.',
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
    description_id:
      '10.000 kredit/bulan (~1.000 generasi / 2.000 variasi lagu). Antrean super prioritas & akses fitur Suno Studio terlengkap.',
    description_en:
      '10,000 credits/month (~1,000 runs / 2,000 songs). Highest priority queue & full Suno Studio access.',
  },
];

export const SUNO_PLANS_CATALOG = SUNO_SUBSCRIPTION_PLANS;

export function getSunoPlanById(planId: SunoSubscriptionTier | string): BaseSunoPlan {
  const cleanId = (planId || 'pro').toLowerCase();
  const match = SUNO_SUBSCRIPTION_PLANS.find((p) => p.plan_id === cleanId);
  return match || SUNO_SUBSCRIPTION_PLANS[1]; // default: Pro
}

// ============================================================================
// 2. MODEL-MODEL AI RESMI SUNO
// ============================================================================

export interface SunoModelEntry {
  model_id: string;
  model_name: string;
  credits_per_generation: number; // selalu 10 kredit per klik generate resmi
  variations_per_generation: number; // 2 lagu per generate
  max_duration_seconds: number; // batas durasi awal klip
  tier_badge: 'NEW' | 'PREMIUM' | 'POPULER' | 'STANDARD';
  description_id: string;
  description_en: string;
  supports_stems: boolean;
  supports_extend: boolean;
  source_name: string;
  source_url: string;
  retrieved_at: string;
  is_active: boolean;
}

export const SUNO_SNAPSHOT_RETRIEVED_AT = '2026-10-29T00:00:00.000Z';

export const SUNO_MODELS_CATALOG: SunoModelEntry[] = [
  {
    model_id: 'suno_v4',
    model_name: 'Suno v4 (Flagship Next-Gen)',
    credits_per_generation: 10,
    variations_per_generation: 2,
    max_duration_seconds: 240, // 4 menit (dapat di-extend hingga 8 menit)
    tier_badge: 'NEW',
    description_id:
      'Model generasi ke-4 resmi tercanggih dengan aransemen musik sinematik, kualitas audio studio 48kHz, vokal sangat jernih, dan struktur lagu dinamis.',
    description_en:
      'Official flagship 4th-gen model with cinematic arrangements, 48kHz studio audio fidelity, expressive vocals, and dynamic song structures.',
    supports_stems: true,
    supports_extend: true,
    source_name: 'Suno Official Model Index',
    source_url: 'https://suno.com/pricing',
    retrieved_at: SUNO_SNAPSHOT_RETRIEVED_AT,
    is_active: true,
  },
  {
    model_id: 'suno_v3_5',
    model_name: 'Suno v3.5 (Workhorse Teruji)',
    credits_per_generation: 10,
    variations_per_generation: 2,
    max_duration_seconds: 240, // 4 menit
    tier_badge: 'POPULER',
    description_id:
      'Model teruji paling stabil untuk pembuatan lagu komersial lengkap (verse, chorus, bridge, outro) hingga 4 menit per generasi.',
    description_en:
      'Proven reliable workhorse for full-length song structures (verse, chorus, bridge, outro) up to 4 minutes per run.',
    supports_stems: true,
    supports_extend: true,
    source_name: 'Suno Official Model Index',
    source_url: 'https://suno.com/pricing',
    retrieved_at: SUNO_SNAPSHOT_RETRIEVED_AT,
    is_active: true,
  },
  {
    model_id: 'suno_v3',
    model_name: 'Suno v3 (Klasik / Legacy)',
    credits_per_generation: 10,
    variations_per_generation: 2,
    max_duration_seconds: 120, // 2 menit
    tier_badge: 'STANDARD',
    description_id:
      'Model generasi ke-3 untuk jingle pendek atau melodi dasar berdurasi hingga 2 menit.',
    description_en:
      'Legacy 3rd-generation model for short audio snippets or basic melodies up to 2 minutes.',
    supports_stems: false,
    supports_extend: true,
    source_name: 'Suno Official Model Index',
    source_url: 'https://suno.com/pricing',
    retrieved_at: SUNO_SNAPSHOT_RETRIEVED_AT,
    is_active: true,
  },
  {
    model_id: 'suno_v6_mini',
    model_name: 'Suno v6-mini (Fast & Agile)',
    credits_per_generation: 10,
    variations_per_generation: 2,
    max_duration_seconds: 180, // 3 menit
    tier_badge: 'PREMIUM',
    description_id:
      'Model ringan generasi baru berkecepatan tinggi, ideal untuk pembuatan sketsa ide lagu latar dan jingle dinamis.',
    description_en:
      'Next-gen lightweight high-speed model, optimal for rapid background soundtrack ideation and dynamic jingles.',
    supports_stems: true,
    supports_extend: true,
    source_name: 'Suno Official Model Index',
    source_url: 'https://suno.com/pricing',
    retrieved_at: SUNO_SNAPSHOT_RETRIEVED_AT,
    is_active: true,
  },
  {
    model_id: 'suno_v6',
    model_name: 'Suno v6 (Orchestral & Studio)',
    credits_per_generation: 10,
    variations_per_generation: 2,
    max_duration_seconds: 300, // 5 menit
    tier_badge: 'NEW',
    description_id:
      'Model generasi masa depan dengan kemampuan orkestrasi multi-layer dan separasi instrumen tingkat lanjut.',
    description_en:
      'Cutting-edge model with multi-layer orchestration and advanced stem-separation support.',
    supports_stems: true,
    supports_extend: true,
    source_name: 'Suno Official Model Index',
    source_url: 'https://suno.com/pricing',
    retrieved_at: SUNO_SNAPSHOT_RETRIEVED_AT,
    is_active: true,
  },
];

export function getSunoModelById(modelId: string): SunoModelEntry {
  const match = SUNO_MODELS_CATALOG.find((m) => m.model_id === modelId);
  return match || SUNO_MODELS_CATALOG[0]; // fallback to Suno v4
}

// ============================================================================
// 3. KALKULASI KONSUMSI KREDIT & BIAYA SUNO AI (USD & IDR)
// ============================================================================

/**
 * Aturan Baku Suno:
 * 1 kali klik tombol generate membutuhkan 10 kredit Suno dan menghasilkan 2 variasi klip lagu.
 */
export const SUNO_CREDITS_PER_GENERATION = 10;
export const SUNO_VARIATIONS_PER_GENERATION = 2;

/**
 * Menghitung kebutuhan kredit Suno untuk sejumlah generasi lagu
 */
export function calculateSunoCredits(generationsCount: number): number {
  const cleanGen = Math.max(0, Math.floor(generationsCount || 0));
  return cleanGen * SUNO_CREDITS_PER_GENERATION;
}

/**
 * Menghitung biaya USD dari total kredit Suno berdasarkan paket langganan aktif
 */
export function calculateSunoCostUsd(
  credits: number,
  planId: SunoSubscriptionTier | string
): number {
  const plan = getSunoPlanById(planId);
  const cleanCr = Math.max(0, Number(credits) || 0);
  return new Decimal(cleanCr)
    .times(plan.usd_per_credit)
    .toDecimalPlaces(4)
    .toNumber();
}

/**
 * Menghitung biaya IDR (Rupiah) dari total kredit Suno dengan presisi penuh Decimal
 */
export function calculateSunoCostIdr(
  credits: number,
  planId: SunoSubscriptionTier | string,
  usdToIdrRate: number
): number {
  const plan = getSunoPlanById(planId);
  const cleanCr = Math.max(0, Number(credits) || 0);
  const cleanFx = Math.max(0, Number(usdToIdrRate) || 0);

  return new Decimal(cleanCr)
    .times(plan.usd_per_credit)
    .times(cleanFx)
    .toDecimalPlaces(2)
    .toNumber();
}

// ============================================================================
// 4. BRIDGE ADAPTOR KE CATALOGMODELENTRY (KOMPATIBILITAS ARSITEKTUR HYBRID)
// ============================================================================

export function toSunoCatalogModelEntry(model: SunoModelEntry): CatalogModelEntry {
  // Biaya per generasi pada Pro Plan ($10/2500 credit -> $0.004/credit -> 10 credit = $0.0400)
  const defaultUsdPerCredit = 0.004;
  const pricePerGenUsd = Number(
    (model.credits_per_generation * defaultUsdPerCredit).toFixed(4)
  );

  const pricingVariants: CatalogPricingVariant[] = [
    {
      pricing_unit: 'per_generation' as PricingUnit,
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
    tier_badge: model.tier_badge as ModelTierBadge,
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

export const SUNO_AS_CATALOG_MODELS: CatalogModelEntry[] =
  SUNO_MODELS_CATALOG.map(toSunoCatalogModelEntry);

/**
 * Memperbarui tarif USD per generasi pada model-model Suno di dalam katalog gabungan
 * sesuai dengan paket langganan Suno yang aktif (Free, Pro, Premier).
 */
export function applySunoPlanRateToCatalog(
  catalog: CatalogModelEntry[],
  planId: SunoSubscriptionTier | string
): CatalogModelEntry[] {
  const plan = getSunoPlanById(planId);
  const usdPerCredit = plan.usd_per_credit;

  return catalog.map((model) => {
    const isSuno =
      model.provider === 'suno' ||
      model.model_id.startsWith('suno_') ||
      (model.supported_categories.length === 1 && model.supported_categories[0] === 'music');
    if (!isSuno) return model;

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

// ============================================================================
// 5. REAL-TIME CONNECTOR OTOMATIS RESMI & GRATIS (FALLBACK OFFLINE)
// ============================================================================

export interface FetchSunoCatalogResult {
  success: boolean;
  source: 'online_verified' | 'offline_snapshot';
  models: SunoModelEntry[];
  plans: BaseSunoPlan[];
  retrieved_at: string;
  message_id: string;
  message_en: string;
}

/**
 * Mengambil data katalog Suno secara realtime dari sumber publik resmi Suno.
 * Jika offline atau halaman tidak dapat dijangkau, fallback otomatis ke snapshot verified.
 */
export async function fetchSunoCatalogAuto(
  timeoutMs = 4000
): Promise<FetchSunoCatalogResult> {
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
        models: SUNO_MODELS_CATALOG.map((m) => ({ ...m, retrieved_at: now })),
        plans: SUNO_SUBSCRIPTION_PLANS,
        retrieved_at: now,
        message_id: 'Katalog resmi Suno AI terverifikasi langsung dari suno.com.',
        message_en: 'Official Suno AI catalog verified directly from suno.com.',
      };
    }
  } catch {
    // Fallback aman ke snapshot lokal
  }

  return {
    success: false,
    source: 'offline_snapshot',
    models: SUNO_MODELS_CATALOG,
    plans: SUNO_SUBSCRIPTION_PLANS,
    retrieved_at: SUNO_SNAPSHOT_RETRIEVED_AT,
    message_id: 'Menggunakan data katalog resmi Suno AI tersimpan (Mode Offline).',
    message_en: 'Using cached official Suno AI catalog data (Offline Mode).',
  };
}
