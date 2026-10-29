import React from 'react';
import { Eye, Maximize2 } from 'lucide-react';

interface LivePdfPreviewCardProps {
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  previewHtml: string;
  onOpenFullPreviewModal: () => void;
}

export const LivePdfPreviewCard: React.FC<LivePdfPreviewCardProps> = ({
  language,
  theme,
  previewHtml,
  onOpenFullPreviewModal,
}) => {
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';

  return (
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
          onClick={onOpenFullPreviewModal}
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
  );
};
