import {
  getPlatformAdmins,
  getPlatformAdminActivities,
  createPlatformAdmin,
  updateDepartments,
  deactivatePlatformAdmin,
} from '../stores/platformAdminStore';
import type { PlatformAdminDepartment } from '../../platform-admin/types/department.types';
import type { SuperAdminOperationResult } from '../types/common';

export class PlatformAdminService {
  list() { return getPlatformAdmins(); }
  getActivity(adminId?: string) { return getPlatformAdminActivities(adminId); }
  create(input: { name: string; email: string; departments: PlatformAdminDepartment[] }): SuperAdminOperationResult {
    return { success: true, data: createPlatformAdmin(input) };
  }
  updateDepartments(id: string, departments: PlatformAdminDepartment[]): SuperAdminOperationResult {
    const r = updateDepartments(id, departments);
    return r ? { success: true, data: r } : { success: false, errors: ['Not found'] };
  }
  deactivate(id: string): SuperAdminOperationResult {
    const r = deactivatePlatformAdmin(id);
    return r ? { success: true, data: r } : { success: false, errors: ['Not found'] };
  }
}

export function createPlatformAdminService(): PlatformAdminService {
  return new PlatformAdminService();
}
