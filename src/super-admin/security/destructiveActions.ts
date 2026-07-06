import { DESTRUCTIVE_ACTIONS } from '../constants/superAdmin.constants';

export function isDestructiveAction(action: string): boolean {
  return (DESTRUCTIVE_ACTIONS as readonly string[]).includes(action);
}

export function requireConfirmation(action: string): boolean {
  return isDestructiveAction(action);
}
