import { contextBridge, ipcRenderer } from 'electron';
import {
  AppLanguage,
  CatalogModelEntry,
  Pricing,
  ProjectFile,
} from '../shared/types/project';

/**
 * Electron Preload Script (PRD Bab 14.2 Batas Keamanan):
 * Hanya mengekspos API terbatas melalui contextBridge tanpa memberi renderer akses langsung ke fs/node.
 */
contextBridge.exposeInMainWorld('api', {
  saveProject: (
    project: ProjectFile,
    currentFilePath?: string | null,
    saveAs?: boolean
  ) => ipcRenderer.invoke('project:save', project, currentFilePath, saveAs),

  openProject: (specificFilePath?: string) =>
    ipcRenderer.invoke('project:open', specificFilePath),

  getRecentProjects: () => ipcRenderer.invoke('project:get-recents'),

  refreshExchangeRate: () => ipcRenderer.invoke('fx:refresh'),

  getCatalog: () => ipcRenderer.invoke('catalog:get'),

  refreshCatalog: () => ipcRenderer.invoke('catalog:refresh'),

  saveModelRateOverride: (override: {
    model_id: string;
    price_value: number;
    credit_cost: number | null;
    pricing_unit?: Pricing['pricing_unit'];
  }) => ipcRenderer.invoke('catalog:save-override', override),

  addCustomModel: (newModel: CatalogModelEntry) =>
    ipcRenderer.invoke('catalog:add-custom-model', newModel),

  resetCatalogOverrides: () => ipcRenderer.invoke('catalog:reset-overrides'),

  exportPdf: (project: ProjectFile, language: AppLanguage) =>
    ipcRenderer.invoke('pdf:export', project, language),
});
