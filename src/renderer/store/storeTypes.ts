import {
  AppLanguage,
  BudgetAssumptions,
  CatalogModelEntry,
  EstimationMode,
  ExportSettings,
  GlassTheme,
  Pricing,
  ProcessCategory,
  ProductionItem,
  ProjectFile,
  RecentProjectEntry,
} from '../../shared/types/project';
import { ElevenLabsSubscriptionTier } from '../../shared/catalog/elevenlabsCatalog';
import { SunoSubscriptionTier } from '../../shared/catalog/sunoCatalog';

export type ActiveNavTab =
  | 'dashboard'
  | 'setup'
  | 'planner'
  | 'summary'
  | 'settings'
  | 'pdf';

export interface NotificationBanner {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message_id: string;
  message_en: string;
}

// ============================================================================
// 1. UI SLICE (Navigasi, Bahasa, Tema, Banner Notifikasi)
// ============================================================================
export interface UiSliceState {
  activeTab: ActiveNavTab;
  language: AppLanguage;
  theme: GlassTheme;
  banner: NotificationBanner | null;
}

export interface UiSliceActions {
  setActiveTab: (tab: ActiveNavTab) => void;
  setLanguage: (lang: AppLanguage) => void;
  setTheme: (theme: GlassTheme) => void;
  clearBanner: () => void;
  showBanner: (
    type: NotificationBanner['type'],
    message_id: string,
    message_en: string
  ) => void;
}

// ============================================================================
// 2. EXCHANGE RATE SLICE (Kurs USD/IDR, ECB Auto Refresh & Input Manual)
// ============================================================================
export interface ExchangeRateSliceState {
  isRefreshingFx: boolean;
}

export interface ExchangeRateSliceActions {
  refreshExchangeRateAuto: () => Promise<void>;
  setManualExchangeRate: (rateValue: number) => void;
}

// ============================================================================
// 3. CATALOG SLICE (Katalog Model AI, Langganan Higgsfield, ElevenLabs, Suno)
// ============================================================================
export interface CatalogSliceState {
  catalog: CatalogModelEntry[];
  selectedCreditPlanId: string;
  usdPerCredit: number;
  selectedElevenLabsPlanId: ElevenLabsSubscriptionTier;
  selectedSunoPlanId: SunoSubscriptionTier;
  isRefreshingCatalog: boolean;
}

export interface CatalogSliceActions {
  setSelectedElevenLabsPlanId: (planId: ElevenLabsSubscriptionTier) => void;
  setSelectedSunoPlanId: (planId: SunoSubscriptionTier) => void;
  refreshCatalogAuto: () => Promise<void>;
  applyCreditSubscriptionPlan: (
    planId: string,
    customUsdPerCredit?: number
  ) => void;
  addNewCustomModelToCatalog: (newModel: CatalogModelEntry) => Promise<void>;
  saveGlobalModelRateOverride: (
    modelId: string,
    priceUsd: number,
    creditCost: number | null,
    pricingUnit?: Pricing['pricing_unit']
  ) => Promise<void>;
  resetAllCatalogOverrides: () => Promise<void>;
}

// ============================================================================
// 4. PROJECT SLICE (Manajemen Proyek, Asumsi, Baris Planner & Ekspor PDF)
// ============================================================================
export interface ProjectSliceState {
  project: ProjectFile;
  currentFilePath: string | null;
  hasUnsavedChanges: boolean;
  recentProjects: RecentProjectEntry[];
  isExportingPdf: boolean;
}

export interface ProjectSliceActions {
  // Siklus Hidup Proyek (Lifecycle)
  initApp: () => Promise<void>;
  createNewBlankProject: (projectName?: string) => void;
  loadPrdSyntheticTest: () => void;
  loadCommercialSample: () => void;
  setProjectName: (name: string) => void;
  saveProjectFile: (saveAs?: boolean) => Promise<void>;
  openProjectFile: (specificFilePath?: string) => Promise<void>;
  importProjectFromJsonText: (jsonText: string, fileName?: string) => void;

  // Asumsi & Sinkronisasi Cadangan
  setEstimationMode: (mode: EstimationMode) => void;
  setTargetVideos: (count: number) => void;
  setFinalDurationMinutes: (minutes: number) => void;
  setFinalDurationSeconds: (seconds: number) => void;
  setDefaultShotsPerVideo: (shots: number) => void;
  setReserveByPercent: (percent: number) => void;
  setReserveByCount: (reserveCount: number) => void;
  setCadanganMultiplier: (multiplier: number) => void;

  // Tahap Pembuatan (Planner Production Items)
  addProductionItem: (category?: ProcessCategory) => void;
  duplicateProductionItem: (itemId: string) => void;
  removeProductionItem: (itemId: string) => void;
  updateProductionItemField: (
    itemId: string,
    updates: Partial<
      Pick<
        ProductionItem,
        | 'label'
        | 'quantity'
        | 'quantity_type'
        | 'duration_seconds'
        | 'attempts_per_item'
        | 'use_project_target_multiplier'
        | 'is_primary_shot'
        | 'is_unlimited'
        | 'notes'
        | 'script_text'
        | 'script_language'
        | 'character_count'
        | 'music_prompt'
        | 'music_genre'
        | 'is_instrumental'
        | 'music_role'
        | 'music_vocal_style'
        | 'music_lyrics'
        | 'extend_count'
        | 'stem_separation_mode'
        | 'exclude_styles'
        | 'stem_enabled'
        | 'stem_type'
        | 'stem_runs'
        | 'stem_reserve'
        | 'music_reserve_override'
      >
    >
  ) => void;
  toggleItemPrimaryShot: (itemId: string) => void;
  toggleItemUnlimited: (itemId: string, isUnlimited: boolean) => void;
  changeItemCategory: (itemId: string, category: ProcessCategory) => void;
  changeItemModel: (itemId: string, modelId: string) => void;
  changeItemParameter: (
    itemId: string,
    paramKey: string,
    paramValue: string | number | boolean
  ) => void;
  setManualItemPricing: (
    itemId: string,
    priceUsd: number | null,
    creditCost: number | null,
    pricingUnit?: Pricing['pricing_unit']
  ) => void;
  resetItemPricingToCatalog: (itemId: string) => void;

  // Ekspor Dokumen PDF
  updateExportSettings: (updates: Partial<ExportSettings>) => void;
  exportPdfReport: () => Promise<void>;
}

// ============================================================================
// COMBINED STORE INTERFACE (Facade gabungan untuk useProjectStore)
// ============================================================================
export type ProjectStoreState = UiSliceState &
  UiSliceActions &
  ExchangeRateSliceState &
  ExchangeRateSliceActions &
  CatalogSliceState &
  CatalogSliceActions &
  ProjectSliceState &
  ProjectSliceActions;
