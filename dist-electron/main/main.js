"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const projectStorage_1 = require("./storage/projectStorage");
const fxConnector_1 = require("./connectors/fxConnector");
const pricingConnector_1 = require("./connectors/pricingConnector");
const pdfExporter_1 = require("./pdf/pdfExporter");
const pdfReportBuilder_1 = require("../shared/pdf/pdfReportBuilder");
let mainWindow = null;
function getUserDataFilePath(fileName) {
    return path_1.default.join(electron_1.app.getPath('userData'), fileName);
}
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1360,
        height: 880,
        minWidth: 1024,
        minHeight: 700,
        title: 'AI Video Budget Calculator — Higgsfield Catalog',
        backgroundColor: '#080b14',
        autoHideMenuBar: true,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
        },
    });
    const devServerUrl = process.env.VITE_DEV_SERVER_URL;
    if (devServerUrl) {
        mainWindow.loadURL(devServerUrl);
    }
    else {
        const indexHtmlPath = path_1.default.join(__dirname, '../../dist/index.html');
        mainWindow.loadFile(indexHtmlPath);
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
/**
 * Memvalidasi bahwa pemanggilan IPC benar-benar berasal dari jendela aplikasi resmi (mainWindow)
 * guna mencegah eksploitasi Remote Code Execution (RCE) sesuai standar keamanan industri Electron.
 */
function validateIpcSender(event) {
    if (!event.senderFrame) {
        return false;
    }
    if (mainWindow && !mainWindow.isDestroyed()) {
        if (event.sender !== mainWindow.webContents) {
            return false;
        }
    }
    return true;
}
function registerIpcHandlers() {
    const recentListPath = getUserDataFilePath('recent-projects.json');
    const fxCachePath = getUserDataFilePath('fx-usd-idr-cache.json');
    const catalogOverridesPath = getUserDataFilePath('catalog-overrides.json');
    // 1. Simpan Proyek (.aivbudget) dengan Atomic Write
    electron_1.ipcMain.handle('project:save', async (event, project, currentFilePath, saveAs) => {
        if (!validateIpcSender(event)) {
            throw new Error('Akses IPC ditolak: Pengirim pesan tidak sah.');
        }
        let targetPath = !saveAs && currentFilePath ? currentFilePath : null;
        if (!targetPath) {
            const cleanDefaultName = (project.project_name || 'Project')
                .trim()
                .replace(/[<>:"/\\|?*]/g, '_');
            const saveDialog = await electron_1.dialog.showSaveDialog(mainWindow, {
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
        const saveRes = (0, projectStorage_1.saveProjectToFileAtomic)(targetPath, project);
        if (!saveRes.success || !saveRes.filePath) {
            return saveRes;
        }
        const recentProjects = (0, projectStorage_1.updateRecentProjectsList)(recentListPath, project, saveRes.filePath);
        return {
            ...saveRes,
            recentProjects,
        };
    });
    // 2. Buka Proyek (.aivbudget)
    electron_1.ipcMain.handle('project:open', async (event, specificFilePath) => {
        if (!validateIpcSender(event)) {
            throw new Error('Akses IPC ditolak: Pengirim pesan tidak sah.');
        }
        let targetPath = specificFilePath;
        if (!targetPath) {
            const openDialog = await electron_1.dialog.showOpenDialog(mainWindow, {
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
        const loadRes = (0, projectStorage_1.loadProjectFromFile)(targetPath);
        if (!loadRes.success || !loadRes.project || !loadRes.filePath) {
            return loadRes;
        }
        const recentProjects = (0, projectStorage_1.updateRecentProjectsList)(recentListPath, loadRes.project, loadRes.filePath);
        return {
            ...loadRes,
            recentProjects,
        };
    });
    // 3. Daftar Proyek Terakhir
    electron_1.ipcMain.handle('project:get-recents', async (event) => {
        if (!validateIpcSender(event)) {
            throw new Error('Akses IPC ditolak: Pengirim pesan tidak sah.');
        }
        return (0, projectStorage_1.loadRecentProjectsList)(recentListPath);
    });
    // 4. Kurs USD/IDR Otomatis (Frankfurter ECB / Open ER-API)
    electron_1.ipcMain.handle('fx:refresh', async (event) => {
        if (!validateIpcSender(event)) {
            throw new Error('Akses IPC ditolak: Pengirim pesan tidak sah.');
        }
        return (0, fxConnector_1.fetchVerifiedUsdIdrRate)(fxCachePath);
    });
    // 5. Katalog Model Higgsfield
    electron_1.ipcMain.handle('catalog:get', async (event) => {
        if (!validateIpcSender(event)) {
            throw new Error('Akses IPC ditolak: Pengirim pesan tidak sah.');
        }
        return (0, pricingConnector_1.loadMergedCatalog)(catalogOverridesPath);
    });
    electron_1.ipcMain.handle('catalog:refresh', async (event) => {
        if (!validateIpcSender(event)) {
            throw new Error('Akses IPC ditolak: Pengirim pesan tidak sah.');
        }
        return (0, pricingConnector_1.refreshHiggsfieldCatalog)(catalogOverridesPath);
    });
    electron_1.ipcMain.handle('catalog:save-override', async (event, override) => {
        if (!validateIpcSender(event)) {
            throw new Error('Akses IPC ditolak: Pengirim pesan tidak sah.');
        }
        (0, pricingConnector_1.saveCustomRateOverride)(catalogOverridesPath, {
            ...override,
            updated_at: new Date().toISOString(),
        });
        return (0, pricingConnector_1.loadMergedCatalog)(catalogOverridesPath);
    });
    electron_1.ipcMain.handle('catalog:reset-overrides', async (event) => {
        if (!validateIpcSender(event)) {
            throw new Error('Akses IPC ditolak: Pengirim pesan tidak sah.');
        }
        (0, pricingConnector_1.clearCustomRateOverrides)(catalogOverridesPath);
        return (0, pricingConnector_1.loadMergedCatalog)(catalogOverridesPath);
    });
    electron_1.ipcMain.handle('catalog:add-custom-model', async (event, newModel) => {
        if (!validateIpcSender(event)) {
            throw new Error('Akses IPC ditolak: Pengirim pesan tidak sah.');
        }
        return (0, pricingConnector_1.saveCustomUserModel)(catalogOverridesPath, newModel);
    });
    // 6. Ekspor Laporan PDF
    electron_1.ipcMain.handle('pdf:export', async (event, project, language) => {
        if (!validateIpcSender(event)) {
            throw new Error('Akses IPC ditolak: Pengirim pesan tidak sah.');
        }
        const defaultFileName = (0, pdfReportBuilder_1.buildSafePdfFilename)(project.project_name, project.export_settings?.export_date);
        const saveDialog = await electron_1.dialog.showSaveDialog(mainWindow, {
            title: language === 'id'
                ? 'Ekspor Laporan Anggaran PDF'
                : 'Export Budget Report PDF',
            defaultPath: defaultFileName,
            filters: [{ name: 'PDF Document (.pdf)', extensions: ['pdf'] }],
        });
        if (saveDialog.canceled || !saveDialog.filePath) {
            return { success: false, canceled: true, defaultFileName };
        }
        return (0, pdfExporter_1.exportProjectToPdfFile)(saveDialog.filePath, project, language);
    });
}
electron_1.app.whenReady().then(() => {
    registerIpcHandlers();
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
