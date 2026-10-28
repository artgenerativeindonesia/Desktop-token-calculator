"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefaultPrimaryShot = isDefaultPrimaryShot;
exports.calculateBidirectionalReserve = calculateBidirectionalReserve;
exports.calculateProjectBudget = calculateProjectBudget;
exports.createProductionItemFromCatalog = createProductionItemFromCatalog;
exports.createPrdSyntheticTestProject = createPrdSyntheticTestProject;
exports.createSampleCommercialProject = createSampleCommercialProject;
const decimal_js_1 = __importDefault(require("decimal.js"));
const project_1 = require("../types/project");
const higgsfieldCatalog_1 = require("../catalog/higgsfieldCatalog");
// PRD FR-14: Akurasi internal tinggi sebelum pembulatan tampilan
decimal_js_1.default.set({ precision: 28, rounding: decimal_js_1.default.ROUND_HALF_UP });
const ALL_CATEGORIES = [
    'text_to_image',
    'image_to_image',
    'image_to_video',
    'video_to_video',
    'text_to_video',
    'upscale_image',
    'upscale_video',
];
/**
 * Menentukan status bawaan apakah suatu kategori tergolong "Shot / Gambar Utama"
 * - Video (text_to_video, image_to_video): Shot Utama (true)
 * - Lainnya (upscale, text_to_image, image_to_image, dsb.): Aset Pendukung (false)
 */
function isDefaultPrimaryShot(category) {
    return category === 'text_to_video' || category === 'image_to_video';
}
/**
 * Sinkronisasi 2 Arah (Bidirectional) antara Persentase Cadangan (R)
 * dan Jumlah Generasi Cadangan (Greserve) sesuai PRD Bab 8.3 & klarifikasi user.
 */
function calculateBidirectionalReserve(plannedGenerations, inputMode, reservePercentInput, reserveCountInput) {
    const Gplanned = Math.max(0, Math.floor(plannedGenerations));
    const cleanPercent = Number.isFinite(reservePercentInput)
        ? Math.max(0, reservePercentInput)
        : 0;
    const cleanCount = Number.isFinite(reserveCountInput)
        ? Math.max(0, Math.floor(reserveCountInput))
        : 0;
    if (Gplanned === 0) {
        return {
            plannedGenerations: 0,
            reserveGenerations: inputMode === 'count' ? cleanCount : 0,
            budgetedGenerations: inputMode === 'count' ? cleanCount : 0,
            effectiveReservePercent: cleanPercent,
        };
    }
    if (inputMode === 'percent') {
        // Greserve = ceil(Gplanned * R)
        const R_decimal = new decimal_js_1.default(cleanPercent).dividedBy(100);
        const Greserve = R_decimal.times(Gplanned).ceil().toNumber();
        return {
            plannedGenerations: Gplanned,
            reserveGenerations: Greserve,
            budgetedGenerations: Gplanned + Greserve,
            effectiveReservePercent: new decimal_js_1.default(cleanPercent)
                .toDecimalPlaces(2)
                .toNumber(),
        };
    }
    else {
        // User memasukkan Greserve secara langsung -> hitung R (%) = (Greserve / Gplanned) * 100
        const effectivePercent = new decimal_js_1.default(cleanCount)
            .dividedBy(Gplanned)
            .times(100)
            .toDecimalPlaces(2)
            .toNumber();
        return {
            plannedGenerations: Gplanned,
            reserveGenerations: cleanCount,
            budgetedGenerations: Gplanned + cleanCount,
            effectiveReservePercent: effectivePercent,
        };
    }
}
/**
 * Mendistribusikan jumlah generasi cadangan (Greserve) ke setiap baris pekerjaan:
 * - Jika mode 'percent': Greserve,i = ceil(Gplanned,i * R)
 * - Jika mode 'count': mendistribusikan total Greserve secara proporsional terhadap Gplanned,i
 *   sehingga Σ Greserve,i === reserve_generations_override tepat tanpa selisih pembulatan.
 */
function allocateReserveAcrossItems(itemPlannedGenerations, assumptions) {
    const totalPlanned = itemPlannedGenerations.reduce((sum, g) => sum + g, 0);
    if (itemPlannedGenerations.length === 0 || totalPlanned === 0) {
        return itemPlannedGenerations.map(() => 0);
    }
    if (assumptions.reserve_input_mode === 'percent') {
        const rDecimal = new decimal_js_1.default(Math.max(0, assumptions.reserve_percent)).dividedBy(100);
        return itemPlannedGenerations.map((gPlanned) => rDecimal.times(gPlanned).ceil().toNumber());
    }
    // Mode 'count': pastikan total Greserve sama persis dengan angka yang diinput user
    const targetReserveTotal = Math.max(0, Math.floor(assumptions.reserve_generations_override));
    if (targetReserveTotal === 0) {
        return itemPlannedGenerations.map(() => 0);
    }
    const exactShares = itemPlannedGenerations.map((gPlanned) => new decimal_js_1.default(gPlanned).dividedBy(totalPlanned).times(targetReserveTotal));
    const floorAllocations = exactShares.map((s) => s.floor().toNumber());
    let remainder = targetReserveTotal - floorAllocations.reduce((sum, val) => sum + val, 0);
    // Urutkan indeks berdasarkan sisa desimal terbesar (Largest Remainder Method)
    const indicesByRemainder = exactShares
        .map((share, idx) => ({
        idx,
        frac: share.minus(share.floor()).toNumber(),
    }))
        .sort((a, b) => b.frac - a.frac);
    for (let i = 0; i < indicesByRemainder.length && remainder > 0; i++) {
        floorAllocations[indicesByRemainder[i].idx] += 1;
        remainder -= 1;
    }
    return floorAllocations;
}
/**
 * Mesin Kalkulasi Utama (PRD Bab 8.1 s/d 8.10)
 * Digunakan bersama oleh UI dan Generator PDF (PRD FR-06, FR-11, FR-14, NFR-01, NFR-02).
 */
function calculateProjectBudget(items, assumptions, exchangeRate) {
    const warnings = [];
    // Validasi kurs (PRD Bab 8.6 & 9.3)
    const hasValidExchangeRate = exchangeRate.rate !== null &&
        Number.isFinite(exchangeRate.rate) &&
        exchangeRate.rate > 0 &&
        exchangeRate.status !== 'unavailable' &&
        exchangeRate.status !== 'invalid';
    const fxDecimal = hasValidExchangeRate
        ? new decimal_js_1.default(exchangeRate.rate)
        : null;
    if (!hasValidExchangeRate) {
        warnings.push({
            code: 'UNAVAILABLE_FX',
            severity: 'error',
            message_id: 'Kurs USD/IDR belum tersedia atau tidak valid. Silakan perbarui kurs otomatis atau masukkan kurs manual.',
            message_en: 'USD/IDR exchange rate is unavailable or invalid. Please refresh automatically or enter a manual rate.',
        });
    }
    else if (exchangeRate.status === 'manual') {
        warnings.push({
            code: 'MANUAL_FX',
            severity: 'info',
            message_id: `Konversi Rupiah menggunakan kurs input manual pengguna (Rp ${exchangeRate.rate?.toLocaleString('id-ID')} / USD).`,
            message_en: `IDR conversion uses a user-entered manual exchange rate (IDR ${exchangeRate.rate?.toLocaleString('en-US')} / USD).`,
        });
    }
    else if (exchangeRate.status === 'stale') {
        warnings.push({
            code: 'STALE_FX',
            severity: 'warning',
            message_id: `Kurs USD/IDR menggunakan data cache terakhir (${exchangeRate.retrieved_at}) karena pembaruan jaringan gagal.`,
            message_en: `USD/IDR exchange rate uses cached data (${exchangeRate.retrieved_at}) because network refresh failed.`,
        });
    }
    // Validasi mode target_final (PRD Bab 8.8)
    if (assumptions.estimation_mode === 'target_final' &&
        (assumptions.target_videos <= 0 || assumptions.default_shots_per_video <= 0)) {
        warnings.push({
            code: 'MISSING_TARGET_ASSUMPTIONS',
            severity: 'warning',
            message_id: 'Mode Target Video Final membutuhkan jumlah video final dan asumsi jumlah shot per video lebih dari 0.',
            message_en: 'Target Final Video mode requires target video count and assumed shots per video greater than 0.',
        });
    }
    // Hitung Gplanned,i untuk setiap baris pekerjaan (PRD Bab 8.2)
    const itemEffectiveQuantities = [];
    const itemPlannedGenerations = [];
    for (const item of items) {
        const rawQty = Math.max(0, Math.floor(item.quantity));
        const attempts = Math.max(0, Math.floor(item.attempts_per_item));
        // Di v2.0.0, seluruh baris pekerjaan di Langkah 3 memproyeksikan kebutuhan untuk 1 video utuh
        const effectiveQty = rawQty;
        const gPlanned = effectiveQty * attempts;
        itemEffectiveQuantities.push(effectiveQty);
        itemPlannedGenerations.push(gPlanned);
    }
    // Alokasikan Greserve,i (PRD Bab 8.3)
    const itemReserveGenerations = allocateReserveAcrossItems(itemPlannedGenerations, assumptions);
    // Inisialisasi ringkasan per kategori
    const categorySummaries = {};
    for (const cat of ALL_CATEGORIES) {
        categorySummaries[cat] = {
            category: cat,
            item_count: 0,
            planned_generations: 0,
            reserve_generations: 0,
            budgeted_generations: 0,
            base_cost_usd: 0,
            reserve_cost_usd: 0,
            total_cost_usd: 0,
            total_cost_idr: fxDecimal ? 0 : null,
            total_credit: 0,
            has_incomplete_items: false,
        };
    }
    let totalPlannedGen = 0;
    let totalReserveGen = 0;
    let totalBudgetedGen = 0;
    let sumBaseUsd = new decimal_js_1.default(0);
    let sumReserveUsd = new decimal_js_1.default(0);
    let sumTotalUsd = new decimal_js_1.default(0);
    let sumTotalCredit = new decimal_js_1.default(0);
    let hasCreditItems = false;
    let incompleteItemCount = 0;
    let oneVideoPrimaryShotCount = 0;
    let oneVideoSupportingAssetCount = 0;
    const itemResults = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const isPrimaryShot = typeof item.is_primary_shot === 'boolean'
            ? item.is_primary_shot
            : isDefaultPrimaryShot(item.category);
        const effectiveQty = itemEffectiveQuantities[i];
        if (isPrimaryShot) {
            oneVideoPrimaryShotCount += effectiveQty;
        }
        else {
            oneVideoSupportingAssetCount += effectiveQty;
        }
        const attempts = Math.max(0, Math.floor(item.attempts_per_item));
        const gPlanned = itemPlannedGenerations[i];
        const gReserve = itemReserveGenerations[i];
        const gBudget = gPlanned + gReserve;
        totalPlannedGen += gPlanned;
        totalReserveGen += gReserve;
        totalBudgetedGen += gBudget;
        const itemWarnings = [];
        const pricing = item.pricing;
        // Satuan pengali berdasarkan pricing_unit (PRD Bab 8.4)
        const unitMultiplier = pricing.pricing_unit === 'per_second'
            ? Math.max(0, item.duration_seconds)
            : 1;
        const isUnlimitedActive = item.is_unlimited === true;
        const hasValidPrice = isUnlimitedActive
            ? unitMultiplier > 0 && gPlanned > 0
            : pricing.price_value !== null &&
                Number.isFinite(pricing.price_value) &&
                pricing.price_value > 0 &&
                pricing.status !== 'unavailable' &&
                pricing.status !== 'invalid' &&
                unitMultiplier > 0 &&
                gPlanned > 0;
        let baseCostUsd = null;
        let reserveCostUsd = null;
        let totalCostUsd = null;
        let baseCostIdr = null;
        let reserveCostIdr = null;
        let totalCostIdr = null;
        if (!hasValidPrice) {
            incompleteItemCount += 1;
            categorySummaries[item.category].has_incomplete_items = true;
            const reasonId = pricing.price_value === null || pricing.status === 'unavailable'
                ? `Tarif untuk "${item.label}" (${item.model_selection.model_name}) belum tersedia. Item ini tidak dihitung sebagai gratis.`
                : `Input kuantitas/durasi/tarif pada "${item.label}" belum lengkap atau bernilai 0.`;
            const reasonEn = pricing.price_value === null || pricing.status === 'unavailable'
                ? `Pricing for "${item.label}" (${item.model_selection.model_name}) is unavailable. This item is not treated as free.`
                : `Quantity/duration/rate input on "${item.label}" is incomplete or zero.`;
            itemWarnings.push(reasonId);
            warnings.push({
                code: 'UNAVAILABLE_PRICE',
                severity: 'error',
                message_id: reasonId,
                message_en: reasonEn,
                item_id: item.item_id,
            });
        }
        else if (isUnlimitedActive) {
            baseCostUsd = 0;
            reserveCostUsd = 0;
            totalCostUsd = 0;
            if (fxDecimal) {
                baseCostIdr = 0;
                reserveCostIdr = 0;
                totalCostIdr = 0;
            }
        }
        else {
            const priceDec = new decimal_js_1.default(pricing.price_value);
            const multDec = new decimal_js_1.default(unitMultiplier);
            // Rumus PRD Bab 8.4:
            // B_i = Gplanned,i * mult * P_i
            // Breserve,i = Greserve,i * mult * P_i
            const bBaseDec = new decimal_js_1.default(gPlanned).times(multDec).times(priceDec);
            const bReserveDec = new decimal_js_1.default(gReserve).times(multDec).times(priceDec);
            const bTotalDec = bBaseDec.plus(bReserveDec);
            sumBaseUsd = sumBaseUsd.plus(bBaseDec);
            sumReserveUsd = sumReserveUsd.plus(bReserveDec);
            sumTotalUsd = sumTotalUsd.plus(bTotalDec);
            baseCostUsd = bBaseDec.toDecimalPlaces(4).toNumber();
            reserveCostUsd = bReserveDec.toDecimalPlaces(4).toNumber();
            totalCostUsd = bTotalDec.toDecimalPlaces(4).toNumber();
            if (fxDecimal) {
                baseCostIdr = bBaseDec.times(fxDecimal).toDecimalPlaces(2).toNumber();
                reserveCostIdr = bReserveDec
                    .times(fxDecimal)
                    .toDecimalPlaces(2)
                    .toNumber();
                totalCostIdr = bTotalDec.times(fxDecimal).toDecimalPlaces(2).toNumber();
            }
            if (pricing.status === 'manual') {
                warnings.push({
                    code: 'MANUAL_PRICE',
                    severity: 'info',
                    message_id: `Item "${item.label}" menggunakan tarif input manual (USD ${pricing.price_value}).`,
                    message_en: `Item "${item.label}" uses a manual rate input (USD ${pricing.price_value}).`,
                    item_id: item.item_id,
                });
            }
            else if (pricing.status === 'stale') {
                warnings.push({
                    code: 'STALE_PRICE',
                    severity: 'warning',
                    message_id: `Item "${item.label}" menggunakan data tarif yang usang (${pricing.retrieved_at}).`,
                    message_en: `Item "${item.label}" uses stale pricing data (${pricing.retrieved_at}).`,
                    item_id: item.item_id,
                });
            }
        }
        // Perhitungan Credit (PRD Bab 8.5): Ctotal = Σ (Gbudget,i * C_i)
        let itemTotalCredit = null;
        if (isUnlimitedActive && gBudget > 0) {
            itemTotalCredit = 0;
            hasCreditItems = true;
        }
        else if (pricing.credit_cost !== null &&
            Number.isFinite(pricing.credit_cost) &&
            pricing.credit_cost >= 0 &&
            gBudget > 0) {
            const creditMult = pricing.credit_unit === 'per_second'
                ? Math.max(0, item.duration_seconds)
                : 1;
            if (creditMult > 0) {
                const creditDec = new decimal_js_1.default(gBudget)
                    .times(creditMult)
                    .times(pricing.credit_cost);
                sumTotalCredit = sumTotalCredit.plus(creditDec);
                itemTotalCredit = creditDec.toDecimalPlaces(2).toNumber();
                hasCreditItems = true;
            }
        }
        // Update Category Summary
        const catSum = categorySummaries[item.category];
        catSum.item_count += 1;
        catSum.planned_generations += gPlanned;
        catSum.reserve_generations += gReserve;
        catSum.budgeted_generations += gBudget;
        if (baseCostUsd !== null && reserveCostUsd !== null && totalCostUsd !== null) {
            catSum.base_cost_usd = new decimal_js_1.default(catSum.base_cost_usd)
                .plus(baseCostUsd)
                .toDecimalPlaces(4)
                .toNumber();
            catSum.reserve_cost_usd = new decimal_js_1.default(catSum.reserve_cost_usd)
                .plus(reserveCostUsd)
                .toDecimalPlaces(4)
                .toNumber();
            catSum.total_cost_usd = new decimal_js_1.default(catSum.total_cost_usd)
                .plus(totalCostUsd)
                .toDecimalPlaces(4)
                .toNumber();
            if (fxDecimal && catSum.total_cost_idr !== null) {
                catSum.total_cost_idr = new decimal_js_1.default(catSum.total_cost_usd)
                    .times(fxDecimal)
                    .toDecimalPlaces(2)
                    .toNumber();
            }
        }
        if (itemTotalCredit !== null) {
            catSum.total_credit = new decimal_js_1.default(catSum.total_credit)
                .plus(itemTotalCredit)
                .toDecimalPlaces(2)
                .toNumber();
        }
        itemResults.push({
            item_id: item.item_id,
            label: item.label,
            category: item.category,
            is_primary_shot: isPrimaryShot,
            model_name: item.model_selection.model_name,
            effective_quantity: effectiveQty,
            attempts_per_item: attempts,
            planned_generations: gPlanned,
            reserve_generations: gReserve,
            budgeted_generations: gBudget,
            unit_multiplier: unitMultiplier,
            pricing_unit: pricing.pricing_unit,
            unit_price_usd: pricing.price_value,
            base_cost_usd: baseCostUsd,
            reserve_cost_usd: reserveCostUsd,
            total_cost_usd: totalCostUsd,
            base_cost_idr: baseCostIdr,
            reserve_cost_idr: reserveCostIdr,
            total_cost_idr: totalCostIdr,
            unit_credit: pricing.credit_cost,
            total_credit: itemTotalCredit,
            pricing_status: pricing.status,
            is_item_complete: hasValidPrice,
            warnings: itemWarnings,
        });
    }
    // Persentase cadangan efektif (PRD Bab 8.3)
    const effectiveReservePercent = assumptions.reserve_input_mode === 'percent'
        ? new decimal_js_1.default(Math.max(0, assumptions.reserve_percent))
            .toDecimalPlaces(2)
            .toNumber()
        : totalPlannedGen > 0
            ? new decimal_js_1.default(totalReserveGen)
                .dividedBy(totalPlannedGen)
                .times(100)
                .toDecimalPlaces(2)
                .toNumber()
            : 0;
    // --- SUB-TOTAL PROYEKSI 1 VIDEO (Item di Langkah 3 memproyeksikan 1 video) ---
    const oneVideoPlannedGen = totalPlannedGen;
    const oneVideoReserveGen = totalReserveGen;
    const oneVideoBudgetedGen = totalBudgetedGen;
    const oneVideoBaseUsd = sumBaseUsd.toDecimalPlaces(4).toNumber();
    const oneVideoReserveUsd = sumReserveUsd.toDecimalPlaces(4).toNumber();
    const oneVideoTotalUsd = sumTotalUsd.toDecimalPlaces(4).toNumber();
    const oneVideoBaseIdr = fxDecimal
        ? sumBaseUsd.times(fxDecimal).toDecimalPlaces(2).toNumber()
        : null;
    const oneVideoReserveIdr = fxDecimal
        ? sumReserveUsd.times(fxDecimal).toDecimalPlaces(2).toNumber()
        : null;
    const oneVideoTotalIdr = fxDecimal
        ? sumTotalUsd.times(fxDecimal).toDecimalPlaces(2).toNumber()
        : null;
    const oneVideoTotalCredit = hasCreditItems
        ? sumTotalCredit.toDecimalPlaces(2).toNumber()
        : null;
    // --- MULTI-VIDEO MULTIPLIER (LANGKAH 2) ---
    const hasTargetVideosInput = Number.isFinite(assumptions.target_videos) && assumptions.target_videos > 0;
    const targetVideosCount = hasTargetVideosInput
        ? Math.floor(assumptions.target_videos)
        : 1;
    const vDec = new decimal_js_1.default(targetVideosCount);
    // Grand totals across all target_videos
    const finalPlannedGen = oneVideoPlannedGen * targetVideosCount;
    const finalReserveGen = oneVideoReserveGen * targetVideosCount;
    const finalBudgetedGen = oneVideoBudgetedGen * targetVideosCount;
    const finalBaseUsd = sumBaseUsd.times(vDec).toDecimalPlaces(4).toNumber();
    const finalReserveUsd = sumReserveUsd.times(vDec).toDecimalPlaces(4).toNumber();
    const finalTotalUsd = sumTotalUsd.times(vDec).toDecimalPlaces(4).toNumber();
    const finalBaseIdr = fxDecimal
        ? sumBaseUsd.times(fxDecimal).times(vDec).toDecimalPlaces(2).toNumber()
        : null;
    const finalReserveIdr = fxDecimal
        ? sumReserveUsd.times(fxDecimal).times(vDec).toDecimalPlaces(2).toNumber()
        : null;
    const finalTotalIdr = fxDecimal
        ? sumTotalUsd.times(fxDecimal).times(vDec).toDecimalPlaces(2).toNumber()
        : null;
    const finalTotalCredit = hasCreditItems
        ? sumTotalCredit.times(vDec).toDecimalPlaces(2).toNumber()
        : null;
    // Multi-video Category Summaries
    const multiVideoCategorySummaries = {};
    for (const cat of ALL_CATEGORIES) {
        const s = categorySummaries[cat];
        multiVideoCategorySummaries[cat] = {
            ...s,
            planned_generations: s.planned_generations * targetVideosCount,
            reserve_generations: s.reserve_generations * targetVideosCount,
            budgeted_generations: s.budgeted_generations * targetVideosCount,
            base_cost_usd: new decimal_js_1.default(s.base_cost_usd)
                .times(vDec)
                .toDecimalPlaces(4)
                .toNumber(),
            reserve_cost_usd: new decimal_js_1.default(s.reserve_cost_usd)
                .times(vDec)
                .toDecimalPlaces(4)
                .toNumber(),
            total_cost_usd: new decimal_js_1.default(s.total_cost_usd)
                .times(vDec)
                .toDecimalPlaces(4)
                .toNumber(),
            total_cost_idr: s.total_cost_idr !== null
                ? new decimal_js_1.default(s.total_cost_idr)
                    .times(vDec)
                    .toDecimalPlaces(2)
                    .toNumber()
                : null,
            total_credit: new decimal_js_1.default(s.total_credit)
                .times(vDec)
                .toDecimalPlaces(2)
                .toNumber(),
        };
    }
    // Biaya per video final (Bvideo = oneVideoTotalUsd) & per menit final (Bminute = Btotal / M) (PRD Bab 8.7)
    let costPerVideoUsd = null;
    let costPerVideoIdr = null;
    if (hasTargetVideosInput) {
        costPerVideoUsd = oneVideoTotalUsd;
        costPerVideoIdr = oneVideoTotalIdr;
    }
    else {
        warnings.push({
            code: 'ZERO_DIVISOR_VIDEO',
            severity: 'info',
            message_id: 'Rata-rata biaya per video jadi tidak dihitung karena target jumlah video jadi masih bernilai 0.',
            message_en: 'Average cost per final video is not calculated because the target video count is 0.',
        });
    }
    let costPerMinuteUsd = null;
    let costPerMinuteIdr = null;
    if (Number.isFinite(assumptions.final_duration_minutes) &&
        assumptions.final_duration_minutes > 0) {
        const mDec = new decimal_js_1.default(assumptions.final_duration_minutes);
        const totalUsdDec = sumTotalUsd.times(vDec);
        costPerMinuteUsd = totalUsdDec
            .dividedBy(mDec)
            .toDecimalPlaces(4)
            .toNumber();
        if (fxDecimal) {
            costPerMinuteIdr = totalUsdDec
                .times(fxDecimal)
                .dividedBy(mDec)
                .toDecimalPlaces(2)
                .toNumber();
        }
    }
    else {
        warnings.push({
            code: 'ZERO_DIVISOR_MINUTE',
            severity: 'info',
            message_id: 'Rata-rata biaya per menit video tidak dihitung karena target durasi video masih bernilai 0.',
            message_en: 'Average cost per final minute is not calculated because the final video duration is 0.',
        });
    }
    const isComplete = items.length > 0 && incompleteItemCount === 0 && hasValidExchangeRate;
    return {
        planned_generations: finalPlannedGen,
        reserve_generations: finalReserveGen,
        budgeted_generations: finalBudgetedGen,
        effective_reserve_percent: effectiveReservePercent,
        base_cost_usd: finalBaseUsd,
        reserve_cost_usd: finalReserveUsd,
        total_cost_usd: finalTotalUsd,
        base_cost_idr: finalBaseIdr,
        reserve_cost_idr: finalReserveIdr,
        total_cost_idr: finalTotalIdr,
        total_credit: finalTotalCredit,
        has_credit_items: hasCreditItems,
        // Proyeksi 1 Video Murni
        target_videos: targetVideosCount,
        one_video_planned_generations: oneVideoPlannedGen,
        one_video_reserve_generations: oneVideoReserveGen,
        one_video_budgeted_generations: oneVideoBudgetedGen,
        one_video_base_cost_usd: oneVideoBaseUsd,
        one_video_reserve_cost_usd: oneVideoReserveUsd,
        one_video_total_cost_usd: oneVideoTotalUsd,
        one_video_base_cost_idr: oneVideoBaseIdr,
        one_video_reserve_cost_idr: oneVideoReserveIdr,
        one_video_total_cost_idr: oneVideoTotalIdr,
        one_video_total_credit: oneVideoTotalCredit,
        // Klasifikasi Shot / Gambar Utama vs Aset Pendukung (v1.9.0)
        one_video_primary_shot_count: oneVideoPrimaryShotCount,
        one_video_supporting_asset_count: oneVideoSupportingAssetCount,
        total_primary_shots: new decimal_js_1.default(oneVideoPrimaryShotCount).times(vDec).toNumber(),
        total_supporting_assets: new decimal_js_1.default(oneVideoSupportingAssetCount).times(vDec).toNumber(),
        cost_per_video_usd: costPerVideoUsd,
        cost_per_video_idr: costPerVideoIdr,
        cost_per_minute_usd: costPerMinuteUsd,
        cost_per_minute_idr: costPerMinuteIdr,
        is_complete: isComplete,
        incomplete_item_count: incompleteItemCount,
        item_results: itemResults,
        category_summaries: multiVideoCategorySummaries,
        warnings,
        calculated_at: new Date().toISOString(),
    };
}
/**
 * Helper untuk membuat ProductionItem baru dari katalog model Higgsfield
 */
function createProductionItemFromCatalog(category, modelId, label, quantity = 1, attempts = 2, customDurationSeconds) {
    const model = (0, higgsfieldCatalog_1.getModelById)(modelId) ||
        higgsfieldCatalog_1.HIGGSFIELD_MODEL_CATALOG.find((m) => m.supported_categories.includes(category)) ||
        higgsfieldCatalog_1.HIGGSFIELD_MODEL_CATALOG[0];
    const defaultParams = (0, higgsfieldCatalog_1.getDefaultParametersForModel)(model);
    const pricing = (0, higgsfieldCatalog_1.resolveModelPricing)(model, defaultParams);
    return {
        item_id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        category,
        label,
        quantity,
        quantity_type: model.default_quantity_type,
        duration_seconds: customDurationSeconds !== undefined
            ? customDurationSeconds
            : model.default_duration_seconds,
        attempts_per_item: attempts,
        use_project_target_multiplier: false,
        is_primary_shot: isDefaultPrimaryShot(category),
        model_selection: {
            provider: model.provider,
            model_id: model.model_id,
            model_name: model.model_name,
            category,
            parameter_values: defaultParams,
        },
        pricing,
    };
}
/**
 * Membuat Proyek Contoh Uji Matematika Sintetis PRD Bab 8.10 (Halaman 12)
 * - Generasi dasar = 10
 * - Cadangan = 20% -> ceil(10 * 0.20) = 2
 * - Total generasi dianggarkan = 12
 * - Tarif sintetis untuk uji = USD 2 per generasi
 * - Biaya dasar = USD 20, Biaya cadangan = USD 4, Total = USD 24
 */
function createPrdSyntheticTestProject(currentExchangeRate) {
    const now = new Date().toISOString();
    const fx = currentExchangeRate ?? {
        base_currency: 'USD',
        quote_currency: 'IDR',
        rate: 16250,
        rate_type: 'Manual Input (Contoh Uji PRD)',
        source_name: 'Input Uji Sintetis PRD Bab 8.10',
        source_url: 'local://prd-section-8.10',
        retrieved_at: now,
        status: 'manual',
    };
    const assumptions = {
        estimation_mode: 'per_shot',
        target_videos: 1,
        final_duration_minutes: 1,
        default_shots_per_video: 5,
        default_attempts_per_shot: 2,
        reserve_input_mode: 'percent',
        reserve_percent: 20,
        reserve_generations_override: 2,
    };
    const items = [
        {
            item_id: 'prd_test_item_1',
            category: 'text_to_video',
            label: 'Uji Matematika Sintetis PRD Bab 8.10 (10 Generasi Dasar)',
            quantity: 5, // S = 5 shot
            quantity_type: 'shot',
            duration_seconds: 5,
            attempts_per_item: 2, // A = 2 percobaan/shot -> Gplanned = 10
            use_project_target_multiplier: false,
            model_selection: {
                provider: 'Higgsfield',
                model_id: 'kling-video/v3.0',
                model_name: 'Model Uji Sintetis PRD Bab 8.10',
                category: 'text_to_video',
                parameter_values: { resolution: '720p_std', sound: 'on', aspect_ratio: '16:9' },
            },
            pricing: {
                pricing_unit: 'per_generation',
                price_value: 2.0, // USD 2 per generasi sesuai tabel PRD Bab 8.10
                currency: 'USD',
                credit_cost: 10,
                credit_unit: 'per_generation',
                source_name: 'Contoh Uji Sintetis PRD Bab 8.10 (Bukan Tarif Aktual)',
                source_url: 'local://prd-section-8.10',
                retrieved_at: now,
                status: 'manual',
            },
            notes: 'Angka tarif USD 2 per generasi sesuai contoh uji sintetis PRD Halaman 12.',
        },
    ];
    const calculation = calculateProjectBudget(items, assumptions, fx);
    return {
        schema_version: project_1.CURRENT_SCHEMA_VERSION,
        project_id: 'proj_prd_synthetic_8_10',
        project_name: 'Proyek Uji Matematika Sintetis (PRD Bab 8.10)',
        created_at: now,
        updated_at: now,
        currency: 'USD',
        language: 'id',
        assumptions,
        items,
        exchange_rate: fx,
        calculation,
        export_settings: {
            report_title: 'Laporan Uji Matematika Sintetis PRD Bab 8.10',
            export_date: now.slice(0, 10),
            export_language: 'id',
            prepared_by: 'QA / Produser Video AI',
            client_or_team_name: 'Tim Internal Produksi AI',
            included_sections: {
                executive_summary: true,
                production_assumptions: true,
                stage_breakdown: true,
                credit_breakdown: true,
                exchange_rate_info: true,
                warnings_and_audit: true,
                unit_cost_metrics: true,
            },
        },
    };
}
/**
 * Membuat Proyek Contoh Produksi Komersial Lengkap (Mencakup ke-5 Kategori Proses AI)
 */
function createSampleCommercialProject(currentExchangeRate) {
    const now = new Date().toISOString();
    const fx = currentExchangeRate ?? {
        base_currency: 'USD',
        quote_currency: 'IDR',
        rate: 16250,
        rate_type: 'ECB Reference Rate (Cached Default)',
        source_name: 'Frankfurter API (European Central Bank)',
        source_url: 'https://api.frankfurter.dev/latest?from=USD&to=IDR',
        retrieved_at: higgsfieldCatalog_1.CATALOG_RETRIEVED_AT,
        status: 'stale',
    };
    const assumptions = {
        estimation_mode: 'per_shot',
        target_videos: 1,
        final_duration_minutes: 1.5,
        default_shots_per_video: 6,
        default_attempts_per_shot: 2,
        reserve_input_mode: 'count',
        reserve_percent: 0,
        reserve_generations_override: 0,
    };
    const item1 = createProductionItemFromCatalog('text_to_image', 'higgsfield-ai/soul/v2/standard', 'Tahap 1: Key Visual & Karakter Utama (SOUL V2)', 4, 2, 0);
    item1.item_id = 'sample_item_t2i';
    const item1b = createProductionItemFromCatalog('image_to_image', 'higgsfield-ai/soul/v2/reference', 'Tahap 2: Variasi Pose & Gaya Karakter (Image to Image)', 3, 2, 0);
    item1b.item_id = 'sample_item_i2i';
    const item2 = createProductionItemFromCatalog('image_to_video', 'kling-video/v3.0', 'Tahap 3: Animasi Shot Produk & Karakter (Kling 3.0)', 4, 2, 5);
    item2.item_id = 'sample_item_i2v';
    const item3 = createProductionItemFromCatalog('text_to_video', 'bytedance/seedance-2.5', 'Tahap 4: B-Roll Sinematik Drone & Lingkungan (Seedance 2.5)', 2, 2, 8);
    item3.item_id = 'sample_item_t2v';
    const item4 = createProductionItemFromCatalog('video_to_video', 'higgsfield-ai/genjutsu', 'Tahap 5: Motion Transfer & VFX Restyle (Genjutsu)', 2, 2, 5);
    item4.item_id = 'sample_item_v2v';
    const item5 = createProductionItemFromCatalog('upscale_image', 'recraft/v4.1-utility-pro', 'Tahap 6: Upscale Image Key Visual ke 2K (Recraft Utility Pro)', 4, 2, 0);
    item5.item_id = 'sample_item_upscale_img';
    const item6 = createProductionItemFromCatalog('upscale_video', 'higgsfield-ai/video-upscale-4k', 'Tahap 7: Mastering Final 4K Upscale Video', 6, 2, 5);
    item6.item_id = 'sample_item_upscale_vid';
    const items = [item1, item1b, item2, item3, item4, item5, item6];
    const calculation = calculateProjectBudget(items, assumptions, fx);
    return {
        schema_version: project_1.CURRENT_SCHEMA_VERSION,
        project_id: `proj_${Date.now()}`,
        project_name: 'Kampanye Video Iklan Komersial AI 2026',
        created_at: now,
        updated_at: now,
        currency: 'USD',
        language: 'id',
        assumptions,
        items,
        exchange_rate: fx,
        calculation,
        export_settings: {
            report_title: 'Estimasi Anggaran Produksi Video AI - Kampanye Komersial',
            export_date: now.slice(0, 10),
            export_language: 'id',
            prepared_by: 'Produser Video AI',
            client_or_team_name: 'Tim Kreatif & Produksi',
            included_sections: {
                executive_summary: true,
                production_assumptions: true,
                stage_breakdown: true,
                credit_breakdown: true,
                exchange_rate_info: true,
                warnings_and_audit: true,
                unit_cost_metrics: true,
            },
        },
    };
}
