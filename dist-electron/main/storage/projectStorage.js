"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveProjectToFileAtomic = saveProjectToFileAtomic;
exports.loadProjectFromFile = loadProjectFromFile;
exports.updateRecentProjectsList = updateRecentProjectsList;
exports.loadRecentProjectsList = loadRecentProjectsList;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const projectSchema_1 = require("../../shared/schema/projectSchema");
const calculationEngine_1 = require("../../shared/engine/calculationEngine");
/**
 * Menyimpan file proyek (.aivbudget) dengan mekanisme Atomic Write (PRD Bab 10.3 & 13.1):
 * Menulis ke file sementara (.tmp) terlebih dahulu, memvalidasi hasil tulis,
 * baru menggantikan file asli agar kegagalan simpan tidak merusak file proyek asli.
 */
function saveProjectToFileAtomic(targetFilePath, project) {
    if (!project.project_name || !project.project_name.trim()) {
        return {
            success: false,
            error_id: 'Nama proyek tidak boleh kosong (FR-01).',
            error_en: 'Project name cannot be empty (FR-01).',
        };
    }
    // Pastikan perhitungan terbaru tersimpan konsisten (FR-10)
    const freshCalculation = (0, calculationEngine_1.calculateProjectBudget)(project.items, project.assumptions, project.exchange_rate);
    const updatedProject = {
        ...project,
        updated_at: new Date().toISOString(),
        calculation: freshCalculation,
    };
    const serialized = JSON.stringify(updatedProject, null, 2);
    const validation = (0, projectSchema_1.validateProjectFileJson)(serialized);
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
        const dir = path_1.default.dirname(finalPath);
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        // 1. Tulis ke file sementara (.tmp)
        fs_1.default.writeFileSync(tempPath, serialized, { encoding: 'utf-8', flag: 'w' });
        // 2. Verifikasi file sementara dapat dibaca & valid
        const verifyRead = fs_1.default.readFileSync(tempPath, 'utf-8');
        const verifyParsed = (0, projectSchema_1.validateProjectFileJson)(verifyRead);
        if (!verifyParsed.valid) {
            throw new Error('Verifikasi file sementara gagal.');
        }
        // 3. Gantikan file target secara atomik
        fs_1.default.renameSync(tempPath, finalPath);
        return {
            success: true,
            filePath: finalPath,
        };
    }
    catch (err) {
        // Bersihkan file sementara jika masih ada
        try {
            if (fs_1.default.existsSync(tempPath)) {
                fs_1.default.unlinkSync(tempPath);
            }
        }
        catch {
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
function loadProjectFromFile(filePath) {
    try {
        if (!fs_1.default.existsSync(filePath)) {
            return {
                success: false,
                errorCode: 'FILE_READ_ERROR',
                error_id: `File proyek tidak ditemukan di: ${filePath}`,
                error_en: `Project file not found at: ${filePath}`,
            };
        }
        const rawContent = fs_1.default.readFileSync(filePath, 'utf-8');
        const validation = (0, projectSchema_1.validateProjectFileJson)(rawContent);
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
        project.calculation = (0, calculationEngine_1.calculateProjectBudget)(project.items, project.assumptions, project.exchange_rate);
        return {
            success: true,
            project,
            filePath,
        };
    }
    catch (err) {
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
function updateRecentProjectsList(recentListPath, project, filePath) {
    const existing = loadRecentProjectsList(recentListPath);
    const entry = {
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
        const dir = path_1.default.dirname(recentListPath);
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        fs_1.default.writeFileSync(recentListPath, JSON.stringify(updated, null, 2), 'utf-8');
    }
    catch {
        // ignore non-critical recent list error
    }
    return updated;
}
function loadRecentProjectsList(recentListPath) {
    try {
        if (!fs_1.default.existsSync(recentListPath))
            return [];
        const content = fs_1.default.readFileSync(recentListPath, 'utf-8');
        const parsed = JSON.parse(content);
        if (!Array.isArray(parsed))
            return [];
        return parsed.filter((item) => item && typeof item.file_path === 'string' && fs_1.default.existsSync(item.file_path));
    }
    catch {
        return [];
    }
}
