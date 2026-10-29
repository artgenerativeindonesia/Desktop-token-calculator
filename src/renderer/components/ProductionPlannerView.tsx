import React, { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { UI_TEXT } from '../i18n/translations';
import { ProcessCategory } from '../../shared/types/project';
import { StepFlowBar } from './StepFlowBar';
import { Plus } from 'lucide-react';
import {
  DepartmentTab,
  VIDEO_CATEGORIES,
  STILLS_CATEGORIES,
  formatDualDuration,
  isItemPrimaryShot,
  getDefaultAddCategoryForDept,
} from './planner/plannerTypes';
import { PlannerHeroHeader } from './planner/PlannerHeroHeader';
import { PlannerDepartmentNav } from './planner/PlannerDepartmentNav';
import { PlannerItemCard } from './planner/PlannerItemCard';
import { PlannerRunningSummary } from './planner/PlannerRunningSummary';
import { PlannerItemModal } from './planner/PlannerItemModal';

// Re-export types & utilities for backward compatibility
export type { DepartmentTab };
export { formatDualDuration };

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

  const [activeDepartment, setActiveDepartment] = useState<DepartmentTab>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<
    ProcessCategory | 'all'
  >('all');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showManualPriceSection, setShowManualPriceSection] = useState(false);
  const [showQuickAddMenu, setShowQuickAddMenu] = useState(false);

  const t = UI_TEXT[language];
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';
  const { items, calculation, assumptions } = project;

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
    if (dept === 'music') return cat === 'music';
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
    setShowQuickAddMenu(false);
    addProductionItem(cat);
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
      <PlannerHeroHeader
        language={language}
        theme={theme}
        calculation={calculation}
        cleanDurationSec={cleanDurationSec}
        totalCleanDurationSec={totalCleanDurationSec}
        targetDurationSec={targetDurationSec}
        durationDiff={durationDiff}
        activeDepartment={activeDepartment}
        showQuickAddMenu={showQuickAddMenu}
        setShowQuickAddMenu={setShowQuickAddMenu}
        onAddAndOpenModal={handleAddAndOpenModal}
        onOpenSetupTab={() => setActiveTab('setup')}
      />

      {/* =====================================================================
       * WORKFLOW DEPARTMENTS: 1 Baris Bersih (5 Tab Departemen + Status Sinkron)
       * ===================================================================== */}
      <PlannerDepartmentNav
        language={language}
        theme={theme}
        activeDepartment={activeDepartment}
        setActiveDepartment={setActiveDepartment}
        setSelectedCategoryFilter={setSelectedCategoryFilter}
        setShowQuickAddMenu={setShowQuickAddMenu}
        items={items}
        cleanDurationSec={cleanDurationSec}
        onAddAndOpenModal={handleAddAndOpenModal}
      />

      {/* =====================================================================
       * TIER 2: CLEAN, SCANNABLE SCENE ROW CARDS
       * ===================================================================== */}
      {filteredItems.length === 0 ? (
        <div className={`${cardClass} rounded-[16px] p-10 text-center space-y-3`}>
          <p className="text-sm text-[var(--vv-text-muted)]">
            {isId
              ? 'Belum ada tahap pekerjaan pada kategori ini. Klik tombol di bawah untuk menambahkan shot atau aset AI baru.'
              : 'No production stages in this category yet. Click below to add a new AI shot or asset.'}
          </p>
          <button
            type="button"
            onClick={() =>
              handleAddAndOpenModal(
                getDefaultAddCategoryForDept(activeDepartment)
              )
            }
            className="vv-btn-primary px-5 py-2.5 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>
              {activeDepartment === 'stills'
                ? isId
                  ? 'Tambah Gambar Visual'
                  : 'Add Visual Image'
                : activeDepartment === 'voiceover'
                ? isId
                  ? 'Tambah File Audio'
                  : 'Add Audio File'
                : activeDepartment === 'music'
                ? isId
                  ? 'Tambah Track Musik'
                  : 'Add Music Track'
                : t.addStageBtn}
            </span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map(({ item, idx, calcRow }) => (
            <PlannerItemCard
              key={item.item_id}
              item={item}
              idx={idx}
              calcRow={calcRow}
              language={language}
              theme={theme}
              catalog={catalog}
              assumptions={assumptions}
              targetVideos={calculation.target_videos}
              onOpenEditModal={(itemId, isManual) => {
                setShowManualPriceSection(isManual);
                setEditingItemId(itemId);
              }}
              onDuplicateItem={duplicateProductionItem}
              onRemoveItem={removeProductionItem}
              onTogglePrimaryShot={toggleItemPrimaryShot}
            />
          ))}
        </div>
      )}

      {/* Rekapitulasi Anggaran & Durasi Berjalan (Running Total Breakdown) */}
      {items.length > 0 && (
        <PlannerRunningSummary
          language={language}
          calculation={calculation}
          cleanDurationSec={cleanDurationSec}
          totalCleanDurationSec={totalCleanDurationSec}
          targetDurationSec={targetDurationSec}
          durationDiff={durationDiff}
        />
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

      {/* Frosted Glass Modal: Pengaturan Lengkap Shot / Tahap AI */}
      {activeEditEntry && (
        <PlannerItemModal
          isOpen={true}
          onClose={() => setEditingItemId(null)}
          item={activeEditEntry.item}
          idx={activeEditEntry.idx}
          calcRow={activeEditEntry.calcRow}
          language={language}
          theme={theme}
          catalog={catalog}
          assumptions={assumptions}
          exchangeRate={project.exchange_rate.rate}
          usdPerCredit={usdPerCredit}
          cleanDurationSec={cleanDurationSec}
          targetDurationSec={targetDurationSec}
          showManualPriceSection={showManualPriceSection}
          setShowManualPriceSection={setShowManualPriceSection}
          onUpdateField={updateProductionItemField}
          onChangeCategory={changeItemCategory}
          onChangeModel={changeItemModel}
          onChangeParameter={changeItemParameter}
          onToggleUnlimited={toggleItemUnlimited}
          onSetManualPricing={setManualItemPricing}
          onResetToCatalog={resetItemPricingToCatalog}
          onOpenSetupTab={() => {
            setEditingItemId(null);
            setActiveTab('setup');
          }}
        />
      )}
    </div>
  );
};
