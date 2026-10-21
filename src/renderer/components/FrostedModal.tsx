import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { GlassTheme } from '../../shared/types/project';

export interface FrostedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: string;
  badgeLabel?: string;
  badgeIcon?: React.ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  theme: GlassTheme;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const MAX_WIDTH_CLASSES: Record<NonNullable<FrostedModalProps['maxWidth']>, string> = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
};

export const FrostedModal: React.FC<FrostedModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badgeLabel,
  badgeIcon,
  maxWidth = 'xl',
  theme,
  footer,
  children,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const backdropClass =
    theme === 'dark' ? 'vv-modal-backdrop-dark' : 'vv-modal-backdrop-light';
  const surfaceClass =
    theme === 'dark' ? 'vv-modal-surface-dark' : 'vv-modal-surface-light';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 ${backdropClass}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`${surfaceClass} ${MAX_WIDTH_CLASSES[maxWidth]} w-full rounded-[20px] overflow-hidden flex flex-col max-h-[86vh]`}
      >
        {/* Frosted Modal Header */}
        <div className="px-6 py-4 border-b border-[var(--vv-border)] flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0">
            {badgeLabel && (
              <div className="mb-1.5">
                <span className="vv-badge-pill">
                  {badgeIcon ?? <span className="vv-blue-dot" />}
                  <span>{badgeLabel}</span>
                </span>
              </div>
            )}
            <h2 className="text-lg font-semibold tracking-tight text-[var(--vv-text-primary)]">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-[var(--vv-text-muted)] mt-1 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Tutup (Esc)"
            className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[var(--vv-tint-weak)] hover:bg-[var(--vv-tint)] border border-[var(--vv-border-strong)] text-xs text-[var(--vv-text-muted)] hover:text-[var(--vv-text-primary)] transition"
          >
            <span className="text-[10px] font-mono hidden sm:inline">Esc</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">{children}</div>

        {/* Optional Sticky Frosted Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[var(--vv-border)] bg-[var(--vv-tint-weak)] flex flex-wrap items-center justify-between gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
