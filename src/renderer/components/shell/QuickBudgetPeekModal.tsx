import React from 'react';
import { useProjectStore } from '../../store/projectStore';
import {
  formatCurrencyIdr,
  formatCurrencyUsd,
  UI_TEXT,
} from '../../i18n/translations';
import { FrostedModal } from '../FrostedModal';
import { ArrowRight } from 'lucide-react';

interface QuickBudgetPeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSummary: () => void;
}

export const QuickBudgetPeekModal: React.FC<QuickBudgetPeekModalProps> = ({
  isOpen,
  onClose,
  onOpenSummary,
}) => {
  const { project, language, theme } = useProjectStore();

  const isId = language === 'id';
  const t = UI_TEXT[language];
  const calc = project.calculation;

  return (
    <FrostedModal
      isOpen={isOpen}
      onClose={onClose}
      theme={theme}
      maxWidth="lg"
      badgeLabel={isId ? 'Ringkasan Cepat' : 'Live Budget Peek'}
      title={
        isId ? (
          <>
            Posisi Anggaran{' '}
            <span className="vv-accent text-[#0099ff]">Saat Ini</span>
          </>
        ) : (
          <>
            Current Budget{' '}
            <span className="vv-accent text-[#0099ff]">Snapshot</span>
          </>
        )
      }
      subtitle={project.project_name}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="vv-btn-secondary px-4 py-2 text-xs"
          >
            <span>{isId ? 'Tutup' : 'Close'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSummary();
            }}
            className="vv-btn-accent px-4 py-2 text-xs"
          >
            <span>{isId ? 'Buka Halaman Ringkasan Biaya' : 'Open Cost Summary'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        <div className="p-4 rounded-[14px] bg-[#0099ff]/10 border border-[#0099ff]/35 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#0066cc] dark:text-[#7acaff] font-semibold">
              {t.totalBudget}
            </div>
            <div className="text-[11px] text-[var(--vv-text-muted)] mt-0.5">
              {calc.budgeted_generations} {isId ? 'total kali pembuatan AI' : 'total AI generations'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold tabular-nums text-[#0099ff]">
              {formatCurrencyIdr(calc.total_cost_idr, language)}
            </div>
            <div className="text-sm font-semibold tabular-nums text-[var(--vv-text-primary)]">
              {formatCurrencyUsd(calc.total_cost_usd, language)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="vv-card-quiet p-3.5">
            <div className="text-[11px] text-[var(--vv-text-muted)]">
              {isId ? 'Rumus Kali Buat AI' : 'AI Generation Formula'}
            </div>
            <div className="text-sm font-bold tabular-nums text-right mt-1">
              {calc.budgeted_generations}x {isId ? 'kali buat' : 'generations'}
            </div>
            <div className="text-[11px] text-[var(--vv-text-muted)] tabular-nums text-right">
              {calc.item_results.reduce((s, r) => s + r.effective_quantity, 0)}{' '}
              {isId ? 'shot/gambar' : 'shots/images'} &times;{' '}
              {project.assumptions.default_attempts_per_shot || 1}{' '}
              {isId ? 'cadangan' : 'reserve'}
            </div>
          </div>

          <div className="vv-card-quiet p-3.5">
            <div className="text-[11px] vv-text-amber font-semibold">
              {t.costPerVideo}
            </div>
            <div className="text-sm font-bold tabular-nums vv-text-amber text-right mt-1">
              {formatCurrencyIdr(calc.cost_per_video_idr, language)}
            </div>
            <div className="text-[11px] text-[var(--vv-text-muted)] tabular-nums text-right">
              {formatCurrencyUsd(calc.cost_per_video_usd, language)} / video
            </div>
          </div>
        </div>

        <div className="vv-card-quiet p-3.5 flex items-center justify-between">
          <span className="text-[var(--vv-text-muted)]">{t.totalCredit}</span>
          <span className="font-bold tabular-nums text-[#0066cc] dark:text-[#7acaff]">
            {calc.total_credit !== null
              ? `${calc.total_credit.toLocaleString()} Credits`
              : t.unavailableLabel}
          </span>
        </div>
      </div>
    </FrostedModal>
  );
};
