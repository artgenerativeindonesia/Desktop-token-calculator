import React from 'react';
import {
  ALL_PROCESS_CATEGORIES,
  ProcessCategory,
  ProjectCalculation,
} from '../../../shared/types/project';
import {
  formatCurrencyIdr,
  formatCurrencyUsd,
  SHORT_CATEGORY_LABELS,
} from '../../i18n/translations';
import { AlertTriangle, Eye, ShieldCheck } from 'lucide-react';

interface DashboardCategoryDistributionProps {
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  calculation: ProjectCalculation;
  onOpenCategoryModal: () => void;
  onOpenStatusModal: () => void;
}

export const DashboardCategoryDistribution: React.FC<DashboardCategoryDistributionProps> = ({
  language,
  theme,
  calculation: calc,
  onOpenCategoryModal,
  onOpenStatusModal,
}) => {
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';
  const categories: ProcessCategory[] = ALL_PROCESS_CATEGORIES;

  return (
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
            onClick={onOpenCategoryModal}
            className="vv-btn-secondary px-3.5 py-2 text-xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#0099ff]" />
            <span>
              {isId ? 'Tabel Rincian Kategori' : 'Category Breakdown Table'}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenStatusModal}
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

      {/* Category Bento Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
        {categories.map((cat) => {
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
  );
};
