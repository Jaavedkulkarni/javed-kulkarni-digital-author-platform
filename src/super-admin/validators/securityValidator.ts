import { invalidResult, validResult } from './common';
import { isDestructiveAction } from '../security/destructiveActions';

export function validateDestructiveAction(action: string, confirmed: boolean) {
  if (!isDestructiveAction(action)) return validResult();
  if (!confirmed) return invalidResult(['Confirmation required for destructive action.']);
  return validResult();
}
