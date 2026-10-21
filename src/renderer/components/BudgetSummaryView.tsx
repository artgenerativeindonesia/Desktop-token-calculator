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
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Coins,
  Eye,
  FileDown,
  Film,
  Layers,
} from 'lucide-react';

const ALL_CATEGORIES: ProcessCategory[] = [
  'text_to_image',
  'image_to_video',
  'video_to_video',
  'text_to_video',
  'upscaling',
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

  const baseSharePercent =
    calc.total_cost_usd > 0
      ? Math.round((calc.base_cost_usd / calc.total_cost_usd) * 100)
      : 100;
  const reserveSharePercent = Math.max(0, 100 - baseSharePercent);

  return (
    <div className="space-y-6">
      {/* =====================================================================
       * TIER 1: DOMINANT FOCAL POINT — EXECUTIVE BUDGET HERO CARD
       * ===================================================================== */}
      <div className={`${heroCardClass} rounded-[18px] p-6 md:p-7`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left 7 Cols: Title, Status, and 3-Row Executive Summary */}
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
                className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-medium border ${
                  calc.is_complete
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
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
                  ? 'Seluruh angka di halaman ini dihitung otomatis dan sama persis dengan dokumen PDF yang akan Anda cetak.'
                  : 'All figures on this page are calculated automatically and match the PDF report you export.'}
              </p>
            </div>

            {/* Clean 2-Box Split for Base Cost vs Reserve Cost */}
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
            </div>

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

            <button
              type="button"
              onClick={() => setActiveTab('pdf')}
              className="vv-btn-accent w-full py-2.5 px-4 text-xs font-semibold"
            >
              <FileDown className="w-4 h-4" />
              <span>
                {isId
                  ? 'Pratinjau & Simpan Laporan PDF'
                  : 'Preview & Save PDF Report'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
       * TIER 2: SECONDARY SCANNING ZONE — UNIT ECONOMICS & VISUAL CATEGORY SHARE
       * ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 5 Cols: Rata-rata Biaya Hasil Akhir & Credit */}
        <div
          className={`${cardClass} lg:col-span-5 rounded-[16px] p-6 flex flex-col justify-between space-y-4`}
        >
          <div className="flex items-center justify-between border-b border-[var(--vv-border)] pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)] flex items-center gap-2">
              <Film className="w-4 h-4 text-[#0099ff]" />
              <span>
                {isId
                  ? 'Rata-rata Biaya Hasil Akhir & Credit'
                  : 'Average Output Costs & Credits'}
              </span>
            </h2>
          </div>

          <div className="space-y-3">
            <div className="vv-card-quiet p-3.5 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[var(--vv-text-primary)]">
                  {t.costPerVideo}
                </div>
                <div className="text-[11px] text-[var(--vv-text-muted)]">
                  {isId
                    ? `Target ${project.assumptions.target_videos} video jadi`
                    : `For ${project.assumptions.target_videos} final videos`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold tabular-nums text-[var(--vv-text-primary)]">
                  {formatCurrencyIdr(calc.cost_per_video_idr, language)}
                </div>
                <div className="text-xs text-[#0099ff] tabular-nums">
                  {formatCurrencyUsd(calc.cost_per_video_usd, language)}
                </div>
              </div>
            </div>

            <div className="vv-card-quiet p-3.5 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[var(--vv-text-primary)]">
                  {t.costPerMinute}
                </div>
                <div className="text-[11px] text-[var(--vv-text-muted)]">
                  {isId
                    ? `Total durasi ${project.assumptions.final_duration_minutes} menit`
                    : `For ${project.assumptions.final_duration_minutes} total min`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold tabular-nums text-[var(--vv-text-primary)]">
                  {formatCurrencyIdr(calc.cost_per_minute_idr, language)}
                </div>
                <div className="text-xs text-[#0099ff] tabular-nums">
                  {formatCurrencyUsd(calc.cost_per_minute_usd, language)}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-[12px] bg-[#0099ff]/10 border border-[#0099ff]/30 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#7acaff] flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5" />
                  <span>{t.totalCredit}</span>
                </div>
                <div className="text-[10px] text-[var(--vv-text-muted)] mt-0.5">
                  {isId
                    ? 'Poin pemakaian platform AI'
                    : 'Platform AI usage points'}
                </div>
              </div>
              <div className="text-lg font-bold tabular-nums text-[#7acaff]">
                {calc.total_credit !== null
                  ? `${calc.total_credit.toLocaleString()} Credits`
                  : t.unavailableLabel}
              </div>
            </div>
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
                      style={{ width: `${Math.max(pct, cSum.item_count > 0 ? 4 : 0)}%` }}
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
       * TIER 3: STREAMLINED 5-COLUMN STAGE SUMMARY + POPUP FOR FULL 10-COL AUDIT
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
                ? 'Menampilkan kolom utama agar mudah dibaca. Klik tombol di kanan untuk melihat rincian lengkap 10 kolom.'
                : 'Showing key columns for easy reading. Click the button on the right to inspect the full 10-column audit table.'}
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
                  {isId ? 'Total Kali Buat' : 'Total Tries'}
                </th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Total Biaya (USD)' : 'Total Cost (USD)'}
                </th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Total Biaya (Rupiah)' : 'Total Cost (IDR)'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--vv-border)]">
              {calc.item_results.map((row, idx) => (
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
                  <td className="py-3 text-right tabular-nums text-[var(--vv-text-muted)]">
                    <strong className="text-[var(--vv-text-primary)]">
                      {row.budgeted_generations}x
                    </strong>{' '}
                    <span className="text-[10px]">
                      ({row.planned_generations}+{row.reserve_generations})
                    </span>
                  </td>
                  <td className="py-3 text-right font-semibold tabular-nums">
                    {formatCurrencyUsd(row.total_cost_usd, language)}
                  </td>
                  <td className="py-3 text-right font-bold tabular-nums text-[#0099ff]">
                    {formatCurrencyIdr(row.total_cost_idr, language)}
                  </td>
                </tr>
              ))}
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
       * FROSTED GLASS MODAL: Tabel Rincian Audit 10 Kolom Lengkap
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
            ? 'Menampilkan pemisahan antara Biaya Utama, Biaya Cadangan, Pemakaian Credit, serta Status Verifikasi untuk setiap adegan.'
            : 'Displays the exact split between Base Cost, Reserve Cost, Credits, and Verification Status for every stage.'
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
                  {isId ? 'Kali Buat (Awal + Cadangan)' : 'Tries (Init + Res)'}
                </th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Biaya Utama' : 'Base Cost'}
                </th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Biaya Cadangan' : 'Reserve Cost'}
                </th>
                <th className="py-2.5 text-right font-medium">Total (USD)</th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Total (Rupiah)' : 'Total (IDR)'}
                </th>
                <th className="py-2.5 text-right font-medium">Credit</th>
                <th className="py-2.5 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--vv-border)]">
              {calc.item_results.map((row, idx) => (
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
                  <td className="py-3 text-right tabular-nums text-[var(--vv-text-muted)]">
                    {row.planned_generations} + {row.reserve_generations} ={' '}
                    <strong className="text-[var(--vv-text-primary)]">
                      {row.budgeted_generations}
                    </strong>
                  </td>
                  <td className="py-3 text-right tabular-nums">
                    {formatCurrencyUsd(row.base_cost_usd, language)}
                  </td>
                  <td className="py-3 text-right tabular-nums text-[#ffb840]">
                    {formatCurrencyUsd(row.reserve_cost_usd, language)}
                  </td>
                  <td className="py-3 text-right font-bold tabular-nums text-[#0099ff]">
                    {formatCurrencyUsd(row.total_cost_usd, language)}
                  </td>
                  <td className="py-3 text-right tabular-nums text-[var(--vv-text-strong)]">
                    {formatCurrencyIdr(row.total_cost_idr, language)}
                  </td>
                  <td className="py-3 text-right tabular-nums text-[#7acaff]">
                    {row.total_credit !== null ? `${row.total_credit} cr` : '-'}
                  </td>
                  <td className="py-3 text-center">
                    <StatusBadge
                      status={row.pricing_status}
                      language={language}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FrostedModal>
    </div>
  );
};
