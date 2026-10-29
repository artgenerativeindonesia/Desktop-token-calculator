import React, { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { UI_TEXT } from '../i18n/translations';
import { StepFlowBar } from './StepFlowBar';
import { SettingsTab } from './settings/settingsTypes';
import { ExchangeRateSection } from './settings/ExchangeRateSection';
import { HiggsfieldCatalogSection } from './settings/HiggsfieldCatalogSection';
import { AudioProvidersSection } from './settings/AudioProvidersSection';
import { Coins, Globe, Layers, Mic, Music } from 'lucide-react';

export const DataSettingsView: React.FC = () => {
  const {
    project,
    catalog,
    language,
    theme,
    selectedCreditPlanId,
    usdPerCredit,
    selectedElevenLabsPlanId,
    setSelectedElevenLabsPlanId,
    selectedSunoPlanId,
    setSelectedSunoPlanId,
    isRefreshingFx,
    isRefreshingCatalog,
    refreshExchangeRateAuto,
    setManualExchangeRate,
    refreshCatalogAuto,
    saveGlobalModelRateOverride,
    resetAllCatalogOverrides,
    applyCreditSubscriptionPlan,
    addNewCustomModelToCatalog,
  } = useProjectStore();

  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>('all');

  const t = UI_TEXT[language];
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';

  const settingsTabs = [
    {
      id: 'all' as SettingsTab,
      label: isId ? 'Semua Pengaturan' : 'All Settings',
      icon: Layers,
    },
    {
      id: 'fx' as SettingsTab,
      label: isId ? 'Kurs Rupiah (USD & IDR)' : 'Exchange Rate (USD & IDR)',
      icon: Globe,
    },
    {
      id: 'higgsfield' as SettingsTab,
      label: isId ? 'Katalog Video & Gambar Higgsfield' : 'Higgsfield Video & Image Catalog',
      icon: Coins,
    },
    {
      id: 'audio' as SettingsTab,
      label: isId ? 'Audio AI (ElevenLabs & Suno)' : 'Audio AI (ElevenLabs & Suno)',
      icon: Music,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigasi Pengaturan Terorganisir */}
      <div className={`${cardClass} rounded-[16px] p-2.5`}>
        <div className="flex flex-wrap items-center gap-1.5">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSettingsTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSettingsTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#0068ad] text-white shadow-sm'
                    : 'bg-[var(--vv-tint-weak)] text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)] hover:bg-[var(--vv-tint)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Modul Kurs Mata Uang (USD & IDR) */}
      {(activeSettingsTab === 'all' || activeSettingsTab === 'fx') && (
        <ExchangeRateSection
          language={language}
          theme={theme}
          exchangeRate={project.exchange_rate}
          usdPerCredit={usdPerCredit}
          totalModelsCount={catalog.length}
          isRefreshingFx={isRefreshingFx}
          onRefreshExchangeRate={refreshExchangeRateAuto}
          onSetManualExchangeRate={setManualExchangeRate}
          projectCalculationTotalCostUsd={project.calculation.total_cost_usd}
        />
      )}

      {/* 2. Modul Audio Providers (ElevenLabs Voice Over & Suno AI Music) */}
      {(activeSettingsTab === 'all' || activeSettingsTab === 'audio') && (
        <AudioProvidersSection
          language={language}
          theme={theme}
          exchangeRate={project.exchange_rate}
          selectedElevenLabsPlanId={selectedElevenLabsPlanId}
          setSelectedElevenLabsPlanId={setSelectedElevenLabsPlanId}
          selectedSunoPlanId={selectedSunoPlanId}
          setSelectedSunoPlanId={setSelectedSunoPlanId}
        />
      )}

      {/* 3. Modul Katalog Higgsfield (Paket Langganan & Model Video/Gambar) */}
      {(activeSettingsTab === 'all' || activeSettingsTab === 'higgsfield') && (
        <HiggsfieldCatalogSection
          language={language}
          theme={theme}
          catalog={catalog}
          exchangeRate={project.exchange_rate}
          selectedCreditPlanId={selectedCreditPlanId}
          usdPerCredit={usdPerCredit}
          isRefreshingCatalog={isRefreshingCatalog}
          onApplyCreditSubscriptionPlan={applyCreditSubscriptionPlan}
          onRefreshCatalogAuto={refreshCatalogAuto}
          onResetAllCatalogOverrides={resetAllCatalogOverrides}
          onSaveGlobalModelRateOverride={saveGlobalModelRateOverride}
          onAddNewCustomModelToCatalog={addNewCustomModelToCatalog}
        />
      )}

      {/* Guided Step Flow Footer */}
      <StepFlowBar
        currentStepNumber={6}
        totalSteps={6}
        stepTitle={t.navDataSettings}
        nextStepHint={
          isId
            ? 'Kurs dan daftar harga model AI sudah siap. Kembali ke Daftar Pekerjaan atau langsung cetak Laporan PDF.'
            : 'Exchange rate and AI model prices are set. Return to your Production List or export your PDF Report.'
        }
        prevTab="planner"
        prevLabel={t.navPlanner}
        nextTab="pdf"
        nextLabel={t.navExportPdf}
      />
    </div>
  );
};
