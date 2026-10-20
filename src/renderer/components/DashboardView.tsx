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

      {/* Hero Welcome & Quick Actions Card */}
      <div className={`${cardClass} rounded-2xl p-6`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-400 border border-sky-400/30">
                PRD v1.0 • Higgsfield AI Catalog
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  hasUnsavedChanges
                    ? 'bg-amber-500/15 text-amber-400 border-amber-400/30'
                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-400/30'
                }`}
              >
                {hasUnsavedChanges ? t.unsavedBadge : t.savedBadge}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {project.project_name || (isId ? 'Proyek Tanpa Nama' : 'Untitled Project')}
            </h1>
            <p className="text-xs opacity-70 mt-1">
              {currentFilePath
                ? `${isId ? 'Lokasi File' : 'File Path'}: ${currentFilePath}`
                : isId
                ? 'Proyek lokal mandiri (.aivbudget) — belum disimpan ke file disk'
                : 'Standalone local project (.aivbudget) — not yet saved to disk'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => createNewBlankProject()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/15 transition"
            >
              <FilePlus2 className="w-4 h-4 text-sky-400" />
              {t.btnNewProject}
            </button>

            <button
              onClick={() => {
                if (window.api) {
                  openProjectFile();
                } else {
                  fileInputRef.current?.click();
                }
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/15 transition"
            >
              <FolderOpen className="w-4 h-4 text-amber-400" />
              {t.btnOpenProject}
            </button>

            <button
              onClick={() => saveProjectFile(false)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/25 transition"
            >
              <Save className="w-4 h-4" />
              {t.btnSaveProject}
            </button>

            <button
              onClick={() => setActiveTab('pdf')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/25 transition"
            >
              <FileDown className="w-4 h-4" />
              {t.btnExportPdf}
            </button>
          </div>
        </div>

        {/* One-Click Preset Bar for No-Code Testing */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs opacity-80 flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {isId
                ? 'Pintasan Testing Cepat (Tanpa Ketik Manual):'
                : 'Quick Testing Presets (Zero Manual Typing):'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={loadPrdSyntheticTest}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 transition"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              {t.btnLoadPrdTest}
            </button>
            <button
              onClick={loadCommercialSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-400/30 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t.btnLoadCommercialDemo}
            </button>
          </div>
        </div>
      </div>

      {/* Ringkasan Eksekutif Dashboard (PRD Bab 11.2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Biaya Dasar */}
        <div className={`${cardClass} rounded-2xl p-5 flex flex-col justify-between`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium opacity-70 uppercase tracking-wider">
              {t.baseCost}
            </span>
            <Layers className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-3 text-right">
            <div className="text-2xl font-bold tabular-nums">
              {formatCurrencyUsd(calc.base_cost_usd, language)}
            </div>
            <div className="text-xs opacity-75 tabular-nums mt-0.5">
              {formatCurrencyIdr(calc.base_cost_idr, language)}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-between text-xs opacity-75">
            <span>{t.plannedGenerations}</span>
            <span className="font-semibold tabular-nums">
              {calc.planned_generations}
            </span>
          </div>
        </div>

        {/* Card 2: Biaya Cadangan */}
        <div className={`${cardClass} rounded-2xl p-5 flex flex-col justify-between`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium opacity-70 uppercase tracking-wider">
              {t.reserveCost} ({calc.effective_reserve_percent}%)
            </span>
            <RefreshCw className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 text-right">
            <div className="text-2xl font-bold tabular-nums text-amber-400">
              {formatCurrencyUsd(calc.reserve_cost_usd, language)}
            </div>
            <div className="text-xs opacity-75 tabular-nums mt-0.5">
              {formatCurrencyIdr(calc.reserve_cost_idr, language)}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-between text-xs opacity-75">
            <span>{t.reserveGenerations}</span>
            <span className="font-semibold tabular-nums">
              +{calc.reserve_generations}
            </span>
          </div>
        </div>

        {/* Card 3: Total Anggaran Akhir */}
        <div
          className={`${cardClass} rounded-2xl p-5 flex flex-col justify-between ring-1 ring-sky-400/40`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              {t.totalBudget}
            </span>
            {calc.is_complete ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div className="mt-3 text-right">
            <div className="text-2xl font-extrabold tabular-nums">
              {formatCurrencyUsd(calc.total_cost_usd, language)}
            </div>
            <div className="text-sm font-semibold text-sky-400 tabular-nums mt-0.5">
              {formatCurrencyIdr(calc.total_cost_idr, language)}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-between text-xs">
            <span className="opacity-75">{t.budgetedGenerations}</span>
            <span className="font-bold tabular-nums">
              {calc.budgeted_generations}
            </span>
          </div>
        </div>

        {/* Card 4: Biaya Unit & Credit */}
        <div className={`${cardClass} rounded-2xl p-5 flex flex-col justify-between`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium opacity-70 uppercase tracking-wider">
              {t.totalCredit} & Unit
            </span>
            <Coins className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3 text-right">
            <div className="text-xl font-bold tabular-nums text-purple-300">
              {calc.total_credit !== null
                ? `${calc.total_credit.toLocaleString()} Credits`
                : t.unavailableLabel}
            </div>
            <div className="text-xs opacity-75 tabular-nums mt-1">
              {t.costPerVideo}:{' '}
              <strong>
                {formatCurrencyUsd(calc.cost_per_video_usd, language)}
              </strong>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-between text-xs opacity-75">
            <span>{t.costPerMinute}</span>
            <span className="font-semibold tabular-nums">
              {formatCurrencyUsd(calc.cost_per_minute_usd, language)}
            </span>
          </div>
        </div>
      </div>

      {/* Baris Status Kurs USD/IDR & Target Output */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`${cardClass} rounded-2xl p-5 lg:col-span-2`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider opacity-80">
              {isId
                ? 'Ringkasan Biaya per Kategori Proses AI (PRD Bab 6 & 11.2)'
                : 'Cost Breakdown by AI Process Category (PRD Sec 6 & 11.2)'}
            </h2>
            <button
              onClick={() => setActiveTab('planner')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300"
            >
              {isId ? 'Buka Tabel Produksi' : 'Open Production Planner'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 opacity-70">
                  <th className="py-2 text-left">{isId ? 'Kategori Proses AI' : 'AI Process Category'}</th>
                  <th className="py-2 text-right">{isId ? 'Item' : 'Items'}</th>
                  <th className="py-2 text-right">{isId ? 'Generasi (Gbudget)' : 'Generations'}</th>
                  <th className="py-2 text-right">{isId ? 'Subtotal (USD)' : 'Subtotal (USD)'}</th>
                  <th className="py-2 text-right">{isId ? 'Subtotal (IDR)' : 'Subtotal (IDR)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ALL_CATEGORIES.map((cat) => {
                  const sum = calc.category_summaries[cat];
                  return (
                    <tr key={cat} className="hover:bg-white/5">
                      <td className="py-2.5 font-medium">
                        {CATEGORY_LABELS[cat][language]}
                        {sum.has_incomplete_items && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                            {isId ? 'Belum Lengkap' : 'Incomplete'}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 text-right tabular-nums">{sum.item_count}</td>
                      <td className="py-2.5 text-right tabular-nums">
                        {sum.budgeted_generations}
                      </td>
                      <td className="py-2.5 text-right font-semibold tabular-nums">
                        {formatCurrencyUsd(sum.total_cost_usd, language)}
                      </td>
                      <td className="py-2.5 text-right opacity-80 tabular-nums">
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
        <div className={`${cardClass} rounded-2xl p-5 flex flex-col justify-between space-y-4`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                {t.exchangeRateLabel}
              </span>
              <StatusBadge
                status={project.exchange_rate.status}
                language={language}
              />
            </div>
            <div className="text-2xl font-bold tabular-nums text-right my-2">
              1 USD ={' '}
              {project.exchange_rate.rate
                ? formatCurrencyIdr(project.exchange_rate.rate, language)
                : t.unavailableLabel}
            </div>
            <div className="text-[11px] opacity-70 space-y-1">
              <div>
                <strong>{isId ? 'Sumber:' : 'Source:'}</strong>{' '}
                {project.exchange_rate.source_name}
              </div>
              <div>
                <strong>{isId ? 'Jenis Kurs:' : 'Rate Type:'}</strong>{' '}
                {project.exchange_rate.rate_type}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{project.exchange_rate.retrieved_at.slice(0, 19).replace('T', ' ')}</span>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={refreshExchangeRateAuto}
                disabled={isRefreshingFx}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/15 transition"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRefreshingFx ? 'animate-spin' : ''}`}
                />
                {t.refreshRateBtn}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/15 border border-white/10 transition"
              >
                {isId ? 'Ubah Manual' : 'Manual Edit'}
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80 mb-2">
              <Film className="w-3.5 h-3.5 text-sky-400" />
              <span>{isId ? 'Target Output Proyek' : 'Project Output Target'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="opacity-70">{isId ? 'Video Final (V)' : 'Final Videos (V)'}</div>
                <div className="text-base font-bold tabular-nums text-right">
                  {project.assumptions.target_videos}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="opacity-70">{isId ? 'Durasi Final (M)' : 'Final Duration (M)'}</div>
                <div className="text-base font-bold tabular-nums text-right">
                  {project.assumptions.final_duration_minutes} {isId ? 'mnt' : 'min'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Peringatan Audit & Proyek Terakhir */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Peringatan & Status Data */}
        <div className={`${cardClass} rounded-2xl p-5`}>
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-80 mb-3">
            {isId
              ? 'Peringatan & Transparansi Data (PRD Bab 11.2)'
              : 'Data Transparency & Warnings (PRD Sec 11.2)'}
          </h3>
          {calc.warnings.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                {isId
                  ? 'Semua tarif model dan nilai tukar telah terverifikasi dan lengkap.'
                  : 'All model rates and exchange rates are verified and complete.'}
              </span>
            </div>
          ) : (
            <ul className="space-y-2 text-xs">
              {calc.warnings.map((w, i) => (
                <li
                  key={`${w.code}_${i}`}
                  className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                    w.severity === 'error'
                      ? 'bg-rose-500/15 border-rose-400/30 text-rose-300'
                      : w.severity === 'warning'
                      ? 'bg-amber-500/15 border-amber-400/30 text-amber-300'
                      : 'bg-sky-500/15 border-sky-400/30 text-sky-300'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{isId ? w.message_id : w.message_en}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Proyek Terakhir Dibuka */}
        <div className={`${cardClass} rounded-2xl p-5`}>
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-80 mb-3">
            {isId
              ? 'File Proyek Terakhir (.aivbudget)'
              : 'Recent Project Files (.aivbudget)'}
          </h3>
          {recentProjects.length === 0 ? (
            <div className="text-xs opacity-60 p-4 text-center border border-dashed border-white/15 rounded-xl">
              {isId
                ? 'Belum ada riwayat file .aivbudget lokal yang disimpan pada sesi ini.'
                : 'No local .aivbudget files saved yet in this session.'}
            </div>
          ) : (
            <div className="space-y-2">
              {recentProjects.map((rec) => (
                <button
                  key={rec.file_path}
                  onClick={() => openProjectFile(rec.file_path)}
                  className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate">
                      {rec.project_name}
                    </div>
                    <div className="text-[11px] opacity-60 truncate">
                      {rec.file_path}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold tabular-nums text-sky-400">
                      {formatCurrencyUsd(rec.total_cost_usd, language)}
                    </div>
                    <div className="text-[10px] opacity-60">
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
