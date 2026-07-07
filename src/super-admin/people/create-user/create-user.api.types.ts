import type { EdgeFunctionResponse } from '../../../lib/edge-functions';
import type { CreateUserFormValues } from './create-user.schema';

export interface CreateUserApiRequest {
  firstName: string;
  lastName: string;
  displayName?: string;
  email: string;
  phone?: string;
  role: string;
  status: 'active' | 'pending' | 'suspended';
  emailVerificationRequired: boolean;
  password: string;
  language: string;
  timezone: string;
  internalNotes?: string;
}

export interface CreateUserApiData {
  userId: string;
  email: string;
  profileStatus: string;
  primaryRole: string;
  temporaryPasswordStatus: {
    active: boolean;
    expiresAt: string | null;
    forcePasswordChange: boolean;
    firstLoginRequired: boolean;
  };
}

export type CreateUserApiResponse = EdgeFunctionResponse<CreateUserApiData>;

export function mapCreateUserFormToApiRequest(values: CreateUserFormValues): CreateUserApiRequest {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    displayName: values.displayName?.trim() || undefined,
    email: values.email.trim().toLowerCase(),
    phone: values.phone?.trim() || undefined,
    role: values.role,
    status: values.status,
    emailVerificationRequired: values.emailVerificationRequired,
    password: values.password,
    language: values.language,
    timezone: values.timezone,
    internalNotes: values.internalNotes?.trim() || undefined,
  };
}
