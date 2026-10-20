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
  } = useProjectStore();

  useEffect(() => {
    initApp();
  }, [initApp]);

  const t = UI_TEXT[language];
  const isId = language === 'id';
  const calc = project.calculation;

  const navItems: Array<{
    id: ActiveNavTab;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
  }> = [
    {
      id: 'dashboard',
      label: t.navDashboard,
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'setup',
      label: t.navSetup,
      icon: <Sliders className="w-4 h-4" />,
      badge: `${calc.effective_reserve_percent}%`,
    },
    {
      id: 'planner',
      label: t.navPlanner,
      icon: <Layers className="w-4 h-4" />,
      badge: project.items.length,
    },
    {
      id: 'summary',
      label: t.navSummary,
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: t.navDataSettings,
      icon: <Database className="w-4 h-4" />,
    },
    {
      id: 'pdf',
      label: t.navExportPdf,
      icon: <FileDown className="w-4 h-4" />,
    },
  ];

  const bgClass = theme === 'dark' ? 'apple-bg-dark' : 'apple-bg-light';
  const sidebarClass =
    theme === 'dark' ? 'glass-sidebar-dark' : 'glass-sidebar-light';
  const headerClass =
    theme === 'dark' ? 'glass-header-dark' : 'glass-header-light';

  return (
    <div className={`${bgClass} min-h-screen flex flex-col lg:flex-row`}>
      {/* Apple macOS-Inspired Frosted Glass Sidebar */}
      <aside
        className={`${sidebarClass} w-full lg:w-64 shrink-0 flex flex-col justify-between p-4 lg:min-h-screen sticky top-0 z-30`}
      >
        <div>
          {/* macOS Window Traffic Lights Decoration + Brand Title */}
          <div className="flex items-center gap-3 px-2 py-2 mb-5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-sky-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HIGGSFIELD AI</span>
            </div>
          </div>

          <div className="px-2 mb-6">
            <div className="text-base font-extrabold tracking-tight leading-snug">
              {t.appTitle}
            </div>
            <div className="text-[11px] opacity-65 mt-0.5">{t.appSubtitle}</div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                      : 'opacity-75 hover:opacity-100 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] tabular-nums ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-white/10 opacity-80'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Summary Box */}
        <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] uppercase opacity-70">
              <span>{t.totalBudget}</span>
              <span>{calc.budgeted_generations} gen</span>
            </div>
            <div className="text-lg font-extrabold tabular-nums text-sky-400 text-right">
              {formatCurrencyUsd(calc.total_cost_usd, language)}
            </div>
            <div className="text-xs font-semibold tabular-nums opacity-85 text-right">
              {formatCurrencyIdr(calc.total_cost_idr, language)}
            </div>
          </div>

          <button
            onClick={() => saveProjectFile(false)}
            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/15 transition"
          >
            <Save className="w-3.5 h-3.5 text-sky-400" />
            {t.btnSaveProject}
            {hasUnsavedChanges && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Translucent Glass Bar */}
        <header
          className={`${headerClass} sticky top-0 z-20 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-sm font-bold truncate">
              {project.project_name}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                calc.is_complete
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-400/30'
                  : 'bg-amber-500/15 text-amber-300 border-amber-400/30'
              }`}
            >
              {calc.is_complete ? t.completeEstimate : t.incompleteEstimate}
            </span>
          </div>

          {/* Right Controls: Live FX Pill, Bilingual Segmented Switch (ID | EN), Theme Switch */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('settings')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-white/5 hover:bg-white/10 border border-white/10 tabular-nums transition"
            >
              <span className="opacity-70">USD/IDR:</span>
              <strong className="text-sky-400">
                {project.exchange_rate.rate
                  ? project.exchange_rate.rate.toLocaleString('id-ID')
                  : 'N/A'}
              </strong>
            </button>

            {/* Apple Segmented Language Selector: ID | EN */}
            <div className="flex items-center p-0.5 rounded-xl bg-black/20 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setLanguage('id')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  language === 'id'
                    ? 'bg-sky-500 text-white shadow'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  language === 'en'
                    ? 'bg-sky-500 text-white shadow'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                EN
              </button>
            </div>

            {/* Dark / Light Glass Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={
                isId
                  ? 'Ubah Tema Dark / Light Glass'
                  : 'Toggle Dark / Light Glass Theme'
              }
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          </div>
        </header>

        {/* Actionable Notification Banner */}
        {banner && (
          <div className="px-6 pt-4">
            <div
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs font-medium shadow-lg ${
                banner.type === 'error'
                  ? 'bg-rose-500/20 border-rose-400/40 text-rose-200'
                  : banner.type === 'warning'
                  ? 'bg-amber-500/20 border-amber-400/40 text-amber-200'
                  : banner.type === 'success'
                  ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200'
                  : 'bg-sky-500/20 border-sky-400/40 text-sky-200'
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
