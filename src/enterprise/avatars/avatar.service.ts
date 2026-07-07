import { invokeEdgeFunctionOrThrow } from '../../lib/edge-functions';
import { getBrowserSupabaseEnv } from '../../lib/supabase/config/env';
import { buildAvatarFolder, buildAvatarPath } from '../../lib/storage/buckets';
import type { AvatarDeleteResult, AvatarUploadResult } from './avatar.types';
import { fileToBase64, validateAvatarFile } from './avatar.types';

export class AvatarService {
  async upload(userId: string, file: File, targetUserId?: string): Promise<AvatarUploadResult> {
    validateAvatarFile(file);
    const dataBase64 = await fileToBase64(file);

    return invokeEdgeFunctionOrThrow<AvatarUploadResult>('upload-avatar', {
      userId: targetUserId ?? userId,
      mimeType: file.type,
      dataBase64,
    });
  }

  async delete(userId: string, targetUserId?: string): Promise<AvatarDeleteResult> {
    return invokeEdgeFunctionOrThrow<AvatarDeleteResult>('delete-avatar', {
      userId: targetUserId ?? userId,
    });
  }

  getPublicUrl(userId: string, version: number, extension: string): string {
    const env = getBrowserSupabaseEnv();
    const path = buildAvatarPath(userId, version, extension);
    return `${env.url.replace(/\/$/, '')}/storage/v1/object/public/avatars/${path}`;
  }

  getFolder(userId: string): string {
    return buildAvatarFolder(userId);
  }
}

let avatarService: AvatarService | null = null;

export function getAvatarService(): AvatarService {
  if (!avatarService) avatarService = new AvatarService();
  return avatarService;
}

export default AvatarService;
