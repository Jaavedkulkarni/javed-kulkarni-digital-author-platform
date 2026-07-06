export const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
] as const;

export const ACCENT_OPTIONS = [
  { value: 'gold', label: 'Gold' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'purple', label: 'Purple' },
] as const;

export const FONT_SIZE_OPTIONS = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
] as const;

export const READING_MODE_OPTIONS = [
  { value: 'scroll', label: 'Scroll' },
  { value: 'pagination', label: 'Pagination' },
  { value: 'page-curl', label: 'Page Curl' },
] as const;

export const PAGE_ANIMATION_OPTIONS = [
  { value: 'on', label: 'On' },
  { value: 'off', label: 'Off' },
] as const;

export const LANGUAGE_OPTIONS = ['English', 'Marathi', 'Hindi'] as const;

export const DATE_FORMAT_OPTIONS = ['DD MMM YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] as const;

export const TIME_FORMAT_OPTIONS = ['12-hour', '24-hour'] as const;

export const SELECT_CLASS =
  'mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 dark:border-navy-700 dark:bg-navy-900/60 dark:text-gray-200';

export const LABEL_CLASS = 'text-xs font-medium text-gray-500 dark:text-gray-400';

export const RADIO_LABEL_CLASS =
  'inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors focus-within:ring-2 focus-within:ring-gold-400/50';

export const RADIO_SELECTED_CLASS =
  'border-brand/40 bg-brand/5 text-brand dark:border-gold-500/30 dark:bg-gold-500/10 dark:text-gold-300';

export const RADIO_IDLE_CLASS =
  'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-navy-700 dark:bg-navy-900/40 dark:text-gray-300 dark:hover:bg-navy-800';
