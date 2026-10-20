import fs from 'fs';
import path from 'path';
import { BrowserWindow } from 'electron';
import { AppLanguage, ProjectFile } from '../../shared/types/project';
import {
  buildSafePdfFilename,
  generatePdfReportHtml,
} from '../../shared/pdf/pdfReportBuilder';

export interface ExportPdfResult {
  success: boolean;
  filePath?: string;
  defaultFileName: string;
  isComplete: boolean;
  error_id?: string;
  error_en?: string;
}

/**
 * Mengekspor laporan proyek ke file PDF menggunakan Electron BrowserWindow.webContents.printToPDF
 * sesuai PRD Bab 12.1 s/d 12.4 & Bab 13.1.
 */
export async function exportProjectToPdfFile(
  targetFilePath: string,
  project: ProjectFile,
  language?: AppLanguage
): Promise<ExportPdfResult> {
  const defaultFileName = buildSafePdfFilename(
    project.project_name,
    project.export_settings?.export_date
  );

  let printWin: BrowserWindow | null = null;
  try {
    const { html, calculation } = generatePdfReportHtml(project, language);

    printWin = new BrowserWindow({
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

    const dir = path.dirname(targetFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(targetFilePath, pdfBuffer);

    return {
      success: true,
      filePath: targetFilePath,
      defaultFileName,
      isComplete: calculation.is_complete,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      defaultFileName,
      isComplete: false,
      error_id: `Ekspor PDF gagal dibuat: ${msg}. Silakan periksa izin penyimpanan atau tutup file PDF jika sedang dibuka di aplikasi lain.`,
      error_en: `Failed to generate PDF report: ${msg}. Please check folder permissions or close the PDF file if it is open in another program.`,
    };
  } finally {
    if (printWin && !printWin.isDestroyed()) {
      printWin.close();
    }
  }
}
