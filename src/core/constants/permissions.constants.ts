export const ENTERPRISE_PERMISSIONS = [
  'super_admin',
  'admin',
  'staff',
  'authenticated',
] as const;

export type EnterprisePermissionLevel = (typeof ENTERPRISE_PERMISSIONS)[number];

export const STAFF_ROLES = ['super_admin', 'admin', 'author', 'publisher'] as const;

export const ADMIN_ROLES = ['super_admin', 'admin'] as const;
