import { describe, expect, it } from 'vitest';
import {
  compareSchemaVersion,
  validateProjectFileJson,
} from '../src/shared/schema/projectSchema';
import { createPrdSyntheticTestProject } from '../src/shared/engine/calculationEngine';

describe('Project File Schema Validator (.aivbudget) — PRD Bab 10.3 & FR-01, FR-13', () => {
  it('AC-01: Memvalidasi file proyek .aivbudget yang valid dengan sukses', () => {
    const project = createPrdSyntheticTestProject();
    const jsonString = JSON.stringify(project, null, 2);

    const validation = validateProjectFileJson(jsonString);
    expect(validation.valid).toBe(true);
    expect(validation.data?.project_name).toBe(project.project_name);
    expect(validation.data?.schema_version).toBe('1.0.0');
  });

  it('FR-01: Menolak proyek dengan nama kosong', () => {
    const project = createPrdSyntheticTestProject();
    project.project_name = '   ';
    const validation = validateProjectFileJson(JSON.stringify(project));

    expect(validation.valid).toBe(false);
    expect(validation.errorCode).toBe('VALIDATION_FAILED');
  });

  it('PRD Bab 10.3: Menolak file dengan schema_version lebih baru tanpa merusak file', () => {
    const project = createPrdSyntheticTestProject();
    project.schema_version = '2.1.0';
    const validation = validateProjectFileJson(JSON.stringify(project));

    expect(validation.valid).toBe(false);
    expect(validation.errorCode).toBe('NEWER_SCHEMA_VERSION');
    expect(validation.errorMessage_id).toContain('v2.1.0');
  });

  it('PRD Bab 13.1: Menangani file JSON yang rusak dengan pesan jelas', () => {
    const validation = validateProjectFileJson('{ invalid json ///');
    expect(validation.valid).toBe(false);
    expect(validation.errorCode).toBe('INVALID_JSON');
  });

  it('Membandingkan versi skema semver secara akurat', () => {
    expect(compareSchemaVersion('1.0.0', '1.0.0')).toBe(0);
    expect(compareSchemaVersion('2.0.0', '1.0.0')).toBe(1);
    expect(compareSchemaVersion('1.0.0', '1.2.0')).toBe(-1);
  });
});
