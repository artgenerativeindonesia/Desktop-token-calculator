import React from 'react';
import { BudgetAssumptions, ExchangeRate } from '../../../shared/types/project';
import { formatCurrencyIdr, UI_TEXT } from '../../i18n/translations';
import { Clock, Film, Globe } from 'lucide-react';

interface ProjectIdentityFormProps {
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  projectName: string;
  assumptions: BudgetAssumptions;
  exchangeRate: ExchangeRate;
  onProjectNameChange: (name: string) => void;
  onTargetVideosChange: (count: number) => void;
  onFinalDurationSecondsChange: (seconds: number) => void;
}

export const ProjectIdentityForm: React.FC<ProjectIdentityFormProps> = ({
  language,
  theme,
  projectName,
  assumptions,
  exchangeRate,
  onProjectNameChange,
  onTargetVideosChange,
  onFinalDurationSecondsChange,
}) => {
  const isId = language === 'id';
  const t = UI_TEXT[language];
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';
  const inputClass =
    theme === 'dark' ? 'glass-input-dark' : 'glass-input-light';

  const currentSeconds = Math.max(
    1,
    Math.round((assumptions.final_duration_minutes || 1) * 60)
  );
  const targetVids = Math.max(1, assumptions.target_videos || 1);
  const totalSeconds = currentSeconds * targetVids;
  const mins = Math.floor(currentSeconds / 60);
  const secs = currentSeconds % 60;
  const timecode = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const totalMins = Math.floor(totalSeconds / 60);
  const totalSecs = totalSeconds % 60;

  return (
    <div
      className={`${cardClass} lg:col-span-6 rounded-[18px] p-6 flex flex-col justify-between space-y-5`}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-[var(--vv-border)] pb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)] flex items-center gap-2">
            <span className="font-mono text-[10px] text-[var(--vv-text-subtle)]">
              01
            </span>
            <Film className="w-4 h-4 text-[#0099ff]" />
            <span>{isId ? 'Identitas Proyek' : 'Project Identity'}</span>
          </h2>
        </div>

        {/* Nama Proyek */}
        <div>
          <label className="block text-xs font-medium text-[var(--vv-text-strong)] mb-1.5">
            {isId ? 'Nama Proyek (Wajib diisi)' : 'Project Name (Required)'}
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            placeholder={
              isId
                ? 'Contoh: Iklan Video AI Produk Kopi'
                : 'e.g., New Product AI Video Campaign'
            }
            className={`${inputClass} w-full px-3.5 py-2.5 rounded-[10px] text-sm font-medium`}
          />
          {!projectName.trim() && (
            <p className="text-xs text-rose-400 mt-1">
              {isId
                ? 'Nama proyek wajib diisi sebelum menyimpan atau membuat laporan PDF.'
                : 'Project name cannot be empty before saving or exporting.'}
            </p>
          )}
        </div>

        {/* Input Jumlah Video (Fitur Multi-Video) */}
        <div className="p-4 rounded-[14px] bg-[#0099ff]/10 border border-[#0099ff]/40 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[var(--vv-text-strong)] flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-[#0099ff]" />
              <span>
                {isId
                  ? 'Jumlah Video yang Ingin Dibuat'
                  : 'Target Number of Videos to Produce'}
              </span>
            </label>
            <span className="text-xs font-mono font-bold text-[#0099ff]">
              {targetVids} {isId ? 'video' : 'videos'}
            </span>
          </div>

          {/* Pilihan Cepat Preset Video */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { count: 1, label: isId ? '1 Video (Tunggal)' : '1 Video (Single)' },
              { count: 3, label: isId ? '3 Video' : '3 Videos' },
              { count: 5, label: isId ? '5 Video' : '5 Videos' },
              { count: 10, label: isId ? '10 Video' : '10 Videos' },
            ].map((preset) => (
              <button
                key={preset.count}
                type="button"
                onClick={() => onTargetVideosChange(preset.count)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition ${
                  targetVids === preset.count
                    ? 'bg-[#0099ff]/20 text-[#0099ff] border-[#0099ff]/50 font-bold'
                    : 'bg-[var(--vv-tint-weak)] text-[var(--vv-text-muted)] border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="number"
              min={1}
              max={100}
              step={1}
              value={targetVids}
              onChange={(e) =>
                onTargetVideosChange(Math.max(1, Number(e.target.value) || 1))
              }
              className={`${inputClass} w-full pr-20 pl-3.5 py-2.5 rounded-[10px] text-xl font-bold tabular-nums text-right`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--vv-text-muted)] pointer-events-none">
              {isId ? 'video' : 'videos'}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={Math.min(20, Math.max(1, targetVids))}
            onChange={(e) => onTargetVideosChange(Number(e.target.value))}
            className="w-full accent-[#0099ff] cursor-pointer"
          />
          <p className="text-[11px] text-[var(--vv-text-muted)] leading-relaxed">
            {isId
              ? `💡 Langkah 3 memproyeksikan kebutuhan untuk 1 video. Hasil perhitungan di Langkah 3 akan otomatis dikalikan ${targetVids} video untuk total anggaran akhir.`
              : `💡 Step 3 projects requirements for 1 video. Step 3 calculation will be automatically multiplied by ${targetVids} videos for the grand total.`}
          </p>
        </div>

        {/* Input Target Durasi per Video Jadi */}
        <div className="p-4 rounded-[14px] bg-[#0099ff]/10 border border-[#0099ff]/40 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[var(--vv-text-strong)] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0099ff]" />
              <span>
                {isId
                  ? 'Target Durasi Tiap (per) Video Jadi'
                  : 'Target Duration per Finished Video'}
              </span>
            </label>
            <span className="text-xs font-mono font-bold text-[#0099ff]">
              {currentSeconds} {isId ? 'detik' : 'sec'}{' '}
              <span className="text-[11px] text-[var(--vv-text-muted)] font-normal">
                ({timecode})
              </span>
            </span>
          </div>

          {/* Pilihan Cepat Preset Durasi */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { seconds: 15, label: '15s' },
              { seconds: 30, label: '30s' },
              { seconds: 60, label: '60s (1m)' },
              { seconds: 90, label: '90s (1.5m)' },
              { seconds: 120, label: '120s (2m)' },
            ].map((preset) => (
              <button
                key={preset.seconds}
                type="button"
                onClick={() => onFinalDurationSecondsChange(preset.seconds)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition ${
                  currentSeconds === preset.seconds
                    ? 'bg-[#0099ff]/20 text-[#0099ff] border-[#0099ff]/50 font-bold'
                    : 'bg-[var(--vv-tint-weak)] text-[var(--vv-text-muted)] border-[var(--vv-border)] hover:text-[var(--vv-text-primary)]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="number"
              min={1}
              max={3600}
              step={1}
              value={currentSeconds}
              onChange={(e) =>
                onFinalDurationSecondsChange(
                  Math.max(1, Math.floor(Number(e.target.value) || 1))
                )
              }
              className={`${inputClass} w-full pr-20 pl-3.5 py-2.5 rounded-[10px] text-xl font-bold tabular-nums text-right`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--vv-text-muted)] pointer-events-none">
              {isId ? 'detik' : 'sec'}
            </span>
          </div>

          <input
            type="range"
            min={5}
            max={180}
            step={5}
            value={Math.min(180, Math.max(5, currentSeconds))}
            onChange={(e) => onFinalDurationSecondsChange(Number(e.target.value))}
            className="w-full accent-[#0099ff] cursor-pointer"
          />

          <div className="space-y-1 pt-1 text-[11px] text-[var(--vv-text-muted)] leading-relaxed">
            <p>
              {isId
                ? '💡 Target durasi hasil akhir untuk masing-masing (tiap) video setelah proses pemotongan editing. Durasi mentah shot AI di Langkah 3 boleh lebih panjang dari target ini.'
                : '💡 Target final duration for each individual video after post-production editing. Raw AI footage in Step 3 may be longer than this target.'}
            </p>
            {targetVids > 1 && (
              <p className="text-emerald-400 font-medium pt-1 border-t border-[var(--vv-border)]">
                {isId
                  ? `🎬 Total Durasi Seluruh ${targetVids} Video: ${totalSeconds} Detik (${totalMins}m ${totalSecs}s)`
                  : `🎬 Total Duration for All ${targetVids} Videos: ${totalSeconds}s (${totalMins}m ${totalSecs}s)`}
              </p>
            )}
          </div>
        </div>

        {/* Info Kurs Acuan */}
        <div className="vv-card-quiet p-3.5 flex items-center justify-between text-xs rounded-[12px]">
          <span className="text-[var(--vv-text-muted)] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#0099ff]" />
            <span>{isId ? 'Patokan Kurs Dolar:' : 'USD Exchange Rate:'}</span>
          </span>
          <strong className="tabular-nums text-[var(--vv-text-strong)]">
            {exchangeRate.rate
              ? `1 USD = ${formatCurrencyIdr(exchangeRate.rate, language)}`
              : t.unavailableLabel}
          </strong>
        </div>
      </div>
    </div>
  );
};
