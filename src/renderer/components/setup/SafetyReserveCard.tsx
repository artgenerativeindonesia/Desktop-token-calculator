import React from 'react';
import {
  ProductionItem,
  ProjectCalculation,
} from '../../../shared/types/project';
import {
  formatCurrencyIdr,
  formatCurrencyUsd,
  UI_TEXT,
} from '../../i18n/translations';
import { ArrowLeftRight } from 'lucide-react';

interface SafetyReserveCardProps {
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  items: ProductionItem[];
  calculation: ProjectCalculation;
  cadanganCount: number;
  onCadanganMultiplierChange: (count: number) => void;
}

export const SafetyReserveCard: React.FC<SafetyReserveCardProps> = ({
  language,
  theme,
  items,
  calculation,
  cadanganCount,
  onCadanganMultiplierChange,
}) => {
  const isId = language === 'id';
  const t = UI_TEXT[language];
  const heroCardClass =
    theme === 'dark' ? 'vv-card-hero-dark' : 'vv-card-hero-light';
  const inputClass =
    theme === 'dark' ? 'glass-input-dark' : 'glass-input-light';

  const totalItemCount = items.reduce(
    (sum: number, item: ProductionItem) => sum + item.quantity,
    0
  );

  return (
    <div
      className={`${heroCardClass} lg:col-span-6 rounded-[18px] p-6 flex flex-col justify-between space-y-5`}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-[var(--vv-border)] pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0099ff] flex items-center gap-2">
            <span className="vv-blue-dot" />
            <ArrowLeftRight className="w-4 h-4 text-[#ffb840]" />
            <span>
              {isId
                ? 'Dana Jaga-Jaga Proyek (Cadangan Percobaan)'
                : 'Project Safety Reserve (Contingency Multiplier)'}
            </span>
          </h2>
          <span className="vv-badge-pill">
            <span className="size-1.5 rounded-full bg-[#0099ff]" />
            <span className="font-semibold">
              {isId ? `${cadanganCount}x Cadangan` : `${cadanganCount}x Reserve`}
            </span>
          </span>
        </div>

        {/* Pilihan Cepat Preset Cadangan */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-[var(--vv-text-muted)]">
            {isId ? 'Pilihan Cepat Cadangan:' : 'Quick Reserve Presets:'}
          </span>
          <div className="flex items-center gap-1.5">
            {[
              { count: 2, label: isId ? '2 cadangan (Hemat)' : '2x (Lean)' },
              { count: 5, label: isId ? '5 cadangan (Standar)' : '5x (Standard)' },
              { count: 10, label: isId ? '10 cadangan (Aman)' : '10x (Safe)' },
            ].map((preset) => (
              <button
                key={preset.count}
                type="button"
                onClick={() => onCadanganMultiplierChange(preset.count)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium border transition ${
                  cadanganCount === preset.count
                    ? 'bg-[#0099ff]/20 text-[#0099ff] border-[#0099ff]/50 font-bold'
                    : 'bg-[var(--vv-tint-weak)] text-[var(--vv-text-muted)] border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Kotak Input Cadangan Langsung */}
        <div className="p-4 rounded-[14px] bg-[#0099ff]/10 border border-[#0099ff]/40 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[var(--vv-text-strong)]">
              {isId
                ? 'Angka Cadangan Percobaan per Shot / Gambar'
                : 'Reserve Multiplier per Shot / Image'}
            </label>
            <span className="text-xs font-mono font-bold text-[#0099ff]">
              {cadanganCount}x {isId ? 'cadangan' : 'reserve'}
            </span>
          </div>
          <div className="relative">
            <input
              type="number"
              min={1}
              max={50}
              step={1}
              value={cadanganCount}
              onChange={(e) =>
                onCadanganMultiplierChange(Math.max(1, Number(e.target.value) || 1))
              }
              className={`${inputClass} w-full pr-24 pl-3.5 py-2.5 rounded-[10px] text-xl font-bold tabular-nums text-right`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--vv-text-muted)] pointer-events-none">
              {isId ? 'cadangan' : 'reserve'}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={Math.min(20, Math.max(1, cadanganCount))}
            onChange={(e) => onCadanganMultiplierChange(Number(e.target.value))}
            className="w-full accent-[#0099ff] cursor-pointer"
          />
          <p className="text-[11px] text-[var(--vv-text-muted)] leading-relaxed">
            {isId
              ? `Rumus di Langkah 3: Kebutuhan gambar × ${cadanganCount} cadangan = Total kali buat. Contoh: butuh 20 gambar × ${cadanganCount} cadangan = ${20 * cadanganCount} kali buat.`
              : `Formula in Step 3: Scene requirement × ${cadanganCount} reserve = Total tries. Example: need 20 images × ${cadanganCount} reserve = ${20 * cadanganCount} tries.`}
          </p>
        </div>
      </div>

      {/* Kotak Rangkuman Dampak Anggaran */}
      <div className="p-4 rounded-[14px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border-strong)] space-y-2.5 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-[var(--vv-text-muted)]">
            {isId ? 'Total Kebutuhan Shot / Gambar:' : 'Total Shot / Image Requirements:'}
          </span>
          <span className="font-semibold tabular-nums">
            {totalItemCount}{' '}
            {isId ? 'shot / gambar' : 'shots / images'}
          </span>
        </div>
        <div className="flex justify-between items-center text-[#0099ff]">
          <span>
            {isId ? 'Dikalikan Cadangan Langkah 2:' : 'Multiplied by Step 2 Reserve:'}
          </span>
          <span className="font-semibold tabular-nums">
            &times; {cadanganCount} cadangan
          </span>
        </div>
        {calculation.target_videos > 1 && (
          <div className="flex justify-between items-center text-emerald-400">
            <span>
              {isId ? 'Dikalikan Jumlah Video:' : 'Multiplied by Target Videos:'}
            </span>
            <span className="font-semibold tabular-nums">
              &times; {calculation.target_videos} video
            </span>
          </div>
        )}
        <div className="pt-2.5 border-t border-[var(--vv-border)] flex justify-between items-baseline">
          <span className="font-bold text-sm">{t.totalBudget}:</span>
          <div className="text-right">
            <div className="text-xl font-bold tabular-nums text-[#0099ff]">
              {formatCurrencyIdr(calculation.total_cost_idr, language)}
            </div>
            {calculation.target_videos > 1 && (
              <div className="text-[11px] text-[#7acaff] font-medium">
                {isId
                  ? `(Proyeksi: ${formatCurrencyIdr(calculation.one_video_total_cost_idr, language)} / 1 video × ${calculation.target_videos} video)`
                  : `(Projection: ${formatCurrencyUsd(calculation.one_video_total_cost_usd, language)} / 1 video × ${calculation.target_videos} videos)`}
              </div>
            )}
            <div className="text-xs font-semibold tabular-nums text-[var(--vv-text-strong)]">
              {formatCurrencyUsd(calculation.total_cost_usd, language)} &bull;{' '}
              {calculation.budgeted_generations}{' '}
              {isId ? 'kali buat' : 'total tries'}
              {calculation.total_credit !== null
                ? ` • ${calculation.total_credit} Credit`
                : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
