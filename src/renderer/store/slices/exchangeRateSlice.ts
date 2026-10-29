import { StateCreator } from 'zustand';
import { ExchangeRate } from '../../../shared/types/project';
import {
  ExchangeRateSliceActions,
  ExchangeRateSliceState,
  ProjectStoreState,
} from '../storeTypes';
import { recalculateProject } from '../storeHelpers';

export const createExchangeRateSlice: StateCreator<
  ProjectStoreState,
  [],
  [],
  ExchangeRateSliceState & ExchangeRateSliceActions
> = (set, get) => ({
  isRefreshingFx: false,

  refreshExchangeRateAuto: async () => {
    set({ isRefreshingFx: true });
    try {
      if (window.api) {
        const res = await window.api.refreshExchangeRate();
        set((state) => ({
          isRefreshingFx: false,
          project: recalculateProject({
            ...state.project,
            exchange_rate: res.exchangeRate,
          }),
        }));
        if (!res.success && res.error_id) {
          get().showBanner('warning', res.error_id, res.error_en || res.error_id);
        } else if (res.success) {
          get().showBanner(
            'success',
            `Kurs USD/IDR berhasil diperbarui otomatis: Rp ${res.exchangeRate.rate?.toLocaleString('id-ID')} (${res.exchangeRate.source_name})`,
            `USD/IDR exchange rate refreshed automatically: IDR ${res.exchangeRate.rate?.toLocaleString('en-US')} (${res.exchangeRate.source_name})`
          );
        }
        return;
      }

      // Fallback langsung via fetch browser jika berjalan tanpa proses main Electron
      const response = await fetch(
        'https://api.frankfurter.dev/latest?from=USD&to=IDR'
      );
      if (response.ok) {
        const data = await response.json();
        if (data?.rates?.IDR && data.rates.IDR > 100) {
          const nextFx: ExchangeRate = {
            base_currency: 'USD',
            quote_currency: 'IDR',
            rate: data.rates.IDR,
            rate_type: 'ECB Reference Rate (Kurs Referensi Bank Sentral)',
            source_name: `Frankfurter API (ECB ${data.date || ''})`,
            source_url: 'https://api.frankfurter.dev/latest?from=USD&to=IDR',
            retrieved_at: new Date().toISOString(),
            status: 'verified',
          };
          set((state) => ({
            isRefreshingFx: false,
            project: recalculateProject({
              ...state.project,
              exchange_rate: nextFx,
            }),
          }));
          get().showBanner(
            'success',
            `Kurs USD/IDR berhasil diperbarui: Rp ${nextFx.rate?.toLocaleString('id-ID')}`,
            `USD/IDR rate updated: IDR ${nextFx.rate?.toLocaleString('en-US')}`
          );
          return;
        }
      }
      set({ isRefreshingFx: false });
    } catch {
      set({ isRefreshingFx: false });
      get().showBanner(
        'warning',
        'Tidak dapat memperbarui kurs otomatis (offline). Menggunakan kurs terakhir atau silakan isi kurs manual.',
        'Could not refresh exchange rate automatically (offline). Using cached rate or enter manual rate.'
      );
    }
  },

  setManualExchangeRate: (rateValue) =>
    set((state) => {
      const cleanRate = Number(rateValue);
      const isValid = Number.isFinite(cleanRate) && cleanRate > 0;
      const manualFx: ExchangeRate = {
        base_currency: 'USD',
        quote_currency: 'IDR',
        rate: isValid ? cleanRate : null,
        rate_type: 'Manual Input (Input Pengguna)',
        source_name: 'Input Manual Pengguna',
        source_url: 'manual://user-input',
        retrieved_at: new Date().toISOString(),
        status: isValid ? 'manual' : 'unavailable',
      };
      return {
        hasUnsavedChanges: true,
        project: recalculateProject({
          ...state.project,
          exchange_rate: manualFx,
        }),
      };
    }),
});
