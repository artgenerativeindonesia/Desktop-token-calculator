import { StateCreator } from 'zustand';
import {
  ProjectStoreState,
  UiSliceActions,
  UiSliceState,
} from '../storeTypes';

export const createUiSlice: StateCreator<
  ProjectStoreState,
  [],
  [],
  UiSliceState & UiSliceActions
> = (set) => ({
  activeTab: 'dashboard',
  language: 'id',
  theme: 'dark',
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
});
