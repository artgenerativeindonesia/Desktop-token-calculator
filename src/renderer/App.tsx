import React, { useEffect, useState } from 'react';
import { ActiveNavTab, useProjectStore } from './store/projectStore';
import {
  formatCurrencyIdr,
  formatCurrencyUsd,
  UI_TEXT,
} from './i18n/translations';
import { DashboardView } from './components/DashboardView';
import { ProjectSetupView } from './components/ProjectSetupView';
import { ProductionPlannerView } from './components/ProductionPlannerView';
import { BudgetSummaryView } from './components/BudgetSummaryView';
import { DataSettingsView } from './components/DataSettingsView';
import { ExportPdfView } from './components/ExportPdfView';
import { FrostedModal } from './components/FrostedModal';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Database,
  Eye,
  FileDown,
  FlaskConical,
  HelpCircle,
  LayoutDashboard,
  Layers,
  Moon,
  Save,
  Sliders,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';

export const App: React.FC = () => {
  const {
    project,
    activeTab,
    language,
    theme,
    banner,
    hasUnsavedChanges,
    setActiveTab,
    setLanguage,
    setTheme,
    clearBanner,
    initApp,
    saveProjectFile,
    loadCommercialSample,
    loadPrdSyntheticTest,
  } = useProjectStore();

  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isQuickBudgetModalOpen, setIsQuickBudgetModalOpen] = useState(false);

  useEffect(() => {
    initApp();
  }, [initApp]);

  const t = UI_TEXT[language];
  const isId = language === 'id';
  const calc = project.calculation;

  const coreWorkflowItems: Array<{
    id: ActiveNavTab;
    index: string;
    label: string;
    stepDesc: string;
    icon: React.ReactNode;
    badge?: string | number;
  }> = [
    {
      id: 'dashboard',
      index: '01',
      label: t.navDashboard,
      stepDesc: isId ? 'Gambaran utama proyek' : 'Project overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'setup',
      index: '02',
      label: t.navSetup,
      stepDesc: isId ? 'Target video & dana cadangan' : 'Targets & reserve',
      icon: <Sliders className="w-4 h-4" />,
      badge: `${calc.effective_reserve_percent}%`,
    },
    {
      id: 'planner',
      index: '03',
      label: t.navPlanner,
      stepDesc: isId ? 'Susun adegan & model AI' : 'Scenes & AI models',
      icon: <Layers className="w-4 h-4" />,
      badge: project.items.length,
    },
    {
      id: 'summary',
      index: '04',
      label: t.navSummary,
      stepDesc: isId ? 'Periksa rincian biaya' : 'Review cost details',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'pdf',
      index: '05',
      label: t.navExportPdf,
      stepDesc: isId ? 'Pratinjau & simpan dokumen' : 'Preview & save PDF',
      icon: <FileDown className="w-4 h-4" />,
    },
  ];

  const themeScopeClass =
    theme === 'dark'
      ? 'vv-theme-dark apple-bg-dark'
      : 'vv-theme-light apple-bg-light';
  const sidebarClass =
    theme === 'dark' ? 'glass-sidebar-dark' : 'glass-sidebar-light';
  const headerClass =
    theme === 'dark' ? 'glass-header-dark' : 'glass-header-light';

  return (
    <div className={`${themeScopeClass} min-h-screen flex flex-col lg:flex-row`}>
      {/* Visuvate Studio Architectural Sidebar Rail */}
      <aside
        className={`${sidebarClass} w-full lg:w-[276px] shrink-0 flex flex-col justify-between p-4 lg:min-h-screen sticky top-0 z-30 select-none`}
      >
        <div>
          {/* Studio Brand Emblem & Header */}
          <div className="flex items-center justify-between px-2.5 py-2 mb-3 border-b border-[var(--vv-border)] pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="grid size-8 place-items-center rounded-[7px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border-strong)]">
                <svg
                  className="size-4 text-[var(--vv-text-primary)]"
                  viewBox="0 0 54 54"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M54 0L53.2496 1.49965L30.1207 47.7576L27.0136 53.9738L27 54L26.9864 53.9738L23.714 47.4279L19.9214 39.8417C20.8507 34.4376 24.8222 26.8326 25.2471 26.0278C22.6978 29.0847 20.1485 32.1405 17.5981 35.1973L0 0L16.7808 3.32058C16.7808 3.32058 23.5999 16.0263 27.0105 21.8773L36.676 3.33942L54 0Z" />
                </svg>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--vv-text-muted)]">
                  HIGGSFIELD STUDIO
                </div>
                <div className="text-xs font-medium text-[var(--vv-text-primary)]">
                  Budget <span className="vv-accent">Workspace</span>
                </div>
              </div>
            </div>
            <span className="vv-blue-dot" title="Studio Active" />
          </div>

          <div className="px-2.5 mb-4">
            <div className="text-[14px] font-semibold tracking-tight leading-snug text-[var(--vv-text-primary)]">
              {t.appTitle}
            </div>
            <div className="text-[11px] text-[var(--vv-text-muted)] mt-0.5 leading-relaxed">
              {t.appSubtitle}
            </div>
          </div>

          {/* Primary Guided Workflow Section (Steps 01 - 05) */}
          <div className="px-2.5 mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--vv-text-subtle)]">
            <span>{isId ? 'Alur Langkah Utama' : 'Guided Workflow'}</span>
            <span className="tabular-nums">01 — 05</span>
          </div>

          <nav className="space-y-1">
            {coreWorkflowItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] text-left transition-all ${
                    isActive
                      ? 'bg-[#0068ad] text-white font-medium shadow-[0_6px_20px_-6px_rgba(0,153,255,0.55)]'
                      : 'text-[var(--vv-text-muted)] hover:bg-[var(--vv-tint-weak)] hover:text-[var(--vv-text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`text-[10px] tabular-nums font-mono ${
                        isActive ? 'text-white/85' : 'text-[var(--vv-text-subtle)]'
                      }`}
                    >
                      {item.index}
                    </span>
                    <span className="shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <div className="text-[12.5px] truncate leading-tight">
                        {item.label}
                      </div>
                      <div
                        className={`text-[10px] truncate mt-0.5 ${
                          isActive ? 'text-white/75' : 'text-[var(--vv-text-subtle)]'
                        }`}
                      >
                        {item.stepDesc}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] tabular-nums ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[var(--vv-tint-weak)] text-[var(--vv-text-muted)] border border-[var(--vv-border)]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="size-1.5 rounded-full bg-[#7acaff]" />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Supporting Reference Section (06: Exchange Rate & Model Catalog) */}
          <div className="mt-4 pt-3 border-t border-[var(--vv-border)]">
            <div className="px-2.5 mb-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--vv-text-subtle)]">
              <span>{isId ? 'Data & Referensi' : 'Data & Reference'}</span>
              <span className="tabular-nums">06</span>
            </div>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] text-left transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#0068ad] text-white font-medium shadow-[0_6px_20px_-6px_rgba(0,153,255,0.55)]'
                  : 'text-[var(--vv-text-muted)] hover:bg-[var(--vv-tint-weak)] hover:text-[var(--vv-text-primary)]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`text-[10px] tabular-nums font-mono ${
                    activeTab === 'settings'
                      ? 'text-white/85'
                      : 'text-[var(--vv-text-subtle)]'
                  }`}
                >
                  06
                </span>
                <Database className="w-4 h-4 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[12.5px] truncate leading-tight">
                    {t.navDataSettings}
                  </div>
                  <div
                    className={`text-[10px] truncate mt-0.5 ${
                      activeTab === 'settings'
                        ? 'text-white/75'
                        : 'text-[var(--vv-text-subtle)]'
                    }`}
                  >
                    {isId ? 'Atur kurs & harga model' : 'FX rate & model prices'}
                  </div>
                </div>
              </div>
              {activeTab === 'settings' && (
                <span className="size-1.5 rounded-full bg-[#7acaff]" />
              )}
            </button>
          </div>
        </div>

        {/* Sidebar Bottom Compact Budget Trigger & Save Action */}
        <div className="mt-5 pt-3.5 border-t border-[var(--vv-border)] space-y-2.5">
          <button
            type="button"
            onClick={() => setIsQuickBudgetModalOpen(true)}
            title={
              isId
                ? 'Klik untuk melihat ringkasan cepat anggaran dalam jendela kaca buram'
                : 'Click to inspect quick budget breakdown in a frosted glass window'
            }
            className="w-full text-left p-3 rounded-[12px] bg-[var(--vv-tint-weak)] hover:bg-[var(--vv-tint)] border border-[var(--vv-border)] transition group"
          >
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[var(--vv-text-muted)]">
              <span>{t.totalBudget}</span>
              <span className="inline-flex items-center gap-1 text-[#0099ff] group-hover:underline">
                <Eye className="w-3 h-3" />
                <span>{isId ? 'Intip Rincian' : 'Peek'}</span>
              </span>
            </div>
            <div className="text-base font-bold tabular-nums text-[#0099ff] text-right mt-1">
              {formatCurrencyIdr(calc.total_cost_idr, language)}
            </div>
            <div className="flex items-center justify-between text-[11px] tabular-nums text-[var(--vv-text-muted)] mt-0.5">
              <span>
                {calc.budgeted_generations} {isId ? 'kali buat' : 'tries'}
              </span>
              <span className="font-semibold text-[var(--vv-text-strong)]">
                {formatCurrencyUsd(calc.total_cost_usd, language)}
              </span>
            </div>
          </button>

          <button
            onClick={() => saveProjectFile(false)}
            className="vv-btn-primary w-full py-2.5 px-4 text-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{t.btnSaveProject}</span>
            {hasUnsavedChanges && (
              <span className="w-2 h-2 rounded-full bg-[#ffb840]" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Visuvate Studio Editor Top Bar */}
        <header
          className={`${headerClass} sticky top-0 z-20 px-6 py-3 flex flex-wrap items-center justify-between gap-3`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="vv-badge-pill">
              <span className="vv-blue-dot" />
              <span className="truncate max-w-[240px] font-semibold">
                {project.project_name ||
                  (isId ? 'Proyek Baru' : 'Untitled Project')}
              </span>
            </span>

            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                calc.is_complete
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
              }`}
            >
              {calc.is_complete ? t.completeEstimate : t.incompleteEstimate}
            </span>
          </div>

          {/* Right Studio Controls: Quick Guide Popup, FX Ticker, Language Switch, & Theme Switch */}
          <div className="flex items-center gap-2.5">
            {/* Frosted Glass Quick Guide Button */}
            <button
              type="button"
              onClick={() => setIsGuideModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-full border border-[#0099ff]/40 bg-[#0099ff]/10 hover:bg-[#0099ff]/20 text-xs font-medium text-[#7acaff] transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#0099ff]" />
              <span>{isId ? 'Panduan Cepat' : 'Quick Guide'}</span>
            </button>

            {/* FX Rate Studio Readout */}
            <button
              onClick={() => setActiveTab('settings')}
              className="hidden sm:inline-flex items-center gap-2 h-[30px] px-3 rounded-[6px] border border-[var(--vv-border-strong)] bg-[var(--vv-field)] text-xs tabular-nums transition hover:border-[#0099ff]"
            >
              <span className="text-[var(--vv-text-muted)]">USD/IDR</span>
              <span className="text-[var(--vv-text-subtle)]">|</span>
              <strong className="text-[var(--vv-text-primary)]">
                {project.exchange_rate.rate
                  ? `Rp ${project.exchange_rate.rate.toLocaleString('id-ID')}`
                  : 'N/A'}
              </strong>
            </button>

            {/* Visuvate Editor Segmented Control: ID | EN */}
            <div className="flex h-[30px] items-center gap-0.5 rounded-[6px] bg-[var(--vv-field)] border border-[var(--vv-border)] p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setLanguage('id')}
                className={`px-2.5 h-full rounded-[4px] font-medium transition-colors ${
                  language === 'id'
                    ? 'bg-[var(--vv-bg)] text-[var(--vv-text-primary)] shadow-sm'
                    : 'text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)]'
                }`}
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 h-full rounded-[4px] font-medium transition-colors ${
                  language === 'en'
                    ? 'bg-[var(--vv-bg)] text-[var(--vv-text-primary)] shadow-sm'
                    : 'text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)]'
                }`}
              >
                EN
              </button>
            </div>

            {/* Visuvate Signature Pill Switch for Dark / Light Mode */}
            <button
              type="button"
              role="switch"
              aria-checked={theme === 'light'}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={
                isId
                  ? 'Ganti Tema Gelap / Terang (Visuvate Studio)'
                  : 'Toggle Dark / Light Theme (Visuvate Studio)'
              }
              className="relative h-7 w-[52px] rounded-full border border-[var(--vv-border-strong)] bg-[var(--vv-surface-strong)] transition-colors flex items-center px-1"
            >
              <span
                className={`grid size-5 place-items-center rounded-full transition-transform duration-300 ${
                  theme === 'light'
                    ? 'translate-x-[22px] bg-black text-white'
                    : 'translate-x-0 bg-white text-black'
                }`}
              >
                {theme === 'dark' ? (
                  <Moon className="w-3 h-3" />
                ) : (
                  <Sun className="w-3 h-3" />
                )}
              </span>
            </button>
          </div>
        </header>

        {/* Actionable Notification Banner */}
        {banner && (
          <div className="px-6 pt-4 max-w-6xl w-full mx-auto">
            <div
              className={`p-3.5 rounded-[12px] border flex items-center justify-between gap-3 text-xs font-medium shadow-lg ${
                banner.type === 'error'
                  ? 'bg-rose-500/15 border-rose-400/35 text-rose-300'
                  : banner.type === 'warning'
                  ? 'bg-amber-500/15 border-amber-400/35 text-amber-300'
                  : banner.type === 'success'
                  ? 'bg-emerald-500/15 border-emerald-400/35 text-emerald-300'
                  : 'bg-[#0099ff]/15 border-[#0099ff]/35 text-[#7acaff]'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{isId ? banner.message_id : banner.message_en}</span>
              </div>
              <button
                onClick={clearBanner}
                className="p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Active Page View */}
        <main className="flex-1 p-6 max-w-6xl w-full mx-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'setup' && <ProjectSetupView />}
          {activeTab === 'planner' && <ProductionPlannerView />}
          {activeTab === 'summary' && <BudgetSummaryView />}
          {activeTab === 'settings' && <DataSettingsView />}
          {activeTab === 'pdf' && <ExportPdfView />}
        </main>
      </div>

      {/* FROSTED GLASS MODAL 1: Panduan Cepat Cara Kerja Aplikasi */}
      <FrostedModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
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
                  setIsGuideModalOpen(false);
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
                  setIsGuideModalOpen(false);
                }}
                className="vv-btn-secondary px-3.5 py-2 text-xs"
              >
                <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.btnLoadPrdTest}</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsGuideModalOpen(false)}
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
                ? 'Beri nama proyek Anda, tentukan jumlah video jadi, dan atur persentase cadangan (misal 20%) untuk berjaga-jaga jika hasil AI perlu dibuat ulang.'
                : 'Name your project, set your target video output, and choose a reserve percentage (e.g. 20%) in case AI scenes need extra tries.'}
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
                ? '2. Susun Daftar Adegan di Jendela Popup'
                : '2. Build Your Scene List'}
            </div>
            <p className="text-[var(--vv-text-muted)] leading-relaxed">
              {isId
                ? 'Tambahkan tahapan pembuatan (Gambar dari Teks, Video dari Teks, hingga Peningkatan 4K). Klik tombol "Atur Adegan" untuk memilih model AI dengan rapi.'
                : 'Add production stages (Text to Image, Text to Video, 4K Upscaling). Click "Edit Stage" to configure models cleanly inside a popup.'}
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

      {/* FROSTED GLASS MODAL 2: Intip Ringkasan Cepat Anggaran dari Layar Mana Saja */}
      <FrostedModal
        isOpen={isQuickBudgetModalOpen}
        onClose={() => setIsQuickBudgetModalOpen(false)}
        theme={theme}
        maxWidth="lg"
        badgeLabel={isId ? 'Ringkasan Cepat' : 'Live Budget Peek'}
        title={
          isId ? (
            <>
              Posisi Anggaran{' '}
              <span className="vv-accent text-[#0099ff]">Saat Ini</span>
            </>
          ) : (
            <>
              Current Budget{' '}
              <span className="vv-accent text-[#0099ff]">Snapshot</span>
            </>
          )
        }
        subtitle={project.project_name}
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsQuickBudgetModalOpen(false)}
              className="vv-btn-secondary px-4 py-2 text-xs"
            >
              <span>{isId ? 'Tutup' : 'Close'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsQuickBudgetModalOpen(false);
                setActiveTab('summary');
              }}
              className="vv-btn-accent px-4 py-2 text-xs"
            >
              <span>{isId ? 'Buka Halaman Ringkasan Biaya' : 'Open Cost Summary'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-[14px] bg-[#0099ff]/10 border border-[#0099ff]/35 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#7acaff] font-semibold">
                {t.totalBudget}
              </div>
              <div className="text-[11px] text-[var(--vv-text-muted)] mt-0.5">
                {calc.budgeted_generations} {isId ? 'total kali pembuatan AI' : 'total AI generations'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold tabular-nums text-[#0099ff]">
                {formatCurrencyIdr(calc.total_cost_idr, language)}
              </div>
              <div className="text-sm font-semibold tabular-nums text-[var(--vv-text-primary)]">
                {formatCurrencyUsd(calc.total_cost_usd, language)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="vv-card-quiet p-3.5">
              <div className="text-[11px] text-[var(--vv-text-muted)]">{t.baseCost}</div>
              <div className="text-sm font-bold tabular-nums text-right mt-1">
                {formatCurrencyIdr(calc.base_cost_idr, language)}
              </div>
              <div className="text-[11px] text-[var(--vv-text-muted)] tabular-nums text-right">
                {formatCurrencyUsd(calc.base_cost_usd, language)} ({calc.planned_generations}x)
              </div>
            </div>

            <div className="vv-card-quiet p-3.5">
              <div className="text-[11px] text-[#ffb840]">
                {t.reserveCost} ({calc.effective_reserve_percent}%)
              </div>
              <div className="text-sm font-bold tabular-nums text-[#ffb840] text-right mt-1">
                {formatCurrencyIdr(calc.reserve_cost_idr, language)}
              </div>
              <div className="text-[11px] text-[var(--vv-text-muted)] tabular-nums text-right">
                {formatCurrencyUsd(calc.reserve_cost_usd, language)} (+{calc.reserve_generations}x)
              </div>
            </div>
          </div>

          <div className="vv-card-quiet p-3.5 flex items-center justify-between">
            <span className="text-[var(--vv-text-muted)]">{t.totalCredit}</span>
            <span className="font-bold tabular-nums text-[#7acaff]">
              {calc.total_credit !== null
                ? `${calc.total_credit.toLocaleString()} Credits`
                : t.unavailableLabel}
            </span>
          </div>
        </div>
      </FrostedModal>
    </div>
  );
};
