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
    setTargetVideos,
    setReserveByPercent,
    setReserveByCount,
    setCadanganMultiplier,
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
              ? 'Tentukan nama proyek dan angka cadangan percobaan. Seluruh rincian adegan diatur terpusat di Langkah 3.'
              : 'Set your project name and contingency multiplier. All scene details are configured centrally in Step 3.'}
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

            {/* Input Jumlah Video (Fitur 1 Multi-Video) */}
            <div className="p-4 rounded-[14px] bg-[#0099ff]/10 border border-[#0099ff]/40 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[var(--vv-text-strong)] flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-[#0099ff]" />
                  <span>
                    {isId
                      ? 'Jumlah Video yang Ingin Dibuat'
                      : 'Target Number of Videos to Produce'}
                  </span>
                </label>
                <span className="text-xs font-mono font-bold text-[#0099ff]">
                  {assumptions.target_videos || 1} {isId ? 'video' : 'videos'}
                </span>
              </div>

              {/* Pilihan Cepat Preset Video */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { count: 1, label: isId ? '1 Video (Tunggal)' : '1 Video (Single)' },
                  { count: 3, label: isId ? '3 Video' : '3 Videos' },
                  { count: 5, label: isId ? '5 Video' : '5 Videos' },
                  { count: 10, label: isId ? '10 Video' : '10 Videos' },
                ].map((preset) => (
                  <button
                    key={preset.count}
                    type="button"
                    onClick={() => setTargetVideos(preset.count)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition ${
                      (assumptions.target_videos || 1) === preset.count
                        ? 'bg-[#0099ff]/20 text-[#0099ff] border-[#0099ff]/50 font-bold'
                        : 'bg-[var(--vv-tint-weak)] text-[var(--vv-text-muted)] border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={100}
                  step={1}
                  value={assumptions.target_videos || 1}
                  onChange={(e) =>
                    setTargetVideos(Math.max(1, Number(e.target.value) || 1))
                  }
                  className={`${inputClass} w-full pr-20 pl-3.5 py-2.5 rounded-[10px] text-xl font-bold tabular-nums text-right`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--vv-text-muted)] pointer-events-none">
                  {isId ? 'video' : 'videos'}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={Math.min(20, Math.max(1, assumptions.target_videos || 1))}
                onChange={(e) => setTargetVideos(Number(e.target.value))}
                className="w-full accent-[#0099ff] cursor-pointer"
              />
              <p className="text-[11px] text-[var(--vv-text-muted)] leading-relaxed">
                {isId
                  ? `💡 Langkah 3 memproyeksikan kebutuhan untuk 1 video. Hasil perhitungan di Langkah 3 akan otomatis dikalikan ${assumptions.target_videos || 1} video untuk total anggaran akhir.`
                  : `💡 Step 3 projects requirements for 1 video. Step 3 calculation will be automatically multiplied by ${assumptions.target_videos || 1} videos for the grand total.`}
              </p>
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
        {(() => {
          const cadanganCount = assumptions.default_attempts_per_shot || 2;

          return (
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
                        ? 'Dana Jaga-Jaga Proyek (Cadangan Percobaan)'
                        : 'Project Safety Reserve (Contingency Multiplier)'}
                    </span>
                  </h2>
                  <span className="vv-badge-pill">
                    <span className="size-1.5 rounded-full bg-[#0099ff]" />
                    <span className="font-semibold">
                      {isId ? `${cadanganCount}x Cadangan` : `${cadanganCount}x Reserve`}
                    </span>
                  </span>
                </div>

                {/* Pilihan Cepat Preset Cadangan */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-[var(--vv-text-muted)]">
                    {isId ? 'Pilihan Cepat Cadangan:' : 'Quick Reserve Presets:'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[
                      { count: 2, label: isId ? '2 cadangan (Hemat)' : '2x (Lean)' },
                      { count: 5, label: isId ? '5 cadangan (Standar)' : '5x (Standard)' },
                      { count: 10, label: isId ? '10 cadangan (Aman)' : '10x (Safe)' },
                    ].map((preset) => (
                      <button
                        key={preset.count}
                        type="button"
                        onClick={() => setCadanganMultiplier(preset.count)}
                        className={`px-3 py-1 rounded-full text-[11px] font-medium border transition ${
                          cadanganCount === preset.count
                            ? 'bg-[#0099ff]/20 text-[#0099ff] border-[#0099ff]/50 font-bold'
                            : 'bg-[var(--vv-tint-weak)] text-[var(--vv-text-muted)] border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kotak Input Cadangan Langsung */}
                <div className="p-4 rounded-[14px] bg-[#0099ff]/10 border border-[#0099ff]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[var(--vv-text-strong)]">
                      {isId
                        ? 'Angka Cadangan Percobaan per Adegan / Gambar'
                        : 'Reserve Multiplier per Scene / Image'}
                    </label>
                    <span className="text-xs font-mono font-bold text-[#0099ff]">
                      {cadanganCount}x {isId ? 'cadangan' : 'reserve'}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={50}
                      step={1}
                      value={cadanganCount}
                      onChange={(e) => setCadanganMultiplier(Number(e.target.value))}
                      className={`${inputClass} w-full pr-24 pl-3.5 py-2.5 rounded-[10px] text-xl font-bold tabular-nums text-right`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--vv-text-muted)] pointer-events-none">
                      {isId ? 'cadangan' : 'reserve'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    step={1}
                    value={Math.min(20, Math.max(1, cadanganCount))}
                    onChange={(e) => setCadanganMultiplier(Number(e.target.value))}
                    className="w-full accent-[#0099ff] cursor-pointer"
                  />
                  <p className="text-[11px] text-[var(--vv-text-muted)] leading-relaxed">
                    {isId
                      ? `Rumus di Langkah 3: Kebutuhan gambar × ${cadanganCount} cadangan = Total kali buat. Contoh: butuh 20 gambar × ${cadanganCount} cadangan = ${20 * cadanganCount} kali buat.`
                      : `Formula in Step 3: Scene requirement × ${cadanganCount} reserve = Total tries. Example: need 20 images × ${cadanganCount} reserve = ${20 * cadanganCount} tries.`}
                  </p>
                </div>
              </div>

              {/* Kotak Rangkuman Dampak Anggaran */}
              <div className="p-4 rounded-[14px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border-strong)] space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--vv-text-muted)]">
                    {isId ? 'Total Kebutuhan Adegan:' : 'Total Scene Items:'}
                  </span>
                  <span className="font-semibold tabular-nums">
                    {project.items.reduce((sum, item) => sum + item.quantity, 0)}{' '}
                    {isId ? 'adegan / gambar' : 'items'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#0099ff]">
                  <span>
                    {isId ? 'Dikalikan Cadangan Langkah 2:' : 'Multiplied by Step 2 Reserve:'}
                  </span>
                  <span className="font-semibold tabular-nums">
                    &times; {cadanganCount} cadangan
                  </span>
                </div>
                {calculation.target_videos > 1 && (
                  <div className="flex justify-between items-center text-emerald-400">
                    <span>
                      {isId ? 'Dikalikan Jumlah Video:' : 'Multiplied by Target Videos:'}
                    </span>
                    <span className="font-semibold tabular-nums">
                      &times; {calculation.target_videos} video
                    </span>
                  </div>
                )}
                <div className="pt-2.5 border-t border-[var(--vv-border)] flex justify-between items-baseline">
                  <span className="font-bold text-sm">{t.totalBudget}:</span>
                  <div className="text-right">
                    <div className="text-xl font-bold tabular-nums text-[#0099ff]">
                      {formatCurrencyIdr(calculation.total_cost_idr, language)}
                    </div>
                    {calculation.target_videos > 1 && (
                      <div className="text-[11px] text-[#7acaff] font-medium">
                        {isId
                          ? `(Proyeksi: ${formatCurrencyIdr(calculation.one_video_total_cost_idr, language)} / 1 video × ${calculation.target_videos} video)`
                          : `(Projection: ${formatCurrencyUsd(calculation.one_video_total_cost_usd, language)} / 1 video × ${calculation.target_videos} videos)`}
                      </div>
                    )}
                    <div className="text-xs font-semibold tabular-nums text-[var(--vv-text-strong)]">
                      {formatCurrencyUsd(calculation.total_cost_usd, language)} &bull;{' '}
                      {calculation.budgeted_generations}{' '}
                      {isId ? 'kali buat' : 'total tries'}
                      {calculation.total_credit !== null
                        ? ` • ${calculation.total_credit} Credit`
                        : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
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
                ? 'Saat membuat video atau gambar dengan AI, hasil percobaan pertama belum tentu langsung sesuai selera (misal: ada glitch visual atau pose kurang pas). Menyiapkan angka cadangan (misal: 5 atau 10 cadangan) memastikan tim Anda memiliki jatah coba yang cukup tanpa takut kehabisan anggaran di tengah jalan.'
                : 'When generating AI video or images, the first take might not always be perfect. Setting a reserve factor (e.g., 5 or 10 tries) ensures your team has enough retries without running out of credits.'}
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
                ? 'Di Langkah 3 (Daftar Pekerjaan AI), Anda hanya perlu menentukan berapa banyak gambar atau adegan yang Anda butuhkan. Sistem akan otomatis mengalikan kebutuhan Anda dengan angka cadangan ini (misal: 20 gambar × 10 cadangan = 200 kali buat).'
                : 'In Step 3 (AI Production List), you simply enter how many finished images or scenes you need. The system automatically multiplies your requirement by this reserve count (e.g. 20 images × 10 reserve = 200 tries).'}
            </p>
          </div>
        </div>
      </FrostedModal>
    </div>
  );
};
