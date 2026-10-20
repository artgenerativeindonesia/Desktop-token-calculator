import fs from 'fs';
import path from 'path';
import { ProjectFile, RecentProjectEntry } from '../../shared/types/project';
import {
  ProjectValidationResult,
  validateProjectFileJson,
} from '../../shared/schema/projectSchema';
import { calculateProjectBudget } from '../../shared/engine/calculationEngine';

export interface SaveProjectResult {
  success: boolean;
  filePath?: string;
  error_id?: string;
  error_en?: string;
}

export interface LoadProjectResult {
  success: boolean;
  project?: ProjectFile;
  filePath?: string;
  errorCode?: ProjectValidationResult['errorCode'] | 'FILE_READ_ERROR';
  error_id?: string;
  error_en?: string;
}

/**
 * Menyimpan file proyek (.aivbudget) dengan mekanisme Atomic Write (PRD Bab 10.3 & 13.1):
 * Menulis ke file sementara (.tmp) terlebih dahulu, memvalidasi hasil tulis,
 * baru menggantikan file asli agar kegagalan simpan tidak merusak file proyek asli.
 */
export function saveProjectToFileAtomic(
  targetFilePath: string,
  project: ProjectFile
): SaveProjectResult {
  if (!project.project_name || !project.project_name.trim()) {
    return {
      success: false,
      error_id: 'Nama proyek tidak boleh kosong (FR-01).',
      error_en: 'Project name cannot be empty (FR-01).',
    };
  }

  // Pastikan perhitungan terbaru tersimpan konsisten (FR-10)
  const freshCalculation = calculateProjectBudget(
    project.items,
    project.assumptions,
    project.exchange_rate
  );

  const updatedProject: ProjectFile = {
    ...project,
    updated_at: new Date().toISOString(),
    calculation: freshCalculation,
  };

  const serialized = JSON.stringify(updatedProject, null, 2);
  const validation = validateProjectFileJson(serialized);
  if (!validation.valid) {
    return {
      success: false,
      error_id: validation.errorMessage_id ?? 'Data proyek gagal divalidasi sebelum disimpan.',
      error_en: validation.errorMessage_en ?? 'Project data failed validation before saving.',
    };
  }

  const finalPath = targetFilePath.endsWith('.aivbudget')
    ? targetFilePath
    : `${targetFilePath}.aivbudget`;
  const tempPath = `${finalPath}.${Date.now()}.tmp`;

  try {
    const dir = path.dirname(finalPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 1. Tulis ke file sementara (.tmp)
    fs.writeFileSync(tempPath, serialized, { encoding: 'utf-8', flag: 'w' });

    // 2. Verifikasi file sementara dapat dibaca & valid
    const verifyRead = fs.readFileSync(tempPath, 'utf-8');
    const verifyParsed = validateProjectFileJson(verifyRead);
    if (!verifyParsed.valid) {
      throw new Error('Verifikasi file sementara gagal.');
    }

    // 3. Gantikan file target secara atomik
    fs.renameSync(tempPath, finalPath);

    return {
      success: true,
      filePath: finalPath,
    };
  } catch (err: unknown) {
    // Bersihkan file sementara jika masih ada
    try {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    } catch {
      // ignore cleanup error
    }

    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error_id: `Gagal menyimpan file proyek (periksa ruang disk atau izin folder): ${msg}. File asli tetap aman.`,
      error_en: `Failed to save project file (check disk space or folder permissions): ${msg}. Original file remains safe.`,
    };
  }
}

/**
 * Membuka dan memvalidasi file proyek (.aivbudget) dari disk (PRD Bab 10.3 & 13.1)
 */
export function loadProjectFromFile(filePath: string): LoadProjectResult {
  try {
    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        errorCode: 'FILE_READ_ERROR',
        error_id: `File proyek tidak ditemukan di: ${filePath}`,
        error_en: `Project file not found at: ${filePath}`,
      };
    }

    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const validation = validateProjectFileJson(rawContent);

    if (!validation.valid || !validation.data) {
      return {
        success: false,
        errorCode: validation.errorCode,
        error_id: validation.errorMessage_id,
        error_en: validation.errorMessage_en,
      };
    }

    // Hitung ulang menggunakan Calculation Engine agar terjamin konsisten
    const project = validation.data;
    project.calculation = calculateProjectBudget(
      project.items,
      project.assumptions,
      project.exchange_rate
    );

    return {
      success: true,
      project,
      filePath,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      errorCode: 'FILE_READ_ERROR',
      error_id: `Gagal membaca file proyek: ${msg}`,
      error_en: `Failed to read project file: ${msg}`,
    };
  }
}

/**
 * Mengelola daftar proyek terakhir dibuka (Recent Projects)
 */
export function updateRecentProjectsList(
  recentListPath: string,
  project: ProjectFile,
  filePath: string
): RecentProjectEntry[] {
  const existing = loadRecentProjectsList(recentListPath);
  const entry: RecentProjectEntry = {
    project_id: project.project_id,
    project_name: project.project_name,
    file_path: filePath,
    updated_at: project.updated_at,
    total_cost_usd: project.calculation.total_cost_usd,
    total_cost_idr: project.calculation.total_cost_idr,
    is_complete: project.calculation.is_complete,
  };

  const filtered = existing.filter((item) => item.file_path !== filePath);
  const updated = [entry, ...filtered].slice(0, 10);

  try {
    const dir = path.dirname(recentListPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(recentListPath, JSON.stringify(updated, null, 2), 'utf-8');
  } catch {
    // ignore non-critical recent list error
  }

  return updated;
}

export function loadRecentProjectsList(recentListPath: string): RecentProjectEntry[] {
  try {
    if (!fs.existsSync(recentListPath)) return [];
    const content = fs.readFileSync(recentListPath, 'utf-8');
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) => item && typeof item.file_path === 'string' && fs.existsSync(item.file_path)
    );
  } catch {
    return [];
  }
}
