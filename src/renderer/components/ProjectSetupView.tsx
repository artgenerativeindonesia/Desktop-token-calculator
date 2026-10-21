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
      <div className={`${cardClass} rounded-[16px] p-6`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="vv-badge-pill">
            <Sliders className="w-3.5 h-3.5 text-[#0099ff]" />
            <span>{isId ? 'Konfigurasi Proyek' : 'Project Configuration'}</span>
          </span>
        </div>
        <h1 className="text-2xl font-medium tracking-[-0.035em]">
          {isId ? (
            <>
              Pengaturan Proyek &{' '}
              <span className="vv-accent text-[#0099ff]">Dana Cadangan</span>
            </>
          ) : (
            <>
              Project Settings &{' '}
              <span className="vv-accent text-[#0099ff]">Reserve Budget</span>
            </>
          )}
        </h1>
        <p className="text-xs text-[var(--vv-text-muted)] mt-1">
          {isId
            ? 'Atur nama proyek, pilih cara menghitung kebutuhan produksi, dan siapkan cadangan jika ada hasil AI yang perlu dibuat ulang.'
            : 'Set your project name, choose how to calculate your production needs, and set a reserve for re-generating AI outputs.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bagian 1: Identitas Proyek & Mode Estimasi */}
        <div className={`${cardClass} rounded-[16px] p-6 space-y-5`}>
          <div className="flex items-center justify-between border-b border-[var(--vv-border)] pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)] flex items-center gap-2">
              <span className="font-mono text-[10px] text-[var(--vv-text-subtle)]">01</span>
              <Film className="w-4 h-4 text-[#0099ff]" />
              <span>
                {isId
                  ? 'Nama Proyek & Target Hasil Akhir'
                  : 'Project Name & Target Output'}
              </span>
            </h2>
          </div>

          {/* Nama Proyek */}
          <div>
            <label className="block text-xs font-medium text-[var(--vv-text-strong)] mb-1.5">
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
              className={`${inputClass} w-full px-3.5 py-2.5 rounded-[10px] text-sm font-medium`}
            />
            {!project.project_name.trim() && (
              <p className="text-xs text-rose-400 mt-1">
                {isId
                  ? 'Nama proyek wajib diisi sebelum menyimpan atau membuat laporan PDF.'
                  : 'Project name cannot be empty before saving or exporting.'}
              </p>
            )}
          </div>

          {/* Visuvate Segmented Control: Mode Estimasi */}
          <div>
            <label className="block text-xs font-medium text-[var(--vv-text-strong)] mb-1.5">
              {isId
                ? 'Cara Menghitung Kebutuhan Proyek'
                : 'How to Calculate Project Needs'}
            </label>
            <div className="grid grid-cols-2 p-1 rounded-[10px] bg-[var(--vv-field)] border border-[var(--vv-border)]">
              <button
                type="button"
                onClick={() => setEstimationMode('per_shot')}
                className={`py-2 px-3 rounded-[7px] text-xs font-medium transition flex items-center justify-center gap-1.5 ${
                  assumptions.estimation_mode === 'per_shot'
                    ? 'bg-[#0068ad] text-white shadow-sm'
                    : 'text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isId ? 'Rincian per Adegan' : 'Scene-by-Scene Detail'}
              </button>
              <button
                type="button"
                onClick={() => setEstimationMode('target_final')}
                className={`py-2 px-3 rounded-[7px] text-xs font-medium transition flex items-center justify-center gap-1.5 ${
                  assumptions.estimation_mode === 'target_final'
                    ? 'bg-[#0068ad] text-white shadow-sm'
                    : 'text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)]'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                {isId ? 'Dari Jumlah Video Jadi' : 'By Total Final Videos'}
              </button>
            </div>
            <p className="text-[11px] text-[var(--vv-text-muted)] mt-2 leading-relaxed">
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
              <label className="block text-xs font-medium text-[var(--vv-text-strong)] mb-1.5">
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
                className={`${inputClass} w-full px-3.5 py-2 rounded-[10px] text-sm font-semibold tabular-nums text-right`}
              />
              <span className="text-[11px] text-[var(--vv-text-muted)]">
                {isId
                  ? 'Untuk melihat rata-rata biaya pembuatan per 1 video jadi.'
                  : 'Used to see the average cost per final video.'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--vv-text-strong)] mb-1.5">
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
                className={`${inputClass} w-full px-3.5 py-2 rounded-[10px] text-sm font-semibold tabular-nums text-right`}
              />
              <span className="text-[11px] text-[var(--vv-text-muted)]">
                {isId
                  ? 'Untuk melihat rata-rata biaya pembuatan per 1 menit video.'
                  : 'Used to see the average cost per minute of final video.'}
              </span>
            </div>
          </div>

          {/* Asumsi Shot per Video untuk Mode Target Final */}
          {assumptions.estimation_mode === 'target_final' && (
            <div className="p-4 rounded-[12px] bg-[#0099ff]/10 border border-[#0099ff]/30">
              <label className="block text-xs font-semibold text-[#7acaff] mb-1.5">
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
                className={`${inputClass} w-full px-3.5 py-2 rounded-[10px] text-sm font-semibold tabular-nums text-right`}
              />
              <p className="text-[11px] text-[var(--vv-text-muted)] mt-1.5">
                {isId
                  ? 'Angka ini otomatis menjadi jumlah adegan awal saat Anda menambahkan tahap pekerjaan baru.'
                  : 'This value serves as the default scene count when adding new production stages.'}
              </p>
            </div>
          )}
        </div>

        {/* Bagian 2: Sinkronisasi 2 Arah Cadangan */}
        <div className={`${cardClass} rounded-[16px] p-6 space-y-5`}>
          <div className="flex items-center justify-between border-b border-[var(--vv-border)] pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)] flex items-center gap-2">
              <span className="font-mono text-[10px] text-[var(--vv-text-subtle)]">02</span>
              <ArrowLeftRight className="w-4 h-4 text-[#ffb840]" />
              <span>
                {isId
                  ? 'Cadangan Buat Ulang (Otomatis Saling Menyesuaikan)'
                  : 'Redo / Regeneration Reserve (Auto-Synced)'}
              </span>
            </h2>
            <span className="vv-badge-pill">
              <span className="size-1.5 rounded-full bg-[#ffb840]" />
              <span>
                {assumptions.reserve_input_mode === 'percent'
                  ? isId
                    ? 'Persentase (%)'
                    : 'Percentage (%)'
                  : isId
                  ? 'Jumlah Cadangan'
                  : 'Reserve Count'}
              </span>
            </span>
          </div>

          <div className="p-3.5 rounded-[12px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border)] text-xs flex items-start gap-2.5 text-[var(--vv-text-strong)]">
            <Info className="w-4 h-4 text-[#0099ff] shrink-0 mt-0.5" />
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
              className={`p-4 rounded-[12px] border transition ${
                assumptions.reserve_input_mode === 'percent'
                  ? 'bg-[#ffb840]/10 border-[#ffb840]/50'
                  : 'bg-[var(--vv-tint-weak)] border-[var(--vv-border)]'
              }`}
            >
              <label className="block text-xs font-semibold mb-1.5">
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
                  className={`${inputClass} w-full pr-8 pl-3.5 py-2.5 rounded-[10px] text-lg font-bold tabular-nums text-right`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--vv-text-muted)]">
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
                className="w-full mt-3 accent-[#ffb840] cursor-pointer"
              />
            </div>

            {/* Kotak B: Jumlah Cadangan Buat Ulang */}
            <div
              className={`p-4 rounded-[12px] border transition ${
                assumptions.reserve_input_mode === 'count'
                  ? 'bg-[#0099ff]/10 border-[#0099ff]/50'
                  : 'bg-[var(--vv-tint-weak)] border-[var(--vv-border)]'
              }`}
            >
              <label className="block text-xs font-semibold mb-1.5">
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
                className={`${inputClass} w-full px-3.5 py-2.5 rounded-[10px] text-lg font-bold tabular-nums text-right`}
              />
              <div className="text-[11px] text-[var(--vv-text-muted)] mt-3 text-right">
                {isId
                  ? `Total: ${calculation.planned_generations} rencana awal + ${calculation.reserve_generations} cadangan = ${calculation.budgeted_generations} kali buat`
                  : `Total: ${calculation.planned_generations} initial + ${calculation.reserve_generations} reserve = ${calculation.budgeted_generations} total tries`}
              </div>
            </div>
          </div>

          {/* Ringkasan Dampak Biaya Cadangan */}
          <div className="p-4 rounded-[12px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border)] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--vv-text-muted)]">
                {isId
                  ? 'Rencana Pembuatan Awal:'
                  : 'Initial Planned Tries:'}
              </span>
              <span className="font-semibold tabular-nums">
                {calculation.planned_generations} {isId ? 'kali buat' : 'tries'}
              </span>
            </div>
            <div className="flex justify-between text-[#ffb840]">
              <span>
                {isId
                  ? `Tambahan Cadangan Buat Ulang (${calculation.effective_reserve_percent}%):`
                  : `Extra Reserve Tries (${calculation.effective_reserve_percent}%):`}
              </span>
              <span className="font-semibold tabular-nums">
                +{calculation.reserve_generations} {isId ? 'kali' : 'tries'} (
                {formatCurrencyUsd(calculation.reserve_cost_usd, language)} /{' '}
                {formatCurrencyIdr(calculation.reserve_cost_idr, language)})
              </span>
            </div>
            <div className="pt-2.5 border-t border-[var(--vv-border)] flex justify-between text-sm font-bold">
              <span>
                {isId
                  ? 'Total Dianggarkan (Termasuk Cadangan):'
                  : 'Total Budgeted (Including Reserve):'}
              </span>
              <span className="tabular-nums text-[#0099ff]">
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
              className="vv-btn-primary px-5 py-2.5 text-xs"
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
