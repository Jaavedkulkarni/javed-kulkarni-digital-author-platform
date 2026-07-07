import type { SystemRole } from '../../../types/roles';

export const PEOPLE_PERMISSIONS = {
  view: 'people.view',
  manage: 'people.manage',
  export: 'people.export',
  import: 'people.import',
} as const;

const SUPER_ADMIN_ROLES: SystemRole[] = ['super_admin'];

export function canViewPeople(roles: SystemRole[]): boolean {
  return roles.some((role) => SUPER_ADMIN_ROLES.includes(role));
}

export function canManagePeople(roles: SystemRole[]): boolean {
  return canViewPeople(roles);
}

export function assertPeopleViewPermission(roles: SystemRole[]): void {
  if (!canViewPeople(roles)) {
    throw new Error('Permission denied: people.view required');
  }
}
