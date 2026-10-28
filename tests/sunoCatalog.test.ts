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
  calculateSunoTrackCredits,
  SUNO_STEM_CREDITS,
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
    it('memuat model resmi Suno v6, v6-wild, v6-mini, v4, v3.5, dan v3', () => {
      const modelIds = SUNO_MODELS_CATALOG.map((m) => m.model_id);
      expect(modelIds).toContain('suno_v6');
      expect(modelIds).toContain('suno_v6_wild');
      expect(modelIds).toContain('suno_v6_mini');
      expect(modelIds).toContain('suno_v4');
      expect(modelIds).toContain('suno_v3_5');
      expect(modelIds).toContain('suno_v3');
      expect(SUNO_MODELS_CATALOG.length).toBeGreaterThanOrEqual(6);
    });

    it('model v6 dan v6-wild mendukung durasi hingga 8 menit (480 detik)', () => {
      const v6 = getSunoModelById('suno_v6');
      expect(v6.max_duration_seconds).toBe(480);
      expect(v6.tier_badge).toBe('NEW');

      const v6Wild = getSunoModelById('suno_v6_wild');
      expect(v6Wild.max_duration_seconds).toBe(480);
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
      expect(v4.model_name).toBe('Suno v4 (Flagship Next-Gen Historis)');
      expect(v4.max_duration_seconds).toBe(240);

      const unknown = getSunoModelById('unknown_model_xyz');
      expect(unknown.model_id).toBe('suno_v6'); // fallback aman ke flagship resmi v6
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

    it('SUNO_STEM_CREDITS mendefinisikan tarif resmi 0 (none), 20 (two_stems), dan 50 (full_stems)', () => {
      expect(SUNO_STEM_CREDITS.none).toBe(0);
      expect(SUNO_STEM_CREDITS.two_stems).toBe(20);
      expect(SUNO_STEM_CREDITS.full_stems).toBe(50);
    });

    it('calculateSunoTrackCredits menghitung alur kerja sineas: base attempts + extends + stems', () => {
      // 1 run audisi, 0 extend, stereo mix
      const basic = calculateSunoTrackCredits({ baseAttempts: 1, extendCount: 0, stemMode: 'none' });
      expect(basic.baseCredits).toBe(10);
      expect(basic.extendCredits).toBe(0);
      expect(basic.stemCredits).toBe(0);
      expect(basic.totalCreditsPerTrack).toBe(10);
      expect(basic.totalVariationsPerTrack).toBe(2);

      // 2 run audisi, 1 extend, two_stems (split vokal/musik)
      const cinematic = calculateSunoTrackCredits({ baseAttempts: 2, extendCount: 1, stemMode: 'two_stems' });
      expect(cinematic.baseCredits).toBe(20); // 2 * 10
      expect(cinematic.extendCredits).toBe(10); // 1 * 10
      expect(cinematic.stemCredits).toBe(20); // 20 cr
      expect(cinematic.totalCreditsPerTrack).toBe(50); // 20 + 10 + 20
      expect(cinematic.totalVariationsPerTrack).toBe(6); // (2 + 1) * 2

      // 3 run audisi, 2 extend, full_stems (studio 12 tracks)
      const studio = calculateSunoTrackCredits({ baseAttempts: 3, extendCount: 2, stemMode: 'full_stems' });
      expect(studio.baseCredits).toBe(30);
      expect(studio.extendCredits).toBe(20);
      expect(studio.stemCredits).toBe(50);
      expect(studio.totalCreditsPerTrack).toBe(100);
      expect(studio.totalVariationsPerTrack).toBe(10);
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

    it('menghitung akurat alur kerja sineas: 1 track, 2 audisi, 1 extend, dan two_stems (20 cr)', () => {
      const filmmakerMusicItem: ProductionItem = {
        item_id: 'item-filmmaker-music',
        category: 'music',
        label: 'Adegan Aksi Sinematik (Full)',
        quantity: 1,
        quantity_type: 'asset',
        duration_seconds: 180,
        attempts_per_item: 2, // 2 audisi
        extend_count: 1, // 1 extend
        stem_separation_mode: 'two_stems', // 20 cr stems
        music_role: 'action_score',
        is_instrumental: true,
        model_selection: {
          provider: 'suno',
          model_id: 'suno_v6',
          model_name: 'Suno v6',
          category: 'music',
          parameter_values: {},
        },
        pricing: {
          pricing_unit: 'per_asset',
          price_value: null,
          currency: 'USD',
          credit_cost: 10,
          source_name: 'Suno Official Catalog',
          source_url: 'https://suno.com/pricing',
          retrieved_at: new Date().toISOString(),
          status: 'verified',
        },
      };

      const result = calculateProjectBudget(
        [filmmakerMusicItem],
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

      // Generasi: (2 audisi + 1 extend) = 3 generasi
      expect(result.item_results[0].planned_generations).toBe(3);
      expect(result.item_results[0].budgeted_generations).toBe(3);

      // Kredit: (2 * 10) + (1 * 10) + 20 (stems) = 50 Kredit Suno
      expect(result.item_results[0].total_credit).toBe(50);
      expect(result.total_suno_credit).toBe(50);

      // Biaya Pro Plan: 50 * $0.004 = $0.2000
      expect(result.item_results[0].total_cost_usd).toBe(0.2);
      expect(result.total_cost_usd).toBe(0.2);

      // Biaya IDR: $0.20 * 16250 = Rp 3.250
      expect(result.item_results[0].total_cost_idr).toBe(3250);
      expect(result.total_cost_idr).toBe(3250);
    });

    it('createProductionItemFromCatalog otomatis menginisialisasi properti default musik Suno', () => {
      const item = createProductionItemFromCatalog('music', 'suno_v4', 'Soundtrack Utama');

      expect(item.category).toBe('music');
      expect(item.is_primary_shot).toBe(false);
      expect(item.duration_seconds).toBe(120);
      expect(item.music_genre).toBe('Sinematik Megah');
      expect(item.is_instrumental).toBe(true);
      expect(item.pricing.credit_cost).toBe(10);
      expect(item.stem_enabled).toBe(false);
      expect(item.stem_type).toBe('two_stems');
      expect(item.stem_runs).toBe(1);
      expect(item.stem_reserve).toBe(0);
    });

    it('menghitung akurat fitur musik sederhana: quantity, direct attempts, music_reserve_override, dan stem separation', () => {
      const customFx: ExchangeRate = {
        base_currency: 'USD',
        quote_currency: 'IDR',
        rate: 16000,
        rate_type: 'Manual',
        source_name: 'Manual Rate',
        source_url: '',
        retrieved_at: new Date().toISOString(),
        status: 'verified',
      };

      const musicItem: ProductionItem = {
        item_id: 'track_music_simplified',
        category: 'music',
        label: 'Musik Latar Video Komersial',
        quantity: 2, // 2 lagu
        quantity_type: 'asset',
        duration_seconds: 90,
        attempts_per_item: 1, // 1x generate langsung = 10 cr per lagu
        music_reserve_override: 2, // 2 cadangan lagu = 2 * 10 cr = 20 cr
        stem_enabled: true,
        stem_type: 'two_stems', // 20 cr
        stem_runs: 1, // 1x per lagu = 20 cr * 2 lagu = 40 cr
        stem_reserve: 1, // 1 cadangan stem per lagu = 20 cr * 2 lagu = 40 cr
        use_project_target_multiplier: false,
        is_primary_shot: false,
        model_selection: {
          provider: 'suno',
          model_id: 'suno_v6',
          model_name: 'Suno v6 (Flagship Core Studio)',
          category: 'music',
          parameter_values: {},
        },
        pricing: {
          pricing_unit: 'per_generation',
          price_value: 0.04,
          currency: 'USD',
          credit_cost: 10,
          credit_unit: 'per_generation',
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
          default_attempts_per_shot: 1,
          suno_plan_id: 'pro', // $0.004 per credit
          reserve_input_mode: 'percent',
          reserve_percent: 0,
          reserve_generations_override: 0,
          estimation_mode: 'per_shot',
          default_shots_per_video: 10,
          final_duration_minutes: 1,
        },
        customFx
      );

      // Hitungan Rinci:
      // Lagu Base: 2 lagu * 1x * 10 cr = 20 cr
      // Lagu Cadangan (music_reserve_override): 2 * 10 cr = 20 cr
      // Stem Base: 2 lagu * 1 run * 20 cr = 40 cr
      // Stem Cadangan: 2 lagu * 1 reserve * 20 cr = 40 cr
      // Total Base Credit = 20 + 40 = 60 cr
      // Total Reserve Credit = 20 + 40 = 60 cr
      // Total Suno Credit = 120 cr
      expect(result.item_results[0].total_credit).toBe(120);
      expect(result.total_suno_credit).toBe(120);

      // Biaya Pro Plan: 120 * $0.004 = $0.48
      expect(result.item_results[0].total_cost_usd).toBe(0.48);
      expect(result.total_cost_usd).toBe(0.48);

      // Biaya IDR: $0.48 * 16000 = Rp 7.680
      expect(result.item_results[0].total_cost_idr).toBe(7680);
      expect(result.total_cost_idr).toBe(7680);
    });
  });
});
