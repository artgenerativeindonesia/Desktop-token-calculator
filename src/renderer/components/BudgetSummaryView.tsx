import React, { useState } from 'react';
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
import { ProcessCategory } from '../../shared/types/project';
import { isDefaultPrimaryShot } from '../../shared/engine/calculationEngine';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Coins,
  Eye,
  FileDown,
  Film,
  Layers,
  Mic,
  Music,
  Scissors,
  Sparkles,
} from 'lucide-react';
import {
  convertDurationToCharacters,
  getElevenLabsPlanById,
} from '../../shared/catalog/elevenlabsCatalog';
import { getSunoPlanById } from '../../shared/catalog/sunoCatalog';

const ALL_CATEGORIES: ProcessCategory[] = [
  'text_to_image',
  'image_to_image',
  'image_to_video',
  'video_to_video',
  'text_to_video',
  'upscale_image',
  'upscale_video',
  'voice_over',
  'music',
];

export const BudgetSummaryView: React.FC = () => {
  const { project, language, theme, setActiveTab } = useProjectStore();
  const [isFullAuditModalOpen, setIsFullAuditModalOpen] = useState(false);

  const t = UI_TEXT[language];
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';
  const heroCardClass =
    theme === 'dark' ? 'vv-card-hero-dark' : 'vv-card-hero-light';
  const calc = project.calculation;

  const cadanganMultiplier =
    project.assumptions.default_attempts_per_shot ||
    project.assumptions.reserve_generations_override ||
    1;

  const totalSceneQuantity = project.items.reduce(
    (sum, item) => sum + Math.max(0, Math.floor(item.quantity)),
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

  // Helper format menit & detik ringkas (contoh: 90s -> 1m 30s)
  const formatMinSec = (totalSeconds: number): string => {
    if (!totalSeconds || totalSeconds <= 0) return '0s';
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.round(totalSeconds % 60);
    if (mins === 0) return `${secs}s`;
    if (secs === 0) return `${mins}m`;
    return `${mins}m ${secs}s`;
  };

  // Komparasi Durasi Video: Target Rencana Video Jadi (Langkah 2) vs Durasi Mentah Shot AI (Langkah 3)
  const isVideoCategory = (cat: ProcessCategory): boolean =>
    cat === 'text_to_video' || cat === 'image_to_video' || cat === 'video_to_video';

  const primaryVideoItems = project.items.filter((item) => {
    if (item.category === 'upscale_video' || item.category === 'upscale_image') {
      return false;
    }
    const isPrimary =
      typeof item.is_primary_shot === 'boolean'
        ? item.is_primary_shot
        : isDefaultPrimaryShot(item.category);
    return isPrimary && isVideoCategory(item.category) && (item.duration_seconds || 0) > 0;
  });

  const rawPrimaryDurationSeconds = primaryVideoItems.reduce(
    (sum, item) =>
      sum + Math.max(0, item.quantity) * Math.max(0, item.duration_seconds || 0),
    0
  );

  const rawPrimaryItemCount = primaryVideoItems.reduce(
    (sum, item) => sum + Math.max(0, item.quantity),
    0
  );

  const rawPerVideoSec =
    typeof calc.one_video_duration_seconds === 'number'
      ? calc.one_video_duration_seconds
      : rawPrimaryDurationSeconds;

  const targetPerVideoSec =
    typeof calc.target_duration_seconds === 'number' &&
    calc.target_duration_seconds > 0
      ? calc.target_duration_seconds
      : Math.round((project.assumptions.final_duration_minutes || 0) * 60);

  const diffSec =
    typeof calc.editing_buffer_seconds === 'number'
      ? calc.editing_buffer_seconds
      : rawPerVideoSec - targetPerVideoSec;

  const isBufferSafe = diffSec >= 0;

  // Akumulasi seluruh video jika target_videos > 1
  const targetAccumulatedSec = targetPerVideoSec * targetVideosCount;
  const rawAccumulatedSec = rawPerVideoSec * targetVideosCount;
  const diffAccumulatedSec = diffSec * targetVideosCount;

  return (
    <div className="space-y-6">
      {/* =====================================================================
       * TIER 1: DOMINANT FOCAL POINT — EXECUTIVE BUDGET HERO CARD
       * ===================================================================== */}
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
                    <span className="font-mono text-[#0099ff]">{calc.one_video_primary_shot_count} {isId ? 'Shot Utama' : 'Shots'}</span>
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
              onClick={() => setActiveTab('pdf')}
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

      {/* =====================================================================
       * TIER 1.5: DURATION COMPARISON & EDITING BUFFER READINESS CARD
       * Komparasi Target Rencana Video Jadi (Langkah 2) vs Durasi Mentah Shot AI (Langkah 3)
       * ===================================================================== */}
      <div
        className={`${cardClass} rounded-[18px] p-6 space-y-5 border border-[#0099ff]/25`}
      >
        {/* Header Kartu: Label, Sub-penjelasan, dan Status Badge Selisih */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--vv-border)]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="vv-badge-pill">
                <Clock className="w-3.5 h-3.5 text-[#0099ff]" />
                <span>
                  {isId
                    ? 'Komparasi Durasi & Buffer Editing'
                    : 'Duration Comparison & Editing Buffer'}
                </span>
              </span>
              <span className="text-xs text-[var(--vv-text-muted)]">
                {isId
                  ? 'Kesiapan footage mentah AI untuk proses editing video'
                  : 'AI raw footage readiness for editorial post-production'}
              </span>
            </div>
          </div>

          {/* Status Selisih (Aman Hijau vs Kurang Amber) */}
          <div className="shrink-0">
            {targetPerVideoSec === 0 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {isId
                    ? 'Target durasi belum diatur di Langkah 2'
                    : 'Target duration not set in Step 2'}
                </span>
              </span>
            ) : isBufferSafe ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/35 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  {isId
                    ? `✅ Aman (+${diffSec}s buffer editing untuk editor video)`
                    : `✅ Safe (+${diffSec}s editing buffer for video editor)`}
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/35 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  {isId
                    ? `⚠️ Kurang (-${Math.abs(diffSec)}s dari target rencana)`
                    : `⚠️ Shortage (-${Math.abs(diffSec)}s from planned target)`}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Komparasi 2 Nilai Berdampingan: Target Rencana vs Durasi Mentah Shot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kolom 1: Target Rencana Video Jadi (dari Langkah 2) */}
          <div className="vv-card-quiet p-4 rounded-[14px] flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--vv-text-muted)] flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-[#0099ff]" />
                <span>
                  {isId ? 'Target Rencana Video Jadi' : 'Planned Target Video Duration'}
                </span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[var(--vv-tint)] text-[var(--vv-text-muted)] border border-[var(--vv-border)]">
                {isId ? 'Langkah 2' : 'Step 2'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-bold tabular-nums text-[var(--vv-text-primary)]">
                  {targetPerVideoSec}{' '}
                  <span className="text-base font-normal text-[var(--vv-text-muted)]">
                    {isId ? 'detik' : 'sec'}
                  </span>
                </span>
                <span className="text-sm font-semibold text-[#0099ff] tabular-nums">
                  ({formatMinSec(targetPerVideoSec)})
                </span>
              </div>
              <p className="text-xs text-[var(--vv-text-muted)]">
                {isId
                  ? `Durasi bersih per 1 video jadi (${project.assumptions.final_duration_minutes || 0} menit).`
                  : `Net target duration per 1 final video (${project.assumptions.final_duration_minutes || 0} min).`}
              </p>
            </div>

            <div className="pt-2 border-t border-[var(--vv-border)] flex items-center justify-between text-[11px] text-[var(--vv-text-muted)]">
              <span>{isId ? 'Target Jumlah Video:' : 'Target Video Count:'}</span>
              <strong className="text-[var(--vv-text-primary)] font-semibold font-mono">
                {targetVideosCount} {isId ? 'Video' : targetVideosCount > 1 ? 'Videos' : 'Video'}
              </strong>
            </div>
          </div>

          {/* Kolom 2: Durasi Mentah Shot AI (dari Langkah 3) */}
          <div className="vv-card-quiet p-4 rounded-[14px] flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--vv-text-muted)] flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-[#7acaff]" />
                <span>
                  {isId ? 'Durasi Mentah Shot AI' : 'Raw AI Shot Duration'}
                </span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[var(--vv-tint)] text-[var(--vv-text-muted)] border border-[var(--vv-border)]">
                {isId ? 'Langkah 3' : 'Step 3'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-2xl md:text-3xl font-bold tabular-nums ${
                    isBufferSafe ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {rawPerVideoSec}{' '}
                  <span className="text-base font-normal text-[var(--vv-text-muted)]">
                    {isId ? 'detik' : 'sec'}
                  </span>
                </span>
                <span
                  className={`text-sm font-semibold tabular-nums ${
                    isBufferSafe ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  ({formatMinSec(rawPerVideoSec)})
                </span>
              </div>
              <p className="text-xs text-[var(--vv-text-muted)]">
                {isId
                  ? `Total rekaman mentah dari ${rawPrimaryItemCount} shot utama di Langkah 3.`
                  : `Total raw footage from ${rawPrimaryItemCount} primary shots in Step 3.`}
              </p>
            </div>

            <div className="pt-2 border-t border-[var(--vv-border)] flex items-center justify-between text-[11px] text-[var(--vv-text-muted)]">
              <span>{isId ? 'Kesiapan Buffer Editor:' : 'Editorial Buffer Status:'}</span>
              <strong
                className={`font-semibold ${
                  isBufferSafe ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {isBufferSafe
                  ? isId
                    ? `+${diffSec}s Buffer Aman`
                    : `+${diffSec}s Safe Buffer`
                  : isId
                    ? `Kurang ${Math.abs(diffSec)}s dari Rencana`
                    : `${Math.abs(diffSec)}s Shortage`}
              </strong>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar / Trimming Buffer Ratio */}
        <div className="space-y-2 p-3.5 rounded-[12px] bg-[var(--vv-field)] border border-[var(--vv-border)]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--vv-text-muted)] flex items-center gap-1.5 font-medium">
              <Scissors className="w-3.5 h-3.5 text-[#0099ff]" />
              <span>
                {isId
                  ? 'Visualisasi Buffer Potong Editor (Trimming Ratio)'
                  : 'Editor Trimming & Buffer Ratio'}
              </span>
            </span>
            <span className="font-mono font-bold tabular-nums text-xs">
              {targetPerVideoSec > 0 ? (
                <span className={isBufferSafe ? 'text-emerald-400' : 'text-amber-400'}>
                  {Math.round((rawPerVideoSec / targetPerVideoSec) * 100)}%{' '}
                  {isId ? 'dari target durasi' : 'of target duration'}
                </span>
              ) : (
                '-'
              )}
            </span>
          </div>

          <div className="h-2.5 w-full rounded-full bg-[var(--vv-tint)] overflow-hidden relative">
            <div
              style={{
                width: `${
                  targetPerVideoSec > 0
                    ? Math.min(
                        100,
                        Math.round((rawPerVideoSec / targetPerVideoSec) * 100)
                      )
                    : 0
                }%`,
              }}
              className={`h-full rounded-full transition-all duration-500 ${
                isBufferSafe
                  ? 'bg-gradient-to-r from-[#0099ff] to-emerald-400'
                  : 'bg-gradient-to-r from-amber-500 to-amber-400'
              }`}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-[var(--vv-text-muted)]">
            <span>{isId ? '0 detik' : '0s'}</span>
            <span className="font-medium text-[var(--vv-text-primary)]">
              {isId
                ? `Target Video Jadi: ${targetPerVideoSec}s (${formatMinSec(
                    targetPerVideoSec
                  )})`
                : `Target Final Video: ${targetPerVideoSec}s (${formatMinSec(
                    targetPerVideoSec
                  )})`}
            </span>
            <span className={isBufferSafe ? 'text-emerald-400' : 'text-amber-400'}>
              {isBufferSafe
                ? isId
                  ? `Mentah AI: ${rawPerVideoSec}s (+${diffSec}s buffer)`
                  : `Raw AI: ${rawPerVideoSec}s (+${diffSec}s buffer)`
                : isId
                  ? `Mentah AI: ${rawPerVideoSec}s (-${Math.abs(diffSec)}s kurang)`
                  : `Raw AI: ${rawPerVideoSec}s (-${Math.abs(diffSec)}s short)`}
            </span>
          </div>
        </div>

        {/* Akumulasi Durasi Seluruh Video (Jika target_videos > 1) */}
        {targetVideosCount > 1 && (
          <div className="p-4 rounded-[14px] bg-gradient-to-r from-[#0099ff]/10 via-[#0099ff]/5 to-transparent border border-[#0099ff]/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0099ff]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--vv-text-primary)]">
                  {isId
                    ? `Total Akumulasi Durasi Seluruh Video (${targetVideosCount} Video)`
                    : `Total Project Accumulated Duration (${targetVideosCount} Videos)`}
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#0099ff]/20 text-[#7acaff] font-semibold border border-[#0099ff]/30">
                &times;{targetVideosCount} {isId ? 'Video' : 'Videos'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Target Total Akumulasi (misal 5 video x 90s = 7m 30s) */}
              <div className="vv-card-quiet p-3 rounded-[10px]">
                <div className="text-[11px] text-[var(--vv-text-muted)]">
                  {isId ? 'Target Rencana Seluruh Video' : 'Total Planned Target'}
                </div>
                <div className="text-base font-bold tabular-nums text-[var(--vv-text-primary)] mt-1">
                  {targetVideosCount} {isId ? 'video' : 'videos'} &times;{' '}
                  {targetPerVideoSec}s ={' '}
                  <span className="text-[#0099ff]">
                    {formatMinSec(targetAccumulatedSec)}
                  </span>
                </div>
                <div className="text-[10px] text-[var(--vv-text-subtle)] mt-0.5 font-mono">
                  {targetAccumulatedSec} {isId ? 'detik bersih' : 'net seconds'}
                </div>
              </div>

              {/* Mentah Shot AI Total Akumulasi */}
              <div className="vv-card-quiet p-3 rounded-[10px]">
                <div className="text-[11px] text-[var(--vv-text-muted)]">
                  {isId ? 'Mentah Shot AI Seluruh Video' : 'Total Raw AI Shots'}
                </div>
                <div className="text-base font-bold tabular-nums text-[var(--vv-text-primary)] mt-1">
                  {targetVideosCount} {isId ? 'video' : 'videos'} &times;{' '}
                  {rawPerVideoSec}s ={' '}
                  <span
                    className={
                      isBufferSafe ? 'text-emerald-400' : 'text-amber-400'
                    }
                  >
                    {formatMinSec(rawAccumulatedSec)}
                  </span>
                </div>
                <div className="text-[10px] text-[var(--vv-text-subtle)] mt-0.5 font-mono">
                  {rawAccumulatedSec} {isId ? 'detik footage' : 'seconds footage'}
                </div>
              </div>

              {/* Akumulasi Buffer Editing Seluruh Video */}
              <div className="vv-card-quiet p-3 rounded-[10px]">
                <div className="text-[11px] text-[var(--vv-text-muted)]">
                  {isId ? 'Akumulasi Buffer Seluruh Video' : 'Total Project Buffer'}
                </div>
                <div
                  className={`text-base font-bold tabular-nums mt-1 ${
                    isBufferSafe ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {isBufferSafe ? '+' : '-'}
                  {formatMinSec(Math.abs(diffAccumulatedSec))}
                </div>
                <div className="text-[10px] text-[var(--vv-text-subtle)] mt-0.5">
                  {isBufferSafe
                    ? isId
                      ? `Cadangan potong editor untuk ${targetVideosCount} video (+${diffAccumulatedSec}s)`
                      : `Trimming cushion for ${targetVideosCount} videos (+${diffAccumulatedSec}s)`
                    : isId
                      ? `Kekurangan materi untuk ${targetVideosCount} video (-${Math.abs(diffAccumulatedSec)}s)`
                      : `Material shortage for ${targetVideosCount} videos (-${Math.abs(diffAccumulatedSec)}s)`}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
       * TIER 1.8: ELEVENLABS OFFICIAL VOICE OVER BREAKDOWN CARD
       * Menampilkan detail narasi sulih suara resmi ElevenLabs yang dipisahkan
       * ===================================================================== */}
      {project.items.some((i) => i.category === 'voice_over') &&
        (() => {
          const voItems = project.items.filter(
            (i) => i.category === 'voice_over'
          );
          const totalVoFilesPerVideo = voItems.reduce(
            (sum, item) => sum + Math.max(0, Math.floor(item.quantity || 0)),
            0
          );
          const totalCharsPerVideo = voItems.reduce((sum, item) => {
            const qty = Math.max(0, Math.floor(item.quantity || 0));
            const speedPreset = String(
              item.model_selection.parameter_values?.speed_preset || 'normal'
            );
            let charsPerFile = 0;
            if (item.script_text && item.script_text.trim().length > 0) {
              charsPerFile = item.script_text.length;
            } else if (
              typeof item.character_count === 'number' &&
              item.character_count > 0
            ) {
              charsPerFile = Math.floor(item.character_count);
            } else {
              charsPerFile = convertDurationToCharacters(
                item.duration_seconds || 10,
                item.script_language ?? 'id',
                speedPreset
              );
            }
            return sum + charsPerFile * qty;
          }, 0);
          const totalVoSecondsPerVideo = voItems.reduce(
            (sum, item) =>
              sum +
              Math.max(0, Math.floor(item.quantity || 0)) *
                (item.duration_seconds || 0),
            0
          );
          const totalVoFiles = totalVoFilesPerVideo * targetVideosCount;
          const totalChars = totalCharsPerVideo * targetVideosCount;
          const totalVoSeconds = totalVoSecondsPerVideo * targetVideosCount;
          const activePlan = getElevenLabsPlanById(
            (calc.selected_elevenlabs_plan_id as any) || 'starter'
          );
          const voCatSummary = calc.category_summaries['voice_over'];

          return (
            <div
              className={`${cardClass} rounded-[18px] p-6 space-y-4 border border-sky-500/30 bg-sky-950/10`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--vv-border)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/35 flex items-center justify-center text-sky-400 shrink-0">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[var(--vv-text-primary)]">
                        {isId
                          ? 'Ringkasan Voice Over Resmi ElevenLabs'
                          : 'Official ElevenLabs Voice Over Summary'}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30">
                        {activePlan.name_id.split(' ')[1]} Tier
                      </span>
                    </div>
                    <p className="text-xs text-[var(--vv-text-muted)] mt-0.5">
                      {isId
                        ? 'Tarif resmi terhubung langsung dengan katalog ElevenLabs (dipisahkan dari kredit video Higgsfield).'
                        : 'Official rates connected directly with ElevenLabs catalog (tracked separately from Higgsfield video credits).'}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-left sm:text-right">
                  <div className="text-xs text-[var(--vv-text-muted)]">
                    {isId ? 'Total Biaya Voice Over' : 'Total Voice Over Cost'}
                  </div>
                  <div className="text-lg font-bold tabular-nums text-sky-400">
                    {formatCurrencyIdr(
                      voCatSummary?.total_cost_idr ?? 0,
                      language
                    )}
                  </div>
                  <div className="text-[11px] text-[var(--vv-text-muted)] tabular-nums">
                    {formatCurrencyUsd(
                      voCatSummary?.total_cost_usd ?? 0,
                      language
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="vv-card-quiet p-3 rounded-[12px]">
                  <span className="text-[10px] text-[var(--vv-text-muted)] block">
                    {isId ? 'Jumlah File Audio' : 'Audio Files'}
                  </span>
                  <span className="text-base font-bold text-[var(--vv-text-primary)] font-mono">
                    {totalVoFiles} {isId ? 'file' : 'files'}
                  </span>
                  <span className="text-[10px] text-[var(--vv-text-subtle)] block font-mono mt-0.5">
                    &times; {cadanganMultiplier}{' '}
                    {isId ? 'cadangan' : 'reserve'} ={' '}
                    {voCatSummary?.budgeted_generations ??
                      totalVoFiles * cadanganMultiplier}
                    x {isId ? 'buat' : 'gen'}
                  </span>
                </div>

                <div className="vv-card-quiet p-3 rounded-[12px]">
                  <span className="text-[10px] text-[var(--vv-text-muted)] block">
                    {isId ? 'Total Karakter Naskah' : 'Total Script Characters'}
                  </span>
                  <span className="text-base font-bold text-emerald-400 font-mono">
                    {totalChars.toLocaleString()} {isId ? 'karakter' : 'chars'}
                  </span>
                  <span className="text-[10px] text-[var(--vv-text-subtle)] block font-mono mt-0.5">
                    {isId
                      ? 'Naskah bersih (sebelum cadangan)'
                      : 'Net script (before reserve)'}
                  </span>
                </div>

                <div className="vv-card-quiet p-3 rounded-[12px]">
                  <span className="text-[10px] text-[var(--vv-text-muted)] block">
                    {isId ? 'Total Durasi Suara' : 'Total Voice Duration'}
                  </span>
                  <span className="text-base font-bold text-amber-400 font-mono">
                    ⏱️ {totalVoSeconds}s ({formatMinSec(totalVoSeconds)})
                  </span>
                  <span className="text-[10px] text-[var(--vv-text-subtle)] block font-mono mt-0.5">
                    {targetVideosCount > 1
                      ? `${totalVoSecondsPerVideo}s / video`
                      : isId
                      ? 'Durasi bersih 1 video'
                      : 'Net duration 1 video'}
                  </span>
                </div>

                <div className="vv-card-quiet p-3 rounded-[12px]">
                  <span className="text-[10px] text-[var(--vv-text-muted)] block">
                    {isId ? 'Kredit ElevenLabs' : 'ElevenLabs Credits'}
                  </span>
                  <span className="text-base font-bold text-sky-400 font-mono">
                    🎙️ {calc.total_elevenlabs_credit?.toLocaleString() ?? 0} Cr
                  </span>
                  <span className="text-[10px] text-[var(--vv-text-subtle)] block font-mono mt-0.5">
                    {isId
                      ? `Termasuk ${cadanganMultiplier}x cadangan`
                      : `Includes ${cadanganMultiplier}x reserve`}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

      {/* =====================================================================
       * TIER 1.95: OFFICIAL SUNO AI MUSIC SUMMARY CARD
       * Ringkasan Soundtrack & Musik Resmi Suno AI
       * ===================================================================== */}
      {(() => {
        const musicItems = project.items.filter((i) => i.category === 'music');
        if (musicItems.length === 0) return null;

        const totalTracksPerVideo = musicItems.reduce(
          (sum, item) => sum + Math.max(0, Math.floor(item.quantity || 0)),
          0
        );
        const totalMusicSecondsPerVideo = musicItems.reduce(
          (sum, item) =>
            sum +
            Math.max(0, Math.floor(item.quantity || 0)) *
              (item.duration_seconds || 120),
          0
        );
        const totalTracks = totalTracksPerVideo * targetVideosCount;
        const totalMusicSeconds = totalMusicSecondsPerVideo * targetVideosCount;
        const activeSunoPlan = getSunoPlanById(
          (calc.selected_suno_plan_id as any) || 'pro'
        );
        const musicCatSummary = calc.category_summaries['music'];
        const totalVariations =
          (musicCatSummary?.budgeted_generations ??
            totalTracks * cadanganMultiplier) * 2;

        return (
          <div
            className={`${cardClass} rounded-[18px] p-6 space-y-4 border border-purple-500/30 bg-purple-950/10`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--vv-border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/35 flex items-center justify-center text-purple-400 shrink-0">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[var(--vv-text-primary)]">
                      {isId
                        ? 'Ringkasan Musik & Soundtrack Resmi Suno AI'
                        : 'Official Suno AI Music & Soundtrack Summary'}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                      {activeSunoPlan.name_id} Tier
                    </span>
                  </div>
                  <p className="text-xs text-[var(--vv-text-muted)] mt-0.5">
                    {isId
                      ? 'Tarif resmi terhubung langsung dengan katalog Suno AI (10 kredit/generate menghasilkan 2 variasi lagu).'
                      : 'Official rates connected directly with Suno AI catalog (10 credits/run yielding 2 song variations).'}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-left sm:text-right">
                <div className="text-xs text-[var(--vv-text-muted)]">
                  {isId ? 'Total Biaya Musik Suno' : 'Total Suno Music Cost'}
                </div>
                <div className="text-lg font-bold tabular-nums text-purple-400">
                  {formatCurrencyIdr(
                    musicCatSummary?.total_cost_idr ?? 0,
                    language
                  )}
                </div>
                <div className="text-[11px] text-[var(--vv-text-muted)] tabular-nums">
                  {formatCurrencyUsd(
                    musicCatSummary?.total_cost_usd ?? 0,
                    language
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="vv-card-quiet p-3 rounded-[12px]">
                <span className="text-[10px] text-[var(--vv-text-muted)] block">
                  {isId ? 'Kebutuhan Track Lagu' : 'Music Tracks'}
                </span>
                <span className="text-base font-bold text-[var(--vv-text-primary)] font-mono">
                  {totalTracks} {isId ? 'track' : 'tracks'}
                </span>
                <span className="text-[10px] text-[var(--vv-text-subtle)] block font-mono mt-0.5">
                  &times; {cadanganMultiplier}{' '}
                  {isId ? 'cadangan' : 'reserve'} ={' '}
                  {musicCatSummary?.budgeted_generations ??
                    totalTracks * cadanganMultiplier}
                  x {isId ? 'generate' : 'runs'}
                </span>
              </div>

              <div className="vv-card-quiet p-3 rounded-[12px]">
                <span className="text-[10px] text-[var(--vv-text-muted)] block">
                  {isId ? 'Variasi Lagu Dihasilkan' : 'Song Variations'}
                </span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {totalVariations.toLocaleString()} {isId ? 'klip' : 'clips'}
                </span>
                <span className="text-[10px] text-[var(--vv-text-subtle)] block font-mono mt-0.5">
                  {isId
                    ? '2 pilihan variasi per kali generate'
                    : '2 variation choices per generation'}
                </span>
              </div>

              <div className="vv-card-quiet p-3 rounded-[12px]">
                <span className="text-[10px] text-[var(--vv-text-muted)] block">
                  {isId ? 'Total Durasi Musik' : 'Total Music Duration'}
                </span>
                <span className="text-base font-bold text-amber-400 font-mono">
                  ⏱️ {totalMusicSeconds}s ({formatMinSec(totalMusicSeconds)})
                </span>
                <span className="text-[10px] text-[var(--vv-text-subtle)] block font-mono mt-0.5">
                  {targetVideosCount > 1
                    ? `${totalMusicSecondsPerVideo}s / video`
                    : isId
                    ? 'Panjang audio per video'
                    : 'Audio length per video'}
                </span>
              </div>

              <div className="vv-card-quiet p-3 rounded-[12px]">
                <span className="text-[10px] text-[var(--vv-text-muted)] block">
                  {isId ? 'Kredit Suno AI' : 'Suno AI Credits'}
                </span>
                <span className="text-base font-bold text-purple-400 font-mono">
                  🎵 {calc.total_suno_credit?.toLocaleString() ?? 0} Cr
                </span>
                <span className="text-[10px] text-[var(--vv-text-subtle)] block font-mono mt-0.5">
                  {isId
                    ? `Termasuk ${cadanganMultiplier}x cadangan`
                    : `Includes ${cadanganMultiplier}x reserve`}
                </span>
              </div>
            </div>

            {musicItems.some((i) => i.stem_enabled) && (
              <div className="p-3 rounded-[12px] bg-purple-500/10 border border-purple-500/25 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-[var(--vv-text-primary)]">
                    {isId ? 'Pemisahan Track Audio (Stems) Aktif' : 'Audio Stem Separation Active'}
                  </span>
                  <span className="text-[var(--vv-text-muted)]">
                    ({musicItems.filter((i) => i.stem_enabled).length} {isId ? 'track menggunakan stems' : 'tracks using stems'})
                  </span>
                </div>
                <div className="text-[11px] font-mono text-purple-300">
                  {isId ? 'Termasuk biaya kredit stems ke dalam total kredit Suno' : 'Stem credits included in total Suno credits'}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* =====================================================================
       * TIER 2: SECONDARY SCANNING ZONE — UNIT ECONOMICS & VISUAL CATEGORY SHARE
       * ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 5 Cols: Rata-rata Biaya Satuan & Credit */}
        <div
          className={`${cardClass} lg:col-span-5 rounded-[16px] p-6 flex flex-col justify-between space-y-4`}
        >
          <div className="flex items-center justify-between border-b border-[var(--vv-border)] pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0099ff]" />
              <span>
                {isId
                  ? 'Rata-rata Biaya Satuan & Credit'
                  : 'Average Unit Costs & Credits'}
              </span>
            </h2>
          </div>

          <div className="space-y-3">
            {/* Rata-rata per shot utama */}
            <div className="vv-card-quiet p-3.5 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[var(--vv-text-primary)]">
                  {calc.total_primary_shots > 0
                    ? isId
                      ? 'Rata-rata per 1 Shot Utama'
                      : 'Avg Cost per 1 Primary Shot'
                    : isId
                    ? 'Rata-rata per 1 Item'
                    : 'Avg Cost per 1 Item'}
                </div>
                <div className="text-[11px] text-[var(--vv-text-muted)]">
                  {calc.total_primary_shots > 0
                    ? isId
                      ? `Total anggaran dibagi ${calc.total_primary_shots} shot utama (${totalItemsAllVideos} total item)`
                      : `Total budget divided by ${calc.total_primary_shots} primary shots (${totalItemsAllVideos} total items)`
                    : isId
                    ? `${totalItemsAllVideos} total item`
                    : `${totalItemsAllVideos} total items`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold tabular-nums text-[var(--vv-text-primary)]">
                  {formatCurrencyIdr(avgCostPerItemIdr, language)}
                </div>
                <div className="text-xs text-[#0099ff] tabular-nums">
                  {formatCurrencyUsd(avgCostPerItemUsd, language)}
                </div>
              </div>
            </div>

            {/* Rata-rata per 1x generasi AI */}
            <div className="vv-card-quiet p-3.5 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[var(--vv-text-primary)]">
                  {isId ? 'Rata-rata per 1x Pembuatan AI' : 'Avg Cost per 1 AI Generation'}
                </div>
                <div className="text-[11px] text-[var(--vv-text-muted)]">
                  {isId
                    ? `Tarif per satu kali tombol generate`
                    : `Rate per single generation run`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold tabular-nums text-[var(--vv-text-primary)]">
                  {formatCurrencyIdr(avgCostPerGenIdr, language)}
                </div>
                <div className="text-xs text-[#0099ff] tabular-nums">
                  {formatCurrencyUsd(avgCostPerGenUsd, language)}
                </div>
              </div>
            </div>

            {/* Total Credit */}
            <div className="p-3.5 rounded-[12px] bg-[#0099ff]/10 border border-[#0099ff]/30 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#7acaff] flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5" />
                  <span>{t.totalCredit}</span>
                </div>
                <div className="text-[10px] text-[var(--vv-text-muted)] mt-0.5">
                  {calc.total_elevenlabs_credit !== null || calc.total_suno_credit !== null
                    ? isId
                      ? 'Kredit Higgsfield, ElevenLabs & Suno'
                      : 'Higgsfield, ElevenLabs & Suno Credits'
                    : isId
                    ? `Untuk total ${calc.budgeted_generations} kali proses AI`
                    : `For total ${calc.budgeted_generations} AI runs`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold tabular-nums text-[#7acaff]">
                  {calc.total_credit !== null
                    ? `${calc.total_credit.toLocaleString()} Cr (Higgsfield)`
                    : '-'}
                </div>
                {calc.total_elevenlabs_credit !== null && (
                  <div className="text-xs font-bold tabular-nums text-sky-400 mt-0.5">
                    {calc.total_elevenlabs_credit.toLocaleString()} Cr
                    (ElevenLabs)
                  </div>
                )}
                {calc.total_suno_credit !== null && (
                  <div className="text-xs font-bold tabular-nums text-purple-400 mt-0.5">
                    {calc.total_suno_credit.toLocaleString()} Cr
                    (Suno)
                  </div>
                )}
              </div>
            </div>

            {/* Optional Target Final Metrics if explicit */}
            {calc.target_videos > 1 && (
              <div className="vv-card-quiet p-3 flex items-center justify-between text-xs">
                <span className="text-[var(--vv-text-muted)]">
                  {isId ? 'Biaya per 1 Video Jadi:' : 'Cost per 1 Final Video:'}
                </span>
                <span className="font-bold tabular-nums text-emerald-400">
                  {formatCurrencyIdr(calc.one_video_total_cost_idr, language)} ({formatCurrencyUsd(calc.one_video_total_cost_usd, language)})
                </span>
              </div>
            )}
            {rawPerVideoSec > 0 && (
              <div className="vv-card-quiet p-3 flex items-center justify-between text-xs">
                <span className="text-[var(--vv-text-muted)]">
                  {isId ? 'Durasi Mentah Shot AI (1 Video):' : 'Raw AI Shot Duration (1 Video):'}
                </span>
                <span
                  className={`font-bold tabular-nums ${
                    isBufferSafe ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  ⏱️ {formatMinSec(rawPerVideoSec)} ({rawPerVideoSec}s)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right 7 Cols: Visual Cost Share by AI Creation Type */}
        <div
          className={`${cardClass} lg:col-span-7 rounded-[16px] p-6 flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between border-b border-[var(--vv-border)] pb-3 mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0099ff]" />
              <span>
                {isId
                  ? 'Porsi Biaya Berdasarkan Jenis Pembuatan AI'
                  : 'Cost Share by AI Creation Type'}
              </span>
            </h2>
          </div>

          <div className="space-y-3.5 flex-1 flex flex-col justify-center">
            {ALL_CATEGORIES.map((cat) => {
              const cSum = calc.category_summaries[cat];
              const pct =
                calc.total_cost_usd > 0
                  ? Math.round((cSum.total_cost_usd / calc.total_cost_usd) * 100)
                  : 0;
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[var(--vv-text-primary)]">
                        {SHORT_CATEGORY_LABELS[cat][language]}
                      </span>
                      <span className="text-[10px] text-[var(--vv-text-subtle)] tabular-nums">
                        ({cSum.item_count} {isId ? 'tahap' : 'stages'} &bull;{' '}
                        {cSum.budgeted_generations}x)
                      </span>
                    </div>
                    <div className="text-right tabular-nums">
                      <strong className="text-[var(--vv-text-primary)]">
                        {formatCurrencyIdr(cSum.total_cost_idr, language)}
                      </strong>
                      <span className="text-[var(--vv-text-muted)] ml-2">
                        ({formatCurrencyUsd(cSum.total_cost_usd, language)})
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[var(--vv-tint)] overflow-hidden">
                    <div
                      style={{
                        width: `${Math.max(
                          pct,
                          cSum.item_count > 0 ? 4 : 0
                        )}%`,
                      }}
                      className="h-full rounded-full bg-[#0099ff] transition-all duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================================
       * TIER 3: STREAMLINED STAGE SUMMARY + POPUP FOR FULL AUDIT
       * ===================================================================== */}
      <div className={`${cardClass} rounded-[16px] p-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--vv-border)]">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)]">
              {isId
                ? 'Ringkasan Biaya per Tahap Pekerjaan'
                : 'Stage-by-Stage Cost Summary'}
            </h2>
            <p className="text-xs text-[var(--vv-text-subtle)] mt-0.5">
              {isId
                ? 'Menampilkan kebutuhan shot/gambar dan perkalian cadangan tiap tahap.'
                : 'Showing shot/image requirements and reserve multiplier per stage.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsFullAuditModalOpen(true)}
            className="vv-btn-secondary px-4 py-2 text-xs shrink-0"
          >
            <Eye className="w-3.5 h-3.5 text-[#0099ff]" />
            <span>
              {isId
                ? 'Lihat Tabel Rincian Lengkap'
                : 'View Full Detailed Table'}
            </span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--vv-border)] text-[var(--vv-text-muted)]">
                <th className="py-2.5 text-left font-medium w-10">#</th>
                <th className="py-2.5 text-left font-medium">
                  {isId ? 'Nama Shot / Tahap' : 'Shot / Stage Name'}
                </th>
                <th className="py-2.5 text-left font-medium">
                  {isId ? 'Model AI' : 'AI Model'}
                </th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Kebutuhan & Cadangan' : 'Requirements & Reserve'}
                </th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Pemakaian Credit' : 'Platform Credit'}
                </th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Subtotal Anggaran' : 'Subtotal Cost'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--vv-border)]">
              {calc.item_results.map((row, idx) => {
                const attemptsCount =
                  row.attempts_per_item || cadanganMultiplier;
                return (
                  <tr
                    key={row.item_id}
                    className="hover:bg-[var(--vv-tint-weak)] transition-colors"
                  >
                    <td className="py-3 font-mono text-[11px] text-[var(--vv-text-subtle)]">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="py-3 font-semibold">
                      <div>{row.label}</div>
                      <div className="text-[10px] text-[var(--vv-text-muted)] font-normal">
                        {SHORT_CATEGORY_LABELS[row.category][language]}
                      </div>
                    </td>
                    <td className="py-3 text-[var(--vv-text-strong)]">
                      {row.model_name}
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      <strong className="text-[var(--vv-text-primary)]">
                        {row.budgeted_generations}x buat
                      </strong>
                      <div className="text-[10px] text-[#0099ff]">
                        {row.effective_quantity} item &times; {attemptsCount} cadangan
                      </div>
                    </td>
                    <td className="py-3 text-right tabular-nums text-[#7acaff]">
                      <strong>{row.total_credit !== null ? `${row.total_credit} cr` : '-'}</strong>
                      {row.unit_credit !== null && (
                        <div className="text-[10px] text-[var(--vv-text-muted)]">
                          @{row.unit_credit} cr
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      <div className="font-bold text-[#0099ff]">
                        {formatCurrencyIdr(row.total_cost_idr, language)}
                      </div>
                      <div className="text-[11px] text-[var(--vv-text-muted)]">
                        ({formatCurrencyUsd(row.total_cost_usd, language)})
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guided Step Flow Footer */}
      <StepFlowBar
        currentStepNumber={4}
        stepTitle={t.navSummary}
        nextStepHint={
          isId
            ? 'Langkah terakhir: Pratinjau dokumen laporan ukuran A4 dan simpan sebagai file PDF resmi.'
            : 'Final step: Preview your A4 report document and save it as an official PDF file.'
        }
        prevTab="planner"
        prevLabel={t.navPlanner}
        nextTab="pdf"
        nextLabel={
          isId
            ? 'Lanjut ke Langkah 5: Cetak Laporan PDF'
            : 'Continue to Step 5: Save PDF Report'
        }
      />

      {/* =====================================================================
       * FROSTED GLASS MODAL: Tabel Rincian Audit Lengkap per Adegan
       * ===================================================================== */}
      <FrostedModal
        isOpen={isFullAuditModalOpen}
        onClose={() => setIsFullAuditModalOpen(false)}
        theme={theme}
        maxWidth="4xl"
        badgeLabel={
          isId ? 'Rincian Lengkap per Tahap' : 'Complete Stage Breakdown'
        }
        title={
          isId ? (
            <>
              Tabel Rincian Biaya &{' '}
              <span className="vv-accent text-[#0099ff]">
                Cadangan per Shot / Gambar
              </span>
            </>
          ) : (
            <>
              Detailed Cost &{' '}
              <span className="vv-accent text-[#0099ff]">
                Reserve Table per Shot
              </span>
            </>
          )
        }
        subtitle={
          isId
            ? 'Menampilkan rincian kebutuhan item, faktor cadangan pengali, pemakaian credit, dan subtotal biaya untuk setiap tahap.'
            : 'Displays exact item count, reserve multiplier factor, platform credits, and subtotal for every stage.'
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--vv-border)] text-[var(--vv-text-muted)]">
                <th className="py-2.5 text-left font-medium">#</th>
                <th className="py-2.5 text-left font-medium">
                  {isId ? 'Nama Shot / Tahap' : 'Shot / Stage Name'}
                </th>
                <th className="py-2.5 text-left font-medium">
                  {isId ? 'Model & Jenis AI' : 'Model & AI Type'}
                </th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Kebutuhan & Cadangan' : 'Requirements & Reserve'}
                </th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Tarif Satuan' : 'Unit Price'}
                </th>
                <th className="py-2.5 text-right font-medium">Credit</th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Subtotal (USD)' : 'Subtotal (USD)'}
                </th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Subtotal (Rupiah)' : 'Subtotal (IDR)'}
                </th>
                <th className="py-2.5 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--vv-border)]">
              {calc.item_results.map((row, idx) => {
                const attemptsCount =
                  row.attempts_per_item || cadanganMultiplier;
                return (
                  <tr
                    key={row.item_id}
                    className="hover:bg-[var(--vv-tint-weak)] transition-colors"
                  >
                    <td className="py-3 font-mono text-[11px] text-[var(--vv-text-subtle)]">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="py-3 font-semibold">{row.label}</td>
                    <td className="py-3">
                      <div>{row.model_name}</div>
                      <div className="text-[10px] text-[var(--vv-text-muted)]">
                        {CATEGORY_LABELS[row.category][language]}
                      </div>
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      <strong className="text-[var(--vv-text-primary)]">
                        {row.budgeted_generations}x buat
                      </strong>
                      <div className="text-[10px] text-[#0099ff]">
                        {row.effective_quantity} item &times; {attemptsCount} cadangan
                      </div>
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      {formatCurrencyUsd(row.unit_price_usd, language)}
                    </td>
                    <td className="py-3 text-right tabular-nums text-[#7acaff]">
                      <strong>{row.total_credit !== null ? `${row.total_credit} cr` : '-'}</strong>
                      {row.unit_credit !== null && (
                        <div className="text-[10px] text-[var(--vv-text-muted)]">
                          @{row.unit_credit} cr
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-right font-semibold tabular-nums">
                      {formatCurrencyUsd(row.total_cost_usd, language)}
                    </td>
                    <td className="py-3 text-right font-bold tabular-nums text-[#0099ff]">
                      {formatCurrencyIdr(row.total_cost_idr, language)}
                    </td>
                    <td className="py-3 text-center">
                      <StatusBadge
                        status={row.pricing_status}
                        language={language}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </FrostedModal>
    </div>
  );
};
