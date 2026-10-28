import { describe, expect, it } from 'vitest';
import {
  buildSafePdfFilename,
  formatIdr,
  formatUsd,
  generatePdfReportHtml,
} from '../src/shared/pdf/pdfReportBuilder';
import {
  createPrdSyntheticTestProject,
  createSampleCommercialProject,
} from '../src/shared/engine/calculationEngine';

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

  it('Konsistensi PDF Multi-Item & Multi-Video: Menghasilkan angka total dan unit metrics yang identik dengan mesin kalkulasi', () => {
    const commercialProj = createSampleCommercialProject();
    commercialProj.assumptions.target_videos = 3;

    const { html, calculation } = generatePdfReportHtml(commercialProj, 'id');

    expect(calculation.target_videos).toBe(3);
    expect(calculation.total_cost_usd).toBe(
      Math.round(calculation.one_video_total_cost_usd * 3 * 10000) / 10000
    );

    // Verifikasi bahwa teks HTML memuat format mata uang yang tepat
    const formattedOneVideoUsd = formatUsd(calculation.one_video_total_cost_usd, 'id');
    const formattedTotalUsd = formatUsd(calculation.total_cost_usd, 'id');
    const formattedTotalIdr = formatIdr(calculation.total_cost_idr, 'id');

    expect(html).toContain(formattedOneVideoUsd);
    expect(html).toContain(formattedTotalUsd);
    expect(html).toContain(formattedTotalIdr);
    expect(html).toContain('3 Video');
  });

  it('Edge Case: PDF dengan proyek tanpa item (items: []) berhasil di-render tanpa throw error', () => {
    const emptyProj = createPrdSyntheticTestProject();
    emptyProj.items = [];

    const { html, calculation } = generatePdfReportHtml(emptyProj, 'id');

    expect(calculation.is_complete).toBe(false);
    expect(calculation.item_results).toHaveLength(0);
    expect(html).toContain('ESTIMASI PARSIAL / BELUM LENGKAP');
    expect(html).toContain('AI Video Budget Calculator');
  });

  it('Audit Laporan PDF: Memastikan durasi bersih video, CSS cetak, dan kotak disclaimer tampil rapi dan presisi', () => {
    const project = createPrdSyntheticTestProject();
    project.assumptions.target_videos = 4;
    project.assumptions.final_duration_minutes = 2.5;

    const { html: htmlId } = generatePdfReportHtml(project, 'id');
    const { html: htmlEn } = generatePdfReportHtml(project, 'en');

    // Cek durasi bersih video pada tabel asumsi dan unit cost metrics
    expect(htmlId).toContain('Target Durasi Bersih Video');
    expect(htmlId).toContain('2.5 Menit (150s)');
    expect(htmlEn).toContain('Target Net Video Duration');
    expect(htmlEn).toContain('2.5 Minutes (150s)');

    // Cek kelas disclaimer box dan CSS page-break
    expect(htmlId).toContain('class="disclaimer-box"');
    expect(htmlId).toContain('@media print');
    expect(htmlId).toContain('page-break-inside: avoid');
  });

  it('v1.9.0 PDF Verifikasi: Istilah menggunakan Shot / Gambar dan merinci Shot Utama vs Aset Pendukung', () => {
    const commercialProj = createSampleCommercialProject();
    commercialProj.assumptions.target_videos = 2;

    const { html: htmlId } = generatePdfReportHtml(commercialProj, 'id');
    const { html: htmlEn } = generatePdfReportHtml(commercialProj, 'en');

    // Bebas kata 'adegan'
    expect(htmlId).not.toContain('adegan');
    expect(htmlId).toContain('Shot Utama');
    expect(htmlId).toContain('Aset Pendukung');
    expect(htmlId).toContain('Total Kebutuhan Shot / Gambar');

    expect(htmlEn).toContain('Primary Shot');
    expect(htmlEn).toContain('Supporting Asset');
  });
});
