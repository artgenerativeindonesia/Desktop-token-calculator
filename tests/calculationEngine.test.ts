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

    expect(result.planned_generations).toBe(10);
    expect(result.reserve_generations).toBe(5);
    expect(result.budgeted_generations).toBe(15);
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
});
