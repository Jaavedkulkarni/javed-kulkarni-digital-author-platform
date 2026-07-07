export const AVATAR_ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const;
export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
export const AVATAR_BUCKET = 'avatars';

export type AvatarMimeType = (typeof AVATAR_ALLOWED_MIME_TYPES)[number];

export interface AvatarUploadResult {
  userId: string;
  storagePath: string;
  publicUrl: string;
  version: number;
  updatedAt: string;
}

export interface AvatarDeleteResult {
  userId: string;
  deleted: boolean;
  previousPath?: string;
}

export function validateAvatarFile(file: File): void {
  if (!AVATAR_ALLOWED_MIME_TYPES.includes(file.type as AvatarMimeType)) {
    throw new Error('Avatar must be JPG, PNG, or WEBP');
  }
  if (file.size <= 0 || file.size > AVATAR_MAX_BYTES) {
    throw new Error('Avatar file size is invalid');
  }
}

export async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function buildAvatarPublicUrl(supabaseUrl: string, path: string): string {
  return `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${AVATAR_BUCKET}/${path}`;
}

export function versionedAvatarUrl(publicUrl: string, version: number): string {
  const separator = publicUrl.includes('?') ? '&' : '?';
  return `${publicUrl}${separator}v=${version}`;
}
