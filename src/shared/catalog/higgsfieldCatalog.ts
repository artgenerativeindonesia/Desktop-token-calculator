import {
  CatalogModelEntry,
  CatalogPricingVariant,
  HiggsfieldSubscriptionPlan,
  ModelTierBadge,
  Pricing,
  ProcessCategory,
} from '../types/project';

export const CATALOG_RETRIEVED_AT = '2026-10-22T00:00:00.000Z';
export const HIGGSFIELD_DOCS_URL = 'https://docs.higgsfield.ai/docs/models';
export const HIGGSFIELD_PRICING_URL = 'https://higgsfield.ai/pricing';
export const DEFAULT_USD_PER_CREDIT = 0.0625;

/**
 * Daftar Paket Langganan Resmi Higgsfield (Berdasarkan data live subscriptionsV2 & Billing Docs)
 * Digunakan agar pengguna dapat menyesuaikan nilai 1 Credit ke USD/Rupiah sesuai paket yang mereka beli.
 */
export const HIGGSFIELD_SUBSCRIPTION_PLANS: HiggsfieldSubscriptionPlan[] = [
  {
    plan_id: 'api_standard',
    name_id: 'Standar API Resmi ($0.0625 / Credit)',
    name_en: 'Official API Standard ($0.0625 / Credit)',
    monthly_price_usd: 0,
    monthly_credits: 0,
    usd_per_credit: 0.0625,
    description_id:
      'Patokan resmi dokumentasi API Higgsfield ($0.0625 per credit).',
    description_en:
      'Official Higgsfield API billing rate ($0.0625 per credit).',
    plan_category: 'api',
    billing_cycle: 'on_demand',
  },
  {
    plan_id: 'basic_monthly',
    name_id: 'Paket Basic ($9/bln • 120 Credit)',
    name_en: 'Basic Plan ($9/mo • 120 Credits)',
    monthly_price_usd: 9,
    monthly_credits: 120,
    usd_per_credit: 0.075,
    description_id:
      'Paket pemula kreator Higgsfield: 120 Credit per bulan seharga $9 ($0.0750 / Credit) + 10 free gen Genjutsu Lite, Ads Studio, & AI Influencer.',
    description_en:
      'Starter creator plan: 120 Credits/month for $9 ($0.0750 / Credit) + 10 free gens Genjutsu Lite, Ads Studio, & AI Influencer.',
    plan_category: 'individual',
    billing_cycle: 'monthly',
  },
  {
    plan_id: 'pro_monthly',
    name_id: 'Paket Pro 600 Bulanan ($29/bln • 600 Credit)',
    name_en: 'Pro 600 Monthly ($29/mo • 600 Credits)',
    monthly_price_usd: 29,
    monthly_credits: 600,
    usd_per_credit: 0.0483,
    description_id:
      'Paket kreator harian: 600 Credit/bln seharga $29 ($0.0483 / Credit) + 7 hari Unlimited Nano Banana 2 & Kling 3.0.',
    description_en:
      'Everyday creator plan: 600 Credits/mo for $29 ($0.0483 / Credit) + 7-day Unlimited Nano Banana 2 & Kling 3.0.',
    plan_category: 'individual',
    billing_cycle: 'monthly',
  },
  {
    plan_id: 'pro_annual',
    name_id: 'Paket Pro 600 Tahunan ($23/bln • 600 Credit)',
    name_en: 'Pro 600 Annual ($23/mo • 600 Credits)',
    monthly_price_usd: 23,
    monthly_credits: 600,
    usd_per_credit: 0.0383,
    description_id:
      'Paket Pro 600 pembayaran tahunan ($276/thn): setara $23/bln ($0.0383 / Credit, hemat $72 / 21%).',
    description_en:
      'Annual Pro 600 plan ($276/yr): effective $23/mo ($0.0383 / Credit, save $72 / 21% off).',
    plan_category: 'individual',
    billing_cycle: 'annual',
    discount_badge: '21% OFF',
  },
  {
    plan_id: 'pro_900_monthly',
    name_id: 'Paket Pro 900 Bulanan ($43/bln • 900 Credit)',
    name_en: 'Pro 900 Monthly ($43/mo • 900 Credits)',
    monthly_price_usd: 43,
    monthly_credits: 900,
    usd_per_credit: 0.0478,
    description_id:
      'Paket kreator aktif: 900 Credit/bln seharga $43 ($0.0478 / Credit) + 7 hari Unlimited Nano Banana 2 & Kling 3.0.',
    description_en:
      'Active creator plan: 900 Credits/mo for $43 ($0.0478 / Credit) + 7-day Unlimited Nano Banana 2 & Kling 3.0.',
    plan_category: 'individual',
    billing_cycle: 'monthly',
  },
  {
    plan_id: 'pro_900_annual',
    name_id: 'Paket Pro 900 Tahunan ($34/bln • 900 Credit)',
    name_en: 'Pro 900 Annual ($34/mo • 900 Credits)',
    monthly_price_usd: 34,
    monthly_credits: 900,
    usd_per_credit: 0.0378,
    description_id:
      'Paket Pro 900 pembayaran tahunan ($408/thn): setara $34/bln ($0.0378 / Credit, hemat $108 / 21%).',
    description_en:
      'Annual Pro 900 plan ($408/yr): effective $34/mo ($0.0378 / Credit, save $108 / 21% off).',
    plan_category: 'individual',
    billing_cycle: 'annual',
    discount_badge: '21% OFF',
  },
  {
    plan_id: 'max_monthly',
    name_id: 'Paket Max 1.800 Bulanan ($79/bln • 1.800 Credit)',
    name_en: 'Max 1,800 Monthly ($79/mo • 1,800 Credits)',
    monthly_price_usd: 79,
    monthly_credits: 1800,
    usd_per_credit: 0.0439,
    description_id:
      'Paket produksi intensif: 1.800 Credit/bln seharga $79 ($0.0439 / Credit) + 7 hari Unlimited Nano Banana Pro 2K & Kling 3.0.',
    description_en:
      'Heavy production plan: 1,800 Credits/mo for $79 ($0.0439 / Credit) + 7-day Unlimited Nano Banana Pro 2K & Kling 3.0.',
    plan_category: 'individual',
    billing_cycle: 'monthly',
    discount_badge: 'BEST VALUE',
  },
  {
    plan_id: 'max_annual',
    name_id: 'Paket Max 1.800 Tahunan ($59/bln • 1.800 Credit)',
    name_en: 'Max 1,800 Annual ($59/mo • 1,800 Credits)',
    monthly_price_usd: 59,
    monthly_credits: 1800,
    usd_per_credit: 0.0328,
    description_id:
      'Paket Max 1.800 pembayaran tahunan ($708/thn): setara $59/bln ($0.0328 / Credit, hemat $240 / 25%).',
    description_en:
      'Annual Max 1,800 plan ($708/yr): effective $59/mo ($0.0328 / Credit, save $240 / 25% off).',
    plan_category: 'individual',
    billing_cycle: 'annual',
    discount_badge: '25% OFF',
  },
  {
    plan_id: 'max_3600_monthly',
    name_id: 'Paket Max 3.600 Bulanan ($139/bln • 3.600 Credit)',
    name_en: 'Max 3,600 Monthly ($139/mo • 3,600 Credits)',
    monthly_price_usd: 139,
    monthly_credits: 3600,
    usd_per_credit: 0.0386,
    description_id:
      'Paket volume besar: 3.600 Credit/bln promo $139 ($0.0386 / Credit, perpanjangan reguler $158).',
    description_en:
      'Large volume plan: 3,600 Credits/mo promo $139 ($0.0386 / Credit, regular renewal $158).',
    plan_category: 'individual',
    billing_cycle: 'monthly',
    discount_badge: '12% OFF',
  },
  {
    plan_id: 'max_3600_annual',
    name_id: 'Paket Max 3.600 Tahunan ($115/bln • 3.600 Credit)',
    name_en: 'Max 3,600 Annual ($115/mo • 3.600 Credits)',
    monthly_price_usd: 115,
    monthly_credits: 3600,
    usd_per_credit: 0.0319,
    description_id:
      'Paket Max 3.600 pembayaran tahunan ($1.380/thn): setara $115/bln ($0.0319 / Credit, hemat $516 / 27%).',
    description_en:
      'Annual Max 3,600 plan ($1,380/yr): effective $115/mo ($0.0319 / Credit, save $516 / 27% off).',
    plan_category: 'individual',
    billing_cycle: 'annual',
    discount_badge: '27% OFF',
  },
  {
    plan_id: 'max_5400_monthly',
    name_id: 'Paket Max 5.400 Bulanan ($199/bln • 5.400 Credit)',
    name_en: 'Max 5,400 Monthly ($199/mo • 5.400 Credits)',
    monthly_price_usd: 199,
    monthly_credits: 5400,
    usd_per_credit: 0.0369,
    description_id:
      'Paket kapasitas tertinggi kreator: 5.400 Credit/bln promo $199 ($0.0369 / Credit, reguler $237).',
    description_en:
      'Maximum creator capacity: 5,400 Credits/mo promo $199 ($0.0369 / Credit, regular $237).',
    plan_category: 'individual',
    billing_cycle: 'monthly',
    discount_badge: '16% OFF',
  },
  {
    plan_id: 'max_5400_annual',
    name_id: 'Paket Max 5.400 Tahunan ($165/bln • 5.400 Credit)',
    name_en: 'Max 5,400 Annual ($165/mo • 5.400 Credits)',
    monthly_price_usd: 165,
    monthly_credits: 5400,
    usd_per_credit: 0.0306,
    description_id:
      'Paket Max 5.400 pembayaran tahunan ($1.980/thn): setara $165/bln ($0.0306 / Credit, hemat $864 / 30%).',
    description_en:
      'Annual Max 5,400 plan ($1,980/yr): effective $165/mo ($0.0306 / Credit, save $864 / 30% off).',
    plan_category: 'individual',
    billing_cycle: 'annual',
    discount_badge: '30% OFF',
  },
  {
    plan_id: 'team_monthly',
    name_id: 'Paket Team Bulanan ($69/seat/bln • 1.000 Credit/seat)',
    name_en: 'Team Monthly ($69/seat/mo • 1,000 Credits/seat)',
    monthly_price_usd: 69,
    monthly_credits: 1000,
    usd_per_credit: 0.069,
    description_id:
      'Paket kolaborasi tim (2-9 anggota): 1.000 Credit/seat/bln promo $69/seat ($0.0690 / Credit, reguler $79) + 7 hari Unlimited Seedance 2.0.',
    description_en:
      'Small team collaboration (2-9 seats): 1,000 Credits/seat/mo promo $69/seat ($0.0690 / Credit, regular $79) + 7-day Unlimited Seedance 2.0.',
    plan_category: 'business',
    billing_cycle: 'monthly',
    discount_badge: '13% OFF',
  },
  {
    plan_id: 'team_annual',
    name_id: 'Paket Team Tahunan ($65/seat/bln • 1.000 Credit/seat)',
    name_en: 'Team Annual ($65/seat/mo • 1,000 Credits/seat)',
    monthly_price_usd: 65,
    monthly_credits: 1000,
    usd_per_credit: 0.065,
    description_id:
      'Paket Team pembayaran tahunan ($780/seat/thn): setara $65/seat/bln ($0.0650 / Credit, hemat 18%) + 14 hari Unlimited Seedance 2.0.',
    description_en:
      'Annual Team plan ($780/seat/yr): effective $65/seat/mo ($0.0650 / Credit, 18% off) + 14-day Unlimited Seedance 2.0.',
    plan_category: 'business',
    billing_cycle: 'annual',
    discount_badge: '18% OFF',
  },
  {
    plan_id: 'scale_monthly',
    name_id: 'Paket Scale Bulanan ($169/seat/bln • 2.500 Credit/seat)',
    name_en: 'Scale Monthly ($169/seat/mo • 2,500 Credits/seat)',
    monthly_price_usd: 169,
    monthly_credits: 2500,
    usd_per_credit: 0.0676,
    description_id:
      'Paket agensi berkembang (5-15 anggota): 2.500 Credit/seat/bln promo $169/seat ($0.0676 / Credit, reguler $215) + 7 hari Unlimited Seedance 2.5.',
    description_en:
      'Growing agency tier (5-15 seats): 2,500 Credits/seat/mo promo $169/seat ($0.0676 / Credit, regular $215) + 7-day Unlimited Seedance 2.5.',
    plan_category: 'business',
    billing_cycle: 'monthly',
    discount_badge: '22% OFF',
  },
  {
    plan_id: 'scale_annual',
    name_id: 'Paket Scale Tahunan ($150/seat/bln • 2.500 Credit/seat)',
    name_en: 'Scale Annual ($150/seat/mo • 2,500 Credits/seat)',
    monthly_price_usd: 150,
    monthly_credits: 2500,
    usd_per_credit: 0.06,
    description_id:
      'Paket Scale pembayaran tahunan ($1.800/seat/thn): setara $150/seat/bln ($0.0600 / Credit, hemat 30%) + 30 hari Unlimited Seedance 2.5.',
    description_en:
      'Annual Scale plan ($1,800/seat/yr): effective $150/seat/mo ($0.0600 / Credit, 30% off) + 30-day Unlimited Seedance 2.5.',
    plan_category: 'business',
    billing_cycle: 'annual',
    discount_badge: '30% OFF',
  },
  {
    plan_id: 'credit_pack_topup',
    name_id: 'Paket Top-Up Credit Pack ($0.0500 / Credit)',
    name_en: 'Credit Pack Top-Up ($0.0500 / Credit)',
    monthly_price_usd: 0,
    monthly_credits: 0,
    usd_per_credit: 0.05,
    description_id:
      'Pembelian saldo Credit ekstra satu kali bayar (Fixed 100 s/d 4.000 cr, Adjustable hingga 25.000 cr, berlaku 90 hari, rata-rata ~$0.050 / Credit).',
    description_en:
      'One-time pay-as-you-go Credit Pack top-up (Fixed 100 to 4,000 cr, Adjustable up to 25,000 cr, valid 90 days, avg ~$0.050 / Credit).',
    plan_category: 'topup',
    billing_cycle: 'on_demand',
  },
];

function roundUsd(val: number): number {
  return Number(val.toFixed(4));
}

function makeImageEntry(opts: {
  model_id: string;
  model_name: string;
  family: string;
  tier_badge: ModelTierBadge;
  unlimited_eligible?: boolean;
  supported_categories: ProcessCategory[];
  description_id: string;
  description_en: string;
  credits_1k: number;
  credits_2k?: number;
  credits_4k?: number;
  price_1k?: number;
  price_2k?: number;
  price_4k?: number;
  source_url?: string;
}): CatalogModelEntry {
  const c1 = opts.credits_1k;
  const c2 = opts.credits_2k ?? Number((c1 * 1.6).toFixed(2));
  const p1 = opts.price_1k ?? roundUsd(c1 * DEFAULT_USD_PER_CREDIT);
  const p2 = opts.price_2k ?? roundUsd(c2 * DEFAULT_USD_PER_CREDIT);

  const resOptions = [
    { value: '1K', label: `1K Standard (${c1} cr)` },
    { value: '2K', label: `2K High-Res (${c2} cr)` },
  ];

  const variants: CatalogPricingVariant[] = [
    {
      matchParameters: { resolution: '1K' },
      pricing_unit: 'per_generation',
      price_value: p1,
      currency: 'USD',
      credit_cost: c1,
      credit_unit: 'per_generation',
      status: 'verified',
    },
    {
      matchParameters: { resolution: '2K' },
      pricing_unit: 'per_generation',
      price_value: p2,
      currency: 'USD',
      credit_cost: c2,
      credit_unit: 'per_generation',
      status: 'verified',
    },
  ];

  if (opts.credits_4k !== undefined) {
    const c4 = opts.credits_4k;
    const p4 = opts.price_4k ?? roundUsd(c4 * DEFAULT_USD_PER_CREDIT);
    resOptions.push({ value: '4K', label: `4K Ultra (${c4} cr)` });
    variants.push({
      matchParameters: { resolution: '4K' },
      pricing_unit: 'per_generation',
      price_value: p4,
      currency: 'USD',
      credit_cost: c4,
      credit_unit: 'per_generation',
      status: 'verified',
    });
  }

  return {
    provider: 'Higgsfield',
    model_id: opts.model_id,
    model_name: opts.model_name,
    family: opts.family,
    tier_badge: opts.tier_badge,
    unlimited_eligible: opts.unlimited_eligible ?? false,
    supported_categories: opts.supported_categories,
    description_id: opts.description_id,
    description_en: opts.description_en,
    default_quantity_type: 'output',
    supports_duration: false,
    default_duration_seconds: 0,
    parameters: [
      {
        key: 'resolution',
        label_id: 'Resolusi Gambar',
        label_en: 'Image Resolution',
        type: 'select',
        options: resOptions,
        defaultValue: '1K',
        affectsPricing: true,
      },
      {
        key: 'aspect_ratio',
        label_id: 'Rasio Layar',
        label_en: 'Aspect Ratio',
        type: 'select',
        options: [
          { value: '16:9', label: '16:9 Landscape' },
          { value: '9:16', label: '9:16 Vertical' },
          { value: '1:1', label: '1:1 Square' },
          { value: '4:5', label: '4:5 Portrait' },
          { value: '21:9', label: '21:9 Cinema' },
        ],
        defaultValue: '16:9',
        affectsPricing: false,
      },
    ],
    pricing_variants: variants,
    source_name: 'Higgsfield Official Catalog & Live Credits Config (higgsfield.ai)',
    source_url: opts.source_url ?? HIGGSFIELD_DOCS_URL,
    retrieved_at: CATALOG_RETRIEVED_AT,
  };
}

function makeVideoEntry(opts: {
  model_id: string;
  model_name: string;
  family: string;
  tier_badge: ModelTierBadge;
  unlimited_eligible?: boolean;
  supported_categories: ProcessCategory[];
  description_id: string;
  description_en: string;
  default_duration_seconds?: number;
  credits_720p: number;
  credits_1080p?: number;
  credits_480p?: number;
  credits_4k?: number;
  price_720p?: number;
  price_1080p?: number;
  source_url?: string;
}): CatalogModelEntry {
  const c720 = opts.credits_720p;
  const c1080 = opts.credits_1080p ?? Number((c720 * 1.8).toFixed(2));
  const p720 = opts.price_720p ?? roundUsd(c720 * DEFAULT_USD_PER_CREDIT);
  const p1080 = opts.price_1080p ?? roundUsd(c1080 * DEFAULT_USD_PER_CREDIT);

  const resOptions: Array<{ value: string; label: string }> = [];
  const variants: CatalogPricingVariant[] = [];

  // Default 720p first so variants[0] is the standard 720p rate
  resOptions.push({ value: '720p', label: `720p HD (${c720} cr/dtk)` });
  variants.push({
    matchParameters: { resolution: '720p' },
    pricing_unit: 'per_second',
    price_value: p720,
    currency: 'USD',
    credit_cost: c720,
    credit_unit: 'per_second',
    status: 'verified',
  });

  resOptions.push({ value: '1080p', label: `1080p Full HD (${c1080} cr/dtk)` });
  variants.push({
    matchParameters: { resolution: '1080p' },
    pricing_unit: 'per_second',
    price_value: p1080,
    currency: 'USD',
    credit_cost: c1080,
    credit_unit: 'per_second',
    status: 'verified',
  });

  if (opts.credits_480p !== undefined) {
    const c480 = opts.credits_480p;
    resOptions.push({ value: '480p', label: `480p Draft (${c480} cr/dtk)` });
    variants.push({
      matchParameters: { resolution: '480p' },
      pricing_unit: 'per_second',
      price_value: roundUsd(c480 * DEFAULT_USD_PER_CREDIT),
      currency: 'USD',
      credit_cost: c480,
      credit_unit: 'per_second',
      status: 'verified',
    });
  }

  if (opts.credits_4k !== undefined) {
    const c4k = opts.credits_4k;
    resOptions.push({ value: '4K', label: `4K Ultra HD (${c4k} cr/dtk)` });
    variants.push({
      matchParameters: { resolution: '4K' },
      pricing_unit: 'per_second',
      price_value: roundUsd(c4k * DEFAULT_USD_PER_CREDIT),
      currency: 'USD',
      credit_cost: c4k,
      credit_unit: 'per_second',
      status: 'verified',
    });
  }

  return {
    provider: 'Higgsfield',
    model_id: opts.model_id,
    model_name: opts.model_name,
    family: opts.family,
    tier_badge: opts.tier_badge,
    unlimited_eligible: opts.unlimited_eligible ?? false,
    supported_categories: opts.supported_categories,
    description_id: opts.description_id,
    description_en: opts.description_en,
    default_quantity_type: 'shot',
    supports_duration: true,
    default_duration_seconds: opts.default_duration_seconds ?? 5,
    parameters: [
      {
        key: 'resolution',
        label_id: 'Resolusi Video',
        label_en: 'Video Resolution',
        type: 'select',
        options: resOptions,
        defaultValue: '720p',
        affectsPricing: true,
      },
      {
        key: 'aspect_ratio',
        label_id: 'Rasio Layar',
        label_en: 'Aspect Ratio',
        type: 'select',
        options: [
          { value: '16:9', label: '16:9 Landscape' },
          { value: '9:16', label: '9:16 Vertical' },
          { value: '1:1', label: '1:1 Square' },
        ],
        defaultValue: '16:9',
        affectsPricing: false,
      },
    ],
    pricing_variants: variants,
    source_name: 'Higgsfield Official Video Catalog & Credits Config (higgsfield.ai)',
    source_url: opts.source_url ?? 'https://docs.higgsfield.ai/docs/models/video-generation',
    retrieved_at: CATALOG_RETRIEVED_AT,
  };
}

/**
 * Katalog Model Resmi Higgsfield Terlengkap & Terbaru (75+ Model di 7 Kategori Proses AI)
 * Disinkronkan langsung dengan tangkapan layar aplikasi Higgsfield terbaru & `credits-config` resmi.
 */
export const HIGGSFIELD_MODEL_CATALOG: CatalogModelEntry[] = [
  // ============================================================================
  // BAGIAN 1: TEXT TO IMAGE & IMAGE TO IMAGE (FEATURED & ALL HIGGSFIELD IMAGE MODELS)
  // ============================================================================
  {
    provider: 'Higgsfield',
    model_id: 'higgsfield-ai/soul/v2/standard',
    model_name: 'Higgsfield Soul 2.0 (Ultra-Realistic Fashion & Character)',
    family: 'Higgsfield SOUL',
    tier_badge: 'POPULER',
    unlimited_eligible: false,
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Visual fashion, potret manusia, dan karakter ultra-realistis generasi terbaru dari Higgsfield.',
    description_en:
      'Next generation ultra-realistic fashion visuals, portraits, and character generation.',
    default_quantity_type: 'output',
    supports_duration: false,
    default_duration_seconds: 0,
    parameters: [
      {
        key: 'resolution',
        label_id: 'Resolusi Gambar',
        label_en: 'Image Resolution',
        type: 'select',
        options: [
          { value: '1K', label: '1K Standard (1.5 cr)' },
          { value: '2K', label: '2K High-Res (2.25 cr)' },
        ],
        defaultValue: '1K',
        affectsPricing: true,
      },
      {
        key: 'aspect_ratio',
        label_id: 'Rasio Aspek',
        label_en: 'Aspect Ratio',
        type: 'select',
        options: [
          { value: '16:9', label: '16:9 Landscape' },
          { value: '9:16', label: '9:16 Vertical' },
          { value: '1:1', label: '1:1 Square' },
        ],
        defaultValue: '16:9',
        affectsPricing: false,
      },
    ],
    pricing_variants: [
      {
        matchParameters: { resolution: '1K' },
        pricing_unit: 'per_generation',
        price_value: 0.094,
        currency: 'USD',
        credit_cost: 1.5,
        credit_unit: 'per_generation',
        status: 'verified',
      },
      {
        matchParameters: { resolution: '2K' },
        pricing_unit: 'per_generation',
        price_value: 0.141,
        currency: 'USD',
        credit_cost: 2.25,
        credit_unit: 'per_generation',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield API Billing Docs (docs.higgsfield.ai/docs/concepts/billing-and-retention)',
    source_url: 'https://docs.higgsfield.ai/docs/concepts/billing-and-retention',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
  {
    provider: 'Higgsfield',
    model_id: 'higgsfield-ai/soul-cinema',
    model_name: 'Higgsfield Soul Cinema (Cinema-Grade Visual Creation)',
    family: 'Higgsfield SOUL',
    tier_badge: 'POPULER',
    unlimited_eligible: false,
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Pembuatan gambar sekelas layar lebar dengan pencahayaan dan komposisi kamera sinema.',
    description_en:
      'Cinema-grade visual creation and widescreen storyboard still frames.',
    default_quantity_type: 'output',
    supports_duration: false,
    default_duration_seconds: 0,
    parameters: [
      {
        key: 'resolution',
        label_id: 'Resolusi',
        label_en: 'Resolution',
        type: 'select',
        options: [
          { value: '1K', label: '1K Cinema (1.5 cr)' },
          { value: '2K', label: '2K Master (2.5 cr)' },
        ],
        defaultValue: '1K',
        affectsPricing: true,
      },
      {
        key: 'aspect_ratio',
        label_id: 'Rasio Aspek',
        label_en: 'Aspect Ratio',
        type: 'select',
        options: [
          { value: '21:9', label: '21:9 Anamorphic' },
          { value: '16:9', label: '16:9 Widescreen' },
        ],
        defaultValue: '16:9',
        affectsPricing: false,
      },
    ],
    pricing_variants: [
      {
        matchParameters: { resolution: '1K' },
        pricing_unit: 'per_generation',
        price_value: 0.094,
        currency: 'USD',
        credit_cost: 1.5,
        credit_unit: 'per_generation',
        status: 'verified',
      },
      {
        matchParameters: { resolution: '2K' },
        pricing_unit: 'per_generation',
        price_value: 0.16,
        currency: 'USD',
        credit_cost: 2.5,
        credit_unit: 'per_generation',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Model API Reference (docs.higgsfield.ai/docs/models/soul-cinema)',
    source_url: 'https://docs.higgsfield.ai/docs/models/soul-cinema',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
  makeImageEntry({
    model_id: 'openai/gpt-image-2.5-sunburst',
    model_name: 'GPT Image 2.5 Sunburst (Exceptional Quality & Precise Edits)',
    family: 'OpenAI GPT Image',
    tier_badge: 'PREMIUM',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Kualitas gambar luar biasa dan pengeditan sangat presisi hingga 16 gambar referensi.',
    description_en:
      'Exceptional quality and precise image generation & editing with up to 16 reference images.',
    credits_1k: 1.5,
    credits_2k: 2.75,
    credits_4k: 4.25,
  }),
  makeImageEntry({
    model_id: 'openai/gpt-image-2.5-flare',
    model_name: 'GPT Image 2.5 Flare (Stunning Everyday Images, Fast)',
    family: 'OpenAI GPT Image',
    tier_badge: 'PREMIUM',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Pembuatan dan edit gambar harian yang memukau dengan kecepatan tinggi (digunakan juga pada Ads Studio).',
    description_en:
      'Stunning everyday image generation and editing at high speed.',
    credits_1k: 0.5,
    credits_2k: 1.0,
    credits_4k: 1.25,
    source_url: 'https://docs.higgsfield.ai/docs/models/ads-studio',
  }),
  makeImageEntry({
    model_id: 'google/nano-banana-2.1',
    model_name: 'Nano Banana 2.1 (Google Next-Gen Flagship Image)',
    family: 'Google Nano Banana',
    tier_badge: 'NEW',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Model gambar unggulan generasi terbaru dari Google dengan detail 1K, 2K, hingga 4K.',
    description_en:
      "Google's next-gen flagship image generation and editing model (1K/2K/4K).",
    credits_1k: 1.5,
    credits_2k: 2.0,
    credits_4k: 3.0,
  }),
  makeImageEntry({
    model_id: 'google/nano-banana-pro',
    model_name: 'Nano Banana Pro (Google Flagship Generation)',
    family: 'Google Nano Banana',
    tier_badge: 'POPULER',
    unlimited_eligible: true,
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Model gambar unggulan Google di Higgsfield (mendukung fitur Unlimited pada paket Pro/Max).',
    description_en:
      "Google's flagship generation model on Higgsfield (Eligible for Unlimited on Pro/Max).",
    credits_1k: 1.5,
    credits_2k: 2.0,
  }),
  makeImageEntry({
    model_id: 'google/nano-banana-2',
    model_name: 'Nano Banana 2 (Pro Quality at Flash Speed)',
    family: 'Google Nano Banana',
    tier_badge: 'PREMIUM',
    unlimited_eligible: true,
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Kualitas setara Pro dengan kecepatan secepat kilat serta mendukung hingga 14 gambar referensi.',
    description_en:
      'Pro quality at Flash speed with up to 14 reference images (Unlimited eligible).',
    credits_1k: 1.0,
    credits_2k: 1.5,
  }),
  makeImageEntry({
    model_id: 'google/nano-banana-2-lite',
    model_name: 'Nano Banana 2 Lite (Lightweight & Fast)',
    family: 'Google Nano Banana',
    tier_badge: 'PREMIUM',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Pembuatan dan variasi gambar ringan dengan kecepatan tinggi dan hemat Credit.',
    description_en:
      'Lightweight image generation and editing at high speed.',
    credits_1k: 0.5,
    credits_2k: 1.0,
  }),
  makeImageEntry({
    model_id: 'google/nano-banana',
    model_name: 'Nano Banana (Google Standard Generation)',
    family: 'Google Nano Banana',
    tier_badge: 'PREMIUM',
    unlimited_eligible: true,
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Model standar Google untuk pembuatan dan pengeditan gambar cepat (mendukung Unlimited).',
    description_en:
      "Google's standard image generation and editing model (Unlimited eligible).",
    credits_1k: 0.5,
    credits_2k: 1.0,
  }),
  makeImageEntry({
    model_id: 'bytedance/seedream-5.0-pro',
    model_name: 'Seedream 5.0 Pro (Intelligent Visual Reasoning)',
    family: 'ByteDance Seedream',
    tier_badge: 'PREMIUM',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Gambar yang konsisten secara logis dengan penalaran visual cerdas dari ByteDance.',
    description_en:
      'Logically consistent images with intelligent visual reasoning.',
    credits_1k: 1.25,
    credits_2k: 2.5,
  }),
  makeImageEntry({
    model_id: 'bytedance/seedream-5.0-flash',
    model_name: 'Seedream 5.0 Flash (Fast Visual Reasoning)',
    family: 'ByteDance Seedream',
    tier_badge: 'PREMIUM',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Pembuatan gambar cepat dengan penalaran visual cerdas dan tarif sangat hemat (0,5 Credit).',
    description_en:
      'Fast image generation with intelligent visual reasoning (0.5 Credits).',
    credits_1k: 0.5,
    credits_2k: 0.5,
  }),
  makeImageEntry({
    model_id: 'bytedance/seedream-5.0-lite',
    model_name: 'Seedream 5.0 lite (Intelligent Visual Reasoning)',
    family: 'ByteDance Seedream',
    tier_badge: 'STANDARD',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Varian ringan Seedream 5.0 yang mendukung hingga 14 gambar referensi sekaligus.',
    description_en:
      'Lightweight Seedream 5.0 variant supporting up to 14 reference images.',
    credits_1k: 0.5,
    credits_2k: 1.0,
  }),
  makeImageEntry({
    model_id: 'bytedance/seedream-4.5',
    model_name: 'Seedream 4.5 (ByteDance Next-Gen 4K Image)',
    family: 'ByteDance Seedream',
    tier_badge: 'PREMIUM',
    unlimited_eligible: true,
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Model gambar 4K unggulan ByteDance (mendukung hingga 14 gambar referensi & paket Unlimited).',
    description_en:
      "ByteDance's next-gen 4K image model (supports 14 references & Unlimited plan).",
    credits_1k: 1.0,
    credits_2k: 1.5,
    credits_4k: 2.0,
  }),
  makeImageEntry({
    model_id: 'bytedance/seedream-4.0',
    model_name: 'Seedream 4.0 (Advanced Image Editing & Generation)',
    family: 'ByteDance Seedream',
    tier_badge: 'PREMIUM',
    supported_categories: ['image_to_image', 'text_to_image'],
    description_id:
      'Model spesialis pengeditan dan transformasi gambar tingkat lanjut dari ByteDance.',
    description_en:
      "ByteDance's advanced image editing and generation model.",
    credits_1k: 0.75,
    credits_2k: 1.25,
  }),
  makeImageEntry({
    model_id: 'bfl/flux-3-image',
    model_name: 'FLUX 3 Image (Next-Gen BFL Generation & Editing)',
    family: 'Black Forest Labs FLUX',
    tier_badge: 'PREMIUM',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Pembuatan dan pengeditan gambar generasi terbaru dari Black Forest Labs (FLUX 3).',
    description_en:
      'Next-gen image generation and editing by Black Forest Labs.',
    credits_1k: 1.5,
    credits_2k: 2.25,
  }),
  makeImageEntry({
    model_id: 'bfl/flux-2-pro',
    model_name: 'FLUX.2 Pro (Speed-Optimized Detail)',
    family: 'Black Forest Labs FLUX',
    tier_badge: 'STANDARD',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Detail gambar tajam dengan kecepatan optimal dan dukungan hingga 8 gambar referensi.',
    description_en:
      'Speed-optimized detail with up to 8 reference images.',
    credits_1k: 0.75,
    credits_2k: 1.25,
  }),
  makeImageEntry({
    model_id: 'bfl/flux-2-flex',
    model_name: 'FLUX.2 Flex (Next-Gen Flexible Image)',
    family: 'Black Forest Labs FLUX',
    tier_badge: 'PREMIUM',
    unlimited_eligible: true,
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Generasi gambar fleksibel dengan dukungan hingga 10 gambar referensi (mendukung paket Unlimited).',
    description_en:
      'Next-gen image generation with up to 10 reference images (Unlimited eligible).',
    credits_1k: 1.0,
    credits_2k: 1.5,
  }),
  makeImageEntry({
    model_id: 'bfl/flux-2-max',
    model_name: 'FLUX.2 Max (Ultimate Precision & Speed)',
    family: 'Black Forest Labs FLUX',
    tier_badge: 'PREMIUM',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Presisi tertinggi dan ketajaman maksimal di keluarga FLUX.2.',
    description_en:
      'Ultimate precision and speed in the FLUX.2 family.',
    credits_1k: 1.5,
    credits_2k: 2.25,
  }),
  makeImageEntry({
    model_id: 'bfl/flux-kontext-max',
    model_name: 'Flux Kontext Max (Edit with Accuracy)',
    family: 'Black Forest Labs FLUX',
    tier_badge: 'PREMIUM',
    supported_categories: ['image_to_image', 'text_to_image'],
    description_id:
      'Edit elemen gambar, teks, dan pencahayaan dengan akurasi sangat tinggi.',
    description_en:
      'Edit images, objects, and context with high accuracy.',
    credits_1k: 1.5,
    credits_2k: 2.0,
  }),
  {
    provider: 'Higgsfield',
    model_id: 'ideogram/v4.5',
    model_name: 'Ideogram 4.5 (High-Resolution Typography & Visuals)',
    family: 'Ideogram',
    tier_badge: 'NEW',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Pembuatan gambar resolusi tinggi dan tipografi tajam terbaru dari Ideogram (0.25 s/d 6.25 Credit).',
    description_en:
      'High-resolution image and typography generation by Ideogram.',
    default_quantity_type: 'output',
    supports_duration: false,
    default_duration_seconds: 0,
    parameters: [
      {
        key: 'quality',
        label_id: 'Kualitas Render',
        label_en: 'Render Quality',
        type: 'select',
        options: [
          { value: 'low', label: 'Low / Fast (1.0 cr)' },
          { value: 'medium', label: 'Medium Balanced (2.0 cr)' },
          { value: 'high', label: 'High Ultra (6.25 cr)' },
          { value: 'very_low', label: 'Draft / Very Low (0.25 cr)' },
        ],
        defaultValue: 'medium',
        affectsPricing: true,
      },
    ],
    pricing_variants: [
      {
        matchParameters: { quality: 'medium' },
        pricing_unit: 'per_generation',
        price_value: 0.125,
        currency: 'USD',
        credit_cost: 2.0,
        credit_unit: 'per_generation',
        status: 'verified',
      },
      {
        matchParameters: { quality: 'low' },
        pricing_unit: 'per_generation',
        price_value: 0.0625,
        currency: 'USD',
        credit_cost: 1.0,
        credit_unit: 'per_generation',
        status: 'verified',
      },
      {
        matchParameters: { quality: 'high' },
        pricing_unit: 'per_generation',
        price_value: 0.3906,
        currency: 'USD',
        credit_cost: 6.25,
        credit_unit: 'per_generation',
        status: 'verified',
      },
      {
        matchParameters: { quality: 'very_low' },
        pricing_unit: 'per_generation',
        price_value: 0.0156,
        currency: 'USD',
        credit_cost: 0.25,
        credit_unit: 'per_generation',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Live Credits Config (ideogram_4_5)',
    source_url: 'https://docs.higgsfield.ai/docs/models/ideogram-4',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
  {
    provider: 'Higgsfield',
    model_id: 'recraft/v4.1',
    model_name: 'Recraft V4.1 / V4.1 Pro (Photorealistic & Design)',
    family: 'Recraft',
    tier_badge: 'PREMIUM',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Generasi gambar fotorealistis, desain grafis, dan vektor 1K/2K dengan kontrol palet warna.',
    description_en:
      'Photorealistic and expressive image generation in 1K and 2K.',
    default_quantity_type: 'output',
    supports_duration: false,
    default_duration_seconds: 0,
    parameters: [
      {
        key: 'tier',
        label_id: 'Varian Model',
        label_en: 'Model Variant',
        type: 'select',
        options: [
          { value: 'standard_1k', label: 'Standard 1K (1.0 - 1.25 cr)' },
          { value: 'pro_2k', label: 'Pro 2K (2.0 - 8.0 cr)' },
        ],
        defaultValue: 'standard_1k',
        affectsPricing: true,
      },
    ],
    pricing_variants: [
      {
        matchParameters: { tier: 'standard_1k' },
        pricing_unit: 'per_generation',
        price_value: 0.04,
        currency: 'USD',
        credit_cost: 1.0,
        credit_unit: 'per_generation',
        status: 'verified',
      },
      {
        matchParameters: { tier: 'pro_2k' },
        pricing_unit: 'per_generation',
        price_value: 0.08,
        currency: 'USD',
        credit_cost: 2.0,
        credit_unit: 'per_generation',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Image Catalog (docs.higgsfield.ai/docs/models/recraft-v4-1)',
    source_url: 'https://docs.higgsfield.ai/docs/models/recraft-v4-1',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
  makeImageEntry({
    model_id: 'recraft/v4.1-utility',
    model_name: 'Recraft V4.1 Utility (Flat & Even Studio Lighting)',
    family: 'Recraft',
    tier_badge: 'PREMIUM',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Pembuatan aset bersih dengan pencahayaan studio merata untuk komposit dan produk.',
    description_en:
      'Simple scenes with flat, even lighting for clean production compositing.',
    credits_1k: 1.25,
    credits_2k: 8.0,
    source_url: 'https://docs.higgsfield.ai/docs/models/recraft-v4-1-utility',
  }),
  makeImageEntry({
    model_id: 'recraft/v4-styles',
    model_name: 'Recraft V4 Styles (Consistent Reference Style)',
    family: 'Recraft',
    tier_badge: 'PREMIUM',
    supported_categories: ['image_to_image', 'text_to_image'],
    description_id:
      'Hasilkan gambar baru secara konsisten mengikuti gaya visual dari gambar referensi Anda.',
    description_en:
      'Generate consistently in the style of your reference images.',
    credits_1k: 1.5,
    credits_2k: 2.5,
  }),
  makeImageEntry({
    model_id: 'higgsfield-ai/soul-standard',
    model_name: 'Higgsfield Soul (Original Ultra-Realistic Fashion)',
    family: 'Higgsfield SOUL',
    tier_badge: 'STANDARD',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Model klasik Higgsfield Soul untuk potret fashion dengan pilihan gaya yang dapat diatur.',
    description_en:
      'Ultra-realistic fashion visuals with selectable styles.',
    credits_1k: 1.0,
    credits_2k: 1.5,
    source_url: 'https://docs.higgsfield.ai/docs/models/soul-standard',
  }),
  makeImageEntry({
    model_id: 'higgsfield-ai/face-swap',
    model_name: 'Higgsfield Face Swap (Seamless Face Swapping)',
    family: 'Higgsfield Character Tools',
    tier_badge: 'POPULER',
    supported_categories: ['image_to_image'],
    description_id:
      'Ganti wajah pada gambar dengan mulus dan alami sambil mempertahankan pencahayaan asli.',
    description_en:
      'Seamless face swapping while preserving original lighting and expression.',
    credits_1k: 1.0,
    credits_2k: 1.5,
  }),
  makeImageEntry({
    model_id: 'higgsfield-ai/character-swap',
    model_name: 'Higgsfield Character Swap (Seamless Character Swapping)',
    family: 'Higgsfield Character Tools',
    tier_badge: 'POPULER',
    supported_categories: ['image_to_image'],
    description_id:
      'Ganti seluruh karakter dalam adegan gambar dengan tetap mempertahankan pose dan komposisi.',
    description_en:
      'Seamless full-character swapping in any scene.',
    credits_1k: 1.5,
    credits_2k: 2.25,
  }),
  makeImageEntry({
    model_id: 'higgsfield-ai/multi-reference',
    model_name: 'Multi Reference (Multiple Edits in One Shot)',
    family: 'Higgsfield Character Tools',
    tier_badge: 'PREMIUM',
    supported_categories: ['image_to_image'],
    description_id:
      'Gabungkan beberapa gambar referensi (wajah, pakaian, latar, properti) dalam satu kali proses.',
    description_en:
      'Combine multiple reference images and edits in one shot.',
    credits_1k: 2.0,
    credits_2k: 3.0,
  }),
  makeImageEntry({
    model_id: 'openai/gpt-image-2',
    model_name: 'GPT Image 2 (4K Near-Perfect Text Rendering)',
    family: 'OpenAI GPT Image',
    tier_badge: 'PREMIUM',
    unlimited_eligible: true,
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Gambar hingga 4K dengan kemampuan render teks dan poster yang sangat akurat.',
    description_en:
      '4K images with near-perfect text rendering and instruction following.',
    credits_1k: 1.5,
    credits_2k: 2.5,
    credits_4k: 3.5,
  }),
  makeImageEntry({
    model_id: 'openai/gpt-image-1.5',
    model_name: 'GPT Image 1.5 (True-Color Precision Rendering)',
    family: 'OpenAI GPT Image',
    tier_badge: 'PREMIUM',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Render gambar dengan akurasi warna sejati dan pencahayaan natural.',
    description_en:
      'True-color precision rendering for commercial visuals.',
    credits_1k: 1.0,
    credits_2k: 1.75,
  }),
  makeImageEntry({
    model_id: 'openai/gpt-image',
    model_name: 'GPT Image (Versatile Text-to-Image AI)',
    family: 'OpenAI GPT Image',
    tier_badge: 'PREMIUM',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Model gambar serbaguna dari OpenAI untuk konsep cepat dan ilustrasi.',
    description_en:
      'Versatile text-to-image and image editing AI.',
    credits_1k: 0.75,
    credits_2k: 1.25,
  }),
  makeImageEntry({
    model_id: 'xai/grok-imagine-2.0',
    model_name: 'Grok Imagine 2.0 (High-Res Image by xAI)',
    family: 'xAI Grok',
    tier_badge: 'PREMIUM',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Pembuatan dan edit gambar resolusi tinggi dari xAI dengan dukungan hingga 10 gambar referensi.',
    description_en:
      'High-resolution image generation and editing by xAI with up to 10 references.',
    credits_1k: 1.25,
    credits_2k: 2.0,
    source_url: 'https://docs.higgsfield.ai/docs/models/grok-image-2',
  }),
  makeImageEntry({
    model_id: 'xai/grok-imagine',
    model_name: 'Grok Imagine (Versatile Image Styles by xAI)',
    family: 'xAI Grok',
    tier_badge: 'PREMIUM',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Gaya visual kreatif dan serbaguna dari xAI Grok.',
    description_en:
      'Versatile image styles by xAI.',
    credits_1k: 0.75,
    credits_2k: 1.25,
  }),
  makeImageEntry({
    model_id: 'higgsfield-ai/z-image',
    model_name: 'Z-Image Turbo (Instant Lifelike Portraits)',
    family: 'Z-Image',
    tier_badge: 'STANDARD',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Pembuatan potret wajah dan konsep instan dalam hitungan detik.',
    description_en:
      'Instant lifelike portraits and fast concept generation.',
    credits_1k: 0.5,
    credits_2k: 1.0,
    source_url: 'https://docs.higgsfield.ai/docs/models/z-image-turbo',
  }),
  makeImageEntry({
    model_id: 'kling-video/kling-o1-image',
    model_name: 'Kling O1 (Photorealistic Image Model)',
    family: 'Kling',
    tier_badge: 'PREMIUM',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Model gambar fotorealistis dari Kling yang sangat cocok sebagai frame awal video Kling.',
    description_en:
      "Kling's photorealistic image model designed for seamless video keyframes.",
    credits_1k: 1.25,
    credits_2k: 2.0,
  }),
  makeImageEntry({
    model_id: 'alibaba/wan-2.2-image',
    model_name: 'WAN 2.2 (High-Fidelity Cinematic Visuals)',
    family: 'Alibaba Wan',
    tier_badge: 'STANDARD',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Visual sinematik fidelitas tinggi dari keluarga model Alibaba Wan.',
    description_en:
      'High-fidelity cinematic visuals by Alibaba Wan.',
    credits_1k: 0.75,
    credits_2k: 1.25,
  }),
  makeImageEntry({
    model_id: 'alibaba/qwen-image-3',
    model_name: 'Qwen Image 3 (Multimodal Generation & Editing)',
    family: 'Alibaba Qwen',
    tier_badge: 'NEW',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Pembuatan dan pengeditan gambar multimodal terbaru dari Alibaba Qwen 3.',
    description_en:
      'Multimodal image generation and editing with Alibaba Qwen Image 3.',
    credits_1k: 1.0,
    credits_2k: 1.5,
    source_url: 'https://docs.higgsfield.ai/docs/models/qwen-image-3',
  }),
  makeImageEntry({
    model_id: 'higgsfield-ai/marketing-ads-studio',
    model_name: 'Marketing & Ads Studio (Campaign Visual Generator)',
    family: 'Higgsfield Studio',
    tier_badge: 'POPULER',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Ubah brief produk dan referensi menjadi konsep foto kampanye iklan siap pakai.',
    description_en:
      'Generate and edit campaign & ad concepts from product references.',
    credits_1k: 1.5,
    credits_2k: 2.5,
    source_url: 'https://docs.higgsfield.ai/docs/models/marketing-studio-image',
  }),
  makeImageEntry({
    model_id: 'higgsfield-ai/image-auto',
    model_name: 'Auto (Best Model Chosen For Your Prompt)',
    family: 'Higgsfield Auto',
    tier_badge: 'STANDARD',
    supported_categories: ['text_to_image', 'image_to_image'],
    description_id:
      'Sistem pintar Higgsfield yang otomatis memilihkan model gambar terbaik untuk prompt Anda.',
    description_en:
      'The best model for any prompt, automatically chosen for you.',
    credits_1k: 1.0,
    credits_2k: 1.5,
  }),
  // Backwards-compatible aliases used by existing projects & tests
  makeImageEntry({
    model_id: 'higgsfield-ai/soul/v2/reference',
    model_name: 'SOUL V2 Character & Style Reference (Image to Image)',
    family: 'Higgsfield SOUL',
    tier_badge: 'POPULER',
    supported_categories: ['image_to_image'],
    description_id:
      'Ubah gaya, pose, atau pakaian dari gambar awal dengan tetap menjaga kemiripan wajah dan karakter.',
    description_en:
      'Transform style, pose, or outfit from a source image while preserving character likeness.',
    credits_1k: 1.5,
    credits_2k: 2.25,
    price_1k: 0.094,
    price_2k: 0.141,
  }),
  makeImageEntry({
    model_id: 'flux-1/kontext-pro',
    model_name: 'FLUX.1 Kontext Pro (Smart Image Edit & Restyle)',
    family: 'Black Forest Labs FLUX',
    tier_badge: 'STANDARD',
    supported_categories: ['image_to_image'],
    description_id:
      'Edit objek, latar belakang, atau suasana dari gambar referensi menggunakan instruksi teks.',
    description_en:
      'Edit objects, backgrounds, or lighting from a reference image using text instructions.',
    credits_1k: 1.0,
    credits_2k: 2.0,
    price_1k: 0.05,
    price_2k: 0.08,
  }),
  makeImageEntry({
    model_id: 'recraft/v4.1-i2i',
    model_name: 'Recraft V4.1 Image-to-Image & Inpainting',
    family: 'Recraft',
    tier_badge: 'PREMIUM',
    supported_categories: ['image_to_image'],
    description_id:
      'Modifikasi gambar, variasi produk, dan penggantian elemen desain dari gambar sumber.',
    description_en:
      'Modify images, create product variations, and inpaint design elements from a source image.',
    credits_1k: 1.0,
    credits_2k: 2.0,
    price_1k: 0.04,
    price_2k: 0.08,
  }),
  makeImageEntry({
    model_id: 'ideogram/v4.0',
    model_name: 'Ideogram 4.0 (Typography & Key Visual)',
    family: 'Ideogram',
    tier_badge: 'STANDARD',
    supported_categories: ['text_to_image'],
    description_id:
      'Generasi poster, tipografi, dan key visual dengan kecepatan render yang dapat dipilih.',
    description_en:
      'Generate posters, typography, and key visuals with selectable rendering speed.',
    credits_1k: 1.5,
    credits_2k: 2.0,
    price_1k: 0.06,
    price_2k: 0.09,
  }),

  // ============================================================================
  // BAGIAN 2: IMAGE TO VIDEO & TEXT TO VIDEO (ALL LATEST HIGGSFIELD VIDEO MODELS)
  // ============================================================================
  {
    provider: 'Higgsfield',
    model_id: 'kling-video/v3.0',
    model_name: 'Kling 3.0 (Standard / Pro / 4K)',
    family: 'Kling',
    tier_badge: 'POPULER',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Model video unggulan Kling 3.0 dengan varian Standard, Pro, dan 4K serta opsi audio native.',
    description_en:
      'Flagship Kling 3.0 video generation with Standard, Pro, and 4K variants plus native sound.',
    default_quantity_type: 'shot',
    supports_duration: true,
    default_duration_seconds: 5,
    parameters: [
      {
        key: 'resolution',
        label_id: 'Mode & Resolusi',
        label_en: 'Mode & Resolution',
        type: 'select',
        options: [
          { value: '720p_std', label: 'Standard 720p (1.4 cr/dtk)' },
          { value: '1080p_pro', label: 'Pro 1080p (2.0 cr/dtk)' },
          { value: '4k_ultra', label: 'Ultra 4K (6.0 cr/dtk)' },
        ],
        defaultValue: '720p_std',
        affectsPricing: true,
      },
      {
        key: 'sound',
        label_id: 'Audio Native',
        label_en: 'Native Sound',
        type: 'select',
        options: [
          { value: 'on', label: 'On (Dengan Audio)' },
          { value: 'off', label: 'Off (Tanpa Audio)' },
        ],
        defaultValue: 'on',
        affectsPricing: false,
      },
      {
        key: 'aspect_ratio',
        label_id: 'Rasio Aspek',
        label_en: 'Aspect Ratio',
        type: 'select',
        options: [
          { value: '16:9', label: '16:9' },
          { value: '9:16', label: '9:16' },
          { value: '1:1', label: '1:1' },
        ],
        defaultValue: '16:9',
        affectsPricing: false,
      },
    ],
    pricing_variants: [
      {
        matchParameters: { resolution: '720p_std' },
        pricing_unit: 'per_second',
        price_value: 0.07,
        currency: 'USD',
        credit_cost: 1.4,
        credit_unit: 'per_second',
        status: 'verified',
      },
      {
        matchParameters: { resolution: '1080p_pro' },
        pricing_unit: 'per_second',
        price_value: 0.084,
        currency: 'USD',
        credit_cost: 2.0,
        credit_unit: 'per_second',
        status: 'verified',
      },
      {
        matchParameters: { resolution: '4k_ultra' },
        pricing_unit: 'per_second',
        price_value: 0.24,
        currency: 'USD',
        credit_cost: 6.0,
        credit_unit: 'per_second',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Kling 3.0 Docs & Published Pricing (docs.higgsfield.ai/docs/models/kling-3)',
    source_url: 'https://docs.higgsfield.ai/docs/models/kling-3/standard-text-to-video',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
  makeVideoEntry({
    model_id: 'kling-video/v3.0-turbo',
    model_name: 'Kling 3.0 Turbo (Fast 720p / 1080p)',
    family: 'Kling',
    tier_badge: 'NEW',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Varian kecepatan tinggi dari Kling 3.0 untuk iterasi shot cepat (1.5 cr/dtk 720p, 2.0 cr/dtk 1080p).',
    description_en:
      'High-speed Kling 3.0 Turbo generation (1.5 cr/s 720p, 2.0 cr/s 1080p).',
    credits_720p: 1.5,
    credits_1080p: 2.0,
  }),
  makeVideoEntry({
    model_id: 'kling-video/v3.0-omni',
    model_name: 'Kling 3.0 Omni / O3 (Multimodal Reference Video)',
    family: 'Kling',
    tier_badge: 'NEW',
    supported_categories: ['image_to_video', 'text_to_video'],
    description_id:
      'Buat video konsisten dengan referensi karakter, elemen, serta frame awal dan akhir.',
    description_en:
      'Generate videos with character element references and start/end frames.',
    credits_720p: 1.25,
    credits_1080p: 2.0,
    credits_4k: 6.0,
    source_url: 'https://docs.higgsfield.ai/docs/models/kling-omni',
  }),
  makeVideoEntry({
    model_id: 'kling-video/v2.6',
    model_name: 'Kling 2.6 (Smooth Motion & Unlimited Eligible)',
    family: 'Kling',
    tier_badge: 'POPULER',
    unlimited_eligible: true,
    supported_categories: ['image_to_video', 'text_to_video'],
    description_id:
      'Model video andal dengan gerak ekspresif (termasuk dalam akses Unlimited paket Pro/Max).',
    description_en:
      'Reliable video motion model (Eligible for Unlimited on Pro/Max plans).',
    credits_720p: 1.5,
    credits_1080p: 2.5,
    source_url: 'https://docs.higgsfield.ai/docs/models/kling-2-6',
  }),
  makeVideoEntry({
    model_id: 'kling-video/v2.5-turbo',
    model_name: 'Kling 2.5 Turbo (Standard & Pro)',
    family: 'Kling',
    tier_badge: 'STANDARD',
    supported_categories: ['image_to_video', 'text_to_video'],
    description_id:
      'Model Kling 2.5 Turbo yang ekonomis dan cepat untuk animasi gambar maupun teks.',
    description_en:
      'Fast and cost-efficient Kling 2.5 Turbo for text-to-video and image-to-video.',
    credits_720p: 1.25,
    credits_1080p: 2.0,
    source_url: 'https://docs.higgsfield.ai/docs/models/kling-2-5-turbo',
  }),
  makeVideoEntry({
    model_id: 'bytedance/seedance-2.5',
    model_name: 'Seedance 2.5 (Multimodal Cinema Flagship)',
    family: 'ByteDance Seedance',
    tier_badge: 'NEW',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Generasi video sinematik fidelitas tinggi terbaru dari ByteDance dengan gerak sangat dinamis.',
    description_en:
      'High-fidelity cinematic video generation from text or multimodal references.',
    default_duration_seconds: 8,
    credits_720p: 7.0,
    credits_1080p: 16.0,
    credits_480p: 3.0,
    credits_4k: 26.0,
    price_720p: 0.141,
    price_1080p: 0.206,
    source_url: 'https://docs.higgsfield.ai/docs/models/seedance-2-5',
  }),
  makeVideoEntry({
    model_id: 'bytedance/seedance-2.0',
    model_name: 'Seedance 2.0 (Balanced Cinematic Motion)',
    family: 'ByteDance Seedance',
    tier_badge: 'POPULER',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Generasi video dari teks atau frame awal/akhir dengan gerak kamera halus.',
    description_en:
      'Generate videos from text or start/end frames with smooth camera motion.',
    default_duration_seconds: 5,
    credits_720p: 4.5,
    credits_1080p: 12.0,
    credits_480p: 3.0,
    credits_4k: 22.0,
    price_720p: 0.14,
    price_1080p: 0.18,
    source_url: 'https://docs.higgsfield.ai/docs/models/seedance-2',
  }),
  makeVideoEntry({
    model_id: 'bytedance/seedance-2.0-fast',
    model_name: 'Seedance 2.0 Fast (High-Speed Motion)',
    family: 'ByteDance Seedance',
    tier_badge: 'POPULER',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Varian cepat dan hemat dari Seedance 2.0 (termasuk akses penuh pada paket Basic/Pro).',
    description_en:
      'Fast and cost-effective Seedance 2.0 video generation (2.5 cr/s 720p).',
    credits_720p: 2.5,
    credits_1080p: 7.0,
    credits_480p: 1.0,
    credits_4k: 14.0,
  }),
  makeVideoEntry({
    model_id: 'bytedance/seedance-2.0-mini',
    model_name: 'Exclusive Seedance 2.0 Mini (Ultra-Hemat)',
    family: 'ByteDance Seedance',
    tier_badge: 'NEW',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Model eksklusif super hemat untuk uji coba gerak dan storyboard cepat (0.5 - 1.0 Credit/dtk).',
    description_en:
      'Exclusive ultra-affordable Seedance 2.0 Mini for fast pre-visualization.',
    credits_720p: 1.0,
    credits_1080p: 2.0,
    credits_480p: 0.5,
  }),
  makeVideoEntry({
    model_id: 'bytedance/seedance-1.5-pro',
    model_name: 'Seedance 1.5 Pro / Seedance Pro',
    family: 'ByteDance Seedance',
    tier_badge: 'STANDARD',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Model Seedance Pro generasi 1.5 yang stabil untuk animasi karakter dan produk.',
    description_en:
      'Proven Seedance 1.5 Pro model for character and product animation.',
    credits_720p: 2.5,
    credits_1080p: 5.0,
  }),
  makeVideoEntry({
    model_id: 'bfl/flux-3-video',
    model_name: 'FLUX.3 Video (Black Forest Labs Next-Gen Video)',
    family: 'Black Forest Labs FLUX',
    tier_badge: 'NEW',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Model video generasi terbaru dari Black Forest Labs dengan ketajaman visual khas FLUX (720p s/d 4K).',
    description_en:
      'Next-generation video synthesis by Black Forest Labs (720p, 1080p, 2K, 4K).',
    credits_720p: 6.0,
    credits_1080p: 8.0,
    credits_4k: 13.0,
  }),
  makeVideoEntry({
    model_id: 'higgsfield-ai/cinema-studio-4.0',
    model_name: 'Cinema Studio 4.0 / Higgsfield DoP (Camera & Lens Control)',
    family: 'Higgsfield Native',
    tier_badge: 'PREMIUM',
    supported_categories: ['image_to_video', 'text_to_video'],
    description_id:
      'Pembuatan shot video dengan kontrol pergerakan kamera DoP, lensa sinema, dan pencahayaan.',
    description_en:
      'Create video shots with dedicated DoP camera movement, cinema lens, and style controls.',
    credits_720p: 5.0,
    credits_1080p: 13.0,
    credits_480p: 3.0,
    price_720p: 0.12,
    price_1080p: 0.24,
    source_url: 'https://docs.higgsfield.ai/docs/models/cinema-studio-4',
  }),
  makeVideoEntry({
    model_id: 'google/veo-3.1',
    model_name: 'Google Veo 3.1 (Flagship Cinematic Video & Audio)',
    family: 'Google Veo',
    tier_badge: 'PREMIUM',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Model video sinematik unggulan Google Veo 3.1 dengan kualitas gerak dan suara sangat realistis.',
    description_en:
      "Google's flagship Veo 3.1 video model with realistic physics and audio.",
    credits_720p: 6.0,
    credits_1080p: 9.0,
  }),
  makeVideoEntry({
    model_id: 'google/veo-3.1-lite',
    model_name: 'Veo 3.1 Lite (Fast & Efficient Google Video)',
    family: 'Google Veo',
    tier_badge: 'NEW',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Varian cepat dan hemat biaya dari Google Veo 3.1 untuk produksi harian.',
    description_en:
      'Cost-efficient and fast variant of Google Veo 3.1.',
    credits_720p: 3.0,
    credits_1080p: 5.0,
  }),
  makeVideoEntry({
    model_id: 'google/gemini-omni-flash-1.1',
    model_name: 'Gemini Omni Flash 1.1 (Multimodal Video & Extend)',
    family: 'Google Gemini Video',
    tier_badge: 'NEW',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Generasi dan perpanjangan video multimodal cerdas dengan tarif rata 3 Credit/detik di 720p & 1080p.',
    description_en:
      'Multimodal video generation and extension powered by Gemini Omni Flash 1.1.',
    credits_720p: 3.0,
    credits_1080p: 3.0,
    credits_4k: 6.0,
  }),
  {
    provider: 'Higgsfield',
    model_id: 'alibaba/wan-3.0-prime',
    model_name: 'Wan 3.0 / Wan 3.0 Prime',
    family: 'Alibaba Wan',
    tier_badge: 'NEW',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Generasi video efisien generasi ke-3 dari Alibaba dari teks, frame, atau referensi multimodal.',
    description_en:
      'Cost-efficient 3rd-gen video generation from text, frames, or multimodal references.',
    default_quantity_type: 'shot',
    supports_duration: true,
    default_duration_seconds: 5,
    parameters: [
      {
        key: 'variant',
        label_id: 'Varian Model',
        label_en: 'Model Variant',
        type: 'select',
        options: [
          { value: 'wan_3_std', label: 'Wan 3.0 Standard 720p (1.6 cr/dtk)' },
          { value: 'wan_3_prime', label: 'Wan 3.0 Prime 1080p (2.6 cr/dtk)' },
        ],
        defaultValue: 'wan_3_std',
        affectsPricing: true,
      },
    ],
    pricing_variants: [
      {
        matchParameters: { variant: 'wan_3_std' },
        pricing_unit: 'per_second',
        price_value: 0.05,
        currency: 'USD',
        credit_cost: 1.6,
        credit_unit: 'per_second',
        status: 'verified',
      },
      {
        matchParameters: { variant: 'wan_3_prime' },
        pricing_unit: 'per_second',
        price_value: 0.068,
        currency: 'USD',
        credit_cost: 2.6,
        credit_unit: 'per_second',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Wan 3.0 Docs (docs.higgsfield.ai/docs/models/wan-3-prime)',
    source_url: 'https://docs.higgsfield.ai/docs/models/wan-3-prime',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
  makeVideoEntry({
    model_id: 'alibaba/wan-2.7',
    model_name: 'Wan 2.7 (Text, Image & Reference to Video)',
    family: 'Alibaba Wan',
    tier_badge: 'NEW',
    supported_categories: ['text_to_video', 'image_to_video', 'video_to_video'],
    description_id:
      'Buat video dari teks, frame awal/akhir, atau referensi video dengan Wan 2.7.',
    description_en:
      'Generate videos from text, frames, or multimodal video references.',
    credits_720p: 2.5,
    credits_1080p: 4.0,
    source_url: 'https://docs.higgsfield.ai/docs/models/wan-2-7',
  }),
  makeVideoEntry({
    model_id: 'alibaba/wan-2.6',
    model_name: 'Wan 2.6 (Multimodal Video Generation)',
    family: 'Alibaba Wan',
    tier_badge: 'STANDARD',
    supported_categories: ['text_to_video', 'image_to_video', 'video_to_video'],
    description_id:
      'Generasi video serbaguna dari teks, gambar, atau video referensi.',
    description_en:
      'Generate videos from text, images, or video references.',
    credits_720p: 2.0,
    credits_1080p: 3.5,
    source_url: 'https://docs.higgsfield.ai/docs/models/wan-2-6',
  }),
  makeVideoEntry({
    model_id: 'alibaba/wan-2.5',
    model_name: 'Wan 2.5 / Wan 2.2 (Fast Everyday Video)',
    family: 'Alibaba Wan',
    tier_badge: 'POPULER',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Model video cepat dan hemat untuk animasi storyboard dan konten sosial media.',
    description_en:
      'Fast and affordable everyday video generation.',
    credits_720p: 1.5,
    credits_1080p: 2.5,
    credits_480p: 1.0,
  }),
  makeVideoEntry({
    model_id: 'minimax/h3-max',
    model_name: 'MiniMax H3 / H3 Max (Next-Gen Hailuo)',
    family: 'MiniMax Hailuo',
    tier_badge: 'NEW',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Generasi video ekspresif terbaru dari MiniMax H3 dan H3 Max.',
    description_en:
      'Generate expressive videos from text, frames, or multimodal references with MiniMax H3.',
    credits_720p: 3.0,
    credits_1080p: 4.5,
    source_url: 'https://docs.higgsfield.ai/docs/models/minimax-h3',
  }),
  makeVideoEntry({
    model_id: 'minimax/hailuo-2.3',
    model_name: 'Minimax Hailuo 2.3 (Standard & Unlimited Fast)',
    family: 'MiniMax Hailuo',
    tier_badge: 'POPULER',
    unlimited_eligible: true,
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Gerakan karakter sinematik yang halus dari MiniMax Hailuo 2.3 (mendukung paket Unlimited).',
    description_en:
      'Smooth cinematic character movement with Hailuo 2.3 (Unlimited eligible).',
    credits_720p: 1.5,
    credits_1080p: 2.5,
    source_url: 'https://docs.higgsfield.ai/docs/models/hailuo-2-3',
  }),
  makeVideoEntry({
    model_id: 'xai/grok-video-1.5',
    model_name: 'Grok Imagine Video 1.5 (xAI Multimodal Video)',
    family: 'xAI Grok',
    tier_badge: 'NEW',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Pembuatan video dari teks, gambar, atau referensi audio oleh xAI (4.5 cr/dtk 720p, 8.0 cr/dtk 1080p).',
    description_en:
      'Generate videos from text, images, or audio references with xAI Grok Video 1.5.',
    credits_720p: 4.5,
    credits_1080p: 8.0,
    credits_480p: 2.5,
    source_url: 'https://docs.higgsfield.ai/docs/models/grok-video-1-5',
  }),
  makeVideoEntry({
    model_id: 'xai/grok-video-1.5-lite',
    model_name: 'Grok 1.5 Lite (Ultra-Affordable xAI Video)',
    family: 'xAI Grok',
    tier_badge: 'NEW',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Varian super hemat Grok Video 1.5 (hanya 1 Credit/detik untuk resolusi 480p & 720p).',
    description_en:
      'Ultra-affordable xAI Grok 1.5 Lite video model (1 Credit/sec at 720p).',
    credits_720p: 1.0,
    credits_1080p: 4.0,
    credits_480p: 1.0,
  }),
  makeVideoEntry({
    model_id: 'higgsfield-ai/happy-horse-1.1',
    model_name: 'HappyHorse 1.1 / 1.0 (Expressive Stylized Video)',
    family: 'HappyHorse',
    tier_badge: 'NEW',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Model video kreatif dengan gaya visual ekspresif dan gerak dinamis (2.5 cr/dtk 720p).',
    description_en:
      'Expressive and stylized video generation with HappyHorse 1.1.',
    credits_720p: 2.5,
    credits_1080p: 4.5,
    source_url: 'https://docs.higgsfield.ai/docs/models/happy-horse-1-1',
  }),
  makeVideoEntry({
    model_id: 'lightricks/ltx-2.5',
    model_name: 'LTX-2.5 (Fast & Pro Storyboard Video)',
    family: 'Lightricks LTX',
    tier_badge: 'STANDARD',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Generasi video sangat cepat dari teks atau gambar dengan varian Fast dan Pro.',
    description_en:
      'Generate videos from text or images with LTX-2.5 Fast and Pro variants.',
    credits_720p: 1.5,
    credits_1080p: 2.5,
    source_url: 'https://docs.higgsfield.ai/docs/models/ltx-2-5',
  }),
  makeVideoEntry({
    model_id: 'pixverse/v6',
    model_name: 'PixVerse V6 (Dynamic Motion & Sound)',
    family: 'PixVerse',
    tier_badge: 'STANDARD',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Pembuatan video dari teks atau gambar dengan efek dinamis dan dukungan suara opsional.',
    description_en:
      'Generate videos from text or images with optional sound in PixVerse V6.',
    credits_720p: 2.0,
    credits_1080p: 3.5,
    source_url: 'https://docs.higgsfield.ai/docs/models/pixverse-v6',
  }),
  makeVideoEntry({
    model_id: 'openai/sora-2-pro',
    model_name: 'OpenAI Sora 2 (Pro / Max Video)',
    family: 'OpenAI Sora',
    tier_badge: 'PREMIUM',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id:
      'Model video sinematik OpenAI Sora 2 dengan simulasi dunia nyata dan pencahayaan akurat.',
    description_en:
      'OpenAI Sora 2 Pro/Max cinematic video generation.',
    credits_720p: 6.0,
    credits_1080p: 10.0,
  }),

  // ============================================================================
  // BAGIAN 3: VIDEO TO VIDEO (EDIT VIDEO, MOTION CONTROL, & RESTYLE)
  // ============================================================================
  {
    provider: 'Higgsfield',
    model_id: 'higgsfield-ai/genjutsu',
    model_name: 'Genjutsu / Evolution (Motion Transfer & Video Restyle)',
    family: 'Higgsfield Native',
    tier_badge: 'POPULER',
    supported_categories: ['video_to_video'],
    description_id:
      'Transfer gerak, penggantian objek, atau ubah gaya visual penuh dari video sumber.',
    description_en:
      'Transfer motion, replace objects, or restyle a source video.',
    default_quantity_type: 'shot',
    supports_duration: true,
    default_duration_seconds: 5,
    parameters: [
      {
        key: 'workflow_mode',
        label_id: 'Mode Transformasi',
        label_en: 'Transformation Mode',
        type: 'select',
        options: [
          { value: 'motion_transfer', label: 'Motion Transfer (7.0 - 8.0 cr/dtk)' },
          { value: 'object_replace', label: 'Object Replace' },
          { value: 'video_restyle', label: 'Full Video Restyle / Evolution' },
        ],
        defaultValue: 'motion_transfer',
        affectsPricing: false,
      },
    ],
    pricing_variants: [
      {
        pricing_unit: 'per_second',
        price_value: 0.318,
        currency: 'USD',
        credit_cost: 8.0,
        credit_unit: 'per_second',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Genjutsu API Reference (docs.higgsfield.ai/docs/models/genjutsu)',
    source_url: 'https://docs.higgsfield.ai/docs/models/genjutsu',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
  makeVideoEntry({
    model_id: 'bytedance/seedance-2.5-video-edit',
    model_name: 'Seedance 2.5 Video Edit (Transform & Restyle Video)',
    family: 'ByteDance Seedance',
    tier_badge: 'NEW',
    supported_categories: ['video_to_video'],
    description_id:
      'Ubah elemen, gaya, atau pencahayaan dari video sumber menggunakan kecerdasan Seedance 2.5.',
    description_en:
      'Transform and edit existing video clips with Seedance 2.5 Video Edit.',
    credits_720p: 7.5,
    credits_1080p: 20.0,
    credits_480p: 3.5,
    credits_4k: 34.0,
    source_url: 'https://docs.higgsfield.ai/docs/models/seedance-2-5',
  }),
  {
    provider: 'Higgsfield',
    model_id: 'kling-video/v3.0-motion-control',
    model_name: 'Kling 3.0 / 2.6 Motion Control',
    family: 'Kling',
    tier_badge: 'NEW',
    supported_categories: ['video_to_video'],
    description_id:
      'Terapkan gerakan dari video sumber ke karakter/aset dengan pemrosesan Standard atau Pro.',
    description_en:
      'Apply motion from a source video to a target with Standard or Pro processing.',
    default_quantity_type: 'shot',
    supports_duration: true,
    default_duration_seconds: 5,
    parameters: [
      {
        key: 'processing_tier',
        label_id: 'Tingkat Pemrosesan',
        label_en: 'Processing Tier',
        type: 'select',
        options: [
          { value: 'standard', label: 'Standard (1.5 - 2.0 cr/dtk)' },
          { value: 'pro', label: 'Pro (2.5 - 3.0 cr/dtk)' },
        ],
        defaultValue: 'standard',
        affectsPricing: true,
      },
    ],
    pricing_variants: [
      {
        matchParameters: { processing_tier: 'standard' },
        pricing_unit: 'per_second',
        price_value: 0.084,
        currency: 'USD',
        credit_cost: 2.0,
        credit_unit: 'per_second',
        status: 'verified',
      },
      {
        matchParameters: { processing_tier: 'pro' },
        pricing_unit: 'per_second',
        price_value: 0.126,
        currency: 'USD',
        credit_cost: 3.0,
        credit_unit: 'per_second',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Kling 3.0 Motion Control Docs (docs.higgsfield.ai/docs/models/kling-3-motion-control)',
    source_url: 'https://docs.higgsfield.ai/docs/models/kling-3-motion-control',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
  {
    provider: 'Higgsfield',
    model_id: 'kling-video/kling-o3-video-reference',
    model_name: 'Kling O3 / Omni (Video Edit & Reference)',
    family: 'Kling',
    tier_badge: 'PREMIUM',
    supported_categories: ['video_to_video'],
    description_id:
      'Edit dan perluas video menggunakan referensi video dan gambar.',
    description_en:
      'Create and edit videos with first/last frames and video references.',
    default_quantity_type: 'shot',
    supports_duration: true,
    default_duration_seconds: 5,
    parameters: [
      {
        key: 'mode',
        label_id: 'Mode Referensi',
        label_en: 'Reference Mode',
        type: 'select',
        options: [
          { value: 'video_ref', label: 'Video Reference (2.2 cr/dtk)' },
          { value: 'omni_edit', label: 'Omni Video Edit' },
        ],
        defaultValue: 'video_ref',
        affectsPricing: false,
      },
    ],
    pricing_variants: [
      {
        pricing_unit: 'per_second',
        price_value: 0.084,
        currency: 'USD',
        credit_cost: 2.2,
        credit_unit: 'per_second',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Kling O3 Reference (docs.higgsfield.ai/docs/models/kling-o3)',
    source_url: 'https://docs.higgsfield.ai/docs/models/kling-o3',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
  makeVideoEntry({
    model_id: 'higgsfield-ai/cinema-studio-video-edit',
    model_name: 'Cinema Studio 4.0 Video Edit, Relight & Inpaint',
    family: 'Higgsfield Native',
    tier_badge: 'PREMIUM',
    supported_categories: ['video_to_video'],
    description_id:
      'Ubah pencahayaan (Relight), hapus/ganti objek (Inpaint), dan edit adegan video di Cinema Studio.',
    description_en:
      'Relight, inpaint, and edit video shots in Cinema Studio 4.0.',
    credits_720p: 7.0,
    credits_1080p: 13.0,
    credits_480p: 3.5,
  }),
  makeVideoEntry({
    model_id: 'higgsfield-ai/motion-control-flash',
    model_name: 'Motion Control & Replace Object Flash (Fast V2V)',
    family: 'Higgsfield Native',
    tier_badge: 'NEW',
    supported_categories: ['video_to_video'],
    description_id:
      'Transfer gerakan karakter dan penggantian objek video cepat dengan tarif promo Flash.',
    description_en:
      'Fast character motion control and object replacement in video.',
    credits_720p: 2.0,
    credits_1080p: 4.0,
    credits_480p: 1.0,
  }),
  makeVideoEntry({
    model_id: 'higgsfield-ai/swap-remove-reframe',
    model_name: 'Swap Object / Remove Object / Draw-to-Video / Reframe',
    family: 'Higgsfield Video Tools',
    tier_badge: 'STANDARD',
    supported_categories: ['video_to_video'],
    description_id:
      'Alat edit video praktis untuk mengganti objek, menghapus objek, menggambar gerakan, atau mengubah rasio video.',
    description_en:
      'Swap objects, remove objects, draw motion, or reframe video aspect ratios.',
    credits_720p: 4.5,
    credits_1080p: 12.0,
    credits_480p: 3.0,
  }),
  makeVideoEntry({
    model_id: 'xai/grok-video-edit',
    model_name: 'Grok Video Edit (Prompt-Driven Video Transformation)',
    family: 'xAI Grok',
    tier_badge: 'NEW',
    supported_categories: ['video_to_video'],
    description_id:
      'Ubah suasana, gaya, atau elemen video menggunakan instruksi teks dengan xAI Grok Video Edit.',
    description_en:
      'Edit and restyle videos using text prompts with xAI Grok Video Edit.',
    credits_720p: 4.5,
    credits_1080p: 8.0,
  }),

  // ============================================================================
  // BAGIAN 4: UPSCALE IMAGE (PERBESAR & PERJELAS GAMBAR — DIHITUNG PER GAMBAR)
  // ============================================================================
  {
    provider: 'Higgsfield',
    model_id: 'topaz/gigapixel-image-upscale',
    model_name: 'Topaz GigaPixel AI (Image Upscale & Face Recovery)',
    family: 'Topaz Labs',
    tier_badge: 'POPULER',
    supported_categories: ['upscale_image'],
    description_id:
      'Standar industri Topaz GigaPixel di Higgsfield untuk memperbesar resolusi foto/gambar hingga 4K dengan sangat tajam.',
    description_en:
      'Industry-standard Topaz GigaPixel AI image upscaling and detail recovery.',
    default_quantity_type: 'output',
    supports_duration: false,
    default_duration_seconds: 0,
    parameters: [
      {
        key: 'scale_factor',
        label_id: 'Target Perbesaran Gambar',
        label_en: 'Target Upscale Factor',
        type: 'select',
        options: [
          { value: '2x_2k', label: '2x High-Res (1.5 cr)' },
          { value: '4x_4k', label: '4x Ultra 4K (2.5 cr)' },
        ],
        defaultValue: '2x_2k',
        affectsPricing: true,
      },
    ],
    pricing_variants: [
      {
        matchParameters: { scale_factor: '2x_2k' },
        pricing_unit: 'per_asset',
        price_value: 0.0938,
        currency: 'USD',
        credit_cost: 1.5,
        credit_unit: 'per_generation',
        status: 'verified',
      },
      {
        matchParameters: { scale_factor: '4x_4k' },
        pricing_unit: 'per_asset',
        price_value: 0.1563,
        currency: 'USD',
        credit_cost: 2.5,
        credit_unit: 'per_generation',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Upscale Studio (Topaz GigaPixel)',
    source_url: 'https://higgsfield.ai/upscale',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
  {
    provider: 'Higgsfield',
    model_id: 'google/nano-banana-2-upscale',
    model_name: 'Nano Banana 2 Upscale & Relight (Image Enhancer)',
    family: 'Google Nano Banana',
    tier_badge: 'NEW',
    supported_categories: ['upscale_image'],
    description_id:
      'Perbesar resolusi dan perbaiki pencahayaan serta ketajaman gambar dengan Nano Banana 2 Upscale.',
    description_en:
      'Upscale and enhance image lighting & micro-details with Nano Banana 2.',
    default_quantity_type: 'output',
    supports_duration: false,
    default_duration_seconds: 0,
    parameters: [
      {
        key: 'target_resolution',
        label_id: 'Target Resolusi',
        label_en: 'Target Resolution',
        type: 'select',
        options: [
          { value: '2K', label: '2K Enhance (1.5 cr)' },
          { value: '4K', label: '4K Master (2.5 cr)' },
        ],
        defaultValue: '2K',
        affectsPricing: true,
      },
    ],
    pricing_variants: [
      {
        matchParameters: { target_resolution: '2K' },
        pricing_unit: 'per_asset',
        price_value: 0.0938,
        currency: 'USD',
        credit_cost: 1.5,
        credit_unit: 'per_generation',
        status: 'verified',
      },
      {
        matchParameters: { target_resolution: '4K' },
        pricing_unit: 'per_asset',
        price_value: 0.1563,
        currency: 'USD',
        credit_cost: 2.5,
        credit_unit: 'per_generation',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Nano Banana 2 Upscale Job',
    source_url: HIGGSFIELD_DOCS_URL,
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
  {
    provider: 'Higgsfield',
    model_id: 'recraft/v4.1-utility-pro',
    model_name: 'Recraft V4.1 Utility Pro (2K Image Upscale & Clean)',
    family: 'Recraft Image Upscale',
    tier_badge: 'PREMIUM',
    supported_categories: ['upscale_image'],
    description_id:
      'Perbesar resolusi gambar ke 2K dan pembersihan detail gambar secara presisi.',
    description_en:
      'Upscale still images to 2K resolution with precision detail cleanup.',
    default_quantity_type: 'output',
    supports_duration: false,
    default_duration_seconds: 0,
    parameters: [
      {
        key: 'output_quality',
        label_id: 'Kualitas Target Gambar',
        label_en: 'Target Image Quality',
        type: 'select',
        options: [
          { value: '1K_utility', label: '1K Clean & Enhance (1.0 cr)' },
          { value: '2K_pro', label: '2K High-Res Upscale (2.0 cr)' },
        ],
        defaultValue: '2K_pro',
        affectsPricing: true,
      },
    ],
    pricing_variants: [
      {
        matchParameters: { output_quality: '1K_utility' },
        pricing_unit: 'per_asset',
        price_value: 0.04,
        currency: 'USD',
        credit_cost: 1.0,
        credit_unit: 'per_generation',
        status: 'verified',
      },
      {
        matchParameters: { output_quality: '2K_pro' },
        pricing_unit: 'per_asset',
        price_value: 0.08,
        currency: 'USD',
        credit_cost: 2.0,
        credit_unit: 'per_generation',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Recraft V4.1 Utility Pro Docs (docs.higgsfield.ai/docs/models/recraft-v4-1-utility-pro)',
    source_url: 'https://docs.higgsfield.ai/docs/models/recraft-v4-1-utility-pro',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
  {
    provider: 'Higgsfield',
    model_id: 'higgsfield-ai/clarity-image-upscaler',
    model_name: 'Higgsfield Clarity 4K Image Upscaler & Detail Enhancer',
    family: 'Higgsfield Image Enhancement',
    tier_badge: 'STANDARD',
    supported_categories: ['upscale_image'],
    description_id:
      'Perbesar resolusi gambar dan pertajam tekstur hingga 4K tanpa mengubah komposisi asli.',
    description_en:
      'Upscale still images and sharpen textures up to 4K while preserving original composition.',
    default_quantity_type: 'output',
    supports_duration: false,
    default_duration_seconds: 0,
    parameters: [
      {
        key: 'target_resolution',
        label_id: 'Target Resolusi Gambar',
        label_en: 'Target Image Resolution',
        type: 'select',
        options: [
          { value: '2k_crisp', label: '2K Crisp Upscale (1.0 cr)' },
          { value: '4k_ultra', label: '4K Ultra Detail (2.0 cr)' },
        ],
        defaultValue: '4k_ultra',
        affectsPricing: true,
      },
    ],
    pricing_variants: [
      {
        matchParameters: { target_resolution: '2k_crisp' },
        pricing_unit: 'per_asset',
        price_value: 0.05,
        currency: 'USD',
        credit_cost: 1.0,
        credit_unit: 'per_generation',
        status: 'verified',
      },
      {
        matchParameters: { target_resolution: '4k_ultra' },
        pricing_unit: 'per_asset',
        price_value: 0.09,
        currency: 'USD',
        credit_cost: 2.0,
        credit_unit: 'per_generation',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Image Upscale Reference (docs.higgsfield.ai/docs/models)',
    source_url: 'https://docs.higgsfield.ai/docs/models',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },

  // ============================================================================
  // BAGIAN 5: UPSCALE VIDEO (PERBESAR & PERJELAS VIDEO — DIHITUNG PER DETIK VIDEO)
  // ============================================================================
  {
    provider: 'Higgsfield',
    model_id: 'bfl/flux-video-upscale',
    model_name: 'FLUX Video Upscale (720p / 1080p / 2K / 4K)',
    family: 'Black Forest Labs FLUX',
    tier_badge: 'NEW',
    supported_categories: ['upscale_video'],
    description_id:
      'Perbesar dan pertajam kualitas video dengan teknologi FLUX Video Upscale (mulai 0,5 s/d 8 Credit/detik).',
    description_en:
      'Upscale and sharpen video resolution up to 4K using FLUX Video Upscale.',
    default_quantity_type: 'asset',
    supports_duration: true,
    default_duration_seconds: 5,
    parameters: [
      {
        key: 'target_resolution',
        label_id: 'Target Resolusi Video',
        label_en: 'Target Video Resolution',
        type: 'select',
        options: [
          { value: '1080p', label: '1080p Full HD (1.75 cr/dtk)' },
          { value: '2k', label: '2K QHD (3.0 cr/dtk)' },
          { value: '4k', label: '4K Ultra HD (8.0 cr/dtk)' },
          { value: '720p', label: '720p HD (0.5 cr/dtk)' },
        ],
        defaultValue: '1080p',
        affectsPricing: true,
      },
    ],
    pricing_variants: [
      {
        matchParameters: { target_resolution: '1080p' },
        pricing_unit: 'per_second',
        price_value: roundUsd(1.75 * DEFAULT_USD_PER_CREDIT),
        currency: 'USD',
        credit_cost: 1.75,
        credit_unit: 'per_second',
        status: 'verified',
      },
      {
        matchParameters: { target_resolution: '2k' },
        pricing_unit: 'per_second',
        price_value: roundUsd(3.0 * DEFAULT_USD_PER_CREDIT),
        currency: 'USD',
        credit_cost: 3.0,
        credit_unit: 'per_second',
        status: 'verified',
      },
      {
        matchParameters: { target_resolution: '4k' },
        pricing_unit: 'per_second',
        price_value: roundUsd(8.0 * DEFAULT_USD_PER_CREDIT),
        currency: 'USD',
        credit_cost: 8.0,
        credit_unit: 'per_second',
        status: 'verified',
      },
      {
        matchParameters: { target_resolution: '720p' },
        pricing_unit: 'per_second',
        price_value: roundUsd(0.5 * DEFAULT_USD_PER_CREDIT),
        currency: 'USD',
        credit_cost: 0.5,
        credit_unit: 'per_second',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Live Credits Config (flux_video_upscale)',
    source_url: 'https://higgsfield.ai/ai/video/edit?tool=upscale',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
  {
    provider: 'Higgsfield',
    model_id: 'topaz/hyperion-2.5-video',
    model_name: 'Topaz Hyperion 2.5 (Cinema Video Enhancer)',
    family: 'Topaz Labs',
    tier_badge: 'PREMIUM',
    supported_categories: ['upscale_video'],
    description_id:
      'Penjernihan detail, pengurangan bintik (denoise), dan peningkatan resolusi video dengan Topaz Hyperion 2.5 (2.6 cr/dtk).',
    description_en:
      'Cinema-grade video detail recovery and upscaling with Topaz Hyperion 2.5.',
    default_quantity_type: 'asset',
    supports_duration: true,
    default_duration_seconds: 5,
    parameters: [
      {
        key: 'resolution',
        label_id: 'Target Resolusi',
        label_en: 'Target Resolution',
        type: 'select',
        options: [
          { value: '1080p', label: '1080p / 4K Enhance (2.6 cr/dtk)' },
        ],
        defaultValue: '1080p',
        affectsPricing: false,
      },
    ],
    pricing_variants: [
      {
        pricing_unit: 'per_second',
        price_value: roundUsd(2.6 * DEFAULT_USD_PER_CREDIT),
        currency: 'USD',
        credit_cost: 2.6,
        credit_unit: 'per_second',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Live Credits Config (topaz_hyperion_2_5)',
    source_url: 'https://higgsfield.ai/ai/video/edit?tool=upscale',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
  {
    provider: 'Higgsfield',
    model_id: 'topaz/fps-boost-upscale',
    model_name: 'Topaz FPS Boost & Smooth Motion (30fps / 60fps)',
    family: 'Topaz Labs',
    tier_badge: 'PREMIUM',
    supported_categories: ['upscale_video'],
    description_id:
      'Haluskan pergerakan video AI menjadi 30fps atau 60fps sekaligus memperjelas detail dengan Topaz (3.3 cr/dtk).',
    description_en:
      'Boost video frame rate to smooth 30fps/60fps and enhance clarity with Topaz.',
    default_quantity_type: 'asset',
    supports_duration: true,
    default_duration_seconds: 5,
    parameters: [
      {
        key: 'target_fps',
        label_id: 'Target Frame Rate',
        label_en: 'Target Frame Rate',
        type: 'select',
        options: [
          { value: '60fps', label: '60 FPS Smooth Motion (3.3 cr/dtk)' },
          { value: '30fps', label: '30 FPS Broadcast (3.3 cr/dtk)' },
        ],
        defaultValue: '60fps',
        affectsPricing: false,
      },
    ],
    pricing_variants: [
      {
        pricing_unit: 'per_second',
        price_value: roundUsd(3.3 * DEFAULT_USD_PER_CREDIT),
        currency: 'USD',
        credit_cost: 3.3,
        credit_unit: 'per_second',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Live Credits Config (fps_boost)',
    source_url: 'https://higgsfield.ai/ai/video/edit?tool=upscale',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
  {
    provider: 'Higgsfield',
    model_id: 'higgsfield-ai/video-upscale-4k',
    model_name: 'Genjutsu / Higgsfield 4K Video Upscaler & Enhancer',
    family: 'Higgsfield Video Enhancement',
    tier_badge: 'POPULER',
    supported_categories: ['upscale_video'],
    description_id:
      'Perbesar resolusi dan tingkatkan ketajaman klip video hingga kualitas 4K.',
    description_en:
      'Upscale and enhance generated video clips up to 4K resolution.',
    default_quantity_type: 'asset',
    supports_duration: true,
    default_duration_seconds: 5,
    parameters: [
      {
        key: 'target_resolution',
        label_id: 'Target Resolusi Video',
        label_en: 'Target Video Resolution',
        type: 'select',
        options: [
          { value: '1080p_enhance', label: '1080p Detail Enhance (0.8 cr/dtk)' },
          { value: '4k_upscale', label: '4K Cinema Upscale (1.5 cr/dtk)' },
        ],
        defaultValue: '4k_upscale',
        affectsPricing: true,
      },
    ],
    pricing_variants: [
      {
        matchParameters: { target_resolution: '1080p_enhance' },
        pricing_unit: 'per_second',
        price_value: 0.03,
        currency: 'USD',
        credit_cost: 0.8,
        credit_unit: 'per_second',
        status: 'verified',
      },
      {
        matchParameters: { target_resolution: '4k_upscale' },
        pricing_unit: 'per_second',
        price_value: 0.056,
        currency: 'USD',
        credit_cost: 1.5,
        credit_unit: 'per_second',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield 4K Workflow Reference (docs.higgsfield.ai/docs/models/kling-3)',
    source_url: 'https://docs.higgsfield.ai/docs/models/kling-3',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
  {
    provider: 'Higgsfield',
    model_id: 'higgsfield-ai/speak-2.0',
    model_name: 'Speak 2.0 / Dubbing Lip-Sync & Facial Enhancement',
    family: 'Higgsfield Video Enhancement',
    tier_badge: 'STANDARD',
    supported_categories: ['upscale_video', 'video_to_video'],
    description_id:
      'Sinkronisasi bibir (lip-sync) dan penyempurnaan ekspresi wajah bicara.',
    description_en:
      'Lip-sync and talking character facial expression enhancement.',
    default_quantity_type: 'asset',
    supports_duration: true,
    default_duration_seconds: 5,
    parameters: [
      {
        key: 'resolution',
        label_id: 'Resolusi',
        label_en: 'Resolution',
        type: 'select',
        options: [
          { value: '720p', label: '720p Standard (2.8 cr/dtk)' },
          { value: '1080p', label: '1080p High (4.2 cr/dtk)' },
        ],
        defaultValue: '720p',
        affectsPricing: true,
      },
    ],
    pricing_variants: [
      {
        matchParameters: { resolution: '720p' },
        pricing_unit: 'per_second',
        price_value: 0.09,
        currency: 'USD',
        credit_cost: 2.8,
        credit_unit: 'per_second',
        status: 'verified',
      },
      {
        matchParameters: { resolution: '1080p' },
        pricing_unit: 'per_second',
        price_value: 0.14,
        currency: 'USD',
        credit_cost: 4.2,
        credit_unit: 'per_second',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Public Pricing Reference (higgsfield.ai/pricing)',
    source_url: HIGGSFIELD_PRICING_URL,
    retrieved_at: CATALOG_RETRIEVED_AT,
  },

  // ============================================================================
  // BAGIAN 6: MODEL DENGAN TARIF BELUM TERVERIFIKASI / CUSTOM (PRD FR-09 & AC-09)
  // ============================================================================
  {
    provider: 'Higgsfield',
    model_id: 'custom/unverified-preview-model',
    model_name: 'Custom / Preview Model (Tarif Manual / Belum Terverifikasi)',
    family: 'Custom / Preview',
    tier_badge: 'STANDARD',
    supported_categories: [
      'text_to_image',
      'image_to_image',
      'image_to_video',
      'video_to_video',
      'text_to_video',
      'upscale_image',
      'upscale_video',
    ],
    description_id:
      'Gunakan opsi ini untuk model preview baru yang tarif resminya belum dipublikasikan (memerlukan input tarif manual sesuai PRD FR-08 & FR-09).',
    description_en:
      'Use this option for preview models whose public rate is not yet verified (requires manual rate input per PRD FR-08 & FR-09).',
    default_quantity_type: 'shot',
    supports_duration: true,
    default_duration_seconds: 5,
    parameters: [
      {
        key: 'unit_type',
        label_id: 'Satuan Perhitungan',
        label_en: 'Pricing Unit',
        type: 'select',
        options: [
          { value: 'per_generation', label: 'Per Generasi (Flat)' },
          { value: 'per_second', label: 'Per Detik Video' },
          { value: 'per_asset', label: 'Per Aset' },
        ],
        defaultValue: 'per_generation',
        affectsPricing: true,
      },
    ],
    pricing_variants: [
      {
        pricing_unit: 'per_generation',
        price_value: null, // sengaja null (Unavailable) sampai diisi user
        currency: 'USD',
        credit_cost: null,
        status: 'unavailable',
      },
    ],
    source_name: 'Menunggu Input Manual Pengguna (Tarif Publik Belum Tersedia)',
    source_url: 'https://docs.higgsfield.ai/docs/models',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
];

/**
 * Mengambil daftar model katalog yang mendukung kategori proses tertentu
 */
export function getModelsByCategory(
  category: ProcessCategory,
  catalog: CatalogModelEntry[] = HIGGSFIELD_MODEL_CATALOG
): CatalogModelEntry[] {
  return catalog.filter((m) => m.supported_categories.includes(category));
}

/**
 * Mencari model berdasarkan model_id
 */
export function getModelById(
  modelId: string,
  catalog: CatalogModelEntry[] = HIGGSFIELD_MODEL_CATALOG
): CatalogModelEntry | undefined {
  return catalog.find((m) => m.model_id === modelId);
}

/**
 * Membuat parameter default untuk sebuah model
 */
export function getDefaultParametersForModel(
  model: CatalogModelEntry
): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {};
  for (const param of model.parameters) {
    params[param.key] = param.defaultValue;
  }
  return params;
}

/**
 * Menghitung ulang seluruh harga USD di dalam katalog berdasarkan patokan USD per 1 Credit
 * (Digunakan saat pengguna memilih Paket Langganan Credit Higgsfield seperti Lite, Basic, Pro, Max, atau API)
 */
export function applyCreditPlanRateToCatalog(
  catalog: CatalogModelEntry[],
  usdPerCredit: number
): CatalogModelEntry[] {
  if (!Number.isFinite(usdPerCredit) || usdPerCredit <= 0) return catalog;
  return catalog.map((model) => {
    if (model.model_id === 'custom/unverified-preview-model') return model;
    return {
      ...model,
      pricing_variants: model.pricing_variants.map((variant) => {
        if (
          variant.credit_cost === null ||
          variant.credit_cost === undefined ||
          variant.credit_cost <= 0
        ) {
          return variant;
        }
        return {
          ...variant,
          price_value: roundUsd(variant.credit_cost * usdPerCredit),
        };
      }),
    };
  });
}

/**
 * Menentukan objek Pricing berdasarkan model dan kombinasi parameter yang dipilih
 */
export function resolveModelPricing(
  model: CatalogModelEntry,
  parameterValues: Record<string, string | number | boolean>
): Pricing {
  let matchedVariant: CatalogPricingVariant | undefined;

  for (const variant of model.pricing_variants) {
    if (!variant.matchParameters) {
      matchedVariant = variant;
      continue;
    }
    const isMatch = Object.entries(variant.matchParameters).every(
      ([key, expectedVal]) => parameterValues[key] === expectedVal
    );
    if (isMatch) {
      matchedVariant = variant;
      break;
    }
  }

  if (!matchedVariant && model.pricing_variants.length > 0) {
    matchedVariant = model.pricing_variants[0];
  }

  // Khusus untuk custom model yang mengizinkan user memilih pricing_unit lewat parameter
  const dynamicUnit =
    model.model_id === 'custom/unverified-preview-model' &&
    typeof parameterValues.unit_type === 'string'
      ? (parameterValues.unit_type as Pricing['pricing_unit'])
      : matchedVariant?.pricing_unit ?? 'per_generation';

  if (!matchedVariant || matchedVariant.price_value === null) {
    return {
      pricing_unit: dynamicUnit,
      price_value: null,
      currency: 'USD',
      credit_cost: matchedVariant?.credit_cost ?? null,
      credit_unit: matchedVariant?.credit_unit,
      source_name: model.source_name,
      source_url: model.source_url,
      retrieved_at: model.retrieved_at,
      status: 'unavailable',
    };
  }

  return {
    pricing_unit: dynamicUnit,
    price_value: matchedVariant.price_value,
    currency: 'USD',
    credit_cost: matchedVariant.credit_cost,
    credit_unit: matchedVariant.credit_unit,
    source_name: model.source_name,
    source_url: model.source_url,
    retrieved_at: model.retrieved_at,
    status: matchedVariant.status,
  };
}
