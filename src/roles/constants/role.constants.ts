import type { SystemRole } from '../../types/roles';

export const SYSTEM_ROLES: SystemRole[] = [
  'reader',
  'author',
  'publisher',
  'admin',
  'super_admin',
];

export const DEFAULT_SYSTEM_ROLE: SystemRole = 'reader';

export const SYSTEM_ROLE_LABELS: Record<SystemRole, string> = {
  reader: 'Reader',
  author: 'Author',
  publisher: 'Publisher',
  admin: 'Platform Admin',
  super_admin: 'Super Admin',
};

export const SYSTEM_ROLE_SLUGS: Record<SystemRole, string> = {
  reader: 'reader',
  author: 'author',
  publisher: 'publisher',
  admin: 'platform-admin',
  super_admin: 'super-admin',
};

export const ROLE_BADGE_STYLES: Record<SystemRole, string> = {
  reader: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
  author: 'border-violet-500/30 bg-violet-500/10 text-violet-200',
  publisher: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  admin: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  super_admin: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
};

export const ROLE_CHIP_STYLES: Record<SystemRole, string> = {
  reader: 'border-sky-500/20 bg-sky-950/40 text-sky-100',
  author: 'border-violet-500/20 bg-violet-950/40 text-violet-100',
  publisher: 'border-amber-500/20 bg-amber-950/40 text-amber-100',
  admin: 'border-emerald-500/20 bg-emerald-950/40 text-emerald-100',
  super_admin: 'border-rose-500/20 bg-rose-950/40 text-rose-100',
};

export const ROLE_PRIORITY: SystemRole[] = [
  'super_admin',
  'admin',
  'author',
  'publisher',
  'reader',
];
