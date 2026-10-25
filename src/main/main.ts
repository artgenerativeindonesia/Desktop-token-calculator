import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';
import {
  AppLanguage,
  CatalogModelEntry,
  Pricing,
  ProjectFile,
} from '../shared/types/project';
import {
  loadProjectFromFile,
  loadRecentProjectsList,
  saveProjectToFileAtomic,
  updateRecentProjectsList,
} from './storage/projectStorage';
import { fetchVerifiedUsdIdrRate } from './connectors/fxConnector';
import {
  clearCustomRateOverrides,
  loadMergedCatalog,
  refreshHiggsfieldCatalog,
  saveCustomRateOverride,
  saveCustomUserModel,
} from './connectors/pricingConnector';
import { exportProjectToPdfFile } from './pdf/pdfExporter';
import { buildSafePdfFilename } from '../shared/pdf/pdfReportBuilder';

let mainWindow: BrowserWindow | null = null;

function getUserDataFilePath(fileName: string): string {
  return path.join(app.getPath('userData'), fileName);
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 880,
    minWidth: 1024,
    minHeight: 700,
    title: 'AI Video Budget Calculator — Higgsfield Catalog',
    backgroundColor: '#080b14',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    const indexHtmlPath = path.join(__dirname, '../../dist/index.html');
    mainWindow.loadFile(indexHtmlPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function registerIpcHandlers(): void {
  const recentListPath = getUserDataFilePath('recent-projects.json');
  const fxCachePath = getUserDataFilePath('fx-usd-idr-cache.json');
  const catalogOverridesPath = getUserDataFilePath('catalog-overrides.json');

  // 1. Simpan Proyek (.aivbudget) dengan Atomic Write
  ipcMain.handle(
    'project:save',
    async (
      _event,
      project: ProjectFile,
      currentFilePath?: string | null,
      saveAs?: boolean
    ) => {
      let targetPath = !saveAs && currentFilePath ? currentFilePath : null;

      if (!targetPath) {
        const cleanDefaultName = (project.project_name || 'Project')
          .trim()
          .replace(/[<>:"/\\|?*]/g, '_');

        const saveDialog = await dialog.showSaveDialog(mainWindow!, {
          title: 'Simpan Proyek AI Video Budget (.aivbudget)',
          defaultPath: `${cleanDefaultName}.aivbudget`,
          filters: [
            {
              name: 'AI Video Budget Project (.aivbudget)',
              extensions: ['aivbudget'],
            },
          ],
        });

        if (saveDialog.canceled || !saveDialog.filePath) {
          return { success: false, canceled: true };
        }
        targetPath = saveDialog.filePath;
      }

      const saveRes = saveProjectToFileAtomic(targetPath, project);
      if (!saveRes.success || !saveRes.filePath) {
        return saveRes;
      }

      const recentProjects = updateRecentProjectsList(
        recentListPath,
        project,
        saveRes.filePath
      );

      return {
        ...saveRes,
        recentProjects,
      };
    }
  );

  // 2. Buka Proyek (.aivbudget)
  ipcMain.handle('project:open', async (_event, specificFilePath?: string) => {
    let targetPath = specificFilePath;

    if (!targetPath) {
      const openDialog = await dialog.showOpenDialog(mainWindow!, {
        title: 'Buka Proyek AI Video Budget (.aivbudget)',
        properties: ['openFile'],
        filters: [
          {
            name: 'AI Video Budget Project (.aivbudget)',
            extensions: ['aivbudget', 'json'],
          },
        ],
      });

      if (openDialog.canceled || openDialog.filePaths.length === 0) {
        return { success: false, canceled: true };
      }
      targetPath = openDialog.filePaths[0];
    }

    const loadRes = loadProjectFromFile(targetPath);
    if (!loadRes.success || !loadRes.project || !loadRes.filePath) {
      return loadRes;
    }

    const recentProjects = updateRecentProjectsList(
      recentListPath,
      loadRes.project,
      loadRes.filePath
    );

    return {
      ...loadRes,
      recentProjects,
    };
  });

  // 3. Daftar Proyek Terakhir
  ipcMain.handle('project:get-recents', async () => {
    return loadRecentProjectsList(recentListPath);
  });

  // 4. Kurs USD/IDR Otomatis (Frankfurter ECB / Open ER-API)
  ipcMain.handle('fx:refresh', async () => {
    return fetchVerifiedUsdIdrRate(fxCachePath);
  });

  // 5. Katalog Model Higgsfield
  ipcMain.handle('catalog:get', async () => {
    return loadMergedCatalog(catalogOverridesPath);
  });

  ipcMain.handle('catalog:refresh', async () => {
    return refreshHiggsfieldCatalog(catalogOverridesPath);
  });

  ipcMain.handle(
    'catalog:save-override',
    async (
      _event,
      override: {
        model_id: string;
        price_value: number;
        credit_cost: number | null;
        pricing_unit?: Pricing['pricing_unit'];
      }
    ) => {
      saveCustomRateOverride(catalogOverridesPath, {
        ...override,
        updated_at: new Date().toISOString(),
      });
      return loadMergedCatalog(catalogOverridesPath);
    }
  );

  ipcMain.handle('catalog:reset-overrides', async () => {
    clearCustomRateOverrides(catalogOverridesPath);
    return loadMergedCatalog(catalogOverridesPath);
  });

  ipcMain.handle(
    'catalog:add-custom-model',
    async (_event, newModel: CatalogModelEntry) => {
      return saveCustomUserModel(catalogOverridesPath, newModel);
    }
  );

  // 6. Ekspor Laporan PDF
  ipcMain.handle(
    'pdf:export',
    async (_event, project: ProjectFile, language: AppLanguage) => {
      const defaultFileName = buildSafePdfFilename(
        project.project_name,
        project.export_settings?.export_date
      );

      const saveDialog = await dialog.showSaveDialog(mainWindow!, {
        title:
          language === 'id'
            ? 'Ekspor Laporan Anggaran PDF'
            : 'Export Budget Report PDF',
        defaultPath: defaultFileName,
        filters: [{ name: 'PDF Document (.pdf)', extensions: ['pdf'] }],
      });

      if (saveDialog.canceled || !saveDialog.filePath) {
        return { success: false, canceled: true, defaultFileName };
      }

      return exportProjectToPdfFile(saveDialog.filePath, project, language);
    }
  );
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
