import type { CreateUserFormValues } from './create-user.schema';

export type CreateUserStatus = 'active' | 'pending' | 'suspended';

export type PasswordStrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordStrengthResult {
  level: PasswordStrengthLevel;
  score: number;
  label: string;
  checks: {
    minLength: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export interface CreateUserRoleOption {
  value: string;
  label: string;
}

export type { CreateUserFormValues };
