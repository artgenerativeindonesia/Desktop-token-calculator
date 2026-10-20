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
      <div className={`${cardClass} rounded-2xl p-6`}>
        <h1 className="text-xl font-bold flex items-center gap-2.5">
          <Database className="w-5 h-5 text-sky-400" />
          <span>
            {isId
              ? 'Pengaturan Kurs USD/IDR & Katalog Model Higgsfield (PRD Bab 9)'
              : 'USD/IDR Exchange Rate & Higgsfield Model Catalog (PRD Sec 9)'}
          </span>
        </h1>
        <p className="text-xs opacity-75 mt-1">
          {isId
            ? 'Kelola sumber nilai tukar USD/IDR gratis dan tinjau status verifikasi katalog model Higgsfield tanpa perlu memasukkan API Key teknis.'
            : 'Manage free USD/IDR exchange rate sources and inspect verified Higgsfield model catalog status without technical API keys.'}
        </p>
      </div>

      {/* Bagian 1: Kurs USD/IDR Otomatis & Fallback Manual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${cardClass} rounded-2xl p-6 space-y-4`}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider opacity-80 flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>
                {isId
                  ? '1. Sumber Kurs USD/IDR Otomatis (Gratis)'
                  : '1. Automatic Free USD/IDR Exchange Rate'}
              </span>
            </h2>
            <StatusBadge status={fx.status} language={language} />
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="text-xs opacity-70">
              {isId ? 'Nilai Kurs Aktif (X):' : 'Active Exchange Rate (X):'}
            </div>
            <div className="text-2xl font-extrabold tabular-nums text-sky-400 text-right">
              1 USD ={' '}
              {fx.rate ? formatCurrencyIdr(fx.rate, language) : t.unavailableLabel}
            </div>
            <div className="text-xs opacity-75 space-y-1 pt-2 border-t border-white/10">
              <div>
                <strong>{isId ? 'Sumber:' : 'Source:'}</strong> {fx.source_name}
              </div>
              <div>
                <strong>{isId ? 'Jenis Kurs:' : 'Rate Type:'}</strong>{' '}
                {fx.rate_type}
              </div>
              <div>
                <strong>{isId ? 'Waktu Pengambilan:' : 'Retrieved At:'}</strong>{' '}
                {fx.retrieved_at}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={refreshExchangeRateAuto}
            disabled={isRefreshingFx}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/25 transition"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshingFx ? 'animate-spin' : ''}`}
            />
            {isId
              ? 'Perbarui Kurs Otomatis (Frankfurter ECB / Open ER-API)'
              : 'Refresh Rate Automatically (Frankfurter ECB / Open ER-API)'}
          </button>
        </div>

        {/* Input Kurs Manual (Fallback PRD FR-08) */}
        <div className={`${cardClass} rounded-2xl p-6 space-y-4`}>
          <h2 className="text-sm font-bold uppercase tracking-wider opacity-80">
            {isId
              ? '2. Input Kurs Manual (Fallback Offline / Kebijakan Tim)'
              : '2. Manual Exchange Rate Input (Offline Fallback)'}
          </h2>
          <p className="text-xs opacity-75">
            {isId
              ? 'Jika Anda sedang bekerja tanpa koneksi internet atau ingin menggunakan kurs anggaran internal perusahaan, ketik angka kurs di bawah ini. Sistem otomatis menandainya dengan label Manual.'
              : 'If working offline or using an internal company budget rate, enter your custom USD to IDR rate below. It will be clearly labeled as Manual.'}
          </p>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">
                {isId ? 'Nilai IDR per 1 USD' : 'IDR Value per 1 USD'}
              </label>
              <input
                type="number"
                min={100}
                step={50}
                value={manualFxInput}
                onChange={(e) => setManualFxInput(e.target.value)}
                className={`${inputClass} w-full px-3.5 py-2.5 rounded-xl text-base font-bold tabular-nums text-right`}
              />
            </div>
            <button
              type="button"
              onClick={() => setManualExchangeRate(Number(manualFxInput))}
              className="mt-5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition"
            >
              {isId ? 'Terapkan Kurs Manual' : 'Apply Manual Rate'}
            </button>
          </div>
        </div>
      </div>

      {/* Bagian 3: Katalog Model Higgsfield Terverifikasi */}
      <div className={`${cardClass} rounded-2xl p-6 space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider opacity-80 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {isId
                  ? '3. Katalog Model & Parameter Resmi Higgsfield (PRD Bab 6 & 9.1)'
                  : '3. Official Higgsfield Model & Parameter Catalog (PRD Sec 6 & 9.1)'}
              </span>
            </h2>
            <p className="text-xs opacity-70 mt-0.5">
              {isId
                ? 'Menampilkan daftar model, kategori yang didukung, satuan tarif, nilai referensi, dan status verifikasi.'
                : 'Displays model entries, supported categories, pricing units, reference values, and verification status.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshCatalogAuto}
              disabled={isRefreshingCatalog}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/15 transition"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isRefreshingCatalog ? 'animate-spin' : ''
                }`}
              />
              {isId ? 'Cek Sinkronisasi Katalog' : 'Verify Catalog Sync'}
            </button>

            <button
              type="button"
              onClick={resetAllCatalogOverrides}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/15 border border-white/10 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {isId ? 'Reset Default' : 'Reset Defaults'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/15 opacity-75">
                <th className="py-2.5 text-left">Model Higgsfield</th>
                <th className="py-2.5 text-left">
                  {isId ? 'Kategori yang Didukung' : 'Supported Categories'}
                </th>
                <th className="py-2.5 text-left">
                  {isId ? 'Satuan Harga' : 'Pricing Unit'}
                </th>
                <th className="py-2.5 text-right">
                  {isId ? 'Tarif Referensi (USD)' : 'Reference Rate (USD)'}
                </th>
                <th className="py-2.5 text-right">Credit</th>
                <th className="py-2.5 text-left">
                  {isId ? 'Sumber & Tanggal' : 'Source & Date'}
                </th>
                <th className="py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {catalog.map((m) => {
                const firstVar = m.pricing_variants[0];
                return (
                  <tr key={m.model_id} className="hover:bg-white/5">
                    <td className="py-2.5">
                      <div className="font-semibold">{m.model_name}</div>
                      <div className="text-[10px] opacity-60 font-mono">
                        {m.model_id}
                      </div>
                    </td>
                    <td className="py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {m.supported_categories.map((c) => (
                          <span
                            key={c}
                            className="px-2 py-0.5 rounded bg-white/10 text-[10px]"
                          >
                            {CATEGORY_LABELS[c][language]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5">
                      {firstVar
                        ? PRICING_UNIT_LABELS[firstVar.pricing_unit][language]
                        : '-'}
                    </td>
                    <td className="py-2.5 text-right font-bold tabular-nums">
                      {firstVar?.price_value !== null &&
                      firstVar?.price_value !== undefined
                        ? formatCurrencyUsd(firstVar.price_value, language)
                        : t.unavailableLabel}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-purple-300">
                      {firstVar?.credit_cost !== null &&
                      firstVar?.credit_cost !== undefined
                        ? `${firstVar.credit_cost} cr`
                        : 'N/A'}
                    </td>
                    <td className="py-2.5 text-[11px] opacity-75">
                      <div>{m.source_name}</div>
                      <div className="text-[10px] opacity-60">
                        {m.retrieved_at.slice(0, 10)}
                      </div>
                    </td>
                    <td className="py-2.5 text-center">
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
