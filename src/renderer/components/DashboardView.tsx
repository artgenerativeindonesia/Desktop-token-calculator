import React, { useRef } from 'react';
import { useProjectStore } from '../store/projectStore';
import {
  CATEGORY_LABELS,
  formatCurrencyIdr,
  formatCurrencyUsd,
  UI_TEXT,
} from '../i18n/translations';
import { StatusBadge } from './StatusBadge';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Coins,
  FileDown,
  FilePlus2,
  Film,
  FlaskConical,
  FolderOpen,
  Layers,
  RefreshCw,
  Save,
  Sparkles,
} from 'lucide-react';
import { ProcessCategory } from '../../shared/types/project';

const ALL_CATEGORIES: ProcessCategory[] = [
  'text_to_image',
  'image_to_video',
  'video_to_video',
  'text_to_video',
  'upscaling',
];

export const DashboardView: React.FC = () => {
  const {
    project,
    language,
    theme,
    hasUnsavedChanges,
    currentFilePath,
    recentProjects,
    isRefreshingFx,
    setActiveTab,
    createNewBlankProject,
    loadPrdSyntheticTest,
    loadCommercialSample,
    saveProjectFile,
    openProjectFile,
    importProjectFromJsonText,
    refreshExchangeRateAuto,
  } = useProjectStore();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const t = UI_TEXT[language];
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';
  const calc = project.calculation;

  const handleBrowserFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        importProjectFromJsonText(reader.result, file.name);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Hidden input fallback for browser file open */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".aivbudget,.json"
        className="hidden"
        onChange={handleBrowserFileUpload}
      />

      {/* Visuvate Studio Hero Card */}
      <div className={`${cardClass} rounded-[16px] p-6 md:p-7 relative overflow-hidden`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="vv-badge-pill">
                <span className="vv-blue-dot" />
                <span>
                  {isId ? 'Katalog Resmi Higgsfield AI' : 'Official Higgsfield AI Catalog'}
                </span>
              </span>
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-medium border ${
                  hasUnsavedChanges
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                }`}
              >
                {hasUnsavedChanges ? t.unsavedBadge : t.savedBadge}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-medium tracking-[-0.04em] leading-tight">
              {project.project_name ? (
                <>
                  <span>{project.project_name.split(' ').slice(0, -1).join(' ') || project.project_name} </span>
                  {project.project_name.split(' ').length > 1 && (
                    <span className="vv-accent text-[#0099ff]">
                      {project.project_name.split(' ').slice(-1)[0]}
                    </span>
                  )}
                </>
              ) : isId ? (
                <>
                  Proyek <span className="vv-accent text-[#0099ff]">Tanpa Nama</span>
                </>
              ) : (
                <>
                  Untitled <span className="vv-accent text-[#0099ff]">Project</span>
                </>
              )}
            </h1>

            <p className="text-xs text-[var(--vv-text-muted)] mt-1.5">
              {currentFilePath
                ? `${isId ? 'Tersimpan di' : 'Saved at'}: ${currentFilePath}`
                : isId
                ? 'Proyek belum disimpan ke komputer Anda'
                : 'Project has not been saved to your computer yet'}
            </p>
          </div>

          {/* Visuvate Pill Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => createNewBlankProject()}
              className="vv-btn-secondary px-4 py-2 text-xs"
            >
              <FilePlus2 className="w-3.5 h-3.5 text-[#0099ff]" />
              <span>{t.btnNewProject}</span>
            </button>

            <button
              onClick={() => {
                if (window.api) {
                  openProjectFile();
                } else {
                  fileInputRef.current?.click();
                }
              }}
              className="vv-btn-secondary px-4 py-2 text-xs"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#ffb840]" />
              <span>{t.btnOpenProject}</span>
            </button>

            <button
              onClick={() => saveProjectFile(false)}
              className="vv-btn-primary px-4 py-2 text-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.btnSaveProject}</span>
            </button>

            <button
              onClick={() => setActiveTab('pdf')}
              className="vv-btn-accent px-4 py-2 text-xs"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{t.btnExportPdf}</span>
            </button>
          </div>
        </div>

        {/* One-Click Preset Bar */}
        <div className="mt-6 pt-4 border-t border-[var(--vv-border)] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[var(--vv-text-muted)] flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-[#0099ff] shrink-0" />
            <span>
              {isId
                ? 'Ingin langsung melihat contoh hitungan tanpa mengetik dari awal?'
                : 'Want to see a working sample budget right away without typing?'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={loadPrdSyntheticTest}
              className="vv-btn-secondary px-3.5 py-1.5 text-xs"
            >
              <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.btnLoadPrdTest}</span>
            </button>
            <button
              onClick={loadCommercialSample}
              className="vv-btn-secondary px-3.5 py-1.5 text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0099ff]" />
              <span>{t.btnLoadCommercialDemo}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visuvate 4-Column Architectural Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 01: Biaya Utama */}
        <div className={`${cardClass} rounded-[14px] p-5 flex flex-col justify-between`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tabular-nums text-[var(--vv-text-subtle)]">
                01
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--vv-text-muted)]">
                {t.baseCost}
              </span>
            </div>
            <Layers className="w-4 h-4 text-[var(--vv-text-subtle)]" />
          </div>
          <div className="mt-4 text-right">
            <div className="text-2xl font-semibold tabular-nums tracking-tight">
              {formatCurrencyUsd(calc.base_cost_usd, language)}
            </div>
            <div className="text-xs text-[var(--vv-text-muted)] tabular-nums mt-0.5">
              {formatCurrencyIdr(calc.base_cost_idr, language)}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--vv-border)] flex justify-between text-xs text-[var(--vv-text-muted)]">
            <span>{t.plannedGenerations}</span>
            <span className="font-semibold tabular-nums text-[var(--vv-text-primary)]">
              {calc.planned_generations} {isId ? 'kali' : 'tries'}
            </span>
          </div>
        </div>

        {/* Card 02: Biaya Cadangan */}
        <div className={`${cardClass} rounded-[14px] p-5 flex flex-col justify-between`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tabular-nums text-[var(--vv-text-subtle)]">
                02
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--vv-text-muted)]">
                {t.reserveCost} ({calc.effective_reserve_percent}%)
              </span>
            </div>
            <RefreshCw className="w-4 h-4 text-[#ffb840]" />
          </div>
          <div className="mt-4 text-right">
            <div className="text-2xl font-semibold tabular-nums tracking-tight text-[#ffb840]">
              {formatCurrencyUsd(calc.reserve_cost_usd, language)}
            </div>
            <div className="text-xs text-[var(--vv-text-muted)] tabular-nums mt-0.5">
              {formatCurrencyIdr(calc.reserve_cost_idr, language)}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--vv-border)] flex justify-between text-xs text-[var(--vv-text-muted)]">
            <span>{t.reserveGenerations}</span>
            <span className="font-semibold tabular-nums text-[#ffb840]">
              +{calc.reserve_generations} {isId ? 'kali' : 'tries'}
            </span>
          </div>
        </div>

        {/* Card 03: Total Seluruh Anggaran (Featured Studio Card) */}
        <div
          className={`${cardClass} rounded-[14px] p-5 flex flex-col justify-between ring-1 ring-[#0099ff]/45`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="vv-blue-dot" />
              <span className="text-xs font-semibold text-[#0099ff] uppercase tracking-wider">
                {t.totalBudget}
              </span>
            </div>
            {calc.is_complete ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#ffb840]" />
            )}
          </div>
          <div className="mt-4 text-right">
            <div className="text-2xl font-bold tabular-nums tracking-tight">
              {formatCurrencyUsd(calc.total_cost_usd, language)}
            </div>
            <div className="text-sm font-semibold text-[#0099ff] tabular-nums mt-0.5">
              {formatCurrencyIdr(calc.total_cost_idr, language)}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--vv-border)] flex justify-between text-xs">
            <span className="text-[var(--vv-text-muted)]">{t.budgetedGenerations}</span>
            <span className="font-bold tabular-nums">
              {calc.budgeted_generations} {isId ? 'kali' : 'tries'}
            </span>
          </div>
        </div>

        {/* Card 04: Pemakaian Credit & Rata-rata */}
        <div className={`${cardClass} rounded-[14px] p-5 flex flex-col justify-between`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tabular-nums text-[var(--vv-text-subtle)]">
                04
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--vv-text-muted)]">
                {t.totalCredit}
              </span>
            </div>
            <Coins className="w-4 h-4 text-[#7acaff]" />
          </div>
          <div className="mt-4 text-right">
            <div className="text-xl font-semibold tabular-nums tracking-tight text-[#7acaff]">
              {calc.total_credit !== null
                ? `${calc.total_credit.toLocaleString()} Credits`
                : t.unavailableLabel}
            </div>
            <div className="text-xs text-[var(--vv-text-muted)] tabular-nums mt-1">
              {t.costPerVideo}:{' '}
              <strong className="text-[var(--vv-text-primary)]">
                {formatCurrencyUsd(calc.cost_per_video_usd, language)}
              </strong>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--vv-border)] flex justify-between text-xs text-[var(--vv-text-muted)]">
            <span>{t.costPerMinute}</span>
            <span className="font-semibold tabular-nums text-[var(--vv-text-primary)]">
              {formatCurrencyUsd(calc.cost_per_minute_usd, language)}
            </span>
          </div>
        </div>
      </div>

      {/* Baris Status Kurs USD/IDR & Ringkasan Kategori */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`${cardClass} rounded-[14px] p-6 lg:col-span-2`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tabular-nums text-[var(--vv-text-subtle)]">
                05
              </span>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)]">
                {isId
                  ? 'Ringkasan Biaya Berdasarkan Jenis Pembuatan AI'
                  : 'Cost Breakdown by AI Creation Type'}
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('planner')}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#0099ff] hover:underline"
            >
              {isId ? 'Atur Daftar Pekerjaan' : 'Edit Production List'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--vv-border)] text-[var(--vv-text-muted)]">
                  <th className="py-2.5 text-left font-medium">{isId ? 'Jenis Pembuatan AI' : 'AI Creation Type'}</th>
                  <th className="py-2.5 text-right font-medium">{isId ? 'Jumlah Tahap' : 'Stages'}</th>
                  <th className="py-2.5 text-right font-medium">{isId ? 'Total Kali Buat' : 'Total Tries'}</th>
                  <th className="py-2.5 text-right font-medium">{isId ? 'Subtotal (USD)' : 'Subtotal (USD)'}</th>
                  <th className="py-2.5 text-right font-medium">{isId ? 'Subtotal (Rupiah)' : 'Subtotal (IDR)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--vv-border)]">
                {ALL_CATEGORIES.map((cat) => {
                  const sum = calc.category_summaries[cat];
                  return (
                    <tr key={cat} className="hover:bg-[var(--vv-tint-weak)] transition-colors">
                      <td className="py-3 font-medium">
                        {CATEGORY_LABELS[cat][language]}
                        {sum.has_incomplete_items && (
                          <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/25">
                            {isId ? 'Belum Diisi' : 'Incomplete'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right tabular-nums text-[var(--vv-text-muted)]">{sum.item_count}</td>
                      <td className="py-3 text-right tabular-nums text-[var(--vv-text-muted)]">
                        {sum.budgeted_generations}
                      </td>
                      <td className="py-3 text-right font-semibold tabular-nums">
                        {formatCurrencyUsd(sum.total_cost_usd, language)}
                      </td>
                      <td className="py-3 text-right text-[var(--vv-text-muted)] tabular-nums">
                        {formatCurrencyIdr(sum.total_cost_idr, language)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Kurs & Target Video */}
        <div className={`${cardClass} rounded-[14px] p-6 flex flex-col justify-between space-y-4`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tabular-nums text-[var(--vv-text-subtle)]">
                  06
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)]">
                  {t.exchangeRateLabel}
                </span>
              </div>
              <StatusBadge
                status={project.exchange_rate.status}
                language={language}
              />
            </div>
            <div className="text-2xl font-bold tabular-nums text-right my-2.5 tracking-tight">
              1 USD ={' '}
              {project.exchange_rate.rate
                ? formatCurrencyIdr(project.exchange_rate.rate, language)
                : t.unavailableLabel}
            </div>
            <div className="text-[11px] text-[var(--vv-text-muted)] space-y-1">
              <div>
                <strong className="text-[var(--vv-text-strong)]">{isId ? 'Sumber:' : 'Source:'}</strong>{' '}
                {project.exchange_rate.source_name}
              </div>
              <div>
                <strong className="text-[var(--vv-text-strong)]">{isId ? 'Keterangan:' : 'Rate Type:'}</strong>{' '}
                {project.exchange_rate.rate_type}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{project.exchange_rate.retrieved_at.slice(0, 19).replace('T', ' ')}</span>
              </div>
            </div>
            <div className="mt-3.5 flex gap-2">
              <button
                onClick={refreshExchangeRateAuto}
                disabled={isRefreshingFx}
                className="vv-btn-secondary flex-1 py-1.5 px-3 text-xs"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRefreshingFx ? 'animate-spin' : ''}`}
                />
                <span>{t.refreshRateBtn}</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className="vv-btn-secondary py-1.5 px-3 text-xs"
              >
                {isId ? 'Ubah Sendiri' : 'Edit Rate'}
              </button>
            </div>
          </div>

          <div className="pt-3.5 border-t border-[var(--vv-border)]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)] mb-2.5">
              <Film className="w-3.5 h-3.5 text-[#0099ff]" />
              <span>{isId ? 'Target Hasil Akhir Proyek' : 'Project Target Output'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-[10px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border)]">
                <div className="text-[var(--vv-text-muted)]">{isId ? 'Target Video Jadi' : 'Final Videos'}</div>
                <div className="text-base font-bold tabular-nums text-right mt-1">
                  {project.assumptions.target_videos}
                </div>
              </div>
              <div className="p-3 rounded-[10px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border)]">
                <div className="text-[var(--vv-text-muted)]">{isId ? 'Total Durasi Video' : 'Total Duration'}</div>
                <div className="text-base font-bold tabular-nums text-right mt-1">
                  {project.assumptions.final_duration_minutes} {isId ? 'menit' : 'min'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Kelengkapan Data & Proyek Terakhir */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={`${cardClass} rounded-[14px] p-6`}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)] mb-3">
            {isId
              ? 'Status Kelengkapan Data & Info Penting'
              : 'Data Completeness & Important Notes'}
          </h3>
          {calc.warnings.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-[10px] p-3.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                {isId
                  ? 'Semua harga model AI dan kurs Rupiah sudah lengkap dan siap digunakan.'
                  : 'All AI model prices and exchange rates are complete and ready.'}
              </span>
            </div>
          ) : (
            <ul className="space-y-2 text-xs">
              {calc.warnings.map((w, i) => (
                <li
                  key={`${w.code}_${i}`}
                  className={`p-3 rounded-[10px] border flex items-start gap-2 ${
                    w.severity === 'error'
                      ? 'bg-rose-500/10 border-rose-400/30 text-rose-300'
                      : w.severity === 'warning'
                      ? 'bg-amber-500/10 border-amber-400/30 text-amber-300'
                      : 'bg-[#0099ff]/10 border-[#0099ff]/30 text-[#7acaff]'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{isId ? w.message_id : w.message_en}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`${cardClass} rounded-[14px] p-6`}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)] mb-3">
            {isId
              ? 'Proyek yang Terakhir Disimpan / Dibuka'
              : 'Recently Saved / Opened Projects'}
          </h3>
          {recentProjects.length === 0 ? (
            <div className="text-xs text-[var(--vv-text-muted)] p-5 text-center border border-dashed border-[var(--vv-border-strong)] rounded-[10px]">
              {isId
                ? 'Belum ada proyek yang pernah Anda simpan di komputer ini.'
                : 'No projects saved on this computer yet.'}
            </div>
          ) : (
            <div className="space-y-2">
              {recentProjects.map((rec) => (
                <button
                  key={rec.file_path}
                  onClick={() => openProjectFile(rec.file_path)}
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
    </div>
  );
};
