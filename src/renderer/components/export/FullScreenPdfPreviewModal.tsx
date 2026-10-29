import React from 'react';
import { UI_TEXT } from '../../i18n/translations';
import { FrostedModal } from '../FrostedModal';
import { FileDown } from 'lucide-react';

interface FullScreenPdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  safeFileName: string;
  previewHtml: string;
  canExport: boolean;
  isExportingPdf: boolean;
  onExportPdf: () => void;
}

export const FullScreenPdfPreviewModal: React.FC<FullScreenPdfPreviewModalProps> = ({
  isOpen,
  onClose,
  language,
  theme,
  safeFileName,
  previewHtml,
  canExport,
  isExportingPdf,
  onExportPdf,
}) => {
  const isId = language === 'id';
  const t = UI_TEXT[language];

  return (
    <FrostedModal
      isOpen={isOpen}
      onClose={onClose}
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
            onClick={onClose}
            className="vv-btn-secondary px-4 py-2 text-xs"
          >
            {isId ? 'Tutup Pratinjau' : 'Close Preview'}
          </button>
          <button
            type="button"
            disabled={!canExport || isExportingPdf}
            onClick={() => {
              onExportPdf();
              onClose();
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
  );
};
