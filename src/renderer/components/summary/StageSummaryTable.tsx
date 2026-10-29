import React, { useState } from 'react';
import { ProjectCalculation, ProjectFile } from '../../../shared/types/project';
import {
  CATEGORY_LABELS,
  formatCurrencyIdr,
  formatCurrencyUsd,
  SHORT_CATEGORY_LABELS,
} from '../../i18n/translations';
import { StatusBadge } from '../StatusBadge';
import { FrostedModal } from '../FrostedModal';
import { Eye } from 'lucide-react';

interface StageSummaryTableProps {
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  project: ProjectFile;
  calculation: ProjectCalculation;
}

export const StageSummaryTable: React.FC<StageSummaryTableProps> = ({
  language,
  theme,
  project,
  calculation: calc,
}) => {
  const [isFullAuditModalOpen, setIsFullAuditModalOpen] = useState(false);
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';

  const cadanganMultiplier =
    project.assumptions.default_attempts_per_shot ||
    project.assumptions.reserve_generations_override ||
    1;

  return (
    <>
      {/* Tier 3: Streamlined Stage Summary */}
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
                ? 'Menampilkan kebutuhan shot/gambar dan perkalian cadangan tiap tahap.'
                : 'Showing shot/image requirements and reserve multiplier per stage.'}
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
                  {isId ? 'Nama Shot / Tahap' : 'Shot / Stage Name'}
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

      {/* Frosted Glass Modal: Tabel Rincian Audit Lengkap per Adegan */}
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
                Cadangan per Shot / Gambar
              </span>
            </>
          ) : (
            <>
              Detailed Cost &{' '}
              <span className="vv-accent text-[#0099ff]">
                Reserve Table per Shot
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
                  {isId ? 'Nama Shot / Tahap' : 'Shot / Stage Name'}
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
    </>
  );
};
