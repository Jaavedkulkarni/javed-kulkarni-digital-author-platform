export type PlatformAdminDepartment =
  | 'content'
  | 'paperback'
  | 'finance'
  | 'support'
  | 'marketing'
  | 'author_services'
  | 'legal';

export interface DepartmentPermission {
  department: PlatformAdminDepartment;
  permissions: string[];
}

export interface PlatformAdminContext {
  adminId: string;
  profileId: string;
  displayName: string;
  departments: PlatformAdminDepartment[];
  permissions: string[];
}

export const DEPARTMENT_LABELS: Record<PlatformAdminDepartment, string> = {
  content: 'Content',
  paperback: 'Paperback',
  finance: 'Finance',
  support: 'Support',
  marketing: 'Marketing',
  author_services: 'Author Services',
  legal: 'Legal',
};
