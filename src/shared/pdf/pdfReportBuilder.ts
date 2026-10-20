import {
  APP_VERSION,
  AppLanguage,
  ProcessCategory,
  ProjectFile,
  VerificationStatus,
} from '../types/project';
import { calculateProjectBudget } from '../engine/calculationEngine';

const CATEGORY_LABELS: Record<ProcessCategory, { id: string; en: string }> = {
  text_to_image: { id: 'Text to Image', en: 'Text to Image' },
  image_to_video: { id: 'Image to Video', en: 'Image to Video' },
  video_to_video: { id: 'Video to Video', en: 'Video to Video' },
  text_to_video: { id: 'Text to Video', en: 'Text to Video' },
  upscaling: { id: 'Upscaling / Enhancement', en: 'Upscaling / Enhancement' },
};

const STATUS_LABELS: Record<VerificationStatus, { id: string; en: string }> = {
  verified: { id: 'Terverifikasi (Otomatis)', en: 'Verified (Automatic)' },
  manual: { id: 'Input Manual Pengguna', en: 'Manual User Input' },
  stale: { id: 'Data Usang (Cache)', en: 'Stale (Cached Data)' },
  unavailable: { id: 'Belum Tersedia', en: 'Unavailable' },
  invalid: { id: 'Tidak Valid', en: 'Invalid' },
};

/**
 * PRD Bab 12.3: Penamaan file PDF otomatis dan pembersihan karakter ilegal
 * Format: NamaProyek_BudgetEstimate_YYYY-MM-DD.pdf
 */
export function buildSafePdfFilename(
  projectName: string,
  exportDateIso?: string
): string {
  const cleanName = (projectName || 'UntitledProject')
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  const safePrefix = cleanName.length > 0 ? cleanName : 'Project';
  const datePart = (exportDateIso || new Date().toISOString()).slice(0, 10);
  return `${safePrefix}_BudgetEstimate_${datePart}.pdf`;
}

export function formatUsd(value: number | null, lang: AppLanguage = 'id'): string {
  if (value === null || !Number.isFinite(value)) {
    return lang === 'id' ? 'Belum Tersedia' : 'Unavailable';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

export function formatIdr(value: number | null, lang: AppLanguage = 'id'): string {
  if (value === null || !Number.isFinite(value)) {
    return lang === 'id' ? 'Belum Tersedia' : 'Unavailable';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Menyusun dokumen HTML cetak lengkap 9 bagian wajib sesuai PRD Bab 12.2 & 12.4.
 * Mengambil hasil langsung dari Calculation Engine yang sama dengan UI (PRD NFR-02).
 */
export function generatePdfReportHtml(
  project: ProjectFile,
  overrideLang?: AppLanguage
): { html: string; calculation: ProjectFile['calculation'] } {
  const lang: AppLanguage =
    overrideLang || project.export_settings?.export_language || project.language || 'id';
  const isId = lang === 'id';

  // PRD Bab 12.4: Gunakan hasil dari Calculation Engine yang sama
  const calc = calculateProjectBudget(
    project.items,
    project.assumptions,
    project.exchange_rate
  );

  const exportDateStr =
    project.export_settings?.export_date || new Date().toISOString().slice(0, 10);

  const statusBadgeText = calc.is_complete
    ? isId
      ? 'ESTIMASI LENGKAP (VALID)'
      : 'COMPLETE ESTIMATE (VALID)'
    : isId
    ? 'ESTIMASI PARSIAL / BELUM LENGKAP'
    : 'PARTIAL / INCOMPLETE ESTIMATE';

  const statusBadgeColor = calc.is_complete ? '#059669' : '#d97706';
  const statusBadgeBg = calc.is_complete ? '#ecfdf5' : '#fffbeb';

  // Baris tabel rincian per tahap (Bagian 4)
  const itemRowsHtml = calc.item_results
    .map((res, idx) => {
      const sourceItem = project.items[idx];
      const paramSummary = sourceItem
        ? Object.entries(sourceItem.model_selection.parameter_values)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ')
        : '-';
      const unitLabel =
        res.pricing_unit === 'per_second'
          ? isId
            ? `Per Detik (${sourceItem?.duration_seconds ?? 0}s)`
            : `Per Second (${sourceItem?.duration_seconds ?? 0}s)`
          : res.pricing_unit === 'per_asset'
          ? isId
            ? 'Per Aset'
            : 'Per Asset'
          : isId
          ? 'Per Generasi'
          : 'Per Generation';

      return `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td>
            <strong>${escapeHtml(res.label)}</strong><br/>
            <span style="font-size:10px;color:#64748b;">${escapeHtml(
              CATEGORY_LABELS[res.category][lang]
            )}</span>
          </td>
          <td>
            <strong>${escapeHtml(res.model_name)}</strong><br/>
            <span style="font-size:10px;color:#64748b;">${escapeHtml(paramSummary)}</span>
          </td>
          <td class="num">${res.effective_quantity} &times; ${
        res.attempts_per_item
      } = <strong>${res.planned_generations}</strong><br/><span style="font-size:10px;color:#64748b;">+${
        res.reserve_generations
      } ${isId ? 'cadangan' : 'reserve'} (${res.budgeted_generations} total)</span></td>
          <td>${escapeHtml(unitLabel)}<br/><span class="num" style="font-size:10px;color:#475569;">${formatUsd(
        res.unit_price_usd,
        lang
      )}</span></td>
          <td class="num">${formatUsd(res.base_cost_usd, lang)}</td>
          <td class="num">${formatUsd(res.reserve_cost_usd, lang)}</td>
          <td class="num">
            <strong>${formatUsd(res.total_cost_usd, lang)}</strong><br/>
            <span style="font-size:10px;color:#475569;">${formatIdr(
              res.total_cost_idr,
              lang
            )}</span>
          </td>
          <td>
            <span class="status-pill status-${res.pricing_status}">
              ${escapeHtml(STATUS_LABELS[res.pricing_status][lang])}
            </span>
          </td>
        </tr>
      `;
    })
    .join('');

  // Baris tabel rincian credit (Bagian 5)
  const creditRowsHtml = calc.item_results
    .map((res, idx) => {
      return `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td>${escapeHtml(res.label)}</td>
          <td>${escapeHtml(res.model_name)}</td>
          <td class="num">${res.budgeted_generations}</td>
          <td class="num">${
            res.unit_credit !== null ? `${res.unit_credit} cr` : isId ? 'Tidak Tersedia' : 'N/A'
          }</td>
          <td class="num"><strong>${
            res.total_credit !== null ? `${res.total_credit} cr` : isId ? 'Tidak Tersedia' : 'N/A'
          }</strong></td>
        </tr>
      `;
    })
    .join('');

  // Daftar peringatan & asumsi audit (Bagian 7)
  const warningsListHtml =
    calc.warnings.length > 0
      ? calc.warnings
          .map(
            (w) =>
              `<li style="margin-bottom:4px;"><strong>[${w.severity.toUpperCase()}]</strong> ${escapeHtml(
                isId ? w.message_id : w.message_en
              )}</li>`
          )
          .join('')
      : `<li>${
          isId
            ? 'Seluruh item produksi dan kurs telah terverifikasi dan lengkap.'
            : 'All production items and exchange rates are verified and complete.'
        }</li>`;

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(project.project_name)} - Budget Estimate</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 28px 34px;
      font-size: 12px;
      line-height: 1.45;
    }
    .header-box {
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 20px 24px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .title {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 4px 0;
    }
    .subtitle {
      font-size: 12px;
      color: #475569;
      margin: 0;
    }
    .badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 11px;
      color: ${statusBadgeColor};
      background: ${statusBadgeBg};
      border: 1px solid ${statusBadgeColor};
    }
    h2 {
      font-size: 14px;
      font-weight: 700;
      color: #1e293b;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 6px;
      margin: 20px 0 10px 0;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }
    .metric-card {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 12px;
      background: #f8fafc;
    }
    .metric-label {
      font-size: 10px;
      color: #64748b;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .metric-val {
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
      font-variant-numeric: tabular-nums;
      text-align: right;
    }
    .metric-sub {
      font-size: 11px;
      color: #475569;
      font-variant-numeric: tabular-nums;
      text-align: right;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      font-size: 11px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 7px 9px;
      vertical-align: top;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      font-weight: 700;
      color: #334155;
    }
    .num {
      text-align: right !important;
      font-variant-numeric: tabular-nums;
    }
    .status-pill {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 600;
    }
    .status-verified { background: #dcfce7; color: #166534; }
    .status-manual { background: #e0f2fe; color: #075985; }
    .status-stale { background: #fef3c7; color: #92400e; }
    .status-unavailable, .status-invalid { background: #ffe4e6; color: #9f1239; }
    .footer {
      margin-top: 24px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      font-size: 10px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <!-- 1. COVER / IDENTITAS PROYEK (PRD Bab 12.2) -->
  <div class="header-box">
    <div>
      <div style="font-size:11px;font-weight:700;color:#2563eb;letter-spacing:0.06em;margin-bottom:4px;">
        AI VIDEO BUDGET CALCULATOR &bull; PRD v${APP_VERSION}
      </div>
      <h1 class="title">${escapeHtml(project.project_name)}</h1>
      <p class="subtitle">
        ${escapeHtml(project.export_settings?.report_title || '')} &bull;
        ${isId ? 'Tanggal Ekspor' : 'Export Date'}: <strong>${escapeHtml(exportDateStr)}</strong>
      </p>
    </div>
    <div style="text-align:right;">
      <span class="badge">${escapeHtml(statusBadgeText)}</span>
      <div style="font-size:10px;color:#64748b;margin-top:6px;">
        Schema v${escapeHtml(project.schema_version)} &bull; ID: ${escapeHtml(project.project_id)}
      </div>
    </div>
  </div>

  <!-- 2. RINGKASAN EKSEKUTIF (PRD Bab 12.2) -->
  <h2>1. ${isId ? 'Ringkasan Eksekutif' : 'Executive Summary'}</h2>
  <div class="grid-4">
    <div class="metric-card">
      <div class="metric-label">${isId ? 'Biaya Dasar' : 'Base Cost'}</div>
      <div class="metric-val">${formatUsd(calc.base_cost_usd, lang)}</div>
      <div class="metric-sub">${formatIdr(calc.base_cost_idr, lang)}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">${isId ? 'Biaya Cadangan' : 'Reserve Cost'} (${calc.effective_reserve_percent}%)</div>
      <div class="metric-val">${formatUsd(calc.reserve_cost_usd, lang)}</div>
      <div class="metric-sub">${formatIdr(calc.reserve_cost_idr, lang)}</div>
    </div>
    <div class="metric-card" style="background:#eff6ff;border-color:#93c5fd;">
      <div class="metric-label" style="color:#1d4ed8;font-weight:700;">${isId ? 'Total Anggaran' : 'Total Budget'}</div>
      <div class="metric-val" style="color:#1e3a8a;">${formatUsd(calc.total_cost_usd, lang)}</div>
      <div class="metric-sub" style="color:#1e40af;font-weight:600;">${formatIdr(calc.total_cost_idr, lang)}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">${isId ? 'Total Konsumsi Credit' : 'Total Credit Consumption'}</div>
      <div class="metric-val">${
        calc.total_credit !== null ? `${calc.total_credit.toLocaleString()} Credits` : isId ? 'Belum Tersedia' : 'N/A'
      }</div>
      <div class="metric-sub">${calc.budgeted_generations} ${isId ? 'generasi dianggarkan' : 'budgeted generations'}</div>
    </div>
  </div>

  <!-- 3. ASUMSI PRODUKSI (PRD Bab 12.2) -->
  <h2>2. ${isId ? 'Asumsi Produksi & Cadangan Regenerasi' : 'Production Assumptions & Regeneration Reserve'}</h2>
  <table>
    <tbody>
      <tr>
        <th>${isId ? 'Mode Estimasi' : 'Estimation Mode'}</th>
        <td>${
          project.assumptions.estimation_mode === 'target_final'
            ? isId
              ? 'Mode Target Video Final'
              : 'Target Final Video Mode'
            : isId
            ? 'Mode Detail Per-Shot'
            : 'Per-Shot Detail Mode'
        }</td>
        <th>${isId ? 'Jumlah Video Final (V)' : 'Target Final Videos (V)'}</th>
        <td class="num">${project.assumptions.target_videos}</td>
      </tr>
      <tr>
        <th>${isId ? 'Total Durasi Video Final (M)' : 'Total Final Duration (M)'}</th>
        <td class="num">${project.assumptions.final_duration_minutes} ${isId ? 'menit' : 'minutes'}</td>
        <th>${isId ? 'Generasi Dasar Direncanakan (Gplanned)' : 'Planned Base Generations (Gplanned)'}</th>
        <td class="num">${calc.planned_generations}</td>
      </tr>
      <tr>
        <th>${isId ? 'Cadangan Regenerasi (R / Greserve)' : 'Regeneration Reserve (R / Greserve)'}</th>
        <td class="num">${calc.effective_reserve_percent}% (+${calc.reserve_generations} ${
    isId ? 'generasi' : 'generations'
  })</td>
        <th>${isId ? 'Total Generasi Dianggarkan (Gbudget)' : 'Total Budgeted Generations (Gbudget)'}</th>
        <td class="num"><strong>${calc.budgeted_generations}</strong></td>
      </tr>
    </tbody>
  </table>

  <!-- 4. RINCIAN PER TAHAP (PRD Bab 12.2) -->
  <h2>3. ${isId ? 'Rincian Anggaran per Tahap Produksi' : 'Stage-by-Stage Production Breakdown'}</h2>
  <table>
    <thead>
      <tr>
        <th style="width:28px;text-align:center;">No</th>
        <th>${isId ? 'Tahap / Shot & Kategori' : 'Stage / Shot & Category'}</th>
        <th>${isId ? 'Model Higgsfield & Parameter' : 'Higgsfield Model & Parameters'}</th>
        <th class="num">${isId ? 'Generasi (Dasar + Cadangan)' : 'Generations (Base + Reserve)'}</th>
        <th>${isId ? 'Satuan & Tarif' : 'Unit & Rate'}</th>
        <th class="num">${isId ? 'Biaya Dasar' : 'Base Cost'}</th>
        <th class="num">${isId ? 'Cadangan' : 'Reserve'}</th>
        <th class="num">${isId ? 'Subtotal (USD / IDR)' : 'Subtotal (USD / IDR)'}</th>
        <th>${isId ? 'Status Data' : 'Data Status'}</th>
      </tr>
    </thead>
    <tbody>
      ${itemRowsHtml}
    </tbody>
  </table>

  <!-- 5. RINCIAN CREDIT (PRD Bab 12.2) -->
  <h2>4. ${isId ? 'Rincian Konsumsi Credit' : 'Credit Consumption Breakdown'}</h2>
  <p style="font-size:10px;color:#64748b;margin-top:0;">
    ${
      isId
        ? 'Catatan PRD Bab 8.5: Credit dihitung terpisah berdasarkan mekanisme konsumsi model dan tidak disamakan otomatis dengan USD.'
        : 'PRD Section 8.5 Note: Credits are calculated separately based on model consumption rules and are never equated automatically with USD.'
    }
  </p>
  <table>
    <thead>
      <tr>
        <th style="width:28px;text-align:center;">No</th>
        <th>${isId ? 'Nama Shot / Tahap' : 'Shot / Stage'}</th>
        <th>${isId ? 'Model' : 'Model'}</th>
        <th class="num">${isId ? 'Generasi Dianggarkan (Gbudget)' : 'Budgeted Generations (Gbudget)'}</th>
        <th class="num">${isId ? 'Credit per Unit' : 'Credit per Unit'}</th>
        <th class="num">${isId ? 'Total Credit' : 'Total Credits'}</th>
      </tr>
    </thead>
    <tbody>
      ${creditRowsHtml}
    </tbody>
  </table>

  <!-- 6. KURS DAN SUMBER (PRD Bab 12.2) -->
  <h2>5. ${isId ? 'Informasi Nilai Tukar (Kurs USD/IDR) & Sumber Data' : 'Exchange Rate (USD/IDR) & Data Source'}</h2>
  <table>
    <tbody>
      <tr>
        <th>${isId ? 'Pasangan Mata Uang' : 'Currency Pair'}</th>
        <td>USD &rarr; IDR</td>
        <th>${isId ? 'Nilai Kurs (X)' : 'Exchange Rate (X)'}</th>
        <td class="num"><strong>${
          project.exchange_rate.rate !== null
            ? `1 USD = ${formatIdr(project.exchange_rate.rate, lang)}`
            : isId
            ? 'Belum Tersedia'
            : 'Unavailable'
        }</strong></td>
      </tr>
      <tr>
        <th>${isId ? 'Jenis & Sumber Kurs' : 'Rate Type & Source'}</th>
        <td>${escapeHtml(project.exchange_rate.rate_type)} &mdash; ${escapeHtml(
    project.exchange_rate.source_name
  )}</td>
        <th>${isId ? 'Waktu Pembaruan & Status' : 'Retrieved At & Status'}</th>
        <td>
          ${escapeHtml(project.exchange_rate.retrieved_at)}
          (<span class="status-pill status-${project.exchange_rate.status}">${escapeHtml(
    STATUS_LABELS[project.exchange_rate.status][lang]
  )}</span>)
        </td>
      </tr>
    </tbody>
  </table>

  <!-- 7. TOTAL ANGGARAN & BIAYA UNIT (PRD Bab 12.2 Bagian 8 & 9) -->
  <h2>6. ${isId ? 'Total Anggaran & Biaya Unit Output Final' : 'Total Budget & Final Output Unit Costs'}</h2>
  <table>
    <tbody>
      <tr>
        <th>${isId ? 'Total Biaya Dasar (Base Cost)' : 'Total Base Cost'}</th>
        <td class="num">${formatUsd(calc.base_cost_usd, lang)}</td>
        <td class="num">${formatIdr(calc.base_cost_idr, lang)}</td>
      </tr>
      <tr>
        <th>${isId ? 'Total Biaya Cadangan Regenerasi (Reserve Cost)' : 'Total Regeneration Reserve Cost'}</th>
        <td class="num">${formatUsd(calc.reserve_cost_usd, lang)}</td>
        <td class="num">${formatIdr(calc.reserve_cost_idr, lang)}</td>
      </tr>
      <tr style="background:#eff6ff;font-size:13px;">
        <th><strong>${isId ? 'TOTAL ANGGARAN AKHIR (Btotal)' : 'GRAND TOTAL BUDGET (Btotal)'}</strong></th>
        <td class="num"><strong>${formatUsd(calc.total_cost_usd, lang)}</strong></td>
        <td class="num"><strong>${formatIdr(calc.total_cost_idr, lang)}</strong></td>
      </tr>
      <tr>
        <th>${isId ? 'Biaya per Video Final (Bvideo = Btotal / V)' : 'Cost per Final Video (Bvideo = Btotal / V)'}</th>
        <td class="num">${formatUsd(calc.cost_per_video_usd, lang)}</td>
        <td class="num">${formatIdr(calc.cost_per_video_idr, lang)}</td>
      </tr>
      <tr>
        <th>${isId ? 'Biaya per Menit Video Final (Bminute = Btotal / M)' : 'Cost per Final Minute (Bminute = Btotal / M)'}</th>
        <td class="num">${formatUsd(calc.cost_per_minute_usd, lang)}</td>
        <td class="num">${formatIdr(calc.cost_per_minute_idr, lang)}</td>
      </tr>
    </tbody>
  </table>

  <!-- 8. ASUMSI DAN PERINGATAN AUDIT (PRD Bab 12.2 Bagian 7) -->
  <h2>7. ${isId ? 'Catatan Transparansi, Asumsi, & Peringatan Audit' : 'Transparency Notes, Assumptions, & Audit Warnings'}</h2>
  <ul style="margin:0;padding-left:18px;color:#334155;">
    ${warningsListHtml}
  </ul>

  <div class="footer">
    <span>AI Video Budget Calculator v${APP_VERSION} &bull; Higgsfield Model Catalog Budgeting</span>
    <span>${escapeHtml(buildSafePdfFilename(project.project_name, exportDateStr))}</span>
  </div>
</body>
</html>`;

  return { html, calculation: calc };
}
