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
              ? 'Pengaturan Proyek, Mode Estimasi, & Cadangan Regenerasi'
              : 'Project Setup, Estimation Mode, & Regeneration Reserve'}
          </span>
        </h1>
        <p className="text-xs opacity-75 mt-1">
          {isId
            ? 'Atur nama proyek, pilih metode estimasi (Target Video Final atau Detail Per-Shot), dan sesuaikan cadangan regenerasi 2 arah.'
            : 'Configure project identity, select estimation method (Target Final Video or Per-Shot Detail), and adjust bidirectional regeneration reserve.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bagian 1: Identitas Proyek & Mode Estimasi */}
        <div className={`${cardClass} rounded-2xl p-6 space-y-5`}>
          <h2 className="text-sm font-bold uppercase tracking-wider opacity-80 flex items-center gap-2">
            <Film className="w-4 h-4 text-sky-400" />
            <span>
              {isId
                ? '1. Identitas & Target Output Proyek'
                : '1. Project Identity & Output Targets'}
            </span>
          </h2>

          {/* Nama Proyek (FR-01) */}
          <div>
            <label className="block text-xs font-semibold mb-1.5">
              {isId ? 'Nama Proyek (Wajib diisi - FR-01)' : 'Project Name (Required - FR-01)'}
            </label>
            <input
              type="text"
              value={project.project_name}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder={
                isId
                  ? 'Contoh: Kampanye Video AI Produk Baru'
                  : 'e.g., New Product AI Video Campaign'
              }
              className={`${inputClass} w-full px-3.5 py-2.5 rounded-xl text-sm font-medium`}
            />
            {!project.project_name.trim() && (
              <p className="text-xs text-rose-400 mt-1">
                {isId
                  ? 'Nama proyek tidak boleh kosong sebelum disimpan atau diekspor.'
                  : 'Project name cannot be empty before saving or exporting.'}
              </p>
            )}
          </div>

          {/* Apple Segmented Pill Control: Mode Estimasi (FR-03 & FR-04) */}
          <div>
            <label className="block text-xs font-semibold mb-1.5">
              {isId
                ? 'Metode Estimasi (PRD Bab 1.1 & Bab 8.8)'
                : 'Estimation Method (PRD Sec 1.1 & Sec 8.8)'}
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
                {isId ? 'Mode Detail Per-Shot' : 'Per-Shot Detail Mode'}
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
                {isId ? 'Mode Target Video Final' : 'Target Final Video Mode'}
              </button>
            </div>
            <p className="text-[11px] opacity-70 mt-2">
              {assumptions.estimation_mode === 'target_final'
                ? isId
                  ? 'Mode Target Video Final (US-03): Kuantitas shot per tahap dikalikan otomatis dengan Jumlah Video Final (V).'
                  : 'Target Final Video Mode (US-03): Stage shot quantities are multiplied by Target Final Videos (V).'
                : isId
                ? 'Mode Detail Per-Shot (US-04): Setiap baris pekerjaan dihitung sesuai jumlah shot/aset spesifik yang Anda masukkan.'
                : 'Per-Shot Detail Mode (US-04): Each production row is calculated directly from its specific shot/asset count.'}
            </p>
          </div>

          {/* Target Videos (V) & Final Duration (M) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                {isId
                  ? 'Jumlah Video Final (V)'
                  : 'Target Final Videos (V)'}
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
                  ? 'Digunakan untuk menghitung Biaya per Video Final (Btotal / V).'
                  : 'Used to compute Cost per Final Video (Btotal / V).'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5">
                {isId
                  ? 'Total Durasi Video Final dalam Menit (M)'
                  : 'Total Final Duration in Minutes (M)'}
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
                  ? 'Digunakan untuk menghitung Biaya per Menit Final (Btotal / M).'
                  : 'Used to compute Cost per Final Minute (Btotal / M).'}
              </span>
            </div>
          </div>

          {/* Asumsi Shot per Video untuk Mode Target Final */}
          {assumptions.estimation_mode === 'target_final' && (
            <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-400/30">
              <label className="block text-xs font-semibold text-sky-300 mb-1.5">
                {isId
                  ? 'Asumsi Rata-rata Shot per Video Final (PRD Bab 8.8)'
                  : 'Assumed Average Shots per Final Video (PRD Sec 8.8)'}
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
                  ? 'Sesuai PRD Bab 8.8, aplikasi tidak menebak keberhasilan AI secara diam-diam. Nilai ini menjadi default saat menambah baris pekerjaan baru.'
                  : 'Per PRD Sec 8.8, the app never guesses AI success rates silently. This value serves as the default when adding new stages.'}
              </p>
            </div>
          )}
        </div>

        {/* Bagian 2: Sinkronisasi 2 Arah Cadangan Regenerasi (R <-> Greserve) */}
        <div className={`${cardClass} rounded-2xl p-6 space-y-5`}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider opacity-80 flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-amber-400" />
              <span>
                {isId
                  ? '2. Cadangan Regenerasi 2 Arah (R ↔ Greserve)'
                  : '2. Bidirectional Regeneration Reserve (R ↔ Greserve)'}
              </span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
              {assumptions.reserve_input_mode === 'percent'
                ? isId
                  ? 'Input: Persentase (%)'
                  : 'Mode: Percentage (%)'
                : isId
                ? 'Input: Jumlah Generasi'
                : 'Mode: Generation Count'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span>
              {isId
                ? 'Ketik angka Persentase (%) maka Jumlah Generasi Cadangan akan dihitung otomatis dengan pembulatan ke atas (ceil). Sebaliknya, ketik langsung Jumlah Generasi Cadangan maka Persentase (%) akan menyesuaikan otomatis!'
                : 'Type a Reserve Percentage (%) to automatically compute Reserve Generations (ceil). Or type Reserve Generations directly and the Percentage (%) updates automatically!'}
            </span>
          </div>

          {/* Dua Kotak Input yang Saling Terhubung (Bidirectional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Kotak A: Persentase Cadangan (R) */}
            <div
              className={`p-4 rounded-xl border transition ${
                assumptions.reserve_input_mode === 'percent'
                  ? 'bg-amber-500/15 border-amber-400/50'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <label className="block text-xs font-bold mb-1.5">
                {isId
                  ? 'Persentase Cadangan (R %)'
                  : 'Reserve Percentage (R %)'}
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

            {/* Kotak B: Jumlah Generasi Cadangan (Greserve) */}
            <div
              className={`p-4 rounded-xl border transition ${
                assumptions.reserve_input_mode === 'count'
                  ? 'bg-sky-500/15 border-sky-400/50'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <label className="block text-xs font-bold mb-1.5">
                {isId
                  ? 'Jumlah Generasi Cadangan (Greserve)'
                  : 'Reserve Generations Count (Greserve)'}
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
                  ? `Rumus: Gbudget = ${calculation.planned_generations} dasar + ${calculation.reserve_generations} cadangan = ${calculation.budgeted_generations}`
                  : `Formula: Gbudget = ${calculation.planned_generations} base + ${calculation.reserve_generations} reserve = ${calculation.budgeted_generations}`}
              </div>
            </div>
          </div>

          {/* Ringkasan Dampak Biaya Cadangan */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="opacity-75">
                {isId
                  ? 'Generasi Dasar Direncanakan (Gplanned):'
                  : 'Planned Base Generations (Gplanned):'}
              </span>
              <span className="font-bold tabular-nums">
                {calculation.planned_generations}
              </span>
            </div>
            <div className="flex justify-between text-amber-400">
              <span>
                {isId
                  ? `Tambahan Generasi Cadangan (${calculation.effective_reserve_percent}%):`
                  : `Additional Reserve Generations (${calculation.effective_reserve_percent}%):`}
              </span>
              <span className="font-bold tabular-nums">
                +{calculation.reserve_generations} (
                {formatCurrencyUsd(calculation.reserve_cost_usd, language)} /{' '}
                {formatCurrencyIdr(calculation.reserve_cost_idr, language)})
              </span>
            </div>
            <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold">
              <span>
                {isId
                  ? 'Total Dianggarkan (Gbudget & Btotal):'
                  : 'Total Budgeted (Gbudget & Btotal):'}
              </span>
              <span className="tabular-nums text-sky-400">
                {calculation.budgeted_generations}{' '}
                {isId ? 'generasi' : 'gens'} •{' '}
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
                ? 'Lanjut ke Tabel Perencana Produksi →'
                : 'Continue to Production Planner →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
