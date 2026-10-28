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
  PanelLeftClose,
  PanelLeftOpen,
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

  // Status Minimize / Buka-Tutup Sidebar (Mode Minimalis Ikon)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vv_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('vv_sidebar_collapsed', String(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      stepDesc: isId ? 'Nama proyek & dana cadangan' : 'Project & reserve',
      icon: <Sliders className="w-4 h-4" />,
      badge: `${project.assumptions.default_attempts_per_shot || 1}x`,
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
      ? 'dark vv-theme-dark apple-bg-dark'
      : 'vv-theme-light apple-bg-light';
  const sidebarClass =
    theme === 'dark' ? 'glass-sidebar-dark' : 'glass-sidebar-light';
  const headerClass =
    theme === 'dark' ? 'glass-header-dark' : 'glass-header-light';

  return (
    <div className={`${themeScopeClass} min-h-screen flex flex-col lg:flex-row`}>
      {/* Visuvate Studio Architectural Sidebar Rail (Bisa Di-minimize / Buka-Tutup & Terkunci di Bawah) */}
      <aside
        className={`${sidebarClass} w-full ${
          isSidebarCollapsed ? 'lg:w-[72px] p-2.5' : 'lg:w-[276px] p-3.5'
        } shrink-0 flex flex-col justify-between lg:h-screen lg:max-h-screen sticky top-0 z-30 select-none transition-all duration-300 ease-in-out`}
      >
        {/* ZONA 1: Studio Brand Emblem & Header (Atas Diam) */}
        <div className="shrink-0">
          {isSidebarCollapsed ? (
            <div className="flex flex-col items-center gap-2 mb-2.5 border-b border-[var(--vv-border)] pb-2.5">
              <div
                title="Higgsfield Studio Budget Workspace"
                className="grid size-9 place-items-center rounded-[8px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border-strong)]"
              >
                <svg
                  className="size-4 text-[var(--vv-text-primary)]"
                  viewBox="0 0 54 54"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M54 0L53.2496 1.49965L30.1207 47.7576L27.0136 53.9738L27 54L26.9864 53.9738L23.714 47.4279L19.9214 39.8417C20.8507 34.4376 24.8222 26.8326 25.2471 26.0278C22.6978 29.0847 20.1485 32.1405 17.5981 35.1973L0 0L16.7808 3.32058C16.7808 3.32058 23.5999 16.0263 27.0105 21.8773L36.676 3.33942L54 0Z" />
                </svg>
              </div>
              <button
                type="button"
                onClick={toggleSidebar}
                title={isId ? 'Buka sidebar penuh (Ctrl+B)' : 'Expand sidebar (Ctrl+B)'}
                className="p-1.5 rounded-[8px] text-[#0099ff] bg-[#0099ff]/10 hover:bg-[#0099ff]/20 hover:text-[#7acaff] transition border border-[#0099ff]/30 shadow-sm"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between px-1.5 py-1 mb-2.5 border-b border-[var(--vv-border)] pb-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="grid size-8 place-items-center rounded-[7px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border-strong)] shrink-0">
                  <svg
                    className="size-4 text-[var(--vv-text-primary)]"
                    viewBox="0 0 54 54"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M54 0L53.2496 1.49965L30.1207 47.7576L27.0136 53.9738L27 54L26.9864 53.9738L23.714 47.4279L19.9214 39.8417C20.8507 34.4376 24.8222 26.8326 25.2471 26.0278C22.6978 29.0847 20.1485 32.1405 17.5981 35.1973L0 0L16.7808 3.32058C16.7808 3.32058 23.5999 16.0263 27.0105 21.8773L36.676 3.33942L54 0Z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--vv-text-muted)] truncate">
                    HIGGSFIELD STUDIO
                  </div>
                  <div className="text-xs font-medium text-[var(--vv-text-primary)] truncate">
                    Budget <span className="vv-accent">Workspace</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="vv-blue-dot mr-1" title="Studio Active" />
                <button
                  type="button"
                  onClick={toggleSidebar}
                  title={
                    isId
                      ? 'Tutup sidebar (Mode minimalis ikon - Ctrl+B)'
                      : 'Collapse sidebar (Ctrl+B)'
                  }
                  className="p-1.5 rounded-[7px] text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)] hover:bg-[var(--vv-tint-weak)] border border-transparent hover:border-[var(--vv-border)] transition"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {!isSidebarCollapsed && (
            <div className="px-1.5 mb-2.5 animate-in fade-in duration-200">
              <div className="text-[13px] font-semibold tracking-tight leading-snug text-[var(--vv-text-primary)] truncate">
                {t.appTitle}
              </div>
              <div className="text-[10.5px] text-[var(--vv-text-muted)] mt-0.5 leading-relaxed truncate">
                {t.appSubtitle}
              </div>
            </div>
          )}
        </div>

        {/* ZONA 2: Daftar Menu Langkah Alur (Scroll Halus Independen Tanpa Scrollbar Kasar) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1 space-y-2">
          {/* Primary Guided Workflow Section (Steps 01 - 05) */}
          {!isSidebarCollapsed ? (
            <div className="px-1.5 mb-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--vv-text-subtle)]">
              <span>{isId ? 'Alur Langkah Utama' : 'Guided Workflow'}</span>
              <span className="tabular-nums">01 — 05</span>
            </div>
          ) : (
            <div className="my-1 border-t border-[var(--vv-border)]/50" />
          )}

          <nav className="space-y-1">
            {coreWorkflowItems.map((item) => {
              const isActive = activeTab === item.id;

              if (isSidebarCollapsed) {
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={`${item.index}. ${item.label} — ${item.stepDesc}${
                      item.badge !== undefined ? ` [${item.badge}]` : ''
                    }`}
                    className={`relative size-11 mx-auto flex items-center justify-center rounded-[10px] transition-all group ${
                      isActive
                        ? 'bg-[#0068ad] text-white font-medium shadow-[0_6px_20px_-6px_rgba(0,153,255,0.55)] ring-1 ring-[#0099ff]/50'
                        : 'text-[var(--vv-text-muted)] hover:bg-[var(--vv-tint-weak)] hover:text-[var(--vv-text-primary)]'
                    }`}
                  >
                    <span className="scale-110">{item.icon}</span>
                    {item.badge !== undefined && (
                      <span
                        className={`absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[17px] text-center rounded-full text-[9px] font-mono font-bold leading-tight shadow-sm ${
                          isActive
                            ? 'bg-white text-[#0068ad]'
                            : 'bg-[#0099ff] text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#7acaff]" />
                    )}
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[9px] text-left transition-all ${
                    isActive
                      ? 'bg-[#0068ad] text-white font-medium shadow-[0_6px_20px_-6px_rgba(0,153,255,0.55)]'
                      : 'text-[var(--vv-text-muted)] hover:bg-[var(--vv-tint-weak)] hover:text-[var(--vv-text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`text-[10px] tabular-nums font-mono ${
                        isActive ? 'text-white/85' : 'text-[var(--vv-text-subtle)]'
                      }`}
                    >
                      {item.index}
                    </span>
                    <span className="shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <div className="text-[12px] truncate leading-tight">
                        {item.label}
                      </div>
                      <div
                        className={`text-[9.5px] truncate mt-0.5 ${
                          isActive ? 'text-white/75' : 'text-[var(--vv-text-subtle)]'
                        }`}
                      >
                        {item.stepDesc}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                    {item.badge !== undefined && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[9.5px] tabular-nums ${
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
          <div
            className={
              !isSidebarCollapsed
                ? 'mt-3 pt-2.5 border-t border-[var(--vv-border)]'
                : 'mt-1.5 pt-1.5 border-t border-[var(--vv-border)]'
            }
          >
            {!isSidebarCollapsed && (
              <div className="px-1.5 mb-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--vv-text-subtle)]">
                <span>{isId ? 'Data & Referensi' : 'Data & Reference'}</span>
                <span className="tabular-nums">06</span>
              </div>
            )}
            {isSidebarCollapsed ? (
              <button
                onClick={() => setActiveTab('settings')}
                title={`06. ${t.navDataSettings} — ${
                  isId ? 'Atur kurs & harga model' : 'FX rate & model prices'
                }`}
                className={`relative size-11 mx-auto flex items-center justify-center rounded-[10px] transition-all group ${
                  activeTab === 'settings'
                    ? 'bg-[#0068ad] text-white font-medium shadow-[0_6px_20px_-6px_rgba(0,153,255,0.55)] ring-1 ring-[#0099ff]/50'
                    : 'text-[var(--vv-text-muted)] hover:bg-[var(--vv-tint-weak)] hover:text-[var(--vv-text-primary)]'
                }`}
              >
                <Database className="w-4 h-4 scale-110 shrink-0" />
                {activeTab === 'settings' && (
                  <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#7acaff]" />
                )}
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[9px] text-left transition-all ${
                  activeTab === 'settings'
                    ? 'bg-[#0068ad] text-white font-medium shadow-[0_6px_20px_-6px_rgba(0,153,255,0.55)]'
                    : 'text-[var(--vv-text-muted)] hover:bg-[var(--vv-tint-weak)] hover:text-[var(--vv-text-primary)]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
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
                    <div className="text-[12px] truncate leading-tight">
                      {t.navDataSettings}
                    </div>
                    <div
                      className={`text-[9.5px] truncate mt-0.5 ${
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
            )}
          </div>
        </div>

        {/* ZONA 3: Sidebar Bottom (Pinned / Terkunci Permanen di Kiri Bawah & Ramping) */}
        <div className="shrink-0 pt-2.5 border-t border-[var(--vv-border)] mt-auto">
          {isSidebarCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setIsQuickBudgetModalOpen(true)}
                title={`${t.totalBudget}: ${formatCurrencyIdr(
                  calc.total_cost_idr,
                  language
                )} (${formatCurrencyUsd(calc.total_cost_usd, language)}) • ${
                  isId ? 'Klik untuk intip rincian cepat' : 'Click to peek quick budget'
                }`}
                className="size-11 mx-auto flex flex-col items-center justify-center rounded-[10px] bg-[var(--vv-tint-weak)] hover:bg-[#0099ff]/15 hover:border-[#0099ff]/50 border border-[var(--vv-border)] text-[#0099ff] transition group"
              >
                <Eye className="w-4 h-4 group-hover:scale-110 transition" />
                <span className="text-[8px] font-mono font-bold mt-0.5 text-[var(--vv-text-muted)]">
                  Rp
                </span>
              </button>

              <button
                type="button"
                onClick={() => saveProjectFile(false)}
                title={`${t.btnSaveProject}${
                  hasUnsavedChanges
                    ? isId
                      ? ' (Ada perubahan belum disimpan)'
                      : ' (Unsaved changes)'
                    : ''
                }`}
                className="relative size-11 mx-auto flex items-center justify-center rounded-[10px] vv-btn-primary transition shadow-md"
              >
                <Save className="w-4 h-4" />
                {hasUnsavedChanges && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#ffb840] ring-2 ring-[var(--vv-card-surface)]" />
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setIsQuickBudgetModalOpen(true)}
                title={
                  isId
                    ? 'Klik untuk melihat ringkasan cepat anggaran dalam jendela kaca buram'
                    : 'Click to inspect quick budget breakdown in a frosted glass window'
                }
                className="w-full text-left px-3 py-2 rounded-[10px] bg-[var(--vv-tint-weak)] hover:bg-[var(--vv-tint)] border border-[var(--vv-border)] transition group shadow-sm"
              >
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[var(--vv-text-muted)]">
                  <span className="truncate">{t.totalBudget}</span>
                  <span className="inline-flex items-center gap-1 text-[#0099ff] group-hover:underline text-[10px] shrink-0 font-medium">
                    <Eye className="w-3 h-3" />
                    <span>{isId ? 'Rincian' : 'Peek'}</span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1 gap-1">
                  <div className="text-sm font-bold tabular-nums text-[#0099ff] truncate">
                    {formatCurrencyIdr(calc.total_cost_idr, language)}
                  </div>
                  <div className="text-[10px] tabular-nums text-[var(--vv-text-muted)] shrink-0 font-mono">
                    {calc.budgeted_generations}x • {formatCurrencyUsd(calc.total_cost_usd, language)}
                  </div>
                </div>
                {calc.target_videos > 1 && (
                  <div className="text-[9.5px] text-[#7acaff] truncate font-medium mt-0.5">
                    {isId
                      ? `(${calc.target_videos} video • ${formatCurrencyIdr(calc.one_video_total_cost_idr, language)}/vid)`
                      : `(${calc.target_videos} vids • ${formatCurrencyUsd(calc.one_video_total_cost_usd, language)}/vid)`}
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => saveProjectFile(false)}
                className="vv-btn-primary w-full py-2 px-3 text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span className="font-semibold">{t.btnSaveProject}</span>
                {hasUnsavedChanges && (
                  <span className="w-2 h-2 rounded-full bg-[#ffb840] ring-1 ring-white/50" />
                )}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Visuvate Studio Editor Top Bar */}
        <header
          className={`${headerClass} sticky top-0 z-20 px-6 py-3 flex flex-wrap items-center justify-between gap-3`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {isSidebarCollapsed && (
              <button
                type="button"
                onClick={toggleSidebar}
                title={isId ? 'Buka Sidebar (Ctrl+B)' : 'Expand Sidebar (Ctrl+B)'}
                className="p-1.5 rounded-[8px] text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)] hover:bg-[var(--vv-tint-weak)] border border-[var(--vv-border)] transition hidden lg:inline-flex items-center gap-1.5 text-xs mr-1 shadow-sm"
              >
                <PanelLeftOpen className="w-4 h-4 text-[#0099ff]" />
                <span className="text-[11px] font-medium text-[var(--vv-text-muted)]">
                  {isId ? 'Menu' : 'Menu'}
                </span>
              </button>
            )}
            <span className="vv-badge-pill">
              <span className="vv-blue-dot" />
              <span className="truncate max-w-[240px] font-semibold">
                {project.project_name ||
                  (isId ? 'Proyek Baru' : 'Untitled Project')}
              </span>
            </span>

            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                calc.is_complete
                  ? 'vv-badge-emerald'
                  : 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/25'
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
                  ? 'bg-rose-500/15 border-rose-500/35 text-rose-700 dark:text-rose-300'
                  : banner.type === 'warning'
                  ? 'vv-badge-amber'
                  : banner.type === 'success'
                  ? 'vv-badge-emerald'
                  : 'bg-[#0099ff]/15 border-[#0099ff]/35 text-[#0066cc] dark:text-[#7acaff]'
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
                <FlaskConical className="w-3.5 h-3.5 vv-text-emerald" />
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
                ? 'Beri nama proyek Anda, tentukan jumlah video jadi, dan atur berapa kali cadangan per adegan (misal 2x) untuk berjaga-jaga jika hasil AI perlu dibuat ulang.'
                : 'Name your project, set your target video output, and choose a reserve multiplier per scene (e.g. 2x) in case AI scenes need extra tries.'}
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
              <div className="text-[11px] uppercase tracking-wider text-[#0066cc] dark:text-[#7acaff] font-semibold">
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
              <div className="text-[11px] text-[var(--vv-text-muted)]">{isId ? 'Rumus Kali Buat AI' : 'AI Generation Formula'}</div>
              <div className="text-sm font-bold tabular-nums text-right mt-1">
                {calc.budgeted_generations}x {isId ? 'kali buat' : 'generations'}
              </div>
              <div className="text-[11px] text-[var(--vv-text-muted)] tabular-nums text-right">
                {calc.item_results.reduce((s, r) => s + r.effective_quantity, 0)} {isId ? 'adegan' : 'scenes'} &times; {project.assumptions.default_attempts_per_shot || 1} {isId ? 'cadangan' : 'reserve'}
              </div>
            </div>

            <div className="vv-card-quiet p-3.5">
              <div className="text-[11px] vv-text-amber font-semibold">
                {t.costPerVideo}
              </div>
              <div className="text-sm font-bold tabular-nums vv-text-amber text-right mt-1">
                {formatCurrencyIdr(calc.cost_per_video_idr, language)}
              </div>
              <div className="text-[11px] text-[var(--vv-text-muted)] tabular-nums text-right">
                {formatCurrencyUsd(calc.cost_per_video_usd, language)} / video
              </div>
            </div>
          </div>

          <div className="vv-card-quiet p-3.5 flex items-center justify-between">
            <span className="text-[var(--vv-text-muted)]">{t.totalCredit}</span>
            <span className="font-bold tabular-nums text-[#0066cc] dark:text-[#7acaff]">
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
