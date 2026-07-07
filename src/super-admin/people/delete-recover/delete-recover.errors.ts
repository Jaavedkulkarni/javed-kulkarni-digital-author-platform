import { ERROR_CATALOG } from '../../../core/errors';
import { EdgeFunctionInvokeError } from '../../../lib/edge-functions';

export function mapDeleteRecoverErrorToMessage(error: unknown): string {
  if (error instanceof EdgeFunctionInvokeError) {
    const message = error.message.toLowerCase();

    if (error.code === 'ROLE_001' || message.includes('permission') || message.includes('super admin access')) {
      return ERROR_CATALOG.ROLE_001.message;
    }
    if (message.includes('cannot delete your own')) {
      return 'You cannot delete your own account.';
    }
    if (message.includes('last active super admin')) {
      return 'Cannot delete the last active Super Admin.';
    }
    if (message.includes('protected system account') || message.includes('protected account')) {
      return 'This protected system account cannot be modified.';
    }
    if (message.includes('already deleted')) {
      return 'This user is already deleted.';
    }
    if (message.includes('not deleted')) {
      return 'This user is not deleted.';
    }
    if (message.includes('already active')) {
      return 'This user is already active.';
    }
    if (message.includes('validation')) {
      return 'Please review the form and fix validation errors.';
    }
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return mapDeleteRecoverErrorToMessage(new EdgeFunctionInvokeError(error.message, 'SYSTEM_003'));
  }

  return ERROR_CATALOG.SYSTEM_003.message;
}
