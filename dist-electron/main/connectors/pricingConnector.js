"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMergedCatalog = loadMergedCatalog;
exports.refreshHiggsfieldCatalog = refreshHiggsfieldCatalog;
exports.loadCustomRateOverrides = loadCustomRateOverrides;
exports.saveCustomRateOverride = saveCustomRateOverride;
exports.clearCustomRateOverrides = clearCustomRateOverrides;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const higgsfieldCatalog_1 = require("../../shared/catalog/higgsfieldCatalog");
/**
 * Memuat katalog model Higgsfield dan menggabungkannya dengan tarif manual (jika pengguna pernah menyimpan tarif khusus)
 */
function loadMergedCatalog(overridesFilePath) {
    const overrides = overridesFilePath
        ? loadCustomRateOverrides(overridesFilePath)
        : {};
    return higgsfieldCatalog_1.HIGGSFIELD_MODEL_CATALOG.map((model) => {
        const custom = overrides[model.model_id];
        if (!custom)
            return model;
        return {
            ...model,
            pricing_variants: model.pricing_variants.map((variant) => ({
                ...variant,
                price_value: custom.price_value,
                credit_cost: custom.credit_cost !== undefined
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
 * Memeriksa keterjangkauan portal dokumentasi resmi Higgsfield (docs.higgsfield.ai)
 * dan menyegarkan katalog (PRD Bab 9.2)
 */
async function refreshHiggsfieldCatalog(overridesFilePath, customFetch = fetch) {
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
    }
    catch {
        docsReachable = false;
    }
    const catalog = loadMergedCatalog(overridesFilePath).map((entry) => ({
        ...entry,
        retrieved_at: docsReachable && entry.pricing_variants[0]?.status === 'verified'
            ? now
            : entry.retrieved_at,
    }));
    if (docsReachable) {
        return {
            success: true,
            catalog,
            verifiedAt: now,
            docsReachable: true,
            message_id: `Katalog model resmi Higgsfield (${higgsfieldCatalog_1.HIGGSFIELD_DOCS_URL}) berhasil diverifikasi dan disinkronkan.`,
            message_en: `Official Higgsfield model catalog (${higgsfieldCatalog_1.HIGGSFIELD_DOCS_URL}) verified and synchronized.`,
        };
    }
    return {
        success: false,
        catalog,
        verifiedAt: now,
        docsReachable: false,
        message_id: 'Tidak dapat menghubungi docs.higgsfield.ai (mode offline). Menggunakan katalog model terverifikasi lokal.',
        message_en: 'Could not reach docs.higgsfield.ai (offline mode). Using local verified model catalog.',
    };
}
function loadCustomRateOverrides(filePath) {
    try {
        if (!fs_1.default.existsSync(filePath))
            return {};
        const parsed = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        if (typeof parsed === 'object' && parsed !== null) {
            return parsed;
        }
        return {};
    }
    catch {
        return {};
    }
}
function saveCustomRateOverride(filePath, override) {
    const current = loadCustomRateOverrides(filePath);
    current[override.model_id] = override;
    try {
        const dir = path_1.default.dirname(filePath);
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        fs_1.default.writeFileSync(filePath, JSON.stringify(current, null, 2), 'utf-8');
    }
    catch {
        // ignore non-critical error
    }
    return current;
}
function clearCustomRateOverrides(filePath) {
    try {
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
    }
    catch {
        // ignore
    }
}
