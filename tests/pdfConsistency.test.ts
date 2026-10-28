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

  it('v2.0.0 Tahap 1: Laporan PDF menampilkan disclaimer dan rumus proyeksi multi-video', () => {
    const project = createPrdSyntheticTestProject();
    project.assumptions.target_videos = 5;

    const { html: htmlId, calculation: calcId } = generatePdfReportHtml(project, 'id');
    const { html: htmlEn, calculation: calcEn } = generatePdfReportHtml(project, 'en');

    // 1 Video = $24, 5 Video = $120
    expect(calcId.target_videos).toBe(5);
    expect(calcId.one_video_total_cost_usd).toBe(24);
    expect(calcId.total_cost_usd).toBe(120);

    // Disclaimer & Formula pada PDF bahasa Indonesia
    expect(htmlId).toContain('CATATAN PENTING & RUMUS PROYEKSI MULTI-VIDEO');
    expect(htmlId).toContain('5 Video');
    expect(htmlId).toContain('$24.00');
    expect(htmlId).toContain('$120.00');

    // Disclaimer & Formula pada PDF bahasa Inggris
    expect(htmlEn).toContain('IMPORTANT NOTICE & MULTI-VIDEO PROJECTION FORMULA');
    expect(htmlEn).toContain('5 Videos');
    expect(htmlEn).toContain('$24.00');
    expect(htmlEn).toContain('$120.00');
  });
});
