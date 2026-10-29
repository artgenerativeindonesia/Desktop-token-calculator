import React from 'react';
import { ProjectCalculation, ProjectFile } from '../../../shared/types/project';
import {
  formatCurrencyIdr,
  formatCurrencyUsd,
  UI_TEXT,
} from '../../i18n/translations';
import { ArrowRight, Coins, Film, RefreshCw, Sliders } from 'lucide-react';

interface DashboardSupportingMetricsProps {
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  project: ProjectFile;
  calculation: ProjectCalculation;
  isRefreshingFx: boolean;
  onRefreshFx: () => void;
  onNavigateToSetup: () => void;
  onNavigateToPlanner: () => void;
  onNavigateToSettings: () => void;
}

export const DashboardSupportingMetrics: React.FC<DashboardSupportingMetricsProps> = ({
  language,
  theme,
  project,
  calculation: calc,
  isRefreshingFx,
  onRefreshFx,
  onNavigateToSetup,
  onNavigateToPlanner,
  onNavigateToSettings,
}) => {
  const isId = language === 'id';
  const t = UI_TEXT[language];
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';

  const totalSceneQuantity = project.items.reduce(
    (sum, item) => sum + Math.max(0, Math.floor(item.quantity)),
    0
  );

  const cadanganMultiplier =
    project.assumptions.default_attempts_per_shot ||
    project.assumptions.reserve_generations_override ||
    1;

  const targetVideosCount = Math.max(1, calc.target_videos || 1);
  const totalItemsAllVideos = totalSceneQuantity * targetVideosCount;
  const primaryShotDivisor =
    calc.total_primary_shots > 0
      ? calc.total_primary_shots
      : totalItemsAllVideos;

  // Rata-rata per 1 Shot Utama (termasuk overhead aset pendukung & multi-video)
  const avgCostPerItemIdr =
    primaryShotDivisor > 0 && calc.total_cost_idr !== null
      ? calc.total_cost_idr / primaryShotDivisor
      : null;
  const avgCostPerItemUsd =
    primaryShotDivisor > 0 ? calc.total_cost_usd / primaryShotDivisor : 0;

  // Rata-rata per 1x generasi AI
  const avgCostPerGenIdr =
    calc.budgeted_generations > 0 && calc.total_cost_idr !== null
      ? calc.total_cost_idr / calc.budgeted_generations
      : null;
  const avgCostPerGenUsd =
    calc.budgeted_generations > 0
      ? calc.total_cost_usd / calc.budgeted_generations
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Supporting Card 1: Rumus Kali Pembuatan AI */}
      <div
        className={`${cardClass} rounded-[16px] p-5 flex flex-col justify-between`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)]">
            {isId ? 'Rumus Kali Pembuatan AI' : 'AI Generation Breakdown'}
          </span>
          <Sliders className="w-4 h-4 text-[#0099ff]" />
        </div>

        <div className="my-4 grid grid-cols-2 gap-2.5 text-xs">
          <div className="vv-card-quiet p-3">
            <div className="text-[11px] text-[var(--vv-text-muted)]">
              {isId ? 'Kebutuhan Shot / Gambar' : 'Base Shots / Images'}
            </div>
            <div className="text-base font-bold tabular-nums text-right mt-1">
              {totalSceneQuantity}{' '}
              <span className="text-xs font-normal text-[var(--vv-text-muted)]">
                {isId ? 'item' : 'items'}
              </span>
            </div>
            <div className="text-[10px] text-[var(--vv-text-subtle)] tabular-nums text-right">
              {isId
                ? `${calc.one_video_primary_shot_count} shot utama di Langkah 3`
                : `${calc.one_video_primary_shot_count} primary shots in Step 3`}
            </div>
          </div>

          <div className="vv-card-quiet p-3">
            <div className="text-[11px] text-[#0099ff]">
              {isId ? 'Cadangan Langkah 2' : 'Step 2 Reserve'}
            </div>
            <div className="text-base font-bold tabular-nums text-[#0099ff] text-right mt-1">
              {cadanganMultiplier}{' '}
              <span className="text-xs font-normal text-[var(--vv-text-muted)]">
                {isId ? 'cadangan' : 'reserve'}
              </span>
            </div>
            <div className="text-[10px] text-[var(--vv-text-subtle)] tabular-nums text-right">
              {isId ? 'Jatah coba per shot' : 'Tries per shot'}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--vv-border)]">
          <span className="text-[11px] text-[var(--vv-text-muted)] font-mono">
            = {calc.budgeted_generations} {isId ? 'kali buat' : 'total tries'}
          </span>
          <button
            type="button"
            onClick={onNavigateToSetup}
            className="text-xs font-medium text-[#0099ff] hover:underline inline-flex items-center justify-end gap-1"
          >
            <span>{isId ? 'Ubah di Langkah 2' : 'Edit in Step 2'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Supporting Card 2: Rata-rata Biaya Produksi AI */}
      <div
        className={`${cardClass} rounded-[16px] p-5 flex flex-col justify-between`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)]">
            {isId ? 'Rata-rata Biaya Produksi' : 'Average Production Cost'}
          </span>
          <Film className="w-4 h-4 text-[#ffb840]" />
        </div>

        <div className="my-4 grid grid-cols-2 gap-2.5 text-xs">
          <div className="vv-card-quiet p-3">
            <div className="text-[11px] text-[var(--vv-text-muted)] truncate">
              {calc.total_primary_shots > 0
                ? isId
                  ? 'Rata-rata per 1 Shot Utama'
                  : 'Per 1 Primary Shot'
                : isId
                ? 'Rata-rata per 1 Item'
                : 'Per 1 Item'}
            </div>
            <div className="text-sm font-bold tabular-nums text-right mt-1 truncate">
              {avgCostPerItemIdr !== null
                ? formatCurrencyIdr(avgCostPerItemIdr, language)
                : '-'}
            </div>
            <div className="text-[11px] text-[#ffb840] tabular-nums text-right truncate">
              {formatCurrencyUsd(avgCostPerItemUsd, language)}
            </div>
          </div>

          <div className="vv-card-quiet p-3">
            <div className="text-[11px] text-[var(--vv-text-muted)] truncate">
              {isId ? 'Rata-rata per 1x Buat' : 'Per 1 AI Try'}
            </div>
            <div className="text-sm font-bold tabular-nums text-right mt-1 truncate">
              {avgCostPerGenIdr !== null
                ? formatCurrencyIdr(avgCostPerGenIdr, language)
                : '-'}
            </div>
            <div className="text-[11px] text-[#0099ff] tabular-nums text-right truncate">
              {formatCurrencyUsd(avgCostPerGenUsd, language)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--vv-border)]">
          <span className="text-[11px] text-[var(--vv-text-muted)]">
            {isId ? 'Sudah termasuk cadangan' : 'Includes retry reserve'}
          </span>
          <button
            type="button"
            onClick={onNavigateToPlanner}
            className="text-[#0099ff] font-medium hover:underline inline-flex items-center gap-1 text-xs"
          >
            <span>{isId ? 'Atur di Langkah 3' : 'Edit in Step 3'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Supporting Card 3: Poin Credit & Kurs Rupiah Aktif */}
      <div
        className={`${cardClass} rounded-[16px] p-5 flex flex-col justify-between`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)]">
            {isId ? 'Credit AI & Nilai Kurs' : 'AI Credits & FX Rate'}
          </span>
          <Coins className="w-4 h-4 text-[#7acaff]" />
        </div>

        <div className="my-4 grid grid-cols-2 gap-2.5 text-xs">
          <div className="vv-card-quiet p-3">
            <div className="text-[11px] text-[var(--vv-text-muted)]">
              {t.totalCredit}
            </div>
            <div className="text-sm font-bold tabular-nums text-[#7acaff] text-right mt-1">
              {calc.total_credit !== null
                ? `${calc.total_credit.toLocaleString()} cr`
                : t.unavailableLabel}
            </div>
            <div className="text-[10px] text-[var(--vv-text-subtle)] text-right mt-0.5">
              {calc.total_elevenlabs_credit !== null || calc.total_suno_credit !== null
                ? 'Higgsfield, 11Labs, Suno'
                : 'Higgsfield Points'}
            </div>
          </div>

          <div className="vv-card-quiet p-3">
            <div className="text-[11px] text-[var(--vv-text-muted)]">
              1 USD = IDR
            </div>
            <div className="text-sm font-bold tabular-nums text-right mt-1">
              {project.exchange_rate.rate
                ? formatCurrencyIdr(project.exchange_rate.rate, language)
                : t.unavailableLabel}
            </div>
            <div className="text-[10px] vv-text-emerald font-medium text-right mt-0.5 truncate">
              {project.exchange_rate.source_name}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 text-xs">
          <button
            type="button"
            onClick={onRefreshFx}
            disabled={isRefreshingFx}
            className="inline-flex items-center gap-1 text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)] transition"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshingFx ? 'animate-spin' : ''}`}
            />
            <span>{isId ? 'Segarkan Kurs' : 'Refresh FX'}</span>
          </button>
          <button
            type="button"
            onClick={onNavigateToSettings}
            className="text-[#0099ff] font-medium hover:underline"
          >
            {isId ? 'Atur Kurs & Katalog →' : 'FX & Catalog →'}
          </button>
        </div>
      </div>
    </div>
  );
};
