import {
  CatalogModelEntry,
  CatalogPricingVariant,
  Pricing,
  ProcessCategory,
} from '../types/project';

export const CATALOG_RETRIEVED_AT = '2026-10-20T00:00:00.000Z';
export const HIGGSFIELD_DOCS_URL = 'https://docs.higgsfield.ai/docs/models';
export const HIGGSFIELD_PRICING_URL = 'https://higgsfield.ai/pricing';

/**
 * Katalog Model Resmi Higgsfield (PRD Bab 6 & Bab 9.1)
 * Mencakup 5 Kategori Proses AI:
 * 1. text_to_image (Text to Image)
 * 2. image_to_video (Image to Video)
 * 3. video_to_video (Video to Video)
 * 4. text_to_video (Text to Video)
 * 5. upscaling (Upscaling / Enhancement)
 */
export const HIGGSFIELD_MODEL_CATALOG: CatalogModelEntry[] = [
  // ============================================================================
  // 1. TEXT TO IMAGE
  // ============================================================================
  {
    provider: 'Higgsfield',
    model_id: 'higgsfield-ai/soul/v2/standard',
    model_name: 'SOUL V2 (Editorial & Character)',
    family: 'Higgsfield SOUL',
    supported_categories: ['text_to_image'],
    description_id: 'Generasi gambar potret, fashion, dan karakter sinematik dengan gaya SOUL V2.',
    description_en: 'Generate portraits, fashion, and cinematic character images with SOUL V2 styles.',
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
          { value: '1K', label: '1K Standard (1024px)' },
          { value: '2K', label: '2K High-Res (2048px)' },
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
    model_name: 'SOUL Cinema (Storyboard Still)',
    family: 'Higgsfield SOUL',
    supported_categories: ['text_to_image'],
    description_id: 'Generasi still frame bergaya film layar lebar dari prompt teks.',
    description_en: 'Generate cinema-inspired widescreen still frames from text prompts.',
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
          { value: '1K', label: '1K Cinema' },
          { value: '2K', label: '2K Master' },
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
  {
    provider: 'Higgsfield',
    model_id: 'recraft/v4.1',
    model_name: 'Recraft V4.1 / V4.1 Pro',
    family: 'Recraft',
    supported_categories: ['text_to_image'],
    description_id: 'Generasi desain dan aset gambar 1K/2K dengan kontrol palet warna RGB dan latar.',
    description_en: 'Generate 1K/2K design and visual assets with RGB palette and background controls.',
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
          { value: 'standard_1k', label: 'Standard (1K)' },
          { value: 'pro_2k', label: 'Pro (2K)' },
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
  {
    provider: 'Higgsfield',
    model_id: 'ideogram/v4.0',
    model_name: 'Ideogram 4.0 (Typography & Key Visual)',
    family: 'Ideogram',
    supported_categories: ['text_to_image'],
    description_id: 'Generasi poster, tipografi, dan key visual dengan kecepatan render yang dapat dipilih.',
    description_en: 'Generate posters, typography, and key visuals with selectable rendering speed.',
    default_quantity_type: 'output',
    supports_duration: false,
    default_duration_seconds: 0,
    parameters: [
      {
        key: 'rendering_speed',
        label_id: 'Kecepatan Render',
        label_en: 'Rendering Speed',
        type: 'select',
        options: [
          { value: 'turbo', label: 'Turbo' },
          { value: 'balanced', label: 'Balanced' },
          { value: 'quality', label: 'Quality' },
        ],
        defaultValue: 'balanced',
        affectsPricing: true,
      },
    ],
    pricing_variants: [
      {
        matchParameters: { rendering_speed: 'turbo' },
        pricing_unit: 'per_generation',
        price_value: 0.04,
        currency: 'USD',
        credit_cost: 1.0,
        credit_unit: 'per_generation',
        status: 'verified',
      },
      {
        matchParameters: { rendering_speed: 'balanced' },
        pricing_unit: 'per_generation',
        price_value: 0.06,
        currency: 'USD',
        credit_cost: 1.5,
        credit_unit: 'per_generation',
        status: 'verified',
      },
      {
        matchParameters: { rendering_speed: 'quality' },
        pricing_unit: 'per_generation',
        price_value: 0.09,
        currency: 'USD',
        credit_cost: 2.0,
        credit_unit: 'per_generation',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Image Catalog (docs.higgsfield.ai/docs/models/ideogram-4)',
    source_url: 'https://docs.higgsfield.ai/docs/models/ideogram-4',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },

  // ============================================================================
  // 2. IMAGE TO VIDEO & 4. TEXT TO VIDEO
  // ============================================================================
  {
    provider: 'Higgsfield',
    model_id: 'kling-video/v3.0',
    model_name: 'Kling 3.0 (Standard / Pro / 4K)',
    family: 'Kling',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id: 'Model video unggulan Kling 3.0 dengan varian Standard, Pro, dan 4K serta opsi audio native.',
    description_en: 'Flagship Kling 3.0 video generation with Standard, Pro, and 4K variants plus native sound.',
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
          { value: '720p_std', label: 'Standard 720p' },
          { value: '1080p_pro', label: 'Pro 1080p' },
          { value: '4k_ultra', label: 'Ultra 4K' },
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
        credit_cost: 1.4, // ~7 credits per 5s clip
        credit_unit: 'per_second',
        status: 'verified',
      },
      {
        matchParameters: { resolution: '1080p_pro' },
        pricing_unit: 'per_second',
        price_value: 0.084,
        currency: 'USD',
        credit_cost: 2.0, // ~10 credits per 5s clip
        credit_unit: 'per_second',
        status: 'verified',
      },
      {
        matchParameters: { resolution: '4k_ultra' },
        pricing_unit: 'per_second',
        price_value: 0.14,
        currency: 'USD',
        credit_cost: 3.5,
        credit_unit: 'per_second',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Kling 3.0 Docs & Published Pricing (docs.higgsfield.ai/docs/models/kling-3)',
    source_url: 'https://docs.higgsfield.ai/docs/models/kling-3/standard-text-to-video',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
  {
    provider: 'Higgsfield',
    model_id: 'bytedance/seedance-2.5',
    model_name: 'Seedance 2.5 (Multimodal Cinema)',
    family: 'Seedance',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id: 'Generasi video sinematik fidelitas tinggi dari teks atau referensi gambar/video.',
    description_en: 'High-fidelity cinematic video generation from text or multimodal references.',
    default_quantity_type: 'shot',
    supports_duration: true,
    default_duration_seconds: 8,
    parameters: [
      {
        key: 'resolution',
        label_id: 'Resolusi Output',
        label_en: 'Output Resolution',
        type: 'select',
        options: [
          { value: '720p', label: '720p HD' },
          { value: '1080p', label: '1080p Full HD' },
        ],
        defaultValue: '720p',
        affectsPricing: true,
      },
      {
        key: 'aspect_ratio',
        label_id: 'Rasio Aspek',
        label_en: 'Aspect Ratio',
        type: 'select',
        options: [
          { value: '16:9', label: '16:9' },
          { value: '9:16', label: '9:16' },
        ],
        defaultValue: '16:9',
        affectsPricing: false,
      },
    ],
    pricing_variants: [
      {
        matchParameters: { resolution: '720p' },
        pricing_unit: 'per_second',
        price_value: 0.141,
        currency: 'USD',
        credit_cost: 6.5, // ~52 credits per 8s clip
        credit_unit: 'per_second',
        status: 'verified',
      },
      {
        matchParameters: { resolution: '1080p' },
        pricing_unit: 'per_second',
        price_value: 0.206,
        currency: 'USD',
        credit_cost: 9.0, // ~72 credits per 8s clip
        credit_unit: 'per_second',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Seedance 2.5 API Docs (docs.higgsfield.ai/docs/models/seedance-2-5)',
    source_url: 'https://docs.higgsfield.ai/docs/models/seedance-2-5',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
  {
    provider: 'Higgsfield',
    model_id: 'bytedance/seedance-2.0',
    model_name: 'Seedance 2.0',
    family: 'Seedance',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id: 'Generasi video dari teks atau frame awal/akhir dengan gerak kamera halus.',
    description_en: 'Generate videos from text or start/end frames with smooth camera motion.',
    default_quantity_type: 'shot',
    supports_duration: true,
    default_duration_seconds: 5,
    parameters: [
      {
        key: 'resolution',
        label_id: 'Resolusi Output',
        label_en: 'Output Resolution',
        type: 'select',
        options: [
          { value: '720p', label: '720p HD' },
          { value: '1080p', label: '1080p Full HD' },
        ],
        defaultValue: '720p',
        affectsPricing: true,
      },
    ],
    pricing_variants: [
      {
        matchParameters: { resolution: '720p' },
        pricing_unit: 'per_second',
        price_value: 0.14,
        currency: 'USD',
        credit_cost: 4.5, // ~22.5 credits per 5s clip
        credit_unit: 'per_second',
        status: 'verified',
      },
      {
        matchParameters: { resolution: '1080p' },
        pricing_unit: 'per_second',
        price_value: 0.18,
        currency: 'USD',
        credit_cost: 9.0, // ~45 credits per 5s clip
        credit_unit: 'per_second',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Seedance 2.0 API Docs (docs.higgsfield.ai/docs/models/seedance-2)',
    source_url: 'https://docs.higgsfield.ai/docs/models/seedance-2',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
  {
    provider: 'Higgsfield',
    model_id: 'alibaba/wan-3.0-prime',
    model_name: 'Wan 3.0 / Wan 3.0 Prime',
    family: 'Alibaba Wan',
    supported_categories: ['text_to_video', 'image_to_video'],
    description_id: 'Generasi video efisien dari teks, frame, atau referensi multimodal.',
    description_en: 'Cost-efficient video generation from text, frames, or multimodal references.',
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
          { value: 'wan_3_std', label: 'Wan 3.0 Standard (720p)' },
          { value: 'wan_3_prime', label: 'Wan 3.0 Prime (1080p)' },
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
        credit_cost: 1.6, // ~8 credits per 5s clip
        credit_unit: 'per_second',
        status: 'verified',
      },
      {
        matchParameters: { variant: 'wan_3_prime' },
        pricing_unit: 'per_second',
        price_value: 0.068,
        currency: 'USD',
        credit_cost: 2.6, // ~13 credits per 5s clip
        credit_unit: 'per_second',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Wan 3.0 Docs (docs.higgsfield.ai/docs/models/wan-3-prime)',
    source_url: 'https://docs.higgsfield.ai/docs/models/wan-3-prime',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },
  {
    provider: 'Higgsfield',
    model_id: 'higgsfield-ai/cinema-studio-4.0',
    model_name: 'Cinema Studio 4.0 (Camera & Lens Control)',
    family: 'Higgsfield Native',
    supported_categories: ['image_to_video', 'text_to_video'],
    description_id: 'Pembuatan shot video dengan kontrol pergerakan kamera, lensa sinema, dan pencahayaan.',
    description_en: 'Create video shots with dedicated camera movement, cinema lens, and style controls.',
    default_quantity_type: 'shot',
    supports_duration: true,
    default_duration_seconds: 5,
    parameters: [
      {
        key: 'resolution',
        label_id: 'Resolusi Sinema',
        label_en: 'Cinema Resolution',
        type: 'select',
        options: [
          { value: '720p', label: '720p Preview' },
          { value: '1080p', label: '1080p Production' },
        ],
        defaultValue: '1080p',
        affectsPricing: true,
      },
    ],
    pricing_variants: [
      {
        matchParameters: { resolution: '720p' },
        pricing_unit: 'per_second',
        price_value: 0.12,
        currency: 'USD',
        credit_cost: 5.0, // ~25 credits per 5s clip
        credit_unit: 'per_second',
        status: 'verified',
      },
      {
        matchParameters: { resolution: '1080p' },
        pricing_unit: 'per_second',
        price_value: 0.24,
        currency: 'USD',
        credit_cost: 10.0, // ~50 credits per 5s clip
        credit_unit: 'per_second',
        status: 'verified',
      },
    ],
    source_name: 'Higgsfield Cinema Studio 4.0 Reference (docs.higgsfield.ai/docs/models/cinema-studio-4)',
    source_url: 'https://docs.higgsfield.ai/docs/models/cinema-studio-4',
    retrieved_at: CATALOG_RETRIEVED_AT,
  },

  // ============================================================================
  // 3. VIDEO TO VIDEO
  // ============================================================================
  {
    provider: 'Higgsfield',
    model_id: 'higgsfield-ai/genjutsu',
    model_name: 'Genjutsu (Motion Transfer & Restyle)',
    family: 'Higgsfield Native',
    supported_categories: ['video_to_video'],
    description_id: 'Transfer gerak, penggantian objek, atau restyle penuh dari video sumber.',
    description_en: 'Transfer motion, replace objects, or restyle a source video.',
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
          { value: 'motion_transfer', label: 'Motion Transfer' },
          { value: 'object_replace', label: 'Object Replace' },
          { value: 'video_restyle', label: 'Full Video Restyle' },
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
  {
    provider: 'Higgsfield',
    model_id: 'kling-video/v3.0-motion-control',
    model_name: 'Kling 3.0 Motion Control',
    family: 'Kling',
    supported_categories: ['video_to_video'],
    description_id: 'Terapkan gerakan dari video sumber ke karakter/aset dengan pemrosesan Standard atau Pro.',
    description_en: 'Apply motion from a source video to a target with Standard or Pro processing.',
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
          { value: 'standard', label: 'Standard' },
          { value: 'pro', label: 'Pro' },
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
    supported_categories: ['video_to_video'],
    description_id: 'Edit dan perluas video menggunakan referensi video dan gambar.',
    description_en: 'Create and edit videos with first/last frames and video references.',
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
          { value: 'video_ref', label: 'Video Reference' },
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

  // ============================================================================
  // 5. UPSCALING / ENHANCEMENT
  // ============================================================================
  {
    provider: 'Higgsfield',
    model_id: 'higgsfield-ai/video-upscale-4k',
    model_name: 'Higgsfield 4K Video Upscaler & Enhancer',
    family: 'Higgsfield Enhancement',
    supported_categories: ['upscaling'],
    description_id: 'Peningkatan resolusi dan ketajaman klip video hingga 4K.',
    description_en: 'Upscale and enhance generated video clips up to 4K resolution.',
    default_quantity_type: 'asset',
    supports_duration: true,
    default_duration_seconds: 5,
    parameters: [
      {
        key: 'target_resolution',
        label_id: 'Target Resolusi',
        label_en: 'Target Resolution',
        type: 'select',
        options: [
          { value: '1080p_enhance', label: '1080p Detail Enhance' },
          { value: '4k_upscale', label: '4K Cinema Upscale' },
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
    model_id: 'recraft/v4.1-utility-pro',
    model_name: 'Recraft V4.1 Utility Pro (2K Image Upscale & Clean)',
    family: 'Recraft',
    supported_categories: ['upscaling'],
    description_id: 'Upscale gambar ke 2K dan pembersihan latar belakang presisi.',
    description_en: 'Upscale still images to 2K resolution with precision background utility.',
    default_quantity_type: 'asset',
    supports_duration: false,
    default_duration_seconds: 0,
    parameters: [
      {
        key: 'output_quality',
        label_id: 'Kualitas Target',
        label_en: 'Target Quality',
        type: 'select',
        options: [
          { value: '1K_utility', label: '1K Utility' },
          { value: '2K_pro', label: '2K Utility Pro' },
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
    model_id: 'higgsfield-ai/speak-2.0',
    model_name: 'Speak 2.0 (Lip-Sync & Voice Enhancement)',
    family: 'Higgsfield Enhancement',
    supported_categories: ['upscaling', 'video_to_video'],
    description_id: 'Sinkronisasi bibir (lip-sync) dan penyempurnaan ekspresi wajah bicara.',
    description_en: 'Lip-sync and talking character facial expression enhancement.',
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
          { value: '720p', label: '720p Standard' },
          { value: '1080p', label: '1080p High' },
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
        credit_cost: 2.8, // ~14 credits per 5s clip
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
  // MODEL DENGAN TARIF BELUM TERVERIFIKASI / CUSTOM (PRD FR-09 & AC-09)
  // ============================================================================
  {
    provider: 'Higgsfield',
    model_id: 'custom/unverified-preview-model',
    model_name: 'Custom / Preview Model (Tarif Manual / Belum Terverifikasi)',
    family: 'Custom / Preview',
    supported_categories: [
      'text_to_image',
      'image_to_video',
      'video_to_video',
      'text_to_video',
      'upscaling',
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
