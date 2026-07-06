import type { AuthRole } from '../types/roles.types';

const ROLE_DASHBOARD_PATHS: Record<AuthRole, string> = {
  reader: '/reader/library',
  author: '/author',
  publisher: '/publisher',
  admin: '/admin',
};

const ROLE_LOGIN_PATHS: Record<AuthRole, string> = {
  reader: '/auth/login',
  author: '/auth/login',
  publisher: '/auth/login',
  admin: '/auth/login',
};

export function getDashboardPathForAuthRole(role: AuthRole): string {
  return ROLE_DASHBOARD_PATHS[role];
}

export function getLoginPathForAuthRole(role: AuthRole): string {
  return ROLE_LOGIN_PATHS[role];
}

export function getPostLoginPath(role: AuthRole, returnTo?: string | null): string {
  if (returnTo && returnTo.startsWith('/')) {
    return returnTo;
  }

  return getDashboardPathForAuthRole(role);
}

export function roleAllowsPath(role: AuthRole, pathname: string): boolean {
  const prefixes: Record<AuthRole, string[]> = {
    reader: ['/reader'],
    author: ['/author'],
    publisher: ['/publisher'],
    admin: ['/admin', '/super'],
  };

  return prefixes[role].some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
