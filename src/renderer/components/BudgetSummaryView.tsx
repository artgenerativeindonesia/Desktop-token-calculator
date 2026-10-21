import React from 'react';
import { useProjectStore } from '../store/projectStore';
import {
  CATEGORY_LABELS,
  formatCurrencyIdr,
  formatCurrencyUsd,
  UI_TEXT,
} from '../i18n/translations';
import { StatusBadge } from './StatusBadge';
import { ProcessCategory } from '../../shared/types/project';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Coins,
  FileDown,
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
  const t = UI_TEXT[language];
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';
  const calc = project.calculation;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${cardClass} rounded-[16px] p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="vv-badge-pill">
              <BarChart3 className="w-3.5 h-3.5 text-[#0099ff]" />
              <span>{isId ? 'Rekapitulasi Anggaran' : 'Budget Breakdown'}</span>
            </span>
          </div>
          <h1 className="text-2xl font-medium tracking-[-0.035em]">
            {isId ? (
              <>
                Ringkasan Lengkap{' '}
                <span className="vv-accent text-[#0099ff]">Biaya Produksi</span>
              </>
            ) : (
              <>
                Complete Production{' '}
                <span className="vv-accent text-[#0099ff]">Cost Summary</span>
              </>
            )}
          </h1>
          <p className="text-xs text-[var(--vv-text-muted)] mt-1">
            {isId
              ? 'Seluruh rincian biaya di halaman ini dihitung secara otomatis dan sama persis dengan laporan PDF yang akan Anda simpan.'
              : 'All cost details on this page are calculated automatically and match the PDF report you save.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
              calc.is_complete
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
            }`}
          >
            {calc.is_complete ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            {calc.is_complete ? t.completeEstimate : t.incompleteEstimate}
          </span>

          <button
            onClick={() => setActiveTab('pdf')}
            className="vv-btn-accent px-4 py-2 text-xs"
          >
            <FileDown className="w-4 h-4" />
            <span>{t.btnExportPdf}</span>
          </button>
        </div>
      </div>

      {/* Tabel Rekapitulasi Total Anggaran (USD & IDR Rata Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${cardClass} rounded-[16px] p-6 lg:col-span-2`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-mono tabular-nums text-[var(--vv-text-subtle)]">01</span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)]">
              {isId
                ? 'Rekapitulasi Anggaran Utama (Dolar USD & Rupiah)'
                : 'Primary Budget Summary (USD & IDR)'}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--vv-border)] text-[var(--vv-text-muted)]">
                  <th className="py-2.5 text-left font-medium">
                    {isId ? 'Komponen Biaya' : 'Cost Component'}
                  </th>
                  <th className="py-2.5 text-right font-medium">
                    {isId ? 'Jumlah Kali Buat' : 'Generations'}
                  </th>
                  <th className="py-2.5 text-right font-medium">USD</th>
                  <th className="py-2.5 text-right font-medium">IDR (Rupiah)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--vv-border)]">
                <tr>
                  <td className="py-3.5 font-medium">
                    {t.baseCost}
                  </td>
                  <td className="py-3.5 text-right tabular-nums text-[var(--vv-text-muted)]">
                    {calc.planned_generations}
                  </td>
                  <td className="py-3.5 text-right font-semibold tabular-nums">
                    {formatCurrencyUsd(calc.base_cost_usd, language)}
                  </td>
                  <td className="py-3.5 text-right tabular-nums text-[var(--vv-text-muted)]">
                    {formatCurrencyIdr(calc.base_cost_idr, language)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 font-medium text-[#ffb840]">
                    {t.reserveCost} ({calc.effective_reserve_percent}%)
                  </td>
                  <td className="py-3.5 text-right tabular-nums text-[#ffb840]">
                    +{calc.reserve_generations}
                  </td>
                  <td className="py-3.5 text-right font-semibold tabular-nums text-[#ffb840]">
                    {formatCurrencyUsd(calc.reserve_cost_usd, language)}
                  </td>
                  <td className="py-3.5 text-right tabular-nums text-[#ffb840]">
                    {formatCurrencyIdr(calc.reserve_cost_idr, language)}
                  </td>
                </tr>
                <tr className="bg-[#0099ff]/10 font-bold text-sm">
                  <td className="py-3.5 px-2 text-[#0099ff]">
                    {t.totalBudget}
                  </td>
                  <td className="py-3.5 text-right tabular-nums">
                    {calc.budgeted_generations}
                  </td>
                  <td className="py-3.5 text-right tabular-nums text-[#0099ff]">
                    {formatCurrencyUsd(calc.total_cost_usd, language)}
                  </td>
                  <td className="py-3.5 px-2 text-right tabular-nums text-[#0099ff]">
                    {formatCurrencyIdr(calc.total_cost_idr, language)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Metrik Biaya Unit Final & Total Credit */}
        <div className={`${cardClass} rounded-[16px] p-6 space-y-4`}>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tabular-nums text-[var(--vv-text-subtle)]">02</span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)]">
              {isId
                ? 'Rata-rata Biaya Hasil Akhir & Credit'
                : 'Average Output Costs & Credits'}
            </h2>
          </div>

          <div className="p-3.5 rounded-[12px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border)]">
            <div className="text-[11px] text-[var(--vv-text-muted)]">
              {t.costPerVideo}{' '}
              ({isId
                ? `untuk ${project.assumptions.target_videos} video jadi`
                : `for ${project.assumptions.target_videos} final videos`})
            </div>
            <div className="text-lg font-bold tabular-nums text-right mt-1">
              {formatCurrencyUsd(calc.cost_per_video_usd, language)}
            </div>
            <div className="text-xs text-[var(--vv-text-muted)] tabular-nums text-right">
              {formatCurrencyIdr(calc.cost_per_video_idr, language)}
            </div>
          </div>

          <div className="p-3.5 rounded-[12px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border)]">
            <div className="text-[11px] text-[var(--vv-text-muted)]">
              {t.costPerMinute}{' '}
              ({isId
                ? `untuk total ${project.assumptions.final_duration_minutes} menit`
                : `for ${project.assumptions.final_duration_minutes} total min`})
            </div>
            <div className="text-lg font-bold tabular-nums text-right mt-1">
              {formatCurrencyUsd(calc.cost_per_minute_usd, language)}
            </div>
            <div className="text-xs text-[var(--vv-text-muted)] tabular-nums text-right">
              {formatCurrencyIdr(calc.cost_per_minute_idr, language)}
            </div>
          </div>

          <div className="p-3.5 rounded-[12px] bg-[#0099ff]/10 border border-[#0099ff]/30">
            <div className="flex items-center justify-between text-[11px] text-[#7acaff]">
              <span>{t.totalCredit}</span>
              <Coins className="w-3.5 h-3.5" />
            </div>
            <div className="text-lg font-bold tabular-nums text-right text-[#7acaff] mt-1">
              {calc.total_credit !== null
                ? `${calc.total_credit.toLocaleString()} Credits`
                : t.unavailableLabel}
            </div>
            <div className="text-[10px] text-[var(--vv-text-muted)] mt-1">
              {isId
                ? 'Credit adalah poin pemakaian di platform AI (dihitung terpisah dari harga Dolar/Rupiah).'
                : 'Credits represent platform usage points (tracked separately from USD/IDR costs).'}
            </div>
          </div>
        </div>
      </div>

      {/* Rincian per Baris Pekerjaan */}
      <div className={`${cardClass} rounded-[16px] p-6`}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-mono tabular-nums text-[var(--vv-text-subtle)]">03</span>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)]">
            {isId
              ? 'Rincian Biaya untuk Setiap Tahap Pekerjaan'
              : 'Cost Breakdown for Each Production Stage'}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--vv-border)] text-[var(--vv-text-muted)]">
                <th className="py-2.5 text-left font-medium">#</th>
                <th className="py-2.5 text-left font-medium">{isId ? 'Nama Adegan / Tahap' : 'Scene / Stage Name'}</th>
                <th className="py-2.5 text-left font-medium">{isId ? 'Model & Jenis AI' : 'Model & AI Type'}</th>
                <th className="py-2.5 text-right font-medium">{isId ? 'Kali Buat (Awal + Cadangan)' : 'Tries (Initial + Reserve)'}</th>
                <th className="py-2.5 text-right font-medium">{isId ? 'Biaya Utama' : 'Base Cost'}</th>
                <th className="py-2.5 text-right font-medium">{isId ? 'Biaya Cadangan' : 'Reserve Cost'}</th>
                <th className="py-2.5 text-right font-medium">{isId ? 'Total (USD)' : 'Total (USD)'}</th>
                <th className="py-2.5 text-right font-medium">{isId ? 'Total (Rupiah)' : 'Total (IDR)'}</th>
                <th className="py-2.5 text-right font-medium">Credit</th>
                <th className="py-2.5 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--vv-border)]">
              {calc.item_results.map((row, idx) => (
                <tr key={row.item_id} className="hover:bg-[var(--vv-tint-weak)] transition-colors">
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
                    <strong className="text-[var(--vv-text-primary)]">{row.budgeted_generations}</strong>
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
                  <td className="py-3 text-right tabular-nums text-[var(--vv-text-muted)]">
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
      </div>

      {/* Ringkasan per Kategori */}
      <div className={`${cardClass} rounded-[16px] p-6`}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-mono tabular-nums text-[var(--vv-text-subtle)]">04</span>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)]">
            {isId
              ? 'Subtotal per Jenis Pembuatan AI'
              : 'Subtotals by AI Creation Type'}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {ALL_CATEGORIES.map((cat) => {
            const cSum = calc.category_summaries[cat];
            return (
              <div
                key={cat}
                className="p-3.5 rounded-[12px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border)] flex flex-col justify-between"
              >
                <div className="text-xs font-semibold">
                  {CATEGORY_LABELS[cat][language]}
                </div>
                <div className="mt-3 text-right">
                  <div className="text-base font-bold tabular-nums text-[#0099ff]">
                    {formatCurrencyUsd(cSum.total_cost_usd, language)}
                  </div>
                  <div className="text-[11px] text-[var(--vv-text-muted)] tabular-nums">
                    {formatCurrencyIdr(cSum.total_cost_idr, language)}
                  </div>
                  <div className="text-[10px] text-[var(--vv-text-subtle)] mt-1 tabular-nums">
                    {cSum.item_count} tahap &bull; {cSum.budgeted_generations}x buat
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
