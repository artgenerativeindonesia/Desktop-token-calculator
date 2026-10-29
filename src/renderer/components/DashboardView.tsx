import React, { useRef, useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { UI_TEXT } from '../i18n/translations';
import { StepFlowBar } from './StepFlowBar';
import { DashboardHeroSplit } from './dashboard/DashboardHeroSplit';
import { DashboardSupportingMetrics } from './dashboard/DashboardSupportingMetrics';
import { DashboardCategoryDistribution } from './dashboard/DashboardCategoryDistribution';
import { ProjectFileManagerModal } from './dashboard/ProjectFileManagerModal';
import { CategoryBreakdownModal } from './dashboard/CategoryBreakdownModal';
import { DataHealthCheckModal } from './dashboard/DataHealthCheckModal';

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
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const t = UI_TEXT[language];
  const isId = language === 'id';
  const calc = project.calculation;

  const handleBrowserFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        importProjectFromJsonText(reader.result, file.name);
        setIsProjectModalOpen(false);
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

      {/* =====================================================================
       * TIER 1: DOMINANT FOCAL POINT — ASYMMETRIC HERO SPLIT (7 cols + 5 cols)
       * ===================================================================== */}
      <DashboardHeroSplit
        language={language}
        theme={theme}
        project={project}
        calculation={calc}
        hasUnsavedChanges={hasUnsavedChanges}
        onOpenPlanner={() => setActiveTab('planner')}
        onOpenProjectModal={() => setIsProjectModalOpen(true)}
        onSaveProject={() => saveProjectFile(false)}
      />

      {/* =====================================================================
       * TIER 2: SECONDARY SCANNING ZONE — 3 BALANCED SUPPORTING CARDS
       * ===================================================================== */}
      <DashboardSupportingMetrics
        language={language}
        theme={theme}
        project={project}
        calculation={calc}
        isRefreshingFx={isRefreshingFx}
        onRefreshFx={refreshExchangeRateAuto}
        onNavigateToSetup={() => setActiveTab('setup')}
        onNavigateToPlanner={() => setActiveTab('planner')}
        onNavigateToSettings={() => setActiveTab('settings')}
      />

      {/* =====================================================================
       * TIER 3: COMPACT CATEGORY CHIPS & FROSTED GLASS DETAIL TRIGGERS
       * ===================================================================== */}
      <DashboardCategoryDistribution
        language={language}
        theme={theme}
        calculation={calc}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
        onOpenStatusModal={() => setIsStatusModalOpen(true)}
      />

      {/* Guided Step Flow Footer */}
      <StepFlowBar
        currentStepNumber={1}
        stepTitle={t.navDashboard}
        nextStepHint={
          isId
            ? 'Langkah selanjutnya: Tentukan nama proyek dan angka cadangan percobaan per shot / gambar.'
            : 'Next step: Configure your project name and define your shot/image retry reserve factor.'
        }
        nextTab="setup"
        nextLabel={
          isId
            ? 'Lanjut ke Langkah 2: Pengaturan Proyek'
            : 'Continue to Step 2: Project Setup'
        }
      />

      {/* =====================================================================
       * FROSTED GLASS MODAL 1: Buka / Ganti Proyek & Contoh Simulasi
       * ===================================================================== */}
      <ProjectFileManagerModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        language={language}
        theme={theme}
        currentFilePath={currentFilePath}
        recentProjects={recentProjects}
        onCreateNewBlank={createNewBlankProject}
        onOpenProjectFile={openProjectFile}
        onLoadCommercialSample={loadCommercialSample}
        onLoadPrdTest={loadPrdSyntheticTest}
        onFallbackFileInput={() => fileInputRef.current?.click()}
      />

      {/* =====================================================================
       * FROSTED GLASS MODAL 2: Tabel Lengkap Rincian Kategori AI
       * ===================================================================== */}
      <CategoryBreakdownModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        language={language}
        theme={theme}
        calculation={calc}
        onNavigateToPlanner={() => setActiveTab('planner')}
      />

      {/* =====================================================================
       * FROSTED GLASS MODAL 3: Status Kelengkapan Data & Info Penting
       * ===================================================================== */}
      <DataHealthCheckModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        language={language}
        theme={theme}
        exchangeRate={project.exchange_rate}
        calculation={calc}
      />
    </div>
  );
};
