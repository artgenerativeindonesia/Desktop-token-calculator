import { describe, it, expect } from 'vitest';
import {
  SUNO_MODELS_CATALOG,
  SUNO_SUBSCRIPTION_PLANS,
  SUNO_AS_CATALOG_MODELS,
  getSunoModelById,
  getSunoPlanById,
  calculateSunoCredits,
  calculateSunoCostUsd,
  calculateSunoCostIdr,
  applySunoPlanRateToCatalog,
  fetchSunoCatalogAuto,
} from '../src/shared/catalog/sunoCatalog';
import {
  calculateProjectBudget,
  createProductionItemFromCatalog,
} from '../src/shared/engine/calculationEngine';
import {
  ExchangeRate,
  ProductionItem,
} from '../src/shared/types/project';

describe('Suno AI Music Generator — Official Catalog & Engine Suite (Tahap 4)', () => {
  describe('1. Model Catalog Integrity', () => {
    it('memuat model resmi Suno v4, v3.5, v3, v6 mini, dan v6', () => {
      const modelIds = SUNO_MODELS_CATALOG.map((m) => m.model_id);
      expect(modelIds).toContain('suno_v4');
      expect(modelIds).toContain('suno_v3_5');
      expect(modelIds).toContain('suno_v3');
      expect(modelIds).toContain('suno_v6_mini');
      expect(modelIds).toContain('suno_v6');
      expect(SUNO_MODELS_CATALOG.length).toBeGreaterThanOrEqual(5);
    });

    it('setiap model resmi Suno berbiaya tepat 10 kredit per tombol generate', () => {
      SUNO_MODELS_CATALOG.forEach((model) => {
        expect(model.credits_per_generation).toBe(10);
        expect(model.variations_per_generation).toBe(2);
      });
      SUNO_AS_CATALOG_MODELS.forEach((model) => {
        expect(model.provider).toBe('suno');
        expect(model.supported_categories).toContain('music');
        expect(model.pricing_variants[0].credit_cost).toBe(10);
        expect(model.pricing_variants[0].pricing_unit).toBe('per_generation');
      });
    });

    it('getSunoModelById mengembalikan model yang tepat dan fallback aman', () => {
      const v4 = getSunoModelById('suno_v4');
      expect(v4.model_name).toBe('Suno v4 (Flagship Next-Gen)');
      expect(v4.max_duration_seconds).toBe(240);

      const unknown = getSunoModelById('unknown_model_xyz');
      expect(unknown.model_id).toBe('suno_v4'); // fallback aman
    });
  });

  describe('2. Subscription Plans Integrity', () => {
    it('memuat 3 paket resmi: Free ($0), Pro ($10), dan Premier ($30)', () => {
      const plans = SUNO_SUBSCRIPTION_PLANS;
      expect(plans.length).toBe(3);

      const free = getSunoPlanById('free');
      expect(free.monthly_price_usd).toBe(0);
      expect(free.daily_free_credits).toBe(50);
      expect(free.commercial_license).toBe(false);

      const pro = getSunoPlanById('pro');
      expect(pro.monthly_price_usd).toBe(10);
      expect(pro.monthly_credits).toBe(2500);
      expect(pro.usd_per_credit).toBeCloseTo(0.004);
      expect(pro.commercial_license).toBe(true);

      const premier = getSunoPlanById('premier');
      expect(premier.monthly_price_usd).toBe(30);
      expect(premier.monthly_credits).toBe(10000);
      expect(premier.usd_per_credit).toBeCloseTo(0.003);
      expect(premier.commercial_license).toBe(true);
    });
  });

  describe('3. Credit & Cost Calculation Precision', () => {
    it('calculateSunoCredits menghitung 10 kredit per generasi', () => {
      expect(calculateSunoCredits(0)).toBe(0);
      expect(calculateSunoCredits(1)).toBe(10);
      expect(calculateSunoCredits(5)).toBe(50);
      expect(calculateSunoCredits(10)).toBe(100);
    });

    it('calculateSunoCostUsd presisi desimal tanpa floating point jitter', () => {
      // Pro: 10 credit = $0.04
      expect(calculateSunoCostUsd(10, 'pro')).toBe(0.04);
      // Pro: 2500 credit = $10.00
      expect(calculateSunoCostUsd(2500, 'pro')).toBe(10);
      // Premier: 10 credit = $0.03
      expect(calculateSunoCostUsd(10, 'premier')).toBe(0.03);
      // Premier: 10000 credit = $30.00
      expect(calculateSunoCostUsd(10000, 'premier')).toBe(30);
      // Free plan = $0
      expect(calculateSunoCostUsd(100, 'free')).toBe(0);
    });

    it('calculateSunoCostIdr menghitung rupiah akurat', () => {
      const rate = 16250;
      // Pro: 10 credit = $0.04 * 16250 = Rp 650
      expect(calculateSunoCostIdr(10, 'pro', rate)).toBe(650);
      // Premier: 10 credit = $0.03 * 16250 = Rp 487.5
      expect(calculateSunoCostIdr(10, 'premier', rate)).toBe(487.5);
    });

    it('applySunoPlanRateToCatalog memperbarui harga per satuan model katalog', () => {
      const updatedCatalog = applySunoPlanRateToCatalog(SUNO_AS_CATALOG_MODELS, 'pro');
      const v4 = updatedCatalog.find((m) => m.model_id === 'suno_v4');
      expect(v4?.pricing_variants[0].price_value).toBe(0.04);

      const premierCatalog = applySunoPlanRateToCatalog(SUNO_AS_CATALOG_MODELS, 'premier');
      const v4Premier = premierCatalog.find((m) => m.model_id === 'suno_v4');
      expect(v4Premier?.pricing_variants[0].price_value).toBe(0.03);
    });

    it('fetchSunoCatalogAuto mengembalikan katalog valid dan fallback snapshot', async () => {
      const result = await fetchSunoCatalogAuto(1000);
      expect(result.models.length).toBeGreaterThanOrEqual(5);
      expect(result.plans.length).toBe(3);
      expect(result.source).toBeDefined();
    });
  });

  describe('4. Engine Budget Calculation with Suno Music Items', () => {
    const fx: ExchangeRate = {
      base_currency: 'USD',
      quote_currency: 'IDR',
      rate: 16250,
      rate_type: 'Manual',
      source_name: 'Manual Rate',
      source_url: '',
      retrieved_at: new Date().toISOString(),
      status: 'verified',
    };

    it('menghitung item musik Suno: 1 track x 2 cadangan = 2 generasi = 20 kredit = 4 variasi klip lagu', () => {
      const musicItem: ProductionItem = {
        item_id: 'item-music-1',
        category: 'music',
        label: 'Soundtrack Utama Suno',
        quantity: 1,
        quantity_type: 'asset',
        duration_seconds: 120,
        attempts_per_item: 2, // 2 cadangan
        is_primary_shot: false,
        music_genre: 'Sinematik Megah',
        music_prompt: 'Epic cinematic orchestral adventure',
        is_instrumental: true,
        model_selection: {
          provider: 'suno',
          model_id: 'suno_v4',
          model_name: 'Suno v4',
          category: 'music',
          parameter_values: {},
        },
        pricing: {
          pricing_unit: 'per_generation',
          price_value: 0.04, // Pro plan: 10 credit * $0.004 = $0.04
          currency: 'USD',
          credit_cost: 10,
          source_name: 'Suno Official Catalog',
          source_url: 'https://suno.com/pricing',
          retrieved_at: new Date().toISOString(),
          status: 'verified',
        },
      };

      const result = calculateProjectBudget(
        [musicItem],
        {
          target_videos: 1,
          default_attempts_per_shot: 2,
          suno_plan_id: 'pro',
          reserve_input_mode: 'percent',
          reserve_percent: 0,
          reserve_generations_override: 0,
          estimation_mode: 'per_shot',
          default_shots_per_video: 10,
          final_duration_minutes: 1,
        },
        fx
      );

      // Kuantitas & Generasi
      expect(result.item_results[0].budgeted_generations).toBe(2);
      expect(result.budgeted_generations).toBe(2);

      // Kredit Suno
      expect(result.item_results[0].total_credit).toBe(20);
      expect(result.total_suno_credit).toBe(20);
      expect(result.one_video_suno_credit).toBe(20);

      // Biaya USD: 2 generasi * $0.04 = $0.08
      expect(result.item_results[0].total_cost_usd).toBe(0.08);
      expect(result.total_cost_usd).toBe(0.08);

      // Biaya IDR: $0.08 * 16250 = Rp 1.300
      expect(result.item_results[0].total_cost_idr).toBe(1300);
      expect(result.total_cost_idr).toBe(1300);

      // Item musik tidak menambah jumlah shot video utama
      expect(result.total_primary_shots).toBe(0);
      expect(result.one_video_primary_shot_count).toBe(0);

      // Durasi video utama tetap 0s (musik berdiri sebagai layer audio)
      expect(result.one_video_duration_seconds).toBe(0);
    });

    it('mendukung kalkulasi multi-video untuk track musik', () => {
      const musicItem: ProductionItem = {
        item_id: 'item-music-2',
        category: 'music',
        label: 'Intro Jingle',
        quantity: 1,
        quantity_type: 'asset',
        duration_seconds: 30,
        attempts_per_item: 2,
        is_primary_shot: false,
        model_selection: {
          provider: 'suno',
          model_id: 'suno_v4',
          model_name: 'Suno v4',
          category: 'music',
          parameter_values: {},
        },
        pricing: {
          pricing_unit: 'per_generation',
          price_value: 0.04,
          currency: 'USD',
          credit_cost: 10,
          source_name: 'Suno Official Catalog',
          source_url: 'https://suno.com/pricing',
          retrieved_at: new Date().toISOString(),
          status: 'verified',
        },
      };

      const result = calculateProjectBudget(
        [musicItem],
        {
          target_videos: 3, // 3 video
          default_attempts_per_shot: 2,
          suno_plan_id: 'pro',
          reserve_input_mode: 'percent',
          reserve_percent: 0,
          reserve_generations_override: 0,
          estimation_mode: 'per_shot',
          default_shots_per_video: 10,
          final_duration_minutes: 1,
        },
        fx
      );

      // 1 video: 2 generasi = 20 kredit = $0.08 = Rp 1.300
      expect(result.one_video_suno_credit).toBe(20);
      expect(result.one_video_total_cost_usd).toBe(0.08);
      expect(result.one_video_total_cost_idr).toBe(1300);

      // Total 3 video: 6 generasi = 60 kredit = $0.24 = Rp 3.900
      expect(result.budgeted_generations).toBe(6);
      expect(result.total_suno_credit).toBe(60);
      expect(result.total_cost_usd).toBe(0.24);
      expect(result.total_cost_idr).toBe(3900);
    });

    it('createProductionItemFromCatalog otomatis menginisialisasi properti default musik Suno', () => {
      const item = createProductionItemFromCatalog('music', 'suno_v4', 'Soundtrack Utama');

      expect(item.category).toBe('music');
      expect(item.is_primary_shot).toBe(false);
      expect(item.duration_seconds).toBe(120);
      expect(item.music_genre).toBe('Sinematik Megah');
      expect(item.is_instrumental).toBe(true);
      expect(item.pricing.credit_cost).toBe(10);
    });
  });
});
