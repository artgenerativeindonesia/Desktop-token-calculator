import React, { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import {
  CATEGORY_LABELS,
  formatCurrencyIdr,
  formatCurrencyUsd,
  PRICING_UNIT_LABELS,
  UI_TEXT,
} from '../i18n/translations';
import { StatusBadge } from './StatusBadge';
import {
  Database,
  Globe,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

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
    resetAllCatalogOverrides,
  } = useProjectStore();

  const t = UI_TEXT[language];
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';
  const inputClass =
    theme === 'dark' ? 'glass-input-dark' : 'glass-input-light';
  const fx = project.exchange_rate;

  const [manualFxInput, setManualFxInput] = useState<string>(
    fx.rate ? String(fx.rate) : '16250'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${cardClass} rounded-[16px] p-6`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="vv-badge-pill">
            <Database className="w-3.5 h-3.5 text-[#0099ff]" />
            <span>{isId ? 'Sumber Data & Kurs' : 'Data Sources & FX'}</span>
          </span>
        </div>
        <h1 className="text-2xl font-medium tracking-[-0.035em]">
          {isId ? (
            <>
              Pengaturan Kurs Rupiah &{' '}
              <span className="vv-accent text-[#0099ff]">Daftar Harga Model AI</span>
            </>
          ) : (
            <>
              Exchange Rate Settings &{' '}
              <span className="vv-accent text-[#0099ff]">AI Model Price List</span>
            </>
          )}
        </h1>
        <p className="text-xs text-[var(--vv-text-muted)] mt-1">
          {isId
            ? 'Perbarui nilai tukar Dolar ke Rupiah secara otomatis dari internet, atau isi kurs sendiri jika sedang bekerja tanpa koneksi internet.'
            : 'Update the USD to IDR exchange rate automatically from the internet, or enter your own rate when working offline.'}
        </p>
      </div>

      {/* Bagian 1: Kurs USD/IDR Otomatis & Manual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${cardClass} rounded-[16px] p-6 space-y-4`}>
          <div className="flex items-center justify-between border-b border-[var(--vv-border)] pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)] flex items-center gap-2">
              <span className="font-mono text-[10px] text-[var(--vv-text-subtle)]">01</span>
              <Globe className="w-4 h-4 text-[#0099ff]" />
              <span>
                {isId
                  ? 'Kurs Dolar ke Rupiah Otomatis'
                  : 'Automatic USD to IDR Exchange Rate'}
              </span>
            </h2>
            <StatusBadge status={fx.status} language={language} />
          </div>

          <div className="p-4 rounded-[12px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border)] space-y-2">
            <div className="text-xs text-[var(--vv-text-muted)]">
              {isId ? 'Nilai Kurs Saat Ini:' : 'Current Exchange Rate:'}
            </div>
            <div className="text-2xl font-bold tabular-nums text-[#0099ff] text-right">
              1 USD ={' '}
              {fx.rate ? formatCurrencyIdr(fx.rate, language) : t.unavailableLabel}
            </div>
            <div className="text-xs text-[var(--vv-text-muted)] space-y-1 pt-2 border-t border-[var(--vv-border)]">
              <div>
                <strong className="text-[var(--vv-text-strong)]">{isId ? 'Sumber Data:' : 'Source:'}</strong> {fx.source_name}
              </div>
              <div>
                <strong className="text-[var(--vv-text-strong)]">{isId ? 'Keterangan:' : 'Rate Type:'}</strong>{' '}
                {fx.rate_type}
              </div>
              <div>
                <strong className="text-[var(--vv-text-strong)]">{isId ? 'Terakhir Diperbarui:' : 'Last Updated:'}</strong>{' '}
                {fx.retrieved_at.slice(0, 19).replace('T', ' ')}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={refreshExchangeRateAuto}
            disabled={isRefreshingFx}
            className="vv-btn-primary w-full py-2.5 px-4 text-xs"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshingFx ? 'animate-spin' : ''}`}
            />
            <span>
              {isId
                ? 'Perbarui Kurs Otomatis dari Internet'
                : 'Update Exchange Rate from Internet'}
            </span>
          </button>
        </div>

        {/* Input Kurs Manual */}
        <div className={`${cardClass} rounded-[16px] p-6 space-y-4`}>
          <div className="flex items-center gap-2 border-b border-[var(--vv-border)] pb-3">
            <span className="font-mono text-[10px] text-[var(--vv-text-subtle)]">02</span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)]">
              {isId
                ? 'Isi Kurs Sendiri (Saat Tanpa Internet / Kurs Perusahaan)'
                : 'Enter Custom Rate (Offline / Company Rate)'}
            </h2>
          </div>
          <p className="text-xs text-[var(--vv-text-muted)] leading-relaxed">
            {isId
              ? 'Jika sedang tidak terhubung ke internet atau ingin memakai patokan kurs sendiri, silakan ketik nilai Rupiah untuk 1 Dolar di bawah ini.'
              : 'If working offline or using an internal company budget rate, enter your custom IDR value per 1 USD below.'}
          </p>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-[var(--vv-text-strong)] mb-1">
                {isId ? 'Nilai Rupiah untuk 1 USD' : 'IDR Value per 1 USD'}
              </label>
              <input
                type="number"
                min={100}
                step={50}
                value={manualFxInput}
                onChange={(e) => setManualFxInput(e.target.value)}
                className={`${inputClass} w-full px-3.5 py-2.5 rounded-[10px] text-base font-bold tabular-nums text-right`}
              />
            </div>
            <button
              type="button"
              onClick={() => setManualExchangeRate(Number(manualFxInput))}
              className="vv-btn-accent mt-5 px-5 py-2.5 text-xs"
            >
              {isId ? 'Gunakan Kurs Ini' : 'Use This Rate'}
            </button>
          </div>
        </div>
      </div>

      {/* Bagian 3: Katalog Model Higgsfield Terverifikasi */}
      <div className={`${cardClass} rounded-[16px] p-6 space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--vv-border)] pb-4">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)] flex items-center gap-2">
              <span className="font-mono text-[10px] text-[var(--vv-text-subtle)]">03</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {isId
                  ? 'Daftar Model & Harga Referensi Resmi Higgsfield AI'
                  : 'Official Higgsfield AI Model & Reference Price List'}
              </span>
            </h2>
            <p className="text-xs text-[var(--vv-text-muted)] mt-1">
              {isId
                ? 'Daftar model AI yang tersedia beserta jenis pembuatan yang didukung dan harga acuannya.'
                : 'List of available AI models along with supported creation types and reference prices.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshCatalogAuto}
              disabled={isRefreshingCatalog}
              className="vv-btn-secondary px-3.5 py-1.5 text-xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isRefreshingCatalog ? 'animate-spin' : ''
                }`}
              />
              <span>{isId ? 'Muat Ulang Daftar Harga' : 'Refresh Price List'}</span>
            </button>

            <button
              type="button"
              onClick={resetAllCatalogOverrides}
              className="vv-btn-secondary px-3.5 py-1.5 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isId ? 'Kembalikan ke Harga Awal' : 'Reset to Default Prices'}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--vv-border)] text-[var(--vv-text-muted)]">
                <th className="py-2.5 text-left font-medium">Model Higgsfield</th>
                <th className="py-2.5 text-left font-medium">
                  {isId ? 'Jenis Pembuatan yang Didukung' : 'Supported Creation Types'}
                </th>
                <th className="py-2.5 text-left font-medium">
                  {isId ? 'Satuan Harga' : 'Pricing Unit'}
                </th>
                <th className="py-2.5 text-right font-medium">
                  {isId ? 'Harga Acuan (USD)' : 'Reference Price (USD)'}
                </th>
                <th className="py-2.5 text-right font-medium">Credit</th>
                <th className="py-2.5 text-left font-medium">
                  {isId ? 'Sumber & Tanggal' : 'Source & Date'}
                </th>
                <th className="py-2.5 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--vv-border)]">
              {catalog.map((m) => {
                const firstVar = m.pricing_variants[0];
                return (
                  <tr key={m.model_id} className="hover:bg-[var(--vv-tint-weak)] transition-colors">
                    <td className="py-3">
                      <div className="font-semibold">{m.model_name}</div>
                      <div className="text-[10px] text-[var(--vv-text-subtle)] font-mono">
                        {m.model_id}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {m.supported_categories.map((c) => (
                          <span
                            key={c}
                            className="px-2 py-0.5 rounded-full bg-[var(--vv-tint-weak)] border border-[var(--vv-border)] text-[10px]"
                          >
                            {CATEGORY_LABELS[c][language]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 text-[var(--vv-text-muted)]">
                      {firstVar
                        ? PRICING_UNIT_LABELS[firstVar.pricing_unit][language]
                        : '-'}
                    </td>
                    <td className="py-3 text-right font-bold tabular-nums">
                      {firstVar?.price_value !== null &&
                      firstVar?.price_value !== undefined
                        ? formatCurrencyUsd(firstVar.price_value, language)
                        : t.unavailableLabel}
                    </td>
                    <td className="py-3 text-right tabular-nums text-[#7acaff]">
                      {firstVar?.credit_cost !== null &&
                      firstVar?.credit_cost !== undefined
                        ? `${firstVar.credit_cost} cr`
                        : 'N/A'}
                    </td>
                    <td className="py-3 text-[11px] text-[var(--vv-text-muted)]">
                      <div>{m.source_name}</div>
                      <div className="text-[10px] text-[var(--vv-text-subtle)]">
                        {m.retrieved_at.slice(0, 10)}
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <StatusBadge
                        status={firstVar?.status || 'unavailable'}
                        language={language}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
