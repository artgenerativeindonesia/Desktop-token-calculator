import React from 'react';
import { useProjectStore } from '../store/projectStore';
import { UI_TEXT } from '../i18n/translations';
import { StepFlowBar } from './StepFlowBar';
import { ExecutiveBudgetHeroCard } from './summary/ExecutiveBudgetHeroCard';
import { DurationReadinessCard } from './summary/DurationReadinessCard';
import { ElevenLabsSummaryCard } from './summary/ElevenLabsSummaryCard';
import { SunoMusicSummaryCard } from './summary/SunoMusicSummaryCard';
import { UnitEconomicsAndShareCard } from './summary/UnitEconomicsAndShareCard';
import { StageSummaryTable } from './summary/StageSummaryTable';

export const BudgetSummaryView: React.FC = () => {
  const { project, language, theme, setActiveTab } = useProjectStore();
  const t = UI_TEXT[language];
  const isId = language === 'id';
  const calc = project.calculation;

  return (
    <div className="space-y-6">
      {/* =====================================================================
       * TIER 1: DOMINANT FOCAL POINT — EXECUTIVE BUDGET HERO CARD
       * ===================================================================== */}
      <ExecutiveBudgetHeroCard
        language={language}
        theme={theme}
        project={project}
        calculation={calc}
        onNavigateToPdf={() => setActiveTab('pdf')}
      />

      {/* =====================================================================
       * TIER 1.5: DURATION COMPARISON & EDITING BUFFER READINESS CARD
       * ===================================================================== */}
      <DurationReadinessCard
        language={language}
        theme={theme}
        project={project}
        calculation={calc}
      />

      {/* =====================================================================
       * TIER 1.8: ELEVENLABS OFFICIAL VOICE OVER BREAKDOWN CARD
       * ===================================================================== */}
      <ElevenLabsSummaryCard
        language={language}
        theme={theme}
        project={project}
        calculation={calc}
      />

      {/* =====================================================================
       * TIER 1.95: OFFICIAL SUNO AI MUSIC SUMMARY CARD
       * ===================================================================== */}
      <SunoMusicSummaryCard
        language={language}
        theme={theme}
        project={project}
        calculation={calc}
      />

      {/* =====================================================================
       * TIER 2: SECONDARY SCANNING ZONE — UNIT ECONOMICS & VISUAL CATEGORY SHARE
       * ===================================================================== */}
      <UnitEconomicsAndShareCard
        language={language}
        theme={theme}
        project={project}
        calculation={calc}
      />

      {/* =====================================================================
       * TIER 3: STREAMLINED STAGE SUMMARY + POPUP FOR FULL AUDIT
       * ===================================================================== */}
      <StageSummaryTable
        language={language}
        theme={theme}
        project={project}
        calculation={calc}
      />

      {/* Guided Step Flow Footer */}
      <StepFlowBar
        currentStepNumber={4}
        stepTitle={t.navSummary}
        nextStepHint={
          isId
            ? 'Langkah terakhir: Pratinjau dokumen laporan ukuran A4 dan simpan sebagai file PDF resmi.'
            : 'Final step: Preview your A4 report document and save it as an official PDF file.'
        }
        prevTab="planner"
        prevLabel={t.navPlanner}
        nextTab="pdf"
        nextLabel={
          isId
            ? 'Lanjut ke Langkah 5: Cetak Laporan PDF'
            : 'Continue to Step 5: Save PDF Report'
        }
      />
    </div>
  );
};
