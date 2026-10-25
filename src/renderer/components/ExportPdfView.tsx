import React, { useMemo, useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import {
  buildSafePdfFilename,
  generatePdfReportHtml,
} from '../../shared/pdf/pdfReportBuilder';
import {
  formatCurrencyIdr,
  formatCurrencyUsd,
  UI_TEXT,
} from '../i18n/translations';
import { FrostedModal } from './FrostedModal';
import { StepFlowBar } from './StepFlowBar';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileDown,
  FileText,
  Maximize2,
  Sliders,
} from 'lucide-react';

export const ExportPdfView: React.FC = () => {
  const {
    project,
    language,
    theme,
    isExportingPdf,
    updateExportSettings,
    exportPdfReport,
  } = useProjectStore();

  const [confirmedIncomplete, setConfirmedIncomplete] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [isFullPreviewModalOpen, setIsFullPreviewModalOpen] = useState(false);

  const t = UI_TEXT[language];
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';
  const heroCardClass =
    theme === 'dark' ? 'vv-card-hero-dark' : 'vv-card-hero-light';
  const inputClass =
    theme === 'dark' ? 'glass-input-dark' : 'glass-input-light';
  const calc = project.calculation;

  const cadanganMultiplier =
    project.assumptions.default_attempts_per_shot ||
    project.assumptions.reserve_generations_override ||
    1;

  const totalSceneQuantity = project.items.reduce(
    (sum, item) => sum + Math.max(0, Math.floor(item.quantity)),
    0
  );

  const exportLang = project.export_settings?.export_language || language;
  const safeFileName = buildSafePdfFilename(
    project.project_name,
    project.export_settings?.export_date
  );

  const previewHtml = useMemo(() => {
    return generatePdfReportHtml(project, exportLang).html;
  }, [project, exportLang]);

  const canExport = calc.is_complete || confirmedIncomplete;
  const sections = project.export_settings.included_sections;

  const toggleSection = (key: keyof typeof sections) => {
    updateExportSettings({
      included_sections: {
        ...sections,
        [key]: !sections[key],
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* =====================================================================
       * TIER 1: DOMINANT FOCAL POINT — EXPORT STUDIO HERO & PRIMARY CTA
       * ===================================================================== */}
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
                    onClick={() =>
                      updateExportSettings({ export_language: 'id' })
                    }
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
                    onClick={() =>
                      updateExportSettings({ export_language: 'en' })
                    }
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
                      updateExportSettings({ report_title: e.target.value })
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
                      updateExportSettings({ export_date: e.target.value })
                    }
                    className={`${inputClass} w-full px-3.5 py-2 rounded-[10px] text-xs font-medium`}
                  />
                </div>
              </div>
            </div>

            {/* Readiness Banner / Incomplete Confirmation */}
            {!calc.is_complete ? (
              <div className="p-3.5 rounded-[12px] bg-amber-500/10 border border-amber-400/35 text-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4 text-[#ffb840] shrink-0" />
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
                    onChange={(e) => setConfirmedIncomplete(e.target.checked)}
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
                    {totalSceneQuantity} adegan &times; {cadanganMultiplier} cadangan ={' '}
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
                onClick={exportPdfReport}
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
                  onClick={() => setIsCustomizeModalOpen(true)}
                  className="vv-btn-secondary py-2 px-3 text-xs"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#0099ff]" />
                  <span>
                    {isId ? 'Atur Isi Laporan' : 'Customize Sections'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsFullPreviewModalOpen(true)}
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

      {/* =====================================================================
       * TIER 2: PROPORTIONAL STUDIO A4 DOCUMENT PREVIEW
       * ===================================================================== */}
      <div className={`${cardClass} rounded-[16px] p-5 space-y-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)]">
            <Eye className="w-4 h-4 text-[#0099ff]" />
            <span>
              {isId
                ? 'Pratinjau Dokumen Laporan PDF (Ukuran Kertas A4)'
                : 'Live PDF Report Preview (A4 Paper Size)'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsFullPreviewModalOpen(true)}
            className="text-xs font-medium text-[#0099ff] hover:underline inline-flex items-center gap-1"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>
              {isId
                ? 'Buka Pratinjau di Jendela Besar'
                : 'Open Large Preview Window'}
            </span>
          </button>
        </div>

        <div className="rounded-[12px] overflow-hidden border border-[var(--vv-border-strong)] bg-white shadow-2xl">
          <iframe
            title="PDF Report Live Preview"
            srcDoc={previewHtml}
            className="w-full h-[460px] border-0"
          />
        </div>
      </div>

      {/* Guided Step Flow Footer */}
      <StepFlowBar
        currentStepNumber={5}
        stepTitle={t.navExportPdf}
        nextStepHint={
          isId
            ? 'Semua langkah perencanaan selesai! Klik tombol di kanan untuk menyimpan laporan resmi PDF ke komputer Anda.'
            : 'All planning steps complete! Click the button on the right to save the official PDF report to your computer.'
        }
        prevTab="summary"
        prevLabel={t.navSummary}
        onNextCustom={canExport ? exportPdfReport : undefined}
        nextLabel={t.btnExportPdf}
      />

      {/* =====================================================================
       * FROSTED GLASS MODAL 1: Atur Isi Laporan & Nama Klien / Penyusun
       * ===================================================================== */}
      <FrostedModal
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
        theme={theme}
        maxWidth="lg"
        badgeLabel={isId ? 'Kustomisasi Dokumen PDF' : 'PDF Document Options'}
        title={
          isId ? (
            <>
              Atur Informasi Klien &{' '}
              <span className="vv-accent text-[#0099ff]">
                Bagian yang Dicetak
              </span>
            </>
          ) : (
            <>
              Configure Client Info &{' '}
              <span className="vv-accent text-[#0099ff]">
                Included Sections
              </span>
            </>
          )
        }
        subtitle={
          isId
            ? 'Pilih bagian mana saja yang ingin Anda tampilkan di dalam dokumen laporan PDF.'
            : 'Choose which sections appear in your exported PDF report.'
        }
        footer={
          <button
            type="button"
            onClick={() => setIsCustomizeModalOpen(false)}
            className="vv-btn-primary px-5 py-2 text-xs ml-auto"
          >
            {isId ? 'Selesai & Terapkan ke Pratinjau' : 'Done & Apply to Preview'}
          </button>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-medium text-[var(--vv-text-muted)] mb-1">
                {isId ? 'Disusun Oleh (Nama Anda)' : 'Prepared By'}
              </label>
              <input
                type="text"
                value={project.export_settings.prepared_by || ''}
                onChange={(e) =>
                  updateExportSettings({ prepared_by: e.target.value })
                }
                placeholder={isId ? 'Misal: Produser Video AI' : 'e.g., AI Producer'}
                className={`${inputClass} w-full px-3 py-2 rounded-[9px] text-xs font-medium`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[var(--vv-text-muted)] mb-1">
                {isId ? 'Nama Klien / Tim Produksi' : 'Client / Team Name'}
              </label>
              <input
                type="text"
                value={project.export_settings.client_or_team_name || ''}
                onChange={(e) =>
                  updateExportSettings({ client_or_team_name: e.target.value })
                }
                placeholder={isId ? 'Misal: Tim Kreatif' : 'e.g., Creative Team'}
                className={`${inputClass} w-full px-3 py-2 rounded-[9px] text-xs font-medium`}
              />
            </div>
          </div>

          <div className="vv-card-quiet p-4 space-y-2.5">
            <div className="font-semibold text-[var(--vv-text-strong)] mb-1">
              {isId
                ? 'Centang Bagian yang Ingin Ditampilkan di PDF:'
                : 'Select Sections to Include in PDF:'}
            </div>
            {(
              [
                {
                  key: 'executive_summary',
                  label: isId
                    ? '1. Ringkasan Utama Anggaran (Total Rupiah & USD)'
                    : '1. Executive Budget Summary (Total IDR & USD)',
                },
                {
                  key: 'production_assumptions',
                  label: isId
                    ? '2. Pengaturan Proyek & Cadangan Langkah 2'
                    : '2. Project Settings & Step 2 Reserve Factor',
                },
                {
                  key: 'stage_breakdown',
                  label: isId
                    ? '3. Tabel Rincian Kebutuhan & Cadangan per Adegan'
                    : '3. Scene Requirements & Reserve Breakdown Table',
                },
                {
                  key: 'credit_breakdown',
                  label: isId
                    ? '4. Rincian Pemakaian Poin Credit Platform AI'
                    : '4. AI Platform Credit Usage Breakdown',
                },
                {
                  key: 'exchange_rate_info',
                  label: isId
                    ? '5. Informasi Nilai Kurs Dolar ke Rupiah'
                    : '5. USD to IDR Exchange Rate Source Info',
                },
                {
                  key: 'unit_cost_metrics',
                  label: isId
                    ? '6. Ringkasan Total Anggaran & Total Kali Buat'
                    : '6. Total Budget & Total Generations Summary',
                },
                {
                  key: 'warnings_and_audit',
                  label: isId
                    ? '7. Catatan Kelengkapan Data & Status Harga'
                    : '7. Data Completeness & Price Verification Notes',
                },
              ] as const
            ).map((sec) => (
              <label
                key={sec.key}
                className="flex items-center gap-2.5 cursor-pointer py-1"
              >
                <input
                  type="checkbox"
                  checked={sections[sec.key]}
                  onChange={() => toggleSection(sec.key)}
                  className="rounded accent-[#0099ff]"
                />
                <span className="text-[var(--vv-text-primary)]">
                  {sec.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </FrostedModal>

      {/* =====================================================================
       * FROSTED GLASS MODAL 2: Pratinjau Dokumen PDF Layar Penuh
       * ===================================================================== */}
      <FrostedModal
        isOpen={isFullPreviewModalOpen}
        onClose={() => setIsFullPreviewModalOpen(false)}
        theme={theme}
        maxWidth="4xl"
        badgeLabel={safeFileName}
        title={
          isId ? (
            <>
              Pratinjau Penuh{' '}
              <span className="vv-accent text-[#0099ff]">
                Dokumen Laporan PDF
              </span>
            </>
          ) : (
            <>
              Full-Screen{' '}
              <span className="vv-accent text-[#0099ff]">
                PDF Document Preview
              </span>
            </>
          )
        }
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsFullPreviewModalOpen(false)}
              className="vv-btn-secondary px-4 py-2 text-xs"
            >
              {isId ? 'Tutup Pratinjau' : 'Close Preview'}
            </button>
            <button
              type="button"
              disabled={!canExport || isExportingPdf}
              onClick={() => {
                exportPdfReport();
                setIsFullPreviewModalOpen(false);
              }}
              className="vv-btn-accent px-5 py-2 text-xs font-semibold"
            >
              <FileDown className="w-4 h-4" />
              <span>{t.btnExportPdf}</span>
            </button>
          </>
        }
      >
        <div className="rounded-[12px] overflow-hidden border border-[var(--vv-border-strong)] bg-white">
          <iframe
            title="Full PDF Preview"
            srcDoc={previewHtml}
            className="w-full h-[68vh] border-0"
          />
        </div>
      </FrostedModal>
    </div>
  );
};
