import React from 'react';
import {
  ALL_PROCESS_CATEGORIES,
  ProcessCategory,
  ProjectCalculation,
} from '../../../shared/types/project';
import {
  CATEGORY_LABELS,
  formatCurrencyIdr,
  formatCurrencyUsd,
} from '../../i18n/translations';
import { FrostedModal } from '../FrostedModal';
import { ArrowRight } from 'lucide-react';

interface CategoryBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  calculation: ProjectCalculation;
  onNavigateToPlanner: () => void;
}

export const CategoryBreakdownModal: React.FC<CategoryBreakdownModalProps> = ({
  isOpen,
  onClose,
  language,
  theme,
  calculation: calc,
  onNavigateToPlanner,
}) => {
  const isId = language === 'id';
  const categories: ProcessCategory[] = ALL_PROCESS_CATEGORIES;

  return (
    <FrostedModal
      isOpen={isOpen}
      onClose={onClose}
      theme={theme}
      maxWidth="2xl"
      badgeLabel={isId ? 'Rincian Kategori AI' : 'Category Breakdown'}
      title={
        isId ? (
          <>
            Tabel Biaya per{' '}
            <span className="vv-accent text-[#0099ff]">Jenis Pembuatan AI</span>
          </>
        ) : (
          <>
            Cost Table by{' '}
            <span className="vv-accent text-[#0099ff]">AI Creation Type</span>
          </>
        )
      }
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="vv-btn-secondary px-4 py-2 text-xs"
          >
            {isId ? 'Tutup' : 'Close'}
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateToPlanner();
            }}
            className="vv-btn-accent px-4 py-2 text-xs"
          >
            <span>
              {isId ? 'Atur Daftar Pekerjaan AI' : 'Edit Production List'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--vv-border)] text-[var(--vv-text-muted)]">
              <th className="py-2.5 text-left font-medium">
                {isId ? 'Jenis Pembuatan AI' : 'AI Creation Type'}
              </th>
              <th className="py-2.5 text-right font-medium">
                {isId ? 'Jumlah Tahap' : 'Stages'}
              </th>
              <th className="py-2.5 text-right font-medium">
                {isId ? 'Total Kali Buat' : 'Total Tries'}
              </th>
              <th className="py-2.5 text-right font-medium">Subtotal (USD)</th>
              <th className="py-2.5 text-right font-medium">
                {isId ? 'Subtotal (Rupiah)' : 'Subtotal (IDR)'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--vv-border)]">
            {categories.map((cat) => {
              const sum = calc.category_summaries[cat];
              return (
                <tr
                  key={cat}
                  className="hover:bg-[var(--vv-tint-weak)] transition-colors"
                >
                  <td className="py-3 font-medium">
                    {CATEGORY_LABELS[cat][language]}
                    {sum.has_incomplete_items && (
                      <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                        {isId ? 'Belum Diisi' : 'Incomplete'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right tabular-nums text-[var(--vv-text-muted)]">
                    {sum.item_count}
                  </td>
                  <td className="py-3 text-right tabular-nums text-[var(--vv-text-muted)]">
                    {sum.budgeted_generations}
                  </td>
                  <td className="py-3 text-right font-semibold tabular-nums">
                    {formatCurrencyUsd(sum.total_cost_usd, language)}
                  </td>
                  <td className="py-3 text-right text-[#0099ff] font-semibold tabular-nums">
                    {formatCurrencyIdr(sum.total_cost_idr, language)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </FrostedModal>
  );
};
