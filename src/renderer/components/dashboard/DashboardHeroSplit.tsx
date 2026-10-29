import React from 'react';
import { ProjectCalculation, ProjectFile } from '../../../shared/types/project';
import {
  formatCurrencyIdr,
  formatCurrencyUsd,
  UI_TEXT,
} from '../../i18n/translations';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Coins,
  FolderOpen,
  Layers,
  Save,
} from 'lucide-react';

interface DashboardHeroSplitProps {
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  project: ProjectFile;
  calculation: ProjectCalculation;
  hasUnsavedChanges: boolean;
  onOpenPlanner: () => void;
  onOpenProjectModal: () => void;
  onSaveProject: () => void;
}

export const DashboardHeroSplit: React.FC<DashboardHeroSplitProps> = ({
  language,
  theme,
  project,
  calculation: calc,
  hasUnsavedChanges,
  onOpenPlanner,
  onOpenProjectModal,
  onSaveProject,
}) => {
  const isId = language === 'id';
  const t = UI_TEXT[language];
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';
  const heroCardClass =
    theme === 'dark' ? 'vv-card-hero-dark' : 'vv-card-hero-light';
  const fx = project.exchange_rate;

  const totalSceneQuantity = project.items.reduce(
    (sum, item) => sum + Math.max(0, Math.floor(item.quantity)),
    0
  );

  const cadanganMultiplier =
    project.assumptions.default_attempts_per_shot ||
    project.assumptions.reserve_generations_override ||
    1;

  const targetVideosCount = Math.max(1, calc.target_videos || 1);

  const hasExplicitReserveCost = (calc.reserve_cost_usd || 0) > 0;
  const baseSharePercent =
    calc.total_cost_usd > 0
      ? Math.round((calc.base_cost_usd / calc.total_cost_usd) * 100)
      : 100;
  const reserveSharePercent = Math.max(0, 100 - baseSharePercent);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* Left 7 Columns: Project Identity & Clean Action Bar */}
      <div
        className={`${cardClass} lg:col-span-7 rounded-[18px] p-6 md:p-7 flex flex-col justify-between`}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="vv-badge-pill">
              <span className="vv-blue-dot" />
              <span>
                {isId
                  ? 'Langkah 01 • Ringkasan Proyek'
                  : 'Step 01 • Project Overview'}
              </span>
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                hasUnsavedChanges
                  ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/25'
                  : 'vv-badge-emerald'
              }`}
            >
              {hasUnsavedChanges ? t.unsavedBadge : t.savedBadge}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-medium tracking-[-0.04em] leading-tight">
            {project.project_name ? (
              <>
                <span>
                  {project.project_name.split(' ').slice(0, -1).join(' ') ||
                    project.project_name}{' '}
                </span>
                {project.project_name.split(' ').length > 1 && (
                  <span className="vv-accent text-[#0099ff]">
                    {project.project_name.split(' ').slice(-1)[0]}
                  </span>
                )}
              </>
            ) : isId ? (
              <>
                Proyek <span className="vv-accent text-[#0099ff]">Tanpa Nama</span>
              </>
            ) : (
              <>
                Untitled <span className="vv-accent text-[#0099ff]">Project</span>
              </>
            )}
          </h1>

          <p className="text-xs text-[var(--vv-text-muted)] mt-2 leading-relaxed max-w-xl">
            {isId
              ? `Merencanakan ${project.items.length} tahap pembuatan AI (${calc.one_video_primary_shot_count} shot utama) • Dikalikan ${cadanganMultiplier} cadangan Langkah 2 = ${calc.budgeted_generations} kali pembuatan AI.`
              : `Planning ${project.items.length} AI stages (${calc.one_video_primary_shot_count} primary shots) • Multiplied by ${cadanganMultiplier} Step 2 reserve = ${calc.budgeted_generations} total AI generations.`}
          </p>
        </div>

        {/* Focused 3-Button Bar */}
        <div className="mt-6 pt-4 border-t border-[var(--vv-border)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenPlanner}
              className="vv-btn-accent px-4 py-2.5 text-xs font-semibold"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>
                {isId ? 'Susun Daftar Shot AI' : 'Edit AI Shot List'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onOpenProjectModal}
              className="vv-btn-secondary px-4 py-2.5 text-xs"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#ffb840]" />
              <span>
                {isId ? 'Ganti / Contoh Proyek' : 'Switch / Sample Projects'}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={onSaveProject}
            className="vv-btn-primary px-4 py-2.5 text-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{t.btnSaveProject}</span>
          </button>
        </div>
      </div>

      {/* Right 5 Columns: Dominant Focal Point (Total Seluruh Anggaran) */}
      <div
        className={`${heroCardClass} lg:col-span-5 rounded-[18px] p-6 md:p-7 flex flex-col justify-between`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="vv-blue-dot" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0099ff]">
              {t.totalBudget}
            </span>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              calc.is_complete
                ? 'vv-badge-emerald'
                : 'bg-amber-500/15 text-amber-500 dark:text-amber-300 border-amber-500/30'
            }`}
          >
            {calc.is_complete ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            <span>
              {calc.is_complete ? t.completeEstimate : t.incompleteEstimate}
            </span>
          </span>
        </div>

        {/* Dominant Focal Typography */}
        <div className="my-5 text-right">
          <div className="text-3xl md:text-4xl font-bold tabular-nums tracking-tight text-[var(--vv-text-primary)]">
            {formatCurrencyIdr(calc.total_cost_idr, language)}
          </div>
          <div className="text-lg font-semibold tabular-nums text-[#0099ff] mt-1">
            {formatCurrencyUsd(calc.total_cost_usd, language)}
          </div>
          <div className="text-xs text-[var(--vv-text-muted)] mt-1.5 font-mono flex flex-wrap items-center justify-end gap-1.5">
            <span>
              {totalSceneQuantity} {isId ? 'item' : 'items'}
            </span>
            <span>&times;</span>
            <span>
              {cadanganMultiplier} {isId ? 'cadangan' : 'reserve'}
            </span>
            {targetVideosCount > 1 && (
              <>
                <span>&times;</span>
                <span>
                  {targetVideosCount} {isId ? 'video' : 'videos'}
                </span>
              </>
            )}
            <span>=</span>
            <strong className="text-[var(--vv-text-strong)]">
              {calc.budgeted_generations} {isId ? 'kali buat' : 'tries'}
            </strong>
          </div>
        </div>

        {/* Visual Proportion Bar / Credit Readout */}
        {hasExplicitReserveCost ? (
          <div className="space-y-2 pt-3 border-t border-[var(--vv-border)]">
            <div className="h-2 w-full rounded-full bg-[var(--vv-tint)] overflow-hidden flex">
              <div
                style={{ width: `${baseSharePercent}%` }}
                className="bg-[#0099ff] transition-all duration-300"
                title={t.baseCost}
              />
              <div
                style={{ width: `${reserveSharePercent}%` }}
                className="bg-[#ffb840] transition-all duration-300"
                title={t.reserveCost}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] tabular-nums">
              <span className="text-[var(--vv-text-strong)] flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#0099ff]" />
                {t.baseCost}:{' '}
                <strong>{formatCurrencyUsd(calc.base_cost_usd, language)}</strong>
              </span>
              <span className="text-[#ffb840] flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#ffb840]" />
                {isId ? 'Cadangan' : 'Reserve'} ({calc.effective_reserve_percent}%):{' '}
                <strong>+{formatCurrencyUsd(calc.reserve_cost_usd, language)}</strong>
              </span>
            </div>
          </div>
        ) : (
          <div className="pt-3 border-t border-[var(--vv-border)] flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[var(--vv-text-muted)] text-[11px] flex-wrap">
              <Coins className="w-3.5 h-3.5 text-[#0099ff] shrink-0" />
              <span className="flex flex-wrap items-center gap-1.5">
                {calc.total_credit !== null
                  ? `${calc.total_credit.toLocaleString()} Credit Higgsfield`
                  : isId
                  ? 'Credit belum dihitung'
                  : 'Credits unconfigured'}
                {calc.total_elevenlabs_credit !== null && (
                  <span className="text-sky-400 font-mono">
                    &bull; {calc.total_elevenlabs_credit.toLocaleString()} Cr ElevenLabs
                  </span>
                )}
                {calc.total_suno_credit !== null && (
                  <span className="text-purple-400 font-mono">
                    &bull; {calc.total_suno_credit.toLocaleString()} Cr Suno
                  </span>
                )}
              </span>
            </div>
            <div className="text-[11px] font-mono text-[var(--vv-text-subtle)] shrink-0">
              {fx.rate ? `~${formatCurrencyIdr(fx.rate, language)}/USD` : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
