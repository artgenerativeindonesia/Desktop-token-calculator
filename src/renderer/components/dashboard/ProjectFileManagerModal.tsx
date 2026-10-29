import React from 'react';
import { RecentProjectEntry } from '../../../shared/types/project';
import { formatCurrencyUsd, UI_TEXT } from '../../i18n/translations';
import { FrostedModal } from '../FrostedModal';
import {
  FilePlus2,
  FlaskConical,
  FolderOpen,
  Sparkles,
} from 'lucide-react';

interface ProjectFileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  currentFilePath: string | null;
  recentProjects: RecentProjectEntry[];
  onCreateNewBlank: () => void;
  onOpenProjectFile: (filePath?: string) => void;
  onLoadCommercialSample: () => void;
  onLoadPrdTest: () => void;
  onFallbackFileInput: () => void;
}

export const ProjectFileManagerModal: React.FC<ProjectFileManagerModalProps> = ({
  isOpen,
  onClose,
  language,
  theme,
  currentFilePath,
  recentProjects,
  onCreateNewBlank,
  onOpenProjectFile,
  onLoadCommercialSample,
  onLoadPrdTest,
  onFallbackFileInput,
}) => {
  const isId = language === 'id';
  const t = UI_TEXT[language];

  return (
    <FrostedModal
      isOpen={isOpen}
      onClose={onClose}
      theme={theme}
      maxWidth="2xl"
      badgeLabel={isId ? 'Manajemen File Proyek' : 'Project File Manager'}
      title={
        isId ? (
          <>
            Buat Baru, Buka File, atau{' '}
            <span className="vv-accent text-[#0099ff]">Muat Contoh Proyek</span>
          </>
        ) : (
          <>
            Create New, Open File, or{' '}
            <span className="vv-accent text-[#0099ff]">Load Sample Project</span>
          </>
        )
      }
      subtitle={
        isId
          ? 'Pilih cara memulai perhitungan anggaran Anda. Anda juga dapat langsung mencoba proyek contoh yang sudah terisi lengkap.'
          : 'Choose how to start your budget calculation, or load a pre-filled sample project with one click.'
      }
    >
      <div className="space-y-5 text-xs">
        {/* Row 1: New & Open from Computer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <button
            type="button"
            onClick={() => {
              onCreateNewBlank();
              onClose();
            }}
            className="vv-card-quiet p-4 text-left hover:border-[#0099ff] transition flex items-start gap-3"
          >
            <FilePlus2 className="w-5 h-5 text-[#0099ff] shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm text-[var(--vv-text-primary)]">
                {t.btnNewProject}
              </div>
              <p className="text-[var(--vv-text-muted)] mt-1 leading-relaxed">
                {isId
                  ? 'Mulai proyek kosong baru dari awal dengan 1 shot pembuka.'
                  : 'Start a fresh blank project with 1 opening shot.'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.api) {
                onOpenProjectFile();
                onClose();
              } else {
                onFallbackFileInput();
              }
            }}
            className="vv-card-quiet p-4 text-left hover:border-[#ffb840] transition flex items-start gap-3"
          >
            <FolderOpen className="w-5 h-5 text-[#ffb840] shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm text-[var(--vv-text-primary)]">
                {t.btnOpenProject}
              </div>
              <p className="text-[var(--vv-text-muted)] mt-1 leading-relaxed">
                {isId
                  ? 'Buka file proyek (.aivbudget) yang pernah Anda simpan di komputer.'
                  : 'Open a previously saved project file (.aivbudget) from your computer.'}
              </p>
            </div>
          </button>
        </div>

        {/* Row 2: One-Click Pre-built Samples */}
        <div className="vv-card-quiet p-4 space-y-3">
          <div className="font-semibold uppercase tracking-wider text-[11px] text-[var(--vv-text-muted)]">
            {isId
              ? 'Contoh Proyek Siap Pakai (Tanpa Perlu Mengetik dari Awal)'
              : 'Ready-to-Use Sample Projects (No Typing Needed)'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                onLoadCommercialSample();
                onClose();
              }}
              className="vv-btn-secondary py-2.5 px-3.5 text-xs justify-start"
            >
              <Sparkles className="w-4 h-4 text-[#0099ff] shrink-0" />
              <span className="truncate">{t.btnLoadCommercialDemo}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onLoadPrdTest();
                onClose();
              }}
              className="vv-btn-secondary py-2.5 px-3.5 text-xs justify-start"
            >
              <FlaskConical className="w-4 h-4 vv-text-emerald shrink-0" />
              <span className="truncate">{t.btnLoadPrdTest}</span>
            </button>
          </div>
        </div>

        {/* Row 3: Recent Saved Projects */}
        <div className="space-y-2">
          <div className="font-semibold uppercase tracking-wider text-[11px] text-[var(--vv-text-muted)]">
            {isId
              ? 'Proyek yang Terakhir Disimpan di Komputer Ini'
              : 'Recently Saved Projects on This Computer'}
          </div>
          {recentProjects.length === 0 ? (
            <div className="p-4 text-center border border-dashed border-[var(--vv-border-strong)] rounded-[12px] text-[var(--vv-text-muted)]">
              {isId
                ? 'Belum ada riwayat proyek yang disimpan. Lokasi saat ini: '
                : 'No saved project history yet. Current file: '}
              <span className="font-mono">
                {currentFilePath || (isId ? 'Belum disimpan' : 'Unsaved')}
              </span>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {recentProjects.map((rec) => (
                <button
                  key={rec.file_path}
                  type="button"
                  onClick={() => {
                    onOpenProjectFile(rec.file_path);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-[10px] bg-[var(--vv-tint-weak)] hover:bg-[var(--vv-tint)] border border-[var(--vv-border)] transition flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate">
                      {rec.project_name}
                    </div>
                    <div className="text-[11px] text-[var(--vv-text-muted)] truncate">
                      {rec.file_path}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold tabular-nums text-[#0099ff]">
                      {formatCurrencyUsd(rec.total_cost_usd, language)}
                    </div>
                    <div className="text-[10px] text-[var(--vv-text-subtle)]">
                      {rec.updated_at.slice(0, 10)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </FrostedModal>
  );
};
