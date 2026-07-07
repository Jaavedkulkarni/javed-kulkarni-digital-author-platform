import { ERROR_CATALOG } from '../../../core/errors';
import { EdgeFunctionInvokeError } from '../../../lib/edge-functions';

export function mapAccountSecurityErrorToMessage(error: unknown): string {
  if (error instanceof EdgeFunctionInvokeError) {
    const message = error.message.toLowerCase();
    if (error.code === 'ROLE_001' || message.includes('permission')) {
      return ERROR_CATALOG.ROLE_001.message;
    }
    if (message.includes('your own account')) {
      return 'You cannot perform this action on your own account.';
    }
    if (message.includes('protected system account')) {
      return 'This protected system account cannot be modified.';
    }
    if (message.includes('last active super admin')) {
      return 'Cannot modify security for the last active Super Admin.';
    }
    return error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return ERROR_CATALOG.SYSTEM_003.message;
}
