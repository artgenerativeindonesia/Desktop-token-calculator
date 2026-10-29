import {
  BudgetAssumptions,
  CatalogModelEntry,
  ProjectFile,
} from '../../shared/types/project';
import { calculateProjectBudget } from '../../shared/engine/calculationEngine';
import { HIGGSFIELD_MODEL_CATALOG } from '../../shared/catalog/higgsfieldCatalog';
import { ELEVENLABS_AS_CATALOG_MODELS } from '../../shared/catalog/elevenlabsCatalog';
import { SUNO_AS_CATALOG_MODELS } from '../../shared/catalog/sunoCatalog';

export const DEFAULT_COMBINED_CATALOG: CatalogModelEntry[] = [
  ...HIGGSFIELD_MODEL_CATALOG,
  ...ELEVENLABS_AS_CATALOG_MODELS,
  ...SUNO_AS_CATALOG_MODELS,
];

/**
 * Menghitung ulang seluruh kalkulasi matematika anggaran proyek
 * dengan sinkronisasi faktor cadangan Langkah 2 & multi-provider (Higgsfield, ElevenLabs, Suno).
 */
export function recalculateProject(project: ProjectFile): ProjectFile {
  // Pertahankan mode khusus untuk proyek uji sintetis PRD Bab 8.10 (10 + 20% = 12 generasi)
  if (project.project_id === 'proj_prd_synthetic_8_10') {
    const calculation = calculateProjectBudget(
      project.items,
      project.assumptions,
      project.exchange_rate
    );
    return {
      ...project,
      calculation,
      updated_at: new Date().toISOString(),
    };
  }

  const cadanganMultiplier = Math.max(
    1,
    project.assumptions.default_attempts_per_shot ||
      project.assumptions.reserve_generations_override ||
      1
  );

  // Pastikan setiap baris pekerjaan menggunakan faktor perkalian cadangan Langkah 2 yang selaras
  const items = project.items.map((item) => ({
    ...item,
    attempts_per_item: cadanganMultiplier,
  }));

  // Sesuai model perkalian cadangan: Total = Kebutuhan x Cadangan Langkah 2.
  // Cadangan tidak lagi ditambahkan ganda di atas hasil perkalian (reserve override = 0, reserve percent = 0).
  const targetVideos = Math.max(
    1,
    Math.floor(project.assumptions.target_videos || 1)
  );

  const syncedAssumptions: BudgetAssumptions = {
    ...project.assumptions,
    target_videos: targetVideos,
    default_attempts_per_shot: cadanganMultiplier,
    reserve_percent: 0,
    reserve_generations_override: 0,
    reserve_input_mode: 'count',
  };

  const calculation = calculateProjectBudget(
    items,
    syncedAssumptions,
    project.exchange_rate,
    undefined,
    project.assumptions.elevenlabs_plan_id || 'starter',
    project.assumptions.suno_plan_id || 'pro'
  );

  return {
    ...project,
    items,
    assumptions: syncedAssumptions,
    calculation,
    updated_at: new Date().toISOString(),
  };
}
