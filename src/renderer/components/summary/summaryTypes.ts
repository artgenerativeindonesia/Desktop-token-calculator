import { ProcessCategory, ProjectCalculation, ProjectFile } from '../../../shared/types/project';

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

/**
 * Format durasi ringkas dalam menit dan detik (contoh: 90s -> 1m 30s)
 */
export const formatMinSec = (totalSeconds: number): string => {
  if (!totalSeconds || totalSeconds <= 0) return '0s';
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.round(totalSeconds % 60);
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
};

export interface BaseSummarySectionProps {
  language: 'id' | 'en';
  theme: 'dark' | 'light';
  project: ProjectFile;
  calculation: ProjectCalculation;
}
