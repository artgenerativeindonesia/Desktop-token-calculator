import React from 'react';
import { ModelTierBadge, ProcessCategory } from '../../../shared/types/project';

export type SettingsTab = 'all' | 'fx' | 'higgsfield' | 'audio';

export type PlanFilterTab =
  | 'all'
  | 'individual_monthly'
  | 'individual_annual'
  | 'business'
  | 'topup';

export const ALL_CATEGORIES: ProcessCategory[] = [
  'text_to_image',
  'image_to_image',
  'image_to_video',
  'video_to_video',
  'text_to_video',
  'upscale_image',
  'upscale_video',
  'voice_over',
  'music',
];

export const renderTierBadge = (badge?: ModelTierBadge): React.ReactNode => {
  if (!badge || badge === 'STANDARD') return null;
  if (badge === 'NEW') {
    return (
      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider vv-badge-emerald">
        NEW
      </span>
    );
  }
  if (badge === 'PREMIUM') {
    return (
      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border vv-badge-amber">
        PREMIUM
      </span>
    );
  }
  if (badge === 'POPULER') {
    return (
      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#0099ff]/15 text-[#0066cc] dark:text-[#7acaff] border border-[#0099ff]/35">
        POPULER
      </span>
    );
  }
  return null;
};
