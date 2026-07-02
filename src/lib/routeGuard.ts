import type { SystemRole } from '../types/roles';
import {
  canAccessAdminDashboard,
  canAccessAuthorDashboard,
  canAccessReaderDashboard,
  canAccessSuperAdminDashboard,
  canManageProducts,
  canManageSettings,
  canManageWebsite,
  isStaff,
} from './permissions';

export function canAccessRoute(pathname: string, roles: SystemRole[]): boolean {
  if (pathname.startsWith('/super')) {
    return canAccessSuperAdminDashboard(roles);
  }

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return true;
    return canAccessAdminDashboard(roles);
  }

  if (pathname.startsWith('/author')) {
    return canAccessAuthorDashboard(roles);
  }

  if (pathname.startsWith('/reader')) {
    const publicReaderPaths = [
      '/reader/sign-in',
      '/reader/sign-up',
      '/reader/forgot-password',
      '/reader/reset-password',
      '/reader/verify-email',
    ];
    if (publicReaderPaths.some((path) => pathname.startsWith(path))) return true;
    if (isStaff(roles) && !canAccessReaderDashboard(roles)) return false;
    return canAccessReaderDashboard(roles);
  }

  return true;
}

export function canAccessAdminView(view: string, roles: SystemRole[]): boolean {
  if (!canAccessAdminDashboard(roles)) return false;

  const productViews = ['products', 'product-create', 'product-edit', 'product-types', 'formats'];
  if (productViews.includes(view) && !canManageProducts(roles)) {
    return false;
  }

  return true;
}

export function canAccessSuperAdminSection(section: string, roles: SystemRole[]): boolean {
  if (!canAccessSuperAdminDashboard(roles)) return false;
  if (section === 'website' || section === 'settings') {
    return canManageWebsite(roles) || canManageSettings(roles);
  }
  return true;
}

export function getUnauthorizedRedirect(pathname: string): string {
  if (pathname.startsWith('/super')) return '/admin/login';
  if (pathname.startsWith('/admin')) return '/admin/login';
  if (pathname.startsWith('/author')) return '/admin/login';
  if (pathname.startsWith('/reader')) return '/reader/sign-in';
  return '/';
}
