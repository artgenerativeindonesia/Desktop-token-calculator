"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportProjectToPdfFile = exportProjectToPdfFile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const pdfReportBuilder_1 = require("../../shared/pdf/pdfReportBuilder");
/**
 * Mengekspor laporan proyek ke file PDF menggunakan Electron BrowserWindow.webContents.printToPDF
 * sesuai PRD Bab 12.1 s/d 12.4 & Bab 13.1.
 */
async function exportProjectToPdfFile(targetFilePath, project, language) {
    const defaultFileName = (0, pdfReportBuilder_1.buildSafePdfFilename)(project.project_name, project.export_settings?.export_date);
    let printWin = null;
    try {
        const { html, calculation } = (0, pdfReportBuilder_1.generatePdfReportHtml)(project, language);
        printWin = new electron_1.BrowserWindow({
            show: false,
            width: 1024,
            height: 1448,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
            },
        });
        const dataUri = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
        await printWin.loadURL(dataUri);
        const pdfBuffer = await printWin.webContents.printToPDF({
            printBackground: true,
            pageSize: 'A4',
            margins: {
                top: 0.4,
                bottom: 0.4,
                left: 0.4,
                right: 0.4,
            },
        });
        const dir = path_1.default.dirname(targetFilePath);
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        fs_1.default.writeFileSync(targetFilePath, pdfBuffer);
        return {
            success: true,
            filePath: targetFilePath,
            defaultFileName,
            isComplete: calculation.is_complete,
        };
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return {
            success: false,
            defaultFileName,
            isComplete: false,
            error_id: `Ekspor PDF gagal dibuat: ${msg}. Silakan periksa izin penyimpanan atau tutup file PDF jika sedang dibuka di aplikasi lain.`,
            error_en: `Failed to generate PDF report: ${msg}. Please check folder permissions or close the PDF file if it is open in another program.`,
        };
    }
    finally {
        if (printWin && !printWin.isDestroyed()) {
            printWin.close();
        }
    }
}
