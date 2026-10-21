import React, { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import {
  CATEGORY_LABELS,
  formatCurrencyIdr,
  formatCurrencyUsd,
  PRICING_UNIT_LABELS,
  SHORT_CATEGORY_LABELS,
  UI_TEXT,
} from '../i18n/translations';
import { StatusBadge } from './StatusBadge';
import { FrostedModal } from './FrostedModal';
import { StepFlowBar } from './StepFlowBar';
import {
  CatalogModelEntry,
  ProcessCategory,
} from '../../shared/types/project';
import {
  Database,
  Edit3,
  Globe,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sliders,
} from 'lucide-react';

const ALL_CATEGORIES: ProcessCategory[] = [
  'text_to_image',
  'image_to_video',
  'video_to_video',
  'text_to_video',
  'upscaling',
];

export const DataSettingsView: React.FC = () => {
  const {
    project,
    catalog,
    language,
    theme,
    isRefreshingFx,
    isRefreshingCatalog,
    refreshExchangeRateAuto,
    setManualExchangeRate,
    refreshCatalogAuto,
    saveGlobalModelRateOverride,
    resetAllCatalogOverrides,
  } = useProjectStore();

  const [selectedCategory, setSelectedCategory] = useState<
    ProcessCategory | 'all'
  >('all');
  const [isManualFxModalOpen, setIsManualFxModalOpen] = useState(false);
  const [manualFxInput, setManualFxInput] = useState<string>(
    project.exchange_rate.rate ? String(project.exchange_rate.rate) : '16250'
  );

  const [selectedModelForModal, setSelectedModelForModal] =
    useState<CatalogModelEntry | null>(null);
  const [overrideUsdInput, setOverrideUsdInput] = useState<string>('');
  const [overrideCreditInput, setOverrideCreditInput] = useState<string>('');

  const t = UI_TEXT[language];
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';
  const heroCardClass =
    theme === 'dark' ? 'vv-card-hero-dark' : 'vv-card-hero-light';
  const inputClass =
    theme === 'dark' ? 'glass-input-dark' : 'glass-input-light';
  const fx = project.exchange_rate;

  const filteredCatalog = catalog.filter(
    (m) =>
      selectedCategory === 'all' ||
      m.supported_categories.includes(selectedCategory)
  );

  const openModelModal = (model: CatalogModelEntry) => {
    const firstVar = model.pricing_variants[0];
    setOverrideUsdInput(
      firstVar?.price_value !== null && firstVar?.price_value !== undefined
        ? String(firstVar.price_value)
        : ''
    );
    setOverrideCreditInput(
      firstVar?.credit_cost !== null && firstVar?.credit_cost !== undefined
        ? String(firstVar.credit_cost)
        : ''
    );
    setSelectedModelForModal(model);
  };

  return (
    <div className="space-y-6">
      {/* =====================================================================
       * TIER 1: DOMINANT FOCAL POINT — UNIFIED EXCHANGE RATE HERO CARD
       * ===================================================================== */}
      <div className={`${heroCardClass} rounded-[18px] p-6 md:p-7`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left 7 Cols: Title & Active Rate Provenance */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="vv-badge-pill">
                <Database className="w-3.5 h-3.5 text-[#0099ff]" />
                <span>
                  {isId
                    ? 'Referensi Data • Kurs & Katalog AI'
                    : 'Data Reference • FX & AI Catalog'}
                </span>
              </span>
              <StatusBadge status={fx.status} language={language} />
            </div>

            <h1 className="text-2xl md:text-3xl font-medium tracking-[-0.035em]">
              {isId ? (
                <>
                  Pengaturan Kurs Rupiah &{' '}
                  <span className="vv-accent text-[#0099ff]">
                    Daftar Harga Model AI
                  </span>
                </>
              ) : (
                <>
                  Exchange Rate Settings &{' '}
                  <span className="vv-accent text-[#0099ff]">
                    AI Model Price List
                  </span>
                </>
              )}
            </h1>

            <p className="text-xs text-[var(--vv-text-muted)] leading-relaxed max-w-xl">
              {isId
                ? 'Perbarui nilai tukar Dolar ke Rupiah secara otomatis dari internet, atau atur nilai kurs dan harga acuan model AI sesuai kebutuhan tim Anda.'
                : 'Update the USD to IDR exchange rate automatically from the internet, or set custom FX rates and reference model prices for your team.'}
            </p>

            <div className="vv-card-quiet p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-[var(--vv-text-muted)]">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[var(--vv-text-subtle)]">
                  {isId ? 'Sumber Kurs' : 'Rate Source'}
                </span>
                <strong className="text-[var(--vv-text-strong)]">
                  {fx.source_name}
                </strong>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[var(--vv-text-subtle)]">
                  {isId ? 'Jenis Kurs' : 'Rate Type'}
                </span>
                <strong className="text-[var(--vv-text-strong)]">
                  {fx.rate_type}
                </strong>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[var(--vv-text-subtle)]">
                  {isId ? 'Terakhir Diperbarui' : 'Last Updated'}
                </span>
                <strong className="text-[var(--vv-text-strong)] font-mono">
                  {fx.retrieved_at.slice(0, 16).replace('T', ' ')}
                </strong>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Dominant FX Readout & Action Triggers */}
          <div className="lg:col-span-5 p-5 rounded-[16px] bg-[var(--vv-tint-weak)] border border-[#0099ff]/35 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0099ff] flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {t.exchangeRateLabel}
              </span>
              <span className="text-[11px] font-mono text-[var(--vv-text-muted)]">
                USD &rarr; IDR
              </span>
            </div>

            <div className="text-right my-2">
              <div className="text-xs text-[var(--vv-text-muted)]">
                {isId ? 'Patokan 1 Dolar AS Saat Ini:' : 'Current 1 USD Rate:'}
              </div>
              <div className="text-3xl md:text-4xl font-bold tabular-nums tracking-tight text-[var(--vv-text-primary)] mt-1">
                {fx.rate
                  ? formatCurrencyIdr(fx.rate, language)
                  : t.unavailableLabel}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={refreshExchangeRateAuto}
                disabled={isRefreshingFx}
                className="vv-btn-primary flex-1 py-2.5 px-4 text-xs"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    isRefreshingFx ? 'animate-spin' : ''
                  }`}
                />
                <span>
                  {isId ? 'Perbarui Otomatis' : 'Auto-Refresh Rate'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setManualFxInput(fx.rate ? String(fx.rate) : '16250');
                  setIsManualFxModalOpen(true);
                }}
                className="vv-btn-secondary py-2.5 px-4 text-xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#ffb840]" />
                <span>{isId ? 'Isi Kurs Manual' : 'Set Custom Rate'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
       * TIER 2: FILTERABLE AI MODEL CATALOG & POPUP DETAIL INSPECTOR
       * ===================================================================== */}
      <div className={`${cardClass} rounded-[16px] p-6 space-y-4`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--vv-border)] pb-4">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {isId
                  ? 'Daftar Model & Harga Acuan Resmi Higgsfield AI'
                  : 'Official Higgsfield AI Model & Reference Price List'}
              </span>
            </h2>
            <p className="text-xs text-[var(--vv-text-subtle)] mt-0.5">
              {isId
                ? 'Klik tombol "Detail / Ubah Harga" pada model mana saja untuk melihat varian resolusi atau menyesuaikan harga acuan.'
                : 'Click "Details / Edit Price" on any model to view resolution variants or customize its reference price.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={refreshCatalogAuto}
              disabled={isRefreshingCatalog}
              className="vv-btn-secondary px-3.5 py-2 text-xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isRefreshingCatalog ? 'animate-spin' : ''
                }`}
              />
              <span>
                {isId ? 'Muat Ulang Daftar Harga' : 'Refresh Price List'}
              </span>
            </button>

            <button
              type="button"
              onClick={resetAllCatalogOverrides}
              className="vv-btn-secondary px-3.5 py-2 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>
                {isId ? 'Kembalikan ke Harga Awal' : 'Reset Default Prices'}
              </span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-[#0068ad] text-white'
                : 'bg-[var(--vv-tint-weak)] text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)]'
            }`}
          >
            {isId ? `Semua Model (${catalog.length})` : `All Models (${catalog.length})`}
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-[#0068ad] text-white'
                  : 'bg-[var(--vv-tint-weak)] text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)]'
              }`}
            >
              {SHORT_CATEGORY_LABELS[cat][language]}
            </button>
          ))}
        </div>

        {/* Streamlined Scannable Model Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--vv-border)] text-[var(--vv-text-muted)]">
                <th className="py-2.5 text-left font-medium">
                  {isId ? 'Nama Model AI' : 'AI Model Name'}
                </th>
                <th className="py-2.5 text-left font-medium">
                  {isId ? 'Jenis Pembuatan' : 'Creation Types'}
                </th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Harga Acuan (USD)' : 'Reference Price (USD)'}
                </th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Perkiraan Rupiah' : 'Est. IDR'}
                </th>
                <th className="py-2.5 text-right font-medium">Credit</th>
                <th className="py-2.5 text-center font-medium">Status</th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Aksi' : 'Action'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--vv-border)]">
              {filteredCatalog.map((m) => {
                const firstVar = m.pricing_variants[0];
                const estIdr =
                  firstVar?.price_value !== null &&
                  firstVar?.price_value !== undefined &&
                  fx.rate
                    ? firstVar.price_value * fx.rate
                    : null;

                return (
                  <tr
                    key={m.model_id}
                    className="hover:bg-[var(--vv-tint-weak)] transition-colors"
                  >
                    <td className="py-3">
                      <div className="font-semibold text-[var(--vv-text-primary)]">
                        {m.model_name}
                      </div>
                      <div className="text-[11px] text-[var(--vv-text-muted)]">
                        {m.family} &bull;{' '}
                        {firstVar
                          ? PRICING_UNIT_LABELS[firstVar.pricing_unit][language]
                          : '-'}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {m.supported_categories.map((c) => (
                          <span
                            key={c}
                            className="px-2 py-0.5 rounded-full bg-[var(--vv-tint-weak)] border border-[var(--vv-border)] text-[10px]"
                          >
                            {SHORT_CATEGORY_LABELS[c][language]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 text-right font-bold tabular-nums">
                      {firstVar?.price_value !== null &&
                      firstVar?.price_value !== undefined
                        ? formatCurrencyUsd(firstVar.price_value, language)
                        : t.unavailableLabel}
                    </td>
                    <td className="py-3 text-right tabular-nums text-[#0099ff] font-medium">
                      {formatCurrencyIdr(estIdr, language)}
                    </td>
                    <td className="py-3 text-right tabular-nums text-[#7acaff]">
                      {firstVar?.credit_cost !== null &&
                      firstVar?.credit_cost !== undefined
                        ? `${firstVar.credit_cost} cr`
                        : 'N/A'}
                    </td>
                    <td className="py-3 text-center">
                      <StatusBadge
                        status={firstVar?.status || 'unavailable'}
                        language={language}
                      />
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openModelModal(m)}
                        className="vv-btn-secondary px-3 py-1.5 text-[11px]"
                      >
                        <Sliders className="w-3 h-3 text-[#0099ff]" />
                        <span>
                          {isId ? 'Detail / Ubah' : 'Details / Edit'}
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guided Step Flow Footer */}
      <StepFlowBar
        currentStepNumber={6}
        totalSteps={6}
        stepTitle={t.navDataSettings}
        nextStepHint={
          isId
            ? 'Kurs dan daftar harga model AI sudah siap. Kembali ke Daftar Pekerjaan atau langsung cetak Laporan PDF.'
            : 'Exchange rate and AI model prices are set. Return to your Production List or export your PDF Report.'
        }
        prevTab="planner"
        prevLabel={t.navPlanner}
        nextTab="pdf"
        nextLabel={t.navExportPdf}
      />

      {/* =====================================================================
       * FROSTED GLASS MODAL 1: Atur Kurs Dolar ke Rupiah Secara Manual
       * ===================================================================== */}
      <FrostedModal
        isOpen={isManualFxModalOpen}
        onClose={() => setIsManualFxModalOpen(false)}
        theme={theme}
        maxWidth="md"
        badgeLabel={isId ? 'Kurs Manual / Offline' : 'Custom / Offline FX Rate'}
        title={
          isId ? (
            <>
              Isi Kurs Rupiah{' '}
              <span className="vv-accent text-[#0099ff]">Sendiri</span>
            </>
          ) : (
            <>
              Set Custom{' '}
              <span className="vv-accent text-[#0099ff]">IDR Exchange Rate</span>
            </>
          )
        }
        subtitle={
          isId
            ? 'Gunakan fitur ini saat bekerja tanpa koneksi internet atau jika perusahaan Anda memiliki patokan kurs anggaran tetap.'
            : 'Use this when working offline or if your company uses a fixed internal budget exchange rate.'
        }
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsManualFxModalOpen(false)}
              className="vv-btn-secondary px-4 py-2 text-xs"
            >
              {isId ? 'Batal' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={() => {
                setManualExchangeRate(Number(manualFxInput));
                setIsManualFxModalOpen(false);
              }}
              className="vv-btn-accent px-5 py-2 text-xs font-semibold"
            >
              {isId ? 'Simpan & Gunakan Kurs Ini' : 'Save & Use This Rate'}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[var(--vv-text-strong)] mb-1.5">
              {isId ? 'Nilai Rupiah untuk 1 Dolar AS (USD)' : 'IDR Value per 1 USD'}
            </label>
            <input
              type="number"
              min={100}
              step={50}
              value={manualFxInput}
              onChange={(e) => setManualFxInput(e.target.value)}
              className={`${inputClass} w-full px-3.5 py-2.5 rounded-[10px] text-lg font-bold tabular-nums text-right`}
            />
          </div>

          <div className="vv-card-quiet p-3.5 space-y-1.5">
            <div className="text-[11px] text-[var(--vv-text-muted)]">
              {isId
                ? 'Simulasi Dampak pada Proyek Saat Ini:'
                : 'Live Impact on Current Project:'}
            </div>
            <div className="flex items-center justify-between">
              <span>{t.totalBudget}:</span>
              <strong className="text-sm tabular-nums text-[#0099ff]">
                {formatCurrencyIdr(
                  project.calculation.total_cost_usd *
                    (Number(manualFxInput) || 0),
                  language
                )}
              </strong>
            </div>
          </div>
        </div>
      </FrostedModal>

      {/* =====================================================================
       * FROSTED GLASS MODAL 2: Detail Varian & Ubah Harga Acuan Model AI
       * ===================================================================== */}
      {selectedModelForModal && (
        <FrostedModal
          isOpen={true}
          onClose={() => setSelectedModelForModal(null)}
          theme={theme}
          maxWidth="xl"
          badgeLabel={selectedModelForModal.family}
          title={
            <>
              {selectedModelForModal.model_name}{' '}
              <span className="vv-accent text-[#0099ff]">
                {isId ? 'Detail & Harga' : 'Pricing & Specs'}
              </span>
            </>
          }
          subtitle={
            isId
              ? selectedModelForModal.description_id
              : selectedModelForModal.description_en
          }
          footer={
            <>
              <button
                type="button"
                onClick={() => setSelectedModelForModal(null)}
                className="vv-btn-secondary px-4 py-2 text-xs"
              >
                {isId ? 'Tutup' : 'Close'}
              </button>
              <button
                type="button"
                onClick={async () => {
                  const numUsd = Number(overrideUsdInput);
                  const numCr =
                    overrideCreditInput.trim() === ''
                      ? null
                      : Number(overrideCreditInput);
                  if (Number.isFinite(numUsd) && numUsd > 0) {
                    await saveGlobalModelRateOverride(
                      selectedModelForModal.model_id,
                      numUsd,
                      numCr,
                      selectedModelForModal.pricing_variants[0]?.pricing_unit
                    );
                    setSelectedModelForModal(null);
                  }
                }}
                className="vv-btn-accent px-5 py-2 text-xs font-semibold"
              >
                {isId
                  ? 'Simpan Harga Acuan Baru'
                  : 'Save Custom Reference Price'}
              </button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Varian Harga Resmi */}
            <div className="vv-card-quiet p-4 space-y-2.5">
              <div className="font-semibold text-[var(--vv-text-strong)]">
                {isId
                  ? 'Daftar Varian Harga berdasarkan Pengaturan Kualitas:'
                  : 'Pricing Variants by Quality Settings:'}
              </div>
              <div className="divide-y divide-[var(--vv-border)]">
                {selectedModelForModal.pricing_variants.map((v, i) => (
                  <div
                    key={i}
                    className="py-2 flex items-center justify-between gap-2"
                  >
                    <div className="text-[var(--vv-text-muted)]">
                      {v.matchParameters
                        ? Object.entries(v.matchParameters)
                            .map(([k, val]) => `${k}: ${val}`)
                            .join(' • ')
                        : isId
                        ? 'Tarif Dasar'
                        : 'Default Rate'}{' '}
                      ({PRICING_UNIT_LABELS[v.pricing_unit][language]})
                    </div>
                    <div className="font-bold tabular-nums text-[#0099ff]">
                      {formatCurrencyUsd(v.price_value, language)}{' '}
                      {v.credit_cost !== null ? `• ${v.credit_cost} cr` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Ubah Harga Acuan Model */}
            <div className="vv-card-quiet p-4 space-y-3">
              <div className="font-semibold text-[var(--vv-text-strong)]">
                {isId
                  ? 'Ubah Harga Acuan untuk Model Ini (Berlaku di Seluruh Proyek):'
                  : 'Customize Reference Price for This Model:'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] text-[var(--vv-text-muted)] mb-1">
                    {isId ? 'Harga Acuan Baru (USD)' : 'New Reference Price (USD)'}
                  </label>
                  <input
                    type="number"
                    min={0.001}
                    step={0.01}
                    value={overrideUsdInput}
                    onChange={(e) => setOverrideUsdInput(e.target.value)}
                    className={`${inputClass} w-full px-3 py-2 rounded-[9px] text-sm font-bold tabular-nums text-right`}
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
                    value={overrideCreditInput}
                    onChange={(e) => setOverrideCreditInput(e.target.value)}
                    className={`${inputClass} w-full px-3 py-2 rounded-[9px] text-sm font-bold tabular-nums text-right`}
                  />
                </div>
              </div>
            </div>
          </div>
        </FrostedModal>
      )}
    </div>
  );
};
