import { describe, expect, it } from 'vitest';
import {
  buildSafePdfFilename,
  formatDurationMmSs,
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

  it('v2.0.0 Tahap 2: Helper formatDurationMmSs memformat detik ke mm:ss secara presisi', () => {
    expect(formatDurationMmSs(0)).toBe('00:00');
    expect(formatDurationMmSs(60)).toBe('01:00');
    expect(formatDurationMmSs(90)).toBe('01:30');
    expect(formatDurationMmSs(150)).toBe('02:30');
    expect(formatDurationMmSs(450)).toBe('07:30');
    expect(formatDurationMmSs(3600)).toBe('60:00');
  });

  it('v2.0.0 Tahap 2: Laporan PDF menyajikan Target Durasi Video Jadi, Durasi Mentah Shot, Multi-Video Total, dan Disclaimer Ruang Potong', () => {
    const project = createPrdSyntheticTestProject();
    project.assumptions.target_videos = 5;
    project.assumptions.final_duration_minutes = 1.0; // 60 detik target post-produksi

    // 1 Video: 18 shots @ 5s = 90s mentah
    project.items = [
      {
        item_id: 'shot_18x5s',
        category: 'text_to_video',
        label: '18 Shot Utama Video Murni',
        quantity: 18,
        quantity_type: 'shot',
        duration_seconds: 5,
        attempts_per_item: 2,
        is_primary_shot: true,
        model_selection: {
          provider: 'Higgsfield',
          model_id: 'kling-video/v3.0',
          model_name: 'Kling Video v3.0',
          category: 'text_to_video',
          parameter_values: { resolution: '720p_std' },
        },
        pricing: {
          pricing_unit: 'per_second',
          price_value: 0.07,
          currency: 'USD',
          credit_cost: 1.4,
          credit_unit: 'per_second',
          source_name: 'Higgsfield Pricing',
          source_url: 'https://higgsfield.ai',
          retrieved_at: '2026-10-28T00:00:00Z',
          status: 'verified',
        },
      },
      // Item pendukung Upscale Video (TIDAK boleh dihitung ke durasi bersih/mentah video)
      {
        item_id: 'upscale_video_item',
        category: 'upscale_video',
        label: 'Upscale 4K Master Video',
        quantity: 1,
        quantity_type: 'shot',
        duration_seconds: 60,
        attempts_per_item: 1,
        is_primary_shot: false,
        model_selection: {
          provider: 'Higgsfield',
          model_id: 'topaz/video-ai-pro',
          model_name: 'Topaz Video AI Pro',
          category: 'upscale_video',
          parameter_values: { scale: '4k' },
        },
        pricing: {
          pricing_unit: 'per_second',
          price_value: 0.1,
          currency: 'USD',
          credit_cost: 2.0,
          credit_unit: 'per_second',
          source_name: 'Higgsfield Pricing',
          source_url: 'https://higgsfield.ai',
          retrieved_at: '2026-10-28T00:00:00Z',
          status: 'verified',
        },
      },
    ];

    const { html: htmlId } = generatePdfReportHtml(project, 'id');
    const { html: htmlEn } = generatePdfReportHtml(project, 'en');

    // 1. Target Durasi Video Jadi (Post-Produksi): "60 Detik (01:00)"
    expect(htmlId).toContain('Target Durasi Bersih Video Jadi (Post-Produksi)');
    expect(htmlId).toContain('60 Detik');
    expect(htmlId).toContain('(01:00)');

    expect(htmlEn).toContain('Target Net Video Duration (Post-Production)');
    expect(htmlEn).toContain('60 Seconds');
    expect(htmlEn).toContain('(01:00)');

    // 2. Total Durasi Mentah Shot AI: "90 Detik (01:30 / 90s) • Tersedia +30s buffer post-produksi"
    // (Upscale 60s TIDAK dihitung, attempts 2x TIDAK dihitung)
    expect(htmlId).toContain('Total Durasi Mentah Shot AI');
    expect(htmlId).toContain('90 Detik');
    expect(htmlId).toContain('(01:30 / 90s)');
    expect(htmlId).toContain('Tersedia +30s buffer post-produksi');

    expect(htmlEn).toContain('Total Raw AI Shot Duration');
    expect(htmlEn).toContain('90 Seconds');
    expect(htmlEn).toContain('(01:30 / 90s)');
    expect(htmlEn).toContain('+30s post-production buffer available');

    // 3. Total Durasi Seluruh Proyek (multi-video = 5): "450 Detik (07:30 untuk 5 Video)"
    expect(htmlId).toContain('Total Durasi Seluruh Proyek');
    expect(htmlId).toContain('450 Detik');
    expect(htmlId).toContain('(07:30 untuk 5 Video)');

    expect(htmlEn).toContain('Total Project Duration');
    expect(htmlEn).toContain('450 Seconds');
    expect(htmlEn).toContain('(07:30 for 5 Videos)');

    // 4. Kotak Disclaimer & Catatan Resmi memuat penegasan Upscale & Jatah Cadangan & Ruang Potong
    expect(htmlId).toContain('Ketentuan Durasi Bersih &amp; Ruang Potong Video Editor:');
    expect(htmlId).toContain('Upscale Video');
    expect(htmlId).toContain('Jatah Cadangan');
    expect(htmlId).toContain('TIDAK dihitung');
    expect(htmlId).toContain('ruang potong (safety buffer)');
    expect(htmlId).toContain('video editor');

    expect(htmlEn).toContain('Clean Video Duration &amp; Post-Production Trimming Notice:');
    expect(htmlEn).toContain('Upscale Video');
    expect(htmlEn).toContain('Reserve Generations');
    expect(htmlEn).toContain('NOT counted');
    expect(htmlEn).toContain('cutting room (safety buffer)');
    expect(htmlEn).toContain('video editors');

    // 5. CSS Tahan Cetak & Page-break
    expect(htmlId).toContain('@page {');
    expect(htmlId).toContain('size: A4 portrait;');
    expect(htmlId).toContain('break-after: avoid;');
    expect(htmlId).toContain('thead {');
    expect(htmlId).toContain('display: table-header-group;');
    expect(htmlId).toContain('-webkit-print-color-adjust: exact;');
    expect(htmlId).toContain('break-inside: avoid;');
  });

  it('Memuat Rincian Voice Over Resmi ElevenLabs dalam Laporan PDF secara Bersih & Terpisah', () => {
    const project = createSampleCommercialProject();
    project.items.push({
      item_id: 'vo-pdf-test',
      category: 'voice_over',
      label: 'Narasi Pembuka Sineas',
      quantity: 1,
      quantity_type: 'asset',
      duration_seconds: 10,
      attempts_per_item: 1,
      script_text: 'Selamat datang di masa depan pembuatan video bersama AI!',
      script_language: 'id',
      character_count: 57,
      model_selection: {
        provider: 'elevenlabs',
        model_id: 'eleven_multilingual_v2',
        model_name: 'Eleven Multilingual v2',
        category: 'voice_over',
        parameter_values: {},
      },
      pricing: {
        pricing_unit: 'per_asset',
        price_value: 0,
        currency: 'USD',
        credit_cost: null,
        credit_unit: undefined,
        source_name: 'ElevenLabs Official',
        source_url: 'https://elevenlabs.io',
        retrieved_at: '2026-10-28T00:00:00.000Z',
        status: 'verified',
      },
    });

    const { html: htmlId } = generatePdfReportHtml(project, 'id');
    const { html: htmlEn } = generatePdfReportHtml(project, 'en');

    // 1. Label Voice Over, File Audio, dan Model ElevenLabs
    expect(htmlId).toContain('Narasi Pembuka Sineas');
    expect(htmlId).toContain('Eleven Multilingual v2');
    expect(htmlId).toContain('Voice Over');
    expect(htmlId).toContain('🎙️ File Audio');
    expect(htmlEn).toContain('🎙️ Audio File');
    expect(htmlId).toContain('ElevenLabs');

    // 2. Pemisahan Kredit ElevenLabs
    expect(htmlId).toContain('Total Konsumsi Credit ElevenLabs (Voice Over)');
    expect(htmlEn).toContain('Total ElevenLabs Credits (Voice Over)');
  });

  it('Memuat Rincian Musik Pengiring Resmi Suno AI & Pemisahan Stems dalam Laporan PDF secara Bersih & Terpisah', () => {
    const project = createSampleCommercialProject();
    project.items.push({
      item_id: 'suno-pdf-test',
      category: 'music',
      label: 'Soundtrack Musik Sineas Utama',
      quantity: 1,
      quantity_type: 'asset',
      duration_seconds: 120,
      attempts_per_item: 2,
      stem_enabled: true,
      stem_type: 'two_stems',
      stem_runs: 1,
      stem_reserve: 0,
      model_selection: {
        provider: 'suno',
        model_id: 'suno_v6',
        model_name: 'Suno v6 (Flagship Studio)',
        category: 'music',
        parameter_values: {},
      },
      pricing: {
        pricing_unit: 'per_asset',
        price_value: 0.1,
        currency: 'USD',
        credit_cost: 10,
        credit_unit: 'per_clip',
        source_name: 'Suno Official Pricing',
        source_url: 'https://suno.com/pricing',
        retrieved_at: '2026-10-29T00:00:00.000Z',
        status: 'verified',
      },
    });

    const { html: htmlId } = generatePdfReportHtml(project, 'id');
    const { html: htmlEn } = generatePdfReportHtml(project, 'en');

    // 1. Label Musik, Track Musik, dan Model Suno
    expect(htmlId).toContain('Soundtrack Musik Sineas Utama');
    expect(htmlId).toContain('Suno v6 (Flagship Studio)');
    expect(htmlId).toContain('🎵 Track Musik');
    expect(htmlEn).toContain('🎵 Music Track');
    expect(htmlId).toContain('Suno AI');

    // 2. Pemisahan Stems
    expect(htmlId).toContain('2-Stems Split (+20 Cr)');
    expect(htmlId).toContain('Stems: 1x');

    // 3. Rekap Kredit Suno
    expect(htmlId).toContain('Total Konsumsi Kredit Suno (Musik & Soundtrack)');
    expect(htmlEn).toContain('Total Suno Credits (Music & Soundtrack)');
  });
});
