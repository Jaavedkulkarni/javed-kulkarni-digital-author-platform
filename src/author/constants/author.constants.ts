export const AUTHOR_SCOPE = 'author';
export const DEFAULT_ROYALTY_RATE = 0.7;
export const ANALYTICS_CACHE_TTL_MS = 5 * 60 * 1000;
export const BOOK_LIST_PAGE_SIZE = 20;

export const ACHIEVEMENT_DEFINITIONS = [
  { id: 'first_book', title: 'First Book', description: 'Publish your first book', icon: 'book', target: 1 },
  { id: 'ten_reads', title: 'Growing Audience', description: 'Reach 10 reads', icon: 'users', target: 10 },
  { id: 'first_sale', title: 'First Sale', description: 'Sell your first book', icon: 'dollar', target: 1 },
  { id: 'hundred_reads', title: 'Popular Author', description: 'Reach 100 reads', icon: 'star', target: 100 },
] as const;
