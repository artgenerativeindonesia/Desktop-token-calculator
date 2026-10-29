import React from 'react';
import { ProjectCalculation, ProjectFile } from '../../../shared/types/project';
import {
  formatCurrencyIdr,
  formatCurrencyUsd,
  UI_TEXT,
} from '../../i18n/translations';
import {
  AlertTriangle,
  CheckCircle2,
  FileDown,
  FileText,
  Maximize2,
  Sliders,
} from 'lucide-react';

interface ExportHeroActionCardProps {
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  project: ProjectFile;
  calculation: ProjectCalculation;
  exportLang: 'id' | 'en';
  safeFileName: string;
  confirmedIncomplete: boolean;
  canExport: boolean;
  isExportingPdf: boolean;
  onUpdateExportSettings: (settings: Partial<ProjectFile['export_settings']>) => void;
  onSetConfirmedIncomplete: (confirmed: boolean) => void;
  onExportPdf: () => void;
  onOpenCustomizeModal: () => void;
  onOpenFullPreviewModal: () => void;
}

export const ExportHeroActionCard: React.FC<ExportHeroActionCardProps> = ({
  language,
  theme,
  project,
  calculation: calc,
  exportLang,
  safeFileName,
  confirmedIncomplete,
  canExport,
  isExportingPdf,
  onUpdateExportSettings,
  onSetConfirmedIncomplete,
  onExportPdf,
  onOpenCustomizeModal,
  onOpenFullPreviewModal,
}) => {
  const isId = language === 'id';
  const t = UI_TEXT[language];
  const heroCardClass =
    theme === 'dark' ? 'vv-card-hero-dark' : 'vv-card-hero-light';
  const inputClass =
    theme === 'dark' ? 'glass-input-dark' : 'glass-input-light';

  const cadanganMultiplier =
    project.assumptions.default_attempts_per_shot ||
    project.assumptions.reserve_generations_override ||
    1;

  const totalSceneQuantity = project.items.reduce(
    (sum, item) => sum + Math.max(0, Math.floor(item.quantity)),
    0
  );

  return (
    <div className={`${heroCardClass} rounded-[18px] p-6 md:p-7`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 7 Cols: Title, Basic Settings, & Readiness Status */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="vv-badge-pill">
                <FileText className="w-3.5 h-3.5 text-[#0099ff]" />
                <span>
                  {isId
                    ? 'Langkah 05 • Dokumen Siap Cetak'
                    : 'Step 05 • Print-Ready Document'}
                </span>
              </span>

              {/* Language Switch for PDF */}
              <div className="flex items-center p-0.5 rounded-full bg-[var(--vv-field)] border border-[var(--vv-border)] text-[11px]">
                <button
                  type="button"
                  onClick={() => onUpdateExportSettings({ export_language: 'id' })}
                  className={`px-2.5 py-0.5 rounded-full font-medium transition ${
                    exportLang === 'id'
                      ? 'bg-[#0068ad] text-white'
                      : 'text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)]'
                  }`}
                >
                  PDF Indonesia
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateExportSettings({ export_language: 'en' })}
                  className={`px-2.5 py-0.5 rounded-full font-medium transition ${
                    exportLang === 'en'
                      ? 'bg-[#0068ad] text-white'
                      : 'text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)]'
                  }`}
                >
                  PDF English
                </button>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-medium tracking-[-0.035em]">
              {isId ? (
                <>
                  Pratinjau &{' '}
                  <span className="vv-accent text-[#0099ff]">
                    Simpan Laporan PDF
                  </span>
                </>
              ) : (
                <>
                  Preview &{' '}
                  <span className="vv-accent text-[#0099ff]">
                    Save PDF Report
                  </span>
                </>
              )}
            </h1>

            {/* Clean 2-Column Title & Date Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-[var(--vv-text-muted)] mb-1">
                  {isId ? 'Judul Laporan di PDF' : 'Report Title in PDF'}
                </label>
                <input
                  type="text"
                  value={project.export_settings.report_title}
                  onChange={(e) =>
                    onUpdateExportSettings({ report_title: e.target.value })
                  }
                  className={`${inputClass} w-full px-3.5 py-2 rounded-[10px] text-xs font-medium`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[var(--vv-text-muted)] mb-1">
                  {isId ? 'Tanggal Laporan' : 'Report Date'}
                </label>
                <input
                  type="date"
                  value={project.export_settings.export_date}
                  onChange={(e) =>
                    onUpdateExportSettings({ export_date: e.target.value })
                  }
                  className={`${inputClass} w-full px-3.5 py-2 rounded-[10px] text-xs font-medium`}
                />
              </div>
            </div>
          </div>

          {/* Readiness Banner / Incomplete Confirmation */}
          {!calc.is_complete ? (
            <div className="p-3.5 rounded-[12px] border vv-badge-amber text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  {isId
                    ? 'Perhatian: Masih ada harga model atau kurs yang belum terisi lengkap.'
                    : 'Note: Some model prices or exchange rates are not yet filled in.'}
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedIncomplete}
                  onChange={(e) => onSetConfirmedIncomplete(e.target.checked)}
                  className="rounded accent-[#ffb840]"
                />
                <span>
                  {isId
                    ? 'Saya mengerti dan tetap ingin menyimpan laporan PDF ini.'
                    : 'I understand and wish to save this PDF report anyway.'}
                </span>
              </label>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 text-xs vv-badge-emerald rounded-[12px] p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {isId
                    ? 'Seluruh hitungan sudah lengkap dan siap disimpan menjadi dokumen PDF.'
                    : 'All calculations are complete and ready to be saved as a PDF.'}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[var(--vv-text-muted)] truncate max-w-[200px]">
                {safeFileName}
              </span>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Dominant Primary Export Action Box */}
        <div className="lg:col-span-5 p-5 rounded-[16px] bg-[var(--vv-tint-weak)] border border-[#0099ff]/35 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#7acaff] font-semibold">
              <span>
                {isId ? 'Nilai Total di Laporan PDF' : 'Total in PDF Report'}
              </span>
              <span>A4 Portrait</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold tabular-nums text-[var(--vv-text-primary)] text-right mt-2">
              {formatCurrencyIdr(calc.total_cost_idr, language)}
            </div>
            <div className="text-sm font-semibold tabular-nums text-[#0099ff] text-right mt-0.5">
              {formatCurrencyUsd(calc.total_cost_usd, language)}
            </div>
            <div className="text-[11px] font-medium text-[var(--vv-text-muted)] text-right mt-1">
              {isId ? (
                <span>
                  {totalSceneQuantity} shot/gambar &times; {cadanganMultiplier} cadangan ={' '}
                  <strong className="text-[var(--vv-text-strong)]">
                    {calc.budgeted_generations} kali buat
                  </strong>
                </span>
              ) : (
                <span>
                  {totalSceneQuantity} scenes &times; {cadanganMultiplier} reserve ={' '}
                  <strong className="text-[var(--vv-text-strong)]">
                    {calc.budgeted_generations} tries
                  </strong>
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              disabled={!canExport || isExportingPdf}
              onClick={onExportPdf}
              className={`w-full py-3 px-5 text-xs font-semibold ${
                canExport
                  ? 'vv-btn-accent'
                  : 'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--vv-tint-weak)] text-[var(--vv-text-subtle)] border border-[var(--vv-border)] cursor-not-allowed'
              }`}
            >
              <FileDown className="w-4 h-4" />
              <span>
                {isExportingPdf
                  ? isId
                    ? 'Menyimpan Dokumen PDF...'
                    : 'Saving PDF Document...'
                  : t.btnExportPdf}
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onOpenCustomizeModal}
                className="vv-btn-secondary py-2 px-3 text-xs"
              >
                <Sliders className="w-3.5 h-3.5 text-[#0099ff]" />
                <span>
                  {isId ? 'Atur Isi Laporan' : 'Customize Sections'}
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenFullPreviewModal}
                className="vv-btn-secondary py-2 px-3 text-xs"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#ffb840]" />
                <span>
                  {isId ? 'Perbesar Pratinjau' : 'Full-Screen Preview'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
