import { describe, expect, it } from 'vitest';
import {
  compareSchemaVersion,
  validateProjectFileJson,
  ProcessCategorySchema,
  ProductionItemSchema,
  ElevenLabsSubscriptionPlanSchema,
} from '../src/shared/schema/projectSchema';
import { ALL_PROCESS_CATEGORIES } from '../src/shared/types/project';
import { createPrdSyntheticTestProject } from '../src/shared/engine/calculationEngine';

describe('Project File Schema Validator (.aivbudget) — PRD Bab 10.3 & FR-01, FR-13', () => {
  it('AC-01: Memvalidasi file proyek .aivbudget yang valid dengan sukses', () => {
    const project = createPrdSyntheticTestProject();
    const jsonString = JSON.stringify(project, null, 2);

    const validation = validateProjectFileJson(jsonString);
    expect(validation.valid).toBe(true);
    expect(validation.data?.project_name).toBe(project.project_name);
    expect(validation.data?.schema_version).toBe('1.0.0');
  });

  it('FR-01: Menolak proyek dengan nama kosong', () => {
    const project = createPrdSyntheticTestProject();
    project.project_name = '   ';
    const validation = validateProjectFileJson(JSON.stringify(project));

    expect(validation.valid).toBe(false);
    expect(validation.errorCode).toBe('VALIDATION_FAILED');
  });

  it('PRD Bab 10.3: Menolak file dengan schema_version lebih baru tanpa merusak file', () => {
    const project = createPrdSyntheticTestProject();
    project.schema_version = '2.1.0';
    const validation = validateProjectFileJson(JSON.stringify(project));

    expect(validation.valid).toBe(false);
    expect(validation.errorCode).toBe('NEWER_SCHEMA_VERSION');
    expect(validation.errorMessage_id).toContain('v2.1.0');
  });

  it('PRD Bab 13.1: Menangani file JSON yang rusak dengan pesan jelas', () => {
    const validation = validateProjectFileJson('{ invalid json ///');
    expect(validation.valid).toBe(false);
    expect(validation.errorCode).toBe('INVALID_JSON');
  });

  it('Membandingkan versi skema semver secara akurat', () => {
    expect(compareSchemaVersion('1.0.0', '1.0.0')).toBe(0);
    expect(compareSchemaVersion('2.0.0', '1.0.0')).toBe(1);
    expect(compareSchemaVersion('1.0.0', '1.2.0')).toBe(-1);
  });

  it('Backward Compatibility: File lama tanpa target_videos tetap valid dan otomatis bernilai 1', () => {
    const project = createPrdSyntheticTestProject();
    const rawData = JSON.parse(JSON.stringify(project));
    delete rawData.assumptions.target_videos;

    const validation = validateProjectFileJson(JSON.stringify(rawData));
    expect(validation.valid).toBe(true);
    expect(validation.data?.assumptions.target_videos).toBe(1);
  });

  describe('Tahap 3 — Voice Over & ElevenLabs Schema Contract Integrity', () => {
    it('ALL_PROCESS_CATEGORIES memuat voice_over dan berjumlah 9 kategori (termasuk music)', () => {
      expect(ALL_PROCESS_CATEGORIES).toContain('voice_over');
      expect(ALL_PROCESS_CATEGORIES).toContain('music');
      expect(ALL_PROCESS_CATEGORIES.length).toBe(9);
    });

    it('ProcessCategorySchema memvalidasi voice_over dan alias yang dinormalisasi', () => {
      expect(ProcessCategorySchema.parse('voice_over')).toBe('voice_over');
      expect(ProcessCategorySchema.parse('voiceover')).toBe('voice_over');
      expect(ProcessCategorySchema.parse('voice')).toBe('voice_over');
      expect(ProcessCategorySchema.parse('tts')).toBe('voice_over');
      expect(ProcessCategorySchema.parse('upscaling')).toBe('upscale_video');
    });

    it('ProductionItemSchema mendukung field opsional voiceover secara aman dan backward-compatible', () => {
      const legacyItem = {
        item_id: 'item-vo-1',
        category: 'voice_over',
        label: 'Narasi Pembuka',
        quantity: 1,
        quantity_type: 'shot',
        duration_seconds: 30,
        attempts_per_item: 1,
        model_selection: {
          provider: 'elevenlabs',
          model_id: 'eleven_multilingual_v2',
          model_name: 'Eleven Multilingual v2',
          category: 'voice_over',
          parameter_values: {},
        },
        pricing: {
          pricing_unit: 'per_generation',
          price_value: null,
          currency: 'USD',
          credit_cost: 300,
          source_name: 'ElevenLabs Catalog',
          source_url: 'https://elevenlabs.io',
          retrieved_at: new Date().toISOString(),
          status: 'verified',
        },
      };

      // Parsing item tanpa field baru (backward compatible)
      const parsedLegacy = ProductionItemSchema.parse(legacyItem);
      expect(parsedLegacy.category).toBe('voice_over');
      expect(parsedLegacy.script_text).toBeUndefined();
      expect(parsedLegacy.character_count).toBeUndefined();

      // Parsing item dengan field baru voiceover
      const enrichedItem = {
        ...legacyItem,
        script_text: 'Selamat datang di masa depan produksi video berbasis AI.',
        script_language: 'id',
        character_count: 57,
      };
      const parsedEnriched = ProductionItemSchema.parse(enrichedItem);
      expect(parsedEnriched.script_text).toBe(enrichedItem.script_text);
      expect(parsedEnriched.script_language).toBe('id');
      expect(parsedEnriched.character_count).toBe(57);
    });

    it('ElevenLabsSubscriptionPlanSchema memvalidasi paket langganan ElevenLabs secara ketat', () => {
      const validPlan = {
        plan_id: 'creator',
        name_id: 'Paket Creator ElevenLabs',
        name_en: 'ElevenLabs Creator Plan',
        monthly_price_usd: 22,
        monthly_credits: 100000,
        usd_per_credit: 0.00022,
        description_id: '100.000 karakter per bulan untuk kreator konten',
        description_en: '100,000 characters per month for content creators',
        plan_category: 'creator',
        billing_cycle: 'monthly',
      };

      const parsedPlan = ElevenLabsSubscriptionPlanSchema.parse(validPlan);
      expect(parsedPlan.plan_id).toBe('creator');
      expect(parsedPlan.monthly_credits).toBe(100000);
      expect(parsedPlan.usd_per_credit).toBeCloseTo(0.00022);
    });
  });

  describe('Tahap 4 — Suno AI Music Schema Contract Integrity', () => {
    it('ProcessCategorySchema memvalidasi music dan alias seperti soundtrack / bgm', () => {
      expect(ProcessCategorySchema.parse('music')).toBe('music');
      expect(ProcessCategorySchema.parse('soundtrack')).toBe('music');
      expect(ProcessCategorySchema.parse('bgm')).toBe('music');
      expect(ProcessCategorySchema.parse('audio_bgm')).toBe('music');
    });

    it('ProductionItemSchema mendukung field opsional musik Suno', () => {
      const musicItem = {
        item_id: 'item-music-1',
        category: 'music',
        label: 'Main Cinematic Soundtrack',
        quantity: 1,
        quantity_type: 'asset',
        duration_seconds: 120,
        attempts_per_item: 2,
        is_primary_shot: false,
        music_genre: 'Sinematik Megah',
        music_prompt: 'Epic orchestral theme with strings and brass',
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
          price_value: 0.04,
          currency: 'USD',
          credit_cost: 10,
          source_name: 'Official Suno Catalog',
          source_url: 'https://suno.com/pricing',
          retrieved_at: new Date().toISOString(),
          status: 'verified',
        },
      };

      const parsed = ProductionItemSchema.parse(musicItem);
      expect(parsed.category).toBe('music');
      expect(parsed.music_genre).toBe('Sinematik Megah');
      expect(parsed.music_prompt).toBe('Epic orchestral theme with strings and brass');
      expect(parsed.is_instrumental).toBe(true);
      expect(parsed.is_primary_shot).toBe(false);
    });
  });
});
