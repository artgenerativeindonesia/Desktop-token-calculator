import { describe, expect, it } from 'vitest';
import {
  buildSafePdfFilename,
  generatePdfReportHtml,
} from '../src/shared/pdf/pdfReportBuilder';
import { createPrdSyntheticTestProject } from '../src/shared/engine/calculationEngine';

describe('PDF Report Builder & UI Consistency — PRD Bab 12 & AC-10', () => {
  it('AC-10: Angka pada laporan PDF (ID & EN) 100% identik dengan hasil Calculation Engine di UI', () => {
    const project = createPrdSyntheticTestProject();
    const { html: htmlId, calculation } = generatePdfReportHtml(project, 'id');
    const { html: htmlEn } = generatePdfReportHtml(project, 'en');

    // Pastikan nilai perhitungan cocok dengan PRD Bab 8.10 ($20 dasar, $4 cadangan, $24 total)
    expect(calculation.base_cost_usd).toBe(20);
    expect(calculation.reserve_cost_usd).toBe(4);
    expect(calculation.total_cost_usd).toBe(24);

    // Pastikan HTML PDF memuat angka yang sama persis
    expect(htmlId).toContain('$20.00');
    expect(htmlId).toContain('$4.00');
    expect(htmlId).toContain('$24.00');
    expect(htmlId).toContain('Ringkasan Eksekutif');
    expect(htmlId).toContain('Rincian Anggaran per Tahap Produksi');

    // Pastikan dukungan bahasa Inggris (EN) bekerja pada laporan PDF
    expect(htmlEn).toContain('$20.00');
    expect(htmlEn).toContain('$4.00');
    expect(htmlEn).toContain('$24.00');
    expect(htmlEn).toContain('Executive Summary');
    expect(htmlEn).toContain('Stage-by-Stage Production Breakdown');
  });

  it('PRD Bab 12.3: Membersihkan karakter ilegal pada nama file PDF', () => {
    const filename = buildSafePdfFilename(
      'Iklan TVC: "Kopi / Teh" *2026*?',
      '2026-10-20'
    );
    expect(filename).toBe('Iklan_TVC_Kopi_Teh_2026_BudgetEstimate_2026-10-20.pdf');
    expect(filename).not.toMatch(/[<>:"/\\|?*]/);
  });
});
