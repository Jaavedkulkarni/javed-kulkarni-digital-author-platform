import { ERROR_CATALOG } from '../../../core/errors';
import { EdgeFunctionInvokeError } from '../../../lib/edge-functions';

export function mapBulkOperationErrorToMessage(error: unknown): string {
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
      return 'Cannot modify the last active Super Admin.';
    }
    if (message.includes('duplicate email')) {
      return 'Duplicate email detected.';
    }
    if (message.includes('duplicate phone')) {
      return 'Duplicate phone detected.';
    }
    if (message.includes('invalid role')) {
      return 'Invalid role specified.';
    }
    return error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return ERROR_CATALOG.SYSTEM_003.message;
}
