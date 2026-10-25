import React, { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import {
  CATEGORY_LABELS,
  formatCurrencyIdr,
  formatCurrencyUsd,
  PRICING_UNIT_LABELS,
  QUANTITY_TYPE_LABELS,
  SHORT_CATEGORY_LABELS,
  UI_TEXT,
} from '../i18n/translations';
import { getModelsByCategory } from '../../shared/catalog/higgsfieldCatalog';
import { ProcessCategory } from '../../shared/types/project';
import { StatusBadge } from './StatusBadge';
import { FrostedModal } from './FrostedModal';
import { StepFlowBar } from './StepFlowBar';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Layers,
  Plus,
  RotateCcw,
  Sliders,
  Trash2,
} from 'lucide-react';

const ALL_CATEGORIES: ProcessCategory[] = [
  'text_to_image',
  'image_to_image',
  'image_to_video',
  'video_to_video',
  'text_to_video',
  'upscale_image',
  'upscale_video',
];

export const ProductionPlannerView: React.FC = () => {
  const {
    project,
    catalog,
    language,
    theme,
    addProductionItem,
    duplicateProductionItem,
    removeProductionItem,
    updateProductionItemField,
    changeItemCategory,
    changeItemModel,
    changeItemParameter,
    setManualItemPricing,
    resetItemPricingToCatalog,
    toggleItemUnlimited,
    usdPerCredit,
  } = useProjectStore();

  const tierBadgeClass = (badge?: string) => {
    if (badge === 'NEW')
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (badge === 'PREMIUM')
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (badge === 'POPULER')
      return 'bg-[#0099ff]/20 text-[#7acaff] border-[#0099ff]/40';
    return '';
  };

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<
    ProcessCategory | 'all'
  >('all');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showManualPriceSection, setShowManualPriceSection] = useState(false);

  const t = UI_TEXT[language];
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';
  const heroCardClass =
    theme === 'dark' ? 'vv-card-hero-dark' : 'vv-card-hero-light';
  const inputClass =
    theme === 'dark' ? 'glass-input-dark' : 'glass-input-light';
  const { items, calculation, assumptions } = project;

  const filteredItems = items
    .map((item, idx) => ({ item, idx, calcRow: calculation.item_results[idx] }))
    .filter(
      ({ item }) =>
        selectedCategoryFilter === 'all' ||
        item.category === selectedCategoryFilter
    );

  const activeEditEntry =
    editingItemId !== null
      ? items
          .map((item, idx) => ({
            item,
            idx,
            calcRow: calculation.item_results[idx],
          }))
          .find((entry) => entry.item.item_id === editingItemId) ?? null
      : null;

  const handleAddAndOpenModal = (cat: ProcessCategory = 'text_to_video') => {
    addProductionItem(cat);
    // Open modal for the newly added item at the end of the list
    setTimeout(() => {
      const latestItems = useProjectStore.getState().project.items;
      const newest = latestItems[latestItems.length - 1];
      if (newest) {
        setShowManualPriceSection(false);
        setEditingItemId(newest.item_id);
      }
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* =====================================================================
       * TIER 1: DOMINANT FOCAL POINT — PLANNER HERO & LIVE RUNNING TOTAL
       * ===================================================================== */}
      <div
        className={`${heroCardClass} rounded-[18px] p-6 md:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6`}
      >
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="vv-badge-pill">
              <Layers className="w-3.5 h-3.5 text-[#0099ff]" />
              <span>
                {isId
                  ? 'Langkah 03 • Susun Daftar Adegan AI'
                  : 'Step 03 • AI Scene & Asset Planner'}
              </span>
            </span>
            <span className="vv-badge-pill">
              <span className="vv-blue-dot" />
              <span>
                {items.length} {isId ? 'Tahap Pekerjaan' : 'Stages'} &bull;{' '}
                {calculation.budgeted_generations}{' '}
                {isId ? 'Kali Buat' : 'Total Tries'}
              </span>
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-medium tracking-[-0.035em]">
            {isId ? (
              <>
                Daftar Pekerjaan &{' '}
                <span className="vv-accent text-[#0099ff]">
                  Tahap Pembuatan AI
                </span>
              </>
            ) : (
              <>
                AI Production{' '}
                <span className="vv-accent text-[#0099ff]">
                  Stages & Planner
                </span>
              </>
            )}
          </h1>

          <p className="text-xs text-[var(--vv-text-muted)] leading-relaxed">
            {isId
              ? 'Daftar di bawah menampilkan ringkasan rapi setiap adegan. Klik tombol "Atur Detail" pada baris mana saja untuk membuka jendela pengaturan lengkap.'
              : 'The list below shows a clean summary of each stage. Click "Edit Details" on any row to open its full configuration popup.'}
          </p>
        </div>

        {/* Right: Live Total Readout + Primary Add Stage CTA */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-3 shrink-0">
          <div className="text-left sm:text-right">
            <div className="text-[11px] uppercase tracking-wider text-[#7acaff] font-semibold">
              {t.totalBudget}
            </div>
            <div className="text-2xl font-bold tabular-nums text-[var(--vv-text-primary)]">
              {formatCurrencyIdr(calculation.total_cost_idr, language)}
            </div>
            <div className="text-xs font-semibold tabular-nums text-[#0099ff]">
              {formatCurrencyUsd(calculation.total_cost_usd, language)} &bull;{' '}
              {calculation.total_credit !== null
                ? `${calculation.total_credit.toLocaleString()} Credits`
                : ''}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleAddAndOpenModal('text_to_video')}
            className="vv-btn-accent px-5 py-2.5 text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addStageBtn}</span>
          </button>
        </div>
      </div>

      {/* Quick Category Filter & Quick Add Bar */}
      <div
        className={`${cardClass} rounded-[14px] p-3.5 flex flex-wrap items-center justify-between gap-3`}
      >
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              selectedCategoryFilter === 'all'
                ? 'bg-[#0068ad] text-white'
                : 'bg-[var(--vv-tint-weak)] text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)]'
            }`}
          >
            {isId ? `Semua (${items.length})` : `All (${items.length})`}
          </button>
          {ALL_CATEGORIES.map((cat) => {
            const count = items.filter((i) => i.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
                  selectedCategoryFilter === cat
                    ? 'bg-[#0068ad] text-white'
                    : 'bg-[var(--vv-tint-weak)] text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)]'
                }`}
              >
                <span>{SHORT_CATEGORY_LABELS[cat][language]}</span>
                {count > 0 && (
                  <span className="font-mono text-[10px] opacity-80">
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Add by Category */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-[var(--vv-text-subtle)] mr-1 hidden xl:inline">
            {isId ? 'Tambah Cepat:' : 'Quick Add:'}
          </span>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={`add_${cat}`}
              type="button"
              onClick={() => handleAddAndOpenModal(cat)}
              className="vv-btn-secondary px-2.5 py-1 text-[11px]"
              title={`${isId ? 'Tambah' : 'Add'} ${CATEGORY_LABELS[cat][language]}`}
            >
              <Plus className="w-3 h-3 text-[#0099ff]" />
              <span>{SHORT_CATEGORY_LABELS[cat][language]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================================
       * TIER 2: CLEAN, SCANNABLE SCENE ROW CARDS (No 11-Field Form Overload!)
       * ===================================================================== */}
      {filteredItems.length === 0 ? (
        <div
          className={`${cardClass} rounded-[16px] p-10 text-center space-y-3`}
        >
          <p className="text-sm text-[var(--vv-text-muted)]">
            {isId
              ? 'Belum ada tahap pekerjaan pada kategori ini. Klik tombol di bawah untuk menambahkan adegan atau aset AI baru.'
              : 'No production stages in this category yet. Click below to add a new AI stage.'}
          </p>
          <button
            type="button"
            onClick={() => handleAddAndOpenModal('text_to_video')}
            className="vv-btn-primary px-5 py-2.5 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addStageBtn}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map(({ item, idx, calcRow }) => {
            const paramSummary = Object.entries(
              item.model_selection.parameter_values
            )
              .map(([, val]) => String(val))
              .join(' • ');

            return (
              <div
                key={item.item_id}
                className={`${cardClass} rounded-[16px] p-4 sm:p-5 transition hover:border-[#0099ff]/45`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Index + Scene Label + Model & Category Badges */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    <span className="w-9 h-9 rounded-[10px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border-strong)] text-[#0099ff] font-mono font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm sm:text-base font-semibold text-[var(--vv-text-primary)] truncate">
                          {item.label ||
                            (isId ? 'Adegan Tanpa Nama' : 'Untitled Stage')}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[var(--vv-tint-weak)] border border-[var(--vv-border)] text-[var(--vv-text-muted)]">
                          {SHORT_CATEGORY_LABELS[item.category][language]}
                        </span>
                        {item.is_unlimited ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                            UNLIMITED &bull; Rp 0
                          </span>
                        ) : (
                          <StatusBadge
                            status={item.pricing.status}
                            language={language}
                          />
                        )}
                        {(() => {
                          const badge = catalog.find(
                            (m) => m.model_id === item.model_selection.model_id
                          )?.tier_badge;
                          return badge && badge !== 'STANDARD' ? (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${tierBadgeClass(
                                badge
                              )}`}
                            >
                              {badge}
                            </span>
                          ) : null;
                        })()}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--vv-text-muted)] mt-1">
                        <strong className="text-[var(--vv-text-strong)]">
                          {item.model_selection.model_name}
                        </strong>
                        {paramSummary && (
                          <>
                            <span>&bull;</span>
                            <span>{paramSummary}</span>
                          </>
                        )}
                        {item.duration_seconds > 0 && (
                          <>
                            <span>&bull;</span>
                            <span>
                              {item.duration_seconds} {isId ? 'detik' : 'sec'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Compact Quick-Adjust Numbers (Quantity & Tries) */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <div className="vv-card-quiet px-3 py-1.5 flex items-center gap-2">
                      <span className="text-[11px] text-[var(--vv-text-muted)]">
                        {isId ? 'Jumlah:' : 'Qty:'}
                      </span>
                      <input
                        type="number"
                        min={1}
                        step={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateProductionItemField(item.item_id, {
                            quantity: Math.max(
                              0,
                              Math.floor(Number(e.target.value) || 0)
                            ),
                          })
                        }
                        className={`${inputClass} w-14 px-2 py-1 rounded-[7px] text-xs font-bold tabular-nums text-right`}
                      />
                    </div>

                    <div className="vv-card-quiet px-3 py-1.5 flex items-center gap-2">
                      <span className="text-[11px] text-[var(--vv-text-muted)]">
                        {isId ? 'Coba:' : 'Tries:'}
                      </span>
                      <input
                        type="number"
                        min={1}
                        step={1}
                        value={item.attempts_per_item}
                        onChange={(e) =>
                          updateProductionItemField(item.item_id, {
                            attempts_per_item: Math.max(
                              0,
                              Math.floor(Number(e.target.value) || 0)
                            ),
                          })
                        }
                        className={`${inputClass} w-14 px-2 py-1 rounded-[7px] text-xs font-bold tabular-nums text-right`}
                      />
                      <span className="text-[10px] text-[var(--vv-text-subtle)] tabular-nums">
                        ({calcRow?.budgeted_generations}x)
                      </span>
                    </div>
                  </div>

                  {/* Right: Focal Stage Subtotal + Frosted Modal Edit Trigger */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-[var(--vv-border)] shrink-0">
                    <div className="text-left lg:text-right min-w-[125px]">
                      <div className="text-base font-bold tabular-nums text-[#0099ff]">
                        {formatCurrencyIdr(
                          calcRow?.total_cost_idr ?? null,
                          language
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--vv-text-muted)] tabular-nums">
                        {formatCurrencyUsd(
                          calcRow?.total_cost_usd ?? null,
                          language
                        )}
                        {calcRow?.total_credit !== null
                          ? ` • ${calcRow?.total_credit} Credit`
                          : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setShowManualPriceSection(
                            item.pricing.status === 'manual'
                          );
                          setEditingItemId(item.item_id);
                        }}
                        className="vv-btn-secondary px-3.5 py-2 text-xs font-medium"
                      >
                        <Sliders className="w-3.5 h-3.5 text-[#0099ff]" />
                        <span>{isId ? 'Atur Detail' : 'Edit Details'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => duplicateProductionItem(item.item_id)}
                        title={t.duplicateBtn}
                        className="p-2 rounded-full bg-[var(--vv-tint-weak)] hover:bg-[var(--vv-tint)] border border-[var(--vv-border)] text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)] transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeProductionItem(item.item_id)}
                        title={t.deleteBtn}
                        className="p-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Guided Step Flow Footer */}
      <StepFlowBar
        currentStepNumber={3}
        stepTitle={t.navPlanner}
        nextStepHint={
          isId
            ? 'Langkah selanjutnya: Periksa rekapitulasi anggaran lengkap (USD & Rupiah) sebelum mencetak laporan PDF.'
            : 'Next step: Review the complete budget summary (USD & IDR) before exporting your PDF report.'
        }
        prevTab="setup"
        prevLabel={t.navSetup}
        nextTab="summary"
        nextLabel={
          isId
            ? 'Lanjut ke Langkah 4: Ringkasan Biaya'
            : 'Continue to Step 4: Cost Summary'
        }
      />

      {/* =====================================================================
       * FROSTED GLASS MODAL: Pengaturan Lengkap Adegan / Tahap AI
       * Progressive Disclosure: Houses all 11 fields cleanly inside a modal
       * ===================================================================== */}
      {activeEditEntry &&
        (() => {
          const { item, idx, calcRow } = activeEditEntry;
          const availableModels = getModelsByCategory(item.category, catalog);
          const selectedModel =
            catalog.find((m) => m.model_id === item.model_selection.model_id) ||
            availableModels[0];

          return (
            <FrostedModal
              isOpen={true}
              onClose={() => setEditingItemId(null)}
              theme={theme}
              maxWidth="2xl"
              badgeLabel={`${isId ? 'Tahap Adegan' : 'Production Stage'} #${String(
                idx + 1
              ).padStart(2, '0')}`}
              title={
                isId ? (
                  <>
                    Atur Detail Adegan &{' '}
                    <span className="vv-accent text-[#0099ff]">
                      Model AI Higgsfield
                    </span>
                  </>
                ) : (
                  <>
                    Configure Scene &{' '}
                    <span className="vv-accent text-[#0099ff]">
                      Higgsfield AI Model
                    </span>
                  </>
                )
              }
              subtitle={
                isId
                  ? 'Semua perubahan yang Anda pilih langsung dihitung secara otomatis pada total anggaran di bawah.'
                  : 'Every change you make is automatically calculated in the live stage total below.'
              }
              footer={
                <>
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[var(--vv-text-muted)]">
                        {isId
                          ? 'Subtotal Tahap Ini (Termasuk Cadangan)'
                          : 'Stage Subtotal (Incl. Reserve)'}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold tabular-nums text-[#0099ff]">
                          {formatCurrencyIdr(
                            calcRow?.total_cost_idr ?? null,
                            language
                          )}
                        </span>
                        <span className="text-xs font-semibold tabular-nums text-[var(--vv-text-strong)]">
                          (
                          {formatCurrencyUsd(
                            calcRow?.total_cost_usd ?? null,
                            language
                          )}
                          )
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditingItemId(null)}
                    className="vv-btn-primary px-6 py-2.5 text-xs font-semibold"
                  >
                    <span>
                      {isId ? 'Selesai & Simpan Adegan' : 'Done & Save Stage'}
                    </span>
                  </button>
                </>
              }
            >
              <div className="space-y-5 text-xs">
                {/* 1. Nama Adegan & Jenis Pembuatan AI */}
                <div className="vv-card-quiet p-4 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--vv-text-strong)] mb-1.5">
                      {isId
                        ? '1. Nama Adegan / Tahap Pekerjaan'
                        : '1. Scene / Production Stage Name'}
                    </label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) =>
                        updateProductionItemField(item.item_id, {
                          label: e.target.value,
                        })
                      }
                      className={`${inputClass} w-full px-3.5 py-2.5 rounded-[10px] text-sm font-semibold`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--vv-text-strong)] mb-1.5">
                      {isId
                        ? '2. Pilih Jenis Pembuatan AI'
                        : '2. Select AI Creation Type'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {ALL_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => changeItemCategory(item.item_id, cat)}
                          className={`py-2 px-3 rounded-[9px] text-xs font-medium border text-left transition ${
                            item.category === cat
                              ? 'bg-[#0068ad] text-white border-[#7acaff]/40'
                              : 'bg-[var(--vv-field)] text-[var(--vv-text-muted)] border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
                          }`}
                        >
                          {SHORT_CATEGORY_LABELS[cat][language]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Model AI Higgsfield & Pengaturan Kualitas */}
                <div className="vv-card-quiet p-4 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--vv-text-strong)] mb-1.5">
                      {isId
                        ? '3. Pilih Model AI Higgsfield'
                        : '3. Select Higgsfield AI Model'}
                    </label>
                    <select
                      value={item.model_selection.model_id}
                      onChange={(e) =>
                        changeItemModel(item.item_id, e.target.value)
                      }
                      className={`${inputClass} w-full px-3.5 py-2.5 rounded-[10px] text-xs font-semibold`}
                    >
                      {availableModels.map((m) => {
                        const v = m.pricing_variants[0];
                        const badge =
                          m.tier_badge && m.tier_badge !== 'STANDARD'
                            ? `[${m.tier_badge}] `
                            : '';
                        const idr =
                          v?.price_value && project.exchange_rate.rate
                            ? formatCurrencyIdr(
                                v.price_value * project.exchange_rate.rate,
                                language
                              )
                            : '';
                        const priceText =
                          v?.credit_cost !== null && v?.credit_cost !== undefined
                            ? ` — ${v.credit_cost} Credit${idr ? ` • ${idr}` : ''}`
                            : '';
                        return (
                          <option key={m.model_id} value={m.model_id}>
                            {badge}
                            {m.model_name} ({m.family}){priceText}
                          </option>
                        );
                      })}
                    </select>
                    {selectedModel && (
                      <p className="text-[11px] text-[var(--vv-text-muted)] mt-1.5 leading-relaxed">
                        {isId
                          ? selectedModel.description_id
                          : selectedModel.description_en}
                      </p>
                    )}
                  </div>

                  {/* Dynamic Quality Parameters */}
                  {selectedModel && selectedModel.parameters.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--vv-border)]">
                      {selectedModel.parameters.map((param) => {
                        const currentVal =
                          item.model_selection.parameter_values[param.key] ??
                          param.defaultValue;
                        return (
                          <div key={param.key}>
                            <label className="block text-[11px] font-medium text-[var(--vv-text-muted)] mb-1">
                              {isId ? param.label_id : param.label_en}
                            </label>
                            {param.options ? (
                              <select
                                value={String(currentVal)}
                                onChange={(e) =>
                                  changeItemParameter(
                                    item.item_id,
                                    param.key,
                                    e.target.value
                                  )
                                }
                                className={`${inputClass} w-full px-3 py-2 rounded-[9px] text-xs font-medium`}
                              >
                                {param.options.map((opt) => (
                                  <option
                                    key={String(opt.value)}
                                    value={String(opt.value)}
                                  >
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={String(currentVal)}
                                onChange={(e) =>
                                  changeItemParameter(
                                    item.item_id,
                                    param.key,
                                    e.target.value
                                  )
                                }
                                className={`${inputClass} w-full px-3 py-2 rounded-[9px] text-xs`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 3. Kuantitas, Berapa Kali Coba, & Durasi Detik */}
                <div className="vv-card-quiet p-4">
                  <div className="text-xs font-semibold text-[var(--vv-text-strong)] mb-3">
                    {isId
                      ? '4. Jumlah Adegan, Percobaan, & Durasi'
                      : '4. Quantity, Tries, & Duration'}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-[11px] text-[var(--vv-text-muted)] mb-1">
                        {QUANTITY_TYPE_LABELS[item.quantity_type][language]}
                      </label>
                      <input
                        type="number"
                        min={1}
                        step={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateProductionItemField(item.item_id, {
                            quantity: Math.max(
                              0,
                              Math.floor(Number(e.target.value) || 0)
                            ),
                          })
                        }
                        className={`${inputClass} w-full px-3 py-2 rounded-[10px] text-sm font-bold tabular-nums text-right`}
                      />
                      {assumptions.estimation_mode === 'target_final' &&
                        item.use_project_target_multiplier && (
                          <span className="block text-[10px] text-[#0099ff] mt-1 text-right">
                            &times; {assumptions.target_videos} video ={' '}
                            {calcRow?.effective_quantity}
                          </span>
                        )}
                    </div>

                    <div>
                      <label className="block text-[11px] text-[var(--vv-text-muted)] mb-1">
                        {isId ? 'Berapa Kali Coba / Adegan' : 'Tries per Scene'}
                      </label>
                      <input
                        type="number"
                        min={1}
                        step={1}
                        value={item.attempts_per_item}
                        onChange={(e) =>
                          updateProductionItemField(item.item_id, {
                            attempts_per_item: Math.max(
                              0,
                              Math.floor(Number(e.target.value) || 0)
                            ),
                          })
                        }
                        className={`${inputClass} w-full px-3 py-2 rounded-[10px] text-sm font-bold tabular-nums text-right`}
                      />
                      <span className="block text-[10px] text-[var(--vv-text-muted)] mt-1 text-right">
                        {isId
                          ? `${calcRow?.planned_generations} awal + ${calcRow?.reserve_generations} cadangan`
                          : `${calcRow?.planned_generations} initial + ${calcRow?.reserve_generations} reserve`}
                      </span>
                    </div>

                    {selectedModel?.supports_duration ||
                    item.pricing.pricing_unit === 'per_second' ? (
                      <div>
                        <label className="block text-[11px] text-[var(--vv-text-muted)] mb-1">
                          {isId
                            ? 'Durasi per Adegan (Detik)'
                            : 'Scene Duration (Seconds)'}
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={60}
                          step={1}
                          value={item.duration_seconds}
                          onChange={(e) =>
                            updateProductionItemField(item.item_id, {
                              duration_seconds: Math.max(
                                0,
                                Number(e.target.value) || 0
                              ),
                            })
                          }
                          className={`${inputClass} w-full px-3 py-2 rounded-[10px] text-sm font-bold tabular-nums text-right`}
                        />
                        <span className="block text-[10px] text-[var(--vv-text-muted)] mt-1 text-right">
                          {
                            PRICING_UNIT_LABELS[item.pricing.pricing_unit][
                              language
                            ]
                          }
                        </span>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[11px] text-[var(--vv-text-subtle)] mb-1">
                          {isId ? 'Satuan Hitung Harga' : 'Pricing Unit'}
                        </label>
                        <div className="px-3 py-2 rounded-[10px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border)] text-xs text-[var(--vv-text-muted)] text-right">
                          {
                            PRICING_UNIT_LABELS[item.pricing.pricing_unit][
                              language
                            ]
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3b. Paket Unlimited Higgsfield (Bebas Credit / Rp 0) */}
                <label
                  className={`vv-card-quiet p-4 flex items-start gap-3 cursor-pointer transition ${
                    item.is_unlimited ? 'border border-purple-500/50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!item.is_unlimited}
                    onChange={(e) =>
                      toggleItemUnlimited(item.item_id, e.target.checked)
                    }
                    className="mt-0.5 rounded border-[var(--vv-border)]"
                  />
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-[var(--vv-text-strong)] flex flex-wrap items-center gap-2">
                      <span>
                        {isId
                          ? 'Termasuk Paket Unlimited Higgsfield (Bebas Credit / Rp 0)'
                          : 'Included in Higgsfield Unlimited Plan (Free / Rp 0)'}
                      </span>
                      {selectedModel?.unlimited_eligible && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-purple-500/15 text-purple-300 border border-purple-500/30">
                          Unlimited Ready
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--vv-text-muted)] leading-relaxed">
                      {isId
                        ? 'Centang jika model ini gratis di paket langganan Anda, sehingga tahap ini tidak menambah biaya.'
                        : 'Tick if this model is free on your subscription plan, so this stage adds no cost.'}{' '}
                      {isId ? 'Patokan saat ini: 1 Credit = ' : 'Current rate: 1 Credit = '}
                      {formatCurrencyUsd(usdPerCredit, language)}
                    </p>
                  </div>
                </label>

                {/* 4. Progressive Disclosure: Manual Price Override Accordion */}
                <div className="vv-card-quiet p-4">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        setShowManualPriceSection((prev) => !prev)
                      }
                      className="flex items-center gap-2 text-xs font-medium text-[var(--vv-text-strong)] hover:text-[#0099ff] transition"
                    >
                      {showManualPriceSection ? (
                        <ChevronUp className="w-4 h-4 text-[#0099ff]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#0099ff]" />
                      )}
                      <span>
                        {isId
                          ? 'Pengaturan Lanjutan: Ubah Harga Satuan / Credit Manual (Opsional)'
                          : 'Advanced: Override Unit Price / Credits Manually (Optional)'}
                      </span>
                    </button>

                    <StatusBadge
                      status={item.pricing.status}
                      language={language}
                    />
                  </div>

                  {showManualPriceSection && (
                    <div className="mt-4 pt-3 border-t border-[var(--vv-border)] space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-[11px] text-[var(--vv-text-muted)] mb-1">
                            {isId ? 'Harga Satuan (USD)' : 'Unit Price (USD)'} (
                            {
                              PRICING_UNIT_LABELS[item.pricing.pricing_unit][
                                language
                              ]
                            }
                            )
                          </label>
                          <input
                            type="number"
                            min={0}
                            step={0.001}
                            value={
                              item.pricing.price_value !== null
                                ? item.pricing.price_value
                                : ''
                            }
                            onChange={(e) => {
                              const val =
                                e.target.value === ''
                                  ? null
                                  : Number(e.target.value);
                              setManualItemPricing(
                                item.item_id,
                                val,
                                item.pricing.credit_cost
                              );
                            }}
                            className={`${inputClass} w-full px-3 py-2 rounded-[9px] text-xs font-bold tabular-nums text-right`}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-[var(--vv-text-muted)] mb-1">
                            {isId ? 'Credit per Satuan' : 'Credits per Unit'}
                          </label>
                          <input
                            type="number"
                            min={0}
                            step={0.5}
                            value={
                              item.pricing.credit_cost !== null
                                ? item.pricing.credit_cost
                                : ''
                            }
                            onChange={(e) => {
                              const val =
                                e.target.value === ''
                                  ? null
                                  : Number(e.target.value);
                              setManualItemPricing(
                                item.item_id,
                                item.pricing.price_value,
                                val
                              );
                            }}
                            className={`${inputClass} w-full px-3 py-2 rounded-[9px] text-xs font-bold tabular-nums text-right`}
                          />
                        </div>
                      </div>

                      {item.pricing.status === 'manual' && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              resetItemPricingToCatalog(item.item_id)
                            }
                            className="vv-btn-secondary px-3 py-1.5 text-xs"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>
                              {isId
                                ? 'Kembalikan ke Harga Katalog Resmi'
                                : 'Reset to Official Catalog Price'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </FrostedModal>
          );
        })()}
    </div>
  );
};
