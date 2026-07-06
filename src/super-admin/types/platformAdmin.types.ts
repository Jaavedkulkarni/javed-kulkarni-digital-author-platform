import type { PlatformAdminDepartment } from '../../platform-admin/types/department.types';

export interface PlatformAdminRecord {
  id: string;
  name: string;
  email: string;
  departments: PlatformAdminDepartment[];
  status: 'active' | 'deactivated';
  lastActiveAt: string;
}

export interface PlatformAdminActivity {
  id: string;
  adminId: string;
  action: string;
  createdAt: string;
}
