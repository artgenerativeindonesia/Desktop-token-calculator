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
  image_to_image: { id: 'Image to Image', en: 'Image to Image' },
  image_to_video: { id: 'Image to Video', en: 'Image to Video' },
  video_to_video: { id: 'Video to Video', en: 'Video to Video' },
  text_to_video: { id: 'Text to Video', en: 'Text to Video' },
  upscale_image: { id: 'Upscale Image', en: 'Upscale Image' },
  upscale_video: { id: 'Upscale Video', en: 'Upscale Video' },
  voice_over: { id: 'Voice Over', en: 'Voice Over' },
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

/**
 * Format detik ke format standar mm:ss (contoh: 60 -> "01:00", 90 -> "01:30", 450 -> "07:30")
 */
export function formatDurationMmSs(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const mins = Math.floor(s / 60);
  const remSec = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(remSec).padStart(2, '0')}`;
}

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getUnitNoun(qType: string, isId: boolean): string {
  if (qType === 'asset') return isId ? 'gambar' : 'images';
  if (qType === 'output') return isId ? 'hasil jadi' : 'outputs';
  return isId ? 'shot' : 'shots';
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

  const cadanganMultiplier =
    project.assumptions.default_attempts_per_shot ||
    project.assumptions.reserve_generations_override ||
    1;

  const totalSceneQuantity = project.items.reduce(
    (sum, item) => sum + Math.max(0, Math.floor(item.quantity)),
    0
  );

  // PRD Bab 8 & Tahap 2: Durasi video jadi (post-produksi) vs durasi mentah shot AI
  const isVideoCategory = (cat: ProcessCategory): boolean =>
    cat === 'text_to_video' || cat === 'image_to_video' || cat === 'video_to_video';

  const targetDurationSeconds =
    calc.target_duration_seconds !== undefined && calc.target_duration_seconds > 0
      ? calc.target_duration_seconds
      : Math.max(0, Math.round((project.assumptions.final_duration_minutes || 0) * 60));

  // Durasi mentah shot AI untuk 1 video (hanya shot utama video; Upscale Video dan Jatah Cadangan TIDAK dihitung)
  const rawShotDurationSecondsOneVideo =
    calc.one_video_duration_seconds !== undefined
      ? calc.one_video_duration_seconds
      : project.items
          .filter((item) => {
            // Upscale Video TIDAK dihitung ke dalam durasi bersih
            if (item.category === 'upscale_video' || item.category === 'upscale_image') {
              return false;
            }
            const isPrimary = item.is_primary_shot !== false;
            return isPrimary && isVideoCategory(item.category) && item.duration_seconds > 0;
          })
          .reduce((sum, item) => {
            const qty = Math.max(0, Math.floor(item.quantity));
            const dur = Math.max(0, item.duration_seconds);
            return sum + qty * dur;
          }, 0);

  const durationDiffSeconds = rawShotDurationSecondsOneVideo - targetDurationSeconds;
  const targetMmSs = formatDurationMmSs(targetDurationSeconds);
  const rawMmSs = formatDurationMmSs(rawShotDurationSecondsOneVideo);
  const totalProjectSec =
    calc.total_duration_seconds !== undefined && calc.total_duration_seconds > 0
      ? calc.total_duration_seconds
      : rawShotDurationSecondsOneVideo * calc.target_videos;
  const totalProjectMmSs = formatDurationMmSs(totalProjectSec);

  // Format teks durasi video jadi (Post-Produksi)
  const targetDurationHtml =
    targetDurationSeconds > 0
      ? `<strong>${targetDurationSeconds} ${isId ? 'Detik' : 'Seconds'}</strong> (${targetMmSs})${
          project.assumptions.final_duration_minutes > 0
            ? ` &bull; <span style="font-size:10px;color:#64748b;">${project.assumptions.final_duration_minutes} ${isId ? 'Menit' : 'Minutes'} (${targetDurationSeconds}s)</span>`
            : ''
        }`
      : `<strong>${isId ? 'Belum Diatur' : 'Not set'}</strong>`;

  // Format teks durasi mentah shot AI beserta buffer post-produksi
  let rawDurationHtml = '';
  if (rawShotDurationSecondsOneVideo > 0) {
    if (targetDurationSeconds > 0) {
      if (durationDiffSeconds > 0) {
        rawDurationHtml = `<strong>${rawShotDurationSecondsOneVideo} ${isId ? 'Detik' : 'Seconds'}</strong> (${rawMmSs} / ${rawShotDurationSecondsOneVideo}s) &bull; <span style="color:#059669;font-weight:600;">${
          isId
            ? `Tersedia +${durationDiffSeconds}s buffer post-produksi`
            : `+${durationDiffSeconds}s post-production buffer available`
        }</span>`;
      } else if (durationDiffSeconds === 0) {
        rawDurationHtml = `<strong>${rawShotDurationSecondsOneVideo} ${isId ? 'Detik' : 'Seconds'}</strong> (${rawMmSs} / ${rawShotDurationSecondsOneVideo}s) &bull; <span style="color:#0284c7;font-weight:600;">${
          isId ? 'Pas sesuai target post-produksi' : 'Matches post-production target'
        }</span>`;
      } else {
        rawDurationHtml = `<strong>${rawShotDurationSecondsOneVideo} ${isId ? 'Detik' : 'Seconds'}</strong> (${rawMmSs} / ${rawShotDurationSecondsOneVideo}s) &bull; <span style="color:#d97706;font-weight:600;">${
          isId
            ? `Defisit durasi (-${Math.abs(durationDiffSeconds)}s dari target)`
            : `Duration deficit (-${Math.abs(durationDiffSeconds)}s below target)`
        }</span>`;
      }
    } else {
      rawDurationHtml = `<strong>${rawShotDurationSecondsOneVideo} ${isId ? 'Detik' : 'Seconds'}</strong> (${rawMmSs} / ${rawShotDurationSecondsOneVideo}s)`;
    }
  } else {
    rawDurationHtml = `0 ${isId ? 'Detik (00:00)' : 'Seconds (00:00)'}`;
  }

  const sections = project.export_settings?.included_sections || {
    executive_summary: true,
    production_assumptions: true,
    stage_breakdown: true,
    credit_breakdown: true,
    exchange_rate_info: true,
    warnings_and_audit: true,
    unit_cost_metrics: true,
  };

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
        ? Object.entries(sourceItem.model_selection?.parameter_values || {})
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

      const attemptsCount = res.attempts_per_item || cadanganMultiplier;
      const countBreakdown =
        res.reserve_generations > 0
          ? `${res.effective_quantity} &times; ${attemptsCount} = <strong>${res.planned_generations}</strong><br/><span style="font-size:10px;color:#64748b;">+${res.reserve_generations} ${isId ? 'cadangan' : 'reserve'} (${res.budgeted_generations} total)</span>`
          : `<strong>${res.effective_quantity}</strong> ${getUnitNoun(sourceItem?.quantity_type ?? 'shot', isId)}<br/><span style="font-size:10px;color:#0284c7;">&times; ${attemptsCount} ${isId ? 'cadangan' : 'reserve'} = <strong>${res.budgeted_generations}x buat</strong></span>`;

      const isVO = res.category === 'voice_over';
      const voChars =
        sourceItem?.script_text && sourceItem.script_text.length > 0
          ? sourceItem.script_text.length
          : sourceItem?.character_count ||
            Math.round((res.duration_seconds || 10) * 14.5);

      return `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td>
            <strong>${escapeHtml(res.label)}</strong><br/>
            <span style="font-size:10px;color:#64748b;">${escapeHtml(
              CATEGORY_LABELS[res.category]?.[lang] || res.category
            )} &bull; <strong>${
        res.is_primary_shot
          ? isId
            ? '🎬 Shot Utama'
            : '🎬 Primary Shot'
          : isId
          ? '🛠️ Aset Pendukung'
          : '🛠️ Supporting Asset'
      }</strong></span>
          </td>
          <td>
            <strong>${escapeHtml(res.model_name)}</strong><br/>
            <span style="font-size:10px;color:#64748b;">${
              isVO
                ? `🔤 ${voChars} chars &bull; ⏱️ ${res.duration_seconds}s (${
                    sourceItem?.script_language === 'en' ? '🇬🇧 EN' : '🇮🇩 ID'
                  })`
                : escapeHtml(paramSummary)
            }</span>
          </td>
          <td class="num">${countBreakdown}</td>
          <td>${escapeHtml(unitLabel)}<br/><span class="num" style="font-size:10px;color:#475569;">${formatUsd(
        res.unit_price_usd,
        lang
      )}</span></td>
          <td class="num">
            <strong>${res.total_credit !== null ? `${res.total_credit} cr` : '-'}</strong><br/>
            <span style="font-size:10px;color:#64748b;">${
              isVO
                ? 'ElevenLabs'
                : res.unit_credit !== null
                ? `@${res.unit_credit} cr`
                : ''
            }</span>
          </td>
          <td class="num">
            <strong>${formatIdr(res.total_cost_idr, lang)}</strong><br/>
            <span style="font-size:10px;color:#475569;">(${formatUsd(
              res.total_cost_usd,
              lang
            )})</span>
          </td>
          <td>
            <span class="status-pill status-${res.pricing_status}">
              ${escapeHtml(STATUS_LABELS[res.pricing_status]?.[lang] || res.pricing_status)}
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
          <td class="num"><strong>${res.budgeted_generations}x</strong></td>
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
    .disclaimer-box {
      margin-top: 10px;
      margin-bottom: 14px;
      padding: 12px 16px;
      background: #f0fdf4;
      border: 1px solid #86efac;
      border-radius: 10px;
      page-break-inside: avoid;
    }
    .footer {
      margin-top: 24px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      font-size: 10px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      @page {
        size: A4 portrait;
        margin: 10mm 12mm;
      }
      body {
        padding: 0;
        background: #ffffff;
        color: #0f172a;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      h2 {
        page-break-after: avoid;
        break-after: avoid;
      }
      thead {
        display: table-header-group;
      }
      tr, .metric-card, .header-box, .disclaimer-box {
        page-break-inside: avoid;
        break-inside: avoid;
      }
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
  ${sections.executive_summary ? `
  <h2>1. ${isId ? 'Ringkasan Eksekutif' : 'Executive Summary'}</h2>
  <div class="grid-4">
    <div class="metric-card" style="background:#eff6ff;border-color:#93c5fd;">
      <div class="metric-label" style="color:#1d4ed8;font-weight:700;">${isId ? 'Total Seluruh Anggaran' : 'Grand Total Budget'}</div>
      <div class="metric-val" style="color:#1e3a8a;font-size:16px;">${formatIdr(calc.total_cost_idr, lang)}</div>
      <div class="metric-sub" style="color:#1e40af;font-weight:600;">${formatUsd(calc.total_cost_usd, lang)}${calc.target_videos > 1 ? ` (${calc.target_videos} Video)` : ''}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">${isId ? 'Proyeksi 1 Video Jadi' : '1 Finished Video Cost'}</div>
      <div class="metric-val">${formatIdr(calc.one_video_total_cost_idr, lang)}</div>
      <div class="metric-sub">${formatUsd(calc.one_video_total_cost_usd, lang)} &bull; ${calc.one_video_budgeted_generations}x buat</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">${isId ? 'Target Jumlah Video' : 'Target Video Count'}</div>
      <div class="metric-val">${calc.target_videos} ${isId ? 'Video' : 'Videos'}</div>
      <div class="metric-sub">${cadanganMultiplier}x ${isId ? 'cadangan per shot' : 'reserve multiplier'}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">${isId ? 'Total Kali Buat AI' : 'Total AI Generations'}</div>
      <div class="metric-val">${calc.budgeted_generations} ${isId ? 'kali buat' : 'tries'}</div>
      <div class="metric-sub">${
        calc.total_credit !== null
          ? `${calc.total_credit.toLocaleString()} Cr (Higgsfield)${
              calc.total_elevenlabs_credit !== null
                ? ` + ${calc.total_elevenlabs_credit.toLocaleString()} Cr (ElevenLabs)`
                : ''
            }`
          : calc.total_elevenlabs_credit !== null
          ? `${calc.total_elevenlabs_credit.toLocaleString()} Cr (ElevenLabs)`
          : isId
          ? 'Bebas Credit'
          : 'No Credits'
      }</div>
    </div>
  </div>
  ` : ''}

  <!-- 3. ASUMSI PRODUKSI (PRD Bab 12.2) -->
  ${sections.production_assumptions ? `
  <h2>2. ${isId ? 'Pengaturan Proyek & Dana Cadangan' : 'Project Settings & Reserve Budget'}</h2>
  <table>
    <tbody>
      <tr>
        <th>${isId ? 'Nama Proyek' : 'Project Name'}</th>
        <td><strong>${escapeHtml(project.project_name)}</strong></td>
        <th>${isId ? 'Cadangan Langkah 2' : 'Step 2 Reserve Factor'}</th>
        <td class="num"><strong>${cadanganMultiplier} ${isId ? 'cadangan (' + cadanganMultiplier + 'x jatah buat)' : 'reserve (' + cadanganMultiplier + 'x tries)'}</strong></td>
      </tr>
      <tr>
        <th>${isId ? 'Total Kebutuhan Shot / Gambar' : 'Total Shot Requirements'}</th>
        <td class="num"><strong>${calc.one_video_primary_shot_count} ${isId ? 'Shot Utama' : 'Primary Shots'}</strong> (${totalSceneQuantity} item)</td>
        <th>${isId ? 'Total Kali Pembuatan AI' : 'Total Budgeted Generations'}</th>
        <td class="num"><strong>${calc.budgeted_generations} ${isId ? 'kali buat' : 'tries'}</strong></td>
      </tr>
      <tr>
        <th>${isId ? 'Model Perhitungan' : 'Calculation Model'}</th>
        <td>${isId ? 'Kebutuhan shot/gambar × ' + cadanganMultiplier + ' cadangan = Total kali buat' : 'Shot/image requirement × ' + cadanganMultiplier + ' reserve = Total tries'}</td>
        <th>${isId ? 'Patokan Kurs Dolar' : 'USD Exchange Rate'}</th>
        <td class="num">${project.exchange_rate.rate ? '1 USD = ' + formatIdr(project.exchange_rate.rate, lang) : '-'}</td>
      </tr>
      <tr>
        <th>${isId ? 'Target Durasi Bersih Video Jadi (Post-Produksi)' : 'Target Net Video Duration (Post-Production)'}</th>
        <td class="num">${targetDurationHtml}</td>
        <th>${isId ? 'Target Jumlah Video' : 'Target Video Count'}</th>
        <td class="num"><strong>${calc.target_videos} ${isId ? 'Video' : calc.target_videos > 1 ? 'Videos' : 'Video'}</strong></td>
      </tr>
      <tr>
        <th>${isId ? 'Total Durasi Mentah Shot AI' : 'Total Raw AI Shot Duration'}</th>
        <td class="num"${calc.target_videos > 1 ? '' : ' colspan="3"'}>${rawDurationHtml}</td>
        ${calc.target_videos > 1 ? `
        <th>${isId ? 'Total Durasi Seluruh Proyek' : 'Total Project Duration'}</th>
        <td class="num"><strong>${totalProjectSec} ${isId ? 'Detik' : 'Seconds'}</strong> (${totalProjectMmSs} ${isId ? `untuk ${calc.target_videos} Video` : `for ${calc.target_videos} Videos`})</td>
        ` : ''}
      </tr>
    </tbody>
  </table>
  ` : ''}

  <!-- 4. RINCIAN PER TAHAP (PRD Bab 12.2) -->
  ${sections.stage_breakdown ? `
  <h2>3. ${isId ? 'Rincian Anggaran per Tahap Produksi' : 'Stage-by-Stage Production Breakdown'}</h2>
  <table>
    <thead>
      <tr>
        <th style="width:28px;text-align:center;">No</th>
        <th>${isId ? 'Nama Shot / Tahap & Jenis AI' : 'Shot / Stage & AI Type'}</th>
        <th>${isId ? 'Model AI & Pengaturan Kualitas' : 'Higgsfield Model & Settings'}</th>
        <th class="num">${isId ? 'Kebutuhan & Cadangan' : 'Requirement & Reserve'}</th>
        <th>${isId ? 'Satuan & Harga' : 'Unit & Price'}</th>
        <th class="num">${isId ? 'Pemakaian Credit' : 'Credit Cost'}</th>
        <th class="num">${isId ? 'Subtotal Anggaran (IDR / USD)' : 'Subtotal (IDR / USD)'}</th>
        <th>${isId ? 'Status Data' : 'Data Status'}</th>
      </tr>
    </thead>
    <tbody>
      ${itemRowsHtml}
    </tbody>
  </table>
  <div class="disclaimer-box">
    <div style="font-weight:700;color:#166534;font-size:11.5px;margin-bottom:6px;display:flex;align-items:center;gap:6px;">
      <span>📌</span>
      <span>${isId ? 'CATATAN PENTING & RUMUS PROYEKSI MULTI-VIDEO:' : 'IMPORTANT NOTICE & MULTI-VIDEO PROJECTION FORMULA:'}</span>
    </div>
    <div style="font-size:11px;color:#0f172a;line-height:1.5;">
      ${isId
        ? `Seluruh rincian pekerjaan dan shot / gambar pada tabel di atas adalah proyeksi teknis kebutuhan untuk <strong>1 (satu) video</strong> utuh (${calc.one_video_primary_shot_count} Shot Utama + ${calc.one_video_supporting_asset_count} Aset Pendukung).<br/>
           <strong>Perhitungan Total Anggaran Akhir:</strong> Biaya 1 Video (<strong>${formatIdr(calc.one_video_total_cost_idr, lang)}</strong> / ${formatUsd(calc.one_video_total_cost_usd, lang)}) &times; <strong>${calc.target_videos} Video</strong> = <strong>${formatIdr(calc.total_cost_idr, lang)}</strong> (${formatUsd(calc.total_cost_usd, lang)}${calc.total_credit !== null ? ` &bull; ${calc.total_credit.toLocaleString()} Credits` : ''})`
        : `All stage requirements and shots/images in the table above project technical needs for <strong>1 (one) single video</strong> (${calc.one_video_primary_shot_count} Primary Shots + ${calc.one_video_supporting_asset_count} Supporting Assets).<br/>
           <strong>Final Grand Total Calculation:</strong> 1 Video Cost (<strong>${formatUsd(calc.one_video_total_cost_usd, lang)}</strong> / ${formatIdr(calc.one_video_total_cost_idr, lang)}) &times; <strong>${calc.target_videos} ${calc.target_videos > 1 ? 'Videos' : 'Video'}</strong> = <strong>${formatUsd(calc.total_cost_usd, lang)}</strong> (${formatIdr(calc.total_cost_idr, lang)}${calc.total_credit !== null ? ` &bull; ${calc.total_credit.toLocaleString()} Credits` : ''})`
      }
    </div>
    <div style="margin-top:8px;padding-top:8px;border-top:1px dashed #86efac;font-size:10.5px;color:#1e3a8a;line-height:1.5;">
      <strong>🎬 ${isId ? 'Ketentuan Durasi Bersih &amp; Ruang Potong Video Editor:' : 'Clean Video Duration &amp; Post-Production Trimming Notice:'}</strong><br/>
      ${isId
        ? `Proses <strong>Upscale Video</strong> dan <strong>Jatah Cadangan</strong> (percobaan ulang) <strong>TIDAK dihitung</strong> ke dalam durasi bersih video final. Total durasi mentah shot AI sengaja menyediakan ruang potong (safety buffer) yang leluasa bagi video editor untuk proses pemotongan (trimming), penataan transisi, dan sinkronisasi audio di tahap post-produksi.`
        : `<strong>Upscale Video</strong> processes and <strong>Reserve Generations</strong> (retry attempts) are <strong>NOT counted</strong> toward the final clean video duration. The total raw AI shot duration intentionally provides extra cutting room (safety buffer) for video editors during trimming, transitions, and audio sync in post-production.`
      }
    </div>
  </div>
  ` : ''}

  <!-- 5. RINCIAN CREDIT (PRD Bab 12.2) -->
  ${sections.credit_breakdown ? `
  <h2>4. ${isId ? 'Rincian Pemakaian Credit' : 'Credit Consumption Breakdown'}</h2>
  <p style="font-size:10px;color:#64748b;margin-top:0;">
    ${
      isId
        ? 'Catatan: Credit adalah poin pemakaian di platform AI yang dihitung terpisah dari harga Dolar/Rupiah.'
        : 'Note: Credits represent platform usage points and are tracked separately from USD/IDR costs.'
    }
  </p>
  <table>
    <thead>
      <tr>
        <th style="width:28px;text-align:center;">No</th>
        <th>${isId ? 'Nama Shot / Tahap' : 'Shot / Stage'}</th>
        <th>${isId ? 'Model AI' : 'Model'}</th>
        <th class="num">${isId ? 'Total Kali Buat' : 'Total Generations'}</th>
        <th class="num">${isId ? 'Credit per Satuan' : 'Credit per Unit'}</th>
        <th class="num">${isId ? 'Total Credit' : 'Total Credits'}</th>
      </tr>
    </thead>
    <tbody>
      ${creditRowsHtml}
    </tbody>
  </table>
  ` : ''}

  <!-- 6. KURS DAN SUMBER (PRD Bab 12.2) -->
  ${sections.exchange_rate_info ? `
  <h2>5. ${isId ? 'Informasi Kurs Dolar ke Rupiah & Sumber Data' : 'Exchange Rate (USD/IDR) & Data Source'}</h2>
  <table>
    <tbody>
      <tr>
        <th>${isId ? 'Mata Uang' : 'Currency Pair'}</th>
        <td>USD &rarr; IDR (Rupiah)</td>
        <th>${isId ? 'Nilai Kurs Saat Ini' : 'Current Exchange Rate'}</th>
        <td class="num"><strong>${
          project.exchange_rate.rate !== null
            ? `1 USD = ${formatIdr(project.exchange_rate.rate, lang)}`
            : isId
            ? 'Belum Diisi'
            : 'Unavailable'
        }</strong></td>
      </tr>
      <tr>
        <th>${isId ? 'Keterangan & Sumber Kurs' : 'Rate Type & Source'}</th>
        <td>${escapeHtml(project.exchange_rate.rate_type)} &mdash; ${escapeHtml(
    project.exchange_rate.source_name
  )}</td>
        <th>${isId ? 'Waktu Diperbarui & Status' : 'Last Updated & Status'}</th>
        <td>
          ${escapeHtml((project.exchange_rate.retrieved_at || '').slice(0, 19).replace('T', ' '))}
          (<span class="status-pill status-${project.exchange_rate.status}">${escapeHtml(
    STATUS_LABELS[project.exchange_rate.status]?.[lang] || project.exchange_rate.status
  )}</span>)
        </td>
      </tr>
    </tbody>
  </table>
  ` : ''}

  <!-- 7. TOTAL ANGGARAN & BIAYA UNIT (PRD Bab 12.2 Bagian 8 & 9) -->
  ${sections.unit_cost_metrics ? `
  <h2>6. ${isId ? 'Total Anggaran & Rata-rata Biaya Hasil Akhir' : 'Total Budget & Average Output Costs'}</h2>
  <table>
    <tbody>
      <tr style="background:#f8fafc;">
        <th>${isId ? 'Total Kebutuhan Shot / Gambar' : 'Total Shot Requirements'}</th>
        <td class="num">${calc.one_video_primary_shot_count} ${isId ? 'Shot Utama' : 'Primary'} (${totalSceneQuantity} item)</td>
        <td class="num">${isId ? 'Dikalikan' : 'Multiplied by'} ${cadanganMultiplier} ${isId ? 'cadangan' : 'reserve'}</td>
      </tr>
      <tr>
        <th>${isId ? 'Total Kali Pembuatan AI' : 'Total Budgeted Generations'}</th>
        <td class="num" colspan="2"><strong>${calc.budgeted_generations} ${isId ? 'kali buat' : 'tries'}</strong></td>
      </tr>
      <tr>
        <th>${isId ? 'Total Konsumsi Credit Higgsfield (Video/Gambar)' : 'Total Higgsfield Credits (Video/Image)'}</th>
        <td class="num" colspan="2"><strong>${calc.total_credit !== null ? `${calc.total_credit.toLocaleString()} Credits` : '-'}</strong></td>
      </tr>
      ${
        calc.total_elevenlabs_credit !== null
          ? `
      <tr>
        <th>${isId ? 'Total Konsumsi Credit ElevenLabs (Voice Over)' : 'Total ElevenLabs Credits (Voice Over)'}</th>
        <td class="num" colspan="2"><strong style="color:#0284c7;">${calc.total_elevenlabs_credit.toLocaleString()} Credits ElevenLabs</strong></td>
      </tr>`
          : ''
      }
      ${calc.reserve_cost_usd && calc.reserve_cost_usd > 0 ? `
      <tr>
        <th>${isId ? 'Biaya Dasar' : 'Base Cost'}</th>
        <td class="num">${formatUsd(calc.base_cost_usd, lang)}</td>
        <td class="num">${formatIdr(calc.base_cost_idr, lang)}</td>
      </tr>
      <tr>
        <th>${isId ? 'Biaya Cadangan' : 'Reserve Cost'}</th>
        <td class="num">${formatUsd(calc.reserve_cost_usd, lang)}</td>
        <td class="num">${formatIdr(calc.reserve_cost_idr, lang)}</td>
      </tr>
      ` : ''}
      <tr style="background:#eff6ff;font-size:13px;">
        <th><strong>${isId ? 'TOTAL SELURUH ANGGARAN' : 'GRAND TOTAL BUDGET'}</strong></th>
        <td class="num"><strong>${formatUsd(calc.total_cost_usd, lang)}</strong></td>
        <td class="num"><strong>${formatIdr(calc.total_cost_idr, lang)}</strong></td>
      </tr>
      <tr>
        <th>${isId ? 'Proyeksi Biaya per 1 Video Jadi' : '1 Finished Video Projected Cost'}</th>
        <td class="num">${formatUsd(calc.one_video_total_cost_usd, lang)}</td>
        <td class="num"><strong>${formatIdr(calc.one_video_total_cost_idr, lang)}</strong></td>
      </tr>
      <tr>
        <th>${isId ? 'Jumlah Video yang Diproduksi' : 'Total Videos Produced'}</th>
        <td class="num" colspan="2"><strong>&times; ${calc.target_videos} ${isId ? 'Video' : calc.target_videos > 1 ? 'Videos' : 'Video'}</strong></td>
      </tr>
      ${(calc.target_duration_formatted || targetDurationSeconds > 0) ? `
      <tr>
        <th>${isId ? 'Target Durasi Bersih per Video' : 'Target Net Duration per Video'}</th>
        <td class="num" colspan="2"><strong>${
          calc.target_duration_formatted
            ? (isId ? calc.target_duration_formatted.id : calc.target_duration_formatted.en)
            : `${targetDurationSeconds} ${isId ? 'Detik' : 'Seconds'} (${targetMmSs}) &bull; ${project.assumptions.final_duration_minutes} ${isId ? 'Menit' : 'Minutes'} (${targetDurationSeconds}s)`
        }</strong></td>
      </tr>
      ` : ''}
      ${rawShotDurationSecondsOneVideo > 0 ? `
      <tr>
        <th>${isId ? 'Total Durasi Mentah Shot AI (1 Video)' : 'Total Raw AI Shot Duration (1 Video)'}</th>
        <td class="num" colspan="2"><strong>${rawShotDurationSecondsOneVideo} ${isId ? 'Detik' : 'Seconds'}</strong> (${rawMmSs} / ${rawShotDurationSecondsOneVideo}s)${
          targetDurationSeconds > 0 && durationDiffSeconds > 0
            ? ` &bull; <span style="color:#059669;font-weight:600;">+${durationDiffSeconds}s buffer</span>`
            : ''
        }</td>
      </tr>
      ` : ''}
      ${(calc.target_videos > 1 && rawShotDurationSecondsOneVideo > 0) ? `
      <tr>
        <th>${isId ? 'Total Durasi Seluruh Proyek' : 'Total Project Duration'}</th>
        <td class="num" colspan="2"><strong>${totalProjectSec} ${isId ? 'Detik' : 'Seconds'}</strong> (${totalProjectMmSs} ${isId ? `untuk ${calc.target_videos} Video` : `for ${calc.target_videos} Videos`})</td>
      </tr>
      ` : ''}
      ${calc.cost_per_minute_usd !== null ? `
      <tr>
        <th>${isId ? 'Rata-rata Biaya per 1 Menit Video Jadi' : 'Average Cost per Final Video Minute'}</th>
        <td class="num">${formatUsd(calc.cost_per_minute_usd, lang)}</td>
        <td class="num">${formatIdr(calc.cost_per_minute_idr, lang)}</td>
      </tr>
      ` : ''}
    </tbody>
  </table>
  ` : ''}

  <!-- 8. ASUMSI DAN PERINGATAN AUDIT (PRD Bab 12.2 Bagian 7) -->
  ${sections.warnings_and_audit ? `
  <h2>7. ${isId ? 'Catatan & Status Kelengkapan Data' : 'Notes & Data Completeness Status'}</h2>
  <ul style="margin:0;padding-left:18px;color:#334155;">
    ${warningsListHtml}
  </ul>
  ` : ''}

  <div class="footer">
    <span>AI Video Budget Calculator v${APP_VERSION} &bull; Higgsfield Model Catalog Budgeting</span>
    <span>${escapeHtml(buildSafePdfFilename(project.project_name, exportDateStr))}</span>
  </div>
</body>
</html>`;

  return { html, calculation: calc };
}
