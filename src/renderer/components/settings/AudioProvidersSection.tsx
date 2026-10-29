import React, { useState } from 'react';
import { ExchangeRate } from '../../../shared/types/project';
import {
  ELEVENLABS_SUBSCRIPTION_PLANS,
  ElevenLabsSubscriptionTier,
  fetchElevenLabsCatalogAuto,
} from '../../../shared/catalog/elevenlabsCatalog';
import {
  BaseSunoPlan,
  fetchSunoCatalogAuto,
  SUNO_PLANS_CATALOG,
  SunoSubscriptionTier,
} from '../../../shared/catalog/sunoCatalog';
import { CheckCircle2, Mic, Music, RefreshCw } from 'lucide-react';

interface AudioProvidersSectionProps {
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  exchangeRate: ExchangeRate;
  selectedElevenLabsPlanId: ElevenLabsSubscriptionTier;
  setSelectedElevenLabsPlanId: (planId: ElevenLabsSubscriptionTier) => void;
  selectedSunoPlanId: SunoSubscriptionTier;
  setSelectedSunoPlanId: (planId: SunoSubscriptionTier) => void;
}

export const AudioProvidersSection: React.FC<AudioProvidersSectionProps> = ({
  language,
  theme,
  exchangeRate,
  selectedElevenLabsPlanId,
  setSelectedElevenLabsPlanId,
  selectedSunoPlanId,
  setSelectedSunoPlanId,
}) => {
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';
  const inputClass = theme === 'dark' ? 'glass-input-dark' : 'glass-input-light';

  const [elevenlabsApiKeyInput, setElevenlabsApiKeyInput] = useState<string>('');
  const [elevenlabsSyncStatus, setElevenlabsSyncStatus] = useState<string | null>(null);
  const [isSyncingElevenlabs, setIsSyncingElevenlabs] = useState<boolean>(false);
  const [sunoSyncStatus, setSunoSyncStatus] = useState<string | null>(null);
  const [isSyncingSuno, setIsSyncingSuno] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {/* =====================================================================
       * ELEVENLABS OFFICIAL VOICE OVER PLANS & STATUS
       * ===================================================================== */}
      <div className={`${cardClass} rounded-[16px] p-5 space-y-4 border border-sky-500/30`}>
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
                {exchangeRate.rate
                  ? `(~Rp ${(
                      activePlan.usd_per_credit * exchangeRate.rate
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
       * TIER 1.95: PAKET LANGGANAN RESMI SUNO AI MUSIC (FREE, PRO, PREMIER)
       * ===================================================================== */}
      <div className={`${cardClass} rounded-[16px] p-6 space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--vv-border)] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--vv-text-muted)] flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-400" />
                <span>
                  {isId
                    ? 'Paket Langganan Resmi Suno AI Music'
                    : 'Official Suno AI Music Subscription Plans'}
                </span>
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                Official Suno
              </span>
            </div>
            <p className="text-xs text-[var(--vv-text-muted)] mt-0.5">
              {isId
                ? 'Pilih paket Suno AI Anda. Setiap pembuatan musik (1 run = 10 kredit) menghasilkan 2 variasi klip lagu siap pakai.'
                : 'Select your Suno AI plan. Each generation run (10 credits) produces 2 ready-to-use song clip variations.'}
            </p>
          </div>

          {(() => {
            const activePlan =
              SUNO_PLANS_CATALOG.find(
                (p: BaseSunoPlan) => p.plan_id === selectedSunoPlanId
              ) || SUNO_PLANS_CATALOG[1];
            return (
              <div className="text-right text-xs font-mono text-[var(--vv-text-strong)] bg-purple-950/20 px-3 py-1.5 rounded-lg border border-purple-500/30 shrink-0">
                1 Credit ({activePlan.name_id}) ={' '}
                <strong>${activePlan.usd_per_credit.toFixed(4)}</strong>{' '}
                {exchangeRate.rate
                  ? `(~Rp ${(
                      activePlan.usd_per_credit * exchangeRate.rate
                    ).toFixed(2)})`
                  : ''}
              </div>
            );
          })()}
        </div>

        {/* Grid 3 Paket Resmi Suno (Free, Pro, Premier) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SUNO_PLANS_CATALOG.map((plan: BaseSunoPlan) => {
            const isSelected = selectedSunoPlanId === plan.plan_id;
            return (
              <button
                key={plan.plan_id}
                type="button"
                onClick={() =>
                  setSelectedSunoPlanId(plan.plan_id as SunoSubscriptionTier)
                }
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/10 shadow-md ring-1 ring-purple-500/50'
                    : 'border-[var(--vv-border)] bg-[var(--vv-card)] hover:border-purple-500/40 hover:bg-[var(--vv-tint-weak)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-xs text-[var(--vv-text-primary)]">
                      {isId ? plan.name_id : plan.name_en}
                    </span>
                    {plan.badge && (
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          plan.badge === 'POPULER' ||
                          plan.badge === 'STANDAR INDUSTRI'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
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
                        {isId ? 'Alokasi Kredit:' : 'Credit Allotment:'}
                      </span>
                      <strong className="font-mono text-purple-400">
                        {plan.monthly_credits.toLocaleString()} Cr
                        {plan.monthly_price_usd === 0
                          ? isId
                            ? ' (50/hari)'
                            : ' (50/day)'
                          : ''}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>
                        {isId ? 'Biaya per Kredit:' : 'Cost per Credit:'}
                      </span>
                      <span className="font-mono text-[var(--vv-text-strong)]">
                        {plan.usd_per_credit === 0
                          ? '$0'
                          : `$${plan.usd_per_credit.toFixed(4)}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--vv-border)] flex items-center justify-between text-[10px]">
                  <span className="text-[var(--vv-text-subtle)]">
                    {plan.commercial_license
                      ? isId
                        ? '✅ Hak Komersial'
                        : '✅ Commercial Rights'
                      : isId
                      ? 'Non-komersial'
                      : 'Non-commercial'}
                  </span>
                  {isSelected ? (
                    <span className="text-purple-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isId ? 'Aktif' : 'Active'}
                    </span>
                  ) : (
                    <span className="text-[var(--vv-text-subtle)] group-hover:text-purple-400">
                      {isId ? 'Pilih Paket' : 'Select'}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Real-Time Sync & Official Suno Status Panel */}
        <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--vv-text-primary)]">
                {isId ? 'Konektor Resmi Suno AI' : 'Official Suno AI Connector'}
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                {isId
                  ? 'Siap Digunakan (Gratis & Terverifikasi)'
                  : 'Ready (Free & Verified)'}
              </span>
            </div>
            <p className="text-[11px] text-[var(--vv-text-muted)] leading-relaxed">
              {isId
                ? 'Aplikasi menggunakan katalog resmi Suno AI terverifikasi langsung dari laman resmi Suno (suno.com/pricing). Tarif 10 kredit per pembuatan (2 variasi klip lagu) berlaku untuk model v4, v3.5, v3, v6 mini, dan v6.'
                : 'The application uses verified official Suno AI catalog directly from the official Suno page (suno.com/pricing). 10 credits per generation run (yielding 2 song variations) applies to models v4, v3.5, v3, v6 mini, and v6.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={isSyncingSuno}
              onClick={async () => {
                setIsSyncingSuno(true);
                setSunoSyncStatus(null);
                try {
                  const res = await fetchSunoCatalogAuto();
                  if (res.success) {
                    setSunoSyncStatus(
                      isId
                        ? `✅ Berhasil sinkronisasi (${res.models.length} model resmi Suno aktif)`
                        : `✅ Successfully synced (${res.models.length} official Suno models active)`
                    );
                  } else {
                    setSunoSyncStatus(
                      isId
                        ? 'ℹ️ Menggunakan katalog lokal Suno terverifikasi'
                        : 'ℹ️ Using verified offline Suno catalog'
                    );
                  }
                } catch {
                  setSunoSyncStatus(
                    isId
                      ? 'ℹ️ Menggunakan katalog lokal Suno terverifikasi'
                      : 'ℹ️ Using verified offline Suno catalog'
                  );
                } finally {
                  setIsSyncingSuno(false);
                }
              }}
              className="vv-btn-primary px-3.5 py-1.5 text-xs whitespace-nowrap flex items-center justify-center gap-1.5"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isSyncingSuno ? 'animate-spin' : ''}`}
              />
              <span>{isId ? 'Perbarui Katalog Suno' : 'Update Suno Catalog'}</span>
            </button>
          </div>
        </div>

        {sunoSyncStatus && (
          <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            {sunoSyncStatus}
          </div>
        )}
      </div>
    </div>
  );
};
