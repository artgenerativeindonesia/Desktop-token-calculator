import React from 'react';
import { ProductionItem, ItemCalculationResult } from '../../../../shared/types/project';
import { formatCurrencyIdr, formatCurrencyUsd } from '../../../i18n/translations';
import { InfoTip } from '../../InfoTip';
import { formatDualDuration } from '../plannerTypes';
import { Mic } from 'lucide-react';
import {
  convertDurationToCharacters,
  convertCharactersToDuration,
  calculateElevenLabsCredits,
  calculateElevenLabsCostUsd,
  calculateElevenLabsCostIdr,
  getElevenLabsPlanById,
  ELEVENLABS_MODELS_CATALOG,
} from '../../../../shared/catalog/elevenlabsCatalog';

interface VoiceOverItemEditorProps {
  item: ProductionItem;
  calcRow?: ItemCalculationResult;
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  cleanDurationSec: number;
  targetDurationSec: number;
  exchangeRate: number | null;
  elevenlabsPlanId?: string;
  defaultAttemptsPerShot: number;
  onUpdateField: (itemId: string, fields: Partial<ProductionItem>) => void;
}

export const VoiceOverItemEditor: React.FC<VoiceOverItemEditorProps> = ({
  item,
  calcRow,
  language,
  theme,
  cleanDurationSec,
  targetDurationSec,
  exchangeRate,
  elevenlabsPlanId = 'starter',
  defaultAttemptsPerShot,
  onUpdateField,
}) => {
  const isId = language === 'id';
  const inputClass = theme === 'dark' ? 'glass-input-dark' : 'glass-input-light';

  const speedPreset = String(
    item.model_selection.parameter_values?.speed_preset || 'normal'
  );
  const cadanganCount = Math.max(
    1,
    defaultAttemptsPerShot || item.attempts_per_item || 1
  );
  const budgetedGen =
    calcRow?.budgeted_generations ??
    (Number(item.quantity) || 0) * cadanganCount;

  const currentVoChars =
    typeof item.character_count === 'number' && item.character_count > 0
      ? Math.floor(item.character_count)
      : item.script_text && item.script_text.trim().length > 0
      ? item.script_text.length
      : convertDurationToCharacters(
          item.duration_seconds || 10,
          item.script_language ?? 'id',
          speedPreset
        );

  const modelInfo =
    ELEVENLABS_MODELS_CATALOG.find(
      (m) => m.model_id === item.model_selection.model_id
    ) || ELEVENLABS_MODELS_CATALOG[0];

  const multiplier = modelInfo.credit_multiplier_per_character;
  const creditsPerGen = calculateElevenLabsCredits(
    currentVoChars,
    modelInfo.model_id
  );
  const totalCr = calcRow?.total_credit ?? creditsPerGen * budgetedGen;
  const activePlan = getElevenLabsPlanById(elevenlabsPlanId as any);
  const costUsd =
    calcRow?.total_cost_usd ??
    calculateElevenLabsCostUsd(totalCr, activePlan.plan_id);
  const costIdr =
    calcRow?.total_cost_idr ??
    (exchangeRate
      ? calculateElevenLabsCostIdr(totalCr, activePlan.plan_id, exchangeRate)
      : null);

  return (
    <div className="vv-card-quiet p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-[var(--vv-text-strong)] flex items-center gap-1.5">
          <Mic className="w-4 h-4 text-sky-400" />
          <span>
            {isId
              ? '4. Kuantitas File Audio, Durasi Bicara & Karakter (Sinkron 2 Arah)'
              : '4. Audio File Quantity, Spoken Duration & Characters (Bi-Directional Sync)'}
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
                onUpdateField(item.item_id, {
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
            {item.quantity} {isId ? 'file audio' : 'audio files'} &times;{' '}
            {cadanganCount} {isId ? 'cadangan' : 'reserve'} = {budgetedGen}x{' '}
            {isId ? 'buat' : 'generations'}
          </span>
        </div>
      </div>

      {/* Pilihan Bahasa Suara */}
      <div>
        <label className="block text-[11px] font-semibold text-[var(--vv-text-muted)] mb-1.5">
          {isId
            ? 'Bahasa Bicara (Kecepatan Karakter per Detik)'
            : 'Spoken Language (Characters per Second Rate)'}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              const nextLang = 'id';
              const curDur = item.duration_seconds || 10;
              const newChars = convertDurationToCharacters(
                curDur,
                nextLang,
                speedPreset
              );
              onUpdateField(item.item_id, {
                script_language: nextLang,
                character_count: newChars,
                script_text: '',
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
              const newChars = convertDurationToCharacters(
                curDur,
                nextLang,
                speedPreset
              );
              onUpdateField(item.item_id, {
                script_language: nextLang,
                character_count: newChars,
                script_text: '',
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

      {/* Dwi-Input Angka Terhubung: Durasi Bicara <-> Jumlah Karakter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-[10px] bg-[var(--vv-surface-soft)] border border-[var(--vv-border)]">
        {/* Kolom Kiri: Target Durasi Bicara (Detik) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-[var(--vv-text-strong)] flex items-center gap-1">
              <span>⏱️</span>
              <span>
                {isId
                  ? 'Durasi Bicara per File (Detik)'
                  : 'Spoken Duration per File (Seconds)'}
              </span>
              <InfoTip>
                {isId
                  ? 'Isi target durasi bicara (detik). Sistem otomatis menghitung jumlah karakter sesuai bahasa yang dipilih.'
                  : 'Enter target spoken duration (seconds). The system automatically calculates the character count based on language.'}
              </InfoTip>
            </label>
            <span className="text-[10px] font-mono font-bold text-sky-400">
              {formatDualDuration(item.duration_seconds || 0, isId)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={600}
              step={1}
              value={item.duration_seconds || 0}
              onChange={(e) => {
                const secs = Math.max(0, Number(e.target.value) || 0);
                const curLang = item.script_language ?? 'id';
                const projectedChars = convertDurationToCharacters(
                  secs,
                  curLang,
                  speedPreset
                );
                onUpdateField(item.item_id, {
                  duration_seconds: secs,
                  character_count: projectedChars,
                  script_text: '',
                });
              }}
              className={`${inputClass} w-28 px-3 py-1.5 rounded-[8px] text-xs font-bold tabular-nums text-right`}
            />
            <span className="text-xs font-semibold text-[var(--vv-text-muted)]">
              {isId ? 'detik' : 'sec'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {[5, 10, 15, 30, 60].map((presetSec) => (
              <button
                key={presetSec}
                type="button"
                onClick={() => {
                  const curLang = item.script_language ?? 'id';
                  const projectedChars = convertDurationToCharacters(
                    presetSec,
                    curLang,
                    speedPreset
                  );
                  onUpdateField(item.item_id, {
                    duration_seconds: presetSec,
                    character_count: projectedChars,
                    script_text: '',
                  });
                }}
                className={`px-2 py-0.5 rounded-[6px] text-[10px] font-mono font-semibold transition ${
                  item.duration_seconds === presetSec
                    ? 'bg-sky-500/25 text-sky-300 border border-sky-500/40'
                    : 'bg-[var(--vv-field)] text-[var(--vv-text-muted)] border border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
                }`}
              >
                {presetSec}s
              </button>
            ))}

            {(cleanDurationSec > 0 || targetDurationSec > 0) && (
              <button
                type="button"
                onClick={() => {
                  const syncSec =
                    cleanDurationSec > 0
                      ? Math.round(cleanDurationSec)
                      : targetDurationSec;
                  const curLang = item.script_language ?? 'id';
                  const projectedChars = convertDurationToCharacters(
                    syncSec,
                    curLang,
                    speedPreset
                  );
                  onUpdateField(item.item_id, {
                    duration_seconds: syncSec,
                    character_count: projectedChars,
                    script_text: '',
                  });
                }}
                className="px-2 py-0.5 rounded-[6px] text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 hover:bg-emerald-500/25 transition"
              >
                🎯 {isId ? `Video (${Math.round(cleanDurationSec || targetDurationSec)}s)` : `Video (${Math.round(cleanDurationSec || targetDurationSec)}s)`}
              </button>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Jumlah Karakter per File Audio */}
        <div className="space-y-2 sm:border-l sm:border-[var(--vv-border)] sm:pl-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-[var(--vv-text-strong)] flex items-center gap-1">
              <span>🔤</span>
              <span>
                {isId
                  ? 'Jumlah Karakter per File Audio'
                  : 'Characters per Audio File'}
              </span>
              <InfoTip align="right">
                {isId
                  ? 'Atau isi langsung jumlah karakter naskah Anda. Durasi bicara (detik) di sebelah kiri akan menyesuaikan otomatis.'
                  : 'Or directly enter your script character count. Spoken duration (seconds) on the left updates automatically.'}
              </InfoTip>
            </label>
            <span className="text-[10px] font-mono font-bold text-emerald-400">
              1 kar = {modelInfo.credit_multiplier_per_character} Cr
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={10000}
              step={10}
              value={currentVoChars}
              onChange={(e) => {
                const chars = Math.max(0, Math.floor(Number(e.target.value) || 0));
                const curLang = item.script_language ?? 'id';
                const projectedSec = convertCharactersToDuration(
                  chars,
                  curLang,
                  speedPreset
                );
                onUpdateField(item.item_id, {
                  character_count: chars,
                  duration_seconds: projectedSec,
                  script_text: '',
                });
              }}
              className={`${inputClass} w-28 px-3 py-1.5 rounded-[8px] text-xs font-bold tabular-nums text-right`}
            />
            <span className="text-xs font-semibold text-[var(--vv-text-muted)]">
              {isId ? 'karakter' : 'chars'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {[75, 150, 300, 500, 1000].map((presetChar) => (
              <button
                key={presetChar}
                type="button"
                onClick={() => {
                  const curLang = item.script_language ?? 'id';
                  const projectedSec = convertCharactersToDuration(
                    presetChar,
                    curLang,
                    speedPreset
                  );
                  onUpdateField(item.item_id, {
                    character_count: presetChar,
                    duration_seconds: projectedSec,
                    script_text: '',
                  });
                }}
                className={`px-2 py-0.5 rounded-[6px] text-[10px] font-mono font-semibold transition ${
                  currentVoChars === presetChar
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
                    : 'bg-[var(--vv-field)] text-[var(--vv-text-muted)] border border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
                }`}
              >
                {presetChar} kar
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live ElevenLabs Calculation Summary Card */}
      <div className="p-3.5 rounded-[12px] bg-sky-950/20 border border-sky-500/30 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-[var(--vv-text-muted)]">
          <span>
            {isId ? 'Model Suara ElevenLabs:' : 'ElevenLabs Voice Model:'}
          </span>
          <span className="font-semibold text-sky-300">
            {modelInfo.model_name} ({multiplier}x Credit • {modelInfo.latency_description})
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-sky-500/20">
          <div>
            <span className="text-[10px] text-[var(--vv-text-subtle)] block">
              {isId ? 'Karakter per File Audio' : 'Characters per Audio File'}
            </span>
            <span className="text-sm font-bold font-mono text-[var(--vv-text-primary)]">
              {currentVoChars.toLocaleString()}
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
              {item.quantity} file &times; {cadanganCount} {isId ? 'cadangan' : 'reserve'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[var(--vv-text-subtle)] block">
              {isId
                ? `Subtotal Tahap (${activePlan.name_id.split(' ')[1] || activePlan.name_id})`
                : `Stage Subtotal (${activePlan.name_en.split(' ')[0] || activePlan.name_en})`}
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
    </div>
  );
};
