import { StateCreator } from 'zustand';
import { CatalogModelEntry } from '../../../shared/types/project';
import {
  DEFAULT_USD_PER_CREDIT,
  HIGGSFIELD_SUBSCRIPTION_PLANS,
  applyCreditPlanRateToCatalog,
  resolveModelPricing,
} from '../../../shared/catalog/higgsfieldCatalog';
import { applyElevenLabsPlanRateToCatalog } from '../../../shared/catalog/elevenlabsCatalog';
import { applySunoPlanRateToCatalog } from '../../../shared/catalog/sunoCatalog';
import {
  DEFAULT_COMBINED_CATALOG,
  recalculateProject,
} from '../storeHelpers';
import {
  CatalogSliceActions,
  CatalogSliceState,
  ProjectStoreState,
} from '../storeTypes';

export const createCatalogSlice: StateCreator<
  ProjectStoreState,
  [],
  [],
  CatalogSliceState & CatalogSliceActions
> = (set, get) => ({
  catalog: DEFAULT_COMBINED_CATALOG,
  selectedCreditPlanId: 'api_standard',
  usdPerCredit: DEFAULT_USD_PER_CREDIT,
  selectedElevenLabsPlanId: 'starter',
  setSelectedElevenLabsPlanId: (planId) =>
    set((state) => {
      const updatedCatalog = applyElevenLabsPlanRateToCatalog(
        state.catalog,
        planId
      );
      return {
        selectedElevenLabsPlanId: planId,
        catalog: updatedCatalog,
        hasUnsavedChanges: true,
        project: recalculateProject({
          ...state.project,
          assumptions: {
            ...state.project.assumptions,
            elevenlabs_plan_id: planId,
          },
        }),
      };
    }),
  selectedSunoPlanId: 'pro',
  setSelectedSunoPlanId: (planId) =>
    set((state) => {
      const updatedCatalog = applySunoPlanRateToCatalog(
        state.catalog,
        planId
      );
      return {
        selectedSunoPlanId: planId,
        catalog: updatedCatalog,
        hasUnsavedChanges: true,
        project: recalculateProject({
          ...state.project,
          assumptions: {
            ...state.project.assumptions,
            suno_plan_id: planId,
          },
        }),
      };
    }),
  isRefreshingCatalog: false,

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
    let resetCatalog = DEFAULT_COMBINED_CATALOG;
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
        selectedElevenLabsPlanId: 'starter',
        selectedSunoPlanId: 'pro',
        project: recalculateProject({
          ...state.project,
          assumptions: {
            ...state.project.assumptions,
            elevenlabs_plan_id: 'starter',
            suno_plan_id: 'pro',
          },
          items: updatedItems,
        }),
      };
    });
    get().showBanner(
      'info',
      'Seluruh tarif katalog telah dikembalikan ke data referensi resmi Higgsfield, ElevenLabs, & Suno.',
      'All catalog rates have been reset to official Higgsfield, ElevenLabs, & Suno reference data.'
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
        if (
          item.pricing.status === 'manual' ||
          item.category === 'voice_over' ||
          item.category === 'music'
        ) {
          return item;
        }
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
});
