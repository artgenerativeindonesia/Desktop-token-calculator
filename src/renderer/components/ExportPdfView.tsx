import React, { useMemo, useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import {
  buildSafePdfFilename,
  generatePdfReportHtml,
} from '../../shared/pdf/pdfReportBuilder';
import { UI_TEXT } from '../i18n/translations';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileDown,
  FileText,
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

  const t = UI_TEXT[language];
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';
  const inputClass =
    theme === 'dark' ? 'glass-input-dark' : 'glass-input-light';
  const calc = project.calculation;

  const [confirmedIncomplete, setConfirmedIncomplete] = useState(false);

  const exportLang =
    project.export_settings?.export_language || language;
  const safeFileName = buildSafePdfFilename(
    project.project_name,
    project.export_settings?.export_date
  );

  const previewHtml = useMemo(() => {
    return generatePdfReportHtml(project, exportLang).html;
  }, [project, exportLang]);

  const canExport = calc.is_complete || confirmedIncomplete;

  return (
    <div className="space-y-6">
      {/* Header & Pengaturan Ekspor PDF */}
      <div className={`${cardClass} rounded-2xl p-6 space-y-5`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-sky-400" />
              <span>
                {isId
                  ? 'Pratinjau & Ekspor Laporan PDF (PRD Bab 12)'
                  : 'PDF Report Preview & Export (PRD Sec 12)'}
              </span>
            </h1>
            <p className="text-xs opacity-75 mt-1">
              {isId
                ? 'Laporan PDF mengambil angka langsung dari Calculation Engine yang sama dengan UI (NFR-02) dan mencakup 9 bagian wajib.'
                : 'The PDF report pulls figures directly from the shared Calculation Engine (NFR-02) and includes all 9 required sections.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Pemilih Bahasa Laporan PDF */}
            <div className="flex items-center p-1 rounded-xl bg-black/20 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => updateExportSettings({ export_language: 'id' })}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  exportLang === 'id'
                    ? 'bg-sky-500 text-white'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                PDF Bahasa Indonesia
              </button>
              <button
                type="button"
                onClick={() => updateExportSettings({ export_language: 'en' })}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  exportLang === 'en'
                    ? 'bg-sky-500 text-white'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                PDF English
              </button>
            </div>

            <button
              type="button"
              disabled={!canExport || isExportingPdf}
              onClick={exportPdfReport}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg ${
                canExport
                  ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-500/25'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              <FileDown className="w-4 h-4" />
              {isExportingPdf
                ? isId
                  ? 'Mengekspor PDF...'
                  : 'Exporting PDF...'
                : t.btnExportPdf}
            </button>
          </div>
        </div>

        {/* Form Pengaturan Judul & Nama File */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-white/10">
          <div>
            <label className="block text-xs font-semibold mb-1">
              {isId ? 'Judul Laporan di PDF' : 'Report Title in PDF'}
            </label>
            <input
              type="text"
              value={project.export_settings.report_title}
              onChange={(e) =>
                updateExportSettings({ report_title: e.target.value })
              }
              className={`${inputClass} w-full px-3 py-2 rounded-xl text-xs font-medium`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              {isId ? 'Tanggal Laporan' : 'Report Date'}
            </label>
            <input
              type="date"
              value={project.export_settings.export_date}
              onChange={(e) =>
                updateExportSettings({ export_date: e.target.value })
              }
              className={`${inputClass} w-full px-3 py-2 rounded-xl text-xs font-medium`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              {isId
                ? 'Rekomendasi Nama File (PRD Bab 12.3)'
                : 'Recommended Filename (PRD Sec 12.3)'}
            </label>
            <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono truncate">
              {safeFileName}
            </div>
          </div>
        </div>

        {/* Peringatan & Konfirmasi Wajib jika Estimasi Belum Lengkap (PRD Bab 11.3) */}
        {!calc.is_complete ? (
          <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {isId
                  ? 'Perhatian (PRD Bab 11.3): Proyek memiliki data tarif atau kurs yang belum lengkap (Estimasi Parsial).'
                  : 'Warning (PRD Sec 11.3): Project has incomplete rate or FX data (Partial Estimate).'}
              </span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={confirmedIncomplete}
                onChange={(e) => setConfirmedIncomplete(e.target.checked)}
                className="rounded accent-amber-400"
              />
              <span>
                {isId
                  ? 'Saya memahami laporan ini akan diberi label "ESTIMASI PARSIAL / BELUM LENGKAP" dan ingin tetap mengekspor PDF.'
                  : 'I understand this report will be labeled "PARTIAL / INCOMPLETE ESTIMATE" and wish to export anyway.'}
              </span>
            </label>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              {isId
                ? 'Seluruh perhitungan lengkap dan siap diekspor ke PDF.'
                : 'All calculations are complete and ready for PDF export.'}
            </span>
          </div>
        )}
      </div>

      {/* Live Preview Dokumen PDF */}
      <div className={`${cardClass} rounded-2xl p-6 space-y-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80">
            <Eye className="w-4 h-4 text-sky-400" />
            <span>
              {isId
                ? 'Pratinjau Dokumen Laporan PDF (9 Bagian Wajib PRD Bab 12.2)'
                : 'Live PDF Report Document Preview (All 9 Mandatory PRD Sec 12.2 Sections)'}
            </span>
          </div>
          <span className="text-[11px] opacity-65">
            {isId ? 'Ukuran Kertas: A4 Portrait' : 'Paper Size: A4 Portrait'}
          </span>
        </div>

        <div className="rounded-xl overflow-hidden border border-white/20 bg-white shadow-2xl">
          <iframe
            title="PDF Report Live Preview"
            srcDoc={previewHtml}
            className="w-full h-[720px] border-0"
          />
        </div>
      </div>
    </div>
  );
};
