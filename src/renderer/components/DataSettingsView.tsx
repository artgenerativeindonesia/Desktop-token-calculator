import React, { useMemo, useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import {
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
  ModelTierBadge,
  PricingUnit,
  ProcessCategory,
} from '../../shared/types/project';
import { HIGGSFIELD_SUBSCRIPTION_PLANS } from '../../shared/catalog/higgsfieldCatalog';
import {
  CheckCircle2,
  Coins,
  Database,
  Edit3,
  Globe,
  Mic,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Sliders,
  Sparkles,
} from 'lucide-react';
import {
  ELEVENLABS_SUBSCRIPTION_PLANS,
  ElevenLabsSubscriptionTier,
  fetchElevenLabsCatalogAuto,
} from '../../shared/catalog/elevenlabsCatalog';

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

export const DataSettingsView: React.FC = () => {
  const {
    project,
    catalog,
    language,
    theme,
    selectedCreditPlanId,
    usdPerCredit,
    selectedElevenLabsPlanId,
    setSelectedElevenLabsPlanId,
    isRefreshingFx,
    isRefreshingCatalog,
    refreshExchangeRateAuto,
    setManualExchangeRate,
    refreshCatalogAuto,
    saveGlobalModelRateOverride,
    resetAllCatalogOverrides,
    applyCreditSubscriptionPlan,
    addNewCustomModelToCatalog,
  } = useProjectStore();

  const [selectedCategory, setSelectedCategory] = useState<
    ProcessCategory | 'all'
  >('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isManualFxModalOpen, setIsManualFxModalOpen] = useState(false);
  const [manualFxInput, setManualFxInput] = useState<string>(
    project.exchange_rate.rate ? String(project.exchange_rate.rate) : '16250'
  );

  const [selectedModelForModal, setSelectedModelForModal] =
    useState<CatalogModelEntry | null>(null);
  const [overrideUsdInput, setOverrideUsdInput] = useState<string>('');
  const [overrideCreditInput, setOverrideCreditInput] = useState<string>('');
  const [elevenlabsApiKeyInput, setElevenlabsApiKeyInput] = useState<string>('');
  const [elevenlabsSyncStatus, setElevenlabsSyncStatus] = useState<string | null>(null);
  const [isSyncingElevenlabs, setIsSyncingElevenlabs] = useState<boolean>(false);

  // Filter Kategori Paket Langganan (Lapis 2)
  const [planFilterTab, setPlanFilterTab] = useState<
    'all' | 'individual_monthly' | 'individual_annual' | 'business' | 'topup'
  >('individual_annual');

  const displayedPlans = useMemo(() => {
    return HIGGSFIELD_SUBSCRIPTION_PLANS.filter((plan) => {
      if (planFilterTab === 'all') return true;
      if (planFilterTab === 'individual_monthly')
        return (
          plan.plan_category === 'individual' && plan.billing_cycle === 'monthly'
        );
      if (planFilterTab === 'individual_annual')
        return (
          plan.plan_category === 'individual' && plan.billing_cycle === 'annual'
        );
      if (planFilterTab === 'business') return plan.plan_category === 'business';
      if (planFilterTab === 'topup')
        return (
          plan.plan_category === 'topup' || plan.plan_category === 'api'
        );
      return true;
    });
  }, [planFilterTab]);

  const selectedPlanObj = useMemo(() => {
    return (
      HIGGSFIELD_SUBSCRIPTION_PLANS.find(
        (p) => p.plan_id === selectedCreditPlanId
      ) || null
    );
  }, [selectedCreditPlanId]);

  // Modal Tambah Model Baru (Lapis 3)
  const [isAddModelModalOpen, setIsAddModelModalOpen] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [newModelFamily, setNewModelFamily] = useState('Higgsfield Studio');
  const [newModelCategory, setNewModelCategory] =
    useState<ProcessCategory>('text_to_image');
  const [newModelCredit, setNewModelCredit] = useState('2.0');
  const [newModelUnit, setNewModelUnit] = useState<PricingUnit>('per_generation');
  const [newModelBadge, setNewModelBadge] = useState<ModelTierBadge>('NEW');
  const [newModelUnlimited, setNewModelUnlimited] = useState(true);

  const t = UI_TEXT[language];
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';
  const heroCardClass =
    theme === 'dark' ? 'vv-card-hero-dark' : 'vv-card-hero-light';
  const inputClass =
    theme === 'dark' ? 'glass-input-dark' : 'glass-input-light';
  const fx = project.exchange_rate;

  const filteredCatalog = catalog.filter((m) => {
    const matchCategory =
      selectedCategory === 'all' ||
      m.supported_categories.includes(selectedCategory);
    if (!matchCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.model_name.toLowerCase().includes(q) ||
      m.family.toLowerCase().includes(q) ||
      m.model_id.toLowerCase().includes(q)
    );
  });

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

  const renderTierBadge = (badge?: ModelTierBadge) => {
    if (!badge || badge === 'STANDARD') return null;
    if (badge === 'NEW') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider vv-badge-emerald">
          NEW
        </span>
      );
    }
    if (badge === 'PREMIUM') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border vv-badge-amber">
          PREMIUM
        </span>
      );
    }
    if (badge === 'POPULER') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#0099ff]/15 text-[#0066cc] dark:text-[#7acaff] border border-[#0099ff]/35">
          POPULER
        </span>
      );
    }
    return null;
  };

  const handleSaveNewModel = async () => {
    if (!newModelName.trim()) return;
    const creditNum = Math.max(0.1, Number(newModelCredit) || 1);
    const usdNum = Number((creditNum * usdPerCredit).toFixed(4));
    const slug = newModelName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    const isVideoOrEditVideo =
      newModelCategory === 'text_to_video' ||
      newModelCategory === 'image_to_video' ||
      newModelCategory === 'video_to_video' ||
      newModelCategory === 'upscale_video';

    const customEntry: CatalogModelEntry = {
      model_id: `custom/${slug}-${Date.now().toString().slice(-4)}`,
      provider: 'Higgsfield',
      model_name: newModelName.trim(),
      family: newModelFamily.trim() || 'Higgsfield Studio',
      supported_categories: [newModelCategory],
      default_quantity_type: isVideoOrEditVideo ? 'shot' : 'asset',
      supports_duration: isVideoOrEditVideo && newModelUnit === 'per_second',
      default_duration_seconds: isVideoOrEditVideo ? 5 : 0,
      tier_badge: newModelBadge,
      unlimited_eligible: newModelUnlimited,
      is_custom_model: true,
      description_id: `Model kustom ${newModelName.trim()} yang ditambahkan oleh pengguna.`,
      description_en: `Custom model ${newModelName.trim()} added by user.`,
      parameters: [
        {
          key: 'resolution',
          label_id: 'Resolusi / Mode',
          label_en: 'Resolution / Mode',
          type: 'select',
          defaultValue: 'default',
          affectsPricing: true,
          options: [{ value: 'default', label: 'Standar' }],
        },
      ],
      pricing_variants: [
        {
          pricing_unit: newModelUnit,
          price_value: usdNum,
          currency: 'USD',
          credit_cost: creditNum,
          status: 'manual',
        },
      ],
      source_name: 'Model Tambahan Pengguna (Higgsfield Custom)',
      source_url: 'https://higgsfield.ai/pricing',
      retrieved_at: new Date().toISOString(),
    };

    await addNewCustomModelToCatalog(customEntry);
    setNewModelName('');
    setIsAddModelModalOpen(false);
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
                    ? 'Referensi Data • Kurs & Katalog AI Higgsfield'
                    : 'Data Reference • FX & Higgsfield AI Catalog'}
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
                ? 'Dilengkapi Sistem Pembaruan Harga 3-Lapis: (1) Sinkronisasi ke server Higgsfield, (2) Pilihan Paket Langganan Credit Higgsfield, dan (3) Tambah/Ubah Model Baru kapan saja.'
                : 'Equipped with 3-Layer Pricing Sync: (1) Higgsfield server sync, (2) Higgsfield Credit Subscription Plan selector, and (3) Add/Edit custom models anytime.'}
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
                  {isId ? 'Patokan Nilai 1 Credit' : '1 Credit Benchmark'}
                </span>
                <strong className="text-[#0099ff] font-mono">
                  ${usdPerCredit.toFixed(4)} USD (
                  {fx.rate
                    ? formatCurrencyIdr(usdPerCredit * fx.rate, language)
                    : '-'}
                  )
                </strong>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[var(--vv-text-subtle)]">
                  {isId ? 'Total Model Tersedia' : 'Total Models Available'}
                </span>
                <strong className="text-[var(--vv-text-strong)] font-mono">
                  {catalog.length} Model Resmi & Kustom
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
                  {isId ? 'Perbarui Kurs Otomatis' : 'Auto-Refresh Rate'}
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
       * LAPIS 2: PATOKAN PAKET LANGGANAN CREDIT HIGGSFIELD (RESMI TERBARU 2026)
       * ===================================================================== */}
      <div className={`${cardClass} rounded-[16px] p-5 space-y-4`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#0099ff] flex items-center gap-2">
              <Coins className="w-4 h-4" />
              <span>
                {isId
                  ? 'Lapis 2 • Pilih Paket Langganan Credit Higgsfield Anda'
                  : 'Layer 2 • Select Your Higgsfield Credit Subscription Plan'}
              </span>
            </h2>
            <p className="text-xs text-[var(--vv-text-muted)] mt-0.5">
              {isId
                ? 'Pilih paket yang Anda gunakan di Higgsfield. Nilai 1 Credit akan otomatis menyesuaikan harga paket dan mengonversi seluruh katalog model ke USD & Rupiah.'
                : 'Select your active Higgsfield plan. 1 Credit rate will automatically adapt and convert all model prices to USD & IDR.'}
            </p>
          </div>
          <div className="text-right text-xs font-mono text-[var(--vv-text-strong)] bg-[var(--vv-tint-weak)] px-3 py-1.5 rounded-lg border border-[var(--vv-border)] shrink-0">
            1 Credit = <strong>${usdPerCredit.toFixed(4)}</strong>{' '}
            {fx.rate
              ? `(~${formatCurrencyIdr(usdPerCredit * fx.rate, language)})`
              : ''}
          </div>
        </div>

        {/* Filter Kategori Paket */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--vv-field)] border border-[var(--vv-border)] text-xs">
          {(
            [
              {
                id: 'individual_annual',
                label: isId
                  ? 'Individu Tahunan (Hemat s/d 30%)'
                  : 'Individual Annual (Up to 30% Off)',
              },
              {
                id: 'individual_monthly',
                label: isId ? 'Individu Bulanan' : 'Individual Monthly',
              },
              {
                id: 'business',
                label: isId
                  ? 'Tim & Bisnis (Pooled)'
                  : 'Team & Business (Pooled)',
              },
              {
                id: 'topup',
                label: isId ? 'Top-Up & API Resmi' : 'Top-Up & Official API',
              },
              {
                id: 'all',
                label: isId
                  ? `Semua Paket (${HIGGSFIELD_SUBSCRIPTION_PLANS.length})`
                  : `All Plans (${HIGGSFIELD_SUBSCRIPTION_PLANS.length})`,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPlanFilterTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all text-xs ${
                planFilterTab === tab.id
                  ? 'bg-[#0068ad] text-white shadow-sm font-semibold'
                  : 'text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)] hover:bg-[var(--vv-tint-weak)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid Kartu Pilihan Paket (Leluasa, Rapi, & Tanpa Teks Tabrakan) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {displayedPlans.map((plan) => {
            const isSelected = selectedCreditPlanId === plan.plan_id;
            const planName = isId ? plan.name_id : plan.name_en;

            return (
              <button
                key={plan.plan_id}
                type="button"
                onClick={() => applyCreditSubscriptionPlan(plan.plan_id)}
                className={`group p-4 rounded-[16px] text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0068ad]/20 border-[#0099ff] shadow-lg shadow-[#0099ff]/15 ring-2 ring-[#0099ff]/50'
                    : 'bg-[var(--vv-tint-weak)] border-[var(--vv-border)] hover:border-[#0099ff]/60 hover:bg-[var(--vv-field)]/60'
                }`}
              >
                <div>
                  {/* Header: Nama Paket & Badge Diskon */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-[var(--vv-text-strong)] leading-snug break-words">
                        {planName}
                      </div>
                      <div className="text-[11px] text-[var(--vv-text-muted)] mt-0.5">
                        {plan.billing_cycle === 'annual'
                          ? (isId ? 'Tagihan Tahunan (Hemat)' : 'Annual Billing')
                          : plan.billing_cycle === 'monthly'
                          ? (isId ? 'Tagihan Bulanan' : 'Monthly Billing')
                          : plan.plan_category === 'api'
                          ? (isId ? 'Pay-as-you-go API' : 'Pay-as-you-go API')
                          : (isId ? 'Top-Up Sekali Beli' : 'One-Time Pack')}
                      </div>
                    </div>
                    {plan.discount_badge && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full vv-badge-emerald whitespace-nowrap shrink-0 shadow-sm">
                        {plan.discount_badge}
                      </span>
                    )}
                  </div>

                  {/* Nilai Konversi 1 Credit */}
                  <div className="my-3 p-2.5 rounded-xl bg-[var(--vv-field)] border border-[var(--vv-border)]">
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="text-[11px] text-[var(--vv-text-muted)] font-medium">
                        {isId ? 'Nilai 1 Credit:' : '1 Credit Rate:'}
                      </span>
                      <span className="text-base font-bold font-mono text-[#0099ff]">
                        ${plan.usd_per_credit.toFixed(4)}
                      </span>
                    </div>
                    {fx.rate && (
                      <div className="text-[11px] text-[var(--vv-text-subtle)] font-mono text-right mt-1">
                        ≈ {formatCurrencyIdr(plan.usd_per_credit * fx.rate, language)} / cr
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Informasi Alokasi & Harga (Terpisah Jelas & Rapi) */}
                <div className="mt-1">
                  <div className="pt-2.5 border-t border-[var(--vv-border)] grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[var(--vv-text-subtle)] block">
                        {isId ? 'Alokasi' : 'Allocation'}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[var(--vv-text-primary)] font-semibold text-xs">
                        <Coins className="w-3.5 h-3.5 text-[#0099ff] shrink-0" />
                        <span className="truncate">
                          {plan.monthly_credits > 0
                            ? `${plan.monthly_credits.toLocaleString()} Cr`
                            : plan.plan_id === 'api_standard'
                            ? 'Sesuai Pakai'
                            : '1.000 Cr'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-[var(--vv-text-subtle)] block">
                        {isId ? 'Harga Paket' : 'Price'}
                      </span>
                      <div className="mt-0.5 font-bold text-xs text-[var(--vv-text-strong)]">
                        {plan.monthly_price_usd > 0
                          ? `$${plan.monthly_price_usd} / bln`
                          : plan.plan_id === 'api_standard'
                          ? 'Pay-per-use'
                          : '$120 Sekali'}
                      </div>
                    </div>
                  </div>

                  {/* Status Terpilih */}
                  {isSelected ? (
                    <div className="mt-3 py-1.5 px-2.5 rounded-lg bg-[#0099ff]/15 text-[#0099ff] border border-[#0099ff]/30 text-xs font-semibold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0099ff]" />
                      <span>{isId ? 'Paket Aktif Digunakan' : 'Active Plan Selected'}</span>
                    </div>
                  ) : (
                    <div className="mt-3 py-1.5 px-2 text-[11px] text-[var(--vv-text-subtle)] text-center transition group-hover:text-[#0099ff]">
                      {isId ? 'Klik untuk memilih paket ini' : 'Click to select this plan'}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Plan Details Banner */}
        {selectedPlanObj && (
          <div className="p-4 rounded-[14px] bg-[var(--vv-field)] border border-[#0099ff]/30 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-start md:items-center gap-3">
              <div className="p-2 rounded-xl bg-[#0099ff]/15 text-[#0099ff] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0099ff]">
                    {isId ? 'Paket Terpilih Sebagai Patokan' : 'Active Benchmark Plan'}
                  </span>
                  {selectedPlanObj.discount_badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full vv-badge-emerald">
                      {selectedPlanObj.discount_badge}
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-[var(--vv-text-strong)] mt-0.5">
                  {isId ? selectedPlanObj.name_id : selectedPlanObj.name_en}
                </div>
                <div className="text-xs text-[var(--vv-text-muted)] mt-0.5">
                  {isId ? selectedPlanObj.description_id : selectedPlanObj.description_en}
                </div>
              </div>
            </div>
            <div className="text-left md:text-right shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--vv-border)]">
              <span className="text-[10px] uppercase tracking-wider text-[var(--vv-text-subtle)] block">
                {isId ? 'Patokan Konversi 1 Credit' : '1 Credit Conversion Rate'}
              </span>
              <span className="font-mono font-bold text-[#0099ff] text-base">
                ${selectedPlanObj.usd_per_credit.toFixed(4)} / Credit
              </span>
              {fx.rate && (
                <div className="text-[11px] text-[var(--vv-text-subtle)] font-mono mt-0.5">
                  ≈ {formatCurrencyIdr(selectedPlanObj.usd_per_credit * fx.rate, language)} / cr
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
       * ELEVENLABS OFFICIAL VOICE OVER PLANS & STATUS (TAHAP 3)
       * ===================================================================== */}
      <div
        className={`${cardClass} rounded-[16px] p-5 space-y-4 border border-sky-500/30`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <Mic className="w-4 h-4 text-sky-400" />
                <span>
                  {isId
                    ? 'Paket Langganan Resmi ElevenLabs Voice Over'
                    : 'Official ElevenLabs Voice Over Subscription Plans'}
                </span>
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30">
                Official API
              </span>
            </div>
            <p className="text-xs text-[var(--vv-text-muted)] mt-0.5">
              {isId
                ? 'Pilih paket ElevenLabs Anda. Biaya per credit akan otomatis dihitung untuk setiap naskah Voice Over di Langkah 3 secara real-time.'
                : 'Select your ElevenLabs plan. Credit rates will automatically apply to voiceover scripts in Step 3 in real time.'}
            </p>
          </div>

          {(() => {
            const activePlan =
              ELEVENLABS_SUBSCRIPTION_PLANS.find(
                (p) => p.plan_id === selectedElevenLabsPlanId
              ) || ELEVENLABS_SUBSCRIPTION_PLANS[1];
            return (
              <div className="text-right text-xs font-mono text-[var(--vv-text-strong)] bg-sky-950/20 px-3 py-1.5 rounded-lg border border-sky-500/30 shrink-0">
                1 Credit ({activePlan.name_id.split(' ')[1]}) ={' '}
                <strong>${activePlan.usd_per_credit.toFixed(6)}</strong>{' '}
                {project.exchange_rate.rate
                  ? `(~Rp ${(
                      activePlan.usd_per_credit * project.exchange_rate.rate
                    ).toFixed(2)})`
                  : ''}
              </div>
            );
          })()}
        </div>

        {/* Grid 6 Paket Resmi ElevenLabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ELEVENLABS_SUBSCRIPTION_PLANS.map((plan) => {
            const isSelected = selectedElevenLabsPlanId === plan.plan_id;
            return (
              <button
                key={plan.plan_id}
                type="button"
                onClick={() =>
                  setSelectedElevenLabsPlanId(
                    plan.plan_id as ElevenLabsSubscriptionTier
                  )
                }
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-sky-500 bg-sky-500/10 shadow-md ring-1 ring-sky-500/50'
                    : 'border-[var(--vv-border)] bg-[var(--vv-card)] hover:border-sky-500/40 hover:bg-[var(--vv-tint-weak)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-xs text-[var(--vv-text-primary)]">
                      {isId
                        ? plan.name_id.split(' (')[0]
                        : plan.name_en.split(' (')[0]}
                    </span>
                    {plan.badge && (
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          plan.badge === 'POPULER'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                            : plan.badge === 'GRATIS'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        }`}
                      >
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div className="text-lg font-bold tabular-nums text-[var(--vv-text-primary)] mb-1">
                    {plan.monthly_price_usd === 0
                      ? isId
                        ? 'Gratis $0'
                        : 'Free $0'
                      : `$${plan.monthly_price_usd} / bln`}
                  </div>

                  <div className="text-[11px] text-[var(--vv-text-muted)] space-y-0.5 mb-3">
                    <div className="flex items-center justify-between">
                      <span>
                        {isId ? 'Alokasi Credit:' : 'Monthly Credits:'}
                      </span>
                      <strong className="font-mono text-sky-400">
                        {plan.monthly_credits.toLocaleString()} Cr
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>
                        {isId ? 'Biaya per Credit:' : 'Cost per Credit:'}
                      </span>
                      <span className="font-mono text-[var(--vv-text-strong)]">
                        {plan.usd_per_credit === 0
                          ? '$0'
                          : `$${plan.usd_per_credit.toFixed(6)}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--vv-border)] flex items-center justify-between text-[10px]">
                  <span className="text-[var(--vv-text-subtle)]">
                    {plan.commercial_license
                      ? '✅ Komersial'
                      : 'Non-komersial'}
                  </span>
                  {isSelected ? (
                    <span className="text-sky-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isId ? 'Aktif' : 'Active'}
                    </span>
                  ) : (
                    <span className="text-[var(--vv-text-subtle)] group-hover:text-sky-400">
                      {isId ? 'Pilih Paket' : 'Select'}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Real-Time Sync & Optional Key Panel */}
        <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--vv-text-primary)]">
                {isId
                  ? 'Konektor Resmi ElevenLabs'
                  : 'Official ElevenLabs Connector'}
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                {isId
                  ? 'Siap Digunakan (Gratis & Terverifikasi)'
                  : 'Ready (Free & Verified)'}
              </span>
            </div>
            <p className="text-[11px] text-[var(--vv-text-muted)] leading-relaxed">
              {isId
                ? 'Aplikasi menggunakan data resmi terverifikasi ElevenLabs tanpa mengharuskan Anda memasukkan API key berbayar. Jika Anda memiliki ElevenLabs API key, Anda dapat memasukkannya di bawah untuk melihat sisa kuota akun secara live.'
                : 'The calculator uses verified official ElevenLabs models and pricing without requiring an API key. If you have an ElevenLabs API key, you can enter it below to inspect live quota.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <input
              type="password"
              placeholder="xi-api-key (opsional)"
              value={elevenlabsApiKeyInput}
              onChange={(e) => setElevenlabsApiKeyInput(e.target.value)}
              className={`${inputClass} px-3 py-1.5 rounded-lg text-xs w-48 font-mono`}
            />
            <button
              type="button"
              disabled={isSyncingElevenlabs}
              onClick={async () => {
                setIsSyncingElevenlabs(true);
                setElevenlabsSyncStatus(null);
                try {
                  const res = await fetchElevenLabsCatalogAuto({
                    apiKey: elevenlabsApiKeyInput.trim() || undefined,
                  });
                  if (res.success) {
                    setElevenlabsSyncStatus(
                      isId
                        ? `✅ Berhasil sinkronisasi (${res.models.length} model resmi ElevenLabs aktif)`
                        : `✅ Successfully synced (${res.models.length} official ElevenLabs models active)`
                    );
                  } else {
                    setElevenlabsSyncStatus(
                      isId
                        ? `ℹ️ Menggunakan katalog lokal terverifikasi`
                        : `ℹ️ Using verified offline catalog`
                    );
                  }
                } catch {
                  setElevenlabsSyncStatus(
                    isId
                      ? 'ℹ️ Menggunakan katalog lokal terverifikasi'
                      : 'ℹ️ Using verified offline catalog'
                  );
                } finally {
                  setIsSyncingElevenlabs(false);
                }
              }}
              className="vv-btn-primary px-3.5 py-1.5 text-xs whitespace-nowrap flex items-center justify-center gap-1.5"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isSyncingElevenlabs ? 'animate-spin' : ''
                }`}
              />
              <span>{isId ? 'Cek Status API' : 'Check API Status'}</span>
            </button>
          </div>
        </div>

        {elevenlabsSyncStatus && (
          <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            {elevenlabsSyncStatus}
          </div>
        )}
      </div>

      {/* =====================================================================
       * TIER 2: FILTERABLE AI MODEL CATALOG & POPUP DETAIL INSPECTOR
       * ===================================================================== */}
      <div className={`${cardClass} rounded-[16px] p-6 space-y-4`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--vv-border)] pb-4">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 vv-text-emerald" />
              <span>
                {isId
                  ? `Daftar Lengkap Model & Harga Resmi Higgsfield AI (${filteredCatalog.length} dari ${catalog.length} Model)`
                  : `Complete Higgsfield AI Model & Reference Price List (${filteredCatalog.length} of ${catalog.length} Models)`}
              </span>
            </h2>
            <p className="text-xs text-[var(--vv-text-subtle)] mt-0.5">
              {isId
                ? 'Menampilkan Credit Higgsfield berdampingan dengan Harga USD & Rupiah. Klik "+ Tambah Model Baru" jika ada rilis model baru di Higgsfield.'
                : 'Displays Higgsfield Credits alongside USD & IDR prices. Click "+ Add New Model" whenever Higgsfield releases a new model.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddModelModalOpen(true)}
              className="vv-btn-accent px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>
                {isId ? '+ Tambah Model Baru' : '+ Add New Model'}
              </span>
            </button>

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
                {isId ? 'Sinkronkan Server' : 'Sync Server'}
              </span>
            </button>

            <button
              type="button"
              onClick={resetAllCatalogOverrides}
              className="vv-btn-secondary px-3.5 py-2 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>
                {isId ? 'Reset Harga Awal' : 'Reset Default'}
              </span>
            </button>
          </div>
        </div>

        {/* Search + Category Filter Pills */}
        <div className="flex flex-col md:flex-row gap-3 justify-between">
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
              {isId ? `Semua (${catalog.length})` : `All (${catalog.length})`}
            </button>
            {ALL_CATEGORIES.map((cat) => {
              const count = catalog.filter((m) =>
                m.supported_categories.includes(cat)
              ).length;
              return (
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
                  {SHORT_CATEGORY_LABELS[cat][language]} ({count})
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-[var(--vv-text-subtle)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isId
                  ? 'Cari model (Soul 2.0, Kling 3.0...)'
                  : 'Search model (Soul 2.0, Kling 3.0...)'
              }
              className={`${inputClass} w-full pl-8 pr-3 py-1.5 rounded-full text-xs`}
            />
          </div>
        </div>

        {/* Streamlined Scannable Model Table */}
        <div className="overflow-x-auto max-h-[540px] overflow-y-auto pr-1">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-[var(--vv-surface-strong)] z-10">
              <tr className="border-b border-[var(--vv-border)] text-[var(--vv-text-muted)]">
                <th className="py-2.5 text-left font-medium">
                  {isId ? 'Nama Model AI & Status' : 'AI Model Name & Tier'}
                </th>
                <th className="py-2.5 text-left font-medium">
                  {isId ? 'Jenis Pembuatan' : 'Creation Types'}
                </th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Credit Higgsfield' : 'Higgsfield Credit'}
                </th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Harga Acuan (USD)' : 'Ref Price (USD)'}
                </th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Perkiraan Rupiah' : 'Est. IDR'}
                </th>
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
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-semibold text-[var(--vv-text-primary)]">
                          {m.model_name}
                        </span>
                        {renderTierBadge(m.tier_badge)}
                        {m.unlimited_eligible && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                            Unlimited Ready
                          </span>
                        )}
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
                    <td className="py-3 text-right font-bold tabular-nums text-[#7acaff]">
                      {firstVar?.credit_cost !== null &&
                      firstVar?.credit_cost !== undefined
                        ? `${firstVar.credit_cost} Credit`
                        : 'N/A'}
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
            ? 'Kurs dan daftar harga model AI Higgsfield sudah siap. Kembali ke Daftar Pekerjaan atau langsung cetak Laporan PDF.'
            : 'Exchange rate and Higgsfield AI model prices are set. Return to your Production List or export your PDF Report.'
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
                      {v.credit_cost !== null ? `${v.credit_cost} Credit • ` : ''}
                      {formatCurrencyUsd(v.price_value, language)}{' '}
                      {fx.rate && v.price_value
                        ? `(${formatCurrencyIdr(v.price_value * fx.rate, language)})`
                        : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Ubah Harga Acuan Model */}
            <div className="vv-card-quiet p-4 space-y-3">
              <div className="font-semibold text-[var(--vv-text-strong)]">
                {isId
                  ? 'Ubah Credit atau Harga Acuan untuk Model Ini (Otomatis Terhubung):'
                  : 'Customize Credits or Reference Price for This Model:'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] text-[var(--vv-text-muted)] mb-1">
                    {isId ? 'Jumlah Credit Higgsfield' : 'Higgsfield Credits'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.25}
                    value={overrideCreditInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setOverrideCreditInput(val);
                      const num = Number(val);
                      if (Number.isFinite(num) && num > 0) {
                        setOverrideUsdInput(
                          String(Number((num * usdPerCredit).toFixed(4)))
                        );
                      }
                    }}
                    className={`${inputClass} w-full px-3 py-2 rounded-[9px] text-sm font-bold tabular-nums text-right`}
                  />
                </div>
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
              </div>
            </div>
          </div>
        </FrostedModal>
      )}

      {/* =====================================================================
       * FROSTED GLASS MODAL 3 (LAPIS 3): Tambah Model Baru Higgsfield Kapan Saja
       * ===================================================================== */}
      <FrostedModal
        isOpen={isAddModelModalOpen}
        onClose={() => setIsAddModelModalOpen(false)}
        theme={theme}
        maxWidth="lg"
        badgeLabel={
          isId
            ? 'Lapis 3 • Tambah Model Baru Higgsfield'
            : 'Layer 3 • Add New Higgsfield Model'
        }
        title={
          isId ? (
            <>
              Tambah Model Baru ke{' '}
              <span className="vv-accent text-[#0099ff]">Daftar Harga</span>
            </>
          ) : (
            <>
              Add New Model to{' '}
              <span className="vv-accent text-[#0099ff]">Price Catalog</span>
            </>
          )
        }
        subtitle={
          isId
            ? 'Jika Higgsfield merilis model AI baru hari ini, cukup masukkan nama dan jumlah Credit-nya di sini agar langsung tersedia di proyek Anda.'
            : 'Whenever Higgsfield releases a new AI model, simply enter its name and Credit cost here to make it immediately available in your projects.'
        }
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAddModelModalOpen(false)}
              className="vv-btn-secondary px-4 py-2 text-xs"
            >
              {isId ? 'Batal' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleSaveNewModel}
              disabled={!newModelName.trim()}
              className="vv-btn-accent px-5 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isId ? 'Simpan Model Baru' : 'Save New Model'}
              </span>
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--vv-text-strong)] mb-1">
                {isId ? 'Nama Model AI Baru' : 'New AI Model Name'}
              </label>
              <input
                type="text"
                placeholder="Misal: Kling 3.5 Pro / Soul 3.0"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                className={`${inputClass} w-full px-3 py-2 rounded-[9px] text-xs`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[var(--vv-text-strong)] mb-1">
                {isId ? 'Keluarga / Pembuat Model' : 'Model Family / Creator'}
              </label>
              <input
                type="text"
                placeholder="Misal: Higgsfield Soul / Kuaishou Kling"
                value={newModelFamily}
                onChange={(e) => setNewModelFamily(e.target.value)}
                className={`${inputClass} w-full px-3 py-2 rounded-[9px] text-xs`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--vv-text-strong)] mb-1">
                {isId ? 'Jenis Pembuatan' : 'Creation Category'}
              </label>
              <select
                value={newModelCategory}
                onChange={(e) =>
                  setNewModelCategory(e.target.value as ProcessCategory)
                }
                className={`${inputClass} w-full px-3 py-2 rounded-[9px] text-xs`}
              >
                {ALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {SHORT_CATEGORY_LABELS[cat][language]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[var(--vv-text-strong)] mb-1">
                {isId ? 'Cara Hitung Biaya' : 'Pricing Unit'}
              </label>
              <select
                value={newModelUnit}
                onChange={(e) => setNewModelUnit(e.target.value as PricingUnit)}
                className={`${inputClass} w-full px-3 py-2 rounded-[9px] text-xs`}
              >
                <option value="per_generation">
                  {PRICING_UNIT_LABELS.per_generation[language]}
                </option>
                <option value="per_second">
                  {PRICING_UNIT_LABELS.per_second[language]}
                </option>
                <option value="per_asset">
                  {PRICING_UNIT_LABELS.per_asset[language]}
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--vv-text-strong)] mb-1">
                {isId
                  ? 'Jumlah Credit di Higgsfield'
                  : 'Higgsfield Credit Cost'}
              </label>
              <input
                type="number"
                min={0.1}
                step={0.25}
                value={newModelCredit}
                onChange={(e) => setNewModelCredit(e.target.value)}
                className={`${inputClass} w-full px-3 py-2 rounded-[9px] text-sm font-bold tabular-nums text-right`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[var(--vv-text-strong)] mb-1">
                {isId ? 'Label Penanda Model' : 'Model Tier Badge'}
              </label>
              <select
                value={newModelBadge}
                onChange={(e) =>
                  setNewModelBadge(e.target.value as ModelTierBadge)
                }
                className={`${inputClass} w-full px-3 py-2 rounded-[9px] text-xs`}
              >
                <option value="NEW">NEW (Model Baru Rilis)</option>
                <option value="PREMIUM">PREMIUM (Kualitas Tertinggi)</option>
                <option value="POPULER">POPULER (Sering Dipakai)</option>
                <option value="STANDARD">Standar</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={newModelUnlimited}
              onChange={(e) => setNewModelUnlimited(e.target.checked)}
              className="rounded border-[var(--vv-border)]"
            />
            <span className="text-xs text-[var(--vv-text-strong)]">
              {isId
                ? 'Model ini bisa digunakan gratis pada Paket Unlimited Higgsfield'
                : 'This model is eligible for Higgsfield Unlimited Plan (0 Credits)'}
            </span>
          </label>

          <div className="vv-card-quiet p-3.5 flex items-center justify-between">
            <span className="text-[var(--vv-text-muted)]">
              {isId
                ? 'Otomatis Terhitung ke USD & Rupiah:'
                : 'Auto-Calculated USD & IDR:'}
            </span>
            <strong className="text-sm tabular-nums text-[#0099ff]">
              {Number(newModelCredit) || 0} Credit &bull;{' '}
              {formatCurrencyUsd(
                (Number(newModelCredit) || 0) * usdPerCredit,
                language
              )}{' '}
              {fx.rate
                ? `(${formatCurrencyIdr(
                    (Number(newModelCredit) || 0) * usdPerCredit * fx.rate,
                    language
                  )})`
                : ''}
            </strong>
          </div>
        </div>
      </FrostedModal>
    </div>
  );
};
