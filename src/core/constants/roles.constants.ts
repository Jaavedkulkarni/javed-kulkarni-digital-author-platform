export const CORE_ROLES = [
  'super_admin',
  'admin',
  'author',
  'publisher',
  'reader',
] as const;

export type CoreRoleName = (typeof CORE_ROLES)[number];

export const ROLE_HIERARCHY: Record<CoreRoleName, number> = {
  super_admin: 100,
  admin: 80,
  publisher: 60,
  author: 40,
  reader: 20,
};

export const SYSTEM_ROLE = 'system' as const;
