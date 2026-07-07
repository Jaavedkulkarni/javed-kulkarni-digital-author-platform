import type { SuspendUserFormValues } from './suspend-restore.schema';
import type { PeopleUser } from '../types/people.types';

export type SuspendReason = SuspendUserFormValues['reason'];

export interface SuspendUserPayload {
  userId: string;
  reason: SuspendReason;
  notes?: string;
  effectiveImmediately: boolean;
}

export interface RestoreUserPayload {
  userId: string;
  notes?: string;
}

export interface SuspendUserApiResponse {
  userId: string;
  status: string;
}

export interface RestoreUserApiResponse {
  userId: string;
  status: string;
  deletedAt: string | null;
}

export interface BulkUserActionResult {
  user: PeopleUser;
  success: boolean;
  message?: string;
}

export type PeopleSuspendRestoreDialogMode = 'suspend' | 'restore' | 'bulk-suspend' | 'bulk-restore' | null;

export type { SuspendUserFormValues, RestoreUserFormValues } from './suspend-restore.schema';
