import {
  BudgetAssumptions,
  CURRENT_SCHEMA_VERSION,
  ExchangeRate,
  ProductionItem,
  ProjectFile,
} from '../types/project';
import { CATALOG_RETRIEVED_AT } from '../catalog/higgsfieldCatalog';
import {
  calculateProjectBudget,
  createProductionItemFromCatalog,
} from '../engine/calculationEngine';

/**
 * ============================================================================
 * CONTOH PROYEK UJI SINTETIS PRD BAB 8.10
 * ============================================================================
 * Spesifikasi acuan uji:
 * - 5 shot x 2 percobaan = 10 generasi terencana (dasar)
 * - Cadangan = 20% -> ceil(10 * 0.20) = 2
 * - Total generasi dianggarkan = 12
 * - Tarif sintetis untuk uji = USD 2 per generasi
 * - Biaya dasar = USD 20, Biaya cadangan = USD 4, Total = USD 24
 */
export function createPrdSyntheticTestProject(
  currentExchangeRate?: ExchangeRate
): ProjectFile {
  const now = new Date().toISOString();
  const fx: ExchangeRate = currentExchangeRate ?? {
    base_currency: 'USD',
    quote_currency: 'IDR',
    rate: 16250,
    rate_type: 'Manual Input (Contoh Uji PRD)',
    source_name: 'Input Uji Sintetis PRD Bab 8.10',
    source_url: 'local://prd-section-8.10',
    retrieved_at: now,
    status: 'manual',
  };

  const assumptions: BudgetAssumptions = {
    estimation_mode: 'per_shot',
    target_videos: 1,
    final_duration_minutes: 1,
    default_shots_per_video: 5,
    default_attempts_per_shot: 2,
    reserve_input_mode: 'percent',
    reserve_percent: 20,
    reserve_generations_override: 2,
  };

  const items: ProductionItem[] = [
    {
      item_id: 'prd_test_item_1',
      category: 'text_to_video',
      label: 'Uji Matematika Sintetis PRD Bab 8.10 (10 Generasi Dasar)',
      quantity: 5, // S = 5 shot
      quantity_type: 'shot',
      duration_seconds: 5,
      attempts_per_item: 2, // A = 2 percobaan/shot -> Gplanned = 10
      use_project_target_multiplier: false,
      model_selection: {
        provider: 'Higgsfield',
        model_id: 'kling-video/v3.0',
        model_name: 'Model Uji Sintetis PRD Bab 8.10',
        category: 'text_to_video',
        parameter_values: { resolution: '720p_std', sound: 'on', aspect_ratio: '16:9' },
      },
      pricing: {
        pricing_unit: 'per_generation',
        price_value: 2.0, // USD 2 per generasi sesuai tabel PRD Bab 8.10
        currency: 'USD',
        credit_cost: 10,
        credit_unit: 'per_generation',
        source_name: 'Contoh Uji Sintetis PRD Bab 8.10 (Bukan Tarif Aktual)',
        source_url: 'local://prd-section-8.10',
        retrieved_at: now,
        status: 'manual',
      },
      notes: 'Angka tarif USD 2 per generasi sesuai contoh uji sintetis PRD Halaman 12.',
    },
  ];

  const calculation = calculateProjectBudget(items, assumptions, fx);

  return {
    schema_version: CURRENT_SCHEMA_VERSION,
    project_id: 'proj_prd_synthetic_8_10',
    project_name: 'Proyek Uji Matematika Sintetis (PRD Bab 8.10)',
    created_at: now,
    updated_at: now,
    currency: 'USD',
    language: 'id',
    assumptions,
    items,
    exchange_rate: fx,
    calculation,
    export_settings: {
      report_title: 'Laporan Uji Matematika Sintetis PRD Bab 8.10',
      export_date: now.slice(0, 10),
      export_language: 'id',
      prepared_by: 'QA / Produser Video AI',
      client_or_team_name: 'Tim Internal Produksi AI',
      included_sections: {
        executive_summary: true,
        production_assumptions: true,
        stage_breakdown: true,
        credit_breakdown: true,
        exchange_rate_info: true,
        warnings_and_audit: true,
        unit_cost_metrics: true,
      },
    },
  };
}

/**
 * Membuat Proyek Contoh Produksi Komersial Lengkap (Mencakup ke-5 Kategori Proses AI)
 */
export function createSampleCommercialProject(
  currentExchangeRate?: ExchangeRate
): ProjectFile {
  const now = new Date().toISOString();
  const fx: ExchangeRate = currentExchangeRate ?? {
    base_currency: 'USD',
    quote_currency: 'IDR',
    rate: 16250,
    rate_type: 'ECB Reference Rate (Cached Default)',
    source_name: 'Frankfurter API (European Central Bank)',
    source_url: 'https://api.frankfurter.dev/latest?from=USD&to=IDR',
    retrieved_at: CATALOG_RETRIEVED_AT,
    status: 'stale',
  };

  const assumptions: BudgetAssumptions = {
    estimation_mode: 'per_shot',
    target_videos: 1,
    final_duration_minutes: 1.5,
    default_shots_per_video: 6,
    default_attempts_per_shot: 2,
    reserve_input_mode: 'count',
    reserve_percent: 0,
    reserve_generations_override: 0,
  };

  const item1 = createProductionItemFromCatalog(
    'text_to_image',
    'higgsfield-ai/soul/v2/standard',
    'Tahap 1: Key Visual & Karakter Utama (SOUL V2)',
    4,
    2,
    0
  );
  item1.item_id = 'sample_item_t2i';

  const item1b = createProductionItemFromCatalog(
    'image_to_image',
    'higgsfield-ai/soul/v2/reference',
    'Tahap 2: Variasi Pose & Gaya Karakter (Image to Image)',
    3,
    2,
    0
  );
  item1b.item_id = 'sample_item_i2i';

  const item2 = createProductionItemFromCatalog(
    'image_to_video',
    'kling-video/v3.0',
    'Tahap 3: Animasi Shot Produk & Karakter (Kling 3.0)',
    4,
    2,
    5
  );
  item2.item_id = 'sample_item_i2v';

  const item3 = createProductionItemFromCatalog(
    'text_to_video',
    'bytedance/seedance-2.5',
    'Tahap 4: B-Roll Sinematik Drone & Lingkungan (Seedance 2.5)',
    2,
    2,
    8
  );
  item3.item_id = 'sample_item_t2v';

  const item4 = createProductionItemFromCatalog(
    'video_to_video',
    'higgsfield-ai/genjutsu',
    'Tahap 5: Motion Transfer & VFX Restyle (Genjutsu)',
    2,
    2,
    5
  );
  item4.item_id = 'sample_item_v2v';

  const item5 = createProductionItemFromCatalog(
    'upscale_image',
    'recraft/v4.1-utility-pro',
    'Tahap 6: Upscale Image Key Visual ke 2K (Recraft Utility Pro)',
    4,
    2,
    0
  );
  item5.item_id = 'sample_item_upscale_img';

  const item6 = createProductionItemFromCatalog(
    'upscale_video',
    'higgsfield-ai/video-upscale-4k',
    'Tahap 7: Mastering Final 4K Upscale Video',
    6,
    2,
    5
  );
  item6.item_id = 'sample_item_upscale_vid';

  const items = [item1, item1b, item2, item3, item4, item5, item6];
  const calculation = calculateProjectBudget(items, assumptions, fx);

  return {
    schema_version: CURRENT_SCHEMA_VERSION,
    project_id: `proj_${Date.now()}`,
    project_name: 'Kampanye Video Iklan Komersial AI 2026',
    created_at: now,
    updated_at: now,
    currency: 'USD',
    language: 'id',
    assumptions,
    items,
    exchange_rate: fx,
    calculation,
    export_settings: {
      report_title: 'Estimasi Anggaran Produksi Video AI - Kampanye Komersial',
      export_date: now.slice(0, 10),
      export_language: 'id',
      prepared_by: 'Produser Video AI',
      client_or_team_name: 'Tim Kreatif & Produksi',
      included_sections: {
        executive_summary: true,
        production_assumptions: true,
        stage_breakdown: true,
        credit_breakdown: true,
        exchange_rate_info: true,
        warnings_and_audit: true,
        unit_cost_metrics: true,
      },
    },
  };
}
