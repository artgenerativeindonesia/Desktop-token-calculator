import { create } from 'zustand';
import {
  ActiveNavTab,
  NotificationBanner,
  ProjectStoreState,
} from './storeTypes';
import { createUiSlice } from './slices/uiSlice';
import { createExchangeRateSlice } from './slices/exchangeRateSlice';
import { createCatalogSlice } from './slices/catalogSlice';
import { createProjectSlice } from './slices/projectSlice';
import { recalculateProject, DEFAULT_COMBINED_CATALOG } from './storeHelpers';

// Re-export types & helpers for full backward compatibility
export type { ActiveNavTab, NotificationBanner, ProjectStoreState };
export { recalculateProject, DEFAULT_COMBINED_CATALOG };

export const useProjectStore = create<ProjectStoreState>()((...a) => ({
  ...createUiSlice(...a),
  ...createExchangeRateSlice(...a),
  ...createCatalogSlice(...a),
  ...createProjectSlice(...a),
}));
