import React from 'react';
import { ProductionItem, ProjectCalculation, ProjectFile } from '../../../shared/types/project';
import {
  formatCurrencyIdr,
  formatCurrencyUsd,
  UI_TEXT,
} from '../../i18n/translations';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Coins,
  FileDown,
} from 'lucide-react';

interface ExecutiveBudgetHeroCardProps {
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  project: ProjectFile;
  calculation: ProjectCalculation;
  onNavigateToPdf: () => void;
}

export const ExecutiveBudgetHeroCard: React.FC<ExecutiveBudgetHeroCardProps> = ({
  language,
  theme,
  project,
  calculation: calc,
  onNavigateToPdf,
}) => {
  const isId = language === 'id';
  const t = UI_TEXT[language];
  const heroCardClass =
    theme === 'dark' ? 'vv-card-hero-dark' : 'vv-card-hero-light';

  const cadanganMultiplier =
    project.assumptions.default_attempts_per_shot ||
    project.assumptions.reserve_generations_override ||
    1;

  const totalSceneQuantity = project.items.reduce(
    (sum: number, item: ProductionItem) => sum + Math.max(0, Math.floor(item.quantity)),
    0
  );

  const hasExplicitReserveCost = (calc.reserve_cost_usd || 0) > 0;
  const baseSharePercent =
    calc.total_cost_usd > 0
      ? Math.round((calc.base_cost_usd / calc.total_cost_usd) * 100)
      : 100;
  const reserveSharePercent = Math.max(0, 100 - baseSharePercent);

  const targetVideosCount = Math.max(
    1,
    calc.target_videos || project.assumptions.target_videos || 1
  );

  return (
    <div className={`${heroCardClass} rounded-[18px] p-6 md:p-7`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left 7 Cols: Title, Status, and Executive Summary Boxes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="vv-badge-pill">
              <BarChart3 className="w-3.5 h-3.5 text-[#0099ff]" />
              <span>
                {isId
                  ? 'Langkah 04 • Rekapitulasi Anggaran'
                  : 'Step 04 • Executive Budget Summary'}
              </span>
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold border ${
                calc.is_complete
                  ? 'vv-badge-emerald'
                  : 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/25'
              }`}
            >
              {calc.is_complete ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5" />
              )}
              {calc.is_complete ? t.completeEstimate : t.incompleteEstimate}
            </span>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-medium tracking-[-0.035em]">
              {isId ? (
                <>
                  Ringkasan Lengkap{' '}
                  <span className="vv-accent text-[#0099ff]">
                    Biaya Produksi
                  </span>
                </>
              ) : (
                <>
                  Complete Production{' '}
                  <span className="vv-accent text-[#0099ff]">
                    Cost Summary
                  </span>
                </>
              )}
            </h1>
            <p className="text-xs text-[var(--vv-text-muted)] mt-1">
              {isId
                ? 'Seluruh angka di halaman ini dihitung otomatis dari susunan shot / gambar di Langkah 3 dan cadangan di Langkah 2.'
                : 'All figures on this page are calculated automatically from shots/images in Step 3 and reserve in Step 2.'}
            </p>
          </div>

          {/* Clean 2-Box Split */}
          {hasExplicitReserveCost ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="vv-card-quiet p-3.5">
                <div className="flex items-center justify-between text-[11px] text-[var(--vv-text-muted)]">
                  <span>{t.baseCost}</span>
                  <span className="font-mono">{calc.planned_generations}x</span>
                </div>
                <div className="text-base font-bold tabular-nums text-right mt-1">
                  {formatCurrencyIdr(calc.base_cost_idr, language)}
                </div>
                <div className="text-xs text-[#0099ff] tabular-nums text-right">
                  {formatCurrencyUsd(calc.base_cost_usd, language)}
                </div>
              </div>

              <div className="vv-card-quiet p-3.5">
                <div className="flex items-center justify-between text-[11px] text-[#ffb840]">
                  <span>
                    {t.reserveCost} ({calc.effective_reserve_percent}%)
                  </span>
                  <span className="font-mono">+{calc.reserve_generations}x</span>
                </div>
                <div className="text-base font-bold tabular-nums text-[#ffb840] text-right mt-1">
                  {formatCurrencyIdr(calc.reserve_cost_idr, language)}
                </div>
                <div className="text-xs text-[var(--vv-text-muted)] tabular-nums text-right">
                  {formatCurrencyUsd(calc.reserve_cost_usd, language)}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="vv-card-quiet p-3.5">
                <div className="flex items-center justify-between text-[11px] text-[var(--vv-text-muted)]">
                  <span>{isId ? 'Kebutuhan Shot / Gambar' : 'Base Shot Requirements'}</span>
                  <span className="font-mono text-[#0099ff]">
                    {calc.one_video_primary_shot_count} {isId ? 'Shot Utama' : 'Shots'}
                  </span>
                </div>
                <div className="text-xl font-bold tabular-nums text-[var(--vv-text-primary)] text-right mt-1">
                  {totalSceneQuantity}{' '}
                  <span className="text-xs font-normal text-[var(--vv-text-muted)]">
                    {isId ? 'total item' : 'total items'}
                  </span>
                </div>
                <div className="text-[11px] text-[var(--vv-text-muted)] text-right mt-0.5">
                  {isId
                    ? `${calc.one_video_primary_shot_count} Shot Utama + ${calc.one_video_supporting_asset_count} Aset Pendukung`
                    : `${calc.one_video_primary_shot_count} Primary + ${calc.one_video_supporting_asset_count} Supporting`}
                </div>
              </div>

              <div className="vv-card-quiet p-3.5">
                <div className="flex items-center justify-between text-[11px] text-[var(--vv-text-muted)]">
                  <span>{isId ? 'Cadangan Langkah 2' : 'Step 2 Reserve'}</span>
                  <span className="font-mono text-[#0099ff]">{cadanganMultiplier}x</span>
                </div>
                <div className="text-xl font-bold tabular-nums text-[#0099ff] text-right mt-1">
                  {cadanganMultiplier}{' '}
                  <span className="text-xs font-normal text-[var(--vv-text-muted)]">
                    {isId ? 'cadangan' : 'reserve'}
                  </span>
                </div>
                <div className="text-[11px] text-[var(--vv-text-muted)] text-right mt-0.5">
                  {isId ? 'Jatah coba per shot/gambar' : 'Retry attempts per shot/image'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Dominant Grand Total Box + Primary Export CTA */}
        <div className="lg:col-span-5 p-5 rounded-[16px] bg-[var(--vv-tint-weak)] border border-[#0099ff]/35 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0099ff] flex items-center gap-2">
              <span className="vv-blue-dot" />
              {t.totalBudget}
            </span>
            <span className="text-xs font-mono tabular-nums text-[var(--vv-text-muted)]">
              {calc.budgeted_generations} {isId ? 'kali buat' : 'tries'}
            </span>
          </div>

          <div className="text-right">
            <div className="text-3xl md:text-4xl font-bold tabular-nums tracking-tight text-[var(--vv-text-primary)]">
              {formatCurrencyIdr(calc.total_cost_idr, language)}
            </div>
            {calc.target_videos > 1 && (
              <div className="text-xs text-emerald-400 font-semibold mt-1">
                {isId
                  ? `Total Anggaran untuk ${calc.target_videos} Video (Proyeksi 1 Video: ${formatCurrencyIdr(calc.one_video_total_cost_idr, language)})`
                  : `Total Budget for ${calc.target_videos} Videos (1 Video Plan: ${formatCurrencyUsd(calc.one_video_total_cost_usd, language)})`}
              </div>
            )}
            <div className="text-lg font-semibold tabular-nums text-[#0099ff] mt-1">
              {formatCurrencyUsd(calc.total_cost_usd, language)}
            </div>
            <div className="text-[11px] text-[var(--vv-text-muted)] mt-1.5">
              {totalSceneQuantity} {isId ? 'item' : 'items'} &times; {cadanganMultiplier} {isId ? 'cadangan' : 'reserve'}
              {targetVideosCount > 1
                ? ` × ${targetVideosCount} ${isId ? 'video' : 'videos'}`
                : ''}{' '}
              ={' '}
              <strong className="text-[var(--vv-text-strong)]">
                {calc.budgeted_generations} {isId ? 'kali buat' : 'tries'}
              </strong>
            </div>
          </div>

          {hasExplicitReserveCost ? (
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-[var(--vv-tint)] overflow-hidden flex">
                <div
                  style={{ width: `${baseSharePercent}%` }}
                  className="bg-[#0099ff]"
                />
                <div
                  style={{ width: `${reserveSharePercent}%` }}
                  className="bg-[#ffb840]"
                />
              </div>
              <div className="flex justify-between text-[10px] text-[var(--vv-text-muted)]">
                <span>
                  {baseSharePercent}% {isId ? 'Biaya Utama' : 'Base Cost'}
                </span>
                <span className="text-[#ffb840]">
                  {reserveSharePercent}% {isId ? 'Dana Cadangan' : 'Reserve'}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-[12px] bg-[var(--vv-field)] border border-[var(--vv-border)] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[var(--vv-text-muted)]">
                <Coins className="w-4 h-4 text-[#0099ff]" />
                <span>{isId ? 'Total Credit Platform' : 'Total Credits'}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-[var(--vv-text-primary)] font-mono block">
                  {calc.total_credit !== null
                    ? `${calc.total_credit.toLocaleString()} Cr (Higgsfield)`
                    : '-'}
                </span>
                {calc.total_elevenlabs_credit !== null && (
                  <span className="text-[11px] font-bold font-mono text-sky-400 block mt-0.5">
                    {calc.total_elevenlabs_credit.toLocaleString()} Cr (ElevenLabs)
                  </span>
                )}
                {calc.total_suno_credit !== null && (
                  <span className="text-[11px] font-bold font-mono text-purple-400 block mt-0.5">
                    {calc.total_suno_credit.toLocaleString()} Cr (Suno)
                  </span>
                )}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onNavigateToPdf}
            className="vv-btn-accent w-full py-2.5 px-4 text-xs font-semibold"
          >
            <FileDown className="w-4 h-4" />
            <span>
              {isId
                ? 'Lanjut ke Langkah 5: Cetak Dokumen PDF'
                : 'Continue to Step 5: Save PDF Report'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
