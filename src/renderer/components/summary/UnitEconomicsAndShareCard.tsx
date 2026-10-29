import React from 'react';
import {
  ProductionItem,
  ProjectCalculation,
  ProjectFile,
} from '../../../shared/types/project';
import {
  formatCurrencyIdr,
  formatCurrencyUsd,
  SHORT_CATEGORY_LABELS,
  UI_TEXT,
} from '../../i18n/translations';
import { ALL_CATEGORIES, formatMinSec } from './summaryTypes';
import { Coins, Layers, Sparkles } from 'lucide-react';

interface UnitEconomicsAndShareCardProps {
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  project: ProjectFile;
  calculation: ProjectCalculation;
}

export const UnitEconomicsAndShareCard: React.FC<UnitEconomicsAndShareCardProps> = ({
  language,
  theme,
  project,
  calculation: calc,
}) => {
  const isId = language === 'id';
  const t = UI_TEXT[language];
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';

  const totalSceneQuantity = project.items.reduce(
    (sum: number, item: ProductionItem) => sum + Math.max(0, Math.floor(item.quantity)),
    0
  );

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

  const rawPerVideoSec =
    typeof calc.one_video_duration_seconds === 'number'
      ? calc.one_video_duration_seconds
      : 0;

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

  return (
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
  );
};
