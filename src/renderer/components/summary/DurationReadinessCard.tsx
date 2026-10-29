import React from 'react';
import {
  ProcessCategory,
  ProductionItem,
  ProjectCalculation,
  ProjectFile,
} from '../../../shared/types/project';
import { isDefaultPrimaryShot } from '../../../shared/engine/calculationEngine';
import { formatMinSec } from './summaryTypes';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Film,
  Layers,
  Scissors,
} from 'lucide-react';

interface DurationReadinessCardProps {
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  project: ProjectFile;
  calculation: ProjectCalculation;
}

export const DurationReadinessCard: React.FC<DurationReadinessCardProps> = ({
  language,
  theme,
  project,
  calculation: calc,
}) => {
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';

  const targetVideosCount = Math.max(
    1,
    calc.target_videos || project.assumptions.target_videos || 1
  );

  const isVideoCategory = (cat: ProcessCategory): boolean =>
    cat === 'text_to_video' || cat === 'image_to_video' || cat === 'video_to_video';

  const primaryVideoItems = project.items.filter((item: ProductionItem) => {
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
    (sum: number, item: ProductionItem) =>
      sum + Math.max(0, item.quantity) * Math.max(0, item.duration_seconds || 0),
    0
  );

  const rawPrimaryItemCount = primaryVideoItems.reduce(
    (sum: number, item: ProductionItem) => sum + Math.max(0, item.quantity),
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
  );
};
