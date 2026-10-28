import { describe, expect, it } from 'vitest';
import {
  calculateBidirectionalReserve,
  calculateProjectBudget,
  createPrdSyntheticTestProject,
  createProductionItemFromCatalog,
  createSampleCommercialProject,
} from '../src/shared/engine/calculationEngine';
import {
  BudgetAssumptions,
  ExchangeRate,
  ProductionItem,
} from '../src/shared/types/project';

describe('Calculation Engine — PRD Bab 8 Mathematical Rules & Acceptance Criteria', () => {
  const validExchangeRate: ExchangeRate = {
    base_currency: 'USD',
    quote_currency: 'IDR',
    rate: 16000,
    rate_type: 'ECB Reference Rate',
    source_name: 'Frankfurter API',
    source_url: 'https://api.frankfurter.dev/latest?from=USD&to=IDR',
    retrieved_at: '2026-10-20T00:00:00.000Z',
    status: 'verified',
  };

  it('PRD Bab 8.10: Contoh Uji Matematika Sintetis menghasilkan angka eksak', () => {
    const project = createPrdSyntheticTestProject(validExchangeRate);
    const calc = project.calculation;

    // Gplanned = 10
    expect(calc.planned_generations).toBe(10);
    // Cadangan 20% -> ceil(10 * 0.20) = 2
    expect(calc.reserve_generations).toBe(2);
    // Total generasi dianggarkan = 12
    expect(calc.budgeted_generations).toBe(12);
    // Tarif sintetis = USD 2 per generasi -> Biaya dasar = USD 20, Cadangan = USD 4, Total = USD 24
    expect(calc.base_cost_usd).toBe(20);
    expect(calc.reserve_cost_usd).toBe(4);
    expect(calc.total_cost_usd).toBe(24);
    // Konversi IDR dengan kurs 16.000: 24 * 16.000 = 384.000
    expect(calc.total_cost_idr).toBe(384000);
    expect(calc.is_complete).toBe(true);
  });

  it('Sinkronisasi 2 Arah Cadangan Regenerasi (Persentase R <-> Jumlah Generasi Cadangan Greserve)', () => {
    // 1. Input Persentase -> Hitung Jumlah Generasi Cadangan dengan ceil()
    const fromPercent = calculateBidirectionalReserve(15, 'percent', 25, 0);
    // ceil(15 * 0.25) = ceil(3.75) = 4
    expect(fromPercent.plannedGenerations).toBe(15);
    expect(fromPercent.reserveGenerations).toBe(4);
    expect(fromPercent.budgetedGenerations).toBe(19);
    expect(fromPercent.effectiveReservePercent).toBe(25);

    // 2. Input Jumlah Generasi Cadangan -> Hitung Persentase Otomatis
    const fromCount = calculateBidirectionalReserve(20, 'count', 0, 5);
    // (5 / 20) * 100 = 25%
    expect(fromCount.plannedGenerations).toBe(20);
    expect(fromCount.reserveGenerations).toBe(5);
    expect(fromCount.budgetedGenerations).toBe(25);
    expect(fromCount.effectiveReservePercent).toBe(25);
  });

  it('AC-06: Cadangan tidak dihitung ganda pada mode count maupun percent di multi-item', () => {
    const itemA = createProductionItemFromCatalog(
      'text_to_image',
      'recraft/v4.1',
      'Shot A',
      3,
      2
    ); // Gplanned = 6
    const itemB = createProductionItemFromCatalog(
      'text_to_image',
      'recraft/v4.1',
      'Shot B',
      2,
      2
    ); // Gplanned = 4

    const assumptionsCountMode: BudgetAssumptions = {
      estimation_mode: 'per_shot',
      target_videos: 2,
      final_duration_minutes: 1.5,
      default_shots_per_video: 5,
      default_attempts_per_shot: 2,
      reserve_input_mode: 'count',
      reserve_percent: 0,
      reserve_generations_override: 5, // user menginput tepat 5 generasi cadangan
    };

    const result = calculateProjectBudget(
      [itemA, itemB],
      assumptionsCountMode,
      validExchangeRate
    );

    // Proyeksi 1 video (Langkah 3)
    expect(result.one_video_planned_generations).toBe(10);
    expect(result.one_video_reserve_generations).toBe(5);
    expect(result.one_video_budgeted_generations).toBe(15);

    // Total keseluruhan proyek untuk 2 video (Langkah 2: target_videos = 2)
    expect(result.planned_generations).toBe(20);
    expect(result.reserve_generations).toBe(10);
    expect(result.budgeted_generations).toBe(30);
    expect(result.effective_reserve_percent).toBe(50);
  });

  it('PRD Bab 8.4 & 8.5: Mendukung satuan per_second dan menghitung Credit dengan benar (AC-07)', () => {
    const videoItem = createProductionItemFromCatalog(
      'text_to_video',
      'kling-video/v3.0',
      'Kling 5s Shot',
      2, // 2 shot
      2, // 2 percobaan/shot -> Gplanned = 4
      5 // durasi 5 detik
    );

    const assumptions: BudgetAssumptions = {
      estimation_mode: 'per_shot',
      target_videos: 1,
      final_duration_minutes: 0.5,
      default_shots_per_video: 2,
      default_attempts_per_shot: 2,
      reserve_input_mode: 'percent',
      reserve_percent: 25, // Greserve = ceil(4 * 0.25) = 1 -> Gbudget = 5
      reserve_generations_override: 1,
    };

    const calc = calculateProjectBudget([videoItem], assumptions, validExchangeRate);
    // Kling 3.0 720p_std: $0.07/detik, 1.4 credit/detik
    // Base cost = 4 generasi * 5 detik * $0.07 = $1.40
    // Reserve cost = 1 generasi * 5 detik * $0.07 = $0.35
    // Total cost = $1.75
    expect(calc.base_cost_usd).toBe(1.4);
    expect(calc.reserve_cost_usd).toBe(0.35);
    expect(calc.total_cost_usd).toBe(1.75);
    // Total credit = 5 generasi dianggarkan * 5 detik * 1.4 credit = 35 credits
    expect(calc.total_credit).toBe(35);
  });

  it('FR-09 & AC-09: Item dengan tarif Unavailable tidak dianggap gratis ($0) dan menandai total sebagai belum lengkap', () => {
    const validItem = createProductionItemFromCatalog(
      'text_to_image',
      'recraft/v4.1',
      'Valid Image',
      2,
      1
    ); // $0.04 * 2 = $0.08
    const unverifiedItem = createProductionItemFromCatalog(
      'text_to_video',
      'custom/unverified-preview-model',
      'Unverified Video Model',
      3,
      2
    );

    const assumptions: BudgetAssumptions = {
      estimation_mode: 'per_shot',
      target_videos: 1,
      final_duration_minutes: 1,
      default_shots_per_video: 5,
      default_attempts_per_shot: 1,
      reserve_input_mode: 'percent',
      reserve_percent: 0,
      reserve_generations_override: 0,
    };

    const calc = calculateProjectBudget(
      [validItem, unverifiedItem],
      assumptions,
      validExchangeRate
    );

    expect(calc.is_complete).toBe(false);
    expect(calc.incomplete_item_count).toBe(1);
    expect(calc.item_results[1].base_cost_usd).toBeNull();
    expect(calc.item_results[1].total_cost_usd).toBeNull();
    expect(
      calc.warnings.some((w) => w.code === 'UNAVAILABLE_PRICE')
    ).toBe(true);
  });

  it('PRD Bab 8.7 & 8.9: Pembagian dengan nol pada V=0 atau M=0 ditangani dengan aman (mengembalikan null)', () => {
    const sample = createSampleCommercialProject(validExchangeRate);
    const zeroDivisorAssumptions: BudgetAssumptions = {
      ...sample.assumptions,
      target_videos: 0,
      final_duration_minutes: 0,
    };

    const calc = calculateProjectBudget(
      sample.items,
      zeroDivisorAssumptions,
      validExchangeRate
    );

    expect(calc.cost_per_video_usd).toBeNull();
    expect(calc.cost_per_video_idr).toBeNull();
    expect(calc.cost_per_minute_usd).toBeNull();
    expect(calc.cost_per_minute_idr).toBeNull();
    expect(calc.warnings.some((w) => w.code === 'ZERO_DIVISOR_VIDEO')).toBe(true);
    expect(calc.warnings.some((w) => w.code === 'ZERO_DIVISOR_MINUTE')).toBe(true);
  });

  it('AC-02: Proyek komersial mendukung seluruh 7 kategori proses AI secara simultan', () => {
    const sample = createSampleCommercialProject(validExchangeRate);
    const categoriesPresent = new Set(sample.items.map((i) => i.category));

    expect(categoriesPresent.has('text_to_image')).toBe(true);
    expect(categoriesPresent.has('image_to_image')).toBe(true);
    expect(categoriesPresent.has('image_to_video')).toBe(true);
    expect(categoriesPresent.has('video_to_video')).toBe(true);
    expect(categoriesPresent.has('text_to_video')).toBe(true);
    expect(categoriesPresent.has('upscale_image')).toBe(true);
    expect(categoriesPresent.has('upscale_video')).toBe(true);
    expect(sample.calculation.is_complete).toBe(true);
    expect(sample.calculation.total_cost_usd).toBeGreaterThan(0);
  });

  it('Edge Case: Daftar item kosong (items: []) menghasilkan status aman dan biaya 0 tanpa crash', () => {
    const assumptions: BudgetAssumptions = {
      estimation_mode: 'per_shot',
      target_videos: 3,
      final_duration_minutes: 2,
      default_shots_per_video: 5,
      default_attempts_per_shot: 2,
      reserve_input_mode: 'percent',
      reserve_percent: 20,
      reserve_generations_override: 0,
    };

    const calc = calculateProjectBudget([], assumptions, validExchangeRate);

    expect(calc.is_complete).toBe(false);
    expect(calc.planned_generations).toBe(0);
    expect(calc.reserve_generations).toBe(0);
    expect(calc.budgeted_generations).toBe(0);
    expect(calc.base_cost_usd).toBe(0);
    expect(calc.total_cost_usd).toBe(0);
    expect(calc.total_cost_idr).toBe(0);
    expect(calc.item_results).toHaveLength(0);
    expect(calc.cost_per_video_usd).toBe(0);
    expect(calc.cost_per_minute_usd).toBe(0);
  });

  it('Edge Case: Durasi klip bernilai ganjil dan desimal (3.5s & 7s) dengan tarif per_second dihitung presisi', () => {
    const decimalClipItem = createProductionItemFromCatalog(
      'text_to_video',
      'kling-video/v3.0',
      'Shot Desimal 3.5s',
      2, // 2 shot
      1, // 1 attempt -> Gplanned = 2
      3.5 // 3.5 detik per shot
    );

    const oddClipItem = createProductionItemFromCatalog(
      'text_to_video',
      'kling-video/v3.0',
      'Shot Ganjil 7s',
      1, // 1 shot
      2, // 2 attempt -> Gplanned = 2
      7 // 7 detik per shot
    );

    const assumptions: BudgetAssumptions = {
      estimation_mode: 'per_shot',
      target_videos: 1,
      final_duration_minutes: 0.5,
      default_shots_per_video: 3,
      default_attempts_per_shot: 1,
      reserve_input_mode: 'percent',
      reserve_percent: 0,
      reserve_generations_override: 0,
    };

    const calc = calculateProjectBudget(
      [decimalClipItem, oddClipItem],
      assumptions,
      validExchangeRate
    );

    // Kling 3.0: $0.07/detik, 1.4 credit/detik
    // decimalClipItem: 2 gen * 3.5s * $0.07 = $0.49; Credit = 2 * 3.5 * 1.4 = 9.8 credits
    // oddClipItem: 2 gen * 7s * $0.07 = $0.98; Credit = 2 * 7 * 1.4 = 19.6 credits
    // Total USD = 0.49 + 0.98 = 1.47 USD
    // Total Credit = 9.8 + 19.6 = 29.4 credits
    expect(calc.item_results[0].base_cost_usd).toBe(0.49);
    expect(calc.item_results[0].total_cost_usd).toBe(0.49);
    expect(calc.item_results[0].total_credit).toBe(9.8);

    expect(calc.item_results[1].base_cost_usd).toBe(0.98);
    expect(calc.item_results[1].total_cost_usd).toBe(0.98);
    expect(calc.item_results[1].total_credit).toBe(19.6);

    expect(calc.total_cost_usd).toBe(1.47);
    expect(calc.total_cost_idr).toBe(1.47 * 16000); // 23520
    expect(calc.total_credit).toBe(29.4);
    expect(calc.is_complete).toBe(true);
  });

  it('Soliditas Multi-Video: Skala perkalian V=3 dan V=10 konsisten secara proporsional antara 1 Video dan Grand Total', () => {
    const project = createPrdSyntheticTestProject(validExchangeRate);

    // Kasus 1: V = 3 video
    const assumptionsV3: BudgetAssumptions = {
      ...project.assumptions,
      target_videos: 3,
    };
    const calcV3 = calculateProjectBudget(
      project.items,
      assumptionsV3,
      validExchangeRate
    );

    // 1 video: base = $20, reserve = $4, total = $24
    expect(calcV3.target_videos).toBe(3);
    expect(calcV3.one_video_planned_generations).toBe(10);
    expect(calcV3.one_video_reserve_generations).toBe(2);
    expect(calcV3.one_video_budgeted_generations).toBe(12);
    expect(calcV3.one_video_base_cost_usd).toBe(20);
    expect(calcV3.one_video_reserve_cost_usd).toBe(4);
    expect(calcV3.one_video_total_cost_usd).toBe(24);
    expect(calcV3.one_video_total_cost_idr).toBe(384000);

    // Grand total untuk 3 video:
    expect(calcV3.planned_generations).toBe(30);
    expect(calcV3.reserve_generations).toBe(6);
    expect(calcV3.budgeted_generations).toBe(36);
    expect(calcV3.base_cost_usd).toBe(60);
    expect(calcV3.reserve_cost_usd).toBe(12);
    expect(calcV3.total_cost_usd).toBe(72);
    expect(calcV3.total_cost_idr).toBe(1152000);
    expect(calcV3.cost_per_video_usd).toBe(24);
    expect(calcV3.cost_per_video_idr).toBe(384000);

    // Kasus 2: V = 10 video
    const assumptionsV10: BudgetAssumptions = {
      ...project.assumptions,
      target_videos: 10,
    };
    const calcV10 = calculateProjectBudget(
      project.items,
      assumptionsV10,
      validExchangeRate
    );

    expect(calcV10.target_videos).toBe(10);
    expect(calcV10.planned_generations).toBe(100);
    expect(calcV10.reserve_generations).toBe(20);
    expect(calcV10.budgeted_generations).toBe(120);
    expect(calcV10.total_cost_usd).toBe(240);
    expect(calcV10.total_cost_idr).toBe(3840000);
  });

  it('v1.9.0 Fitur Shot Utama vs Aset Pendukung: Menghitung kuantitas shot utama dan aset pendukung secara akurat', () => {
    // 1 video memiliki:
    // - 4 shot Image-to-Video (Shot Utama default = true)
    // - 2 shot Text-to-Video (Shot Utama default = true)
    // - 3 gambar Image-to-Image (Aset Pendukung default = false)
    // - 1 upscale image (Aset Pendukung default = false)
    // Total 1 video: 6 Shot Utama + 4 Aset Pendukung = 10 item
    const i2v = createProductionItemFromCatalog('image_to_video', 'kling-video/v3.0', 'Shot 1', 4, 1);
    const t2v = createProductionItemFromCatalog('text_to_video', 'bytedance/seedance-2.5', 'Shot 2', 2, 1);
    const i2i = createProductionItemFromCatalog('image_to_image', 'higgsfield-ai/soul/v2/reference', 'Aset 1', 3, 1);
    const up = createProductionItemFromCatalog('upscale_image', 'recraft/v4.1-utility-pro', 'Aset 2', 1, 1);

    expect(i2v.is_primary_shot).toBe(true);
    expect(t2v.is_primary_shot).toBe(true);
    expect(i2i.is_primary_shot).toBe(false);
    expect(up.is_primary_shot).toBe(false);

    const assumptionsV3: BudgetAssumptions = {
      estimation_mode: 'per_shot',
      target_videos: 3,
      final_duration_minutes: 1,
      default_shots_per_video: 6,
      default_attempts_per_shot: 1,
      reserve_input_mode: 'percent',
      reserve_percent: 0,
      reserve_generations_override: 0,
    };

    const calc = calculateProjectBudget([i2v, t2v, i2i, up], assumptionsV3, validExchangeRate);

    // 1 Video
    expect(calc.one_video_primary_shot_count).toBe(6);
    expect(calc.one_video_supporting_asset_count).toBe(4);

    // Total 3 Video: 6 * 3 = 18 shot utama, 4 * 3 = 12 aset pendukung
    expect(calc.total_primary_shots).toBe(18);
    expect(calc.total_supporting_assets).toBe(12);

    // Override manual: ubah i2i menjadi Shot Utama
    const i2iManualPrimary = { ...i2i, is_primary_shot: true };
    const calcManual = calculateProjectBudget([i2v, t2v, i2iManualPrimary, up], assumptionsV3, validExchangeRate);

    // Sekarang 4 + 2 + 3 = 9 Shot Utama, 1 Aset Pendukung
    expect(calcManual.one_video_primary_shot_count).toBe(9);
    expect(calcManual.one_video_supporting_asset_count).toBe(1);
    expect(calcManual.total_primary_shots).toBe(27);
    expect(calcManual.total_supporting_assets).toBe(3);
  });
});
