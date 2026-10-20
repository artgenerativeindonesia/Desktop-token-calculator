import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  loadProjectFromFile,
  saveProjectToFileAtomic,
  updateRecentProjectsList,
} from '../src/main/storage/projectStorage';
import {
  createManualExchangeRate,
  fetchVerifiedUsdIdrRate,
  parseFrankfurterResponse,
  parseOpenErApiResponse,
} from '../src/main/connectors/fxConnector';
import {
  loadMergedCatalog,
  saveCustomRateOverride,
} from '../src/main/connectors/pricingConnector';
import { createPrdSyntheticTestProject } from '../src/shared/engine/calculationEngine';

describe('Storage (.aivbudget) & Data Connectors — PRD Bab 9, 10, 13.1, AC-01, AC-08, AC-12, AC-14', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aivbudget-test-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup error
    }
  });

  it('AC-01 & AC-12: Simpan proyek secara atomik (.aivbudget), tutup, dan buka kembali dengan data yang sama persis', () => {
    const project = createPrdSyntheticTestProject();
    const targetPath = path.join(tempDir, 'TestProject.aivbudget');

    const saveRes = saveProjectToFileAtomic(targetPath, project);
    expect(saveRes.success).toBe(true);
    expect(fs.existsSync(targetPath)).toBe(true);

    const loadRes = loadProjectFromFile(targetPath);
    expect(loadRes.success).toBe(true);
    expect(loadRes.project?.project_name).toBe(project.project_name);
    expect(loadRes.project?.calculation.total_cost_usd).toBe(24);
    expect(loadRes.project?.items.length).toBe(1);

    // Recent projects list update
    const recentPath = path.join(tempDir, 'recent.json');
    const recents = updateRecentProjectsList(recentPath, project, targetPath);
    expect(recents.length).toBe(1);
    expect(recents[0].project_name).toBe(project.project_name);
  });

  it('AC-14 & Bab 13.1: Menolak respons kurs yang tidak valid (0 atau negatif) dan tidak menggantinya dengan 0', () => {
    expect(parseFrankfurterResponse({ rates: { IDR: 0 } })).toBeNull();
    expect(parseFrankfurterResponse({ rates: { IDR: -15000 } })).toBeNull();
    expect(parseFrankfurterResponse({ invalid: true })).toBeNull();
    expect(parseOpenErApiResponse({ rates: { IDR: 0 } })).toBeNull();
  });

  it('AC-08: Mengambil kurs otomatis dari Frankfurter ECB API, menyimpannya ke cache, dan jatuh ke Stale saat offline', async () => {
    const cachePath = path.join(tempDir, 'fx-cache.json');

    // Simulasikan respons sukses dari Frankfurter API
    const mockOnlineFetch = (async () => ({
      ok: true,
      json: async () => ({
        amount: 1,
        base: 'USD',
        date: '2026-10-20',
        rates: { IDR: 16320.5 },
      }),
    })) as unknown as typeof fetch;

    const onlineResult = await fetchVerifiedUsdIdrRate(
      cachePath,
      mockOnlineFetch
    );
    expect(onlineResult.success).toBe(true);
    expect(onlineResult.exchangeRate.status).toBe('verified');
    expect(onlineResult.exchangeRate.rate).toBe(16320.5);

    // Simulasikan jaringan terputus (offline) -> harus jatuh ke cache dengan status 'stale'
    const mockOfflineFetch = (async () => {
      throw new Error('Network disconnected');
    }) as unknown as typeof fetch;

    const offlineResult = await fetchVerifiedUsdIdrRate(
      cachePath,
      mockOfflineFetch
    );
    expect(offlineResult.success).toBe(false);
    expect(offlineResult.usedFallbackCache).toBe(true);
    expect(offlineResult.exchangeRate.status).toBe('stale');
    expect(offlineResult.exchangeRate.rate).toBe(16320.5);
  });

  it('FR-08: Input kurs manual diberi label status manual secara eksplisit', () => {
    const manualFx = createManualExchangeRate(16500);
    expect(manualFx.status).toBe('manual');
    expect(manualFx.rate).toBe(16500);
    expect(manualFx.rate_type).toContain('Manual');
  });

  it('FR-08: Override tarif manual pada katalog disimpan secara lokal dengan status manual', () => {
    const overridesPath = path.join(tempDir, 'overrides.json');
    saveCustomRateOverride(overridesPath, {
      model_id: 'recraft/v4.1',
      price_value: 0.12,
      credit_cost: 3.0,
      updated_at: '2026-10-20T01:00:00.000Z',
    });

    const merged = loadMergedCatalog(overridesPath);
    const recraft = merged.find((m) => m.model_id === 'recraft/v4.1');
    expect(recraft?.pricing_variants[0].price_value).toBe(0.12);
    expect(recraft?.pricing_variants[0].status).toBe('manual');
  });
});
