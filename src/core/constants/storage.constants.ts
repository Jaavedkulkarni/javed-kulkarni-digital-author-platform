export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  BOOK_COVERS: 'book-covers',
  BOOK_FILES: 'book-files',
  AUTHOR_ASSETS: 'author-assets',
  PUBLISHER_ASSETS: 'publisher-assets',
  MEDIA: 'media',
  BLOG_IMAGES: 'blog-images',
} as const;

export type StorageBucketName = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
export const DEFAULT_SIGNED_URL_TTL_SECONDS = 3600;
export const MAX_UPLOAD_SIZE_BYTES = 104_857_600;

export const ALLOWED_AVATAR_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;

export const ALLOWED_IMAGE_TYPES = [
  ...ALLOWED_AVATAR_MIME_TYPES,
  'image/gif',
] as const;

export const ALLOWED_BOOK_FILE_TYPES = [
  'application/epub+zip',
  'application/pdf',
  'application/octet-stream',
] as const;

export const AVATAR_PATH_PATTERN = '{userId}/avatar-v{version}.{ext}' as const;
