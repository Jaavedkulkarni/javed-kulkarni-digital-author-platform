export type LibraryBookStatus = 'purchased' | 'membership' | 'free';

export interface LibraryBookItem {
  id: string;
  title: string;
  author: string;
  language: string;
  category: string;
  purchaseDate: string;
  progress: number;
  status: LibraryBookStatus;
}

export const STATUS_STYLES: Record<LibraryBookStatus, string> = {
  purchased: 'bg-brand/10 text-brand border-brand/20 dark:bg-brand/20 dark:text-gold-300 dark:border-gold-500/20',
  membership: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/20',
  free: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-navy-700 dark:text-gray-300 dark:border-navy-600',
};

export const STATUS_LABELS: Record<LibraryBookStatus, string> = {
  purchased: 'Purchased',
  membership: 'Membership',
  free: 'Free',
};
