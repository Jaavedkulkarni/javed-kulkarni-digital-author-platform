import type { WorkspaceType } from '../types/workspace.types';
import { invalidResult, validResult, type ValidationResult } from './common';

export function validateWorkspaceSwitch(
  target: WorkspaceType,
  available: WorkspaceType[]
): ValidationResult {
  if (!available.includes(target)) {
    return invalidResult([`Workspace "${target}" is not available for this account.`]);
  }
  return validResult();
}
