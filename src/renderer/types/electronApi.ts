import {
  AppLanguage,
  CatalogModelEntry,
  ExchangeRate,
  Pricing,
  ProjectFile,
  RecentProjectEntry,
} from '../../shared/types/project';

export interface ElectronBridgeApi {
  saveProject: (
    project: ProjectFile,
    currentFilePath?: string | null,
    saveAs?: boolean
  ) => Promise<{
    success: boolean;
    canceled?: boolean;
    filePath?: string;
    recentProjects?: RecentProjectEntry[];
    error_id?: string;
    error_en?: string;
  }>;

  openProject: (specificFilePath?: string) => Promise<{
    success: boolean;
    canceled?: boolean;
    project?: ProjectFile;
    filePath?: string;
    recentProjects?: RecentProjectEntry[];
    error_id?: string;
    error_en?: string;
  }>;

  getRecentProjects: () => Promise<RecentProjectEntry[]>;

  refreshExchangeRate: () => Promise<{
    success: boolean;
    exchangeRate: ExchangeRate;
    usedFallbackCache: boolean;
    error_id?: string;
    error_en?: string;
  }>;

  getCatalog: () => Promise<CatalogModelEntry[]>;

  refreshCatalog: () => Promise<{
    success: boolean;
    catalog: CatalogModelEntry[];
    verifiedAt: string;
    docsReachable: boolean;
    message_id: string;
    message_en: string;
  }>;

  saveModelRateOverride: (override: {
    model_id: string;
    price_value: number;
    credit_cost: number | null;
    pricing_unit?: Pricing['pricing_unit'];
  }) => Promise<CatalogModelEntry[]>;

  addCustomModel?: (
    newModel: CatalogModelEntry
  ) => Promise<CatalogModelEntry[]>;

  resetCatalogOverrides: () => Promise<CatalogModelEntry[]>;

  exportPdf: (
    project: ProjectFile,
    language: AppLanguage
  ) => Promise<{
    success: boolean;
    canceled?: boolean;
    filePath?: string;
    defaultFileName?: string;
    error_id?: string;
    error_en?: string;
  }>;
}

declare global {
  interface Window {
    api?: ElectronBridgeApi;
  }
}
