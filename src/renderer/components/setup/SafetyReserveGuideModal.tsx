import React from 'react';
import { FrostedModal } from '../FrostedModal';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

interface SafetyReserveGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'id' | 'en';
  theme: 'dark' | 'light';
}

export const SafetyReserveGuideModal: React.FC<SafetyReserveGuideModalProps> = ({
  isOpen,
  onClose,
  language,
  theme,
}) => {
  const isId = language === 'id';

  return (
    <FrostedModal
      isOpen={isOpen}
      onClose={onClose}
      theme={theme}
      maxWidth="lg"
      badgeLabel={isId ? 'Panduan Pengaturan Proyek' : 'Project Setup Guide'}
      title={
        isId ? (
          <>
            Apa itu{' '}
            <span className="vv-accent text-[#0099ff]">
              Dana Jaga-Jaga (Cadangan)?
            </span>
          </>
        ) : (
          <>
            What is the{' '}
            <span className="vv-accent text-[#0099ff]">
              Safety Reserve?
            </span>
          </>
        )
      }
      subtitle={
        isId
          ? 'Penjelasan mengapa dana jaga-jaga dibutuhkan saat memproduksi konten dengan AI.'
          : 'Explanation of why a contingency reserve is needed when generating content with AI.'
      }
    >
      <div className="space-y-4 text-xs">
        <div className="vv-card-quiet p-4 space-y-2 border-[#ffb840]/30 rounded-[12px]">
          <div className="flex items-center gap-2 font-semibold text-sm text-[#ffb840]">
            <ShieldAlert className="w-4 h-4" />
            <span>
              {isId
                ? 'Asuransi & Toleransi Revisi Proyek'
                : 'Project Insurance & Revision Tolerance'}
            </span>
          </div>
          <p className="text-[var(--vv-text-muted)] leading-relaxed">
            {isId
              ? 'Saat membuat video atau gambar dengan AI, hasil percobaan pertama belum tentu langsung sesuai selera (misal: ada glitch visual atau pose kurang pas). Menyiapkan angka cadangan (misal: 5 atau 10 cadangan) memastikan tim Anda memiliki jatah coba yang cukup tanpa takut kehabisan anggaran di tengah jalan.'
              : 'When generating AI video or images, the first take might not always be perfect. Setting a reserve factor (e.g., 5 or 10 tries) ensures your team has enough retries without running out of credits.'}
          </p>
        </div>

        <div className="vv-card-quiet p-4 space-y-2 rounded-[12px]">
          <div className="flex items-center gap-2 font-semibold text-sm text-[#0099ff]">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isId
                ? 'Bagaimana Dana Ini Terhubung ke Shot / Gambar?'
                : 'How Does This Connect to Shots / Images?'}
            </span>
          </div>
          <p className="text-[var(--vv-text-muted)] leading-relaxed">
            {isId
              ? 'Di Langkah 3 (Daftar Pekerjaan AI), Anda hanya perlu menentukan berapa banyak shot atau gambar yang Anda butuhkan. Sistem akan otomatis mengalikan kebutuhan Anda dengan angka cadangan ini (misal: 20 shot × 10 cadangan = 200 kali buat).'
              : 'In Step 3 (AI Production List), you simply enter how many finished shots or images you need. The system automatically multiplies your requirement by this reserve count (e.g. 20 shots × 10 reserve = 200 tries).'}
          </p>
        </div>
      </div>
    </FrostedModal>
  );
};
