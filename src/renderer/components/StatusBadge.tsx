import React from 'react';
import { AppLanguage, VerificationStatus } from '../../shared/types/project';
import { STATUS_LABELS } from '../i18n/translations';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  XCircle,
} from 'lucide-react';

interface StatusBadgeProps {
  status: VerificationStatus;
  language: AppLanguage;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  language,
  size = 'sm',
}) => {
  const label = STATUS_LABELS[status]?.[language] ?? status;
  const paddingClass =
    size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  switch (status) {
    case 'verified':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-semibold border vv-badge-emerald ${paddingClass}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          {label}
        </span>
      );
    case 'manual':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium border bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/35 ${paddingClass}`}
        >
          <Edit3 className="w-3.5 h-3.5 shrink-0" />
          {label}
        </span>
      );
    case 'stale':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium border vv-badge-amber ${paddingClass}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {label}
        </span>
      );
    case 'unavailable':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium border bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/35 ${paddingClass}`}
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {label}
        </span>
      );
    case 'invalid':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium border bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/40 ${paddingClass}`}
        >
          <XCircle className="w-3.5 h-3.5 shrink-0" />
          {label}
        </span>
      );
  }
};
