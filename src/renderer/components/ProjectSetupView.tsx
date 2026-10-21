import React from 'react';
import { useProjectStore } from '../store/projectStore';
import { formatCurrencyIdr, formatCurrencyUsd } from '../i18n/translations';
import {
  ArrowLeftRight,
  Film,
  Info,
  Sliders,
  Sparkles,
  Target,
} from 'lucide-react';

export const ProjectSetupView: React.FC = () => {
  const {
    project,
    language,
    theme,
    setProjectName,
    setEstimationMode,
    setTargetVideos,
    setFinalDurationMinutes,
    setDefaultShotsPerVideo,
    setReserveByPercent,
    setReserveByCount,
    setActiveTab,
  } = useProjectStore();

  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';
  const inputClass =
    theme === 'dark' ? 'glass-input-dark' : 'glass-input-light';
  const { assumptions, calculation } = project;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${cardClass} rounded-2xl p-6`}>
        <h1 className="text-xl font-bold flex items-center gap-2.5">
          <Sliders className="w-5 h-5 text-sky-400" />
          <span>
            {isId
              ? 'Pengaturan Proyek & Dana Cadangan'
              : 'Project Settings & Reserve Budget'}
          </span>
        </h1>
        <p className="text-xs opacity-75 mt-1">
          {isId
            ? 'Atur nama proyek, pilih cara menghitung kebutuhan produksi, dan siapkan cadangan jika ada hasil AI yang perlu dibuat ulang.'
            : 'Set your project name, choose how to calculate your production needs, and set a reserve for re-generating AI outputs.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bagian 1: Identitas Proyek & Mode Estimasi */}
        <div className={`${cardClass} rounded-2xl p-6 space-y-5`}>
          <h2 className="text-sm font-bold uppercase tracking-wider opacity-80 flex items-center gap-2">
            <Film className="w-4 h-4 text-sky-400" />
            <span>
              {isId
                ? '1. Nama Proyek & Target Hasil Akhir'
                : '1. Project Name & Target Output'}
            </span>
          </h2>

          {/* Nama Proyek */}
          <div>
            <label className="block text-xs font-semibold mb-1.5">
              {isId ? 'Nama Proyek (Wajib diisi)' : 'Project Name (Required)'}
            </label>
            <input
              type="text"
              value={project.project_name}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder={
                isId
                  ? 'Contoh: Iklan Video AI Produk Kopi'
                  : 'e.g., New Product AI Video Campaign'
              }
              className={`${inputClass} w-full px-3.5 py-2.5 rounded-xl text-sm font-medium`}
            />
            {!project.project_name.trim() && (
              <p className="text-xs text-rose-400 mt-1">
                {isId
                  ? 'Nama proyek wajib diisi sebelum menyimpan atau membuat laporan PDF.'
                  : 'Project name cannot be empty before saving or exporting.'}
              </p>
            )}
          </div>

          {/* Apple Segmented Pill Control: Mode Estimasi */}
          <div>
            <label className="block text-xs font-semibold mb-1.5">
              {isId
                ? 'Cara Menghitung Kebutuhan Proyek'
                : 'How to Calculate Project Needs'}
            </label>
            <div className="grid grid-cols-2 p-1 rounded-xl bg-black/20 border border-white/10">
              <button
                type="button"
                onClick={() => setEstimationMode('per_shot')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                  assumptions.estimation_mode === 'per_shot'
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isId ? 'Rincian per Adegan' : 'Scene-by-Scene Detail'}
              </button>
              <button
                type="button"
                onClick={() => setEstimationMode('target_final')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                  assumptions.estimation_mode === 'target_final'
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                {isId ? 'Dari Jumlah Video Jadi' : 'By Total Final Videos'}
              </button>
            </div>
            <p className="text-[11px] opacity-70 mt-2">
              {assumptions.estimation_mode === 'target_final'
                ? isId
                  ? 'Cocok jika Anda ingin membuat beberapa video dengan pola serupa. Jumlah adegan di daftar pekerjaan akan dikalikan otomatis dengan target jumlah video jadi.'
                  : 'Ideal when producing multiple videos with a similar structure. Scene counts in the planner are automatically multiplied by your target final videos.'
                : isId
                ? 'Cocok jika Anda ingin mencatat setiap adegan video atau gambar satu per satu sesuai kebutuhan spesifik.'
                : 'Ideal when you want to list each specific scene or image asset individually.'}
            </p>
          </div>

          {/* Target Videos & Final Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                {isId
                  ? 'Target Jumlah Video Jadi'
                  : 'Target Final Videos'}
              </label>
              <input
                type="number"
                min={0}
                step={1}
                value={assumptions.target_videos}
                onChange={(e) => setTargetVideos(Number(e.target.value))}
                className={`${inputClass} w-full px-3.5 py-2 rounded-xl text-sm font-semibold tabular-nums text-right`}
              />
              <span className="text-[11px] opacity-65">
                {isId
                  ? 'Untuk melihat rata-rata biaya pembuatan per 1 video jadi.'
                  : 'Used to see the average cost per final video.'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5">
                {isId
                  ? 'Total Durasi Video Jadi (Menit)'
                  : 'Total Final Duration (Minutes)'}
              </label>
              <input
                type="number"
                min={0}
                step={0.25}
                value={assumptions.final_duration_minutes}
                onChange={(e) => setFinalDurationMinutes(Number(e.target.value))}
                className={`${inputClass} w-full px-3.5 py-2 rounded-xl text-sm font-semibold tabular-nums text-right`}
              />
              <span className="text-[11px] opacity-65">
                {isId
                  ? 'Untuk melihat rata-rata biaya pembuatan per 1 menit video.'
                  : 'Used to see the average cost per minute of final video.'}
              </span>
            </div>
          </div>

          {/* Asumsi Shot per Video untuk Mode Target Final */}
          {assumptions.estimation_mode === 'target_final' && (
            <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-400/30">
              <label className="block text-xs font-semibold text-sky-300 mb-1.5">
                {isId
                  ? 'Rata-rata Jumlah Adegan di Setiap Video'
                  : 'Average Scenes (Shots) per Final Video'}
              </label>
              <input
                type="number"
                min={1}
                step={1}
                value={assumptions.default_shots_per_video}
                onChange={(e) =>
                  setDefaultShotsPerVideo(Number(e.target.value))
                }
                className={`${inputClass} w-full px-3.5 py-2 rounded-xl text-sm font-semibold tabular-nums text-right`}
              />
              <p className="text-[11px] opacity-80 mt-1.5">
                {isId
                  ? 'Angka ini otomatis menjadi jumlah adegan awal saat Anda menambahkan tahap pekerjaan baru.'
                  : 'This value serves as the default scene count when adding new production stages.'}
              </p>
            </div>
          )}
        </div>

        {/* Bagian 2: Sinkronisasi 2 Arah Cadangan */}
        <div className={`${cardClass} rounded-2xl p-6 space-y-5`}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider opacity-80 flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-amber-400" />
              <span>
                {isId
                  ? '2. Cadangan Buat Ulang (Otomatis Saling Menyesuaikan)'
                  : '2. Redo / Regeneration Reserve (Auto-Synced)'}
              </span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
              {assumptions.reserve_input_mode === 'percent'
                ? isId
                  ? 'Diatur dari: Persentase (%)'
                  : 'Set by: Percentage (%)'
                : isId
                ? 'Diatur dari: Jumlah Cadangan'
                : 'Set by: Reserve Count'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span>
              {isId
                ? 'Mengapa perlu cadangan? Hasil buatan AI terkadang perlu diulang beberapa kali sampai hasilnya pas. Anda bebas mengisi Persentase (%) atau langsung mengisi Jumlah Cadangan—keduanya otomatis saling menyesuaikan!'
                : 'Why set a reserve? AI outputs sometimes need extra tries to get right. Type a Percentage (%) or type the Extra Reserve count directly—both adjust automatically!'}
            </span>
          </div>

          {/* Dua Kotak Input yang Saling Terhubung */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Kotak A: Persentase Cadangan */}
            <div
              className={`p-4 rounded-xl border transition ${
                assumptions.reserve_input_mode === 'percent'
                  ? 'bg-amber-500/15 border-amber-400/50'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <label className="block text-xs font-bold mb-1.5">
                {isId
                  ? 'Persentase Cadangan (%)'
                  : 'Reserve Percentage (%)'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={assumptions.reserve_percent}
                  onChange={(e) => setReserveByPercent(Number(e.target.value))}
                  className={`${inputClass} w-full pr-8 pl-3.5 py-2.5 rounded-xl text-lg font-bold tabular-nums text-right`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold opacity-70">
                  %
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={Math.min(100, assumptions.reserve_percent)}
                onChange={(e) => setReserveByPercent(Number(e.target.value))}
                className="w-full mt-3 accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Kotak B: Jumlah Cadangan Buat Ulang */}
            <div
              className={`p-4 rounded-xl border transition ${
                assumptions.reserve_input_mode === 'count'
                  ? 'bg-sky-500/15 border-sky-400/50'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <label className="block text-xs font-bold mb-1.5">
                {isId
                  ? 'Jumlah Cadangan Buat Ulang'
                  : 'Extra Reserve Tries'}
              </label>
              <input
                type="number"
                min={0}
                step={1}
                value={calculation.reserve_generations}
                onChange={(e) => setReserveByCount(Number(e.target.value))}
                className={`${inputClass} w-full px-3.5 py-2.5 rounded-xl text-lg font-bold tabular-nums text-right`}
              />
              <div className="text-[11px] opacity-75 mt-3 text-right">
                {isId
                  ? `Total: ${calculation.planned_generations} rencana awal + ${calculation.reserve_generations} cadangan = ${calculation.budgeted_generations} kali buat`
                  : `Total: ${calculation.planned_generations} initial + ${calculation.reserve_generations} reserve = ${calculation.budgeted_generations} total tries`}
              </div>
            </div>
          </div>

          {/* Ringkasan Dampak Biaya Cadangan */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="opacity-75">
                {isId
                  ? 'Rencana Pembuatan Awal:'
                  : 'Initial Planned Tries:'}
              </span>
              <span className="font-bold tabular-nums">
                {calculation.planned_generations} {isId ? 'kali buat' : 'tries'}
              </span>
            </div>
            <div className="flex justify-between text-amber-400">
              <span>
                {isId
                  ? `Tambahan Cadangan Buat Ulang (${calculation.effective_reserve_percent}%):`
                  : `Extra Reserve Tries (${calculation.effective_reserve_percent}%):`}
              </span>
              <span className="font-bold tabular-nums">
                +{calculation.reserve_generations} {isId ? 'kali' : 'tries'} (
                {formatCurrencyUsd(calculation.reserve_cost_usd, language)} /{' '}
                {formatCurrencyIdr(calculation.reserve_cost_idr, language)})
              </span>
            </div>
            <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold">
              <span>
                {isId
                  ? 'Total Dianggarkan (Termasuk Cadangan):'
                  : 'Total Budgeted (Including Reserve):'}
              </span>
              <span className="tabular-nums text-sky-400">
                {calculation.budgeted_generations}{' '}
                {isId ? 'kali buat' : 'tries'} •{' '}
                {formatCurrencyUsd(calculation.total_cost_usd, language)}
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setActiveTab('planner')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/25 transition"
            >
              {isId
                ? 'Lanjut ke Daftar Pekerjaan AI →'
                : 'Continue to AI Production List →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
