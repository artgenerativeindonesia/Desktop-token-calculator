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
  CheckCircle2,
  Film,
  Globe,
  HelpCircle,
  ShieldAlert,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const ProjectSetupView: React.FC = () => {
  const {
    project,
    language,
    theme,
    setProjectName,
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
  const { assumptions, calculation, exchange_rate } = project;

  return (
    <div className="space-y-6">
      {/* Header Langkah 2 */}
      <div
        className={`${cardClass} rounded-[16px] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="vv-badge-pill">
              <Sliders className="w-3.5 h-3.5 text-[#0099ff]" />
              <span>
                {isId
                  ? 'Langkah 02 • Nama Proyek & Dana Jaga-Jaga'
                  : 'Step 02 • Project Name & Safety Reserve'}
              </span>
            </span>
          </div>
          <h1 className="text-2xl font-medium tracking-[-0.035em]">
            {isId ? (
              <>
                Identitas Proyek &{' '}
                <span className="vv-accent text-[#0099ff]">
                  Dana Jaga-Jaga (Cadangan)
                </span>
              </>
            ) : (
              <>
                Project Identity &{' '}
                <span className="vv-accent text-[#0099ff]">
                  Safety Reserve
                </span>
              </>
            )}
          </h1>
          <p className="text-xs text-[var(--vv-text-muted)] mt-1">
            {isId
              ? 'Tentukan nama proyek dan persentase dana jaga-jaga cadangan. Seluruh rincian adegan diatur terpusat di Langkah 3.'
              : 'Set your project name and contingency reserve. All scene details are configured centrally in Step 3.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsGuideOpen(true)}
          className="vv-btn-secondary px-4 py-2.5 text-xs shrink-0"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#0099ff]" />
          <span>
            {isId ? 'Panduan Dana Jaga-Jaga' : 'Safety Reserve Guide'}
          </span>
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* =================================================================
         * KOLOM KIRI (6 Cols): Identitas Proyek & Alur Kerja Bersih
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
                  {isId ? 'Identitas Proyek' : 'Project Identity'}
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

            {/* Penjelasan Alur Kerja Terpusat */}
            <div className="vv-card-quiet p-4 space-y-3 rounded-[14px]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--vv-text-strong)]">
                <Sparkles className="w-4 h-4 text-[#0099ff]" />
                <span>
                  {isId
                    ? 'Alur Kerja Rapi & Tanpa Input Dobel'
                    : 'Clean Single-Source Workflow'}
                </span>
              </div>
              <p className="text-xs text-[var(--vv-text-muted)] leading-relaxed">
                {isId
                  ? 'Anda tidak perlu mengisi jumlah adegan atau perkiraan durasi di sini. Seluruh rincian gambar, adegan, dan durasi detik video diatur sepenuhnya dan langsung di Langkah 3 (Daftar Pekerjaan AI).'
                  : 'You do not need to enter scene counts here. All images, scenes, and clip durations are managed directly and centrally in Step 3.'}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#0099ff] font-medium pt-1 border-t border-[var(--vv-border)]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isId
                    ? 'Dana jaga-jaga di sebelah kanan akan otomatis terhubung ke semua adegan Anda.'
                    : 'The safety reserve on the right automatically connects to all your scenes.'}
                </span>
              </div>
            </div>

            {/* Info Kurs Acuan */}
            <div className="vv-card-quiet p-3.5 flex items-center justify-between text-xs rounded-[12px]">
              <span className="text-[var(--vv-text-muted)] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#0099ff]" />
                <span>{isId ? 'Patokan Kurs Dolar:' : 'USD Exchange Rate:'}</span>
              </span>
              <strong className="tabular-nums text-[var(--vv-text-strong)]">
                {exchange_rate.rate
                  ? `1 USD = ${formatCurrencyIdr(exchange_rate.rate, language)}`
                  : t.unavailableLabel}
              </strong>
            </div>
          </div>
        </div>

        {/* =================================================================
         * KOLOM KANAN (6 Cols): Dana Jaga-Jaga (Cadangan) Otomatis Terhubung
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
                    ? 'Dana Jaga-Jaga Proyek (Cadangan Tambahan)'
                    : 'Project Safety Reserve (Contingency Buffer)'}
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

            {/* Pilihan Cepat Preset Cadangan */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-[var(--vv-text-muted)]">
                {isId ? 'Pilihan Cepat Jaga-Jaga:' : 'Quick Reserve Presets:'}
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

            {/* Dua Kotak Input Sinkron */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
              {/* Kotak A: Persentase Cadangan */}
              <div
                className={`p-4 rounded-[14px] border transition flex flex-col justify-between ${
                  assumptions.reserve_input_mode === 'percent'
                    ? 'bg-[#ffb840]/10 border-[#ffb840]/50'
                    : 'bg-[var(--vv-tint-weak)] border-[var(--vv-border)]'
                }`}
              >
                <label className="block text-xs font-semibold mb-2">
                  {isId
                    ? 'Persentase Jaga-Jaga (%)'
                    : 'Reserve Percentage (%)'}
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

              {/* Kotak B: Jumlah Percobaan Tambahan */}
              <div
                className={`p-4 rounded-[14px] border transition flex flex-col justify-between ${
                  assumptions.reserve_input_mode === 'count'
                    ? 'bg-[#0099ff]/10 border-[#0099ff]/50'
                    : 'bg-[var(--vv-tint-weak)] border-[var(--vv-border)]'
                }`}
              >
                <label className="block text-xs font-semibold mb-2">
                  {isId
                    ? 'Jumlah Kali Jaga-Jaga Tambahan'
                    : 'Extra Reserve Generations'}
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
                    ? `${calculation.planned_generations} awal + ${calculation.reserve_generations} jaga-jaga = ${calculation.budgeted_generations}x`
                    : `${calculation.planned_generations} initial + ${calculation.reserve_generations} reserve = ${calculation.budgeted_generations}x`}
                </div>
              </div>
            </div>
          </div>

          {/* Kotak Rangkuman Dampak Anggaran */}
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

      {/* Modal Panduan */}
      <FrostedModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
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
                ? 'Saat membuat video atau gambar dengan AI, terkadang hasil pertama belum tentu 100% sesuai selera (misal: ada glitch visual atau pose kurang pas). Menyiapkan dana jaga-jaga 10% hingga 20% memastikan tim Anda memiliki cadangan biaya yang aman tanpa takut kehabisan anggaran di tengah jalan.'
                : 'When generating AI video or images, the first result might not always be perfect. Setting aside a 10%–20% reserve ensures your team has a safe contingency budget without fearing unexpected overruns.'}
            </p>
          </div>

          <div className="vv-card-quiet p-4 space-y-2 rounded-[12px]">
            <div className="flex items-center gap-2 font-semibold text-sm text-[#0099ff]">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isId
                  ? 'Bagaimana Dana Ini Terhubung ke Adegan?'
                  : 'How Does This Connect to Scenes?'}
              </span>
            </div>
            <p className="text-[var(--vv-text-muted)] leading-relaxed">
              {isId
                ? 'Di Langkah 3 (Daftar Pekerjaan AI), Anda hanya perlu menentukan berapa banyak gambar atau adegan yang ingin dibuat dan berapa variasi pilihannya. Sistem akan otomatis menambahkan persentase jaga-jaga dari sini ke setiap adegan secara proporsional.'
                : 'In Step 3 (AI Production List), you simply define how many images or scenes you need and their variation counts. The system automatically applies this safety percentage to every stage proportionally.'}
            </p>
          </div>
        </div>
      </FrostedModal>
    </div>
  );
};
