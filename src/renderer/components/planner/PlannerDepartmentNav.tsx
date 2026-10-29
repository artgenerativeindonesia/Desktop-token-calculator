import React from 'react';
import { ProductionItem, ProcessCategory } from '../../../shared/types/project';
import {
  DepartmentTab,
  VIDEO_CATEGORIES,
  STILLS_CATEGORIES,
  formatDualDuration,
} from './plannerTypes';
import {
  Clock,
  Film,
  Layers,
  Mic,
  Music,
  Plus,
  Scissors,
  Sparkles,
  Volume2,
} from 'lucide-react';

interface PlannerDepartmentNavProps {
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  activeDepartment: DepartmentTab;
  setActiveDepartment: (dept: DepartmentTab) => void;
  setSelectedCategoryFilter: (cat: ProcessCategory | 'all') => void;
  setShowQuickAddMenu: (show: boolean) => void;
  items: ProductionItem[];
  cleanDurationSec: number;
  onAddAndOpenModal: (category: ProcessCategory) => void;
}

export const PlannerDepartmentNav: React.FC<PlannerDepartmentNavProps> = ({
  language,
  theme,
  activeDepartment,
  setActiveDepartment,
  setSelectedCategoryFilter,
  setShowQuickAddMenu,
  items,
  cleanDurationSec,
  onAddAndOpenModal,
}) => {
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';

  const departments = [
    {
      id: 'all' as DepartmentTab,
      label: isId ? 'Semua Tahapan' : 'All Stages',
      icon: Layers,
      count: items.length,
    },
    {
      id: 'video' as DepartmentTab,
      label: isId ? 'Video & Animasi AI' : 'AI Video & Animation',
      icon: Film,
      count: items.filter((i) => VIDEO_CATEGORIES.includes(i.category)).length,
    },
    {
      id: 'stills' as DepartmentTab,
      label: isId ? 'Gambar & Konsep Visual' : 'Images & Visual Stills',
      icon: Sparkles,
      count: items.filter((i) => STILLS_CATEGORIES.includes(i.category)).length,
    },
    {
      id: 'voiceover' as DepartmentTab,
      label: isId ? 'Voice Over & Dialog' : 'Voice Over & Dialogue',
      icon: Mic,
      count: items.filter((i) => i.category === 'voice_over').length,
    },
    {
      id: 'music' as DepartmentTab,
      label: isId ? 'Musik & Soundtrack' : 'Music & Soundtrack',
      icon: Music,
      badgeText: isId ? 'BGM' : 'BGM',
      count: items.filter((i) => i.category === 'music').length,
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1 Baris Bersih: 5 Tab Departemen + Status Sinkron */}
      <div className={`${cardClass} rounded-[16px] p-3.5`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {departments.map((dept) => {
              const Icon = dept.icon;
              const isActive = activeDepartment === dept.id;
              return (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => {
                    setActiveDepartment(dept.id);
                    setSelectedCategoryFilter('all');
                    setShowQuickAddMenu(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#0068ad] text-white shadow-sm'
                      : 'bg-[var(--vv-tint-weak)] text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)] hover:bg-[var(--vv-tint)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{dept.label}</span>
                  {typeof dept.count === 'number' ? (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[var(--vv-field)] text-[var(--vv-text-subtle)]'
                      }`}
                    >
                      {dept.count}
                    </span>
                  ) : dept.badgeText ? (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-sky-500/15 text-sky-400'
                      }`}
                    >
                      {dept.badgeText}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-[var(--vv-text-subtle)] hidden lg:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              {isId ? 'Tersinkronisasi 1 Video' : 'Synced for 1 Video'}
            </span>
          </div>
        </div>
      </div>

      {/* Voice Over AI Department Guide Panel */}
      {activeDepartment === 'voiceover' && (
        <div className={`${cardClass} rounded-[16px] p-6 space-y-5 border border-sky-500/30 bg-sky-950/10`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-sky-500/20 border border-sky-500/35 flex items-center justify-center text-sky-400 shrink-0">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[var(--vv-text-primary)]">
                    {isId ? 'Departemen Voice Over & Sulih Suara AI' : 'AI Voice Over & Narration Department'}
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30">
                    {isId ? 'Sinkronisasi Audio' : 'Audio Sync'}
                  </span>
                </div>
                <p className="text-xs text-[var(--vv-text-muted)] mt-0.5">
                  {isId
                    ? 'Selaraskan naskah narasi & dialog karakter AI Anda langsung dengan durasi bersih video.'
                    : 'Synchronize your narration scripts & AI character dialogues directly with the clean video duration.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => onAddAndOpenModal('voice_over')}
                className="vv-btn-accent px-4 py-2 text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {isId
                    ? 'Tambah File Audio (ElevenLabs)'
                    : 'Add Audio File (ElevenLabs)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDepartment('video')}
                className="vv-btn-secondary px-3.5 py-2 text-xs"
              >
                <Film className="w-3.5 h-3.5 text-[#0099ff]" />
                <span>{isId ? 'Kembali ke Shot / Video' : 'Back to Shots / Video'}</span>
              </button>
            </div>
          </div>

          {/* Live Voice Pacing Metric */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="vv-card-quiet p-3.5 rounded-[12px] space-y-1">
              <span className="text-[11px] text-[var(--vv-text-muted)] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>{isId ? 'Durasi Bersih Video' : 'Clean Video Duration'}</span>
              </span>
              <div className="text-lg font-bold text-sky-400 tabular-nums">
                {formatDualDuration(cleanDurationSec, isId)}
              </div>
              <div className="text-[10px] text-[var(--vv-text-subtle)]">
                {isId ? 'Patokan total panjang timeline visual' : 'Visual timeline length reference'}
              </div>
            </div>

            <div className="vv-card-quiet p-3.5 rounded-[12px] space-y-1">
              <span className="text-[11px] text-[var(--vv-text-muted)] flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isId ? 'Estimasi Panjang Naskah' : 'Estimated Script Length'}</span>
              </span>
              <div className="text-lg font-bold text-emerald-400 tabular-nums">
                &plusmn; {cleanDurationSec > 0 ? Math.round((cleanDurationSec / 60) * 135) : 0} {isId ? 'Kata' : 'Words'}
              </div>
              <div className="text-[10px] text-[var(--vv-text-subtle)]">
                {isId ? 'Kecepatan normal sineas (~130-150 kata/menit)' : 'Standard pacing (~130-150 words/min)'}
              </div>
            </div>

            <div className="vv-card-quiet p-3.5 rounded-[12px] space-y-1">
              <span className="text-[11px] text-[var(--vv-text-muted)] flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-amber-400" />
                <span>{isId ? 'Buffer Waktu Jeda / Hening' : 'Pause & Breath Buffer'}</span>
              </span>
              <div className="text-lg font-bold text-amber-400 tabular-nums">
                &plusmn; {cleanDurationSec > 0 ? Math.max(2, Math.round(cleanDurationSec * 0.15)) : 0}s
              </div>
              <div className="text-[10px] text-[var(--vv-text-subtle)]">
                {isId ? 'Ruang jeda antar dialog agar tidak terburu-buru' : 'Breathing room between dialog lines'}
              </div>
            </div>
          </div>

          {/* Tips Sineas AI & Tools Rekomendasi */}
          <div className="p-4 rounded-[12px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border)] space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[var(--vv-text-strong)]">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isId ? 'Panduan Sineas AI: Alur Kerja Voice Over & Lipsync' : 'AI Filmmaker Guide: Voice Over & Lipsync Workflow'}</span>
            </div>
            <p className="text-[var(--vv-text-muted)] leading-relaxed">
              {isId
                ? 'Higgsfield mengoptimalkan proses visual dan gerakan video. Untuk suara narator atau karakter, generate suara melalui tool TTS AI (seperti ElevenLabs, Cartesia, atau OpenAI TTS) sebelum atau sesudah video dibuat. Pastikan total durasi audio tidak melebihi Durasi Bersih video di atas agar ritme adegan selaras.'
                : 'Higgsfield excels at visual generation. For character speech or voiceovers, generate speech using AI TTS tools (such as ElevenLabs, Cartesia, or OpenAI TTS) matching the Clean Duration above so your audio pacing aligns seamlessly.'}
            </p>
          </div>
        </div>
      )}

      {/* Music & Soundtrack AI Department Guide Panel */}
      {activeDepartment === 'music' && (
        <div className={`${cardClass} rounded-[16px] p-6 space-y-5 border border-purple-500/30 bg-purple-950/10`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-500/20 border border-purple-500/35 flex items-center justify-center text-purple-400 shrink-0">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[var(--vv-text-primary)]">
                    {isId ? 'Departemen Musik & Audio Latar (BGM)' : 'Music & Background Audio (BGM) Department'}
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                    {isId ? 'Desain Suara' : 'Sound Design'}
                  </span>
                </div>
                <p className="text-xs text-[var(--vv-text-muted)] mt-0.5">
                  {isId
                    ? 'Atur ritme musik pengiring agar selaras dengan pergantian adegan video AI Anda.'
                    : 'Pace your background soundtrack to match the rhythm of your AI video scene cuts.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
              <button
                type="button"
                onClick={() => onAddAndOpenModal('music')}
                className="vv-btn-primary px-3.5 py-2 text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  {isId
                    ? 'Tambah Track Musik Suno'
                    : 'Add Suno Music Track'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDepartment('video')}
                className="vv-btn-secondary px-3.5 py-2 text-xs shrink-0"
              >
                <Film className="w-3.5 h-3.5 text-[#0099ff]" />
                <span>
                  {isId ? 'Kembali ke Shot / Video' : 'Back to Shots / Video'}
                </span>
              </button>
            </div>
          </div>

          {/* Live Music Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="vv-card-quiet p-3.5 rounded-[12px] space-y-1">
              <span className="text-[11px] text-[var(--vv-text-muted)] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>{isId ? 'Durasi Bersih Video' : 'Clean Video Duration'}</span>
              </span>
              <div className="text-lg font-bold text-purple-400 tabular-nums">
                {formatDualDuration(cleanDurationSec, isId)}
              </div>
              <div className="text-[10px] text-[var(--vv-text-subtle)]">
                {isId ? 'Panjang adegan visual pokok' : 'Core visual scenes length'}
              </div>
            </div>

            <div className="vv-card-quiet p-3.5 rounded-[12px] space-y-1">
              <span className="text-[11px] text-[var(--vv-text-muted)] flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-pink-400" />
                <span>{isId ? 'Durasi Musik Rekomendasi' : 'Recommended Music Track'}</span>
              </span>
              <div className="text-lg font-bold text-pink-400 tabular-nums">
                {cleanDurationSec > 0 ? formatDualDuration(cleanDurationSec + 8, isId) : (isId ? '0 detik' : '0 sec')}
              </div>
              <div className="text-[10px] text-[var(--vv-text-subtle)]">
                {isId ? '+8s buffer untuk fade-out halus' : '+8s buffer for smooth fade-out'}
              </div>
            </div>

            <div className="vv-card-quiet p-3.5 rounded-[12px] space-y-1">
              <span className="text-[11px] text-[var(--vv-text-muted)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isId ? 'Tempo / Mood Ketukan' : 'Recommended Beat Tempo'}</span>
              </span>
              <div className="text-lg font-bold text-amber-400 tabular-nums">
                95 - 120 BPM
              </div>
              <div className="text-[10px] text-[var(--vv-text-subtle)]">
                {isId ? 'Ritme ideal untuk pergantian shot 3-5 detik' : 'Ideal tempo for 3-5s shot cuts'}
              </div>
            </div>
          </div>

          {/* Tips Musik Sineas AI */}
          <div className="p-4 rounded-[12px] bg-[var(--vv-tint-weak)] border border-[var(--vv-border)] space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[var(--vv-text-strong)]">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{isId ? 'Panduan Sineas AI: Sinkronisasi Beat Musik & Shot Cut' : 'AI Filmmaker Guide: Music Beat & Shot Cut Sync'}</span>
            </div>
            <p className="text-[var(--vv-text-muted)] leading-relaxed">
              {isId
                ? 'Buat musik latar menggunakan generator musik AI (seperti Suno AI, Udio, atau Soundraw) berdurasi sekitar ' + formatDualDuration(cleanDurationSec + 8, isId) + '. Potong setiap shot video pada ketukan downbeat musik untuk transisi visual yang dinamis dan berenergi tinggi.'
                : 'Create background music using AI music generators (e.g. Suno AI, Udio, Soundraw) lasting around ' + formatDualDuration(cleanDurationSec + 8, isId) + '. Cut each video shot on music downbeats for high-energy visual flow.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
