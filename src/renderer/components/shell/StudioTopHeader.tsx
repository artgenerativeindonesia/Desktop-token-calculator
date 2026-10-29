import React from 'react';
import { useProjectStore } from '../../store/projectStore';
import { UI_TEXT } from '../../i18n/translations';
import { HelpCircle, Moon, PanelLeftOpen, Sun } from 'lucide-react';

interface StudioTopHeaderProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenGuide: () => void;
}

export const StudioTopHeader: React.FC<StudioTopHeaderProps> = ({
  isSidebarCollapsed,
  onToggleSidebar,
  onOpenGuide,
}) => {
  const {
    project,
    language,
    theme,
    setLanguage,
    setTheme,
    setActiveTab,
  } = useProjectStore();

  const isId = language === 'id';
  const t = UI_TEXT[language];
  const calc = project.calculation;

  const headerClass =
    theme === 'dark' ? 'glass-header-dark' : 'glass-header-light';

  return (
    <header
      className={`${headerClass} sticky top-0 z-20 px-6 py-3 flex flex-wrap items-center justify-between gap-3`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {isSidebarCollapsed && (
          <button
            type="button"
            onClick={onToggleSidebar}
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
          onClick={onOpenGuide}
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
  );
};
