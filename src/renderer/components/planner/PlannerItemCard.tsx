import React from 'react';
import {
  ProductionItem,
  ItemCalculationResult,
  CatalogModelEntry,
  BudgetAssumptions,
} from '../../../shared/types/project';
import {
  SHORT_CATEGORY_LABELS,
  formatCurrencyIdr,
  formatCurrencyUsd,
  UI_TEXT,
} from '../../i18n/translations';
import { StatusBadge } from '../StatusBadge';
import { InfoTip } from '../InfoTip';
import {
  Copy,
  Mic,
  Music,
  Sliders,
  Trash2,
} from 'lucide-react';
import { tierBadgeClass, unitNoun } from './plannerTypes';

interface PlannerItemCardProps {
  item: ProductionItem;
  idx: number;
  calcRow?: ItemCalculationResult;
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  catalog: CatalogModelEntry[];
  assumptions: BudgetAssumptions;
  targetVideos: number;
  onOpenEditModal: (itemId: string, isManualPrice: boolean) => void;
  onDuplicateItem: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onTogglePrimaryShot: (itemId: string) => void;
}

export const PlannerItemCard: React.FC<PlannerItemCardProps> = ({
  item,
  idx,
  calcRow,
  language,
  theme,
  catalog,
  assumptions,
  targetVideos,
  onOpenEditModal,
  onDuplicateItem,
  onRemoveItem,
  onTogglePrimaryShot,
}) => {
  const isId = language === 'id';
  const t = UI_TEXT[language];
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';

  const paramSummary = Object.entries(item.model_selection.parameter_values)
    .map(([, val]) => String(val))
    .join(' • ');

  const cadanganCount =
    assumptions.default_attempts_per_shot ||
    item.attempts_per_item ||
    1;
  const itemTotalGenerations =
    calcRow?.budgeted_generations ?? item.quantity * cadanganCount;

  return (
    <div
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
                  (item.category === 'voice_over'
                    ? isId
                      ? 'File Audio Tanpa Nama'
                      : 'Untitled Audio File'
                    : item.category === 'music'
                    ? isId
                      ? 'Track Musik Tanpa Nama'
                      : 'Untitled Music Track'
                    : isId
                    ? 'Shot / Gambar Tanpa Nama'
                    : 'Untitled Shot')}
              </span>
              {item.category === 'voice_over' ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-sky-500/15 text-sky-300 border-sky-500/35 flex items-center gap-1">
                  <span>🎙️</span>
                  <span>{isId ? 'File Audio' : 'Audio File'}</span>
                </span>
              ) : item.category === 'music' ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-purple-500/15 text-purple-300 border-purple-500/35 flex items-center gap-1">
                  <span>🎵</span>
                  <span>{isId ? 'Track Musik' : 'Music Track'}</span>
                </span>
              ) : (() => {
                const isPrimary =
                  typeof item.is_primary_shot === 'boolean'
                    ? item.is_primary_shot
                    : item.category === 'text_to_video' || item.category === 'image_to_video';
                return (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePrimaryShot(item.item_id);
                    }}
                    title={
                      isId
                        ? 'Klik untuk berganti status antara Shot Utama vs Aset Pendukung'
                        : 'Click to toggle between Primary Shot vs Supporting Asset'
                    }
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition flex items-center gap-1 cursor-pointer ${
                      isPrimary
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/35 hover:bg-indigo-500/25'
                    }`}
                  >
                    <span>{isPrimary ? '🎬' : '🛠️'}</span>
                    <span>
                      {isPrimary
                        ? isId
                          ? 'Shot Utama'
                          : 'Primary Shot'
                        : isId
                        ? 'Aset Pendukung'
                        : 'Supporting Asset'}
                    </span>
                  </button>
                );
              })()}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[var(--vv-tint-weak)] border border-[var(--vv-border)] text-[var(--vv-text-muted)]">
                {SHORT_CATEGORY_LABELS[item.category][language]}
              </span>
              {item.is_unlimited ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/35">
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
              <strong className="text-[var(--vv-text-strong)] flex items-center gap-1">
                {item.category === 'voice_over' && (
                  <Mic className="w-3.5 h-3.5 text-sky-400" />
                )}
                {item.category === 'music' && (
                  <Music className="w-3.5 h-3.5 text-purple-400" />
                )}
                {item.model_selection.model_name}
              </strong>

              {item.category === 'voice_over' ? (
                <>
                  <span>&bull;</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    🔤{' '}
                    {item.character_count ||
                      (item.script_text
                        ? item.script_text.length
                        : Math.round(
                            (item.duration_seconds || 10) * 14.5
                          ))}{' '}
                    {isId ? 'karakter' : 'chars'}
                  </span>
                  <span>&bull;</span>
                  <span className="text-amber-400 font-medium">
                    ⏱️ {item.duration_seconds || 10}s (
                    {item.script_language === 'en'
                      ? '🇬🇧 EN'
                      : '🇮🇩 ID'}
                    )
                  </span>
                  {calcRow?.total_credit !== null && calcRow?.total_credit !== undefined && (
                    <>
                      <span>&bull;</span>
                      <span className="text-sky-300 font-semibold">
                        🎙️ {calcRow.total_credit.toLocaleString()}{' '}
                        ElevenLabs Cr
                      </span>
                    </>
                  )}
                </>
              ) : item.category === 'music' ? (
                <>
                  <span>&bull;</span>
                  <span className="text-purple-300 font-medium">
                    🎵 {(calcRow?.budgeted_generations || 1) * 2}{' '}
                    {isId ? 'variasi klip' : 'clip variations'} (
                    {calcRow?.budgeted_generations || 1}x{' '}
                    {isId ? 'buat' : 'gen'})
                  </span>
                  <span>&bull;</span>
                  <span className="text-emerald-300 font-medium">
                    {item.stem_enabled ||
                    (item.stem_separation_mode &&
                      item.stem_separation_mode !== 'none')
                      ? item.stem_type === 'full_stems' ||
                        item.stem_separation_mode === 'full_stems'
                        ? '🎚️ Full Studio Stems (+50 Cr/lagu)'
                        : '🎛️ 2-Stems Split (+20 Cr/lagu)'
                      : isId
                      ? '🎛️ Stereo Mix Standar (0 Cr)'
                      : '🎛️ Standard Stereo Mix (0 Cr)'}
                  </span>
                  {calcRow?.total_credit !== null && calcRow?.total_credit !== undefined && (
                    <>
                      <span>&bull;</span>
                      <span className="text-purple-300 font-semibold">
                        🎵 {calcRow.total_credit.toLocaleString()} Suno
                        Cr
                      </span>
                    </>
                  )}
                </>
              ) : (
                <>
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
                        {item.duration_seconds}{' '}
                        {isId ? 'detik' : 'sec'}
                      </span>
                      {(() => {
                        const isPrimary =
                          typeof item.is_primary_shot === 'boolean'
                            ? item.is_primary_shot
                            : item.category === 'text_to_video' ||
                              item.category === 'image_to_video';
                        return isPrimary ? (
                          <span className="text-emerald-400 font-semibold">
                            (⏱️ +
                            {item.quantity * item.duration_seconds}s{' '}
                            {isId
                              ? 'ke durasi video'
                              : 'to video length'}
                            )
                          </span>
                        ) : null;
                      })()}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Middle: Ringkasan hitungan */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() =>
              onOpenEditModal(item.item_id, item.pricing.status === 'manual')
            }
            title={
              isId
                ? 'Klik untuk mengubah angka di "Atur Detail"'
                : 'Click to change numbers in "Edit Details"'
            }
            className="vv-card-quiet px-3.5 py-2 text-left hover:border-[#0099ff]/45 transition"
          >
            <div className="text-xs text-[var(--vv-text-strong)] tabular-nums">
              <strong>{item.quantity}</strong>{' '}
              {unitNoun(item.quantity_type, language, item.category)}{' '}
              <span className="text-[10px] text-emerald-400 font-medium">
                ({isId ? '1 video' : '1 video'})
              </span>{' '}
              &bull;{' '}
              <span className="text-[#0099ff] font-semibold">
                {isId ? 'Total Buat:' : 'Total Tries:'}{' '}
                {itemTotalGenerations}x
              </span>
            </div>
            <div className="text-[10px] text-[var(--vv-text-subtle)] mt-0.5">
              {isId
                ? `(dikalikan ${cadanganCount} cadangan Langkah 2)`
                : `(multiplied by ${cadanganCount} Step 2 reserve)`}
              {targetVideos > 1 && (
                <span className="text-sky-400 font-semibold block mt-0.5">
                  &bull; {item.quantity * targetVideos}{' '}
                  {unitNoun(item.quantity_type, language, item.category)}{' '}
                  {isId
                    ? `total (${targetVideos} video)`
                    : `total (${targetVideos} videos)`}
                </span>
              )}
            </div>
          </button>
          <InfoTip align="right" width={270}>
            {isId ? (
              <>
                <strong>Dari mana angka ini?</strong>
                <br />
                Kebutuhan: {item.quantity} {unitNoun(item.quantity_type, language, item.category)} (untuk 1 video).
                <br />
                Dikalikan Cadangan Langkah 2 ({cadanganCount} cadangan) ={' '}
                {itemTotalGenerations} kali buat.
                <br />
                <span className="text-[#7acaff]">
                  Untuk mengubah jumlah kebutuhan, klik &ldquo;Atur Detail&rdquo;.
                </span>
              </>
            ) : (
              <>
                <strong>Where does this count come from?</strong>
                <br />
                Requirement: {item.quantity} {unitNoun(item.quantity_type, language, item.category)} (for 1 video).
                <br />
                Multiplied by Step 2 Reserve ({cadanganCount} reserve) ={' '}
                {itemTotalGenerations} generations.
                <br />
                <span className="text-[#7acaff]">
                  Click &ldquo;Edit Details&rdquo; to change the count.
                </span>
              </>
            )}
          </InfoTip>
        </div>

        {/* Right: Subtotal + Action Buttons */}
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
              {targetVideos > 1 && (
                <span className="text-emerald-400 font-semibold block text-[10px]">
                  {isId
                    ? `per 1 video (×${targetVideos} total)`
                    : `per 1 video (×${targetVideos} total)`}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                onOpenEditModal(item.item_id, item.pricing.status === 'manual')
              }
              className="vv-btn-secondary px-3.5 py-2 text-xs font-medium"
            >
              <Sliders className="w-3.5 h-3.5 text-[#0099ff]" />
              <span>{isId ? 'Atur Detail' : 'Edit Details'}</span>
            </button>

            <button
              type="button"
              onClick={() => onDuplicateItem(item.item_id)}
              title={t.duplicateBtn}
              className="p-2 rounded-full bg-[var(--vv-tint-weak)] hover:bg-[var(--vv-tint)] border border-[var(--vv-border)] text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)] transition"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onRemoveItem(item.item_id)}
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
};
