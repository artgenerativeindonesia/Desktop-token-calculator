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
      <div className={`${cardClass} rounded-[16px] p-6 space-y-5`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="vv-badge-pill">
                <FileText className="w-3.5 h-3.5 text-[#0099ff]" />
                <span>{isId ? 'Dokumen Siap Cetak' : 'Print-Ready Document'}</span>
              </span>
            </div>
            <h1 className="text-2xl font-medium tracking-[-0.035em]">
              {isId ? (
                <>
                  Pratinjau &{' '}
                  <span className="vv-accent text-[#0099ff]">Simpan Laporan PDF</span>
                </>
              ) : (
                <>
                  Preview &{' '}
                  <span className="vv-accent text-[#0099ff]">Save PDF Report</span>
                </>
              )}
            </h1>
            <p className="text-xs text-[var(--vv-text-muted)] mt-1">
              {isId
                ? 'Periksa tampilan laporan anggaran Anda di bawah ini sebelum menyimpannya menjadi file dokumen PDF.'
                : 'Review your budget report layout below before saving it as a PDF document.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Pemilih Bahasa Laporan PDF */}
            <div className="flex items-center p-1 rounded-[10px] bg-[var(--vv-field)] border border-[var(--vv-border)] text-xs">
              <button
                type="button"
                onClick={() => updateExportSettings({ export_language: 'id' })}
                className={`px-3 py-1.5 rounded-[7px] font-medium transition ${
                  exportLang === 'id'
                    ? 'bg-[#0068ad] text-white'
                    : 'text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)]'
                }`}
              >
                PDF Bahasa Indonesia
              </button>
              <button
                type="button"
                onClick={() => updateExportSettings({ export_language: 'en' })}
                className={`px-3 py-1.5 rounded-[7px] font-medium transition ${
                  exportLang === 'en'
                    ? 'bg-[#0068ad] text-white'
                    : 'text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)]'
                }`}
              >
                PDF English
              </button>
            </div>

            <button
              type="button"
              disabled={!canExport || isExportingPdf}
              onClick={exportPdfReport}
              className={`px-5 py-2.5 text-xs ${
                canExport
                  ? 'vv-btn-primary'
                  : 'inline-flex items-center gap-2 rounded-full bg-[var(--vv-tint-weak)] text-[var(--vv-text-subtle)] border border-[var(--vv-border)] cursor-not-allowed'
              }`}
            >
              <FileDown className="w-4 h-4" />
              <span>
                {isExportingPdf
                  ? isId
                    ? 'Menyimpan PDF...'
                    : 'Saving PDF...'
                  : t.btnExportPdf}
              </span>
            </button>
          </div>
        </div>

        {/* Form Pengaturan Judul & Nama File */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[var(--vv-border)]">
          <div>
            <label className="block text-xs font-medium text-[var(--vv-text-strong)] mb-1">
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
            <label className="block text-xs font-medium text-[var(--vv-text-strong)] mb-1">
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

          <div>
            <label className="block text-xs font-medium text-[var(--vv-text-strong)] mb-1">
              {isId
                ? 'Nama File PDF Otomatis'
                : 'Automatic PDF Filename'}
            </label>
            <div className="px-3.5 py-2 rounded-[10px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border)] text-xs font-mono truncate">
              {safeFileName}
            </div>
          </div>
        </div>

        {/* Peringatan & Konfirmasi Wajib jika Estimasi Belum Lengkap */}
        {!calc.is_complete ? (
          <div className="p-4 rounded-[12px] bg-amber-500/10 border border-amber-400/35 text-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-[#ffb840] shrink-0" />
              <span>
                {isId
                  ? 'Perhatian: Masih ada harga model atau kurs yang belum terisi lengkap.'
                  : 'Note: Some model prices or exchange rates are not yet filled in.'}
              </span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={confirmedIncomplete}
                onChange={(e) => setConfirmedIncomplete(e.target.checked)}
                className="rounded accent-[#ffb840]"
              />
              <span>
                {isId
                  ? 'Saya mengerti masih ada data yang kosong dan tetap ingin menyimpan laporan PDF ini.'
                  : 'I understand some data is incomplete and wish to save this PDF report anyway.'}
              </span>
            </label>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-[10px] p-3">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              {isId
                ? 'Seluruh hitungan sudah lengkap dan siap disimpan menjadi file PDF.'
                : 'All calculations are complete and ready to be saved as a PDF.'}
            </span>
          </div>
        )}
      </div>

      {/* Live Preview Dokumen PDF */}
      <div className={`${cardClass} rounded-[16px] p-6 space-y-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)]">
            <Eye className="w-4 h-4 text-[#0099ff]" />
            <span>
              {isId
                ? 'Pratinjau Dokumen Laporan PDF'
                : 'Live PDF Report Preview'}
            </span>
          </div>
          <span className="text-[11px] text-[var(--vv-text-muted)]">
            {isId ? 'Ukuran Kertas: A4 Tegak' : 'Paper Size: A4 Portrait'}
          </span>
        </div>

        <div className="rounded-[12px] overflow-hidden border border-[var(--vv-border-strong)] bg-white shadow-2xl">
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
