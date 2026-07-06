export const readerEngineQueryKeys = {
  all: ['reader-engine'] as const,
  session: (userId: string, bookId: string) =>
    [...readerEngineQueryKeys.all, 'session', userId, bookId] as const,
  bookmarks: (userId: string, bookId: string) =>
    [...readerEngineQueryKeys.all, 'bookmarks', userId, bookId] as const,
  highlights: (userId: string, bookId: string) =>
    [...readerEngineQueryKeys.all, 'highlights', userId, bookId] as const,
  notes: (userId: string, bookId: string) =>
    [...readerEngineQueryKeys.all, 'notes', userId, bookId] as const,
  annotations: (userId: string, bookId: string) =>
    [...readerEngineQueryKeys.all, 'annotations', userId, bookId] as const,
  position: (userId: string, bookId: string) =>
    [...readerEngineQueryKeys.all, 'position', userId, bookId] as const,
  book: (bookId: string, format: string) =>
    [...readerEngineQueryKeys.all, 'book', bookId, format] as const,
  chapters: (bookId: string) => [...readerEngineQueryKeys.all, 'chapters', bookId] as const,
  statistics: (userId: string) => [...readerEngineQueryKeys.all, 'statistics', userId] as const,
  lastRead: (userId: string) => [...readerEngineQueryKeys.all, 'last-read', userId] as const,
  offline: (userId: string, bookId: string) =>
    [...readerEngineQueryKeys.all, 'offline', userId, bookId] as const,
};
