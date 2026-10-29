import React from 'react';
import { useProjectStore } from '../../store/projectStore';
import { CheckCircle2, X } from 'lucide-react';

export const NotificationBanner: React.FC = () => {
  const { banner, language, clearBanner } = useProjectStore();

  if (!banner) return null;

  const isId = language === 'id';

  return (
    <div className="px-6 pt-4 max-w-6xl w-full mx-auto">
      <div
        className={`p-3.5 rounded-[12px] border flex items-center justify-between gap-3 text-xs font-medium shadow-lg ${
          banner.type === 'error'
            ? 'bg-rose-500/15 border-rose-500/35 text-rose-700 dark:text-rose-300'
            : banner.type === 'warning'
            ? 'vv-badge-amber'
            : banner.type === 'success'
            ? 'vv-badge-emerald'
            : 'bg-[#0099ff]/15 border-[#0099ff]/35 text-[#0066cc] dark:text-[#7acaff]'
        }`}
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{isId ? banner.message_id : banner.message_en}</span>
        </div>
        <button
          onClick={clearBanner}
          className="p-1 rounded-lg hover:bg-white/10 transition"
          aria-label={isId ? 'Tutup notifikasi' : 'Close notification'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
