import React from 'react';
import {
  ProductionItem,
  ItemCalculationResult,
  CatalogModelEntry,
  BudgetAssumptions,
  ProcessCategory,
} from '../../../shared/types/project';
import {
  formatCurrencyIdr,
  formatCurrencyUsd,
  SHORT_CATEGORY_LABELS,
  UI_TEXT,
} from '../../i18n/translations';
import { FrostedModal } from '../FrostedModal';
import { getModelsByCategory } from '../../../shared/catalog/higgsfieldCatalog';
import {
  VIDEO_CATEGORIES,
  STILLS_CATEGORIES,
} from './plannerTypes';
import { VoiceOverItemEditor } from './editors/VoiceOverItemEditor';
import { MusicItemEditor } from './editors/MusicItemEditor';
import { VisualItemEditor } from './editors/VisualItemEditor';

interface PlannerItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ProductionItem;
  idx: number;
  calcRow?: ItemCalculationResult;
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  catalog: CatalogModelEntry[];
  assumptions: BudgetAssumptions;
  exchangeRate: number | null;
  usdPerCredit: number;
  cleanDurationSec: number;
  targetDurationSec: number;
  showManualPriceSection: boolean;
  setShowManualPriceSection: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdateField: (itemId: string, fields: Partial<ProductionItem>) => void;
  onChangeCategory: (itemId: string, category: ProcessCategory) => void;
  onChangeModel: (itemId: string, modelId: string) => void;
  onChangeParameter: (itemId: string, paramKey: string, value: any) => void;
  onToggleUnlimited: (itemId: string, unlimited: boolean) => void;
  onSetManualPricing: (
    itemId: string,
    priceValue: number | null,
    creditCost: number | null
  ) => void;
  onResetToCatalog: (itemId: string) => void;
  onOpenSetupTab: () => void;
}

export const PlannerItemModal: React.FC<PlannerItemModalProps> = ({
  isOpen,
  onClose,
  item,
  idx,
  calcRow,
  language,
  theme,
  catalog,
  assumptions,
  exchangeRate,
  usdPerCredit,
  cleanDurationSec,
  targetDurationSec,
  showManualPriceSection,
  setShowManualPriceSection,
  onUpdateField,
  onChangeCategory,
  onChangeModel,
  onChangeParameter,
  onToggleUnlimited,
  onSetManualPricing,
  onResetToCatalog,
  onOpenSetupTab,
}) => {
  if (!isOpen) return null;

  const isId = language === 'id';
  const t = UI_TEXT[language];
  const inputClass = theme === 'dark' ? 'glass-input-dark' : 'glass-input-light';

  const availableModels = getModelsByCategory(item.category, catalog);
  const selectedModel =
    catalog.find((m) => m.model_id === item.model_selection.model_id) ||
    availableModels[0];

  return (
    <FrostedModal
      isOpen={true}
      onClose={onClose}
      theme={theme}
      maxWidth="2xl"
      badgeLabel={
        item.category === 'voice_over'
          ? `${isId ? 'File Audio' : 'Audio File'} #${String(idx + 1).padStart(2, '0')}`
          : item.category === 'music'
          ? `${isId ? 'Track Musik' : 'Music Track'} #${String(idx + 1).padStart(2, '0')}`
          : `${isId ? 'Tahap Shot / Gambar' : 'Production Stage'} #${String(idx + 1).padStart(2, '0')}`
      }
      title={
        item.category === 'voice_over' ? (
          isId ? (
            <>
              Atur Detail File Audio &{' '}
              <span className="vv-accent text-sky-400">
                Model AI ElevenLabs
              </span>
            </>
          ) : (
            <>
              Configure Audio File &{' '}
              <span className="vv-accent text-sky-400">
                ElevenLabs AI Model
              </span>
            </>
          )
        ) : item.category === 'music' ? (
          isId ? (
            <>
              Atur Detail Track Musik &{' '}
              <span className="vv-accent text-purple-400">
                Model AI Suno
              </span>
            </>
          ) : (
            <>
              Configure Music Track &{' '}
              <span className="vv-accent text-purple-400">
                Suno AI Model
              </span>
            </>
          )
        ) : isId ? (
          <>
            Atur Detail Shot / Gambar &{' '}
            <span className="vv-accent text-[#0099ff]">
              Model AI Higgsfield
            </span>
          </>
        ) : (
          <>
            Configure Shot &{' '}
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
                  {formatCurrencyIdr(calcRow?.total_cost_idr ?? null, language)}
                </span>
                <span className="text-xs font-semibold tabular-nums text-[var(--vv-text-strong)]">
                  ({formatCurrencyUsd(calcRow?.total_cost_usd ?? null, language)})
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="vv-btn-accent px-6 py-2.5 text-xs font-semibold"
          >
            <span>
              {isId ? 'Selesai & Simpan Tahap' : 'Done & Save Shot'}
            </span>
          </button>
        </>
      }
    >
      <div className="space-y-5 text-xs">
        {/* 1. Nama Shot & Jenis Pembuatan AI */}
        <div className="vv-card-quiet p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--vv-text-strong)] mb-1.5">
              {item.category === 'voice_over'
                ? isId
                  ? '1. Nama File Audio / Dialog'
                  : '1. Audio File / Dialogue Name'
                : item.category === 'music'
                ? isId
                  ? '1. Judul / Deskripsi Track Musik'
                  : '1. Music Track Title / Description'
                : isId
                ? '1. Nama Shot / Tahap Pekerjaan'
                : '1. Shot / Production Stage Name'}
            </label>
            <input
              type="text"
              value={item.label}
              onChange={(e) =>
                onUpdateField(item.item_id, {
                  label: e.target.value,
                })
              }
              className={`${inputClass} w-full px-3.5 py-2.5 rounded-[10px] text-sm font-semibold`}
            />
          </div>

          {/* Klasifikasi Peran Item: Shot Utama vs Aset Pendukung */}
          {item.category === 'voice_over' ? (
            <div className="p-3 rounded-[10px] bg-sky-500/10 border border-sky-500/25 text-sky-300 text-xs flex items-center gap-2.5">
              <span className="text-base">🎙️</span>
              <span className="leading-relaxed">
                {isId
                  ? 'Item ini adalah file audio / naskah sulih suara ElevenLabs. File audio berdiri sebagai layer suara tersendiri dan tidak dihitung sebagai shot kamera video pokok.'
                  : 'This item is an ElevenLabs voiceover / dialogue audio file. Audio files reside on a dedicated audio track and are not counted as camera video shots.'}
              </span>
            </div>
          ) : item.category === 'music' ? (
            <div className="p-3 rounded-[10px] bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs flex items-center gap-2.5">
              <span className="text-base">🎵</span>
              <span className="leading-relaxed">
                {isId
                  ? 'Item ini adalah background soundtrack / musik latar Suno AI. Musik berdiri sebagai layer audio pengiring dan tidak dihitung sebagai shot kamera video pokok.'
                  : 'This item is a Suno AI background soundtrack. Music resides as an ambient background audio layer and is not counted as camera video shots.'}
              </span>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-[var(--vv-text-strong)] mb-1.5">
                {isId ? 'Peran Item dalam Video' : 'Item Role in Video'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateField(item.item_id, {
                      is_primary_shot: true,
                    })
                  }
                  className={`py-2 px-3 rounded-[9px] text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                    (item.is_primary_shot ??
                      (item.category === 'text_to_video' ||
                        item.category === 'image_to_video'))
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                      : 'bg-[var(--vv-field)] text-[var(--vv-text-muted)] border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
                  }`}
                >
                  <span>🎬</span>
                  <span>{isId ? 'Shot Utama Cerita' : 'Primary Story Shot'}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateField(item.item_id, {
                      is_primary_shot: false,
                    })
                  }
                  className={`py-2 px-3 rounded-[9px] text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                    !(item.is_primary_shot ??
                      (item.category === 'text_to_video' ||
                        item.category === 'image_to_video'))
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                      : 'bg-[var(--vv-field)] text-[var(--vv-text-muted)] border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
                  }`}
                >
                  <span>🛠️</span>
                  <span>{isId ? 'Aset Pendukung' : 'Supporting Asset'}</span>
                </button>
              </div>
              <p className="text-[11px] text-[var(--vv-text-muted)] mt-1.5 leading-relaxed">
                {isId
                  ? 'Shot Utama dihitung sebagai potongan visual pokok video (storyboard). Aset Pendukung (seperti Upscale/Konsep) tetap dihitung biayanya tetapi tidak menambah jumlah shot video.'
                  : 'Primary Shots count toward your storyboard visual shot count. Supporting Assets (like Upscale/Concept art) are budgeted but do not inflate shot count.'}
              </p>
            </div>
          )}

          {item.category === 'voice_over' ? (
            <div className="flex items-center justify-between p-2.5 rounded-[9px] bg-sky-500/10 border border-sky-500/25 text-xs">
              <span className="font-semibold text-sky-300 flex items-center gap-1.5">
                <span>🎙️</span>
                <span>
                  {isId
                    ? 'Kategori: Sulih Suara & Dialog (ElevenLabs)'
                    : 'Category: Voiceover & Dialogue (ElevenLabs)'}
                </span>
              </span>
              <span className="text-[11px] text-[var(--vv-text-muted)]">
                {isId ? 'Layer audio narasi film' : 'Film dialogue audio track'}
              </span>
            </div>
          ) : item.category === 'music' ? (
            <div className="flex items-center justify-between p-2.5 rounded-[9px] bg-purple-500/10 border border-purple-500/25 text-xs">
              <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                <span>🎵</span>
                <span>
                  {isId
                    ? 'Kategori: Musik Latar & Soundtrack (Suno AI)'
                    : 'Category: Soundtrack & Background Music (Suno AI)'}
                </span>
              </span>
              <span className="text-[11px] text-[var(--vv-text-muted)]">
                {isId ? 'Layer audio pengiring film' : 'Film soundtrack audio track'}
              </span>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-[var(--vv-text-strong)] mb-1.5">
                {VIDEO_CATEGORIES.includes(item.category)
                  ? isId
                    ? '2. Pilih Jenis Pembuatan Video AI (Higgsfield)'
                    : '2. Select AI Video Creation Type (Higgsfield)'
                  : isId
                  ? '2. Pilih Jenis Pembuatan Gambar AI (Higgsfield)'
                  : '2. Select AI Image Creation Type (Higgsfield)'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(VIDEO_CATEGORIES.includes(item.category)
                  ? VIDEO_CATEGORIES
                  : STILLS_CATEGORIES
                ).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => onChangeCategory(item.item_id, cat)}
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
          )}
        </div>

        {/* 2. Model AI & Pengaturan Kualitas */}
        <div className="vv-card-quiet p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--vv-text-strong)] mb-1.5">
              {item.category === 'voice_over'
                ? isId
                  ? '3. Pilih Model Suara Resmi ElevenLabs'
                  : '3. Select Official ElevenLabs Voice Model'
                : item.category === 'music'
                ? isId
                  ? '3. Pilih Model Musik Resmi Suno AI'
                  : '3. Select Official Suno AI Music Model'
                : isId
                ? '3. Pilih Model AI Higgsfield'
                : '3. Select Higgsfield AI Model'}
            </label>
            <select
              value={item.model_selection.model_id}
              onChange={(e) => onChangeModel(item.item_id, e.target.value)}
              className={`${inputClass} w-full px-3.5 py-2.5 rounded-[10px] text-xs font-semibold`}
            >
              {availableModels.map((m) => {
                const v = m.pricing_variants[0];
                const badge =
                  m.tier_badge && m.tier_badge !== 'STANDARD'
                    ? `[${m.tier_badge}] `
                    : '';
                const idr =
                  v?.price_value && exchangeRate
                    ? formatCurrencyIdr(
                        v.price_value * exchangeRate,
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
          {selectedModel && item.category !== 'music' && selectedModel.parameters && selectedModel.parameters.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--vv-border)]">
              {selectedModel.parameters.map((param: any) => {
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
                          onChangeParameter(
                            item.item_id,
                            param.key,
                            e.target.value
                          )
                        }
                        className={`${inputClass} w-full px-3 py-2 rounded-[9px] text-xs font-medium`}
                      >
                        {param.options.map((opt: any) => (
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
                          onChangeParameter(
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

        {/* 3. Editor Khusus Berdasarkan Kategori */}
        {item.category === 'voice_over' ? (
          <VoiceOverItemEditor
            item={item}
            calcRow={calcRow}
            language={language}
            theme={theme}
            cleanDurationSec={cleanDurationSec}
            targetDurationSec={targetDurationSec}
            exchangeRate={exchangeRate}
            elevenlabsPlanId={assumptions.elevenlabs_plan_id}
            defaultAttemptsPerShot={assumptions.default_attempts_per_shot || 1}
            onUpdateField={onUpdateField}
          />
        ) : item.category === 'music' ? (
          <MusicItemEditor
            item={item}
            calcRow={calcRow}
            language={language}
            theme={theme}
            exchangeRate={exchangeRate}
            sunoPlanId={assumptions.suno_plan_id}
            defaultAttemptsPerShot={assumptions.default_attempts_per_shot || 1}
            modelName={selectedModel?.model_name || 'Suno v5.5'}
            onUpdateField={onUpdateField}
          />
        ) : (
          <VisualItemEditor
            item={item}
            calcRow={calcRow}
            selectedModel={selectedModel}
            language={language}
            theme={theme}
            exchangeRate={exchangeRate}
            defaultAttemptsPerShot={assumptions.default_attempts_per_shot || 1}
            usdPerCredit={usdPerCredit}
            showManualPriceSection={showManualPriceSection}
            setShowManualPriceSection={setShowManualPriceSection}
            onUpdateField={onUpdateField}
            onToggleUnlimited={onToggleUnlimited}
            onSetManualPricing={onSetManualPricing}
            onResetToCatalog={onResetToCatalog}
            onOpenSetupTab={onOpenSetupTab}
          />
        )}
      </div>
    </FrostedModal>
  );
};
