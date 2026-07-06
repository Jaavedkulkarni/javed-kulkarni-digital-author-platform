import { getPermissionByKey } from './permissionRegistry';

export function resolveInheritedPermissions(permissionKey: string): string[] {
  const permission = getPermissionByKey(permissionKey);
  if (!permission) return [permissionKey];

  const inherited = permission.inheritsFrom ?? [];
  const resolved = new Set<string>([permissionKey]);
  for (const parent of inherited) {
    for (const p of resolveInheritedPermissions(parent)) {
      resolved.add(p);
    }
  }
  return [...resolved];
}

export function expandPermissionSet(keys: string[]): string[] {
  const expanded = new Set<string>();
  for (const key of keys) {
    for (const p of resolveInheritedPermissions(key)) {
      expanded.add(p);
    }
  }
  return [...expanded];
}
