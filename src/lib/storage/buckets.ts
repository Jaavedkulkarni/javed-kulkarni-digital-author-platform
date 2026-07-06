export const STORAGE_BUCKETS = {
  BOOK_COVERS: 'book-covers',
  BOOK_FILES: 'book-files',
  AUTHOR_ASSETS: 'author-assets',
  PUBLISHER_ASSETS: 'publisher-assets',
  MEDIA: 'media',
  BLOG_IMAGES: 'blog-images',
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

export const DEFAULT_SIGNED_URL_TTL_SECONDS = 3600;

export const MAX_UPLOAD_SIZE_BYTES = 104_857_600;

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

export const ALLOWED_BOOK_FILE_TYPES = [
  'application/epub+zip',
  'application/pdf',
  'application/octet-stream',
] as const;

export function buildBookCoverPath(bookId: string, filename: string): string {
  return `${bookId}/${filename}`;
}

export function buildBookFilePath(bookId: string, format: 'epub' | 'pdf'): string {
  return `${bookId}/edition.${format === 'epub' ? 'epub' : 'pdf'}`;
}

export function buildAuthorAssetPath(authorId: string, filename: string): string {
  return `${authorId}/${filename}`;
}

export function buildPublisherAssetPath(publisherId: string, filename: string): string {
  return `${publisherId}/${filename}`;
}

export function sanitizeStorageFilename(name: string): string {
  const ext = name.split('.').pop() ?? 'bin';
  const base = name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .slice(0, 80);
  return `${Date.now()}_${base}.${ext}`;
}
