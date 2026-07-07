import { invokeEdgeFunctionOrThrow } from '../../../lib/edge-functions';
import { createIdempotencyKey } from '../../../enterprise/idempotency/idempotency-key';
import { getAvatarService } from '../../../enterprise/avatars/avatar.service';
import type { EditUserApiResponse, EditUserUpdatePayload } from './edit-user.types';

export class EditUserService {
  async updateUser(payload: EditUserUpdatePayload): Promise<EditUserApiResponse> {
    return invokeEdgeFunctionOrThrow<EditUserApiResponse>(
      'update-user',
      payload as unknown as Record<string, unknown>,
      { idempotencyKey: createIdempotencyKey('update-user') },
    );
  }

  async uploadAvatar(userId: string, file: File): Promise<void> {
    await getAvatarService().upload(userId, file, userId);
  }

  async deleteAvatar(userId: string): Promise<void> {
    await getAvatarService().delete(userId, userId);
  }
}

let editUserService: EditUserService | null = null;

export function getEditUserService(): EditUserService {
  if (!editUserService) editUserService = new EditUserService();
  return editUserService;
}

export default EditUserService;
