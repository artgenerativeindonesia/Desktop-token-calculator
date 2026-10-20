"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
/**
 * Electron Preload Script (PRD Bab 14.2 Batas Keamanan):
 * Hanya mengekspos API terbatas melalui contextBridge tanpa memberi renderer akses langsung ke fs/node.
 */
electron_1.contextBridge.exposeInMainWorld('api', {
    saveProject: (project, currentFilePath, saveAs) => electron_1.ipcRenderer.invoke('project:save', project, currentFilePath, saveAs),
    openProject: (specificFilePath) => electron_1.ipcRenderer.invoke('project:open', specificFilePath),
    getRecentProjects: () => electron_1.ipcRenderer.invoke('project:get-recents'),
    refreshExchangeRate: () => electron_1.ipcRenderer.invoke('fx:refresh'),
    getCatalog: () => electron_1.ipcRenderer.invoke('catalog:get'),
    refreshCatalog: () => electron_1.ipcRenderer.invoke('catalog:refresh'),
    saveModelRateOverride: (override) => electron_1.ipcRenderer.invoke('catalog:save-override', override),
    resetCatalogOverrides: () => electron_1.ipcRenderer.invoke('catalog:reset-overrides'),
    exportPdf: (project, language) => electron_1.ipcRenderer.invoke('pdf:export', project, language),
});
