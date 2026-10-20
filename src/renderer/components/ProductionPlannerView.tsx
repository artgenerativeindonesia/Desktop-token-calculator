import React from 'react';
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
import {
  Copy,
  Layers,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';

const ALL_CATEGORIES: ProcessCategory[] = [
  'text_to_image',
  'image_to_video',
  'video_to_video',
  'text_to_video',
  'upscaling',
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
  } = useProjectStore();

  const t = UI_TEXT[language];
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';
  const inputClass =
    theme === 'dark' ? 'glass-input-dark' : 'glass-input-light';
  const { items, calculation, assumptions } = project;

  return (
    <div className="space-y-6">
      {/* Header & Quick Add Buttons per Category */}
      <div className={`${cardClass} rounded-2xl p-6`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-sky-400" />
              <span>
                {isId
                  ? 'Perencana Produksi AI (Production Planner)'
                  : 'AI Production Planner'}
              </span>
            </h1>
            <p className="text-xs opacity-75 mt-1">
              {isId
                ? 'Pilih kategori proses, model Higgsfield, parameter dinamis, jumlah shot/aset, serta asumsi percobaan. Tarif dan credit dapat disesuaikan langsung jika diperlukan.'
                : 'Select process category, Higgsfield model, dynamic parameters, shot/asset count, and attempt assumptions. Rates and credits can also be customized inline.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => addProductionItem(cat)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-400/30 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                {SHORT_CATEGORY_LABELS[cat][language]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Daftar Baris Pekerjaan (Production Items) */}
      {items.length === 0 ? (
        <div className={`${cardClass} rounded-2xl p-10 text-center space-y-3`}>
          <p className="text-sm opacity-75">
            {isId
              ? 'Belum ada baris pekerjaan produksi. Klik tombol di bawah untuk mulai menambahkan tahap produksi AI.'
              : 'No production stages yet. Click below to add your first AI production stage.'}
          </p>
          <button
            type="button"
            onClick={() => addProductionItem('text_to_video')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white"
          >
            <Plus className="w-4 h-4" />
            {t.addStageBtn}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, idx) => {
            const calcRow = calculation.item_results[idx];
            const availableModels = getModelsByCategory(
              item.category,
              catalog
            );
            const selectedModel =
              catalog.find(
                (m) => m.model_id === item.model_selection.model_id
              ) || availableModels[0];

            return (
              <div
                key={item.item_id}
                className={`${cardClass} rounded-2xl p-5 transition`}
              >
                {/* Baris Atas: Nomor, Label Shot, Kategori, Model, Status, & Tombol Aksi */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/30 text-sky-300 font-bold text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) =>
                        updateProductionItemField(item.item_id, {
                          label: e.target.value,
                        })
                      }
                      placeholder={
                        isId
                          ? 'Nama Shot / Tahap Produksi'
                          : 'Shot / Production Stage Name'
                      }
                      className={`${inputClass} flex-1 px-3 py-1.5 rounded-xl text-sm font-semibold`}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge
                      status={item.pricing.status}
                      language={language}
                    />

                    {item.pricing.status === 'manual' && (
                      <button
                        type="button"
                        onClick={() => resetItemPricingToCatalog(item.item_id)}
                        title={
                          isId
                            ? 'Kembalikan ke tarif katalog resmi'
                            : 'Reset to verified catalog rate'
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] bg-white/10 hover:bg-white/20 border border-white/15 transition"
                      >
                        <RotateCcw className="w-3 h-3" />
                        {isId ? 'Reset Tarif' : 'Reset Rate'}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => duplicateProductionItem(item.item_id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-white/10 hover:bg-white/20 border border-white/15 transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {t.duplicateBtn}
                    </button>

                    <button
                      type="button"
                      onClick={() => removeProductionItem(item.item_id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-400/30 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {t.deleteBtn}
                    </button>
                  </div>
                </div>

                {/* Grid Parameter Utama: Kategori, Model, Parameter Dinamis */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  {/* 1. Kategori Proses AI */}
                  <div>
                    <label className="block text-[11px] font-semibold opacity-75 mb-1">
                      {isId ? 'Kategori Proses AI' : 'AI Process Category'}
                    </label>
                    <select
                      value={item.category}
                      onChange={(e) =>
                        changeItemCategory(
                          item.item_id,
                          e.target.value as ProcessCategory
                        )
                      }
                      className={`${inputClass} w-full px-3 py-2 rounded-xl text-xs font-medium`}
                    >
                      {ALL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {CATEGORY_LABELS[cat][language]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Pemilihan Model Higgsfield */}
                  <div className="lg:col-span-2">
                    <label className="block text-[11px] font-semibold opacity-75 mb-1">
                      {isId
                        ? 'Model Higgsfield (Dipilih Manual - FR-02)'
                        : 'Higgsfield Model (Manual Selection - FR-02)'}
                    </label>
                    <select
                      value={item.model_selection.model_id}
                      onChange={(e) =>
                        changeItemModel(item.item_id, e.target.value)
                      }
                      className={`${inputClass} w-full px-3 py-2 rounded-xl text-xs font-semibold`}
                    >
                      {availableModels.map((m) => (
                        <option key={m.model_id} value={m.model_id}>
                          {m.model_name} ({m.family})
                        </option>
                      ))}
                    </select>
                    {selectedModel && (
                      <div className="text-[10px] opacity-65 mt-1 truncate">
                        {isId
                          ? selectedModel.description_id
                          : selectedModel.description_en}
                      </div>
                    )}
                  </div>

                  {/* 3. Parameter Dinamis Sesuai Model (PRD Bab 6.1) */}
                  <div>
                    <label className="block text-[11px] font-semibold opacity-75 mb-1">
                      {isId
                        ? 'Parameter Model Dinamis'
                        : 'Dynamic Model Parameters'}
                    </label>
                    <div className="space-y-1.5">
                      {selectedModel?.parameters.map((param) => {
                        const currentVal =
                          item.model_selection.parameter_values[param.key] ??
                          param.defaultValue;
                        return (
                          <div
                            key={param.key}
                            className="flex items-center gap-2"
                          >
                            <span className="text-[11px] opacity-75 w-28 truncate">
                              {isId ? param.label_id : param.label_en}:
                            </span>
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
                                className={`${inputClass} flex-1 px-2.5 py-1 rounded-lg text-xs`}
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
                                className={`${inputClass} flex-1 px-2.5 py-1 rounded-lg text-xs`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Grid Kuantitas, Percobaan, Durasi, Tarif Manual, & Subtotal */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-white/10 items-end">
                  {/* Kuantitas S_i (PRD Bab 8.2: Eksplisit jenis kuantitas) */}
                  <div>
                    <label className="block text-[11px] font-semibold opacity-75 mb-1">
                      {QUANTITY_TYPE_LABELS[item.quantity_type][language]} (S<sub>i</sub>)
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
                      className={`${inputClass} w-full px-3 py-1.5 rounded-xl text-xs font-bold tabular-nums text-right`}
                    />
                    {assumptions.estimation_mode === 'target_final' &&
                      item.use_project_target_multiplier && (
                        <span className="block text-[10px] text-sky-400 mt-0.5 text-right">
                          &times; {assumptions.target_videos} video ={' '}
                          {calcRow?.effective_quantity}
                        </span>
                      )}
                  </div>

                  {/* Percobaan per Shot/Aset A_i */}
                  <div>
                    <label className="block text-[11px] font-semibold opacity-75 mb-1">
                      {isId ? 'Percobaan / Shot (Ai)' : 'Attempts / Shot (Ai)'}
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
                      className={`${inputClass} w-full px-3 py-1.5 rounded-xl text-xs font-bold tabular-nums text-right`}
                    />
                    <span className="block text-[10px] opacity-65 mt-0.5 text-right">
                      Gplanned: {calcRow?.planned_generations} (+
                      {calcRow?.reserve_generations} cadangan)
                    </span>
                  </div>

                  {/* Durasi Klip (Hanya muncul jika model mendukung durasi - PRD Bab 6.1) */}
                  {selectedModel?.supports_duration ||
                  item.pricing.pricing_unit === 'per_second' ? (
                    <div>
                      <label className="block text-[11px] font-semibold opacity-75 mb-1">
                        {isId
                          ? 'Durasi Klip (Detik)'
                          : 'Clip Duration (Seconds)'}
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
                        className={`${inputClass} w-full px-3 py-1.5 rounded-xl text-xs font-bold tabular-nums text-right`}
                      />
                      <span className="block text-[10px] opacity-65 mt-0.5 text-right">
                        {PRICING_UNIT_LABELS[item.pricing.pricing_unit][language]}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] font-semibold opacity-50 mb-1">
                        {isId ? 'Satuan Tarif' : 'Pricing Unit'}
                      </label>
                      <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs opacity-75 text-right">
                        {PRICING_UNIT_LABELS[item.pricing.pricing_unit][language]}
                      </div>
                    </div>
                  )}

                  {/* Tarif USD per Unit (Dapat diedit manual jika diinginkan) */}
                  <div>
                    <label className="block text-[11px] font-semibold opacity-75 mb-1">
                      {isId ? 'Tarif Unit (USD)' : 'Unit Rate (USD)'}
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.001}
                      placeholder={isId ? 'Isi tarif USD' : 'Enter USD rate'}
                      value={
                        item.pricing.price_value !== null
                          ? item.pricing.price_value
                          : ''
                      }
                      onChange={(e) => {
                        const val =
                          e.target.value === '' ? null : Number(e.target.value);
                        setManualItemPricing(
                          item.item_id,
                          val,
                          item.pricing.credit_cost
                        );
                      }}
                      className={`${inputClass} w-full px-3 py-1.5 rounded-xl text-xs font-bold tabular-nums text-right ${
                        item.pricing.price_value === null
                          ? 'border-rose-400/60 bg-rose-500/10'
                          : ''
                      }`}
                    />
                    <span className="block text-[10px] opacity-65 mt-0.5 text-right">
                      {PRICING_UNIT_LABELS[item.pricing.pricing_unit][language]}
                    </span>
                  </div>

                  {/* Credit per Unit */}
                  <div>
                    <label className="block text-[11px] font-semibold opacity-75 mb-1">
                      {isId ? 'Credit per Unit' : 'Credits per Unit'}
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      placeholder="N/A"
                      value={
                        item.pricing.credit_cost !== null
                          ? item.pricing.credit_cost
                          : ''
                      }
                      onChange={(e) => {
                        const val =
                          e.target.value === '' ? null : Number(e.target.value);
                        setManualItemPricing(
                          item.item_id,
                          item.pricing.price_value,
                          val
                        );
                      }}
                      className={`${inputClass} w-full px-3 py-1.5 rounded-xl text-xs font-bold tabular-nums text-right`}
                    />
                    <span className="block text-[10px] text-purple-300 mt-0.5 text-right tabular-nums">
                      Total:{' '}
                      {calcRow?.total_credit !== null
                        ? `${calcRow?.total_credit} cr`
                        : 'N/A'}
                    </span>
                  </div>

                  {/* Subtotal Item (USD & IDR Rata Kanan) */}
                  <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-400/25 text-right">
                    <div className="text-[10px] uppercase opacity-70">
                      {isId ? 'Subtotal Tahap' : 'Stage Subtotal'}
                    </div>
                    <div className="text-sm font-extrabold tabular-nums text-sky-400">
                      {formatCurrencyUsd(calcRow?.total_cost_usd ?? null, language)}
                    </div>
                    <div className="text-[11px] opacity-80 tabular-nums">
                      {formatCurrencyIdr(calcRow?.total_cost_idr ?? null, language)}
                    </div>
                  </div>
                </div>

                {/* Metadata Sumber & Waktu Pengambilan (PRD Bab 6.1: wajib terlihat) */}
                <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] opacity-65 gap-2">
                  <div>
                    <strong>{isId ? 'Sumber Tarif:' : 'Rate Source:'}</strong>{' '}
                    {item.pricing.source_name} &bull;{' '}
                    {isId ? 'Diperbarui:' : 'Updated:'}{' '}
                    {item.pricing.retrieved_at.slice(0, 10)}
                  </div>
                  <div className="tabular-nums">
                    {isId ? 'Biaya Dasar:' : 'Base:'}{' '}
                    <strong>
                      {formatCurrencyUsd(calcRow?.base_cost_usd ?? null, language)}
                    </strong>{' '}
                    + {isId ? 'Cadangan:' : 'Reserve:'}{' '}
                    <strong>
                      {formatCurrencyUsd(
                        calcRow?.reserve_cost_usd ?? null,
                        language
                      )}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
