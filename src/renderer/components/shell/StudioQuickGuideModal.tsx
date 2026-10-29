import React from 'react';
import { useProjectStore } from '../../store/projectStore';
import { UI_TEXT } from '../../i18n/translations';
import { FrostedModal } from '../FrostedModal';
import {
  BarChart3,
  BookOpen,
  FileDown,
  FlaskConical,
  Layers,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface StudioQuickGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudioQuickGuideModal: React.FC<StudioQuickGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language, theme, loadCommercialSample, loadPrdSyntheticTest } =
    useProjectStore();

  const isId = language === 'id';
  const t = UI_TEXT[language];

  return (
    <FrostedModal
      isOpen={isOpen}
      onClose={onClose}
      theme={theme}
      maxWidth="2xl"
      badgeLabel={isId ? 'Panduan Pengguna Awam' : 'Beginner Friendly Guide'}
      badgeIcon={<BookOpen className="w-3.5 h-3.5 text-[#0099ff]" />}
      title={
        isId ? (
          <>
            Cara Mudah Menghitung{' '}
            <span className="vv-accent text-[#0099ff]">Anggaran Video AI</span>
          </>
        ) : (
          <>
            Easy Guide to{' '}
            <span className="vv-accent text-[#0099ff]">AI Video Budgeting</span>
          </>
        )
      }
      subtitle={
        isId
          ? 'Bayangkan aplikasi ini seperti kasir pintar untuk rencana produksi video AI Anda. Ikuti 4 langkah berurutan di bawah ini:'
          : 'Think of this app as a smart cashier for your AI video production plan. Follow the 4 simple steps below:'
      }
      footer={
        <>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                loadCommercialSample();
                onClose();
              }}
              className="vv-btn-secondary px-3.5 py-2 text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0099ff]" />
              <span>{t.btnLoadCommercialDemo}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                loadPrdSyntheticTest();
                onClose();
              }}
              className="vv-btn-secondary px-3.5 py-2 text-xs"
            >
              <FlaskConical className="w-3.5 h-3.5 vv-text-emerald" />
              <span>{t.btnLoadPrdTest}</span>
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="vv-btn-primary px-5 py-2 text-xs"
          >
            <span>{isId ? 'Mengerti, Tutup Panduan' : 'Got It, Close'}</span>
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
        <div className="vv-card-quiet p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-[#0099ff]">
              LANGKAH 01 — 02
            </span>
            <Sliders className="w-4 h-4 text-[#0099ff]" />
          </div>
          <div className="font-semibold text-sm text-[var(--vv-text-primary)]">
            {isId
              ? '1. Tentukan Nama Proyek & Dana Cadangan'
              : '1. Set Project Name & Redo Reserve'}
          </div>
          <p className="text-[var(--vv-text-muted)] leading-relaxed">
            {isId
              ? 'Beri nama proyek Anda, tentukan jumlah video jadi, dan atur berapa kali cadangan per shot (misal 2x) untuk berjaga-jaga jika hasil AI perlu dibuat ulang.'
              : 'Name your project, set your target video output, and choose a reserve multiplier per shot (e.g. 2x) in case AI shots need extra tries.'}
          </p>
        </div>

        <div className="vv-card-quiet p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-[#0099ff]">
              LANGKAH 03
            </span>
            <Layers className="w-4 h-4 text-[#0099ff]" />
          </div>
          <div className="font-semibold text-sm text-[var(--vv-text-primary)]">
            {isId
              ? '2. Susun Daftar Shot & Gambar di Jendela Popup'
              : '2. Build Your Shot & Image List'}
          </div>
          <p className="text-[var(--vv-text-muted)] leading-relaxed">
            {isId
              ? 'Tambahkan tahapan pembuatan (Gambar dari Teks, Video dari Teks, hingga Peningkatan 4K). Klik tombol "Atur Shot" untuk memilih model AI dengan rapi.'
              : 'Add production stages (Text to Image, Text to Video, 4K Upscaling). Click "Configure Shot" to choose models cleanly inside a popup.'}
          </p>
        </div>

        <div className="vv-card-quiet p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-[#0099ff]">
              LANGKAH 04
            </span>
            <BarChart3 className="w-4 h-4 text-[#0099ff]" />
          </div>
          <div className="font-semibold text-sm text-[var(--vv-text-primary)]">
            {isId
              ? '3. Periksa Ringkasan Biaya (USD & Rupiah)'
              : '3. Check Complete Cost Summary'}
          </div>
          <p className="text-[var(--vv-text-muted)] leading-relaxed">
            {isId
              ? 'Lihat total anggaran keseluruhan, perbandingan biaya utama vs cadangan, serta rata-rata biaya per 1 video jadi dan per 1 menit durasi.'
              : 'Inspect your total budget in USD and IDR, base vs. reserve share, and average cost per video and per minute.'}
          </p>
        </div>

        <div className="vv-card-quiet p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-[#0099ff]">
              LANGKAH 05
            </span>
            <FileDown className="w-4 h-4 text-[#0099ff]" />
          </div>
          <div className="font-semibold text-sm text-[var(--vv-text-primary)]">
            {isId
              ? '4. Cetak Laporan Resmi PDF'
              : '4. Save Print-Ready PDF Report'}
          </div>
          <p className="text-[var(--vv-text-muted)] leading-relaxed">
            {isId
              ? 'Pratinjau dokumen laporan ukuran A4 dan simpan sebagai file PDF rapi yang siap dibagikan ke klien atau tim produksi Anda.'
              : 'Preview your A4 budget document and save a clean PDF report ready to share with clients or your production team.'}
          </p>
        </div>
      </div>
    </FrostedModal>
  );
};
