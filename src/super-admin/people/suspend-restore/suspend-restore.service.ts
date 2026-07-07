import { invokeEdgeFunctionOrThrow } from '../../../lib/edge-functions';
import { createIdempotencyKey } from '../../../enterprise/idempotency/idempotency-key';
import type {
  RestoreUserApiResponse,
  RestoreUserPayload,
  SuspendUserApiResponse,
  SuspendUserPayload,
} from './suspend-restore.types';

export class SuspendRestoreService {
  async suspendUser(payload: SuspendUserPayload): Promise<SuspendUserApiResponse> {
    return invokeEdgeFunctionOrThrow<SuspendUserApiResponse>(
      'suspend-user',
      payload as unknown as Record<string, unknown>,
      { idempotencyKey: createIdempotencyKey('suspend-user') },
    );
  }

  async restoreUser(payload: RestoreUserPayload): Promise<RestoreUserApiResponse> {
    return invokeEdgeFunctionOrThrow<RestoreUserApiResponse>(
      'restore-user',
      payload as unknown as Record<string, unknown>,
      { idempotencyKey: createIdempotencyKey('restore-user') },
    );
  }
}

let suspendRestoreService: SuspendRestoreService | null = null;

export function getSuspendRestoreService(): SuspendRestoreService {
  if (!suspendRestoreService) suspendRestoreService = new SuspendRestoreService();
  return suspendRestoreService;
}

export default SuspendRestoreService;
