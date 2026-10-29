import React from 'react';
import {
  ProductionItem,
  ProjectCalculation,
  ProjectFile,
} from '../../../shared/types/project';
import { formatCurrencyIdr, formatCurrencyUsd } from '../../i18n/translations';
import {
  convertDurationToCharacters,
  getElevenLabsPlanById,
} from '../../../shared/catalog/elevenlabsCatalog';
import { formatMinSec } from './summaryTypes';
import { Mic } from 'lucide-react';

interface ElevenLabsSummaryCardProps {
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  project: ProjectFile;
  calculation: ProjectCalculation;
}

export const ElevenLabsSummaryCard: React.FC<ElevenLabsSummaryCardProps> = ({
  language,
  theme,
  project,
  calculation: calc,
}) => {
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';

  const voItems = project.items.filter((i: ProductionItem) => i.category === 'voice_over');
  if (voItems.length === 0) return null;

  const targetVideosCount = Math.max(
    1,
    calc.target_videos || project.assumptions.target_videos || 1
  );

  const cadanganMultiplier =
    project.assumptions.default_attempts_per_shot ||
    project.assumptions.reserve_generations_override ||
    1;

  const totalVoFilesPerVideo = voItems.reduce(
    (sum: number, item: ProductionItem) => sum + Math.max(0, Math.floor(item.quantity || 0)),
    0
  );

  const totalCharsPerVideo = voItems.reduce((sum: number, item: ProductionItem) => {
    const qty = Math.max(0, Math.floor(item.quantity || 0));
    const speedPreset = String(
      item.model_selection.parameter_values?.speed_preset || 'normal'
    );
    let charsPerFile = 0;
    if (
      typeof item.character_count === 'number' &&
      item.character_count > 0
    ) {
      charsPerFile = Math.floor(item.character_count);
    } else if (item.script_text && item.script_text.trim().length > 0) {
      charsPerFile = item.script_text.length;
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
    (sum: number, item: ProductionItem) =>
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
};
