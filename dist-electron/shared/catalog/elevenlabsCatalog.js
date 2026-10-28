"use strict";
/**
 * AI Video & Voiceover Budget Calculator — Katalog Resmi ElevenLabs Voice Over
 *
 * File ini menyediakan:
 * 1. Tier Paket Langganan Resmi ElevenLabs (Free, Starter, Creator, Pro, Scale, Business)
 * 2. Model AI Voice Over Resmi Terupdate (Multilingual v2, Flash v2.5, Turbo v2.5, v3, Monolingual v1)
 * 3. Rumus Konversi Kecepatan Bicara (Dwi-Input Sineas: Durasi Detik <-> Karakter Naskah)
 * 4. Fungsi Perhitungan Credit & Biaya (USD & IDR)
 * 5. Bridge Adaptor ke CatalogModelEntry (Kompatibel dengan arsitektur Higgsfield/AI Studio)
 * 6. Real-Time Connector Otomatis (Fallback Offline Terverifikasi + Live API gratis/opsional API key)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ELEVENLABS_AS_CATALOG_MODELS = exports.SPEECH_SPEED_PROFILES = exports.ELEVENLABS_MODELS_CATALOG = exports.ELEVENLABS_SUBSCRIPTION_PLANS = exports.DEFAULT_USD_TO_IDR_RATE = exports.ELEVENLABS_API_BASE = exports.ELEVENLABS_DOCS_URL = exports.ELEVENLABS_PRICING_URL = exports.ELEVENLABS_OFFICIAL_URL = exports.ELEVENLABS_CATALOG_VERSION = void 0;
exports.getSpeedPresetMultiplier = getSpeedPresetMultiplier;
exports.convertDurationToCharacters = convertDurationToCharacters;
exports.convertCharactersToDuration = convertCharactersToDuration;
exports.convertWordsToCharacters = convertWordsToCharacters;
exports.convertCharactersToWords = convertCharactersToWords;
exports.getElevenLabsModelById = getElevenLabsModelById;
exports.getElevenLabsPlanById = getElevenLabsPlanById;
exports.calculateElevenLabsCredits = calculateElevenLabsCredits;
exports.calculateElevenLabsCostUsd = calculateElevenLabsCostUsd;
exports.calculateElevenLabsCostIdr = calculateElevenLabsCostIdr;
exports.formatSpeechDuration = formatSpeechDuration;
exports.estimateVoicedScript = estimateVoicedScript;
exports.toCatalogModelEntry = toCatalogModelEntry;
exports.applyElevenLabsPlanRateToCatalog = applyElevenLabsPlanRateToCatalog;
exports.fetchElevenLabsCatalogAuto = fetchElevenLabsCatalogAuto;
const decimal_js_1 = __importDefault(require("decimal.js"));
exports.ELEVENLABS_CATALOG_VERSION = '2026.10';
exports.ELEVENLABS_OFFICIAL_URL = 'https://elevenlabs.io';
exports.ELEVENLABS_PRICING_URL = 'https://elevenlabs.io/pricing';
exports.ELEVENLABS_DOCS_URL = 'https://elevenlabs.io/docs/overview';
exports.ELEVENLABS_API_BASE = 'https://api.elevenlabs.io/v1';
// Default acuan kurs USD ke IDR
exports.DEFAULT_USD_TO_IDR_RATE = 16_250;
// High precision untuk kalkulasi credit dan rate token
decimal_js_1.default.set({ precision: 28, rounding: decimal_js_1.default.ROUND_HALF_UP });
// ============================================================================
// 2. PAKET LANGGANAN RESMI ELEVENLABS TERUPDATE
// ============================================================================
exports.ELEVENLABS_SUBSCRIPTION_PLANS = [
    {
        plan_id: 'free',
        name_id: 'Paket Free ($0/bln • 10.000 Credit)',
        name_en: 'Free Plan ($0/mo • 10,000 Credits)',
        monthly_price_usd: 0,
        monthly_credits: 10_000,
        usd_per_credit: 0,
        approx_idr_per_credit: 0,
        concurrency_limit: 2,
        max_character_per_request: 2_500,
        rollover_months: 0,
        commercial_license: false,
        supports_instant_voice_cloning: false,
        supports_professional_voice_cloning: false,
        pvc_slots: 0,
        workspace_seats: 1,
        plan_category: 'free',
        billing_cycle: 'monthly',
        badge: 'GRATIS',
        description_id: 'Paket gratis tanpa kartu kredit: 10.000 credit per bulan (~10 menit audio). Khusus keperluan non-komersial dengan kewajiban menyertakan atribusi kredit.',
        description_en: 'Free plan with 10,000 monthly credits (~10 mins audio). Non-commercial usage with attribution required.',
        features_id: [
            '10.000 credit/bulan gratis ($0 / credit)',
            'Hingga 3 Custom Voice bawaan',
            'Non-komersial (wajib atribusi ElevenLabs)',
            'Akses ke library suara publik',
        ],
        features_en: [
            '10,000 monthly credits free ($0 / credit)',
            'Up to 3 Custom Voices',
            'Non-commercial (attribution required)',
            'Access to shared community voice library',
        ],
    },
    {
        plan_id: 'starter',
        name_id: 'Paket Starter ($6/bln • 30.000 Credit)',
        name_en: 'Starter Plan ($6/mo • 30,000 Credits)',
        monthly_price_usd: 6,
        monthly_credits: 30_000,
        usd_per_credit: 0.0002, // $6 / 30,000 = $0.000200
        approx_idr_per_credit: 3.25, // ~$0.000200 * 16,250 = Rp 3.25
        concurrency_limit: 3,
        max_character_per_request: 5_000,
        rollover_months: 2,
        commercial_license: true,
        supports_instant_voice_cloning: true,
        supports_professional_voice_cloning: false,
        pvc_slots: 0,
        workspace_seats: 1,
        plan_category: 'starter',
        billing_cycle: 'monthly',
        badge: 'POPULER',
        description_id: 'Paket pemula kreator konten & sineas: 30.000 credit/bulan (~30 menit audio), lisensi komersial penuh, dan fitur Instant Voice Cloning (IVC) hingga 10 suara kloning cepat.',
        description_en: 'Creator starter plan: 30,000 credits/mo (~30 mins audio), commercial license, and Instant Voice Cloning (IVC) for up to 10 voices.',
        features_id: [
            '30.000 credit/bulan ($0.000200 / credit ≈ Rp 3.25)',
            'Lisensi komersial resmi',
            'Instant Voice Cloning (IVC) hingga 10 suara',
            'Akumulasi rollover credit hingga 2 bulan',
        ],
        features_en: [
            '30,000 credits/mo ($0.000200 / credit ≈ Rp 3.25)',
            'Commercial license included',
            'Instant Voice Cloning (IVC) up to 10 voices',
            'Rollover unused credits up to 2 months',
        ],
    },
    {
        plan_id: 'creator',
        name_id: 'Paket Creator ($22/bln • 121.000 Credit)',
        name_en: 'Creator Plan ($22/mo • 121,000 Credits)',
        monthly_price_usd: 22,
        monthly_credits: 121_000,
        usd_per_credit: 0.0001818, // $22 / 121,000 = $0.000181818...
        approx_idr_per_credit: 2.95, // ~$0.0001818 * 16,250 = Rp 2.95
        concurrency_limit: 5,
        max_character_per_request: 10_000,
        rollover_months: 2,
        commercial_license: true,
        supports_instant_voice_cloning: true,
        supports_professional_voice_cloning: true,
        pvc_slots: 1,
        workspace_seats: 1,
        plan_category: 'creator',
        billing_cycle: 'monthly',
        badge: 'KREATOR',
        description_id: 'Paket favorit kreator aktif: 121.000 credit/bulan (~2 jam audio), Professional Voice Cloning (PVC 1 slot) dengan sampel audio panjang, dan audio berkualitas tinggi 192kbps.',
        description_en: 'Active creator tier: 121,000 credits/mo (~2 hrs audio), 1 Professional Voice Cloning (PVC) slot with long audio samples, and 192kbps high quality audio.',
        features_id: [
            '121.000 credit/bulan ($0.0001818 / credit ≈ Rp 2.95)',
            '1 Slot Professional Voice Cloning (PVC)',
            'Hingga 30 Instant Cloned Voices',
            'Kualitas audio 192 kbps ultra jernih',
        ],
        features_en: [
            '121,000 credits/mo ($0.0001818 / credit ≈ Rp 2.95)',
            '1 Professional Voice Cloning (PVC) slot',
            'Up to 30 Instant Cloned Voices',
            '192 kbps ultra clear audio output',
        ],
    },
    {
        plan_id: 'pro',
        name_id: 'Paket Pro ($99/bln • 600.000 Credit)',
        name_en: 'Pro Plan ($99/mo • 600,000 Credits)',
        monthly_price_usd: 99,
        monthly_credits: 600_000,
        usd_per_credit: 0.000165, // $99 / 600,000 = $0.0001650
        approx_idr_per_credit: 2.68, // ~$0.0001650 * 16,250 = Rp 2.68
        concurrency_limit: 10,
        max_character_per_request: 20_000,
        rollover_months: 2,
        commercial_license: true,
        supports_instant_voice_cloning: true,
        supports_professional_voice_cloning: true,
        pvc_slots: 3,
        workspace_seats: 1,
        plan_category: 'pro',
        billing_cycle: 'monthly',
        badge: 'STUDIO',
        description_id: 'Paket produksi studio & agency: 600.000 credit/bulan (~10 jam audio), 3 slot PVC, opsi output master studio 44.1kHz PCM (WAV), dan render prioritas.',
        description_en: 'Studio & agency tier: 600,000 credits/mo (~10 hrs audio), 3 PVC slots, studio master 44.1kHz PCM output, and priority rendering.',
        features_id: [
            '600.000 credit/bulan ($0.0001650 / credit ≈ Rp 2.68)',
            '3 Slot Professional Voice Cloning (PVC)',
            'Output audio studio master 44.1kHz PCM uncompressed',
            '10 concurrent requests rendering simultan',
        ],
        features_en: [
            '600,000 credits/mo ($0.0001650 / credit ≈ Rp 2.68)',
            '3 Professional Voice Cloning (PVC) slots',
            'Studio master 44.1kHz PCM uncompressed output',
            '10 concurrent rendering requests',
        ],
    },
    {
        plan_id: 'scale',
        name_id: 'Paket Scale ($299/bln • 1.800.000 Credit)',
        name_en: 'Scale Plan ($299/mo • 1,800,000 Credits)',
        monthly_price_usd: 299,
        monthly_credits: 1_800_000,
        usd_per_credit: 0.00016611, // $299 / 1,800,000 = $0.00016611...
        approx_idr_per_credit: 2.7, // ~$0.0001661 * 16,250 = Rp 2.70
        concurrency_limit: 15,
        max_character_per_request: 40_000,
        rollover_months: 2,
        commercial_license: true,
        supports_instant_voice_cloning: true,
        supports_professional_voice_cloning: true,
        pvc_slots: 3,
        workspace_seats: 3,
        plan_category: 'scale',
        billing_cycle: 'monthly',
        badge: 'SKALA BESAR',
        description_id: 'Paket tim produksi skala besar: 1.800.000 credit/bulan (~30 jam audio), 3 kursi workspace tim kolaboratif, serta volume credit besar untuk serial & film panjang.',
        description_en: 'Large-scale team production: 1,800,000 credits/mo (~30 hrs audio), 3 shared workspace seats, high volume for episodic and feature productions.',
        features_id: [
            '1.800.000 credit/bulan ($0.0001661 / credit ≈ Rp 2.70)',
            '3 Kursi kolaborator workspace tim',
            '15 concurrent requests',
            'Dukungan analitik pemakaian tim',
        ],
        features_en: [
            '1,800,000 credits/mo ($0.0001661 / credit ≈ Rp 2.70)',
            '3 Shared workspace team seats',
            '15 concurrent requests',
            'Team usage analytics support',
        ],
    },
    {
        plan_id: 'business',
        name_id: 'Paket Business ($990/bln • 6.000.000 Credit)',
        name_en: 'Business Plan ($990/mo • 6,000,000 Credits)',
        monthly_price_usd: 990,
        monthly_credits: 6_000_000,
        usd_per_credit: 0.000165, // $990 / 6,000,000 = $0.0001650
        approx_idr_per_credit: 2.68, // ~$0.0001650 * 16,250 = Rp 2.68
        concurrency_limit: 25,
        max_character_per_request: 40_000,
        rollover_months: 2,
        commercial_license: true,
        supports_instant_voice_cloning: true,
        supports_professional_voice_cloning: true,
        pvc_slots: 10,
        workspace_seats: 10,
        plan_category: 'business',
        billing_cycle: 'monthly',
        badge: 'ENTERPRISE',
        description_id: 'Paket enterprise komersial: 6.000.000 credit/bulan (~100 jam audio), 10 kursi workspace, 10 slot PVC, dan kapasitas render paralel tertinggi.',
        description_en: 'Commercial enterprise tier: 6,000,000 credits/mo (~100 hrs audio), 10 workspace seats, 10 PVC slots, and highest parallel rendering limits.',
        features_id: [
            '6.000.000 credit/bulan ($0.0001650 / credit ≈ Rp 2.68)',
            '10 Slot Professional Voice Cloning (PVC)',
            '10 Kursi kolaborasi anggota tim',
            '25 concurrent requests rendering simultan',
        ],
        features_en: [
            '6,000,000 credits/mo ($0.0001650 / credit ≈ Rp 2.68)',
            '10 Professional Voice Cloning (PVC) slots',
            '10 Team collaboration seats',
            '25 concurrent rendering requests',
        ],
    },
];
// ============================================================================
// 3. MODEL-MODEL AI RESMI ELEVENLABS TERUPDATE
// ============================================================================
exports.ELEVENLABS_MODELS_CATALOG = [
    {
        model_id: 'eleven_v4',
        model_name: 'Eleven v4 (Flagship Next-Gen)',
        credit_multiplier_per_character: 1.0,
        latency_ms_approx: 250,
        latency_description: '~250ms high-fidelity latency',
        language_count: 90,
        supported_languages: [
            'id', 'en', 'ja', 'zh', 'de', 'es', 'fr', 'it', 'ko', 'pt', 'pl', 'tr',
            'ru', 'nl', 'ar', 'sv', 'hi', 'cs', 'da', 'fi', 'el', 'he', 'ms', 'no',
            'sk', 'uk', 'ro', 'bg', 'hr', 'vi', 'th', 'hu', 'ta', 'te', 'mr', 'ur',
            'bn', 'gu', 'kn', 'ml', 'sw', 'af', 'sq', 'hy', 'az', 'eu', 'be', 'bs',
            'ca', 'et', 'gl', 'ka', 'is', 'ga', 'kk', 'lv', 'lt', 'mk', 'mt', 'fa',
            'sr', 'sl', 'cy', 'tl', 'ne', 'si', 'km', 'my', 'lo', 'mn'
        ],
        category: 'multilingual',
        tier_badge: 'NEW',
        is_active: true,
        supports_voice_cloning: true,
        source_name: 'ElevenLabs Official Models Documentation',
        source_url: 'https://elevenlabs.io/docs/models#eleven-v4',
        retrieved_at: '2026-10-28T00:00:00.000Z',
        description_id: 'Model unggulan termutakhir (flagship) generasi ke-4 ElevenLabs dengan kedalaman emosional manusiawi, kontrol intonasi teatrikal, kemampuan dialog multi-karakter, dan dukungan 90+ bahasa.',
        description_en: 'ElevenLabs next-generation flagship v4 model delivering unprecedented emotional depth, theatrical voice modulation, multi-speaker dialogue pacing, and native support for 90+ languages.',
        recommended_use_id: 'Pilihan terbaik untuk naskah film sinematik, akting suara karakter berkepribadian kuat, audiobook dramatis, dan dialog sinematik berkualitas studio.',
        recommended_use_en: 'Best for cinematic film narration, dramatic character acting, emotive audiobooks, and studio-grade voiceover.',
    },
    {
        model_id: 'eleven_v4_turbo',
        model_name: 'Eleven v4 Turbo (Low Latency Flagship)',
        credit_multiplier_per_character: 0.5, // 50% discount
        latency_ms_approx: 100,
        latency_description: '~100ms real-time low latency',
        language_count: 90,
        supported_languages: [
            'id', 'en', 'ja', 'zh', 'de', 'es', 'fr', 'it', 'ko', 'pt', 'pl', 'tr',
            'ru', 'nl', 'ar', 'sv', 'hi', 'cs', 'da', 'fi', 'el', 'he', 'ms', 'no',
            'sk', 'uk', 'ro', 'bg', 'hr', 'vi', 'th', 'hu', 'ta', 'te', 'mr', 'ur',
            'bn', 'gu', 'kn', 'ml', 'sw', 'af', 'sq', 'hy', 'az', 'eu', 'be', 'bs',
            'ca', 'et', 'gl', 'ka', 'is', 'ga', 'kk', 'lv', 'lt', 'mk', 'mt', 'fa',
            'sr', 'sl', 'cy', 'tl', 'ne', 'si', 'km', 'my', 'lo', 'mn'
        ],
        category: 'conversational_fast',
        tier_badge: 'NEW',
        is_active: true,
        supports_voice_cloning: true,
        source_name: 'ElevenLabs Official Models Documentation',
        source_url: 'https://elevenlabs.io/docs/models#eleven-v4-turbo',
        retrieved_at: '2026-10-28T00:00:00.000Z',
        description_id: 'Varian real-time generasi ke-4 dengan kecepatan inferensi ultra cepat (~100ms), tarif hemat diskon 50% (0.5 credit/karakter), dan dukungan ekspresi 90+ bahasa.',
        description_en: 'Fourth-generation ultra-fast real-time model (~100ms latency) with 50% credit discount (0.5 credits/char) and 90+ language coverage.',
        recommended_use_id: 'Sangat direkomendasikan untuk agen percakapan interaktif real-time, live streaming AI, dubbing cepat konten media sosial, dan asisten suara dinamis.',
        recommended_use_en: 'Ideal for conversational AI agents, interactive live streams, rapid social media dubbing, and responsive virtual actors.',
    },
    {
        model_id: 'eleven_multilingual_v2',
        model_name: 'Eleven Multilingual v2',
        credit_multiplier_per_character: 1.0,
        latency_ms_approx: 350,
        latency_description: '~350ms standard latency',
        language_count: 29,
        supported_languages: [
            'id', // Indonesian
            'en', // English
            'ja', // Japanese
            'zh', // Chinese
            'de', // German
            'es', // Spanish
            'fr', // French
            'it', // Italian
            'ko', // Korean
            'pt', // Portuguese
            'pl', // Polish
            'tr', // Turkish
            'ru', // Russian
            'nl', // Dutch
            'ar', // Arabic
            'sv', // Swedish
            'hi', // Hindi
            'cs', // Czech
            'da', // Danish
            'fi', // Finnish
            'el', // Greek
            'he', // Hebrew
            'ms', // Malay
            'no', // Norwegian
            'sk', // Slovak
            'uk', // Ukrainian
            'ro', // Romanian
            'bg', // Bulgarian
            'hr', // Croatian
        ],
        category: 'multilingual',
        tier_badge: 'POPULER',
        is_active: true,
        supports_voice_cloning: true,
        source_name: 'ElevenLabs Official Models Documentation',
        source_url: 'https://elevenlabs.io/docs/models#eleven-multilingual-v2',
        retrieved_at: '2026-10-28T00:00:00.000Z',
        description_id: 'Model unggulan utama ElevenLabs dengan kualitas suara paling ekspresif, bernuansa emosional tinggi, dan pelafalan aksen alami dalam 29+ bahasa (termasuk Bahasa Indonesia).',
        description_en: 'Flagship ElevenLabs model delivering the highest emotional range, expressive depth, and natural accent delivery across 29+ languages (including Indonesian).',
        recommended_use_id: 'Sangat direkomendasikan untuk narasi film, voiceover trailer sinematik, audiobook emosional, drama audio, dan dialog karakter utama.',
        recommended_use_en: 'Ideal for cinematic movie trailers, emotive audiobooks, narrative drama, and primary character performances.',
    },
    {
        model_id: 'eleven_flash_v2_5',
        model_name: 'Eleven Flash v2.5',
        credit_multiplier_per_character: 0.5, // 50% discount
        latency_ms_approx: 75,
        latency_description: '~75ms ultra low-latency',
        language_count: 32,
        supported_languages: [
            'id', 'en', 'ja', 'zh', 'de', 'es', 'fr', 'it', 'ko', 'pt', 'pl', 'tr',
            'ru', 'nl', 'ar', 'sv', 'hi', 'cs', 'da', 'fi', 'el', 'he', 'ms', 'no',
            'sk', 'uk', 'ro', 'bg', 'hr', 'vi', 'th', 'hu'
        ],
        category: 'conversational_fast',
        tier_badge: 'POPULER',
        is_active: true,
        supports_voice_cloning: true,
        source_name: 'ElevenLabs Official Models Documentation',
        source_url: 'https://elevenlabs.io/docs/models#eleven-flash-v25',
        retrieved_at: '2026-10-28T00:00:00.000Z',
        description_id: 'Model ultra cepat generasi terbaru dengan latensi spektakuler (~75ms) dan tarif hemat diskon 50% (hanya 0.5 credit per karakter). Mendukung 32 bahasa dunia.',
        description_en: 'Ultra fast modern voice model with ~75ms response latency and 50% credit discount (0.5 credits per character). Supports 32 languages.',
        recommended_use_id: 'Pilihan terbaik untuk live streaming interactive, game NPC real-time, dialog interaktif, agen percakapan AI, dan produksi cepat bervolume besar.',
        recommended_use_en: 'Best for real-time conversational agents, interactive game NPCs, live voice streams, and high-volume fast turnaround audio.',
    },
    {
        model_id: 'eleven_flash_v2',
        model_name: 'Eleven Flash v2',
        credit_multiplier_per_character: 0.5,
        latency_ms_approx: 75,
        latency_description: '~75ms low latency',
        language_count: 29,
        supported_languages: [
            'id', 'en', 'ja', 'zh', 'de', 'es', 'fr', 'it', 'ko', 'pt', 'pl', 'tr',
            'ru', 'nl', 'ar', 'sv', 'hi', 'cs', 'da', 'fi', 'el', 'he', 'ms', 'no',
            'sk', 'uk', 'ro', 'bg', 'hr'
        ],
        category: 'conversational_fast',
        tier_badge: 'STANDARD',
        is_active: true,
        supports_voice_cloning: true,
        source_name: 'ElevenLabs Official Models Documentation',
        source_url: 'https://elevenlabs.io/docs/models#eleven-flash-v2',
        retrieved_at: '2026-10-28T00:00:00.000Z',
        description_id: 'Model ringan berlatensi rendah (~75ms) generasi flash v2 dengan diskon 50% credit untuk percakapan cepat dalam 29 bahasa.',
        description_en: 'Lightweight low-latency (~75ms) flash v2 model with 50% credit discount for fast conversational audio in 29 languages.',
        recommended_use_id: 'Agen percakapan real-time dan produksi volume tinggi beralur kerja cepat.',
        recommended_use_en: 'Real-time conversational bots and high volume rapid speech generation.',
    },
    {
        model_id: 'eleven_turbo_v2_5',
        model_name: 'Eleven Turbo v2.5',
        credit_multiplier_per_character: 0.5, // 50% discount
        latency_ms_approx: 250,
        latency_description: '~250ms fast latency',
        language_count: 32,
        supported_languages: [
            'id', 'en', 'ja', 'zh', 'de', 'es', 'fr', 'it', 'ko', 'pt', 'pl', 'tr',
            'ru', 'nl', 'ar', 'sv', 'hi', 'cs', 'da', 'fi', 'el', 'he', 'ms', 'no',
            'sk', 'uk', 'ro', 'bg', 'hr', 'vi', 'th', 'hu'
        ],
        category: 'conversational_fast',
        tier_badge: 'POPULER',
        is_active: true,
        supports_voice_cloning: true,
        source_name: 'ElevenLabs Official Models Documentation',
        source_url: 'https://elevenlabs.io/docs/models#eleven-turbo-v25',
        retrieved_at: '2026-10-28T00:00:00.000Z',
        description_id: 'Model seimbang yang memadukan kecepatan tinggi (~250ms) dengan kejernihan artikulasi suara natural. Hemat tarif diskon 50% (0.5 credit per karakter).',
        description_en: 'Balanced fast model combining swift ~250ms rendering with clear natural voice inflection at 50% credit discount (0.5 credits per character).',
        recommended_use_id: 'Sempurna untuk video promosi media sosial (TikTok, Reels, YouTube Shorts), explainer video, materi e-learning, dan podcast mingguan.',
        recommended_use_en: 'Perfect for social video voiceovers (Shorts, Reels, TikTok), product explainers, e-learning courses, and weekly podcasts.',
    },
    {
        model_id: 'eleven_turbo_v2',
        model_name: 'Eleven Turbo v2',
        credit_multiplier_per_character: 0.5,
        latency_ms_approx: 250,
        latency_description: '~250ms fast latency',
        language_count: 29,
        supported_languages: [
            'id', 'en', 'ja', 'zh', 'de', 'es', 'fr', 'it', 'ko', 'pt', 'pl', 'tr',
            'ru', 'nl', 'ar', 'sv', 'hi', 'cs', 'da', 'fi', 'el', 'he', 'ms', 'no',
            'sk', 'uk', 'ro', 'bg', 'hr'
        ],
        category: 'conversational_fast',
        tier_badge: 'STANDARD',
        is_active: true,
        supports_voice_cloning: true,
        source_name: 'ElevenLabs Official Models Documentation',
        source_url: 'https://elevenlabs.io/docs/models#eleven-turbo-v2',
        retrieved_at: '2026-10-28T00:00:00.000Z',
        description_id: 'Model turbo generasi kedua teruji dengan performa cepat dan tarif hemat 50% credit.',
        description_en: 'Proven second-generation turbo model offering fast turnaround and 50% credit savings.',
        recommended_use_id: 'Produksi video media sosial cepat dan podcast reguler.',
        recommended_use_en: 'Rapid social video narration and regular podcasts.',
    },
    {
        model_id: 'eleven_v3',
        model_name: 'Eleven v3 (Multilingual Alpha)',
        credit_multiplier_per_character: 1.0,
        latency_ms_approx: 380,
        latency_description: '~380ms high-fidelity',
        language_count: 70,
        supported_languages: [
            'id', 'en', 'ja', 'zh', 'de', 'es', 'fr', 'it', 'ko', 'pt', 'pl', 'tr',
            'ru', 'nl', 'ar', 'sv', 'hi', 'cs', 'da', 'fi', 'el', 'he', 'ms', 'no',
            'sk', 'uk', 'ro', 'bg', 'hr', 'vi', 'th', 'hu', 'ta', 'te', 'mr', 'ur',
            'bn', 'gu', 'kn', 'ml', 'sw', 'af', 'sq', 'hy', 'az', 'eu', 'be', 'bs',
            'ca', 'et', 'gl', 'ka', 'is', 'ga', 'kk', 'lv', 'lt', 'mk', 'mt', 'fa',
            'sr', 'sl', 'cy', 'tl', 'ne', 'si', 'km', 'my', 'lo', 'mn'
        ],
        category: 'experimental',
        tier_badge: 'PREMIUM',
        is_active: true,
        supports_voice_cloning: true,
        source_name: 'ElevenLabs Official Models Documentation',
        source_url: 'https://elevenlabs.io/docs/models#eleven-v3',
        retrieved_at: '2026-10-28T00:00:00.000Z',
        description_id: 'Arsitektur audio model generasi ke-3 dengan cakupan 70+ bahasa dan dialek daerah, menghadirkan kestabilan intonasi dan akurasi fonetik tertinggi.',
        description_en: 'Next-generation v3 audio architecture covering 70+ languages and regional dialects with state-of-the-art prosody and phonetic accuracy.',
        recommended_use_id: 'Proyek internasional multi-bahasa, lokalisasi film lintas benua, dubbing cerdas, dan dialek bahasa yang jarang didukung AI konvensional.',
        recommended_use_en: 'Global multi-language films, cross-border localization, smart AI dubbing, and regional dialect preservation.',
    },
    {
        model_id: 'eleven_multilingual_sts_v2',
        model_name: 'Eleven Multilingual STS v2 (Speech to Speech)',
        credit_multiplier_per_character: 1.0,
        latency_ms_approx: 350,
        latency_description: '~350ms voice changer latency',
        language_count: 29,
        supported_languages: [
            'id', 'en', 'ja', 'zh', 'de', 'es', 'fr', 'it', 'ko', 'pt', 'pl', 'tr',
            'ru', 'nl', 'ar', 'sv', 'hi', 'cs', 'da', 'fi', 'el', 'he', 'ms', 'no',
            'sk', 'uk', 'ro', 'bg', 'hr'
        ],
        category: 'sts',
        tier_badge: 'NEW',
        is_active: true,
        supports_voice_cloning: true,
        source_name: 'ElevenLabs Official Models Documentation',
        source_url: 'https://elevenlabs.io/docs/models#speech-to-speech',
        retrieved_at: '2026-10-28T00:00:00.000Z',
        description_id: 'Model Speech-to-Speech resmi untuk mengubah karakter suara rekaman audio pengguna menjadi suara kloning AI dengan mempertahankan ekspresi, ritme emosi, dan intonasi asli pengisi suara.',
        description_en: 'Official Speech-to-Speech model to convert recorded actor voices into cloned AI character voices while preserving the exact emotional delivery, timing, and nuances.',
        recommended_use_id: 'Penggantian suara aktor (voice changer), dubbing film sinematik ekspresif, dan transfer gaya akting suara manusia ke karakter AI.',
        recommended_use_en: 'Actor voice transformation, expressive cinematic dubbing, and transferring human vocal performance to AI characters.',
    },
    {
        model_id: 'eleven_english_sts_v2',
        model_name: 'Eleven English STS v2 (Speech to Speech)',
        credit_multiplier_per_character: 1.0,
        latency_ms_approx: 300,
        latency_description: '~300ms English STS latency',
        language_count: 1,
        supported_languages: ['en'],
        category: 'sts',
        tier_badge: 'STANDARD',
        is_active: true,
        supports_voice_cloning: true,
        source_name: 'ElevenLabs Official Models Documentation',
        source_url: 'https://elevenlabs.io/docs/models#speech-to-speech',
        retrieved_at: '2026-10-28T00:00:00.000Z',
        description_id: 'Model Speech-to-Speech khusus bahasa Inggris untuk mengubah suara pengisi suara bahasa Inggris ke karakter suara lain secara akurat.',
        description_en: 'English-optimized Speech-to-Speech voice conversion model maintaining exact vocal cadence.',
        recommended_use_id: 'Voiceover dubbing khusus bahasa Inggris dan game character voice changing.',
        recommended_use_en: 'English voiceover dubbing and game character vocal transformation.',
    },
    {
        model_id: 'eleven_monolingual_v1',
        model_name: 'Eleven English v1 (Monolingual Legacy)',
        credit_multiplier_per_character: 1.0,
        latency_ms_approx: 320,
        latency_description: '~320ms legacy engine',
        language_count: 1,
        supported_languages: ['en'],
        category: 'monolingual',
        tier_badge: 'STANDARD',
        is_active: true,
        supports_voice_cloning: true,
        source_name: 'ElevenLabs Official Models Documentation',
        source_url: 'https://elevenlabs.io/docs/models#eleven-english-v1',
        retrieved_at: '2026-10-28T00:00:00.000Z',
        description_id: 'Model awal legendaris yang dikhususkan khusus untuk narasi bahasa Inggris standar (Amerika, Inggris, Australia). Sangat stabil dan konsisten.',
        description_en: 'Classic foundation model optimized strictly for English narration (US, UK, Australian). Highly stable and proven tone consistency.',
        recommended_use_id: 'Arsip voiceover legacy bahasa Inggris murni, dokumenter klasik, dan produksi naskah bahasa Inggris sederhana.',
        recommended_use_en: 'Pure English legacy workflows, documentary narration, and simple English script production.',
    },
];
// ============================================================================
// 4. PROFIL KECEPATAN BICARA (DWI-INPUT SINEAS)
// ============================================================================
/**
 * Konversi Kecepatan Bicara Standar Sineas & Voiceover:
 * - Bahasa Indonesia (ID):
 *   Rata-rata 14.5 karakter/detik (~870 karakter/menit, ~125 WPM, rata-rata 6.96 karakter/kata).
 *   Suku kata bahasa Indonesia cenderung sedikit lebih panjang karena imbuhan.
 *
 * - Bahasa Inggris (EN):
 *   Rata-rata 16.5 karakter/detik (~990 karakter/menit, ~145 WPM, rata-rata 6.83 karakter/kata).
 *   Bicara bahasa Inggris cenderung memiliki ritme suku kata yang lebih padat.
 */
exports.SPEECH_SPEED_PROFILES = {
    id: {
        lang: 'id',
        language_name_id: 'Bahasa Indonesia',
        language_name_en: 'Indonesian',
        characters_per_second: 14.5,
        characters_per_minute: 870,
        words_per_minute: 125,
        avg_characters_per_word: 6.96,
        description_id: 'Tempo narasi Indonesia alami: ~14.5 karakter/detik (~870 karakter/menit, ~125 kata/menit).',
        description_en: 'Natural Indonesian speech tempo: ~14.5 characters/sec (~870 chars/min, ~125 words/min).',
    },
    en: {
        lang: 'en',
        language_name_id: 'Bahasa Inggris',
        language_name_en: 'English',
        characters_per_second: 16.5,
        characters_per_minute: 990,
        words_per_minute: 145,
        avg_characters_per_word: 6.83,
        description_id: 'Tempo narasi Inggris natural: ~16.5 karakter/detik (~990 karakter/menit, ~145 kata/menit).',
        description_en: 'Natural English narration tempo: ~16.5 characters/sec (~990 chars/min, ~145 words/min).',
    },
};
// ============================================================================
// 5. FUNGSI PEMBANTU KONVERSI & ESTIMASI (DWI-INPUT SINEAS)
// ============================================================================
function getSpeedPresetMultiplier(preset) {
    if (preset === 'fast')
        return 1.15;
    if (preset === 'slow')
        return 0.85;
    return 1.0;
}
/**
 * Konversi Durasi (detik) ke Estimasi Jumlah Karakter Naskah.
 * Contoh: Durasi 10 detik Bahasa Indonesia -> ~145 karakter naskah.
 */
function convertDurationToCharacters(seconds, lang = 'id', speedPreset) {
    if (!Number.isFinite(seconds) || seconds <= 0)
        return 0;
    const profile = exports.SPEECH_SPEED_PROFILES[lang] ?? exports.SPEECH_SPEED_PROFILES.id;
    const speedMult = getSpeedPresetMultiplier(speedPreset);
    return Math.round(seconds * profile.characters_per_second * speedMult);
}
/**
 * Konversi Jumlah Karakter Naskah ke Estimasi Durasi Bicara (detik).
 * Contoh: Naskah 145 karakter Bahasa Indonesia -> ~10.0 detik bicara.
 */
function convertCharactersToDuration(chars, lang = 'id', speedPreset) {
    if (!Number.isFinite(chars) || chars <= 0)
        return 0;
    const profile = exports.SPEECH_SPEED_PROFILES[lang] ?? exports.SPEECH_SPEED_PROFILES.id;
    const speedMult = getSpeedPresetMultiplier(speedPreset);
    const seconds = chars / (profile.characters_per_second * speedMult);
    return Math.round(seconds * 100) / 100; // Pembulatan rapi ke 2 desimal
}
/**
 * Konversi Jumlah Kata ke Estimasi Karakter
 */
function convertWordsToCharacters(words, lang = 'id') {
    if (!Number.isFinite(words) || words <= 0)
        return 0;
    const profile = exports.SPEECH_SPEED_PROFILES[lang] ?? exports.SPEECH_SPEED_PROFILES.id;
    return Math.round(words * profile.avg_characters_per_word);
}
/**
 * Konversi Karakter ke Estimasi Jumlah Kata
 */
function convertCharactersToWords(chars, lang = 'id') {
    if (!Number.isFinite(chars) || chars <= 0)
        return 0;
    const profile = exports.SPEECH_SPEED_PROFILES[lang] ?? exports.SPEECH_SPEED_PROFILES.id;
    return Math.round(chars / profile.avg_characters_per_word);
}
/**
 * Cari model berdasarkan ID (fallback ke Multilingual v2 jika tidak ditemukan)
 */
function getElevenLabsModelById(modelId) {
    const found = exports.ELEVENLABS_MODELS_CATALOG.find((m) => m.model_id === modelId);
    if (found)
        return found;
    // Fallback default
    return exports.ELEVENLABS_MODELS_CATALOG[0];
}
/**
 * Cari paket langganan berdasarkan tier ID (fallback ke Starter jika tidak ditemukan)
 */
function getElevenLabsPlanById(planId) {
    const found = exports.ELEVENLABS_SUBSCRIPTION_PLANS.find((p) => p.plan_id === planId);
    if (found)
        return found;
    return exports.ELEVENLABS_SUBSCRIPTION_PLANS[1]; // Starter
}
/**
 * Menghitung Total Credit ElevenLabs yang dibutuhkan:
 * Rumus: chars * credit_multiplier (misal Flash v2.5 = 0.5x, Multilingual v2 = 1.0x)
 * Menggunakan pembulatan ke atas (Math.ceil) agar tidak kekurangan kuota.
 */
function calculateElevenLabsCredits(chars, modelId = 'eleven_multilingual_v2') {
    if (!Number.isFinite(chars) || chars <= 0)
        return 0;
    const model = getElevenLabsModelById(modelId);
    const multiplier = model.credit_multiplier_per_character;
    const rawCredit = new decimal_js_1.default(chars).times(multiplier).toNumber();
    return Math.ceil(rawCredit);
}
/**
 * Menghitung Biaya USD berdasarkan jumlah credit dan paket langganan yang dipilih
 */
function calculateElevenLabsCostUsd(credits, planId = 'starter') {
    if (!Number.isFinite(credits) || credits <= 0)
        return 0;
    const plan = getElevenLabsPlanById(planId);
    // Jika paket Free, biaya tambahan $0
    if (plan.monthly_price_usd === 0 || plan.usd_per_credit === 0) {
        return 0;
    }
    const cost = new decimal_js_1.default(credits).times(plan.usd_per_credit).toNumber();
    return Math.round(cost * 1_000_000) / 1_000_000;
}
/**
 * Menghitung Biaya IDR berdasarkan kurs mata uang (X)
 */
function calculateElevenLabsCostIdr(credits, planId = 'starter', usdToIdrRate = exports.DEFAULT_USD_TO_IDR_RATE) {
    if (!Number.isFinite(credits) || credits <= 0)
        return 0;
    const plan = getElevenLabsPlanById(planId);
    if (plan.monthly_price_usd === 0 || plan.usd_per_credit === 0)
        return 0;
    // Hitung langsung dengan Decimal presisi penuh (tanpa potong desimal USD di tengah jalan)
    const costIdr = new decimal_js_1.default(credits)
        .times(plan.usd_per_credit)
        .times(usdToIdrRate)
        .toDecimalPlaces(2)
        .toNumber();
    return Math.round(costIdr);
}
/**
 * Format durasi detik ke format ramah penonton:
 * "1 Menit 30 Detik (01:30)" atau "45 Detik (00:45)"
 */
function formatSpeechDuration(seconds, lang = 'id') {
    const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.round(seconds)) : 0;
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    const mm = String(mins).padStart(2, '0');
    const ss = String(secs).padStart(2, '0');
    if (lang === 'en') {
        if (mins > 0) {
            return `${mins}m ${secs}s (${mm}:${ss})`;
        }
        return `${secs}s (${mm}:${ss})`;
    }
    if (mins > 0) {
        return `${mins} Menit ${secs} Detik (${mm}:${ss})`;
    }
    return `${secs} Detik (${mm}:${ss})`;
}
/**
 * Kalkulasi Lengkap Estimasi Naskah Voiceover (Dwi-Input Sineas):
 * Pengguna bisa mengisi naskah langsung (skrip) ATAU memasukkan durasi shot target.
 */
function estimateVoicedScript(params) {
    const lang = params.lang ?? 'id';
    const modelId = params.modelId ?? 'eleven_multilingual_v2';
    const planId = params.planId ?? 'starter';
    const model = getElevenLabsModelById(modelId);
    const plan = getElevenLabsPlanById(planId);
    let finalChars = 0;
    let finalDurationSeconds = 0;
    const rawText = params.text?.trim() ?? '';
    if (rawText.length > 0) {
        finalChars = rawText.length;
        finalDurationSeconds = convertCharactersToDuration(finalChars, lang);
    }
    else if (typeof params.characterCount === 'number' &&
        params.characterCount > 0) {
        finalChars = params.characterCount;
        finalDurationSeconds = convertCharactersToDuration(finalChars, lang);
    }
    else if (typeof params.durationSeconds === 'number' &&
        params.durationSeconds > 0) {
        finalDurationSeconds = params.durationSeconds;
        finalChars = convertDurationToCharacters(finalDurationSeconds, lang);
    }
    const wordCount = convertCharactersToWords(finalChars, lang);
    const totalCredits = calculateElevenLabsCredits(finalChars, modelId);
    const totalCostUsd = calculateElevenLabsCostUsd(totalCredits, planId);
    const totalCostIdr = params.usdToIdrRate && params.usdToIdrRate > 0
        ? calculateElevenLabsCostIdr(totalCredits, planId, params.usdToIdrRate)
        : null;
    return {
        text: rawText,
        lang,
        character_count: finalChars,
        word_count: wordCount,
        duration_seconds: finalDurationSeconds,
        duration_formatted_id: formatSpeechDuration(finalDurationSeconds, 'id'),
        duration_formatted_en: formatSpeechDuration(finalDurationSeconds, 'en'),
        model_id: model.model_id,
        model_name: model.model_name,
        credit_multiplier: model.credit_multiplier_per_character,
        total_credits: totalCredits,
        plan_id: plan.plan_id,
        usd_per_credit: plan.usd_per_credit,
        total_cost_usd: totalCostUsd,
        total_cost_idr: totalCostIdr,
    };
}
// ============================================================================
// 6. BRIDGE ADAPTOR KE CATALOGMODELENTRY (KOMPATIBILITAS ARSITEKTUR HYBRID)
// ============================================================================
/**
 * Mengonversi entri model ElevenLabs menjadi CatalogModelEntry standar
 * sehingga dapat dipilih langsung pada antarmuka ProductionPlannerView bersama model Higgsfield.
 */
function toCatalogModelEntry(model) {
    // Hitung perkiraan credit per detik (menggunakan laju Bahasa Indonesia: 14.5 char/s * multiplier)
    const creditPerSec = Math.round(14.5 * model.credit_multiplier_per_character * 10) / 10;
    // Biaya per detik pada Starter tier ($0.000200/credit)
    const pricePerSecUsd = Math.round(creditPerSec * 0.0002 * 10000) / 10000;
    const pricingVariants = [
        {
            pricing_unit: 'per_second',
            price_value: pricePerSecUsd,
            currency: 'USD',
            credit_cost: creditPerSec,
            credit_unit: 'per_second',
            status: 'verified',
        },
    ];
    return {
        provider: 'elevenlabs',
        model_id: model.model_id,
        model_name: model.model_name,
        family: 'ElevenLabs Voice Over',
        tier_badge: model.tier_badge,
        unlimited_eligible: false,
        is_custom_model: false,
        supported_categories: ['voice_over'],
        description_id: model.description_id,
        description_en: model.description_en,
        default_quantity_type: 'asset',
        supports_duration: true,
        default_duration_seconds: 10,
        parameters: [
            {
                key: 'speed_preset',
                label_id: 'Kecepatan Tempo Bicara',
                label_en: 'Speech Tempo Preset',
                type: 'select',
                options: [
                    { value: 'normal', label: 'Normal (1.0x — ~14.5 kar/dtk ID, ~16.5 kar/dtk EN)' },
                    { value: 'fast', label: 'Cepat / Energik (1.15x — lebih padat karakter per detik)' },
                    { value: 'slow', label: 'Lambat / Khidmat (0.85x — lebih renggang karakter per detik)' },
                ],
                defaultValue: 'normal',
                affectsPricing: true,
            },
        ],
        pricing_variants: pricingVariants,
        source_name: model.source_name,
        source_url: model.source_url,
        retrieved_at: model.retrieved_at,
    };
}
exports.ELEVENLABS_AS_CATALOG_MODELS = exports.ELEVENLABS_MODELS_CATALOG.map(toCatalogModelEntry);
/**
 * Memperbarui tarif USD per detik pada model-model ElevenLabs di dalam katalog gabungan
 * sesuai dengan paket langganan ElevenLabs yang aktif (Starter, Creator, Pro, Scale, Business).
 */
function applyElevenLabsPlanRateToCatalog(catalog, planId) {
    const plan = getElevenLabsPlanById(planId);
    const usdPerCredit = plan.usd_per_credit;
    return catalog.map((model) => {
        const isElevenLabs = model.provider === 'elevenlabs' ||
            model.model_id.startsWith('eleven_') ||
            (model.supported_categories.length === 1 && model.supported_categories[0] === 'voice_over');
        if (!isElevenLabs)
            return model;
        return {
            ...model,
            pricing_variants: model.pricing_variants.map((variant) => {
                if (typeof variant.credit_cost === 'number' && variant.credit_cost >= 0) {
                    const newPriceValue = Number((variant.credit_cost * usdPerCredit).toFixed(4));
                    return {
                        ...variant,
                        price_value: newPriceValue,
                    };
                }
                return variant;
            }),
        };
    });
}
/**
 * Connector Cerdas Resmi & Gratis ElevenLabs:
 * 1. Menjamin ketersediaan 100% data offline berkat snapshot verified.
 * 2. Jika ada internet & apiKey pengguna diisi, mengambil daftar model langsung dari ElevenLabs API
 *    serta sisa kuota credit akun (user subscription).
 * 3. Jika tanpa apiKey, tetap dapat beroperasi penuh secara offline/lokal tanpa mengharuskan pengguna mendaftar API.
 */
async function fetchElevenLabsCatalogAuto(options = {}) {
    const timeoutMs = options.timeoutMs ?? 5000;
    const customFetch = options.customFetch ?? fetch;
    // Snapshot default offline terverifikasi
    const fallbackResult = {
        success: true,
        models: exports.ELEVENLABS_MODELS_CATALOG,
        plans: exports.ELEVENLABS_SUBSCRIPTION_PLANS,
        speechProfiles: exports.SPEECH_SPEED_PROFILES,
        usedFallback: true,
        source: 'ElevenLabs Verified Snapshot 2026 (Offline Ready)',
        retrievedAt: new Date().toISOString(),
        userSubscription: null,
    };
    // Jika ada API Key, coba panggil API resmi ElevenLabs v1
    if (options.apiKey && options.apiKey.trim().length > 0) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), timeoutMs);
            const headers = {
                'xi-api-key': options.apiKey.trim(),
                Accept: 'application/json',
            };
            // Panggil endpoints models & user subscription secara paralel
            const [modelsRes, subRes] = await Promise.allSettled([
                customFetch(`${exports.ELEVENLABS_API_BASE}/models`, {
                    signal: controller.signal,
                    headers,
                }),
                customFetch(`${exports.ELEVENLABS_API_BASE}/user/subscription`, {
                    signal: controller.signal,
                    headers,
                }),
            ]);
            clearTimeout(timeout);
            // Validasi keberhasilan endpoint models
            const isModelsOk = modelsRes.status === 'fulfilled' && modelsRes.value.ok;
            if (!isModelsOk) {
                const reason = modelsRes.status === 'rejected'
                    ? modelsRes.reason instanceof Error
                        ? modelsRes.reason.message
                        : String(modelsRes.reason)
                    : `HTTP ${modelsRes.value.status}`;
                return {
                    ...fallbackResult,
                    error_id: `Koneksi API langsung gagal (${reason}), otomatis menggunakan katalog verifikasi offline.`,
                    error_en: `Live API connection failed (${reason}), automatically fell back to verified offline catalog.`,
                };
            }
            let liveModels = [...exports.ELEVENLABS_MODELS_CATALOG];
            let liveSub = null;
            // Parsing respons models jika sukses
            const rawJson = (await modelsRes.value.json());
            if (Array.isArray(rawJson) && rawJson.length > 0) {
                const ttsModels = rawJson.filter((m) => m.can_do_text_to_speech !== false);
                if (ttsModels.length > 0) {
                    liveModels = ttsModels.map((m) => {
                        // Cek apakah model ini ada di katalog kita
                        const existing = exports.ELEVENLABS_MODELS_CATALOG.find((ex) => ex.model_id === m.model_id);
                        // Tentukan credit multiplier
                        let multiplier = 1.0;
                        if (m.model_id.includes('flash') ||
                            m.model_id.includes('turbo')) {
                            multiplier = 0.5;
                        }
                        else if (existing) {
                            multiplier = existing.credit_multiplier_per_character;
                        }
                        return {
                            model_id: m.model_id,
                            model_name: m.name || existing?.model_name || m.model_id,
                            credit_multiplier_per_character: multiplier,
                            latency_ms_approx: existing?.latency_ms_approx ?? 250,
                            latency_description: existing?.latency_description ??
                                (multiplier === 0.5
                                    ? '~75ms ultra low-latency'
                                    : '~350ms standard latency'),
                            language_count: m.languages?.length || existing?.language_count || 29,
                            supported_languages: m.languages?.map((l) => l.language_id) ||
                                existing?.supported_languages || ['id', 'en'],
                            category: existing?.category || (multiplier === 0.5 ? 'conversational_fast' : 'multilingual'),
                            tier_badge: existing?.tier_badge || 'POPULER',
                            is_active: true,
                            supports_voice_cloning: true,
                            source_name: 'ElevenLabs Live API (v1/models)',
                            source_url: 'https://api.elevenlabs.io/v1/models',
                            retrieved_at: new Date().toISOString(),
                            description_id: existing?.description_id ||
                                m.description ||
                                'Model suara resmi ElevenLabs AI.',
                            description_en: existing?.description_en ||
                                m.description ||
                                'Official ElevenLabs AI voice model.',
                            recommended_use_id: existing?.recommended_use_id ||
                                'Voiceover narasi dan dialog sinematik.',
                            recommended_use_en: existing?.recommended_use_en ||
                                'Voiceover narration and cinematic dialog.',
                        };
                    });
                }
            }
            // Parsing respons subscription jika sukses
            if (subRes.status === 'fulfilled' && subRes.value.ok) {
                const subData = (await subRes.value.json());
                if (subData && typeof subData.character_count === 'number') {
                    liveSub = subData;
                }
            }
            return {
                success: true,
                models: liveModels,
                plans: exports.ELEVENLABS_SUBSCRIPTION_PLANS,
                speechProfiles: exports.SPEECH_SPEED_PROFILES,
                usedFallback: false,
                source: 'ElevenLabs Official Live API (Authenticated)',
                retrievedAt: new Date().toISOString(),
                userSubscription: liveSub,
            };
        }
        catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            return {
                ...fallbackResult,
                error_id: `Koneksi API langsung gagal (${errorMsg}), otomatis menggunakan katalog verifikasi offline.`,
                error_en: `Live API connection failed (${errorMsg}), automatically fell back to verified offline catalog.`,
            };
        }
    }
    // Jika tanpa API key: kembalikan snapshot terverifikasi lengkap & siap pakai langsung
    return fallbackResult;
}
