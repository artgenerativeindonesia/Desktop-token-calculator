import React from 'react';
import {
  ProductionItem,
  ItemCalculationResult,
  CatalogModelEntry,
} from '../../../../shared/types/project';
import {
  formatCurrencyIdr,
  formatCurrencyUsd,
  PRICING_UNIT_LABELS,
} from '../../../i18n/translations';
import { InfoTip } from '../../InfoTip';
import { StatusBadge } from '../../StatusBadge';
import { unitNoun, quantityQuestion } from '../plannerTypes';
import {
  ChevronDown,
  ChevronUp,
  Info,
  RotateCcw,
} from 'lucide-react';

interface VisualItemEditorProps {
  item: ProductionItem;
  calcRow?: ItemCalculationResult;
  selectedModel?: CatalogModelEntry;
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  exchangeRate: number | null;
  defaultAttemptsPerShot: number;
  usdPerCredit: number;
  showManualPriceSection: boolean;
  setShowManualPriceSection: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdateField: (itemId: string, fields: Partial<ProductionItem>) => void;
  onToggleUnlimited: (itemId: string, unlimited: boolean) => void;
  onSetManualPricing: (
    itemId: string,
    priceValue: number | null,
    creditCost: number | null
  ) => void;
  onResetToCatalog: (itemId: string) => void;
  onOpenSetupTab: () => void;
}

export const VisualItemEditor: React.FC<VisualItemEditorProps> = ({
  item,
  calcRow,
  selectedModel,
  language,
  theme,
  exchangeRate,
  defaultAttemptsPerShot,
  usdPerCredit,
  showManualPriceSection,
  setShowManualPriceSection,
  onUpdateField,
  onToggleUnlimited,
  onSetManualPricing,
  onResetToCatalog,
  onOpenSetupTab,
}) => {
  const isId = language === 'id';
  const inputClass = theme === 'dark' ? 'glass-input-dark' : 'glass-input-light';

  const noun = unitNoun(item.quantity_type, language, item.category);
  const isPerSecond = item.pricing.pricing_unit === 'per_second';
  const showDuration = !!selectedModel?.supports_duration || isPerSecond;
  const unitUsd = item.pricing.price_value;
  const unitCredit = item.pricing.credit_cost;
  const unitIdr =
    unitUsd !== null && exchangeRate ? unitUsd * exchangeRate : null;
  const unitLabel = PRICING_UNIT_LABELS[item.pricing.pricing_unit][language];
  const unitPriceText = [
    unitCredit !== null ? `${unitCredit} Credit` : null,
    unitIdr !== null
      ? formatCurrencyIdr(unitIdr, language)
      : unitUsd !== null
      ? formatCurrencyUsd(unitUsd, language)
      : null,
  ]
    .filter(Boolean)
    .join(' • ');

  const cadanganCount =
    defaultAttemptsPerShot || item.attempts_per_item || 1;
  const itemTotalGenerations =
    calcRow?.budgeted_generations ?? item.quantity * cadanganCount;

  return (
    <div className="space-y-4">
      {/* 4. Berapa Banyak yang Ingin Dibuat */}
      <div className="vv-card-quiet p-4 space-y-4">
        <div className="text-xs font-semibold text-[var(--vv-text-strong)]">
          {isId
            ? '4. Berapa Banyak yang Ingin Dibuat?'
            : '4. How Much Do You Want to Make?'}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Kolom 1: Mau buat berapa */}
          <div>
            <label className="flex items-center gap-1 text-[11px] text-[var(--vv-text-muted)] mb-1">
              <span>{quantityQuestion(item.quantity_type, language, item.category)}</span>
              <InfoTip>
                {isId
                  ? `Jumlah ${noun} jadi yang Anda butuhkan untuk tahap ini. Contoh: butuh 2 ${noun}, isi 2.`
                  : `The number of finished ${noun} you need for this stage. Example: need 2 ${noun}, enter 2.`}
              </InfoTip>
            </label>
            <input
              type="number"
              min={1}
              step={1}
              value={item.quantity}
              onChange={(e) => {
                const cadanganMultiplier =
                  defaultAttemptsPerShot || item.attempts_per_item || 1;
                onUpdateField(item.item_id, {
                  quantity: Math.max(
                    1,
                    Math.floor(Number(e.target.value) || 1)
                  ),
                  attempts_per_item: cadanganMultiplier,
                });
              }}
              className={`${inputClass} w-full px-3.5 py-2.5 rounded-[10px] text-sm font-bold tabular-nums text-right`}
            />
          </div>

          {/* Kolom 2: Durasi (jika ada) atau info cara tagih */}
          {showDuration ? (
            <div>
              <label className="flex items-center gap-1 text-[11px] text-[var(--vv-text-muted)] mb-1">
                <span>
                  {isId
                    ? 'Panjang Tiap Shot (Detik)'
                    : 'Length of Each Shot (Seconds)'}
                </span>
                <InfoTip align="right">
                  {isPerSecond
                    ? isId
                      ? 'Berapa detik panjang satu klip video yang dibuat AI. Model ini ditagih per detik, jadi makin panjang makin mahal.'
                      : 'How many seconds each AI video clip lasts. This model charges per second, so longer clips cost more.'
                    : isId
                    ? 'Berapa detik panjang satu klip video. Untuk model ini, panjang klip tidak mengubah harga karena ditagih per kali buat.'
                    : 'How many seconds each clip lasts. For this model, length does not change the price because it charges per generation.'}
                </InfoTip>
              </label>
              <input
                type="number"
                min={1}
                max={60}
                step={1}
                value={item.duration_seconds}
                onChange={(e) =>
                  onUpdateField(item.item_id, {
                    duration_seconds: Math.max(
                      0,
                      Number(e.target.value) || 0
                    ),
                  })
                }
                className={`${inputClass} w-full px-3.5 py-2.5 rounded-[10px] text-sm font-bold tabular-nums text-right`}
              />
              <span className="block text-[10px] text-[var(--vv-text-muted)] mt-1 text-right">
                {isPerSecond
                  ? isId
                    ? `Ditagih per detik video${unitPriceText ? ` • ${unitPriceText} per detik` : ''}`
                    : `Charged per video second${unitPriceText ? ` • ${unitPriceText} per second` : ''}`
                  : isId
                  ? `Ditagih per kali buat${unitPriceText ? ` • ${unitPriceText}` : ''}`
                  : `Charged per generation${unitPriceText ? ` • ${unitPriceText}` : ''}`}
              </span>
              {(() => {
                const isPrimary =
                  typeof item.is_primary_shot === 'boolean'
                    ? item.is_primary_shot
                    : item.category === 'text_to_video' ||
                      item.category === 'image_to_video';
                return isPrimary ? (
                  <span className="block text-[10px] text-emerald-400 font-semibold mt-1 text-right">
                    ⏱️{' '}
                    {isId
                      ? `Berkontribusi +${item.quantity * item.duration_seconds}s ke Durasi Bersih 1 video`
                      : `Contributes +${item.quantity * item.duration_seconds}s to 1-video Clean Duration`}
                  </span>
                ) : (
                  <span className="block text-[10px] text-indigo-300 font-medium mt-1 text-right">
                    🛠️{' '}
                    {isId
                      ? 'Aset Pendukung tidak menambah Durasi Bersih'
                      : 'Supporting asset does not add to Clean Duration'}
                  </span>
                );
              })()}
            </div>
          ) : (
            <div className="flex flex-col justify-center gap-1.5 pt-1 sm:pt-4">
              <div className="flex items-center gap-1.5 text-xs text-[var(--vv-text-muted)]">
                <Info className="w-4 h-4 text-[#0099ff] shrink-0" />
                <span>
                  {isId
                    ? `Model ini ditagih ${unitLabel}${
                        item.pricing.pricing_unit === 'per_generation'
                          ? ' (bukan per detik)'
                          : ''
                      }`
                    : `This model charges ${unitLabel}`}
                </span>
              </div>
              {unitPriceText && (
                <div className="text-xs font-semibold tabular-nums text-[var(--vv-text-strong)] pl-5">
                  {unitPriceText}{' '}
                  <span className="font-normal text-[var(--vv-text-muted)]">
                    {unitLabel}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Ringkasan Bersih & Minimalis: Perkalian Kebutuhan x Cadangan Langkah 2 */}
        <div className="rounded-[12px] border border-[#0099ff]/30 bg-[#0099ff]/[0.07] p-3.5 space-y-1.5 text-xs">
          <div className="flex flex-wrap items-center justify-between text-[var(--vv-text-muted)]">
            <span>
              {isId
                ? `Kebutuhan: ${item.quantity} ${noun} • Dikalikan Cadangan Langkah 2 (${cadanganCount} cadangan)`
                : `Requirement: ${item.quantity} ${noun} • Multiplied by Step 2 Reserve (${cadanganCount} reserve)`}
            </span>
            <span className="tabular-nums font-mono text-[var(--vv-text-strong)] font-semibold">
              {itemTotalGenerations}x {isId ? 'buat' : 'tries'}
            </span>
          </div>
          <div className="flex flex-wrap items-baseline justify-between pt-1 border-t border-[var(--vv-border)]">
            <span className="font-medium text-[var(--vv-text-strong)]">
              {isId ? 'Total Anggaran Tahap Ini:' : 'Total Stage Budget:'}
            </span>
            <div className="text-right">
              <strong className="text-base text-[#0099ff] tabular-nums">
                {formatCurrencyIdr(calcRow?.total_cost_idr ?? null, language)}
              </strong>
              <span className="text-xs text-[var(--vv-text-muted)] tabular-nums ml-2">
                ({formatCurrencyUsd(calcRow?.total_cost_usd ?? null, language)}
                {calcRow?.total_credit !== null && calcRow?.total_credit !== undefined
                  ? ` • ${calcRow.total_credit} Credit`
                  : ''})
              </span>
            </div>
          </div>
          <div className="pt-0.5 text-right">
            <button
              type="button"
              onClick={onOpenSetupTab}
              className="text-[11px] font-medium text-[#0099ff] hover:underline"
            >
              {isId
                ? 'Ubah angka cadangan di Langkah 2 →'
                : 'Change reserve count in Step 2 →'}
            </button>
          </div>
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
          onChange={(e) => onToggleUnlimited(item.item_id, e.target.checked)}
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
              <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
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
            onClick={() => setShowManualPriceSection((prev) => !prev)}
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
                  {PRICING_UNIT_LABELS[item.pricing.pricing_unit][language]})
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
                      e.target.value === '' ? null : Number(e.target.value);
                    onSetManualPricing(
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
                      e.target.value === '' ? null : Number(e.target.value);
                    onSetManualPricing(
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
                  onClick={() => onResetToCatalog(item.item_id)}
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
  );
};
