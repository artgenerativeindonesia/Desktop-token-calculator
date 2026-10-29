import React from 'react';
import { ProjectCalculation } from '../../../shared/types/project';
import {
  formatCurrencyIdr,
  formatCurrencyUsd,
} from '../../i18n/translations';
import { formatDualDuration } from './plannerTypes';
import {
  Clock,
  Film,
  Scissors,
  Sparkles,
} from 'lucide-react';

interface PlannerRunningSummaryProps {
  language: 'id' | 'en';
  calculation: ProjectCalculation;
  cleanDurationSec: number;
  totalCleanDurationSec: number;
  targetDurationSec: number;
  durationDiff: number;
}

export const PlannerRunningSummary: React.FC<PlannerRunningSummaryProps> = ({
  language,
  calculation,
  cleanDurationSec,
  totalCleanDurationSec,
  targetDurationSec,
  durationDiff,
}) => {
  const isId = language === 'id';

  return (
    <div className="vv-card p-4 sm:p-5 border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-md rounded-2xl space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold flex flex-wrap items-center gap-2">
              <span>
                {isId
                  ? 'Rekapitulasi Anggaran & Durasi Berjalan'
                  : 'Running Budget & Duration Breakdown'}
              </span>
              {calculation.target_videos > 1 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                  {calculation.target_videos} {isId ? 'Video' : 'Videos'}
                </span>
              )}
            </div>
            <div className="text-sm text-[var(--vv-text-primary)] font-medium mt-0.5">
              {calculation.target_videos > 1 ? (
                <span>
                  {isId ? 'Subtotal 1 Video' : '1 Video Subtotal'} (
                  <strong>
                    {formatCurrencyIdr(
                      calculation.one_video_total_cost_idr,
                      language
                    )}
                  </strong>{' '}
                  /{' '}
                  {formatCurrencyUsd(
                    calculation.one_video_total_cost_usd,
                    language
                  )}
                  ) &times;{' '}
                  <strong>{calculation.target_videos} Video</strong>
                </span>
              ) : (
                <span>
                  {isId
                    ? 'Total Anggaran 1 Video Penuh'
                    : 'Total 1 Video Budget'}
                </span>
              )}
            </div>

            {/* Duration & Shot Chips */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>
                  {isId ? 'Durasi Bersih 1 Video:' : 'Clean Duration (1 Video):'}{' '}
                  <strong className="text-sky-200">
                    {formatDualDuration(cleanDurationSec, isId)}
                  </strong>
                </span>
              </span>

              {calculation.target_videos > 1 && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    {isId
                      ? `Total Durasi ${calculation.target_videos} Video:`
                      : `Total Duration (${calculation.target_videos} Videos):`}{' '}
                    <strong className="text-indigo-200">
                      {formatDualDuration(totalCleanDurationSec, isId)}
                    </strong>
                  </span>
                </span>
              )}

              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--vv-tint-weak)] text-[var(--vv-text-muted)] border border-[var(--vv-border)] flex items-center gap-1">
                <span>🎬</span>
                <span>
                  {calculation.one_video_primary_shot_count}{' '}
                  {isId ? 'Shot Utama' : 'Primary Shots'}
                  {calculation.target_videos > 1 &&
                    ` (${calculation.total_primary_shots} total)`}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="text-left md:text-right shrink-0">
          <div className="text-xs text-[var(--vv-text-muted)]">
            {calculation.target_videos > 1
              ? isId
                ? `Total Anggaran (${calculation.target_videos} Video)`
                : `Grand Total Budget (${calculation.target_videos} Videos)`
              : isId
              ? 'Total Anggaran Seluruh Video'
              : 'Grand Total Budget'}
          </div>
          <div className="text-xl sm:text-2xl font-black tabular-nums text-emerald-400">
            {formatCurrencyIdr(calculation.total_cost_idr, language)}
          </div>
          <div className="text-xs text-[var(--vv-text-muted)] tabular-nums">
            {formatCurrencyUsd(calculation.total_cost_usd, language)}
            {' • '}
            {[
              calculation.total_credit !== null
                ? `${calculation.total_credit.toLocaleString()} Cr Higgsfield`
                : null,
              calculation.total_elevenlabs_credit !== null
                ? `${calculation.total_elevenlabs_credit.toLocaleString()} Cr ElevenLabs`
                : null,
              calculation.total_suno_credit !== null
                ? `${calculation.total_suno_credit.toLocaleString()} Cr Suno`
                : null,
            ]
              .filter(Boolean)
              .join(' • ') || (isId ? '0 Credit' : '0 Credits')}
            {' '}&bull; {calculation.budgeted_generations}{' '}
            {isId ? 'kali coba' : 'runs'}
          </div>
        </div>
      </div>

      {/* Sineas UX Message: Buffer Editing & Potongan Post-Produksi */}
      <div className="pt-3 border-t border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-start sm:items-center gap-2 text-[var(--vv-text-muted)] leading-relaxed">
          <Scissors className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            {targetDurationSec > 0
              ? isId
                ? `Komparasi Sineas: Footage AI (${cleanDurationSec}s) vs Target Rencana (${targetDurationSec}s). Kelebihan durasi ${
                    durationDiff > 0 ? `(+${durationDiff}s)` : '(0s)'
                  } adalah hal wajar karena akan dipotong & diselaraskan oleh editor di post-produksi agar ritme video pas.`
                : `Filmmaker Comparison: AI Footage (${cleanDurationSec}s) vs Target (${targetDurationSec}s). Excess duration ${
                    durationDiff > 0 ? `(+${durationDiff}s)` : '(0s)'
                  } is normal and intended to be trimmed by editors in post-production for optimal pacing.`
              : isId
              ? `Footage AI memproyeksikan ${formatDualDuration(
                  cleanDurationSec,
                  isId
                )} per video. Seluruh klip dapat dipotong dan disesuaikan oleh editor pada tahap pasca-produksi.`
              : `AI footage projects ${formatDualDuration(
                  cleanDurationSec,
                  isId
                )} per video. Clips can be trimmed and adjusted by editors in post-production.`}
          </span>
        </div>

        {targetDurationSec > 0 && durationDiff > 0 && (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold shrink-0 self-start sm:self-center">
            +{durationDiff}s buffer editing
          </span>
        )}
      </div>
    </div>
  );
};
