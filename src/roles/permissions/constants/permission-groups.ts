import type { PermissionGroup } from '../types/permission.types';
import { PERMISSION_GROUPS, PERMISSION_GROUP_LABELS } from './permission.constants';

export { PERMISSION_GROUPS, PERMISSION_GROUP_LABELS };

/** Maps registry permission groups to their display metadata. */
export const PERMISSION_GROUP_DEFINITIONS: Readonly<
  Record<PermissionGroup, { id: PermissionGroup; label: string; sortOrder: number }>
> = Object.freeze({
  reader: { id: 'reader', label: PERMISSION_GROUP_LABELS.reader, sortOrder: 100 },
  author: { id: 'author', label: PERMISSION_GROUP_LABELS.author, sortOrder: 200 },
  platform_admin: {
    id: 'platform_admin',
    label: PERMISSION_GROUP_LABELS.platform_admin,
    sortOrder: 300,
  },
  super_admin: {
    id: 'super_admin',
    label: PERMISSION_GROUP_LABELS.super_admin,
    sortOrder: 400,
  },
  publisher: { id: 'publisher', label: PERMISSION_GROUP_LABELS.publisher, sortOrder: 500 },
});

export function getPermissionGroupsOrdered(): readonly (typeof PERMISSION_GROUP_DEFINITIONS)[PermissionGroup][] {
  return PERMISSION_GROUPS.map((group) => PERMISSION_GROUP_DEFINITIONS[group]);
}
