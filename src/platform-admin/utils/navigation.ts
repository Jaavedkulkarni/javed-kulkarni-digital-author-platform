import type { PlatformAdminDepartment } from '../types/department.types';
import { DEPARTMENT_LABELS } from '../types/department.types';
import { PLATFORM_ADMIN_BASE_PATH } from '../constants/platformAdmin.constants';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  department: PlatformAdminDepartment | 'common';
  permission?: string;
}

export const PLATFORM_ADMIN_NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: PLATFORM_ADMIN_BASE_PATH, department: 'common' },
  { id: 'content', label: 'Content', path: `${PLATFORM_ADMIN_BASE_PATH}/content`, department: 'content', permission: 'content:books:review' },
  { id: 'paperback', label: 'Paperback', path: `${PLATFORM_ADMIN_BASE_PATH}/paperback`, department: 'paperback', permission: 'paperback:requests' },
  { id: 'finance', label: 'Finance', path: `${PLATFORM_ADMIN_BASE_PATH}/finance`, department: 'finance', permission: 'finance:wallet' },
  { id: 'support', label: 'Support', path: `${PLATFORM_ADMIN_BASE_PATH}/support`, department: 'support', permission: 'support:tickets' },
  { id: 'marketing', label: 'Marketing', path: `${PLATFORM_ADMIN_BASE_PATH}/marketing`, department: 'marketing', permission: 'marketing:campaigns' },
  { id: 'author-services', label: 'Author Services', path: `${PLATFORM_ADMIN_BASE_PATH}/author-services`, department: 'author_services', permission: 'author_services:queue' },
  { id: 'legal', label: 'Legal', path: `${PLATFORM_ADMIN_BASE_PATH}/legal`, department: 'legal', permission: 'legal:copyright' },
];

export function getNavForDepartments(
  departments: PlatformAdminDepartment[],
  permissions: string[]
): NavItem[] {
  return PLATFORM_ADMIN_NAV.filter((item) => {
    if (item.department === 'common') return true;
    if (!departments.includes(item.department)) return false;
    if (item.permission) return permissions.includes(item.permission);
    return true;
  });
}

export function getDepartmentLabel(dept: PlatformAdminDepartment): string {
  return DEPARTMENT_LABELS[dept];
}
