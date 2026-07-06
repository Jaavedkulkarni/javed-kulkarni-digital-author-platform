export const readerQueryKeys = {
  all: ['reader'] as const,
  library: (userId: string) => [...readerQueryKeys.all, 'library', userId] as const,
  wishlist: (userId: string) => [...readerQueryKeys.all, 'wishlist', userId] as const,
  orders: (userId: string) => [...readerQueryKeys.all, 'orders', userId] as const,
  notifications: (userId: string) => [...readerQueryKeys.all, 'notifications', userId] as const,
  readingProgress: (userId: string) => [...readerQueryKeys.all, 'reading-progress', userId] as const,
  settings: (userId: string) => [...readerQueryKeys.all, 'settings', userId] as const,
  membership: (userId: string) => [...readerQueryKeys.all, 'membership', userId] as const,
  downloads: (userId: string) => [...readerQueryKeys.all, 'downloads', userId] as const,
  profile: (userId: string) => [...readerQueryKeys.all, 'profile', userId] as const,
  insights: (userId: string) => [...readerQueryKeys.all, 'insights', userId] as const,
  bookmarks: (userId: string, bookId?: string) =>
    [...readerQueryKeys.all, 'bookmarks', userId, bookId ?? 'all'] as const,
  notes: (userId: string, bookId?: string) =>
    [...readerQueryKeys.all, 'notes', userId, bookId ?? 'all'] as const,
  highlights: (userId: string, bookId?: string) =>
    [...readerQueryKeys.all, 'highlights', userId, bookId ?? 'all'] as const,
};
