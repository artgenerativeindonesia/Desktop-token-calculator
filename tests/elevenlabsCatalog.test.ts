import { describe, expect, it } from 'vitest';
import {
  calculateElevenLabsCostIdr,
  calculateElevenLabsCostUsd,
  calculateElevenLabsCredits,
  convertCharactersToDuration,
  convertCharactersToWords,
  convertDurationToCharacters,
  convertWordsToCharacters,
  ELEVENLABS_AS_CATALOG_MODELS,
  ELEVENLABS_MODELS_CATALOG,
  ELEVENLABS_SUBSCRIPTION_PLANS,
  estimateVoicedScript,
  fetchElevenLabsCatalogAuto,
  formatSpeechDuration,
  getElevenLabsModelById,
  getElevenLabsPlanById,
  SPEECH_SPEED_PROFILES,
} from '../src/shared/catalog/elevenlabsCatalog';

describe('ElevenLabs Official Catalog & Voice Engine', () => {
  describe('1. Paket Langganan Resmi Terupdate', () => {
    it('memiliki 6 tier paket langganan lengkap', () => {
      expect(ELEVENLABS_SUBSCRIPTION_PLANS).toHaveLength(6);
      const planIds = ELEVENLABS_SUBSCRIPTION_PLANS.map((p) => p.plan_id);
      expect(planIds).toEqual(['free', 'starter', 'creator', 'pro', 'scale', 'business']);
    });

    it('Free Tier: $0, 10.000 credits, $0/credit', () => {
      const free = getElevenLabsPlanById('free');
      expect(free.monthly_price_usd).toBe(0);
      expect(free.monthly_credits).toBe(10_000);
      expect(free.usd_per_credit).toBe(0);
      expect(free.commercial_license).toBe(false);
      expect(free.supports_professional_voice_cloning).toBe(false);
    });

    it('Starter Tier: $6, 30.000 credits, $0.000200/credit (~Rp 3.25/credit)', () => {
      const starter = getElevenLabsPlanById('starter');
      expect(starter.monthly_price_usd).toBe(6);
      expect(starter.monthly_credits).toBe(30_000);
      expect(starter.usd_per_credit).toBe(0.0002);
      expect(starter.approx_idr_per_credit).toBe(3.25);
      expect(starter.commercial_license).toBe(true);
      expect(starter.supports_instant_voice_cloning).toBe(true);
    });

    it('Creator Tier: $22, 121.000 credits, $0.0001818/credit', () => {
      const creator = getElevenLabsPlanById('creator');
      expect(creator.monthly_price_usd).toBe(22);
      expect(creator.monthly_credits).toBe(121_000);
      expect(creator.usd_per_credit).toBeCloseTo(0.0001818, 6);
      expect(creator.pvc_slots).toBe(1);
    });

    it('Pro Tier: $99, 600.000 credits, $0.0001650/credit', () => {
      const pro = getElevenLabsPlanById('pro');
      expect(pro.monthly_price_usd).toBe(99);
      expect(pro.monthly_credits).toBe(600_000);
      expect(pro.usd_per_credit).toBe(0.000165);
      expect(pro.pvc_slots).toBe(3);
    });

    it('Scale Tier: $299, 1.800.000 credits, $0.0001661/credit', () => {
      const scale = getElevenLabsPlanById('scale');
      expect(scale.monthly_price_usd).toBe(299);
      expect(scale.monthly_credits).toBe(1_800_000);
      expect(scale.usd_per_credit).toBeCloseTo(0.0001661, 6);
      expect(scale.workspace_seats).toBe(3);
    });

    it('Business Tier: $990, 6.000.000 credits, $0.0001650/credit', () => {
      const business = getElevenLabsPlanById('business');
      expect(business.monthly_price_usd).toBe(990);
      expect(business.monthly_credits).toBe(6_000_000);
      expect(business.usd_per_credit).toBe(0.000165);
      expect(business.workspace_seats).toBe(10);
      expect(business.pvc_slots).toBe(10);
    });
  });

  describe('2. Model-Model AI Resmi Terupdate', () => {
    it('memiliki 11 model suara resmi terupdate', () => {
      expect(ELEVENLABS_MODELS_CATALOG).toHaveLength(11);
      const modelIds = ELEVENLABS_MODELS_CATALOG.map((m) => m.model_id);
      expect(modelIds).toEqual([
        'eleven_v4',
        'eleven_v4_turbo',
        'eleven_multilingual_v2',
        'eleven_flash_v2_5',
        'eleven_flash_v2',
        'eleven_turbo_v2_5',
        'eleven_turbo_v2',
        'eleven_v3',
        'eleven_multilingual_sts_v2',
        'eleven_english_sts_v2',
        'eleven_monolingual_v1',
      ]);
    });

    it('eleven_v4: Flagship Next-Gen, 1.0 credit/char, 90+ bahasa, emotional depth', () => {
      const model = getElevenLabsModelById('eleven_v4');
      expect(model.credit_multiplier_per_character).toBe(1.0);
      expect(model.language_count).toBeGreaterThanOrEqual(90);
      expect(model.supported_languages).toContain('id');
      expect(model.supported_languages).toContain('en');
      expect(model.tier_badge).toBe('NEW');
    });

    it('eleven_v4_turbo: Low Latency Flagship, 0.5 credit/char (50% discount), ~100ms, 90+ bahasa', () => {
      const model = getElevenLabsModelById('eleven_v4_turbo');
      expect(model.credit_multiplier_per_character).toBe(0.5);
      expect(model.latency_ms_approx).toBe(100);
      expect(model.language_count).toBeGreaterThanOrEqual(90);
      expect(model.supported_languages).toContain('id');
    });

    it('eleven_multilingual_v2: 1.0 credit/char, 29+ bahasa, expressive', () => {
      const model = getElevenLabsModelById('eleven_multilingual_v2');
      expect(model.credit_multiplier_per_character).toBe(1.0);
      expect(model.language_count).toBeGreaterThanOrEqual(29);
      expect(model.supported_languages).toContain('id');
      expect(model.supported_languages).toContain('en');
    });

    it('eleven_flash_v2_5: 0.5 credit/char (diskon 50%), ~75ms, 32 bahasa', () => {
      const model = getElevenLabsModelById('eleven_flash_v2_5');
      expect(model.credit_multiplier_per_character).toBe(0.5);
      expect(model.latency_ms_approx).toBe(75);
      expect(model.language_count).toBeGreaterThanOrEqual(32);
      expect(model.supported_languages).toContain('id');
    });

    it('eleven_flash_v2: 0.5 credit/char (diskon 50%), ~75ms, 29 bahasa', () => {
      const model = getElevenLabsModelById('eleven_flash_v2');
      expect(model.credit_multiplier_per_character).toBe(0.5);
      expect(model.latency_ms_approx).toBe(75);
      expect(model.language_count).toBeGreaterThanOrEqual(29);
      expect(model.supported_languages).toContain('id');
    });

    it('eleven_turbo_v2_5: 0.5 credit/char (diskon 50%), ~250ms, 32 bahasa', () => {
      const model = getElevenLabsModelById('eleven_turbo_v2_5');
      expect(model.credit_multiplier_per_character).toBe(0.5);
      expect(model.latency_ms_approx).toBe(250);
      expect(model.language_count).toBeGreaterThanOrEqual(32);
    });

    it('eleven_turbo_v2: 0.5 credit/char (diskon 50%), ~250ms, 29 bahasa', () => {
      const model = getElevenLabsModelById('eleven_turbo_v2');
      expect(model.credit_multiplier_per_character).toBe(0.5);
      expect(model.latency_ms_approx).toBe(250);
      expect(model.language_count).toBeGreaterThanOrEqual(29);
      expect(model.supported_languages).toContain('id');
    });

    it('eleven_v3: 1.0 credit/char, 70+ bahasa', () => {
      const model = getElevenLabsModelById('eleven_v3');
      expect(model.credit_multiplier_per_character).toBe(1.0);
      expect(model.language_count).toBeGreaterThanOrEqual(70);
    });

    it('eleven_multilingual_sts_v2: Speech to Speech voice changer, 1.0 credit/char', () => {
      const model = getElevenLabsModelById('eleven_multilingual_sts_v2');
      expect(model.credit_multiplier_per_character).toBe(1.0);
      expect(model.category).toBe('sts');
      expect(model.supported_languages).toContain('id');
    });

    it('eleven_english_sts_v2: Speech to Speech voice changer English, 1.0 credit/char', () => {
      const model = getElevenLabsModelById('eleven_english_sts_v2');
      expect(model.credit_multiplier_per_character).toBe(1.0);
      expect(model.category).toBe('sts');
      expect(model.supported_languages).toEqual(['en']);
    });

    it('eleven_monolingual_v1: 1.0 credit/char, English only', () => {
      const model = getElevenLabsModelById('eleven_monolingual_v1');
      expect(model.credit_multiplier_per_character).toBe(1.0);
      expect(model.supported_languages).toEqual(['en']);
    });

    it('Verifikasi 100% dari 11 model ElevenLabs memiliki parameter lengkap, aktif, dan valid', () => {
      expect(ELEVENLABS_MODELS_CATALOG).toHaveLength(11);
      for (const m of ELEVENLABS_MODELS_CATALOG) {
        expect(m.model_id).toBeTruthy();
        expect(m.model_name).toBeTruthy();
        expect([0.5, 1.0]).toContain(m.credit_multiplier_per_character);
        expect(m.latency_ms_approx).toBeGreaterThan(0);
        expect(m.language_count).toBeGreaterThan(0);
        expect(m.supported_languages.length).toBeGreaterThan(0);
        expect(m.is_active).toBe(true);
        expect(m.source_url).toContain('elevenlabs.io');
      }
    });
  });

  describe('3. Rumus Konversi Kecepatan Bicara (Dwi-Input Sineas)', () => {
    it('kecepatan bicara Bahasa Indonesia: ~14.5 char/sec (~870 char/min, ~125 WPM)', () => {
      const idProfile = SPEECH_SPEED_PROFILES.id;
      expect(idProfile.characters_per_second).toBe(14.5);
      expect(idProfile.characters_per_minute).toBe(870);
      expect(idProfile.words_per_minute).toBe(125);
    });

    it('kecepatan bicara Bahasa Inggris: ~16.5 char/sec (~990 char/min, ~145 WPM)', () => {
      const enProfile = SPEECH_SPEED_PROFILES.en;
      expect(enProfile.characters_per_second).toBe(16.5);
      expect(enProfile.characters_per_minute).toBe(990);
      expect(enProfile.words_per_minute).toBe(145);
    });

    it('convertDurationToCharacters mengonversi durasi ke karakter sesuai bahasa', () => {
      // 10 detik Indonesia -> 145 karakter
      expect(convertDurationToCharacters(10, 'id')).toBe(145);
      // 10 detik Inggris -> 165 karakter
      expect(convertDurationToCharacters(10, 'en')).toBe(165);
      // Durasi 0 atau negatif aman
      expect(convertDurationToCharacters(0, 'id')).toBe(0);
      expect(convertDurationToCharacters(-5, 'id')).toBe(0);
    });

    it('convertCharactersToDuration mengonversi karakter ke durasi detik sesuai bahasa', () => {
      // 145 karakter Indonesia -> 10 detik
      expect(convertCharactersToDuration(145, 'id')).toBe(10);
      // 165 karakter Inggris -> 10 detik
      expect(convertCharactersToDuration(165, 'en')).toBe(10);
      // Aman terhadap angka nol atau negatif
      expect(convertCharactersToDuration(0, 'id')).toBe(0);
      expect(convertCharactersToDuration(-100, 'id')).toBe(0);
    });

    it('convertWordsToCharacters dan convertCharactersToWords bekerja timbal balik', () => {
      const words = 100;
      const charsId = convertWordsToCharacters(words, 'id');
      expect(charsId).toBe(696);
      expect(convertCharactersToWords(charsId, 'id')).toBe(100);

      const charsEn = convertWordsToCharacters(words, 'en');
      expect(charsEn).toBe(683);
      expect(convertCharactersToWords(charsEn, 'en')).toBe(100);
    });

    it('formatSpeechDuration memformat waktu dengan rapi bilingual', () => {
      expect(formatSpeechDuration(45, 'id')).toBe('45 Detik (00:45)');
      expect(formatSpeechDuration(90, 'id')).toBe('1 Menit 30 Detik (01:30)');
      expect(formatSpeechDuration(45, 'en')).toBe('45s (00:45)');
      expect(formatSpeechDuration(90, 'en')).toBe('1m 30s (01:30)');
    });
  });

  describe('4. Kalkulasi Credit & Biaya (USD & IDR)', () => {
    it('calculateElevenLabsCredits: Flagship models (1.0x) = 1 credit / char', () => {
      expect(calculateElevenLabsCredits(1000, 'eleven_multilingual_v2')).toBe(1000);
      expect(calculateElevenLabsCredits(1000, 'eleven_v3')).toBe(1000);
      expect(calculateElevenLabsCredits(1000, 'eleven_monolingual_v1')).toBe(1000);
    });

    it('calculateElevenLabsCredits: Flash & Turbo models (0.5x) = 0.5 credit / char', () => {
      expect(calculateElevenLabsCredits(1000, 'eleven_flash_v2_5')).toBe(500);
      expect(calculateElevenLabsCredits(1000, 'eleven_turbo_v2_5')).toBe(500);
      // Kasus ganjil: 1 char * 0.5 = 0.5 -> dibulatkan ke atas jadi 1 credit
      expect(calculateElevenLabsCredits(1, 'eleven_flash_v2_5')).toBe(1);
    });

    it('calculateElevenLabsCostUsd menghitung biaya USD sesuai paket langganan', () => {
      // Starter: $0.000200 / credit -> 10,000 credits = $2.00
      expect(calculateElevenLabsCostUsd(10_000, 'starter')).toBe(2);
      // Creator: $0.0001818 / credit -> 10,000 credits = $1.818
      expect(calculateElevenLabsCostUsd(10_000, 'creator')).toBe(1.818);
      // Free: $0
      expect(calculateElevenLabsCostUsd(10_000, 'free')).toBe(0);
    });

    it('calculateElevenLabsCostIdr menghitung biaya Rupiah akurat', () => {
      // Starter: 10,000 credits = $2.00 * 16,250 = Rp 32,500
      expect(calculateElevenLabsCostIdr(10_000, 'starter', 16_250)).toBe(32_500);
      // Free: Rp 0
      expect(calculateElevenLabsCostIdr(10_000, 'free', 16_250)).toBe(0);
    });

    it('estimateVoicedScript dengan input naskah langsung (skrip)', () => {
      const script = 'Halo teman-teman, selamat datang di tutorial produksi video AI terkini.';
      const res = estimateVoicedScript({
        text: script,
        lang: 'id',
        modelId: 'eleven_flash_v2_5',
        planId: 'starter',
        usdToIdrRate: 16_250,
      });

      expect(res.character_count).toBe(script.length);
      expect(res.total_credits).toBe(Math.ceil(script.length * 0.5));
      expect(res.duration_seconds).toBeGreaterThan(0);
      expect(res.total_cost_usd).toBeGreaterThan(0);
      expect(res.total_cost_idr).toBeGreaterThan(0);
    });

    it('estimateVoicedScript dengan input durasi shot target', () => {
      const res = estimateVoicedScript({
        durationSeconds: 30, // 30 detik
        lang: 'id',
        modelId: 'eleven_multilingual_v2',
        planId: 'starter',
        usdToIdrRate: 16_250,
      });

      // 30 detik * 14.5 char/s = 435 char
      expect(res.character_count).toBe(435);
      expect(res.total_credits).toBe(435); // 1.0x
      expect(res.duration_seconds).toBe(30);
    });
  });

  describe('5. Bridge Adaptor ke CatalogModelEntry', () => {
    it('mengadaptasi semua 11 model ElevenLabs ke struktur CatalogModelEntry standar dengan quantity_type asset (file audio)', () => {
      expect(ELEVENLABS_AS_CATALOG_MODELS).toHaveLength(11);
      for (const m of ELEVENLABS_AS_CATALOG_MODELS) {
        expect(m.provider).toBe('elevenlabs');
        expect(m.supported_categories).toEqual(['voice_over']);
        expect(m.default_quantity_type).toBe('asset');
        expect(m.pricing_variants[0].pricing_unit).toBe('per_second');
        expect(m.pricing_variants[0].status).toBe('verified');
      }
    });

    it('memastikan terminologi file audio terdistribusi konsisten pada seluruh 11 model bridge', () => {
      const modelNames = ELEVENLABS_AS_CATALOG_MODELS.map((m) => m.model_name);
      expect(modelNames).toContain('Eleven v4 (Flagship Next-Gen)');
      expect(modelNames).toContain('Eleven v4 Turbo (Low Latency Flagship)');
      expect(modelNames).toContain('Eleven Multilingual v2');
      expect(modelNames).toContain('Eleven Flash v2.5');
      expect(modelNames).toContain('Eleven Flash v2');
      expect(modelNames).toContain('Eleven Turbo v2.5');
      expect(modelNames).toContain('Eleven Turbo v2');
      expect(modelNames).toContain('Eleven v3 (Multilingual Alpha)');
      expect(modelNames).toContain('Eleven Multilingual STS v2 (Speech to Speech)');
      expect(modelNames).toContain('Eleven English STS v2 (Speech to Speech)');
      expect(modelNames).toContain('Eleven English v1 (Monolingual Legacy)');
    });
  });

  describe('6. Real-Time Connector Otomatis', () => {
    it('mengembalikan snapshot terverifikasi saat tanpa API key (offline-safe)', async () => {
      const catalog = await fetchElevenLabsCatalogAuto();
      expect(catalog.success).toBe(true);
      expect(catalog.usedFallback).toBe(true);
      expect(catalog.models).toHaveLength(11);
      expect(catalog.plans).toHaveLength(6);
      expect(catalog.source).toContain('Verified Snapshot');
    });

    it('mendukung customFetch live API terotentikasi', async () => {
      const mockFetch: typeof fetch = async (input) => {
        const urlStr = String(input);
        if (urlStr.includes('/models')) {
          return {
            ok: true,
            status: 200,
            json: async () => [
              {
                model_id: 'eleven_flash_v2_5',
                name: 'Eleven Flash v2.5 Live',
                can_do_text_to_speech: true,
                languages: [{ language_id: 'id', name: 'Indonesian' }],
              },
            ],
          } as unknown as Response;
        }
        if (urlStr.includes('/user/subscription')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              tier: 'starter',
              character_count: 5000,
              character_limit: 30000,
              can_extend_character_limit: true,
              allowed_to_extend_character_limit: true,
              next_character_count_reset_unix: 1735689600,
            }),
          } as unknown as Response;
        }
        return { ok: false, status: 404 } as unknown as Response;
      };

      const catalog = await fetchElevenLabsCatalogAuto({
        apiKey: 'test-xi-api-key',
        customFetch: mockFetch,
      });

      expect(catalog.success).toBe(true);
      expect(catalog.usedFallback).toBe(false);
      expect(catalog.source).toContain('ElevenLabs Official Live API');
      expect(catalog.userSubscription?.character_count).toBe(5000);
    });

    it('secara aman fallback ke offline snapshot jika customFetch melempar error', async () => {
      const failingFetch: typeof fetch = async () => {
        throw new Error('Network connection offline');
      };

      const catalog = await fetchElevenLabsCatalogAuto({
        apiKey: 'invalid-or-offline-key',
        customFetch: failingFetch,
      });

      expect(catalog.success).toBe(true);
      expect(catalog.usedFallback).toBe(true);
      expect(catalog.models).toHaveLength(11);
      expect(catalog.error_id).toContain('Koneksi API langsung gagal');
    });
  });
});
