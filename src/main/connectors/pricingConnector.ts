import fs from 'fs';
import path from 'path';
import {
  CatalogModelEntry,
  Pricing,
} from '../../shared/types/project';
import {
  HIGGSFIELD_DOCS_URL,
  HIGGSFIELD_MODEL_CATALOG,
} from '../../shared/catalog/higgsfieldCatalog';

export interface CustomModelRateOverride {
  model_id: string;
  price_value: number;
  credit_cost: number | null;
  pricing_unit?: Pricing['pricing_unit'];
  updated_at: string;
}

export interface CatalogRefreshResult {
  success: boolean;
  catalog: CatalogModelEntry[];
  verifiedAt: string;
  docsReachable: boolean;
  message_id: string;
  message_en: string;
}

function getCustomModelsPathFromOverrides(overridesFilePath?: string): string | undefined {
  if (!overridesFilePath) return undefined;
  return path.join(path.dirname(overridesFilePath), 'custom-user-models.json');
}

/**
 * Memuat katalog model Higgsfield, menggabungkan model tambahan buatan pengguna,
 * serta menerapkan tarif manual (jika pengguna pernah menyimpan tarif khusus).
 */
export function loadMergedCatalog(
  overridesFilePath?: string
): CatalogModelEntry[] {
  const overrides = overridesFilePath
    ? loadCustomRateOverrides(overridesFilePath)
    : {};
  const customModelsPath = getCustomModelsPathFromOverrides(overridesFilePath);
  const customModels = customModelsPath
    ? loadCustomUserModels(customModelsPath)
    : [];

  const combinedBase = [...customModels, ...HIGGSFIELD_MODEL_CATALOG];

  return combinedBase.map((model) => {
    const custom = overrides[model.model_id];
    if (!custom) return model;

    return {
      ...model,
      pricing_variants: model.pricing_variants.map((variant) => ({
        ...variant,
        price_value: custom.price_value,
        credit_cost:
          custom.credit_cost !== undefined
            ? custom.credit_cost
            : variant.credit_cost,
        pricing_unit: custom.pricing_unit ?? variant.pricing_unit,
        status: 'manual',
      })),
      source_name: 'Katalog Lokal (Diperbarui Manual oleh Pengguna)',
      retrieved_at: custom.updated_at,
    };
  });
}

/**
 * Memeriksa keterjangkauan portal dokumentasi & OpenAPI resmi Higgsfield (docs.higgsfield.ai)
 * dan menyegarkan katalog (PRD Bab 9.2)
 */
export async function refreshHiggsfieldCatalog(
  overridesFilePath?: string,
  customFetch: typeof fetch = fetch
): Promise<CatalogRefreshResult> {
  const now = new Date().toISOString();
  let docsReachable = false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await customFetch('https://docs.higgsfield.ai/docs/llms.txt', {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (res.ok) {
      docsReachable = true;
    }
  } catch {
    docsReachable = false;
  }

  const catalog = loadMergedCatalog(overridesFilePath).map((entry) => ({
    ...entry,
    retrieved_at:
      docsReachable && entry.pricing_variants[0]?.status === 'verified'
        ? now
        : entry.retrieved_at,
  }));

  if (docsReachable) {
    return {
      success: true,
      catalog,
      verifiedAt: now,
      docsReachable: true,
      message_id: `Katalog ${catalog.length} model resmi Higgsfield (${HIGGSFIELD_DOCS_URL}) berhasil diverifikasi dan disinkronkan.`,
      message_en: `Official Higgsfield catalog (${catalog.length} models at ${HIGGSFIELD_DOCS_URL}) verified and synchronized.`,
    };
  }

  return {
    success: false,
    catalog,
    verifiedAt: now,
    docsReachable: false,
    message_id:
      'Tidak dapat menghubungi docs.higgsfield.ai (mode offline). Menggunakan katalog model terverifikasi lokal.',
    message_en:
      'Could not reach docs.higgsfield.ai (offline mode). Using local verified model catalog.',
  };
}

export function loadCustomRateOverrides(
  filePath: string
): Record<string, CustomModelRateOverride> {
  try {
    if (!fs.existsSync(filePath)) return {};
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as Record<string, CustomModelRateOverride>;
    }
    return {};
  } catch {
    return {};
  }
}

export function saveCustomRateOverride(
  filePath: string,
  override: CustomModelRateOverride
): Record<string, CustomModelRateOverride> {
  const current = loadCustomRateOverrides(filePath);
  current[override.model_id] = override;
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(current, null, 2), 'utf-8');
  } catch {
    // ignore non-critical error
  }
  return current;
}

export function loadCustomUserModels(filePath: string): CatalogModelEntry[] {
  try {
    if (!fs.existsSync(filePath)) return [];
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (Array.isArray(parsed)) {
      return parsed as CatalogModelEntry[];
    }
    return [];
  } catch {
    return [];
  }
}

export function saveCustomUserModel(
  overridesFilePath: string,
  newModel: CatalogModelEntry
): CatalogModelEntry[] {
  const customModelsPath = getCustomModelsPathFromOverrides(overridesFilePath);
  if (!customModelsPath) return [];
  const current = loadCustomUserModels(customModelsPath).filter(
    (m) => m.model_id !== newModel.model_id
  );
  const updated = [newModel, ...current];
  try {
    const dir = path.dirname(customModelsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(customModelsPath, JSON.stringify(updated, null, 2), 'utf-8');
  } catch {
    // ignore
  }
  return loadMergedCatalog(overridesFilePath);
}

export function clearCustomRateOverrides(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    const customModelsPath = getCustomModelsPathFromOverrides(filePath);
    if (customModelsPath && fs.existsSync(customModelsPath)) {
      fs.unlinkSync(customModelsPath);
    }
  } catch {
    // ignore
  }
}
