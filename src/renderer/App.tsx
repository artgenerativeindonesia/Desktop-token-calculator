import React, { useEffect, useState } from 'react';
import { useProjectStore } from './store/projectStore';
import { DashboardView } from './components/DashboardView';
import { ProjectSetupView } from './components/ProjectSetupView';
import { ProductionPlannerView } from './components/ProductionPlannerView';
import { BudgetSummaryView } from './components/BudgetSummaryView';
import { DataSettingsView } from './components/DataSettingsView';
import { ExportPdfView } from './components/ExportPdfView';
import {
  NotificationBanner,
  QuickBudgetPeekModal,
  StudioQuickGuideModal,
  StudioSidebarRail,
  StudioTopHeader,
} from './components/shell';

export const App: React.FC = () => {
  const { activeTab, theme, initApp, setActiveTab } = useProjectStore();

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

  const themeScopeClass =
    theme === 'dark'
      ? 'dark vv-theme-dark apple-bg-dark'
      : 'vv-theme-light apple-bg-light';

  return (
    <div className={`${themeScopeClass} min-h-screen flex flex-col lg:flex-row`}>
      {/* Visuvate Studio Architectural Sidebar Rail */}
      <StudioSidebarRail
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onOpenQuickBudget={() => setIsQuickBudgetModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Visuvate Studio Editor Top Bar */}
        <StudioTopHeader
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          onOpenGuide={() => setIsGuideModalOpen(true)}
        />

        {/* Actionable Notification Banner */}
        <NotificationBanner />

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

      {/* Frosted Modal: Panduan Cepat Cara Kerja Aplikasi */}
      <StudioQuickGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Frosted Modal: Intip Ringkasan Cepat Anggaran dari Layar Mana Saja */}
      <QuickBudgetPeekModal
        isOpen={isQuickBudgetModalOpen}
        onClose={() => setIsQuickBudgetModalOpen(false)}
        onOpenSummary={() => setActiveTab('summary')}
      />
    </div>
  );
};
