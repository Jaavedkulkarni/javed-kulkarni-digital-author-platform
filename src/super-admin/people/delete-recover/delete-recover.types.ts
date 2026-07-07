import type { DeleteUserFormValues } from './delete-recover.schema';
import type { PeopleUser } from '../types/people.types';

export type DeleteReason = DeleteUserFormValues['reason'];

export interface DeleteUserPayload {
  userId: string;
  reason: DeleteReason;
  notes?: string;
}

export interface RecoverUserPayload {
  userId: string;
  notes?: string;
}

export interface DeleteUserApiResponse {
  userId: string;
  status: string;
  deletedAt: string;
}

export interface RecoverUserApiResponse {
  userId: string;
  status: string;
  deletedAt: string | null;
  restoredStatus: string;
}

export interface BulkUserActionResult {
  user: PeopleUser;
  success: boolean;
  message?: string;
}

export type PeopleDeleteRecoverDialogMode =
  | 'delete'
  | 'recover'
  | 'bulk-delete'
  | 'bulk-recover'
  | null;

export type { DeleteUserFormValues, RecoverUserFormValues, DeleteUserFormInput } from './delete-recover.schema';
