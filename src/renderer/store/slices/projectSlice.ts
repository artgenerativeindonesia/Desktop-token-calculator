import { StateCreator } from 'zustand';
import {
  CURRENT_SCHEMA_VERSION,
  ExportSettings,
  ProcessCategory,
  ProductionItem,
  ProjectFile,
} from '../../../shared/types/project';
import { createProductionItemFromCatalog } from '../../../shared/engine/calculationEngine';
import {
  createPrdSyntheticTestProject,
  createSampleCommercialProject,
} from '../../../shared/examples/sampleProjects';
import {
  getDefaultParametersForModel,
  getModelsByCategory,
  resolveModelPricing,
} from '../../../shared/catalog/higgsfieldCatalog';
import { convertDurationToCharacters } from '../../../shared/catalog/elevenlabsCatalog';
import { validateProjectFileJson } from '../../../shared/schema/projectSchema';
import {
  buildSafePdfFilename,
  generatePdfReportHtml,
} from '../../../shared/pdf/pdfReportBuilder';
import { recalculateProject } from '../storeHelpers';
import {
  ProjectSliceActions,
  ProjectSliceState,
  ProjectStoreState,
} from '../storeTypes';

export const createProjectSlice: StateCreator<
  ProjectStoreState,
  [],
  [],
  ProjectSliceState & ProjectSliceActions
> = (set, get) => ({
  project: recalculateProject(createSampleCommercialProject()),
  currentFilePath: null,
  hasUnsavedChanges: false,
  recentProjects: [],
  isExportingPdf: false,

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
      language === 'id' ? 'Shot 01 - Shot Pembuka' : 'Shot 01 - Opening Shot',
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
          target_videos: Math.max(1, Math.floor(count || 1)),
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

  setFinalDurationSeconds: (seconds) =>
    set((state) => {
      const cleanSec = Math.max(0, Number(seconds) || 0);
      return {
        hasUnsavedChanges: true,
        project: recalculateProject({
          ...state.project,
          assumptions: {
            ...state.project.assumptions,
            final_duration_minutes: cleanSec / 60,
          },
        }),
      };
    }),

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

      if (category === 'voice_over') {
        const voModel =
          models[0] ||
          state.catalog.find((m) =>
            m.supported_categories.includes('voice_over')
          ) ||
          state.catalog[0];
        const defaultParams = getDefaultParametersForModel(voModel);
        const pricing = resolveModelPricing(voModel, defaultParams);
        const voDuration = 10;
        const voChars = Math.round(voDuration * 14.5);

        const newItem: ProductionItem = {
          item_id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          category: 'voice_over',
          label:
            state.language === 'id'
              ? `File Audio ${String(nextIndex).padStart(2, '0')} (${voModel.model_name})`
              : `Audio File ${String(nextIndex).padStart(2, '0')} (${voModel.model_name})`,
          quantity: 1,
          quantity_type: 'asset',
          duration_seconds: voDuration,
          attempts_per_item:
            state.project.assumptions.default_attempts_per_shot || 1,
          use_project_target_multiplier: false,
          is_primary_shot: false,
          is_unlimited: false,
          script_text: '',
          script_language: 'id',
          character_count: voChars,
          model_selection: {
            provider: voModel.provider,
            model_id: voModel.model_id,
            model_name: voModel.model_name,
            category: 'voice_over',
            parameter_values: defaultParams,
          },
          pricing,
          notes:
            state.language === 'id'
              ? 'File audio narasi / dialog resmi ElevenLabs.'
              : 'Official ElevenLabs voice over audio file.',
        };

        return {
          hasUnsavedChanges: true,
          project: recalculateProject({
            ...state.project,
            items: [...state.project.items, newItem],
          }),
        };
      }

      if (category === 'music') {
        const musicModel =
          models[0] ||
          state.catalog.find((m) =>
            m.supported_categories.includes('music')
          ) ||
          state.catalog[0];
        const defaultParams = getDefaultParametersForModel(musicModel);
        const pricing = resolveModelPricing(musicModel, defaultParams);
        const cleanVideoDuration =
          state.project.calculation.one_video_duration_seconds > 0
            ? Math.round(state.project.calculation.one_video_duration_seconds)
            : 120;
        const musicDuration = cleanVideoDuration > 0 ? cleanVideoDuration : 120;

        const newItem: ProductionItem = {
          item_id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          category: 'music',
          label:
            state.language === 'id'
              ? `Track Musik ${String(nextIndex).padStart(2, '0')} (${musicModel.model_name})`
              : `Music Track ${String(nextIndex).padStart(2, '0')} (${musicModel.model_name})`,
          quantity: 1,
          quantity_type: 'asset',
          duration_seconds: musicDuration,
          attempts_per_item:
            state.project.assumptions.default_attempts_per_shot || 1,
          use_project_target_multiplier: false,
          is_primary_shot: false,
          is_unlimited: false,
          is_instrumental: true,
          music_role: 'bgm_scene',
          music_genre: 'Sinematik Megah',
          music_prompt: '',
          extend_count: 0,
          stem_separation_mode: 'none',
          model_selection: {
            provider: musicModel.provider,
            model_id: musicModel.model_id,
            model_name: musicModel.model_name,
            category: 'music',
            parameter_values: defaultParams,
          },
          pricing,
          notes:
            state.language === 'id'
              ? 'Track musik pengiring resmi Suno AI.'
              : 'Official Suno AI background music track.',
        };

        return {
          hasUnsavedChanges: true,
          project: recalculateProject({
            ...state.project,
            items: [...state.project.items, newItem],
          }),
        };
      }

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

  toggleItemPrimaryShot: (itemId) =>
    set((state) => {
      const items = state.project.items.map((item) => {
        if (item.item_id !== itemId) return item;
        const currentVal =
          typeof item.is_primary_shot === 'boolean'
            ? item.is_primary_shot
            : (item.category === 'text_to_video' || item.category === 'image_to_video');
        return {
          ...item,
          is_primary_shot: !currentVal,
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

  changeItemCategory: (itemId, category) =>
    set((state) => {
      const models = getModelsByCategory(category, state.catalog);
      const model = models[0] || state.catalog[0];
      const defaultParams = getDefaultParametersForModel(model);
      const pricing = resolveModelPricing(model, defaultParams);
      const isPrimary = category === 'text_to_video' || category === 'image_to_video';

      const items: ProductionItem[] = state.project.items.map((item): ProductionItem => {
        if (item.item_id !== itemId) return item;

        if (category === 'voice_over') {
          const voDur = item.duration_seconds > 0 ? item.duration_seconds : 10;
          return {
            ...item,
            category: 'voice_over',
            is_primary_shot: false,
            quantity_type: 'asset',
            duration_seconds: voDur,
            script_language: item.script_language || 'id',
            character_count:
              item.character_count && item.character_count > 0
                ? item.character_count
                : Math.round(voDur * 14.5),
            script_text: '',
            model_selection: {
              provider: model.provider,
              model_id: model.model_id,
              model_name: model.model_name,
              category: 'voice_over',
              parameter_values: defaultParams,
            },
            pricing,
          };
        }

        if (category === 'music') {
          return {
            ...item,
            category: 'music',
            is_primary_shot: false,
            quantity_type: 'asset',
            duration_seconds: 120,
            stem_enabled: item.stem_enabled ?? false,
            stem_type: item.stem_type ?? 'two_stems',
            stem_separation_mode: item.stem_separation_mode ?? 'none',
            stem_runs: 1,
            stem_reserve: 0,
            music_reserve_override: undefined,
            model_selection: {
              provider: model.provider,
              model_id: model.model_id,
              model_name: model.model_name,
              category: 'music',
              parameter_values: defaultParams,
            },
            pricing,
          };
        }

        return {
          ...item,
          category,
          is_primary_shot: isPrimary,
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

        const nextPricing =
          model && item.pricing.status !== 'manual'
            ? resolveModelPricing(model, updatedParams)
            : item.pricing;

        const nextCharCount =
          item.category === 'voice_over' &&
          paramKey === 'speed_preset' &&
          !(item.script_text && item.script_text.trim().length > 0) &&
          item.duration_seconds > 0
            ? convertDurationToCharacters(
                item.duration_seconds,
                item.script_language ?? 'id',
                String(paramValue)
              )
            : item.character_count;

        return {
          ...item,
          character_count: nextCharCount,
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
});
