import fs from 'fs';
import path from 'path';
import { ExchangeRate } from '../../shared/types/project';

export const FRANKFURTER_ECB_URL =
  'https://api.frankfurter.dev/latest?from=USD&to=IDR';
export const OPEN_ER_API_URL = 'https://open.er-api.com/v6/latest/USD';

export interface FetchExchangeRateResult {
  success: boolean;
  exchangeRate: ExchangeRate;
  usedFallbackCache: boolean;
  error_id?: string;
  error_en?: string;
}

/**
 * Validasi respons JSON kurs dari sumber eksternal (PRD Bab 9.3, 9.4, 13.1):
 * Menolak nilai nol, negatif, NaN, atau struktur tidak valid.
 */
export function parseFrankfurterResponse(raw: unknown): ExchangeRate | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const obj = raw as Record<string, unknown>;
  const rates = obj.rates as Record<string, unknown> | undefined;
  if (!rates || typeof rates.IDR !== 'number') return null;

  const idrRate = rates.IDR;
  if (!Number.isFinite(idrRate) || idrRate <= 100) {
    // Nilai kurs IDR per USD yang tidak masuk akal atau 0 ditolak (PRD Bab 13.1)
    return null;
  }

  const dateStr =
    typeof obj.date === 'string' ? obj.date : new Date().toISOString().slice(0, 10);

  return {
    base_currency: 'USD',
    quote_currency: 'IDR',
    rate: idrRate,
    rate_type: 'ECB Reference Rate (Kurs Referensi Bank Sentral)',
    source_name: `Frankfurter API (ECB Data ${dateStr})`,
    source_url: FRANKFURTER_ECB_URL,
    retrieved_at: new Date().toISOString(),
    status: 'verified',
  };
}

export function parseOpenErApiResponse(raw: unknown): ExchangeRate | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const obj = raw as Record<string, unknown>;
  const rates = obj.rates as Record<string, unknown> | undefined;
  if (!rates || typeof rates.IDR !== 'number') return null;

  const idrRate = rates.IDR;
  if (!Number.isFinite(idrRate) || idrRate <= 100) {
    return null;
  }

  return {
    base_currency: 'USD',
    quote_currency: 'IDR',
    rate: idrRate,
    rate_type: 'Market Mid-Rate (Kurs Pasar Tengah)',
    source_name: 'Open ExchangeRate API (open.er-api.com)',
    source_url: OPEN_ER_API_URL,
    retrieved_at: new Date().toISOString(),
    status: 'verified',
  };
}

/**
 * Mengambil kurs USD/IDR secara otomatis dari API gratis tanpa API key:
 * 1. Mencoba Frankfurter API (ECB Reference Rate)
 * 2. Jika gagal, mencoba Open ExchangeRate API (Market Mid-Rate)
 * 3. Jika keduanya gagal (mis. offline), memuat cache lokal terakhir dan memberi status 'stale' (Usang)
 * 4. Jika cache lokal belum ada, mengembalikan status 'unavailable' dan meminta input manual (PRD Bab 9.3 & 9.4)
 */
export async function fetchVerifiedUsdIdrRate(
  cacheFilePath?: string,
  customFetch: typeof fetch = fetch
): Promise<FetchExchangeRateResult> {
  // 1. Coba Sumber Utama: Frankfurter API (ECB)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const response = await customFetch(FRANKFURTER_ECB_URL, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      const parsed = parseFrankfurterResponse(data);
      if (parsed) {
        if (cacheFilePath) saveExchangeRateCache(cacheFilePath, parsed);
        return {
          success: true,
          exchangeRate: parsed,
          usedFallbackCache: false,
        };
      }
    }
  } catch {
    // Lanjut ke sumber cadangan
  }

  // 2. Coba Sumber Cadangan: Open ExchangeRate API
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const response = await customFetch(OPEN_ER_API_URL, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      const parsed = parseOpenErApiResponse(data);
      if (parsed) {
        if (cacheFilePath) saveExchangeRateCache(cacheFilePath, parsed);
        return {
          success: true,
          exchangeRate: parsed,
          usedFallbackCache: false,
        };
      }
    }
  } catch {
    // Lanjut ke cache lokal
  }

  // 3. Jika offline / gagal, periksa cache lokal terakhir dan tandai sebagai 'stale' (Usang)
  if (cacheFilePath) {
    const cached = loadExchangeRateCache(cacheFilePath);
    if (cached && cached.rate && cached.rate > 0) {
      const staleRate: ExchangeRate = {
        ...cached,
        status: 'stale',
      };
      return {
        success: false,
        exchangeRate: staleRate,
        usedFallbackCache: true,
        error_id:
          'Pembaruan kurs otomatis gagal (tidak ada koneksi internet). Menggunakan kurs terakhir yang tersimpan (Status: Usang) atau silakan masukkan kurs manual.',
        error_en:
          'Automatic exchange rate refresh failed (offline). Using last cached rate (Status: Stale) or please enter a manual rate.',
      };
    }
  }

  // 4. Tidak ada jaringan dan belum ada cache -> Unavailable (PRD Bab 9.3: jangan gunakan kurs hard-coded sebagai kurs terbaru)
  return {
    success: false,
    exchangeRate: {
      base_currency: 'USD',
      quote_currency: 'IDR',
      rate: null,
      rate_type: 'Unavailable',
      source_name: 'Pembaruan Otomatis Gagal',
      source_url: FRANKFURTER_ECB_URL,
      retrieved_at: new Date().toISOString(),
      status: 'unavailable',
    },
    usedFallbackCache: false,
    error_id:
      'Gagal mengambil kurs USD/IDR dari sumber otomatis. Silakan masukkan nilai kurs manual untuk melanjutkan perhitungan Rupiah.',
    error_en:
      'Failed to fetch USD/IDR rate from automatic sources. Please enter a manual exchange rate to continue IDR calculation.',
  };
}

/**
 * Membuat objek ExchangeRate dari input manual pengguna (PRD FR-08, AC-08)
 */
export function createManualExchangeRate(rateValue: number): ExchangeRate {
  const isValid = Number.isFinite(rateValue) && rateValue > 0;
  return {
    base_currency: 'USD',
    quote_currency: 'IDR',
    rate: isValid ? rateValue : null,
    rate_type: 'Manual Input (Input Pengguna)',
    source_name: 'Input Manual Pengguna',
    source_url: 'manual://user-input',
    retrieved_at: new Date().toISOString(),
    status: isValid ? 'manual' : 'invalid',
  };
}

export function saveExchangeRateCache(filePath: string, rate: ExchangeRate): void {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(rate, null, 2), 'utf-8');
  } catch {
    // ignore cache write failure
  }
}

export function loadExchangeRateCache(filePath: string): ExchangeRate | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (raw && typeof raw.rate === 'number' && raw.rate > 0) {
      return raw as ExchangeRate;
    }
    return null;
  } catch {
    return null;
  }
}
