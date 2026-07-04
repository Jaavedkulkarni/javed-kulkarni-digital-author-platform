import type { BookCardData } from '../book/bookTypes';

export type WishlistAvailability = 'in-stock' | 'out-of-stock' | 'coming-soon' | 'membership';

export interface WishlistBookItem extends BookCardData {
  price?: string;
  originalPrice?: string;
  discountPercent?: number;
  availability?: WishlistAvailability;
  addedDate?: string;
}

export const AVAILABILITY_LABELS: Record<WishlistAvailability, string> = {
  'in-stock': 'In Stock',
  'out-of-stock': 'Out of Stock',
  'coming-soon': 'Coming Soon',
  membership: 'Membership',
};

export const AVAILABILITY_STYLES: Record<WishlistAvailability, string> = {
  'in-stock':
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/20',
  'out-of-stock':
    'bg-gray-100 text-gray-600 border-gray-200 dark:bg-navy-700 dark:text-gray-400 dark:border-navy-600',
  'coming-soon':
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/20',
  membership:
    'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/20',
};
