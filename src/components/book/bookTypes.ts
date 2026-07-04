export type BookStatus =
  | 'purchased'
  | 'membership'
  | 'free'
  | 'coming-soon'
  | 'pre-order'
  | 'draft'
  | 'hidden';

export type BookFormat = 'paperback' | 'ebook' | 'audiobook';

export type BookActionLabel =
  | 'Continue Reading'
  | 'Read Now'
  | 'Open Book'
  | 'Download'
  | 'Preview';

export type BookCardState = 'normal' | 'selected' | 'disabled' | 'loading' | 'empty';

export interface BookCardData {
  id: string;
  title?: string;
  author?: string;
  language?: string;
  category?: string;
  format?: BookFormat;
  publicationDate?: string;
  progress?: number;
  status?: BookStatus;
  coverUrl?: string | null;
  coverAlt?: string;
}

export const BOOK_FORMAT_LABELS: Record<BookFormat, string> = {
  paperback: 'Paperback',
  ebook: 'eBook',
  audiobook: 'Audiobook',
};

export const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  purchased: 'Purchased',
  membership: 'Membership',
  free: 'Free',
  'coming-soon': 'Coming Soon',
  'pre-order': 'Pre-order',
  draft: 'Draft',
  hidden: 'Hidden',
};

export const BOOK_STATUS_STYLES: Record<BookStatus, string> = {
  purchased:
    'bg-brand/10 text-brand border-brand/20 dark:bg-brand/20 dark:text-gold-300 dark:border-gold-500/20',
  membership:
    'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/20',
  free: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-navy-700 dark:text-gray-300 dark:border-navy-600',
  'coming-soon':
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/20',
  'pre-order':
    'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/20',
  draft:
    'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/20',
  hidden:
    'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/15 dark:text-slate-400 dark:border-slate-500/20',
};
