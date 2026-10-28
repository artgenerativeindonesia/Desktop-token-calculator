import React, { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import {
  CATEGORY_LABELS,
  formatCurrencyIdr,
  formatCurrencyUsd,
  PRICING_UNIT_LABELS,
  QUANTITY_TYPE_LABELS,
  SHORT_CATEGORY_LABELS,
  UI_TEXT,
} from '../i18n/translations';
import { getModelsByCategory } from '../../shared/catalog/higgsfieldCatalog';
import { ProcessCategory, QuantityType } from '../../shared/types/project';
import { StatusBadge } from './StatusBadge';
import { FrostedModal } from './FrostedModal';
import { StepFlowBar } from './StepFlowBar';
import { InfoTip } from './InfoTip';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Film,
  Info,
  Layers,
  Mic,
  Music,
  Plus,
  RotateCcw,
  Scissors,
  Sliders,
  Sparkles,
  Trash2,
  Volume2,
} from 'lucide-react';
import {
  SPEECH_SPEED_PROFILES,
  convertDurationToCharacters,
  convertCharactersToDuration,
  calculateElevenLabsCredits,
  calculateElevenLabsCostUsd,
  calculateElevenLabsCostIdr,
  getElevenLabsModelById,
  getElevenLabsPlanById,
  ELEVENLABS_MODELS_CATALOG,
} from '../../shared/catalog/elevenlabsCatalog';

export type DepartmentTab = 'all' | 'video' | 'stills' | 'voiceover' | 'music';

const VIDEO_CATEGORIES: ProcessCategory[] = [
  'text_to_video',
  'image_to_video',
  'video_to_video',
];

const STILLS_CATEGORIES: ProcessCategory[] = [
  'text_to_image',
  'image_to_image',
  'upscale_image',
  'upscale_video',
];

/** Format durasi ganda: contoh "1m 30s (90s)" atau "45s (45s)" */
export function formatDualDuration(seconds: number, isId: boolean = true): string {
  if (!seconds || seconds <= 0) {
    return isId ? '0 detik (0s)' : '0 sec (0s)';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);

  if (mins === 0) {
    return `${secs}s (${secs}s)`;
  }
  const minPart = `${mins}m`;
  const secPart = secs > 0 ? ` ${secs}s` : '';
  return `${minPart}${secPart} (${seconds}s)`;
}

const ALL_CATEGORIES: ProcessCategory[] = [
  'text_to_image',
  'image_to_image',
  'image_to_video',
  'video_to_video',
  'text_to_video',
  'upscale_image',
  'upscale_video',
  'voice_over',
];

export const ProductionPlannerView: React.FC = () => {
  const {
    project,
    catalog,
    language,
    theme,
    addProductionItem,
    duplicateProductionItem,
    removeProductionItem,
    updateProductionItemField,
    changeItemCategory,
    changeItemModel,
    changeItemParameter,
    setManualItemPricing,
    resetItemPricingToCatalog,
    toggleItemUnlimited,
    toggleItemPrimaryShot,
    usdPerCredit,
    setActiveTab,
  } = useProjectStore();

  /** Kata benda sesuai jenis isi (shot / file / audio file / gambar) */
  const unitNoun = (qt: QuantityType, category?: ProcessCategory) => {
    if (category === 'voice_over') {
      return language === 'id' ? 'file audio' : 'audio files';
    }
    if (language === 'id') {
      return qt === 'shot' ? 'shot' : qt === 'asset' ? 'file' : 'gambar';
    }
    return qt === 'shot' ? 'shots' : qt === 'asset' ? 'files' : 'images';
  };

  /** Nama kolom berbentuk pertanyaan sederhana */
  const quantityQuestion = (qt: QuantityType, category?: ProcessCategory) => {
    if (category === 'voice_over') {
      return language === 'id'
        ? 'Mau Buat Berapa File Audio?'
        : 'How Many Audio Files?';
    }
    return language === 'id'
      ? `Mau Buat Berapa ${qt === 'shot' ? 'Shot' : qt === 'asset' ? 'File' : 'Gambar'}?`
      : `How Many ${qt === 'shot' ? 'Shots' : qt === 'asset' ? 'Files' : 'Images'}?`;
  };

  const tierBadgeClass = (badge?: string) => {
    if (badge === 'NEW')
      return 'vv-badge-emerald';
    if (badge === 'PREMIUM')
      return 'vv-badge-amber';
    if (badge === 'POPULER')
      return 'bg-[#0099ff]/15 text-[#0066cc] dark:text-[#7acaff] border-[#0099ff]/35';
    return '';
  };

  const [activeDepartment, setActiveDepartment] = useState<DepartmentTab>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<
    ProcessCategory | 'all'
  >('all');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showManualPriceSection, setShowManualPriceSection] = useState(false);

  const t = UI_TEXT[language];
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';
  const heroCardClass =
    theme === 'dark' ? 'vv-card-hero-dark' : 'vv-card-hero-light';
  const inputClass =
    theme === 'dark' ? 'glass-input-dark' : 'glass-input-light';
  const { items, calculation, assumptions } = project;

  const isItemPrimaryShot = (item: {
    is_primary_shot?: boolean;
    category: ProcessCategory;
  }): boolean =>
    typeof item.is_primary_shot === 'boolean'
      ? item.is_primary_shot
      : item.category === 'text_to_video' || item.category === 'image_to_video';

  // Durasi bersih footage AI untuk 1 video (hanya menghitung Shot Utama Video yang layak di timeline)
  const cleanDurationSec: number =
    typeof calculation.one_video_duration_seconds === 'number'
      ? calculation.one_video_duration_seconds
      : items.reduce((sum, item) => {
          const isVideoClip =
            item.category === 'text_to_video' ||
            item.category === 'image_to_video' ||
            item.category === 'video_to_video';
          if (isItemPrimaryShot(item) && isVideoClip && item.duration_seconds > 0) {
            return sum + (Number(item.quantity) || 0) * (Number(item.duration_seconds) || 0);
          }
          return sum;
        }, 0);

  // Total durasi untuk multi-video
  const targetVideosCount = Math.max(
    1,
    calculation.target_videos || assumptions.target_videos || 1
  );
  const totalCleanDurationSec = cleanDurationSec * targetVideosCount;

  // Target durasi rencana dari Langkah 2 (dalam detik)
  const targetDurationSec = Math.round(
    (assumptions.final_duration_minutes || 0) * 60
  );
  const durationDiff = cleanDurationSec - targetDurationSec;

  const isCategoryInDepartment = (cat: ProcessCategory, dept: DepartmentTab) => {
    if (dept === 'all') return true;
    if (dept === 'video') return VIDEO_CATEGORIES.includes(cat);
    if (dept === 'stills') return STILLS_CATEGORIES.includes(cat);
    if (dept === 'voiceover') return cat === 'voice_over';
    return false;
  };

  const filteredItems = items
    .map((item, idx) => ({ item, idx, calcRow: calculation.item_results[idx] }))
    .filter(({ item }) => {
      const matchDept = isCategoryInDepartment(item.category, activeDepartment);
      if (!matchDept) return false;
      return (
        selectedCategoryFilter === 'all' ||
        item.category === selectedCategoryFilter
      );
    });

  const activeEditEntry =
    editingItemId !== null
      ? items
          .map((item, idx) => ({
            item,
            idx,
            calcRow: calculation.item_results[idx],
          }))
          .find((entry) => entry.item.item_id === editingItemId) ?? null
      : null;

  const handleAddAndOpenModal = (cat: ProcessCategory = 'text_to_video') => {
    addProductionItem(cat);
    // Open modal for the newly added item at the end of the list
    setTimeout(() => {
      const latestItems = useProjectStore.getState().project.items;
      const newest = latestItems[latestItems.length - 1];
      if (newest) {
        setShowManualPriceSection(false);
        setEditingItemId(newest.item_id);
      }
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* =====================================================================
       * TIER 1: DOMINANT FOCAL POINT — PLANNER HERO & LIVE RUNNING TOTAL
       * ===================================================================== */}
      <div
        className={`${heroCardClass} rounded-[18px] p-6 md:p-7 flex flex-col gap-5`}
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
                    ? (isId
                        ? `Proyeksi 1 Video • Total ${calculation.target_videos} Video (${calculation.total_primary_shots} Shot Total)`
                        : `1 Video Plan • Total ${calculation.target_videos} Videos (${calculation.total_primary_shots} Total Shots)`)
                    : (isId
                        ? 'Proyeksi Video Tunggal (1 Video)'
                        : 'Single Video Plan (1 Video)')}
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
                {calculation.total_credit !== null
                  ? `${calculation.total_credit.toLocaleString()} Credits`
                  : ''}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleAddAndOpenModal('text_to_video')}
              className="vv-btn-accent px-5 py-2.5 text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addStageBtn}</span>
            </button>
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
            onClick={() => setActiveTab('setup')}
            className="text-[11px] font-medium text-[#0099ff] hover:underline shrink-0 whitespace-nowrap self-start md:self-center"
          >
            {isId ? 'Atur target di Langkah 2 →' : 'Edit target in Step 2 →'}
          </button>
        </div>
      </div>

      {/* =====================================================================
       * WORKFLOW DEPARTMENTS: Video, Gambar, Voice Over, Musik, & Semua
       * ===================================================================== */}
      <div className={`${cardClass} rounded-[16px] p-3.5 space-y-3`}>
        {/* Tier 1: Sineas Department Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--vv-border)] pb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              {
                id: 'all' as DepartmentTab,
                label: isId ? 'Semua Tahapan' : 'All Stages',
                icon: Layers,
                count: items.length,
              },
              {
                id: 'video' as DepartmentTab,
                label: isId ? 'Video & Animasi AI' : 'AI Video & Animation',
                icon: Film,
                count: items.filter((i) => VIDEO_CATEGORIES.includes(i.category)).length,
              },
              {
                id: 'stills' as DepartmentTab,
                label: isId ? 'Gambar & Konsep Visual' : 'Images & Visual Stills',
                icon: Sparkles,
                count: items.filter((i) => STILLS_CATEGORIES.includes(i.category)).length,
              },
              {
                id: 'voiceover' as DepartmentTab,
                label: isId ? 'Voice Over & Dialog' : 'Voice Over & Dialogue',
                icon: Mic,
                count: items.filter((i) => i.category === 'voice_over').length,
              },
              {
                id: 'music' as DepartmentTab,
                label: isId ? 'Musik & Soundtrack' : 'Music & Soundtrack',
                icon: Music,
                badgeText: isId ? 'BGM' : 'BGM',
              },
            ].map((dept) => {
              const Icon = dept.icon;
              const isActive = activeDepartment === dept.id;
              return (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => {
                    setActiveDepartment(dept.id);
                    setSelectedCategoryFilter('all');
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#0068ad] text-white shadow-sm'
                      : 'bg-[var(--vv-tint-weak)] text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)] hover:bg-[var(--vv-tint)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{dept.label}</span>
                  {typeof dept.count === 'number' ? (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[var(--vv-field)] text-[var(--vv-text-subtle)]'
                      }`}
                    >
                      {dept.count}
                    </span>
                  ) : dept.badgeText ? (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-sky-500/15 text-sky-400'
                      }`}
                    >
                      {dept.badgeText}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-[var(--vv-text-subtle)] hidden lg:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              {isId ? 'Tersinkronisasi 1 Video' : 'Synced for 1 Video'}
            </span>
          </div>
        </div>

        {/* Tier 2: Category Filter Pills & Quick Add Buttons */}
        {(activeDepartment === 'all' ||
          activeDepartment === 'video' ||
          activeDepartment === 'stills' ||
          activeDepartment === 'voiceover') && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-[#0068ad] text-white'
                    : 'bg-[var(--vv-tint-weak)] text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)]'
                }`}
              >
                {isId ? 'Semua Subkategori' : 'All Subcategories'}
              </button>
              {(activeDepartment === 'video'
                ? VIDEO_CATEGORIES
                : activeDepartment === 'stills'
                ? STILLS_CATEGORIES
                : activeDepartment === 'voiceover'
                ? (['voice_over'] as ProcessCategory[])
                : ALL_CATEGORIES
              ).map((cat) => {
                const count = items.filter((i) => i.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition flex items-center gap-1.5 ${
                      selectedCategoryFilter === cat
                        ? 'bg-[#0068ad] text-white'
                        : 'bg-[var(--vv-tint-weak)] text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)]'
                    }`}
                  >
                    <span>{SHORT_CATEGORY_LABELS[cat][language]}</span>
                    {count > 0 && (
                      <span className="font-mono text-[10px] opacity-80">
                        ({count})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Add by Category */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-[var(--vv-text-subtle)] mr-1 hidden xl:inline">
                {isId ? 'Tambah Cepat:' : 'Quick Add:'}
              </span>
              {(activeDepartment === 'video'
                ? VIDEO_CATEGORIES
                : activeDepartment === 'stills'
                ? STILLS_CATEGORIES
                : activeDepartment === 'voiceover'
                ? (['voice_over'] as ProcessCategory[])
                : ALL_CATEGORIES
              ).map((cat) => (
                <button
                  key={`add_${cat}`}
                  type="button"
                  onClick={() => handleAddAndOpenModal(cat)}
                  className="vv-btn-secondary px-2.5 py-1 text-[11px]"
                  title={`${isId ? 'Tambah' : 'Add'} ${CATEGORY_LABELS[cat][language]}`}
                >
                  <Plus className="w-3 h-3 text-[#0099ff]" />
                  <span>{SHORT_CATEGORY_LABELS[cat][language]}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Voice Over AI Department Guide Panel */}
      {activeDepartment === 'voiceover' && (
        <div className={`${cardClass} rounded-[16px] p-6 space-y-5 border border-sky-500/30 bg-sky-950/10`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-sky-500/20 border border-sky-500/35 flex items-center justify-center text-sky-400 shrink-0">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[var(--vv-text-primary)]">
                    {isId ? 'Departemen Voice Over & Sulih Suara AI' : 'AI Voice Over & Narration Department'}
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30">
                    {isId ? 'Sinkronisasi Audio' : 'Audio Sync'}
                  </span>
                </div>
                <p className="text-xs text-[var(--vv-text-muted)] mt-0.5">
                  {isId
                    ? 'Selaraskan naskah narasi & dialog karakter AI Anda langsung dengan durasi bersih video.'
                    : 'Synchronize your narration scripts & AI character dialogues directly with the clean video duration.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => handleAddAndOpenModal('voice_over')}
                className="vv-btn-accent px-4 py-2 text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {isId
                    ? 'Tambah File Audio (ElevenLabs)'
                    : 'Add Audio File (ElevenLabs)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDepartment('video')}
                className="vv-btn-secondary px-3.5 py-2 text-xs"
              >
                <Film className="w-3.5 h-3.5 text-[#0099ff]" />
                <span>{isId ? 'Kembali ke Shot / Video' : 'Back to Shots / Video'}</span>
              </button>
            </div>
          </div>

          {/* Live Voice Pacing Metric */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="vv-card-quiet p-3.5 rounded-[12px] space-y-1">
              <span className="text-[11px] text-[var(--vv-text-muted)] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>{isId ? 'Durasi Bersih Video' : 'Clean Video Duration'}</span>
              </span>
              <div className="text-lg font-bold text-sky-400 tabular-nums">
                {formatDualDuration(cleanDurationSec, isId)}
              </div>
              <div className="text-[10px] text-[var(--vv-text-subtle)]">
                {isId ? 'Patokan total panjang timeline visual' : 'Visual timeline length reference'}
              </div>
            </div>

            <div className="vv-card-quiet p-3.5 rounded-[12px] space-y-1">
              <span className="text-[11px] text-[var(--vv-text-muted)] flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isId ? 'Estimasi Panjang Naskah' : 'Estimated Script Length'}</span>
              </span>
              <div className="text-lg font-bold text-emerald-400 tabular-nums">
                &plusmn; {cleanDurationSec > 0 ? Math.round((cleanDurationSec / 60) * 135) : 0} {isId ? 'Kata' : 'Words'}
              </div>
              <div className="text-[10px] text-[var(--vv-text-subtle)]">
                {isId ? 'Kecepatan normal sineas (~130-150 kata/menit)' : 'Standard pacing (~130-150 words/min)'}
              </div>
            </div>

            <div className="vv-card-quiet p-3.5 rounded-[12px] space-y-1">
              <span className="text-[11px] text-[var(--vv-text-muted)] flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-amber-400" />
                <span>{isId ? 'Buffer Waktu Jeda / Hening' : 'Pause & Breath Buffer'}</span>
              </span>
              <div className="text-lg font-bold text-amber-400 tabular-nums">
                &plusmn; {cleanDurationSec > 0 ? Math.max(2, Math.round(cleanDurationSec * 0.15)) : 0}s
              </div>
              <div className="text-[10px] text-[var(--vv-text-subtle)]">
                {isId ? 'Ruang jeda antar dialog agar tidak terburu-buru' : 'Breathing room between dialog lines'}
              </div>
            </div>
          </div>

          {/* Tips Sineas AI & Tools Rekomendasi */}
          <div className="p-4 rounded-[12px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border)] space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[var(--vv-text-strong)]">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isId ? 'Panduan Sineas AI: Alur Kerja Voice Over & Lipsync' : 'AI Filmmaker Guide: Voice Over & Lipsync Workflow'}</span>
            </div>
            <p className="text-[var(--vv-text-muted)] leading-relaxed">
              {isId
                ? 'Higgsfield mengoptimalkan proses visual dan gerakan video. Untuk suara narator atau karakter, generate suara melalui tool TTS AI (seperti ElevenLabs, Cartesia, atau OpenAI TTS) sebelum atau sesudah video dibuat. Pastikan total durasi audio tidak melebihi Durasi Bersih video di atas agar ritme adegan selaras.'
                : 'Higgsfield excels at visual generation. For character speech or voiceovers, generate speech using AI TTS tools (such as ElevenLabs, Cartesia, or OpenAI TTS) matching the Clean Duration above so your audio pacing aligns seamlessly.'}
            </p>
          </div>
        </div>
      )}

      {/* Music & Soundtrack AI Department Guide Panel */}
      {activeDepartment === 'music' && (
        <div className={`${cardClass} rounded-[16px] p-6 space-y-5 border border-purple-500/30 bg-purple-950/10`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-500/20 border border-purple-500/35 flex items-center justify-center text-purple-400 shrink-0">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[var(--vv-text-primary)]">
                    {isId ? 'Departemen Musik & Audio Latar (BGM)' : 'Music & Background Audio (BGM) Department'}
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                    {isId ? 'Desain Suara' : 'Sound Design'}
                  </span>
                </div>
                <p className="text-xs text-[var(--vv-text-muted)] mt-0.5">
                  {isId
                    ? 'Atur ritme musik pengiring agar selaras dengan pergantian adegan video AI Anda.'
                    : 'Pace your background soundtrack to match the rhythm of your AI video scene cuts.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveDepartment('video')}
              className="vv-btn-secondary px-3.5 py-2 text-xs shrink-0 self-start sm:self-center"
            >
              <Film className="w-3.5 h-3.5 text-[#0099ff]" />
              <span>{isId ? 'Kembali ke Shot / Video' : 'Back to Shots / Video'}</span>
            </button>
          </div>

          {/* Live Music Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="vv-card-quiet p-3.5 rounded-[12px] space-y-1">
              <span className="text-[11px] text-[var(--vv-text-muted)] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>{isId ? 'Durasi Bersih Video' : 'Clean Video Duration'}</span>
              </span>
              <div className="text-lg font-bold text-purple-400 tabular-nums">
                {formatDualDuration(cleanDurationSec, isId)}
              </div>
              <div className="text-[10px] text-[var(--vv-text-subtle)]">
                {isId ? 'Panjang adegan visual pokok' : 'Core visual scenes length'}
              </div>
            </div>

            <div className="vv-card-quiet p-3.5 rounded-[12px] space-y-1">
              <span className="text-[11px] text-[var(--vv-text-muted)] flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-pink-400" />
                <span>{isId ? 'Durasi Musik Rekomendasi' : 'Recommended Music Track'}</span>
              </span>
              <div className="text-lg font-bold text-pink-400 tabular-nums">
                {cleanDurationSec > 0 ? formatDualDuration(cleanDurationSec + 8, isId) : (isId ? '0 detik' : '0 sec')}
              </div>
              <div className="text-[10px] text-[var(--vv-text-subtle)]">
                {isId ? '+8s buffer untuk fade-out halus' : '+8s buffer for smooth fade-out'}
              </div>
            </div>

            <div className="vv-card-quiet p-3.5 rounded-[12px] space-y-1">
              <span className="text-[11px] text-[var(--vv-text-muted)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isId ? 'Tempo / Mood Ketukan' : 'Recommended Beat Tempo'}</span>
              </span>
              <div className="text-lg font-bold text-amber-400 tabular-nums">
                95 - 120 BPM
              </div>
              <div className="text-[10px] text-[var(--vv-text-subtle)]">
                {isId ? 'Ritme ideal untuk pergantian shot 3-5 detik' : 'Ideal tempo for 3-5s shot cuts'}
              </div>
            </div>
          </div>

          {/* Tips Musik Sineas AI */}
          <div className="p-4 rounded-[12px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border)] space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[var(--vv-text-strong)]">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{isId ? 'Panduan Sineas AI: Sinkronisasi Beat Musik & Shot Cut' : 'AI Filmmaker Guide: Music Beat & Shot Cut Sync'}</span>
            </div>
            <p className="text-[var(--vv-text-muted)] leading-relaxed">
              {isId
                ? 'Buat musik latar menggunakan generator musik AI (seperti Suno AI, Udio, atau Soundraw) berdurasi sekitar ' + formatDualDuration(cleanDurationSec + 8, isId) + '. Potong setiap shot video pada ketukan downbeat musik untuk transisi visual yang dinamis dan berenergi tinggi.'
                : 'Create background music using AI music generators (e.g. Suno AI, Udio, Soundraw) lasting around ' + formatDualDuration(cleanDurationSec + 8, isId) + '. Cut each video shot on music downbeats for high-energy visual flow.'}
            </p>
          </div>
        </div>
      )}

      {/* =====================================================================
       * TIER 2: CLEAN, SCANNABLE SCENE ROW CARDS (No 11-Field Form Overload!)
       * ===================================================================== */}
      {filteredItems.length === 0 ? (
        <div
          className={`${cardClass} rounded-[16px] p-10 text-center space-y-3`}
        >
          <p className="text-sm text-[var(--vv-text-muted)]">
            {isId
              ? 'Belum ada tahap pekerjaan pada kategori ini. Klik tombol di bawah untuk menambahkan shot atau aset AI baru.'
              : 'No production stages in this category yet. Click below to add a new AI shot or asset.'}
          </p>
          <button
            type="button"
            onClick={() => handleAddAndOpenModal('text_to_video')}
            className="vv-btn-primary px-5 py-2.5 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addStageBtn}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map(({ item, idx, calcRow }) => {
            const paramSummary = Object.entries(
              item.model_selection.parameter_values
            )
              .map(([, val]) => String(val))
              .join(' • ');

            return (
              <div
                key={item.item_id}
                className={`${cardClass} rounded-[16px] p-4 sm:p-5 transition hover:border-[#0099ff]/45`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Index + Scene Label + Model & Category Badges */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    <span className="w-9 h-9 rounded-[10px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border-strong)] text-[#0099ff] font-mono font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm sm:text-base font-semibold text-[var(--vv-text-primary)] truncate">
                          {item.label ||
                            (item.category === 'voice_over'
                              ? isId
                                ? 'File Audio Tanpa Nama'
                                : 'Untitled Audio File'
                              : isId
                              ? 'Shot / Gambar Tanpa Nama'
                              : 'Untitled Shot')}
                        </span>
                        {item.category === 'voice_over' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-sky-500/15 text-sky-300 border-sky-500/35 flex items-center gap-1">
                            <span>🎙️</span>
                            <span>{isId ? 'File Audio' : 'Audio File'}</span>
                          </span>
                        ) : (() => {
                          const isPrimary =
                            typeof item.is_primary_shot === 'boolean'
                              ? item.is_primary_shot
                              : (item.category === 'text_to_video' || item.category === 'image_to_video');
                          return (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleItemPrimaryShot(item.item_id);
                              }}
                              title={
                                isId
                                  ? 'Klik untuk berganti status antara Shot Utama vs Aset Pendukung'
                                  : 'Click to toggle between Primary Shot vs Supporting Asset'
                              }
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition flex items-center gap-1 cursor-pointer ${
                                isPrimary
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                                  : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/35 hover:bg-indigo-500/25'
                              }`}
                            >
                              <span>{isPrimary ? '🎬' : '🛠️'}</span>
                              <span>
                                {isPrimary
                                  ? (isId ? 'Shot Utama' : 'Primary Shot')
                                  : (isId ? 'Aset Pendukung' : 'Supporting Asset')}
                              </span>
                            </button>
                          );
                        })()}
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[var(--vv-tint-weak)] border border-[var(--vv-border)] text-[var(--vv-text-muted)]">
                          {SHORT_CATEGORY_LABELS[item.category][language]}
                        </span>
                        {item.is_unlimited ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/35">
                            UNLIMITED &bull; Rp 0
                          </span>
                        ) : (
                          <StatusBadge
                            status={item.pricing.status}
                            language={language}
                          />
                        )}
                        {(() => {
                          const badge = catalog.find(
                            (m) => m.model_id === item.model_selection.model_id
                          )?.tier_badge;
                          return badge && badge !== 'STANDARD' ? (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${tierBadgeClass(
                                badge
                              )}`}
                            >
                              {badge}
                            </span>
                          ) : null;
                        })()}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--vv-text-muted)] mt-1">
                        <strong className="text-[var(--vv-text-strong)] flex items-center gap-1">
                          {item.category === 'voice_over' && (
                            <Mic className="w-3.5 h-3.5 text-sky-400" />
                          )}
                          {item.model_selection.model_name}
                        </strong>

                        {item.category === 'voice_over' ? (
                          <>
                            <span>&bull;</span>
                            <span className="font-mono text-emerald-400 font-semibold">
                              🔤{' '}
                              {item.script_text
                                ? item.script_text.length
                                : item.character_count ||
                                  Math.round(
                                    (item.duration_seconds || 10) * 14.5
                                  )}{' '}
                              {isId ? 'karakter' : 'chars'}
                            </span>
                            <span>&bull;</span>
                            <span className="text-amber-400 font-medium">
                              ⏱️ {item.duration_seconds || 10}s (
                              {item.script_language === 'en'
                                ? '🇬🇧 EN'
                                : '🇮🇩 ID'}
                              )
                            </span>
                            {calcRow?.total_credit !== null && (
                              <>
                                <span>&bull;</span>
                                <span className="text-sky-300 font-semibold">
                                  🎙️ {calcRow.total_credit.toLocaleString()}{' '}
                                  ElevenLabs Cr
                                </span>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {paramSummary && (
                              <>
                                <span>&bull;</span>
                                <span>{paramSummary}</span>
                              </>
                            )}
                            {item.duration_seconds > 0 && (
                              <>
                                <span>&bull;</span>
                                <span>
                                  {item.duration_seconds}{' '}
                                  {isId ? 'detik' : 'sec'}
                                </span>
                                {(() => {
                                  const isPrimary =
                                    typeof item.is_primary_shot === 'boolean'
                                      ? item.is_primary_shot
                                      : item.category === 'text_to_video' ||
                                        item.category === 'image_to_video';
                                  return isPrimary ? (
                                    <span className="text-emerald-400 font-semibold">
                                      (⏱️ +
                                      {item.quantity * item.duration_seconds}s{' '}
                                      {isId
                                        ? 'ke durasi video'
                                        : 'to video length'}
                                      )
                                    </span>
                                  ) : null;
                                })()}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Ringkasan hitungan (hanya dibaca — angka diubah lewat "Atur Detail") */}
                  <div className="flex items-center gap-2 shrink-0">
                    {(() => {
                      const cadanganCount =
                        assumptions.default_attempts_per_shot ||
                        item.attempts_per_item ||
                        1;
                      const itemTotalGenerations =
                        calcRow?.budgeted_generations ??
                        item.quantity * cadanganCount;

                      return (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setShowManualPriceSection(
                                item.pricing.status === 'manual'
                              );
                              setEditingItemId(item.item_id);
                            }}
                            title={
                              isId
                                ? 'Klik untuk mengubah angka di "Atur Detail"'
                                : 'Click to change numbers in "Edit Details"'
                            }
                            className="vv-card-quiet px-3.5 py-2 text-left hover:border-[#0099ff]/45 transition"
                          >
                            <div className="text-xs text-[var(--vv-text-strong)] tabular-nums">
                              <strong>{item.quantity}</strong>{' '}
                              {unitNoun(item.quantity_type, item.category)}{' '}
                              <span className="text-[10px] text-emerald-400 font-medium">
                                ({isId ? '1 video' : '1 video'})
                              </span>{' '}
                              &bull;{' '}
                              <span className="text-[#0099ff] font-semibold">
                                {isId ? 'Total Buat:' : 'Total Tries:'}{' '}
                                {itemTotalGenerations}x
                              </span>
                            </div>
                            <div className="text-[10px] text-[var(--vv-text-subtle)] mt-0.5">
                              {isId
                                ? `(dikalikan ${cadanganCount} cadangan Langkah 2)`
                                : `(multiplied by ${cadanganCount} Step 2 reserve)`}
                              {calculation.target_videos > 1 && (
                                <span className="text-sky-400 font-semibold block mt-0.5">
                                  &bull; {item.quantity * calculation.target_videos}{' '}
                                  {unitNoun(item.quantity_type, item.category)}{' '}
                                  {isId
                                    ? `total (${calculation.target_videos} video)`
                                    : `total (${calculation.target_videos} videos)`}
                                </span>
                              )}
                            </div>
                          </button>
                          <InfoTip align="right" width={270}>
                            {isId ? (
                              <>
                                <strong>Dari mana angka ini?</strong>
                                <br />
                                Kebutuhan: {item.quantity} {unitNoun(item.quantity_type)} (untuk 1 video).
                                <br />
                                Dikalikan Cadangan Langkah 2 ({cadanganCount} cadangan) ={' '}
                                {itemTotalGenerations} kali buat.
                                <br />
                                <span className="text-[#7acaff]">
                                  Untuk mengubah jumlah kebutuhan, klik &ldquo;Atur Detail&rdquo;.
                                </span>
                              </>
                            ) : (
                              <>
                                <strong>Where does this count come from?</strong>
                                <br />
                                Requirement: {item.quantity} {unitNoun(item.quantity_type)} (for 1 video).
                                <br />
                                Multiplied by Step 2 Reserve ({cadanganCount} reserve) ={' '}
                                {itemTotalGenerations} generations.
                                <br />
                                <span className="text-[#7acaff]">
                                  Click &ldquo;Edit Details&rdquo; to change the count.
                                </span>
                              </>
                            )}
                          </InfoTip>
                        </>
                      );
                    })()}
                  </div>

                  {/* Right: Focal Stage Subtotal + Frosted Modal Edit Trigger */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-[var(--vv-border)] shrink-0">
                    <div className="text-left lg:text-right min-w-[125px]">
                      <div className="text-base font-bold tabular-nums text-[#0099ff]">
                        {formatCurrencyIdr(
                          calcRow?.total_cost_idr ?? null,
                          language
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--vv-text-muted)] tabular-nums">
                        {formatCurrencyUsd(
                          calcRow?.total_cost_usd ?? null,
                          language
                        )}
                        {calcRow?.total_credit !== null
                          ? ` • ${calcRow?.total_credit} Credit`
                          : ''}
                        {calculation.target_videos > 1 && (
                          <span className="text-emerald-400 font-semibold block text-[10px]">
                            {isId
                              ? `per 1 video (×${calculation.target_videos} total)`
                              : `per 1 video (×${calculation.target_videos} total)`}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setShowManualPriceSection(
                            item.pricing.status === 'manual'
                          );
                          setEditingItemId(item.item_id);
                        }}
                        className="vv-btn-secondary px-3.5 py-2 text-xs font-medium"
                      >
                        <Sliders className="w-3.5 h-3.5 text-[#0099ff]" />
                        <span>{isId ? 'Atur Detail' : 'Edit Details'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => duplicateProductionItem(item.item_id)}
                        title={t.duplicateBtn}
                        className="p-2 rounded-full bg-[var(--vv-tint-weak)] hover:bg-[var(--vv-tint)] border border-[var(--vv-border)] text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)] transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeProductionItem(item.item_id)}
                        title={t.deleteBtn}
                        className="p-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rekapitulasi Anggaran & Durasi Berjalan (Running Total Breakdown) */}
      {items.length > 0 && (
        <div className="vv-card p-4 sm:p-5 border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-md rounded-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold flex flex-wrap items-center gap-2">
                  <span>
                    {isId
                      ? 'Rekapitulasi Anggaran & Durasi Berjalan'
                      : 'Running Budget & Duration Breakdown'}
                  </span>
                  {calculation.target_videos > 1 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                      {calculation.target_videos} {isId ? 'Video' : 'Videos'}
                    </span>
                  )}
                </div>
                <div className="text-sm text-[var(--vv-text-primary)] font-medium mt-0.5">
                  {calculation.target_videos > 1 ? (
                    <span>
                      {isId ? 'Subtotal 1 Video' : '1 Video Subtotal'} (
                      <strong>
                        {formatCurrencyIdr(
                          calculation.one_video_total_cost_idr,
                          language
                        )}
                      </strong>{' '}
                      /{' '}
                      {formatCurrencyUsd(
                        calculation.one_video_total_cost_usd,
                        language
                      )}
                      ) &times;{' '}
                      <strong>{calculation.target_videos} Video</strong>
                    </span>
                  ) : (
                    <span>
                      {isId
                        ? 'Total Anggaran 1 Video Penuh'
                        : 'Total 1 Video Budget'}
                    </span>
                  )}
                </div>

                {/* Duration & Shot Chips */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>
                      {isId ? 'Durasi Bersih 1 Video:' : 'Clean Duration (1 Video):'}{' '}
                      <strong className="text-sky-200">
                        {formatDualDuration(cleanDurationSec, isId)}
                      </strong>
                    </span>
                  </span>

                  {calculation.target_videos > 1 && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-indigo-400" />
                      <span>
                        {isId
                          ? `Total Durasi ${calculation.target_videos} Video:`
                          : `Total Duration (${calculation.target_videos} Videos):`}{' '}
                        <strong className="text-indigo-200">
                          {formatDualDuration(totalCleanDurationSec, isId)}
                        </strong>
                      </span>
                    </span>
                  )}

                  <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--vv-tint-weak)] text-[var(--vv-text-muted)] border border-[var(--vv-border)] flex items-center gap-1">
                    <span>🎬</span>
                    <span>
                      {calculation.one_video_primary_shot_count}{' '}
                      {isId ? 'Shot Utama' : 'Primary Shots'}
                      {calculation.target_videos > 1 &&
                        ` (${calculation.total_primary_shots} total)`}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left md:text-right shrink-0">
              <div className="text-xs text-[var(--vv-text-muted)]">
                {calculation.target_videos > 1
                  ? isId
                    ? `Total Anggaran (${calculation.target_videos} Video)`
                    : `Grand Total Budget (${calculation.target_videos} Videos)`
                  : isId
                  ? 'Total Anggaran Seluruh Video'
                  : 'Grand Total Budget'}
              </div>
              <div className="text-xl sm:text-2xl font-black tabular-nums text-emerald-400">
                {formatCurrencyIdr(calculation.total_cost_idr, language)}
              </div>
              <div className="text-xs text-[var(--vv-text-muted)] tabular-nums">
                {formatCurrencyUsd(calculation.total_cost_usd, language)}
                {calculation.total_credit !== null
                  ? ` • ${calculation.total_credit.toLocaleString()} Credits`
                  : ''}
                {' '}&bull; {calculation.budgeted_generations}{' '}
                {isId ? 'kali coba' : 'runs'}
              </div>
            </div>
          </div>

          {/* Sineas UX Message: Buffer Editing & Potongan Post-Produksi */}
          <div className="pt-3 border-t border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-start sm:items-center gap-2 text-[var(--vv-text-muted)] leading-relaxed">
              <Scissors className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
              <span>
                {targetDurationSec > 0
                  ? isId
                    ? `Komparasi Sineas: Footage AI (${cleanDurationSec}s) vs Target Rencana (${targetDurationSec}s). Kelebihan durasi ${
                        durationDiff > 0 ? `(+${durationDiff}s)` : '(0s)'
                      } adalah hal wajar karena akan dipotong & diselaraskan oleh editor di post-produksi agar ritme video pas.`
                    : `Filmmaker Comparison: AI Footage (${cleanDurationSec}s) vs Target (${targetDurationSec}s). Excess duration ${
                        durationDiff > 0 ? `(+${durationDiff}s)` : '(0s)'
                      } is normal and intended to be trimmed by editors in post-production for optimal pacing.`
                  : isId
                  ? `Footage AI memproyeksikan ${formatDualDuration(
                      cleanDurationSec,
                      isId
                    )} per video. Seluruh klip dapat dipotong dan disesuaikan oleh editor pada tahap pasca-produksi.`
                  : `AI footage projects ${formatDualDuration(
                      cleanDurationSec,
                      isId
                    )} per video. Clips can be trimmed and adjusted by editors in post-production.`}
              </span>
            </div>

            {targetDurationSec > 0 && durationDiff > 0 && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold shrink-0 self-start sm:self-center">
                +{durationDiff}s buffer editing
              </span>
            )}
          </div>
        </div>
      )}

      {/* Guided Step Flow Footer */}
      <StepFlowBar
        currentStepNumber={3}
        stepTitle={t.navPlanner}
        nextStepHint={
          isId
            ? 'Langkah selanjutnya: Periksa rekapitulasi anggaran lengkap (USD & Rupiah) sebelum mencetak laporan PDF.'
            : 'Next step: Review the complete budget summary (USD & IDR) before exporting your PDF report.'
        }
        prevTab="setup"
        prevLabel={t.navSetup}
        nextTab="summary"
        nextLabel={
          isId
            ? 'Lanjut ke Langkah 4: Ringkasan Biaya'
            : 'Continue to Step 4: Cost Summary'
        }
      />

      {/* =====================================================================
       * FROSTED GLASS MODAL: Pengaturan Lengkap Shot / Tahap AI
       * Progressive Disclosure: Houses all 11 fields cleanly inside a modal
       * ===================================================================== */}
      {activeEditEntry &&
        (() => {
          const { item, idx, calcRow } = activeEditEntry;
          const availableModels = getModelsByCategory(item.category, catalog);
          const selectedModel =
            catalog.find((m) => m.model_id === item.model_selection.model_id) ||
            availableModels[0];

          return (
            <FrostedModal
              isOpen={true}
              onClose={() => setEditingItemId(null)}
              theme={theme}
              maxWidth="2xl"
              badgeLabel={
                item.category === 'voice_over'
                  ? `${isId ? 'File Audio' : 'Audio File'} #${String(
                      idx + 1
                    ).padStart(2, '0')}`
                  : `${isId ? 'Tahap Shot / Gambar' : 'Production Stage'} #${String(
                      idx + 1
                    ).padStart(2, '0')}`
              }
              title={
                item.category === 'voice_over' ? (
                  isId ? (
                    <>
                      Atur Detail File Audio &{' '}
                      <span className="vv-accent text-sky-400">
                        Model AI ElevenLabs
                      </span>
                    </>
                  ) : (
                    <>
                      Configure Audio File &{' '}
                      <span className="vv-accent text-sky-400">
                        ElevenLabs AI Model
                      </span>
                    </>
                  )
                ) : isId ? (
                  <>
                    Atur Detail Shot / Gambar &{' '}
                    <span className="vv-accent text-[#0099ff]">
                      Model AI Higgsfield
                    </span>
                  </>
                ) : (
                  <>
                    Configure Shot &{' '}
                    <span className="vv-accent text-[#0099ff]">
                      Higgsfield AI Model
                    </span>
                  </>
                )
              }
              subtitle={
                isId
                  ? 'Semua perubahan yang Anda pilih langsung dihitung secara otomatis pada total anggaran di bawah.'
                  : 'Every change you make is automatically calculated in the live stage total below.'
              }
              footer={
                <>
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[var(--vv-text-muted)]">
                        {isId
                          ? 'Subtotal Tahap Ini (Termasuk Cadangan)'
                          : 'Stage Subtotal (Incl. Reserve)'}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold tabular-nums text-[#0099ff]">
                          {formatCurrencyIdr(
                            calcRow?.total_cost_idr ?? null,
                            language
                          )}
                        </span>
                        <span className="text-xs font-semibold tabular-nums text-[var(--vv-text-strong)]">
                          (
                          {formatCurrencyUsd(
                            calcRow?.total_cost_usd ?? null,
                            language
                          )}
                          )
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditingItemId(null)}
                    className="vv-btn-primary px-6 py-2.5 text-xs font-semibold"
                  >
                    <span>
                      {item.category === 'voice_over'
                        ? (isId ? 'Selesai & Simpan File Audio' : 'Done & Save Audio File')
                        : (isId ? 'Selesai & Simpan Shot' : 'Done & Save Shot')}
                    </span>
                  </button>
                </>
              }
            >
              <div className="space-y-5 text-xs">
                {/* 1. Nama Shot & Jenis Pembuatan AI */}
                <div className="vv-card-quiet p-4 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--vv-text-strong)] mb-1.5">
                      {item.category === 'voice_over'
                        ? (isId
                            ? '1. Nama File Audio / Dialog'
                            : '1. Audio File / Dialogue Name')
                        : (isId
                            ? '1. Nama Shot / Tahap Pekerjaan'
                            : '1. Shot / Production Stage Name')}
                    </label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) =>
                        updateProductionItemField(item.item_id, {
                          label: e.target.value,
                        })
                      }
                      className={`${inputClass} w-full px-3.5 py-2.5 rounded-[10px] text-sm font-semibold`}
                    />
                  </div>

                  {/* Klasifikasi Peran Item: Shot Utama vs Aset Pendukung */}
                  {item.category === 'voice_over' ? (
                    <div className="p-3 rounded-[10px] bg-sky-500/10 border border-sky-500/25 text-sky-300 text-xs flex items-center gap-2.5">
                      <span className="text-base">🎙️</span>
                      <span className="leading-relaxed">
                        {isId
                          ? 'Item ini adalah file audio / naskah sulih suara ElevenLabs. File audio berdiri sebagai layer suara tersendiri dan tidak dihitung sebagai shot kamera video pokok.'
                          : 'This item is an ElevenLabs voiceover / dialogue audio file. Audio files reside on a dedicated audio track and are not counted as camera video shots.'}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-[var(--vv-text-strong)] mb-1.5">
                        {isId ? 'Peran Item dalam Video' : 'Item Role in Video'}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateProductionItemField(item.item_id, {
                              is_primary_shot: true,
                            })
                          }
                          className={`py-2 px-3 rounded-[9px] text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                            (item.is_primary_shot ??
                              (item.category === 'text_to_video' ||
                                item.category === 'image_to_video'))
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                              : 'bg-[var(--vv-field)] text-[var(--vv-text-muted)] border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
                          }`}
                        >
                          <span>🎬</span>
                          <span>{isId ? 'Shot Utama Cerita' : 'Primary Story Shot'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateProductionItemField(item.item_id, {
                              is_primary_shot: false,
                            })
                          }
                          className={`py-2 px-3 rounded-[9px] text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                            !(item.is_primary_shot ??
                              (item.category === 'text_to_video' ||
                                item.category === 'image_to_video'))
                              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                              : 'bg-[var(--vv-field)] text-[var(--vv-text-muted)] border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
                          }`}
                        >
                          <span>🛠️</span>
                          <span>{isId ? 'Aset Pendukung' : 'Supporting Asset'}</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-[var(--vv-text-muted)] mt-1.5 leading-relaxed">
                        {isId
                          ? 'Shot Utama dihitung sebagai potongan visual pokok video (storyboard). Aset Pendukung (seperti Upscale/Konsep) tetap dihitung biayanya tetapi tidak menambah jumlah shot video.'
                          : 'Primary Shots count toward your storyboard visual shot count. Supporting Assets (like Upscale/Concept art) are budgeted but do not inflate shot count.'}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-[var(--vv-text-strong)] mb-1.5">
                      {isId
                        ? '2. Pilih Jenis Pembuatan AI'
                        : '2. Select AI Creation Type'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {ALL_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => changeItemCategory(item.item_id, cat)}
                          className={`py-2 px-3 rounded-[9px] text-xs font-medium border text-left transition ${
                            item.category === cat
                              ? 'bg-[#0068ad] text-white border-[#7acaff]/40'
                              : 'bg-[var(--vv-field)] text-[var(--vv-text-muted)] border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
                          }`}
                        >
                          {SHORT_CATEGORY_LABELS[cat][language]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Model AI Higgsfield & Pengaturan Kualitas */}
                <div className="vv-card-quiet p-4 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--vv-text-strong)] mb-1.5">
                      {item.category === 'voice_over'
                        ? isId
                          ? '3. Pilih Model Suara Resmi ElevenLabs'
                          : '3. Select Official ElevenLabs Voice Model'
                        : isId
                        ? '3. Pilih Model AI Higgsfield'
                        : '3. Select Higgsfield AI Model'}
                    </label>
                    <select
                      value={item.model_selection.model_id}
                      onChange={(e) =>
                        changeItemModel(item.item_id, e.target.value)
                      }
                      className={`${inputClass} w-full px-3.5 py-2.5 rounded-[10px] text-xs font-semibold`}
                    >
                      {availableModels.map((m) => {
                        const v = m.pricing_variants[0];
                        const badge =
                          m.tier_badge && m.tier_badge !== 'STANDARD'
                            ? `[${m.tier_badge}] `
                            : '';
                        const idr =
                          v?.price_value && project.exchange_rate.rate
                            ? formatCurrencyIdr(
                                v.price_value * project.exchange_rate.rate,
                                language
                              )
                            : '';
                        const priceText =
                          v?.credit_cost !== null && v?.credit_cost !== undefined
                            ? ` — ${v.credit_cost} Credit${idr ? ` • ${idr}` : ''}`
                            : '';
                        return (
                          <option key={m.model_id} value={m.model_id}>
                            {badge}
                            {m.model_name} ({m.family}){priceText}
                          </option>
                        );
                      })}
                    </select>
                    {selectedModel && (
                      <p className="text-[11px] text-[var(--vv-text-muted)] mt-1.5 leading-relaxed">
                        {isId
                          ? selectedModel.description_id
                          : selectedModel.description_en}
                      </p>
                    )}
                  </div>

                  {/* Dynamic Quality Parameters */}
                  {selectedModel && selectedModel.parameters.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--vv-border)]">
                      {selectedModel.parameters.map((param) => {
                        const currentVal =
                          item.model_selection.parameter_values[param.key] ??
                          param.defaultValue;
                        return (
                          <div key={param.key}>
                            <label className="block text-[11px] font-medium text-[var(--vv-text-muted)] mb-1">
                              {isId ? param.label_id : param.label_en}
                            </label>
                            {param.options ? (
                              <select
                                value={String(currentVal)}
                                onChange={(e) =>
                                  changeItemParameter(
                                    item.item_id,
                                    param.key,
                                    e.target.value
                                  )
                                }
                                className={`${inputClass} w-full px-3 py-2 rounded-[9px] text-xs font-medium`}
                              >
                                {param.options.map((opt) => (
                                  <option
                                    key={String(opt.value)}
                                    value={String(opt.value)}
                                  >
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={String(currentVal)}
                                onChange={(e) =>
                                  changeItemParameter(
                                    item.item_id,
                                    param.key,
                                    e.target.value
                                  )
                                }
                                className={`${inputClass} w-full px-3 py-2 rounded-[9px] text-xs`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 3. Kuantitas, Naskah Voice Over atau Durasi Detik */}
                {(() => {
                  if (item.category === 'voice_over') {
                    const speedPreset = String(
                      item.model_selection.parameter_values?.speed_preset ||
                        'normal'
                    );
                    const cadanganCount = Math.max(
                      1,
                      assumptions.default_attempts_per_shot ||
                        item.attempts_per_item ||
                        1
                    );
                    const budgetedGen =
                      calcRow?.budgeted_generations ??
                      (Number(item.quantity) || 0) * cadanganCount;

                    return (
                      <div className="vv-card-quiet p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-semibold text-[var(--vv-text-strong)] flex items-center gap-1.5">
                            <Mic className="w-4 h-4 text-sky-400" />
                            <span>
                              {isId
                                ? '4. Kuantitas File Audio, Naskah Dialog & Durasi (Dwi-Input Sineas)'
                                : '4. Audio File Quantity, Script & Duration Settings (Dual-Input)'}
                            </span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/30">
                            ElevenLabs Official
                          </span>
                        </div>

                        {/* Jumlah File Audio & Pengali Cadangan Langkah 2 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-[10px] bg-[var(--vv-surface-soft)] border border-[var(--vv-border)]">
                          <div>
                            <label className="block text-[11px] font-semibold text-[var(--vv-text-strong)] mb-1 flex items-center gap-1">
                              <span>
                                {isId
                                  ? 'Mau Buat Berapa File Audio?'
                                  : 'How Many Audio Files?'}
                              </span>
                              <InfoTip>
                                {isId
                                  ? 'Jumlah segmen atau file rekaman suara yang ingin dibuat pada tahap ini (misal: 1 narasi utuh, atau 3 potongan dialog terpisah).'
                                  : 'Number of voice recording segments or audio files to generate in this stage.'}
                              </InfoTip>
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min={1}
                                step={1}
                                value={item.quantity}
                                onChange={(e) =>
                                  updateProductionItemField(item.item_id, {
                                    quantity: Math.max(
                                      0,
                                      Math.floor(Number(e.target.value) || 0)
                                    ),
                                  })
                                }
                                className={`${inputClass} w-28 px-3 py-1.5 rounded-[9px] text-xs font-bold tabular-nums text-right`}
                              />
                              <span className="text-xs font-semibold text-[var(--vv-text-muted)]">
                                {isId ? 'file audio' : 'audio files'}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col justify-center sm:items-end text-[11px] text-[var(--vv-text-muted)]">
                            <span>
                              {isId
                                ? 'Total Rencana Generate (Termasuk Cadangan Langkah 2):'
                                : 'Total Planned Generations (Incl. Step 2 Reserve):'}
                            </span>
                            <span className="text-xs font-bold text-sky-300 font-mono mt-0.5">
                              {item.quantity}{' '}
                              {isId ? 'file audio' : 'audio files'} &times;{' '}
                              {cadanganCount}{' '}
                              {isId ? 'cadangan' : 'reserve'} = {budgetedGen}x{' '}
                              {isId ? 'buat' : 'generations'}
                            </span>
                          </div>
                        </div>

                        {/* Pilihan Bahasa Naskah */}
                        <div>
                          <label className="block text-[11px] font-semibold text-[var(--vv-text-muted)] mb-1.5">
                            {isId
                              ? 'Bahasa Naskah Suara'
                              : 'Voice Script Language'}
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const nextLang = 'id';
                                const curDur = item.duration_seconds || 10;
                                const newChars =
                                  item.script_text &&
                                  item.script_text.trim().length > 0
                                    ? item.script_text.length
                                    : convertDurationToCharacters(
                                        curDur,
                                        nextLang,
                                        speedPreset
                                      );
                                updateProductionItemField(item.item_id, {
                                  script_language: nextLang,
                                  character_count: newChars,
                                });
                              }}
                              className={`py-2 px-3 rounded-[9px] text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                                (item.script_language ?? 'id') === 'id'
                                  ? 'bg-[#0068ad] text-white border-[#7acaff]/40'
                                  : 'bg-[var(--vv-field)] text-[var(--vv-text-muted)] border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
                              }`}
                            >
                              <span>🇮🇩</span>
                              <span>Bahasa Indonesia (~14.5 char/s)</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const nextLang = 'en';
                                const curDur = item.duration_seconds || 10;
                                const newChars =
                                  item.script_text &&
                                  item.script_text.trim().length > 0
                                    ? item.script_text.length
                                    : convertDurationToCharacters(
                                        curDur,
                                        nextLang,
                                        speedPreset
                                      );
                                updateProductionItemField(item.item_id, {
                                  script_language: nextLang,
                                  character_count: newChars,
                                });
                              }}
                              className={`py-2 px-3 rounded-[9px] text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                                item.script_language === 'en'
                                  ? 'bg-[#0068ad] text-white border-[#7acaff]/40'
                                  : 'bg-[var(--vv-field)] text-[var(--vv-text-muted)] border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
                              }`}
                            >
                              <span>🇬🇧</span>
                              <span>English (~16.5 char/s)</span>
                            </button>
                          </div>
                        </div>

                        {/* Area Naskah Narasi / Skrip */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[11px] font-semibold text-[var(--vv-text-strong)] flex items-center gap-1">
                              <span>
                                {isId
                                  ? 'Teks Naskah Narasi / Dialog (Per 1 File Audio)'
                                  : 'Narration / Dialogue Script (Per 1 Audio File)'}
                              </span>
                              <InfoTip>
                                {isId
                                  ? 'Tulis atau tempel teks yang akan disulihsuarakan oleh AI ElevenLabs. Jumlah karakter dan estimasi durasi bicara dihitung secara langsung.'
                                  : 'Type or paste the narration script to be generated by ElevenLabs AI. Characters and speech duration are calculated in real time.'}
                              </InfoTip>
                            </label>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--vv-text-muted)]">
                              <span className="text-emerald-400 font-bold">
                                {item.script_text ? item.script_text.length : 0}{' '}
                                {isId ? 'Karakter' : 'Characters'}
                              </span>
                              <span>&bull;</span>
                              <span>
                                {item.script_text
                                  ? item.script_text
                                      .trim()
                                      .split(/\s+/)
                                      .filter(Boolean).length
                                  : 0}{' '}
                                {isId ? 'Kata' : 'Words'}
                              </span>
                            </div>
                          </div>

                          <textarea
                            rows={4}
                            value={item.script_text || ''}
                            placeholder={
                              isId
                                ? 'Tempel atau ketik naskah voice over Anda di sini (contoh: "Selamat datang di masa depan pembuatan video bersama AI...")...'
                                : 'Paste or type your voice over script here (e.g. "Welcome to the future of AI video production...")...'
                            }
                            onChange={(e) => {
                              const text = e.target.value;
                              const hasText = text.trim().length > 0;
                              const curLang = item.script_language ?? 'id';
                              const chars = hasText
                                ? text.length
                                : convertDurationToCharacters(
                                    item.duration_seconds || 10,
                                    curLang,
                                    speedPreset
                                  );
                              const estimatedDuration = hasText
                                ? convertCharactersToDuration(
                                    chars,
                                    curLang,
                                    speedPreset
                                  )
                                : item.duration_seconds || 10;
                              updateProductionItemField(item.item_id, {
                                script_text: text,
                                character_count: chars,
                                duration_seconds: estimatedDuration,
                              });
                            }}
                            className={`${inputClass} w-full p-3 rounded-[10px] text-xs font-mono leading-relaxed resize-y`}
                          />
                        </div>

                        {/* Durasi Detik Bicara & Preset Cepat */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[11px] font-semibold text-[var(--vv-text-strong)] flex items-center gap-1">
                              <span>
                                {isId
                                  ? 'Durasi Bicara per File Audio (Detik)'
                                  : 'Spoken Duration per Audio File (Seconds)'}
                              </span>
                              <InfoTip align="right">
                                {isId
                                  ? 'Jika belum ada naskah jadi, Anda bisa menentukan durasi bicara target terlebih dahulu. Sistem akan menghitung batas karakter yang pas.'
                                  : 'If you do not have a script yet, set the target spoken duration first. The system projects the corresponding character limit.'}
                              </InfoTip>
                            </label>
                            <span className="text-[11px] font-mono font-bold text-sky-400">
                              ⏱️ {item.duration_seconds || 0}s (
                              {formatDualDuration(
                                item.duration_seconds || 0,
                                isId
                              )}
                              )
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="number"
                              min={1}
                              max={600}
                              step={1}
                              value={item.duration_seconds || 0}
                              onChange={(e) => {
                                const secs = Math.max(
                                  0,
                                  Number(e.target.value) || 0
                                );
                                const curLang = item.script_language ?? 'id';
                                const projectedChars =
                                  !item.script_text ||
                                  item.script_text.trim().length === 0
                                    ? convertDurationToCharacters(
                                        secs,
                                        curLang,
                                        speedPreset
                                      )
                                    : item.script_text.length;
                                updateProductionItemField(item.item_id, {
                                  duration_seconds: secs,
                                  character_count: projectedChars,
                                });
                              }}
                              className={`${inputClass} w-28 px-3.5 py-2 rounded-[9px] text-xs font-bold tabular-nums text-right`}
                            />

                            {/* Preset durasi cepat */}
                            {[5, 10, 15, 30, 60].map((presetSec) => (
                              <button
                                key={presetSec}
                                type="button"
                                onClick={() => {
                                  const curLang = item.script_language ?? 'id';
                                  const projectedChars =
                                    !item.script_text ||
                                    item.script_text.trim().length === 0
                                      ? convertDurationToCharacters(
                                          presetSec,
                                          curLang,
                                          speedPreset
                                        )
                                      : item.script_text.length;
                                  updateProductionItemField(item.item_id, {
                                    duration_seconds: presetSec,
                                    character_count: projectedChars,
                                  });
                                }}
                                className={`px-2 py-1 rounded-[7px] text-[11px] font-mono font-semibold transition ${
                                  item.duration_seconds === presetSec
                                    ? 'bg-sky-500/25 text-sky-300 border border-sky-500/40'
                                    : 'bg-[var(--vv-field)] text-[var(--vv-text-muted)] border border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
                                }`}
                              >
                                {presetSec}s
                              </button>
                            ))}

                            {/* Tombol sinkronisasi dengan durasi video */}
                            {(cleanDurationSec > 0 || targetDurationSec > 0) && (
                              <button
                                type="button"
                                onClick={() => {
                                  const syncSec =
                                    cleanDurationSec > 0
                                      ? Math.round(cleanDurationSec)
                                      : targetDurationSec;
                                  const curLang = item.script_language ?? 'id';
                                  const projectedChars =
                                    !item.script_text ||
                                    item.script_text.trim().length === 0
                                      ? convertDurationToCharacters(
                                          syncSec,
                                          curLang,
                                          speedPreset
                                        )
                                      : item.script_text.length;
                                  updateProductionItemField(item.item_id, {
                                    duration_seconds: syncSec,
                                    character_count: projectedChars,
                                  });
                                }}
                                className="px-2.5 py-1 rounded-[7px] text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 hover:bg-emerald-500/25 transition flex items-center gap-1"
                              >
                                <span>🎯</span>
                                <span>
                                  {isId
                                    ? `Samakan dgn Video (${Math.round(
                                        cleanDurationSec || targetDurationSec
                                      )}s)`
                                    : `Sync with Video (${Math.round(
                                        cleanDurationSec || targetDurationSec
                                      )}s)`}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Live ElevenLabs Calculation Summary Card */}
                        {(() => {
                          const curChars =
                            item.script_text &&
                            item.script_text.trim().length > 0
                              ? item.script_text.length
                              : item.character_count ||
                                convertDurationToCharacters(
                                  item.duration_seconds || 10,
                                  item.script_language ?? 'id',
                                  speedPreset
                                );
                          const modelInfo =
                            ELEVENLABS_MODELS_CATALOG.find(
                              (m) => m.model_id === item.model_selection.model_id
                            ) || ELEVENLABS_MODELS_CATALOG[0];
                          const multiplier =
                            modelInfo.credit_multiplier_per_character;
                          const creditsPerGen = calculateElevenLabsCredits(
                            curChars,
                            modelInfo.model_id
                          );
                          const totalCr =
                            calcRow?.total_credit ??
                            creditsPerGen * budgetedGen;
                          const activePlan = getElevenLabsPlanById(
                            (assumptions.elevenlabs_plan_id as any) || 'starter'
                          );
                          const costUsd =
                            calcRow?.total_cost_usd ??
                            calculateElevenLabsCostUsd(
                              totalCr,
                              activePlan.plan_id
                            );
                          const costIdr =
                            calcRow?.total_cost_idr ??
                            (project.exchange_rate.rate
                              ? calculateElevenLabsCostIdr(
                                  totalCr,
                                  activePlan.plan_id,
                                  project.exchange_rate.rate
                                )
                              : null);

                          return (
                            <div className="p-3.5 rounded-[12px] bg-sky-950/20 border border-sky-500/30 space-y-2">
                              <div className="flex items-center justify-between text-[11px] text-[var(--vv-text-muted)]">
                                <span>
                                  {isId
                                    ? 'Model Suara ElevenLabs:'
                                    : 'ElevenLabs Voice Model:'}
                                </span>
                                <span className="font-semibold text-sky-300">
                                  {modelInfo.model_name} ({multiplier}x Credit •{' '}
                                  {modelInfo.latency_description})
                                </span>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-sky-500/20">
                                <div>
                                  <span className="text-[10px] text-[var(--vv-text-subtle)] block">
                                    {isId
                                      ? 'Karakter per File Audio'
                                      : 'Characters per Audio File'}
                                  </span>
                                  <span className="text-sm font-bold font-mono text-[var(--vv-text-primary)]">
                                    {curChars.toLocaleString()}
                                  </span>
                                  <span className="text-[10px] text-[var(--vv-text-muted)] block font-mono">
                                    {creditsPerGen.toLocaleString()} Cr / file
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-[var(--vv-text-subtle)] block">
                                    {isId
                                      ? `Total Credit (${budgetedGen}x buat)`
                                      : `Total Credits (${budgetedGen}x gen)`}
                                  </span>
                                  <span className="text-sm font-bold font-mono text-sky-400">
                                    {totalCr.toLocaleString()} Cr
                                  </span>
                                  <span className="text-[10px] text-[var(--vv-text-muted)] block font-mono">
                                    {item.quantity} file &times; {cadanganCount}{' '}
                                    {isId ? 'cadangan' : 'reserve'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-[var(--vv-text-subtle)] block">
                                    {isId
                                      ? `Subtotal Tahap (${activePlan.name_id.split(' ')[1]})`
                                      : `Stage Subtotal (${activePlan.name_en.split(' ')[0]})`}
                                  </span>
                                  <span className="text-sm font-bold tabular-nums text-emerald-400">
                                    {costIdr !== null
                                      ? formatCurrencyIdr(costIdr, language)
                                      : formatCurrencyUsd(costUsd, language)}
                                  </span>
                                  <span className="text-[10px] text-[var(--vv-text-muted)] block font-mono">
                                    {formatCurrencyUsd(costUsd, language)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  }

              const noun = unitNoun(item.quantity_type, item.category);
              const isPerSecond = item.pricing.pricing_unit === 'per_second';
              const showDuration =
                !!selectedModel?.supports_duration || isPerSecond;
              const fxRate = project.exchange_rate.rate;
              const unitUsd = item.pricing.price_value;
              const unitCredit = item.pricing.credit_cost;
              const unitIdr =
                unitUsd !== null && fxRate ? unitUsd * fxRate : null;
              const budgeted = calcRow?.budgeted_generations ?? 0;
              const unitLabel =
                PRICING_UNIT_LABELS[item.pricing.pricing_unit][language];
              const unitPriceText = [
                unitCredit !== null ? `${unitCredit} Credit` : null,
                unitIdr !== null
                  ? formatCurrencyIdr(unitIdr, language)
                  : unitUsd !== null
                  ? formatCurrencyUsd(unitUsd, language)
                  : null,
              ]
                .filter(Boolean)
                .join(' • ');

              return (
                <div className="vv-card-quiet p-4 space-y-4">
                      <div className="text-xs font-semibold text-[var(--vv-text-strong)]">
                        {isId
                          ? '4. Berapa Banyak yang Ingin Dibuat?'
                          : '4. How Much Do You Want to Make?'}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Kolom 1: Mau buat berapa */}
                        <div>
                          <label className="flex items-center gap-1 text-[11px] text-[var(--vv-text-muted)] mb-1">
                            <span>{quantityQuestion(item.quantity_type, item.category)}</span>
                            <InfoTip>
                              {isId
                                ? `Jumlah ${noun} jadi yang Anda butuhkan untuk tahap ini. Contoh: butuh 2 ${noun}, isi 2.`
                                : `The number of finished ${noun} you need for this stage. Example: need 2 ${noun}, enter 2.`}
                            </InfoTip>
                          </label>
                          <input
                            type="number"
                            min={1}
                            step={1}
                            value={item.quantity}
                            onChange={(e) => {
                              const cadanganMultiplier =
                                assumptions.default_attempts_per_shot ||
                                item.attempts_per_item ||
                                1;
                              updateProductionItemField(item.item_id, {
                                quantity: Math.max(
                                  1,
                                  Math.floor(Number(e.target.value) || 1)
                                ),
                                attempts_per_item: cadanganMultiplier,
                              });
                            }}
                            className={`${inputClass} w-full px-3.5 py-2.5 rounded-[10px] text-sm font-bold tabular-nums text-right`}
                          />
                        </div>

                        {/* Kolom 2: Durasi (jika ada) atau info cara tagih */}
                        {showDuration ? (
                          <div>
                            <label className="flex items-center gap-1 text-[11px] text-[var(--vv-text-muted)] mb-1">
                              <span>
                                {isId
                                  ? 'Panjang Tiap Shot (Detik)'
                                  : 'Length of Each Shot (Seconds)'}
                              </span>
                              <InfoTip align="right">
                                {isPerSecond
                                  ? isId
                                    ? 'Berapa detik panjang satu klip video yang dibuat AI. Model ini ditagih per detik, jadi makin panjang makin mahal.'
                                    : 'How many seconds each AI video clip lasts. This model charges per second, so longer clips cost more.'
                                  : isId
                                  ? 'Berapa detik panjang satu klip video. Untuk model ini, panjang klip tidak mengubah harga karena ditagih per kali buat.'
                                  : 'How many seconds each clip lasts. For this model, length does not change the price because it charges per generation.'}
                              </InfoTip>
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={60}
                              step={1}
                              value={item.duration_seconds}
                              onChange={(e) =>
                                updateProductionItemField(item.item_id, {
                                  duration_seconds: Math.max(
                                    0,
                                    Number(e.target.value) || 0
                                  ),
                                })
                              }
                              className={`${inputClass} w-full px-3.5 py-2.5 rounded-[10px] text-sm font-bold tabular-nums text-right`}
                            />
                            <span className="block text-[10px] text-[var(--vv-text-muted)] mt-1 text-right">
                              {isPerSecond
                                ? isId
                                  ? `Ditagih per detik video${unitPriceText ? ` • ${unitPriceText} per detik` : ''}`
                                  : `Charged per video second${unitPriceText ? ` • ${unitPriceText} per second` : ''}`
                                : isId
                                ? `Ditagih per kali buat${unitPriceText ? ` • ${unitPriceText}` : ''}`
                                : `Charged per generation${unitPriceText ? ` • ${unitPriceText}` : ''}`}
                            </span>
                            {(() => {
                              const isPrimary =
                                typeof item.is_primary_shot === 'boolean'
                                  ? item.is_primary_shot
                                  : (item.category === 'text_to_video' ||
                                      item.category === 'image_to_video');
                              return isPrimary ? (
                                <span className="block text-[10px] text-emerald-400 font-semibold mt-1 text-right">
                                  ⏱️{' '}
                                  {isId
                                    ? `Berkontribusi +${item.quantity * item.duration_seconds}s ke Durasi Bersih 1 video`
                                    : `Contributes +${item.quantity * item.duration_seconds}s to 1-video Clean Duration`}
                                </span>
                              ) : (
                                <span className="block text-[10px] text-indigo-300 font-medium mt-1 text-right">
                                  🛠️{' '}
                                  {isId
                                    ? 'Aset Pendukung tidak menambah Durasi Bersih'
                                    : 'Supporting asset does not add to Clean Duration'}
                                </span>
                              );
                            })()}
                          </div>
                        ) : (
                          <div className="flex flex-col justify-center gap-1.5 pt-1 sm:pt-4">
                            <div className="flex items-center gap-1.5 text-xs text-[var(--vv-text-muted)]">
                              <Info className="w-4 h-4 text-[#0099ff] shrink-0" />
                              <span>
                                {isId
                                  ? `Model ini ditagih ${unitLabel}${
                                      item.pricing.pricing_unit === 'per_generation'
                                        ? ' (bukan per detik)'
                                        : ''
                                    }`
                                  : `This model charges ${unitLabel}`}
                              </span>
                            </div>
                            {unitPriceText && (
                              <div className="text-xs font-semibold tabular-nums text-[var(--vv-text-strong)] pl-5">
                                {unitPriceText}{' '}
                                <span className="font-normal text-[var(--vv-text-muted)]">
                                  {unitLabel}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Ringkasan Bersih & Minimalis: Perkalian Kebutuhan x Cadangan Langkah 2 */}
                      {(() => {
                        const cadanganCount =
                          assumptions.default_attempts_per_shot ||
                          item.attempts_per_item ||
                          1;
                        const itemTotalGenerations =
                          calcRow?.budgeted_generations ??
                          item.quantity * cadanganCount;

                        return (
                          <div className="rounded-[12px] border border-[#0099ff]/30 bg-[#0099ff]/[0.07] p-3.5 space-y-1.5 text-xs">
                            <div className="flex flex-wrap items-center justify-between text-[var(--vv-text-muted)]">
                              <span>
                                {isId
                                  ? `Kebutuhan: ${item.quantity} ${noun} • Dikalikan Cadangan Langkah 2 (${cadanganCount} cadangan)`
                                  : `Requirement: ${item.quantity} ${noun} • Multiplied by Step 2 Reserve (${cadanganCount} reserve)`}
                              </span>
                              <span className="tabular-nums font-mono text-[var(--vv-text-strong)] font-semibold">
                                {itemTotalGenerations}x {isId ? 'buat' : 'tries'}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-baseline justify-between pt-1 border-t border-[var(--vv-border)]">
                              <span className="font-medium text-[var(--vv-text-strong)]">
                                {isId ? 'Total Anggaran Tahap Ini:' : 'Total Stage Budget:'}
                              </span>
                              <div className="text-right">
                                <strong className="text-base text-[#0099ff] tabular-nums">
                                  {formatCurrencyIdr(calcRow?.total_cost_idr, language)}
                                </strong>
                                <span className="text-xs text-[var(--vv-text-muted)] tabular-nums ml-2">
                                  ({formatCurrencyUsd(calcRow?.total_cost_usd, language)}
                                  {calcRow?.total_credit !== null
                                    ? ` • ${calcRow?.total_credit} Credit`
                                    : ''})
                                </span>
                              </div>
                            </div>
                            <div className="pt-0.5 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingItemId(null);
                                  setActiveTab('setup');
                                }}
                                className="text-[11px] font-medium text-[#0099ff] hover:underline"
                              >
                                {isId
                                  ? 'Ubah angka cadangan di Langkah 2 →'
                                  : 'Change reserve count in Step 2 →'}
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  );
                })()}

                {/* 3b. Paket Unlimited Higgsfield (Bebas Credit / Rp 0) */}
                <label
                  className={`vv-card-quiet p-4 flex items-start gap-3 cursor-pointer transition ${
                    item.is_unlimited ? 'border border-purple-500/50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!item.is_unlimited}
                    onChange={(e) =>
                      toggleItemUnlimited(item.item_id, e.target.checked)
                    }
                    className="mt-0.5 rounded border-[var(--vv-border)]"
                  />
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-[var(--vv-text-strong)] flex flex-wrap items-center gap-2">
                      <span>
                        {isId
                          ? 'Termasuk Paket Unlimited Higgsfield (Bebas Credit / Rp 0)'
                          : 'Included in Higgsfield Unlimited Plan (Free / Rp 0)'}
                      </span>
                      {selectedModel?.unlimited_eligible && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                          Unlimited Ready
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--vv-text-muted)] leading-relaxed">
                      {isId
                        ? 'Centang jika model ini gratis di paket langganan Anda, sehingga tahap ini tidak menambah biaya.'
                        : 'Tick if this model is free on your subscription plan, so this stage adds no cost.'}{' '}
                      {isId ? 'Patokan saat ini: 1 Credit = ' : 'Current rate: 1 Credit = '}
                      {formatCurrencyUsd(usdPerCredit, language)}
                    </p>
                  </div>
                </label>

                {/* 4. Progressive Disclosure: Manual Price Override Accordion */}
                <div className="vv-card-quiet p-4">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        setShowManualPriceSection((prev) => !prev)
                      }
                      className="flex items-center gap-2 text-xs font-medium text-[var(--vv-text-strong)] hover:text-[#0099ff] transition"
                    >
                      {showManualPriceSection ? (
                        <ChevronUp className="w-4 h-4 text-[#0099ff]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#0099ff]" />
                      )}
                      <span>
                        {isId
                          ? 'Pengaturan Lanjutan: Ubah Harga Satuan / Credit Manual (Opsional)'
                          : 'Advanced: Override Unit Price / Credits Manually (Optional)'}
                      </span>
                    </button>

                    <StatusBadge
                      status={item.pricing.status}
                      language={language}
                    />
                  </div>

                  {showManualPriceSection && (
                    <div className="mt-4 pt-3 border-t border-[var(--vv-border)] space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-[11px] text-[var(--vv-text-muted)] mb-1">
                            {isId ? 'Harga Satuan (USD)' : 'Unit Price (USD)'} (
                            {
                              PRICING_UNIT_LABELS[item.pricing.pricing_unit][
                                language
                              ]
                            }
                            )
                          </label>
                          <input
                            type="number"
                            min={0}
                            step={0.001}
                            value={
                              item.pricing.price_value !== null
                                ? item.pricing.price_value
                                : ''
                            }
                            onChange={(e) => {
                              const val =
                                e.target.value === ''
                                  ? null
                                  : Number(e.target.value);
                              setManualItemPricing(
                                item.item_id,
                                val,
                                item.pricing.credit_cost
                              );
                            }}
                            className={`${inputClass} w-full px-3 py-2 rounded-[9px] text-xs font-bold tabular-nums text-right`}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-[var(--vv-text-muted)] mb-1">
                            {isId ? 'Credit per Satuan' : 'Credits per Unit'}
                          </label>
                          <input
                            type="number"
                            min={0}
                            step={0.5}
                            value={
                              item.pricing.credit_cost !== null
                                ? item.pricing.credit_cost
                                : ''
                            }
                            onChange={(e) => {
                              const val =
                                e.target.value === ''
                                  ? null
                                  : Number(e.target.value);
                              setManualItemPricing(
                                item.item_id,
                                item.pricing.price_value,
                                val
                              );
                            }}
                            className={`${inputClass} w-full px-3 py-2 rounded-[9px] text-xs font-bold tabular-nums text-right`}
                          />
                        </div>
                      </div>

                      {item.pricing.status === 'manual' && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              resetItemPricingToCatalog(item.item_id)
                            }
                            className="vv-btn-secondary px-3 py-1.5 text-xs"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>
                              {isId
                                ? 'Kembalikan ke Harga Katalog Resmi'
                                : 'Reset to Official Catalog Price'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </FrostedModal>
          );
        })()}
    </div>
  );
};
