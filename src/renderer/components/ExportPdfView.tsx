import React, { useMemo, useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import {
  buildSafePdfFilename,
  generatePdfReportHtml,
} from '../../shared/pdf/pdfReportBuilder';
import { UI_TEXT } from '../i18n/translations';
import { StepFlowBar } from './StepFlowBar';
import { ExportHeroActionCard } from './export/ExportHeroActionCard';
import { LivePdfPreviewCard } from './export/LivePdfPreviewCard';
import { CustomizeSectionsModal } from './export/CustomizeSectionsModal';
import { FullScreenPdfPreviewModal } from './export/FullScreenPdfPreviewModal';

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
  const calc = project.calculation;

  const exportLang = project.export_settings?.export_language || language;
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
      {/* =====================================================================
       * TIER 1: DOMINANT FOCAL POINT — EXPORT STUDIO HERO & PRIMARY CTA
       * ===================================================================== */}
      <ExportHeroActionCard
        language={language}
        theme={theme}
        project={project}
        calculation={calc}
        exportLang={exportLang}
        safeFileName={safeFileName}
        confirmedIncomplete={confirmedIncomplete}
        canExport={canExport}
        isExportingPdf={isExportingPdf}
        onUpdateExportSettings={updateExportSettings}
        onSetConfirmedIncomplete={setConfirmedIncomplete}
        onExportPdf={exportPdfReport}
        onOpenCustomizeModal={() => setIsCustomizeModalOpen(true)}
        onOpenFullPreviewModal={() => setIsFullPreviewModalOpen(true)}
      />

      {/* =====================================================================
       * TIER 2: PROPORTIONAL STUDIO A4 DOCUMENT PREVIEW
       * ===================================================================== */}
      <LivePdfPreviewCard
        language={language}
        theme={theme}
        previewHtml={previewHtml}
        onOpenFullPreviewModal={() => setIsFullPreviewModalOpen(true)}
      />

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

      {/* Modal 1: Kustomisasi Bagian Dokumen PDF */}
      <CustomizeSectionsModal
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
        language={language}
        theme={theme}
        exportSettings={project.export_settings}
        onUpdateExportSettings={updateExportSettings}
      />

      {/* Modal 2: Pratinjau Layar Penuh PDF */}
      <FullScreenPdfPreviewModal
        isOpen={isFullPreviewModalOpen}
        onClose={() => setIsFullPreviewModalOpen(false)}
        language={language}
        theme={theme}
        safeFileName={safeFileName}
        previewHtml={previewHtml}
        canExport={canExport}
        isExportingPdf={isExportingPdf}
        onExportPdf={exportPdfReport}
      />
    </div>
  );
};
