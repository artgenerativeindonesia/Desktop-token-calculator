import React from 'react';
import {
  formatCurrencyIdr,
  formatCurrencyUsd,
  UI_TEXT,
} from '../../i18n/translations';
import { ProjectCalculation, ProcessCategory } from '../../../shared/types/project';
import {
  DepartmentTab,
  formatDualDuration,
  getDefaultAddCategoryForDept,
} from './plannerTypes';
import {
  ChevronDown,
  Clock,
  Layers,
  Plus,
  Scissors,
  Sparkles,
} from 'lucide-react';

interface PlannerHeroHeaderProps {
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  calculation: ProjectCalculation;
  cleanDurationSec: number;
  totalCleanDurationSec: number;
  targetDurationSec: number;
  durationDiff: number;
  activeDepartment: DepartmentTab;
  showQuickAddMenu: boolean;
  setShowQuickAddMenu: React.Dispatch<React.SetStateAction<boolean>>;
  onAddAndOpenModal: (category?: ProcessCategory) => void;
  onOpenSetupTab: () => void;
}

export const PlannerHeroHeader: React.FC<PlannerHeroHeaderProps> = ({
  language,
  theme,
  calculation,
  cleanDurationSec,
  totalCleanDurationSec,
  targetDurationSec,
  durationDiff,
  activeDepartment,
  showQuickAddMenu,
  setShowQuickAddMenu,
  onAddAndOpenModal,
  onOpenSetupTab,
}) => {
  const isId = language === 'id';
  const t = UI_TEXT[language];
  const heroCardClass =
    theme === 'dark' ? 'vv-card-hero-dark' : 'vv-card-hero-light';

  return (
    <div
      className={`${heroCardClass} relative z-20 rounded-[18px] p-6 md:p-7 flex flex-col gap-5`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="vv-badge-pill">
              <Layers className="w-3.5 h-3.5 text-[#0099ff]" />
              <span>
                {isId
                  ? 'Langkah 03 • Susun Daftar Shot & Gambar AI'
                  : 'Step 03 • AI Shot & Image Planner'}
              </span>
            </span>
            <span className="vv-badge-pill">
              <span className="vv-blue-dot" />
              <span>
                {calculation.one_video_primary_shot_count} {isId ? 'Shot Utama' : 'Primary Shots'} &bull;{' '}
                {calculation.one_video_supporting_asset_count} {isId ? 'Aset Pendukung' : 'Supporting Assets'}
              </span>
            </span>
            <span className="vv-badge-pill bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold">
              <span>
                {calculation.target_videos > 1
                  ? isId
                    ? `Proyeksi 1 Video • Total ${calculation.target_videos} Video (${calculation.total_primary_shots} Shot Total)`
                    : `1 Video Plan • Total ${calculation.target_videos} Videos (${calculation.total_primary_shots} Total Shots)`
                  : isId
                  ? 'Proyeksi Video Tunggal (1 Video)'
                  : 'Single Video Plan (1 Video)'}
              </span>
            </span>
            <span className="vv-badge-pill bg-sky-500/10 border-sky-500/30 text-sky-400 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>
                ⏱️ {isId ? 'Durasi Bersih:' : 'Clean Duration:'}{' '}
                <strong>{formatDualDuration(cleanDurationSec, isId)}</strong>
              </span>
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-medium tracking-[-0.035em]">
            {isId ? (
              <>
                Daftar Pekerjaan &{' '}
                <span className="vv-accent text-[#0099ff]">
                  Tahap Pembuatan AI
                </span>
              </>
            ) : (
              <>
                AI Production{' '}
                <span className="vv-accent text-[#0099ff]">
                  Stages & Planner
                </span>
              </>
            )}
          </h1>

          <p className="text-xs text-[var(--vv-text-muted)] leading-relaxed">
            {isId
              ? `Daftar di bawah memproyeksikan kebutuhan shot / gambar untuk 1 (satu) video. Hasilnya otomatis dikalikan ${calculation.target_videos} video (sesuai input Langkah 2) untuk total anggaran akhir.`
              : `The list below projects requirements for 1 (one) video. Results are automatically multiplied by ${calculation.target_videos} videos (from Step 2) for the grand total.`}
          </p>
        </div>

        {/* Right: Live Total Readout + Primary Add Stage CTA */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-3 shrink-0">
          <div className="text-left sm:text-right">
            <div className="text-[11px] uppercase tracking-wider text-[#7acaff] font-semibold">
              {calculation.target_videos > 1
                ? isId
                  ? `Total Anggaran (${calculation.target_videos} Video)`
                  : `Total Budget (${calculation.target_videos} Videos)`
                : t.totalBudget}
            </div>
            <div className="text-2xl font-bold tabular-nums text-[var(--vv-text-primary)]">
              {formatCurrencyIdr(calculation.total_cost_idr, language)}
            </div>
            {calculation.target_videos > 1 && (
              <div className="text-[11px] text-[#7acaff] font-medium tabular-nums">
                {isId
                  ? `(Proyeksi: ${formatCurrencyIdr(calculation.one_video_total_cost_idr, language)} / 1 video × ${calculation.target_videos} video)`
                  : `(Projection: ${formatCurrencyUsd(calculation.one_video_total_cost_usd, language)} / 1 video × ${calculation.target_videos} videos)`}
              </div>
            )}
            <div className="text-xs font-semibold tabular-nums text-[#0099ff]">
              {formatCurrencyUsd(calculation.total_cost_usd, language)} &bull;{' '}
              {[
                calculation.total_credit !== null
                  ? `${calculation.total_credit.toLocaleString()} Cr Higgsfield`
                  : null,
                calculation.total_elevenlabs_credit !== null
                  ? `${calculation.total_elevenlabs_credit.toLocaleString()} Cr ElevenLabs`
                  : null,
                calculation.total_suno_credit !== null
                  ? `${calculation.total_suno_credit.toLocaleString()} Cr Suno`
                  : null,
              ]
                .filter(Boolean)
                .join(' • ') || (isId ? '0 Credit' : '0 Credits')}
            </div>
          </div>

          {activeDepartment === 'all' ? (
            <div className="relative z-40">
              <button
                type="button"
                onClick={() => setShowQuickAddMenu((prev) => !prev)}
                className="vv-btn-accent px-5 py-2.5 text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{t.addStageBtn}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {showQuickAddMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowQuickAddMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-[14px] p-2 bg-[#0c1322] border border-[var(--vv-border-strong)] shadow-2xl z-40 space-y-1 backdrop-blur-xl">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--vv-text-subtle)]">
                      {isId
                        ? 'Pilih Jenis Tahap Produksi:'
                        : 'Select Production Stage Type:'}
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddAndOpenModal('text_to_video')}
                      className="w-full px-3 py-2 rounded-[9px] text-xs font-semibold text-left flex items-center gap-2.5 hover:bg-[#0099ff]/20 text-[var(--vv-text-primary)] transition"
                    >
                      <span>🎬</span>
                      <div>
                        <div>
                          {isId
                            ? 'Shot Video & Animasi AI'
                            : 'AI Video & Animation Shot'}
                        </div>
                        <div className="text-[10px] font-normal text-[var(--vv-text-muted)]">
                          Higgsfield (Text/Image/Video to Video)
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => onAddAndOpenModal('text_to_image')}
                      className="w-full px-3 py-2 rounded-[9px] text-xs font-semibold text-left flex items-center gap-2.5 hover:bg-amber-500/20 text-[var(--vv-text-primary)] transition"
                    >
                      <span>🖼️</span>
                      <div>
                        <div>
                          {isId
                            ? 'Gambar & Konsep Visual'
                            : 'Image & Visual Concept'}
                        </div>
                        <div className="text-[10px] font-normal text-[var(--vv-text-muted)]">
                          Higgsfield (Text/Image to Image & Upscale)
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => onAddAndOpenModal('voice_over')}
                      className="w-full px-3 py-2 rounded-[9px] text-xs font-semibold text-left flex items-center gap-2.5 hover:bg-sky-500/20 text-sky-300 transition"
                    >
                      <span>🎙️</span>
                      <div>
                        <div>
                          {isId
                            ? 'File Audio Voice Over'
                            : 'Voice Over Audio File'}
                        </div>
                        <div className="text-[10px] font-normal text-[var(--vv-text-muted)]">
                          ElevenLabs Official (Durasi & Karakter)
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => onAddAndOpenModal('music')}
                      className="w-full px-3 py-2 rounded-[9px] text-xs font-semibold text-left flex items-center gap-2.5 hover:bg-purple-500/20 text-purple-300 transition"
                    >
                      <span>🎵</span>
                      <div>
                        <div>
                          {isId
                            ? 'Track Musik & Soundtrack'
                            : 'Music & Soundtrack'}
                        </div>
                        <div className="text-[10px] font-normal text-[var(--vv-text-muted)]">
                          Suno AI Official (Lagu & Pemisahan Stems)
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                onAddAndOpenModal(
                  getDefaultAddCategoryForDept(activeDepartment)
                )
              }
              className="vv-btn-accent px-5 py-2.5 text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>
                {activeDepartment === 'video'
                  ? isId
                    ? 'Tambah Shot Video'
                    : 'Add Video Shot'
                  : activeDepartment === 'stills'
                  ? isId
                    ? 'Tambah Gambar Visual'
                    : 'Add Visual Image'
                  : activeDepartment === 'voiceover'
                  ? isId
                    ? 'Tambah File Audio'
                    : 'Add Audio File'
                  : isId
                  ? 'Tambah Track Musik'
                  : 'Add Music Track'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Metrik Durasi Bersih & Komparasi Cerdas Target Langkah 2 */}
      <div className="pt-4 border-t border-[var(--vv-border)] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[var(--vv-tint-weak)]/60 rounded-[14px] p-3.5 border border-[var(--vv-border)]">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/35 flex items-center justify-center text-sky-400 shrink-0">
            <Scissors className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-[var(--vv-text-primary)] flex flex-wrap items-center gap-2">
              <span>
                {isId
                  ? 'Durasi Bersih 1 Video:'
                  : '1 Video Net Duration:'}
              </span>
              <span className="font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-bold">
                ⏱️ {formatDualDuration(cleanDurationSec, isId)}
              </span>
              {targetDurationSec > 0 && (
                <span className="font-mono px-2 py-0.5 rounded-full bg-[var(--vv-field)] text-[var(--vv-text-strong)] border border-[var(--vv-border-strong)] text-[11px] font-semibold">
                  {isId
                    ? `Target: ${targetDurationSec}s • Footage AI: ${cleanDurationSec}s [${
                        durationDiff >= 0
                          ? `+${durationDiff}s buffer editing`
                          : `-${Math.abs(durationDiff)}s perlu tambahan`
                      }]`
                    : `Target: ${targetDurationSec}s • AI Footage: ${cleanDurationSec}s [${
                        durationDiff >= 0
                          ? `+${durationDiff}s editing buffer`
                          : `-${Math.abs(durationDiff)}s needed`
                      }]`}
                </span>
              )}
              {calculation.target_videos > 1 && (
                <span className="font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold">
                  {isId
                    ? `Total ${calculation.target_videos} Video: ${formatDualDuration(totalCleanDurationSec, isId)}`
                    : `Total ${calculation.target_videos} Videos: ${formatDualDuration(totalCleanDurationSec, isId)}`}
                </span>
              )}
            </div>

            <p className="text-[11px] text-[var(--vv-text-muted)] leading-relaxed flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {targetDurationSec > 0
                  ? durationDiff > 0
                    ? isId
                      ? `Catatan Sineas AI: Kelebihan durasi (+${durationDiff}s) adalah hal wajar karena akan dipotong oleh editor di post-produksi agar setiap potongan adegan tepat tempo.`
                      : `AI Filmmaker Note: Excess duration (+${durationDiff}s) is expected and ideal as it will be trimmed by the editor in post-production for optimal scene rhythm.`
                    : durationDiff === 0
                    ? isId
                      ? 'Durasi footage AI tepat memenuhi target durasi rencana video Anda.'
                      : 'AI footage duration exactly matches your target video plan.'
                    : isId
                    ? `Footage AI saat ini masih kurang ${Math.abs(durationDiff)}s dari target rencana. Anda dapat menambah adegan atau memperpanjang durasi shot.`
                    : `AI footage is currently ${Math.abs(durationDiff)}s below target. You can add more shots or extend durations.`
                  : isId
                  ? `Daftar shot di bawah memproyeksikan durasi bersih 1 video. Anda dapat menentukan target durasi di Langkah 2 untuk melihat perbandingan buffer editing.`
                  : `The shot list below projects clean duration for 1 video. Set a target in Step 2 to view editing buffer comparison.`}
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenSetupTab}
          className="text-[11px] font-medium text-[#0099ff] hover:underline shrink-0 whitespace-nowrap self-start md:self-center"
        >
          {isId ? 'Atur target di Langkah 2 →' : 'Edit target in Step 2 →'}
        </button>
      </div>
    </div>
  );
};
