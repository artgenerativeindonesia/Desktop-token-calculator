import React from 'react';
import {
  ExchangeRate,
  ProjectCalculation,
} from '../../../shared/types/project';
import { StatusBadge } from '../StatusBadge';
import { FrostedModal } from '../FrostedModal';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DataHealthCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  exchangeRate: ExchangeRate;
  calculation: ProjectCalculation;
}

export const DataHealthCheckModal: React.FC<DataHealthCheckModalProps> = ({
  isOpen,
  onClose,
  language,
  theme,
  exchangeRate,
  calculation: calc,
}) => {
  const isId = language === 'id';

  return (
    <FrostedModal
      isOpen={isOpen}
      onClose={onClose}
      theme={theme}
      maxWidth="lg"
      badgeLabel={isId ? 'Pemeriksaan Data' : 'Data Health Check'}
      title={
        isId ? (
          <>
            Status Kelengkapan Data &{' '}
            <span className="vv-accent text-[#0099ff]">Catatan Penting</span>
          </>
        ) : (
          <>
            Data Completeness &{' '}
            <span className="vv-accent text-[#0099ff]">Important Notes</span>
          </>
        )
      }
    >
      <div className="space-y-4 text-xs">
        <div className="vv-card-quiet p-4 flex items-center justify-between">
          <span className="text-[var(--vv-text-muted)]">
            {isId ? 'Status Kurs Dolar ke Rupiah:' : 'USD to IDR Rate Status:'}
          </span>
          <StatusBadge
            status={exchangeRate.status}
            language={language}
          />
        </div>

        {calc.warnings.length === 0 ? (
          <div className="flex items-center gap-2.5 text-xs vv-badge-emerald rounded-[12px] p-4">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              {isId
                ? 'Semua harga model AI dan kurs Rupiah sudah lengkap dan siap digunakan untuk laporan PDF.'
                : 'All AI model prices and exchange rates are complete and ready for PDF export.'}
            </span>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {calc.warnings.map((w, i) => (
              <li
                key={`${w.code}_${i}`}
                className={`p-3.5 rounded-[12px] border flex items-start gap-2.5 ${
                  w.severity === 'error'
                    ? 'bg-rose-500/10 border-rose-500/35 text-rose-700 dark:text-rose-300'
                    : w.severity === 'warning'
                    ? 'vv-badge-amber'
                    : 'bg-[#0099ff]/10 border-[#0099ff]/35 text-[#0066cc] dark:text-[#7acaff]'
                }`}
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{isId ? w.message_id : w.message_en}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </FrostedModal>
  );
};
