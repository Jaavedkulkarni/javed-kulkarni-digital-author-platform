import type { PlatformAdminDepartment } from '../types/department.types';

export const PLATFORM_ADMIN_BASE_PATH = '/platform-admin';

export const DEPARTMENT_PERMISSIONS: Record<PlatformAdminDepartment, string[]> = {
  content: [
    'content:books:review',
    'content:blogs:review',
    'content:moderation',
    'content:copyright',
    'content:featured',
    'content:schedule',
  ],
  paperback: [
    'paperback:requests',
    'paperback:rfq',
    'paperback:quotes',
    'paperback:assign',
    'paperback:tracking',
    'paperback:proof',
  ],
  finance: [
    'finance:wallet',
    'finance:withdrawals',
    'finance:refunds',
    'finance:commissions',
    'finance:settlements',
    'finance:revenue',
  ],
  support: [
    'support:tickets',
    'support:assign',
    'support:notes',
    'support:resolve',
  ],
  marketing: [
    'marketing:campaigns',
    'marketing:coupons',
    'marketing:banners',
    'marketing:announcements',
    'marketing:email',
  ],
  author_services: [
    'author_services:queue',
    'author_services:assign',
    'author_services:status',
  ],
  legal: [
    'legal:copyright',
    'legal:dmca',
    'legal:contracts',
    'legal:violations',
    'legal:disputes',
  ],
};

export const FORBIDDEN_PLATFORM_ADMIN_ACTIONS = [
  'super_admin',
  'publisher_approval',
  'platform_settings',
  'user_role_management',
  'infrastructure',
  'feature_flags',
] as const;
