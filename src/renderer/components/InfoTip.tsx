import React from 'react';
import { HelpCircle } from 'lucide-react';

interface InfoTipProps {
  /** Isi penjelasan singkat yang muncul saat ikon (?) disentuh kursor / difokus */
  children: React.ReactNode;
  /** Arah perataan kotak penjelasan agar tidak terpotong di tepi layar */
  align?: 'left' | 'center' | 'right';
  /** Lebar kotak penjelasan */
  width?: number;
}

/**
 * Ikon (?) kecil yang memunculkan penjelasan singkat dengan bahasa sehari-hari.
 * Muncul saat kursor diarahkan ke ikon, atau saat ikon difokus dengan tombol Tab.
 */
export const InfoTip: React.FC<InfoTipProps> = ({
  children,
  align = 'left',
  width = 260,
}) => {
  const alignClass =
    align === 'right'
      ? 'right-0'
      : align === 'center'
      ? 'left-1/2 -translate-x-1/2'
      : 'left-0';

  return (
    <span className="relative inline-flex align-middle group">
      <button
        type="button"
        tabIndex={0}
        aria-label="Penjelasan"
        className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[var(--vv-text-subtle)] hover:text-[#0099ff] focus:text-[#0099ff] focus:outline-none transition"
        onClick={(e) => e.preventDefault()}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
      <span
        role="tooltip"
        style={{ width }}
        className={`pointer-events-none absolute top-full mt-1.5 ${alignClass} z-50 rounded-[10px] border border-[var(--vv-border-strong)] bg-[rgba(14,16,22,0.96)] backdrop-blur-md px-3 py-2.5 text-[11px] font-normal normal-case tracking-normal leading-relaxed text-[#e6edf5] shadow-xl opacity-0 translate-y-1 transition duration-150 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0`}
      >
        {children}
      </span>
    </span>
  );
};
