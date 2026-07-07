import { invokeEdgeFunctionOrThrow } from '../../../lib/edge-functions';
import { createIdempotencyKey } from '../../../enterprise/idempotency/idempotency-key';
import type {
  DeleteUserApiResponse,
  DeleteUserPayload,
  RecoverUserApiResponse,
  RecoverUserPayload,
} from './delete-recover.types';

export class DeleteRecoverService {
  async deleteUser(payload: DeleteUserPayload): Promise<DeleteUserApiResponse> {
    return invokeEdgeFunctionOrThrow<DeleteUserApiResponse>(
      'delete-user',
      payload as unknown as Record<string, unknown>,
      { idempotencyKey: createIdempotencyKey('delete-user') },
    );
  }

  async recoverUser(payload: RecoverUserPayload): Promise<RecoverUserApiResponse> {
    return invokeEdgeFunctionOrThrow<RecoverUserApiResponse>(
      'recover-user',
      payload as unknown as Record<string, unknown>,
      { idempotencyKey: createIdempotencyKey('recover-user') },
    );
  }
}

let deleteRecoverService: DeleteRecoverService | null = null;

export function getDeleteRecoverService(): DeleteRecoverService {
  if (!deleteRecoverService) deleteRecoverService = new DeleteRecoverService();
  return deleteRecoverService;
}

export default DeleteRecoverService;
