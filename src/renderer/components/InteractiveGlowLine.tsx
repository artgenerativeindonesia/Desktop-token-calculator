import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface InteractiveGlowLineProps {
  /** Tambahan class styling tailwind jika diperlukan */
  className?: string;
  /** Varian tata letak: 'header' (lebar penuh di bawah bilah menu), 'card' (di bibir atas kartu), 'hero' */
  variant?: 'header' | 'card' | 'hero' | 'minimal';
  /** Skema warna glow: 'blue' (studio electric cyan), 'emerald' (hijau zamrud studio), 'amber' (emas hangat) */
  colorScheme?: 'blue' | 'emerald' | 'amber';
  /** Apakah garis merespons gerakan kursor mouse secara interaktif */
  interactive?: boolean;
  /** Ketinggian garis dasar dalam pixel (default: 1) */
  thickness?: number;
  /** Tampilkan lencana info kecil saat diklik/diinteraksi */
  showInteractiveBadge?: boolean;
  /** Opsional: Ref elemen induk agar garis merespons gerakan mouse di seluruh area elemen induk */
  parentRef?: React.RefObject<HTMLElement | null>;
}

/**
 * InteractiveGlowLine — Garis Animasi Bercahaya Interaktif & Elegan
 *
 * Menggabungkan estetika studio Apple visionOS & Visuvate:
 * 1. Mode Standby (Ambient Sweep): Berpendar lembut dengan gerakan osilasi bolak-balik tanpa membebani mata.
 * 2. Mode Interaktif (Cursor Tracking): Mengikuti kursor mouse secara presisi dengan transisi fisika yang mulus.
 * 3. Efek Klik / Ripple Shockwave: Memancarkan gelombang cahaya halus melingkar saat disentuh/diklik.
 * 4. Adaptif Gelap & Terang: Otomatis menyesuaikan diri menggunakan CSS variables (--vv-glow-*).
 */
export const InteractiveGlowLine: React.FC<InteractiveGlowLineProps> = ({
  className = '',
  variant = 'header',
  colorScheme = 'blue',
  interactive = true,
  thickness = 1,
  showInteractiveBadge = false,
  parentRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePercent, setMousePercent] = useState<number>(50);
  const [isClicked, setIsClicked] = useState(false);
  const [clickCoord, setClickCoord] = useState<number>(50);

  // Pasang listener interaktif ke parentRef (jika ada) atau containerRef sendiri
  useEffect(() => {
    const target = parentRef?.current || containerRef.current;
    if (!target || !interactive) return;

    const onMove = (e: MouseEvent) => {
      const rect = target.getBoundingClientRect();
      if (rect.width > 0) {
        const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        setMousePercent(x);
        setIsHovered(true);
      }
    };

    const onEnter = () => setIsHovered(true);
    const onLeave = () => setIsHovered(false);

    target.addEventListener('mousemove', onMove);
    target.addEventListener('mouseenter', onEnter);
    target.addEventListener('mouseleave', onLeave);

    return () => {
      target.removeEventListener('mousemove', onMove);
      target.removeEventListener('mouseenter', onEnter);
      target.removeEventListener('mouseleave', onLeave);
    };
  }, [parentRef, interactive]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive) return;
      const target = parentRef?.current || containerRef.current;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      setClickCoord(x);
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 700);
    },
    [interactive, parentRef]
  );

  // Tentukan kelas CSS dinamis agar otomatis beradaptasi saat pengguna beralih mode Gelap/Terang
  const beamClass =
    colorScheme === 'emerald'
      ? 'vv-glow-beam-emerald'
      : colorScheme === 'amber'
      ? 'vv-glow-beam-emerald'
      : 'vv-glow-beam-blue';

  const auraClass =
    colorScheme === 'emerald'
      ? 'vv-glow-aura-emerald'
      : colorScheme === 'amber'
      ? 'vv-glow-aura-emerald'
      : 'vv-glow-aura-blue';

  const dotColor =
    colorScheme === 'emerald'
      ? 'var(--vv-glow-dot-emerald, #34d399)'
      : 'var(--vv-glow-dot-blue, #7acaff)';

  const beamWidth = variant === 'card' ? 180 : variant === 'hero' ? 260 : 320;

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`relative w-full select-none cursor-pointer group ${className}`}
      style={{
        height: `${Math.max(thickness, 1)}px`,
      }}
      title="Sentuh atau geser kursor untuk berinteraksi dengan garis pendar studio"
    >
      {/* Area sentuh ekstra transparan agar mudah dijangkau cursor */}
      <div className="absolute -top-2.5 -bottom-2.5 inset-x-0 z-10 cursor-pointer" />

      {/* 1. Base Hairline Track (Garis Rel Halus) */}
      <div
        className="absolute inset-0 w-full transition-opacity duration-300"
        style={{
          height: `${thickness}px`,
          backgroundColor: 'var(--vv-border)',
          opacity: isHovered ? 0.9 : 0.6,
        }}
      />

      {/* 2. Soft Ambient Aura (Pendar Cahaya Halus Menyeluruh Di Belakang Garis) */}
      <div
        className={`pointer-events-none absolute -top-3 h-7 rounded-full blur-[9px] transition-all duration-300 ease-out ${auraClass} ${
          isHovered ? 'scale-y-125 opacity-90' : 'vv-aura-ambient opacity-50'
        }`}
        style={{
          width: `${beamWidth * 1.35}px`,
          left: isHovered ? `calc(${mousePercent}% - ${(beamWidth * 1.35) / 2}px)` : undefined,
          transition: isHovered ? 'left 0.12s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s' : undefined,
        }}
      />

      {/* 3. Focused Specular Beam (Sinar Garis Bercahaya Tajam) */}
      <div
        className={`pointer-events-none absolute -top-[0.5px] rounded-full transition-all ease-out ${beamClass} ${
          isHovered ? 'opacity-100' : 'vv-glow-ambient opacity-75'
        }`}
        style={{
          height: `${thickness + 1}px`,
          width: `${beamWidth}px`,
          left: isHovered ? `calc(${mousePercent}% - ${beamWidth / 2}px)` : undefined,
          transition: isHovered ? 'left 0.08s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s' : undefined,
        }}
      />

      {/* 4. Center Specular Sparkle Dot (Inti Kilau Berlian di Titik Kursor) */}
      {isHovered && (
        <div
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-2 rounded-full ring-2 ring-white/60 transition-transform duration-100 ease-out"
          style={{
            left: `${mousePercent}%`,
            backgroundColor: dotColor,
            boxShadow: `0 0 10px 2px ${dotColor}`,
          }}
        />
      )}

      {/* 5. Ripple Shockwave (Pendar Melingkar saat Garis Diklik) */}
      {isClicked && (
        <div
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border border-white/80 animate-ping"
          style={{
            left: `${clickCoord}%`,
            width: '48px',
            height: '48px',
            backgroundColor: 'rgba(0, 153, 255, 0.25)',
            boxShadow: '0 0 20px 4px rgba(122, 202, 255, 0.7)',
          }}
        />
      )}

      {/* 6. Optional Minimal Interactive Hint Badge */}
      {showInteractiveBadge && isHovered && (
        <div
          className="pointer-events-none absolute -bottom-7 -translate-x-1/2 z-30 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wider uppercase border border-[var(--vv-border)] bg-[var(--vv-surface)] text-[var(--vv-text-muted)] shadow-lg backdrop-blur-md transition-opacity duration-200 animate-in fade-in"
          style={{ left: `${mousePercent}%` }}
        >
          Studio Beam • {Math.round(mousePercent)}%
        </div>
      )}
    </div>
  );
};

export default InteractiveGlowLine;
