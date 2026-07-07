import type { SystemRole } from '../../types/roles';

export const ROLE_ASSIGNMENT_MESSAGES = {
  ASSIGNED_SUCCESS: 'Role assigned successfully.',
  REMOVED_SUCCESS: 'Role removed successfully.',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions.',
  ALREADY_ASSIGNED: 'Role already assigned.',
  NOT_ASSIGNED: 'Role not assigned.',
  READER_CANNOT_REMOVE: 'Reader cannot be removed.',
  LAST_SUPER_ADMIN: 'Cannot remove last active Super Admin.',
  UNEXPECTED_ERROR: 'Unexpected server error.',
  AUTHENTICATION_REQUIRED: 'Authentication required.',
} as const;

/** Roles that can be assigned by Platform Admin (admin). Reader is registration-only. */
export const PLATFORM_ADMIN_ASSIGNABLE_ROLES: SystemRole[] = ['author', 'publisher'];

/** Roles that can be assigned by Super Admin. Reader is registration-only. */
export const SUPER_ADMIN_ASSIGNABLE_ROLES: SystemRole[] = [
  'author',
  'publisher',
  'admin',
  'super_admin',
];

/** Roles removable by Platform Admin. */
export const PLATFORM_ADMIN_REMOVABLE_ROLES: SystemRole[] = ['author', 'publisher'];

/** Roles removable by Super Admin (reader excluded). */
export const SUPER_ADMIN_REMOVABLE_ROLES: SystemRole[] = [
  'author',
  'publisher',
  'admin',
  'super_admin',
];

export const PROTECTED_SYSTEM_ROLE: SystemRole = 'reader';
