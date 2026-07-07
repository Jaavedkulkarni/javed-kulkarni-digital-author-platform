/** Logical permission grouping aligned with AuthorOS role surfaces. */
export type PermissionGroup =
  | 'reader'
  | 'author'
  | 'platform_admin'
  | 'super_admin'
  | 'publisher';

/** Canonical permission action suffix. */
export type PermissionAction =
  | 'access'
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'publish'
  | 'export'
  | 'import'
  | 'upload'
  | 'manage';

/** Parsed module segment from a permission key. */
export type PermissionModule = 'reader' | 'author' | 'platform' | 'super' | 'publisher';

export function parsePermissionKey(key: string): {
  module: PermissionModule;
  resource: string;
  action: PermissionAction;
} {
  const parts = key.split('.');

  if (parts.length === 2) {
    return {
      module: parts[0] as PermissionModule,
      resource: parts[1],
      action: 'access',
    };
  }

  const action = parts[parts.length - 1] as PermissionAction;
  const module = parts[0] as PermissionModule;
  const resource = parts.slice(1, -1).join('.');

  return { module, resource, action };
}

export function toPermissionId(key: string): string {
  return key.replace(/\./g, '-');
}
