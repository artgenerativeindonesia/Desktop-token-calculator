import { ProcessCategory, QuantityType } from '../../../shared/types/project';

export type DepartmentTab = 'all' | 'video' | 'stills' | 'voiceover' | 'music';

export const VIDEO_CATEGORIES: ProcessCategory[] = [
  'text_to_video',
  'image_to_video',
  'video_to_video',
  'upscale_video',
];

export const STILLS_CATEGORIES: ProcessCategory[] = [
  'text_to_image',
  'image_to_image',
  'upscale_image',
];

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

/** Format durasi ganda: contoh "1m 30s (90s)" atau "45s (45s)" */
export function formatDualDuration(seconds: number, isId: boolean = true): string {
  if (!seconds || seconds <= 0) {
    return isId ? '0 detik (0s)' : '0 sec (0s)';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);

  if (mins === 0) {
    return `${secs}s (${secs}s)`;
  }
  const minPart = `${mins}m`;
  const secPart = secs > 0 ? ` ${secs}s` : '';
  return `${minPart}${secPart} (${seconds}s)`;
}

export const isItemPrimaryShot = (item: {
  is_primary_shot?: boolean;
  category: ProcessCategory;
}): boolean =>
  typeof item.is_primary_shot === 'boolean'
    ? item.is_primary_shot
    : item.category === 'text_to_video' || item.category === 'image_to_video';

export const tierBadgeClass = (badge?: string): string => {
  if (badge === 'NEW') return 'vv-badge-emerald';
  if (badge === 'PREMIUM') return 'vv-badge-amber';
  if (badge === 'POPULER')
    return 'bg-[#0099ff]/15 text-[#0066cc] dark:text-[#7acaff] border-[#0099ff]/35';
  return '';
};

/** Kata benda sesuai jenis isi (shot / file / audio file / track musik / gambar) */
export const unitNoun = (
  qt: QuantityType,
  language: 'id' | 'en',
  category?: ProcessCategory
): string => {
  if (category === 'voice_over') {
    return language === 'id' ? 'file audio' : 'audio files';
  }
  if (category === 'music') {
    return language === 'id' ? 'track lagu' : 'music tracks';
  }
  if (language === 'id') {
    return qt === 'shot' ? 'shot' : qt === 'asset' ? 'file' : 'gambar';
  }
  return qt === 'shot' ? 'shots' : qt === 'asset' ? 'files' : 'images';
};

/** Nama kolom berbentuk pertanyaan sederhana */
export const quantityQuestion = (
  qt: QuantityType,
  language: 'id' | 'en',
  category?: ProcessCategory
): string => {
  if (category === 'voice_over') {
    return language === 'id'
      ? 'Mau Buat Berapa File Audio?'
      : 'How Many Audio Files?';
  }
  if (category === 'music') {
    return language === 'id'
      ? 'Mau Buat Berapa Track / Lagu?'
      : 'How Many Music Tracks?';
  }
  return language === 'id'
    ? `Mau Buat Berapa ${qt === 'shot' ? 'Shot' : qt === 'asset' ? 'File' : 'Gambar'}?`
    : `How Many ${qt === 'shot' ? 'Shots' : qt === 'asset' ? 'Files' : 'Images'}?`;
};

export const getDefaultAddCategoryForDept = (
  dept: DepartmentTab
): ProcessCategory => {
  if (dept === 'stills') return 'text_to_image';
  if (dept === 'voiceover') return 'voice_over';
  if (dept === 'music') return 'music';
  return 'text_to_video';
};
