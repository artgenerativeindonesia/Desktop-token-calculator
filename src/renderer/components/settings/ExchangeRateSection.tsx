import React, { useState } from 'react';
import { ExchangeRate } from '../../../shared/types/project';
import { formatCurrencyIdr, UI_TEXT } from '../../i18n/translations';
import { StatusBadge } from '../StatusBadge';
import { FrostedModal } from '../FrostedModal';
import { Database, Edit3, Globe, RefreshCw } from 'lucide-react';

interface ExchangeRateSectionProps {
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  exchangeRate: ExchangeRate;
  usdPerCredit: number;
  totalModelsCount: number;
  isRefreshingFx: boolean;
  onRefreshExchangeRate: () => void;
  onSetManualExchangeRate: (rate: number) => void;
  projectCalculationTotalCostUsd: number;
}

export const ExchangeRateSection: React.FC<ExchangeRateSectionProps> = ({
  language,
  theme,
  exchangeRate,
  usdPerCredit,
  totalModelsCount,
  isRefreshingFx,
  onRefreshExchangeRate,
  onSetManualExchangeRate,
  projectCalculationTotalCostUsd,
}) => {
  const isId = language === 'id';
  const t = UI_TEXT[language];
  const heroCardClass =
    theme === 'dark' ? 'vv-card-hero-dark' : 'vv-card-hero-light';
  const inputClass = theme === 'dark' ? 'glass-input-dark' : 'glass-input-light';

  const [isManualFxModalOpen, setIsManualFxModalOpen] = useState(false);
  const [manualFxInput, setManualFxInput] = useState<string>(
    exchangeRate.rate ? String(exchangeRate.rate) : '16250'
  );

  return (
    <div className="space-y-4">
      {/* TIER 1: DOMINANT FOCAL POINT — UNIFIED EXCHANGE RATE HERO CARD */}
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
              <StatusBadge status={exchangeRate.status} language={language} />
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
                  {exchangeRate.source_name}
                </strong>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[var(--vv-text-subtle)]">
                  {isId ? 'Patokan Nilai 1 Credit' : '1 Credit Benchmark'}
                </span>
                <strong className="text-[#0099ff] font-mono">
                  ${usdPerCredit.toFixed(4)} USD (
                  {exchangeRate.rate
                    ? formatCurrencyIdr(usdPerCredit * exchangeRate.rate, language)
                    : '-'}
                  )
                </strong>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[var(--vv-text-subtle)]">
                  {isId ? 'Total Model Tersedia' : 'Total Models Available'}
                </span>
                <strong className="text-[var(--vv-text-strong)] font-mono">
                  {totalModelsCount} Model Resmi & Kustom
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
                {exchangeRate.rate
                  ? formatCurrencyIdr(exchangeRate.rate, language)
                  : t.unavailableLabel}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={onRefreshExchangeRate}
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
                  setManualFxInput(exchangeRate.rate ? String(exchangeRate.rate) : '16250');
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

      {/* FROSTED GLASS MODAL 1: Atur Kurs Dolar ke Rupiah Secara Manual */}
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
                onSetManualExchangeRate(Number(manualFxInput));
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
                  projectCalculationTotalCostUsd *
                    (Number(manualFxInput) || 0),
                  language
                )}
              </strong>
            </div>
          </div>
        </div>
      </FrostedModal>
    </div>
  );
};
