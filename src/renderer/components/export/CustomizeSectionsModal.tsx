import React from 'react';
import { ProjectFile } from '../../../shared/types/project';
import { FrostedModal } from '../FrostedModal';

interface CustomizeSectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  exportSettings: ProjectFile['export_settings'];
  onUpdateExportSettings: (settings: Partial<ProjectFile['export_settings']>) => void;
}

export const CustomizeSectionsModal: React.FC<CustomizeSectionsModalProps> = ({
  isOpen,
  onClose,
  language,
  theme,
  exportSettings,
  onUpdateExportSettings,
}) => {
  const isId = language === 'id';
  const inputClass =
    theme === 'dark' ? 'glass-input-dark' : 'glass-input-light';
  const sections = exportSettings.included_sections;

  const toggleSection = (key: keyof typeof sections) => {
    onUpdateExportSettings({
      included_sections: {
        ...sections,
        [key]: !sections[key],
      },
    });
  };

  return (
    <FrostedModal
      isOpen={isOpen}
      onClose={onClose}
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
          onClick={onClose}
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
              value={exportSettings.prepared_by || ''}
              onChange={(e) =>
                onUpdateExportSettings({ prepared_by: e.target.value })
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
              value={exportSettings.client_or_team_name || ''}
              onChange={(e) =>
                onUpdateExportSettings({ client_or_team_name: e.target.value })
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
                  ? '3. Tabel Rincian Kebutuhan & Cadangan per Shot / Gambar'
                  : '3. Shot Requirements & Reserve Breakdown Table',
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
  );
};
