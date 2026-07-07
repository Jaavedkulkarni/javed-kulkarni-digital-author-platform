import {
  ALL_PERMISSION_KEYS,
  PERMISSION_KEYS,
  PERMISSION_REGISTRY_VERSION,
} from '../constants/permission.constants';
import { definePermission } from '../types/permission-registry.types';
import type {
  PermissionDefinition,
  PermissionRegistry,
  RolePermissionMap,
} from '../types/permission-registry.types';
import type { PermissionGroup } from '../types/permission.types';

function humanizeSegment(segment: string): string {
  return segment
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function resolvePermissionGroup(key: string): PermissionGroup {
  if (key.startsWith('reader.')) return 'reader';
  if (key.startsWith('author.')) return 'author';
  if (key.startsWith('platform.')) return 'platform_admin';
  if (key.startsWith('super.')) return 'super_admin';
  return 'publisher';
}

function buildTitle(key: string): string {
  const parts = key.split('.');
  const action = parts.length === 2 ? 'Access' : humanizeSegment(parts[parts.length - 1]);
  const resource = parts.length === 2 ? humanizeSegment(parts[1]) : humanizeSegment(parts.slice(1, -1).join(' '));
  return `${resource} — ${action}`;
}

function buildDescription(key: string, group: PermissionGroup): string {
  return `AuthorOS ${group.replace(/_/g, ' ')} permission for ${key}.`;
}

function buildRegistryEntries(): Record<string, Readonly<PermissionDefinition>> {
  const entries: Record<string, Readonly<PermissionDefinition>> = {};

  for (const key of ALL_PERMISSION_KEYS) {
    const group = resolvePermissionGroup(key);
    entries[key] = definePermission({
      key,
      title: buildTitle(key),
      description: buildDescription(key, group),
      group,
    });
  }

  return entries;
}

const REGISTRY_ENTRIES = buildRegistryEntries();

/** Centralized immutable AuthorOS permission registry. */
export const PERMISSION_REGISTRY: PermissionRegistry = Object.freeze({
  version: PERMISSION_REGISTRY_VERSION,
  permissions: Object.freeze(REGISTRY_ENTRIES),
  keys: Object.freeze([...ALL_PERMISSION_KEYS]),
});

const READER_PERMISSIONS = ALL_PERMISSION_KEYS.filter((key) => key.startsWith('reader.'));
const AUTHOR_PERMISSIONS = ALL_PERMISSION_KEYS.filter((key) => key.startsWith('author.'));
const PLATFORM_PERMISSIONS = ALL_PERMISSION_KEYS.filter((key) => key.startsWith('platform.'));
const PUBLISHER_PERMISSIONS = ALL_PERMISSION_KEYS.filter((key) => key.startsWith('publisher.'));

/**
 * Immutable role-to-permission map.
 * Role inheritance is applied by PermissionResolver via the role registry.
 */
export const ROLE_PERMISSION_MAP: RolePermissionMap = Object.freeze({
  reader: Object.freeze([...READER_PERMISSIONS]),
  author: Object.freeze([...AUTHOR_PERMISSIONS]),
  admin: Object.freeze([...PLATFORM_PERMISSIONS]),
  super_admin: Object.freeze([...ALL_PERMISSION_KEYS]),
  publisher: Object.freeze([...PUBLISHER_PERMISSIONS]),
});

export const PERMISSION_REGISTRY_LIST: readonly Readonly<PermissionDefinition>[] = Object.freeze(
  PERMISSION_REGISTRY.keys.map((key) => PERMISSION_REGISTRY.permissions[key]),
);

export function getRegistryPermission(key: string): Readonly<PermissionDefinition> | undefined {
  return PERMISSION_REGISTRY.permissions[key];
}

export { PERMISSION_KEYS, ALL_PERMISSION_KEYS };
