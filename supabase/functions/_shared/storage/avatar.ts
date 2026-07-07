export const AVATAR_BUCKET = 'avatars';
export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
export const ALLOWED_AVATAR_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

export const ALLOWED_AVATAR_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);

export function buildAvatarFolder(userId: string): string {
  return userId;
}

export function buildAvatarFilename(version: number, extension: string): string {
  const ext = extension.toLowerCase().replace(/^\./, '');
  if (!ALLOWED_AVATAR_EXTENSIONS.has(ext)) {
    throw new Error('Invalid avatar extension');
  }
  return `avatar-v${version}.${ext}`;
}

export function buildAvatarPath(userId: string, version: number, extension: string): string {
  return `${buildAvatarFolder(userId)}/${buildAvatarFilename(version, extension)}`;
}

export function extensionFromMime(mime: string): string {
  switch (mime.toLowerCase()) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    default:
      throw new Error('Unsupported avatar mime type');
  }
}

export function validateAvatarMime(mime: string): void {
  if (!ALLOWED_AVATAR_MIME_TYPES.has(mime.toLowerCase())) {
    throw new Error('Avatar must be JPG, PNG, or WEBP');
  }
}

export function validateAvatarSize(sizeBytes: number): void {
  if (sizeBytes <= 0 || sizeBytes > AVATAR_MAX_BYTES) {
    throw new Error(`Avatar must be between 1 byte and ${AVATAR_MAX_BYTES} bytes`);
  }
}

export function buildAvatarPublicUrl(supabaseUrl: string, path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${AVATAR_BUCKET}/${path}`;
}

export function buildAvatarSignedUrlPath(path: string): string {
  return path;
}
