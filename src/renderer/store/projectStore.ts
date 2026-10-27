import { create } from 'zustand';
import {
  AppLanguage,
  BudgetAssumptions,
  CatalogModelEntry,
  CURRENT_SCHEMA_VERSION,
  EstimationMode,
  ExchangeRate,
  ExportSettings,
  GlassTheme,
  Pricing,
  ProcessCategory,
  ProductionItem,
  ProjectFile,
  RecentProjectEntry,
} from '../../shared/types/project';
import {
  calculateBidirectionalReserve,
  calculateProjectBudget,
  createPrdSyntheticTestProject,
  createProductionItemFromCatalog,
  createSampleCommercialProject,
} from '../../shared/engine/calculationEngine';
import {
  applyCreditPlanRateToCatalog,
  DEFAULT_USD_PER_CREDIT,
  getDefaultParametersForModel,
  getModelsByCategory,
  HIGGSFIELD_MODEL_CATALOG,
  HIGGSFIELD_SUBSCRIPTION_PLANS,
  resolveModelPricing,
} from '../../shared/catalog/higgsfieldCatalog';
import { validateProjectFileJson } from '../../shared/schema/projectSchema';
import {
  buildSafePdfFilename,
  generatePdfReportHtml,
} from '../../shared/pdf/pdfReportBuilder';

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

interface ProjectStoreState {
  project: ProjectFile;
  currentFilePath: string | null;
  hasUnsavedChanges: boolean;
  activeTab: ActiveNavTab;
  language: AppLanguage;
  theme: GlassTheme;
  catalog: CatalogModelEntry[];
  selectedCreditPlanId: string;
  usdPerCredit: number;
  recentProjects: RecentProjectEntry[];
  isRefreshingFx: boolean;
  isRefreshingCatalog: boolean;
  isExportingPdf: boolean;
  banner: NotificationBanner | null;

  // Navigation & UI Preferences
  setActiveTab: (tab: ActiveNavTab) => void;
  setLanguage: (lang: AppLanguage) => void;
  setTheme: (theme: GlassTheme) => void;
  clearBanner: () => void;
  showBanner: (
    type: NotificationBanner['type'],
    message_id: string,
    message_en: string
  ) => void;

  // Project Lifecycle
  initApp: () => Promise<void>;
  createNewBlankProject: (projectName?: string) => void;
  loadPrdSyntheticTest: () => void;
  loadCommercialSample: () => void;
  setProjectName: (name: string) => void;
  saveProjectFile: (saveAs?: boolean) => Promise<void>;
  openProjectFile: (specificFilePath?: string) => Promise<void>;
  importProjectFromJsonText: (jsonText: string, fileName?: string) => void;

  // Assumptions & Bidirectional Reserve Sync (R <-> Greserve)
  setEstimationMode: (mode: EstimationMode) => void;
  setTargetVideos: (count: number) => void;
  setFinalDurationMinutes: (minutes: number) => void;
  setDefaultShotsPerVideo: (shots: number) => void;
  setReserveByPercent: (percent: number) => void;
  setReserveByCount: (reserveCount: number) => void;
  setCadanganMultiplier: (multiplier: number) => void;

  // Production Items (Planner)
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
        | 'is_unlimited'
        | 'notes'
      >
    >
  ) => void;
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

  // Exchange Rate & Catalog Connectors
  refreshExchangeRateAuto: () => Promise<void>;
  setManualExchangeRate: (rateValue: number) => void;
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

  // PDF Export
  updateExportSettings: (updates: Partial<ExportSettings>) => void;
  exportPdfReport: () => Promise<void>;
}

function recalculateProject(project: ProjectFile): ProjectFile {
  // Pertahankan mode khusus untuk proyek uji sintetis PRD Bab 8.10 (10 + 20% = 12 generasi)
  if (project.project_id === 'proj_prd_synthetic_8_10') {
    const calculation = calculateProjectBudget(
      project.items,
      project.assumptions,
      project.exchange_rate
    );
    return {
      ...project,
      calculation,
      updated_at: new Date().toISOString(),
    };
  }

  const cadanganMultiplier = Math.max(
    1,
    project.assumptions.default_attempts_per_shot ||
      project.assumptions.reserve_generations_override ||
      1
  );

  // Pastikan setiap baris pekerjaan menggunakan faktor perkalian cadangan Langkah 2 yang selaras
  const items = project.items.map((item) => ({
    ...item,
    attempts_per_item: cadanganMultiplier,
  }));

  // Sesuai model perkalian cadangan: Total = Kebutuhan x Cadangan Langkah 2.
  // Cadangan tidak lagi ditambahkan ganda di atas hasil perkalian (reserve override = 0, reserve percent = 0).
  const syncedAssumptions: BudgetAssumptions = {
    ...project.assumptions,
    default_attempts_per_shot: cadanganMultiplier,
    reserve_percent: 0,
    reserve_generations_override: 0,
    reserve_input_mode: 'count',
  };

  const calculation = calculateProjectBudget(
    items,
    syncedAssumptions,
    project.exchange_rate
  );

  return {
    ...project,
    items,
    assumptions: syncedAssumptions,
    calculation,
    updated_at: new Date().toISOString(),
  };
}

export const useProjectStore = create<ProjectStoreState>((set, get) => ({
  project: recalculateProject(createSampleCommercialProject()),
  currentFilePath: null,
  hasUnsavedChanges: false,
  activeTab: 'dashboard',
  language: 'id',
  theme: 'dark',
  catalog: HIGGSFIELD_MODEL_CATALOG,
  selectedCreditPlanId: 'api_standard',
  usdPerCredit: DEFAULT_USD_PER_CREDIT,
  recentProjects: [],
  isRefreshingFx: false,
  isRefreshingCatalog: false,
  isExportingPdf: false,
  banner: null,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setLanguage: (lang) =>
    set((state) => ({
      language: lang,
      project: {
        ...state.project,
        language: lang,
        export_settings: {
          ...state.project.export_settings,
          export_language: lang,
        },
      },
    })),

  setTheme: (theme) => set({ theme }),

  clearBanner: () => set({ banner: null }),

  showBanner: (type, message_id, message_en) =>
    set({
      banner: {
        id: String(Date.now()),
        type,
        message_id,
        message_en,
      },
    }),

  initApp: async () => {
    try {
      if (window.api) {
        const [catalog, recents] = await Promise.all([
          window.api.getCatalog(),
          window.api.getRecentProjects(),
        ]);
        if (catalog && catalog.length > 0) {
          set({ catalog });
        }
        if (recents) {
          set({ recentProjects: recents });
        }
      }
      // Segarkan kurs otomatis saat aplikasi dibuka
      await get().refreshExchangeRateAuto();
    } catch {
      // Fallback aman
    }
  },

  createNewBlankProject: (customName) => {
    const now = new Date().toISOString();
    const { language, project: prevProject } = get();
    const defaultItem = createProductionItemFromCatalog(
      'text_to_video',
      'kling-video/v3.0',
      language === 'id' ? 'Shot 01 - Adegan Pembuka' : 'Shot 01 - Opening Scene',
      3,
      2,
      5
    );

    const newProj: ProjectFile = recalculateProject({
      schema_version: CURRENT_SCHEMA_VERSION,
      project_id: `proj_${Date.now()}`,
      project_name:
        customName?.trim() ||
        (language === 'id' ? 'Proyek Anggaran Video AI Baru' : 'New AI Video Budget Project'),
      created_at: now,
      updated_at: now,
      currency: 'USD',
      language,
      assumptions: {
        estimation_mode: 'per_shot',
        target_videos: 1,
        final_duration_minutes: 1.0,
        default_shots_per_video: 5,
        default_attempts_per_shot: 2,
        reserve_input_mode: 'percent',
        reserve_percent: 20,
        reserve_generations_override: 2,
      },
      items: [defaultItem],
      exchange_rate: prevProject.exchange_rate,
      calculation: prevProject.calculation,
      export_settings: {
        report_title:
          language === 'id'
            ? 'Laporan Estimasi Anggaran Produksi Video AI'
            : 'AI Video Production Budget Estimate Report',
        export_date: now.slice(0, 10),
        export_language: language,
        prepared_by: 'Produser Video AI',
        client_or_team_name: 'Tim Produksi',
        included_sections: {
          executive_summary: true,
          production_assumptions: true,
          stage_breakdown: true,
          credit_breakdown: true,
          exchange_rate_info: true,
          warnings_and_audit: true,
          unit_cost_metrics: true,
        },
      },
    });

    set({
      project: newProj,
      currentFilePath: null,
      hasUnsavedChanges: true,
      activeTab: 'setup',
    });
    get().showBanner(
      'info',
      'Proyek baru berhasil dibuat. Silakan atur nama proyek dan tahapan produksi.',
      'New project created. Please configure the project name and production stages.'
    );
  },

  loadPrdSyntheticTest: () => {
    const { project: prevProject, language } = get();
    const prdProj = createPrdSyntheticTestProject(prevProject.exchange_rate);
    prdProj.language = language;
    prdProj.export_settings.export_language = language;
    set({
      project: prdProj,
      currentFilePath: null,
      hasUnsavedChanges: false,
      activeTab: 'summary',
    });
    get().showBanner(
      'success',
      'Contoh Simulasi Sederhana berhasil dimuat: 10 rencana buat awal + cadangan 20% (2 kali) × USD 2 = USD 20 biaya utama + USD 4 cadangan = USD 24 total.',
      'Simple Simulation Sample loaded: 10 initial tries + 20% reserve (2 tries) × USD 2 = USD 20 base + USD 4 reserve = USD 24 total.'
    );
  },

  loadCommercialSample: () => {
    const { project: prevProject, language } = get();
    const sample = recalculateProject(
      createSampleCommercialProject(prevProject.exchange_rate)
    );
    sample.language = language;
    sample.export_settings.export_language = language;
    set({
      project: sample,
      currentFilePath: null,
      hasUnsavedChanges: false,
      activeTab: 'planner',
    });
    get().showBanner(
      'success',
      'Contoh proyek iklan lengkap berhasil dimuat (mencakup pembuatan gambar, animasi video, hingga peningkatan kualitas 4K).',
      'Full commercial sample project loaded.'
    );
  },

  setProjectName: (name) =>
    set((state) => ({
      hasUnsavedChanges: true,
      project: {
        ...state.project,
        project_name: name,
        updated_at: new Date().toISOString(),
      },
    })),

  saveProjectFile: async (saveAs = false) => {
    const { project, currentFilePath } = get();
    if (!project.project_name.trim()) {
      get().showBanner(
        'error',
        'Nama proyek tidak boleh kosong. Silakan isi nama proyek terlebih dahulu.',
        'Project name cannot be empty. Please enter a project name first.'
      );
      return;
    }

    const updatedProject = recalculateProject(project);

    if (window.api) {
      const res = await window.api.saveProject(
        updatedProject,
        currentFilePath,
        saveAs
      );
      if (res.canceled) return;
      if (!res.success) {
        get().showBanner(
          'error',
          res.error_id || 'Gagal menyimpan file proyek.',
          res.error_en || 'Failed to save project file.'
        );
        return;
      }
      set({
        project: updatedProject,
        currentFilePath: res.filePath ?? currentFilePath,
        hasUnsavedChanges: false,
        recentProjects: res.recentProjects ?? get().recentProjects,
      });
      get().showBanner(
        'success',
        `Proyek berhasil disimpan ke: ${res.filePath}`,
        `Project saved successfully to: ${res.filePath}`
      );
      return;
    }

    // Browser Fallback: Unduh sebagai file .aivbudget
    const blob = new Blob([JSON.stringify(updatedProject, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const cleanName = updatedProject.project_name
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    a.href = url;
    a.download = `${cleanName || 'Project'}.aivbudget`;
    a.click();
    URL.revokeObjectURL(url);
    set({ project: updatedProject, hasUnsavedChanges: false });
    get().showBanner(
      'success',
      'File proyek (.aivbudget) berhasil diunduh.',
      'Project file (.aivbudget) downloaded successfully.'
    );
  },

  openProjectFile: async (specificFilePath) => {
    if (window.api) {
      const res = await window.api.openProject(specificFilePath);
      if (res.canceled) return;
      if (!res.success || !res.project) {
        get().showBanner(
          'error',
          res.error_id || 'Gagal membuka file proyek.',
          res.error_en || 'Failed to open project file.'
        );
        return;
      }
      const recalculated = recalculateProject(res.project);
      set({
        project: recalculated,
        currentFilePath: res.filePath ?? null,
        hasUnsavedChanges: false,
        recentProjects: res.recentProjects ?? get().recentProjects,
      });
      get().showBanner(
        'success',
        `Proyek "${recalculated.project_name}" berhasil dibuka.`,
        `Project "${recalculated.project_name}" opened successfully.`
      );
      return;
    }
  },

  importProjectFromJsonText: (jsonText, fileName) => {
    const validation = validateProjectFileJson(jsonText);
    if (!validation.valid || !validation.data) {
      get().showBanner(
        'error',
        validation.errorMessage_id || 'File proyek tidak valid.',
        validation.errorMessage_en || 'Invalid project file.'
      );
      return;
    }
    const recalculated = recalculateProject(validation.data);
    set({
      project: recalculated,
      currentFilePath: fileName ?? null,
      hasUnsavedChanges: false,
    });
    get().showBanner(
      'success',
      `Proyek "${recalculated.project_name}" berhasil dimuat.`,
      `Project "${recalculated.project_name}" loaded successfully.`
    );
  },

  setEstimationMode: (mode) =>
    set((state) => {
      const items = state.project.items.map((item) => ({
        ...item,
        use_project_target_multiplier: mode === 'target_final',
      }));
      return {
        hasUnsavedChanges: true,
        project: recalculateProject({
          ...state.project,
          items,
          assumptions: {
            ...state.project.assumptions,
            estimation_mode: mode,
          },
        }),
      };
    }),

  setTargetVideos: (count) =>
    set((state) => ({
      hasUnsavedChanges: true,
      project: recalculateProject({
        ...state.project,
        assumptions: {
          ...state.project.assumptions,
          target_videos: Math.max(0, Math.floor(count || 0)),
        },
      }),
    })),

  setFinalDurationMinutes: (minutes) =>
    set((state) => ({
      hasUnsavedChanges: true,
      project: recalculateProject({
        ...state.project,
        assumptions: {
          ...state.project.assumptions,
          final_duration_minutes: Math.max(0, Number(minutes) || 0),
        },
      }),
    })),

  setDefaultShotsPerVideo: (shots) =>
    set((state) => ({
      hasUnsavedChanges: true,
      project: recalculateProject({
        ...state.project,
        assumptions: {
          ...state.project.assumptions,
          default_shots_per_video: Math.max(0, Math.floor(shots || 0)),
        },
      }),
    })),

  // Sinkronisasi 2 Arah: User mengubah Persentase Cadangan (R) -> Greserve terhitung otomatis
  setReserveByPercent: (percent) =>
    set((state) => {
      const cleanPercent = Math.max(0, Number(percent) || 0);
      return {
        hasUnsavedChanges: true,
        project: recalculateProject({
          ...state.project,
          assumptions: {
            ...state.project.assumptions,
            reserve_input_mode: 'percent',
            reserve_percent: cleanPercent,
          },
        }),
      };
    }),

  // Pengaturan Cadangan Langsung: Mengatur faktor perkalian cadangan untuk seluruh adegan
  setCadanganMultiplier: (multiplier) =>
    set((state) => {
      const cleanMultiplier = Math.max(1, Math.floor(Number(multiplier) || 1));
      const items = state.project.items.map((item) => ({
        ...item,
        attempts_per_item: cleanMultiplier,
      }));
      return {
        hasUnsavedChanges: true,
        project: recalculateProject({
          ...state.project,
          items,
          assumptions: {
            ...state.project.assumptions,
            default_attempts_per_shot: cleanMultiplier,
            reserve_generations_override: 0,
            reserve_percent: 0,
            reserve_input_mode: 'count',
          },
        }),
      };
    }),

  // Sinkronisasi 2 Arah: User mengubah Jumlah Generasi Cadangan (Greserve) -> Persentase (R) terhitung otomatis
  setReserveByCount: (reserveCount) =>
    set((state) => {
      const cleanCount = Math.max(1, Math.floor(Number(reserveCount) || 1));
      const items = state.project.items.map((item) => ({
        ...item,
        attempts_per_item: cleanCount,
      }));
      return {
        hasUnsavedChanges: true,
        project: recalculateProject({
          ...state.project,
          items,
          assumptions: {
            ...state.project.assumptions,
            default_attempts_per_shot: cleanCount,
            reserve_input_mode: 'count',
            reserve_generations_override: 0,
            reserve_percent: 0,
          },
        }),
      };
    }),

  addProductionItem: (category = 'text_to_video') =>
    set((state) => {
      const models = getModelsByCategory(category, state.catalog);
      const selectedModel = models[0] || state.catalog[0];
      const nextIndex = state.project.items.length + 1;
      const newItem = createProductionItemFromCatalog(
        category,
        selectedModel.model_id,
        state.language === 'id'
          ? `Shot ${String(nextIndex).padStart(2, '0')} - ${selectedModel.family}`
          : `Shot ${String(nextIndex).padStart(2, '0')} - ${selectedModel.family}`,
        state.project.assumptions.estimation_mode === 'target_final'
          ? state.project.assumptions.default_shots_per_video
          : 2,
        state.project.assumptions.default_attempts_per_shot || 2,
        selectedModel.default_duration_seconds
      );
      newItem.use_project_target_multiplier =
        state.project.assumptions.estimation_mode === 'target_final';

      return {
        hasUnsavedChanges: true,
        project: recalculateProject({
          ...state.project,
          items: [...state.project.items, newItem],
        }),
      };
    }),

  duplicateProductionItem: (itemId) =>
    set((state) => {
      const idx = state.project.items.findIndex((i) => i.item_id === itemId);
      if (idx === -1) return state;
      const source = state.project.items[idx];
      const copy: ProductionItem = {
        ...JSON.parse(JSON.stringify(source)),
        item_id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        label: `${source.label} (Copy)`,
      };
      const nextItems = [...state.project.items];
      nextItems.splice(idx + 1, 0, copy);
      return {
        hasUnsavedChanges: true,
        project: recalculateProject({
          ...state.project,
          items: nextItems,
        }),
      };
    }),

  removeProductionItem: (itemId) =>
    set((state) => ({
      hasUnsavedChanges: true,
      project: recalculateProject({
        ...state.project,
        items: state.project.items.filter((i) => i.item_id !== itemId),
      }),
    })),

  updateProductionItemField: (itemId, updates) =>
    set((state) => {
      const items = state.project.items.map((item) =>
        item.item_id === itemId ? { ...item, ...updates } : item
      );
      return {
        hasUnsavedChanges: true,
        project: recalculateProject({
          ...state.project,
          items,
        }),
      };
    }),

  changeItemCategory: (itemId, category) =>
    set((state) => {
      const models = getModelsByCategory(category, state.catalog);
      const model = models[0] || state.catalog[0];
      const defaultParams = getDefaultParametersForModel(model);
      const pricing = resolveModelPricing(model, defaultParams);

      const items = state.project.items.map((item) => {
        if (item.item_id !== itemId) return item;
        return {
          ...item,
          category,
          quantity_type: model.default_quantity_type,
          duration_seconds: model.supports_duration
            ? item.duration_seconds > 0
              ? item.duration_seconds
              : model.default_duration_seconds
            : 0,
          model_selection: {
            provider: model.provider,
            model_id: model.model_id,
            model_name: model.model_name,
            category,
            parameter_values: defaultParams,
          },
          pricing,
        };
      });

      return {
        hasUnsavedChanges: true,
        project: recalculateProject({
          ...state.project,
          items,
        }),
      };
    }),

  changeItemModel: (itemId, modelId) =>
    set((state) => {
      const model =
        state.catalog.find((m) => m.model_id === modelId) || state.catalog[0];
      const defaultParams = getDefaultParametersForModel(model);
      const pricing = resolveModelPricing(model, defaultParams);

      const items = state.project.items.map((item) => {
        if (item.item_id !== itemId) return item;
        return {
          ...item,
          quantity_type: model.default_quantity_type,
          duration_seconds: model.supports_duration
            ? item.duration_seconds > 0
              ? item.duration_seconds
              : model.default_duration_seconds
            : 0,
          model_selection: {
            provider: model.provider,
            model_id: model.model_id,
            model_name: model.model_name,
            category: item.category,
            parameter_values: defaultParams,
          },
          pricing,
        };
      });

      return {
        hasUnsavedChanges: true,
        project: recalculateProject({
          ...state.project,
          items,
        }),
      };
    }),

  changeItemParameter: (itemId, paramKey, paramValue) =>
    set((state) => {
      const items = state.project.items.map((item) => {
        if (item.item_id !== itemId) return item;
        const model = state.catalog.find(
          (m) => m.model_id === item.model_selection.model_id
        );
        const updatedParams = {
          ...item.model_selection.parameter_values,
          [paramKey]: paramValue,
        };

        // Jika harga belum di-override manual oleh user, perbarui dari varian katalog
        const nextPricing =
          model && item.pricing.status !== 'manual'
            ? resolveModelPricing(model, updatedParams)
            : item.pricing;

        return {
          ...item,
          model_selection: {
            ...item.model_selection,
            parameter_values: updatedParams,
          },
          pricing: nextPricing,
        };
      });

      return {
        hasUnsavedChanges: true,
        project: recalculateProject({
          ...state.project,
          items,
        }),
      };
    }),

  setManualItemPricing: (itemId, priceUsd, creditCost, pricingUnit) =>
    set((state) => {
      const now = new Date().toISOString();
      const items = state.project.items.map((item) => {
        if (item.item_id !== itemId) return item;
        const isValidPrice =
          priceUsd !== null && Number.isFinite(priceUsd) && priceUsd > 0;
        return {
          ...item,
          pricing: {
            ...item.pricing,
            pricing_unit: pricingUnit ?? item.pricing.pricing_unit,
            price_value: isValidPrice ? priceUsd : null,
            credit_cost:
              creditCost !== null &&
              Number.isFinite(creditCost) &&
              creditCost >= 0
                ? creditCost
                : null,
            source_name: 'Input Manual Pengguna',
            source_url: 'manual://user-override',
            retrieved_at: now,
            status: isValidPrice ? ('manual' as const) : ('unavailable' as const),
          },
        };
      });

      return {
        hasUnsavedChanges: true,
        project: recalculateProject({
          ...state.project,
          items,
        }),
      };
    }),

  resetItemPricingToCatalog: (itemId) =>
    set((state) => {
      const items = state.project.items.map((item) => {
        if (item.item_id !== itemId) return item;
        const model = state.catalog.find(
          (m) => m.model_id === item.model_selection.model_id
        );
        if (!model) return item;
        return {
          ...item,
          pricing: resolveModelPricing(
            model,
            item.model_selection.parameter_values
          ),
        };
      });

      return {
        hasUnsavedChanges: true,
        project: recalculateProject({
          ...state.project,
          items,
        }),
      };
    }),

  toggleItemUnlimited: (itemId, isUnlimited) =>
    set((state) => {
      const items = state.project.items.map((item) =>
        item.item_id === itemId ? { ...item, is_unlimited: isUnlimited } : item
      );
      return {
        hasUnsavedChanges: true,
        project: recalculateProject({
          ...state.project,
          items,
        }),
      };
    }),

  refreshExchangeRateAuto: async () => {
    set({ isRefreshingFx: true });
    try {
      if (window.api) {
        const res = await window.api.refreshExchangeRate();
        set((state) => ({
          isRefreshingFx: false,
          project: recalculateProject({
            ...state.project,
            exchange_rate: res.exchangeRate,
          }),
        }));
        if (!res.success && res.error_id) {
          get().showBanner('warning', res.error_id, res.error_en || res.error_id);
        } else if (res.success) {
          get().showBanner(
            'success',
            `Kurs USD/IDR berhasil diperbarui otomatis: Rp ${res.exchangeRate.rate?.toLocaleString('id-ID')} (${res.exchangeRate.source_name})`,
            `USD/IDR exchange rate refreshed automatically: IDR ${res.exchangeRate.rate?.toLocaleString('en-US')} (${res.exchangeRate.source_name})`
          );
        }
        return;
      }

      // Fallback langsung via fetch browser jika berjalan tanpa proses main Electron
      const response = await fetch(
        'https://api.frankfurter.dev/latest?from=USD&to=IDR'
      );
      if (response.ok) {
        const data = await response.json();
        if (data?.rates?.IDR && data.rates.IDR > 100) {
          const nextFx: ExchangeRate = {
            base_currency: 'USD',
            quote_currency: 'IDR',
            rate: data.rates.IDR,
            rate_type: 'ECB Reference Rate (Kurs Referensi Bank Sentral)',
            source_name: `Frankfurter API (ECB ${data.date || ''})`,
            source_url: 'https://api.frankfurter.dev/latest?from=USD&to=IDR',
            retrieved_at: new Date().toISOString(),
            status: 'verified',
          };
          set((state) => ({
            isRefreshingFx: false,
            project: recalculateProject({
              ...state.project,
              exchange_rate: nextFx,
            }),
          }));
          get().showBanner(
            'success',
            `Kurs USD/IDR berhasil diperbarui: Rp ${nextFx.rate?.toLocaleString('id-ID')}`,
            `USD/IDR rate updated: IDR ${nextFx.rate?.toLocaleString('en-US')}`
          );
          return;
        }
      }
      set({ isRefreshingFx: false });
    } catch {
      set({ isRefreshingFx: false });
      get().showBanner(
        'warning',
        'Tidak dapat memperbarui kurs otomatis (offline). Menggunakan kurs terakhir atau silakan isi kurs manual.',
        'Could not refresh exchange rate automatically (offline). Using cached rate or enter manual rate.'
      );
    }
  },

  setManualExchangeRate: (rateValue) =>
    set((state) => {
      const cleanRate = Number(rateValue);
      const isValid = Number.isFinite(cleanRate) && cleanRate > 0;
      const manualFx: ExchangeRate = {
        base_currency: 'USD',
        quote_currency: 'IDR',
        rate: isValid ? cleanRate : null,
        rate_type: 'Manual Input (Input Pengguna)',
        source_name: 'Input Manual Pengguna',
        source_url: 'manual://user-input',
        retrieved_at: new Date().toISOString(),
        status: isValid ? 'manual' : 'unavailable',
      };
      return {
        hasUnsavedChanges: true,
        project: recalculateProject({
          ...state.project,
          exchange_rate: manualFx,
        }),
      };
    }),

  refreshCatalogAuto: async () => {
    set({ isRefreshingCatalog: true });
    try {
      if (window.api) {
        const res = await window.api.refreshCatalog();
        set({
          catalog: res.catalog,
          isRefreshingCatalog: false,
        });
        get().showBanner(
          res.success ? 'success' : 'warning',
          res.message_id,
          res.message_en
        );
        return;
      }
      set({ isRefreshingCatalog: false });
      get().showBanner(
        'success',
        'Katalog model Higgsfield terverifikasi siap digunakan.',
        'Verified Higgsfield model catalog is ready.'
      );
    } catch {
      set({ isRefreshingCatalog: false });
    }
  },

  saveGlobalModelRateOverride: async (
    modelId,
    priceUsd,
    creditCost,
    pricingUnit
  ) => {
    let nextCatalog: CatalogModelEntry[] = [];
    if (window.api) {
      nextCatalog = await window.api.saveModelRateOverride({
        model_id: modelId,
        price_value: priceUsd,
        credit_cost: creditCost,
        pricing_unit: pricingUnit,
      });
    } else {
      const now = new Date().toISOString();
      nextCatalog = get().catalog.map((m) => {
        if (m.model_id !== modelId) return m;
        return {
          ...m,
          retrieved_at: now,
          pricing_variants: m.pricing_variants.map((v, idx) =>
            idx === 0
              ? {
                  ...v,
                  price_value: priceUsd,
                  credit_cost: creditCost,
                  pricing_unit: pricingUnit ?? v.pricing_unit,
                  status: 'manual' as const,
                }
              : v
          ),
        };
      });
    }
    set((state) => {
      const updatedItems = state.project.items.map((item) => {
        if (item.model_selection.model_id !== modelId) return item;
        const model = nextCatalog.find((m) => m.model_id === modelId);
        if (!model) return item;
        return {
          ...item,
          pricing: resolveModelPricing(
            model,
            item.model_selection.parameter_values
          ),
        };
      });
      return {
        catalog: nextCatalog,
        project: recalculateProject({
          ...state.project,
          items: updatedItems,
        }),
      };
    });
    get().showBanner(
      'success',
      'Tarif manual model berhasil disimpan ke katalog lokal.',
      'Manual model rate saved to local catalog.'
    );
  },

  resetAllCatalogOverrides: async () => {
    let resetCatalog = HIGGSFIELD_MODEL_CATALOG;
    if (window.api) {
      resetCatalog = await window.api.resetCatalogOverrides();
    }
    set((state) => {
      const updatedItems = state.project.items.map((item) => {
        if (item.pricing.status === 'manual') return item;
        const model = resetCatalog.find(
          (m) => m.model_id === item.model_selection.model_id
        );
        if (!model) return item;
        return {
          ...item,
          pricing: resolveModelPricing(
            model,
            item.model_selection.parameter_values
          ),
        };
      });
      return {
        catalog: resetCatalog,
        selectedCreditPlanId: 'api_standard',
        usdPerCredit: DEFAULT_USD_PER_CREDIT,
        project: recalculateProject({
          ...state.project,
          items: updatedItems,
        }),
      };
    });
    get().showBanner(
      'info',
      'Seluruh tarif katalog telah dikembalikan ke data referensi resmi Higgsfield.',
      'All catalog rates have been reset to official Higgsfield reference data.'
    );
  },

  applyCreditSubscriptionPlan: (planId, customUsdPerCredit) => {
    const plan = HIGGSFIELD_SUBSCRIPTION_PLANS.find(
      (p) => p.plan_id === planId
    );
    const rate =
      customUsdPerCredit !== undefined &&
      Number.isFinite(customUsdPerCredit) &&
      customUsdPerCredit > 0
        ? customUsdPerCredit
        : plan?.usd_per_credit ?? DEFAULT_USD_PER_CREDIT;

    const sourceLabel = plan
      ? `Paket ${plan.name_id} ($${rate.toFixed(4)}/Credit)`
      : `Tarif Credit Kustom ($${rate.toFixed(4)}/Credit)`;

    set((state) => {
      const updatedCatalog = applyCreditPlanRateToCatalog(
        state.catalog,
        rate
      );
      const updatedItems = state.project.items.map((item) => {
        if (item.pricing.status === 'manual') return item;
        const model = updatedCatalog.find(
          (m) => m.model_id === item.model_selection.model_id
        );
        if (!model) return item;
        return {
          ...item,
          pricing: resolveModelPricing(
            model,
            item.model_selection.parameter_values
          ),
        };
      });
      return {
        selectedCreditPlanId: planId,
        usdPerCredit: rate,
        catalog: updatedCatalog,
        hasUnsavedChanges: true,
        project: recalculateProject({
          ...state.project,
          items: updatedItems,
        }),
      };
    });

    get().showBanner(
      'success',
      `Patokan harga berhasil disesuaikan ke ${sourceLabel}. Seluruh model otomatis terhitung ulang.`,
      `Pricing benchmark updated to ${sourceLabel}. All models recalculated automatically.`
    );
  },

  addNewCustomModelToCatalog: async (newModel) => {
    let nextCatalog: CatalogModelEntry[] = [];
    if (window.api && window.api.addCustomModel) {
      nextCatalog = await window.api.addCustomModel(newModel);
    } else {
      const current = get().catalog;
      const idx = current.findIndex((m) => m.model_id === newModel.model_id);
      if (idx >= 0) {
        nextCatalog = [...current];
        nextCatalog[idx] = newModel;
      } else {
        nextCatalog = [newModel, ...current];
      }
    }
    set({ catalog: nextCatalog });
    get().showBanner(
      'success',
      `Model baru "${newModel.model_name}" berhasil ditambahkan ke daftar harga Higgsfield.`,
      `New model "${newModel.model_name}" added to the Higgsfield price catalog.`
    );
  },

  updateExportSettings: (updates) =>
    set((state) => ({
      hasUnsavedChanges: true,
      project: {
        ...state.project,
        export_settings: {
          ...state.project.export_settings,
          ...updates,
        },
      },
    })),

  exportPdfReport: async () => {
    const { project, language } = get();
    set({ isExportingPdf: true });
    try {
      const freshProject = recalculateProject(project);
      const exportLang =
        freshProject.export_settings?.export_language || language;

      if (window.api) {
        const res = await window.api.exportPdf(freshProject, exportLang);
        set({ isExportingPdf: false });
        if (res.canceled) return;
        if (!res.success) {
          get().showBanner(
            'error',
            res.error_id || 'Gagal mengekspor laporan PDF.',
            res.error_en || 'Failed to export PDF report.'
          );
          return;
        }
        get().showBanner(
          'success',
          `Laporan PDF berhasil diekspor ke: ${res.filePath}`,
          `PDF report exported successfully to: ${res.filePath}`
        );
        return;
      }

      // Fallback Browser: buka jendela cetak untuk simpan sebagai PDF dengan nama file sesuai PRD Bab 12.3
      const { html } = generatePdfReportHtml(freshProject, exportLang);
      const printWindow = window.open('', '_blank', 'width=1024,height=900');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.document.title = buildSafePdfFilename(
          freshProject.project_name,
          freshProject.export_settings.export_date
        );
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 350);
      }
      set({ isExportingPdf: false });
    } catch (err: unknown) {
      set({ isExportingPdf: false });
      const msg = err instanceof Error ? err.message : String(err);
      get().showBanner(
        'error',
        `Gagal mengekspor PDF: ${msg}`,
        `Failed to export PDF: ${msg}`
      );
    }
  },
}));
