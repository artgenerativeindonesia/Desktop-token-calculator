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
import { InteractiveGlowLine } from './InteractiveGlowLine';
import { ProcessCategory } from '../../shared/types/project';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Coins,
  Eye,
  FileDown,
  Layers,
  Sparkles,
} from 'lucide-react';

const ALL_CATEGORIES: ProcessCategory[] = [
  'text_to_image',
  'image_to_image',
  'image_to_video',
  'video_to_video',
  'text_to_video',
  'upscale_image',
  'upscale_video',
];

export const BudgetSummaryView: React.FC = () => {
  const { project, language, theme, setActiveTab } = useProjectStore();
  const [isFullAuditModalOpen, setIsFullAuditModalOpen] = useState(false);
  const heroCardRef = useRef<HTMLDivElement | null>(null);

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

  // Rata-rata per adegan pokok
  const avgCostPerItemIdr =
    totalSceneQuantity > 0 && calc.total_cost_idr !== null
      ? calc.total_cost_idr / totalSceneQuantity
      : null;
  const avgCostPerItemUsd =
    totalSceneQuantity > 0 ? calc.total_cost_usd / totalSceneQuantity : 0;

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
    <div className="space-y-6">
      {/* =====================================================================
       * TIER 1: DOMINANT FOCAL POINT — EXECUTIVE BUDGET HERO CARD
       * ===================================================================== */}
      <div
        ref={heroCardRef}
        className={`${heroCardClass} rounded-[18px] p-6 md:p-7 relative overflow-hidden`}
      >
        {/* Garis Animasi Glowing Line Interaktif di Bibir Atas Kartu Utama */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <InteractiveGlowLine
            parentRef={heroCardRef}
            variant="hero"
            colorScheme="blue"
            thickness={1.5}
          />
        </div>
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
                  ? 'Seluruh angka di halaman ini dihitung otomatis dari susunan adegan di Langkah 3 dan cadangan di Langkah 2.'
                  : 'All figures on this page are calculated automatically from scenes in Step 3 and reserve in Step 2.'}
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
                    <span>{isId ? 'Kebutuhan Adegan Pokok' : 'Base Scene Items'}</span>
                    <span className="font-mono text-[#0099ff]">{project.items.length} {isId ? 'tahap' : 'stages'}</span>
                  </div>
                  <div className="text-xl font-bold tabular-nums text-[var(--vv-text-primary)] text-right mt-1">
                    {totalSceneQuantity}{' '}
                    <span className="text-xs font-normal text-[var(--vv-text-muted)]">
                      {isId ? 'adegan / gambar' : 'items'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--vv-text-muted)] text-right mt-0.5">
                    {isId ? 'Disusun pada Langkah 3' : 'Configured in Step 3'}
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
                    {isId ? 'Jatah coba per adegan' : 'Retry attempts per scene'}
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
              <div className="text-lg font-semibold tabular-nums text-[#0099ff] mt-1">
                {formatCurrencyUsd(calc.total_cost_usd, language)}
              </div>
              <div className="text-[11px] text-[var(--vv-text-muted)] mt-1.5">
                {totalSceneQuantity} {isId ? 'adegan' : 'scenes'} &times; {cadanganMultiplier} {isId ? 'cadangan' : 'reserve'} ={' '}
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
                <span className="font-bold text-[var(--vv-text-primary)] font-mono">
                  {calc.total_credit !== null
                    ? `${calc.total_credit.toLocaleString()} Credits`
                    : '-'}
                </span>
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
            {/* Rata-rata per adegan pokok */}
            <div className="vv-card-quiet p-3.5 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[var(--vv-text-primary)]">
                  {isId ? 'Rata-rata per 1 Adegan / Gambar' : 'Avg Cost per Scene / Image'}
                </div>
                <div className="text-[11px] text-[var(--vv-text-muted)]">
                  {isId
                    ? `${totalSceneQuantity} adegan (masing-masing ${cadanganMultiplier} jatah coba)`
                    : `${totalSceneQuantity} items (${cadanganMultiplier} attempts each)`}
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
                  {isId
                    ? `Untuk total ${calc.budgeted_generations} kali proses AI`
                    : `For total ${calc.budgeted_generations} AI runs`}
                </div>
              </div>
              <div className="text-lg font-bold tabular-nums text-[#7acaff]">
                {calc.total_credit !== null
                  ? `${calc.total_credit.toLocaleString()} Credits`
                  : t.unavailableLabel}
              </div>
            </div>

            {/* Optional Target Final Metrics if explicit */}
            {project.assumptions.estimation_mode === 'target_final' &&
              calc.cost_per_video_usd !== null && (
                <div className="vv-card-quiet p-3 flex items-center justify-between text-xs">
                  <span className="text-[var(--vv-text-muted)]">{t.costPerVideo}</span>
                  <span className="font-bold tabular-nums">
                    {formatCurrencyIdr(calc.cost_per_video_idr, language)} ({formatCurrencyUsd(calc.cost_per_video_usd, language)})
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
                ? 'Menampilkan kebutuhan gambar/adegan dan perkalian cadangan tiap tahap.'
                : 'Showing scene requirements and reserve multiplier per stage.'}
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
                  {isId ? 'Nama Adegan / Tahap' : 'Scene / Stage Name'}
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
                Cadangan per Adegan
              </span>
            </>
          ) : (
            <>
              Detailed Cost &{' '}
              <span className="vv-accent text-[#0099ff]">
                Reserve Table per Stage
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
                  {isId ? 'Nama Adegan / Tahap' : 'Scene / Stage Name'}
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
