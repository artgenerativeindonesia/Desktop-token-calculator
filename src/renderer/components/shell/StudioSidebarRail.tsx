import React from 'react';
import { ActiveNavTab, useProjectStore } from '../../store/projectStore';
import {
  formatCurrencyIdr,
  formatCurrencyUsd,
  UI_TEXT,
} from '../../i18n/translations';
import {
  BarChart3,
  Database,
  Eye,
  FileDown,
  LayoutDashboard,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  Save,
  Sliders,
} from 'lucide-react';

interface StudioSidebarRailProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenQuickBudget: () => void;
}

export const StudioSidebarRail: React.FC<StudioSidebarRailProps> = ({
  isSidebarCollapsed,
  onToggleSidebar,
  onOpenQuickBudget,
}) => {
  const {
    project,
    activeTab,
    language,
    theme,
    hasUnsavedChanges,
    setActiveTab,
    saveProjectFile,
  } = useProjectStore();

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
      stepDesc: isId ? 'Susun shot & model AI' : 'Shots & AI models',
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

  const sidebarClass =
    theme === 'dark' ? 'glass-sidebar-dark' : 'glass-sidebar-light';

  return (
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
              onClick={onToggleSidebar}
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
                onClick={onToggleSidebar}
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
              onClick={onOpenQuickBudget}
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
              onClick={onOpenQuickBudget}
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
  );
};
