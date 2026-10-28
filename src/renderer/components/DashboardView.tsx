import React, { useRef, useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import {
  CATEGORY_LABELS,
  formatCurrencyIdr,
  formatCurrencyUsd,
  SHORT_CATEGORY_LABELS,
  UI_TEXT,
} from '../i18n/translations';
import { StatusBadge } from './StatusBadge';
import { FrostedModal } from './FrostedModal';
import { StepFlowBar } from './StepFlowBar';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Coins,
  Eye,
  FilePlus2,
  Film,
  FlaskConical,
  FolderOpen,
  Layers,
  RefreshCw,
  Save,
  ShieldCheck,
  Sliders,
  Sparkles,
} from 'lucide-react';
import {
  ALL_PROCESS_CATEGORIES,
  ProcessCategory,
} from '../../shared/types/project';

const ALL_CATEGORIES: ProcessCategory[] = ALL_PROCESS_CATEGORIES;

export const DashboardView: React.FC = () => {
  const {
    project,
    language,
    theme,
    hasUnsavedChanges,
    currentFilePath,
    recentProjects,
    isRefreshingFx,
    setActiveTab,
    createNewBlankProject,
    loadPrdSyntheticTest,
    loadCommercialSample,
    saveProjectFile,
    openProjectFile,
    importProjectFromJsonText,
    refreshExchangeRateAuto,
  } = useProjectStore();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const t = UI_TEXT[language];
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';
  const heroCardClass =
    theme === 'dark' ? 'vv-card-hero-dark' : 'vv-card-hero-light';
  const calc = project.calculation;
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

  const hasExplicitReserveCost = (calc.reserve_cost_usd || 0) > 0;
  const baseSharePercent =
    calc.total_cost_usd > 0
      ? Math.round((calc.base_cost_usd / calc.total_cost_usd) * 100)
      : 100;
  const reserveSharePercent = Math.max(0, 100 - baseSharePercent);

  const handleBrowserFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        importProjectFromJsonText(reader.result, file.name);
        setIsProjectModalOpen(false);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Hidden input fallback for browser file open */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".aivbudget,.json"
        className="hidden"
        onChange={handleBrowserFileUpload}
      />

      {/* =====================================================================
       * TIER 1: DOMINANT FOCAL POINT — ASYMMETRIC HERO SPLIT (7 cols + 5 cols)
       * Left: Project Context & Primary Actions
       * Right: Single Unmistakable Total Budget Anchor Card (.vv-card-hero-*)
       * ===================================================================== */}
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

          {/* Focused 3-Button Bar (No Clutter) */}
          <div className="mt-6 pt-4 border-t border-[var(--vv-border)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('planner')}
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
                onClick={() => setIsProjectModalOpen(true)}
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
              onClick={() => saveProjectFile(false)}
              className="vv-btn-primary px-4 py-2.5 text-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.btnSaveProject}</span>
            </button>
          </div>
        </div>

        {/* Right 5 Columns: THE DOMINANT FOCAL POINT (Total Seluruh Anggaran) */}
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
              <div className="flex items-center gap-1.5 text-[var(--vv-text-muted)] text-[11px]">
                <Coins className="w-3.5 h-3.5 text-[#0099ff] shrink-0" />
                <span>
                  {calc.total_credit !== null
                    ? `${calc.total_credit.toLocaleString()} Credit Higgsfield`
                    : (isId ? 'Credit belum dihitung' : 'Credits unconfigured')}
                </span>
              </div>
              <div className="text-[11px] font-mono text-[var(--vv-text-subtle)]">
                {fx.rate ? `~${formatCurrencyIdr(fx.rate, language)}/USD` : ''}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================================
       * TIER 2: SECONDARY SCANNING ZONE — 3 BALANCED SUPPORTING CARDS
       * ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Supporting Card 1: Rumus Kali Pembuatan AI (Model Perhitungan Terbaru) */}
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
                {isId ? `${calc.one_video_primary_shot_count} shot utama di Langkah 3` : `${calc.one_video_primary_shot_count} primary shots in Step 3`}
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
              onClick={() => setActiveTab('setup')}
              className="text-xs font-medium text-[#0099ff] hover:underline inline-flex items-center justify-end gap-1"
            >
              <span>{isId ? 'Ubah di Langkah 2' : 'Edit in Step 2'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Supporting Card 2: Rata-rata Biaya Produksi AI (Per Shot & Per 1x Buat) */}
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
              onClick={() => setActiveTab('planner')}
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
                Higgsfield Points
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
              onClick={refreshExchangeRateAuto}
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
              onClick={() => setActiveTab('settings')}
              className="text-[#0099ff] font-medium hover:underline"
            >
              {isId ? 'Atur Kurs & Katalog →' : 'FX & Catalog →'}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
       * TIER 3: COMPACT CATEGORY CHIPS & FROSTED GLASS DETAIL TRIGGERS
       * Avoids cramming full tables & warning lists onto the main screen
       * ===================================================================== */}
      <div className={`${cardClass} rounded-[16px] p-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--vv-border)]">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)]">
              {isId
                ? 'Distribusi Biaya per Jenis Pembuatan AI'
                : 'Cost Distribution by AI Creation Type'}
            </h2>
            <p className="text-xs text-[var(--vv-text-subtle)] mt-0.5">
              {isId
                ? 'Ringkasan cepat 7 kategori AI. Klik tombol di kanan untuk melihat rincian tabel penuh dalam jendela popup.'
                : 'Quick summary of the 7 AI categories. Click the buttons on the right to inspect full details in a popup window.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="vv-btn-secondary px-3.5 py-2 text-xs"
            >
              <Eye className="w-3.5 h-3.5 text-[#0099ff]" />
              <span>
                {isId ? 'Tabel Rincian Kategori' : 'Category Breakdown Table'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsStatusModalOpen(true)}
              className="vv-btn-secondary px-3.5 py-2 text-xs"
            >
              {calc.warnings.length === 0 ? (
                <ShieldCheck className="w-3.5 h-3.5 vv-text-emerald" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-[#ffb840]" />
              )}
              <span>
                {isId
                  ? `Status Data (${calc.warnings.length === 0 ? 'Aman' : `${calc.warnings.length} Catatan`})`
                  : `Data Status (${calc.warnings.length === 0 ? 'Ready' : `${calc.warnings.length} Notes`})`}
              </span>
            </button>
          </div>
        </div>

        {/* Clean 7-Category Horizontal Bento Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
          {ALL_CATEGORIES.map((cat) => {
            const sum = calc.category_summaries[cat];
            const isActiveCat = sum.item_count > 0;
            return (
              <div
                key={cat}
                className={`p-3.5 rounded-[12px] border transition ${
                  isActiveCat
                    ? 'bg-[var(--vv-tint-weak)] border-[var(--vv-border-strong)]'
                    : 'bg-transparent border-[var(--vv-border)] opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-1 text-[11px] font-semibold truncate">
                  <span className="truncate">
                    {SHORT_CATEGORY_LABELS[cat][language]}
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--vv-tint)] text-[var(--vv-text-muted)]">
                    {sum.item_count}
                  </span>
                </div>
                <div className="mt-2.5 text-right">
                  <div className="text-sm font-bold tabular-nums text-[#0099ff]">
                    {formatCurrencyIdr(sum.total_cost_idr, language)}
                  </div>
                  <div className="text-[11px] text-[var(--vv-text-muted)] tabular-nums">
                    {formatCurrencyUsd(sum.total_cost_usd, language)} &bull;{' '}
                    {sum.budgeted_generations}x
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guided Step Flow Footer */}
      <StepFlowBar
        currentStepNumber={1}
        stepTitle={t.navDashboard}
        nextStepHint={
          isId
            ? 'Langkah selanjutnya: Tentukan nama proyek dan angka cadangan percobaan per shot / gambar.'
            : 'Next step: Configure your project name and define your shot/image retry reserve factor.'
        }
        nextTab="setup"
        nextLabel={
          isId
            ? 'Lanjut ke Langkah 2: Pengaturan Proyek'
            : 'Continue to Step 2: Project Setup'
        }
      />

      {/* =====================================================================
       * FROSTED GLASS MODAL 1: Buka / Ganti Proyek & Contoh Simulasi
       * ===================================================================== */}
      <FrostedModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        theme={theme}
        maxWidth="2xl"
        badgeLabel={isId ? 'Manajemen File Proyek' : 'Project File Manager'}
        title={
          isId ? (
            <>
              Buat Baru, Buka File, atau{' '}
              <span className="vv-accent text-[#0099ff]">Muat Contoh Proyek</span>
            </>
          ) : (
            <>
              Create New, Open File, or{' '}
              <span className="vv-accent text-[#0099ff]">Load Sample Project</span>
            </>
          )
        }
        subtitle={
          isId
            ? 'Pilih cara memulai perhitungan anggaran Anda. Anda juga dapat langsung mencoba proyek contoh yang sudah terisi lengkap.'
            : 'Choose how to start your budget calculation, or load a pre-filled sample project with one click.'
        }
      >
        <div className="space-y-5 text-xs">
          {/* Row 1: New & Open from Computer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => {
                createNewBlankProject();
                setIsProjectModalOpen(false);
              }}
              className="vv-card-quiet p-4 text-left hover:border-[#0099ff] transition flex items-start gap-3"
            >
              <FilePlus2 className="w-5 h-5 text-[#0099ff] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm text-[var(--vv-text-primary)]">
                  {t.btnNewProject}
                </div>
                <p className="text-[var(--vv-text-muted)] mt-1 leading-relaxed">
                  {isId
                    ? 'Mulai proyek kosong baru dari awal dengan 1 shot pembuka.'
                    : 'Start a fresh blank project with 1 opening shot.'}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.api) {
                  openProjectFile();
                  setIsProjectModalOpen(false);
                } else {
                  fileInputRef.current?.click();
                }
              }}
              className="vv-card-quiet p-4 text-left hover:border-[#ffb840] transition flex items-start gap-3"
            >
              <FolderOpen className="w-5 h-5 text-[#ffb840] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm text-[var(--vv-text-primary)]">
                  {t.btnOpenProject}
                </div>
                <p className="text-[var(--vv-text-muted)] mt-1 leading-relaxed">
                  {isId
                    ? 'Buka file proyek (.aivbudget) yang pernah Anda simpan di komputer.'
                    : 'Open a previously saved project file (.aivbudget) from your computer.'}
                </p>
              </div>
            </button>
          </div>

          {/* Row 2: One-Click Pre-built Samples */}
          <div className="vv-card-quiet p-4 space-y-3">
            <div className="font-semibold uppercase tracking-wider text-[11px] text-[var(--vv-text-muted)]">
              {isId
                ? 'Contoh Proyek Siap Pakai (Tanpa Perlu Mengetik dari Awal)'
                : 'Ready-to-Use Sample Projects (No Typing Needed)'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  loadCommercialSample();
                  setIsProjectModalOpen(false);
                }}
                className="vv-btn-secondary py-2.5 px-3.5 text-xs justify-start"
              >
                <Sparkles className="w-4 h-4 text-[#0099ff] shrink-0" />
                <span className="truncate">{t.btnLoadCommercialDemo}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  loadPrdSyntheticTest();
                  setIsProjectModalOpen(false);
                }}
                className="vv-btn-secondary py-2.5 px-3.5 text-xs justify-start"
              >
                <FlaskConical className="w-4 h-4 vv-text-emerald shrink-0" />
                <span className="truncate">{t.btnLoadPrdTest}</span>
              </button>
            </div>
          </div>

          {/* Row 3: Recent Saved Projects */}
          <div className="space-y-2">
            <div className="font-semibold uppercase tracking-wider text-[11px] text-[var(--vv-text-muted)]">
              {isId
                ? 'Proyek yang Terakhir Disimpan di Komputer Ini'
                : 'Recently Saved Projects on This Computer'}
            </div>
            {recentProjects.length === 0 ? (
              <div className="p-4 text-center border border-dashed border-[var(--vv-border-strong)] rounded-[12px] text-[var(--vv-text-muted)]">
                {isId
                  ? 'Belum ada riwayat proyek yang disimpan. Lokasi saat ini: '
                  : 'No saved project history yet. Current file: '}
                <span className="font-mono">
                  {currentFilePath || (isId ? 'Belum disimpan' : 'Unsaved')}
                </span>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {recentProjects.map((rec) => (
                  <button
                    key={rec.file_path}
                    type="button"
                    onClick={() => {
                      openProjectFile(rec.file_path);
                      setIsProjectModalOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-[10px] bg-[var(--vv-tint-weak)] hover:bg-[var(--vv-tint)] border border-[var(--vv-border)] transition flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">
                        {rec.project_name}
                      </div>
                      <div className="text-[11px] text-[var(--vv-text-muted)] truncate">
                        {rec.file_path}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold tabular-nums text-[#0099ff]">
                        {formatCurrencyUsd(rec.total_cost_usd, language)}
                      </div>
                      <div className="text-[10px] text-[var(--vv-text-subtle)]">
                        {rec.updated_at.slice(0, 10)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </FrostedModal>

      {/* =====================================================================
       * FROSTED GLASS MODAL 2: Tabel Lengkap Rincian 5 Kategori AI
       * ===================================================================== */}
      <FrostedModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        theme={theme}
        maxWidth="2xl"
        badgeLabel={isId ? 'Rincian Kategori AI' : 'Category Breakdown'}
        title={
          isId ? (
            <>
              Tabel Biaya per{' '}
              <span className="vv-accent text-[#0099ff]">Jenis Pembuatan AI</span>
            </>
          ) : (
            <>
              Cost Table by{' '}
              <span className="vv-accent text-[#0099ff]">AI Creation Type</span>
            </>
          )
        }
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="vv-btn-secondary px-4 py-2 text-xs"
            >
              {isId ? 'Tutup' : 'Close'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCategoryModalOpen(false);
                setActiveTab('planner');
              }}
              className="vv-btn-accent px-4 py-2 text-xs"
            >
              <span>
                {isId ? 'Atur Daftar Pekerjaan AI' : 'Edit Production List'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--vv-border)] text-[var(--vv-text-muted)]">
                <th className="py-2.5 text-left font-medium">
                  {isId ? 'Jenis Pembuatan AI' : 'AI Creation Type'}
                </th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Jumlah Tahap' : 'Stages'}
                </th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Total Kali Buat' : 'Total Tries'}
                </th>
                <th className="py-2.5 text-right font-medium">Subtotal (USD)</th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Subtotal (Rupiah)' : 'Subtotal (IDR)'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--vv-border)]">
              {ALL_CATEGORIES.map((cat) => {
                const sum = calc.category_summaries[cat];
                return (
                  <tr
                    key={cat}
                    className="hover:bg-[var(--vv-tint-weak)] transition-colors"
                  >
                    <td className="py-3 font-medium">
                      {CATEGORY_LABELS[cat][language]}
                      {sum.has_incomplete_items && (
                        <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                          {isId ? 'Belum Diisi' : 'Incomplete'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right tabular-nums text-[var(--vv-text-muted)]">
                      {sum.item_count}
                    </td>
                    <td className="py-3 text-right tabular-nums text-[var(--vv-text-muted)]">
                      {sum.budgeted_generations}
                    </td>
                    <td className="py-3 text-right font-semibold tabular-nums">
                      {formatCurrencyUsd(sum.total_cost_usd, language)}
                    </td>
                    <td className="py-3 text-right text-[#0099ff] font-semibold tabular-nums">
                      {formatCurrencyIdr(sum.total_cost_idr, language)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </FrostedModal>

      {/* =====================================================================
       * FROSTED GLASS MODAL 3: Status Kelengkapan Data & Info Penting
       * ===================================================================== */}
      <FrostedModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        theme={theme}
        maxWidth="lg"
        badgeLabel={isId ? 'Pemeriksaan Data' : 'Data Health Check'}
        title={
          isId ? (
            <>
              Status Kelengkapan Data &{' '}
              <span className="vv-accent text-[#0099ff]">Catatan Penting</span>
            </>
          ) : (
            <>
              Data Completeness &{' '}
              <span className="vv-accent text-[#0099ff]">Important Notes</span>
            </>
          )
        }
      >
        <div className="space-y-4 text-xs">
          <div className="vv-card-quiet p-4 flex items-center justify-between">
            <span className="text-[var(--vv-text-muted)]">
              {isId ? 'Status Kurs Dolar ke Rupiah:' : 'USD to IDR Rate Status:'}
            </span>
            <StatusBadge
              status={project.exchange_rate.status}
              language={language}
            />
          </div>

          {calc.warnings.length === 0 ? (
            <div className="flex items-center gap-2.5 text-xs vv-badge-emerald rounded-[12px] p-4">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                {isId
                  ? 'Semua harga model AI dan kurs Rupiah sudah lengkap dan siap digunakan untuk laporan PDF.'
                  : 'All AI model prices and exchange rates are complete and ready for PDF export.'}
              </span>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {calc.warnings.map((w, i) => (
                <li
                  key={`${w.code}_${i}`}
                  className={`p-3.5 rounded-[12px] border flex items-start gap-2.5 ${
                    w.severity === 'error'
                      ? 'bg-rose-500/10 border-rose-500/35 text-rose-700 dark:text-rose-300'
                      : w.severity === 'warning'
                      ? 'vv-badge-amber'
                      : 'bg-[#0099ff]/10 border-[#0099ff]/35 text-[#0066cc] dark:text-[#7acaff]'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{isId ? w.message_id : w.message_en}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </FrostedModal>
    </div>
  );
};
