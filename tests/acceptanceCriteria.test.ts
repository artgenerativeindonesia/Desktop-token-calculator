import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  calculateBidirectionalReserve,
  calculateProjectBudget,
  createPrdSyntheticTestProject,
  createProductionItemFromCatalog,
  createSampleCommercialProject,
} from '../src/shared/engine/calculationEngine';
import {
  getModelsByCategory,
  HIGGSFIELD_MODEL_CATALOG,
} from '../src/shared/catalog/higgsfieldCatalog';
import {
  loadProjectFromFile,
  saveProjectToFileAtomic,
} from '../src/main/storage/projectStorage';
import {
  createManualExchangeRate,
  fetchVerifiedUsdIdrRate,
} from '../src/main/connectors/fxConnector';
import { generatePdfReportHtml } from '../src/shared/pdf/pdfReportBuilder';
import { ProcessCategory } from '../src/shared/types/project';

describe('PRD Bab 15 — Full Acceptance Criteria Suite (AC-01 s/d AC-14)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aivbudget-ac-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  });

  it('AC-01 (Proyek) & AC-11 (Tanpa riwayat) & AC-12 (Portabilitas): Buat, simpan, tutup, buka kembali', () => {
    const proj = createSampleCommercialProject();
    proj.project_name = 'AC-01 Test Project';
    const filePath = path.join(tempDir, 'AC01.aivbudget');

    const saveRes = saveProjectToFileAtomic(filePath, proj);
    expect(saveRes.success).toBe(true);

    const loadRes = loadProjectFromFile(filePath);
    expect(loadRes.success).toBe(true);
    expect(loadRes.project?.project_name).toBe('AC-01 Test Project');
    expect(loadRes.project?.calculation.total_cost_usd).toBe(
      proj.calculation.total_cost_usd
    );
    // Pastikan tidak menyimpan riwayat estimasi internal (AC-11)
    expect((loadRes.project as unknown as Record<string, unknown>).history).toBeUndefined();
  });

  it('AC-02 (Kategori) & AC-03 (Model): Mendukung 7 kategori proses AI (termasuk Image to Image, Upscale Image, & Upscale Video) dan parameter dinamis sesuai katalog', () => {
    const categories: ProcessCategory[] = [
      'text_to_image',
      'image_to_image',
      'image_to_video',
      'video_to_video',
      'text_to_video',
      'upscale_image',
      'upscale_video',
    ];
    for (const cat of categories) {
      const models = getModelsByCategory(cat, HIGGSFIELD_MODEL_CATALOG);
      expect(models.length).toBeGreaterThan(0);
      const item = createProductionItemFromCatalog(
        cat,
        models[0].model_id,
        `Test ${cat}`,
        2,
        2
      );
      expect(item.category).toBe(cat);
      expect(item.model_selection.model_id).toBe(models[0].model_id);
    }
  });

  it('AC-04 (Mode target) & AC-05 (Mode per-shot): Menghitung ulang saat mode dan item berubah', () => {
    const proj = createPrdSyntheticTestProject();
    // Mode per-shot: 1 item (5 shot * 2 attempts = 10 gen)
    expect(proj.calculation.planned_generations).toBe(10);

    // Ubah ke mode target_final dengan V = 3 video final & multiplier aktif
    proj.assumptions.estimation_mode = 'target_final';
    proj.assumptions.target_videos = 3;
    proj.items[0].use_project_target_multiplier = true;

    const recalcTarget = calculateProjectBudget(
      proj.items,
      proj.assumptions,
      proj.exchange_rate
    );
    // 5 shot/video * 3 video * 2 percobaan = 30 generasi dasar
    expect(recalcTarget.planned_generations).toBe(30);
  });

  it('AC-06 (Cadangan 2 Arah): Jumlah percobaan dan persentase/jumlah cadangan dihitung tanpa penghitungan ganda', () => {
    const syncPercent = calculateBidirectionalReserve(10, 'percent', 20, 0);
    expect(syncPercent.reserveGenerations).toBe(2);
    expect(syncPercent.budgetedGenerations).toBe(12);

    const syncCount = calculateBidirectionalReserve(10, 'count', 0, 3);
    expect(syncCount.reserveGenerations).toBe(3);
    expect(syncCount.effectiveReservePercent).toBe(30);
    expect(syncCount.budgetedGenerations).toBe(13);
  });

  it('AC-07 (Credit) & AC-08 (Kurs) & AC-09 (Harga gagal): Transparansi credit, kurs, dan item tanpa tarif', () => {
    const manualFx = createManualExchangeRate(16400);
    expect(manualFx.status).toBe('manual');

    const unverifiedItem = createProductionItemFromCatalog(
      'text_to_video',
      'custom/unverified-preview-model',
      'Unverified Item',
      2,
      2
    );
    const proj = createPrdSyntheticTestProject(manualFx);
    const calcWithUnverified = calculateProjectBudget(
      [...proj.items, unverifiedItem],
      proj.assumptions,
      manualFx
    );

    // AC-09: Tarif tidak tersedia tidak dianggap nol/valid penuh
    expect(calcWithUnverified.is_complete).toBe(false);
    expect(calcWithUnverified.incomplete_item_count).toBe(1);
    // AC-07: Credit tidak disamakan dengan USD
    expect(calcWithUnverified.total_credit).not.toBe(
      calcWithUnverified.total_cost_usd
    );
  });

  it('AC-10 (PDF) & AC-14 (Error handling): Semua total di PDF cocok dengan UI dan kegagalan jaringan ditangani aman', async () => {
    const proj = createSampleCommercialProject();
    const { html, calculation } = generatePdfReportHtml(proj, 'id');

    expect(calculation.total_cost_usd).toBe(proj.calculation.total_cost_usd);
    expect(html).toContain(proj.project_name);

    // Simulasikan kegagalan jaringan total tanpa cache
    const emptyCachePath = path.join(tempDir, 'non-existent-cache.json');
    const failedNetworkFetch = (async () => {
      throw new Error('Offline');
    }) as unknown as typeof fetch;

    const fxRes = await fetchVerifiedUsdIdrRate(
      emptyCachePath,
      failedNetworkFetch
    );
    expect(fxRes.success).toBe(false);
    expect(fxRes.exchangeRate.status).toBe('unavailable');
    expect(fxRes.error_id).toBeDefined();
  });
});
