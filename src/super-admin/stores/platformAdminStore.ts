import type { PlatformAdminRecord, PlatformAdminActivity } from '../types/platformAdmin.types';
import type { PlatformAdminDepartment } from '../../platform-admin/types/department.types';
import { generateId } from '../utils/common';

const admins: PlatformAdminRecord[] = [
  { id: generateId('pa'), name: 'Content Lead', email: 'content@authoros.com', departments: ['content', 'marketing'], status: 'active', lastActiveAt: new Date().toISOString() },
  { id: generateId('pa'), name: 'Finance Ops', email: 'finance@authoros.com', departments: ['finance'], status: 'active', lastActiveAt: new Date().toISOString() },
];
const activities: PlatformAdminActivity[] = [
  { id: generateId('paa'), adminId: admins[0]?.id ?? '', action: 'Approved book review', createdAt: new Date().toISOString() },
];

export function getPlatformAdmins() { return admins; }
export function getPlatformAdminActivities(adminId?: string) {
  return adminId ? activities.filter((a) => a.adminId === adminId) : activities;
}

export function createPlatformAdmin(input: { name: string; email: string; departments: PlatformAdminDepartment[] }): PlatformAdminRecord {
  const admin: PlatformAdminRecord = {
    id: generateId('pa'),
    name: input.name,
    email: input.email,
    departments: input.departments,
    status: 'active',
    lastActiveAt: new Date().toISOString(),
  };
  admins.push(admin);
  return admin;
}

export function updateDepartments(id: string, departments: PlatformAdminDepartment[]): PlatformAdminRecord | null {
  const a = admins.find((x) => x.id === id);
  if (!a) return null;
  a.departments = departments;
  return a;
}

export function deactivatePlatformAdmin(id: string): PlatformAdminRecord | null {
  const a = admins.find((x) => x.id === id);
  if (!a) return null;
  a.status = 'deactivated';
  return a;
}
