import type { ReaderThemeId } from '../types/common';
import type { ReaderTypography } from '../types/typography.types';

export const READER_ENGINE_SCOPE = 'reader-engine';
export const SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000;
export const POSITION_SYNC_DEBOUNCE_MS = 3000;
export const OFFLINE_CACHE_TTL_DAYS = 30;
export const DEFAULT_WORDS_PER_MINUTE = 200;
export const LAZY_CHAPTER_BATCH_SIZE = 3;
export const VIRTUAL_RENDER_BUFFER_CHAPTERS = 2;
export const MAX_SEARCH_RESULTS = 50;
export const SYNC_CONFLICT_STRATEGY = 'last_write_wins' as const;

export const READER_THEMES: Record<ReaderThemeId, { background: string; text: string; accent: string }> = {
  light: { background: '#ffffff', text: '#1a1a1a', accent: '#b8860b' },
  dark: { background: '#1a1a1a', text: '#e8e8e8', accent: '#d4a853' },
  sepia: { background: '#f4ecd8', text: '#5b4636', accent: '#8b6914' },
};

export const DEFAULT_BOOKMARK_COLOR = '#b8860b';
export const DEFAULT_HIGHLIGHT_COLOR = '#fef08a';

export const FONT_FAMILY_MAP: Record<ReaderTypography['fontFamily'], string> = {
  serif: 'Georgia, "Times New Roman", serif',
  'sans-serif': 'system-ui, -apple-system, sans-serif',
  literata: '"Literata", Georgia, serif',
  charter: '"Charter", Georgia, serif',
  system: 'system-ui, sans-serif',
};
