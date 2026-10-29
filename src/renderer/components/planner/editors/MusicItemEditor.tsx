import React from 'react';
import { ProductionItem, ItemCalculationResult } from '../../../../shared/types/project';
import { formatCurrencyIdr, formatCurrencyUsd } from '../../../i18n/translations';
import { InfoTip } from '../../InfoTip';
import { Music } from 'lucide-react';
import {
  calculateSunoCostIdr,
  calculateSunoCostUsd,
  getSunoPlanById,
} from '../../../../shared/catalog/sunoCatalog';

interface MusicItemEditorProps {
  item: ProductionItem;
  calcRow?: ItemCalculationResult;
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  exchangeRate: number | null;
  sunoPlanId?: string;
  defaultAttemptsPerShot: number;
  modelName: string;
  onUpdateField: (itemId: string, fields: Partial<ProductionItem>) => void;
}

export const MusicItemEditor: React.FC<MusicItemEditorProps> = ({
  item,
  calcRow,
  language,
  theme,
  exchangeRate,
  sunoPlanId = 'pro',
  defaultAttemptsPerShot,
  modelName,
  onUpdateField,
}) => {
  const isId = language === 'id';
  const inputClass = theme === 'dark' ? 'glass-input-dark' : 'glass-input-light';

  const cadanganCount = Math.max(
    1,
    defaultAttemptsPerShot || item.attempts_per_item || 1
  );
  const songQty = Math.max(1, Number(item.quantity) || 1);
  const budgetedGen = calcRow?.budgeted_generations ?? songQty * cadanganCount;

  // Fitur Stem Separation (Otomatis 1x per Lagu Jadi jika diaktifkan)
  const isStemEnabled =
    item.stem_enabled ??
    (item.stem_separation_mode && item.stem_separation_mode !== 'none');
  const stemType =
    item.stem_type ||
    (item.stem_separation_mode === 'full_stems' ? 'full_stems' : 'two_stems');
  const stemRate = stemType === 'full_stems' ? 50 : 20;

  // Kalkulasi Total Kredit Suno (Seragam dengan calculationEngine.ts)
  const songTotalCredits = budgetedGen * 10;
  const stemTotalCredits = isStemEnabled ? songQty * stemRate : 0;
  const totalSunoCr =
    calcRow?.total_credit ?? songTotalCredits + stemTotalCredits;

  const activeSunoPlan = getSunoPlanById(sunoPlanId as any);
  const costUsd =
    calcRow?.total_cost_usd ??
    calculateSunoCostUsd(totalSunoCr, activeSunoPlan.plan_id);
  const costIdr =
    calcRow?.total_cost_idr ??
    (exchangeRate
      ? calculateSunoCostIdr(totalSunoCr, activeSunoPlan.plan_id, exchangeRate)
      : null);

  return (
    <div className="vv-card-quiet p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-[var(--vv-text-strong)] flex items-center gap-1.5">
          <Music className="w-4 h-4 text-purple-400" />
          <span>
            {isId
              ? '4. Kuantitas Lagu & Pemisahan Track Audio (Suno AI)'
              : '4. Song Quantity & Stem Separation (Suno AI)'}
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 font-semibold border border-purple-500/30">
          Suno AI Official
        </span>
      </div>

      {/* 1. Jumlah Lagu & Pengali Cadangan Langkah 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-[10px] bg-[var(--vv-surface-soft)] border border-[var(--vv-border)]">
        <div>
          <label className="block text-[11px] font-semibold text-[var(--vv-text-strong)] mb-1 flex items-center gap-1">
            <span>🎼</span>
            <span>
              {isId ? 'Mau Buat Berapa Lagu?' : 'How Many Songs?'}
            </span>
            <InfoTip>
              {isId
                ? 'Jumlah track lagu selesai yang Anda butuhkan (contoh: 1 lagu OST tema atau 2 lagu latar adegan). Tarif Suno flat 10 kredit per generate (menghasilkan 2 variasi lagu utuh).'
                : 'Number of finished songs needed. Suno charges a flat 10 credits per generation (yielding 2 full song variations).'}
            </InfoTip>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              step={1}
              value={songQty}
              onChange={(e) => {
                const qty = Math.max(
                  1,
                  Math.floor(Number(e.target.value) || 1)
                );
                onUpdateField(item.item_id, {
                  quantity: qty,
                  music_reserve_override: undefined,
                });
              }}
              className={`${inputClass} w-28 px-3 py-1.5 rounded-[9px] text-xs font-bold tabular-nums text-right`}
            />
            <span className="text-xs font-semibold text-[var(--vv-text-muted)]">
              {isId ? 'lagu' : 'songs'}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center sm:items-end text-[11px] text-[var(--vv-text-muted)]">
          <span>
            {isId
              ? 'Total Rencana Generate (Termasuk Cadangan Langkah 2):'
              : 'Total Planned Generations (Incl. Step 2 Reserve):'}
          </span>
          <span className="text-xs font-bold text-purple-300 font-mono mt-0.5">
            {songQty} {isId ? 'lagu' : 'songs'} &times; {cadanganCount}{' '}
            {isId ? 'cadangan' : 'reserve'} = {budgetedGen}x{' '}
            {isId ? 'buat' : 'runs'} ({budgetedGen * 2}{' '}
            {isId ? 'variasi klip' : 'clip variations'})
          </span>
        </div>
      </div>

      {/* 2. Pemisahan Track Audio (Stem Separation) - Otomatis 1x per Lagu Jadi */}
      <div className="p-3.5 rounded-[10px] bg-[var(--vv-surface-soft)] border border-[var(--vv-border)] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-[var(--vv-text-strong)] flex items-center gap-1.5">
            <span>🎚️</span>
            <span>
              {isId
                ? 'Pemisahan Track Audio (Stem Separation)'
                : 'Audio Track Separation (Stem Separation)'}
            </span>
            <InfoTip>
              {isId
                ? 'Fitur resmi Suno untuk memisahkan vokal dan instrumen pada lagu terpilih yang sudah jadi (otomatis dihitung 1x per lagu jadi).'
                : 'Official Suno stem isolation for your finished song (automatically calculated 1x per finished song).'}
            </InfoTip>
          </label>
          <span className="text-[10px] text-purple-400 font-medium">
            {isId
              ? 'Otomatis 1x per Lagu Jadi'
              : 'Auto 1x per Finished Song'}
          </span>
        </div>

        {/* Tombol Toggle Utama: Aktif / Tidak */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() =>
              onUpdateField(item.item_id, {
                stem_enabled: false,
                stem_separation_mode: 'none',
                stem_runs: 1,
                stem_reserve: 0,
              })
            }
            className={`py-2 px-3 rounded-[9px] text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
              !isStemEnabled
                ? 'bg-purple-600/25 text-purple-200 border-purple-400/50 shadow-sm'
                : 'bg-[var(--vv-field)] text-[var(--vv-text-muted)] border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
            }`}
          >
            <span>🎛️</span>
            <span>
              {isId
                ? 'Tidak (Stereo Mix Standar - 0 Cr)'
                : 'No (Standard Stereo Mix - 0 Cr)'}
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              onUpdateField(item.item_id, {
                stem_enabled: true,
                stem_separation_mode:
                  stemType === 'full_stems' ? 'full_stems' : 'two_stems',
                stem_runs: 1,
                stem_reserve: 0,
              })
            }
            className={`py-2 px-3 rounded-[9px] text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
              isStemEnabled
                ? 'bg-purple-600/25 text-purple-200 border-purple-400/50 shadow-sm'
                : 'bg-[var(--vv-field)] text-[var(--vv-text-muted)] border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
            }`}
          >
            <span>✨</span>
            <span>
              {isId
                ? 'Ya (Pisahkan Vokal & Instrumen)'
                : 'Yes (Separate Vocals & Instruments)'}
            </span>
          </button>
        </div>

        {/* Jika Stem Aktif, Tampilkan 2 Pilihan Tipe Stem */}
        {isStemEnabled && (
          <div className="p-3 rounded-[9px] bg-purple-950/25 border border-purple-500/25 space-y-2">
            <label className="block text-[10px] font-semibold text-[var(--vv-text-strong)]">
              {isId
                ? 'Pilih Jenis Pemisahan Track (1x per Lagu Jadi):'
                : 'Select Stem Separation Type (1x per Finished Song):'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  onUpdateField(item.item_id, {
                    stem_type: 'two_stems',
                    stem_separation_mode: 'two_stems',
                    stem_runs: 1,
                    stem_reserve: 0,
                  })
                }
                className={`p-2.5 rounded-[8px] text-xs border text-left transition flex flex-col justify-between gap-1 ${
                  stemType === 'two_stems'
                    ? 'bg-purple-600/30 text-purple-200 border-purple-400/60 shadow-sm'
                    : 'bg-[var(--vv-field)] text-[var(--vv-text-muted)] border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1">
                    <span>🎙️</span>
                    <span>2-Stems Split</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                    +20 Cr / {isId ? 'lagu' : 'song'}
                  </span>
                </div>
                <span className="text-[10px] opacity-80 leading-relaxed">
                  {isId
                    ? 'Pisahkan Vokal & Musik Latar. Rekomendasi utama agar dialog aktor tetap jernih.'
                    : 'Isolates Vocals & Instrumental. Recommended for clear dialogue.'}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onUpdateField(item.item_id, {
                    stem_type: 'full_stems',
                    stem_separation_mode: 'full_stems',
                    stem_runs: 1,
                    stem_reserve: 0,
                  })
                }
                className={`p-2.5 rounded-[8px] text-xs border text-left transition flex flex-col justify-between gap-1 ${
                  stemType === 'full_stems'
                    ? 'bg-purple-600/30 text-purple-200 border-purple-400/60 shadow-sm'
                    : 'bg-[var(--vv-field)] text-[var(--vv-text-muted)] border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1">
                    <span>🎚️</span>
                    <span>Full Studio Auto-Split</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                    +50 Cr / {isId ? 'lagu' : 'song'}
                  </span>
                </div>
                <span className="text-[10px] opacity-80 leading-relaxed">
                  {isId
                    ? 'Pisahkan hingga 12 instrumen terpisah (drum, bass, vokal, gitar, keys, FX) untuk mixing studio.'
                    : 'Up to 12 individual instrument tracks for full DAW studio mixing.'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Live Suno Calculation Summary Card */}
      <div className="p-3.5 rounded-[12px] bg-purple-950/20 border border-purple-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] gap-1 text-[var(--vv-text-muted)]">
          <span className="flex items-center gap-1.5 font-semibold text-purple-200">
            <span>📊</span>
            <span>
              {isId ? 'Ringkasan Kalkulasi Biaya Suno AI' : 'Suno AI Cost Breakdown'}
            </span>
          </span>
          <span className="font-semibold text-purple-300">
            {modelName || 'Suno v5.5'} • Paket {activeSunoPlan.name_id}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-purple-500/20">
          {/* Kartu 1: Kredit Lagu */}
          <div className="p-2.5 rounded-[8px] bg-[var(--vv-field)]/60 border border-[var(--vv-border)]">
            <span className="text-[10px] text-[var(--vv-text-subtle)] block">
              {isId ? '1. Kredit Pembuatan Lagu' : '1. Song Creation Credits'}
            </span>
            <span className="text-xs font-bold font-mono text-[var(--vv-text-primary)]">
              {songTotalCredits.toLocaleString()} Cr Suno
            </span>
            <span className="text-[10px] text-[var(--vv-text-muted)] block font-mono mt-0.5">
              {songQty} {isId ? 'lagu' : 'songs'} &times; {cadanganCount}{' '}
              {isId ? 'cadangan' : 'reserve'} &times; 10 Cr
            </span>
          </div>

          {/* Kartu 2: Kredit Stem */}
          <div className="p-2.5 rounded-[8px] bg-[var(--vv-field)]/60 border border-[var(--vv-border)]">
            <span className="text-[10px] text-[var(--vv-text-subtle)] block">
              {isId ? '2. Kredit Pemisahan Stems' : '2. Stem Separation Credits'}
            </span>
            <span className="text-xs font-bold font-mono text-emerald-300">
              {isStemEnabled
                ? `+${stemTotalCredits.toLocaleString()} Cr Suno`
                : isId
                ? '0 Cr (Tidak Aktif)'
                : '0 Cr (Disabled)'}
            </span>
            <span className="text-[10px] text-[var(--vv-text-muted)] block font-mono mt-0.5">
              {isStemEnabled
                ? `${songQty} ${isId ? 'lagu jadi' : 'finished songs'} \u00d7 ${stemRate} Cr`
                : isId
                ? 'Stereo Mix Standar'
                : 'Standard Stereo Mix'}
            </span>
          </div>

          {/* Kartu 3: Total Kredit Suno */}
          <div className="p-2.5 rounded-[8px] bg-[var(--vv-field)]/60 border border-[var(--vv-border)]">
            <span className="text-[10px] text-[var(--vv-text-subtle)] block">
              {isId ? '3. Total Kredit & Biaya Tahap' : '3. Stage Total Credits & Cost'}
            </span>
            <span className="text-xs font-bold font-mono text-purple-300">
              {totalSunoCr.toLocaleString()} Cr Suno
            </span>
            <span className="text-[10px] text-emerald-400 font-bold block tabular-nums mt-0.5">
              {costIdr !== null
                ? formatCurrencyIdr(costIdr, language)
                : formatCurrencyUsd(costUsd, language)}{' '}
              <span className="text-[var(--vv-text-muted)] font-mono font-normal">
                ({formatCurrencyUsd(costUsd, language)})
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
