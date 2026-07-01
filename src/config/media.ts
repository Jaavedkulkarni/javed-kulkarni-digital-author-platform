export const MEDIA_STORAGE_BUCKET = 'media';

/** Storage folder prefixes — extend for future EPUB, audio, video uploads */
export const MEDIA_PATHS = {
  root: '',
  images: 'images',
  covers: 'covers',
  pdfs: 'pdfs',
  epub: 'epub',
  audio: 'audio',
  video: 'video',
} as const;

/** Prefixes scanned when listing the media library */
export const MEDIA_LIST_PREFIXES: string[] = [
  MEDIA_PATHS.root,
  MEDIA_PATHS.images,
  MEDIA_PATHS.covers,
  MEDIA_PATHS.pdfs,
  MEDIA_PATHS.epub,
  MEDIA_PATHS.audio,
  MEDIA_PATHS.video,
];

export type MediaKind = 'image' | 'pdf' | 'epub' | 'audio' | 'video';

export const MEDIA_KIND_LABELS: Record<MediaKind, string> = {
  image: 'Image',
  pdf: 'PDF',
  epub: 'EPUB',
  audio: 'Audio',
  video: 'Video',
};

const MIME_PREFIXES: Record<MediaKind, string[]> = {
  image: ['image/'],
  pdf: ['application/pdf'],
  epub: ['application/epub+zip', 'application/epub'],
  audio: ['audio/'],
  video: ['video/'],
};

const EXTENSIONS: Record<MediaKind, string[]> = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'],
  pdf: ['pdf'],
  epub: ['epub'],
  audio: ['mp3', 'wav', 'ogg', 'm4a', 'aac'],
  video: ['mp4', 'webm', 'mov', 'mkv'],
};

export function getAcceptString(kinds: MediaKind[]): string {
  const parts: string[] = [];
  for (const kind of kinds) {
    parts.push(...MIME_PREFIXES[kind]);
    for (const ext of EXTENSIONS[kind]) {
      parts.push(`.${ext}`);
    }
  }
  return parts.join(',');
}

export function detectMediaKind(mime: string, filename: string): MediaKind | null {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  for (const kind of Object.keys(MIME_PREFIXES) as MediaKind[]) {
    if (MIME_PREFIXES[kind].some((prefix) => mime.startsWith(prefix))) return kind;
    if (EXTENSIONS[kind].includes(ext)) return kind;
  }
  return null;
}

export function getUploadFolder(kind: MediaKind): string {
  switch (kind) {
    case 'image':
      return MEDIA_PATHS.images;
    case 'pdf':
      return MEDIA_PATHS.pdfs;
    case 'epub':
      return MEDIA_PATHS.epub;
    case 'audio':
      return MEDIA_PATHS.audio;
    case 'video':
      return MEDIA_PATHS.video;
    default:
      return MEDIA_PATHS.images;
  }
}

export function isKindEnabled(kind: MediaKind): boolean {
  return kind === 'image' || kind === 'pdf';
}
