import React, { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import {
  formatCurrencyIdr,
  formatCurrencyUsd,
  UI_TEXT,
} from '../i18n/translations';
import { FrostedModal } from './FrostedModal';
import { StepFlowBar } from './StepFlowBar';
import {
  ArrowLeftRight,
  Film,
  HelpCircle,
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
  } = useProjectStore();

  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const t = UI_TEXT[language];
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';
  const heroCardClass =
    theme === 'dark' ? 'vv-card-hero-dark' : 'vv-card-hero-light';
  const inputClass =
    theme === 'dark' ? 'glass-input-dark' : 'glass-input-light';
  const { assumptions, calculation } = project;

  return (
    <div className="space-y-6">
      {/* Compact Context Header with Frosted Glass Guide Trigger */}
      <div
        className={`${cardClass} rounded-[16px] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="vv-badge-pill">
              <Sliders className="w-3.5 h-3.5 text-[#0099ff]" />
              <span>
                {isId
                  ? 'Langkah 02 • Pengaturan Dasar'
                  : 'Step 02 • Core Configuration'}
              </span>
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
              ? 'Tentukan identitas proyek, target hasil video akhir, serta persentase dana cadangan pembuatan ulang.'
              : 'Set your project identity, target video output, and redo reserve percentage.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsGuideOpen(true)}
          className="vv-btn-secondary px-4 py-2.5 text-xs shrink-0"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#0099ff]" />
          <span>
            {isId
              ? 'Penjelasan Cara Hitung & Cadangan'
              : 'How Modes & Reserve Work'}
          </span>
        </button>
      </div>

      {/* Main 2-Column Hierarchy Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* =================================================================
         * TIER 2 (Left 6 Cols): Project Identity & Target Output Workspace
         * ================================================================= */}
        <div
          className={`${cardClass} lg:col-span-6 rounded-[18px] p-6 flex flex-col justify-between space-y-5`}
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--vv-border)] pb-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)] flex items-center gap-2">
                <span className="font-mono text-[10px] text-[var(--vv-text-subtle)]">
                  01
                </span>
                <Film className="w-4 h-4 text-[#0099ff]" />
                <span>
                  {isId
                    ? 'Identitas Proyek & Target Video Jadi'
                    : 'Project Identity & Target Output'}
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

            {/* Mode Estimasi (Clean Segmented Control) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-[var(--vv-text-strong)]">
                  {isId
                    ? 'Cara Menghitung Kebutuhan Proyek'
                    : 'How to Calculate Project Needs'}
                </label>
                <button
                  type="button"
                  onClick={() => setIsGuideOpen(true)}
                  className="text-[11px] text-[#0099ff] hover:underline"
                >
                  {isId ? 'Apa bedanya?' : 'What is the difference?'}
                </button>
              </div>
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
                  {isId ? 'Rincian per Adegan' : 'Scene-by-Scene'}
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
                  {isId ? 'Dari Jumlah Video Jadi' : 'By Final Videos'}
                </button>
              </div>
            </div>

            {/* Target Videos & Final Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="vv-card-quiet p-3.5">
                <label className="block text-xs font-medium text-[var(--vv-text-strong)] mb-1.5">
                  {isId ? 'Target Jumlah Video Jadi' : 'Target Final Videos'}
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={assumptions.target_videos}
                  onChange={(e) => setTargetVideos(Number(e.target.value))}
                  className={`${inputClass} w-full px-3.5 py-2 rounded-[10px] text-sm font-bold tabular-nums text-right`}
                />
                <span className="block text-[11px] text-[var(--vv-text-muted)] mt-1.5">
                  {isId
                    ? `Rata-rata: ${formatCurrencyIdr(calculation.cost_per_video_idr, language)} / video`
                    : `Avg: ${formatCurrencyUsd(calculation.cost_per_video_usd, language)} / video`}
                </span>
              </div>

              <div className="vv-card-quiet p-3.5">
                <label className="block text-xs font-medium text-[var(--vv-text-strong)] mb-1.5">
                  {isId
                    ? 'Total Durasi Video (Menit)'
                    : 'Total Duration (Minutes)'}
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.25}
                  value={assumptions.final_duration_minutes}
                  onChange={(e) =>
                    setFinalDurationMinutes(Number(e.target.value))
                  }
                  className={`${inputClass} w-full px-3.5 py-2 rounded-[10px] text-sm font-bold tabular-nums text-right`}
                />
                <span className="block text-[11px] text-[var(--vv-text-muted)] mt-1.5">
                  {isId
                    ? `Rata-rata: ${formatCurrencyIdr(calculation.cost_per_minute_idr, language)} / menit`
                    : `Avg: ${formatCurrencyUsd(calculation.cost_per_minute_usd, language)} / min`}
                </span>
              </div>
            </div>

            {/* Conditional Default Shots per Video in Target Final Mode */}
            {assumptions.estimation_mode === 'target_final' && (
              <div className="p-4 rounded-[12px] bg-[#0099ff]/10 border border-[#0099ff]/30">
                <label className="block text-xs font-semibold text-[#7acaff] mb-1.5">
                  {isId
                    ? 'Rata-rata Jumlah Adegan di Setiap Video'
                    : 'Average Scenes per Final Video'}
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
              </div>
            )}
          </div>
        </div>

        {/* =================================================================
         * TIER 1 DOMINANT FOCAL POINT (Right 6 Cols):
         * Live Reserve Simulator & Bidirectional Sync (.vv-card-hero-*)
         * ================================================================= */}
        <div
          className={`${heroCardClass} lg:col-span-6 rounded-[18px] p-6 flex flex-col justify-between space-y-5`}
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--vv-border)] pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0099ff] flex items-center gap-2">
                <span className="vv-blue-dot" />
                <ArrowLeftRight className="w-4 h-4 text-[#ffb840]" />
                <span>
                  {isId
                    ? 'Dana Cadangan Buat Ulang (Otomatis Terhubung)'
                    : 'Redo Reserve Simulator (Auto-Synced)'}
                </span>
              </h2>
              <span className="vv-badge-pill">
                <span className="size-1.5 rounded-full bg-[#ffb840]" />
                <span>
                  {assumptions.reserve_input_mode === 'percent'
                    ? isId
                      ? 'Mode Persentase (%)'
                      : 'Percentage (%)'
                    : isId
                    ? 'Mode Jumlah Kali'
                    : 'Extra Count'}
                </span>
              </span>
            </div>

            {/* Quick Reserve Preset Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-[var(--vv-text-muted)]">
                {isId ? 'Pilihan Cepat Cadangan:' : 'Quick Reserve Presets:'}
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { pct: 10, label: isId ? '10% (Hemat)' : '10% (Lean)' },
                  { pct: 20, label: isId ? '20% (Standar)' : '20% (Standard)' },
                  { pct: 35, label: isId ? '35% (Aman)' : '35% (Safe)' },
                ].map((preset) => (
                  <button
                    key={preset.pct}
                    type="button"
                    onClick={() => setReserveByPercent(preset.pct)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition ${
                      calculation.effective_reserve_percent === preset.pct
                        ? 'bg-[#ffb840]/20 text-[#ffb840] border-[#ffb840]/50'
                        : 'bg-[var(--vv-tint-weak)] text-[var(--vv-text-muted)] border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Two Synced Input Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
              {/* Box A: Reserve Percentage */}
              <div
                className={`p-4 rounded-[14px] border transition flex flex-col justify-between ${
                  assumptions.reserve_input_mode === 'percent'
                    ? 'bg-[#ffb840]/10 border-[#ffb840]/50'
                    : 'bg-[var(--vv-tint-weak)] border-[var(--vv-border)]'
                }`}
              >
                <label className="block text-xs font-semibold mb-2">
                  {isId ? 'Persentase Cadangan (%)' : 'Reserve Percentage (%)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={assumptions.reserve_percent}
                    onChange={(e) => setReserveByPercent(Number(e.target.value))}
                    className={`${inputClass} w-full pr-8 pl-3.5 py-2.5 rounded-[10px] text-xl font-bold tabular-nums text-right`}
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

              {/* Box B: Extra Reserve Tries */}
              <div
                className={`p-4 rounded-[14px] border transition flex flex-col justify-between ${
                  assumptions.reserve_input_mode === 'count'
                    ? 'bg-[#0099ff]/10 border-[#0099ff]/50'
                    : 'bg-[var(--vv-tint-weak)] border-[var(--vv-border)]'
                }`}
              >
                <label className="block text-xs font-semibold mb-2">
                  {isId ? 'Jumlah Cadangan Buat Ulang' : 'Extra Reserve Tries'}
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={calculation.reserve_generations}
                  onChange={(e) => setReserveByCount(Number(e.target.value))}
                  className={`${inputClass} w-full px-3.5 py-2.5 rounded-[10px] text-xl font-bold tabular-nums text-right`}
                />
                <div className="text-[11px] text-[var(--vv-text-muted)] mt-3 text-right tabular-nums">
                  {isId
                    ? `${calculation.planned_generations} awal + ${calculation.reserve_generations} cadangan = ${calculation.budgeted_generations}x`
                    : `${calculation.planned_generations} initial + ${calculation.reserve_generations} reserve = ${calculation.budgeted_generations}x`}
                </div>
              </div>
            </div>
          </div>

          {/* Dominant Live Impact Box */}
          <div className="p-4 rounded-[14px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border-strong)] space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[var(--vv-text-muted)]">
                {t.baseCost} ({calculation.planned_generations}x):
              </span>
              <span className="font-semibold tabular-nums">
                {formatCurrencyIdr(calculation.base_cost_idr, language)} (
                {formatCurrencyUsd(calculation.base_cost_usd, language)})
              </span>
            </div>
            <div className="flex justify-between items-center text-[#ffb840]">
              <span>
                {t.reserveCost} (+{calculation.reserve_generations}x /{' '}
                {calculation.effective_reserve_percent}%):
              </span>
              <span className="font-semibold tabular-nums">
                +{formatCurrencyIdr(calculation.reserve_cost_idr, language)} (
                {formatCurrencyUsd(calculation.reserve_cost_usd, language)})
              </span>
            </div>
            <div className="pt-2.5 border-t border-[var(--vv-border)] flex justify-between items-baseline">
              <span className="font-bold text-sm">{t.totalBudget}:</span>
              <div className="text-right">
                <div className="text-xl font-bold tabular-nums text-[#0099ff]">
                  {formatCurrencyIdr(calculation.total_cost_idr, language)}
                </div>
                <div className="text-xs font-semibold tabular-nums text-[var(--vv-text-strong)]">
                  {formatCurrencyUsd(calculation.total_cost_usd, language)} &bull;{' '}
                  {calculation.budgeted_generations}{' '}
                  {isId ? 'kali buat' : 'total tries'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guided Step Flow Footer */}
      <StepFlowBar
        currentStepNumber={2}
        stepTitle={t.navSetup}
        nextStepHint={
          isId
            ? 'Langkah selanjutnya: Tambahkan atau atur daftar adegan video dan gambar AI yang ingin diproduksi.'
            : 'Next step: Add or configure the AI video scenes and images you want to produce.'
        }
        prevTab="dashboard"
        prevLabel={t.navDashboard}
        nextTab="planner"
        nextLabel={
          isId
            ? 'Lanjut ke Langkah 3: Daftar Pekerjaan AI'
            : 'Continue to Step 3: AI Production List'
        }
      />

      {/* =====================================================================
       * FROSTED GLASS MODAL: Panduan Mode Hitung & Dana Cadangan AI
       * ===================================================================== */}
      <FrostedModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        theme={theme}
        maxWidth="2xl"
        badgeLabel={isId ? 'Panduan Pengaturan Proyek' : 'Project Setup Guide'}
        title={
          isId ? (
            <>
              Memahami Cara Hitung &{' '}
              <span className="vv-accent text-[#0099ff]">Dana Cadangan AI</span>
            </>
          ) : (
            <>
              Understanding Calculation Modes &{' '}
              <span className="vv-accent text-[#0099ff]">AI Reserve Budget</span>
            </>
          )
        }
        subtitle={
          isId
            ? 'Penjelasan singkat dengan bahasa sehari-hari agar Anda dapat memilih pengaturan yang paling pas.'
            : 'A plain-language explanation so you can choose the best settings for your project.'
        }
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="vv-card-quiet p-4 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm text-[#0099ff]">
                <Sparkles className="w-4 h-4" />
                <span>
                  {isId ? 'Mode 1: Rincian per Adegan' : 'Mode 1: Scene-by-Scene'}
                </span>
              </div>
              <p className="text-[var(--vv-text-muted)] leading-relaxed">
                {isId
                  ? 'Gunakan mode ini jika Anda ingin mencatat setiap adegan atau gambar satu per satu sesuai daftar cerita (storyboard). Jumlah adegan yang Anda ketik adalah jumlah total yang dihitung.'
                  : 'Use this mode when listing each specific scene or image individually. The scene count you enter is the exact count calculated.'}
              </p>
            </div>

            <div className="vv-card-quiet p-4 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm text-[#0099ff]">
                <Target className="w-4 h-4" />
                <span>
                  {isId
                    ? 'Mode 2: Dari Jumlah Video Jadi'
                    : 'Mode 2: By Total Final Videos'}
                </span>
              </div>
              <p className="text-[var(--vv-text-muted)] leading-relaxed">
                {isId
                  ? 'Gunakan mode ini jika Anda ingin membuat banyak video dengan pola yang sama (misal: 5 video iklan sosmed). Jumlah adegan di daftar pekerjaan akan otomatis dikalikan dengan Target Jumlah Video Jadi.'
                  : 'Use this mode when producing multiple videos with a similar structure (e.g., 5 social ads). Scene counts are automatically multiplied by your Target Final Videos.'}
              </p>
            </div>
          </div>

          <div className="vv-card-quiet p-4 space-y-2 border-[#ffb840]/30">
            <div className="flex items-center gap-2 font-semibold text-sm text-[#ffb840]">
              <ArrowLeftRight className="w-4 h-4" />
              <span>
                {isId
                  ? 'Mengapa Perlu Dana Cadangan Buat Ulang?'
                  : 'Why Set a Redo Reserve?'}
              </span>
            </div>
            <p className="text-[var(--vv-text-muted)] leading-relaxed">
              {isId
                ? 'Saat membuat video dengan AI, terkadang gerakan kamera atau ekspresi wajah belum langsung sempurna di percobaan pertama. Menyisihkan cadangan 15% hingga 25% menjaga agar anggaran Anda tetap aman tanpa takut kekurangan biaya di tengah produksi.'
                : 'When generating AI video, motion or details may take a few extra tries to look right. Setting a 15%–25% reserve keeps your budget safe from unexpected overruns.'}
            </p>
          </div>
        </div>
      </FrostedModal>
    </div>
  );
};
