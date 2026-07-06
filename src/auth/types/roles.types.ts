export type AuthRole = 'reader' | 'author' | 'publisher' | 'admin';

export const AUTH_ROLES: readonly AuthRole[] = ['reader', 'author', 'publisher', 'admin'] as const;

export const DEFAULT_AUTH_ROLE: AuthRole = 'reader';

export const AUTH_ROLE_LABELS: Record<AuthRole, string> = {
  reader: 'Reader',
  author: 'Author',
  publisher: 'Publisher',
  admin: 'Admin',
};

export function isAuthRole(value: string): value is AuthRole {
  return (AUTH_ROLES as readonly string[]).includes(value);
}
