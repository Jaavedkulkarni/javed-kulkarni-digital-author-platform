import { ERROR_CATALOG } from '../../../core/errors';
import { EdgeFunctionInvokeError } from '../../../lib/edge-functions';

export function mapEditUserErrorToMessage(error: unknown): string {
  if (error instanceof EdgeFunctionInvokeError) {
    if (error.code === 'ROLE_001' || error.code === 'AUTH_001') {
      return ERROR_CATALOG.ROLE_001.message;
    }
    if (error.code === 'ROLE_002') {
      return ERROR_CATALOG.ROLE_002.message;
    }
    if (error.code === 'USER_002') {
      return 'This phone number is already registered to another user.';
    }
    if (error.message.toLowerCase().includes('phone')) {
      return 'This phone number is already registered to another user.';
    }
    if (error.message.toLowerCase().includes('role')) {
      return ERROR_CATALOG.ROLE_002.message;
    }
    if (error.message.toLowerCase().includes('permission')) {
      return ERROR_CATALOG.ROLE_001.message;
    }
    if (error.message.toLowerCase().includes('validation')) {
      return 'Please review the form and fix validation errors.';
    }
    return error.message;
  }

  if (error instanceof Error && error.message) {
    if (error.message.toLowerCase().includes('phone')) {
      return 'This phone number is already registered to another user.';
    }
    return error.message;
  }

  return ERROR_CATALOG.SYSTEM_003.message;
}
