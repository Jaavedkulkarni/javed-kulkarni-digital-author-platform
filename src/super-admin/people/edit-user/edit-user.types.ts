import type { EditUserFormValues } from './edit-user.schema';
import type { EditUserDetail } from '../types/people.types';

export type EditUserStatus = 'active' | 'pending' | 'suspended';

export interface EditUserRoleOption {
  value: string;
  label: string;
}

export interface EditUserUpdatePayload {
  userId: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string | null;
  status?: EditUserStatus;
  language?: string;
  timezone?: string;
  internalNotes?: string;
  assignRoles?: string[];
  removeRoles?: string[];
  primaryRole?: string;
}

export interface EditUserApiResponse {
  profile: {
    id: string;
    email: string;
    full_name: string | null;
    status: string;
    phone: string | null;
    preferred_language: string | null;
    timezone: string | null;
  };
  previousStatus: string;
  roleChanges: string[];
}

export type { EditUserFormValues, EditUserDetail };
