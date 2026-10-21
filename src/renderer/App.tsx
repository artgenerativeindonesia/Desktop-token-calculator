import React, { useEffect } from 'react';
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
import {
  BarChart3,
  CheckCircle2,
  Database,
  FileDown,
  LayoutDashboard,
  Layers,
  Moon,
  Save,
  Sliders,
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
  } = useProjectStore();

  useEffect(() => {
    initApp();
  }, [initApp]);

  const t = UI_TEXT[language];
  const isId = language === 'id';
  const calc = project.calculation;

  const navItems: Array<{
    id: ActiveNavTab;
    index: string;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
  }> = [
    {
      id: 'dashboard',
      index: '01',
      label: t.navDashboard,
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'setup',
      index: '02',
      label: t.navSetup,
      icon: <Sliders className="w-4 h-4" />,
      badge: `${calc.effective_reserve_percent}%`,
    },
    {
      id: 'planner',
      index: '03',
      label: t.navPlanner,
      icon: <Layers className="w-4 h-4" />,
      badge: project.items.length,
    },
    {
      id: 'summary',
      index: '04',
      label: t.navSummary,
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'settings',
      index: '05',
      label: t.navDataSettings,
      icon: <Database className="w-4 h-4" />,
    },
    {
      id: 'pdf',
      index: '06',
      label: t.navExportPdf,
      icon: <FileDown className="w-4 h-4" />,
    },
  ];

  const themeScopeClass =
    theme === 'dark' ? 'vv-theme-dark apple-bg-dark' : 'vv-theme-light apple-bg-light';
  const sidebarClass =
    theme === 'dark' ? 'glass-sidebar-dark' : 'glass-sidebar-light';
  const headerClass =
    theme === 'dark' ? 'glass-header-dark' : 'glass-header-light';

  return (
    <div className={`${themeScopeClass} min-h-screen flex flex-col lg:flex-row`}>
      {/* Visuvate Studio Architectural Sidebar Rail */}
      <aside
        className={`${sidebarClass} w-full lg:w-[268px] shrink-0 flex flex-col justify-between p-4 lg:min-h-screen sticky top-0 z-30 select-none`}
      >
        <div>
          {/* Studio Brand Emblem & Header */}
          <div className="flex items-center justify-between px-2.5 py-2 mb-4 border-b border-[var(--vv-border)] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="grid size-8 place-items-center rounded-[7px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border-strong)]">
                {/* Geometric Studio V-Emblem */}
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

          <div className="px-2.5 mb-5">
            <div className="text-[15px] font-semibold tracking-tight leading-snug text-[var(--vv-text-primary)]">
              {t.appTitle}
            </div>
            <div className="text-[11px] text-[var(--vv-text-muted)] mt-0.5 leading-relaxed">
              {t.appSubtitle}
            </div>
          </div>

          {/* Section Caption */}
          <div className="px-2.5 mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--vv-text-subtle)]">
            <span>{isId ? 'Navigasi Tahapan' : 'Studio Layers'}</span>
            <span className="tabular-nums">01 — 06</span>
          </div>

          {/* Visuvate Studio Layer Navigation Menu */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-[13px] transition-colors ${
                    isActive
                      ? 'bg-[#0068ad] text-white font-medium shadow-[0_6px_20px_-6px_rgba(0,153,255,0.55)]'
                      : 'text-[var(--vv-text-muted)] hover:bg-[var(--vv-tint-weak)] hover:text-[var(--vv-text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`text-[10px] tabular-nums font-mono ${
                        isActive ? 'text-white/80' : 'text-[var(--vv-text-subtle)]'
                      }`}
                    >
                      {item.index}
                    </span>
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
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
        </div>

        {/* Sidebar Bottom Total Box & High-Contrast Pill CTA */}
        <div className="mt-6 pt-4 border-t border-[var(--vv-border)] space-y-3">
          <div className="p-3.5 rounded-[12px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border)] space-y-1.5">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[var(--vv-text-muted)]">
              <span>{t.totalBudget}</span>
              <span className="tabular-nums">
                {calc.budgeted_generations} {isId ? 'kali buat' : 'tries'}
              </span>
            </div>
            <div className="text-lg font-bold tabular-nums text-[#0099ff] text-right">
              {formatCurrencyUsd(calc.total_cost_usd, language)}
            </div>
            <div className="text-xs font-medium tabular-nums text-[var(--vv-text-strong)] text-right">
              {formatCurrencyIdr(calc.total_cost_idr, language)}
            </div>
          </div>

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
          <div className="flex items-center gap-3 min-w-0">
            <span className="vv-badge-pill">
              <span className="vv-blue-dot" />
              <span className="truncate max-w-[260px] font-semibold">
                {project.project_name || (isId ? 'Proyek Baru' : 'Untitled Project')}
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

          {/* Right Studio Controls: FX Ticker, Segmented Language Switch, & Visuvate Theme Switch */}
          <div className="flex items-center gap-3">
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
          <div className="px-6 pt-4">
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
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'setup' && <ProjectSetupView />}
          {activeTab === 'planner' && <ProductionPlannerView />}
          {activeTab === 'summary' && <BudgetSummaryView />}
          {activeTab === 'settings' && <DataSettingsView />}
          {activeTab === 'pdf' && <ExportPdfView />}
        </main>
      </div>
    </div>
  );
};
