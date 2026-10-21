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
      {/* Header & Quick Add Pill Buttons per Category */}
      <div className={`${cardClass} rounded-[16px] p-6`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="vv-badge-pill">
                <Layers className="w-3.5 h-3.5 text-[#0099ff]" />
                <span>{isId ? 'Daftar Tahapan AI' : 'Production Layers'}</span>
              </span>
            </div>
            <h1 className="text-2xl font-medium tracking-[-0.035em]">
              {isId ? (
                <>
                  Daftar Pekerjaan &{' '}
                  <span className="vv-accent text-[#0099ff]">Tahap Pembuatan AI</span>
                </>
              ) : (
                <>
                  AI Production{' '}
                  <span className="vv-accent text-[#0099ff]">Stages & Planner</span>
                </>
              )}
            </h1>
            <p className="text-xs text-[var(--vv-text-muted)] mt-1">
              {isId
                ? 'Tambahkan setiap adegan video atau gambar yang ingin dibuat. Pilih jenis pembuatan, model AI Higgsfield, kualitas, jumlah adegan, serta perkiraan berapa kali coba.'
                : 'Add each video scene or image asset you want to create. Choose the creation type, Higgsfield AI model, quality settings, quantity, and expected tries.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => addProductionItem(cat)}
                className="vv-btn-secondary px-3.5 py-2 text-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#0099ff]" />
                <span>{SHORT_CATEGORY_LABELS[cat][language]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Daftar Baris Pekerjaan (Production Items) */}
      {items.length === 0 ? (
        <div className={`${cardClass} rounded-[16px] p-10 text-center space-y-3`}>
          <p className="text-sm text-[var(--vv-text-muted)]">
            {isId
              ? 'Belum ada baris pekerjaan produksi. Klik tombol di bawah untuk mulai menambahkan tahap pembuatan AI.'
              : 'No production stages yet. Click below to add your first AI production stage.'}
          </p>
          <button
            type="button"
            onClick={() => addProductionItem('text_to_video')}
            className="vv-btn-primary px-5 py-2.5 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addStageBtn}</span>
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
                className={`${cardClass} rounded-[16px] p-5 transition`}
              >
                {/* Baris Atas: Nomor Indeks Studio, Label Shot, Status, & Tombol Aksi */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-[var(--vv-border)]">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="w-8 h-8 rounded-[8px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border-strong)] text-[#0099ff] font-mono font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
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
                          ? 'Nama Adegan / Tahap Pembuatan'
                          : 'Scene / Production Stage Name'
                      }
                      className={`${inputClass} flex-1 px-3.5 py-2 rounded-[10px] text-sm font-semibold`}
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
                            ? 'Kembalikan ke harga katalog resmi'
                            : 'Reset to verified catalog price'
                        }
                        className="vv-btn-secondary px-3 py-1 text-[11px]"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{isId ? 'Reset Harga' : 'Reset Price'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => duplicateProductionItem(item.item_id)}
                      className="vv-btn-secondary px-3 py-1 text-xs"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.duplicateBtn}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => removeProductionItem(item.item_id)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.deleteBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Grid Parameter Utama: Kategori, Model, Pengaturan Kualitas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  {/* 1. Jenis Pembuatan AI */}
                  <div>
                    <label className="block text-[11px] font-medium text-[var(--vv-text-muted)] mb-1">
                      {isId ? 'Jenis Pembuatan AI' : 'AI Creation Type'}
                    </label>
                    <select
                      value={item.category}
                      onChange={(e) =>
                        changeItemCategory(
                          item.item_id,
                          e.target.value as ProcessCategory
                        )
                      }
                      className={`${inputClass} w-full px-3 py-2 rounded-[10px] text-xs font-medium`}
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
                    <label className="block text-[11px] font-medium text-[var(--vv-text-muted)] mb-1">
                      {isId
                        ? 'Pilih Model AI Higgsfield'
                        : 'Select Higgsfield AI Model'}
                    </label>
                    <select
                      value={item.model_selection.model_id}
                      onChange={(e) =>
                        changeItemModel(item.item_id, e.target.value)
                      }
                      className={`${inputClass} w-full px-3 py-2 rounded-[10px] text-xs font-semibold`}
                    >
                      {availableModels.map((m) => (
                        <option key={m.model_id} value={m.model_id}>
                          {m.model_name} ({m.family})
                        </option>
                      ))}
                    </select>
                    {selectedModel && (
                      <div className="text-[10px] text-[var(--vv-text-muted)] mt-1 truncate">
                        {isId
                          ? selectedModel.description_id
                          : selectedModel.description_en}
                      </div>
                    )}
                  </div>

                  {/* 3. Pengaturan Kualitas & Format Sesuai Model */}
                  <div>
                    <label className="block text-[11px] font-medium text-[var(--vv-text-muted)] mb-1">
                      {isId
                        ? 'Pengaturan Kualitas & Format'
                        : 'Quality & Format Settings'}
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
                            <span className="text-[11px] text-[var(--vv-text-muted)] w-28 truncate">
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
                                className={`${inputClass} flex-1 px-2.5 py-1 rounded-[8px] text-xs`}
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
                                className={`${inputClass} flex-1 px-2.5 py-1 rounded-[8px] text-xs`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Grid Kuantitas, Percobaan, Durasi, Harga Satuan, & Subtotal */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-[var(--vv-border)] items-end">
                  {/* Kuantitas */}
                  <div>
                    <label className="block text-[11px] font-medium text-[var(--vv-text-muted)] mb-1">
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
                      className={`${inputClass} w-full px-3 py-1.5 rounded-[10px] text-xs font-bold tabular-nums text-right`}
                    />
                    {assumptions.estimation_mode === 'target_final' &&
                      item.use_project_target_multiplier && (
                        <span className="block text-[10px] text-[#0099ff] mt-0.5 text-right">
                          &times; {assumptions.target_videos} video ={' '}
                          {calcRow?.effective_quantity}
                        </span>
                      )}
                  </div>

                  {/* Berapa Kali Coba per Adegan */}
                  <div>
                    <label className="block text-[11px] font-medium text-[var(--vv-text-muted)] mb-1">
                      {isId ? 'Berapa Kali Coba / Adegan' : 'Tries per Scene/Asset'}
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
                      className={`${inputClass} w-full px-3 py-1.5 rounded-[10px] text-xs font-bold tabular-nums text-right`}
                    />
                    <span className="block text-[10px] text-[var(--vv-text-muted)] mt-0.5 text-right">
                      {isId
                        ? `Awal: ${calcRow?.planned_generations}x (+${calcRow?.reserve_generations}x cadangan)`
                        : `Initial: ${calcRow?.planned_generations}x (+${calcRow?.reserve_generations}x reserve)`}
                    </span>
                  </div>

                  {/* Durasi Klip */}
                  {selectedModel?.supports_duration ||
                  item.pricing.pricing_unit === 'per_second' ? (
                    <div>
                      <label className="block text-[11px] font-medium text-[var(--vv-text-muted)] mb-1">
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
                        className={`${inputClass} w-full px-3 py-1.5 rounded-[10px] text-xs font-bold tabular-nums text-right`}
                      />
                      <span className="block text-[10px] text-[var(--vv-text-muted)] mt-0.5 text-right">
                        {PRICING_UNIT_LABELS[item.pricing.pricing_unit][language]}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] font-medium text-[var(--vv-text-subtle)] mb-1">
                        {isId ? 'Cara Hitung Harga' : 'Pricing Basis'}
                      </label>
                      <div className="px-3 py-1.5 rounded-[10px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border)] text-xs text-[var(--vv-text-muted)] text-right">
                        {PRICING_UNIT_LABELS[item.pricing.pricing_unit][language]}
                      </div>
                    </div>
                  )}

                  {/* Harga Satuan USD */}
                  <div>
                    <label className="block text-[11px] font-medium text-[var(--vv-text-muted)] mb-1">
                      {isId ? 'Harga Satuan (USD)' : 'Unit Price (USD)'}
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.001}
                      placeholder={isId ? 'Isi harga USD' : 'Enter USD price'}
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
                      className={`${inputClass} w-full px-3 py-1.5 rounded-[10px] text-xs font-bold tabular-nums text-right ${
                        item.pricing.price_value === null
                          ? 'border-rose-400/60 bg-rose-500/10'
                          : ''
                      }`}
                    />
                    <span className="block text-[10px] text-[var(--vv-text-muted)] mt-0.5 text-right">
                      {PRICING_UNIT_LABELS[item.pricing.pricing_unit][language]}
                    </span>
                  </div>

                  {/* Credit per Unit */}
                  <div>
                    <label className="block text-[11px] font-medium text-[var(--vv-text-muted)] mb-1">
                      {isId ? 'Credit per Satuan' : 'Credits per Unit'}
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
                      className={`${inputClass} w-full px-3 py-1.5 rounded-[10px] text-xs font-bold tabular-nums text-right`}
                    />
                    <span className="block text-[10px] text-[#7acaff] mt-0.5 text-right tabular-nums">
                      Total:{' '}
                      {calcRow?.total_credit !== null
                        ? `${calcRow?.total_credit} cr`
                        : 'N/A'}
                    </span>
                  </div>

                  {/* Subtotal Item */}
                  <div className="p-2.5 rounded-[10px] bg-[#0099ff]/10 border border-[#0099ff]/30 text-right">
                    <div className="text-[10px] uppercase tracking-wider text-[var(--vv-text-muted)]">
                      {isId ? 'Subtotal Tahap' : 'Stage Subtotal'}
                    </div>
                    <div className="text-sm font-bold tabular-nums text-[#0099ff]">
                      {formatCurrencyUsd(calcRow?.total_cost_usd ?? null, language)}
                    </div>
                    <div className="text-[11px] text-[var(--vv-text-strong)] tabular-nums">
                      {formatCurrencyIdr(calcRow?.total_cost_idr ?? null, language)}
                    </div>
                  </div>
                </div>

                {/* Metadata Sumber & Waktu Pengambilan */}
                <div className="mt-3 pt-2.5 border-t border-[var(--vv-border)] flex flex-wrap items-center justify-between text-[11px] text-[var(--vv-text-muted)] gap-2">
                  <div>
                    <strong className="text-[var(--vv-text-strong)]">{isId ? 'Sumber Harga:' : 'Price Source:'}</strong>{' '}
                    {item.pricing.source_name} &bull;{' '}
                    {isId ? 'Diperbarui:' : 'Updated:'}{' '}
                    {item.pricing.retrieved_at.slice(0, 10)}
                  </div>
                  <div className="tabular-nums">
                    {isId ? 'Biaya Utama:' : 'Base:'}{' '}
                    <strong className="text-[var(--vv-text-primary)]">
                      {formatCurrencyUsd(calcRow?.base_cost_usd ?? null, language)}
                    </strong>{' '}
                    + {isId ? 'Cadangan:' : 'Reserve:'}{' '}
                    <strong className="text-[#ffb840]">
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
