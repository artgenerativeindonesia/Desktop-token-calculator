import React from 'react';
import {
  ProductionItem,
  ProjectCalculation,
  ProjectFile,
} from '../../../shared/types/project';
import { formatCurrencyIdr, formatCurrencyUsd } from '../../i18n/translations';
import { getSunoPlanById } from '../../../shared/catalog/sunoCatalog';
import { Music, Scissors } from 'lucide-react';

interface SunoMusicSummaryCardProps {
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  project: ProjectFile;
  calculation: ProjectCalculation;
}

export const SunoMusicSummaryCard: React.FC<SunoMusicSummaryCardProps> = ({
  language,
  theme,
  project,
  calculation: calc,
}) => {
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';

  const musicItems = project.items.filter((i: ProductionItem) => i.category === 'music');
  if (musicItems.length === 0) return null;

  const targetVideosCount = Math.max(
    1,
    calc.target_videos || project.assumptions.target_videos || 1
  );

  const cadanganMultiplier =
    project.assumptions.default_attempts_per_shot ||
    project.assumptions.reserve_generations_override ||
    1;

  const totalTracksPerVideo = musicItems.reduce(
    (sum: number, item: ProductionItem) => sum + Math.max(0, Math.floor(item.quantity || 0)),
    0
  );
  const totalStemTracksPerVideo = musicItems.reduce((sum: number, item: ProductionItem) => {
    const isStem =
      item.stem_enabled ??
      (item.stem_separation_mode && item.stem_separation_mode !== 'none');
    return (
      sum + (isStem ? Math.max(0, Math.floor(item.quantity || 0)) : 0)
    );
  }, 0);
  const totalTracks = totalTracksPerVideo * targetVideosCount;
  const totalStemTracks = totalStemTracksPerVideo * targetVideosCount;
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
            {totalTracks} {isId ? 'lagu' : 'songs'}
          </span>
          <span className="text-[10px] text-[var(--vv-text-subtle)] block font-mono mt-0.5">
            &times; {cadanganMultiplier}{' '}
            {isId ? 'cadangan' : 'reserve'} ={' '}
            {musicCatSummary?.budgeted_generations ??
              totalTracks * cadanganMultiplier}
            x {isId ? 'buat' : 'runs'}
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
            {isId ? 'Pemisahan Stems Audio' : 'Audio Stem Separation'}
          </span>
          <span className="text-base font-bold text-amber-400 font-mono">
            🎚️{' '}
            {totalStemTracks > 0
              ? `${totalStemTracks} ${isId ? 'lagu' : 'songs'}`
              : isId
              ? 'Stereo Mix'
              : 'Stereo Mix'}
          </span>
          <span className="text-[10px] text-[var(--vv-text-subtle)] block font-mono mt-0.5">
            {totalStemTracks > 0
              ? isId
                ? 'Otomatis 1x per lagu jadi'
                : 'Auto 1x per finished song'
              : isId
              ? 'Tanpa pisah track (0 Cr)'
              : 'Standard mix (0 Cr)'}
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

      {musicItems.some((i: ProductionItem) => i.stem_enabled) && (
        <div className="p-3 rounded-[12px] bg-purple-500/10 border border-purple-500/25 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-[var(--vv-text-primary)]">
              {isId ? 'Pemisahan Track Audio (Stems) Aktif' : 'Audio Stem Separation Active'}
            </span>
            <span className="text-[var(--vv-text-muted)]">
              ({musicItems.filter((i: ProductionItem) => i.stem_enabled).length} {isId ? 'track menggunakan stems' : 'tracks using stems'})
            </span>
          </div>
          <div className="text-[11px] font-mono text-purple-300">
            {isId ? 'Termasuk biaya kredit stems ke dalam total kredit Suno' : 'Stem credits included in total Suno credits'}
          </div>
        </div>
      )}
    </div>
  );
};
